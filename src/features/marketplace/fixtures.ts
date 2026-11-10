import type { ProviderStatus } from "@/features/provider/model";
import type { ServiceStatus } from "@/features/service/model";
import { slug } from "@/shared/lib/routes";
import type { CountryCode } from "@/shared/ui/Flag";
import {
  normalizeText,
  productCategoryLabel,
  serviceCategoryLabel,
  supplierTypeLabel,
  transportTypeLabel,
  type CorridorCode,
  type Money,
  type ProductCategoryCode,
  type ServiceCategoryCode,
  type SupplierTypeCode,
  type TransportTypeCode,
} from "./catalog";

interface ProviderBase {
  /** `slug(name)`: la landing enlaza con este id. */
  id: string;
  name: string;
  /** Iniciales del logo, tal como las muestra el diseño. */
  initials: string;
  status: ProviderStatus;
  countryCode: CountryCode;
  summary: string;
  about: string | null;
  yearsInMarket: number | null;
  /** Mes de alta en la plataforma, ya formateado («octubre de 2026»). */
  memberSince: string | null;
  /** Términos extra para el buscador. */
  keywords: string[];
}

/** Condiciones comerciales públicas de un proveedor mayorista. */
export interface SupplierConditions {
  minOrder: Money;
  leadTime: string;
  warranty: string;
  billing: string;
}

/** Perfil público de un proveedor mayorista de productos. */
export interface SupplierProfile extends ProviderBase {
  kind: "supplier";
  supplierType: SupplierTypeCode;
  city: string;
  categories: ProductCategoryCode[];
  productLines: string[];
  conditions: SupplierConditions;
  /** Pies de foto de la galería; vacía si aún no ha publicado fotos. */
  gallery: string[];
}

/** Perfil público de un operador logístico. */
export interface LogisticsProfile extends ProviderBase {
  kind: "logistics";
  coverage: CountryCode[];
  capabilities: string[];
  certifications: string[];
  /** Servicio que la landing muestra junto a su nombre. */
  featuredServiceId: string;
}

/** Proveedor publicado en el marketplace. */
export type MarketplaceProvider = SupplierProfile | LogisticsProfile;

/** Servicio logístico publicado por un operador. */
export interface MarketplaceService {
  /** `slug(name)`. */
  id: string;
  name: string;
  status: ServiceStatus;
  providerId: string;
  category: ServiceCategoryCode;
  transportTypes: TransportTypeCode[];
  originCountry: CountryCode;
  /** `null` si el servicio se presta dentro de un solo país. */
  destinationCountry: CountryCode | null;
  corridors: CorridorCode[];
  /** Tránsito estimado ya formateado («6–9 días»). */
  transitTime: string | null;
  description: string | null;
  conditions: string[];
}

/** Servicio con los datos de su operador, tal como lo lista el marketplace. */
export interface ServiceListing extends MarketplaceService {
  provider: { id: string; name: string; initials: string };
  /** Texto normalizado sobre el que filtra el buscador. */
  searchText: string;
}

/** Proveedor mayorista con el texto que usa el buscador. */
export interface SupplierListing extends SupplierProfile {
  searchText: string;
}

function supplier(data: Omit<SupplierProfile, "id" | "kind" | "status">): SupplierProfile {
  return { id: slug(data.name), kind: "supplier", status: "published", ...data };
}

function operator(data: Omit<LogisticsProfile, "id" | "kind" | "status">): LogisticsProfile {
  return { id: slug(data.name), kind: "logistics", status: "published", ...data };
}

function service(data: Omit<MarketplaceService, "id" | "status">): MarketplaceService {
  return { id: slug(data.name), status: "published", ...data };
}

const usd = (units: number): Money => ({ amount: units * 100, currency: "USD" });

const suppliers: SupplierProfile[] = [
  supplier({
    name: "TecnoAndina Distribuciones",
    initials: "TA",
    supplierType: "wholesaler",
    city: "Medellín",
    countryCode: "CO",
    yearsInMarket: 8,
    memberSince: "octubre de 2026",
    summary: "Celulares, portátiles y accesorios de marcas reconocidas, con garantía y despacho por volumen.",
    about:
      "Distribuimos tecnología a tiendas y cadenas de retail desde Medellín. Trabajamos con inventario propio y acompañamos la garantía con el fabricante.",
    categories: ["technology"],
    productLines: ["Celulares", "Computadores", "Audio", "Accesorios"],
    conditions: {
      minOrder: usd(2000),
      leadTime: "3–5 días hábiles",
      warranty: "12 meses de fábrica",
      billing: "Exportación con certificado de origen",
    },
    gallery: [
      "Celulares",
      "Portátiles",
      "Audífonos inalámbricos",
      "Tabletas",
      "Relojes inteligentes",
      "Cargadores y cables",
      "Parlantes",
      "Accesorios para celular",
      "Monitores",
      "Teclados y mouse",
      "Cámaras de seguridad",
      "Consolas",
    ],
    keywords: ["celulares", "portátiles", "audífonos", "tablets", "computadores", "tecnología"],
  }),
  supplier({
    name: "Belleza Natural Co.",
    initials: "BN",
    supplierType: "manufacturer",
    city: "Bogotá",
    countryCode: "CO",
    yearsInMarket: 11,
    memberSince: "octubre de 2026",
    summary: "Maquillaje y cuidado de la piel con ingredientes naturales, con registro sanitario para Centroamérica.",
    about:
      "Fabricamos maquillaje y productos para el cuidado de la piel en Bogotá, con fórmulas de origen natural y registro sanitario vigente para Costa Rica.",
    categories: ["beauty"],
    productLines: ["Labiales", "Bases", "Cuidado facial", "Uñas"],
    conditions: {
      minOrder: usd(800),
      leadTime: "5–7 días hábiles",
      warranty: "Cambio por defecto de fábrica",
      billing: "Registro sanitario para Costa Rica",
    },
    gallery: [
      "Labiales",
      "Bases y correctores",
      "Cuidado facial",
      "Paletas de sombras",
      "Esmaltes",
      "Brochas",
      "Protector solar",
      "Kits de regalo",
      "Exhibidores para tienda",
    ],
    keywords: ["maquillaje", "labiales", "bases", "cuidado facial", "belleza", "cosméticos"],
  }),
  supplier({
    name: "Deportes Pura Vida",
    initials: "DP",
    supplierType: "authorized_distributor",
    city: "San José",
    countryCode: "CR",
    yearsInMarket: 6,
    memberSince: "septiembre de 2026",
    summary: "Ropa deportiva, balones y accesorios de entrenamiento para tiendas y gimnasios.",
    about:
      "Distribuimos artículos deportivos a tiendas, colegios y gimnasios en Centroamérica, con stock en San José y despachos semanales.",
    categories: ["sports", "fashion"],
    productLines: ["Balones", "Ropa deportiva", "Gimnasio", "Accesorios"],
    conditions: {
      minOrder: usd(1000),
      leadTime: "2–4 días hábiles",
      warranty: "6 meses",
      billing: "Factura electrónica de exportación",
    },
    gallery: [
      "Balones",
      "Ropa deportiva",
      "Accesorios de gimnasio",
      "Mancuernas",
      "Tenis",
      "Maletines",
      "Raquetas",
    ],
    keywords: ["deporte", "balones", "gimnasio", "ropa deportiva", "tenis"],
  }),
  supplier({
    name: "Hogar Caribe Mayorista",
    initials: "HC",
    supplierType: "wholesaler",
    city: "Barranquilla",
    countryCode: "CO",
    yearsInMarket: 14,
    memberSince: "octubre de 2026",
    summary: "Menaje, pequeños electrodomésticos y decoración para cadenas de retail.",
    about:
      "Abastecemos a cadenas de retail y almacenes con menaje, pequeños electrodomésticos y decoración, desde nuestra bodega en Barranquilla.",
    categories: ["home", "technology"],
    productLines: ["Pequeños electrodomésticos", "Menaje", "Decoración", "Textiles para el hogar"],
    conditions: {
      minOrder: usd(1500),
      leadTime: "4–6 días hábiles",
      warranty: "12 meses en electrodomésticos",
      billing: "Exportación con certificado de origen",
    },
    gallery: [
      "Pequeños electrodomésticos",
      "Menaje de cocina",
      "Decoración",
      "Licuadoras",
      "Ollas y sartenes",
      "Toallas y sábanas",
    ],
    keywords: ["hogar", "menaje", "electrodomésticos", "decoración", "cocina"],
  }),
  supplier({
    name: "Moda Textil Medellín",
    initials: "MT",
    supplierType: "manufacturer",
    city: "Medellín",
    countryCode: "CO",
    yearsInMarket: 20,
    memberSince: "agosto de 2026",
    summary: "Confección de ropa casual y deportiva, con colecciones por temporada y opción de marca blanca.",
    about:
      "Confeccionamos ropa casual y deportiva en Medellín, con colecciones por temporada, tallaje para Centroamérica y opción de marca blanca.",
    categories: ["fashion", "sports"],
    productLines: ["Jeans", "Camisetas", "Ropa deportiva", "Marca blanca"],
    conditions: {
      minOrder: usd(600),
      leadTime: "10–15 días hábiles",
      warranty: "Cambio por defecto de confección",
      billing: "Certificado de origen",
    },
    gallery: [
      "Jeans",
      "Camisetas",
      "Ropa deportiva",
      "Chaquetas",
      "Ropa infantil",
      "Pijamas",
      "Uniformes",
      "Etiquetado de marca blanca",
      "Empaque por talla",
      "Colección de temporada",
    ],
    keywords: ["moda", "ropa", "jeans", "camisetas", "textil", "marca blanca", "deportiva"],
  }),
  supplier({
    name: "Café de Origen Tarrazú",
    initials: "CT",
    supplierType: "producer",
    city: "Tarrazú",
    countryCode: "CR",
    yearsInMarket: 30,
    memberSince: "noviembre de 2026",
    summary: "Café de especialidad tostado y en grano verde, empacado para supermercados y cafeterías.",
    about:
      "Finca y tostadora familiar en Tarrazú. Vendemos café de especialidad tostado y en grano verde, empacado para supermercados y cafeterías.",
    categories: ["food"],
    productLines: ["Café tostado", "Grano verde", "Café molido"],
    conditions: {
      minOrder: usd(500),
      leadTime: "5–8 días hábiles",
      warranty: "No aplica",
      billing: "Registro sanitario y certificado fitosanitario",
    },
    gallery: [],
    keywords: ["café", "alimentos", "bebidas", "grano", "tostado"],
  }),
];

const caribeFreight = operator({
  name: "Caribe Freight Group",
  initials: "CF",
  countryCode: "CO",
  coverage: ["CO", "CR"],
  yearsInMarket: 12,
  memberSince: null,
  summary:
    "Operador de carga marítima con salidas semanales entre la costa caribe colombiana y Centroamérica, con oficinas en Cartagena y Limón.",
  about: null,
  capabilities: ["FCL y LCL", "Carga sobredimensionada"],
  certifications: ["BASC", "OEA"],
  featuredServiceId: slug("Flete marítimo FCL Cartagena → Puerto Limón"),
  keywords: ["marítimo", "contenedor", "fcl", "lcl", "consolidado", "barco", "flete"],
});

const aeroCarga = operator({
  name: "AeroCarga Andina",
  initials: "AA",
  countryCode: "CO",
  coverage: ["CO"],
  yearsInMarket: null,
  memberSince: null,
  summary: "Carga aérea consolidada desde Bogotá y Medellín.",
  about: null,
  capabilities: [],
  certifications: [],
  featuredServiceId: slug("Carga aérea consolidada desde Bogotá y Medellín"),
  keywords: ["aéreo", "avión", "carga aérea"],
});

const andinaCargo = operator({
  name: "Andina Cargo Logistics",
  initials: "AC",
  countryCode: "CO",
  coverage: ["CO"],
  yearsInMarket: null,
  memberSince: null,
  summary: "Acarreo de contenedor puerto – bodega y pólizas de carga por embarque.",
  about: null,
  capabilities: [],
  certifications: [],
  featuredServiceId: slug("Acarreo de contenedor puerto – bodega"),
  keywords: ["terrestre", "camión", "acarreo", "seguro", "póliza"],
});

const aduanasIntegrales = operator({
  name: "Aduanas Integrales CR",
  initials: "AI",
  countryCode: "CR",
  coverage: ["CR"],
  yearsInMarket: null,
  memberSince: null,
  summary: "Nacionalización de importaciones en Costa Rica.",
  about: null,
  capabilities: [],
  certifications: [],
  featuredServiceId: slug("Nacionalización de importaciones en Costa Rica"),
  keywords: ["aduana", "nacionalización", "agenciamiento", "importación"],
});

const bodegasAtlantico = operator({
  name: "Bodegas del Atlántico",
  initials: "BA",
  countryCode: "CR",
  coverage: ["CR"],
  yearsInMarket: null,
  memberSince: null,
  summary: "Bodegaje y cross-docking junto a Puerto Moín.",
  about: null,
  capabilities: [],
  certifications: [],
  featuredServiceId: slug("Bodegaje y cross-docking en Puerto Moín"),
  keywords: ["bodega", "bodegaje", "almacenamiento", "cross docking", "inventario"],
});

const operators: LogisticsProfile[] = [caribeFreight, aeroCarga, andinaCargo, aduanasIntegrales, bodegasAtlantico];

const services: MarketplaceService[] = [
  service({
    name: "Flete marítimo FCL Cartagena → Puerto Limón",
    providerId: caribeFreight.id,
    category: "sea_freight",
    transportTypes: ["sea"],
    originCountry: "CO",
    destinationCountry: "CR",
    corridors: ["CO-CR"],
    transitTime: "6–9 días",
    description:
      "Contenedores completos de 20' y 40' desde el puerto de Cartagena hasta Puerto Limón / Moín. Incluye reserva de espacio con la naviera, emisión del conocimiento de embarque (BL) y seguimiento del contenedor hasta su descargue.",
    conditions: [
      "Carga general no peligrosa; la carga refrigerada se cotiza aparte.",
      "No incluye el acarreo terrestre en origen ni la nacionalización en destino.",
      "Los tiempos de tránsito dependen de la salida programada de la naviera.",
    ],
  }),
  service({
    name: "Consolidación LCL semanal desde Cartagena",
    providerId: caribeFreight.id,
    category: "consolidation",
    transportTypes: ["sea"],
    originCountry: "CO",
    destinationCountry: "CR",
    corridors: ["CO-CR"],
    transitTime: "10–14 días",
    description: null,
    conditions: [],
  }),
  service({
    name: "Nacionalización de importaciones en Costa Rica",
    providerId: aduanasIntegrales.id,
    category: "customs_brokerage",
    transportTypes: ["sea", "air", "land"],
    originCountry: "CO",
    destinationCountry: "CR",
    corridors: ["CO-CR"],
    transitTime: null,
    description: null,
    conditions: [],
  }),
  service({
    name: "Bodegaje y cross-docking en Puerto Moín",
    providerId: bodegasAtlantico.id,
    category: "warehousing",
    transportTypes: ["sea", "multimodal"],
    originCountry: "CR",
    destinationCountry: null,
    corridors: ["CO-CR"],
    transitTime: null,
    description: null,
    conditions: [],
  }),
  service({
    name: "Póliza de carga por embarque",
    providerId: andinaCargo.id,
    category: "cargo_insurance",
    transportTypes: ["sea", "air"],
    originCountry: "CO",
    destinationCountry: "CR",
    corridors: ["CO-CR"],
    transitTime: null,
    description: null,
    conditions: [],
  }),
  service({
    name: "Acarreo de contenedor puerto – bodega",
    providerId: andinaCargo.id,
    category: "land_freight",
    transportTypes: ["land", "sea"],
    originCountry: "CO",
    destinationCountry: null,
    corridors: ["CO-CR"],
    transitTime: "1–2 días",
    description: null,
    conditions: [],
  }),
  service({
    name: "Flete marítimo FCL Puerto Limón → Cartagena",
    providerId: caribeFreight.id,
    category: "sea_freight",
    transportTypes: ["sea"],
    originCountry: "CR",
    destinationCountry: "CO",
    corridors: ["CR-CO"],
    transitTime: "7–10 días",
    description: null,
    conditions: [],
  }),
  service({
    name: "Carga aérea consolidada desde Bogotá y Medellín",
    providerId: aeroCarga.id,
    category: "air_freight",
    transportTypes: ["air"],
    originCountry: "CO",
    destinationCountry: "CR",
    corridors: ["CO-CR"],
    transitTime: null,
    description: null,
    conditions: [],
  }),
];

const providers: MarketplaceProvider[] = [...suppliers, ...operators];

/** Todos los proveedores publicados (mayoristas y operadores). */
export function listProviders(): MarketplaceProvider[] {
  return providers;
}

/** Todos los servicios publicados. */
export function listAllServices(): MarketplaceService[] {
  return services;
}

/** Proveedor por id. */
export function findProvider(id: string): MarketplaceProvider | undefined {
  return providers.find((provider) => provider.id === id);
}

/** Operador logístico por id. */
export function findOperator(id: string): LogisticsProfile | undefined {
  return operators.find((provider) => provider.id === id);
}

/** Servicio por id. */
export function findService(id: string): MarketplaceService | undefined {
  return services.find((item) => item.id === id);
}

/** Servicios publicados por un operador, en el orden del marketplace. */
export function servicesOf(providerId: string): MarketplaceService[] {
  return services.filter((item) => item.providerId === providerId);
}

/** Servicios con su operador y el texto del buscador, para el listado del marketplace. */
export function listServices(): ServiceListing[] {
  return services.flatMap((item) => {
    const owner = findOperator(item.providerId);
    if (!owner) return [];
    const searchText = normalizeText(
      [
        item.name,
        serviceCategoryLabel[item.category],
        owner.name,
        ...item.transportTypes.map((code) => transportTypeLabel[code]),
        ...owner.keywords,
      ].join(" "),
    );
    return [{ ...item, provider: { id: owner.id, name: owner.name, initials: owner.initials }, searchText }];
  });
}

/** Proveedores mayoristas con el texto del buscador, para el listado del marketplace. */
export function listSuppliers(): SupplierListing[] {
  return suppliers.map((item) => ({
    ...item,
    searchText: normalizeText(
      [
        item.name,
        supplierTypeLabel[item.supplierType],
        item.city,
        item.summary,
        ...item.categories.map((code) => productCategoryLabel[code]),
        ...item.productLines,
        ...item.gallery,
        ...item.keywords,
      ].join(" "),
    ),
  }));
}
