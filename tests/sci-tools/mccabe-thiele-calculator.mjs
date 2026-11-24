// McCabe-Thiele calculator: Fenske minimum stages and total-reflux stepping. Exact cases are closed forms;
// the isotope case uses numbers stated in Agnes et al. (2021), Eur. Phys. J. C 81: 359 (ln alpha and the 1727 stages).
import { alphaEq, fenske, stepStages } from '../../src/lib/sci/mccabe.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('mccabe: Fenske with alpha = 2 and a separation factor of 4 is exactly 2 stages', near(fenske(0.5, 0.2, 2), 2, 1e-12));
  check('mccabe: Fenske with no separation (S = 1) is 0 stages', near(fenske(0.5, 0.5, 2), 0, 1e-12));
  const st = stepStages(alphaEq(2), { xF: 0.4, xD: 0.5, xB: 0.2, q: 1, R: Infinity });
  check('mccabe: total reflux stepping at alpha = 2, S = 4 takes 2 stages', st.N === 2 && near(st.frac, 2, 1e-9));
  const la = 1.333e-3, a = Math.exp(la), xB = 1 / 11;
  check('mccabe: isotope pair, ln alpha = 1.333e-3 and S = 10 gives 1727.4 stages (paper: 1727)', near(fenske(0.5, xB, a), 1727.3706624, 1e-6));
  check('mccabe: 2870 stages at that alpha reach S = 45.87', near(Math.exp(la * 2870), 45.8653532, 1e-6));
  const big = stepStages(alphaEq(a), { xF: 0.2, xD: 0.5, xB: xB, q: 1, R: Infinity }, 6000);
  check('mccabe: stepping the isotope case takes 1728 stages, fractional 1727.37', big.N === 1728 && near(big.frac, 1727.37079, 1e-4));
  // The default cap was 300, which stopped every isotope case; it is 5000 now, so the page itself solves this column.
  const dflt = stepStages(alphaEq(a), { xF: 0.2, xD: 0.5, xB: xB, q: 1, R: Infinity });
  check('mccabe: the default cap now lets the isotope case through, 1728 stages', dflt.N === 1728);
  let capped = false; try { stepStages(alphaEq(a), { xF: 0.2, xD: 0.5, xB: xB, q: 1, R: Infinity }, 300); } catch (e) { capped = /More than 300 stages/.test(e.message); }
  check('mccabe: a lower cap still stops with a clear message', capped);
  const t = stepStages(alphaEq(1.01342), { xF: 0.2, xD: 0.5, xB: 0.090909, q: 1, R: Infinity });
  check('mccabe: alpha 1.01342, xD 0.5, xB 0.090909 at total reflux: 173 stages, 172.73 minimum', t.N === 173 && near(fenske(0.5, 0.090909, 1.01342), 172.73, 0.005));
};
