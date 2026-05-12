/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Bitcoin,
  Sparkles,
  Star,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { getShopConfig } from "@/lib/shop";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import type { Product } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { ProductCard } from "@/components/ProductCard";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getShopConfig();

  let dbCategories: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    description?: string | null;
  }[] = [];
  try {
    dbCategories = await db.select().from(categories).limit(5);
  } catch {
    dbCategories = [];
  }

  const displayCategories =
    dbCategories.length > 0
      ? dbCategories
      : [
          {
            id: "1",
            name: "Electronics",
            slug: "electronics",
            description: "Latest tech essentials",
            imageUrl: null,
          },
          {
            id: "2",
            name: "Fashion",
            slug: "fashion",
            description: "Style that defines you",
            imageUrl: null,
          },
          {
            id: "3",
            name: "Home & Living",
            slug: "home-living",
            description: "Comfort meets design",
            imageUrl: null,
          },
          {
            id: "4",
            name: "Fitness",
            slug: "fitness",
            description: "Gear for your best self",
            imageUrl: null,
          },
          {
            id: "5",
            name: "Accessories",
            slug: "accessories",
            description: "Small things that matter",
            imageUrl: null,
          },
        ];

  let featured: Product[] = [];
  try {
    featured = await db
      .select()
      .from(products)
      .where(and(eq(products.active, true), eq(products.featured, true)))
      .orderBy(desc(products.createdAt))
      .limit(8);
    if (featured.length === 0) {
      featured = await db
        .select()
        .from(products)
        .where(eq(products.active, true))
        .orderBy(desc(products.createdAt))
        .limit(8);
    }
  } catch {
    featured = [];
  }

  const testimonials = [
    {
      name: "Briar Martin",
      handle: "@neilstellar",
      text: "Super clean and easy to use. These components saved me hours of dev time.",
    },
    {
      name: "Aisha Roberts",
      handle: "@aisha_r",
      text: "Amazing quality and fast shipping! Will definitely be ordering again soon.",
    },
    {
      name: "James Okafor",
      handle: "@jokaf",
      text: "Best online store I've used. The tracking feature is a total game changer.",
    },
    {
      name: "Lucia Moreno",
      handle: "@luciamo",
      text: "Love the variety of products. Found exactly what I was looking for here.",
    },
    {
      name: "Chris Wu",
      handle: "@cwu_dev",
      text: "Crypto payments worked flawlessly. Smooth checkout from start to finish.",
    },
    {
      name: "Femi Adeyemi",
      handle: "@femiade",
      text: "Incredible customer service and a beautiful interface. Highly recommend!",
    },
  ];

  return (
    <>
      {/* ── Animations & Keyframes ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-fade-up   { animation: fadeUp 0.7s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-fade-in   { animation: fadeIn 0.6s ease both; }
        .anim-scale-in  { animation: scaleIn 0.6s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-slide-right { animation: slideRight 0.6s cubic-bezier(.22,.68,0,1.2) both; }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }

        .orb-float { animation: floatOrb 7s ease-in-out infinite; }
        .orb-float-slow { animation: floatOrb 10s ease-in-out infinite reverse; }

        /* Hover lift card */
        .card-hover {
          transition: transform 0.28s cubic-bezier(.22,.68,0,1.2),
                      box-shadow 0.28s ease,
                      border-color 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.12);
        }

        /* Category bubble hover */
        .cat-hover .cat-img-wrap {
          transition: box-shadow 0.25s ease, transform 0.25s cubic-bezier(.22,.68,0,1.2);
        }
        .cat-hover:hover .cat-img-wrap {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px -6px rgba(0,0,0,0.14);
        }
        .cat-hover .cat-label {
          transition: color 0.2s ease;
        }
        .cat-hover:hover .cat-label {
          color: var(--shop-accent);
        }

        /* Feature icon pulse on hover */
        .feature-icon {
          transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s ease;
        }
        .feature-row:hover .feature-icon {
          transform: scale(1.1) rotate(-3deg);
          box-shadow: 0 8px 20px -4px color-mix(in oklab, var(--shop-primary) 50%, transparent);
        }

        /* CTA button shimmer */
        .btn-shimmer {
          background-size: 200% auto;
          background-image: linear-gradient(
            105deg,
            var(--shop-accent) 0%,
            color-mix(in oklab, var(--shop-accent) 70%, #fff) 40%,
            var(--shop-accent) 60%
          );
          transition: background-position 0.5s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-shimmer:hover {
          background-position: right center;
          transform: scale(1.04);
        }

        /* Testimonial card */
        .test-card {
          transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s ease;
        }
        .test-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px -8px rgba(0,0,0,0.10);
        }

        /* Star pulse */
        .star-pulse {
          animation: fadeIn 0.4s ease both;
        }

        /* Stat card */
        .stat-card {
          transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease;
        }
        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px -10px rgba(0,0,0,0.12);
        }

        /* Newsletter input */
        .newsletter-input:focus {
          outline: none;
          border-color: var(--shop-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--shop-primary) 20%, transparent);
        }

        /* Section reveal — use IntersectionObserver via data attributes */
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(.22,.68,0,1.2),
                      transform 0.65s cubic-bezier(.22,.68,0,1.2);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-stagger > * {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s cubic-bezier(.22,.68,0,1.2),
                      transform 0.55s cubic-bezier(.22,.68,0,1.2);
        }
        .reveal-stagger.visible > *:nth-child(1) { opacity:1; transform:none; transition-delay:0s; }
        .reveal-stagger.visible > *:nth-child(2) { opacity:1; transform:none; transition-delay:0.08s; }
        .reveal-stagger.visible > *:nth-child(3) { opacity:1; transform:none; transition-delay:0.16s; }
        .reveal-stagger.visible > *:nth-child(4) { opacity:1; transform:none; transition-delay:0.24s; }
        .reveal-stagger.visible > *:nth-child(5) { opacity:1; transform:none; transition-delay:0.32s; }
        .reveal-stagger.visible > *:nth-child(6) { opacity:1; transform:none; transition-delay:0.40s; }
        .reveal-stagger.visible > *:nth-child(7) { opacity:1; transform:none; transition-delay:0.48s; }
        .reveal-stagger.visible > *:nth-child(8) { opacity:1; transform:none; transition-delay:0.56s; }
      `}</style>

      {/* ── Intersection Observer Script ── */}
      <ScrollAnimation />

      <div className="bg-white dark:bg-gray-950 overflow-x-hidden">
        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative isolate flex min-h-[calc(100vh-68px)] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
          {/* Background gradient */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `linear-gradient(135deg, var(--shop-primary) 0%, color-mix(in oklab, var(--shop-primary) 55%, var(--shop-accent)) 60%, color-mix(in oklab, var(--shop-accent) 70%, #000) 100%)`,
            }}
          />
          {/* Grain overlay */}
          <div
            className="absolute inset-0 -z-10 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />
          {/* Floating orbs */}
          <div className="orb-float absolute -right-32 -top-32 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--shop-accent)] opacity-20 blur-[100px] sm:h-[600px] sm:w-[600px]" />
          <div className="orb-float-slow absolute -bottom-16 -left-16 -z-10 h-[300px] w-[300px] rounded-full bg-white opacity-5 blur-[70px] sm:h-[400px] sm:w-[400px]" />

          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left — copy */}
            <div className="text-white text-center lg:text-left">
              {/* Badge */}
              <div className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-[var(--shop-accent)]" />
                {config.tagline}
              </div>

              <h1 className="anim-fade-up delay-100 mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
                {config.heroHeadline}
              </h1>

              <p className="anim-fade-up delay-200 mt-5 text-[15px] leading-relaxed text-white/75 max-w-md mx-auto lg:mx-0">
                {config.heroSubheadline}
              </p>

              {/* Social proof */}
              <div className="anim-fade-up delay-300 mt-6 flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[
                    "bg-rose-400",
                    "bg-sky-400",
                    "bg-amber-400",
                    "bg-emerald-400",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`grid h-8 w-8 place-items-center rounded-full ${c} text-[10px] font-bold text-white ring-2 ring-[var(--shop-primary)]`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="star-pulse h-3.5 w-3.5 fill-[var(--shop-accent)] text-[var(--shop-accent)]"
                        style={{ animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-white/60">
                    Loved by 2,400+ customers
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="anim-fade-up delay-400 mt-8 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="btn-shimmer group inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-black shadow-lg shadow-[var(--shop-accent)]/30"
                >
                  {config.heroCtaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-100"
                >
                  Track order
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div className="anim-scale-in delay-300 relative hidden lg:flex lg:justify-end">
              {config.heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={config.heroImageUrl}
                  alt=""
                  className="h-[460px] w-[460px] rounded-[2rem] object-cover shadow-2xl"
                />
              ) : (
                <div className="h-[460px] w-[460px] rounded-[2rem] bg-white/10" />
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BROWSE BY CATEGORY
        ══════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="reveal mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--shop-accent)]">
              Shop by interest
            </p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Discover premium products at unbeatable prices curated for
              quality, comfort and style.
            </p>
          </div>

          <div
            className="reveal-stagger grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            }}
          >
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="cat-hover group flex flex-col items-center gap-3"
              >
                <div className="cat-img-wrap w-full aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  {cat.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <ShoppingBag className="h-8 w-8 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                  )}
                </div>
                <div className="text-center">
                  <p className="cat-label text-sm font-semibold text-gray-900 dark:text-white">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURED PRODUCTS
        ══════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="reveal mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--shop-accent)]">
                Handpicked for you
              </p>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Featured products
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Our most-loved items, curated with care.
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[var(--shop-accent)] hover:text-[var(--shop-accent)] hover:scale-105 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-gray-300"
            >
              View all
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="reveal flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-24 text-center dark:border-white/[0.08]">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gray-100 dark:bg-white/[0.06]">
                <Sparkles className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">
                No products yet. Add some from the admin panel.
              </p>
            </div>
          ) : (
            <div className="reveal-stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {featured.map((p) => (
                <div key={p.id} className="card-hover">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile view all */}
          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--shop-primary)] px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:opacity-90 active:scale-100"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            WHY SHOP WITH US
        ══════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="reveal mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--shop-accent)]">
              Our promise
            </p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why shop with us?
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Discover premium products at unbeatable prices curated for
              quality, comfort and style.
            </p>
          </div>

          <div className="reveal-stagger grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            <FeatureRow
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Secure checkout"
              desc="Only registered users can place orders. Encrypted end-to-end."
            />
            <FeatureRow
              icon={<CreditCard className="h-6 w-6" />}
              title="Stripe payments"
              desc="Pay safely with any major credit or debit card."
            />
            <FeatureRow
              icon={<Bitcoin className="h-6 w-6" />}
              title="Crypto accepted"
              desc="Pay with BTC, ETH, USDC and more via Coinbase Commerce."
            />
            <FeatureRow
              icon={<Truck className="h-6 w-6" />}
              title="Live tracking"
              desc="Follow your order on a live map, anywhere."
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="reveal mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--shop-accent)]">
              Social proof
            </p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What our customers say
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Real words from real shoppers who trust us every day.
            </p>
          </div>

          <div className="reveal-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="test-card rounded-2xl border border-gray-100 dark:border-white/[0.08] p-5 bg-white dark:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex-shrink-0 grid place-items-center text-[11px] font-bold text-white"
                    style={{
                      background: `color-mix(in oklab, var(--shop-primary) 80%, var(--shop-accent))`,
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      {t.name}
                      <span className="text-blue-500 text-xs">✓</span>
                    </p>
                    <p className="text-xs text-gray-400">{t.handle}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <Star
                      key={si}
                      className="h-3 w-3 fill-[var(--shop-accent)] text-[var(--shop-accent)]"
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            IMPACT STATS
        ══════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="reveal mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--shop-accent)]">
              By the numbers
            </p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Impact
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Numbers that reflect trust, consistency, and care.
            </p>
          </div>

          <div className="reveal-stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              value="50K+"
              label="Customers worldwide"
              desc="Trusted by thousands of customers shopping every day."
            />
            <StatCard
              value="10K+"
              label="Products Sold"
              desc="Thousands of products we delivered successfully."
            />
            <StatCard
              value="4.9 ★"
              label="Average Rating"
              desc="Top rated store with consistent customer reviews."
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            NEWSLETTER
        ══════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div
            className="reveal rounded-3xl px-6 py-14 text-center sm:px-12"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklab, var(--shop-primary) 8%, transparent), color-mix(in oklab, var(--shop-accent) 6%, transparent))`,
              border: `1px solid color-mix(in oklab, var(--shop-primary) 15%, transparent)`,
            }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--shop-accent)]">
              Stay in the loop
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Get exclusive offers
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Subscribe to receive special discounts, early access deals, and
              new arrivals.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input w-full flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all"
              />
              <button className="w-full sm:w-auto flex-shrink-0 rounded-xl bg-gray-900 dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-gray-900 transition-all hover:scale-105 hover:opacity-90 active:scale-100">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            READY TO UPGRADE CTA
        ══════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="reveal rounded-2xl border border-gray-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-10 sm:px-8 text-center sm:text-left transition-shadow hover:shadow-lg dark:hover:shadow-white/5">
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Ready to upgrade your shopping?
            </h2>
            <Link
              href="/products"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-7 py-3.5 text-sm font-bold text-white dark:text-gray-900 transition-all hover:scale-105 hover:opacity-90 active:scale-100"
            >
              Start Shopping Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="feature-row flex gap-4 rounded-2xl border border-gray-100 dark:border-white/[0.08] p-5 transition-all hover:bg-gray-50 dark:hover:bg-white/[0.03]">
      <div className="feature-icon grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-[var(--shop-primary)] text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  desc,
}: {
  value: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="stat-card rounded-2xl border border-gray-100 dark:border-white/[0.08] p-8 text-center bg-white dark:bg-white/[0.02]">
      <p
        className="text-4xl font-black"
        style={{ color: `var(--shop-accent)` }}
      >
        {value}
      </p>
      <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
        {label}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}
