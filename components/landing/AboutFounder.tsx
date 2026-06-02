import { Link2, Mail } from "lucide-react";

export function AboutFounder() {
  return (
    <section id="about" className="relative border-t border-white/10 bg-navy-900/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-700 shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-silver-400/30 bg-navy-900 text-3xl font-bold text-silver-300">
                  JD
                </div>
                <p className="mt-6 text-sm font-medium uppercase tracking-wider text-silver-400">
                  Founder & Lead Architect
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  Oracle Performance Specialist
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-accent/20 bg-accent/5" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              About the Founder
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built by practitioners who live in AWRs
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-silver-400">
              <p>
                AI DBA Assistant was founded by a senior Oracle DBA with over
                fifteen years of experience tuning mission-critical databases
                for finance, healthcare, and government enterprises.
              </p>
              <p>
                After spending thousands of hours parsing AWR reports manually,
                the mission became clear: give every DBA and consultant the
                same depth of analysis—faster, consistently, and explainable
                enough to present to leadership.
              </p>
              <p>
                Today, the platform combines Oracle domain expertise with modern
                AI to help teams move from reactive firefighting to proactive
                performance management.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href="mailto:hello@aidbaassistant.com"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-silver-300 transition-colors hover:border-accent/40 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-silver-300 transition-colors hover:border-accent/40 hover:text-white"
                aria-label="LinkedIn profile"
              >
                <Link2 className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
