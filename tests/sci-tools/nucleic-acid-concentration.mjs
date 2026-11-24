// #164 nucleic acid concentration: hand calculations for the factors, purity notes and copy number, added with the
// DeNovix / NanoDrop / Qubit article (A260 2.54 -> 127 ng/uL as dsDNA, 101.6 as RNA; copies of a 2.1 Mbp circle at 40 ng/uL).
import { conc, FACTOR, purity, molarMass, copies, nM, diluteTo } from '../../src/lib/sci/nucconc.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('nucleic acid: factors 50, 33, 40', FACTOR.ds === 50 && FACTOR.ss === 33 && FACTOR.rna === 40);
  check('nucleic acid: A260 2.54 is 127 ng/uL as dsDNA and 101.6 as RNA', near(conc(2.54, FACTOR.ds), 127) && near(conc(2.54, FACTOR.rna), 101.6));
  check('nucleic acid: background A320, dilution and path length', near(conc(7.40, 50, 1, 1, 0.02), 369) && near(conc(0.5, 50, 10, 1), 250) && near(conc(0.5, 50, 1, 0.1), 250));
  check('nucleic acid: purity 1.99 / 2.33 gives no note, 2.05 flags RNA, 1.6 flags protein, 260/230 1.4 flags salt', purity('ds', 1.99, 2.33).ok && purity('ds', 2.05, 2.34).notes[0].includes('RNA may be present') && purity('ds', 1.6, 2.2).notes[0].includes('protein') && purity('ds', 1.9, 1.4).notes[0].includes('260/230'));
  const mw = molarMass('ds', 2.1e6, '', true);
  check('nucleic acid: 2.1 Mbp circle, 1.30e9 g/mol; 40 ng/uL = 1.86e7 copies/uL; 126.93 ng/uL = 5.89e7', near(mw, 1.2976e9, 1e-4) && near(copies(40, mw), 1.856e7, 1e-3) && near(copies(126.93, mw), 5.891e7, 1e-3));
  check('nucleic acid: nM and dilution by hand', near(nM(100, 1e6), 100) && near(diluteTo(369, 10, 50).stock, 50 * 10 / 369));
};
