import { NextResponse } from "next/server";
import { hasPermission, type Permission } from "@/lib/admin/rbac";
import { resolveAdminProfile, type AdminProfile } from "@/lib/admin/session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type AdminUser = AdminProfile;

export async function getAdminUser(): Promise<AdminUser | null> {
  return resolveAdminProfile();
}

export async function requireAdmin(permission?: Permission) {
  const admin = await getAdminUser();
  if (!admin) {
    return {
      admin: null as AdminUser | null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (permission && !hasPermission(admin.role, permission)) {
    return {
      admin: null as AdminUser | null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { admin, error: null as NextResponse | null };
}

export async function writeAuditLog(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await supabaseAdmin.from("audit_logs").insert({
    actor_id: input.actorId ?? null,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {},
  });
}
