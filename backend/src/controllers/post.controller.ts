import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { PostService } from '../services/post.service';
import { InstagramPublishService } from '../services/instagram-publish.service';
import { StorageService } from '../services/storage.service';
import type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema';

export class PostController {
  static async list(req: Request, res: Response) {
    try {
      const posts = await PostService.list(req.user!.userId);
      res.json({ success: true, data: { posts } });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data: CreatePostInput = req.body;
      const post = await PostService.create(req.user!.userId, data);
      res.status(201).json({ success: true, data: { post } });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostService.get(id, req.user!.userId);
      
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post não encontrado' });
      }
      
      res.json({ success: true, data: { post } });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdatePostInput = req.body;
      
      const post = await PostService.update(id, req.user!.userId, data);
      
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post não encontrado' });
      }
      
      res.json({ success: true, data: { post } });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const post = await prisma.post.findUnique({ where: { id } });
      
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post não encontrado' });
      }
      
      if (post.userId !== req.user!.userId) {
        return res.status(403).json({ success: false, error: 'Não autorizado' });
      }
      
      await PostService.delete(id, req.user!.userId);
      
      res.json({ success: true, message: 'Post deletado com sucesso' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * POST /api/posts/:id/publish/instagram
   * Publica um post no Instagram
   */
  static async publishToInstagram(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Buscar o post
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return res.status(404).json({ success: false, error: 'Post não encontrado' });
      }

      if (post.userId !== userId) {
        return res.status(403).json({ success: false, error: 'Não autorizado' });
      }

      // Verificar se o post tem mídia (vídeo ou imagem)
      if (!post.videoUrl && !post.thumbnailUrl) {
        return res.status(400).json({ success: false, error: 'Post precisa ter um vídeo ou imagem para publicar no Instagram' });
      }

      // Determinar URL da mídia e tipo
      const mediaUrl = post.videoUrl || post.thumbnailUrl!;
      const isVideo = !!post.videoUrl;
      const caption = post.description || post.title;

      // Se a URL for uma chave do S3, obter URL assinada
      let finalMediaUrl = mediaUrl;
      if (post.videoKey || post.thumbnailKey) {
        const key = post.videoKey || post.thumbnailKey!;
        finalMediaUrl = await StorageService.getSignedUrl(key);
      }

      // Publicar no Instagram
      const result = await InstagramPublishService.publishPost(
        userId,
        finalMediaUrl,
        caption,
        isVideo
      );

      // Atualizar status do post
      await prisma.post.update({
        where: { id },
        data: {
          status: 'published',
          metadata: {
            ...(post.metadata as object || {}),
            instagram: {
              postId: result.postId,
              instagramAccountId: result.instagramAccountId,
              publishedAt: new Date().toISOString(),
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Post publicado no Instagram com sucesso',
        data: {
          instagramPostId: result.postId,
        },
      });
    } catch (error: any) {
      console.error('Erro ao publicar no Instagram:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao publicar no Instagram',
      });
    }
  }
}

