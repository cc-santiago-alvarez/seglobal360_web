import { clientStage } from "@/features/client/model";
import { companyStatus } from "@/features/company/model";
import { corridorStatus } from "@/features/corridor/model";
import { inquiryClientStatus, inquiryStatus } from "@/features/inquiry/model";
import { providerStatus } from "@/features/provider/model";
import { quoteClientStatus, quoteStatus } from "@/features/quote/model";
import { serviceStatus } from "@/features/service/model";
import { userStatus } from "@/features/user/model";
import type { Tone } from "@/shared/ui/StatusPill";

/** Estado con el valor que persiste el backend, su etiqueta y su tono. */
export interface StateItem {
  value: string;
  label: string;
  tone: Tone;
}

/** Grupo de estados de una entidad. */
export interface StateGroup {
  title: string;
  items: StateItem[];
}

function toItems(states: Record<string, { label: string; tone: Tone }>): StateItem[] {
  return Object.entries(states).map(([value, { label, tone }]) => ({ value, label, tone }));
}

/** Estados que ve el cliente, para la muestra de «Estados y seguimiento». */
export const clientStateGroups: StateGroup[] = [
  { title: "Solicitud (vista del cliente)", items: toItems(inquiryClientStatus) },
  { title: "Cotización (vista del cliente)", items: toItems(quoteClientStatus) },
];

/** Estados de la API por entidad, tomados de los modelos de cada módulo. */
export const apiStateGroups: StateGroup[] = [
  { title: "Solicitud (vista interna)", items: toItems(inquiryStatus) },
  { title: "Cotización (vista interna)", items: toItems(quoteStatus) },
  { title: "Proveedor", items: toItems(providerStatus) },
  { title: "Servicio", items: toItems(serviceStatus) },
  { title: "Empresa", items: toItems(companyStatus) },
  { title: "Usuario", items: toItems(userStatus) },
  { title: "Corredor y cliente", items: [...toItems(corridorStatus), ...toItems(clientStage)] },
];
