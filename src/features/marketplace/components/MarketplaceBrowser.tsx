"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { Search, SearchX } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/lib/routes";
import type { CountryCode } from "@/shared/ui/Flag";
import {
  corridorCodes,
  corridorFrom,
  corridorLabel,
  corridorOrigin,
  countLabel,
  defaultCorridor,
  productCategoryCodes,
  productCategoryLabel,
  serviceCategoryCodes,
  serviceCategoryLabel,
  supplierTypeCodes,
  transportTypeCodes,
  transportTypeLabel,
  type CorridorCode,
  type MarketTab,
  type MinOrderBucket,
  type ProductCategoryCode,
  type ServiceCategoryCode,
  type SupplierTypeCode,
  type TransportTypeCode,
} from "../catalog";
import type { ServiceListing, SupplierListing } from "../fixtures";
import { filterServices, filterSuppliers, paginate } from "../filters";
import { CategoryChips } from "./CategoryChips";
import { FilterPanel } from "./FilterPanel";
import { Pagination } from "./Pagination";
import { ProviderCard } from "./ProviderCard";
import { ServiceCard } from "./ServiceCard";

const copy = {
  services: {
    eyebrow: "Marketplace logístico B2B",
    title: "Encuentra quién mueve tu carga entre",
    text: "Compara operadores de transporte, aduanas, bodegaje y mensajería. Pide tu cotización y un asesor de SEGlobal 360 coordina la operación por ti.",
    searchLabel: "¿Qué necesitas mover?",
    placeholder: "Ej.: contenedor de 20 pies, carga refrigerada, courier…",
    searchButton: "Buscar servicios",
    resultsTitle: "Servicios logísticos",
  },
  products: {
    eyebrow: "Marketplace B2B de proveedores",
    title: "Compra al por mayor a proveedores de",
    text: "Tecnología, maquillaje, deporte, hogar y más. Pide tu cotización y SEGlobal 360 se encarga de traerlo: transporte, aduana y entrega.",
    searchLabel: "¿Qué producto buscas?",
    placeholder: "Ej.: celulares, labiales, balones…",
    searchButton: "Buscar proveedores",
    resultsTitle: "Proveedores",
  },
} as const;

const tabs: ReadonlyArray<{ id: MarketTab; label: string }> = [
  { id: "services", label: "Servicios logísticos" },
  { id: "products", label: "Proveedores y productos" },
];

const heroField = "flex flex-col gap-1 px-[18px] py-2.5";
const heroLabel = "text-xs font-semibold tracking-[0.01em] text-subtle";
const heroSelect = "border-0 bg-transparent p-0 font-sans text-[15px] font-semibold text-navy-900";

type Props = {
  initialTab: MarketTab;
  initialQuery: string;
  /** Corredor de `?route=`; `null` si no viene. */
  initialRoute: CorridorCode | null;
  services: ServiceListing[];
  suppliers: SupplierListing[];
};

/** Portada, buscador, filtros y resultados del marketplace, filtrados en el cliente. */
export function MarketplaceBrowser({ initialTab, initialQuery, initialRoute, services, suppliers }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const resultsRef = useRef<HTMLElement>(null);

  const [tab, setTab] = useState<MarketTab>(initialTab);
  const [query, setQuery] = useState(initialQuery);
  const [corridor, setCorridor] = useState<CorridorCode>(initialRoute ?? defaultCorridor);
  const [serviceCategory, setServiceCategory] = useState<ServiceCategoryCode | "all">("all");
  const [transports, setTransports] = useState<TransportTypeCode[]>(initialQuery ? [] : ["sea"]);
  const [productCategory, setProductCategory] = useState<ProductCategoryCode | "all">("all");
  const [origin, setOrigin] = useState<CountryCode | "all">(
    initialTab === "products" && initialRoute ? corridorOrigin(initialRoute) : "all",
  );
  const [supplierTypes, setSupplierTypes] = useState<SupplierTypeCode[]>([...supplierTypeCodes]);
  const [minOrder, setMinOrder] = useState<MinOrderBucket[]>([]);
  const [page, setPage] = useState(1);

  const text = copy[tab];
  const isServices = tab === "services";

  const serviceResults = useMemo(
    () => filterServices(services, { corridor, category: serviceCategory, transports, query }),
    [services, corridor, serviceCategory, transports, query],
  );
  const supplierResults = useMemo(
    () => filterSuppliers(suppliers, { category: productCategory, origin, types: supplierTypes, minOrder, query }),
    [suppliers, productCategory, origin, supplierTypes, minOrder, query],
  );
  const servicePage = paginate(serviceResults, page);
  const supplierPage = paginate(supplierResults, page);
  const current = isServices ? servicePage : supplierPage;

  // Guarda la pestaña, el corredor y la búsqueda en la URL para que «Atrás» vuelva al mismo listado.
  function syncUrl(next: { tab?: MarketTab; corridor?: CorridorCode; query?: string }) {
    const params = new URLSearchParams();
    const nextTab = next.tab ?? tab;
    const nextCorridor = next.corridor ?? corridor;
    const nextQuery = (next.query ?? query).trim();
    if (nextTab === "products") params.set("tab", "products");
    if (nextQuery) params.set("q", nextQuery);
    if (nextCorridor !== defaultCorridor) params.set("route", nextCorridor);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  function update<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function changeTab(next: MarketTab) {
    if (next === tab) return;
    setTab(next);
    setPage(1);
    syncUrl({ tab: next });
  }

  function changeCorridor(next: CorridorCode) {
    setCorridor(next);
    if (tab === "products") setOrigin(corridorOrigin(next));
    setPage(1);
    syncUrl({ corridor: next });
  }

  function changeOrigin(next: CountryCode | "all") {
    setOrigin(next);
    setPage(1);
    if (next !== "all" && corridorOrigin(corridor) !== next) {
      const nextCorridor = corridorFrom(next);
      setCorridor(nextCorridor);
      syncUrl({ corridor: nextCorridor });
    }
  }

  function changeHeroTransport(value: string) {
    const code = transportTypeCodes.find((item) => item === value);
    setTransports(code ? [code] : []);
    setPage(1);
  }

  function changeHeroCategory(value: string) {
    setProductCategory(productCategoryCodes.find((item) => item === value) ?? "all");
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setCorridor(defaultCorridor);
    setServiceCategory("all");
    setTransports([]);
    setProductCategory("all");
    setOrigin("all");
    setSupplierTypes([...supplierTypeCodes]);
    setMinOrder([]);
    setPage(1);
    syncUrl({ corridor: defaultCorridor, query: "" });
  }

  function changePage(next: number) {
    setPage(next);
    resultsRef.current?.scrollIntoView({ block: "start" });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    syncUrl({});
    resultsRef.current?.scrollIntoView({ block: "start" });
  }

  const heroTransport = transports.length > 1 ? "mixed" : (transports[0] ?? "");
  const n = current.total;
  const countText = isServices ? countLabel(n, "servicio", "servicios") : countLabel(n, "proveedor", "proveedores");
  const countContext = isServices
    ? [
        `en ${corridorLabel(corridor)}`,
        serviceCategory === "all" ? null : serviceCategoryLabel[serviceCategory],
        transports.length > 0
          ? transportTypeCodes
              .filter((code) => transports.includes(code))
              .map((code) => transportTypeLabel[code])
              .join(", ")
          : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : productCategory === "all"
      ? "que venden en Colombia ↔ Costa Rica"
      : `de ${productCategoryLabel[productCategory]}`;

  return (
    <>
      <section className="relative isolate -mt-[78px] overflow-hidden bg-navy-950 pt-[78px] text-white">
        <Image
          src="/images/hero-ship.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[65%_60%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,16,36,0.92)_0%,rgba(6,16,36,0.74)_50%,rgba(6,16,36,0.45)_100%)]"
        />
        <div className="mx-auto max-w-[1240px] px-6 pt-16 pb-20">
          <div className="flex flex-wrap items-center gap-8">
            <div className="min-w-0 flex-[1_1_560px]">
              <p className="m-0 flex items-center gap-3 text-[13px] font-semibold tracking-[0.01em] text-gold-300">
                {text.eyebrow}
              </p>
              <h1 className="mt-5 mb-0 font-display text-[52px] leading-[1.08] font-bold tracking-[-0.02em] text-balance max-[520px]:text-[38px]">
                {text.title} <span>Colombia y Costa Rica</span>
              </h1>
              <p className="mt-[22px] mb-0 max-w-[600px] text-lg leading-[1.6] text-white/82">{text.text}</p>
            </div>
          </div>

          <div
            role="group"
            aria-label="Qué quieres ver"
            className="mt-9 inline-flex rounded-tile border border-white/12 bg-white/8 p-1 max-[520px]:grid max-[520px]:w-full max-[520px]:grid-cols-2"
          >
            {tabs.map((item) => {
              const active = item.id === tab;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeTab(item.id)}
                  className={cn(
                    "min-h-11 rounded-field border-0 px-[22px] font-sans text-sm font-semibold max-[520px]:px-3 max-[520px]:py-2 max-[520px]:leading-tight",
                    active ? "bg-white text-navy-900" : "bg-transparent text-white/82",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <form
            role="search"
            aria-label={text.searchButton}
            onSubmit={submit}
            className="mt-4 flex flex-wrap items-stretch gap-1 rounded-panel bg-white p-2 text-navy-900 shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
          >
            <label className={cn(heroField, "flex-[1_1_220px] rounded-[14px]")}>
              <span className={heroLabel}>Corredor</span>
              <select
                value={corridor}
                onChange={(event) => changeCorridor(event.target.value === "CR-CO" ? "CR-CO" : "CO-CR")}
                className={heroSelect}
              >
                {corridorCodes.map((code) => (
                  <option key={code} value={code}>
                    {corridorLabel(code)}
                  </option>
                ))}
              </select>
            </label>
            {isServices ? (
              <label className={cn(heroField, "flex-[1_1_200px] border-l border-line")}>
                <span className={heroLabel}>Transporte</span>
                <select
                  value={heroTransport}
                  onChange={(event) => changeHeroTransport(event.target.value)}
                  className={heroSelect}
                >
                  <option value="">Todos</option>
                  {transportTypeCodes.map((code) => (
                    <option key={code} value={code}>
                      {transportTypeLabel[code]}
                    </option>
                  ))}
                  <option value="mixed" hidden>
                    Varios
                  </option>
                </select>
              </label>
            ) : (
              <label className={cn(heroField, "flex-[1_1_200px] border-l border-line")}>
                <span className={heroLabel}>Categoría</span>
                <select
                  value={productCategory === "all" ? "" : productCategory}
                  onChange={(event) => changeHeroCategory(event.target.value)}
                  className={heroSelect}
                >
                  <option value="">Todas</option>
                  {productCategoryCodes.map((code) => (
                    <option key={code} value={code}>
                      {productCategoryLabel[code]}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className={cn(heroField, "flex-[3_1_280px] border-l border-line")}>
              <span className={heroLabel}>{text.searchLabel}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={text.placeholder}
                className="border-0 bg-transparent p-0 font-sans text-[15px] font-medium text-navy-900 outline-none"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-14 flex-none items-center justify-center gap-2.5 rounded-btn border-0 bg-gold-500 px-7 font-sans text-[15px] font-semibold text-navy-950"
            >
              <Search size={18} strokeWidth={2} aria-hidden="true" />
              {text.searchButton}
            </button>
          </form>

          <div className="mt-[18px] flex flex-wrap items-center gap-2.5 text-[13px] text-white/72">
            <span>Corredores activos</span>
            <span className="rounded-full border border-[rgba(232,203,142,0.4)] px-3 py-1.5 font-semibold text-gold-300">
              CO → CR
            </span>
            <span className="rounded-full border border-[rgba(232,203,142,0.4)] px-3 py-1.5 font-semibold text-gold-300">
              CR → CO
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1240px] px-6 pt-10 pb-[72px]">
        {isServices ? (
          <CategoryChips
            label="Categorías de servicio"
            options={serviceCategoryCodes}
            labels={serviceCategoryLabel}
            value={serviceCategory}
            onChange={update(setServiceCategory)}
          />
        ) : (
          <CategoryChips
            label="Categorías de producto"
            options={productCategoryCodes}
            labels={productCategoryLabel}
            value={productCategory}
            onChange={update(setProductCategory)}
          />
        )}

        <div className="mt-8 flex flex-wrap items-start gap-8">
          <FilterPanel
            tab={tab}
            corridor={corridor}
            onCorridor={changeCorridor}
            transports={transports}
            onTransports={update(setTransports)}
            origin={origin}
            onOrigin={changeOrigin}
            supplierTypes={supplierTypes}
            onSupplierTypes={update(setSupplierTypes)}
            minOrder={minOrder}
            onMinOrder={update(setMinOrder)}
            onClear={clearFilters}
          />

          <section ref={resultsRef} aria-label="Resultados" className="min-w-0 flex-[999_1_560px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="m-0 font-display text-xl font-bold tracking-[-0.02em]">{text.resultsTitle}</h2>
              <p className="m-0 text-sm text-subtle" aria-live="polite">
                <strong className="text-navy-900">{countText}</strong> {countContext}
              </p>
            </div>

            {n === 0 ? (
              <div className="mt-5 flex flex-col items-center gap-2 rounded-tile border-[1.5px] border-dashed border-line-strong bg-white p-8 text-center text-sm leading-[1.55] text-subtle">
                <SearchX size={28} strokeWidth={1.4} aria-hidden="true" className="text-neutral-dot" />
                <p className="m-0">
                  No encontramos coincidencias con estos filtros.{" "}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="border-0 bg-transparent p-0 font-sans text-sm font-semibold text-gold-text hover:text-navy-900"
                  >
                    Limpiar filtros
                  </button>{" "}
                  o <Link href={routes.client.newInquiry} className="font-semibold">crea una solicitud directa</Link> y
                  tu asesor lo busca por ti.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
                  {isServices
                    ? servicePage.items.map((item) => <ServiceCard key={item.id} service={item} />)
                    : supplierPage.items.map((item) => <ProviderCard key={item.id} provider={item} />)}
                </div>
                <Pagination
                  page={current.page}
                  pageCount={current.pageCount}
                  from={current.from}
                  to={current.to}
                  total={current.total}
                  onChange={changePage}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
