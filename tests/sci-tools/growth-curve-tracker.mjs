// #399 Growth curve tracker: Gompertz, logistic and von Bertalanffy fits checked against scipy.optimize.curve_fit
// (same A, b, k, standard errors and SSE on the example, pooled and per animal); BCS slope against scipy linregress.
import { readRecords, fitGrowth, gains, bcsTrend, MODELS, EXAMPLE } from '../../src/lib/sci/growth.ts';
import { parseTable, num } from '../../src/lib/sci/num.ts';
export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const { recs, errors, byDate } = readRecords(parseTable(EXAMPLE), num);
  check('growth: example read (23 weighings, dates)', recs.length === 23 && !errors.length && byDate && recs[11].t === 537 && recs[12].t === 0);
  const c41 = recs.filter((r) => r.animal === 'Calf 41'), T = (r) => r.map((x) => x.t), W = (r) => r.map((x) => x.w);
  // scipy curve_fit: [A, b, k, seA, SSE]
  const ref = {
    'Calf 41|gompertz': [514.8776, 2.27248, 0.004969, 12.679, 279.606], 'Calf 41|logistic': [463.1053, 6.13392, 0.008401, 14.657, 1130.522], 'Calf 41|vonb': [554.6843, 0.55764, 0.003796, 10.615, 102.838],
    'all|gompertz': [503.7690, 2.26458, 0.004850, 22.965, 3208.293], 'all|logistic': [449.3188, 6.07548, 0.008283, 15.944, 4882.735], 'all|vonb': [546.2196, 0.55669, 0.003674, 30.108, 2810.460],
  };
  for (const [key, [A, b, k, se, sse]] of Object.entries(ref)) {
    const [who, m] = key.split('|'), r = who === 'all' ? recs : c41;
    const f = fitGrowth(T(r), W(r), m);
    check(`growth: ${key} as scipy curve_fit (A ${f.A.toFixed(3)})`, rel(f.A, A, 2e-6) && rel(f.b, b, 1e-5) && rel(f.k, k, 2e-4) && rel(f.se[0], se, 1e-3) && rel(f.sse, sse, 1e-5));
  }
  // Exact data from known curves come back exactly.
  for (const m of ['gompertz', 'logistic', 'vonb']) {
    const p = m === 'vonb' ? [600, 0.6, 0.004] : m === 'logistic' ? [600, 8, 0.01] : [600, 2.5, 0.005];
    const t = Array.from({ length: 15 }, (_, i) => i * 50), w = t.map((x) => MODELS[m].f(x, p));
    const f = fitGrowth(t, w, m);
    check(`growth: ${m} recovers its own curve`, rel(f.A, p[0], 1e-6) && rel(f.b, p[1], 1e-6) && rel(f.k, p[2], 1e-6) && f.r2 > 0.999999);
  }
  { const f = fitGrowth([0, 100, 200, 300], [1, 2, 3, 4].map((x) => x), 'gompertz'); check('growth: inflection formulas', Math.abs(MODELS.gompertz.infl([500, Math.E, 0.01]).t - 100) < 1e-9 && Math.abs(MODELS.vonb.infl([270, 1, 0.01]).w - 80) < 1e-9 && Math.abs(MODELS.logistic.infl([500, 1, 0.01]).t) < 1e-12 && f.n === 4); }
  let threw = false; try { fitGrowth([0, 1, 2], [1, 2, 3], 'gompertz'); } catch (e) { threw = e.message.includes('at least 4'); } check('growth: too few weighings', threw);
  const g = gains(recs);
  check('growth: daily gains per interval', g.length === 21 && g[0].days === 45 && g[0].gain === 41 && Math.abs(g[0].adg - 41 / 45) < 1e-12 && g[0].fromDate === '2025-03-01');
  { const b = bcsTrend(c41); check('growth: BCS slope as scipy linregress (0.0119356 per 30 days)', Math.abs(b.per30 - 0.011935579968750571) < 1e-12 && b.n === 12); }
  check('growth: no BCS trend from 2 scores', bcsTrend(c41.slice(0, 2)) === null);
  { const r = readRecords([['A', '0', '40'], ['A', '30', '60', '3'], ['A', '2026-01-01', '70'], ['A', '60', '-1'], ['A', 'soon', '5']], num);
    check('growth: ages in days, bad rows reported', !r.byDate && r.recs.length === 2 && r.recs[1].t === 30 && r.recs[1].bcs === 3 && r.errors.length === 3 && r.errors[0].includes('mix of dates and ages')); }
};
