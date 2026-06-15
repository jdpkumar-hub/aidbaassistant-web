import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

type HeroProps = {
  onRequireAuth?: () => void;
};

export function Hero({ onRequireAuth }: HeroProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-navy-700/40 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-silver-300 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Enterprise Oracle Performance Intelligence
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
          Analyze Oracle AWR Reports in Minutes
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-silver-400 sm:text-xl">
          AI-powered diagnostics for Oracle performance analysis. Turn complex
          AWR data into actionable insights your team can trust.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onRequireAuth}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent-hover hover:shadow-accent/40"
          >
            Start Free Analysis
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-silver-400/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:border-silver-400/40 hover:bg-white/10"
          >
            <Play className="h-4 w-4 fill-current" />
            Try Demo Report
          </Link>
        </div>

        <p className="mt-14 text-sm font-medium uppercase tracking-wider text-silver-400">
          Built for Oracle DBAs · Consultants · Enterprise IT Teams
        </p>

        <div className="mt-16 rounded-2xl border border-white/10 bg-navy-900/60 p-1 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div className="rounded-xl border border-white/5 bg-navy-800/80 p-6 lg:p-8">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 font-mono text-xs text-silver-400">
                awr_analysis_summary.html
              </span>
            </div>
            <div className="mt-6 space-y-3 font-mono text-sm">
              <p className="text-emerald-400">
                ✓ Top wait event: db file sequential read (42.3%)
              </p>
              <p className="text-amber-400/90">
                ⚠ SQL_ID 8k2x9f: high buffer gets — tuning recommended
              </p>
              <p className="text-silver-300">
                → AI report ready · 3 critical · 7 advisory findings
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
