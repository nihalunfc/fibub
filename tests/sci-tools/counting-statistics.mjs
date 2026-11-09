// #950 counting statistics. Checked against SciPy (norm.ppf, chi2.ppf, lambertw, brentq) and Currie's (1968)
// published paired-blank formulas L_C = 2.33 √B and L_D = 2.71 + 4.65 √B.
import { netRate, currie, mda, lambertW0, trueNonPar, truePar, measNonPar, measPar, bestSplit, timeForPrecision, gammaP, poissonCI } from '../../src/lib/sci/phcount.ts';
export default async (check) => {
  const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.max(1, Math.abs(b));
  const p = currie(400, 1000, 1000);
  check('counting: Currie paired blank, L_C = 2.326 √B and L_D = 2.706 + 4.653 √B', near(p.LC, 46.52348614706695) && near(p.LD, 95.75251574822931) && near(p.LC, 2.326 * 20, 1e-3) && near(p.LD, 2.706 + 4.653 * 20, 1e-3));
  const u = currie(150, 3600, 600, 0.05, 0.1);
  check('counting: Currie with unequal times and β = 0.10 (SciPy brentq)', near(u.LC, 8.883224869256821, 1e-8) && near(u.LD, 17.652148659514307, 1e-8));
  const n = netRate(1500, 600, 900, 1800);
  check('counting: net rate 2.0 ± 0.0667 /s', near(n.net, 2) && near(n.sd, 0.06666666666666667));
  const c = currie(900, 1800, 600);
  check('counting: example L_C, L_D and MDA at 25 % efficiency', near(c.LC, 32.897072539029445, 1e-8) && near(c.LD, 68.49968853215431, 1e-8) && near(mda(c.LD, 0.25, 600), 0.45666459021436207, 1e-8));
  check('counting: Lambert W against SciPy', near(lambertW0(-0.2), -0.2591711018190737, 1e-12) && near(lambertW0(0.5), 0.35173371124919584, 1e-12) && near(lambertW0(10), 1.7455280027406994, 1e-12) && near(lambertW0(-1 / Math.E + 1e-9), -0.9999262687560734, 1e-6));
  check('counting: dead time, 20,000 /s measured with 5 µs', near(truePar(20000, 5e-6), 22366.51183179259, 1e-10) && near(trueNonPar(20000, 5e-6), 22222.222222222223, 1e-12));
  check('counting: dead-time models invert', near(measPar(truePar(30000, 4e-6), 4e-6), 30000, 1e-10) && near(measNonPar(trueNonPar(30000, 4e-6), 4e-6), 30000, 1e-12) && Number.isNaN(truePar(1e5, 5e-6)) && Number.isNaN(trueNonPar(3e5, 5e-6)));
  check('counting: best time split and time for 1 % (√ rule)', near(bestSplit(2.5, 0.5, 1).tg, 0.6909830056250525) && near(timeForPrecision(2.5, 0.5, 0.01), 13090.169943749475, 1e-10));
  const ci = [[0, 0.95, 0, 3.6888794541139354], [5, 0.95, 1.623486390118421, 11.66833207932267], [20, 0.9, 13.254651598346554, 29.062018840434014], [1000, 0.95, 938.9730184076952, 1063.952136016302]];
  check('counting: exact Poisson limits match SciPy chi2.ppf', ci.every(([k, cf, lo, hi]) => { const r = poissonCI(k, cf); return near(r.lo, lo, 1e-9) && near(r.hi, hi, 1e-9); }));
  check('counting: incomplete gamma P(1, x) = 1 − e^(−x)', near(gammaP(1, 2.5), 1 - Math.exp(-2.5), 1e-14) && near(gammaP(3, 30), 1 - Math.exp(-30) * (1 + 30 + 450), 1e-14));
};
