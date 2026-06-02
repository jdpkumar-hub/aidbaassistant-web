import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AboutFounder } from "@/components/landing/AboutFounder";
import { SiteShell } from "@/components/layout/SiteShell";

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="border-b border-white/10 bg-navy-900/30 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
      <AboutFounder standalone />
    </SiteShell>
  );
}
