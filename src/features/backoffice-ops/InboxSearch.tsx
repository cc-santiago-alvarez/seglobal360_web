import { Search } from "lucide-react";

/** Buscador de la bandeja por código de solicitud, de cotización o empresa. */
export function InboxSearch() {
  return (
    <label className="flex min-h-11 min-w-[min(280px,100%)] items-center gap-2.5 rounded-btn border border-line-warm bg-white px-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-500">
      <Search size={16} strokeWidth={2} aria-hidden="true" className="shrink-0 text-subtle" />
      <span className="visually-hidden">Buscar</span>
      <input
        type="search"
        placeholder="Buscar SOL-, COT-, empresa…"
        className="min-w-0 flex-auto border-0 bg-transparent font-sans text-sm font-medium text-navy-900 outline-none placeholder:text-faint"
      />
    </label>
  );
}
