import { CompanyUsers } from "@/features/portal-provider/CompanyUsers";

export const metadata = { title: "Usuarios · Operador logístico" };

export default function LogisticsUsersPage() {
  return <CompanyUsers portal="logistics" />;
}
