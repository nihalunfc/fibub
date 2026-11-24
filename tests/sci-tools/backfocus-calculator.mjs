// #T43 Backfocus calculator: the glass-path shift and the spacer stack, pinned to the published optical train of
// the Stuttgart university telescope, Schindler, Wolf and Krabbe (2026), PASP, doi:10.1088/1538-3873/ae477d
// (CC BY 4.0), used in /blog/discoveries/atus-telescope-back-focus-budget-prism-glass-path-spacers/.
import { filterShift, readSpacers, solveSpacers } from '../../src/lib/sci/backfocus.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) < tol;
  check('backfocus: a 25 mm BK7 pick-off prism (n = 1.5168) shifts the focus by 8.5179 mm, the paper\'s 8.52',
    near(filterShift(25, 1.5168), 8.5179325, 1e-6) && +filterShift(25, 1.5168).toFixed(2) === 8.52);
  check('backfocus: a 2 µm pellicle shifts the focus by 0.68 µm, which is why it can sit in the beam',
    near(filterShift(0.002, 1.5168) * 1000, 0.68, 0.005));
  // Our example camera train (17.5 + 20 + 25 mm of parts and a 3 mm filter at n = 1.5) against the paper's three
  // flange focal distances of 303.5, 228.1 and 83.7 mm.
  const own = readSpacers('88.9, 50, 30, 20, 16.5, 10, 5, 3, 2, 1, 0.5, 0.3');
  const gapFor = (ffd) => ffd + filterShift(3, 1.5) - (17.5 + 20 + 25);
  check('backfocus: the paper\'s three configurations leave gaps of 242.00, 166.60 and 22.20 mm for our example train',
    near(gapFor(303.5), 242, 1e-9) && near(gapFor(228.1), 166.6, 1e-9) && near(gapFor(83.7), 22.2, 1e-9));
  const a = solveSpacers(gapFor(228.1), own), b = solveSpacers(gapFor(83.7), own), c = solveSpacers(gapFor(303.5), own);
  check('backfocus: those gaps are met to 0.1 mm for the flattener and reducer, while the reflective one is 14.8 mm beyond the rings',
    near(a.error, 0.1, 1e-9) && a.pieces.join() === '88.9,50,16.5,10,1,0.3'
    && near(b.error, 0.1, 1e-9) && b.pieces.join() === '20,2,0.3'
    && near(c.error, -14.8, 1e-9) && near(c.total, 227.2, 1e-9));
  // Thin shims: with 0.1 and 0.2 mm rings every gap in 0.1 mm steps is exactly reachable; without them a 0.1 mm miss appears.
  const fine = readSpacers('88.9, 50, 30, 20, 16.5, 10, 5, 3, 2 x2, 1, 0.5, 0.3, 0.2, 0.1');
  let worstFine = 0, worstCoarse = 0;
  for (let i = 0; i <= 900; i++) { const g = +(i * 0.1).toFixed(1); worstFine = Math.max(worstFine, Math.abs(solveSpacers(g, fine).error)); worstCoarse = Math.max(worstCoarse, Math.abs(solveSpacers(g, own).error)); }
  check('backfocus: 0.1 and 0.2 mm shims reach every gap up to 90 mm exactly; without them the worst miss is 0.1 mm',
    worstFine < 1e-9 && near(worstCoarse, 0.1, 1e-9));
};
