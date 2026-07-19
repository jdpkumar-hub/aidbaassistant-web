import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    // Step 1: Read the RAW request body
    const body = await request.text();

    // Step 2: Get Stripe signature from request headers
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe Signature" },
        { status: 400 }
      );
    }

    // Step 3: Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("======================================");
    console.log("✅ Stripe Webhook Verified Successfully");
    console.log("Event Type :", event.type);
    console.log("Event ID   :", event.id);
    console.log("======================================");

    // We will process events in the next step

    return NextResponse.json({
      success: true,
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error("❌ Webhook Verification Failed");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook signature verification failed",
      },
      { status: 400 }
    );
  }
}