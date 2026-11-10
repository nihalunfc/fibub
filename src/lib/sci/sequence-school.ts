// School maths: growing patterns and sequences (Class 9 "what comes next", Class 10 APs, Class 11 GPs).
// Pattern families with their nth term, differences, and a rule finder for a typed list: linear (an + b),
// quadratic (an² + bn + c, exact fractions) or geometric (a·rⁿ⁻¹). No DOM.
import { gcd } from './smath.ts';

export type Pattern = { id: string; name: string; rule: string; nth: (n: number) => number };

export const PATTERNS: Pattern[] = [
  { id: 'sticks', name: 'Matchstick squares in a row', rule: '3n + 1', nth: (n) => 3 * n + 1 },
  { id: 'odd', name: 'Odd numbers (L shapes)', rule: '2n − 1', nth: (n) => 2 * n - 1 },
  { id: 'square', name: 'Square numbers', rule: 'n²', nth: (n) => n * n },
  { id: 'triangle', name: 'Triangular numbers', rule: 'n(n + 1)/2', nth: (n) => (n * (n + 1)) / 2 },
  { id: 'pentagon', name: 'Pentagonal numbers', rule: 'n(3n − 1)/2', nth: (n) => (n * (3 * n - 1)) / 2 },
  { id: 'hexagon', name: 'Hexagonal numbers', rule: 'n(2n − 1)', nth: (n) => n * (2 * n - 1) },
  { id: 'rectangle', name: 'Rectangle numbers n × (n + 1)', rule: 'n(n + 1)', nth: (n) => n * (n + 1) },
  { id: 'double', name: 'Doubling (cells splitting)', rule: '2ⁿ⁻¹', nth: (n) => 2 ** (n - 1) },
];

export const terms = (f: (n: number) => number, count: number) => Array.from({ length: count }, (_, i) => f(i + 1));

/** Differences between neighbours: [1, 4, 9] → [3, 5]. */
export const diffs = (xs: number[]) => xs.slice(1).map((x, i) => x - xs[i]);

/** A fraction kept exact: p/q with q > 0 in lowest terms. */
export type Frac = { p: number; q: number };
const fr = (p: number, q = 1): Frac => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return { p: p / g, q: q / g }; };
const add = (a: Frac, b: Frac) => fr(a.p * b.q + b.p * a.q, a.q * b.q);
const sub = (a: Frac, b: Frac) => fr(a.p * b.q - b.p * a.q, a.q * b.q);
const mulI = (a: Frac, k: number) => fr(a.p * k, a.q);
const divI = (a: Frac, k: number) => fr(a.p, a.q * k);
export const fval = (f: Frac) => f.p / f.q;
export const ftext = (f: Frac) => (f.q === 1 ? String(f.p) : `${f.p}/${f.q}`).replace('-', '−');

export type Rule =
  | { kind: 'constant'; a: Frac; next: number; text: string }
  | { kind: 'linear'; a: Frac; b: Frac; next: number; text: string }
  | { kind: 'quadratic'; a: Frac; b: Frac; c: Frac; next: number; text: string }
  | { kind: 'geometric'; first: number; ratio: Frac; next: number; text: string }
  | { kind: 'none'; text: string };

const isInt = (x: number) => Number.isInteger(x);
/** Turn a decimal like 2.5 into an exact fraction (up to 6 decimals). */
function toFrac(x: number): Frac { let q = 1; while (!isInt(Math.round(x * q * 1e9) / 1e9) && q < 1e6) q *= 10; return fr(Math.round(x * q), q); }

function poly(coef: [Frac, string][]): string {
  let s = '';
  for (const [c, v] of coef) {
    if (c.p === 0) continue;
    const neg = c.p < 0, abs = fr(Math.abs(c.p), c.q), num = abs.p === 1 && abs.q === 1 && v ? '' : abs.q !== 1 && v ? `(${ftext(abs)})` : ftext(abs);
    s += s ? (neg ? ' − ' : ' + ') : neg ? '−' : '';
    s += num + v;
  }
  return s || '0';
}

/** Find the simplest rule that fits every typed term (n starts at 1). Needs at least 3 terms (4 for quadratic). */
export function findRule(xs: number[]): Rule {
  if (xs.length < 3 || xs.some((x) => !Number.isFinite(x))) return { kind: 'none', text: 'Type at least three numbers.' };
  const F = xs.map(toFrac), n = xs.length;
  const d1 = F.slice(1).map((x, i) => sub(x, F[i]));
  const same = (a: Frac[]) => a.every((x) => x.p === a[0].p && x.q === a[0].q);
  if (same(d1)) {
    const d = d1[0], b = sub(F[0], d); // aₙ = dn + (a₁ − d)
    if (d.p === 0) return { kind: 'constant', a: F[0], next: fval(F[0]), text: `Every term is ${ftext(F[0])}.` };
    return { kind: 'linear', a: d, b, next: fval(add(mulI(d, n + 1), b)), text: `nth term = ${poly([[d, 'n'], [b, '']])}` };
  }
  if (n >= 4) {
    const d2 = d1.slice(1).map((x, i) => sub(x, d1[i]));
    if (same(d2)) {
      const a = divI(d2[0], 2), b = sub(d1[0], mulI(a, 3)), c = sub(sub(F[0], a), b);
      const at = (k: number) => add(add(mulI(a, k * k), mulI(b, k)), c);
      return { kind: 'quadratic', a, b, c, next: fval(at(n + 1)), text: `nth term = ${poly([[a, 'n²'], [b, 'n'], [c, '']])}` };
    }
  }
  if (F.every((x) => x.p !== 0)) {
    const r = fr(F[1].p * F[0].q, F[1].q * F[0].p);
    let ok = true, cur = F[0];
    for (let i = 1; i < n; i++) { cur = fr(cur.p * r.p, cur.q * r.q); if (cur.p !== F[i].p || cur.q !== F[i].q) { ok = false; break; } }
    if (ok && !(r.p === 1 && r.q === 1)) return { kind: 'geometric', first: fval(F[0]), ratio: r, next: fval(F[n - 1]) * fval(r), text: `nth term = ${ftext(F[0])} × (${ftext(r)})ⁿ⁻¹` };
  }
  return { kind: 'none', text: n >= 4 ? 'No linear, quadratic or doubling-type rule fits all of these. Check the numbers, or add more terms.' : 'Not linear. Add a fourth term to test for a quadratic rule.' };
}

/** Dot positions (unit grid) for drawing step n of a pattern; rows of dots, or squares for sticks. */
export function dots(id: string, n: number): [number, number][] {
  const out: [number, number][] = [];
  if (id === 'square') for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out.push([j, i]);
  else if (id === 'triangle') for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) out.push([j - i / 2, i]);
  else if (id === 'rectangle') for (let i = 0; i < n; i++) for (let j = 0; j <= n; j++) out.push([j, i]);
  else if (id === 'pentagon') {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out.push([j, i + n - 1]);
    for (let r = 1; r < n; r++) for (let j = 0; j < n - r; j++) out.push([j + r / 2, n - 1 - r]);
  }
  else if (id === 'hexagon') for (let i = 0; i < n; i++) for (let j = 0; j < 2 * n - 1; j++) out.push([j, i]);
  else if (id === 'double') { const k = 2 ** (n - 1); for (let i = 0; i < k; i++) out.push([i % 16, Math.floor(i / 16)]); }
  else if (id === 'odd') { for (let j = 0; j < n; j++) out.push([j, n - 1]); for (let i = 0; i < n - 1; i++) out.push([n - 1, i]); }
  return out;
}
