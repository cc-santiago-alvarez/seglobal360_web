"use client";

import { useId, useState } from "react";
import { Plus, X } from "lucide-react";
import { serviceStatus, type ServiceStatus } from "@/features/service/model";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { Callout } from "@/shared/ui/Callout";
import { Panel } from "@/shared/ui/Card";
import { Field, Select, TextArea, TextInput } from "@/shared/ui/Field";
import { countryName, type CountryCode } from "@/shared/ui/Flag";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { chipClass, FilterPills } from "@/shared/ui/Toggles";
import {
  operatorCountryOptions,
  providerServices,
  selectedServiceId,
  serviceCategoryOptions,
  transportMode,
  transportModes,
  type ProviderService,
} from "./fixtures";
import { toggleIn } from "./ProfileParts";

type Filter = "all" | ServiceStatus;

const filters: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "published", label: "Publicados" },
  { id: "draft", label: "Borradores" },
  { id: "unpublished", label: "Despublicados" },
  { id: "archived", label: "Archivados" },
];

const softButton =
  "lift min-h-10 rounded-btn border-0 bg-[#F3F1EB] px-4 text-[13px] font-semibold whitespace-nowrap text-navy-900";

/** Línea de detalle de un servicio: transporte, ruta y tránsito (o el motivo si está despublicado). */
function serviceMeta(service: ProviderService): string {
  const modes = service.transportTypes.map((mode) => transportMode[mode]).join(", ") || "Sin transporte";
  const route = `${countryName[service.originCountry]} → ${countryName[service.destinationCountry]}`;
  const transit =
    service.status === "unpublished" && service.unpublishedReason
      ? `Despublicado: ${service.unpublishedReason}`
      : service.transitDaysMin !== null && service.transitDaysMax !== null
        ? `${service.transitDaysMin}–${service.transitDaysMax} días`
        : "Tránsito por definir";
  return `${modes} · ${route} · ${transit}`;
}

function emptyService(id: string): ProviderService {
  return {
    serviceId: id,
    category: serviceCategoryOptions[0],
    name: "",
    description: "",
    transportTypes: ["maritime"],
    originCountry: "CO",
    destinationCountry: "CR",
    transitDaysMin: null,
    transitDaysMax: null,
    conditions: "",
    status: "draft",
  };
}

function toDays(value: string): number | null {
  const days = Number.parseInt(value, 10);
  return Number.isNaN(days) ? null : days;
}

/** Servicios del operador logístico: filtro por estado, lista y editor lateral. */
export function ServicesManager() {
  const [services, setServices] = useState<ProviderService[]>(providerServices);
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft] = useState<ProviderService | null>(
    () => providerServices.find((service) => service.serviceId === selectedServiceId) ?? null,
  );
  const [isNew, setIsNew] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const formId = useId();
  const nameErrorId = useId();

  const matches = (service: ProviderService, id: Filter) =>
    id === "all" ? service.status !== "archived" : service.status === id;
  const filterOptions = filters.map((option) => {
    const total = services.filter((service) => matches(service, option.id)).length;
    return { id: option.id, label: option.id === "all" || total > 0 ? `${option.label} · ${total}` : option.label };
  });
  const visible = services.filter((service) => matches(service, filter));

  function open(service: ProviderService, fresh = false) {
    setDraft(service);
    setIsNew(fresh);
    setNameError(false);
    setSaved(false);
  }

  function close() {
    setDraft(null);
    setIsNew(false);
    setNameError(false);
    setSaved(false);
  }

  function startNew() {
    setNewCount(newCount + 1);
    open(emptyService(`svc-new-${newCount + 1}`), true);
  }

  function change(patch: Partial<ProviderService>) {
    if (!draft) return;
    setDraft({ ...draft, ...patch });
    setSaved(false);
  }

  function setStatus(service: ProviderService, status: ServiceStatus) {
    setServices(services.map((other) => (other.serviceId === service.serviceId ? { ...other, status } : other)));
    if (draft?.serviceId === service.serviceId) setDraft({ ...draft, status });
  }

  function save(status?: ServiceStatus) {
    if (!draft) return;
    if (draft.name.trim() === "") {
      setNameError(true);
      return;
    }
    const next = { ...draft, name: draft.name.trim(), status: status ?? draft.status };
    setServices(
      isNew ? [...services, next] : services.map((other) => (other.serviceId === next.serviceId ? next : other)),
    );
    setDraft(next);
    setIsNew(false);
    setNameError(false);
    setSaved(true);
  }

  function archive() {
    if (!draft) return;
    setStatus(draft, "archived");
    close();
  }

  const showNameError = nameError && draft !== null && draft.name.trim() === "";

  return (
    <>
      <PageHeader
        title="Servicios"
        description="Lo que ofreces en el marketplace. Sin precios: SEGlobal 360 los cotiza contigo para cada solicitud."
        actions={
          <Button variant="gold" size="md" onClick={startNew}>
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
            Nuevo servicio
          </Button>
        }
      />

      <PageBody>
        <div className="flex flex-wrap items-start gap-6">
          <section aria-label="Lista de servicios" className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <FilterPills label="Filtrar por estado" options={filterOptions} value={filter} onChange={setFilter} />

            {visible.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {visible.map((service) => {
                  const selected = draft?.serviceId === service.serviceId;
                  const status = serviceStatus[service.status];
                  return (
                    <li
                      key={service.serviceId}
                      className={cn(
                        "flex flex-wrap items-center gap-x-5 gap-y-3.5 rounded-tile border bg-white px-5 py-[18px]",
                        selected ? "border-gold-500 shadow-[0_0_0_3px_rgba(201,164,92,0.18)]" : "border-[#E9E6DE]",
                      )}
                    >
                      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1.5">
                        <span className="text-xs font-semibold tracking-[0.01em] text-gold-text">{service.category}</span>
                        <span className="font-display text-base font-semibold">{service.name}</span>
                        <span className="text-[13px] text-subtle">{serviceMeta(service)}</span>
                      </div>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Editar ${service.name}`}
                          onClick={() => open(service)}
                        >
                          Editar
                        </Button>
                        {service.status === "published" ? (
                          <button
                            type="button"
                            aria-label={`Despublicar ${service.name}`}
                            onClick={() => setStatus(service, "unpublished")}
                            className={softButton}
                          >
                            Despublicar
                          </button>
                        ) : null}
                        {service.status === "draft" || service.status === "unpublished" ? (
                          <Button
                            variant="navy"
                            size="sm"
                            aria-label={`Publicar ${service.name}`}
                            onClick={() => setStatus(service, "published")}
                          >
                            Publicar
                          </Button>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="rounded-tile border border-dashed border-line-strong bg-white px-5 py-6 text-sm text-subtle">
                No hay servicios en este estado.
              </p>
            )}

            <Callout kind="info">
              Un servicio publicado se ve en el marketplace cuando tu perfil está publicado y Operaciones lo habilita en
              un corredor activo.
            </Callout>
          </section>

          {draft ? (
            <Panel
              aria-label={isNew ? "Nuevo servicio" : "Editar servicio"}
              className="flex-[1_1_400px] shadow-[0_16px_40px_rgba(11,27,51,0.08)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-[22px]">
                <div className="min-w-0">
                  <p className="text-xs text-subtle">
                    {isNew ? "Nuevo servicio" : "Editar servicio"} · {serviceStatus[draft.status].label}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold tracking-[-0.02em]">
                    {draft.name.trim() || "Servicio sin nombre"}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={close}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F3F1EB] text-navy-900"
                >
                  <X size={18} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>

              <form
                id={formId}
                onSubmit={(event) => {
                  event.preventDefault();
                  save();
                }}
                className="flex flex-col gap-[18px] px-6 py-[22px]"
              >
                <Field label="Categoría">
                  <Select value={draft.category} onChange={(event) => change({ category: event.target.value })}>
                    {serviceCategoryOptions.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </Select>
                </Field>
                <div className="flex flex-col gap-2">
                  <Field label="Nombre">
                    <TextInput
                      type="text"
                      required
                      value={draft.name}
                      aria-invalid={showNameError || undefined}
                      aria-describedby={showNameError ? nameErrorId : undefined}
                      onChange={(event) => change({ name: event.target.value })}
                    />
                  </Field>
                  {showNameError ? (
                    <span id={nameErrorId} role="alert" className="text-[13px] font-medium text-danger-fg">
                      Escribe el nombre del servicio.
                    </span>
                  ) : null}
                </div>
                <Field label="Descripción">
                  <TextArea
                    rows={3}
                    value={draft.description}
                    onChange={(event) => change({ description: event.target.value })}
                    className="min-h-0! resize-y text-sm!"
                  />
                </Field>
                <TransportPicker
                  value={draft.transportTypes}
                  onToggle={(mode) => change({ transportTypes: toggleIn(draft.transportTypes, mode) })}
                />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-3.5">
                  <CountrySelect
                    label="Origen"
                    value={draft.originCountry}
                    onChange={(code) => change({ originCountry: code })}
                  />
                  <CountrySelect
                    label="Destino"
                    value={draft.destinationCountry}
                    onChange={(code) => change({ destinationCountry: code })}
                  />
                </div>
                <fieldset className="min-w-0">
                  <legend className="pb-2 text-[13px] font-semibold">Tránsito estimado</legend>
                  <div className="flex items-center gap-2.5">
                    <DaysInput
                      label="Mínimo"
                      value={draft.transitDaysMin}
                      onChange={(days) => change({ transitDaysMin: days })}
                    />
                    <span className="text-subtle">a</span>
                    <DaysInput
                      label="Máximo"
                      value={draft.transitDaysMax}
                      onChange={(days) => change({ transitDaysMax: days })}
                    />
                  </div>
                </fieldset>
                <Field label="Condiciones">
                  <TextArea
                    rows={3}
                    value={draft.conditions}
                    placeholder="Qué incluye y qué no, restricciones de carga…"
                    onChange={(event) => change({ conditions: event.target.value })}
                    className="min-h-0! resize-y text-sm!"
                  />
                </Field>
              </form>

              <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-line px-6 pt-4 pb-[22px]">
                {!isNew && draft.status !== "archived" ? (
                  <button
                    type="button"
                    onClick={archive}
                    className="min-h-11 px-2 text-[13px] font-semibold text-danger-fg"
                  >
                    Archivar
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {saved ? (
                    <span role="status" className="text-sm font-medium text-success-fg">
                      Cambios guardados.
                    </span>
                  ) : null}
                  <Button type="submit" form={formId} variant="outline" size="md">
                    Guardar
                  </Button>
                  <Button variant="navy" size="md" onClick={() => save("published")}>
                    Guardar y publicar
                  </Button>
                </div>
              </div>
            </Panel>
          ) : null}
        </div>
      </PageBody>
    </>
  );
}

function TransportPicker({
  value,
  onToggle,
}: {
  value: ReadonlyArray<ProviderService["transportTypes"][number]>;
  onToggle: (mode: ProviderService["transportTypes"][number]) => void;
}) {
  const labelId = useId();
  return (
    <div>
      <p id={labelId} className="mb-2 text-[13px] font-semibold">
        Tipos de transporte
      </p>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-1.5">
        {transportModes.map((mode) => {
          const on = value.includes(mode);
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(mode)}
              className={chipClass(on)}
            >
              {transportMode[mode]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CountrySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CountryCode;
  onChange: (code: CountryCode) => void;
}) {
  return (
    <Field label={label}>
      <Select
        value={value}
        onChange={(event) => {
          const code = operatorCountryOptions.find((option) => option === event.target.value);
          if (code) onChange(code);
        }}
      >
        {operatorCountryOptions.map((code) => (
          <option key={code} value={code}>
            {countryName[code]}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function DaysInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (days: number | null) => void;
}) {
  return (
    <label className="relative flex flex-1 items-center overflow-hidden rounded-field border border-line-strong bg-white has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-gold-500">
      <span className="visually-hidden">{label}</span>
      <input
        type="number"
        min={0}
        value={value ?? ""}
        onChange={(event) => onChange(toDays(event.target.value))}
        className="min-h-11 min-w-0 flex-auto px-3 text-[15px] font-medium text-navy-900 outline-none"
      />
      <span className="px-3 text-[13px] text-subtle">días</span>
    </label>
  );
}
