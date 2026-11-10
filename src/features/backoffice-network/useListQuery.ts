"use client";

import { useState } from "react";
import { listQueryString, type ListQuery, type ListQuerySpec } from "./listQuery";

/**
 * Estado de los filtros y la selección de un listado, reflejado en la URL sin recargar.
 * Vuelve a `initial` cuando una navegación trae otra consulta del servidor.
 */
export function useListQuery<S extends string, T extends string>(
  spec: ListQuerySpec<S, T>,
  initial: ListQuery<S, T>,
): [ListQuery<S, T>, (patch: Partial<ListQuery<S, T>>) => void] {
  const [query, setQuery] = useState(initial);
  const [seed, setSeed] = useState(initial);
  if (seed !== initial) {
    setSeed(initial);
    setQuery(initial);
  }

  function update(patch: Partial<ListQuery<S, T>>) {
    const next = { ...query, ...patch };
    setQuery(next);
    window.history.replaceState(null, "", `${window.location.pathname}${listQueryString(spec, next)}`);
  }

  return [query, update];
}
