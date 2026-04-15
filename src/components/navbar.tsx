"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { Sparkles, Coins, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  user: User | null;
  credits: number;
}

export function Navbar({ user, credits }: NavbarProps) {
  const [showAuth, setShowAuth] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="w-5 h-5 text-primary" />
          ContentSpark
        </a>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-1.5 text-sm">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">{credits}</span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setShowAuth(true)}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </nav>
  );
}
