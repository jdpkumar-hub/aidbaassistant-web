import { loadAnalysis } from "@/lib/analysis-store";
import type { AwrAnalysisPayload } from "@/lib/awr-dashboard-types";

export async function getStoredPayload(
  analysisId: string | null,
): Promise<AwrAnalysisPayload | null> {
  if (!analysisId) return null;
  const stored = await loadAnalysis(analysisId);
  if (!stored) return null;
  const { analysisId: _id, fileName: _fn, createdAt: _ca, ...payload } = stored;
  return payload as AwrAnalysisPayload;
}
