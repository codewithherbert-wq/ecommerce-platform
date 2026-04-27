"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CreditCard, Bitcoin, Loader2, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/stores/cart-store";
import { formatMoney } from "@/lib/utils";
import { toast } from "sonner";
import type { DeliveryAgency, ShopConfig } from "@/lib/db/schema";

type Props = {
  user: { name: string; email: string };
  agencies: DeliveryAgency[];
  config: ShopConfig;
};

export function CheckoutForm({ user, agencies, config }: Props) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotalCents());
  const clear = useCart((s) => s.clear);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"stripe" | "crypto" | "cod">(
    config.enableStripe ? "stripe" : config.enableCrypto ? "crypto" : "cod"
  );
  const [agencyId, setAgencyId] = useState(agencies[0]?.id ?? "");
  const [form, setForm] = useState({
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  const agency = useMemo(
    () => agencies.find((a) => a.id === agencyId),
    [agencies, agencyId]
  );
  const shippingCents = agency?.priceCents ?? 0;
  const total = subtotal + shippingCents;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!agencyId) {
      toast.error("Please pick a delivery agency");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          imageUrl: i.imageUrl,
          unitPriceCents: i.priceCents,
          quantity: i.quantity,
        })),
        deliveryAgencyId: agencyId,
        paymentMethod: method,
        ...form,
      };

      const endpoint =
        method === "stripe"
          ? "/checkout/stripe"
          : method === "crypto"
          ? "/checkout/crypto"
          : "/checkout/cod";
      const { data } = await api.post<{
        url: string;
        orderId: string;
        trackingCode: string;
      }>(endpoint, payload);
      clear();
      toast.success(
        method === "cod"
          ? `Order placed! Tracking code ${data.trackingCode}`
          : "Redirecting to payment…"
      );
      // COD: go straight to live tracking. Stripe/Coinbase: hosted gateway URL.
      window.location.href = data.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast.error(msg);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <p className="mt-6 text-sm text-gray-500">
        Your cart is empty.{" "}
        <Link href="/products" className="underline">
          Browse products
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold">Contact</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Full name"
              value={form.customerName}
              onChange={(v) => setForm({ ...form, customerName: v })}
              required
            />
            <LabeledInput
              label="Email"
              type="email"
              value={form.customerEmail}
              onChange={(v) => setForm({ ...form, customerEmail: v })}
              required
            />
            <LabeledInput
              label="Phone (optional)"
              value={form.customerPhone}
              onChange={(v) => setForm({ ...form, customerPhone: v })}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Shipping address</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Address line 1"
              value={form.line1}
              onChange={(v) => setForm({ ...form, line1: v })}
              required
              className="sm:col-span-2"
            />
            <LabeledInput
              label="Address line 2"
              value={form.line2}
              onChange={(v) => setForm({ ...form, line2: v })}
              className="sm:col-span-2"
            />
            <LabeledInput
              label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
              required
            />
            <LabeledInput
              label="State/Region"
              value={form.state}
              onChange={(v) => setForm({ ...form, state: v })}
            />
            <LabeledInput
              label="Postal code"
              value={form.postalCode}
              onChange={(v) => setForm({ ...form, postalCode: v })}
              required
            />
            <LabeledInput
              label="Country (ISO 2)"
              value={form.country}
              onChange={(v) => setForm({ ...form, country: v.toUpperCase() })}
              required
              maxLength={2}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Delivery agency</h2>
          {agencies.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              No delivery agencies configured. An admin must add one.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {agencies.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                    agencyId === a.id
                      ? "border-[var(--shop-primary)] bg-gray-50 dark:bg-gray-900"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="agency"
                    value={a.id}
                    checked={agencyId === a.id}
                    onChange={() => setAgencyId(a.id)}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.name}</div>
                    {a.estimatedDays && (
                      <div className="text-xs text-gray-500">
                        {a.estimatedDays}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold">
                    {a.priceCents === 0
                      ? "Free"
                      : formatMoney(a.priceCents, config.currency)}
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Payment method</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {config.enableStripe && (
              <PaymentChoice
                active={method === "stripe"}
                onClick={() => setMethod("stripe")}
                icon={<CreditCard className="h-5 w-5" />}
                title="Card"
                desc="Pay with credit/debit card via Stripe"
              />
            )}
            {config.enableCrypto && (
              <PaymentChoice
                active={method === "crypto"}
                onClick={() => setMethod("crypto")}
                icon={<Bitcoin className="h-5 w-5" />}
                title="Crypto"
                desc="BTC, ETH, USDC — via Coinbase Commerce"
              />
            )}
            <PaymentChoice
              active={method === "cod"}
              onClick={() => setMethod("cod")}
              icon={<Truck className="h-5 w-5" />}
              title="Pay on delivery"
              desc="Place the order now and pay when it arrives"
            />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-gray-200 p-5 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-2">
              <span className="line-clamp-1">
                {i.name} × {i.quantity}
              </span>
              <span className="tabular-nums">
                {formatMoney(i.priceCents * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
          <Row label="Subtotal" value={formatMoney(subtotal)} />
          <Row
            label="Shipping"
            value={shippingCents === 0 ? "Free" : formatMoney(shippingCents)}
          />
          <Row label="Total" value={formatMoney(total)} bold />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--shop-primary)] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading
            ? "Processing…"
            : method === "cod"
            ? `Place order — ${formatMoney(total)}`
            : `Pay ${formatMoney(total)}`}
        </button>
        <p className="mt-3 text-center text-xs text-gray-500">
          Only registered users can purchase. Your details are secure.
        </p>
      </aside>
    </form>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  className,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm font-medium">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--shop-accent)] dark:border-gray-700 dark:bg-gray-900"
      />
    </label>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "text-base font-semibold" : ""
      }`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PaymentChoice({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-md border p-3 text-left ${
        active
          ? "border-[var(--shop-primary)] bg-gray-50 dark:bg-gray-900"
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="mt-0.5 text-[var(--shop-primary)]">{icon}</div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
    </button>
  );
}
