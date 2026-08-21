import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import {
  isCustomerOnboardingPath,
  normalizeStaffRole,
} from "@/lib/admin/rbac";

const CUSTOMER_AUTH_PAGES = ["/login", "/register"];
const CUSTOMER_PROTECTED = ["/dashboard", "/account", "/billing"];

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createServiceClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function resolveStaffRole(authUserId: string, email?: string | null) {
  const admin = getServiceClient();
  if (!admin) return null;

  let query = admin
    .from("users")
    .select("role, status, email")
    .limit(1);

  if (email) {
    query = query.or(`auth_user_id.eq.${authUserId},email.eq.${email}`);
  } else {
    query = query.eq("auth_user_id", authUserId);
  }

  const { data } = await query.maybeSingle();
  if (!data) {
    const bootstrap = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (email && bootstrap.includes(email.toLowerCase())) {
      return "super_admin";
    }
    return null;
  }

  if (data.status && data.status !== "active" && data.status !== "invited") {
    return null;
  }

  let role = normalizeStaffRole(data.role);
  if (!role) {
    const bootstrap = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const rowEmail = String(data.email || email || "").toLowerCase();
    if (bootstrap.includes(rowEmail)) role = "super_admin";
  }

  return role;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminProtected = isAdminRoute && !isAdminLogin;
  const isCustomerAuthPage = CUSTOMER_AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
  const isCustomerProtected = CUSTOMER_PROTECTED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isOnboarding = isCustomerOnboardingPath(pathname);

  const staffRole = user
    ? await resolveStaffRole(user.id, user.email)
    : null;
  const isStaff = !!staffRole;

  // --- Admin Center isolation ---
  if (isAdminLogin) {
    if (user && isStaff) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    // Customers or anonymous can view admin login page.
    return supabaseResponse;
  }

  if (isAdminProtected) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (!isStaff) {
      // Customers must never access Admin Center.
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // --- Customer auth pages ---
  // /login and /register always stay in the customer product. Staff roles
  // must not send these users to /admin; Admin Center is entered via /admin/login.
  if (isCustomerAuthPage) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // --- Staff blocked from customer onboarding ---
  if (user && isStaff && isOnboarding) {
    const allow = request.nextUrl.searchParams.get("allowStaff") === "1";
    if (!allow) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // --- Customer protected routes ---
  if (isCustomerProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
