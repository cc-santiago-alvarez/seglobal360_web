import { redirect } from "next/navigation";
import { demo, routes } from "@/shared/lib/routes";

export const metadata = { title: "Solicitudes · Backoffice" };

export default function BackofficeInquiriesPage() {
  redirect(routes.backoffice.inquiry(demo.inquiry));
}
