// Solar cycle fitter: monthly sunspot numbers (or any monthly activity index) in, 13-month running mean, cycle
// minima and maxima, cycle lengths, rise times and amplitudes, a shape function fitted to each cycle by least
// squares, and the current cycle carried on with an uncertainty band. Plain TypeScript, no DOM.
//
// Shape function (a general asymmetric cycle profile used in solar cycle studies):
//   f(t) = a (t − t0)³ / (exp((t − t0)² / b²) − c)   for t > t0, and 0 before t0
// t in years, t0 the start time, b sets the rise time (years), a the size, c a fixed shape constant (0 ≤ c < 1).
import { num, parseTable } from './num.ts';

export type Point = { year: number; month: number; t: number; v: number };
export type Parsed = { pts: Point[]; bad: string[]; gaps: number; first: string; last: string };

/** "2024-03" for year 2024, month 3. */
export const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
/** Mid-month decimal year: month m (1 to 12) of year y is y + (m − 0.5)/12. */
export const decYear = (y: number, m: number) => y + (m - 0.5) / 12;
/** The year and month a decimal year falls in. */
export function fromDec(t: number): [number, number] {
  let y = Math.floor(t), m = Math.floor((t - y) * 12 + 1e-9) + 1;
  if (m > 12) { y++; m = 1; }
  return [y, m];
}
export const dateOf = (t: number) => { const [y, m] = fromDec(t); return ym(y, m); };

/**
 * Monthly values from pasted text. Each line holds a date and a value:
 *   2024-03, 120.5   or   2024/03 120.5   or   2024-03-01;120.5   (day ignored)
 *   2024 3 120.5     (year, month, value)   or   2024;03;2024.208;120.5;...  (year, month, decimal year, value)
 *   2024.208 120.5   (decimal year, value)
 * A blank, "NaN" or negative value (such as −1) is a missing month. Lines are sorted by date; months with no line
 * are missing too. The returned list runs month by month from the first to the last date, with NaN for missing.
 */
export function parseSeries(text: string): Parsed {
  const rows = parseTable(text), bad: string[] = [];
  const seen = new Map<number, number>();
  rows.forEach((r, i) => {
    const cells = r.map((c) => c.trim());
    if (!cells.length || cells.every((c) => !c)) return;
    let y = NaN, m = NaN, rest: string[] = [];
    const d = cells[0].match(/^(\d{3,4})[-/](\d{1,2})(?:[-/]\d{1,2})?(?:[T ].*)?$/);
    if (d) { y = Number(d[1]); m = Number(d[2]); rest = cells.slice(1); }
    else {
      const a = num(cells[0]), b = num(cells[1]);
      if (Number.isInteger(a) && Number.isInteger(b) && b >= 1 && b <= 12 && cells.length >= 3) {
        y = a; m = b; rest = cells.slice(2);
        const c = num(rest[0]);
        if (rest.length >= 2 && Math.abs(c - decYear(y, m)) < 0.1 && !Number.isInteger(c)) rest = rest.slice(1);
      } else if (Number.isFinite(a) && cells.length >= 2) { [y, m] = fromDec(a); rest = cells.slice(1); }
    }
    if (!(y >= 1000 && y <= 3000 && m >= 1 && m <= 12 && Number.isInteger(y) && Number.isInteger(m))) {
      if (i === 0 && cells.some((c) => /[a-z]/i.test(c))) return; // a header line
      bad.push(`Line ${i + 1} (${cells.join(' ').slice(0, 40)}): no date. Use 2024-03, "2024 3" or a decimal year.`);
      return;
    }
    const raw = rest[0] ?? '';
    let v = /^(nan|na|-|)$/i.test(raw.trim()) ? NaN : num(raw);
    if (raw.trim() && !/^(nan|na|-)$/i.test(raw.trim()) && Number.isNaN(v)) { bad.push(`Line ${i + 1} (${ym(y, m)}): the value "${raw.slice(0, 20)}" is not a number.`); return; }
    if (v < 0) v = NaN;
    const k = y * 12 + m - 1;
    if (seen.has(k)) { bad.push(`Line ${i + 1}: ${ym(y, m)} is given twice; the first one is kept.`); return; }
    seen.set(k, v);
  });
  if (!seen.size) return { pts: [], bad, gaps: 0, first: '', last: '' };
  const keys = [...seen.keys()].sort((p, q) => p - q), k0 = keys[0], k1 = keys[keys.length - 1];
  const pts: Point[] = [];
  let gaps = 0;
  for (let k = k0; k <= k1; k++) {
    const y = Math.floor(k / 12), m = (k % 12) + 1, v = seen.has(k) ? seen.get(k)! : NaN;
    if (!Number.isFinite(v)) gaps++;
    pts.push({ year: y, month: m, t: decYear(y, m), v });
  }
  return { pts, bad, gaps, first: ym(pts[0].year, pts[0].month), last: ym(pts[pts.length - 1].year, pts[pts.length - 1].month) };
}

/**
 * The standard 13-month running mean (tapered): R̄ₙ = (Rₙ₋₆ + 2 Σₖ₌₋₅⁵ Rₙ₊ₖ + Rₙ₊₆) / 24.
 * NaN for the first and last six months and wherever one of the 13 months is missing.
 */
export function smooth13(v: number[]): number[] {
  return v.map((_, n) => {
    if (n < 6 || n + 6 >= v.length) return NaN;
    let s = v[n - 6] + v[n + 6];
    for (let k = -5; k <= 5; k++) s += 2 * v[n + k];
    return Number.isFinite(s) ? s / 24 : NaN;
  });
}

export type Extremes = { minima: number[]; maxima: number[]; lastMaxIsPeak: boolean };
/**
 * Cycle minima and maxima on the smoothed curve S (indexes). A minimum is the lowest point within ±k months
 * (k = half the shortest spacing allowed between minima; ties go to the first), at least `edge` smoothed months from
 * either end of the smoothed curve. Each maximum is the highest point between two neighbouring minima; after the
 * last minimum, the highest point counts as a maximum only if it is also the highest within ±k months and at least
 * `edge` months before the end (otherwise the cycle may still be rising).
 */
export function findExtremes(S: number[], k: number, edge = 6): Extremes {
  const fin = S.map((x, i) => (Number.isFinite(x) ? i : -1)).filter((i) => i >= 0);
  if (fin.length < 3) return { minima: [], maxima: [], lastMaxIsPeak: false };
  const lo = fin[0], hi = fin[fin.length - 1];
  const isExt = (i: number, sgn: 1 | -1) => {
    for (let j = Math.max(lo, i - k); j <= Math.min(hi, i + k); j++) {
      if (j === i || !Number.isFinite(S[j])) continue;
      const d = sgn * (S[j] - S[i]); // > 0 when S[j] is "better" than S[i]
      if (d > 0 || (d === 0 && j < i)) return false;
    }
    return true;
  };
  const minima: number[] = [];
  for (const i of fin) if (i - lo >= edge && hi - i >= edge && isExt(i, -1)) minima.push(i);
  const maxima: number[] = [];
  let lastMaxIsPeak = false;
  for (let c = 0; c < minima.length; c++) {
    const a = minima[c], b = c + 1 < minima.length ? minima[c + 1] : hi + 1;
    let best = -1;
    for (let j = a + 1; j < b; j++) if (Number.isFinite(S[j]) && (best < 0 || S[j] > S[best])) best = j;
    if (best < 0) continue;
    if (c + 1 < minima.length) maxima.push(best);
    else if (hi - best >= edge && isExt(best, 1)) { maxima.push(best); lastMaxIsPeak = true; }
  }
  return { minima, maxima, lastMaxIsPeak };
}

// ---------- the shape function ----------
export type Shape = { a: number; b: number; t0: number; c: number };
export function shape(t: number, p: Shape): number {
  const u = t - p.t0;
  if (!(u > 0)) return 0;
  return (p.a * u * u * u) / (Math.exp((u * u) / (p.b * p.b)) - p.c);
}
/** x = (t − t0)/b at the peak: the root of e^(x²)(3 − 2x²) = 3c between 1/√2 and √1.5 (0 ≤ c < 1). */
export function peakX(c: number): number {
  let lo = Math.SQRT1_2, hi = Math.sqrt(1.5);
  const g = (x: number) => Math.exp(x * x) * (3 - 2 * x * x) - 3 * c;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
/** Time and height of the curve's peak. */
export function peakOf(p: Shape): { t: number; v: number } {
  const x = peakX(p.c), u = x * Math.abs(p.b);
  return { t: p.t0 + u, v: shape(p.t0 + u, p) };
}
/** Value and derivatives with respect to a, b and t0. */
function grad(t: number, a: number, b: number, t0: number, c: number): [number, number, number, number] {
  const u = t - t0;
  if (!(u > 0)) return [0, 0, 0, 0];
  const u2 = u * u, u3 = u2 * u, b2 = b * b, E = Math.exp(u2 / b2), D = E - c;
  const f = (a * u3) / D;
  const da = u3 / D;
  const db = (a * u3 * E * 2 * u2) / (b2 * b * D * D);
  const du = (a * (3 * u2 * D - (u3 * E * 2 * u) / b2)) / (D * D);
  return [f, da, db, -du];
}

export type Fit = { p: Shape; sse: number; n: number; rms: number; cov: number[][]; se: number[]; free: ('a' | 'b' | 't0')[]; ok: boolean };

function solve(A: number[][], g: number[]): number[] | null {
  const n = g.length, M = A.map((r, i) => [...r, g[i]]);
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
    if (!(Math.abs(M[p][i]) > 1e-300)) return null;
    [M[i], M[p]] = [M[p], M[i]];
    for (let r = 0; r < n; r++) if (r !== i) { const f = M[r][i] / M[i][i]; for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function inverse(A: number[][]): number[][] | null {
  const n = A.length, cols: number[][] = [];
  for (let j = 0; j < n; j++) { const e = A.map((_, i) => (i === j ? 1 : 0)); const x = solve(A, e); if (!x) return null; cols.push(x); }
  return A.map((_, i) => cols.map((c) => c[i]));
}

/**
 * Least-squares fit of the shape function to (t, y) by Levenberg–Marquardt with exact derivatives. `free` lists
 * the parameters to fit (the others stay at `start`). The covariance is s²(JᵀJ)⁻¹ with s² = SSE/(n − p).
 */
export function fitShape(t: number[], y: number[], start: Shape, free: ('a' | 'b' | 't0')[] = ['a', 'b', 't0']): Fit {
  const n = t.length, idx = free.map((f) => ({ a: 1, b: 2, t0: 3 })[f]);
  let p = { ...start };
  const sseOf = (q: Shape) => { let s = 0; for (let i = 0; i < n; i++) { const r = y[i] - shape(t[i], q); s += r * r; } return s; };
  let sse = sseOf(p), lam = 1e-3;
  const build = (q: Shape) => {
    const k = idx.length, JTJ = Array.from({ length: k }, () => new Array(k).fill(0)), JTr = new Array(k).fill(0);
    for (let i = 0; i < n; i++) {
      const g = grad(t[i], q.a, q.b, q.t0, q.c), r = y[i] - g[0];
      for (let x = 0; x < k; x++) { JTr[x] += g[idx[x]] * r; for (let z = 0; z < k; z++) JTJ[x][z] += g[idx[x]] * g[idx[z]]; }
    }
    return { JTJ, JTr };
  };
  for (let it = 0; it < 500; it++) {
    const { JTJ, JTr } = build(p);
    let improved = false;
    for (let tries = 0; tries < 40; tries++) {
      const A = JTJ.map((r, i) => r.map((v, j) => (i === j ? v * (1 + lam) + 1e-300 : v)));
      const d = solve(A, JTr);
      if (!d) { lam *= 10; continue; }
      const q = { ...p };
      free.forEach((f, i) => { q[f] += d[i]; });
      const s = q.b > 0 ? sseOf(q) : Infinity;
      if (Number.isFinite(s) && s <= sse) {
        const rel = (sse - s) / Math.max(sse, 1e-300), step = Math.max(...d.map((v, i) => Math.abs(v) / (Math.abs(p[free[i]]) + 1e-9)));
        p = q; sse = s; lam = Math.max(lam / 10, 1e-12); improved = true;
        if (rel < 1e-14 && step < 1e-10) it = 1e9;
        break;
      }
      lam *= 10;
    }
    if (!improved) break;
  }
  const { JTJ } = build(p), k = free.length, dof = n - k;
  const inv = inverse(JTJ), s2 = dof > 0 ? sse / dof : NaN;
  const cov = inv ? inv.map((r) => r.map((v) => v * s2)) : free.map(() => free.map(() => NaN));
  const se = cov.map((r, i) => Math.sqrt(r[i]));
  return { p, sse, n, rms: Math.sqrt(sse / n), cov, se, free, ok: !!inv && Number.isFinite(sse) && dof > 0 && p.b > 0 };
}

/** A sensible start for a cycle that begins near tMin and peaks near (tMax, vMax). */
export function startFor(tMin: number, tMax: number, vMax: number, c: number, lead = 0.5): Shape {
  const x = peakX(c), t0 = tMin - lead, b = Math.max(0.5, (tMax - t0) / x);
  const g = (x * x * x) / (Math.exp(x * x) - c);
  return { a: Math.max(vMax, 1) / (b * b * b * g), b, t0, c };
}
/** Fit from a few starting t0 values (lead times before the minimum) and keep the best. */
export function fitCycle(t: number[], y: number[], tMin: number, tMax: number, vMax: number, c: number, free: ('a' | 'b' | 't0')[] = ['a', 'b', 't0'], b?: number): Fit {
  let best: Fit | null = null;
  for (const lead of [0, 0.5, 1, 1.5, 2]) {
    const s = startFor(tMin, tMax, vMax, c, lead);
    if (b) { s.b = b; const x = peakX(c), g = (x * x * x) / (Math.exp(x * x) - c); s.a = Math.max(vMax, 1) / (b * b * b * g); s.t0 = Math.min(tMin - lead, tMax - x * b); }
    const f = fitShape(t, y, s, free);
    if (f.ok && (!best || f.sse < best.sse)) best = f;
  }
  return best ?? fitShape(t, y, startFor(tMin, tMax, vMax, c), free);
}

// ---------- random numbers ----------
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  const u = () => { s = (s + 0x6d2b79f5) >>> 0; let x = s; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  let spare: number | null = null;
  const normal = () => {
    if (spare !== null) { const v = spare; spare = null; return v; }
    let a = 0; while (a === 0) a = u();
    const r = Math.sqrt(-2 * Math.log(a)), th = 2 * Math.PI * u();
    spare = r * Math.sin(th); return r * Math.cos(th);
  };
  return { u, normal };
}
/** Lower-triangular Cholesky factor (null if not positive definite). */
export function cholesky(C: number[][]): number[][] | null {
  const n = C.length, L = C.map(() => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
    let s = C[i][j];
    for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
    if (i === j) { if (!(s > 0)) return null; L[i][i] = Math.sqrt(s); } else L[i][j] = s / L[j][j];
  }
  return L;
}
/** The q-quantile (0 to 1) of a list, with linear interpolation (numpy's default). */
export function quantile(xs: number[], q: number): number {
  const s = xs.filter(Number.isFinite).sort((p, r) => p - r);
  if (!s.length) return NaN;
  const h = (s.length - 1) * q, i = Math.floor(h);
  return i + 1 < s.length ? s[i] + (h - i) * (s[i + 1] - s[i]) : s[i];
}

export type Forecast = {
  method: 'free' | 'past'; fit: Fit; grid: number[]; mid: number[]; lo: number[]; hi: number[];
  peakT: [number, number, number]; peakV: [number, number, number]; draws: number; used: number;
};
/**
 * The current cycle carried on. 'free': a, b and t0 fitted to the months since the last minimum; the band is the
 * spread of curves with parameters drawn from the fit's covariance (draws with a ≤ 0 or b ≤ 0 are left out). 'past': b drawn from the spread (mean and
 * standard deviation) of b over the completed cycles, a and t0 refitted for each draw, then a and t0 drawn from that
 * fit's covariance. `level` is the band's coverage (0.68 or 0.95). Same seed, same answer.
 */
export function forecast(t: number[], y: number[], tMin: number, c: number, grid: number[], method: 'free' | 'past', pastB: number[], level = 0.95, draws = 500, seed = 1): Forecast | null {
  if (!t.length) return null;
  let iMax = 0; y.forEach((v, i) => { if (v > y[iMax]) iMax = i; });
  const tMax = Math.max(t[iMax], tMin + 1), vMax = Math.max(y[iMax], 1);
  const R = rng(seed), qlo = (1 - level) / 2, qhi = 1 - qlo;
  const curves: number[][] = [], pT: number[] = [], pV: number[] = [];
  let fit: Fit;
  if (method === 'free') {
    fit = fitCycle(t, y, tMin, tMax, vMax, c);
    if (!fit.ok) return null;
    const L = cholesky(fit.cov);
    if (!L) return null;
    const m = [fit.p.a, fit.p.b, fit.p.t0];
    for (let d = 0; d < draws; d++) {
      const z = [R.normal(), R.normal(), R.normal()];
      const v = m.map((x, i) => x + L[i].reduce((s, l, j) => s + l * z[j], 0));
      if (!(v[0] > 0 && v[1] > 0)) continue; // a cycle with no size or no width is not a cycle
      const p = { a: v[0], b: v[1], t0: v[2], c };
      curves.push(grid.map((g) => shape(g, p))); const pk = peakOf(p); pT.push(pk.t); pV.push(pk.v);
    }
  } else {
    const nb = pastB.length;
    if (nb < 2) return null;
    const mb = pastB.reduce((s, x) => s + x, 0) / nb, sb = Math.sqrt(pastB.reduce((s, x) => s + (x - mb) ** 2, 0) / (nb - 1));
    fit = fitCycle(t, y, tMin, tMax, vMax, c, ['a', 't0'], mb);
    if (!fit.ok) return null;
    for (let d = 0; d < draws; d++) {
      const b = mb + sb * R.normal(), z1 = R.normal(), z2 = R.normal();
      if (!(b > 0.2)) continue;
      const f = fitShape(t, y, { ...fit.p, b, a: fit.p.a * (mb / b) ** 3 }, ['a', 't0']);
      const L = f.ok ? cholesky(f.cov) : null;
      if (!L) continue;
      const p = { a: f.p.a + L[0][0] * z1, b, t0: f.p.t0 + L[1][0] * z1 + L[1][1] * z2, c };
      if (!(p.a > 0)) continue;
      curves.push(grid.map((g) => shape(g, p))); const pk = peakOf(p); pT.push(pk.t); pV.push(pk.v);
    }
  }
  if (curves.length < draws / 2) return null;
  const col = (i: number) => curves.map((cv) => cv[i]);
  const pk = peakOf(fit.p);
  return {
    method, fit, grid, draws, used: curves.length,
    mid: grid.map((g) => shape(g, fit.p)),
    lo: grid.map((_, i) => quantile(col(i), qlo)),
    hi: grid.map((_, i) => quantile(col(i), qhi)),
    peakT: [pk.t, quantile(pT, qlo), quantile(pT, qhi)],
    peakV: [pk.v, quantile(pV, qlo), quantile(pV, qhi)],
  };
}

// ---------- everything together ----------
export type Cycle = {
  n: number; iMin: number; iNext: number | null; iMax: number | null;
  tMin: number; vMin: number; tMax: number; vMax: number; rise: number; length: number;
  fit: Fit | null; complete: boolean;
};
export type Opts = { gapYears: number; c: number; firstNumber: number; fitTo: 'monthly' | 'smoothed'; method: 'free' | 'past' | 'auto'; level: number; draws?: number; seed?: number };
export type Result = {
  pts: Point[]; S: number[]; ext: Extremes; cycles: Cycle[]; current: Cycle | null; fc: Forecast | null;
  meanLen: number; sdLen: number; method: 'free' | 'past' | null; note: string;
};

export function analyse(pts: Point[], o: Opts): Result {
  const v = pts.map((p) => p.v), S = smooth13(v), t = pts.map((p) => p.t);
  const k = Math.max(6, Math.round((o.gapYears * 12) / 2));
  const ext = findExtremes(S, k);
  const Y = o.fitTo === 'smoothed' ? S : v;
  const cycles: Cycle[] = [];
  const seg = (a: number, b: number) => { const tt: number[] = [], yy: number[] = []; for (let i = a; i <= b; i++) if (Number.isFinite(Y[i])) { tt.push(t[i]); yy.push(Y[i]); } return { tt, yy }; };
  ext.minima.forEach((iMin, c) => {
    const iNext = c + 1 < ext.minima.length ? ext.minima[c + 1] : null;
    const iMax = ext.maxima.find((m) => m > iMin && (iNext === null || m < iNext)) ?? null;
    const complete = iNext !== null;
    let fit: Fit | null = null;
    if (complete && iMax !== null) {
      const { tt, yy } = seg(iMin, iNext!);
      if (tt.length >= 12) fit = fitCycle(tt, yy, t[iMin], t[iMax], S[iMax], o.c);
      if (fit && !fit.ok) fit = null;
    }
    cycles.push({
      n: o.firstNumber + c, iMin, iNext, iMax, tMin: t[iMin], vMin: S[iMin],
      tMax: iMax !== null ? t[iMax] : NaN, vMax: iMax !== null ? S[iMax] : NaN,
      rise: iMax !== null ? t[iMax] - t[iMin] : NaN, length: complete ? t[iNext!] - t[iMin] : NaN, fit, complete,
    });
  });
  const done = cycles.filter((c) => c.complete);
  const lens = done.map((c) => c.length), nL = lens.length;
  const meanLen = nL ? lens.reduce((s, x) => s + x, 0) / nL : NaN;
  const sdLen = nL > 1 ? Math.sqrt(lens.reduce((s, x) => s + (x - meanLen) ** 2, 0) / (nL - 1)) : NaN;
  const current = cycles.length && !cycles[cycles.length - 1].complete ? cycles[cycles.length - 1] : null;
  let fc: Forecast | null = null, method: 'free' | 'past' | null = null, note = '';
  if (current) {
    const pastB = done.map((c) => c.fit?.p.b).filter((b): b is number => b !== undefined && Number.isFinite(b));
    const { tt, yy } = seg(current.iMin, pts.length - 1);
    method = o.method === 'auto' ? (pastB.length >= 2 ? 'past' : 'free') : o.method;
    const span = Number.isFinite(meanLen) ? meanLen + Math.max(2, 2 * (sdLen || 1)) : 14;
    const g0 = current.tMin, g1 = Math.max(current.tMin + span, t[t.length - 1] + 1);
    const grid: number[] = [];
    for (let i = 0; g0 + i / 12 <= g1 + 1e-9; i++) grid.push(g0 + i / 12); // month centres, as the data
    if (method === 'past' && pastB.length < 2) note = 'The shape from past cycles needs at least two complete, fitted cycles.';
    else if (method === 'free' && tt.length < 24) note = 'A free fit needs at least 24 months since the last minimum; use the shape from past cycles or wait.';
    else if (tt.length < 6) note = 'At least 6 months since the last minimum are needed to carry the cycle on.';
    else {
      fc = forecast(tt, yy, current.tMin, o.c, grid, method, pastB, o.level, o.draws ?? 500, o.seed ?? 1);
      if (!fc) note = 'The fit to the current cycle did not settle; there may be too few months since the minimum.';
    }
  } else if (cycles.length) note = 'The last minimum closes a cycle; there is no cycle in progress to carry on.';
  return { pts, S, ext, cycles, current, fc, meanLen, sdLen, method, note };
}

// ---------- made-up example ----------
/** The made-up cycles behind the example (start t0, peak height, b), not real solar data. */
export const EXAMPLE_CYCLES: { t0: number; A: number; b: number }[] = [
  { t0: 1967.0, A: 110, b: 3.8 },
  { t0: 1978.3, A: 135, b: 3.6 },
  { t0: 1989.5, A: 170, b: 3.3 },
  { t0: 2000.2, A: 115, b: 3.9 },
  { t0: 2011.4, A: 90, b: 4.3 },
  { t0: 2022.9, A: 125, b: 3.7 },
];
export const EXAMPLE_C = 0.7;
/** A made-up monthly series, January 1976 to October 2026: the cycles above added up, with seeded noise. */
export function exampleSeries(): string {
  const R = rng(215), x = peakX(EXAMPLE_C), g = (x * x * x) / (Math.exp(x * x) - EXAMPLE_C);
  const P = EXAMPLE_CYCLES.map((cy) => ({ a: cy.A / (cy.b ** 3 * g), b: cy.b, t0: cy.t0, c: EXAMPLE_C }));
  const lines = ['# Made-up example, NOT real sunspot numbers: month, value'];
  for (let y = 1976; y <= 2026; y++) for (let m = 1; m <= 12; m++) {
    if (y === 2026 && m > 10) break;
    const tt = decYear(y, m), f = P.reduce((s, p) => s + shape(tt, p), 0);
    const v = Math.max(0, f + R.normal() * (4 + 0.15 * f));
    lines.push(`${ym(y, m)},${v.toFixed(1)}`);
  }
  return lines.join('\n');
}
