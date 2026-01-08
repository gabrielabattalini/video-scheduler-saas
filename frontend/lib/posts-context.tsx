'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { postsApi, type Post, type CreatePostInput, type UpdatePostInput, type Platform, type PostStatus } from './posts-api';
import { authService } from './auth';

interface PostsContextValue {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  addPost: (input: CreatePostInput) => Promise<void>;
  updatePost: (id: string, input: UpdatePostInput) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => Post | undefined;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = async () => {
    if (!authService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await postsApi.list();
      setPosts(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar posts');
      console.error('Erro ao carregar posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const addPost = async (input: CreatePostInput) => {
    try {
      const newPost = await postsApi.create(input);
      setPosts((prev) => [newPost, ...prev]);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao criar post');
    }
  };

  const updatePost = async (id: string, input: UpdatePostInput) => {
    try {
      const updatedPost = await postsApi.update(id, input);
      setPosts((prev) => prev.map((post) => (post.id === id ? updatedPost : post)));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao atualizar post');
    }
  };

  const deletePost = async (id: string) => {
    try {
      await postsApi.delete(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao deletar post');
    }
  };

  const getPost = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        isLoading,
        error,
        addPost,
        updatePost,
        deletePost,
        getPost,
        refreshPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts deve ser usado dentro de PostsProvider');
  }
  return context;
}

// Export types for use in components
export type { Post, CreatePostInput, UpdatePostInput, Platform, PostStatus };

