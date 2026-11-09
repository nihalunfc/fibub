// Shewhart control charts (X̄-R, X̄-S, I-MR, p, np, c, u), Western Electric and Nelson run rules, and process
// capability (Cp, Cpk, Pp, Ppk with confidence intervals). Constants come from eng-spc.ts (computed, not
// tabled). No DOM.
import { d2, d3, c4, chi2Inv } from './eng-spc.ts';
import { normInv, normCdf } from './stats.ts';

export type ChartKind = 'xbar-r' | 'xbar-s' | 'i-mr' | 'p' | 'np' | 'c' | 'u';
/** One plotted statistic with its own centre line and limits (limits vary point to point for p and u). */
export type Plot = { name: string; y: number[]; cl: number; ucl: number[]; lcl: number[]; sigma: number[] };
export type ChartResult = { kind: ChartKind; main: Plot; second?: Plot; sigmaWithin?: number; n?: number; mean?: number; constants: Record<string, number> };

const avg = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
export function sampleSd(a: number[]) { const m = avg(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); }
const rep = (v: number, n: number) => new Array(n).fill(v);

/** Variables charts from equal-sized subgroups (each an array of n ≥ 2 values). */
export function xbarChart(groups: number[][], kind: 'xbar-r' | 'xbar-s'): ChartResult {
  const n = groups[0].length, k = groups.length;
  if (groups.some((g) => g.length !== n)) throw new Error('Every subgroup needs the same size.');
  if (n < 2) throw new Error('Subgroups need at least 2 values.');
  const means = groups.map(avg), xbb = avg(means);
  if (kind === 'xbar-r') {
    const R = groups.map((g) => Math.max(...g) - Math.min(...g)), rbar = avg(R), D2 = d2(n), D3c = d3(n);
    const A2 = 3 / (D2 * Math.sqrt(n)), D3 = Math.max(0, 1 - (3 * D3c) / D2), D4 = 1 + (3 * D3c) / D2, s = rbar / D2;
    return { kind, n, mean: xbb, sigmaWithin: s, constants: { d2: D2, d3: D3c, A2, D3, D4 },
      main: { name: 'Subgroup mean X̄', y: means, cl: xbb, ucl: rep(xbb + A2 * rbar, k), lcl: rep(xbb - A2 * rbar, k), sigma: rep(s / Math.sqrt(n), k) },
      second: { name: 'Range R', y: R, cl: rbar, ucl: rep(D4 * rbar, k), lcl: rep(D3 * rbar, k), sigma: rep(D3c * s, k) } };
  }
  const S = groups.map(sampleSd), sbar = avg(S), C4 = c4(n);
  const A3 = 3 / (C4 * Math.sqrt(n)), w = (3 * Math.sqrt(1 - C4 * C4)) / C4, B3 = Math.max(0, 1 - w), B4 = 1 + w, s = sbar / C4;
  return { kind, n, mean: xbb, sigmaWithin: s, constants: { c4: C4, A3, B3, B4 },
    main: { name: 'Subgroup mean X̄', y: means, cl: xbb, ucl: rep(xbb + A3 * sbar, k), lcl: rep(xbb - A3 * sbar, k), sigma: rep(s / Math.sqrt(n), k) },
    second: { name: 'Standard deviation S', y: S, cl: sbar, ucl: rep(B4 * sbar, k), lcl: rep(B3 * sbar, k), sigma: rep(s * Math.sqrt(1 - C4 * C4), k) } };
}

/** Individuals and moving range (span 2). */
export function imrChart(x: number[]): ChartResult {
  const N = x.length, mr = x.slice(1).map((v, i) => Math.abs(v - x[i])), mrbar = avg(mr), D2 = d2(2), D3c = d3(2), s = mrbar / D2, m = avg(x);
  const D4 = 1 + (3 * D3c) / D2;
  return { kind: 'i-mr', n: 1, mean: m, sigmaWithin: s, constants: { d2: D2, d3: D3c, D4 },
    main: { name: 'Individual value', y: x, cl: m, ucl: rep(m + 3 * s, N), lcl: rep(m - 3 * s, N), sigma: rep(s, N) },
    // The first point has no moving range; the MR chart starts at the second observation.
    second: { name: 'Moving range MR', y: [NaN, ...mr], cl: mrbar, ucl: rep(D4 * mrbar, N), lcl: rep(0, N), sigma: rep(D3c * s, N) } };
}

/** Attribute charts. p: count d of defectives in samples of size n; np: same with constant n; c: defect counts; u: defects in n units. */
export function attributeChart(kind: 'p' | 'np' | 'c' | 'u', count: number[], size: number[]): ChartResult {
  const N = count.length;
  if (kind === 'p' || kind === 'np') {
    const pbar = count.reduce((a, b) => a + b, 0) / size.reduce((a, b) => a + b, 0);
    if (kind === 'p') {
      const sd = size.map((n) => Math.sqrt((pbar * (1 - pbar)) / n));
      return { kind, constants: { pbar }, main: { name: 'Proportion defective p', y: count.map((d, i) => d / size[i]), cl: pbar, ucl: sd.map((s) => Math.min(1, pbar + 3 * s)), lcl: sd.map((s) => Math.max(0, pbar - 3 * s)), sigma: sd } };
    }
    const n = size[0];
    if (size.some((v) => v !== n)) throw new Error('An np chart needs the same sample size every time; use a p chart for varying sizes.');
    const s = Math.sqrt(n * pbar * (1 - pbar));
    return { kind, constants: { pbar, n }, main: { name: 'Number defective np', y: count, cl: n * pbar, ucl: rep(n * pbar + 3 * s, N), lcl: rep(Math.max(0, n * pbar - 3 * s), N), sigma: rep(s, N) } };
  }
  if (kind === 'c') {
    const cbar = avg(count), s = Math.sqrt(cbar);
    return { kind, constants: { cbar }, main: { name: 'Defects c', y: count, cl: cbar, ucl: rep(cbar + 3 * s, N), lcl: rep(Math.max(0, cbar - 3 * s), N), sigma: rep(s, N) } };
  }
  const ubar = count.reduce((a, b) => a + b, 0) / size.reduce((a, b) => a + b, 0), sd = size.map((n) => Math.sqrt(ubar / n));
  return { kind, constants: { ubar }, main: { name: 'Defects per unit u', y: count.map((c, i) => c / size[i]), cl: ubar, ucl: sd.map((s) => ubar + 3 * s), lcl: sd.map((s) => Math.max(0, ubar - 3 * s)), sigma: sd } };
}

export type RuleSet = 'we' | 'nelson' | 'limits';
export const RULE_TEXT: Record<number, string> = {
  1: '1 point beyond the 3σ limits',
  2: '9 points in a row on one side of the centre line',
  3: '6 points in a row all rising or all falling',
  4: '14 points in a row alternating up and down',
  5: '2 of 3 points beyond 2σ on the same side',
  6: '4 of 5 points beyond 1σ on the same side',
  7: '15 points in a row within 1σ of the centre line',
  8: '8 points in a row beyond 1σ, on either side',
  9: '8 points in a row on one side of the centre line',
};
/**
 * Run rules on a plot, using each point's own σ (z = (y − CL)/σ). Western Electric: rules 1, 5, 6 and 9 above.
 * Nelson: rules 1 to 8. 'limits': rule 1 only. A rule flags the point that completes the pattern.
 * Returns, per point, the list of rule numbers it breaks. NaN points are skipped.
 */
export function runRules(p: Plot, set: RuleSet): number[][] {
  const N = p.y.length, out: number[][] = p.y.map(() => []);
  const z = p.y.map((y, i) => (y - p.cl) / p.sigma[i]);
  const idx = z.map((v, i) => i).filter((i) => Number.isFinite(z[i]));
  const flag = (i: number, r: number) => { if (!out[i].includes(r)) out[i].push(r); };
  idx.forEach((i) => { if (p.y[i] > p.ucl[i] + 1e-12 || p.y[i] < p.lcl[i] - 1e-12) flag(i, 1); });
  if (set === 'limits') return out;
  const zs = idx.map((i) => z[i]), ys = idx.map((i) => p.y[i]);
  const run = (len: number, test: (w: number[], wy: number[]) => boolean, rule: number) => {
    for (let e = len - 1; e < zs.length; e++) if (test(zs.slice(e - len + 1, e + 1), ys.slice(e - len + 1, e + 1))) flag(idx[e], rule);
  };
  const oneSide = (w: number[]) => w.every((v) => v > 0) || w.every((v) => v < 0);
  // For the 2-of-3 and 4-of-5 rules the last point must itself be one of the points beyond the line.
  run(3, (w) => (w[2] > 2 && w.filter((v) => v > 2).length >= 2) || (w[2] < -2 && w.filter((v) => v < -2).length >= 2), 5);
  run(5, (w) => (w[4] > 1 && w.filter((v) => v > 1).length >= 4) || (w[4] < -1 && w.filter((v) => v < -1).length >= 4), 6);
  if (set === 'we') { run(8, oneSide, 9); return out; }
  run(9, oneSide, 2);
  run(6, (_, w) => w.every((v, i) => i === 0 || v > w[i - 1]) || w.every((v, i) => i === 0 || v < w[i - 1]), 3);
  run(14, (_, w) => { const d = w.slice(1).map((v, i) => v - w[i]); return d.every((v, i) => v !== 0 && (i === 0 || v * d[i - 1] < 0)); }, 4);
  run(15, (w) => w.every((v) => Math.abs(v) < 1), 7);
  run(8, (w) => w.every((v) => Math.abs(v) > 1), 8);
  return out;
}

export type Capability = {
  N: number; mean: number; sWithin: number; sOverall: number; lsl: number; usl: number;
  Cp: number; Cpk: number; Pp: number; Ppk: number; CPL: number; CPU: number; PPL: number; PPU: number;
  ci: { Cp: [number, number]; Cpk: [number, number]; Pp: [number, number]; Ppk: [number, number] }; conf: number; dfWithin: number;
  ppmWithin: number; ppmOverall: number; ppmObserved: number;
};
/**
 * Capability from all values, the within-subgroup σ and the specification limits (either may be NaN for a one-sided
 * spec). CIs: Cp and Pp from the chi-square distribution; Cpk and Ppk from Bissell's (1990) normal approximation,
 * Ĉ ± z √(1/(9N) + Ĉ²/(2ν)). ν = N − 1 for the overall indices; for the within indices ν = dfWithin.
 */
export function capability(all: number[], sWithin: number, lsl: number, usl: number, conf = 0.95, dfWithin = all.length - 1): Capability {
  const N = all.length, mean = avg(all), sOverall = sampleSd(all), a = 1 - conf, z = normInv(1 - a / 2);
  const two = Number.isFinite(lsl) && Number.isFinite(usl);
  const ix = (s: number) => {
    const cp = two ? (usl - lsl) / (6 * s) : NaN, cpu = Number.isFinite(usl) ? (usl - mean) / (3 * s) : NaN, cpl = Number.isFinite(lsl) ? (mean - lsl) / (3 * s) : NaN;
    return { cp, cpu, cpl, cpk: Math.min(Number.isFinite(cpu) ? cpu : Infinity, Number.isFinite(cpl) ? cpl : Infinity) };
  };
  const w = ix(sWithin), o = ix(sOverall);
  const chiCI = (c: number, nu: number): [number, number] => [c * Math.sqrt(chi2Inv(a / 2, nu) / nu), c * Math.sqrt(chi2Inv(1 - a / 2, nu) / nu)];
  const bis = (c: number, nu: number): [number, number] => { const h = z * Math.sqrt(1 / (9 * N) + (c * c) / (2 * nu)); return [c - h, c + h]; };
  const ppm = (s: number) => 1e6 * ((Number.isFinite(lsl) ? normCdf((lsl - mean) / s) : 0) + (Number.isFinite(usl) ? 1 - normCdf((usl - mean) / s) : 0));
  const obs = (1e6 * all.filter((v) => (Number.isFinite(lsl) && v < lsl) || (Number.isFinite(usl) && v > usl)).length) / N;
  return {
    N, mean, sWithin, sOverall, lsl, usl, Cp: w.cp, Cpk: w.cpk, Pp: o.cp, Ppk: o.cpk, CPL: w.cpl, CPU: w.cpu, PPL: o.cpl, PPU: o.cpu,
    ci: { Cp: two ? chiCI(w.cp, dfWithin) : [NaN, NaN], Cpk: bis(w.cpk, dfWithin), Pp: two ? chiCI(o.cp, N - 1) : [NaN, NaN], Ppk: bis(o.cpk, N - 1) },
    conf, dfWithin, ppmWithin: ppm(sWithin), ppmOverall: ppm(sOverall), ppmObserved: obs,
  };
}

/** Seeded made-up examples. */
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function normal(u: () => number) { return () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u()); }
/** 25 subgroups of 5 fill weights (g) around 500.0, σ 0.5, with the mean shifted up by 0.6 g from subgroup 19. */
export function exampleVariables(): number[][] {
  const z = normal(rng(690));
  return Array.from({ length: 25 }, (_, i) => Array.from({ length: 5 }, () => +(500 + (i >= 18 ? 0.6 : 0) + 0.5 * z()).toFixed(2)));
}
/** 25 samples of 200 items with the number defective (p about 4 %, one bad lot). */
export function exampleDefectives(): number[][] {
  const u = rng(6901);
  return Array.from({ length: 25 }, (_, i) => { const p = i === 13 ? 0.11 : 0.04; let d = 0; for (let k = 0; k < 200; k++) if (u() < p) d++; return [d, 200]; });
}
/** 25 inspections: defects found and the number of units inspected (u chart), or defects alone (c chart). */
export function exampleDefects(): number[][] {
  const u = rng(6902);
  const pois = (lam: number) => { let L = Math.exp(-lam), k = 0, p = 1; do { k++; p *= u(); } while (p > L); return k - 1; };
  return Array.from({ length: 25 }, (_, i) => { const n = 8 + Math.floor(u() * 5); return [pois((i === 20 ? 2.2 : 0.9) * n), n]; });
}
