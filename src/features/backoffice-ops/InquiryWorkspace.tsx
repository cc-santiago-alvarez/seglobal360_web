"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { clientStage } from "@/features/client/model";
import { inquiryStatus, type InquiryStatus } from "@/features/inquiry/model";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { buttonClass } from "@/shared/ui/Button";
import { StatusPill } from "@/shared/ui/StatusPill";
import {
  currentAdvisor,
  demoClock,
  inquirySource,
  type InquiryDetail,
  type Interaction,
  type QuoteDraft,
  type ServiceOption,
} from "./fixtures";
import { InteractionsPanel } from "./InteractionsPanel";
import { QuoteBuilder } from "./QuoteBuilder";

type FocusTarget = "reason" | "trigger" | "closed";

const reasonMax = 500;

type Props = {
  inquiry: InquiryDetail;
  quote: QuoteDraft;
  services: ServiceOption[];
  interactions: Interaction[];
  /** Panel de la carga, que no cambia con la interacción. */
  cargo: ReactNode;
};

/** Solicitud del lado del asesor: encabezado, cierre como perdida, cotizador e interacciones. */
export function InquiryWorkspace({ inquiry, quote, services, interactions, cargo }: Props) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [log, setLog] = useState<Interaction[]>(interactions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [lostReason, setLostReason] = useState("");

  const focusNext = useRef<FocusTarget | null>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = focusNext.current;
    if (!target) return;
    focusNext.current = null;
    const refs = { reason: reasonRef, trigger: triggerRef, closed: closedRef };
    refs[target].current?.focus();
  });

  const lost = status === "lost";
  const canClose = status === "in_contact" || status === "quoted";
  const showReasonError = reasonError && reason.trim() === "";
  const pill = inquiryStatus[status];

  const facts = [
    { label: "Empresa", value: `${inquiry.companyName} · ${clientStage[inquiry.clientStage].label.toLowerCase()}` },
    { label: "Pidió", value: inquiry.requestedByName },
    { label: "Corredor", value: `${inquiry.corridorLabel} · ${inquiry.transportLabel}` },
    { label: "Origen", value: `${inquirySource[inquiry.source]} · ${inquiry.originServiceLabel}` },
  ];

  function addInteraction(entry: Omit<Interaction, "id">) {
    setLog((current) => [{ ...entry, id: `int-${current.length + 1}` }, ...current]);
  }

  function handleSent(version: number) {
    setStatus("quoted");
    addInteraction({
      authorType: "advisor",
      authorName: currentAdvisor.name,
      channel: "quote_sent",
      visibility: "shared",
      summary: `Te envié la cotización ${quote.code}, versión ${version}. Puedes revisarla y responder desde tu portal.`,
      occurredAtLabel: demoClock.sentStamp,
    });
  }

  function openDialog() {
    setDialogOpen(true);
    setReason("");
    setReasonError(false);
    focusNext.current = "reason";
  }

  function closeDialog() {
    setDialogOpen(false);
    setReason("");
    setReasonError(false);
    focusNext.current = "trigger";
  }

  function confirmDialog() {
    const text = reason.trim();
    if (text === "") {
      setReasonError(true);
      reasonRef.current?.focus();
      return;
    }
    setStatus("lost");
    setLostReason(text);
    setDialogOpen(false);
    setReason("");
    setReasonError(false);
    focusNext.current = "closed";
  }

  return (
    <>
      <header className="flex flex-col gap-2.5 px-10 pt-7 max-[600px]:px-4">
        <nav aria-label="Ruta de navegación" className="flex gap-2 text-[13px] text-subtle">
          <Link href={routes.backoffice.inbox} className="link-quiet text-subtle">
            Solicitudes
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-medium text-navy-900">
            {inquiry.code}
          </span>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">{inquiry.code}</h1>
            <StatusPill tone={pill.tone} size="md">
              {pill.label}
            </StatusPill>
          </div>
          <div className="flex flex-wrap gap-2">
            {canClose ? (
              <button
                ref={triggerRef}
                type="button"
                onClick={openDialog}
                aria-expanded={dialogOpen}
                className={buttonClass("danger", "sm", "min-h-11! text-sm!")}
              >
                Cerrar como perdida
              </button>
            ) : null}
          </div>
        </div>
        <dl className="mt-1.5 mb-0 flex flex-wrap gap-x-7 gap-y-2 text-sm">
          {facts.map((fact) => (
            <div key={fact.label} className="flex gap-1.5">
              <dt className="text-subtle">{fact.label}</dt>
              <dd className="m-0 font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <main className="flex flex-wrap items-start gap-6 px-10 pt-6 pb-14 max-[600px]:px-4">
        {dialogOpen || lost ? (
          <div className="flex flex-[1_1_100%] flex-col gap-3.5">
            {dialogOpen ? (
              <section
                role="alertdialog"
                aria-labelledby="lost-dialog-title"
                aria-describedby="lost-dialog-help"
                className="flex flex-col gap-3.5 rounded-panel border border-[#E8B4AE] bg-white px-6 py-[22px] shadow-[0_12px_32px_rgba(11,27,51,0.08)]"
              >
                <div>
                  <h2 id="lost-dialog-title" className="m-0 font-display text-lg font-bold tracking-[-0.02em]">
                    Cerrar {inquiry.code} como perdida
                  </h2>
                  <p id="lost-dialog-help" className="mt-1.5 mb-0 text-sm leading-[1.55] text-subtle">
                    La solicitud se cierra y ya no se podrá cotizar ni registrar interacciones.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-3">
                    <label htmlFor="lost-reason" className="text-sm font-semibold">
                      ¿Por qué se pierde? <span className="font-normal text-subtle">(obligatorio)</span>
                    </label>
                    <span className="text-xs text-subtle">
                      {reason.length} / {reasonMax}
                    </span>
                  </div>
                  <textarea
                    ref={reasonRef}
                    id="lost-reason"
                    rows={3}
                    maxLength={reasonMax}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    aria-invalid={showReasonError}
                    aria-describedby={showReasonError ? "lost-reason-error" : undefined}
                    className={cn(
                      "resize-y rounded-field border bg-white px-3.5 py-3 font-sans text-[15px] leading-normal font-medium text-navy-900",
                      showReasonError ? "border-danger-fg" : "border-line-strong",
                    )}
                  />
                  {showReasonError ? (
                    <span id="lost-reason-error" role="alert" className="text-[13px] font-medium text-danger-fg">
                      Escribe el motivo para continuar.
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className={buttonClass("outline", "sm", "min-h-11! px-[18px]! text-sm!")}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={confirmDialog}
                    className="lift inline-flex min-h-11 items-center justify-center rounded-btn border-0 bg-danger-fg px-5 text-sm font-semibold whitespace-nowrap text-white"
                  >
                    Cerrar como perdida
                  </button>
                </div>
              </section>
            ) : null}
            {lost ? (
              <div
                ref={closedRef}
                role="status"
                tabIndex={-1}
                className="rounded-tile border border-[#DCD8CE] bg-[#ECEAE4] px-5 py-4 text-[15px] leading-normal text-ink"
              >
                <strong className="font-semibold">Solicitud cerrada como perdida.</strong> Motivo: {lostReason}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
          <QuoteBuilder quote={quote} services={services} inquiryClosed={lost} onSent={handleSent} />
          {cargo}
        </div>

        <InteractionsPanel
          log={log}
          firstContactLabel={inquiry.firstContactLabel}
          closed={lost}
          onRegister={addInteraction}
        />
      </main>
    </>
  );
}
