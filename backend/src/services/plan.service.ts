import { prisma } from '../lib/prisma';

export type PlanDefinition = {
  code: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  postsPerMonth: number | null;
  platformsLimit: number | null;
  workspacesLimit: number | null;
  includesScheduling: boolean;
  includesAnalytics: boolean;
  includesVideoEditor: boolean;
  includesCustomApi: boolean;
  isUnlimited: boolean;
  trialDays: number;
  requiresCard: boolean;
};

const defaultPlans: PlanDefinition[] = [
  {
    code: 'start',
    name: 'Start',
    description: 'Plano essencial para começar',
    priceCents: 2990,
    currency: 'BRL',
    postsPerMonth: 10,
    platformsLimit: 1,
    workspacesLimit: 1,
    includesScheduling: true,
    includesAnalytics: false,
    includesVideoEditor: false,
    includesCustomApi: false,
    isUnlimited: false,
    trialDays: 7,
    requiresCard: true,
  },
  {
    code: 'pro',
    name: 'Profissional',
    description: 'Para criadores que publicam com frequência',
    priceCents: 5990,
    currency: 'BRL',
    postsPerMonth: 30,
    platformsLimit: 4,
    workspacesLimit: 3,
    includesScheduling: true,
    includesAnalytics: false,
    includesVideoEditor: false,
    includesCustomApi: false,
    isUnlimited: false,
    trialDays: 7,
    requiresCard: true,
  },
  {
    code: 'business',
    name: 'Empresarial',
    description: 'Para equipes e agências',
    priceCents: 14990,
    currency: 'BRL',
    postsPerMonth: 120,
    platformsLimit: 6,
    workspacesLimit: null,
    includesScheduling: true,
    includesAnalytics: false,
    includesVideoEditor: false,
    includesCustomApi: false,
    isUnlimited: false,
    trialDays: 7,
    requiresCard: true,
  },
  {
    code: 'special',
    name: 'Especial',
    description: 'Plano sob medida',
    priceCents: 0,
    currency: 'BRL',
    postsPerMonth: null,
    platformsLimit: null,
    workspacesLimit: null,
    includesScheduling: true,
    includesAnalytics: true,
    includesVideoEditor: true,
    includesCustomApi: true,
    isUnlimited: false,
    trialDays: 0,
    requiresCard: false,
  },
  {
    code: 'support',
    name: 'Suporte',
    description: 'Acesso ilimitado com suporte total',
    priceCents: 0,
    currency: 'BRL',
    postsPerMonth: null,
    platformsLimit: null,
    workspacesLimit: null,
    includesScheduling: true,
    includesAnalytics: true,
    includesVideoEditor: true,
    includesCustomApi: true,
    isUnlimited: true,
    trialDays: 0,
    requiresCard: false,
  },
];

const defaultSupportEmails = ['gabrielabattalini@gmail.com'];

export class PlanService {
  static async ensureDefaults() {
    for (const plan of defaultPlans) {
      await prisma.subscriptionPlan.upsert({
        where: { code: plan.code },
        create: plan,
        update: plan,
      });
    }
  }

  static async list() {
    return prisma.subscriptionPlan.findMany({
      orderBy: [{ priceCents: 'asc' }, { name: 'asc' }],
    });
  }

  static async getByCode(code: string) {
    return prisma.subscriptionPlan.findUnique({
      where: { code },
    });
  }

  static async setUserSubscription(userId: string, planCode: string, status = 'active') {
    const plan = await PlanService.getByCode(planCode);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    return prisma.userSubscription.upsert({
      where: { userId },
      create: {
        userId,
        planId: plan.id,
        status,
        currentPeriodStart: new Date(),
      },
      update: {
        planId: plan.id,
        status,
      },
      include: {
        plan: true,
      },
    });
  }

  static async grantSupportByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return PlanService.setUserSubscription(user.id, 'support', 'active');
  }

  static async ensureSupportForUser(userId: string, email: string) {
    const allowList = (process.env.SUPPORT_AUTO_EMAILS || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const effectiveAllowList = allowList.length ? allowList : defaultSupportEmails;

    if (!effectiveAllowList.includes(email.toLowerCase())) {
      return null;
    }

    const existing = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (existing) {
      return existing;
    }

    return PlanService.setUserSubscription(userId, 'support', 'active');
  }
}
