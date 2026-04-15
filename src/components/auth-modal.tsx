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
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send magic link";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSent(false);
      setEmail("");
      setError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-center">Check Your Email</DialogTitle>
              <DialogDescription className="text-center">
                We sent a magic link to <strong>{email}</strong>. Click the link
                to sign in and get your 3 free credits.
              </DialogDescription>
            </DialogHeader>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sign in to ContentSpark</DialogTitle>
              <DialogDescription>
                Enter your email and we&apos;ll send you a magic link. No
                password needed. Get 3 free credits on signup.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <Button type="submit" disabled={loading || !email} className="w-full gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Send Magic Link
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
