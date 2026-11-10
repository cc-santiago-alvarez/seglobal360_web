import type { Tone } from "@/shared/ui/StatusPill";

/** Estado efectivo de una cotización (una enviada y vencida se muestra como `expired`). */
export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

/** Etiqueta y tono de cada estado en la vista interna (backoffice). */
export const quoteStatus: Record<QuoteStatus, { label: string; tone: Tone }> = {
  draft: { label: "Borrador", tone: "neutral" },
  sent: { label: "Enviada", tone: "info" },
  accepted: { label: "Aceptada", tone: "success" },
  rejected: { label: "Rechazada", tone: "danger" },
  expired: { label: "Vencida", tone: "muted" },
};

/** Estados que ve el cliente: nunca un borrador. */
export type QuoteClientStatus = Exclude<QuoteStatus, "draft">;

/** Etiqueta y tono de cada estado en la vista del cliente. */
export const quoteClientStatus: Record<QuoteClientStatus, { label: string; tone: Tone }> = {
  sent: { label: "Por responder", tone: "warn" },
  accepted: { label: "Aceptada", tone: "success" },
  rejected: { label: "Rechazada", tone: "danger" },
  expired: { label: "Vencida", tone: "muted" },
};
