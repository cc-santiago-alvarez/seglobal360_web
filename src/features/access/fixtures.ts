import type { CompanyType } from "@/features/company/model";
import { routes } from "@/shared/lib/routes";
import type { CountryCode } from "@/shared/ui/Flag";

/** Número de WhatsApp de SEGlobal 360, en formato internacional sin signos. */
export const whatsappPhone = "573005561093";

/** Número de WhatsApp tal como se muestra. */
export const whatsappPhoneLabel = "+57 300 556 1093";

/** Tema de la conversación que el visitante elige antes de abrir WhatsApp. */
export type ContactTopicId = "import" | "export" | "provider" | "logistics" | "other";

/** Tema de contacto con el mensaje inicial que se envía por WhatsApp. */
export interface ContactTopic {
  id: ContactTopicId;
  label: string;
  message: string;
}

/** Temas de la tarjeta de WhatsApp de Contacto, en orden. */
export const contactTopics: ContactTopic[] = [
  {
    id: "import",
    label: "Importar productos",
    message: "Hola SEGlobal 360, quiero importar productos y necesito una cotización.",
  },
  { id: "export", label: "Exportar", message: "Hola SEGlobal 360, quiero exportar mis productos a Costa Rica." },
  {
    id: "provider",
    label: "Ser proveedor",
    message: "Hola SEGlobal 360, quiero vender mis productos en el marketplace.",
  },
  {
    id: "logistics",
    label: "Soy operador logístico",
    message: "Hola SEGlobal 360, quiero publicar mis servicios logísticos.",
  },
  { id: "other", label: "Otra consulta", message: "Hola SEGlobal 360, quiero información sobre sus servicios." },
];

/** Tipo de empresa que se puede elegir al registrarse. */
export type RegisterCompanyType = Exclude<CompanyType, "internal">;

/** Opción de tipo de empresa del registro, con el último paso que ve al terminar. */
export interface RegisterTypeOption {
  id: RegisterCompanyType;
  title: string;
  description: string;
  /** Si su perfil pasa por revisión de Operaciones antes de publicarse. */
  reviewsProfile: boolean;
  finalStep: string;
}

/** Tipos de empresa del primer paso del registro, en orden. */
export const registerTypes: RegisterTypeOption[] = [
  {
    id: "client",
    title: "Cliente",
    description: "Quiero comprar productos o mover carga y pedir cotizaciones.",
    reviewsProfile: false,
    finalStep: "Ya puedes pedir cotizaciones desde el marketplace.",
  },
  {
    id: "supplier",
    title: "Proveedor",
    description: "Vendo productos al por mayor en el marketplace.",
    reviewsProfile: true,
    finalStep: "Publicamos tu perfil y tus productos en el marketplace.",
  },
  {
    id: "logistics",
    title: "Operador logístico",
    description: "Ofrezco transporte, aduana, bodegaje o mensajería.",
    reviewsProfile: true,
    finalStep: "Publicamos tu perfil y tus servicios en el marketplace.",
  },
];

/** Tipo de documento del catálogo, con su código del backend. */
export interface DocumentTypeOption {
  code: string;
  name: string;
}

/** Moneda de facturación, con su código ISO 4217. */
export interface CurrencyOption {
  code: string;
  label: string;
}

/** País en el que se puede registrar una empresa, con sus documentos, moneda y teléfono. */
export interface RegisterCountry {
  code: CountryCode;
  name: string;
  companyDocument: DocumentTypeOption;
  companyDocumentPlaceholder: string;
  personDocuments: DocumentTypeOption[];
  currency: CurrencyOption;
  phonePlaceholder: string;
}

/** Países del registro, en orden. */
export const registerCountries: RegisterCountry[] = [
  {
    code: "CO",
    name: "Colombia",
    companyDocument: { code: "NIT", name: "NIT" },
    companyDocumentPlaceholder: "900123456-7",
    personDocuments: [
      { code: "CC", name: "Cédula de ciudadanía" },
      { code: "CE", name: "Cédula de extranjería" },
      { code: "PA", name: "Pasaporte" },
    ],
    currency: { code: "COP", label: "COP · Peso colombiano" },
    phonePlaceholder: "+57 300 000 0000",
  },
  {
    code: "CR",
    name: "Costa Rica",
    companyDocument: { code: "CJ", name: "Cédula jurídica" },
    companyDocumentPlaceholder: "3-101-123456",
    personDocuments: [
      { code: "CF", name: "Cédula física" },
      { code: "DIMEX", name: "DIMEX" },
      { code: "PA", name: "Pasaporte" },
    ],
    currency: { code: "CRC", label: "CRC · Colón costarricense" },
    phonePlaceholder: "+506 8000 0000",
  },
];

/** Moneda de facturación que se ofrece en todos los países. */
export const usdCurrency: CurrencyOption = { code: "USD", label: "USD · Dólar estadounidense" };

/** Pasos del asistente de registro, en orden. */
export const registerSteps: string[] = ["Empresa", "Tus datos", "Cuenta", "Verificación"];

/** Cuenta de demostración del ingreso, con el portal al que entra. */
export interface DemoAccount {
  email: string;
  name: string;
  portal: string;
  home: string;
}

/** Contraseña común de las cuentas de demostración; no protege nada, viaja en el bundle. */
export const demoPassword = "Demo-global360";

/** Una cuenta por portal, con las personas del diseño. */
export const demoAccounts: DemoAccount[] = [
  { email: "laura.gomez@andina.example", name: "Laura Gómez", portal: "Cliente", home: routes.client.home },
  { email: "laura@tecnoandina.example", name: "Laura Restrepo", portal: "Proveedor mayorista", home: routes.supplier.profile },
  { email: "mateo@caribefreight.example", name: "Mateo Herrera", portal: "Operador logístico", home: routes.logistics.profile },
  { email: "andres.rojas@seglobal360.example", name: "Andrés Rojas", portal: "Backoffice", home: routes.backoffice.inbox },
];

/** Cuenta que coincide con el correo y la contraseña, o `undefined`. */
export function findDemoAccount(email: string, password: string): DemoAccount | undefined {
  const normalized = email.trim().toLowerCase();
  if (password !== demoPassword) return undefined;
  return demoAccounts.find((account) => account.email === normalized);
}
