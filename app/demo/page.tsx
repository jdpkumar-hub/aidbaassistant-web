import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
  FileText,
} from "lucide-react";

const criticalFindings = [
  "High CPU Utilization",
  "Buffer Busy Waits",
  "Top SQL Bottleneck",
];

const recommendations = [
  "Tune SQL ID abc123",
  "Review indexing strategy",
  "Increase PGA",
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-foreground">
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-accent">
            Demo Analysis Report
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Oracle AWR Report Preview
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-silver-400">
            This sample shows how AI DBA Assistant transforms raw Oracle AWR
            files into an executive-ready report with clear recommendations.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-14 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <article className="rounded-2xl border border-white/10 bg-navy-900/60 p-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <FileText className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs text-silver-300">
              awr_demo_analysis_report.pdf
            </span>
          </div>
          <div className="mt-5 rounded-xl border border-white/10 bg-navy-800/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-silver-400">
              Environment
            </p>
            <div className="mt-2 flex items-center gap-2 text-silver-200">
              <Database className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Production Oracle Database</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Critical Findings
              </p>
              <ul className="mt-3 space-y-2">
                {criticalFindings.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-silver-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Recommendations
              </p>
              <ul className="mt-3 space-y-2">
                {recommendations.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-silver-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <aside className="rounded-2xl border border-accent/30 bg-navy-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">Try Your Own Report</h2>
          <p className="mt-3 text-sm leading-relaxed text-silver-400">
            Upload your AWR and get AI-driven diagnostics in minutes.
          </p>
          <Link
            href="/analyze"
            className="mt-6 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Start Free Analysis
          </Link>
        </aside>
      </section>
    </main>
  );
}
