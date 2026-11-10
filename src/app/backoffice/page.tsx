import {
  advisors,
  currentAdvisor,
  demoClock,
  inboxTiles,
  pendingCompanies,
  providersInReview,
  unassignedInquiries,
} from "@/features/backoffice-ops/fixtures";
import { InboxBoard } from "@/features/backoffice-ops/InboxBoard";
import { InboxSearch } from "@/features/backoffice-ops/InboxSearch";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";

export const metadata = { title: "Bandeja de trabajo · Backoffice" };

export default function BackofficeInboxPage() {
  return (
    <>
      <PageHeader eyebrow={demoClock.today} title="Bandeja de trabajo" actions={<InboxSearch />} />
      <PageBody className="gap-6!">
        <InboxBoard
          tiles={inboxTiles}
          inquiries={unassignedInquiries}
          companies={pendingCompanies}
          providers={providersInReview}
          advisors={advisors}
          currentAdvisor={currentAdvisor}
        />
      </PageBody>
    </>
  );
}
