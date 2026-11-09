// Tauc plot: optical band gap from an absorption spectrum. The spectrum (absorbance, transmittance, α itself, or
// diffuse reflectance through the Kubelka-Munk function) becomes α(hν); (αhν)^n is drawn against hν for the
// transition type (n = 2 direct allowed, ½ indirect allowed, ⅔ direct forbidden, ⅓ indirect forbidden), a straight
// line is fitted to the steep linear part, and the gap is where it meets zero (or a sub-gap baseline). The Urbach
// energy comes from the slope of ln α below the gap.
import { fitLine, type LineFit } from './fit.ts';

export const HC = 1239.8419843320026; // eV·nm (h c / e)

export type XUnit = 'nm' | 'ev' | 'cm1';
export type YKind = 'abs' | 'tpct' | 'tfrac' | 'rpct' | 'rfrac' | 'alpha';
export type Transition = 'da' | 'ia' | 'df' | 'if';
export const EXPONENT: Record<Transition, number> = { da: 2, ia: 0.5, df: 2 / 3, if: 1 / 3 };

export const toEv = (x: number, u: XUnit) => (u === 'ev' ? x : u === 'nm' ? HC / x : (x * HC) / 1e7);

/** Kubelka-Munk remission function F(R) = (1 − R)² / 2R for a diffuse reflectance R between 0 and 1. */
export const kubelkaMunk = (R: number) => ((1 - R) ** 2) / (2 * R);

/**
 * Absorption coefficient α (cm⁻¹) from a reading. With a thickness d (nm) absorbance gives α = ln(10)·A/d and
 * transmittance α = −ln(T)/d (no reflection correction); without d both are in relative units (per unit
 * thickness). Reflectance gives F(R), which is proportional to α when scattering does not change with energy.
 */
export function alphaOf(y: number, kind: YKind, dNm?: number): number {
  const per = dNm && dNm > 0 ? 1 / (dNm * 1e-7) : 1;
  switch (kind) {
    case 'abs': return Math.LN10 * y * per;
    case 'tpct': return y > 0 ? -Math.log(y / 100) * per : NaN;
    case 'tfrac': return y > 0 ? -Math.log(y) * per : NaN;
    case 'rpct': return y > 0 && y <= 100 ? kubelkaMunk(y / 100) : NaN;
    case 'rfrac': return y > 0 && y <= 1 ? kubelkaMunk(y) : NaN;
    default: return y;
  }
}

export type Spectrum = { E: number[]; alpha: number[] };
/** Spectrum sorted by photon energy, points with no usable α dropped. */
export function toSpectrum(x: number[], y: number[], u: XUnit, kind: YKind, dNm?: number): Spectrum {
  const pts = x.map((xi, i) => [toEv(xi, u), alphaOf(y[i], kind, dNm)]).filter(([E, a]) => Number.isFinite(E) && E > 0 && Number.isFinite(a));
  pts.sort((a, b) => a[0] - b[0]);
  return { E: pts.map((p) => p[0]), alpha: pts.map((p) => p[1]) };
}

/** Tauc ordinate (αhν)^n; negative α (noise below the edge) gives 0. */
export const taucY = (s: Spectrum, n: number) => s.alpha.map((a, i) => (a > 0 ? (a * s.E[i]) ** n : 0));

export type GapFit = {
  Eg: number; se: number; fit: LineFit; i0: number; i1: number;
  baseline?: LineFit;
};

/** x-intercept of y = a + bx and its standard error by the delta method (from the fit covariance). */
export function intercept(f: LineFit): { x: number; se: number } {
  const x = -f.intercept / f.slope;
  const v = (f.seIntercept ** 2 + x * x * f.seSlope ** 2 + 2 * x * f.covAB) / (f.slope * f.slope);
  return { x, se: Math.sqrt(Math.max(v, 0)) };
}

/** Where two lines cross, with the standard error from both fits (independent data, delta method). */
export function crossing(f: LineFit, g: LineFit): { x: number; se: number } {
  const db = f.slope - g.slope, x = (g.intercept - f.intercept) / db;
  // ∂x/∂a_f = −1/db, ∂x/∂b_f = −x/db, ∂x/∂a_g = 1/db, ∂x/∂b_g = x/db.
  const vf = f.seIntercept ** 2 + x * x * f.seSlope ** 2 + 2 * x * f.covAB;
  const vg = g.seIntercept ** 2 + x * x * g.seSlope ** 2 + 2 * x * g.covAB;
  return { x, se: Math.sqrt(Math.max(vf + vg, 0)) / Math.abs(db) };
}

const fitRange = (x: number[], y: number[], i0: number, i1: number) => fitLine(x.slice(i0, i1 + 1), y.slice(i0, i1 + 1));

/**
 * Automatic linear region: among all windows of k consecutive points, take the steepest one that is straight
 * (R² ≥ r2min). Then grow it one point at a time, on whichever side the next point lies closer to the current
 * line, as long as that point is within `sdLimit` residual standard deviations of the line.
 */
export function autoWindow(x: number[], y: number[], r2min = 0.99, k = Math.max(5, Math.round(x.length / 25)), sdLimit = 3): [number, number] | null {
  const n = x.length;
  if (n < 5) return null;
  k = Math.min(k, n);
  let best = -Infinity, bi = -1;
  for (let i = 0; i + k <= n; i++) {
    const f = fitRange(x, y, i, i + k - 1);
    if (f.r2 >= r2min && f.slope > best) { best = f.slope; bi = i; }
  }
  if (bi < 0 || !(best > 0)) return null;
  let i0 = bi, i1 = bi + k - 1;
  const span = Math.max(...y) - Math.min(...y) || 1;
  for (;;) {
    const f = fitRange(x, y, i0, i1), s = Math.max(f.syx, 1e-9 * span);
    const off = (j: number) => Math.abs(y[j] - (f.intercept + f.slope * x[j])) / s;
    const l = i0 > 0 ? off(i0 - 1) : Infinity, r = i1 < n - 1 ? off(i1 + 1) : Infinity;
    if (Math.min(l, r) > sdLimit) break;
    if (l <= r) i0--; else i1++;
  }
  return [i0, i1];
}

/** Indices of the points with E in [lo, hi]. */
export function rangeIdx(E: number[], lo: number, hi: number): [number, number] | null {
  let i0 = -1, i1 = -1;
  for (let i = 0; i < E.length; i++) if (E[i] >= lo && E[i] <= hi) { if (i0 < 0) i0 = i; i1 = i; }
  return i0 >= 0 && i1 - i0 >= 2 ? [i0, i1] : null;
}

/** Fit the Tauc line over [i0, i1] and find the gap (x-intercept, or the crossing with a baseline fit). */
export function gapFit(E: number[], y: number[], i0: number, i1: number, base?: [number, number] | null): GapFit {
  const fit = fitRange(E, y, i0, i1);
  if (base) {
    const b = fitRange(E, y, base[0], base[1]);
    const c = crossing(fit, b);
    return { Eg: c.x, se: c.se, fit, i0, i1, baseline: b };
  }
  const c = intercept(fit);
  return { Eg: c.x, se: c.se, fit, i0, i1 };
}

export type UrbachFit = { Eu: number; se: number; fit: LineFit; i0: number; i1: number };
/** Urbach energy from ln α = const + E/Eu over [i0, i1] (α > 0 only). */
export function urbachFit(E: number[], alpha: number[], i0: number, i1: number): UrbachFit | null {
  const xs: number[] = [], ys: number[] = [];
  for (let i = i0; i <= i1; i++) if (alpha[i] > 0) { xs.push(E[i]); ys.push(Math.log(alpha[i])); }
  if (xs.length < 3) return null;
  const fit = fitLine(xs, ys);
  if (!(fit.slope > 0)) return null;
  return { Eu: 1 / fit.slope, se: fit.seSlope / (fit.slope * fit.slope), fit, i0, i1 };
}

/**
 * Automatic Urbach range: the straightest steep stretch of ln α below the gap. Windows of k points whose upper
 * end is below Eg; the steepest with R² ≥ r2min wins, then it grows while R² stays above r2min and E < Eg.
 */
export function autoUrbach(E: number[], alpha: number[], Eg: number, r2min = 0.99, k = Math.max(5, Math.round(E.length / 30)), sdLimit = 3): [number, number] | null {
  const idx: number[] = [];
  for (let i = 0; i < E.length; i++) if (E[i] < Eg && alpha[i] > 0) idx.push(i);
  if (idx.length < 5) return null;
  const x = idx.map((i) => E[i]), y = idx.map((i) => Math.log(alpha[i]));
  const w = autoWindow(x, y, r2min, Math.min(k, x.length), sdLimit);
  return w ? [idx[w[0]], idx[w[1]]] : null;
}

/** A made-up film with a direct gap of 2.40 eV, an Urbach tail of 50 meV, 400 nm thick, read as absorbance. */
export const EXAMPLE = { Eg: 2.4, Eu: 0.05, dNm: 400, C: 1.2e5 };
export function exampleAlpha(E: number, Eg = EXAMPLE.Eg, Eu = EXAMPLE.Eu, C = EXAMPLE.C, kind: 'direct' | 'indirect' = 'direct'): number {
  // Above Et = Eg + Eu/2 (direct) the band-to-band law; below it an exponential tail that joins it smoothly.
  if (kind === 'indirect') { const Et = Eg + 2 * Eu; const f = (e: number) => (C * (e - Eg) ** 2) / e; return E >= Et ? f(E) : f(Et) * Math.exp((E - Et) / Eu); }
  const Et = Eg + Eu / 2; const f = (e: number) => (C * Math.sqrt(e - Eg)) / e;
  return E >= Et ? f(E) : f(Et) * Math.exp((E - Et) / Eu);
}
/** The example spectrum: wavelength (nm) and absorbance, with a little made-up noise (fixed seed). */
export function exampleSpectrum(): { nm: number[]; A: number[] } {
  let s = 12345; const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648) - 0.5;
  const nm: number[] = [], A: number[] = [];
  for (let l = 700; l >= 400; l -= 1) {
    const a = exampleAlpha(HC / l);
    nm.push(l); A.push(+((a * EXAMPLE.dNm * 1e-7) / Math.LN10 + 0.0015 * rnd() + 0.002).toFixed(4));
  }
  return { nm: nm.reverse(), A: A.reverse() };
}

/**
 * How much the gap moves with the window: refit with each end moved in and out by about 10 % of the window
 * (at least one point), and give the lowest and highest gap found. Usually larger than the fit's own error.
 */
export function windowSpread(E: number[], y: number[], i0: number, i1: number, base?: [number, number] | null): { lo: number; hi: number } {
  const d = Math.max(1, Math.round(0.1 * (i1 - i0 + 1)));
  const gs: number[] = [];
  for (const [a, b] of [[i0 + d, i1], [i0 - d, i1], [i0, i1 - d], [i0, i1 + d]]) {
    if (a < 0 || b > E.length - 1 || b - a < 2) continue;
    const g = gapFit(E, y, a, b, base).Eg;
    if (Number.isFinite(g)) gs.push(g);
  }
  return gs.length ? { lo: Math.min(...gs), hi: Math.max(...gs) } : { lo: NaN, hi: NaN };
}
