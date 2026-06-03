/**
 * Oracle DBA rule-based AWR findings engine.
 * Re-exports modular awr-engine (CPU, I/O, waits, memory, SQL, scoring).
 */
export {
  runAwrRules,
  demoAwrMetrics,
  calculateHealthScore,
  classifyBottleneck,
  BOTTLENECK_TYPES,
  severityStyles,
  type AwrMetrics,
  type AwrAnalysisResult,
  type RuleFinding,
  type RuleResult,
  type KpiCard,
  type Severity,
  type RiskLevel,
  type BottleneckClass,
  type HealthScoreResult,
  type DimensionScore,
  type BottleneckClassificationResult,
} from "./awr-engine";
