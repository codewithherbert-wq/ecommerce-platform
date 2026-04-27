import Link from "next/link";

export const metadata = { title: "FAQ" };

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I track my order?",
    a: "After checkout we email you a tracking code. Enter it on the Track page or follow the link in the email — you'll see live status, location, and a delivery map.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Card payments via Stripe and cryptocurrency via Coinbase Commerce (BTC, ETH, USDC, and more). Both are processed by audited third parties — we never store your card or wallet details.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping is 3–7 business days; express options vary by delivery agency. The exact ETA is shown at checkout once your address and chosen agency are selected.",
  },
  {
    q: "Can I return an item?",
    a: "Yes — most products can be returned within 30 days of delivery for a refund or exchange. Email support to start a return; please don't ship anything back without an RMA reference.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship worldwide through our partner agencies. Customs and duties (where applicable) are the buyer's responsibility.",
  },
  {
    q: "Is my account information secure?",
    a: "Sign-in is handled by NextAuth. Email/password accounts use bcrypt-hashed passwords; OAuth accounts use Google. We never see your password or OAuth credentials in plaintext.",
  },
  {
    q: "I'm an admin — how do I rebrand the store?",
    a: "Sign in as an admin and visit Admin → Shop settings. You can change the store name, logo, hero, theme colors, and feature toggles. Changes apply instantly across the site.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--shop-accent)]">
          Help center
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Quick answers to the questions we get the most. If yours isn&apos;t
          here,{" "}
          <Link href="/contact" className="text-[var(--shop-accent)] underline">
            contact support
          </Link>
          .
        </p>
      </header>

      <div className="mt-8 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {FAQ.map((item, i) => (
          <details key={i} className="group p-4 sm:p-5" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
              {item.q}
              <span className="text-gray-400 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
