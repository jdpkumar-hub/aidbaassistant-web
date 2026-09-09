import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { FunArcade } from "@/components/fun/FunArcade";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Fun Zone | AI DBA Assistant",
  description:
    "Take a break from tuning Oracle databases and play a few quick browser mini-games.",
};

export default function FunPage() {
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

      <div className="mx-auto max-w-4xl px-6 pt-14 pb-6 text-center lg:px-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Gamepad2 className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Fun Zone</h1>
        <p className="mx-auto mt-3 max-w-2xl text-silver-400">
          Long-running query? Take a breather and challenge yourself with a few
          quick mini-games. No login required - just pick one and play.
        </p>
      </div>

      <FunArcade />
    </SiteShell>
  );
}
