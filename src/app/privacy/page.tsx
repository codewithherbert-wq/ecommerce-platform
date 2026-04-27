export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--shop-accent)]">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-gray-500">
          Last updated: {new Date().getFullYear()}
        </p>
      </header>

      <div className="prose prose-sm mt-8 max-w-none text-gray-700 dark:text-gray-300">
        <h2>What we collect</h2>
        <p>
          Account: name, email, optionally a password hash (bcrypt) and an
          OAuth profile photo. Orders: shipping address, contact phone, items
          purchased, payment status, and tracking code. We do not store full
          card numbers or crypto wallet credentials — those are processed by
          Stripe and Coinbase Commerce respectively.
        </p>
        <h2>How we use it</h2>
        <ul>
          <li>To fulfil your orders and update tracking.</li>
          <li>To respond when you contact support.</li>
          <li>To improve the storefront and prevent fraud.</li>
        </ul>
        <h2>Who we share with</h2>
        <p>
          The minimum necessary: payment processors (Stripe, Coinbase
          Commerce), the delivery agency you choose at checkout, and our
          hosting/database provider (Neon Postgres). We never sell your data.
        </p>
        <h2>Your rights</h2>
        <p>
          You can request a copy of your data, ask us to delete your account,
          or correct anything we have on file. Email support and we&apos;ll
          handle it.
        </p>
      </div>
    </div>
  );
}
