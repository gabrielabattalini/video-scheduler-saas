'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/language-context';
import { usePosts, type Platform } from '@/lib/posts-context';
import { authService } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { PlatformIcon, platformMeta, type PlatformKey } from '@/components/PlatformIcon';
import { generateTimeSlots, combineDateAndTime } from '@/lib/date-utils';
import { connectionsApi } from '@/lib/connections-api';
import VideoUploader from '@/components/VideoUploader';

const platforms: { value: Platform; label: string; color: string }[] = [
  { value: 'youtube', label: platformMeta.youtube.label, color: platformMeta.youtube.color },
  { value: 'tiktok', label: platformMeta.tiktok.label, color: platformMeta.tiktok.color },
  { value: 'instagram', label: platformMeta.instagram.label, color: platformMeta.instagram.color },
  { value: 'facebook', label: platformMeta.facebook.label, color: platformMeta.facebook.color },
  { value: 'twitter', label: platformMeta.twitter.label, color: platformMeta.twitter.color },
  { value: 'kawai', label: platformMeta.kawai.label, color: platformMeta.kawai.color },
];

export default function NewPostPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { addPost } = usePosts();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['youtube']);
  const [publishOption, setPublishOption] = useState<'immediate' | 'scheduled' | 'draft'>('draft');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState<{ id: string; name: string } | null>(null);
  const activeWorkspaceId = activeWorkspace?.id;

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const availableTimeSlots = useMemo(() => {
    if (!scheduleDate) return timeSlots;
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    if (scheduleDate !== todayString) {
      return timeSlots;
    }
    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    return timeSlots.filter((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes > nowMinutes;
    });
  }, [scheduleDate, timeSlots]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setScheduleDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (publishOption !== 'scheduled') return;
    if (availableTimeSlots.length === 0) {
      setScheduleTime('');
      return;
    }
    if (!availableTimeSlots.includes(scheduleTime)) {
      setScheduleTime(availableTimeSlots[0]);
    }
  }, [availableTimeSlots, publishOption, scheduleTime]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readWorkspace = () => {
      const id = localStorage.getItem('activeWorkspaceId');
      const name = localStorage.getItem('activeWorkspaceName');
      if (id && name) {
        setActiveWorkspace({ id, name });
      } else {
        setActiveWorkspace(null);
      }
    };
    readWorkspace();
    window.addEventListener('storage', readWorkspace);
    return () => window.removeEventListener('storage', readWorkspace);
  }, []);

  useEffect(() => {
    const loadConnections = async () => {
      if (!authService.isAuthenticated()) return;
      try {
        setIsLoadingConnections(true);
        const workspaceId = activeWorkspaceId || (typeof window !== 'undefined' ? localStorage.getItem('activeWorkspaceId') : null);
        if (!workspaceId) {
          setConnectedPlatforms([]);
          setSelectedPlatforms([]);
          return;
        }

        const connections = await connectionsApi.list(workspaceId);
        const supportedPlatforms = new Set(platforms.map((p) => p.value));
        const connected = Array.from(
          new Set(connections.map((c) => (c.platform || '').toLowerCase())),
        ).filter((platform): platform is Platform => supportedPlatforms.has(platform as Platform));

        setConnectedPlatforms(connected);
        setSelectedPlatforms((prev) => {
          const next = prev.filter((p) => connected.includes(p));
          if (next.length > 0) return next;
          return connected.length > 0 ? [connected[0]] : [];
        });
      } catch (err) {
        console.error('Erro ao carregar conexões:', err);
        setConnectedPlatforms([]);
        setSelectedPlatforms([]);
      } finally {
        setIsLoadingConnections(false);
      }
    };

    loadConnections();
  }, [activeWorkspaceId]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      if (!connectedPlatforms.includes(platform)) {
        return prev;
      }
      if (prev.includes(platform)) {
        if (prev.length > 1) return prev.filter((p) => p !== platform);
        return prev;
      }
      return [...prev, platform];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedPlatforms.length === 0) {
      setError(t.newPost.selectPlatform);
      return;
    }
    if (publishOption === 'scheduled' && !scheduleTime) {
      setError(t.newPost.noTimesAvailable);
      return;
    }

    setIsLoading(true);
    try {
      let scheduledAt: string | undefined;
      if (publishOption === 'immediate') {
        scheduledAt = new Date().toISOString();
      } else if (publishOption === 'scheduled' && scheduleDate && scheduleTime) {
        const selectedDate = new Date(combineDateAndTime(scheduleDate, scheduleTime));
        if (selectedDate <= new Date()) {
          setError(t.newPost.scheduleTimeInvalid);
          return;
        }
        scheduledAt = combineDateAndTime(scheduleDate, scheduleTime);
      }

      const workspaceId = activeWorkspaceId || (typeof window !== 'undefined' ? localStorage.getItem('activeWorkspaceId') : null);

      await addPost({
        title,
        description: description || undefined,
        videoUrl: videoUrl || undefined,
        platforms: selectedPlatforms,
        scheduledAt,
        workspaceId: workspaceId || undefined,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  const primaryPlatform = platforms.find((p) => selectedPlatforms.includes(p.value));

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
          }}
        >
          {t.common.back}
        </button>

        <div
          style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>
              {t.newPost.createPost}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{t.newPost.content}</p>
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
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>
                {t.newPost.title} *
              </label>
              <input
                type="text"
                placeholder={t.newPost.postContent}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>
                {t.newPost.workspaceLabel}
              </label>
              <input
                type="text"
                value={activeWorkspace?.name || t.newPost.workspacePlaceholder}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: '#f8fafc',
                  color: '#475569',
                  cursor: 'default',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>
                {t.newPost.descriptionLabel}
              </label>
              <textarea
                placeholder={t.newPost.descriptionPlaceholder}
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
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>
                {t.newPost.videoLinkLabel}
              </label>
              <input
                type="url"
                placeholder={t.newPost.videoLinkPlaceholder}
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
              <div style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '0.75rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t.newPost.uploadVideoLabel}
                </div>
                <VideoUploader
                  onUploadComplete={(data) => setVideoUrl(data.videoUrl)}
                  onError={(message) => setError(message)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: '#334155' }}>
                {t.newPost.selectPlatform}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {platforms.map((p) => {
                  const isSelected = selectedPlatforms.includes(p.value);
                  const isOnlySelected = isSelected && selectedPlatforms.length === 1;
                  const isConnected = connectedPlatforms.includes(p.value);
                  const isDisabled = isOnlySelected || !isConnected || isLoadingConnections;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      disabled={isDisabled}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '1.2rem 1rem',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? p.color : '#e2e8f0'}`,
                        background: isSelected ? '#eef2ff' : 'white',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        fontWeight: isSelected ? '600' : '500',
                        color: '#0f172a',
                        opacity: isConnected ? 1 : 0.45,
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '14px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <PlatformIcon platform={p.value as PlatformKey} size={30} />
                      </div>
                      <span style={{ fontSize: '0.95rem' }}>{p.label}</span>
                    </button>
                  );
                })}
              </div>
              {selectedPlatforms.length === 0 && (
                <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
                  {t.newPost.selectPlatform}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: '#334155' }}>
                {t.newPost.schedule}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '1rem',
                    border: `2px solid ${publishOption === 'immediate' ? '#10b981' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: publishOption === 'immediate' ? '#d1fae5' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="publishOption"
                    value="immediate"
                    checked={publishOption === 'immediate'}
                    onChange={() => setPublishOption('immediate')}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {t.newPost.publishNow}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.newPost.publishNow}</div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '1rem',
                    border: `2px solid ${publishOption === 'scheduled' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: publishOption === 'scheduled' ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="publishOption"
                    value="scheduled"
                    checked={publishOption === 'scheduled'}
                    onChange={() => setPublishOption('scheduled')}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {t.newPost.schedule}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {t.newPost.selectDate} / {t.newPost.selectTime}
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '1rem',
                    border: `2px solid ${publishOption === 'draft' ? '#64748b' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: publishOption === 'draft' ? '#f1f5f9' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="publishOption"
                    value="draft"
                    checked={publishOption === 'draft'}
                    onChange={() => setPublishOption('draft')}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {t.newPost.saveDraft}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                      {t.newPost.saveDraft}
                    </div>
                  </div>
                </label>
              </div>
            </div>

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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155', fontSize: '0.875rem' }}>
                    {t.newPost.selectDate}
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      background: 'white',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155', fontSize: '0.875rem' }}>
                    {t.newPost.selectTime}
                  </label>
                  <select
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                    disabled={availableTimeSlots.length === 0}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      background: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    {availableTimeSlots.length === 0 ? (
                      <option value="">{t.newPost.noTimesAvailable}</option>
                    ) : null}
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                {scheduleDate && scheduleTime && (
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
                      {t.newPost.scheduledFor}:{' '}
                      <span style={{ color: '#1e3a8a', fontWeight: '700' }}>
                        {new Date(combineDateAndTime(scheduleDate, scheduleTime)).toLocaleString(
                          language === 'pt' ? 'pt-BR' : language === 'ru' ? 'ru-RU' : language === 'zh' ? 'zh-CN' : 'en-US',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}

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
                }}
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={isLoading || !title || selectedPlatforms.length === 0}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: isLoading || !title || selectedPlatforms.length === 0 ? '#cbd5e1' : primaryPlatform?.color || '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading || !title || selectedPlatforms.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                {isLoading
                  ? t.common.save
                  : publishOption === 'immediate'
                  ? t.newPost.publishNow
                  : publishOption === 'scheduled'
                  ? t.newPost.schedule
                  : t.newPost.saveDraft}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
