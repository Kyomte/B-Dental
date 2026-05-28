import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  // Surfaced at call time rather than import time so demo deploys (no DB) don't crash on cold start.
  console.warn('[db] DATABASE_URL is not set');
}

export const sql = neon(url);

// Parameterized query helper. The neon HTTP driver's returned function is
// callable directly as sql(text, params) for $1/$2-style queries; it returns
// an array of row objects.
export function query(text, params = []) {
  return sql(text, params);
}
