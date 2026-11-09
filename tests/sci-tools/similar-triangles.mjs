// #1159 Similar triangles. BPT checked on random triangles (AD/DB = AE/EC and DE ∥ BC by cross product), the
// cosine-rule angles against Python math.acos for a 3-4-5 and 5-6-7 triangle, and the tests on scaled copies.
import { triangle, bpt, sss, aa, sas, shadowHeight, anglesFromSides } from '../../src/lib/sci/similar-school.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  const T = triangle([0, 0], [4, 0], [0, 3]);
  check('triangle: 3-4-5 right angle at A, B = 36.87°', near(T.a, 5) && near(T.angA, 90) && near(T.angB, 36.86989764584402) && near(T.angA + T.angB + T.angC, 180));
  // Python: degrees(acos((6²+7²−5²)/(2·6·7))) = 44.415308597192976
  check('angles: 5-6-7 triangle matches Python', near(anglesFromSides(5, 6, 7)[0], 44.415308597192976) && Number.isNaN(anglesFromSides(1, 2, 3)[0]) && Number.isNaN(anglesFromSides(0, 2, 2)[0]));
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const R = () => [Math.random() * 10, Math.random() * 10];
    const A = R(), B = R(), C = R(), t = 0.05 + Math.random() * 0.9;
    const b = bpt(A, B, C, t);
    const cross = (b.E[0] - b.D[0]) * (C[1] - B[1]) - (b.E[1] - b.D[1]) * (C[0] - B[0]);
    if (!near(b.r1, b.r2, 1e-7) || !near(b.r1, t / (1 - t), 1e-7) || Math.abs(cross) > 1e-9 * (b.DE * b.BC + 1) || !near(b.DE / b.BC, t, 1e-7)) ok = false;
  }
  check('BPT: 300 random triangles: AD/DB = AE/EC = t/(1 − t), DE ∥ BC, DE/BC = t', ok);
  const s = sss([3, 4, 5], [10, 6, 8]);
  check('SSS: 3-4-5 and 6-8-10 similar with k = 0.5; 3-4-5 vs 3-4-6 not', s.similar && near(s.k, 0.5) && !sss([3, 4, 5], [3, 4, 6]).similar);
  check('AA: 50°, 60° vs 70°, 50° similar; vs 50°, 65° not; invalid angles', aa([50, 60], [70, 50]).similar && !aa([50, 60], [50, 65]).similar && !aa([100, 90], [100, 90]).valid);
  check('SAS: 4, 6 at 40° vs 6, 9 at 40° similar; at 45° not', sas(4, 6, 40, 6, 9, 40).similar && !sas(4, 6, 40, 6, 9, 45).similar && !sas(4, 6, 40, 6, 10, 40).similar);
  check('shadow: 1.5 m stick, 2 m shadow; 12 m shadow → 9 m', near(shadowHeight(1.5, 2, 12), 9));
};
