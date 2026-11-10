import { PortalShell } from "@/shared/ui/PortalShell";

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell portal="backoffice" user={{ name: "Andrés Rojas", role: "Operaciones" }}>
      {children}
    </PortalShell>
  );
}
