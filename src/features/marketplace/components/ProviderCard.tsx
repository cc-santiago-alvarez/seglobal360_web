import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { countryName, Flag } from "@/shared/ui/Flag";
import { formatMoney, productCategoryLabel, supplierTypeLabel } from "../catalog";
import type { SupplierListing } from "../fixtures";
import { ProviderMark } from "./ProviderMark";
import { softTag } from "./styles";

const tileTints = ["bg-[#E7E3DA]", "bg-surface-muted", "bg-line-soft"];

function PhotoTiles({ provider }: { provider: SupplierListing }) {
  const total = provider.gallery.length;
  if (total === 0) {
    return (
      <div className="flex h-[168px] flex-col items-center justify-center gap-2 bg-[#F3F1EB] text-[13px] text-neutral-dot">
        <ImageIcon size={26} strokeWidth={1.4} aria-hidden="true" />
        Aún sin fotos publicadas
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${total} fotos de lo que vende ${provider.name}: ${provider.gallery.join(", ")}`}
      className="grid h-[168px] grid-cols-[2fr_1fr] grid-rows-2 gap-[3px]"
    >
      {provider.gallery.slice(0, 3).map((caption, index) => {
        const more = index === 2 ? total - 3 : 0;
        return (
          <div
            key={caption}
            className={cn("relative overflow-hidden", tileTints[index], index === 0 && "row-span-2")}
          >
            <span aria-hidden="true" className="grid size-full place-items-center text-neutral-dot">
              <ImageIcon size={index === 0 ? 30 : 20} strokeWidth={1.4} />
            </span>
            {index === 0 ? (
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] truncate rounded-full bg-[rgba(6,16,36,0.72)] px-[9px] py-[3px] text-[11px] font-medium text-white"
              >
                {caption}
              </span>
            ) : null}
            {more > 0 ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-[rgba(11,27,51,0.6)] text-sm font-semibold text-white"
              >
                +{more}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Tarjeta de un proveedor mayorista; toda la tarjeta abre su perfil. */
export function ProviderCard({ provider }: { provider: SupplierListing }) {
  return (
    <article className="card-hover relative flex cursor-pointer flex-col overflow-hidden rounded-tile border border-[#E9E6DE] bg-white shadow-[0_1px_2px_rgba(11,27,51,0.05)]">
      <PhotoTiles provider={provider} />
      <div className="flex flex-auto flex-col gap-3.5 px-[22px] pt-5 pb-[22px]">
        <div className="flex items-center gap-3.5">
          <ProviderMark initials={provider.initials} size="lg" />
          <div className="min-w-0">
            <h3 className="m-0 font-display text-lg leading-[1.3] font-bold">{provider.name}</h3>
            <p className="mt-1 mb-0 text-[13px] text-subtle">
              {supplierTypeLabel[provider.supplierType]} · {provider.city}, {countryName[provider.countryCode]}
            </p>
          </div>
        </div>
        <p className="m-0 text-sm leading-[1.6] text-ink">{provider.summary}</p>
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Categorías">
          {provider.categories.map((code) => (
            <li key={code} className={softTag}>
              {productCategoryLabel[code]}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-subtle">
          <span>Despacha desde</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-navy-900">
            <Flag
              code={provider.countryCode}
              className="h-[15px]! w-[22px]! rounded-[2px]! shadow-[0_0_0_1px_rgba(11,27,51,0.12)]"
            />
            {countryName[provider.countryCode]}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Pedido mínimo{" "}
            <strong className="font-semibold text-navy-900">{formatMoney(provider.conditions.minOrder)}</strong>
          </span>
        </div>
        <Link
          href={routes.provider(provider.id)}
          className="mt-auto inline-flex items-center gap-2 self-start pt-1.5 text-sm font-semibold text-navy-900 no-underline after:absolute after:inset-0 after:content-['']"
        >
          Ver perfil y productos
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="text-gold-text" />
        </Link>
      </div>
    </article>
  );
}
