// #T100 Polymer molar mass: the article cases. The textbook and log-normal checks of src/lib/sci/polymer.ts live
// in tests/sci.mjs.
import * as P from '../../src/lib/sci/polymer.ts';
import { molarMass, parseFormula } from '../../src/lib/sci/chem.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;

  // Blog article branched-levan-fructan-molar-mass-dispersity-degree-of-polymerisation: Qiu et al. (2026),
  // Molecules 31(11): 1981. CoPS: Mw 7.491 kDa, Mn 7.2 kDa, Mp 7.401 kDa, Mz 7.865 kDa, Mw/Mn 1.04.
  const Mw = 7491, D = 1.04, c0 = 7.5, c1 = -0.15, t0 = 14, t1 = 34;
  const rows = P.exampleTrace(Mw, D, c0, c1, t0, t1, 0.02);
  const stds = [1e5, 5e4, 2e4, 1e4, 5e3, 2e3, 1e3].map((M) => [(c0 - Math.log10(M)) / -c1, Math.log10(M)]);
  const cal = P.polyfit(stds.map((s) => s[0]), stds.map((s) => s[1]), 1);
  const r = P.analyseTrace(rows.map((x) => x[0]), rows.map((x) => x[1]), cal.f, cal.df, t0 + 0.5, t1 - 0.5);
  check('polymer: a straight calibration through 1 kDa to 100 kDa standards is exact', near(cal.r2, 1, 1e-9) && near(cal.f(20), c0 + c1 * 20, 1e-9));
  check('polymer: the simulated 7.5 kDa fructan peak reads back as Mn 7202.9, Mw 7491.0, D 1.0400 over 397 slices',
    near(r.Mn, 7202.9, 1) && near(r.Mw, 7491, 1) && near(r.D, 1.04, 0.0005) && r.slices === 397);
  // For a log-normal, Mz/Mw = D exactly; the paper's Mz and Mp sit about 1 % above that, a small high-mass tail.
  check('polymer: log-normal Mz = Mw x D = 7790.6, below the paper\'s 7865', near(r.Mz, 7790.6, 1) && near(Mw * D, 7790.6, 0.1) && 7865 / Mw > D);
  check('polymer: log-normal Mp = Mw/sqrt(D) = 7345.5, read back as 7362', near(Mw * Math.exp(-Math.log(D) / 2), 7345.5, 0.2) && near(r.Mp, 7362, 2));
  // Three averages pin two chain lengths: 77.8 % by mass at 6597 and 22.2 % at 10624 give all three at once.
  const mix = P.averages([6597, 10624], [0.778, 0.222]);
  check('polymer: the two-length mixture reproduces the paper\'s Mn 7200, Mw 7491 and Mz 7865',
    near(mix.Mn, 7203.1, 1) && near(mix.Mw, 7491, 1) && near(mix.Mz, 7864.9, 1) && near(mix.D, 1.04, 0.0005));
  const ru = molarMass(parseFormula('C6H10O5'));
  check('polymer: an anhydrohexose residue is 162.141 g/mol, so Mn 7203 is 44.42 residues',
    near(ru, 162.141, 0.001) && near(mix.Mn / ru, 44.42, 0.01) && near(7491 / ru, 46.20, 0.01));
};
