// Survival analysis for study and teaching: Kaplan-Meier curves with Greenwood confidence intervals (plain, log or
// log-log), median survival with its interval, numbers at risk, the log-rank test for two or more groups, and Cox
// proportional hazards regression (Efron's method for ties, Newton-Raphson). No DOM.
// Sources: Kaplan and Meier (1958) JASA 53:457; Greenwood (1926); Kalbfleisch and Prentice (2002), The Statistical
// Analysis of Failure Time Data; Mantel (1966) and Peto and Peto (1972) for the log-rank test; Cox (1972) JRSS B
// 34:187; Efron (1977) JASA 72:557. Results match Python's lifelines (KaplanMeierFitter, multivariate_logrank_test,
// CoxPHFitter).
import { logGamma, normCdf, normInv } from './stats.ts';
import { parseTable, num } from './num.ts';

/** Upper tail of the chi-square distribution, P(X > x), computed directly (accurate for tiny p values). */
export function chi2Sf(x: number, df: number): number {
  if (!(x > 0)) return 1;
  const a = df / 2, z = x / 2, lg = a * Math.log(z) - z - logGamma(a);
  if (z < a + 1) {
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 100000; n++) { term *= z / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-16) break; }
    return Math.max(0, 1 - sum * Math.exp(lg));
  }
  let b = z + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 100000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.min(1, Math.exp(lg) * h);
}
/** Two-sided normal p value for a z statistic, accurate far into the tail. */
export const zP = (z: number) => 2 * normCdf(-Math.abs(z));

/** Inverse of a small symmetric positive-definite matrix (Gauss-Jordan with partial pivoting). Null if singular. */
export function invert(A: number[][]): number[][] | null {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (!(Math.abs(M[p][c]) > 1e-12 * Math.max(1, ...A.map((r) => Math.abs(r[c]))))) return null;
    [M[c], M[p]] = [M[p], M[c]];
    const piv = M[c][c];
    for (let j = 0; j < 2 * n; j++) M[c][j] /= piv;
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; if (f) for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map((r) => r.slice(n));
}

export type Subject = { t: number; e: 0 | 1; g: string; x: number[] };
export type Dataset = { rows: Subject[]; groups: string[]; covNames: string[]; hasGroup: boolean; skipped: string[] };

const EVENT_WORDS = new Map<string, 0 | 1>([['1', 1], ['0', 0], ['yes', 1], ['no', 0], ['dead', 1], ['died', 1], ['death', 1], ['event', 1], ['alive', 0], ['censored', 0], ['true', 1], ['false', 0], ['y', 1], ['n', 0]]);

/**
 * Pasted rows: time, event (1 = event, 0 = censored), then an optional group column and optional numeric covariates.
 * A first row that is not data is taken as the header. `groupCol` false means column 3 onwards are all covariates.
 */
export function parseSurvival(text: string, groupCol = true): Dataset {
  const all = parseTable(text);
  if (!all.length) throw new Error('Paste your data first: time, event (1 or 0) and, if you like, group.');
  const head = !Number.isFinite(num(all[0][0])) ? all[0] : null;
  const body = head ? all.slice(1) : all;
  const width = Math.max(...body.map((r) => r.length), head?.length ?? 0);
  if (width < 2) throw new Error('Each row needs at least two columns: time, then event (1 = event happened, 0 = censored).');
  const gIdx = groupCol && width >= 3 ? 2 : -1, covStart = gIdx >= 0 ? 3 : 2;
  const covNames = Array.from({ length: Math.max(0, width - covStart) }, (_, j) => head?.[covStart + j]?.trim() || `x${j + 1}`);
  const rows: Subject[] = [], skipped: string[] = [];
  body.forEach((r, i) => {
    const line = i + 1 + (head ? 1 : 0);
    const t = num(r[0]), ev = EVENT_WORDS.get((r[1] ?? '').trim().toLowerCase());
    if (!Number.isFinite(t) || t < 0) { skipped.push(`row ${line}: time "${r[0] ?? ''}" is not a number of zero or more`); return; }
    if (ev === undefined) { skipped.push(`row ${line}: event "${r[1] ?? ''}" is not 1 or 0`); return; }
    const x = covNames.map((_, j) => num(r[covStart + j]));
    if (x.some((v) => !Number.isFinite(v))) { skipped.push(`row ${line}: a covariate is blank or not a number`); return; }
    rows.push({ t, e: ev, g: gIdx >= 0 ? (r[gIdx] ?? '').trim() || '(blank)' : 'All', x });
  });
  if (!rows.length) throw new Error(skipped.length ? `No usable rows: ${skipped[0]}.` : 'No data rows found.');
  const groups = [...new Set(rows.map((r) => r.g))];
  if (groups.every((g) => Number.isFinite(num(g)))) groups.sort((a, b) => num(a) - num(b));
  return { rows, groups, covNames, hasGroup: gIdx >= 0, skipped };
}

export type CIType = 'log-log' | 'log' | 'plain';
export type KMStep = { t: number; atRisk: number; events: number; censored: number; S: number; se: number; lo: number; hi: number };
export type KMResult = { n: number; events: number; steps: KMStep[]; median: number; medianLo: number; medianHi: number; times: number[]; cens: number[] };

/** Kaplan-Meier estimate with Greenwood's variance. One step per distinct time (events or censorings). */
export function kaplanMeier(times: number[], events: (0 | 1)[], conf = 0.95, type: CIType = 'log-log'): KMResult {
  const z = normInv(1 - (1 - conf) / 2);
  const idx = times.map((_, i) => i).sort((a, b) => times[a] - times[b]);
  const steps: KMStep[] = [];
  let atRisk = times.length, S = 1, gw = 0, i = 0;
  while (i < idx.length) {
    const t = times[idx[i]];
    let d = 0, c = 0;
    while (i < idx.length && times[idx[i]] === t) { if (events[idx[i]]) d++; else c++; i++; }
    if (d) { S *= 1 - d / atRisk; gw += d < atRisk ? d / (atRisk * (atRisk - d)) : Infinity; }
    const se = S * Math.sqrt(gw);
    let lo: number, hi: number;
    if (gw === 0) { lo = hi = S; }
    else if (!(S > 0) || !Number.isFinite(gw)) { lo = hi = NaN; }
    else if (type === 'plain') { lo = Math.max(0, S - z * se); hi = Math.min(1, S + z * se); }
    else if (type === 'log') { const k = z * Math.sqrt(gw); lo = S * Math.exp(-k); hi = Math.min(1, S * Math.exp(k)); }
    else if (S >= 1) { lo = hi = 1; }
    else { const k = (z * Math.sqrt(gw)) / Math.abs(Math.log(S)); lo = S ** Math.exp(k); hi = S ** Math.exp(-k); }
    steps.push({ t, atRisk, events: d, censored: c, S, se: S > 0 ? se : NaN, lo, hi });
    atRisk -= d + c;
  }
  // Median: the first time the curve (or a band) reaches 0.5 or below, as in lifelines and R's survfit. When the
  // curve sits at exactly 0.5 for a while, R's survfit takes the middle of that flat stretch, and so do we (lifelines
  // gets 0.5000000000000002 from its log-sum and so takes the end of the stretch).
  const first = (f: (s: KMStep) => number) => {
    for (let k = 0; k < steps.length; k++) {
      const v = f(steps[k]);
      if (Math.abs(v - 0.5) < 1e-9) { const j = steps.findIndex((s, m) => m > k && f(s) < v - 1e-9); return j < 0 ? steps[k].t : (steps[k].t + steps[j].t) / 2; }
      if (v <= 0.5) return steps[k].t;
    }
    return Infinity;
  };
  return {
    n: times.length, events: events.reduce<number>((a, e) => a + e, 0), steps,
    median: first((s) => s.S), medianLo: first((s) => (Number.isFinite(s.lo) ? s.lo : 0)), medianHi: first((s) => (Number.isFinite(s.hi) ? s.hi : 0)),
    times: steps.map((s) => s.t), cens: steps.filter((s) => s.censored > 0).map((s) => s.t),
  };
}
/** Survival probability just after time t (the step function's value). */
export function survivalAt(km: KMResult, t: number) {
  let S = 1;
  for (const s of km.steps) { if (s.t > t) break; S = s.S; }
  return S;
}
/** Number still at risk at time t (followed up to t or longer). */
export const atRiskAt = (times: number[], t: number) => times.filter((x) => x >= t).length;

export type LogRank = { groups: string[]; observed: number[]; expected: number[]; chi2: number; df: number; p: number; variance: number[][] };

/** Log-rank test of equal survival in two or more groups (Mantel 1966; the multivariate form with k − 1 df). */
export function logRank(times: number[], events: (0 | 1)[], groups: string[]): LogRank {
  const names = [...new Set(groups)], k = names.length;
  if (k < 2) throw new Error('The log-rank test needs at least two groups.');
  const gi = groups.map((g) => names.indexOf(g));
  const evTimes = [...new Set(times.filter((_, i) => events[i]))].sort((a, b) => a - b);
  const O = Array(k).fill(0), E = Array(k).fill(0), V = names.map(() => Array(k).fill(0));
  for (const t of evTimes) {
    const n = Array(k).fill(0), d = Array(k).fill(0);
    times.forEach((x, i) => { if (x >= t) n[gi[i]]++; if (x === t && events[i]) d[gi[i]]++; });
    const N = n.reduce((a, b) => a + b, 0), D = d.reduce((a, b) => a + b, 0);
    for (let j = 0; j < k; j++) {
      O[j] += d[j]; E[j] += (D * n[j]) / N;
      if (N > 1) for (let l = 0; l < k; l++) V[j][l] += ((D * (N - D)) / (N - 1)) * (n[j] / N) * ((j === l ? 1 : 0) - n[l] / N);
    }
  }
  // Drop the last group: the statistic uses k − 1 of the O − E differences.
  const m = k - 1, U = O.slice(0, m).map((o, j) => o - E[j]), Vi = invert(V.slice(0, m).map((r) => r.slice(0, m)));
  let chi2 = NaN;
  if (Vi) chi2 = U.reduce((s, u, j) => s + u * U.reduce((t, w, l) => t + Vi[j][l] * w, 0), 0);
  return { groups: names, observed: O, expected: E, chi2, df: m, p: chi2Sf(chi2, m), variance: V };
}

export type CoxTerm = { name: string; beta: number; se: number; hr: number; lo: number; hi: number; z: number; p: number };
export type CoxResult = { terms: CoxTerm[]; loglik: number; loglik0: number; lr: number; df: number; lrP: number; iterations: number; converged: boolean; n: number; events: number; cov: number[][]; warning: string };

/** Efron log partial likelihood with its gradient and Hessian at beta. */
function efron(T: number[], E: (0 | 1)[], X: number[][], beta: number[]) {
  const n = T.length, p = beta.length;
  const order = T.map((_, i) => i).sort((a, b) => T[b] - T[a]); // longest first, so risk sets grow
  const w = X.map((x) => Math.exp(x.reduce((s, v, j) => s + v * beta[j], 0)));
  let ll = 0;
  const g = Array(p).fill(0), H = beta.map(() => Array(p).fill(0));
  let s0 = 0; const s1 = Array(p).fill(0), s2 = beta.map(() => Array(p).fill(0));
  let i = 0;
  while (i < n) {
    const t = T[order[i]];
    let d0 = 0, nd = 0; const d1 = Array(p).fill(0), d2 = beta.map(() => Array(p).fill(0)), xsum = Array(p).fill(0);
    while (i < n && T[order[i]] === t) {
      const k = order[i], wk = w[k], xk = X[k];
      s0 += wk;
      for (let a = 0; a < p; a++) { s1[a] += wk * xk[a]; for (let b = 0; b < p; b++) s2[a][b] += wk * xk[a] * xk[b]; }
      if (E[k]) {
        nd++; d0 += wk;
        for (let a = 0; a < p; a++) { d1[a] += wk * xk[a]; xsum[a] += xk[a]; for (let b = 0; b < p; b++) d2[a][b] += wk * xk[a] * xk[b]; }
        ll += Math.log(wk);
      }
      i++;
    }
    if (!nd) continue;
    for (let a = 0; a < p; a++) g[a] += xsum[a];
    for (let l = 0; l < nd; l++) {
      const f = l / nd, den = s0 - f * d0;
      ll -= Math.log(den);
      const m1 = s1.map((v, a) => (v - f * d1[a]) / den);
      for (let a = 0; a < p; a++) {
        g[a] -= m1[a];
        for (let b = 0; b < p; b++) H[a][b] -= (s2[a][b] - f * d2[a][b]) / den - m1[a] * m1[b];
      }
    }
  }
  return { ll, g, H };
}

/** Cox proportional hazards regression by Newton-Raphson with step halving, Efron's method for tied times. */
export function coxPH(T: number[], E: (0 | 1)[], X: number[][], names: string[], conf = 0.95): CoxResult {
  const p = names.length, z = normInv(1 - (1 - conf) / 2);
  if (!p) throw new Error('Choose at least one covariate (or a group column) for the Cox model.');
  const events = E.reduce<number>((a, b) => a + b, 0);
  if (events < 2) throw new Error('The Cox model needs at least two events.');
  // Centre the covariates for numerical stability; coefficients do not change.
  const mu = names.map((_, j) => X.reduce((s, x) => s + x[j], 0) / X.length);
  const Xc = X.map((x) => x.map((v, j) => v - mu[j]));
  for (let j = 0; j < p; j++) if (Xc.every((x) => Math.abs(x[j]) < 1e-12)) throw new Error(`"${names[j]}" has the same value for everyone, so it cannot be in the model.`);
  let beta = Array(p).fill(0), cur = efron(T, E, Xc, beta);
  const ll0 = cur.ll;
  let it = 0, converged = false;
  for (; it < 100; it++) {
    const inv = invert(cur.H.map((r) => r.map((v) => -v)));
    if (!inv) break;
    const step = inv.map((r) => r.reduce((s, v, b) => s + v * cur.g[b], 0));
    let scale = 1, next = beta.map((b, a) => b + step[a]), nr = efron(T, E, Xc, next);
    while (!(nr.ll >= cur.ll - 1e-12) && scale > 1e-6) { scale /= 2; next = beta.map((b, a) => b + scale * step[a]); nr = efron(T, E, Xc, next); }
    const change = Math.abs(nr.ll - cur.ll);
    beta = next; cur = nr;
    if (change < 1e-10 && Math.max(...step.map(Math.abs)) * scale < 1e-7) { converged = true; it++; break; }
  }
  const cov = invert(cur.H.map((r) => r.map((v) => -v)));
  if (!cov) throw new Error('The model cannot be fitted: two covariates carry the same information, or a covariate perfectly separates events from non-events.');
  const terms = names.map((name, j) => {
    const se = Math.sqrt(cov[j][j]), zz = beta[j] / se;
    return { name, beta: beta[j], se, hr: Math.exp(beta[j]), lo: Math.exp(beta[j] - z * se), hi: Math.exp(beta[j] + z * se), z: zz, p: zP(zz) };
  });
  const lr = 2 * (cur.ll - ll0);
  const warning = !converged || beta.some((b) => Math.abs(b) > 15)
    ? 'The fit did not settle: a coefficient keeps growing, usually because a covariate (or a group) almost perfectly predicts who has the event. Treat the numbers with care.' : '';
  return { terms, loglik: cur.ll, loglik0: ll0, lr, df: p, lrP: chi2Sf(lr, p), iterations: it, converged, n: T.length, events, cov, warning };
}

/** Design matrix for the Cox model: group as 0/1 indicators against the reference group, then numeric covariates. */
export function design(ds: Dataset, useGroup: boolean, covs: number[], reference?: string) {
  const ref = reference && ds.groups.includes(reference) ? reference : ds.groups[0];
  const others = useGroup ? ds.groups.filter((g) => g !== ref) : [];
  const names = [...others.map((g) => `${g} vs ${ref}`), ...covs.map((j) => ds.covNames[j])];
  const X = ds.rows.map((r) => [...others.map((g) => (r.g === g ? 1 : 0)), ...covs.map((j) => r.x[j])]);
  return { X, names, ref };
}
