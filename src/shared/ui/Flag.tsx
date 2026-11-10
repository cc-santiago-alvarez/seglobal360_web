import { CO, CR } from "country-flag-icons/react/3x2";
import { cn } from "@/shared/lib/cn";

/** Países del corredor con bandera disponible. */
export type CountryCode = "CO" | "CR";

/** Nombre en español de cada país del corredor. */
export const countryName: Record<CountryCode, string> = { CO: "Colombia", CR: "Costa Rica" };

const flags = { CO, CR };

/** Bandera decorativa de 20 × 14 px; el nombre del país va siempre al lado. */
export function Flag({ code, className }: { code: CountryCode; className?: string }) {
  const Svg = flags[code];
  return <Svg aria-hidden="true" className={cn("h-3.5 w-5 shrink-0 rounded-[3px]", className)} />;
}
