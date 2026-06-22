# B-Dental

A clinic-manager single-page app for small dental practices: patients,
appointments, a treatment catalog, and inventory with low-stock alerts and
restock logging.

It ships **two ways from one codebase**, selected by a build-time env var:

| Mode           | Login | Data store                          | Use                           |
| -------------- | ----- | ----------------------------------- | ----------------------------- |
| **Demo**       | none  | browser `localStorage` (seeded)     | public sandbox / quick look   |
| **Production** | yes   | Postgres via serverless `/api`      | a real clinic's live data     |

The frontend is one vanilla-JS file (`public/app.js`) with no framework; the
backend is Vercel serverless functions in `api/` backed by Neon Postgres.

---

## Quick start

### Prerequisites

- Node.js 18+ (the test suite uses the built-in `node:test` runner; Node 20+ recommended)
- Python 3 (only for the zero-dependency static demo server)

```bash
npm install
```

### Run the demo (no backend, no database)

```bash
BDENTAL_DEMO=1 node build.js          # writes public/config.js in demo mode
python3 -m http.server 5188 --directory public
# open http://localhost:5188
```

Demo data lives only in your browser and is seeded with sample patients,
appointments, treatments, and inventory. A **Reset demo data** button restores
the samples.

### Run the full stack locally (login + database)

You need a Postgres database (e.g. [Neon](https://neon.tech)) and the Vercel CLI.

```bash
npm i -g vercel

# Put DATABASE_URL and JWT_SECRET in a .env file (gitignored), then create tables:
DATABASE_URL='postgres://...' npm run db:setup   # applies schema + runs migrations

node build.js                                     # production mode (demo unset)
vercel dev                                        # serves public/ + /api on :3000
```

Open the app — because there are no users yet, you'll get a **first-time setup**
form. The account you create is the clinic's single **admin**; after that the
public registration endpoint is closed, and the admin invites staff from the
**Accounts** screen.

---

## Common commands

```bash
node build.js                 # build production config (public/config.js)
BDENTAL_DEMO=1 node build.js  # build demo config

npm test                      # full test suite (unit + API)
npm run test:unit             # unit tests only (validators, mappers, migrations)
npm run test:api              # API smoke tests (handlers, in-process)
npm run test:smoke            # frontend byte-level smoke (builds + serves public/)

npm run db:setup              # apply schema.sql + run tracked migrations
npm run db:migrate            # run pending migrations only
npm run db:migrate:status     # list applied/pending migrations
```

> The API tests use Node's experimental module mocking (already wired into the
> `test`/`test:api` scripts via `--experimental-test-module-mocks`).

---

## Project layout

```
api/            Vercel serverless functions
  auth/         register (first-setup only), login, logout, me
  users/        admin-only staff management
  [resource]/   generic CRUD for patients / treatments / appointments / inventory
  bootstrap.js  one-shot snapshot of all data after login
  restock.js    the one compound op (update qty + log)
lib/            shared backend modules (db, auth, resources, validators, migrations)
migrations/     tracked, numbered SQL migrations (0001_init.sql, …)
scripts/        db-setup.js, migrate.js
public/         the frontend (index.html, app.js, styles.css, config.js)
test/           unit/ + api/ tests and the frontend smoke script
schema.sql      canonical schema (idempotent create-if-not-exists)
```

---

## How it works (in brief)

- **Mode plumbing.** `build.js` reads `BDENTAL_DEMO` and writes
  `public/config.js`; the frontend reads `window.BDENTAL_CONFIG.demo` at boot and
  branches every persistence call on it. Two Vercel projects pointing at this
  repo with different env vars ship the two URLs.
- **Auth.** Login identities live in `users` (role `admin` or `staff`), scoped to
  a `clinic`. Sessions are a JWT in an httpOnly cookie carrying only the user id;
  role and clinic are re-read from the DB on every request.
- **Validation.** Email format is validated in the auth endpoints; patient and
  appointment fields are validated server-side (`lib/resources.js`) and mirrored
  client-side for immediate feedback.
- **Migrations.** `migrations/*.sql` are applied in order and tracked in a
  `schema_migrations` table with checksums, so each runs once and edits to an
  already-applied file are caught. See `npm run db:migrate`.

For the full architecture notes see [`CLAUDE.md`](CLAUDE.md); for deployment see
[`DEPLOY.md`](DEPLOY.md).
