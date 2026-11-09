// Beverton-Holt yield per recruit (F0.1, Fmax) and surplus production models (Schaefer and Fox): MSY, BMSY, FMSY from
// parameters or fitted to a catch and CPUE series by observation-error least squares.

export type YprPar = { M: number; K: number; t0: number; Winf: number; tr: number; tc: number; tl: number };
const U = [1, -3, 3, -1];

/**
 * Beverton and Holt (1957) yield per recruit in weight, with isometric growth W(t) = W∞(1 − e^(−K(t − t0)))³:
 * Y/R = F e^(−M(tc − tr)) W∞ Σ Uₙ e^(−nK(tc − t0)) / (F + M + nK) × (1 − e^(−(F + M + nK)(tλ − tc))).
 * tλ may be Infinity.
 */
export function ypr(F: number, p: YprPar): number {
  let s = 0;
  for (let n = 0; n < 4; n++) {
    const z = F + p.M + n * p.K;
    const tail = Number.isFinite(p.tl) ? 1 - Math.exp(-z * (p.tl - p.tc)) : 1;
    s += (U[n] * Math.exp(-n * p.K * (p.tc - p.t0)) * tail) / z;
  }
  return F * Math.exp(-p.M * (p.tc - p.tr)) * p.Winf * s;
}

/** Fmax (F giving the most yield per recruit, up to fHi) and F0.1 (where the slope is 10 % of the slope at F = 0). */
export function refPoints(p: YprPar, fHi = 5) {
  const f = (F: number) => ypr(F, p);
  // Coarse grid, then golden-section refinement around the best point.
  const N = 2000; let bi = 0, bv = -Infinity;
  for (let i = 1; i <= N; i++) { const v = f((fHi * i) / N); if (v > bv) { bv = v; bi = i; } }
  let Fmax = NaN;
  if (bi < N) {
    let a = (fHi * Math.max(0, bi - 1)) / N, b = (fHi * (bi + 1)) / N;
    const g = (Math.sqrt(5) - 1) / 2;
    for (let k = 0; k < 200; k++) { const c = b - g * (b - a), d = a + g * (b - a); if (f(c) > f(d)) b = d; else a = c; }
    Fmax = (a + b) / 2;
  }
  const h = 1e-6, slope = (F: number) => (f(F + h) - f(Math.max(0, F - h))) / (F + h - Math.max(0, F - h));
  const s0 = slope(0), target = 0.1 * s0;
  let lo = 0, hi = Number.isFinite(Fmax) ? Fmax : fHi, F01 = NaN;
  if (slope(hi) < target) {
    for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (slope(m) > target) lo = m; else hi = m; }
    F01 = (lo + hi) / 2;
  }
  return { Fmax, yMax: Number.isFinite(Fmax) ? f(Fmax) : NaN, F01, y01: Number.isFinite(F01) ? f(F01) : NaN };
}

export type Model = 'schaefer' | 'fox';
/** Surplus production: Schaefer g(B) = rB(1 − B/K); Fox (Gompertz form) g(B) = rB ln(K/B). */
export const surplus = (m: Model, B: number, r: number, K: number) => (m === 'schaefer' ? r * B * (1 - B / K) : B > 0 ? r * B * Math.log(K / B) : 0);
/** MSY reference points: Schaefer MSY = rK/4, BMSY = K/2, FMSY = r/2; Fox MSY = rK/e, BMSY = K/e, FMSY = r. */
export function msy(m: Model, r: number, K: number) {
  return m === 'schaefer' ? { MSY: (r * K) / 4, BMSY: K / 2, FMSY: r / 2 } : { MSY: (r * K) / Math.E, BMSY: K / Math.E, FMSY: r };
}

/** Biomass each year from B₁ = start × K, B(t+1) = B(t) + g(B(t)) − C(t) (floored at a tiny positive value). */
export function project(m: Model, r: number, K: number, catches: number[], start = 1) {
  const B = [start * K];
  for (let t = 0; t < catches.length; t++) B.push(Math.max(1e-6 * K, B[t] + surplus(m, B[t], r, K) - catches[t]));
  return B;
}

/** Observation-error fit: ln I(t) = ln q + ln B(t) + ε. q has a closed form; r and K are found by Nelder-Mead. */
export function fitProduction(m: Model, catches: number[], cpue: (number | null)[], start = 1) {
  const obs = cpue.map((v, i) => (v !== null && v > 0 ? i : -1)).filter((i) => i >= 0);
  if (obs.length < 4) throw new Error('Give a CPUE (above 0) for at least 4 years.');
  const sse = (lr: number, lK: number) => {
    const r = Math.exp(lr), K = Math.exp(lK), B = project(m, r, K, catches, start);
    const d = obs.map((i) => Math.log(cpue[i]!) - Math.log(B[i]));
    const lq = d.reduce((s, v) => s + v, 0) / d.length;
    return { s: d.reduce((s, v) => s + (v - lq) ** 2, 0), lq, B };
  };
  const cmax = Math.max(...catches), ctot = catches.reduce((s, v) => s + v, 0);
  let best = { x: [0, 0], v: Infinity };
  for (const r0 of [0.1, 0.3, 0.6, 1.0]) for (const k0 of [2, 5, 10, 20]) {
    const x = nelderMead((v) => sse(v[0], v[1]).s, [Math.log(r0), Math.log(Math.max(cmax * k0, ctot / 4))]);
    const v = sse(x[0], x[1]).s;
    if (v < best.v) best = { x, v };
  }
  const r = Math.exp(best.x[0]), K = Math.exp(best.x[1]), res = sse(best.x[0], best.x[1]), q = Math.exp(res.lq);
  const n = obs.length, sigma = Math.sqrt(res.s / Math.max(1, n - 3));
  return { r, K, q, sse: res.s, sigma, B: res.B, fitted: res.B.slice(0, catches.length).map((b) => q * b), n, ...msy(m, r, K) };
}

/** Nelder-Mead simplex minimiser (standard coefficients), for a few parameters. */
export function nelderMead(f: (x: number[]) => number, x0: number[], step = 0.5, iters = 4000): number[] {
  const n = x0.length;
  let S = [x0, ...x0.map((_, i) => x0.map((v, j) => (i === j ? v + step : v)))].map((x) => ({ x, v: f(x) }));
  for (let it = 0; it < iters; it++) {
    S.sort((a, b) => a.v - b.v);
    if (Math.abs(S[n].v - S[0].v) <= 1e-14 * (Math.abs(S[0].v) + 1e-14) && Math.max(...S.map((s) => Math.max(...s.x.map((v, j) => Math.abs(v - S[0].x[j]))))) < 1e-10) break;
    const c = x0.map((_, j) => S.slice(0, n).reduce((s, p) => s + p.x[j], 0) / n);
    const pt = (a: number) => c.map((v, j) => v + a * (S[n].x[j] - v));
    const xr = pt(-1), vr = f(xr);
    if (vr < S[0].v) { const xe = pt(-2), ve = f(xe); S[n] = ve < vr ? { x: xe, v: ve } : { x: xr, v: vr }; }
    else if (vr < S[n - 1].v) S[n] = { x: xr, v: vr };
    else {
      const xc = vr < S[n].v ? pt(-0.5) : pt(0.5), vc = f(xc);
      if (vc < Math.min(vr, S[n].v)) S[n] = { x: xc, v: vc };
      else S = S.map((s, i) => (i === 0 ? s : { x: s.x.map((v, j) => S[0].x[j] + 0.5 * (v - S[0].x[j])), v: NaN })).map((s) => ({ x: s.x, v: Number.isNaN(s.v) ? f(s.x) : s.v }));
    }
  }
  S.sort((a, b) => a.v - b.v);
  return S[0].x;
}
