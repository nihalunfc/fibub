// A plane electromagnetic wave (school level): E and B at right angles to each other and to the direction of
// travel, in step, with B0 = E0/c; c = 1/√(µ0 ε0); intensity I = ½ c ε0 E0². SI units. No DOM.
import { EPS0, MU0, C_LIGHT, n3 } from './em-p34.ts';
import { pick, type Question } from './elec-quiz.ts';

export const cFromConstants = () => 1 / Math.sqrt(MU0 * EPS0);

export function wave(E0: number, lam: number) {
  const f = C_LIGHT / lam, k = (2 * Math.PI) / lam, w = 2 * Math.PI * f;
  return { f, T: 1 / f, k, w, B0: E0 / C_LIGHT, I: 0.5 * C_LIGHT * EPS0 * E0 * E0, u: 0.5 * EPS0 * E0 * E0 };
}
/** E and B (as fractions of their peaks) at distance x (in wavelengths) and time t (in periods). */
export const at = (x: number, t: number) => Math.sin(2 * Math.PI * (x - t));

export function questions(rng: () => number = Math.random): Question[] {
  const E0 = pick(rng, [3, 30, 300, 600]), B0 = E0 / C_LIGHT;
  const B = pick(rng, [2, 5, 10]) * 1e-8, E = B * C_LIGHT;
  const E1 = pick(rng, [10, 50, 100]), I = 0.5 * C_LIGHT * EPS0 * E1 * E1;
  const f = pick(rng, [50, 100, 300]), lam = C_LIGHT / (f * 1e6);
  return [
    { text: `An EM wave has a peak electric field of ${E0} V/m. What is its peak magnetic field, in tesla?`, answer: B0, unit: 'T', tol: 0.02,
      steps: ['B₀ = E₀ / c', `B₀ = ${E0} / 3 × 10⁸ = ${n3(B0)} T`] },
    { text: `The peak magnetic field of a wave is ${n3(B)} T. What is its peak electric field, in V/m?`, answer: E, unit: 'V/m', tol: 0.02,
      steps: ['E₀ = c B₀', `E₀ = 3 × 10⁸ × ${n3(B)} = ${n3(E)} V/m`] },
    { text: `A wave has a peak electric field of ${E1} V/m. What is its intensity, in W/m²?`, answer: I, unit: 'W/m²', tol: 0.02,
      steps: ['I = ½ c ε₀ E₀²', `I = ½ × 3 × 10⁸ × 8.85 × 10⁻¹² × ${E1}² = ${n3(I)} W/m²`] },
    { text: `What is the wavelength of a ${f} MHz wave, in metres?`, answer: lam, unit: 'm', tol: 0.02,
      steps: ['λ = c / f', `λ = 3 × 10⁸ / (${f} × 10⁶) = ${n3(lam)} m`] },
  ];
}
