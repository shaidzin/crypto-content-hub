import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { DemoSection } from "@/components/demo-section";
import { RepurposeForm } from "@/components/repurpose-form";
import { TrustSection } from "@/components/trust-section";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { createServerComponentClient } from "@/lib/supabase-ssr";
import type { User } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function Home() {
  let user: User | null = null;
  let credits = 0;

  try {
    const supabase = createServerComponentClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
      credits = profile?.credits ?? 0;
    }
  } catch (err) {
    console.error("Failed to load user/credits:", err);
  }

  return (
    <main className="min-h-screen">
      <Navbar user={user} credits={credits} />
      <Hero />
      <HowItWorks />
      <DemoSection />
      <RepurposeForm user={user} initialCredits={credits} />
      <TrustSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
