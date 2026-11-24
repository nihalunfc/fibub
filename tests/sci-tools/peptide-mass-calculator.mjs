// #T179 peptide mass: the masses and fragment ions used in the blog article mussel-antioxidant-peptide-masses,
// for the five peptide sequences reported by Lu et al. (2025), Marine Drugs 23(8): 294 (CC BY). Reference masses
// are from each residue's chemical formula with exact isotope masses, as pyteomics gives them (see tests/sci.mjs).
import * as PE from '../../src/lib/sci/peptide.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;
  const want = {
    VPPFY: { mono: 621.31623, avg: 621.735, formula: 'C₃₃H₄₃N₅O₇' },
    IMLFP: { mono: 619.34036, avg: 619.822, formula: 'C₃₁H₄₉N₅O₆S' },
    LPFLF: { mono: 635.36830, avg: 635.806, formula: 'C₃₅H₄₉N₅O₆' },
    FLPF: { mono: 522.28423, avg: 522.646, formula: 'C₂₉H₃₈N₄O₅' },
    FPRIM: { mono: 662.35736, avg: 662.851, formula: 'C₃₁H₅₀N₈O₆S' },
  };
  for (const [seq, w] of Object.entries(want)) {
    const p = PE.peptideProps(seq);
    check(`peptide: ${seq} mono ${w.mono.toFixed(4)}, avg ${w.avg.toFixed(3)}, ${w.formula}`, near(p.mono, w.mono) && near(p.avg, w.avg, 1e-3) && p.formula === w.formula);
  }
  // The y4 ion of LPFLF is the whole of FLPF (same residues, one leucine less at the N end).
  const y4 = PE.fragments('LPFLF')[1].y;
  check('peptide: LPFLF y4 = FLPF [M+H]+ = 523.2915', near(y4, 523.29151) && near(y4, PE.mz(PE.peptideProps('FLPF').mono, 1), 1e-9));
  // Rearranging the first two residues moves b1 only; b3 and b4 are unchanged.
  const a = PE.fragments('LPFLF'), b = PE.fragments('PLFLF');
  check('peptide: b1 114.0913 vs 98.0600, b2 to b4 identical', near(a[0].b, 114.09134) && near(b[0].b, 98.06004) && near(a[1].b, b[1].b, 1e-9) && near(a[2].b, b[2].b, 1e-9) && near(a[3].b, b[3].b, 1e-9));
  // None of the five peptides has a tryptic end; trypsin cuts only after the R inside FPRIM.
  const tryp = Object.keys(want).map((s) => PE.sites(s, 'trypsin').length);
  check('peptide: trypsin cuts only inside FPRIM', tryp.join(',') === '0,0,0,0,1' && PE.sites('FPRIM', 'trypsin')[0] === 3);
  check('peptide: chymotrypsin cuts inside VPPFY, LPFLF and FLPF', PE.sites('VPPFY', 'chymotrypsin').join() === '4' && PE.sites('LPFLF', 'chymotrypsin').join() === '3' && PE.sites('FLPF', 'chymotrypsin').join() === '1');
};
