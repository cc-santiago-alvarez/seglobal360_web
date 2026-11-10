import {
  Coffee,
  Dumbbell,
  FileCheck,
  House,
  Layers,
  Plane,
  Send,
  ShieldCheck,
  Shirt,
  Ship,
  Smartphone,
  Sparkle,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { ProductCategoryCode, ServiceCategoryCode } from "../catalog";

/** Icono de cada categoría de servicio y de producto. */
export const categoryIcon: Record<ServiceCategoryCode | ProductCategoryCode, LucideIcon> = {
  sea_freight: Ship,
  air_freight: Plane,
  land_freight: Truck,
  customs_brokerage: FileCheck,
  warehousing: Warehouse,
  courier: Send,
  consolidation: Layers,
  cargo_insurance: ShieldCheck,
  technology: Smartphone,
  beauty: Sparkle,
  sports: Dumbbell,
  home: House,
  fashion: Shirt,
  food: Coffee,
};

type ChipProps = { active: boolean; icon?: LucideIcon; onClick: () => void; children: React.ReactNode };

function Chip({ active, icon: Icon, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-sans text-sm transition-colors",
        active
          ? "border-navy-900 bg-navy-900 font-semibold text-white"
          : "border-line-warm bg-white font-medium text-navy-900 hover:border-navy-900",
      )}
    >
      {Icon ? (
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" className={active ? "text-gold-300" : "text-gold-text"} />
      ) : null}
      {children}
    </button>
  );
}

type Props<T extends ServiceCategoryCode | ProductCategoryCode> = {
  label: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T | "all";
  onChange: (value: T | "all") => void;
};

/** Chips de categoría de un solo valor, con «Todas» al inicio. */
export function CategoryChips<T extends ServiceCategoryCode | ProductCategoryCode>({
  label,
  options,
  labels,
  value,
  onChange,
}: Props<T>) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2.5">
      <Chip active={value === "all"} onClick={() => onChange("all")}>
        Todas
      </Chip>
      {options.map((code) => (
        <Chip key={code} active={code === value} icon={categoryIcon[code]} onClick={() => onChange(code)}>
          {labels[code]}
        </Chip>
      ))}
    </nav>
  );
}
