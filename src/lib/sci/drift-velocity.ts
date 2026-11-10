// #1406 Drift velocity: I = n e A v_d, relaxation time and mobility. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export const E_CHARGE = 1.602176634e-19; // C, exact (SI 2019)
export const M_E = 9.1093837139e-31; // kg, CODATA 2022
export const N_A = 6.02214076e23; // 1/mol, exact
export const K_B = 1.380649e-23; // J/K, exact

/** Rounded handbook values at about 20 °C (density g/cm³, molar mass g/mol, free electrons per atom, resistivity Ω m). */
export const METALS = {
  copper: { name: 'Copper', rho_g: 8.96, M: 63.546, z: 1, rho: 1.68e-8 },
  aluminium: { name: 'Aluminium', rho_g: 2.70, M: 26.982, z: 3, rho: 2.65e-8 },
  silver: { name: 'Silver', rho_g: 10.49, M: 107.87, z: 1, rho: 1.59e-8 },
} as const;
export type Metal = keyof typeof METALS;

/** Free electrons per cubic metre: n = z ρ N_A / M (density in g/cm³ turned into g/m³). */
export const freeElectrons = (m: Metal) => { const d = METALS[m]; return (d.z * d.rho_g * 1e6 * N_A) / d.M; };
/** Drift speed v_d = I / (n e A), in m/s. */
export const driftSpeed = (I: number, n: number, A: number) => I / (n * E_CHARGE * A);
/** Current from the drift speed: I = n e A v_d. */
export const currentFrom = (v: number, n: number, A: number) => n * E_CHARGE * A * v;
/** Relaxation time τ = m / (n e² ρ). */
export const relaxTime = (n: number, rho: number) => M_E / (n * E_CHARGE * E_CHARGE * rho);
/** Classical rms thermal speed sqrt(3kT/m), the old estimate of the random speed. */
export const thermalSpeed = (T: number) => Math.sqrt((3 * K_B * T) / M_E);

/** Everything the page shows for a wire carrying I (A) with cross-section A (m²). */
export function wire(m: Metal, I: number, A: number, L = 1) {
  const n = freeElectrons(m), rho = METALS[m].rho, vd = driftSpeed(I, n, A), J = I / A, E = rho * J, tau = relaxTime(n, rho);
  return { n, rho, vd, J, E, tau, mobility: E > 0 ? vd / E : (E_CHARGE * tau) / M_E, crossTime: vd > 0 ? L / vd : Infinity, vdCheck: (E_CHARGE * E * tau) / M_E, vth: thermalSpeed(300) };
}

export function questions(rng: () => number = Math.random): Question[] {
  const n = 8.5e28;
  const I = pick(rng, [0.5, 1, 1.5, 2, 3, 5]), Amm = pick(rng, [0.5, 1, 1.5, 2, 2.5]);
  const vd = driftSpeed(I, n, Amm * 1e-6) * 1000; // mm/s
  const v2 = pick(rng, [0.02, 0.05, 0.1, 0.2]), A2 = pick(rng, [1, 2, 4]);
  const I2 = currentFrom(v2 * 1e-3, n, A2 * 1e-6);
  const v3 = pick(rng, [0.05, 0.1, 0.2, 0.25]), L3 = pick(rng, [0.5, 1, 2, 3]);
  const t3 = (L3 / (v3 * 1e-3)) / 60;
  const k = pick(rng, [2, 3, 4]);
  return [
    { text: `A copper wire of cross-section ${Amm} mm² carries ${I} A. Copper has 8.5 × 10²⁸ free electrons per m³. What is the drift speed, in mm/s? (e = 1.6 × 10⁻¹⁹ C)`, answer: vd, unit: 'mm/s', tol: 0.03,
      steps: ['v_d = I / (n e A)', `v_d = ${I} / (8.5 × 10²⁸ × 1.6 × 10⁻¹⁹ × ${Amm} × 10⁻⁶) m/s = ${r3(vd)} mm/s`] },
    { text: `Electrons drift at ${v2} mm/s in a copper wire of cross-section ${A2} mm² (n = 8.5 × 10²⁸ per m³). What current flows, in amperes?`, answer: I2, unit: 'A', tol: 0.03,
      steps: ['I = n e A v_d', `I = 8.5 × 10²⁸ × 1.6 × 10⁻¹⁹ × ${A2} × 10⁻⁶ × ${v2} × 10⁻³ = ${r3(I2)} A`] },
    { text: `If electrons drift at ${v3} mm/s, how many minutes does one take to drift ${L3} m along the wire?`, answer: t3, unit: 'min', tol: 0.03,
      steps: ['t = L / v_d', `t = ${L3} m / (${v3} × 10⁻³ m/s) = ${r3(t3 * 60)} s = ${r3(t3)} min`] },
    { text: `The current in a wire is made ${k} times bigger and the wire is swapped for one with ${k} times the cross-section. By what factor does the drift speed change?`, answer: 1, unit: '×', tol: 0.01,
      steps: ['v_d = I / (n e A): I and A both go up by the same factor.', `v_d changes by ${k} / ${k} = 1, so it stays the same.`] },
  ];
}
