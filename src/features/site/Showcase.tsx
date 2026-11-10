import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { routes, slug } from "@/shared/lib/routes";
import { showcaseProviders } from "./fixtures";
import { container, eyebrow, sectionTitle } from "./styles";

/** Proveedores destacados en un riel deslizable. */
export function Showcase() {
  return (
    <section id="vitrina" aria-labelledby="vitrina-titulo" className="py-24">
      <div className={cn(container, "flex flex-col gap-7")}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="vitrina-titulo" className={cn(sectionTitle, "max-w-[680px]")}>
            Lo que ya puedes traer a Costa Rica.
          </h2>
          <Link
            href={routes.marketplace}
            className="link-quiet inline-flex min-h-11 items-center gap-2 text-base font-semibold text-navy-900"
          >
            Ver todo el marketplace
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid snap-x snap-mandatory auto-cols-[minmax(280px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2">
          {showcaseProviders.map((provider) => (
            <Link
              key={provider.name}
              href={routes.provider(slug(provider.name))}
              className="flex snap-start flex-col overflow-hidden rounded-card border border-[rgba(11,27,51,0.07)] bg-white text-navy-900 no-underline transition-[box-shadow,border-color] duration-200 hover:border-[rgba(11,27,51,0.16)] hover:shadow-[0_14px_32px_rgba(11,27,51,0.10)]"
            >
              <div aria-hidden="true" className="grid h-[180px] grid-cols-[2fr_1fr] grid-rows-2 gap-[3px]">
                <span className="relative row-span-2 grid place-items-center bg-[#E7E3DA] text-neutral-dot">
                  <ImageIcon size={22} strokeWidth={1.4} aria-hidden="true" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[rgba(6,16,36,0.75)] px-[9px] py-[3px] text-xs text-white">
                    {provider.photoCaption}
                  </span>
                </span>
                <span className="bg-surface-muted" />
                <span className="bg-line-soft" />
              </div>
              <div className="flex flex-col gap-2 px-[22px] pt-5 pb-[22px]">
                <span className={eyebrow}>{provider.category}</span>
                <span className="font-display text-[19px] font-bold">{provider.name}</span>
                <span className="text-sm text-subtle">{provider.meta}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
