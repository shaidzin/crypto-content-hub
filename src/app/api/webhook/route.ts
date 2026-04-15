import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const creditsToAdd = parseInt(session.metadata?.credits || "0", 10);

    if (userId && creditsToAdd > 0) {
      const supabase = createServiceClient();

      // Get current credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (profile) {
        // Add purchased credits
        await supabase
          .from("profiles")
          .update({ credits: profile.credits + creditsToAdd })
          .eq("id", userId);

        console.log(
          `Added ${creditsToAdd} credits to user ${userId} (session: ${session.id})`
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
