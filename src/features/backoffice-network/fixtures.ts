import type { ClientStage } from "@/features/client/model";
import type { CompanyStatus, CompanyType } from "@/features/company/model";
import type { CorridorStatus } from "@/features/corridor/model";
import type { ProviderKind, ProviderStatus } from "@/features/provider/model";
import type { ServiceStatus } from "@/features/service/model";
import type { UserStatus } from "@/features/user/model";
import type { CurrencyCode, Money } from "./money";

/** Instante de referencia de los datos de ejemplo: «hoy» para vigencias y reglas. */
export const demoNow = "2026-11-10T16:20:00Z";

/** Quién firma las acciones de ejemplo y cuándo, como se pinta en el historial. */
export const demoActor = { name: "Andrés Rojas", at: "10 nov 2026, 11:20" } as const;

/** Países de los corredores, por código ISO 3166-1. */
export type NetworkCountryCode = "CO" | "CR" | "PA";

/** Nombre en español de cada país. */
export const countries: Record<NetworkCountryCode, string> = { CO: "Colombia", CR: "Costa Rica", PA: "Panamá" };

/** Tipos de documento de una empresa. */
export type DocumentTypeCode = "NIT" | "CJ";

/** Nombre visible de cada tipo de documento. */
export const documentTypes: Record<DocumentTypeCode, string> = { NIT: "NIT", CJ: "Cédula jurídica" };

/** Usuario de una empresa, como lo lista el backoffice. */
export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
}

/** Empresa registrada, con los campos del DTO `companies` que pinta el backoffice. */
export interface NetworkCompany {
  id: string;
  legalName: string;
  tradeName: string;
  documentTypeCode: DocumentTypeCode;
  documentNumber: string;
  countryCode: NetworkCountryCode;
  companyType: CompanyType;
  status: CompanyStatus;
  statusReason: string | null;
  billingCurrency: CurrencyCode;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  /** Solo en las empresas cliente. */
  clientStage?: ClientStage;
  users: CompanyUser[];
}

/** Empresas de ejemplo, de la más reciente a la más antigua. */
export const companies: NetworkCompany[] = [
  {
    id: "c10",
    legalName: "Textiles del Valle S.A.S.",
    tradeName: "Textiles del Valle",
    documentTypeCode: "NIT",
    documentNumber: "901.234.567-8",
    countryCode: "CO",
    companyType: "supplier",
    status: "pending_validation",
    statusReason: null,
    billingCurrency: "COP",
    contactEmail: "gerencia@textilesdelvalle.example",
    contactPhone: "+57 312 000 0000",
    createdAt: "2026-11-10T14:05:00Z",
    users: [
      { id: "u101", name: "Camilo Ríos", email: "camilo@textilesdelvalle.example", role: "Administrador", status: "pending_verification" },
    ],
  },
  {
    id: "c09",
    legalName: "Importadora Pacífico Verde S.A.",
    tradeName: "Pacífico Verde",
    documentTypeCode: "CJ",
    documentNumber: "3-101-123456",
    countryCode: "CR",
    companyType: "client",
    status: "pending_validation",
    statusReason: null,
    billingCurrency: "CRC",
    contactEmail: "compras@pacificoverde.example",
    contactPhone: "+506 8000 0000",
    createdAt: "2026-11-09T15:40:00Z",
    clientStage: "registered",
    users: [
      { id: "u091", name: "Daniela Mora", email: "daniela@pacificoverde.example", role: "Administradora", status: "active" },
    ],
  },
  {
    id: "c08",
    legalName: "Electro Hogar del Pacífico S.A.S.",
    tradeName: "Electro Hogar del Pacífico",
    documentTypeCode: "NIT",
    documentNumber: "900.645.118-2",
    countryCode: "CO",
    companyType: "supplier",
    status: "active",
    statusReason: null,
    billingCurrency: "COP",
    contactEmail: "ventas@electrohogar.example",
    contactPhone: "+57 315 000 0000",
    createdAt: "2026-10-30T13:10:00Z",
    users: [
      { id: "u081", name: "Julián Torres", email: "julian@electrohogar.example", role: "Administrador", status: "active" },
    ],
  },
  {
    id: "c07",
    legalName: "TecnoAndina Distribuciones S.A.S.",
    tradeName: "TecnoAndina Distribuciones",
    documentTypeCode: "NIT",
    documentNumber: "900.874.112-5",
    countryCode: "CO",
    companyType: "supplier",
    status: "active",
    statusReason: null,
    billingCurrency: "COP",
    contactEmail: "ventas@tecnoandina.example",
    contactPhone: "+57 300 000 0000",
    createdAt: "2026-10-14T16:00:00Z",
    users: [
      { id: "u071", name: "Laura Restrepo", email: "laura@tecnoandina.example", role: "Administradora", status: "active" },
    ],
  },
  {
    id: "c06",
    legalName: "Caribe Freight Group S.A.S.",
    tradeName: "Caribe Freight Group",
    documentTypeCode: "NIT",
    documentNumber: "901.555.210-3",
    countryCode: "CO",
    companyType: "logistics",
    status: "active",
    statusReason: null,
    billingCurrency: "USD",
    contactEmail: "operaciones@caribefreight.example",
    contactPhone: "+57 300 000 0000",
    createdAt: "2026-10-06T14:30:00Z",
    users: [
      { id: "u061", name: "Mateo Herrera", email: "mateo@caribefreight.example", role: "Administrador", status: "active" },
      { id: "u062", name: "Valentina Ortiz", email: "valentina@caribefreight.example", role: "Operaciones", status: "active" },
    ],
  },
  {
    id: "c05",
    legalName: "Distribuidora Andina S.A.S.",
    tradeName: "Distribuidora Andina",
    documentTypeCode: "NIT",
    documentNumber: "900.123.456-7",
    countryCode: "CO",
    companyType: "client",
    status: "active",
    statusReason: null,
    billingCurrency: "COP",
    contactEmail: "compras@distandina.example",
    contactPhone: "+57 300 000 0000",
    createdAt: "2026-10-02T15:15:00Z",
    clientStage: "consolidated",
    users: [
      { id: "u051", name: "Laura Gómez", email: "laura@distandina.example", role: "Administradora", status: "active" },
      { id: "u052", name: "Pedro Salazar", email: "pedro@distandina.example", role: "Compras", status: "active" },
    ],
  },
  {
    id: "c04",
    legalName: "Deportes Pura Vida S.A.",
    tradeName: "Deportes Pura Vida",
    documentTypeCode: "CJ",
    documentNumber: "3-101-765432",
    countryCode: "CR",
    companyType: "supplier",
    status: "active",
    statusReason: null,
    billingCurrency: "CRC",
    contactEmail: "ventas@puravida.example",
    contactPhone: "+506 8000 0000",
    createdAt: "2026-09-28T17:20:00Z",
    users: [
      { id: "u041", name: "Andrea Solís", email: "andrea@puravida.example", role: "Administradora", status: "active" },
    ],
  },
  {
    id: "c03",
    legalName: "Express Tico S.R.L.",
    tradeName: "Express Tico",
    documentTypeCode: "CJ",
    documentNumber: "3-102-445566",
    countryCode: "CR",
    companyType: "logistics",
    status: "suspended",
    statusReason: "La póliza de responsabilidad civil venció el 31 oct 2026.",
    billingCurrency: "CRC",
    contactEmail: "info@expresstico.example",
    contactPhone: "+506 8000 0000",
    createdAt: "2026-09-15T15:00:00Z",
    users: [
      { id: "u031", name: "Luis Vargas", email: "luis@expresstico.example", role: "Administrador", status: "active" },
    ],
  },
  {
    id: "c02",
    legalName: "Comercial Andes Ltda.",
    tradeName: "Comercial Andes",
    documentTypeCode: "NIT",
    documentNumber: "800.321.987-1",
    countryCode: "CO",
    companyType: "client",
    status: "inactive",
    statusReason: "La empresa cerró operaciones.",
    billingCurrency: "COP",
    contactEmail: "contacto@comercialandes.example",
    contactPhone: "+57 300 000 0000",
    createdAt: "2026-09-02T14:45:00Z",
    clientStage: "registered",
    users: [
      { id: "u021", name: "Rosa Patiño", email: "rosa@comercialandes.example", role: "Administradora", status: "inactive" },
    ],
  },
];

/** Perfil de proveedor en revisión o publicado, como lo ve el equipo de Global 360. */
export interface NetworkProvider {
  id: string;
  /** Iniciales del logotipo. */
  monogram: string;
  name: string;
  /** Empresa dueña del perfil; nulo si no está en el listado de ejemplo. */
  companyId: string | null;
  companyName: string;
  kind: ProviderKind;
  /** Tipo declarado en el perfil cuando no es el genérico del `kind` (fabricante, distribuidor…). */
  businessType: string | null;
  categories: string[];
  coverage: string;
  status: ProviderStatus;
  statusReason: string | null;
  updatedAt: string;
  summary: string;
  city: string;
  /** Pedido mínimo (mayoristas) o resumen de servicios (operadores), ya formateado. */
  offer: string;
  photoCount: number;
  website: string;
  contactName: string;
  contactEmail: string;
  /** Tiene página pública propia en el marketplace (`routes.provider(slug(name))`). */
  publicProfile: boolean;
}

/** Proveedores de ejemplo. */
export const providers: NetworkProvider[] = [
  {
    id: "p10",
    monogram: "EH",
    name: "Electro Hogar del Pacífico",
    companyId: "c08",
    companyName: "Electro Hogar del Pacífico S.A.S.",
    kind: "supplier",
    businessType: null,
    categories: ["Hogar", "Tecnología"],
    coverage: "CO → CR",
    status: "in_review",
    statusReason: null,
    updatedAt: "2026-11-06T15:00:00Z",
    summary: "Pequeños electrodomésticos y artículos para el hogar con bodega en Cali y despachos semanales a Centroamérica.",
    city: "Cali, Colombia",
    offer: "USD 1.200",
    photoCount: 7,
    website: "electrohogar.example",
    contactName: "Julián Torres",
    contactEmail: "ventas@electrohogar.example",
    publicProfile: false,
  },
  {
    id: "p09",
    monogram: "TA",
    name: "TecnoAndina Distribuciones",
    companyId: "c07",
    companyName: "TecnoAndina Distribuciones S.A.S.",
    kind: "supplier",
    businessType: null,
    categories: ["Tecnología"],
    coverage: "CO → CR",
    status: "published",
    statusReason: null,
    updatedAt: "2026-11-04T15:00:00Z",
    summary: "Celulares, portátiles y accesorios de marcas reconocidas, con garantía y despacho por volumen.",
    city: "Medellín, Colombia",
    offer: "USD 2.000",
    photoCount: 12,
    website: "tecnoandina.example",
    contactName: "Laura Restrepo",
    contactEmail: "ventas@tecnoandina.example",
    publicProfile: true,
  },
  {
    id: "p08",
    monogram: "BN",
    name: "Belleza Natural Co.",
    companyId: null,
    companyName: "Belleza Natural Co. S.A.S.",
    kind: "supplier",
    businessType: "Fabricante",
    categories: ["Maquillaje y belleza"],
    coverage: "CO → CR",
    status: "published",
    statusReason: null,
    updatedAt: "2026-11-02T15:00:00Z",
    summary: "Maquillaje y cuidado de la piel con ingredientes naturales, con registro sanitario para Centroamérica.",
    city: "Bogotá, Colombia",
    offer: "USD 800",
    photoCount: 9,
    website: "bellezanatural.example",
    contactName: "Sara Medina",
    contactEmail: "comercial@bellezanatural.example",
    publicProfile: true,
  },
  {
    id: "p07",
    monogram: "DP",
    name: "Deportes Pura Vida",
    companyId: "c04",
    companyName: "Deportes Pura Vida S.A.",
    kind: "supplier",
    businessType: "Distribuidor autorizado",
    categories: ["Deporte", "Moda"],
    coverage: "CR → CO",
    status: "published",
    statusReason: null,
    updatedAt: "2026-10-28T15:00:00Z",
    summary: "Ropa deportiva, balones y accesorios de entrenamiento para tiendas y gimnasios.",
    city: "San José, Costa Rica",
    offer: "USD 1.000",
    photoCount: 7,
    website: "puravida.example",
    contactName: "Andrea Solís",
    contactEmail: "ventas@puravida.example",
    publicProfile: true,
  },
  {
    id: "p06",
    monogram: "CF",
    name: "Caribe Freight Group",
    companyId: "c06",
    companyName: "Caribe Freight Group S.A.S.",
    kind: "logistics",
    businessType: null,
    categories: ["Transporte marítimo", "Consolidación de carga"],
    coverage: "CO ↔ CR",
    status: "published",
    statusReason: null,
    updatedAt: "2026-10-20T15:00:00Z",
    summary: "Carga marítima con salidas semanales entre la costa caribe colombiana y Centroamérica.",
    city: "Cartagena, Colombia",
    offer: "3 servicios publicados",
    photoCount: 0,
    website: "caribefreight.example",
    contactName: "Valentina Ortiz",
    contactEmail: "operaciones@caribefreight.example",
    publicProfile: true,
  },
  {
    id: "p05",
    monogram: "AI",
    name: "Aduanas Integrales CR",
    companyId: null,
    companyName: "Aduanas Integrales CR S.A.",
    kind: "logistics",
    businessType: null,
    categories: ["Agenciamiento aduanero"],
    coverage: "CR",
    status: "approved",
    statusReason: null,
    updatedAt: "2026-11-08T15:00:00Z",
    summary: "Agencia de aduanas en Costa Rica: nacionalización de importaciones y trámites de exportación.",
    city: "Limón, Costa Rica",
    offer: "2 servicios en borrador",
    photoCount: 0,
    website: "aduanasintegrales.example",
    contactName: "Marco Jiménez",
    contactEmail: "operaciones@aduanasintegrales.example",
    publicProfile: true,
  },
  {
    id: "p04",
    monogram: "ET",
    name: "Express Tico",
    companyId: "c03",
    companyName: "Express Tico S.R.L.",
    kind: "logistics",
    businessType: null,
    categories: ["Mensajería internacional"],
    coverage: "CR ↔ CO",
    status: "suspended",
    statusReason: "Póliza de responsabilidad civil vencida.",
    updatedAt: "2026-11-01T15:00:00Z",
    summary: "Mensajería internacional puerta a puerta para envíos B2B pequeños.",
    city: "San José, Costa Rica",
    offer: "1 servicio",
    photoCount: 0,
    website: "expresstico.example",
    contactName: "Luis Vargas",
    contactEmail: "info@expresstico.example",
    publicProfile: false,
  },
];

/** Tipos de transporte del catálogo, con el nombre corto de los listados. */
export type TransportTypeCode = "air" | "sea" | "land" | "courier" | "multimodal";

/** Nombre completo y corto de cada tipo de transporte, en el orden del catálogo. */
export const transportTypes: Record<TransportTypeCode, { name: string; shortName: string }> = {
  air: { name: "Aéreo", shortName: "Aéreo" },
  sea: { name: "Marítimo", shortName: "Marítimo" },
  land: { name: "Terrestre", shortName: "Terrestre" },
  courier: { name: "Mensajería internacional", shortName: "Mensajería" },
  multimodal: { name: "Multimodal", shortName: "Multimodal" },
};

/** Códigos de transporte en el orden del catálogo. */
export const transportTypeCodes: readonly TransportTypeCode[] = ["air", "sea", "land", "courier", "multimodal"];

/** Corredor, con los campos del DTO `corridors`. */
export interface NetworkCorridor {
  id: string;
  code: string;
  name: string;
  originCountryCode: NetworkCountryCode;
  destinationCountryCode: NetworkCountryCode;
  currencyCodes: CurrencyCode[];
  transportTypeCodes: TransportTypeCode[];
  quoteValidityDays: number;
  status: CorridorStatus;
}

/** Corredores de ejemplo, ordenados por código. */
export const corridors: NetworkCorridor[] = [
  {
    id: "k01",
    code: "CO-CR",
    name: "Colombia → Costa Rica",
    originCountryCode: "CO",
    destinationCountryCode: "CR",
    currencyCodes: ["USD", "COP", "CRC"],
    transportTypeCodes: ["air", "sea", "land", "courier", "multimodal"],
    quoteValidityDays: 10,
    status: "active",
  },
  {
    id: "k02",
    code: "CR-CO",
    name: "Costa Rica → Colombia",
    originCountryCode: "CR",
    destinationCountryCode: "CO",
    currencyCodes: ["CRC", "USD"],
    transportTypeCodes: ["sea", "air", "courier"],
    quoteValidityDays: 10,
    status: "active",
  },
  {
    id: "k03",
    code: "CO-PA",
    name: "Colombia → Panamá",
    originCountryCode: "CO",
    destinationCountryCode: "PA",
    currencyCodes: ["USD"],
    transportTypeCodes: ["sea", "air"],
    quoteValidityDays: 15,
    status: "draft",
  },
];

/** Regla de comisión versionada (`commission_rules`); por ahora solo de porcentaje. */
export interface CommissionRule {
  id: string;
  corridorCode: string;
  version: number;
  type: "percentage";
  /** Tasa en puntos básicos: 1200 = 12 %. */
  rateBps: number;
  /** Mínimo por moneda, en unidades menores. */
  minimums: Money[];
  effectiveFrom: string;
  notes: string | null;
}

/** Versiones de comisión de ejemplo. */
export const commissionRules: CommissionRule[] = [
  {
    id: "r01",
    corridorCode: "CO-CR",
    version: 1,
    type: "percentage",
    rateBps: 1200,
    minimums: [],
    effectiveFrom: "2026-11-01T00:00:00Z",
    notes: null,
  },
  {
    id: "r02",
    corridorCode: "CO-CR",
    version: 2,
    type: "percentage",
    rateBps: 1000,
    minimums: [
      { amount: 5000, currency: "USD" },
      { amount: 20000000, currency: "COP" },
    ],
    effectiveFrom: "2026-12-01T00:00:00Z",
    notes: "Política comercial aprobada por gerencia.",
  },
  {
    id: "r03",
    corridorCode: "CR-CO",
    version: 1,
    type: "percentage",
    rateBps: 1200,
    minimums: [],
    effectiveFrom: "2026-11-01T00:00:00Z",
    notes: null,
  },
];

/** Estado de un servicio dentro de un corredor (`corridor_services`). */
export type CorridorServiceStatus = "enabled" | "disabled";

/** Servicio publicado por un operador, candidato a habilitarse en un corredor. */
export interface NetworkService {
  id: string;
  name: string;
  providerName: string;
  status: ServiceStatus;
  /** Corredores en los que es elegible por países y transportes. */
  eligibleCorridorCodes: string[];
}

/** Servicios de ejemplo de los operadores logísticos. */
export const services: NetworkService[] = [
  { id: "s01", name: "Flete marítimo FCL Cartagena → Puerto Limón", providerName: "Caribe Freight Group", status: "published", eligibleCorridorCodes: ["CO-CR"] },
  { id: "s02", name: "Consolidación LCL semanal desde Cartagena", providerName: "Caribe Freight Group", status: "published", eligibleCorridorCodes: ["CO-CR"] },
  { id: "s03", name: "Nacionalización de importaciones en Costa Rica", providerName: "Aduanas Integrales CR", status: "published", eligibleCorridorCodes: ["CO-CR"] },
  { id: "s04", name: "Carga sobredimensionada break bulk", providerName: "Caribe Freight Group", status: "unpublished", eligibleCorridorCodes: ["CO-CR"] },
  { id: "s05", name: "Bodegaje y cross-docking en Puerto Moín", providerName: "Bodegas del Atlántico", status: "published", eligibleCorridorCodes: ["CO-CR"] },
  { id: "s06", name: "Courier puerta a puerta B2B", providerName: "Andina Cargo Logistics", status: "published", eligibleCorridorCodes: ["CO-CR", "CR-CO"] },
  { id: "s07", name: "Flete marítimo FCL Puerto Limón → Cartagena", providerName: "Caribe Freight Group", status: "draft", eligibleCorridorCodes: ["CR-CO"] },
];

/** Servicio habilitado (o deshabilitado) en un corredor. */
export interface CorridorService {
  id: string;
  corridorCode: string;
  serviceId: string;
  status: CorridorServiceStatus;
}

/** Filas de `corridor_services` de ejemplo. */
export const corridorServices: CorridorService[] = [
  { id: "cs01", corridorCode: "CO-CR", serviceId: "s01", status: "enabled" },
  { id: "cs02", corridorCode: "CO-CR", serviceId: "s02", status: "enabled" },
  { id: "cs03", corridorCode: "CO-CR", serviceId: "s03", status: "enabled" },
  { id: "cs04", corridorCode: "CO-CR", serviceId: "s04", status: "disabled" },
];

/** Busca un corredor por su código. */
export function findCorridor(code: string): NetworkCorridor | undefined {
  return corridors.find((corridor) => corridor.code === code);
}

/** Servicio de un corredor con el nombre del servicio y de su proveedor. */
export interface CorridorServiceRow {
  id: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  status: CorridorServiceStatus;
}

/** Todo lo que pinta el detalle de un corredor. */
export interface CorridorDetail {
  corridor: NetworkCorridor;
  rules: CommissionRule[];
  services: CorridorServiceRow[];
  /** Servicios publicados y elegibles que aún no están en el corredor. */
  candidates: NetworkService[];
}

/** Arma el detalle de un corredor, o null si el código no existe. */
export function corridorDetail(code: string): CorridorDetail | null {
  const corridor = findCorridor(code);
  if (!corridor) return null;
  const rows = corridorServices
    .filter((row) => row.corridorCode === code)
    .flatMap((row) => {
      const service = services.find((item) => item.id === row.serviceId);
      return service
        ? [{ id: row.id, serviceId: service.id, serviceName: service.name, providerName: service.providerName, status: row.status }]
        : [];
    });
  const candidates = services.filter(
    (service) =>
      service.status === "published" &&
      service.eligibleCorridorCodes.includes(code) &&
      !rows.some((row) => row.serviceId === service.id),
  );
  return { corridor, rules: commissionRules.filter((rule) => rule.corridorCode === code), services: rows, candidates };
}
