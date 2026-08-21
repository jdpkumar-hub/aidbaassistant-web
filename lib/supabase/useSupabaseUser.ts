"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface UseSupabaseUserResult {
  user: User | null;
  status: AuthStatus;
}

/**
 * Drop-in replacement for next-auth's useSession() for client components.
 * Returns { user, status } instead of { data: session, status } —
 * everywhere the old code read `session?.user?.x`, read `user?.x` instead.
 */
export function useSupabaseUser(): UseSupabaseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setUser(data.user ?? null);
      setStatus(data.user ? "authenticated" : "unauthenticated");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setStatus(session?.user ? "authenticated" : "unauthenticated");
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, status };
}

/**
 * NextAuth's session.user.name had no fixed source; Supabase stores the
 * equivalent under user_metadata with a provider-dependent key. This checks
 * every key providers actually use (email/password signUp in this app sets
 * full_name; Google sets full_name/name; GitHub sets user_name/full_name).
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Account";
  const meta = user.user_metadata ?? {};
  return (
    meta.full_name ?? meta.name ?? meta.user_name ?? user.email ?? "Account"
  );
}

export function getUserAvatarUrl(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  return meta.avatar_url ?? meta.picture ?? null;
}
