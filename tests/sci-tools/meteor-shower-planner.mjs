// #T50 Meteor shower planner: the IMO rate HR = ZHR × sin(h) / r^(6.5 − LM) in src/lib/sci/meteorrate.ts.
// New with the λ-Sculptorids article (A&A 682, L20, 2024): ZHR 0.65, r = 3.0, worked by hand.
import { hourlyRate } from '../../src/lib/sci/meteorrate.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('meteors: ZHR 0.65, r 3, LM 6.0, radiant 45°: 0.65 × 0.70711 / √3 = 0.26536', near(hourlyRate(0.65, 3, 6, 45), 0.65 * Math.SQRT1_2 / Math.sqrt(3)) && near(hourlyRate(0.65, 3, 6, 45), 0.265361, 1e-5));
  check('meteors: radiant overhead under a perfect sky gives the ZHR itself', near(hourlyRate(0.65, 3, 6.5, 90), 0.65));
  check('meteors: LM 5.42 with r 3 cuts the rate 3.276 times', near(hourlyRate(0.65, 3, 6.5, 90) / hourlyRate(0.65, 3, 5.42, 90), 3 ** 1.08) && near(3 ** 1.08, 3.27560, 1e-5));
  check('meteors: rate scales with ZHR (forecast 10 against 0.65)', near(hourlyRate(10, 3, 6, 44.8) / hourlyRate(0.65, 3, 6, 44.8), 10 / 0.65));
};
