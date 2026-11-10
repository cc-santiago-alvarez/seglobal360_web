import { cn } from "@/shared/lib/cn";
import { buttonClass } from "@/shared/ui/Button";

/** Variantes de botón del portal: las del kit y el rojo sólido de las confirmaciones destructivas. */
export type PortalButtonVariant = "gold" | "navy" | "outline" | "danger" | "dangerSolid";

/** Alturas de botón que usan las pantallas del portal (el kit trae 40, 48 y 52 px). */
export type PortalButtonHeight = 38 | 40 | 44 | 46 | 48 | 50;

const heights: Record<PortalButtonHeight, string> = {
  38: "min-h-[38px]! rounded-full!",
  40: "",
  44: "min-h-11!",
  46: "min-h-[46px]!",
  48: "min-h-12!",
  50: "min-h-[50px]!",
};

const paddings: Record<PortalButtonHeight, string> = {
  38: "px-3.5!",
  40: "",
  44: "px-5!",
  46: "px-5!",
  48: "px-[22px]!",
  50: "px-[22px]!",
};

const texts: Record<PortalButtonHeight, string> = {
  38: "",
  40: "",
  44: "text-sm!",
  46: "text-sm!",
  48: "text-sm!",
  50: "text-[15px]!",
};

type Options = {
  /** Relleno horizontal, con `!`, cuando difiere del de la altura. */
  padding?: string;
  /** Tamaño de letra, con `!`, cuando difiere del de la altura. */
  text?: string;
  className?: string;
};

/** Clases de un botón del portal sobre `buttonClass` del kit, con la altura del diseño. */
export function portalButton(variant: PortalButtonVariant, height: PortalButtonHeight = 40, options: Options = {}) {
  const base =
    variant === "dangerSolid"
      ? buttonClass("navy", "sm", "bg-danger-fg!")
      : buttonClass(variant, "sm", variant === "outline" ? "border-line-strong!" : undefined);
  return cn(
    base,
    heights[height],
    options.padding ?? paddings[height],
    options.text ?? texts[height],
    options.className,
  );
}

/** Rejilla fluida de columnas de un ancho mínimo, como `repeat(auto-fit, minmax(…))`. */
export const autoGrid = {
  130: "grid grid-cols-[repeat(auto-fit,minmax(min(130px,100%),1fr))]",
  140: "grid grid-cols-[repeat(auto-fit,minmax(min(140px,100%),1fr))]",
  150: "grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))]",
  180: "grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))]",
  200: "grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))]",
  220: "grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))]",
  240: "grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))]",
  260: "grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))]",
  280: "grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]",
} as const;

/** Título de sección de 18 px en Montserrat de los paneles del portal. */
export const panelTitle = "m-0 font-display text-lg font-bold tracking-[-0.02em]";

/** Encabezado de pantalla del portal sin acciones alineadas abajo (el de `PageHeader` las alinea al pie). */
export const headerClass = "px-10 pt-7 max-[600px]:px-4";

/** Contenido de pantalla del portal con los márgenes del diseño. */
export const mainClass = "px-10 pt-6 pb-14 max-[600px]:px-4";

/** Migas de pan del encabezado: «Solicitudes / …». */
export const breadcrumbClass = "flex gap-2 text-[13px] text-subtle";
