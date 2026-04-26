"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";
import type { DeliveryAgency } from "@/lib/db/schema";
import { Plus, Trash2 } from "lucide-react";

export function AgenciesManager({ initial }: { initial: DeliveryAgency[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [form, setForm] = useState({
    name: "",
    estimatedDays: "",
    priceDollars: "",
  });
  const [saving, setSaving] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post<{ agency: DeliveryAgency }>("/agencies", {
        name: form.name,
        estimatedDays: form.estimatedDays || undefined,
        priceCents: form.priceDollars
          ? Math.round(parseFloat(form.priceDollars) * 100)
          : 0,
      });
      setList([...list, data.agency]);
      setForm({ name: "", estimatedDays: "", priceDollars: "" });
      toast.success("Agency added");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (a: DeliveryAgency) => {
    try {
      const { data } = await api.patch<{ agency: DeliveryAgency }>(
        `/agencies/${a.id}`,
        { active: !a.active }
      );
      setList(list.map((x) => (x.id === a.id ? data.agency : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const remove = async (a: DeliveryAgency) => {
    if (!confirm(`Delete ${a.name}?`)) return;
    try {
      await api.delete(`/agencies/${a.id}`);
      setList(list.filter((x) => x.id !== a.id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <form
        onSubmit={create}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
        />
        <Field
          label="Est. delivery"
          placeholder="e.g. 2-4 business days"
          value={form.estimatedDays}
          onChange={(v) => setForm({ ...form, estimatedDays: v })}
        />
        <Field
          label="Price ($)"
          type="number"
          step="0.01"
          value={form.priceDollars}
          onChange={(v) => setForm({ ...form, priceDollars: v })}
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--shop-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add agency
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Est.</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {list.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3">{a.estimatedDays ?? "—"}</td>
                <td className="px-4 py-3">
                  {a.priceCents === 0 ? "Free" : formatMoney(a.priceCents)}
                </td>
                <td className="px-4 py-3">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={a.active}
                      onChange={() => toggle(a)}
                    />
                    {a.active ? "On" : "Off"}
                  </label>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => remove(a)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No agencies yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
      />
    </label>
  );
}
