'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/i18n/language-context';
import { Language } from '@/lib/i18n/translations';

type NavCopy = { home: string; pricing: string; login: string; start: string };
type PageCopy = {
  heroTitle: string;
  heroSubtitle: string;
  faqTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  faq: { q: string; a: string }[];
};

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
};

const baseNavCopy: NavCopy = { home: 'Home', pricing: 'Pricing', login: 'Sign in', start: 'Start free' };
const navCopy: Record<Language, NavCopy> = {
  pt: { home: 'Início', pricing: 'Preços', login: 'Entrar', start: 'Começar grátis' },
  en: baseNavCopy,
  ru: { home: 'Главная', pricing: 'Цены', login: 'Войти', start: 'Начать бесплатно' },
  zh: { home: '首页', pricing: '定价', login: '登录', start: '免费开始' },
};

const basePageCopy: PageCopy = {
  heroTitle: 'Plans and Pricing',
  heroSubtitle: 'Choose the perfect plan for your needs',
  faqTitle: 'Frequently Asked Questions',
  ctaTitle: 'Ready to start?',
  ctaSubtitle: 'Join thousands of creators already using Autoedito',
  ctaButton: 'Create free account',
  faq: [
    {
      q: 'Can I change plans at any time?',
      a: 'Yes! You can upgrade or downgrade whenever you want. Changes apply on the next billing cycle.',
    },
    {
      q: 'What happens if I exceed my plan limits?',
      a: 'You will be notified and can upgrade to keep using the service without interruptions.',
    },
    {
      q: 'Is there a trial period?',
      a: 'Yes! All plans include a 14-day free trial. No credit card required.',
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We accept credit/debit cards and PIX. All payments are processed securely.',
    },
  ],
};

const pageCopy: Record<Language, PageCopy> = {
  pt: {
    heroTitle: 'Planos e Preços',
    heroSubtitle: 'Escolha o plano perfeito para suas necessidades',
    faqTitle: 'Perguntas Frequentes',
    ctaTitle: 'Pronto para começar?',
    ctaSubtitle: 'Junte-se a milhares de criadores que já estão usando Autoedito',
    ctaButton: 'Criar conta grátis',
    faq: [
      {
        q: 'Posso mudar de plano a qualquer momento?',
        a: 'Sim! Você pode fazer upgrade ou downgrade do seu plano quando quiser. As alterações valem no próximo ciclo de cobrança.',
      },
      {
        q: 'O que acontece se eu exceder o limite do plano?',
        a: 'Você receberá uma notificação e poderá fazer upgrade para continuar usando o serviço sem interrupções.',
      },
      {
        q: 'Há período de teste?',
        a: 'Sim! Todos os planos incluem um período de teste gratuito de 14 dias. Não é necessário cartão de crédito.',
      },
      {
        q: 'Quais métodos de pagamento são aceitos?',
        a: 'Aceitamos cartão de crédito, débito e PIX. Todos os pagamentos são processados de forma segura.',
      },
    ],
  },
  en: basePageCopy,
  ru: {
    heroTitle: 'Планы и цены',
    heroSubtitle: 'Выберите подходящий план для ваших задач',
    faqTitle: 'Частые вопросы',
    ctaTitle: 'Готовы начать?',
    ctaSubtitle: 'Присоединяйтесь к тысячам авторов, которые уже используют Autoedito',
    ctaButton: 'Создать аккаунт бесплатно',
    faq: [
      {
        q: 'Могу ли я менять план в любое время?',
        a: 'Да! Можно повысить или понизить план когда угодно. Изменения вступают в силу в следующем биллинге.',
      },
      {
        q: 'Что если я превышу лимит плана?',
        a: 'Мы уведомим вас, и вы сможете перейти на более высокий план, чтобы продолжить без перерывов.',
      },
      {
        q: 'Есть ли пробный период?',
        a: 'Да! Все планы включают 14 дней бесплатного теста. Банковская карта не требуется.',
      },
      {
        q: 'Какие способы оплаты доступны?',
        a: 'Принимаем кредитные/дебетовые карты и PIX. Все платежи обрабатываются безопасно.',
      },
    ],
  },
  zh: {
    heroTitle: '方案与定价',
    heroSubtitle: '选择最适合你的方案',
    faqTitle: '常见问题',
    ctaTitle: '准备开始了吗？',
    ctaSubtitle: '加入已经在使用 Autoedito 的数千创作者',
    ctaButton: '免费创建账号',
    faq: [
      {
        q: '我可以随时更换方案吗？',
        a: '可以！随时升级或降级，变更会在下一个账单周期生效。',
      },
      {
        q: '如果超过方案限制会怎样？',
        a: '我们会通知你，你可以升级方案以不中断地继续使用。',
      },
      {
        q: '有没有试用期？',
        a: '有！所有方案都包含 14 天免费试用，无需信用卡。',
      },
      {
        q: '支持哪些支付方式？',
        a: '支持信用卡、借记卡和 PIX，所有支付都会安全处理。',
      },
    ],
  },
};

const getNavCopy = (language: Language) => navCopy[language] || baseNavCopy;
const getPageCopy = (language: Language) => pageCopy[language] || basePageCopy;

const plansByLang: Record<Language, Plan[]> = {
  pt: [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      features: ['Até 10 posts por mês', '1 plataforma conectada', 'Agendamento básico', 'Suporte por email'],
      cta: 'Começar grátis',
      popular: false,
    },
    {
      name: 'Profissional',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para criadores de conteúdo',
      features: [
        'Posts ilimitados',
        'Todas as plataformas',
        'Agendamento avançado',
        'Análises e métricas',
        'Suporte prioritário',
        'Editor de vídeo',
      ],
      cta: 'Assinar agora',
      popular: true,
    },
    {
      name: 'Empresarial',
      price: 'R$ 149',
      period: '/mês',
      description: 'Para equipes e agências',
      features: [
        'Tudo do Profissional',
        'Múltiplos usuários',
        'Workspaces ilimitados',
        'API personalizada',
        'Suporte dedicado',
        'Treinamento da equipe',
      ],
      cta: 'Falar com vendas',
      popular: false,
    },
  ],
  en: [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      description: 'Perfect to get started',
      features: ['Up to 10 posts per month', '1 connected platform', 'Basic scheduling', 'Email support'],
      cta: 'Start for free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/mo',
      description: 'For content creators',
      features: [
        'Unlimited posts',
        'All platforms',
        'Advanced scheduling',
        'Analytics and metrics',
        'Priority support',
        'Video editor',
      ],
      cta: 'Subscribe now',
      popular: true,
    },
    {
      name: 'Business',
      price: '$149',
      period: '/mo',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Multiple users',
        'Unlimited workspaces',
        'Custom API',
        'Dedicated support',
        'Team training',
      ],
      cta: 'Talk to sales',
      popular: false,
    },
  ],
  ru: [
    {
      name: 'Бесплатный',
      price: '0 ₽',
      period: '/мес',
      description: 'Идеально для старта',
      features: ['До 10 постов в месяц', '1 подключенная платформа', 'Базовое планирование', 'Поддержка по email'],
      cta: 'Начать бесплатно',
      popular: false,
    },
    {
      name: 'Профессионал',
      price: '49 ₽',
      period: '/мес',
      description: 'Для авторов контента',
      features: [
        'Неограниченные посты',
        'Все платформы',
        'Расширенное планирование',
        'Аналитика и метрики',
        'Приоритетная поддержка',
        'Видео-редактор',
      ],
      cta: 'Подписаться',
      popular: true,
    },
    {
      name: 'Бизнес',
      price: '149 ₽',
      period: '/мес',
      description: 'Для команд и агентств',
      features: [
        'Все из Профессионала',
        'Несколько пользователей',
        'Безлимитные workspaces',
        'Пользовательское API',
        'Выделенная поддержка',
        'Обучение команды',
      ],
      cta: 'Связаться с продажами',
      popular: false,
    },
  ],
  zh: [
    {
      name: '免费版',
      price: '¥0',
      period: '/月',
      description: '适合入门',
      features: ['每月最多 10 个帖子', '1 个已连接平台', '基础排程', '邮箱支持'],
      cta: '免费开始',
      popular: false,
    },
    {
      name: '专业版',
      price: '¥49',
      period: '/月',
      description: '适合内容创作者',
      features: ['帖子不限量', '全部平台', '高级排程', '分析与指标', '优先支持', '视频编辑器'],
      cta: '立即订阅',
      popular: true,
    },
    {
      name: '企业版',
      price: '¥149',
      period: '/月',
      description: '适合团队与代理',
      features: [
        '包含专业版全部内容',
        '多用户支持',
        '无限工作区',
        '自定义 API',
        '专属支持',
        '团队培训',
      ],
      cta: '联系销售',
      popular: false,
    },
  ],
};

const getPlans = (language: Language) => plansByLang[language] || plansByLang.en;

export default function PricingPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const nav = useMemo(() => getNavCopy(language), [language]);
  const text = useMemo(() => getPageCopy(language), [language]);
  const plans = useMemo(() => getPlans(language), [language]);
  const faqs = text.faq;

  useEffect(() => {
    authService.isAuthenticated();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Logo size="small" showText horizontal />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                {nav.home}
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                {nav.pricing}
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                {nav.login}
              </Link>
              <Link
                href="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                {nav.start}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">{text.heroTitle}</h1>
            <p className="text-xl text-gray-600 mb-8">{text.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular ? 'border-primary-500 shadow-xl scale-105' : 'border-gray-200 hover:border-primary-300'
                } transition-all bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={authService.isAuthenticated() ? '/dashboard' : '/login'}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{text.faqTitle}</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{text.ctaTitle}</h2>
            <p className="text-xl text-primary-100 mb-8">{text.ctaSubtitle}</p>
            <Link
              href="/login"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg shadow-lg"
            >
              {text.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
