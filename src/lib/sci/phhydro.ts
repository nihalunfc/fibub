// Hydrogen-like atom (one electron, nucleus of charge Z, infinitely heavy): radial functions R_nl, complex and
// real spherical harmonics, energies and radial expectation values, and random samples of |ψ|² for a dot cloud.
// Lengths in Bohr radii a₀. No DOM.
import { rng } from './phq.ts';

/** Rydberg energy hcR∞ in eV and the Bohr radius in pm (CODATA 2018, rounded). */
export const RYDBERG_EV = 13.605693123, BOHR_PM = 52.917721090;

const fact = (n: number) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };

/** Generalised Laguerre polynomial L_k^α(x) by the three-term recurrence. */
export function laguerre(k: number, alpha: number, x: number): number {
  if (k === 0) return 1;
  let a = 1, b = 1 + alpha - x;
  for (let i = 1; i < k; i++) { const c = ((2 * i + 1 + alpha - x) * b - (i + alpha) * a) / (i + 1); a = b; b = c; }
  return b;
}

/** Radial function R_nl(r) for charge Z, r in a₀ (normalised so ∫ R² r² dr = 1). */
export function radial(n: number, l: number, r: number, Z = 1): number {
  const rho = (2 * Z * r) / n;
  const N = Math.sqrt(((2 * Z) / n) ** 3 * (fact(n - l - 1) / (2 * n * fact(n + l))));
  return N * Math.pow(rho, l) * Math.exp(-rho / 2) * laguerre(n - l - 1, 2 * l + 1, rho);
}

/** Associated Legendre P_l^m(x) for m ≥ 0, without the Condon–Shortley phase. */
export function legendre(l: number, m: number, x: number): number {
  let pmm = 1;
  const s = Math.sqrt(Math.max(0, 1 - x * x));
  for (let i = 1; i <= m; i++) pmm *= (2 * i - 1) * s;
  if (l === m) return pmm;
  let pm1 = x * (2 * m + 1) * pmm;
  if (l === m + 1) return pm1;
  for (let ll = m + 2; ll <= l; ll++) { const p = ((2 * ll - 1) * x * pm1 - (ll + m - 1) * pmm) / (ll - m); pmm = pm1; pm1 = p; }
  return pm1;
}
const norm = (l: number, m: number) => Math.sqrt(((2 * l + 1) / (4 * Math.PI)) * (fact(l - m) / fact(l + m)));

/** Complex spherical harmonic Y_lm(θ, φ) with the Condon–Shortley phase, as [re, im]. */
export function ylm(l: number, m: number, th: number, ph: number): [number, number] {
  const am = Math.abs(m);
  let v = norm(l, am) * legendre(l, am, Math.cos(th));
  if (m > 0 && m % 2) v = -v; // (−1)^m for m > 0
  return [v * Math.cos(m * ph), v * Math.sin(m * ph)];
}

/** Real spherical harmonic: m > 0 ∝ cos(mφ), m < 0 ∝ sin(|m|φ), m = 0 as Y_l0 (no phase sign, so pₓ points along +x). */
export function yreal(l: number, m: number, th: number, ph: number): number {
  const am = Math.abs(m), v = norm(l, am) * legendre(l, am, Math.cos(th));
  return m === 0 ? v : m > 0 ? Math.SQRT2 * v * Math.cos(am * ph) : Math.SQRT2 * v * Math.sin(am * ph);
}

/** Usual chemistry names for the real orbitals. */
export function orbitalName(n: number, l: number, m: number, real: boolean): string {
  const L = 'spdfghi'[l];
  if (!real) return `${n}${L}, m = ${m}`;
  const names: Record<number, Record<number, string>> = {
    0: { 0: '' }, 1: { 0: 'z', 1: 'x', [-1]: 'y' },
    2: { 0: 'z²', 1: 'xz', [-1]: 'yz', 2: 'x²−y²', [-2]: 'xy' },
    3: { 0: 'z³', 1: 'xz²', [-1]: 'yz²', 2: 'z(x²−y²)', [-2]: 'xyz', 3: 'x(x²−3y²)', [-3]: 'y(3x²−y²)' },
  };
  const s = names[l]?.[m];
  return s === undefined ? `${n}${L}, real m = ${m}` : `${n}${L}${s ? ' ' + s : ''}`;
}

/** ψ at a point (x, y, z in a₀): real orbital value, or |ψ| with the complex phase angle. */
export function psi(n: number, l: number, m: number, x: number, y: number, z: number, real: boolean, Z = 1): { v: number; phase: number } {
  const r = Math.hypot(x, y, z), th = r ? Math.acos(z / r) : 0, ph = Math.atan2(y, x), R = radial(n, l, r, Z);
  if (real) return { v: R * yreal(l, m, th, ph), phase: 0 };
  const [a, b] = ylm(l, m, th, ph);
  return { v: R * Math.hypot(a, b), phase: Math.atan2(b, a) * (R < 0 ? -1 : 1) + (R < 0 ? Math.PI : 0) };
}

export type Props = { E: number; rMean: number; r2Mean: number; invR: number; rPeak: number; r90: number; radialNodes: number; angularNodes: number; nodeRadii: number[]; peaks: number[] };

/** Energies (eV) and radial facts. Closed forms for ⟨r⟩, ⟨r²⟩ and ⟨1/r⟩; numerical peak, 90 % radius and node radii. */
export function properties(n: number, l: number, Z = 1): Props {
  const E = (-RYDBERG_EV * Z * Z) / (n * n);
  const rMean = (3 * n * n - l * (l + 1)) / (2 * Z), r2Mean = ((n * n) / (2 * Z * Z)) * (5 * n * n + 1 - 3 * l * (l + 1)), invR = Z / (n * n);
  const rMax = (n * (2 * n + 20)) / Z, M = 40000, h = rMax / M;
  let cum = 0, r90 = NaN, best = 0, rPeak = 0;
  const nodes: number[] = [], peaks: number[] = [];
  let prevR = radial(n, l, h, Z), prevP = 0, prev2 = 0;
  for (let i = 1; i <= M; i++) {
    const r = i * h, R = radial(n, l, r, Z), p = r * r * R * R;
    const inc = 0.5 * (p + prevP) * h; cum += inc;
    if (!(r90 === r90) && cum >= 0.9) r90 = r - h * ((cum - 0.9) / inc);
    if (p > best) { best = p; rPeak = r; }
    if (i > 1 && R * prevR < 0) nodes.push(r - h * (R / (R - prevR)));
    if (i > 2 && prevP > prev2 && prevP >= p && prevP > 1e-8) peaks.push(r - h);
    prev2 = prevP; prevP = p; prevR = R;
  }
  // Refine the peak by golden-section search on r²R².
  const P = (r: number) => { const R = radial(n, l, r, Z); return r * r * R * R; };
  let a = rPeak - h, b = rPeak + h;
  for (let i = 0; i < 80; i++) { const c = b - 0.618034 * (b - a), d = a + 0.618034 * (b - a); if (P(c) > P(d)) b = d; else a = c; }
  rPeak = 0.5 * (a + b);
  return { E, rMean, r2Mean, invR, rPeak, r90, radialNodes: n - l - 1, angularNodes: l, nodeRadii: nodes, peaks };
}

/** Radius that holds a fraction f of the radial probability (for choosing a picture size). */
export function radiusHolding(n: number, l: number, f: number, Z = 1): number {
  const rMax = (n * (2 * n + 20)) / Z, M = 20000, h = rMax / M; let cum = 0;
  for (let i = 1; i <= M; i++) { const r = i * h, R = radial(n, l, r, Z); cum += r * r * R * R * h; if (cum >= f) return r; }
  return rMax;
}

/** Random points distributed as |ψ|² (seeded, so the picture repeats): radius by inverse CDF, angles by rejection. */
export function sample(n: number, l: number, m: number, real: boolean, count: number, seed = 1, Z = 1): { x: number; y: number; z: number; s: number }[] {
  const rand = rng(seed), rMax = (n * (2 * n + 20)) / Z, M = 4000, h = rMax / M, cdf = new Float64Array(M + 1);
  for (let i = 1; i <= M; i++) { const r = (i - 0.5) * h, R = radial(n, l, r, Z); cdf[i] = cdf[i - 1] + r * r * R * R * h; }
  const tot = cdf[M];
  // Upper bound of the angular density for rejection.
  let ymax = 0;
  for (let i = 0; i <= 90; i++) for (let j = 0; j < 72; j++) { const th = (Math.PI * i) / 90, ph = (2 * Math.PI * j) / 72; const y = real ? yreal(l, m, th, ph) ** 2 : ylm(l, m, th, ph)[0] ** 2 + ylm(l, m, th, ph)[1] ** 2; ymax = Math.max(ymax, y); }
  ymax *= 1.05;
  const out: { x: number; y: number; z: number; s: number }[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 400) {
    const u = rand() * tot; let lo = 0, hi = M; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid; else hi = mid; }
    const r = (lo + (u - cdf[lo]) / Math.max(1e-300, cdf[hi] - cdf[lo])) * h;
    let th = 0, ph = 0, ok = false;
    for (let k = 0; k < 2000 && !ok; k++) {
      const ct = 2 * rand() - 1; th = Math.acos(ct); ph = 2 * Math.PI * rand();
      const y = real ? yreal(l, m, th, ph) ** 2 : ylm(l, m, th, ph)[0] ** 2 + ylm(l, m, th, ph)[1] ** 2;
      ok = rand() * ymax < y;
    }
    if (!ok) continue;
    const st = Math.sin(th), x = r * st * Math.cos(ph), y = r * st * Math.sin(ph), z = r * Math.cos(th);
    const R = radial(n, l, r, Z), s = real ? Math.sign(R * yreal(l, m, th, ph)) : Math.sign(R) || 1;
    out.push({ x, y, z, s });
  }
  return out;
}
