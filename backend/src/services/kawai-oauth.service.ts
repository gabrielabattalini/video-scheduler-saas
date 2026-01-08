import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const KAWAII_CLIENT_ID = process.env.KAWAII_CLIENT_ID;
const KAWAII_CLIENT_SECRET = process.env.KAWAII_CLIENT_SECRET;
const KAWAII_REDIRECT_URI =
  process.env.KAWAII_REDIRECT_URI || 'https://autoedito.com/api/connections/kawai/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://autoedito.com';

if (!KAWAII_CLIENT_ID || !KAWAII_CLIENT_SECRET) {
  console.warn('âš ï¸ KAWAII_CLIENT_ID e KAWAII_CLIENT_SECRET nÃ£o configurados no .env');
}

export class KawaiOAuthService {
  /**
   * Gera a URL de autorizaÃ§Ã£o do Kawai
   */
  static getAuthUrl(userId: string): string {
    if (!KAWAII_CLIENT_ID || !KAWAII_CLIENT_SECRET) {
      throw new Error('Credenciais do Kawai nÃ£o configuradas. Configure KAWAII_CLIENT_ID e KAWAII_CLIENT_SECRET no .env');
    }

    const params = new URLSearchParams({
      client_id: KAWAII_CLIENT_ID,
      response_type: 'code',
      redirect_uri: KAWAII_REDIRECT_URI,
      state: userId,
      scope: 'read write',
    });

    return `https://api.kawai.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Troca o cÃ³digo de autorizaÃ§Ã£o por tokens
   */
  static async getTokensFromCode(
    code: string,
  ): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
    if (!KAWAII_CLIENT_ID || !KAWAII_CLIENT_SECRET) {
      throw new Error('Credenciais do Kawai nÃ£o configuradas');
    }

    const params = new URLSearchParams({
      client_id: KAWAII_CLIENT_ID,
      client_secret: KAWAII_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: KAWAII_REDIRECT_URI,
    });

    const response = await fetch('https://api.kawai.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao trocar cÃ³digo por tokens: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error_description || data.error || 'Erro ao obter tokens do Kawai');
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    };
  }

  /**
   * ObtÃ©m informaÃ§Ãµes do usuÃ¡rio do Kawai
   */
  static async getUserInfo(
    accessToken: string,
  ): Promise<{ id: string; username?: string; email?: string; name?: string }> {
    const response = await fetch('https://api.kawai.com/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter informaÃ§Ãµes do usuÃ¡rio do Kawai');
    }

    const data = await response.json();

    return {
      id: data.id || data.user_id,
      username: data.username || data.user_name,
      email: data.email,
      name: data.name || data.display_name,
    };
  }

  /**
   * Autentica com Kawai e salva a conexÃ£o
   */
  static async authenticateWithKawai(userId: string, code: string): Promise<{ redirectUrl: string }> {
    // 1. Obter tokens
    const tokens = await this.getTokensFromCode(code);

    // 2. Obter informaÃ§Ãµes do usuÃ¡rio
    const userInfo = await this.getUserInfo(tokens.access_token);

    // 3. Calcular expiraÃ§Ã£o
    const tokenExpiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

    // 4. Verificar se jÃ¡ existe conexÃ£o
    const existingConnection = await prisma.platformConnection.findFirst({
      where: { userId, platform: 'kawai' },
    });

    if (existingConnection) {
      await prisma.platformConnection.update({
        where: { id: existingConnection.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || existingConnection.refreshToken,
          tokenExpiresAt,
          platformUserId: userInfo.id,
          platformUsername: userInfo.username,
          platformEmail: userInfo.email,
          metadata: { ...(existingConnection.metadata as object), name: userInfo.name },
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.platformConnection.create({
        data: {
          userId,
          platform: 'kawai',
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt,
          platformUserId: userInfo.id,
          platformUsername: userInfo.username,
          platformEmail: userInfo.email,
          metadata: { name: userInfo.name },
        },
      });
    }

    return { redirectUrl: `${FRONTEND_URL}/connections?success=kawai_connected` };
  }

  /**
   * Remove a conexÃ£o do Kawai
   */
  static async disconnect(userId: string): Promise<void> {
    await prisma.platformConnection.deleteMany({
      where: { userId, platform: 'kawai' },
    });
  }

  /**
   * ObtÃ©m a conexÃ£o do Kawai para um usuÃ¡rio
   */
  static async getConnection(userId: string) {
    return prisma.platformConnection.findFirst({
      where: { userId, platform: 'kawai' },
    });
  }
}

