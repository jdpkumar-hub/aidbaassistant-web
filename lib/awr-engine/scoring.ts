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
const CPU_AMBER = 70;
const TOP_SQL_AMBER = 15;
const BUFFER_BUSY_AMBER = 8;

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

export function classifyBottleneck(
  metrics: AwrMetrics,
  results: RuleResult[],
): BottleneckClass {
  const categories = new Set(
    results.filter((r) => r.severity !== "green").map((r) => r.category),
  );
  const wait = metrics.topWaitEvent.toLowerCase();

  if (categories.has("Top SQL") || metrics.topSqlDbTimePct >= TOP_SQL_AMBER) {
    return "SQL Workload";
  }
  if (
    metrics.cpuUsagePct >= CPU_AMBER &&
    (categories.has("CPU") || wait.includes("cpu"))
  ) {
    return "CPU Bound";
  }
  if (categories.has("Contention") || metrics.bufferBusyWaitsPct >= BUFFER_BUSY_AMBER) {
    return "Lock / Contention";
  }
  if (
    categories.has("I/O") ||
    ["db file sequential", "db file scattered", "direct path", "log file"].some(
      (k) => wait.includes(k),
    )
  ) {
    return "I/O Bound";
  }
  if (categories.has("Memory")) return "Memory Pressure";
  return "Balanced";
}

export function computeHealthScore(
  metrics: AwrMetrics,
  results: RuleResult[],
): number {
  let penalty = 0;
  penalty += Math.max(0, (metrics.cpuUsagePct - 60) * 0.4);
  penalty += Math.max(0, (metrics.topWaitEventPct - 30) * 0.35);
  penalty += Math.max(0, (metrics.topSqlDbTimePct - 20) * 0.4);
  penalty += Math.max(0, (metrics.bufferBusyWaitsPct - 10) * 0.3);
  penalty += Math.max(0, (90 - metrics.bufferCacheHitRatioPct) * 0.5);

  for (const r of results) {
    if (r.severity === "red") penalty += 3;
    else if (r.severity === "amber") penalty += 1;
  }

  return Math.max(0, Math.min(100, Math.floor(100 - penalty)));
}

export function riskFromHealth(score: number, results: RuleResult[]): RiskLevel {
  const redCount = results.filter((r) => r.severity === "red").length;
  if (score < HEALTH_AMBER || redCount >= 3) return "High";
  if (score < HEALTH_GREEN || redCount >= 1) return "Medium";
  return "Low";
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
      detail: "Composite score from Oracle rule engine",
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
      severity: bottleneck === "Balanced" ? "green" : "amber",
      detail: "Rule-based workload classification",
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
