import { db } from "@/lib/db";
import { shopConfig, type ShopConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT: ShopConfig = {
  id: "singleton",
  name: "My Shop",
  tagline: "Quality products at great prices",
  description: "Welcome to our store.",
  logoUrl: null,
  heroImageUrl: null,
  heroHeadline: "Shop the latest",
  heroSubheadline:
    "Discover hand-picked products, delivered to your door.",
  heroCtaLabel: "Shop now",
  primaryColor: "#111827",
  accentColor: "#f59e0b",
  currency: "USD",
  supportEmail: null,
  enableStripe: true,
  enableCrypto: true,
  featuredCategorySlug: null,
  updatedAt: new Date(),
};

export async function getShopConfig(): Promise<ShopConfig> {
  try {
    const rows = await db
      .select()
      .from(shopConfig)
      .where(eq(shopConfig.id, "singleton"))
      .limit(1);
    if (rows[0]) return rows[0];
    // Create default row on first access.
    const [created] = await db
      .insert(shopConfig)
      .values({ id: "singleton" })
      .onConflictDoNothing()
      .returning();
    return created ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export async function updateShopConfig(
  patch: Partial<ShopConfig>
): Promise<ShopConfig> {
  const [row] = await db
    .insert(shopConfig)
    .values({ id: "singleton", ...patch })
    .onConflictDoUpdate({
      target: shopConfig.id,
      set: { ...patch, updatedAt: new Date() },
    })
    .returning();
  return row;
}
