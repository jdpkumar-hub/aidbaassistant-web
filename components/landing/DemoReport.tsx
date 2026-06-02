import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";

const findings = [
  "Top Wait Event: db file sequential read (42.3%)",
  "SQL_ID 8k2x9f consuming 31% DB time",
  "Buffer cache hit ratio dropped to 86.4%",
  "3 critical findings and 7 advisory recommendations",
];

export function DemoReport() {
  return (
    <section id="demo" className="relative border-t border-white/10 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Demo Analysis Report
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See the exact report your team receives
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-silver-400">
              Preview how AI DBA Assistant turns raw AWR output into executive-
              ready diagnostics, SQL tuning guidance, and risk-prioritized action
              plans.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Request Full Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Download Sample PDF
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-1 shadow-2xl shadow-black/40">
            <div className="rounded-xl border border-white/10 bg-navy-800/80 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" />
                  <span className="font-mono text-xs text-silver-300">
                    enterprise_awr_report_0426.pdf
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  Ready
                </span>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-silver-300">
                {findings.map((finding) => (
                  <li
                    key={finding}
                    className="rounded-lg border border-white/5 bg-navy-900/60 px-3 py-2"
                  >
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
