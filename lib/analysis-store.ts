import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { AwrAnalysisPayload, StoredAnalysis } from "@/lib/awr-dashboard-types";

const DATA_DIR = path.join(process.cwd(), ".data", "analyses");

function analysisPath(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(DATA_DIR, `${safe}.json`);
}

export async function saveAnalysis(
  payload: AwrAnalysisPayload,
  meta?: { fileName?: string },
): Promise<string> {
  const analysisId = randomUUID();
  const stored: StoredAnalysis = {
    ...payload,
    analysisId,
    fileName: meta?.fileName,
    createdAt: new Date().toISOString(),
  };
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(analysisPath(analysisId), JSON.stringify(stored, null, 2), "utf-8");
  return analysisId;
}

export async function loadAnalysis(
  analysisId: string,
): Promise<StoredAnalysis | null> {
  try {
    const raw = await readFile(analysisPath(analysisId), "utf-8");
    return JSON.parse(raw) as StoredAnalysis;
  } catch {
    return null;
  }
}
