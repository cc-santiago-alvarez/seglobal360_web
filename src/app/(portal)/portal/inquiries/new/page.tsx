import { findStartingService } from "@/features/portal-client/fixtures";
import { NewInquiry } from "@/features/portal-client/NewInquiry";

export const metadata = { title: "Nueva solicitud" };

type Props = { searchParams: Promise<{ serviceId?: string | string[] }> };

export default async function NewInquiryPage({ searchParams }: Props) {
  const { serviceId } = await searchParams;
  const startingService = findStartingService(Array.isArray(serviceId) ? serviceId[0] : serviceId);
  return <NewInquiry startingService={startingService} />;
}
