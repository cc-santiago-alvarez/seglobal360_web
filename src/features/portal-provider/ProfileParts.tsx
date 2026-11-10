import Image from "next/image";
import { useId, useState } from "react";
import { Check, CircleAlert, Clock, Lock, TriangleAlert, Upload, X } from "lucide-react";
import { providerStatus } from "@/features/provider/model";
import { cn } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/Card";
import { profileSteps, type ProfileReview, type ProfileStatus } from "./fixtures";

/** Requisito del checklist «Para enviar a revisión». */
export type ProfileCheck = { label: string; ok: boolean };

/** Estado del flujo de revisión del perfil: enviar, guardar y avisos. */
export function useProfileFlow(initialStatus: ProfileStatus) {
  const [status, setStatus] = useState<ProfileStatus>(initialStatus);
  const [submittedNow, setSubmittedNow] = useState(false);
  const [errors, setErrors] = useState<ReadonlyArray<string>>([]);
  const [saved, setSaved] = useState(false);

  return {
    status,
    locked: status === "in_review",
    submittedNow,
    errors,
    saved,
    /** Limpia los avisos de error y de guardado tras una edición. */
    touch() {
      setErrors([]);
      setSaved(false);
    },
    submit(checks: ReadonlyArray<ProfileCheck>) {
      const missing = checks.filter((check) => !check.ok).map((check) => check.label);
      setErrors(missing);
      if (missing.length > 0) return;
      setStatus("in_review");
      setSubmittedNow(true);
      window.scrollTo(0, 0);
    },
    save() {
      setSaved(true);
    },
    simulateReturn() {
      setStatus("draft");
      setSubmittedNow(false);
    },
  };
}

/** Imagen elegida en el navegador, previsualizada con una URL local (no se sube). */
export function useLocalImage() {
  const [url, setUrl] = useState("");
  return {
    url,
    pick(file: File | undefined) {
      if (!file) return;
      if (url) URL.revokeObjectURL(url);
      setUrl(URL.createObjectURL(file));
    },
    clear() {
      if (url) URL.revokeObjectURL(url);
      setUrl("");
    },
  };
}

/** Recorta un texto en la última palabra completa y añade puntos suspensivos. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = cut.lastIndexOf(" ");
  return `${(end > 0 ? cut.slice(0, end) : cut).replace(/[\s,.;:]+$/, "")}…`;
}

/** Asterisco de campo obligatorio. */
export function Req() {
  return (
    <>
      {" "}
      <span aria-hidden="true" className="text-danger-fg">
        *
      </span>
    </>
  );
}

/** Etiqueta obligatoria con contador de caracteres a la derecha. */
export function CountedLabel({ label, count, max }: { label: string; count: number; max: number }) {
  return (
    <span className="flex justify-between gap-3">
      <span>
        {label}
        <Req />
      </span>
      <span className="text-xs font-normal text-subtle">
        {count} / {max}
      </span>
    </span>
  );
}

/** Pasos Borrador → En revisión → Aprobado → Publicado, con el actual marcado. */
export function ProfileSteps({ status }: { status: ProfileStatus }) {
  const current = profileSteps.indexOf(status);
  return (
    <ol aria-label="Estado del perfil" className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-2.5">
      {profileSteps.map((step, index) => {
        const isCurrent = index === current;
        return (
          <li
            key={step}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "flex flex-col gap-1 rounded-[14px] border px-3.5 py-3",
              isCurrent ? "border-gold-500 bg-white" : "border-line-warm",
              index < current && "bg-[#F3F1EB]",
            )}
          >
            <span className={cn("text-xs font-semibold tracking-[0.01em]", isCurrent ? "text-gold-text" : "text-subtle")}>
              {index < current ? "Listo" : isCurrent ? "Ahora" : `Paso ${index + 1}`}
            </span>
            <span className={cn("text-sm font-semibold", index > current ? "text-subtle" : "text-navy-900")}>
              {providerStatus[step].label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const noticeTones = {
  danger: "border-[#F1C3BD] bg-danger-bg text-[#7D241B]",
  warn: "border-sand-line bg-sand text-warn-ink",
  success: "border-[#BFE3CC] bg-success-bg text-[#154F2E]",
};

function Notice({
  tone,
  role,
  icon,
  title,
  children,
}: {
  tone: keyof typeof noticeTones;
  role: "status" | "alert";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div role={role} className={cn("flex items-start gap-3.5 rounded-tile border px-5 py-4", noticeTones[tone])}>
      {icon}
      <div>
        <p className="text-[15px] font-semibold">{title}</p>
        <div className="mt-1 text-sm leading-[1.55]">{children}</div>
      </div>
    </div>
  );
}

type NoticesProps = {
  status: ProfileStatus;
  review: ProfileReview;
  submittedNow: boolean;
  errors: ReadonlyArray<string>;
  saved: boolean;
  onSimulateReturn: () => void;
};

/** Avisos del perfil: devuelto, en revisión, publicado, datos faltantes y guardado. */
export function ProfileNotices({ status, review, submittedNow, errors, saved, onSimulateReturn }: NoticesProps) {
  const bigIcon = "mt-0.5 shrink-0";
  return (
    <>
      {status === "draft" ? (
        <Notice
          tone="danger"
          role="status"
          title="Operaciones devolvió tu perfil con observaciones"
          icon={<TriangleAlert size={20} strokeWidth={1.75} aria-hidden="true" className={bigIcon} />}
        >
          “{review.returnedNote}” Corrige y envíalo de nuevo a revisión.
        </Notice>
      ) : null}
      {status === "in_review" ? (
        <Notice
          tone="warn"
          role="status"
          title="Tu perfil está en revisión"
          icon={<Clock size={20} strokeWidth={1.75} aria-hidden="true" className={bigIcon} />}
        >
          <p>
            {submittedNow ? `Lo enviaste hoy, ${review.today}.` : `Lo enviaste el ${review.submittedOn}.`} Tu perfil está en
            revisión: no se puede editar hasta que Global 360 responda. Te avisamos por correo.
          </p>
          <button
            type="button"
            onClick={onSimulateReturn}
            className="mt-2.5 min-h-9 rounded-full border border-dashed border-[#B8893E] bg-white px-3.5 text-xs font-semibold text-warn-ink"
          >
            Prototipo: simular que Global 360 pide cambios
          </button>
        </Notice>
      ) : null}
      {status === "published" ? (
        <Notice
          tone="success"
          role="status"
          title="Tu perfil está publicado"
          icon={<Check size={20} strokeWidth={2} aria-hidden="true" className={bigIcon} />}
        >
          Las empresas ya pueden verte en el marketplace. Los cambios que guardes se publican de inmediato.
        </Notice>
      ) : null}
      {errors.length > 0 ? (
        <Notice
          tone="danger"
          role="alert"
          title="Completa los datos obligatorios del perfil antes de enviarlo."
          icon={<CircleAlert size={18} strokeWidth={2.25} aria-hidden="true" className="shrink-0 text-[#B23A2E]" />}
        >
          Falta: {errors.join(", ").toLowerCase()}.
        </Notice>
      ) : null}
      {saved ? (
        <div role="status" className="rounded-[14px] bg-success-bg px-[18px] py-3.5 text-sm font-medium text-[#154F2E]">
          Cambios guardados. Ya se ven en el marketplace.
        </div>
      ) : null}
    </>
  );
}

/** Bloque del formulario del perfil: panel blanco con leyenda en Montserrat. */
export function ProfileFieldset({
  legend,
  disabled,
  className,
  children,
}: {
  legend: string;
  disabled: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset disabled={disabled} className={cn("min-w-0 rounded-panel border border-[#E9E6DE] bg-white p-[26px]", className)}>
      <legend className="px-2 font-display text-[17px] font-semibold">{legend}</legend>
      {children}
    </fieldset>
  );
}

/** Aviso de solo lectura mientras el perfil está en revisión. */
export function ReadOnlyNote() {
  return (
    <p className="flex items-center gap-2 rounded-[10px] bg-sand px-3 py-2.5 text-[13px] font-medium text-warn-ink">
      <Lock size={15} strokeWidth={1.75} aria-hidden="true" />
      Solo lectura mientras Global 360 revisa tu perfil.
    </p>
  );
}

/** Nota con candado para los datos que no se publican. */
export function PrivateNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[13px] text-subtle">
      <Lock size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      {children}
    </p>
  );
}

type ChipTogglesProps<T extends string> = {
  label: string;
  options: ReadonlyArray<{ id: T; label: string }>;
  selected: ReadonlyArray<T>;
  onToggle: (id: T) => void;
  error?: boolean;
  hint?: string;
};

/** Selección múltiple obligatoria en chips de 40 px con marca dorada. */
export function ChipToggles<T extends string>({ label, options, selected, onToggle, error, hint }: ChipTogglesProps<T>) {
  const labelId = useId();
  return (
    <div>
      <p id={labelId} className="mb-2.5 text-[13px] font-semibold">
        {label}
        <Req />
      </p>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(option.id)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-60",
                on ? "border-navy-900 bg-navy-900 font-semibold text-white" : "border-line-strong bg-white font-medium text-navy-900",
              )}
            >
              {on ? <Check size={14} strokeWidth={2.5} aria-hidden="true" className="text-gold-300" /> : null}
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] font-medium text-danger-fg">
          Elige al menos una opción.
        </p>
      ) : null}
      {hint ? <p className="mt-2 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

/** Alterna un valor dentro de una lista. */
export function toggleIn<T>(list: ReadonlyArray<T>, value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

type TagFieldProps = {
  label: string;
  items: ReadonlyArray<string>;
  onChange: (items: string[]) => void;
  hint: string;
  placeholder?: string;
  max?: number;
};

/** Lista de etiquetas libres: se agregan con Enter o coma y se quitan con la X. */
export function TagField({ label, items, onChange, hint, placeholder = "Agregar…", max = 20 }: TagFieldProps) {
  const inputId = useId();
  const hintId = useId();
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (value && !items.includes(value) && items.length < max) onChange([...items, value]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={inputId} className="text-[13px] font-semibold">
        {label}
      </label>
      <div className="flex min-h-12 flex-wrap gap-1.5 rounded-field border border-line-strong bg-white p-2 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-gold-500">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 rounded-full bg-[#F3F1EB] py-1 pr-1.5 pl-2.5 text-[13px] font-medium">
            {item}
            <button
              type="button"
              aria-label={`Quitar ${item}`}
              onClick={() => onChange(items.filter((other) => other !== item))}
              className="grid size-6 place-items-center rounded-full text-subtle disabled:cursor-not-allowed"
            >
              <X size={12} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={inputId}
          type="text"
          maxLength={80}
          value={draft}
          placeholder={placeholder}
          aria-describedby={hintId}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }
          }}
          className="min-w-[100px] flex-[1_1_120px] bg-transparent text-sm font-medium text-navy-900 outline-none placeholder:text-faint"
        />
      </div>
      <span id={hintId} className="text-xs text-subtle">
        {hint}
      </span>
    </div>
  );
}

/** Cuadro del logo: la imagen elegida o el monograma dorado sobre navy. */
export function LogoTile({ monogram, logoUrl, size }: { monogram: string; logoUrl: string; size: "lg" | "sm" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden bg-navy-900 font-display font-bold text-gold-300",
        size === "lg" ? "size-[72px] rounded-[18px] text-[22px]" : "size-11 rounded-field text-sm",
      )}
    >
      {logoUrl ? <Image src={logoUrl} alt="" fill sizes={size === "lg" ? "72px" : "44px"} className="object-cover" /> : monogram}
    </span>
  );
}

/** Clases del `<label>` que envuelve un `<input type="file">` y se ve como botón. */
export const filePickerClass =
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500";

type LogoFieldProps = {
  monogram: string;
  logoUrl: string;
  onPick: (file: File | undefined) => void;
  onRemove: () => void;
};

/** Logo del perfil con sus acciones de subir, cambiar y quitar. */
export function LogoField({ monogram, logoUrl, onPick, onRemove }: LogoFieldProps) {
  return (
    <div className="flex items-center gap-3.5">
      <LogoTile monogram={monogram} logoUrl={logoUrl} size="lg" />
      <div className="flex flex-col items-start gap-1.5">
        <label
          className={cn(
            "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-btn border border-line-strong bg-white px-4 text-[13px] font-semibold text-navy-900",
            filePickerClass,
          )}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={(event) => {
              onPick(event.target.files?.[0]);
              event.target.value = "";
            }}
            className="absolute size-px opacity-0"
          />
          <Upload size={16} strokeWidth={2} aria-hidden="true" />
          {logoUrl ? "Cambiar logo" : "Subir logo"}
        </label>
        {logoUrl ? (
          <button type="button" onClick={onRemove} className="px-0.5 py-1 text-xs font-semibold text-danger-fg">
            Quitar logo
          </button>
        ) : null}
        <span className="text-xs text-subtle">PNG, JPG o SVG cuadrado, hasta 2 MB.</span>
      </div>
    </div>
  );
}

/** Checklist de requisitos para enviar el perfil a revisión. */
export function Checklist({
  checks,
  errors,
  children,
}: {
  checks: ReadonlyArray<ProfileCheck>;
  errors: ReadonlyArray<string>;
  children?: React.ReactNode;
}) {
  return (
    <Panel as="div" className="p-[22px]">
      <h2 className="font-display text-base font-bold tracking-[-0.02em]">Para enviar a revisión</h2>
      <ul className="mt-3.5 flex flex-col gap-2.5 text-sm">
        {checks.map((check) => (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-2.5",
              !check.ok && errors.includes(check.label) ? "text-danger-fg" : "text-navy-900",
            )}
          >
            {check.ok ? (
              <Check size={18} strokeWidth={2.25} aria-hidden="true" className="shrink-0 text-success-fg" />
            ) : (
              <CircleAlert size={18} strokeWidth={2.25} aria-hidden="true" className="shrink-0 text-[#B23A2E]" />
            )}
            <span className="visually-hidden">{check.ok ? "Completo:" : "Falta:"}</span>
            {check.label}
          </li>
        ))}
      </ul>
      {children}
    </Panel>
  );
}

/** Vista previa de la tarjeta del marketplace. */
export function PreviewCard({ children }: { children: React.ReactNode }) {
  return (
    <Panel as="div" className="flex flex-col gap-3 p-[22px]">
      <p className="text-xs font-semibold tracking-[0.01em] text-subtle">Así se ve tu tarjeta</p>
      {children}
    </Panel>
  );
}

/** Logo, nombre y subtítulo de la tarjeta. */
export function PreviewIdentity({
  monogram,
  logoUrl,
  name,
  subtitle,
}: {
  monogram: string;
  logoUrl: string;
  name: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <LogoTile monogram={monogram} logoUrl={logoUrl} size="sm" />
      <span className="flex min-w-0 flex-col">
        <span className="font-display text-base font-semibold">{name}</span>
        <span className="text-xs text-subtle">{subtitle}</span>
      </span>
    </div>
  );
}

/** Resumen y hasta tres categorías de la tarjeta. */
export function PreviewSummary({ summary, categories }: { summary: string; categories: ReadonlyArray<string> }) {
  const chips = categories.length > 0 ? categories.slice(0, 3) : ["Sin categoría"];
  return (
    <>
      <p className="text-[13px] leading-[1.55] text-ink">{truncate(summary, 100)}</p>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <span key={chip} className="rounded-full bg-[#F3F1EB] px-2.5 py-1 text-xs font-medium">
            {chip}
          </span>
        ))}
      </div>
    </>
  );
}
