import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPlanDefinition, normalizePlanKey } from "@/lib/billing/plans";

const APP_USER_COLUMNS =
  "id, auth_user_id, email, name, role, plan_key, subscription_status, stripe_customer_id, billing_cycle, current_period_end, cancel_at_period_end";

export type AppUserRow = {
  id: string;
  auth_user_id: string | null;
  email: string;
  name: string | null;
  role: string | null;
  plan_key: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  billing_cycle: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
};

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function resolveAppUser(input?: {
  authUserId?: string;
  email?: string | null;
}): Promise<AppUserRow | null> {
  let authUserId = input?.authUserId;
  let email = input?.email?.toLowerCase() || null;

  if (!authUserId) {
    const user = await getAuthUser();
    if (!user) return null;
    authUserId = user.id;
    email = (user.email || "").toLowerCase() || null;
  }

  let query = supabaseAdmin.from("users").select(APP_USER_COLUMNS);

  if (email) {
    const safeEmail = email.replace(/"/g, "");
    query = query.or(`auth_user_id.eq.${authUserId},email.eq."${safeEmail}"`);
  } else {
    query = query.eq("auth_user_id", authUserId);
  }

  const { data, error } = await query.limit(1).maybeSingle();
  if (error) {
    console.info("[billing.customer] resolveAppUser lookup failed", {
      message: error.message,
      hasAuthUserId: !!authUserId,
      hasEmail: !!email,
    });
  }
  return (data as AppUserRow | null) || null;
}

/**
 * Authenticated customers (especially Google OAuth) may exist in Auth
 * without a public.users row. Plan-limit checks need that row.
 */
export async function ensureCustomerAppUser(
  authUser: User
): Promise<AppUserRow | null> {
  const email = (authUser.email || "").toLowerCase() || null;
  const existing = await resolveAppUser({
    authUserId: authUser.id,
    email,
  });

  if (existing) {
    if (!existing.auth_user_id) {
      const { data } = await supabaseAdmin
        .from("users")
        .update({ auth_user_id: authUser.id })
        .eq("id", existing.id)
        .select(APP_USER_COLUMNS)
        .maybeSingle();
      if (data) return data as AppUserRow;
      return { ...existing, auth_user_id: authUser.id };
    }
    return existing;
  }

  const name =
    (typeof authUser.user_metadata?.full_name === "string"
      ? authUser.user_metadata.full_name
      : null) ||
    (typeof authUser.user_metadata?.name === "string"
      ? authUser.user_metadata.name
      : null);

  const provider =
    (typeof authUser.app_metadata?.provider === "string"
      ? authUser.app_metadata.provider
      : null) || "email";

  const { data: created, error } = await supabaseAdmin
    .from("users")
    .insert({
      id: authUser.id,
      auth_user_id: authUser.id,
      email: email || authUser.id,
      name,
      role: "customer",
      provider,
      plan_key: "free",
      subscription_status: "free",
      status: "active",
    })
    .select(APP_USER_COLUMNS)
    .maybeSingle();

  if (created) return created as AppUserRow;

  console.info("[billing.customer] ensureCustomerAppUser insert skipped", {
    message: error?.message || "no row returned",
  });

  return resolveAppUser({ authUserId: authUser.id, email });
}

async function patchLinkedCustomer(
  existing: Record<string, unknown> & { id: string },
  appUser: AppUserRow
) {
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (!existing.user_id) patch.user_id = appUser.id;
  if (appUser.stripe_customer_id && !existing.stripe_customer_id) {
    patch.stripe_customer_id = appUser.stripe_customer_id;
  }
  if (!existing.plan_key) {
    patch.plan_key = normalizePlanKey(appUser.plan_key);
  }

  const { data: updated } = await supabaseAdmin
    .from("customers")
    .update(patch)
    .eq("id", existing.id)
    .select("*")
    .single();

  return updated || existing;
}

/**
 * Ensure a CRM `customers` row exists for the signed-in app user.
 * Keeps customer portal and admin CRM aligned on the same billing entity.
 */
export async function ensureCustomerForUser(appUser: AppUserRow) {
  const email = appUser.email.toLowerCase();

  if (appUser.id) {
    const { data } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("user_id", appUser.id)
      .limit(1)
      .maybeSingle();
    if (data) return patchLinkedCustomer(data, appUser);
  }

  if (appUser.stripe_customer_id) {
    const { data } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("stripe_customer_id", appUser.stripe_customer_id)
      .limit(1)
      .maybeSingle();
    if (data) return patchLinkedCustomer(data, appUser);
  }

  const { data: byEmail } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("email", email)
    .limit(1)
    .maybeSingle();
  if (byEmail) return patchLinkedCustomer(byEmail, appUser);

  const plan = getPlanDefinition(appUser.plan_key);
  const { data: created, error } = await supabaseAdmin
    .from("customers")
    .insert({
      user_id: appUser.id,
      name: appUser.name || email,
      email,
      status:
        appUser.subscription_status === "active" ||
        appUser.subscription_status === "trialing"
          ? appUser.subscription_status
          : "active",
      plan_key: plan.key,
      mrr: plan.priceMonthly,
      arr: plan.priceMonthly * 12,
      stripe_customer_id: appUser.stripe_customer_id,
    })
    .select("*")
    .single();

  if (error || !created) {
    throw new Error(error?.message || "Failed to create billing customer");
  }

  return created;
}

export async function getActiveSubscriptionForCustomer(customerId: string) {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("*, pricing_plans:plan_id(id, key, name, limits, features)")
    .eq("customer_id", customerId)
    .in("status", ["active", "trialing", "past_due"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}
