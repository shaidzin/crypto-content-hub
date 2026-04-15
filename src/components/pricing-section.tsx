"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, Check } from "lucide-react";
import { CREDIT_PACKAGES } from "@/lib/credits";

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (packageId: string) => {
    setLoading(packageId);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Simple Credit Pricing
        </h2>
        <p className="text-muted-foreground text-center mb-4 max-w-xl mx-auto">
          Pay only for what you use. 1 credit = 1 repurpose into 7 platforms.
          Starting at just $1.
        </p>
        <p className="text-sm text-center text-green-400 mb-12">
          Sign up free and get 3 credits to try it out!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative ${
                pkg.badge === "Best Value"
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border/50"
              }`}
            >
              {pkg.badge && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  variant={pkg.badge === "Best Value" ? "default" : "secondary"}
                >
                  {pkg.badge}
                </Badge>
              )}
              <CardContent className="pt-8 pb-6 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{pkg.priceLabel}</div>
                <div className="text-lg font-medium mb-1">{pkg.credits} Credits</div>
                <div className="text-xs text-muted-foreground mb-4">
                  ${(pkg.price / pkg.credits / 100).toFixed(2)} per repurpose
                </div>
                <Button
                  onClick={() => handleCheckout(pkg.id)}
                  disabled={loading !== null}
                  variant={pkg.badge === "Best Value" ? "default" : "outline"}
                  className="w-full"
                >
                  {loading === pkg.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Buy Credits"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-md mx-auto space-y-2">
          {[
            "1 credit = 1 repurpose into 7 platforms",
            "Credits never expire",
            "No subscription — buy only when you need",
            "7-day money-back guarantee",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
