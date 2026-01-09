import { api } from './api';

export interface PlatformConnection {
  id: string;
  userId: string;
  workspaceId?: string | null;
  platform: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  platformUserId?: string;
  platformUsername?: string;
  platformEmail?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  workspace?: {
    id: string;
    name: string;
    color?: string;
  };
}

class ConnectionsApi {
  async list(workspaceId?: string): Promise<PlatformConnection[]> {
    try {
      // Sempre buscar todas as conexões (sem filtro) para poder verificar em outros workspaces
      const response = await api.get('/api/connections');
      // Backend retorna { connections: [...] } ou { data: { connections: [...] } }
      const allConnections = response.data?.connections || response.data?.data?.connections || response.data?.data || [];
      const connections = Array.isArray(allConnections) ? allConnections : [];
      
      // Se workspaceId foi fornecido, filtrar apenas esse workspace
      if (workspaceId) {
        return connections.filter((c: PlatformConnection) => c.workspaceId === workspaceId);
      }
      
      console.log('Conexões carregadas:', connections);
      return connections;
    } catch (error: any) {
      console.error('Erro ao listar conexões:', error);
      if (error.response?.status === 401) {
        throw new Error('Não autenticado. Faça login novamente.');
      }
      throw new Error(error.response?.data?.error || error.message || 'Erro ao carregar conexões');
    }
  }

  async connect(platform: string, workspaceId?: string): Promise<{ redirectUrl: string }> {
    try {
      // Mapear plataformas para suas rotas específicas
      const platformRoutes: Record<string, string> = {
        youtube: 'youtube',
        tiktok: 'tiktok',
        instagram: 'instagram',
        twitter: 'twitter',
        kawai: 'kawai',
      };

      const route = platformRoutes[platform.toLowerCase()];
      if (!route) {
        throw new Error(`Plataforma ${platform} não suportada`);
      }

      console.log(`Iniciando conexão com ${platform}...`);
      const url = workspaceId 
        ? `/api/connections/${route}/auth?workspaceId=${workspaceId}`
        : `/api/connections/${route}/auth`;
      console.log(`Chamando: ${url}`);

      const response = await api.get(url);

      console.log('Resposta do backend:', response.data);

      // Backend retorna { success: true, data: { authUrl } }
      const authUrl = response.data?.data?.authUrl || response.data?.authUrl;
      if (!authUrl) {
        console.error('Resposta inesperada:', response.data);
        throw new Error('URL de autenticação não retornada pelo servidor');
      }

      console.log('URL de autenticação obtida:', authUrl.substring(0, 100) + '...');
      return { redirectUrl: authUrl };
    } catch (error: any) {
      console.error('Erro ao conectar:', error);
      if (error.response?.status === 401) {
        throw new Error('Não autenticado. Faça login novamente.');
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Erro ao conectar com a plataforma. Verifique sua conexão e tente novamente.');
    }
  }

  async disconnect(platform: string): Promise<void> {
    // Mapear plataformas para suas rotas específicas
    const platformRoutes: Record<string, string> = {
      youtube: 'youtube',
      tiktok: 'tiktok',
      instagram: 'instagram',
      twitter: 'twitter',
      kawai: 'kawai',
    };

    const route = platformRoutes[platform.toLowerCase()];
    if (!route) {
      throw new Error(`Plataforma ${platform} não suportada`);
    }

    await api.delete(`/api/connections/${route}`);
  }

  async getConnection(platform: string): Promise<PlatformConnection | null> {
    try {
      const connections = await this.list();
      return connections.find((c) => c.platform === platform) || null;
    } catch (error) {
      return null;
    }
  }
}

export const connectionsApi = new ConnectionsApi();
