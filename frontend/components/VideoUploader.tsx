'use client';

import { useRef, useState } from 'react';
import { api } from '@/lib/api';

type UploadResult = {
  videoUrl: string;
  videoKey: string;
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null;
  metadata?: {
    originalName?: string;
    size?: number;
    duration?: number;
    [key: string]: any;
  };
};

type Props = {
  onUploadComplete: (data: UploadResult) => void;
  onError?: (error: string) => void;
};

export default function VideoUploader({ onUploadComplete, onError }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      onError?.('Tipo de arquivo não suportado. Use: MP4, MPEG, MOV, AVI ou WebM');
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      onError?.('Arquivo muito grande. Tamanho máximo: 500MB');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await api.post('/api/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      const { data } = response.data;
      onUploadComplete({
        videoUrl: data.videoUrl,
        videoKey: data.videoKey,
        thumbnailUrl: data.thumbnailUrl,
        thumbnailKey: data.thumbnailKey,
        metadata: data.metadata,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer upload do vídeo';
      onError?.(errorMessage);
      console.error('Erro no upload:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div
      style={{
        border: '2px dashed #ddd',
        padding: '1.5rem',
        borderRadius: '12px',
        textAlign: 'center',
        background: isUploading ? '#f9fafb' : 'white',
        transition: 'all 0.3s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {!isUploading ? (
        <>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            Selecionar Vídeo
          </button>
          <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
            Formatos: MP4, MPEG, MOV, AVI, WebM (máx. 500MB)
          </p>
        </>
      ) : (
        <>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Enviando: {fileName}
          </p>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: '#667eea',
                transition: 'width 0.3s',
              }}
            />
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
            {uploadProgress}% concluído...
          </p>
        </>
      )}
    </div>
  );
}
