"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { X } from "lucide-react";

type AuthTab = "login" | "signup" | "reset";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({
  open,
  onClose,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold text-white">
                AI DBA Assistant
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Enterprise Oracle Performance Intelligence
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                activeTab === "login"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                activeTab === "signup"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Signup
            </button>

            <button
              onClick={() => setActiveTab("reset")}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                activeTab === "reset"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Reset Password
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === "login" && <LoginForm />}

            {activeTab === "signup" && <SignupForm />}

            {activeTab === "reset" && <ResetPasswordForm />}
          </div>
        </div>
      </div>
    </>
  );
}