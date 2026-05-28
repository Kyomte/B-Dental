import { query } from '../../lib/db.js';
import { verifyPassword, createToken, setSessionCookie, readJson } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, password } = readJson(req);
  const normEmail = String(email || '').trim().toLowerCase();
  if (!normEmail || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const rows = await query('select id, email, name, password_hash from clinics where email = $1', [normEmail]);
    const clinic = rows[0];
    const ok = clinic && (await verifyPassword(String(password), clinic.password_hash));
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = await createToken(clinic.id);
    setSessionCookie(res, token);
    return res.status(200).json({ clinic: { id: clinic.id, email: clinic.email, name: clinic.name } });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Login failed.' });
  }
}
