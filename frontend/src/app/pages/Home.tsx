import { ToonhubPage } from "./ToonhubPage";
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
      {/* Carousel TOONHUB làm Hero Section trang chủ */}
      <ToonhubPage />

      {/* Các phần nội dung cũ của WEMO */}
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
