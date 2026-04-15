import { getStripe } from "@/lib/stripe";
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

  let plan = "starter";
  let email = "";

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    plan = session.metadata?.plan || "starter";
    email = session.customer_details?.email || "";
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

  return <SuccessClient plan={plan} email={email} />;
}
