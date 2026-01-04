'use client';

import { useRef, useState } from 'react';

type UploadResult = {
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

type Props = {
  onUploadComplete: (data: UploadResult) => void;
};

export default function VideoUploader({ onUploadComplete }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#111', color: '#fff' }}
      >
        Selecionar vídeo (teste)
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setFileName(file.name);

          // MOCK: só pra página renderizar sem dependências/ciclos
          onUploadComplete({
            videoUrl: 'mock-url',
            videoKey: 'mock-key',
            metadata: { originalName: file.name, size: file.size },
          });

          e.currentTarget.value = '';
        }}
      />

      {fileName && <div style={{ marginTop: 8, fontSize: 12 }}>Arquivo: {fileName}</div>}
    </div>
  );
}
