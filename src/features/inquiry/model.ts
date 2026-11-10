import type { Tone } from "@/shared/ui/StatusPill";

/** Estado de una solicitud, con el valor que persiste el backend. */
export type InquiryStatus = "new" | "assigned" | "in_contact" | "quoted" | "won" | "lost" | "cancelled";

/** Etiqueta y tono de cada estado en la vista interna (backoffice). */
export const inquiryStatus: Record<InquiryStatus, { label: string; tone: Tone }> = {
  new: { label: "Nueva", tone: "warn" },
  assigned: { label: "Asignada", tone: "neutral" },
  in_contact: { label: "En contacto", tone: "info" },
  quoted: { label: "Cotizada", tone: "info" },
  won: { label: "Ganada", tone: "success" },
  lost: { label: "Perdida", tone: "danger" },
  cancelled: { label: "Cancelada", tone: "muted" },
};

/** Etiqueta y tono de cada estado en la vista del cliente. */
export const inquiryClientStatus: Record<InquiryStatus, { label: string; tone: Tone }> = {
  new: { label: "Recibida", tone: "warn" },
  assigned: { label: "Asignada", tone: "neutral" },
  in_contact: { label: "En conversación", tone: "info" },
  quoted: { label: "Cotizada", tone: "info" },
  won: { label: "Aceptada", tone: "success" },
  lost: { label: "Cerrada", tone: "muted" },
  cancelled: { label: "Cancelada", tone: "muted" },
};

/** Pasos del seguimiento que ve el cliente, en orden. */
export const inquiryTrack: ReadonlyArray<{ status: InquiryStatus; label: string }> = [
  { status: "new", label: "Recibida" },
  { status: "assigned", label: "Asignada" },
  { status: "in_contact", label: "En conversación" },
  { status: "quoted", label: "Cotizada" },
  { status: "won", label: "Aceptada" },
];

/** El cliente puede cancelar solo en estos estados. */
export function canClientCancel(status: InquiryStatus): boolean {
  return status === "new" || status === "assigned" || status === "in_contact";
}
