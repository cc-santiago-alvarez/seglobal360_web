import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProviderProfile } from "@/features/marketplace/components/ProviderProfile";
import { findProvider, listProviders, servicesOf } from "@/features/marketplace/fixtures";
import { PublicFooter } from "@/shared/ui/PublicFooter";
import { PublicHeader } from "@/shared/ui/PublicHeader";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return listProviders().map((provider) => ({ id: provider.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const provider = findProvider(id);
  return provider ? { title: provider.name, description: provider.summary } : {};
}

export default async function ProviderPage({ params }: Props) {
  const { id } = await params;
  const provider = findProvider(id);
  if (!provider) notFound();

  return (
    <>
      <PublicHeader />
      <ProviderProfile provider={provider} services={servicesOf(provider.id)} />
      <PublicFooter />
    </>
  );
}
