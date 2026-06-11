/** Executive dashboard view model (from live AWR analysis API). */

export type RiskLevel = "Low" | "Medium" | "High";

export type WaitEventRow = {
  event: string;
  pctDbTime: number;
};

export type TopSqlRow = {
  sqlId: string;
  pctDbTime: number;
  executions: string | null;
  elapsedSec: string | null;
};

export type IntelligentFinding = {
  title: string;
  finding: string;
  likelyCause: string;
  evidence: string[];
  businessImpact: string;
  recommendation: string;
};

export type DashboardData = {
  databaseName: string;
  instanceName: string;
  snapWindow: string;
  healthScore: number;
	severity?: {
	  level: string;
	  score: number;
	  confidence: number;
	};  
  riskLevel: RiskLevel;
  bottleneck: string;
  confidence: number;
  bottleneckRationale: string;
  businessSummary: string;
  technicalSummary: string;
  waitEvents: WaitEventRow[];
  topSql: TopSqlRow[];
  recommendations: string[];
  intelligentFinding?: IntelligentFinding;
	sqlInsight?: {
		sqlId: string;
		title: string;
		finding: string;
		evidence: string[];
		recommendation: string;
	};
  warnings?: string[];  
};

export type AwrAnalysisPayload = {
  success: boolean;
  errors?: string[];
  warnings?: string[];
  metrics?: {
    databaseName: string;
    instanceName: string;
    dbTimeMinutes: number;
    [key: string]: unknown;
  };
  snapWindow?: string;
  health?: {
    healthScore: number;
    riskLevel: RiskLevel;
    dimensions?: unknown[];
  };
  bottleneck?: {
    classification: string;
    confidence: number;
    rationale: string;
    scores?: Record<string, number>;
  };
  summary?: {
    businessSummary: string;
    technicalSummary: string;
    topActions: string[];
    markdown?: string;
  };
  waitEvents?: WaitEventRow[];
  topSql?: TopSqlRow[];
  recommendations?: string[];
  rules?: unknown;
};

export type StoredAnalysis = AwrAnalysisPayload & {
  analysisId: string;
  fileName?: string;
  createdAt: string;
};

export function payloadToDashboard(payload: AwrAnalysisPayload): DashboardData | null {
  if (!payload.success || !payload.metrics || !payload.health || !payload.bottleneck) {
    return null;
  }
  const m = payload.metrics;
  const h = payload.health;
  const b = payload.bottleneck;
  const s = payload.summary;

  return {
    databaseName: m.databaseName,
    instanceName: m.instanceName,
    snapWindow: payload.snapWindow ?? `${m.dbTimeMinutes ?? 60} min snapshot`,
    healthScore: h.healthScore,
    riskLevel: h.riskLevel,
    bottleneck: b.classification,
    confidence: b.confidence,
    bottleneckRationale: b.rationale,
    businessSummary: s?.businessSummary ?? "",
    technicalSummary: s?.technicalSummary ?? "",
    waitEvents: payload.waitEvents ?? [],
    topSql: (payload.topSql ?? []).map((row) => ({
      sqlId: row.sqlId,
      pctDbTime: row.pctDbTime,
      executions: row.executions ?? "—",
      elapsedSec: row.elapsedSec ?? "—",
    })),
	intelligentFinding: payload.intelligent_finding
	  ? {
		  title: payload.intelligent_finding.title,
		  finding: payload.intelligent_finding.finding,
		  likelyCause: payload.intelligent_finding.likely_cause,
		  evidence: payload.intelligent_finding.evidence ?? [],
		  businessImpact: payload.intelligent_finding.business_impact,
		  recommendation: payload.intelligent_finding.recommendation,
		}
	  : undefined,	
    recommendations:
      payload.recommendations?.length
        ? payload.recommendations
        : (s?.topActions ?? []),
    warnings: payload.warnings,
  };
}
