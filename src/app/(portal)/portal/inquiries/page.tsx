import { redirect } from "next/navigation";
import { demo, routes } from "@/shared/lib/routes";

export const metadata = { title: "Solicitudes" };

export default function ClientInquiriesPage() {
  redirect(routes.client.inquiry(demo.inquiry));
}
