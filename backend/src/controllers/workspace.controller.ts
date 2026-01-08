import { Request, Response } from 'express';
import { WorkspaceService } from '../services/workspace.service';

export class WorkspaceController {
  /**
   * GET /api/workspaces
   * Lista todos os workspaces do usuário
   */
  static async list(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const workspaces = await WorkspaceService.list(userId);

      res.json({
        success: true,
        workspaces,
      });
    } catch (error: any) {
      console.error('Erro ao listar workspaces:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar workspaces',
      });
    }
  }

  /**
   * GET /api/workspaces/:id
   * Obtém um workspace específico
   */
  static async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const { id } = req.params;
      const workspace = await WorkspaceService.getById(userId, id);

      res.json({
        success: true,
        workspace,
      });
    } catch (error: any) {
      console.error('Erro ao obter workspace:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Workspace não encontrado',
      });
    }
  }

  /**
   * POST /api/workspaces
   * Cria um novo workspace
   */
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const { name, description, color } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Nome do workspace é obrigatório',
        });
      }

      const workspace = await WorkspaceService.create(userId, {
        name: name.trim(),
        description: description?.trim(),
        color: color?.trim(),
      });

      res.status(201).json({
        success: true,
        workspace,
      });
    } catch (error: any) {
      console.error('Erro ao criar workspace:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao criar workspace',
      });
    }
  }

  /**
   * PUT /api/workspaces/:id
   * Atualiza um workspace
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const { id } = req.params;
      const { name, description, color } = req.body;

      const updateData: any = {};
      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          return res.status(400).json({
            success: false,
            error: 'Nome do workspace inválido',
          });
        }
        updateData.name = name.trim();
      }
      if (description !== undefined) {
        updateData.description = description?.trim();
      }
      if (color !== undefined) {
        updateData.color = color?.trim();
      }

      const workspace = await WorkspaceService.update(userId, id, updateData);

      res.json({
        success: true,
        workspace,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar workspace:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Erro ao atualizar workspace',
      });
    }
  }

  /**
   * DELETE /api/workspaces/:id
   * Deleta um workspace
   */
  static async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const { id } = req.params;
      await WorkspaceService.delete(userId, id);

      res.json({
        success: true,
        message: 'Workspace deletado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao deletar workspace:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Erro ao deletar workspace',
      });
    }
  }

  /**
   * GET /api/workspaces/default
   * Obtém ou cria o workspace padrão do usuário
   */
  static async getDefault(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const workspace = await WorkspaceService.getOrCreateDefault(userId);

      res.json({
        success: true,
        workspace,
      });
    } catch (error: any) {
      console.error('Erro ao obter workspace padrão:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao obter workspace padrão',
      });
    }
  }
}

