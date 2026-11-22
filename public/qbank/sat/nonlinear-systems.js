// SAT Math · Advanced math · systems with a line and a parabola or circle. Original (fibub).
import { int, nz, choose, shuffleOpts, fmt, lin, quad, v, steps } from './_util.js';
const F = { section: 'math', domain: 'advanced' };
const X = v('x'), Y = v('y');

export default {
  topic: 'nonlinear-systems',
  gens: [
    { id: 'sat-ns-g01', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'parabola and horizontal line', facets: F, format: 'numeric',
      make(r) {
        const s = int(r, 1, 9), c = int(r, -10, 10), k = s * s + c;
        return { q: `<p>${Y} = ${quad(1, 0, c)}<br>${Y} = ${fmt(k)}</p><p>If (${X}, ${Y}) is a solution to the system above and ${X} &gt; 0, what is the value of ${X}?</p>`, answer: s, tol: 0, c, k,
          sol: steps(`Set the right sides equal: ${quad(1, 0, c)} = ${fmt(k)}.`, `${X}<sup>2</sup> = ${fmt(k - c)}, so ${X} = ±${s}.`, `The positive one is <b>${s}</b>.`) };
      },
      verify: (p) => Math.sqrt(p.k - p.c) },
    { id: 'sat-ns-g02', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'parabola and line', facets: F, format: 'numeric',
      make(r) {
        const p = int(r, -6, 6), q = int(r, -6, 6), c0 = int(r, -5, 5), ask = choose(r, ['sum', 'product']);
        if (p === q) return this.make(r);
        // y = x² + c0 and y = (p+q)x + (c0 − pq) meet at x = p and x = q.
        const m = p + q, b = c0 - p * q;
        return { q: `<p>${Y} = ${quad(1, 0, c0)}<br>${Y} = ${lin(m, b)}</p><p>The graphs of the equations above meet at two points. What is the ${ask === 'sum' ? 'sum' : 'product'} of their ${X}-coordinates?</p>`, answer: ask === 'sum' ? p + q : p * q, tol: 0, m, b, c0, ask,
          sol: steps(`Set equal: ${quad(1, 0, c0)} = ${lin(m, b)}.`, `Move everything to one side: ${quad(1, -m, c0 - b)} = 0.`, `${ask === 'sum' ? `The sum of the solutions of ${X}<sup>2</sup> + ${v('b')}${X} + ${v('c')} = 0 is −${v('b')} = ${fmt(m)}` : `The product of the solutions is ${v('c')} = ${fmt(c0 - b)}`}. (They are ${X} = ${fmt(p)} and ${X} = ${fmt(q)}.) Answer: <b>${fmt(ask === 'sum' ? p + q : p * q)}</b>.`) };
      },
      verify: (p) => (p.ask === 'sum' ? p.m : p.c0 - p.b) },
    { id: 'sat-ns-g03', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'number of intersections', facets: F, format: 'single',
      make(r) {
        const a = choose(r, [1, -1, 2, -2]), h = int(r, -4, 4), k = int(r, -6, 6), d = choose(r, [-3, -2, -1, 0, 1, 2, 3]), L = k + d;
        const n = d === 0 ? 1 : (d > 0) === (a > 0) ? 2 : 0;
        const right = ['Zero', 'Exactly one', 'Exactly two'][n];
        const o = shuffleOpts(r, right, ['Zero', 'Exactly one', 'Exactly two', 'Exactly three']);
        return { q: `<p>${Y} = ${a === 1 ? '' : a === -1 ? '−' : a}(${lin(1, -h)})<sup>2</sup> ${k < 0 ? '−' : '+'} ${Math.abs(k)}<br>${Y} = ${fmt(L)}</p><p>How many solutions does the system of equations above have?</p>`, ...o,
          sol: steps(`The parabola has vertex (${fmt(h)}, ${fmt(k)}) and opens ${a > 0 ? 'up' : 'down'}.`, `The line ${Y} = ${fmt(L)} is ${d === 0 ? 'exactly at the vertex: it touches once' : d > 0 ? 'above the vertex' : 'below the vertex'}.`, `So the graphs meet <b>${right.toLowerCase()}</b> time${n === 1 ? '' : 's'}.`) };
      } },
    { id: 'sat-ns-g04', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'circle and line', facets: F, format: 'numeric',
      make(r) {
        const [a, b, c] = choose(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), swap = r() < 0.5;
        const yk = swap ? a : b, xs = swap ? b : a;
        return { q: `<p>${X}<sup>2</sup> + ${Y}<sup>2</sup> = ${c * c}<br>${Y} = ${yk}</p><p>If (${X}, ${Y}) is a solution to the system above and ${X} &gt; 0, what is the value of ${X}?</p>`, answer: xs, tol: 0, c, yk,
          sol: steps(`Substitute ${Y} = ${yk}: ${X}<sup>2</sup> + ${yk * yk} = ${c * c}.`, `${X}<sup>2</sup> = ${c * c - yk * yk}.`, `${X} = <b>${xs}</b> (taking the positive root).`) };
      },
      verify: (p) => Math.sqrt(p.c * p.c - p.yk * p.yk) },
  ],
  items: [
    { id: 'sat-ns-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'tangent line', facets: F,
      q: '<p>In the system <i>y</i> = <i>x</i><sup>2</sup> + 4 and <i>y</i> = <i>kx</i>, <i>k</i> is a positive constant. For which value of <i>k</i> does the system have exactly one solution?</p>',
      options: ['4', '2', '8', '16'], answer: 0,
      sol: '<p><i>x</i><sup>2</sup> + 4 = <i>kx</i> gives <i>x</i><sup>2</sup> − <i>kx</i> + 4 = 0. One solution means discriminant zero: <i>k</i><sup>2</sup> − 16 = 0, so <i>k</i> = 4 (positive). The line just touches the parabola at (2, 8).</p>' },
  ],
};
