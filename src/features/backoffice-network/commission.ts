import type { Tone } from "@/shared/ui/StatusPill";
import type { CommissionRule } from "./fixtures";
import { formatDate } from "./format";

/** Regla vigente en un instante: la de mayor versión con `effectiveFrom` ≤ ese instante. */
export function effectiveRule(rules: readonly CommissionRule[], at: string): CommissionRule | null {
  const time = Date.parse(at);
  return rules.reduce<CommissionRule | null>(
    (best, rule) =>
      Date.parse(rule.effectiveFrom) <= time && (!best || rule.version > best.version) ? rule : best,
    null,
  );
}

/** Situación de una versión respecto a la vigente: etiqueta y tono de su vigencia. */
export function ruleValidity(rule: CommissionRule, current: CommissionRule | null): { label: string; tone: Tone } {
  const since = formatDate(rule.effectiveFrom);
  if (current && rule.id === current.id) return { label: `Vigente · desde ${since}`, tone: "success" };
  if (!current || rule.version > current.version) return { label: `Desde ${since}`, tone: "info" };
  return { label: `Reemplazada · desde ${since}`, tone: "muted" };
}
