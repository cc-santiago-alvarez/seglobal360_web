import { ArrowLeft, Search } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

/** Variantes de los botones de 44 px de las pantallas de red. */
export type ActionVariant = "primary" | "navy" | "danger" | "outline";

const actionVariants: Record<ActionVariant, string> = {
  primary: "border-gold-500 bg-gold-500 text-navy-950 hover:text-navy-950",
  navy: "border-navy-900 bg-navy-900 text-white hover:text-white",
  danger: "border-[#E8B4AE] bg-white text-danger-fg hover:text-danger-fg",
  outline: "border-line-strong bg-white text-navy-900 hover:text-navy-900",
};

/** Clases de un botón de acción de 44 px (`compact` = 16 px de relleno lateral). */
export function actionClass(variant: ActionVariant, compact = false, className?: string): string {
  return cn(
    "lift inline-flex min-h-11 items-center justify-center gap-2 rounded-btn border text-sm font-semibold whitespace-nowrap no-underline disabled:cursor-not-allowed disabled:opacity-60",
    compact ? "px-4" : "px-[18px]",
    actionVariants[variant],
    className,
  );
}

/** Clases del botón de una fila: dorado suave cuando pide revisión. */
export function rowActionClass(highlight: boolean): string {
  return cn(
    "lift inline-flex min-h-10 items-center rounded-btn border px-4 text-[13px] font-semibold whitespace-nowrap text-navy-900 no-underline hover:text-navy-900",
    highlight ? "border-gold-500 bg-selected" : "border-line-strong bg-white",
  );
}

/** Celda de los listados de red (16 px de alto de relleno). */
export function Td({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("border-b border-line-soft px-4 py-4 first:pl-6 last:pr-6", className)} {...props} />;
}

/** Clases de las etiquetas de los campos de 44 px. */
export const labelTextClass = "text-[13px] font-semibold";

/** Clases de un control de formulario de 44 px. */
export const controlClass =
  "min-h-11 w-full rounded-field border border-line-strong bg-white px-3.5 font-sans text-sm font-medium text-navy-900 placeholder:text-faint disabled:bg-ivory disabled:text-subtle aria-[invalid=true]:border-danger-fg";

/** Mensaje de error de un campo. */
export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <span id={id} role="alert" className="text-xs text-danger-fg">
      {children}
    </span>
  );
}

type SearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

/** Buscador de 44 px con lupa, para la cabecera de un listado. */
export function SearchField({ label, placeholder, value, onChange }: SearchFieldProps) {
  return (
    <label className="flex min-h-11 min-w-[260px] items-center gap-2.5 rounded-btn border border-line-warm bg-white px-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-500 max-[340px]:min-w-0">
      <Search size={16} strokeWidth={2} aria-hidden="true" className="shrink-0 text-subtle" />
      <span className="visually-hidden">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-auto border-0 bg-transparent font-sans text-sm font-medium text-navy-900 outline-none placeholder:text-faint focus-visible:outline-none"
      />
    </label>
  );
}

/** Botón «Volver a …» de la cabecera de un detalle. */
export function BackButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lift inline-flex min-h-10 items-center gap-2 self-start rounded-btn border border-line-strong bg-white pr-3.5 pl-2.5 text-[13px] font-semibold text-navy-900"
    >
      <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
      {children}
    </button>
  );
}

/** Dato con etiqueta para una lista de definiciones. */
export interface Fact {
  label: string;
  value: React.ReactNode;
}

/** Rejilla de datos (`<dl>`) de columnas de al menos 200 px. */
export function FactGrid({ facts, className }: { facts: Fact[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-6 text-sm", className)}>
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="text-xs text-subtle">{fact.label}</dt>
          <dd className="mt-1 font-semibold break-words">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Entrada del historial de un detalle. */
export interface HistoryEntry {
  id: string;
  title: string;
  meta: string;
  note: string;
}

/** Panel «Historial» con un punto dorado por entrada, de la más reciente a la más antigua. */
export function HistoryPanel({ entries }: { entries: HistoryEntry[] }) {
  return (
    <section aria-label="Historial" className="min-w-0 flex-[1_1_300px] rounded-panel border border-[#E9E6DE] bg-white p-6">
      <h2 className="m-0 font-display text-lg font-bold tracking-[-0.02em]">Historial</h2>
      <ol className="mt-3.5 flex flex-col gap-3.5">
        {entries.map((entry) => (
          <li key={entry.id} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-gold-500" />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{entry.title}</span>
              <span className="text-[13px] text-subtle">{entry.meta}</span>
              <span className="text-[13px] leading-normal text-ink">{entry.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Tono de un aviso tras una acción: verde si salió bien, arena si restringe. */
export type NoticeTone = "ok" | "warn";

/** Aviso de resultado de una acción. */
export function Notice({ tone, children }: { tone: NoticeTone; children: React.ReactNode }) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-[14px] px-[18px] py-3.5 text-sm font-medium",
        tone === "ok" ? "bg-success-bg text-[#154F2E]" : "bg-sand text-warn-ink",
      )}
    >
      {children}
    </div>
  );
}

/** Código de un corredor en un recuadro gris. */
export function CodeChip({ code, large = false }: { code: string; large?: boolean }) {
  return (
    <span
      className={cn(
        "bg-surface-muted font-display font-bold tracking-[0.06em] whitespace-nowrap",
        large ? "rounded-lg px-2.5 py-1 text-[13px]" : "rounded-lg px-2 py-1 text-xs",
      )}
    >
      {code}
    </span>
  );
}

/** Etiquetas en píldoras grises (categorías, monedas, transportes). */
export function TagList({ tags, strong = false }: { tags: string[]; strong?: boolean }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn("rounded-full bg-[#F3F1EB] px-2.5 py-1 text-[13px]", strong ? "font-semibold" : "font-medium")}
        >
          {tag}
        </span>
      ))}
    </span>
  );
}

/** Monograma cuadrado navy con letras doradas (logotipo de un proveedor). */
export function Monogram({ text, large = false }: { text: string; large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center bg-navy-900 font-display font-bold text-gold-300",
        large ? "size-[52px] rounded-[14px] text-[17px]" : "size-9 rounded-[10px] text-xs",
      )}
    >
      {text}
    </span>
  );
}

/** Clases de un panel blanco de 24 px de relleno. */
export const panelPadded = "min-w-0 rounded-panel border border-[#E9E6DE] bg-white p-6";

/** Clases del título de un panel. */
export const panelTitle = "m-0 font-display text-lg font-bold tracking-[-0.02em]";

/** Encabezado de columna de las tablas del detalle de un corredor (12 px de relleno lateral). */
export function DetailTh({ compact = false, className, ...props }: ComponentProps<"th"> & { compact?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line px-3 text-left text-[13px] font-semibold tracking-[0.01em] text-subtle first:pl-6 last:pr-6",
        compact ? "py-2.5" : "py-3",
        className,
      )}
      {...props}
    />
  );
}

/** Celda de las tablas del detalle de un corredor. */
export function DetailTd({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("border-b border-line-soft px-3 py-3.5 first:pl-6 last:pr-6", className)} {...props} />;
}
