// #1397 Calvin cycle and C4 comparer. Checked by hand: 6 CO₂ → 12 PGA, 18 ATP, 12 NADPH, 1 glucose;
// 25 °C, 420 ppm: C3 φ = 80/294 = 0.27211, lost 13.605 %, ATP (3 + 0.95238)/(0.86395) = 4.5748, NADPH 2.9449;
// C4 φ = 80/4200, ATP 5.1154; 40 °C: Γ* = 40 × 1.05^15 = 83.157, C3 ATP 6.9440. Crossover found by bisection
// and checked to make the two costs equal.
import * as K from '../../src/lib/sci/calvin-c4.ts';
const near = (a, b, e = 1e-4) => Math.abs(a - b) <= e;
export default async (check) => {
  const c = K.calvin(6);
  check('calvin: 6 CO₂ → 12 PGA, 18 ATP, 12 NADPH, 1 glucose', c.pga === 12 && c.atp === 18 && c.nadph === 12 && c.glucose === 1 && c.atpReduce === 12 && c.atpRegen === 6 && near(c.g3pOut, 2) && near(c.g3pBack, 10));
  check('calvin: linear in n', [1, 5, 18].every((n) => K.calvin(n).atp === 3 * n && K.calvin(n).nadph === 2 * n));
  const a = K.pathway('C3', 25, 420), b = K.pathway('C4', 25, 420);
  check('calvin: C3 at 25 °C, 420 ppm', a.C === 294 && near(a.phi, 0.27211) && near(a.lost, 13.6054) && near(a.atp, 4.5748) && near(a.nadph, 2.9449));
  check('calvin: C4 at 25 °C, 420 ppm', b.C === 4200 && near(b.atp, 5.1154) && near(b.lost, 0.95238));
  check('calvin: Γ* at 40 °C = 83.157 ppm, C3 ATP 6.9440', near(K.gammaStar(40), 83.1571) && near(K.pathway('C3', 40, 420).atp, 6.9440));
  const x = K.crossover(420);
  check('calvin: crossover 30.39 °C where costs match', near(x, 30.391, 1e-3) && near(K.pathway('C3', x, 420).atp, K.pathway('C4', x, 420).atp, 1e-6));
  check('calvin: more CO₂ moves the crossover up', K.crossover(800) > x + 10);
  check('calvin: with no photorespiration C3 = 3 ATP, C4 = 5 ATP', near(K.pathway('C3', 25, 1e12).atp, 3, 1e-6) && near(K.pathway('C4', 25, 1e12).atp, 5, 1e-6));
};
