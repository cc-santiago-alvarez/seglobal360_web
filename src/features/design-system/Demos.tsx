"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { searchCategories, searchModes, type RouteDirection, type SearchMode } from "@/features/site/fixtures";
import { RouteToggle } from "@/features/site/RouteToggle";
import { reverseRoute } from "@/features/site/search";
import { SearchBox } from "@/features/site/SearchBox";
import { chipClass, Segmented } from "@/shared/ui/Toggles";

/** Selector Productos / Servicios y ruta que se invierte, como en la portada. */
export function ModeRouteDemo() {
  const [mode, setMode] = useState<SearchMode>("products");
  const [direction, setDirection] = useState<RouteDirection>("CO-CR");
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Segmented label="Qué buscas" options={searchModes} value={mode} onChange={setMode} />
      <RouteToggle direction={direction} onSwap={() => setDirection(reverseRoute(direction))} />
    </div>
  );
}

/** Campo de búsqueda y chips de categoría que se marcan de a varios. */
export function SearchCategoriesDemo() {
  const [selected, setSelected] = useState<string[]>(["Tecnología"]);
  const toggle = (label: string) =>
    setSelected((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));

  return (
    <>
      <SearchBox
        label="Buscar productos o proveedores"
        placeholder="Busca celulares, labiales, balones…"
        action={
          <span className="inline-flex min-h-[52px] shrink-0 items-center gap-2.5 rounded-btn-lg bg-gold-500 px-[18px] text-base font-semibold text-navy-950">
            Buscar
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </span>
        }
      />
      <div role="group" aria-label="Categorías" className="flex flex-wrap gap-1.5">
        {searchCategories.products.map((label) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(label)}
              className={chipClass(active)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
