import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { WhatsAppIcon, whatsappHref } from "@/shared/ui/WhatsAppIcon";
import { container } from "./styles";

const action = "lift inline-flex min-h-14 items-center gap-2.5 rounded-2xl text-base font-semibold no-underline";

/** Cierre de la portada: crear cuenta o escribir por WhatsApp. */
export function ClosingCta() {
  return (
    <section aria-labelledby="cierre-titulo" className="pb-[88px]">
      <div className={cn(container, "flex flex-wrap items-end justify-between gap-x-10 gap-y-6")}>
        <h2
          id="cierre-titulo"
          className="m-0 font-display text-[clamp(40px,5.6vw,76px)] leading-[1.05] font-bold tracking-[-0.025em] text-navy-900"
        >
          Tu empresa,
          <br />
          sin fronteras.
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <Link href={routes.register} className={cn(action, "bg-navy-900 px-6 text-white")}>
            Crear cuenta de empresa
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
          <a
            href={whatsappHref("Hola SEGlobal 360, quiero información sobre sus servicios.")}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(action, "border border-[rgba(11,27,51,0.12)] bg-white px-[22px] text-navy-900")}
          >
            <WhatsAppIcon size={22} className="text-whatsapp" />
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
