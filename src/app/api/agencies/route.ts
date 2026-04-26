import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { deliveryAgencies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function GET() {
  const rows = await db
    .select()
    .from(deliveryAgencies)
    .where(eq(deliveryAgencies.active, true));
  return NextResponse.json({ agencies: rows });
}

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  logoUrl: z.string().url().nullable().optional(),
  description: z.string().optional(),
  estimatedDays: z.string().optional(),
  priceCents: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
  trackingUrlTemplate: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const slug = parsed.data.slug ?? slugify(parsed.data.name);
  const [row] = await db
    .insert(deliveryAgencies)
    .values({ ...parsed.data, slug })
    .returning();
  return NextResponse.json({ agency: row });
}
