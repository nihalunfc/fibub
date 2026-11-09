// Boom sprayer calibration: application rate from nozzle flow, travel speed and nozzle spacing (and back), nozzle
// flow at another pressure (square-root law), a catch test of every nozzle, the 1/128-acre method, and how far a
// tank goes with the product per tank for a label rate the user types. Units are converted exactly. No DOM.

export const L_PER_GAL = 3.785411784; // US gallon
export const M_PER_MI = 1609.344;
export const M_PER_IN = 0.0254;
export const HA_PER_AC = 0.40468564224;
export const KPA_PER_PSI = 6.894757293168;
export const ML_PER_FLOZ = 29.5735295625;
export const GPA_PER_LHA = HA_PER_AC / L_PER_GAL; // 0.1069066

/** Application rate, L/ha, from one nozzle's flow (L/min), speed (km/h) and nozzle spacing (m): 600 q / (v w). */
export const rateLHa = (qLmin: number, vKmh: number, wM: number) => (600 * qLmin) / (vKmh * wM);
/** Nozzle flow (L/min) needed for a rate (L/ha). */
export const flowFor = (rate: number, vKmh: number, wM: number) => (rate * vKmh * wM) / 600;
/** Speed (km/h) that gives a rate with a nozzle flow. */
export const speedFor = (rate: number, qLmin: number, wM: number) => (600 * qLmin) / (rate * wM);
/** Flow at pressure p2 from a rated flow q1 at p1 (flow ∝ √pressure), and the pressure for a flow. */
export const flowAt = (p2: number, q1: number, p1: number) => q1 * Math.sqrt(p2 / p1);
export const pressureFor = (q2: number, q1: number, p1: number) => p1 * (q2 / q1) ** 2;
/** Speed (km/h) from a timed run: metres in seconds. */
export const speedFromRun = (m: number, s: number) => (m / s) * 3.6;
/** US form: gal/ac = 5940 × gal/min ÷ (mph × spacing in inches). */
export const gpa = (gpm: number, mph: number, wIn: number) => (5940 * gpm) / (mph * wIn);
/** Length of course (ft) that one nozzle's strip makes 1/128 acre over; fl oz caught while driving it = gal/ac. */
export const course128 = (wIn: number) => (43560 / 128) / (wIn / 12);

export type Catch = { flows: number[]; mean: number; dev: number[]; bad: number[]; cv: number };
/** Catch test: volumes caught (mL) in `seconds` from each nozzle -> L/min, % from the mean, nozzles beyond tol %. */
export function catchTest(mL: number[], seconds: number, tol: number): Catch {
  const flows = mL.map((v) => (v / 1000) * (60 / seconds));
  const mean = flows.reduce((s, v) => s + v, 0) / flows.length;
  const dev = flows.map((f) => (100 * (f - mean)) / mean);
  const sd = flows.length > 1 ? Math.sqrt(flows.reduce((s, v) => s + (v - mean) ** 2, 0) / (flows.length - 1)) : 0;
  return { flows, mean, dev, bad: dev.map((d, i) => (Math.abs(d) > tol ? i : -1)).filter((i) => i >= 0), cv: (100 * sd) / mean };
}

export type Tank = { areaPerTank: number; fullTanks: number; lastArea: number; lastWater: number; tanks: number; productPerTank: number | null; productLast: number | null; productTotal: number | null };
/** How a field is covered by tanks of `tankL` at `rate` L/ha, with product for a label rate per ha (any unit). */
export function tanks(tankL: number, rate: number, areaHa: number, labelPerHa: number | null): Tank {
  const areaPerTank = tankL / rate;
  const exact = areaHa / areaPerTank;
  const fullTanks = Math.floor(exact + 1e-9);
  const lastArea = Math.max(0, areaHa - fullTanks * areaPerTank);
  const last = lastArea > 1e-9 * areaHa ? lastArea : 0;
  return {
    areaPerTank, fullTanks, lastArea: last, lastWater: last * rate, tanks: fullTanks + (last > 0 ? 1 : 0),
    productPerTank: labelPerHa == null ? null : labelPerHa * areaPerTank,
    productLast: labelPerHa == null ? null : labelPerHa * last,
    productTotal: labelPerHa == null ? null : labelPerHa * areaHa,
  };
}
