import { execFile } from "child_process";
import { promisify } from "util";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import type { AwrAnalysisPayload } from "@/lib/awr-dashboard-types";

const execFileAsync = promisify(execFile);

export function getRepoRoot(): string {
  if (process.env.AIDBA_REPO_ROOT) {
    return path.resolve(process.env.AIDBA_REPO_ROOT);
  }
  return path.resolve(process.cwd(), "..");
}

export function getPythonCommand(): string {
  return process.env.PYTHON_PATH ?? "python";
}

/**
 * Run pdf-generator/awr_analysis_json.py on AWR HTML bytes.
 */
export async function runPythonAwrAnalysis(
  html: Buffer,
): Promise<AwrAnalysisPayload> {
  const repoRoot = getRepoRoot();
  const pdfGen = path.join(repoRoot, "pdf-generator");
  const script = path.join(pdfGen, "awr_analysis_json.py");
  const python = getPythonCommand();

  const dir = await mkdtemp(path.join(tmpdir(), "awr-upload-"));
  const htmlPath = path.join(dir, "report.html");

  try {
    await writeFile(htmlPath, html);
    const { stdout } = await execFileAsync(python, [script, htmlPath], {
      cwd: pdfGen,
      maxBuffer: 16 * 1024 * 1024,
      timeout: 120_000,
      windowsHide: true,
    });
    const text = stdout.trim();
    if (!text) {
      return {
        success: false,
        errors: ["Python analysis returned empty output."],
      };
    }
    return JSON.parse(text) as AwrAnalysisPayload;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Python AWR analysis failed.";
    const hint =
      "Ensure Python 3 is installed, dependencies are installed (pip install -r requirements.txt), and PYTHON_PATH/AIDBA_REPO_ROOT are set if needed.";
    return {
      success: false,
      errors: [message, hint],
    };
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Read HTML from repo test sample (dev fallback). */
export async function runPythonAwrAnalysisSample(): Promise<AwrAnalysisPayload> {
  const sample = path.join(
    getRepoRoot(),
    "pdf-generator",
    "test_awr_sample.html",
  );
  const html = await readFile(sample);
  return runPythonAwrAnalysis(html);
}
