"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-navy-900/80 p-8 shadow-2xl shadow-black/40">
        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-sm font-bold">
            AI
          </div>
          <h1 className="mt-5 text-2xl font-bold">AI DBA Assistant</h1>
          <p className="mt-2 text-sm text-silver-400">
            Sign in or create a verified account to access the SaaS dashboard.
          </p>
        </div>
        <AuthPanel />
      </div>
    </div>
  );
}