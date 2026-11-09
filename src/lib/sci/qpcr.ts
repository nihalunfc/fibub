// qPCR analysis: standard curves (Cq against log10 quantity) with efficiency and quantification of unknowns, and relative
// expression normalised to one or more reference genes with per-gene efficiencies (2^-ΔΔCq when every efficiency is
// 100 %). Replicate spread is carried through as a standard deviation in log space, as in the ΔΔCq method. No DOM.

export type Curve = { slope: number; intercept: number; r2: number; n: number; seSlope: number; amp: number; eff: number; effLo: number; effHi: number };
/** Least-squares line Cq = slope × log10(quantity) + intercept, with efficiency E = 10^(−1/slope) − 1. */
export function stdCurve(q: number[], cq: number[]): Curve {
  const n = q.length, x = q.map(Math.log10), mx = x.reduce((a, b) => a + b, 0) / n, my = cq.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (cq[i] - my); syy += (cq[i] - my) ** 2; }
  const slope = sxy / sxx, intercept = my - slope * mx, sse = Math.max(0, syy - slope * sxy);
  const seSlope = n > 2 ? Math.sqrt(sse / (n - 2) / sxx) : NaN, amp = 10 ** (-1 / slope);
  const e = (s: number) => 10 ** (-1 / s) - 1;
  const a = e(slope - seSlope), b = e(slope + seSlope);
  return { slope, intercept, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : 1, n, seSlope, amp, eff: amp - 1, effLo: Math.min(a, b), effHi: Math.max(a, b) };
}
/** Quantity of an unknown from its Cq on a curve. */
export const quantify = (c: Curve, cq: number) => 10 ** ((cq - c.intercept) / c.slope);

export const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
export const sd = (v: number[]) => { if (v.length < 2) return 0; const m = mean(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)); };

export type Well = { sample: string; gene: string; cq: number };
export type RelRow = { sample: string; target: string; dCq: number; ddCq: number; nrq: number; lo: number; hi: number; sdLog2: number; n: number };
/**
 * Relative expression of each target against the reference genes, relative to the control sample.
 * For each gene, RQ = amp^(mean Cq in control − mean Cq in sample); NRQ = RQ_target / geometric mean of RQ_refs.
 * amp is the amplification factor (2 for 100 % efficiency). The range is NRQ × 2^(±sd), with sd in log2 units from the
 * sample's replicate SDs (the control's spread is not added, as in Livak and Schmittgen's method).
 */
export function relative(wells: Well[], refs: string[], control: string, amp: Record<string, number> = {}) {
  const key = (s: string, g: string) => `${s}\u0000${g}`;
  const groups = new Map<string, number[]>();
  for (const w of wells) { const k = key(w.sample, w.gene); if (!groups.has(k)) groups.set(k, []); groups.get(k)!.push(w.cq); }
  const samples = [...new Set(wells.map((w) => w.sample))], genes = [...new Set(wells.map((w) => w.gene))];
  const targets = genes.filter((g) => !refs.includes(g)), A = (g: string) => amp[g] ?? 2;
  const stat = (s: string, g: string) => { const v = groups.get(key(s, g)); return v && v.length ? { m: mean(v), s: sd(v), n: v.length } : null; };
  const rows: RelRow[] = [];
  for (const s of samples) for (const t of targets) {
    const ts = stat(s, t), tc = stat(control, t);
    const rs = refs.map((r) => ({ r, s: stat(s, r), c: stat(control, r) }));
    if (!ts || !tc || rs.some((x) => !x.s || !x.c)) continue;
    const log2rqT = (tc.m - ts.m) * Math.log2(A(t));
    const log2rqR = rs.reduce((a, x) => a + (x.c!.m - x.s!.m) * Math.log2(A(x.r)), 0) / refs.length;
    const l2 = log2rqT - log2rqR;
    const sdLog2 = Math.sqrt((Math.log2(A(t)) * ts.s) ** 2 + rs.reduce((a, x) => a + ((Math.log2(A(x.r)) * x.s!.s) / refs.length) ** 2, 0));
    const refMean = (sm: string) => mean(refs.map((r) => stat(sm, r)!.m));
    const dCq = ts.m - refMean(s), ddCq = dCq - (tc.m - refMean(control));
    rows.push({ sample: s, target: t, dCq, ddCq, nrq: 2 ** l2, lo: 2 ** (l2 - sdLog2), hi: 2 ** (l2 + sdLog2), sdLog2, n: ts.n });
  }
  const reps = [...groups.entries()].map(([k, v]) => { const [sample, gene] = k.split('\u0000'); return { sample, gene, mean: mean(v), sd: sd(v), n: v.length, spread: Math.max(...v) - Math.min(...v) }; });
  return { rows, reps, samples, genes, targets };
}
