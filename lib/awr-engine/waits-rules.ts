import type { AwrMetrics, RuleResult } from "./types";

const WAIT_AMBER = 25;
const WAIT_RED = 40;
const BUFFER_BUSY_AMBER = 8;
const BUFFER_BUSY_RED = 15;

export const WAITS_RULES_COUNT = 5;

export function evaluateWaits(metrics: AwrMetrics): RuleResult[] {
  const results: RuleResult[] = [];
  const wait = metrics.topWaitEvent;
  const waitPct = metrics.topWaitEventPct;
  const bbPct = metrics.bufferBusyWaitsPct;

  if (waitPct >= WAIT_RED) {
    results.push({
      ruleId: "WAIT-001",
      category: "Wait Events",
      severity: "red",
      finding: `Top wait '${wait}' dominates at ${waitPct.toFixed(1)}% of database time.`,
      recommendation:
        "Prioritize wait event analysis; correlate with top SQL and session blocking chains.",
    });
  } else if (waitPct >= WAIT_AMBER) {
    results.push({
      ruleId: "WAIT-002",
      category: "Wait Events",
      severity: "amber",
      finding: `Top wait '${wait}' significant at ${waitPct.toFixed(1)}% of database time.`,
      recommendation: "Review wait event trend and associated object-level statistics.",
    });
  }

  if (bbPct >= BUFFER_BUSY_RED) {
    results.push({
      ruleId: "WAIT-003",
      category: "Contention",
      severity: "red",
      finding: `Buffer busy waits at ${bbPct.toFixed(1)}% — hot block contention on data blocks.`,
      recommendation:
        "Investigate hot rows/index blocks; consider ASSM, reverse key indexes, or hash partitioning.",
    });
  } else if (bbPct >= BUFFER_BUSY_AMBER) {
    results.push({
      ruleId: "WAIT-004",
      category: "Contention",
      severity: "amber",
      finding: `Buffer busy waits at ${bbPct.toFixed(1)}% — potential row-level hot spots.`,
      recommendation: "Identify contended objects via ASH/AWR segment statistics.",
    });
  }

  const waitLower = wait.toLowerCase();
  if (waitLower.includes("enq:") || waitLower.includes("latch")) {
    results.push({
      ruleId: "WAIT-005",
      category: "Contention",
      severity: "amber",
      finding: `Enqueue or latch wait observed: '${wait}'.`,
      recommendation:
        "Review locking patterns, TX row lock contention, and shared pool latch pressure.",
    });
  }

  return results;
}
