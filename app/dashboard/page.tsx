"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Database,
  FileText,
  Gauge,
  ListOrdered,
  TrendingUp,
} from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { dashboardMock } from "@/lib/dashboard-mock";

type TabId = "summary" | "waits" | "sql" | "recommendations";

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "summary", label: "Executive Summary", icon: FileText },
  { id: "waits", label: "Top Wait Events", icon: BarChart3 },
  { id: "sql", label: "Top SQL", icon: TrendingUp },
  { id: "recommendations", label: "Recommendations", icon: ListOrdered },
];

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function riskBadgeClass(risk: string): string {
  if (risk === "Low") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (risk === "Medium") return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  return "border-red-500/30 bg-red-500/10 text-red-400";
}

function KpiCard({
  label,
  value,
  sub,
  valueClass = "text-white",
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-navy-800/90 to-navy-900/90 p-5 shadow-lg shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-silver-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold leading-tight ${valueClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-silver-500">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const data = dashboardMock;
  const [activeTab, setActiveTab] = useState<TabId>("summary");

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
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Executive Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                {data.databaseName}
              </h1>
              <p className="mt-2 font-mono text-sm text-silver-400">
                {data.instanceName} · {data.snapWindow}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-800/80 px-3 py-2">
              <Database className="h-4 w-4 text-accent" />
              <span className="text-xs text-silver-400">AWR Rule Engine Assessment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-10 lg:px-8">
        <section>
          <p className="mb-4 text-sm font-medium text-silver-400">
            Assessment at a glance
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Health Score"
              value={`${data.healthScore} / 100`}
              valueClass={scoreColor(data.healthScore)}
            />
            <KpiCard
              label="Risk Level"
              value={data.riskLevel}
              valueClass={
                data.riskLevel === "Low"
                  ? "text-emerald-400"
                  : data.riskLevel === "Medium"
                    ? "text-amber-400"
                    : "text-red-400"
              }
            />
            <KpiCard
              label="Primary Bottleneck"
              value={data.bottleneck}
              valueClass="text-base sm:text-lg"
            />
            <KpiCard
              label="Confidence Score"
              value={`${data.confidence.toFixed(1)}%`}
              sub="Bottleneck classification"
            />
          </div>
          <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
            {data.bottleneckRationale}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-navy-900/60 shadow-xl shadow-black/20">
          <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-silver-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === "summary" && (
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Gauge className="h-5 w-5 text-accent" />
                    Executive Summary
                  </h2>
                  <p className="mt-1 text-sm text-silver-400">
                    Business and technical narrative from Oracle DBA rules
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Business Summary
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-silver-300">
                    {data.businessSummary}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Technical Summary
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-silver-300">
                    {data.technicalSummary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskBadgeClass(data.riskLevel)}`}
                  >
                    {data.riskLevel} Risk
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-silver-300">
                    {data.bottleneck}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-silver-300">
                    Health {data.healthScore}/100
                  </span>
                </div>
              </div>
            )}

            {activeTab === "waits" && (
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Activity className="h-5 w-5 text-accent" />
                    Top Wait Events
                  </h2>
                  <p className="mt-1 text-sm text-silver-400">
                    Ranked by percentage of database time during snapshot window
                  </p>
                </div>
                <div className="space-y-4">
                  {data.waitEvents.map((row) => (
                    <div key={row.event}>
                      <div className="mb-1.5 flex justify-between gap-4 text-sm">
                        <span className="font-mono text-silver-200">{row.event}</span>
                        <span className="shrink-0 font-semibold text-white">
                          {row.pctDbTime.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-navy-950 ring-1 ring-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400"
                          style={{ width: `${Math.min(row.pctDbTime, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "sql" && (
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Top SQL
                  </h2>
                  <p className="mt-1 text-sm text-silver-400">
                    SQL ordered by % of database time (elapsed time)
                  </p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-navy-900/80 text-xs uppercase tracking-wider text-silver-400">
                        <th className="px-4 py-3 font-semibold">SQL ID</th>
                        <th className="px-4 py-3 font-semibold">% DB Time</th>
                        <th className="px-4 py-3 font-semibold">Executions</th>
                        <th className="px-4 py-3 font-semibold">Elapsed (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topSql.map((row, i) => (
                        <tr
                          key={row.sqlId}
                          className={`border-b border-white/5 ${
                            i === 0 ? "bg-accent/10" : "bg-navy-900/40"
                          }`}
                        >
                          <td className="px-4 py-3 font-mono font-medium text-accent">
                            {row.sqlId}
                          </td>
                          <td className="px-4 py-3 font-semibold text-white">
                            {row.pctDbTime.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-silver-300">
                            {row.executions}
                          </td>
                          <td className="px-4 py-3 text-silver-300">
                            {row.elapsedSec}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3">
                  {data.topSql.slice(0, 5).map((row) => (
                    <div key={`bar-${row.sqlId}`}>
                      <div className="mb-1 flex justify-between text-xs text-silver-400">
                        <span className="font-mono">{row.sqlId}</span>
                        <span>{row.pctDbTime.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-navy-950">
                        <div
                          className="h-full rounded-full bg-violet-500/80"
                          style={{
                            width: `${(row.pctDbTime / data.topSql[0].pctDbTime) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "recommendations" && (
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <ListOrdered className="h-5 w-5 text-accent" />
                    Recommendations
                  </h2>
                  <p className="mt-1 text-sm text-silver-400">
                    Prioritized DBA actions from rule engine (pre-AI)
                  </p>
                </div>
                <ol className="space-y-3">
                  {data.recommendations.map((rec, i) => (
                    <li
                      key={rec}
                      className="flex gap-4 rounded-xl border border-white/10 bg-navy-800/50 px-4 py-4 text-sm leading-relaxed text-silver-200"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-sm font-bold text-accent">
                        {i + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>

        <p className="text-center text-xs text-silver-500">
          Sample AWR assessment data ·{" "}
          <Link href="/demo" className="text-accent hover:underline">
            View full demo report
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
