import type { AwrMetrics, RuleResult } from "./types";

const TOP_SQL_AMBER = 15;
const TOP_SQL_RED = 25;

export const SQL_RULES_COUNT = 3;

export function evaluateSql(metrics: AwrMetrics): RuleResult[] {
  const results: RuleResult[] = [];
  const sqlId = metrics.topSqlId;
  const pct = metrics.topSqlDbTimePct;

  if (pct >= TOP_SQL_RED) {
    results.push({
      ruleId: "SQL-001",
      category: "Top SQL",
      severity: "red",
      finding: `SQL_ID ${sqlId} consumes ${pct.toFixed(1)}% of database time — primary workload bottleneck.`,
      recommendation: `Tune SQL_ID ${sqlId}: review execution plan, indexes, and bind variable usage.`,
    });
  } else if (pct >= TOP_SQL_AMBER) {
    results.push({
      ruleId: "SQL-002",
      category: "Top SQL",
      severity: "amber",
      finding: `SQL_ID ${sqlId} elevated at ${pct.toFixed(1)}% of database time.`,
      recommendation: `Profile SQL_ID ${sqlId} with SQL Tuning Advisor and plan stability checks.`,
    });
  }

  if (pct >= TOP_SQL_AMBER && metrics.cpuUsagePct >= 70) {
    results.push({
      ruleId: "SQL-003",
      category: "Top SQL",
      severity: "amber",
      finding: `SQL_ID ${sqlId} correlates with high CPU (${metrics.cpuUsagePct.toFixed(1)}%) and DB time share.`,
      recommendation:
        "Consider SQL rewrite, batching, or caching for repeated high-cost executions.",
    });
  }

  return results;
}
