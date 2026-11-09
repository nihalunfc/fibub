// #683 Traffic flow fundamentals. Regressions checked against numpy.polyfit (v on k, v on ln k, ln v on k) and
// the two densities for a flow against scipy.optimize.brentq; Greenshields capacity against a hand-worked example.
import * as T from '../../src/lib/sci/traffic.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // Hand example: v_f = 100 km/h, k_j = 120 veh/km → k_m = 60, v_m = 50, q_m = 3000 veh/h; q = 2000 → k = 60(1 ∓ √(1/3)).
  const g = T.makeModel('greenshields', 100, 120);
  check('traffic: Greenshields capacity by hand', near(g.km, 60) && near(g.vm, 50) && near(g.qm, 3000) && near(g.q(30), 2250));
  { const d = T.densitiesForFlow(g, 2000); check('traffic: Greenshields densities for 2000 veh/h by hand', near(d[0], 60 * (1 - Math.sqrt(1 / 3))) && near(d[1], 60 * (1 + Math.sqrt(1 / 3)))); }
  check('traffic: flow above capacity has no density', T.densitiesForFlow(g, 3001).length === 0);
  const gb = T.makeModel('greenberg', 30, 200), uw = T.makeModel('underwood', 110, 50);
  check('traffic: Greenberg and Underwood capacity formulas', near(gb.km, 200 / Math.E) && near(gb.qm, gb.q(gb.km)) && gb.q(gb.km * 1.01) < gb.qm && near(uw.qm, uw.q(50)) && uw.q(49) < uw.qm && near(uw.vm, 110 / Math.E));
  const d = [[8, 95.0], [15, 84.2], [22, 79.5], [30, 70.5], [38, 64.8], [45, 60.2], [52, 49.4], [60, 48.7], [68, 40.7], [75, 38.4], [83, 32.6], [90, 25.5], [98, 19.7], [105, 13.2]];
  const k = d.map((x) => x[0]), v = d.map((x) => x[1]);
  const fg = T.fitModel('greenshields', k, v), fb = T.fitModel('greenberg', k, v), fu = T.fitModel('underwood', k, v);
  check('traffic: Greenshields fit (numpy.polyfit)', near(fg.vf, 96.3366566404056) && near(fg.kj, 121.36040393682909) && near(fg.qm, 2922.8638909508077) && near(fg.r2t, 0.9907690655839305));
  check('traffic: Greenberg fit (numpy.polyfit on ln k)', near(fb.vm, 31.56473340551953) && near(fb.kj, 233.59833554947497) && near(fb.qm, 2712.5477234905356) && near(fb.r2t, 0.9276048733529056) && near(fb.rmse, 6.500151364779402));
  check('traffic: Underwood fit (numpy.polyfit on ln v)', near(fu.vf, 123.26967631166006) && near(fu.km, 55.99683709745472) && near(fu.qm, 2539.3658270500414) && near(fu.r2t, 0.940328758891774));
  { const a = T.densitiesForFlow(fb, 2000), b = T.densitiesForFlow(fu, 2000), c = T.densitiesForFlow(fg, 2000);
    check('traffic: densities for 2000 veh/h (scipy brentq)', near(c[0], 26.58356478043241, 1e-8) && near(c[1], 94.77683915639666, 1e-8) && near(a[0], 31.74803950148983, 1e-8) && near(a[1], 155.3650402794406, 1e-8) && near(b[0], 25.652178680731087, 1e-8) && near(b[1], 104.07459545626848, 1e-8)); }
  check('traffic: level of service from user limits', T.los(5, [8, 14, 20, 26, 32]) === 'A' && T.los(14, [8, 14, 20, 26, 32]) === 'B' && T.los(26.5, [8, 14, 20, 26, 32]) === 'E' && T.los(40, [8, 14, 20, 26, 32]) === 'F');
  let threw = false; try { T.fitModel('greenshields', [10, 20, 30], [40, 50, 60]); } catch { threw = true; }
  check('traffic: rising speed cannot be fitted', threw);
};
