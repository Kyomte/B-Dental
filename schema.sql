-- B-Dental schema. Multi-tenant: every row is scoped by clinic_id.
-- IDs are client-generated text (e.g. "p_ab12cd3"), matching the frontend uid().

create table if not exists clinics (
  id                          text primary key,
  email                       text unique not null,
  password_hash               text not null,
  name                        text not null default 'B-Dental Clinic',
  low_stock_threshold_default integer not null default 10,
  created_at                  timestamptz not null default now()
);

create table if not exists treatments (
  id        text primary key,
  clinic_id text not null references clinics(id) on delete cascade,
  name      text,
  category  text,
  price     numeric,
  duration  integer
);

create table if not exists patients (
  id            text primary key,
  clinic_id     text not null references clinics(id) on delete cascade,
  first_name    text,
  last_name     text,
  dob           text,
  phone         text,
  email         text,
  sex           text,
  address       text,
  allergies     text,
  medical_notes text,
  insurance     text,
  created_at    text
);

create table if not exists appointments (
  id           text primary key,
  clinic_id    text not null references clinics(id) on delete cascade,
  patient_id   text references patients(id) on delete cascade,
  treatment_id text references treatments(id) on delete set null,
  date         text,
  time         text,
  status       text,
  notes        text
);

create table if not exists inventory (
  id           text primary key,
  clinic_id    text not null references clinics(id) on delete cascade,
  name         text,
  category     text,
  sku          text,
  unit         text,
  qty          integer,
  threshold    integer,
  price        numeric,
  supplier     text,
  last_restock text
);

create table if not exists restock_log (
  id        text primary key,
  clinic_id text not null references clinics(id) on delete cascade,
  item_id   text references inventory(id) on delete cascade,
  qty       integer,
  date      text,
  cost      numeric
);

create index if not exists idx_patients_clinic     on patients(clinic_id);
create index if not exists idx_treatments_clinic   on treatments(clinic_id);
create index if not exists idx_appointments_clinic on appointments(clinic_id);
create index if not exists idx_inventory_clinic    on inventory(clinic_id);
create index if not exists idx_restock_clinic      on restock_log(clinic_id);
