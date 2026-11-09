// Thin-film thickness from interference fringes. Three ways: (1) the positions of the fringe extrema with a known
// refractive index (constant or Cauchy), via consecutive extrema and then whole-number orders (Swanepoel's
// second step); (2) Swanepoel's envelope method for a transmittance spectrum on a transparent substrate, which
// gives n(λ) from the upper and lower envelopes and then d; (3) the count of fringes between two wavelengths.
// Wavelengths are in nm. The exact transmittance formula (Swanepoel 1983) makes the example spectrum.

export type Extremum = { lambda: number; T: number; kind: 'max' | 'min' };

/** Effective index for a ray at angle θ (degrees) in air: √(n² − sin²θ), so 2·d·nEff = m·λ. */
export const nEff = (n: number, thetaDeg = 0) => Math.sqrt(n * n - Math.sin((thetaDeg * Math.PI) / 180) ** 2);

/** Cauchy dispersion n(λ) = A + B/λ² (λ in nm, B in nm²). */
export const cauchy = (A: number, B: number) => (l: number) => A + B / (l * l);

/**
 * Transmittance of a film (index n, absorption coefficient α in nm⁻¹, thickness d nm) on a thick transparent
 * substrate of index s, light from air, the substrate's back face included (Swanepoel 1983, equation for T).
 */
export function swanepoelT(lambda: number, n: number, s: number, d: number, alpha = 0): number {
  const A = 16 * n * n * s, B = (n + 1) ** 3 * (n + s * s), C = 2 * (n * n - 1) * (n * n - s * s), D = (n - 1) ** 3 * (n - s * s);
  const phi = (4 * Math.PI * n * d) / lambda, x = Math.exp(-alpha * d);
  return (A * x) / (B - C * x * Math.cos(phi) + D * x * x);
}

/** Substrate index from the transmittance of the bare substrate (both faces): s = 1/Ts + √(1/Ts² − 1). */
export const substrateIndex = (Ts: number) => 1 / Ts + Math.sqrt(1 / (Ts * Ts) - 1);

/** Moving average over 2h + 1 points (shorter at the ends). */
export function smooth(y: number[], h: number): number[] {
  if (h <= 0) return y.slice();
  const out: number[] = [];
  for (let i = 0; i < y.length; i++) {
    let s = 0, c = 0;
    for (let j = Math.max(0, i - h); j <= Math.min(y.length - 1, i + h); j++) { s += y[j]; c++; }
    out.push(s / c);
  }
  return out;
}

/**
 * Fringe maxima and minima: local extremes of the smoothed curve within ±w points, kept if they stand out by at
 * least minProm (as a fraction of the curve's full range) from the neighbouring opposite extremes, then refined
 * by a parabola through the 5 nearest raw points. Maxima and minima alternate (of two in a row, the stronger one
 * is kept). x must be sorted ascending (wavelength in nm).
 */
export function findExtrema(x: number[], y: number[], w = 3, minProm = 0.02, h = 1): Extremum[] {
  const n = x.length, ys = smooth(y, h);
  const range = Math.max(...ys) - Math.min(...ys) || 1;
  const cand: { i: number; kind: 'max' | 'min' }[] = [];
  for (let i = 1; i < n - 1; i++) {
    let isMax = true, isMin = true;
    for (let j = Math.max(0, i - w); j <= Math.min(n - 1, i + w); j++) { if (j === i) continue; if (ys[j] > ys[i] || (ys[j] === ys[i] && j < i)) isMax = false; if (ys[j] < ys[i] || (ys[j] === ys[i] && j < i)) isMin = false; }
    if (i - w < 0 || i + w > n - 1) continue; // need a full window to be sure
    if (isMax) cand.push({ i, kind: 'max' }); else if (isMin) cand.push({ i, kind: 'min' });
  }
  // Alternate.
  const alt: typeof cand = [];
  for (const c of cand) {
    const last = alt[alt.length - 1];
    if (last && last.kind === c.kind) { if ((c.kind === 'max' && ys[c.i] > ys[last.i]) || (c.kind === 'min' && ys[c.i] < ys[last.i])) alt[alt.length - 1] = c; }
    else alt.push(c);
  }
  // Prominence against the neighbouring opposite extremes; drop weak pairs until stable.
  let list = alt;
  for (let pass = 0; pass < 50; pass++) {
    let worst = -1, wv = Infinity;
    for (let k = 0; k < list.length; k++) {
      const nb = [list[k - 1], list[k + 1]].filter(Boolean).map((e) => Math.abs(ys[list[k].i] - ys[e.i]));
      const p = nb.length ? Math.max(...nb) : 0;
      if (p < minProm * range && p < wv) { wv = p; worst = k; }
    }
    if (worst < 0) break;
    list = list.filter((_, k) => k !== worst);
    const merged: typeof list = [];
    for (const c of list) { const last = merged[merged.length - 1]; if (last && last.kind === c.kind) { if ((c.kind === 'max' && ys[c.i] > ys[last.i]) || (c.kind === 'min' && ys[c.i] < ys[last.i])) merged[merged.length - 1] = c; } else merged.push(c); }
    list = merged;
  }
  return list.map(({ i, kind }) => refine(x, y, i, kind));
}

/** Least-squares parabola through the 5 points around i (3 at an edge): vertex position and height. */
function refine(x: number[], y: number[], i: number, kind: 'max' | 'min'): Extremum {
  const a = Math.max(0, i - 2), b = Math.min(x.length - 1, i + 2);
  const xs = x.slice(a, b + 1), yv = y.slice(a, b + 1), x0 = x[i];
  // Fit y = c0 + c1 t + c2 t² with t = x − x0.
  let S0 = 0, S1 = 0, S2 = 0, S3 = 0, S4 = 0, Y0 = 0, Y1 = 0, Y2 = 0;
  for (let k = 0; k < xs.length; k++) { const t = xs[k] - x0, t2 = t * t; S0++; S1 += t; S2 += t2; S3 += t2 * t; S4 += t2 * t2; Y0 += yv[k]; Y1 += yv[k] * t; Y2 += yv[k] * t2; }
  const M = [[S0, S1, S2], [S1, S2, S3], [S2, S3, S4]], r = [Y0, Y1, Y2];
  const det = (m: number[][]) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det(M);
  const col = (j: number) => M.map((row, k) => row.map((v, c) => (c === j ? r[k] : v)));
  const c = [0, 1, 2].map((j) => det(col(j)) / D);
  const t = Math.abs(c[2]) > 0 ? -c[1] / (2 * c[2]) : 0;
  if (!Number.isFinite(t) || Math.abs(t) > Math.abs(xs[xs.length - 1] - xs[0]) / 2 || (kind === 'max' ? c[2] >= 0 : c[2] <= 0)) return { lambda: x0, T: y[i], kind };
  return { lambda: x0 + t, T: c[0] + c[1] * t + c[2] * t * t, kind };
}

/** Natural cubic spline through (xs, ys) (xs ascending); returns a function that is NaN outside [x0, xn]. */
export function spline(xs: number[], ys: number[]): (x: number) => number {
  const n = xs.length;
  if (n < 2) return () => NaN;
  if (n === 2) return (x) => (x < xs[0] || x > xs[1] ? NaN : ys[0] + ((ys[1] - ys[0]) * (x - xs[0])) / (xs[1] - xs[0]));
  const h = xs.slice(1).map((x, i) => x - xs[i]);
  const al = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) al[i] = (3 / h[i]) * (ys[i + 1] - ys[i]) - (3 / h[i - 1]) * (ys[i] - ys[i - 1]);
  const l = new Array(n).fill(1), mu = new Array(n).fill(0), z = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) { l[i] = 2 * (xs[i + 1] - xs[i - 1]) - h[i - 1] * mu[i - 1]; mu[i] = h[i] / l[i]; z[i] = (al[i] - h[i - 1] * z[i - 1]) / l[i]; }
  const c = new Array(n).fill(0), b = new Array(n - 1).fill(0), d = new Array(n - 1).fill(0);
  for (let j = n - 2; j >= 0; j--) { c[j] = z[j] - mu[j] * c[j + 1]; b[j] = (ys[j + 1] - ys[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3; d[j] = (c[j + 1] - c[j]) / (3 * h[j]); }
  return (x) => {
    if (x < xs[0] - 1e-9 || x > xs[n - 1] + 1e-9) return NaN;
    let j = 0; while (j < n - 2 && x > xs[j + 1]) j++;
    const t = x - xs[j];
    return ys[j] + b[j] * t + c[j] * t * t + d[j] * t * t * t;
  };
}

export type Row = {
  lambda: number; kind: 'max' | 'min'; T: number;
  TM?: number; Tm?: number; n1: number; d1?: number; m?: number; d2?: number; n2?: number; x?: number; alpha?: number;
};
export type Result = { rows: Row[]; d1: number; d1sd: number; d2: number; d2sd: number; n: number; orderShift: number };

const meanSd = (a: number[]) => { const f = a.filter(Number.isFinite); const m = f.reduce((s, v) => s + v, 0) / f.length; const sd = f.length > 1 ? Math.sqrt(f.reduce((s, v) => s + (v - m) ** 2, 0) / (f.length - 1)) : NaN; return [m, sd, f.length] as const; };

/**
 * From extrema with an index for each (n1): d from each pair of neighbouring extrema (half an order apart),
 * d = λ₁λ₂ / (4(n₂λ₁ − n₁λ₂)); their mean d1; then the order of each extremum m = 2·n·d1/λ rounded to a whole
 * number at `wholeAt` extrema and to a half at the others; d2 = m·λ/(2n) for each and their mean; and the
 * refined index n2 = m·λ/(2·d2). `wholeAt` is 'max' for transmittance when the film's index is above the
 * substrate's (and 'min' for reflectance then).
 */
export function fromExtrema(ex: Extremum[], nOf: (e: Extremum, i: number) => number, wholeAt: 'max' | 'min', orderShift = 0): Result {
  const rows: Row[] = [...ex].sort((a, b) => a.lambda - b.lambda).map((e, i) => ({ lambda: e.lambda, kind: e.kind, T: e.T, n1: nOf(e, i) }));
  // Pairs: consecutive extrema (shorter λ first), Δm = ½.
  const pd: number[] = [];
  for (let i = 0; i + 1 < rows.length; i++) {
    const a = rows[i + 1], b = rows[i]; // a: longer λ (λ1), b: shorter λ (λ2)
    const dm = a.kind === b.kind ? 1 : 0.5;
    const d = (dm * a.lambda * b.lambda) / (2 * (b.n1 * a.lambda - a.n1 * b.lambda));
    pd.push(d);
  }
  // Each extremum's d1 is the mean of the pairs it belongs to (for the table).
  rows.forEach((r, i) => { const v = [pd[i - 1], pd[i]].filter((x) => x !== undefined && Number.isFinite(x) && x > 0); r.d1 = v.length ? v.reduce((s, x) => s + x, 0) / v.length : NaN; });
  const [d1, d1sd] = meanSd(pd.filter((x) => x > 0));
  for (const r of rows) {
    const raw = (2 * r.n1 * d1) / r.lambda;
    const half = r.kind === wholeAt ? 0 : 0.5;
    r.m = Math.round(raw - half) + half + orderShift;
    r.d2 = (r.m * r.lambda) / (2 * r.n1);
  }
  const [d2, d2sd] = meanSd(rows.map((r) => r.d2!));
  for (const r of rows) r.n2 = (r.m! * r.lambda) / (2 * d2);
  const [n] = meanSd(rows.map((r) => r.n1));
  return { rows, d1, d1sd, d2, d2sd, n, orderShift };
}

/**
 * Swanepoel's envelope method on a transmittance spectrum (fractions, not %): at each extremum the other envelope
 * comes from a natural cubic spline through the opposite extrema; N = 2s(TM − Tm)/(TM·Tm) + (s² + 1)/2 and
 * n = √(N + √(N² − s²)). Extrema where the other envelope is not defined (beyond the outermost opposite extremum)
 * are left out. Then thickness as in fromExtrema, with whole orders at the maxima (film index above the
 * substrate's). The absorbance x and α come from TM.
 */
export function envelope(ex: Extremum[], s: number, orderShift = 0): { res: Result; upper: (l: number) => number; lower: (l: number) => number } | null {
  const sorted = [...ex].sort((a, b) => a.lambda - b.lambda);
  const mx = sorted.filter((e) => e.kind === 'max'), mn = sorted.filter((e) => e.kind === 'min');
  if (mx.length < 2 || mn.length < 2) return null;
  const upper = spline(mx.map((e) => e.lambda), mx.map((e) => e.T)), lower = spline(mn.map((e) => e.lambda), mn.map((e) => e.T));
  const used: (Extremum & { TM: number; Tm: number; n: number })[] = [];
  for (const e of sorted) {
    const TM = e.kind === 'max' ? e.T : upper(e.lambda), Tm = e.kind === 'min' ? e.T : lower(e.lambda);
    if (!Number.isFinite(TM) || !Number.isFinite(Tm) || !(TM > Tm)) continue;
    const N = (2 * s * (TM - Tm)) / (TM * Tm) + (s * s + 1) / 2;
    const n = Math.sqrt(N + Math.sqrt(N * N - s * s));
    used.push({ ...e, TM, Tm, n });
  }
  if (used.length < 3) return null;
  const res = fromExtrema(used, (e) => used.find((u) => u.lambda === e.lambda)!.n, 'max', orderShift);
  for (const r of res.rows) {
    const u = used.find((x) => x.lambda === r.lambda)!;
    r.TM = u.TM; r.Tm = u.Tm;
    const n = r.n2!, EM = (8 * n * n * s) / u.TM + (n * n - 1) * (n * n - s * s);
    const x = (EM - Math.sqrt(EM * EM - (n * n - 1) ** 3 * (n * n - s ** 4))) / ((n - 1) ** 3 * (n - s * s));
    r.x = x; r.alpha = x > 0 && x <= 1 ? -Math.log(x) / res.d2 : NaN;
  }
  return { res, upper, lower };
}

/** Thickness from N whole fringes between λ1 and λ2 with a constant index: d = N / (2 nEff (1/λshort − 1/λlong)). */
export const fromCount = (N: number, l1: number, l2: number, n: number, thetaDeg = 0) => N / (2 * nEff(n, thetaDeg) * Math.abs(1 / Math.min(l1, l2) - 1 / Math.max(l1, l2)));

/** Made-up example: a 1000 nm film, n = 2.2 + 3×10⁴/λ² (Cauchy, λ in nm), weak absorption, on a substrate with s = 1.5. */
export const EXAMPLE = { d: 1000, A: 2.2, B: 3e4, s: 1.5, alphaAt: (l: number) => 2e-5 * Math.exp((500 - l) / 80) };
export function exampleSpectrum(): { nm: number[]; T: number[] } {
  let sd = 777; const rnd = () => ((sd = (sd * 1103515245 + 12345) % 2147483648) / 2147483648) - 0.5;
  const nm: number[] = [], T: number[] = [];
  const nf = cauchy(EXAMPLE.A, EXAMPLE.B);
  for (let l = 500; l <= 1500; l += 1) { nm.push(l); T.push(+(100 * swanepoelT(l, nf(l), EXAMPLE.s, EXAMPLE.d, EXAMPLE.alphaAt(l)) + 0.05 * rnd()).toFixed(3)); }
  return { nm, T };
}
