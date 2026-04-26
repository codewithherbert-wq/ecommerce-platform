import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function GET() {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.active, true))
    .orderBy(desc(products.createdAt));
  return NextResponse.json({ products: rows });
}

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().default(""),
  priceCents: z.number().int().nonnegative(),
  compareAtPriceCents: z.number().int().nonnegative().optional(),
  currency: z.string().default("USD"),
  imageUrl: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).default([]),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const slug = parsed.data.slug ?? slugify(parsed.data.name);
  const [row] = await db
    .insert(products)
    .values({ ...parsed.data, slug })
    .returning();
  return NextResponse.json({ product: row });
}
