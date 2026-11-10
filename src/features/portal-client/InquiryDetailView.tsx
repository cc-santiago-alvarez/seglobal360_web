"use client";

import { Calendar, Check, CircleX, FileText, Send, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { canClientCancel, inquiryClientStatus, inquiryTrack, type InquiryStatus } from "@/features/inquiry/model";
import { quoteClientStatus, type QuoteClientStatus } from "@/features/quote/model";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { Avatar } from "@/shared/ui/Avatar";
import { Eyebrow } from "@/shared/ui/Card";
import { textareaClass } from "@/shared/ui/Field";
import { countryName } from "@/shared/ui/Flag";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Breadcrumb } from "./Breadcrumb";
import {
  corridorLabel,
  todayLabel,
  transportName,
  type ConversationEntry,
  type InquiryDetail,
  type InquiryPlace,
} from "./fixtures";
import { formatCubicMeters, formatDate, formatInteger, formatMoney } from "./format";
import { autoGrid, headerClass, mainClass, panelTitle, portalButton } from "./ui";

const maxReason = 500;
const panelClass = "rounded-panel border border-[#E9E6DE] bg-white";
const reasonTextarea = cn(textareaClass, "min-h-0! resize-y");

/** Texto de los pasos del seguimiento que aún no se alcanzan. */
const pendingStepDates: Partial<Record<InquiryStatus, string>> = {
  quoted: "Cuando tu asesor la envíe",
  won: "Al aceptar la cotización",
};

type QuoteMode = "idle" | "confirm" | "rejecting";

type Step = { key: string; label: string; date: string; done: boolean; closed: boolean };

function placeLabel(place: InquiryPlace): string {
  return `${place.city}, ${countryName[place.country]}`;
}

function buildSteps(status: InquiryStatus, dates: Partial<Record<InquiryStatus, string>>): Step[] {
  if (status === "cancelled") {
    const reached = inquiryTrack.slice(0, 3).map((step) => ({
      key: step.status,
      label: step.label,
      date: dates[step.status] ?? "—",
      done: true,
      closed: false,
    }));
    return [...reached, { key: "cancelled", label: "Cancelada", date: dates.cancelled ?? todayLabel, done: true, closed: true }];
  }
  const current = inquiryTrack.findIndex((step) => step.status === status);
  return inquiryTrack.map((step, index) => ({
    key: step.status,
    label: step.label,
    date: dates[step.status] ?? pendingStepDates[step.status] ?? "—",
    done: index <= current,
    closed: false,
  }));
}

/** Detalle de una solicitud para el cliente: seguimiento, cotización, carga y conversación con el asesor. */
export function InquiryDetailView({ inquiry }: { inquiry: InquiryDetail }) {
  const quote = inquiry.quote;
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [quoteStatus, setQuoteStatus] = useState<QuoteClientStatus | null>(quote?.status ?? null);
  const [quoteMode, setQuoteMode] = useState<QuoteMode>("idle");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState(false);
  const [entries, setEntries] = useState<ConversationEntry[]>(inquiry.conversation);
  const [draft, setDraft] = useState("");

  const cancelRef = useRef<HTMLTextAreaElement>(null);
  const rejectRef = useRef<HTMLTextAreaElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cancelOpen) cancelRef.current?.focus();
  }, [cancelOpen]);

  useEffect(() => {
    if (quoteMode === "rejecting") rejectRef.current?.focus();
    if (quoteMode === "confirm") confirmRef.current?.focus();
  }, [quoteMode]);

  const cancelled = status === "cancelled";
  const isSent = quote !== null && quoteStatus === "sent";
  const inquiryPill = inquiryClientStatus[status];
  const quotePill = quoteStatus ? quoteClientStatus[quoteStatus] : null;
  const dates = { ...inquiry.trackDates, ...(status === "won" && !inquiry.trackDates.won ? { won: todayLabel } : {}) };
  const steps = buildSteps(status, dates);
  const showCancelError = cancelError && cancelReason.trim() === "";
  const showRejectError = rejectError && rejectReason.trim() === "";
  const subtitle = [
    corridorLabel(inquiry.corridorId),
    transportName(inquiry.transportCode),
    inquiry.serviceName && inquiry.providerName ? `${inquiry.serviceName} de ${inquiry.providerName}` : inquiry.serviceName,
    `creada el ${formatDate(inquiry.createdAt)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const cargo = [
    { label: "Mercancía", value: inquiry.cargo.description },
    { label: "Bultos", value: formatInteger(inquiry.cargo.packages) },
    { label: "Peso", value: `${formatInteger(inquiry.cargo.weightKg)} kg` },
    { label: "Volumen", value: formatCubicMeters(inquiry.cargo.volumeLiters) },
    { label: "Incoterm", value: inquiry.incoterm ?? "—" },
    { label: "Valor declarado", value: inquiry.cargo.declaredValue ? formatMoney(inquiry.cargo.declaredValue) : "—" },
    { label: "Embarque deseado", value: inquiry.desiredShipDate ? formatDate(inquiry.desiredShipDate) : "—" },
    { label: "Origen", value: placeLabel(inquiry.origin) },
    { label: "Destino", value: placeLabel(inquiry.destination) },
  ];

  const openCancel = () => {
    setCancelOpen(true);
    setCancelError(false);
  };

  const keepInquiry = () => {
    setCancelOpen(false);
    setCancelReason("");
    setCancelError(false);
  };

  const confirmCancel = () => {
    if (cancelReason.trim() === "") {
      setCancelError(true);
      cancelRef.current?.focus();
      return;
    }
    setStatus("cancelled");
    setCancelOpen(false);
    setEntries((current) => [
      ...current,
      { id: "evt-cancelled", kind: "event", tone: "closed", text: `Cancelaste la solicitud · ${todayLabel}` },
    ]);
  };

  const accept = () => {
    setQuoteStatus("accepted");
    setStatus("won");
    setQuoteMode("idle");
  };

  const reject = () => {
    if (rejectReason.trim() === "") {
      setRejectError(true);
      rejectRef.current?.focus();
      return;
    }
    setQuoteStatus("rejected");
    setQuoteMode("idle");
  };

  const backToQuote = () => {
    setQuoteMode("idle");
    setRejectError(false);
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (text === "") return;
    setEntries((current) => [
      ...current,
      { id: `msg-client-${current.length + 1}`, kind: "message", author: "client", meta: "Tú · Ahora", text },
    ]);
    setDraft("");
  };

  return (
    <>
      <header className={cn(headerClass, "flex flex-col gap-2.5")}>
        <Breadcrumb current={inquiry.code} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3.5">
            <h1 className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">{inquiry.code}</h1>
            <StatusPill tone={inquiryPill.tone} size="md">
              {inquiryPill.label}
            </StatusPill>
          </div>
          {canClientCancel(status) && !cancelOpen ? (
            <button
              type="button"
              onClick={openCancel}
              aria-expanded={cancelOpen}
              className={portalButton("danger", 44, { padding: "px-[18px]!" })}
            >
              Cancelar solicitud
            </button>
          ) : null}
        </div>
        <p className="m-0 text-[15px] text-subtle">{subtitle}</p>
      </header>

      <main className={cn(mainClass, "flex flex-col gap-6")}>
        {cancelOpen ? (
          <section
            role="alertdialog"
            aria-labelledby="cancel-titulo"
            aria-describedby="cancel-texto"
            className="flex flex-col gap-3.5 rounded-panel border border-[#E8B4AE] bg-white px-[26px] py-6 shadow-[0_12px_32px_rgba(155,44,34,0.08)]"
          >
            <div>
              <h2 id="cancel-titulo" className={panelTitle}>
                ¿Cancelar la solicitud {inquiry.code}?
              </h2>
              <p id="cancel-texto" className="mt-1.5 mb-0 text-sm leading-[1.55] text-subtle">
                Tu asesor deja de trabajar en ella y no podrás reabrirla. Si más adelante necesitas mover la carga, crea
                una nueva.
              </p>
            </div>
            <label className="flex flex-col gap-2">
              <span className="flex justify-between gap-3">
                <span className="text-sm font-semibold">
                  ¿Por qué cancelas la solicitud? <span className="font-normal text-subtle">(obligatorio)</span>
                </span>
                <span className="text-xs text-subtle">
                  {cancelReason.length} / {maxReason}
                </span>
              </span>
              <textarea
                ref={cancelRef}
                rows={3}
                maxLength={maxReason}
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                aria-invalid={showCancelError}
                aria-describedby={showCancelError ? "cancel-error" : undefined}
                placeholder="Ej.: el cliente final aplazó el pedido."
                className={cn(reasonTextarea, showCancelError && "border-danger-fg!")}
              />
              {showCancelError ? (
                <span id="cancel-error" role="alert" className="text-[13px] font-medium text-danger-fg">
                  Cuéntanos por qué cancelas la solicitud.
                </span>
              ) : null}
            </label>
            <div className="flex flex-wrap justify-end gap-2.5">
              <button type="button" onClick={keepInquiry} className={portalButton("outline", 46)}>
                No, mantenerla
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className={portalButton("dangerSolid", 46, { padding: "px-[22px]!" })}
              >
                Sí, cancelar solicitud
              </button>
            </div>
          </section>
        ) : null}

        {cancelled ? (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-tile border border-[#DCD8CE] bg-[#ECEAE4] px-5 py-4 text-ink"
          >
            <p className="m-0 flex items-center gap-3 text-[15px] font-medium">
              <CircleX size={20} strokeWidth={2} aria-hidden="true" className="shrink-0" />
              Cancelaste esta solicitud. Si necesitas mover la carga más adelante, crea una nueva.
            </p>
            <Link href={routes.client.newInquiry} className={portalButton("navy", 44, { padding: "px-[18px]!" })}>
              Crear una nueva solicitud
            </Link>
          </div>
        ) : null}

        <ol
          aria-label="Avance de la solicitud"
          className={cn(autoGrid[140], "m-0 list-none gap-3 rounded-tile border border-[#E9E6DE] bg-white px-[22px] py-[18px]")}
        >
          {steps.map((step, index) => (
            <li key={step.key} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold",
                  step.closed
                    ? "border-ink bg-ink text-white"
                    : step.done
                      ? "border-navy-900 bg-navy-900 text-gold-300"
                      : "border-line-strong bg-white text-subtle",
                )}
              >
                {step.closed ? "✕" : step.done ? "✓" : index + 1}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={cn("text-sm font-semibold", step.done ? "text-navy-900" : "text-subtle")}>
                  {step.label}
                  {step.done && !step.closed ? <span className="visually-hidden"> (completado)</span> : null}
                </span>
                <span className="text-xs text-subtle">{step.date}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-6">
            <section
              id="cotizacion"
              aria-label="Cotización"
              className={cn(panelClass, "overflow-hidden shadow-[0_12px_32px_rgba(11,27,51,0.06)]")}
            >
              {quote && quotePill ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-[26px] py-6">
                    <div>
                      <Eyebrow>Cotización · versión {quote.currentVersion}</Eyebrow>
                      <h2 className="mt-2 mb-0 font-display text-[22px] font-bold tracking-[-0.02em]">{quote.code}</h2>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusPill tone={quotePill.tone} size="md">
                        {quotePill.label}
                      </StatusPill>
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-subtle">
                        <Calendar size={14} strokeWidth={2} aria-hidden="true" />
                        Vigente hasta el {formatDate(quote.validUntil)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[18px] px-[26px] py-[22px]">
                    <div>
                      <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-subtle">Incluye</p>
                      <ul className="mt-3 mb-0 flex list-none flex-col gap-3 p-0">
                        {quote.concepts.map((item) => (
                          <li key={item.concept} className="flex items-start gap-3">
                            <Check size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-success-fg" />
                            <span>
                              <span className="block text-[15px] font-semibold">{item.concept}</span>
                              <span className="mt-0.5 block text-sm text-subtle">{item.description}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {quote.clientNotes ? (
                      <div className="rounded-field bg-ivory px-4 py-3.5 text-sm leading-[1.55] text-ink">
                        <strong className="font-semibold">Nota de tu asesor:</strong> {quote.clientNotes}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line pt-[18px]">
                      <span className="max-w-[320px] text-sm text-subtle">
                        Total con todos los servicios y la gestión de SEGlobal 360.
                      </span>
                      <span className="font-display text-[34px] font-semibold tracking-[-0.01em]">
                        {formatMoney(quote.total)}
                      </span>
                    </div>
                  </div>

                  {isSent && quoteMode === "idle" ? (
                    <div className="flex flex-wrap justify-end gap-3 border-t border-line bg-[#FBFAF7] px-[26px] py-[18px]">
                      <button type="button" onClick={() => setQuoteMode("rejecting")} className={portalButton("outline", 48)}>
                        Rechazar
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuoteMode("confirm")}
                        className={portalButton("gold", 48, { padding: "px-6!", text: "text-[15px]!" })}
                      >
                        Aceptar cotización
                      </button>
                    </div>
                  ) : null}

                  {isSent && quoteMode === "confirm" ? (
                    <div
                      ref={confirmRef}
                      tabIndex={-1}
                      role="alertdialog"
                      aria-label="Confirmar aceptación"
                      className="flex flex-wrap items-center justify-between gap-4 bg-navy-900 px-[26px] py-5 text-white"
                    >
                      <p className="m-0 max-w-[460px] text-[15px] leading-normal">
                        Vas a aceptar la versión {quote.currentVersion} por{" "}
                        <strong className="text-gold-300">{formatMoney(quote.total)}</strong>. ¿Confirmas?
                      </p>
                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={backToQuote}
                          className="lift inline-flex min-h-[46px] items-center justify-center rounded-btn border border-white/35 bg-transparent px-5 font-sans text-sm font-semibold text-white"
                        >
                          Volver
                        </button>
                        <button
                          type="button"
                          onClick={accept}
                          className={portalButton("gold", 46, { padding: "px-[22px]!" })}
                        >
                          Sí, aceptar
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {isSent && quoteMode === "rejecting" ? (
                    <div className="flex flex-col gap-3 border-t border-line bg-[#FBFAF7] px-[26px] py-5">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">¿Por qué la rechazas?</span>
                        <textarea
                          ref={rejectRef}
                          rows={3}
                          maxLength={maxReason}
                          value={rejectReason}
                          onChange={(event) => setRejectReason(event.target.value)}
                          aria-invalid={showRejectError}
                          aria-describedby={showRejectError ? "reject-error" : undefined}
                          placeholder="Tu asesor lo usa para preparar una nueva versión."
                          className={cn(reasonTextarea, showRejectError && "border-danger-fg!")}
                        />
                        {showRejectError ? (
                          <span id="reject-error" role="alert" className="text-[13px] font-medium text-danger-fg">
                            Cuéntanos por qué rechazas la cotización.
                          </span>
                        ) : null}
                      </label>
                      <div className="flex justify-end gap-2.5">
                        <button type="button" onClick={backToQuote} className={portalButton("outline", 46)}>
                          Volver
                        </button>
                        <button
                          type="button"
                          onClick={reject}
                          className={portalButton("dangerSolid", 46, { padding: "px-[22px]!" })}
                        >
                          Enviar rechazo
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {quoteStatus === "accepted" ? (
                    <div
                      role="status"
                      className="flex items-center gap-3 bg-success-bg px-[26px] py-[18px] text-[15px] font-medium text-success-fg"
                    >
                      <Check size={20} strokeWidth={2} aria-hidden="true" className="shrink-0" />
                      Aceptaste la versión {quote.currentVersion}. Tu asesor te contactará para coordinar la operación.
                    </div>
                  ) : null}
                  {quoteStatus === "rejected" ? (
                    <div
                      role="status"
                      className="flex items-center gap-3 bg-danger-bg px-[26px] py-[18px] text-[15px] font-medium text-danger-fg"
                    >
                      <X size={20} strokeWidth={2} aria-hidden="true" className="shrink-0" />
                      Rechazaste esta versión. Tu asesor la revisará y puede enviarte una nueva.
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="flex items-start gap-4 px-[26px] py-6">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-field bg-[#F3F1EB] text-gold-text"
                  >
                    <FileText size={20} strokeWidth={1.75} />
                  </span>
                  <div>
                    <Eyebrow>Cotización</Eyebrow>
                    <p className="mt-2 mb-0 max-w-[560px] text-[15px] leading-[1.6] text-ink">
                      {cancelled
                        ? "La solicitud se canceló antes de recibir una cotización."
                        : "Tu asesor está preparando la cotización. Te avisaremos por correo cuando esté lista. Mientras tanto puedes escribirle abajo."}
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section aria-label="Conversación con tu asesor" className={cn(panelClass, "flex flex-col")}>
              <div className="flex items-center gap-3 border-b border-line px-[22px] py-5">
                <Avatar name={inquiry.advisor.name} size={40} tone="navy" />
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold">{inquiry.advisor.name}</span>
                  <span className="text-[13px] text-subtle">Tu asesor en SEGlobal 360</span>
                </span>
              </div>
              <ol aria-live="polite" className="m-0 flex list-none flex-col gap-4 px-[22px] py-5">
                {entries.map((entry) =>
                  entry.kind === "message" ? (
                    <li
                      key={entry.id}
                      className={cn("flex flex-col gap-1.5", entry.author === "client" ? "items-end" : "items-start")}
                    >
                      <span className="text-xs text-subtle">{entry.meta}</span>
                      <p
                        className={cn(
                          "m-0 max-w-[72%] px-3.5 py-3 text-sm leading-normal max-[600px]:max-w-[92%]",
                          entry.author === "client"
                            ? "rounded-[14px_4px_14px_14px] bg-navy-900 text-white"
                            : "rounded-[4px_14px_14px_14px] bg-[#F3F1EB] text-navy-900",
                        )}
                      >
                        {entry.text}
                      </p>
                    </li>
                  ) : (
                    <li key={entry.id} className="flex justify-center">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-semibold",
                          entry.tone === "quote" ? "bg-selected text-warn-ink" : "bg-[#ECEAE4] text-ink",
                        )}
                      >
                        {entry.text}
                      </span>
                    </li>
                  ),
                )}
              </ol>
              {cancelled ? (
                <p className="mt-auto mb-0 border-t border-line px-[22px] pt-[18px] pb-5 text-sm text-subtle">
                  La solicitud está cerrada: ya no se pueden enviar mensajes.
                </p>
              ) : (
                <form onSubmit={sendMessage} className="mt-auto flex flex-col gap-2.5 border-t border-line px-[22px] pt-4 pb-5">
                  <label className="flex flex-col gap-1.5">
                    <span className="visually-hidden">Mensaje para tu asesor</span>
                    <textarea
                      rows={3}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Escribe a tu asesor…"
                      className={cn(textareaClass, "min-h-0! resize-y text-sm!")}
                    />
                  </label>
                  <button
                    type="submit"
                    className={portalButton("navy", 44, { padding: "px-[18px]!", className: "gap-2! self-end" })}
                  >
                    <Send size={16} strokeWidth={2} aria-hidden="true" />
                    Enviar
                  </button>
                </form>
              )}
            </section>
          </div>

          <section aria-labelledby="carga-titulo" className={cn(panelClass, "flex-[1_1_340px] px-[26px] py-6")}>
            <h2 id="carga-titulo" className={panelTitle}>
              Datos de la carga
            </h2>
            <dl className={cn(autoGrid[130], "mt-[18px] mb-0 gap-x-6 gap-y-[18px]")}>
              {cargo.map((item, index) => (
                <div key={item.label} className={index === 0 ? "col-span-full" : undefined}>
                  <dt className="text-xs text-subtle">{item.label}</dt>
                  <dd className={cn("mt-1 mb-0 text-[15px]", index === 0 ? "font-medium" : "font-semibold")}>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
    </>
  );
}
