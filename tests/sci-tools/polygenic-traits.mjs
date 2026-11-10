// #1445 Polygenic traits. Class probabilities and the smoothed density checked against scipy.stats binom.pmf and
// norm.pdf; sample counts checked to approach the binomial (chi-square-sized deviation) with a fixed seed.
import * as G from '../../src/lib/sci/polygenic.ts';
const PY6 = [0.01562500000000012, 0.09375000000000003, 0.23437500000000003, 0.31249999999999983, 0.234375, 0.09375000000000003, 0.015625];
const rel = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.abs(b);
export default async (check) => {
  check('polygenic: 3 genes equals scipy binom', G.distribution(3).every((p, k) => rel(p, PY6[k])));
  check('polygenic: 6 genes, 5 plus alleles', rel(G.classProb(6, 5), 0.19335937500000003));
  check('polygenic: ratios', G.ratio(1).join(':') === '1:2:1' && G.ratio(2).join(':') === '1:4:6:4:1' && G.ratio(3).join(':') === '1:6:15:20:15:6:1');
  check('polygenic: probabilities sum to 1', [1, 2, 3, 4, 5, 6].every((n) => Math.abs(G.distribution(n).reduce((a, b) => a + b, 0) - 1) < 1e-12));
  check('polygenic: moments', G.moments(4).mean === 4 && rel(G.moments(4).sd, Math.SQRT2));
  check('polygenic: density equals scipy', rel(G.density(2, 100, 5, 3, 108), 0.06252058966323099, 1e-9));
  const s = G.sample(3, 20000, 7), exp = G.distribution(3).map((p) => p * 20000);
  const chi = s.reduce((a, o, k) => a + (o - exp[k]) ** 2 / exp[k], 0);
  check(`polygenic: sample of 20000 fits the binomial (chi-square ${chi.toFixed(1)} on 6 df)`, s.reduce((a, b) => a + b, 0) === 20000 && chi < 22.5);
  check('polygenic: seeded sample repeats', G.sample(2, 100, 3).join() === G.sample(2, 100, 3).join());
  let bad = 0; for (const f of [() => G.classProb(0, 0), () => G.density(1, 0, 1, 0, 0)]) { try { f(); } catch { bad++; } }
  check('polygenic: bad input refused', bad === 2);
};
