import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPackageById } from "@/lib/credits";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { packageId } = body;

    const creditPackage = getPackageById(packageId);
    if (!creditPackage) {
      return NextResponse.json(
        { error: "Invalid package selected." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ContentSpark - ${creditPackage.label}`,
              description: `${creditPackage.credits} content repurpose credits`,
            },
            unit_amount: creditPackage.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#pricing`,
      metadata: {
        userId: user.id,
        packageId: creditPackage.id,
        credits: String(creditPackage.credits),
      },
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
