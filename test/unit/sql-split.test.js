import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitStatements } from '../../lib/sql-split.js';

test('splits a multi-statement script', () => {
  const out = splitStatements('create table a (id text);\ncreate table b (id text);\n');
  assert.deepEqual(out, ['create table a (id text)', 'create table b (id text)']);
});

test('strips line comments before splitting', () => {
  const out = splitStatements('-- a comment\ncreate table a (id text); -- trailing\n');
  assert.deepEqual(out, ['create table a (id text)']);
});

test('a semicolon inside a comment does not split a statement', () => {
  // Regression: "-- foo; bar" once cut the following statement in half.
  const sql = 'create table a (\n  id text -- auth lives here; really\n);\n';
  const out = splitStatements(sql);
  assert.equal(out.length, 1);
  assert.match(out[0], /^create table a/);
});

test('ignores empty fragments and whitespace', () => {
  assert.deepEqual(splitStatements(';;\n  ;\n'), []);
});
