"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";

function SignUpInner() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        toast.error("Account created. Please sign in.");
        window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(
          callbackUrl
        )}`;
      } else if (res?.url) {
        toast.success("Welcome!");
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-md px-4 sm:mt-20">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">
          It only takes a minute.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
            <span className="mt-1 block text-xs text-gray-500">
              At least 8 characters.
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--shop-primary)] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-[var(--shop-accent)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <SignUpInner />
    </Suspense>
  );
}
