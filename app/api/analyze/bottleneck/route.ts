import { NextResponse } from "next/server";
import { classifyBottleneck, demoAwrMetrics } from "@/lib/awr-rules";

/**
 * GET /api/analyze/bottleneck — Bottleneck Classification Engine result.
 */
export async function GET() {
  const result = classifyBottleneck(demoAwrMetrics());
  return NextResponse.json(result);
}
