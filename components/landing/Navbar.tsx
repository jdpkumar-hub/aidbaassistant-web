"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/landing/AuthModal";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#demo", label: "Demo" },
  { href: "/#pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const authenticated = status === "authenticated";
  const user = session?.user;
  const userName = user?.name ?? user?.email ?? "Account";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleProtectedNavigation(href: string) {
    setOpen(false);
    setUserMenuOpen(false);
    if (!authenticated) {
      setAuthModalOpen(true);
      return;
    }
    router.push(href);
  }

async function handleLogout() {
  sessionStorage.setItem("loggingOut", "true");
  setOpen(false);
  setUserMenuOpen(false);
  sessionStorage.removeItem("lastAnalysisId");
  await signOut({
    redirect: false,
  });
  window.location.href = "/";
}

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-navy-900/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
				<Image
				  src="/logo6.png"
				  alt="AI DBA Assistant"
				  width={60}
				  height={60}
				  priority
				/>
			    
            <span className="hidden sm:inline">AI DBA Assistant</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-silver-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {authenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => handleProtectedNavigation("/analyze")}
                  className="text-sm text-silver-400 transition-colors hover:text-white"
                >
                  Analyze
                </button>
                <button
                  type="button"
                  onClick={() => handleProtectedNavigation("/dashboard")}
                  className="text-sm text-silver-400 transition-colors hover:text-white"
                >
                  Dashboard
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((current) => !current)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:bg-white/10"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                  >
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt=""
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full border border-white/20"
                      />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        {initials}
                      </span>
                    )}
                    <span className="max-w-32 truncate">{userName}</span>
                    <ChevronDown className="h-4 w-4 text-silver-400" />
                  </button>
                  {userMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-navy-900 p-2 shadow-2xl shadow-black/40"
                    >
                      <button
                        type="button"
                        onClick={() => handleProtectedNavigation("/dashboard")}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-silver-300 hover:bg-white/5 hover:text-white"
                      >
                        Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProtectedNavigation("/analyze")}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-silver-300 hover:bg-white/5 hover:text-white"
                      >
                        Analyze Report
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProtectedNavigation("/dashboard")}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-silver-300 hover:bg-white/5 hover:text-white"
                      >
                        Account
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-silver-400 transition-colors hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="text-sm text-silver-400 transition-colors hover:text-white"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleProtectedNavigation("/analyze")}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover"
                >
                  Start Free Analysis
                </button>
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
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {authenticated ? (
                <>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2.5 text-left text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => handleProtectedNavigation("/analyze")}
                  >
                    Analyze
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2.5 text-left text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => handleProtectedNavigation("/dashboard")}
                  >
                    Dashboard
                  </button>
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full border border-white/20"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        {initials}
                      </span>
                    )}
                    <span className="truncate">{userName}</span>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2.5 text-left text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => handleProtectedNavigation("/dashboard")}
                  >
                    Account
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2.5 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2.5 text-left text-sm text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => {
                      setOpen(false);
                      setAuthModalOpen(true);
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-white"
                    onClick={() => handleProtectedNavigation("/analyze")}
                  >
                    Start Free Analysis
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
