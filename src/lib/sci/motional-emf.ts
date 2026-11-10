// A rod sliding on rails in a magnetic field (school level): motional emf ε = Bℓv, current, the magnetic drag
// force B²ℓ²v/R, power, and the rod's speed when it is let go (slows exponentially) or pulled by a steady force
// (reaches a terminal speed). SI units throughout. No DOM.
import { pick, type Question } from './elec-quiz.ts';
import { n3 } from './em-p34.ts';

export function rod(B: number, l: number, v: number, R: number) {
  const emf = B * l * v, I = emf / R, F = B * I * l;
  return { emf, I, F, P: F * v, heat: I * I * R };
}
/** Time constant τ = mR/(B²ℓ²) of the rod's speed. */
export const tau = (B: number, l: number, R: number, m: number) => (m * R) / (B * B * l * l);
/** Speed after time t: let go at v0 (F = 0), or pulled by a steady force F from v0. */
export function speed(B: number, l: number, R: number, m: number, v0: number, F: number, t: number) {
  const vt = (F * R) / (B * B * l * l), T = tau(B, l, R, m);
  return vt + (v0 - vt) * Math.exp(-t / T);
}
export const terminal = (B: number, l: number, R: number, F: number) => (F * R) / (B * B * l * l);

export function questions(rng: () => number = Math.random): Question[] {
  const B = pick(rng, [0.2, 0.5, 0.8]), l = pick(rng, [0.2, 0.5, 1]), v = pick(rng, [2, 4, 5, 10]), R = pick(rng, [1, 2, 5]);
  const s = rod(B, l, v, R);
  const F = pick(rng, [0.1, 0.2, 0.5]), B2 = pick(rng, [0.5, 1]), l2 = pick(rng, [0.5, 1]), R2 = pick(rng, [1, 2, 4]), vt = terminal(B2, l2, R2, F);
  return [
    { text: `A ${l} m rod moves at ${v} m/s across a ${B} T field. What emf is induced across its ends, in volts?`, answer: s.emf, unit: 'V', tol: 0.02,
      steps: ['ε = B ℓ v', `ε = ${B} × ${l} × ${v} = ${n3(s.emf)} V`] },
    { text: `That rod is part of a circuit of resistance ${R} Ω. What current flows, in amperes?`, answer: s.I, unit: 'A', tol: 0.02,
      steps: ['I = ε / R', `I = ${n3(s.emf)} / ${R} = ${n3(s.I)} A`] },
    { text: `What force is needed to keep it moving at ${v} m/s, in newtons?`, answer: s.F, unit: 'N', tol: 0.02,
      steps: ['The current in the rod feels F = B I ℓ against the motion, so you must push with the same force.', `F = ${B} × ${n3(s.I)} × ${l} = ${n3(s.F)} N`] },
    { text: `A steady ${F} N pull acts on a ${l2} m rod in a ${B2} T field, in a circuit of ${R2} Ω. What top speed does it reach, in m/s?`, answer: vt, unit: 'm/s', tol: 0.02,
      steps: ['At the top speed the magnetic drag B²ℓ²v/R equals the pull.', `v = F R / (B² ℓ²) = ${F} × ${R2} / (${B2}² × ${l2}²) = ${n3(vt)} m/s`] },
  ];
}
