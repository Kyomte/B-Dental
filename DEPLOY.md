# Deploying B-Dental

One codebase, two Vercel projects from the same GitHub repo (`Kyomte/B-Dental`):

| Project        | Mode | Login | Database | Env                                  |
| -------------- | ---- | ----- | -------- | ------------------------------------ |
| **Demo**       | demo | none  | none     | `BDENTAL_DEMO=1`                     |
| **Production** | real | yes   | Postgres | `DATABASE_URL`, `JWT_SECRET`         |

The build step (`node build.js`) reads `BDENTAL_DEMO` and writes `public/config.js`, which tells the frontend which mode to run in. Demo mode stores everything in the browser's `localStorage`; production talks to `/api` (serverless functions) backed by Postgres.

---

## A. Production (working version)

### 1. Provision a Postgres database
In the Vercel dashboard: **Storage → Create → Neon (Postgres)**. After it's created, copy the connection string (looks like `postgres://user:pass@...neon.tech/dbname?sslmode=require`).

### 2. Create the Vercel project
- **Add New → Project**, import `Kyomte/B-Dental`.
- Framework preset: **Other** (the included `vercel.json` already sets the build command and output dir).
- **Environment Variables:**
  - `DATABASE_URL` = the Neon connection string
  - `JWT_SECRET` = a long random string — generate one with `openssl rand -base64 32`
  - Leave `BDENTAL_DEMO` unset (defaults to real mode).

### 3. Create the tables
Run the schema once against your database:
```bash
DATABASE_URL='postgres://...neon.tech/db?sslmode=require' npm run db:setup
```
(Or paste `schema.sql` into Neon's SQL editor.)

### 4. Deploy & create your account
Trigger a deploy. Open the URL, click **Create an account**, and register your clinic. New accounts start with a standard treatment list and a baseline inventory; patients and appointments start empty.

---

## B. Demo (public sandbox)

1. **Add New → Project**, import the **same** `Kyomte/B-Dental` repo again (Vercel allows multiple projects per repo).
2. Add a single environment variable: `BDENTAL_DEMO` = `1`. No database needed.
3. Deploy. The demo URL is public, requires no login, and seeds sample data per visitor. A "Reset demo data" button restores the samples.

---

## Local development

**Demo mode** (no backend):
```bash
BDENTAL_DEMO=1 node build.js
cd public && python3 -m http.server 5188
# open http://localhost:5188
```

**Real mode** (full stack, needs the DB + Vercel CLI):
```bash
npm i -g vercel
# Put DATABASE_URL and JWT_SECRET in a .env file (gitignored), then:
vercel dev
```

---

## Notes
- Session cookies are `HttpOnly` + `SameSite=Lax`, and `Secure` on Vercel (https). `vercel dev` runs http locally, so `Secure` is omitted there automatically.
- All data is scoped by `clinic_id` derived from the signed JWT — one account never sees another's records.
- `JWT_SECRET` must stay secret and stable; rotating it logs everyone out.
