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
    code: 'free',
    name: 'Gratuito',
    description: 'Plano gratuito',
    priceCents: 0,
    currency: 'BRL',
    postsPerMonth: 4,
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
    description: 'Para criadores de conteúdo',
    priceCents: 4900,
    currency: 'BRL',
    postsPerMonth: 30,
    platformsLimit: 5,
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
    priceCents: 14900,
    currency: 'BRL',
    postsPerMonth: 90,
    platformsLimit: 5,
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
}
