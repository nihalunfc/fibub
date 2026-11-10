// #1288 Mid-point theorem. Checked against Python (math.dist, shoelace formula) for the guide's example shapes and
// for random triangles and quadrilaterals on the page's grid (midpoint-theorem.ref.json).
import { readFileSync } from 'node:fs';
import { midpointTheorem, converse, varignon, lineAngle } from '../../src/lib/sci/midpoint-l2.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) < t;
  const m = midpointTheorem([6, 2], [2, 12], [15, 11]);
  check('midpoint: example D(4,7), E(10.5,6.5), DE = √42.5, BC = √170', m.D.join() === '4,7' && m.E.join() === '10.5,6.5' && near(m.DE, Math.sqrt(42.5)) && near(m.BC, Math.sqrt(170)));
  check('midpoint: example ∠ADE = ∠ABC = 63.80°, DE ∥ BC', near(m.ADE, m.ABC, 1e-9) && near(m.ADE, 63.7998851586, 1e-6) && m.angle < 1e-9);
  const c = converse([6, 2], [2, 12], [15, 11]);
  check('converse: F is the mid-point of AC', near(c.t, 0.5) && near(c.AF, c.FC) && near(c.F[0], 10.5) && near(c.F[1], 6.5));
  const v = varignon([3, 3], [2, 12], [14, 11], [12, 2]);
  check('varignon: example perimeter = AC + BD ≈ 27.74, area 47.5 = half of 95', near(v.perimeter, v.AC + v.BD) && near(v.perimeter, 27.7436061324, 1e-6) && near(v.area, 47.5) && near(v.quadArea, 95));
  check('varignon: opposite sides equal and parallel', near(v.PQ, v.RS) && near(v.QR, v.SP) && lineAngle(v.pts[0], v.pts[1], v.pts[3], v.pts[2]) < 1e-9);
  check('lineAngle: perpendicular lines give 90°, parallel 0°', near(lineAngle([0, 0], [1, 0], [0, 0], [0, 1]), 90) && near(lineAngle([0, 0], [1, 1], [5, 0], [3, -2]), 0));
  const ref = JSON.parse(readFileSync(new URL('./midpoint-theorem.ref.json', import.meta.url), 'utf8'));
  let okT = 0, okQ = 0;
  for (const r of ref.T) { const x = midpointTheorem(r.A, r.B, r.C), y = converse(r.A, r.B, r.C); if (near(x.DE, r.DE) && near(x.BC, r.BC) && near(2 * x.DE, x.BC) && x.angle < 1e-6 && near(x.ADE, x.ABC, 1e-6) && near(y.t, 0.5, 1e-9)) okT++; }
  for (const r of ref.Q) { const x = varignon(...r.P); if (near(x.perimeter, r.per) && near(x.area, r.area) && near(x.area, x.quadArea / 2)) okQ++; }
  check(`random triangles match Python and the theorem (${okT}/${ref.T.length})`, okT === ref.T.length);
  check(`random quadrilaterals match Python and Varignon (${okQ}/${ref.Q.length})`, okQ === ref.Q.length);
};
