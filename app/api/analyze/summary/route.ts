import { NextRequest, NextResponse } from "next/server";
import { getAnalyzeById } from "@/lib/awr-api-client";

/**
 * GET /api/analyze/summary?id=<analysisId>
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
  if (!ok || !data.success || !data.summary) {
    return NextResponse.json(
      { success: false, errors: data.errors ?? ["Summary unavailable."] },
      { status: status >= 400 ? status : 404 },
    );
  }

  const s = data.summary;
  return NextResponse.json({
    success: true,
    businessSummary: s.businessSummary,
    technicalSummary: s.technicalSummary,
    topActions: s.topActions,
    markdown: s.markdown,
  });
}
