// Classical plant growth analysis from destructive harvests (Hunt 1982; Hunt et al. 2002). Plain maths; no DOM.
// RGR = relative growth rate, ULR (NAR) = unit leaf rate, LAR = leaf area ratio, SLA = specific leaf area,
// LWR = leaf weight ratio. Interval means: RGR = (ln W2 − ln W1)/(t2 − t1);
// ULR = (W2 − W1)/(t2 − t1) × (ln LA2 − ln LA1)/(LA2 − LA1) (exact when W and LA are linearly related);
// LAR, SLA and LWR = the mean of the two harvest values.
import { tInv } from './stats.ts';

export type Plant = { t: number; w: number; la: number; lw: number };
export type Harvest = { t: number; n: number; w: number; la: number; lw: number; lnW: number; sdLnW: number; lar: number; sla: number; lwr: number };
export type Interval = {
  t1: number; t2: number; rgr: number; rgrSe: number; rgrLo: number; rgrHi: number;
  ulr: number; lar: number; sla: number; lwr: number; agr: number;
};

const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
const sdv = (a: number[]) => { if (a.length < 2) return NaN; const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };

/** Group plants by harvest time and take means. Leaf mass may be NaN (then SLA and LWR are NaN). */
export function harvests(plants: Plant[]): Harvest[] {
  const times = [...new Set(plants.map((p) => p.t))].sort((a, b) => a - b);
  return times.map((t) => {
    const ps = plants.filter((p) => p.t === t), lws = ps.map((p) => p.lw);
    const w = mean(ps.map((p) => p.w)), la = mean(ps.map((p) => p.la)), lw = lws.every(Number.isFinite) ? mean(lws) : NaN;
    const ln = ps.map((p) => Math.log(p.w));
    return { t, n: ps.length, w, la, lw, lnW: mean(ln), sdLnW: sdv(ln), lar: la / w, sla: la / lw, lwr: lw / w };
  });
}

/**
 * Mean values over the interval between two harvests. `rgrFrom` 'lnmean' uses the mean of ln W per harvest
 * (Hoffmann and Poorter 2002, with a standard error and confidence interval); 'mean' uses ln of the mean W (classical).
 */
export function interval(a: Harvest, b: Harvest, rgrFrom: 'lnmean' | 'mean' = 'lnmean', conf = 0.95): Interval {
  const dt = b.t - a.t;
  const rgr = rgrFrom === 'lnmean' ? (b.lnW - a.lnW) / dt : (Math.log(b.w) - Math.log(a.w)) / dt;
  let rgrSe = NaN, rgrLo = NaN, rgrHi = NaN;
  if (a.n > 1 && b.n > 1 && rgrFrom === 'lnmean') {
    rgrSe = Math.sqrt(a.sdLnW ** 2 / a.n + b.sdLnW ** 2 / b.n) / dt;
    const tq = tInv(1 - (1 - conf) / 2, a.n + b.n - 2);
    rgrLo = rgr - tq * rgrSe; rgrHi = rgr + tq * rgrSe;
  }
  const dW = (b.w - a.w) / dt;
  const ulr = Math.abs(b.la - a.la) < 1e-12 * Math.max(a.la, 1) ? dW / a.la : dW * (Math.log(b.la) - Math.log(a.la)) / (b.la - a.la);
  return { t1: a.t, t2: b.t, rgr, rgrSe, rgrLo, rgrHi, ulr, agr: dW, lar: (a.lar + b.lar) / 2, sla: (a.sla + b.sla) / 2, lwr: (a.lwr + b.lwr) / 2 };
}

/** Intervals between each pair of consecutive harvests, plus first to last when there are three or more harvests. */
export function analyse(plants: Plant[], rgrFrom: 'lnmean' | 'mean' = 'lnmean', conf = 0.95) {
  const hs = harvests(plants);
  const ints = hs.slice(1).map((h, i) => interval(hs[i], h, rgrFrom, conf));
  const whole = hs.length > 2 ? interval(hs[0], hs[hs.length - 1], rgrFrom, conf) : null;
  return { harvests: hs, intervals: ints, whole };
}
