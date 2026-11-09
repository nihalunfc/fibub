// Classical hypothesis tests: t tests (one-sample, Student, Welch, paired), one-way ANOVA with Tukey HSD and
// the Brown-Forsythe (Levene, median) check, chi-square goodness of fit and independence, Fisher's exact test
// for 2 x 2 tables, Mann-Whitney U, Wilcoxon signed-rank, Kruskal-Wallis and Shapiro-Wilk. Plain functions,
// no DOM. Methods follow scipy.stats and statsmodels (pairwise_tukeyhsd); Shapiro-Wilk is Royston's (1995)
// algorithm AS R94, as in scipy and R.
import { logGamma, ibeta, tInv, fSf, normInv, normCdf } from './stats.ts';

export type Alt = 'two-sided' | 'less' | 'greater';

// ---------- distributions ----------

/** Regularised upper incomplete gamma Q(a, x) = 1 − P(a, x), computed directly so small tails keep their precision. */
export function gammaQ(a: number, x: number): number {
  if (!(x > 0)) return 1;
  if (!Number.isFinite(x)) return 0;
  const lg = a * Math.log(x) - x - logGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 100000; n++) { term *= x / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-16) break; }
    return Math.max(0, 1 - sum * Math.exp(lg));
  }
  let b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d;
  for (let i = 1; i < 100000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.min(1, Math.exp(lg) * h);
}
/** Chi-square upper tail P(X > x) with k degrees of freedom. */
export const chi2Sf = (x: number, k: number) => (x <= 0 ? 1 : gammaQ(k / 2, x / 2));
/** Standard normal upper tail P(Z > z), accurate far into the tail. */
export const normSf = (z: number) => (z >= 0 ? 0.5 * gammaQ(0.5, (z * z) / 2) : 1 - 0.5 * gammaQ(0.5, (z * z) / 2));
/** Student's t upper tail P(T > t). */
export function tSf(t: number, df: number) {
  const h = 0.5 * ibeta(df / (df + t * t), df / 2, 0.5);
  return t >= 0 ? h : 1 - h;
}
/** p-value of a t statistic for the chosen alternative. */
export const tP = (t: number, df: number, alt: Alt) => (alt === 'greater' ? tSf(t, df) : alt === 'less' ? tSf(-t, df) : Math.min(1, 2 * tSf(Math.abs(t), df)));
/** Bias correction J for Hedges' g with df degrees of freedom (exact gamma form). */
export const hedgesJ = (df: number) => Math.exp(logGamma(df / 2) - 0.5 * Math.log(df / 2) - logGamma((df - 1) / 2));

// 16-point Gauss-Legendre nodes and weights on [-1, 1].
const GLX = [-0.9894009349916499, -0.9445750230732326, -0.8656312023878318, -0.7554044083550030, -0.6178762444026438, -0.4580167776572274, -0.2816035507792589, -0.0950125098376374, 0.0950125098376374, 0.2816035507792589, 0.4580167776572274, 0.6178762444026438, 0.7554044083550030, 0.8656312023878318, 0.9445750230732326, 0.9894009349916499];
const GLW = [0.0271524594117541, 0.0622535239386479, 0.0951585116824928, 0.1246289712555339, 0.1495959888165767, 0.1691565193950025, 0.1826034150449236, 0.1894506104550685, 0.1894506104550685, 0.1826034150449236, 0.1691565193950025, 0.1495959888165767, 0.1246289712555339, 0.0951585116824928, 0.0622535239386479, 0.0271524594117541];
/** Composite 16-point Gauss-Legendre rule on [a, b] with `panels` panels. */
export function gaussLegendre(f: (x: number) => number, a: number, b: number, panels = 8) {
  const h = (b - a) / panels;
  let s = 0;
  for (let p = 0; p < panels; p++) {
    const c = a + (p + 0.5) * h;
    for (let i = 0; i < 16; i++) s += GLW[i] * f(c + (h / 2) * GLX[i]);
  }
  return (s * h) / 2;
}

/** P(range of k standard normals ≤ w) = k ∫ φ(z) [Φ(z) − Φ(z − w)]^(k−1) dz. */
function rangeCdfDirect(w: number, k: number) {
  if (!(w > 0)) return 0;
  const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  return Math.min(1, k * gaussLegendre((z) => phi(z) * Math.pow(Math.max(0, normSf(z - w) - normSf(z)), k - 1), -8.5, 8.5, 16));
}
const RANGE_STEP = 0.02, RANGE_MAX = 24;
const rangeTables = new Map<number, Float64Array>();
/** Range distribution, from a table per k with 4-point interpolation (built once per k). */
function rangeCdf(w: number, k: number) {
  if (!(w > 0)) return 0;
  if (w >= RANGE_MAX - 2 * RANGE_STEP) return 1;
  let t = rangeTables.get(k);
  if (!t) {
    t = new Float64Array(Math.round(RANGE_MAX / RANGE_STEP) + 1);
    for (let i = 1; i < t.length; i++) t[i] = rangeCdfDirect(i * RANGE_STEP, k);
    rangeTables.set(k, t);
  }
  const u = w / RANGE_STEP, i = Math.min(Math.max(1, Math.floor(u)), t.length - 3), f = u - i;
  // Lagrange cubic through points i-1, i, i+1, i+2.
  const p0 = t[i - 1], p1 = t[i], p2 = t[i + 1], p3 = t[i + 2];
  const v = p1 + f * ((p2 - p0) / 2 + f * ((2 * p0 - 5 * p1 + 4 * p2 - p3) / 2 + f * ((3 * (p1 - p2) + p3 - p0) / 2)));
  return Math.min(1, Math.max(0, v));
}
const chiNodes = new Map<number, { s: number[]; w: number[] }>();
/** Nodes for averaging over s = √(χ²_df / df), in v = ln s, where the weight is smooth for every df. */
function sNodes(df: number) {
  let r = chiNodes.get(df);
  if (r) return r;
  const lc = (df / 2) * Math.log(df) - (df / 2 - 1) * Math.log(2) - logGamma(df / 2);
  const g = (v: number) => Math.exp(lc + df * v - (df * Math.exp(2 * v)) / 2);
  const lo = -40 / df - 0.5, hi = 0.5 * Math.log(1 + 80 / df) + 0.5, panels = 48, h = (hi - lo) / panels;
  const s: number[] = [], w: number[] = [];
  for (let p = 0; p < panels; p++) for (let i = 0; i < 16; i++) {
    const v = lo + (p + 0.5) * h + (h / 2) * GLX[i];
    s.push(Math.exp(v)); w.push((GLW[i] * h) / 2 * g(v));
  }
  r = { s, w }; chiNodes.set(df, r);
  return r;
}
/** Studentized range distribution P(Q ≤ q) for k groups and df error degrees of freedom. */
export function ptukey(q: number, k: number, df: number) {
  if (!(q > 0)) return 0;
  if (df > 20000) return rangeCdf(q, k);
  const { s, w } = sNodes(df);
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += w[i] * rangeCdf(q * s[i], k);
  return Math.min(1, sum);
}
/** Quantile of the studentized range: the q with P(Q ≤ q) = p. */
export function qtukey(p: number, k: number, df: number) {
  let lo = 0, hi = 2;
  while (ptukey(hi, k, df) < p && hi < 1e4) hi *= 2;
  for (let i = 0; i < 60 && hi - lo > 1e-9; i++) { const m = (lo + hi) / 2; if (ptukey(m, k, df) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

// ---------- helpers ----------
export const meanOf = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
export const varOf = (a: number[]) => { const m = meanOf(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
export function medianOf(a: number[]) { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
/** Average ranks (1-based) of the values, ties sharing the mean rank; also the tie sizes. */
export function rank(a: number[]) {
  const idx = a.map((v, i) => [v, i] as [number, number]).sort((x, y) => x[0] - y[0]);
  const r = new Array<number>(a.length), ties: number[] = [];
  for (let i = 0; i < idx.length;) {
    let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const avg = (i + j) / 2 + 1;
    for (let m = i; m <= j; m++) r[idx[m][1]] = avg;
    if (j > i) ties.push(j - i + 1);
    i = j + 1;
  }
  return { r, ties };
}
const lfact = (n: number) => logGamma(n + 1);

// ---------- t tests ----------
export type TResult = {
  t: number; df: number; p: number; est: number; se: number; ci: [number, number]; d: number; g: number; dCi: [number, number];
  n: number[]; means: number[]; sds: number[];
};
function tCi(est: number, se: number, df: number, alt: Alt, conf: number): [number, number] {
  if (alt === 'two-sided') { const q = tInv(1 - (1 - conf) / 2, df); return [est - q * se, est + q * se]; }
  const q = tInv(conf, df);
  return alt === 'less' ? [-Infinity, est + q * se] : [est - q * se, Infinity];
}
const dCiOf = (d: number, se: number, conf: number): [number, number] => { const z = normInv(1 - (1 - conf) / 2); return [d - z * se, d + z * se]; };

/** One-sample t test of mean(x) against mu0. Effect size d = (mean − mu0) / sd. */
export function tOne(x: number[], mu0 = 0, alt: Alt = 'two-sided', conf = 0.95): TResult {
  const n = x.length;
  if (n < 2) throw new Error('A t test needs at least 2 values.');
  const m = meanOf(x), s = Math.sqrt(varOf(x)), se = s / Math.sqrt(n), df = n - 1;
  if (!(s > 0)) throw new Error('All the values are the same, so there is no spread to test against.');
  const t = (m - mu0) / se, d = (m - mu0) / s, g = d * hedgesJ(df);
  const ciM = tCi(m, se, df, alt, conf);
  return { t, df, p: tP(t, df, alt), est: m - mu0, se, ci: ciM, d, g, dCi: dCiOf(d, Math.sqrt(1 / n + (d * d) / (2 * n)), conf), n: [n], means: [m], sds: [s] };
}
/** Two-sample t test of mean(x) − mean(y): Welch's (default) or Student's with pooled variance. d uses the pooled SD. */
export function tTwo(x: number[], y: number[], welch = true, alt: Alt = 'two-sided', conf = 0.95): TResult {
  const n1 = x.length, n2 = y.length;
  if (n1 < 2 || n2 < 2) throw new Error('Each group needs at least 2 values.');
  const m1 = meanOf(x), m2 = meanOf(y), v1 = varOf(x), v2 = varOf(y);
  const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
  if (!(sp2 > 0)) throw new Error('Every value is the same, so there is no spread to test against.');
  let se: number, df: number;
  if (welch) {
    const a = v1 / n1, b = v2 / n2; se = Math.sqrt(a + b);
    df = (a + b) ** 2 / (a * a / (n1 - 1) + b * b / (n2 - 1));
  } else { se = Math.sqrt(sp2 * (1 / n1 + 1 / n2)); df = n1 + n2 - 2; }
  const est = m1 - m2, t = est / se, d = est / Math.sqrt(sp2), g = d * hedgesJ(n1 + n2 - 2);
  const seD = Math.sqrt((n1 + n2) / (n1 * n2) + (d * d) / (2 * (n1 + n2)));
  return { t, df, p: tP(t, df, alt), est, se, ci: tCi(est, se, df, alt, conf), d, g, dCi: dCiOf(d, seD, conf), n: [n1, n2], means: [m1, m2], sds: [Math.sqrt(v1), Math.sqrt(v2)] };
}
/** Paired t test on x − y. Effect size dz = mean difference / SD of the differences. */
export function tPaired(x: number[], y: number[], alt: Alt = 'two-sided', conf = 0.95): TResult {
  if (x.length !== y.length) throw new Error('Paired data need the same number of values in both columns.');
  const r = tOne(x.map((v, i) => v - y[i]), 0, alt, conf);
  return { ...r, n: [x.length], means: [meanOf(x), meanOf(y), r.means[0]], sds: [Math.sqrt(varOf(x)), Math.sqrt(varOf(y)), r.sds[0]] };
}

// ---------- ANOVA ----------
export type AnovaResult = {
  F: number; df1: number; df2: number; p: number; ssb: number; ssw: number; msw: number; eta2: number; omega2: number; f: number;
  n: number[]; means: number[]; sds: number[];
};
export function anova(groups: number[][]): AnovaResult {
  const k = groups.length;
  if (k < 2) throw new Error('ANOVA needs at least 2 groups.');
  if (groups.some((g) => g.length < 1)) throw new Error('Every group needs at least one value.');
  const N = groups.reduce((s, g) => s + g.length, 0);
  if (N - k < 1) throw new Error('Too few values: at least one group needs 2 or more.');
  const all = groups.flat(), gm = meanOf(all), means = groups.map(meanOf);
  const ssb = groups.reduce((s, g, i) => s + g.length * (means[i] - gm) ** 2, 0);
  const ssw = groups.reduce((s, g, i) => s + g.reduce((a, x) => a + (x - means[i]) ** 2, 0), 0);
  const df1 = k - 1, df2 = N - k, msw = ssw / df2;
  if (!(msw > 0)) throw new Error('There is no spread inside the groups, so ANOVA cannot be worked out.');
  const F = ssb / df1 / msw, sst = ssb + ssw, eta2 = ssb / sst;
  return { F, df1, df2, p: fSf(F, df1, df2), ssb, ssw, msw, eta2, omega2: (ssb - df1 * msw) / (sst + msw), f: Math.sqrt(eta2 / (1 - eta2)), n: groups.map((g) => g.length), means, sds: groups.map((g) => (g.length > 1 ? Math.sqrt(varOf(g)) : NaN)) };
}
export type TukeyRow = { i: number; j: number; diff: number; se: number; q: number; p: number; lo: number; hi: number };
/** Tukey HSD (Tukey-Kramer for unequal n): every pair, diff = mean j − mean i, as statsmodels' pairwise_tukeyhsd. */
export function tukey(groups: number[][], conf = 0.95): { rows: TukeyRow[]; qcrit: number } {
  const a = anova(groups), k = groups.length;
  const qcrit = qtukey(conf, k, a.df2), rows: TukeyRow[] = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) {
    const diff = a.means[j] - a.means[i], se = Math.sqrt((a.msw / 2) * (1 / a.n[i] + 1 / a.n[j])), q = Math.abs(diff) / se;
    rows.push({ i, j, diff, se, q, p: Math.min(1, Math.max(0, 1 - ptukey(q, k, a.df2))), lo: diff - qcrit * se, hi: diff + qcrit * se });
  }
  return { rows, qcrit };
}
/** Levene's test with medians (Brown-Forsythe), scipy.stats.levene(center='median'). */
export function levene(groups: number[][]) {
  const z = groups.map((g) => { const m = medianOf(g); return g.map((x) => Math.abs(x - m)); });
  try { const a = anova(z); return { W: a.F, df1: a.df1, df2: a.df2, p: a.p }; } catch { return { W: NaN, df1: groups.length - 1, df2: NaN, p: NaN }; }
}

// ---------- chi-square and Fisher ----------
export function chiGof(obs: number[], probs?: number[], ddof = 0) {
  const k = obs.length;
  if (k < 2) throw new Error('Goodness of fit needs at least 2 categories.');
  if (obs.some((o) => !(o >= 0))) throw new Error('Counts must be zero or more.');
  const N = obs.reduce((s, x) => s + x, 0);
  if (!(N > 0)) throw new Error('The counts add up to zero.');
  let p = probs ?? obs.map(() => 1);
  if (p.length !== k || p.some((x) => !(x > 0))) throw new Error('Every expected share must be a number above zero.');
  const ps = p.reduce((s, x) => s + x, 0); p = p.map((x) => x / ps);
  const exp = p.map((x) => x * N), resid = obs.map((o, i) => (o - exp[i]) / Math.sqrt(exp[i]));
  const chi2 = resid.reduce((s, r) => s + r * r, 0), df = k - 1 - ddof;
  if (df < 1) throw new Error('Too few categories for the degrees of freedom.');
  return { chi2, df, p: chi2Sf(chi2, df), N, exp, resid, w: Math.sqrt(chi2 / N), minExp: Math.min(...exp) };
}
export function chiIndep(T: number[][], yates = true) {
  const r = T.length, c = T[0]?.length ?? 0;
  if (r < 2 || c < 2) throw new Error('A table needs at least 2 rows and 2 columns of counts.');
  if (T.some((row) => row.length !== c)) throw new Error('Every row needs the same number of counts.');
  if (T.flat().some((o) => !(o >= 0))) throw new Error('Counts must be zero or more.');
  const rs = T.map((row) => row.reduce((s, x) => s + x, 0)), cs = T[0].map((_, j) => T.reduce((s, row) => s + row[j], 0)), N = rs.reduce((s, x) => s + x, 0);
  if (rs.some((x) => x === 0) || cs.some((x) => x === 0)) throw new Error('A row or column adds up to zero: remove it.');
  const E = T.map((_, i) => cs.map((cj) => (rs[i] * cj) / N));
  let chi2 = 0, chi2y = 0;
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
    const o = T[i][j], e = E[i][j]; chi2 += (o - e) ** 2 / e;
    const dd = e - o, oy = o + Math.sign(dd) * Math.min(0.5, Math.abs(dd)); chi2y += (oy - e) ** 2 / e;
  }
  const df = (r - 1) * (c - 1), is2 = r === 2 && c === 2, use = is2 && yates ? chi2y : chi2;
  // Adjusted standardized residuals (Agresti).
  const adj = T.map((row, i) => row.map((o, j) => (o - E[i][j]) / Math.sqrt(E[i][j] * (1 - rs[i] / N) * (1 - cs[j] / N))));
  return { chi2: use, chi2Pearson: chi2, yates: is2 && yates, df, p: chi2Sf(use, df), N, E, adj, V: Math.sqrt(chi2 / (N * (Math.min(r, c) - 1))), minExp: Math.min(...E.flat()), lowExp: E.flat().filter((e) => e < 5).length / (r * c) };
}
/** Fisher's exact test for a 2 x 2 table [[a, b], [c, d]], with the sample odds ratio and Woolf's interval. */
export function fisher2x2(T: number[][], alt: Alt = 'two-sided', conf = 0.95) {
  const [[a, b], [c, d]] = T;
  if ([a, b, c, d].some((x) => !(x >= 0) || !Number.isInteger(x))) throw new Error("Fisher's test needs whole-number counts.");
  const r1 = a + b, c1 = a + c, N = a + b + c + d;
  const lo = Math.max(0, c1 - (N - r1)), hi = Math.min(r1, c1);
  const lp = (x: number) => lfact(r1) + lfact(N - r1) + lfact(c1) + lfact(N - c1) - lfact(N) - lfact(x) - lfact(r1 - x) - lfact(c1 - x) - lfact(N - r1 - c1 + x);
  const pa = Math.exp(lp(a));
  let pLess = 0, pGreater = 0, pTwo = 0;
  for (let x = lo; x <= hi; x++) {
    const px = Math.exp(lp(x));
    if (x <= a) pLess += px;
    if (x >= a) pGreater += px;
    if (px <= pa * (1 + 1e-7)) pTwo += px;
  }
  const p = Math.min(1, alt === 'less' ? pLess : alt === 'greater' ? pGreater : pTwo);
  const or = (a * d) / (b * c);
  // Woolf's log interval; with a zero cell, 0.5 is added to every cell (Haldane-Anscombe).
  const z = normInv(1 - (1 - conf) / 2), h = [a, b, c, d].some((x) => x === 0) ? 0.5 : 0;
  const lor = Math.log(((a + h) * (d + h)) / ((b + h) * (c + h))), se = Math.sqrt(1 / (a + h) + 1 / (b + h) + 1 / (c + h) + 1 / (d + h));
  return { p, or, orCi: [Math.exp(lor - z * se), Math.exp(lor + z * se)] as [number, number], haldane: h > 0, N };
}

// ---------- rank tests ----------
/** Exact null distribution of the Mann-Whitney U (counts of each U from 0 to n1·n2), from the Gaussian binomial coefficient. */
function uCounts(n1: number, n2: number) {
  const M = n1 * n2, f = new Float64Array(M + 1); f[0] = 1;
  // Π_{i=1..n1} (1 − q^(n2+i)) / (1 − q^i)
  for (let i = 1; i <= n1; i++) {
    const s = n2 + i;
    for (let u = M; u >= s; u--) f[u] -= f[u - s];
    for (let u = i; u <= M; u++) f[u] += f[u - i];
  }
  return f;
}
export function mannWhitney(x: number[], y: number[], alt: Alt = 'two-sided', method: 'auto' | 'exact' | 'normal' = 'auto') {
  const n1 = x.length, n2 = y.length;
  if (n1 < 1 || n2 < 1) throw new Error('Each group needs at least 1 value.');
  const { r, ties } = rank([...x, ...y]), n = n1 + n2;
  const R1 = r.slice(0, n1).reduce((s, v) => s + v, 0), U1 = R1 - (n1 * (n1 + 1)) / 2, U2 = n1 * n2 - U1;
  const exact = method === 'exact' ? true : method === 'normal' ? false : !ties.length && n1 <= 50 && n2 <= 50;
  if (exact && ties.length) throw new Error('The exact method needs data without ties.');
  let p: number, z = NaN;
  if (exact) {
    const f = uCounts(n1, n2), tot = f.reduce((s, v) => s + v, 0), u = Math.round(U1);
    let ge = 0, le = 0;
    for (let i = 0; i < f.length; i++) { if (i >= u) ge += f[i]; if (i <= u) le += f[i]; }
    ge /= tot; le /= tot;
    p = alt === 'greater' ? ge : alt === 'less' ? le : Math.min(1, 2 * Math.min(ge, le));
  } else {
    const mu = (n1 * n2) / 2, tc = ties.reduce((s, t) => s + t ** 3 - t, 0);
    const sigma = Math.sqrt(((n1 * n2) / 12) * (n + 1 - tc / (n * (n - 1))));
    if (!(sigma > 0)) throw new Error('Every value is the same, so the groups cannot be ranked.');
    if (alt === 'greater') { z = (U1 - mu - 0.5) / sigma; p = normSf(z); }
    else if (alt === 'less') { z = (U1 - mu + 0.5) / sigma; p = normSf(-z); }
    else { z = (Math.max(U1, U2) - mu - 0.5) / sigma; p = Math.min(1, 2 * normSf(z)); z = Math.sign(U1 - mu) * Math.abs(z); }
  }
  let hl = NaN;
  if (n1 * n2 <= 1e6) { const dd: number[] = []; for (const a of x) for (const b of y) dd.push(a - b); hl = medianOf(dd); }
  return { U1, U2, R1, p, z, exact, ties: ties.length > 0, rbc: (2 * U1) / (n1 * n2) - 1, cles: U1 / (n1 * n2), hl, n: [n1, n2], medians: [medianOf(x), medianOf(y)] };
}
/** Wilcoxon signed-rank test on differences d (zeros dropped, as scipy's zero_method='wilcox'); normal approximation without continuity correction. */
export function wilcoxon(d: number[], alt: Alt = 'two-sided', method: 'auto' | 'exact' | 'normal' = 'auto') {
  const nz = d.filter((v) => v !== 0), zeros = d.length - nz.length, n = nz.length;
  if (n < 1) throw new Error('Every difference is zero, so there is nothing to rank.');
  const { r, ties } = rank(nz.map(Math.abs));
  let Tp = 0; nz.forEach((v, i) => { if (v > 0) Tp += r[i]; });
  const total = (n * (n + 1)) / 2, Tm = total - Tp;
  const exact = method === 'exact' ? true : method === 'normal' ? false : !ties.length && n <= 50;
  if (exact && ties.length) throw new Error('The exact method needs differences without ties.');
  let p: number, z = NaN;
  if (exact) {
    const f = new Float64Array(total + 1); f[0] = 1;
    for (let k = 1; k <= n; k++) for (let s = total; s >= k; s--) f[s] += f[s - k];
    const tot = 2 ** n, t = Math.round(Tp);
    let ge = 0, le = 0;
    for (let i = 0; i <= total; i++) { if (i >= t) ge += f[i]; if (i <= t) le += f[i]; }
    ge /= tot; le /= tot;
    p = alt === 'greater' ? ge : alt === 'less' ? le : Math.min(1, 2 * Math.min(ge, le));
  } else {
    const mu = total / 2, tc = ties.reduce((s, t) => s + t ** 3 - t, 0);
    const sigma = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24 - tc / 48);
    z = (Tp - mu) / sigma;
    p = alt === 'greater' ? normSf(z) : alt === 'less' ? normSf(-z) : Math.min(1, 2 * normSf(Math.abs(z)));
  }
  return { Tp, Tm, W: Math.min(Tp, Tm), p, z, exact, n, zeros, ties: ties.length > 0, rbc: (Tp - Tm) / total, median: medianOf(d) };
}
export function kruskal(groups: number[][]) {
  const k = groups.length;
  if (k < 2) throw new Error('Kruskal-Wallis needs at least 2 groups.');
  if (groups.some((g) => g.length < 1)) throw new Error('Every group needs at least one value.');
  const all = groups.flat(), N = all.length, { r, ties } = rank(all);
  let pos = 0, H = 0; const meanRanks: number[] = [];
  for (const g of groups) { const R = r.slice(pos, pos + g.length).reduce((s, v) => s + v, 0); pos += g.length; H += (R * R) / g.length; meanRanks.push(R / g.length); }
  H = (12 / (N * (N + 1))) * H - 3 * (N + 1);
  const C = 1 - ties.reduce((s, t) => s + t ** 3 - t, 0) / (N ** 3 - N);
  if (!(C > 0)) throw new Error('Every value is the same, so the groups cannot be ranked.');
  H /= C;
  const df = k - 1;
  return { H, df, p: chi2Sf(H, df), eps2: H / (N - 1), eta2H: Math.max(0, (H - k + 1) / (N - k)), meanRanks, n: groups.map((g) => g.length), medians: groups.map(medianOf) };
}

// ---------- Shapiro-Wilk (Royston 1995, AS R94) ----------
const poly = (c: number[], x: number) => { let r = 0; for (let i = c.length - 1; i >= 0; i--) r = r * x + c[i]; return r; };
export function shapiroWilk(xIn: number[]) {
  const x = [...xIn].sort((a, b) => a - b), n = x.length;
  if (n < 3) throw new Error('Shapiro-Wilk needs at least 3 values.');
  if (n > 5000) throw new Error('Shapiro-Wilk works for up to 5,000 values.');
  if (x[n - 1] - x[0] < 1e-19 * Math.max(1, Math.abs(x[0]))) throw new Error('All the values are the same.');
  const nn2 = Math.floor(n / 2), a = new Array<number>(nn2 + 1).fill(0);
  if (n === 3) a[1] = Math.SQRT1_2;
  else {
    const an25 = n + 0.25, m = [0]; let summ2 = 0;
    for (let i = 1; i <= nn2; i++) { m[i] = normInv((i - 0.375) / an25); summ2 += m[i] ** 2; }
    summ2 *= 2; const ssumm2 = Math.sqrt(summ2), rsn = 1 / Math.sqrt(n);
    const a1 = poly([0, 0.221157, -0.147981, -2.071190, 4.434685, -2.706056], rsn) - m[1] / ssumm2;
    let i1: number, fac: number;
    if (n > 5) {
      i1 = 3; const a2 = -m[2] / ssumm2 + poly([0, 0.042981, -0.293762, -1.752461, 5.682633, -3.582633], rsn);
      fac = Math.sqrt((summ2 - 2 * m[1] ** 2 - 2 * m[2] ** 2) / (1 - 2 * a1 ** 2 - 2 * a2 ** 2)); a[2] = a2;
    } else { i1 = 2; fac = Math.sqrt((summ2 - 2 * m[1] ** 2) / (1 - 2 * a1 ** 2)); }
    a[1] = a1;
    for (let i = i1; i <= nn2; i++) a[i] = -m[i] / fac;
  }
  const mu = meanOf(x), ss = x.reduce((s, v) => s + (v - mu) ** 2, 0);
  let num = 0; for (let i = 1; i <= nn2; i++) num += a[i] * (x[n - i] - x[i - 1]);
  const W = Math.min(1, (num * num) / ss);
  let p: number;
  if (n === 3) p = Math.max(0, Math.min(1, 1.90985931710274 * (Math.asin(Math.sqrt(W)) - 1.04719755119660)));
  else {
    let y = Math.log(1 - W), mm: number, s: number;
    const xx = Math.log(n);
    if (n <= 11) {
      const gamma = poly([-2.273, 0.459], n);
      if (y >= gamma) return { W, p: 1e-99, n };
      y = -Math.log(gamma - y); mm = poly([0.5440, -0.39978, 0.025054, -6.714e-4], n); s = Math.exp(poly([1.3822, -0.77857, 0.062767, -0.0020322], n));
    } else { mm = poly([-1.5861, -0.31082, -0.083751, 0.0038915], xx); s = Math.exp(poly([-0.4803, -0.082676, 0.0030302], xx)); }
    p = normSf((y - mm) / s);
  }
  return { W, p, n };
}
