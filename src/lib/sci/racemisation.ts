// Amino acid racemisation (AAR) ages from reversible first-order kinetics:
//   ln[(1 + D/L) / (1 − K'·D/L)] − C = (1 + K')·k·t,
// with C the same expression at t = 0 (the D/L ratio a fresh sample already shows) and K' = 1 / K_eq. The rate
// constant k is typed in or calibrated from a sample of known age, and moved to the sample's temperature with the
// Arrhenius equation. Uncertainty by GUM first-order propagation and by Monte Carlo. Plain TypeScript, no DOM.
import { propagate, monteCarlo, type Input } from './uncertainty.ts';
import { quantileSorted } from './stats.ts';

export const R_GAS = 8.314462618; // J mol⁻¹ K⁻¹
export const T0 = 273.15;

/** The kinetic expression ln[(1 + r) / (1 − K'r)]; NaN outside 0 ≤ r < 1/K'. */
export const F = (r: number, Kp: number) => (r > -1 && 1 - Kp * r > 0 ? Math.log((1 + r) / (1 - Kp * r)) : NaN);
/** D/L after time t with rate k (same time unit), starting from r0. */
export function ratioAt(t: number, k: number, Kp: number, r0: number) {
  const z = Math.exp(-(F(r0, Kp) + (1 + Kp) * k * t)); // 1/y, so very long times tend to 1/K' without overflow
  return (1 - z) / (z + Kp);
}
/** Rate constant moved from temperature T1 to T2 (°C) with activation energy Ea (kJ/mol). */
export const arrhenius = (k1: number, T1: number, T2: number, Ea: number) => k1 * Math.exp((-Ea * 1000 / R_GAS) * (1 / (T2 + T0) - 1 / (T1 + T0)));

export type V = { v: number; u: number };
export type Inputs = {
  /** 'k': a known rate constant at temperature Tk. 'cal': calibrate k from a sample of known age at temperature Tcal. */
  mode: 'k' | 'cal';
  Kp: number;
  r: V; r0: V; Ts: V; Ea: V;
  k: V; Tk: V;
  rCal: V; tCal: V; Tcal: V;
};
const NAMES = { k: ['r', 'r0', 'Ts', 'Ea', 'k', 'Tk'], cal: ['r', 'r0', 'Ts', 'Ea', 'rCal', 'tCal', 'Tcal'] } as const;
export const LABELS: Record<string, string> = { r: 'Sample D/L', r0: 'D/L at time zero', Ts: 'Sample temperature', Ea: 'Activation energy', k: 'Rate constant k', Tk: 'Temperature of k', rCal: 'Calibration D/L', tCal: 'Calibration age', Tcal: 'Calibration temperature' };

/** The rate constant at the sample's temperature, per unit of time (years if the calibration age or k is in years). */
function kSample(x: Record<string, number>, mode: 'k' | 'cal', Kp: number) {
  const kRef = mode === 'k' ? x.k : (F(x.rCal, Kp) - F(x.r0, Kp)) / ((1 + Kp) * x.tCal);
  const Tref = mode === 'k' ? x.Tk : x.Tcal;
  return arrhenius(kRef, Tref, x.Ts, x.Ea);
}
/** The age for one set of input values. */
export function ageOf(x: Record<string, number>, mode: 'k' | 'cal', Kp: number) {
  return (F(x.r, Kp) - F(x.r0, Kp)) / ((1 + Kp) * kSample(x, mode, Kp));
}

/** Check the inputs make sense; throws an Error with a plain message. */
export function validate(p: Inputs) {
  const Kp = p.Kp;
  if (!(Kp > 0)) throw new Error("K' must be above 0 (1 for aspartic acid and most amino acids; 1/K_eq in general).");
  const lim = 1 / Kp;
  for (const [key, r] of [['r', p.r], ['r0', p.r0], ...(p.mode === 'cal' ? [['rCal', p.rCal]] : [])] as [string, V][]) {
    if (!(r.v >= 0) || !(r.v < lim)) throw new Error(`${LABELS[key]} must be at least 0 and below the equilibrium ratio 1/K' = ${+lim.toPrecision(4)}.`);
  }
  if (!(p.r.v > p.r0.v)) throw new Error('The sample D/L must be above the D/L at time zero.');
  if (p.mode === 'cal') {
    if (!(p.rCal.v > p.r0.v)) throw new Error('The calibration D/L must be above the D/L at time zero.');
    if (!(p.tCal.v > 0)) throw new Error('The calibration age must be above 0.');
  } else if (!(p.k.v > 0)) throw new Error('The rate constant must be above 0.');
  if (!(p.Ea.v > 0)) throw new Error('The activation energy must be above 0 kJ/mol.');
  for (const T of [p.Ts, p.mode === 'k' ? p.Tk : p.Tcal]) if (!(T.v > -T0)) throw new Error('Temperatures must be above absolute zero (−273.15 °C).');
  for (const [k, x] of Object.entries(p)) if (typeof x === 'object' && !(x.u >= 0)) throw new Error(`${LABELS[k] ?? k}: the uncertainty must be 0 or more.`);
}

export type Result = {
  age: number; ageU: number; kS: number; kSU: number;
  budget: { name: string; label: string; value: number; u: number; share: number }[];
  mc?: { n: number; median: number; mean: number; sd: number; lo68: number; hi68: number; lo95: number; hi95: number; samples: Float64Array };
};

/** Age with GUM propagation, and (if mcN > 0) a Monte Carlo run with normal inputs. */
export function calc(p: Inputs, mcN = 20000, seed = 2026): Result {
  validate(p);
  const names = NAMES[p.mode] as readonly string[];
  const rec = p as unknown as Record<string, V>;
  const inputs: Input[] = names.map((k) => ({ name: k, value: rec[k].v, spread: rec[k].u, dist: 'normal' as const }));
  const obj = (v: ArrayLike<number>) => Object.fromEntries(names.map((k, i) => [k, v[i]]));
  const g = propagate((v) => ageOf(obj(v), p.mode, p.Kp), inputs);
  const kk = propagate((v) => kSample(obj(v), p.mode, p.Kp), inputs);
  const out: Result = { age: g.y, ageU: g.uc, kS: kk.y, kSU: kk.uc, budget: g.rows.map((r) => ({ name: r.name, label: LABELS[r.name], value: r.value, u: r.u, share: r.share })) };
  if (mcN > 0) {
    const m = monteCarlo((v) => ageOf(obj(v), p.mode, p.Kp), inputs, mcN, 0.9545, seed);
    const s = m.samples;
    out.mc = { n: m.n, mean: m.mean, sd: m.sd, median: quantileSorted(s, 0.5), lo68: quantileSorted(s, 0.15865), hi68: quantileSorted(s, 0.84135), lo95: quantileSorted(s, 0.02275), hi95: quantileSorted(s, 0.97725), samples: s };
  }
  return out;
}
