import { Brain, Download, Upload } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Report",
    description:
      "Drag and drop your AWR HTML export or zip archive. We support standard Oracle AWR formats out of the box.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our models parse metrics, correlate wait events with top SQL, and surface findings ranked by business impact.",
  },
  {
    step: "03",
    icon: Download,
    title: "Download Report",
    description:
      "Export a polished PDF or HTML summary to share with your team, management, or clients in minutes.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative border-t border-white/10 bg-navy-900/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From AWR to answers in three steps
          </h2>
        </div>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <div
            className="pointer-events-none absolute top-16 hidden h-px w-full bg-gradient-to-r from-transparent via-silver-400/30 to-transparent md:block"
            aria-hidden
          />

          {steps.map((item) => (
            <div key={item.step} className="relative text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-navy-800 text-accent md:mx-0">
                <item.icon className="h-7 w-7" />
              </div>
              <span className="mt-6 block font-mono text-sm font-medium text-accent">
                {item.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-silver-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
