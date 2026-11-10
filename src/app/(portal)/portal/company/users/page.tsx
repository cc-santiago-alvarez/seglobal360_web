import { CompanyUsers } from "@/features/portal-client/CompanyUsers";
import { companyUsers } from "@/features/portal-client/fixtures";

export const metadata = { title: "Usuarios" };

export default function ClientUsersPage() {
  return <CompanyUsers initialUsers={companyUsers} />;
}
