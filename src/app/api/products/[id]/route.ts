import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  compareAtPriceCents: z.number().int().nonnegative().nullable().optional(),
  currency: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).optional(),
  stock: z.number().int().nonnegative().optional(),
  sku: z.string().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const [row] = await db
    .update(products)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return NextResponse.json({ product: row });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const { id } = await ctx.params;
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}
