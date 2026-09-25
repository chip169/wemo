import { HeroSection } from "../components/HeroSection";
import { HowItWorks } from "../components/HowItWorks";
import { TemplateShowcase } from "../components/TemplateShowcase";
import { PersonalizationFeatures } from "../components/PersonalizationFeatures";
import { LiveDemo } from "../components/LiveDemo";
import { WhyWemo } from "../components/WhyWemo";
import { Testimonials } from "../components/Testimonials";
import { FinalCTA } from "../components/FinalCTA";

export function Home() {
  return (
    <>
      {/* Hero Section mới với spotlight reveal effect */}
      <HeroSection />

      {/* Các phần nội dung của WEMO */}
      <HowItWorks />
      <TemplateShowcase />
      <PersonalizationFeatures />
      <LiveDemo />
      <WhyWemo />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

