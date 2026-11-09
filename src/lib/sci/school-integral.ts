// School integration (Class 12 maths): Riemann sums (left, right, midpoint, trapezium), Simpson's rule
// as a reference for typed functions, where two curves cross, and the area between them. No DOM.
import type { Fn } from './school-calculus.ts';

export type Method = 'left' | 'right' | 'mid' | 'trap';
export type Strip = { x0: number; x1: number; h0: number; h1: number };

/** Riemann (or trapezium) sum of f on [a, b] with n equal strips, and the strips to draw. */
export function riemann(f: Fn, a: number, b: number, n: number, m: Method): { sum: number; strips: Strip[]; dx: number } {
  const dx = (b - a) / n, strips: Strip[] = [];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx, x1 = a + (i + 1) * dx;
    if (m === 'trap') { const h0 = f(x0), h1 = f(x1); sum += ((h0 + h1) / 2) * dx; strips.push({ x0, x1, h0, h1 }); }
    else { const h = f(m === 'left' ? x0 : m === 'right' ? x1 : (x0 + x1) / 2); sum += h * dx; strips.push({ x0, x1, h0: h, h1: h }); }
  }
  return { sum, strips, dx };
}

/** Composite Simpson's rule with n (made even) strips. */
export function simpson(f: Fn, a: number, b: number, n = 2000): number {
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

/** Where f and g cross on [a, b] (sign changes of f − g on a fine grid, refined by bisection). */
export function crossings(f: Fn, g: Fn, a: number, b: number, grid = 2000): number[] {
  const d = (x: number) => f(x) - g(x), out: number[] = [];
  let x0 = a, d0 = d(a);
  if (Math.abs(d0) < 1e-12) out.push(a);
  for (let i = 1; i <= grid; i++) {
    const x1 = a + ((b - a) * i) / grid, d1 = d(x1);
    if (Math.abs(d1) < 1e-12) { out.push(x1); }
    else if (Number.isFinite(d0) && Number.isFinite(d1) && Math.abs(d0) >= 1e-12 && d0 * d1 < 0) {
      let lo = x0, hi = x1, dl = d0;
      for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2, dm = d(mid); if (dm * dl <= 0) hi = mid; else { lo = mid; dl = dm; } }
      out.push((lo + hi) / 2);
    }
    x0 = x1; d0 = d1;
  }
  return out.filter((x, i) => i === 0 || Math.abs(x - out[i - 1]) > 1e-9);
}

/** Area between y = f and y = g from a to b: ∫|f − g| dx, split where they cross. */
export function areaBetween(f: Fn, g: Fn, a: number, b: number): { area: number; signed: number; pieces: { from: number; to: number; area: number; top: 'f' | 'g' }[] } {
  const cuts = [a, ...crossings(f, g, a, b).filter((x) => x > a + 1e-12 && x < b - 1e-12), b];
  const pieces = [] as { from: number; to: number; area: number; top: 'f' | 'g' }[];
  let area = 0, signed = 0;
  for (let i = 0; i < cuts.length - 1; i++) {
    const s = simpson((x) => f(x) - g(x), cuts[i], cuts[i + 1], 2000);
    pieces.push({ from: cuts[i], to: cuts[i + 1], area: Math.abs(s), top: s >= 0 ? 'f' : 'g' });
    area += Math.abs(s); signed += s;
  }
  return { area, signed, pieces };
}
