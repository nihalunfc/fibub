// Self and mutual inductance of two coaxial solenoids (school level): an inner coil (N1 turns, radius r1) inside
// an outer coil (N2 turns, radius r2 ≥ r1), both of length ℓ. L = µ0 µr N² A / ℓ, M = µ0 µr N1 N2 π r1² / ℓ, and
// the emfs −L dI/dt and −M dI/dt when the current in the inner coil ramps up and down. SI units. No DOM.
import { MU0, n3 } from './em-p34.ts';
import { pick, type Question } from './elec-quiz.ts';

export function coils(N1: number, N2: number, l: number, r1: number, r2: number, mur = 1) {
  const A1 = Math.PI * r1 * r1, A2 = Math.PI * r2 * r2;
  const L1 = (MU0 * mur * N1 * N1 * A1) / l, M = (MU0 * mur * N1 * N2 * A1) / l;
  // The outer coil's own field fills its whole area; only the core (if any) fills the inner coil's area.
  const L2 = (MU0 * N2 * N2 * (A2 - A1)) / l + (MU0 * mur * N2 * N2 * A1) / l;
  return { L1, L2, M, k: M / Math.sqrt(L1 * L2), B1: (I: number) => (MU0 * mur * N1 * I) / l };
}

/** Current in the inner coil: a triangle wave from 0 up to I0 in time tr, then back down in tr. */
export function current(I0: number, tr: number, t: number) {
  const u = ((t % (2 * tr)) + 2 * tr) % (2 * tr);
  return u < tr ? (I0 * u) / tr : I0 * (2 - u / tr);
}
export const rate = (I0: number, tr: number, t: number) => { const u = ((t % (2 * tr)) + 2 * tr) % (2 * tr); return u < tr ? I0 / tr : -I0 / tr; };

export function questions(rng: () => number = Math.random): Question[] {
  const N = pick(rng, [200, 500, 1000]), r = pick(rng, [1, 2]) / 100, l = pick(rng, [0.2, 0.5]);
  const L = (MU0 * N * N * Math.PI * r * r) / l;
  const Lx = pick(rng, [0.05, 0.2, 0.5]), dI = pick(rng, [2, 4, 10]), dt = pick(rng, [0.1, 0.5]), e = (Lx * dI) / dt;
  const Mx = pick(rng, [0.01, 0.05, 0.1]), rate2 = pick(rng, [20, 50, 100]);
  const L3 = pick(rng, [0.1, 0.5, 2]), I3 = pick(rng, [1, 2, 3]);
  return [
    { text: `A solenoid has ${N} turns, radius ${r * 100} cm and length ${l * 100} cm, with air inside. What is its self-inductance, in henries?`, answer: L, unit: 'H', tol: 0.02,
      steps: ['L = µ₀ N² A / ℓ, with A = πr²', `L = 1.26 × 10⁻⁶ × ${N}² × π × ${r}² / ${l} = ${n3(L)} H`] },
    { text: `The current in a ${Lx} H coil rises by ${dI} A in ${dt} s. What emf does it induce in itself, in volts?`, answer: e, unit: 'V', tol: 0.02,
      steps: ['|ε| = L ΔI / Δt (it opposes the rise: Lenz)', `|ε| = ${Lx} × ${dI} / ${dt} = ${n3(e)} V`] },
    { text: `Two coils have a mutual inductance of ${Mx} H. The current in one changes at ${rate2} A/s. What emf appears in the other, in volts?`, answer: Mx * rate2, unit: 'V', tol: 0.02,
      steps: ['|ε₂| = M dI₁/dt', `|ε₂| = ${Mx} × ${rate2} = ${n3(Mx * rate2)} V`] },
    { text: `How much energy is stored in a ${L3} H inductor carrying ${I3} A, in joules?`, answer: 0.5 * L3 * I3 * I3, unit: 'J', tol: 0.02,
      steps: ['U = ½ L I²', `U = ½ × ${L3} × ${I3}² = ${n3(0.5 * L3 * I3 * I3)} J`] },
  ];
}
