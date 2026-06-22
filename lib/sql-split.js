// Splits a .sql file into individual statements for the neon HTTP driver,
// which executes one statement per call. Line comments are stripped BEFORE
// splitting on ';' because a comment can itself contain a semicolon
// (e.g. "-- foo; bar"), which would otherwise cut a real statement in half.
export function splitStatements(sqlText) {
  return sqlText
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}
