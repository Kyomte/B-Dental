// API smoke tests for the auth endpoints. Uses node:test module mocking
// (run via `--experimental-test-module-mocks`, wired in package.json) to stub
// the DB layer so handlers run in-process with no real Postgres.
import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockReq, mockRes } from '../helpers/http.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-test-secret-test-secret';

// Controllable fake for lib/db.js. Each test sets `dbHandler` to shape responses.
let dbHandler = async () => [];
mock.module('../../lib/db.js', {
  namedExports: {
    sql: (...args) => dbHandler(...args),
    query: (...args) => dbHandler(...args),
  },
});

const { default: register } = await import('../../api/auth/register.js');
const { default: login } = await import('../../api/auth/login.js');

beforeEach(() => { dbHandler = async () => []; });

test('register rejects a malformed email with 400', async () => {
  // users table is empty (first-setup allowed) so we get past the precheck.
  dbHandler = async (text) => (/count\(\*\)/.test(text) ? [{ n: 0 }] : []);
  const req = mockReq({ method: 'POST', body: { email: 'not-an-email', password: 'longenough', name: 'A', clinicName: 'C' } });
  const res = mockRes();
  await register(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /valid email/i);
});

test('register still rejects a short password before email checks pass', async () => {
  dbHandler = async (text) => (/count\(\*\)/.test(text) ? [{ n: 0 }] : []);
  const req = mockReq({ method: 'POST', body: { email: 'ok@example.com', password: 'short' } });
  const res = mockRes();
  await register(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /8 characters/);
});

test('register is closed once a user exists (403)', async () => {
  dbHandler = async (text) => (/count\(\*\)/.test(text) ? [{ n: 1 }] : []);
  const req = mockReq({ method: 'POST', body: { email: 'ok@example.com', password: 'longenough' } });
  const res = mockRes();
  await register(req, res);
  assert.equal(res.statusCode, 403);
});

test('register rejects non-POST methods', async () => {
  const res = mockRes();
  await register(mockReq({ method: 'GET' }), res);
  assert.equal(res.statusCode, 405);
});

test('login rejects a malformed email as invalid credentials (401)', async () => {
  const req = mockReq({ method: 'POST', body: { email: 'nope', password: 'whatever' } });
  const res = mockRes();
  await login(req, res);
  assert.equal(res.statusCode, 401);
  assert.match(res.body.error, /invalid/i);
});

test('login requires email and password (400)', async () => {
  const res = mockRes();
  await login(mockReq({ method: 'POST', body: { email: '' } }), res);
  assert.equal(res.statusCode, 400);
});

test('login rejects non-POST methods', async () => {
  const res = mockRes();
  await login(mockReq({ method: 'GET' }), res);
  assert.equal(res.statusCode, 405);
});
