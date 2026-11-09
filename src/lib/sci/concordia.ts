// U-Pb concordia: Wetherill (207Pb/235U, 206Pb/238U) and Tera-Wasserburg (238U/206Pb, 207Pb/206Pb) curves, error
// ellipses, conversion between the two with correlated errors, the concordia age of a group of analyses (Ludwig 1998),
// discordia by York regression with upper and lower intercepts, and the weighted mean 206Pb/238U age.
// Decay constants of Jaffey et al. (1971); 238U/235U chosen by the user. Plain maths, no DOM.
import { york, chiSqUpper } from './geochron.ts';

export const L8 = 1.55125e-10, L5 = 9.8485e-10;
export const U_RATIOS = { hiess: 137.818, steiger: 137.88 } as const;

/** One analysis in Wetherill space, 1σ absolute errors and their correlation. */
export type An = { x: number; sx: number; y: number; sy: number; rho: number; label?: string };

export const cW = (t: number): [number, number] => [Math.expm1(L5 * t), Math.expm1(L8 * t)];
export const dW = (t: number): [number, number] => [L5 * Math.exp(L5 * t), L8 * Math.exp(L8 * t)];
export const cTW = (t: number, U: number): [number, number] => { const [x, y] = cW(t); return [1 / y, x / (y * U)]; };

/** Covariance matrix of an analysis. */
export const cov = (a: An): number[][] => [[a.sx * a.sx, a.rho * a.sx * a.sy], [a.rho * a.sx * a.sy, a.sy * a.sy]];
const inv2 = (m: number[][]) => { const d = m[0][0] * m[1][1] - m[0][1] * m[1][0]; if (!(Math.abs(d) > 0)) throw new Error('An error ellipse has zero area: check the errors and the correlation'); return [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]]; };
const quad = (v: number[], m: number[][]) => v[0] * (m[0][0] * v[0] + m[0][1] * v[1]) + v[1] * (m[1][0] * v[0] + m[1][1] * v[1]);

/** Propagate through a map whose log-Jacobian is J (ln out = J · ln in + const): exact for products of powers. */
function logMap(a: An, J: number[][], vals: [number, number]): An {
  const rx = a.sx / a.x, ry = a.sy / a.y, C = [[rx * rx, a.rho * rx * ry], [a.rho * rx * ry, ry * ry]];
  const v = (i: number, j: number) => J[i][0] * (C[0][0] * J[j][0] + C[0][1] * J[j][1]) + J[i][1] * (C[1][0] * J[j][0] + C[1][1] * J[j][1]);
  const s0 = Math.sqrt(v(0, 0)), s1 = Math.sqrt(v(1, 1));
  return { x: vals[0], sx: s0 * Math.abs(vals[0]), y: vals[1], sy: s1 * Math.abs(vals[1]), rho: v(0, 1) / (s0 * s1), label: a.label };
}
/** Wetherill (207/235, 206/238) to Tera-Wasserburg (238/206, 207/206). */
export const toTW = (a: An, U: number): An => logMap(a, [[0, -1], [1, -1]], [1 / a.y, a.x / (a.y * U)]);
/** Tera-Wasserburg (238/206 as x, 207/206 as y) to Wetherill. */
export const fromTW = (a: An, U: number): An => logMap(a, [[-1, 1], [-1, 0]], [(a.y * U) / a.x, 1 / a.x]);

/** Points of an ellipse at k standard deviations (k = 2 for 2σ; √5.991 = 2.448 for 95 % confidence). */
export function ellipse(a: An, k: number, n = 72): [number, number][] {
  const C = cov(a), tr = C[0][0] + C[1][1], det = C[0][0] * C[1][1] - C[0][1] ** 2, h = Math.sqrt(Math.max(0, tr * tr / 4 - det));
  const l1 = tr / 2 + h, l2 = Math.max(0, tr / 2 - h), th = Math.abs(C[0][1]) < 1e-300 ? (C[0][0] >= C[1][1] ? 0 : Math.PI / 2) : Math.atan2(l1 - C[0][0], C[0][1]);
  const A = k * Math.sqrt(l1), B = k * Math.sqrt(l2), c = Math.cos(th), s = Math.sin(th);
  return Array.from({ length: n + 1 }, (_, i) => { const u = (2 * Math.PI * i) / n, ex = A * Math.cos(u), ey = B * Math.sin(u); return [a.x + ex * c - ey * s, a.y + ex * s + ey * c]; });
}

/** The three ages of one analysis (years) with 1σ, and discordance (%) of the 206/238 age against the 207/206 age. */
export function ages(a: An, U: number) {
  const t68 = Math.log1p(a.y) / L8, s68 = a.sy / (L8 * (1 + a.y));
  const t75 = Math.log1p(a.x) / L5, s75 = a.sx / (L5 * (1 + a.x));
  const r76 = a.x / (a.y * U), f = (t: number) => cW(t)[0] / cW(t)[1] / U - r76;
  let t76 = NaN;
  if (f(1) < 0 && f(6e9) > 0) { let lo = 1, hi = 6e9; for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; f(m) < 0 ? (lo = m) : (hi = m); } t76 = (lo + hi) / 2; }
  // 207/206 age error by linear propagation of the 207/206 ratio error (from the log-space covariance).
  const tw = toTW(a, U), dr = (cW(t76 + 1e3)[0] / cW(t76 + 1e3)[1] - cW(t76 - 1e3)[0] / cW(t76 - 1e3)[1]) / U / 2e3;
  return { t68, s68, t75, s75, t76, s76: tw.sy / dr, disc: (1 - t68 / t76) * 100 };
}

/**
 * Concordia age (Ludwig 1998): the weighted mean point of the analyses (with its covariance), then the age on
 * concordia closest to it in the metric of that covariance. σt from the curvature (decay-constant errors left out).
 * MSWDs of concordance (1 degree of freedom), equivalence (2n − 2) and both (2n − 1), with their probabilities.
 */
export function concordiaAge(list: An[]) {
  const n = list.length;
  if (n < 1) throw new Error('Choose at least one analysis');
  const Om = list.map((a) => inv2(cov(a)));
  const S = [[0, 0], [0, 0]], v = [0, 0];
  list.forEach((a, i) => { const o = Om[i]; for (let r = 0; r < 2; r++) { for (let c = 0; c < 2; c++) S[r][c] += o[r][c]; v[r] += o[r][0] * a.x + o[r][1] * a.y; } });
  const Si = inv2(S), X = [Si[0][0] * v[0] + Si[0][1] * v[1], Si[1][0] * v[0] + Si[1][1] * v[1]];
  const Seq = list.reduce((s, a, i) => s + quad([a.x - X[0], a.y - X[1]], Om[i]), 0);
  const Q = (t: number) => { const c = cW(t); return quad([X[0] - c[0], X[1] - c[1]], S); };
  // Start from the 206/238 age of the mean point, then Newton steps on dQ/dt with a bracket guard.
  let t = Math.log1p(Math.max(1e-9, X[1])) / L8;
  for (let k = 0; k < 100; k++) {
    const c = cW(t), d = dW(t), dd = [L5 * L5 * Math.exp(L5 * t), L8 * L8 * Math.exp(L8 * t)], e = [X[0] - c[0], X[1] - c[1]];
    const g = -2 * (d[0] * (S[0][0] * e[0] + S[0][1] * e[1]) + d[1] * (S[1][0] * e[0] + S[1][1] * e[1]));
    const h = 2 * quad(d, S) - 2 * (dd[0] * (S[0][0] * e[0] + S[0][1] * e[1]) + dd[1] * (S[1][0] * e[0] + S[1][1] * e[1]));
    let step = h > 0 ? -g / h : -Math.sign(g) * 1e7;
    while (Q(t + step) > Q(t) && Math.abs(step) > 1e-3) step /= 2;
    t += step;
    if (Math.abs(step) < 1e-4) break;
  }
  const st = 1 / Math.sqrt(quad(dW(t), S)), Sc = Q(t);
  return { t, st, mean: { x: X[0], y: X[1], sx: Math.sqrt(Si[0][0]), sy: Math.sqrt(Si[1][1]), rho: Si[0][1] / Math.sqrt(Si[0][0] * Si[1][1]) },
    mswdConc: Sc, pConc: chiSqUpper(Sc, 1), mswdEq: n > 1 ? Seq / (2 * n - 2) : NaN, pEq: n > 1 ? chiSqUpper(Seq, 2 * n - 2) : NaN,
    mswd: (Seq + Sc) / (2 * n - 1), p: chiSqUpper(Seq + Sc, 2 * n - 1), n };
}

/**
 * Discordia: York regression of the analyses in Wetherill space, and where the line crosses concordia (ages from
 * −2 to 5 billion years), each with 1σ from the slope and intercept errors and their covariance.
 */
export function discordia(list: An[]) {
  if (list.length < 3) throw new Error('A discordia line needs at least three analyses');
  const f = york(list.map((a) => ({ x: a.x, sx: a.sx, y: a.y, sy: a.sy, r: a.rho })));
  const g = (t: number) => Math.expm1(L8 * t) - f.a - f.b * Math.expm1(L5 * t);
  const roots: { t: number; s: number }[] = [];
  const N = 7000, t0 = -2e9, t1 = 5e9;
  let pt = t0, pv = g(t0);
  for (let i = 1; i <= N; i++) {
    const tt = t0 + ((t1 - t0) * i) / N, v = g(tt);
    if (pv === 0 || pv * v < 0) {
      let lo = pt, hi = tt;
      for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; (g(lo) < 0) === (g(m) < 0) ? (lo = m) : (hi = m); }
      const t = (lo + hi) / 2, ft = L8 * Math.exp(L8 * t) - f.b * L5 * Math.exp(L5 * t), c5 = Math.expm1(L5 * t);
      // t moves with a and b: dt/da = 1/ft, dt/db = c5/ft.
      const s = Math.sqrt(f.sa * f.sa + c5 * c5 * f.sb * f.sb + 2 * c5 * f.cov) / Math.abs(ft);
      roots.push({ t, s });
    }
    pt = tt; pv = v;
  }
  roots.sort((p, q) => p.t - q.t);
  const lower = roots.length >= 2 ? roots[0] : roots.length === 1 && roots[0].t < 1e9 ? roots[0] : undefined;
  const upper = roots.length >= 2 ? roots[roots.length - 1] : roots.length === 1 && !lower ? roots[0] : undefined;
  return { fit: f, lower, upper, roots };
}

/** Weighted mean of the 206Pb/238U ages (inverse-variance), its 1σ, MSWD and probability. */
export function weightedMean68(list: An[]) {
  if (list.length < 1) throw new Error('Choose at least one analysis');
  const t = list.map((a) => Math.log1p(a.y) / L8), s = list.map((a) => a.sy / (L8 * (1 + a.y)));
  const w = s.map((v) => 1 / (v * v)), W = w.reduce((p, q) => p + q, 0), m = w.reduce((p, q, i) => p + q * t[i], 0) / W;
  const chi = w.reduce((p, q, i) => p + q * (t[i] - m) ** 2, 0), df = list.length - 1;
  return { t: m, s: 1 / Math.sqrt(W), mswd: df ? chi / df : NaN, p: df ? chiSqUpper(chi, df) : NaN, n: list.length };
}

/** Read analyses: optional label, then ratio, error, ratio, error, and an optional correlation. */
export function parseAnalyses(text: string) {
  const rows: { label: string; v: number[] }[] = [], bad: number[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const l = raw.replace(/#.*/, '').trim(); if (!l) return;
    const parts = l.split(/\t|,|;|\s+/).map((p) => p.trim()).filter((p) => p !== '');
    let label = '';
    if (parts.length && !Number.isFinite(Number(parts[0]))) label = parts.shift()!;
    const v = parts.map(Number);
    if (v.length >= 4 && v.slice(0, Math.min(5, v.length)).every(Number.isFinite)) rows.push({ label: label || `#${rows.length + 1}`, v });
    else if (!(rows.length === 0 && label && v.every((x) => !Number.isFinite(x)))) bad.push(i + 1);
  });
  return { rows, bad };
}
