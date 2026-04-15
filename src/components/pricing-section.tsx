"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";

const plans = [
  {
    id: "starter" as const,
    name: "Starter",
    price: "$9",
    description: "100 repurposes",
    features: [
      "100 content repurposes",
      "All 5 platforms",
      "AI-optimized for each platform",
      "One-click copy",
      "No expiration",
    ],
    popular: false,
  },
  {
    id: "lifetime" as const,
    name: "Lifetime",
    price: "$19",
    description: "Unlimited forever",
    features: [
      "Unlimited repurposes",
      "All 5 platforms",
      "AI-optimized for each platform",
      "One-click copy",
      "Lifetime access, no recurring fees",
    ],
    popular: true,
  },
];

export function PricingSection() {
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
        throw new Error(data.error);
      }

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
          Simple, One-Time Pricing
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          No subscriptions. No hidden fees. Pay once and start repurposing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">one-time</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading !== null}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {loading === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Get ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
}
