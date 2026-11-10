import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type Props = {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  onChange: (page: number) => void;
};

const square =
  "grid size-11 place-items-center rounded-field border font-sans text-sm font-semibold disabled:cursor-default disabled:text-muted-dot";

/** Paginación del listado: rango mostrado y botones de página. */
export function Pagination({ page, pageCount, from, to, total, onChange }: Props) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  return (
    <nav aria-label="Paginación" className="mt-7 flex flex-wrap items-center justify-between gap-4">
      <p className="m-0 text-sm text-subtle">
        Mostrando {from}–{to} de {total}
      </p>
      <div className="flex gap-1.5">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={cn(square, "border-line-warm bg-white text-navy-900")}
        >
          <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        {pages.map((number) => {
          const current = number === page;
          return (
            <button
              key={number}
              type="button"
              aria-current={current ? "page" : undefined}
              onClick={() => onChange(number)}
              className={cn(
                square,
                current ? "border-navy-900 bg-navy-900 text-white" : "border-line-warm bg-white text-navy-900",
              )}
            >
              {number}
            </button>
          );
        })}
        <button
          type="button"
          aria-label="Página siguiente"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className={cn(square, "border-line-warm bg-white text-navy-900")}
        >
          <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
