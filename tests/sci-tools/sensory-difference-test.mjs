// #395 Sensory triangle and duo-trio test analyser. Binomial checked against scipy.stats.binom; psychometric
// functions against an independent Python implementation of the sensR formulas with scipy.integrate.quad (scratch se.py).
import { binomSf, minCorrect, pCorrect, dPrime, analyse, power, sampleSize, criticalTable, pcFromPd } from '../../src/lib/sci/sensory.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('sensory: binomial tail matches scipy', near(binomSf(18, 36, 1 / 3), 0.028349210190715804, 1e-12) && near(binomSf(30, 50, 0.5), 0.10131937553227033, 1e-12) && near(binomSf(1, 10, 0.5), 0.9990234375, 1e-13) && binomSf(0, 5, 0.3) === 1);
  check('sensory: fewest correct matches scipy', minCorrect(36, 1 / 3, 0.05) === 18 && minCorrect(36, 1 / 3, 0.01) === 20 && minCorrect(36, 1 / 3, 0.001) === 22 && minCorrect(50, 0.5, 0.05) === 32 && minCorrect(5, 1 / 3, 0.001) === null);
  const ref = { triangle: [0.3558346496, 0.4180466747, 0.6048069328, 0.7814275986], duotrio: [0.5223470006, 0.5824754442, 0.7468202455, 0.876456704], twoAFC: [0.6381631951, 0.7602499389, 0.9213503965, 0.9830525732], tetrad: [0.3777187032, 0.4938084275, 0.7776671166, 0.9429716189] };
  for (const [m, v] of Object.entries(ref)) check(`sensory: ${m} psychometric function at d′ 0.5, 1, 2, 3`, [0.5, 1, 2, 3].every((d, i) => near(pCorrect(m, d), v[i], 2e-7)));
  check('sensory: d′ inverse matches brentq', near(dPrime('triangle', 0.5), 1.46626278, 1e-5) && near(dPrime('duotrio', 0.7), 1.71530156, 1e-5) && near(dPrime('twoAFC', 0.7), 0.74161432, 1e-6) && near(dPrime('tetrad', 0.5), 1.02212571, 1e-5));
  check('sensory: d′ is 0 at chance and infinite at 100 %', dPrime('triangle', 0.3) === 0 && dPrime('tetrad', 1) === Infinity);
  const a = analyse('triangle', 36, 18);
  check('sensory: example analysis', a.significant && a.needed === 18 && near(a.pValue, 0.0283492, 1e-6) && near(a.pd, 0.25, 1e-12) && near(a.d, 1.46626, 1e-4) && near(a.seD, 0.437076, 2e-3));
  check('sensory: power and sample size match scipy', near(power(36, 1 / 3, pcFromPd(0.3, 1 / 3), 0.05), 0.7155081458791804, 1e-10) && sampleSize(1 / 3, pcFromPd(0.3, 1 / 3), 0.05, 0.8) === 40);
  const t = criticalTable('duotrio', 10, 12, [0.05, 0.01]);
  check('sensory: critical table', t.length === 3 && t[0].n === 10 && t[0].c[0] === 9 && t[0].c[1] === 10);
  let e = ''; try { analyse('triangle', 10, 11); } catch (x) { e = x.message; } check('sensory: more correct than answers refused', e.includes('0 to 10'));
};
