import { NextRequest, NextResponse } from "next/server";
import {
  getAnalyzeById,
  postAnalyzeAwr,
} from "@/lib/awr-api-client";
import {
  payloadToDashboard,
  type AwrAnalysisPayload,
} from "@/lib/awr-dashboard-types";

const MAX_BYTES = 50 * 1024 * 1024;

/**
 * BFF: POST /api/analyze/awr → FastAPI POST /analyze
 * BFF: GET /api/analyze/awr?id= → FastAPI GET /analyze/{id}
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { success: false, errors: ["Missing AWR HTML file (field: file)."] },
      { status: 400 },
    );
  }

  const name = file instanceof File ? file.name : "upload.html";
  const lower = name.toLowerCase();
  if (!lower.endsWith(".html") && !lower.endsWith(".htm")) {
    return NextResponse.json(
      { success: false, errors: ["File must be an Oracle AWR HTML export (.html)."] },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json(
      { success: false, errors: ["Uploaded file is empty."] },
      { status: 400 },
    );
  }
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json(
      { success: false, errors: ["File exceeds 50 MB limit."] },
      { status: 400 },
    );
  }

  const { ok, status, data } = await postAnalyzeAwr(buffer, name);
  if (!ok || !data.success) {
    return NextResponse.json(
      {
        success: false,
        errors: data.errors ?? [
          "AWR analysis service unavailable. Start FastAPI: uvicorn main:app --port 8000",
        ],
      },
      { status: status >= 400 ? status : 503 },
    );
  }

  const dashboard =
    data.dashboard ?? payloadToDashboard(data as AwrAnalysisPayload);

  return NextResponse.json({
    ...data,
    dashboard,
  });
}

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
      {
        success: false,
        errors: data.errors ?? ["Analysis not found."],
      },
      { status: status >= 400 ? status : 404 },
    );
  }

  const dashboard =
    data.dashboard ?? payloadToDashboard(data as AwrAnalysisPayload);

  return NextResponse.json({
    ...data,
    dashboard,
  });
}
