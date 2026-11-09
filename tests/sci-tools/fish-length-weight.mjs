// #331 Fish length-weight. References from Python (scratch script): scipy.stats.linregress on log10 values,
// statsmodels OLS t_test('x1 = 3') for the isometry test, scipy.stats.t for the interval, and NumPy for the
// bias correction, Fulton's K and Le Cren's Kn. 20 made-up fish (cm, g).
import { fitLW, fulton, relCondition } from '../../src/lib/sci/fishlw.ts';
const rel = (a, b, tol) => Math.abs(a / b - 1) < tol;
const L = [10.8, 19.0, 21.2, 8.6, 11.3, 28.4, 9.5, 10.9, 28.9, 21.7, 16.1, 19.3, 22.6, 14.1, 11.0, 25.3, 22.7, 19.3, 26.0, 20.1];
const W = [15.9, 87.2, 137.0, 8.0, 17.2, 313.6, 11.0, 16.1, 317.7, 144.1, 60.5, 98.8, 155.8, 39.0, 18.5, 226.6, 170.7, 106.7, 247.8, 108.2];
export default async (check) => {
  const f = fitLW(L, W, false);
  check('fish LW: a, b, SE(b), R², residual SD match scipy linregress', rel(f.a, 0.010490274980213744, 1e-10) && rel(f.b, 3.0891958984415115, 1e-12) && rel(f.seB, 0.030620113353206403, 1e-9) && rel(f.r2, 0.998234662120347, 1e-12) && rel(f.s, 0.022362829178618475, 1e-10));
  check('fish LW: 95 % interval for b matches scipy t', rel(f.bLo, 3.024865427423081, 1e-9) && rel(f.bHi, 3.153526369459942, 1e-9));
  check('fish LW: t test of b = 3 matches statsmodels (t 2.913, p 0.00928)', rel(f.t3, 2.912983940085831, 1e-9) && rel(f.p3, 0.009281315193969979, 1e-6) && f.growth === 'positive allometric');
  const g = fitLW(L, W, true);
  check('fish LW: bias correction factor and corrected a', rel(g.cf, 1.0013266085280006, 1e-12) && rel(g.a, 0.010504191468463568, 1e-10));
  const K = L.map((l, i) => fulton(l, W[i])), Kn = L.map((l, i) => relCondition(l, W[i], f.a, f.b)), KnC = L.map((l, i) => relCondition(l, W[i], g.a, g.b));
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  check("fish LW: Fulton's K per fish and mean", rel(K[0], 1.2621932632220696, 1e-12) && rel(K[2], 1.4378480221928172, 1e-12) && rel(mean(K), 1.3541419543971887, 1e-12));
  check('fish LW: Kn per fish and mean (uncorrected and corrected a)', rel(Kn[1], 0.9319856668073052, 1e-9) && rel(mean(Kn), 1.0011938793942337, 1e-9) && rel(mean(KnC), 0.9998674467125543, 1e-9));
  check('fish LW: exact cube law gives isometry', fitLW([10, 20, 30, 40], [10, 80.5, 269, 641], false).growth === 'isometric');
};
