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
    question: "How do credits work?",
    answer:
      "1 credit = 1 repurpose into all 5 platforms. Sign up free and get 3 credits to try it out. Need more? Buy credit packs starting at just $1 for 5 credits. Credits never expire.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Credits start at $1 for 5 repurposes ($0.20 each). Buy bigger packs for better value: $3 for 20 credits, $5 for 40 credits, or $10 for 100 credits ($0.10 each). No subscriptions — pay only when you need more.",
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
