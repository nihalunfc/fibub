// #309 molecular clock: reference values from Python (math + NumPy): distances, their standard errors by a
// numerical delta method with the multinomial covariance of (P, Q) (independent of the closed-form variances used
// in the tool), Tajima's counts, and SciPy 1.18 chi2.sf for the p-value. Example sequences are made up.
import * as M from '../../src/lib/sci/molclock.ts';
import { parseFasta } from '../../src/lib/sci/treebuild.ts';

const FA = `>Species A
GTATCAGCTACCGCAAAAATAGTACCCTATTTACGCAGGATGTCCTAACGATTAGTCTCAAGTAAGTCTAGCTTACTGCGACATTAACATGGCGTATATTTATTCCTTGCATCGGACGAGTGACCACGGAAGTGTCCTAAACATTCAAAG
>Species B
GTATCGGCTACCGTACAAATAGTACCCTATTTACACAGGATATCCTAACGATTAGTCTCATGTAGGCCTGGCCTGCAGCGACATTAACATGGCGTATATTTATTCCTTGCATCGGACGCGTGACTACGGAAGTGTCTTAGACATTCAGGG
>Outgroup
GTATGGGCTACGGCAAAAGTGGTACTTTATTTACGCGGGATGTCCCAGCGGCCAGTTTCATGTAAGGCTAGCCTACAACGACATTGACATGGCGTATACTCCTTCCTTGCACCGGAAGAGTGGCTACAGAAGTGTTCTAAACATTTTGAG`;

export default async (check) => {
  const near = (a, b, tol = 1e-8) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const [a, b, c] = parseFasta(FA).map((s) => s.seq);
  const k = M.seqDist(a, b, 'k2p'), j = M.seqDist(a, b, 'jc'), p = M.seqDist(a, b, 'p');
  check('clock: counts 14 transitions, 4 transversions in 150', k.sites === 150 && k.ts === 14 && k.tv === 4);
  check('clock: K2P and its SE = numerical delta method', near(k.d, 0.1336773939390442) && near(k.se, 0.03311908907801391, 1e-7));
  check('clock: JC and its SE = numerical delta method', near(j.d, 0.13076504035858336) && near(j.se, 0.03158690277443893, 1e-7));
  check('clock: p and binomial SE', near(p.d, 0.12) && near(p.se, 0.026532998322843202));
  const T = M.divergenceTime(k.d, k.se, 0.01, 0.002);
  check('clock: T = d / 2r with propagated SE', near(T.value, 6.68386969695221) && near(T.se, 2.128179907438982) && near(T.lo, 6.68386969695221 - 1.959963984540054 * 2.128179907438982));
  check('clock: pairwise rate halves nothing (T = d / r)', near(M.divergenceTime(0.1, 0, 0.02, 0, false).value, 5) && near(M.divergenceTime(0.1, 0, 0.01, 0).value, 5));
  const r = M.clockRate(k.d, k.se, 5, 0.5);
  check('clock: rate from a calibration', near(r.value, 0.013367739393904421) && near(r.se, 0.003571513009654413));
  check('clock: lower limit not below 0', M.divergenceTime(0.01, 0.02, 0.01, 0).lo === 0);
  const t = M.tajima(a, b, c);
  check('clock: Tajima counts and chi-square = Python/SciPy', t.m1 === 6 && t.m2 === 11 && near(t.chi2, 1.4705882352941178) && near(t.p, 0.22525290636064965, 1e-9));
  check('clock: chi-square tail = SciPy', near(M.chi2sf1(3.84), 0.05004352124870519, 1e-9) && near(M.chi2sf1(1), 0.31731050786291115, 1e-9));
  check('clock: JC undefined at p >= 0.75', Number.isNaN(M.distWithSE(4, 2, 1, 'jc').d));
  // Blog article elaphe-dione-coi-divergence-dating: 44 differences in a 650-site COI fragment (37 transitions,
  // 7 transversions) and the dating of a 6.7 % distance at 0.01 +/- 0.002 substitutions per site per Myr per lineage.
  const barcode = ['p', 'jc', 'k2p'].map((m) => M.distWithSE(650, 37, 7, m).d);
  check('clock: 650-site barcode p, JC and K2P distances', near(barcode[0], 0.06769230769230769) && near(barcode[1], 0.07094436651620079) && near(barcode[2], 0.07198941426906606));
  const snake = M.divergenceTime(0.067, 0.009853547519829335, 0.01, 0.002);
  check('clock: snake split dated at 3.35 Myr (95 % 1.72 to 4.98)', near(snake.value, 3.35) && Math.abs(snake.lo - 1.72) < 0.005 && Math.abs(snake.hi - 4.98) < 0.005);
  const snakeRate = M.clockRate(0.067, 0.009853547519829335, 1.7, 0);
  check('clock: rate implied by a 1.7 Myr calibration', near(snakeRate.value, 0.019705882352941177) && Math.abs(snakeRate.lo - 0.014026) < 1e-5 && Math.abs(snakeRate.hi - 0.025386) < 1e-5);
};
