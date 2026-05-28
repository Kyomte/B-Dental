// Applies schema.sql to the database in DATABASE_URL.
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
  console.log(`[db-setup] applied ${statements.length} statements.`);
};

run().catch((err) => {
  console.error('[db-setup] failed:', err);
  process.exit(1);
});
