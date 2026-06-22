# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

B-Dental is a clinic-manager SPA shipped two ways from **one codebase**, controlled by a build-time env var:

- **Demo mode** (`BDENTAL_DEMO=1`): static frontend, seeded sample data in `localStorage`, no login.
- **Production mode** (default): same UI, gated behind a login/register screen, talks to Vercel serverless functions in `api/` backed by Neon Postgres.

The split is **not** in the source — `build.js` reads `BDENTAL_DEMO` and writes `public/config.js`, then the frontend reads `window.BDENTAL_CONFIG.demo` at boot. Two Vercel projects pointing at this repo with different env vars ship the two URLs. See `DEPLOY.md` for the deploy procedure.

## Common commands

```bash
npm install                                    # bcryptjs, jose, @neondatabase/serverless

# Build (writes public/config.js based on env)
BDENTAL_DEMO=1 node build.js                   # demo mode
node build.js                                  # production mode

# Local demo (no backend)
python3 -m http.server 5188 --directory public

# Local production (needs DB + JWT_SECRET in .env)
npm i -g vercel
DATABASE_URL='postgres://...' npm run db:setup # idempotent: applies schema + runs migrations
vercel dev                                     # serves public/ + /api on :3000

# Project skill (smoke + headless-Chrome screenshot)
.claude/skills/run-dental-clinic/smoke.sh
.claude/skills/run-dental-clinic/driver.sh     # writes screenshot.png
```

There is no test suite. Verification is the smoke script (byte-level) and the driver (headless Chrome → PNG). `.claude/` is in a global gitignore on this machine — skill files are local agent tooling, not in `origin`.

## Architecture

### Mode plumbing (the only real abstraction)

`public/app.js` is one vanilla-JS file with **mode awareness baked in at one place**:

```js
const CONFIG = window.BDENTAL_CONFIG || { demo: true };
const DEMO = !!CONFIG.demo;
```

Everything downstream branches on `DEMO`:
- `loadLocal()` vs an empty state + `/api/bootstrap` fetch after login.
- `today()` returns the pinned `'2026-05-28'` in demo, `new Date()` in production.
- `persist.{create,update,remove,restock}` is the single mutation seam. Demo path writes the whole `state` to `localStorage`; production path fires the matching granular REST call.

The in-memory `state` object is the source of truth for **all** renders (which are synchronous DOM-string builders — no framework). Mutations optimistically update `state`, re-render, then persist. If a server write fails, a toast surfaces it; nothing rolls back. This is acceptable here because each clinic is effectively single-tenant.

### Backend (production mode only)

**Auth: users, not clinics.** Two tables matter for auth:
- `clinics(id, name, low_stock_threshold_default, …)` — the tenant. Per-clinic data scoping happens via `clinic_id` FK on every other table.
- `users(id, clinic_id, email unique, password_hash, name, role)` — login identities. Role is `'admin'` (the one owner) or `'staff'` (everyone the admin invites).

The JWT (httpOnly cookie `bd_session`) carries only `{ uid }`. `lib/auth.js` exposes three gates, all of which **hit the DB on every request** so role changes / deletions take effect immediately:
- `getSession(req)` → joins users + clinics, returns `{ userId, clinicId, email, name, role, clinic }` or null.
- `requireAuth(req, res)` → returns `clinicId` (the common case for scoped data endpoints); 401s on failure.
- `requireAdmin(req, res)` → returns the full session, 401/403s if not admin. Use for `/api/users/*`.

**No public registration.** `POST /api/auth/register` works **only when `users` is empty** — that's the one-time admin bootstrap. After that, the endpoint 403s, and the admin creates staff via `POST /api/users` (which always sets `role='staff'`). The frontend learns whether to show the setup form via `firstSetup: true` on `/api/auth/me`.

**Admin-only permissions** are enforced on two levels:
- Server: `requireAdmin` on `/api/users/*`.
- Client: `applyRolePermissions()` in `app.js` hides the Reports + Accounts nav items; `setView()` re-routes to `dashboard` if a non-admin tries them. Reports is computed client-side from `state`, so the staff gate is UI-only; if you ever add a real `/api/reports` endpoint, gate it with `requireAdmin` too.

**Generic CRUD.** Four of the five resources share one handler pair:
- `api/[resource]/index.js` — GET (list) + POST (create)
- `api/[resource]/[id].js` — PUT + DELETE
- Lookup by `req.query.resource` against the `RESOURCES` map in `lib/resources.js`. That map is also the camelCase↔snake_case translator and the numeric-coercion table. Unknown resources → 404.

Static routes (`auth/*`, `bootstrap`, `restock`) take precedence over the catch-all in Vercel's routing, so adding e.g. `api/clinic.js` would Just Work without changing the dynamic handler.

**The restock endpoint is the only compound op:** updates `inventory.qty` *and* inserts a `restock_log` row. Everything else is plain row CRUD.

**IDs are client-generated** (`uid('p')` → `p_ab12cd3`) and stored as TEXT primary keys. This is what lets the frontend optimistically push a row into `state` *before* the server replies — no temp-id reconciliation needed.

**The Neon driver call shape is non-obvious.** `lib/db.js` exposes `query(text, params)` which delegates to `sql(text, params)` — the tagged-template function from `@neondatabase/serverless` is callable as a regular function for parameterized queries. `sql.query(...)` **does not exist** in 0.10.x; don't write that.

### Frontend persistence (demo mode)

`loadLocal()` reads `localStorage` key `b-dental.v2`. If missing, `structuredClone(SEED)` runs — the seed has 6 patients, 8 treatments, 8 appointments, 12 inventory SKUs (6 low-stock, 1 of those at `qty: 0` — id `i12`, "Glass Ionomer Cement"). That seed shape drives the dashboard banner, the sidebar Stock Health meter, and the nav badge.

The seed is **only** ever written to `localStorage` after the first mutation — fresh tabs render correctly from the in-memory clone, but `localStorage.getItem('b-dental.v2')` returns `null` until something saves.

### CSS gotcha worth knowing up front

`.auth-overlay` and `.modal-overlay` both use `display: flex` for their visible state, which has higher specificity than the browser default `[hidden] { display: none }`. **Both need an explicit `.<class>[hidden] { display: none }` sibling rule** or the overlay covers the entire page (this exact bug shipped to production once — see commit `9a6c7d5`). If the deployed demo URL ever paints blank, that rule is the first place to look.

## Production-account seeding

The first-setup call (`POST /api/auth/register`, allowed only when `users` is empty) creates **one clinic + one admin user** and seeds:
- The 8 treatments from `lib/seed.js` (catalog).
- The 8 inventory items (baseline stock).
- **No patients, no appointments** — those start empty by design.

Staff invited later via `POST /api/users` get an account against the same `clinic_id`; they share the seeded catalog and any data the team has added since.

The demo `SEED` (in `public/app.js`) and the production seed (`lib/seed.js`) are **separate** — they intentionally diverge.

## Migration model

Migrations are tracked, numbered SQL files in `migrations/` (e.g. `0001_init.sql`). `scripts/migrate.js` applies them in filename order and records each in a `schema_migrations` table with its checksum, so every migration runs exactly once and an edit to an already-applied file is rejected (add a new migration instead). The core logic lives in `lib/migrate-core.js` and is unit-tested with an in-memory `sql` fake. Each migration is written to be idempotent (`create ... if not exists`, guarded inserts) because the neon HTTP driver has no multi-statement transactions.

`scripts/db-setup.js` is still the one-shot setup command: it applies `schema.sql` (the canonical, idempotent full schema) and then delegates to the migration runner. Commands: `npm run db:setup`, `npm run db:migrate`, `npm run db:migrate:status`. Re-run `db:setup` whenever you pull a new version; it's safe on a current DB. The legacy pre-`users` credential backfill now lives in `migrations/0002_backfill_legacy_admins.sql` rather than hardcoded in `db-setup.js`.
