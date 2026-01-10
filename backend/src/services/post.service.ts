import { prisma } from '../lib/prisma';
import type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema';

export class PostService {
  static async list(userId: string) {
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true },
        },
        workspace: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse platforms from JSON string to array
    return posts.map((post) => ({
      ...post,
      platforms: this.parsePlatforms(post.platform),
    }));
  }

  static async get(id: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        workspace: {
          select: { id: true, name: true },
        },
      },
    });

    if (!post) {
      return null;
    }

    if (post.userId !== userId) {
      throw new Error('Não autorizado');
    }

    return {
      ...post,
      platforms: this.parsePlatforms(post.platform),
    };
  }

  static parsePlatforms(platformData: string): string[] {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(platformData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If it's a single string, return as array
      return [parsed];
    } catch {
      // If parsing fails, assume it's a single platform string
      return platformData ? [platformData] : [];
    }
  }

  static stringifyPlatforms(platforms: string[]): string {
    return JSON.stringify(platforms);
  }

  static async create(userId: string, data: CreatePostInput) {
    // Validate scheduledAt is in the future if provided
    if (data.scheduledAt && data.scheduledAt !== '') {
      const scheduledDate = new Date(data.scheduledAt);
      const now = new Date();
      if (isNaN(scheduledDate.getTime()) || scheduledDate <= now) {
        throw new Error('A data e hora agendada deve ser no futuro');
      }
    }

    const postData: any = {
      userId,
      title: data.title,
      description: data.description || null,
      platform: this.stringifyPlatforms(data.platforms),
      videoUrl: data.videoUrl || null,
      videoKey: data.videoKey || null,
      thumbnailUrl: data.thumbnailUrl || null,
      thumbnailKey: data.thumbnailKey || null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      metadata: data.metadata || null,
      status: data.scheduledAt ? 'scheduled' : 'pending',
    };
    if (data.workspaceId) {
      postData.workspaceId = data.workspaceId;
    }

    const post = await prisma.post.create({
      data: postData,
      include: {
        user: {
          select: { name: true, email: true },
        },
        workspace: {
          select: { id: true, name: true },
        },
      },
    });

    return {
      ...post,
      platforms: this.parsePlatforms(post.platform),
    };
  }

  static async update(id: string, userId: string, data: UpdatePostInput) {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return null;
    }

    if (post.userId !== userId) {
      throw new Error('Não autorizado');
    }

    // Validate scheduledAt is in the future if provided
    if (data.scheduledAt !== undefined && data.scheduledAt && data.scheduledAt !== '') {
      const scheduledDate = new Date(data.scheduledAt);
      const now = new Date();
      if (isNaN(scheduledDate.getTime()) || scheduledDate <= now) {
        throw new Error('A data e hora agendada deve ser no futuro');
      }
    }

    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.platforms !== undefined) updateData.platform = this.stringifyPlatforms(data.platforms);
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl || null;
    if (data.videoKey !== undefined) updateData.videoKey = data.videoKey || null;
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl || null;
    if (data.thumbnailKey !== undefined) updateData.thumbnailKey = data.thumbnailKey || null;
    if (data.scheduledAt !== undefined) {
      updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
      updateData.status = data.scheduledAt ? 'scheduled' : 'pending';
    }
    if (data.metadata !== undefined) updateData.metadata = data.metadata || null;
    if (data.workspaceId !== undefined) updateData.workspaceId = data.workspaceId || null;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { name: true, email: true },
        },
        workspace: {
          select: { id: true, name: true },
        },
      },
    });

    return {
      ...updatedPost,
      platforms: this.parsePlatforms(updatedPost.platform),
    };
  }

  static async delete(id: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new Error('Post não encontrado');
    }

    if (post.userId !== userId) {
      throw new Error('Não autorizado');
    }

    await prisma.post.delete({ where: { id } });
  }
}
