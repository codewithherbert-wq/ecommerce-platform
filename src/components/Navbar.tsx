"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  LogOut,
  Package,
  Settings,
  Menu,
  X,
  Home,
  ShoppingBag,
  MapPin,
  Info,
  Mail,
  HelpCircle,
  Search,
  Heart,
} from "lucide-react";
import { useCart } from "@/stores/cart-store";
import { useUI } from "@/stores/ui-store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: ShoppingBag },
  // { href: "/track", label: "Track order", icon: MapPin },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
] as const;

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
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (userMenuOpen) setUserMenuOpen(false);
  }

  useEffect(() => {
    setIsMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = session?.user?.role === "admin";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Top announcement bar ── */}
      <div className="hidden bg-[var(--shop-primary)] py-2 text-center text-xs font-medium tracking-wide text-white sm:block">
        Free shipping on orders over $50 &nbsp;·&nbsp; Use code{" "}
        <span className="font-bold text-[var(--shop-accent)]">WELCOME10</span>{" "}
        for 10% off
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] dark:bg-gray-950 dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
            : "bg-white dark:bg-gray-950"
        }`}
      >
        {/* ── Main bar ── */}
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 border-b border-gray-100 px-4 dark:border-white/[0.06] sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={shopName}
                className="h-10 w-10 rounded-2xl object-cover shadow-sm ring-1 ring-black/[0.06] transition-transform duration-200 group-hover:scale-105 dark:ring-white/10"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--shop-primary)] text-[15px] font-black tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                {shopName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden flex-col sm:flex">
              <span className="text-[15px] font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                {shopName}
              </span>
            </div>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-[13px] font-semibold tracking-wide transition-colors duration-150 ${
                    active
                      ? "text-[var(--shop-accent)]"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {l.label}
                  {/* active pill underline */}
                  <span
                    className={`absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-[var(--shop-accent)] transition-transform duration-200 origin-left ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100 group-hover:opacity-40"
                    }`}
                  />
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`group relative inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-[13px] font-semibold tracking-wide transition-colors duration-150 ${
                  isActive("/admin")
                    ? "text-[var(--shop-accent)]"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Admin
                {isActive("/admin") && (
                  <span className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-[var(--shop-accent)]" />
                )}
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Search icon */}
            <button
              aria-label="Search"
              className="hidden rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white sm:inline-flex"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Wishlist */}
            <button
              aria-label="Wishlist"
              className="hidden rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white sm:inline-flex"
            >
              <Heart className="h-[18px] w-[18px]" />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {isMounted && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--shop-accent)] px-1 text-[10px] font-black text-white shadow-sm">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="mx-1 hidden h-5 w-px bg-gray-200 dark:bg-white/10 sm:block" />

            {/* User */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--shop-accent)]/30"
                    />
                  ) : (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--shop-primary)] to-[var(--shop-accent)] text-xs font-black text-white">
                      {(session.user.name ?? session.user.email ?? "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="hidden flex-col items-start lg:flex">
                    <span className="max-w-[90px] truncate text-xs font-semibold text-gray-900 dark:text-white">
                      {session.user.name ?? "Account"}
                    </span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-gray-900"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    {/* header */}
                    <div className="bg-gradient-to-r from-[var(--shop-primary)]/5 to-[var(--shop-accent)]/5 px-4 py-3">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                        {session.user.name ?? "Account"}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="py-1.5">
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--shop-accent)] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 shrink-0" />
                        <span>My orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--shop-accent)] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4 shrink-0" />
                        <span>Wishlist</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--shop-accent)] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 shrink-0" />
                          <span>Admin panel</span>
                        </Link>
                      )}
                      <div className="mx-3 my-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center sm:flex">
                <Link
                  href="/auth/signup"
                  className="rounded-xl bg-[var(--shop-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-95"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="ml-1 rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06] lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-100 bg-white dark:border-white/[0.06] dark:bg-gray-950">
            {/* Mobile search */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.04]">
                <Search className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-sm text-gray-400">Search products…</span>
              </div>
            </div>

            <nav className="mx-auto flex max-w-7xl flex-col px-4 pb-4 pt-2">
              {NAV_LINKS.map((l) => {
                const active = isActive(l.href);
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[var(--shop-accent)]/10 text-[var(--shop-accent)]"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                        active
                          ? "bg-[var(--shop-accent)]/15"
                          : "bg-gray-100 dark:bg-white/[0.06]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {l.label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--shop-accent)]" />
                    )}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                    isActive("/admin")
                      ? "bg-[var(--shop-accent)]/10 text-[var(--shop-accent)]"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gray-100 dark:bg-white/[0.06]">
                    <Settings className="h-4 w-4" />
                  </span>
                  Admin panel
                </Link>
              )}

              {!session?.user && (
                <div className="mt-3 border-t border-gray-100 pt-3 dark:border-white/[0.06]">
                  <Link
                    href="/auth/signup"
                    className="block rounded-xl bg-[var(--shop-primary)] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
