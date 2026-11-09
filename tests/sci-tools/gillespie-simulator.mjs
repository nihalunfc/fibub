// #988 Gillespie simulator: exact SSA checked against analytic results: the birth-death stationary Poisson distribution
// (chi-square against scipy.stats.poisson, critical value from scipy.stats.chi2), binomial decay, the two-stage gene
// expression noise formula (Thattai and van Oudenaarden, 2001) and the mean of a linear model against the ODE.
import { parseModel, simulate } from '../../src/lib/sci/sbode.ts';
import { channels, ensemble, ssa, startCounts, poisson, moments } from '../../src/lib/sci/sbssa.ts';
import { rng } from '../../src/lib/sci/sbnet.ts';
const O = {"pBins": [0.029252688076961124, 0.03783327480207079, 0.06305545800345125, 0.090079225719216, 0.11259903214902009, 0.12511003572113372, 0.12511003572113372, 0.11373639611012128, 0.09478033009176803, 0.07290794622443707, 0.052077104446026146, 0.034718069630684245, 0.021698793519177594, 0.027041609784801086], "crit13": 34.52817897487089, "decayMean": 60.653065971263345, "decayVar": 23.86512185411911, "pmf10": 0.12511003572113372};
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const bd = parseModel('-> X : k0\nX -> : kd\nk0 = 10\nkd = 1');
  const E = ensemble(bd, bd.params, [0, 10, 20], 4000, 11, 0);
  const fx = E.final.map((r) => r[0]), mo = moments(fx);
  check(`SSA birth-death: stationary mean ${mo.mean.toFixed(3)} = k0/kd = 10 within 4 SE`, Math.abs(mo.mean - 10) < 4 * Math.sqrt(10 / 4000));
  check(`SSA birth-death: variance ${mo.variance.toFixed(3)} = mean (Poisson) within 4 SE, Fano ${mo.fano.toFixed(3)}`, Math.abs(mo.variance - 10) < 4 * Math.sqrt(210 / 4000));
  const obs = new Array(14).fill(0); for (const v of fx) obs[v <= 4 ? 0 : v >= 17 ? 13 : v - 4]++;
  const chi = obs.reduce((s, x, i) => s + (x - 4000 * O.pBins[i]) ** 2 / (4000 * O.pBins[i]), 0);
  check(`SSA birth-death: histogram fits Poisson(10), chi-square ${chi.toFixed(2)} < ${O.crit13.toFixed(2)} (scipy chi2 0.999, 13 df)`, chi < O.crit13);
  check('Poisson pmf(10; 10) = scipy', near(poisson(10, 10), O.pmf10, 1e-12) && poisson(0, 0) === 1);
  const dm = parseModel('X -> : k\nk = 0.1\nX = 100'), D = ensemble(dm, dm.params, [0, 5], 4000, 5, 0), dmo = moments(D.final.map((r) => r[0]));
  check(`SSA decay: mean ${dmo.mean.toFixed(2)} = 100 e^-0.5 = ${O.decayMean.toFixed(2)} within 4 SE`, Math.abs(dmo.mean - O.decayMean) < 4 * Math.sqrt(O.decayVar / 4000));
  check(`SSA decay: variance ${dmo.variance.toFixed(2)} = binomial ${O.decayVar.toFixed(2)} within 10 %`, Math.abs(dmo.variance / O.decayVar - 1) < 0.1);
  check('SSA decay: ensemble mean follows the ODE (linear model)', Math.abs(D.mean[1][0] - simulate(dm, dm.params, [0, 5])[1][0]) < 4 * Math.sqrt(O.decayVar / 4000));
  const ge = parseModel('-> M : km\nM -> : dm\nM -> M + P : kp\nP -> : dp\nkm = 1\ndm = 0.2\nkp = 2\ndp = 0.1');
  const G = ensemble(ge, ge.params, [0, 100], 800, 3, 0), gp = moments(G.final.map((r) => r[1])), gm = moments(G.final.map((r) => r[0]));
  check(`SSA gene expression: protein mean ${gp.mean.toFixed(1)} = km kp/(dm dp) = 100 within 5 %`, Math.abs(gp.mean / 100 - 1) < 0.05);
  check(`SSA gene expression: protein Fano ${gp.fano.toFixed(2)} = 1 + kp/(dm + dp) = 7.67 within 15 %`, Math.abs(gp.fano / (1 + 2 / 0.3) - 1) < 0.15);
  check(`SSA gene expression: mRNA Poisson, mean ${gm.mean.toFixed(2)} ≈ 5, Fano ${gm.fano.toFixed(2)} ≈ 1`, Math.abs(gm.mean / 5 - 1) < 0.08 && Math.abs(gm.fano - 1) < 0.15);
  const dim = parseModel('2 A -> B : k\nk = 0.5\nA = 10');
  const ch = channels(dim);
  check('SSA propensity: 2A -> B is k·n(n−1), change −2, +1', ch[0].prop([10, 0], dim.params) === 45 && ch[0].change.join() === '-2,1');
  const rv = channels(parseModel('A <-> B : kf, kr\nkf = 1\nkr = 2\nA = 3\nB = 4'));
  check('SSA: reversible reaction split into two channels', rv.length === 2 && rv[0].prop([3, 4], { kf: 1, kr: 2 }) === 3 && rv[1].prop([3, 4], { kf: 1, kr: 2 }) === 8 && rv[1].change.join() === '1,-1');
  const t1 = ssa(ch, dim.params, [10, 0], [0, 1, 100], rng(4)), t2 = ssa(ch, dim.params, [10, 0], [0, 1, 100], rng(4));
  check('SSA: same seed, same run; 2A -> B ends with A = 0, B = 5', JSON.stringify(t1) === JSON.stringify(t2) && t1.samples[2].join() === '0,5' && t1.events === 5);
  check('SSA: whole-number start message', typeof startCounts(parseModel('A -> : k\nk = 1\nA = 2.5')) === 'string');
  check('SSA: too many reactions message', (() => { try { ensemble(bd, bd.params, [0, 1e6], 1, 1, 0, 1000); return false; } catch (e) { return /More than/.test(e.message); } })());
  const mm = channels(parseModel('S -> P : MM(V, K)\nV = 4\nK = 2\nS = 6'));
  check('SSA: Michaelis-Menten propensity V·S/(K + S) = 3', mm[0].prop([6, 0], { V: 4, K: 2 }) === 3);
};
