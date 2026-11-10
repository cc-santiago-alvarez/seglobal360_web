import { ArrowLeftRight } from "lucide-react";
import { countryName, Flag } from "@/shared/ui/Flag";
import type { RouteDirection } from "./fixtures";
import { routeEnds } from "./search";

type Props = { direction: RouteDirection; onSwap: () => void };

/** Ruta CO ⇄ CR con el botón que invierte origen y destino. */
export function RouteToggle({ direction, onSwap }: Props) {
  const [from, to] = routeEnds(direction);
  return (
    <div
      role="group"
      aria-label="Ruta"
      className="flex min-h-12 items-center gap-1.5 rounded-2xl border border-[rgba(11,27,51,0.10)] pr-1 pl-3"
    >
      <span className="inline-flex items-center gap-[7px] text-sm font-semibold whitespace-nowrap">
        <Flag code={from} />
        {countryName[from]}
      </span>
      <button
        type="button"
        onClick={onSwap}
        aria-label="Invertir la ruta"
        className="grid size-10 place-items-center rounded-field border border-[rgba(11,27,51,0.12)] bg-white p-0 text-navy-900 transition-colors hover:border-navy-900"
      >
        <ArrowLeftRight size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      <span className="inline-flex items-center gap-[7px] pr-2 text-sm font-semibold whitespace-nowrap">
        <Flag code={to} />
        {countryName[to]}
      </span>
    </div>
  );
}
