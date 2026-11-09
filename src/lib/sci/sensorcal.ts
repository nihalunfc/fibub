// Low-cost sensor cleaning and calibration against a co-located reference. No DOM.
// Cleaning: out-of-range flags, stuck values (runs of identical readings), Hampel spike filter (moving median ± n × 1.4826
// × MAD, windows shortened at the ends as pandas rolling(center=True, min_periods=1) does). Alignment: means over fixed
// time bins (floor of time ÷ interval, from midnight 1970-01-01, as pandas resample with origin='epoch'), kept where
// both series have data. Fits: ordinary least squares (reference on sensor, optionally with RH and temperature terms)
// and Deming (errors in both; orthogonal when the error-variance ratio is 1). Metrics: R², RMSE, MAE, mean bias.

export type Series = { t: number[]; v: number[]; rh?: number[]; temp?: number[] };

/** Time text to milliseconds. "2026-03-01 13:00", "2026-03-01T13:00:00Z" (zones honoured), "01/03/2026 13:00" (day first), or Unix seconds. */
export function parseTime(s: string, dayFirst = true): number {
  const x = s.trim();
  if (/^\d{9,11}(\.\d+)?$/.test(x)) return +x * 1000;
  let m = x.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2})(\.\d+)?)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i);
  let y: number, mo: number, d: number, h = 0, mi = 0, se = 0, frac = 0, z: string | undefined;
  if (m) { [y, mo, d] = [+m[1], +m[2], +m[3]]; h = +(m[4] ?? 0); mi = +(m[5] ?? 0); se = +(m[6] ?? 0); frac = m[7] ? +m[7] : 0; z = m[8]; }
  else {
    m = x.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!m) return NaN;
    [d, mo] = dayFirst ? [+m[1], +m[2]] : [+m[2], +m[1]]; y = +m[3]; h = +(m[4] ?? 0); mi = +(m[5] ?? 0); se = +(m[6] ?? 0);
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 24 || mi > 59 || se > 60) return NaN;
  let t = Date.UTC(y, mo - 1, d, h, mi, se) + Math.round(frac * 1000);
  if (z && z.toUpperCase() !== 'Z') { const sg = z[0] === '-' ? -1 : 1, hh = +z.slice(1, 3), mm = +z.slice(-2); t -= sg * (hh * 60 + mm) * 6e4; }
  return t;
}
const p2 = (n: number) => String(n).padStart(2, '0');
export const fmtTime = (t: number) => { const d = new Date(t); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}${d.getUTCSeconds() ? ':' + p2(d.getUTCSeconds()) : ''}`; };

const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

/** Hampel filter on a series in time order: true where |x − median| > nSigma × 1.4826 × MAD of the window of ±half points (NaN ignored). */
export function hampel(v: number[], half: number, nSigma = 3): boolean[] {
  const out = new Array<boolean>(v.length).fill(false);
  for (let i = 0; i < v.length; i++) {
    if (!Number.isFinite(v[i])) continue;
    const w: number[] = [];
    for (let j = Math.max(0, i - half); j <= Math.min(v.length - 1, i + half); j++) if (Number.isFinite(v[j])) w.push(v[j]);
    const med = median(w), mad = 1.4826 * median(w.map((x) => Math.abs(x - med)));
    out[i] = Math.abs(v[i] - med) > nSigma * mad;
  }
  return out;
}

/** True for every reading in a run of at least minRun identical consecutive readings. */
export function stuck(v: number[], minRun: number): boolean[] {
  const out = new Array<boolean>(v.length).fill(false);
  let i = 0;
  while (i < v.length) {
    let j = i + 1;
    while (j < v.length && v[j] === v[i] && Number.isFinite(v[i])) j++;
    if (j - i >= minRun && Number.isFinite(v[i])) for (let k = i; k < j; k++) out[k] = true;
    i = j;
  }
  return out;
}

export type CleanOpts = { min?: number; max?: number; stuckRun?: number; hampelHalf?: number; hampelN?: number };
export type CleanResult = { v: number[]; range: number; stuck: number; spikes: number; missing: number; flag: string[] };
/** Cleans a series (sorted by time): out-of-range, stuck runs and Hampel spikes become NaN; flag says why. */
export function clean(s: Series, o: CleanOpts): CleanResult {
  const n = s.v.length, flag = new Array<string>(n).fill(''), v = [...s.v];
  let range = 0, st = 0, sp = 0, missing = 0;
  for (let i = 0; i < n; i++) {
    if (!Number.isFinite(v[i])) { flag[i] = 'missing'; missing++; continue; }
    if ((o.min !== undefined && Number.isFinite(o.min) && v[i] < o.min) || (o.max !== undefined && Number.isFinite(o.max) && v[i] > o.max)) { flag[i] = 'out of range'; v[i] = NaN; range++; }
  }
  if (o.stuckRun && o.stuckRun >= 2) { const f = stuck(v, o.stuckRun); for (let i = 0; i < n; i++) if (f[i]) { flag[i] = 'stuck'; v[i] = NaN; st++; } }
  if (o.hampelHalf && o.hampelHalf >= 1) { const f = hampel(v, o.hampelHalf, o.hampelN ?? 3); for (let i = 0; i < n; i++) if (f[i]) { flag[i] = 'spike'; v[i] = NaN; sp++; } }
  return { v, range, stuck: st, spikes: sp, missing, flag };
}

/** Means of the finite values in each time bin of `minutes` (bins start at whole multiples from 1970-01-01 00:00). */
export function binMeans(t: number[], cols: number[][], minutes: number, minCount = 1) {
  const w = minutes * 6e4, map = new Map<number, { n: number[]; s: number[] }>();
  for (let i = 0; i < t.length; i++) {
    if (!Number.isFinite(t[i])) continue;
    const b = Math.floor(t[i] / w) * w;
    let e = map.get(b); if (!e) { e = { n: cols.map(() => 0), s: cols.map(() => 0) }; map.set(b, e); }
    cols.forEach((c, k) => { if (Number.isFinite(c[i])) { e!.n[k]++; e!.s[k] += c[i]; } });
  }
  const keys = [...map.keys()].sort((a, b) => a - b);
  return { t: keys, cols: cols.map((_, k) => keys.map((b) => { const e = map.get(b)!; return e.n[k] >= minCount ? e.s[k] / e.n[k] : NaN; })), counts: keys.map((b) => map.get(b)!.n[0]) };
}

/** Pairs of bins where the sensor and the reference both have a mean (and RH / T when they are used). */
export function align(sensor: { t: number[]; v: number[]; rh?: number[]; temp?: number[] }, ref: { t: number[]; v: number[] }, minutes: number, minCount = 1) {
  const sc = [sensor.v, sensor.rh ?? [], sensor.temp ?? []].map((c) => (c.length ? c : sensor.v.map(() => NaN)));
  const sb = binMeans(sensor.t, sc, minutes, minCount), rb = binMeans(ref.t, [ref.v], minutes, 1);
  const rmap = new Map(rb.t.map((t, i) => [t, rb.cols[0][i]]));
  const out = { t: [] as number[], x: [] as number[], y: [] as number[], rh: [] as number[], temp: [] as number[] };
  sb.t.forEach((t, i) => { const y = rmap.get(t); if (y !== undefined && Number.isFinite(y) && Number.isFinite(sb.cols[0][i])) { out.t.push(t); out.x.push(sb.cols[0][i]); out.y.push(y); out.rh.push(sb.cols[1][i]); out.temp.push(sb.cols[2][i]); } });
  return out;
}

/** Inverse of a small square matrix (Gauss–Jordan with partial pivoting), or null when singular. */
export function inverse(A: number[][]): number[][] | null {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    const scale = Math.max(...A.map((r) => Math.abs(r[c]))) || 1;
    if (Math.abs(M[p][c]) < 1e-12 * scale) return null;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c]; for (let k = 0; k < 2 * n; k++) M[c][k] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; if (f) for (let k = 0; k < 2 * n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r) => r.slice(n));
}

export type OlsFit = { names: string[]; coef: number[]; se: number[]; r2: number; adjR2: number; s: number; n: number; df: number };
/** Ordinary least squares of y on the columns X (an intercept is added first). Columns are centred for the solve. */
export function ols(y: number[], X: number[][], names: string[]): OlsFit | null {
  const n = y.length, p = X.length + 1;
  if (n <= p) return null;
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
  const mx = X.map(mean), my = mean(y), Xc = X.map((c, k) => c.map((v) => v - mx[k])), yc = y.map((v) => v - my);
  const q = X.length, A = Array.from({ length: q }, (_, i) => Array.from({ length: q }, (_, j) => Xc[i].reduce((s, v, r) => s + v * Xc[j][r], 0)));
  const Ai = q ? inverse(A) : [];
  if (!Ai) return null;
  const b = Ai.map((row) => row.reduce((s, a, j) => s + a * Xc[j].reduce((t, v, r) => t + v * yc[r], 0), 0));
  const b0 = my - b.reduce((s, v, k) => s + v * mx[k], 0);
  let sse = 0, sst = 0;
  for (let r = 0; r < n; r++) { const f = b0 + b.reduce((s, v, k) => s + v * X[k][r], 0); sse += (y[r] - f) ** 2; sst += (y[r] - my) ** 2; }
  const df = n - p, s2 = sse / df;
  // Var(b0) = s²/n + m' (Xc'Xc)^-1 m.
  const v0 = s2 / n + mx.reduce((s, a, i) => s + a * mx.reduce((t, c, j) => t + Ai[i][j] * c, 0), 0) * s2;
  return { names: ['Intercept', ...names], coef: [b0, ...b], se: [Math.sqrt(v0), ...b.map((_, k) => Math.sqrt(s2 * Ai[k][k]))], r2: 1 - sse / sst, adjR2: 1 - (sse / df) / (sst / (n - 1)), s: Math.sqrt(s2), n, df };
}

/** Deming regression of y on x; lambda = (error variance of y) ÷ (error variance of x); 1 = orthogonal regression. */
export function deming(x: number[], y: number[], lambda = 1) {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; sxy += (x[i] - mx) * (y[i] - my); }
  const d = syy - lambda * sxx, b = (d + Math.sqrt(d * d + 4 * lambda * sxy * sxy)) / (2 * sxy);
  return { slope: b, intercept: my - b * mx };
}

/** Agreement of predictions with the reference: R² = 1 − SSE/SST, RMSE, MAE, mean bias (prediction − reference), n. */
export function metrics(pred: number[], ref: number[]) {
  let n = 0, se = 0, ae = 0, bias = 0, my = 0;
  for (let i = 0; i < ref.length; i++) if (Number.isFinite(pred[i]) && Number.isFinite(ref[i])) { n++; my += ref[i]; }
  my /= n || 1;
  let sst = 0;
  for (let i = 0; i < ref.length; i++) if (Number.isFinite(pred[i]) && Number.isFinite(ref[i])) { const e = pred[i] - ref[i]; se += e * e; ae += Math.abs(e); bias += e; sst += (ref[i] - my) ** 2; }
  return { n, r2: n ? 1 - se / sst : NaN, rmse: n ? Math.sqrt(se / n) : NaN, mae: n ? ae / n : NaN, bias: n ? bias / n : NaN };
}
/** Pearson r² between two series. */
export function pearsonR2(x: number[], y: number[]) {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return (sxy * sxy) / (sxx * syy);
}

export type Model = { kind: 'ols' | 'deming'; terms: ('rh' | 'temp')[]; coef: number[] };
/** The calibrated value for one reading. */
export function applyModel(m: Model, x: number, rh = NaN, temp = NaN) {
  if (m.kind === 'deming') return m.coef[0] + m.coef[1] * x;
  let v = m.coef[0] + m.coef[1] * x;
  m.terms.forEach((t, k) => { v += m.coef[2 + k] * (t === 'rh' ? rh : temp); });
  return v;
}

/** Made-up example: three weeks of 5-minute PM2.5 sensor readings (with RH and T) and an hourly reference. */
export function exampleData() {
  let seed = 777; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const gauss = () => { let u = 0; for (let k = 0; k < 6; k++) u += rnd(); return (u - 3) * Math.SQRT2; };
  const t0 = Date.UTC(2026, 2, 1), H = 21 * 24, refT: number[] = [], refV: number[] = [], truth: number[] = [];
  for (let h = 0; h < H; h++) {
    const day = Math.floor(h / 24), hr = h % 24, base = 8 + 6 * Math.sin(day / 2.5) ** 2 + 5 * (hr >= 7 && hr <= 9 ? 1 : 0) + 4 * (hr >= 18 && hr <= 21 ? 1 : 0);
    truth.push(Math.max(1, base + 2 * gauss())); refT.push(t0 + h * 36e5); refV.push(+Math.max(0, truth[h] + 0.8 * gauss()).toFixed(1));
  }
  const sT: number[] = [], sV: number[] = [], rh: number[] = [], temp: number[] = [];
  for (let i = 0; i < H * 12; i++) {
    const t = t0 + i * 3e5, h = Math.floor(i / 12), hr = (i / 12) % 24;
    const RH = Math.min(97, Math.max(25, 62 + 22 * Math.cos(((hr - 4) / 24) * 2 * Math.PI) + 8 * Math.sin(h / 40))), T = 9 - 6 * Math.cos(((hr - 4) / 24) * 2 * Math.PI);
    // The made-up sensor reads high, more so in humid air, and drifts a little with temperature.
    let v = 1.6 + 1.25 * truth[h] * (1 + 0.012 * Math.max(0, RH - 50)) + 0.08 * T + 1.5 * gauss();
    if (rnd() < 0.01) v += 60 + 80 * rnd(); // spikes
    sT.push(t); sV.push(+v.toFixed(1)); rh.push(+RH.toFixed(1)); temp.push(+T.toFixed(1));
  }
  for (let i = 1600; i < 1618; i++) sV[i] = 12.3; // stuck for 90 minutes
  for (let i = 3600; i < 3606; i++) sV[i] = -999; // logger error code
  return { sensor: { t: sT, v: sV, rh, temp }, ref: { t: refT, v: refV } };
}
