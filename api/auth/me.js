import { query } from '../../lib/db.js';
import { getClinicId } from '../../lib/auth.js';

export default async function handler(req, res) {
  const clinicId = await getClinicId(req);
  if (!clinicId) return res.status(200).json({ clinic: null });

  try {
    const rows = await query('select id, email, name from clinics where id = $1', [clinicId]);
    if (!rows.length) return res.status(200).json({ clinic: null });
    return res.status(200).json({ clinic: rows[0] });
  } catch (err) {
    console.error('[me]', err);
    return res.status(500).json({ error: 'Could not load session.' });
  }
}
