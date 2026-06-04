import { DemoReport } from "@/components/landing/DemoReport";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Testimonials } from "@/components/landing/Testimonials";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-950 text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <DemoReport />
        <Testimonials />
        <section className="border-t border-white/10 bg-navy-900/30 py-20">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to optimize your Oracle environment?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-silver-400">
              Start analyzing AWR reports or explore plans built for DBAs and
              enterprise teams.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/analyze"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Start Free Analysis
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View Pricing
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
