"use client";

import { useEffect, useRef } from "react";
import { clientStage } from "@/features/client/model";
import { companyStatus, companyType, type CompanyStatus } from "@/features/company/model";
import { userStatus } from "@/features/user/model";
import { Panel } from "@/shared/ui/Card";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, TableFooter, Th } from "@/shared/ui/Table";
import { FilterPills } from "@/shared/ui/Toggles";
import { countries, documentTypes, type NetworkCompany } from "./fixtures";
import { countLabel, formatDate } from "./format";
import { companyQuerySpec, type CompanyFilter, type CompanyQuery } from "./listQuery";
import { StatusDialog } from "./StatusDialog";
import { companyActions, companyActionsByStatus } from "./statusActions";
import {
  BackButton,
  FactGrid,
  HistoryPanel,
  Notice,
  Td,
  actionClass,
  panelPadded,
  panelTitle,
  rowActionClass,
  SearchField,
  type Fact,
} from "./ui";
import { useListQuery } from "./useListQuery";
import { useStatusWorkflow } from "./useStatusWorkflow";

const filterLabels: Record<CompanyFilter, string> = {
  pending_validation: "Por validar",
  all: "Todas",
  active: "Activas",
  suspended: "Suspendidas",
  inactive: "Inactivas",
};

function documentLabel(company: NetworkCompany): string {
  return `${documentTypes[company.documentTypeCode]} ${company.documentNumber}`;
}

type Props = { companies: NetworkCompany[]; initialQuery: CompanyQuery };

/** Empresas del backoffice: listado con filtros y detalle con validación, suspensión y baja. */
export function CompaniesScreen({ companies, initialQuery }: Props) {
  const [query, setQuery] = useListQuery(companyQuerySpec, initialQuery);
  const workflow = useStatusWorkflow<CompanyStatus>();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusTarget = useRef<string | null>(null);

  const all = companies
    .map((company) => {
      const override = workflow.overrides[company.id];
      return override ? { ...company, status: override.status, statusReason: override.reason } : company;
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const selected = all.find((company) => company.id === query.selected);
  const selectedId = selected?.id;

  useEffect(() => {
    const target = focusTarget.current;
    if (!target) return;
    focusTarget.current = null;
    window.scrollTo({ top: 0 });
    if (selectedId) headingRef.current?.focus();
    else document.getElementById(`company-open-${target}`)?.focus();
  }, [selectedId]);

  function open(id: string) {
    workflow.reset();
    focusTarget.current = id;
    setQuery({ selected: id });
  }

  function back() {
    workflow.reset();
    focusTarget.current = query.selected;
    setQuery({ selected: null });
  }

  if (selected) {
    const actions = companyActions(selected.legalName);
    const dialog = workflow.dialog;
    const facts: Fact[] = [
      { label: "Razón social", value: selected.legalName },
      { label: "Nombre comercial", value: selected.tradeName },
      { label: "Documento", value: documentLabel(selected) },
      { label: "País", value: countries[selected.countryCode] },
      { label: "Tipo", value: companyType[selected.companyType] },
      { label: "Moneda de facturación", value: selected.billingCurrency },
      { label: "Correo de contacto", value: selected.contactEmail },
      { label: "Teléfono", value: selected.contactPhone },
    ];
    if (selected.clientStage) {
      const stage = clientStage[selected.clientStage];
      facts.push({ label: "Etapa comercial", value: <StatusPill tone={stage.tone}>{stage.label}</StatusPill> });
    }
    const status = companyStatus[selected.status];

    return (
      <>
        <header className="flex flex-col gap-3 px-10 pt-7 max-[600px]:px-4">
          <BackButton onClick={back}>Volver a empresas</BackButton>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 ref={headingRef} tabIndex={-1} className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">
                {selected.legalName}
              </h1>
              <StatusPill tone={status.tone}>{status.label}</StatusPill>
            </div>
            <div className="flex flex-wrap gap-2">
              {companyActionsByStatus[selected.status].map((id) => {
                const action = actions[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => workflow.openDialog(action)}
                    className={actionClass(action.variant)}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="m-0 text-[15px] text-subtle">
            {companyType[selected.companyType]} · {countries[selected.countryCode]} · registrada el{" "}
            {formatDate(selected.createdAt)}
          </p>
        </header>

        <PageBody>
          {dialog ? (
            <StatusDialog
              key={dialog.id}
              title={dialog.title}
              help={dialog.help}
              reasonLabel={dialog.reasonLabel}
              confirmLabel={dialog.confirm}
              danger={dialog.variant === "danger"}
              onCancel={workflow.closeDialog}
              onConfirm={(reason) => workflow.apply(selected.id, dialog, reason)}
            />
          ) : null}
          {workflow.notice ? <Notice tone={workflow.notice.tone}>{workflow.notice.text}</Notice> : null}

          <div className="flex flex-wrap items-start gap-5">
            <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
              <section className={panelPadded}>
                <h2 className={panelTitle}>Datos de la empresa</h2>
                <FactGrid facts={facts} className="mt-4 gap-y-4" />
                {selected.statusReason ? (
                  <p className="mt-[18px] mb-0 rounded-field bg-ivory px-3.5 py-3 text-sm leading-normal text-ink">
                    <strong className="font-semibold">Motivo del estado:</strong> {selected.statusReason}
                  </p>
                ) : null}
              </section>
              <section className={panelPadded}>
                <h2 className={panelTitle}>Usuarios de la empresa</h2>
                <ul className="mt-3.5 flex flex-col">
                  {selected.users.map((user) => {
                    const state = userStatus[user.status];
                    return (
                      <li
                        key={user.id}
                        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line-soft py-3"
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="font-semibold">{user.name}</span>
                          <span className="text-[13px] break-words text-subtle">
                            {user.email} · {user.role}
                          </span>
                        </span>
                        <StatusPill tone={state.tone}>{state.label}</StatusPill>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
            <HistoryPanel
              entries={[
                ...(workflow.log[selected.id] ?? []),
                {
                  id: `${selected.id}-created`,
                  title: "Registro de la empresa",
                  meta: formatDate(selected.createdAt),
                  note: "Creada desde el registro público.",
                },
              ]}
            />
          </div>
        </PageBody>
      </>
    );
  }

  const search = query.q.trim().toLowerCase();
  const rows = all.filter(
    (company) =>
      (query.status === "all" || company.status === query.status) &&
      (!search || `${company.legalName} ${company.tradeName} ${documentLabel(company)}`.toLowerCase().includes(search)),
  );
  const filterOptions = companyQuerySpec.statuses.map((id) => ({
    id,
    label: `${filterLabels[id]} · ${id === "all" ? all.length : all.filter((company) => company.status === id).length}`,
  }));

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Clientes, proveedores y operadores logísticos registrados en SEGlobal 360."
        actions={
          <SearchField
            label="Buscar empresas"
            placeholder="Razón social, nombre o documento"
            value={query.q}
            onChange={(q) => setQuery({ q })}
          />
        }
      />
      <PageBody>
        <FilterPills
          label="Filtrar por estado"
          options={filterOptions}
          value={query.status}
          onChange={(status) => setQuery({ status })}
        />
        <Panel aria-label="Lista de empresas" className="overflow-hidden">
          <Table minWidth={900}>
            <thead>
              <tr>
                <Th>Empresa</Th>
                <Th>Documento</Th>
                <Th>País</Th>
                <Th>Tipo</Th>
                <Th>Estado</Th>
                <Th>Registro</Th>
                <Th>
                  <span className="visually-hidden">Acciones</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((company) => {
                const status = companyStatus[company.status];
                const pending = company.status === "pending_validation";
                return (
                  <tr key={company.id}>
                    <Td>
                      <span className="block font-semibold">{company.legalName}</span>
                      <span className="mt-0.5 block text-[13px] text-subtle">{company.tradeName}</span>
                    </Td>
                    <Td className="whitespace-nowrap">{documentLabel(company)}</Td>
                    <Td>{countries[company.countryCode]}</Td>
                    <Td>{companyType[company.companyType]}</Td>
                    <Td>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </Td>
                    <Td className="whitespace-nowrap text-subtle">{formatDate(company.createdAt)}</Td>
                    <Td className="text-right">
                      <button
                        id={`company-open-${company.id}`}
                        type="button"
                        onClick={() => open(company.id)}
                        className={rowActionClass(pending)}
                      >
                        {pending ? "Revisar y validar" : "Ver detalle"}
                        <span className="visually-hidden"> · {company.legalName}</span>
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {rows.length === 0 ? (
            <p className="m-0 px-6 py-10 text-center text-[15px] text-subtle">No hay empresas con este filtro.</p>
          ) : null}
          <TableFooter>
            <span>{countLabel(rows.length, "empresa", "empresas")}</span>
            <span>De la más reciente a la más antigua</span>
          </TableFooter>
        </Panel>
      </PageBody>
    </>
  );
}
