import { Hero } from "../components/Hero";
import { ToolCoverage } from "../components/ToolCoverage";
import { AuditStarter } from "../components/AuditStarter";
import { LiveDemo } from "../components/LiveDemo";
import { HowItWorks } from "../components/HowItWorks";
import { FAQSection } from "../components/FAQSection";
import { CTASection } from "../components/CTASection";

export function LandingPage() {
  return (
    <>
      <Hero />
      <ToolCoverage />
      <AuditStarter />
      <LiveDemo />
      <HowItWorks />
      <FAQSection />
      <CTASection />
    </>
  );
}
