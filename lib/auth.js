import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'bd_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(s);
}

export const hashPassword = (pw) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);

export async function createToken(clinicId) {
  return new SignJWT({ cid: clinicId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey());
}

function cookieFlags() {
  // Secure requires https; omit it on local `vercel dev` (http) so the cookie sticks.
  const onVercel = !!process.env.VERCEL;
  return `HttpOnly; SameSite=Lax; Path=/${onVercel ? '; Secure' : ''}`;
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; ${cookieFlags()}; Max-Age=${MAX_AGE}`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieFlags()}; Max-Age=0`);
}

function parseCookies(req) {
  const header = req.headers?.cookie || '';
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export async function getClinicId(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.cid || null;
  } catch {
    return null;
  }
}

// Returns clinicId, or null after sending a 401 (caller should return early).
export async function requireAuth(req, res) {
  const cid = await getClinicId(req);
  if (!cid) {
    res.status(401).json({ error: 'unauthorized' });
    return null;
  }
  return cid;
}

export function readJson(req) {
  // Vercel parses JSON bodies automatically; guard for the raw case anyway.
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}
