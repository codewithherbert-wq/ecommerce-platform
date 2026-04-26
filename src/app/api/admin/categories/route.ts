import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(categories).orderBy(categories.sortOrder);
  return NextResponse.json({ categories: rows });
}

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const slug = parsed.data.slug ?? slugify(parsed.data.name);
  const [row] = await db
    .insert(categories)
    .values({ ...parsed.data, slug })
    .returning();
  return NextResponse.json({ category: row });
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(categories).where(eq(categories.id, id));
  return NextResponse.json({ ok: true });
}
