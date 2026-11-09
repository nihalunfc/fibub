// Crossed gauge R&R study (parts × operators × trials): ANOVA method (two-way random effects with
// interaction, interaction pooled when not significant) and the average and range method. No DOM.
import { fSf } from './stats.ts';
import { d2, d2star } from './eng-spc.ts';

/** y[part][operator][trial] */
export type Study = { parts: string[]; ops: string[]; y: number[][][] };

/** Read rows of "part, operator, value[, value …]" (header row optional) into a balanced crossed study. */
export function readStudy(rows: string[][], toNum: (s: string) => number): Study {
  const parts: string[] = [], ops: string[] = [], cells = new Map<string, number[]>();
  let first = true;
  for (const r of rows) {
    if (r.length < 3) { if (r.some((c) => c.trim())) throw new Error('Each row needs a part, an operator and at least one measurement.'); continue; }
    const vals = r.slice(2).filter((c) => c.trim() !== '').map(toNum);
    if (first && vals.some((v) => !Number.isFinite(v))) { first = false; continue; } // header
    first = false;
    if (vals.some((v) => !Number.isFinite(v))) throw new Error(`"${r.slice(2).join(' ')}" is not a number (part ${r[0]}, operator ${r[1]}).`);
    const p = r[0].trim(), o = r[1].trim();
    if (!parts.includes(p)) parts.push(p);
    if (!ops.includes(o)) ops.push(o);
    const k = p + '\u0000' + o; cells.set(k, [...(cells.get(k) ?? []), ...vals]);
  }
  const y = parts.map((p) => ops.map((o) => cells.get(p + '\u0000' + o) ?? []));
  return { parts, ops, y };
}

export function checkStudy(s: Study): string | null {
  if (s.parts.length < 2) return 'The study needs at least 2 parts (10 is usual).';
  if (s.ops.length < 2) return 'The study needs at least 2 operators (or appraisers).';
  const r = s.y[0][0].length;
  for (let i = 0; i < s.parts.length; i++) for (let j = 0; j < s.ops.length; j++) {
    if (!s.y[i][j].length) return `Part ${s.parts[i]} has no measurement by operator ${s.ops[j]}. Every operator must measure every part.`;
    if (s.y[i][j].length !== r) return `Part ${s.parts[i]} by operator ${s.ops[j]} has ${s.y[i][j].length} trials, but part ${s.parts[0]} by ${s.ops[0]} has ${r}. Every cell needs the same number of trials.`;
  }
  if (r < 2) return 'Each operator must measure each part at least twice (2 or 3 trials).';
  return null;
}

const mean = (a: number[]) => a.reduce((x, v) => x + v, 0) / a.length;

export type AnovaRow = { source: string; df: number; ss: number; ms: number; f: number; p: number };
export type Components = { repeat: number; reprod: number; op: number; po: number; grr: number; part: number; total: number };
export type GrrResult = {
  p: number; o: number; r: number; table: AnovaRow[]; pooled: boolean; pInteraction: number; v: Components;
  pctContribution: Components; pctStudy: Components; pctTol: Components | null; ndc: number; k: number;
};

/** ANOVA gauge R&R. alphaRemove: interaction p-value above which it is pooled into repeatability (0 = never pool). */
export function anovaGRR(s: Study, opts: { alphaRemove?: number; k?: number; tol?: number } = {}): GrrResult {
  const p = s.parts.length, o = s.ops.length, r = s.y[0][0].length, alpha = opts.alphaRemove ?? 0.05, k = opts.k ?? 6;
  const all = s.y.flat(2), g = mean(all);
  const pm = s.y.map((row) => mean(row.flat())), om = s.ops.map((_, j) => mean(s.y.map((row) => row[j]).flat()));
  const cm = s.y.map((row) => row.map(mean));
  const ssP = o * r * pm.reduce((x, v) => x + (v - g) ** 2, 0);
  const ssO = p * r * om.reduce((x, v) => x + (v - g) ** 2, 0);
  let ssPO = 0, ssE = 0;
  for (let i = 0; i < p; i++) for (let j = 0; j < o; j++) { ssPO += r * (cm[i][j] - pm[i] - om[j] + g) ** 2; for (const v of s.y[i][j]) ssE += (v - cm[i][j]) ** 2; }
  const ssT = all.reduce((x, v) => x + (v - g) ** 2, 0);
  const dfP = p - 1, dfO = o - 1, dfPO = dfP * dfO, dfE = p * o * (r - 1);
  const msP = ssP / dfP, msO = ssO / dfO, msPO = ssPO / dfPO, msE = ssE / dfE;
  const fPO = msPO / msE, pPO = fSf(fPO, dfPO, dfE);
  const pooled = alpha > 0 && pPO > alpha;
  let table: AnovaRow[], v: Components;
  const nn = (x: number) => Math.max(0, x);
  if (!pooled) {
    table = [
      { source: 'Part', df: dfP, ss: ssP, ms: msP, f: msP / msPO, p: fSf(msP / msPO, dfP, dfPO) },
      { source: 'Operator', df: dfO, ss: ssO, ms: msO, f: msO / msPO, p: fSf(msO / msPO, dfO, dfPO) },
      { source: 'Part × Operator', df: dfPO, ss: ssPO, ms: msPO, f: fPO, p: pPO },
      { source: 'Repeatability', df: dfE, ss: ssE, ms: msE, f: NaN, p: NaN },
      { source: 'Total', df: p * o * r - 1, ss: ssT, ms: NaN, f: NaN, p: NaN },
    ];
    const po = nn((msPO - msE) / r), op = nn((msO - msPO) / (p * r)), part = nn((msP - msPO) / (o * r));
    v = { repeat: msE, op, po, reprod: op + po, grr: 0, part, total: 0 };
  } else {
    const dfR = dfPO + dfE, msR = (ssPO + ssE) / dfR;
    table = [
      { source: 'Part', df: dfP, ss: ssP, ms: msP, f: msP / msR, p: fSf(msP / msR, dfP, dfR) },
      { source: 'Operator', df: dfO, ss: ssO, ms: msO, f: msO / msR, p: fSf(msO / msR, dfO, dfR) },
      { source: 'Repeatability', df: dfR, ss: ssPO + ssE, ms: msR, f: NaN, p: NaN },
      { source: 'Total', df: p * o * r - 1, ss: ssT, ms: NaN, f: NaN, p: NaN },
    ];
    const op = nn((msO - msR) / (p * r)), part = nn((msP - msR) / (o * r));
    v = { repeat: msR, op, po: 0, reprod: op, grr: 0, part, total: 0 };
  }
  v.grr = v.repeat + v.reprod; v.total = v.grr + v.part;
  return { p, o, r, table, pooled, pInteraction: pPO, v, k, ...percents(v, k, opts.tol) };
}

function percents(v: Components, k: number, tol?: number) {
  const keys = Object.keys(v) as (keyof Components)[];
  const map = (f: (x: number) => number) => Object.fromEntries(keys.map((key) => [key, f(v[key])])) as Components;
  return {
    pctContribution: map((x) => (100 * x) / v.total),
    pctStudy: map((x) => (100 * Math.sqrt(x)) / Math.sqrt(v.total)),
    pctTol: tol && tol > 0 ? map((x) => (100 * k * Math.sqrt(x)) / tol) : null,
    // Number of distinct categories: √2 × σ_part / σ_GRR, truncated (AIAG; 1.41 in older editions).
    ndc: v.grr > 0 ? Math.max(1, Math.floor(Math.SQRT2 * Math.sqrt(v.part / v.grr) + 1e-12)) : Infinity,
  };
}

export type XbarRResult = {
  rbar: number; xdiff: number; rp: number; K1: number; K2: number; K3: number;
  ev: number; av: number; grr: number; pv: number; tv: number; ndc: number;
  pctStudy: { ev: number; av: number; grr: number; pv: number }; pctTol: { ev: number; av: number; grr: number; pv: number } | null;
  opMeans: number[]; opRbar: number[]; partMeans: number[]; ranges: number[][];
};

/**
 * Average and range method (AIAG MSA): EV = R̄̄·K1, AV = √((X̄diff·K2)² − EV²/(n·r)), PV = Rp·K3, with
 * K1 = 1/d2(r), K2 = 1/d2*(o, 1), K3 = 1/d2*(p, 1). Results are standard deviations (multiply by k for spreads).
 */
export function averageRange(s: Study, opts: { k?: number; tol?: number } = {}): XbarRResult {
  const p = s.parts.length, o = s.ops.length, r = s.y[0][0].length, k = opts.k ?? 6;
  const ranges = s.y.map((row) => row.map((c) => Math.max(...c) - Math.min(...c)));
  const opRbar = s.ops.map((_, j) => mean(ranges.map((row) => row[j])));
  const opMeans = s.ops.map((_, j) => mean(s.y.map((row) => row[j]).flat()));
  const partMeans = s.y.map((row) => mean(row.flat()));
  const rbar = mean(opRbar), xdiff = Math.max(...opMeans) - Math.min(...opMeans), rp = Math.max(...partMeans) - Math.min(...partMeans);
  const K1 = 1 / d2(r), K2 = 1 / d2star(o, 1), K3 = 1 / d2star(p, 1);
  const ev = rbar * K1, av = Math.sqrt(Math.max(0, (xdiff * K2) ** 2 - (ev * ev) / (p * r)));
  const grr = Math.hypot(ev, av), pv = rp * K3, tv = Math.hypot(grr, pv);
  const pct = (x: number) => (100 * x) / tv;
  return {
    rbar, xdiff, rp, K1, K2, K3, ev, av, grr, pv, tv, ndc: grr > 0 ? Math.max(1, Math.floor(Math.SQRT2 * (pv / grr) + 1e-12)) : Infinity,
    pctStudy: { ev: pct(ev), av: pct(av), grr: pct(grr), pv: pct(pv) },
    pctTol: opts.tol && opts.tol > 0 ? { ev: (100 * k * ev) / opts.tol, av: (100 * k * av) / opts.tol, grr: (100 * k * grr) / opts.tol, pv: (100 * k * pv) / opts.tol } : null,
    opMeans, opRbar, partMeans, ranges,
  };
}

/** Made-up example: 10 parts, 3 operators, 3 trials (seeded), values in mm around 12. */
export function exampleStudy(): string[][] {
  let seed = 689;
  const u = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const nrm = () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
  const partTrue = Array.from({ length: 10 }, () => 12 + 0.1 * nrm()), opBias = [0, 0.025, -0.015];
  const rows: string[][] = [];
  ['A', 'B', 'C'].forEach((op, j) => partTrue.forEach((t, i) => rows.push([String(i + 1), op, ...[0, 1, 2].map(() => (t + opBias[j] + 0.02 * nrm()).toFixed(3))])));
  return rows;
}
