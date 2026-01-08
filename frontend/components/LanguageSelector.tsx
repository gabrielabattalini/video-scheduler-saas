'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { Language } from '@/lib/i18n/translations';

const languages: { code: Language; name: string; flagCode: string }[] = [
  { code: 'pt', name: 'Português', flagCode: 'BR' },
  { code: 'en', name: 'English', flagCode: 'EN' },
  { code: 'ru', name: 'Русский', flagCode: 'RU' },
  { code: 'zh', name: '中文', flagCode: 'ZH' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem 2.5rem 0.5rem 0.75rem',
          background: 'white',
          color: '#1e293b',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.5rem',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          minWidth: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span
          style={{
            fontSize: '1rem',
            lineHeight: '1',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '24px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: '700',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {selectedLanguage.flagCode}
        </span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            background: 'white',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '160px',
            overflow: 'hidden',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: language === lang.code ? 'rgba(102, 126, 234, 0.1)' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: language === lang.code ? '600' : '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'background 0.2s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.background = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '20px',
                  borderRadius: '4px',
                  background:
                    language === lang.code
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  color: language === lang.code ? 'white' : '#475569',
                  fontWeight: '700',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.5px',
                  flexShrink: 0,
                }}
              >
                {lang.flagCode}
              </span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
