// Power set builder (Class 11 maths, sets): every subset of a small set, grouped by size, with the counts
// C(n, k) and 2ⁿ, and each subset's on/off code (one switch per element). Plain TypeScript, no DOM.
export const nCr = (n: number, k: number) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };

/** Read a list of elements: "a, b, c" or "{1, 2, 3}" or "a b c". Repeats are dropped (a set has no repeats). */
export function readElements(src: string): { items: string[]; dropped: string[] } {
  const raw = src.replace(/^\s*\{|\}\s*$/g, '').split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
  const items: string[] = [], dropped: string[] = [];
  for (const r of raw) (items.includes(r) ? dropped : items).push(r);
  return { items, dropped };
}

/** All subsets as bit masks, by size, then in the order the elements were typed. */
export function subsets(n: number): number[] {
  const all = Array.from({ length: 1 << n }, (_, m) => m);
  const pc = (m: number) => { let c = 0; while (m) { c += m & 1; m >>= 1; } return c; };
  const key = (m: number) => Array.from({ length: n }, (_, i) => ((m >> i) & 1 ? '0' : '1')).join('');   // earlier elements first
  return all.sort((a, b) => pc(a) - pc(b) || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
}
export const size = (m: number) => { let c = 0; while (m) { c += m & 1; m >>= 1; } return c; };
export const members = (m: number, items: string[]) => items.filter((_, i) => (m >> i) & 1);
export const show = (m: number, items: string[]) => (m === 0 ? '∅' : `{${members(m, items).join(', ')}}`);
/** The on/off code: 1 where the element is in the subset, read in the order the elements were typed. */
export const code = (m: number, n: number) => Array.from({ length: n }, (_, i) => ((m >> i) & 1 ? '1' : '0')).join('');
