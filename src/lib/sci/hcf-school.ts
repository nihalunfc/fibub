// School maths: prime factor trees, HCF and LCM from shared prime factors (a Venn picture), and Euclid's division
// algorithm (Class 10 real numbers; Class 6 and 8 factors and multiples). No DOM.
import { primeFactors, gcd } from './smath.ts';

export type TreeNode = { n: number; left?: TreeNode; right?: TreeNode };

/** A factor tree: each composite splits into its smallest prime and the rest. */
export function factorTree(n: number): TreeNode {
  n = Math.round(Math.abs(n));
  const f = primeFactors(n);
  if (n < 4 || f.length <= 1) return { n };
  const p = f[0];
  return { n, left: { n: p }, right: factorTree(n / p) };
}

/** Prime factors with powers: 360 -> [[2, 3], [3, 2], [5, 1]]. */
export function powers(n: number): [number, number][] {
  const m = new Map<number, number>();
  for (const p of primeFactors(n)) m.set(p, (m.get(p) ?? 0) + 1);
  return [...m];
}

/** "2³ × 3² × 5" */
const SUP: Record<string, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const powerText = (n: number) => (n === 1 ? '1' : powers(n).map(([p, k]) => (k === 1 ? String(p) : p + String(k).split('').map((c) => SUP[c]).join(''))).join(' × '));

/** Split the prime factors of a and b into the shared ones (the middle of the Venn) and the rest. */
export function venn(a: number, b: number) {
  const fa = primeFactors(a), fb = [...primeFactors(b)];
  const both: number[] = [], onlyA: number[] = [];
  for (const p of fa) { const i = fb.indexOf(p); if (i >= 0) { both.push(p); fb.splice(i, 1); } else onlyA.push(p); }
  const prod = (x: number[]) => x.reduce((s, p) => s * p, 1);
  return { both, onlyA, onlyB: fb, hcf: prod(both), lcm: prod(both) * prod(onlyA) * prod(fb) };
}

/** Euclid's division algorithm: rows of a = b × q + r until r = 0. The last divisor is the HCF. */
export function euclid(a: number, b: number): { a: number; b: number; q: number; r: number }[] {
  let x = Math.max(a, b), y = Math.min(a, b);
  const rows: { a: number; b: number; q: number; r: number }[] = [];
  if (y === 0) return rows;
  for (;;) { const q = Math.floor(x / y), r = x - q * y; rows.push({ a: x, b: y, q, r }); if (r === 0) break; x = y; y = r; }
  return rows;
}

export { gcd };
