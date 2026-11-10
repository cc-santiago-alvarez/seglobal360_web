import type { Metadata } from "next";
import { Benefits } from "@/features/site/Benefits";
import { ClosingCta } from "@/features/site/ClosingCta";
import { Faq } from "@/features/site/Faq";
import { ForSuppliers } from "@/features/site/ForSuppliers";
import { HowItWorks } from "@/features/site/HowItWorks";
import { LandingHero } from "@/features/site/LandingHero";
import { Showcase } from "@/features/site/Showcase";
import { PublicFooter } from "@/shared/ui/PublicFooter";
import { PublicHeader } from "@/shared/ui/PublicHeader";

export const metadata: Metadata = { title: "Inicio" };

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory font-sans text-navy-900">
      <PublicHeader variant="glass" />
      <main>
        <LandingHero />
        <Benefits />
        <HowItWorks />
        <Showcase />
        <ForSuppliers />
        <Faq />
        <ClosingCta />
      </main>
      <PublicFooter />
    </div>
  );
}
