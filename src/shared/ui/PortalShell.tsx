"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Award,
  Building2,
  ClipboardList,
  FileText,
  Globe,
  History,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Route,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { demo, routes } from "@/shared/lib/routes";
import { Avatar } from "./Avatar";
import { GoldWordmark, LogoMark } from "./Logo";

/** Portales con menú propio. */
export type PortalKind = "client" | "supplier" | "logistics" | "backoffice";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Prefijos que marcan el ítem como actual; vacío = nunca se marca. */
  match?: string[];
  exact?: boolean;
  external?: boolean;
};
type NavEntry = NavItem | { section: string } | "divider";

const navs: Record<PortalKind, NavEntry[]> = {
  client: [
    { label: "Inicio", href: routes.client.home, icon: LayoutDashboard, exact: true },
    { label: "Solicitudes", href: routes.client.inquiries, icon: ClipboardList },
    { label: "Cotizaciones", href: routes.client.quotes, icon: FileText },
    { label: "Mi empresa", href: routes.client.company, icon: Building2, exact: true },
    { label: "Usuarios", href: routes.client.users, icon: Users },
    "divider",
    { label: "Marketplace", href: routes.marketplace, icon: Globe, external: true },
  ],
  supplier: [
    { label: "Perfil de proveedor", href: routes.supplier.profile, icon: Award, exact: true },
    { label: "Marketplace", href: routes.marketplace, icon: Globe },
    { label: "Mi empresa", href: routes.supplier.company, icon: Building2, exact: true },
    { label: "Usuarios", href: routes.supplier.users, icon: Users },
  ],
  logistics: [
    { label: "Perfil del operador", href: routes.logistics.profile, icon: Award, exact: true },
    { label: "Servicios", href: routes.logistics.services, icon: Package },
    { label: "Marketplace", href: routes.marketplace, icon: Globe },
    { label: "Mi empresa", href: routes.logistics.company, icon: Building2, exact: true },
    { label: "Usuarios", href: routes.logistics.users, icon: Users },
  ],
  backoffice: [
    { section: "Operación" },
    { label: "Bandeja", href: routes.backoffice.inbox, icon: Inbox, exact: true },
    { label: "Solicitudes", href: routes.backoffice.inquiry(demo.inquiry), icon: ClipboardList, match: [routes.backoffice.inquiries] },
    { label: "Cotizaciones", href: routes.backoffice.quotes, icon: FileText },
    { section: "Red" },
    { label: "Empresas", href: routes.backoffice.companies, icon: Building2 },
    { label: "Proveedores", href: routes.backoffice.providers, icon: Award },
    { label: "Corredores", href: routes.backoffice.corridors, icon: Route },
    { section: "Configuración" },
    { label: "Catálogos", href: routes.designSystem, icon: Menu, match: [] },
    { label: "Usuarios y roles", href: routes.backoffice.inbox, icon: Users, match: [] },
    { label: "Auditoría", href: routes.backoffice.inbox, icon: History, match: [] },
  ],
};

function isCurrent(item: NavItem, pathname: string): boolean {
  if (item.external) return false;
  if (item.exact) return pathname === item.href;
  const prefixes = item.match ?? [item.href];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

type Props = {
  portal: PortalKind;
  /** Tarjeta de la empresa (no aplica al backoffice). */
  company?: { name: string; subtitle: string };
  user: { name: string; role: string };
  children: React.ReactNode;
};

/** Marco de los portales: menú navy flotante a la izquierda y contenido a la derecha. */
export function PortalShell({ portal, company, user, children }: Props) {
  const pathname = usePathname();
  const isBackoffice = portal === "backoffice";
  const homeHref = navs[portal].find((entry): entry is NavItem => typeof entry === "object" && "href" in entry)?.href ?? "/";

  return (
    <div className="flex min-h-screen flex-wrap bg-ivory font-sans text-navy-900">
      <aside
        aria-label={isBackoffice ? "Menú del backoffice" : "Menú del portal"}
        className="m-3 flex flex-[1_1_248px] flex-col gap-6 rounded-card bg-navy-950 px-4 py-[22px] text-white max-[860px]:min-w-0 max-[860px]:flex-[1_1_100%] max-[860px]:gap-3 max-[860px]:px-3 max-[860px]:py-3.5"
      >
        <Link
          href={homeHref}
          aria-label={isBackoffice ? "SEGlobal 360 Backoffice" : "SEGlobal 360, ir al inicio del portal"}
          className="flex items-center gap-2.5 px-2 no-underline"
        >
          <LogoMark size={40} gradientId={`seg-gold-${portal}`} />
          {isBackoffice ? (
            <span className="flex flex-col gap-1">
              <GoldWordmark />
              <span className="text-xs font-semibold tracking-[0.01em] text-white/65">Backoffice</span>
            </span>
          ) : (
            <GoldWordmark />
          )}
        </Link>

        {company ? (
          <div className="rounded-[14px] border border-white/8 bg-white/5 p-3.5 max-[860px]:hidden">
            <p className="m-0 text-xs font-semibold tracking-[0.01em] text-white/60">Empresa</p>
            <p className="mt-1.5 mb-0 text-sm font-semibold">{company.name}</p>
            <p className="mt-1 mb-0 text-xs text-gold-300">{company.subtitle}</p>
          </div>
        ) : null}

        <nav
          aria-label="Secciones"
          className={cn(
            "flex flex-col max-[860px]:scroll-row max-[860px]:max-w-full max-[860px]:min-w-0 max-[860px]:flex-row max-[860px]:gap-1.5",
            isBackoffice ? "gap-0.5" : "gap-1",
          )}
        >
          {navs[portal].map((entry, index) => {
            if (entry === "divider") {
              return <div key={`divider-${index}`} aria-hidden="true" className="mx-1 my-2.5 h-px bg-white/10 max-[860px]:hidden" />;
            }
            if ("section" in entry) {
              return (
                <p
                  key={entry.section}
                  className={cn(
                    "m-0 px-3 py-1.5 text-xs font-semibold tracking-[0.01em] text-white/50 max-[860px]:hidden",
                    index > 0 && "mt-2.5",
                  )}
                >
                  {entry.section}
                </p>
              );
            }
            const active = isCurrent(entry, pathname);
            const Icon = entry.icon;
            return (
              <Link
                key={entry.label}
                href={entry.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm whitespace-nowrap no-underline transition-colors",
                  active
                    ? "bg-[rgba(201,164,92,0.16)] font-semibold text-white! hover:text-white!"
                    : "font-medium text-white/78! hover:bg-white/5 hover:text-white!",
                )}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" className={active ? "text-gold-300" : undefined} />
                {entry.label}
                {entry.external ? <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" className="ml-auto opacity-70" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 border-t border-white/8 px-2 pt-3 max-[860px]:hidden">
          <Avatar name={user.name} />
          <span className="flex min-w-0 flex-auto flex-col">
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-xs text-white/65">{user.role}</span>
          </span>
          <Link
            href={routes.login}
            aria-label="Cerrar sesión"
            className="grid size-11 place-items-center rounded-xl text-white/75! hover:bg-white/5 hover:text-white!"
          >
            <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-[999_1_560px]">{children}</div>
    </div>
  );
}
