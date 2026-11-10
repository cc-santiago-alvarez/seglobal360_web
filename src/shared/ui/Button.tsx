import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

/**
 * gold: el paso que avanza el flujo (una sola por vista). navy: crear cuenta o confirmar.
 * outline: alternativa. ghost: texto que navega. danger: acción destructiva.
 */
export type ButtonVariant = "gold" | "navy" | "outline" | "ghost" | "danger";
export type ButtonSize = "lg" | "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2.5 font-semibold whitespace-nowrap no-underline disabled:cursor-not-allowed disabled:bg-line! disabled:text-faint! disabled:shadow-none! disabled:filter-none!";

const variants: Record<ButtonVariant, string> = {
  gold: "lift border-0 bg-gold-500 text-navy-950! hover:text-navy-950!",
  navy: "lift border-0 bg-navy-900 text-white! hover:text-white!",
  outline: "lift border border-[rgba(11,27,51,0.14)] bg-white text-navy-900! hover:text-navy-900!",
  ghost: "link-quiet border-0 bg-transparent px-1! text-navy-900!",
  danger: "lift border border-danger-fg/30 bg-white text-danger-fg! hover:text-danger-fg!",
};

const sizes: Record<ButtonSize, string> = {
  lg: "min-h-[52px] rounded-btn-lg px-5 text-[15px]",
  md: "min-h-12 rounded-btn px-[22px] text-[15px]",
  sm: "min-h-10 rounded-btn px-4 text-[13px]",
};

/** Clases de un botón, para usarlas también en un `<a>` o un `<summary>`. */
export function buttonClass(variant: ButtonVariant = "navy", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize };

/** Botón nativo con las variantes del sistema. */
export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize };

/** Enlace con aspecto de botón. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
