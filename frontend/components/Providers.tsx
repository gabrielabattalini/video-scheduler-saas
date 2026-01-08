'use client';

import { LanguageProvider } from '@/lib/i18n/language-context';
import { PostsProvider } from '@/lib/posts-context';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <PostsProvider>
        {children}
      </PostsProvider>
    </LanguageProvider>
  );
}


