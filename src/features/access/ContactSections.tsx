import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, FileText } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";

const card = "flex flex-col gap-3.5 rounded-panel border border-[#E9E6DE] bg-white p-7 shadow-[0_1px_2px_rgba(11,27,51,0.05)]";
const cardIcon = "grid size-12 place-items-center rounded-btn bg-navy-900 text-gold-300";
const cardTitle = "font-display text-[20px] leading-[normal] font-bold tracking-[-0.02em]";
const cardText = "text-[15px] leading-[1.6] text-ink";
const cardLink =
  "lift inline-flex min-h-[50px] items-center gap-2.5 rounded-btn px-[22px] text-[15px] font-semibold no-underline";

/** Portada de Contacto: foto del buque con velo navy, bajo la barra pública flotante. */
export function ContactHero() {
  return (
    <section
      aria-labelledby="contacto-titulo"
      className="relative isolate -mt-[78px] overflow-hidden bg-navy-950 pt-[174px] pb-[104px] text-center"
    >
      <Image
        src="/images/hero-ship.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-[65%_60%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-950/80" />
      <div className="mx-auto max-w-[768px] px-6">
        <p className="text-[13px] font-semibold tracking-[0.01em] text-gold-300">Hablemos de tu proyecto</p>
        <h1
          id="contacto-titulo"
          className="mt-5 font-display text-[56px] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-white max-[520px]:text-[40px]"
        >
          Tu carga, <span>nuestro compromiso</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[576px] text-base leading-[1.65] text-white/75">
          Cuéntanos qué necesitas importar o exportar y te acompañamos en cada paso: compra, producción, inspección y
          envío hasta tu puerta.
        </p>
      </div>
    </section>
  );
}

/** Tarjeta para pedir una cotización: crear la cuenta o ingresar. */
export function ContactQuoteCard() {
  return (
    <section aria-labelledby="cot-titulo" className={card}>
      <span aria-hidden="true" className={cardIcon}>
        <FileText size={22} strokeWidth={1.75} />
      </span>
      <h2 id="cot-titulo" className={cardTitle}>
        Solicita una cotización
      </h2>
      <p className={cardText}>
        Crea la cuenta de tu empresa y pide cotizaciones desde el marketplace. Un asesor arma la operación con los
        proveedores y operadores adecuados.
      </p>
      <p className="text-[13px] leading-normal text-subtle">
        Para cotizar en línea necesitas una cuenta de empresa validada por Global 360.
      </p>
      <div className="mt-auto flex flex-wrap gap-2.5">
        <Link href={routes.getQuote} className={cn(cardLink, "bg-gold-500 text-navy-950")}>
          Solicitar cotización
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
        <Link
          href={routes.login}
          className="lift inline-flex min-h-[50px] items-center rounded-btn border border-line-strong bg-white px-5 text-sm font-semibold text-navy-900 no-underline"
        >
          Ya tengo cuenta
        </Link>
      </div>
    </section>
  );
}

/** Tarjeta para que un proveedor u operador logístico registre su empresa. */
export function ContactProviderCard() {
  return (
    <section aria-labelledby="prov-titulo" className={card}>
      <span aria-hidden="true" className={cardIcon}>
        <Box size={22} strokeWidth={1.75} />
      </span>
      <h2 id="prov-titulo" className={cardTitle}>
        ¿Vendes productos o servicios logísticos?
      </h2>
      <p className={cardText}>
        Registra tu empresa como proveedor mayorista u operador logístico. Operaciones revisa tu perfil antes de
        publicarlo en el marketplace.
      </p>
      <Link href={routes.register} className={cn(cardLink, "mt-auto self-start bg-navy-900 text-white")}>
        Registrar mi empresa
        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
      </Link>
    </section>
  );
}
