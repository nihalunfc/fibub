// #548 ODE solver. Reference numbers from SciPy 1.18.1 / NumPy 2.5.4 (solve_ivp RK45 and DOP853, numpy.linalg.eigvals,
// and the same finite-difference schemes written in NumPy), run on 2026-11-09.
import { parseSystem, rk45, rk4, equilibria, eigenvalues, classify, pde, bifurcation, gridStarts, zeroContour, localMaxima } from '../../src/lib/sci/ode.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const vdp = parseSystem("x' = y\ny' = mu*(1 - x^2)*y - x\nmu = 1");
  check('ode: parses equations and a parameter', vdp.vars.join() === 'x,y' && vdp.params[0].name === 'mu' && vdp.params[0].value === 1);
  // SciPy solve_ivp(vdp, (0, 20), [2, 0], method="RK45"): 52 steps, 434 evaluations, y(20) = [2.009352697462828, 0.02919124864403544].
  let s = rk45(vdp.make(), 0, [2, 0], 20);
  check(`ode: RK45 takes the same steps as SciPy (${s.steps} steps, ${s.evals} evaluations)`, s.steps === 52 && s.evals === 434);
  check('ode: RK45 end value matches SciPy', near(s.y.at(-1)[0], 2.009352697462828, 1e-9) && near(s.y.at(-1)[1], 0.02919124864403544, 1e-9));
  // Dense output: solve_ivp(..., rtol=1e-6, atol=1e-9, t_eval=[1, 2.5, 7, 13.3, 20]).
  s = rk45(vdp.make(), 0, [2, 0], 20, { rtol: 1e-6, atol: 1e-9, tEval: [0, 1, 2.5, 7, 13.3, 20] });
  const ref = [[2, 0], [1.5081441150422352, -0.7802185968604399], [-0.8409666497153266, -2.677477390678785], [1.9201517306116027, -0.4358394234032523], [2.0083951249210985, 0.030478685996535193], [2.0081492338040636, -0.042517332983997694]];
  check('ode: RK45 dense output matches SciPy t_eval', s.y.length === 6 && s.y.every((r, i) => near(r[0], ref[i][0], 1e-11) && near(r[1], ref[i][1], 1e-11)));
  // Lorenz: DOP853 at rtol = atol = 1e-13 gives y(2) = [-8.17349993224188, -9.562023686798737, 24.620702049678993].
  const lor = parseSystem("dx/dt = sigma*(y - x)\ndy/dt = x*(rho - z) - y\ndz/dt = x*y - beta*z\nsigma = 10\nrho = 28\nbeta = 8/3");
  s = rk45(lor.make(), 0, [1, 1, 1], 2, { rtol: 1e-10, atol: 1e-12, tEval: [2] });
  const L2 = [-8.17349993224188, -9.562023686798737, 24.620702049678993];
  check('ode: Lorenz y(2) matches SciPy DOP853 to 1e-7', s.y[0].every((v, i) => near(v, L2[i], 1e-7)));
  s = rk4(lor.make(), 0, [1, 1, 1], 2, 20000);
  check('ode: RK4 with 20000 steps matches too', s.y.at(-1).every((v, i) => near(v, L2[i], 1e-9)) && s.steps === 20000);
  // Lotka-Volterra, RK45 defaults: 20 steps, y(15) = [1.2609043083146811, 10.099059268553798].
  const lv = parseSystem("x' = a*x - b*x*y\ny' = -c*y + d*x*y\na = 1.1\nb = 0.4\nc = 0.4\nd = 0.1");
  s = rk45(lv.make(), 0, [10, 10], 15);
  check('ode: Lotka-Volterra matches SciPy', s.steps === 20 && near(s.y.at(-1)[0], 1.2609043083146811, 1e-9) && near(s.y.at(-1)[1], 10.099059268553798, 1e-9));
  // Equilibria. Lorenz: origin (eigenvalues 11.8277, -2.6667, -22.8277) and C± = (±√72, ±√72, 27) with 0.0940 ± 10.1945i, -13.8546.
  const eq = equilibria(lor.make(), [[1, 1, 1], [10, 10, 20], [-10, -10, 20]]);
  const cp = eq.find((e) => e.x[0] > 1), o = eq.find((e) => Math.abs(e.x[0]) < 1e-9);
  check('ode: Lorenz has 3 equilibria', eq.length === 3 && near(cp.x[0], Math.sqrt(72), 1e-9) && near(cp.x[2], 27, 1e-9));
  check('ode: Lorenz C+ eigenvalues match numpy', near(cp.eig[0][0], 0.09395562391, 1e-7) && near(cp.eig[0][1], 10.19450522, 1e-7) && near(cp.eig[2][0], -13.85457791, 1e-7) && cp.kind.startsWith('saddle-focus'));
  check('ode: Lorenz origin is a saddle', near(o.eig[0][0], 11.82772345, 1e-7) && near(o.eig[1][0], -8 / 3, 1e-7) && near(o.eig[2][0], -22.82772345, 1e-7) && o.kind.startsWith('saddle'));
  const lvq = equilibria(lv.make(), [[1, 1], [3, 3]]);
  check('ode: predator-prey equilibrium (c/d, a/b) = (4, 2.75) is a linear centre, 0.6633i', lvq.length === 2 && near(lvq[1].x[0], 4, 1e-9) && near(lvq[1].x[1], 2.75, 1e-9) && near(lvq[1].eig[0][1], 0.66332496, 1e-7) && lvq[1].kind.startsWith('centre') && lvq[0].kind.startsWith('saddle'));
  // numpy.linalg.eigvals of a 4×4 symmetric and a 3×3 with complex eigenvalues.
  const e4 = eigenvalues([[4, 1, -2, 2], [1, 2, 0, 1], [-2, 0, 3, -2], [2, 1, -2, -1]]);
  check('ode: 4×4 eigenvalues match numpy', [6.844621107234964, 2.2685314064312414, 1.0843644637732162, -2.1975169774394243].every((v, i) => near(e4[i][0], v, 1e-9) && e4[i][1] === 0));
  const e3 = eigenvalues([[1, 2, 3], [-4, 0, 1], [2, -1, -3]]);
  check('ode: 3×3 complex eigenvalues match numpy', near(e3[0][0], 0.42868302318266965, 1e-9) && near(e3[0][1], 1.5053370040711083, 1e-9) && near(e3[2][0], -2.857366046365339, 1e-9));
  check('ode: classification', classify([[-1, 0], [-2, 0]]).kind === 'stable node' && classify([[1, 2], [1, -2]]).kind === 'unstable spiral (focus)' && classify([[1, 0], [-1, 0]]).kind === 'saddle (unstable)' && classify([[0, 0], [-1, 0]]).stable === null);
  // Errors in plain words.
  const err = (t) => { try { parseSystem(t); return ''; } catch (e) { return e.message; } };
  check('ode: unknown name is reported', err("x' = k*x").includes('uses k') && err('hello').includes('not an equation') && err("x' = 1\nx' = 2").includes('twice') && err("x' = (1").includes('Line 1'));
  // Saddle-node x' = r + x²: equilibria ±√(-r); the sweep sees the stable branch and the blow-up past r = 0.
  const sn = parseSystem("x' = r + x^2\nr = -1");
  const b1 = bifurcation(sn, 'r', [-1, -0.25, 0.5], 0, [-0.5], { tTransient: 5, tRecord: 5, starts: gridStarts([0], 0, -1, -3, 3, 0, 0, 9) });
  check('ode: saddle-node branches ±√(−r)', b1.points.some((p) => p.p === -0.25 && p.kind === 'stable' && near(p.v, -0.5, 1e-9)) && b1.points.some((p) => p.p === -0.25 && p.kind === 'unstable' && near(p.v, 0.5, 1e-9)) && b1.failed === 1);
  // Brusselator (a = 1): Hopf at b = 2. SciPy (rtol 1e-10) limit cycle at b = 3: x peaks 3.75177, troughs 0.37055.
  const br = parseSystem("x' = a - (b + 1)*x + x^2*y\ny' = b*x - x^2*y\na = 1\nb = 3");
  const b2 = bifurcation(br, 'b', [1.5, 3], 0, [1, 1], { tTransient: 100, tRecord: 30, starts: gridStarts([1, 1], 0, 1, 0, 4, 0, 6, 5) });
  const mx = b2.points.filter((p) => p.p === 3 && p.kind === 'max'), mn = b2.points.filter((p) => p.p === 3 && p.kind === 'min');
  check('ode: Brusselator settles below the Hopf point', b2.points.some((p) => p.p === 1.5 && p.kind === 'end' && near(p.v, 1, 1e-5)) && b2.points.some((p) => p.p === 1.5 && p.kind === 'stable'));
  check('ode: Brusselator limit cycle at b = 3 matches SciPy', mx.length >= 4 && mx.every((p) => near(p.v, 3.75177, 2e-4)) && mn.every((p) => near(p.v, 0.37055, 2e-5)) && b2.points.some((p) => p.p === 3 && p.kind === 'unstable'));
  check('ode: local maxima refined', near(localMaxima([0, 1, 0.5])[0], 1 + 1 / 48, 1e-12));
  // Nullcline of x² + y² − 1 = 0: every segment end lies on the unit circle.
  const segs = zeroContour((x, y) => x * x + y * y - 1, -2, 2, -2, 2, 80, 80);
  check('ode: nullcline contour', segs.length > 100 && segs.every((g) => near(Math.hypot(g[0], g[1]), 1, 2e-3)));
  // Heat FTCS, sin(πx), D = 0.1, dx = 0.02, dt = 0.001 (r = 0.25), t = 0.5: NumPy 0.6104484575166865; exact e^(−0.05π²) = 0.61049803.
  const h = pde({ kind: 'heat', L: 1, k: 0.1, nx: 51, dt: 0.001, tEnd: 0.5, u0: (x) => Math.sin(Math.PI * x), bc: 'fixed' });
  check('ode: heat equation FTCS matches NumPy and the exact solution', h.number === 0.25 && h.stable && near(h.snapU.at(-1)[25], 0.6104484575166865, 1e-13) && near(h.snapU.at(-1)[25], Math.exp(-0.05 * Math.PI ** 2), 1e-4));
  const hb = pde({ kind: 'heat', L: 1, k: 1, nx: 21, dt: 0.0015, tEnd: 0.3, u0: (x) => Math.sin(Math.PI * x), bc: 'fixed' });
  check('ode: heat step past r = 1/2 is flagged unstable and blows up', !hb.stable && near(hb.number, 0.6, 1e-12) && hb.blewUp > 0);
  // Insulated ends keep the heat: NumPy same scheme, trapezoid integral 0.64125.
  const hf = pde({ kind: 'heat', L: 1, k: 1, nx: 21, dt: 0.001, tEnd: 0.1, u0: (x) => x * (1 - x) + (x > 0.5 ? 1 : 0), bc: 'free' });
  const u = hf.snapU.at(-1), trap = u.reduce((a, v, i) => a + v * (i === 0 || i === 20 ? 0.5 : 1), 0) / 20;
  check('ode: insulated heat equation conserves heat', near(trap, 0.64125, 1e-12));
  // Wave leapfrog, c = 1.5, dx = 0.025, dt = 0.01 (Courant 0.6), t = 1.3: NumPy u(L/2) = -0.8439255952409458 (with u_t = sin(πx/2)).
  const w = pde({ kind: 'wave', L: 2, k: 1.5, nx: 81, dt: 0.01, tEnd: 1.3, u0: (x) => Math.exp(-40 * (x - 1) ** 2), v0: (x) => Math.sin((Math.PI * x) / 2), bc: 'fixed' });
  check('ode: wave equation leapfrog matches NumPy', near(w.number, 0.6, 1e-12) && near(w.snapU.at(-1)[40], -0.8439255952409458, 1e-12));
  const ws = pde({ kind: 'wave', L: 1, k: 1, nx: 41, dt: 0.025, tEnd: 2, u0: (x) => Math.sin(Math.PI * x), bc: 'fixed' });
  check('ode: wave at Courant 1 follows the exact standing wave cos(πt) sin(πx)', ws.stable && ws.snapU.every((r, k) => near(r[20], Math.cos(Math.PI * ws.snapT[k]), 1e-3)));
};
