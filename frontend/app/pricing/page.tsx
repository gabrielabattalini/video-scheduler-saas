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
  ctaLink?: string;
  popular: boolean;
};

const baseNavCopy: NavCopy = { home: 'Home', pricing: 'Pricing', login: 'Sign in', start: 'Start free' };
const navCopy: Record<Language, NavCopy> = {
  pt: { home: 'Início', pricing: 'Preços', login: 'Entrar', start: 'Começar grátis' },
  en: baseNavCopy,
  ru: { home: 'Главная', pricing: 'Цены', login: 'Войти', start: 'Начать бесплатно' },
  zh: { home: '首页', pricing: '定价', login: '登录', start: '免费开始' },
};
const getNavCopy = (language: Language) => navCopy[language] || baseNavCopy;

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
      a: 'Yes! All plans include a 7-day free trial. A card is required to start the trial.',
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
        q: 'Можно ли менять план в любое время?',
        a: 'Да! Вы можете сделать апгрейд или даунгрейд в любое время. Изменения вступают в силу в следующем расчетном периоде.',
      },
      {
        q: 'Что происходит, если я превышаю лимит плана?',
        a: 'Вы получите уведомление и сможете обновить план, чтобы продолжить пользоваться сервисом без перерывов.',
      },
      {
        q: 'Есть ли пробный период?',
        a: 'Да! Все планы включают 7-дневный бесплатный пробный период. Для начала требуется привязать карту.',
      },
      {
        q: 'Какие методы оплаты принимаются?',
        a: 'Мы принимаем кредитные/дебетовые карты и PIX. Все платежи обрабатываются безопасно.',
      },
    ],
  },
  zh: {
    heroTitle: '套餐与定价',
    heroSubtitle: '选择最适合你的方案',
    faqTitle: '常见问题',
    ctaTitle: '准备开始了吗？',
    ctaSubtitle: '加入已经在使用 Autoedito 的成千上万创作者',
    ctaButton: '免费创建账户',
    faq: [
      {
        q: '我可以随时更换套餐吗？',
        a: '可以！你可以随时升级或降级。变更将在下一个计费周期生效。',
      },
      {
        q: '如果我超出套餐限制会怎样？',
        a: '我们会通知你，你可以升级以继续使用服务而不中断。',
      },
      {
        q: '有试用期吗？',
        a: '有！所有套餐都包含 7 天免费试用。开始试用需要绑定卡片。',
      },
      {
        q: '支持哪些支付方式？',
        a: '支持信用卡/借记卡和 PIX。所有付款都安全处理。',
      },
    ],
  },
};
const getPageCopy = (language: Language) => pageCopy[language] || basePageCopy;

const plansByLang: Record<Language, Plan[]> = {
  pt: [
    {
      name: 'Start',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Para começar com o essencial',
      features: ['Até 10 posts por mês', '1 plataforma conectada', '1 workspace', 'Agendamento', 'Suporte por email'],
      cta: 'Assinar agora',
      popular: false,
    },
    {
      name: 'Profissional',
      price: 'R$ 59,90',
      period: '/mês',
      description: 'Para criadores que publicam com frequência',
      features: ['Até 30 posts por mês', 'Até 4 plataformas conectadas', '3 workspaces', 'Agendamento', 'Suporte prioritário'],
      cta: 'Assinar agora',
      popular: true,
    },
    {
      name: 'Empresarial',
      price: 'R$ 149,90',
      period: '/mês',
      description: 'Para equipes e agências',
      features: ['Até 120 posts por mês', 'Até 6 plataformas conectadas', 'Workspaces ilimitados', 'Agendamento', 'Suporte dedicado'],
      cta: 'Assinar agora',
      popular: false,
    },
    {
      name: 'Especial',
      price: 'Sob medida',
      period: '',
      description: 'Limites e recursos personalizados',
      features: ['Plano customizado', 'Limites ajustáveis', 'Suporte dedicado', 'Onboarding personalizado'],
      cta: 'Falar no WhatsApp',
      ctaLink: 'https://wa.me/5511959110386?text=Gostaria%20de%20saber%20sobre%20o%20plano%20Especial',
      popular: false,
    },
  ],
  en: [
    {
      name: 'Start',
      price: '$29.90',
      period: '/mo',
      description: 'Get started with the essentials',
      features: ['Up to 10 posts per month', '1 connected platform', '1 workspace', 'Scheduling', 'Email support'],
      cta: 'Subscribe now',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$59.90',
      period: '/mo',
      description: 'For creators who post often',
      features: ['Up to 30 posts per month', 'Up to 4 connected platforms', '3 workspaces', 'Scheduling', 'Priority support'],
      cta: 'Subscribe now',
      popular: true,
    },
    {
      name: 'Business',
      price: '$149.90',
      period: '/mo',
      description: 'For teams and agencies',
      features: ['Up to 120 posts per month', 'Up to 6 connected platforms', 'Unlimited workspaces', 'Scheduling', 'Dedicated support'],
      cta: 'Subscribe now',
      popular: false,
    },
    {
      name: 'Custom',
      price: 'Custom',
      period: '',
      description: 'Custom limits and features',
      features: ['Tailored plan', 'Adjustable limits', 'Dedicated support', 'Personalized onboarding'],
      cta: 'Contact on WhatsApp',
      ctaLink: 'https://wa.me/5511959110386?text=Gostaria%20de%20saber%20sobre%20o%20plano%20Especial',
      popular: false,
    },
  ],
  ru: [
    {
      name: 'Старт',
      price: '29,90 ₽',
      period: '/мес',
      description: 'Старт с необходимым минимумом',
      features: ['До 10 постов в месяц', '1 подключенная платформа', '1 рабочее пространство', 'Планирование', 'Поддержка по email'],
      cta: 'Оформить подписку',
      popular: false,
    },
    {
      name: 'Профессиональный',
      price: '59,90 ₽',
      period: '/мес',
      description: 'Для тех, кто публикует часто',
      features: ['До 30 постов в месяц', 'До 4 подключенных платформ', '3 рабочих пространства', 'Планирование', 'Приоритетная поддержка'],
      cta: 'Оформить подписку',
      popular: true,
    },
    {
      name: 'Бизнес',
      price: '149,90 ₽',
      period: '/мес',
      description: 'Для команд и агентств',
      features: ['До 120 постов в месяц', 'До 6 подключенных платформ', 'Безлимитные рабочие пространства', 'Планирование', 'Выделенная поддержка'],
      cta: 'Оформить подписку',
      popular: false,
    },
    {
      name: 'Индивидуальный',
      price: 'Индивидуально',
      period: '',
      description: 'Индивидуальные лимиты и возможности',
      features: ['Индивидуальный план', 'Гибкие лимиты', 'Выделенная поддержка', 'Персональный онбординг'],
      cta: 'Связаться в WhatsApp',
      ctaLink: 'https://wa.me/5511959110386?text=Gostaria%20de%20saber%20sobre%20o%20plano%20Especial',
      popular: false,
    },
  ],
  zh: [
    {
      name: '入门版',
      price: '¥29.90',
      period: '/月',
      description: '从基础功能开始',
      features: ['每月最多 10 条帖子', '1 个已连接的平台', '1 个工作区', '排程', '邮件支持'],
      cta: '立即订阅',
      popular: false,
    },
    {
      name: '专业版',
      price: '¥59.90',
      period: '/月',
      description: '适合高频发布',
      features: ['每月最多 30 条帖子', '最多 4 个已连接的平台', '3 个工作区', '排程', '优先支持'],
      cta: '立即订阅',
      popular: true,
    },
    {
      name: '企业版',
      price: '¥149.90',
      period: '/月',
      description: '适合团队和机构',
      features: ['每月最多 120 条帖子', '最多 6 个已连接的平台', '无限工作区', '排程', '专属支持'],
      cta: '立即订阅',
      popular: false,
    },
    {
      name: '定制版',
      price: '定制',
      period: '',
      description: '自定义额度与功能',
      features: ['定制方案', '灵活额度', '专属支持', '专属上手指导'],
      cta: 'WhatsApp 咨询',
      ctaLink: 'https://wa.me/5511959110386?text=Gostaria%20de%20saber%20sobre%20o%20plano%20Especial',
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
                  href={plan.ctaLink || (authService.isAuthenticated() ? '/dashboard' : '/login')}
                  target={plan.ctaLink ? '_blank' : undefined}
                  rel={plan.ctaLink ? 'noopener noreferrer' : undefined}
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






