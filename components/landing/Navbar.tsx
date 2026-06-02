"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-navy-900/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5 font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold tracking-tight">
            AI
          </span>
          <span className="hidden sm:inline">AI DBA Assistant</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-silver-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover"
          >
            Start Analysis
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-silver-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-navy-900/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Start Analysis
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
