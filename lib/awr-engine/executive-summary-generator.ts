/**
 * Executive Summary Generator — business + technical narrative and top actions (Markdown).
 */

import type { BottleneckClassificationResult } from "./bottleneck-engine";
import type { HealthScoreResult } from "./health-score-engine";
import type { AwrMetrics, RuleFinding, RuleResult, Severity } from "./types";
import { resultToFinding } from "./scoring";

export type ExecutiveSummaryResult = {
  businessSummary: string;
  technicalSummary: string;
  topActions: string[];
  markdown: string;
};

const BOTTLENECK_ACTIONS: Record<string, string> = {
  "CPU Bottleneck":
    "Profile top CPU-consuming SQL and sessions; validate connection pool and batch job scheduling.",
  "Random IO Bottleneck":
    "Tune top SQL for index-friendly access; review execution plans and missing indexes on hot objects.",
  "Sequential Scan Bottleneck":
    "Eliminate full-table scans on large segments; add selective indexes or partition pruning.",
  "Commit Bottleneck":
    "Reduce commit frequency where safe; review redo log sizing and storage write latency.",
  "Concurrency Bottleneck":
    "Remediate hot blocks (ASSM, partitioning, reverse-key indexes); review locking on contended tables.",
  "Memory Bottleneck":
    "Right-size buffer cache and PGA; address SQL driving spills and physical I/O from memory pressure.",
};

function riskPhrase(risk: string): string {
  const map: Record<string, string> = {
    High: "requires immediate leadership attention and a focused remediation plan",
    Medium: "should be addressed before the next peak business window",
    Low: "is within acceptable bounds with continued monitoring recommended",
  };
  return map[risk] ?? "requires review";
}

function businessImpact(bottleneck: string, risk: string): string {
  const impacts: Record<string, string> = {
    "CPU Bottleneck":
      "Application response times and batch throughput may degrade under sustained CPU pressure.",
    "Random IO Bottleneck":
      "User-facing queries and OLTP workflows may experience latency from storage read latency.",
    "Sequential Scan Bottleneck":
      "Reporting and scan-heavy workloads may compete with OLTP and inflate I/O wait.",
    "Commit Bottleneck":
      "Commit-heavy applications may see end-user latency tied to redo write performance.",
    "Concurrency Bottleneck":
      "Transactional hot spots can cause queueing, retries, and uneven session wait times.",
    "Memory Bottleneck":
      "Memory pressure increases physical I/O and temp usage, amplifying cost and tail latency.",
  };
  const base =
    impacts[bottleneck] ??
    "Workload efficiency may be below target for service-level expectations.";
  if (risk === "High") {
    return `${base} Elevated risk suggests potential SLA exposure if left unaddressed.`;
  }
  if (risk === "Medium") {
    return `${base} Moderate risk warrants proactive tuning to avoid escalation.`;
  }
  return `${base} Current risk profile supports stable operations with planned optimization.`;
}

function severityRank(s: Severity): number {
  if (s === "red") return 0;
  if (s === "amber") return 1;
  return 2;
}

function buildTopActions(
  ruleResults: RuleResult[],
  bottleneck: string,
  metrics: AwrMetrics,
): string[] {
  const sorted = [...ruleResults].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity) || a.ruleId.localeCompare(b.ruleId),
  );

  const actions: string[] = [];
  const seen = new Set<string>();

  for (const rule of sorted) {
    if (rule.recommendation && !seen.has(rule.recommendation)) {
      seen.add(rule.recommendation);
      actions.push(rule.recommendation);
    }
    if (actions.length >= 5) return actions.slice(0, 5);
  }

  const fallback = BOTTLENECK_ACTIONS[bottleneck];
  if (fallback && !seen.has(fallback)) {
    actions.push(fallback);
    seen.add(fallback);
  }

  const extras = [
    `Prioritize deep dive on SQL_ID ${metrics.topSqlId} (${metrics.topSqlDbTimePct.toFixed(1)}% of database time).`,
    `Correlate top wait '${metrics.topWaitEvent}' with ASH/AWR segment and SQL statistics for root-cause validation.`,
    "Schedule follow-up AWR comparison after changes to confirm health score improvement.",
    "Engage application owners for change windows aligned to bottleneck remediation.",
  ];

  for (const line of extras) {
    if (actions.length >= 5) break;
    if (!seen.has(line)) {
      actions.push(line);
      seen.add(line);
    }
  }

  return actions.slice(0, 5);
}

function buildBusinessSummary(
  metrics: AwrMetrics,
  health: HealthScoreResult,
  bottleneck: BottleneckClassificationResult,
  criticalCount: number,
): string {
  const window = `${metrics.dbTimeMinutes.toFixed(0)}-minute`;
  return (
    `During the ${window} AWR window, **${metrics.databaseName}** ` +
    `(${metrics.instanceName}) recorded a database health score of ` +
    `**${health.healthScore}/100**, classified as **${health.riskLevel} risk**. ` +
    `The primary workload constraint is a **${bottleneck.classification}**, ` +
    `which ${riskPhrase(health.riskLevel)}. ` +
    `${businessImpact(bottleneck.classification, health.riskLevel)} ` +
    `The assessment identified **${criticalCount} critical** rule-based finding(s) ` +
    `requiring DBA and application coordination.`
  );
}

function buildTechnicalSummary(
  metrics: AwrMetrics,
  health: HealthScoreResult,
  bottleneck: BottleneckClassificationResult,
  ruleResults: RuleResult[],
  findings: RuleFinding[],
): string {
  const red = findings.filter((f) => f.severity === "red");
  const amber = findings.filter((f) => f.severity === "amber");

  const dimLines = health.dimensions
    .map((d) => `- **${d.name}:** ${d.detail} (dimension score ${d.score.toFixed(0)}/100)`)
    .join("\n");

  const findingLines: string[] = [];
  for (const f of red.slice(0, 3)) {
    findingLines.push(`- **[${f.ruleId}]** ${f.message}`);
  }
  for (const f of amber.slice(0, 2)) {
    if (findingLines.length < 5) {
      findingLines.push(`- **[${f.ruleId}]** ${f.message}`);
    }
  }

  return (
    `**Snapshot:** ${metrics.dbTimeMinutes.toFixed(0)} min · ` +
    `**AAS:** ${metrics.dbTimeAas.toFixed(1)} · ` +
    `**Active sessions (avg):** ${metrics.activeSessionsAvg.toFixed(0)}\n\n` +
    `**Bottleneck:** ${bottleneck.classification} ` +
    `(confidence ${bottleneck.confidence.toFixed(0)}%) — ${bottleneck.rationale}\n\n` +
    `**Core metrics:** CPU ${metrics.cpuUsagePct.toFixed(1)}% · ` +
    `Top wait *${metrics.topWaitEvent}* (${metrics.topWaitEventPct.toFixed(1)}% DB time) · ` +
    `Buffer busy ${metrics.bufferBusyWaitsPct.toFixed(1)}% · ` +
    `Log file sync ${metrics.logFileSyncPct.toFixed(1)}% · ` +
    `Top SQL **${metrics.topSqlId}** (${metrics.topSqlDbTimePct.toFixed(1)}% DB time) · ` +
    `Physical reads ${metrics.physicalReadsPerSec.toLocaleString()}/sec · ` +
    `Buffer cache hit ${metrics.bufferCacheHitRatioPct.toFixed(1)}%\n\n` +
    `**Health score dimensions:**\n${dimLines}\n\n` +
    `**Rule engine:** ${ruleResults.length} findings ` +
    `(${red.length} critical, ${amber.length} warning). Key signals:\n` +
    (findingLines.length > 0
      ? findingLines.join("\n")
      : "- No critical findings triggered.")
  );
}

function toMarkdown(
  metrics: AwrMetrics,
  health: HealthScoreResult,
  business: string,
  technical: string,
  actions: string[],
): string {
  const actionBlock = actions.map((action, i) => `${i + 1}. ${action}`).join("\n");
  return (
    `# Executive Summary — ${metrics.databaseName}\n\n` +
    `**Instance:** ${metrics.instanceName} · ` +
    `**Health Score:** ${health.healthScore}/100 · ` +
    `**Risk Level:** ${health.riskLevel}\n\n` +
    `## Business Summary\n\n${business}\n\n` +
    `## Technical Summary\n\n${technical}\n\n` +
    `## Top 5 Actions\n\n${actionBlock}\n`
  );
}

export function generateExecutiveSummary(
  metrics: AwrMetrics,
  health: HealthScoreResult,
  bottleneck: BottleneckClassificationResult,
  ruleResults: RuleResult[],
  findings?: RuleFinding[],
): ExecutiveSummaryResult {
  const findingList = findings ?? ruleResults.map(resultToFinding);
  const criticalCount = findingList.filter((f) => f.severity === "red").length;

  const businessSummary = buildBusinessSummary(
    metrics,
    health,
    bottleneck,
    criticalCount,
  );
  const technicalSummary = buildTechnicalSummary(
    metrics,
    health,
    bottleneck,
    ruleResults,
    findingList,
  );
  const topActions = buildTopActions(
    ruleResults,
    bottleneck.classification,
    metrics,
  );
  const markdown = toMarkdown(
    metrics,
    health,
    businessSummary,
    technicalSummary,
    topActions,
  );

  return {
    businessSummary,
    technicalSummary,
    topActions,
    markdown,
  };
}
