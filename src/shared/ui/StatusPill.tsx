import { cn } from "@/shared/lib/cn";

/** Tono de un estado: el color agrupa el significado y el texto siempre lo acompaña. */
export type Tone = "neutral" | "info" | "warn" | "success" | "danger" | "muted";

const tones: Record<Tone, { pill: string; dot: string }> = {
  neutral: { pill: "bg-neutral-bg text-neutral-fg", dot: "bg-neutral-dot" },
  info: { pill: "bg-info-bg text-info-fg", dot: "bg-info-dot" },
  warn: { pill: "bg-warn-bg text-warn-fg", dot: "bg-warn-dot" },
  success: { pill: "bg-success-bg text-success-fg", dot: "bg-success-dot" },
  danger: { pill: "bg-danger-bg text-danger-fg", dot: "bg-danger-dot" },
  muted: { pill: "bg-muted-bg text-muted-fg", dot: "bg-muted-dot" },
};

/** Clase del punto de color de un tono. */
export function toneDot(tone: Tone): string {
  return tones[tone].dot;
}

type Props = { tone: Tone; children: React.ReactNode; size?: "sm" | "md"; className?: string };

/** Píldora de estado con punto de color. */
export function StatusPill({ tone, children, size = "sm", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
        size === "sm" ? "px-2.5 py-1 text-xs" : "min-h-7 px-3 text-[13px]",
        tones[tone].pill,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", tones[tone].dot)} />
      {children}
    </span>
  );
}
