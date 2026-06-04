/**
 * HTTP client for the AI DBA Assistant FastAPI AWR service.
 * Set AWR_API_URL (default http://127.0.0.1:8000).
 */

import type { AwrAnalysisPayload } from "@/lib/awr-dashboard-types";

export function getAwrApiBaseUrl(): string {
  const base = process.env.AWR_API_URL ?? "http://127.0.0.1:8000";
  return base.replace(/\/$/, "");
}

export type AnalyzeApiResponse = AwrAnalysisPayload & {
  analysisId?: string;
  fileName?: string;
  createdAt?: string;
  dashboard?: unknown;
};

export async function postAnalyzeAwr(
  fileBuffer: Buffer,
  fileName: string,
): Promise<{ ok: boolean; status: number; data: AnalyzeApiResponse }> {
  const form = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)], { type: "text/html" });
  form.append("file", blob, fileName);

  const res = await fetch(`${getAwrApiBaseUrl()}/analyze`, {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as AnalyzeApiResponse & {
    detail?: string | { msg?: string }[];
  };

  if (!res.ok) {
    const errors = formatFastApiError(data);
    return {
      ok: false,
      status: res.status,
      data: { success: false, errors },
    };
  }

  return { ok: true, status: res.status, data };
}

export async function getAnalyzeById(
  analysisId: string,
): Promise<{ ok: boolean; status: number; data: AnalyzeApiResponse }> {
  const res = await fetch(
    `${getAwrApiBaseUrl()}/analyze/${encodeURIComponent(analysisId)}`,
    { method: "GET", cache: "no-store" },
  );

  const data = (await res.json()) as AnalyzeApiResponse & {
    detail?: string | { msg?: string }[];
  };

  if (!res.ok) {
    const errors = formatFastApiError(data);
    return {
      ok: false,
      status: res.status,
      data: { success: false, errors },
    };
  }

  return { ok: true, status: res.status, data };
}

export async function fetchAwrPdf(
  analysisId: string,
): Promise<{ ok: boolean; status: number; buffer?: Buffer; error?: string }> {
  const res = await fetch(
    `${getAwrApiBaseUrl()}/report/${encodeURIComponent(analysisId)}/pdf`,
    { method: "GET" },
  );

  if (!res.ok) {
    let error = "PDF generation failed.";
    try {
      const json = await res.json();
      error = formatFastApiError(json)[0] ?? error;
    } catch {
      error = (await res.text()) || error;
    }
    return { ok: false, status: res.status, error };
  }

  const arrayBuffer = await res.arrayBuffer();
  return { ok: true, status: res.status, buffer: Buffer.from(arrayBuffer) };
}

function formatFastApiError(data: unknown): string[] {
  if (!data || typeof data !== "object") {
    return ["AWR API request failed."];
  }
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.errors)) {
    return obj.errors.map(String);
  }
  if (typeof obj.detail === "string") {
    return [obj.detail];
  }
  if (Array.isArray(obj.detail)) {
    return obj.detail.map((d) =>
      typeof d === "object" && d && "msg" in d
        ? String((d as { msg: string }).msg)
        : String(d),
    );
  }
  if (typeof obj.error === "string") {
    return [obj.error];
  }
  return ["AWR API request failed."];
}

export async function checkAwrApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${getAwrApiBaseUrl()}/health`, {
      method: "GET",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
