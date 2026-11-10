import { PortalShell } from "@/shared/ui/PortalShell";

export default function SupplierPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      portal="supplier"
      company={{ name: "TecnoAndina Distribuciones S.A.S.", subtitle: "Proveedor mayorista · Colombia" }}
      user={{ name: "Laura Restrepo", role: "Administrador" }}
    >
      {children}
    </PortalShell>
  );
}
