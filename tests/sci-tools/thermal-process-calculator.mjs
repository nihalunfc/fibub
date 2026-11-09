// #393 Thermal processing F-value calculator. Expected values from numpy polyfit and numpy/scipy trapezoid (scratch tp.py).
import { dValue, zValue, fNeeded, lethalRate, fProfile } from '../../src/lib/sci/thermproc.ts';
export default async (check) => {
  const near = (a, b, t = 1e-7) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const d = dValue([[0, 1e6], [2, 2.1e5], [4, 4.4e4], [6, 9e3], [8, 2e3]].map(([t, N]) => ({ t, N })));
  check('thermal: D-value matches numpy polyfit', near(d.D, 2.9559926037) && near(d.logN0, 5.997372254) && near(d.fit.r2, 0.99993701361));
  check('thermal: two counts give an exact D', near(dValue([{ t: 0, N: 1e6 }, { t: 5, N: 1e4 }]).D, 2.5));
  const z = zValue([[110, 20], [115, 6.5], [120, 2], [125, 0.62]].map(([T, D]) => ({ T, D })));
  check('thermal: z-value matches numpy polyfit', near(z.z, 9.9249706372) && near(z.fit.r2, 0.99988829475) && near(z.dAt(121.1), 1.5456806967));
  check('thermal: F for 12 log reductions', near(fNeeded(z.dAt(121.1), 3, -9), 18.548168360));
  check('thermal: lethal rate', lethalRate(121.1, 121.1, 10) === 1 && near(lethalRate(111.1, 121.1, 10), 0.1) && near(lethalRate(131.1, 121.1, 10), 10));
  const tt = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60], TT = [40, 70, 95, 110, 117, 120, 121, 121.5, 121.5, 121, 110, 90, 60];
  const p = fProfile(tt.map((t, i) => ({ t, T: TT[i] })), 121.1, 10);
  check('thermal: F0 by trapezoid matches numpy', near(p.total, 27.356058148) && near(p.F[6], 8.6699903) && near(p.F[9], 24.52095836) && p.peak === 121.5 && p.peakAt === 35);
  check('thermal: other Tref and z', near(fProfile(tt.map((t, i) => ({ t, T: TT[i] })), 120, 8).total, 36.409944926));
  check('thermal: constant temperature at Tref gives F = time', near(fProfile([{ t: 0, T: 121.1 }, { t: 7, T: 121.1 }], 121.1, 10).total, 7));
  let e = ''; try { fProfile([{ t: 0, T: 100 }, { t: 0, T: 110 }], 121.1, 10); } catch (x) { e = x.message; } check('thermal: times must increase', e.includes('Times must increase'));
  e = ''; try { dValue([{ t: 0, N: 100 }, { t: 2, N: 0 }]); } catch (x) { e = x.message; } check('thermal: zero count refused', e.includes('more than 0'));
  e = ''; try { dValue([{ t: 0, N: 100 }, { t: 2, N: 200 }]); } catch (x) { e = x.message; } check('thermal: rising counts refused', e.includes('do not fall'));
  e = ''; try { zValue([{ T: 110, D: 1 }, { T: 120, D: 2 }]); } catch (x) { e = x.message; } check('thermal: rising D refused', e.includes('no z-value'));
};
