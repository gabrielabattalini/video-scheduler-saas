'use client';

import { Post } from '@/lib/posts-api';
import { formatDate, formatDateTime } from '@/lib/date-utils';

interface PostCardProps {
  post: Post;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.09z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#ig-gradient)" aria-hidden="true">
    <defs>
      <linearGradient id="ig-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E4405F" />
        <stop offset="50%" stopColor="#C13584" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const KawaiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF69B4" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);

const platformData: Record<string, { Icon: () => JSX.Element; color: string; label: string }> = {
  youtube: { Icon: YouTubeIcon, color: '#FF0000', label: 'YouTube' },
  tiktok: { Icon: TikTokIcon, color: '#000000', label: 'TikTok' },
  instagram: { Icon: InstagramIcon, color: '#E4405F', label: 'Instagram' },
  facebook: { Icon: FacebookIcon, color: '#1877F2', label: 'Facebook' },
  twitter: { Icon: XIcon, color: '#000000', label: 'X' },
  kawai: { Icon: KawaiIcon, color: '#FF69B4', label: 'Kawai' },
};

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Pendente', bg: '#fef3c7', text: '#92400e', icon: '…' },
  scheduled: { label: 'Agendado', bg: '#dbeafe', text: '#1e40af', icon: '⏰' },
  published: { label: 'Publicado', bg: '#d1fae5', text: '#065f46', icon: '✓' },
  draft: { label: 'Rascunho', bg: '#f3f4f6', text: '#374151', icon: '✎' },
};

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  // Get platforms - support both new (platforms array) and old (platform string) format
  const platformsArrayRaw: string[] = post.platforms || (post.platform ? [post.platform] : []);
  const platformsArray = Array.from(
    new Set(
      platformsArrayRaw
        .filter(Boolean)
        .map((platform) => (platform === 'x' ? 'twitter' : platform.toLowerCase())),
    ),
  );
  const status = statusConfig[post.status] || statusConfig.draft;
  const workspaceName = post.workspaceName || post.workspace?.name || 'Sem workspace';
  const primaryPlatform = platformsArray[0] ? platformData[platformsArray[0]] : platformData.youtube;

  return (
    <div
      style={{
        background: 'white',
        padding: '1.75rem',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${primaryPlatform.color}20`,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {/* Platforms badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {platformsArray.map((platformKey) => {
                const platform = platformData[platformKey] || platformData.youtube;
                const PlatformIcon = platform.Icon;
                return (
                  <div
                    key={platformKey}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '999px',
                        background: '#ffffff',
                        border: `1px solid ${platform.color}40`,
                      }}
                    >
                      <PlatformIcon />
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>
                      {platform.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Status badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.875rem',
                borderRadius: '20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '999px',
                  background: status.bg,
                  color: status.text,
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  border: `1px solid ${status.text}40`,
                }}
              >
                {status.icon}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f172a', textTransform: 'capitalize' }}>
                {status.label}
              </span>
            </div>
            {/* Workspace badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.375rem 0.85rem',
                borderRadius: '20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
              }}
              title={workspaceName}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '999px',
                  background: '#6366f1',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '0.02em',
                }}
              >
                WS
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{workspaceName}</span>
            </div>
          </div>
          {/* Titulo */}
          <h3
            style={{
              fontSize: '1.375rem',
              fontWeight: '700',
              margin: '0 0 0.75rem 0',
              color: '#1e293b',
              lineHeight: '1.4',
            }}
          >
            {post.title}
          </h3>

          {/* Descrição */}
          {post.description && (
            <p
              style={{
                color: '#64748b',
                marginBottom: '1rem',
                lineHeight: '1.6',
                fontSize: '0.95rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.description}
            </p>
          )}

          {/* Informações */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              fontSize: '0.875rem',
              color: '#64748b',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {post.scheduledAt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>📅</span>
                <span style={{ fontWeight: '500' }}>
                  {formatDateTime(post.scheduledAt)}
                </span>
              </div>
            )}
            {post.videoUrl && (
              <a
                href={post.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: primaryPlatform.color,
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                <span>▶️</span>
                <span>Ver vídeo</span>
              </a>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
              <span>🕒</span>
              <span>Criado em {formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => onEdit(post.id)}
            style={{
              padding: '0.625rem 1.25rem',
              background: primaryPlatform.color,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              boxShadow: `0 2px 4px ${primaryPlatform.color}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 4px 8px ${primaryPlatform.color}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 4px ${primaryPlatform.color}40`;
            }}
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDelete(post.id)}
            style={{
              padding: '0.625rem 1.25rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
              e.currentTarget.style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.background = '#ef4444';
            }}
          >
            🗑️ Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
