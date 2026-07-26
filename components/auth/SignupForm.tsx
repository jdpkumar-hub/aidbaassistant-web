"use client";

import { useState } from "react";
import { Mail, Lock, ShieldCheck } from "lucide-react";

export default function SignupForm() {
  const [otpSent, setOtpSent] = useState(false);

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
            placeholder="Create a password"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      {/* Send OTP */}
      {!otpSent && (
        <button
          type="button"
          onClick={() => setOtpSent(true)}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Send OTP
        </button>
      )}

      {/* OTP Section */}
      {otpSent && (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Verification Code
            </label>

            <div className="relative">
              <ShieldCheck
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Verify OTP
          </button>

          <button
            type="button"
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Account
          </button>
        </>
      )}

      {/* Information */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-sm text-slate-400">
        A verification code will be sent to your email address.
        Your account will be activated after OTP verification.
      </div>

    </div>
  );
}