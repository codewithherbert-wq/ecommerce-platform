"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { ShopConfig } from "@/lib/db/schema";
import { ImageUpload } from "@/components/ImageUpload";

const PRESETS = [
  {
    label: "Modern minimal (default)",
    primary: "#111827",
    accent: "#f59e0b",
  },
  { label: "Spare parts", primary: "#1f2937", accent: "#ef4444" },
  { label: "Shoes", primary: "#0f172a", accent: "#22c55e" },
  { label: "Electronics", primary: "#0ea5e9", accent: "#facc15" },
  { label: "Fashion", primary: "#6b21a8", accent: "#ec4899" },
];

export function SettingsForm({ config }: { config: ShopConfig }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: config.name,
    tagline: config.tagline,
    description: config.description,
    logoUrl: config.logoUrl ?? "",
    heroImageUrl: config.heroImageUrl ?? "",
    heroHeadline: config.heroHeadline,
    heroSubheadline: config.heroSubheadline,
    heroCtaLabel: config.heroCtaLabel,
    primaryColor: config.primaryColor,
    accentColor: config.accentColor,
    currency: config.currency,
    supportEmail: config.supportEmail ?? "",
    enableStripe: config.enableStripe,
    enableCrypto: config.enableCrypto,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/shop-config", {
        ...form,
        logoUrl: form.logoUrl || null,
        heroImageUrl: form.heroImageUrl || null,
        supportEmail: form.supportEmail || null,
      });
      toast.success("Saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-6">
      <Section title="Branding">
        <Field
          label="Shop name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
        />
        <Field
          label="Tagline"
          value={form.tagline}
          onChange={(v) => setForm({ ...form, tagline: v })}
        />
        <Field
          label="Description"
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
          textarea
        />
        <ImageUpload
          label="Logo"
          value={form.logoUrl}
          onChange={(v) => setForm({ ...form, logoUrl: v })}
        />
        <Field
          label="Support email"
          type="email"
          value={form.supportEmail}
          onChange={(v) => setForm({ ...form, supportEmail: v })}
        />
        <Field
          label="Currency (3-letter ISO, e.g. USD)"
          maxLength={3}
          value={form.currency}
          onChange={(v) => setForm({ ...form, currency: v.toUpperCase() })}
        />
      </Section>

      <Section title="Hero (landing page)">
        <Field
          label="Headline"
          value={form.heroHeadline}
          onChange={(v) => setForm({ ...form, heroHeadline: v })}
        />
        <Field
          label="Subheadline"
          value={form.heroSubheadline}
          onChange={(v) => setForm({ ...form, heroSubheadline: v })}
          textarea
        />
        <Field
          label="CTA button label"
          value={form.heroCtaLabel}
          onChange={(v) => setForm({ ...form, heroCtaLabel: v })}
        />
        <ImageUpload
          label="Hero image"
          value={form.heroImageUrl}
          onChange={(v) => setForm({ ...form, heroImageUrl: v })}
        />
      </Section>

      <Section title="Theme colors">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField
            label="Primary"
            value={form.primaryColor}
            onChange={(v) => setForm({ ...form, primaryColor: v })}
          />
          <ColorField
            label="Accent"
            value={form.accentColor}
            onChange={(v) => setForm({ ...form, accentColor: v })}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  primaryColor: p.primary,
                  accentColor: p.accent,
                })
              }
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {p.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Payment methods">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.enableStripe}
            onChange={(e) =>
              setForm({ ...form, enableStripe: e.target.checked })
            }
          />
          Enable Stripe (card)
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.enableCrypto}
            onChange={(e) =>
              setForm({ ...form, enableCrypto: e.target.checked })
            }
          />
          Enable Coinbase Commerce (crypto)
        </label>
      </Section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--shop-primary)] px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
      ) : (
        <input
          {...rest}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
      )}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1 flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border border-gray-300 dark:border-gray-700"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
      </div>
    </label>
  );
}
