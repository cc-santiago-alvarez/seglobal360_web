import type { RegisterCompanyType } from "./fixtures";

/** Traduce el `?type=` del registro (client, provider o logistics) al tipo de empresa inicial. */
export function parseRegisterType(value: string | string[] | undefined): RegisterCompanyType {
  switch (Array.isArray(value) ? value[0] : value) {
    case "provider":
    case "supplier":
      return "supplier";
    case "logistics":
      return "logistics";
    default:
      return "client";
  }
}
