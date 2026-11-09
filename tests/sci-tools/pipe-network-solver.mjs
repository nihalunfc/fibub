// #660 pipe network pressure drop. Reference values from an independent Python solver written for these
// checks (SciPy fsolve on all pipe-energy and node-continuity equations at once, Colebrook by brentq), and
// water properties from the Python iapws package (IAPWS-95).
import { colebrook, swameeJain, friction, pipeFlow, flowForHead, solveNewton, solveHardyCross, checkNetwork, water, G } from '../../src/lib/sci/pipenet.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.max(Math.abs(b), 1e-300);
  check('pipenet: Colebrook Re 1e5, e/D 1e-4 (SciPy 0.0185138661)', near(colebrook(1e5, 1e-4), 0.018513866077471648, 1e-10));
  check('pipenet: Colebrook Re 5e6, e/D 0.01 (SciPy 0.0379159372)', near(colebrook(5e6, 0.01), 0.03791593719028166, 1e-10));
  check('pipenet: Swamee-Jain within 1.5 % of Colebrook', [[5e3, 0], [1e5, 1e-4], [1e7, 1e-3], [1e6, 0.02]].every(([R, e]) => near(swameeJain(R, e), colebrook(R, e), 0.015)));
  check('pipenet: laminar f = 64/Re', friction(1000, 0.01) === 0.064);
  check('pipenet: transition blend is continuous', near(friction(2000.0001, 1e-4), 0.032, 1e-6) && near(friction(3999.999, 1e-4), colebrook(4000, 1e-4), 1e-6));
  const fl = { rho: 998.2336361398824, mu: 0.0010017487594089526 };
  { // Hagen-Poiseuille: h = 32 mu L V / (rho g D^2)
    const p = { L: 100, D: 0.01, eps: 0, K: 0 }, Q = 5e-6, r = pipeFlow(p, Q, fl), V = Q / (Math.PI * 1e-4 / 4);
    check('pipenet: laminar head loss equals Hagen-Poiseuille', r.regime === 'laminar' && near(r.h, 32 * fl.mu * 100 * V / (fl.rho * G * 1e-4), 1e-12));
  }
  { const p = { L: 250, D: 0.15, eps: 5e-5, K: 3.5 }, r = pipeFlow(p, 0.025, fl);
    check('pipenet: example pipe (25 L/s, 250 m of 150 mm) head loss 3.385 m', near(r.h, 3.385431571253381, 1e-9) && near(r.V, 1.41471, 1e-5));
    check('pipenet: flow for a head returns the flow', near(flowForHead(p, r.h, fl), 0.025, 1e-9));
    check('pipenet: reversed flow gives negative head loss', near(pipeFlow(p, -0.025, fl).h, -r.h, 1e-12)); }
  { const w20 = water(20), w80 = water(80);
    check('pipenet: water density at 20 and 80 °C within 0.1 % of IAPWS-95 (998.207, 971.790)', near(w20.rho, 998.2071504679384, 1e-3) && near(w80.rho, 971.7903980965832, 1e-3));
    check('pipenet: water viscosity at 20 and 80 °C within 1.5 % of IAPWS (1.00160, 0.35405 mPa s)', near(w20.mu, 0.0010015961431205922, 0.015) && near(w80.mu, 0.0003540506538764511, 0.015)); }
  const N = (name, z, d, head) => ({ name, z, demand: d / 1000, head });
  const P = (name, from, to, L, D, eps, K) => ({ name, from, to, L, D: D / 1000, eps: eps / 1000, K });
  const nodes = [N('R', 50, 0, 60), N('J1', 20, 0), N('J2', 18, 15), N('J3', 15, 20), N('J4', 16, 10), N('J5', 14, 15), N('T', 40, 0, 52)];
  const pipes = [P('P1', 'R', 'J1', 500, 300, 0.05, 2), P('P2', 'J1', 'J2', 400, 200, 0.05, 0), P('P3', 'J1', 'J3', 600, 200, 0.05, 0), P('P4', 'J2', 'J4', 500, 150, 0.05, 0), P('P5', 'J3', 'J4', 400, 150, 0.05, 0), P('P6', 'J4', 'J5', 300, 150, 0.05, 0), P('P7', 'J3', 'J5', 450, 150, 0.05, 0), P('P8', 'J5', 'T', 300, 100, 0.05, 1.5)];
  const pyQ = [0.06626512802296068, 0.029783571238000975, 0.0364815567849597, 0.014783571238000975, 0.005941856554159388, 0.010725427792160363, 0.01053970023080031, 0.006265128022960673];
  const pyH = { J1: 58.705964362847425, J2: 57.09816921337342, J3: 55.17690796639696, J4: 54.8385120842083, J5: 54.09057273872084 };
  for (const [nm, solve, tol] of [['Newton', solveNewton, 1e-9], ['Hardy Cross', solveHardyCross, 1e-6]]) {
    const r = solve(nodes, pipes, fl);
    check(`pipenet: ${nm} converges on the two-reservoir example (3 loops)`, r.converged && r.loops === 3);
    check(`pipenet: ${nm} flows match the SciPy solver`, r.Q.every((q, i) => Math.abs(q - pyQ[i]) < tol * 0.07));
    check(`pipenet: ${nm} heads match the SciPy solver`, Object.entries(pyH).every(([k, v]) => Math.abs(r.H[k] - v) < tol * 60));
    check(`pipenet: ${nm} continuity and reservoir balance`, r.maxImbalance < 1e-12 && near(r.supply.R + r.supply.T, 0.06, 1e-8));
  }
  { // A single pipe between two reservoirs: the network solver must agree with flowForHead.
    const n2 = [N('A', 0, 0, 30), N('B', 0, 0, 10)], p2 = [P('X', 'A', 'B', 1000, 200, 0.1, 1)], r = solveNewton(n2, p2, fl), h = solveHardyCross(n2, p2, fl);
    check('pipenet: two reservoirs and one pipe match the single-pipe answer', near(r.Q[0], flowForHead(p2[0], 20, fl), 1e-9) && near(h.Q[0], r.Q[0], 1e-7)); }
  check('pipenet: network checks catch missing reservoir and loose nodes', checkNetwork([N('A', 0, 1)], []).includes('reservoir') && checkNetwork([N('A', 0, 0, 5), N('B', 0, 1)], []).includes('not connected') && checkNetwork([N('A', 0, 0, 5)], [P('X', 'A', 'Z', 1, 100, 0, 0)]).includes('not in the node list'));
};
