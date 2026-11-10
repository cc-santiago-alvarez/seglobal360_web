import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

type Props = ComponentProps<"div"> & { as?: "div" | "section" | "article" | "aside" };

/** Tarjeta blanca de 28 px de radio con borde suave. */
export function Card({ as: Tag = "div", className, ...props }: Props) {
  return (
    <Tag
      className={cn("min-w-0 rounded-card border border-[rgba(11,27,51,0.07)] bg-white p-7", className)}
      {...props}
    />
  );
}

/** Panel de portal: blanco, borde cálido y 24 px de radio. */
export function Panel({ as: Tag = "section", className, ...props }: Props) {
  return <Tag className={cn("min-w-0 rounded-panel border border-[#E9E6DE] bg-white", className)} {...props} />;
}

/** Etiqueta corta en dorado texto, sin mayúsculas sostenidas. */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-text", className)} {...props} />;
}

/** Título de sección en Montserrat. */
export function SectionTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("m-0 font-display text-lg font-bold tracking-[-0.02em] text-navy-900", className)}
      {...props}
    />
  );
}
