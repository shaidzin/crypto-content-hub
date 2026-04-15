"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { OutputDisplay } from "@/components/output-display";
import { PaywallModal } from "@/components/paywall-modal";
import { canGenerate, incrementUsage, getRemainingFreeUses, isPaidUser } from "@/lib/usage";
import type { PlatformOutputs } from "@/types";
import { Sparkles, Loader2 } from "lucide-react";

export function RepurposeForm() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<PlatformOutputs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [remainingFree, setRemainingFree] = useState(2);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setRemainingFree(getRemainingFreeUses());
    setPaid(isPaidUser());
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (!canGenerate()) {
      setShowPaywall(true);
      return;
    }

    if (text.length < 100) {
      setError("Please paste at least 100 characters of content.");
      return;
    }

    setIsGenerating(true);
    setOutputs(null);

    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content.");
      }

      setOutputs(data.outputs);

      if (!isPaidUser()) {
        incrementUsage();
        setRemainingFree(getRemainingFreeUses());
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const charCount = text.length;
  const isValidLength = charCount >= 100 && charCount <= 10000;

  return (
    <section id="repurpose" className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Repurpose Your Content
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Paste your blog post or article below and let AI do the rest.
        </p>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <Textarea
              placeholder="Paste your blog post, article, or long-form content here (minimum 100 characters)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] text-base bg-background/50 resize-y"
              disabled={isGenerating}
            />

            <div className="flex items-center justify-between mt-3">
              <span
                className={`text-sm ${
                  charCount > 0 && charCount < 100
                    ? "text-red-400"
                    : charCount > 10000
                    ? "text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {charCount.toLocaleString()} / 10,000 characters
                {charCount > 0 && charCount < 100 && " (minimum 100)"}
              </span>
              {!paid && (
                <span className="text-sm text-muted-foreground">
                  {remainingFree} free {remainingFree === 1 ? "use" : "uses"} remaining
                </span>
              )}
              {paid && (
                <span className="text-sm text-green-400">Pro access</span>
              )}
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isGenerating || !isValidLength}
              className="w-full mt-4 text-base py-6 gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating content...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Repurpose Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading skeleton */}
        {isGenerating && (
          <div className="mt-8 space-y-4">
            <div className="h-8 bg-secondary/50 rounded animate-pulse w-48" />
            <div className="h-10 bg-secondary/50 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-secondary/50 rounded animate-pulse"
                  style={{ width: `${100 - i * 10}%` }}
                />
              ))}
            </div>
          </div>
        )}

        {outputs && !isGenerating && <OutputDisplay outputs={outputs} />}

        <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
      </div>
    </section>
  );
}
