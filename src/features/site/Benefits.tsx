import { Check } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { approvedFaces, sampleInquiryStatus, sampleMessage, sampleQuote } from "./fixtures";
import {
  cardText,
  cardTextBase,
  cardTitle,
  cardTitleBase,
  container,
  eyebrow,
  eyebrowBase,
  sectionLead,
  sectionTitle,
} from "./styles";
import { trackProgress, type StepState } from "./track";

const tile = "flex flex-col gap-3.5 overflow-hidden rounded-card border p-7 max-[980px]:col-span-12";
const whiteTile = cn(tile, "border-[rgba(11,27,51,0.07)] bg-white");

const dotClass: Record<StepState, string> = {
  done: "bg-navy-900",
  now: "bg-gold-500 shadow-[0_0_0_4px_rgba(201,164,92,0.25)]",
  next: "bg-line-warm",
};

/** Beneficios en mosaico: cada tarjeta muestra un pedazo real del producto. */
export function Benefits() {
  return (
    <section id="beneficios" aria-labelledby="beneficios-titulo" className="pt-10 pb-24">
      <div className={cn(container, "flex flex-col gap-8")}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 id="beneficios-titulo" className={cn(sectionTitle, "max-w-[720px]")}>
            Comprar afuera no debería sentirse como un trámite.
          </h2>
          <p className={cn(sectionLead, "max-w-[400px]")}>
            Todo lo que normalmente resuelves con cinco contactos distintos, aquí pasa en un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <article className={cn(tile, "col-span-7 row-span-2 border-navy-900 bg-navy-900 text-white max-[980px]:row-auto")}>
            <span className={cn(eyebrowBase, "text-gold-300")}>01 · Todo incluido</span>
            <h3 className={cn(cardTitleBase, "text-[clamp(28px,3vw,40px)] text-white")}>
              Una sola cotización, sin sumar por tu cuenta.
            </h3>
            <p className={cn(cardTextBase, "max-w-[460px] text-white/78")}>
              Mercancía, transporte, aduana y entrega en destino llegan en un total. La gestión de SEGlobal 360 ya va
              adentro.
            </p>
            <div className="mt-auto flex max-w-[460px] flex-col gap-2.5 rounded-tile bg-white p-[18px] text-navy-900">
              <div className="flex items-baseline justify-between gap-2.5">
                <span className="font-sans text-xs font-semibold text-subtle">
                  {sampleQuote.code} · v{sampleQuote.version}
                </span>
                <span className="text-xs font-semibold text-warn-fg">{sampleQuote.validityLabel}</span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
                {sampleQuote.lines.map((line) => (
                  <li key={line} className="flex items-center gap-2.5">
                    <Check size={16} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-success-fg" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                <span className="text-sm text-subtle">Total</span>
                <span className="font-display text-[28px] font-bold">{sampleQuote.totalLabel}</span>
              </div>
            </div>
          </article>

          <article className={cn(whiteTile, "col-span-5")}>
            <span className={eyebrow}>02 · Verificados</span>
            <h3 className={cardTitle}>Proveedores revisados uno a uno.</h3>
            <p className={cardText}>
              Cada mayorista y operador pasa por la revisión de Global 360 antes de aparecer en el marketplace.
            </p>
            <div aria-hidden="true" className="mt-auto flex items-center">
              {approvedFaces.map((face) => (
                <span
                  key={face.initials}
                  className={cn(
                    "-mr-2.5 grid size-11 place-items-center rounded-full border-[3px] border-white font-sans text-[13px] font-bold",
                    face.className,
                  )}
                >
                  {face.initials}
                </span>
              ))}
              <span className="ml-[22px] text-[13px] font-semibold text-success-fg">Aprobados por Global 360</span>
            </div>
          </article>

          <article className={cn(tile, "col-span-5 border-sand-line bg-sand")}>
            <span className={eyebrow}>03 · Acompañamiento</span>
            <h3 className={cardTitle}>Una persona, no un formulario.</h3>
            <p className={cardText}>
              Tu asesor conversa contigo en el portal o por WhatsApp y coordina con los proveedores hasta la entrega.
            </p>
            <div className="mt-auto max-w-[320px] self-start rounded-[4px_18px_18px_18px] bg-white px-3.5 py-3 text-sm leading-[1.45]">
              {sampleMessage.body}
              <span className="mt-1.5 block font-sans text-[11px] font-semibold text-subtle">
                {sampleMessage.author} · {sampleMessage.time}
              </span>
            </div>
          </article>

          <article className={cn(whiteTile, "col-span-4")}>
            <span className={eyebrow}>04 · Seguimiento</span>
            <h3 className={cardTitle}>Sabes en qué va cada pedido.</h3>
            <ol className="m-0 mt-1 flex list-none flex-col gap-2 p-0 text-sm">
              {trackProgress(sampleInquiryStatus).map((step) => (
                <li
                  key={step.status}
                  className={cn("flex items-center gap-2.5", step.state === "next" ? "text-faint" : "text-navy-900")}
                >
                  <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full", dotClass[step.state])} />
                  {step.label}
                </li>
              ))}
            </ol>
          </article>

          <article className={cn(whiteTile, "col-span-4")}>
            <span className={eyebrow}>05 · Sin compromiso</span>
            <h3 className={cardTitle}>Compara antes de decidir.</h3>
            <p className={cardText}>
              Explora por categoría, ruta y tipo de transporte. Pedir una cotización no te obliga a nada: la aceptas o la
              rechazas en línea.
            </p>
          </article>

          <article className={cn(whiteTile, "col-span-4")}>
            <span className={eyebrow}>06 · Precio claro</span>
            <h3 className={cardTitle}>Sin cargos sorpresa.</h3>
            <p className={cardText}>
              La comisión de SEGlobal 360 va incluida en el total que ves y aceptas. Nada se suma después.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
