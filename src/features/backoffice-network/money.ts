/** Monedas de los corredores, con el código ISO 4217 del backend. */
export type CurrencyCode = "USD" | "COP" | "CRC";

/** Monto en unidades menores de su moneda, como `money.Money` del backend. */
export interface Money {
  amount: number;
  currency: CurrencyCode;
}

/** Símbolo y decimales de cada moneda, como los da el catálogo `currencies`. */
export const currencies: Record<CurrencyCode, { symbol: string; decimals: number }> = {
  USD: { symbol: "US$", decimals: 2 },
  COP: { symbol: "COP", decimals: 2 },
  CRC: { symbol: "₡", decimals: 2 },
};

/** Monedas en el orden en que se ofrecen en los formularios. */
export const currencyCodes: readonly CurrencyCode[] = ["USD", "COP", "CRC"];

/** Escribe un monto con su símbolo, miles con punto y decimales con coma: «US$ 2.500,00». */
export function formatMoney({ amount, currency }: Money): string {
  const { symbol, decimals } = currencies[currency];
  const digits = String(Math.trunc(Math.abs(amount))).padStart(decimals + 1, "0");
  const cut = digits.length - decimals;
  const whole = digits.slice(0, cut).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const number = decimals > 0 ? `${whole},${digits.slice(cut)}` : whole;
  return `${amount < 0 ? "-" : ""}${symbol} ${number}`;
}

/**
 * Aplica una tasa en puntos básicos a un monto en unidades menores, con redondeo half-up.
 * Divide antes de multiplicar para no salir de los enteros seguros de JavaScript.
 */
export function applyBps(amount: number, rateBps: number): number {
  const magnitude = Math.abs(amount);
  const high = Math.floor(magnitude / 10000);
  const low = magnitude % 10000;
  const result = high * rateBps + Math.floor((low * rateBps + 5000) / 10000);
  return amount < 0 ? -result : result;
}

/** Comisión de una regla de porcentaje: la tasa o el mínimo de esa moneda, el mayor. */
export function computeCommission(
  subtotal: Money,
  rule: { rateBps: number; minimums: readonly Money[] },
): { commission: Money; minimumApplied: boolean } {
  const amount = applyBps(subtotal.amount, rule.rateBps);
  const minimum = rule.minimums.find((item) => item.currency === subtotal.currency);
  if (minimum && minimum.amount > amount) return { commission: minimum, minimumApplied: true };
  return { commission: { amount, currency: subtotal.currency }, minimumApplied: false };
}

/** Escribe una tasa en puntos básicos como porcentaje: 1200 → «12 %», 1250 → «12,5 %». */
export function formatBps(rateBps: number): string {
  const whole = Math.trunc(rateBps / 100);
  const rest = String(rateBps % 100).padStart(2, "0").replace(/0+$/, "");
  return rest ? `${whole},${rest} %` : `${whole} %`;
}

/**
 * Convierte el valor de un campo numérico («2500.5») a unidades menores, con redondeo half-up
 * de los decimales de más. Devuelve null si no es un número positivo de hasta 12 cifras enteras.
 */
export function parseDecimal(text: string, decimals: number): number | null {
  const match = /^(\d+)?(?:[.,](\d*))?$/.exec(text.trim());
  if (!match || (!match[1] && !match[2])) return null;
  const whole = (match[1] ?? "").replace(/^0+(?=\d)/, "");
  if (whole.length > 12) return null;
  const fraction = match[2] ?? "";
  const base = Number(whole || "0") * 10 ** decimals + Number(fraction.slice(0, decimals).padEnd(decimals, "0") || "0");
  return fraction.length > decimals && fraction.charAt(decimals) >= "5" ? base + 1 : base;
}

/** Cuenta los decimales escritos en el valor de un campo numérico. */
export function countDecimals(text: string): number {
  const [, fraction = ""] = text.trim().split(/[.,]/);
  return fraction.length;
}

/** Escribe unidades menores como valor de un campo numérico: 120000 → «1200», 1250 → «12.5». */
export function toDecimalInput(amount: number, decimals: number): string {
  const digits = String(Math.trunc(Math.abs(amount))).padStart(decimals + 1, "0");
  const cut = digits.length - decimals;
  const fraction = digits.slice(cut).replace(/0+$/, "");
  return fraction ? `${digits.slice(0, cut)}.${fraction}` : digits.slice(0, cut);
}
