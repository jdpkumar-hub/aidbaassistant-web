import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  let updateData: any = {
    updated_at: new Date().toISOString(),
  };

  switch (body.step) {
    case "profile":
      updateData = {
        ...updateData,
        phone: body.phone,
        country: body.country,
        timezone: body.timezone,
      };
      break;

    case "professional":
      updateData = {
        ...updateData,
        company_name: body.companyName,
        job_title: body.currentRole,
        years_experience: Number(body.yearsExperience),
      };
      break;

    case "oracle":
      updateData = {
        ...updateData,
        dba_skills: body.dbaSkills,
      };
      break;

    case "ai-preferences":
      updateData = {
        ...updateData,
        primary_database: "Oracle",
      };
      break;

    case "finish":
      updateData = {
        ...updateData,
        profile_completed: true,
      };
      break;

    default:
      return NextResponse.json(
        { error: "Invalid step" },
        { status: 400 }
      );
  }

  const { data, error } = await supabaseAdmin
    .from("users_meta")
    .update(updateData)
    .eq("email", session.user.email) 
	.select();
	console.log("STEP:", body.step);
	console.log("UPDATE:", updateData);
	console.log("UPDATED ROW:", data);
	console.log("ERROR:", error);
	
  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}