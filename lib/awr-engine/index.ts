/**
 * Oracle Rule Engine for AI DBA Assistant (TypeScript).
 * Mirrors pdf-generator modular rules — runs BEFORE AI analysis.
 */

import { evaluateCpu, CPU_RULES_COUNT } from "./cpu-rules";
import { evaluateIo, IO_RULES_COUNT } from "./io-rules";
import { evaluateMemory, MEMORY_RULES_COUNT } from "./memory-rules";
import { evaluateSql, SQL_RULES_COUNT } from "./sql-rules";
import {
  aggregateRecommendations,
  buildKpiCards,
  classifyBottleneck,
  computeHealthScore,
  resultToFinding,
  riskFromHealth,
} from "./scoring";
import type { AwrAnalysisResult, AwrMetrics, RuleResult } from "./types";
import { evaluateWaits, WAITS_RULES_COUNT } from "./waits-rules";

export * from "./types";
export { severityStyles } from "./types";

const RULES_EVALUATED =
  CPU_RULES_COUNT +
  IO_RULES_COUNT +
  WAITS_RULES_COUNT +
  MEMORY_RULES_COUNT +
  SQL_RULES_COUNT;

function runAllRules(metrics: AwrMetrics): RuleResult[] {
  return [
    ...evaluateCpu(metrics),
    ...evaluateIo(metrics),
    ...evaluateWaits(metrics),
    ...evaluateMemory(metrics),
    ...evaluateSql(metrics),
  ];
}

export function runAwrRules(metrics: AwrMetrics): AwrAnalysisResult {
  const ruleResults = runAllRules(metrics);
  const bottleneck = classifyBottleneck(metrics, ruleResults);
  const healthScore = computeHealthScore(metrics, ruleResults);
  const riskLevel = riskFromHealth(healthScore, ruleResults);
  const kpiCards = buildKpiCards(metrics, healthScore, riskLevel, bottleneck);
  const findings = ruleResults.map(resultToFinding);
  const recommendations = aggregateRecommendations(ruleResults);
  const redCount = ruleResults.filter((r) => r.severity === "red").length;

  const executiveSummary =
    `${metrics.databaseName} (${metrics.instanceName}) — health score ${healthScore}/100, ` +
    `${riskLevel} risk, workload ${bottleneck}. ` +
    `Top wait: ${metrics.topWaitEvent} (${metrics.topWaitEventPct.toFixed(1)}% DB time). ` +
    `Top SQL: ${metrics.topSqlId} (${metrics.topSqlDbTimePct.toFixed(1)}% DB time). ` +
    `Rule engine: ${ruleResults.length} findings (${redCount} critical) across ` +
    `CPU, I/O, waits, memory, and SQL modules. AI analysis follows DBA triage.`;

  return {
    healthScore,
    riskLevel,
    bottleneckClassification: bottleneck,
    kpiCards,
    findings,
    ruleResults,
    executiveSummary,
    recommendations,
    rulesEvaluated: RULES_EVALUATED,
    rulesTriggered: ruleResults.length,
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
    physicalReadsPerSec: 12500,
    logFileSyncPct: 12.4,
    bufferCacheHitRatioPct: 86.4,
    pgaAllocatedMb: 3072,
    pgaTargetMb: 4096,
    sharedPoolFreePct: 12,
  };
}
