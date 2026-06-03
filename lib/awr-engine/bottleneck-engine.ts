/**
 * Bottleneck Classification Engine — classifies AWR workload from metrics.
 */

import type { AwrMetrics, BottleneckClass } from "./types";

export const BOTTLENECK_TYPES: readonly BottleneckClass[] = [
  "CPU Bottleneck",
  "Random IO Bottleneck",
  "Sequential Scan Bottleneck",
  "Commit Bottleneck",
  "Concurrency Bottleneck",
  "Memory Bottleneck",
] as const;

const TIE_PRIORITY: BottleneckClass[] = [
  "Commit Bottleneck",
  "Concurrency Bottleneck",
  "Memory Bottleneck",
  "Sequential Scan Bottleneck",
  "Random IO Bottleneck",
  "CPU Bottleneck",
];

export type BottleneckClassificationResult = {
  classification: BottleneckClass;
  confidence: number;
  scores: Record<BottleneckClass, number>;
  rationale: string;
};

function pgaUtilizationPct(metrics: AwrMetrics): number {
  if (metrics.pgaTargetMb <= 0) return 0;
  return (metrics.pgaAllocatedMb / metrics.pgaTargetMb) * 100;
}

function scoreDimensions(metrics: AwrMetrics): Record<BottleneckClass, number> {
  const wait = metrics.topWaitEvent.toLowerCase();
  const waitPct = metrics.topWaitEventPct;
  const scores = Object.fromEntries(
    BOTTLENECK_TYPES.map((b) => [b, 0]),
  ) as Record<BottleneckClass, number>;

  if (wait.includes("log file sync")) {
    scores["Commit Bottleneck"] += 50 + waitPct * 0.6;
  }
  scores["Commit Bottleneck"] += Math.min(35, metrics.logFileSyncPct * 2.5);
  if (metrics.logFileSyncPct >= 10) scores["Commit Bottleneck"] += 10;

  const concurrencyWaits = [
    "buffer busy",
    "enq:",
    "latch",
    "row lock",
    "library cache lock",
    "cursor:",
    "tx index",
  ];
  if (concurrencyWaits.some((k) => wait.includes(k))) {
    scores["Concurrency Bottleneck"] += 48 + waitPct * 0.55;
  }
  scores["Concurrency Bottleneck"] += Math.min(40, metrics.bufferBusyWaitsPct * 2.2);
  if (metrics.bufferBusyWaitsPct >= 15) scores["Concurrency Bottleneck"] += 12;

  const pgaUtil = pgaUtilizationPct(metrics);
  const memoryWaits = ["pga", "memory", "direct path temp", "swap"];
  if (memoryWaits.some((k) => wait.includes(k))) {
    scores["Memory Bottleneck"] += 48 + waitPct * 0.4;
  }
  if (metrics.bufferCacheHitRatioPct < 90) {
    scores["Memory Bottleneck"] += (90 - metrics.bufferCacheHitRatioPct) * 1.8;
  }
  if (pgaUtil >= 75) scores["Memory Bottleneck"] += (pgaUtil - 75) * 1.0;
  if (metrics.sharedPoolFreePct < 10) scores["Memory Bottleneck"] += 12;

  if (wait.includes("db file scattered")) {
    scores["Sequential Scan Bottleneck"] += 55 + waitPct * 0.6;
  }
  if (wait.includes("direct path read")) {
    scores["Sequential Scan Bottleneck"] += 50 + waitPct * 0.5;
  }
  if (
    metrics.physicalReadsPerSec >= 10000 &&
    (wait.includes("scattered") || wait.includes("direct path"))
  ) {
    scores["Sequential Scan Bottleneck"] += 18;
  }

  if (wait.includes("db file sequential read")) {
    scores["Random IO Bottleneck"] += 52 + waitPct * 0.6;
  }
  if (metrics.physicalReadsPerSec >= 8000 && wait.includes("sequential")) {
    scores["Random IO Bottleneck"] += 20;
  }

  if (wait.includes("cpu") || wait.trim() === "on cpu" || wait.trim() === "cpu time") {
    scores["CPU Bottleneck"] += 45 + waitPct * 0.5;
  }
  if (metrics.cpuUsagePct >= 70) {
    scores["CPU Bottleneck"] += (metrics.cpuUsagePct - 70) * 1.5;
  }
  if (metrics.cpuUsagePct >= 85) scores["CPU Bottleneck"] += 15;
  if (metrics.dbTimeAas >= 12 && metrics.cpuUsagePct >= 65) {
    scores["CPU Bottleneck"] += 8;
  }

  return scores;
}

function pickWinner(scores: Record<BottleneckClass, number>): BottleneckClass {
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore <= 0) return "Random IO Bottleneck";

  const leaders = BOTTLENECK_TYPES.filter((b) => scores[b] === maxScore);
  if (leaders.length === 1) return leaders[0];

  for (const candidate of TIE_PRIORITY) {
    if (leaders.includes(candidate)) return candidate;
  }
  return leaders[0];
}

function buildRationale(
  classification: BottleneckClass,
  metrics: AwrMetrics,
  scores: Record<BottleneckClass, number>,
): string {
  const wait = metrics.topWaitEvent;
  const waitPct = metrics.topWaitEventPct;
  const topScore = scores[classification];

  const hints: Record<BottleneckClass, string> = {
    "CPU Bottleneck": `CPU utilization ${metrics.cpuUsagePct.toFixed(1)}% with top wait profile indicating CPU-bound work.`,
    "Random IO Bottleneck": `Top wait '${wait}' (${waitPct.toFixed(1)}% DB time) and ${metrics.physicalReadsPerSec.toLocaleString()} physical reads/sec — typical of index/single-block I/O.`,
    "Sequential Scan Bottleneck": `Top wait '${wait}' (${waitPct.toFixed(1)}% DB time) with high read throughput (${metrics.physicalReadsPerSec.toLocaleString()}/sec) — consistent with full scans.`,
    "Commit Bottleneck": `Log file sync at ${metrics.logFileSyncPct.toFixed(1)}% DB time; top wait '${wait}' (${waitPct.toFixed(1)}%).`,
    "Concurrency Bottleneck": `Buffer busy waits ${metrics.bufferBusyWaitsPct.toFixed(1)}% DB time; top wait '${wait}' (${waitPct.toFixed(1)}%).`,
    "Memory Bottleneck": `Buffer cache hit ${metrics.bufferCacheHitRatioPct.toFixed(1)}%; PGA ${metrics.pgaAllocatedMb.toFixed(0)}/${metrics.pgaTargetMb.toFixed(0)} MB; top wait '${wait}'.`,
  };

  return `${classification} (score ${topScore.toFixed(0)}). ${hints[classification] ?? ""}`.trim();
}

export function classifyBottleneck(metrics: AwrMetrics): BottleneckClassificationResult {
  const scores = scoreDimensions(metrics);
  const classification = pickWinner(scores);
  const maxScore = scores[classification];
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const confidence = Math.round(
    Math.min(100, Math.max(35, (maxScore / total) * 100)) * 10,
  ) / 10;
  const roundedScores = Object.fromEntries(
    BOTTLENECK_TYPES.map((b) => [b, Math.round(scores[b] * 10) / 10]),
  ) as Record<BottleneckClass, number>;

  return {
    classification,
    confidence,
    scores: roundedScores,
    rationale: buildRationale(classification, metrics, scores),
  };
}
