"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Database,
  FileText,
  Gauge,
  ListOrdered,
  Loader2,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import type { DashboardData } from "@/lib/awr-dashboard-types";
import WaitEventsChart from "@/components/WaitEventsChart";

type TabId =
  | "summary"
  | "insights"
  | "waits"
  | "sql"
  | "sqlInsight"
  | "sqlTuning"
  | "recommendations";

const TABS = [
  { id: "summary", label: "Executive Summary", icon: FileText },
  { id: "insights", label: "AI Findings", icon: Activity },
  { id: "waits", label: "Top Wait Events", icon: BarChart3 },
  { id: "sql", label: "Top SQL", icon: TrendingUp },
  { id: "sqlInsight", label: "SQL Insight", icon: Database },
  { id: "sqlTuning", label: "SQL Tuning", icon: Gauge },
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
function DashboardBody({
  data,
  analysisId,
}: {
  data: DashboardData;
  analysisId: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const [sqlText, setSqlText] = useState("");
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [selectedSql, setSelectedSql] = useState<any>(null);
  const [loadingSql, setLoadingSql] = useState(false);
  
	const handleDownloadPdf = () => {
	  if (!analysisId) return;
	  
	  const apiUrl = process.env.NEXT_PUBLIC_AWR_API_URI; 

	  window.open(
		`${apiUrl}/report/${analysisId}/pdf`,
		"_blank"
	  );
	};  

  const topSqlMax = data.topSql[0]?.pctDbTime || 1;
	const analyzeSql = async (sqlOverride?: string) => {
	  const sqlToAnalyze =
		typeof sqlOverride === "string"
		  ? sqlOverride
		  : sqlText;

	  if (!sqlToAnalyze?.trim()) return;  
  
  setLoadingSql(true);

  try {
    const res = await fetch("/api/sql-rewrite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: sqlToAnalyze,
      }),
    });

	const json = await res.json();
	console.log("FULL JSON");
	console.log(JSON.stringify(json, null, 2));
	setSqlResult(json);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingSql(false);
  }
  };
  console.log("SQL RESULT =", sqlResult);
  return (
    <>
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
			<div className="flex flex-wrap items-center gap-3">
			  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-800/80 px-3 py-2">
				<Database className="h-4 w-4 text-accent" />
				<span className="text-xs text-silver-400">
				  AWR Rule Engine Assessment
				</span>
			  </div>
			  <button
				onClick={handleDownloadPdf}
				className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
			  >
				Download PDF
			  </button>
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
			  label="SEVERITY"
			  value={data.severity?.level || "Unknown"}
			  valueClass={
				data.severity?.level === "Low"
				  ? "text-emerald-400"
				  : data.severity?.level === "Medium"
				  ? "text-yellow-400"
				  : "text-red-400"
			  }
			  sub={`Score ${data.severity?.score || 0}/100 | Confidence ${data.severity?.confidence || 0}%`}
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
                  onClick={() => setActiveTab(tab.id as TabId)}
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
			
			{activeTab === "insights" && data.intelligentFinding && (
			  <div className="space-y-6">

				<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
				  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
					Finding
				  </h3>
				  <p className="mt-3 text-sm leading-relaxed text-silver-300">
					{data.intelligentFinding.finding}
				  </p>
				</div>

				<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
				  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
					Likely Cause
				  </h3>
				  <p className="mt-3 text-sm leading-relaxed text-silver-300">
					{data.intelligentFinding.likelyCause}
				  </p>
				</div>

				<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
				  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
					Evidence
				  </h3>
				  <ul className="mt-3 list-disc pl-5 text-sm text-silver-300 space-y-2">
					{data.intelligentFinding.evidence.map((e) => (
					  <li key={e}>{e}</li>
					))}
				  </ul>
				</div>
				<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
				  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
					Business Impact
				  </h3>
				  <p className="mt-3 text-sm leading-relaxed text-silver-300">
					{data.intelligentFinding.businessImpact}
				  </p>
				</div>

				<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
				  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
					Recommendation
				  </h3>
				  <p className="mt-3 text-sm leading-relaxed text-silver-300">
					{data.intelligentFinding.recommendation}
				  </p>
				</div>

			  </div>
			)}
			{activeTab === "sqlTuning" && (
			  <div className="space-y-6">

				{/* KPI Cards */}
				<div className="grid gap-4 md:grid-cols-3">

				  <KpiCard
					label="Severity"
					value={
					  selectedSql?.pctDbTime > 10
						? "High"
						: selectedSql?.pctDbTime > 5
						? "Medium"
						: "Low"
					}
					valueClass={
					  selectedSql?.pctDbTime > 10
						? "text-red-400"
						: selectedSql?.pctDbTime > 5
						? "text-yellow-400"
						: "text-emerald-400"
					}					
				  />

				  <KpiCard
					label="SQL Impact"
					value={
					  selectedSql
						? `${selectedSql.pctDbTime}%`
						: data.sqlInsight?.finding?.match(/\d+\.\d+%/)?.[0] || "-"
					}					
				  />

				  <KpiCard
					label="Estimated Gain"
					value={data.sqlInsight?.estimated_gain}
					valueClass="text-emerald-400"
				  />

				</div>
				<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
					  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
						SQL ID
					  </h3>

					  <p className="mt-3 font-mono text-lg text-white">
						{selectedSql?.sqlId || data.sqlInsight?.sql_id || "Unknown"}
					  </p>
					</div>
					 <div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
						  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
							Likely Cause
						  </h3>

						  <p className="mt-3 text-silver-300">
							{data.sqlInsight?.likely_cause}
						  </p>
						</div>	
					 <div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
						  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
							Business Impact
						  </h3>

						  <p className="mt-3 text-silver-300">
							{data.sqlInsight?.business_impact}
						  </p>
						</div>
					<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
						  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
							Recommended Actions
						  </h3>

						  <ul className="mt-3 list-disc pl-6 text-silver-300 space-y-2">
							{data.sqlInsight?.recommendation?.map((item, idx) => (
							  <li key={idx}>{item}</li>
							))}
						  </ul>
						</div>
						<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">

						  <h3 className="text-lg font-semibold text-white">
							SQL Rewrite Generator
						  </h3>
							{selectedSql && (
							  <div className="mb-6 rounded-xl border border-white/10 bg-navy-800/50 p-5">
								<h3 className="text-accent font-semibold">
								  AWR Context
								</h3>

								<div className="mt-4 grid gap-4 md:grid-cols-4">

								  <div>
									<div className="text-xs text-silver-400">
									  SQL ID
									</div>
									<div>{selectedSql.sqlId}</div>
								  </div>

								  <div>
									<div className="text-xs text-silver-400">
									  DB Time %
									</div>
									<div>{selectedSql.pctDbTime}</div>
								  </div>

								  <div>
									<div className="text-xs text-silver-400">
									  Executions
									</div>
									<div>{selectedSql.executions}</div>
								  </div>

								  <div>
									<div className="text-xs text-silver-400">
									  Elapsed
									</div>
									<div>{selectedSql.elapsedSeconds}</div>
								  </div>

								</div>
							  </div>
							)}
						  <textarea
							value={sqlText}
							onChange={(e) => setSqlText(e.target.value)}
							placeholder="Paste Oracle SQL here..."
							className="mt-4 h-56 w-full rounded-lg bg-black/30 p-4 font-mono text-sm text-white"
						  />

						  <button
							onClick={() => analyzeSql()}
							className="mt-4 rounded-lg bg-accent px-4 py-2 font-semibold text-white"
						  >
							{loadingSql ? "Analyzing..." : "Analyze SQL"}
						  </button>
						</div>						


					{sqlResult && (
					  <div className="space-y-6">

						<div className="grid gap-4 md:grid-cols-3">
						  <KpiCard
							label="Risk Level"
							value={sqlResult.risk_level}
							valueClass="text-red-400"
						  />

						  <KpiCard
							label="Issues"
							value={String(sqlResult.issues?.length || 0)}
						  />

						  <KpiCard
							label="Optimization Potential"
							value="30-50%"
							valueClass="text-emerald-400"
						  />
						</div>

						<div className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
						  <h3 className="text-accent font-semibold">
							Issues Found
						  </h3>

						  <ul className="mt-3 list-disc pl-6 text-silver-300">
							{sqlResult.issues?.map((issue: any, idx: number) => (
							  <li key={idx}>
								{typeof issue === "string"
								  ? issue
								  : JSON.stringify(issue)}
							  </li>
							))}							
						  </ul>
						</div>
						<div className="mt-6">
						  <h3 className="text-lg font-semibold text-accent">
							Optimized SQL
						  </h3>

						  <div className="mb-3 flex gap-2">
							<button
							  onClick={() =>
								navigator.clipboard.writeText(sqlResult?.optimized_sql || "")
							  }
							  className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white"
							>
							  Copy SQL
							</button>

							<button
							  onClick={() => {
								const blob = new Blob(
								  [sqlResult?.optimized_sql || ""],
								  { type: "text/sql" }
								);

								const url = URL.createObjectURL(blob);

								const a = document.createElement("a");
								a.href = url;
								a.download = "optimized_sql.sql";
								a.click();

								URL.revokeObjectURL(url);
							  }}
							  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white"
							>
							  Download SQL
							</button>
						  </div>

						  <pre className="overflow-auto rounded-lg bg-black/40 p-4 font-mono text-sm text-green-300">
							{sqlResult?.optimized_sql}
						  </pre>
						</div>
						

						{sqlResult?.index_recommendations?.length > 0 && (
						  <div className="mt-6">
							<h3 className="text-lg font-semibold text-accent">
							  Recommended Indexes
							</h3>

							<ul className="mt-3 list-disc pl-6 text-silver-300">
								{sqlResult.index_recommendations?.map((item: any, idx: number) => (
								  <li key={idx}>
									{typeof item === "string"
									  ? item
									  : item.ddl || JSON.stringify(item)}
								  </li>
								))}							
							</ul>
						  </div>
						)}

					  </div>
					)}	
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
					{data.waitEvents.length > 0 && (
					  <WaitEventsChart data={data.waitEvents} />
					)}				  
                </div>
				{/*
                <div className="space-y-4">
                  {data.waitEvents.length === 0 && (
                    <p className="text-sm text-silver-400">
                      No wait events extracted from this report.
                    </p>
                  )}
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
                </div>   */}
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
                {data.topSql.length === 0 && (
                  <p className="text-sm text-silver-400">
                    No SQL workload data extracted from this report.
                  </p>
                )}
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-navy-900/80 text-xs uppercase tracking-wider text-silver-400">
                        <th className="px-4 py-3 font-semibold">SQL ID</th>
                        <th className="px-4 py-3 font-semibold">% DB Time</th>
                        <th className="px-4 py-3 font-semibold">Executions</th>
                        <th className="px-4 py-3 font-semibold">Elapsed (s)</th>
						<th className="px-4 py-3 font-semibold">Action</th>
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
							<td className="px-4 py-3">

							  <button
								onClick={() => {
								  setSelectedSql(row);
								  setSqlText(row.sqlText || "");
								  setActiveTab("sqlTuning");
								}}							  
								className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
							  >
								Tune SQL
							  </button>

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
                            width: `${(row.pctDbTime / topSqlMax) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
			{activeTab === "sqlInsight" && data.sqlInsight && (
			  <div className="space-y-6">

				<div className="rounded-xl border border-slate-800 p-6 bg-slate-950">
				  <h3 className="text-xl font-bold mb-4">
					{data.sqlInsight?.title}
				  </h3>

				  <p>{data.sqlInsight?.finding}</p>
				</div>

				<div className="rounded-xl border border-slate-800 p-6 bg-slate-950">
				  <h3 className="text-xl font-bold mb-4">
					Evidence
				  </h3>

				  <ul className="list-disc pl-6 space-y-2">
					{data.sqlInsight?.evidence.map((item, idx) => (
					  <li key={idx}>{item}</li>
					))}
				  </ul>
				</div>

				<div className="rounded-xl border border-slate-800 p-6 bg-slate-950">
				  <h3 className="text-xl font-bold mb-4">
					Recommendation
				  </h3>

				  <p>{data.sqlInsight?.recommendation}</p>
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

        {data.warnings && data.warnings.length > 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
            {data.warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-silver-500">
          Live AWR analysis ·{" "}
          <Link href="/analyze" className="text-accent hover:underline">
            Analyze another report
          </Link>
        </p>
      </div>
    </>
  );
}

function DashboardLoader() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyze/awr?id=${encodeURIComponent(id)}`);
      const json = await res.json();
      if (!res.ok || !json.success || !json.dashboard) {
        setError(
          json.errors?.[0] ?? "Could not load analysis. Upload a new AWR report.",
        );
        setData(null);
        return;
      }
	console.log("DASHBOARD JSON", json.dashboard);
	console.log("INTELLIGENT FINDING", json.dashboard.intelligentFinding);	
	console.log("SQL INSIGHT", json.dashboard.sqlInsight);	
      setData(json.dashboard as DashboardData);
    } catch {
      setError("Failed to load analysis results.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get("id");
    const fromStorage =
      typeof window !== "undefined"
        ? sessionStorage.getItem("lastAnalysisId")
        : null;
    const id = fromUrl ?? fromStorage;
    if (!id) {
      return;
    }
    void fetchAnalysis(id);
  }, [searchParams, fetchAnalysis]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-6 py-24">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-sm text-silver-400">Loading AWR analysis results…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-6 text-xl font-semibold text-white">
          No analysis loaded
        </h2>
        <p className="mt-3 text-sm text-silver-400">
          {error ??
            "Upload an Oracle AWR HTML report and run analysis to view the executive dashboard."}
        </p>
        <Link
          href="/analyze"
          className="mt-8 inline-flex rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover"
        >
          Analyze AWR Report
        </Link>
      </div>
    );
  }

	const analysisId =
	  searchParams.get("id") ??
	  sessionStorage.getItem("lastAnalysisId") ??
	  "";

	return <DashboardBody data={data} analysisId={analysisId} />;
}

export default function DashboardPage() {
  return (
    <SiteShell>
      <Suspense
        fallback={
          <div className="mx-auto flex max-w-6xl justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
          </div>
        }
      >
        <DashboardLoader />
      </Suspense>
    </SiteShell>
  );
}
