// X-ray powder diffraction maths: Bragg's law, Scherrer crystallite size, the Williamson-Hall plot, cubic
// indexing from 1/d² ratios (simple, body-centred, face-centred and diamond cubic), and peak picking from a
// 2θ/intensity scan. Plain TypeScript with no DOM; checked against NumPy/SciPy in tests/sci-tools.

import { levenbergMarquardt } from './fit.ts';

const RAD = Math.PI / 180;

/** Common anode lines in ångström (rounded general constants; editable on the page). */
export const ANODES: { id: string; name: string; l: number }[] = [
  { id: 'cu1', name: 'Cu Kα1', l: 1.5406 },
  { id: 'cu', name: 'Cu Kα (weighted Kα1, Kα2)', l: 1.5419 },
  { id: 'co1', name: 'Co Kα1', l: 1.78897 },
  { id: 'fe1', name: 'Fe Kα1', l: 1.93604 },
  { id: 'cr1', name: 'Cr Kα1', l: 2.2897 },
  { id: 'mo1', name: 'Mo Kα1', l: 0.70932 },
  { id: 'ag1', name: 'Ag Kα1', l: 0.55941 },
];

/** Bragg's law: d (same unit as λ) from 2θ in degrees and reflection order n. */
export const dFromTwoTheta = (tt: number, lambda: number, n = 1) => (n * lambda) / (2 * Math.sin((tt / 2) * RAD));
/** 2θ in degrees for spacing d; NaN when the reflection cannot be reached (λ > 2d). */
export function twoThetaFromD(d: number, lambda: number, n = 1): number {
  const s = (n * lambda) / (2 * d);
  return s > 0 && s <= 1 ? (2 * Math.asin(s)) / RAD : NaN;
}

export type Broadening = 'gauss' | 'lorentz';
/** Sample broadening (degrees) after taking away the instrument's: quadratic for Gaussian peaks, straight for Lorentzian. NaN if not wider than the instrument. */
export function sampleBreadth(obsDeg: number, instDeg: number, mode: Broadening = 'gauss'): number {
  if (!(obsDeg > 0)) return NaN;
  if (!(instDeg > 0)) return obsDeg;
  const b = mode === 'gauss' ? Math.sqrt(obsDeg * obsDeg - instDeg * instDeg) : obsDeg - instDeg;
  return b > 0 ? b : NaN;
}
/** Scherrer equation: crystallite size (unit of λ) from the sample breadth β (degrees, 2θ scale) at 2θ. */
export const scherrer = (tt: number, betaDeg: number, lambda: number, K = 0.9) => (K * lambda) / (betaDeg * RAD * Math.cos((tt / 2) * RAD));

export type WHResult = { n: number; slope: number; intercept: number; seSlope: number; seIntercept: number; r2: number; size: number; strain: number; x: number[]; y: number[] };
/**
 * Williamson-Hall: β cos θ = Kλ/D + 4ε sin θ. Fits y = β cos θ (radians) against x = 4 sin θ by least squares.
 * size D = Kλ/intercept (NaN if the intercept is not positive), strain ε = slope.
 */
export function williamsonHall(peaks: { tt: number; beta: number }[], lambda: number, K = 0.9): WHResult | null {
  const p = peaks.filter((q) => Number.isFinite(q.tt) && q.beta > 0);
  if (p.length < 2) return null;
  const x = p.map((q) => 4 * Math.sin((q.tt / 2) * RAD)), y = p.map((q) => q.beta * RAD * Math.cos((q.tt / 2) * RAD));
  const n = p.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); syy += (y[i] - my) ** 2; }
  if (!(sxx > 0)) return null;
  const slope = sxy / sxx, intercept = my - slope * mx;
  const sse = y.reduce((s, yi, i) => s + (yi - intercept - slope * x[i]) ** 2, 0);
  const s2 = n > 2 ? sse / (n - 2) : NaN;
  const seSlope = Math.sqrt(s2 / sxx), seIntercept = Math.sqrt(s2 * (1 / n + (mx * mx) / sxx));
  const r2 = syy > 0 ? 1 - sse / syy : 1;
  return { n, slope, intercept, seSlope, seIntercept, r2, size: intercept > 0 ? (K * lambda) / intercept : NaN, strain: slope, x, y };
}

// ---------- Cubic indexing ----------
export type Cubic = 'sc' | 'bcc' | 'fcc' | 'diamond';
export const CUBIC_NAMES: Record<Cubic, string> = { sc: 'Simple cubic', bcc: 'Body-centred cubic', fcc: 'Face-centred cubic', diamond: 'Diamond cubic' };
/** Most restrictive first: used to break ties when two lattices index every line with no missing lines. */
export const CUBIC_ORDER: Cubic[] = ['diamond', 'fcc', 'bcc', 'sc'];

/** Whether reflection hkl is allowed (not systematically absent) for the lattice. */
export function cubicAllowed(h: number, k: number, l: number, t: Cubic): boolean {
  if (!h && !k && !l) return false;
  const par = [h, k, l].map((v) => Math.abs(v) % 2);
  if (t === 'sc') return true;
  if (t === 'bcc') return (h + k + l) % 2 === 0;
  const same = par[0] === par[1] && par[1] === par[2];
  if (t === 'fcc') return same;
  return same && (par[0] === 1 || (((h + k + l) % 4) + 4) % 4 === 0);
}

/** Allowed N = h² + k² + l² up to maxN, each with its hkl (h ≥ k ≥ l ≥ 0), in rising N. */
export function cubicLines(t: Cubic, maxN: number): { N: number; hkl: string[] }[] {
  const m = new Map<number, string[]>();
  const top = Math.floor(Math.sqrt(maxN));
  for (let h = 0; h <= top; h++) for (let k = 0; k <= h; k++) for (let l = 0; l <= k; l++) {
    const N = h * h + k * k + l * l;
    if (N === 0 || N > maxN || !cubicAllowed(h, k, l, t)) continue;
    const s = `${h}${k}${l}`.length === 3 && h < 10 ? `${h}${k}${l}` : `${h} ${k} ${l}`;
    if (!m.has(N)) m.set(N, []);
    m.get(N)!.push(s);
  }
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([N, hkl]) => ({ N, hkl: hkl.reverse() }));
}

export type CubicLine = { N: number | null; hkl: string; err: number };
export type CubicFit = {
  lattice: Cubic; shift: number; A: number; a: number; aSd: number; lines: CubicLine[];
  unindexed: number; missing: number[]; rms: number;
};

/**
 * Index lines on a cubic lattice from values s proportional to 1/d² (1/d² itself, sin²θ, or a ring radius squared).
 * The first line is tried as each of the first few allowed reflections (`maxShift`); lines whose √s is within the
 * relative tolerance `tol` of an allowed √N are indexed. `sMin` is the smallest s the measurement could have seen,
 * so lower allowed lines that were not seen count as missing. a = 1/√A when s is 1/d².
 */
export function indexCubic(sIn: number[], t: Cubic, tol = 0.005, sMin = 0, maxShift = 3): CubicFit | null {
  const s = sIn.filter((v) => v > 0).sort((a, b) => a - b);
  if (!s.length) return null;
  const maxN = 4 * Math.ceil((s[s.length - 1] / s[0]) * 30) + 40;
  const list = cubicLines(t, maxN);
  let best: CubicFit | null = null;
  const key = (f: CubicFit) => [f.unindexed, f.missing.length, f.shift];
  for (let m = 0; m <= maxShift && m < list.length; m++) {
    let A = s[0] / list[m].N;
    let lines: CubicLine[] = [];
    for (let pass = 0; pass < 3; pass++) {
      lines = s.map((v) => {
        const nObs = v / A;
        let bestL = list[0], bd = Infinity;
        for (const L of list) { const d = Math.abs(Math.sqrt(L.N) - Math.sqrt(nObs)); if (d < bd) { bd = d; bestL = L; } if (L.N > nObs * 1.5 + 4) break; }
        const err = Math.sqrt(nObs / bestL.N) - 1;
        return Math.abs(err) <= tol ? { N: bestL.N, hkl: bestL.hkl.join(', '), err } : { N: null, hkl: '', err };
      });
      const ok = lines.map((L, i) => [L, s[i]] as const).filter(([L]) => L.N !== null);
      if (!ok.length) break;
      const sn = ok.reduce((a, [L, v]) => a + v * L.N!, 0), nn = ok.reduce((a, [L]) => a + L.N! * L.N!, 0);
      A = sn / nn;
    }
    lines = lines.map((L, i) => (L.N === null ? L : { ...L, err: Math.sqrt(s[i] / A / L.N) - 1 }));
    const used = new Set(lines.filter((L) => L.N !== null).map((L) => L.N));
    const last = s[s.length - 1] / A;
    const missing = list.filter((L) => L.N <= last * (1 + tol) && A * L.N >= sMin && !used.has(L.N)).map((L) => L.N);
    const idx = lines.filter((L) => L.N !== null);
    const per = s.map((v, i) => (lines[i].N !== null ? Math.sqrt(lines[i].N! / v) : NaN)).filter(Number.isFinite);
    const aMean = per.reduce((a, b) => a + b, 0) / (per.length || 1);
    const aSd = per.length > 1 ? Math.sqrt(per.reduce((a, b) => a + (b - aMean) ** 2, 0) / (per.length - 1)) : NaN;
    const rms = idx.length ? Math.sqrt(idx.reduce((a, L) => a + L.err * L.err, 0) / idx.length) : NaN;
    const fit: CubicFit = { lattice: t, shift: m, A, a: 1 / Math.sqrt(A), aSd, lines, unindexed: lines.length - idx.length, missing, rms };
    if (!best || cmp(key(fit), key(best)) < 0) best = fit;
  }
  return best;
}
const cmp = (a: number[], b: number[]) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };

/** All four cubic lattices tried and ranked: fewest unindexed lines, then fewest missing lines, then most restrictive. */
export function rankCubic(s: number[], tol = 0.005, sMin = 0): CubicFit[] {
  const fits = CUBIC_ORDER.map((t) => indexCubic(s, t, tol, sMin)).filter((f): f is CubicFit => !!f);
  return fits.sort((a, b) => a.unindexed - b.unindexed || a.missing.length - b.missing.length || CUBIC_ORDER.indexOf(a.lattice) - CUBIC_ORDER.indexOf(b.lattice));
}

// ---------- Peak picking ----------
export type Shape = 'gauss' | 'lorentz';
export type Peak = { tt: number; height: number; fwhm: number; area: number; fitted: boolean };

function runMin(y: number[], h: number) { return y.map((_, i) => { let m = Infinity; for (let j = Math.max(0, i - h); j <= Math.min(y.length - 1, i + h); j++) if (y[j] < m) m = y[j]; return m; }); }
function runMax(y: number[], h: number) { return y.map((_, i) => { let m = -Infinity; for (let j = Math.max(0, i - h); j <= Math.min(y.length - 1, i + h); j++) if (y[j] > m) m = y[j]; return m; }); }
function runMean(y: number[], h: number) { return y.map((_, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - h); j <= Math.min(y.length - 1, i + h); j++) { s += y[j]; n++; } return s / n; }); }
const stepOf = (x: number[]) => (x[x.length - 1] - x[0]) / Math.max(1, x.length - 1);

/** Smooth background under a scan: a rolling minimum, then a rolling maximum of that (it stays under the peaks), then a rolling mean. `width` is in 2θ degrees. */
export function background(x: number[], y: number[], width: number): number[] {
  const h = Math.max(1, Math.round(width / stepOf(x) / 2));
  return runMean(runMax(runMin(y, h), h), h);
}

/** Peak profile of height 1 and full width at half maximum w, centred on c. */
export const profileShape = (shape: Shape, x: number, c: number, w: number) => {
  const u = (x - c) / w;
  return shape === 'gauss' ? Math.exp(-4 * Math.LN2 * u * u) : 1 / (1 + 4 * u * u);
};
/** Area of a peak of this height and FWHM. */
export const peakArea = (shape: Shape, height: number, fwhm: number) => (shape === 'gauss' ? height * fwhm * Math.sqrt(Math.PI / (4 * Math.LN2)) : (Math.PI / 2) * height * fwhm);

/**
 * Peaks in a scan. The background is taken away and the rest lightly smoothed (`smooth`, degrees either side) to
 * find local maxima whose prominence is at least `minFrac` of the tallest. Each peak is then fitted, on the
 * unsmoothed data within 1.5 widths either side, with a Gaussian or Lorentzian plus a straight line
 * (Levenberg-Marquardt), which gives the position, height, FWHM and area. If a fit fails, the half-height
 * crossings of the smoothed data are used instead (`fitted: false`).
 */
export function findPeaks(x: number[], y: number[], opts: { bgWidth?: number; minFrac?: number; smooth?: number; shape?: Shape; max?: number } = {}): { peaks: Peak[]; bg: number[] } {
  const n = x.length, shape = opts.shape ?? 'gauss';
  if (n < 7) return { peaks: [], bg: y.slice() };
  const step = stepOf(x);
  const bg = background(x, y, opts.bgWidth ?? 3);
  const raw = y.map((v, i) => v - bg[i]);
  const r = runMean(raw, Math.max(1, Math.round((opts.smooth ?? 0.04) / step)));
  const top = Math.max(...r), thr = (opts.minFrac ?? 0.03) * top;
  const cand: { i: number; prom: number }[] = [];
  for (let i = 1; i < n - 1; i++) {
    if (!(r[i] > r[i - 1] && r[i] >= r[i + 1])) continue;
    let lm = r[i], j = i - 1; while (j >= 0 && r[j] <= r[i]) { if (r[j] < lm) lm = r[j]; j--; }
    let rm = r[i], k = i + 1; while (k < n && r[k] <= r[i]) { if (r[k] < rm) rm = r[k]; k++; }
    const prom = r[i] - Math.max(j < 0 ? -Infinity : lm, k >= n ? -Infinity : rm);
    const p = Number.isFinite(prom) ? prom : r[i] - Math.min(lm, rm);
    if (p >= thr && r[i] >= thr) cand.push({ i, prom: p });
  }
  const pick = cand.sort((a, b) => b.prom - a.prom).slice(0, opts.max ?? 60).sort((a, b) => a.i - b.i);
  const peaks: Peak[] = [];
  for (const { i } of pick) {
    const h0 = r[i], half = h0 / 2;
    let a = i; while (a > 0 && r[a] > half) a--;
    let b = i; while (b < n - 1 && r[b] > half) b++;
    const xl = r[a] <= half ? x[a] + ((half - r[a]) / (r[a + 1] - r[a])) * (x[a + 1] - x[a]) : x[a];
    const xr = r[b] <= half ? x[b - 1] + ((r[b - 1] - half) / (r[b - 1] - r[b])) * (x[b] - x[b - 1]) : x[b];
    const w0 = Math.max(2 * step, xr - xl);
    let pk: Peak = { tt: x[i], height: h0, fwhm: w0, area: peakArea(shape, h0, w0), fitted: false };
    const lo = x[i] - 1.5 * w0, hi = x[i] + 1.5 * w0;
    const xs: number[] = [], ys: number[] = [];
    for (let j = 0; j < n; j++) if (x[j] >= lo && x[j] <= hi) { xs.push(x[j]); ys.push(raw[j]); }
    if (xs.length >= 8) {
      try {
        const c0 = x[i];
        const f = (t: number, p: number[]) => p[0] * profileShape(shape, t, p[1], Math.abs(p[2])) + p[3] + p[4] * (t - c0);
        const fit = levenbergMarquardt(f, xs, ys, [h0, x[i], w0, 0, 0], { maxIter: 200 });
        const [A, c, w] = fit.p, wa = Math.abs(w);
        if (A > 0 && wa > step && wa < 4 * w0 && Math.abs(c - x[i]) < w0) pk = { tt: c, height: A, fwhm: wa, area: peakArea(shape, A, wa), fitted: true };
      } catch { /* keep the half-height estimate */ }
    }
    peaks.push(pk);
  }
  return { peaks, bg };
}

// ---------- Made-up example ----------
/**
 * A made-up Cu Kα1 pattern of a face-centred cubic metal with a = 4.000 Å, crystallites of 25 nm and 0.2 % strain,
 * Gaussian peaks broadened by size + strain (added) and then by a 0.06° instrument (in quadrature), on a falling
 * background with a little counting noise. Relative intensities are made up.
 */
export const EXAMPLE = { a: 4.0, lambda: 1.5406, size: 250, strain: 0.002, K: 0.9, inst: 0.06, from: 20, to: 110, step: 0.02 };
export function examplePattern(): { x: number[]; y: number[]; truth: { tt: number; fwhm: number; N: number }[] } {
  const E = EXAMPLE, inten: Record<number, number> = { 3: 100, 4: 47, 8: 22, 11: 24, 12: 7, 16: 3, 19: 8, 20: 7 };
  const truth = cubicLines('fcc', 20).map((L) => {
    const tt = twoThetaFromD(E.a / Math.sqrt(L.N), E.lambda), th = (tt / 2) * RAD;
    const bs = ((E.K * E.lambda) / (E.size * Math.cos(th)) + 4 * E.strain * Math.tan(th)) / RAD;
    return { tt, fwhm: Math.sqrt(bs * bs + E.inst * E.inst), N: L.N };
  }).filter((p) => p.tt < E.to - 1);
  let seed = 11; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const gauss = () => { const u = Math.max(1e-12, rnd()), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const x: number[] = [], y: number[] = [];
  for (let t = E.from; t <= E.to + 1e-9; t += E.step) {
    const tt = Math.round(t * 1000) / 1000;
    let v = 40 + 2400 / tt;
    for (const p of truth) { const sd = p.fwhm / 2.354820045; v += 50 * inten[p.N] * Math.exp(-0.5 * ((tt - p.tt) / sd) ** 2); }
    x.push(tt); y.push(Math.max(0, Math.round(v + Math.sqrt(v) * gauss())));
  }
  return { x, y, truth };
}
