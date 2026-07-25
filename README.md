# PULSE — Premium Poster Store

A production-ready, single-seller e-commerce platform for premium wall-art posters
(Bikes · Cars · Heroes & Heroines · Nature · Anime). Built with the Next.js App Router,
server-authoritative checkout, and a full admin panel.

> **Business model:** single seller. Only admins create & manage products; customers
> browse and purchase. This is **not** a marketplace.

## Tech stack

| Layer      | Tech |
|------------|------|
| Framework  | Next.js 16 (App Router, RSC, Server Actions) · React 19 · TypeScript |
| Styling    | Tailwind CSS v4 (inline utilities) · Framer Motion · Lucide icons |
| UI         | Hand-built shadcn/Radix primitives |
| Data       | Prisma 6 · Neon PostgreSQL |
| Auth       | NextAuth v5 (Credentials + Google, JWT) |
| State      | Zustand (cart/wishlist/coupon/recently-viewed) · React Query |
| Payments   | Razorpay (UPI/Cards/Netbanking/Wallet) + COD · Stripe-ready |
| Media      | Cloudinary |
| Email      | Resend (transactional) |
| Analytics  | Google Analytics 4 · Meta Pixel |
| Deploy     | Vercel |

## Getting started

```bash
pnpm install                 # deps (this repo is pnpm-managed — do NOT use npm)
cp .env.example .env         # then fill in real values (see below)
pnpm db:push                 # create the schema on your Neon DB
pnpm db:seed                 # seed the 5 categories, demo products, admin, coupons
pnpm dev                     # http://localhost:3000
```

Seeded admin login: **admin@pulse.store** / **Admin@12345** → visit `/admin`.

### Required environment variables

At minimum you need `DATABASE_URL` (Neon) and `AUTH_SECRET`
(`openssl rand -base64 32`). Everything else is optional and the app degrades
gracefully without it:

- **Google login** → `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- **Image uploads** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + an unsigned upload preset
  (`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`). Without it, add images by URL in the admin.
- **Online payments** → `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
  `RAZORPAY_WEBHOOK_SECRET`. Without it, checkout falls back to Cash on Delivery.
- **Email** → `RESEND_API_KEY`
- **Analytics** → `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`

See [`.env.example`](.env.example) for the full list.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | `prisma generate` + production build |
| `pnpm db:push` | Push schema to the database |
| `pnpm db:migrate` | Create a migration |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:studio` | Open Prisma Studio |

## Project structure

```
src/
  app/
    (storefront)/   # public shopping + account routes (header/footer chrome)
    (auth)/         # login / signup (split-screen layout)
    admin/          # admin panel (own layout, role-gated)
    api/            # route handlers (auth, coupon, razorpay webhook, invoice…)
    sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx · icon.tsx
  components/       # ui/ · layout/ · product/ · cart/ · checkout/ · account/ · admin/ …
  server/
    queries/        # server-only data access
    actions/        # server actions (orders, products, account, admin…)
  lib/              # prisma · auth · pricing · razorpay · utils · validations
  hooks/ · config/ · types/
prisma/             # schema.prisma · seed.ts
```

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add all env vars from `.env.example` in the Vercel project settings.
3. Set the Neon **pooled** URL as `DATABASE_URL` and the direct URL as `DIRECT_URL`.
4. Build command is `pnpm build` (runs `prisma generate` first); output is automatic.
5. Add the Razorpay webhook: `https://<your-domain>/api/razorpay/webhook`
   (events: `payment.captured`, `order.paid`) using `RAZORPAY_WEBHOOK_SECRET`.

## Security

Server-authoritative pricing & stock (client prices are never trusted), Zod validation
on every action/route, role-based route protection via middleware, hashed passwords
(bcrypt), Razorpay signature verification, and hardened HTTP headers.
