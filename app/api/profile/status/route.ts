import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({
      authenticated: false,
      profileCompleted: false,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("users_meta")
    .select("profile_completed")
    .eq("email", session.user.email)
    .maybeSingle();

  if (error) {
    console.error(error);

    return NextResponse.json({
      authenticated: true,
      profileCompleted: false,
    });
  }

  return NextResponse.json({
    authenticated: true,
    profileCompleted: data?.profile_completed ?? false,
  });
}