// Whitelisted resources for the generic REST handler.
// `cols` maps the frontend (camelCase) field -> database (snake_case) column.
// Column names here are the ONLY identifiers ever interpolated into SQL, so the
// whitelist is what keeps the dynamic queries injection-safe.

export const RESOURCES = {
  patients: {
    table: 'patients',
    order: 'created_at desc nulls last, last_name asc',
    cols: {
      firstName: 'first_name',
      lastName: 'last_name',
      dob: 'dob',
      phone: 'phone',
      email: 'email',
      sex: 'sex',
      address: 'address',
      allergies: 'allergies',
      medicalNotes: 'medical_notes',
      insurance: 'insurance',
      createdAt: 'created_at',
    },
    nums: [],
  },
  treatments: {
    table: 'treatments',
    order: 'name asc',
    cols: {
      name: 'name',
      category: 'category',
      price: 'price',
      duration: 'duration',
    },
    nums: ['price', 'duration'],
  },
  appointments: {
    table: 'appointments',
    order: 'date asc, time asc',
    cols: {
      patientId: 'patient_id',
      treatmentId: 'treatment_id',
      date: 'date',
      time: 'time',
      status: 'status',
      notes: 'notes',
    },
    nums: [],
  },
  inventory: {
    table: 'inventory',
    order: 'name asc',
    cols: {
      name: 'name',
      category: 'category',
      sku: 'sku',
      unit: 'unit',
      qty: 'qty',
      threshold: 'threshold',
      price: 'price',
      supplier: 'supplier',
      lastRestock: 'last_restock',
    },
    nums: ['qty', 'threshold', 'price'],
  },
};

// snake_case DB row -> camelCase frontend object (with numeric coercion).
export function rowToObj(row, def) {
  if (!row) return null;
  const obj = { id: row.id };
  for (const [js, col] of Object.entries(def.cols)) {
    let v = row[col];
    if (v !== null && v !== undefined && def.nums.includes(js)) v = Number(v);
    obj[js] = v;
  }
  return obj;
}
