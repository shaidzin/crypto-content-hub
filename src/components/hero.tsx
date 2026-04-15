import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-6 text-sm px-4 py-1">
          AI-Powered Content Repurposing
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
          One Blog Post.
          <br />7 Platforms.
          <br />10 Seconds.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Paste any article and get ready-to-publish content for Twitter/X,
          LinkedIn, Instagram, TikTok, YouTube, Email, and Reddit — instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <a href="#repurpose">Get 7 Posts in 10 Seconds</a>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
            <a href="#demo">See Example</a>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          3 free credits on signup. No subscription — credits start at $1.
        </p>
      </div>
    </section>
  );
}
