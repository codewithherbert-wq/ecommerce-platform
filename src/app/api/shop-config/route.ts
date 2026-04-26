import { NextResponse } from "next/server";
import { z } from "zod";
import { getShopConfig, updateShopConfig } from "@/lib/shop";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const config = await getShopConfig();
  return NextResponse.json({ config });
}

const schema = z.object({
  name: z.string().min(1).optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().nullable().optional(),
  heroImageUrl: z.string().url().nullable().optional(),
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional(),
  heroCtaLabel: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  currency: z.string().length(3).optional(),
  supportEmail: z.string().email().nullable().optional(),
  enableStripe: z.boolean().optional(),
  enableCrypto: z.boolean().optional(),
  featuredCategorySlug: z.string().nullable().optional(),
});

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const config = await updateShopConfig(parsed.data);
  return NextResponse.json({ config });
}
