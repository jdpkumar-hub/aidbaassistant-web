import type { AwrMetrics, RuleResult } from "./types";

const BUFFER_HIT_AMBER = 90;
const BUFFER_HIT_RED = 85;
const PGA_UTIL_AMBER = 75;
const PGA_UTIL_RED = 90;
const SHARED_POOL_FREE_AMBER = 10;

export const MEMORY_RULES_COUNT = 6;

export function evaluateMemory(metrics: AwrMetrics): RuleResult[] {
  const results: RuleResult[] = [];
  const hit = metrics.bufferCacheHitRatioPct;
  const pgaUtil =
    metrics.pgaTargetMb > 0
      ? (metrics.pgaAllocatedMb / metrics.pgaTargetMb) * 100
      : 0;

  if (hit < BUFFER_HIT_RED) {
    results.push({
      ruleId: "MEM-001",
      category: "Memory",
      severity: "red",
      finding: `Buffer cache hit ratio ${hit.toFixed(1)}% below critical threshold (${BUFFER_HIT_RED}%).`,
      recommendation:
        "Increase buffer cache if justified; reduce physical I/O via SQL tuning and indexing.",
    });
  } else if (hit < BUFFER_HIT_AMBER) {
    results.push({
      ruleId: "MEM-002",
      category: "Memory",
      severity: "amber",
      finding: `Buffer cache hit ratio ${hit.toFixed(1)}% below target (${BUFFER_HIT_AMBER}%).`,
      recommendation:
        "Review top segments driving physical reads; validate buffer pool sizing.",
    });
  }

  if (pgaUtil >= PGA_UTIL_RED) {
    results.push({
      ruleId: "MEM-003",
      category: "Memory",
      severity: "red",
      finding: `PGA allocation ${pgaUtil.toFixed(0)}% of PGA_AGGREGATE_TARGET — risk of spills to temp.`,
      recommendation:
        "Increase PGA_AGGREGATE_TARGET; tune hash/sort operations in top SQL.",
    });
  } else if (pgaUtil >= PGA_UTIL_AMBER) {
    results.push({
      ruleId: "MEM-004",
      category: "Memory",
      severity: "amber",
      finding: `PGA allocation ${pgaUtil.toFixed(0)}% of target — elevated memory pressure.`,
      recommendation:
        "Review PGA advisory and workarea statistics for large sorts/hash joins.",
    });
  }

  if (metrics.sharedPoolFreePct < SHARED_POOL_FREE_AMBER) {
    results.push({
      ruleId: "MEM-005",
      category: "Memory",
      severity: "amber",
      finding: `Shared pool free memory low (${metrics.sharedPoolFreePct.toFixed(1)}% free).`,
      recommendation:
        "Check for shared pool fragmentation; review cursor sharing and literal SQL usage.",
    });
  }

  const wait = metrics.topWaitEvent.toLowerCase();
  if (wait.includes("pga") || wait.includes("memory") || wait.includes("direct path temp")) {
    results.push({
      ruleId: "MEM-006",
      category: "Memory",
      severity: "amber",
      finding: `Memory-related wait in top events: '${metrics.topWaitEvent}'.`,
      recommendation:
        "Review temp tablespace usage and PGA/UGA allocation for top sessions.",
    });
  }

  return results;
}
