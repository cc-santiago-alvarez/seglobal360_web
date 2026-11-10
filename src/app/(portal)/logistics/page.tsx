import { isProfileStatus, logisticsProfile } from "@/features/portal-provider/fixtures";
import { LogisticsProfile } from "@/features/portal-provider/LogisticsProfile";

export const metadata = { title: "Perfil de operador logístico" };

export default async function LogisticsProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const { status } = await searchParams;
  const initialStatus = isProfileStatus(status) ? status : logisticsProfile.status;
  return <LogisticsProfile key={initialStatus} initialStatus={initialStatus} />;
}
