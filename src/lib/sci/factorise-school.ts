// School maths: factorising with identities, step by step (Class 9 algebraic identities, Class 10 quadratics).
// Whole-number coefficients only, as in school. Each method returns its factors and the steps in words; the
// answer is always checked by expanding it again. No DOM.
import { gcd } from './smath.ts';

const g3 = (...xs: number[]) => xs.reduce((g, x) => gcd(g, x), 0);
const sup = (n: number) => String(n).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);
const neg = (s: string) => s.replace(/-/g, '−');

/** Text of k·xⁿ, with k = 1 hidden: term(3, 2) = "3x²", term(-1, 1) = "−x", term(5, 0) = "5". */
export function term(k: number, n: number, v = 'x'): string {
  if (n === 0) return neg(String(k));
  const c = k === 1 ? '' : k === -1 ? '−' : neg(String(k));
  return c + v + (n === 1 ? '' : sup(n));
}
/** Polynomial text from coefficients, highest power first: [1, -5, 6] → "x² − 5x + 6". */
export function polyText(cs: number[], v = 'x'): string {
  const n = cs.length - 1;
  let s = '';
  cs.forEach((k, i) => {
    if (k === 0) return;
    const p = n - i, t = term(Math.abs(k), p, v);
    s += s ? (k < 0 ? ' − ' : ' + ') + t : (k < 0 ? '−' : '') + t;
  });
  return s || '0';
}
/** (px + q) as text. */
export const lin = (p: number, q: number, v = 'x') => `(${polyText([p, q], v)})`;

/** Multiply polynomials given as coefficient lists (highest power first). */
/** g × the factors as text: a factor (1, 0) shows as x; two equal factors show as a square. */
export function factorsText(g: number, f: [number, number][]): string {
  const G = g === 1 ? '' : g === -1 ? '−' : neg(String(g));
  if (f.length === 2 && f[0][0] === f[1][0] && f[0][1] === f[1][1]) return `${G}${lin(...f[0])}²`;
  const sorted = [...f].sort((p, q) => Number(q[1] === 0) - Number(p[1] === 0));
  return G + sorted.map(([p, q]) => (q === 0 ? term(p, 1) : lin(p, q))).join('');
}

export function mul(a: number[], b: number[]): number[] {
  const out = Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; }));
  return out;
}

/** Two whole numbers with product `prod` and sum `sum`, or null. */
export function splitPair(prod: number, sum: number): [number, number] | null {
  const m = Math.abs(prod);
  if (prod === 0) return [0, sum];
  for (let d = 1; d <= m; d++) {
    if (m % d) continue;
    for (const [u, v] of [[d, prod / d], [-d, -prod / d]] as [number, number][]) if (u + v === sum) return u <= v ? [u, v] : [v, u];
  }
  return null;
}

export type Fact = { ok: boolean; g: number; factors: [number, number][]; text: string; steps: string[]; expanded: number[] };

/** Factorise ax² + bx + c over the whole numbers by splitting the middle term. */
export function quadratic(a: number, b: number, c: number): Fact {
  const steps: string[] = [], orig = polyText([a, b, c]);
  if (a === 0) return { ok: false, g: 1, factors: [], text: orig, steps: ['a must not be 0 for a quadratic.'], expanded: [b, c] };
  let g = g3(a, b, c); if (a < 0) g = -g;
  let A = a / g, B = b / g, C = c / g;
  if (g !== 1) steps.push(`Take out the common factor ${neg(String(g))}: ${orig} = ${neg(String(g))}(${polyText([A, B, C])}).`);
  if (C === 0) {
    const f: [number, number][] = [[1, 0], [A, B]], text = factorsText(g, f);
    steps.push(`There is no number term, so x is a common factor: ${polyText([A, B, 0])} = x(${polyText([A, B])}).`);
    steps.push(`Check by expanding: ${text} = ${polyText([a, b, c])}.`);
    return { ok: true, g, factors: f, text, steps, expanded: [a, b, c] };
  }
  const ps = perfectSquare(A, B, C);
  if (ps) steps.push(`The first and last terms are squares, ${term(A, 2)} = (${term(ps.a, 1)})² and ${C} = ${ps.b}², and the middle term is ${ps.sign > 0 ? '+' : '−'}2 × ${term(ps.a, 1)} × ${ps.b}, so this is the identity (a ${ps.sign > 0 ? '+' : '−'} b)² = a² ${ps.sign > 0 ? '+' : '−'} 2ab + b². Splitting the middle term gives the same answer:`);
  const ac = A * C, pr = splitPair(ac, B);
  steps.push(`Look for two numbers that multiply to a × c = ${neg(String(A))} × ${C < 0 ? `(${neg(String(C))})` : C} = ${neg(String(ac))} and add to b = ${neg(String(B))}.`);
  if (!pr) {
    steps.push(`No two whole numbers do that, so ${polyText([A, B, C])} does not factorise over the whole numbers (its discriminant b² − 4ac = ${neg(String(B * B - 4 * A * C))} is not a perfect square).`);
    return { ok: false, g, factors: [], text: orig, steps, expanded: [a, b, c] };
  }
  const [u, v] = pr;
  const four = [term(A, 2), term(u, 1), term(v, 1), term(C, 0)].map((t, i) => (i === 0 ? t : t.startsWith('−') ? `− ${t.slice(1)}` : `+ ${t}`)).join(' ');
  steps.push(`They are ${neg(String(u))} and ${neg(String(v))}. Split the middle term: ${polyText([A, B, C])} = ${four}.`);
  // A x² + u x = g1·x(p1 x + q1); then v x + C = (v / p1)(p1 x + q1), because u·v = A·C.
  const g1 = gcd(A, u) * (A < 0 ? -1 : 1), p1 = A / g1, q1 = u / g1, k2 = v / p1;
  const f1: [number, number] = [p1, q1], f2: [number, number] = [g1, k2];
  steps.push(`Group in pairs and take out what each pair shares: ${term(g1, 1)}${lin(p1, q1)} ${k2 < 0 ? '−' : '+'} ${Math.abs(k2)}${lin(p1, q1)} = ${lin(f1[0], f1[1])}${lin(f2[0], f2[1])}.`);
  const factors: [number, number][] = [f1, f2];
  const exp = mul([f1[0], f1[1]], [f2[0], f2[1]]).map((k) => k * g);
  const text = factorsText(g, factors);
  steps.push(`Check by expanding: ${text} = ${polyText(exp)}${exp.every((k, i) => k === [a, b, c][i]) ? ', the expression we started with.' : ' (does not match: please report this).'}`);
  return { ok: exp.every((k, i) => k === [a, b, c][i]), g, factors, text, steps, expanded: exp };
}

const isqrt = (n: number) => { if (n < 0) return null; const r = Math.round(Math.sqrt(n)); return r * r === n ? r : null; };
const icbrt = (n: number) => { const r = Math.round(Math.cbrt(n)); return r * r * r === n ? r : null; };

/** p x² − q (or p x² + q) by a² − b² = (a + b)(a − b), after any common factor. */
export function diffSquares(p: number, q: number): Fact {
  const orig = polyText([p, 0, -q]), steps: string[] = [];
  const g = g3(p, q) || 1, P = p / g, Qv = q / g;
  if (g !== 1) steps.push(`Take out the common factor ${g}: ${orig} = ${g}(${polyText([P, 0, -Qv])}).`);
  const a = isqrt(P), b = isqrt(Qv);
  if (a === null || b === null || b === 0) {
    steps.push(`${polyText([P, 0, -Qv])} is not (something)² − (something)² with whole numbers, so a² − b² does not apply.`);
    return { ok: false, g, factors: [], text: orig, steps, expanded: [p, 0, -q] };
  }
  steps.push(`Write it as a square minus a square: ${term(P, 2)} = (${term(a, 1)})² and ${Qv} = ${b}².`);
  steps.push(`Use a² − b² = (a + b)(a − b) with a = ${term(a, 1)} and b = ${b}.`);
  const text = `${g === 1 ? '' : g}${lin(a, b)}${lin(a, -b)}`, exp = mul([a, b], [a, -b]).map((k) => k * g);
  steps.push(`Check by expanding: ${text} = ${polyText(exp)}.`);
  return { ok: true, g, factors: [[a, b], [a, -b]], text, steps, expanded: exp };
}

/** p x² + 2·√p·√q x + q style perfect squares are handled by quadratic(); this names the identity used. */
export function perfectSquare(a: number, b: number, c: number): { a: number; b: number; sign: 1 | -1 } | null {
  const r = isqrt(a), s = isqrt(c);
  if (r === null || s === null || r === 0 || s === 0) return null;
  if (b === 2 * r * s) return { a: r, b: s, sign: 1 };
  if (b === -2 * r * s) return { a: r, b: s, sign: -1 };
  return null;
}

/** p x³ ± q by a³ + b³ = (a + b)(a² − ab + b²) or a³ − b³ = (a − b)(a² + ab + b²). */
export function cubes(p: number, q: number, plus: boolean): Fact & { quad: number[] } {
  const orig = polyText([p, 0, 0, plus ? q : -q]), steps: string[] = [];
  const g = g3(p, q) || 1, P = p / g, Qv = q / g;
  if (g !== 1) steps.push(`Take out the common factor ${g}: ${orig} = ${g}(${polyText([P, 0, 0, plus ? Qv : -Qv])}).`);
  const a = icbrt(P), b = icbrt(Qv);
  if (a === null || b === null || b === 0) {
    steps.push(`${polyText([P, 0, 0, plus ? Qv : -Qv])} is not a sum or difference of two whole-number cubes.`);
    return { ok: false, g, factors: [], text: orig, steps, expanded: [p, 0, 0, plus ? q : -q], quad: [] };
  }
  const s = plus ? 1 : -1;
  steps.push(`Write it as cubes: ${term(P, 3)} = (${term(a, 1)})³ and ${Qv} = ${b}³.`);
  steps.push(plus ? `Use a³ + b³ = (a + b)(a² − ab + b²) with a = ${term(a, 1)} and b = ${b}.` : `Use a³ − b³ = (a − b)(a² + ab + b²) with a = ${term(a, 1)} and b = ${b}.`);
  const quad = [a * a, -s * a * b, b * b];
  const text = `${g === 1 ? '' : g}${lin(a, s * b)}(${polyText(quad)})`, exp = mul([a, s * b], quad).map((k) => k * g);
  steps.push(`The second bracket ${polyText(quad)} does not factorise further (its discriminant is negative).`);
  steps.push(`Check by expanding: ${text} = ${polyText(exp)}.`);
  return { ok: true, g, factors: [[a, s * b]], text, steps, expanded: exp, quad };
}
