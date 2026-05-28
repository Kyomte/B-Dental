import { query } from '../lib/db.js';
import { requireAuth, readJson } from '../lib/auth.js';
import { RESOURCES, rowToObj } from '../lib/resources.js';
import { uid } from '../lib/util.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const clinicId = await requireAuth(req, res);
  if (!clinicId) return;

  const { itemId, qty, cost, date } = readJson(req);
  const addQty = Number(qty);
  const unitCost = Number(cost) || 0;
  if (!itemId || !Number.isFinite(addQty) || addQty <= 0) {
    return res.status(400).json({ error: 'A valid item and positive quantity are required.' });
  }

  try {
    const updated = await query(
      `update inventory set qty = qty + $1, last_restock = $2
       where id = $3 and clinic_id = $4 returning *`,
      [addQty, date || null, itemId, clinicId]
    );
    if (!updated.length) return res.status(404).json({ error: 'item not found' });

    const logId = uid('r');
    await query(
      'insert into restock_log (id, clinic_id, item_id, qty, date, cost) values ($1,$2,$3,$4,$5,$6)',
      [logId, clinicId, itemId, addQty, date || null, addQty * unitCost]
    );

    return res.status(200).json({
      item: rowToObj(updated[0], RESOURCES.inventory),
      log: { id: logId, itemId, qty: addQty, date: date || null, cost: addQty * unitCost },
    });
  } catch (err) {
    console.error('[restock]', err);
    return res.status(500).json({ error: 'Restock failed.' });
  }
}
