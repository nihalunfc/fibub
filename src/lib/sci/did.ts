// Difference-in-differences: the 2 × 2 estimate from group means, and from panel data the two-way fixed
// effects regression (unit and period effects) with standard errors clustered by unit, an event study
// relative to a reference period, and a joint test of the pre-period coefficients. Plain functions, no DOM.
// Clustered errors follow statsmodels' OLS with unit and period dummies (cov_type='cluster', use_t=True):
// V × G/(G − 1) × (n − 1)/(n − K), where K counts every dummy and the constant, and t on G − 1 df.
import { tTwoSided, tInv, fSf } from './stats.ts';
import { inv, crossprod, mulMat, demean } from './econometrics.ts';

export type Cell = { mean: number; sd?: number; n?: number };
export type Did2x2 = {
  did: number; treatedChange: number; controlChange: number; counterfactual: number;
  se?: number; t?: number; df?: number; p?: number; lo?: number; hi?: number;
};

/**
 * DiD from four group means: (treated after − treated before) − (control after − control before).
 * With SDs and sizes for all four cells, the standard error is √Σ sd²/n (the cells are independent
 * samples), the same as HC2 robust errors in the saturated regression, with t on N − 4 df.
 */
export function did2x2(tPre: Cell, tPost: Cell, cPre: Cell, cPost: Cell, level = 0.95): Did2x2 {
  const cells = [tPre, tPost, cPre, cPost];
  if (cells.some((c) => !Number.isFinite(c.mean))) throw new Error('Enter all four group means.');
  const treatedChange = tPost.mean - tPre.mean, controlChange = cPost.mean - cPre.mean;
  const out: Did2x2 = { did: treatedChange - controlChange, treatedChange, controlChange, counterfactual: tPre.mean + controlChange };
  if (cells.every((c) => Number.isFinite(c.sd) && Number.isFinite(c.n))) {
    if (cells.some((c) => !(c.n! >= 2) || !(c.sd! >= 0))) throw new Error('Each group needs a size of at least 2 and a standard deviation of zero or more.');
    const se = Math.sqrt(cells.reduce((s, c) => s + c.sd! ** 2 / c.n!, 0)), df = cells.reduce((s, c) => s + c.n!, 0) - 4;
    const t = out.did / se, q = tInv(1 - (1 - level) / 2, df);
    Object.assign(out, { se, t, df, p: tTwoSided(t, df), lo: out.did - q * se, hi: out.did + q * se });
  }
  return out;
}

export type Est = { name: string; b: number; se: number; t: number; p: number; lo: number; hi: number };
export type TwfeFit = { coefs: Est[]; V: number[][]; n: number; units: number; periods: number; df: number; K: number; r2Within: number };

/** Regression of y on the columns of X with unit and period fixed effects, errors clustered by unit. */
export function twfe(y: number[], X: number[][], names: string[], unit: string[], time: string[], level = 0.95): TwfeFit {
  const n = y.length, k = names.length, units = new Set(unit).size, periods = new Set(time).size;
  const K = k + units + periods - 1;
  if (n - K < 1) throw new Error(`Too few rows: ${n} rows for ${k} effects plus ${units} units and ${periods} periods.`);
  if (units < 2) throw new Error('Clustered standard errors need at least two units.');
  const [yd, ...xd] = demean([y, ...names.map((_, j) => X.map((r) => r[j]))], unit, time);
  const Xd = yd.map((_, i) => xd.map((c) => c[i]));
  const A = inv(crossprod(Xd, Xd));
  if (!A) {
    const flat = names.filter((_, j) => xd[j].every((v) => Math.abs(v) < 1e-9));
    throw new Error(flat.length ? `${flat.join(', ')} cannot be estimated: ${flat.length > 1 ? 'they do' : 'it does'} not vary once unit and period effects are removed. Check that some units are treated and some are not, and that there are periods before and after the start.` : 'The treatment dummies are collinear with the unit and period effects. Check the treated column and the start period.');
  }
  const b = A.map((r) => r.reduce((s, x, j) => s + x * Xd.reduce((t, row, i) => t + row[j] * yd[i], 0), 0));
  const e = yd.map((v, i) => v - Xd[i].reduce((s, x, j) => s + x * b[j], 0));
  const sums = new Map<string, number[]>();
  Xd.forEach((r, i) => { let s = sums.get(unit[i]); if (!s) sums.set(unit[i], (s = new Array(k).fill(0))); for (let j = 0; j < k; j++) s[j] += r[j] * e[i]; });
  const M = Array.from({ length: k }, () => new Array(k).fill(0));
  for (const s of sums.values()) for (let a = 0; a < k; a++) for (let c = 0; c < k; c++) M[a][c] += s[a] * s[c];
  const G = sums.size, adj = (G / (G - 1)) * ((n - 1) / (n - K));
  const V = mulMat(mulMat(A, M), A).map((r) => r.map((x) => x * adj));
  const df = G - 1, q = tInv(1 - (1 - level) / 2, df);
  const coefs = names.map((name, j) => { const se = Math.sqrt(V[j][j]), t = b[j] / se; return { name, b: b[j], se, t, p: tTwoSided(t, df), lo: b[j] - q * se, hi: b[j] + q * se }; });
  const ssr = e.reduce((s, x) => s + x * x, 0), tss = yd.reduce((s, x) => s + x * x, 0);
  return { coefs, V, n, units, periods, df, K, r2Within: 1 - ssr / tss };
}

/** Wald F that the chosen coefficients are all zero, on (q, G − 1) degrees of freedom. */
export function jointF(fit: TwfeFit, idx: number[]) {
  if (!idx.length) return null;
  const Vi = inv(idx.map((i) => idx.map((j) => fit.V[i][j])));
  if (!Vi) return null;
  const r = idx.map((i) => fit.coefs[i].b);
  const F = r.reduce((s, x, i) => s + x * r.reduce((t, z, j) => t + Vi[i][j] * z, 0), 0) / idx.length;
  return { F, df1: idx.length, df2: fit.df, p: fSf(F, idx.length, fit.df) };
}

export type PanelRow = { unit: string; time: number; y: number; treated: boolean };
export type DidPanel = {
  twfe: TwfeFit; did: Est;
  event: { rel: number; time: number; est: Est | null }[]; eventFit: TwfeFit; pre: { F: number; df1: number; df2: number; p: number } | null;
  means: { time: number; treated: number; control: number; nT: number; nC: number }[];
  ref: number; start: number; units: { treated: number; control: number };
};

/**
 * DiD from a panel with one treatment start (all treated units start in the same period).
 * D = treated × (time ≥ start). The event study puts one dummy on treated × (time = s) for every period s
 * except the reference period, which is the period just before the start unless `refTime` says otherwise.
 */
export function didPanel(rows: PanelRow[], start: number, refTime?: number, level = 0.95): DidPanel {
  const times = [...new Set(rows.map((r) => r.time))].sort((a, b) => a - b);
  const tUnits = new Set(rows.filter((r) => r.treated).map((r) => r.unit)), cUnits = new Set(rows.filter((r) => !r.treated).map((r) => r.unit));
  for (const u of tUnits) if (cUnits.has(u)) throw new Error(`Unit "${u}" is marked treated in some rows and not in others. The treated column must be the same in every row of a unit (it marks the group, not the period).`);
  if (!tUnits.size || !cUnits.size) throw new Error('You need both treated units (1 in the treated column) and comparison units (0).');
  if (!times.some((t) => t < start)) throw new Error(`No periods before the start (${start}). DiD needs at least one period before treatment.`);
  if (!times.some((t) => t >= start)) throw new Error(`No periods from the start (${start}) onwards.`);
  const ref = refTime ?? Math.max(...times.filter((t) => t < start));
  if (!times.includes(ref)) throw new Error(`The reference period ${ref} is not in the data.`);
  const y = rows.map((r) => r.y), unit = rows.map((r) => r.unit), time = rows.map((r) => String(r.time));
  const fit = twfe(y, rows.map((r) => [r.treated && r.time >= start ? 1 : 0]), ['Treated × after'], unit, time, level);
  const evTimes = times.filter((t) => t !== ref);
  const eventFit = twfe(y, rows.map((r) => evTimes.map((t) => (r.treated && r.time === t ? 1 : 0))), evTimes.map((t) => `Treated × ${t}`), unit, time, level);
  // Event time counts periods from the first treated period (0), so −1 is the last period before it.
  const startIdx = times.findIndex((s) => s >= start);
  const event = times.map((t, i) => ({ rel: i - startIdx, time: t, est: t === ref ? null : eventFit.coefs[evTimes.indexOf(t)] }));
  const preIdx = evTimes.map((t, j) => (t < start ? j : -1)).filter((j) => j >= 0);
  const means = times.map((t) => {
    const T = rows.filter((r) => r.time === t && r.treated), C = rows.filter((r) => r.time === t && !r.treated);
    const m = (a: PanelRow[]) => (a.length ? a.reduce((s, r) => s + r.y, 0) / a.length : NaN);
    return { time: t, treated: m(T), control: m(C), nT: T.length, nC: C.length };
  });
  return { twfe: fit, did: fit.coefs[0], event, eventFit, pre: jointF(eventFit, preIdx), means, ref, start, units: { treated: tUnits.size, control: cUnits.size } };
}
