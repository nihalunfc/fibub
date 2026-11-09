// #1105 Newman projection spinner. The butane cosine-series coefficients were solved by hand (a0 = 9.7667,
// a1 = 2.2667, a2 = −0.2667, a3 = 7.2333 kJ/mol from the four rounded teaching values); the curve passes through
// anti 0, gauche 3.8, eclipsed 16 and fully eclipsed 19 kJ/mol; ethane is 12.5 × (1 + cos 3φ)/2. The anti share at
// 298.15 K (Boltzmann, 1 anti + 2 gauche wells) is about 70 %, as quoted in textbooks.
import { energy, butaneCoeffs, nameAt, antiShare, norm } from '../../src/lib/sci/conformation.ts';

export default async (check) => {
  const c = butaneCoeffs(), close = (a, b, t = 1e-3) => Math.abs(a - b) < t;
  check('conf: butane coefficients solved by hand', close(c[0], 9.76667) && close(c[1], 2.26667) && close(c[2], -0.26667) && close(c[3], 7.23333));
  check('conf: butane values', close(energy('butane', 180), 0) && close(energy('butane', 60), 3.8) && close(energy('butane', 300), 3.8) && close(energy('butane', 120), 16) && close(energy('butane', 240), 16) && close(energy('butane', 0), 19));
  check('conf: ethane barrier 12.5, staggered 0', close(energy('ethane', 0), 12.5) && close(energy('ethane', 60), 0) && close(energy('ethane', 120), 12.5) && close(energy('ethane', 30), 6.25));
  let min = 99; for (let p = 0; p < 360; p += 0.5) min = Math.min(min, energy('butane', p));
  check('conf: butane minimum is anti (0)', close(min, 0, 1e-6));
  check('conf: names', nameAt('ethane', 60) === 'staggered' && nameAt('ethane', 240) === 'eclipsed' && nameAt('ethane', 45) === 'skew (in between)' && nameAt('butane', 180) === 'anti (staggered)' && nameAt('butane', -60) === 'gauche (staggered)' && nameAt('butane', 360) === 'fully eclipsed (syn)' && nameAt('butane', 120) === 'eclipsed');
  check('conf: anti share at 25 °C about 70 %', close(antiShare(298.15), 0.6984, 1e-3) && antiShare(1000) < antiShare(200));
  check('conf: angle wrap', norm(-60) === 300 && norm(420) === 60);
};
