"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function Contact({ standalone = false }: { standalone?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className={`relative py-24 lg:py-32 ${
        standalone ? "" : "border-t border-white/10"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to analyze your first AWR?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-silver-400">
              Reach out for a demo, enterprise pricing, or partnership inquiries.
              We typically respond within one business day.
            </p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-sm font-medium text-silver-400">Email</dt>
                <dd className="mt-1">
                  <a
                    href="mailto:hello@aidbaassistant.com"
                    className="text-white hover:text-accent"
                  >
                    hello@aidbaassistant.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-silver-400">
                  Enterprise sales
                </dt>
                <dd className="mt-1">
                  <a
                    href="mailto:sales@aidbaassistant.com"
                    className="text-white hover:text-accent"
                  >
                    sales@aidbaassistant.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-8 lg:p-10">
            {submitted ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <p className="text-lg font-semibold text-white">
                  Thank you for reaching out
                </p>
                <p className="mt-2 text-silver-400">
                  We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-silver-300"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-2 w-full rounded-lg border border-white/10 bg-navy-950 px-4 py-3 text-white placeholder:text-silver-400/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-silver-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-lg border border-white/10 bg-navy-950 px-4 py-3 text-white placeholder:text-silver-400/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-silver-300"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-navy-950 px-4 py-3 text-white placeholder:text-silver-400/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Your organization"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-silver-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-navy-950 px-4 py-3 text-white placeholder:text-silver-400/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Tell us about your Oracle environment..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:w-auto sm:px-8"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
