import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { ButtonLink } from "@/shared/ui/Button";
import { Eyebrow } from "@/shared/ui/Card";
import { PublicFooter } from "@/shared/ui/PublicFooter";
import { PublicHeader } from "@/shared/ui/PublicHeader";

export const metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader variant="solid" />
      <main className="mx-auto flex w-full max-w-[820px] flex-1 flex-col items-start gap-4 px-6 py-24">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="m-0 font-display text-4xl leading-tight font-bold tracking-[-0.02em]">
          Esta página no existe o se movió
        </h1>
        <p className="m-0 max-w-[560px] text-base leading-relaxed text-subtle">
          Revisa la dirección o vuelve al marketplace para buscar productos y servicios logísticos entre Colombia y
          Costa Rica.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href={routes.marketplace} variant="gold" size="lg">
            Ir al marketplace
            <ArrowRight size={18} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={routes.home} variant="outline" size="lg">
            Volver al inicio
          </ButtonLink>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
