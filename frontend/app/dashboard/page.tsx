'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';

type PostItem = {
  id: string;
  title: string;
  description?: string;
  platform?: 'youtube' | 'tiktok' | 'instagram';
  videoUrl?: string;
  createdAt?: string;
  status?: string; // opcional
};

export default function DashboardPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const totalPosts = useMemo(() => posts.length, [posts.length]);

  useEffect(() => {
    // 1) auth check seguro (só 1 vez)
    try {
      const ok = authService.isAuthenticated?.() ?? false;
      if (!ok) {
        router.replace('/login');
        return;
      }
      setUser(authService.getUser?.() ?? null);
    } catch (e) {
      router.replace('/login');
      return;
    } finally {
      setChecking(false);
    }
  }, [router]);

  async function fetchPosts() {
    setLoadingPosts(true);
    setError(null);
    try {
      const res = await api.get('/api/posts');
      // aceita tanto { posts: [] } quanto [] direto
      const data = Array.isArray(res.data) ? res.data : res.data?.posts;
      setPosts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Erro ao carregar posts');
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    // 2) só busca posts depois de checar auth
    if (!checking) fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  async function handleDelete(id: string) {
    const ok = confirm('Tem certeza que deseja deletar este post?');
    if (!ok) return;

    try {
      await api.delete(`/api/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Erro ao deletar post');
    }
  }

  function handleLogout() {
    try {
      authService.logout?.();
    } finally {
      router.replace('/login');
    }
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui' }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Topbar */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '14px 16px' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🎬 Video Scheduler</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {user?.email || user?.name ? `Logado: ${user?.name || user?.email}` : 'Dashboard'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/new-post')}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                background: '#111827',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              ➕ Novo post
            </button>

            <button
              onClick={fetchPosts}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              🔄 Atualizar
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                background: '#ef4444',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 1100, margin: '22px auto', padding: '0 16px' }}>
        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <div style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Total de posts</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 6 }}>{totalPosts}</div>
          </div>

          <div style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Status</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              {loadingPosts ? 'Carregando lista…' : error ? `⚠️ ${error}` : '✅ OK'}
            </div>
          </div>
        </div>

        {/* Lista */}
        <div style={{ marginTop: 16, background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Seus posts</h2>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {posts.length ? `Mostrando ${posts.length}` : 'Nenhum post ainda'}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {loadingPosts ? (
              <div style={{ padding: 16, color: '#6b7280' }}>Carregando…</div>
            ) : posts.length === 0 ? (
              <div style={{ padding: 16, color: '#6b7280' }}>
                Você ainda não criou posts. Clique em <b>Novo post</b>.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {posts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 12,
                      padding: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ minWidth: 240 }}>
                      <div style={{ fontWeight: 900 }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                        {p.platform ? `📣 ${p.platform}` : '📣 —'} {p.status ? `• ${p.status}` : ''}
                      </div>
                      {p.description && (
                        <div style={{ fontSize: 12, color: '#374151', marginTop: 6 }}>
                          {p.description.length > 120 ? p.description.slice(0, 120) + '…' : p.description}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => router.push(`/edit-post?id=${encodeURIComponent(p.id)}`)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 10,
                          border: '1px solid #e5e7eb',
                          background: 'white',
                          cursor: 'pointer',
                          fontWeight: 800,
                        }}
                      >
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 10,
                          border: 'none',
                          background: '#fee2e2',
                          cursor: 'pointer',
                          fontWeight: 900,
                          color: '#991b1b',
                        }}
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
