import { Lock } from "lucide-react";
import Link from "next/link";
import { clientStage } from "@/features/client/model";
import { companyStatus, companyType } from "@/features/company/model";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import { countryName } from "@/shared/ui/Flag";
import { StatusPill } from "@/shared/ui/StatusPill";
import { CompanyContactForm, CompanyProfileForm } from "./CompanyForms";
import { company, session } from "./fixtures";
import { formatDate } from "./format";
import { autoGrid, headerClass, mainClass, panelTitle } from "./ui";

const roleText = {
  admin: "puedes editar los datos de la empresa, invitar usuarios y responder cotizaciones.",
  operator: "puedes crear solicitudes y conversar con tu asesor. Los datos de la empresa los edita un administrador.",
} as const;

/** Pantalla «Mi empresa»: datos legales, contacto, perfil comercial, etapa y rol de quien la ve. */
export function CompanyOverview() {
  const canEdit = session.canEditCompany;
  const status = companyStatus[company.status];
  const stage = clientStage[company.stage];
  const legal = [
    { label: "Documento", value: company.documentLabel },
    { label: "País", value: countryName[company.country] },
    { label: "Tipo", value: companyType[company.type] },
    { label: "Validada", value: company.validatedAt ? formatDate(company.validatedAt) : "—" },
  ];

  return (
    <>
      <header className={headerClass}>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">Mi empresa</h1>
          <StatusPill tone={status.tone} size="md">
            {status.label}
          </StatusPill>
        </div>
        <p className="mt-2 mb-0 text-[15px] text-subtle">Los datos con los que tu empresa opera en SEGlobal 360.</p>
      </header>

      <main className={cn(mainClass, "flex flex-wrap items-start gap-6")}>
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
          {canEdit ? null : (
            <div role="status" className="flex items-center gap-3 rounded-[14px] bg-neutral-bg px-[18px] py-3.5 text-sm text-ink">
              <Lock size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
              Solo un administrador de tu empresa puede editar estos datos.
            </div>
          )}

          <section aria-labelledby="legal-titulo" className="rounded-panel border border-[#E9E6DE] bg-white px-[26px] py-6">
            <h2 id="legal-titulo" className={panelTitle}>
              Datos legales
            </h2>
            <dl className={cn(autoGrid[200], "mt-[18px] mb-0 gap-x-6 gap-y-[18px]")}>
              <div className="col-span-full">
                <dt className="text-xs text-subtle">Razón social</dt>
                <dd className="mt-1 mb-0 text-base font-semibold">{company.legalName}</dd>
              </div>
              {legal.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-subtle">{item.label}</dt>
                  <dd className="mt-1 mb-0 text-[15px] font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 mb-0 flex items-start gap-2.5 border-t border-line pt-4 text-[13px] leading-[1.55] text-subtle">
              <Lock size={16} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
              El documento y el país no se pueden cambiar. Para corregir la razón social, escríbele a tu asesor.
            </p>
          </section>

          <CompanyContactForm company={company} canEdit={canEdit} />
          <CompanyProfileForm company={company} canEdit={canEdit} />
        </div>

        <aside className="flex flex-[1_1_300px] flex-col gap-4">
          <div className="flex flex-col gap-2.5 rounded-panel bg-navy-900 p-[22px] text-white">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-semibold",
                company.stage === "consolidated" ? "bg-[rgba(46,158,91,0.2)] text-[#9BE2B5]" : "bg-white/10 text-white/80",
              )}
            >
              <span
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", company.stage === "consolidated" ? "bg-success-dot" : "bg-neutral-dot")}
              />
              Cliente {stage.label.toLowerCase()}
            </span>
            <p className="m-0 text-sm leading-[1.55] text-white/82">
              {company.stage === "consolidated" && company.consolidatedAt
                ? `Desde el ${formatDate(company.consolidatedAt)}, cuando aceptaste tu primera cotización con SEGlobal 360.`
                : "Tu empresa se consolida cuando aceptas tu primera cotización con SEGlobal 360."}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 rounded-panel border border-[#E9E6DE] bg-white p-[22px]">
            <h2 className="m-0 font-display text-base font-bold tracking-[-0.02em]">Tu rol</h2>
            <p className="m-0 text-sm leading-[1.55] text-ink">
              {session.roleLabel}: {roleText[session.role]}
            </p>
            {canEdit ? (
              <Link href={routes.client.users} className="text-sm font-semibold">
                Gestionar usuarios
              </Link>
            ) : null}
          </div>
        </aside>
      </main>
    </>
  );
}
