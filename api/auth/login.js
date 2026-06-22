import { query } from '../../lib/db.js';
import { verifyPassword, createToken, setSessionCookie, readJson } from '../../lib/auth.js';
import { isValidEmail } from '../../lib/util.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, password } = readJson(req);
  const normEmail = String(email || '').trim().toLowerCase();
  if (!normEmail || !password) return res.status(400).json({ error: 'Email and password are required.' });
  if (!isValidEmail(normEmail)) return res.status(401).json({ error: 'Invalid email or password.' });

  try {
    const rows = await query(
      `select u.id, u.email, u.name, u.role, u.password_hash,
              c.id as clinic_id, c.name as clinic_name, c.low_stock_threshold_default
         from users u join clinics c on c.id = u.clinic_id
        where u.email = $1`,
      [normEmail]
    );
    const u = rows[0];
    const ok = u && (await verifyPassword(String(password), u.password_hash));
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = await createToken(u.id);
    setSessionCookie(res, token);
    return res.status(200).json({
      user: { id: u.id, email: u.email, name: u.name, role: u.role },
      clinic: { id: u.clinic_id, name: u.clinic_name, lowStockThresholdDefault: u.low_stock_threshold_default },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Login failed.' });
  }
}
