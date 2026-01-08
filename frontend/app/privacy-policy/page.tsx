'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/i18n/language-context';
import { Language } from '@/lib/i18n/translations';

type Section = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type PrivacyCopy = {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
};

const enCopy: PrivacyCopy = {
  title: 'Privacy Policy',
  updated: 'Last updated: 2026-01-08',
  intro:
    'This Privacy Policy explains how Autoedito collects, uses, and protects your information when you use our services.',
  sections: [
    {
      title: 'Information we collect',
      paragraphs: [
        'We collect information you provide when creating an account and using the platform.',
      ],
      bullets: [
        'Account data (name, email, password).',
        'Content you upload (videos, thumbnails, captions).',
        'Usage data (features used, pages visited, and device/browser data).',
      ],
    },
    {
      title: 'How we use information',
      paragraphs: ['We use your information to operate, secure, and improve the platform.'],
      bullets: [
        'Provide, maintain, and improve the service.',
        'Authenticate users and protect accounts.',
        'Send service-related messages and support responses.',
      ],
    },
    {
      title: 'Sharing of information',
      paragraphs: [
        'We do not sell your personal data. We may share information with trusted providers only as needed to run the service.',
      ],
      bullets: [
        'Infrastructure and storage providers.',
        'Analytics or monitoring tools.',
        'Legal requirements when required by law.',
      ],
    },
    {
      title: 'Retention',
      paragraphs: [
        'We keep your data only as long as necessary to provide the service and comply with legal obligations.',
      ],
    },
    {
      title: 'Your rights',
      paragraphs: [
        'You can request access, correction, or deletion of your data by contacting us.',
      ],
    },
    {
      title: 'Security',
      paragraphs: [
        'We use reasonable technical and organizational measures to protect your data. No system is 100% secure.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: ['Questions? Contact us at contato@autoedito.com.'],
    },
  ],
};

const copyByLang: Record<Language, PrivacyCopy> = {
  pt: {
    title: 'Politica de Privacidade',
    updated: 'Ultima atualizacao: 2026-01-08',
    intro:
      'Esta Politica de Privacidade explica como a Autoedito coleta, usa e protege suas informacoes ao usar nossos servicos.',
    sections: [
      {
        title: 'Informacoes que coletamos',
        paragraphs: [
          'Coletamos informacoes fornecidas por voce ao criar conta e ao usar a plataforma.',
        ],
        bullets: [
          'Dados da conta (nome, email, senha).',
          'Conteudos enviados (videos, miniaturas, legendas).',
          'Dados de uso (recursos utilizados, paginas visitadas e dados do dispositivo/navegador).',
        ],
      },
      {
        title: 'Como usamos as informacoes',
        paragraphs: ['Usamos seus dados para operar, proteger e melhorar a plataforma.'],
        bullets: [
          'Fornecer, manter e melhorar o servico.',
          'Autenticar usuarios e proteger contas.',
          'Enviar mensagens de suporte e comunicacoes do servico.',
        ],
      },
      {
        title: 'Compartilhamento de informacoes',
        paragraphs: [
          'Nao vendemos seus dados pessoais. Podemos compartilhar dados com provedores confiaveis apenas quando necessario.',
        ],
        bullets: [
          'Provedores de infraestrutura e armazenamento.',
          'Ferramentas de analise e monitoramento.',
          'Obrigacoes legais, quando exigido por lei.',
        ],
      },
      {
        title: 'Retencao',
        paragraphs: [
          'Mantemos seus dados pelo tempo necessario para fornecer o servico e cumprir obrigacoes legais.',
        ],
      },
      {
        title: 'Seus direitos',
        paragraphs: [
          'Voce pode solicitar acesso, correcao ou exclusao de dados entrando em contato.',
        ],
      },
      {
        title: 'Seguranca',
        paragraphs: [
          'Adotamos medidas razoaveis para proteger seus dados. Nenhum sistema e 100% seguro.',
        ],
      },
      {
        title: 'Contato',
        paragraphs: ['Duvidas? Fale conosco em contato@autoedito.com.'],
      },
    ],
  },
  en: enCopy,
  ru: enCopy,
  zh: enCopy,
};

const getCopy = (language: Language) => copyByLang[language] || enCopy;

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Logo size="small" showText horizontal />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <span className="sr-only">
          tiktok-developers-site-verification=uDsuiDVmLTF92IfHsyom8G85luTa84l7
        </span>
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{copy.title}</h1>
            <p className="text-sm text-gray-500">{copy.updated}</p>
          </div>
          <p className="text-lg text-gray-700 mb-10">{copy.intro}</p>
          <div className="space-y-8">
            {copy.sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
