// #552 Chaos explorer. References: NumPy 2.5.4 / SciPy 1.18.1 run on 2026-11-09 (fsolve on f^p(x) = x, (f^p)'(x) = −1
// with analytic derivatives; Lyapunov sums with analytic f'; solve_ivp + numpy.linalg.qr for the flow spectra), and
// the known mathematical values: logistic map λ(4) = ln 2, period-doubling points r2 = 1 + √6, r∞ ≈ 3.569946,
// Feigenbaum δ = 4.6692; Lorenz (10, 28, 8/3) spectrum ≈ 0.9056, 0, −14.5723 with sum −(σ + 1 + β);
// Hénon (1.4, 0.3) exponents ≈ 0.4192, −1.6235 with sum ln 0.3.
import { parseMap, logistic, orbit, cobweb, lyapunov1, period, orbitDiagram, doublings, doublingPoint, lorenz, rossler, trajectory, flowLyapunov, kaplanYorke, henon, henonLyapunov, project } from '../../src/lib/sci/chaos.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const f = parseMap('r*x*(1 - x)');
  check('chaos: typed map equals the logistic map', f(0.3, 3.7) === logistic(0.3, 3.7));
  const err = (s) => { try { parseMap(s); return ''; } catch (e) { return e.message; } };
  check('chaos: map may use only x and r', err('a*x').includes('only x and r') && err('r*x*(1-x').includes('The map'));
  check('chaos: orbit and cobweb', orbit(f, 2, 0.5, 3).join() === '0.5,0.5,0.5,0.5' && cobweb([0.2, 0.5, 0.6]).length === 5 && cobweb([0.2, 0.5])[1].join() === '0.2,0.5');
  // NumPy with analytic f' (100 000 iterations after 1000): 2.8 → −0.223144, 3.5 → −0.872507, 3.7 → 0.353504, 4 → 0.693151.
  check('chaos: Lyapunov exponents of the logistic map match NumPy', [[2.8, -0.22314355], [3.2, -0.91629073], [3.5, -0.87250735], [3.7, 0.35350397], [3.83, -0.36965749], [4, 0.69315089]].every(([r, l]) => near(lyapunov1(f, r, 0.2, 100000, 1000), l, 1e-7)));
  check('chaos: λ(r = 4) = ln 2', near(lyapunov1(f, 4, 0.2, 400000), Math.LN2, 2e-3));
  check('chaos: λ at a stable fixed point is ln|f′| = ln|2 − r|', near(lyapunov1(f, 2.8), Math.log(0.8), 1e-9));
  check('chaos: periods 1, 2, 4, 8, 3 and chaos', period(f, 2.8) === 1 && period(f, 3.2) === 2 && period(f, 3.5) === 4 && period(f, 3.55) === 8 && period(f, 3.83) === 3 && period(f, 3.7) === 0);
  const od = orbitDiagram(f, 2.5, 4, 50, 0.2, 500, 100);
  check('chaos: orbit diagram stays in [0, 1]', od.r.length === 5000 && od.x.every((x) => x >= 0 && x <= 1));
  // Period-doubling points: SciPy fsolve 3.000000000000, 3.449489742783, 3.544090359552, 3.564407266095, 3.568759419544, 3.569691609801, 3.569891259378.
  const d = doublings(f, 2.5, 4);
  const ref = [3, 3.449489742783, 3.544090359552, 3.564407266095, 3.568759419544, 3.569691609801, 3.569891259378];
  check(`chaos: seven period-doubling points match SciPy to 1e-9 (${d.map((x) => x.r.toFixed(9)).join(', ')})`, d.length === 7 && d.every((x, i) => near(x.r, ref[i], 1e-9) && x.p === 2 ** i));
  check('chaos: r2 = 1 + √6', near(d[1].r, 1 + Math.sqrt(6), 1e-10));
  const ratio = (d[5].r - d[4].r) / (d[6].r - d[5].r);
  check(`chaos: gap ratios approach Feigenbaum's δ = 4.6692 (${ratio.toFixed(4)})`, near(ratio, 4.66913, 1e-3) && near((d[2].r - d[1].r) / (d[3].r - d[2].r), 4.656251, 1e-4));
  check('chaos: r∞ ≈ 3.569946 from the last points', near(d[6].r + (d[6].r - d[5].r) / 3.6692, 3.569946, 2e-6));
  check('chaos: doubling point for the sine map too', (() => { const s = parseMap('r*sin(pi*x)'); const p = doublingPoint(s, 1, 0.7, 0.72); return p && near(p.x, s(p.x, p.r), 1e-10); })());
  // Lorenz path: SciPy DOP853 (tol 1e-13) gives (−4.90268754, −3.74387292, 24.6908581) at t = 10; RK4 with h = 0.01 is within 1.1e-3.
  const tr = trajectory(lorenz(10, 28, 8 / 3), [1, 1, 1], 10, 0.01);
  check('chaos: Lorenz path by RK4 matches SciPy at t = 10', tr.length === 1001 && near(tr[1000][0], -4.90268754, 2e-3) && near(tr[1000][2], 24.6908581, 2e-3));
  const L = flowLyapunov(lorenz(10, 28, 8 / 3), [1, 1, 1], 1000, 0.01, 20).exps;
  check(`chaos: Lorenz spectrum ≈ 0.9056, 0, −14.5723 (${L.map((v) => v.toFixed(4)).join(', ')})`, near(L[0], 0.9056, 0.015) && near(L[1], 0, 0.01) && near(L[2], -14.5723, 0.015));
  check('chaos: Lorenz exponents add up to −(σ + 1 + β)', near(L[0] + L[1] + L[2], -(11 + 8 / 3), 1e-3));
  check('chaos: Kaplan-Yorke dimension of Lorenz ≈ 2.06', near(kaplanYorke(L), 2.062, 0.002) && kaplanYorke([-1, -2]) === 0 && near(kaplanYorke([0.5, 0, -1]), 2.5, 1e-12));
  const Rs = flowLyapunov(rossler(0.2, 0.2, 5.7), [1, 1, 1], 2000, 0.01, 50).exps;
  check(`chaos: Rössler spectrum ≈ 0.07, 0, −5.39 (${Rs.map((v) => v.toFixed(4)).join(', ')})`, near(Rs[0], 0.0714, 0.01) && near(Rs[1], 0, 0.01) && near(Rs[2], -5.394, 0.01));
  const Ls = flowLyapunov(lorenz(10, 15, 8 / 3), [1, 1, 1], 200, 0.01, 50).exps;
  check('chaos: Lorenz at ρ = 15 settles: largest exponent below 0', Ls[0] < -0.01);
  // Hénon: NumPy QR over 10⁶ steps gives 0.41949756, −1.62347037.
  const H = henonLyapunov(1.4, 0.3, 0, 0, 1000000);
  check(`chaos: Hénon exponents match NumPy (${H.map((v) => v.toFixed(5)).join(', ')})`, near(H[0], 0.41949756, 1e-6) && near(H[1], -1.62347037, 1e-6));
  check('chaos: Hénon exponents add up to ln b', near(H[0] + H[1], Math.log(0.3), 1e-9));
  const hp = henon(1.4, 0.3, 0, 0, 2000);
  check('chaos: Hénon attractor in its known box', !hp.escaped && hp.x.every((x) => x > -1.3 && x < 1.3) && hp.y.every((y) => Math.abs(y) < 0.4));
  check('chaos: Hénon with a = 2 escapes', henon(2, 0.3, 0, 0, 1000).escaped);
  const p = project([1, 2, 3], Math.PI / 2, 0);
  check('chaos: 3D view rotation', near(p[0], -2, 1e-12) && near(p[1], 3, 1e-12) && near(p[2], 1, 1e-12));
};
