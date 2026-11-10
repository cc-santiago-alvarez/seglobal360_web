import type { Tone } from "@/shared/ui/StatusPill";

/** Estado de un servicio, con el valor que persiste el backend. */
export type ServiceStatus = "draft" | "published" | "unpublished" | "archived";

/** Etiqueta y tono de cada estado. */
export const serviceStatus: Record<ServiceStatus, { label: string; tone: Tone }> = {
  draft: { label: "Borrador", tone: "neutral" },
  published: { label: "Publicado", tone: "success" },
  unpublished: { label: "Despublicado", tone: "muted" },
  archived: { label: "Archivado", tone: "muted" },
};
