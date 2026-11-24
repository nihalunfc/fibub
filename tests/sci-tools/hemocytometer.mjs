// #T hemocytometer: improved Neubauer chamber (0.1 uL per large square) and the seeding volumes, worked by hand.
// Added with the stem-cell seed-train article: 40, 41, 39, 42 live cells in 4 squares at a factor of 20 is 8.1e6 cells/mL;
// 7.5e7 cells for 150 mL from that suspension is 9.259 mL of suspension and 140.741 mL of medium.
import { cellCount, seeding, SQUARE_ML } from '../../src/lib/sci/cells.ts';
import { twoPoint } from '../../src/lib/sci/doubling.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('hemocytometer: one large square is 0.1 uL', near(SQUARE_ML, 1e-4));
  const c = cellCount([40, 41, 39, 42], [1, 0, 1, 1], 20);
  check('hemocytometer: 40,41,39,42 live at x20 is 8.1e6 cells/mL, 165 cells counted, 98.2 % live', near(c.liveMl, 8.1e6) && c.counted === 165 && near(c.viability, 162 / 165) && near(c.totalMl, 8.25e6));
  check('hemocytometer: Poisson error 1/sqrt(162) = 7.86 %', near(c.poissonRel, 1 / Math.sqrt(162)) && near(c.poissonRel, 0.0786, 1e-3));
  const s = seeding(8.1e6, 5e5 * 150, 1, 150, 0);
  check('hemocytometer: 7.5e7 cells in 150 mL = 9.259 mL suspension + 140.741 mL medium', near(s.suspensionMl, 75e6 / 8.1e6) && near(s.mediumMl, 150 - 75e6 / 8.1e6) && near(s.targetConc, 5e5));
  const v = seeding(4e6, 7.5e7, 1, 150, 0), w = seeding(0.8e6, 7.5e7, 1, 150, 0);
  check('hemocytometer: thawed vials at 4e6 and 0.8e6 live/mL need 18.75 and 93.75 mL', near(v.suspensionMl, 18.75) && near(w.suspensionMl, 93.75));
  const sp = seeding(1e6, 1e5, 24, 0.5, 10);
  check('hemocytometer: 10 % spare scales cells and medium', near(sp.totalCells, 1e5 * 24 * 1.1) && near(sp.totalMl, 0.5 * 24 * 1.1) && near(sp.suspensionMl, 2.64));
  let err = ''; try { seeding(1e5, 1e6, 1, 1); } catch (e) { err = e.message; }
  check('hemocytometer: a wanted density above the suspension is refused', /more than the suspension has/.test(err));
  check('doubling: 5e5 to 8.1e6 in 96 h is 23.9 h', near(twoPoint(0, 5e5, 96, 8.1e6), 96 * Math.LN2 / Math.log(16.2)) && near(twoPoint(0, 5e5, 96, 8.1e6), 23.9, 2e-3));
};
