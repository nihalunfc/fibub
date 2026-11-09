// #674 load flow. Reference values from an independent NumPy Newton-Raphson written for this check (complex
// admittance matrix with MATPOWER-style dS/dV Jacobian, solved to 1e-12), on fibub's made-up 5-bus example and two
// random networks. Both our Newton-Raphson and Gauss-Seidel must reproduce them.
import { loadFlow, parseBuses, parseLines, ybus, solve, EXAMPLE_BUSES, EXAMPLE_LINES } from '../../src/lib/sci/eng-loadflow.ts';

const EX = { V: [1.03, 1.01, 0.96279009, 0.98775352, 0.95135411], deg: [0.0, -2.124013, -6.270015, -3.893664, -7.370953], P: [114.56169, 50.0, -55.0, -40.0, -65.0], Q: [35.71988, 20.76258, -18.0, -14.0, -22.0], flows: [[51.38434, 14.88706, -50.97012, -16.83988], [63.17735, 20.83282, -61.90648, -18.80417], [77.98665, 29.71001, -76.2647, -24.76926], [22.98347, 7.89245, -22.74338, -9.48682], [21.2647, 6.76926, -21.15435, -8.10476], [44.64986, 14.29099, -43.84565, -13.89524]] };
const CASES = [
  { b: [['1', 'slack', 0, 0, 0.0, 1.02], ['2', 'PV', 18.6, 4.8, 60.0, 1.0], ['3', 'PQ', 10.3, 12.2, 0.0, 1], ['4', 'PQ', 18.3, 14.7, 0.0, 1], ['5', 'PQ', 25.6, 9.1, 0.0, 1]], l: [['1', '2', 0.036, 0.151, 0.008], ['2', '3', 0.02, 0.11, 0.005], ['2', '4', 0.049, 0.082, 0.034], ['1', '5', 0.045, 0.149, 0.007], ['2', '5', 0.048, 0.186, 0.01], ['3', '4', 0.018, 0.189, 0.01]], V: [1.02, 1.0, 0.98367952, 0.98139166, 0.99808781], deg: [0.0, 0.356031, -0.170744, -0.182987, -0.924525], flows: [[-0.92108, 13.32641, 0.98672, -13.86724], [10.57647, 12.70161, -10.52055, -12.88595], [18.3123, 10.10335, -18.07972, -13.05144], [14.27924, 10.41257, -14.14082, -10.66704], [11.52451, -2.31199, -11.45918, 1.56704], [0.22055, 0.68595, -0.22028, -1.64856]] },
  { b: [['1', 'slack', 0, 0, 0.0, 1.02], ['2', 'PQ', 24.3, 2.7, 0.0, 1.0], ['3', 'PQ', 35.9, 9.6, 0.0, 1]], l: [['1', '2', 0.033, 0.106, 0.021], ['1', '3', 0.012, 0.181, 0.023], ['1', '3', 0.023, 0.163, 0.01]], V: [1.02, 1.01004573, 1.00961024], deg: [0.0, -1.402744, -1.67579], flows: [[24.49186, 1.15267, -24.3, -2.7], [16.96808, 3.77693, -16.93202, -5.60167], [19.05191, 3.56327, -18.96798, -3.99833]] },
];

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const buses = parseBuses(EXAMPLE_BUSES), lines = parseLines(EXAMPLE_LINES);
  check('load flow: example tables parse (5 buses, 6 lines, header rows skipped)', buses.length === 5 && lines.length === 6 && buses[1].type === 'PV' && lines[5].B === 0.03);
  for (const method of ['nr', 'gs']) {
    const r = loadFlow(buses, lines, { base: 100, method, tol: 1e-10, maxIter: method === 'nr' ? 20 : 5000 });
    check(`load flow ${method}: converged (${r.iterations} iterations)`, r.converged && (method === 'nr' ? r.iterations <= 6 : r.iterations > 10));
    check(`load flow ${method}: example voltages match NumPy to 1e-7 pu`, r.buses.every((b, i) => near(b.V, EX.V[i], 1e-7)));
    check(`load flow ${method}: example angles match NumPy to 1e-5 degree`, r.buses.every((b, i) => near(b.deg, EX.deg[i], 1e-5)));
    check(`load flow ${method}: bus injections match (slack 114.562 MW, 35.720 Mvar)`, r.buses.every((b, i) => near(b.P, EX.P[i], 1e-4) && near(b.Q, EX.Q[i], 1e-4)) && near(r.buses[0].Pg, 114.5617, 1e-3));
    check(`load flow ${method}: line flows at both ends match`, r.lines.every((l, i) => [l.Pij, l.Qij, l.Pji, l.Qji].every((v, k) => near(v, EX.flows[i][k], 1e-4))));
    check(`load flow ${method}: losses = generation − load (${r.lossP.toFixed(4)} MW)`, near(r.lossP, r.genP - r.loadP, 1e-6) && near(r.lossP, 4.56169, 1e-4) && near(r.lossQ, r.genQ - r.loadQ, 1e-6));
  }
  CASES.forEach((c, n) => {
    const b = c.b.map((x) => ({ id: x[0], type: x[1], Pd: x[2], Qd: x[3], Pg: x[4], V: x[5] })), l = c.l.map((x) => ({ from: x[0], to: x[1], R: x[2], X: x[3], B: x[4] }));
    for (const method of ['nr', 'gs']) {
      const r = loadFlow(b, l, { base: 100, method, tol: 1e-10, maxIter: 5000 });
      check(`load flow ${method}: random network ${n + 1} (${b.length} buses, parallel lines) matches NumPy`, r.converged && r.buses.every((x, i) => near(x.V, c.V[i], 1e-7) && near(x.deg, c.deg[i], 1e-5)) && r.lines.every((x, i) => [x.Pij, x.Qij, x.Pji, x.Qji].every((v, k) => near(v, c.flows[i][k], 1e-4))));
    }
  });
  // Two-bus case by hand: lossless line X = 0.1, 50 MW from a 1.0 pu slack to a PV bus at 1.0 pu: sin δ = P X / (V1 V2) = 0.05.
  { const r = loadFlow([{ id: 'A', type: 'slack', Pd: 0, Qd: 0, Pg: 0, V: 1 }, { id: 'B', type: 'PV', Pd: 50, Qd: 0, Pg: 0, V: 1 }], [{ from: 'A', to: 'B', R: 0, X: 0.1, B: 0 }], { base: 100, method: 'nr' });
    check('load flow: two-bus lossless line gives δ = −asin(0.05)', near(r.buses[1].deg, -Math.asin(0.05) * 180 / Math.PI, 1e-9) && near(r.lossP, 0, 1e-9)); }
  { const { G, B } = ybus(2, [{ i: 0, j: 1, R: 0.01, X: 0.1, B: 0.02 }]); const d = 0.01 ** 2 + 0.1 ** 2;
    check('load flow: Ybus entries', near(G[0][0], 0.01 / d, 1e-12) && near(B[0][1], 0.1 / d, 1e-9) && near(B[1][1], -0.1 / d + 0.01, 1e-9)); }
  check('load flow: linear solver with pivoting', solve([[0, 2], [3, 1]], [4, 5]).every((x, i) => near(x, [1, 2][i], 1e-12)));
  const err = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('load flow: no slack bus is refused', /must be the slack/.test(err(() => loadFlow(buses.map((b) => ({ ...b, type: 'PQ' })), lines, { base: 100, method: 'nr' }))));
  check('load flow: island is refused', /not connected/.test(err(() => loadFlow(buses, lines.filter((l) => l.to !== '5' && l.from !== '5'), { base: 100, method: 'nr' }))));
  check('load flow: unknown bus in a line is refused', /not in the bus table/.test(err(() => loadFlow(buses, [...lines, { from: '1', to: '9', R: 0, X: 0.1, B: 0 }], { base: 100, method: 'nr' }))));
  check('load flow: zero impedance is refused', /not zero/.test(err(() => loadFlow(buses, [...lines, { from: '1', to: '3', R: 0, X: 0, B: 0 }], { base: 100, method: 'nr' }))));
  check('load flow: bad bus type message', /slack, PV or PQ/.test(err(() => parseBuses('1, slack, 0,0,0,1\n2, gen2, 1,1,0,1'))));
  // A load far beyond what the line can carry has no solution: it must report not converged, not a wrong answer.
  { const r = loadFlow([{ id: 'A', type: 'slack', Pd: 0, Qd: 0, Pg: 0, V: 1 }, { id: 'B', type: 'PQ', Pd: 900, Qd: 300, Pg: 0, V: 1 }], [{ from: 'A', to: 'B', R: 0.02, X: 0.2, B: 0 }], { base: 100, method: 'nr' });
    check('load flow: impossible load does not converge', !r.converged); }
};
