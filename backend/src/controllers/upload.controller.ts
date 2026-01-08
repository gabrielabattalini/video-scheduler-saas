import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service.js';
import { VideoService } from '../services/video.service.js';

export class UploadController {
  static async uploadVideo(req: Request, res: Response) {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum arquivo enviado',
        });
      }

      const validation = StorageService.validateFile(file);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }

      console.log('📤 Fazendo upload do vídeo...');
      const videoKey = await StorageService.uploadFile(file);

      console.log('🖼️  Gerando thumbnail...');
      let thumbnailKey = null;
      try {
        const thumbnail = await VideoService.generateThumbnail(file.buffer);
        if (thumbnail) {
          thumbnailKey = await StorageService.uploadThumbnail(thumbnail, videoKey);
        }
      } catch (error) {
        console.error('⚠️  Erro ao gerar thumbnail:', error);
      }

      const videoUrl = await StorageService.getSignedUrl(videoKey);
      const thumbnailUrl = thumbnailKey 
        ? await StorageService.getSignedUrl(thumbnailKey)
        : null;

      res.json({
        success: true,
        message: 'Vídeo enviado com sucesso',
        data: {
          videoKey,
          videoUrl,
          thumbnailKey,
          thumbnailUrl,
          metadata: {
            size: file.size,
            originalName: file.originalname,
          },
        },
      });
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao fazer upload do vídeo',
        details: error.message,
      });
    }
  }

  static async getVideoUrl(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const url = await StorageService.getSignedUrl(key);
      res.json({ success: true, data: { url } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Erro ao gerar URL do vídeo' });
    }
  }

  static async deleteVideo(req: Request, res: Response) {
    try {
      const { key } = req.params;
      await StorageService.deleteFile(key);
      res.json({ success: true, message: 'Vídeo deletado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Erro ao deletar vídeo' });
    }
  }
}
