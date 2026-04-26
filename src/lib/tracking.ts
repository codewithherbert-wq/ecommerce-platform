import { customAlphabet } from "nanoid";

// Human-friendly tracking codes: e.g. TRK-X7K2-9HQP-1ZM3
const block = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 4);

export function generateTrackingCode(): string {
  return `TRK-${block()}-${block()}-${block()}`;
}

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function statusProgress(status: OrderStatus): number {
  const order = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];
  const i = order.indexOf(status);
  if (i === -1) return 0;
  return Math.round((i / (order.length - 1)) * 100);
}
