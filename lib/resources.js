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
    // Validated on create/update: time/status/date are rendered into the client
    // largely unescaped, so free text here would be a stored-XSS sink.
    validate: {
      time: (v) => typeof v === 'string' && /^\d{2}:\d{2}$/.test(v),
      status: (v) => ['scheduled', 'completed', 'canceled'].includes(v),
      date: (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v),
    },
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

// Runs a resource's per-field validators against a request body.
// Returns the name of the first invalid field, or null if all pass.
// Absent fields (undefined/null) are skipped so partial updates still work.
export function firstInvalidField(body, def) {
  if (!def.validate) return null;
  for (const [k, ok] of Object.entries(def.validate)) {
    const v = body[k];
    if (v !== undefined && v !== null && !ok(v)) return k;
  }
  return null;
}

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
