import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  TrendingUp,
} from "lucide-react";
import { ExecutiveDashboard } from "@/components/awr/ExecutiveDashboard";
import { SiteShell } from "@/components/layout/SiteShell";
import { ANALYSIS_APP_URL } from "@/lib/analysis-app-url";
import { demoAwrMetrics, runAwrRules } from "@/lib/awr-rules";

const awrAnalysis = runAwrRules(demoAwrMetrics());

const criticalFindings = [
  "High CPU Utilization",
  "Buffer Busy Waits",
  "Top SQL Bottleneck",
];

const recommendations = [
  "Tune SQL abc123",
  "Add Index IDX_ORDERS_01",
  "Increase PGA",
];

const dashboardMetrics = [
  { label: "CPU Utilization", value: "78%", status: "critical", icon: Cpu },
  { label: "Buffer Busy Waits", value: "12.4%", status: "warning", icon: HardDrive },
  { label: "Top SQL DB Time", value: "31%", status: "critical", icon: TrendingUp },
  { label: "Active Sessions", value: "142", status: "normal", icon: Database },
];

const waitEvents = [
  { name: "db file sequential read", pct: 42 },
  { name: "buffer busy waits", pct: 18 },
  { name: "log file sync", pct: 12 },
  { name: "CPU time", pct: 28 },
];

const cpuTrend = [52, 61, 58, 72, 78, 74, 68, 78];

function HealthGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  const ring =
    score >= 80 ? "stroke-emerald-400" : score >= 60 ? "stroke-amber-400" : "stroke-amber-400";

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-navy-700"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 327} 327`}
          className={ring}
        />
      </svg>
      <div className="text-center">
        <p className={`text-3xl font-bold ${color}`}>{score}</p>
        <p className="text-xs text-silver-400">/ 100</p>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <SiteShell>
      <div className="border-b border-white/10 bg-navy-900/40">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Oracle AWR Demo Report
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Performance Assessment Report
              </h1>
              <p className="mt-2 font-mono text-sm text-silver-400">
                Snap ID 4521 · 26-Apr-2026 08:00 – 09:00 · Report ID AWR-DEMO-0426
              </p>
            </div>
            <a
              href={ANALYSIS_APP_URL}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Start Free Analysis
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-10 lg:px-8">
        <section className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 lg:p-8">
          <ExecutiveDashboard analysis={awrAnalysis} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
                  <Database className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-silver-400">Database</p>
                  <p className="text-lg font-semibold text-white">Production Oracle 19c</p>
                </div>
              </div>
              <div className="hidden h-10 w-px bg-white/10 lg:block" />
              <div>
                <p className="text-xs uppercase tracking-wider text-silver-400">Instance</p>
                <p className="font-mono text-sm text-silver-200">PROD_ORCL · RAC Node 1</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-silver-400">Elapsed</p>
                <p className="font-mono text-sm text-silver-200">60.00 min</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-navy-900/60 p-6">
            <HealthGauge score={awrAnalysis.healthScore} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-silver-400">
                Health Score
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  awrAnalysis.healthScore >= 80
                    ? "text-emerald-400"
                    : awrAnalysis.healthScore >= 60
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              >
                {awrAnalysis.healthScore} / 100
              </p>
              <p className="mt-1 text-sm text-silver-400">
                {awrAnalysis.riskLevel} risk — {awrAnalysis.bottleneckClassification}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-white">Executive Summary</h2>
          <p className="mt-4 leading-relaxed text-silver-300">
            Production Oracle 19c experienced elevated CPU utilization and I/O wait during the
            reporting window. Buffer busy waits indicate hot block contention on high-volume
            transactional tables. SQL_ID <span className="font-mono text-amber-300">abc123</span>{" "}
            accounts for 31% of database time and is the primary performance bottleneck. Immediate
            tuning of this statement and index review on the orders subsystem are recommended to
            restore stable response times before peak load periods.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Findings Dashboard</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-white/10 bg-navy-900/60 p-5"
              >
                <div className="flex items-center justify-between">
                  <metric.icon className="h-5 w-5 text-accent" />
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      metric.status === "critical"
                        ? "bg-red-500/15 text-red-400"
                        : metric.status === "warning"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {metric.status}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-white">{metric.value}</p>
                <p className="mt-1 text-sm text-silver-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6">
            <h2 className="text-lg font-semibold text-white">Top Wait Events</h2>
            <p className="mt-1 text-sm text-silver-400">% of DB time during snapshot</p>
            <div className="mt-6 space-y-4">
              {waitEvents.map((event) => (
                <div key={event.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-mono text-silver-300">{event.name}</span>
                    <span className="font-medium text-white">{event.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-navy-950">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400"
                      style={{ width: `${event.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6">
            <h2 className="text-lg font-semibold text-white">CPU Utilization Trend</h2>
            <p className="mt-1 text-sm text-silver-400">8 sample intervals (last 60 min)</p>
            <div className="mt-6 flex h-40 items-end justify-between gap-2">
              {cpuTrend.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-md ${
                      value >= 75 ? "bg-amber-500" : "bg-accent"
                    }`}
                    style={{ height: `${value * 1.6}px` }}
                  />
                  <span className="text-[10px] text-silver-500">{index + 1}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-amber-300">
              Peak CPU 78% at interval 5 — correlates with top SQL execution spike
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Critical Findings
            </h2>
            <ul className="mt-4 space-y-3">
              {criticalFindings.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-navy-900/50 px-4 py-3 text-sm text-silver-200"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Recommendations
            </h2>
            <ul className="mt-4 space-y-3">
              {recommendations.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-navy-900/50 px-4 py-3 text-sm text-silver-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">
            Run this analysis on your own AWR report
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-silver-400">
            Upload an Oracle AWR HTML export and receive a full performance assessment in minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={ANALYSIS_APP_URL}
              className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Start Free Analysis
            </a>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              View Pricing
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
