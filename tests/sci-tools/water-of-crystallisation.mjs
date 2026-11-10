// #1294 Water of crystallisation. Molar masses from IUPAC standard atomic weights checked against hand sums
// (CuSO₄·5H₂O 249.68, Na₂CO₃·10H₂O 286.14, FeSO₄·7H₂O 278.01); % water in blue vitriol 36.07%; x recovered from
// textbook-style weighings (2.50 g CuSO₄·5H₂O → 1.60 g dry gives x ≈ 5.00); the heating model levels off at the
// dry mass.
import { molar, WATER, SALTS, anhydrousMass, hydratedMass, percentWater, findX, heatRun } from '../../src/lib/sci/hydrate-school.ts';

export default async (check) => {
  const near = (a, b, t = 0.005) => Math.abs(a - b) <= t;
  const S = Object.fromEntries(SALTS.map((s) => [s.id, s]));
  check('water 18.015', near(WATER, 18.015, 1e-9));
  check('CuSO₄ 159.60, CuSO₄·5H₂O 249.68', near(anhydrousMass(S.cuso4), 159.602) && near(hydratedMass(S.cuso4), 249.677));
  check('Na₂CO₃·10H₂O 286.14', near(hydratedMass(S.na2co3), 286.138));
  check('FeSO₄·7H₂O 278.01', near(hydratedMass(S.feso4), 278.006));
  check('% water in CuSO₄·5H₂O 36.08%', near(percentWater(S.cuso4), 36.077, 0.01));
  const r = findX(2.5, 1.6, anhydrousMass(S.cuso4));
  check('x from 2.50 g → 1.60 g is about 4.98', r && near(r.water, 0.9, 1e-9) && near(r.x, 4.983, 0.002));
  const exact = 2 * anhydrousMass(S.cuso4) / hydratedMass(S.cuso4);
  check('exact masses give exactly x = 5', near(findX(2, exact, anhydrousMass(S.cuso4)).x, 5, 1e-9));
  check('bad weighings refused', findX(1, 2, 100) === null && findX(0, 0, 100) === null && findX(2, 1, 0) === null);
  const run = heatRun(S.cuso4, 2.5, 8), dry = 2.5 * anhydrousMass(S.cuso4) / hydratedMass(S.cuso4);
  check('heating run falls and levels off at the dry mass', run.every((m, i) => i === 0 || m < run[i - 1]) && near(run[7], dry, 0.001) && run[0] < 2.5);
  check('molar sums', near(molar({ Ca: 1, S: 1, O: 4 }), 136.134, 1e-6) && SALTS.every((s) => percentWater(s) > 0 && percentWater(s) < 70));
};
