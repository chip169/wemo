import { HeroSection } from "../components/HeroSection";
import { HowItWorks } from "../components/HowItWorks";
import { TemplateShowcase } from "../components/TemplateShowcase";
import { PersonalizationFeatures } from "../components/PersonalizationFeatures";
import { LiveDemo } from "../components/LiveDemo";
import { WhyWebo } from "../components/WhyWemo";
import { Testimonials } from "../components/Testimonials";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { FinalCTA } from "../components/FinalCTA";

export function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <TemplateShowcase />
      <PersonalizationFeatures />
      <LiveDemo />
      <WhyWebo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}
