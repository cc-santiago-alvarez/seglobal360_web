import type { CountryCode } from "@/shared/ui/Flag";
import {
  normalizeText,
  type CorridorCode,
  type MinOrderBucket,
  type ProductCategoryCode,
  type ServiceCategoryCode,
  type SupplierTypeCode,
  type TransportTypeCode,
} from "./catalog";
import type { ServiceListing, SupplierListing } from "./fixtures";

/** Resultados por página del marketplace. */
export const pageSize = 6;

/** Filtros del listado de servicios. */
export interface ServiceFilters {
  corridor: CorridorCode;
  category: ServiceCategoryCode | "all";
  transports: TransportTypeCode[];
  query: string;
}

/** Filtros del listado de proveedores. */
export interface SupplierFilters {
  category: ProductCategoryCode | "all";
  origin: CountryCode | "all";
  types: SupplierTypeCode[];
  minOrder: MinOrderBucket[];
  query: string;
}

function matchesQuery(searchText: string, query: string): boolean {
  const needle = normalizeText(query.trim());
  return needle === "" || searchText.includes(needle);
}

function inBucket(amount: number, bucket: MinOrderBucket): boolean {
  return bucket === "up_to_1000" ? amount <= 1000_00 : amount > 1000_00;
}

/** Servicios que cumplen los filtros; una lista vacía de opciones no filtra. */
export function filterServices(items: ServiceListing[], filters: ServiceFilters): ServiceListing[] {
  return items.filter(
    (item) =>
      item.corridors.includes(filters.corridor) &&
      (filters.category === "all" || item.category === filters.category) &&
      (filters.transports.length === 0 || item.transportTypes.some((code) => filters.transports.includes(code))) &&
      matchesQuery(item.searchText, filters.query),
  );
}

/** Proveedores que cumplen los filtros; una lista vacía de opciones no filtra. */
export function filterSuppliers(items: SupplierListing[], filters: SupplierFilters): SupplierListing[] {
  return items.filter(
    (item) =>
      (filters.category === "all" || item.categories.includes(filters.category)) &&
      (filters.origin === "all" || item.countryCode === filters.origin) &&
      (filters.types.length === 0 || filters.types.includes(item.supplierType)) &&
      (filters.minOrder.length === 0 ||
        filters.minOrder.some((bucket) => inBucket(item.conditions.minOrder.amount, bucket))) &&
      matchesQuery(item.searchText, filters.query),
  );
}

/** Página de resultados: los elementos visibles, el total de páginas y el rango mostrado. */
export function paginate<T>(items: T[], page: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    pageCount,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, items.length),
    total: items.length,
  };
}
