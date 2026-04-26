# Ecommerce Platform

Full-stack, fully-customizable e-commerce platform with admin panel, multi-payment support, and live order tracking.

## Features

- **Beautiful landing page** with admin-controlled hero, theme colors, and copy
- **Catalog** — products, categories, search, featured items
- **Cart** with Zustand + persisted localStorage
- **Auth** with NextAuth.js (Google + Facebook OAuth) — only registered users can purchase
- **Stripe** card checkout + webhook payment confirmation
- **Coinbase Commerce** crypto checkout (BTC, ETH, USDC, etc.) + webhook
- **Tracking codes** auto-generated per order; live status timeline
- **Geo-map tracking** with Leaflet + OpenStreetMap (free, no API key)
- **Delivery agencies** selectable at checkout, configurable in admin
- **Admin panel** to manage:
  - Products & categories
  - Orders & live status / coordinates
  - Delivery agencies
  - **Shop branding** — name, hero, colors, logo, currency, payment toggles. Re-brand the whole storefront (e.g. as a spare-parts shop, shoe store, etc.) without touching code.

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- Drizzle ORM + Neon Postgres (HTTP driver)
- NextAuth.js v5 (Auth.js) with the Drizzle adapter
- Zustand (cart, UI) — persisted via `localStorage`
- Axios for client API calls
- Lucide React icons
- Sonner for toasts
- Stripe SDK
- Coinbase Commerce REST API
- Leaflet + react-leaflet (OpenStreetMap tiles)

## Getting started

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Configure `.env.local`

You need at minimum `DATABASE_URL` and `AUTH_SECRET`. The rest are optional but unlock features:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | Generated via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public app URL (e.g. `http://localhost:3000`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth |
| `AUTH_FACEBOOK_ID` / `AUTH_FACEBOOK_SECRET` | Facebook OAuth |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Card payments |
| `COINBASE_COMMERCE_API_KEY` / `COINBASE_COMMERCE_WEBHOOK_SECRET` | Crypto payments |
| `ADMIN_EMAILS` | Comma-separated emails granted admin role on first sign-in |
| `ENABLE_DEV_LOGIN` | Set to `1` to enable a no-OAuth dev login (password: `password`) |

### 3. Run migrations

```bash
npm run db:push   # push the schema (dev)
# or
npm run db:generate && npm run db:migrate
```

### 4. (Optional) Seed sample data

```bash
npm run db:seed
```

### 5. Start the dev server

```bash
npm run dev
# open http://localhost:3000
```

## OAuth setup

### Google
1. Visit https://console.cloud.google.com/apis/credentials
2. Create an OAuth client ID (web application)
3. Authorized redirect URI: `<NEXTAUTH_URL>/api/auth/callback/google`

### Facebook
1. Visit https://developers.facebook.com/apps
2. Create an app → Facebook Login → set the redirect URI to `<NEXTAUTH_URL>/api/auth/callback/facebook`

## Stripe webhook

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Coinbase Commerce webhook

In the Coinbase Commerce dashboard, add an endpoint at `<NEXTAUTH_URL>/api/webhooks/coinbase` and copy the shared secret to `COINBASE_COMMERCE_WEBHOOK_SECRET`.

## Admin access

Add your email(s) to `ADMIN_EMAILS` (comma-separated). On your next sign-in your role is promoted to `admin` and the `/admin` panel becomes accessible.

## Project structure

```
src/
├── app/
│   ├── (storefront pages)
│   ├── admin/             # Admin panel (gated)
│   ├── api/               # Route handlers
│   ├── auth/signin/       # Custom sign-in page
│   ├── checkout/          # Multi-step checkout
│   └── track/             # Public order tracking
├── components/            # UI + feature components
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── db/                # Drizzle client + schema
│   ├── stripe.ts
│   ├── coinbase.ts
│   ├── shop.ts            # Shop config helpers
│   └── tracking.ts
├── stores/                # Zustand stores (cart + UI)
└── proxy.ts               # Auth-gated route protection (Next.js 16 proxy)
```

## License

MIT
