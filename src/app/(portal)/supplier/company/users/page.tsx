import { CompanyUsers } from "@/features/portal-provider/CompanyUsers";

export const metadata = { title: "Usuarios · Portal del proveedor" };

export default function SupplierUsersPage() {
  return <CompanyUsers portal="supplier" />;
}
