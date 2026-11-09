// Isothermal ideal reactors: CSTR, PFR, CSTRs in series and constant-volume batch, for a reaction A -> products
// with an n-th order, reversible first-order (A <-> B) or saturating (Michaelis-Menten form) rate law, and an
// Arrhenius rate constant. Gas-phase volume change is allowed in flow reactors through epsilon
// (C_A = C_A0 (1 - X) / (1 + eps X)). Units are the user's own, as long as they are consistent.

export const RGAS = 8.314462618; // J/(mol K)
export type RateKind = 'power' | 'reversible' | 'mm';
export type Rate = { kind: RateKind; k: number; n?: number; K?: number; Km?: number; CA0: number; eps?: number };

/** Arrhenius: k at T (K) from k at Tref (K) and the activation energy Ea (J/mol). */
export const arrhenius = (kRef: number, Ea: number, Tref: number, T: number) => kRef * Math.exp((-Ea / RGAS) * (1 / T - 1 / Tref));

/** Concentration of A at conversion X (flow reactors with volume change eps; batch uses eps = 0). */
export const CA = (r: Rate, X: number, eps = r.eps ?? 0) => (r.CA0 * (1 - X)) / (1 + eps * X);
/** Rate of disappearance of A, -rA, at conversion X. */
export function rateAt(r: Rate, X: number, eps = r.eps ?? 0): number {
  const ca = Math.max(0, CA(r, X, eps));
  if (r.kind === 'power') return r.k * Math.pow(ca, r.n ?? 1);
  if (r.kind === 'reversible') { const cb = (r.CA0 * X) / (1 + eps * X); return r.k * (ca - cb / r.K!); }
  return (r.k * ca) / (r.Km! + ca);
}
/** Highest conversion reachable: equilibrium for the reversible law, else 1. */
export const xMax = (r: Rate) => (r.kind === 'reversible' ? r.K! / (1 + r.K!) : 1);

/** Adaptive Simpson integration of f on [a, b]. */
export function integrate(f: (x: number) => number, a: number, b: number, tol = 1e-11): number {
  const simpson = (fa: number, fm: number, fb: number, h: number) => (h / 6) * (fa + 4 * fm + fb);
  const rec = (a: number, b: number, fa: number, fm: number, fb: number, whole: number, tol: number, depth: number): number => {
    const m = (a + b) / 2, lm = (a + m) / 2, rm = (m + b) / 2, flm = f(lm), frm = f(rm);
    const left = simpson(fa, flm, fm, m - a), right = simpson(fm, frm, fb, b - m);
    if (depth > 40 || Math.abs(left + right - whole) <= 15 * tol) return left + right + (left + right - whole) / 15;
    return rec(a, m, fa, flm, fm, left, tol / 2, depth + 1) + rec(m, b, fm, frm, fb, right, tol / 2, depth + 1);
  };
  const fa = f(a), fb = f(b), fm = f((a + b) / 2);
  return rec(a, b, fa, fm, fb, simpson(fa, fm, fb, b - a), tol, 0);
}

/** CSTR volume for conversion X with entering molar flow FA0 = CA0 v0. */
export const cstrVolume = (r: Rate, v0: number, X: number) => (r.CA0 * v0 * X) / rateAt(r, X);
/** PFR volume: FA0 times the integral of dX / (-rA) from 0 to X. */
export const pfrVolume = (r: Rate, v0: number, X: number) => r.CA0 * v0 * integrate((x) => 1 / rateAt(r, x), 0, X);
/** Constant-volume batch time: CA0 times the integral of dX / (-rA) with no volume change. */
export const batchTime = (r: Rate, X: number) => r.CA0 * integrate((x) => 1 / rateAt(r, x, 0), 0, X);

/** Invert a monotone increasing function of X on [0, xm) by bisection. */
function invert(g: (X: number) => number, target: number, xm: number): number {
  let lo = 0, hi = xm * (1 - 1e-12);
  if (g(hi) <= target) return hi;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < target) lo = m; else hi = m; if (hi - lo < 1e-14) break; }
  return (lo + hi) / 2;
}
export const cstrConversion = (r: Rate, v0: number, V: number) => invert((X) => cstrVolume(r, v0, X), V, xMax(r));
export const pfrConversion = (r: Rate, v0: number, V: number) => invert((X) => pfrVolume(r, v0, X), V, xMax(r));
export const batchConversion = (r: Rate, t: number) => invert((X) => batchTime(r, X), t, xMax(r));

/** N equal CSTRs in series, each of volume Vi: conversion after each tank (ε applies to the overall conversion). */
export function seriesConversions(r: Rate, v0: number, N: number, Vi: number): number[] {
  const out: number[] = [];
  let Xprev = 0;
  for (let i = 0; i < N; i++) {
    // Tank balance: FA0 (X - Xprev) = (-rA(X)) Vi
    const g = (X: number) => (r.CA0 * v0 * (X - Xprev)) / rateAt(r, X);
    const X = invert(g, Vi, xMax(r));
    out.push(Math.max(X, Xprev)); Xprev = X;
  }
  return out;
}
/** Total volume of N equal CSTRs in series to reach X. */
export function seriesVolume(r: Rate, v0: number, N: number, X: number): number {
  let lo = 0, hi = cstrVolume(r, v0, X); // one big tank is the most any equal-tank train needs
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, x = seriesConversions(r, v0, N, m / N)[N - 1]; if (x < X) lo = m; else hi = m; if (hi - lo < 1e-13 * hi) break; }
  return (lo + hi) / 2;
}
