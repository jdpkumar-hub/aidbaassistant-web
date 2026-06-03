import { NextResponse } from "next/server";
import { calculateHealthScore, demoAwrMetrics } from "@/lib/awr-rules";

/**
 * GET /api/analyze/health — AWR Health Score Engine (score 0–100 + risk level).
 */
export async function GET() {
  const result = calculateHealthScore(demoAwrMetrics());
  return NextResponse.json({
    healthScore: result.healthScore,
    riskLevel: result.riskLevel,
    dimensions: result.dimensions,
  });
}
