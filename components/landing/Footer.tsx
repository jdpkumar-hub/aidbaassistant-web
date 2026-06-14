import Link from "next/link";
import { AuthRequiredLink } from "@/components/auth/AuthRequiredLink";

const productLinks = [
  { href: "/analyze", label: "Analyze", requiresAuth: true },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true },
  { href: "/#features", label: "Features" },
  { href: "/#demo", label: "Demo Report" },
  { href: "/#pricing", label: "Pricing" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900/50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold">
                AI
              </span>
              AI DBA Assistant
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver-400">
              Enterprise Oracle Performance Intelligence. AI-powered diagnostics
              for Oracle DBAs, consultants, and IT teams.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  {link.requiresAuth ? (
                    <AuthRequiredLink
                      href={link.href}
                      className="text-sm text-silver-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </AuthRequiredLink>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-silver-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-silver-400">
            © {new Date().getFullYear()} AI DBA Assistant. All rights reserved.
          </p>
          <p className="text-sm text-silver-400">
            Enterprise Oracle Performance Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
