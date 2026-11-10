import Link from "next/link";
import { routes } from "@/shared/lib/routes";
import { PublicLogo } from "@/shared/ui/Logo";

/** Barra blanca del registro: logo y enlace para ingresar. */
export function RegisterHeader() {
  return (
    <header className="px-4 pt-3.5">
      <div className="mx-auto flex min-h-16 max-w-[1240px] flex-wrap items-center justify-between gap-x-5 gap-y-2.5 rounded-tile border border-[rgba(11,27,51,0.08)] bg-white py-2 pr-[18px] pl-4">
        <PublicLogo href={routes.home} />
        <span className="text-sm text-subtle">
          ¿Ya tienes cuenta?{" "}
          <Link href={routes.login} className="font-semibold text-gold-text">
            Ingresar
          </Link>
        </span>
      </div>
    </header>
  );
}
