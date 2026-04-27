export const metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--shop-accent)]">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Terms of service
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Last updated: {new Date().getFullYear()}
        </p>
      </header>

      <div className="prose prose-sm mt-8 max-w-none text-gray-700 dark:text-gray-300">
        <h2>Accounts</h2>
        <p>
          You must be at least the age of majority in your jurisdiction to
          place an order. You&apos;re responsible for keeping your sign-in
          credentials secure.
        </p>
        <h2>Orders &amp; payment</h2>
        <p>
          Prices and stock are shown live in the storefront and may change at
          any time. Orders are confirmed only after payment clears (Stripe or
          Coinbase Commerce). We reserve the right to cancel orders that
          appear fraudulent or that we cannot ship.
        </p>
        <h2>Shipping &amp; returns</h2>
        <p>
          See our{" "}
          <a className="underline" href="/shipping">
            Shipping &amp; returns
          </a>{" "}
          page for ETAs, the returns window, and the RMA process.
        </p>
        <h2>Liability</h2>
        <p>
          The store is provided &ldquo;as is&rdquo; without warranties beyond
          those required by applicable law. To the maximum extent permitted,
          our liability is capped at the amount you paid for the order in
          question.
        </p>
        <h2>Contact</h2>
        <p>
          Questions? Reach us through the{" "}
          <a className="underline" href="/contact">
            contact page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
