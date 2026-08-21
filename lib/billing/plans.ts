export type BillingCycle = "monthly" | "yearly";

export type PublicPlanKey = "free" | "professional" | "team" | "enterprise";

export type PlanLimits = {
  awr_reports_per_month: number;
  sql_rewrites_per_month: number;
  seats?: number;
};

export type PlanDefinition = {
  key: PublicPlanKey;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  trialDays: number;
  features: string[];
  limits: PlanLimits;
  highlighted?: boolean;
  contactSales?: boolean;
  /** Legacy / CRM aliases that resolve to this plan */
  aliases?: string[];
  stripeEnvMonthly?: string;
  stripeEnvYearly?: string;
};

export const PLAN_CATALOG: PlanDefinition[] = [
  {
    key: "free",
    name: "Free",
    description: "Get started with essential AWR insights.",
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    features: [
      "3 AWR reports per month",
      "5 SQL rewrites per month",
      "Basic wait event summary",
      "Email support",
    ],
    limits: { awr_reports_per_month: 3, sql_rewrites_per_month: 5 },
  },
  {
    key: "professional",
    name: "Professional",
    description: "For DBAs and consultants who analyze weekly.",
    priceMonthly: 99,
    priceYearly: 990,
    trialDays: 14,
    highlighted: true,
    features: [
      "Unlimited AWR reports",
      "200 SQL rewrites per month",
      "Full SQL tuning recommendations",
      "PDF & HTML export",
      "Priority email support",
    ],
    limits: { awr_reports_per_month: -1, sql_rewrites_per_month: 200 },
    aliases: ["pro", "starter"],
    stripeEnvMonthly: "STRIPE_PRO_PRICE_ID",
    stripeEnvYearly: "STRIPE_PRO_YEARLY_PRICE_ID",
  },
  {
    key: "team",
    name: "Team",
    description: "For consulting practices and DBA teams.",
    priceMonthly: 299,
    priceYearly: 2990,
    trialDays: 14,
    features: [
      "Everything in Professional",
      "Unlimited SQL rewrites",
      "Up to 10 seats",
      "Shared workspace",
      "SSO-ready",
    ],
    limits: { awr_reports_per_month: -1, sql_rewrites_per_month: -1, seats: 10 },
    aliases: ["business"],
    stripeEnvMonthly: "STRIPE_TEAM_PRICE_ID",
    stripeEnvYearly: "STRIPE_TEAM_YEARLY_PRICE_ID",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    description: "For large IT teams with compliance needs.",
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 30,
    contactSales: true,
    features: [
      "Custom limits & volume licensing",
      "Dedicated success manager",
      "Custom SLAs",
      "SSO & role-based access",
      "On-premises deployment option",
    ],
    limits: { awr_reports_per_month: -1, sql_rewrites_per_month: -1, seats: -1 },
  },
];

const ALIAS_MAP: Record<string, PublicPlanKey> = Object.fromEntries(
  PLAN_CATALOG.flatMap((plan) => [
    [plan.key, plan.key],
    ...(plan.aliases || []).map((alias) => [alias, plan.key] as const),
  ])
) as Record<string, PublicPlanKey>;

export function normalizePlanKey(key?: string | null): PublicPlanKey {
  if (!key) return "free";
  return ALIAS_MAP[key.trim().toLowerCase()] || "free";
}

export function getPlanDefinition(key?: string | null): PlanDefinition {
  const normalized = normalizePlanKey(key);
  return PLAN_CATALOG.find((p) => p.key === normalized) || PLAN_CATALOG[0];
}

export function formatPlanPrice(plan: PlanDefinition, cycle: BillingCycle) {
  if (plan.contactSales) return "Custom";
  if (plan.priceMonthly === 0) return "$0";
  const amount = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  return `$${amount}`;
}

export function isUnlimited(limit: number) {
  return limit < 0;
}
