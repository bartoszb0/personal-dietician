# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A personal diet companion — a greenfield full-stack portfolio project (the author's 5th). The app plays the role of a **personal dietician with habit-forming feedback (Duolingo-style streaks)**, not a bare calorie tracker.

What a user does:

1. **Onboard** → the backend computes deterministic calorie/macro targets from their body stats and goal.
2. **Build a dish library** → they add dishes they eat (name + the calories/macros they enter themselves), reusable day to day.
3. **Log each day** → for each thing eaten they either pick a saved dish or scan a product barcode; it adds to today's running total against target.
4. **Stay consistent** → hitting the day's calorie + protein goal builds a streak; a calendar shows which days were hit or missed.

AI is a **secondary, optional** feature (see decision 7), not the centre of the app. The heart of the product is the deterministic targets + logging + streak loop.

**Core loop (build priority #1):** onboard → get targets → build dish library → log food (saved dish or scanned product) against today's target → streak/calendar feedback. Get this working end to end before anything else.

## Repo structure

Single repo, two independent folders (no workspace tooling — each has its own `package.json`):

- `frontend/` — React 19 SPA (Vite, TypeScript strict). Scaffolded, minimal.
- `backend/` — NestJS + PostgreSQL + **Prisma 7** (do not use TypeORM). Scaffolded: auth, prisma, profile modules exist.

Backend module layout (existing + planned): `auth` (done — cookie JWT), `prisma` (done — global), `profile` (in progress), `nutrition` (calculator — planned), `food` (OFF/USDA providers + product cache — planned), `dish`, `log` (daily entries + streak/calendar — planned), `billing` (Stripe — planned).

## Commands

Frontend (from `frontend/`):

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b + vite build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run format     # Prettier (writes)
npx shadcn@latest add <component>   # add UI components into src/components/ui/
```

Backend (from `backend/`):

```bash
npm run start:dev              # Nest watch mode (listens on PORT, default 3001)
npm run test                   # Jest unit tests
npm run test -- profile        # run a single test file/pattern
npm run test:e2e               # e2e tests
npx prisma migrate dev --name <name>   # create + apply a migration (regenerates client)
npx prisma generate            # regenerate client after a schema edit (do this on every schema change)
npx prisma studio              # inspect the DB
docker compose up -d           # local Postgres (postgres:16, host port 5433)
```

## Key architecture decisions — do not deviate without asking

1. **Targets, streaks, and goal-hit are deterministic backend code — NEVER the AI's job.** This is the app's spine.
   - Targets: pure `NutritionCalculatorService` using Mifflin-St Jeor (men: `10*kg + 6.25*cm − 5*age + 5`; women: same − 161), activity multipliers 1.2–1.9, goal adjustment capped to sane values. Macro defaults: protein 1.6–2 g/kg, fat ~25% of kcal, carbs fill the remainder. Age is derived from `birthDate` at compute time.
   - Goal-hit: a day is a **hit** when that day's total calories AND total protein both fall within **±10%** of the target active that day. A streak is the run of consecutive hit days; the calendar shows per-day hit/miss.
   - Both must be exhaustively unit-tested (formula correctness, ±10% boundaries, empty days, goal caps, macro splits, day-boundary/timezone handling).

2. **Dishes and logging.** A `Dish` is user-created: a name plus its calories/macros, **entered manually**. It may optionally carry free-text "how to make it" instructions and an optional list of products with quantities — but those are reference metadata only; the dish's macros are the user-entered totals and are NOT auto-computed from the products (auto-deriving macros would be recipe-engine territory, out of scope). `DailyLogEntry` = one thing eaten on a day; it references **either** a saved `Dish` **or** a scanned `Product`, and stores a **snapshot** of the calories/macros it contributed, so editing or deleting a dish later never rewrites past days. Today's counter = sum of today's entries.

3. **Versioned nutrition targets.** `NutritionTarget` rows have `effectiveFrom` and are never overwritten. A day's hit/miss and the calendar always compare against the target active on that day, so changing your target today leaves past calendar days judged as they were. Weight is a simple `weightKg` column on `Profile` (decided against a WeightLog history table for v1). Store `birthDate`, not age.

4. **FoodProvider abstraction (barcode/search).** One common interface, two adapters: Open Food Facts (barcode/packaged products, primary — EU coverage) and USDA FoodData Central (generic ingredients). Both normalize into our own `Product` schema; all external food data is cached in Postgres. OFF quirks: a nonexistent barcode returns **HTTP 200 with `"status": 0` in the body** — always check the body, never trust the status code; send a descriptive `User-Agent`; OFF data is ODbL-licensed — attribution required in the UI. Barcode scanning is camera-based in the browser (html5-qrcode or similar).

5. **Onboarding.** Multi-step wizard. `PATCH /profile` upserts partial data per step (all fields optional, but validated with sanity ranges when present: height 100–250 cm, weight 30–300 kg, plausible age). `POST /profile/complete` validates the full set, computes the first `NutritionTarget`, and stamps `onboardingCompletedAt`. Users can override computed targets (`isCustom` flag). A guard redirects incomplete profiles back to the wizard; endpoints that require a finished profile also enforce it server-side. `GET /profile` returns the profile or `null` (null = not onboarded).

6. **Auth (already built — do NOT rebuild).** Cookie-based JWT lives in `backend/src/auth`: register/login/logout/me, a `JwtGuard` + passport strategy that reads the token from an httpOnly `access_token` cookie, throttled auth routes. Reuse this; do not scaffold new auth.

7. **AI meal suggestion (secondary / later).** A small feature, layered on only after the core loop works: given the profile, exclusions, staples, and the calories/protein still remaining today, suggest ONE meal at a time (never full plans). Structured JSON via the Vercel AI SDK (`generateObject`/streaming), savable as a `Dish` and/or logged. Keep the provider swappable behind the AI SDK's provider packages — do not hardcode one. Free tier is capped (metered server-side); Pro removes the cap.

8. **Monetization (later).** Free = dishes, barcode scanning, daily logging, streaks, calendar, dashboard. Pro = unlimited AI suggestions (free capped at 3 generations/day, metered server-side). Stripe Checkout + webhook handler with signature verification; subscription status stored in DB.

## Data model

- `User`, `Profile` (sex, birthDate, heightCm, weightKg, activityLevel, goal, dietType enum, onboardingCompletedAt) — 1:1, `Profile` nullable until onboarding starts.
- `NutritionTarget` (versioned — `effectiveFrom`, `calories`, `proteinG`, `fatG`, `carbsG`, `isCustom`; never updated in place).
- `Product` (normalized from OFF/USDA, cached).
- `Dish` (user-created: name, calories, proteinG, carbsG, fatG, optional `instructions`).
- `DishProduct` (optional join: dishId, productId, quantity — reference only, does not drive dish macros).
- `DailyLogEntry` (userId, date, nullable `dishId` **or** nullable `productId`, servings/amount, snapshot of contributed calories/macros).
- `Subscription`, plus an AI usage metering table.
- Staples/excluded lists (`FavoriteItem` etc.) feed AI suggestions once that feature lands.

Streaks and calendar hit/miss are **computed** from `DailyLogEntry` vs `NutritionTarget` — not stored (a denormalized streak counter can come later if it's a bottleneck).

## Explicitly OUT OF SCOPE for v1

External recipe import; auto-calculating recipes (macros summed/scaled from ingredients — dishes use user-entered totals only); social features; photo food recognition; workout tracking; full-week meal plans generated at once. User-created dishes with optional instructions and an optional product list ARE in scope.

**Refuse scope creep**: if a request drifts into these, remind the user it's out of scope for v1 before doing anything.

## Testing approach

- `NutritionCalculatorService` and streak/goal-hit logic: exhaustive unit tests (pure functions — formulas, ±10% boundaries, caps, empty days, day boundaries).
- e2e tests for critical flows only: onboarding completion, logging a dish, logging a scanned product, streak/calendar computation, (later) AI metering cap and Stripe webhook handling.
- Frontend has no test runner yet; add Vitest when the first meaningful logic appears.

## Environment variables

Backend (`backend/.env`): currently `DATABASE_URL`, `FRONTEND_URL` (CORS origin), `JWT_SECRET`, `PORT` (set to match the frontend's expected API URL). Planned as features land: `USDA_API_KEY` (FoodData Central requires one; OFF does not), Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`), AI provider key (named per chosen provider).

Frontend (`frontend/.env`): `VITE_API_URL`. **Note:** `src/lib/api.ts` currently defaults to `http://localhost:8000` while the backend listens on `3001` — set `VITE_API_URL` (or align the two) or requests will miss.

Never commit `.env` files; keep `.env.example` files current when adding variables.

## Frontend specifics (existing scaffold)

- React 19 + TS strict + Vite, Tailwind CSS v4 via `@tailwindcss/vite` (no tailwind.config — theme lives in `src/index.css`), shadcn/ui on `@base-ui/react`, TanStack Query for server state, axios, react-hook-form + zod, react-router-dom v7, sonner for toasts.
- `src/main.tsx` — app entry; global providers: `QueryClientProvider` → `ThemeProvider` (custom, in `src/components/common/theme-provider.tsx`; light/dark/system persisted to localStorage, synced across tabs, toggled by a global `d` keyboard shortcut — keep new global key handlers from colliding with it) → `App` + `Toaster`.
- `src/App.tsx` — `BrowserRouter` and route definitions; pages in `src/pages/`.
- `src/lib/api.ts` — shared axios instance; all backend calls go through it.
- `src/components/ui/` — generated shadcn components; `src/components/common/` — hand-written shared components.
- Path alias `@/` → `frontend/src/` (in both `vite.config.ts` and `tsconfig`).

## Backend specifics (existing scaffold)

- NestJS 11, listens on `PORT ?? 3001`. Global `ValidationPipe` (`whitelist`, `transform`), global `PrismaExceptionFilter`, global `ThrottlerGuard`, `cookie-parser`, CORS restricted to `FRONTEND_URL` with credentials.
- Prisma 7 with the `pg` driver adapter; client generated to `backend/generated/prisma` (gitignored). `PrismaService` is `@Global`. **Run `npx prisma generate` after every schema edit** — client types otherwise lag the schema.
- `src/common/` holds the shared `@CurrentUser()` decorator, `UserPayload` type, and the Prisma exception filter.
- Local Postgres via `docker-compose.yml` (postgres:16, host port **5433**).

## Conventions

- Validate all external/API responses at the boundary with zod schemas and derive TS types via `z.infer` — never assert hand-written interfaces onto axios generics. Applies doubly to OFF/USDA adapter responses.
- Backend request validation uses class-validator DTOs; business rules (sanity ranges, target/streak computation) live in services, not controllers.
- Keep this file updated when a decision above changes — it is the persistent context for all future sessions.
