// Nuclear binding energy for the school tool binding-energy: mass defect and binding energy from atomic masses,
// the semi-empirical (liquid drop) mass formula for the binding energy per nucleon curve, and the energy given out
// by fission and fusion. Plain maths, no DOM.
export const U_MEV = 931.49410242; // MeV per u (CODATA 2018)
export const M_H = 1.00782503; // atomic mass of hydrogen-1, u (AME2020, rounded)
export const M_N = 1.00866492; // neutron mass, u (CODATA 2018, rounded)
/** A few well-known nuclei with their atomic masses in u (AME2020, rounded to 6 decimals). */
export const NUCLEI = [
  { id: 'h2', name: 'Deuterium (H-2)', Z: 1, A: 2, M: 2.014102 },
  { id: 'h3', name: 'Tritium (H-3)', Z: 1, A: 3, M: 3.016049 },
  { id: 'he4', name: 'Helium-4', Z: 2, A: 4, M: 4.002603 },
  { id: 'li7', name: 'Lithium-7', Z: 3, A: 7, M: 7.016003 },
  { id: 'c12', name: 'Carbon-12', Z: 6, A: 12, M: 12 },
  { id: 'o16', name: 'Oxygen-16', Z: 8, A: 16, M: 15.994915 },
  { id: 'fe56', name: 'Iron-56', Z: 26, A: 56, M: 55.934936 },
  { id: 'kr92', name: 'Krypton-92', Z: 36, A: 92, M: 91.926173 },
  { id: 'ba141', name: 'Barium-141', Z: 56, A: 141, M: 140.914403 },
  { id: 'u235', name: 'Uranium-235', Z: 92, A: 235, M: 235.043928 },
  { id: 'u238', name: 'Uranium-238', Z: 92, A: 238, M: 238.050787 },
];
/** Mass defect Δm = Z m_H + N m_n − M (u), using atomic masses so the electrons cancel. */
export const massDefect = (Z: number, A: number, M: number) => Z * M_H + (A - Z) * M_N - M;
export const bindingMeV = (Z: number, A: number, M: number) => massDefect(Z, A, M) * U_MEV;
/** Liquid drop coefficients in MeV (a common textbook set). */
export const SEMF = { aV: 15.75, aS: 17.8, aC: 0.711, aA: 23.7, aP: 11.18 };
export function semf(Z: number, A: number) {
  const N = A - Z, vol = SEMF.aV * A, surf = -SEMF.aS * A ** (2 / 3), coul = (-SEMF.aC * Z * (Z - 1)) / A ** (1 / 3), asym = (-SEMF.aA * (N - Z) ** 2) / A;
  const pair = A % 2 === 1 ? 0 : (Z % 2 === 0 ? 1 : -1) * SEMF.aP / Math.sqrt(A);
  const B = vol + surf + coul + asym + pair;
  return { B, perNucleon: B / A, vol, surf, coul, asym, pair };
}
/** The most tightly bound Z for an odd mass number A on the liquid drop model (pairing left out). */
export function stableZ(A: number) {
  let best = 1, bv = -Infinity;
  for (let Z = 1; Z < A; Z++) { const N = A - Z, v = -(SEMF.aC * Z * (Z - 1)) / A ** (1 / 3) - (SEMF.aA * (N - Z) ** 2) / A; if (v > bv) { bv = v; best = Z; } }
  return best;
}
/** Energy released (MeV) when products form from reactants, from atomic masses: Q = (Σm_in − Σm_out) × 931.494. */
export const qValue = (inM: number[], outM: number[]) => (inM.reduce((a, b) => a + b, 0) - outM.reduce((a, b) => a + b, 0)) * U_MEV;
