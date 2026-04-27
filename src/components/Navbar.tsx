"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/stores/cart-store";
import { useUI } from "@/stores/ui-store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import type { Category } from "@/lib/db/schema";

const PRIMARY_LINKS: { href: string; label: string }[] = [
  { href: "/products", label: "Shop" },
  { href: "/track", label: "Track order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close any open menus when the route actually changes (no cascade render).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (userMenuOpen) setUserMenuOpen(false);
    if (catsOpen) setCatsOpen(false);
  }

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/categories")
      .then((r) => setCategories(r.data.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={shopName} className="h-8 w-8 rounded" />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded bg-[var(--shop-primary)] text-sm font-bold text-white">
                {shopName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-base font-semibold sm:text-lg">
              {shopName}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-5 text-sm md:flex lg:gap-6">
          {/* Categories dropdown */}
          {categories.length > 0 && (
            <div
              className="relative"
              onMouseEnter={() => setCatsOpen(true)}
              onMouseLeave={() => setCatsOpen(false)}
            >
              <button
                className="inline-flex items-center gap-1 hover:text-[var(--shop-accent)]"
                onClick={() => setCatsOpen((v) => !v)}
              >
                Categories <ChevronDown className="h-4 w-4" />
              </button>
              {catsOpen && (
                <div className="absolute left-0 top-full w-56 rounded-md border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    All products
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-[var(--shop-accent)]"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 hover:text-[var(--shop-accent)]"
            >
              <Settings className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
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
                onClick={() => setUserMenuOpen((v) => !v)}
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
                <span className="hidden max-w-[120px] truncate text-sm lg:inline">
                  {session.user.name ?? session.user.email}
                </span>
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" /> My orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" /> Admin
                    </Link>
                  )}
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
            <div className="flex items-center gap-1">
              <Link
                href="/auth/signin"
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-[var(--shop-primary)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm">
            {PRIMARY_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {l.label}
              </Link>
            ))}
            {categories.length > 0 && (
              <details className="rounded-md">
                <summary className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Categories
                </summary>
                <div className="ml-3 mt-1 flex flex-col">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}`}
                      className="rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </details>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Admin
              </Link>
            )}
            {!session?.user && (
              <Link
                href="/auth/signin"
                className="rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
