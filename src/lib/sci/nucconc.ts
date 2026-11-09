// Nucleic acid and protein concentration from UV absorbance (A260 or A280), purity ratios, molar mass from length or
// sequence, molarity, copy number and dilution to a target. Residue masses are worked out by fibub from the elemental
// formulas of the nucleotide residues with standard atomic weights. No DOM.

export type Kind = 'ds' | 'ss' | 'rna';
export const NA = 6.02214076e23;
/** Conventional µg/mL per absorbance unit at 260 nm over 1 cm. */
export const FACTOR: Record<Kind, number> = { ds: 50, ss: 33, rna: 40 };
const AW = { C: 12.011, H: 1.008, N: 14.007, O: 15.999, P: 30.974 } as const;
const formula = (f: string) => [...f.matchAll(/([A-Z])(\d*)/g)].reduce((s, m) => s + AW[m[1] as keyof typeof AW] * (m[2] ? +m[2] : 1), 0);
/** Mass of each nucleotide residue in a chain (monophosphate minus water), g/mol. */
export const DNA_RES: Record<string, number> = { A: formula('C10H12N5O5P'), C: formula('C9H12N3O6P'), G: formula('C10H12N5O6P'), T: formula('C10H13N2O7P') };
export const RNA_RES: Record<string, number> = { A: formula('C10H12N5O6P'), C: formula('C9H12N3O7P'), G: formula('C10H12N5O7P'), U: formula('C9H11N2O8P') };
export const WATER = formula('H2O');
const avg = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0) / 4;
const COMP: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };

/**
 * Molar mass (g/mol). Linear chains carry a 5′ phosphate and a 3′ OH (one water per strand); circular ones none.
 * With a sequence the exact composition is used (ambiguous letters count as the average residue); otherwise the average.
 */
export function molarMass(kind: Kind, len: number, seq = '', circular = false) {
  const res = kind === 'rna' ? RNA_RES : DNA_RES, a = avg(res);
  const s = seq.toUpperCase().replace(kind === 'rna' ? /T/g : /U/g, kind === 'rna' ? 'U' : 'T').replace(/[^A-Z]/g, '');
  const n = s.length || len;
  let strand = 0, other = 0;
  if (s.length) for (const b of s) { strand += res[b] ?? a; other += res[COMP[b]] ?? a; }
  else { strand = n * a; other = n * a; }
  const ends = circular ? 0 : WATER;
  return kind === 'ds' ? strand + other + 2 * ends : strand + ends;
}

/** Concentration (ng/µL = µg/mL) from A260, background A320, factor (µg/mL per A over 1 cm), dilution and path (cm). */
export const conc = (a260: number, factor: number, dil = 1, path = 1, a320 = 0) => ((a260 - a320) * factor * dil) / path;
/** Protein concentration (mg/mL) from A280 with the molar extinction coefficient ε (M⁻¹cm⁻¹) and molar mass (g/mol). */
export const proteinConc = (a280: number, eps: number, mw: number, dil = 1, path = 1, a320 = 0) => ((a280 - a320) * dil * mw) / (eps * path);
/** Molarity in nM from ng/µL and g/mol. */
export const nM = (ngul: number, mw: number) => (ngul / mw) * 1e6;
/** Copies per µL from ng/µL and g/mol. */
export const copies = (ngul: number, mw: number) => (ngul * 1e-9 * NA) / mw;
/** Stock and diluent volumes to reach a target in a final volume (same units as stock). Null if the stock is too weak. */
export function diluteTo(stock: number, target: number, finalVol: number) {
  if (!(stock > 0) || !(target > 0) || target > stock) return null;
  const v = (target * finalVol) / stock;
  return { stock: v, diluent: finalVol - v, fold: stock / target };
}

/** Plain-language purity notes for a nucleic acid sample (rules of thumb). */
export function purity(kind: Kind, r280: number, r230: number) {
  const notes: string[] = [];
  const lo = kind === 'rna' ? 1.9 : 1.7, hi = kind === 'rna' ? 2.2 : 2.0, ideal = kind === 'rna' ? '2.0' : '1.8';
  if (Number.isFinite(r280)) {
    if (r280 < lo) notes.push(`260/280 below ${lo} (pure ≈ ${ideal}): protein or phenol may be present`);
    else if (r280 > hi) notes.push(`260/280 above ${hi}: ${kind === 'rna' ? 'check the blank' : 'RNA may be present, or check the blank'}`);
  }
  if (Number.isFinite(r230) && r230 < 1.8) notes.push('260/230 below 1.8: salt, guanidine, phenol or carbohydrate may be carried over');
  return { ok: notes.length === 0, notes };
}
