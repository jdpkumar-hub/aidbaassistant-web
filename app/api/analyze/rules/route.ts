import { NextResponse } from "next/server";
import { demoAwrMetrics, runAwrRules } from "@/lib/awr-rules";

/**
 * GET /api/analyze/rules — returns rule-based AWR analysis (DBA rules before AI).
 */
export async function GET() {
  const result = runAwrRules(demoAwrMetrics());
  return NextResponse.json(result);
}
