// Debye and Einstein heat capacity models and least-squares fits to measured C(T). Plain maths, no DOM.
// Heat capacities in J/(mol·K) per mole of formula units with n atoms each.

/** Molar gas constant (CODATA exact value, J/(mol·K)). */
export const R = 8.314462618;

/** ∫₀ˣ u⁴eᵘ/(eᵘ − 1)² du by composite Simpson (the integrand is written to stay finite near 0 and for large u). */
export function debyeIntegral(x: number): number {
  if (!(x > 0)) return 0;
  const f = (u: number) => { if (u < 1e-6) return u * u; const e = Math.exp(-u); return (u ** 4 * e) / ((1 - e) * (1 - e)); };
  const top = Math.min(x, 60), n = 400, h = top / n;
  let s = f(0) + f(top);
  for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
  const I = (s * h) / 3;
  // Beyond u = 60 the integrand is below 1e-18: the remaining tail is negligible.
  return I;
}
/** Debye heat capacity C = 9nR (T/θ)³ ∫₀^{θ/T} u⁴eᵘ/(eᵘ−1)² du. */
export function debyeC(T: number, theta: number, n = 1): number {
  if (!(T > 0)) return 0;
  const x = theta / T;
  if (x < 1e-4) return 3 * n * R * (1 - (x * x) / 20);
  return 9 * n * R * debyeIntegral(x) / (x * x * x);
}
/** Einstein heat capacity C = 3nR x² eˣ/(eˣ − 1)² with x = θ/T. */
export function einsteinC(T: number, theta: number, n = 1): number {
  if (!(T > 0)) return 0;
  const x = theta / T;
  if (x > 700) return 0;
  if (x < 1e-6) return 3 * n * R;
  const e = Math.exp(-x);
  return (3 * n * R * x * x * e) / ((1 - e) * (1 - e));
}
/** Low-temperature Debye law C ≈ (12π⁴/5) nR (T/θ)³: the β coefficient and the θ it implies. */
export const debyeBeta = (theta: number, n = 1) => (12 * Math.PI ** 4 * n * R) / (5 * theta ** 3);
export const thetaFromBeta = (beta: number, n = 1) => Math.cbrt((12 * Math.PI ** 4 * n * R) / (5 * beta));

export type FitOpts = { model: 'debye' | 'einstein'; gamma: boolean; weight: 'rel' | 'abs'; n: number };
export type HeatFit = { theta: number; gamma: number; seTheta: number; seGamma: number; rms: number; rmsRel: number; dof: number; model: (T: number) => number };

const base = (o: FitOpts) => (T: number, th: number) => (o.model === 'debye' ? debyeC(T, th, o.n) : einsteinC(T, th, o.n));

/**
 * Least-squares fit of θ (and an electronic γT term if asked). Weights 1/C² (relative errors, the default; suits
 * data spanning decades) or equal. γ is solved exactly for each θ (variable projection) and θ by a scan on log θ
 * then golden-section search. Standard errors from the Jacobian, scaled by the residual variance (like SciPy's
 * curve_fit with absolute_sigma = False).
 */
export function fitHeat(T: number[], C: number[], o: FitOpts): HeatFit {
  const f = base(o), w = C.map((c) => (o.weight === 'rel' ? 1 / (c * c) : 1));
  const gammaFor = (th: number) => {
    if (!o.gamma) return 0;
    let num = 0, den = 0;
    T.forEach((t, i) => { num += w[i] * t * (C[i] - f(t, th)); den += w[i] * t * t; });
    return num / den;
  };
  const ssr = (th: number) => { const g = gammaFor(th); return T.reduce((s, t, i) => s + w[i] * (C[i] - f(t, th) - g * t) ** 2, 0); };
  const lo = Math.log(2), hi = Math.log(5000), N = 240;
  let best = lo, bs = Infinity;
  for (let i = 0; i <= N; i++) { const x = lo + ((hi - lo) * i) / N, s = ssr(Math.exp(x)); if (s < bs) { bs = s; best = x; } }
  let a = Math.max(lo, best - (hi - lo) / N), b = Math.min(hi, best + (hi - lo) / N);
  const gr = (Math.sqrt(5) - 1) / 2;
  let c1 = b - gr * (b - a), c2 = a + gr * (b - a), f1 = ssr(Math.exp(c1)), f2 = ssr(Math.exp(c2));
  for (let k = 0; k < 100 && b - a > 1e-12; k++) {
    if (f1 < f2) { b = c2; c2 = c1; f2 = f1; c1 = b - gr * (b - a); f1 = ssr(Math.exp(c1)); }
    else { a = c1; c1 = c2; f1 = f2; c2 = a + gr * (b - a); f2 = ssr(Math.exp(c2)); }
  }
  const theta = Math.exp((a + b) / 2), gamma = gammaFor(theta);
  const p = o.gamma ? 2 : 1, dof = T.length - p, S = ssr(theta), s2 = dof > 0 ? S / dof : NaN;
  // Jacobian columns: ∂C/∂θ (numeric) and ∂C/∂γ = T.
  const h = theta * 1e-5;
  const dth = T.map((t) => (f(t, theta + h) - f(t, theta - h)) / (2 * h));
  let a11 = 0, a12 = 0, a22 = 0;
  T.forEach((t, i) => { a11 += w[i] * dth[i] * dth[i]; a12 += w[i] * dth[i] * t; a22 += w[i] * t * t; });
  let seTheta: number, seGamma = NaN;
  if (o.gamma) { const det = a11 * a22 - a12 * a12; seTheta = Math.sqrt((s2 * a22) / det); seGamma = Math.sqrt((s2 * a11) / det); }
  else seTheta = Math.sqrt(s2 / a11);
  const model = (t: number) => f(t, theta) + gamma * t;
  const res = T.map((t, i) => C[i] - model(t));
  const rms = Math.sqrt(res.reduce((s, r) => s + r * r, 0) / T.length);
  const rmsRel = Math.sqrt(res.reduce((s, r, i) => s + (r / C[i]) ** 2, 0) / T.length);
  return { theta, gamma, seTheta, seGamma, rms, rmsRel, dof, model };
}

/** Straight-line fit of C/T against T² for T ≤ Tmax: C/T = γ + βT², with standard errors and the Debye θ from β. */
export function lowT(T: number[], C: number[], Tmax: number, n = 1) {
  const x: number[] = [], y: number[] = [];
  T.forEach((t, i) => { if (t > 0 && t <= Tmax) { x.push(t * t); y.push(C[i] / t); } });
  const m = x.length;
  if (m < 3) return null;
  const mx = x.reduce((s, v) => s + v, 0) / m, my = y.reduce((s, v) => s + v, 0) / m;
  let sxx = 0, sxy = 0; x.forEach((v, i) => { sxx += (v - mx) ** 2; sxy += (v - mx) * (y[i] - my); });
  const beta = sxy / sxx, gamma = my - beta * mx;
  const s2 = x.reduce((s, v, i) => s + (y[i] - gamma - beta * v) ** 2, 0) / (m - 2);
  const seBeta = Math.sqrt(s2 / sxx), seGamma = Math.sqrt(s2 * (1 / m + (mx * mx) / sxx));
  const theta = beta > 0 ? thetaFromBeta(beta, n) : NaN, seThetaD = beta > 0 ? (theta / 3) * (seBeta / beta) : NaN;
  return { n: m, gamma, beta, seGamma, seBeta, theta, seTheta: seThetaD, x, y };
}
