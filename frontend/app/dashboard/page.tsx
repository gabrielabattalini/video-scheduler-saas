'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { usePosts } from '@/lib/posts-context';
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import { useLanguage } from '@/lib/i18n/language-context';
import { connectionsApi } from '@/lib/connections-api';

export default function Dashboard() {
  const router = useRouter();
  const { posts, deletePost, isLoading, refreshPosts } = usePosts();
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'published' | 'draft' | 'pending'>('all');
  const [workspaceFilter, setWorkspaceFilter] = useState<string>('all');
  const [connectionsCount, setConnectionsCount] = useState<number | null>(null);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const loadConnections = async () => {
      try {
        if (!authService.isAuthenticated()) {
          if (isMounted) {
            setConnectionsCount(0);
            setIsLoadingConnections(false);
          }
          return;
        }

        const connections = await connectionsApi.list();
        if (isMounted) {
          setConnectionsCount(connections.length);
        }
      } catch (error) {
        console.error('Erro ao carregar conexoes no dashboard:', error);
        if (isMounted) {
          setConnectionsCount(0);
        }
      } finally {
        if (isMounted) {
          setIsLoadingConnections(false);
        }
      }
    };

    loadConnections();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = {
    total: posts.length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft' || p.status === 'pending').length,
  };

  const handleEdit = (id: string) => router.push(`/edit-post/${id}`);
  const handleDelete = async (id: string) => {
    if (confirm(`${t.common.delete}?`)) {
      try {
        await deletePost(id);
      } catch (error: any) {
        alert(error.message || t.common.error);
      }
    }
  };

  const statCards = [
    { label: t.dashboard.posts, value: stats.total, emoji: '🎬' },
    { label: t.dashboard.scheduled, value: stats.scheduled, emoji: '📅' },
    { label: t.dashboard.published, value: stats.published, emoji: '✅' },
    { label: t.dashboard.drafts, value: stats.draft, emoji: '📝' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div
          style={{
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ecfeff 0%, #eef2ff 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -15px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '260px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.25)',
                color: '#0ea5e9',
                flexShrink: 0,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.5 7.5 10 10" />
                <path d="M14 14 16.5 16.5" />
                <circle cx="6" cy="6" r="3.5" />
                <circle cx="18" cy="18" r="3.5" />
                <path d="m8.5 11.5 3 3" />
              </svg>
            </div>
            <div style={{ display: 'grid', gap: '0.35rem', minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{t.dashboard.connectAccounts}</div>
              <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t.dashboard.connectAccountsDescription}
              </div>
              {!isLoadingConnections && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '999px',
                      background: '#0ea5e9',
                      color: 'white',
                      fontSize: '0.9rem',
                    }}
                  >
                    {connectionsCount ?? 0}
                  </span>
                  <span>{connectionsCount ? `${connectionsCount} ${t.dashboard.connectedAccounts}` : t.dashboard.noConnections}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push('/connections')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 10px 20px -8px rgba(14, 165, 233, 0.4)',
              transition: 'all 0.2s ease',
              minWidth: '200px',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 28px -10px rgba(14, 165, 233, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(14, 165, 233, 0.4)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
              <path d="M16.5 4.5 20 8" />
              <path d="M4 16 7.5 19.5" />
            </svg>
            <span>{t.dashboard.manageConnections}</span>
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{stat.emoji}</span>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{stat.label}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{t.dashboard.recentPosts}</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                {posts.length > 0
                  ? `${posts.length} ${t.dashboard.posts.toLowerCase()}`
                  : t.dashboard.noPosts}
              </p>
            </div>
            <button
              onClick={() => refreshPosts()}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#475569',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              ↻ Atualizar
            </button>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>{t.common.loading}</div>
          ) : posts.length === 0 ? (
            <div
              style={{
                background: 'white',
                padding: '3rem',
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>
                {t.dashboard.noPosts}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                {t.dashboard.createFirstPost}
              </p>
              <button
                onClick={() => router.push('/new-post')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {t.navbar.newPost}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

