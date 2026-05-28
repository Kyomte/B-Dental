export function uid(prefix = 'x') {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}
