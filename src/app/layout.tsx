import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ShopThemeStyles } from "@/components/ShopThemeStyles";
import { getShopConfig } from "@/lib/shop";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getShopConfig();
  return {
    title: { default: config.name, template: `%s · ${config.name}` },
    description: config.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = await getShopConfig();
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-gray-900 dark:bg-black dark:text-gray-100">
        <ShopThemeStyles config={config} />
        <Providers>
          <Navbar shopName={config.name} logoUrl={config.logoUrl} />
          <main className="flex-1">{children}</main>
          <Footer config={config} />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
