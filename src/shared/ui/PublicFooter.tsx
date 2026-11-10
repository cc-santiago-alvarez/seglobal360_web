import Link from "next/link";

/** Pie de las páginas públicas. */
export function PublicFooter() {
  return (
    <footer className="border-t border-[rgba(11,27,51,0.08)]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-7 text-sm text-subtle">
        <span>© 2026 SEGlobal 360 · Soluciones logísticas globales · Colombia</span>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-5 gap-y-1.5">
          <Link href="/marketplace" className="link-quiet text-inherit!">
            Marketplace
          </Link>
          <Link href="/contact" className="link-quiet text-inherit!">
            Contacto
          </Link>
          <Link href="/legal/terms" className="link-quiet text-inherit!">
            Términos y condiciones
          </Link>
          <Link href="/legal/privacy" className="link-quiet text-inherit!">
            Política de datos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
