import Link from "next/link";
import type { ShopConfig } from "@/lib/db/schema";

export function Footer({ config }: { config: ShopConfig }) {
  return (
    <footer className=" border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 sm:mt-20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold">{config.name}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {config.tagline}
            </p>
          </div>
          <FooterCol
            title="Shop"
            links={[
              { href: "/products", label: "All products" },
              { href: "/track", label: "Track an order" },
              { href: "/orders", label: "My orders" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/faq", label: "FAQ" },
            ]}
          />
          <FooterCol
            title="Policies"
            links={[
              { href: "/shipping", label: "Shipping & returns" },
              { href: "/privacy", label: "Privacy policy" },
              { href: "/terms", label: "Terms of service" },
              ...(config.supportEmail
                ? [
                    {
                      href: `mailto:${config.supportEmail}`,
                      label: config.supportEmail,
                    },
                  ]
                : []),
            ]}
          />
        </div>
        <p className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-800">
          © {new Date().getFullYear()} {config.name}. Secured by Stripe &amp;
          Coinbase Commerce.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase text-gray-500">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
