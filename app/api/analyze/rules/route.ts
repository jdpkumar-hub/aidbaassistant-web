import { NextRequest, NextResponse } from "next/server";
import { getAnalyzeById } from "@/lib/awr-api-client";

/**
 * GET /api/analyze/rules?id=<analysisId>
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
  if (!ok || !data.success) {
    return NextResponse.json(
      { success: false, errors: data.errors ?? ["Analysis unavailable."] },
      { status: status >= 400 ? status : 404 },
    );
  }

  return NextResponse.json({
    success: true,
    healthScore: data.health?.healthScore,
    riskLevel: data.health?.riskLevel,
    bottleneckClassification: data.bottleneck?.classification,
    businessSummary: data.summary?.businessSummary,
    technicalSummary: data.summary?.technicalSummary,
    topActions: data.summary?.topActions ?? [],
    recommendations: data.recommendations ?? [],
    waitEvents: data.waitEvents ?? [],
    topSql: data.topSql ?? [],
    rules: data.rules,
    metrics: data.metrics,
  });
}
