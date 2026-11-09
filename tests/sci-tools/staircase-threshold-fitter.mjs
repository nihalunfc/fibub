// #725 Staircase and threshold fitter: psychometric fits checked against scipy.optimize.minimize (same
// binomial likelihood, L-BFGS-B then Nelder-Mead from a grid of starts); bootstrap against a numpy parametric
// bootstrap; staircases against scripted answers and the convergence points of Levitt (1971) and Kaernbach (1991).
import { fitPF, inverse, psi, bootstrap, group, stairStep, initStair, simulateStair, reversalMean, target } from '../../src/lib/sci/staircase.ts';
import { rng } from '../../src/lib/sci/sdt-optim.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const d = [21, 22, 25, 30, 34, 38, 38, 38].map((k, i) => ({ x: i + 1, k, n: 40 }));
  let f = fitPF(d, 'logistic', 0.5, 0);
  check('pf: logistic α 4.085691, β 0.785648 (scipy)', near(f.alpha, 4.08569097) && near(f.beta, 0.78564804));
  check('pf: logistic log-likelihood −146.094240, deviance 2.41339', near(f.logLik, -146.09423972, 1e-8) && near(f.deviance, 2.413386, 1e-5) && f.df === 6);
  f = fitPF(d, 'logistic', 0.5, 'free');
  check('pf: logistic with free lapse λ 0.039749, 75 % threshold 3.995930', near(f.lambda, 0.03974887, 1e-5) && near(inverse('logistic', 0.75, f.alpha, f.beta, 0.5, f.lambda), 3.99593029, 1e-6) && f.df === 5);
  f = fitPF(d, 'weibull', 0.5, 0.02);
  check('pf: Weibull λ = 0.02: α 4.496334, β 2.517479, threshold 3.980253', near(f.alpha, 4.49633354) && near(f.beta, 2.51747944) && near(inverse('weibull', 0.75, f.alpha, f.beta, 0.5, 0.02), 3.98025252));
  f = fitPF(d, 'normal', 0.5, 'free');
  check('pf: cumulative normal, free lapse: α 3.828762, β 0.732387, λ 0.043823', near(f.alpha, 3.82876211, 1e-5) && near(f.beta, 0.73238658, 1e-5) && near(f.lambda, 0.04382266, 1e-4));
  f = fitPF(d, 'weibull', 0.5, 'free');
  check('pf: Weibull free lapse log-likelihood −145.113226', near(f.logLik, -145.11322619, 1e-8));
  check('pf: ψ and its inverse agree', near(psi('weibull', inverse('weibull', 0.8, 3, 2, 0.5, 0.01), 3, 2, 0.5, 0.01), 0.8, 1e-12) && Number.isNaN(inverse('logistic', 0.99, 0, 1, 0.5, 0.05)));
  f = fitPF(d, 'logistic', 0.5, 0);
  const b = bootstrap(d, f, 0.75, 1000, rng(1));
  check('pf: bootstrap 95 % CI ≈ numpy (3.23 to 4.78), SE ≈ 0.395', Math.abs(b.ci[0] - 3.2283) < 0.15 && Math.abs(b.ci[1] - 4.7845) < 0.15 && Math.abs(b.se / 0.3952 - 1) < 0.12 && b.used === 1000);
  check('pf: bootstrap repeats with the same seed', bootstrap(d, f, 0.75, 50, rng(9)).ci[0] === bootstrap(d, f, 0.75, 50, rng(9)).ci[0]);
  let threw = false; try { fitPF([{ x: 0, k: 3, n: 5 }, { x: 1, k: 4, n: 5 }], 'weibull', 0.5, 0); } catch { threw = true; }
  check('pf: Weibull with a level of 0 is an error', threw);
  check('pf: grouping trial data', JSON.stringify(group([{ x: 2, correct: true }, { x: 1, correct: false }, { x: 2, correct: false }])) === JSON.stringify([{ x: 1, k: 0, n: 1 }, { x: 2, k: 1, n: 2 }]));

  // Scripted 1-up-2-down run.
  const rule = { down: 2, stepDown: 1, stepUp: 1, start: 10, min: 0, max: 20, halveAt: [2] };
  let s = initStair(rule); const lv = [], rev = [];
  for (const c of [1, 1, 1, 1, 0, 1, 1, 0, 1, 1]) { lv.push(s.x); const o = stairStep(rule, s, !!c); rev.push(o.reversal); s = o.s; }
  check('stair: levels 10 10 9 9 8 9 9 8 8.5 8.5 then 8', lv.join(' ') === '10 10 9 9 8 9 9 8 8.5 8.5' && s.x === 8);
  check('stair: reversals on trials 5, 7, 8 and 10; steps halve after the 2nd', rev.map((r, i) => (r ? i + 1 : 0)).filter(Boolean).join(',') === '5,7,8,10' && s.stepDown === 0.5);
  const m = { down: 3, stepDown: 2, stepUp: 2, start: 32, min: 1, max: 64, multiplicative: true };
  let t = initStair(m); for (let i = 0; i < 3; i++) t = stairStep(m, t, true).s;
  check('stair: multiplicative steps divide the level', t.x === 16 && stairStep(m, t, false).s.x === 32);
  check('stair: targets 70.7 % (2-down), 79.4 % (3-down), 75 % (Kaernbach 1:3)', near(target({ down: 2 }), 0.70710678) && near(target({ down: 3 }), 0.79370053) && near(target({ down: 1, stepDown: 1, stepUp: 3 }), 0.75));
  for (const down of [2, 3]) {
    const r = { down, stepDown: 0.25, stepUp: 0.25, start: 2, min: -10, max: 10 }, R = rng(3);
    let sum = 0; for (let i = 0; i < 400; i++) sum += reversalMean(simulateStair(r, (x) => psi('logistic', x, 0, 1, 0.5, 0), 120, R), 4, 8).mean;
    const want = inverse('logistic', target(r), 0, 1, 0.5, 0);
    check(`stair: simulated 1-up-${down}-down converges near the ${(target(r) * 100).toFixed(1)} % point (${(sum / 400).toFixed(3)} vs ${want.toFixed(3)})`, Math.abs(sum / 400 - want) < 0.08);
  }
  const tr = [{ x: 5, reversal: true }, { x: 3, reversal: true }, { x: 4, reversal: false }, { x: 2, reversal: true }, { x: 4, reversal: true }];
  check('stair: reversal mean drops the first and averages the rest', reversalMean(tr, 1, 10).mean === 3 && reversalMean(tr, 0, 2).mean === 3 && near(reversalMean([{ x: 2, reversal: true }, { x: 8, reversal: true }], 0, 2, true).mean, 4));
};
