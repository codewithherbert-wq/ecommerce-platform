import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  primaryKey,
  uuid,
  jsonb,
  doublePrecision,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ---------- NextAuth tables ----------
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"),
  role: text("role").notNull().default("customer"), // "customer" | "admin"
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [
    {
      compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    },
  ]
);

// ---------- Shop configuration (fully customizable) ----------
export const shopConfig = pgTable("shop_config", {
  id: text("id").primaryKey().default("singleton"),
  name: text("name").notNull().default("My Shop"),
  tagline: text("tagline").notNull().default("Quality products at great prices"),
  description: text("description")
    .notNull()
    .default("Welcome to our store."),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  heroHeadline: text("hero_headline").notNull().default("Shop the latest"),
  heroSubheadline: text("hero_subheadline").notNull().default(
    "Discover hand-picked products, delivered to your door."
  ),
  heroCtaLabel: text("hero_cta_label").notNull().default("Shop now"),
  primaryColor: text("primary_color").notNull().default("#111827"),
  accentColor: text("accent_color").notNull().default("#f59e0b"),
  currency: text("currency").notNull().default("USD"),
  supportEmail: text("support_email"),
  enableStripe: boolean("enable_stripe").notNull().default(true),
  enableCrypto: boolean("enable_crypto").notNull().default(true),
  featuredCategorySlug: text("featured_category_slug"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- Catalog ----------
export const categories = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  compareAtPriceCents: integer("compare_at_price_cents"),
  currency: text("currency").notNull().default("USD"),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  stock: integer("stock").notNull().default(0),
  sku: text("sku"),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- Delivery agencies ----------
export const deliveryAgencies = pgTable("delivery_agency", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  description: text("description"),
  estimatedDays: text("estimated_days"), // e.g. "2-4 business days"
  priceCents: integer("price_cents").notNull().default(0),
  active: boolean("active").notNull().default(true),
  trackingUrlTemplate: text("tracking_url_template"), // optional external tracking
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- Orders ----------
export const orders = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  trackingCode: text("tracking_code").notNull().unique(),
  status: text("status").notNull().default("pending"),
  // pending | paid | processing | shipped | out_for_delivery | delivered | cancelled | refunded
  paymentStatus: text("payment_status").notNull().default("pending"),
  // pending | paid | failed | refunded
  paymentMethod: text("payment_method").notNull().default("stripe"),
  // stripe | crypto
  paymentRef: text("payment_ref"), // stripe session id / coinbase charge id
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").notNull().default("USD"),

  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),

  shippingAddress: jsonb("shipping_address")
    .$type<{
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    }>()
    .notNull(),

  deliveryAgencyId: uuid("delivery_agency_id").references(() => deliveryAgencies.id, {
    onDelete: "set null",
  }),
  deliveryAgencyName: text("delivery_agency_name"),

  // Live tracking — human-readable location names (primary) + optional coords
  currentLocation: text("current_location"),
  destinationLocation: text("destination_location"),
  currentLat: doublePrecision("current_lat"),
  currentLng: doublePrecision("current_lng"),
  destinationLat: doublePrecision("destination_lat"),
  destinationLng: doublePrecision("destination_lng"),

  notes: text("notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export const trackingEvents = pgTable("tracking_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  message: text("message").notNull(),
  location: text("location"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- Type exports ----------
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type DeliveryAgency = typeof deliveryAgencies.$inferSelect;
export type ShopConfig = typeof shopConfig.$inferSelect;
