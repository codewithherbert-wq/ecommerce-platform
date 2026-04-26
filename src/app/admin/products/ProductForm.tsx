"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/db/schema";

type Props = {
  product?: Product;
  categories: Category[];
};

export function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    priceDollars: product ? (product.priceCents / 100).toString() : "",
    compareAtDollars: product?.compareAtPriceCents
      ? (product.compareAtPriceCents / 100).toString()
      : "",
    currency: product?.currency ?? "USD",
    imageUrl: product?.imageUrl ?? "",
    images: product?.images?.join("\n") ?? "",
    stock: product?.stock.toString() ?? "0",
    sku: product?.sku ?? "",
    categoryId: product?.categoryId ?? "",
    featured: product?.featured ?? false,
    active: product?.active ?? true,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description,
        priceCents: Math.round(parseFloat(form.priceDollars) * 100),
        compareAtPriceCents: form.compareAtDollars
          ? Math.round(parseFloat(form.compareAtDollars) * 100)
          : undefined,
        currency: form.currency,
        imageUrl: form.imageUrl || null,
        images: form.images
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        stock: parseInt(form.stock, 10) || 0,
        sku: form.sku || null,
        categoryId: form.categoryId || null,
        featured: form.featured,
        active: form.active,
      };
      if (product) {
        await api.patch(`/products/${product.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!product) return;
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    try {
      await api.delete(`/products/${product.id}`);
      toast.success("Deleted");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
    >
      <Field
        label="Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        required
      />
      <Field
        label="Slug (optional — auto-generated from name)"
        value={form.slug}
        onChange={(v) => setForm({ ...form, slug: v })}
      />
      <Field
        label="Description"
        value={form.description}
        onChange={(v) => setForm({ ...form, description: v })}
        textarea
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Price ($)"
          type="number"
          value={form.priceDollars}
          onChange={(v) => setForm({ ...form, priceDollars: v })}
          required
          step="0.01"
        />
        <Field
          label="Compare-at price ($)"
          type="number"
          value={form.compareAtDollars}
          onChange={(v) => setForm({ ...form, compareAtDollars: v })}
          step="0.01"
        />
        <Field
          label="Stock"
          type="number"
          value={form.stock}
          onChange={(v) => setForm({ ...form, stock: v })}
        />
      </div>
      <Field
        label="Main image URL"
        value={form.imageUrl}
        onChange={(v) => setForm({ ...form, imageUrl: v })}
      />
      <Field
        label="Additional image URLs (one per line)"
        value={form.images}
        onChange={(v) => setForm({ ...form, images: v })}
        textarea
      />
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">— Uncategorized —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active (visible in shop)
        </label>
      </div>

      <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
        {product ? (
          <button
            type="button"
            onClick={remove}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        ) : (
          <div />
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[var(--shop-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
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
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          rows={4}
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
