import { CorridorsScreen } from "@/features/backoffice-network/CorridorsScreen";
import { corridors } from "@/features/backoffice-network/fixtures";

export const metadata = { title: "Corredores · Backoffice" };

export default function BackofficeCorridorsPage() {
  return <CorridorsScreen corridors={corridors} />;
}
