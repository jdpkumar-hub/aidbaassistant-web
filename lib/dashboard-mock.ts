/**
 * Realistic Oracle AWR sample data for the Executive Dashboard page.
 * Aligned with demo metrics (Production Oracle 19c / PROD_ORCL snapshot).
 */

export type DashboardMock = {
  databaseName: string;
  instanceName: string;
  snapWindow: string;
  healthScore: number;
  riskLevel: "Low" | "Medium" | "High";
  bottleneck: string;
  confidence: number;
  bottleneckRationale: string;
  businessSummary: string;
  technicalSummary: string;
  waitEvents: { event: string; pctDbTime: number }[];
  topSql: { sqlId: string; pctDbTime: number; executions: string; elapsedSec: string }[];
  recommendations: string[];
};

export const dashboardMock: DashboardMock = {
  databaseName: "Production Oracle 19c",
  instanceName: "PROD_ORCL",
  snapWindow: "Snap 4520–4521 · 60 min · 26-Apr-2026 08:00–09:00",
  healthScore: 62,
  riskLevel: "Medium",
  bottleneck: "Random IO Bottleneck",
  confidence: 44.9,
  bottleneckRationale:
    "Top wait db file sequential read (42.3% DB time) with 12,500 physical reads/sec — index/single-block I/O pattern.",
  businessSummary:
    "During the 60-minute AWR window, Production Oracle 19c (PROD_ORCL) recorded a database health score of 62/100, classified as Medium risk. The primary workload constraint is a Random IO Bottleneck, which should be addressed before the next peak business window. User-facing queries and OLTP workflows may experience latency from storage read latency. The assessment identified critical rule-based findings requiring DBA and application coordination.",
  technicalSummary:
    "Snapshot: 60 min · AAS: 12.4 · Active sessions (avg): 142. Top wait db file sequential read (42.3% DB time). CPU 78.0% · Buffer busy 18.1% · Log file sync 12.4% · Top SQL abc123 (31.2% DB time) · Physical reads 12,500/sec · Buffer cache hit 86.4%.",
  waitEvents: [
    { event: "db file sequential read", pctDbTime: 42.3 },
    { event: "CPU time", pctDbTime: 28.0 },
    { event: "buffer busy waits", pctDbTime: 18.1 },
    { event: "log file sync", pctDbTime: 12.4 },
    { event: "db file parallel read", pctDbTime: 6.2 },
    { event: "latch: cache buffers chains", pctDbTime: 3.8 },
  ],
  topSql: [
    { sqlId: "abc123", pctDbTime: 31.2, executions: "12,450", elapsedSec: "4,820" },
    { sqlId: "7x9k2f", pctDbTime: 14.8, executions: "8,204", elapsedSec: "2,108" },
    { sqlId: "3m4n8p", pctDbTime: 9.1, executions: "22,180", elapsedSec: "1,452" },
    { sqlId: "9p2q1r", pctDbTime: 5.4, executions: "4,890", elapsedSec: "890" },
    { sqlId: "2k8m1n", pctDbTime: 3.2, executions: "18,900", elapsedSec: "620" },
  ],
  recommendations: [
    "Tune SQL for index-friendly access; review storage subsystem and file layout.",
    "Tune SQL_ID abc123: review execution plan, indexes, and bind variable usage.",
    "Prioritize wait event analysis; correlate with top SQL and session blocking chains.",
    "Investigate hot rows/index blocks; consider ASSM, reverse key indexes, or hash partitioning.",
    "Monitor CPU trend across snapshots; validate top SQL and connection pool sizing.",
  ],
};
