import { query } from '../../lib/db.js';
import { getSession } from '../../lib/auth.js';

export default async function handler(req, res) {
  let firstSetup = false;
  try {
    const rows = await query('select count(*)::int as n from users', []);
    firstSetup = (rows[0]?.n ?? 0) === 0;
  } catch (err) {
    // DB unreachable: surface as a soft "not logged in" rather than 500 so
    // the auth screen can still render (and the user can retry).
    console.error('[me:firstSetupProbe]', err);
  }

  const session = await getSession(req);
  if (!session) return res.status(200).json({ user: null, clinic: null, firstSetup });

  return res.status(200).json({
    user: { id: session.userId, email: session.email, name: session.name, role: session.role },
    clinic: session.clinic,
    firstSetup: false,
  });
}
