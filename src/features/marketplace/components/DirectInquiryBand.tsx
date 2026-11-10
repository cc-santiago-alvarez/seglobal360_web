import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { goldCta } from "./styles";

/** Franja navy que invita a crear una solicitud directa. */
export function DirectInquiryBand() {
  return (
    <section aria-labelledby="solicitud-directa" className="bg-navy-900 text-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-6 py-14">
        <div className="flex-[1_1_520px]">
          <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-300">Hablemos de tu proyecto</p>
          <h2
            id="solicitud-directa"
            className="mt-3 mb-0 font-display text-[30px] leading-[1.2] font-bold tracking-[-0.02em]"
          >
            ¿No encuentras el servicio exacto?
          </h2>
          <p className="mt-3 mb-0 text-base leading-[1.6] text-white/80">
            Crea una solicitud directa con los datos de tu carga y un asesor arma la operación con los proveedores
            adecuados.
          </p>
        </div>
        <Link href={routes.client.newInquiry} className={`${goldCta} min-h-[52px] px-[26px]`}>
          Crear solicitud directa
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
