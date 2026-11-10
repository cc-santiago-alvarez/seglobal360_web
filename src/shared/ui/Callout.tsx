import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type Kind = "info" | "warn" | "success" | "danger";

const kinds: Record<Kind, { box: string; icon: LucideIcon }> = {
  info: { box: "bg-info-bg text-info-ink", icon: Info },
  warn: { box: "bg-sand text-warn-ink", icon: TriangleAlert },
  success: { box: "bg-success-bg text-success-fg", icon: CircleCheck },
  danger: { box: "bg-danger-bg text-danger-fg", icon: CircleAlert },
};

type Props = {
  kind?: Kind;
  icon?: LucideIcon;
  title?: React.ReactNode;
  role?: "status" | "alert";
  className?: string;
  children: React.ReactNode;
};

/** Aviso de 14 px de radio con icono, para contexto o estados que bloquean. */
export function Callout({ kind = "info", icon, title, role, className, children }: Props) {
  const Icon = icon ?? kinds[kind].icon;
  return (
    <div
      role={role}
      className={cn("flex items-start gap-3 rounded-[14px] px-[18px] py-4 text-sm leading-[1.55]", kinds[kind].box, className)}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        {title ? <p className="m-0 font-semibold">{title}</p> : null}
        <div className={title ? "mt-1" : undefined}>{children}</div>
      </div>
    </div>
  );
}
