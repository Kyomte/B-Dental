import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrate, loadMigrations, checksum } from '../../lib/migrate-core.js';

// A tiny in-memory stand-in for the neon sql() function. Tracks the
// schema_migrations table and records every statement it was asked to run.
function fakeDb() {
  const recorded = new Map(); // name -> checksum
  const statements = [];
  const sql = async (text, params = []) => {
    statements.push(text.trim());
    if (/^create table if not exists schema_migrations/i.test(text.trim())) return [];
    if (/^select name, checksum from schema_migrations/i.test(text.trim())) {
      return [...recorded.entries()].map(([name, cs]) => ({ name, checksum: cs }));
    }
    if (/^insert into schema_migrations/i.test(text.trim())) {
      recorded.set(params[0], params[1]);
      return [];
    }
    return []; // ordinary DDL/DML from a migration body
  };
  return { sql, recorded, statements };
}

const migA = { name: '0001_a.sql', text: 'create table a (id text);\n', get checksum() { return checksum(this.text); } };
const migB = { name: '0002_b.sql', text: 'create table b (id text);\n', get checksum() { return checksum(this.text); } };
function mk(...m) { return m.map((x) => ({ name: x.name, text: x.text, checksum: checksum(x.text) })); }

test('applies all pending migrations and records them', async () => {
  const db = fakeDb();
  const res = await migrate({ sql: db.sql, migrations: mk(migA, migB), mode: 'up', log: () => {} });
  assert.deepEqual(res.appliedNow, ['0001_a.sql', '0002_b.sql']);
  assert.equal(db.recorded.size, 2);
  // Each migration body statement was issued.
  assert.ok(db.statements.some((s) => /create table a/.test(s)));
  assert.ok(db.statements.some((s) => /create table b/.test(s)));
});

test('is idempotent: a second run applies nothing', async () => {
  const db = fakeDb();
  await migrate({ sql: db.sql, migrations: mk(migA, migB), mode: 'up', log: () => {} });
  const before = db.statements.length;
  const res = await migrate({ sql: db.sql, migrations: mk(migA, migB), mode: 'up', log: () => {} });
  assert.deepEqual(res.appliedNow, []);
  // Only the ensure-table + select ran on the second pass (no new inserts/DDL).
  const newInserts = db.statements.slice(before).filter((s) => /^insert into schema_migrations/i.test(s));
  assert.equal(newInserts.length, 0);
});

test('applies only the new migration when one is added', async () => {
  const db = fakeDb();
  await migrate({ sql: db.sql, migrations: mk(migA), mode: 'up', log: () => {} });
  const res = await migrate({ sql: db.sql, migrations: mk(migA, migB), mode: 'up', log: () => {} });
  assert.deepEqual(res.appliedNow, ['0002_b.sql']);
});

test('rejects an applied migration whose file changed (checksum drift)', async () => {
  const db = fakeDb();
  await migrate({ sql: db.sql, migrations: mk(migA), mode: 'up', log: () => {} });
  const tampered = [{ name: '0001_a.sql', text: 'create table a (id text, extra text);\n', checksum: checksum('different') }];
  await assert.rejects(
    () => migrate({ sql: db.sql, migrations: tampered, mode: 'up', log: () => {} }),
    /checksum mismatch/
  );
});

test('status mode reports pending without applying', async () => {
  const db = fakeDb();
  const lines = [];
  const res = await migrate({ sql: db.sql, migrations: mk(migA, migB), mode: 'status', log: (l) => lines.push(l) });
  assert.deepEqual(res.pending, ['0001_a.sql', '0002_b.sql']);
  assert.equal(db.recorded.size, 0); // nothing recorded
  assert.ok(lines.every((l) => /pending/.test(l)));
});

test('loadMigrations reads the real migrations/ dir in sorted order', () => {
  const found = loadMigrations(new URL('../../migrations/', import.meta.url));
  const names = found.map((m) => m.name);
  assert.ok(names.includes('0001_init.sql'), 'baseline migration present');
  assert.deepEqual([...names].sort(), names, 'migrations are returned sorted');
  for (const m of found) assert.equal(m.checksum.length, 64); // sha256 hex
});
