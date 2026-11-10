import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

const control =
  "min-h-12 w-full rounded-field border border-line-strong bg-white font-sans text-[15px] font-medium text-navy-900 placeholder:text-faint disabled:bg-ivory disabled:text-subtle";

/** Clases de un `<input>` de texto. */
export const inputClass = cn(control, "px-3.5");
/** Clases de un `<select>` nativo. */
export const selectClass = cn(control, "px-3");
/** Clases de un `<textarea>`. */
export const textareaClass = cn(control, "min-h-28 px-3.5 py-3 leading-normal");

type FieldProps = {
  label: React.ReactNode;
  optional?: boolean;
  hint?: React.ReactNode;
  hintId?: string;
  className?: string;
  children: React.ReactNode;
};

/** Etiqueta y control apilados, con texto de ayuda opcional. */
export function Field({ label, optional, hint, hintId, className, children }: FieldProps) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className="text-[13px] font-semibold">
        {label}
        {optional ? <span className="font-normal text-subtle"> (opcional)</span> : null}
      </span>
      {children}
      {hint ? (
        <span id={hintId} className="text-[13px] leading-normal text-subtle">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/** Input de texto con el estilo del sistema. */
export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...props} />;
}

/** Select nativo con el estilo del sistema. */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(selectClass, className)} {...props} />;
}

/** Área de texto con el estilo del sistema. */
export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(textareaClass, className)} {...props} />;
}
