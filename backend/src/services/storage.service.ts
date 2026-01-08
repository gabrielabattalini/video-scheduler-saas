import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, storageConfig } from '../config/storage.config.js';
import crypto from 'crypto';
import path from 'path';

export class StorageService {
  static async initBucket() {
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: storageConfig.bucket }));
      console.log('✅ Bucket já existe:', storageConfig.bucket);
    } catch (error: any) {
      // Em alguns SDKs/implementações o "NotFound" pode vir como 'NotFound' ou statusCode 404
      const name = error?.name;
      const status = error?.$metadata?.httpStatusCode;

      if (name === 'NotFound' || status === 404) {
        console.log('📦 Criando bucket:', storageConfig.bucket);
        await s3Client.send(new CreateBucketCommand({ Bucket: storageConfig.bucket }));
        console.log('✅ Bucket criado com sucesso!');
      } else {
        console.error('❌ Erro ao verificar bucket:', error?.message || error);
      }
    }
  }

  static generateFileName(originalName: string) {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(16).toString('hex');
    return `${Date.now()}-${hash}${ext}`;
  }

  static async uploadFile(file: Express.Multer.File) {
    const fileName = this.generateFileName(file.originalname);
    const key = `videos/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);
    return key;
  }

  static async uploadThumbnail(buffer: Buffer, videoKey: string) {
    const fileName = path.basename(videoKey, path.extname(videoKey));
    const key = `thumbnails/${fileName}.jpg`;

    const command = new PutObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    });

    await s3Client.send(command);
    return key;
  }

  static async getSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  static async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
    });

    await s3Client.send(command);
  }

  static validateFile(file: Express.Multer.File) {
    if (!storageConfig.allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Permitidos: ${storageConfig.allowedMimeTypes.join(', ')}`,
      };
    }

    if (file.size > storageConfig.maxFileSize) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: ${storageConfig.maxFileSize / (1024 * 1024)}MB`,
      };
    }

    return { valid: true };
  }
}
