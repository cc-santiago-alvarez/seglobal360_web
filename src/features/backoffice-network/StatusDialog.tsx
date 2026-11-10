"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { actionClass } from "./ui";

/** Máximo de caracteres de un motivo, como en el backend. */
export const reasonMaxLength = 500;

type Props = {
  title: string;
  help: string;
  /** Etiqueta del motivo; sin ella, la acción no pide motivo. */
  reasonLabel?: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

/** Confirmación en línea de un cambio de estado, con motivo obligatorio de 1 a 500 caracteres. */
export function StatusDialog({ title, help, reasonLabel, confirmLabel, danger = false, onCancel, onConfirm }: Props) {
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [reason, setReason] = useState("");
  const [tried, setTried] = useState(false);
  const showError = tried && reason.trim() === "";

  useEffect(() => {
    sectionRef.current?.focus();
  }, []);

  function confirm() {
    if (reasonLabel && reason.trim() === "") {
      setTried(true);
      return;
    }
    onConfirm(reasonLabel ? reason.trim() : "");
  }

  return (
    <section
      ref={sectionRef}
      role="alertdialog"
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-help`}
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel();
      }}
      className={cn(
        "flex flex-col gap-3.5 rounded-panel border bg-white px-6 py-[22px] shadow-[0_12px_32px_rgba(11,27,51,0.08)]",
        danger ? "border-[#E8B4AE]" : "border-line-warm",
      )}
    >
      <div>
        <h2 id={`${id}-title`} className="m-0 font-display text-lg font-bold tracking-[-0.02em]">
          {title}
        </h2>
        <p id={`${id}-help`} className="mt-1.5 mb-0 text-sm leading-[1.55] text-subtle">
          {help}
        </p>
      </div>
      {reasonLabel ? (
        <label className="flex flex-col gap-2">
          <span className="flex justify-between gap-3">
            <span className="text-sm font-semibold">
              {reasonLabel} <span className="font-normal text-subtle">(obligatorio)</span>
            </span>
            <span className="text-xs text-subtle">
              {reason.length} / {reasonMaxLength}
            </span>
          </span>
          <textarea
            rows={3}
            maxLength={reasonMaxLength}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            aria-invalid={showError}
            aria-describedby={showError ? `${id}-error` : undefined}
            className={cn(
              "resize-y rounded-field border bg-white px-3.5 py-3 font-sans text-[15px] leading-normal font-medium text-navy-900",
              showError ? "border-danger-fg" : "border-line-strong",
            )}
          />
          {showError ? (
            <span id={`${id}-error`} role="alert" className="text-[13px] font-medium text-danger-fg">
              Escribe el motivo para continuar.
            </span>
          ) : null}
        </label>
      ) : null}
      <div className="flex flex-wrap justify-end gap-2.5">
        <button type="button" onClick={onCancel} className={actionClass("outline")}>
          Volver
        </button>
        <button
          type="button"
          onClick={confirm}
          className={cn(
            "lift inline-flex min-h-11 items-center rounded-btn border-0 px-5 text-sm font-semibold text-white",
            danger ? "bg-danger-fg" : "bg-navy-900",
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </section>
  );
}
