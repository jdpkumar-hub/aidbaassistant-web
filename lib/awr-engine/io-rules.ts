import type { AwrMetrics, RuleResult } from "./types";

const PHYSICAL_READS_AMBER = 8000;
const PHYSICAL_READS_RED = 15000;
const LOG_SYNC_AMBER = 10;
const LOG_SYNC_RED = 20;

export const IO_RULES_COUNT = 4;

export function evaluateIo(metrics: AwrMetrics): RuleResult[] {
  const results: RuleResult[] = [];
  const wait = metrics.topWaitEvent.toLowerCase();

  if (metrics.physicalReadsPerSec >= PHYSICAL_READS_RED) {
    results.push({
      ruleId: "IO-001",
      category: "I/O",
      severity: "red",
      finding: `Physical reads ${metrics.physicalReadsPerSec.toLocaleString()}/sec — high storage throughput demand.`,
      recommendation:
        "Review ASM disk group performance, storage latency, and full scan SQL driving reads.",
    });
  } else if (metrics.physicalReadsPerSec >= PHYSICAL_READS_AMBER) {
    results.push({
      ruleId: "IO-002",
      category: "I/O",
      severity: "amber",
      finding: `Physical reads ${metrics.physicalReadsPerSec.toLocaleString()}/sec — elevated I/O pressure.`,
      recommendation:
        "Validate buffer cache sizing and index access paths to reduce physical I/O.",
    });
  }

  if (
    ["db file sequential", "db file scattered", "direct path read"].some((k) =>
      wait.includes(k),
    ) &&
    metrics.topWaitEventPct >= 25
  ) {
    results.push({
      ruleId: "IO-003",
      category: "I/O",
      severity: metrics.topWaitEventPct >= 40 ? "red" : "amber",
      finding: `Top wait '${metrics.topWaitEvent}' at ${metrics.topWaitEventPct.toFixed(1)}% — I/O bound workload.`,
      recommendation:
        "Tune SQL for index-friendly access; review storage subsystem and file layout.",
    });
  }

  const logPct = metrics.logFileSyncPct;
  if (
    logPct >= LOG_SYNC_RED ||
    (wait.includes("log file sync") && metrics.topWaitEventPct >= LOG_SYNC_AMBER)
  ) {
    results.push({
      ruleId: "IO-004",
      category: "I/O",
      severity: logPct >= LOG_SYNC_RED ? "red" : "amber",
      finding: `Log file sync wait significant (${logPct.toFixed(1)}% DB time or top wait).`,
      recommendation:
        "Review commit frequency, redo log sizing, and redo write latency on storage.",
    });
  }

  return results;
}
