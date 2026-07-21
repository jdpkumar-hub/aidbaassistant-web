import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 * Uses the Service Role key so server routes can safely
 * insert/update users_meta regardless of RLS.
 * Never import this file into client components.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
