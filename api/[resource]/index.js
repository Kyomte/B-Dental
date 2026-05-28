import { query } from '../../lib/db.js';
import { requireAuth, readJson } from '../../lib/auth.js';
import { RESOURCES, rowToObj } from '../../lib/resources.js';
import { uid } from '../../lib/util.js';

const PREFIX = { patients: 'p', treatments: 't', appointments: 'a', inventory: 'i' };

export default async function handler(req, res) {
  const def = RESOURCES[req.query.resource];
  if (!def) return res.status(404).json({ error: 'unknown resource' });

  const clinicId = await requireAuth(req, res);
  if (!clinicId) return;

  try {
    if (req.method === 'GET') {
      const rows = await query(
        `select * from ${def.table} where clinic_id = $1 order by ${def.order}`,
        [clinicId]
      );
      return res.status(200).json(rows.map((r) => rowToObj(r, def)));
    }

    if (req.method === 'POST') {
      const body = readJson(req);
      const id = body.id || uid(PREFIX[req.query.resource] || 'x');
      const jsKeys = Object.keys(def.cols);
      const columns = ['id', 'clinic_id', ...jsKeys.map((k) => def.cols[k])];
      const values = [id, clinicId, ...jsKeys.map((k) => body[k] ?? null)];
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const rows = await query(
        `insert into ${def.table} (${columns.join(', ')}) values (${placeholders}) returning *`,
        values
      );
      return res.status(201).json(rowToObj(rows[0], def));
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error(`[${req.query.resource}]`, err);
    return res.status(500).json({ error: 'Request failed.' });
  }
}
