import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CorridorScreen } from "@/features/backoffice-network/CorridorScreen";
import { corridorDetail, corridors, findCorridor } from "@/features/backoffice-network/fixtures";

type Props = { params: Promise<{ code: string }> };

export function generateStaticParams() {
  return corridors.map((corridor) => ({ code: corridor.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const corridor = findCorridor(code);
  return { title: corridor ? `Corredor ${corridor.code} · Backoffice` : "Corredor no encontrado" };
}

export default async function BackofficeCorridorPage({ params }: Props) {
  const { code } = await params;
  const detail = corridorDetail(code);
  if (!detail) notFound();
  return <CorridorScreen {...detail} />;
}
