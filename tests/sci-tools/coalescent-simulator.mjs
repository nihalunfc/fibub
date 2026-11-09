// #314 Coalescent simulator. Expectations are the standard results (Kingman 1982; Watterson 1975; Tajima 1983).
// One-off cross-check (recorded in the guide): 20,000 genealogies of n = 10 from this code against msprime 1.4.5
// (ploidy 1, population size 1, binary infinite-sites mutations at θ/2 per unit time, θ = 5); two-sample KS
// p-values 0.20 (TMRCA), 0.31 (total length) and 0.99 (segregating sites).
import { expected, replicate, genealogy, newick, poisson, meanVar, tipOrder, harmonic } from '../../src/lib/sci/coalescent.ts';
import { wfRng } from '../../src/lib/sci/wrightfisher.ts';

export default async (check) => {
  const near = (name, got, want, tol) => check(`${name}: got ${got}, want ${want} ± ${tol}`, Math.abs(got - want) <= tol);
  const e = expected(10, 5);
  near('coal E[TMRCA] n=10', e.tmrca, 1.8, 1e-12);
  near('coal a_10', e.a, 7129 / 2520, 1e-12);
  near('coal E[L] n=10', e.total, 2 * 7129 / 2520, 1e-12);
  near('coal Var[TMRCA] n=10', e.varTmrca, 1.1581418493323252, 1e-12);
  near('coal Var[S] n=10 θ=5', e.varS, 52.63903454900479, 1e-10);
  near('coal n=2: E[TMRCA] = 1', expected(2, 1).tmrca, 1, 1e-12);
  const R = 20000, r = replicate(10, 5, R, 7);
  const t = meanVar(r.tmrca), L = meanVar(r.total), S = meanVar(r.S), w = meanVar(r.thetaW);
  near('coal simulated mean TMRCA', t.mean, e.tmrca, 4 * Math.sqrt(e.varTmrca / R));
  near('coal simulated mean total length', L.mean, e.total, 4 * Math.sqrt(e.varTotal / R));
  near('coal simulated mean S', S.mean, e.S, 4 * Math.sqrt(e.varS / R));
  near('coal simulated Watterson θ unbiased', w.mean, 5, 4 * Math.sqrt(e.varS / R) / e.a);
  near('coal simulated Var[TMRCA]', t.var, e.varTmrca, 0.08);
  near('coal simulated Var[S]', S.var, e.varS, 4);
  { const u = wfRng(3), x = []; for (let i = 0; i < 50000; i++) x.push(poisson(45, u)); const m = meanVar(x); near('coal Poisson(45) mean', m.mean, 45, 0.15); near('coal Poisson(45) variance', m.var, 45, 1.5); }
  const g = genealogy(6, 3, wfRng(11)), nw = newick(g);
  check('coal genealogy has 2n − 1 nodes and n − 1 merge times', g.nodes.length === 11 && g.times.length === 5 && g.nodes[g.root].leaves === 6);
  check('coal Newick names every tip once', [1, 2, 3, 4, 5, 6].every((i) => nw.split(`s${i}:`).length === 2) && nw.endsWith(';'));
  check('coal tip order covers every tip', tipOrder(g).slice().sort().join() === [0, 1, 2, 3, 4, 5].join());
  { let sum = 0; for (const d of g.nodes) if (d.parent >= 0) sum += g.nodes[d.parent].time - d.time; near('coal total length = sum of branches', g.total, sum, 1e-12); }
  const a = replicate(8, 2, 10, 99), b = replicate(8, 2, 10, 99);
  check('coal same seed, same genealogies', a.tmrca.every((v, i) => v === b.tmrca[i]) && a.S.every((v, i) => v === b.S[i]));
  near('coal harmonic b_10', harmonic(10, 2), 1.5397677311665408, 1e-12);
};
