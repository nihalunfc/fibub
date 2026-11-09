// Optical fibre: numerical aperture, V-number, LP mode cutoffs and counts (weakly guiding step-index fibre), the
// exact LP01 propagation constant, mode-field diameter, pulse spreading and a link power budget. Plain maths, no DOM.

const C0 = 299792458;

/** Bessel J_n(x) for integer n ≥ 0 from J_n(x) = (1/π)∫₀^π cos(nτ − x sin τ) dτ (trapezoid rule, exact for a periodic integrand with enough points). */
export function besselJn(n: number, x: number): number {
  const N = Math.ceil(Math.abs(x) + n + 40);
  let s = 0;
  for (let k = 0; k < N; k++) { const t = ((k + 0.5) * Math.PI) / N; s += Math.cos(n * t - x * Math.sin(t)); }
  return s / N;
}
/** Modified Bessel K_n(x), x > 0, from K_n(x) = ∫₀^∞ exp(−x cosh t) cosh(nt) dt (trapezoid, exponentially accurate). */
export function besselKn(n: number, x: number): number {
  const h = 0.02, T = Math.acosh(Math.max(1, 750 / x + 1)) + 1;
  let s = 0.5 * Math.exp(-x);
  for (let t = h; t <= T; t += h) { const e = Math.exp(-x * Math.cosh(t)); if (e === 0) break; s += e * Math.cosh(n * t); }
  return s * h;
}

/** The m-th positive zero of J_n (m from 1), by scanning and bisection. */
export function besselZero(n: number, m: number): number {
  let found = 0, x0 = n === 0 ? 0.1 : n + 0.5, f0 = besselJn(n, x0);
  for (let x = x0 + 0.05; x < 1e4; x += 0.05) {
    const f = besselJn(n, x);
    if (f0 * f < 0) {
      found++;
      if (found === m) { let lo = x - 0.05, hi = x; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (besselJn(n, lo) * besselJn(n, mid) <= 0) hi = mid; else lo = mid; } return (lo + hi) / 2; }
    }
    x0 = x; f0 = f;
  }
  return NaN;
}

export type LPMode = { l: number; m: number; vc: number; degeneracy: number };
/** Guided LP modes of a step-index fibre with V-number V (weak guidance). LP0m cuts off at the (m−1)th zero of J1 (LP01 never),
 * LP1m at the m-th zero of J0, LPlm (l ≥ 2) at the m-th non-zero zero of J_(l−1). */
export function lpModes(V: number, maxModes = 5000): LPMode[] {
  const out: LPMode[] = [];
  for (let l = 0; ; l++) {
    let any = false;
    for (let m = 1; ; m++) {
      const vc = l === 0 ? (m === 1 ? 0 : besselZero(1, m - 1)) : besselZero(l - 1, m);
      if (!(vc < V)) break;
      out.push({ l, m, vc, degeneracy: l === 0 ? 2 : 4 }); any = true;
      if (out.length >= maxModes) return out;
    }
    if (!any) break;
  }
  return out.sort((a, b) => a.vc - b.vc);
}

export type Fibre = { n1: number; n2: number; aUm: number; lamNm: number };
export function basics(f: Fibre, n0 = 1) {
  const NA = Math.sqrt(f.n1 * f.n1 - f.n2 * f.n2), delta = (f.n1 * f.n1 - f.n2 * f.n2) / (2 * f.n1 * f.n1);
  const V = (2 * Math.PI * f.aUm * NA) / (f.lamNm / 1000);
  const accept = NA >= n0 ? 90 : (Math.asin(NA / n0) * 180) / Math.PI;
  const cutoffNm = (2 * Math.PI * f.aUm * NA * 1000) / 2.404825557695773;
  return { NA, delta, V, accept, cutoffNm, singleMode: V < 2.404825557695773 };
}

/** Normalised propagation constant b of LP01, solving u J1(u)/J0(u) = w K1(w)/K0(w), u² + w² = V². */
export function bLP01(V: number): number {
  const umax = Math.min(V, 2.404825557695773) * (1 - 1e-12);
  const g = (u: number) => { const w = Math.sqrt(Math.max(V * V - u * u, 1e-300)); return (u * besselJn(1, u)) / besselJn(0, u) - (w * besselKn(1, w)) / besselKn(0, w); };
  let lo = 1e-9, hi = umax;
  for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (g(lo) * g(mid) <= 0) hi = mid; else lo = mid; }
  const u = (lo + hi) / 2;
  return 1 - (u * u) / (V * V);
}
/** Effective index from b. */
export const nEff = (f: Fibre, b: number) => Math.sqrt(f.n2 * f.n2 + b * (f.n1 * f.n1 - f.n2 * f.n2));
/** Marcuse (1977) Gaussian mode-field radius ratio w/a ≈ 0.65 + 1.619 V^−1.5 + 2.879 V^−6 (good for about 1.2 < V < 2.4). */
export const marcuse = (V: number) => 0.65 + 1.619 * V ** -1.5 + 2.879 * V ** -6;

/** Pulse spreading (s) over L metres. Modal: step-index ray model L n1 (n1 − n2)/(c n2); parabolic graded index L n1 Δ²/(8c).
 * Chromatic: |D| (ps/(nm km)) × L (km) × Δλ (nm). */
export function spreading(f: Fibre, profile: 'step' | 'graded', singleMode: boolean, Lm: number, D: number, dLamNm: number) {
  const delta = (f.n1 * f.n1 - f.n2 * f.n2) / (2 * f.n1 * f.n1);
  const modal = singleMode ? 0 : profile === 'step' ? (Lm * f.n1 * (f.n1 - f.n2)) / (C0 * f.n2) : (Lm * f.n1 * delta * delta) / (8 * C0);
  const chrom = Math.abs(D) * 1e-12 * (Lm / 1000) * dLamNm;
  const total = Math.hypot(modal, chrom);
  return { modal, chrom, total, bandwidth: total > 0 ? 0.44 / total : Infinity };
}

export type Budget = { txDbm: number; rxDbm: number; attDbPerKm: number; Lkm: number; nConn: number; connDb: number; nSplice: number; spliceDb: number; marginDb: number };
export function linkBudget(b: Budget) {
  const fibre = b.attDbPerKm * b.Lkm, conn = b.nConn * b.connDb, splice = b.nSplice * b.spliceDb;
  const loss = fibre + conn + splice;
  const rx = b.txDbm - loss, spare = rx - b.rxDbm - b.marginDb;
  const maxKm = b.attDbPerKm > 0 ? (b.txDbm - b.rxDbm - b.marginDb - conn - splice) / b.attDbPerKm : Infinity;
  return { fibre, conn, splice, loss, rx, spare, ok: spare >= 0, maxKm, available: b.txDbm - b.rxDbm };
}
