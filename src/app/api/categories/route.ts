import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.name));
    return NextResponse.json({ categories: rows });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
