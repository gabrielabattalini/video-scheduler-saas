import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './controllers/auth.controller';
import { PostController } from './controllers/post.controller';
import { UploadController } from './controllers/upload.controller';
import { ConnectionController } from './controllers/connection.controller';
import { SettingsController } from './controllers/settings.controller';
import { WorkspaceController } from './controllers/workspace.controller';
import { PlanController } from './controllers/plan.controller';
import { authMiddleware } from './middleware/auth.middleware';
import { validate } from './middleware/validation.middleware';
import { registerSchema, loginSchema } from './schemas/auth.schema';
import { createPostSchema, updatePostSchema } from './schemas/post.schema';
import { upload } from './middleware/upload.middleware';
import { StorageService } from './services/storage.service';
import { PlanService } from './services/plan.service';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Inicializar bucket do S3/MinIO
StorageService.initBucket().catch(console.error);
PlanService.ensureDefaults().catch(console.error);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================

app.post('/api/auth/register', validate(registerSchema), AuthController.register);
app.post('/api/auth/login', validate(loginSchema), AuthController.login);
app.post('/api/auth/refresh', AuthController.refresh);
app.get('/api/auth/me', authMiddleware, AuthController.me);
app.patch('/api/auth/profile', authMiddleware, AuthController.updateProfile);
app.post('/api/auth/change-password', authMiddleware, AuthController.changePassword);
app.delete('/api/auth/me', authMiddleware, AuthController.deleteAccount);

// OAuth Google
app.get('/api/auth/google', AuthController.googleAuth);
app.get('/api/auth/google/callback', AuthController.googleCallback);

// ==================== ROTAS DE WORKSPACES (PROTEGIDAS) ====================

app.get('/api/workspaces', authMiddleware, WorkspaceController.list);
app.get('/api/workspaces/default', authMiddleware, WorkspaceController.getDefault);
app.get('/api/workspaces/:id', authMiddleware, WorkspaceController.getById);
app.post('/api/workspaces', authMiddleware, WorkspaceController.create);
app.put('/api/workspaces/:id', authMiddleware, WorkspaceController.update);
app.delete('/api/workspaces/:id', authMiddleware, WorkspaceController.delete);

// ==================== ROTAS DE CONEXÕES (PROTEGIDAS) ====================

app.get('/api/connections', authMiddleware, ConnectionController.list);
app.get('/api/connections/youtube/auth', authMiddleware, ConnectionController.youtubeAuth);
app.get('/api/connections/youtube/callback', ConnectionController.youtubeCallback);
app.delete('/api/connections/youtube', authMiddleware, ConnectionController.youtubeDisconnect);
app.get('/api/connections/tiktok/auth', authMiddleware, ConnectionController.tiktokAuth);
app.get('/api/connections/tiktok/callback', ConnectionController.tiktokCallback);
app.delete('/api/connections/tiktok', authMiddleware, ConnectionController.tiktokDisconnect);
app.get('/api/connections/twitter/auth', authMiddleware, ConnectionController.twitterAuth);
app.get('/api/connections/twitter/callback', ConnectionController.twitterCallback);
app.delete('/api/connections/twitter', authMiddleware, ConnectionController.twitterDisconnect);
app.get('/api/connections/x/auth', authMiddleware, ConnectionController.twitterAuth);
app.get('/api/connections/x/callback', ConnectionController.twitterCallback);
app.delete('/api/connections/x', authMiddleware, ConnectionController.twitterDisconnect);
app.get('/api/connections/instagram/auth', authMiddleware, ConnectionController.instagramAuth);
app.get('/api/connections/instagram/callback', ConnectionController.instagramCallback);
app.delete('/api/connections/instagram', authMiddleware, ConnectionController.instagramDisconnect);
app.get('/api/connections/kawai/auth', authMiddleware, ConnectionController.kawaiAuth);
app.get('/api/connections/kawai/callback', ConnectionController.kawaiCallback);
app.delete('/api/connections/kawai', authMiddleware, ConnectionController.kawaiDisconnect);

// ==================== ROTAS DE CONFIGURAÇÕES (PROTEGIDAS) ====================

app.get('/api/settings/preferences', authMiddleware, SettingsController.getPreferences);
app.patch('/api/settings/preferences', authMiddleware, SettingsController.updatePreferences);
app.post('/api/settings/subscription', authMiddleware, SettingsController.updateSubscription);

// ==================== ROTAS DE PLANOS ====================

app.get('/api/plans', PlanController.list);
app.post('/api/plans/grant-support', authMiddleware, PlanController.grantSupport);

// ==================== ROTAS DE UPLOAD (PROTEGIDAS) ====================

app.post(
  '/api/upload/video',
  authMiddleware,
  upload.single('video'),
  UploadController.uploadVideo
);

app.get('/api/upload/video/:key', authMiddleware, UploadController.getVideoUrl);

app.delete('/api/upload/video/:key', authMiddleware, UploadController.deleteVideo);

// ==================== ROTAS DE POSTS (PROTEGIDAS) ====================

app.get('/api/posts', authMiddleware, PostController.list);
app.get('/api/posts/:id', authMiddleware, PostController.get);
app.post('/api/posts', authMiddleware, validate(createPostSchema), PostController.create);
app.put('/api/posts/:id', authMiddleware, validate(updatePostSchema), PostController.update);
app.patch('/api/posts/:id', authMiddleware, validate(updatePostSchema), PostController.update);
app.delete('/api/posts/:id', authMiddleware, PostController.delete);
app.post('/api/posts/:id/publish/instagram', authMiddleware, PostController.publishToInstagram);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em: http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   POST   /api/auth/register    - Cadastrar usuário`);
  console.log(`   POST   /api/auth/login       - Login`);
  console.log(`   POST   /api/auth/refresh     - Renovar token`);
  console.log(`   GET    /api/auth/me          - Dados do usuário (protegida)`);
  console.log(`   GET    /api/posts            - Listar posts (protegida)`);
  console.log(`   GET    /api/posts/:id        - Buscar post (protegida)`);
  console.log(`   POST   /api/posts            - Criar post (protegida)`);
  console.log(`   PUT    /api/posts/:id        - Atualizar post (protegida)`);
  console.log(`   PATCH  /api/posts/:id        - Atualizar post (protegida)`);
  console.log(`   DELETE /api/posts/:id        - Deletar post (protegida)`);
  console.log(`   POST   /api/upload/video     - Upload de vídeo (protegida)`);
  console.log(`   GET    /api/connections      - Listar conexões (protegida)`);
  console.log(`   GET    /api/connections/youtube/auth - Iniciar auth YouTube (protegida)`);
  console.log(`   GET    /api/connections/youtube/callback - Callback YouTube`);
  console.log(`   DELETE /api/connections/youtube - Desconectar YouTube (protegida)`);
  console.log(`   GET    /api/connections/tiktok/auth - Iniciar auth TikTok (protegida)`);
  console.log(`   GET    /api/connections/tiktok/callback - Callback TikTok`);
  console.log(`   DELETE /api/connections/tiktok - Desconectar TikTok (protegida)`);
  console.log(`   GET    /api/connections/twitter/auth - Iniciar auth X (protegida)`);
  console.log(`   GET    /api/connections/twitter/callback - Callback X`);
  console.log(`   DELETE /api/connections/twitter - Desconectar X (protegida)`);
  console.log(`   GET    /api/connections/x/auth - Iniciar auth X (alias)`);
  console.log(`   GET    /api/connections/x/callback - Callback X (alias)`);
  console.log(`   DELETE /api/connections/x - Desconectar X (alias)`);
  console.log(`   GET    /api/connections/instagram/auth - Iniciar auth Instagram (protegida)`);
  console.log(`   GET    /api/connections/instagram/callback - Callback Instagram`);
  console.log(`   DELETE /api/connections/instagram - Desconectar Instagram (protegida)`);
  console.log(`   GET    /api/connections/kawai/auth - Iniciar auth Kawai (protegida)`);
  console.log(`   GET    /api/connections/kawai/callback - Callback Kawai`);
  console.log(`   DELETE /api/connections/kawai - Desconectar Kawai (protegida)`);
  console.log(`\n🔐 Autenticação JWT implementada com sucesso!`);
});
