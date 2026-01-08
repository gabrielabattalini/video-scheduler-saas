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
      features: 'Функции',
      howItWorks: 'Как это работает',
      pricing: 'Цены',
      login: 'Войти',
      start: 'Начать бесплатно',
    },
    featuresTitle: 'Все, что нужно для управления видео',
    featuresSubtitle: 'Мощные инструменты, чтобы превратить идеи в профессиональные ролики',
    features: [
      {
        icon: Video,
        title: 'Умное планирование',
        description: 'Планируйте посты на лучшее время сразу для нескольких платформ.',
        color: 'text-blue-600 bg-blue-100',
      },
      {
        icon: Sparkles,
        title: 'Мультиплатформенность',
        description: 'Публикуйте на YouTube, TikTok, Instagram и другие сети одним кликом.',
        color: 'text-purple-600 bg-purple-100',
      },
      {
        icon: Zap,
        title: 'Автопубликация',
        description: 'Автоматизируйте публикацию в подключенных соцсетях.',
        color: 'text-yellow-600 bg-yellow-100',
      },
      {
        icon: Shield,
        title: 'Безопасно и надежно',
        description: 'Ваши подключения защищены, видео хранятся в облаке.',
        color: 'text-green-600 bg-green-100',
      },
      {
        icon: Video,
        title: 'Видео-редактор',
        description: 'Создавайте и редактируйте ролики прямо на платформе.',
        color: 'text-red-600 bg-red-100',
      },
      {
        icon: Sparkles,
        title: 'Аналитика и метрики',
        description: 'Отслеживайте результаты ваших постов на всех платформах.',
        color: 'text-indigo-600 bg-indigo-100',
      },
    ],
    howTitle: 'Как это работает',
    howSubtitle: '3 шага, чтобы запланировать и опубликовать видео',
    steps: [
      {
        step: '01',
        title: 'Подключите сети',
        description: 'Свяжите аккаунты YouTube, TikTok, Instagram и другие.',
      },
      {
        step: '02',
        title: 'Создайте и запланируйте',
        description: 'Создайте посты, загрузите видео и выберите время публикации.',
      },
      {
        step: '03',
        title: 'Публикуйте автоматически',
        description: 'Платформа опубликует ваши видео в назначенное время.',
      },
    ],
    ctaTitle: 'Готовы начать?',
    ctaSubtitle: 'Присоединяйтесь к тысячам авторов, которые уже используют Autoedito',
    ctaPrimary: 'Создать аккаунт бесплатно',
    footer: {
      product: 'Продукт',
      company: 'Компания',
      support: 'Поддержка',
      links: {
        productFeatures: 'Функции',
        productPricing: 'Цены',
        productTemplates: 'Шаблоны',
        companyAbout: 'О нас',
        companyBlog: 'Блог',
        companyCareers: 'Карьера',
        supportDocs: 'Документация',
        supportContact: 'Контакты',
        supportLogin: 'Войти',
      },
    },
  },
  zh: {
    nav: {
      features: '功能',
      howItWorks: '如何运作',
      pricing: '定价',
      login: '登录',
      start: '免费开始',
    },
    featuresTitle: '管理视频所需的一切',
    featuresSubtitle: '强大工具，助你把创意变成专业视频',
    features: [
      {
        icon: Video,
        title: '智能排程',
        description: '为多平台选择最佳时间，一次排程多个发布。',
        color: 'text-blue-600 bg-blue-100',
      },
      {
        icon: Sparkles,
        title: '多平台',
        description: '一键发布到 YouTube、TikTok、Instagram 等。',
        color: 'text-purple-600 bg-purple-100',
      },
      {
        icon: Zap,
        title: '自动发布',
        description: '在已连接的社交网络上自动发布内容。',
        color: 'text-yellow-600 bg-yellow-100',
      },
      {
        icon: Shield,
        title: '安全可靠',
        description: '连接安全，视频保存在云端。',
        color: 'text-green-600 bg-green-100',
      },
      {
        icon: Video,
        title: '视频编辑',
        description: '直接在平台上创建和编辑专业视频。',
        color: 'text-red-600 bg-red-100',
      },
      {
        icon: Sparkles,
        title: '分析与指标',
        description: '跟踪各平台上帖子的表现。',
        color: 'text-indigo-600 bg-indigo-100',
      },
    ],
    howTitle: '如何运作',
    howSubtitle: '3 个步骤即可排程并发布视频',
    steps: [
      {
        step: '01',
        title: '连接社交账号',
        description: '连接 YouTube、TikTok、Instagram 等账号。',
      },
      {
        step: '02',
        title: '创建并排程',
        description: '创建帖子，上传视频并设置发布时间。',
      },
      {
        step: '03',
        title: '自动发布',
        description: '平台会在预定时间自动发布你的视频。',
      },
    ],
    ctaTitle: '准备开始了吗？',
    ctaSubtitle: '加入已经在使用 Autoedito 的数千创作者',
    ctaPrimary: '免费创建账号',
    footer: {
      product: '产品',
      company: '公司',
      support: '支持',
      links: {
        productFeatures: '功能',
        productPricing: '定价',
        productTemplates: '模板',
        companyAbout: '关于',
        companyBlog: '博客',
        companyCareers: '招聘',
        supportDocs: '文档',
        supportContact: '联系',
        supportLogin: '登录',
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
