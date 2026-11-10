import { redirect } from "next/navigation";
import { routes } from "@/shared/lib/routes";

export const metadata = { title: "Solicitar cotización" };

/** Sin sesión, pedir una cotización empieza por registrar la empresa. */
export default function GetQuotePage(): never {
  redirect(routes.register);
}
