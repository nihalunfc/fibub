// Radiometric dating: ages from daughter/parent ratios (with K-Ar branching and Ar-Ar J factors), isochrons by York
// regression (correlated x and y errors, MSWD), and U-Pb ages (206/238, 207/235, 207/206, concordance). Plain maths.

/** Decay systems. λ in 1/year; conventional values widely used in geochronology (check your lab's convention). */
export type System = { id: string; name: string; parent: string; daughter: string; lambda: number; x: string; y: string; note?: string };
export const SYSTEMS: System[] = [
  { id: 'rbsr', name: 'Rb-Sr', parent: '⁸⁷Rb', daughter: '⁸⁷Sr', lambda: 1.42e-11, x: '⁸⁷Rb/⁸⁶Sr', y: '⁸⁷Sr/⁸⁶Sr', note: 'IUGS value (1977); a 2015 recommendation is 1.3972 × 10⁻¹¹, about 1.6 % lower' },
  { id: 'smnd', name: 'Sm-Nd', parent: '¹⁴⁷Sm', daughter: '¹⁴³Nd', lambda: 6.54e-12, x: '¹⁴⁷Sm/¹⁴⁴Nd', y: '¹⁴³Nd/¹⁴⁴Nd' },
  { id: 'luhf', name: 'Lu-Hf', parent: '¹⁷⁶Lu', daughter: '¹⁷⁶Hf', lambda: 1.867e-11, x: '¹⁷⁶Lu/¹⁷⁷Hf', y: '¹⁷⁶Hf/¹⁷⁷Hf' },
  { id: 'reos', name: 'Re-Os', parent: '¹⁸⁷Re', daughter: '¹⁸⁷Os', lambda: 1.666e-11, x: '¹⁸⁷Re/¹⁸⁸Os', y: '¹⁸⁷Os/¹⁸⁸Os' },
  { id: 'u238', name: 'U-Pb (²³⁸U)', parent: '²³⁸U', daughter: '²⁰⁶Pb', lambda: 1.55125e-10, x: '²³⁸U/²⁰⁴Pb', y: '²⁰⁶Pb/²⁰⁴Pb' },
  { id: 'u235', name: 'U-Pb (²³⁵U)', parent: '²³⁵U', daughter: '²⁰⁷Pb', lambda: 9.8485e-10, x: '²³⁵U/²⁰⁴Pb', y: '²⁰⁷Pb/²⁰⁴Pb' },
  { id: 'th232', name: 'Th-Pb', parent: '²³²Th', daughter: '²⁰⁸Pb', lambda: 4.9475e-11, x: '²³²Th/²⁰⁴Pb', y: '²⁰⁸Pb/²⁰⁴Pb' },
];
export const L238 = 1.55125e-10, L235 = 9.8485e-10, U85 = 137.818;
/** ⁴⁰K: total decay constant, the branch to ⁴⁰Ar (electron capture), and ⁴⁰K as a fraction of all K atoms. */
export const K40 = { lambda: 5.543e-10, lambdaE: 0.581e-10, frac: 1.167e-4 };

/** Age (years) from radiogenic daughter / remaining parent atoms; σ from σR. */
export function ageFromRatio(R: number, lambda: number, sR = 0) {
  if (!(R >= 0)) throw new Error('The daughter/parent ratio must be zero or more');
  const t = Math.log1p(R) / lambda;
  return { t, s: sR / (lambda * (1 + R)) };
}

/** Daughter/parent ratio that a given age produces. */
export const ratioForAge = (t: number, lambda: number) => Math.expm1(lambda * t);

/** K-Ar age from the ⁴⁰Ar* per ⁴⁰K atom ratio: t = ln(1 + (λ/λe)·R)/λ. */
export function kArAge(R: number, sR = 0) {
  const k = K40.lambda / K40.lambdaE, t = Math.log1p(k * R) / K40.lambda;
  return { t, s: (k * sR) / (K40.lambda * (1 + k * R)) };
}
/** ⁴⁰K atoms per gram from potassium in wt% (atomic weight of K 39.098). */
export const k40PerGram = (wtPct: number) => ((wtPct / 100) * K40.frac * 6.02214076e23) / 39.0983;

/** Ar-Ar: J from a standard of known age and its measured ⁴⁰Ar* to ³⁹Ar_K ratio. */
export const jFromStandard = (tStd: number, Rstd: number) => Math.expm1(K40.lambda * tStd) / Rstd;
/** Ar-Ar age from J and the sample's ⁴⁰Ar* to ³⁹Ar_K ratio, with σ from σR and σJ. */
export function arArAge(J: number, R: number, sR = 0, sJ = 0) {
  const t = Math.log1p(J * R) / K40.lambda, d = K40.lambda * (1 + J * R);
  return { t, s: Math.hypot((J * sR) / d, (R * sJ) / d) };
}

export type Pt = { x: number; sx: number; y: number; sy: number; r?: number };
/**
 * York et al. (2004) straight-line fit with errors in both x and y (1σ, absolute) and their correlation r.
 * Returns slope b, intercept a, their 1σ errors, MSWD and its probability of fit.
 */
export function york(pts: Pt[]) {
  const n = pts.length;
  if (n < 3) throw new Error('An isochron needs at least three points');
  for (const p of pts) if (!(p.sx > 0 && p.sy > 0)) throw new Error('Every point needs x and y errors above zero');
  const wx = pts.map((p) => 1 / (p.sx * p.sx)), wy = pts.map((p) => 1 / (p.sy * p.sy)), r = pts.map((p) => p.r ?? 0);
  const al = wx.map((w, i) => Math.sqrt(w * wy[i]));
  const X = pts.map((p) => p.x), Y = pts.map((p) => p.y);
  // Start from ordinary least squares.
  const mx = X.reduce((s, v) => s + v, 0) / n, my = Y.reduce((s, v) => s + v, 0) / n;
  let b = X.reduce((s, v, i) => s + (v - mx) * (Y[i] - my), 0) / X.reduce((s, v) => s + (v - mx) ** 2, 0);
  let W: number[] = [], Xb = 0, Yb = 0, beta: number[] = [];
  for (let it = 0; it < 200; it++) {
    W = wx.map((w, i) => (w * wy[i]) / (w + b * b * wy[i] - 2 * b * r[i] * al[i]));
    const SW = W.reduce((s, v) => s + v, 0);
    Xb = W.reduce((s, w, i) => s + w * X[i], 0) / SW; Yb = W.reduce((s, w, i) => s + w * Y[i], 0) / SW;
    const U = X.map((v) => v - Xb), V = Y.map((v) => v - Yb);
    beta = W.map((w, i) => w * (U[i] / wy[i] + (b * V[i]) / wx[i] - ((b * U[i] + V[i]) * r[i]) / al[i]));
    const nb = W.reduce((s, w, i) => s + w * beta[i] * V[i], 0) / W.reduce((s, w, i) => s + w * beta[i] * U[i], 0);
    const done = Math.abs(nb - b) <= 1e-15 * Math.max(1, Math.abs(nb));
    b = nb;
    if (done) break;
  }
  const a = Yb - b * Xb;
  const SW = W.reduce((s, v) => s + v, 0);
  const x = beta.map((v) => Xb + v), xb = W.reduce((s, w, i) => s + w * x[i], 0) / SW;
  const sb = Math.sqrt(1 / W.reduce((s, w, i) => s + w * (x[i] - xb) ** 2, 0)), sa = Math.sqrt(1 / SW + xb * xb * sb * sb);
  const chi2 = W.reduce((s, w, i) => s + w * (Y[i] - b * X[i] - a) ** 2, 0), df = n - 2, mswd = chi2 / df;
  return { a, b, sa, sb, mswd, df, p: chiSqUpper(chi2, df), cov: -xb * sb * sb };
}

/** Upper tail probability of chi-square with k degrees of freedom (regularised gamma). */
export function chiSqUpper(x: number, k: number) {
  const a = k / 2, z = x / 2;
  if (z <= 0) return 1;
  const lg = lnGamma(a);
  if (z < a + 1) { let s = 1 / a, t = s; for (let n = 1; n < 500; n++) { t *= z / (a + n); s += t; if (t < s * 1e-15) break; } return 1 - s * Math.exp(-z + a * Math.log(z) - lg); }
  let b = z + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; }
  return Math.exp(-z + a * Math.log(z) - lg) * h;
}
function lnGamma(x: number): number {
  const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015;
  for (const c of g) s += c / ++y;
  return -t + Math.log((2.5066282746310005 * s) / x);
}

/** Isochron age from the slope, with 1σ; if MSWD > 1 the error is also given scaled by √MSWD. */
export function isochronAge(fit: ReturnType<typeof york>, lambda: number) {
  const t = Math.log1p(fit.b) / lambda, s = fit.sb / (lambda * (1 + fit.b));
  return { t, s, sScaled: s * Math.sqrt(Math.max(1, fit.mswd)), initial: fit.a, sInitial: fit.sa, sInitialScaled: fit.sa * Math.sqrt(Math.max(1, fit.mswd)) };
}

/** radiogenic ²⁰⁷Pb to ²⁰⁶Pb ratio for age t. */
export const pb76 = (t: number) => Math.expm1(L235 * t) / Math.expm1(L238 * t) / U85;
/** Age from the radiogenic ²⁰⁷Pb/²⁰⁶Pb ratio (solved numerically). */
export function age76(R: number) {
  if (!(R > 1 / U85 * (L235 / L238))) throw new Error('The ²⁰⁷Pb/²⁰⁶Pb ratio is too low for any positive age');
  let lo = 1, hi = 6e9;
  if (pb76(hi) < R) throw new Error('The ²⁰⁷Pb/²⁰⁶Pb ratio is too high: it would be older than 6 billion years');
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (pb76(m) < R) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** The three U-Pb ages from radiogenic ²⁰⁶Pb/²³⁸U and ²⁰⁷Pb/²³⁵U, and concordance (206/238 age ÷ 207/206 age). */
export function uPbAges(r68: number, r75: number, s68 = 0, s75 = 0) {
  const t68 = Math.log1p(r68) / L238, t75 = Math.log1p(r75) / L235;
  const r76 = r75 / (r68 * U85), t76 = age76(r76);
  // 207/206 age error by propagating the two ratio errors (uncorrelated) through the slope of pb76.
  const dt = 1e3, slope = (pb76(t76 + dt) - pb76(t76 - dt)) / (2 * dt), sr76 = r76 * Math.hypot(s75 / r75, s68 / r68);
  return {
    t68, s68: s68 / (L238 * (1 + r68)), t75, s75: s75 / (L235 * (1 + r75)), t76, s76: sr76 / slope, r76,
    concordance: t68 / t76,
  };
}

/** Concordia point for age t: (²⁰⁷Pb/²³⁵U, ²⁰⁶Pb/²³⁸U). */
export const concordia = (t: number): [number, number] => [Math.expm1(L235 * t), Math.expm1(L238 * t)];

/** Format an age in years with a sensible unit. */
export function fmtAge(t: number, s?: number) {
  const [f, u] = Math.abs(t) >= 1e6 ? [1e6, 'Ma'] : Math.abs(t) >= 1e3 ? [1e3, 'ka'] : [1, 'years'];
  const v = t / f;
  if (s === undefined || !(s > 0)) return `${+v.toPrecision(4)} ${u}`;
  const sv = s / f, dec = Math.max(0, Math.min(6, 1 - Math.floor(Math.log10(sv))));
  return `${v.toFixed(dec)} ± ${sv.toFixed(dec)} ${u}`;
}
