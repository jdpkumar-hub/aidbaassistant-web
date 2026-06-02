"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Database,
  FileCheck2,
  FileText,
  HardDrive,
  Loader2,
  MemoryStick,
  Sparkles,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { ChangeEvent, DragEvent, useCallback, useMemo, useRef, useState } from "react";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

type Phase = "idle" | "uploading" | "ready" | "analyzing" | "complete";

type ValidationResult = { ok: true } | { ok: false; message: string };

function validateAwrFile(file: File): ValidationResult {
  const name = file.name.toLowerCase();
  const isHtmlExt = name.endsWith(".html") || name.endsWith(".htm");
  const isHtmlMime =
    file.type === "text/html" || file.type === "" || file.type === "application/xhtml+xml";

  if (!isHtmlExt && file.type && !isHtmlMime) {
    return {
      ok: false,
      message: "Invalid file type. Upload an Oracle AWR HTML report (.html).",
    };
  }

  if (!isHtmlExt) {
    return {
      ok: false,
      message: "File must use a .html extension (Oracle AWR HTML export).",
    };
  }

  if (file.size === 0) {
    return { ok: false, message: "The selected file is empty." };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message: `File exceeds ${MAX_FILE_BYTES / (1024 * 1024)} MB limit.`,
    };
  }

  return { ok: true };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const demoSummary = {
  database: "PROD_ORCL",
  snapshot: "Snap ID 4521 · 60 min interval",
  critical: 3,
  advisory: 7,
  waitEvent: "db file sequential read",
  waitPct: "42.3%",
  topSql: "8k2x9f",
  cpuPct: "78%",
  memoryPressure: "Moderate",
};

export default function AnalyzePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const canAnalyze = useMemo(
    () => file && phase === "ready",
    [file, phase],
  );

  const showUploadBar = phase === "uploading";
  const showAnalysisBar = phase === "analyzing";
  const showPreview = phase === "complete";

  const processFile = useCallback((candidate: File | null) => {
    if (!candidate) return;

    const result = validateAwrFile(candidate);
    if (!result.ok) {
      setFile(null);
      setValidationError(result.message);
      setPhase("idle");
      setUploadProgress(0);
      setAnalysisProgress(0);
      return;
    }

    setValidationError(null);
    setFile(candidate);
    setPhase("uploading");
    setUploadProgress(0);
    setAnalysisProgress(0);

    let progress = 0;
    const uploadTimer = window.setInterval(() => {
      progress += 12;
      if (progress >= 100) {
        window.clearInterval(uploadTimer);
        setUploadProgress(100);
        setPhase("ready");
        return;
      }
      setUploadProgress(progress);
    }, 120);
  }, []);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    processFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0] ?? null);
  }

  function clearFile() {
    setFile(null);
    setValidationError(null);
    setPhase("idle");
    setUploadProgress(0);
    setAnalysisProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  function runAnalysis() {
    if (!file || phase !== "ready") return;
    setPhase("analyzing");
    setAnalysisProgress(0);

    const timer = window.setInterval(() => {
      setAnalysisProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer);
          setPhase("complete");
          return 100;
        }
        return Math.min(current + 8, 100);
      });
    }, 280);
  }

  return (
    <main className="min-h-screen bg-navy-950 text-foreground">
      <section className="relative overflow-hidden border-b border-white/10 py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Diagnostic Console
            </span>
            <span className="text-xs text-silver-400">Oracle AWR · Enterprise Analysis</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Oracle Performance Analysis
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-silver-400">
            Upload Oracle AWR HTML report for AI-driven diagnostics, wait event
            analysis, and SQL tuning recommendations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-6 shadow-xl shadow-black/20 lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Report intake</h2>
                  <p className="mt-1 text-sm text-silver-400">
                    Upload Oracle AWR HTML report
                  </p>
                </div>
                <FileText className="h-5 w-5 text-accent" />
              </div>

              <label
                htmlFor="awr-upload"
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all ${
                  isDragging
                    ? "border-accent bg-accent/10 scale-[1.01]"
                    : validationError
                      ? "border-red-500/40 bg-red-500/5"
                      : file && phase !== "idle"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-white/15 bg-navy-800/60 hover:border-accent/40 hover:bg-navy-800"
                }`}
              >
                <UploadCloud
                  className={`h-12 w-12 ${validationError ? "text-red-400" : "text-accent"}`}
                />
                <p className="mt-4 text-base font-semibold text-white">
                  Drag and drop your AWR report
                </p>
                <p className="mt-2 text-sm text-silver-400">
                  Oracle AWR HTML export · .html · max 50 MB
                </p>
                <span className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20">
                  Browse files
                </span>
                <input
                  ref={inputRef}
                  id="awr-upload"
                  type="file"
                  accept=".html,.htm,text/html"
                  onChange={handleInputChange}
                  className="sr-only"
                />
              </label>

              {validationError && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3"
                >
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-200">
                      File validation failed
                    </p>
                    <p className="mt-1 text-sm text-red-300/90">{validationError}</p>
                  </div>
                </div>
              )}

              {file && !validationError && (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-navy-800/80 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                      <FileCheck2 className="h-5 w-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-silver-400">
                        {formatBytes(file.size)} · Validated
                      </p>
                    </div>
                  </div>
                  {phase !== "analyzing" && phase !== "complete" && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="shrink-0 text-xs text-silver-400 underline-offset-2 hover:text-white hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {showUploadBar && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-silver-300">Upload progress</span>
                    <span className="font-mono font-medium text-white">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-navy-950 ring-1 ring-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-accent transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-silver-400">
                    Securing report for analysis pipeline…
                  </p>
                </div>
              )}

              {showAnalysisBar && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-silver-300">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      Analysis in progress
                    </span>
                    <span className="font-mono font-medium text-white">
                      {analysisProgress}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-navy-950 ring-1 ring-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-violet-500 transition-all duration-200"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-silver-400">
                    Parsing wait events, SQL workload, and resource metrics…
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={runAnalysis}
                  disabled={!canAnalyze}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {phase === "analyzing" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing report…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Report
                    </>
                  )}
                </button>
                {phase === "complete" && (
                  <span className="inline-flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Analysis complete
                  </span>
                )}
              </div>
            </div>

            {showPreview && (
              <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-6 shadow-xl shadow-black/20 lg:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Report summary preview
                  </h2>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    Generated
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-navy-800/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-silver-400">
                      Database
                    </p>
                    <p className="mt-2 font-mono text-sm font-medium text-white">
                      {demoSummary.database}
                    </p>
                    <p className="mt-1 text-xs text-silver-400">
                      {demoSummary.snapshot}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-navy-800/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-silver-400">
                      Findings
                    </p>
                    <p className="mt-2 text-sm text-white">
                      <span className="font-semibold text-amber-400">
                        {demoSummary.critical} critical
                      </span>
                      {" · "}
                      <span className="text-silver-300">
                        {demoSummary.advisory} advisory
                      </span>
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 font-mono text-sm">
                  <li className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-amber-200/90">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    Top wait: {demoSummary.waitEvent} ({demoSummary.waitPct})
                  </li>
                  <li className="flex items-start gap-2 rounded-lg border border-white/10 bg-navy-950/50 px-3 py-2.5 text-silver-300">
                    <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    CPU utilization peak: {demoSummary.cpuPct}
                  </li>
                  <li className="flex items-start gap-2 rounded-lg border border-white/10 bg-navy-950/50 px-3 py-2.5 text-silver-300">
                    <Database className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Top SQL bottleneck: SQL_ID {demoSummary.topSql}
                  </li>
                  <li className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-emerald-300/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    Memory pressure: {demoSummary.memoryPressure} — review PGA
                    advisory
                  </li>
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/demo"
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    View full demo report
                  </Link>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="rounded-lg px-4 py-2 text-sm text-silver-400 hover:text-white"
                  >
                    Analyze another report
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-5">
              <h3 className="text-sm font-semibold text-white">Analysis pipeline</h3>
              <ol className="mt-4 space-y-3">
                {[
                  { label: "Upload & validate", done: !!file && !validationError },
                  { label: "Ingest AWR HTML", done: uploadProgress === 100 },
                  { label: "AI diagnostics", done: phase === "complete" },
                  { label: "Summary preview", done: showPreview },
                ].map((step, i) => (
                  <li key={step.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        step.done
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/5 text-silver-500"
                      }`}
                    >
                      {step.done ? "✓" : i + 1}
                    </span>
                    <span className={step.done ? "text-silver-200" : "text-silver-500"}>
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-5">
              <h3 className="text-sm font-semibold text-white">Validation rules</h3>
              <ul className="mt-3 space-y-2 text-xs text-silver-400">
                <li className="flex items-center gap-2">
                  <HardDrive className="h-3.5 w-3.5 text-accent" />
                  Format: .html AWR export
                </li>
                <li className="flex items-center gap-2">
                  <MemoryStick className="h-3.5 w-3.5 text-accent" />
                  Max size: 50 MB
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-accent" />
                  Non-empty, readable report file
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Enterprise
              </p>
              <p className="mt-2 text-sm text-silver-300">
                Need private deployment or unlimited team access?
              </p>
              <Link
                href="/Pricing"
                className="mt-3 inline-block text-sm font-medium text-white underline-offset-2 hover:underline"
              >
                View pricing →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
