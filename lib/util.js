export function uid(prefix = 'x') {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

// Pragmatic email check: one @, non-empty local part, a dotted domain, no
// whitespace. Deliberately not RFC-5322-exhaustive — it rejects the obvious
// junk (missing @, no domain, spaces) without bouncing legitimate addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

// Optional free-text field: blank/absent is allowed, but if present it must
// stay within a sane length so a single field can't be used to bloat a row
// or smuggle a huge payload. Returns true when acceptable.
export function isValidOptionalText(value, max = 200) {
  if (value === undefined || value === null || value === '') return true;
  return typeof value === 'string' && value.length <= max;
}

// Phone numbers vary wildly by locale, so we only constrain the character set
// (digits, spaces, and the usual punctuation) and the length. Blank is allowed.
const PHONE_RE = /^[0-9+()\-.\s]{4,32}$/;

export function isValidPhone(value) {
  if (value === undefined || value === null || value === '') return true;
  return typeof value === 'string' && PHONE_RE.test(value);
}

// Required short name field (first/last name). Must be a non-empty string
// after trimming and within a reasonable length.
export function isValidName(value, max = 80) {
  return typeof value === 'string' && value.trim().length >= 1 && value.length <= max;
}

// ISO date (YYYY-MM-DD) — used by date-typed fields. Blank is allowed.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDate(value) {
  if (value === undefined || value === null || value === '') return true;
  return typeof value === 'string' && DATE_RE.test(value);
}
