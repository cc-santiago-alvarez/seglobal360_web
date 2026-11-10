import { CompaniesScreen } from "@/features/backoffice-network/CompaniesScreen";
import { companies } from "@/features/backoffice-network/fixtures";
import {
  companyQuerySpec,
  fromSearchParams,
  readListQuery,
  type SearchParams,
} from "@/features/backoffice-network/listQuery";

export const metadata = { title: "Empresas · Backoffice" };

export default async function BackofficeCompaniesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = readListQuery(companyQuerySpec, fromSearchParams(await searchParams));
  return <CompaniesScreen companies={companies} initialQuery={query} />;
}
