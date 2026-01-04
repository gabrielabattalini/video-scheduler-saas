import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Para garantir que paths relativos funcionem mesmo se você rodar de outro lugar:
process.chdir(__dirname);

console.log('🚀 Instalando sistema de upload de vídeos...\n');

// ==================================================
// BACKEND
// ==================================================

console.log('📦 Configurando backend...\n');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileEnsuringDir(filePath, content) {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf8');
}

function readFileSafe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

// 0. Garantir estrutura básica
ensureDir('src/config');
ensureDir('src/services');
ensureDir('src/middleware');
ensureDir('src/controllers');
ensureDir('prisma');

// 1. storage.config.ts
writeFileEnsuringDir(
  'src/config/storage.config.ts',
  `import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  endpoint: process.env.AWS_S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

export const storageConfig = {
  bucket: process.env.AWS_S3_BUCKET || 'videos',
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowedMimeTypes: [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ],
};
`
);
console.log('   ✅ src/config/storage.config.ts');

// 2. storage.service.ts
writeFileEnsuringDir(
  'src/services/storage.service.ts',
  `import { 
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
    } catch (error) {
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

  static generateFileName(originalName) {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(16).toString('hex');
    return \`\${Date.now()}-\${hash}\${ext}\`;
  }

  static async uploadFile(file) {
    const fileName = this.generateFileName(file.originalname);
    const key = \`videos/\${fileName}\`;

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

  static async uploadThumbnail(buffer, videoKey) {
    const fileName = path.basename(videoKey, path.extname(videoKey));
    const key = \`thumbnails/\${fileName}.jpg\`;

    const command = new PutObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    });

    await s3Client.send(command);
    return key;
  }

  static async getSignedUrl(key) {
    const command = new GetObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  static async deleteFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
    });

    await s3Client.send(command);
  }

  static validateFile(file) {
    if (!storageConfig.allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: \`Tipo de arquivo não permitido. Permitidos: \${storageConfig.allowedMimeTypes.join(', ')}\`,
      };
    }

    if (file.size > storageConfig.maxFileSize) {
      return {
        valid: false,
        error: \`Arquivo muito grande. Máximo: \${storageConfig.maxFileSize / (1024 * 1024)}MB\`,
      };
    }

    return { valid: true };
  }
}
`
);
console.log('   ✅ src/services/storage.service.ts');

// 3. video.service.ts (simplificado - sem ffmpeg por enquanto)
writeFileEnsuringDir(
  'src/services/video.service.ts',
  `export class VideoService {
  static async generateThumbnail(videoBuffer) {
    // Por enquanto retorna null - implementar FFmpeg depois
    return null;
  }

  static async getVideoMetadata(videoBuffer) {
    return {};
  }

  static async validateVideo(videoBuffer) {
    return true; // Por enquanto aceita todos
  }
}
`
);
console.log('   ✅ src/services/video.service.ts');

// 4. upload.middleware.ts
writeFileEnsuringDir(
  'src/middleware/upload.middleware.ts',
  `import multer from 'multer';
import { storageConfig } from '../config/storage.config.js';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: storageConfig.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (storageConfig.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
});
`
);
console.log('   ✅ src/middleware/upload.middleware.ts');

// 5. upload.controller.ts
writeFileEnsuringDir(
  'src/controllers/upload.controller.ts',
  `import { StorageService } from '../services/storage.service.js';
import { VideoService } from '../services/video.service.js';

export class UploadController {
  static async uploadVideo(req, res) {
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
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao fazer upload do vídeo',
        details: error.message,
      });
    }
  }

  static async getVideoUrl(req, res) {
    try {
      const { key } = req.params;
      const url = await StorageService.getSignedUrl(key);
      res.json({ success: true, data: { url } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao gerar URL do vídeo' });
    }
  }

  static async deleteVideo(req, res) {
    try {
      const { key } = req.params;
      await StorageService.deleteFile(key);
      res.json({ success: true, message: 'Vídeo deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao deletar vídeo' });
    }
  }
}
`
);
console.log('   ✅ src/controllers/upload.controller.ts');

// 6. Atualizar main.ts
const mainPath = 'src/main.ts';
const mainContent = readFileSafe(mainPath);

if (!mainContent) {
  console.log(`   ⚠️  ${mainPath} não encontrado. Pulei atualização automática do main.ts.`);
} else if (!mainContent.includes('upload.middleware')) {
  const imports = `import { upload } from './middleware/upload.middleware.js';
import { UploadController } from './controllers/upload.controller.js';
import { StorageService } from './services/storage.service.js';
`;

  const routes = `
// ==================== ROTAS DE UPLOAD (PROTEGIDAS) ====================

app.post('/api/upload/video', 
  authMiddleware, 
  upload.single('video'), 
  UploadController.uploadVideo
);

app.get('/api/upload/video/:key', 
  authMiddleware, 
  UploadController.getVideoUrl
);

app.delete('/api/upload/video/:key', 
  authMiddleware, 
  UploadController.deleteVideo
);
`;

  const initBucket = `
// Inicializar bucket do S3/MinIO
StorageService.initBucket().catch(console.error);
`;

  // Tentativas de inserção por âncoras comuns
  let updatedMain = mainContent;

  if (updatedMain.includes("import { authMiddleware }")) {
    updatedMain = updatedMain.replace(
      'import { authMiddleware }',
      imports + '\nimport { authMiddleware }'
    );
  } else {
    // fallback: coloca imports no topo
    updatedMain = imports + '\n' + updatedMain;
  }

  if (updatedMain.includes('app.use(express.json());')) {
    updatedMain = updatedMain.replace(
      'app.use(express.json());',
      'app.use(express.json());\n' + initBucket
    );
  } else {
    // fallback: adiciona initBucket após criação do app, se possível
    updatedMain = updatedMain.replace('const app = express();', 'const app = express();\n' + initBucket);
  }

  if (updatedMain.includes('const PORT = process.env.PORT')) {
    updatedMain = updatedMain.replace(
      'const PORT = process.env.PORT',
      routes + '\nconst PORT = process.env.PORT'
    );
  } else {
    // fallback: adiciona rotas antes do listen, se existir
    updatedMain = updatedMain.replace('app.listen', routes + '\napp.listen');
  }

  fs.writeFileSync(mainPath, updatedMain, 'utf8');
  console.log('   ✅ src/main.ts atualizado');
} else {
  console.log('   ℹ️  main.ts já contém upload.middleware (não alterei).');
}

// 7. Atualizar schema.prisma
const schemaContent = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]

  @@map("users")
}

model Post {
  id           String    @id @default(uuid())
  userId       String
  title        String
  description  String?
  videoUrl     String?
  videoKey     String?
  thumbnailUrl String?
  thumbnailKey String?
  platform     String
  status       String    @default("pending")
  scheduledAt  DateTime?
  metadata     Json?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("posts")
}
`;

writeFileEnsuringDir('prisma/schema.prisma', schemaContent);
console.log('   ✅ prisma/schema.prisma atualizado');

console.log('\n========================================');
console.log('✅ BACKEND CONFIGURADO!');
console.log('========================================\n');

console.log('📋 Execute estes comandos:\n');
console.log('1. Instalar dependências:');
console.log('   npm install multer @aws-sdk/client-s3 @aws-sdk/s3-request-presigner');
console.log('   npm install -D @types/multer\n');
console.log('2. Rodar migration:');
console.log('   npx prisma migrate dev --name add-video-upload\n');
console.log('3. Reiniciar backend:');
console.log('   npm run dev\n');
console.log('========================================\n');
