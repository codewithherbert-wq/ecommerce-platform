"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";

function SignInInner() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";
  const error = sp.get("error");
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleEnabled =
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "1";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(null);
    if (res?.error) {
      toast.error("Invalid email or password");
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-md px-4 sm:mt-20">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">
          You must be signed in to complete a purchase.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
            {error === "OAuthAccountNotLinked"
              ? "This email is linked to a different provider. Use that one instead."
              : "Sign-in failed. Please try again."}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <button
            type="submit"
            disabled={loading !== null}
            className="w-full rounded-md bg-[var(--shop-primary)] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading === "credentials" ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm">
          New here?{" "}
          <Link
            href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-[var(--shop-accent)] hover:underline"
          >
            Create an account
          </Link>
        </p>

        {googleEnabled && (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs uppercase text-gray-500">or</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>
            <button
              onClick={() => {
                setLoading("google");
                signIn("google", { callbackUrl });
              }}
              disabled={loading !== null}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          <Link href="/" className="underline">
            Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <SignInInner />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.22-4.75 3.22-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.17v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.12c-.22-.66-.34-1.36-.34-2.12s.12-1.46.34-2.12V7.04H2.17C1.42 8.54 1 10.23 1 12s.42 3.46 1.17 4.96l3.68-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.17 7.04l3.68 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
