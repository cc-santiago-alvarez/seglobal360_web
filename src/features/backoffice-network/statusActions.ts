import type { CompanyStatus } from "@/features/company/model";
import type { ProviderStatus } from "@/features/provider/model";
import type { ActionVariant } from "./ui";

/** Cambio de estado que el backoffice confirma con un diálogo en línea. */
export interface StatusAction<S extends string> {
  id: string;
  label: string;
  to: S;
  /** Título del historial y del aviso tras aplicarla. */
  done: string;
  /** Qué pasa después; también es la nota del historial si no hay motivo. */
  after: string;
  title: string;
  help: string;
  /** Etiqueta del motivo obligatorio; sin ella no se pide. */
  reasonLabel?: string;
  confirm: string;
  variant: Extract<ActionVariant, "primary" | "navy" | "danger">;
}

/** Acciones de estado de una empresa. */
export type CompanyActionId = "validate" | "reject" | "suspend" | "deactivate" | "reactivate";

/** Acciones de cada estado de empresa, en el orden de sus botones. */
export const companyActionsByStatus: Record<CompanyStatus, CompanyActionId[]> = {
  pending_validation: ["reject", "validate"],
  active: ["deactivate", "suspend"],
  suspended: ["deactivate", "reactivate"],
  inactive: ["reactivate"],
};

/** Textos y destino de cada acción sobre la empresa `name`. */
export function companyActions(name: string): Record<CompanyActionId, StatusAction<CompanyStatus>> {
  return {
    validate: {
      id: "validate",
      label: "Validar",
      to: "active",
      done: "Empresa validada",
      after: "Se avisó por correo a los administradores de la empresa.",
      title: `Validar ${name}`,
      help: "Se avisará por correo a los administradores de la empresa.",
      confirm: "Sí, validar",
      variant: "primary",
    },
    reject: {
      id: "reject",
      label: "Rechazar",
      to: "inactive",
      done: "Registro rechazado",
      after: "El motivo se envió por correo a la empresa.",
      title: `Rechazar el registro de ${name}`,
      help: "El motivo se envía por correo a la empresa.",
      reasonLabel: "Motivo del rechazo",
      confirm: "Rechazar registro",
      variant: "danger",
    },
    suspend: {
      id: "suspend",
      label: "Suspender",
      to: "suspended",
      done: "Empresa suspendida",
      after: "Sus usuarios no podrán pedir cotizaciones ni publicar mientras esté suspendida.",
      title: `Suspender ${name}`,
      help: "Sus usuarios no podrán operar mientras esté suspendida.",
      reasonLabel: "Motivo de la suspensión",
      confirm: "Suspender",
      variant: "danger",
    },
    deactivate: {
      id: "deactivate",
      label: "Desactivar",
      to: "inactive",
      done: "Empresa desactivada",
      after: "La empresa queda inactiva.",
      title: `Desactivar ${name}`,
      help: "La empresa queda inactiva y sus usuarios pierden el acceso.",
      reasonLabel: "Motivo de la desactivación",
      confirm: "Desactivar",
      variant: "danger",
    },
    reactivate: {
      id: "reactivate",
      label: "Reactivar",
      to: "active",
      done: "Empresa reactivada",
      after: "La empresa vuelve a estar activa.",
      title: `Reactivar ${name}`,
      help: "La empresa vuelve a estar activa.",
      reasonLabel: "Motivo de la reactivación",
      confirm: "Reactivar",
      variant: "navy",
    },
  };
}

/** Acciones de estado de un proveedor. */
export type ProviderActionId = "approve" | "reject" | "publish" | "unpublish" | "suspend" | "restore";

/** Acciones de cada estado de proveedor, en el orden de sus botones. */
export const providerActionsByStatus: Record<ProviderStatus, ProviderActionId[]> = {
  draft: [],
  in_review: ["reject", "approve"],
  approved: ["suspend", "publish"],
  unpublished: ["suspend", "publish"],
  published: ["suspend", "unpublish"],
  suspended: ["restore"],
};

/** Textos y destino de cada acción sobre el proveedor `name`. */
export function providerActions(name: string): Record<ProviderActionId, StatusAction<ProviderStatus>> {
  return {
    approve: {
      id: "approve",
      label: "Aprobar",
      to: "approved",
      done: "Perfil aprobado",
      after: "Ya se puede publicar en el marketplace.",
      title: `Aprobar el perfil de ${name}`,
      help: "El perfil queda aprobado. Después puedes publicarlo en el marketplace.",
      confirm: "Sí, aprobar",
      variant: "navy",
    },
    reject: {
      id: "reject",
      label: "Rechazar",
      to: "draft",
      done: "Perfil devuelto al proveedor",
      after: "Las notas le llegan como observaciones para corregir.",
      title: `Rechazar el perfil de ${name}`,
      help: "El motivo le llega al proveedor como notas de revisión y el perfil vuelve a borrador.",
      reasonLabel: "Notas de revisión",
      confirm: "Rechazar perfil",
      variant: "danger",
    },
    publish: {
      id: "publish",
      label: "Publicar",
      to: "published",
      done: "Proveedor publicado",
      after: "Ya aparece en el marketplace.",
      title: `Publicar a ${name}`,
      help: "El proveedor aparecerá en el marketplace. La empresa debe estar activa.",
      confirm: "Sí, publicar",
      variant: "primary",
    },
    unpublish: {
      id: "unpublish",
      label: "Despublicar",
      to: "unpublished",
      done: "Proveedor despublicado",
      after: "Ya no aparece en el marketplace.",
      title: `Despublicar a ${name}`,
      help: "Dejará de aparecer en el marketplace.",
      reasonLabel: "Motivo",
      confirm: "Despublicar",
      variant: "danger",
    },
    suspend: {
      id: "suspend",
      label: "Suspender",
      to: "suspended",
      done: "Proveedor suspendido",
      after: "No aparece en el marketplace ni puede operar.",
      title: `Suspender a ${name}`,
      help: "No podrá operar ni aparecer en el marketplace mientras esté suspendido.",
      reasonLabel: "Motivo de la suspensión",
      confirm: "Suspender",
      variant: "danger",
    },
    restore: {
      id: "restore",
      label: "Restablecer",
      to: "approved",
      done: "Proveedor restablecido",
      after: "Vuelve a aprobado: hay que publicarlo de nuevo.",
      title: `Restablecer a ${name}`,
      help: "Vuelve a aprobado y hay que publicarlo de nuevo.",
      confirm: "Sí, restablecer",
      variant: "navy",
    },
  };
}
