import { PortalShell } from "@/shared/ui/PortalShell";

export default function LogisticsPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      portal="logistics"
      company={{ name: "Caribe Freight Group S.A.S.", subtitle: "Operador logístico · Colombia" }}
      user={{ name: "Mateo Herrera", role: "Administrador" }}
    >
      {children}
    </PortalShell>
  );
}
