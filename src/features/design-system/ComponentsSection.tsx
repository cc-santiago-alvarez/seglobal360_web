import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { corridorPorts, sampleInquiryStatus, transitTimes } from "@/features/site/fixtures";
import { GlassChip } from "@/features/site/GlassChip";
import { ResultRow } from "@/features/site/ResultRow";
import { eyebrow, eyebrowBase } from "@/features/site/styles";
import { trackProgress, type StepState } from "@/features/site/track";
import { cn } from "@/shared/lib/cn";
import { routes, slug } from "@/shared/lib/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { StatusPill } from "@/shared/ui/StatusPill";
import { WhatsAppIcon } from "@/shared/ui/WhatsAppIcon";
import { clientStateGroups } from "./apiStates";
import { DocSection } from "./DocSection";
import { ModeRouteDemo, SearchCategoriesDemo } from "./Demos";

const note = "m-0 text-sm leading-normal text-subtle";
const tile = "flex flex-col gap-4";

const barClass: Record<StepState, string> = {
  done: "bg-navy-900",
  now: "bg-gold-500",
  next: "bg-[#E9E5DC]",
};

const firstTransit = transitTimes[0];

/** 05 · Piezas interactivas del sitio, los portales y el backoffice. */
export function ComponentsSection() {
  return (
    <DocSection
      id="sec5"
      number="05"
      title="Componentes"
      description="Las piezas que arman el sitio, los portales y el backoffice. Los controles de esta sección responden al clic."
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(560px,100%),1fr))] gap-3">
        <Card className={tile}>
          <span className={eyebrow}>Botones</span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="gold" size="lg">
              Buscar
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button variant="navy" size="lg">
              Crear cuenta
            </Button>
            <Button variant="outline" size="lg">
              <WhatsAppIcon size={20} className="text-whatsapp" />
              Escríbenos por WhatsApp
            </Button>
            <Button variant="ghost" size="lg">
              Ver todo el marketplace
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button variant="navy" size="lg" disabled>
              Deshabilitado
            </Button>
          </div>
          <p className={note}>
            Dorado: el paso que avanza el flujo. Navy: crear cuenta o confirmar. Blanco con borde: alternativa. Texto con
            flecha: navegar.
          </p>
        </Card>

        <Card className={tile}>
          <span className={eyebrow}>Selector de modo y ruta</span>
          <ModeRouteDemo />
          <p className={note}>El segmento activo es blanco sobre crema. El botón de invertir cambia origen y destino sin abrir nada.</p>
        </Card>

        <Card className={tile}>
          <span className={eyebrow}>Búsqueda y categorías</span>
          <SearchCategoriesDemo />
          <p className={note}>Chip activo en navy; se puede marcar más de uno. Toca uno para probarlo.</p>
        </Card>

        <Card className={tile}>
          <span className={eyebrow}>Resultado y menú desplegable</span>
          <ResultRow
            framed
            href={routes.provider(slug("TecnoAndina Distribuciones"))}
            initials="TA"
            name="TecnoAndina Distribuciones"
            meta="Celulares, portátiles y accesorios · pedido mínimo USD 2.000"
            tag="Tecnología"
          />
          <div className="max-w-[340px] rounded-[18px] border border-[rgba(11,27,51,0.08)] bg-white p-2 shadow-menu">
            <Link
              href={`${routes.home}#beneficios`}
              className="row-hover flex min-h-[52px] items-center gap-3 rounded-xl px-2.5 py-2 text-navy-900 no-underline"
            >
              <span className="grid size-[34px] shrink-0 place-items-center rounded-full border border-[rgba(201,164,92,0.55)] text-gold-text">
                <BadgeCheck size={16} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold">Beneficios</span>
                <span className="text-[13px] text-subtle">Por qué comprar con SEGlobal 360</span>
              </span>
            </Link>
          </div>
          <p className={note}>Las filas son enlaces completos de 44 px o más; al pasar el cursor toman fondo ivory.</p>
        </Card>

        <div className="relative isolate flex min-w-0 flex-col gap-4 overflow-hidden rounded-card border border-navy-950 bg-navy-950 p-7 text-white">
          <Image
            src="/images/hero-ship.jpg"
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, 640px"
            className="-z-20 object-cover object-[65%_60%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,16,36,0.90)_0%,rgba(6,16,36,0.55)_100%)]"
          />
          <span className={cn(eyebrowBase, "text-gold-300")}>Sobre la foto de portada</span>
          <p className="m-0 max-w-[420px] font-display text-[28px] leading-[1.15] font-bold tracking-[-0.02em]">
            Texto blanco sobre velo navy al 90 %.
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            <GlassChip className="font-semibold">
              {corridorPorts.CO}
              <span aria-hidden="true" className="text-gold-300">
                →
              </span>
              <span className="visually-hidden">a</span>
              {corridorPorts.CR}
            </GlassChip>
            {firstTransit ? (
              <GlassChip>
                <strong className="font-semibold">{firstTransit.mode}</strong> · {firstTransit.transitTime}
              </GlassChip>
            ) : null}
          </ul>
          <p className="m-0 max-w-[460px] text-sm leading-normal text-white/80">
            Chips de vidrio: blanco al 12 %, borde al 16 % y desenfoque de 8 px. Solo sobre la foto, nunca sobre fondos
            claros.
          </p>
        </div>

        <Card className={tile}>
          <span className={eyebrow}>Estados y seguimiento</span>
          <div className="flex flex-col gap-3">
            {clientStateGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-subtle tabular-nums">{group.title}</span>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <StatusPill key={item.value} tone={item.tone} className="min-h-7">
                      {item.label}
                    </StatusPill>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <ol
            aria-label="Seguimiento de ejemplo"
            className="m-0 mt-1 grid list-none grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-x-1.5 gap-y-2.5 p-0"
          >
            {trackProgress(sampleInquiryStatus).map((step) => (
              <li key={step.status} className="flex flex-col gap-2">
                <span aria-hidden="true" className={cn("h-1.5 rounded-full", barClass[step.state])} />
                <span className={cn("text-xs font-semibold", step.state === "next" ? "text-faint" : "text-navy-900")}>
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
          <p className={note}>El texto siempre acompaña al color. El paso actual va en dorado; lo pendiente, en gris claro.</p>
        </Card>
      </div>

      <Card className={tile}>
        <span className={eyebrow}>Tarjetas en mosaico</span>
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2.5 max-[720px]:grid-cols-1">
          <div className="row-span-2 flex min-h-[200px] flex-col gap-2 rounded-[22px] bg-navy-900 p-[18px] text-white max-[720px]:row-auto">
            <span className={cn(eyebrowBase, "text-gold-300")}>01 · Destacada</span>
            <span className="font-display text-xl leading-[1.2] font-bold">Navy para el beneficio principal</span>
            <span className="mt-auto self-start rounded-field bg-white px-3 py-2 text-[13px] font-semibold text-navy-900">
              Muestra el producto
            </span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[22px] border border-[rgba(11,27,51,0.10)] bg-white p-4">
            <span className={eyebrow}>02 · Base</span>
            <span className="font-display text-base leading-[1.25] font-bold text-navy-900">Blanca con borde</span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[22px] border border-sand-line bg-sand p-4">
            <span className={eyebrow}>03 · Cálida</span>
            <span className="font-display text-base leading-[1.25] font-bold text-navy-900">Arena para lo humano</span>
          </div>
          <div className="col-span-2 flex items-center gap-3 rounded-[22px] bg-ivory p-4 max-[720px]:col-auto">
            <span className="font-display text-[36px] leading-none font-bold text-gold-500">2</span>
            <span className="text-sm leading-[1.45] text-ink">
              Ivory para pasos y bloques de apoyo dentro de una sección blanca.
            </span>
          </div>
        </div>
        <p className={note}>
          Una tarjeta grande por mosaico y como máximo una navy. Cada tarjeta muestra un pedazo real del producto:
          cotización, chat o seguimiento.
        </p>
      </Card>
    </DocSection>
  );
}
