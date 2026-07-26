import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    const { error } = await supabaseAdmin
      .from("customers")
      .insert({
        lead_id: body.id,
        name: body.name,
        email: body.email,
        company: body.company,
        phone: body.phone,
      });

    if (error) throw error;

    await supabaseAdmin
      .from("crm_leads")
      .update({
        status: "Converted",
      })
      .eq("id", body.id);

    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }
}