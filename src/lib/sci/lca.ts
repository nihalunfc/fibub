// Simple two-product life cycle comparison for one impact (e.g. kg CO₂e): each input is an amount times the user's own
// factor, counted once per product made or once per use. Totals for a number of uses (a new product each time one wears
// out), the break-even number of uses, how much each input would have to change to flip the result, and a Monte Carlo
// run with each factor spread evenly within ± its uncertainty. No factors are built in. No DOM.
import { rng } from './floodfreq.ts';

export type Row = { p: 'A' | 'B'; stage: string; item: string; amount: number; factor: number; perUse: boolean; unc: number }; // unc: fraction
export type Life = { A: number; B: number }; // uses per product before it is replaced

/** How many times a row counts over n uses. */
export const count = (r: Row, life: Life, n: number) => (r.perUse ? n : Math.ceil(n / life[r.p] - 1e-9));

export function totals(rows: Row[], life: Life, n: number, f?: number[]) {
  const by = { A: new Map<string, number>(), B: new Map<string, number>() }, contrib: number[] = [];
  let A = 0, B = 0;
  rows.forEach((r, i) => {
    const c = r.amount * (f ? f[i] : r.factor) * count(r, life, n);
    contrib.push(c);
    by[r.p].set(r.stage, (by[r.p].get(r.stage) ?? 0) + c);
    if (r.p === 'A') A += c; else B += c;
  });
  return { A, B, byA: by.A, byB: by.B, contrib };
}

/** First number of uses (1…max) at which the better product changes; NaN when it never does in that range. */
export function breakEven(rows: Row[], life: Life, max = 100000) {
  const s0 = Math.sign(totals(rows, life, 1).A - totals(rows, life, 1).B);
  for (let n = 2; n <= max; n++) { const t = totals(rows, life, n), s = Math.sign(t.A - t.B); if (s !== s0) return n; }
  return NaN;
}

/** Fractional change in each row's impact that would make the two totals equal at n uses (−1 = remove it entirely). */
export function flips(rows: Row[], life: Life, n: number) {
  const t = totals(rows, life, n), d = t.A - t.B;
  return rows.map((r, i) => { const c = t.contrib[i]; if (!(c > 0)) return NaN; return (r.p === 'A' ? -d : d) / c; });
}

/** Monte Carlo: each factor × (1 + unc·U(−1, 1)). Returns P(A lower than B) and percentiles of B − A. */
export function monteCarlo(rows: Row[], life: Life, n: number, draws = 10000, seed = 1) {
  const R = rng(seed), diff: number[] = [];
  let aWins = 0;
  for (let k = 0; k < draws; k++) {
    const f = rows.map((r) => r.factor * (1 + r.unc * (2 * R() - 1)));
    const t = totals(rows, life, n, f);
    if (t.A < t.B) aWins++;
    diff.push(t.B - t.A);
  }
  diff.sort((a, b) => a - b);
  const q = (p: number) => diff[Math.min(draws - 1, Math.max(0, Math.round(p * (draws - 1))))];
  return { pA: aWins / draws, p5: q(0.05), p50: q(0.5), p95: q(0.95) };
}
