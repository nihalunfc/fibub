// #311 dN/dS: reference values from Biopython 1.88 Bio.codonalign.codonseq.cal_dn_ds(method='NG86') and its
// _count_site_NG86 / _count_diff_NG86 on the made-up example, and Python + SciPy 1.18 for the standard errors and
// the Z test. Biopython counts pathways through stop codons; NG86 (and this tool) leaves them out, checked by hand.
import * as M from '../../src/lib/sci/dnds.ts';

const A = 'ATGGCACTATCACCCCGTGCTCGATCCCCGACGGCTAGGGGGTGCGATTTGACCCTGTGGAAGCCCACCCTATACGTTCGCAGTAAGGGTCGTCTTAACGGTGGAGCGAGTCAACAATTATGCCCGCATACAATAAGCGACGATGTAGGACCAGAAGAGCTTCGGACCAGCAGCTCAATTTAA';
const B = 'ATGGCACTATCACCCCGATCTCGATCCCCTACTGCTAGGGGGTGCGATTTAACCCTGTGGAAGCCCACCCTTAACCTACGTAGTAAAGGTCGTCTTAATGGCGGAGCGAGCCAACAATTGTGCCCGCACAGCATAAGCGACGATGTAGGACCAGAAGAGCTGCGGACCAGCAGCTCAATTTAA';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('dnds: genetic code', M.CODE.ATG === 'M' && M.CODE.TGA === '*' && M.CODE.TGG === 'W' && M.CODE.AGA === 'R' && Object.keys(M.CODE).length === 64);
  check('dnds: synonymous sites of TTA = 2/3, CTG = 4/3, ATG = 0, GGG = 1', near(M.synSites('TTA'), 2 / 3) && near(M.synSites('CTG'), 4 / 3) && M.synSites('ATG') === 0 && near(M.synSites('GGG'), 1));
  const r = M.ng86(A, B);
  check('dnds: 60 codons compared, final stop skipped', r.codons === 60 && r.skipped === 1);
  check('dnds: S and N sites = Biopython', near(r.S, 45.33333333333334) && near(r.N, 134.6666666666667));
  check('dnds: Sd 14.5, Nd 4.5 = Biopython', r.Sd === 14.5 && r.Nd === 4.5);
  check('dnds: dN and dS = Biopython cal_dn_ds NG86', near(r.dN, 0.03418313137223944) && near(r.dS, 0.416959544284845));
  check('dnds: dN/dS', near(r.omega, 0.08198188970795518));
  check('dnds: standard errors and Z test = Python/SciPy', near(r.seS, 0.12078473903943421) && near(r.seN, 0.01620914261880127) && near(r.z, -3.140922625003483) && near(r.pZ, 0.001684165205810449, 1e-6));
  check('dnds: two-difference codon ACA→AGC averages two pathways (0.5 syn, 1.5 nonsyn)', JSON.stringify(M.codonDiff('ACA', 'AGC')) === JSON.stringify({ sd: 0.5, nd: 1.5, paths: 2 }));
  check('dnds: pathway through a stop codon left out (TGG→CGA)', JSON.stringify(M.codonDiff('TGG', 'CGA')) === JSON.stringify({ sd: 1, nd: 1, paths: 1 }));
  check('dnds: three-difference codon averages six pathways', M.codonDiff('AAA', 'GGG').paths === 6 && near(M.codonDiff('AAA', 'GGG').sd + M.codonDiff('AAA', 'GGG').nd, 3));
  check('dnds: gap codons skipped', M.ng86('ATG---AAA', 'ATGAAAAAG').codons === 2 && M.ng86('ATG---AAA', 'ATGAAAAAG').skipped === 1);
  check('dnds: internal stops found', JSON.stringify(M.internalStops('ATGTAAGGGTGA')) === '[2]');
};
