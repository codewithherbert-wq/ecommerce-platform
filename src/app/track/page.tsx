"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function TrackIndex() {
  const [code, setCode] = useState("");
  const router = useRouter();
  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-bold">Track your order</h1>
      <p className="mt-2 text-sm text-gray-500">
        Enter the tracking code you received at checkout.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) router.push(`/track/${code.trim().toUpperCase()}`);
        }}
        className="mt-6 flex gap-2"
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="TRK-XXXX-XXXX-XXXX"
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--shop-accent)] dark:border-gray-700 dark:bg-gray-900"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-[var(--shop-primary)] px-4 text-sm font-medium text-white hover:opacity-90"
        >
          <Search className="h-4 w-4" /> Track
        </button>
      </form>
    </div>
  );
}
