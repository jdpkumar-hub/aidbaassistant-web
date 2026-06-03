import { calculateHealthScore } from "./health-score-engine";
import type {
  AwrMetrics,
  BottleneckClass,
  KpiCard,
  RiskLevel,
  RuleFinding,
  RuleResult,
  Severity,
} from "./types";

const HEALTH_GREEN = 80;
const HEALTH_AMBER = 60;

export function severityCpu(pct: number): Severity {
  if (pct >= 85) return "red";
  if (pct >= 70) return "amber";
  return "green";
}

export function severityWaitPct(pct: number): Severity {
  if (pct >= 40) return "red";
  if (pct >= 25) return "amber";
  return "green";
}

export function severitySqlPct(pct: number): Severity {
  if (pct >= 25) return "red";
  if (pct >= 15) return "amber";
  return "green";
}

export function severityDbTimeAas(aas: number): Severity {
  if (aas >= 16) return "red";
  if (aas >= 8) return "amber";
  return "green";
}

function severityHealth(score: number): Severity {
  if (score >= HEALTH_GREEN) return "green";
  if (score >= HEALTH_AMBER) return "amber";
  return "red";
}

function severityRisk(risk: RiskLevel): Severity {
  if (risk === "Low") return "green";
  if (risk === "Medium") return "amber";
  return "red";
}

export function computeHealthScore(
  metrics: AwrMetrics,
  _results?: RuleResult[],
): number {
  return calculateHealthScore(metrics).healthScore;
}

export function riskFromHealth(
  _score: number,
  _results?: RuleResult[],
  metrics?: AwrMetrics,
): RiskLevel {
  if (metrics) return calculateHealthScore(metrics).riskLevel;
  return "Medium";
}

export function buildKpiCards(
  metrics: AwrMetrics,
  health: number,
  risk: RiskLevel,
  bottleneck: BottleneckClass,
): KpiCard[] {
  return [
    {
      label: "Database Health Score",
      value: `${health} / 100`,
      severity: severityHealth(health),
      detail: "AWR Health Score Engine (6 dimensions)",
    },
    {
      label: "Risk Level",
      value: risk,
      severity: severityRisk(risk),
      detail: "Derived from health score and rule severities",
    },
    {
      label: "Top Wait Event",
      value: metrics.topWaitEvent,
      severity: severityWaitPct(metrics.topWaitEventPct),
      detail: `${metrics.topWaitEventPct.toFixed(1)}% of DB time`,
    },
    {
      label: "CPU Usage",
      value: `${metrics.cpuUsagePct.toFixed(1)}%`,
      severity: severityCpu(metrics.cpuUsagePct),
      detail: "Peak host/DB CPU utilization",
    },
    {
      label: "DB Time",
      value: `${metrics.dbTimeAas.toFixed(1)} AAS`,
      severity: severityDbTimeAas(metrics.dbTimeAas),
      detail: `${metrics.dbTimeMinutes.toFixed(0)} min snapshot`,
    },
    {
      label: "Top SQL",
      value: metrics.topSqlId,
      severity: severitySqlPct(metrics.topSqlDbTimePct),
      detail: `${metrics.topSqlDbTimePct.toFixed(1)}% of DB time`,
    },
    {
      label: "Bottleneck Classification",
      value: bottleneck,
      severity: "amber",
      detail: "Bottleneck Classification Engine",
    },
  ];
}

export function aggregateRecommendations(results: RuleResult[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const r of results) {
    if (r.recommendation && !seen.has(r.recommendation)) {
      seen.add(r.recommendation);
      unique.push(r.recommendation);
    }
  }
  return unique.slice(0, 12);
}

export function resultToFinding(r: RuleResult): RuleFinding {
  return {
    ruleId: r.ruleId,
    category: r.category,
    message: r.finding,
    severity: r.severity,
    recommendation: r.recommendation,
  };
}
