import Image from "next/image";
import Link from "next/link";
import { Check, ClipboardList, MessageSquare, type LucideIcon } from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { GoldWordmark, LogoMark } from "@/shared/ui/Logo";

const benefits: ReadonlyArray<{ icon: LucideIcon; text: string }> = [
  { icon: ClipboardList, text: "Sigue tus solicitudes y cotizaciones con su estado al día." },
  { icon: MessageSquare, text: "Habla con tu asesor sin salir de la plataforma." },
  { icon: Check, text: "Acepta o rechaza cotizaciones en línea." },
];

/** Panel navy del ingreso: foto del buque con velo, marca y lo que ofrece la plataforma. */
export function LoginShowcase() {
  return (
    <section className="relative isolate m-3 flex flex-[1_1_520px] flex-col justify-between gap-12 overflow-hidden rounded-[32px] bg-navy-950 px-[52px] py-11 text-white max-[600px]:px-6 max-[600px]:py-8">
      <Image
        src="/images/hero-ship.jpg"
        alt=""
        fill
        preload
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="-z-20 object-cover object-[65%_60%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/92 via-navy-950/74 to-navy-950/45"
      />
      <Link href={routes.home} aria-label="SEGlobal 360, ir al inicio" className="flex items-center gap-2.5 self-start no-underline">
        <LogoMark size={52} gradientId="seg-gold-login" />
        <span className="flex flex-col gap-[5px]">
          <GoldWordmark size={22} />
          <span className="text-[11px] leading-none text-white/72">Tu empresa, sin fronteras.</span>
        </span>
      </Link>
      <div className="max-w-[520px]">
        <p className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.01em] text-gold-300">
          Plataforma para empresas
        </p>
        <h1 className="mt-5 font-display text-[44px] leading-[1.1] font-bold tracking-[-0.02em] max-[520px]:text-[34px]">
          Tu operación, <span>en un solo lugar</span>
        </h1>
        <ul className="mt-8 flex flex-col gap-[18px]">
          {benefits.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3.5 text-base leading-[1.5] text-white/85">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-gold-300/50">
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" className="text-gold-300" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-[13px] text-white/60">© 2026 SEGlobal 360 · Colombia ↔ Costa Rica</p>
    </section>
  );
}
