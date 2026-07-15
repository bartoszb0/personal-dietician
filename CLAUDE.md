# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**AI Diet Tracker Companion** — a greenfield full-stack portfolio project (the author's 5th). Users scan/search food products, build a personal pantry, mark favorites ("staples"), log daily meals against computed calorie/macro targets, and get AI-generated meal suggestions one meal at a time based on their staples and remaining daily budget.

**Core loop (build priority #1):** onboard → scan/search product → log food → AI suggests next meal to fit remaining budget. Everything else is secondary until this loop works end to end.

## Repo structure

Single repo, two independent folders (no workspace tooling — each has its own `package.json`):

- `frontend/` — React 19 SPA (Vite, TypeScript strict). Exists, scaffolded.
- `backend/` — NestJS + PostgreSQL + **Prisma** (decided; do not use TypeORM). Not yet scaffolded.

Proposed backend module layout: `auth` (reused JWT modules), `profile`, `nutrition` (calculator), `food` (providers + product cache), `pantry`, `log` (daily entries), `ai` (meal generation + usage metering), `billing` (Stripe).

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

Backend (once scaffolded, from `backend/`): standard Nest scripts (`start:dev`, `test`, `test:e2e`) plus `npx prisma migrate dev` / `npx prisma studio`. Postgres runs locally (add a `docker-compose.yml` when scaffolding the backend).

## Key architecture decisions — do not deviate without asking

1. **FoodProvider abstraction.** One common interface, two adapters: Open Food Facts (barcode/packaged products, primary — EU coverage) and USDA FoodData Central (generic ingredients). Both normalize into our own `Product` schema; all external food data is cached in Postgres. OFF quirks: a nonexistent barcode returns **HTTP 200 with `"status": 0` in the body** — always check the body, never trust the status code; send a descriptive `User-Agent`; OFF data is ODbL-licensed — attribution required in the UI.
2. **Pantry ≠ Staples.** Pantry = every product a user has ever scanned/saved; saving is automatic on scan (grows passively). Staples/favorites = curated subset the AI builds meals from (explicit user action). There is also an excluded/disliked list fed into the AI prompt.
3. **TDEE/macro math is deterministic backend code — NEVER the AI's job.** Pure `NutritionCalculatorService` using Mifflin-St Jeor (men: `10*kg + 6.25*cm − 5*age + 5`; women: same − 161), activity multipliers 1.2–1.9, goal adjustment capped to sane values. Macro defaults: protein 1.6–2 g/kg, fat ~25% of kcal, carbs fill the remainder. This service must be exhaustively unit-tested.
4. **AI generates ONE meal at a time, not full plans.** Inputs: user profile, dietary prefs/exclusions, staples list, remaining calories/macros today, time of day, meals already eaten. Output: structured JSON meal card via Vercel AI SDK (`generateObject`/streaming), rendered as it streams, savable to the daily log. "Plan my day" is just sequential meal generations sharing a budget — later feature. Model provider is intentionally undecided: keep provider wiring behind the AI SDK's provider packages so it's swappable; don't hardcode one.
5. **Versioned nutrition targets.** `NutritionTarget` rows have `effectiveFrom` and are never overwritten, so historical daily logs compare against the target active at that time. Weight is a log (`WeightLog`), not a profile column — gives a free progress chart. Store `birthDate`, not age.
6. **Onboarding:** multi-step wizard; `PATCH /profile` saves partial data per step; `POST /profile/complete` validates everything, computes targets, stamps `onboardingCompletedAt`. Users can override computed targets (`isCustom` flag). A guard redirects incomplete profiles back to the wizard. Validate with class-validator using sanity ranges (height 100–250 cm, weight 30–300 kg).
7. **Auth:** reuse the author's existing JWT modules (access + refresh tokens). Do NOT scaffold new auth from scratch.
8. **Monetization:** free tier = scanning, pantry, manual logging, dashboard. Pro = unlimited AI generation; free is capped at 3 generations/day, **metered server-side**. Stripe Checkout + webhook handler with signature verification; subscription status stored in DB.

## Data model

`User`, `Profile` (sex, birthDate, heightCm, activityLevel, goal, dietaryPrefs jsonb, mealsPerDay, onboardingCompletedAt), `NutritionTarget` (versioned), `WeightLog`, `Product` (normalized from OFF/USDA, cached), `PantryItem`, `FavoriteItem`, `DailyLogEntry`, `Subscription`, plus an AI usage metering table.

## Explicitly OUT OF SCOPE for v1

Recipes/recipe import, social features, photo food recognition, workout tracking, full-week meal plans generated at once.

**Refuse scope creep**: if a request drifts into these, remind the user this is out of scope for v1 before doing anything.

## Testing approach

- `NutritionCalculatorService`: exhaustive unit tests (formula correctness, boundary values, activity multipliers, goal caps, macro splits).
- e2e tests for critical flows only: onboarding completion, food logging, AI generation metering/cap, Stripe webhook handling.
- Frontend has no test runner yet; add Vitest when the first meaningful logic appears.

## Environment variables

Backend (`backend/.env`): `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`, AI provider key (named per chosen provider, e.g. `ANTHROPIC_API_KEY` / `OPENAI_API_KEY`), `USDA_API_KEY` (FoodData Central requires one; OFF does not).

Frontend (`frontend/.env`): `VITE_API_URL` (defaults to `http://localhost:8000` in `src/lib/api.ts`), `VITE_STRIPE_PUBLISHABLE_KEY`.

Never commit `.env` files; keep `.env.example` files current when adding variables.

## Frontend specifics (existing scaffold)

- Stack: React 19 + TS strict + Vite, Tailwind CSS v4 via `@tailwindcss/vite` (no tailwind.config — theme lives in `src/index.css`), shadcn/ui on `@base-ui/react`, TanStack Query for server state, axios, react-hook-form + zod, react-router-dom v7, sonner for toasts.
- `src/main.tsx` — app entry; global providers: `QueryClientProvider` → `ThemeProvider` (custom, in `src/components/common/theme-provider.tsx`; light/dark/system persisted to localStorage, synced across tabs, and toggled by a global `d` keyboard shortcut — keep new global key handlers from colliding with it) → `App` + `Toaster`. New global providers go here.
- `src/App.tsx` — `BrowserRouter` and all route definitions; pages in `src/pages/`.
- `src/lib/api.ts` — the shared axios instance; all backend calls go through it.
- `src/components/ui/` — generated shadcn components; `src/components/common/` — hand-written shared components.
- Path alias `@/` → `frontend/src/` (in both `vite.config.ts` and `tsconfig`).
- Barcode scanning is camera-based in the browser (html5-qrcode or similar).

## Conventions

- Validate all external/API responses at the boundary with zod schemas and derive TS types via `z.infer` — never assert hand-written interfaces onto axios generics. This applies doubly to OFF/USDA adapter responses.
- Backend request validation uses class-validator DTOs; business rules (sanity ranges, target computation) live in services, not controllers.
- Keep this file updated when an architecture decision above changes — it is the persistent context for all future sessions.
