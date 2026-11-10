import type { Metadata } from "next";
import { DesignSystemPage } from "@/features/design-system/DesignSystemPage";

export const metadata: Metadata = { title: "Fundamentos visuales" };

export default function DesignSystemRoute() {
  return <DesignSystemPage />;
}
