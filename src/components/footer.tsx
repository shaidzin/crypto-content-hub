import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-semibold">ContentSpark</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ContentSpark. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
