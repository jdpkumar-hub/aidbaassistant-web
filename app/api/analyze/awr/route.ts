import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  getAnalyzeById,
  postAnalyzeAwr,
} from "@/lib/awr-api-client";
import {
  payloadToDashboard,
  type AwrAnalysisPayload,
} from "@/lib/awr-dashboard-types";
import { assertPlanLimit, recordUsage } from "@/lib/billing/limits";
import {
  ensureCustomerAppUser,
  getAuthUser,
} from "@/lib/billing/customer";

const MAX_BYTES = 50 * 1024 * 1024;

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-"));
}

async function getRouteAuthUser(request: NextRequest) {
  const fromCookieStore = await getAuthUser();
  if (fromCookieStore) return fromCookieStore;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * BFF: POST /api/analyze/awr → FastAPI POST /analyze
 * BFF: GET /api/analyze/awr?id= → FastAPI GET /analyze/{id}
 */
export async function POST(request: NextRequest) {
  const hasSbCookie = hasSupabaseAuthCookie(request);
  const authUser = await getRouteAuthUser(request);

  console.info("[api.analyze.awr] auth diagnostic", {
    hasSbCookie,
    hasAuthUser: !!authUser,
  });

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        errors: ["Sign in required to use this feature."],
      },
      { status: 401 }
    );
  }

  const appUser = await ensureCustomerAppUser(authUser);
  console.info("[api.analyze.awr] app user diagnostic", {
    hasAppUser: !!appUser,
    hasAuthUserId: !!appUser?.auth_user_id,
  });

  const limitCheck = await assertPlanLimit("awr_reports", {
    authUserId: authUser.id,
    email: authUser.email,
  });
  if (!limitCheck.ok) {
    // Auth was already proven above. Do not convert a missing profile into 401.
    if (limitCheck.status === 401) {
      console.info("[api.analyze.awr] authenticated customer missing plan profile; continuing");
    } else {
      return NextResponse.json(
        {
          success: false,
          errors: [limitCheck.error],
          planKey: limitCheck.planKey,
          used: "used" in limitCheck ? limitCheck.used : undefined,
          limit: "limit" in limitCheck ? limitCheck.limit : undefined,
        },
        { status: limitCheck.status }
      );
    }
  }

  const billingUser = limitCheck.ok ? limitCheck.appUser : appUser;

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

  await recordUsage({
    metric: "awr_reports",
    userId: billingUser?.id,
    authUserId: billingUser?.auth_user_id || authUser.id,
    metadata: { analysis_id: (data as { id?: string }).id || null, file_name: name },
  });

  const dashboard =
    data.dashboard ?? payloadToDashboard(data as AwrAnalysisPayload);

  return NextResponse.json({
    ...data,
    dashboard,
    billing: {
      planKey: limitCheck.ok ? limitCheck.planKey : "free",
      used: limitCheck.ok ? (limitCheck.used || 0) + 1 : 1,
      limit: limitCheck.ok ? limitCheck.limit : 3,
    },
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
