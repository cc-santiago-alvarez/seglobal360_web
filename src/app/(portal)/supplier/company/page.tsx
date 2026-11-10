import { CompanyDetails } from "@/features/portal-provider/CompanyDetails";

export const metadata = { title: "Mi empresa · Portal del proveedor" };

export default async function SupplierCompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const { view } = await searchParams;
  const canEdit = view !== "operator";
  return <CompanyDetails key={String(canEdit)} portal="supplier" canEdit={canEdit} />;
}
