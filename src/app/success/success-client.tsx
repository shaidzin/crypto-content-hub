"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setLicense } from "@/lib/usage";
import { CheckCircle2, Sparkles } from "lucide-react";

interface SuccessClientProps {
  plan: string;
  email: string;
}

export function SuccessClient({ plan, email }: SuccessClientProps) {
  useEffect(() => {
    setLicense({
      email,
      plan: plan as "starter" | "lifetime",
      purchasedAt: new Date().toISOString(),
    });
  }, [email, plan]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-green-500/30">
        <CardContent className="pt-8 pb-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            You now have{" "}
            <span className="text-foreground font-semibold">
              {plan === "lifetime" ? "unlimited" : "100"}
            </span>{" "}
            repurposes. Start creating amazing content across every platform.
          </p>

          <Button size="lg" className="gap-2" asChild>
            <a href="/#repurpose">
              <Sparkles className="w-5 h-5" />
              Start Repurposing
            </a>
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            A receipt has been sent to {email || "your email"}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
