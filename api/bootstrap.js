import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { RESOURCES, rowToObj } from '../lib/resources.js';

export default async function handler(req, res) {
  const clinicId = await requireAuth(req, res);
  if (!clinicId) return;

  try {
    const [clinicRows, patients, treatments, appointments, inventory, restock] = await Promise.all([
      query('select id, name, low_stock_threshold_default from clinics where id = $1', [clinicId]),
      query(`select * from patients     where clinic_id = $1 order by ${RESOURCES.patients.order}`, [clinicId]),
      query(`select * from treatments   where clinic_id = $1 order by ${RESOURCES.treatments.order}`, [clinicId]),
      query(`select * from appointments where clinic_id = $1 order by ${RESOURCES.appointments.order}`, [clinicId]),
      query(`select * from inventory    where clinic_id = $1 order by ${RESOURCES.inventory.order}`, [clinicId]),
      query('select id, item_id, qty, date, cost from restock_log where clinic_id = $1', [clinicId]),
    ]);

    const clinic = clinicRows[0] || {};
    return res.status(200).json({
      clinic: {
        name: clinic.name || 'B-Dental Clinic',
        lowStockThresholdDefault: clinic.low_stock_threshold_default ?? 10,
      },
      patients: patients.map((r) => rowToObj(r, RESOURCES.patients)),
      treatments: treatments.map((r) => rowToObj(r, RESOURCES.treatments)),
      appointments: appointments.map((r) => rowToObj(r, RESOURCES.appointments)),
      inventory: inventory.map((r) => rowToObj(r, RESOURCES.inventory)),
      restockLog: restock.map((r) => ({
        id: r.id, itemId: r.item_id, qty: Number(r.qty), date: r.date, cost: Number(r.cost),
      })),
    });
  } catch (err) {
    console.error('[bootstrap]', err);
    return res.status(500).json({ error: 'Could not load clinic data.' });
  }
}
