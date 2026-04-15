"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins } from "lucide-react";
import { CREDIT_PACKAGES } from "@/lib/credits";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaywallModal({ open, onOpenChange }: PaywallModalProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Buy Credits
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;re out of credits. Top up to keep repurposing your content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 mt-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handleCheckout(pkg.id)}
              disabled={loading !== null}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-secondary/50 ${
                pkg.badge === "Best Value"
                  ? "border-primary/50"
                  : "border-border/50"
              } ${loading === pkg.id ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-yellow-400" />
                <div className="text-left">
                  <div className="font-medium flex items-center gap-2">
                    {pkg.label}
                    {pkg.badge && (
                      <Badge variant={pkg.badge === "Best Value" ? "default" : "secondary"} className="text-xs">
                        {pkg.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${(pkg.price / pkg.credits / 100).toFixed(2)}/credit
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {loading === pkg.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="font-bold text-lg">{pkg.priceLabel}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
