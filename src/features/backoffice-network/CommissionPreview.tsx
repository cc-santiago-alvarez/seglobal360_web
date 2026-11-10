"use client";

import { useState } from "react";
import type { CommissionRule } from "./fixtures";
import { computeCommission, currencies, formatBps, formatMoney, parseDecimal, type CurrencyCode } from "./money";

type Props = { rule: CommissionRule | null; currency: CurrencyCode };

/** Calculadora de la comisión vigente sobre un subtotal, sin crear nada. */
export function CommissionPreview({ rule, currency }: Props) {
  const [subtotal, setSubtotal] = useState("2500");
  const { symbol, decimals } = currencies[currency];
  const amount = parseDecimal(subtotal, decimals) ?? 0;
  const result = rule ? { rateBps: rule.rateBps, ...computeCommission({ amount, currency }, rule) } : null;

  return (
    <section
      aria-label="Probar la comisión"
      className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 rounded-panel bg-navy-900 px-6 py-[22px] text-white"
    >
      <div>
        <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-300">Probar la comisión vigente</p>
        <p className="mt-1.5 mb-0 text-[13px] text-white/72">
          {rule
            ? `Calcula con la regla v${rule.version} sin crear nada.`
            : "Este corredor aún no tiene una regla de comisión vigente."}
        </p>
      </div>
      {result ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Subtotal de costos</span>
            <span className="flex items-center overflow-hidden rounded-field bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-500">
              <span className="pr-2.5 pl-3.5 text-sm font-semibold text-subtle">{symbol}</span>
              <input
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                value={subtotal}
                onChange={(event) => setSubtotal(event.target.value)}
                className="min-h-12 min-w-0 flex-auto border-0 bg-transparent font-sans text-base font-semibold text-navy-900 outline-none focus-visible:outline-none"
              />
            </span>
          </label>
          <dl className="m-0 flex flex-col gap-2.5">
            <div className="flex justify-between gap-3 text-sm">
              <dt className="text-white/72">
                Comisión · {formatBps(result.rateBps)}
                {result.minimumApplied ? " · mínimo" : ""}
              </dt>
              <dd className="m-0 font-semibold">{formatMoney(result.commission)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-white/15 pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="m-0 font-display text-[26px] font-semibold text-gold-300">
                {formatMoney({ amount: amount + result.commission.amount, currency })}
              </dd>
            </div>
          </dl>
        </>
      ) : null}
    </section>
  );
}
