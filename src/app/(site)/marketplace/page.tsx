import type { Metadata } from "next";
import { firstParam, parseCorridor, parseTab } from "@/features/marketplace/catalog";
import { DirectInquiryBand } from "@/features/marketplace/components/DirectInquiryBand";
import { MarketplaceBrowser } from "@/features/marketplace/components/MarketplaceBrowser";
import { listServices, listSuppliers } from "@/features/marketplace/fixtures";
import { PublicFooter } from "@/shared/ui/PublicFooter";
import { PublicHeader } from "@/shared/ui/PublicHeader";

export const metadata: Metadata = { title: "Marketplace" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function MarketplacePage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <>
      <PublicHeader />
      <MarketplaceBrowser
        initialTab={parseTab(firstParam(params.tab))}
        initialQuery={firstParam(params.q) ?? ""}
        initialRoute={parseCorridor(firstParam(params.route))}
        services={listServices()}
        suppliers={listSuppliers()}
      />
      <DirectInquiryBand />
      <PublicFooter />
    </>
  );
}
