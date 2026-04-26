"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function SignInInner() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";
  const error = sp.get("error");
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const providers = {
    google: Boolean(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "1"),
    facebook: Boolean(process.env.NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED === "1"),
    dev: Boolean(process.env.NEXT_PUBLIC_DEV_LOGIN === "1"),
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-md px-4">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-gray-500">
          You must be signed in to complete a purchase.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error === "OAuthAccountNotLinked"
              ? "Email is already linked with a different provider. Sign in with that instead."
              : "Sign-in failed. Please try again."}
          </div>
        )}

        <div className="mt-6 space-y-3">
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

          <button
            onClick={() => {
              setLoading("facebook");
              signIn("facebook", { callbackUrl });
            }}
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1877F2] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <FacebookIcon />
            Continue with Facebook
          </button>

          {providers.dev && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoading("dev");
                signIn("dev", { email, password, callbackUrl });
              }}
              className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800"
            >
              <p className="mb-2 text-xs uppercase text-gray-500">
                Dev login (password: <code>password</code>)
              </p>
              <input
                type="email"
                required
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <input
                type="password"
                required
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <button
                type="submit"
                disabled={loading !== null}
                className="mt-2 w-full rounded-md bg-[var(--shop-primary)] py-2 text-sm font-medium text-white"
              >
                Sign in (dev)
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing in you agree to our terms.{" "}
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
    <svg className="h-5 w-5" viewBox="0 0 24 24">
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
        d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.17 7.04l3.68 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
