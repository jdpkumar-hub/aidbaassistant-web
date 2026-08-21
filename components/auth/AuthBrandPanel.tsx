import { Activity, Database, Gauge } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Oracle AWR Analysis",
    description: "AI-driven waits, SQL, and bottleneck analysis from AWR reports.",
  },
  {
    icon: Database,
    title: "SQL Tuning Assistant",
    description: "Optimization recommendations for expensive SQL statements.",
  },
  {
    icon: Gauge,
    title: "Database Health Check",
    description: "Surface performance risks before they hit production.",
  },
];

export default function AuthBrandPanel() {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-[90px]" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-silver-300 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Enterprise Oracle Performance Intelligence
        </div>

        <h2 className="mt-8 text-3xl font-bold tracking-tight text-white lg:text-4xl lg:leading-[1.15]">
          Analyze Oracle AWR Reports in Minutes
        </h2>

        <p className="mt-5 text-base leading-relaxed text-silver-400">
          AI-powered diagnostics for Oracle performance analysis. Turn complex
          AWR data into actionable insights your team can trust.
        </p>

        <div className="mt-10 space-y-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-navy-900/50 p-4 transition-all hover:border-accent/40 hover:bg-navy-900/80"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-silver-400">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-silver-400">
          Built for Oracle DBAs · Consultants · Enterprise IT Teams
        </p>
      </div>
    </div>
  );
}
