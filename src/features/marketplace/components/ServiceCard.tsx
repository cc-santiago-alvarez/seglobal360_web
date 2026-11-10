import Link from "next/link";
import { ArrowRight, Clock, Route } from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { routeLabel, serviceCategoryLabel, transportTypeLabel } from "../catalog";
import type { ServiceListing } from "../fixtures";
import { ProviderMark } from "./ProviderMark";
import { softTag } from "./styles";

/** Tarjeta de un servicio en el listado del marketplace. */
export function ServiceCard({ service }: { service: ServiceListing }) {
  return (
    <article className="flex flex-col gap-3.5 rounded-tile border border-[#E9E6DE] bg-white p-[22px] shadow-[0_1px_2px_rgba(11,27,51,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold tracking-[0.01em] text-gold-text">
          {serviceCategoryLabel[service.category]}
        </span>
        {service.transitTime ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
            <Clock size={14} strokeWidth={2} aria-hidden="true" />
            {service.transitTime}
          </span>
        ) : null}
      </div>
      <h3 className="m-0 font-display text-lg leading-[1.3] font-bold">{service.name}</h3>
      <div className="flex items-center gap-2.5">
        <ProviderMark initials={service.provider.initials} />
        <span className="text-sm font-medium">{service.provider.name}</span>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-subtle">
        <Route size={16} strokeWidth={1.75} aria-hidden="true" />
        {routeLabel(service.originCountry, service.destinationCountry)}
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Transporte">
        {service.transportTypes.map((code) => (
          <li key={code} className={softTag}>
            {transportTypeLabel[code]}
          </li>
        ))}
      </ul>
      <Link
        href={routes.service(service.id)}
        className="mt-auto inline-flex items-center gap-2 pt-1.5 text-sm font-semibold text-navy-900 no-underline"
      >
        Ver detalle y cotizar
        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="text-gold-text" />
      </Link>
    </article>
  );
}
