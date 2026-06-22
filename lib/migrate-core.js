// Core migration logic, decoupled from the neon driver and the filesystem entry
// point so it can be unit-tested with a fake `sql`. scripts/migrate.js wires this
// up to a real connection and the migrations/ directory.
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { splitStatements } from './sql-split.js';

export const checksum = (text) => createHash('sha256').update(text).digest('hex');

// Reads and checksums every *.sql file in `dir` (a URL), sorted by filename.
export function loadMigrations(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((name) => {
      const text = readFileSync(new URL(name, dir), 'utf8');
      return { name, text, checksum: checksum(text) };
    });
}

async function ensureTable(sql) {
  await sql(
    `create table if not exists schema_migrations (
       name       text primary key,
       checksum   text not null,
       applied_at timestamptz not null default now()
     )`,
    []
  );
}

async function appliedMap(sql) {
  const rows = await sql('select name, checksum from schema_migrations', []);
  return new Map(rows.map((r) => [r.name, r.checksum]));
}

// Runs the migration set. `mode` is 'up' (apply pending) or 'status' (report only).
// `log` defaults to console.log; returns { applied: [names], pending: [names] }.
// Throws on checksum drift (an already-applied file edited on disk).
export async function migrate({ sql, migrations, mode = 'up', log = console.log }) {
  await ensureTable(sql);
  const applied = await appliedMap(sql);

  for (const m of migrations) {
    if (applied.has(m.name) && applied.get(m.name) !== m.checksum) {
      throw new Error(
        `checksum mismatch for ${m.name}: the file changed after it was applied. ` +
        `Add a NEW migration instead of editing an applied one.`
      );
    }
  }

  if (mode === 'status') {
    for (const m of migrations) {
      log(`${applied.has(m.name) ? '✓ applied ' : '· pending '} ${m.name}`);
    }
    return {
      appliedNow: [],
      pending: migrations.filter((m) => !applied.has(m.name)).map((m) => m.name),
    };
  }

  const pending = migrations.filter((m) => !applied.has(m.name));
  for (const m of pending) {
    log(`[migrate] applying ${m.name} ...`);
    for (const stmt of splitStatements(m.text)) {
      await sql(stmt);
    }
    await sql('insert into schema_migrations (name, checksum) values ($1, $2)', [m.name, m.checksum]);
  }
  if (!pending.length) {
    log(`[migrate] up to date (${migrations.length} migration${migrations.length === 1 ? '' : 's'} applied).`);
  } else {
    log(`[migrate] applied ${pending.length} migration${pending.length === 1 ? '' : 's'}.`);
  }
  return { appliedNow: pending.map((m) => m.name), pending: [] };
}
