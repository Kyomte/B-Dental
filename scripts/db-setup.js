// One-shot database setup: applies the canonical schema.sql, then runs the
// tracked migrations in migrations/ via scripts/migrate.js.
//
// schema.sql is the full, idempotent (create ... if not exists) schema and is
// what a brand-new database is built from. The migration runner then records the
// baseline and applies any incremental migrations (e.g. data backfills) on top.
// Both layers are safe to re-run, so this stays the right command after pulling
// a new version.
//
// Usage: DATABASE_URL=postgres://... node scripts/db-setup.js
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { neon } from '@neondatabase/serverless';
import { splitStatements } from '../lib/sql-split.js';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8');
const statements = splitStatements(schema);

const run = async () => {
  for (const stmt of statements) {
    await sql(stmt);
  }
  console.log(`[db-setup] applied ${statements.length} schema statements.`);

  // Run tracked migrations (baseline + any incremental data/DDL changes).
  // Delegated to migrate.js so there's a single migration code path.
  const migrate = spawnSync('node', [new URL('./migrate.js', import.meta.url).pathname], {
    stdio: 'inherit',
    env: process.env,
  });
  if (migrate.status !== 0) {
    process.exit(migrate.status || 1);
  }
};

run().catch((err) => {
  console.error('[db-setup] failed:', err);
  process.exit(1);
});
