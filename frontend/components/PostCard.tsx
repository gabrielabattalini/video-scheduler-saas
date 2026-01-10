'use client';

import type { ReactNode } from 'react';

import { PlatformIcon, platformMeta, type PlatformKey } from '@/components/PlatformIcon';
import { formatDate, formatDateTime } from '@/lib/date-utils';
import type { Post } from '@/lib/posts-api';

interface PostCardProps {
  post: Post;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: ReactNode }> = {
  pending: {
    label: 'Pendente',
    bg: '#fef3c7',
    text: '#92400e',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5" />
      </svg>
    ),
  },
  scheduled: {
    label: 'Agendado',
    bg: '#dbeafe',
    text: '#1e40af',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  published: {
    label: 'Publicado',
    bg: '#d1fae5',
    text: '#065f46',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  draft: {
    label: 'Rascunho',
    bg: '#f3f4f6',
    text: '#374151',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8M8 12h8M8 16h6" />
      </svg>
    ),
  },
};

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const platformsArrayRaw: string[] = post.platforms || (post.platform ? [post.platform] : []);
  const platformsArray = Array.from(
    new Set(
      platformsArrayRaw
        .filter(Boolean)
        .map((platform) => (platform === 'x' ? 'twitter' : platform.toLowerCase())),
    ),
  ).filter((platform): platform is PlatformKey => platform in platformMeta);

  const status = statusConfig[post.status] || statusConfig.draft;
  const workspaceName = post.workspaceName || post.workspace?.name || 'Sem workspace';
  const primaryPlatform = platformMeta[platformsArray[0] || 'youtube'];

  return (
    <div
      style={{
        background: '#ffffff',
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
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {platformsArray.map((platformKey) => {
                const platform = platformMeta[platformKey];
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
                      <PlatformIcon platform={platformKey} size={16} />
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>
                      {platform.label}
                    </span>
                  </div>
                );
              })}
            </div>
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
                  border: `1px solid ${status.text}40`,
                }}
              >
                {status.icon}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f172a', textTransform: 'capitalize' }}>
                {status.label}
              </span>
            </div>
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
                W
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{workspaceName}</span>
            </div>
          </div>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <span style={{ fontWeight: '500' }}>{formatDateTime(post.scheduledAt)}</span>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill={primaryPlatform.color} aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Ver video</span>
              </a>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>Criado em {formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

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
            Editar
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
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
