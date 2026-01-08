import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || 'https://autoedito.com/api/connections/instagram/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://autoedito.com';

if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
  console.warn('âš ï¸ INSTAGRAM_APP_ID e INSTAGRAM_APP_SECRET nÃ£o configurados no .env');
}

// Scopes necessÃ¡rios para Instagram Graph API
const INSTAGRAM_SCOPES = [
  'instagram_basic',
  'instagram_content_publish',
  'pages_manage_posts',
  'pages_read_engagement',
  'pages_show_list',
];

export class InstagramOAuthService {
  /**
   * Gera a URL de autorizaÃ§Ã£o do Instagram/Facebook
   * O Instagram usa a API do Facebook, entÃ£o precisamos autenticar via Facebook
   */
  static getAuthUrl(state?: string): string {
    if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
      throw new Error('Credenciais do Instagram nÃ£o configuradas. Configure INSTAGRAM_APP_ID e INSTAGRAM_APP_SECRET no .env');
    }

    const params = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      scope: INSTAGRAM_SCOPES.join(','),
      response_type: 'code',
      state: state || '',
    });

    // Instagram usa a API do Facebook para OAuth
    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Troca o cÃ³digo de autorizaÃ§Ã£o por tokens de acesso
   */
  static async getTokensFromCode(code: string): Promise<{ access_token: string; expires_in?: number }> {
    if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
      throw new Error('Credenciais do Instagram nÃ£o configuradas');
    }

    // Primeiro, trocar cÃ³digo por access_token do Facebook
    const tokenParams = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      code: code,
    });

    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${tokenParams.toString()}`);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Erro ao obter access_token: ${tokenResponse.status} - ${errorText}`);
    }

    interface FacebookTokenResponse {
      access_token?: string;
      token_type?: string;
      expires_in?: number;
      error?: {
        message?: string;
        type?: string;
        code?: number;
        fbtrace_id?: string;
      };
    }

    const tokenData: FacebookTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      const errorMessage = tokenData.error?.message || 'Erro ao obter tokens do Instagram';
      throw new Error(errorMessage);
    }

    const shortLivedToken = tokenData.access_token;

    // Trocar short-lived token por long-lived token (vÃ¡lido por 60 dias)
    const longLivedParams = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      fb_exchange_token: shortLivedToken,
    });

    const longLivedResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${longLivedParams.toString()}`);

    if (!longLivedResponse.ok) {
      // Se falhar, usar o short-lived token
      console.warn('âš ï¸ NÃ£o foi possÃ­vel obter long-lived token, usando short-lived token');
      return {
        access_token: shortLivedToken,
        expires_in: tokenData.expires_in,
      };
    }

    const longLivedData = (await longLivedResponse.json()) as any;

    return {
      access_token: longLivedData.access_token || shortLivedToken,
      expires_in: longLivedData.expires_in || 5184000, // 60 dias em segundos
    };
  }

  /**
   * ObtÃ©m as pÃ¡ginas do Facebook do usuÃ¡rio (necessÃ¡rio para Instagram Business)
   */
  static async getFacebookPages(accessToken: string): Promise<Array<{ id: string; name: string; access_token: string }>> {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao obter pÃ¡ginas do Facebook: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as any;

      if (data.error) {
        throw new Error(data.error.message || 'Erro ao obter pÃ¡ginas do Facebook');
      }

      return data.data || [];
    } catch (error) {
      console.error('Erro ao obter pÃ¡ginas do Facebook:', error);
      throw error;
    }
  }

  /**
   * ObtÃ©m a conta do Instagram Business vinculada a uma pÃ¡gina do Facebook
   */
  static async getInstagramBusinessAccount(pageId: string, pageAccessToken: string): Promise<{ id: string; username: string } | null> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as any;

      if (data.error || !data.instagram_business_account) {
        return null;
      }

      const igAccount = data.instagram_business_account;

      // Obter username do Instagram
      const igInfoResponse = await fetch(
        `https://graph.facebook.com/v18.0/${igAccount.id}?fields=username&access_token=${pageAccessToken}`
      );

      if (!igInfoResponse.ok) {
        return {
          id: igAccount.id,
          username: 'instagram_account',
        };
      }

      const igInfo = (await igInfoResponse.json()) as any;

      return {
        id: igAccount.id,
        username: igInfo.username || 'instagram_account',
      };
    } catch (error) {
      console.error('Erro ao obter conta do Instagram Business:', error);
      return null;
    }
  }

  /**
   * ObtÃ©m informaÃ§Ãµes do usuÃ¡rio e conta do Instagram
   */
  static async getUserInfo(accessToken: string): Promise<{ id: string; name?: string; email?: string; instagramAccount?: { id: string; username: string }; pageAccessToken?: string; pageId?: string }> {
    try {
      // Obter informaÃ§Ãµes do usuÃ¡rio do Facebook
      const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`);

      if (!userResponse.ok) {
        throw new Error('Erro ao obter informaÃ§Ãµes do usuÃ¡rio');
      }

      const userData = (await userResponse.json()) as any;

      if (userData.error) {
        throw new Error(userData.error.message || 'Erro ao obter informaÃ§Ãµes do usuÃ¡rio');
      }

      // Tentar obter conta do Instagram Business
      let instagramAccount: { id: string; username: string } | null = null;
      let pageAccessToken: string | null = null;
      let pageId: string | null = null;

      try {
        const pages = await this.getFacebookPages(accessToken);
        
        if (!pages || pages.length === 0) {
          console.warn('âš ï¸ Nenhuma pÃ¡gina do Facebook encontrada para o usuÃ¡rio');
        } else {
          for (const page of pages) {
            try {
              const igAccount = await this.getInstagramBusinessAccount(page.id, page.access_token);
              if (igAccount) {
                instagramAccount = igAccount;
                pageAccessToken = page.access_token;
                pageId = page.id;
                break; // Usar a primeira conta do Instagram encontrada
              }
            } catch (error) {
              console.warn(`âš ï¸ Erro ao verificar pÃ¡gina ${page.id}:`, error);
              // Continuar tentando outras pÃ¡ginas
            }
          }
        }
      } catch (error) {
        console.error('Erro ao obter pÃ¡ginas do Facebook:', error);
        // NÃ£o falhar completamente, apenas logar o erro
      }

      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        instagramAccount: instagramAccount || undefined,
        pageAccessToken: pageAccessToken || undefined,
        pageId: pageId || undefined,
      };
    } catch (error) {
      console.error('Erro ao obter informaÃ§Ãµes do usuÃ¡rio:', error);
      throw error;
    }
  }

  /**
   * Autentica o usuÃ¡rio com Instagram e salva/atualiza a conexÃ£o
   */
  static async authenticateWithInstagram(userId: string, code: string, workspaceId?: string): Promise<{ connection: any; redirectUrl: string }> {
    try {
      // 0. Garantir que temos um workspaceId vÃ¡lido
      let finalWorkspaceId = workspaceId;
      if (!finalWorkspaceId) {
        const existingWorkspace = await prisma.workspace.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });
        
        if (existingWorkspace) {
          finalWorkspaceId = existingWorkspace.id;
        } else {
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

      // 1. Obter tokens
      const tokens = await this.getTokensFromCode(code);

      // 2. Obter informaÃ§Ãµes do usuÃ¡rio e conta do Instagram
      const userInfo = await this.getUserInfo(tokens.access_token);

      if (!userInfo.instagramAccount) {
        throw new Error('Nenhuma conta do Instagram Business encontrada. Certifique-se de que sua conta do Instagram estÃ¡ vinculada a uma PÃ¡gina do Facebook.');
      }

      // 3. Calcular data de expiraÃ§Ã£o
      const tokenExpiresAt = tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null;

      // 4. Salvar ou atualizar conexÃ£o
      // Usar pageAccessToken se disponÃ­vel, senÃ£o usar o accessToken do usuÃ¡rio
      const finalAccessToken = userInfo.pageAccessToken || tokens.access_token;

      const connection = await prisma.platformConnection.upsert({
        where: {
          userId_platform_workspaceId: {
            userId: userId,
            platform: 'instagram',
            workspaceId: finalWorkspaceId,
          },
        },
        update: {
          accessToken: finalAccessToken,
          tokenExpiresAt: tokenExpiresAt,
          platformUserId: userInfo.instagramAccount.id,
          platformUsername: userInfo.instagramAccount.username,
          platformEmail: userInfo.email,
          metadata: {
            facebookUserId: userInfo.id,
            facebookName: userInfo.name,
            pageAccessToken: userInfo.pageAccessToken,
            pageId: userInfo.pageId,
            userAccessToken: tokens.access_token, // Guardar tambÃ©m o token do usuÃ¡rio
          },
          updatedAt: new Date(),
        },
        create: {
          userId: userId,
          workspaceId: finalWorkspaceId,
          platform: 'instagram',
          accessToken: finalAccessToken,
          tokenExpiresAt: tokenExpiresAt,
          platformUserId: userInfo.instagramAccount.id,
          platformUsername: userInfo.instagramAccount.username,
          platformEmail: userInfo.email,
          metadata: {
            facebookUserId: userInfo.id,
            facebookName: userInfo.name,
            pageAccessToken: userInfo.pageAccessToken,
            pageId: userInfo.pageId,
            userAccessToken: tokens.access_token, // Guardar tambÃ©m o token do usuÃ¡rio
          },
        },
      });

      // 5. Retornar URL de redirecionamento
      const redirectUrl = `${FRONTEND_URL}/connections?connected=instagram&success=true`;

      return { connection, redirectUrl };
    } catch (error: any) {
      console.error('Erro ao autenticar com Instagram:', error);
      throw new Error(error.message || 'Erro ao conectar com Instagram');
    }
  }

  /**
   * ObtÃ©m a conexÃ£o do Instagram do usuÃ¡rio
   */
  static async getConnection(userId: string, workspaceId?: string) {
    return await prisma.platformConnection.findFirst({
      where: {
        userId: userId,
        platform: 'instagram',
        workspaceId: workspaceId || null,
      },
    });
  }

  /**
   * Remove a conexÃ£o do Instagram do usuÃ¡rio
   */
  static async disconnect(userId: string, workspaceId?: string) {
    return await prisma.platformConnection.deleteMany({
      where: {
        userId: userId,
        platform: 'instagram',
        workspaceId: workspaceId || null,
      },
    });
  }
}


