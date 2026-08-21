"use client";

import { type ReactNode } from "react";
import { Navbar } from "@/components/landing/Navbar";
import AuthBrandPanel from "./AuthBrandPanel";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-navy-950 text-foreground">
      <Navbar />

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="pointer-events-none fixed -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl pt-16 lg:grid-cols-2">
        <div className="hidden items-center justify-center border-r border-white/10 px-8 py-12 lg:flex xl:px-12">
          <div className="w-full max-w-md">
            <AuthBrandPanel />
          </div>
        </div>

        <div className="flex items-center justify-center px-8 py-12 xl:px-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 mb-8 text-base leading-relaxed text-silver-400">
              {subtitle}
            </p>

            <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
