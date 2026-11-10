"use client";

import { useRef, useState, type FormEvent } from "react";
import { inquiryStatus } from "@/features/inquiry/model";
import { cn, initials } from "@/shared/lib/cn";
import { buttonClass } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Card";
import {
  advisorChannels,
  currentAdvisor,
  demoClock,
  interactionChannel,
  type Interaction,
  type InteractionChannel,
  type InteractionVisibility,
} from "./fixtures";
import { compactControl, panelTitle, smallAvatar } from "./ui";

const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Escribe un valor de `datetime-local` como «10 nov, 09:30»; vacío, «ahora». */
function formatOccurredAt(value: string): string {
  const match = /^\d{4}-(\d{2})-(\d{2})T(\d{2}:\d{2})/.exec(value);
  if (!match) return "ahora";
  const month = months[Number(match[1]) - 1] ?? "";
  return `${Number(match[2])} ${month}, ${match[3] ?? ""}`;
}

const visibilityOptions: ReadonlyArray<{ id: InteractionVisibility; label: string }> = [
  { id: "shared", label: "Compartida con el cliente" },
  { id: "internal", label: "Nota interna" },
];

type Props = {
  log: Interaction[];
  firstContactLabel: string;
  /** La solicitud está cerrada: no se registran interacciones. */
  closed: boolean;
  onRegister: (entry: Omit<Interaction, "id">) => void;
};

/** Registro de interacciones con el cliente y su historial, de la más reciente a la más antigua. */
export function InteractionsPanel({ log, firstContactLabel, closed, onRegister }: Props) {
  const [visibility, setVisibility] = useState<InteractionVisibility>("shared");
  const [channel, setChannel] = useState<InteractionChannel>("phone");
  const [occurredAt, setOccurredAt] = useState<string>(demoClock.occurredAtDefault);
  const [summary, setSummary] = useState("");
  const [summaryError, setSummaryError] = useState(false);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  const shared = visibility === "shared";
  const showSummaryError = summaryError && summary.trim() === "";

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = summary.trim();
    if (text === "") {
      setSummaryError(true);
      summaryRef.current?.focus();
      return;
    }
    onRegister({
      authorType: "advisor",
      authorName: currentAdvisor.name,
      channel,
      visibility: channel === "note" ? "internal" : visibility,
      summary: text,
      occurredAtLabel: formatOccurredAt(occurredAt),
    });
    setSummary("");
    setSummaryError(false);
  }

  return (
    <Panel aria-label="Interacciones" className="flex flex-[1_1_360px] flex-col">
      <div className="border-b border-line px-[22px] py-[18px]">
        <h2 className={panelTitle}>Interacciones</h2>
        <p className="mt-1 mb-0 text-[13px] text-subtle">Primer contacto: {firstContactLabel}</p>
      </div>

      <form onSubmit={register} noValidate className="border-b border-line bg-[#FBFAF7] px-[22px] py-4">
        <fieldset disabled={closed} className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
          <div role="group" aria-label="Visibilidad" className="inline-flex self-start rounded-full bg-surface-muted p-[3px]">
            {visibilityOptions.map((option) => {
              const active = option.id === visibility;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setVisibility(option.id)}
                  className={cn(
                    "min-h-9 rounded-xl border-0 px-3.5 text-[13px] font-semibold text-navy-900 disabled:text-subtle",
                    active ? "bg-white" : "bg-transparent",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="flex flex-[1_1_140px] flex-col gap-1">
              <span className="text-xs font-semibold">Canal</span>
              <select
                value={channel}
                onChange={(event) => {
                  const next = advisorChannels.find((item) => item === event.target.value);
                  if (next) setChannel(next);
                }}
                className={cn(compactControl, "border-line-strong px-2")}
              >
                {advisorChannels.map((item) => (
                  <option key={item} value={item}>
                    {interactionChannel[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-[1_1_140px] flex-col gap-1">
              <span className="text-xs font-semibold">Cuándo</span>
              <input
                type="datetime-local"
                value={occurredAt}
                max={demoClock.occurredAtMax}
                onChange={(event) => setOccurredAt(event.target.value)}
                className={cn(compactControl, "border-line-strong px-2")}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold">Resumen</span>
            <textarea
              ref={summaryRef}
              rows={3}
              maxLength={2000}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              aria-invalid={showSummaryError}
              aria-describedby={showSummaryError ? "interaction-summary-error" : undefined}
              placeholder={
                shared ? "El cliente verá este mensaje y recibirá un aviso por correo." : "Solo la ve el equipo de SEGlobal 360."
              }
              className={cn(
                "resize-y rounded-field border bg-white px-3 py-2.5 font-sans text-sm leading-normal font-medium text-navy-900 placeholder:text-faint disabled:bg-ivory",
                showSummaryError ? "border-danger-fg" : "border-line-strong",
              )}
            />
          </label>
          {showSummaryError ? (
            <span id="interaction-summary-error" role="alert" className="text-[13px] font-medium text-danger-fg">
              Escribe un resumen de 1 a 2000 caracteres.
            </span>
          ) : null}
          <p className="m-0 text-xs text-subtle">
            {closed
              ? "La solicitud está cerrada: no se pueden registrar interacciones."
              : `La primera interacción que no sea una nota interna pasa la solicitud a ${inquiryStatus.in_contact.label}.`}
          </p>
          <button type="submit" className={buttonClass("navy", "sm", "min-h-[42px]! self-end px-[18px]!")}>
            Registrar
          </button>
        </fieldset>
      </form>

      <ol className="flex flex-col gap-4 px-[22px] py-[18px]">
        {log.map((entry) => {
          const client = entry.authorType === "client";
          const internal = entry.visibility === "internal";
          const name = client ? entry.authorName : (entry.authorName.split(" ")[0] ?? entry.authorName);
          return (
            <li key={entry.id} className="flex gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  smallAvatar,
                  client ? "bg-gold-500 text-navy-950" : internal ? "bg-surface-muted text-ink" : "bg-navy-900 text-gold-300",
                )}
              >
                {initials(entry.authorName)}
              </span>
              <div className="min-w-0 flex-auto">
                <p className="m-0 flex flex-wrap items-center gap-1.5 text-xs text-subtle">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-semibold",
                      client ? "bg-sand text-warn-ink" : internal ? "bg-ink text-white" : "bg-info-bg text-info-fg",
                    )}
                  >
                    {client ? "Cliente" : internal ? "Interna" : "Compartida con el cliente"}
                  </span>
                  {client
                    ? `${name} · ${entry.occurredAtLabel}`
                    : `${name} · ${interactionChannel[entry.channel]} · ${entry.occurredAtLabel}`}
                </p>
                <p className="mt-1.5 mb-0 text-sm leading-normal">{entry.summary}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
