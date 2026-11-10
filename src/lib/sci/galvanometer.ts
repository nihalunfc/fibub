// #1413 Galvanometer to ammeter and voltmeter: shunt S = Ig G / (I0 − Ig) in parallel, or series resistance
// R = V0 / Ig − G; the meter's own resistance and the current split. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

/** Shunt (Ω) that turns a galvanometer (coil G Ω, full scale Ig A) into an ammeter reading up to I0 A. */
export const shunt = (G: number, Ig: number, I0: number) => (Ig * G) / (I0 - Ig);
/** Series resistance (Ω) that turns it into a voltmeter reading up to V0 V. */
export const seriesR = (G: number, Ig: number, V0: number) => V0 / Ig - G;
/** The ammeter's resistance (G and S in parallel) and the voltmeter's (G + R). */
export const ammeterR = (G: number, S: number) => (G * S) / (G + S);
export const voltmeterR = (G: number, R: number) => G + R;

/** Ammeter: total current I splits; the galvanometer gets I S / (G + S). Returns the coil current and the fraction of full scale. */
export function ammeterReading(G: number, Ig: number, S: number, I: number) {
  const ig = (I * S) / (G + S);
  return { ig, is: I - ig, frac: ig / Ig };
}
/** Voltmeter across V volts: current V / (G + R) through the coil. */
export function voltmeterReading(G: number, Ig: number, R: number, V: number) {
  const ig = V / (G + R);
  return { ig, frac: ig / Ig };
}

export function questions(rng: () => number = Math.random): Question[] {
  const G = pick(rng, [20, 25, 50, 100]), Igm = pick(rng, [1, 2, 5]), I0 = pick(rng, [1, 2, 5]), V0 = pick(rng, [3, 5, 10, 15]);
  const Ig = Igm / 1000, S = shunt(G, Ig, I0), R = seriesR(G, Ig, V0), RA = ammeterR(G, S) * 1000;
  const I = pick(rng, [0.4, 0.5, 0.8]) * I0, igI = ((I * S) / (G + S)) * 1000;
  return [
    { text: `A galvanometer has a coil of ${G} Ω and gives full-scale deflection at ${Igm} mA. What shunt turns it into an ammeter reading up to ${I0} A, in ohms?`, answer: S, unit: 'Ω', tol: 0.02,
      steps: ['S = Ig G / (I₀ − Ig)', `S = ${Ig} × ${G} / (${I0} − ${Ig}) = ${r3(S)} Ω`] },
    { text: `What resistance must be joined in series with the same galvanometer to make a voltmeter reading up to ${V0} V, in ohms?`, answer: R, unit: 'Ω', tol: 0.02,
      steps: ['R = V₀ / Ig − G', `R = ${V0} / ${Ig} − ${G} = ${r3(R)} Ω`] },
    { text: `What is the resistance of the ${I0} A ammeter you made, in milliohms?`, answer: RA, unit: 'mΩ', tol: 0.02,
      steps: ['G and S are in parallel: R_A = G S / (G + S)', `R_A = ${G} × ${r3(S)} / (${G} + ${r3(S)}) Ω = ${r3(RA)} mΩ`] },
    { text: `The ammeter reads ${r3(I)} A. How much current goes through the galvanometer coil itself, in milliamperes?`, answer: igI, unit: 'mA', tol: 0.02,
      steps: ['The coil current is the same fraction of full scale as the reading: Ig × I / I₀.', `${Igm} mA × ${r3(I)} / ${I0} = ${r3(igI)} mA`] },
  ];
}
