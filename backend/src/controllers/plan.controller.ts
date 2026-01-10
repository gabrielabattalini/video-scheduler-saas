import { Request, Response } from 'express';
import { PlanService } from '../services/plan.service';

const defaultGrantEmails = ['gabrielabattalini@gmail.com'];

export class PlanController {
  static async list(_req: Request, res: Response) {
    try {
      const plans = await PlanService.list();
      res.json({ success: true, data: plans });
    } catch (error: any) {
      console.error('Erro ao listar planos:', error);
      res.status(500).json({ success: false, error: error.message || 'Erro ao listar planos' });
    }
  }

  static async grantSupport(req: Request, res: Response) {
    try {
      const requesterEmail = req.user?.email;
      const targetEmail = (req.body?.email || requesterEmail || '').toLowerCase();
      const allowList = (process.env.SUPPORT_GRANT_EMAILS || '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
      const effectiveAllowList = allowList.length ? allowList : defaultGrantEmails;

      if (!requesterEmail || !effectiveAllowList.includes(requesterEmail.toLowerCase())) {
        return res.status(403).json({ success: false, error: 'Sem permissão para conceder plano de suporte' });
      }

      if (!targetEmail) {
        return res.status(400).json({ success: false, error: 'Email não informado' });
      }

      const subscription = await PlanService.grantSupportByEmail(targetEmail);
      res.json({ success: true, data: subscription });
    } catch (error: any) {
      console.error('Erro ao conceder plano suporte:', error);
      res.status(500).json({ success: false, error: error.message || 'Erro ao conceder plano suporte' });
    }
  }
}
