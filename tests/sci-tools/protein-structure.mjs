// #1395 Protein structure levels. Masses checked by hand from standard residue masses: GA = 57.051 + 71.078 + 18.015
// = 146.146 Da; helix 20 × 0.15 = 3 nm, 20/3.6 = 5.556 turns. The bead model folds (radius of gyration falls well
// below the stretched value) at 25 °C and opens again at 80 °C with a fixed seed.
import * as P from '../../src/lib/sci/protein-structure.ts';
const near = (a, b, e) => Math.abs(a - b) <= e;
export default async (check) => {
  check('protein: GA mass 146.146 Da', near(P.primary('GA').mass, 146.146, 0.01));
  const p = P.primary('MKLVAEFGSDLIKAWRVLEG');
  check('protein: example 20 residues, 19 bonds, 2262.70 Da, 11 hydrophobic', p.n === 20 && p.bonds === 19 && p.water === 19 && near(p.mass, 2262.70, 0.05) && p.hydrophobic === 11);
  check('protein: 20^20 sequences', near(p.sequences, 1.048576e26, 1e20));
  check('protein: clean keeps only the 20 letters', P.clean('mk-l1vB xz') === 'MKLV');
  const h = P.helix(20);
  check('protein: helix 3 nm, 5.556 turns, 0.54 nm pitch', near(h.length, 3, 1e-12) && near(h.turns, 5.5556, 1e-4) && near(h.pitch, 0.54, 1e-12) && near(P.strand(20), 6.6, 1e-12));
  const b = P.extended('MKLVAEFGSDLIKAWRVLEG'), r = P.rng(7), rg0 = P.shape(b).rg;
  for (let i = 0; i < 3000; i++) P.foldStep(b, 25, 0.02, r);
  const folded = P.shape(b);
  check(`protein: folds at 25 °C (rg ${rg0.toFixed(2)} → ${folded.rg.toFixed(2)}, buried ${folded.buried})`, folded.rg < 2.2 && folded.buried >= 8);
  for (let i = 0; i < 2000; i++) P.foldStep(b, 80, 0.02, r);
  const hot = P.shape(b);
  check(`protein: unfolds at 80 °C (rg ${hot.rg.toFixed(2)}, buried ${hot.buried})`, hot.rg > folded.rg + 0.5 && hot.buried < folded.buried);
  const pol = P.extended('KDESKDESKDES'), r2 = P.rng(3);
  for (let i = 0; i < 3000; i++) P.foldStep(pol, 25, 0.02, r2);
  check('protein: an all-polar chain buries nothing', P.shape(pol).buried === 0);
};
