// School complex numbers (Class 11 maths): arithmetic, modulus, principal argument, polar form, powers of
// i and the roots of a real quadratic, complex when the discriminant is negative. Plain TypeScript, no DOM.

export type C = { re: number; im: number };
export const cx = (re: number, im = 0): C => ({ re, im });
export const add = (z: C, w: C): C => cx(z.re + w.re, z.im + w.im);
export const sub = (z: C, w: C): C => cx(z.re - w.re, z.im - w.im);
export const mul = (z: C, w: C): C => cx(z.re * w.re - z.im * w.im, z.re * w.im + z.im * w.re);
export const conj = (z: C): C => cx(z.re, -z.im);
export const abs = (z: C) => Math.hypot(z.re, z.im);
/** z / w = z w̄ / |w|²; null when w = 0. */
export function div(z: C, w: C): C | null { const d = w.re * w.re + w.im * w.im; if (d === 0) return null; const t = mul(z, conj(w)); return cx(t.re / d, t.im / d); }
/** Principal argument in (−π, π]; NaN for 0. */
export function arg(z: C): number { if (z.re === 0 && z.im === 0) return NaN; const a = Math.atan2(z.im, z.re); return a === -Math.PI ? Math.PI : a; }
/** zⁿ for a whole number n (by repeated multiplication, exact for Gaussian integers). */
export function pow(z: C, n: number): C { let r = cx(1, 0); const b = n < 0 ? div(cx(1), z)! : z; for (let k = 0; k < Math.abs(n); k++) r = mul(r, b); return r; }
/** iⁿ as text: 1, i, −1 or −i (the pattern repeats every 4). */
export const iPower = (n: number) => ['1', 'i', '−1', '−i'][((n % 4) + 4) % 4];

/** Roots of ax² + bx + c = 0 for real a ≠ 0, b, c: two real, one repeated, or a complex conjugate pair. */
export function quadRoots(a: number, b: number, c: number): { D: number; roots: [C, C]; kind: 'real' | 'repeated' | 'complex' } {
  const D = b * b - 4 * a * c;
  if (D > 0) { const s = Math.sqrt(D), q = -0.5 * (b + Math.sign(b || 1) * s); const r1 = q / a, r2 = c / q; const [x1, x2] = r1 < r2 ? [r1, r2] : [r2, r1]; return { D, roots: [cx(x1), cx(x2)], kind: 'real' }; }
  if (D === 0) return { D, roots: [cx(-b / (2 * a)), cx(-b / (2 * a))], kind: 'repeated' };
  const re = -b / (2 * a), im = Math.sqrt(-D) / (2 * Math.abs(a));
  return { D, roots: [cx(re, im), cx(re, -im)], kind: 'complex' };
}

const n4 = (x: number) => { const s = (Math.abs(x) < 1e-12 ? 0 : x).toFixed(4).replace(/\.?0+$/, ''); return s === '-0' ? '0' : s; };
/** a + bi written nicely: 3 − 2i, −i, 4, 0.5i. */
export function show(z: C): string {
  const a = n4(z.re), b = n4(z.im);
  if (b === '0') return a.replace('-', '−');
  const bs = b === '1' ? 'i' : b === '-1' ? '−i' : `${b.replace('-', '−')}i`;
  if (a === '0') return bs;
  return `${a.replace('-', '−')} ${bs.startsWith('−') ? '−' : '+'} ${bs.replace('−', '')}`;
}
