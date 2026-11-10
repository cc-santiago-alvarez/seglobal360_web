import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { ButtonLink } from "@/shared/ui/Button";
import { ApiStatesSection } from "./ApiStatesSection";
import { ComponentsSection } from "./ComponentsSection";
import { ChangesSection, ColorSection, ShapeSection, TypographySection } from "./Foundations";
import { PrinciplesSection } from "./PrinciplesSection";

/** Guía de estilo: fundamentos visuales, componentes y estados de la API. */
export function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-ivory pt-16 pb-24 font-sans text-navy-900">
      <div className="mx-auto flex max-w-[1344px] flex-col gap-[72px] px-12 max-[720px]:px-5">
        <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <div className="flex max-w-[900px] flex-col gap-3.5">
            <span className="text-[13px] font-semibold tracking-[0.02em] text-gold-text">Plataforma web</span>
            <h1 className="m-0 font-display text-[clamp(36px,4vw,56px)] leading-[1.08] font-bold tracking-[-0.025em]">
              Fundamentos visuales
            </h1>
            <p className="m-0 text-lg leading-[1.55] text-ink">
              La misma marca de seglobal360.com con más aire, radios suaves y piezas pensadas para buscar y decidir
              rápido. Se aplica en todo el proyecto: sitio público, portales y backoffice.
            </p>
          </div>
          <ButtonLink href={routes.home} variant="navy" size="lg">
            Ver el inicio
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </ButtonLink>
        </header>
        <ChangesSection />
        <ColorSection />
        <TypographySection />
        <ShapeSection />
        <ComponentsSection />
        <ApiStatesSection />
        <PrinciplesSection />
      </div>
    </main>
  );
}
