"use client";

import { useEffect, useState } from "react";
import { Github, Loader2, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: AuthModalProps) {
  const router = useRouter();
  const { status } = useSession();
  const [pendingProvider, setPendingProvider] = useState<"google" | "github" | null>(
    null,
  );

  useEffect(() => {
    if (open && status === "authenticated") {
      onClose();
      router.push("/dashboard");
    }
  }, [onClose, open, router, status]);

  useEffect(() => {
    if (!open) {
      setPendingProvider(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleProviderLogin = (provider: "google" | "github") => {
    setPendingProvider(provider);
    void signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close authentication modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-navy-900 p-6 text-white shadow-2xl shadow-black/50">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <button
            type="button"
            className="absolute right-0 top-0 rounded-lg p-2 text-silver-400 transition-colors hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label="Close authentication modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-sm font-bold tracking-tight">
            AI
          </div>
          <h2 id="auth-modal-title" className="mt-5 text-2xl font-bold">
            Sign in to continue
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-silver-400">
            Use your Google or GitHub account to start analyzing AWR reports and
            view your dashboard.
          </p>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-silver-300 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={pendingProvider !== null}
              onClick={() => handleProviderLogin("google")}
            >
              {pendingProvider === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-silver-400 text-xs font-bold text-accent">
                  G
                </span>
              )}
              Google Login
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={pendingProvider !== null}
              onClick={() => handleProviderLogin("github")}
            >
              {pendingProvider === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-5 w-5" />
              )}
              GitHub Login
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-silver-400">
            You will be redirected to your dashboard after authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
