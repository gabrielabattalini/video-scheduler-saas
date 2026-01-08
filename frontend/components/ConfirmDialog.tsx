'use client';

import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#0f172a',
          color: '#e2e8f0',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
          border: '1px solid #1f2937',
        }}
      >
        {title && (
          <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            {title}
          </h3>
        )}
        <p style={{ margin: 0, marginBottom: '1rem', lineHeight: 1.5, color: '#cbd5e1' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          {cancelLabel && (
            <button
              onClick={onCancel}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                border: '1px solid #334155',
                background: 'transparent',
                color: '#e2e8f0',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '110px',
              }}
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              minWidth: '110px',
              boxShadow: '0 10px 25px rgba(99,102,241,0.35)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
