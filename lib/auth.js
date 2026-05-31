import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { query } from './db.js';

const COOKIE = 'bd_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(s);
}

export const hashPassword = (pw) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);

// JWT carries only the user id; clinic + role come from the DB on every
// request so role changes / deletions take effect immediately.
export async function createToken(userId) {
  return new SignJWT({ uid: userId })
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

// Resolves the session cookie to a full user context. Returns null if the
// cookie is missing, the JWT is bad, or the user was deleted since signing in.
export async function getSession(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  let userId;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    userId = payload.uid;
  } catch {
    return null;
  }
  if (!userId) return null;
  try {
    const rows = await query(
      `select u.id as user_id, u.clinic_id, u.email, u.name, u.role,
              c.name as clinic_name, c.low_stock_threshold_default
         from users u
         join clinics c on c.id = u.clinic_id
        where u.id = $1`,
      [userId]
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      userId: r.user_id,
      clinicId: r.clinic_id,
      email: r.email,
      name: r.name,
      role: r.role,
      clinic: { id: r.clinic_id, name: r.clinic_name, lowStockThresholdDefault: r.low_stock_threshold_default },
    };
  } catch (err) {
    console.error('[getSession]', err);
    return null;
  }
}

// Most endpoints want just the clinic id (data scoping). Returns null after
// sending a 401 so the caller can early-return.
export async function requireAuth(req, res) {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: 'unauthorized' });
    return null;
  }
  return session.clinicId;
}

// Stricter gate for admin-only endpoints (user management, etc.).
// Returns the full session, or null after sending 401/403.
export async function requireAdmin(req, res) {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: 'unauthorized' });
    return null;
  }
  if (session.role !== 'admin') {
    res.status(403).json({ error: 'admin only' });
    return null;
  }
  return session;
}

export function readJson(req) {
  // Vercel parses JSON bodies automatically; guard for the raw case anyway.
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}
