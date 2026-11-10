import { routes } from "@/shared/lib/routes";
import { countryName, type CountryCode } from "@/shared/ui/Flag";
import { searchCatalog, type RouteDirection, type SearchEntry, type SearchMode } from "./fixtures";

/** Origen y destino de un sentido de la ruta. */
export function routeEnds(direction: RouteDirection): [CountryCode, CountryCode] {
  return direction === "CO-CR" ? ["CO", "CR"] : ["CR", "CO"];
}

/** Sentido contrario de la ruta. */
export function reverseRoute(direction: RouteDirection): RouteDirection {
  return direction === "CO-CR" ? "CR-CO" : "CO-CR";
}

type SearchInput = { mode: SearchMode; query: string; category: string; direction: RouteDirection };

/** Filtra el catálogo de ejemplo: los productos por país de origen, y todo por categoría y texto. */
export function searchEntries({ mode, query, category, direction }: SearchInput): SearchEntry[] {
  const text = query.trim().toLowerCase();
  const [origin] = routeEnds(direction);
  return searchCatalog[mode].filter(
    (entry) =>
      (mode === "services" || entry.originCountry === origin) &&
      (!category || entry.category === category) &&
      (!text || `${entry.name} ${entry.category} ${entry.keywords}`.toLowerCase().includes(text)),
  );
}

/** Encabezado de los resultados: «Destacados» sin filtros o el conteo, más la ruta. */
export function resultsLabel({ mode, query, category, direction }: SearchInput, total: number): string {
  const [from, to] = routeEnds(direction);
  const route = `${countryName[from]} → ${countryName[to]}`;
  if (!query.trim() && !category) return `Destacados · ${route}`;
  const noun =
    mode === "products"
      ? total === 1
        ? "proveedor encontrado"
        : "proveedores encontrados"
      : total === 1
        ? "operador encontrado"
        : "operadores encontrados";
  return `${total} ${noun} · ${route}`;
}

/** Enlace al marketplace con la búsqueda de la portada. */
export function marketplaceSearchHref(mode: SearchMode, query: string, direction: RouteDirection): string {
  const params = new URLSearchParams({ tab: mode });
  const text = query.trim();
  if (text) params.set("q", text);
  params.set("route", direction);
  return `${routes.marketplace}?${params.toString()}`;
}
