import { Card, CardContent } from "@/components/ui/card";
import { ClipboardPaste, Sparkles, Send } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste,
    title: "Paste Your Content",
    description:
      "Copy and paste your blog post, article, or any long-form content into the editor.",
  },
  {
    icon: Sparkles,
    title: "AI Generates Variants",
    description:
      "Our AI instantly creates optimized versions for 5 different platforms.",
  },
  {
    icon: Send,
    title: "Copy & Publish",
    description:
      "Copy each version with one click and publish across all your social channels.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Three simple steps to repurpose your content across every platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="bg-secondary/50 border-border/50 text-center">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
