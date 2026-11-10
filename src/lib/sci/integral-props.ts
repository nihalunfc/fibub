// Properties of definite integrals for school: swap the limits, split at c, ∫ₐᵇ f(x) dx = ∫ₐᵇ f(a + b − x) dx,
// ∫₀²ᵃ, even and odd functions on [−a, a], and the area function A(x) = ∫ₐˣ f(t) dt with A′ = f.
// Composite Simpson's rule does the integrals. Plain TypeScript, no DOM.
// Checked against sympy 1.14 (integrate) in tests/sci-tools/integral-properties.mjs.

export type Fn = (x: number) => number;

/** Composite Simpson's rule with n (even) strips; ∫ₐᵇ with b < a gives the negative, as it should. */
export function simpson(f: Fn, a: number, b: number, n = 2000): number {
  if (a === b) return 0;
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/** 'even' if f(−x) = f(x), 'odd' if f(−x) = −f(x), checked at many points; otherwise 'neither'. */
export function parity(f: Fn, span = 3): 'even' | 'odd' | 'neither' {
  let even = true, odd = true, n = 0;
  for (let i = 1; i <= 40; i++) {
    const x = (span * i) / 40 - 0.0137 * i, p = f(x), m = f(-x);
    if (!Number.isFinite(p) || !Number.isFinite(m)) continue;
    n++;
    const tol = 1e-9 * (1 + Math.abs(p));
    if (Math.abs(p - m) > tol) even = false;
    if (Math.abs(p + m) > tol) odd = false;
  }
  if (!n) return 'neither';
  return even && !odd ? 'even' : odd && !even ? 'odd' : even && odd ? 'even' : 'neither';
}

export type Props = {
  swap: { ab: number; ba: number };
  split: { ac: number; cb: number; ab: number };
  king: { f: number; g: number };
  sym: { whole: number; right: number; left: number; parity: 'even' | 'odd' | 'neither' };
  double: { whole: number; first: number; second: number };
};

/** Both sides of every property for f with limits a, b, split point c and half-width k. */
export function properties(f: Fn, a: number, b: number, c: number, k: number): Props {
  return {
    swap: { ab: simpson(f, a, b), ba: simpson(f, b, a) },
    split: { ac: simpson(f, a, c), cb: simpson(f, c, b), ab: simpson(f, a, b) },
    king: { f: simpson(f, a, b), g: simpson((x) => f(a + b - x), a, b) },
    sym: { whole: simpson(f, -k, k), right: simpson(f, 0, k), left: simpson(f, -k, 0), parity: parity(f) },
    double: { whole: simpson(f, 0, 2 * k), first: simpson(f, 0, k), second: simpson((x) => f(2 * k - x), 0, k) },
  };
}

/** Area function A(x) = ∫ₐˣ f(t) dt, and its slope measured with a small step (it should equal f(x)). */
export const areaFn = (f: Fn, a: number, x: number) => simpson(f, a, x, 1000);
export const areaSlope = (f: Fn, a: number, x: number, h = 1e-3) => (areaFn(f, a, x + h) - areaFn(f, a, x - h)) / (2 * h);

export type Preset = { id: string; label: string; f: Fn; F?: Fn };
export const PRESETS: Preset[] = [
  { id: 'x2', label: 'x²', f: (x) => x * x, F: (x) => x ** 3 / 3 },
  { id: 'x3x', label: 'x³ − x', f: (x) => x ** 3 - x, F: (x) => x ** 4 / 4 - (x * x) / 2 },
  { id: 'sin', label: 'sin x', f: Math.sin, F: (x) => -Math.cos(x) },
  { id: 'cos', label: 'cos x', f: Math.cos, F: Math.sin },
  { id: 'abs', label: '|x|', f: Math.abs, F: (x) => (x * Math.abs(x)) / 2 },
  { id: 'exp', label: 'eˣ', f: Math.exp, F: Math.exp },
  { id: 'xsin', label: 'x sin x', f: (x) => x * Math.sin(x), F: (x) => Math.sin(x) - x * Math.cos(x) },
  { id: 'lin', label: '2x + 1', f: (x) => 2 * x + 1, F: (x) => x * x + x },
  { id: 'sinsq', label: 'sin² x', f: (x) => Math.sin(x) ** 2, F: (x) => x / 2 - Math.sin(2 * x) / 4 },
];
