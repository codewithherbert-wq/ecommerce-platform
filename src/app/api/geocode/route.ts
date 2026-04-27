import { NextRequest, NextResponse } from "next/server";
import { geocodeForward } from "@/lib/geocode";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const result = await geocodeForward(q);
  if (!result) {
    return NextResponse.json({ error: "No match" }, { status: 404 });
  }
  return NextResponse.json(result);
}
