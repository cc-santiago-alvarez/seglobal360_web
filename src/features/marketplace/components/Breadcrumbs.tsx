import Link from "next/link";
import { Fragment } from "react";

type Crumb = { label: string; href?: string };

/** Ruta de navegación de las páginas de detalle; el último elemento es la página actual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-[13px] text-subtle">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="link-quiet text-subtle">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-navy-900">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
