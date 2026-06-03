/**
 * Oracle DBA rule-based AWR findings engine (TypeScript).
 * Mirrors pdf-generator/awr_rules.py — runs BEFORE AI analysis in the UI.
 */

export type Severity = "green" | "amber" | "red";
export type RiskLevel = "Low" | "Medium" | "High";
export type BottleneckClass =
  | "CPU Bound"
  | "I/O Bound"
  | "Lock / Contention"
  | "SQL Workload"
  | "Memory Pressure"
  | "Balanced";

export type AwrMetrics = {
  databaseName: string;
  instanceName: string;
  cpuUsagePct: number;
  dbTimeAas: number;
  dbTimeMinutes: number;
  topWaitEvent: string;
  topWaitEventPct: number;
  topSqlId: string;
  topSqlDbTimePct: number;
  bufferBusyWaitsPct: number;
  activeSessionsAvg: number;
};

export type KpiCard = {
  label: string;
  value: string;
  severity: Severity;
  detail: string;
};

export type RuleFinding = {
  ruleId: string;
  category: string;
  message: string;
  severity: Severity;
};

export type AwrAnalysisResult = {
  healthScore: number;
  riskLevel: RiskLevel;
  bottleneckClassification: BottleneckClass;
  kpiCards: KpiCard[];
  findings: RuleFinding[];
  executiveSummary: string;
  recommendations: string[];
  rulesEvaluated: number;
  rulesTriggered: number;
};

const CPU_AMBER = 70;
const CPU_RED = 85;
const DB_TIME_AAS_AMBER = 8;
const DB_TIME_AAS_RED = 16;
const WAIT_AMBER = 25;
const WAIT_RED = 40;
const SQL_AMBER = 15;
const SQL_RED = 25;
const BUFFER_BUSY_AMBER = 8;
const BUFFER_BUSY_RED = 15;
const HEALTH_GREEN = 80;
const HEALTH_AMBER = 60;

function severityCpu(pct: number): Severity {
  if (pct >= CPU_RED) return "red";
  if (pct >= CPU_AMBER) return "amber";
  return "green";
}

function severityWaitPct(pct: number): Severity {
  if (pct >= WAIT_RED) return "red";
  if (pct >= WAIT_AMBER) return "amber";
  return "green";
}

function severitySqlPct(pct: number): Severity {
  if (pct >= SQL_RED) return "red";
  if (pct >= SQL_AMBER) return "amber";
  return "green";
}

function severityDbTimeAas(aas: number): Severity {
  if (aas >= DB_TIME_AAS_RED) return "red";
  if (aas >= DB_TIME_AAS_AMBER) return "amber";
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

function classifyBottleneck(m: AwrMetrics): BottleneckClass {
  const wait = m.topWaitEvent.toLowerCase();
  if (m.cpuUsagePct >= CPU_AMBER && wait.includes("cpu")) return "CPU Bound";
  if (m.topSqlDbTimePct >= SQL_AMBER) return "SQL Workload";
  if (m.bufferBusyWaitsPct >= BUFFER_BUSY_AMBER || wait.includes("buffer busy"))
    return "Lock / Contention";
  if (
    ["db file sequential", "db file scattered", "direct path read"].some((k) =>
      wait.includes(k),
    )
  )
    return "I/O Bound";
  if (wait.includes("pga") || wait.includes("memory")) return "Memory Pressure";
  return "Balanced";
}

function evaluateRules(m: AwrMetrics): { findings: RuleFinding[]; rulesChecked: number } {
  const findings: RuleFinding[] = [];
  let rulesChecked = 0;

  const add = (ruleId: string, category: string, message: string, severity: Severity) => {
    findings.push({ ruleId, category, message, severity });
  };

  rulesChecked++;
  if (m.cpuUsagePct >= CPU_RED)
    add("CPU-001", "CPU", `CPU usage critical at ${m.cpuUsagePct.toFixed(1)}%`, "red");
  else if (m.cpuUsagePct >= CPU_AMBER)
    add("CPU-002", "CPU", `CPU usage elevated at ${m.cpuUsagePct.toFixed(1)}%`, "amber");

  rulesChecked++;
  if (m.topWaitEventPct >= WAIT_RED)
    add(
      "WAIT-001",
      "Wait Events",
      `Top wait '${m.topWaitEvent}' at ${m.topWaitEventPct.toFixed(1)}% of DB time`,
      "red",
    );
  else if (m.topWaitEventPct >= WAIT_AMBER)
    add(
      "WAIT-002",
      "Wait Events",
      `Top wait '${m.topWaitEvent}' significant at ${m.topWaitEventPct.toFixed(1)}%`,
      "amber",
    );

  rulesChecked++;
  if (m.topSqlDbTimePct >= SQL_RED)
    add(
      "SQL-001",
      "Top SQL",
      `SQL_ID ${m.topSqlId} consumes ${m.topSqlDbTimePct.toFixed(1)}% of DB time`,
      "red",
    );
  else if (m.topSqlDbTimePct >= SQL_AMBER)
    add(
      "SQL-002",
      "Top SQL",
      `SQL_ID ${m.topSqlId} elevated at ${m.topSqlDbTimePct.toFixed(1)}%`,
      "amber",
    );

  rulesChecked++;
  if (m.bufferBusyWaitsPct >= BUFFER_BUSY_RED)
    add(
      "LOCK-001",
      "Contention",
      `Buffer busy waits at ${m.bufferBusyWaitsPct.toFixed(1)}%`,
      "red",
    );
  else if (m.bufferBusyWaitsPct >= BUFFER_BUSY_AMBER)
    add(
      "LOCK-002",
      "Contention",
      `Buffer busy waits at ${m.bufferBusyWaitsPct.toFixed(1)}%`,
      "amber",
    );

  rulesChecked++;
  if (m.dbTimeAas >= DB_TIME_AAS_RED)
    add("LOAD-001", "Load", `AAS ${m.dbTimeAas.toFixed(1)} exceeds critical threshold`, "red");
  else if (m.dbTimeAas >= DB_TIME_AAS_AMBER)
    add("LOAD-002", "Load", `AAS ${m.dbTimeAas.toFixed(1)} above warning threshold`, "amber");

  return { findings, rulesChecked };
}

function computeHealthScore(m: AwrMetrics, findings: RuleFinding[]): number {
  let penalty = 0;
  penalty += Math.max(0, (m.cpuUsagePct - 60) * 0.4);
  penalty += Math.max(0, (m.topWaitEventPct - 30) * 0.35);
  penalty += Math.max(0, (m.topSqlDbTimePct - 20) * 0.4);
  penalty += Math.max(0, (m.bufferBusyWaitsPct - 10) * 0.3);
  for (const f of findings) {
    if (f.severity === "red") penalty += 3;
    else if (f.severity === "amber") penalty += 1;
  }
  return Math.max(0, Math.min(100, Math.floor(100 - penalty)));
}

function riskFromHealth(score: number, redCount: number): RiskLevel {
  if (score < HEALTH_AMBER || redCount >= 3) return "High";
  if (score < HEALTH_GREEN || redCount >= 1) return "Medium";
  return "Low";
}

function buildKpiCards(
  m: AwrMetrics,
  health: number,
  risk: RiskLevel,
  bottleneck: BottleneckClass,
): KpiCard[] {
  return [
    {
      label: "Database Health Score",
      value: `${health} / 100`,
      severity: severityHealth(health),
      detail: "Composite score from DBA rules",
    },
    {
      label: "Risk Level",
      value: risk,
      severity: severityRisk(risk),
      detail: "From health score and critical findings",
    },
    {
      label: "Top Wait Event",
      value: m.topWaitEvent,
      severity: severityWaitPct(m.topWaitEventPct),
      detail: `${m.topWaitEventPct.toFixed(1)}% of DB time`,
    },
    {
      label: "CPU Usage",
      value: `${m.cpuUsagePct.toFixed(1)}%`,
      severity: severityCpu(m.cpuUsagePct),
      detail: "Peak CPU utilization",
    },
    {
      label: "DB Time",
      value: `${m.dbTimeAas.toFixed(1)} AAS`,
      severity: severityDbTimeAas(m.dbTimeAas),
      detail: `${m.dbTimeMinutes.toFixed(0)} min window`,
    },
    {
      label: "Top SQL",
      value: m.topSqlId,
      severity: severitySqlPct(m.topSqlDbTimePct),
      detail: `${m.topSqlDbTimePct.toFixed(1)}% of DB time`,
    },
    {
      label: "Bottleneck Classification",
      value: bottleneck,
      severity: bottleneck === "Balanced" ? "green" : "amber",
      detail: "Rule-based workload class",
    },
  ];
}

function buildRecommendations(
  m: AwrMetrics,
  findings: RuleFinding[],
  bottleneck: BottleneckClass,
): string[] {
  const recs: string[] = [];
  for (const f of findings) {
    if (f.ruleId.startsWith("SQL"))
      recs.push(`Tune SQL_ID ${m.topSqlId} — review plan and indexing.`);
    if (f.ruleId.startsWith("LOCK"))
      recs.push("Investigate buffer busy waits and hot block contention.");
    if (f.ruleId.startsWith("CPU"))
      recs.push("Profile top CPU consumers and SQL efficiency.");
  }
  if (bottleneck === "SQL Workload")
    recs.push("Prioritize SQL tuning before scaling infrastructure.");
  if (recs.length === 0)
    recs.push("Continue monitoring — no critical DBA rule violations.");
  return [...new Set(recs)].slice(0, 8);
}

export function runAwrRules(metrics: AwrMetrics): AwrAnalysisResult {
  const { findings, rulesChecked } = evaluateRules(metrics);
  const bottleneck = classifyBottleneck(metrics);
  const healthScore = computeHealthScore(metrics, findings);
  const redCount = findings.filter((f) => f.severity === "red").length;
  const riskLevel = riskFromHealth(healthScore, redCount);
  const kpiCards = buildKpiCards(metrics, healthScore, riskLevel, bottleneck);
  const recommendations = buildRecommendations(metrics, findings, bottleneck);
  const executiveSummary =
    `${metrics.databaseName} (${metrics.instanceName}) — health ${healthScore}/100, ` +
    `${riskLevel} risk, ${bottleneck}. Top wait: ${metrics.topWaitEvent} ` +
    `(${metrics.topWaitEventPct.toFixed(1)}%). SQL_ID ${metrics.topSqlId} ` +
    `(${metrics.topSqlDbTimePct.toFixed(1)}% DB time). ` +
    `${findings.length} DBA rule findings (${redCount} critical). ` +
    `AI analysis follows rule-based triage.`;

  return {
    healthScore,
    riskLevel,
    bottleneckClassification: bottleneck,
    kpiCards,
    findings,
    executiveSummary,
    recommendations,
    rulesEvaluated: rulesChecked,
    rulesTriggered: findings.length,
  };
}

export function demoAwrMetrics(): AwrMetrics {
  return {
    databaseName: "Production Oracle 19c",
    instanceName: "PROD_ORCL",
    cpuUsagePct: 78,
    dbTimeAas: 12.4,
    dbTimeMinutes: 60,
    topWaitEvent: "db file sequential read",
    topWaitEventPct: 42.3,
    topSqlId: "abc123",
    topSqlDbTimePct: 31.2,
    bufferBusyWaitsPct: 18.1,
    activeSessionsAvg: 142,
  };
}

export const severityStyles: Record<
  Severity,
  { border: string; bg: string; text: string; badge: string }
> = {
  green: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
  },
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
};
