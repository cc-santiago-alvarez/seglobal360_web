import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SEGlobal 360 · Productos y logística entre Colombia y Costa Rica",
    template: "%s · SEGlobal 360",
  },
  description:
    "Marketplace B2B que conecta empresas mayoristas con proveedores y operadores logísticos entre Colombia y Costa Rica.",
  applicationName: "SEGlobal 360",
};

export const viewport: Viewport = {
  themeColor: "#061024",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-ivory font-sans text-navy-900">{children}</body>
    </html>
  );
}
