"use client";

import Link from "next/link";
import { useState } from "react";
import { quoteStatus, type QuoteStatus } from "@/features/quote/model";
import { demo, routes } from "@/shared/lib/routes";
import { buttonClass } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Card";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, TableFooter, Td, Th } from "@/shared/ui/Table";
import { FilterPills, Segmented } from "@/shared/ui/Toggles";
import type { QuoteListItem } from "./fixtures";
import { formatMoney } from "./money";

type Scope = "mine" | "all";
type Filter = "all" | QuoteStatus;

const scopes: ReadonlyArray<{ id: Scope; label: string }> = [
  { id: "mine", label: "Mías" },
  { id: "all", label: "Todas" },
];

const filters: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "draft", label: "Borradores" },
  { id: "sent", label: "Enviadas" },
  { id: "accepted", label: "Aceptadas" },
  { id: "rejected", label: "Rechazadas" },
  { id: "expired", label: "Vencidas" },
];

type Props = {
  quotes: QuoteListItem[];
  /** Nombre del asesor con la sesión abierta, para el filtro «Mías». */
  advisorName: string;
};

/** Listado de cotizaciones del backoffice con filtros por asesor y por estado. */
export function QuotesBoard({ quotes, advisorName }: Props) {
  const [scope, setScope] = useState<Scope>("mine");
  const [filter, setFilter] = useState<Filter>("all");

  const inScope = quotes.filter((quote) => scope === "all" || quote.advisorName === advisorName);
  const rows = inScope.filter((quote) => filter === "all" || quote.status === filter);
  const count = (id: Filter) => (id === "all" ? inScope.length : inScope.filter((quote) => quote.status === id).length);

  return (
    <>
      <PageHeader
        title="Cotizaciones"
        description="Borradores, enviadas y respuestas de los clientes. Los totales los calcula la API con la regla de comisión vigente."
        actions={
          <Segmented
            label="Asesor"
            options={scopes}
            value={scope}
            onChange={(value) => {
              setScope(value);
              setFilter("all");
            }}
            className="rounded-[20px]!"
          />
        }
      />
      <PageBody>
        <FilterPills
          label="Filtrar por estado"
          options={filters.map((option) => ({ id: option.id, label: `${option.label} · ${count(option.id)}` }))}
          value={filter}
          onChange={setFilter}
        />

        <Panel aria-label="Lista de cotizaciones" className="overflow-hidden">
          <Table minWidth={1000}>
            <thead>
              <tr>
                <Th>Cotización</Th>
                <Th>Solicitud</Th>
                <Th>Empresa</Th>
                <Th>Estado</Th>
                <Th className="text-right!">Total</Th>
                <Th>Vigencia</Th>
                <Th>Asesor</Th>
                <Th>
                  <span className="visually-hidden">Acciones</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((quote) => {
                const draft = quote.status === "draft";
                const status = quoteStatus[quote.status];
                return (
                  <tr key={quote.code}>
                    <Td className="py-4!">
                      <span className="block font-semibold whitespace-nowrap">{quote.code}</span>
                      <span className="mt-0.5 block text-[13px] text-subtle">
                        Versión {quote.currentVersion} · {quote.total.currency}
                      </span>
                    </Td>
                    <Td className="py-4!">
                      <Link href={routes.backoffice.inquiry(demo.inquiry)} className="font-semibold whitespace-nowrap">
                        {quote.inquiryCode}
                      </Link>
                      <span className="mt-0.5 block text-[13px] text-subtle">{quote.routeLabel}</span>
                    </Td>
                    <Td className="py-4!">{quote.companyName}</Td>
                    <Td className="py-4!">
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </Td>
                    <Td className="py-4! text-right font-display text-[15px] font-semibold whitespace-nowrap">
                      {formatMoney(quote.total)}
                    </Td>
                    <Td className="py-4! whitespace-nowrap text-subtle">{quote.validityLabel}</Td>
                    <Td className="py-4! whitespace-nowrap">{quote.advisorName}</Td>
                    <Td className="py-4! text-right">
                      <Link
                        href={routes.backoffice.inquiry(demo.inquiry)}
                        className={buttonClass(
                          "outline",
                          "sm",
                          draft ? "border-gold-500! bg-selected!" : "border-line-strong!",
                        )}
                      >
                        {draft ? "Abrir cotizador" : "Ver"}
                        <span className="visually-hidden"> {quote.code}</span>
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {rows.length === 0 ? (
            <p className="m-0 px-6 py-10 text-center text-[15px] text-subtle">No hay cotizaciones con este filtro.</p>
          ) : null}
          <TableFooter>
            <span>{rows.length === 1 ? "1 cotización" : `${rows.length} cotizaciones`}</span>
            <span>De la más reciente a la más antigua</span>
          </TableFooter>
        </Panel>
      </PageBody>
    </>
  );
}
