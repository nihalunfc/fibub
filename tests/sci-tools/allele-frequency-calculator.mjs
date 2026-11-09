// #312 Allele frequency calculator. Exact-test references from an exact enumeration with Python fractions
// (every heterozygote count's probability given the allele counts); chi-square from scipy.stats.chi2;
// Weir & Cockerham from scikit-allel 1.3.13 weir_cockerham_fst (its a, b, c are summed over both alleles, so
// twice ours); Nei's F-statistics from an independent numpy calculation.
import { hweExact, popStats, weirCockerham, neiF, pooled } from '../../src/lib/sci/hwefst.ts';

export default async (check) => {
  const rel = (name, got, want, tol = 1e-9) => check(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= tol * Math.max(1e-300, Math.abs(want)));
  const ref = [[[57, 14, 50], 5.562047311095335e-19], [[10, 40, 50], 0.6367558662349988], [[0, 1, 99], 1], [[25, 50, 25], 1], [[5, 10, 0], 0.11244377811094453], [[30, 5, 15], 2.156806415347185e-08], [[1, 0, 0], 1], [[3, 0, 2], 0.047619047619047616]];
  for (const [[a, b, c], p] of ref) rel(`HWE exact ${a}/${b}/${c}`, hweExact(a, b, c).p, p, 1e-7);
  { const d = hweExact(10, 40, 50); rel('HWE exact distribution sums to 1', d.probs.reduce((x, y) => x + y, 0), 1, 1e-12); }
  const s = popStats({ name: 'x', AA: 30, AB: 5, BB: 15 });
  rel('HWE chi-square', s.chi2, 30.437145272310108, 1e-9);
  rel('HWE chi-square p', s.pChi, 3.4486098437604994e-08, 1e-5);
  rel('allele frequency p', s.p, 0.65, 1e-12);
  rel('expected heterozygotes', s.eAB, 22.75, 1e-12);
  rel('FIS one population', s.Fis, 1 - 0.1 / 0.455, 1e-12);
  const pops = [{ name: 'A', AA: 30, AB: 5, BB: 15 }, { name: 'B', AA: 12, AB: 28, BB: 10 }, { name: 'C', AA: 4, AB: 20, BB: 26 }];
  const wc = weirCockerham(pops);
  rel('W&C FST (theta)', wc.Fst, 0.12398921832884097);
  rel('W&C FIT', wc.Fit, 0.32432432432432434);
  rel('W&C FIS', wc.Fis, 0.2286902286902287);
  rel('W&C a', 2 * wc.a, 0.06483809523809524); rel('W&C b', 2 * wc.b, 0.1047619047619048); rel('W&C c', 2 * wc.c, 0.35333333333333333);
  const nei = neiF(pops);
  rel('Nei FIS', nei.Fis, 0.21909532930602615); rel('Nei FST', nei.Fst, 0.09406006674082315); rel('Nei FIT', nei.Fit, 0.29254727474972186);
  check('Nei (1 − FIT) = (1 − FIS)(1 − FST)', Math.abs((1 - nei.Fit) - (1 - nei.Fis) * (1 - nei.Fst)) < 1e-12);
  const P = pooled(pops); check('pooled counts', P.AA === 46 && P.AB === 53 && P.BB === 51);
};
