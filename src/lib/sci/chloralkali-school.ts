// #1299 Chlor-alkali process: electrolysis of brine. 2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂. Charge Q = It; moles of
// electrons = Q/F; one Cl₂ and one H₂ per 2 electrons, one NaOH per electron. Faraday constant from CODATA, molar
// masses from IUPAC standard atomic weights, gas volume at 25 °C and 1 bar from the ideal gas law. Pure maths.

export const F = 96485.33212;                 // C/mol, CODATA 2018 (exact, = e × N_A)
export const R = 8.314462618;                 // J/(mol K), CODATA 2018 (exact)
/** Molar volume of an ideal gas at 25 °C and 1 bar, litres per mol (≈ 24.79). */
export const VM = (R * 298.15) / 100000 * 1000;
const Na = 22.99, Cl = 35.45, O = 15.999, H = 1.008;
export const M = { NaOH: Na + O + H, Cl2: 2 * Cl, H2: 2 * H, NaCl: Na + Cl };

/** Products from a current of I amperes for t seconds (100% efficient cell). */
export function products(I: number, t: number) {
  const Q = I * t, ne = Q / F;
  return {
    Q, ne,
    cl2: { mol: ne / 2, g: (ne / 2) * M.Cl2, L: (ne / 2) * VM },
    h2: { mol: ne / 2, g: (ne / 2) * M.H2, L: (ne / 2) * VM },
    naoh: { mol: ne, g: ne * M.NaOH },
    nacl: { mol: ne, g: ne * M.NaCl },
  };
}
/** Seconds needed at I amperes to make `g` grams of NaOH. */
export const timeForNaOH = (g: number, I: number) => ((g / M.NaOH) * F) / I;
