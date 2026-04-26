"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { Category } from "@/lib/db/schema";

export function CategoriesManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [saving, setSaving] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post<{ category: Category }>(
        "/admin/categories",
        { name, sortOrder: parseInt(sortOrder, 10) || 0 }
      );
      setList([...list, data.category]);
      setName("");
      toast.success("Category added");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete ${c.name}?`)) return;
    try {
      await api.delete(`/admin/categories?id=${c.id}`);
      setList(list.filter((x) => x.id !== c.id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <form
        onSubmit={add}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Sort order</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-1 block w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--shop-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {list.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <div>
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-xs text-gray-500">/{c.slug}</span>
            </div>
            <button
              onClick={() => remove(c)}
              className="text-red-600 hover:text-red-800"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {list.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-gray-500">
            No categories yet.
          </li>
        )}
      </ul>
    </div>
  );
}
