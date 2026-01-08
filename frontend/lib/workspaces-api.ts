import { api } from './api';

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  connections?: any[];
  _count?: {
    posts: number;
    connections: number;
  };
}

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  color?: string;
}

class WorkspacesApi {
  async list(): Promise<Workspace[]> {
    try {
      const response = await api.get('/api/workspaces');
      return response.data?.workspaces || [];
    } catch (error: any) {
      console.error('Erro ao listar workspaces:', error);
      if (error.response?.status === 401) {
        throw new Error('Não autenticado. Faça login novamente.');
      }
      throw new Error(error.response?.data?.error || error.message || 'Erro ao carregar workspaces');
    }
  }

  async getById(id: string): Promise<Workspace> {
    try {
      const response = await api.get(`/api/workspaces/${id}`);
      return response.data?.workspace;
    } catch (error: any) {
      console.error('Erro ao obter workspace:', error);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao obter workspace');
    }
  }

  async getDefault(): Promise<Workspace> {
    try {
      const response = await api.get('/api/workspaces/default');
      return response.data?.workspace;
    } catch (error: any) {
      console.error('Erro ao obter workspace padrão:', error);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao obter workspace padrão');
    }
  }

  async create(input: CreateWorkspaceInput): Promise<Workspace> {
    try {
      const response = await api.post('/api/workspaces', input);
      return response.data?.workspace;
    } catch (error: any) {
      console.error('Erro ao criar workspace:', error);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao criar workspace');
    }
  }

  async update(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
    try {
      const response = await api.put(`/api/workspaces/${id}`, input);
      return response.data?.workspace;
    } catch (error: any) {
      console.error('Erro ao atualizar workspace:', error);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao atualizar workspace');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/workspaces/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar workspace:', error);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao deletar workspace');
    }
  }
}

export const workspacesApi = new WorkspacesApi();

