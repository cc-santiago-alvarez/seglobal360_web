import Link from "next/link";
import { Image as ImageIcon, ShieldCheck } from "lucide-react";
import { providerKind } from "@/features/provider/model";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { countryName, Flag } from "@/shared/ui/Flag";
import {
  countLabel,
  formatMoney,
  otherCountry,
  productCategoryLabel,
  supplierTypeLabel,
  transportTypeCodes,
  transportTypeLabel,
} from "../catalog";
import type { LogisticsProfile, MarketplaceProvider, MarketplaceService, SupplierProfile } from "../fixtures";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProviderMark } from "./ProviderMark";
import { ServiceMiniCard } from "./ServiceMiniCard";
import { asideShadow, detailTitle, factCell, factGrid, goldCta } from "./styles";

const panel = "flex flex-col rounded-panel border border-[#E9E6DE] bg-white p-7 max-[520px]:p-6";
const goldChip = "rounded-full border border-[rgba(232,203,142,0.45)] px-3 py-1.5 text-[13px] font-semibold text-gold-300";
const glassChip = "inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-[13px]";
const blockTitle = "m-0 text-[13px] font-semibold tracking-[0.01em] text-subtle";
const navyTag = "rounded-full bg-navy-900 px-2.5 py-1 text-[13px] font-semibold text-white";
const lightTag = "rounded-full bg-[#F3F1EB] px-2.5 py-1 text-[13px] font-medium";
const galleryTints = ["bg-[#E7E3DA]", "bg-surface-muted", "bg-line-soft", "bg-[#E9E5DC]"];

function TagList({ items, className }: { items: string[]; className: string }) {
  return (
    <ul className="mt-2.5 mb-0 flex list-none flex-wrap gap-1.5 p-0">
      {items.map((item) => (
        <li key={item} className={className}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Hero({ provider }: { provider: MarketplaceProvider }) {
  const isSupplier = provider.kind === "supplier";
  return (
    <section
      aria-labelledby="prov-titulo"
      className="mt-6 flex flex-wrap items-center gap-7 rounded-card bg-navy-900 p-9 text-white max-[520px]:p-6"
    >
      <ProviderMark initials={provider.initials} size="xl" />
      <div className="min-w-0 flex-[1_1_420px]">
        <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-300">
          {isSupplier ? "Proveedor aprobado por Global 360" : "Operador logístico aprobado por Global 360"}
        </p>
        <h1
          id="prov-titulo"
          className="mt-2.5 mb-0 font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] max-[520px]:text-[32px]"
        >
          {provider.name}
        </h1>
        <p className="mt-3 mb-0 max-w-[680px] text-base leading-[1.6] text-white/82">{provider.summary}</p>
        <div className="mt-[18px] flex flex-wrap items-center gap-2.5">
          {provider.kind === "supplier" ? (
            <>
              <span className={goldChip}>{supplierTypeLabel[provider.supplierType]}</span>
              {provider.yearsInMarket ? (
                <span className={goldChip}>{provider.yearsInMarket} años en el mercado</span>
              ) : null}
              <span className={glassChip}>
                <Flag code={provider.countryCode} />
                Despacha desde {provider.city}
              </span>
              <span className={glassChip}>
                <Flag code={otherCountry(provider.countryCode)} />
                Vende a {countryName[otherCountry(provider.countryCode)]}
              </span>
            </>
          ) : (
            <>
              <span className={goldChip}>{providerKind.logistics}</span>
              {provider.yearsInMarket ? (
                <span className={goldChip}>{provider.yearsInMarket} años de operación</span>
              ) : null}
              {provider.coverage.map((code) => (
                <span key={code} className={glassChip}>
                  <Flag code={code} />
                  {countryName[code]}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function QuoteSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-1 mb-0 flex list-none flex-col gap-3.5 border-t border-line p-0 pt-4 text-sm leading-normal text-ink">
      {steps.map((step, index) => (
        <li key={step} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center rounded-full bg-navy-900 font-display text-[13px] font-bold text-gold-300"
          >
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

type QuoteAsideProps = { title: string; text: string; href: string; steps: string[]; note: string };

function QuoteAside({ title, text, href, steps, note }: QuoteAsideProps) {
  return (
    <aside aria-label="Cotizar" className="flex flex-[1_1_320px] flex-col gap-4">
      <div className={`flex flex-col gap-4 rounded-panel border border-[#E9E6DE] bg-white p-[26px] ${asideShadow}`}>
        <h2 className={detailTitle}>{title}</h2>
        <p className="m-0 text-sm leading-[1.6] text-subtle">{text}</p>
        <Link href={href} className={`${goldCta} min-h-[50px]`}>
          Pedir cotización
        </Link>
        <QuoteSteps steps={steps} />
      </div>
      <div className="flex items-start gap-3 rounded-tile border border-[#E9E6DE] bg-white p-[18px] text-sm leading-[1.55] text-ink">
        <ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" className="mt-px shrink-0 text-success-fg" />
        <span>{note}</span>
      </div>
    </aside>
  );
}

function SupplierBody({ provider }: { provider: SupplierProfile }) {
  const destination = countryName[otherCountry(provider.countryCode)];
  const photos = provider.gallery.length;
  const conditions = [
    { label: "Pedido mínimo", value: formatMoney(provider.conditions.minOrder) },
    { label: "Alistamiento", value: provider.conditions.leadTime },
    { label: "Garantía", value: provider.conditions.warranty },
    { label: "Facturación", value: provider.conditions.billing },
  ];
  return (
    <div className="mt-7 flex flex-wrap items-start gap-8">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        <section id="fotos" aria-labelledby="fotos-titulo">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="fotos-titulo" className="m-0 font-display text-[22px] font-bold tracking-[-0.02em]">
              Lo que vende
            </h2>
            <span className="text-sm text-subtle">{countLabel(photos, "foto", "fotos")}</span>
          </div>
          {photos > 0 ? (
            <ul className="mt-4 mb-0 grid list-none auto-rows-[130px] grid-flow-dense grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 p-0">
              {provider.gallery.map((caption, index) => (
                <li
                  key={caption}
                  className={cn(
                    "relative overflow-hidden rounded-[14px] text-neutral-dot",
                    galleryTints[index % galleryTints.length],
                    index === 0 && "col-span-2 row-span-2",
                  )}
                >
                  <span className="grid size-full place-items-center">
                    <ImageIcon size={index === 0 ? 36 : 22} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <span className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] truncate rounded-full bg-[rgba(6,16,36,0.72)] px-[9px] py-[3px] text-xs font-medium text-white">
                    {caption}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-2 rounded-tile border-[1.5px] border-dashed border-line-strong bg-white p-8 text-center text-sm text-subtle">
              <ImageIcon size={28} strokeWidth={1.4} aria-hidden="true" className="text-neutral-dot" />
              Este proveedor aún no ha publicado fotos. Pide la cotización y tu asesor te comparte su catálogo.
            </div>
          )}
        </section>

        <section aria-labelledby="cond-titulo" className={cn(panel, "gap-5")}>
          <h2 id="cond-titulo" className={detailTitle}>
            Condiciones comerciales
          </h2>
          <dl className={`${factGrid} grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))]`}>
            {conditions.map((condition) => (
              <div key={condition.label} className={factCell}>
                <dt className="text-xs font-semibold tracking-[0.01em] text-subtle">{condition.label}</dt>
                <dd className="mt-1.5 text-[15px] font-semibold">{condition.value}</dd>
              </div>
            ))}
          </dl>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-5">
            <div>
              <h3 className={blockTitle}>Categorías</h3>
              <TagList items={provider.categories.map((code) => productCategoryLabel[code])} className={navyTag} />
            </div>
            <div>
              <h3 className={blockTitle}>Líneas de producto</h3>
              <TagList items={provider.productLines} className={lightTag} />
            </div>
          </div>
        </section>

        {provider.about ? (
          <section className={cn(panel, "gap-3")}>
            <h2 className={detailTitle}>Sobre {provider.name}</h2>
            <p className="m-0 max-w-[720px] text-[15px] leading-[1.7] text-ink">{provider.about}</p>
            {provider.memberSince ? (
              <p className="m-0 text-[13px] text-subtle">En SEGlobal 360 desde {provider.memberSince}.</p>
            ) : null}
          </section>
        ) : null}
      </div>

      <QuoteAside
        title="Cotiza con este proveedor"
        text="Cuéntanos qué productos y cantidades necesitas. Recibes una sola cotización con la mercancía y su logística hasta tu bodega."
        href={`${routes.client.newInquiry}?providerId=${encodeURIComponent(provider.id)}`}
        steps={[
          "Eliges productos y cantidades.",
          "Tu asesor confirma precio con el proveedor y suma transporte y aduana con un operador logístico aprobado.",
          `Recibes la mercancía nacionalizada en ${destination}.`,
        ]}
        note="Perfil revisado por Global 360. No publicamos contactos directos: tu asesor coordina la compra y el envío con el proveedor."
      />
    </div>
  );
}

function OperatorBody({ provider, services }: { provider: LogisticsProfile; services: MarketplaceService[] }) {
  const transports = transportTypeCodes.filter((code) => services.some((item) => item.transportTypes.includes(code)));
  return (
    <div className="mt-7 flex flex-wrap items-start gap-8">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        <section id="servicios" aria-labelledby="servicios-titulo">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="servicios-titulo" className="m-0 font-display text-[22px] font-bold tracking-[-0.02em]">
              Servicios publicados
            </h2>
            <span className="text-sm text-subtle">{countLabel(services.length, "servicio", "servicios")}</span>
          </div>
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
            {services.map((item) => (
              <ServiceMiniCard key={item.id} service={item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="cobertura-titulo" className={cn(panel, "gap-5")}>
          <h2 id="cobertura-titulo" className={detailTitle}>
            Cobertura y capacidades
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-5">
            <div>
              <h3 className={blockTitle}>Cobertura</h3>
              <TagList items={provider.coverage.map((code) => countryName[code])} className={lightTag} />
            </div>
            {transports.length > 0 ? (
              <div>
                <h3 className={blockTitle}>Transporte</h3>
                <TagList items={transports.map((code) => transportTypeLabel[code])} className={lightTag} />
              </div>
            ) : null}
            {provider.capabilities.length > 0 ? (
              <div>
                <h3 className={blockTitle}>Capacidades</h3>
                <TagList items={provider.capabilities} className={lightTag} />
              </div>
            ) : null}
            {provider.certifications.length > 0 ? (
              <div>
                <h3 className={blockTitle}>Certificaciones</h3>
                <TagList items={provider.certifications} className={navyTag} />
              </div>
            ) : null}
          </div>
        </section>

        {provider.about ? (
          <section className={cn(panel, "gap-3")}>
            <h2 className={detailTitle}>Sobre {provider.name}</h2>
            <p className="m-0 max-w-[720px] text-[15px] leading-[1.7] text-ink">{provider.about}</p>
          </section>
        ) : null}
      </div>

      <QuoteAside
        title="Cotiza con este operador"
        text="Sin costo. Un asesor de SEGlobal 360 revisa tu carga y te envía el total con todo incluido."
        href={`${routes.client.newInquiry}?providerId=${encodeURIComponent(provider.id)}`}
        steps={[
          "Envías los datos de tu carga: bultos, peso, volumen, origen y destino.",
          "Un asesor te contacta y arma la cotización con los proveedores.",
          "La aceptas en línea y coordinamos la operación hasta la entrega.",
        ]}
        note="Perfil revisado por Global 360. No publicamos contactos directos: tu asesor coordina la operación con el operador."
      />
    </div>
  );
}

type Props = { provider: MarketplaceProvider; services: MarketplaceService[] };

/** Perfil público de un proveedor: mayorista (lo que vende) u operador logístico (sus servicios). */
export function ProviderProfile({ provider, services }: Props) {
  const isSupplier = provider.kind === "supplier";
  return (
    <main className="mx-auto max-w-[1240px] px-6 pt-7 pb-20">
      <Breadcrumbs
        items={[
          { label: "Marketplace", href: routes.marketplace },
          isSupplier
            ? { label: "Proveedores", href: `${routes.marketplace}?tab=products` }
            : { label: "Servicios logísticos", href: routes.marketplace },
          { label: provider.name },
        ]}
      />
      <Hero provider={provider} />
      {provider.kind === "supplier" ? (
        <SupplierBody provider={provider} />
      ) : (
        <OperatorBody provider={provider} services={services} />
      )}
    </main>
  );
}
