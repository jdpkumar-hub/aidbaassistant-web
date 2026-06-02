import { Activity, Database, Gauge } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Oracle AWR Analysis",
    description:
      "Upload AWR snapshots and get instant summaries of wait events, top SQL, and system bottlenecks—without hours of manual review.",
  },
  {
    icon: Database,
    title: "SQL Tuning Assistant",
    description:
      "AI-ranked tuning recommendations with execution plan context, helping you prioritize fixes that deliver the biggest performance gains.",
  },
  {
    icon: Gauge,
    title: "Database Health Check",
    description:
      "Holistic view of capacity, memory, I/O, and session risk—packaged for DBAs and executive stakeholders in one clear report.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative border-t border-white/10 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need for Oracle performance
          </h2>
          <p className="mt-4 text-lg text-silver-400">
            Enterprise-grade intelligence designed for the way Oracle teams
            actually work.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-navy-900/50 p-8 transition-all hover:border-accent/40 hover:bg-navy-900/80 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-silver-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
