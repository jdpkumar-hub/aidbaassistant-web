import { NextRequest, NextResponse } from "next/server";
import { getAnalyzeById } from "@/lib/awr-api-client";

/**
 * GET /api/analyze/health?id=<analysisId> — proxied from FastAPI stored analysis.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { success: false, errors: ["Query parameter id is required."] },
      { status: 400 },
    );
  }

  const { ok, status, data } = await getAnalyzeById(id);
  if (!ok || !data.success || !data.health) {
    return NextResponse.json(
      { success: false, errors: data.errors ?? ["Health data unavailable."] },
      { status: status >= 400 ? status : 404 },
    );
  }

  return NextResponse.json({
    success: true,
    healthScore: data.health.healthScore,
    riskLevel: data.health.riskLevel,
    dimensions: data.health.dimensions,
  });
}
