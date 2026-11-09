// Central dogma (school biology): DNA -> mRNA -> protein with the standard genetic code, and what a one-base
// change, insertion or deletion does to the protein. Plain maths, no DOM.

// The standard genetic code, written out by amino acid (mRNA codons). '*' marks the three stop codons.
const BY_AA: [string, string, string, string[]][] = [
  ['Phe', 'F', 'Phenylalanine', ['UUU', 'UUC']], ['Leu', 'L', 'Leucine', ['UUA', 'UUG', 'CUU', 'CUC', 'CUA', 'CUG']],
  ['Ile', 'I', 'Isoleucine', ['AUU', 'AUC', 'AUA']], ['Met', 'M', 'Methionine (start)', ['AUG']],
  ['Val', 'V', 'Valine', ['GUU', 'GUC', 'GUA', 'GUG']], ['Ser', 'S', 'Serine', ['UCU', 'UCC', 'UCA', 'UCG', 'AGU', 'AGC']],
  ['Pro', 'P', 'Proline', ['CCU', 'CCC', 'CCA', 'CCG']], ['Thr', 'T', 'Threonine', ['ACU', 'ACC', 'ACA', 'ACG']],
  ['Ala', 'A', 'Alanine', ['GCU', 'GCC', 'GCA', 'GCG']], ['Tyr', 'Y', 'Tyrosine', ['UAU', 'UAC']],
  ['His', 'H', 'Histidine', ['CAU', 'CAC']], ['Gln', 'Q', 'Glutamine', ['CAA', 'CAG']],
  ['Asn', 'N', 'Asparagine', ['AAU', 'AAC']], ['Lys', 'K', 'Lysine', ['AAA', 'AAG']],
  ['Asp', 'D', 'Aspartic acid', ['GAU', 'GAC']], ['Glu', 'E', 'Glutamic acid', ['GAA', 'GAG']],
  ['Cys', 'C', 'Cysteine', ['UGU', 'UGC']], ['Trp', 'W', 'Tryptophan', ['UGG']],
  ['Arg', 'R', 'Arginine', ['CGU', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG']], ['Gly', 'G', 'Glycine', ['GGU', 'GGC', 'GGA', 'GGG']],
  ['Stop', '*', 'Stop', ['UAA', 'UAG', 'UGA']],
];
export type AA = { three: string; one: string; name: string };
export const CODON: Record<string, AA> = {};
for (const [three, one, name, cs] of BY_AA) for (const c of cs) CODON[c] = { three, one, name };
export const codonsFor = (three: string) => BY_AA.find((r) => r[0] === three)?.[3] ?? [];

const PAIR: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
/** Clean typed DNA: letters A, C, G, T only (U read as T), anything else dropped and counted. */
export function clean(s: string) {
  let seq = '', dropped = 0;
  for (const ch of s.toUpperCase()) { if ('ACGT'.includes(ch)) seq += ch; else if (ch === 'U') seq += 'T'; else if (!/\s|\d|-/.test(ch)) dropped++; }
  return { seq, dropped };
}
/** Template strand, base by base under the coding strand (so it reads 3' to 5' left to right). */
export const template = (coding: string) => [...coding].map((b) => PAIR[b] ?? 'N').join('');
/** mRNA is copied from the template, so it matches the coding strand with U for T. */
export const transcribe = (coding: string) => coding.replace(/T/g, 'U');

export type Reading = { start: number; codons: { at: number; codon: string; aa: AA }[]; stopped: boolean; protein: AA[] };
/** Translate mRNA from the first AUG (or from `from` when given) until a stop codon or the end. */
export function translate(mrna: string, from?: number): Reading {
  const start = from ?? mrna.indexOf('AUG');
  const codons: Reading['codons'] = [];
  let stopped = false;
  if (start < 0) return { start: -1, codons, stopped, protein: [] };
  for (let i = start; i + 3 <= mrna.length; i += 3) {
    const codon = mrna.slice(i, i + 3), aa = CODON[codon];
    if (!aa) break;
    codons.push({ at: i, codon, aa });
    if (aa.one === '*') { stopped = true; break; }
  }
  return { start, codons, stopped, protein: codons.filter((c) => c.aa.one !== '*').map((c) => c.aa) };
}
export const oneLetter = (p: AA[]) => p.map((a) => a.one).join('');

export type Change = { kind: 'swap'; at: number; base: string } | { kind: 'insert'; at: number; base: string } | { kind: 'delete'; at: number };
export function mutate(seq: string, c: Change): string {
  if (c.kind === 'swap') return seq.slice(0, c.at) + c.base + seq.slice(c.at + 1);
  if (c.kind === 'insert') return seq.slice(0, c.at) + c.base + seq.slice(c.at);
  return seq.slice(0, c.at) + seq.slice(c.at + 1);
}

export type Effect = 'none' | 'silent' | 'missense' | 'nonsense' | 'frameshift' | 'in-frame' | 'start-lost' | 'stop-lost' | 'outside';
/** What a list of changes (applied in order) does to the protein of the coding strand. */
export function classify(coding: string, changes: Change[]): { effect: Effect; before: Reading; after: Reading; mutant: string } {
  const mutant = changes.reduce((s, c) => mutate(s, c), coding);
  const before = translate(transcribe(coding));
  const startPos = before.start;
  if (!changes.length) return { effect: 'none', before, after: before, mutant };
  if (startPos < 0) return { effect: 'outside', before, after: translate(transcribe(mutant)), mutant };
  const end = before.codons.length ? before.codons[before.codons.length - 1].at + 3 : startPos;
  const net = changes.reduce((s, c) => s + (c.kind === 'insert' ? 1 : c.kind === 'delete' ? -1 : 0), 0);
  const inside = changes.some((c) => c.at >= startPos && c.at < end);
  const touchesStart = changes.some((c) => c.at >= startPos && c.at < startPos + 3 && c.kind === 'swap');
  // Keep reading from the same start position, as a ribosome already on the mRNA would.
  const shift = changes.reduce((s, c) => s + (c.at < startPos ? (c.kind === 'insert' ? 1 : c.kind === 'delete' ? -1 : 0) : 0), 0);
  const after = translate(transcribe(mutant), startPos + shift);
  if (!inside) return { effect: 'outside', before, after, mutant };
  if (touchesStart && transcribe(mutant).slice(startPos + shift, startPos + shift + 3) !== 'AUG') return { effect: 'start-lost', before, after: translate(transcribe(mutant)), mutant };
  if (net % 3 !== 0) return { effect: 'frameshift', before, after, mutant };
  if (net !== 0) return { effect: 'in-frame', before, after, mutant };
  const pb = oneLetter(before.protein), pa = oneLetter(after.protein);
  if (pb === pa && after.stopped === before.stopped) return { effect: 'silent', before, after, mutant };
  if (pa.length < pb.length && after.stopped) return { effect: 'nonsense', before, after, mutant };
  if (pa.length > pb.length) return { effect: 'stop-lost', before, after, mutant };
  return { effect: 'missense', before, after, mutant };
}
