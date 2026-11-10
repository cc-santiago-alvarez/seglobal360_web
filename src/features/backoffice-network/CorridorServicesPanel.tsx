"use client";

import { useState } from "react";
import { StatusPill, type Tone } from "@/shared/ui/StatusPill";
import { Table } from "@/shared/ui/Table";
import type { CorridorServiceRow, CorridorServiceStatus, NetworkService } from "./fixtures";
import { DetailTd, DetailTh, panelTitle } from "./ui";

const serviceStates: Record<CorridorServiceStatus, { label: string; tone: Tone; action: string }> = {
  enabled: { label: "Habilitado", tone: "success", action: "Deshabilitar" },
  disabled: { label: "Deshabilitado", tone: "muted", action: "Habilitar de nuevo" },
};

type Props = { services: CorridorServiceRow[]; candidates: NetworkService[] };

/** Servicios que se pueden cotizar por el corredor: habilitar uno publicado o pausarlo. */
export function CorridorServicesPanel({ services, candidates }: Props) {
  const [rows, setRows] = useState(services);
  const [message, setMessage] = useState("");
  const available = candidates.filter((candidate) => !rows.some((row) => row.serviceId === candidate.id));
  const [choice, setChoice] = useState(available[0]?.id ?? "");
  const picked = available.find((candidate) => candidate.id === choice) ?? available[0];

  function enable() {
    if (!picked) return;
    setRows([
      ...rows,
      {
        id: `new-${picked.id}`,
        serviceId: picked.id,
        serviceName: picked.name,
        providerName: picked.providerName,
        status: "enabled",
      },
    ]);
    setChoice("");
    setMessage(`${picked.name} quedó habilitado en el corredor.`);
  }

  function toggle(row: CorridorServiceRow) {
    const status: CorridorServiceStatus = row.status === "enabled" ? "disabled" : "enabled";
    setRows(rows.map((item) => (item.id === row.id ? { ...item, status } : item)));
    setMessage(`${row.serviceName} quedó ${serviceStates[status].label.toLowerCase()}.`);
  }

  return (
    <section aria-label="Servicios habilitados" className="min-w-0 rounded-panel border border-[#E9E6DE] bg-white pt-5 pb-1.5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6">
        <div>
          <h2 className={panelTitle}>Servicios habilitados</h2>
          <p className="mt-1 mb-0 text-[13px] text-subtle">
            Solo los servicios habilitados aquí se pueden cotizar por este corredor.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex min-w-0">
            <span className="visually-hidden">Servicio publicado</span>
            <select
              value={picked?.id ?? ""}
              onChange={(event) => setChoice(event.target.value)}
              disabled={!picked}
              className="min-h-[42px] max-w-[300px] min-w-0 rounded-field border border-line-strong bg-white px-2.5 font-sans text-[13px] font-medium text-navy-900 disabled:bg-ivory disabled:text-subtle"
            >
              {available.length > 0 ? (
                available.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))
              ) : (
                <option value="">No hay más servicios publicados</option>
              )}
            </select>
          </label>
          <button
            type="button"
            onClick={enable}
            disabled={!picked}
            className="lift inline-flex min-h-[42px] items-center rounded-btn border-0 bg-navy-900 px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-faint disabled:shadow-none"
          >
            Habilitar
          </button>
        </div>
      </div>
      <p role="status" className="visually-hidden">
        {message}
      </p>
      <div className="mt-3.5">
        <Table minWidth={720}>
          <thead>
            <tr>
              <DetailTh compact>Servicio</DetailTh>
              <DetailTh compact>Proveedor</DetailTh>
              <DetailTh compact>Estado</DetailTh>
              <DetailTh compact>
                <span className="visually-hidden">Acciones</span>
              </DetailTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const state = serviceStates[row.status];
              return (
                <tr key={row.id}>
                  <DetailTd className="font-semibold">{row.serviceName}</DetailTd>
                  <DetailTd className="text-ink">{row.providerName}</DetailTd>
                  <DetailTd>
                    <StatusPill tone={state.tone}>{state.label}</StatusPill>
                  </DetailTd>
                  <DetailTd className="text-right">
                    <button
                      type="button"
                      onClick={() => toggle(row)}
                      className="lift min-h-[38px] rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-semibold whitespace-nowrap text-navy-900"
                    >
                      {state.action}
                      <span className="visually-hidden"> · {row.serviceName}</span>
                    </button>
                  </DetailTd>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {rows.length === 0 ? (
          <p className="m-0 px-6 py-8 text-center text-[15px] text-subtle">
            Aún no hay servicios habilitados en este corredor.
          </p>
        ) : null}
      </div>
    </section>
  );
}
