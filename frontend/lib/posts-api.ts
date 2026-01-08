import { api } from './api';

export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'kawai';
export type PostStatus = 'pending' | 'scheduled' | 'published' | 'draft';

export interface Post {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  videoKey?: string | null;
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null;
  platform?: string; // For backwards compatibility
  platforms?: Platform[]; // New: array of platforms
  workspaceId?: string | null;
  workspaceName?: string | null;
  workspace?: { id: string; name: string } | null;
  status: PostStatus;
  scheduledAt?: string | null;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  user?: {
    name?: string | null;
    email: string;
  };
}

export interface CreatePostInput {
  title: string;
  description?: string;
  videoUrl?: string;
  videoKey?: string;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  platforms: Platform[];
  scheduledAt?: string;
  metadata?: any;
  workspaceId?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {}

export const postsApi = {
  async list(): Promise<Post[]> {
    const { data } = await api.get<{ success: boolean; data: { posts: Post[] } }>('/api/posts');
    return data.data.posts;
  },

  async get(id: string): Promise<Post> {
    const { data } = await api.get<{ success: boolean; data: { post: Post } }>(`/api/posts/${id}`);
    return data.data.post;
  },

  async create(input: CreatePostInput): Promise<Post> {
    const { data } = await api.post<{ success: boolean; data: { post: Post } }>('/api/posts', input);
    return data.data.post;
  },

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const { data } = await api.put<{ success: boolean; data: { post: Post } }>(`/api/posts/${id}`, input);
    return data.data.post;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/posts/${id}`);
  },
};
