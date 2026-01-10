'use client';

import { Post } from '@/lib/posts-api';
import { formatDate, formatDateTime } from '@/lib/date-utils';

interface PostCardProps {
  post: Post;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const platformData: Record<string, { icon: string; color: string; label: string }> = {
  youtube: { icon: 'YT', color: '#FF0000', label: 'YouTube' },
  tiktok: { icon: 'TT', color: '#000000', label: 'TikTok' },
  instagram: { icon: 'IG', color: '#E4405F', label: 'Instagram' },
  facebook: { icon: 'FB', color: '#1877F2', label: 'Facebook' },
  twitter: { icon: 'X', color: '#000000', label: 'X' },
  kawai: { icon: 'KW', color: '#FF69B4', label: 'Kawai' },
};

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Pendente', bg: '#fef3c7', text: '#92400e', icon: 'PND' },
  scheduled: { label: 'Agendado', bg: '#dbeafe', text: '#1e40af', icon: 'SCH' },
  published: { label: 'Publicado', bg: '#d1fae5', text: '#065f46', icon: 'PUB' },
  draft: { label: 'Rascunho', bg: '#f3f4f6', text: '#374151', icon: 'DRF' },
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
                        width: '26px',
                        height: '26px',
                        borderRadius: '999px',
                        background: platform.color,
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {platform.icon}
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
