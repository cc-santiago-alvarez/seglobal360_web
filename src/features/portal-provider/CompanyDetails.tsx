"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Lock } from "lucide-react";
import { companyStatus, companyType } from "@/features/company/model";
import { routes } from "@/shared/lib/routes";
import { Button, ButtonLink } from "@/shared/ui/Button";
import { Panel, SectionTitle } from "@/shared/ui/Card";
import { Field, Select, TextInput } from "@/shared/ui/Field";
import { countryName } from "@/shared/ui/Flag";
import { PageBody } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { billingCurrencies, portalCopy, providerCompanies, type ProviderPortal } from "./fixtures";
import { StatusHeader } from "./StatusHeader";

const portalLinks: Record<ProviderPortal, { profile: string; users: string }> = {
  supplier: { profile: routes.supplier.profile, users: routes.supplier.users },
  logistics: { profile: routes.logistics.profile, users: routes.logistics.users },
};

type Props = {
  portal: ProviderPortal;
  /** Administrador (edita) u operativo (solo lectura). */
  canEdit: boolean;
};

/** Mi empresa del portal de proveedor: datos legales, contacto y facturación, perfil y rol. */
export function CompanyDetails({ portal, canEdit }: Props) {
  const company = providerCompanies[portal];
  const copy = portalCopy[portal];
  const links = portalLinks[portal];
  const legalId = useId();
  const contactId = useId();
  const profileId = useId();
  const [tradeName, setTradeName] = useState(company.tradeName);
  const [currency, setCurrency] = useState(company.billingCurrency);
  const [email, setEmail] = useState(company.contactEmail);
  const [phone, setPhone] = useState(company.contactPhone);
  const [saved, setSaved] = useState(false);
  const status = companyStatus[company.status];

  function edit(setter: (value: string) => void) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(event.target.value);
      setSaved(false);
    };
  }

  return (
    <>
      <StatusHeader
        title="Mi empresa"
        status={
          <StatusPill tone={status.tone} size="md">
            {status.label}
          </StatusPill>
        }
        description="Los datos con los que tu empresa opera en SEGlobal 360."
      />

      <PageBody>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
            {canEdit ? null : (
              <div role="status" className="flex items-center gap-3 rounded-[14px] bg-neutral-bg px-[18px] py-3.5 text-sm text-neutral-fg">
                <Lock size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
                Solo un administrador de tu empresa puede editar estos datos.
              </div>
            )}

            <Panel aria-labelledby={legalId} className="px-[26px] py-6">
              <SectionTitle id={legalId}>Datos legales</SectionTitle>
              <dl className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-6 gap-y-[18px]">
                <div className="col-span-full">
                  <dt className="text-xs text-subtle">Razón social</dt>
                  <dd className="mt-1 text-base font-semibold">{company.legalName}</dd>
                </div>
                <LegalItem term="Documento" value={company.document} />
                <LegalItem term="País" value={countryName[company.country]} />
                <LegalItem term="Tipo" value={companyType[company.type]} />
                <LegalItem term="Validada" value={company.validatedAt} />
              </dl>
              <p className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-[13px] leading-[1.55] text-subtle">
                <Lock size={16} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
                El documento y el país no se pueden cambiar. Para corregir la razón social, escríbele a tu asesor.
              </p>
            </Panel>

            <form
              aria-labelledby={contactId}
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(true);
              }}
              className="flex min-w-0 flex-col gap-[18px] rounded-panel border border-[#E9E6DE] bg-white px-[26px] py-6"
            >
              <SectionTitle id={contactId}>Contacto y facturación</SectionTitle>
              <fieldset
                disabled={!canEdit}
                className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-5 gap-y-[18px]"
              >
                <Field label="Nombre comercial" optional>
                  <TextInput type="text" value={tradeName} onChange={edit(setTradeName)} />
                </Field>
                <Field label="Moneda de facturación">
                  <Select value={currency} onChange={edit(setCurrency)}>
                    {billingCurrencies.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Correo de contacto">
                  <TextInput type="email" value={email} onChange={edit(setEmail)} />
                </Field>
                <Field label="Teléfono de contacto">
                  <TextInput type="tel" value={phone} onChange={edit(setPhone)} />
                </Field>
              </fieldset>
              {canEdit ? (
                <div className="flex flex-wrap items-center justify-end gap-3">
                  {saved ? (
                    <span role="status" className="text-sm font-medium text-success-fg">
                      Cambios guardados.
                    </span>
                  ) : null}
                  <Button type="submit" variant="navy" size="md">
                    Guardar cambios
                  </Button>
                </div>
              ) : null}
            </form>

            <Panel aria-labelledby={profileId} className="flex flex-wrap items-center justify-between gap-4 px-[26px] py-6">
              <div className="flex-[1_1_320px]">
                <SectionTitle id={profileId}>Tu perfil en el marketplace</SectionTitle>
                <p className="mt-1.5 text-sm leading-[1.55] text-subtle">{copy.profileText}</p>
              </div>
              <ButtonLink href={links.profile} variant="outline" size="md">
                {copy.profileCta}
              </ButtonLink>
            </Panel>
          </div>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
            <div className="flex flex-col gap-2.5 rounded-panel bg-navy-900 p-[22px] text-white">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-[rgba(46,158,91,0.2)] px-2.5 py-1 text-xs font-semibold text-[#9BE2B5]">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-success-dot" />
                {company.publication.label}
              </span>
              <p className="text-sm leading-[1.55] text-white/82">{company.publication.text}</p>
            </div>
            <Panel as="div" className="flex flex-col gap-2.5 p-[22px]">
              <h2 className="font-display text-base font-bold tracking-[-0.02em]">Tu rol</h2>
              <p className="text-sm leading-[1.55] text-ink">{canEdit ? copy.roleText.admin : copy.roleText.operator}</p>
              {canEdit ? (
                <Link href={links.users} className="self-start text-sm font-semibold">
                  Gestionar usuarios
                </Link>
              ) : null}
            </Panel>
          </aside>
        </div>
      </PageBody>
    </>
  );
}

function LegalItem({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{term}</dt>
      <dd className="mt-1 text-[15px] font-semibold">{value}</dd>
    </div>
  );
}
