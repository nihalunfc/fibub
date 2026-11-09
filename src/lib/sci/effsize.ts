// Effect size conversions between Cohen's d, Hedges' g, r, odds ratios, eta squared, Cohen's f, Cohen's w and
// Cliff's delta, from a reported effect size or from a t, F or chi-square statistic and the sample sizes. Plain
// functions, no DOM. Formulas: Borenstein, Hedges, Higgins and Rothstein (2009), Introduction to Meta-Analysis,
// chapter 7; Lakens (2013), Frontiers in Psychology 4:863; Cliff's delta and the common-language effect size
// under normality, delta = 2Φ(d/√2) − 1 (McGraw and Wong 1992).
import { normCdf, normInv } from './stats.ts';
import { hedgesJ } from './hyptest.ts';

export type From = 'd' | 'g' | 'r' | 'or' | 'logor' | 't-ind' | 't-paired' | 'f-stat' | 'chi2' | 'eta2' | 'cohen-f' | 'cliff';
export type Input = {
  from: From; value: number;
  /** Group sizes for two-group designs (both optional; when missing, a = 4, as for equal groups). */
  n1?: number; n2?: number;
  /** Number of pairs (paired t), or total N (r, chi-square). */
  n?: number;
  /** F statistic degrees of freedom. */
  df1?: number; df2?: number;
  /** Chi-square degrees of freedom (1 for a 2 x 2 table) and the smaller table dimension. */
  chiDf?: number; minDim?: number;
  /** Number of groups for eta squared and Cohen's f (2 means the two-group conversions apply). */
  k?: number;
  conf?: number;
};
export type Row = { key: string; name: string; value: number; ci?: [number, number]; note?: string };
export type Result = { rows: Row[]; d?: number; dCi?: [number, number]; notes: string[] };

/**
 * a in r = d / √(d² + a). With group sizes, a = N (N − 2) / (n1 n2), which makes r the sample point-biserial
 * correlation exactly (r = t / √(t² + df)); without them, the large-sample value 4 for equal groups.
 */
export const aOf = (n1?: number, n2?: number) => (n1 && n2 ? ((n1 + n2) * (n1 + n2 - 2)) / (n1 * n2) : 4);
export const dToR = (d: number, a = 4) => d / Math.sqrt(d * d + a);
export const rToD = (r: number, a = 4) => (Math.sqrt(a) * r) / Math.sqrt(1 - r * r);
export const dToLogOr = (d: number) => (d * Math.PI) / Math.sqrt(3);
export const logOrToD = (l: number) => (l * Math.sqrt(3)) / Math.PI;
export const dToCliff = (d: number) => 2 * normCdf(d / Math.SQRT2) - 1;
export const cliffToD = (c: number) => Math.SQRT2 * normInv((c + 1) / 2);
/** Variance of d for two independent groups (Borenstein et al. 2009, eq. 4.20). */
export const varD = (d: number, n1: number, n2: number) => (n1 + n2) / (n1 * n2) + (d * d) / (2 * (n1 + n2));
/** Variance of dz for paired data, treating dz as a one-sample d (1/n + dz²/2n). */
export const varDz = (d: number, n: number) => 1 / n + (d * d) / (2 * n);

/** Every effect size the input can be converted to, with intervals where a standard one exists. */
export function convert(inp: Input): Result {
  const conf = inp.conf ?? 0.95, z = normInv(1 - (1 - conf) / 2), v = inp.value;
  const notes: string[] = [], rows: Row[] = [];
  if (!Number.isFinite(v)) throw new Error('Type the value to convert.');
  const pos = (x: number | undefined, what: string, min = 1) => { if (x === undefined || !Number.isFinite(x)) return undefined; if (!(x >= min)) throw new Error(`${what} must be at least ${min}.`); return x; };
  let n1 = pos(inp.n1, 'Group 1 size', 2), n2 = pos(inp.n2, 'Group 2 size', 2);
  const n = pos(inp.n, 'The sample size', 2);
  if ((n1 === undefined) !== (n2 === undefined)) throw new Error('Give both group sizes, or neither.');
  let d = NaN, dVar = NaN, paired = false, rCi: [number, number] | undefined, k = inp.k ?? 2;
  if (!(Number.isInteger(k) && k >= 2)) throw new Error('The number of groups must be a whole number, 2 or more.');

  // ---- reduce the input to d (two-group designs), or to the variance-explained family ----
  let eta2 = NaN, eta2Ci: [number, number] | undefined, omega2 = NaN, w = NaN, V = NaN, partial = false;
  switch (inp.from) {
    case 'd': d = v; break;
    case 'g': {
      if (n1 && n2) d = v / hedgesJ(n1 + n2 - 2); else { d = v; notes.push("Without group sizes, g is treated as d (they differ by under 1 % above about 40 subjects)."); }
      break;
    }
    case 'r': {
      if (!(v > -1 && v < 1)) throw new Error('r must be between −1 and 1.');
      d = rToD(v, aOf(n1, n2));
      const N = n ?? (n1 && n2 ? n1 + n2 : undefined);
      if (N && N > 3) { const zr = Math.atanh(v), se = 1 / Math.sqrt(N - 3); rCi = [Math.tanh(zr - z * se), Math.tanh(zr + z * se)]; }
      if (rCi && !(n1 && n2)) dVar = -1; // interval comes from the Fisher z interval of r
      break;
    }
    case 'or': if (!(v > 0)) throw new Error('An odds ratio must be above zero.'); d = logOrToD(Math.log(v)); break;
    case 'logor': d = logOrToD(v); break;
    case 't-ind': {
      if (!(n1 && n2)) throw new Error('Give both group sizes for an independent t test.');
      d = v * Math.sqrt(1 / n1 + 1 / n2); break;
    }
    case 't-paired': {
      if (!n) throw new Error('Give the number of pairs.');
      d = v / Math.sqrt(n); paired = true; dVar = varDz(d, n); break;
    }
    case 'f-stat': {
      if (!(v >= 0)) throw new Error('F cannot be negative.');
      const df1 = pos(inp.df1, 'The first degrees of freedom'), df2 = pos(inp.df2, 'The second degrees of freedom');
      if (!df1 || !df2) throw new Error('Give both degrees of freedom of the F test, for example F(2, 27).');
      eta2 = (v * df1) / (v * df1 + df2); partial = true;
      const N = df1 + df2 + 1;
      omega2 = Math.max(0, (df1 * (v - 1)) / (df1 * (v - 1) + N));
      k = df1 + 1;
      if (df1 === 1) {
        if (!(n1 && n2)) { n1 = n2 = (df2 + 2) / 2; notes.push(`Group sizes taken as equal (${n1} each) from df2 = ${df2}.`); }
        else if (n1 + n2 - 2 !== df2) throw new Error(`For a two-group F test, df2 should be n1 + n2 − 2 = ${n1 + n2 - 2}.`);
        d = Math.sqrt(v) * Math.sqrt(1 / n1 + 1 / n2);
        notes.push('F(1, df) = t², so d is given as positive: set its sign from which group scored higher.');
      }
      break;
    }
    case 'chi2': {
      if (!(v >= 0)) throw new Error('Chi-square cannot be negative.');
      if (!n) throw new Error('Give the total number of subjects N.');
      const df = pos(inp.chiDf, 'The degrees of freedom') ?? 1, m = pos(inp.minDim, 'The smaller table dimension', 2) ?? 2;
      w = Math.sqrt(v / n); V = w / Math.sqrt(m - 1);
      if (df === 1) {
        const r = w; d = rToD(r, aOf(n1, n2));
        if (n > 3) { const zr = Math.atanh(r), se = 1 / Math.sqrt(n - 3); rCi = [Math.tanh(zr - z * se), Math.tanh(zr + z * se)]; if (!(n1 && n2)) dVar = -1; } notes.push('For a 2 × 2 table, phi = √(χ²/N) is used as r (its sign is lost: set it from the direction of the effect).'); }
      break;
    }
    case 'eta2': {
      if (!(v >= 0 && v < 1)) throw new Error('Eta squared must be from 0 to just under 1.');
      eta2 = v;
      if (k === 2) d = rToD(Math.sqrt(v), aOf(n1, n2));
      break;
    }
    case 'cohen-f': {
      if (!(v >= 0)) throw new Error("Cohen's f cannot be negative.");
      eta2 = (v * v) / (1 + v * v);
      if (k === 2) d = rToD(Math.sqrt(eta2), aOf(n1, n2));
      break;
    }
    case 'cliff': {
      if (!(v > -1 && v < 1)) throw new Error("Cliff's delta must be between −1 and 1.");
      d = cliffToD(v); notes.push("Cliff's delta converts to d only if both groups are normal with equal spread."); break;
    }
  }

  // ---- interval for d ----
  let dCi: [number, number] | undefined;
  if (Number.isFinite(d)) {
    if (!Number.isFinite(dVar) && n1 && n2) dVar = varD(d, n1, n2);
    const a = aOf(n1, n2);
    if (dVar === -1 && rCi) dCi = [rToD(rCi[0], a), rToD(rCi[1], a)];
    else if (Number.isFinite(dVar)) dCi = [d - z * Math.sqrt(dVar), d + z * Math.sqrt(dVar)];
    const J = n1 && n2 ? hedgesJ(n1 + n2 - 2) : paired && n ? hedgesJ(n - 1) : NaN;
    const map = (f: (x: number) => number): [number, number] | undefined => (dCi ? [f(dCi[0]), f(dCi[1])] : undefined);
    rows.push({ key: 'd', name: paired ? "Cohen's dz" : "Cohen's d", value: d, ci: dCi, note: paired ? 'mean difference ÷ SD of the differences' : 'difference in means ÷ pooled SD' });
    if (Number.isFinite(J)) rows.push({ key: 'g', name: paired ? "Hedges' gz" : "Hedges' g", value: d * J, ci: map((x) => x * J), note: `d × J, J = ${J.toFixed(4)} (small-sample correction)` });
    if (!paired) {
      const r = inp.from === 'r' ? v : dToR(d, a);
      rows.push({ key: 'r', name: inp.from === 'chi2' ? 'r (phi)' : 'r (point-biserial)', value: r, ci: rCi ?? map((x) => dToR(x, a)), note: rCi ? 'Fisher z interval' : n1 && n2 ? `r = d / √(d² + a), a = N(N − 2)/(n1 n2) = ${a.toFixed(3)}` : 'r = d / √(d² + 4), equal groups' });
      const lor = inp.from === 'logor' ? v : inp.from === 'or' ? Math.log(v) : dToLogOr(d);
      rows.push({ key: 'logor', name: 'log odds ratio', value: lor, ci: map(dToLogOr), note: 'logistic approximation, ln OR = d π / √3' });
      rows.push({ key: 'or', name: 'Odds ratio', value: Math.exp(lor), ci: map((x) => Math.exp(dToLogOr(x))) });
      if (!Number.isFinite(eta2)) eta2 = r * r;
      if (!eta2Ci && dCi && inp.from !== 'f-stat') eta2Ci = (() => { const [lo, hi] = (rCi ?? map((x) => dToR(x, a)))!; return lo <= 0 && hi >= 0 ? [0, Math.max(lo * lo, hi * hi)] as [number, number] : [Math.min(lo * lo, hi * hi), Math.max(lo * lo, hi * hi)] as [number, number]; })();
    }
    rows.push({ key: 'cliff', name: "Cliff's delta (approx.)", value: dToCliff(d), ci: map(dToCliff), note: '2Φ(d/√2) − 1, assuming normal groups with equal spread' });
    rows.push({ key: 'cl', name: 'Probability of superiority', value: normCdf(d / Math.SQRT2), ci: map((x) => normCdf(x / Math.SQRT2)), note: 'chance a random member of group 1 beats one of group 2 (also the AUC)' });
    rows.push({ key: 'u3', name: "Cohen's U3", value: normCdf(d), note: 'share of group 1 above the mean of group 2' });
    rows.push({ key: 'overlap', name: 'Overlap of the two curves', value: 2 * normCdf(-Math.abs(d) / 2) });
    const delta = dToCliff(d);
    rows.push({ key: 'nnt', name: 'NNT (Kraemer)', value: delta !== 0 ? 1 / Math.abs(delta) : Infinity, note: 'number needed to treat for one extra success, 1 / |Cliff\'s delta|' });
  }
  if (Number.isFinite(eta2)) {
    const name = partial ? 'Partial η²' : 'η² (eta squared)';
    rows.push({ key: 'eta2', name, value: eta2, ci: eta2Ci, note: partial ? 'F df1 / (F df1 + df2); equals η² in a one-way design' : k === 2 ? 'r², share of variance explained' : 'share of variance explained' });
    if (Number.isFinite(omega2)) rows.push({ key: 'omega2', name: partial ? 'Partial ω²' : 'ω²', value: omega2, note: 'less biased than η²: df1 (F − 1) / (df1 (F − 1) + N), N = df1 + df2 + 1' });
    rows.push({ key: 'f', name: "Cohen's f", value: Math.sqrt(eta2 / (1 - eta2)), note: '√(η² / (1 − η²))' });
  }
  if (Number.isFinite(w)) {
    rows.push({ key: 'w', name: "Cohen's w (phi for 2 × 2)", value: w, note: '√(χ² / N)' });
    rows.push({ key: 'V', name: "Cramér's V", value: V, note: 'w / √(smaller dimension − 1)' });
  }
  if (!rows.length) throw new Error('Nothing to convert.');
  return { rows, d: Number.isFinite(d) ? d : undefined, dCi, notes };
}

/** Rough size labels: Cohen (1988) for d, r, f, w; Cohen's η² bands; Romano et al. (2006) for Cliff's delta; odds
 * ratios use the d bands carried through ln OR = d π / √3 (1.44, 2.48, 4.27). */
export function sizeLabel(key: string, x: number): string {
  const a = Math.abs(x);
  const b = (c: number[]) => (a < c[0] ? 'negligible' : a < c[1] ? 'small' : a < c[2] ? 'medium' : 'large');
  switch (key) {
    case 'd': case 'g': return b([0.2, 0.5, 0.8]);
    case 'r': case 'w': case 'V': return b([0.1, 0.3, 0.5]);
    case 'eta2': case 'omega2': return b([0.01, 0.06, 0.14]);
    case 'f': return b([0.1, 0.25, 0.4]);
    case 'cliff': return b([0.147, 0.33, 0.474]);
    case 'or': case 'logor': { const l = key === 'or' ? Math.abs(Math.log(x)) : a; return l < 0.3628 ? 'negligible' : l < 0.9069 ? 'small' : l < 1.4510 ? 'medium' : 'large'; }
    default: return '';
  }
}
