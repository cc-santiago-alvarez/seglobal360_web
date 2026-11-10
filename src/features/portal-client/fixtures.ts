import type { ClientStage } from "@/features/client/model";
import type { CompanyStatus, CompanyType } from "@/features/company/model";
import type { InquiryStatus } from "@/features/inquiry/model";
import type { QuoteClientStatus } from "@/features/quote/model";
import type { UserStatus } from "@/features/user/model";
import { demo, slug } from "@/shared/lib/routes";
import { countryName, type CountryCode } from "@/shared/ui/Flag";

/** Moneda ISO 4217. */
export type CurrencyCode = "USD" | "COP" | "CRC";

/** Monto en unidades menores, como `money.Money` del backend. */
export interface Money {
  amount: number;
  currency: CurrencyCode;
}

/** Monedas que el cliente puede elegir. */
export const currencies: ReadonlyArray<{ code: CurrencyCode; name: string }> = [
  { code: "COP", name: "Peso colombiano" },
  { code: "USD", name: "Dólar estadounidense" },
  { code: "CRC", name: "Colón costarricense" },
];

/** Corredores activos, identificados por origen y destino. */
export type CorridorId = "CO-CR" | "CR-CO";

export interface Corridor {
  id: CorridorId;
  origin: CountryCode;
  destination: CountryCode;
}

export const corridors: ReadonlyArray<Corridor> = [
  { id: "CO-CR", origin: "CO", destination: "CR" },
  { id: "CR-CO", origin: "CR", destination: "CO" },
];

/** «Colombia → Costa Rica». */
export function corridorLabel(id: CorridorId): string {
  const corridor = corridors.find((item) => item.id === id);
  return corridor ? `${countryName[corridor.origin]} → ${countryName[corridor.destination]}` : id;
}

/** Código del catálogo de tipos de transporte. */
export type TransportCode = "maritime" | "air" | "land" | "courier" | "multimodal";

export const transportTypes: ReadonlyArray<{ code: TransportCode; name: string }> = [
  { code: "maritime", name: "Marítimo" },
  { code: "air", name: "Aéreo" },
  { code: "land", name: "Terrestre" },
  { code: "courier", name: "Mensajería" },
  { code: "multimodal", name: "Multimodal" },
];

/** Nombre visible de un tipo de transporte. */
export function transportName(code: TransportCode): string {
  return transportTypes.find((item) => item.code === code)?.name ?? code;
}

/** Incoterms 2020, en el orden del formulario. */
export type Incoterm = "FOB" | "EXW" | "FCA" | "FAS" | "CFR" | "CIF" | "CPT" | "CIP" | "DAP" | "DPU" | "DDP";

export const incoterms: ReadonlyArray<{ code: Incoterm; label: string }> = [
  { code: "FOB", label: "FOB · Libre a bordo" },
  { code: "EXW", label: "EXW" },
  { code: "FCA", label: "FCA" },
  { code: "FAS", label: "FAS" },
  { code: "CFR", label: "CFR" },
  { code: "CIF", label: "CIF" },
  { code: "CPT", label: "CPT" },
  { code: "CIP", label: "CIP" },
  { code: "DAP", label: "DAP" },
  { code: "DPU", label: "DPU" },
  { code: "DDP", label: "DDP" },
];

/* Sesión y empresa */

/** Usuario que ha iniciado sesión y lo que puede hacer en su empresa. */
export interface ClientSession {
  userId: string;
  firstName: string;
  fullName: string;
  email: string;
  role: CompanyRole;
  /** Etiqueta del rol tal como se muestra a la persona. */
  roleLabel: string;
  canEditCompany: boolean;
}

export const session: ClientSession = {
  userId: "5d0f8c1e-7a4b-4c39-9a51-2f6b8e3d1a01",
  firstName: "Laura",
  fullName: "Laura Gómez",
  email: "laura.gomez@andina.example",
  role: "admin",
  roleLabel: "Administradora",
  canEditCompany: true,
};

/** Perfil comercial de la empresa cliente. */
export interface CompanyProfile {
  industry: string;
  website: string;
  monthlyShipments: number;
  description: string;
  mainProducts: string[];
}

/** Empresa del cliente, con sus datos legales, de contacto y su etapa comercial. */
export interface ClientCompany {
  id: string;
  legalName: string;
  tradeName: string;
  /** Documento ya formateado: tipo y número. */
  documentLabel: string;
  country: CountryCode;
  type: CompanyType;
  status: CompanyStatus;
  validatedAt: string | null;
  stage: ClientStage;
  consolidatedAt: string | null;
  billingCurrency: CurrencyCode;
  contactEmail: string;
  contactPhone: string;
  profile: CompanyProfile;
}

export const company: ClientCompany = {
  id: "9b3e2a6c-1f47-4d8e-b0c2-7e5a4f1d9c02",
  legalName: "Distribuidora Andina S.A.S.",
  tradeName: "Andina Distribuciones",
  documentLabel: "NIT 900.123.456-7",
  country: "CO",
  type: "client",
  status: "active",
  validatedAt: "2026-10-02",
  stage: "consolidated",
  consolidatedAt: "2026-10-28",
  billingCurrency: "COP",
  contactEmail: "comercial@andina.example",
  contactPhone: "+57 604 000 0000",
  profile: {
    industry: "Electrodomésticos y hogar",
    website: "https://andina.example",
    monthlyShipments: 4,
    description: "Importamos pequeños electrodomésticos y menaje desde Colombia hacia distribuidores en Costa Rica.",
    mainProducts: ["Pequeños electrodomésticos", "Menaje de cocina", "Iluminación LED"],
  },
};

/** Máximo de productos principales del perfil comercial. */
export const maxMainProducts = 10;

/* Solicitudes */

/** Fila del listado de solicitudes del cliente. */
export interface InquirySummary {
  code: string;
  corridorId: CorridorId;
  transportLabel: string;
  cargoLabel: string;
  status: InquiryStatus;
  updatedLabel: string;
}

export const inquiries: ReadonlyArray<InquirySummary> = [
  {
    code: demo.inquiry,
    corridorId: "CO-CR",
    transportLabel: "Marítimo · FCL",
    cargoLabel: "12 bultos · 8.400 kg · 28 m³",
    status: "quoted",
    updatedLabel: "Hoy, 10:42",
  },
  {
    code: "SOL-2026-000015",
    corridorId: "CO-CR",
    transportLabel: "Aéreo",
    cargoLabel: "3 bultos · 240 kg · 1,2 m³",
    status: "in_contact",
    updatedLabel: "Ayer",
  },
  {
    code: "SOL-2026-000012",
    corridorId: "CR-CO",
    transportLabel: "Mensajería internacional",
    cargoLabel: "1 bulto · 18 kg",
    status: "assigned",
    updatedLabel: "3 nov 2026",
  },
  {
    code: "SOL-2026-000009",
    corridorId: "CO-CR",
    transportLabel: "Marítimo · LCL",
    cargoLabel: "6 bultos · 1.900 kg · 7 m³",
    status: "won",
    updatedLabel: "28 oct 2026",
  },
  {
    code: "SOL-2026-000004",
    corridorId: "CO-CR",
    transportLabel: "Aéreo",
    cargoLabel: "2 bultos · 90 kg",
    status: "cancelled",
    updatedLabel: "15 oct 2026",
  },
];

/* Cotizaciones */

/** Fila del listado de cotizaciones del cliente: solo el total, nunca la comisión. */
export interface QuoteSummary {
  code: string;
  currentVersion: number;
  inquiryCode: string;
  corridorId: CorridorId;
  transportCode: TransportCode;
  /** Servicio principal, para el aviso del inicio. */
  title: string;
  total: Money;
  status: QuoteClientStatus;
  validUntil: string;
  respondedAt: string | null;
}

export const quotes: ReadonlyArray<QuoteSummary> = [
  {
    code: demo.quote,
    currentVersion: 2,
    inquiryCode: demo.inquiry,
    corridorId: "CO-CR",
    transportCode: "maritime",
    title: "Flete FCL Cartagena → Puerto Limón",
    total: { amount: 280000, currency: "USD" },
    status: "sent",
    validUntil: "2026-11-19",
    respondedAt: null,
  },
  {
    code: "COT-2026-000006",
    currentVersion: 1,
    inquiryCode: "SOL-2026-000009",
    corridorId: "CO-CR",
    transportCode: "maritime",
    title: "Consolidación LCL Cartagena → Puerto Limón",
    total: { amount: 115000, currency: "USD" },
    status: "accepted",
    validUntil: "2026-11-05",
    respondedAt: "2026-10-28",
  },
  {
    code: "COT-2026-000004",
    currentVersion: 1,
    inquiryCode: "SOL-2026-000006",
    corridorId: "CO-CR",
    transportCode: "air",
    title: "Carga aérea Bogotá → San José",
    total: { amount: 64000, currency: "USD" },
    status: "expired",
    validUntil: "2026-10-20",
    respondedAt: null,
  },
  {
    code: "COT-2026-000002",
    currentVersion: 2,
    inquiryCode: "SOL-2026-000003",
    corridorId: "CR-CO",
    transportCode: "courier",
    title: "Mensajería San José → Medellín",
    total: { amount: 8500, currency: "USD" },
    status: "rejected",
    validUntil: "2026-10-15",
    respondedAt: "2026-10-12",
  },
];

/* Detalle de una solicitud */

/** Concepto de la cotización tal como lo ve el cliente: sin montos. */
export interface QuoteConcept {
  concept: string;
  description: string;
}

/** Vista del cliente de una cotización: conceptos y total, sin comisión ni subtotales. */
export interface ClientQuote {
  code: string;
  status: QuoteClientStatus;
  currentVersion: number;
  concepts: QuoteConcept[];
  total: Money;
  validUntil: string;
  sentAt: string;
  clientNotes: string | null;
}

/** Mensaje o hito de la conversación con el asesor. */
export type ConversationEntry =
  | { id: string; kind: "message"; author: "advisor" | "client"; meta: string; text: string }
  | { id: string; kind: "event"; tone: "quote" | "closed"; text: string };

/** Lugar de origen o de destino de la carga. */
export interface InquiryPlace {
  country: CountryCode;
  city: string;
  address: string | null;
}

/** Solicitud completa que ve el cliente, con su cotización vigente si la hay. */
export interface InquiryDetail {
  code: string;
  corridorId: CorridorId;
  transportCode: TransportCode;
  serviceName: string | null;
  providerName: string | null;
  createdAt: string;
  status: InquiryStatus;
  /** Fecha en que se alcanzó cada paso del seguimiento, ya formateada. */
  trackDates: Partial<Record<InquiryStatus, string>>;
  cargo: {
    description: string;
    packages: number;
    weightKg: number;
    volumeLiters: number;
    declaredValue: Money | null;
  };
  incoterm: Incoterm | null;
  desiredShipDate: string | null;
  origin: InquiryPlace;
  destination: InquiryPlace;
  advisor: { name: string };
  conversation: ConversationEntry[];
  quote: ClientQuote | null;
}

/** Día de hoy en los datos de ejemplo, para los hitos que se marcan en pantalla. */
export const todayLabel = "10 nov";

const advisorMessages: ConversationEntry[] = [
  {
    id: "msg-1",
    kind: "message",
    author: "advisor",
    meta: "Andrés · Llamada · 5 nov, 10:05",
    text: "Hablamos por teléfono: confirmamos que la carga va paletizada y que un contenedor de 20' es suficiente.",
  },
  {
    id: "msg-2",
    kind: "message",
    author: "client",
    meta: "Tú · 5 nov, 15:40",
    text: "Perfecto. ¿La recogida en Medellín puede ser el 20 de noviembre?",
  },
  {
    id: "msg-3",
    kind: "message",
    author: "advisor",
    meta: "Andrés · Mensaje · 6 nov, 09:20",
    text: "Sí, lo coordinamos. Te envío la cotización apenas confirme espacio con la naviera.",
  },
];

const inquiryInContact: InquiryDetail = {
  code: demo.inquiry,
  corridorId: "CO-CR",
  transportCode: "maritime",
  serviceName: "Flete marítimo FCL",
  providerName: "Caribe Freight Group",
  createdAt: "2026-11-04",
  status: "in_contact",
  trackDates: { new: "4 nov, 09:12", assigned: "4 nov, 11:30", in_contact: "5 nov, 10:05" },
  cargo: {
    description: "Electrodomésticos pequeños en cajas, paletizados",
    packages: 12,
    weightKg: 8400,
    volumeLiters: 28000,
    declaredValue: { amount: 4250000, currency: "USD" },
  },
  incoterm: "FOB",
  desiredShipDate: "2026-11-24",
  origin: { country: "CO", city: "Medellín", address: null },
  destination: { country: "CR", city: "San José", address: null },
  advisor: { name: "Andrés Rojas" },
  conversation: advisorMessages,
  quote: null,
};

const inquiryQuoted: InquiryDetail = {
  ...inquiryInContact,
  status: "quoted",
  trackDates: { ...inquiryInContact.trackDates, quoted: "9 nov, 08:47" },
  conversation: [
    ...advisorMessages,
    { id: "evt-quote", kind: "event", tone: "quote", text: `Cotización ${demo.quote} enviada · 9 nov` },
  ],
  quote: {
    code: demo.quote,
    status: "sent",
    currentVersion: 2,
    concepts: [
      { concept: "Flete marítimo FCL 20'", description: "Cartagena → Puerto Limón, con reserva de espacio y BL" },
      { concept: "Nacionalización en Costa Rica", description: "Agenciamiento aduanero en destino" },
    ],
    total: { amount: 280000, currency: "USD" },
    validUntil: "2026-11-19",
    sentAt: "2026-11-09",
    clientNotes: "la tarifa depende de la disponibilidad de espacio en la naviera al momento de la reserva.",
  },
};

/** Variantes de la solicitud de ejemplo: antes de la cotización y ya cotizada. */
export type InquiryVariant = "in_contact" | "quoted";

const inquiryVariants: Record<InquiryVariant, InquiryDetail> = {
  in_contact: inquiryInContact,
  quoted: inquiryQuoted,
};

/** Códigos de solicitud con detalle disponible. */
export const inquiryCodes: ReadonlyArray<string> = [demo.inquiry];

/** Detalle de una solicitud; la de ejemplo se muestra cotizada salvo que se pida otra variante. */
export function findInquiry(code: string, variant: InquiryVariant = "quoted"): InquiryDetail | null {
  return code === demo.inquiry ? inquiryVariants[variant] : null;
}

/* Nueva solicitud */

/** Servicio del marketplace con el que puede empezar una solicitud. */
export interface StartingService {
  id: string;
  name: string;
  providerName: string;
  transportCode: TransportCode;
}

const marketplaceServices: ReadonlyArray<Omit<StartingService, "id">> = [
  { name: "Flete marítimo FCL Cartagena → Puerto Limón", providerName: "Caribe Freight Group", transportCode: "maritime" },
  { name: "Consolidación LCL semanal desde Cartagena", providerName: "Caribe Freight Group", transportCode: "maritime" },
  { name: "Nacionalización de importaciones en Costa Rica", providerName: "Aduanas Integrales CR", transportCode: "maritime" },
  { name: "Bodegaje y cross-docking en Puerto Moín", providerName: "Bodegas del Atlántico", transportCode: "maritime" },
  { name: "Póliza de carga por embarque", providerName: "Andina Cargo Logistics", transportCode: "maritime" },
  { name: "Acarreo de contenedor puerto – bodega", providerName: "Andina Cargo Logistics", transportCode: "land" },
];

/** Servicios del marketplace; el id es el slug de su nombre. */
export const startingServices: ReadonlyArray<StartingService> = marketplaceServices.map((service) => ({
  ...service,
  id: slug(service.name),
}));

/** Servicio de partida por su id, o null si no existe. */
export function findStartingService(id: string | undefined): StartingService | null {
  if (!id) return null;
  return startingServices.find((service) => service.id === id) ?? null;
}

/** Valores con los que se abre el formulario de nueva solicitud. */
export interface InquiryDraft {
  corridorId: CorridorId;
  incoterm: Incoterm;
  desiredShipDate: string;
  transportCode: TransportCode;
  originCity: string;
  destinationCity: string;
  description: string;
  packages: string;
  weightKg: string;
  volumeM3: string;
  declaredCurrency: CurrencyCode;
  declaredValue: string;
}

export const inquiryDraft: InquiryDraft = {
  corridorId: "CO-CR",
  incoterm: "FOB",
  desiredShipDate: "2026-11-24",
  transportCode: "maritime",
  originCity: "Medellín",
  destinationCity: "San José",
  description: "Electrodomésticos pequeños en cajas, paletizados.",
  packages: "12",
  weightKg: "8400",
  volumeM3: "28",
  declaredCurrency: "USD",
  declaredValue: "42.500,00",
};

/* Usuarios */

/** Rol de una persona dentro de su empresa. */
export type CompanyRole = "admin" | "operator";

/** Nombre y alcance de cada rol de empresa. */
export const companyRoles: ReadonlyArray<{ id: CompanyRole; name: string; description: string }> = [
  {
    id: "admin",
    name: "Administrador",
    description: "Edita los datos de la empresa, invita usuarios y acepta o rechaza cotizaciones.",
  },
  { id: "operator", name: "Operativo", description: "Crea solicitudes, conversa con el asesor y consulta las cotizaciones." },
];

/** Usuario de la empresa del cliente. */
export interface CompanyUser {
  id: string;
  email: string;
  fullName: string | null;
  initials: string;
  role: CompanyRole;
  status: UserStatus;
  lastLoginLabel: string;
}

export const companyUsers: ReadonlyArray<CompanyUser> = [
  {
    id: session.userId,
    email: session.email,
    fullName: session.fullName,
    initials: "LG",
    role: "admin",
    status: "active",
    lastLoginLabel: "Hoy, 09:12",
  },
  {
    id: "2c6a9e14-3b8d-4f70-a1c5-8d2e7b4f6a03",
    email: "carlos.ruiz@andina.example",
    fullName: null,
    initials: "CR",
    role: "operator",
    status: "active",
    lastLoginLabel: "6 nov 2026",
  },
  {
    id: "7e1b4d92-6c3a-4a85-9f0e-1b7c5d3e8a04",
    email: "compras@andina.example",
    fullName: null,
    initials: "CO",
    role: "operator",
    status: "pending_verification",
    lastLoginLabel: "—",
  },
  {
    id: "4a8f2c67-9d1e-4b3a-8c76-5e2f9a1b7d05",
    email: "maria.paz@andina.example",
    fullName: null,
    initials: "MP",
    role: "operator",
    status: "inactive",
    lastLoginLabel: "2 sep 2026",
  },
];

/** Tipos de documento de identidad para invitar a una persona. */
export const personDocumentTypes: ReadonlyArray<string> = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte"];
