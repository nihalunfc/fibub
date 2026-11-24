// #25 Uncertainty propagation calculator. The GUM routine itself is pinned in tests/sci.mjs (R = V/I and the
// pendulum). Added with /blog/discoveries/spectrophotometer-filter-uncertainty-budget/: the five-term absorbance
// budget published by Zarubica et al. (2025), EPJ Web Conf. 323: 10002, run through the same formula parser and
// GUM propagation the tool page uses.
import { parse, compile, variables, splitName } from '../../src/lib/sci/expr.ts';
import { propagate, monteCarlo } from '../../src/lib/sci/uncertainty.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  const named = splitName('A = 0.5 + sys + stab + homo + light + temp');
  const vars = variables(parse(named.formula));
  const f = compile(parse(named.formula), vars);
  check('absorbance budget: the formula gives five measured quantities with unit sensitivity', named.name === 'A' && vars.join(',') === 'sys,stab,homo,light,temp');
  const FILTERS = [
    { id: 'FOL1', u: [0.00104, 0.0104, 0.0006, 0.0004, 0.0017], uc: 0.010614, U: 0.021228, stabShare: 0.9601 },
    { id: 'FOL2', u: [0.00104, 0.011, 0.0019, 0.0028, 0.0002], uc: 0.011557, U: 0.023115, stabShare: 0.9059 },
    { id: 'FOL3', u: [0.00104, 0.0173, 0.0025, 0.0031, 0.0001], uc: 0.017783, U: 0.035566, stabShare: 0.9464 },
  ];
  for (const fl of FILTERS) {
    const rows = vars.map((n, i) => ({ name: n, value: 0, spread: fl.u[i], dist: 'normal' }));
    const r = propagate(f, rows, 0.9545);
    check(`absorbance budget: ${fl.id} combined uncertainty ${fl.uc}`, near(r.uc, fl.uc, 2e-4) && near(r.y, 0.5, 1e-12));
    check(`absorbance budget: ${fl.id} expanded uncertainty ${fl.U} with k = 2.000 (all inputs Type B)`, near(r.U, fl.U, 2e-4) && Math.abs(r.k - 2) < 5e-4 && !Number.isFinite(r.dof));
    check(`absorbance budget: ${fl.id} one-year stability holds ${(fl.stabShare * 100).toFixed(1)} % of the variance`, Math.abs(r.rows[1].share - fl.stabShare) < 5e-4 && r.rows.every((x) => Math.abs(x.c - 1) < 1e-6));
    // Dropping the other four terms moves the budget by less than 5 %.
    const only = propagate(f, rows.map((x, i) => ({ ...x, spread: i === 1 ? x.spread : 0 })), 0.9545);
    check(`absorbance budget: ${fl.id} is within 5 % of the stability term alone`, Math.abs(only.uc / r.uc - 1) < 0.05 && near(only.uc, fl.u[1], 1e-9));
  }
  const rows1 = vars.map((n, i) => ({ name: n, value: 0, spread: FILTERS[0].u[i], dist: 'normal' }));
  const mc = monteCarlo(f, rows1, 200000, 0.9545, 2026);
  check('absorbance budget: Monte Carlo (200,000 draws, seed 2026) gives 0.010607', near(mc.sd, 0.010607, 1e-4) && Math.abs(mc.mean - 0.5) < 1e-4);
  const half = propagate(f, rows1.map((x, i) => ({ ...x, spread: i === 1 ? x.spread / 2 : x.spread })), 0.9545);
  check('absorbance budget: halving the stability term cuts the combined uncertainty to 0.005615', near(half.uc, 0.005615, 1e-4));
  const rect = propagate(f, rows1.map((x, i) => ({ ...x, dist: i === 1 ? 'normal' : 'rect' })), 0.9545);
  check('absorbance budget: reading the four small terms as half-widths gives 0.010472', near(rect.uc, 0.010472, 1e-4));
};
