import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { countryName } from "@/shared/ui/Flag";
import { corridorLabel, serviceCategoryLabel, transportTypeLabel } from "../catalog";
import type { LogisticsProfile, MarketplaceService } from "../fixtures";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProviderMark } from "./ProviderMark";
import { ServiceMiniCard } from "./ServiceMiniCard";
import { asideShadow, detailTitle, factCell, factGrid, goldCta } from "./styles";

const steps = [
  "Envías los datos de tu carga: bultos, peso, volumen, origen y destino.",
  "Un asesor te contacta y arma la cotización con los proveedores.",
  "La aceptas en línea y coordinamos la operación hasta la entrega.",
];

const darkLabel = "m-0 text-[13px] font-semibold tracking-[0.01em] text-white/65";
const darkChip = "rounded-full px-3 py-[5px] text-[13px]";

type Props = { service: MarketplaceService; provider: LogisticsProfile; moreServices: MarketplaceService[] };

/** Detalle público de un servicio logístico, con su operador y el formulario de cotizar. */
export function ServiceDetail({ service, provider, moreServices }: Props) {
  const facts = [
    { label: "Transporte", value: service.transportTypes.map((code) => transportTypeLabel[code]).join(", ") },
    ...(service.destinationCountry
      ? [
          { label: "Origen", value: countryName[service.originCountry] },
          { label: "Destino", value: countryName[service.destinationCountry] },
        ]
      : [{ label: "País", value: countryName[service.originCountry] }]),
    ...(service.transitTime ? [{ label: "Tránsito estimado", value: service.transitTime }] : []),
  ];
  const providerText = provider.about ?? provider.summary;
  const inquiryHref = `${routes.client.newInquiry}?serviceId=${encodeURIComponent(service.id)}`;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pt-7 pb-20">
      <Breadcrumbs
        items={[
          { label: "Marketplace", href: routes.marketplace },
          { label: serviceCategoryLabel[service.category], href: routes.marketplace },
          { label: service.name },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-start gap-8">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
          <section className="rounded-panel border border-[#E9E6DE] bg-white p-8 max-[520px]:p-6">
            <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-text">
              {serviceCategoryLabel[service.category]}
            </p>
            <h1 className="mt-3 mb-0 font-display text-[36px] leading-[1.15] font-bold tracking-[-0.02em] text-balance max-[520px]:text-[30px]">
              {service.name}
            </h1>
            <div className="mt-[18px] flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-2.5">
                <ProviderMark initials={provider.initials} size="md" />
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold">{provider.name}</span>
                  <span className="text-[13px] text-subtle">Operador logístico aprobado por Global 360</span>
                </span>
              </div>
              <a href="#proveedor" className="text-sm font-semibold">
                Sobre el operador
              </a>
            </div>
            <dl className={`${factGrid} mt-7 grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))]`}>
              {facts.map((fact) => (
                <div key={fact.label} className={factCell}>
                  <dt className="text-xs font-semibold tracking-[0.01em] text-subtle">{fact.label}</dt>
                  <dd className="mt-1.5 text-[15px] font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {service.description || service.conditions.length > 0 ? (
            <section className="flex flex-col gap-6 rounded-panel border border-[#E9E6DE] bg-white p-8 max-[520px]:p-6">
              {service.description ? (
                <div>
                  <h2 className={detailTitle}>Descripción</h2>
                  <p className="mt-3 mb-0 max-w-[720px] text-[15px] leading-[1.7] text-ink">{service.description}</p>
                </div>
              ) : null}
              {service.description && service.conditions.length > 0 ? <div className="h-px bg-line" /> : null}
              {service.conditions.length > 0 ? (
                <div>
                  <h2 className={detailTitle}>Condiciones</h2>
                  <ul className="mt-3 mb-0 list-disc pl-5 text-[15px] leading-[1.8] text-ink">
                    {service.conditions.map((condition) => (
                      <li key={condition}>{condition}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          <section
            id="proveedor"
            aria-labelledby="operador-titulo"
            className="flex flex-col gap-[22px] rounded-panel bg-navy-900 p-8 text-white max-[520px]:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-300">
                  Sobre el operador logístico
                </p>
                <h2 id="operador-titulo" className="mt-2.5 mb-0 font-display text-2xl font-bold tracking-[-0.02em]">
                  {provider.name}
                </h2>
              </div>
              {provider.yearsInMarket ? (
                <span className="rounded-full border border-[rgba(232,203,142,0.45)] px-3.5 py-2 text-[13px] font-semibold text-gold-300">
                  {provider.yearsInMarket} años de operación
                </span>
              ) : null}
            </div>
            <p className="m-0 max-w-[720px] text-[15px] leading-[1.7] text-white/82">{providerText}</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-5">
              <div>
                <h3 className={darkLabel}>Cobertura</h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {provider.coverage.map((code) => (
                    <span key={code} className={`${darkChip} bg-white/8`}>
                      {countryName[code]}
                    </span>
                  ))}
                </div>
              </div>
              {provider.capabilities.length > 0 ? (
                <div>
                  <h3 className={darkLabel}>Capacidades</h3>
                  <ul className="mt-2.5 mb-0 list-disc pl-[18px] text-sm leading-[1.7] text-white/85">
                    {provider.capabilities.map((capability) => (
                      <li key={capability}>{capability}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {provider.certifications.length > 0 ? (
                <div>
                  <h3 className={darkLabel}>Certificaciones</h3>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {provider.certifications.map((certification) => (
                      <span
                        key={certification}
                        className={`${darkChip} border border-[rgba(232,203,142,0.45)] font-semibold text-gold-300`}
                      >
                        {certification}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <Link
              href={routes.provider(provider.id)}
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-gold-300 no-underline hover:text-white"
            >
              Ver perfil del operador
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </section>

          {moreServices.length > 0 ? (
            <section aria-labelledby="mas-servicios">
              <h2 id="mas-servicios" className={detailTitle}>
                Más servicios de este operador
              </h2>
              <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
                {moreServices.map((item) => (
                  <ServiceMiniCard key={item.id} service={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside aria-label="Solicitar cotización" className="flex flex-[1_1_340px] flex-col gap-4">
          <div
            className={`flex flex-col gap-[18px] rounded-panel border border-[#E9E6DE] bg-white p-[26px] ${asideShadow}`}
          >
            <div>
              <h2 className="m-0 font-display text-[22px] font-bold tracking-[-0.02em]">Solicita tu cotización</h2>
              <p className="mt-2 mb-0 text-sm leading-[1.6] text-subtle">
                Sin costo. Un asesor de SEGlobal 360 revisa tu carga y te envía el total con todo incluido.
              </p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold tracking-[0.01em] text-subtle">Corredores disponibles</p>
              <ul className="mt-2.5 mb-0 flex list-none flex-col gap-2 p-0">
                {service.corridors.map((code) => (
                  <li
                    key={code}
                    className="flex items-center gap-2.5 rounded-field bg-ivory px-3.5 py-3 text-sm font-semibold"
                  >
                    <Check size={18} strokeWidth={2} aria-hidden="true" className="text-success-fg" />
                    {corridorLabel(code)}
                  </li>
                ))}
              </ul>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold">Tipo de transporte</span>
              <select className="min-h-[46px] rounded-field border border-line-strong bg-white px-3 font-sans text-[15px] font-medium text-navy-900">
                {service.transportTypes.map((code) => (
                  <option key={code} value={code}>
                    {transportTypeLabel[code]}
                  </option>
                ))}
              </select>
            </label>
            <Link href={inquiryHref} className={`${goldCta} min-h-[52px]`}>
              Solicitar cotización
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
            <p className="m-0 text-[13px] leading-[1.6] text-subtle">
              Necesitas una cuenta de empresa validada.{" "}
              <Link href={routes.login} className="font-semibold">
                Ingresar
              </Link>{" "}
              ·{" "}
              <Link href={routes.register} className="font-semibold">
                Registrar mi empresa
              </Link>
            </p>
          </div>

          <div className="rounded-panel border border-[#E9E6DE] bg-white p-[26px]">
            <h2 className="m-0 font-display text-base font-bold tracking-[-0.02em]">Cómo funciona</h2>
            <ol className="mt-4 mb-0 flex list-none flex-col gap-4 p-0">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3.5">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-gold-500 font-display text-xs font-bold text-navy-950"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-[1.55]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}
