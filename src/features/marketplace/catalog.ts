import { countryName, type CountryCode } from "@/shared/ui/Flag";

/** Corredor activo del marketplace: país de origen y de destino. */
export type CorridorCode = "CO-CR" | "CR-CO";

/** Corredores en el orden en que se ofrecen. */
export const corridorCodes: readonly CorridorCode[] = ["CO-CR", "CR-CO"];

/** Corredor por defecto del marketplace. */
export const defaultCorridor: CorridorCode = "CO-CR";

/** País de origen de un corredor. */
export function corridorOrigin(code: CorridorCode): CountryCode {
  return code === "CO-CR" ? "CO" : "CR";
}

/** País de destino de un corredor. */
export function corridorDestination(code: CorridorCode): CountryCode {
  return code === "CO-CR" ? "CR" : "CO";
}

/** Corredor que sale de un país. */
export function corridorFrom(origin: CountryCode): CorridorCode {
  return origin === "CO" ? "CO-CR" : "CR-CO";
}

/** Nombre del corredor: «Colombia → Costa Rica». */
export function corridorLabel(code: CorridorCode): string {
  return `${countryName[corridorOrigin(code)]} → ${countryName[corridorDestination(code)]}`;
}

/** Ruta de un servicio: «Colombia → Costa Rica», o el país si opera en uno solo. */
export function routeLabel(origin: CountryCode, destination: CountryCode | null): string {
  return destination ? `${countryName[origin]} → ${countryName[destination]}` : countryName[origin];
}

/** País del otro extremo del corredor Colombia ↔ Costa Rica. */
export function otherCountry(code: CountryCode): CountryCode {
  return code === "CO" ? "CR" : "CO";
}

/** Pestaña del marketplace: servicios logísticos o proveedores de productos. */
export type MarketTab = "services" | "products";

/** Primer valor de un parámetro de búsqueda. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Pestaña a partir de `?tab=`; por defecto, servicios. */
export function parseTab(value: string | undefined): MarketTab {
  return value === "products" ? "products" : "services";
}

/** Corredor a partir de `?route=`, o `null` si no viene o no es válido. */
export function parseCorridor(value: string | undefined): CorridorCode | null {
  return value === "CO-CR" || value === "CR-CO" ? value : null;
}

/** Tipo de transporte, con el código del catálogo `transport_types`. */
export type TransportTypeCode = "sea" | "air" | "land" | "courier" | "multimodal";

/** Tipos de transporte en el orden de los filtros. */
export const transportTypeCodes: readonly TransportTypeCode[] = ["sea", "air", "land", "courier", "multimodal"];

/** Nombre visible de cada tipo de transporte. */
export const transportTypeLabel: Record<TransportTypeCode, string> = {
  sea: "Marítimo",
  air: "Aéreo",
  land: "Terrestre",
  courier: "Mensajería internacional",
  multimodal: "Multimodal",
};

/** Categoría de servicio logístico, con el código de `service_categories`. */
export type ServiceCategoryCode =
  | "sea_freight"
  | "air_freight"
  | "land_freight"
  | "customs_brokerage"
  | "warehousing"
  | "courier"
  | "consolidation"
  | "cargo_insurance";

/** Categorías de servicio en el orden de los chips. */
export const serviceCategoryCodes: readonly ServiceCategoryCode[] = [
  "sea_freight",
  "air_freight",
  "land_freight",
  "customs_brokerage",
  "warehousing",
  "courier",
  "consolidation",
  "cargo_insurance",
];

/** Nombre visible de cada categoría de servicio. */
export const serviceCategoryLabel: Record<ServiceCategoryCode, string> = {
  sea_freight: "Transporte marítimo",
  air_freight: "Transporte aéreo",
  land_freight: "Transporte terrestre",
  customs_brokerage: "Agenciamiento aduanero",
  warehousing: "Bodegaje",
  courier: "Mensajería internacional",
  consolidation: "Consolidación de carga",
  cargo_insurance: "Seguro de carga",
};

/** Categoría de producto de los proveedores mayoristas. */
export type ProductCategoryCode = "technology" | "beauty" | "sports" | "home" | "fashion" | "food";

/** Categorías de producto en el orden de los chips. */
export const productCategoryCodes: readonly ProductCategoryCode[] = [
  "technology",
  "beauty",
  "sports",
  "home",
  "fashion",
  "food",
];

/** Nombre visible de cada categoría de producto. */
export const productCategoryLabel: Record<ProductCategoryCode, string> = {
  technology: "Tecnología",
  beauty: "Maquillaje y belleza",
  sports: "Deporte",
  home: "Hogar",
  fashion: "Moda",
  food: "Alimentos y bebidas",
};

/** Tipo de proveedor mayorista. */
export type SupplierTypeCode = "wholesaler" | "manufacturer" | "authorized_distributor" | "producer";

/** Tipos de proveedor en el orden de los filtros. */
export const supplierTypeCodes: readonly SupplierTypeCode[] = [
  "wholesaler",
  "manufacturer",
  "authorized_distributor",
  "producer",
];

/** Nombre visible de cada tipo de proveedor. */
export const supplierTypeLabel: Record<SupplierTypeCode, string> = {
  wholesaler: "Mayorista",
  manufacturer: "Fabricante",
  authorized_distributor: "Distribuidor autorizado",
  producer: "Productor",
};

/** Rango del filtro de pedido mínimo. */
export type MinOrderBucket = "up_to_1000" | "over_1000";

/** Rangos de pedido mínimo en el orden de los filtros. */
export const minOrderBuckets: ReadonlyArray<{ id: MinOrderBucket; label: string }> = [
  { id: "up_to_1000", label: "Hasta USD 1.000" },
  { id: "over_1000", label: "Más de USD 1.000" },
];

/** Monto en unidades menores y moneda ISO 4217, como `money.Money` del backend. */
export interface Money {
  amount: number;
  currency: string;
}

/** Monto sin decimales y con punto de miles: «USD 2.000». */
export function formatMoney(money: Money): string {
  const units = Math.round(money.amount / 100).toString();
  return `${money.currency} ${units.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Texto en minúsculas y sin tildes, para comparar búsquedas. */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Singular o plural según la cantidad: «1 servicio», «6 servicios». */
export function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
