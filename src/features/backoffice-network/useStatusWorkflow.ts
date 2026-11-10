"use client";

import { useState } from "react";
import { demoActor } from "./fixtures";
import type { StatusAction } from "./statusActions";
import type { HistoryEntry, NoticeTone } from "./ui";

/** Estado y motivo que una acción dejó sobre un elemento del listado. */
export interface StatusOverride<S extends string> {
  status: S;
  reason: string | null;
}

/**
 * Cambios de estado hechos en el cliente: diálogo abierto, aviso, estados nuevos e historial.
 * Sustituye a la API mientras no hay backend conectado.
 */
export function useStatusWorkflow<S extends string>() {
  const [overrides, setOverrides] = useState<Record<string, StatusOverride<S>>>({});
  const [log, setLog] = useState<Record<string, HistoryEntry[]>>({});
  const [dialog, setDialog] = useState<StatusAction<S> | null>(null);
  const [notice, setNotice] = useState<{ text: string; tone: NoticeTone } | null>(null);

  function openDialog(action: StatusAction<S>) {
    setDialog(action);
    setNotice(null);
  }

  function reset() {
    setDialog(null);
    setNotice(null);
  }

  function apply(id: string, action: StatusAction<S>, reason: string) {
    const entries = log[id] ?? [];
    const entry: HistoryEntry = {
      id: `${id}-${entries.length + 1}`,
      title: action.done,
      meta: `${demoActor.name} · ${demoActor.at}`,
      note: reason || action.after,
    };
    setOverrides({ ...overrides, [id]: { status: action.to, reason: action.reasonLabel ? reason : null } });
    setLog({ ...log, [id]: [entry, ...entries] });
    setDialog(null);
    setNotice({ text: `${action.done}. ${action.after}`, tone: action.variant === "danger" ? "warn" : "ok" });
  }

  return { overrides, log, dialog, notice, openDialog, closeDialog: () => setDialog(null), reset, apply };
}
