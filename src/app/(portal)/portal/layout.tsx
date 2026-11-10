import { PortalShell } from "@/shared/ui/PortalShell";

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      portal="client"
      company={{ name: "Distribuidora Andina S.A.S.", subtitle: "Cliente · Colombia" }}
      user={{ name: "Laura Gómez", role: "Administradora" }}
    >
      {children}
    </PortalShell>
  );
}
