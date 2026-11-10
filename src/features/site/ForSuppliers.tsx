import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { supplierSteps } from "./fixtures";
import { container, eyebrowBase, sectionTitleBase } from "./styles";

/** Banda navy para proveedores y operadores, con los pasos para publicar. */
export function ForSuppliers() {
  return (
    <section id="vende" aria-labelledby="vende-titulo" className="pb-24">
      <div className={container}>
        <div className="relative flex flex-wrap items-center gap-10 overflow-hidden rounded-[36px] bg-navy-950 p-[clamp(28px,5vw,64px)] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(rgba(232,203,142,0.16)_1px,transparent_1px)] bg-size-[22px_22px] opacity-60"
          />
          <div className="relative flex flex-[1_1_420px] flex-col gap-[18px]">
            <span className={cn(eyebrowBase, "text-gold-300")}>Para proveedores y operadores</span>
            <h2 id="vende-titulo" className={cn(sectionTitleBase, "text-white")}>
              ¿Vendes al por mayor o mueves carga?
            </h2>
            <p className="m-0 max-w-[480px] text-lg leading-[1.55] text-pretty text-white/78">
              Publica tu perfil y recibe solicitudes de empresas en Colombia y Costa Rica. Global 360 revisa tu perfil
              y te acompaña en cada operación.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href={routes.register}
                className="lift inline-flex min-h-[54px] items-center gap-2.5 rounded-2xl bg-gold-500 px-[22px] text-base font-semibold text-navy-950 no-underline"
              >
                Registrar mi empresa
                <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ol className="relative m-0 flex flex-[1_1_340px] list-none flex-col gap-2.5 p-0">
            {supplierSteps.map((step) => (
              <li
                key={step.number}
                className="flex items-start gap-3.5 rounded-tile border border-white/10 bg-white/6 px-5 py-[18px]"
              >
                <span className="font-sans text-[13px] font-semibold text-gold-300">{step.number}</span>
                <span className="text-[15px] leading-normal">{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
