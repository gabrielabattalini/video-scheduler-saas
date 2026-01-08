'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Ler parâmetros da URL
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userStr = params.get('user');
        const error = params.get('error');

        console.log('Callback recebido:', { accessToken: !!accessToken, refreshToken: !!refreshToken, userStr: !!userStr, error });

        if (error) {
          console.error('Erro no callback:', error);
          // Redirecionar para login com erro
          router.push(`/login?error=${encodeURIComponent(error)}`);
          return;
        }

        if (accessToken && refreshToken && userStr) {
          try {
            // Salvar tokens e usuário
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', userStr);

            console.log('Tokens salvos, redirecionando para dashboard...');
            
            // Aguardar um pouco antes de redirecionar
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Redirecionar para dashboard
            router.push('/dashboard');
          } catch (err) {
            console.error('Erro ao processar callback:', err);
            router.push('/login?error=Erro ao processar autenticação');
          }
        } else {
          console.error('Dados de autenticação incompletos:', { accessToken: !!accessToken, refreshToken: !!refreshToken, userStr: !!userStr });
          router.push('/login?error=Dados de autenticação inválidos');
        }
      } catch (err) {
        console.error('Erro no useEffect do callback:', err);
        router.push('/login?error=Erro ao processar autenticação');
      }
    };

    processCallback();
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Processando autenticação...</div>
      </div>
    </div>
  );
}
