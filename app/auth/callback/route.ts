import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveAdminProfile } from "@/lib/admin/session";
import { writeAuditLog } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isSafeRelativePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\");
}

function customerNext(requestedNext: string) {
  if (!isSafeRelativePath(requestedNext) || requestedNext.startsWith("/admin")) {
    return "/dashboard";
  }
  return requestedNext;
}

function adminNext(requestedNext: string) {
  if (
    isSafeRelativePath(requestedNext) &&
    requestedNext.startsWith("/admin") &&
    requestedNext !== "/admin/login"
  ) {
    return requestedNext;
  }
  return "/admin";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext =
    requestUrl.searchParams.get("next") ??
    requestUrl.searchParams.get("redirectTo") ??
    "/dashboard";
  const source = requestUrl.searchParams.get("source");
  const origin = requestUrl.origin;
  // Only /admin/login OAuth sets source=admin. Missing source is always the customer flow.
  const isAdminFlow = source === "admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (isAdminFlow) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const staff = user
          ? await resolveAdminProfile({
              authUserId: user.id,
              email: user.email,
            })
          : null;

        if (staff) {
          await supabaseAdmin
            .from("users")
            .update({
              last_login_at: new Date().toISOString(),
              auth_user_id: user!.id,
              status: staff.status === "invited" ? "active" : staff.status,
            })
            .eq("id", staff.id);

          await writeAuditLog({
            actorId: staff.id,
            action: "admin_login_google",
            entityType: "users",
            entityId: staff.id,
          });

          return NextResponse.redirect(`${origin}${adminNext(requestedNext)}`);
        }

        await supabase.auth.signOut();
        const loginUrl = new URL("/admin/login", origin);
        loginUrl.searchParams.set("error", "unauthorized");
        if (requestedNext.startsWith("/admin") && isSafeRelativePath(requestedNext)) {
          loginUrl.searchParams.set("next", requestedNext);
        }
        return NextResponse.redirect(loginUrl.toString());
      }

      return NextResponse.redirect(`${origin}${customerNext(requestedNext)}`);
    }
  }

  const fallback = isAdminFlow ? "/admin/login" : "/login";
  return NextResponse.redirect(`${origin}${fallback}`);
}
