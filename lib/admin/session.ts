import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  isAuthorizedAdminCenterRole,
  isStaffRole,
  normalizeStaffRole,
  type StaffRole,
} from "@/lib/admin/rbac";

export type AdminProfile = {
  id: string;
  auth_user_id: string | null;
  email: string;
  name: string | null;
  role: StaffRole;
  status: string | null;
  avatar_url: string | null;
};

function bootstrapEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Resolve staff profile for the current Supabase Auth user.
 * Uses service role for reliable role lookup across RLS.
 */
export async function resolveAdminProfile(input?: {
  authUserId?: string;
  email?: string | null;
}): Promise<AdminProfile | null> {
  let authUserId = input?.authUserId;
  let email = input?.email?.toLowerCase() || null;

  if (!authUserId) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    authUserId = user.id;
    email = (user.email || "").toLowerCase() || null;
  }

  let query = supabaseAdmin
    .from("users")
    .select("id, auth_user_id, email, name, role, status, avatar_url");

  if (email) {
    query = query.or(`auth_user_id.eq.${authUserId},email.eq.${email}`);
  } else {
    query = query.eq("auth_user_id", authUserId);
  }

  const { data } = await query.limit(1).maybeSingle();
  if (!data) return null;

  const rowEmail = String(data.email || "").toLowerCase();
  // Accept configured Admin Center roles (incl. legacy manager) then normalize.
  if (!isAuthorizedAdminCenterRole(data.role) && !bootstrapEmails().includes(rowEmail)) {
    return null;
  }

  let role = normalizeStaffRole(data.role);

  if (!role && bootstrapEmails().includes(rowEmail)) {
    role = "super_admin";
    await supabaseAdmin
      .from("users")
      .update({
        role: "super_admin",
        status: "active",
        auth_user_id: data.auth_user_id || authUserId,
      })
      .eq("id", data.id);
  }

  if (!role) return null;

  const status = data.status || "active";
  if (status !== "active" && status !== "invited") return null;

  return {
    id: data.id,
    auth_user_id: data.auth_user_id,
    email: data.email,
    name: data.name,
    role,
    status,
    avatar_url: data.avatar_url,
  };
}

export async function isCurrentUserStaff() {
  const profile = await resolveAdminProfile();
  return !!profile && isStaffRole(profile.role);
}
