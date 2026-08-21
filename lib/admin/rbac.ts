export const STAFF_ROLES = [
  "super_admin",
  "admin",
  "sales",
  "support",
  "finance",
  "customer_success",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];
export type AppRole = StaffRole | "customer";

/** Roles allowed into Admin Center (includes legacy `manager`). */
export const ADMIN_CENTER_ROLES = [
  "super_admin",
  "admin",
  "manager",
  "support",
  "sales",
  "customer_success",
  "finance",
] as const;

/** Legacy role aliases mapped to current RBAC. */
const ROLE_ALIASES: Record<string, StaffRole> = {
  manager: "finance",
  superadmin: "super_admin",
  customer_success_manager: "customer_success",
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales: "Sales",
  support: "Support",
  finance: "Finance",
  customer_success: "Customer Success",
};

export function isAuthorizedAdminCenterRole(role?: string | null): boolean {
  if (!role) return false;
  const key = role.trim().toLowerCase();
  if ((ADMIN_CENTER_ROLES as readonly string[]).includes(key)) return true;
  return normalizeStaffRole(key) !== null;
}

export const PERMISSIONS = [
  "dashboard.view",
  "leads.read",
  "leads.write",
  "leads.delete",
  "customers.read",
  "customers.write",
  "users.read",
  "users.write",
  "users.impersonate",
  "subscriptions.read",
  "subscriptions.write",
  "invoices.read",
  "invoices.write",
  "tickets.read",
  "tickets.write",
  "reports.read",
  "reports.write",
  "campaigns.read",
  "campaigns.write",
  "products.write",
  "analytics.view",
  "settings.write",
  "audit.read",
  "system.health",
  "ai.assistant",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  super_admin: [...PERMISSIONS],
  admin: [...PERMISSIONS],
  sales: [
    "dashboard.view",
    "leads.read",
    "leads.write",
    "customers.read",
    "subscriptions.read",
    "analytics.view",
    "ai.assistant",
  ],
  support: [
    "dashboard.view",
    "customers.read",
    "tickets.read",
    "tickets.write",
    "reports.read",
  ],
  finance: [
    "dashboard.view",
    "customers.read",
    "subscriptions.read",
    "subscriptions.write",
    "invoices.read",
    "invoices.write",
    "products.write",
    "analytics.view",
  ],
  customer_success: [
    "dashboard.view",
    "customers.read",
    "customers.write",
    "subscriptions.read",
    "tickets.read",
    "tickets.write",
    "analytics.view",
    "ai.assistant",
  ],
};

export function normalizeStaffRole(role?: string | null): StaffRole | null {
  if (!role) return null;
  const key = role.trim().toLowerCase();
  if ((STAFF_ROLES as readonly string[]).includes(key)) {
    return key as StaffRole;
  }
  return ROLE_ALIASES[key] ?? null;
}

export function isStaffRole(role?: string | null): role is StaffRole {
  return normalizeStaffRole(role) !== null;
}

export function hasPermission(role: string | null | undefined, permission: Permission) {
  const normalized = normalizeStaffRole(role);
  if (!normalized) return false;
  return ROLE_PERMISSIONS[normalized].includes(permission);
}

export function permissionsForRole(role: string | null | undefined): Permission[] {
  const normalized = normalizeStaffRole(role);
  if (!normalized) return [];
  return ROLE_PERMISSIONS[normalized];
}

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  permission?: Permission;
};

export const ADMIN_NAV: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: "LayoutDashboard", permission: "dashboard.view" },
  { title: "CRM Leads", href: "/admin/crm", icon: "Database", permission: "leads.read" },
  { title: "Customers", href: "/admin/customers", icon: "Building2", permission: "customers.read" },
  { title: "Users", href: "/admin/users", icon: "Users", permission: "users.read" },
  { title: "Subscriptions", href: "/admin/subscriptions", icon: "CreditCard", permission: "subscriptions.read" },
  { title: "Invoices", href: "/admin/invoices", icon: "Receipt", permission: "invoices.read" },
  { title: "Support Tickets", href: "/admin/support", icon: "LifeBuoy", permission: "tickets.read" },
  { title: "AWR Reports", href: "/admin/reports/awr", icon: "FileBarChart", permission: "reports.read" },
  { title: "SQL Reports", href: "/admin/reports/sql", icon: "FileCode", permission: "reports.read" },
  { title: "API Usage", href: "/admin/api-usage", icon: "Activity", permission: "analytics.view" },
  { title: "Email Campaigns", href: "/admin/campaigns", icon: "Mail", permission: "campaigns.read" },
  { title: "Notifications", href: "/admin/notifications", icon: "Bell", permission: "dashboard.view" },
  { title: "Products", href: "/admin/products", icon: "Package", permission: "products.write" },
  { title: "Pricing Plans", href: "/admin/pricing", icon: "Tags", permission: "products.write" },
  { title: "Coupons", href: "/admin/coupons", icon: "TicketPercent", permission: "products.write" },
  { title: "Affiliates", href: "/admin/affiliates", icon: "Handshake", permission: "analytics.view" },
  { title: "Partners", href: "/admin/partners", icon: "Network", permission: "analytics.view" },
  { title: "Analytics", href: "/admin/analytics", icon: "BarChart3", permission: "analytics.view" },
  { title: "Audit Logs", href: "/admin/audit", icon: "ScrollText", permission: "audit.read" },
  { title: "Settings", href: "/admin/settings", icon: "Settings", permission: "settings.write" },
  { title: "System Health", href: "/admin/system-health", icon: "HeartPulse", permission: "system.health" },
  { title: "AI Assistant", href: "/admin/ai", icon: "Bot", permission: "ai.assistant" },
];

export const CUSTOMER_ONBOARDING_PREFIXES = [
  "/account",
  "/register",
] as const;

export function isCustomerOnboardingPath(pathname: string) {
  return CUSTOMER_ONBOARDING_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
