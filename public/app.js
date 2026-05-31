/* =========================================================
   B-Dental Clinic Manager — glass UI
   ========================================================= */

const STORE_KEY = 'b-dental.v2';

/* ---------- SEED ---------- */
const SEED = {
  clinic: { name: 'B-Dental Clinic', lowStockThresholdDefault: 10 },
  patients: [
    { id: 'p1', firstName: 'Maria',  lastName: 'Santos',     dob: '1991-04-12', phone: '+63 917 222 1010', email: 'maria.s@example.com',  sex: 'F', address: 'Quezon City',     allergies: 'Penicillin', medicalNotes: 'Hypertension, on Losartan', insurance: 'Maxicare',     createdAt: '2025-08-12' },
    { id: 'p2', firstName: 'Juan',   lastName: 'Dela Cruz',  dob: '1985-09-30', phone: '+63 928 311 4488', email: 'juan.dc@example.com',  sex: 'M', address: 'Pasig',           allergies: 'None',       medicalNotes: 'Smoker',                  insurance: 'Intellicare',  createdAt: '2025-09-02' },
    { id: 'p3', firstName: 'Ana',    lastName: 'Reyes',      dob: '2002-01-22', phone: '+63 945 700 8821', email: 'ana.r@example.com',    sex: 'F', address: 'Makati',          allergies: 'Latex',      medicalNotes: '',                        insurance: '—',            createdAt: '2025-10-15' },
    { id: 'p4', firstName: 'Carlos', lastName: 'Mendoza',    dob: '1978-06-05', phone: '+63 906 991 0042', email: 'cmendoza@example.com', sex: 'M', address: 'BGC, Taguig',     allergies: 'Aspirin',    medicalNotes: 'Diabetic type II',        insurance: 'PhilHealth',   createdAt: '2025-11-04' },
    { id: 'p5', firstName: 'Liza',   lastName: 'Tan',        dob: '1996-12-18', phone: '+63 917 003 2211', email: 'liza.tan@example.com', sex: 'F', address: 'Mandaluyong',     allergies: 'None',       medicalNotes: '',                        insurance: 'Maxicare',     createdAt: '2026-01-09' },
    { id: 'p6', firstName: 'Mark',   lastName: 'Villanueva', dob: '1990-03-25', phone: '+63 939 245 6677', email: 'mark.v@example.com',   sex: 'M', address: 'Parañaque',       allergies: '',           medicalNotes: 'Bruxism',                 insurance: '—',            createdAt: '2026-02-21' },
  ],
  treatments: [
    { id: 't1', name: 'Dental Cleaning (Prophylaxis)', category: 'Preventive',  price: 1500,  duration: 45 },
    { id: 't2', name: 'Tooth Extraction',              category: 'Surgical',    price: 2500,  duration: 60 },
    { id: 't3', name: 'Composite Filling',             category: 'Restorative', price: 2200,  duration: 60 },
    { id: 't4', name: 'Root Canal Therapy',            category: 'Endodontic',  price: 12000, duration: 90 },
    { id: 't5', name: 'Teeth Whitening',               category: 'Cosmetic',    price: 8500,  duration: 75 },
    { id: 't6', name: 'Dental Crown (Porcelain)',      category: 'Restorative', price: 18000, duration: 120 },
    { id: 't7', name: 'Orthodontic Adjustment',        category: 'Orthodontic', price: 1800,  duration: 30 },
    { id: 't8', name: 'X-Ray (Panoramic)',             category: 'Diagnostic',  price: 1200,  duration: 15 },
  ],
  appointments: [
    { id: 'a1', patientId: 'p1', treatmentId: 't1', date: '2026-05-29', time: '09:00', status: 'scheduled', notes: 'Follow-up cleaning' },
    { id: 'a2', patientId: 'p2', treatmentId: 't3', date: '2026-05-29', time: '11:00', status: 'scheduled', notes: 'Lower-left molar' },
    { id: 'a3', patientId: 'p3', treatmentId: 't7', date: '2026-05-30', time: '14:30', status: 'scheduled', notes: 'Braces tightening' },
    { id: 'a4', patientId: 'p4', treatmentId: 't4', date: '2026-06-02', time: '10:00', status: 'scheduled', notes: 'Pre-op consult done' },
    { id: 'a5', patientId: 'p5', treatmentId: 't5', date: '2026-05-28', time: '15:30', status: 'scheduled', notes: '' },
    { id: 'a6', patientId: 'p6', treatmentId: 't1', date: '2026-05-26', time: '09:30', status: 'completed', notes: '' },
    { id: 'a7', patientId: 'p1', treatmentId: 't8', date: '2026-05-20', time: '08:30', status: 'completed', notes: '' },
    { id: 'a8', patientId: 'p2', treatmentId: 't2', date: '2026-05-18', time: '13:00', status: 'canceled',  notes: 'Patient rescheduled' },
  ],
  inventory: [
    { id: 'i1',  name: 'Composite Resin (A2 shade)',  category: 'Restorative', sku: 'CR-A2-4G',  unit: 'syringe',  qty: 22, threshold: 10, price: 480,  supplier: '3M ESPE',   lastRestock: '2026-04-10' },
    { id: 'i2',  name: 'Lidocaine 2% w/ Epinephrine', category: 'Anesthetic',  sku: 'LIDO-2-50', unit: 'cartridge',qty: 8,  threshold: 25, price: 65,   supplier: 'Septodont', lastRestock: '2026-03-22' },
    { id: 'i3',  name: 'Latex Gloves (M)',            category: 'PPE',         sku: 'GLV-M-100', unit: 'box',      qty: 14, threshold: 6,  price: 350,  supplier: 'Ansell',    lastRestock: '2026-05-01' },
    { id: 'i4',  name: 'Surgical Mask (Lvl 3)',       category: 'PPE',         sku: 'MSK-L3-50', unit: 'box',      qty: 3,  threshold: 8,  price: 220,  supplier: 'Halyard',   lastRestock: '2026-04-19' },
    { id: 'i5',  name: 'Dental Floss',                category: 'Consumable',  sku: 'FLOSS-50',  unit: 'pack',     qty: 31, threshold: 10, price: 90,   supplier: 'Oral-B',    lastRestock: '2026-05-05' },
    { id: 'i6',  name: 'Sodium Hypochlorite 5%',      category: 'Endodontic',  sku: 'NaOCl-500', unit: 'bottle',   qty: 5,  threshold: 6,  price: 280,  supplier: 'Vista',     lastRestock: '2026-04-02' },
    { id: 'i7',  name: 'Disposable Suction Tips',     category: 'Consumable',  sku: 'SCT-100',   unit: 'box',      qty: 19, threshold: 6,  price: 180,  supplier: 'Dentsply',  lastRestock: '2026-05-12' },
    { id: 'i8',  name: 'Articulating Paper (Blue)',   category: 'Consumable',  sku: 'ART-PP-BLU',unit: 'pack',     qty: 2,  threshold: 4,  price: 240,  supplier: 'Bausch',    lastRestock: '2026-02-26' },
    { id: 'i9',  name: 'Gutta-Percha Points 25mm',    category: 'Endodontic',  sku: 'GP-25',     unit: 'box',      qty: 7,  threshold: 5,  price: 720,  supplier: 'Dentsply',  lastRestock: '2026-04-28' },
    { id: 'i10', name: 'Porcelain Crown Kit',         category: 'Lab',         sku: 'PCK-01',    unit: 'kit',      qty: 1,  threshold: 3,  price: 4200, supplier: 'GC Corp',   lastRestock: '2026-03-15' },
    { id: 'i11', name: 'Bleaching Gel 35% HP',        category: 'Cosmetic',    sku: 'BG-35',     unit: 'syringe',  qty: 12, threshold: 5,  price: 950,  supplier: 'Opalescence', lastRestock: '2026-05-02' },
    { id: 'i12', name: 'Glass Ionomer Cement',        category: 'Restorative', sku: 'GIC-15',    unit: 'kit',      qty: 0,  threshold: 2,  price: 1850, supplier: 'GC Corp',   lastRestock: '2026-01-30' },
  ],
  restockLog: [],
};

/* ---------- MODE ---------- */
// Demo: data lives only in this browser (localStorage), seeded with samples.
// Real: data lives in Postgres behind /api, gated by login. Set at build time.
const CONFIG = window.BDENTAL_CONFIG || { demo: true };
const DEMO = !!CONFIG.demo;

const emptyState = () => ({
  clinic: { name: 'B-Dental Clinic', lowStockThresholdDefault: 10 },
  patients: [], treatments: [], appointments: [], inventory: [], restockLog: [],
});

/* ---------- STATE ---------- */
let state = DEMO ? loadLocal() : emptyState();
let session = null; // { id, email, name } once logged in (real mode)
let currentView = 'dashboard';
let viewState = {
  patientSearch: '', patientFilter: 'all',
  apptFilter: 'all', apptSearch: '', apptMonthOffset: 0,
  invSearch: '', invFilter: 'all',
  patientDetailId: null, patientDetailTab: 'overview',
  treatmentSearch: '',
};

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return structuredClone(SEED);
}
function saveLocal() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {} }
function uid(p='x') { return p + '_' + Math.random().toString(36).slice(2, 9); }

/* ---------- API + PERSISTENCE ----------
   The in-memory `state` stays the single source the views render from.
   Mutations update it optimistically, then persist: demo writes the whole
   state to localStorage; real mode fires the matching granular REST call. */
async function api(method, path, body) {
  const res = await fetch('/api' + path, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { session = null; showAuth('login'); throw new Error('unauthorized'); }
  if (!res.ok) {
    let msg = 'Request failed';
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

function persistError(err) {
  if (err && err.message === 'unauthorized') return;
  toast('Could not save to server: ' + (err?.message || 'unknown error'), 'danger');
}

const persist = {
  create:  (resource, obj)     => DEMO ? saveLocal() : api('POST',   '/' + resource, obj).catch(persistError),
  update:  (resource, id, obj) => DEMO ? saveLocal() : api('PUT',    '/' + resource + '/' + id, obj).catch(persistError),
  remove:  (resource, id)      => DEMO ? saveLocal() : api('DELETE', '/' + resource + '/' + id).catch(persistError),
  restock: (payload)           => DEMO ? saveLocal() : api('POST',   '/restock', payload).catch(persistError),
};

/* ---------- HELPERS ---------- */
const PHP = n => '₱' + (n || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 });
const initials = (a='', b='') => (a[0]||'').toUpperCase() + (b[0]||'').toUpperCase();
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '';
// Demo uses a fixed date so the sample schedule stays coherent; real mode uses now.
const today = () => DEMO ? '2026-05-28' : new Date().toISOString().slice(0, 10);
const ageFrom = dob => {
  if (!dob) return '—';
  const d = new Date(dob), t = new Date(today());
  let a = t.getFullYear() - d.getFullYear();
  if (t.getMonth() < d.getMonth() || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) a--;
  return a;
};
const findPatient = id => state.patients.find(p => p.id === id);
const findTreatment = id => state.treatments.find(t => t.id === id);
const findItem = id => state.inventory.find(i => i.id === id);
const lowStockItems = () => state.inventory.filter(i => i.qty <= i.threshold);
const criticalStockItems = () => state.inventory.filter(i => i.qty === 0);
const escape = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const avatarAlt = id => 'alt-' + ((id.charCodeAt(id.length-1) % 4) + 1);

/* ---------- ROUTING ---------- */
async function setView(v) {
  // Hard gates for admin-only views. Belt-and-braces alongside hidden nav items.
  if (!DEMO && (v === 'reports' || v === 'accounts') && session?.user?.role !== 'admin') {
    v = 'dashboard';
  }
  currentView = v;
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === v);
  });
  document.getElementById('pageTitle').textContent = ({
    dashboard: 'Dashboard', patients: 'Patients', appointments: 'Appointments',
    treatments: 'Treatments', inventory: 'Inventory', reports: 'Reports',
    accounts: 'Accounts',
  })[v] || '';
  // Lazy-load the user list when the admin opens Accounts; pulls fresh each time.
  if (v === 'accounts' && !DEMO) {
    try { viewState.users = await api('GET', '/users'); }
    catch (err) { viewState.users = []; persistError(err); }
  }
  render();
}
document.getElementById('nav').addEventListener('click', e => {
  const a = e.target.closest('.nav-item[data-view]');
  if (!a) return;
  setView(a.dataset.view);
});
document.getElementById('quickBookBtn').addEventListener('click', () => openAppointmentModal());

/* ---------- ALERTS / SIDEBAR HEALTH ---------- */
function refreshAlerts() {
  const low = lowStockItems().length;
  const out = criticalStockItems().length;
  const total = state.inventory.length;
  const healthyPct = total ? Math.round(((total - low) / total) * 100) : 100;

  const navLow = document.getElementById('navLowStock');
  if (low > 0) { navLow.hidden = false; navLow.textContent = low; }
  else navLow.hidden = true;

  const pill = document.getElementById('alertCount');
  pill.textContent = low;
  pill.dataset.zero = low === 0;

  document.getElementById('stockHealthPct').textContent = healthyPct + '%';
  const bar = document.getElementById('stockHealthBar');
  bar.style.width = healthyPct + '%';
  bar.className = out > 0 ? 'neg' : low > 0 ? 'warn' : '';
  document.getElementById('stockHealthMeta').textContent =
    out > 0 ? `${out} out of stock` :
    low > 0 ? `${low} low-stock item${low>1?'s':''}` : 'All items healthy';
  document.getElementById('stockHealthSku').textContent = `${total} SKUs`;
}

document.getElementById('alertsBtn').addEventListener('click', () => {
  const items = lowStockItems();
  openModal('Low-stock Alerts', items.length + ' item' + (items.length===1?'':'s') + ' need restocking', `
    ${items.length === 0 ? '<div class="empty">All stock levels are healthy.</div>' : items.map(i => `
      <div class="trade-row">
        <div class="trade-icon ${i.qty===0?'sell':'alert'}">${i.qty}</div>
        <div>
          <div class="trade-name">${escape(i.name)}</div>
          <div class="trade-meta">${escape(i.category)} · ${escape(i.supplier)} · threshold ${i.threshold}</div>
        </div>
        <button class="btn btn-dark btn-sm" data-restock="${escape(i.id)}">Restock</button>
      </div>
    `).join('')}
  `);
  document.getElementById('modalBody').addEventListener('click', e => {
    const id = e.target.dataset.restock;
    if (!id) return;
    closeModal();
    setView('inventory');
    setTimeout(() => openRestockModal(id), 50);
  }, { once: true });
});

/* ---------- GLOBAL SEARCH ---------- */
document.getElementById('globalSearch').addEventListener('input', e => {
  const q = e.target.value;
  if (currentView === 'patients')    viewState.patientSearch = q;
  else if (currentView === 'inventory')   viewState.invSearch = q;
  else if (currentView === 'treatments')  viewState.treatmentSearch = q;
  else if (currentView === 'appointments')viewState.apptSearch = q;
  else { viewState.patientSearch = q; setView('patients'); return; }
  render();
});

/* ---------- MODAL ---------- */
function openModal(title, sub, html, opts={}) {
  const root = document.getElementById('modalRoot');
  document.getElementById('modalTitle').textContent = title;
  const subEl = document.getElementById('modalSub');
  if (sub) { subEl.textContent = sub; subEl.hidden = false; }
  else { subEl.hidden = true; }
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modalEl').classList.toggle('wide', !!opts.wide);
  root.hidden = false;
}
function closeModal() { document.getElementById('modalRoot').hidden = true; }
document.getElementById('modalRoot').addEventListener('click', e => {
  if (e.target.dataset.close !== undefined || e.target.id === 'modalRoot') closeModal();
});

/* ---------- TOAST ---------- */
function toast(msg, kind='') {
  const host = document.getElementById('toastHost');
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* =========================================================
   VIEWS
   ========================================================= */
function render() {
  const root = document.getElementById('view-root');
  switch (currentView) {
    case 'dashboard':    root.innerHTML = renderDashboard(); break;
    case 'patients':     root.innerHTML = viewState.patientDetailId ? renderPatientDetail() : renderPatients(); break;
    case 'appointments': root.innerHTML = renderAppointments(); break;
    case 'treatments':   root.innerHTML = renderTreatments(); break;
    case 'inventory':    root.innerHTML = renderInventory(); break;
    case 'reports':      root.innerHTML = renderReports(); break;
    case 'accounts':     root.innerHTML = renderAccounts(); break;
  }
  bindEvents();
  refreshAlerts();
}

/* ====== DASHBOARD ====== */
function renderDashboard() {
  const todayStr = today();
  const todays = state.appointments.filter(a => a.date === todayStr && a.status === 'scheduled');
  const upcoming = state.appointments
    .filter(a => a.date >= todayStr && a.status === 'scheduled')
    .sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time))
    .slice(0, 5);
  const revenue = state.appointments
    .filter(a => a.status === 'completed')
    .reduce((s,a) => s + (findTreatment(a.treatmentId)?.price || 0), 0);
  const low = lowStockItems();
  const crit = criticalStockItems();

  return `
    ${low.length ? `
      <div class="banner ${crit.length ? 'danger' : ''}">
        <span class="ico">${crit.length ? '⚠' : '◆'}</span>
        <div class="flex-1">
          <b>${low.length}</b> inventory item${low.length>1?'s':''} ${crit.length ? `(${crit.length} out of stock)` : ''} need restocking.
        </div>
        <button class="btn btn-light btn-sm" data-action="goto-inventory">Review Inventory →</button>
      </div>
    ` : ''}

    <div class="dash-grid">
      <div class="col" style="gap:var(--space-6)">
        <section class="hero">
          <div class="eyebrow-chip ${low.length ? 'warn' : 'pos'}">
            <span class="pulse"></span>
            <span>${low.length ? 'Action needed' : 'All systems healthy'}</span>
          </div>
          <h1>Welcome back${DEMO ? ', Dr. Reyes' : (state.clinic?.name ? ', ' + escape(state.clinic.name) : '')}.</h1>
          <div class="lede">You have <b>${todays.length}</b> appointment${todays.length===1?'':'s'} today and <b>${low.length}</b> inventory item${low.length===1?'':'s'} that need attention.</div>
          <div class="hero-buttons">
            <button class="btn btn-dark" data-action="new-appointment">+ Book Appointment</button>
            <button class="btn btn-light" data-action="new-patient">Add Patient</button>
          </div>
          <div class="hero-blob">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4c0 1.5.5 2.5 1.5 3.5 1 1 1.5 2 1.5 4.5v6c0 1 .5 2 1 2s1-1 1-2v-4c0-1 .5-1 1-1s1 0 1 1v4c0 1 .5 2 1 2s1-1 1-2v-6c0-2.5.5-3.5 1.5-4.5C17.5 8.5 18 7.5 18 6a4 4 0 0 0-6-4z"/></svg>
          </div>
        </section>

        <div class="card activity">
          <div class="activity-head">
            <h3>Upcoming Appointments</h3>
            <button class="view-all" data-action="goto-appointments">View all →</button>
          </div>
          ${upcoming.length === 0 ? '<div class="empty">No upcoming appointments.</div>' : upcoming.map(a => {
            const p = findPatient(a.patientId);
            const t = findTreatment(a.treatmentId);
            return `
              <div class="trade-row">
                <div class="trade-icon buy">${initials(p?.firstName, p?.lastName)}</div>
                <div>
                  <div class="trade-name">${escape(p?.firstName)} ${escape(p?.lastName)} · ${escape(t?.name)}</div>
                  <div class="trade-meta">${fmtDate(a.date)} · ${escape(a.time)} · ${escape(a.notes || 'No notes')}</div>
                </div>
                <div>
                  <div class="trade-amt">${PHP(t?.price)}</div>
                  <div class="trade-status pending">Scheduled</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="actions">
          <button class="action" data-action="new-patient">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <div class="action-label">New Patient</div>
          </button>
          <button class="action" data-action="new-appointment">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="action-label">Book Appointment</div>
          </button>
          <button class="action" data-action="new-treatment">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div class="action-label">Add Treatment</div>
          </button>
          <button class="action dark" data-action="new-inventory">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <div class="action-label">Stock Item</div>
          </button>
        </div>
      </div>

      <div class="stat-stack">
        <div class="stat dark">
          <div class="stat-label">Today's Appointments<span class="stat-icon">📅</span></div>
          <div class="stat-value">${todays.length}</div>
          <div class="stat-meta">${state.appointments.filter(a=>a.date===todayStr).length} total on schedule</div>
        </div>
        <div class="stat">
          <div class="stat-label">Active Patients<span class="stat-icon">◉</span></div>
          <div class="stat-value">${state.patients.length}</div>
          <div class="stat-meta"><span class="pos">+2 this month</span></div>
        </div>
        <div class="stat">
          <div class="stat-label">Revenue (Completed)<span class="stat-icon">₱</span></div>
          <div class="stat-value">${PHP(revenue)}</div>
          <div class="stat-meta"><span class="pos">▲ 12.4% MoM</span></div>
        </div>
        <div class="stat">
          <div class="stat-label">Low-stock Items<span class="stat-icon">◆</span></div>
          <div class="stat-value" style="color:${low.length ? 'var(--neg)' : 'inherit'}">${low.length}</div>
          <div class="stat-meta">${crit.length > 0 ? `<span class="neg">${crit.length} out of stock</span>` : low.length > 0 ? `<span class="warn">below threshold</span>` : '<span class="pos">All healthy</span>'}</div>
        </div>
      </div>
    </div>
  `;
}

/* ====== PATIENTS ====== */
function renderPatients() {
  const q = viewState.patientSearch.toLowerCase();
  const f = viewState.patientFilter;
  let list = state.patients.filter(p =>
    !q || (`${p.firstName} ${p.lastName} ${p.email} ${p.phone}`).toLowerCase().includes(q)
  );
  if (f === 'new') list = list.filter(p => new Date(p.createdAt) >= new Date('2026-01-01'));
  else if (f === 'insured') list = list.filter(p => p.insurance && p.insurance !== '—');

  return `
    <div class="card">
      <div class="card-head">
        <div>
          <h3>Patient Directory</h3>
          <div class="text-muted" style="font-size:13px;margin-top:4px">${state.patients.length} total · ${list.length} shown</div>
        </div>
        <div class="card-head-actions">
          <button class="btn btn-dark" data-action="new-patient">+ New Patient</button>
        </div>
      </div>
      <div class="filter-bar">
        <button class="preset-chip ${f==='all'?'active':''}"     data-pfilter="all">All</button>
        <button class="preset-chip ${f==='new'?'active':''}"     data-pfilter="new">New in 2026</button>
        <button class="preset-chip ${f==='insured'?'active':''}" data-pfilter="insured">Insured</button>
      </div>
    </div>

    <div class="tile-grid">
      ${list.length === 0 ? '<div class="empty">No patients match this filter.</div>' : list.map(p => {
        const visits = state.appointments.filter(a => a.patientId === p.id).length;
        const next = state.appointments
          .filter(a => a.patientId === p.id && a.status === 'scheduled' && a.date >= today())
          .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))[0];
        const hasAllergy = p.allergies && p.allergies !== 'None' && p.allergies !== '';
        return `
          <div class="tile" data-open-patient="${escape(p.id)}">
            <div class="tile-corner-tags">
              ${p.insurance && p.insurance !== '—' ? `<span class="tag tag-good">${escape(p.insurance)}</span>` : ''}
              ${hasAllergy ? `<span class="tag tag-bad">⚠ ${escape(p.allergies)}</span>` : ''}
            </div>
            <div class="tile-head">
              <div class="tile-avatar ${avatarAlt(p.id)}">${initials(p.firstName,p.lastName)}</div>
              <div>
                <div class="tile-title">${escape(p.firstName)} ${escape(p.lastName)}</div>
                <div class="tile-sub">${ageFrom(p.dob)} yrs · ${p.sex==='F'?'Female':'Male'} · ${escape(p.address)}</div>
              </div>
            </div>
            <div class="tile-stats">
              <div class="tile-stat"><span class="k">Phone</span><span class="v">${escape(p.phone)}</span></div>
              <div class="tile-stat"><span class="k">Visits</span><span class="v">${visits}</span></div>
              <div class="tile-stat"><span class="k">Next</span><span class="v">${next ? fmtDate(next.date) : '—'}</span></div>
            </div>
            <div class="tile-foot">
              <button class="btn btn-ghost btn-sm" data-open-patient="${escape(p.id)}">View Profile</button>
              <button class="btn btn-dark btn-sm" data-book-for="${escape(p.id)}">Book</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ====== PATIENT DETAIL ====== */
function renderPatientDetail() {
  const p = findPatient(viewState.patientDetailId);
  if (!p) { viewState.patientDetailId = null; return renderPatients(); }
  const visits = state.appointments.filter(a => a.patientId === p.id)
    .sort((a,b) => (b.date+b.time).localeCompare(a.date+a.time));
  const completed = visits.filter(v => v.status === 'completed');
  const totalSpent = completed.reduce((s,v) => s + (findTreatment(v.treatmentId)?.price || 0), 0);
  const tab = viewState.patientDetailTab;
  const hasAllergy = p.allergies && p.allergies !== 'None' && p.allergies !== '';

  return `
    <div class="row" style="gap:10px">
      <button class="btn btn-ghost btn-sm" data-action="back-to-patients">← Back to Patients</button>
    </div>

    <div class="detail-grid mt-12">
      <aside class="detail-side">
        <div class="avatar-lg ${avatarAlt(p.id)}">${initials(p.firstName,p.lastName)}</div>
        <h4>${escape(p.firstName)} ${escape(p.lastName)}</h4>
        <div class="sub">Patient #${p.id.toUpperCase()}</div>
        <div class="kv-list">
          <div class="kv"><span class="k">Age</span><span class="v">${ageFrom(p.dob)} yrs · ${p.sex==='F'?'F':'M'}</span></div>
          <div class="kv"><span class="k">Phone</span><span class="v">${escape(p.phone)}</span></div>
          <div class="kv"><span class="k">Email</span><span class="v">${escape(p.email)}</span></div>
          <div class="kv"><span class="k">DOB</span><span class="v">${fmtDate(p.dob)}</span></div>
          <div class="kv"><span class="k">Address</span><span class="v">${escape(p.address)}</span></div>
          <div class="kv"><span class="k">Insurance</span><span class="v">${escape(p.insurance || '—')}</span></div>
        </div>
        <div class="mt-22" style="text-align:left">
          <div class="tile-stat" style="margin-bottom:10px"><span class="k">Allergies</span></div>
          ${hasAllergy ? `<span class="tag tag-bad">⚠ ${escape(p.allergies)}</span>` : `<span class="tag tag-muted">None</span>`}
        </div>
        <div class="mt-12" style="text-align:left">
          <div class="tile-stat" style="margin-bottom:6px"><span class="k">Medical Notes</span></div>
          <div style="font-size:13px;color:var(--ink-1);font-weight:600">${escape(p.medicalNotes || '—')}</div>
        </div>
        <div class="row mt-22" style="gap:8px">
          <button class="btn btn-ghost btn-sm flex-1" data-edit-patient="${escape(p.id)}">Edit</button>
          <button class="btn btn-dark btn-sm flex-1" data-book-for="${escape(p.id)}">+ Book</button>
        </div>
      </aside>

      <div class="col" style="gap:var(--space-6)">
        <div class="stat-stack" style="flex-direction:row;gap:var(--space-6)">
          <div class="stat" style="flex:1">
            <div class="stat-label">Total Visits</div>
            <div class="stat-value">${visits.length}</div>
          </div>
          <div class="stat" style="flex:1">
            <div class="stat-label">Completed</div>
            <div class="stat-value">${completed.length}</div>
          </div>
          <div class="stat" style="flex:1">
            <div class="stat-label">Total Billed</div>
            <div class="stat-value" style="font-size:24px">${PHP(totalSpent)}</div>
          </div>
        </div>

        <div class="card">
          <div class="tabs">
            <button class="tab ${tab==='overview'?'active':''}" data-tab="overview">Overview</button>
            <button class="tab ${tab==='history'?'active':''}"  data-tab="history">Treatment History</button>
            <button class="tab ${tab==='upcoming'?'active':''}" data-tab="upcoming">Upcoming</button>
          </div>
          ${tab === 'overview' ? renderPatientOverview(visits.slice(0,5))
            : renderPatientHistoryTable(tab === 'history' ? visits.filter(v=>v.status==='completed') : visits.filter(v=>v.status==='scheduled'))
          }
        </div>
      </div>
    </div>
  `;
}
function renderPatientOverview(recent) {
  if (!recent.length) return '<div class="empty">No visits yet.</div>';
  return recent.map(v => {
    const t = findTreatment(v.treatmentId);
    const tag = v.status === 'completed' ? 'completed' : v.status === 'canceled' ? 'canceled' : 'scheduled';
    return `
      <div class="trade-row">
        <div class="trade-icon ${v.status==='completed'?'swap':v.status==='canceled'?'sell':'buy'}">${new Date(v.date).getDate()}</div>
        <div>
          <div class="trade-name">${escape(t?.name)}</div>
          <div class="trade-meta">${fmtDate(v.date)} · ${escape(v.time)} · ${escape(v.notes || 'No notes')}</div>
        </div>
        <div>
          <div class="trade-amt">${PHP(t?.price)}</div>
          <div class="trade-status ${v.status==='completed'?'ok':v.status==='canceled'?'neg':'pending'}">${tag}</div>
        </div>
      </div>
    `;
  }).join('');
}
function renderPatientHistoryTable(visits) {
  if (!visits.length) return '<div class="empty">Nothing here yet.</div>';
  return `
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Date</th><th>Treatment</th><th>Notes</th><th>Status</th><th>Price</th></tr></thead>
      <tbody>
        ${visits.map(v => {
          const t = findTreatment(v.treatmentId);
          return `<tr>
            <td><span class="mono">${fmtDate(v.date)}</span> <span class="muted">${escape(v.time)}</span></td>
            <td>${escape(t?.name)}</td>
            <td class="muted">${escape(v.notes || '—')}</td>
            <td><span class="tag tag-${v.status==='completed'?'completed':v.status==='canceled'?'canceled':'scheduled'}">${escape(v.status)}</span></td>
            <td class="mono">${PHP(t?.price)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  `;
}

/* ====== APPOINTMENTS ====== */
function renderAppointments() {
  const monthOffset = viewState.apptMonthOffset;
  const baseDate = new Date(today());
  const viewDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstWeekday = viewDate.getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 0).getDate();
  const prevDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: prevDays - firstWeekday + 1 + i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewDate.getFullYear()}-${String(viewDate.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cells.push({ day: d, iso, today: iso === today() });
  }
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstWeekday + 1, muted: true });

  const f = viewState.apptFilter;
  const q = viewState.apptSearch.toLowerCase();
  let list = [...state.appointments];
  if (f !== 'all') list = list.filter(a => a.status === f);
  if (q) list = list.filter(a => {
    const p = findPatient(a.patientId), t = findTreatment(a.treatmentId);
    return (`${p?.firstName} ${p?.lastName} ${t?.name} ${a.notes}`).toLowerCase().includes(q);
  });
  list.sort((a,b) => (b.date+b.time).localeCompare(a.date+a.time));

  return `
    <div class="card">
      <div class="card-head">
        <div class="cal-nav">
          <button class="icon-btn" data-cal-prev>‹</button>
          <div class="month">${monthName}</div>
          <button class="icon-btn" data-cal-next>›</button>
          <button class="btn btn-ghost btn-sm" data-cal-today>Today</button>
        </div>
        <div class="card-head-actions">
          <button class="btn btn-dark" data-action="new-appointment">+ Book Appointment</button>
        </div>
      </div>
      <div class="cal">
        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="cal-head">${d}</div>`).join('')}
        ${cells.map(c => {
          if (c.muted) return `<div class="cal-cell muted"><div class="d">${c.day}</div></div>`;
          const dayAppts = state.appointments.filter(a => a.date === c.iso);
          return `
            <div class="cal-cell ${c.today?'today':''}">
              <div class="d">${c.day}</div>
              ${dayAppts.slice(0,3).map(a => {
                const p = findPatient(a.patientId);
                const cls = a.status === 'completed' ? 'done' : a.status === 'canceled' ? 'canceled' : (c.iso === today() ? 'warn' : '');
                return `<div class="ap ${cls}" data-edit-appt="${escape(a.id)}" title="${escape(a.time)} ${escape(p?.firstName)} ${escape(p?.lastName)}">${escape(a.time)} ${escape(p?.firstName||'')}</div>`;
              }).join('')}
              ${dayAppts.length > 3 ? `<div class="more">+${dayAppts.length-3} more</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>All Appointments</h3>
        <div class="filter-bar">
          ${['all','scheduled','completed','canceled'].map(s =>
            `<button class="preset-chip ${f===s?'active':''}" data-afilter="${s}">${s[0].toUpperCase()+s.slice(1)}</button>`
          ).join('')}
        </div>
      </div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Date / Time</th><th>Patient</th><th>Treatment</th><th>Notes</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${list.length === 0 ? '<tr><td colspan="6"><div class="empty">No appointments.</div></td></tr>' : list.map(a => {
            const p = findPatient(a.patientId);
            const t = findTreatment(a.treatmentId);
            return `<tr>
              <td><b>${fmtDate(a.date)}</b><br><span class="muted mono">${escape(a.time)}</span></td>
              <td>${escape(p?.firstName)} ${escape(p?.lastName)}</td>
              <td>${escape(t?.name)}<div class="muted mono" style="font-size:11px">${PHP(t?.price)}</div></td>
              <td class="muted">${escape(a.notes || '—')}</td>
              <td><span class="tag tag-${a.status==='completed'?'completed':a.status==='canceled'?'canceled':'scheduled'}">${escape(a.status)}</span></td>
              <td class="nowrap">
                ${a.status === 'scheduled' ? `<button class="btn btn-ghost btn-sm" data-complete-appt="${escape(a.id)}">✓ Complete</button>` : ''}
                <button class="btn btn-ghost btn-sm" data-edit-appt="${escape(a.id)}">Edit</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    </div>
  `;
}

/* ====== TREATMENTS ====== */
function renderTreatments() {
  const q = viewState.treatmentSearch.toLowerCase();
  const list = state.treatments.filter(t => !q || (`${t.name} ${t.category}`).toLowerCase().includes(q));
  return `
    <div class="card">
      <div class="card-head">
        <div>
          <h3>Treatments &amp; Services</h3>
          <div class="text-muted" style="font-size:13px;margin-top:4px">${state.treatments.length} services offered</div>
        </div>
        <button class="btn btn-dark" data-action="new-treatment">+ New Treatment</button>
      </div>
    </div>

    <div class="tile-grid">
      ${list.length === 0 ? '<div class="empty">No treatments found.</div>' : list.map(t => {
        const performed = state.appointments.filter(a => a.treatmentId === t.id && a.status === 'completed').length;
        return `
          <div class="tile flat">
            <div class="tile-corner-tags">
              <span class="tag tag-info">${escape(t.category)}</span>
            </div>
            <div class="tile-head">
              <div class="tile-avatar ${avatarAlt(t.id)}">${escape(t.category.slice(0,2).toUpperCase())}</div>
              <div>
                <div class="tile-title">${escape(t.name)}</div>
                <div class="tile-sub">${t.duration} min · ${performed} performed</div>
              </div>
            </div>
            <div class="tile-key">${PHP(t.price)} <span class="unit">/ visit</span></div>
            <div class="tile-foot">
              <button class="btn btn-ghost btn-sm" data-edit-treatment="${escape(t.id)}">Edit</button>
              <button class="btn btn-danger btn-sm" data-delete-treatment="${escape(t.id)}">Delete</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ====== INVENTORY ====== */
function renderInventory() {
  const q = viewState.invSearch.toLowerCase();
  const f = viewState.invFilter;
  let list = [...state.inventory];
  if (f === 'low') list = list.filter(i => i.qty <= i.threshold && i.qty > 0);
  else if (f === 'out') list = list.filter(i => i.qty === 0);
  else if (f === 'healthy') list = list.filter(i => i.qty > i.threshold);
  if (q) list = list.filter(i => (`${i.name} ${i.sku} ${i.category} ${i.supplier}`).toLowerCase().includes(q));

  const totalValue = state.inventory.reduce((s,i) => s + (i.qty * i.price), 0);
  const low = lowStockItems().length;
  const out = criticalStockItems().length;

  return `
    ${low ? `
      <div class="banner ${out ? 'danger' : ''}">
        <span class="ico">${out ? '⚠' : '◆'}</span>
        <div class="flex-1">
          <b>${low}</b> item${low>1?'s':''} at or below reorder threshold${out ? ` — <b>${out}</b> completely out of stock` : ''}.
        </div>
      </div>
    ` : ''}

    <div class="dash-grid" style="grid-template-columns:1fr 1fr 1fr 1fr">
      <div class="stat"><div class="stat-label">Total SKUs</div><div class="stat-value">${state.inventory.length}</div></div>
      <div class="stat"><div class="stat-label">Low Stock</div><div class="stat-value" style="color:${low?'var(--warn)':''}">${low}</div></div>
      <div class="stat"><div class="stat-label">Out of Stock</div><div class="stat-value" style="color:${out?'var(--neg)':''}">${out}</div></div>
      <div class="stat dark"><div class="stat-label">Stock Value</div><div class="stat-value" style="font-size:24px">${PHP(totalValue)}</div></div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Inventory</h3>
        <div class="card-head-actions">
          <button class="btn btn-ghost" data-action="export-inventory">Export CSV</button>
          <button class="btn btn-dark" data-action="new-inventory">+ Add Item</button>
        </div>
      </div>
      <div class="filter-bar">
        <button class="preset-chip ${f==='all'?'active':''}"     data-ifilter="all">All (${state.inventory.length})</button>
        <button class="preset-chip ${f==='low'?'active':''}"     data-ifilter="low">Low (${state.inventory.filter(i=>i.qty<=i.threshold && i.qty>0).length})</button>
        <button class="preset-chip ${f==='out'?'active':''}"     data-ifilter="out">Out (${out})</button>
        <button class="preset-chip ${f==='healthy'?'active':''}" data-ifilter="healthy">Healthy (${state.inventory.filter(i=>i.qty>i.threshold).length})</button>
      </div>
    </div>

    <div class="tile-grid">
      ${list.length === 0 ? '<div class="empty">No items match this filter.</div>' : list.map(i => {
        const lowFlag = i.qty <= i.threshold;
        const outFlag = i.qty === 0;
        const pct = Math.min(100, (i.qty / Math.max(i.threshold*2, 1)) * 100);
        const barCls = outFlag ? 'neg' : lowFlag ? 'warn' : 'pos';
        const keyCls = outFlag ? 'neg' : lowFlag ? 'warn' : '';
        return `
          <div class="tile flat">
            <div class="tile-corner-tags">
              ${outFlag ? `<span class="tag tag-bad">Out of stock</span>`
                : lowFlag ? `<span class="tag tag-warn">Low stock</span>`
                : `<span class="tag tag-good">In stock</span>`}
            </div>
            <div class="tile-head">
              <div class="tile-avatar ${avatarAlt(i.id)}">${escape(i.category.slice(0,2).toUpperCase())}</div>
              <div>
                <div class="tile-title">${escape(i.name)}</div>
                <div class="tile-sub">${escape(i.category)} · ${escape(i.sku)}</div>
              </div>
            </div>
            <div class="tile-key ${keyCls}">${i.qty} <span class="unit">/ ${i.threshold} ${escape(i.unit)}${i.qty===1?'':'s'}</span></div>
            <div class="stock-bar"><span class="${barCls}" style="width:${pct}%"></span></div>
            <div class="tile-stats">
              <div class="tile-stat"><span class="k">Price</span><span class="v">${PHP(i.price)}</span></div>
              <div class="tile-stat"><span class="k">Supplier</span><span class="v">${escape(i.supplier)}</span></div>
              <div class="tile-stat"><span class="k">Restocked</span><span class="v">${fmtDate(i.lastRestock)}</span></div>
            </div>
            <div class="tile-foot">
              <button class="btn btn-ghost btn-sm" data-edit-inventory="${escape(i.id)}">Edit</button>
              <button class="btn btn-dark btn-sm" data-restock="${escape(i.id)}">+ Restock</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ====== REPORTS ====== */
function renderReports() {
  const completed = state.appointments.filter(a => a.status === 'completed');
  const revenueByCategory = {};
  for (const a of completed) {
    const t = findTreatment(a.treatmentId);
    if (!t) continue;
    revenueByCategory[t.category] = (revenueByCategory[t.category] || 0) + t.price;
  }
  const sorted = Object.entries(revenueByCategory).sort((a,b) => b[1]-a[1]);
  const totalRev = sorted.reduce((s,[,v]) => s+v, 0);

  const topTreatments = state.treatments.map(t => ({
    ...t,
    count: state.appointments.filter(a => a.treatmentId === t.id && a.status === 'completed').length
  })).filter(t => t.count > 0).sort((a,b) => b.count - a.count).slice(0,5);

  const supplierSpend = {};
  for (const i of state.inventory) supplierSpend[i.supplier] = (supplierSpend[i.supplier] || 0) + (i.qty * i.price);
  const suppliers = Object.entries(supplierSpend).sort((a,b) => b[1]-a[1]);

  return `
    <div class="dash-grid" style="grid-template-columns:1fr 1fr 1fr 1fr">
      <div class="stat dark"><div class="stat-label">Revenue</div><div class="stat-value" style="font-size:24px">${PHP(totalRev)}</div></div>
      <div class="stat"><div class="stat-label">Completed</div><div class="stat-value">${completed.length}</div></div>
      <div class="stat"><div class="stat-label">Scheduled</div><div class="stat-value">${state.appointments.filter(a=>a.status==='scheduled').length}</div></div>
      <div class="stat"><div class="stat-label">Canceled</div><div class="stat-value">${state.appointments.filter(a=>a.status==='canceled').length}</div></div>
    </div>

    <div class="dash-grid" style="align-items:stretch">
      <div class="card">
        <div class="card-head"><h3>Revenue by Category</h3></div>
        ${sorted.length === 0 ? '<div class="empty">No completed treatments yet.</div>' : sorted.map(([cat, val]) => {
          const pct = totalRev ? (val/totalRev)*100 : 0;
          return `
            <div style="margin-bottom:16px">
              <div class="row between" style="margin-bottom:6px">
                <div style="font-weight:700">${escape(cat)}</div>
                <div><b>${PHP(val)}</b> <span class="text-muted">${pct.toFixed(0)}%</span></div>
              </div>
              <div class="stock-bar" style="height:8px"><span style="width:${pct}%"></span></div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="card">
        <div class="card-head"><h3>Top Treatments</h3></div>
        ${topTreatments.length === 0 ? '<div class="empty">No data yet.</div>' : topTreatments.map((t, i) => `
          <div class="trade-row">
            <div class="trade-icon ${i===0?'swap':'buy'}">#${i+1}</div>
            <div>
              <div class="trade-name">${escape(t.name)}</div>
              <div class="trade-meta">${t.count} performed · ${escape(t.category)}</div>
            </div>
            <div>
              <div class="trade-amt">${PHP(t.price * t.count)}</div>
              <div class="trade-status done">Revenue</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Inventory Investment by Supplier</h3></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Supplier</th><th>Items</th><th>Total Value</th></tr></thead>
        <tbody>
          ${suppliers.map(([sup, val]) => `
            <tr>
              <td><b>${escape(sup)}</b></td>
              <td>${state.inventory.filter(i => i.supplier === sup).length}</td>
              <td class="mono"><b>${PHP(val)}</b></td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>
    </div>
  `;
}

/* =========================================================
   EVENTS
   ========================================================= */
function bindEvents() {
  const root = document.getElementById('view-root');

  root.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const a = el.dataset.action;
      if (a === 'new-patient') openPatientModal();
      else if (a === 'new-appointment') openAppointmentModal();
      else if (a === 'new-treatment') openTreatmentModal();
      else if (a === 'new-inventory') openInventoryModal();
      else if (a === 'goto-inventory') setView('inventory');
      else if (a === 'goto-appointments') setView('appointments');
      else if (a === 'back-to-patients') { viewState.patientDetailId = null; render(); }
      else if (a === 'export-inventory') exportInventoryCSV();
    });
  });

  root.querySelectorAll('[data-open-patient]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('button[data-book-for], button[data-edit-patient]')) return;
      viewState.patientDetailId = el.dataset.openPatient;
      viewState.patientDetailTab = 'overview';
      render();
    });
  });
  root.querySelectorAll('[data-edit-patient]').forEach(el => el.addEventListener('click', e => { e.stopPropagation(); openPatientModal(el.dataset.editPatient); }));
  root.querySelectorAll('[data-book-for]').forEach(el => el.addEventListener('click', e => { e.stopPropagation(); openAppointmentModal(null, el.dataset.bookFor); }));

  root.querySelectorAll('[data-edit-appt]').forEach(el => el.addEventListener('click', () => openAppointmentModal(el.dataset.editAppt)));
  root.querySelectorAll('[data-complete-appt]').forEach(el => el.addEventListener('click', () => completeAppointment(el.dataset.completeAppt)));
  root.querySelectorAll('[data-cal-prev]').forEach(el => el.addEventListener('click', () => { viewState.apptMonthOffset--; render(); }));
  root.querySelectorAll('[data-cal-next]').forEach(el => el.addEventListener('click', () => { viewState.apptMonthOffset++; render(); }));
  root.querySelectorAll('[data-cal-today]').forEach(el => el.addEventListener('click', () => { viewState.apptMonthOffset = 0; render(); }));

  root.querySelectorAll('[data-edit-treatment]').forEach(el => el.addEventListener('click', () => openTreatmentModal(el.dataset.editTreatment)));
  root.querySelectorAll('[data-delete-treatment]').forEach(el => el.addEventListener('click', () => deleteTreatment(el.dataset.deleteTreatment)));

  root.querySelectorAll('[data-edit-inventory]').forEach(el => el.addEventListener('click', () => openInventoryModal(el.dataset.editInventory)));
  root.querySelectorAll('[data-restock]').forEach(el => el.addEventListener('click', () => openRestockModal(el.dataset.restock)));

  root.querySelectorAll('[data-pfilter]').forEach(el => el.addEventListener('click', () => { viewState.patientFilter = el.dataset.pfilter; render(); }));
  root.querySelectorAll('[data-afilter]').forEach(el => el.addEventListener('click', () => { viewState.apptFilter = el.dataset.afilter; render(); }));
  root.querySelectorAll('[data-ifilter]').forEach(el => el.addEventListener('click', () => { viewState.invFilter = el.dataset.ifilter; render(); }));

  root.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('click', () => { viewState.patientDetailTab = t.dataset.tab; render(); }));

  // Accounts view: invite + delete handlers
  const inviteForm = root.querySelector('#inviteForm');
  if (inviteForm) inviteForm.addEventListener('submit', onInviteSubmit);
  root.querySelectorAll('[data-delete-user]').forEach(el =>
    el.addEventListener('click', () => onDeleteUser(el.dataset.deleteUser, el.dataset.deleteUserEmail))
  );
}

/* =========================================================
   MODALS — CRUD
   ========================================================= */
function openPatientModal(id) {
  const p = id ? findPatient(id) : { firstName:'', lastName:'', dob:'', phone:'', email:'', sex:'F', address:'', allergies:'', medicalNotes:'', insurance:'' };
  openModal(id ? 'Edit Patient' : 'New Patient', id ? 'Update details' : 'Add a new patient to the directory', `
    <form id="patientForm" class="form-grid">
      <div class="form-field"><label class="form-label">First Name</label><input class="form-input" name="firstName" required value="${escape(p.firstName)}"></div>
      <div class="form-field"><label class="form-label">Last Name</label><input class="form-input" name="lastName" required value="${escape(p.lastName)}"></div>
      <div class="form-field"><label class="form-label">Date of Birth</label><input class="form-input" type="date" name="dob" value="${escape(p.dob)}"></div>
      <div class="form-field"><label class="form-label">Sex</label><select class="form-select" name="sex">
        <option value="F" ${p.sex==='F'?'selected':''}>Female</option>
        <option value="M" ${p.sex==='M'?'selected':''}>Male</option>
      </select></div>
      <div class="form-field"><label class="form-label">Phone</label><input class="form-input" name="phone" value="${escape(p.phone)}"></div>
      <div class="form-field"><label class="form-label">Email</label><input class="form-input" type="email" name="email" value="${escape(p.email)}"></div>
      <div class="form-field full"><label class="form-label">Address</label><input class="form-input" name="address" value="${escape(p.address)}"></div>
      <div class="form-field"><label class="form-label">Insurance</label><input class="form-input" name="insurance" value="${escape(p.insurance)}"></div>
      <div class="form-field"><label class="form-label">Allergies</label><input class="form-input" name="allergies" value="${escape(p.allergies)}"></div>
      <div class="form-field full"><label class="form-label">Medical Notes</label><textarea class="form-textarea" name="medicalNotes">${escape(p.medicalNotes)}</textarea></div>
      <div class="form-save-row" style="grid-column:1/-1">
        ${id ? `<button type="button" class="btn btn-danger" id="deletePatient">Delete</button>` : ''}
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button type="submit" class="btn btn-dark">${id?'Save Changes':'Create Patient'}</button>
      </div>
    </form>
  `);
  document.getElementById('patientForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (id) { Object.assign(p, data); persist.update('patients', id, p); toast('Patient updated'); }
    else {
      const np = { id: uid('p'), createdAt: today(), ...data };
      state.patients.push(np); persist.create('patients', np); toast('Patient created');
    }
    closeModal(); render();
  });
  const del = document.getElementById('deletePatient');
  if (del) del.addEventListener('click', () => {
    if (!confirm('Delete this patient and all their appointments?')) return;
    state.patients = state.patients.filter(x => x.id !== id);
    state.appointments = state.appointments.filter(a => a.patientId !== id); // server cascades
    if (viewState.patientDetailId === id) viewState.patientDetailId = null;
    persist.remove('patients', id); closeModal(); render(); toast('Patient deleted', 'danger');
  });
}

function openAppointmentModal(id, presetPatientId) {
  const a = id ? state.appointments.find(x => x.id === id)
              : { patientId: presetPatientId || (state.patients[0]?.id || ''), treatmentId: state.treatments[0]?.id || '', date: today(), time: '09:00', status: 'scheduled', notes: '' };
  openModal(id ? 'Edit Appointment' : 'Book Appointment', id ? 'Update scheduling details' : 'Schedule a new visit', `
    <form id="apptForm" class="form-grid">
      <div class="form-field full"><label class="form-label">Patient</label><select class="form-select" name="patientId" required>
        ${state.patients.map(p => `<option value="${escape(p.id)}" ${p.id===a.patientId?'selected':''}>${escape(p.firstName)} ${escape(p.lastName)}</option>`).join('')}
      </select></div>
      <div class="form-field full"><label class="form-label">Treatment</label><select class="form-select" name="treatmentId" required>
        ${state.treatments.map(t => `<option value="${escape(t.id)}" ${t.id===a.treatmentId?'selected':''}>${escape(t.name)} — ${PHP(t.price)}</option>`).join('')}
      </select></div>
      <div class="form-field"><label class="form-label">Date</label><input class="form-input" type="date" name="date" required value="${escape(a.date)}"></div>
      <div class="form-field"><label class="form-label">Time</label><input class="form-input" type="time" name="time" required value="${escape(a.time)}"></div>
      <div class="form-field full"><label class="form-label">Status</label><select class="form-select" name="status">
        <option value="scheduled" ${a.status==='scheduled'?'selected':''}>Scheduled</option>
        <option value="completed" ${a.status==='completed'?'selected':''}>Completed</option>
        <option value="canceled"  ${a.status==='canceled'?'selected':''}>Canceled</option>
      </select></div>
      <div class="form-field full"><label class="form-label">Notes</label><textarea class="form-textarea" name="notes">${escape(a.notes)}</textarea></div>
      <div class="form-save-row" style="grid-column:1/-1">
        ${id ? `<button type="button" class="btn btn-danger" id="deleteAppt">Delete</button>` : ''}
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button type="submit" class="btn btn-dark">${id?'Save Changes':'Book Appointment'}</button>
      </div>
    </form>
  `);
  document.getElementById('apptForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (id) { Object.assign(a, data); persist.update('appointments', id, a); toast('Appointment updated'); }
    else {
      const na = { id: uid('a'), ...data };
      state.appointments.push(na); persist.create('appointments', na); toast('Appointment booked');
    }
    closeModal(); render();
  });
  const del = document.getElementById('deleteAppt');
  if (del) del.addEventListener('click', () => {
    state.appointments = state.appointments.filter(x => x.id !== id);
    persist.remove('appointments', id); closeModal(); render(); toast('Appointment deleted', 'danger');
  });
}

function completeAppointment(id) {
  const a = state.appointments.find(x => x.id === id);
  if (!a) return;
  a.status = 'completed';
  persist.update('appointments', id, a); render(); toast('Appointment marked complete');
}

function openTreatmentModal(id) {
  const t = id ? findTreatment(id) : { name:'', category:'Preventive', price:0, duration:30 };
  openModal(id ? 'Edit Treatment' : 'New Treatment', '', `
    <form id="trForm" class="form-grid">
      <div class="form-field full"><label class="form-label">Name</label><input class="form-input" name="name" required value="${escape(t.name)}"></div>
      <div class="form-field"><label class="form-label">Category</label><select class="form-select" name="category">
        ${['Preventive','Restorative','Surgical','Endodontic','Orthodontic','Cosmetic','Diagnostic'].map(c =>
          `<option value="${c}" ${c===t.category?'selected':''}>${c}</option>`).join('')}
      </select></div>
      <div class="form-field"><label class="form-label">Duration (min)</label><input class="form-input" type="number" name="duration" min="5" value="${t.duration}"></div>
      <div class="form-field full"><label class="form-label">Price (PHP)</label><input class="form-input" type="number" name="price" min="0" step="50" value="${t.price}"></div>
      <div class="form-save-row" style="grid-column:1/-1">
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button type="submit" class="btn btn-dark">${id?'Save':'Create'}</button>
      </div>
    </form>
  `);
  document.getElementById('trForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.price = +data.price; data.duration = +data.duration;
    if (id) { Object.assign(t, data); persist.update('treatments', id, t); }
    else {
      const nt = { id: uid('t'), ...data };
      state.treatments.push(nt); persist.create('treatments', nt);
    }
    closeModal(); render(); toast(id?'Treatment updated':'Treatment created');
  });
}
function deleteTreatment(id) {
  if (!confirm('Delete this treatment?')) return;
  state.treatments = state.treatments.filter(t => t.id !== id);
  persist.remove('treatments', id); render(); toast('Treatment deleted', 'danger');
}

function openInventoryModal(id) {
  const i = id ? findItem(id) : { name:'', category:'Consumable', sku:'', unit:'box', qty:0, threshold: state.clinic.lowStockThresholdDefault, price:0, supplier:'', lastRestock: today() };
  openModal(id ? 'Edit Inventory Item' : 'New Inventory Item', '', `
    <form id="invForm" class="form-grid">
      <div class="form-field full"><label class="form-label">Name</label><input class="form-input" name="name" required value="${escape(i.name)}"></div>
      <div class="form-field"><label class="form-label">Category</label><select class="form-select" name="category">
        ${['Consumable','PPE','Anesthetic','Restorative','Endodontic','Cosmetic','Lab','Diagnostic'].map(c =>
          `<option value="${c}" ${c===i.category?'selected':''}>${c}</option>`).join('')}
      </select></div>
      <div class="form-field"><label class="form-label">SKU</label><input class="form-input" name="sku" value="${escape(i.sku)}"></div>
      <div class="form-field"><label class="form-label">Unit</label><input class="form-input" name="unit" value="${escape(i.unit)}"></div>
      <div class="form-field"><label class="form-label">Supplier</label><input class="form-input" name="supplier" value="${escape(i.supplier)}"></div>
      <div class="form-field"><label class="form-label">Quantity</label><input class="form-input" type="number" name="qty" min="0" value="${i.qty}"></div>
      <div class="form-field"><label class="form-label">Reorder Threshold</label><input class="form-input" type="number" name="threshold" min="0" value="${i.threshold}"></div>
      <div class="form-field full"><label class="form-label">Unit Price (PHP)</label><input class="form-input" type="number" name="price" min="0" step="0.01" value="${i.price}"></div>
      <div class="form-save-row" style="grid-column:1/-1">
        ${id ? `<button type="button" class="btn btn-danger" id="deleteItem">Delete</button>` : ''}
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button type="submit" class="btn btn-dark">${id?'Save':'Create'}</button>
      </div>
    </form>
  `);
  document.getElementById('invForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.qty = +data.qty; data.threshold = +data.threshold; data.price = +data.price;
    if (id) { Object.assign(i, data); persist.update('inventory', id, i); }
    else {
      const ni = { id: uid('i'), lastRestock: today(), ...data };
      state.inventory.push(ni); persist.create('inventory', ni);
    }
    closeModal(); render();
    toast(id?'Item updated':'Item added');
    const low = lowStockItems();
    if (low.length > 0) toast(`${low.length} item${low.length>1?'s':''} below reorder threshold`, 'warn');
  });
  const del = document.getElementById('deleteItem');
  if (del) del.addEventListener('click', () => {
    state.inventory = state.inventory.filter(x => x.id !== id);
    persist.remove('inventory', id); closeModal(); render(); toast('Item deleted', 'danger');
  });
}

function openRestockModal(id) {
  const i = findItem(id);
  if (!i) return;
  openModal(`Restock — ${i.name}`, `Current stock: ${i.qty} ${i.unit}${i.qty===1?'':'s'} · Threshold: ${i.threshold}`, `
    <form id="restockForm" class="form-grid">
      <div class="form-field"><label class="form-label">Add Quantity</label><input class="form-input" type="number" name="qty" min="1" value="${Math.max(i.threshold*2 - i.qty, 10)}" required></div>
      <div class="form-field"><label class="form-label">Unit Cost (PHP)</label><input class="form-input" type="number" name="cost" min="0" step="0.01" value="${i.price}"></div>
      <div class="form-field full"><label class="form-label">Restock Date</label><input class="form-input" type="date" name="date" value="${today()}" required></div>
      <div class="form-save-row" style="grid-column:1/-1">
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button type="submit" class="btn btn-dark">Add Stock</button>
      </div>
    </form>
  `);
  document.getElementById('restockForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const addQty = +data.qty;
    i.qty += addQty;
    i.lastRestock = data.date;
    state.restockLog.push({ id: uid('r'), itemId: i.id, qty: addQty, date: data.date, cost: addQty * (+data.cost) });
    persist.restock({ itemId: i.id, qty: addQty, cost: +data.cost, date: data.date });
    closeModal(); render();
    toast(`Restocked ${addQty} ${i.unit}${addQty===1?'':'s'} of ${i.name}`);
  });
}

function exportInventoryCSV() {
  const headers = ['name','category','sku','unit','qty','threshold','price','supplier','lastRestock'];
  const csv = [headers.join(',')].concat(
    state.inventory.map(i => headers.map(h => JSON.stringify(i[h] ?? '')).join(','))
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'inventory.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('Inventory exported');
}

/* ====== ACCOUNTS (admin-only, real mode only) ====== */
function renderAccounts() {
  const users = viewState.users || [];
  const meId = session?.user?.id;
  return `
    <section class="hero" style="padding:var(--space-7)">
      <div class="eyebrow-chip"><span>Admin</span></div>
      <h1>Team accounts</h1>
      <div class="lede">Invite staff so they can log in to this clinic. Staff see patients, appointments, treatments, and inventory — Reports are admin-only.</div>
    </section>

    <div class="card" style="padding:var(--space-7); margin-top:var(--space-6)">
      <div style="font-weight:700; font-size:16px; margin-bottom:var(--space-4)">Invite a staff member</div>
      <form id="inviteForm" class="form-grid">
        <div class="form-field"><label class="form-label">Name</label><input class="form-input" name="name" placeholder="Jane Hygienist"></div>
        <div class="form-field"><label class="form-label">Email</label><input class="form-input" type="email" name="email" required autocomplete="off"></div>
        <div class="form-field full"><label class="form-label">Temporary password (8+ chars)</label><input class="form-input" type="password" name="password" required minlength="8" autocomplete="new-password"></div>
        <div class="form-save-row" style="grid-column:1/-1">
          <button type="submit" class="btn btn-dark">Create staff account</button>
        </div>
      </form>
    </div>

    <div class="card" style="padding:var(--space-6); margin-top:var(--space-6)">
      <div style="font-weight:700; font-size:16px; margin-bottom:var(--space-4)">Active accounts (${users.length})</div>
      ${users.length === 0
        ? `<div class="empty">No accounts yet. Invite your first staff member above.</div>`
        : `<div class="trade-list">${users.map(u => `
            <div class="trade-row">
              <div class="trade-icon ${u.role==='admin'?'pos':''}">${escape((u.name || u.email).slice(0,1).toUpperCase())}</div>
              <div class="flex-1">
                <div class="trade-name">${escape(u.name || '—')} ${u.id===meId ? '<span class="badge-mini">you</span>' : ''}</div>
                <div class="trade-meta">${escape(u.email)} · <b>${escape(u.role)}</b></div>
              </div>
              ${u.role === 'admin' || u.id === meId
                ? `<span class="trade-meta">${u.role === 'admin' ? 'admin' : ''}</span>`
                : `<button class="btn btn-danger btn-sm" data-delete-user="${escape(u.id)}" data-delete-user-email="${escape(u.email)}">Remove</button>`}
            </div>`).join('')}</div>`}
    </div>
  `;
}

async function onInviteSubmit(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const created = await api('POST', '/users', data);
    viewState.users = [...(viewState.users || []), created];
    toast(`Invited ${created.email}`);
    render();
  } catch (err) {
    toast(err?.message || 'Could not create account', 'danger');
    btn.disabled = false;
  }
}

async function onDeleteUser(id, email) {
  if (!confirm(`Remove ${email}? They will be logged out immediately.`)) return;
  try {
    await api('DELETE', '/users/' + id);
    viewState.users = (viewState.users || []).filter(u => u.id !== id);
    toast(`Removed ${email}`, 'danger');
    render();
  } catch (err) {
    toast(err?.message || 'Could not remove account', 'danger');
  }
}

/* =========================================================
   AUTH (real mode only)
   ========================================================= */
function showAuth(mode = 'login') {
  document.querySelector('.shell').style.display = 'none';
  const root = document.getElementById('authRoot');
  root.hidden = false;
  renderAuth(mode);
}
function hideAuth() {
  document.getElementById('authRoot').hidden = true;
  document.querySelector('.shell').style.display = '';
}

function renderAuth(mode) {
  // mode: 'login' (default) or 'setup' (one-time admin account creation).
  // There's no public registration — staff are created by the admin.
  const isSetup = mode === 'setup';
  const root = document.getElementById('authRoot');
  root.innerHTML = `
    <div class="auth-card">
      <div class="auth-brand"><div class="auth-mark">BD</div><div class="auth-title">B-Dental</div></div>
      <div class="auth-head">${isSetup ? 'Set up your clinic' : 'Welcome back'}</div>
      <div class="auth-sub">${isSetup
        ? 'First-time setup — this becomes the admin account. After this you sign in here.'
        : 'Sign in to your clinic account.'}</div>
      <form id="authForm" class="auth-form">
        ${isSetup ? `
          <label class="auth-label">Clinic name<input class="auth-input" name="clinicName" placeholder="B-Dental Clinic"></label>
          <label class="auth-label">Your name<input class="auth-input" name="name" placeholder="Dr. Reyes"></label>` : ''}
        <label class="auth-label">Email<input class="auth-input" type="email" name="email" required autocomplete="email"></label>
        <label class="auth-label">Password<input class="auth-input" type="password" name="password" required minlength="8" autocomplete="${isSetup ? 'new-password' : 'current-password'}"></label>
        <div class="auth-error" id="authError" hidden></div>
        <button type="submit" class="btn btn-dark auth-submit">${isSetup ? 'Create admin account' : 'Sign in'}</button>
      </form>
      ${isSetup ? `<div class="auth-switch">After setup, new staff accounts can only be created from inside the app by the admin.</div>` : ''}
    </div>`;

  root.querySelector('#authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('authError');
    errEl.hidden = true;
    const btn = e.target.querySelector('.auth-submit');
    btn.disabled = true;
    const body = Object.fromEntries(new FormData(e.target));
    try {
      const resp = await api('POST', isSetup ? '/auth/register' : '/auth/login', body);
      await afterLogin(resp.user, resp.clinic);
    } catch (err) {
      errEl.textContent = err?.message === 'unauthorized' ? 'Invalid email or password.' : (err?.message || 'Something went wrong.');
      errEl.hidden = false;
      btn.disabled = false;
    }
  });
}

async function afterLogin(user, clinic) {
  session = { user, clinic };
  hideAuth();
  try {
    state = await api('GET', '/bootstrap');
  } catch (err) {
    persistError(err);
    return;
  }
  decorateForSession();
  applyRolePermissions();
  setView('dashboard');
}

function decorateForSession() {
  if (!session) return;
  const clinicName = state.clinic?.name || session.clinic?.name || 'B-Dental';
  const userName = session.user?.name || session.user?.email || 'Account';
  document.querySelector('.brand-name').textContent = clinicName;
  document.querySelector('.brand-tier').textContent = `${userName} · ${session.user?.role || ''}`;
  const avatar = document.querySelector('.topbar .avatar');
  avatar.textContent = (userName.match(/\b\w/g) || ['B', 'D']).slice(0, 2).join('').toUpperCase();
  avatar.title = 'Log out';
  avatar.style.cursor = 'pointer';
  avatar.onclick = async () => {
    if (!confirm('Log out of B-Dental?')) return;
    try { await api('POST', '/auth/logout'); } catch {}
    session = null;
    state = emptyState();
    showAuth('login');
  };
}

// Show/hide nav items based on role. Reports and Accounts are admin-only;
// Accounts is also hidden in demo mode (there are no real users to manage).
function applyRolePermissions() {
  const isAdmin = DEMO ? true : (session?.user?.role === 'admin');
  const reports  = document.querySelector('.nav-item[data-view="reports"]');
  const accounts = document.querySelector('.nav-item[data-view="accounts"]');
  if (reports)  reports.style.display  = isAdmin ? '' : 'none';
  if (accounts) accounts.style.display = (isAdmin && !DEMO) ? '' : 'none';
}

/* ---------- DEMO BANNER ---------- */
function setupDemoBanner() {
  const bar = document.createElement('div');
  bar.className = 'demo-banner';
  bar.innerHTML = `<span>Demo mode — data is saved only in this browser.</span><button id="demoReset">Reset demo data</button>`;
  document.body.appendChild(bar);
  document.getElementById('demoReset').addEventListener('click', () => {
    if (!confirm('Reset all demo data back to the sample set?')) return;
    try { localStorage.removeItem(STORE_KEY); } catch {}
    location.reload();
  });
}

/* ---------- INIT ---------- */
(async function init() {
  if (DEMO) {
    setupDemoBanner();
    applyRolePermissions();
    render();
    return;
  }
  // Real mode: hide the app until we know the session, to avoid a flash.
  document.querySelector('.shell').style.display = 'none';
  try {
    const { user, clinic, firstSetup } = await api('GET', '/auth/me');
    if (user && clinic) await afterLogin(user, clinic);
    else showAuth(firstSetup ? 'setup' : 'login');
  } catch {
    showAuth('login');
  }
})();
