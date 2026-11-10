import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type MarkProps = {
  size?: number;
  /** Color del trazo que separa el anillo y el texto del globo; el fondo sobre el que va. */
  backdrop?: string;
  gradientId?: string;
  className?: string;
};

/** Isotipo dorado de SEGlobal 360: globo, órbita y las letras SEG. */
export function LogoMark({ size = 40, backdrop = "#061024", gradientId = "seg-gold", className }: MarkProps) {
  const fill = `url(#${gradientId})`;
  return (
    <svg viewBox="0 0 128 128" width={size} height={size} aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dca6" />
          <stop offset="0.5" stopColor="#d6b371" />
          <stop offset="1" stopColor="#a8792f" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={fill} strokeLinecap="round">
        <circle cx="64" cy="64" r="40" strokeWidth="4.5" />
        <ellipse cx="64" cy="64" rx="19" ry="40" strokeWidth="2.5" />
        <path d="M64 24v80M29.4 44h69.2M29.4 84h69.2" strokeWidth="2.5" />
      </g>
      <text
        x="64"
        y="76.5"
        textAnchor="middle"
        textLength="80"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Montserrat, Arial, sans-serif"
        fontWeight="800"
        fontSize="35"
        fill={fill}
        stroke={backdrop}
        strokeWidth="5"
        paintOrder="stroke"
      >
        SEG
      </text>
      <g transform="rotate(-20 64 68)" fill="none" strokeLinecap="round">
        <path d="M2 68 A62 15 0 0 0 126 68 A62 15 0 0 0 117.7 60.5" stroke={backdrop} strokeWidth="8" />
        <path d="M2 68 A62 15 0 0 0 126 68 A62 15 0 0 0 117.7 60.5" stroke={fill} strokeWidth="3.5" />
        <circle cx="117.7" cy="60.5" r="4.5" fill={fill} />
      </g>
    </svg>
  );
}

/** Logo de la barra pública: isotipo y nombre en navy. */
export function PublicLogo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="SEGlobal 360, inicio"
      className={cn("link-quiet flex items-center gap-2 text-navy-900! max-[400px]:gap-1.5", className)}
    >
      <LogoMark size={40} gradientId="seg-gold-public" className="max-[520px]:h-[34px] max-[520px]:w-[34px]" />
      <span className="font-display text-[19px] font-bold tracking-[-0.02em] whitespace-nowrap max-[520px]:text-[17px] max-[400px]:text-base">
        SEGlobal 360
      </span>
    </Link>
  );
}

/** Nombre en dorado sobre navy: «SE» en 800 y «Global 360» en 600. */
export function GoldWordmark({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("font-display leading-none text-gold-300", className)} style={{ fontSize: size }}>
      <span className="font-extrabold">SE</span>
      <span className="font-semibold">Global 360</span>
    </span>
  );
}
