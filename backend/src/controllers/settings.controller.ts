import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { PlanService } from '../services/plan.service';

export class SettingsController {
  /**
   * GET /api/settings/preferences
   * Busca as preferências do usuário
   */
  static async getPreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      // Por enquanto retorna um objeto vazio, pode ser expandido com campos JSON no User
      res.json({
        success: true,
        data: {
          preferences: {},
        },
      });
    } catch (error: any) {
      console.error('Erro ao buscar preferências:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar preferências',
      });
    }
  }

  /**
   * PATCH /api/settings/preferences
   * Atualiza as preferências do usuário
   */
  static async updatePreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const preferences = req.body;

      // Por enquanto apenas retorna sucesso
      // Pode ser expandido para salvar em um campo JSON no User ou em uma tabela separada
      res.json({
        success: true,
        message: 'Preferências atualizadas com sucesso',
        data: {
          preferences,
        },
      });
    } catch (error: any) {
      console.error('Erro ao atualizar preferências:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao atualizar preferências',
      });
    }
  }

  /**
   * POST /api/settings/subscription
   * Atualiza a assinatura do usuário
   */
  static async updateSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const { plan, status } = req.body;
      const targetPlan = plan || 'free';

      const subscription = await PlanService.setUserSubscription(
        userId,
        targetPlan,
        status || 'active'
      );

      res.json({
        success: true,
        message: 'Assinatura atualizada com sucesso',
        data: subscription,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar assinatura:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao atualizar assinatura',
      });
    }
  }
}

