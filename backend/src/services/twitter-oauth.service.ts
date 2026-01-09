import { createHash, randomBytes } from 'crypto';
import { prisma } from '../lib/prisma';

const X_CLIENT_ID = process.env.X_CLIENT_ID;
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET;
const X_REDIRECT_URI =
  process.env.X_REDIRECT_URI || 'https://autoedito.com/api/connections/twitter/callback';
const X_SCOPES =
  process.env.X_SCOPES || 'tweet.read tweet.write users.read offline.access';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://autoedito.com';

const X_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const X_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const X_USER_URL = 'https://api.twitter.com/2/users/me?user.fields=profile_image_url';

const STATE_TTL_MS = 10 * 60 * 1000;

type OAuthState = {
  userId: string;
  workspaceId?: string;
  codeVerifier: string;
  createdAt: number;
};

const stateStore = new Map<string, OAuthState>();

function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function createCodeVerifier() {
  return base64UrlEncode(randomBytes(32));
}

function createCodeChallenge(codeVerifier: string) {
  return base64UrlEncode(createHash('sha256').update(codeVerifier).digest());
}

function pruneStateStore() {
  const now = Date.now();
  for (const [key, value] of stateStore.entries()) {
    if (now - value.createdAt > STATE_TTL_MS) {
      stateStore.delete(key);
    }
  }
}

export class TwitterOAuthService {
  static getAuthUrl(userId: string, workspaceId?: string): string {
    if (!X_CLIENT_ID) {
      throw new Error('Credenciais do X nao configuradas. Configure X_CLIENT_ID no .env');
    }

    pruneStateStore();
    const codeVerifier = createCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);
    const state = base64UrlEncode(randomBytes(16));

    stateStore.set(state, {
      userId,
      workspaceId,
      codeVerifier,
      createdAt: Date.now(),
    });

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: X_CLIENT_ID,
      redirect_uri: X_REDIRECT_URI,
      scope: X_SCOPES,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${X_AUTH_URL}?${params.toString()}`;
  }

  static async exchangeCodeForTokens(code: string, codeVerifier: string) {
    if (!X_CLIENT_ID) {
      throw new Error('Credenciais do X nao configuradas');
    }

    const params = new URLSearchParams({
      client_id: X_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: X_REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (X_CLIENT_SECRET) {
      headers.Authorization = `Basic ${Buffer.from(
        `${X_CLIENT_ID}:${X_CLIENT_SECRET}`,
      ).toString('base64')}`;
    }

    const response = await fetch(X_TOKEN_URL, {
      method: 'POST',
      headers,
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao trocar codigo por tokens: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as any;
    if (data.error) {
      throw new Error(data.error_description || data.error || 'Erro ao obter tokens do X');
    }

    return {
      access_token: data.access_token as string,
      refresh_token: data.refresh_token as string | undefined,
      expires_in: data.expires_in as number | undefined,
    };
  }

  static async getUserInfo(accessToken: string) {
    const response = await fetch(X_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao obter usuario do X: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as any;
    return data?.data;
  }

  static async authenticateWithTwitter(code: string, state: string) {
    const stored = stateStore.get(state);
    if (!stored) {
      throw new Error('Estado OAuth invalido ou expirado');
    }
    stateStore.delete(state);

    let finalWorkspaceId = stored.workspaceId;
    if (!finalWorkspaceId) {
      const existingWorkspace = await prisma.workspace.findFirst({
        where: { userId: stored.userId },
        orderBy: { createdAt: 'asc' },
      });

      if (existingWorkspace) {
        finalWorkspaceId = existingWorkspace.id;
      } else {
        const defaultWorkspace = await prisma.workspace.create({
          data: {
            userId: stored.userId,
            name: 'Workspace Principal',
            description: 'Workspace padrao',
            color: '#667eea',
          },
        });
        finalWorkspaceId = defaultWorkspace.id;
      }
    }

    const tokens = await this.exchangeCodeForTokens(code, stored.codeVerifier);
    const userInfo = await this.getUserInfo(tokens.access_token);
    const tokenExpiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null;

    const connection = await prisma.platformConnection.upsert({
      where: {
        userId_platform_workspaceId: {
          userId: stored.userId,
          platform: 'twitter',
          workspaceId: finalWorkspaceId,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        tokenExpiresAt,
        platformUserId: userInfo?.id,
        platformUsername: userInfo?.username,
        updatedAt: new Date(),
      },
      create: {
        userId: stored.userId,
        workspaceId: finalWorkspaceId,
        platform: 'twitter',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        tokenExpiresAt,
        platformUserId: userInfo?.id,
        platformUsername: userInfo?.username,
      },
    });

    const redirectUrl = `${FRONTEND_URL}/connections?connected=twitter&success=true`;
    return { connection, redirectUrl };
  }

  static async getConnection(userId: string, workspaceId?: string) {
    return prisma.platformConnection.findFirst({
      where: {
        userId,
        platform: 'twitter',
        workspaceId: workspaceId || null,
      },
    });
  }

  static async disconnect(userId: string, workspaceId?: string) {
    return prisma.platformConnection.deleteMany({
      where: {
        userId,
        platform: 'twitter',
        workspaceId: workspaceId || null,
      },
    });
  }
}
