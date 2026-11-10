import { notFound } from "next/navigation";
import { CargoPanel } from "@/features/backoffice-ops/CargoPanel";
import { findInquiry, interactions, quoteDraft, quoteServiceOptions } from "@/features/backoffice-ops/fixtures";
import { InquiryWorkspace } from "@/features/backoffice-ops/InquiryWorkspace";
import { demo } from "@/shared/lib/routes";

export const metadata = { title: "Solicitud y cotizador · Backoffice" };

export function generateStaticParams() {
  return [{ code: demo.inquiry }];
}

export default async function BackofficeInquiryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const inquiry = findInquiry(code);
  if (!inquiry) notFound();

  return (
    <InquiryWorkspace
      inquiry={inquiry}
      quote={quoteDraft}
      services={quoteServiceOptions}
      interactions={interactions}
      cargo={<CargoPanel cargo={inquiry.cargo} />}
    />
  );
}
