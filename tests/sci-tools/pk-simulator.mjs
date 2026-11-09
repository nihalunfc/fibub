// #473 PK simulator. Closed forms (Gibaldi and Perrier) computed separately in Python; the general solution was also
// checked against SciPy solve_ivp (LSODA, rtol 1e-11) on 24 random regimens (1 and 2 compartments, bolus, infusion,
// oral, 1 to 7 administrations): agreement to 3e-11; steady state against 30-half-life ODE runs to 1e-9.
import { simulate, summarise, disposition } from '../../src/lib/sci/pksim.ts';

export default async (check) => {
  const near = (a, b, rel = 1e-8) => Number.isFinite(a) && Math.abs(a - b) <= rel * Math.abs(b);
  // Example: invented drug, one compartment, CL 5 L/h, V 50 L, oral ka 1 /h, F 0.8, 250 mg every 12 h.
  const m = { comp: 1, cl: 5, v1: 50 }, r = { route: 'oral', amount: 250, tau: 12, n: 10, ka: 1, f: 0.8 };
  const s = simulate(m, r), u = summarise(m, r, s);
  check('pksim: first-dose Cmax and Tmax (closed form)', near(u.cmax1, 3.0970547307245084) && near(u.tmax1, 2.5584278811044956, 1e-6));
  check('pksim: steady-state Cmax and Tmax', near(u.cmaxSs, 4.611962986182161) && near(u.tmaxSs, 2.16023202151649, 1e-6));
  check('pksim: steady-state Cmin and Cav', near(u.cminSs, 1.9155849619699024) && near(u.cavSs, 10 / 3));
  check('pksim: AUC first interval and at steady state', near(u.auc1, 26.61361788929037, 1e-9) && near(u.aucSs, 40));
  check('pksim: accumulation ratios and fluctuation', near(u.racAuc, 1.5029899417056132, 1e-9) && near(u.racCmax, 1.4891448124661533) && near(u.fluct, 80.89134072636776));
  check('pksim: superposition of 10 doses', near(s.at(9 * 12 + 2.16023202151649), 4.611931500759991, 1e-9) && near(s.at(9 * 12 - 1e-12), 1.9155458844308715, 1e-6));
  check('pksim: 90 % of steady state after ln10/k', near(u.t90, Math.log(10) / 0.1));
  // Two compartments: alpha and beta from the quadratic.
  const m2 = { comp: 2, cl: 5, v1: 20, q: 10, v2: 40 };
  const d = disposition(m2);
  check('pksim: two-compartment alpha and beta', near(d[0].lam, 0.9330127018922193) && near(d[1].lam, 0.0669872981077807) && near(d[0].a + d[1].a, 1, 1e-12));
  const u2 = summarise(m2, { route: 'bolus', amount: 100, tau: 8, n: 5 });
  check('pksim: two-compartment bolus steady state', near(u2.cmaxSs, 6.492600321187309) && near(u2.cminSs, 1.4926003211873096) && near(u2.halfLives[1], 10.347441979891332));
  // One-compartment infusion closed form.
  const u3 = summarise(m, { route: 'infusion', amount: 250, tau: 12, n: 5, tinf: 2 });
  check('pksim: infusion steady-state peak and trough', near(u3.cmaxSs, 6.4849651366669665) && near(u3.cminSs, 2.38568535049333) && near(u3.tmaxSs, 2));
  // One-compartment bolus: R = 1 / (1 − e^(−kτ)).
  const u4 = summarise(m, { route: 'bolus', amount: 100, tau: 6, n: 3 });
  check('pksim: bolus accumulation ratio 1/(1−e^(−kτ))', near(u4.racAuc, 1 / (1 - Math.exp(-0.6)), 1e-9) && near(u4.racCmax, 1 / (1 - Math.exp(-0.6))));
  // ka equal to k: the t·e^(−kt) limit.
  const s5 = simulate(m, { route: 'oral', amount: 100, tau: 24, n: 1, ka: 0.1, f: 1 });
  check('pksim: ka = k limit', near(s5.single(5), (100 * 0.1 / 50) * 5 * Math.exp(-0.5), 1e-9));
  const throws = (f) => { try { f(); return false; } catch { return true; } };
  check('pksim: rejects bad input', throws(() => simulate({ comp: 1, cl: 0, v1: 50 }, r)) && throws(() => simulate(m, { ...r, f: 1.5 })) && throws(() => simulate(m, { route: 'infusion', amount: 1, tau: 4, n: 2, tinf: 6 })) && throws(() => simulate(m, { ...r, n: 0 })));
};
