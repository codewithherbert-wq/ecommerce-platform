import "dotenv/config";
import { db } from "../src/lib/db";
import {
  shopConfig,
  categories,
  products,
  deliveryAgencies,
} from "../src/lib/db/schema";
import { slugify } from "../src/lib/utils";

async function main() {
  console.log("Seeding shop config…");
  await db
    .insert(shopConfig)
    .values({
      id: "singleton",
      name: "Acme Marketplace",
      tagline: "Your one-stop online shop",
      description: "Everything you need, delivered fast.",
      heroHeadline: "Quality products, delivered fast",
      heroSubheadline:
        "Hand-picked items from trusted suppliers, with live order tracking.",
      heroCtaLabel: "Shop now",
      primaryColor: "#111827",
      accentColor: "#f59e0b",
      currency: "USD",
      supportEmail: "support@example.com",
      enableStripe: true,
      enableCrypto: true,
    })
    .onConflictDoNothing();

  console.log("Seeding categories…");
  const cats = [
    { name: "Electronics", sortOrder: 1 },
    { name: "Clothing", sortOrder: 2 },
    { name: "Home", sortOrder: 3 },
    { name: "Accessories", sortOrder: 4 },
  ];
  for (const c of cats) {
    await db
      .insert(categories)
      .values({ ...c, slug: slugify(c.name) })
      .onConflictDoNothing();
  }
  const allCats = await db.select().from(categories);
  const electronicsId = allCats.find((c) => c.slug === "electronics")?.id;
  const clothingId = allCats.find((c) => c.slug === "clothing")?.id;
  const homeId = allCats.find((c) => c.slug === "home")?.id;

  console.log("Seeding products…");
  const sample = [
    {
      name: "Wireless headphones",
      description: "Crystal-clear sound, 30-hour battery life.",
      priceCents: 12999,
      compareAtPriceCents: 17999,
      stock: 25,
      featured: true,
      categoryId: electronicsId,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    },
    {
      name: "Smart watch",
      description: "Heart-rate, GPS, and 7-day battery.",
      priceCents: 19999,
      stock: 18,
      featured: true,
      categoryId: electronicsId,
      imageUrl:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    },
    {
      name: "Cotton T-shirt",
      description: "Soft, breathable, every-day comfort.",
      priceCents: 2499,
      stock: 100,
      categoryId: clothingId,
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    },
    {
      name: "Ceramic mug",
      description: "Hand-crafted, 12oz capacity.",
      priceCents: 1499,
      stock: 200,
      categoryId: homeId,
      imageUrl:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    },
  ];
  for (const p of sample) {
    await db
      .insert(products)
      .values({ ...p, slug: slugify(p.name) })
      .onConflictDoNothing();
  }

  console.log("Seeding delivery agencies…");
  const agencies = [
    { name: "Standard shipping", estimatedDays: "3-5 business days", priceCents: 499 },
    { name: "Express shipping", estimatedDays: "1-2 business days", priceCents: 1499 },
    { name: "Local pickup", estimatedDays: "Same day", priceCents: 0 },
  ];
  for (const a of agencies) {
    await db
      .insert(deliveryAgencies)
      .values({ ...a, slug: slugify(a.name) })
      .onConflictDoNothing();
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
