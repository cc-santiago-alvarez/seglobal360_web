import type { CurrencyCode, Money } from "./fixtures";

const currencySymbol: Record<CurrencyCode, string> = { USD: "US$", COP: "COP$", CRC: "₡" };
const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Entero con punto de miles: 8400 → «8.400». */
export function formatInteger(value: number): string {
  return Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Monto en unidades menores con dos decimales: 280000 USD → «US$ 2.800,00». */
export function formatMoney({ amount, currency }: Money): string {
  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  const cents = (absolute % 100).toString().padStart(2, "0");
  return `${sign}${currencySymbol[currency]} ${formatInteger(Math.floor(absolute / 100))},${cents}`;
}

/** Fecha ISO (AAAA-MM-DD) en formato corto: «19 nov 2026». */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day} ${months[month - 1] ?? ""} ${year}`;
}

/** Número con punto de miles y coma decimal: 1200.5 → «1.200,5». */
export function formatDecimal(value: number): string {
  const [whole = "0", decimals] = Math.abs(value).toString().split(".");
  return `${value < 0 ? "-" : ""}${formatInteger(Number(whole))}${decimals ? `,${decimals}` : ""}`;
}

/** Volumen en litros como metros cúbicos: 28000 → «28 m³», 1200 → «1,2 m³». */
export function formatCubicMeters(liters: number): string {
  return `${formatDecimal(Math.round(liters) / 1000)} m³`;
}
