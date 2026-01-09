import { prisma } from '../lib/prisma';

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

export class WorkspaceService {
  /**
   * Cria um novo workspace
   */
  static async create(userId: string, input: CreateWorkspaceInput) {
    return await prisma.workspace.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        color: input.color,
      },
    });
  }

  /**
   * Lista todos os workspaces do usuário
   */
  static async list(userId: string) {
    return await prisma.workspace.findMany({
      where: { userId },
      include: {
        connections: {
          select: {
            id: true,
            platform: true,
            platformUsername: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            posts: true,
            connections: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtém um workspace específico
   */
  static async getById(userId: string, workspaceId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        userId, // Garante que o workspace pertence ao usuário
      },
      include: {
        connections: true,
        _count: {
          select: {
            posts: true,
            connections: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new Error('Workspace não encontrado');
    }

    return workspace;
  }

  /**
   * Atualiza um workspace
   */
  static async update(userId: string, workspaceId: string, input: UpdateWorkspaceInput) {
    // Verificar se o workspace pertence ao usuário
    const workspace = await this.getById(userId, workspaceId);

    return await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
      },
    });
  }

  /**
   * Deleta um workspace
   */
  static async delete(userId: string, workspaceId: string) {
    // Verificar se o workspace pertence ao usuário
    await this.getById(userId, workspaceId);

    const workspaceCount = await prisma.workspace.count({
      where: { userId },
    });

    if (workspaceCount <= 1) {
      throw new Error('Nao e possivel deletar o ultimo workspace. Crie outro antes.');
    }

    return await prisma.workspace.delete({
      where: { id: workspaceId },
    });
  }

  /**
   * Obtém o workspace padrão do usuário (primeiro workspace criado)
   * Cria um workspace padrão se não existir nenhum
   */
  static async getOrCreateDefault(userId: string) {
    const workspaces = await this.list(userId);

    if (workspaces.length > 0) {
      return workspaces[0];
    }

    // Criar workspace padrão
    return await this.create(userId, {
      name: 'Workspace Principal',
      description: 'Workspace padrão',
      color: '#667eea',
    });
  }
}

