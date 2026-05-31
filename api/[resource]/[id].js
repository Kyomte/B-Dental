import { query } from '../../lib/db.js';
import { requireAuth, readJson } from '../../lib/auth.js';
import { RESOURCES, rowToObj, firstInvalidField } from '../../lib/resources.js';

export default async function handler(req, res) {
  const def = RESOURCES[req.query.resource];
  if (!def) return res.status(404).json({ error: 'unknown resource' });

  const clinicId = await requireAuth(req, res);
  if (!clinicId) return;

  const id = req.query.id;

  try {
    if (req.method === 'PUT') {
      const body = readJson(req);
      const bad = firstInvalidField(body, def);
      if (bad) return res.status(400).json({ error: `invalid ${bad}` });
      const jsKeys = Object.keys(def.cols);
      const setClause = jsKeys.map((k, i) => `${def.cols[k]} = $${i + 1}`).join(', ');
      const values = [...jsKeys.map((k) => body[k] ?? null), id, clinicId];
      const rows = await query(
        `update ${def.table} set ${setClause} where id = $${jsKeys.length + 1} and clinic_id = $${jsKeys.length + 2} returning *`,
        values
      );
      if (!rows.length) return res.status(404).json({ error: 'not found' });
      return res.status(200).json(rowToObj(rows[0], def));
    }

    if (req.method === 'DELETE') {
      await query(`delete from ${def.table} where id = $1 and clinic_id = $2`, [id, clinicId]);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error(`[${req.query.resource}/${id}]`, err);
    return res.status(500).json({ error: 'Request failed.' });
  }
}
