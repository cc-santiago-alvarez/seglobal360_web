import Link from "next/link";
import { routes } from "@/shared/lib/routes";
import { serviceCategoryLabel, transportTypeLabel } from "../catalog";
import type { MarketplaceService } from "../fixtures";

/** Enlace compacto a otro servicio del mismo operador. */
export function ServiceMiniCard({ service }: { service: MarketplaceService }) {
  const meta = [service.transportTypes.map((code) => transportTypeLabel[code]).join(", "), service.transitTime]
    .filter(Boolean)
    .join(" · ");
  return (
    <Link
      href={routes.service(service.id)}
      className="flex flex-col gap-2 rounded-tile border border-[#E9E6DE] bg-white p-5 text-navy-900 no-underline"
    >
      <span className="text-xs font-semibold tracking-[0.01em] text-gold-text">
        {serviceCategoryLabel[service.category]}
      </span>
      <span className="font-display text-base font-semibold">{service.name}</span>
      <span className="text-[13px] text-subtle">{meta}</span>
    </Link>
  );
}
