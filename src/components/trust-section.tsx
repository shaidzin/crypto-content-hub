import { Shield, CreditCard, Clock, RefreshCw } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Your Data Is Safe",
    description: "Content is processed and never stored. We don't train on your data.",
  },
  {
    icon: CreditCard,
    title: "No Subscriptions",
    description: "Pay only for what you use. Credits never expire. No recurring charges.",
  },
  {
    icon: RefreshCw,
    title: "7-Day Money Back",
    description: "Not satisfied? Get a full refund within 7 days, no questions asked.",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get 7 platform-ready posts in under 10 seconds. No waiting.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {trustItems.map((item, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
