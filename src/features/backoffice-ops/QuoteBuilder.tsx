"use client";

import { Lock, Plus, Send, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { inquiryStatus } from "@/features/inquiry/model";
import { quoteStatus } from "@/features/quote/model";
import { cn } from "@/shared/lib/cn";
import { buttonClass } from "@/shared/ui/Button";
import { Eyebrow, Panel } from "@/shared/ui/Card";
import { Table } from "@/shared/ui/Table";
import { demoClock, type QuoteDraft, type QuoteVersionSummary, type ServiceOption } from "./fixtures";
import { applyRate, currencies, formatMoney, formatRate, parseAmountInput, toAmountInput } from "./money";
import { compactControl, headCell } from "./ui";

type Row = { id: number; concept: string; description: string; serviceId: string; amount: string };
type FocusTarget = "confirm" | "revise" | "send";

const rowCell = "border-b border-line-soft py-3.5 align-top";
const rowInput =
  "w-full rounded-[10px] border border-line-warm bg-white px-2.5 font-sans text-navy-900 disabled:bg-ivory disabled:text-subtle";
const notesInput =
  "resize-y rounded-field border border-line-strong px-3 py-2.5 font-sans text-sm leading-normal font-medium text-navy-900 disabled:text-subtle";

function clockStamp(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

type Props = {
  quote: QuoteDraft;
  services: ServiceOption[];
  /** La solicitud está cerrada: la cotización queda de solo lectura. */
  inquiryClosed: boolean;
  onSent: (version: number) => void;
};

/** Cotizador interno: componentes de costo, comisión, notas, versiones y envío al cliente. */
export function QuoteBuilder({ quote, services, inquiryClosed, onSent }: Props) {
  const { symbol, decimals } = currencies[quote.currency];
  const [rows, setRows] = useState<Row[]>(() =>
    quote.components.map((component, index) => ({
      id: index + 1,
      concept: component.concept,
      description: component.description,
      serviceId: component.serviceId ?? "",
      amount: toAmountInput(component.amount.amount, decimals),
    })),
  );
  const [nextId, setNextId] = useState(quote.components.length + 1);
  const [versions, setVersions] = useState<QuoteVersionSummary[]>(quote.versions);
  const [clientNotes, setClientNotes] = useState(quote.clientNotes);
  const [internalNotes, setInternalNotes] = useState(quote.internalNotes);
  const [savedAt, setSavedAt] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const focusNext = useRef<FocusTarget | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const reviseRef = useRef<HTMLButtonElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const target = focusNext.current;
    if (!target) return;
    focusNext.current = null;
    const refs = { confirm: confirmRef, revise: reviseRef, send: sendRef };
    refs[target].current?.focus();
  });

  const current: QuoteVersionSummary = versions[versions.length - 1] ?? { version: 1, status: "draft" };
  const draft = current.status === "draft";
  const subtotal = rows.reduce((sum, row) => sum + parseAmountInput(row.amount, decimals), 0);
  const commission = applyRate(subtotal, quote.commission.rateBps);
  const total = formatMoney({ amount: subtotal + commission, currency: quote.currency });
  const money = (amount: number) => formatMoney({ amount, currency: quote.currency });

  function updateRow(id: number, patch: Partial<Omit<Row, "id">>) {
    setRows((list) => list.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: number) {
    setRows((list) => list.filter((row) => row.id !== id));
    setSavedAt("");
  }

  function addRow() {
    setRows((list) => [...list, { id: nextId, concept: "", description: "", serviceId: "", amount: "0" }]);
    setNextId((value) => value + 1);
    setSavedAt("");
  }

  function saveDraft() {
    if (rows.length === 0) {
      setError("Agrega al menos un concepto para guardar la cotización.");
      setSavedAt("");
      return;
    }
    setSavedAt(clockStamp());
    setError("");
  }

  function startSend() {
    if (rows.length === 0) {
      setError("La cotización necesita al menos un concepto para enviarse.");
      return;
    }
    setSending(true);
    setError("");
    focusNext.current = "confirm";
  }

  function cancelSend() {
    setSending(false);
    focusNext.current = "send";
  }

  function send() {
    setSending(false);
    setSavedAt("");
    setVersions((list) => list.map((item, index) => (index === list.length - 1 ? { ...item, status: "sent" } : item)));
    onSent(current.version);
    focusNext.current = "revise";
  }

  function revise() {
    setVersions((list) => [...list, { version: current.version + 1, status: "draft" }]);
    setSavedAt("");
    focusNext.current = "send";
  }

  return (
    <Panel aria-label="Cotizador" className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
        <div>
          <Eyebrow>Cotizador · {quote.currency}</Eyebrow>
          <h2 className="mt-1.5 mb-0 font-display text-xl font-bold tracking-[-0.02em]">{quote.code}</h2>
        </div>
        <div role="group" aria-label="Versiones" className="flex flex-wrap gap-1.5">
          {versions.map((item, index) => {
            const isCurrent = index === versions.length - 1;
            return (
              <span
                key={item.version}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-full border px-3 text-[13px] font-semibold",
                  isCurrent ? "border-navy-900 bg-navy-900 text-white" : "border-line-strong bg-white text-subtle",
                )}
              >
                v{item.version} · {quoteStatus[item.status].label}
                {item.status === "sent" ? ` ${demoClock.sentDay}` : ""}
              </span>
            );
          })}
        </div>
      </div>

      <fieldset disabled={inquiryClosed || !draft} className="m-0 min-w-0 border-0 p-0">
        <Table minWidth={760}>
          <thead>
            <tr>
              <th scope="col" className={cn(headCell, "w-[34%] py-3 pr-3 pl-6 text-left")}>
                Concepto
              </th>
              <th scope="col" className={cn(headCell, "px-3 py-3 text-left")}>
                Proveedor · servicio
              </th>
              <th scope="col" className={cn(headCell, "w-[170px] px-3 py-3 text-right")}>
                Costo
              </th>
              <th scope="col" className={cn(headCell, "w-14 py-3 pr-6")}>
                <span className="visually-hidden">Quitar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={cn(rowCell, "pr-3 pl-6")}>
                  <label className="block">
                    <span className="visually-hidden">Concepto</span>
                    <input
                      type="text"
                      value={row.concept}
                      onChange={(event) => updateRow(row.id, { concept: event.target.value })}
                      className={cn(rowInput, "min-h-10 text-sm font-semibold")}
                    />
                  </label>
                  <label className="mt-1.5 block">
                    <span className="visually-hidden">Descripción</span>
                    <input
                      type="text"
                      value={row.description}
                      onChange={(event) => updateRow(row.id, { description: event.target.value })}
                      placeholder="Descripción para el cliente"
                      className={cn(rowInput, "min-h-9 text-[13px] font-normal text-ink placeholder:text-faint")}
                    />
                  </label>
                </td>
                <td className={cn(rowCell, "px-3")}>
                  <label className="block">
                    <span className="visually-hidden">Proveedor</span>
                    <select
                      value={row.serviceId}
                      onChange={(event) => updateRow(row.id, { serviceId: event.target.value })}
                      className={cn(compactControl, "w-full border-line-warm px-2")}
                    >
                      {services.map((service) => (
                        <option key={service.serviceId} value={service.serviceId}>
                          {service.label}
                        </option>
                      ))}
                      <option value="">Sin proveedor</option>
                    </select>
                  </label>
                </td>
                <td className={cn(rowCell, "px-3")}>
                  <label className="flex items-center overflow-hidden rounded-[10px] border border-line-warm bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-500 has-disabled:bg-ivory">
                    <span className="pr-2 pl-2.5 text-[13px] text-subtle">{symbol}</span>
                    <span className="visually-hidden">Costo</span>
                    <input
                      type="number"
                      min="0"
                      step={decimals > 0 ? `0.${"1".padStart(decimals, "0")}` : "1"}
                      value={row.amount}
                      onChange={(event) => updateRow(row.id, { amount: event.target.value })}
                      className="min-h-[38px] min-w-0 flex-auto border-0 bg-transparent pr-2.5 text-right font-sans text-sm font-semibold text-navy-900 outline-none disabled:text-subtle"
                    />
                  </label>
                </td>
                <td className={cn(rowCell, "pr-6")}>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    aria-label="Quitar concepto"
                    className="grid size-10 place-items-center rounded-[10px] border-0 bg-ivory text-danger-fg disabled:text-faint"
                  >
                    <Trash size={16} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="border-b border-line px-6 py-3">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex min-h-10 items-center gap-2 rounded-btn border border-dashed border-gold-500 bg-selected px-3 text-[13px] font-semibold text-warn-ink disabled:border-line-strong disabled:bg-ivory disabled:text-faint"
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            Agregar concepto
          </button>
        </div>

        <div className="flex flex-wrap gap-5 px-6 py-5">
          <div className="flex flex-[1_1_280px] flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold">Notas para el cliente</span>
              <textarea
                rows={3}
                maxLength={2000}
                value={clientNotes}
                onChange={(event) => setClientNotes(event.target.value)}
                className={cn(notesInput, "bg-white")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Lock size={14} strokeWidth={2} aria-hidden="true" className="text-subtle" />
                Notas internas
              </span>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(event) => setInternalNotes(event.target.value)}
                className={cn(notesInput, "bg-[#FBFAF7]")}
              />
            </label>
          </div>

          <div className="flex flex-[1_1_280px] flex-col gap-2.5 rounded-tile bg-ivory p-[18px]">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-subtle">Subtotal de costos</span>
              <span className="font-semibold">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-subtle">
                Comisión SEGlobal 360 · {formatRate(quote.commission.rateBps)}
                <span className="block text-xs">
                  Regla v{quote.commission.ruleVersion} del corredor {quote.commission.corridorCode}
                </span>
              </span>
              <span className="font-semibold">{money(commission)}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-line-warm pt-3">
              <span className="font-semibold">Total para el cliente</span>
              <span className="font-display text-[26px] font-semibold">{total}</span>
            </div>
            <p className="m-0 text-xs text-subtle">
              El cliente ve los conceptos y el total, nunca los costos ni la comisión. Vigencia al enviar:{" "}
              {quote.validityDays} días.
            </p>
          </div>
        </div>
      </fieldset>

      {savedAt !== "" && draft && !inquiryClosed ? (
        <div role="status" className="border-t border-[#BFE3CC] bg-success-bg px-6 py-3 text-sm font-medium text-[#154F2E]">
          Borrador guardado a las {savedAt}. Calculado con la regla vigente; se recalcula al enviar.
        </div>
      ) : null}

      {error !== "" && !inquiryClosed ? (
        <div role="alert" className="border-t border-[#F1C3BD] bg-danger-bg px-6 py-3 text-sm font-medium text-[#7D241B]">
          {error}
        </div>
      ) : null}

      {draft && !inquiryClosed && !sending ? (
        <div className="flex flex-wrap justify-end gap-2.5 border-t border-line bg-[#FBFAF7] px-6 py-4">
          <button type="button" onClick={saveDraft} className={buttonClass("outline", "md", "min-h-[46px]! px-5! text-sm!")}>
            Guardar borrador
          </button>
          <button
            ref={sendRef}
            type="button"
            onClick={startSend}
            className={buttonClass("gold", "md", "min-h-[46px]! gap-2! text-sm!")}
          >
            <Send size={16} strokeWidth={2} aria-hidden="true" />
            Enviar al cliente
          </button>
        </div>
      ) : null}

      {draft && !inquiryClosed && sending ? (
        <div
          role="alertdialog"
          aria-label="Confirmar envío"
          className="flex flex-wrap items-center justify-between gap-4 bg-navy-900 px-6 py-5 text-white"
        >
          <p className="m-0 max-w-[520px] text-[15px] leading-normal">
            Vas a enviar la versión {current.version} por <strong className="text-gold-300">{total}</strong>. Vencerá{" "}
            {quote.validityDays} días después del envío y el cliente recibirá un aviso por correo.
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={cancelSend}
              className="inline-flex min-h-[46px] items-center rounded-btn border border-white/35 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Volver
            </button>
            <button
              ref={confirmRef}
              type="button"
              onClick={send}
              className={buttonClass("gold", "md", "min-h-[46px]! text-sm!")}
            >
              Sí, enviar
            </button>
          </div>
        </div>
      ) : null}

      {!draft ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 bg-info-bg px-6 py-[18px] text-info-ink">
          <p className="m-0 text-[15px] leading-normal">
            <strong className="font-semibold">Enviada al cliente el {demoClock.sentAt}.</strong> Vence el{" "}
            {demoClock.validUntil}. La solicitud quedó en {inquiryStatus.quoted.label}.
          </p>
          {!inquiryClosed ? (
            <button
              ref={reviseRef}
              type="button"
              onClick={revise}
              className={buttonClass("outline", "sm", "min-h-11! border-navy-900! px-[18px]! text-sm!")}
            >
              Crear versión nueva
            </button>
          ) : null}
        </div>
      ) : null}

      {draft && versions.length > 1 && !inquiryClosed ? (
        <div role="status" className="border-t border-sand-line bg-sand px-6 py-3 text-sm font-medium text-warn-ink">
          Mientras la nueva versión esté en borrador, el cliente no verá ninguna cotización.
        </div>
      ) : null}
    </Panel>
  );
}
