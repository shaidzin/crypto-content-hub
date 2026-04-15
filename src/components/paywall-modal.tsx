"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaywallModal({ open, onOpenChange }: PaywallModalProps) {
  const [loading, setLoading] = useState<"starter" | "lifetime" | null>(null);

  const handleCheckout = async (plan: "starter" | "lifetime") => {
    setLoading(plan);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(null);
    }
  };

  const features = [
    "All 5 platforms (Twitter, LinkedIn, Instagram, Email, Reddit)",
    "AI-powered content optimization",
    "One-click copy for each platform",
    "Instant generation (under 10 seconds)",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Unlock Unlimited Repurposing
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ve used your 2 free repurposes. Upgrade to keep creating
            content effortlessly.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          {/* Starter */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Starter</span>
                <span className="text-2xl font-bold">$9</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                100 repurposes, one-time payment
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleCheckout("starter")}
                disabled={loading !== null}
                className="w-full"
                variant="outline"
              >
                {loading === "starter" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Get Starter"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Lifetime */}
          <Card className="border-primary/50 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Best Value
            </Badge>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Lifetime</span>
                <span className="text-2xl font-bold">$19</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Unlimited repurposes, forever
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleCheckout("lifetime")}
                disabled={loading !== null}
                className="w-full"
              >
                {loading === "lifetime" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Get Lifetime Access"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 space-y-2">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
