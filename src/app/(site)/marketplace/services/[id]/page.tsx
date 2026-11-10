import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ServiceDetail } from "@/features/marketplace/components/ServiceDetail";
import {
  findOperator,
  findProvider,
  findService,
  listAllServices,
  servicesOf,
} from "@/features/marketplace/fixtures";
import { routes } from "@/shared/lib/routes";
import { PublicFooter } from "@/shared/ui/PublicFooter";
import { PublicHeader } from "@/shared/ui/PublicHeader";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return listAllServices().map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = findService(id);
  return service ? { title: service.name, description: service.description ?? undefined } : {};
}

export default async function ServicePage({ params }: Props) {
  const { id } = await params;
  const service = findService(id);
  if (!service) {
    // La landing puede enlazar por el nombre del operador: se lleva a su servicio destacado o a su perfil.
    const provider = findProvider(id);
    if (provider) {
      redirect(provider.kind === "logistics" ? routes.service(provider.featuredServiceId) : routes.provider(provider.id));
    }
    notFound();
  }
  const provider = findOperator(service.providerId);
  if (!provider) notFound();
  const moreServices = servicesOf(provider.id).filter((item) => item.id !== service.id);

  return (
    <>
      <PublicHeader />
      <ServiceDetail service={service} provider={provider} moreServices={moreServices} />
      <PublicFooter />
    </>
  );
}
