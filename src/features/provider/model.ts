import type { Tone } from "@/shared/ui/StatusPill";

/** Estado de un proveedor, con el valor que persiste el backend. */
export type ProviderStatus = "draft" | "in_review" | "approved" | "published" | "unpublished" | "suspended";

/** Etiqueta y tono de cada estado. */
export const providerStatus: Record<ProviderStatus, { label: string; tone: Tone }> = {
  draft: { label: "Borrador", tone: "neutral" },
  in_review: { label: "En revisión", tone: "warn" },
  approved: { label: "Aprobado", tone: "info" },
  published: { label: "Publicado", tone: "success" },
  unpublished: { label: "Despublicado", tone: "muted" },
  suspended: { label: "Suspendido", tone: "danger" },
};

/** Tipo de proveedor que distingue el diseño: mayorista de productos u operador logístico. */
export type ProviderKind = "supplier" | "logistics";

/** Nombre visible de cada tipo de proveedor. */
export const providerKind: Record<ProviderKind, string> = {
  supplier: "Proveedor mayorista",
  logistics: "Operador logístico",
};
