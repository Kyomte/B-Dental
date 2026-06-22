// Admin-only user management. The admin can list and create staff accounts;
// every account this endpoint creates has role 'staff' (the "one admin" rule).
import { query } from '../../lib/db.js';
import { requireAdmin, hashPassword, readJson } from '../../lib/auth.js';
import { uid, isValidEmail } from '../../lib/util.js';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  try {
    if (req.method === 'GET') {
      const rows = await query(
        `select id, email, name, role, created_at
           from users where clinic_id = $1
          order by role asc, created_at asc`,
        [session.clinicId]
      );
      return res.status(200).json(
        rows.map((r) => ({ id: r.id, email: r.email, name: r.name, role: r.role, createdAt: r.created_at }))
      );
    }

    if (req.method === 'POST') {
      const { email, password, name } = readJson(req);
      const normEmail = String(email || '').trim().toLowerCase();
      if (!normEmail || !password || String(password).length < 8) {
        return res.status(400).json({ error: 'Email and a password of at least 8 characters are required.' });
      }
      if (!isValidEmail(normEmail)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      const userId = uid('u');
      const hash = await hashPassword(String(password));
      const userName = String(name || '').trim() || normEmail.split('@')[0];
      try {
        await query(
          `insert into users (id, clinic_id, email, password_hash, name, role)
             values ($1, $2, $3, $4, $5, 'staff')`,
          [userId, session.clinicId, normEmail, hash, userName]
        );
      } catch (err) {
        if (err?.code === '23505') return res.status(409).json({ error: 'That email is already taken.' });
        throw err;
      }
      return res.status(201).json({ id: userId, email: normEmail, name: userName, role: 'staff' });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error('[users]', err);
    return res.status(500).json({ error: 'Request failed.' });
  }
}
