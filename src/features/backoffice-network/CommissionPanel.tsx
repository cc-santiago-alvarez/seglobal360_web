"use client";

import { Plus } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table } from "@/shared/ui/Table";
import { ruleValidity } from "./commission";
import { demoNow, type CommissionRule, type NetworkCorridor } from "./fixtures";
import { formatDate, toDateInput } from "./format";
import {
  countDecimals,
  currencies,
  formatBps,
  formatMoney,
  parseDecimal,
  toDecimalInput,
  type CurrencyCode,
} from "./money";
import { DetailTd, DetailTh, FieldError, actionClass, controlClass, labelTextClass, panelTitle } from "./ui";

const ruleTypes: Record<CommissionRule["type"], string> = { percentage: "Porcentaje" };

type Props = {
  corridor: NetworkCorridor;
  rules: CommissionRule[];
  current: CommissionRule | null;
  onCreate: (rule: CommissionRule) => void;
};

/** Versiones de la comisión de un corredor y alta de una versión nueva. */
export function CommissionPanel({ corridor, rules, current, onCreate }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const sorted = [...rules].sort((a, b) => b.version - a.version);
  const latest = sorted[0] ?? null;

  return (
    <section
      aria-label="Comisión"
      className="min-w-0 flex-[999_1_520px] overflow-hidden rounded-panel border border-[#E9E6DE] bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
        <div>
          <h2 className={panelTitle}>Comisión de SEGlobal 360</h2>
          <p className="mt-1 mb-0 text-[13px] text-subtle">
            Cada cambio crea una versión. Las cotizaciones guardan la versión con la que se calcularon.
          </p>
        </div>
        {formOpen ? null : (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="lift inline-flex min-h-[42px] items-center gap-2 rounded-btn border-0 bg-gold-500 px-4 text-sm font-semibold text-navy-950"
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            Nueva versión
          </button>
        )}
      </div>

      {formOpen ? (
        <RuleForm
          corridor={corridor}
          latest={latest}
          onCancel={() => setFormOpen(false)}
          onCreate={(rule) => {
            setFormOpen(false);
            onCreate(rule);
          }}
        />
      ) : null}

      {sorted.length > 0 ? (
        <Table minWidth={640}>
          <thead>
            <tr>
              <DetailTh>Versión</DetailTh>
              <DetailTh>Tipo</DetailTh>
              <DetailTh>Tasa</DetailTh>
              <DetailTh>Mínimos</DetailTh>
              <DetailTh>Vigencia</DetailTh>
            </tr>
          </thead>
          <tbody>
            {sorted.map((rule) => {
              const validity = ruleValidity(rule, current);
              return (
                <tr key={rule.id}>
                  <DetailTd className="font-semibold">v{rule.version}</DetailTd>
                  <DetailTd>{ruleTypes[rule.type]}</DetailTd>
                  <DetailTd className="font-semibold">{formatBps(rule.rateBps)}</DetailTd>
                  <DetailTd className="text-ink">
                    {rule.minimums.length > 0 ? rule.minimums.map(formatMoney).join(" · ") : "—"}
                  </DetailTd>
                  <DetailTd>
                    <StatusPill tone={validity.tone}>{validity.label}</StatusPill>
                  </DetailTd>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p className="m-0 px-6 py-10 text-center text-[15px] text-subtle">
          Aún no hay versiones de comisión. Crea la primera para poder activar el corredor.
        </p>
      )}
    </section>
  );
}

type RuleFormProps = {
  corridor: NetworkCorridor;
  latest: CommissionRule | null;
  onCancel: () => void;
  onCreate: (rule: CommissionRule) => void;
};

function RuleForm({ corridor, latest, onCancel, onCreate }: RuleFormProps) {
  const id = useId();
  const rateRef = useRef<HTMLInputElement>(null);
  const today = toDateInput(demoNow);
  const latestDay = latest ? toDateInput(latest.effectiveFrom) : today;
  const minDate = latestDay > today ? latestDay : today;
  const version = (latest?.version ?? 0) + 1;

  const [rate, setRate] = useState(latest ? toDecimalInput(latest.rateBps, 2) : "");
  const [minimums, setMinimums] = useState<Partial<Record<CurrencyCode, string>>>({});
  const [date, setDate] = useState(minDate);
  const [notes, setNotes] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    rateRef.current?.focus();
  }, []);

  const rateBps = countDecimals(rate) <= 2 ? parseDecimal(rate, 2) : null;
  const rateError = tried && (rateBps === null || rateBps > 10000);
  const minimumFields = corridor.currencyCodes.map((currency) => {
    const text = (minimums[currency] ?? "").trim();
    const { decimals } = currencies[currency];
    const amount = text === "" || countDecimals(text) > decimals ? null : parseDecimal(text, decimals);
    return { currency, text, amount, invalid: text !== "" && amount === null };
  });
  const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= minDate;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rateBps === null || rateBps > 10000 || !dateValid || minimumFields.some((field) => field.invalid)) {
      setTried(true);
      return;
    }
    onCreate({
      id: `${corridor.code}-v${version}`,
      corridorCode: corridor.code,
      version,
      type: "percentage",
      rateBps,
      minimums: minimumFields.flatMap((field) =>
        field.amount === null ? [] : [{ amount: field.amount, currency: field.currency }],
      ),
      effectiveFrom: date === today ? demoNow : `${date}T00:00:00Z`,
      notes: notes.trim() || null,
    });
  }

  return (
    <form
      aria-labelledby={`${id}-title`}
      noValidate
      onSubmit={submit}
      className="flex flex-col gap-4 border-b border-line bg-ivory px-6 py-5"
    >
      <h3 id={`${id}-title`} className="m-0 font-display text-base font-bold tracking-[-0.02em]">
        Nueva versión · v{version}
      </h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-x-5 gap-y-4">
        <label className="flex flex-col gap-1.5">
          <span className={labelTextClass}>Tasa de comisión (%)</span>
          <input
            ref={rateRef}
            type="number"
            min={0}
            max={100}
            step={0.01}
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            aria-invalid={rateError}
            aria-describedby={rateError ? `${id}-rate-error` : undefined}
            className={controlClass}
          />
          {rateError ? (
            <FieldError id={`${id}-rate-error`}>Usa un porcentaje de 0 a 100, con dos decimales como máximo.</FieldError>
          ) : null}
        </label>
        {minimumFields.map((field) => {
          const showError = tried && field.invalid;
          return (
            <label key={field.currency} className="flex flex-col gap-1.5">
              <span className={labelTextClass}>
                Mínimo en {field.currency} <span className="font-normal text-subtle">(opcional)</span>
              </span>
              <input
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                value={minimums[field.currency] ?? ""}
                onChange={(event) => setMinimums({ ...minimums, [field.currency]: event.target.value })}
                aria-invalid={showError}
                aria-describedby={showError ? `${id}-min-${field.currency}` : undefined}
                className={controlClass}
              />
              {showError ? <FieldError id={`${id}-min-${field.currency}`}>Escribe un monto válido.</FieldError> : null}
            </label>
          );
        })}
        <label className="flex flex-col gap-1.5">
          <span className={labelTextClass}>Rige desde</span>
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-invalid={tried && !dateValid}
            aria-describedby={tried && !dateValid ? `${id}-date-error` : undefined}
            className={controlClass}
          />
          {tried && !dateValid ? (
            <FieldError id={`${id}-date-error`}>Elige el {formatDate(minDate)} o una fecha posterior.</FieldError>
          ) : null}
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>
          Notas <span className="font-normal text-subtle">(opcional)</span>
        </span>
        <input
          type="text"
          maxLength={2000}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Política comercial aprobada por gerencia"
          className={controlClass}
        />
      </label>
      <p className="m-0 text-[13px] text-subtle">
        Una versión creada no se modifica. Si rige desde hoy, reemplaza a la vigente desde este momento; las
        cotizaciones ya calculadas conservan su versión.
      </p>
      <div className="flex flex-wrap justify-end gap-2.5">
        <button type="button" onClick={onCancel} className={actionClass("outline")}>
          Cancelar
        </button>
        <button type="submit" className={actionClass("navy")}>
          Crear versión
        </button>
      </div>
    </form>
  );
}
