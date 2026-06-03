/**
 * AWR Health Score Engine — composite 0–100 score and risk from core AWR metrics.
 */

import type { AwrMetrics, RiskLevel } from "./types";

const HEALTH_GREEN = 80;
const HEALTH_AMBER = 60;

const MAX_CPU = 20;
const MAX_TOP_WAIT = 20;
const MAX_BUFFER_BUSY = 15;
const MAX_LOG_SYNC = 12;
const MAX_TOP_SQL = 18;
const MAX_IO = 15;

const IO_READS_BASE = 5000;
const IO_READS_STRESS = 15000;

export type DimensionScore = {
  name: string;
  score: number;
  penalty: number;
  maxPenalty: number;
  detail: string;
};

export type HealthScoreResult = {
  healthScore: number;
  riskLevel: RiskLevel;
  dimensions: DimensionScore[];
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function penaltyToScore(penalty: number, maxPenalty: number): number {
  if (maxPenalty <= 0) return 100;
  return clampScore(100 - (penalty / maxPenalty) * 100);
}

function cpuPenalty(cpuPct: number): number {
  return Math.min(MAX_CPU, Math.max(0, (cpuPct - 60) * 0.25));
}

function topWaitPenalty(waitPct: number): number {
  return Math.min(MAX_TOP_WAIT, Math.max(0, (waitPct - 25) * 0.35));
}

function bufferBusyPenalty(bbPct: number): number {
  return Math.min(MAX_BUFFER_BUSY, Math.max(0, (bbPct - 8) * 0.5));
}

function logSyncPenalty(
  logPct: number,
  topWait: string,
  topWaitPct: number,
): number {
  const base = Math.min(MAX_LOG_SYNC, Math.max(0, (logPct - 5) * 0.6));
  if (topWait.toLowerCase().includes("log file sync")) {
    const waitComponent = Math.min(MAX_LOG_SYNC, Math.max(0, (topWaitPct - 10) * 0.4));
    return Math.min(MAX_LOG_SYNC, Math.max(base, waitComponent));
  }
  return base;
}

function topSqlPenalty(sqlPct: number): number {
  return Math.min(MAX_TOP_SQL, Math.max(0, (sqlPct - 15) * 0.4));
}

function ioPenalty(
  physicalReadsPerSec: number,
  topWait: string,
  topWaitPct: number,
): number {
  let readPenalty = 0;
  if (physicalReadsPerSec > IO_READS_BASE) {
    if (physicalReadsPerSec >= IO_READS_STRESS) {
      readPenalty = MAX_IO;
    } else {
      const span = IO_READS_STRESS - IO_READS_BASE;
      readPenalty = ((physicalReadsPerSec - IO_READS_BASE) / span) * MAX_IO;
    }
  }

  const waitLower = topWait.toLowerCase();
  const ioWaits = [
    "db file sequential",
    "db file scattered",
    "direct path read",
    "direct path write",
  ];
  if (ioWaits.some((k) => waitLower.includes(k))) {
    const waitPenalty = Math.min(MAX_IO, Math.max(0, (topWaitPct - 25) * 0.3));
    return Math.min(MAX_IO, Math.max(readPenalty, waitPenalty));
  }
  return readPenalty;
}

function classifyRisk(
  healthScore: number,
  dimensions: DimensionScore[],
): RiskLevel {
  const criticalCount = dimensions.filter(
    (d) => d.penalty >= d.maxPenalty * 0.7 && d.maxPenalty > 0,
  ).length;
  if (healthScore < HEALTH_AMBER || criticalCount >= 2) return "High";
  if (healthScore < HEALTH_GREEN || criticalCount >= 1) return "Medium";
  return "Low";
}

export function calculateHealthScore(metrics: AwrMetrics): HealthScoreResult {
  const specs: Array<{
    name: string;
    penalty: number;
    maxPenalty: number;
    detail: string;
  }> = [
    {
      name: "CPU Utilization",
      penalty: cpuPenalty(metrics.cpuUsagePct),
      maxPenalty: MAX_CPU,
      detail: `${metrics.cpuUsagePct.toFixed(1)}% utilization`,
    },
    {
      name: "Top Wait Event",
      penalty: topWaitPenalty(metrics.topWaitEventPct),
      maxPenalty: MAX_TOP_WAIT,
      detail: `${metrics.topWaitEvent} (${metrics.topWaitEventPct.toFixed(1)}% DB time)`,
    },
    {
      name: "Buffer Busy Waits",
      penalty: bufferBusyPenalty(metrics.bufferBusyWaitsPct),
      maxPenalty: MAX_BUFFER_BUSY,
      detail: `${metrics.bufferBusyWaitsPct.toFixed(1)}% of DB time`,
    },
    {
      name: "Log File Sync",
      penalty: logSyncPenalty(
        metrics.logFileSyncPct,
        metrics.topWaitEvent,
        metrics.topWaitEventPct,
      ),
      maxPenalty: MAX_LOG_SYNC,
      detail: `${metrics.logFileSyncPct.toFixed(1)}% DB time`,
    },
    {
      name: "Top SQL Concentration",
      penalty: topSqlPenalty(metrics.topSqlDbTimePct),
      maxPenalty: MAX_TOP_SQL,
      detail: `SQL_ID ${metrics.topSqlId} (${metrics.topSqlDbTimePct.toFixed(1)}% DB time)`,
    },
    {
      name: "I/O Pressure",
      penalty: ioPenalty(
        metrics.physicalReadsPerSec,
        metrics.topWaitEvent,
        metrics.topWaitEventPct,
      ),
      maxPenalty: MAX_IO,
      detail: `${metrics.physicalReadsPerSec.toLocaleString()} physical reads/sec`,
    },
  ];

  const dimensions: DimensionScore[] = specs.map((s) => ({
    name: s.name,
    score: Math.round(penaltyToScore(s.penalty, s.maxPenalty) * 10) / 10,
    penalty: Math.round(s.penalty * 100) / 100,
    maxPenalty: s.maxPenalty,
    detail: s.detail,
  }));

  const totalPenalty = dimensions.reduce((sum, d) => sum + d.penalty, 0);
  const healthScore = Math.round(clampScore(100 - totalPenalty));
  const riskLevel = classifyRisk(healthScore, dimensions);

  return { healthScore, riskLevel, dimensions };
}
