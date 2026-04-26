import Link from "next/link";
import type { ShopConfig } from "@/lib/db/schema";

export function Footer({ config }: { config: ShopConfig }) {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-base font-semibold">{config.name}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {config.tagline}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-500">
              Shop
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:underline">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:underline">
                  Track your order
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-500">
              Support
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {config.supportEmail && (
                <li>
                  <a
                    className="hover:underline"
                    href={`mailto:${config.supportEmail}`}
                  >
                    {config.supportEmail}
                  </a>
                </li>
              )}
              <li className="text-gray-500">
                Secured by Stripe & Coinbase Commerce
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-800">
          © {new Date().getFullYear()} {config.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
