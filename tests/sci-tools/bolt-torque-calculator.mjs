// #642 bolt preload and torque: stress areas from the basic 60° thread profile (checked in NumPy against the
// geometry and the well-known M10 × 1.5 = 58.0 mm² and 1/2-13 UNC = 0.1419 in²), the pressure-cone member
// stiffness against SciPy numerical integration of dx/(E A(x)) and Shigley's closed form, and the torque split.
import * as B from '../../src/lib/sci/eng-bolt.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-6) => Math.abs(a - b) <= rel * Math.abs(b);
  check('bolt: M10 × 1.5 stress area 57.99 mm²', near(B.stressArea(10, 1.5), 57.98959, 1e-6));
  check('bolt: M24 × 3 stress area', near(B.stressArea(24, 3), 352.5039, 1e-6));
  check('bolt: 1/2-13 UNC stress area 0.1419 in²', near(B.stressArea(0.5, 1 / 13, 'un'), 0.1418996, 1e-6) && near(B.stressArea(0.5, 1 / 13, 'un'), 0.7854 * (0.5 - 0.9743 / 13) ** 2, 1e-4));
  check('bolt: 1/4-20 UNC stress area', near(B.stressArea(0.25, 1 / 20, 'un'), 0.03182126, 1e-6));
  check('bolt: pitch and minor diameters', near(B.pitchDia(10, 1.5), 9.0257, 1e-4) && near(B.minorDia(10, 1.5), 8.1597, 1e-4));
  check('bolt: T = K F d', B.torqueK(0.2, 26000, 10) === 52000);
  const t = B.torqueFriction(26090, 10, 1.5, 0.12, 0.12, 15, 11);
  check('bolt: long-form torque (NumPy 42893.34 N·mm, K 0.16441)', near(t.T, 42893.336, 1e-7) && near(t.K, 0.1644053, 1e-6) && near(t.pitch + t.thread + t.bearing, t.T, 1e-12));
  check('bolt: cone member stiffness vs SciPy integration', near(B.memberStiffness(200e3, 10, 30), 1870528.722, 1e-8) && near(B.frustumStiffness(70e3, 12, 18, 12), 1864761.056, 1e-8));
  check("bolt: cone stiffness vs Shigley's equal-member closed form", near(B.memberStiffness(200e3, 10, 30), 0.5774 * Math.PI * 200e3 * 10 / (2 * Math.log(5 * (0.5774 * 30 + 5) / (0.5774 * 30 + 25))), 1e-4));
  check('bolt: bolt stiffness, springs in series', near(B.boltStiffness(10, 58, 200e3, 10, 20), 1 / (10 / (Math.PI * 25 * 200e3) + 20 / (58 * 200e3)), 1e-12));
  const j = B.joint({ d: 10, P: 1.5, Sp: 600, frac: 0.75, E: 200e3, Em: 200e3, grip: 30, shank: 10, load: 10000 });
  check('bolt: preload 0.75 Sp As and 450 MPa', near(j.Fi, 0.75 * 600 * B.stressArea(10, 1.5), 1e-12) && near(j.preloadStress, 450, 1e-12));
  check('bolt: joint constant and bolt share', near(j.C, j.kb / (j.kb + j.km), 1e-12) && near(j.Fb, j.Fi + j.C * 10000, 1e-12) && near(j.Fm, j.Fi - (1 - j.C) * 10000, 1e-12));
  check('bolt: separation load Fi/(1 − C) and factors', near(j.P0, j.Fi / (1 - j.C), 1e-12) && near(j.nSep, j.P0 / 10000, 1e-12) && near(j.nProof, (600 * j.As - j.Fi) / (j.C * 10000), 1e-12));
  const s = B.joint({ d: 10, P: 1.5, Sp: 600, frac: 0.75, E: 200e3, Em: 200e3, grip: 30, shank: 10, load: 40000 });
  check('bolt: past separation the bolt takes all the load', s.separated && s.Fb === 40000 && s.Fm === 0);
  check('bolt: property class 8.8 → 800 / 640 MPa', JSON.stringify(B.propertyClass('8.8')) === '{"Rm":800,"Re":640}' && JSON.stringify(B.propertyClass('10.9')) === '{"Rm":1000,"Re":900}' && B.propertyClass('x') === null);
  let threw = false; try { B.joint({ d: 10, P: 6, Sp: 600, frac: 0.75, E: 1, Em: 1, grip: 1, shank: 0, load: 0 }); } catch { threw = true; }
  check('bolt: rejects a pitch over half the diameter', threw);
};
