"use client";

import { cn } from "@/shared/lib/cn";

export type Option<T extends string> = { id: T; label: React.ReactNode };

type SegmentedProps<T extends string> = {
  label: string;
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** Selector de modo: el segmento activo es blanco sobre crema. */
export function Segmented<T extends string>({ label, options, value, onChange, className }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex gap-1 rounded-2xl bg-cream p-1", className)}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-10 rounded-xl border-0 px-3.5 text-sm font-semibold text-navy-900",
              active ? "bg-white shadow-segment" : "bg-transparent",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Clases de un chip: navy cuando está activo. */
export function chipClass(active: boolean, className?: string) {
  return cn(
    "min-h-9 rounded-full border px-3 text-[13px] font-medium transition-colors hover:border-navy-900",
    active ? "border-navy-900 bg-navy-900 text-white" : "border-[rgba(11,27,51,0.14)] bg-white text-navy-900",
    className,
  );
}

type FilterPillsProps<T extends string> = {
  label: string;
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** Filtro de un solo valor en píldoras de 40 px, como los de estado de los listados. */
export function FilterPills<T extends string>({ label, options, value, onChange, className }: FilterPillsProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-[13px] font-semibold transition-colors",
              active ? "border-navy-900 bg-navy-900 text-white" : "border-line-strong bg-white text-navy-900 hover:border-navy-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
