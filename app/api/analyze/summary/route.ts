import { NextResponse } from "next/server";
import { demoAwrMetrics, runAwrRules } from "@/lib/awr-rules";

/**
 * GET /api/analyze/summary — executive summary Markdown + structured sections.
 */
export async function GET() {
  const analysis = runAwrRules(demoAwrMetrics());
  return NextResponse.json({
    businessSummary: analysis.businessSummary,
    technicalSummary: analysis.technicalSummary,
    topActions: analysis.topActions,
    markdown: analysis.executiveSummaryMarkdown,
  });
}
