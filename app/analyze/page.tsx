"use client";

import Link from "next/link";
import { ArrowLeft, FileCheck2, FileUp, Loader2, UploadCloud } from "lucide-react";
import { ChangeEvent, DragEvent, useMemo, useState } from "react";

type Status = "idle" | "ready" | "analyzing" | "done";

export default function AnalyzePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);

  const canAnalyze = useMemo(() => !!file && status !== "analyzing", [file, status]);

  function isValidAwrHtml(candidate: File) {
    const isHtmlMime = candidate.type === "text/html";
    const isHtmlExt = candidate.name.toLowerCase().endsWith(".html");
    return isHtmlMime || isHtmlExt;
  }

  function onFileSelected(candidate: File | null) {
    if (!candidate) return;
    if (!isValidAwrHtml(candidate)) {
      setFile(null);
      setStatus("idle");
      setProgress(0);
      return;
    }
    setFile(candidate);
    setStatus("ready");
    setProgress(0);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onFileSelected(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    onFileSelected(event.dataTransfer.files?.[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function runAnalysis() {
    if (!file || status === "analyzing") return;
    setStatus("analyzing");
    setProgress(0);

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer);
          setStatus("done");
          return 100;
        }
        return Math.min(current + 10, 100);
      });
    }, 300);
  }

  return (
    <main className="min-h-screen bg-navy-950 text-foreground">
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-accent">
            Oracle AWR Analysis
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Upload and Analyze Your Oracle AWR Report
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-silver-400">
            Drag and drop your Oracle AWR HTML report to generate an AI-powered
            diagnostic summary with enterprise-grade insights.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-navy-900/65 p-6 shadow-2xl shadow-black/30 lg:p-8">
          <label
            htmlFor="awr-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center transition-colors ${
              isDragging
                ? "border-accent bg-accent/10"
                : "border-white/20 bg-navy-800/70 hover:border-accent/50 hover:bg-navy-800"
            }`}
          >
            <UploadCloud className="h-10 w-10 text-accent" />
            <p className="mt-4 text-lg font-semibold text-white">
              Drag and drop upload
            </p>
            <p className="mt-2 text-sm text-silver-400">
              Upload Oracle AWR HTML report
            </p>
            <span className="mt-5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-silver-300">
              Choose file
            </span>
            <input
              id="awr-upload"
              type="file"
              accept=".html,text/html"
              onChange={handleInputChange}
              className="sr-only"
            />
          </label>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-navy-800/70 p-4">
            <div className="flex items-center gap-3">
              <FileUp className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-white">Selected report</p>
                <p className="text-sm text-silver-400">
                  {file ? file.name : "No file selected"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={runAnalysis}
              disabled={!canAnalyze}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "analyzing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-navy-800/70 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-silver-300">Progress indicator</span>
              <span className="font-medium text-white">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-navy-950">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {status === "done" && (
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-400">
                <FileCheck2 className="h-4 w-4" />
                Analysis complete. Your report is ready.
              </p>
            )}

            {!file && (
              <p className="mt-3 text-sm text-amber-300">
                Upload a valid Oracle AWR HTML file to enable analysis.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
