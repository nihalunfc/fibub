// #686 decline curve analysis: Arps fits checked against scipy.optimize.curve_fit (SciPy 1.18) on the example
// well, closed-form cumulatives against scipy.integrate.quad, and time to the economic limit against brentq.
import * as D from '../../src/lib/sci/eng-decline.ts';
export default async (check) => {
  const ex = D.exampleWell(), t = ex.map((r) => (r.month - 1) * 30.4375), q = ex.map((r) => r.rate);
  const near = (a, b, tol = 1e-5) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('decline: example well is 36 made-up months starting at 808.8', ex.length === 36 && q[0] === 808.8 && q[35] === 150.7);
  const sp = {
    rate: { exponential: [728.283196, 1.71038926e-3, 12.8851148, 5.13557555e-5], hyperbolic: [799.885212, 2.91327738e-3, 0.710705673, 5.94000456, 9.23383743e-5, 3.87360153e-2], harmonic: [823.662124, 3.6175236e-3, 8.49781674, 8.40417189e-5] },
    log: { exponential: [666.981719, 1.48235226e-3, 16.16897, 3.91355893e-5], hyperbolic: [796.414146, 2.85589036e-3, 0.689407492, 10.9923567, 1.17343791e-4, 3.68266558e-2], harmonic: [859.938835, 4.00003358e-3, 17.6480034, 1.2843845e-4] },
  };
  for (const space of ['rate', 'log']) for (const m of ['exponential', 'hyperbolic', 'harmonic']) {
    const f = D.fitArps(t, q, m, space), s = sp[space][m];
    const ok = m === 'hyperbolic'
      ? near(f.p.qi, s[0]) && near(f.p.Di, s[1], 1e-4) && near(f.p.b, s[2], 1e-4) && near(f.se.qi, s[3], 1e-3) && near(f.se.Di, s[4], 1e-3) && near(f.se.b, s[5], 1e-3)
      : near(f.p.qi, s[0]) && near(f.p.Di, s[1], 1e-5) && near(f.se.qi, s[2], 1e-3) && near(f.se.Di, s[3], 1e-3);
    check(`decline: ${m} fit on ${space === 'rate' ? 'rates' : 'log rates'} matches scipy curve_fit (parameters and standard errors)`, ok);
  }
  const h = D.fitArps(t, q, 'hyperbolic');
  const tl = D.timeToRate(h.p, 20);
  check('decline: time to 20 bbl/d matches brentq (6161.749 d)', near(tl, 6161.74895, 1e-6));
  check('decline: hyperbolic cumulative to the limit matches quad (622,606.39)', near(D.cumulative(h.p, tl), 622606.3856, 1e-7));
  const term = { dMin: 0.06 / 365.25 };
  check('decline: switch to 6 %/yr nominal terminal decline at 8082.45 d (closed form vs Python)', near(D.switchTime(h.p, term), 8082.4513, 1e-6));
  check('decline: cumulative with terminal decline to 10,000 d matches quad (677,679.52)', near(D.cumulative(h.p, 10000, term), 677679.5176, 1e-7));
  check('decline: rate is continuous at the terminal switch', near(D.rate(h.p, 8082.4513 - 1e-6, term), D.rate(h.p, 8082.4513 + 1e-6, term), 1e-8));
  // Exponential and harmonic closed forms against direct numerical integration.
  const simp = (fn, a, b, n = 20000) => { const hh = (b - a) / n; let s = fn(a) + fn(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * fn(a + i * hh); return (s * hh) / 3; };
  for (const p of [{ qi: 500, Di: 0.002, b: 0 }, { qi: 500, Di: 0.002, b: 1 }, { qi: 500, Di: 0.004, b: 1.5 }]) check(`decline: cumulative closed form, b = ${p.b}, equals Simpson integration`, near(D.cumulative(p, 3000), simp((x) => D.rate(p, x), 0, 3000), 1e-9));
  check('decline: exponential time to limit = ln(qi/q)/D', near(D.timeToRate({ qi: 500, Di: 0.002, b: 0 }, 50), Math.log(10) / 0.002, 1e-12));
  check('decline: effective first-year decline of exponential D = 1 − e^(−365.25 D)', near(D.effectiveDecline({ qi: 1, Di: 0.001, b: 0 }, 365.25), 1 - Math.exp(-0.36525), 1e-12));
  const fc = D.forecast(h.p, t[35], 20, 365.25 * 30 + t[35], { dMin: 0 }, 1000);
  check('decline: forecast EUR = produced + remaining, remaining from the last point', near(fc.remaining, D.cumulative(h.p, tl) - D.cumulative(h.p, t[35]), 1e-9) && near(fc.eur, 1000 + fc.remaining, 1e-12) && fc.reachedLimit);
  check('decline: trapezoid rule', D.trapezoid([0, 1, 3], [2, 4, 0]) === 7);
  check('decline: dates parse to days', D.parseTime('2024-03-01', Number).v - D.parseTime('2024-02-01', Number).v === 29 && D.parseTime('2024-03', Number).date);
  let threw = false; try { D.fitArps([0, 1, 2], [1, -1, 2], 'exponential'); } catch { threw = true; }
  check('decline: negative rates are refused', threw);
};
