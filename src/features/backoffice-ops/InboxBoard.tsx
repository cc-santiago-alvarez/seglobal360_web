"use client";

import Link from "next/link";
import { useState } from "react";
import { companyStatus, type CompanyStatus } from "@/features/company/model";
import { inquiryStatus } from "@/features/inquiry/model";
import { providerKind } from "@/features/provider/model";
import { cn } from "@/shared/lib/cn";
import { demo, routes } from "@/shared/lib/routes";
import { Avatar } from "@/shared/ui/Avatar";
import { ButtonLink, buttonClass } from "@/shared/ui/Button";
import { Panel, SectionTitle } from "@/shared/ui/Card";
import { countryName } from "@/shared/ui/Flag";
import { StatusPill, toneDot } from "@/shared/ui/StatusPill";
import { Table, Td, Th } from "@/shared/ui/Table";
import {
  companyRole,
  inquirySource,
  type Advisor,
  type InboxTile,
  type PendingCompany,
  type ProviderInReview,
  type UnassignedInquiry,
  type WaitLevel,
} from "./fixtures";
import { compactControl } from "./ui";

const waitColor: Record<WaitLevel, string> = {
  on_time: "text-navy-900",
  late: "text-warn-fg",
  overdue: "text-danger-fg",
};

const takeOption = "me";

type Props = {
  tiles: InboxTile[];
  inquiries: UnassignedInquiry[];
  companies: PendingCompany[];
  providers: ProviderInReview[];
  advisors: Advisor[];
  currentAdvisor: Advisor;
};

/** Contenido de la bandeja: indicadores, solicitudes sin asignar y validaciones pendientes. */
export function InboxBoard({ tiles, inquiries, companies, providers, advisors, currentAdvisor }: Props) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [decisions, setDecisions] = useState<Record<string, CompanyStatus>>({});
  const [announcement, setAnnouncement] = useState("");

  const unassignedCount = inquiries.filter((inquiry) => !assigned[inquiry.code]).length;
  const pendingCount = companies.filter((company) => (decisions[company.id] ?? company.status) === "pending_validation").length;

  function tileCount(tile: InboxTile): number {
    if (tile.id === "inquiries_unassigned") return unassignedCount;
    if (tile.id === "companies_pending") return pendingCount;
    return tile.count;
  }

  function assign(code: string) {
    const choice = choices[code] ?? takeOption;
    const advisor = choice === takeOption ? currentAdvisor : advisors.find((item) => item.id === choice);
    if (!advisor) return;
    setAssigned((current) => ({ ...current, [code]: advisor.name }));
    setAnnouncement(
      advisor.id === currentAdvisor.id ? `Tomaste ${code}.` : `${code} quedó asignada a ${advisor.name}.`,
    );
  }

  function decide(company: PendingCompany, status: CompanyStatus) {
    setDecisions((current) => ({ ...current, [company.id]: status }));
    setAnnouncement(`${company.legalName}: ${companyStatus[status].label}.`);
  }

  return (
    <>
      <p role="status" className="visually-hidden">
        {announcement}
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3.5">
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            href={tile.href}
            className="card-hover flex flex-col gap-2.5 rounded-tile border border-[#E9E6DE] bg-white p-[18px] text-navy-900 no-underline hover:text-navy-900"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-display text-[30px] font-semibold">{tileCount(tile)}</span>
              <span aria-hidden="true" className={cn("size-2.5 rounded-full", toneDot(tile.tone))} />
            </span>
            <span className="text-sm leading-[1.35] font-medium">{tile.label}</span>
          </Link>
        ))}
      </div>

      <Panel className="pt-[22px] pb-1.5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6">
          <SectionTitle>Solicitudes nuevas sin asignar</SectionTitle>
          <Link href={routes.backoffice.inquiry(demo.inquiry)} className="text-[13px] font-semibold">
            Ver todas las solicitudes
          </Link>
        </div>
        <div className="mt-3.5">
          <Table minWidth={860}>
            <thead>
              <tr>
                <Th className="py-2.5!">Solicitud</Th>
                <Th className="py-2.5!">Empresa</Th>
                <Th className="py-2.5!">Corredor</Th>
                <Th className="py-2.5!">Origen</Th>
                <Th className="py-2.5!">Espera</Th>
                <Th className="py-2.5! text-right!">Asignar</Th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => {
                const advisorName = assigned[inquiry.code];
                const selectId = `advisor-${inquiry.code}`;
                return (
                  <tr key={inquiry.code}>
                    <Td className="py-3.5!">
                      <Link
                        href={routes.backoffice.inquiry(demo.inquiry)}
                        className="link-quiet font-semibold text-navy-900"
                      >
                        {inquiry.code}
                      </Link>
                      <span className="mt-0.5 block text-[13px] text-subtle">{inquiry.cargoSummary}</span>
                    </Td>
                    <Td className="py-3.5! font-medium">{inquiry.companyName}</Td>
                    <Td className="py-3.5!">
                      <span className="block">{inquiry.corridorLabel}</span>
                      <span className="text-[13px] text-subtle">{inquiry.transportLabel}</span>
                    </Td>
                    <Td className="py-3.5!">
                      <span className="rounded-full bg-[#F3F1EB] px-2.5 py-[3px] text-xs font-semibold text-ink">
                        {inquirySource[inquiry.source]}
                      </span>
                    </Td>
                    <Td className={cn("py-3.5! font-semibold whitespace-nowrap", waitColor[inquiry.waitLevel])}>
                      {inquiry.waitingLabel}
                    </Td>
                    <Td className="py-3.5!">
                      {advisorName ? (
                        <div className="flex items-center justify-end gap-2">
                          <StatusPill tone={inquiryStatus.assigned.tone}>{inquiryStatus.assigned.label}</StatusPill>
                          <span className="text-[13px] font-medium whitespace-nowrap">{advisorName}</span>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <label htmlFor={selectId} className="visually-hidden">
                            Asesor para {inquiry.code}
                          </label>
                          <select
                            id={selectId}
                            value={choices[inquiry.code] ?? takeOption}
                            onChange={(event) => {
                              const value = event.target.value;
                              setChoices((current) => ({ ...current, [inquiry.code]: value }));
                            }}
                            className={cn(compactControl, "border-line-strong px-2.5")}
                          >
                            <option value={takeOption}>A mí (tomar)</option>
                            {advisors.map((advisor) => (
                              <option key={advisor.id} value={advisor.id}>
                                {advisor.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => assign(inquiry.code)}
                            className={buttonClass("navy", "sm", "px-3.5!")}
                          >
                            Asignar<span className="visually-hidden"> {inquiry.code}</span>
                          </button>
                        </div>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Panel>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] gap-5">
        <Panel className="px-6 py-[22px]">
          <SectionTitle>Empresas por validar</SectionTitle>
          <ul className="mt-3.5 flex flex-col">
            {companies.map((company) => {
              const decided = decisions[company.id];
              return (
                <li
                  key={company.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft py-3.5 last:border-b-0"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold">{company.legalName}</span>
                    <span className="text-[13px] text-subtle">
                      {companyRole[company.type]} · {company.documentLabel} · {countryName[company.country]} ·{" "}
                      {company.registeredLabel}
                    </span>
                  </span>
                  {decided ? (
                    <StatusPill tone={companyStatus[decided].tone} size="md">
                      {companyStatus[decided].label}
                    </StatusPill>
                  ) : (
                    <span className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => decide(company, "inactive")}
                        className={buttonClass("danger", "sm", "px-3.5!")}
                      >
                        Rechazar<span className="visually-hidden"> {company.legalName}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => decide(company, "active")}
                        className="lift inline-flex min-h-10 items-center justify-center rounded-btn border-0 bg-success-fg px-3.5 text-[13px] font-semibold whitespace-nowrap text-white"
                      >
                        Validar<span className="visually-hidden"> {company.legalName}</span>
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel className="px-6 py-[22px]">
          <SectionTitle>Proveedores en revisión</SectionTitle>
          <ul className="mt-3.5">
            {providers.map((provider) => (
              <li key={provider.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <span className="flex items-center gap-3">
                  <Avatar name={provider.name} size={40} tone="navy" shape="square" />
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold">{provider.name}</span>
                    <span className="text-[13px] text-subtle">
                      {providerKind[provider.kind]} · {provider.category} · {provider.submittedLabel}
                    </span>
                  </span>
                </span>
                <ButtonLink href={routes.backoffice.providers} variant="navy" size="sm">
                  Revisar perfil
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
