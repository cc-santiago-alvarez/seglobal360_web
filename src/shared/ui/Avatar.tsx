import { cn, initials } from "@/shared/lib/cn";

type Props = {
  name: string;
  size?: number;
  tone?: "gold" | "navy" | "sand";
  shape?: "circle" | "square";
  className?: string;
};

const tones = {
  gold: "bg-gold-500 text-navy-950",
  navy: "bg-navy-900 text-gold-300",
  sand: "bg-sand text-warn-fg",
};

/** Iniciales en Montserrat sobre un círculo o un cuadrado redondeado. */
export function Avatar({ name, size = 36, tone = "gold", shape = "circle", className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center font-display font-bold",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        tones[tone],
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials(name)}
    </span>
  );
}
