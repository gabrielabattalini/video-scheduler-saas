import { InstagramOAuthService } from './instagram-oauth.service';
import { StorageService } from './storage.service';

// Interfaces para as respostas da API do Facebook
interface FacebookError {
  error: {
    message: string;
    type: string;
    code: number;
  };
}

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

interface FacebookPagesResponse {
  data?: FacebookPage[];
  error?: FacebookError['error'];
}

interface FacebookPageInfo {
  instagram_business_account?: {
    id: string;
  };
  error?: FacebookError['error'];
}

interface FacebookMediaContainerResponse {
  id?: string;
  error?: FacebookError['error'];
}

interface FacebookMediaStatusResponse {
  status_code?: 'IN_PROGRESS' | 'FINISHED' | 'ERROR';
  error?: FacebookError['error'];
}

interface FacebookPublishResponse {
  id?: string;
  error?: FacebookError['error'];
}

export class InstagramPublishService {
  /**
   * Obtém o access token válido da conexão do Instagram
   */
  static async getValidAccessToken(userId: string): Promise<string> {
    const connection = await InstagramOAuthService.getConnection(userId);

    if (!connection) {
      throw new Error('Instagram não conectado. Conecte sua conta do Instagram primeiro.');
    }

    // Verificar se o token expirou (com margem de 5 minutos)
    if (connection.tokenExpiresAt) {
      const expiresAt = new Date(connection.tokenExpiresAt);
      const now = new Date();
      const margin = 5 * 60 * 1000; // 5 minutos

      if (expiresAt.getTime() - now.getTime() < margin) {
        throw new Error('Token do Instagram expirado. Reconecte sua conta do Instagram.');
      }
    }

    return connection.accessToken;
  }

  /**
   * Obtém o ID da conta do Instagram Business e o page access token
   */
  static async getInstagramBusinessAccountId(userId: string): Promise<{ instagramAccountId: string; pageAccessToken: string }> {
    try {
      const connection = await InstagramOAuthService.getConnection(userId);

      if (!connection) {
        throw new Error('Instagram não conectado. Conecte sua conta do Instagram primeiro.');
      }

      if (!connection.platformUserId) {
        throw new Error('ID da conta do Instagram não encontrado. Reconecte sua conta.');
      }

      // Tentar obter do metadata primeiro (mais eficiente)
      const metadata = connection.metadata as any;
      if (metadata?.pageAccessToken) {
        return {
          instagramAccountId: connection.platformUserId,
          pageAccessToken: metadata.pageAccessToken,
        };
      }

      // Se não tiver pageAccessToken no metadata, usar o accessToken armazenado
      // (que já deve ser o pageAccessToken se foi salvo corretamente)
      if (connection.accessToken) {
        // Verificar se o token ainda é válido tentando obter informações da conta
        try {
          const testResponse = await fetch(
            `https://graph.facebook.com/v18.0/${connection.platformUserId}?fields=username&access_token=${connection.accessToken}`
          );

          if (testResponse.ok) {
            return {
              instagramAccountId: connection.platformUserId,
              pageAccessToken: connection.accessToken,
            };
          }
        } catch (error) {
          console.warn('⚠️ Token pode estar expirado, tentando obter novo token');
        }
      }

      // Fallback: obter das páginas do Facebook usando o userAccessToken do metadata
      const userAccessToken = metadata?.userAccessToken || connection.accessToken;
      if (!userAccessToken) {
        throw new Error('Token de acesso não encontrado. Reconecte sua conta do Instagram.');
      }

      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${userAccessToken}`
      );

      if (!pagesResponse.ok) {
        throw new Error('Erro ao obter páginas do Facebook. Reconecte sua conta do Instagram.');
      }

      const pagesData = (await pagesResponse.json()) as FacebookPagesResponse;

      if (pagesData?.error) {
        throw new Error(pagesData.error?.message || 'Erro ao obter páginas do Facebook');
      }

      const pages = Array.isArray(pagesData?.data) ? pagesData.data : [];

      // Para cada página, verificar se tem conta do Instagram Business
      for (const page of pages) {
        try {
          const pageInfoResponse = await fetch(
            `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
          );

          if (pageInfoResponse.ok) {
            const pageInfo = (await pageInfoResponse.json()) as FacebookPageInfo;
            if (pageInfo.instagram_business_account?.id === connection.platformUserId) {
              return {
                instagramAccountId: connection.platformUserId,
                pageAccessToken: page.access_token,
              };
            }
          }
        } catch (error) {
          console.warn(`⚠️ Erro ao verificar página ${page.id}:`, error);
        }
      }

      // Se chegou aqui, usar o accessToken armazenado mesmo sem validação
      if (connection.accessToken) {
        return {
          instagramAccountId: connection.platformUserId,
          pageAccessToken: connection.accessToken,
        };
      }

      throw new Error('Nenhuma conta do Instagram Business encontrada. Reconecte sua conta.');
    } catch (error: any) {
      console.error('Erro ao obter ID da conta do Instagram:', error);
      throw new Error(error.message || 'Erro ao obter conta do Instagram Business');
    }
  }

  /**
   * Cria um container de mídia (imagem ou vídeo) no Instagram
   */
  static async createMediaContainer(
    instagramAccountId: string,
    accessToken: string,
    mediaUrl: string,
    caption: string,
    mediaType: 'IMAGE' | 'VIDEO' = 'IMAGE'
  ): Promise<string> {
    try {
      const params: Record<string, string> = {
        access_token: accessToken,
        caption: caption,
      };

      if (mediaType === 'IMAGE') {
        params.image_url = mediaUrl;
      } else {
        params.media_type = 'VIDEO';
        params.video_url = mediaUrl;
      }

      const url = `https://graph.facebook.com/v18.0/${instagramAccountId}/media?${new URLSearchParams(params).toString()}`;

      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = (await response.json()) as FacebookError | FacebookMediaContainerResponse;
        throw new Error('error' in errorData && errorData.error ? errorData.error.message : 'Erro ao criar container de mídia');
      }

      const data = (await response.json()) as FacebookMediaContainerResponse;

      if (data.error) {
        throw new Error(data.error.message || 'Erro ao criar container de mídia');
      }

      if (!data.id) {
        throw new Error('ID do container não retornado');
      }

      return data.id; // ID do container criado
    } catch (error: any) {
      console.error('Erro ao criar container de mídia:', error);
      throw new Error(error.message || 'Erro ao criar container de mídia no Instagram');
    }
  }

  /**
   * Publica um container de mídia no Instagram
   */
  static async publishMedia(instagramAccountId: string, accessToken: string, creationId: string): Promise<string> {
    try {
      const params = new URLSearchParams({
        access_token: accessToken,
        creation_id: creationId,
      });

      const url = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = (await response.json()) as FacebookError | FacebookPublishResponse;
        throw new Error('error' in errorData && errorData.error ? errorData.error.message : 'Erro ao publicar mídia');
      }

      const data = (await response.json()) as FacebookPublishResponse;

      if (data.error) {
        throw new Error(data.error.message || 'Erro ao publicar mídia');
      }

      if (!data.id) {
        throw new Error('ID do post não retornado');
      }

      return data.id; // ID do post publicado
    } catch (error: any) {
      console.error('Erro ao publicar mídia:', error);
      throw new Error(error.message || 'Erro ao publicar mídia no Instagram');
    }
  }

  /**
   * Verifica o status de um container de mídia (para vídeos)
   */
  static async checkMediaStatus(creationId: string, accessToken: string): Promise<'IN_PROGRESS' | 'FINISHED' | 'ERROR'> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${creationId}?fields=status_code&access_token=${accessToken}`
      );

      if (!response.ok) {
        return 'ERROR';
      }

      const data = (await response.json()) as FacebookMediaStatusResponse;

      if (data.error) {
        return 'ERROR';
      }

      if (data.status_code === 'FINISHED') {
        return 'FINISHED';
      } else if (data.status_code === 'IN_PROGRESS') {
        return 'IN_PROGRESS';
      }

      return 'ERROR';
    } catch (error) {
      console.error('Erro ao verificar status da mídia:', error);
      return 'ERROR';
    }
  }

  /**
   * Publica uma imagem no Instagram
   */
  static async publishImage(
    userId: string,
    imageUrl: string,
    caption: string
  ): Promise<{ postId: string; instagramAccountId: string }> {
    try {
      // 1. Obter ID da conta do Instagram Business e page access token
      const { instagramAccountId, pageAccessToken } = await this.getInstagramBusinessAccountId(userId);

      // 2. Criar container de mídia
      const creationId = await this.createMediaContainer(instagramAccountId, pageAccessToken, imageUrl, caption, 'IMAGE');

      // 3. Publicar mídia
      const postId = await this.publishMedia(instagramAccountId, pageAccessToken, creationId);

      return {
        postId,
        instagramAccountId,
      };
    } catch (error: any) {
      console.error('Erro ao publicar imagem no Instagram:', error);
      throw error;
    }
  }

  /**
   * Publica um vídeo no Instagram
   * Nota: Vídeos requerem processamento assíncrono
   */
  static async publishVideo(
    userId: string,
    videoUrl: string,
    caption: string
  ): Promise<{ postId: string; instagramAccountId: string }> {
    try {
      // 1. Obter ID da conta do Instagram Business e page access token
      const { instagramAccountId, pageAccessToken } = await this.getInstagramBusinessAccountId(userId);

      // 2. Criar container de mídia (vídeo)
      const creationId = await this.createMediaContainer(instagramAccountId, pageAccessToken, videoUrl, caption, 'VIDEO');

      // 3. Aguardar processamento do vídeo (pode levar alguns minutos)
      let status = await this.checkMediaStatus(creationId, pageAccessToken);
      let attempts = 0;
      const maxAttempts = 60; // 5 minutos (5 segundos * 60)

      while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Aguardar 5 segundos
        status = await this.checkMediaStatus(creationId, pageAccessToken);
        attempts++;
      }

      if (status !== 'FINISHED') {
        throw new Error('Erro ao processar vídeo no Instagram. Tente novamente mais tarde.');
      }

      // 4. Publicar mídia
      const postId = await this.publishMedia(instagramAccountId, pageAccessToken, creationId);

      return {
        postId,
        instagramAccountId,
      };
    } catch (error: any) {
      console.error('Erro ao publicar vídeo no Instagram:', error);
      throw error;
    }
  }

  /**
   * Publica um post no Instagram (imagem ou vídeo)
   */
  static async publishPost(
    userId: string,
    mediaUrl: string,
    caption: string,
    isVideo: boolean = false
  ): Promise<{ postId: string; instagramAccountId: string }> {
    if (isVideo) {
      return await this.publishVideo(userId, mediaUrl, caption);
    } else {
      return await this.publishImage(userId, mediaUrl, caption);
    }
  }
}

