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

export type GUnknown = 'dG' | 'T' | 'dH' | 'dS';
const sf = (x: number, n = 3) => (x === 0 ? '0' : String(+x.toPrecision(n)).replace('-', '−'));
/** Solve ΔG = ΔH − TΔS for one unknown. Inputs in kJ/mol, J/(K·mol), K, kJ/mol. Returns the value, a plain sentence and the working. */
export function solveGibbs(unknown: GUnknown, v: { dH?: number; dS?: number; T?: number; dG?: number }): { value: number; unit: string; sentence: string; steps: string[] } | { error: string } {
  const { dH, dS, T, dG } = v;
  const need = (k: GUnknown) => { const x = v[k]; return typeof x === 'number' && Number.isFinite(x); };
  const names: Record<GUnknown, string> = { dG: 'ΔG', T: 'T', dH: 'ΔH', dS: 'ΔS' };
  const missing = (['dH', 'dS', 'T', 'dG'] as GUnknown[]).filter((k) => k !== unknown && !need(k)).map((k) => names[k]);
  if (missing.length) return { error: `Type a number for ${missing.join(' and ')}.` };
  if (unknown !== 'T' && (T as number) <= 0) return { error: 'T must be above 0 K (use kelvin, or tick °C).' };
  if (unknown === 'dG') {
    const x = gibbs(dH!, dS!, T!);
    const verdict = Math.abs(x) < 0.05 ? 'the reaction is at equilibrium' : x < 0 ? 'ΔG is negative, so the reaction is spontaneous at this temperature' : 'ΔG is positive, so the reaction is not spontaneous at this temperature';
    return { value: x, unit: 'kJ/mol', sentence: `ΔG = ${sf(x)} kJ/mol: ${verdict}.`, steps: ['ΔG = ΔH − TΔS', `ΔG = ${sf(dH!, 6)} − ${sf(T!, 6)} × (${sf(dS!, 6)} ÷ 1000) kJ/mol`, `ΔG = ${sf(dH!, 6)} − (${sf((T! * dS!) / 1000)}) = ${sf(x)} kJ/mol`, 'ΔS is divided by 1000 so that it is in kJ/(K·mol), like ΔH.'] };
  }
  if (unknown === 'T') {
    if (dS === 0) return { error: 'ΔS is zero, so T cancels out: ΔG = ΔH at every temperature.' };
    const x = ((dH! - dG!) * 1000) / dS!;
    if (!(x > 0)) return { error: `That gives T = ${sf(x)} K, which is not above 0 K, so no temperature fits these numbers.` };
    return { value: x, unit: 'K', sentence: `T = ${sf(x)} K (${sf(x - 273.15)} °C).`, steps: ['ΔG = ΔH − TΔS, so T = (ΔH − ΔG) ÷ ΔS', `T = (${sf(dH!, 6)} − (${sf(dG!, 6)})) × 1000 ÷ ${sf(dS!, 6)}`, `T = ${sf(x)} K`, 'With ΔG = 0 this is the temperature where the reaction switches between spontaneous and not.'] };
  }
  if (unknown === 'dH') {
    const x = dG! + (T! * dS!) / 1000;
    return { value: x, unit: 'kJ/mol', sentence: `ΔH = ${sf(x)} kJ/mol (${x < 0 ? 'exothermic' : x > 0 ? 'endothermic' : 'no heat change'}).`, steps: ['ΔG = ΔH − TΔS, so ΔH = ΔG + TΔS', `ΔH = ${sf(dG!, 6)} + ${sf(T!, 6)} × (${sf(dS!, 6)} ÷ 1000) kJ/mol`, `ΔH = ${sf(x)} kJ/mol`] };
  }
  const x = ((dH! - dG!) * 1000) / T!;
  return { value: x, unit: 'J/(K·mol)', sentence: `ΔS = ${sf(x)} J/(K·mol) (${x > 0 ? 'more disorder' : x < 0 ? 'less disorder' : 'no change in disorder'}).`, steps: ['ΔG = ΔH − TΔS, so ΔS = (ΔH − ΔG) ÷ T', `ΔS = (${sf(dH!, 6)} − (${sf(dG!, 6)})) × 1000 ÷ ${sf(T!, 6)}`, `ΔS = ${sf(x)} J/(K·mol)`] };
}
