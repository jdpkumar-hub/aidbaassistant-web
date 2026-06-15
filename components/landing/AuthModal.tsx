"use client";

import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: AuthModalProps) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (open && status === "authenticated") {
      onClose();
      router.push("/dashboard");
    }
  }, [open, status, onClose, router]);

  if (!open) return null;

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
        <div className="mt-8 max-h-[70vh] overflow-y-auto pr-1">
          <AuthPanel />
        </div>
      </div>
    </div>
  );
}
