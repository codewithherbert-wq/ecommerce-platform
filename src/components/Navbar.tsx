"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Package, Settings } from "lucide-react";
import { useCart } from "@/stores/cart-store";
import { useUI } from "@/stores/ui-store";
import { useState } from "react";

export function Navbar({
  shopName,
  logoUrl,
}: {
  shopName: string;
  logoUrl: string | null;
}) {
  const { data: session } = useSession();
  const count = useCart((s) => s.count());
  const openCart = useUI((s) => s.openCart);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={shopName} className="h-8 w-8 rounded" />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded bg-[var(--shop-primary)] text-sm font-bold text-white">
              {shopName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-lg font-semibold">{shopName}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/products" className="hover:text-[var(--shop-accent)]">
            Shop
          </Link>
          <Link href="/track" className="hover:text-[var(--shop-accent)]">
            Track order
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-[var(--shop-accent)] inline-flex items-center gap-1"
            >
              <Settings className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--shop-accent)] px-1 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </button>

          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-7 w-7 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="hidden text-sm sm:inline">
                  {session.user.name ?? session.user.email}
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" /> My orders
                  </Link>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-md bg-[var(--shop-primary)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
