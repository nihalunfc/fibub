// Electron diffraction: the relativistic electron wavelength, the camera constant λL, d-spacings from ring or spot
// distances, calibration with a known cubic standard, ring-ratio indexing of cubic lattices (via xrd.ts) and the
// zone axis of a two-spot pattern. Plain TypeScript with no DOM; checked against SciPy constants and NumPy.
import { cubicAllowed, indexCubic, rankCubic, type Cubic, type CubicFit } from './xrd.ts';
import { zoneAxis } from './miller.ts';

// CODATA 2018 (h, e and c exact).
const H = 6.62607015e-34, ME = 9.1093837015e-31, QE = 1.602176634e-19, C = 299792458;

/** Relativistic electron wavelength in ångström for an accelerating voltage in kV. */
export function electronWavelength(kV: number): number {
  const V = kV * 1e3, E = QE * V;
  return (H / Math.sqrt(2 * ME * E * (1 + E / (2 * ME * C * C)))) * 1e10;
}
/** The same without the relativistic correction (for comparison). */
export const classicalWavelength = (kV: number) => (H / Math.sqrt(2 * ME * QE * kV * 1e3)) * 1e10;
/** Electron speed as a fraction of c. */
export function beta(kV: number): number { const g = 1 + (QE * kV * 1e3) / (ME * C * C); return Math.sqrt(1 - 1 / (g * g)); }

/** d (Å) from a distance R measured from the centre (mm) with camera constant λL (Å·mm): the small-angle rule Rd = λL. */
export const dFromR = (R: number, lamL: number) => lamL / R;
/** d (Å) without the small-angle rule: tan 2θ = R/L, d = λ/(2 sin θ). */
export function dFromRExact(R: number, lambda: number, L: number): number {
  const th = Math.atan(R / L) / 2;
  return lambda / (2 * Math.sin(th));
}

export type Calibration = { lamL: number; sd: number; n: number; fit: CubicFit; per: { R: number; N: number | null; hkl: string; d: number; lamL: number }[] };
/**
 * Camera constant from rings of a known cubic standard: rings are indexed from their R² ratios on the standard's
 * lattice (the first ring taken as the lattice's first allowed ring), then λL = R · d(hkl) for each indexed ring,
 * averaged.
 */
export function calibrate(radii: number[], lattice: Cubic, a: number, tol = 0.02): Calibration | null {
  const R = radii.filter((r) => r > 0).sort((x, y) => x - y);
  if (!R.length || !(a > 0)) return null;
  const fit = indexCubic(R.map((r) => r * r), lattice, tol, 0, 0);
  if (!fit) return null;
  const per = R.map((r, i) => { const L = fit.lines[i]; const d = L.N ? a / Math.sqrt(L.N) : NaN; return { R: r, N: L.N, hkl: L.hkl, d, lamL: r * d }; });
  const ok = per.filter((p) => Number.isFinite(p.lamL));
  if (!ok.length) return null;
  const m = ok.reduce((s, p) => s + p.lamL, 0) / ok.length;
  const sd = ok.length > 1 ? Math.sqrt(ok.reduce((s, p) => s + (p.lamL - m) ** 2, 0) / (ok.length - 1)) : NaN;
  return { lamL: m, sd, n: ok.length, fit, per };
}

/** Rank the four cubic lattices for a ring pattern from its d-spacings (Å); a comes out in Å. */
export const indexRings = (d: number[], tol = 0.02): CubicFit[] => rankCubic(d.map((x) => 1 / (x * x)), tol, 0);

/** Every allowed hkl (all signs and orders) of a cubic lattice with h² + k² + l² ≤ maxN. */
export function allowedHkl(t: Cubic, maxN: number): number[][] {
  const out: number[][] = [], m = Math.floor(Math.sqrt(maxN));
  for (let h = -m; h <= m; h++) for (let k = -m; k <= m; k++) for (let l = -m; l <= m; l++) {
    const N = h * h + k * k + l * l;
    if (N && N <= maxN && cubicAllowed(h, k, l, t)) out.push([h, k, l]);
  }
  return out;
}
const angleCubic = (a: number[], b: number[]) => (Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.sqrt((a[0] ** 2 + a[1] ** 2 + a[2] ** 2) * (b[0] ** 2 + b[1] ** 2 + b[2] ** 2))))) * 180) / Math.PI;

export type SpotSolution = { h1: number[]; h2: number[]; d1: number; d2: number; angle: number; zone: number[]; err: number };
/**
 * Index two spots of a single-crystal pattern on a cubic lattice: spot 1 and 2 at spacings d1, d2 (Å) with angle
 * phi (degrees) between them as seen from the centre. Spot 1 is taken as the standard-order hkl (h ≥ k ≥ l ≥ 0) of its
 * family; every allowed spot 2 within the tolerances is tried. One solution per zone-axis family, best first.
 * err adds the relative d mismatches and the angle mismatch over the angle tolerance.
 */
export function indexSpots(d1: number, d2: number, phi: number, t: Cubic, a: number, dTol = 0.03, angTol = 3, maxN = 60): SpotSolution[] {
  const all = allowedHkl(t, maxN);
  const dOf = (h: number[]) => a / Math.hypot(h[0], h[1], h[2]);
  const c1 = all.filter((h) => h[0] >= h[1] && h[1] >= h[2] && h[2] >= 0 && Math.abs(dOf(h) / d1 - 1) <= dTol);
  const c2 = all.filter((h) => Math.abs(dOf(h) / d2 - 1) <= dTol);
  const best = new Map<string, SpotSolution>();
  for (const h1 of c1) for (const h2 of c2) {
    const ang = angleCubic(h1, h2);
    if (Math.abs(ang - phi) > angTol) continue;
    const z = zoneAxis(h1, h2);
    if (z.every((x) => x === 0)) continue;
    const zz = z.map(Math.abs).sort((x, y) => y - x).join(',');
    const err = Math.abs(dOf(h1) / d1 - 1) / dTol + Math.abs(dOf(h2) / d2 - 1) / dTol + Math.abs(ang - phi) / angTol;
    const key = `${zz}|${Math.abs(h1[0])}${Math.abs(h1[1])}${Math.abs(h1[2])}|${h2.map(Math.abs).sort().join('')}`;
    const prev = best.get(key);
    if (!prev || err < prev.err || (err === prev.err && z.every((x) => x >= 0) && !prev.zone.every((x) => x >= 0))) best.set(key, { h1, h2, d1: dOf(h1), d2: dOf(h2), angle: ang, zone: z, err });
  }
  return [...best.values()].sort((x, y) => x.err - y.err);
}

/** The made-up example: a gold-like FCC standard (a = 4.08 Å) and a BCC sample (a = 2.87 Å) at 200 kV, L = 1000 mm, radii in mm. */
export function exampleRings() {
  const lam = electronWavelength(200), lamL = lam * 1000;
  const wob = [0.004, -0.003, 0.002, -0.004, 0.003, -0.002, 0.003, -0.001];
  const std = [3, 4, 8, 11, 12, 16, 19].map((N, i) => +((lamL * Math.sqrt(N)) / 4.08 * (1 + wob[i])).toFixed(2));
  const smp = [2, 4, 6, 8, 10, 12, 14, 16].map((N, i) => +((lamL * Math.sqrt(N)) / 2.87 * (1 - wob[i])).toFixed(2));
  return { kV: 200, L: 1000, std, smp, stdA: 4.08, spot: { r1: +((lamL * Math.SQRT2) / 2.87).toFixed(2), r2: +((lamL * 2) / 2.87).toFixed(2), phi: 45 } };
}
