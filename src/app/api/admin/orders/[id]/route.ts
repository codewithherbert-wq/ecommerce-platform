import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { orders, trackingEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/tracking";

const schema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  currentLat: z.number().nullable().optional(),
  currentLng: z.number().nullable().optional(),
  destinationLat: z.number().nullable().optional(),
  destinationLng: z.number().nullable().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
  notes: z.string().nullable().optional(),
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
  const {
    status,
    paymentStatus,
    currentLat,
    currentLng,
    destinationLat,
    destinationLng,
    location,
    message,
    notes,
  } = parsed.data;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (status) updates.status = status;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (currentLat !== undefined) updates.currentLat = currentLat;
  if (currentLng !== undefined) updates.currentLng = currentLng;
  if (destinationLat !== undefined) updates.destinationLat = destinationLat;
  if (destinationLng !== undefined) updates.destinationLng = destinationLng;
  if (notes !== undefined) updates.notes = notes;

  const [row] = await db
    .update(orders)
    .set(updates)
    .where(eq(orders.id, id))
    .returning();

  // Log a tracking event when status changes or when admin adds a note.
  if (status || message || location) {
    await db.insert(trackingEvents).values({
      orderId: id,
      status: status ?? row.status,
      message:
        message ??
        (status ? `Status updated: ${STATUS_LABELS[status]}` : "Update"),
      location: location ?? null,
      lat: currentLat ?? null,
      lng: currentLng ?? null,
    });
  }

  return NextResponse.json({ order: row });
}
