"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { corridorStatus, type CorridorStatus } from "@/features/corridor/model";
import { routes } from "@/shared/lib/routes";
import { Panel } from "@/shared/ui/Card";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, Th } from "@/shared/ui/Table";
import { FilterPills } from "@/shared/ui/Toggles";
import { cn } from "@/shared/lib/cn";
import { corridorCodePattern, parseValidityDays } from "./corridor";
import { countries, transportTypes, type NetworkCorridor, type NetworkCountryCode } from "./fixtures";
import {
  CodeChip,
  FieldError,
  Notice,
  Td,
  actionClass,
  controlClass,
  labelTextClass,
  panelPadded,
  panelTitle,
  rowActionClass,
} from "./ui";

type CorridorFilter = CorridorStatus | "all";

const filters: ReadonlyArray<{ id: CorridorFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "draft", label: "Borradores" },
  { id: "inactive", label: "Inactivos" },
];

const originOptions: readonly NetworkCountryCode[] = ["CO", "CR", "PA"];
const destinationOptions: readonly NetworkCountryCode[] = ["PA", "CR", "CO"];

type Draft = { code: string; name: string; from: NetworkCountryCode; to: NetworkCountryCode; days: string };

const emptyDraft: Draft = { code: "", name: "", from: "CO", to: "PA", days: "15" };

function pickCountry(options: readonly NetworkCountryCode[], value: string): NetworkCountryCode {
  return options.find((option) => option === value) ?? "CO";
}

/** Corredores del backoffice: listado por estado y alta de un corredor en borrador. */
export function CorridorsScreen({ corridors }: { corridors: NetworkCorridor[] }) {
  const id = useId();
  const codeRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<CorridorFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [tried, setTried] = useState(false);
  const [added, setAdded] = useState<NetworkCorridor[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (formOpen) codeRef.current?.focus();
  }, [formOpen]);

  const list = [...added, ...corridors];
  const rows = list.filter((corridor) => filter === "all" || corridor.status === filter);
  const filterOptions = filters.map((option) => ({
    id: option.id,
    label: `${option.label} · ${option.id === "all" ? list.length : list.filter((corridor) => corridor.status === option.id).length}`,
  }));

  const codeValid = corridorCodePattern.test(draft.code);
  const codeTaken = list.some((corridor) => corridor.code === draft.code);
  const sameCountry = draft.from === draft.to;
  const days = parseValidityDays(draft.days);
  const codeError = !tried ? null : !codeValid ? "Usa dos letras, un guion y dos letras: CO-PA." : codeTaken ? `Ya existe un corredor con el código ${draft.code}.` : null;
  const countryError = tried && sameCountry ? "El origen y el destino deben ser distintos." : null;
  const daysError = tried && days === null ? "Usa entre 1 y 90 días." : null;

  function patch(change: Partial<Draft>) {
    setDraft({ ...draft, ...change });
  }

  function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!codeValid || codeTaken || sameCountry || days === null) {
      setTried(true);
      return;
    }
    const corridor: NetworkCorridor = {
      id: `new-${draft.code}`,
      code: draft.code,
      name: draft.name.trim() || `${countries[draft.from]} → ${countries[draft.to]}`,
      originCountryCode: draft.from,
      destinationCountryCode: draft.to,
      currencyCodes: ["USD"],
      transportTypeCodes: [],
      quoteValidityDays: days,
      status: "draft",
    };
    setAdded([corridor, ...added]);
    setFormOpen(false);
    setTried(false);
    setDraft(emptyDraft);
    setNotice(`Corredor ${corridor.code} creado en borrador. Crea una regla de comisión vigente antes de activarlo.`);
  }

  return (
    <>
      <PageHeader
        title="Corredores"
        description="Rutas en las que opera SEGlobal 360, con sus monedas, transportes y vigencia de cotización."
        actions={
          formOpen ? null : (
            <button
              type="button"
              onClick={() => {
                setFormOpen(true);
                setNotice("");
              }}
              className={actionClass("navy")}
            >
              Nuevo corredor
            </button>
          )
        }
      />
      <PageBody>
        {formOpen ? (
          <form
            aria-labelledby={`${id}-title`}
            noValidate
            onSubmit={create}
            className={cn(panelPadded, "flex flex-col gap-4")}
          >
            <h2 id={`${id}-title`} className={panelTitle}>
              Nuevo corredor
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-5 gap-y-4">
              <label className="flex flex-col gap-1.5">
                <span className={labelTextClass}>Código</span>
                <input
                  ref={codeRef}
                  type="text"
                  maxLength={5}
                  value={draft.code}
                  onChange={(event) => patch({ code: event.target.value.toUpperCase() })}
                  placeholder="CO-PA"
                  autoComplete="off"
                  aria-invalid={codeError !== null}
                  aria-describedby={codeError ? `${id}-code-error` : undefined}
                  className={cn(controlClass, "font-semibold tracking-[0.06em]")}
                />
                {codeError ? <FieldError id={`${id}-code-error`}>{codeError}</FieldError> : null}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelTextClass}>Nombre</span>
                <input
                  type="text"
                  maxLength={120}
                  value={draft.name}
                  onChange={(event) => patch({ name: event.target.value })}
                  placeholder="Colombia → Panamá"
                  className={controlClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelTextClass}>País de origen</span>
                <select
                  value={draft.from}
                  onChange={(event) => patch({ from: pickCountry(originOptions, event.target.value) })}
                  className={controlClass}
                >
                  {originOptions.map((code) => (
                    <option key={code} value={code}>
                      {countries[code]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelTextClass}>País de destino</span>
                <select
                  value={draft.to}
                  onChange={(event) => patch({ to: pickCountry(destinationOptions, event.target.value) })}
                  aria-invalid={countryError !== null}
                  aria-describedby={countryError ? `${id}-country-error` : undefined}
                  className={controlClass}
                >
                  {destinationOptions.map((code) => (
                    <option key={code} value={code}>
                      {countries[code]}
                    </option>
                  ))}
                </select>
                {countryError ? <FieldError id={`${id}-country-error`}>{countryError}</FieldError> : null}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelTextClass}>Vigencia de la cotización (días)</span>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={draft.days}
                  onChange={(event) => patch({ days: event.target.value })}
                  aria-invalid={daysError !== null}
                  aria-describedby={daysError ? `${id}-days-error` : undefined}
                  className={controlClass}
                />
                {daysError ? <FieldError id={`${id}-days-error`}>{daysError}</FieldError> : null}
              </label>
            </div>
            <p className="m-0 text-[13px] text-subtle">
              El origen y el destino no se pueden cambiar después. El corredor se crea en borrador: para activarlo
              necesita una regla de comisión vigente.
            </p>
            <div className="flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setTried(false);
                }}
                className={actionClass("outline")}
              >
                Cancelar
              </button>
              <button type="submit" className={actionClass("navy")}>
                Crear corredor
              </button>
            </div>
          </form>
        ) : null}
        {notice ? <Notice tone="ok">{notice}</Notice> : null}

        <FilterPills label="Filtrar por estado" options={filterOptions} value={filter} onChange={setFilter} />
        <Panel aria-label="Lista de corredores" className="overflow-hidden">
          <Table minWidth={960}>
            <thead>
              <tr>
                <Th>Corredor</Th>
                <Th>Ruta</Th>
                <Th>Monedas</Th>
                <Th>Transportes</Th>
                <Th>Vigencia</Th>
                <Th>Estado</Th>
                <Th>
                  <span className="visually-hidden">Acciones</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((corridor) => {
                const status = corridorStatus[corridor.status];
                return (
                  <tr key={corridor.id}>
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <CodeChip code={corridor.code} />
                        <span className="font-semibold">{corridor.name}</span>
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">
                      {countries[corridor.originCountryCode]} → {countries[corridor.destinationCountryCode]}
                    </Td>
                    <Td>{corridor.currencyCodes.join(", ")}</Td>
                    <Td className="text-ink">
                      {corridor.transportTypeCodes.length > 0
                        ? corridor.transportTypeCodes.map((code) => transportTypes[code].shortName).join(", ")
                        : "Por configurar"}
                    </Td>
                    <Td className="whitespace-nowrap">{corridor.quoteValidityDays} días</Td>
                    <Td>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </Td>
                    <Td className="text-right">
                      <Link href={routes.backoffice.corridor(corridor.code)} className={rowActionClass(false)}>
                        {corridor.status === "draft" ? "Configurar" : "Ver detalle"}
                        <span className="visually-hidden"> {corridor.code}</span>
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {rows.length === 0 ? (
            <p className="m-0 px-6 py-10 text-center text-[15px] text-subtle">No hay corredores con este estado.</p>
          ) : null}
        </Panel>
      </PageBody>
    </>
  );
}
