import type { Tone } from "@/shared/ui/StatusPill";

/** Estado de una empresa, con el valor que persiste el backend. */
export type CompanyStatus = "pending_validation" | "active" | "suspended" | "inactive";

/** Etiqueta y tono de cada estado. */
export const companyStatus: Record<CompanyStatus, { label: string; tone: Tone }> = {
  pending_validation: { label: "Por validar", tone: "warn" },
  active: { label: "Activa", tone: "success" },
  suspended: { label: "Suspendida", tone: "danger" },
  inactive: { label: "Inactiva", tone: "muted" },
};

/** Tipo de empresa que muestra el diseño (el backend hoy distingue client, provider, both e internal). */
export type CompanyType = "client" | "supplier" | "logistics" | "internal";

/** Nombre visible de cada tipo de empresa. */
export const companyType: Record<CompanyType, string> = {
  client: "Cliente",
  supplier: "Proveedor mayorista",
  logistics: "Operador logístico",
  internal: "Interna",
};
