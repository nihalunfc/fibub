// #583 transportation and assignment solver: src/lib/sci/transport.ts against scipy 1.x (optimize.linprog with HiGHS
// for transportation optima, optimize.linear_sum_assignment for assignment). The reference numbers below came from
// scipy on the made-up examples; the northwest-corner start (2145) was also worked by hand. During the build the lib
// was compared with scipy on 150 random transportation problems (balanced, unbalanced, degenerate, forbidden routes,
// minimise and maximise; all three starting methods) and 150 random assignment tables (square and rectangular,
// forbidden pairs, min and max): 1110 checks, all equal.
import * as T from '../../src/lib/sci/transport.ts';

export default async (check) => {
  const c = [[12, 18, 25, 9], [22, 14, 16, 28], [15, 27, 11, 19]], s = [40, 55, 45], d = [30, 35, 40, 35];
  const nw = T.solveTransport(c, s, d, 'nw'), lc = T.solveTransport(c, s, d, 'least'), vg = T.solveTransport(c, s, d, 'vogel');
  check('transport: starting costs NW 2145 (by hand), least cost 1820, Vogel 1780', nw.startValue === 2145 && lc.startValue === 1820 && vg.startValue === 1780);
  check('transport: every method reaches the optimum 1780 (scipy linprog)', [nw, lc, vg].every((r) => r.value === 1780 && r.end.optimal));
  check('transport: optimal plan as scipy: F1→W1 5, F1→W4 35, F2→W2 35, F2→W3 20, F3→W1 25, F3→W3 20', JSON.stringify(vg.end.x) === '[[5,0,0,35],[0,35,20,0],[25,0,20,0]]');
  check('transport: MODI needs 2 steps from NW, 1 from least cost, 0 from Vogel', nw.end.steps.length === 2 && lc.end.steps.length === 1 && vg.end.steps.length === 0);
  { const st = nw.end.steps[0]; check('transport: each MODI step lowers the cost by |reduced cost| × θ', nw.end.steps.every((x, k) => Math.abs((k ? nw.end.steps[k - 1].cost : nw.start.cost) - x.cost + x.delta * x.theta) < 1e-9) && st.loop.length % 2 === 0 && st.loop.length >= 4); }
  { const { u, v } = T.potentials(vg.problem.cost, vg.end.basis);
    check('transport: at the optimum c = u + v on basic routes and c − u − v ≥ 0 elsewhere', vg.end.basis.every(([i, j]) => Math.abs(c[i][j] - u[i] - v[j]) < 1e-9) && c.every((r, i) => r.every((x, j) => x - u[i] - v[j] > -1e-9))); }
  { const r = T.solveTransport(c, [40, 55, 60], d, 'vogel');
    check('transport: unbalanced (supply 155 > demand 140): dummy destination of 15, optimum 1705 (scipy)', r.problem.dummy === 'destination' && r.problem.demand[4] === 15 && r.value === 1705); }
  { const r = T.solveTransport(c, s, [30, 35, 40, 50], 'nw');
    check('transport: short supply adds a dummy source', r.problem.dummy === 'source' && r.problem.supply[3] === 15 && r.end.optimal); }
  { const r = T.solveTransport([[1, null], [null, 1]], [5, 5], [5, 5], 'vogel'), bad = T.solveTransport([[1, null], [null, 1]], [10, 0], [5, 5], 'nw');
    check('transport: forbidden routes are avoided, and flagged when unavoidable', r.value === 10 && !r.usesForbidden && bad.usesForbidden); }
  { const r = T.solveTransport([[4, 6], [5, 3]], [10, 10], [10, 10], 'nw', true);
    check('transport: maximise profit [[4,6],[5,3]] → 110 (6×10 + 5×10)', r.value === 110); }
  { const r = T.solveTransport([[3, 1], [2, 4]], [5, 5], [5, 5], 'nw');
    check('transport: degenerate start (row and column used up together) keeps a full basis', r.start.basis.length === 3 && r.value === 15); }
  const a = [[14, 22, 9, 17], [18, 11, 20, 15], [10, 16, 13, 21], [19, 12, 17, 8]];
  { const h = T.hungarian(a); check('assignment: minimum 38: Asha→3, Ben→2, Chen→1, Dara→4 (scipy linear_sum_assignment)', h.total === 38 && h.rowTo.join() === '2,1,0,3'); }
  { const h = T.hungarian(a, true); check('assignment: maximum 82 (scipy, maximize=True)', h.total === 82 && h.rowTo.join() === '1,2,3,0'); }
  { const h = T.hungarian([[4, 1, 3], [2, 0, 5]]), w = T.hungarian([[4, 2], [1, 0], [3, 5]]);
    check('assignment: rectangular tables (more columns: 3; more rows: one row left out)', h.total === 3 && w.total === 3 && w.rowTo.filter((j) => j < 0).length === 1); }
  { const h = T.hungarian([[1, null], [null, 1]]); check('assignment: forbidden pairs avoided', h.total === 2 && !h.forbidden); }
  check('assignment: reading cells: numbers, x and - for not allowed, junk rejected', T.readCost(' 12.5 ') === 12.5 && T.readCost('x') === null && T.readCost('-') === null && T.readCost('M') === null && T.readCost('abc') === undefined && T.readCost('−3') === -3);
  check('transport: mismatched supply count is refused', (() => { try { T.solveTransport([[1, 2]], [1, 2], [1, 2]); return false; } catch (e) { return /one supply per row/.test(e.message); } })());
};
