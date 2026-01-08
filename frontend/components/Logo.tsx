'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  onClick?: () => void;
  horizontal?: boolean;
}

export function Logo({ size = 'medium', showText = true, onClick, horizontal = false }: LogoProps) {
  const sizes = {
    small: { icon: 40, text: '1rem', gap: '0.5rem' },
    medium: { icon: 56, text: '1.25rem', gap: '0.75rem' },
    large: { icon: 72, text: '2rem', gap: '1rem' },
  };

  const currentSize = sizes[size];

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        gap: currentSize.gap,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: currentSize.icon,
          height: currentSize.icon,
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/autoedito-logo.jpg"
          alt="Autoedito"
          fill
          sizes={`${currentSize.icon}px`}
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      {showText && (
        <span
          style={{
            fontSize: currentSize.text,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          Autoedito
        </span>
      )}
    </div>
  );
}
