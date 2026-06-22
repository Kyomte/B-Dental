// API smoke tests for the generic resource handler (create path), focused on
// the new patient validation and the auth/unknown-resource guards.
import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT } from 'jose';
import { mockReq, mockRes } from '../helpers/http.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-test-secret-test-secret';
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// DB fake: getSession() runs a users<->clinics join; return a logged-in admin
// for any select against users, and echo inserts back as a returned row.
let lastInsert = null;
let dbHandler = async (text, params) => {
  if (/from users u/.test(text) || /from\s+users/.test(text)) {
    return [{ user_id: 'u_1', clinic_id: 'c_1', email: 'a@b.co', name: 'A', role: 'admin', clinic_name: 'Clinic', low_stock_threshold_default: 10 }];
  }
  if (/^insert into/i.test(text.trim())) {
    lastInsert = params;
    return [{ id: params[0], clinic_id: params[1] }];
  }
  return [];
};
mock.module('../../lib/db.js', {
  namedExports: {
    sql: (...a) => dbHandler(...a),
    query: (...a) => dbHandler(...a),
  },
});

const { default: indexHandler } = await import('../../api/[resource]/index.js');

async function sessionCookie() {
  const token = await new SignJWT({ uid: 'u_1' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
  return `bd_session=${token}`;
}

beforeEach(() => { lastInsert = null; });

test('unknown resource returns 404', async () => {
  const res = mockRes();
  await indexHandler(mockReq({ method: 'GET', query: { resource: 'dragons' } }), res);
  assert.equal(res.statusCode, 404);
});

test('unauthenticated request returns 401', async () => {
  const res = mockRes();
  await indexHandler(mockReq({ method: 'GET', query: { resource: 'patients' } }), res);
  assert.equal(res.statusCode, 401);
});

test('creating a patient with a bad email is rejected 400', async () => {
  const res = mockRes();
  const req = mockReq({
    method: 'POST',
    query: { resource: 'patients' },
    cookies: await sessionCookie(),
    body: { firstName: 'Maria', lastName: 'Santos', email: 'bogus' },
  });
  await indexHandler(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /invalid email/);
});

test('creating a patient with a blank required name is rejected 400', async () => {
  const res = mockRes();
  const req = mockReq({
    method: 'POST',
    query: { resource: 'patients' },
    cookies: await sessionCookie(),
    body: { firstName: '   ', lastName: 'Santos' },
  });
  await indexHandler(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /invalid firstName/);
});

test('creating a valid patient succeeds (201)', async () => {
  const res = mockRes();
  const req = mockReq({
    method: 'POST',
    query: { resource: 'patients' },
    cookies: await sessionCookie(),
    body: { firstName: 'Maria', lastName: 'Santos', email: 'maria@example.com', phone: '+63 917 222 1010' },
  });
  await indexHandler(req, res);
  assert.equal(res.statusCode, 201);
  assert.ok(lastInsert, 'an insert was issued');
});
