"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatMoney, formatDate } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/tracking";
import type { Order, OrderItem, TrackingEvent } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";

export function OrderManager({
  order: initial,
  items,
  events: initialEvents,
}: {
  order: Order;
  items: OrderItem[];
  events: TrackingEvent[];
}) {
  const router = useRouter();
  const [order, setOrder] = useState(initial);
  const [events, setEvents] = useState(initialEvents);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: order.status,
    paymentStatus: order.paymentStatus,
    currentLocation: order.currentLocation ?? "",
    destinationLocation:
      order.destinationLocation ??
      (order.shippingAddress
        ? [
            order.shippingAddress.city,
            order.shippingAddress.state,
            order.shippingAddress.country,
          ]
            .filter(Boolean)
            .join(", ")
        : ""),
    message: "",
  });

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        status: form.status as OrderStatus,
        paymentStatus: form.paymentStatus as
          | "pending"
          | "paid"
          | "failed"
          | "refunded",
        currentLocation: form.currentLocation || null,
        destinationLocation: form.destinationLocation || null,
        // Clearing the name should also clear the cached coordinates so the
        // server re-geocodes next time. Pass null when name is empty.
        currentLat: form.currentLocation ? undefined : null,
        currentLng: form.currentLocation ? undefined : null,
        destinationLat: form.destinationLocation ? undefined : null,
        destinationLng: form.destinationLocation ? undefined : null,
        message: form.message || undefined,
      };
      const { data } = await api.patch<{ order: Order }>(
        `/admin/orders/${order.id}`,
        payload
      );
      setOrder(data.order);
      setForm((f) => ({ ...f, message: "" }));
      // Refresh events list
      const { data: tracking } = await api.get<{ events: TrackingEvent[] }>(
        `/tracking/${order.trackingCode}`
      );
      setEvents(tracking.events ?? []);
      toast.success("Order updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Order {order.trackingCode}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <Link
          href={`/track/${order.trackingCode}`}
          className="text-sm text-[var(--shop-accent)] hover:underline"
          target="_blank"
        >
          View customer-facing tracking →
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Update status</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Order status</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium">Payment status</span>
                <select
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm({ ...form, paymentStatus: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  {["pending", "paid", "failed", "refunded"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <h3 className="mt-6 text-sm font-semibold">Live location</h3>
            <p className="mt-1 text-xs text-gray-500">
              Type a place name (e.g. “Berlin warehouse”, “Lagos, Nigeria”).
              We’ll auto-geocode it for the live map.
              {order.currentLat != null && order.currentLng != null && (
                <>
                  {" "}Last coords: {order.currentLat.toFixed(4)},{" "}
                  {order.currentLng.toFixed(4)}
                </>
              )}
            </p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm">Current location</span>
                <input
                  placeholder="e.g. Berlin distribution center"
                  value={form.currentLocation}
                  onChange={(e) =>
                    setForm({ ...form, currentLocation: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label className="block">
                <span className="text-sm">Destination</span>
                <input
                  placeholder="e.g. Brooklyn, NY"
                  value={form.destinationLocation}
                  onChange={(e) =>
                    setForm({ ...form, destinationLocation: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
            </div>

            <h3 className="mt-6 text-sm font-semibold">Add a tracking event</h3>
            <div className="mt-2">
              <input
                placeholder="Message (optional, e.g. ‘Out for delivery from regional hub’)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <p className="mt-1 text-xs text-gray-500">
                Saving with a new location auto-creates a “Now at …” tracking
                event for the customer.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={save}
                disabled={saving}
                className="rounded-md bg-[var(--shop-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Tracking history</h2>
            {events.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No events yet.</p>
            ) : (
              <ol className="mt-4 space-y-3 border-l border-gray-200 pl-5 dark:border-gray-800">
                {events.map((e) => (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[27px] mt-1.5 h-3 w-3 rounded-full bg-[var(--shop-accent)]" />
                    <div className="text-sm font-medium">
                      {STATUS_LABELS[e.status as OrderStatus] ?? e.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(e.createdAt)}
                      {e.location ? ` · ${e.location}` : ""}
                    </div>
                    {e.message && (
                      <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {e.message}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold">Customer</h2>
            <p className="mt-2 text-sm">{order.customerName}</p>
            <p className="text-sm text-gray-500">{order.customerEmail}</p>
            {order.customerPhone && (
              <p className="text-sm text-gray-500">{order.customerPhone}</p>
            )}
            <h3 className="mt-4 text-sm font-semibold">Address</h3>
            <address className="mt-1 not-italic text-sm text-gray-600 dark:text-gray-400">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}
              {order.shippingAddress.state
                ? `, ${order.shippingAddress.state}`
                : ""}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold">Order</h2>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "success"
                        : order.status === "cancelled"
                        ? "danger"
                        : "info"
                    }
                  >
                    {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Payment</dt>
                <dd className="capitalize">
                  {order.paymentMethod} · {order.paymentStatus}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Agency</dt>
                <dd>{order.deliveryAgencyName ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd>{formatMoney(order.subtotalCents, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Shipping</dt>
                <dd>{formatMoney(order.shippingCents, order.currency)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatMoney(order.totalCents, order.currency)}</dd>
              </div>
            </dl>
            <h3 className="mt-4 text-sm font-semibold">Items</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span className="line-clamp-1">
                    {i.name} × {i.quantity}
                  </span>
                  <span>{formatMoney(i.unitPriceCents * i.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
