import { NextRequest, NextResponse } from "next/server";
import { getAnalyzeById } from "@/lib/awr-api-client";

/**
 * GET /api/analyze/bottleneck?id=<analysisId>
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
  if (!ok || !data.success || !data.bottleneck) {
    return NextResponse.json(
      { success: false, errors: data.errors ?? ["Bottleneck data unavailable."] },
      { status: status >= 400 ? status : 404 },
    );
  }

  const b = data.bottleneck;
  return NextResponse.json({
    success: true,
    classification: b.classification,
    confidence: b.confidence,
    rationale: b.rationale,
    scores: b.scores,
  });
}
