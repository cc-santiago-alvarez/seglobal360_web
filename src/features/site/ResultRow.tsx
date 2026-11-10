import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type Props = {
  href: string;
  initials: string;
  name: string;
  meta: string;
  tag: string;
  /** Con borde y sin recortar: la muestra suelta de la guía de estilo. */
  framed?: boolean;
};

/** Resultado del buscador: enlace completo con iniciales, nombre, detalle y categoría. */
export function ResultRow({ href, initials, name, meta, tag, framed = false }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "row-hover flex items-center gap-3.5 rounded-[14px] p-2.5 text-navy-900 no-underline",
        framed && "border border-line",
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-field bg-navy-900 font-display text-[15px] font-bold text-gold-300"
      >
        {initials}
      </span>
      <span className="flex min-w-0 flex-auto flex-col gap-0.5">
        <span className="text-[15px] font-semibold">{name}</span>
        <span className={cn("text-[13px] text-subtle", !framed && "truncate")}>{meta}</span>
      </span>
      <span
        className={cn(
          "shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-warn-ink",
          !framed && "max-[520px]:hidden",
        )}
      >
        {tag}
      </span>
    </Link>
  );
}
