// Radiocarbon calibration against a curve such as IntCal20: the probability of each calendar
// age given a measured 14C age, P(θ) ∝ exp(−(r − μ(θ))² / 2(σ² + s(θ)²)) / √(σ² + s(θ)²),
// and its highest posterior density (HPD) ranges, as OxCal and the R package rintcal report them.

export type Curve = { cal: Float64Array; c14: Float64Array; err: Float64Array };
export function readCurve(text: string): Curve {
  const rows = text.split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.trim().split(/[\s,]+/).map(Number)).filter((r) => r.length >= 3 && r.every(Number.isFinite));
  rows.sort((a, b) => a[0] - b[0]);
  return { cal: Float64Array.from(rows, (r) => r[0]), c14: Float64Array.from(rows, (r) => r[1]), err: Float64Array.from(rows, (r) => r[2]) };
}
/** Curve value and error at a calendar age, by linear interpolation. */
export function at(c: Curve, t: number): [number, number] {
  const n = c.cal.length;
  if (t <= c.cal[0]) return [c.c14[0], c.err[0]];
  if (t >= c.cal[n - 1]) return [c.c14[n - 1], c.err[n - 1]];
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c.cal[m] <= t) lo = m; else hi = m; }
  const f = (t - c.cal[lo]) / (c.cal[hi] - c.cal[lo]);
  return [c.c14[lo] + f * (c.c14[hi] - c.c14[lo]), c.err[lo] + f * (c.err[hi] - c.err[lo])];
}

export type Calibrated = { t: Float64Array; p: Float64Array; hpd: { level: number; ranges: [number, number, number][] }[]; median: number; mean: number; outside: boolean };
/**
 * Calibrate a 14C age (BP) with 1σ error. Probabilities are on a yearly grid of calendar years BP
 * (normalised to sum to 1). HPD ranges list [older, younger, probability] in cal BP.
 */
export function calibrate(c: Curve, age: number, sigma: number, levels = [0.683, 0.954]): Calibrated {
  if (!(sigma > 0)) throw new Error('The error must be above zero');
  const lo = c.cal[0], hi = c.cal[c.cal.length - 1];
  // Only the part of the curve within reach of the date matters: search ±(6σ + 2000) in 14C years.
  const t: number[] = [], p: number[] = [];
  for (let x = lo; x <= hi; x++) {
    const [m, e] = at(c, x), v = sigma * sigma + e * e, z = age - m;
    if (Math.abs(z) > 8 * Math.sqrt(v)) continue;
    t.push(x); p.push(Math.exp((-z * z) / (2 * v)) / Math.sqrt(v));
  }
  const outside = !t.length || age > Math.max(...c.c14.slice(-20)) || age < c.c14[0] - 3 * sigma;
  if (!t.length) throw new Error('This age is outside the calibration curve');
  // Fill the gaps inside the range with zero so ranges are contiguous years.
  const t0 = t[0], t1 = t[t.length - 1], N = t1 - t0 + 1, T = new Float64Array(N), P = new Float64Array(N);
  for (let i = 0; i < N; i++) T[i] = t0 + i;
  t.forEach((x, i) => (P[x - t0] = p[i]));
  const sum = P.reduce((s, v) => s + v, 0);
  for (let i = 0; i < N; i++) P[i] /= sum;
  let acc = 0, median = NaN, mean = 0;
  for (let i = 0; i < N; i++) { mean += T[i] * P[i]; acc += P[i]; if (Number.isNaN(median) && acc >= 0.5) median = T[i]; }
  // HPD: take years from the most probable down until the level is reached, then join neighbours.
  const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => P[b] - P[a]);
  const hpd = levels.map((level) => {
    const keep = new Uint8Array(N); let s = 0;
    for (const i of order) { if (s >= level) break; keep[i] = 1; s += P[i]; }
    const ranges: [number, number, number][] = [];
    for (let i = 0; i < N; i++) {
      if (!keep[i]) continue;
      let j = i, q = 0; while (j < N && keep[j]) { q += P[j]; j++; }
      ranges.push([T[j - 1], T[i], q]); i = j;
    }
    // Join ranges split by a gap of a year or two: noise of the yearly grid, not a real break (OxCal's rounding hides these too).
    const merged: [number, number, number][] = [];
    for (const r of ranges) { const last = merged[merged.length - 1]; if (last && r[1] - last[0] <= 3) { last[0] = r[0]; last[2] += r[2]; } else merged.push([...r]); }
    return { level, ranges: merged.reverse() };
  });
  return { t: T, p: P, hpd, median, mean, outside };
}
/** cal BP to a calendar year: BC/AD (BCE/CE), with 1950 as 0 BP. There is no year 0. */
export const calYear = (bp: number) => { const y = 1950 - bp; return y > 0 ? { year: y, era: 'AD' } : { year: 1 - y, era: 'BC' }; };
