"use client";
import { Loader2, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: AuthModalProps) {
  const router = useRouter();
  const { status } = useSession();
  const [provider, setProvider] = useState<"google" | "github" | null>(null);

  useEffect(() => {
    if (open && status === "authenticated") {
      onClose();
      router.push("/dashboard");
    }
  }, [open, status, onClose, router]);

  if (!open) return null;

  async function handleLogin(selectedProvider: "google" | "github") {
    setProvider(selectedProvider);
    await signIn(selectedProvider, { callbackUrl: "/dashboard" });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-navy-900 p-8 shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-silver-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close authentication modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
          AI
        </div>
        <h2 id="auth-modal-title" className="mt-6 text-2xl font-bold text-white">
          Sign in to continue
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-silver-400">
          Access the AWR analysis console and dashboard with your preferred
          account.
        </p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => handleLogin("google")}
            disabled={provider !== null}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-silver-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {provider === "google" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="text-base font-bold text-blue-600">G</span>
            )}
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleLogin("github")}
            disabled={provider !== null}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-navy-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {provider === "github" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span>GH</span>
            )}
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
