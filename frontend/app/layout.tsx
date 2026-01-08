import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'Autoedito - Agende e publique vídeos em múltiplas plataformas',
  description:
    'Plataforma completa para agendamento e publicação de vídeos no YouTube, TikTok, Instagram e mais.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="tiktok-developers-site-verification" content="ht4jPE0BITYtq2sboP2jmWtwwfjd4633" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


