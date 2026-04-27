import { getShopConfig } from "@/lib/shop";
import Link from "next/link";
import { Sparkles, Truck, ShieldCheck, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const config = await getShopConfig();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--shop-accent)]">
          About us
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Built for shoppers who care about quality.
        </h1>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
          {config.description}
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <f.icon className="h-6 w-6 text-[var(--shop-accent)]" />
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {f.body}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl font-bold">Our story</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            We started {config.name} because we wanted shopping online to feel
            simple, trustworthy, and fast. Every product on the storefront is
            hand-picked, every order is tracked end-to-end, and every customer
            gets real human support when something isn&apos;t right.
          </p>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Today we ship worldwide through a curated set of delivery partners,
            accept both card and cryptocurrency payments, and let the team
            re-brand the entire storefront in minutes — so the same platform
            can run a spare-parts shop, a sneaker drop, or anything in between.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/products"
              className="rounded-md bg-[var(--shop-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Shop products
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Get in touch
            </Link>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900"
            >
              <dt className="text-xs uppercase text-gray-500">{s.label}</dt>
              <dd className="mt-1 text-2xl font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "Hand-picked catalog",
    body: "Every product is reviewed before it goes live in the store.",
  },
  {
    icon: Truck,
    title: "Live tracking",
    body: "Watch your order on a live map until it lands at your door.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    body: "Card payments via Stripe, crypto via Coinbase Commerce.",
  },
  {
    icon: HeartHandshake,
    title: "Real support",
    body: "Email a human, get an answer in plain language — no bots.",
  },
];

const STATS = [
  { label: "Orders shipped", value: "12k+" },
  { label: "Countries", value: "30+" },
  { label: "Avg. rating", value: "4.8" },
];
