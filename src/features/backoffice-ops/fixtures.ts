import type { ClientStage } from "@/features/client/model";
import type { CompanyStatus } from "@/features/company/model";
import type { InquiryStatus } from "@/features/inquiry/model";
import type { ProviderKind, ProviderStatus } from "@/features/provider/model";
import type { QuoteStatus } from "@/features/quote/model";
import { demo, routes } from "@/shared/lib/routes";
import type { CountryCode } from "@/shared/ui/Flag";
import type { Tone } from "@/shared/ui/StatusPill";
import type { CurrencyCode, Money } from "./money";

/** Persona del equipo de SEGlobal 360 que puede llevar solicitudes. */
export interface Advisor {
  id: string;
  name: string;
}

/** Asesor con la sesión abierta en el backoffice. */
export const currentAdvisor: Advisor = { id: "usr-andres-rojas", name: "Andrés Rojas" };

/** Asesores a los que se puede asignar una solicitud. */
export const advisors: Advisor[] = [currentAdvisor, { id: "usr-carolina-mendez", name: "Carolina Méndez" }];

/** Momento de la demo: lo que el diseño pinta como «ahora». */
export const demoClock = {
  today: "Lunes 9 de noviembre",
  sentAt: "10 nov 2026, 11:25",
  sentDay: "10 nov",
  sentStamp: "10 nov, 11:25",
  validUntil: "20 nov 2026",
  occurredAtDefault: "2026-11-10T09:30",
  occurredAtMax: "2026-11-10T11:30",
} as const;

/* Bandeja */

/** Indicador de la bandeja de trabajo. */
export interface InboxTile {
  id:
    | "companies_pending"
    | "providers_in_review"
    | "inquiries_unassigned"
    | "inquiries_without_contact"
    | "quotes_expiring"
    | "messages_unanswered";
  count: number;
  label: string;
  tone: Tone;
  href: string;
}

export const inboxTiles: InboxTile[] = [
  { id: "companies_pending", count: 2, label: "Empresas por validar", tone: "warn", href: routes.backoffice.companies },
  { id: "providers_in_review", count: 1, label: "Proveedores en revisión", tone: "warn", href: routes.backoffice.providers },
  {
    id: "inquiries_unassigned",
    count: 3,
    label: "Solicitudes nuevas sin asignar",
    tone: "danger",
    href: routes.backoffice.inquiry(demo.inquiry),
  },
  {
    id: "inquiries_without_contact",
    count: 1,
    label: "Mis solicitudes sin primer contacto",
    tone: "info",
    href: routes.backoffice.inquiry(demo.inquiry),
  },
  { id: "quotes_expiring", count: 1, label: "Cotizaciones que vencen en 3 días", tone: "info", href: routes.backoffice.quotes },
  {
    id: "messages_unanswered",
    count: 2,
    label: "Mensajes de clientes sin respuesta",
    tone: "danger",
    href: routes.backoffice.inquiry(demo.inquiry),
  },
];

/** Canal por el que llegó una solicitud. */
export type InquirySource = "marketplace" | "direct" | "backoffice";

/** Nombre visible de cada origen. */
export const inquirySource: Record<InquirySource, string> = {
  marketplace: "Marketplace",
  direct: "Directa",
  backoffice: "Backoffice",
};

/** Urgencia de la espera de una solicitud sin asignar. */
export type WaitLevel = "on_time" | "late" | "overdue";

/** Solicitud nueva que todavía no tiene asesor. */
export interface UnassignedInquiry {
  code: string;
  status: InquiryStatus;
  cargoSummary: string;
  companyName: string;
  corridorLabel: string;
  transportLabel: string;
  source: InquirySource;
  waitingLabel: string;
  waitLevel: WaitLevel;
}

export const unassignedInquiries: UnassignedInquiry[] = [
  {
    code: "SOL-2026-000021",
    status: "new",
    cargoSummary: "4 bultos · 620 kg",
    companyName: "Textiles del Valle S.A.S.",
    corridorLabel: "CO → CR",
    transportLabel: "Aéreo",
    source: "marketplace",
    waitingLabel: "25 min",
    waitLevel: "on_time",
  },
  {
    code: "SOL-2026-000020",
    status: "new",
    cargoSummary: "1 contenedor 40' · 18.000 kg",
    companyName: "Distribuidora Andina S.A.S.",
    corridorLabel: "CO → CR",
    transportLabel: "Marítimo",
    source: "direct",
    waitingLabel: "3 h",
    waitLevel: "late",
  },
  {
    code: "SOL-2026-000019",
    status: "new",
    cargoSummary: "2 bultos · 35 kg",
    companyName: "Café Altura Export",
    corridorLabel: "CO → CR",
    transportLabel: "Mensajería",
    source: "marketplace",
    waitingLabel: "1 día",
    waitLevel: "overdue",
  },
];

/** Tipo de empresa con el valor del backend. */
export type CompanyRole = "client" | "provider" | "both";

/** Nombre visible de cada tipo de empresa en la bandeja. */
export const companyRole: Record<CompanyRole, string> = {
  client: "Cliente",
  provider: "Proveedor",
  both: "Cliente y proveedor",
};

/** Empresa registrada que espera la validación de Global 360. */
export interface PendingCompany {
  id: string;
  legalName: string;
  type: CompanyRole;
  documentLabel: string;
  country: CountryCode;
  registeredLabel: string;
  status: CompanyStatus;
}

export const pendingCompanies: PendingCompany[] = [
  {
    id: "cmp-pacifico-verde",
    legalName: "Importadora Pacífico Verde S.A.",
    type: "client",
    documentLabel: "Cédula jurídica 3-101-123456",
    country: "CR",
    registeredLabel: "registrada hace 1 día",
    status: "pending_validation",
  },
  {
    id: "cmp-textiles-valle",
    legalName: "Textiles del Valle S.A.S.",
    type: "provider",
    documentLabel: "NIT 901.234.567-8",
    country: "CO",
    registeredLabel: "registrada hace 3 h",
    status: "pending_validation",
  },
];

/** Perfil de proveedor enviado a revisión. */
export interface ProviderInReview {
  id: string;
  name: string;
  kind: ProviderKind;
  category: string;
  submittedLabel: string;
  status: ProviderStatus;
}

export const providersInReview: ProviderInReview[] = [
  {
    id: "prv-electro-hogar",
    name: "Electro Hogar del Pacífico",
    kind: "supplier",
    category: "Hogar y tecnología",
    submittedLabel: "enviado el 6 nov",
    status: "in_review",
  },
];

/* Solicitud y cotizador */

/** Carga de una solicitud. */
export interface InquiryCargo {
  description: string;
  packages: number;
  weightKg: number;
  volumeLiters: number;
  incoterm: string;
  declaredValue: Money;
  originCity: string;
  destinationCity: string;
  desiredShipDateLabel: string;
}

/** Solicitud tal como la ve el asesor. */
export interface InquiryDetail {
  code: string;
  status: InquiryStatus;
  companyName: string;
  clientStage: ClientStage;
  requestedByName: string;
  corridorLabel: string;
  transportLabel: string;
  source: InquirySource;
  originServiceLabel: string;
  firstContactLabel: string;
  cargo: InquiryCargo;
}

export const inquiries: InquiryDetail[] = [
  {
    code: demo.inquiry,
    status: "in_contact",
    companyName: "Distribuidora Andina S.A.S.",
    clientStage: "consolidated",
    requestedByName: "Laura Gómez",
    corridorLabel: "CO → CR",
    transportLabel: "Marítimo",
    source: "marketplace",
    originServiceLabel: "Flete FCL de Caribe Freight Group",
    firstContactLabel: "5 nov, 10:05 · 23 h después de asignada",
    cargo: {
      description: "Electrodomésticos pequeños en cajas, paletizados",
      packages: 12,
      weightKg: 8400,
      volumeLiters: 28000,
      incoterm: "FOB",
      declaredValue: { amount: 4250000, currency: "USD" },
      originCity: "Medellín",
      destinationCity: "San José",
      desiredShipDateLabel: "24 nov 2026",
    },
  },
];

/** Busca una solicitud de ejemplo por su código. */
export function findInquiry(code: string): InquiryDetail | undefined {
  return inquiries.find((inquiry) => inquiry.code === code);
}

/** Canal de una interacción, con el valor del backend; `quote_sent` es el aviso de envío. */
export type InteractionChannel =
  | "phone"
  | "email"
  | "whatsapp"
  | "meeting"
  | "video_call"
  | "note"
  | "portal_message"
  | "quote_sent";

/** Nombre visible de cada canal. */
export const interactionChannel: Record<InteractionChannel, string> = {
  phone: "Llamada",
  email: "Correo",
  whatsapp: "WhatsApp",
  meeting: "Reunión",
  video_call: "Videollamada",
  note: "Nota",
  portal_message: "Mensaje del portal",
  quote_sent: "Cotización",
};

/** Canales que el asesor puede registrar, en el orden del selector. */
export const advisorChannels: ReadonlyArray<InteractionChannel> = [
  "phone",
  "email",
  "whatsapp",
  "meeting",
  "video_call",
  "note",
];

export type InteractionVisibility = "internal" | "shared";
export type InteractionAuthorType = "advisor" | "client";

/** Interacción registrada en una solicitud. */
export interface Interaction {
  id: string;
  authorType: InteractionAuthorType;
  authorName: string;
  channel: InteractionChannel;
  visibility: InteractionVisibility;
  summary: string;
  occurredAtLabel: string;
}

export const interactions: Interaction[] = [
  {
    id: "int-4",
    authorType: "advisor",
    authorName: "Andrés Rojas",
    channel: "note",
    visibility: "internal",
    summary: "Caribe Freight confirma tarifa 1.800 USD si se reserva antes del 15. Aduanas Integrales cotizó 700 USD.",
    occurredAtLabel: "8 nov, 17:10",
  },
  {
    id: "int-3",
    authorType: "advisor",
    authorName: "Andrés Rojas",
    channel: "portal_message",
    visibility: "shared",
    summary: "Sí, lo coordinamos. Te envío la cotización apenas confirme espacio con la naviera.",
    occurredAtLabel: "6 nov, 09:20",
  },
  {
    id: "int-2",
    authorType: "client",
    authorName: "Laura Gómez",
    channel: "portal_message",
    visibility: "shared",
    summary: "Perfecto. ¿La recogida en Medellín puede ser el 20 de noviembre?",
    occurredAtLabel: "5 nov, 15:40",
  },
  {
    id: "int-1",
    authorType: "advisor",
    authorName: "Andrés Rojas",
    channel: "phone",
    visibility: "shared",
    summary: "Confirmamos que la carga va paletizada y que un contenedor de 20' es suficiente.",
    occurredAtLabel: "5 nov, 10:05",
  },
];

/** Servicio de un proveedor que se puede cargar como costo. */
export interface ServiceOption {
  serviceId: string;
  label: string;
}

export const quoteServiceOptions: ServiceOption[] = [
  { serviceId: "svc-caribe-fcl", label: "Caribe Freight Group · Flete FCL" },
  { serviceId: "svc-aduanas-nacionalizacion", label: "Aduanas Integrales CR · Nacionalización" },
];

/** Componente de costo de una versión de la cotización. */
export interface CostComponent {
  id: string;
  concept: string;
  description: string;
  serviceId: string | null;
  amount: Money;
}

/** Versión de una cotización y su estado. */
export interface QuoteVersionSummary {
  version: number;
  status: Extract<QuoteStatus, "draft" | "sent">;
}

/** Cotización en preparación, con su regla de comisión y la versión actual. */
export interface QuoteDraft {
  code: string;
  inquiryCode: string;
  currency: CurrencyCode;
  commission: { corridorCode: string; ruleVersion: number; rateBps: number };
  validityDays: number;
  versions: QuoteVersionSummary[];
  components: CostComponent[];
  clientNotes: string;
  internalNotes: string;
}

export const quoteDraft: QuoteDraft = {
  code: demo.quote,
  inquiryCode: demo.inquiry,
  currency: "USD",
  commission: { corridorCode: demo.corridor, ruleVersion: 1, rateBps: 1200 },
  validityDays: 10,
  versions: [{ version: 1, status: "draft" }],
  components: [
    {
      id: "cc-1",
      concept: "Flete marítimo FCL 20'",
      description: "Cartagena → Puerto Limón, con reserva de espacio y BL",
      serviceId: "svc-caribe-fcl",
      amount: { amount: 180000, currency: "USD" },
    },
    {
      id: "cc-2",
      concept: "Nacionalización en Costa Rica",
      description: "Agenciamiento aduanero en destino",
      serviceId: "svc-aduanas-nacionalizacion",
      amount: { amount: 70000, currency: "USD" },
    },
  ],
  clientNotes: "La tarifa depende de la disponibilidad de espacio en la naviera al momento de la reserva.",
  internalNotes: "Naviera confirmó espacio para el 22 nov. Recogida en Medellín el 20.",
};

/* Cotizaciones */

/** Fila del listado de cotizaciones del backoffice. */
export interface QuoteListItem {
  code: string;
  currentVersion: number;
  inquiryCode: string;
  routeLabel: string;
  companyName: string;
  status: QuoteStatus;
  total: Money;
  validityLabel: string;
  advisorName: string;
}

export const quoteList: QuoteListItem[] = [
  {
    code: "COT-2026-000009",
    currentVersion: 1,
    inquiryCode: "SOL-2026-000017",
    routeLabel: "CO → CR · Marítimo",
    companyName: "Distribuidora Andina S.A.S.",
    status: "draft",
    total: { amount: 280000, currency: "USD" },
    validityLabel: "Sin enviar",
    advisorName: "Andrés Rojas",
  },
  {
    code: "COT-2026-000008",
    currentVersion: 1,
    inquiryCode: "SOL-2026-000016",
    routeLabel: "CO → CR · Aéreo",
    companyName: "Café Altura Export S.A.S.",
    status: "sent",
    total: { amount: 342000, currency: "USD" },
    validityLabel: "Vence el 13 nov 2026",
    advisorName: "Andrés Rojas",
  },
  {
    code: "COT-2026-000007",
    currentVersion: 2,
    inquiryCode: "SOL-2026-000013",
    routeLabel: "CR → CO · Marítimo",
    companyName: "Importadora Central CR S.A.",
    status: "sent",
    total: { amount: 596000, currency: "USD" },
    validityLabel: "Vence el 18 nov 2026",
    advisorName: "Carolina Méndez",
  },
  {
    code: "COT-2026-000006",
    currentVersion: 1,
    inquiryCode: "SOL-2026-000009",
    routeLabel: "CO → CR · Marítimo",
    companyName: "Distribuidora Andina S.A.S.",
    status: "accepted",
    total: { amount: 115000, currency: "USD" },
    validityLabel: "Aceptada el 28 oct 2026",
    advisorName: "Andrés Rojas",
  },
  {
    code: "COT-2026-000004",
    currentVersion: 1,
    inquiryCode: "SOL-2026-000006",
    routeLabel: "CO → CR · Aéreo",
    companyName: "Distribuidora Andina S.A.S.",
    status: "expired",
    total: { amount: 64000, currency: "USD" },
    validityLabel: "Venció el 20 oct 2026",
    advisorName: "Andrés Rojas",
  },
  {
    code: "COT-2026-000003",
    currentVersion: 1,
    inquiryCode: "SOL-2026-000005",
    routeLabel: "CO → CR · Terrestre",
    companyName: "Comercial Andes Ltda.",
    status: "rejected",
    total: { amount: 4850000, currency: "COP" },
    validityLabel: "Rechazada el 15 oct 2026",
    advisorName: "Carolina Méndez",
  },
  {
    code: "COT-2026-000002",
    currentVersion: 2,
    inquiryCode: "SOL-2026-000003",
    routeLabel: "CR → CO · Mensajería",
    companyName: "Distribuidora Andina S.A.S.",
    status: "rejected",
    total: { amount: 8500, currency: "USD" },
    validityLabel: "Rechazada el 12 oct 2026",
    advisorName: "Andrés Rojas",
  },
];
