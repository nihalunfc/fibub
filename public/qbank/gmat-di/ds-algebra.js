// Data Sufficiency: algebra with two integers x and y (equations, squares, signs, products).
import { judge, explain, dsq, say, aim, DS, int, choose } from './_ds.js';
const E = ['gmat'];
// Cases are listed smallest first, so the worked examples use small numbers. The final answer uses a wide grid.
const grid = (R) => { const u = []; for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) u.push([x, y]); return u.sort((a, b) => Math.abs(a[0]) + Math.abs(a[1]) - Math.abs(b[0]) - Math.abs(b[1])); };
const G20 = grid(20), G100 = grid(100), G150 = grid(150);
const sg = (v) => (v < 0 ? '−' + -v : v);
const lin = (a, b, c) => `${a === 1 ? '' : a === -1 ? '−' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${c < 0 ? '−' + -c : c}`;
function pool(x0, y0) {
  const P = [
    { t: `${lin(1, 1, x0 + y0)}.`, f: ([x, y]) => x + y === x0 + y0 },
    { t: `${lin(1, -1, x0 - y0)}.`, f: ([x, y]) => x - y === x0 - y0 },
    { t: `${lin(2, 2, 2 * (x0 + y0))}.`, f: ([x, y]) => 2 * x + 2 * y === 2 * (x0 + y0) },
    { t: `${lin(3, -1, 3 * x0 - y0)}.`, f: ([x, y]) => 3 * x - y === 3 * x0 - y0 },
    { t: `${lin(1, 2, x0 + 2 * y0)}.`, f: ([x, y]) => x + 2 * y === x0 + 2 * y0 },
    { t: `y = ${y0 < 0 ? '−' + -y0 : y0}.`, f: ([, y]) => y === y0 },
    { t: `x² = ${x0 * x0}.`, f: ([x]) => x * x === x0 * x0 },
    { t: x0 >= 0 ? 'x ≥ 0.' : 'x < 0.', f: ([x]) => (x0 >= 0 ? x >= 0 : x < 0) },
    { t: y0 > 0 ? 'y > 0.' : 'y ≤ 0.', f: ([, y]) => (y0 > 0 ? y > 0 : y <= 0) },
    { t: `xy = ${x0 * y0 < 0 ? '−' + -(x0 * y0) : x0 * y0}.`, f: ([x, y]) => x * y === x0 * y0 },
  ];
  return P;
}
const QS = [
  { t: 'What is the value of x?', ask: ([x]) => x, need: 'one single value of x.' },
  { t: 'What is the value of x + y?', ask: ([x, y]) => x + y, need: 'one value of the sum x + y (you do not need x and y separately).' },
  { t: 'What is the value of xy?', ask: ([x, y]) => x * y, need: 'one value of the product xy.' },
  { t: 'Is x greater than y?', ask: ([x, y]) => x > y, need: 'a yes-or-no answer about whether x is bigger than y.' },
  { t: 'Is x positive?', ask: ([x]) => x > 0, need: 'a yes-or-no answer about the sign of x.' },
];
const TIP = 'Two different linear equations in x and y pin down both. A multiple of the same equation (like 2x + 2y and x + y) adds nothing new. A square like x² = 9 leaves two values, 3 and −3.';
const gen = (id, sub, qs) => ({ id, type: 'mcq', level: 3, exams: E, format: 'ds', sub,
      make(r) {
        const best = aim(r, 60, () => {
          const x0 = int(r, -9, 9), y0 = int(r, -9, 9), P = pool(x0, y0), Q = QS[choose(r, qs)];
          const i = int(r, 0, P.length - 1); let k = int(r, 0, P.length - 2); if (k >= i) k++;
          return { x0, y0, Q, i, k, s1: P[i], s2: P[k], j: judge(G20, Q.ask, P[i].f, P[k].f) };
        });
        const { Q, s1, s2 } = best, j = judge(G100, Q.ask, s1.f, s2.f), show = ([x, y]) => `x = ${sg(x)}, y = ${sg(y)}`;
        return { q: dsq(`x and y are integers. ${Q.t}`, s1.t, s2.t), options: DS.slice(), answer: j.ans, value: j.ans,
          sol: explain(j, show, say, Q.need, TIP), hint: 'Count equations, and watch for squares and repeated equations.', _p: [best.x0, best.y0, best.i, best.k, QS.indexOf(Q)] };
      },
      check(p) { const [x0, y0, i, k, qi] = p._p, P = pool(x0, y0); return judge(G150, QS[qi].ask, P[i].f, P[k].f).ans; } });
export default {
  topic: 'ds-algebra',
  gens: [gen('dsa-g01', 'algebra', [0, 1, 2, 3, 4]), gen('dsa-g02', 'algebra: value questions', [0, 1, 2]), gen('dsa-g03', 'algebra: yes-or-no questions', [3, 4])],
};
