import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  getPlanDefinition,
  isUnlimited,
  normalizePlanKey,
  type PlanLimits,
} from "@/lib/billing/plans";
import { resolveAppUser } from "@/lib/billing/customer";

export type UsageMetric = "awr_reports" | "sql_rewrites";

const METRIC_TO_LIMIT: Record<UsageMetric, keyof PlanLimits> = {
  awr_reports: "awr_reports_per_month",
  sql_rewrites: "sql_rewrites_per_month",
};

function currentPeriodYm(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function resolveUserPlanLimits(identity?: {
  authUserId?: string;
  email?: string | null;
}) {
  const appUser = await resolveAppUser(
    identity?.authUserId
      ? { authUserId: identity.authUserId, email: identity.email }
      : undefined
  );
  const planKey = normalizePlanKey(appUser?.plan_key || "free");
  const plan = getPlanDefinition(planKey);

  // Prefer live pricing_plans.limits when present
  const { data: dbPlan } = await supabaseAdmin
    .from("pricing_plans")
    .select("limits")
    .eq("key", planKey)
    .maybeSingle();

  const limits = {
    ...plan.limits,
    ...((dbPlan?.limits as Partial<PlanLimits> | null) || {}),
  };

  return {
    appUser,
    planKey,
    plan,
    limits,
    status: appUser?.subscription_status || "free",
  };
}

export async function getUsageCount(input: {
  userId?: string | null;
  authUserId?: string | null;
  metric: UsageMetric;
  periodYm?: string;
}) {
  const periodYm = input.periodYm || currentPeriodYm();
  let query = supabaseAdmin
    .from("usage_events")
    .select("quantity")
    .eq("metric", input.metric)
    .eq("period_ym", periodYm);

  if (input.userId) {
    query = query.eq("user_id", input.userId);
  } else if (input.authUserId) {
    query = query.eq("auth_user_id", input.authUserId);
  } else {
    return 0;
  }

  const { data } = await query;
  return (data || []).reduce((sum, row) => sum + Number(row.quantity || 0), 0);
}

export async function assertPlanLimit(
  metric: UsageMetric,
  identity?: { authUserId: string; email?: string | null }
) {
  const { appUser, planKey, plan, limits, status } =
    await resolveUserPlanLimits(identity);

  if (!appUser) {
    return {
      ok: false as const,
      status: 401,
      error: "Sign in required to use this feature.",
      planKey,
    };
  }

  // Cancelled / unpaid paid plans fall back to free limits
  const effectiveKey =
    status === "active" || status === "trialing" || status === "past_due"
      ? planKey
      : planKey === "free"
        ? "free"
        : status === "free"
          ? "free"
          : planKey === "enterprise"
            ? "enterprise"
            : status === "cancelled" || status === "canceled"
              ? "free"
              : planKey;

  const effectivePlan =
    effectiveKey === planKey ? plan : getPlanDefinition(effectiveKey);
  const effectiveLimits =
    effectiveKey === planKey ? limits : effectivePlan.limits;

  const limitKey = METRIC_TO_LIMIT[metric];
  const limit = Number(effectiveLimits[limitKey] ?? 0);

  if (isUnlimited(limit)) {
    return {
      ok: true as const,
      appUser,
      planKey: effectivePlan.key,
      used: 0,
      limit: -1,
    };
  }

  const used = await getUsageCount({
    userId: appUser.id,
    authUserId: appUser.auth_user_id,
    metric,
  });

  if (used >= limit) {
    return {
      ok: false as const,
      status: 402,
      error: `You've reached your ${effectivePlan.name} plan limit (${limit} ${metric.replace("_", " ")} this month). Upgrade at /billing.`,
      planKey: effectivePlan.key,
      used,
      limit,
    };
  }

  return {
    ok: true as const,
    appUser,
    planKey: effectivePlan.key,
    used,
    limit,
  };
}

export async function recordUsage(input: {
  metric: UsageMetric;
  quantity?: number;
  userId?: string | null;
  authUserId?: string | null;
  customerId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const periodYm = currentPeriodYm();
  const { error } = await supabaseAdmin.from("usage_events").insert({
    metric: input.metric,
    quantity: input.quantity ?? 1,
    user_id: input.userId || null,
    auth_user_id: input.authUserId || null,
    customer_id: input.customerId || null,
    period_ym: periodYm,
    metadata: input.metadata || {},
  });

  if (error) {
    console.error("[billing.usage] failed to record usage", {
      metric: input.metric,
      error: error.message,
    });
  }
}
