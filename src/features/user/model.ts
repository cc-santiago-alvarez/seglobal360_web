import type { Tone } from "@/shared/ui/StatusPill";

/** Estado de un usuario, con el valor que persiste el backend. */
export type UserStatus = "pending_verification" | "active" | "inactive" | "blocked";

/** Etiqueta y tono de cada estado. */
export const userStatus: Record<UserStatus, { label: string; tone: Tone }> = {
  pending_verification: { label: "Por verificar", tone: "warn" },
  active: { label: "Activo", tone: "success" },
  inactive: { label: "Inactivo", tone: "muted" },
  blocked: { label: "Bloqueado", tone: "danger" },
};
