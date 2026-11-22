// How many extra bookings to accept when some customers cancel or do not show up.
// Each booking turns up with probability p (the show rate), so arrivals from L bookings follow a binomial law.
// For every booking limit L = capacity + k we work out the expected number served, the expected number
// turned away ("walked") and the chance anyone is walked, then pick the k with the best expected value.
const lnF: number[] = [0];
const lnFact = (n: number) => { for (let i = lnF.length; i <= n; i++) lnF[i] = lnF[i - 1] + Math.log(i); return lnF[n]; };

export function erf(x: number) { // Abramowitz and Stegun 7.1.26
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}

/** pmf[j] = P(arrivals = lo + j) for n bookings that each turn up with probability p. */
export function binom(n: number, p: number): { lo: number; pmf: number[] } {
  if (n <= 0 || p <= 0) return { lo: 0, pmf: [1] };
  if (p >= 1) return { lo: n, pmf: [1] };
  if (n > 3000) { // normal approximation for big groups
    const mu = n * p, sd = Math.sqrt(n * p * (1 - p));
    const lo = Math.max(0, Math.floor(mu - 9 * sd)), hi = Math.min(n, Math.ceil(mu + 9 * sd));
    const Phi = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));
    const pmf: number[] = []; for (let k = lo; k <= hi; k++) pmf.push(Phi((k + 0.5 - mu) / sd) - Phi((k - 0.5 - mu) / sd));
    const s = pmf.reduce((a, b) => a + b, 0); return { lo, pmf: pmf.map((x) => x / s) };
  }
  lnFact(n);
  const lp = Math.log(p), lq = Math.log(1 - p), pmf = new Array<number>(n + 1);
  for (let k = 0; k <= n; k++) pmf[k] = Math.exp(lnF[n] - lnF[k] - lnF[n - k] + k * lp + (n - k) * lq);
  return { lo: 0, pmf };
}

export type Stats = { mean: number; filled: number; empty: number; walked: number; pw: number };
/** L bookings, C places: expected arrivals, places filled, places empty, people walked and the chance of walking anyone. */
export function stats(L: number, C: number, p: number): Stats {
  const { lo, pmf } = binom(L, p);
  let filled = 0, walked = 0, pw = 0, mean = 0;
  for (let j = 0; j < pmf.length; j++) {
    const s = lo + j, q = pmf[j];
    mean += q * s; filled += q * Math.min(s, C);
    if (s > C) { walked += q * (s - C); pw += q; }
  }
  return { mean, filled, empty: C - filled, walked, pw };
}

export type Level = Stats & { k: number; L: number; ev: number; gain: number };
export type Analysis = { rows: Level[]; best: Level; bestFree: Level; view: Level[] };
/** All overbooking levels for one night. `cap` is the most chance of walking anyone you accept (0 to 1), or null for no cap. */
export function analyse(C: number, p: number, value: number, walkCost: number, cap: number | null): Analysis {
  const auto = Math.ceil((C * (1 - p)) / Math.max(p, 0.05) * 2) + 12;
  const maxK = Math.min(Math.max(12, auto), 600);
  const rows: Level[] = [];
  let best: Level | null = null, bestFree: Level | null = null;
  for (let k = 0; k <= maxK; k++) {
    const st = stats(C + k, C, p);
    const ev = value * st.filled - walkCost * st.walked;
    const r = { k, L: C + k, ...st, ev, gain: 0 };
    rows.push(r);
    if (!bestFree || ev > bestFree.ev + 1e-9) bestFree = r;
    const ok = cap == null || st.pw <= cap + 1e-12;
    if (ok && (!best || ev > best.ev + 1e-9)) best = r;
  }
  if (!best) best = rows[0];
  rows.forEach((r) => (r.gain = r.ev - rows[0].ev));
  const far = Math.max(best.k, bestFree!.k);
  const showTo = Math.min(rows.length - 1, far + Math.max(8, Math.ceil(0.4 * far)));
  return { rows, best, bestFree: bestFree!, view: rows.slice(0, showTo + 1) };
}

/** Share of bookings that turn up, from the cancellation rate and the no-show rate (both in percent). */
export const showRate = (cancelPct: number, noShowPct: number) => (1 - cancelPct / 100) * (1 - noShowPct / 100);
