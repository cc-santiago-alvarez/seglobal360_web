import { countryName, type CountryCode } from "@/shared/ui/Flag";
import {
  corridorCodes,
  corridorLabel,
  corridorOrigin,
  minOrderBuckets,
  supplierTypeCodes,
  supplierTypeLabel,
  transportTypeCodes,
  transportTypeLabel,
  type CorridorCode,
  type MarketTab,
  type MinOrderBucket,
  type SupplierTypeCode,
  type TransportTypeCode,
} from "../catalog";

const control = "size-[18px] accent-navy-900";
const option = "flex items-center gap-2.5 text-sm";

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
      <legend className="pb-2.5 text-xs font-semibold tracking-[0.01em] text-subtle">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <div className="rounded-field bg-ivory p-4 text-[13px] leading-[1.55] text-subtle">{children}</div>;
}

function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

type Props = {
  tab: MarketTab;
  corridor: CorridorCode;
  onCorridor: (corridor: CorridorCode) => void;
  transports: TransportTypeCode[];
  onTransports: (transports: TransportTypeCode[]) => void;
  origin: CountryCode | "all";
  onOrigin: (origin: CountryCode | "all") => void;
  supplierTypes: SupplierTypeCode[];
  onSupplierTypes: (types: SupplierTypeCode[]) => void;
  minOrder: MinOrderBucket[];
  onMinOrder: (buckets: MinOrderBucket[]) => void;
  onClear: () => void;
};

/** Panel lateral de filtros; cambia según la pestaña. */
export function FilterPanel(props: Props) {
  const { tab, corridor } = props;
  const origins: ReadonlyArray<{ id: CountryCode | "all"; label: string }> = [
    { id: "all", label: "Todos los países" },
    { id: "CO", label: countryName.CO },
    { id: "CR", label: countryName.CR },
  ];

  return (
    <aside
      aria-label="Filtros"
      className="flex flex-[1_1_240px] flex-col gap-[22px] rounded-tile border border-[#E9E6DE] bg-white p-[22px]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 font-display text-base font-bold tracking-[-0.02em]">Filtros</h2>
        <button
          type="button"
          onClick={props.onClear}
          className="border-0 bg-transparent py-2 font-sans text-[13px] font-semibold text-gold-text hover:text-navy-900"
        >
          Limpiar
        </button>
      </div>

      <Group legend="Corredor">
        {corridorCodes.map((code) => (
          <label key={code} className={option}>
            <input
              type="radio"
              name="corridor"
              className={control}
              checked={corridor === code}
              onChange={() => props.onCorridor(code)}
            />
            {corridorLabel(code)}
          </label>
        ))}
      </Group>

      {tab === "services" ? (
        <>
          <Group legend="Tipo de transporte">
            {transportTypeCodes.map((code) => (
              <label key={code} className={option}>
                <input
                  type="checkbox"
                  className={control}
                  checked={props.transports.includes(code)}
                  onChange={() => props.onTransports(toggle(props.transports, code))}
                />
                {transportTypeLabel[code]}
              </label>
            ))}
          </Group>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-[0.01em] text-subtle">País de origen</span>
            <select
              value={corridorOrigin(corridor)}
              onChange={(event) => props.onCorridor(event.target.value === "CR" ? "CR-CO" : "CO-CR")}
              className="min-h-11 rounded-field border border-line-strong bg-white px-3 font-sans text-sm font-medium text-navy-900"
            >
              <option value="CO">{countryName.CO}</option>
              <option value="CR">{countryName.CR}</option>
            </select>
          </label>
          <Note>
            Los precios no se publican: cada operación se cotiza según tu carga, y la comisión de SEGlobal 360 va
            incluida en el total.
          </Note>
        </>
      ) : (
        <>
          <Group legend="Despacha desde">
            {origins.map((item) => (
              <label key={item.id} className={option}>
                <input
                  type="radio"
                  name="origin"
                  className={control}
                  checked={props.origin === item.id}
                  onChange={() => props.onOrigin(item.id)}
                />
                {item.label}
              </label>
            ))}
          </Group>
          <Group legend="Tipo de proveedor">
            {supplierTypeCodes.map((code) => (
              <label key={code} className={option}>
                <input
                  type="checkbox"
                  className={control}
                  checked={props.supplierTypes.includes(code)}
                  onChange={() => props.onSupplierTypes(toggle(props.supplierTypes, code))}
                />
                {supplierTypeLabel[code]}
              </label>
            ))}
          </Group>
          <Group legend="Pedido mínimo">
            {minOrderBuckets.map((bucket) => (
              <label key={bucket.id} className={option}>
                <input
                  type="checkbox"
                  className={control}
                  checked={props.minOrder.includes(bucket.id)}
                  onChange={() => props.onMinOrder(toggle(props.minOrder, bucket.id))}
                />
                {bucket.label}
              </label>
            ))}
          </Group>
          <Note>
            Pide tu cotización al proveedor y SEGlobal 360 se encarga de traerlo: transporte, aduana y entrega en
            destino van en la misma cotización.
          </Note>
        </>
      )}
    </aside>
  );
}
