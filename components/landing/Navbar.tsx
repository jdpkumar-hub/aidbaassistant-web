"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { AuthRequiredLink } from "@/components/auth/AuthRequiredLink";
import { useAuthModal } from "@/components/auth/AuthProvider";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#demo", label: "Demo" },
  { href: "/#pricing", label: "Pricing" },
];

const authenticatedLinks = [
  ...publicLinks,
  { href: "/analyze", label: "Analyze" },
  { href: "/dashboard", label: "Dashboard" },
];

const userMenuLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analyze", label: "Analyze Report" },
  { href: "/account", label: "Account" },
];

function UserAvatar({
  image,
  initial,
  className,
}: {
  image?: string | null;
  initial: string;
  className: string;
}) {
  if (image) {
    return (
      <span
        className={`${className} bg-cover bg-center`}
        style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={`${className} bg-accent text-xs font-bold text-white`}>
      {initial}
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthModal();

  const isAuthenticated = status === "authenticated";
  const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;
  const userName = session?.user?.name ?? session?.user?.email ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    sessionStorage.removeItem("lastAnalysisId");
    setOpen(false);
    setUserMenuOpen(false);
    void signOut({ callbackUrl: "/" });
  };

  const handleOpenAuthModal = () => {
    setOpen(false);
    openAuthModal();
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-navy-900/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold tracking-tight">
            AI
          </span>
          <span className="hidden sm:inline">AI DBA Assistant</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-silver-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <UserAvatar
                    image={session?.user?.image}
                    initial={userInitial}
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                  />
                  <span className="max-w-32 truncate text-silver-300">{userName}</span>
                  <ChevronDown className="h-4 w-4 text-silver-400" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-navy-900 p-2 shadow-xl shadow-black/30"
                    role="menu"
                  >
                    {userMenuLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-3 py-2 text-sm text-silver-300 transition-colors hover:bg-white/5 hover:text-white"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-silver-300 transition-colors hover:bg-white/5 hover:text-white"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="text-sm text-silver-400 transition-colors hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="text-sm text-silver-400 transition-colors hover:text-white"
                onClick={handleOpenAuthModal}
              >
                Login
              </button>
              <AuthRequiredLink
                href="/analyze"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover"
              >
                Start Free Analysis
              </AuthRequiredLink>
            </>
          )}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                  <UserAvatar
                    image={session?.user?.image}
                    initial={userInitial}
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-silver-400">Signed in</p>
                  </div>
                </div>
                {userMenuLinks.map((link) => (
                  <Link
                    key={`mobile-${link.href}`}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2.5 text-left text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={handleOpenAuthModal}
                >
                  Login
                </button>
                <AuthRequiredLink
                  href="/analyze"
                  className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-white"
                  onClick={() => setOpen(false)}
                >
                  Start Free Analysis
                </AuthRequiredLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
