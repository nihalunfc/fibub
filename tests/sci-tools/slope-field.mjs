// #1474 slope field. RK4 and the exact solutions checked against scipy 1.x solve_ivp (rtol 1e-12) at one point per
// ready-made equation; general solutions of the two linear equations match sympy dsolve.
import * as O from '../../src/lib/sci/school-r-ode.ts';
const P = Object.fromEntries(O.ODE_PRESETS.map((p) => [p.id, p]));
const near = (a, b, t) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const SCIPY = { growth: [0, 2, 4, 6.640233845475152], cooling: [0, 90, 20, 38.12327366966109], tank: [0, 0, 60, 69.88057880877304], lin1: [0, 0, 2, 4.389056098932739], lin2: [1, 1, 2.5, 4.206250000000001], circ: [0, 2, 1.5, 1.3228756555359038], xy: [0, 0.5, 1.5, 1.5401084244585987] };
export default async (check) => {
  for (const [id, [x0, y0, x1, want]] of Object.entries(SCIPY)) {
    const p = P[id], prm = O.paramsOf(p), f = (x, y) => p.f(x, y, prm);
    check(`slope field: ${p.eq} exact solution matches scipy solve_ivp at ${x1}`, near(p.exact(x1, x0, y0, prm), want, 1e-9));
    check(`slope field: ${p.eq} RK4 (1000 steps) matches scipy at ${x1}`, near(O.solveTo(f, x0, y0, x1, 1000), want, 1e-6));
  }
  // sympy dsolve: dy/dx = x + y → y = C1 eˣ − x − 1; dy/dx + y/x = x² → y = (C1 + x⁴/4)/x
  check('slope field: linear answers in sympy form (C = 1)', near(P.lin1.exact(1, 0, 0), Math.E - 2, 1e-12) && near(P.lin2.exact(2, 1, 1.25), (1 + 4) / 2, 1e-12));
  const wk = P.tank.work(0, 0, O.paramsOf(P.tank));
  check('slope field: tank working says y → 100 g and C = −100', wk.answer === 'y = 100 − 100 e^(−0.02 t)' && wk.steps.some((s) => s.includes('y → 100 g')));
  check('slope field: growth working C for (1, 3), k = 0.3', P.growth.work(1, 3, { k: 0.3 }).answer === 'y = 2.2225 e^(0.3 t)');
  const tr = O.trace((x, y) => -x / y, 0, 2, [-4, 4, -4, 4]);
  check('slope field: traced circle stays on radius 2 and stops near the x-axis', tr.every(([x, y]) => near(Math.hypot(x, y), 2, 1e-3)) && Math.min(...tr.map((p) => p[1])) < 0.3);
};
