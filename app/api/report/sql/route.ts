import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

const execFileAsync = promisify(execFile);

/**
 * GET /api/report/sql — generates enterprise SQL DBA PDF via ReportLab (Python).
 * Requires: pip install -r pdf-generator/requirements.txt
 */
export async function GET() {
  const root = path.join(process.cwd(), "..");
  const pdfGenDir = path.join(root, "pdf-generator");
  const outputPath = path.join(
    process.cwd(),
    "public",
    "reports",
    "sql_performance_report.pdf",
  );
  const script = path.join(pdfGenDir, "generate_demo.py");

  try {
    await execFileAsync("python", [script, "-o", outputPath], {
      cwd: pdfGenDir,
      timeout: 60_000,
    });

    const pdf = await readFile(outputPath);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="AI_DBA_Assistant_SQL_Report.pdf"',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF generation failed";
    return NextResponse.json(
      {
        error: message,
        hint: "Install Python dependencies: pip install -r pdf-generator/requirements.txt",
      },
      { status: 500 },
    );
  }
}
