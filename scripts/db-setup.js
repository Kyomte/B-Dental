// Applies schema.sql to the database in DATABASE_URL and runs any
// data migrations needed to move forward from earlier schemas.
// Usage: DATABASE_URL=postgres://... node scripts/db-setup.js
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8');

// Split on statement boundaries; neon's HTTP driver runs one statement per call.
const statements = schema
  .split(';')
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith('--'));

const run = async () => {
  for (const stmt of statements) {
    await sql(stmt);
  }
  console.log(`[db-setup] applied ${statements.length} schema statements.`);

  // Migration: if a clinic still carries email/password_hash from the
  // pre-users schema and has no user row, promote those credentials to
  // a seed admin user. Idempotent — only acts on clinics without users.
  const orphans = await sql(
    `select id, email, password_hash, name from clinics
       where email is not null and password_hash is not null
         and id not in (select clinic_id from users)`,
    []
  );
  for (const c of orphans) {
    const uid = 'u_' + Math.random().toString(36).slice(2, 10);
    await sql(
      `insert into users (id, clinic_id, email, password_hash, name, role)
         values ($1, $2, $3, $4, $5, 'admin')`,
      [uid, c.id, c.email, c.password_hash, c.name || 'Admin']
    );
    console.log(`[db-setup] migrated clinic ${c.id} -> admin user ${c.email}`);
  }
  if (orphans.length) {
    console.log(`[db-setup] migrated ${orphans.length} legacy clinic credential(s) to users.`);
  }
};

run().catch((err) => {
  console.error('[db-setup] failed:', err);
  process.exit(1);
});
