import Link from "next/link";
import { routes } from "@/shared/lib/routes";
import { breadcrumbClass } from "./ui";

/** Migas «Solicitudes / actual» de las pantallas de solicitudes del cliente. */
export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Ruta de navegación" className={breadcrumbClass}>
      <Link href={routes.client.home} className="link-quiet text-subtle">
        Solicitudes
      </Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page" className="font-medium text-navy-900">
        {current}
      </span>
    </nav>
  );
}
