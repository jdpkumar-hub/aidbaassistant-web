import { NextRequest, NextResponse } from "next/server";
import { fetchAwrPdf } from "@/lib/awr-api-client";

/**
 * GET /api/report/awr?id=<analysisId> — PDF from FastAPI /report/{id}/pdf (awr_pdf.py).
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { success: false, errors: ["Query parameter id is required."] },
      { status: 400 },
    );
  }

  const { ok, status, buffer, error } = await fetchAwrPdf(id);
  if (!ok || !buffer) {
    return NextResponse.json(
      {
        success: false,
        errors: [error ?? "PDF generation failed."],
      },
      { status: status >= 400 ? status : 503 },
    );
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="AI_DBA_Assistant_AWR_Report.pdf"`,
    },
  });
}
