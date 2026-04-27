import Link from "next/link";
import { Truck, RefreshCcw, Globe2, PackageCheck } from "lucide-react";

export const metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--shop-accent)]">
          Policies
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Shipping &amp; returns
        </h1>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ITEMS.map((it) => (
          <div
            key={it.title}
            className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <it.icon className="h-6 w-6 text-[var(--shop-accent)]" />
            <h3 className="mt-3 text-lg font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {it.body}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Delivery agencies</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          At checkout you can choose from our partner agencies. Each agency
          publishes its own ETA and tracking format; live updates flow back
          into the order tracking page. Admins manage the active set under{" "}
          <Link href="/admin/agencies" className="underline">
            Admin → Delivery agencies
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Returns process</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Email{" "}
            <Link href="/contact" className="underline">
              support
            </Link>{" "}
            within 30 days of delivery, including your tracking code and a
            short reason.
          </li>
          <li>
            We&apos;ll reply with an RMA reference and the return address.
          </li>
          <li>
            Ship the item back in its original packaging. Once received and
            inspected, refunds land back on the original payment method
            within 5–10 business days.
          </li>
        </ol>
      </section>
    </div>
  );
}

const ITEMS = [
  {
    icon: Truck,
    title: "Standard shipping",
    body: "3–7 business days. Tracked end-to-end with live map updates.",
  },
  {
    icon: PackageCheck,
    title: "Express shipping",
    body: "1–3 business days where supported by the chosen delivery agency.",
  },
  {
    icon: Globe2,
    title: "International",
    body: "Worldwide shipping. Customs/duties depend on destination country.",
  },
  {
    icon: RefreshCcw,
    title: "Returns window",
    body: "Most items can be returned within 30 days for refund or exchange.",
  },
];
