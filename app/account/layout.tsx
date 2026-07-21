"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Database, User } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-navy-950 text-white">

      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-navy-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <Database className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                AI DBA Assistant
              </h1>

              <p className="text-xs text-silver-400">
                Enterprise Oracle Performance Intelligence
              </p>
            </div>

          </Link>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-800 px-4 py-2">

            <User className="h-5 w-5 text-accent" />

            <div>

              <div className="text-sm font-semibold">
                {session?.user?.name}
              </div>

              <div className="text-xs text-silver-400">
                {session?.user?.email}
              </div>

            </div>

          </div>

        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl gap-8 px-8 py-10 lg:grid-cols-3">

        {/* Left */}

        <div className="lg:col-span-2">

          {children}

        </div>

        {/* Right */}

        <aside>

          <div className="sticky top-24 rounded-2xl border border-white/10 bg-navy-900 p-8">

            <h2 className="text-2xl font-bold">
              Your Trial Includes
            </h2>

            <div className="mt-8 space-y-4">

              <div>✅ AI AWR Analyzer</div>

              <div>✅ SQL Tuning Assistant</div>

              <div>✅ Executive Dashboard</div>

              <div>✅ Health Score Engine</div>

              <div>✅ Bottleneck Detection</div>

              <div>✅ PDF Report Generator</div>

            </div>

            <div className="mt-10 rounded-xl bg-accent/10 p-5">

              <div className="text-sm text-accent">
                Estimated setup time
              </div>

              <div className="mt-2 text-3xl font-bold">
                2 Minutes
              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}