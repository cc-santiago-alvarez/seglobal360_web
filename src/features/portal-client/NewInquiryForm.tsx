"use client";

import { ArrowRight, Layers, MapPin, Plane, Send, Ship, Truck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { demo, routes } from "@/shared/lib/routes";
import { Avatar } from "@/shared/ui/Avatar";
import { Field, Select, TextArea, TextInput } from "@/shared/ui/Field";
import { countryName } from "@/shared/ui/Flag";
import {
  corridorLabel,
  corridors,
  currencies,
  incoterms,
  inquiryDraft,
  transportName,
  transportTypes,
  type CorridorId,
  type Incoterm,
  type StartingService,
  type TransportCode,
} from "./fixtures";
import { formatDate, formatDecimal, formatInteger } from "./format";
import { autoGrid, portalButton } from "./ui";

const transportIcons: Record<TransportCode, LucideIcon> = {
  maritime: Ship,
  air: Plane,
  land: Truck,
  courier: Send,
  multimodal: Layers,
};

const fieldsetClass = "m-0 min-w-0 rounded-panel border border-[#E9E6DE] bg-white p-[26px]";
const legendClass = "px-2 font-display text-[17px] font-semibold";
const placeClass = "flex flex-col gap-3.5 rounded-btn border border-line bg-[#FBFAF7] p-[18px]";
const unitBoxClass =
  "flex items-center overflow-hidden rounded-field border border-line-strong bg-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500";
const unitInputClass =
  "min-h-[46px] min-w-0 flex-auto border-0 px-3.5 font-sans text-[15px] font-medium text-navy-900 focus-visible:outline-none";

function findCorridor(id: CorridorId) {
  return corridors.find((corridor) => corridor.id === id) ?? { id, origin: "CO" as const, destination: "CR" as const };
}

function isCorridorId(value: string): value is CorridorId {
  return corridors.some((corridor) => corridor.id === value);
}

function isIncoterm(value: string): value is Incoterm {
  return incoterms.some((incoterm) => incoterm.code === value);
}

function quantity(value: string, format: (n: number) => string): string | null {
  const parsed = Number(value);
  return value.trim() === "" || Number.isNaN(parsed) ? null : format(parsed);
}

/** Formulario de nueva solicitud de cotización con el resumen en vivo a la derecha. */
export function NewInquiryForm({ startingService }: { startingService: StartingService | null }) {
  const router = useRouter();
  const [service, setService] = useState(startingService);
  const [corridorId, setCorridorId] = useState<CorridorId>(inquiryDraft.corridorId);
  const [incoterm, setIncoterm] = useState<Incoterm>(inquiryDraft.incoterm);
  const [shipDate, setShipDate] = useState(inquiryDraft.desiredShipDate);
  const [transport, setTransport] = useState<TransportCode>(startingService?.transportCode ?? inquiryDraft.transportCode);
  const [originCity, setOriginCity] = useState(inquiryDraft.originCity);
  const [destinationCity, setDestinationCity] = useState(inquiryDraft.destinationCity);
  const [packages, setPackages] = useState(inquiryDraft.packages);
  const [weight, setWeight] = useState(inquiryDraft.weightKg);
  const [volume, setVolume] = useState(inquiryDraft.volumeM3);

  const corridor = findCorridor(corridorId);
  const packagesLabel = quantity(packages, (n) => `${formatInteger(n)} ${n === 1 ? "bulto" : "bultos"}`);
  const weightLabel = quantity(weight, (n) => `${formatDecimal(n)} kg`);
  const cargoSummary = [packagesLabel, weightLabel].filter(Boolean).join(" · ") || "—";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(routes.client.inquiry(demo.inquiry));
  };

  return (
    <main className="flex flex-wrap items-start gap-6 px-10 pt-6 pb-14 max-[600px]:px-4">
      <form onSubmit={handleSubmit} className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
        {service ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-tile border border-sand-line bg-selected px-5 py-4">
            <input type="hidden" name="serviceId" value={service.id} />
            <div className="flex items-center gap-3">
              <Avatar name={service.providerName} tone="navy" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold tracking-[0.01em] text-warn-ink">Servicio del marketplace</span>
                <span className="text-sm font-semibold">
                  {service.name} · {service.providerName}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setService(null)}
              className="min-h-10 border-0 bg-transparent px-3 font-sans text-[13px] font-semibold text-warn-ink underline"
            >
              Quitar servicio
            </button>
          </div>
        ) : null}

        <fieldset className={cn(fieldsetClass, "flex flex-col gap-5")}>
          <legend className={legendClass}>1. Ruta y transporte</legend>
          <div className={cn(autoGrid[220], "gap-x-5 gap-y-[18px]")}>
            <Field label="Corredor">
              <Select
                name="corridorId"
                value={corridorId}
                onChange={(event) => {
                  if (isCorridorId(event.target.value)) setCorridorId(event.target.value);
                }}
              >
                {corridors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {corridorLabel(item.id)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Incoterm" optional>
              <Select
                name="incoterm"
                value={incoterm}
                onChange={(event) => {
                  if (isIncoterm(event.target.value)) setIncoterm(event.target.value);
                }}
              >
                {incoterms.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Fecha deseada de embarque" optional>
              <TextInput
                type="date"
                name="desiredShipDate"
                value={shipDate}
                onChange={(event) => setShipDate(event.target.value)}
                className="px-3!"
              />
            </Field>
          </div>
          <div role="radiogroup" aria-label="Tipo de transporte" className={cn(autoGrid[130], "gap-2.5")}>
            {transportTypes.map((item) => {
              const checked = item.code === transport;
              const Icon = transportIcons[item.code];
              return (
                <label
                  key={item.code}
                  className={cn(
                    "relative flex cursor-pointer flex-col items-start gap-2.5 rounded-btn p-3.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500",
                    checked ? "border-2 border-gold-500 bg-selected" : "border border-line-warm bg-white",
                  )}
                >
                  <input
                    type="radio"
                    name="transport"
                    value={item.code}
                    checked={checked}
                    onChange={() => setTransport(item.code)}
                    className="visually-hidden"
                  />
                  <Icon
                    size={22}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className={checked ? "text-navy-900" : "text-subtle"}
                  />
                  <span className={cn("text-sm", checked ? "font-semibold" : "font-medium")}>{item.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className={cn(fieldsetClass, "flex flex-col gap-5")}>
          <legend className={legendClass}>2. Origen y destino</legend>
          <div className={cn(autoGrid[280], "gap-5")}>
            <div className={placeClass}>
              <p className="m-0 flex items-center gap-2 text-[13px] font-semibold">
                <MapPin size={16} strokeWidth={2} aria-hidden="true" className="text-gold-text" />
                Origen · {countryName[corridor.origin]}
              </p>
              <Field label="Ciudad">
                <TextInput name="originCity" value={originCity} onChange={(event) => setOriginCity(event.target.value)} />
              </Field>
              <Field label="Dirección de recogida" optional>
                <TextInput name="originAddress" />
              </Field>
            </div>
            <div className={placeClass}>
              <p className="m-0 flex items-center gap-2 text-[13px] font-semibold">
                <MapPin size={16} strokeWidth={2} aria-hidden="true" className="text-gold-text" />
                Destino · {countryName[corridor.destination]}
              </p>
              <Field label="Ciudad">
                <TextInput
                  name="destinationCity"
                  value={destinationCity}
                  onChange={(event) => setDestinationCity(event.target.value)}
                />
              </Field>
              <Field label="Dirección de entrega" optional>
                <TextInput name="destinationAddress" />
              </Field>
            </div>
          </div>
        </fieldset>

        <fieldset className={cn(fieldsetClass, "flex flex-col gap-5")}>
          <legend className={legendClass}>3. Tu carga</legend>
          <Field label="Descripción de la mercancía">
            <TextArea
              name="description"
              rows={3}
              defaultValue={inquiryDraft.description}
              className="min-h-0! resize-y"
            />
          </Field>
          <div className={cn(autoGrid[150], "gap-x-5 gap-y-[18px]")}>
            <Field label="Bultos">
              <TextInput
                type="number"
                name="packages"
                min={1}
                value={packages}
                onChange={(event) => setPackages(event.target.value)}
              />
            </Field>
            <Field label="Peso total">
              <span className={unitBoxClass}>
                <input
                  type="number"
                  name="weightKg"
                  min={0}
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  className={unitInputClass}
                />
                <span className="px-3.5 text-[13px] font-semibold text-subtle">kg</span>
              </span>
            </Field>
            <Field label="Volumen">
              <span className={unitBoxClass}>
                <input
                  type="number"
                  name="volumeM3"
                  min={0}
                  step="any"
                  value={volume}
                  onChange={(event) => setVolume(event.target.value)}
                  className={unitInputClass}
                />
                <span className="px-3.5 text-[13px] font-semibold text-subtle">m³</span>
              </span>
            </Field>
            <Field label="Partida arancelaria" optional>
              <TextInput name="hsCode" placeholder="8516.60" />
            </Field>
          </div>
          <div className={cn(autoGrid[240], "items-end gap-x-5 gap-y-[18px]")}>
            <Field label="Valor declarado" optional>
              <span className={unitBoxClass}>
                <select
                  aria-label="Moneda"
                  name="declaredCurrency"
                  defaultValue={inquiryDraft.declaredCurrency}
                  className="min-h-[46px] border-0 border-r border-line bg-[#FBFAF7] px-2.5 font-sans text-sm font-semibold text-navy-900 focus-visible:outline-none"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="declaredValue"
                  inputMode="decimal"
                  aria-label="Valor declarado"
                  defaultValue={inquiryDraft.declaredValue}
                  className={unitInputClass}
                />
              </span>
            </Field>
            <div className="flex flex-wrap gap-x-5 gap-y-2.5 pb-3">
              <label className="flex items-center gap-2.5 text-sm font-medium">
                <input type="checkbox" name="isHazardous" className="size-5 accent-navy-900" />
                Mercancía peligrosa
              </label>
              <label className="flex items-center gap-2.5 text-sm font-medium">
                <input type="checkbox" name="requiresRefrigeration" className="size-5 accent-navy-900" />
                Requiere refrigeración
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>4. Notas para tu asesor</legend>
          <label className="flex flex-col gap-2">
            <span className="visually-hidden">Notas</span>
            <TextArea
              name="notes"
              rows={3}
              placeholder="Horarios de recogida, requisitos de la mercancía, si ya tienes un agente de aduanas…"
              className="min-h-0! resize-y"
            />
          </label>
        </fieldset>

        <div className="flex flex-wrap justify-end gap-3">
          <Link href={routes.client.home} className={portalButton("outline", 50)}>
            Cancelar
          </Link>
          <button type="submit" className={portalButton("navy", 50, { padding: "px-[26px]!" })}>
            Enviar solicitud
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </form>

      <aside aria-label="Resumen" className="flex flex-[1_1_300px] flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-panel bg-navy-900 p-6 text-white">
          <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-300">Resumen</p>
          <div className="flex items-center justify-between gap-3">
            <span className="flex flex-col">
              <span className="text-xs text-white/65">Origen</span>
              <span className="font-display text-lg font-semibold">{originCity.trim() || "—"}</span>
              <span className="text-[13px] text-white/70">{countryName[corridor.origin]}</span>
            </span>
            <svg viewBox="0 0 60 20" width="60" height="20" aria-hidden="true" className="shrink-0">
              <path d="M2 10h50" stroke="#E8CB8E" strokeWidth="1.5" strokeDasharray="3 4" />
              <path
                d="m50 5 6 5-6 5"
                fill="none"
                stroke="#E8CB8E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="flex flex-col text-right">
              <span className="text-xs text-white/65">Destino</span>
              <span className="font-display text-lg font-semibold">{destinationCity.trim() || "—"}</span>
              <span className="text-[13px] text-white/70">{countryName[corridor.destination]}</span>
            </span>
          </div>
          <dl className="m-0 flex flex-col gap-2.5 border-t border-white/12 pt-3.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-white/65">Transporte</dt>
              <dd className="m-0 font-semibold">
                {transportName(transport)} · {incoterm}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-white/65">Carga</dt>
              <dd className="m-0 text-right font-semibold">{cargoSummary}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-white/65">Volumen</dt>
              <dd className="m-0 font-semibold">{quantity(volume, (n) => `${formatDecimal(n)} m³`) ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-white/65">Embarque</dt>
              <dd className="m-0 font-semibold">{shipDate ? formatDate(shipDate) : "—"}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-panel border border-[#E9E6DE] bg-white p-[22px]">
          <h2 className="m-0 font-display text-base font-bold tracking-[-0.02em]">Qué pasa después</h2>
          <ul className="mt-3 mb-0 list-disc pl-[18px] text-sm leading-[1.7] text-ink">
            <li>Recibes el código de tu solicitud y una confirmación por correo.</li>
            <li>Un asesor toma tu caso y te escribe por aquí.</li>
            <li>Te enviamos la cotización con su vigencia para que la aceptes en línea.</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
