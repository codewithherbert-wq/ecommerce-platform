import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const Schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const email = parsed.data.email.toLowerCase().trim();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const role = adminEmails.includes(email) ? "admin" : "customer";
  const [created] = await db
    .insert(users)
    .values({
      email,
      name: parsed.data.name,
      passwordHash,
      role,
    })
    .returning();

  return NextResponse.json({ ok: true, userId: created.id });
}
