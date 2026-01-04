'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';
import VideoUploader from '@/components/VideoUploader';

type UploadedVideoData = {
  videoUrl: string;
  videoKey: string;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  metadata?: {
    originalName?: string;
    size?: number;
    duration?: number;
    [key: string]: any;
  };
};

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram'>('youtube');
  const [videoData, setVideoData] = useState<UploadedVideoData | null>(null);
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
  }, [router]);

  const handleUploadComplete = (data: UploadedVideoData) => {
    console.log('Upload completo:', data);
    setVideoData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoData) {
      alert('Por favor, faça upload de um vídeo primeiro');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/posts', {
        title,
        description,
        platform,
        videoUrl: videoData.videoUrl,
        videoKey: videoData.videoKey,
        thumbnailUrl: videoData.thumbnailUrl,
        thumbnailKey: videoData.thumbnailKey,
        metadata: videoData.metadata,
      });

      alert('Post criado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div
        style={{
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🎬 Video Scheduler</h1>

          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ← Voltar
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Novo Post com Vídeo</h2>

          <form onSubmit={handleSubmit}>
            {/* Upload de Vídeo */}
            <div style={{ marginBottom: '2rem' }}>
              <VideoUploader onUploadComplete={handleUploadComplete} />

              {videoData && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #86efac',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>
                    ✅ Vídeo enviado com sucesso!
                  </div>

                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    <div>📁 Arquivo: {videoData.metadata?.originalName || '—'}</div>
                    <div>
                      📊 Tamanho:{' '}
                      {typeof videoData.metadata?.size === 'number'
                        ? `${(videoData.metadata.size / (1024 * 1024)).toFixed(2)} MB`
                        : '—'}
                    </div>

                    {typeof videoData.metadata?.duration === 'number' && (
                      <div>
                        ⏱️ Duração: {Math.floor(videoData.metadata.duration / 60)}:
                        {Math.floor(videoData.metadata.duration % 60)
                          .toString()
                          .padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Título */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ex: Meu vídeo incrível"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Descreva seu vídeo..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Plataforma */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Plataforma</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading || !videoData}
              style={{
                width: '100%',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                background: loading || !videoData ? '#9ca3af' : '#667eea',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading || !videoData ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Criando...' : '✨ Criar Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
