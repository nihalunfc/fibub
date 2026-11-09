// #1125 Central dogma. The genetic code (written out here by amino acid) was checked codon by codon against
// the separate standard-code table in src/lib/sci/seqtools.ts (written as the 64-letter TCAG string, itself
// checked against Biopython), and the mutation classes against hand-worked examples on a made-up gene.
import { CODON, codonsFor, clean, template, transcribe, translate, oneLetter, mutate, classify } from '../../src/lib/sci/dogma.ts';
import { CODE } from '../../src/lib/sci/seqtools.ts';

export default async (check) => {
  const codons = Object.keys(CODON);
  check('dogma: 64 codons, 3 stops, 61 sense', codons.length === 64 && codons.filter((c) => CODON[c].one === '*').length === 3 && new Set(codons.filter((c) => CODON[c].one !== '*').map((c) => CODON[c].one)).size === 20);
  check('dogma: code matches seqtools codon by codon', codons.every((c) => CODE[c.replace(/U/g, 'T')] === CODON[c].one));
  check('dogma: Leu, Ser, Arg have 6 codons; Met and Trp 1', codonsFor('Leu').length === 6 && codonsFor('Ser').length === 6 && codonsFor('Arg').length === 6 && codonsFor('Met').join() === 'AUG' && codonsFor('Trp').join() === 'UGG');
  check('dogma: clean typed DNA', clean('atg cxt-u 12').seq === 'ATGCTT' && clean('atg cxt-u 12').dropped === 1 && clean('ATGU').seq === 'ATGT');
  check('dogma: template and mRNA', template('ATGC') === 'TACG' && transcribe('ATGC') === 'AUGC');
  const gene = 'GCATGGCTTGGAAAGGTCTGTTCCACTAAGCA';
  const r = translate(transcribe(gene));
  check('dogma: translate from first AUG to stop', r.start === 2 && oneLetter(r.protein) === 'MAWKGLFH' && r.stopped && r.codons.length === 9);
  check('dogma: no AUG gives no protein', translate('CCCGGG').start === -1 && translate('CCCGGG').protein.length === 0);
  check('dogma: mutate', mutate('AAAA', { kind: 'swap', at: 1, base: 'G' }) === 'AGAA' && mutate('AAAA', { kind: 'insert', at: 2, base: 'C' }) === 'AACAA' && mutate('ACGT', { kind: 'delete', at: 0 }) === 'CGT');
  const eff = (c) => classify(gene, Array.isArray(c) ? c : [c]);
  check('dogma: silent (GCT -> GCC is still Ala)', eff({ kind: 'swap', at: 7, base: 'C' }).effect === 'silent');
  check('dogma: missense (UGG Trp -> CGG Arg)', eff({ kind: 'swap', at: 8, base: 'C' }).effect === 'missense' && oneLetter(eff({ kind: 'swap', at: 8, base: 'C' }).after.protein) === 'MARKGLFH');
  check('dogma: nonsense (UGG -> UGA stop)', eff({ kind: 'swap', at: 10, base: 'A' }).effect === 'nonsense' && oneLetter(eff({ kind: 'swap', at: 10, base: 'A' }).after.protein) === 'MA');
  check('dogma: frameshift by insertion and deletion', eff({ kind: 'insert', at: 12, base: 'G' }).effect === 'frameshift' && eff({ kind: 'delete', at: 15 }).effect === 'frameshift');
  check('dogma: three deletions keep the frame', eff([{ kind: 'delete', at: 11 }, { kind: 'delete', at: 11 }, { kind: 'delete', at: 11 }]).effect === 'in-frame' && oneLetter(eff([{ kind: 'delete', at: 11 }, { kind: 'delete', at: 11 }, { kind: 'delete', at: 11 }]).after.protein) === 'MAWGLFH');
  check('dogma: start and stop lost', eff({ kind: 'swap', at: 3, base: 'C' }).effect === 'start-lost' && eff({ kind: 'swap', at: 27, base: 'C' }).effect === 'stop-lost');
  check('dogma: change after the stop is outside the gene', eff({ kind: 'swap', at: 30, base: 'T' }).effect === 'outside' && eff({ kind: 'swap', at: 0, base: 'T' }).effect === 'outside');
  check('dogma: insertion before the start keeps the protein', oneLetter(eff({ kind: 'insert', at: 0, base: 'T' }).after.protein) === 'MAWKGLFH' && eff({ kind: 'insert', at: 0, base: 'T' }).effect === 'outside');
};
