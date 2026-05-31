// First-run setup ONLY. Creates the clinic + the single admin user.
// Returns 403 once any user exists — after that, the admin uses /api/users
// to add staff.
import { query } from '../../lib/db.js';
import { hashPassword, createToken, setSessionCookie, readJson } from '../../lib/auth.js';
import { uid } from '../../lib/util.js';
import { SEED_TREATMENTS, SEED_INVENTORY } from '../../lib/seed.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const existing = await query('select count(*)::int as n from users', []);
    if (existing[0]?.n > 0) {
      return res.status(403).json({ error: 'Registration is closed. Ask your admin to create an account for you.' });
    }
  } catch (err) {
    console.error('[register:precheck]', err);
    return res.status(500).json({ error: 'Could not create account.' });
  }

  const { email, password, clinicName, name } = readJson(req);
  const normEmail = String(email || '').trim().toLowerCase();
  if (!normEmail || !password || String(password).length < 8) {
    return res.status(400).json({ error: 'Email and a password of at least 8 characters are required.' });
  }

  try {
    const clinicId = uid('c');
    const userId = uid('u');
    const hash = await hashPassword(String(password));
    const cName = String(clinicName || '').trim() || 'B-Dental Clinic';
    const userName = String(name || '').trim() || 'Admin';

    // Mirror creds onto clinics row to satisfy legacy NOT NULL constraints
    // on older deploys; users table is the source of truth for auth.
    await query(
      'insert into clinics (id, email, password_hash, name) values ($1, $2, $3, $4)',
      [clinicId, normEmail, hash, cName]
    );
    // Authoritative guard against a concurrent first-setup: the count(*) precheck
    // above and this insert are separate round-trips, so two requests could both
    // observe an empty users table. Gating the insert on `not exists` and checking
    // the row count closes that window; clean up the orphan clinic row if we lose.
    const inserted = await query(
      `insert into users (id, clinic_id, email, password_hash, name, role)
         select $1, $2, $3, $4, $5, 'admin'
          where not exists (select 1 from users)
       returning id`,
      [userId, clinicId, normEmail, hash, userName]
    );
    if (!inserted.length) {
      await query('delete from clinics where id = $1', [clinicId]);
      return res.status(403).json({ error: 'Registration is closed. Ask your admin to create an account for you.' });
    }

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

    const token = await createToken(userId);
    setSessionCookie(res, token);
    return res.status(201).json({
      user: { id: userId, email: normEmail, name: userName, role: 'admin' },
      clinic: { id: clinicId, name: cName, lowStockThresholdDefault: 10 },
    });
  } catch (err) {
    console.error('[register]', err);
    if (err?.code === '23505') return res.status(409).json({ error: 'That email is already taken.' });
    return res.status(500).json({ error: 'Could not create account.' });
  }
}
