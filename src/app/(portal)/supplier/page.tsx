import { isProfileStatus, supplierProfile } from "@/features/portal-provider/fixtures";
import { SupplierProfile } from "@/features/portal-provider/SupplierProfile";

export const metadata = { title: "Perfil de proveedor" };

export default async function SupplierProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const { status } = await searchParams;
  const initialStatus = isProfileStatus(status) ? status : supplierProfile.status;
  return <SupplierProfile key={initialStatus} initialStatus={initialStatus} />;
}
