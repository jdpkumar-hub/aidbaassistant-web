import type { AwrAnalysisResult } from "@/lib/awr-rules";
import { severityStyles } from "@/lib/awr-rules";

type ExecutiveDashboardProps = {
  analysis: AwrAnalysisResult;
  showFindings?: boolean;
};

function severityLabel(severity: string): string {
  if (severity === "red") return "Critical";
  if (severity === "amber") return "Warning";
  return "Normal";
}

/** Minimal inline emphasis for generator output (**bold**). */
function SummaryText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-sm leading-relaxed text-silver-300">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function TechnicalBlock({ text }: { text: string }) {
  const blocks = text.split("\n\n").filter(Boolean);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-silver-300">
      {blocks.map((block) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={block.slice(0, 40)} className="list-inside list-disc space-y-1">
              {lines.map((line) => (
                <li key={line}>{line.replace(/^- \*\*/, "").replace(/\*\*/g, "")}</li>
              ))}
            </ul>
          );
        }
        return <SummaryText key={block.slice(0, 40)} text={block} />;
      })}
    </div>
  );
}

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
          {analysis.rulesTriggered} of {analysis.rulesEvaluated} rules triggered ·
          Health score {analysis.healthScore}/100
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

      <div className="space-y-4 rounded-xl border border-white/10 bg-navy-800/60 p-6">
        <h3 className="text-sm font-semibold text-white">Executive Summary</h3>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">
            Business Summary
          </h4>
          <div className="mt-2">
            <SummaryText
              text={analysis.businessSummary || analysis.executiveSummary}
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">
            Technical Summary
          </h4>
          <div className="mt-2">
            <TechnicalBlock text={analysis.technicalSummary} />
          </div>
        </div>

        {analysis.topActions.length > 0 && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">
              Top 5 Actions
            </h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-silver-300">
              {analysis.topActions.map((action) => (
                <li key={action} className="leading-relaxed">
                  {action}
                </li>
              ))}
            </ol>
          </div>
        )}

        {analysis.executiveSummaryMarkdown && (
          <details className="border-t border-white/10 pt-4">
            <summary className="cursor-pointer text-xs font-medium text-silver-400 hover:text-white">
              View Markdown export
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto rounded-lg border border-white/10 bg-navy-950/80 p-4 font-mono text-xs leading-relaxed text-silver-400 whitespace-pre-wrap">
              {analysis.executiveSummaryMarkdown}
            </pre>
          </details>
        )}
      </div>

      {showFindings && analysis.findings.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">
            Rule Engine Findings
          </h3>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-navy-900/80 text-xs uppercase tracking-wider text-silver-400">
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Rule</th>
                  <th className="px-4 py-3 font-semibold">Finding</th>
                  <th className="px-4 py-3 font-semibold">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {analysis.findings.map((f) => {
                  const s = severityStyles[f.severity];
                  return (
                    <tr
                      key={f.ruleId}
                      className={`border-b border-white/5 ${s.bg}`}
                    >
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase ${s.badge}`}
                        >
                          {severityLabel(f.severity)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <p className={`font-mono text-xs font-bold ${s.text}`}>
                          {f.ruleId}
                        </p>
                        <p className="mt-0.5 text-xs text-silver-400">{f.category}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-silver-200">
                        {f.message}
                      </td>
                      <td className="px-4 py-3 align-top text-silver-400">
                        {f.recommendation || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {analysis.recommendations.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">
            Prioritized DBA Actions (Pre-AI)
          </h3>
          <ul className="space-y-2 text-sm text-silver-300">
            {analysis.recommendations.map((rec, i) => (
              <li
                key={`${i}-${rec.slice(0, 40)}`}
                className="rounded-lg border border-white/10 bg-navy-900/50 px-4 py-2.5"
              >
                <span className="font-semibold text-accent">{i + 1}.</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
