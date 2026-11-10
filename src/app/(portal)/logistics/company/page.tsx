import { CompanyDetails } from "@/features/portal-provider/CompanyDetails";

export const metadata = { title: "Mi empresa · Operador logístico" };

export default async function LogisticsCompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const { view } = await searchParams;
  const canEdit = view !== "operator";
  return <CompanyDetails key={String(canEdit)} portal="logistics" canEdit={canEdit} />;
}
