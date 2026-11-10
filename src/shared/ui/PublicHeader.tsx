"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, ChevronDown, CircleHelp, Menu, Package2, Route, Store, X, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { PublicLogo } from "./Logo";

type Section = { href: string; label: string; description: string; icon: LucideIcon };

const homeSections: Section[] = [
  { href: "/#beneficios", label: "Beneficios", description: "Por qué comprar con SEGlobal 360", icon: BadgeCheck },
  { href: "/#como", label: "Cómo funciona", description: "Tres pasos para cotizar", icon: Route },
  { href: "/#vitrina", label: "Proveedores destacados", description: "Lo que ya puedes traer", icon: Package2 },
  { href: "/#vende", label: "Para proveedores", description: "Vende o mueve carga con nosotros", icon: Store },
  { href: "/#preguntas", label: "Preguntas frecuentes", description: "Lo que más nos preguntan", icon: CircleHelp },
];

function SectionLink({ section, onNavigate }: { section: Section; onNavigate: () => void }) {
  const Icon = section.icon;
  return (
    <li>
      <Link
        href={section.href}
        onClick={onNavigate}
        className="row-hover flex min-h-[52px] items-center gap-3 rounded-xl px-2.5 py-2 text-navy-900! no-underline"
      >
        <span className="grid size-[34px] shrink-0 place-items-center rounded-full border border-[rgba(201,164,92,0.55)] text-gold-text">
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{section.label}</span>
          <span className="text-[13px] font-normal text-subtle">{section.description}</span>
        </span>
      </Link>
    </li>
  );
}

/** Barra pública clara y flotante, con el desplegable de Inicio y menú compacto en teléfono. */
export function PublicHeader({ variant = "glass" }: { variant?: "glass" | "solid" }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const close = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };
  const isHome = pathname === "/";
  const isMarket = pathname.startsWith("/marketplace");
  const isContact = pathname.startsWith("/contact");
  const current = (active: boolean) => (active ? "page" : undefined);
  const activeLine = "font-semibold shadow-[inset_0_-2px_0_#C9A45C]";

  return (
    <header className="sticky top-0 z-30 px-4 pt-3.5">
      <nav
        aria-label="Principal"
        className={cn(
          "mx-auto flex min-h-16 max-w-[1240px] flex-wrap items-center justify-between gap-x-5 gap-y-2.5 rounded-tile border border-[rgba(11,27,51,0.08)] py-2 pr-2 pl-4 max-[520px]:gap-x-2 max-[520px]:pl-3",
          variant === "glass" ? "bg-[rgba(247,245,240,0.82)] backdrop-blur-[14px]" : "bg-white",
        )}
      >
        <PublicLogo />
        <ul className="m-0 hidden list-none flex-wrap items-center gap-x-[26px] gap-y-1 p-0 text-[15px] font-medium min-[861px]:flex">
          <li
            ref={menuRef}
            className="relative flex items-center gap-0.5"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setMenuOpen(false);
            }}
          >
            <Link href="/" aria-current={current(isHome)} className={cn("link-quiet inline-flex min-h-11 items-center text-navy-900!", isHome && activeLine)}>
              Inicio
            </Link>
            <button
              type="button"
              aria-label="Secciones de Inicio"
              aria-expanded={menuOpen}
              aria-controls="menu-inicio"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-11 w-[30px] place-items-center border-0 bg-transparent p-0 text-navy-900"
            >
              <ChevronDown size={14} strokeWidth={2.25} aria-hidden="true" className={cn(menuOpen && "rotate-180")} />
            </button>
            {menuOpen ? (
              <div id="menu-inicio" className="absolute top-full -left-3.5 z-40 pt-2.5">
                <ul className="m-0 flex min-w-[330px] list-none flex-col gap-0.5 rounded-[18px] border border-[rgba(11,27,51,0.08)] bg-white p-2 shadow-menu">
                  {homeSections.map((section) => (
                    <SectionLink key={section.href} section={section} onNavigate={close} />
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
          <li>
            <Link href="/marketplace" aria-current={current(isMarket)} className={cn("link-quiet inline-flex min-h-11 items-center text-navy-900!", isMarket && activeLine)}>
              Marketplace
            </Link>
          </li>
          <li>
            <Link href="/contact" aria-current={current(isContact)} className={cn("link-quiet inline-flex min-h-11 items-center text-navy-900!", isContact && activeLine)}>
              Contacto
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-2 max-[400px]:gap-1.5">
          <Link href="/login" className="link-quiet hidden min-h-11 items-center px-3.5 text-[15px] font-semibold text-navy-900! min-[861px]:inline-flex">
            Ingresar
          </Link>
          <Link
            href="/register"
            className="lift inline-flex min-h-[46px] items-center rounded-btn bg-navy-900 px-[18px] text-[15px] font-semibold whitespace-nowrap text-white! no-underline max-[520px]:px-3.5 max-[520px]:text-sm max-[400px]:px-3"
          >
            Crear cuenta
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid size-[46px] place-items-center rounded-btn border border-[rgba(11,27,51,0.12)] bg-white text-navy-900 min-[861px]:hidden"
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
        {mobileOpen ? (
          <div className="flex basis-full flex-col gap-0.5 border-t border-[rgba(11,27,51,0.08)] pt-1.5 pb-2 min-[861px]:hidden">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu-inicio-movil"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex min-h-12 w-full items-center justify-between border-0 bg-transparent p-0 text-[17px] font-semibold text-navy-900"
            >
              Inicio
              <ChevronDown size={16} aria-hidden="true" className={cn(menuOpen && "rotate-180")} />
            </button>
            {menuOpen ? (
              <ul id="menu-inicio-movil" className="m-0 mb-1.5 flex list-none flex-col gap-0.5 p-0">
                {homeSections.map((section) => (
                  <SectionLink key={section.href} section={section} onNavigate={close} />
                ))}
              </ul>
            ) : null}
            <Link href="/marketplace" onClick={close} className="link-quiet flex min-h-12 items-center text-[17px] font-medium text-navy-900!">
              Marketplace
            </Link>
            <Link href="/contact" onClick={close} className="link-quiet flex min-h-12 items-center text-[17px] font-medium text-navy-900!">
              Contacto
            </Link>
            <Link href="/login" onClick={close} className="link-quiet flex min-h-12 items-center text-[17px] font-semibold text-navy-900!">
              Ingresar
            </Link>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
