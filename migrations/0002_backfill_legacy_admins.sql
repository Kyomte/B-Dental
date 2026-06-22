-- 0002_backfill_legacy_admins: promote pre-users clinic credentials to admin users.
--
-- Before the users table existed, auth lived directly on clinics(email,
-- password_hash). Any clinic still carrying those columns but lacking a user row
-- needs a seed admin so its owner can still log in. This was previously done
-- imperatively in scripts/db-setup.js; it now lives here as a tracked migration.
--
-- Idempotent on its own terms: the `where not exists` guard means re-running
-- selects no clinics once every legacy clinic has a user. (The migration runner
-- also won't re-run it once recorded, but the guard keeps it safe regardless.)
insert into users (id, clinic_id, email, password_hash, name, role)
select
  'u_' || substr(md5(random()::text || c.id), 1, 12),
  c.id,
  c.email,
  c.password_hash,
  coalesce(nullif(c.name, ''), 'Admin'),
  'admin'
from clinics c
where c.email is not null
  and c.password_hash is not null
  and not exists (select 1 from users u where u.clinic_id = c.id);
