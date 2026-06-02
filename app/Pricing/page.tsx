import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "3 Reports / Month",
    features: ["3 Reports / Month"],
    cta: "Get Started",
    href: "/analyze",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49/month",
    subtitle: "For active Oracle performance teams",
    features: ["Unlimited Reports", "PDF Exports", "SQL Analysis"],
    cta: "Start Professional",
    href: "/analyze",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Contact Sales",
    subtitle: "For mission-critical enterprise environments",
    features: ["Private Deployment", "Custom AI Models", "Dedicated Support"],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-accent">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Professional plans for Oracle performance teams
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-silver-400">
            Choose the package that fits your operational needs, from monthly
            reports to enterprise-scale private deployment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-accent bg-navy-800/80 shadow-2xl shadow-accent/15"
                  : "border-white/10 bg-navy-900/60"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Recommended
                </span>
              )}

              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-3 text-3xl font-bold text-white">{plan.price}</p>
              <p className="mt-2 text-sm text-silver-400">{plan.subtitle}</p>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-silver-300"
                  >
                    {plan.name === "Enterprise" ? (
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    ) : (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
