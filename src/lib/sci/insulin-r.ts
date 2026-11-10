// Recombinant insulin for school biotechnology: restriction enzymes and their sticky ends, whether two cut
// ends can be joined by DNA ligase, how many base pairs code for a chain, and which cells grow on
// antibiotic plates when the insert sits inside a resistance gene (insertional inactivation, as in pBR322).

/** Recognition site with ^ where the top strand is cut (classic palindromic enzymes). */
export const ENZYMES: Record<string, string> = { EcoRI: 'G^AATTC', BamHI: 'G^GATCC', HindIII: 'A^AGCTT', SmaI: 'CCC^GGG' };

const COMP: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
export const revcomp = (s: string) => [...s].reverse().map((c) => COMP[c] ?? 'N').join('');

/** The single-stranded overhang left by an enzyme (5′ to 3′), '' for a blunt cut. */
export function overhang(enzyme: string): { seq: string; kind: "5′" | "3′" | 'blunt' } {
  const site = ENZYMES[enzyme], cut = site.indexOf('^'), s = site.replace('^', ''), n = s.length;
  const bottomCut = n - cut; // the bottom strand is cut at the mirror position (palindromic sites)
  if (cut === bottomCut) return { seq: '', kind: 'blunt' };
  return cut < bottomCut ? { seq: s.slice(cut, bottomCut), kind: '5′' } : { seq: s.slice(bottomCut, cut), kind: '3′' };
}

/** Can ends cut by enzymes a and b be joined by ligase? Sticky ends must pair; blunt ends join blunt ends. */
export function compatible(a: string, b: string): boolean {
  const x = overhang(a), y = overhang(b);
  if (x.kind === 'blunt' || y.kind === 'blunt') return x.kind === y.kind;
  return x.kind === y.kind && x.seq === revcomp(y.seq);
}

/** Base pairs needed to code a chain of n amino acids, with a start codon (ATG) and one stop codon. */
export const codingBp = (n: number, withStart = true) => 3 * n + 3 + (withStart ? 3 : 0);

export type Cell = 'none' | 'plasmid' | 'recombinant';
/**
 * Growth on plates for a plasmid with ampicillin (ampR) and tetracycline (tetR) resistance genes, where the
 * insert goes into tetR: cells without a plasmid grow on neither; with the plain plasmid on both; with the
 * recombinant plasmid on ampicillin only.
 */
export function grows(cell: Cell, plate: 'plain' | 'amp' | 'tet'): boolean {
  if (plate === 'plain') return true;
  if (cell === 'none') return false;
  if (cell === 'plasmid') return true;
  return plate === 'amp';
}

export const CHAIN = { A: 21, B: 30 }; // amino acids in human insulin's A and B chains
