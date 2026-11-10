"use client";

import Link from "next/link";
import { useState } from "react";
import { inquiryClientStatus, type InquiryStatus } from "@/features/inquiry/model";
import { demo, routes } from "@/shared/lib/routes";
import { Panel } from "@/shared/ui/Card";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, Td, Th } from "@/shared/ui/Table";
import { corridorLabel, type InquirySummary } from "./fixtures";
import { panelTitle } from "./ui";

type Filter = InquiryStatus | "all";

const statusOptions = Object.entries(inquiryClientStatus).map(([id, { label }]) => ({ id, label }));

function isFilter(value: string): value is Filter {
  return value === "all" || value in inquiryClientStatus;
}

/** Tabla de solicitudes recientes del inicio, con filtro por estado. */
export function RecentInquiries({ rows }: { rows: ReadonlyArray<InquirySummary> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? rows : rows.filter((row) => row.status === filter);

  return (
    <Panel className="pt-6 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6">
        <h2 className={panelTitle}>Solicitudes recientes</h2>
        <div className="flex flex-wrap gap-2">
          <label className="flex min-h-10 items-center gap-2 rounded-field border border-line-warm px-3 text-[13px] text-subtle">
            Estado
            <select
              value={filter}
              onChange={(event) => {
                if (isFilter(event.target.value)) setFilter(event.target.value);
              }}
              className="border-0 bg-transparent font-sans text-[13px] font-semibold text-navy-900"
            >
              <option value="all">Todos</option>
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Link href={routes.client.inquiries} className="inline-flex min-h-10 items-center px-3.5 text-[13px] font-semibold">
            Ver todas
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <Table minWidth={760}>
          <thead>
            <tr>
              <Th className="py-3!">Código</Th>
              <Th className="py-3!">Corredor</Th>
              <Th className="py-3!">Carga</Th>
              <Th className="py-3!">Estado</Th>
              <Th className="py-3!">Actualizada</Th>
              <Th className="py-3!">
                <span className="visually-hidden">Acciones</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const status = inquiryClientStatus[row.status];
              return (
                <tr key={row.code}>
                  <Td className="py-4! font-semibold whitespace-nowrap">{row.code}</Td>
                  <Td className="py-4!">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">{corridorLabel(row.corridorId)}</span>
                      <span className="text-[13px] text-subtle">{row.transportLabel}</span>
                    </span>
                  </Td>
                  <Td className="py-4! text-ink">{row.cargoLabel}</Td>
                  <Td className="py-4!">
                    <StatusPill tone={status.tone}>{status.label}</StatusPill>
                  </Td>
                  <Td className="py-4! whitespace-nowrap text-subtle">{row.updatedLabel}</Td>
                  <Td className="py-4! text-right">
                    <Link href={routes.client.inquiry(demo.inquiry)} className="font-semibold whitespace-nowrap">
                      Abrir
                      <span className="visually-hidden"> {row.code}</span>
                    </Link>
                  </Td>
                </tr>
              );
            })}
            {rows.length > 0 && visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[15px] text-subtle">
                  No hay solicitudes con este estado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </div>
    </Panel>
  );
}
