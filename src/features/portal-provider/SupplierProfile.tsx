"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageIcon, Trash, Upload } from "lucide-react";
import { providerStatus } from "@/features/provider/model";
import { cn } from "@/shared/lib/cn";
import { routes, slug } from "@/shared/lib/routes";
import { Button, ButtonLink } from "@/shared/ui/Button";
import { Field, Select, TextArea, TextInput } from "@/shared/ui/Field";
import { countryName, type CountryCode } from "@/shared/ui/Flag";
import { PageBody } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import {
  dispatchOptions,
  maxPhotos,
  sellsToOptions,
  supplierCategories,
  supplierProfile as profile,
  supplierTypes,
  type ProfilePhoto,
  type ProfileStatus,
} from "./fixtures";
import {
  Checklist,
  ChipToggles,
  CountedLabel,
  filePickerClass,
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

const categoryOptions: ReadonlyArray<{ id: string; label: string }> = supplierCategories.map((category) => ({
  id: category,
  label: category,
}));
const sellsToChoices = sellsToOptions.map((code) => ({ id: code, label: countryName[code] }));
const photoTints = ["bg-[#E7E3DA]", "bg-surface-muted", "bg-line-soft", "bg-[#E9E5DC]"];
const fieldGrid = "grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-5 gap-y-[18px]";

/** Perfil del proveedor mayorista: formulario, fotos, checklist y vista previa de la tarjeta. */
export function SupplierProfile({ initialStatus }: { initialStatus: ProfileStatus }) {
  const flow = useProfileFlow(initialStatus);
  const logo = useLocalImage();
  const [name, setName] = useState(profile.displayName);
  const [summary, setSummary] = useState(profile.summary);
  const [description, setDescription] = useState(profile.description);
  const [supplierType, setSupplierType] = useState(profile.supplierType);
  const [dispatchFrom, setDispatchFrom] = useState(profile.dispatchFrom);
  const [categories, setCategories] = useState<string[]>(profile.categories);
  const [sellsTo, setSellsTo] = useState<CountryCode[]>(profile.sellsTo);
  const [lines, setLines] = useState<string[]>(profile.productLines);
  const [minOrder, setMinOrder] = useState(String(profile.minOrderUsd));
  const [photos, setPhotos] = useState<ProfilePhoto[]>(profile.photos);
  const nextPhotoId = useRef(profile.photos.length + 1);

  const checks: ProfileCheck[] = [
    { label: "Nombre visible", ok: name.trim() !== "" },
    { label: "Resumen", ok: summary.trim() !== "" },
    { label: "Descripción", ok: description.trim() !== "" },
    { label: "Despacha desde y vende a", ok: sellsTo.length > 0 },
    { label: "Al menos una categoría de producto", ok: categories.length > 0 },
    { label: "Pedido mínimo", ok: Number(minOrder) > 0 },
  ];
  const flagged = (label: string) => flow.errors.includes(label);

  function edit<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      flow.touch();
    };
  }

  function addPhotos(files: FileList | null) {
    const room = maxPhotos - photos.length;
    const added = Array.from(files ?? [])
      .slice(0, room)
      .map((file) => ({ photoId: `photo-${nextPhotoId.current++}`, caption: "", url: URL.createObjectURL(file) }));
    setPhotos([...photos, ...added]);
  }

  function removePhoto(photo: ProfilePhoto) {
    if (photo.url) URL.revokeObjectURL(photo.url);
    setPhotos(photos.filter((other) => other.photoId !== photo.photoId));
  }

  const status = providerStatus[flow.status];
  const morePhotos = photos.length - 3;

  return (
    <>
      <StatusHeader
        title="Perfil de proveedor"
        status={
          <StatusPill tone={status.tone} size="md">
            {status.label}
          </StatusPill>
        }
        description="Así te presentas a las empresas en el marketplace. Los contactos directos nunca se publican."
        actions={
          <>
            <ButtonLink href={routes.provider(slug(profile.displayName))} variant="outline" size="md">
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
              <div className={fieldGrid}>
                <Field label="Sitio web">
                  <TextInput type="url" placeholder="https://" defaultValue={profile.website} />
                </Field>
                <Field
                  label={
                    <>
                      Tipo de proveedor
                      <Req />
                    </>
                  }
                >
                  <Select value={supplierType} onChange={(event) => edit(setSupplierType)(event.target.value)}>
                    {supplierTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Años en el mercado">
                  <TextInput type="number" min={0} max={200} defaultValue={profile.yearsInMarket} />
                </Field>
              </div>
            </ProfileFieldset>

            <ProfileFieldset legend="Fotos de lo que vendes" disabled={flow.locked} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="max-w-[560px] text-sm leading-[1.55] text-subtle">
                  Muestra los productos que manejas. Las empresas las ven en tu perfil del marketplace y la principal
                  aparece en tu tarjeta.
                </p>
                <span className="text-xs text-subtle">
                  {photos.length} de {maxPhotos}
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3.5">
                {photos.map((photo, index) => {
                  const isMain = index === 0;
                  return (
                    <div key={photo.photoId} className="flex flex-col gap-2">
                      <div
                        className={cn(
                          "relative aspect-[4/3] overflow-hidden rounded-field",
                          photoTints[index % photoTints.length],
                          isMain && "ring-2 ring-gold-500",
                        )}
                      >
                        {photo.url ? (
                          <Image src={photo.url} alt={photo.caption} fill sizes="200px" className="object-cover" />
                        ) : (
                          <span aria-hidden="true" className="grid size-full place-items-center text-neutral-dot">
                            <ImageIcon size={30} strokeWidth={1.4} />
                          </span>
                        )}
                        {isMain ? (
                          <span className="absolute top-1.5 left-1.5 rounded-full bg-gold-500 px-2 py-0.5 text-[11px] font-bold text-navy-950">
                            Principal
                          </span>
                        ) : null}
                      </div>
                      <label className="flex">
                        <span className="visually-hidden">Producto de la foto {index + 1}</span>
                        <input
                          type="text"
                          value={photo.caption}
                          placeholder="¿Qué producto es?"
                          onChange={(event) =>
                            setPhotos(
                              photos.map((other) =>
                                other.photoId === photo.photoId ? { ...other, caption: event.target.value } : other,
                              ),
                            )
                          }
                          className="min-h-[38px] w-full rounded-[10px] border border-line-warm bg-white px-2.5 text-[13px] font-medium text-navy-900 placeholder:text-faint disabled:bg-ivory"
                        />
                      </label>
                      <div className="flex items-center gap-1">
                        {isMain ? (
                          <span className="flex-auto pl-1 text-xs text-subtle">Se ve en tu tarjeta</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPhotos([photo, ...photos.filter((other) => other.photoId !== photo.photoId)])}
                            className="min-h-9 flex-auto rounded-full border border-line-strong bg-white px-2 text-xs font-semibold text-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Hacer principal
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label={`Quitar la foto ${index + 1}`}
                          onClick={() => removePhoto(photo)}
                          className="grid size-9 shrink-0 place-items-center rounded-full bg-ivory text-danger-fg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash size={15} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {photos.length < maxPhotos ? (
                  <label
                    className={cn(
                      "relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-field border-[1.5px] border-dashed border-gold-500 bg-selected p-2 text-center text-xs font-semibold text-warn-ink",
                      filePickerClass,
                    )}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(event) => {
                        addPhotos(event.target.files);
                        event.target.value = "";
                      }}
                      className="absolute size-px opacity-0"
                    />
                    <Upload size={22} strokeWidth={1.75} aria-hidden="true" />
                    Agregar fotos
                  </label>
                ) : null}
              </div>
              <p className="text-xs leading-normal text-subtle">
                JPG, PNG o WebP de hasta 5 MB. Sin precios ni datos de contacto en las fotos.
              </p>
            </ProfileFieldset>

            <ProfileFieldset legend="Categorías y cobertura" disabled={flow.locked} className="flex flex-col gap-5">
              {flow.locked ? <ReadOnlyNote /> : null}
              <ChipToggles
                label="Categorías de producto"
                options={categoryOptions}
                selected={categories}
                onToggle={(id) => edit(setCategories)(toggleIn(categories, id))}
                error={flagged("Al menos una categoría de producto") && categories.length === 0}
                hint="Las empresas te encuentran por estas categorías en el marketplace."
              />
              <TagField label="Líneas de producto" items={lines} onChange={setLines} hint="Escribe y presiona Enter para agregar." />
              <div className={fieldGrid}>
                <Field
                  label={
                    <>
                      Despacha desde
                      <Req />
                    </>
                  }
                >
                  <Select value={dispatchFrom} onChange={(event) => edit(setDispatchFrom)(event.target.value)}>
                    {dispatchOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </Field>
                <ChipToggles
                  label="Vende a"
                  options={sellsToChoices}
                  selected={sellsTo}
                  onToggle={(id) => edit(setSellsTo)(toggleIn(sellsTo, id))}
                  error={flagged("Despacha desde y vende a") && sellsTo.length === 0}
                />
              </div>
            </ProfileFieldset>

            <ProfileFieldset
              legend="Condiciones comerciales"
              disabled={flow.locked}
              className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5"
            >
              <Field
                label={
                  <>
                    Pedido mínimo (USD)
                    <Req />
                  </>
                }
              >
                <TextInput
                  type="number"
                  required
                  min={0}
                  step={100}
                  value={minOrder}
                  onChange={(event) => edit(setMinOrder)(event.target.value)}
                />
              </Field>
              <Field label="Tiempo de alistamiento">
                <TextInput type="text" defaultValue={profile.leadTime} />
              </Field>
              <Field label="Garantía">
                <TextInput type="text" defaultValue={profile.warranty} />
              </Field>
              <Field label="Certificados y registros">
                <TextInput
                  type="text"
                  defaultValue={profile.certificates}
                  placeholder="Registro sanitario, certificado de origen…"
                />
              </Field>
            </ProfileFieldset>

            <ProfileFieldset legend="Contacto comercial" disabled={flow.locked} className="flex flex-col gap-[18px]">
              <PrivateNote>Solo lo ve el equipo de SEGlobal 360 para coordinar pedidos.</PrivateNote>
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
            <Checklist checks={checks} errors={flow.errors}>
              <p className="mt-3.5 flex items-center gap-2.5 border-t border-line pt-3 text-[13px] text-subtle">
                <span aria-hidden="true" className="size-[18px] shrink-0 rounded-full border-[1.5px] border-dashed border-gold-500" />
                Recomendado: 3 fotos o más de tus productos
              </p>
            </Checklist>
            <PreviewCard>
              <div aria-hidden="true" className="grid h-[120px] grid-cols-[2fr_1fr] grid-rows-2 gap-[3px] overflow-hidden rounded-field">
                <MosaicCell photo={photos[0]} className="row-span-2 bg-[#E7E3DA]" withIcon />
                <MosaicCell photo={photos[1]} className="bg-surface-muted" />
                <MosaicCell photo={photos[2]} className="bg-line-soft" more={morePhotos} />
              </div>
              <PreviewIdentity
                monogram={profile.monogram}
                logoUrl={logo.url}
                name={name.trim() || "Sin nombre"}
                subtitle={`${supplierType} · ${dispatchFrom}`}
              />
              <PreviewSummary summary={summary} categories={categories} />
            </PreviewCard>
          </aside>
        </div>
      </PageBody>
    </>
  );
}

/** Celda del mosaico de fotos de la tarjeta; la última muestra cuántas fotos quedan. */
function MosaicCell({
  photo,
  className,
  withIcon,
  more = 0,
}: {
  photo: ProfilePhoto | undefined;
  className: string;
  withIcon?: boolean;
  more?: number;
}) {
  return (
    <span className={cn("relative grid place-items-center text-neutral-dot", className)}>
      {photo?.url ? (
        <Image src={photo.url} alt="" fill sizes="160px" className="object-cover" />
      ) : withIcon ? (
        <ImageIcon size={26} strokeWidth={1.4} />
      ) : null}
      {more > 0 ? (
        <span className="absolute inset-0 grid place-items-center bg-[rgba(11,27,51,0.6)] text-xs font-semibold text-white">
          +{more}
        </span>
      ) : null}
    </span>
  );
}
