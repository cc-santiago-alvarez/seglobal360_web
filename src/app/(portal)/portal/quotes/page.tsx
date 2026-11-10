import { quotes } from "@/features/portal-client/fixtures";
import { QuotesList } from "@/features/portal-client/QuotesList";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";

export const metadata = { title: "Cotizaciones" };

export default function ClientQuotesPage() {
  return (
    <>
      <PageHeader
        title="Cotizaciones"
        description="Las cotizaciones que te envía tu asesor. Ábrelas para ver lo que incluyen y responder."
      />
      <PageBody>
        <QuotesList quotes={quotes} />
      </PageBody>
    </>
  );
}
