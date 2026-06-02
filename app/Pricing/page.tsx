import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";

type Plan = {
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    priceNote: "forever",
    description:
      "Evaluate Oracle AWR analysis with essential monthly capacity.",
    features: ["3 Reports / Month"],
    cta: "Get Started Free",
    href: "/analyze",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    priceNote: "/month",
    description:
      "Built for DBAs and consultants running recurring performance reviews.",
    features: ["Unlimited Reports", "PDF Exports", "SQL Analysis"],
    cta: "Start Professional",
    href: "/analyze",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "pricing",
    description:
      "For regulated environments requiring private deployment and dedicated support.",
    features: ["Private Deployment", "Custom AI Models", "Dedicated Support"],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

function planCardClassName(highlighted: boolean): string {
  if (highlighted) {
    return "relative flex flex-col rounded-2xl border border-accent bg-gradient-to-b from-navy-800/90 to-navy-900/80 p-8 shadow-2xl shadow-accent/20 transition-shadow lg:scale-[1.02]";
  }
  return "relative flex flex-col rounded-2xl border border-white/10 bg-navy-900/60 p-8 transition-shadow hover:border-white/20";
}

function planButtonClassName(plan: Plan): string {
  const base = "mt-8 block rounded-lg py-3.5 text-center text-sm font-semibold transition-all";
  if (plan.highlighted) {
    return `${base} bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-hover`;
  }
  if (plan.name === "Enterprise") {
    return `${base} border border-accent/40 bg-accent/10 text-white hover:bg-accent/20`;
  }
  return `${base} border border-white/20 bg-white/5 text-white hover:bg-white/10`;
}

function PricingCard({ plan }: { plan: Plan }) {
  const isEnterprise = plan.name === "Enterprise";

  return (
    <article key={plan.name} className={planCardClassName(plan.highlighted)}>
      {plan.highlighted ? (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
          <Sparkles className="h-3 w-3" />
          Most Popular
        </span>
      ) : null}

      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-white">
            {plan.price}
          </span>
          <span className="text-silver-400">{plan.priceNote}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-silver-400">
          {plan.description}
        </p>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-silver-200"
          >
            {isEnterprise ? (
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            ) : (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            )}
            {feature}
          </li>
        ))}
      </ul>

      <Link href={plan.href} className={planButtonClassName(plan)}>
        {plan.cta}
      </Link>
    </article>
  );
}

export default function PricingPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-white/10 py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="pointer-events-none absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-accent/15 blur-[100px]" />
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
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Enterprise plans for Oracle performance intelligence
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-silver-400">
            Transparent tiers for individual DBAs, consulting teams, and
            mission-critical enterprise deployments.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-navy-900/50 p-8 text-center lg:p-10">
          <h3 className="text-lg font-semibold text-white">
            Need a security review or procurement package?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-silver-400">
            Our team can provide architecture briefs, deployment options, and
            enterprise licensing for Oracle operations at scale.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Talk to sales
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
