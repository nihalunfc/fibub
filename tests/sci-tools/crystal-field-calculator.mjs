// #T93 Crystal field: the article cases. The textbook checks of src/lib/sci/crystalfield.ts live in tests/sci.mjs.
import * as C from '../../src/lib/sci/crystalfield.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const OH = C.GEOMETRIES.find((g) => g.id === 'oh'), TD = C.GEOMETRIES.find((g) => g.id === 'td');

  // Blog article manganese-iii-ionic-liquid-distorted-octahedral-high-spin: Sharmin et al. (2025), Next Materials
  // 8: 100682. Mn(III), bands at 1381 nm and 434 nm, measured moment 4.6 B.M., pairing energy 28,000 cm-1 (tables).
  const d = C.dCount('Mn', 3), D = C.deltaFromNm(1381), P = 28000;
  check('crystalfield: Mn(III) is d4 and its 1381 nm band gives 7241 cm-1 (86.6 kJ/mol)',
    d === 4 && near(D, 7241, 1) && near(D * C.CM_TO_KJ, 86.62, 0.02) && near(C.deltaFromNm(434), 23041, 1));
  const states = C.spinStates(OH.levels, d, D, P), g = states[0];
  check('crystalfield: Mn(III) at 7241 cm-1 is high spin t2g3 eg1, CFSE -4345 cm-1, strong Jahn-Teller',
    g.unpaired === 4 && C.configLabel(OH, g.occ) === 't2g³ eg¹' && near(g.cfse * D, -4345, 1) && C.jahnTeller(g.occ) === 'strong');
  check('crystalfield: the low-spin alternative is 16,414 cm-1 higher and would give 2.83 B.M.',
    near(states[1].energy, 16414, 1) && states[1].unpaired === 2 && near(C.spinOnly(2), 2.828, 0.001));
  check('crystalfield: the measured 4.6 B.M. is 93.9 % of the spin-only 4.90 for four unpaired electrons',
    near(C.spinOnly(4), 4.899, 0.001) && near(4.6 / C.spinOnly(4), 0.939, 0.001));
  // The crossover sits at Delta = P, so reading the 434 nm band as Delta would flip the answer for P = 23,000.
  const cross = (p) => { let lo = 0, hi = 80000; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; C.spinStates(OH.levels, d, m, p)[0].unpaired === 4 ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  check('crystalfield: d4 high-to-low-spin crossover is at Delta = P, a band at 435 nm for P = 23,000 cm-1',
    near(cross(23000), 23000, 5) && near(1e7 / cross(23000), 435, 1) && C.spinStates(OH.levels, d, 23041, 23000)[0].unpaired === 2);
  check('crystalfield: a tetrahedral d4 at 4/9 of the same Delta also has four unpaired electrons, so the moment alone cannot pick the geometry',
    C.spinStates(TD.levels, d, (D * 4) / 9, P)[0].unpaired === 4 && C.configLabel(TD, C.spinStates(TD.levels, d, (D * 4) / 9, P)[0].occ) === 'e² t2²');
  check('crystalfield: the 434 nm band looks yellow, the 1381 nm band is invisible',
    C.seenColour(434).seen === 'yellow' && C.seenColour(1381).absorbed === 'near infrared');
};
