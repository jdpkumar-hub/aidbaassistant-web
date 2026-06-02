import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "AI DBA Assistant cut our AWR review cycle from 4 hours to under 20 minutes. The SQL tuning priorities were immediately actionable.",
    name: "Senior Oracle DBA",
    company: "Global Banking Group",
  },
  {
    quote:
      "As a consulting team, we now deliver faster diagnostics and clearer executive summaries. It has become part of every health-check engagement.",
    name: "Principal Oracle Consultant",
    company: "Enterprise Performance Advisory",
  },
  {
    quote:
      "The health check view helps IT leadership understand risk without reading raw AWR outputs. It improved cross-team decision making significantly.",
    name: "Director of Infrastructure",
    company: "Fortune 500 Manufacturing",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative border-t border-white/10 bg-navy-900/30 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Customer Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by Oracle teams in production
          </h2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name + item.company}
              className="rounded-2xl border border-white/10 bg-navy-900/60 p-8"
            >
              <Quote className="h-6 w-6 text-accent" />
              <p className="mt-4 leading-relaxed text-silver-300">{item.quote}</p>
              <p className="mt-6 text-sm font-semibold text-white">{item.name}</p>
              <p className="text-sm text-silver-400">{item.company}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
