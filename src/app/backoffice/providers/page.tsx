import { providers } from "@/features/backoffice-network/fixtures";
import {
  fromSearchParams,
  providerQuerySpec,
  readListQuery,
  type SearchParams,
} from "@/features/backoffice-network/listQuery";
import { ProvidersScreen } from "@/features/backoffice-network/ProvidersScreen";

export const metadata = { title: "Proveedores · Backoffice" };

export default async function BackofficeProvidersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = readListQuery(providerQuerySpec, fromSearchParams(await searchParams));
  return <ProvidersScreen providers={providers} initialQuery={query} />;
}
