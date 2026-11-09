// #644 spring designer: rates against a NumPy/SciPy Castigliano (strain energy) integration along the wire, Wahl
// factors against the usual quoted values (C = 6, 8, 10 → 1.2525, 1.1840, 1.1448), and hand-worked stresses.
import * as S from '../../src/lib/sci/eng-spring.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-9) => Math.abs(a - b) <= rel * Math.abs(b);
  check('spring: rate G d⁴/8D³Na equals Castigliano (2.46875 N/mm)', near(S.rate(79000, 2, 20, 8), 2.46875));
  check('spring: Wahl factors', near(S.wahl(6), 1.2525) && near(S.wahl(8), 1.18401786, 1e-8) && near(S.wahl(10), 1.14483333, 1e-8));
  check('spring: Bergsträsser close to Wahl', Math.abs(S.bergstrasser(8) / S.wahl(8) - 1) < 0.01 && near(S.bergstrasser(10), 42 / 37));
  check('spring: end types', JSON.stringify([S.endCoils('plain', 8, 2), S.endCoils('plain-ground', 8, 2), S.endCoils('squared', 8, 2), S.endCoils('squared-ground', 8, 2)]) === JSON.stringify([{ Nt: 8, Ls: 18 }, { Nt: 9, Ls: 18 }, { Nt: 10, Ls: 22 }, { Nt: 10, Ls: 20 }]));
  const c = S.compression({ d: 2, D: 20, Na: 8, G: 79000, ends: 'squared-ground', L0: 50, F: 30, tauAllow: 600, alpha: 0.5, rho: 7850 });
  check('spring: compression deflection, stress τ = Kw 8FD/πd³', near(c.y, 30 / 2.46875) && near(c.tau, 1.14483333333 * 8 * 30 * 20 / (Math.PI * 8), 1e-10));
  check('spring: force and stress at solid', near(c.Fs, 2.46875 * 30) && near(c.tauS, S.wahl(10) * 8 * c.Fs * 20 / (Math.PI * 8)) && near(c.nSolid, 600 / c.tauS));
  check('spring: buckling limit 2.63D/α and surge (NumPy 223.133 Hz)', near(c.Lcrit, 105.2) && c.stable && near(c.fn, 223.13303283414538, 1e-10));
  check('spring: pitch of squared-ground ends', near(c.pitch, (50 - 4) / 8));
  check('spring: compression by deflection', near(S.compression({ d: 2, D: 20, Na: 8, G: 79000, ends: 'plain', L0: 50, y: 10, tauAllow: 600, alpha: 0.5, rho: 7850 }).F, 24.6875));
  const e = S.extension({ d: 1.5, D: 12, Nb: 20, G: 79000, E: 200000, Fi: 5, F: 25, r2: 3, tauAllow: 600, sigmaAllow: 1000, rho: 7850 });
  check('spring: extension active coils Nb + G/E and rate', near(e.Na, 20.395) && near(e.k, 79000 * 1.5 ** 4 / (8 * 12 ** 3 * 20.395)) && near(e.y, 20 / e.k));
  check('spring: hook bending at A, (4C²−C−1)/4C(C−1)', near(e.KA, (256 - 8 - 1) / (32 * 7)) && near(e.sigmaA, 25 * (e.KA * 16 * 12 / (Math.PI * 1.5 ** 3) + 4 / (Math.PI * 2.25))));
  check('spring: hook torsion at B with C2 = 2r2/d = 4', near(e.KBh, 1.25) && near(e.tauB, 1.25 * 8 * 25 * 12 / (Math.PI * 1.5 ** 3)));
  const t = S.torsion({ d: 2, D: 16, Nb: 6, E: 200000, l1: 20, l2: 25, M: 500, sigmaAllow: 1200 });
  check('spring: torsion rate per radian vs Castigliano with legs (NumPy 496.157 N·mm/rad)', near(t.kRad, 496.1565318962639, 1e-10));
  check('spring: torsion 10.8 form, angle and stress', near(t.kTurn, 16 * 200000 / (10.8 * 16 * t.Na)) && near(t.deg, 360 * 500 / t.kTurn) && near(t.sigma, S.kInner(8) * 32 * 500 / (Math.PI * 8)));
  check('spring: coil diameter tightens under load', t.Dp < 16 && near(t.Dp, 16 * 6 / (6 + t.turns)));
  let threw = 0;
  try { S.compression({ d: 2, D: 20, Na: 8, G: 79000, ends: 'plain', L0: 10, F: 1, tauAllow: 1, alpha: 1, rho: 1 }); } catch { threw++; }
  try { S.extension({ d: 1, D: 10, Nb: 5, G: 1, E: 1, Fi: 10, F: 5, r2: 2, tauAllow: 1, sigmaAllow: 1, rho: 1 }); } catch { threw++; }
  check('spring: rejects free length below solid and force below initial tension', threw === 2);
};
