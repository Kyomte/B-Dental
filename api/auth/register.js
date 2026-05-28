import { query } from '../../lib/db.js';
import { hashPassword, createToken, setSessionCookie, readJson } from '../../lib/auth.js';
import { uid } from '../../lib/util.js';
import { SEED_TREATMENTS, SEED_INVENTORY } from '../../lib/seed.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, password, clinicName } = readJson(req);
  const normEmail = String(email || '').trim().toLowerCase();
  if (!normEmail || !password || String(password).length < 8) {
    return res.status(400).json({ error: 'Email and a password of at least 8 characters are required.' });
  }

  try {
    const existing = await query('select id from clinics where email = $1', [normEmail]);
    if (existing.length) return res.status(409).json({ error: 'An account with that email already exists.' });

    const clinicId = uid('c');
    const hash = await hashPassword(String(password));
    const name = String(clinicName || '').trim() || 'B-Dental Clinic';

    await query(
      'insert into clinics (id, email, password_hash, name) values ($1, $2, $3, $4)',
      [clinicId, normEmail, hash, name]
    );

    for (const t of SEED_TREATMENTS) {
      await query(
        'insert into treatments (id, clinic_id, name, category, price, duration) values ($1,$2,$3,$4,$5,$6)',
        [uid('t'), clinicId, t.name, t.category, t.price, t.duration]
      );
    }
    const todayStr = new Date().toISOString().slice(0, 10);
    for (const i of SEED_INVENTORY) {
      await query(
        'insert into inventory (id, clinic_id, name, category, sku, unit, qty, threshold, price, supplier, last_restock) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [uid('i'), clinicId, i.name, i.category, i.sku, i.unit, i.qty, i.threshold, i.price, i.supplier, todayStr]
      );
    }

    const token = await createToken(clinicId);
    setSessionCookie(res, token);
    return res.status(201).json({ clinic: { id: clinicId, email: normEmail, name } });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Could not create account.' });
  }
}
