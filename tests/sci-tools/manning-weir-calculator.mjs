// Manning weir (src/lib/sci/openchannel.ts). The SciPy checks live in tests/sci.mjs; these pin the numbers in the
// discovery article on the Valencia flash flood of 29 October 2024 (Muñoz et al. 2025, Water 17: 3177).
import { manningQ, flowAt, broadWeir } from '../../src/lib/sci/openchannel.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t, s = { kind: 'rect', b: 55.14 };
  const Q = manningQ(s, 10.94, 0.0569, 0.0012), f = flowAt(s, 10.94, Q, 0.0012);
  check('channel: Huerto Mulet stand-in (55.14 × 10.94 m, n 0.0569, S 0.0012) carries 1448 m³/s at 2.40 m/s, Fr 0.232', near(Q, 1448.4, 0.5) && near(f.V, 2.401, 0.001) && near(f.R, 7.832, 0.001) && near(f.Fr, 0.2318, 0.0005) && near(f.tau, 92.17, 0.05));
  check('channel: the same section with n 0.018 carries about 4580 m³/s (three times the paper peak)', near(manningQ(s, 10.94, 0.018, 0.0012), 4578.6, 3));
  check('weir: broad-crested, L 154.4 m, Cd 0.95: 3225 m³/s at 5.5 m and 2387 at 4.5 m', near(broadWeir(154.4, 5.5), 3225.1, 0.5) && near(broadWeir(154.4, 4.5), 2386.8, 0.5));
};
