import { cn } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/Card";
import type { InquiryCargo } from "./fixtures";
import { formatMoney, groupThousands } from "./money";
import { panelTitle } from "./ui";

/** Escribe un volumen en litros como metros cúbicos: 28000 → «28». */
function cubicMeters(liters: number): string {
  const rest = liters % 1000;
  const whole = groupThousands(Math.trunc(liters / 1000));
  return rest === 0 ? whole : `${whole},${String(rest).padStart(3, "0").replace(/0+$/, "")}`;
}

/** Datos de la carga de una solicitud. */
export function CargoPanel({ cargo }: { cargo: InquiryCargo }) {
  const facts = [
    { label: "Mercancía", value: cargo.description, wide: true },
    { label: "Bultos", value: groupThousands(cargo.packages) },
    { label: "Peso", value: `${groupThousands(cargo.weightKg)} kg` },
    { label: "Volumen", value: `${cubicMeters(cargo.volumeLiters)} m³` },
    { label: "Incoterm", value: cargo.incoterm },
    { label: "Valor declarado", value: formatMoney(cargo.declaredValue) },
    { label: "Ruta", value: `${cargo.originCity} → ${cargo.destinationCity}` },
    { label: "Embarque", value: cargo.desiredShipDateLabel },
  ];

  return (
    <Panel className="px-6 py-5">
      <h2 className={panelTitle}>Carga</h2>
      <dl className="mt-3.5 mb-0 grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-x-5 gap-y-3.5 text-sm">
        {facts.map((fact) => (
          <div key={fact.label} className={fact.wide ? "col-span-full" : undefined}>
            <dt className="text-xs text-subtle">{fact.label}</dt>
            <dd className={cn("mt-[3px] mb-0 ml-0", fact.wide ? "font-medium" : "font-semibold")}>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
