"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useEffect, useRef } from "react";
import { providerKind, providerStatus, type ProviderStatus } from "@/features/provider/model";
import { routes, slug } from "@/shared/lib/routes";
import { Panel } from "@/shared/ui/Card";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, TableFooter, Th } from "@/shared/ui/Table";
import { FilterPills } from "@/shared/ui/Toggles";
import type { NetworkProvider } from "./fixtures";
import { countLabel, formatDate } from "./format";
import {
  companyQuerySpec,
  listQueryString,
  providerQuerySpec,
  type ProviderFilter,
  type ProviderKindFilter,
  type ProviderQuery,
} from "./listQuery";
import { StatusDialog } from "./StatusDialog";
import { providerActions, providerActionsByStatus } from "./statusActions";
import {
  BackButton,
  FactGrid,
  HistoryPanel,
  Monogram,
  Notice,
  SearchField,
  TagList,
  Td,
  actionClass,
  panelPadded,
  panelTitle,
  rowActionClass,
} from "./ui";
import { useListQuery } from "./useListQuery";
import { useStatusWorkflow } from "./useStatusWorkflow";

const filterLabels: Record<ProviderFilter, string> = {
  in_review: "Por revisar",
  approved: "Aprobados",
  published: "Publicados",
  all: "Todos",
};

const kindOptions: ReadonlyArray<{ id: ProviderKindFilter; label: string }> = [
  { id: "all", label: "Todos los tipos" },
  { id: "supplier", label: "Proveedores mayoristas" },
  { id: "logistics", label: "Operadores logísticos" },
];

function kindLabel(provider: NetworkProvider): string {
  return provider.businessType ?? providerKind[provider.kind];
}

function companyHref(provider: NetworkProvider): string {
  const query = listQueryString(companyQuerySpec, {
    status: companyQuerySpec.defaultStatus,
    type: companyQuerySpec.defaultType,
    q: "",
    selected: provider.companyId,
  });
  return `${routes.backoffice.companies}${query}`;
}

type Props = { providers: NetworkProvider[]; initialQuery: ProviderQuery };

/** Proveedores del backoffice: revisión del perfil, publicación en el marketplace y suspensión. */
export function ProvidersScreen({ providers, initialQuery }: Props) {
  const [query, setQuery] = useListQuery(providerQuerySpec, initialQuery);
  const workflow = useStatusWorkflow<ProviderStatus>();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusTarget = useRef<string | null>(null);

  const all = providers
    .map((provider) => {
      const override = workflow.overrides[provider.id];
      return override ? { ...provider, status: override.status, statusReason: override.reason } : provider;
    })
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const selected = all.find((provider) => provider.id === query.selected);
  const selectedId = selected?.id;

  useEffect(() => {
    const target = focusTarget.current;
    if (!target) return;
    focusTarget.current = null;
    window.scrollTo({ top: 0 });
    if (selectedId) headingRef.current?.focus();
    else document.getElementById(`provider-open-${target}`)?.focus();
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
    const actions = providerActions(selected.name);
    const dialog = workflow.dialog;
    const status = providerStatus[selected.status];
    const published = selected.status === "published";

    return (
      <>
        <header className="flex flex-col gap-3 px-10 pt-7 max-[600px]:px-4">
          <BackButton onClick={back}>Volver a proveedores</BackButton>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3.5">
              <Monogram text={selected.monogram} large />
              <h1 ref={headingRef} tabIndex={-1} className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">
                {selected.name}
              </h1>
              <StatusPill tone={status.tone}>{status.label}</StatusPill>
            </div>
            <div className="flex flex-wrap gap-2">
              {published ? (
                <Link
                  href={selected.publicProfile ? routes.provider(slug(selected.name)) : routes.marketplace}
                  className={actionClass("outline")}
                >
                  Ver en el marketplace
                </Link>
              ) : null}
              {providerActionsByStatus[selected.status].map((id) => {
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
            {kindLabel(selected)} · empresa{" "}
            <Link href={companyHref(selected)} className="font-semibold">
              {selected.companyName}
            </Link>{" "}
            · actualizado el {formatDate(selected.updatedAt)}
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
              <section className={`${panelPadded} flex flex-col gap-4`}>
                <h2 className={panelTitle}>Perfil</h2>
                <p className="m-0 text-[15px] leading-[1.6] text-ink">{selected.summary}</p>
                <FactGrid
                  className="gap-y-4"
                  facts={[
                    { label: "Tipo", value: kindLabel(selected) },
                    { label: "Ubicación", value: selected.city },
                    { label: "Cobertura", value: selected.coverage },
                    { label: selected.kind === "logistics" ? "Servicios" : "Pedido mínimo", value: selected.offer },
                    { label: "Fotos", value: selected.photoCount > 0 ? countLabel(selected.photoCount, "foto", "fotos") : "—" },
                    { label: "Estado", value: status.label },
                  ]}
                />
                <div>
                  <p className="mt-0 mb-2 text-xs text-subtle">Categorías</p>
                  <TagList tags={selected.categories} />
                </div>
              </section>
              <section className="min-w-0 rounded-panel border border-dashed border-line-strong bg-[#FBFAF7] p-6">
                <h2 className="m-0 flex items-center gap-2 font-display text-base font-bold tracking-[-0.02em]">
                  <Lock size={16} strokeWidth={1.75} aria-hidden="true" />
                  Solo para el equipo de Global 360
                </h2>
                <FactGrid
                  className="mt-3.5 gap-y-3.5"
                  facts={[
                    { label: "Sitio web", value: selected.website },
                    { label: "Contacto operativo", value: `${selected.contactName} · ${selected.contactEmail}` },
                    { label: "Empresa", value: selected.companyName },
                  ]}
                />
                {selected.statusReason ? (
                  <p className="mt-3.5 mb-0 rounded-field bg-white px-3.5 py-3 text-sm leading-normal text-ink">
                    <strong className="font-semibold">
                      {selected.status === "draft" ? "Notas de revisión" : "Motivo del estado"}:
                    </strong>{" "}
                    {selected.statusReason}
                  </p>
                ) : null}
              </section>
            </div>
            <HistoryPanel
              entries={[
                ...(workflow.log[selected.id] ?? []),
                {
                  id: `${selected.id}-review`,
                  title: "Perfil enviado a revisión",
                  meta: formatDate(selected.updatedAt),
                  note: "Enviado desde el portal del proveedor.",
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
    (provider) =>
      (query.status === "all" || provider.status === query.status) &&
      (query.type === "all" || provider.kind === query.type) &&
      (!search || `${provider.name} ${provider.companyName}`.toLowerCase().includes(search)),
  );
  const filterOptions = providerQuerySpec.statuses.map((id) => ({
    id,
    label: `${filterLabels[id]} · ${id === "all" ? all.length : all.filter((provider) => provider.status === id).length}`,
  }));

  return (
    <>
      <PageHeader
        title="Proveedores"
        description="Proveedores mayoristas y operadores logísticos: revisión, publicación y suspensión."
        actions={
          <>
            <label className="flex">
              <span className="visually-hidden">Tipo de proveedor</span>
              <select
                value={query.type}
                onChange={(event) =>
                  setQuery({ type: kindOptions.find((option) => option.id === event.target.value)?.id ?? "all" })
                }
                className="min-h-11 rounded-field border border-line-strong bg-white px-3.5 font-sans text-sm font-medium text-navy-900"
              >
                {kindOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <SearchField
              label="Buscar proveedores"
              placeholder="Nombre o empresa"
              value={query.q}
              onChange={(q) => setQuery({ q })}
            />
          </>
        }
      />
      <PageBody>
        <FilterPills
          label="Filtrar por estado"
          options={filterOptions}
          value={query.status}
          onChange={(status) => setQuery({ status })}
        />
        <Panel aria-label="Lista de proveedores" className="overflow-hidden">
          <Table minWidth={960}>
            <thead>
              <tr>
                <Th>Proveedor</Th>
                <Th>Tipo</Th>
                <Th>Categorías</Th>
                <Th>Cobertura</Th>
                <Th>Estado</Th>
                <Th>Actualizado</Th>
                <Th>
                  <span className="visually-hidden">Acciones</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((provider) => {
                const status = providerStatus[provider.status];
                const review = provider.status === "in_review";
                return (
                  <tr key={provider.id}>
                    <Td>
                      <span className="flex items-center gap-3">
                        <Monogram text={provider.monogram} />
                        <span className="flex flex-col">
                          <span className="font-semibold">{provider.name}</span>
                          <span className="text-[13px] text-subtle">{provider.companyName}</span>
                        </span>
                      </span>
                    </Td>
                    <Td>{kindLabel(provider)}</Td>
                    <Td className="text-ink">{provider.categories.join(", ")}</Td>
                    <Td className="whitespace-nowrap">{provider.coverage}</Td>
                    <Td>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </Td>
                    <Td className="whitespace-nowrap text-subtle">{formatDate(provider.updatedAt)}</Td>
                    <Td className="text-right">
                      <button
                        id={`provider-open-${provider.id}`}
                        type="button"
                        onClick={() => open(provider.id)}
                        className={rowActionClass(review)}
                      >
                        {review ? "Revisar perfil" : "Ver detalle"}
                        <span className="visually-hidden"> · {provider.name}</span>
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {rows.length === 0 ? (
            <p className="m-0 px-6 py-10 text-center text-[15px] text-subtle">No hay proveedores con este filtro.</p>
          ) : null}
          <TableFooter>
            <span>{countLabel(rows.length, "proveedor", "proveedores")}</span>
            <span>Ordenados por última actualización</span>
          </TableFooter>
        </Panel>
      </PageBody>
    </>
  );
}
