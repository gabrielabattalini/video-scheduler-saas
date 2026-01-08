import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const TIKTOK_REDIRECT_URI =
  process.env.TIKTOK_REDIRECT_URI || 'https://autoedito.com/api/connections/tiktok/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://autoedito.com';

if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
  console.warn('âš ï¸ TIKTOK_CLIENT_KEY e TIKTOK_CLIENT_SECRET nÃ£o configurados no .env');
}

export class TikTokOAuthService {
  /**
   * Gera a URL de autorizaÃ§Ã£o do TikTok
   */
  static getAuthUrl(state?: string): string {
    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
      throw new Error(
        'Credenciais do TikTok nÃ£o configuradas. Configure TIKTOK_CLIENT_KEY e TIKTOK_CLIENT_SECRET no .env',
      );
    }

    const params = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      response_type: 'code',
      scope: 'user.info.basic,video.upload,video.list',
      redirect_uri: TIKTOK_REDIRECT_URI,
      state: state || '',
    });

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  /**
   * Troca o cÃ³digo de autorizaÃ§Ã£o por tokens
   */
  static async getTokensFromCode(
    code: string,
  ): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
      throw new Error('Credenciais do TikTok nÃ£o configuradas');
    }

    const params = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: TIKTOK_REDIRECT_URI,
    });

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
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
      throw new Error(data.error_description || data.error || 'Erro ao obter tokens do TikTok');
    }

    return {
      access_token: data?.data?.access_token ?? data?.access_token,
      refresh_token: data?.data?.refresh_token ?? data?.refresh_token,
      expires_in: data?.data?.expires_in ?? data?.expires_in,
    };
  }

  /**
   * ObtÃ©m informaÃ§Ãµes do usuÃ¡rio do TikTok
   */
  static async getUserInfo(
    accessToken: string,
  ): Promise<{ open_id: string; display_name?: string; email?: string }> {
    const response = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,email',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) {
      throw new Error('Erro ao obter informaÃ§Ãµes do usuÃ¡rio do TikTok');
    }

    const data = await response.json();
    return data.data.user;
  }

  /**
   * Autentica o usuÃ¡rio com TikTok e salva/atualiza a conexÃ£o
   */
  static async authenticateWithTikTok(
    userId: string,
    code: string,
    workspaceId?: string,
  ): Promise<{ connection: any; redirectUrl: string }> {
    // Garantir workspace
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

    // 2. Obter informaÃ§Ãµes do usuÃ¡rio
    const userInfo = await this.getUserInfo(tokens.access_token);

    // 3. Calcular expiraÃ§Ã£o
    const tokenExpiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

    // 4. Salvar ou atualizar conexÃ£o
    const connection = await prisma.platformConnection.upsert({
      where: {
        userId_platform_workspaceId: {
          userId,
          platform: 'tiktok',
          workspaceId: finalWorkspaceId,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        tokenExpiresAt,
        platformUserId: userInfo.open_id,
        platformUsername: userInfo.display_name,
        platformEmail: userInfo.email,
        updatedAt: new Date(),
      },
      create: {
        userId,
        workspaceId: finalWorkspaceId,
        platform: 'tiktok',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        tokenExpiresAt,
        platformUserId: userInfo.open_id,
        platformUsername: userInfo.display_name,
        platformEmail: userInfo.email,
      },
    });

    const redirectUrl = `${FRONTEND_URL}/connections?connected=tiktok&success=true`;
    return { connection, redirectUrl };
  }

  static async getConnection(userId: string, workspaceId?: string) {
    return prisma.platformConnection.findFirst({
      where: {
        userId,
        platform: 'tiktok',
        workspaceId: workspaceId || null,
      },
    });
  }

  static async disconnect(userId: string, workspaceId?: string) {
    return prisma.platformConnection.deleteMany({
      where: {
        userId,
        platform: 'tiktok',
        workspaceId: workspaceId || null,
      },
    });
  }
}

