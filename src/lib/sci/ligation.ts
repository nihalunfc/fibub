// Ligation and assembly (Gibson / HiFi style) set-up: molar insert:vector ratios, pmol from ng and length, and pipetting
// volumes that fill a reaction around a fixed buffer or master mix. Molar masses of double-stranded DNA come from
// nucconc.ts (linear, from length). No DOM.
import { molarMass } from './nucconc.ts';

/** pmol of linear double-stranded DNA from ng and length in bp. */
export const pmol = (ng: number, bp: number) => (ng / molarMass('ds', bp)) * 1000;
/** ng of linear double-stranded DNA from pmol and length in bp. */
export const ngOf = (pm: number, bp: number) => (pm * molarMass('ds', bp)) / 1000;
/** The textbook shortcut: ng insert = ng vector × ratio × insert bp ÷ vector bp. */
export const insertNgSimple = (vectorNg: number, vectorBp: number, insertBp: number, ratio: number) => (vectorNg * ratio * insertBp) / vectorBp;

export type Frag = { name: string; bp: number; conc: number; ratio: number };
export type Mix = { total: number; bufferFraction: number; enzyme: number };
/**
 * Amounts and volumes for a reaction. frags[0] is the vector (its ratio is ignored); every other fragment is added at
 * ratio × vector pmol. Buffer volume = total × bufferFraction (1/10 for a 10× buffer, 1/2 for a 2× master mix).
 */
export function reaction(frags: Frag[], vectorNg: number, mix: Mix) {
  const vp = pmol(vectorNg, frags[0].bp);
  const rows = frags.map((f, i) => {
    const pm = i === 0 ? vp : vp * f.ratio, ng = i === 0 ? vectorNg : ngOf(pm, f.bp);
    return { ...f, ratio: i === 0 ? 1 : f.ratio, pmol: pm, ng, vol: ng / f.conc };
  });
  const buffer = mix.total * mix.bufferFraction, dna = rows.reduce((a, r) => a + r.vol, 0);
  const room = mix.total - buffer - mix.enzyme, water = room - dna;
  // Largest vector amount that fits: every volume scales with the vector ng.
  const maxVectorNg = dna > 0 ? (vectorNg * room) / dna : Infinity;
  return { rows, buffer, enzyme: mix.enzyme, dna, room, water, fits: water >= -1e-9, maxVectorNg, totalPmol: rows.reduce((a, r) => a + r.pmol, 0), totalNg: rows.reduce((a, r) => a + r.ng, 0) };
}
