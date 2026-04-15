import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { RepurposeForm } from "@/components/repurpose-form";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { createServerComponentClient } from "@/lib/supabase-ssr";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let credits = 0;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();
    credits = profile?.credits ?? 0;
  }

  return (
    <main className="min-h-screen">
      <Navbar user={user} credits={credits} />
      <Hero />
      <HowItWorks />
      <RepurposeForm user={user} initialCredits={credits} />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
