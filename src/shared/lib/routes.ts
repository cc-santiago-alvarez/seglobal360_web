/** Convierte un nombre en un identificador de URL: minúsculas, sin tildes y con guiones. */
export function slug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Rutas de la aplicación; los enlaces entre pantallas se arman siempre desde aquí. */
export const routes = {
  home: "/",
  marketplace: "/marketplace",
  service: (id: string) => `/marketplace/services/${id}`,
  provider: (id: string) => `/marketplace/providers/${id}`,
  contact: "/contact",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  getQuote: "/get-quote",
  terms: "/legal/terms",
  privacy: "/legal/privacy",
  designSystem: "/dev/ui",
  client: {
    home: "/portal",
    inquiries: "/portal/inquiries",
    inquiry: (code: string) => `/portal/inquiries/${code}`,
    newInquiry: "/portal/inquiries/new",
    quotes: "/portal/quotes",
    company: "/portal/company",
    users: "/portal/company/users",
  },
  supplier: {
    profile: "/supplier",
    company: "/supplier/company",
    users: "/supplier/company/users",
  },
  logistics: {
    profile: "/logistics",
    services: "/logistics/services",
    company: "/logistics/company",
    users: "/logistics/company/users",
  },
  backoffice: {
    inbox: "/backoffice",
    inquiries: "/backoffice/inquiries",
    inquiry: (code: string) => `/backoffice/inquiries/${code}`,
    quotes: "/backoffice/quotes",
    companies: "/backoffice/companies",
    providers: "/backoffice/providers",
    corridors: "/backoffice/corridors",
    corridor: (code: string) => `/backoffice/corridors/${code}`,
  },
} as const;

/** Códigos de las entidades de ejemplo que enlazan varias pantallas entre sí. */
export const demo = {
  inquiry: "SOL-2026-000017",
  quote: "COT-2026-000009",
  corridor: "CO-CR",
} as const;
