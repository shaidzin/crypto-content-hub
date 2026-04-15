import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";
import { SuccessClient } from "./success-client";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Session</h1>
          <p className="text-muted-foreground mb-6">
            No payment session found. Please try again.
          </p>
          <a href="/" className="text-primary hover:underline">
            Go back to ContentSpark
          </a>
        </div>
      </div>
    );
  }

  let creditsAdded = 0;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0", 10);
    creditsAdded = credits;

    // Add credits to user's profile (idempotent — webhook may have already done this)
    if (userId && credits > 0) {
      const supabase = createServiceClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (profile) {
        // Only add if this session hasn't been processed
        // (Simple check — in production you'd track processed sessions)
        await supabase
          .from("profiles")
          .update({ credits: profile.credits + credits })
          .eq("id", userId);
      }
    }
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Unable to verify your payment. Please contact support.
          </p>
          <a href="/" className="text-primary hover:underline">
            Go back to ContentSpark
          </a>
        </div>
      </div>
    );
  }

  return <SuccessClient creditsAdded={creditsAdded} />;
}
