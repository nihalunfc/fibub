// Spectrometer wavelength calibration: a brightness profile from a photo of a spectrum, peak finding with
// sub-pixel positions, matching peaks to known emission lines, and a polynomial pixel-to-wavelength fit.
// Plain maths on pixel arrays, no DOM.

export type Line = { nm: number; name: string };
/** Well-known emission lines, rounded to 0.1 nm (general spectroscopy facts). Phosphor lines are approximate band peaks. */
export const LINE_SETS: Record<string, { name: string; lines: Line[] }> = {
  cfl: { name: 'Fluorescent lamp (mercury + phosphor)', lines: [
    { nm: 404.7, name: 'Hg 404.7' }, { nm: 435.8, name: 'Hg 435.8' }, { nm: 487.7, name: 'Tb phosphor ≈487.7' }, { nm: 542.4, name: 'Tb phosphor ≈542.4' },
    { nm: 546.1, name: 'Hg 546.1' }, { nm: 577.0, name: 'Hg 577.0' }, { nm: 579.1, name: 'Hg 579.1' }, { nm: 611.6, name: 'Eu phosphor ≈611.6' }] },
  hg: { name: 'Mercury lamp', lines: [{ nm: 404.7, name: 'Hg 404.7' }, { nm: 435.8, name: 'Hg 435.8' }, { nm: 546.1, name: 'Hg 546.1' }, { nm: 577.0, name: 'Hg 577.0' }, { nm: 579.1, name: 'Hg 579.1' }] },
  ne: { name: 'Neon lamp (brightest lines)', lines: [585.2, 588.2, 594.5, 607.4, 614.3, 616.4, 621.7, 626.6, 633.4, 638.3, 640.2, 650.7, 659.9, 692.9, 703.2].map((nm) => ({ nm, name: `Ne ${nm.toFixed(1)}` })) },
  h: { name: 'Hydrogen (Balmer)', lines: [{ nm: 410.2, name: 'H δ 410.2' }, { nm: 434.0, name: 'H γ 434.0' }, { nm: 486.1, name: 'H β 486.1' }, { nm: 656.3, name: 'H α 656.3' }] },
  na: { name: 'Sodium', lines: [{ nm: 589.0, name: 'Na D2 589.0' }, { nm: 589.6, name: 'Na D1 589.6' }] },
  laser: { name: 'Laser pointers (nominal)', lines: [{ nm: 405, name: 'Violet laser ≈405' }, { nm: 532, name: 'Green laser ≈532' }, { nm: 650, name: 'Red laser ≈650' }] },
};

/** Column profile of an RGBA image between rows y0 and y1 (inclusive): mean of R + G + B (or one channel). vertical = the spectrum runs top to bottom. */
export function profile(data: ArrayLike<number>, w: number, h: number, y0: number, y1: number, vertical = false, channel: 'sum' | 'r' | 'g' | 'b' = 'sum'): number[] {
  const len = vertical ? h : w, across = vertical ? w : h;
  const a = Math.max(0, Math.min(across - 1, Math.round(Math.min(y0, y1)))), b = Math.max(0, Math.min(across - 1, Math.round(Math.max(y0, y1))));
  const out = new Array(len).fill(0);
  const ch = channel === 'r' ? [0] : channel === 'g' ? [1] : channel === 'b' ? [2] : [0, 1, 2];
  for (let i = 0; i < len; i++) {
    let s = 0;
    for (let k = a; k <= b; k++) { const o = 4 * (vertical ? i * w + k : k * w + i); for (const c of ch) s += data[o + c]; }
    out[i] = s / (b - a + 1);
  }
  return out;
}

export const smooth = (y: number[], n: number) => { if (n <= 1) return [...y]; const h = Math.floor(n / 2); return y.map((_, i) => { let s = 0, c = 0; for (let k = i - h; k <= i + h; k++) if (k >= 0 && k < y.length) { s += y[k]; c++; } return s / c; }); };

export type Peak = { x: number; i: number; height: number; width: number };
/** Local maxima at least `frac` of the highest peak above the baseline (the lowest value), at least `sep` pixels apart, refined by a parabola through the top three points. */
export function findPeaks(y: number[], frac = 0.1, sep = 5): Peak[] {
  const base = Math.min(...y), top = Math.max(...y) - base;
  if (!(top > 0)) return [];
  const cand: number[] = [];
  for (let i = 1; i < y.length - 1; i++) if (y[i] > y[i - 1] && y[i] >= y[i + 1] && y[i] - base >= frac * top) cand.push(i);
  cand.sort((a, b) => y[b] - y[a]);
  const keep: number[] = [];
  for (const i of cand) if (keep.every((k) => Math.abs(k - i) >= sep)) keep.push(i);
  return keep.map((i) => {
    const a = y[i - 1], b = y[i], c = y[i + 1], den = a - 2 * b + c, dx = den !== 0 ? (0.5 * (a - c)) / den : 0;
    const half = base + (b - base) / 2;
    let l = i, r = i;
    while (l > 0 && y[l] > half) l--;
    while (r < y.length - 1 && y[r] > half) r++;
    return { x: i + Math.max(-0.5, Math.min(0.5, dx)), i, height: b - base, width: r - l };
  }).sort((p, q) => p.x - q.x);
}

/** Least-squares polynomial (coefficients lowest power first) of y on x, x centred and scaled for stability. */
export function polyfit(x: number[], y: number[], deg: number): { c: number[]; x0: number; s: number } {
  const x0 = x.reduce((a, b) => a + b, 0) / x.length, s = Math.max(1e-9, ...x.map((v) => Math.abs(v - x0)));
  const t = x.map((v) => (v - x0) / s), k = deg + 1;
  const A = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => t.reduce((acc, v) => acc + v ** (i + j), 0)));
  const b = Array.from({ length: k }, (_, i) => t.reduce((acc, v, q) => acc + v ** i * y[q], 0));
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < k; c++) {
    let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-14) throw new Error('These points cannot fix a polynomial of that degree (two peaks at the same pixel?).');
    for (let r = 0; r < k; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let q = c; q <= k; q++) M[r][q] -= f * M[c][q]; }
  }
  return { c: M.map((r, i) => r[k] / r[i]), x0, s };
}
export const polyval = (f: { c: number[]; x0: number; s: number }, x: number) => { const t = (x - f.x0) / f.s; let v = 0; for (let i = f.c.length - 1; i >= 0; i--) v = v * t + f.c[i]; return v; };
/** Coefficients in plain powers of the pixel x (λ = a0 + a1 x + a2 x² ...). */
export function plainCoeffs(f: { c: number[]; x0: number; s: number }): number[] {
  const n = f.c.length, out = new Array(n).fill(0);
  // Expand Σ c_i ((x − x0)/s)^i.
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) out[j] += (f.c[i] / f.s ** i) * binom(i, j) * (-f.x0) ** (i - j);
  return out;
}
const binom = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };

export type Calibration = { fit: { c: number[]; x0: number; s: number }; deg: number; res: number[]; rms: number; dispersion: number; n: number };
/** Fit wavelength = polynomial(pixel) through matched pairs. Needs deg + 1 pairs (deg + 2 for a residual). */
export function calibrate(px: number[], nm: number[], deg: number): Calibration {
  if (px.length < deg + 1) throw new Error(`A degree-${deg} fit needs at least ${deg + 1} matched lines (you have ${px.length}).`);
  const fit = polyfit(px, nm, deg);
  const res = px.map((x, i) => nm[i] - polyval(fit, x));
  const dof = px.length - deg - 1;
  const rms = dof > 0 ? Math.sqrt(res.reduce((s, r) => s + r * r, 0) / dof) : NaN;
  const mid = px.reduce((a, b) => a + b, 0) / px.length;
  return { fit, deg, res, rms, dispersion: polyval(fit, mid + 0.5) - polyval(fit, mid - 0.5), n: px.length };
}

/**
 * Suggest which peak is which line: tries every pair of peaks against every pair of lines as a straight-line
 * mapping, keeps the mapping that puts the most peaks within `tol` nm of a line (ties: smaller error), and returns
 * the line index for each peak (−1 for none). Peaks are sorted by position; the mapping may run either way.
 */
export function autoMatch(peaks: number[], lines: number[], tol = 3, range: [number, number] = [300, 1100], heights?: number[]): number[] {
  let best: number[] = peaks.map(() => -1), bestN = 0, bestErr = Infinity;
  const L = [...lines];
  // Pair hypotheses from the 12 strongest peaks keep the search quick.
  const idx = peaks.map((_, k) => k).sort((p, q) => (heights ? heights[q] - heights[p] : 0)).slice(0, 12).sort((p, q) => p - q);
  for (const i of idx) for (const j of idx) for (let a = 0; a < L.length; a++) for (let b = 0; b < L.length; b++) {
    if (j <= i || a === b) continue;
    const slope = (L[b] - L[a]) / (peaks[j] - peaks[i]), icpt = L[a] - slope * peaks[i];
    if (!Number.isFinite(slope) || slope === 0) continue;
    // Sensible: the whole pixel range maps into the plausible wavelength range.
    const ends = [icpt + slope * Math.min(...peaks), icpt + slope * Math.max(...peaks)];
    if (Math.min(...ends) < range[0] || Math.max(...ends) > range[1]) continue;
    const used = new Set<number>(), m = peaks.map(() => -1);
    let n = 0, err = 0;
    peaks.forEach((p, k) => { const w = icpt + slope * p; let bi = -1, bd = tol; L.forEach((l, q) => { const d = Math.abs(l - w); if (d <= bd && !used.has(q)) { bd = d; bi = q; } }); if (bi >= 0) { used.add(bi); m[k] = bi; n++; err += bd * bd; } });
    if (n > bestN || (n === bestN && err < bestErr)) { best = m; bestN = n; bestErr = err; }
  }
  return best;
}

/** A made-up example: a fluorescent-lamp-like spectrum on 1,000 pixels with λ = 380 + 0.32 x + 2×10⁻⁵ x² nm, lines as Gaussians (σ 2.5 px) on a weak continuum. */
export const EXAMPLE_MAP = (x: number) => 380 + 0.32 * x + 2e-5 * x * x;
export function exampleProfile(): number[] {
  const lines: [number, number][] = [[404.7, 0.35], [435.8, 0.8], [487.7, 0.3], [542.4, 0.45], [546.1, 1.0], [577.0, 0.2], [579.1, 0.22], [611.6, 0.75]];
  const out: number[] = [];
  // Invert the map for each line's pixel.
  const px = (nm: number) => (-0.32 + Math.sqrt(0.32 ** 2 + 4 * 2e-5 * (nm - 380))) / (2 * 2e-5);
  for (let x = 0; x < 1000; x++) {
    let v = 0.04 + 0.03 * Math.exp(-(((x - 620) / 260) ** 2));
    for (const [nm, a] of lines) v += a * Math.exp(-0.5 * ((x - px(nm)) / 2.5) ** 2);
    out.push(255 * v / 1.1);
  }
  return out;
}
