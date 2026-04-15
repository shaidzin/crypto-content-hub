import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What content formats does ContentSpark generate?",
    answer:
      "ContentSpark generates 5 platform-optimized versions of your content: a Twitter/X thread (4-8 tweets), a LinkedIn post, an Instagram caption with hashtags, an email newsletter version with subject line, and a Reddit discussion post.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "You get 2 free content repurposes with no signup or credit card required. Just paste your content and click generate. After your 2 free uses, you can upgrade to continue repurposing.",
  },
  {
    question: "What's the difference between Starter and Lifetime?",
    answer:
      "Starter gives you 100 repurposes for $9 — perfect for occasional use. Lifetime gives you unlimited repurposes forever for $19 — best value for regular content creators. Both are one-time payments with no recurring fees.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes! We offer a 7-day money-back guarantee, no questions asked. If ContentSpark isn't working for you, just reach out and we'll refund your purchase.",
  },
  {
    question: "What AI powers the content generation?",
    answer:
      "We use state-of-the-art AI models to generate high-quality, platform-specific content. The AI understands each platform's unique tone, format, and best practices to create content that feels native to each channel.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Everything you need to know about ContentSpark.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
