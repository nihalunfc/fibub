// Parallel-plate capacitor lab (school level): capacitance from area, gap and a dielectric slab that fills the gap
// and slides in part way; charge, voltage, energy and field with the battery connected or disconnected; capacitors
// in series and parallel. Plain maths, no DOM. SI units.
import { pick, r3, type Question } from './elec-quiz.ts';

export const EPS0 = 8.8541878188e-12; // F/m, CODATA 2022

/** Capacitance of plates of area A (m²) a gap d (m) apart, with a slab of dielectric constant k filling the gap over
 *  a fraction x (0–1) of the area: the two parts are in parallel, C = ε0 A (1 − x + k x) / d. */
export const plateC = (A: number, d: number, k = 1, x = 0) => (EPS0 * A * (1 - x + k * x)) / d;
/** A slab of thickness t (< d) covering the whole area: C = ε0 A / (d − t + t/k). */
export const slabC = (A: number, d: number, t: number, k: number) => (EPS0 * A) / (d - t + t / k);

/** State with the battery connected (V fixed) or after it was disconnected holding charge Q. */
export function state(C: number, d: number, connected: boolean, V: number, Q: number) {
  const v = connected ? V : Q / C, q = connected ? C * V : Q;
  return { C, V: v, Q: q, U: 0.5 * C * v * v, E: v / d };
}

export const series = (cs: number[]) => 1 / cs.reduce((s, c) => s + 1 / c, 0);
export const parallel = (cs: number[]) => cs.reduce((s, c) => s + c, 0);

export function questions(rng: () => number = Math.random): Question[] {
  const Acm = pick(rng, [50, 100, 200, 400]), dmm = pick(rng, [0.5, 1, 2, 5]);
  const C1 = (EPS0 * Acm * 1e-4) / (dmm * 1e-3) * 1e12;
  const k = pick(rng, [2, 3, 4, 5, 6]);
  const a = pick(rng, [2, 3, 4, 6, 12]), b = pick(rng, [3, 4, 6, 12]), cs = series([a, b]);
  const Cu = pick(rng, [2, 5, 10, 20, 100]), V = pick(rng, [6, 9, 12, 100]);
  const U = 0.5 * Cu * 1e-6 * V * V * 1000;
  return [
    { text: `Two plates of area ${Acm} cm² are ${dmm} mm apart in air. What is the capacitance, in picofarads? (ε₀ = 8.85 × 10⁻¹² F/m)`, answer: C1, unit: 'pF', tol: 0.02,
      steps: ['C = ε₀ A / d', `C = 8.85 × 10⁻¹² × ${Acm} × 10⁻⁴ / (${dmm} × 10⁻³) = ${r3(C1)} pF`] },
    { text: `The gap is now filled with a material of dielectric constant ${k}. What is the new capacitance, in picofarads?`, answer: k * C1, unit: 'pF', tol: 0.02,
      steps: ['C = K ε₀ A / d: the dielectric multiplies C by K.', `C = ${k} × ${r3(C1)} = ${r3(k * C1)} pF`] },
    { text: `A ${a} µF and a ${b} µF capacitor are joined in series. What is the combined capacitance, in microfarads?`, answer: cs, unit: 'µF', tol: 0.02,
      steps: ['1/C = 1/C₁ + 1/C₂', `C = ${a} × ${b} / (${a} + ${b}) = ${r3(cs)} µF`] },
    { text: `How much energy is stored in a ${Cu} µF capacitor charged to ${V} V, in millijoules?`, answer: U, unit: 'mJ', tol: 0.02,
      steps: ['U = ½ C V²', `U = ½ × ${Cu} × 10⁻⁶ × ${V}² = ${r3(U)} mJ`] },
  ];
}
