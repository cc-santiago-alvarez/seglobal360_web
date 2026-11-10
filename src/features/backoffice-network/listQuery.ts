import type { CompanyStatus } from "@/features/company/model";
import type { ProviderKind, ProviderStatus } from "@/features/provider/model";

/** `searchParams` de una página, como los entrega Next. */
export type SearchParams = Record<string, string | string[] | undefined>;

/** Filtros y selección de un listado con detalle: `?status=&type=&q=&selected=`. */
export interface ListQuery<S extends string, T extends string> {
  status: S;
  type: T;
  q: string;
  selected: string | null;
}

/** Valores admitidos y por defecto de cada filtro de un listado. */
export interface ListQuerySpec<S extends string, T extends string> {
  statuses: readonly S[];
  types: readonly T[];
  defaultStatus: S;
  defaultType: T;
}

/** Filtro de estado de las empresas. */
export type CompanyFilter = CompanyStatus | "all";
/** Filtro de estado de los proveedores. */
export type ProviderFilter = Extract<ProviderStatus, "in_review" | "approved" | "published"> | "all";
/** Filtro de tipo de los proveedores. */
export type ProviderKindFilter = ProviderKind | "all";

/** Consulta del listado de empresas (sin filtro de tipo). */
export type CompanyQuery = ListQuery<CompanyFilter, "all">;
/** Consulta del listado de proveedores. */
export type ProviderQuery = ListQuery<ProviderFilter, ProviderKindFilter>;

/** Filtros del listado de empresas, en el orden de sus pestañas. */
export const companyQuerySpec: ListQuerySpec<CompanyFilter, "all"> = {
  statuses: ["pending_validation", "all", "active", "suspended", "inactive"],
  types: ["all"],
  defaultStatus: "pending_validation",
  defaultType: "all",
};

/** Filtros del listado de proveedores, en el orden de sus pestañas. */
export const providerQuerySpec: ListQuerySpec<ProviderFilter, ProviderKindFilter> = {
  statuses: ["in_review", "approved", "published", "all"],
  types: ["all", "supplier", "logistics"],
  defaultStatus: "in_review",
  defaultType: "all",
};

function oneOf<V extends string>(options: readonly V[], value: string | undefined, fallback: V): V {
  return options.find((option) => option === value) ?? fallback;
}

/** Lee la consulta de un listado; lo que no es válido toma el valor por defecto. */
export function readListQuery<S extends string, T extends string>(
  spec: ListQuerySpec<S, T>,
  read: (key: string) => string | undefined,
): ListQuery<S, T> {
  return {
    status: oneOf(spec.statuses, read("status"), spec.defaultStatus),
    type: oneOf(spec.types, read("type"), spec.defaultType),
    q: (read("q") ?? "").slice(0, 100),
    selected: read("selected") || null,
  };
}

/** Lector de los `searchParams` de una página: toma el primer valor de cada clave. */
export function fromSearchParams(params: SearchParams): (key: string) => string | undefined {
  return (key) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
}

/** Cadena `?…` de una consulta, sin los valores por defecto. */
export function listQueryString<S extends string, T extends string>(
  spec: ListQuerySpec<S, T>,
  query: ListQuery<S, T>,
): string {
  const params = new URLSearchParams();
  if (query.status !== spec.defaultStatus) params.set("status", query.status);
  if (query.type !== spec.defaultType) params.set("type", query.type);
  if (query.q.trim()) params.set("q", query.q);
  if (query.selected) params.set("selected", query.selected);
  const search = params.toString();
  return search ? `?${search}` : "";
}
