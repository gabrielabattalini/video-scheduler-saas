'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Sparkles, Video, Zap } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/i18n/language-context';
import { Language } from '@/lib/i18n/translations';

type LandingCopy = {
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
    login: string;
    start: string;
  };
  featuresTitle: string;
  featuresSubtitle: string;
  features: { icon: typeof Video; title: string; description: string; color: string }[];
  howTitle: string;
  howSubtitle: string;
  steps: { step: string; title: string; description: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  footer: {
    product: string;
    company: string;
    support: string;
    links: {
      productFeatures: string;
      productPricing: string;
      productTemplates: string;
      companyAbout: string;
      companyBlog: string;
      companyCareers: string;
      supportDocs: string;
      supportContact: string;
      supportLogin: string;
    };
  };
};

const enCopy: LandingCopy = {
  nav: {
    features: 'Features',
    howItWorks: 'How it works',
    pricing: 'Pricing',
    login: 'Sign in',
    start: 'Start free',
  },
  featuresTitle: 'Everything you need to manage your videos',
  featuresSubtitle: 'Powerful tools to turn your ideas into professional videos',
  features: [
    {
      icon: Video,
      title: 'Smart scheduling',
      description: 'Schedule your posts for the best times across multiple platforms simultaneously.',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Sparkles,
      title: 'Multi-platform',
      description: 'Publish to YouTube, TikTok, Instagram and more with a single click.',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: Zap,
      title: 'Automatic publishing',
      description: 'Automate publishing on the social networks you have configured.',
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      icon: Shield,
      title: 'Secure and reliable',
      description: 'Your connections are safe and your videos stay protected in the cloud.',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Video,
      title: 'Video editor',
      description: 'Edit and create professional videos directly on the platform.',
      color: 'text-red-600 bg-red-100',
    },
    {
      icon: Sparkles,
      title: 'Analytics and metrics',
      description: 'Track the performance of your posts on every platform.',
      color: 'text-indigo-600 bg-indigo-100',
    },
  ],
  howTitle: 'How it works',
  howSubtitle: 'In 3 simple steps you schedule and publish your videos',
  steps: [
    {
      step: '01',
      title: 'Connect your networks',
      description: 'Connect your YouTube, TikTok, Instagram and other accounts.',
    },
    {
      step: '02',
      title: 'Create and schedule',
      description: 'Create posts, upload videos and set when to publish.',
    },
    {
      step: '03',
      title: 'Publish automatically',
      description: 'The platform publishes your videos at the scheduled time.',
    },
  ],
  ctaTitle: 'Ready to start?',
  ctaSubtitle: 'Join thousands of creators already using Autoedito',
  ctaPrimary: 'Create free account',
  footer: {
    product: 'Product',
    company: 'Company',
    support: 'Support',
    links: {
      productFeatures: 'Features',
      productPricing: 'Pricing',
      productTemplates: 'Templates',
      companyAbout: 'About',
      companyBlog: 'Blog',
      companyCareers: 'Careers',
      supportDocs: 'Documentation',
      supportContact: 'Contact',
      supportLogin: 'Login',
    },
  },
};

const copyByLang: Record<Language, LandingCopy> = {
  pt: {
    nav: {
      features: 'Recursos',
      howItWorks: 'Como funciona',
      pricing: 'Preços',
      login: 'Entrar',
      start: 'Começar grátis',
    },
    featuresTitle: 'Tudo que você precisa para gerenciar seus vídeos',
    featuresSubtitle: 'Recursos poderosos para transformar suas ideias em vídeos profissionais',
    features: [
      {
        icon: Video,
        title: 'Agendamento inteligente',
        description: 'Agende seus posts para os melhores horários em múltiplas plataformas simultaneamente.',
        color: 'text-blue-600 bg-blue-100',
      },
      {
        icon: Sparkles,
        title: 'Multiplataforma',
        description: 'Publique no YouTube, TikTok, Instagram e outras redes sociais com um único clique.',
        color: 'text-purple-600 bg-purple-100',
      },
      {
        icon: Zap,
        title: 'Publicação automática',
        description: 'Automatize a publicação de seus vídeos nas redes sociais configuradas.',
        color: 'text-yellow-600 bg-yellow-100',
      },
      {
        icon: Shield,
        title: 'Seguro e confiável',
        description: 'Suas conexões são seguras e seus vídeos ficam protegidos na nuvem.',
        color: 'text-green-600 bg-green-100',
      },
      {
        icon: Video,
        title: 'Editor de vídeo',
        description: 'Edite e crie vídeos profissionais diretamente na plataforma.',
        color: 'text-red-600 bg-red-100',
      },
      {
        icon: Sparkles,
        title: 'Análises e métricas',
        description: 'Acompanhe o desempenho de seus posts em todas as plataformas.',
        color: 'text-indigo-600 bg-indigo-100',
      },
    ],
    howTitle: 'Como funciona',
    howSubtitle: 'Em 3 passos simples, você agenda e publica seus vídeos',
    steps: [
      {
        step: '01',
        title: 'Conecte suas redes',
        description: 'Conecte suas contas do YouTube, TikTok, Instagram e outras plataformas.',
      },
      {
        step: '02',
        title: 'Crie e agende',
        description: 'Crie seus posts, faça upload de vídeos e defina quando publicar.',
      },
      {
        step: '03',
        title: 'Publique automaticamente',
        description: 'A plataforma publica seus vídeos no horário agendado.',
      },
    ],
    ctaTitle: 'Pronto para começar?',
    ctaSubtitle: 'Junte-se a milhares de criadores que já estão usando Autoedito',
    ctaPrimary: 'Criar conta grátis',
    footer: {
      product: 'Produto',
      company: 'Empresa',
      support: 'Suporte',
      links: {
        productFeatures: 'Recursos',
        productPricing: 'Preços',
        productTemplates: 'Templates',
        companyAbout: 'Sobre',
        companyBlog: 'Blog',
        companyCareers: 'Carreiras',
        supportDocs: 'Documentação',
        supportContact: 'Contato',
        supportLogin: 'Login',
      },
    },
  },
  en: enCopy,
  ru: {
    nav: {
      features: 'Ф�fнк�?ии',
      howItWorks: '�sак э�,о �?або�,ае�,',
      pricing: 'Цен�<',
      login: '�'ой�,и',
      start: 'На�?а�,�O беспла�,но',
    },
    featuresTitle: '�'се, �?�,о н�fжно для �fп�?авления видео',
    featuresSubtitle: '�oо�?н�<е инс�,�?�fмен�,�<, �?�,об�< п�?ев�?а�,и�,�O идеи в п�?о�"ессионал�Oн�<е �?олики',
    features: [
      {
        icon: Video,
        title: 'Умное плани�?ование',
        description: '�Yлани�?�fй�,е пос�,�< на л�f�?�^ее в�?емя с�?аз�f для нескол�Oки�. пла�,�"о�?м.',
        color: 'text-blue-600 bg-blue-100',
      },
      {
        icon: Sparkles,
        title: '�o�fл�O�,ипла�,�"о�?меннос�,�O',
        description: '�Y�fблик�fй�,е на YouTube, TikTok, Instagram и д�?�fгие се�,и одним кликом.',
        color: 'text-purple-600 bg-purple-100',
      },
      {
        icon: Zap,
        title: 'Ав�,оп�fблика�?ия',
        description: 'Ав�,ома�,изи�?�fй�,е п�fблика�?и�Z в подкл�Z�?енн�<�. со�?се�,я�..',
        color: 'text-yellow-600 bg-yellow-100',
      },
      {
        icon: Shield,
        title: '�'езопасно и надежно',
        description: '�'а�^и подкл�Z�?ения за�?и�?ен�<, видео �.�?аня�,ся в облаке.',
        color: 'text-green-600 bg-green-100',
      },
      {
        icon: Video,
        title: '�'идео-�?едак�,о�?',
        description: 'Создавай�,е и �?едак�,и�?�fй�,е �?олики п�?ямо на пла�,�"о�?ме.',
        color: 'text-red-600 bg-red-100',
      },
      {
        icon: Sparkles,
        title: 'Анали�,ика и ме�,�?ики',
        description: '�z�,слеживай�,е �?ез�fл�O�,а�,�< ва�^и�. пос�,ов на все�. пла�,�"о�?ма�..',
        color: 'text-indigo-600 bg-indigo-100',
      },
    ],
    howTitle: '�sак э�,о �?або�,ае�,',
    howSubtitle: '3 �^ага, �?�,об�< заплани�?ова�,�O и оп�fбликова�,�O видео',
    steps: [
      {
        step: '01',
        title: '�Yодкл�Z�?и�,е се�,и',
        description: 'Свяжи�,е акка�fн�,�< YouTube, TikTok, Instagram и д�?�fгие.',
      },
      {
        step: '02',
        title: 'Создай�,е и заплани�?�fй�,е',
        description: 'Создай�,е пос�,�<, заг�?�fзи�,е видео и в�<бе�?и�,е в�?емя п�fблика�?ии.',
      },
      {
        step: '03',
        title: '�Y�fблик�fй�,е ав�,ома�,и�?ески',
        description: '�Yла�,�"о�?ма оп�fблик�fе�, ва�^и видео в назна�?енное в�?емя.',
      },
    ],
    ctaTitle: '�"о�,ов�< на�?а�,�O?',
    ctaSubtitle: '�Y�?исоединяй�,ес�O к �,�<ся�?ам ав�,о�?ов, ко�,о�?�<е �fже испол�Oз�f�Z�, Autoedito',
    ctaPrimary: 'Созда�,�O акка�fн�, беспла�,но',
    footer: {
      product: '�Y�?од�fк�,',
      company: '�sомпания',
      support: '�Yодде�?жка',
      links: {
        productFeatures: 'Ф�fнк�?ии',
        productPricing: 'Цен�<',
        productTemplates: 'Шаблон�<',
        companyAbout: '�z нас',
        companyBlog: '�'лог',
        companyCareers: '�sа�?�Oе�?а',
        supportDocs: '�"ок�fмен�,а�?ия',
        supportContact: '�sон�,ак�,�<',
        supportLogin: '�'ой�,и',
      },
    },
  },
  zh: {
    nav: {
      features: '�SY�f�',
      howItWorks: '�,�.运�o',
      pricing: '�s价',
      login: '�T��.',
      start: '�.�费�?�<',
    },
    featuresTitle: '管�?�?�'�??�o?�s"�?�^?',
    featuresSubtitle: '强大工�.��O�S�你�SS�^>�"��~�^��"�s�?�'',
    features: [
      {
        icon: Video,
        title: '�T��f��Z'�<',
        description: '为�s平台�??�<��o?佳�-��-��O�?次�Z'�<�s个�'�f�?,',
        color: 'text-blue-600 bg-blue-100',
      },
      {
        icon: Sparkles,
        title: '�s平台',
        description: '�?�"��'�f�^� YouTube�?�TikTok�?�Instagram �?�?,',
        color: 'text-purple-600 bg-purple-100',
      },
      {
        icon: Zap,
        title: '�?��S��'�f',
        description: '�o�已�z�Z��s"社交�'�o�S�?��S��'�f�?.容�?,',
        color: 'text-yellow-600 bg-yellow-100',
      },
      {
        icon: Shield,
        title: '�?�.�可靠',
        description: '�z�Z��?�.��O�?�'保�~�o��'端�?,',
        color: 'text-green-600 bg-green-100',
      },
      {
        icon: Video,
        title: '�?�'�-�'',
        description: '�>��Z��o�平台�S�^>建�'O�-�'�"�s�?�'�?,',
        color: 'text-red-600 bg-red-100',
      },
      {
        icon: Sparkles,
        title: '�^?�z��Z�O?�?',
        description: '�Y踪�"平台�S�-子�s"表�Z��?,',
        color: 'text-indigo-600 bg-indigo-100',
      },
    ],
    howTitle: '�,�.运�o',
    howSubtitle: '3 个步骤即可�Z'�<并�'�f�?�'',
    steps: [
      {
        step: '01',
        title: '�z�Z�社交账号',
        description: '�z�Z� YouTube�?�TikTok�?�Instagram �?账号�?,',
      },
      {
        step: '02',
        title: '�^>建并�Z'�<',
        description: '�^>建�-子�O�S传�?�'并设置�'�f�-��-��?,',
      },
      {
        step: '03',
        title: '�?��S��'�f',
        description: '平台�s�o��"�s�-��-��?��S��'�f你�s"�?�'�?,',
      },
    ],
    ctaTitle: '�??�?�?�<�?�-�Y',
    ctaSubtitle: '�S��.�已经�o�使�"� Autoedito �s"�.��f�^>�o�?.',
    ctaPrimary: '�.�费�^>建账号',
    footer: {
      product: '产�"�',
      company: '�.�司',
      support: '�"��O�',
      links: {
        productFeatures: '�SY�f�',
        productPricing: '�s价',
        productTemplates: '模板',
        companyAbout: '�.��Z',
        companyBlog: '�s客',
        companyCareers: '�<>�~',
        supportDocs: '�-?档',
        supportContact: '�"系',
        supportLogin: '�T��.',
      },
    },
  },
};

const getCopy = (language: Language) => copyByLang[language] || enCopy;

export default function LandingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const copy = useMemo(() => getCopy(language), [language]);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="medium" showText horizontal />
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                {copy.nav.features}
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                {copy.nav.howItWorks}
              </a>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                {copy.nav.pricing}
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                {copy.nav.login}
              </Link>
              <Link
                href="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                {copy.nav.start}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t.landing.heroTitle}
              <br />
              <span className="text-primary-600">{t.landing.heroHighlight}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{t.landing.heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center bg-primary-500 text-white px-8 py-4 rounded-lg hover:bg-primary-600 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t.landing.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-gray-200"
              >
                {t.landing.ctaSecondary}
              </a>
            </div>
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">Preview do Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{copy.featuresTitle}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{copy.featuresSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {copy.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all bg-white"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{copy.howTitle}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{copy.howSubtitle}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {copy.steps.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 text-white rounded-full text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{copy.ctaTitle}</h2>
            <p className="text-xl text-primary-100 mb-8">{copy.ctaSubtitle}</p>
            <Link
              href="/login"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg shadow-lg"
            >
              {copy.ctaPrimary}
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Logo size="small" showText horizontal />
              </div>
              <p className="text-sm text-gray-300">{t.landing.footerTagline}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{copy.footer.product}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    {copy.footer.links.productFeatures}
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    {copy.footer.links.productPricing}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {copy.footer.links.productTemplates}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{copy.footer.company}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {copy.footer.links.companyAbout}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {copy.footer.links.companyBlog}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {copy.footer.links.companyCareers}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{copy.footer.support}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {copy.footer.links.supportDocs}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {copy.footer.links.supportContact}
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    {copy.footer.links.supportLogin}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Autoedito. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}




