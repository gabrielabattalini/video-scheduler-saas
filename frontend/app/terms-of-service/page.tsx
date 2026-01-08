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

type TermsCopy = {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
};

const enCopy: TermsCopy = {
  title: 'Terms of Service',
  updated: 'Last updated: 2026-01-08',
  intro: 'These Terms govern your access to and use of Autoedito.',
  sections: [
    {
      title: 'Acceptance of terms',
      paragraphs: [
        'By using Autoedito you agree to these Terms. If you do not agree, do not use the service.',
      ],
    },
    {
      title: 'Accounts',
      paragraphs: ['You are responsible for your account and must keep your credentials secure.'],
      bullets: [
        'Provide accurate information.',
        'Do not share your password.',
        'Notify us of any unauthorized access.',
      ],
    },
    {
      title: 'Acceptable use',
      paragraphs: ['You agree not to misuse the platform or break applicable laws.'],
      bullets: [
        'No illegal, harmful, or infringing content.',
        'No attempts to bypass security.',
        'No abusive or disruptive behavior.',
      ],
    },
    {
      title: 'Content and ownership',
      paragraphs: [
        'You retain ownership of your content. You grant Autoedito the limited rights needed to operate the service.',
      ],
    },
    {
      title: 'Third-party platforms',
      paragraphs: [
        'When you connect social accounts, those platforms have their own terms and policies. You are responsible for complying with them.',
      ],
    },
    {
      title: 'Payments',
      paragraphs: [
        'If you purchase a paid plan, you agree to the pricing and billing terms presented at checkout.',
      ],
    },
    {
      title: 'Termination',
      paragraphs: [
        'We may suspend or terminate accounts that violate these Terms. You may stop using the service at any time.',
      ],
    },
    {
      title: 'Disclaimer and limitation of liability',
      paragraphs: [
        'The service is provided "as is" without warranties. To the fullest extent permitted by law, Autoedito is not liable for indirect damages.',
      ],
    },
    {
      title: 'Changes',
      paragraphs: [
        'We may update these Terms from time to time. Continued use of the service means you accept the updated Terms.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: ['Questions? Contact us at contato@autoedito.com.'],
    },
  ],
};

const copyByLang: Record<Language, TermsCopy> = {
  pt: {
    title: 'Termos de Servico',
    updated: 'Ultima atualizacao: 2026-01-08',
    intro: 'Estes Termos regem o acesso e o uso da Autoedito.',
    sections: [
      {
        title: 'Aceite dos termos',
        paragraphs: [
          'Ao usar a Autoedito voce concorda com estes Termos. Se nao concordar, nao utilize o servico.',
        ],
      },
      {
        title: 'Contas',
        paragraphs: ['Voce e responsavel pela sua conta e deve manter suas credenciais seguras.'],
        bullets: [
          'Forneca informacoes corretas.',
          'Nao compartilhe sua senha.',
          'Avise sobre acessos nao autorizados.',
        ],
      },
      {
        title: 'Uso aceitavel',
        paragraphs: ['Voce concorda em nao usar a plataforma para violar leis ou direitos.'],
        bullets: [
          'Nao publicar conteudo ilegal, nocivo ou que infrinja direitos.',
          'Nao tentar burlar seguranca.',
          'Nao praticar abuso ou comportamento disruptivo.',
        ],
      },
      {
        title: 'Conteudo e propriedade',
        paragraphs: [
          'Voce permanece dono do seu conteudo e concede a Autoedito os direitos necessarios para operar o servico.',
        ],
      },
      {
        title: 'Plataformas de terceiros',
        paragraphs: [
          'Ao conectar contas sociais, voce deve cumprir os termos e politicas dessas plataformas.',
        ],
      },
      {
        title: 'Pagamentos',
        paragraphs: [
          'Ao contratar um plano pago, voce concorda com os valores e regras informados no checkout.',
        ],
      },
      {
        title: 'Encerramento',
        paragraphs: [
          'Podemos suspender ou encerrar contas que violem estes Termos. Voce pode parar de usar o servico a qualquer momento.',
        ],
      },
      {
        title: 'Isencao e limitacao de responsabilidade',
        paragraphs: [
          'O servico e fornecido "como esta", sem garantias. Na extensao permitida por lei, a Autoedito nao se responsabiliza por danos indiretos.',
        ],
      },
      {
        title: 'Alteracoes',
        paragraphs: [
          'Podemos atualizar estes Termos. O uso continuo indica concordancia com a versao mais recente.',
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

export default function TermsOfServicePage() {
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
