// #341 yield per recruit and surplus production. YPR checked against SciPy numerical integration of the cohort
// (scipy.integrate.quad of F·N(t)·W(t)), Fmax/F0.1 against scipy.optimize (bounded minimise and brentq), and the
// Schaefer and Fox fits against scipy.optimize.minimize (Nelder-Mead, 16 starts) on the same likelihood. Made-up data.
import { ypr, refPoints, msy, fitProduction, project } from '../../src/lib/sci/ypr.ts';
export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const p = { M: 0.3, K: 0.25, t0: -0.5, Winf: 2500, tr: 1, tc: 3, tl: 15 };
  check('yield per recruit: Beverton-Holt formula equals numerical integration', near(ypr(0.5, p), 283.4381680849346) && near(ypr(0.2, p), 217.10083764661468) && near(ypr(0.5, { ...p, tc: 5 }), 250.10382741186993));
  check('yield per recruit: infinite lifespan', near(ypr(0.5, { ...p, tl: Infinity }), 283.493537463033));
  const rp = refPoints(p);
  check('yield per recruit: Fmax and F0.1', near(rp.Fmax, 1.0743668353910227, 1e-5) && near(rp.yMax, 297.3907983557577) && near(rp.F01, 0.3318174867401941, 1e-5) && near(rp.y01, 260.39019139439284, 1e-6));
  check('surplus production: MSY formulas', near(msy('schaefer', 0.4, 1000).MSY, 100) && near(msy('fox', 0.4, 1000).BMSY, 1000 / Math.E) && msy('fox', 0.4, 1000).FMSY === 0.4);
  const C = [200, 300, 450, 600, 800, 1000, 1100, 1200, 1250, 1200, 1150, 1000, 900, 800, 700, 650, 600, 600, 550, 550];
  const I = [5.095, 4.65, 4.595, 3.639, 5.36, 4.781, 3.887, 4.086, 3.651, 3.157, 3.508, 2.975, 2.944, 2.836, 3.29, 3.228, 3.579, 3.318, 3.688, 3.441];
  const s = fitProduction('schaefer', C, I);
  check('surplus production: Schaefer fit matches SciPy', near(s.r, 0.3384306136636173, 1e-4) && near(s.K, 11503.389570707463, 1e-4) && near(s.q, 0.00042912128298532796, 1e-4) && near(s.sse, 0.15072006471705546, 1e-6) && near(s.B[20], 8665.616539343559, 1e-4));
  const f = fitProduction('fox', C, I);
  check('surplus production: Fox fit matches SciPy', near(f.r, 0.2539859453772879, 1e-4) && near(f.K, 12450.1463016134, 1e-4) && near(f.sse, 0.15194894729712058, 1e-6));
  check('surplus production: projection without catch stays at K', project('schaefer', 0.4, 100, [0, 0, 0]).every((b) => near(b, 100)));
};
