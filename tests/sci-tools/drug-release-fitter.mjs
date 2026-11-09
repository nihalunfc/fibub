// #682 Drug release curve fitter. Every model's parameters, standard errors, SSE, R², adjusted R² and AIC checked
// against scipy.optimize.curve_fit on the made-up example (agreement to curve_fit's own tolerance, ~1e-7 relative).
import * as D from '../../src/lib/sci/drugrelease.ts';

export default async (check) => {
  const rel = (a, b, tol = 2e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const t = [0.25, 0.5, 1, 2, 3, 4, 6, 8, 10, 12, 16, 24], F = [7.9, 13.3, 23.9, 38.6, 49.7, 56.8, 68.0, 75.9, 83.2, 88.3, 92.4, 95.8];
  const r = D.fitAll(t, F, 60, 'sphere'), by = Object.fromEntries(r.fits.map((m) => [m.id, m]));
  const want = {
    zero: [[5.944085802555241], [0.7858424193307445], 8194.518587119837, 0.23436727298957782, 80.31576913947947],
    first: [[0.2033614032326027], [0.009468712376556596], 170.92054228707823, 0.9840305004495267, 33.875505604839],
    higuchi: [[23.98470223661647], [0.9775148760350512], 911.8195976145383, 0.9148065969170575, 53.96642613303493],
    kp: [[23.321722113410313, 0.6643079326436249], [0.9478369611344055, 0.03570510918054235], 11.825807714151825, 0.9939893020878942, 8.071148610722416],
    hc: [[0.2567848103257197], [0.018387615919889345], 513.277621026453, 0.9520432908264318, 47.0709226471251],
    weibull: [[4.968121112574896, 0.8106872307806322], [0.0625110222017237, 0.012436155394825935], 8.923278820030712, 0.9991662775275667, 0.4450817198032846],
  };
  for (const [id, [p, se, sse, r2, aic]] of Object.entries(want)) {
    const m = by[id];
    check(`release: ${m.name} parameters (curve_fit)`, p.every((v, i) => rel(m.params[i].value, v)));
    check(`release: ${m.name} standard errors (curve_fit)`, se.every((v, i) => rel(m.params[i].se, v, 1e-5)));
    check(`release: ${m.name} SSE, R² and AIC`, rel(m.sse, sse) && rel(m.r2, r2) && rel(m.aic, aic, 1e-6));
  }
  check('release: Korsmeyer-Peppas uses the 6 points up to 60 %', by.kp.n === 6 && rel(by.kp.r2adj, 0.9924866276098677));
  check('release: best model is Weibull (lowest AIC among full fits)', r.best.id === 'weibull');
  check('release: Peppas n meaning by shape', D.peppasMechanism(0.664, 'sphere').startsWith('Anomalous') && D.peppasMechanism(0.45, 'cylinder') === 'Fickian diffusion' && D.peppasMechanism(0.5, 'film') === 'Fickian diffusion' && D.peppasMechanism(1.0, 'film').startsWith('Case II') && D.peppasMechanism(0.95, 'sphere') === 'Super case II transport' && D.peppasMechanism(0.3, 'film').startsWith('n below'));
  // Exact recoveries from noise-free curves.
  { const tt = [1, 2, 4, 6, 8, 12]; const z = D.zeroOrder(tt, tt.map((x) => 3 * x)), h = D.higuchi(tt, tt.map((x) => 20 * Math.sqrt(x))), f1 = D.firstOrder(tt, tt.map((x) => 100 * (1 - Math.exp(-0.15 * x))));
    const w = D.weibull(tt, tt.map((x) => 100 * (1 - Math.exp(-((x / 3) ** 1.4))))), kp = D.korsmeyerPeppas(tt, tt.map((x) => 9 * x ** 0.7), 100);
    const hc = D.hixsonCrowell(tt, tt.map((x) => 100 - (100 ** (1 / 3) - 0.3 * x) ** 3));
    check('release: noise-free curves recovered exactly', rel(z.params[0].value, 3, 1e-9) && rel(h.params[0].value, 20, 1e-9) && rel(f1.params[0].value, 0.15, 1e-6) && rel(w.params[0].value, 3, 1e-6) && rel(w.params[1].value, 1.4, 1e-6) && rel(kp.params[1].value, 0.7, 1e-6) && rel(hc.params[0].value, 0.3, 1e-6)); }
  // Degradation, first order.
  const t2 = [0, 1, 2, 4, 7, 14, 21, 28, 42, 56], M = [100, 97.8, 93.4, 85.6, 78.2, 60.3, 47.4, 37.1, 22.4, 14.5];
  const d = D.degradation(t2, M, true), d2 = D.degradation(t2, M, false);
  check('release: degradation k with M₀ = 100 % (curve_fit)', rel(d.k, 0.035505283877912595) && rel(d.kse, 0.00030900117859480663, 1e-5) && rel(d.r2, 0.9995558904776403) && rel(d.half, Math.LN2 / 0.035505283877912595));
  check('release: degradation k and M₀ both fitted (curve_fit)', rel(d2.k, 0.0355738150977468) && rel(d2.M0, 100.12014737549254) && rel(d2.M0se, 0.3824024885115248, 1e-5));
  let threw = false; try { D.fitAll([1, 2], [5, 9]); } catch { threw = true; }
  check('release: fewer than 3 points throws', threw);
};
