import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

/** Tabla dentro de una caja con desplazamiento horizontal en pantallas estrechas. */
export function Table({ minWidth = 860, className, ...props }: ComponentProps<"table"> & { minWidth?: number }) {
  return (
    <div className="relative overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        style={{ minWidth }}
        {...props}
      />
    </div>
  );
}

/** Encabezado de columna. */
export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line px-4 py-3.5 text-left text-[13px] font-semibold tracking-[0.01em] text-subtle first:pl-6 last:pr-6",
        className,
      )}
      {...props}
    />
  );
}

/** Celda de cuerpo. */
export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td className={cn("border-b border-line-soft px-4 py-[18px] align-middle first:pl-6 last:pr-6", className)} {...props} />
  );
}

/** Pie de un listado: página actual y orden. */
export function TableFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3.5 text-[13px] text-subtle",
        className,
      )}
    >
      {children}
    </div>
  );
}
