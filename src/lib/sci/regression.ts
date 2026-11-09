// Regression workbench maths: ordinary least squares (multiple and polynomial) and logistic regression, with
// standard errors, tests, intervals, fit statistics and diagnostics (leverage, studentized residuals, Cook's
// distance, VIF, Durbin-Watson). Plain TypeScript, no DOM. Least squares through a Householder QR
// decomposition, so near-collinear or high-degree polynomial columns stay accurate; logistic regression by
// iteratively reweighted least squares (Newton's method). Checked against statsmodels OLS, Logit and GLM.
import { parseTable, num } from './num.ts';
import { DIST, quantile, normCdf, normPpf } from './distributions.ts';

// ---------- Small linear algebra ----------
type Mat = number[][];
/** Householder QR of an n x p matrix (n >= p). Returns R (p x p, upper) and a function applying Q^T to a vector. */
function qr(X: Mat) {
  const n = X.length, p = X[0].length;
  const A = X.map((r) => r.slice());
  const vs: number[][] = [], betas: number[] = [];
  for (let k = 0; k < p; k++) {
    let norm = 0;
    for (let i = k; i < n; i++) norm += A[i][k] ** 2;
    norm = Math.sqrt(norm);
    const v = new Array(n).fill(0);
    if (norm === 0) { vs.push(v); betas.push(0); continue; }
    const alpha = A[k][k] > 0 ? -norm : norm;
    for (let i = k; i < n; i++) v[i] = A[i][k];
    v[k] -= alpha;
    let vv = 0; for (let i = k; i < n; i++) vv += v[i] * v[i];
    const beta = vv > 0 ? 2 / vv : 0;
    for (let j = k; j < p; j++) {
      let s = 0; for (let i = k; i < n; i++) s += v[i] * A[i][j];
      s *= beta; for (let i = k; i < n; i++) A[i][j] -= s * v[i];
    }
    vs.push(v); betas.push(beta);
  }
  const R = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => (j >= i ? A[i][j] : 0)));
  const qt = (y: number[]) => {
    const b = y.slice();
    for (let k = 0; k < p; k++) {
      const v = vs[k]; let s = 0;
      for (let i = k; i < n; i++) s += v[i] * b[i];
      s *= betas[k]; for (let i = k; i < n; i++) b[i] -= s * v[i];
    }
    return b;
  };
  return { R, qt };
}
/** Inverse of an upper-triangular matrix. */
function invUpper(R: Mat): Mat {
  const p = R.length, U = Array.from({ length: p }, () => new Array(p).fill(0));
  for (let j = 0; j < p; j++) {
    U[j][j] = 1 / R[j][j];
    for (let i = j - 1; i >= 0; i--) {
      let s = 0; for (let k = i + 1; k <= j; k++) s += R[i][k] * U[k][j];
      U[i][j] = -s / R[i][i];
    }
  }
  return U;
}
/** Least squares by QR: coefficients, (X'X)^-1, leverages and residuals. Throws on collinear columns. */
export function lstsq(X: Mat, y: number[], names: string[] = []) {
  const n = X.length, p = X[0].length;
  // Scale columns to unit length first, so the rank test does not depend on units.
  const sc = Array.from({ length: p }, (_, j) => Math.sqrt(X.reduce((s, r) => s + r[j] * r[j], 0)) || 1);
  const Xs = X.map((r) => r.map((v, j) => v / sc[j]));
  const { R, qt } = qr(Xs);
  const dmax = Math.max(...R.map((r, i) => Math.abs(r[i])));
  R.forEach((r, i) => {
    if (!(Math.abs(r[i]) > 1e-10 * dmax)) throw new Error(`The column ${names[i] ?? i + 1} is a copy or combination of the columns before it, so its effect cannot be told apart. Leave it out.`);
  });
  const qty = qt(y), Ri = invUpper(R);
  const bs = new Array(p).fill(0);
  for (let i = p - 1; i >= 0; i--) { let s = qty[i]; for (let k = i + 1; k < p; k++) s -= R[i][k] * bs[k]; bs[i] = s / R[i][i]; }
  const beta = bs.map((b, j) => b / sc[j]);
  // (X'X)^-1 = S^-1 Ri Ri^T S^-1.
  const XtXi = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => { let s = 0; for (let k = Math.max(i, j); k < p; k++) s += Ri[i][k] * Ri[j][k]; return s / (sc[i] * sc[j]); }));
  // Leverage: squared row norms of Q1 = Xs Ri.
  const hat = Xs.map((r) => { let s = 0; for (let j = 0; j < p; j++) { let q = 0; for (let k = 0; k <= j; k++) q += r[k] * Ri[k][j]; s += q * q; } return s; });
  const fitted = X.map((r) => r.reduce((s, v, j) => s + v * beta[j], 0));
  const resid = y.map((v, i) => v - fitted[i]);
  return { beta, XtXi, hat, fitted, resid, n, p };
}

// ---------- Reading a table ----------
export type Table = { headers: string[]; rows: string[][]; numeric: boolean[] };
/** A pasted table with a header row. Columns where every non-empty cell is a number are numeric; others are categories. */
export function readTable(text: string): Table {
  const all = parseTable(text);
  if (all.length < 2) throw new Error('Paste a table with a header row and at least two rows of data.');
  const width = Math.max(...all.map((r) => r.length));
  const head = all[0];
  if (head.every((c) => c !== '' && !Number.isNaN(num(c)))) throw new Error('The first row should be column names (for example height, dose, group).');
  const headers = Array.from({ length: width }, (_, i) => (head[i] || `Column ${i + 1}`).trim());
  const seen = new Set<string>();
  headers.forEach((h, i) => { let k = h, j = 2; while (seen.has(k)) k = `${h} (${j++})`; headers[i] = k; seen.add(k); });
  const rows = all.slice(1).map((r) => headers.map((_, i) => (r[i] ?? '').trim()));
  const numeric = headers.map((_, i) => { const cells = rows.map((r) => r[i]).filter((c) => !isMissing(c)); return cells.length > 0 && cells.every((c) => !Number.isNaN(num(c))); });
  return { headers, rows, numeric };
}
export const isMissing = (c: string) => c === '' || /^(na|nan|n\/a|null|none|-|\.|missing)$/i.test(c);

export type Kind = 'linear' | 'polynomial' | 'logistic';
export type Spec = { kind: Kind; y: string; xs: string[]; degree?: number; intercept: boolean };
export type Design = { X: Mat; y: number[]; names: string[]; terms: { name: string; source: string; level?: string; power?: number }[]; used: number[]; dropped: number; yLabels?: [string, string]; notes: string[] };

/** Build the design matrix: numeric columns as they are, text columns as 0/1 indicators against the first level (alphabetical). */
export function design(t: Table, s: Spec): Design {
  const col = (name: string) => { const i = t.headers.indexOf(name); if (i < 0) throw new Error(`There is no column called ${name}.`); return i; };
  const yi = col(s.y), xis = s.xs.map(col), notes: string[] = [];
  if (!s.xs.length) throw new Error('Choose at least one predictor (x) column.');
  if (s.xs.includes(s.y)) throw new Error('The response cannot also be a predictor.');
  if (s.kind === 'polynomial') {
    if (s.xs.length !== 1) throw new Error('A polynomial uses one predictor column.');
    if (!t.numeric[xis[0]]) throw new Error(`${s.xs[0]} has text in it; a polynomial needs a numeric x.`);
  }
  const used: number[] = [];
  t.rows.forEach((r, i) => { if (!isMissing(r[yi]) && xis.every((j) => !isMissing(r[j]))) used.push(i); });
  const dropped = t.rows.length - used.length;
  if (dropped) notes.push(`${dropped} row${dropped === 1 ? '' : 's'} with an empty or missing value left out.`);
  // Response.
  let y: number[], yLabels: [string, string] | undefined;
  if (s.kind === 'logistic') {
    const vals = [...new Set(used.map((i) => t.rows[i][yi]))];
    if (vals.length !== 2) throw new Error(`For logistic regression the response must have exactly two values (such as 0 and 1, or yes and no); ${s.y} has ${vals.length}.`);
    const bothNum = vals.every((v) => !Number.isNaN(num(v)));
    vals.sort((a, b) => (bothNum ? num(a) - num(b) : a.localeCompare(b)));
    yLabels = [vals[0], vals[1]];
    y = used.map((i) => (t.rows[i][yi] === vals[1] ? 1 : 0));
  } else {
    if (!t.numeric[yi]) throw new Error(`The response ${s.y} has text in it. Choose a numeric column, or use logistic regression for a yes/no response.`);
    y = used.map((i) => num(t.rows[i][yi]));
  }
  // Predictors.
  const terms: Design['terms'] = [], cols: number[][] = [];
  if (s.intercept) { terms.push({ name: 'Intercept', source: '' }); cols.push(used.map(() => 1)); }
  for (const j of xis) {
    const name = t.headers[j];
    if (t.numeric[j]) {
      const x = used.map((i) => num(t.rows[i][j]));
      const deg = s.kind === 'polynomial' ? s.degree ?? 2 : 1;
      for (let k = 1; k <= deg; k++) { terms.push({ name: k === 1 ? name : `${name}^${k}`, source: name, power: k }); cols.push(x.map((v) => v ** k)); }
    } else {
      const levels = [...new Set(used.map((i) => t.rows[i][j]))].sort((a, b) => a.localeCompare(b));
      if (levels.length < 2) throw new Error(`${name} has only one value (${levels[0]}), so it cannot explain anything. Leave it out.`);
      if (levels.length > 30) throw new Error(`${name} has ${levels.length} different text values; up to 30 groups are allowed.`);
      notes.push(`${name} is text: each group is compared with ${levels[0]}.`);
      for (const lv of levels.slice(1)) { terms.push({ name: `${name}[${lv}]`, source: name, level: lv }); cols.push(used.map((i) => (t.rows[i][j] === lv ? 1 : 0))); }
    }
  }
  const X = used.map((_, r) => cols.map((c) => c[r]));
  if (used.length <= terms.length) throw new Error(`There are ${used.length} complete rows but ${terms.length} coefficients to estimate. You need more rows than coefficients.`);
  return { X, y, names: terms.map((x) => x.name), terms, used, dropped, yLabels, notes };
}

// ---------- Ordinary least squares ----------
export type Coef = { name: string; est: number; se: number; stat: number; p: number; lo: number; hi: number; vif?: number };
export type OlsFit = {
  kind: 'ols'; n: number; p: number; dfResid: number; dfModel: number; intercept: boolean; coefs: Coef[];
  r2: number; adjR2: number; F: number; Fp: number; sigma: number; sse: number; llf: number; aic: number; bic: number; dw: number;
  fitted: number[]; resid: number[]; hat: number[]; stdResid: number[]; studResid: number[]; cooks: number[]; XtXi: Mat; conf: number;
};
export function ols(d: Design, conf = 0.95): OlsFit {
  const { X, y, names } = d, intercept = d.terms[0]?.name === 'Intercept';
  const L = lstsq(X, y, names), { n, p } = L, df = n - p;
  const sse = L.resid.reduce((s, e) => s + e * e, 0), s2 = sse / df, sigma = Math.sqrt(s2);
  const ym = y.reduce((s, v) => s + v, 0) / n;
  const sst = intercept ? y.reduce((s, v) => s + (v - ym) ** 2, 0) : y.reduce((s, v) => s + v * v, 0);
  const r2 = 1 - sse / sst, kc = intercept ? 1 : 0, dfModel = p - kc;
  const adjR2 = 1 - ((n - kc) / df) * (1 - r2);
  const F = dfModel > 0 ? ((sst - sse) / dfModel) / s2 : NaN;
  const Fp = dfModel > 0 ? DIST.f.sf(F, { d1: dfModel, d2: df }) : NaN;
  const tq = quantile(DIST.t, { nu: df, mu: 0, sigma: 1 }, 1 - (1 - conf) / 2);
  const vifs = intercept ? vif(X) : [];
  const coefs = names.map((name, j) => {
    const est = L.beta[j], se = Math.sqrt(s2 * L.XtXi[j][j]), t = est / se;
    const pv = 2 * DIST.t.sf(Math.abs(t), { nu: df, mu: 0, sigma: 1 });
    return { name, est, se, stat: t, p: pv, lo: est - tq * se, hi: est + tq * se, vif: intercept && j > 0 ? vifs[j] : undefined };
  });
  const llf = (-n / 2) * (Math.log(2 * Math.PI) + Math.log(sse / n) + 1);
  const stdResid = L.resid.map((e, i) => e / (sigma * Math.sqrt(1 - L.hat[i])));
  const studResid = stdResid.map((r) => r * Math.sqrt((df - 1) / (df - r * r)));
  const cooks = stdResid.map((r, i) => (r * r * L.hat[i]) / (p * (1 - L.hat[i])));
  let dwn = 0; for (let i = 1; i < n; i++) dwn += (L.resid[i] - L.resid[i - 1]) ** 2;
  return { kind: 'ols', n, p, dfResid: df, dfModel, intercept, coefs, r2, adjR2, F, Fp, sigma, sse, llf, aic: -2 * llf + 2 * p, bic: -2 * llf + p * Math.log(n), dw: dwn / sse, fitted: L.fitted, resid: L.resid, hat: L.hat, stdResid, studResid, cooks, XtXi: L.XtXi, conf };
}
/** Variance inflation factors: column j regressed on all the other columns (the first column being the intercept). */
export function vif(X: Mat): number[] {
  const p = X[0].length, out = [NaN];
  for (let j = 1; j < p; j++) {
    const others = X.map((r) => r.filter((_, k) => k !== j)), yj = X.map((r) => r[j]);
    const m = yj.reduce((s, v) => s + v, 0) / yj.length, sst = yj.reduce((s, v) => s + (v - m) ** 2, 0);
    try { const L = lstsq(others, yj); const sse = L.resid.reduce((s, e) => s + e * e, 0); out.push(sst / sse); } catch { out.push(Infinity); }
  }
  return out;
}
/** Mean prediction with a confidence interval, and a prediction interval for one new observation. */
export function olsPredict(f: OlsFit, x: number[]) {
  const est = f.coefs.reduce((s, c, j) => s + c.est * x[j], 0);
  let q = 0; for (let i = 0; i < x.length; i++) for (let j = 0; j < x.length; j++) q += x[i] * f.XtXi[i][j] * x[j];
  const tq = quantile(DIST.t, { nu: f.dfResid, mu: 0, sigma: 1 }, 1 - (1 - f.conf) / 2);
  const seMean = f.sigma * Math.sqrt(q), seObs = f.sigma * Math.sqrt(1 + q);
  return { est, seMean, ci: [est - tq * seMean, est + tq * seMean] as [number, number], pi: [est - tq * seObs, est + tq * seObs] as [number, number] };
}

// ---------- Logistic regression ----------
export type LogitFit = {
  kind: 'logit'; n: number; p: number; intercept: boolean; coefs: Coef[]; llf: number; llnull: number; pseudoR2: number; lr: number; lrDf: number; lrP: number;
  aic: number; bic: number; iterations: number; converged: boolean; separation: boolean; prob: number[]; eta: number[]; devResid: number[]; pearson: number[]; hat: number[]; cooks: number[];
  cov: Mat; conf: number; accuracy: number; table: [[number, number], [number, number]];
};
const sigmoid = (z: number) => (z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z)));
/** log(1 + e^z) without overflow. */
const log1pexp = (z: number) => (z > 35 ? z : z < -35 ? Math.exp(z) : Math.log1p(Math.exp(z)));
export function logit(d: Design, conf = 0.95): LogitFit {
  const { X, y, names } = d, n = X.length, p = X[0].length, intercept = d.terms[0]?.name === 'Intercept';
  let beta = new Array(p).fill(0), iterations = 0, converged = false;
  const ll = (b: number[]) => X.reduce((s, r, i) => { const e = r.reduce((u, v, j) => u + v * b[j], 0); return s + y[i] * e - log1pexp(e); }, 0);
  let cur = ll(beta), cov: Mat = [];
  for (; iterations < 100; iterations++) {
    // IRLS step: weighted least squares of the working response on X, by QR for stability.
    const eta = X.map((r) => r.reduce((u, v, j) => u + v * beta[j], 0)), mu = eta.map(sigmoid), w = mu.map((m) => Math.max(m * (1 - m), 1e-300));
    const sw = w.map(Math.sqrt);
    const Xw = X.map((r, i) => r.map((v) => v * sw[i])), z = eta.map((e, i) => (e + (y[i] - mu[i]) / w[i]) * sw[i]);
    const L = lstsq(Xw, z, names);
    let nb = L.beta, nll = ll(nb), half = 0;
    while (nll < cur - 1e-12 && half < 30) { nb = nb.map((b, j) => (b + beta[j]) / 2); nll = ll(nb); half++; }
    const change = Math.abs(nll - cur);
    beta = nb; cur = nll;
    if (change < 1e-12 * (Math.abs(cur) + 1e-12) || change < 1e-14) { converged = true; iterations++; break; }
  }
  const eta = X.map((r) => r.reduce((u, v, j) => u + v * beta[j], 0)), prob = eta.map(sigmoid);
  const w = prob.map((m) => m * (1 - m)), sw = w.map(Math.sqrt);
  const Lw = lstsq(X.map((r, i) => r.map((v) => v * sw[i])), new Array(n).fill(0), names);
  cov = Lw.XtXi;
  const separation = prob.some((m) => m < 1e-10 || m > 1 - 1e-10) || beta.some((b) => !Number.isFinite(b));
  const zq = normPpf(1 - (1 - conf) / 2);
  const coefs = names.map((name, j) => { const est = beta[j], se = Math.sqrt(cov[j][j]), z = est / se; return { name, est, se, stat: z, p: 2 * normCdf(-Math.abs(z)), lo: est - zq * se, hi: est + zq * se }; });
  const ybar = y.reduce((s, v) => s + v, 0) / n;
  const llnull = intercept ? n * (ybar * Math.log(ybar) + (1 - ybar) * Math.log(1 - ybar)) : n * Math.log(0.5);
  const lr = 2 * (cur - llnull), lrDf = p - (intercept ? 1 : 0);
  const devResid = y.map((v, i) => Math.sign(v - prob[i]) * Math.sqrt(-2 * (v ? Math.log(prob[i]) : Math.log(1 - prob[i]))));
  const pearson = y.map((v, i) => (v - prob[i]) / Math.sqrt(w[i]));
  const hat = Lw.hat;
  const cooks = pearson.map((r, i) => (r * r * hat[i]) / (p * (1 - hat[i]) ** 2));
  const table: [[number, number], [number, number]] = [[0, 0], [0, 0]];
  y.forEach((v, i) => { table[v][prob[i] >= 0.5 ? 1 : 0]++; });
  return {
    kind: 'logit', n, p, intercept, coefs, llf: cur, llnull, pseudoR2: 1 - cur / llnull, lr, lrDf, lrP: lrDf > 0 ? DIST.chi2.sf(lr, { k: lrDf }) : NaN,
    aic: -2 * cur + 2 * p, bic: -2 * cur + p * Math.log(n), iterations, converged, separation, prob, eta, devResid, pearson, hat, cooks, cov, conf,
    accuracy: (table[0][0] + table[1][1]) / n, table,
  };
}
export function logitPredict(f: LogitFit, x: number[]) {
  const eta = f.coefs.reduce((s, c, j) => s + c.est * x[j], 0);
  let q = 0; for (let i = 0; i < x.length; i++) for (let j = 0; j < x.length; j++) q += x[i] * f.cov[i][j] * x[j];
  const se = Math.sqrt(q), zq = normPpf(1 - (1 - f.conf) / 2);
  return { eta, p: sigmoid(eta), ci: [sigmoid(eta - zq * se), sigmoid(eta + zq * se)] as [number, number] };
}

/** Theoretical normal quantiles for a Q-Q plot (Blom's plotting positions, (i - 3/8)/(n + 1/4)). */
export function qqPoints(v: number[]): { x: number[]; y: number[] } {
  const s = v.filter(Number.isFinite).sort((a, b) => a - b), n = s.length;
  return { x: s.map((_, i) => normPpf((i + 1 - 0.375) / (n + 0.25))), y: s };
}

/** The design row for new predictor values typed by the user (numbers for numeric columns, a group name for text ones). */
export function newRow(d: Design, values: Record<string, string>): number[] {
  return d.terms.map((t) => {
    if (t.name === 'Intercept') return 1;
    const raw = values[t.source];
    if (raw == null || raw === '') throw new Error(`Give a value for ${t.source}.`);
    if (t.level != null) return raw === t.level ? 1 : 0;
    const v = num(raw);
    if (!Number.isFinite(v)) throw new Error(`${t.source} must be a number.`);
    return v ** (t.power ?? 1);
  });
}

/** Example data sets. All made up for this tool (simulated with fixed seeds); not real measurements. */
export const EXAMPLES: { id: string; name: string; kind: Kind; y: string; xs: string[]; degree?: number; text: string }[] = [
 {
  "id": "plant",
  "name": "Plant growth: height from fertiliser, water, light and soil (multiple regression)",
  "kind": "linear",
  "y": "height_cm",
  "xs": [
   "fertiliser_g",
   "water_ml",
   "light_h",
   "soil"
  ],
  "text": "height_cm,fertiliser_g,water_ml,light_h,soil\n40.7,3.1,300,10.1,clay\n44.6,7.6,130,8.7,loam\n49.7,9.9,200,9.9,loam\n37.5,3.9,300,6.6,clay\n50.9,8,370,9.3,clay\n41.3,7.9,200,9.9,sand\n45.3,8.8,160,9.8,loam\n45.1,6.8,100,11.1,loam\n27.6,3.1,210,5.4,clay\n44.7,4.7,360,7.7,clay\n33.1,0.6,190,11.1,clay\n43.4,4.8,290,7.1,clay\n56.3,8.8,380,8,loam\n41.9,6.9,210,8.2,sand\n42.7,8.3,280,5.7,loam\n28.1,3.7,250,4.2,sand\n36.1,5.9,340,4.5,sand\n42.4,8.1,270,8.5,clay\n50.3,9.7,340,11.8,sand\n31,5,130,8.9,sand\n29.8,2.1,260,8.3,loam\n43.3,5.6,320,8,loam\n37.8,2.6,140,7.9,loam\n39.1,5.2,300,7,clay\n31.5,1.2,310,10.5,sand\n47.9,6.1,300,11.6,clay\n48.5,4.4,370,11.1,sand\n33.9,3.4,340,4.7,sand\n41.9,6.6,180,10.3,loam\n49.6,6.7,360,12,sand\n33.6,1.2,310,5.4,loam\n38.7,3.3,310,10.7,clay"
 },
 {
  "id": "stop",
  "name": "Stopping distance against speed (polynomial, degree 2)",
  "kind": "polynomial",
  "y": "distance_m",
  "xs": [
   "speed_kmh"
  ],
  "degree": 2,
  "text": "speed_kmh,distance_m\n22,5.4\n17,5.9\n29,14.7\n31,19.5\n40,16\n40,20.2\n52,30.4\n47,28.5\n61,34.3\n61,38.1\n68,44\n70,45.1\n80,58.7\n80,49.3\n91,70.7\n93,74.3\n99,86.9\n99,83.7\n111,103.4\n109,100.1\n120,120.8\n120,119.3"
 },
 {
  "id": "exam",
  "name": "Exam pass or fail from hours studied and practice tests (logistic)",
  "kind": "logistic",
  "y": "passed",
  "xs": [
   "hours_studied",
   "practice_tests"
  ],
  "text": "passed,hours_studied,practice_tests\n1,9.5,2\n1,9.8,4\n0,6.7,1\n0,0.6,1\n1,10.8,4\n1,6.3,4\n0,0.1,2\n1,10,1\n0,3.4,4\n1,8.5,3\n1,7,2\n1,11.8,4\n1,5.9,2\n0,0.5,1\n1,6.1,2\n1,11.2,0\n0,1.3,2\n1,11.8,5\n0,0.1,1\n0,0.1,4\n0,1.1,4\n0,9.5,2\n0,3.1,0\n0,4.7,2\n0,3.6,4\n0,3.6,3\n0,1.1,1\n1,11.1,0\n1,6.6,1\n0,2,0\n0,0.1,4\n0,0.1,1\n0,0.6,1\n1,10.5,2\n1,6.9,4\n1,11.6,5\n0,0.7,2\n1,9.2,1\n0,9.3,2\n0,2.2,2"
 }
];
