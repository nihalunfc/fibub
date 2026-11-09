// Shelf life and temperature (Q10 and Arrhenius), and water activity. For study and planning: real shelf life
// must be confirmed by tests on the product itself.
import { fitLine } from './fit.ts';

/** Gas constant, J/(mol·K). */
export const R = 8.314462618;
export const K0 = 273.15;

/** Shelf life at T2 from shelf life t1 at T1 (°C) with a Q10: t2 = t1 / Q10^((T2 − T1)/10). */
export function q10Shift(t1: number, T1: number, T2: number, q10: number): number {
  if (!(t1 > 0)) throw new Error('Shelf life must be more than 0.');
  if (!(q10 > 0)) throw new Error('Q10 must be more than 0.');
  return t1 / Math.pow(q10, (T2 - T1) / 10);
}
/** Q10 from two shelf lives: Q10 = (t1/t2)^(10/(T2 − T1)). */
export function q10From(t1: number, T1: number, t2: number, T2: number): number {
  if (T1 === T2) throw new Error('The two temperatures must differ.');
  return Math.pow(t1 / t2, 10 / (T2 - T1));
}
/** The Q10 implied by an activation energy Ea (J/mol) between T and T + 10 °C. */
export const q10FromEa = (Ea: number, T: number) => Math.exp((Ea / R) * (10 / ((T + K0) * (T + 10 + K0))));

export type Point = { T: number; t: number };
export type ShelfFit = {
  n: number;
  /** ln(t) = a + b·T (°C): the Q10 model. */
  q10: number; q10Line: { a: number; b: number; r2: number };
  /** ln(t) = c + (Ea/R)·(1/T K): the Arrhenius model. */
  Ea: number; arrLine: { a: number; b: number; r2: number };
  predictQ10: (T: number) => number; predictArr: (T: number) => number;
};

/** Fit both models to accelerated shelf-life points (temperature °C, shelf life in any time unit). Two points give exact lines. */
export function fitShelf(pts: Point[]): ShelfFit {
  if (pts.length < 2) throw new Error('Give at least two test points.');
  if (pts.some((p) => !(p.t > 0))) throw new Error('Every shelf life must be more than 0.');
  if (pts.some((p) => !(p.T > -K0))) throw new Error('Every temperature must be above absolute zero.');
  if (new Set(pts.map((p) => p.T)).size < 2) throw new Error('Use at least two different temperatures.');
  const y = pts.map((p) => Math.log(p.t));
  const line = (x: number[]) => {
    if (pts.length === 2) { const b = (y[1] - y[0]) / (x[1] - x[0]); return { a: y[0] - b * x[0], b, r2: 1 }; }
    const f = fitLine(x, y); return { a: f.intercept, b: f.slope, r2: f.r2 };
  };
  const q = line(pts.map((p) => p.T));
  const ar = line(pts.map((p) => 1 / (p.T + K0)));
  return {
    n: pts.length, q10: Math.exp(-10 * q.b), q10Line: q, Ea: ar.b * R, arrLine: ar,
    predictQ10: (T) => Math.exp(q.a + q.b * T), predictArr: (T) => Math.exp(ar.a + ar.b / (T + K0)),
  };
}

/** Water activity from equilibrium relative humidity (%): aw = ERH / 100. */
export const awFromErh = (erh: number) => erh / 100;

/**
 * Water activity of a single-solute solution with a Norrish-type equation: aw = xw · exp(−K · xs²), where xw and
 * xs are the mole fractions of water and solute and K is the solute's constant (from your own reference; K = 0 is
 * Raoult's law for an ideal solution). Masses in grams, molar mass in g/mol.
 */
export function norrish(waterG: number, soluteG: number, soluteMolar: number, K: number): { aw: number; xw: number; xs: number } {
  if (!(waterG > 0)) throw new Error('Water must be more than 0 g.');
  if (!(soluteG >= 0)) throw new Error('Solute cannot be negative.');
  if (!(soluteMolar > 0)) throw new Error('Molar mass must be more than 0.');
  const nw = waterG / 18.015, ns = soluteG / soluteMolar, xs = ns / (nw + ns), xw = 1 - xs;
  return { aw: xw * Math.exp(-K * xs * xs), xw, xs };
}

/** The made-up example: shelf life (days) found in accelerated tests at three temperatures. */
export const EXAMPLE_POINTS = `Temperature (°C), Shelf life (days)
25, 180
35, 75
45, 32`;
