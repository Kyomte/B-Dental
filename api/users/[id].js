import { query } from '../../lib/db.js';
import { requireAdmin } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'method not allowed' });

  const session = await requireAdmin(req, res);
  if (!session) return;

  const id = req.query.id;
  if (id === session.userId) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  try {
    const target = await query(
      'select id, role from users where id = $1 and clinic_id = $2',
      [id, session.clinicId]
    );
    if (!target.length) return res.status(404).json({ error: 'User not found.' });
    if (target[0].role === 'admin') {
      return res.status(403).json({ error: 'Admin accounts cannot be deleted.' });
    }
    await query('delete from users where id = $1 and clinic_id = $2', [id, session.clinicId]);
    return res.status(204).end();
  } catch (err) {
    console.error('[users:delete]', err);
    return res.status(500).json({ error: 'Request failed.' });
  }
}
