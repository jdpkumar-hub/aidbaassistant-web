import type { AwrAnalysisResult } from "@/lib/awr-rules";
import { severityStyles } from "@/lib/awr-rules";

type ExecutiveDashboardProps = {
  analysis: AwrAnalysisResult;
  showFindings?: boolean;
};

export function ExecutiveDashboard({
  analysis,
  showFindings = true,
}: ExecutiveDashboardProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Executive Dashboard
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">
          Oracle DBA Rule-Based Assessment
        </h2>
        <p className="mt-2 text-sm text-silver-400">
          Deterministic DBA thresholds applied before AI analysis ·{" "}
          {analysis.rulesTriggered} of {analysis.rulesEvaluated} rules triggered
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {analysis.kpiCards.map((kpi) => {
          const s = severityStyles[kpi.severity];
          return (
            <div
              key={kpi.label}
              className={`rounded-xl border p-5 ${s.border} ${s.bg}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-silver-400">
                  {kpi.label}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.badge}`}
                >
                  {kpi.severity}
                </span>
              </div>
              <p className={`mt-3 text-2xl font-bold ${s.text}`}>{kpi.value}</p>
              {kpi.detail && (
                <p className="mt-2 text-xs text-silver-400">{kpi.detail}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-800/60 p-6">
        <h3 className="text-sm font-semibold text-white">Executive Summary</h3>
        <p className="mt-3 text-sm leading-relaxed text-silver-300">
          {analysis.executiveSummary}
        </p>
      </div>

      {showFindings && analysis.findings.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Rule-Based Findings</h3>
          <ul className="space-y-2">
            {analysis.findings.map((f) => {
              const s = severityStyles[f.severity];
              return (
                <li
                  key={f.ruleId}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${s.border} ${s.bg}`}
                >
                  <span
                    className={`shrink-0 font-mono text-xs font-bold ${s.text}`}
                  >
                    {f.ruleId}
                  </span>
                  <div>
                    <p className="font-medium text-white">{f.category}</p>
                    <p className="mt-0.5 text-silver-300">{f.message}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {analysis.recommendations.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">
            DBA Recommendations (Pre-AI)
          </h3>
          <ul className="space-y-2 text-sm text-silver-300">
            {analysis.recommendations.map((rec) => (
              <li
                key={rec}
                className="rounded-lg border border-white/10 bg-navy-900/50 px-4 py-2.5"
              >
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
