import type { CompanyStatus, CompanyType } from "@/features/company/model";
import type { ProviderKind, ProviderStatus } from "@/features/provider/model";
import type { ServiceStatus } from "@/features/service/model";
import type { UserStatus } from "@/features/user/model";
import type { CountryCode } from "@/shared/ui/Flag";

/** Estados del perfil que recorre el prototipo de los portales de proveedor. */
export type ProfileStatus = Extract<ProviderStatus, "draft" | "in_review" | "published">;

/** Indica si un valor externo (p. ej. `?status=`) es un estado de perfil válido. */
export function isProfileStatus(value: unknown): value is ProfileStatus {
  return value === "draft" || value === "in_review" || value === "published";
}

/** Pasos del ciclo de revisión de un perfil, en orden. */
export const profileSteps: ReadonlyArray<ProviderStatus> = ["draft", "in_review", "approved", "published"];

/** Datos de la revisión que muestran los avisos del perfil. */
export interface ProfileReview {
  submittedOn: string;
  today: string;
  returnedNote: string;
}

/** Contacto interno del proveedor: solo lo ve el equipo de SEGlobal 360. */
export interface ProviderContact {
  name: string;
  email: string;
  phone: string;
}

/** Foto de producto del proveedor mayorista; `url` vacía = muestra sin archivo. */
export interface ProfilePhoto {
  photoId: string;
  caption: string;
  url: string;
}

/** Perfil del proveedor mayorista en el marketplace. */
export interface SupplierProfileData {
  providerId: string;
  companyId: string;
  kind: Extract<ProviderKind, "supplier">;
  status: ProfileStatus;
  monogram: string;
  displayName: string;
  summary: string;
  description: string;
  website: string;
  supplierType: string;
  yearsInMarket: number;
  photos: ProfilePhoto[];
  categories: string[];
  productLines: string[];
  dispatchFrom: string;
  sellsTo: CountryCode[];
  minOrderUsd: number;
  leadTime: string;
  warranty: string;
  certificates: string;
  contact: ProviderContact;
  review: ProfileReview;
}

/** Perfil del operador logístico en el marketplace. */
export interface LogisticsProfileData {
  providerId: string;
  companyId: string;
  kind: Extract<ProviderKind, "logistics">;
  status: ProfileStatus;
  monogram: string;
  displayName: string;
  summary: string;
  description: string;
  website: string;
  yearsInOperation: number;
  publishedServices: number;
  countries: CountryCode[];
  categories: string[];
  capabilities: string[];
  certifications: string[];
  contact: ProviderContact;
  review: ProfileReview;
}

export const supplierTypes = ["Mayorista", "Fabricante", "Distribuidor autorizado", "Productor"] as const;

export const supplierCategories = [
  "Tecnología",
  "Maquillaje y belleza",
  "Deporte",
  "Hogar",
  "Moda",
  "Alimentos y bebidas",
  "Juguetes",
  "Salud y cuidado personal",
] as const;

export const dispatchOptions = ["Medellín, Colombia", "Bogotá, Colombia", "San José, Costa Rica"] as const;

/** Países a los que vende el mayorista, en el orden del diseño. */
export const sellsToOptions: ReadonlyArray<CountryCode> = ["CR", "CO"];

/** Países donde opera el operador logístico. */
export const operatorCountryOptions: ReadonlyArray<CountryCode> = ["CO", "CR"];

export const logisticsCategories = [
  "Transporte marítimo",
  "Consolidación de carga",
  "Transporte aéreo",
  "Transporte terrestre",
  "Agenciamiento aduanero",
  "Bodegaje",
  "Mensajería internacional",
  "Seguro de carga",
] as const;

/** Máximo de fotos de producto por perfil. */
export const maxPhotos = 12;

export const supplierProfile: SupplierProfileData = {
  providerId: "0b7d2f4e-3c1a-4e8b-9f61-2a4d5c6e7f80",
  companyId: "6f1c2b3a-4d5e-4f60-8a71-9b8c7d6e5f41",
  kind: "supplier",
  status: "draft",
  monogram: "TA",
  displayName: "TecnoAndina Distribuciones",
  summary: "Celulares, portátiles y accesorios de marcas reconocidas, con garantía y despacho por volumen.",
  description:
    "Distribuimos tecnología a tiendas y cadenas de retail desde Medellín. Trabajamos con inventario propio y acompañamos la garantía con el fabricante.",
  website: "",
  supplierType: "Mayorista",
  yearsInMarket: 8,
  photos: [
    { photoId: "photo-1", caption: "Celulares", url: "" },
    { photoId: "photo-2", caption: "Portátiles", url: "" },
    { photoId: "photo-3", caption: "Audífonos inalámbricos", url: "" },
    { photoId: "photo-4", caption: "", url: "" },
  ],
  categories: ["Tecnología", "Hogar"],
  productLines: ["Celulares", "Computadores", "Audio", "Accesorios"],
  dispatchFrom: "Medellín, Colombia",
  sellsTo: ["CR"],
  minOrderUsd: 2000,
  leadTime: "3–5 días hábiles",
  warranty: "12 meses de fábrica",
  certificates: "",
  contact: { name: "Laura Restrepo", email: "ventas@tecnoandina.example", phone: "+57 300 000 0000" },
  review: {
    submittedOn: "6 nov 2026",
    today: "10 nov 2026",
    returnedNote: "Agrega fotos de tus productos y completa el pedido mínimo en las condiciones comerciales.",
  },
};

export const logisticsProfile: LogisticsProfileData = {
  providerId: "3e9a1d7c-5b2f-4a68-8c90-1f2e3d4c5b6a",
  companyId: "8a2b3c4d-5e6f-4a7b-9c8d-0e1f2a3b4c5d",
  kind: "logistics",
  status: "draft",
  monogram: "CF",
  displayName: "Caribe Freight Group",
  summary:
    "Operador de carga marítima con salidas semanales entre la costa caribe colombiana y Centroamérica, con oficinas en Cartagena y Limón.",
  description: "Movemos contenedores completos y carga consolidada entre Colombia y Costa Rica desde hace 12 años.",
  website: "",
  yearsInOperation: 12,
  publishedServices: 3,
  countries: ["CO", "CR"],
  categories: ["Transporte marítimo", "Consolidación de carga"],
  capabilities: ["FCL y LCL", "Carga sobredimensionada"],
  certifications: [],
  contact: { name: "Valentina Ortiz", email: "operaciones@caribefreight.example", phone: "+57 300 000 0000" },
  review: {
    submittedOn: "6 nov 2026",
    today: "10 nov 2026",
    returnedNote: "Amplía la descripción con los puertos que operas y agrega las certificaciones vigentes.",
  },
};

/** Modo de transporte de un servicio (catálogo `transport_types`). */
export type TransportMode = "maritime" | "multimodal" | "land";

/** Nombre visible de cada modo de transporte. */
export const transportMode: Record<TransportMode, string> = {
  maritime: "Marítimo",
  multimodal: "Multimodal",
  land: "Terrestre",
};

export const transportModes: ReadonlyArray<TransportMode> = ["maritime", "multimodal", "land"];

/** Servicio que el operador logístico ofrece en el marketplace. */
export interface ProviderService {
  serviceId: string;
  category: string;
  name: string;
  description: string;
  transportTypes: TransportMode[];
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  transitDaysMin: number | null;
  transitDaysMax: number | null;
  conditions: string;
  status: ServiceStatus;
  /** Motivo visible cuando el servicio está despublicado. */
  unpublishedReason?: string;
}

/** Categorías con las que el operador puede crear servicios (las de su perfil). */
export const serviceCategoryOptions = ["Transporte marítimo", "Consolidación de carga"] as const;

/** Servicio que se abre en el editor al entrar. */
export const selectedServiceId = "svc-fcl-lim-ctg";

export const providerServices: ProviderService[] = [
  {
    serviceId: "svc-fcl-ctg-lim",
    category: "Transporte marítimo",
    name: "Flete marítimo FCL Cartagena → Puerto Limón",
    description: "Contenedores de 20' y 40' desde Cartagena hasta Puerto Limón / Moín, con reserva de espacio y BL.",
    transportTypes: ["maritime"],
    originCountry: "CO",
    destinationCountry: "CR",
    transitDaysMin: 6,
    transitDaysMax: 9,
    conditions: "",
    status: "published",
  },
  {
    serviceId: "svc-lcl-ctg",
    category: "Consolidación de carga",
    name: "Consolidación LCL semanal desde Cartagena",
    description: "Carga suelta consolidada con salida semanal desde Cartagena hacia Costa Rica.",
    transportTypes: ["maritime"],
    originCountry: "CO",
    destinationCountry: "CR",
    transitDaysMin: 10,
    transitDaysMax: 14,
    conditions: "",
    status: "published",
  },
  {
    serviceId: "svc-fcl-lim-ctg",
    category: "Transporte marítimo",
    name: "Flete marítimo FCL Puerto Limón → Cartagena",
    description: "Contenedores de 20' y 40' desde Puerto Limón / Moín hasta Cartagena, con reserva de espacio y BL.",
    transportTypes: ["maritime"],
    originCountry: "CR",
    destinationCountry: "CO",
    transitDaysMin: 7,
    transitDaysMax: 10,
    conditions: "",
    status: "draft",
  },
  {
    serviceId: "svc-break-bulk",
    category: "Transporte marítimo",
    name: "Carga sobredimensionada break bulk",
    description: "Maquinaria y carga fuera de medida en buques de carga general entre Colombia y Costa Rica.",
    transportTypes: ["maritime"],
    originCountry: "CO",
    destinationCountry: "CR",
    transitDaysMin: 8,
    transitDaysMax: 12,
    conditions: "",
    status: "unpublished",
    unpublishedReason: "sin cupo hasta enero",
  },
];

/** Moneda de facturación que puede elegir la empresa. */
export interface CurrencyOption {
  code: string;
  label: string;
}

export const billingCurrencies: ReadonlyArray<CurrencyOption> = [
  { code: "COP", label: "COP · Peso colombiano" },
  { code: "USD", label: "USD · Dólar estadounidense" },
  { code: "CRC", label: "CRC · Colón costarricense" },
];

/** Empresa proveedora con sus datos legales y de contacto. */
export interface ProviderCompany {
  companyId: string;
  legalName: string;
  document: string;
  country: CountryCode;
  type: CompanyType;
  status: CompanyStatus;
  validatedAt: string;
  tradeName: string;
  billingCurrency: string;
  contactEmail: string;
  contactPhone: string;
  publication: { label: string; text: string };
}

/** Portal de proveedor: mayorista u operador logístico. */
export type ProviderPortal = ProviderKind;

export const providerCompanies: Record<ProviderPortal, ProviderCompany> = {
  supplier: {
    companyId: supplierProfile.companyId,
    legalName: "TecnoAndina Distribuciones S.A.S.",
    document: "NIT 900.874.112-5",
    country: "CO",
    type: "supplier",
    status: "active",
    validatedAt: "14 oct 2026",
    tradeName: "TecnoAndina Distribuciones",
    billingCurrency: "COP",
    contactEmail: "ventas@tecnoandina.example",
    contactPhone: "+57 604 000 0000",
    publication: {
      label: "Proveedor publicado",
      text: "Tu perfil está publicado en el marketplace desde el 20 oct 2026.",
    },
  },
  logistics: {
    companyId: logisticsProfile.companyId,
    legalName: "Caribe Freight Group S.A.S.",
    document: "NIT 901.555.210-3",
    country: "CO",
    type: "logistics",
    status: "active",
    validatedAt: "6 oct 2026",
    tradeName: "Caribe Freight Group",
    billingCurrency: "USD",
    contactEmail: "operaciones@caribefreight.example",
    contactPhone: "+57 605 000 0000",
    publication: {
      label: "Operador publicado",
      text: "Tu perfil y 3 servicios están publicados en el marketplace.",
    },
  },
};

/** Rol de un usuario dentro de su empresa. */
export type CompanyRole = "admin" | "operator";

/** Nombre visible de cada rol. */
export const companyRole: Record<CompanyRole, string> = {
  admin: "Administrador",
  operator: "Operativo",
};

/** Textos de cada portal en Mi empresa y en la invitación de usuarios. */
export interface PortalCopy {
  profileText: string;
  profileCta: string;
  roleText: Record<CompanyRole, string>;
  roleDescription: Record<CompanyRole, string>;
}

export const portalCopy: Record<ProviderPortal, PortalCopy> = {
  supplier: {
    profileText:
      "El logo, las fotos de tus productos, las categorías y las condiciones comerciales se editan en tu perfil de proveedor.",
    profileCta: "Ir al perfil de proveedor",
    roleText: {
      admin: "Administrador: puedes editar los datos de la empresa y el perfil, e invitar usuarios.",
      operator: "Operativo: puedes editar el perfil y los servicios. Los datos de la empresa los edita un administrador.",
    },
    roleDescription: {
      admin: "Edita la empresa y el perfil de proveedor, e invita usuarios.",
      operator: "Actualiza el perfil, las fotos de productos y las condiciones comerciales.",
    },
  },
  logistics: {
    profileText:
      "El logo, la cobertura, las categorías y las capacidades se editan en tu perfil de operador; los servicios, en Servicios.",
    profileCta: "Ir al perfil del operador",
    roleText: {
      admin: "Administrador: puedes editar los datos de la empresa y el perfil, e invitar usuarios.",
      operator: "Operativo: puedes editar el perfil y los servicios. Los datos de la empresa los edita un administrador.",
    },
    roleDescription: {
      admin: "Edita la empresa, el perfil y los servicios, e invita usuarios.",
      operator: "Publica y actualiza servicios. No gestiona usuarios.",
    },
  },
};

/** Usuario de la empresa proveedora. */
export interface CompanyUser {
  userId: string;
  email: string;
  name?: string;
  initials: string;
  role: CompanyRole;
  status: UserStatus;
  /** Último ingreso ya formateado («Hoy, 08:40», «9 nov 2026», «—»). */
  lastLogin: string;
  isMe?: boolean;
}

export const companyUsers: Record<ProviderPortal, CompanyUser[]> = {
  supplier: [
    {
      userId: "usr-laura",
      email: "laura@tecnoandina.example",
      name: "Laura Restrepo",
      initials: "LR",
      role: "admin",
      status: "active",
      lastLogin: "Hoy, 08:40",
      isMe: true,
    },
    {
      userId: "usr-santiago",
      email: "santiago.mejia@tecnoandina.example",
      initials: "SM",
      role: "operator",
      status: "active",
      lastLogin: "9 nov 2026",
    },
    {
      userId: "usr-bodega",
      email: "bodega@tecnoandina.example",
      initials: "BO",
      role: "operator",
      status: "pending_verification",
      lastLogin: "—",
    },
    {
      userId: "usr-ana",
      email: "ana.velez@tecnoandina.example",
      initials: "AV",
      role: "operator",
      status: "inactive",
      lastLogin: "12 sep 2026",
    },
  ],
  logistics: [
    {
      userId: "usr-mateo",
      email: "mateo@caribefreight.example",
      name: "Mateo Herrera",
      initials: "MH",
      role: "admin",
      status: "active",
      lastLogin: "Hoy, 07:55",
      isMe: true,
    },
    {
      userId: "usr-valentina",
      email: "valentina@caribefreight.example",
      initials: "VO",
      role: "operator",
      status: "active",
      lastLogin: "Hoy, 09:10",
    },
    {
      userId: "usr-tarifas",
      email: "tarifas@caribefreight.example",
      initials: "TA",
      role: "operator",
      status: "active",
      lastLogin: "5 nov 2026",
    },
  ],
};

export const documentTypes = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte"] as const;
