"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { corridorStatus } from "@/features/corridor/model";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { StatusPill } from "@/shared/ui/StatusPill";
import { chipClass } from "@/shared/ui/Toggles";
import { effectiveRule } from "./commission";
import { CommissionPanel } from "./CommissionPanel";
import { CommissionPreview } from "./CommissionPreview";
import { parseValidityDays } from "./corridor";
import { CorridorServicesPanel } from "./CorridorServicesPanel";
import {
  demoNow,
  transportTypeCodes,
  transportTypes,
  type CorridorDetail,
  type NetworkCorridor,
  type TransportTypeCode,
} from "./fixtures";
import { formatDate } from "./format";
import { currencyCodes, formatBps } from "./money";
import { StatusDialog } from "./StatusDialog";
import {
  CodeChip,
  FieldError,
  Notice,
  TagList,
  actionClass,
  controlClass,
  labelTextClass,
  panelPadded,
  panelTitle,
  type NoticeTone,
} from "./ui";

/** Corredor del backoffice: configuración, comisión versionada, prueba del cálculo y servicios. */
export function CorridorScreen({ corridor: initial, rules: initialRules, services, candidates }: CorridorDetail) {
  const [corridor, setCorridor] = useState(initial);
  const [rules, setRules] = useState(initialRules);
  const [dialog, setDialog] = useState<"activate" | "deactivate" | null>(null);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<{ text: string; tone: NoticeTone } | null>(null);

  const current = effectiveRule(rules, demoNow);
  const status = corridorStatus[corridor.status];
  const active = corridor.status === "active";
  const previewCurrency = corridor.currencyCodes.includes("USD") ? "USD" : (corridor.currencyCodes[0] ?? "USD");

  function requestStatusChange() {
    setNotice(null);
    if (!active && !current) {
      setNotice({
        text: "Para activar el corredor necesita una regla de comisión vigente. Crea una versión que rija desde hoy.",
        tone: "warn",
      });
      return;
    }
    setDialog(active ? "deactivate" : "activate");
  }

  function applyStatusChange() {
    const nextActive = dialog === "activate";
    setCorridor({ ...corridor, status: nextActive ? "active" : "inactive" });
    setDialog(null);
    setNotice(
      nextActive
        ? { text: "Corredor activado. Ya admite solicitudes y cotizaciones nuevas.", tone: "ok" }
        : { text: "Corredor desactivado. Ya no admite solicitudes ni cotizaciones nuevas.", tone: "warn" },
    );
  }

  return (
    <>
      <header className="flex flex-col gap-2.5 px-10 pt-7 max-[600px]:px-4">
        <nav aria-label="Ruta de navegación" className="flex gap-2 text-[13px] text-subtle">
          <Link href={routes.backoffice.corridors} className="link-quiet text-subtle">
            Corredores
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-medium text-navy-900">
            {corridor.code}
          </span>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">{corridor.name}</h1>
            <CodeChip code={corridor.code} large />
            <StatusPill tone={status.tone} size="md">
              {status.label}
            </StatusPill>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={requestStatusChange}
              className={actionClass(active ? "danger" : "outline", true)}
            >
              {active ? "Desactivar" : "Activar"}
            </button>
            {editing ? null : (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setNotice(null);
                }}
                className={actionClass("navy")}
              >
                Editar corredor
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-10 pt-6 pb-14 max-[600px]:px-4">
        {dialog ? (
          <StatusDialog
            key={dialog}
            title={`${dialog === "activate" ? "Activar" : "Desactivar"} ${corridor.name}`}
            help={
              dialog === "activate" && current
                ? `Se cotizará con la comisión vigente (v${current.version}, ${formatBps(current.rateBps)}) y admitirá solicitudes nuevas.`
                : "Desaparece del marketplace y no admite solicitudes ni cotizaciones nuevas. Las existentes no se tocan."
            }
            confirmLabel={dialog === "activate" ? "Sí, activar" : "Desactivar"}
            danger={dialog === "deactivate"}
            onCancel={() => setDialog(null)}
            onConfirm={applyStatusChange}
          />
        ) : null}
        {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
        {editing ? (
          <CorridorForm
            corridor={corridor}
            onCancel={() => setEditing(false)}
            onSave={(next) => {
              setCorridor(next);
              setEditing(false);
              setNotice({ text: "Cambios guardados.", tone: "ok" });
            }}
          />
        ) : null}

        <section
          aria-label="Configuración"
          className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-px overflow-hidden rounded-tile border border-[#E9E6DE] bg-[#E9E6DE]"
        >
          <div className="bg-white px-5 py-[18px]">
            <p className="m-0 text-xs text-subtle">Monedas</p>
            <div className="mt-2">
              <TagList tags={corridor.currencyCodes} strong />
            </div>
          </div>
          <div className="bg-white px-5 py-[18px]">
            <p className="m-0 text-xs text-subtle">Tipos de transporte</p>
            <div className="mt-2">
              {corridor.transportTypeCodes.length > 0 ? (
                <TagList tags={corridor.transportTypeCodes.map((code) => transportTypes[code].name)} strong />
              ) : (
                <p className="m-0 text-sm font-semibold text-subtle">Por configurar</p>
              )}
            </div>
          </div>
          <div className="bg-white px-5 py-[18px]">
            <p className="m-0 text-xs text-subtle">Vigencia de las cotizaciones</p>
            <p className="mt-1.5 mb-0 font-display text-[22px] font-semibold">{corridor.quoteValidityDays} días</p>
          </div>
        </section>

        <div className="flex flex-wrap items-start gap-6">
          <CommissionPanel
            corridor={corridor}
            rules={rules}
            current={current}
            onCreate={(rule) => {
              setRules([...rules, rule]);
              setNotice({
                text: `Versión v${rule.version} creada: ${formatBps(rule.rateBps)} desde el ${formatDate(rule.effectiveFrom)}.`,
                tone: "ok",
              });
            }}
          />
          <CommissionPreview rule={current} currency={previewCurrency} />
        </div>

        <CorridorServicesPanel services={services} candidates={candidates} />
      </main>
    </>
  );
}

type FormProps = { corridor: NetworkCorridor; onCancel: () => void; onSave: (corridor: NetworkCorridor) => void };

function CorridorForm({ corridor, onCancel, onSave }: FormProps) {
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(corridor.name);
  const [days, setDays] = useState(String(corridor.quoteValidityDays));
  const [currencies, setCurrencies] = useState(corridor.currencyCodes);
  const [transports, setTransports] = useState<TransportTypeCode[]>(corridor.transportTypeCodes);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const validityDays = parseValidityDays(days);
  const nameError = tried && name.trim() === "";
  const daysError = tried && validityDays === null;
  const currencyError = tried && currencies.length === 0;
  const transportError = tried && transports.length === 0;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim() === "" || validityDays === null || currencies.length === 0 || transports.length === 0) {
      setTried(true);
      return;
    }
    onSave({
      ...corridor,
      name: name.trim(),
      quoteValidityDays: validityDays,
      currencyCodes: currencyCodes.filter((code) => currencies.includes(code)),
      transportTypeCodes: transportTypeCodes.filter((code) => transports.includes(code)),
    });
  }

  return (
    <form aria-labelledby={`${id}-title`} noValidate onSubmit={submit} className={cn(panelPadded, "flex flex-col gap-4")}>
      <h2 id={`${id}-title`} className={panelTitle}>
        Editar corredor
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-5 gap-y-4">
        <label className="flex flex-col gap-1.5">
          <span className={labelTextClass}>Nombre</span>
          <input
            ref={nameRef}
            type="text"
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={nameError}
            aria-describedby={nameError ? `${id}-name-error` : undefined}
            className={controlClass}
          />
          {nameError ? <FieldError id={`${id}-name-error`}>Escribe el nombre del corredor.</FieldError> : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelTextClass}>Vigencia de la cotización (días)</span>
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(event) => setDays(event.target.value)}
            aria-invalid={daysError}
            aria-describedby={daysError ? `${id}-days-error` : undefined}
            className={controlClass}
          />
          {daysError ? <FieldError id={`${id}-days-error`}>Usa entre 1 y 90 días.</FieldError> : null}
        </label>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className={cn(labelTextClass, "mb-2")}>Monedas</legend>
        <div className="flex flex-wrap gap-2">
          {currencyCodes.map((code) => {
            const on = currencies.includes(code);
            return (
              <button
                key={code}
                type="button"
                aria-pressed={on}
                onClick={() => setCurrencies(on ? currencies.filter((item) => item !== code) : [...currencies, code])}
                className={chipClass(on)}
              >
                {code}
              </button>
            );
          })}
        </div>
        {currencyError ? <FieldError id={`${id}-currency-error`}>Elige al menos una moneda.</FieldError> : null}
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <legend className={cn(labelTextClass, "mb-2")}>Tipos de transporte</legend>
        <div className="flex flex-wrap gap-2">
          {transportTypeCodes.map((code) => {
            const on = transports.includes(code);
            return (
              <button
                key={code}
                type="button"
                aria-pressed={on}
                onClick={() => setTransports(on ? transports.filter((item) => item !== code) : [...transports, code])}
                className={chipClass(on)}
              >
                {transportTypes[code].name}
              </button>
            );
          })}
        </div>
        {transportError ? (
          <FieldError id={`${id}-transport-error`}>Elige al menos un tipo de transporte.</FieldError>
        ) : null}
      </fieldset>
      <p className="m-0 text-[13px] text-subtle">
        El código, el origen y el destino no se pueden cambiar. La vigencia nueva aplica a las cotizaciones que se
        envíen desde ahora.
      </p>
      <div className="flex flex-wrap justify-end gap-2.5">
        <button type="button" onClick={onCancel} className={actionClass("outline")}>
          Cancelar
        </button>
        <button type="submit" className={actionClass("navy")}>
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
