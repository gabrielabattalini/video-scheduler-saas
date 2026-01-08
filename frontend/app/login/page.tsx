'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/language-context';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Obter URL de autenticação do backend
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/auth/google`);
      const data = await response.json();
      
      if (data.success && data.data?.authUrl) {
        // Redirecionar para URL do Google
        window.location.href = data.data.authUrl;
      } else {
        throw new Error(data.error || 'Erro ao obter URL de autenticação');
      }
    } catch (err: any) {
      console.error('Erro ao iniciar login com Google:', err);
      setError(err.message || 'Erro ao conectar com Google');
      setLoading(false);
    }
  };

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
      setError(err.response?.data?.error || t.common.error);
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
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo size="large" showText={true} horizontal={false} />
        </div>

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
            {t.login.login}
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
            {t.login.register}
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
            placeholder={t.login.email}
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
            placeholder={`${t.login.password} (${t.login.passwordMin})`}
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
              transition: 'all 0.3s',
              marginBottom: '1rem'
            }}
          >
            {loading ? t.common.loading : (isLogin ? t.login.login : t.login.register)}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.5rem 0',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          <span style={{ color: '#666', fontSize: '0.875rem' }}>{t.login.or}</span>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: 'white',
            color: '#333',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#ddd';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t.login.continueWithGoogle}
        </button>
      </div>
    </div>
  );
}
