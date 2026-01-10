import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';
import { AuthService } from './auth.service';
import { PlanService } from './plan.service';

// Inicializar cliente OAuth2 apenas se as credenciais estiverem disponÃ­veis
let client: OAuth2Client | null = null;

function getOAuthClient(): OAuth2Client {
  if (!client) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://autoedito.com/api/auth/google/callback';

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
    }

    client = new OAuth2Client(clientId, clientSecret, redirectUri);
  }
  return client;
}

export class GoogleOAuthService {
  /**
   * Gera URL de autorizaÃ§Ã£o do Google
   */
  static getAuthUrl(): string {
    try {
      console.log('Gerando URL de autorizaÃ§Ã£o do Google...');
      const oauthClient = getOAuthClient();
      
      const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ];

      const authUrl = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
      });

      console.log('URL de autorizaÃ§Ã£o gerada:', authUrl.substring(0, 100) + '...');
      return authUrl;
    } catch (error: any) {
      console.error('Erro ao gerar URL de autorizaÃ§Ã£o do Google:', error);
      throw new Error(`Erro ao gerar URL de autorizaÃ§Ã£o do Google: ${error.message}`);
    }
  }

  /**
   * Troca cÃ³digo de autorizaÃ§Ã£o por tokens
   */
  static async getTokensFromCode(code: string) {
    try {
      const oauthClient = getOAuthClient();
      const { tokens } = await oauthClient.getToken(code);
      oauthClient.setCredentials(tokens);
      return tokens;
    } catch (error: any) {
      throw new Error(`Erro ao trocar cÃ³digo por tokens: ${error.message}`);
    }
  }

  /**
   * ObtÃ©m informaÃ§Ãµes do usuÃ¡rio do Google
   */
  static async getUserInfo(accessToken: string) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar informaÃ§Ãµes do usuÃ¡rio: ${response.status} - ${errorText}`);
      }

      return response.json() as Promise<{
        id: string;
        email: string;
        verified_email: boolean;
        name: string;
        picture: string;
        given_name: string;
        family_name: string;
      }>;
    } catch (error: any) {
      throw new Error(`Erro ao buscar informaÃ§Ãµes do usuÃ¡rio: ${error.message}`);
    }
  }

  /**
   * Faz login ou registro com Google OAuth
   */
  static async authenticateWithGoogle(code: string) {
    try {
      console.log('Iniciando autenticaÃ§Ã£o com Google...');
      
      // 1. Trocar cÃ³digo por tokens
      console.log('Trocando cÃ³digo por tokens...');
      const tokens = await this.getTokensFromCode(code);

      if (!tokens.access_token) {
        throw new Error('NÃ£o foi possÃ­vel obter access token do Google');
      }

      console.log('Tokens obtidos com sucesso');

      // 2. Buscar informaÃ§Ãµes do usuÃ¡rio
      console.log('Buscando informaÃ§Ãµes do usuÃ¡rio...');
      const googleUser = await this.getUserInfo(tokens.access_token);
      console.log('InformaÃ§Ãµes do usuÃ¡rio obtidas:', {
        email: googleUser.email,
        name: googleUser.name,
        verified: googleUser.verified_email
      });

      if (!googleUser.verified_email) {
        throw new Error('Email do Google nÃ£o verificado');
      }

      // 3. Verificar se usuÃ¡rio jÃ¡ existe
      console.log('Verificando se usuÃ¡rio jÃ¡ existe...');
      let user = await prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (user) {
        // UsuÃ¡rio existe - fazer login
        // Se nÃ£o tem providerId, atualizar para incluir
        if (!user.providerId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              providerId: googleUser.id,
              provider: 'google',
              avatarUrl: googleUser.picture,
              emailVerified: true,
            },
          });
        } else if (user.provider && user.provider !== 'google') {
          // UsuÃ¡rio existe mas com outro provider
          throw new Error('Email jÃ¡ cadastrado com outro mÃ©todo de login');
        }
      } else {
        // UsuÃ¡rio nÃ£o existe - criar novo
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            provider: 'google',
            providerId: googleUser.id,
            avatarUrl: googleUser.picture,
            emailVerified: true,
            // Senha nÃ£o Ã© necessÃ¡ria para OAuth
            password: null,
          },
        });
      }

      // 4. Gerar tokens JWT
      console.log('Gerando tokens JWT...');
      const accessToken = AuthService.generateAccessToken(user.id, user.email);
      const refreshToken = AuthService.generateRefreshToken(user.id);

      await PlanService.ensureSupportForUser(user.id, user.email);

      console.log('AutenticaÃ§Ã£o com Google concluÃ­da com sucesso');

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl || null,
          createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.error('Erro ao autenticar com Google:', error);
      console.error('Stack trace:', error.stack);
      throw new Error(`Erro ao autenticar com Google: ${error.message}`);
    }
  }
}


