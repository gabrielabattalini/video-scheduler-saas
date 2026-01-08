import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || 'https://autoedito.com/api/connections/youtube/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://autoedito.com';

if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET) {
  console.warn('âš ï¸ YOUTUBE_CLIENT_ID e YOUTUBE_CLIENT_SECRET nÃ£o configurados no .env');
}

const youtubeScopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export class YouTubeOAuthService {
  /**
   * Gera a URL de autorizaÃ§Ã£o do YouTube
   */
  static getAuthUrl(userId: string, workspaceId?: string): string {
    if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET) {
      throw new Error('Credenciais do YouTube nÃ£o configuradas. Configure YOUTUBE_CLIENT_ID e YOUTUBE_CLIENT_SECRET no .env');
    }

    // Construir state com userId e workspaceId separados por ':'
    const state = workspaceId ? `${userId}:${workspaceId}` : userId;

    const oauth2Client = new OAuth2Client(YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI);

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: youtubeScopes,
      prompt: 'consent', // ForÃ§a o consentimento para obter refresh_token
      state: state,
    });

    return authUrl;
  }

  /**
   * Troca o cÃ³digo de autorizaÃ§Ã£o por tokens
   */
  static async getTokensFromCode(code: string): Promise<{ access_token: string; refresh_token?: string; expiry_date?: number }> {
    if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET) {
      throw new Error('Credenciais do YouTube nÃ£o configuradas');
    }

    try {
      const oauth2Client = new OAuth2Client(YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI);

      const { tokens } = await oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new Error('NÃ£o foi possÃ­vel obter o access_token do YouTube');
      }

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
      };
    } catch (error: any) {
      console.error('Erro ao trocar cÃ³digo por tokens do YouTube:', error);
      if (error.response) {
        console.error('Resposta do erro:', error.response.data);
      }
      throw new Error(error.message || 'Erro ao obter tokens do YouTube');
    }
  }

  /**
   * ObtÃ©m informaÃ§Ãµes do canal do YouTube do usuÃ¡rio
   */
  static async getChannelInfo(accessToken: string): Promise<{ id: string; title: string; email?: string }> {
    try {
      // Obter informaÃ§Ãµes do canal
      const youtubeResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!youtubeResponse.ok) {
        const errorText = await youtubeResponse.text();
        console.error('Erro na resposta da API do YouTube:', errorText);
        throw new Error(`Erro ao obter informaÃ§Ãµes do canal do YouTube: ${youtubeResponse.status}`);
      }

      const youtubeData = (await youtubeResponse.json()) as any;
      
      if (youtubeData.error) {
        throw new Error(youtubeData.error.message || 'Erro ao obter informaÃ§Ãµes do canal');
      }

      const channel = youtubeData.items?.[0];

      if (!channel) {
        throw new Error('Canal do YouTube nÃ£o encontrado. Certifique-se de que vocÃª tem um canal no YouTube.');
      }

      // Obter email do usuÃ¡rio
      let email: string | undefined;
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (userInfoResponse.ok) {
          const userInfo = (await userInfoResponse.json()) as any;
          email = userInfo.email;
        }
      } catch (error) {
        console.warn('âš ï¸ NÃ£o foi possÃ­vel obter email do usuÃ¡rio:', error);
        // NÃ£o falhar se nÃ£o conseguir obter o email
      }

      return {
        id: channel.id,
        title: channel.snippet.title,
        email: email,
      };
    } catch (error: any) {
      console.error('Erro ao obter informaÃ§Ãµes do canal:', error);
      throw new Error(error.message || 'Erro ao obter informaÃ§Ãµes do canal do YouTube');
    }
  }

  /**
   * Autentica o usuÃ¡rio com YouTube e salva/atualiza a conexÃ£o
   */
  static async authenticateWithYouTube(userId: string, code: string, workspaceId?: string): Promise<{ connection: any; redirectUrl: string }> {
    try {
      console.log('Iniciando autenticaÃ§Ã£o YouTube para userId:', userId);
      
      // 0. Garantir que temos um workspaceId vÃ¡lido
      let finalWorkspaceId: string = workspaceId || '';
      
      if (!finalWorkspaceId || finalWorkspaceId.trim() === '') {
        // Buscar primeiro workspace do usuÃ¡rio ou criar um padrÃ£o
        const existingWorkspace = await prisma.workspace.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });
        
        if (existingWorkspace && existingWorkspace.id) {
          finalWorkspaceId = existingWorkspace.id;
        } else {
          // Criar workspace padrÃ£o
          const defaultWorkspace = await prisma.workspace.create({
            data: {
              userId,
              name: 'Workspace Principal',
              description: 'Workspace padrÃ£o',
              color: '#667eea',
            },
          });
          finalWorkspaceId = defaultWorkspace.id;
        }
      }
      
      // ValidaÃ§Ã£o final - garantir que temos um workspaceId vÃ¡lido
      if (!finalWorkspaceId || finalWorkspaceId.trim() === '') {
        throw new Error('NÃ£o foi possÃ­vel obter ou criar um workspace vÃ¡lido');
      }
      
      console.log('WorkspaceId final:', finalWorkspaceId);
      
      // 1. Obter tokens
      console.log('Obtendo tokens do YouTube...');
      const tokens = await this.getTokensFromCode(code);
      console.log('Tokens obtidos com sucesso. Access token presente:', !!tokens.access_token);
      console.log('Refresh token presente:', !!tokens.refresh_token);

      // 2. Obter informaÃ§Ãµes do canal
      console.log('Obtendo informaÃ§Ãµes do canal...');
      const channelInfo = await this.getChannelInfo(tokens.access_token);
      console.log('InformaÃ§Ãµes do canal obtidas:', {
        id: channelInfo.id,
        title: channelInfo.title,
        email: channelInfo.email ? 'presente' : 'nÃ£o disponÃ­vel'
      });

      // 3. Calcular data de expiraÃ§Ã£o
      const tokenExpiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;
      console.log('Token expira em:', tokenExpiresAt);

      // 4. Salvar ou atualizar conexÃ£o
      console.log('Salvando/atualizando conexÃ£o no banco de dados...');
      console.log('Usando workspaceId:', finalWorkspaceId);
      
      // O Ã­ndice Ãºnico Ã© [userId, platform, workspaceId] - workspaceId nÃ£o pode ser null
      // Garantir que finalWorkspaceId nÃ£o Ã© null ou undefined
      if (!finalWorkspaceId) {
        throw new Error('workspaceId Ã© obrigatÃ³rio para criar conexÃ£o');
      }
      
      const connection = await prisma.platformConnection.upsert({
        where: {
          userId_platform_workspaceId: {
            userId: userId,
            platform: 'youtube',
            workspaceId: finalWorkspaceId,
          },
        },
        update: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || undefined,
          tokenExpiresAt: tokenExpiresAt,
          platformUserId: channelInfo.id,
          platformUsername: channelInfo.title,
          platformEmail: channelInfo.email,
          updatedAt: new Date(),
        },
        create: {
          userId: userId,
          workspaceId: finalWorkspaceId, // Garantido que nÃ£o Ã© null
          platform: 'youtube',
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || undefined,
          tokenExpiresAt: tokenExpiresAt,
          platformUserId: channelInfo.id,
          platformUsername: channelInfo.title,
          platformEmail: channelInfo.email,
        },
      });

      console.log('ConexÃ£o salva com sucesso. ID:', connection.id);

      // 5. Retornar URL de redirecionamento
      const redirectUrl = `${FRONTEND_URL}/connections?connected=youtube&success=true`;
      console.log('Redirecionando para:', redirectUrl);

      return { connection, redirectUrl };
    } catch (error: any) {
      console.error('Erro ao autenticar com YouTube:', error);
      console.error('Stack trace:', error.stack);
      throw new Error(error.message || 'Erro ao conectar com YouTube');
    }
  }

  /**
   * ObtÃ©m a conexÃ£o do YouTube do usuÃ¡rio
   */
  static async getConnection(userId: string, workspaceId?: string) {
    const where: any = {
      userId: userId,
      platform: 'youtube',
    };
    
    if (workspaceId) {
      where.workspaceId = workspaceId;
    }
    
    return await prisma.platformConnection.findFirst({
      where,
    });
  }

  /**
   * Remove a conexÃ£o do YouTube do usuÃ¡rio
   */
  static async disconnect(userId: string, workspaceId?: string) {
    const where: any = {
      userId: userId,
      platform: 'youtube',
    };
    
    if (workspaceId) {
      where.workspaceId = workspaceId;
    }
    
    return await prisma.platformConnection.deleteMany({
      where,
    });
  }

  /**
   * Lista todas as conexÃµes do usuÃ¡rio
   */
  static async getUserConnections(userId: string) {
    return await prisma.platformConnection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}


