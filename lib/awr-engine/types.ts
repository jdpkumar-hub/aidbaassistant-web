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
  physicalReadsPerSec: number;
  logFileSyncPct: number;
  bufferCacheHitRatioPct: number;
  pgaAllocatedMb: number;
  pgaTargetMb: number;
  sharedPoolFreePct: number;
};

export type RuleResult = {
  ruleId: string;
  category: string;
  severity: Severity;
  finding: string;
  recommendation: string;
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
  recommendation: string;
};

export type AwrAnalysisResult = {
  healthScore: number;
  riskLevel: RiskLevel;
  bottleneckClassification: BottleneckClass;
  kpiCards: KpiCard[];
  findings: RuleFinding[];
  ruleResults: RuleResult[];
  executiveSummary: string;
  recommendations: string[];
  rulesEvaluated: number;
  rulesTriggered: number;
};

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
