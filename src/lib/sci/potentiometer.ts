// #1412 Potentiometer practical: a long uniform wire carrying a steady current from a driver cell through a
// rheostat; a test cell and galvanometer between end A and the jockey. The galvanometer current is found exactly
// (Thévenin equivalent of the wire seen from A and the jockey); it is zero where the fall of potential along the
// wire equals the test cell's terminal voltage. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export type Setup = { L: number; Rw: number; Ed: number; rd: number; Rh: number; Rg: number };
export const DEFAULT: Setup = { L: 4, Rw: 4, Ed: 2, rd: 0.1, Rh: 0.5, Rg: 50 }; // wire 4 m of 1 Ω/m, 2 V driver

/** Potential gradient along the wire (V/m) with no current drawn by the galvanometer branch. */
export const gradient = (s: Setup) => (s.Ed * s.Rw) / (s.Rw + s.Rh + s.rd) / s.L;

/** The test branch: a cell of emf E and internal resistance r, optionally shunted by a resistance box R (closed key). */
export type Branch = { E: number; r: number; shunt?: number };
/** Thévenin form of the test branch: its open-circuit voltage and resistance. */
function branch(b: Branch) {
  if (b.shunt === undefined) return { V: b.E, R: b.r };
  return { V: (b.E * b.shunt) / (b.shunt + b.r), R: (b.r * b.shunt) / (b.r + b.shunt) };
}
/** Galvanometer current (A) with the jockey l metres from A; positive when the wire's potential drop is bigger. */
export function galvo(s: Setup, b: Branch, l: number) {
  const Rl = (s.Rw * l) / s.L, Rrest = s.Rw - Rl + s.Rh + s.rd, Vth = (s.Ed * Rl) / (s.Rw + s.Rh + s.rd), Rth = (Rl * Rrest) / (Rl + Rrest || 1);
  const t = branch(b);
  return (Vth - t.V) / (Rth + t.R + s.Rg);
}
/** Balance length (m), or null when the whole wire's potential drop is less than the branch voltage. */
export function balance(s: Setup, b: Branch) {
  const l = branch(b).V / gradient(s);
  return l <= s.L ? l : null;
}
/** Results of the two practicals. */
export const emfRatio = (l1: number, l2: number) => l1 / l2;
export const internalR = (R: number, l1: number, l2: number) => (R * (l1 - l2)) / l2;

export function questions(rng: () => number = Math.random): Question[] {
  const l1 = pick(rng, [300, 320, 350, 375]), l2 = pick(rng, [200, 220, 240, 250]), E1 = pick(rng, [1.5, 1.08, 2]);
  const E2 = (E1 * l2) / l1;
  const L1 = pick(rng, [280, 300, 340]), L2 = pick(rng, [200, 240, 250]), R = pick(rng, [2, 5, 10]);
  const r = internalR(R, L1, L2);
  const V = pick(rng, [2, 3, 4]), Lw = pick(rng, [4, 5, 10]), k = V / Lw;
  const E3 = pick(rng, [1.0, 1.2, 1.5]), l3 = (E3 / k) * 100;
  return [
    { text: `A cell of emf ${E1} V balances at ${l1} cm on a potentiometer wire. Another cell balances at ${l2} cm. What is the second cell's emf, in volts?`, answer: E2, unit: 'V', tol: 0.02,
      steps: ['E₁ / E₂ = l₁ / l₂, so E₂ = E₁ l₂ / l₁', `E₂ = ${E1} × ${l2} / ${l1} = ${r3(E2)} V`] },
    { text: `A cell balances at ${L1} cm on open circuit and at ${L2} cm when a ${R} Ω resistor is joined across it. What is its internal resistance, in ohms?`, answer: r, unit: 'Ω', tol: 0.02,
      steps: ['r = R (l₁ − l₂) / l₂', `r = ${R} × (${L1} − ${L2}) / ${L2} = ${r3(r)} Ω`] },
    { text: `A ${V} V drop is spread along a ${Lw} m potentiometer wire. At what length, in cm, does a ${E3} V cell balance?`, answer: l3, unit: 'cm', tol: 0.02,
      steps: [`Potential gradient k = ${V} / ${Lw} = ${r3(k)} V/m`, `l = E / k = ${E3} / ${r3(k)} m = ${r3(l3)} cm`] },
  ];
}
