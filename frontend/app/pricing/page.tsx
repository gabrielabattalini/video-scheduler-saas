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
  pt: { home: 'InÃ­cio', pricing: 'PreÃ§os', login: 'Entrar', start: 'ComeÃ§ar grÃ¡tis' },
  en: baseNavCopy,
  ru: { home: 'Ð“Ð»Ð°Ð²Ð½Ð°Ñ', pricing: 'Ð¦ÐµÐ½Ñ‹', login: 'Ð’Ð¾Ð¹Ñ‚Ð¸', start: 'ÐÐ°Ñ‡Ð°Ñ‚ÑŒ Ð±ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð¾' },
  zh: { home: 'é¦–é¡µ', pricing: 'å®šä»·', login: 'ç™»å½•', start: 'å…è´¹å¼€å§‹' },
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
    heroTitle: 'Planos e PreÃ§os',
    heroSubtitle: 'Escolha o plano perfeito para suas necessidades',
    faqTitle: 'Perguntas Frequentes',
    ctaTitle: 'Pronto para comeÃ§ar?',
    ctaSubtitle: 'Junte-se a milhares de criadores que jÃ¡ estÃ£o usando Autoedito',
    ctaButton: 'Criar conta grÃ¡tis',
    faq: [
      {
        q: 'Posso mudar de plano a qualquer momento?',
        a: 'Sim! VocÃª pode fazer upgrade ou downgrade do seu plano quando quiser. As alteraÃ§Ãµes valem no prÃ³ximo ciclo de cobranÃ§a.',
      },
      {
        q: 'O que acontece se eu exceder o limite do plano?',
        a: 'VocÃª receberÃ¡ uma notificaÃ§Ã£o e poderÃ¡ fazer upgrade para continuar usando o serviÃ§o sem interrupÃ§Ãµes.',
      },
      {
        q: 'HÃ¡ perÃ­odo de teste?',
        a: 'Sim! Todos os planos incluem um perÃ­odo de teste gratuito de 14 dias. NÃ£o Ã© necessÃ¡rio cartÃ£o de crÃ©dito.',
      },
      {
        q: 'Quais mÃ©todos de pagamento sÃ£o aceitos?',
        a: 'Aceitamos cartÃ£o de crÃ©dito, dÃ©bito e PIX. Todos os pagamentos sÃ£o processados de forma segura.',
      },
    ],
  },
  en: basePageCopy,
  ru: {
    heroTitle: 'ÐŸÐ»Ð°Ð½Ñ‹ Ð¸ Ñ†ÐµÐ½Ñ‹',
    heroSubtitle: 'Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð¿Ð¾Ð´Ñ…Ð¾Ð´ÑÑ‰Ð¸Ð¹ Ð¿Ð»Ð°Ð½ Ð´Ð»Ñ Ð²Ð°ÑˆÐ¸Ñ… Ð·Ð°Ð´Ð°Ñ‡',
    faqTitle: 'Ð§Ð°ÑÑ‚Ñ‹Ðµ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹',
    ctaTitle: 'Ð“Ð¾Ñ‚Ð¾Ð²Ñ‹ Ð½Ð°Ñ‡Ð°Ñ‚ÑŒ?',
    ctaSubtitle: 'ÐŸÑ€Ð¸ÑÐ¾ÐµÐ´Ð¸Ð½ÑÐ¹Ñ‚ÐµÑÑŒ Ðº Ñ‚Ñ‹ÑÑÑ‡Ð°Ð¼ Ð°Ð²Ñ‚Ð¾Ñ€Ð¾Ð², ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ ÑƒÐ¶Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑŽÑ‚ Autoedito',
    ctaButton: 'Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð±ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð¾',
    faq: [
      {
        q: 'ÐœÐ¾Ð³Ñƒ Ð»Ð¸ Ñ Ð¼ÐµÐ½ÑÑ‚ÑŒ Ð¿Ð»Ð°Ð½ Ð² Ð»ÑŽÐ±Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ?',
        a: 'Ð”Ð°! ÐœÐ¾Ð¶Ð½Ð¾ Ð¿Ð¾Ð²Ñ‹ÑÐ¸Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¿Ð¾Ð½Ð¸Ð·Ð¸Ñ‚ÑŒ Ð¿Ð»Ð°Ð½ ÐºÐ¾Ð³Ð´Ð° ÑƒÐ³Ð¾Ð´Ð½Ð¾. Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ Ð²ÑÑ‚ÑƒÐ¿Ð°ÑŽÑ‚ Ð² ÑÐ¸Ð»Ñƒ Ð² ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ¼ Ð±Ð¸Ð»Ð»Ð¸Ð½Ð³Ðµ.',
      },
      {
        q: 'Ð§Ñ‚Ð¾ ÐµÑÐ»Ð¸ Ñ Ð¿Ñ€ÐµÐ²Ñ‹ÑˆÑƒ Ð»Ð¸Ð¼Ð¸Ñ‚ Ð¿Ð»Ð°Ð½Ð°?',
        a: 'ÐœÑ‹ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð¸Ð¼ Ð²Ð°Ñ, Ð¸ Ð²Ñ‹ ÑÐ¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿ÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ð½Ð° Ð±Ð¾Ð»ÐµÐµ Ð²Ñ‹ÑÐ¾ÐºÐ¸Ð¹ Ð¿Ð»Ð°Ð½, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ñ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÑŒ Ð±ÐµÐ· Ð¿ÐµÑ€ÐµÑ€Ñ‹Ð²Ð¾Ð².',
      },
      {
        q: 'Ð•ÑÑ‚ÑŒ Ð»Ð¸ Ð¿Ñ€Ð¾Ð±Ð½Ñ‹Ð¹ Ð¿ÐµÑ€Ð¸Ð¾Ð´?',
        a: 'Ð”Ð°! Ð’ÑÐµ Ð¿Ð»Ð°Ð½Ñ‹ Ð²ÐºÐ»ÑŽÑ‡Ð°ÑŽÑ‚ 14 Ð´Ð½ÐµÐ¹ Ð±ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°. Ð‘Ð°Ð½ÐºÐ¾Ð²ÑÐºÐ°Ñ ÐºÐ°Ñ€Ñ‚Ð° Ð½Ðµ Ñ‚Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ.',
      },
      {
        q: 'ÐšÐ°ÐºÐ¸Ðµ ÑÐ¿Ð¾ÑÐ¾Ð±Ñ‹ Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹?',
        a: 'ÐŸÑ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÐ¼ ÐºÑ€ÐµÐ´Ð¸Ñ‚Ð½Ñ‹Ðµ/Ð´ÐµÐ±ÐµÑ‚Ð¾Ð²Ñ‹Ðµ ÐºÐ°Ñ€Ñ‚Ñ‹ Ð¸ PIX. Ð’ÑÐµ Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÑŽÑ‚ÑÑ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾.',
      },
    ],
  },
  zh: {
    heroTitle: 'æ–¹æ¡ˆä¸Žå®šä»·',
    heroSubtitle: 'é€‰æ‹©æœ€é€‚åˆä½ çš„æ–¹æ¡ˆ',
    faqTitle: 'å¸¸è§é—®é¢˜',
    ctaTitle: 'å‡†å¤‡å¼€å§‹äº†å—ï¼Ÿ',
    ctaSubtitle: 'åŠ å…¥å·²ç»åœ¨ä½¿ç”¨ Autoedito çš„æ•°åƒåˆ›ä½œè€…',
    ctaButton: 'å…è´¹åˆ›å»ºè´¦å·',
    faq: [
      {
        q: 'æˆ‘å¯ä»¥éšæ—¶æ›´æ¢æ–¹æ¡ˆå—ï¼Ÿ',
        a: 'å¯ä»¥ï¼éšæ—¶å‡çº§æˆ–é™çº§ï¼Œå˜æ›´ä¼šåœ¨ä¸‹ä¸€ä¸ªè´¦å•å‘¨æœŸç”Ÿæ•ˆã€‚',
      },
      {
        q: 'å¦‚æžœè¶…è¿‡æ–¹æ¡ˆé™åˆ¶ä¼šæ€Žæ ·ï¼Ÿ',
        a: 'æˆ‘ä»¬ä¼šé€šçŸ¥ä½ ï¼Œä½ å¯ä»¥å‡çº§æ–¹æ¡ˆä»¥ä¸ä¸­æ–­åœ°ç»§ç»­ä½¿ç”¨ã€‚',
      },
      {
        q: 'æœ‰æ²¡æœ‰è¯•ç”¨æœŸï¼Ÿ',
        a: 'æœ‰ï¼æ‰€æœ‰æ–¹æ¡ˆéƒ½åŒ…å« 14 å¤©å…è´¹è¯•ç”¨ï¼Œæ— éœ€ä¿¡ç”¨å¡ã€‚',
      },
      {
        q: 'æ”¯æŒå“ªäº›æ”¯ä»˜æ–¹å¼ï¼Ÿ',
        a: 'æ”¯æŒä¿¡ç”¨å¡ã€å€Ÿè®°å¡å’Œ PIXï¼Œæ‰€æœ‰æ”¯ä»˜éƒ½ä¼šå®‰å…¨å¤„ç†ã€‚',
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
      features: ['Até 4 posts por mês', '1 plataforma conectada', 'Agendamento básico', 'Suporte por email'],
      cta: 'Começar grátis',
      popular: false,
    },
    {
      name: 'Profissional',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para criadores de conteúdo',
      features: ['Até 30 posts por mês', 'Até 5 plataformas conectadas', '3 workspaces', 'Agendamento', 'Suporte prioritário'],
      cta: 'Assinar agora',
      popular: true,
    },
    {
      name: 'Empresarial',
      price: 'R$ 149',
      period: '/mês',
      description: 'Para equipes e agências',
      features: ['Até 90 posts por mês', 'Múltiplos usuários', 'Workspaces ilimitados', 'Suporte dedicado', 'Treinamento da equipe'],
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
      features: ['Up to 4 posts per month', '1 connected platform', 'Basic scheduling', 'Email support'],
      cta: 'Start for free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/mo',
      description: 'For content creators',
      features: ['Up to 30 posts per month', 'Up to 5 connected platforms', '3 workspaces', 'Scheduling', 'Priority support'],
      cta: 'Subscribe now',
      popular: true,
    },
    {
      name: 'Business',
      price: '$149',
      period: '/mo',
      description: 'For teams and agencies',
      features: ['Up to 90 posts per month', 'Multiple users', 'Unlimited workspaces', 'Dedicated support', 'Team training'],
      cta: 'Talk to sales',
      popular: false,
    },
  ],
  ru: [
    {
      name: 'Бесплатный',
      price: '0 ₽',
      period: '/мес',
      description: 'Отлично для старта',
      features: ['До 4 постов в месяц', '1 подключенная платформа', 'Базовое планирование', 'Поддержка по email'],
      cta: 'Начать бесплатно',
      popular: false,
    },
    {
      name: 'Профессиональный',
      price: '49 ₽',
      period: '/мес',
      description: 'Для создателей контента',
      features: ['До 30 постов в месяц', 'До 5 подключенных платформ', '3 рабочих пространства', 'Планирование', 'Приоритетная поддержка'],
      cta: 'Оформить подписку',
      popular: true,
    },
    {
      name: 'Бизнес',
      price: '149 ₽',
      period: '/мес',
      description: 'Для команд и агентств',
      features: ['До 90 постов в месяц', 'Несколько пользователей', 'Безлимитные рабочие пространства', 'Выделенная поддержка', 'Обучение команды'],
      cta: 'Связаться с отделом продаж',
      popular: false,
    },
  ],
  zh: [
    {
      name: '免费',
      price: '¥0',
      period: '/月',
      description: '适合入门',
      features: ['每月最多 4 条帖子', '1 个已连接的平台', '基础排程', '邮件支持'],
      cta: '免费开始',
      popular: false,
    },
    {
      name: '专业版',
      price: '¥49',
      period: '/月',
      description: '适合内容创作者',
      features: ['每月最多 30 条帖子', '最多 5 个已连接的平台', '3 个工作区', '排程', '优先支持'],
      cta: '立即订阅',
      popular: true,
    },
    {
      name: '企业版',
      price: '¥149',
      period: '/月',
      description: '适合团队和机构',
      features: ['每月最多 90 条帖子', '多用户', '无限工作区', '专属支持', '团队培训'],
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


