// Leaf photosynthesis curves. Plain maths; no DOM.
// Light response: non-rectangular hyperbola (Thornley 1976; Marshall and Biscoe 1980):
//   θA² − (φI + Amax)A + φI·Amax = 0 for gross A; net A = gross − Rd.
// A/Ci: Farquhar, von Caemmerer and Berry (1980) model, net A = min(Ac, Aj) − Rd with
//   Ac = Vcmax (Ci − Γ*)/(Ci + Kc(1 + O/Ko)) and Aj = J (Ci − Γ*)/(a·Ci + b·Γ*), (a, b) = (4, 8) or (4.5, 10.5).
import { levenbergMarquardt, fitLine, invSPD, solveSPD } from './fit.ts';

/** Gross photosynthesis from the non-rectangular hyperbola (θ = 0 gives the rectangular hyperbola). */
export function nrhGross(I: number, amax: number, phi: number, theta: number): number {
  const b = phi * I + amax;
  if (Math.abs(theta) < 1e-9) return b > 0 ? (phi * I * amax) / b : 0;
  return (b - Math.sqrt(Math.max(0, b * b - 4 * theta * phi * I * amax))) / (2 * theta);
}

export type LightFit = {
  amax: number; phi: number; theta: number; rd: number; se: [number, number, number, number]; thetaFixed: boolean;
  r2: number; s: number; n: number; lcp: number; ik: number; isat: number; satFrac: number; converged: boolean;
};

/** Light needed for gross photosynthesis to reach G (G < Amax). */
const lightFor = (G: number, amax: number, phi: number, theta: number) => (G * (amax - theta * G)) / (phi * (amax - G));

/**
 * Fit net A against PPFD. `thetaFix` (0 to 1) holds θ fixed; otherwise it is fitted and kept within 0 to 1.
 * `satFrac` sets the light saturation point: the PPFD where net A reaches that share of its maximum (Amax − Rd).
 */
export function fitLight(I: number[], A: number[], thetaFix: number | null = null, satFrac = 0.9): LightFit {
  const n = I.length;
  // Starting values from the low-light points.
  const lowIdx = I.map((v, i) => i).filter((i) => I[i] <= Math.max(200, [...I].sort((a, b) => a - b)[Math.min(3, n - 1)]));
  const lf = fitLine(lowIdx.map((i) => I[i]), lowIdx.map((i) => A[i]));
  const rd0 = Math.max(0.01, -lf.intercept), phi0 = Math.min(0.2, Math.max(0.005, lf.slope)), amax0 = Math.max(...A) + rd0;
  const run = (th: number | null) => {
    if (th === null) return levenbergMarquardt((x, p) => nrhGross(x, p[0], p[1], p[2]) - p[3], I, A, [amax0 * 1.1, phi0, 0.7, rd0]);
    const f = levenbergMarquardt((x, p) => nrhGross(x, p[0], p[1], th) - p[2], I, A, [amax0 * 1.1, phi0, rd0]);
    return { ...f, p: [f.p[0], f.p[1], th, f.p[2]], se: [f.se[0], f.se[1], 0, f.se[2]] };
  };
  let fit = run(thetaFix), fixed = thetaFix !== null;
  if (!fixed && !(fit.p[2] >= 0 && fit.p[2] <= 1)) { fit = run(fit.p[2] > 1 ? 1 : 0); fixed = true; }
  const [amax, phi, theta, rd] = fit.p;
  const lcp = lightFor(rd, amax, phi, theta);
  const isat = lightFor(satFrac * (amax - rd) + rd, amax, phi, theta);
  return { amax, phi, theta, rd, se: fit.se as [number, number, number, number], thetaFixed: fixed, r2: fit.r2, s: fit.s, n, lcp, ik: amax / phi, isat, satFrac, converged: fit.converged };
}

export type AciConst = { gammaStar: number; kc: number; ko: number; o: number; jA: number; jB: number };
/** Bernacchi et al. (2001) values at 25 °C: Γ* 42.75 µmol mol⁻¹, Kc 404.9 µmol mol⁻¹, Ko 278.4 mmol mol⁻¹; O 210 mmol mol⁻¹. */
export const BERNACCHI_25: AciConst = { gammaStar: 42.75, kc: 404.9, ko: 278.4, o: 210, jA: 4, jB: 8 };

export const fRubisco = (ci: number, k: AciConst) => (ci - k.gammaStar) / (ci + k.kc * (1 + k.o / k.ko));
export const fRubp = (ci: number, k: AciConst) => (ci - k.gammaStar) / (k.jA * ci + k.jB * k.gammaStar);

export type AciFit = {
  vcmax: number; j: number; rd: number; se: [number, number, number]; nRubisco: number; nRubp: number; split: number;
  sse: number; s: number; r2: number; ciTransition: number; consistent: boolean; limits: ('Rubisco' | 'RuBP')[];
};

/** Linear least squares for a fixed set of Rubisco-limited points (the rest RuBP-limited). Parameters (Vcmax, J, Rd). */
function fitSplit(ci: number[], A: number[], isC: boolean[], k: AciConst) {
  const X = ci.map((c, i) => [isC[i] ? fRubisco(c, k) : 0, isC[i] ? 0 : fRubp(c, k), -1]);
  const XtX = [0, 1, 2].map((a) => [0, 1, 2].map((b) => X.reduce((s, r) => s + r[a] * r[b], 0)));
  const Xty = [0, 1, 2].map((a) => X.reduce((s, r, i) => s + r[a] * A[i], 0));
  const p = solveSPD(XtX, Xty);
  if (!p) return null;
  const sse = X.reduce((s, r, i) => s + (A[i] - (r[0] * p[0] + r[1] * p[1] + r[2] * p[2])) ** 2, 0);
  const df = ci.length - 3, inv = invSPD(XtX);
  const se = inv ? [0, 1, 2].map((i) => Math.sqrt((inv[i][i] * sse) / df)) : [NaN, NaN, NaN];
  return { p, sse, se };
}

/**
 * Fit Vcmax, J and Rd to an A/Ci curve. With `splitCi` given, points with Ci below it are Rubisco-limited.
 * Otherwise every split (at least two points in each part) is tried, and the best one where each point is on
 * its own limiting curve (Ac ≤ Aj for Rubisco points, Aj ≤ Ac for RuBP points) is kept.
 */
export function fitAci(ciIn: number[], aIn: number[], k: AciConst = BERNACCHI_25, splitCi: number | null = null): AciFit | null {
  const ord = ciIn.map((_, i) => i).sort((a, b) => ciIn[a] - ciIn[b]);
  const ci = ord.map((i) => ciIn[i]), A = ord.map((i) => aIn[i]), n = ci.length;
  if (n < 4) return null;
  type Cand = { k: number; f: NonNullable<ReturnType<typeof fitSplit>>; ok: boolean };
  const cands: Cand[] = [];
  const splits = splitCi === null ? Array.from({ length: n - 3 }, (_, i) => i + 2) : [ci.filter((c) => c < splitCi).length];
  for (const s of splits) {
    if (s < 1 || s > n - 1) continue;
    const isC = ci.map((_, i) => i < s), f = fitSplit(ci, A, isC, k);
    if (!f || !(f.p[0] > 0) || !(f.p[1] > 0)) continue;
    const ok = ci.every((c, i) => { const ac = f.p[0] * fRubisco(c, k), aj = f.p[1] * fRubp(c, k); return isC[i] ? ac <= aj * 1.0001 + 1e-9 : aj <= ac * 1.0001 + 1e-9; });
    cands.push({ k: s, f, ok });
  }
  if (!cands.length) return null;
  const pool = cands.some((c) => c.ok) ? cands.filter((c) => c.ok) : cands;
  const best = pool.reduce((a, b) => (b.f.sse < a.f.sse ? b : a));
  const [vcmax, j, rd] = best.f.p;
  // Transition: Vcmax·fc = J·fj, solved by bisection on Ci.
  const g = (c: number) => vcmax * fRubisco(c, k) - j * fRubp(c, k);
  let lo = k.gammaStar + 1e-6, hi = 1e5, ciT = NaN;
  if (g(lo) * g(hi) < 0) { for (let it = 0; it < 200; it++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } ciT = (lo + hi) / 2; }
  const mean = A.reduce((s, v) => s + v, 0) / n, sst = A.reduce((s, v) => s + (v - mean) ** 2, 0);
  const limits = ord.map(() => 'Rubisco' as 'Rubisco' | 'RuBP');
  ord.forEach((orig, i) => { limits[orig] = i < best.k ? 'Rubisco' : 'RuBP'; });
  return { vcmax, j, rd, se: best.f.se as [number, number, number], nRubisco: best.k, nRubp: n - best.k, split: best.k, sse: best.f.sse, s: Math.sqrt(best.f.sse / (n - 3)), r2: 1 - best.f.sse / sst, ciTransition: ciT, consistent: best.ok, limits };
}

export const aciModel = (ci: number, vcmax: number, j: number, rd: number, k: AciConst) => Math.min(vcmax * fRubisco(ci, k), j * fRubp(ci, k)) - rd;

/** Jmax from J at the measuring light, through the non-rectangular hyperbola J = f(αI, Jmax, θ). NaN if J ≥ αI. */
export function jmaxFromJ(J: number, ppfd: number, alpha: number, theta: number): number {
  const aI = alpha * ppfd;
  if (!(J < aI)) return NaN;
  return (J * (aI - theta * J)) / (aI - J);
}
