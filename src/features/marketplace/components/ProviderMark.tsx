import { cn } from "@/shared/lib/cn";

const sizes = {
  sm: "size-8 rounded-full bg-navy-900 text-xs",
  md: "size-10 rounded-full bg-navy-900 text-sm",
  lg: "size-14 rounded-[14px] bg-navy-900 text-lg",
  xl: "size-[104px] rounded-card bg-navy-800 text-[34px] shadow-[0_0_0_4px_#0B1B33,0_0_0_5px_rgba(201,164,92,0.6)]",
};

type Props = { initials: string; size?: keyof typeof sizes; className?: string };

/** Logo de un proveedor: sus iniciales en dorado sobre navy. */
export function ProviderMark({ initials, size = "sm", className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center font-display font-bold text-gold-300", sizes[size], className)}
    >
      {initials}
    </span>
  );
}
