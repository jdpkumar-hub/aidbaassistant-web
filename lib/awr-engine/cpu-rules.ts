import type { AwrMetrics, RuleResult } from "./types";

const CPU_AMBER = 70;
const CPU_RED = 85;
const DB_TIME_AAS_AMBER = 8;
const DB_TIME_AAS_RED = 16;

export const CPU_RULES_COUNT = 4;

export function evaluateCpu(metrics: AwrMetrics): RuleResult[] {
  const results: RuleResult[] = [];
  const cpu = metrics.cpuUsagePct;
  const aas = metrics.dbTimeAas;

  if (cpu >= CPU_RED) {
    results.push({
      ruleId: "CPU-001",
      category: "CPU",
      severity: "red",
      finding: `CPU utilization critical at ${cpu.toFixed(1)}% (threshold ${CPU_RED}%).`,
      recommendation:
        "Profile top CPU sessions and SQL; reduce parse/execute overhead and review runaway queries.",
    });
  } else if (cpu >= CPU_AMBER) {
    results.push({
      ruleId: "CPU-002",
      category: "CPU",
      severity: "amber",
      finding: `CPU utilization elevated at ${cpu.toFixed(1)}% (threshold ${CPU_AMBER}%).`,
      recommendation:
        "Monitor CPU trend across snapshots; validate top SQL and connection pool sizing.",
    });
  }

  if (aas >= DB_TIME_AAS_RED) {
    results.push({
      ruleId: "CPU-003",
      category: "Load",
      severity: "red",
      finding: `Average Active Sessions ${aas.toFixed(1)} exceeds critical threshold (${DB_TIME_AAS_RED}).`,
      recommendation:
        "Review connection storms, job scheduling, and consider resource manager limits.",
    });
  } else if (aas >= DB_TIME_AAS_AMBER) {
    results.push({
      ruleId: "CPU-004",
      category: "Load",
      severity: "amber",
      finding: `Average Active Sessions ${aas.toFixed(1)} above warning threshold (${DB_TIME_AAS_AMBER}).`,
      recommendation:
        "Validate application concurrency and queue depth during peak windows.",
    });
  }

  return results;
}
