// #317 allometry calculator. Reference values from Python on the page's made-up example (14 species, mass in kg,
// metabolic rate in W): scipy.stats.linregress on log10 values, scipy.stats.t for the limits and tests.
import { fitAllometry, testExponent, predictY, scale } from '../../src/lib/sci/allomfit.ts';

export default async (check) => {
  const near = (name, a, b, rel) => check(`allometry: ${name} (${a} vs ${b})`, Math.abs(a - b) <= rel * Math.abs(b));
  const M = [0.048, 0.052, 0.063, 0.101, 0.22, 1.051, 1.566, 1.607, 2.558, 3.746, 7.267, 7.616, 34.014, 66.832];
  const Y = [0.314, 0.376, 0.508, 0.624, 1.363, 3.397, 4.717, 6.36, 7.392, 8.017, 13.71, 16.202, 61.529, 66.665];
  const f = fitAllometry(M, Y);
  near('exponent b', f.b, 0.7414947220951064, 1e-10);
  near('SE of b', f.seB, 0.01737622301250837, 1e-9);
  near('95 % limits of b (low)', f.bLo, 0.7036351844642942, 1e-7);
  near('95 % limits of b (high)', f.bHi, 0.7793542597259185, 1e-7);
  near('log10 a', f.logA, 0.5479959443242949, 1e-10);
  near('SE of log10 a', f.seLogA, 0.01739190024951792, 1e-9);
  near('coefficient a', f.a, 3.5317987159275654, 1e-9);
  near('95 % limits of a (low)', f.aLo, 3.2366985177273424, 1e-7);
  near('95 % limits of a (high)', f.aHi, 3.853804146882972, 1e-7);
  near('R²', f.r2, 0.993453286548379, 1e-10);
  near('residual SD (log10)', f.s, 0.06489265157193833, 1e-9);
  near('bias correction factor', f.cf, 1.0112258376214374, 1e-10);
  const p = predictY(f, 50);
  near('prediction at 50 kg', p.y, 64.23522290729304, 1e-9);
  near('prediction limits low', p.piLo, 44.56854702469486, 1e-6);
  near('prediction limits high', p.piHi, 92.58017452674349, 1e-6);
  near('confidence limits low', p.ciLo, 54.40005979807193, 1e-6);
  near('confidence limits high', p.ciHi, 75.84851702857623, 1e-6);
  const t75 = testExponent(f, 0.75), t23 = testExponent(f, 2 / 3);
  near('t against 3/4', t75.t, -0.4894779434386326, 1e-8);
  near('p against 3/4', t75.p, 0.6333285768025496, 1e-5);
  near('p against 2/3', t23.p, 0.0010203951158804093, 1e-4);
  check('allometry: 3/4 inside the limits, 2/3 outside', t75.inside && !t23.inside);
  // An exact power law is recovered exactly.
  const e = fitAllometry([1, 10, 100, 1000], [2, 2 * 10 ** 0.25, 2 * 10 ** 0.5, 2 * 10 ** 0.75]);
  near('exact law: b', e.b, 0.25, 1e-12); near('exact law: a', e.a, 2, 1e-12);
  near('scaling law 3.4 × 70^0.75', scale(3.4, 0.75, 70), 3.4 * 70 ** 0.75, 1e-15);
  let threw = false; try { fitAllometry([1, 2, -3], [1, 2, 3]); } catch { threw = true; }
  check('allometry: refuses values at or below zero', threw);
};
