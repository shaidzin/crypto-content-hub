"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Coins } from "lucide-react";

interface SuccessClientProps {
  creditsAdded: number;
}

export function SuccessClient({ creditsAdded }: SuccessClientProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-green-500/30">
        <CardContent className="pt-8 pb-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-semibold text-yellow-400">
              +{creditsAdded} credits added
            </span>
          </div>
          <p className="text-muted-foreground mb-6">
            Your credits are ready. Start repurposing your content across every
            platform.
          </p>

          <Button size="lg" className="gap-2" asChild>
            <a href="/#repurpose">
              <Sparkles className="w-5 h-5" />
              Start Repurposing
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
