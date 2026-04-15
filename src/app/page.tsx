import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { RepurposeForm } from "@/components/repurpose-form";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <RepurposeForm />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
