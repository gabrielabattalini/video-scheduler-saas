import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { AuthController } from './controllers/auth.controller';
import { authMiddleware } from './middleware/auth.middleware';
import { validate } from './middleware/validation.middleware';
import { registerSchema, loginSchema } from './schemas/auth.schema';
import { upload } from './middleware/upload.middleware';
import { UploadController } from './controllers/upload.controller';
import { StorageService } from './services/storage.service';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => { 
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================

app.post('/api/auth/register', validate(registerSchema), AuthController.register);
app.post('/api/auth/login', validate(loginSchema), AuthController.login);
app.post('/api/auth/refresh', AuthController.refresh);
app.get('/api/auth/me', authMiddleware, AuthController.me);

// ==================== ROTAS DE POSTS (PROTEGIDAS) ====================

app.get('/api/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: req.user!.userId },
      include: { 
        user: { 
          select: { name: true, email: true } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: { posts } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, description, videoUrl, platform, scheduledAt } = req.body;
    
    const post = await prisma.post.create({
      data: { 
        userId: req.user!.userId,
        title, 
        description, 
        videoUrl, 
        platform, 
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    });
    
    res.status(201).json({ success: true, data: { post } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({ where: { id } });
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post não encontrado' });
    }
    
    if (post.userId !== req.user!.userId) {
      return res.status(403).json({ success: false, error: 'Não autorizado' });
    }
    
    await prisma.post.delete({ where: { id } });
    
    res.json({ success: true, message: 'Post deletado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em: http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   POST   /api/auth/register  - Cadastrar usuário`);
  console.log(`   POST   /api/auth/login     - Login`);
  console.log(`   POST   /api/auth/refresh   - Renovar token`);
  console.log(`   GET    /api/auth/me        - Dados do usuário (protegida)`);
  console.log(`   GET    /api/posts          - Listar posts (protegida)`);
  console.log(`   POST   /api/posts          - Criar post (protegida)`);
  console.log(`   DELETE /api/posts/:id      - Deletar post (protegida)`);
  console.log(`\n🔐 Autenticação JWT implementada com sucesso!`);
});
