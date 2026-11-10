import type { Tone } from "@/shared/ui/StatusPill";

/** Etapa comercial de un cliente: consolidado tras su primera cotización aceptada. */
export type ClientStage = "registered" | "consolidated";

/** Etiqueta y tono de cada etapa. */
export const clientStage: Record<ClientStage, { label: string; tone: Tone }> = {
  registered: { label: "Registrado", tone: "neutral" },
  consolidated: { label: "Consolidado", tone: "success" },
};
