// #1280 Growing patterns: polygonal (figurate) numbers drawn as nested polygons of dots, a matchstick row, the
// difference table, and a rule finder for a typed sequence (linear, quadratic or geometric). Pure maths, no DOM.

/** s-gonal number P(s, n) = ((s − 2)n² − (s − 4)n) / 2: s = 3 triangular, 4 square, 5 pentagonal, 6 hexagonal. */
export const polygonal = (s: number, n: number) => ((s - 2) * n * n - (s - 4) * n) / 2;
/** Sum of the first n s-gonal numbers: n(n + 1)((s − 2)n − (s − 5)) / 6. */
export const polygonalSum = (s: number, n: number) => (n * (n + 1) * ((s - 2) * n - (s - 5))) / 6;
/** Dots added to go from step n − 1 to step n (the new layer, or "gnomon"). */
export const gnomon = (s: number, n: number) => (s - 2) * (n - 1) + 1;

/** Matchsticks for n squares in a row: 3n + 1. */
export const sticks = (n: number) => 3 * n + 1;

export type Dot = { x: number; y: number; layer: number };
/**
 * Dots of step n of an s-gonal number, as nested regular polygons that share one corner at (0, 0) (the classic
 * picture). Layer j has j dots on each side. Each dot keeps the first (smallest) layer it appears in. Unit spacing, y up.
 */
export function polygonDots(s: number, n: number): Dot[] {
  const seen = new Map<string, Dot>();
  const ext = (2 * Math.PI) / s;                  // turn at each corner
  for (let j = 1; j <= n; j++) {
    const len = j - 1;                            // layer j has j dots on each side
    let x = 0, y = 0, dir = 0;
    const put = (px: number, py: number) => { const k = `${(Math.round(px * 1e6) + 0)},${(Math.round(py * 1e6) + 0)}`; if (!seen.has(k)) seen.set(k, { x: px, y: py, layer: j }); };
    put(0, 0);
    for (let side = 0; side < s; side++) {
      for (let i = 1; i <= len; i++) put(x + i * Math.cos(dir), y + i * Math.sin(dir));
      x += len * Math.cos(dir); y += len * Math.sin(dir); dir += ext;
    }
  }
  if (n < 1) return [];
  return [...seen.values()];
}

/** First and second differences of a list. */
export function differences(xs: number[]): { d1: number[]; d2: number[] } {
  const d1 = xs.slice(1).map((v, i) => v - xs[i]);
  return { d1, d2: d1.slice(1).map((v, i) => v - d1[i]) };
}

export type Rule =
  | { kind: 'linear'; a: number; d: number; term: (n: number) => number; text: string }
  | { kind: 'quadratic'; A: number; B: number; C: number; term: (n: number) => number; text: string }
  | { kind: 'geometric'; a: number; r: number; term: (n: number) => number; text: string }
  | { kind: 'none'; text: string };

const eq = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const num = (x: number) => { const r = Math.round(x * 1e6) / 1e6; return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−'); };
const frac = (x: number) => { for (const q of [1, 2, 3, 4, 6]) { const p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return q === 1 ? num(p) : `${num(Math.round(p))}/${q}`; } return num(x); };

/** Write c₂n² + c₁n + c₀ in plain text with real minus signs, e.g. "3n + 1", "n² − n + 41". */
export function polyText(c2: number, c1: number, c0: number): string {
  const parts: string[] = [];
  const add = (c: number, v: string) => {
    if (eq(c, 0)) return;
    const neg = c < 0, m = Math.abs(c), coef = v && eq(m, 1) ? '' : frac(m);
    const t = `${coef}${v}`;
    parts.push(parts.length ? `${neg ? '−' : '+'} ${t}` : `${neg ? '−' : ''}${t}`);
  };
  add(c2, 'n²'); add(c1, 'n'); add(c0, '');
  return parts.length ? parts.join(' ') : '0';
}

/** Find a simple rule for the nth term (n from 1) from at least 3 terms (4 for quadratic, so it can be checked). */
export function findRule(xs: number[]): Rule {
  if (xs.length < 3 || xs.some((v) => !Number.isFinite(v))) return { kind: 'none', text: 'Type at least 3 numbers.' };
  const { d1, d2 } = differences(xs);
  if (d1.every((v) => eq(v, d1[0]))) {
    const a = xs[0], d = d1[0];
    return { kind: 'linear', a, d, term: (n) => a + (n - 1) * d, text: polyText(0, d, a - d) };
  }
  if (xs.every((v) => !eq(v, 0))) {
    const r = xs[1] / xs[0];
    if (xs.every((v, i) => i === 0 || eq(v / xs[i - 1], r))) {
      const a = xs[0];
      return { kind: 'geometric', a, r, term: (n) => a * r ** (n - 1), text: `${eq(a, 1) ? '' : `${num(a)} × `}${num(r)}${'ⁿ⁻¹'}` };
    }
  }
  if (xs.length >= 4 && d2.every((v) => eq(v, d2[0]))) {
    // t(n) = An² + Bn + C: 2A = second difference; t(2) − t(1) = 3A + B; C = t(1) − A − B.
    const A = d2[0] / 2, B = d1[0] - 3 * A, C = xs[0] - A - B;
    return { kind: 'quadratic', A, B, C, term: (n) => A * n * n + B * n + C, text: polyText(A, B, C) };
  }
  return { kind: 'none', text: xs.length < 4 && d2.length ? 'Not linear or geometric. Type a fourth number to test for a square (quadratic) rule.' : 'No simple rule found: the differences are not constant and there is no common ratio.' };
}

export type Pattern = { id: string; name: string; s?: number; term: (n: number) => number; rule: string; sum: (n: number) => number; sumRule: string; why: string };
export const PATTERNS: Pattern[] = [
  { id: 'tri', name: 'Triangle', s: 3, term: (n) => polygonal(3, n), rule: 'n(n + 1)/2', sum: (n) => polygonalSum(3, n), sumRule: 'n(n + 1)(n + 2)/6', why: 'Each new row is one dot longer, so step n is 1 + 2 + … + n. Two copies fit together into an n by (n + 1) rectangle, so it is half of n(n + 1).' },
  { id: 'sq', name: 'Square', s: 4, term: (n) => polygonal(4, n), rule: 'n²', sum: (n) => polygonalSum(4, n), sumRule: 'n(n + 1)(2n + 1)/6', why: 'Each new layer is an L-shape of 2n − 1 dots, so n² = 1 + 3 + 5 + … + (2n − 1): the first n odd numbers.' },
  { id: 'pent', name: 'Pentagon', s: 5, term: (n) => polygonal(5, n), rule: 'n(3n − 1)/2', sum: (n) => polygonalSum(5, n), sumRule: 'n²(n + 1)/2', why: 'Each new layer adds 3n − 2 dots. A pentagon number is a square number plus a triangle number: n² + (n − 1)n/2.' },
  { id: 'hex', name: 'Hexagon', s: 6, term: (n) => polygonal(6, n), rule: 'n(2n − 1)', sum: (n) => polygonalSum(6, n), sumRule: 'n(n + 1)(4n − 1)/6', why: 'Each new layer adds 4n − 3 dots. Every hexagon number is also a triangle number: the (2n − 1)th one.' },
  { id: 'stick', name: 'Matchsticks', term: sticks, rule: '3n + 1', sum: (n) => (n * (3 * n + 5)) / 2, sumRule: 'n(3n + 5)/2', why: 'The first square needs 4 sticks; every new square shares one side, so it needs only 3 more: 4 + 3(n − 1) = 3n + 1.' },
];
