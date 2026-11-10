import Image from "next/image";
import { HeroSearch } from "./HeroSearch";

/** Portada a pantalla completa con la foto del buque, el titular y el buscador encima. */
export function LandingHero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative isolate -mt-[78px] flex min-h-[min(100svh,920px)] items-center overflow-hidden bg-navy-950 pt-[142px] pb-[72px] text-white"
    >
      <Image
        src="/images/hero-ship.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-[65%_60%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,16,36,0.90)_0%,rgba(6,16,36,0.72)_48%,rgba(6,16,36,0.38)_100%),linear-gradient(0deg,rgba(6,16,36,0.75)_0%,rgba(6,16,36,0)_45%)]"
      />
      <HeroSearch>
        <p className="m-0 inline-flex items-center gap-2.5 self-start rounded-full border border-white/18 bg-white/10 py-1.5 pr-3 pl-1.5 text-sm font-medium text-white/88 backdrop-blur-[8px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-2 py-[3px] font-sans text-xs font-semibold text-navy-950">
            CO <span aria-hidden="true">⇄</span> CR
          </span>
          Rutas activas entre Colombia y Costa Rica
        </p>
        <h1
          id="hero-titulo"
          className="m-0 font-display text-[clamp(38px,4.8vw,64px)] leading-[1.08] font-bold tracking-[-0.025em] text-balance text-white"
        >
          Del proveedor a tu bodega, en una sola cotización.
        </h1>
        <p className="m-0 max-w-[540px] text-lg leading-[1.55] text-pretty text-white/84">
          Encuentra mayoristas y operadores logísticos aprobados por Global 360. Tu asesor arma la operación completa:
          mercancía, transporte, aduana y entrega.
        </p>
      </HeroSearch>
    </section>
  );
}
