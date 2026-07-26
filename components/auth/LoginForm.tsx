"use client";

import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  return (
    <div className="space-y-6">

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Password
        </label>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <button
        type="button"
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Login
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-700" />

        <span className="text-sm text-slate-500">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-700" />
      </div>

      {/* Google */}
      <button
        type="button"
        className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800 py-3 text-white transition hover:bg-slate-700"
      >
        Continue with Google
      </button>

      {/* GitHub */}
      <button
        type="button"
        className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800 py-3 text-white transition hover:bg-slate-700"
      >
        Continue with GitHub
      </button>

    </div>
  );
}