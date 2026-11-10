import { cn } from "@/shared/lib/cn";

/** Chip de vidrio (un `<li>`) sobre la foto de portada: blanco al 12 %, borde al 16 % y desenfoque. */
export function GlassChip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <li
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-field border border-white/16 bg-white/12 px-3 text-sm text-white backdrop-blur-[8px]",
        className,
      )}
    >
      {children}
    </li>
  );
}
