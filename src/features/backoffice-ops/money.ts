/** Monedas del corredor, con el código ISO 4217 del backend. */
export type CurrencyCode = "USD" | "COP" | "CRC";

/** Monto en unidades menores de su moneda, como `money.Money` del backend. */
export interface Money {
  amount: number;
  currency: CurrencyCode;
}

/** Símbolo y decimales de cada moneda, como los da el catálogo `currencies`. */
export const currencies: Record<CurrencyCode, { symbol: string; decimals: number }> = {
  USD: { symbol: "US$", decimals: 2 },
  COP: { symbol: "COP", decimals: 0 },
  CRC: { symbol: "₡", decimals: 2 },
};

function thousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Agrupa los miles de un entero con punto: 8400 → «8.400». */
export function groupThousands(value: number): string {
  const grouped = thousands(String(Math.trunc(Math.abs(value))));
  return value < 0 ? `-${grouped}` : grouped;
}

/** Escribe un monto con su símbolo, miles con punto y decimales con coma: «US$ 2.800,00». */
export function formatMoney({ amount, currency }: Money): string {
  const { symbol, decimals } = currencies[currency];
  const digits = String(Math.trunc(Math.abs(amount))).padStart(decimals + 1, "0");
  const cut = digits.length - decimals;
  const number = decimals > 0 ? `${thousands(digits.slice(0, cut))},${digits.slice(cut)}` : thousands(digits);
  return `${amount < 0 ? "-" : ""}${symbol} ${number}`;
}

/** Aplica una tasa en puntos básicos a un monto en unidades menores, con redondeo half-up. */
export function applyRate(amount: number, rateBps: number): number {
  const rounded = Math.floor((Math.abs(amount) * rateBps + 5000) / 10000);
  return amount < 0 ? -rounded : rounded;
}

/** Escribe una tasa en puntos básicos como porcentaje: 1200 → «12 %», 1250 → «12,50 %». */
export function formatRate(rateBps: number): string {
  const whole = Math.trunc(rateBps / 100);
  const rest = rateBps % 100;
  return rest === 0 ? `${whole} %` : `${whole},${String(rest).padStart(2, "0")} %`;
}

/** Convierte lo escrito en un campo numérico a unidades menores; lo que no es un monto vale 0. */
export function parseAmountInput(text: string, decimals: number): number {
  const match = /^(\d*)(?:\.(\d*))?$/.exec(text.trim());
  if (!match) return 0;
  const whole = match[1] ?? "";
  const fraction = (match[2] ?? "").padEnd(decimals + 1, "0");
  const base = Number(whole || "0") * 10 ** decimals + Number(fraction.slice(0, decimals) || "0");
  return fraction.charAt(decimals) >= "5" ? base + 1 : base;
}

/** Escribe unidades menores como el valor de un campo numérico: 180000 → «1800». */
export function toAmountInput(amount: number, decimals: number): string {
  if (decimals === 0) return String(amount);
  const digits = String(amount).padStart(decimals + 1, "0");
  const fraction = digits.slice(-decimals).replace(/0+$/, "");
  const whole = digits.slice(0, -decimals);
  return fraction ? `${whole}.${fraction}` : whole;
}
