import { currentAdvisor, quoteList } from "@/features/backoffice-ops/fixtures";
import { QuotesBoard } from "@/features/backoffice-ops/QuotesBoard";

export const metadata = { title: "Cotizaciones · Backoffice" };

export default function BackofficeQuotesPage() {
  return <QuotesBoard quotes={quoteList} advisorName={currentAdvisor.name} />;
}
