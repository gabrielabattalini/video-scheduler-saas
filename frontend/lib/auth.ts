import { api } from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const authService = {
  async register(email: string, password: string, name?: string) {
    const { data } = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      name,
    });

    if (canUseStorage()) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data.data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });

    if (canUseStorage()) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data.data;
  },

  async me() {
    const { data } = await api.get<{ success: boolean; data: { user: User } }>('/api/auth/me');
    return data.data.user;
  },

  logout() {
    if (canUseStorage()) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  getUser(): User | null {
    if (!canUseStorage()) return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    if (!canUseStorage()) return false;
    return !!localStorage.getItem('accessToken');
  },

  async updateProfile(name: string) {
    const { data } = await api.patch<{ success: boolean; data: { user: User } }>('/api/auth/profile', { name });
    if (canUseStorage()) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data.data.user;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    await api.post('/api/auth/change-password', { currentPassword, newPassword });
  },

  async deleteAccount() {
    await api.delete('/api/auth/me');
    this.logout();
  },
};
