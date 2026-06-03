/**
 * Oracle Rule Engine for AI DBA Assistant (TypeScript).
 * Mirrors pdf-generator modular rules — runs BEFORE AI analysis.
 */

import { evaluateCpu, CPU_RULES_COUNT } from "./cpu-rules";
import { evaluateIo, IO_RULES_COUNT } from "./io-rules";
import { evaluateMemory, MEMORY_RULES_COUNT } from "./memory-rules";
import { evaluateSql, SQL_RULES_COUNT } from "./sql-rules";
import { calculateHealthScore } from "./health-score-engine";
import { classifyBottleneck } from "./bottleneck-engine";
import { generateExecutiveSummary } from "./executive-summary-generator";
import {
  aggregateRecommendations,
  buildKpiCards,
  resultToFinding,
} from "./scoring";
import type { AwrAnalysisResult, AwrMetrics, RuleResult } from "./types";
import { evaluateWaits, WAITS_RULES_COUNT } from "./waits-rules";

export * from "./types";
export { severityStyles } from "./types";
export {
  calculateHealthScore,
  type HealthScoreResult,
  type DimensionScore,
} from "./health-score-engine";
export {
  classifyBottleneck,
  BOTTLENECK_TYPES,
  type BottleneckClassificationResult,
} from "./bottleneck-engine";
export {
  generateExecutiveSummary,
  type ExecutiveSummaryResult,
} from "./executive-summary-generator";

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
  const bottleneckResult = classifyBottleneck(metrics);
  const bottleneck = bottleneckResult.classification;
  const healthResult = calculateHealthScore(metrics);
  const healthScore = healthResult.healthScore;
  const riskLevel = healthResult.riskLevel;
  const kpiCards = buildKpiCards(metrics, healthScore, riskLevel, bottleneck);
  const findings = ruleResults.map(resultToFinding);
  const recommendations = aggregateRecommendations(ruleResults);
  const summaryDoc = generateExecutiveSummary(
    metrics,
    healthResult,
    bottleneckResult,
    ruleResults,
    findings,
  );

  return {
    healthScore,
    riskLevel,
    bottleneckClassification: bottleneck,
    kpiCards,
    findings,
    ruleResults,
    executiveSummary: summaryDoc.businessSummary,
    executiveSummaryMarkdown: summaryDoc.markdown,
    businessSummary: summaryDoc.businessSummary,
    technicalSummary: summaryDoc.technicalSummary,
    topActions: summaryDoc.topActions,
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
