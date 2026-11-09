// #917 heat engine cycles: air-standard cycles checked against an independent SciPy integration of P dv and of
// the heats along each process, and against the textbook closed-form efficiencies.
import * as CY from '../../src/lib/sci/phcycles.ts';

export default async (check) => {
  const air = { R: 287, gamma: 1.4 }, b = { T1: 300, P1: 100e3 };
  const near = (a, x, tol) => Math.abs(a - x) <= tol * Math.abs(x);
  const o = CY.cycle('otto', { ...b, r: 8, Tmax: 1800 }, air);
  check('cycles: Otto r 8 net work, heat in and MEP match SciPy', near(o.wnet, 450077.3319, 1e-8) && near(o.qin, 796985.3582, 1e-8) && near(o.mep, 597414.7429, 1e-8));
  check('cycles: Otto efficiency equals 1 - 1/r^(k-1)', near(o.eta, CY.formula.otto(8, 1.4), 1e-12) && near(o.states[1].T, 689.2190130, 1e-9) && near(o.states[3].T, 783.4955070, 1e-9));
  const d = CY.cycle('diesel', { ...b, r: 18, rc: 2 }, air);
  check('cycles: Diesel r 18 rc 2 work, heat and MEP match SciPy', near(d.wnet, 604793.1579, 1e-8) && near(d.qin, 957591.3135, 1e-8) && near(d.mep, 743750.5529, 1e-8));
  check('cycles: Diesel efficiency equals the textbook formula', near(d.eta, CY.formula.diesel(18, 2, 1.4), 1e-12) && near(d.eta, 0.6315775314, 1e-9));
  const br = CY.cycle('brayton', { ...b, rp: 10, Tmax: 1400 }, air);
  check('cycles: Brayton rp 10 work, efficiency and back work ratio match SciPy', near(br.wnet, 397444.7153, 1e-8) && near(br.eta, CY.formula.brayton(10, 1.4), 1e-12) && near(br.bwr, 0.4137209419, 1e-9));
  const c = CY.cycle('carnot', { ...b, Tmax: 900, rT: 3 }, air);
  check('cycles: Carnot work matches SciPy and efficiency is 1 - TC/TH', near(c.wnet, 189181.0361, 1e-8) && near(c.eta, 2 / 3, 1e-12) && near(c.carnot, 2 / 3, 1e-12));
  const s1 = CY.cycle('stirling', { ...b, Tmax: 900, r: 4, regen: 1 }, air), s0 = CY.cycle('stirling', { ...b, Tmax: 900, r: 4, regen: 0.5 }, air), sn = CY.cycle('stirling', { ...b, Tmax: 900, r: 4, regen: 0 }, air);
  check('cycles: Stirling with an ideal regenerator reaches the Carnot efficiency', near(s1.eta, 2 / 3, 1e-12) && near(s1.wnet, 238719.8890, 1e-8));
  check('cycles: Stirling with a 50 % and no regenerator match SciPy', near(s0.eta, 0.4163744411, 1e-9) && near(sn.eta, 0.3027212704, 1e-9));
  check('cycles: first law, net work = heat in - heat out, every cycle', [o, d, br, c, s1, s0].every((r) => near(r.wnet, r.qin - r.qout, 1e-10)));
  check('cycles: every cycle closes (back to state 1 entropy 0)', [o, d, br, c, s1].every((r) => { const L = r.states[3], pts = CY.path(L, r.states[0], r.procs[3].kind, air, 300, r.states[0].v, 10); return Math.abs(pts[10].s) < 1e-9 && Math.abs(pts[10].T - 300) < 1e-9; }));
  check('cycles: isentropic path keeps entropy', (() => { const p = CY.path(o.states[0], o.states[1], 'isentropic', air, 300, o.states[0].v, 20); return p.every((x) => Math.abs(x.s) < 1e-9); })());
  check('cycles: closed-loop P dv by the trapezium rule equals the net work (Otto)', (() => { let W = 0; for (let i = 0; i < 4; i++) { const p = CY.path(o.states[i], o.states[(i + 1) % 4], o.procs[i].kind, air, 300, o.states[0].v, 4000); for (let j = 1; j < p.length; j++) W += 0.5 * (p[j].P + p[j - 1].P) * (p[j].v - p[j - 1].v); } return near(W, o.wnet, 1e-5); })());
  check('cycles: impossible inputs give a message', !!CY.cycle('otto', { ...b, r: 8, Tmax: 500 }, air).problem && !!CY.cycle('diesel', { ...b, r: 10, rc: 12 }, air).problem && !!CY.cycle('brayton', { ...b, rp: 0.5, Tmax: 1400 }, air).problem && !!CY.cycle('stirling', { ...b, r: 4, Tmax: 900, regen: 2 }, air).problem);
};
