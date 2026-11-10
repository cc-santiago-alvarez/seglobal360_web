"use client";

import Link from "next/link";
import { useState } from "react";
import { quoteClientStatus, type QuoteClientStatus } from "@/features/quote/model";
import { cn } from "@/shared/lib/cn";
import { demo, routes } from "@/shared/lib/routes";
import { Callout } from "@/shared/ui/Callout";
import { Panel } from "@/shared/ui/Card";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, TableFooter, Td, Th } from "@/shared/ui/Table";
import { FilterPills } from "@/shared/ui/Toggles";
import { corridorLabel, transportName, type QuoteSummary } from "./fixtures";
import { formatDate, formatMoney } from "./format";
import { portalButton } from "./ui";

type Filter = QuoteClientStatus | "all";

const filterLabels: Record<Filter, string> = {
  all: "Todas",
  sent: "Por responder",
  accepted: "Aceptadas",
  rejected: "Rechazadas",
  expired: "Vencidas",
};

const filterOrder: ReadonlyArray<Filter> = ["all", "sent", "accepted", "rejected", "expired"];

/** Texto de la columna de vigencia según el estado de la cotización. */
function validityLabel(quote: QuoteSummary): string {
  switch (quote.status) {
    case "sent":
      return `Vence el ${formatDate(quote.validUntil)}`;
    case "accepted":
      return `Aceptada el ${formatDate(quote.respondedAt ?? quote.validUntil)}`;
    case "rejected":
      return `Rechazada el ${formatDate(quote.respondedAt ?? quote.validUntil)}`;
    case "expired":
      return `Venció el ${formatDate(quote.validUntil)}`;
  }
}

/** Listado de cotizaciones del cliente con filtro por estado. */
export function QuotesList({ quotes }: { quotes: ReadonlyArray<QuoteSummary> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const rows = filter === "all" ? quotes : quotes.filter((quote) => quote.status === filter);
  const options = filterOrder.map((id) => ({
    id,
    label: `${filterLabels[id]} · ${id === "all" ? quotes.length : quotes.filter((quote) => quote.status === id).length}`,
  }));

  return (
    <>
      <FilterPills label="Filtrar por estado" options={options} value={filter} onChange={setFilter} />

      <Panel aria-label="Lista de cotizaciones" className="overflow-hidden">
        <Table minWidth={860}>
          <thead>
            <tr>
              <Th>Cotización</Th>
              <Th>Solicitud</Th>
              <Th className="text-right!">Total</Th>
              <Th>Vigencia</Th>
              <Th>Estado</Th>
              <Th>
                <span className="visually-hidden">Acciones</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((quote) => {
              const pending = quote.status === "sent";
              const status = quoteClientStatus[quote.status];
              return (
                <tr key={quote.code} className={pending ? "bg-highlight" : "bg-white"}>
                  <Td>
                    <span className="block font-semibold whitespace-nowrap">{quote.code}</span>
                    <span className="mt-0.5 block text-[13px] text-subtle">Versión {quote.currentVersion}</span>
                  </Td>
                  <Td>
                    <Link href={routes.client.inquiry(demo.inquiry)} className="font-semibold whitespace-nowrap">
                      {quote.inquiryCode}
                    </Link>
                    <span className="mt-0.5 block text-[13px] text-subtle">
                      {corridorLabel(quote.corridorId)} · {transportName(quote.transportCode)}
                    </span>
                  </Td>
                  <Td className="text-right font-display text-base font-semibold whitespace-nowrap">
                    {formatMoney(quote.total)}
                  </Td>
                  <Td className={cn("whitespace-nowrap", pending ? "font-semibold text-warn-fg" : "text-subtle")}>
                    {validityLabel(quote)}
                  </Td>
                  <Td>
                    <StatusPill tone={status.tone}>{status.label}</StatusPill>
                  </Td>
                  <Td className="text-right">
                    {pending ? (
                      <Link href={routes.client.inquiry(demo.inquiry)} className={portalButton("gold")}>
                        Revisar y responder
                      </Link>
                    ) : (
                      <Link
                        href={routes.client.inquiry(demo.inquiry)}
                        aria-label={`Ver ${quote.code}`}
                        className={portalButton("outline")}
                      >
                        Ver
                      </Link>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {rows.length === 0 ? (
          <p className="m-0 px-6 py-10 text-center text-[15px] text-subtle">No hay cotizaciones con este estado.</p>
        ) : null}
        <TableFooter>
          <span>Página 1 de 1</span>
          <span>Ordenadas de la más reciente a la más antigua</span>
        </TableFooter>
      </Panel>

      <Callout kind="info">
        El total incluye todos los servicios y la gestión de SEGlobal 360. Lo que cubre cada cotización lo ves al abrirla,
        junto a la conversación con tu asesor.
      </Callout>
    </>
  );
}
