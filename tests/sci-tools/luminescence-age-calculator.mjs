// #411 Luminescence age calculator. CAM checked against a direct maximum-likelihood fit with scipy.optimize
// (Nelder-Mead on the CAM log-likelihood); ages and uncertainties against closed-form partial derivatives in numpy.
import { cam, weightedMean, plainMean, wet, age, parseAliquots, EXAMPLE_ALIQUOTS } from '../../src/lib/sci/luminescence.ts';
import { parseTable, num } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const a = parseAliquots(parseTable(EXAMPLE_ALIQUOTS), num);
  check('lum: example has 24 aliquots (header skipped)', a.de.length === 24 && a.skipped === 1 && a.de[0] === 41.8 && a.u[0] === 2.6);
  const c = cam(a.de, a.u);
  check('lum: CAM dose and overdispersion match scipy maximum likelihood', c.converged && near(c.de, 44.4797496506, 1e-7) && near(c.od, 0.10197841538, 1e-8) && near(c.se, 1.10733730, 1e-7));
  check('lum: CAM log-likelihood matches scipy', near(c.ll, 15.95907797063, 1e-8) && near(c.odSe, 0.0208606722, 1e-8));
  const w = weightedMean(a.de, a.u);
  check('lum: weighted mean and MSWD', near(w.de, 43.6954135525, 1e-9) && near(w.se, 0.5534079021, 1e-9) && near(w.mswd, 3.33901002534, 1e-9));
  check('lum: plain mean', near(plainMean([1, 2, 3]).de, 2, 1e-12) && near(plainMean([1, 2, 3]).se, 1 / Math.sqrt(3), 1e-12));
  const same = cam([10, 10, 10], [0.5, 0.5, 0.5]);
  check('lum: CAM of identical doses has no overdispersion', near(same.de, 10, 1e-9) && same.od === 0 && near(same.se, 10 * 0.05 / Math.sqrt(3), 1e-9));
  check('lum: water correction', near(wet(2, 0.2, 1.25), 2 / 1.25, 1e-12) && wet(2, 0, 1.49) === 2);
  const f = { Ka: 0, Kb: 0.8, Kg: 0.25, Ua: 2.8, Ub: 0.15, Ug: 0.11, Ta: 0.74, Tb: 0.03, Tg: 0.05 }, kw = { a: 1.49, b: 1.25, g: 1.14 };
  const P = (av) => ({ De: { v: c.de, u: c.se }, K: { v: 1.2, u: 0.06 }, U: { v: 2.0, u: 0.1 }, Th: { v: 7.5, u: 0.4 }, water: { v: 0.15, u: 0.05 }, cosmic: { v: 0.15, u: 0.015 }, internal: { v: 0.03, u: 0.01 }, aValue: { v: av, u: av * 0.2 }, betaAtt: { v: 0.9, u: 0.02 }, f, kw });
  const r0 = age('conc', P(0)), r1 = age('conc', P(0.08));
  check('lum: age from concentrations matches numpy partials', near(r0.age, 21.4901096368, 1e-8) && near(r0.ageU, 1.3313409276, 1e-7) && near(r0.doseRate, 2.06977769787, 1e-9) && near(r0.doseRateU, 0.1174166294, 1e-7));
  check('lum: with an alpha contribution', near(r1.age, 15.8922446492, 1e-8) && near(r1.ageU, 1.30621137064, 1e-7) && r1.parts[0].value > 0.7);
  check('lum: budget shares add to 1', near(r0.budget.reduce((s, b) => s + b.share, 0), 1, 1e-9) && r0.budget.find((b) => b.name === 'water').share > 0.1);
  const r2 = age('parts', { De: { v: 30, u: 1.5 }, alpha: { v: 0.4, u: 0.08 }, beta: { v: 2.1, u: 0.1 }, gamma: { v: 1.0, u: 0.05 }, water: { v: 0.2, u: 0.05 }, cosmic: { v: 0.2, u: 0.02 }, internal: { v: 0, u: 0 }, kw });
  check('lum: age from dose-rate parts matches numpy', near(r2.age, 9.99167807315, 1e-9) && near(r2.ageU, 0.77509908235, 1e-7));
  const err = (fn) => { try { fn(); return ''; } catch (e) { return e.message; } };
  check('lum: CAM refuses zero doses and missing errors', err(() => cam([0, 2], [1, 1])).includes('above 0') && err(() => cam([1, 2], [0, 1])).includes('uncertainty'));
  check('lum: zero dose rate refused', err(() => age('parts', { De: { v: 30, u: 1 }, alpha: { v: 0, u: 0 }, beta: { v: 0, u: 0 }, gamma: { v: 0, u: 0 }, water: { v: 0, u: 0 }, cosmic: { v: 0, u: 0 }, internal: { v: 0, u: 0 }, kw })).includes('above 0'));
};
