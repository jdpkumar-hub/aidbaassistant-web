import Link from "next/link";
import { Check } from "lucide-react";
import { ANALYSIS_APP_URL } from "@/lib/analysis-app-url";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with essential AWR insights.",
    highlighted: false,
    features: [
      "3 reports per month",
      "Basic wait event summary",
      "Top SQL listing",
      "Email support",
    ],
    cta: "Start Free",
    ctaHref: ANALYSIS_APP_URL,
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "For DBAs and consultants who analyze weekly.",
    highlighted: true,
    features: [
      "Unlimited AWR reports",
      "Full SQL tuning recommendations",
      "PDF & HTML export",
      "Database health scoring",
      "Priority email support",
    ],
    cta: "Start Professional",
    ctaHref: ANALYSIS_APP_URL,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large IT teams with compliance needs.",
    highlighted: false,
    features: [
      "SSO & role-based access",
      "On-premises deployment option",
      "Dedicated success manager",
      "Custom SLAs",
      "Volume licensing",
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-white/10 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Plans that scale with your practice
          </h2>
          <p className="mt-4 text-lg text-silver-400">
            Start free. Upgrade when you need unlimited analysis and exports.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:items-center">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-accent bg-navy-800/80 shadow-xl shadow-accent/10 lg:scale-105"
                  : "border-white/10 bg-navy-900/50"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {tier.price}
                </span>
                {tier.price !== "Custom" && (
                  <span className="text-silver-400">/{tier.period}</span>
                )}
              </div>
              {tier.price === "Custom" && (
                <p className="mt-1 text-sm text-silver-400">{tier.period}</p>
              )}
              <p className="mt-4 text-sm text-silver-400">{tier.description}</p>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-silver-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              {tier.ctaHref.startsWith("http") ? (
                <a
                  href={tier.ctaHref}
                  className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  href={tier.ctaHref}
                  className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
