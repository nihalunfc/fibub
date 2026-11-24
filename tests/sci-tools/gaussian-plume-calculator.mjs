// #118 Gaussian plume. New with the orphaned-well methane article: a low (1.2 m) open-country source, 2.5 g/s, 6.6 m/s wind,
// class B and D at 22.5 m, checked against the hand formula Q / (2 pi u sy sz) x [exp(-(z-H)^2/2sz^2) + exp(-(z+H)^2/2sz^2)]
// with the Briggs open-country spreads written out by hand.
import { conc } from '../../src/lib/sci/plume.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const hand = (Q, u, H, z, x, ky, kz, ay, az) => {
    const sy = (ky * x) / Math.sqrt(1 + ay * x), sz = az === null ? kz * x : (kz * x) / Math.sqrt(1 + az * x);
    return (Q / (2 * Math.PI * u * sy * sz)) * (Math.exp(-((z - H) ** 2) / (2 * sz * sz)) + Math.exp(-((z + H) ** 2) / (2 * sz * sz)));
  };
  const B = { Q: 2.5, u: 6.6, H: 1.2, cls: 'B', terrain: 'rural' }, D = { ...B, cls: 'D' };
  const hB = hand(2.5, 6.6, 1.2, 1.6, 22.5, 0.16, 0.12, 0.0001, null);
  const hD = hand(2.5, 6.6, 1.2, 1.6, 22.5, 0.08, 0.06, 0.0001, 0.0015);
  check('plume: class B at 22.5 m, 1.6 m receptor = hand formula, 9,768 µg/m³', near(conc(B, 22.5, 0, 1.6), hB, 1e-12) && near(conc(B, 22.5, 0, 1.6) * 1e6, 9768.13, 1e-6));
  check('plume: class D at 22.5 m = hand formula, 26,865 µg/m³, 2.75 times class B', near(conc(D, 22.5, 0, 1.6), hD, 1e-12) && near(conc(D, 22.5, 0, 1.6) * 1e6, 26865.42, 1e-6) && near(conc(D, 22.5, 0, 1.6) / conc(B, 22.5, 0, 1.6), 2.7504, 1e-3));
  check('plume: a source at 1.2 m gives more at the ground than at 1.6 m, and class D at 47 m is 9,312 µg/m³', conc(B, 22.5, 0, 0) > conc(B, 22.5, 0, 1.6) && near(conc(D, 47, 0, 1.6) * 1e6, 9312.02, 1e-6));
};
