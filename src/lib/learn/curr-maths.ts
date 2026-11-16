// Pure maths for the curriculum Learn simulations: bearings, cumulative frequency, iteration and surds.
// No DOM. Checked against hand-worked values in tests/curr-maths.mjs (node tests/curr-maths.mjs).
import { parse as parseExpr, compile, variables } from '../sci/expr.ts';

/* ------------------------------------------------------------------ bearings */

/** Bearing of B from A in degrees clockwise from north, 0 to 360 (360 is shown as 000). x east, y north. */
export function bearing(ax: number, ay: number, bx: number, by: number): number {
  const d = (Math.atan2(bx - ax, by - ay) * 180) / Math.PI;
  return ((d % 360) + 360) % 360;
}
/** The back bearing: add or subtract 180 so it stays between 0 and 360. */
export const backBearing = (b: number) => (((b + 180) % 360) + 360) % 360;
/** Three-figure bearing text, e.g. 45 gives "045°". */
export function fmtBearing(b: number): string {
  const n = Math.round(((b % 360) + 360) % 360) % 360;
  return String(n).padStart(3, '0') + '°';
}
export const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(bx - ax, by - ay);
export type Leg = { b: number; d: number };
/** Walk legs of (bearing, distance) from the origin. Returns every point, and the way back to the start. */
export function journey(legs: Leg[]) {
  const pts = [{ x: 0, y: 0 }];
  for (const l of legs) {
    const p = pts[pts.length - 1], t = (l.b * Math.PI) / 180;
    pts.push({ x: p.x + l.d * Math.sin(t), y: p.y + l.d * Math.cos(t) });
  }
  const end = pts[pts.length - 1];
  const dd = Math.hypot(end.x, end.y);
  return { pts, end, backDist: dd, backBearing: dd < 1e-9 ? 0 : bearing(end.x, end.y, 0, 0) };
}
/** Angle at the turn between two legs (inside the triangle), in degrees: between the way back and the way on. */
export function turnAngle(b1: number, b2: number): number {
  let d = Math.abs(((backBearing(b1) - b2) % 360 + 360) % 360);
  if (d > 180) d = 360 - d;
  return d;
}
/** Two legs: the straight-line distance back, by the cosine rule c² = a² + b² − 2ab cos C. */
export function cosineRuleBack(b1: number, d1: number, b2: number, d2: number) {
  const C = turnAngle(b1, b2);
  return { C, dist: Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos((C * Math.PI) / 180)) };
}

/* ------------------------------------------------------------ cumulative frequency */

export type CF = { bounds: number[]; freq: number[] };
/** Running totals of the frequencies. */
export function cumulative(freq: number[]): number[] {
  let s = 0;
  return freq.map((f) => (s += f));
}
/** Slopes for a monotone cubic through the points (Fritsch-Carlson) so the smooth curve never dips. */
function slopes(x: number[], y: number[]): number[] {
  const n = x.length, d: number[] = [], m: number[] = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((y[i + 1] - y[i]) / (x[i + 1] - x[i]));
  if (n === 2) return [d[0], d[0]];
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return m;
}
/** The curve points: (lowest boundary, 0) then (each upper boundary, running total). */
export function cfPoints(c: CF) { return { x: c.bounds.slice(), y: [0, ...cumulative(c.freq)] }; }
/** Cumulative frequency at x, along straight segments or a smooth monotone curve. */
export function cfAt(c: CF, x: number, smooth: boolean): number {
  const { x: X, y: Y } = cfPoints(c), n = X.length;
  if (x <= X[0]) return 0;
  if (x >= X[n - 1]) return Y[n - 1];
  let i = 0; while (x > X[i + 1]) i++;
  const h = X[i + 1] - X[i], t = (x - X[i]) / h;
  if (!smooth) return Y[i] + t * (Y[i + 1] - Y[i]);
  const m = slopes(X, Y), t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * Y[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * Y[i + 1] + (t3 - t2) * h * m[i + 1];
}
/** The value x where the curve reaches a cumulative frequency (reading across then down). */
export function cfInverse(c: CF, pos: number, smooth: boolean): number {
  const { x: X, y: Y } = cfPoints(c), n = X.length;
  if (pos <= 0) return X[0];
  if (pos >= Y[n - 1]) return X[n - 1];
  if (!smooth) {
    let i = 0; while (pos > Y[i + 1]) i++;
    const f = Y[i + 1] - Y[i];
    return f === 0 ? X[i] : X[i] + ((pos - Y[i]) / f) * (X[i + 1] - X[i]);
  }
  let lo = X[0], hi = X[n - 1];
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (cfAt(c, mid, true) < pos) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
/** Median, quartiles and spread read from the curve: n/2, n/4 and 3n/4. */
export function cfSummary(c: CF, smooth: boolean) {
  const n = cumulative(c.freq).pop() ?? 0;
  const median = cfInverse(c, n / 2, smooth), q1 = cfInverse(c, n / 4, smooth), q3 = cfInverse(c, (3 * n) / 4, smooth);
  return { n, median, q1, q3, iqr: q3 - q1, min: c.bounds[0], max: c.bounds[c.bounds.length - 1] };
}
/** Estimate of how many values are above x. */
export const cfAbove = (c: CF, x: number, smooth: boolean) => (cumulative(c.freq).pop() ?? 0) - cfAt(c, x, smooth);
/** The value below which p per cent of the data lies. */
export const cfPercentile = (c: CF, p: number, smooth: boolean) => cfInverse(c, ((cumulative(c.freq).pop() ?? 0) * p) / 100, smooth);

/* ------------------------------------------------------------------ iteration */

export type GFn = (x: number) => number;
export type Preset = { id: string; label: string; eq: string; g: string; f: GFn; gf: GFn; root: number };
export const PRESETS: Preset[] = [
  { id: 'cubic-a', label: 'x³ + 4x − 1 = 0, x = (1 − x³)/4', eq: 'x³ + 4x − 1 = 0', g: '(1 - x^3)/4', f: (x) => x ** 3 + 4 * x - 1, gf: (x) => (1 - x ** 3) / 4, root: 0.2461 },
  { id: 'cubic-b', label: 'x³ + 4x − 1 = 0, x = ∛(1 − 4x)', eq: 'x³ + 4x − 1 = 0', g: 'cbrt(1 - 4x)', f: (x) => x ** 3 + 4 * x - 1, gf: (x) => Math.cbrt(1 - 4 * x), root: 0.2461 },
  { id: 'quad-a', label: 'x² − 5x + 3 = 0, x = √(5x − 3)', eq: 'x² − 5x + 3 = 0', g: 'sqrt(5x - 3)', f: (x) => x * x - 5 * x + 3, gf: (x) => Math.sqrt(5 * x - 3), root: 4.3028 },
  { id: 'quad-b', label: 'x² − 5x + 3 = 0, x = (x² + 3)/5', eq: 'x² − 5x + 3 = 0', g: '(x^2 + 3)/5', f: (x) => x * x - 5 * x + 3, gf: (x) => (x * x + 3) / 5, root: 0.6972 },
  { id: 'cubic-c', label: 'x³ − x − 1 = 0, x = ∛(x + 1)', eq: 'x³ − x − 1 = 0', g: 'cbrt(x + 1)', f: (x) => x ** 3 - x - 1, gf: (x) => Math.cbrt(x + 1), root: 1.3247 },
];
/** Read a typed g(x). Returns the function or an error message. */
export function readG(src: string): { g: GFn } | { error: string } {
  try {
    const node = parseExpr(src.replace(/∛/g, 'cbrt'));
    const vs = variables(node);
    const bad = vs.filter((v) => v !== 'x');
    if (bad.length) return { error: `Only x can be used, not ${bad[0]}` };
    const fn = compile(node, ['x']);
    const g: GFn = (x) => fn([x]);
    if (!Number.isFinite(g(1)) && !Number.isFinite(g(0.5)) && !Number.isFinite(g(2))) return { error: 'g(x) gives no number for x = 0.5, 1 or 2' };
    return { g };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
/** x0, x1 = g(x0), ... for n steps (stops filling with NaN once it leaves the real numbers). */
export function iterate(g: GFn, x0: number, n: number): number[] {
  const xs = [x0];
  for (let i = 0; i < n; i++) { const p = xs[xs.length - 1]; xs.push(Number.isFinite(p) ? g(p) : NaN); }
  return xs;
}
/** Slope of g at x (central difference). */
export const slopeAt = (g: GFn, x: number, h = 1e-6) => (g(x + h) - g(x - h)) / (2 * h);
/** Newton-Raphson on f from x0. */
export function newton(f: GFn, x0: number, n: number): number[] {
  const xs = [x0];
  for (let i = 0; i < n; i++) {
    const x = xs[xs.length - 1];
    if (!Number.isFinite(x)) { xs.push(NaN); continue; }
    const h = 1e-6 * Math.max(1, Math.abs(x)), d = (f(x + h) - f(x - h)) / (2 * h);
    xs.push(d === 0 ? NaN : x - f(x) / d);
  }
  return xs;
}
/** Root of g(x) = x near x0 by Newton on g(x) - x (NaN if it does not settle). */
export function rootOf(f: GFn, x0: number): number {
  const xs = newton(f, x0, 80), x = xs[xs.length - 1];
  return Number.isFinite(x) && Math.abs(f(x)) < 1e-9 * Math.max(1, Math.abs(x)) ? x : NaN;
}
/** Is the iteration settling on one number, running away or neither? */
export function status(xs: number[]): 'converging' | 'diverging' | 'undefined' | 'wandering' {
  const L = xs.length;
  if (xs.some((x) => !Number.isFinite(x))) return 'undefined';
  if (L < 3) return 'wandering';
  if (Math.abs(xs[L - 1]) > 1e6) return 'diverging';
  const a = Math.abs(xs[L - 1] - xs[L - 2]), b = Math.abs(xs[L - 2] - xs[L - 3]);
  if (a < 5e-7) return 'converging';
  if (L >= 6 && a > b * 1.0001 && a > 1e-3) return 'diverging';
  if (L >= 6 && a < b) return 'converging';
  return 'wandering';
}
/** First step n where x_n agrees with the settled value to 6 decimal places (or -1). */
export function stepsTo(xs: number[], target: number): number {
  for (let i = 0; i < xs.length; i++) if (Math.abs(xs[i] - target) < 5e-7) return i;
  return -1;
}

/* ------------------------------------------------------------------------ surds */

export const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/** Largest square factor: n = k² × m with m as small as possible. */
export function simplifySqrt(n: number): { k: number; m: number } {
  let k = 1;
  for (let f = Math.floor(Math.sqrt(n)); f >= 2; f--) if (n % (f * f) === 0) { k = f; break; }
  return { k, m: n / (k * k) };
}
/** A number plus whole multiples of square roots: r + sum c_b √b (radicands squarefree). */
export type Sum = { r: number; s: Record<number, number> };
export const sum0 = (): Sum => ({ r: 0, s: {} });
/** a√b as a Sum, simplified. */
export function term(a: number, b: number): Sum {
  const { k, m } = simplifySqrt(b), out = sum0();
  if (m === 1) out.r = a * k; else if (a * k !== 0) out.s[m] = a * k;
  return out;
}
export function add(x: Sum, y: Sum, sign = 1): Sum {
  const out: Sum = { r: x.r + sign * y.r, s: { ...x.s } };
  for (const k of Object.keys(y.s)) out.s[+k] = (out.s[+k] ?? 0) + sign * y.s[+k];
  for (const k of Object.keys(out.s)) if (out.s[+k] === 0) delete out.s[+k];
  return out;
}
export function mul(x: Sum, y: Sum): Sum {
  let out = sum0();
  out = add(out, { r: x.r * y.r, s: {} });
  for (const k of Object.keys(y.s)) out = add(out, { r: 0, s: { [+k]: x.r * y.s[+k] } });
  for (const k of Object.keys(x.s)) out = add(out, { r: 0, s: { [+k]: y.r * x.s[+k] } });
  for (const i of Object.keys(x.s)) for (const j of Object.keys(y.s)) out = add(out, term(x.s[+i] * y.s[+j], +i * +j));
  return out;
}
export const sumValue = (x: Sum) => x.r + Object.keys(x.s).reduce((t, k) => t + x.s[+k] * Math.sqrt(+k), 0);
const S = (c: number, b: number) => (Math.abs(c) === 1 ? '' : String(Math.abs(c))) + '√' + b;
/** Plain-text form: 5 + 2√3, −3√2, 4 − √5. */
export function fmtSum(x: Sum): string {
  const parts: [number, string][] = [];
  if (x.r !== 0) parts.push([x.r, String(Math.abs(x.r))]);
  for (const k of Object.keys(x.s).map(Number).sort((a, b) => a - b)) parts.push([x.s[k], S(x.s[k], k)]);
  if (!parts.length) return '0';
  return parts.map(([c, t], i) => (i === 0 ? (c < 0 ? '−' : '') + t : (c < 0 ? ' − ' : ' + ') + t)).join('');
}
/** a√b written simply: √2, 3√2, 4. */
export const fmtSurd = (a: number, b: number) => fmtSum(term(a, b));
/** Raw a√b as typed, before simplifying: 3√8. Coefficient 1 is left out. */
export const raw = (a: number, b: number) => (a === 1 ? '' : a === -1 ? '−' : String(a)) + '√' + b;

/** Typed forms to accept for a Sum: 5+2√3, 2√3+5, 5+2sqrt3, 5+2sqrt(3). */
export function sumAnswers(x: Sum): string[] {
  const a = fmtSum(x).replace(/ /g, '');
  const keys = Object.keys(x.s).map(Number).sort((p, q) => p - q);
  const alt = keys.length
    ? keys.map((k) => (x.s[k] < 0 ? '-' : '+') + S(x.s[k], k)).join('').replace(/^\+/, '') + (x.r ? (x.r < 0 ? '-' : '+') + Math.abs(x.r) : '')
    : a;
  const out = new Set<string>();
  for (const f of [a, alt]) { out.add(f); out.add(f.replace(/√(\d+)/g, 'sqrt($1)')); out.add(f.replace(/√(\d+)/g, 'sqrt$1')); }
  return [...out];
}

export type Worked = { steps: string[]; result: string; value: number; sum?: Sum; den?: number };
const reduceFrac = (num: Sum, den: number): { num: Sum; den: number } => {
  if (den < 0) { num = { r: -num.r, s: Object.fromEntries(Object.entries(num.s).map(([k, v]) => [k, -v])) }; den = -den; }
  const g = [Math.abs(num.r), ...Object.values(num.s).map(Math.abs), den].reduce(gcd);
  if (g > 1) { num = { r: num.r / g, s: Object.fromEntries(Object.entries(num.s).map(([k, v]) => [k, v / g])) }; den /= g; }
  return { num, den };
};
export const fmtFrac = (num: Sum, den: number) => {
  if (den === 1) return fmtSum(num);
  const t = fmtSum(num);
  return (num.r !== 0 && Object.keys(num.s).length) ? `(${t})/${den}` : `${t}/${den}`;
};

/** a√b simplified, with the working. */
export function wSimplify(n: number): Worked {
  const { k, m } = simplifySqrt(n), steps: string[] = [];
  if (k === 1) {
    steps.push(`Look for a square number (4, 9, 16, 25, 36, 49 ...) that divides ${n}. None does.`);
    steps.push(`So √${n} cannot be simplified.`);
  } else {
    steps.push(`Largest square factor of ${n}: ${k * k} (since ${k * k} × ${m} = ${n}).`);
    steps.push(`√${n} = √(${k * k} × ${m}) = √${k * k} × √${m}`);
    steps.push(m === 1 ? `= ${k} × 1 = ${k}` : `= ${k}√${m}`);
  }
  return { steps, result: fmtSurd(1, n), value: Math.sqrt(n), sum: term(1, n) };
}
/** a√b + sign × c√d. */
export function wAdd(a: number, b: number, c: number, d: number, sign: 1 | -1): Worked {
  const A = term(a, b), B = term(c, d), steps: string[] = [];
  const op = sign === 1 ? '+' : '−';
  steps.push(`${raw(a, b)} ${op} ${raw(c, d)}`);
  if (fmtSum(A) !== raw(a, b) || fmtSum(B) !== raw(c, d)) steps.push(`Simplify each: ${fmtSum(A)} ${op} ${fmtSum(B)}`);
  const res = add(A, B, sign), like = Object.keys(A.s)[0] === Object.keys(B.s)[0] || !Object.keys(A.s).length || !Object.keys(B.s).length;
  if (like) steps.push('These are like surds (the same root), so add or subtract the numbers in front.');
  else steps.push('The roots are different, so they are not like surds and the answer cannot be combined further.');
  steps.push(`= ${fmtSum(res)}`);
  return { steps, result: fmtSum(res), value: sumValue(res), sum: res };
}
/** a√b × c√d. */
export function wMul(a: number, b: number, c: number, d: number): Worked {
  const res = term(a * c, b * d), steps: string[] = [];
  steps.push(`${raw(a, b)} × ${raw(c, d)}`);
  steps.push(`Multiply the numbers in front: ${a} × ${c} = ${a * c}. Multiply the roots: √${b} × √${d} = √${b * d}.`);
  steps.push(`= ${a * c}√${b * d}`);
  const t = simplifySqrt(b * d);
  if (t.k > 1) steps.push(`Simplify √${b * d} = ${t.k}${t.m === 1 ? '' : '√' + t.m}, so = ${fmtSum(res)}`);
  return { steps, result: fmtSum(res), value: sumValue(res), sum: res };
}
/** (a + √b)(c + √d). */
export function wExpand(a: number, b: number, c: number, d: number): Worked {
  const P = add({ r: a, s: {} }, term(1, b)), Q = add({ r: c, s: {} }, term(1, d)), res = mul(P, Q), steps: string[] = [];
  steps.push(`(${a} + √${b})(${c} + √${d})`);
  steps.push(`First × first: ${a} × ${c} = ${a * c}. Outer: ${a} × √${d} = ${a === 1 ? '' : a}√${d}. Inner: √${b} × ${c} = ${c === 1 ? '' : c}√${b}. Last: √${b} × √${d} = √${b * d}.`);
  steps.push(`${a * c} + ${a === 1 ? '' : a}√${d} + ${c === 1 ? '' : c}√${b} + √${b * d}`);
  steps.push(`Simplify roots and collect like terms: ${fmtSum(res)}`);
  return { steps, result: fmtSum(res), value: sumValue(res), sum: res };
}
/** k / √b. */
export function wRat1(k: number, b: number): Worked {
  const num = term(k, b), f = reduceFrac(num, b), steps: string[] = [];
  steps.push(`${k}/√${b}`);
  steps.push(`Multiply top and bottom by √${b}: ${k}/√${b} × √${b}/√${b} = ${k}√${b}/${b}  (√${b} × √${b} = ${b}, a whole number).`);
  const text = fmtFrac(f.num, f.den);
  if (fmtFrac(num, b) !== text || simplifySqrt(b).k > 1) steps.push(`Simplify: ${text}`);
  return { steps, result: text, value: k / Math.sqrt(b), sum: f.num, den: f.den };
}
/** k / (p + s√q), s = +1 or −1. */
export function wRat2(k: number, p: number, q: number, s: 1 | -1): Worked | null {
  const den = p * p - q;
  if (den === 0) return null;
  const sg = (x: number) => (x < 0 ? '−' : '+');
  const conj = `${p} ${sg(-s)} √${q}`, orig = `${p} ${sg(s)} √${q}`;
  const numRaw = mul({ r: k, s: {} }, add({ r: p, s: {} }, term(-s, q))), f = reduceFrac(numRaw, den), steps: string[] = [];
  steps.push(`${k}/(${orig})`);
  steps.push(`The conjugate of ${orig} is ${conj}: same numbers, opposite sign in the middle.`);
  steps.push(`Multiply top and bottom by it: ${k}(${conj}) / [(${orig})(${conj})]`);
  steps.push(`Bottom is a difference of two squares: (${p})² − (√${q})² = ${p * p} − ${q} = ${den}.`);
  steps.push(`Top: ${fmtSum(numRaw)}. So ${fmtFrac(numRaw, den)}${f.den !== den || fmtSum(f.num) !== fmtSum(numRaw) ? ', which simplifies to ' + fmtFrac(f.num, f.den) : ''}`);
  return { steps, result: fmtFrac(f.num, f.den), value: k / (p + s * Math.sqrt(q)), sum: f.num, den: f.den };
}
