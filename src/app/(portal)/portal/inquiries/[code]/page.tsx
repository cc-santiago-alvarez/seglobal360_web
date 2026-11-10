import { notFound } from "next/navigation";
import { findInquiry, inquiryCodes, type InquiryVariant } from "@/features/portal-client/fixtures";
import { InquiryDetailView } from "@/features/portal-client/InquiryDetailView";

export const metadata = { title: "Detalle de solicitud" };

type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ status?: string | string[] }>;
};

export function generateStaticParams() {
  return inquiryCodes.map((code) => ({ code }));
}

export default async function ClientInquiryPage({ params, searchParams }: Props) {
  const [{ code }, { status }] = await Promise.all([params, searchParams]);
  const variant: InquiryVariant = status === "in_contact" ? "in_contact" : "quoted";
  const inquiry = findInquiry(code, variant);
  if (!inquiry) notFound();
  return <InquiryDetailView key={variant} inquiry={inquiry} />;
}
