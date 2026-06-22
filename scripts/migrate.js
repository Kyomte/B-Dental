// Tracked DB migrations for B-Dental — CLI entry point.
//
// Applies every pending file in migrations/ (sorted by filename) and records it
// in a schema_migrations table so it never runs twice. Each migration's checksum
// is stored too: if a file is edited after being applied, the runner refuses to
// continue rather than silently drift from what's deployed.
//
// Usage:
//   DATABASE_URL=postgres://... node scripts/migrate.js          # apply pending
//   DATABASE_URL=postgres://... node scripts/migrate.js status   # list state, apply nothing
//
// The neon HTTP driver runs one statement per call and has no multi-statement
// transactions, so a migration that fails partway leaves its earlier statements
// applied but unrecorded. Migrations are therefore written to be idempotent
// (create ... if not exists, guarded inserts) so a re-run is always safe.
import { neon } from '@neondatabase/serverless';
import { migrate, loadMigrations } from '../lib/migrate-core.js';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(url);
const migrations = loadMigrations(new URL('../migrations/', import.meta.url));
const mode = process.argv[2] === 'status' ? 'status' : 'up';

migrate({ sql, migrations, mode }).catch((err) => {
  console.error('[migrate] failed:', err.message || err);
  process.exit(1);
});
