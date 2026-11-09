// Meta-analysis for study and teaching: effect sizes from 2×2 counts (log odds ratio, log risk ratio, risk
// difference), from means and SDs (mean difference, standardised mean difference as Hedges' g) or typed in as an
// estimate with its SE or confidence interval; fixed-effect inverse-variance pooling; random effects with
// DerSimonian-Laird, REML or Paule-Mandel between-study variance; Cochran's Q, I², tau², the prediction interval
// and Egger's regression test for funnel-plot asymmetry. No DOM.
// Sources: DerSimonian and Laird (1986) Controlled Clinical Trials 7:177; Paule and Mandel (1982) J Res NBS 87:377;
// Viechtbauer (2005) J Educ Behav Stat 30:261 (REML); Higgins and Thompson (2002) Stat Med 21:1539 (I²);
// Higgins, Thompson and Spiegelhalter (2009) JRSS A 172:137 (prediction interval); Egger et al. (1997) BMJ
// 315:629; Hedges (1981) J Educ Stat 6:107 and the Cochrane Handbook (Hedges' g and its variance, as RevMan).
// Results match Python's statsmodels.stats.meta_analysis (combine_effects, effectsize_smd, effectsize_2proportions).
import { normCdf, normInv, tInv, tTwoSided } from './stats.ts';
import { chi2Sf } from './survival.ts';
import { parseTable, num } from './num.ts';

export type Study = { name: string; y: number; v: number; note?: string };
export type Measure = 'OR' | 'RR' | 'RD' | 'MD' | 'SMD' | 'generic' | 'ratio';
export const isRatio = (m: Measure) => m === 'OR' || m === 'RR' || m === 'ratio';

/** Effect and variance from a 2×2 table: events and totals in group 1 (treatment) and group 2 (control). */
export function twoByTwo(e1: number, n1: number, e2: number, n2: number, measure: 'OR' | 'RR' | 'RD', cc = 0.5) {
  // A zero (or all) cell: add cc to every cell, as statsmodels' zero_correction and RevMan do.
  const zero = e1 === 0 || e1 === n1 || e2 === 0 || e2 === n2;
  const c = zero ? cc : 0, N1 = n1 + 2 * c, N2 = n2 + 2 * c, p1 = (e1 + c) / N1, p2 = (e2 + c) / N2;
  if (measure === 'RD') return { y: p1 - p2, v: (p1 * (1 - p1)) / N1 + (p2 * (1 - p2)) / N2, corrected: zero };
  if (measure === 'RR') return { y: Math.log(p1) - Math.log(p2), v: (1 - p1) / p1 / N1 + (1 - p2) / p2 / N2, corrected: zero };
  return { y: Math.log(p1 / (1 - p1)) - Math.log(p2 / (1 - p2)), v: 1 / (p1 * (1 - p1) * N1) + 1 / (p2 * (1 - p2) * N2), corrected: zero };
}
/** Mean difference (group 1 − group 2) and its variance. */
export const meanDiff = (m1: number, s1: number, n1: number, m2: number, s2: number, n2: number) => ({ y: m1 - m2, v: (s1 * s1) / n1 + (s2 * s2) / n2 });
/** Hedges' g (bias-corrected standardised mean difference) and its variance, as RevMan and statsmodels. */
export function hedgesG(m1: number, s1: number, n1: number, m2: number, s2: number, n2: number) {
  const N = n1 + n2, sp = Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (N - 2));
  const g = (1 - 3 / (4 * N - 9)) * ((m1 - m2) / sp);
  return { y: g, v: N / (n1 * n2) + (g * g) / (2 * (N - 3.94)) };
}

export type Tau = 'DL' | 'REML' | 'PM';
export type Pooled = { est: number; se: number; lo: number; hi: number; z: number; p: number };
export type MetaResult = {
  k: number; fixed: Pooled; random: Pooled; tau2: number; tau: number; Q: number; df: number; pQ: number; I2: number; H2: number;
  pi: [number, number]; weightsFixed: number[]; weightsRandom: number[]; method: Tau;
  egger: { intercept: number; se: number; t: number; df: number; p: number; slope: number } | null;
};

function pool(y: number[], v: number[], tau2: number, z: number): Pooled {
  const w = v.map((x) => 1 / (x + tau2)), W = w.reduce((a, b) => a + b, 0);
  const est = w.reduce((s, wi, i) => s + wi * y[i], 0) / W, se = Math.sqrt(1 / W), zz = est / se;
  return { est, se, lo: est - z * se, hi: est + z * se, z: zz, p: 2 * normCdf(-Math.abs(zz)) };
}
/** Generalised Q at a given tau²: sum of w (y − mu)² with w = 1 / (v + tau²). */
function genQ(y: number[], v: number[], tau2: number) {
  const w = v.map((x) => 1 / (x + tau2)), W = w.reduce((a, b) => a + b, 0), mu = w.reduce((s, wi, i) => s + wi * y[i], 0) / W;
  return w.reduce((s, wi, i) => s + wi * (y[i] - mu) ** 2, 0);
}

export function tau2Of(y: number[], v: number[], method: Tau): number {
  const k = y.length, w = v.map((x) => 1 / x), W = w.reduce((a, b) => a + b, 0), W2 = w.reduce((a, b) => a + b * b, 0);
  const Q = genQ(y, v, 0), dl = Math.max(0, (Q - (k - 1)) / (W - W2 / W));
  if (method === 'DL' || k < 2) return dl;
  if (method === 'PM') {
    // Solve Q(tau²) = k − 1 (Q falls as tau² grows); zero when even tau² = 0 gives Q below k − 1.
    if (Q <= k - 1) return 0;
    let lo = 0, hi = Math.max(dl, 1e-8);
    while (genQ(y, v, hi) > k - 1) hi *= 2;
    for (let i = 0; i < 200 && hi - lo > 1e-15 * Math.max(1, hi); i++) { const m = (lo + hi) / 2; if (genQ(y, v, m) > k - 1) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  // REML by Fisher scoring from the DL value (Viechtbauer 2005), kept at zero or above.
  let t2 = dl;
  for (let it = 0; it < 500; it++) {
    const wi = v.map((x) => 1 / (x + t2)), S1 = wi.reduce((a, b) => a + b, 0), S2 = wi.reduce((a, b) => a + b * b, 0), S3 = wi.reduce((a, b) => a + b ** 3, 0);
    const mu = wi.reduce((s, x, i) => s + x * y[i], 0) / S1;
    const score = 0.5 * (wi.reduce((s, x, i) => s + x * x * (y[i] - mu) ** 2, 0) - S1 + S2 / S1);
    const info = 0.5 * (S2 - (2 * S3) / S1 + (S2 * S2) / (S1 * S1));
    let next = t2 + score / info;
    if (next < 0) next = 0;
    if (Math.abs(next - t2) < 1e-14 * Math.max(1, t2)) { t2 = next; break; }
    t2 = next;
  }
  return t2;
}

/** Fixed and random-effects meta-analysis of effects y with within-study variances v. */
export function metaAnalysis(y: number[], v: number[], method: Tau = 'DL', conf = 0.95): MetaResult {
  const k = y.length;
  if (k < 2) throw new Error('A meta-analysis needs at least two studies.');
  if (v.some((x) => !(x > 0))) throw new Error('Every study needs a variance (SE) greater than zero.');
  const z = normInv(1 - (1 - conf) / 2);
  const fixed = pool(y, v, 0, z), Q = genQ(y, v, 0), df = k - 1;
  const tau2 = tau2Of(y, v, method), random = pool(y, v, tau2, z);
  const I2 = Q > df ? (Q - df) / Q : 0;
  const tk = k >= 3 ? tInv(1 - (1 - conf) / 2, k - 2) : NaN, half = tk * Math.sqrt(tau2 + random.se ** 2);
  const wf = v.map((x) => 1 / x), wr = v.map((x) => 1 / (x + tau2)), sf = wf.reduce((a, b) => a + b, 0), sr = wr.reduce((a, b) => a + b, 0);
  return {
    k, fixed, random, tau2, tau: Math.sqrt(tau2), Q, df, pQ: chi2Sf(Q, df), I2, H2: Q / df, pi: [random.est - half, random.est + half],
    weightsFixed: wf.map((w) => w / sf), weightsRandom: wr.map((w) => w / sr), method, egger: egger(y, v),
  };
}

/** Egger's test: regress y/se on 1/se; an intercept far from 0 suggests small-study effects. Needs 3+ studies. */
export function egger(y: number[], v: number[]) {
  const k = y.length;
  if (k < 3) return null;
  const se = v.map(Math.sqrt), Y = y.map((x, i) => x / se[i]), X = se.map((s) => 1 / s);
  const mx = X.reduce((a, b) => a + b, 0) / k, my = Y.reduce((a, b) => a + b, 0) / k;
  const sxx = X.reduce((s, x) => s + (x - mx) ** 2, 0), sxy = X.reduce((s, x, i) => s + (x - mx) * (Y[i] - my), 0);
  const slope = sxy / sxx, intercept = my - slope * mx;
  const rss = Y.reduce((s, yy, i) => s + (yy - intercept - slope * X[i]) ** 2, 0), s2 = rss / (k - 2);
  const seI = Math.sqrt(s2 * (1 / k + (mx * mx) / sxx)), t = intercept / seI;
  return { intercept, se: seI, t, df: k - 2, p: tTwoSided(t, k - 2), slope };
}

export type InputKind = 'generic' | 'ci' | 'binary' | 'continuous';
/** Pasted study rows to effects. The first column is the study name. */
export function parseStudies(text: string, kind: InputKind, opts: { measure?: Measure; log?: boolean; conf?: number } = {}): { studies: Study[]; skipped: string[]; excluded: string[]; corrected: string[] } {
  const all = parseTable(text);
  if (!all.length) throw new Error('Paste your studies first, one per row.');
  const need = { generic: 3, ci: 4, binary: 5, continuous: 7 }[kind];
  const head = all[0].slice(1, need).some((c) => !Number.isFinite(num(c)));
  const body = head ? all.slice(1) : all;
  const studies: Study[] = [], skipped: string[] = [], excluded: string[] = [], corrected: string[] = [];
  const zc = normInv(1 - (1 - (opts.conf ?? 0.95)) / 2);
  body.forEach((r, i) => {
    const name = (r[0] ?? '').trim() || `Study ${i + 1}`, x = r.slice(1, need).map((c) => num(c));
    if (x.length < need - 1 || x.some((t) => !Number.isFinite(t))) { skipped.push(`${name}: needs ${need - 1} numbers after the name`); return; }
    if (kind === 'generic') {
      if (!(x[1] > 0)) { skipped.push(`${name}: the SE must be above zero`); return; }
      studies.push({ name, y: x[0], v: x[1] ** 2 });
    } else if (kind === 'ci') {
      let [e, l, u] = x;
      if (opts.log) { if (!(e > 0 && l > 0 && u > 0)) { skipped.push(`${name}: a ratio and its limits must be above zero`); return; } e = Math.log(e); l = Math.log(l); u = Math.log(u); }
      if (!(u > l)) { skipped.push(`${name}: the upper limit must be above the lower`); return; }
      studies.push({ name, y: e, v: ((u - l) / (2 * zc)) ** 2 });
    } else if (kind === 'binary') {
      const [e1, n1, e2, n2] = x;
      if (![e1, n1, e2, n2].every((t) => Number.isInteger(t) && t >= 0) || e1 > n1 || e2 > n2 || !n1 || !n2) { skipped.push(`${name}: events must be whole numbers from 0 to the group size`); return; }
      const m = (opts.measure ?? 'OR') as 'OR' | 'RR' | 'RD';
      if (m !== 'RD' && ((e1 === 0 && e2 === 0) || (e1 === n1 && e2 === n2))) { excluded.push(name); return; }
      const r2 = twoByTwo(e1, n1, e2, n2, m);
      if (r2.corrected) corrected.push(name);
      studies.push({ name, y: r2.y, v: r2.v });
    } else {
      const [m1, s1, n1, m2, s2, n2] = x;
      if (!(s1 > 0 && s2 > 0 && n1 >= 2 && n2 >= 2)) { skipped.push(`${name}: SDs must be above zero and each group needs 2 or more`); return; }
      studies.push({ name, ...(opts.measure === 'SMD' ? hedgesG(m1, s1, n1, m2, s2, n2) : meanDiff(m1, s1, n1, m2, s2, n2)) });
    }
  });
  return { studies, skipped, excluded, corrected };
}
