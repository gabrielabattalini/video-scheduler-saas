import { z } from 'zod';

const platformEnum = z.enum(['youtube', 'tiktok', 'instagram']);

export const createPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(2000, 'Descrição muito longa').optional(),
  videoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  videoKey: z.string().optional(),
  thumbnailUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  thumbnailKey: z.string().optional(),
  platforms: z.array(platformEnum).min(1, 'Selecione pelo menos uma plataforma'),
  scheduledAt: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
