"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { Flag } from "@/shared/ui/Flag";
import { chipClass, Segmented } from "@/shared/ui/Toggles";
import {
  corridorPorts,
  searchCategories,
  searchModes,
  transitTimes,
  type RouteDirection,
  type SearchMode,
} from "./fixtures";
import { GlassChip } from "./GlassChip";
import { ResultRow } from "./ResultRow";
import { RouteToggle } from "./RouteToggle";
import { marketplaceSearchHref, resultsLabel, reverseRoute, routeEnds, searchEntries } from "./search";
import { SearchBox } from "./SearchBox";
import { container } from "./styles";

const copy: Record<SearchMode, { label: string; placeholder: string }> = {
  products: { label: "Buscar productos o proveedores", placeholder: "Busca celulares, labiales, balones…" },
  services: { label: "Buscar servicios logísticos", placeholder: "Busca contenedor, aduana, bodega…" },
};

/** Contenido de la portada: el texto que recibe, la ruta de ejemplo y el buscador con resultados en vivo. */
export function HeroSearch({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("products");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [direction, setDirection] = useState<RouteDirection>("CO-CR");

  const [from, to] = routeEnds(direction);
  const search = { mode, query, category, direction };
  const matches = searchEntries(search);
  const href = marketplaceSearchHref(mode, query, direction);

  const pickMode = (next: SearchMode) => {
    setMode(next);
    setCategory("");
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <div className={cn(container, "flex flex-wrap items-center gap-x-14 gap-y-10")}>
      <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
        {children}
        <ul aria-label="Ruta de ejemplo" className="m-0 flex list-none flex-wrap gap-2 p-0">
          <GlassChip className="font-semibold">
            <Flag code={from} />
            {corridorPorts[from]}
            <span aria-hidden="true" className="text-gold-300">
              →
            </span>
            <span className="visually-hidden">a</span>
            <Flag code={to} />
            {corridorPorts[to]}
          </GlassChip>
          {transitTimes.map((transit) => (
            <GlassChip key={transit.mode}>
              <strong className="font-semibold">{transit.mode}</strong> · {transit.transitTime}
            </GlassChip>
          ))}
        </ul>
      </div>

      <div className="min-w-0 max-w-[580px] flex-[1_1_440px] text-navy-900">
        <form
          role="search"
          aria-label="Buscar en el marketplace"
          onSubmit={submit}
          className="relative flex flex-col gap-2.5 rounded-[26px] border border-[rgba(11,27,51,0.08)] bg-white p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Segmented label="Qué buscas" options={searchModes} value={mode} onChange={pickMode} />
            <RouteToggle direction={direction} onSwap={() => setDirection(reverseRoute(direction))} />
          </div>

          <SearchBox
            label={copy[mode].label}
            placeholder={copy[mode].placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            action={
              <Link
                href={href}
                aria-label="Buscar en el marketplace"
                className="lift inline-flex min-h-[52px] min-w-[52px] shrink-0 items-center justify-center gap-2.5 rounded-btn-lg bg-gold-500 px-[18px] text-base font-semibold text-navy-950 no-underline"
              >
                <span className="max-[520px]:hidden">Buscar</span>
                <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>
            }
          />

          <div role="group" aria-label="Categorías" className="flex flex-wrap gap-1.5 px-1 pt-0.5 pb-1">
            {searchCategories[mode].map((label) => {
              const active = label === category;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(active ? "" : label)}
                  className={chipClass(active)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div aria-live="polite" className="border-t border-[rgba(11,27,51,0.07)] px-1 pt-1.5 pb-0.5">
            <p className="mx-2.5 mt-1.5 mb-2 font-sans text-[13px] font-semibold tracking-[0.02em] text-subtle">
              {resultsLabel(search, matches.length)}
            </p>
            {matches.length > 0 ? (
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                {matches.slice(0, 3).map((entry) => (
                  <li key={entry.href}>
                    <ResultRow
                      href={entry.href}
                      initials={entry.initials}
                      name={entry.name}
                      meta={entry.summary}
                      tag={entry.category}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 px-2.5 pt-1 pb-2.5 text-sm leading-normal text-ink">
                No encontramos coincidencias en esta ruta.{" "}
                <Link href={routes.getQuote} className="font-semibold text-gold-text underline">
                  Pide una cotización directa
                </Link>{" "}
                y tu asesor lo busca por ti.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
