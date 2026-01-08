const fs = require('fs');
const path = require('path');

console.log('ðŸš€ Configurando frontend com autenticaÃ§Ã£o JWT...\n');

// Criar pasta lib
console.log('ðŸ“ Criando estrutura de pastas...');
if (!fs.existsSync('lib')) {
  fs.mkdirSync('lib', { recursive: true });
  console.log('   âœ… lib/');
}
console.log('');

// 1. lib/api.ts
console.log('ðŸ“ Criando arquivos...');
fs.writeFileSync('lib/api.ts', `import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://autoedito.com';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisiÃ§Ãµes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para renovar token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(\`\${API_URL}/api/auth/refresh\`, {
          refreshToken,
        });

        const { accessToken } = data.data;
        
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = \`Bearer \${accessToken}\`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
`);
console.log('   âœ… lib/api.ts');

// 2. lib/auth.ts
fs.writeFileSync('lib/auth.ts', `import { api } from './api';

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

export const authService = {
  async register(email: string, password: string, name?: string) {
    const { data } = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      name,
    });
    
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    return data.data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    return data.data;
  },

  async me() {
    const { data } = await api.get<{ success: boolean; data: { user: User } }>('/api/auth/me');
    return data.data.user;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
`);
console.log('   âœ… lib/auth.ts');

// 3. app/login/page.tsx
if (!fs.existsSync('app/login')) {
  fs.mkdirSync('app/login', { recursive: true });
}

fs.writeFileSync('app/login/page.tsx', `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.register(email, password, name);
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ðŸŽ¬ Autoedito
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              background: isLogin ? '#667eea' : '#f3f4f6',
              color: isLogin ? 'white' : '#666',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              background: !isLogin ? '#667eea' : '#f3f4f6',
              color: !isLogin ? 'white' : '#666',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Registrar
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />

          <input
            type="password"
            placeholder="Senha (mÃ­nimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              border: 'none',
              borderRadius: '8px',
              background: loading ? '#9ca3af' : '#667eea',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          <p style={{ margin: 0, marginBottom: '0.5rem' }}>
            ðŸ” <strong>SeguranÃ§a:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Senhas criptografadas com bcrypt</li>
            <li>JWT tokens com expiraÃ§Ã£o</li>
            <li>RenovaÃ§Ã£o automÃ¡tica de tokens</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`);
console.log('   âœ… app/login/page.tsx');

// 4. app/dashboard/page.tsx
if (!fs.existsSync('app/dashboard')) {
  fs.mkdirSync('app/dashboard', { recursive: true });
}

fs.writeFileSync('app/dashboard/page.tsx', `'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';

interface Post {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  platform: string;
  status: string;
  scheduledAt?: string;
  createdAt: string;
  user: {
    name?: string;
    email: string;
  };
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getUser();
    setUser(userData);
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get('/api/posts');
      setPosts(data.data.posts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este post?')) return;

    try {
      await api.delete(\`/api/posts/\${id}\`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao deletar post');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ðŸŽ¬ Autoedito
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#666' }}>OlÃ¡, {user?.name || user?.email}</span>
            <button
              onClick={() => router.push('/new-post')}
              style={{
                padding: '0.5rem 1rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              + Novo Post
            </button>
            <button
              onClick={() => authService.logout()}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Meus Posts</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            Carregando...
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
              Nenhum post ainda
            </p>
            <button
              onClick={() => router.push('/new-post')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Criar Primeiro Post
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                      {post.title}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      {post.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#888'
                    }}>
                      <span>ðŸ“± {post.platform}</span>
                      <span>ðŸ“Š {post.status}</span>
                      {post.scheduledAt && (
                        <span>ðŸ“… {new Date(post.scheduledAt).toLocaleString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    ðŸ—‘ï¸ Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`);
console.log('   âœ… app/dashboard/page.tsx');

// 5. app/new-post/page.tsx
if (!fs.existsSync('app/new-post')) {
  fs.mkdirSync('app/new-post', { recursive: true });
}

fs.writeFileSync('app/new-post/page.tsx', `'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/api/posts', {
        title,
        description,
        videoUrl,
        platform
      });
      
      alert('Post criado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ðŸŽ¬ Autoedito
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            â† Voltar
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Novo Post</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                TÃ­tulo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                DescriÃ§Ã£o
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                URL do VÃ­deo
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                placeholder="https://example.com/video.mp4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Plataforma
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                background: loading ? '#9ca3af' : '#667eea',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Criando...' : 'Criar Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
`);
console.log('   âœ… app/new-post/page.tsx');

console.log('');
console.log('========================================');
console.log('âœ… FRONTEND CONFIGURADO!');
console.log('========================================');
console.log('');
console.log('ðŸ“‹ PrÃ³ximos passos:');
console.log('');
console.log('1. Inicie o frontend:');
console.log('   npm run dev');
console.log('');
console.log('2. Acesse:');
console.log('   https://autoedito.com/login');
console.log('');
console.log('========================================');

