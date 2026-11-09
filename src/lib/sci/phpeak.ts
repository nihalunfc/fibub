// Spectrum and histogram peak fitting: Gaussian peaks on a polynomial background in a region of interest, by
// weighted least squares (Poisson weights), simple peak finding, summation (trapezoid) net areas, and an energy
// calibration from channel-energy pairs. No DOM.
import { levenbergMarquardt, fitLine, solveSPD } from './fit.ts';

export const S2PI = Math.sqrt(2 * Math.PI), FWHM = 2 * Math.sqrt(2 * Math.LN2);

/** Spectrum from pasted text: one count per line (channels 0, 1, 2 ...) or two columns x and counts. */
export function readSpectrum(rows: number[][]): { x: number[]; y: number[] } | string {
  const ok = rows.filter((r) => r.length && r.every(Number.isFinite));
  if (ok.length < 10) return 'Paste at least 10 channels: one count per line, or two columns (channel or energy, counts).';
  const two = ok.every((r) => r.length >= 2);
  const x = two ? ok.map((r) => r[0]) : ok.map((_, i) => i), y = two ? ok.map((r) => r[1]) : ok.map((r) => r[0]);
  for (let i = 1; i < x.length; i++) if (!(x[i] > x[i - 1])) return `The first column must increase from row to row (row ${i + 1} does not).`;
  if (y.some((v) => v < 0)) return 'Counts cannot be negative.';
  return { x, y };
}

/** Moving-average smoothing (window 2h + 1). */
export function smooth(y: number[], h: number) {
  const out: number[] = [];
  for (let i = 0; i < y.length; i++) { let s = 0, n = 0; for (let j = Math.max(0, i - h); j <= Math.min(y.length - 1, i + h); j++) { s += y[j]; n++; } out.push(s / n); }
  return out;
}

/**
 * Find peaks in [i0, i1] (indices): local maxima of the smoothed counts that stand at least `k` standard deviations
 * above a straight background drawn between the lowest points a few widths either side. Returns indices, tallest first.
 */
export function findPeaks(y: number[], i0: number, i1: number, opts: { width?: number; k?: number; max?: number } = {}) {
  const w = Math.max(1, Math.round(opts.width ?? 3)), k = opts.k ?? 4, s = smooth(y, Math.max(1, Math.round(w / 2)));
  const found: { i: number; net: number; signif: number }[] = [];
  for (let i = Math.max(i0, 1); i <= Math.min(i1, y.length - 2); i++) {
    if (!(s[i] >= s[i - 1] && s[i] > s[i + 1])) continue;
    const L = Math.max(0, i - 4 * w), R = Math.min(y.length - 1, i + 4 * w);
    let li = L, ri = R;
    for (let j = L; j < i; j++) if (s[j] < s[li]) li = j;
    for (let j = i + 1; j <= R; j++) if (s[j] < s[ri]) ri = j;
    const bg = ri > li ? s[li] + ((s[ri] - s[li]) * (i - li)) / (ri - li) : s[li];
    const net = s[i] - bg, signif = net / Math.sqrt(Math.max(bg, 1) / (2 * Math.max(1, Math.round(w / 2)) + 1) + Math.max(s[i], 1) / (2 * Math.max(1, Math.round(w / 2)) + 1));
    if (signif >= k && net > 0) found.push({ i, net, signif });
  }
  // Keep the strongest within ±w of each other.
  found.sort((a, b) => b.net - a.net);
  const keep: typeof found = [];
  for (const f of found) if (!keep.some((g) => Math.abs(g.i - f.i) <= w)) keep.push(f);
  return keep.slice(0, opts.max ?? 12);
}

export type PeakFit = {
  ok: true; bgOrder: number; p: number[]; se: number[]; cov: number[][]; chi2: number; df: number; redChi2: number; iterations: number; converged: boolean;
  peaks: { mu: number; muSe: number; sigma: number; sigmaSe: number; fwhm: number; fwhmSe: number; height: number; area: number; areaSe: number }[];
  model: (x: number) => number; background: (x: number) => number; x: number[]; y: number[];
};

/** Fit Gaussian peaks (starting centroids mus, in x units) plus a background polynomial of order 0, 1 or 2 over x[i0..i1]. */
export function fitPeaks(X: number[], Y: number[], i0: number, i1: number, mus: number[], bgOrder: 0 | 1 | 2, sigma0?: number): PeakFit | { ok: false; error: string } {
  const x = X.slice(i0, i1 + 1), y = Y.slice(i0, i1 + 1), n = x.length, m = bgOrder + 1 + 3 * mus.length;
  if (!mus.length) return { ok: false, error: 'Give at least one peak position (or press Find peaks).' };
  if (n <= m + 2) return { ok: false, error: `The region has ${n} channels: too few for ${mus.length} peak${mus.length > 1 ? 's' : ''} and the background. Widen it.` };
  const dx = (x[n - 1] - x[0]) / (n - 1), xc = (x[0] + x[n - 1]) / 2;
  // Starting background: straight line through the averages of a few channels at each end.
  const e = Math.max(1, Math.min(5, Math.floor(n / 10)));
  const yl = y.slice(0, e).reduce((a, b) => a + b, 0) / e, yr = y.slice(n - e).reduce((a, b) => a + b, 0) / e, xl = x.slice(0, e).reduce((a, b) => a + b, 0) / e, xr = x.slice(n - e).reduce((a, b) => a + b, 0) / e;
  const b1 = (yr - yl) / (xr - xl || 1), b0 = yl + b1 * (xc - xl);
  const bgStart = [b0, b1, 0].slice(0, bgOrder + 1);
  const p0: number[] = [...bgStart];
  for (const mu of mus) {
    const j = x.reduce((bi, xi, k) => (Math.abs(xi - mu) < Math.abs(x[bi] - mu) ? k : bi), 0);
    const bgj = b0 + (bgOrder ? b1 * (x[j] - xc) : 0), h = Math.max(y[j] - bgj, 1);
    let sg = sigma0 ?? 0;
    if (!sg) { // half-maximum search
      let l = j, r = j; while (l > 0 && y[l] - bgj > h / 2) l--; while (r < n - 1 && y[r] - bgj > h / 2) r++;
      sg = Math.max(dx, ((x[r] - x[l]) / FWHM) || dx * 2);
      sg = Math.min(sg, (x[n - 1] - x[0]) / 4);
    }
    p0.push(h, mu, sg);
  }
  const nb = bgOrder + 1;
  const bg = (xx: number, p: number[]) => { const t = xx - xc; return p[0] + (nb > 1 ? p[1] * t : 0) + (nb > 2 ? p[2] * t * t : 0); };
  const f = (xx: number, p: number[]) => { let v = bg(xx, p); for (let k = nb; k < p.length; k += 3) { const z = (xx - p[k + 1]) / p[k + 2]; v += p[k] * Math.exp(-0.5 * z * z); } return v; };
  const w = y.map((v) => 1 / Math.max(v, 1));
  let r;
  try { r = levenbergMarquardt(f, x, y, p0, { w, maxIter: 400 }); } catch (err) { return { ok: false, error: (err as Error).message }; }
  // Unscaled (Poisson) covariance: (JᵀWJ)⁻¹ = cov / s².
  const s2 = r.s * r.s, cov = r.cov.map((row) => row.map((v) => v / s2)), se = cov.map((row, i) => Math.sqrt(row[i]));
  const peaks = [];
  for (let k = nb; k < r.p.length; k += 3) {
    const A = r.p[k], mu = r.p[k + 1], sg = Math.abs(r.p[k + 2]);
    const area = (A * sg * S2PI) / dx;
    const dA = (sg * S2PI) / dx, dS = (A * S2PI) / dx;
    const vArea = dA * dA * cov[k][k] + dS * dS * cov[k + 2][k + 2] + 2 * dA * dS * cov[k][k + 2] * Math.sign(r.p[k + 2]);
    peaks.push({ mu, muSe: se[k + 1], sigma: sg, sigmaSe: se[k + 2], fwhm: sg * FWHM, fwhmSe: se[k + 2] * FWHM, height: A, area, areaSe: Math.sqrt(Math.max(0, vArea)) });
  }
  return { ok: true, bgOrder, p: r.p, se, cov, chi2: r.sse, df: r.df, redChi2: r.sse / r.df, iterations: r.iterations, converged: r.converged, peaks, model: (xx) => f(xx, r.p), background: (xx) => bg(xx, r.p), x, y };
}

/** Summation net area over [i0, i1]: gross counts minus a trapezoid background from the mean of `e` channels at each end. */
export function sumArea(y: number[], i0: number, i1: number, e = 3) {
  const n = i1 - i0 + 1, gross = y.slice(i0, i1 + 1).reduce((a, b) => a + b, 0);
  const L = y.slice(i0, i0 + e).reduce((a, b) => a + b, 0), R = y.slice(i1 - e + 1, i1 + 1).reduce((a, b) => a + b, 0);
  const B = (n * (L + R)) / (2 * e), net = gross - B, se = Math.sqrt(gross + (n / (2 * e)) ** 2 * (L + R));
  return { gross, background: B, net, se };
}

/** Energy calibration E = a + b·ch (+ c·ch²) by least squares from pairs. */
export function calibrate(pairs: [number, number][], order: 1 | 2) {
  if (pairs.length < order + 1) return null;
  if (order === 1) { const l = fitLine(pairs.map((p) => p[0]), pairs.map((p) => p[1])); return { c: [l.intercept, l.slope], f: (ch: number) => l.intercept + l.slope * ch, d: (_ch: number) => l.slope }; }
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], b = [0, 0, 0];
  for (const [ch, E] of pairs) { const v = [1, ch, ch * ch]; for (let i = 0; i < 3; i++) { b[i] += v[i] * E; for (let j = 0; j < 3; j++) A[i][j] += v[i] * v[j]; } }
  const c = solveSPD(A, b); if (!c) return null;
  return { c, f: (ch: number) => c[0] + c[1] * ch + c[2] * ch * ch, d: (ch: number) => c[1] + 2 * c[2] * ch };
}

/** A made-up spectrum: falling continuum plus four Gaussian peaks (one a close doublet), with Poisson noise from a fixed seed. */
export function exampleSpectrum(): number[] {
  let a = 20261109 >>> 0;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pois = (mu: number) => { if (mu < 30) { let L = Math.exp(-mu), k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; } const u = rnd() || 1e-12, v = rnd(); return Math.max(0, Math.round(mu + Math.sqrt(mu) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v))); };
  const peaks = [[180, 4, 900], [410, 5.5, 300], [425, 5.5, 200], [700, 7, 150]];
  const out: number[] = [];
  for (let i = 0; i < 1024; i++) { let mu = 400 * Math.exp(-i / 250) + 20; for (const [c, s, h] of peaks) mu += h * Math.exp(-0.5 * ((i - c) / s) ** 2); out.push(pois(mu)); }
  return out;
}
