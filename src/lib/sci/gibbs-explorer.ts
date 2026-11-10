// ΔG = ΔH − TΔS for school chemistry (Class 11 thermodynamics, Class 12 electrochemistry links): Gibbs energy
// change at a temperature, the four sign cases, the temperature where ΔG changes sign, and K = e^(−ΔG°/RT).
// ΔH and ΔG in kJ/mol, ΔS in J/(K·mol), T in kelvin. Plain maths, no DOM.

/** Gas constant, J/(K·mol) (CODATA 2018, exact). */
export const R = 8.314462618;

/** ΔG in kJ/mol from ΔH (kJ/mol), ΔS (J/(K·mol)) and T (K). */
export const gibbs = (dH: number, dS: number, T: number) => dH - (T * dS) / 1000;

/** Temperature (K) where ΔG = 0, i.e. T = ΔH / ΔS, or NaN when ΔS = 0 or the answer is not above 0 K. */
export function crossover(dH: number, dS: number) {
  if (dS === 0) return NaN;
  const T = (dH * 1000) / dS;
  return T > 0 ? T : NaN;
}

export type Case = 'always' | 'never' | 'low' | 'high';
/** The four sign cases. always: ΔH < 0, ΔS > 0. never: ΔH > 0, ΔS < 0. low: both negative (spontaneous below
 *  ΔH/ΔS). high: both positive (spontaneous above ΔH/ΔS). Zero values fall into the matching side. */
export function caseOf(dH: number, dS: number): Case {
  if (dH <= 0 && dS >= 0) return dH === 0 && dS === 0 ? 'never' : 'always';
  if (dH >= 0 && dS <= 0) return 'never';
  return dH < 0 ? 'low' : 'high';
}

/** Equilibrium constant from ΔG° (kJ/mol) at T (K): K = exp(−ΔG°·1000 / RT). */
export const kFromG = (dG: number, T: number) => Math.exp((-dG * 1000) / (R * T));

/** Verdict at one temperature. ΔG within ±0.05 kJ/mol counts as "at equilibrium". */
export const verdict = (dG: number) => (Math.abs(dG) < 0.05 ? 'equilibrium' : dG < 0 ? 'spontaneous' : 'not spontaneous');
