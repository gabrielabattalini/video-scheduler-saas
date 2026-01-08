'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Detectar idioma do navegador ou IP
    const detectLanguage = async () => {
      try {
        // Primeiro, verifica se há um idioma salvo no localStorage
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && ['pt', 'en', 'ru', 'zh'].includes(savedLanguage)) {
          setLanguageState(savedLanguage);
          return;
        }

        // Tenta detectar pelo IP usando uma API gratuita
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          if (data.country_code) {
            const countryToLanguage: Record<string, Language> = {
              'BR': 'pt',
              'PT': 'pt',
              'RU': 'ru',
              'CN': 'zh',
              'TW': 'zh',
              'HK': 'zh',
              'US': 'en',
              'GB': 'en',
              'CA': 'en',
              'AU': 'en',
            };

            const detectedLang = countryToLanguage[data.country_code];
            if (detectedLang) {
              setLanguageState(detectedLang);
              localStorage.setItem('language', detectedLang);
              return;
            }
          }
        } catch (ipError) {
          console.log('Não foi possível detectar idioma por IP');
        }

        // Fallback: detectar pelo navegador
        const browserLang = navigator.language.split('-')[0];
        if (['pt', 'en', 'ru', 'zh'].includes(browserLang)) {
          setLanguageState(browserLang as Language);
          localStorage.setItem('language', browserLang);
        }
      } catch (error) {
        console.error('Erro ao detectar idioma:', error);
      }
    };

    detectLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // Retorna traduções em português durante SSR para evitar hydration mismatch
  const t = isClient ? translations[language] : translations['pt'];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


