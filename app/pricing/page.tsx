import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ANALYSIS_APP_URL } from "@/lib/analysis-app-url";

export default function PricingPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-silver-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mt-8 text-4xl font-bold text-white">Pricing</h1>
        <p className="mt-4 max-w-2xl text-lg text-silver-400">
          Choose the plan that fits your Oracle performance workflow.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-8">
            <h2 className="text-xl font-semibold text-white">Free</h2>
            <p className="mt-4 text-3xl font-bold text-white">$0</p>
            <ul className="mt-6 space-y-2 text-sm text-silver-300">
              <li>3 Reports / Month</li>
            </ul>
            <a
              href={ANALYSIS_APP_URL}
              className="mt-8 block rounded-lg border border-white/20 bg-white/5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              Get Started
            </a>
          </div>

          <div className="rounded-2xl border border-accent bg-navy-800/80 p-8 shadow-lg shadow-accent/10">
            <h2 className="text-xl font-semibold text-white">Professional</h2>
            <p className="mt-4 text-3xl font-bold text-white">$49/month</p>
            <ul className="mt-6 space-y-2 text-sm text-silver-300">
              <li>Unlimited Reports</li>
              <li>PDF Exports</li>
              <li>SQL Analysis</li>
            </ul>
            <a
              href={ANALYSIS_APP_URL}
              className="mt-8 block rounded-lg bg-accent py-3 text-center text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Start Professional
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-8">
            <h2 className="text-xl font-semibold text-white">Enterprise</h2>
            <p className="mt-4 text-3xl font-bold text-white">Custom</p>
            <ul className="mt-6 space-y-2 text-sm text-silver-300">
              <li>Private Deployment</li>
              <li>Custom AI Models</li>
              <li>Dedicated Support</li>
            </ul>
            <Link
              href="/contact"
              className="mt-8 block rounded-lg border border-accent/40 bg-accent/10 py-3 text-center text-sm font-semibold text-white hover:bg-accent/20"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
