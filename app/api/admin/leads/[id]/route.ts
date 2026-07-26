import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { error } = await supabaseAdmin
      .from("crm_leads")
		.update({
		  name: body.name,
		  email: body.email,
		  company: body.company,
		  phone: body.phone || null,
		  status: body.status,
		  priority: body.priority || "Normal",
		  notes: body.notes || null,
		  follow_up_date:
			body.follow_up_date && body.follow_up_date.trim() !== ""
			  ? body.follow_up_date
			  : null,
		})
      .eq("id", id);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );

  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("crm_leads")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }
}