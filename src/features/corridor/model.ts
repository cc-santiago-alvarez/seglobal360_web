import type { Tone } from "@/shared/ui/StatusPill";

/** Estado de un corredor, con el valor que persiste el backend. */
export type CorridorStatus = "draft" | "active" | "inactive";

/** Etiqueta y tono de cada estado. */
export const corridorStatus: Record<CorridorStatus, { label: string; tone: Tone }> = {
  draft: { label: "Borrador", tone: "neutral" },
  active: { label: "Activo", tone: "success" },
  inactive: { label: "Inactivo", tone: "muted" },
};
