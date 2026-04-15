"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { OutputDisplay } from "@/components/output-display";
import { PaywallModal } from "@/components/paywall-modal";
import { AuthModal } from "@/components/auth-modal";
import type { PlatformOutputs } from "@/types";
import type { User } from "@supabase/supabase-js";
import { Sparkles, Loader2, Coins, ClipboardPaste, PenLine, Link } from "lucide-react";

type Mode = "article" | "topic" | "url";

const modes = [
  { id: "article" as Mode, label: "Paste Article", icon: ClipboardPaste, description: "Repurpose existing content" },
  { id: "topic" as Mode, label: "Write From Topic", icon: PenLine, description: "Generate from a prompt" },
  { id: "url" as Mode, label: "From URL", icon: Link, description: "Import from a link" },
];

interface RepurposeFormProps {
  user: User | null;
  initialCredits: number;
}

export function RepurposeForm({ user, initialCredits }: RepurposeFormProps) {
  const [mode, setMode] = useState<Mode>("article");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [outputs, setOutputs] = useState<PlatformOutputs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [credits, setCredits] = useState(initialCredits);

  useEffect(() => {
    setCredits(initialCredits);
  }, [initialCredits]);

  const handleExtractUrl = async () => {
    if (!url) return;
    setError(null);
    setIsExtracting(true);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setText(data.text);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to extract content.";
      setError(message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!user) {
      setShowAuth(true);
      return;
    }

    if (credits < 1) {
      setShowPaywall(true);
      return;
    }

    // Validate based on mode
    if (mode === "article" && text.length < 100) {
      setError("Please paste at least 100 characters of content.");
      return;
    }
    if (mode === "topic" && text.length < 10) {
      setError("Please describe what you want to write about (at least 10 characters).");
      return;
    }
    if (mode === "url" && text.length < 100) {
      setError("Please extract content from a URL first, or switch to Paste Article mode.");
      return;
    }

    setIsGenerating(true);
    setOutputs(null);

    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, url }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) { setShowPaywall(true); return; }
        if (response.status === 401) { setShowAuth(true); return; }
        throw new Error(data.error || "Failed to generate content.");
      }

      setOutputs(data.outputs);
      if (typeof data.creditsRemaining === "number") {
        setCredits(data.creditsRemaining);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const charCount = text.length;
  const isValid =
    mode === "topic" ? charCount >= 10 && charCount <= 2000 :
    charCount >= 100 && charCount <= 10000;

  const placeholder =
    mode === "article"
      ? "Paste your blog post, article, or long-form content here (minimum 100 characters)..."
      : mode === "topic"
      ? 'Describe what you want to write about, e.g. "5 reasons remote work is the future of productivity"...'
      : "Content extracted from URL will appear here...";

  const charLimit = mode === "topic" ? 2000 : 10000;
  const charMin = mode === "topic" ? 10 : 100;

  return (
    <section id="repurpose" className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Create Your Content
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Choose your input method and let AI create 7 platform-ready posts.
        </p>

        {/* Mode selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setError(null); setOutputs(null); }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center ${
                mode === m.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 hover:border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <m.icon className="w-5 h-5" />
              <span className="text-xs sm:text-sm font-medium">{m.label}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{m.description}</span>
            </button>
          ))}
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            {/* URL input for URL mode */}
            {mode === "url" && (
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/blog-post"
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isExtracting || isGenerating}
                />
                <Button
                  onClick={handleExtractUrl}
                  disabled={isExtracting || !url || isGenerating}
                  variant="outline"
                  className="shrink-0"
                >
                  {isExtracting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Extract"
                  )}
                </Button>
              </div>
            )}

            <Textarea
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`text-base bg-background/50 resize-y ${
                mode === "topic" ? "min-h-[120px]" : "min-h-[200px]"
              }`}
              disabled={isGenerating}
            />

            <div className="flex items-center justify-between mt-3">
              <span
                className={`text-sm ${
                  charCount > 0 && charCount < charMin
                    ? "text-red-400"
                    : charCount > charLimit
                    ? "text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {charCount.toLocaleString()} / {charLimit.toLocaleString()} characters
                {charCount > 0 && charCount < charMin && ` (minimum ${charMin})`}
              </span>
              {user && (
                <span className="flex items-center gap-1.5 text-sm">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className={credits > 0 ? "text-yellow-400" : "text-red-400"}>
                    {credits} credit{credits !== 1 ? "s" : ""}
                  </span>
                </span>
              )}
              {!user && (
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Sign in for 3 free credits
                </button>
              )}
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isGenerating || !isValid}
              className="w-full mt-4 text-base py-6 gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating 7 posts...
                </>
              ) : !user ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Sign In & Generate (3 Free Credits)
                </>
              ) : mode === "topic" ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate 7 Posts (1 Credit)
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Repurpose Into 7 Posts (1 Credit)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

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

        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
        <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
      </div>
    </section>
  );
}
