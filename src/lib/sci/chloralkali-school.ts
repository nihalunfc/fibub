// School chemistry: the chlor-alkali process, electrolysis of brine (Class 10 salts; Class 12 electrochemistry).
// Anode: 2Cl⁻ → Cl₂ + 2e⁻. Cathode: 2H₂O + 2e⁻ → H₂ + 2OH⁻. Overall: 2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂.
// Faraday's laws: moles of electrons = I·t / F. The Faraday constant is from CODATA 2018 (exact in SI). No DOM.

export const F = 96485.33212; // C mol⁻¹, NA × e (exact since 2019)
export const M = { Cl2: 71, H2: 2, NaOH: 40, NaCl: 58.5 }; // school rounded molar masses, g mol⁻¹

/** Products of passing `amps` for `seconds` at a given current efficiency (0 to 1). Gas volumes at `molarVol` L/mol. */
export function products(amps: number, seconds: number, efficiency = 1, molarVol = 24) {
  const q = amps * seconds, ne = (q / F) * efficiency;
  const nCl2 = ne / 2, nH2 = ne / 2, nNaOH = ne, nNaCl = ne;
  return {
    charge: q, ne, nCl2, nH2, nNaOH, nNaCl,
    mCl2: nCl2 * M.Cl2, mH2: nH2 * M.H2, mNaOH: nNaOH * M.NaOH, mNaCl: nNaCl * M.NaCl,
    vCl2: nCl2 * molarVol, vH2: nH2 * molarVol,
  };
}

/** Time in seconds to make `grams` of NaOH at `amps` (100 % efficiency unless given). */
export const timeForNaOH = (grams: number, amps: number, efficiency = 1) => ((grams / M.NaOH) * F) / (amps * efficiency);
