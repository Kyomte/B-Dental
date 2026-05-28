// Starter catalog for a brand-new clinic account: a standard treatment list and
// a baseline inventory. No patients/appointments — a real clinic starts those empty.

export const SEED_TREATMENTS = [
  { name: 'Dental Cleaning (Prophylaxis)', category: 'Preventive',  price: 1500,  duration: 45 },
  { name: 'Tooth Extraction',              category: 'Surgical',    price: 2500,  duration: 60 },
  { name: 'Composite Filling',             category: 'Restorative', price: 2200,  duration: 60 },
  { name: 'Root Canal Therapy',            category: 'Endodontic',  price: 12000, duration: 90 },
  { name: 'Teeth Whitening',               category: 'Cosmetic',    price: 8500,  duration: 75 },
  { name: 'Dental Crown (Porcelain)',      category: 'Restorative', price: 18000, duration: 120 },
  { name: 'Orthodontic Adjustment',        category: 'Orthodontic', price: 1800,  duration: 30 },
  { name: 'X-Ray (Panoramic)',             category: 'Diagnostic',  price: 1200,  duration: 15 },
];

export const SEED_INVENTORY = [
  { name: 'Composite Resin (A2 shade)',  category: 'Restorative', sku: 'CR-A2-4G',   unit: 'syringe',   qty: 22, threshold: 10, price: 480,  supplier: '3M ESPE' },
  { name: 'Lidocaine 2% w/ Epinephrine', category: 'Anesthetic',  sku: 'LIDO-2-50',  unit: 'cartridge', qty: 30, threshold: 25, price: 65,   supplier: 'Septodont' },
  { name: 'Latex Gloves (M)',            category: 'PPE',         sku: 'GLV-M-100',  unit: 'box',       qty: 14, threshold: 6,  price: 350,  supplier: 'Ansell' },
  { name: 'Surgical Mask (Lvl 3)',       category: 'PPE',         sku: 'MSK-L3-50',  unit: 'box',       qty: 12, threshold: 8,  price: 220,  supplier: 'Halyard' },
  { name: 'Dental Floss',                category: 'Consumable',  sku: 'FLOSS-50',   unit: 'pack',      qty: 31, threshold: 10, price: 90,   supplier: 'Oral-B' },
  { name: 'Sodium Hypochlorite 5%',      category: 'Endodontic',  sku: 'NaOCl-500',  unit: 'bottle',    qty: 8,  threshold: 6,  price: 280,  supplier: 'Vista' },
  { name: 'Disposable Suction Tips',     category: 'Consumable',  sku: 'SCT-100',    unit: 'box',       qty: 19, threshold: 6,  price: 180,  supplier: 'Dentsply' },
  { name: 'Articulating Paper (Blue)',   category: 'Consumable',  sku: 'ART-PP-BLU', unit: 'pack',      qty: 6,  threshold: 4,  price: 240,  supplier: 'Bausch' },
];
