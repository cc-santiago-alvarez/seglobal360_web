import type { InquiryStatus } from "@/features/inquiry/model";
import { routes, slug } from "@/shared/lib/routes";
import type { CountryCode } from "@/shared/ui/Flag";

/** Qué se busca desde la portada: productos de mayoristas o servicios logísticos. */
export type SearchMode = "products" | "services";

/** Opciones del selector de modo del buscador. */
export const searchModes: ReadonlyArray<{ id: SearchMode; label: string }> = [
  { id: "products", label: "Productos" },
  { id: "services", label: "Servicios logísticos" },
];

/** Sentido de la ruta del corredor, con el formato del parámetro `route` del marketplace. */
export type RouteDirection = "CO-CR" | "CR-CO";

/** Proveedor u operador que aparece en los resultados en vivo del buscador. */
export interface SearchEntry {
  initials: string;
  /** Nombre del proveedor mayorista o del operador logístico. */
  name: string;
  category: string;
  originCountry: CountryCode;
  summary: string;
  /** Palabras con las que también se encuentra, con y sin tildes. */
  keywords: string;
  /** Perfil del proveedor o ficha del servicio. */
  href: string;
}

type EntryData = Omit<SearchEntry, "href">;

const provider = (entry: EntryData): SearchEntry => ({ ...entry, href: routes.provider(slug(entry.name)) });
const service = (serviceName: string, entry: EntryData): SearchEntry => ({
  ...entry,
  href: routes.service(slug(serviceName)),
});

/** Catálogo de ejemplo del buscador de la portada, por modo. */
export const searchCatalog: Record<SearchMode, SearchEntry[]> = {
  products: [
    provider({
      initials: "TA",
      name: "TecnoAndina Distribuciones",
      category: "Tecnología",
      originCountry: "CO",
      summary: "Celulares, portátiles y accesorios · pedido mínimo USD 2.000",
      keywords: "celulares portatiles portátiles audifonos audífonos tablets computadores tecnologia tecnología",
    }),
    provider({
      initials: "BN",
      name: "Belleza Natural Co.",
      category: "Maquillaje",
      originCountry: "CO",
      summary: "Maquillaje y cuidado de la piel · pedido mínimo USD 800",
      keywords: "maquillaje labiales bases cuidado facial belleza cosmeticos cosméticos",
    }),
    provider({
      initials: "HC",
      name: "Hogar Caribe Mayorista",
      category: "Hogar",
      originCountry: "CO",
      summary: "Menaje y pequeños electrodomésticos · pedido mínimo USD 1.500",
      keywords: "hogar menaje electrodomesticos electrodomésticos decoracion decoración cocina",
    }),
    provider({
      initials: "MT",
      name: "Moda Textil Medellín",
      category: "Moda",
      originCountry: "CO",
      summary: "Ropa casual y deportiva, marca blanca · pedido mínimo USD 600",
      keywords: "moda ropa jeans camisetas textil marca blanca deportiva",
    }),
    provider({
      initials: "DP",
      name: "Deportes Pura Vida",
      category: "Deporte",
      originCountry: "CR",
      summary: "Balones, ropa y accesorios de gimnasio · pedido mínimo USD 1.000",
      keywords: "deporte balones gimnasio ropa deportiva tenis",
    }),
    provider({
      initials: "CT",
      name: "Café de Origen Tarrazú",
      category: "Alimentos",
      originCountry: "CR",
      summary: "Café de especialidad tostado y en grano · pedido mínimo USD 500",
      keywords: "cafe café alimentos bebidas grano tostado",
    }),
  ],
  services: [
    service("Flete marítimo FCL Cartagena → Puerto Limón", {
      initials: "CF",
      name: "Caribe Freight Group",
      category: "Marítimo",
      originCountry: "CO",
      summary: "Flete FCL Cartagena → Puerto Limón · 6–9 días",
      keywords: "maritimo marítimo contenedor fcl lcl consolidado barco flete",
    }),
    service("Carga aérea consolidada desde Bogotá y Medellín", {
      initials: "AA",
      name: "AeroCarga Andina",
      category: "Aéreo",
      originCountry: "CO",
      summary: "Carga aérea consolidada desde Bogotá y Medellín",
      keywords: "aereo aéreo avion avión carga aerea",
    }),
    service("Acarreo de contenedor puerto – bodega", {
      initials: "AC",
      name: "Andina Cargo Logistics",
      category: "Terrestre",
      originCountry: "CO",
      summary: "Acarreo de contenedor puerto – bodega · 1–2 días",
      keywords: "terrestre camion camión acarreo seguro poliza póliza",
    }),
    service("Nacionalización de importaciones en Costa Rica", {
      initials: "AI",
      name: "Aduanas Integrales CR",
      category: "Aduana",
      originCountry: "CR",
      summary: "Nacionalización de importaciones en Costa Rica",
      keywords: "aduana nacionalizacion nacionalización agenciamiento importacion importación",
    }),
    service("Bodegaje y cross-docking en Puerto Moín", {
      initials: "BA",
      name: "Bodegas del Atlántico",
      category: "Bodegaje",
      originCountry: "CR",
      summary: "Bodegaje y cross-docking junto a Puerto Moín",
      keywords: "bodega bodegaje almacenamiento cross docking inventario",
    }),
  ],
};

/** Categorías del buscador, por modo. */
export const searchCategories: Record<SearchMode, string[]> = {
  products: ["Tecnología", "Maquillaje", "Deporte", "Hogar", "Moda", "Alimentos"],
  services: ["Marítimo", "Aéreo", "Terrestre", "Aduana", "Bodegaje"],
};

/** Puerto principal de cada país del corredor. */
export const corridorPorts: Record<CountryCode, string> = { CO: "Cartagena", CR: "Puerto Limón" };

/** Tiempos de tránsito de la ruta de ejemplo. */
export const transitTimes: ReadonlyArray<{ mode: string; transitTime: string }> = [
  { mode: "Marítimo FCL", transitTime: "6–9 días" },
  { mode: "Consolidado LCL", transitTime: "10–14 días" },
];

/** Cotización de ejemplo de la tarjeta «Todo incluido». */
export const sampleQuote = {
  code: "COT-2026-000009",
  version: 1,
  validityLabel: "Vigente 10 días",
  lines: ["Flete marítimo FCL 20'", "Nacionalización en Costa Rica", "Gestión de SEGlobal 360"],
  totalLabel: "US$ 2.800,00",
} as const;

/** Iniciales de proveedores aprobados, con sus colores. */
export const approvedFaces: ReadonlyArray<{ initials: string; className: string }> = [
  { initials: "TA", className: "bg-navy-900 text-gold-300" },
  { initials: "BN", className: "bg-gold-500 text-navy-950" },
  { initials: "DP", className: "bg-navy-800 text-white" },
  { initials: "CF", className: "bg-gold-300 text-navy-950" },
  { initials: "AI", className: "bg-navy-900 text-white" },
];

/** Mensaje de ejemplo de la tarjeta «Acompañamiento». */
export const sampleMessage = {
  body: "¿La recogida en Medellín puede ser el 20 de noviembre?",
  author: "Tú",
  time: "15:40",
} as const;

/** Estado actual de la solicitud de ejemplo de la tarjeta «Seguimiento». */
export const sampleInquiryStatus: InquiryStatus = "in_contact";

/** Pasos de «Cómo funciona». */
export const howItWorksSteps: ReadonlyArray<{ number: string; title: string; text: string }> = [
  {
    number: "1",
    title: "Busca y pide tu cotización",
    text: "Elige un proveedor o un servicio, o cuéntanos qué necesitas mover. Te pedimos solo lo esencial de tu carga.",
  },
  {
    number: "2",
    title: "Tu asesor arma la operación",
    text: "Confirma precios con los proveedores, suma transporte y aduana, y te escribe por el portal o por WhatsApp.",
  },
  {
    number: "3",
    title: "Aceptas y sigues el envío",
    text: "Recibes el total con todo incluido, lo aceptas en línea y ves cada paso hasta la entrega.",
  },
];

/** Proveedor destacado de la vitrina. */
export interface ShowcaseProvider {
  name: string;
  category: string;
  /** Tipo y ciudad, ya formateados. */
  meta: string;
  photoCaption: string;
}

/** Proveedores destacados de la vitrina. */
export const showcaseProviders: ShowcaseProvider[] = [
  { name: "TecnoAndina Distribuciones", category: "Tecnología", meta: "Mayorista · Medellín", photoCaption: "Celulares" },
  { name: "Belleza Natural Co.", category: "Maquillaje y belleza", meta: "Fabricante · Bogotá", photoCaption: "Labiales" },
  { name: "Deportes Pura Vida", category: "Deporte", meta: "Distribuidor · San José", photoCaption: "Balones" },
  {
    name: "Hogar Caribe Mayorista",
    category: "Hogar",
    meta: "Mayorista · Barranquilla",
    photoCaption: "Pequeños electrodomésticos",
  },
  { name: "Moda Textil Medellín", category: "Moda", meta: "Fabricante · Medellín", photoCaption: "Jeans" },
];

/** Pasos de la banda «Para proveedores». */
export const supplierSteps: ReadonlyArray<{ number: string; text: string }> = [
  { number: "01", text: "Registras tu empresa como proveedor mayorista u operador logístico." },
  { number: "02", text: "Completas tu perfil: fotos de lo que vendes o los servicios que ofreces." },
  { number: "03", text: "Global 360 lo revisa, lo publica y te llegan las solicitudes." },
];

/** Pregunta frecuente con su respuesta. */
export interface Faq {
  id: string;
  question: string;
  answer: string;
}

/** Preguntas frecuentes del inicio, en orden. */
export const faqs: Faq[] = [
  {
    id: "account",
    question: "¿Necesito una cuenta para cotizar?",
    answer:
      "Sí. Para pedir cotizaciones en línea tu empresa debe registrarse y Operaciones la valida antes de habilitar las solicitudes. Mientras tanto puedes escribirnos por WhatsApp.",
  },
  {
    id: "prices",
    question: "¿Por qué no veo precios en el marketplace?",
    answer:
      "Cada operación se cotiza según tu mercancía, la ruta y el tipo de carga. Tu asesor arma la cotización con los proveedores y operadores, y la comisión de SEGlobal 360 va incluida en el total.",
  },
  {
    id: "routes",
    question: "¿Qué rutas cubren hoy?",
    answer:
      "El primer corredor es Colombia ↔ Costa Rica, en ambos sentidos. Si tu ruta no aparece, escríbenos y te contamos qué opciones hay.",
  },
  {
    id: "publish",
    question: "¿Cómo publico mis productos o servicios?",
    answer:
      "Registra tu empresa como proveedor mayorista u operador logístico, completa tu perfil y envíalo a revisión. Cuando Operaciones lo aprueba, aparece en el marketplace.",
  },
];
