// #475 benchmark dose. Reference numbers from an independent SciPy implementation: L-BFGS-B maximum likelihood with
// box bounds (BMDS restrictions) from many starts, and the BMDL from an SLSQP profile with the BMD as an equality
// constraint plus brentq. On the example and 10 random data sets (multistage degree 1 to 3, fits on bounds): LL to
// 6e-14, BMD to 1.3e-7, BMDL to 4e-8 (relative), same parameter counts.
import { fitAll, fitModel, checkGroups, nelderMead, CHI2_90 } from '../../src/lib/sci/bmd.ts';

export default async (check) => {
  const rel = (a, b, t) => Number.isFinite(a) && Math.abs(a / b - 1) <= t;
  const G = [[0, 50, 1], [25, 50, 4], [50, 50, 9], [100, 50, 20], [200, 50, 37]].map(([dose, n, r]) => ({ dose, n, r }));
  const o = fitAll(G, 0.1, 2);
  const ref = {
    loglogistic: [-104.84040346, 37.60029554, 25.0804554, 215.68080693, 0.88043911],
    weibull: [-104.71519126, 34.83442647, 22.32013159, 215.43038252, 0.99834158],
    gamma: [-104.72371874, 35.7336048, 22.63269223, 215.44743747, 0.9898414],
    multistage: [-104.78709649, 32.93859548, 20.93957046, 215.57419297, 0.92988637],
    probit: [-106.26022847, 48.09173354, 40.80865019, 216.52045694, 0.41805974],
  };
  for (const f of o.fits) {
    const [ll, bmd, bmdl, aic, p] = ref[f.id];
    check(`bmd: ${f.id} log-likelihood and AIC`, Math.abs(f.ll - ll) < 1e-7 && Math.abs(f.aic - aic) < 1e-6);
    check(`bmd: ${f.id} BMD and BMDL (profile likelihood)`, rel(f.bmd, bmd, 1e-6) && rel(f.bmdl, bmdl, 1e-6));
    check(`bmd: ${f.id} goodness-of-fit p`, Math.abs(f.pValue - p) < 1e-6);
  }
  check('bmd: lowest AIC among adequate fits is Weibull', o.lowest.id === 'weibull');
  check('bmd: probit has two parameters, others three', o.fits.find((f) => f.id === 'probit').k === 2 && o.fits.filter((f) => f.k === 3).length === 4);
  // Fits on bounds: no control responses (background 0) and a quantal-linear multistage.
  const B = [[0, 22, 0], [25.09, 24, 0], [35.03, 25, 2], [100, 50, 33]].map(([dose, n, r]) => ({ dose, n, r }));
  const ms = fitModel('multistage', checkGroups(B), 0.1, 1), ll2 = fitModel('loglogistic', checkGroups(B), 0.1);
  check('bmd: multistage degree 1 with background on 0', Math.abs(ms.ll + 47.33241311665546) < 1e-7 && ms.k === 1 && rel(ms.bmd, 13.797209932204815, 1e-6) && rel(ms.bmdl, 10.502876174373542, 1e-6));
  check('bmd: quantal linear BMD = −ln(1 − BMR) / β1', rel(ms.bmd, -Math.log(0.9) / ms.params[1].value, 1e-9));
  check('bmd: log-logistic with background on 0', ll2.k === 2 && ll2.params[0].atBound && rel(ll2.bmd, 42.297672682628885, 1e-6) && rel(ll2.bmdl, 30.65003626121026, 1e-6));
  // Extra risk at the BMD equals the BMR for every model.
  for (const f of o.fits) { const p0 = f.curve(0), pb = f.curve(f.bmd); check(`bmd: ${f.id} extra risk at BMD is 10 %`, Math.abs((pb - p0) / (1 - p0) - 0.1) < 1e-9); }
  check('bmd: χ²₁(0.90) = 2.7055', Math.abs(CHI2_90 - 2.705543454095404) < 1e-9);
  check('bmd: Nelder-Mead on Rosenbrock', (() => { const r = nelderMead(([x, y]) => (1 - x) ** 2 + 100 * (y - x * x) ** 2, [-1.2, 1], { maxIter: 5000 }); return Math.abs(r.x[0] - 1) < 1e-5 && Math.abs(r.x[1] - 1) < 1e-5; })());
  const throws = (fn) => { try { fn(); return false; } catch { return true; } };
  check('bmd: bad input rejected', throws(() => checkGroups([{ dose: 0, n: 10, r: 0 }, { dose: 1, n: 10, r: 12 }, { dose: 2, n: 10, r: 3 }])) && throws(() => checkGroups([{ dose: 0, n: 10, r: 0 }, { dose: 1, n: 10, r: 0 }, { dose: 2, n: 10, r: 0 }])) && throws(() => fitModel('weibull', G, 1.2)));
};
