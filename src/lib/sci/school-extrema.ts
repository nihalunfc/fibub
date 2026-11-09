// School maxima and minima (Class 12 maths, application of derivatives): critical points of f on an
// interval, the first and second derivative tests, absolute extremes on a closed interval, and three
// optimisation stories (open box, fence by a river, closed can). Plain TypeScript, no DOM.
import { deriv, deriv2, type Fn } from './school-calculus.ts';

export type Curve = { id: string; label: string; f: Fn; d: Fn; d2: Fn; range: [number, number] };
export const CURVES: Curve[] = [
  { id: 'cubic', label: 'x³ − 3x', f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, d2: (x) => 6 * x, range: [-2.5, 2.5] },
  { id: 'quartic', label: 'x⁴ − 4x²', f: (x) => x ** 4 - 4 * x * x, d: (x) => 4 * x ** 3 - 8 * x, d2: (x) => 12 * x * x - 8, range: [-2.4, 2.4] },
  { id: 'flat', label: 'x³ (flat but no turn)', f: (x) => x ** 3, d: (x) => 3 * x * x, d2: (x) => 6 * x, range: [-2, 2] },
  { id: 'quart4', label: 'x⁴ (f″ = 0 at a minimum)', f: (x) => x ** 4, d: (x) => 4 * x ** 3, d2: (x) => 12 * x * x, range: [-1.6, 1.6] },
  { id: 'sin', label: 'sin x + cos x', f: (x) => Math.sin(x) + Math.cos(x), d: (x) => Math.cos(x) - Math.sin(x), d2: (x) => -Math.sin(x) - Math.cos(x), range: [0, 2 * Math.PI] },
  { id: 'xex', label: 'x e⁻ˣ', f: (x) => x * Math.exp(-x), d: (x) => (1 - x) * Math.exp(-x), d2: (x) => (x - 2) * Math.exp(-x), range: [-0.5, 5] },
  { id: 'recip', label: 'x + 1/x', f: (x) => x + 1 / x, d: (x) => 1 - 1 / (x * x), d2: (x) => 2 / x ** 3, range: [-4, 4] },
];

export type Kind = 'max' | 'min' | 'neither' | 'unknown';
export type Critical = { x: number; y: number; left: number; right: number; d2: number; first: Kind; second: Kind };

/** Critical points of f in (a, b): where f′ changes sign or touches 0 (found on a fine grid, refined). */
export function criticalPoints(f: Fn, a: number, b: number, d: Fn = (x) => deriv(f, x), d2: Fn = (x) => deriv2(f, x), grid = 4000): Critical[] {
  const xs: number[] = [], step = (b - a) / grid;
  let x0 = a, v0 = d(a);
  const vals: number[] = [v0];
  for (let i = 1; i <= grid; i++) {
    const x1 = a + i * step, v1 = d(x1); vals.push(v1);
    if (Number.isFinite(v0) && Number.isFinite(v1) && Number.isFinite(f(x0)) && Number.isFinite(f(x1))) {
      if (v1 === 0) xs.push(x1);
      else if (v0 !== 0 && v0 * v1 < 0) {
        let lo = x0, hi = x1, dl = v0;
        for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2, dm = d(m); if (dm === 0) { lo = hi = m; break; } if (dm * dl < 0) hi = m; else { lo = m; dl = dm; } }
        xs.push((lo + hi) / 2);
      }
    }
    x0 = x1; v0 = v1;
  }
  // Touching zeros (like x³ at 0): a grid minimum of |f′| that is tiny, with the same sign both sides.
  const scale = Math.max(1e-9, ...vals.filter(Number.isFinite).map(Math.abs));
  for (let i = 1; i < grid; i++) {
    const v = Math.abs(vals[i]);
    if (Number.isFinite(v) && v <= Math.abs(vals[i - 1]) && v <= Math.abs(vals[i + 1]) && v < 1e-6 * scale && vals[i - 1] * vals[i + 1] > 0) xs.push(a + i * step);
  }
  xs.sort((p, q) => p - q);
  const uniq = xs.filter((x, i) => i === 0 || x - xs[i - 1] > step * 1.5);
  return uniq.filter((x) => x > a && x < b).map((x) => classify(f, x, d, d2, step));
}

/** First and second derivative tests at a critical point x. */
export function classify(f: Fn, x: number, d: Fn = (t) => deriv(f, t), d2: Fn = (t) => deriv2(f, t), h = 1e-3): Critical {
  const left = d(x - h), right = d(x + h), s2 = d2(x);
  const first: Kind = left > 0 && right < 0 ? 'max' : left < 0 && right > 0 ? 'min' : left * right > 0 ? 'neither' : 'unknown';
  const tol = 1e-7 * Math.max(1, Math.abs(f(x)));
  const second: Kind = !Number.isFinite(s2) ? 'unknown' : s2 < -tol ? 'max' : s2 > tol ? 'min' : 'unknown';
  return { x, y: f(x), left, right, d2: s2, first, second };
}

/** Absolute (global) maximum and minimum of f on [a, b]: compare the ends with the critical values. */
export function absolute(f: Fn, a: number, b: number, crit: Critical[]) {
  const cands = [{ x: a, y: f(a), at: 'end' }, ...crit.map((c) => ({ x: c.x, y: c.y, at: 'critical' })), { x: b, y: f(b), at: 'end' }].filter((c) => Number.isFinite(c.y));
  let max = cands[0], min = cands[0];
  for (const c of cands) { if (c.y > max.y) max = c; if (c.y < min.y) min = c; }
  return { max, min, candidates: cands };
}

// Optimisation stories.
/** Open box from an s × s sheet with x × x squares cut from each corner: V = x(s − 2x)². Best x = s/6. */
export const box = { V: (s: number, x: number) => x * (s - 2 * x) ** 2, best: (s: number) => s / 6, bestV: (s: number) => (2 * s ** 3) / 27, range: (s: number): [number, number] => [0, s / 2] };
/** Rectangle against a river with L metres of fence on three sides: A = x(L − 2x). Best x = L/4. */
export const fence = { A: (L: number, x: number) => x * (L - 2 * x), best: (L: number) => L / 4, bestA: (L: number) => (L * L) / 8, range: (L: number): [number, number] => [0, L / 2] };
/** Closed can holding V: surface S = 2πr² + 2V/r. Best r = (V/2π)^(1/3), and then the height is 2r. */
export const can = { S: (V: number, r: number) => 2 * Math.PI * r * r + (2 * V) / r, best: (V: number) => Math.cbrt(V / (2 * Math.PI)), h: (V: number, r: number) => V / (Math.PI * r * r) };
