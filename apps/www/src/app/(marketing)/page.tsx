import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";

export default function IndexPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
