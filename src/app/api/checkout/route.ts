import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan } = body;

    if (!plan || !["starter", "lifetime"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected." },
        { status: 400 }
      );
    }

    const priceId =
      plan === "starter"
        ? process.env.STRIPE_PRICE_ID_STARTER
        : process.env.STRIPE_PRICE_ID_LIFETIME;

    if (!priceId) {
      console.error(`Missing price ID for plan: ${plan}`);
      return NextResponse.json(
        { error: "Payment configuration error. Please try again later." },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#pricing`,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
