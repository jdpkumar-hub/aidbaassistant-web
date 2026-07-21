import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ authenticated: false });
  }

  const { data } = await supabase
    .from("users_meta")
    .select("profile_completed")
    .eq("email", session.user.email)
    .single();

  return NextResponse.json({
    authenticated: true,
    profileCompleted: data?.profile_completed ?? false,
  });
}