// #1458 decomposition. Rate constants, mass left after 3 years (scipy.integrate.solve_ivp on dM/dt = −kM,
// rtol 1e-12) and half-lives checked against a separate Python version for four places and litters.
import * as D from '../../src/lib/sci/decomp-r.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const PY = [[[27, 0.7, 'soft'], 1.1746274023277132, 2.948474680004504, 0.5900996172797967], [[12, 0.6, 'tough'], 0.21930814701618356, 51.79252039598214, 3.1606084406376174], [[0, 0.55, 'wood'], 0.02445770619781299, 92.9254043371943, 28.340645478108105], [[30, 0.12, 'soft'], 0.042531731720355716, 88.02096201492701, 16.29717748426887]];
  for (const [[T, w, l], k, m3, hl] of PY) {
    const kk = D.rate(T, w, l);
    check(`decomp: ${T} °C, moisture ${w}, ${l}: k, 3-year mass and half-life match Python`, near(kk, k) && near(100 * D.left(kk, 3), m3, 1e-9) && near(D.halfLife(kk), hl));
  }
  check('decomp: Q10 = 2 doubles the rate for 10 °C', near(D.fTemp(35) / D.fTemp(25), 2) && near(D.fTemp(15), 0.5));
  check('decomp: frozen soil stops decomposition', D.rate(-10, 0.6, 'soft') === 0 && D.halfLife(0) === Infinity);
  check('decomp: moisture best at 0.6, slower when dry or waterlogged', D.fMoist(0.6) === 1 && D.fMoist(0.1) < 0.1 && D.fMoist(0.97) < 0.15);
  check('decomp: 95 % gone after ln 20 / k', near(D.left(0.5, D.t95(0.5)), 0.05));
};
