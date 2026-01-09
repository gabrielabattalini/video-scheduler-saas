import { Request, Response } from 'express';
import { YouTubeOAuthService } from '../services/youtube-oauth.service';
import { TikTokOAuthService } from '../services/tiktok-oauth.service';
import { InstagramOAuthService } from '../services/instagram-oauth.service';
import { KawaiOAuthService } from '../services/kawai-oauth.service';
import { TwitterOAuthService } from '../services/twitter-oauth.service';
import { WorkspaceService } from '../services/workspace.service';
import { prisma } from '../lib/prisma';

export class ConnectionController {
  /**
   * GET /api/connections
   * Lista todas as conexÃµes do usuÃ¡rio
   */
  static async list(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'NÃ£o autenticado' 
        });
      }

      // Filtrar por workspaceId se fornecido
      const workspaceId = req.query.workspaceId as string | undefined;
      const where: any = { userId };
      if (workspaceId) {
        where.workspaceId = workspaceId;
      }

      const connections = await prisma.platformConnection.findMany({
        where,
        include: {
          workspace: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ 
        success: true,
        connections: connections || [] 
      });
    } catch (error: any) {
      console.error('Erro ao listar conexÃµes:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro ao listar conexÃµes' 
      });
    }
  }

  /**
   * GET /api/connections/youtube/auth
   * Inicia o fluxo de autenticaÃ§Ã£o do YouTube
   */
  static async youtubeAuth(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'NÃ£o autenticado' 
        });
      }

      // Obter ou criar workspace padrÃ£o se nÃ£o fornecido
      const workspaceId = req.query.workspaceId as string | undefined;
      let finalWorkspaceId = workspaceId;
      
      if (!finalWorkspaceId) {
        const defaultWorkspace = await WorkspaceService.getOrCreateDefault(userId);
        finalWorkspaceId = defaultWorkspace.id;
      } else {
        // Verificar se o workspace pertence ao usuÃ¡rio
        await WorkspaceService.getById(userId, finalWorkspaceId);
      }

      console.log('Iniciando autenticaÃ§Ã£o YouTube para userId:', userId, 'workspaceId:', finalWorkspaceId);
      const authUrl = YouTubeOAuthService.getAuthUrl(userId, finalWorkspaceId);
      console.log('URL de autenticaÃ§Ã£o gerada:', authUrl.substring(0, 100) + '...');
      
      res.json({ 
        success: true, 
        data: { authUrl } 
      });
    } catch (error: any) {
      console.error('Erro ao iniciar autenticaÃ§Ã£o YouTube:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro ao iniciar autenticaÃ§Ã£o do YouTube' 
      });
    }
  }

  /**
   * GET /api/connections/youtube/callback
   * Callback do OAuth do YouTube
   */
  static async youtubeCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        console.error('Erro no callback do YouTube:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=${encodeURIComponent(error as string)}`);
      }

      if (!code) {
        console.error('CÃ³digo de autorizaÃ§Ã£o nÃ£o fornecido no callback do YouTube');
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=missing_code`);
      }

      // state deve conter o userId e workspaceId separados por ':'
      const stateData = (state as string).split(':');
      const userId = stateData[0];
      const workspaceId = stateData[1] || undefined;
      
      if (!userId) {
        console.error('State invÃ¡lido no callback do YouTube:', state);
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=invalid_state`);
      }

      console.log('Processando callback do YouTube para userId:', userId, 'workspaceId:', workspaceId);
      const { redirectUrl } = await YouTubeOAuthService.authenticateWithYouTube(userId, code as string, workspaceId);
      console.log('Redirecionando para:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Erro no callback do YouTube:', error);
      console.error('Stack trace:', error.stack);
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
      const errorMessage = error.message || 'Erro ao conectar com YouTube';
      res.redirect(`${frontendUrl}/connections?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  /**
   * DELETE /api/connections/youtube
   * Remove a conexÃ£o do YouTube
   */
  static async youtubeDisconnect(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'NÃ£o autenticado' });
      }

      await YouTubeOAuthService.disconnect(userId);
      res.json({ success: true, message: 'ConexÃ£o do YouTube removida com sucesso' });
    } catch (error: any) {
      console.error('Erro ao desconectar YouTube:', error);
      res.status(500).json({ error: error.message || 'Erro ao desconectar do YouTube' });
    }
  }

  /**
   * GET /api/connections/tiktok/auth
   * Inicia o fluxo de autenticaÃ§Ã£o do TikTok
   */
  static async tiktokAuth(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'NÃ£o autenticado' });
      }

      const authUrl = TikTokOAuthService.getAuthUrl(userId);
      res.json({ success: true, data: { authUrl } });
    } catch (error: any) {
      console.error('Erro ao iniciar autenticaÃ§Ã£o TikTok:', error);
      res.status(400).json({ error: error.message || 'Erro ao iniciar autenticaÃ§Ã£o TikTok' });
    }
  }

  /**
   * GET /api/connections/tiktok/callback
   * Callback do OAuth do TikTok
   */
  static async tiktokCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        return res.redirect(`${process.env.FRONTEND_URL || 'https://autoedito.com'}/connections?error=${encodeURIComponent(error as string)}`);
      }

      if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL || 'https://autoedito.com'}/connections?error=${encodeURIComponent('CÃ³digo de autorizaÃ§Ã£o nÃ£o fornecido')}`);
      }

      const userId = state as string;
      if (!userId) {
        return res.redirect(`${process.env.FRONTEND_URL || 'https://autoedito.com'}/connections?error=${encodeURIComponent('State invÃ¡lido')}`);
      }

      const { redirectUrl } = await TikTokOAuthService.authenticateWithTikTok(userId, code as string);
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Erro no callback TikTok:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
      res.redirect(`${frontendUrl}/connections?error=${encodeURIComponent(error.message || 'Erro ao conectar com TikTok')}`);
    }
  }

  /**
   * DELETE /api/connections/tiktok
   * Remove a conexÃ£o do TikTok
   */
  static async tiktokDisconnect(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'NÃ£o autenticado' });
      }

      await TikTokOAuthService.disconnect(userId);

      res.json({ success: true, message: 'TikTok desconectado com sucesso' });
    } catch (error: any) {
      console.error('Erro ao desconectar TikTok:', error);
      res.status(400).json({ error: error.message || 'Erro ao desconectar TikTok' });
    }
  }

  /**
   * GET /api/connections/instagram/auth
   * Inicia o fluxo de autenticaÃ§Ã£o do Instagram
   */
  /**
   * GET /api/connections/twitter/auth
   * Inicia o fluxo de autenticacao do X
   */
  static async twitterAuth(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Nao autenticado',
        });
      }

      const workspaceId = req.query.workspaceId as string | undefined;
      let finalWorkspaceId = workspaceId;

      if (!finalWorkspaceId) {
        const defaultWorkspace = await WorkspaceService.getOrCreateDefault(userId);
        finalWorkspaceId = defaultWorkspace.id;
      } else {
        await WorkspaceService.getById(userId, finalWorkspaceId);
      }

      const authUrl = TwitterOAuthService.getAuthUrl(userId, finalWorkspaceId);
      res.json({ success: true, data: { authUrl } });
    } catch (error: any) {
      console.error('Erro ao iniciar autenticacao do X:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao iniciar autenticacao do X',
      });
    }
  }

  /**
   * GET /api/connections/twitter/callback
   * Callback do OAuth do X
   */
  static async twitterCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(
          `${frontendUrl}/connections?error=${encodeURIComponent(error as string)}`,
        );
      }

      if (!code || !state) {
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=missing_code`);
      }

      const { redirectUrl } = await TwitterOAuthService.authenticateWithTwitter(
        code as string,
        state as string,
      );
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Erro no callback do X:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
      res.redirect(
        `${frontendUrl}/connections?error=${encodeURIComponent(
          error.message || 'Erro ao conectar com X',
        )}`,
      );
    }
  }

  /**
   * DELETE /api/connections/twitter
   * Remove a conexao do X
   */
  static async twitterDisconnect(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Nao autenticado' });
      }

      const workspaceId = req.query.workspaceId as string | undefined;
      await TwitterOAuthService.disconnect(userId, workspaceId);
      res.json({ success: true, message: 'X desconectado com sucesso' });
    } catch (error: any) {
      console.error('Erro ao desconectar X:', error);
      res.status(500).json({ error: error.message || 'Erro ao desconectar X' });
    }
  }

  static async instagramAuth(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'NÃ£o autenticado' });
      }

      const authUrl = InstagramOAuthService.getAuthUrl(userId);
      res.json({ success: true, data: { authUrl } });
    } catch (error: any) {
      console.error('Erro ao iniciar autenticaÃ§Ã£o Instagram:', error);
      res.status(500).json({ error: error.message || 'Erro ao iniciar autenticaÃ§Ã£o do Instagram' });
    }
  }

  /**
   * GET /api/connections/instagram/callback
   * Callback do OAuth do Instagram
   */
  static async instagramCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=${encodeURIComponent(error as string)}`);
      }

      if (!code) {
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=missing_code`);
      }

      // state deve conter o userId
      const userId = state as string;
      if (!userId) {
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=invalid_state`);
      }

      const { redirectUrl } = await InstagramOAuthService.authenticateWithInstagram(userId, code as string);
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Erro no callback do Instagram:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
      res.redirect(`${frontendUrl}/connections?error=${encodeURIComponent(error.message || 'Erro ao conectar com Instagram')}`);
    }
  }

  /**
   * DELETE /api/connections/instagram
   * Remove a conexÃ£o do Instagram
   */
  static async instagramDisconnect(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'NÃ£o autenticado' });
      }

      await InstagramOAuthService.disconnect(userId);
      res.json({ success: true, message: 'Instagram desconectado com sucesso' });
    } catch (error: any) {
      console.error('Erro ao desconectar Instagram:', error);
      res.status(500).json({ error: error.message || 'Erro ao desconectar do Instagram' });
    }
  }

  /**
   * GET /api/connections/kawai/auth
   * Inicia o fluxo de autenticaÃ§Ã£o do Kawai
   */
  static async kawaiAuth(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'NÃ£o autenticado' 
        });
      }

      const authUrl = KawaiOAuthService.getAuthUrl(userId);
      res.json({ success: true, data: { authUrl } });
    } catch (error: any) {
      console.error('Erro ao iniciar autenticaÃ§Ã£o Kawai:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro ao iniciar autenticaÃ§Ã£o do Kawai' 
      });
    }
  }

  /**
   * GET /api/connections/kawai/callback
   * Callback do OAuth do Kawai
   */
  static async kawaiCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        console.error('Erro no callback do Kawai:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=${encodeURIComponent(error as string)}`);
      }

      if (!code) {
        console.error('CÃ³digo de autorizaÃ§Ã£o nÃ£o fornecido no callback do Kawai');
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=missing_code`);
      }

      const userId = state as string;
      if (!userId) {
        console.error('State invÃ¡lido no callback do Kawai:', state);
        const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
        return res.redirect(`${frontendUrl}/connections?error=invalid_state`);
      }

      console.log('Processando callback do Kawai para userId:', userId);
      const { redirectUrl } = await KawaiOAuthService.authenticateWithKawai(userId, code as string);
      console.log('Redirecionando para:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Erro no callback do Kawai:', error);
      console.error('Stack trace:', error.stack);
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoedito.com';
      const errorMessage = error.message || 'Erro ao conectar com Kawai';
      res.redirect(`${frontendUrl}/connections?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  /**
   * DELETE /api/connections/kawai
   * Remove a conexÃ£o do Kawai
   */
  static async kawaiDisconnect(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'NÃ£o autenticado' });
      }

      await KawaiOAuthService.disconnect(userId);
      res.json({ success: true, message: 'ConexÃ£o do Kawai removida com sucesso' });
    } catch (error: any) {
      console.error('Erro ao desconectar Kawai:', error);
      res.status(500).json({ error: error.message || 'Erro ao desconectar do Kawai' });
    }
  }
}


