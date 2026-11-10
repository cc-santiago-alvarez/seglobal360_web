"use client";

import { useState } from "react";
import { providerStatus } from "@/features/provider/model";
import { routes, slug } from "@/shared/lib/routes";
import { Button, ButtonLink } from "@/shared/ui/Button";
import { Field, TextArea, TextInput } from "@/shared/ui/Field";
import { countryName, type CountryCode } from "@/shared/ui/Flag";
import { PageBody } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import {
  logisticsCategories,
  logisticsProfile as profile,
  operatorCountryOptions,
  providerServices,
  type ProfileStatus,
} from "./fixtures";
import {
  Checklist,
  ChipToggles,
  CountedLabel,
  LogoField,
  PreviewCard,
  PreviewIdentity,
  PreviewSummary,
  PrivateNote,
  ProfileFieldset,
  ProfileNotices,
  ProfileSteps,
  ReadOnlyNote,
  Req,
  TagField,
  toggleIn,
  useLocalImage,
  useProfileFlow,
  type ProfileCheck,
} from "./ProfileParts";
import { StatusHeader } from "./StatusHeader";

const categoryOptions: ReadonlyArray<{ id: string; label: string }> = logisticsCategories.map((category) => ({
  id: category,
  label: category,
}));
const countryChoices = operatorCountryOptions.map((code) => ({ id: code, label: countryName[code] }));
const previewService = providerServices.find((service) => service.status === "published");
const previewHref = previewService ? routes.service(slug(previewService.name)) : routes.marketplace;

/** Perfil del operador logístico: formulario, checklist y vista previa de la tarjeta. */
export function LogisticsProfile({ initialStatus }: { initialStatus: ProfileStatus }) {
  const flow = useProfileFlow(initialStatus);
  const logo = useLocalImage();
  const [name, setName] = useState(profile.displayName);
  const [summary, setSummary] = useState(profile.summary);
  const [description, setDescription] = useState(profile.description);
  const [years, setYears] = useState(String(profile.yearsInOperation));
  const [countries, setCountries] = useState<CountryCode[]>(profile.countries);
  const [categories, setCategories] = useState<string[]>(profile.categories);
  const [capabilities, setCapabilities] = useState<string[]>(profile.capabilities);
  const [certifications, setCertifications] = useState<string[]>(profile.certifications);

  const checks: ProfileCheck[] = [
    { label: "Nombre visible", ok: name.trim() !== "" },
    { label: "Resumen", ok: summary.trim() !== "" },
    { label: "Descripción", ok: description.trim() !== "" },
    { label: "Al menos un país", ok: countries.length > 0 },
    { label: "Al menos una categoría", ok: categories.length > 0 },
  ];
  const flagged = (label: string) => flow.errors.includes(label);

  function edit<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      flow.touch();
    };
  }

  const status = providerStatus[flow.status];
  const yearsLabel = years.trim() === "" ? "" : `${years} años · `;

  return (
    <>
      <StatusHeader
        title="Perfil de operador logístico"
        status={
          <StatusPill tone={status.tone} size="md">
            {status.label}
          </StatusPill>
        }
        description="Así te presentas a las empresas en el marketplace. Los contactos directos nunca se publican."
        actions={
          <>
            <ButtonLink href={previewHref} variant="outline" size="md">
              Vista previa
            </ButtonLink>
            {flow.status === "draft" ? (
              <Button variant="gold" size="md" onClick={() => flow.submit(checks)}>
                Enviar a revisión
              </Button>
            ) : null}
            {flow.status === "published" ? (
              <Button variant="navy" size="md" onClick={flow.save}>
                Guardar cambios
              </Button>
            ) : null}
          </>
        }
      />

      <PageBody>
        <ProfileSteps status={flow.status} />
        <ProfileNotices
          status={flow.status}
          review={profile.review}
          submittedNow={flow.submittedNow}
          errors={flow.errors}
          saved={flow.saved}
          onSimulateReturn={flow.simulateReturn}
        />

        <div className="flex flex-wrap items-start gap-6">
          <form onSubmit={(event) => event.preventDefault()} className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
            <ProfileFieldset legend="Presentación" disabled={flow.locked} className="flex flex-col gap-[18px]">
              <div className="flex flex-wrap items-end gap-[18px]">
                <LogoField monogram={profile.monogram} logoUrl={logo.url} onPick={logo.pick} onRemove={logo.clear} />
                <Field
                  className="flex-[1_1_260px]"
                  label={
                    <>
                      Nombre visible
                      <Req />
                    </>
                  }
                >
                  <TextInput
                    type="text"
                    required
                    maxLength={120}
                    value={name}
                    onChange={(event) => edit(setName)(event.target.value)}
                  />
                </Field>
              </div>
              <Field
                label={<CountedLabel label="Resumen" count={summary.length} max={300} />}
                hint="Aparece en tu tarjeta del marketplace."
              >
                <TextArea
                  rows={2}
                  required
                  maxLength={300}
                  value={summary}
                  onChange={(event) => edit(setSummary)(event.target.value)}
                  className="min-h-0! resize-y"
                />
              </Field>
              <Field label={<CountedLabel label="Descripción" count={description.length} max={3000} />}>
                <TextArea
                  rows={4}
                  required
                  maxLength={3000}
                  value={description}
                  onChange={(event) => edit(setDescription)(event.target.value)}
                  className="resize-y"
                />
              </Field>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-5 gap-y-[18px]">
                <Field label="Sitio web">
                  <TextInput type="url" placeholder="https://" defaultValue={profile.website} />
                </Field>
                <Field label="Años de operación">
                  <TextInput
                    type="number"
                    min={0}
                    max={200}
                    value={years}
                    onChange={(event) => edit(setYears)(event.target.value)}
                  />
                </Field>
              </div>
            </ProfileFieldset>

            <ProfileFieldset legend="Cobertura y categorías" disabled={flow.locked} className="flex flex-col gap-5">
              {flow.locked ? <ReadOnlyNote /> : null}
              <ChipToggles
                label="Países donde operas"
                options={countryChoices}
                selected={countries}
                onToggle={(id) => edit(setCountries)(toggleIn(countries, id))}
                error={flagged("Al menos un país") && countries.length === 0}
              />
              <ChipToggles
                label="Categorías de servicio"
                options={categoryOptions}
                selected={categories}
                onToggle={(id) => edit(setCategories)(toggleIn(categories, id))}
                error={flagged("Al menos una categoría") && categories.length === 0}
              />
            </ProfileFieldset>

            <ProfileFieldset
              legend="Capacidades y certificaciones"
              disabled={flow.locked}
              className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5"
            >
              <TagField
                label="Capacidades"
                items={capabilities}
                onChange={setCapabilities}
                hint="Escribe y presiona Enter para agregar. Hasta 20, de máximo 80 caracteres."
              />
              <TagField
                label="Certificaciones"
                items={certifications}
                onChange={setCertifications}
                placeholder="BASC, OEA, ISO 9001…"
                hint="Escribe y presiona Enter para agregar."
              />
            </ProfileFieldset>

            <ProfileFieldset legend="Contacto operativo" disabled={flow.locked} className="flex flex-col gap-[18px]">
              <PrivateNote>Solo lo ve el equipo de SEGlobal 360 para coordinar operaciones.</PrivateNote>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-5 gap-y-[18px]">
                <Field label="Nombre">
                  <TextInput type="text" defaultValue={profile.contact.name} />
                </Field>
                <Field label="Correo">
                  <TextInput type="email" defaultValue={profile.contact.email} />
                </Field>
                <Field label="Teléfono">
                  <TextInput type="tel" defaultValue={profile.contact.phone} />
                </Field>
              </div>
            </ProfileFieldset>
          </form>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
            <Checklist checks={checks} errors={flow.errors} />
            <PreviewCard>
              <PreviewIdentity
                monogram={profile.monogram}
                logoUrl={logo.url}
                name={name.trim() || "Sin nombre"}
                subtitle={`${yearsLabel}${profile.publishedServices} servicios`}
              />
              <PreviewSummary summary={summary} categories={categories} />
            </PreviewCard>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
