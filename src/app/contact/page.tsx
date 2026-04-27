import { getShopConfig } from "@/lib/shop";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await getShopConfig();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--shop-accent)]">
          Contact
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Get in touch</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Questions about an order, a product, or returning something? Drop us
          a note — we usually reply within one business day.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ContactForm supportEmail={config.supportEmail ?? null} />

        <aside className="space-y-4">
          {config.supportEmail && (
            <InfoCard
              icon={Mail}
              title="Email us"
              body={
                <a
                  className="text-[var(--shop-accent)] hover:underline"
                  href={`mailto:${config.supportEmail}`}
                >
                  {config.supportEmail}
                </a>
              }
            />
          )}
          <InfoCard
            icon={MessageSquare}
            title="Live chat"
            body="Available Mon–Fri, 9am–6pm UTC inside your account."
          />
          <InfoCard
            icon={MapPin}
            title="HQ"
            body={`${config.name} · Online-first, shipping worldwide.`}
          />
        </aside>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <Icon className="h-5 w-5 text-[var(--shop-accent)]" />
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{body}</p>
    </div>
  );
}
