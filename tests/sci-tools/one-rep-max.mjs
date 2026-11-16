// #T914 One-rep max. Hand arithmetic for 60 kg × 10 reps: Epley 60·(1 + 10/30) = 80; Brzycki 60·36/27 = 80;
// Lombardi 60·10^0.1 = 75.536; O'Connor 60·1.25 = 75; Wathan 6000/(48.8 + 53.8·e^-0.75) = 80.848;
// Mayhew 6000/(52.2 + 41.9·e^-0.55) = 78.560; Lander 6000/(101.3 − 26.7123) = 80.442. One rep returns the load.
import { epley, brzycki, lombardi, oconnor, wathan, mayhew, lander, weightForReps } from '../../src/lib/everyday/body.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) < t;
  check('1RM: Epley and Brzycki give 80 for 60 × 10', near(epley(60, 10), 80, 1e-9) && near(brzycki(60, 10), 80, 1e-9));
  check('1RM: Epley 100 × 5 = 116.667, Brzycki 100 × 5 = 112.5', near(epley(100, 5), 116.6667, 1e-4) && near(brzycki(100, 5), 112.5, 1e-9));
  check('1RM: Lombardi 75.536, O\'Connor 75', near(lombardi(60, 10), 75.536, 1e-3) && near(oconnor(60, 10), 75, 1e-9));
  check('1RM: Wathan 80.848, Mayhew 78.560, Lander 80.442', near(wathan(60, 10), 80.848, 2e-3) && near(mayhew(60, 10), 78.560, 2e-3) && near(lander(60, 10), 80.442, 2e-3));
  check('1RM: one rep is the load; Brzycki stops at 37 reps', epley(90, 1) === 90 && brzycki(90, 1) === 90 && Number.isNaN(brzycki(50, 37)));
  check('1RM: Epley turned round gives the load back', near(weightForReps(80, 10), 60, 1e-9));
};
