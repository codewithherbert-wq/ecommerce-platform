import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { deliveryAgencies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  logoUrl: z.string().url().nullable().optional(),
  description: z.string().optional(),
  estimatedDays: z.string().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
  trackingUrlTemplate: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const [row] = await db
    .update(deliveryAgencies)
    .set(parsed.data)
    .where(eq(deliveryAgencies.id, id))
    .returning();
  return NextResponse.json({ agency: row });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const { id } = await ctx.params;
  await db.delete(deliveryAgencies).where(eq(deliveryAgencies.id, id));
  return NextResponse.json({ ok: true });
}
