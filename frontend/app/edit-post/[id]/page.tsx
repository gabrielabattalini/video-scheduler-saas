'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePosts, type Platform } from '@/lib/posts-context';
import { authService } from '@/lib/auth';
import { postsApi } from '@/lib/posts-api';
import { Navbar } from '@/components/Navbar';
import { generateTimeSlots, combineDateAndTime, splitDateTime, isFutureDateTime, getMinDateTime } from '@/lib/date-utils';

const platforms: { value: Platform; label: string; icon: string; color: string }[] = [
  { value: 'youtube', label: 'YouTube', icon: '📺', color: '#FF0000' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000000' },
  { value: 'instagram', label: 'Instagram', icon: '📸', color: '#E4405F' },
];

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { updatePost, deletePost } = usePosts();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['youtube']);
  const [publishOption, setPublishOption] = useState<'immediate' | 'scheduled' | 'draft'>('draft');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [error, setError] = useState('');
  const [dateTimeError, setDateTimeError] = useState('');

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (id) {
      loadPost();
    }
  }, [id, router]);

  const loadPost = async () => {
    try {
      setIsLoadingPost(true);
      const post = await postsApi.get(id as string);
      setTitle(post.title);
      setDescription(post.description || '');
      setVideoUrl(post.videoUrl || '');
      
      // Load platforms - support both new (platforms array) and old (platform string) format
      const platformsArray = post.platforms || (post.platform ? [post.platform as Platform] : ['youtube']);
      setSelectedPlatforms(platformsArray);

      // Determine publish option based on post data
      if (post.status === 'published') {
        setPublishOption('immediate');
      } else if (post.scheduledAt) {
        setPublishOption('scheduled');
        const { date, time } = splitDateTime(post.scheduledAt);
        setScheduleDate(date);
        setScheduleTime(time || '12:00');
      } else {
        setPublishOption('draft');
      }

      // Set default date if not set
      if (!scheduleDate) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setScheduleDate(`${year}-${month}-${day}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar post');
      setTimeout(() => router.push('/dashboard'), 2000);
    } finally {
      setIsLoadingPost(false);
    }
  };

  // Validate date/time when they change
  useEffect(() => {
    if (publishOption === 'scheduled' && scheduleDate && scheduleTime) {
      if (!isFutureDateTime(scheduleDate, scheduleTime)) {
        setDateTimeError('A data e hora devem ser no futuro');
      } else {
        setDateTimeError('');
      }
    } else {
      setDateTimeError('');
    }
  }, [scheduleDate, scheduleTime, publishOption]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        // Remove platform if already selected, but keep at least one
        if (prev.length > 1) {
          return prev.filter((p) => p !== platform);
        }
        return prev;
      } else {
        // Add platform
        return [...prev, platform];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError('');
    setDateTimeError('');
    
    if (selectedPlatforms.length === 0) {
      setError('Selecione pelo menos uma plataforma');
      return;
    }

    if (publishOption === 'scheduled' && scheduleDate && scheduleTime) {
      if (!isFutureDateTime(scheduleDate, scheduleTime)) {
        setDateTimeError('A data e hora devem ser no futuro');
        return;
      }
    }

    setIsLoading(true);

    try {
      let scheduledAt: string | undefined;
      
      if (publishOption === 'immediate') {
        scheduledAt = new Date().toISOString();
      } else if (publishOption === 'scheduled' && scheduleDate && scheduleTime) {
        scheduledAt = combineDateAndTime(scheduleDate, scheduleTime);
      }

      await updatePost(id as string, {
        title,
        description: description || undefined,
        videoUrl: videoUrl || undefined,
        platforms: selectedPlatforms,
        scheduledAt,
      });
      alert('Post atualizado! ✅');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Tem certeza que deseja deletar este post?')) {
      try {
        await deletePost(id as string);
        alert('Post deletado com sucesso');
        router.push('/dashboard');
      } catch (err: any) {
        alert(err.message || 'Erro ao deletar post');
      }
    }
  };

  if (isLoadingPost) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <div style={{ fontSize: '1.125rem', color: '#64748b', fontWeight: '500' }}>Carregando post...</div>
        </div>
      </div>
    );
  }

  const primaryPlatform = platforms.find((p) => selectedPlatforms.includes(p.value));
  const minDateTime = getMinDateTime();
  const [minDate] = minDateTime.split('T');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#64748b',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#334155';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          ← Voltar ao Dashboard
        </button>

        <div
          style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>
                Editar Post
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Atualize as informações do seu post</p>
            </div>
            <button
              onClick={handleDelete}
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
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🗑️ Deletar
            </button>
          </div>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#334155',
                  fontSize: '0.95rem',
                }}
              >
                Título *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Ex: Meu vídeo incrível"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Descrição */}
            <div>
              <label
                htmlFor="description"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#334155',
                  fontSize: '0.95rem',
                }}
              >
                Descrição
              </label>
              <textarea
                id="description"
                placeholder="Descreva seu vídeo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* URL do Vídeo */}
            <div>
              <label
                htmlFor="videoUrl"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#334155',
                  fontSize: '0.95rem',
                }}
              >
                URL do Vídeo
              </label>
              <input
                id="videoUrl"
                type="url"
                placeholder="https://exemplo.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Plataformas (Múltipla Seleção) */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  color: '#334155',
                  fontSize: '0.95rem',
                }}
              >
                Plataformas * (Selecione uma ou mais)
                {selectedPlatforms.length > 0 && (
                  <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#64748b', marginLeft: '0.5rem' }}>
                    ({selectedPlatforms.length} selecionada{selectedPlatforms.length > 1 ? 's' : ''})
                  </span>
                )}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {platforms.map((p) => {
                  const isSelected = selectedPlatforms.includes(p.value);
                  const isOnlySelected = isSelected && selectedPlatforms.length === 1;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      disabled={isOnlySelected}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1.5rem 1rem',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? p.color : '#e2e8f0'}`,
                        background: isSelected ? `${p.color}15` : 'white',
                        cursor: isOnlySelected ? 'not-allowed' : 'pointer',
                        fontWeight: isSelected ? '600' : '500',
                        transition: 'all 0.2s',
                        color: isSelected ? p.color : '#64748b',
                        opacity: isOnlySelected ? 0.6 : 1,
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        if (!isOnlySelected) {
                          e.currentTarget.style.borderColor = isSelected ? p.color : p.color;
                          e.currentTarget.style.background = isSelected ? `${p.color}20` : `${p.color}05`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isOnlySelected) {
                          e.currentTarget.style.borderColor = isSelected ? p.color : '#e2e8f0';
                          e.currentTarget.style.background = isSelected ? `${p.color}15` : 'white';
                        }
                      }}
                    >
                      <span style={{ fontSize: '2.5rem' }}>{p.icon}</span>
                      <span style={{ fontSize: '0.95rem' }}>{p.label}</span>
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: p.color,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedPlatforms.length === 0 && (
                <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
                  Selecione pelo menos uma plataforma
                </p>
              )}
            </div>

            {/* Opções de Publicação */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  color: '#334155',
                  fontSize: '0.95rem',
                }}
              >
                Quando publicar? *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${publishOption === 'immediate' ? '#10b981' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: publishOption === 'immediate' ? '#d1fae5' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="radio"
                    name="publishOption"
                    value="immediate"
                    checked={publishOption === 'immediate'}
                    onChange={(e) => setPublishOption(e.target.value as any)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      🚀 Publicar Imediatamente
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                      O post será publicado agora
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${publishOption === 'scheduled' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: publishOption === 'scheduled' ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="radio"
                    name="publishOption"
                    value="scheduled"
                    checked={publishOption === 'scheduled'}
                    onChange={(e) => setPublishOption(e.target.value as any)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      📅 Agendar Publicação
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                      Escolha data e hora específicas
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${publishOption === 'draft' ? '#64748b' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: publishOption === 'draft' ? '#f1f5f9' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="radio"
                    name="publishOption"
                    value="draft"
                    checked={publishOption === 'draft'}
                    onChange={(e) => setPublishOption(e.target.value as any)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      💾 Salvar como Rascunho
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                      Salvar sem publicar
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Data e Hora (quando agendado) */}
            {publishOption === 'scheduled' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <label
                    htmlFor="scheduleDate"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: '#334155',
                      fontSize: '0.875rem',
                    }}
                  >
                    Data
                  </label>
                  <input
                    id="scheduleDate"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={minDate}
                    required={publishOption === 'scheduled'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: dateTimeError ? '1px solid #dc2626' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      background: 'white',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = dateTimeError ? '#dc2626' : '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="scheduleTime"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: '#334155',
                      fontSize: '0.875rem',
                    }}
                  >
                    Hora (intervalos de 15 min)
                  </label>
                  <select
                    id="scheduleTime"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required={publishOption === 'scheduled'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: dateTimeError ? '1px solid #dc2626' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      background: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = dateTimeError ? '#dc2626' : '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                {dateTimeError && (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      padding: '0.75rem',
                      background: '#fee2e2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      color: '#dc2626',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    ⚠️ {dateTimeError}
                  </div>
                )}
                {scheduleDate && scheduleTime && !dateTimeError && (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      padding: '1rem',
                      background: '#dbeafe',
                      border: '1px solid #93c5fd',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}
                  >
                    <span style={{ color: '#1e3a8a', fontWeight: '600', display: 'block' }}>
                      ✓ Agendado para:{' '}
                      <span style={{ color: '#1e3a8a', fontWeight: '700' }}>
                        {new Date(combineDateAndTime(scheduleDate, scheduleTime)).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Botões */}
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#64748b',
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
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !title || selectedPlatforms.length === 0 || !!dateTimeError}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: isLoading || !title || selectedPlatforms.length === 0 || !!dateTimeError ? '#cbd5e1' : primaryPlatform?.color || '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading || !title || selectedPlatforms.length === 0 || !!dateTimeError ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  boxShadow: isLoading || !title || selectedPlatforms.length === 0 || !!dateTimeError ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && title && selectedPlatforms.length > 0 && !dateTimeError) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && title && selectedPlatforms.length > 0 && !dateTimeError) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
