import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { GoogleOAuthService } from '../services/google-oauth.service';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { prisma } from '../lib/prisma';

export class AuthController {
  /**
   * Retorna URL de autorizaÃ§Ã£o do Google
   */
  static async googleAuth(req: Request, res: Response) {
    try {
      console.log('SolicitaÃ§Ã£o de autenticaÃ§Ã£o Google recebida');
      const authUrl = GoogleOAuthService.getAuthUrl();
      res.json({
        success: true,
        data: {
          authUrl,
        },
      });
    } catch (error: any) {
      console.error('Erro ao gerar URL de autorizaÃ§Ã£o do Google:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao gerar URL de autorizaÃ§Ã£o',
      });
    }
  }

  /**
   * Callback do Google OAuth
   */
  static async googleCallback(req: Request, res: Response) {
    try {
      const { code, error: oauthError } = req.query;

      if (oauthError) {
        console.error('Erro no OAuth do Google:', oauthError);
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        const errorUrl = new URL('/login', frontendUrl);
        errorUrl.searchParams.set('error', `Erro de autorizaÃ§Ã£o: ${oauthError}`);
        return res.redirect(errorUrl.toString());
      }

      if (!code || typeof code !== 'string') {
        console.error('CÃ³digo de autorizaÃ§Ã£o nÃ£o fornecido');
        return res.status(400).json({
          success: false,
          error: 'CÃ³digo de autorizaÃ§Ã£o nÃ£o fornecido',
        });
      }

      console.log('Callback do Google recebido, cÃ³digo presente');
      const result = await GoogleOAuthService.authenticateWithGoogle(code);
      console.log('AutenticaÃ§Ã£o concluÃ­da, redirecionando...');

      // Redirecionar para frontend com tokens
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
      const redirectUrl = new URL('/auth/callback', frontendUrl);
      redirectUrl.searchParams.set('accessToken', result.accessToken);
      redirectUrl.searchParams.set('refreshToken', result.refreshToken);
      redirectUrl.searchParams.set('user', JSON.stringify(result.user));

      console.log('Redirecionando para:', redirectUrl.toString());
      res.redirect(redirectUrl.toString());
    } catch (error: any) {
      console.error('Erro no callback do Google:', error);
      console.error('Stack trace:', error.stack);
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
      const errorUrl = new URL('/login', frontendUrl);
      errorUrl.searchParams.set('error', error.message || 'Erro ao autenticar com Google');
      res.redirect(errorUrl.toString());
    }
  }
  static async register(req: Request, res: Response) {
    try {
      const data: RegisterInput = req.body;
      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        message: 'UsuÃ¡rio cadastrado com sucesso',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao cadastrar usuÃ¡rio',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data: LoginInput = req.body;
      const result = await AuthService.login(data);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message || 'Erro ao fazer login',
      });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token nÃ£o fornecido',
        });
      }

      const result = await AuthService.refreshAccessToken(refreshToken);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message || 'Erro ao atualizar token',
      });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'UsuÃ¡rio nÃ£o autenticado',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'UsuÃ¡rio nÃ£o encontrado',
        });
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar dados do usuÃ¡rio',
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { name } = req.body as { name?: string };

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
      }

      const updated = await AuthService.updateProfile(userId, { name });

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: { user: updated },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar perfil',
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'Senhas não fornecidas' });
      }

      await AuthService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Senha atualizada com sucesso',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao alterar senha',
      });
    }
  }

  static async deleteAccount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
      }

      await AuthService.deleteAccount(userId);

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao excluir conta',
      });
    }
  }
}
