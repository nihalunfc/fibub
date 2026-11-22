// SAT Math · Advanced math · quadratic equations and parabolas. Original (fibub).
import { int, nz, choose, shuffleOpts, fmt, quad, v, steps } from './_util.js';
const F = { section: 'math', domain: 'advanced' };
const X = v('x');

export default {
  topic: 'quadratics',
  gens: [
    { id: 'sat-qd-g01', type: 'nat', level: 2, exams: ['sat'], sub: 'solve by factoring', facets: F, format: 'numeric',
      make(r) {
        const p = int(r, -9, 9), q = int(r, -9, 9), ask = choose(r, ['larger', 'smaller', 'sum', 'product']);
        const B = -(p + q), C = p * q;
        const ans = ask === 'larger' ? Math.max(p, q) : ask === 'smaller' ? Math.min(p, q) : ask === 'sum' ? p + q : p * q;
        if (p === q && (ask === 'larger' || ask === 'smaller')) return this.make(r);
        return { q: `<p>${quad(1, B, C)} = 0</p><p>What is the ${ask === 'sum' ? 'sum of the solutions' : ask === 'product' ? 'product of the solutions' : ask + ' solution'} of the equation above?</p>`, answer: ans, tol: 0, B, C, ask,
          sol: steps(`Find two numbers that multiply to ${fmt(C)} and add to ${fmt(B)}: ${fmt(-p)} and ${fmt(-q)}.`, `So (${X} ${p < 0 ? '+' : '−'} ${Math.abs(p)})(${X} ${q < 0 ? '+' : '−'} ${Math.abs(q)}) = 0, giving ${X} = ${fmt(p)} or ${X} = ${fmt(q)}.`, `The answer is <b>${fmt(ans)}</b>.${ask === 'sum' || ask === 'product' ? ` Shortcut: for ${X}<sup>2</sup> + ${v('b')}${X} + ${v('c')} = 0, the sum of solutions is −${v('b')} and the product is ${v('c')}.` : ''}`) };
      },
      verify: (p) => { const d = Math.sqrt(p.B * p.B - 4 * p.C), a = (-p.B + d) / 2, b = (-p.B - d) / 2; return { larger: a, smaller: b, sum: a + b, product: a * b }[p.ask]; } },
    { id: 'sat-qd-g02', type: 'nat', level: 2, exams: ['sat'], sub: 'vertex', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -3, 3), h = int(r, -6, 6), k = int(r, -10, 10), ask = choose(r, ['h', 'k']);
        const B = -2 * a * h, C = a * h * h + k;
        return { q: `<p>The graph of ${v('y')} = ${quad(a, B, C)} in the ${v('xy')}-plane is a parabola with vertex (${v('h')}, ${v('k')}). What is the value of ${v(ask)}?</p>`, answer: ask === 'h' ? h : k, tol: 0, a, B, C, ask,
          sol: steps(`The vertex is at ${X} = −${v('b')}/(2${v('a')}) = −(${fmt(B)})/(2 × ${fmt(a)}) = ${fmt(h)}.`, `Put it back in: ${v('y')} = ${fmt(a)}(${fmt(h)})<sup>2</sup> ${B * h < 0 ? '−' : '+'} ${fmt(Math.abs(B * h))} + ${fmt(C)} = ${fmt(k)}.`, `So ${v(ask)} = <b>${fmt(ask === 'h' ? h : k)}</b>.`) };
      },
      verify: (p) => { const h = -p.B / (2 * p.a); return p.ask === 'h' ? h : p.a * h * h + p.B * h + p.C; } },
    { id: 'sat-qd-g03', type: 'mcq', level: 2, exams: ['sat'], sub: 'discriminant', facets: F, format: 'single',
      make(r) {
        const a = nz(r, -4, 4), b = int(r, -10, 10), kind = choose(r, [0, 1, 2]);
        let c;
        if (kind === 1 && b % 2 === 0 && (b * b / 4) % a === 0) c = b * b / (4 * a);
        else if (kind === 0) c = Math.floor(b * b / (4 * a)) + (a > 0 ? int(r, 1, 6) : -int(r, 1, 6));
        else c = Math.floor(b * b / (4 * a)) - (a > 0 ? int(r, 1, 6) : -int(r, 1, 6));
        const D = b * b - 4 * a * c, n = D > 0 ? 2 : D === 0 ? 1 : 0;
        const right = ['No real solutions', 'Exactly one real solution', 'Exactly two real solutions'][n];
        const o = shuffleOpts(r, right, ['No real solutions', 'Exactly one real solution', 'Exactly two real solutions', 'Infinitely many real solutions']);
        return { q: `<p>How many distinct real solutions does the equation ${quad(a, b, c)} = 0 have?</p>`, ...o,
          sol: steps(`Use the discriminant ${v('b')}<sup>2</sup> − 4${v('a')}${v('c')} = (${fmt(b)})<sup>2</sup> − 4(${fmt(a)})(${fmt(c)}) = ${fmt(D)}.`, `Positive means two solutions, zero means one, negative means none.`, `${fmt(D)} is ${D > 0 ? 'positive' : D === 0 ? 'zero' : 'negative'}: <b>${right.toLowerCase()}</b>.`) };
      } },
    { id: 'sat-qd-g04', type: 'nat', level: 3, exams: ['sat'], sub: 'one solution', facets: F, format: 'numeric',
      make(r) {
        const h = nz(r, -9, 9), b = 2 * h;
        return { q: `<p>In the equation ${X}<sup>2</sup> ${b < 0 ? '−' : '+'} ${Math.abs(b)}${X} + ${v('c')} = 0, ${v('c')} is a constant. If the equation has exactly one real solution, what is the value of ${v('c')}?</p>`, answer: h * h, tol: 0, b,
          sol: steps(`Exactly one solution means the discriminant is zero: ${fmt(b)}<sup>2</sup> − 4(1)${v('c')} = 0.`, `${fmt(b * b)} = 4${v('c')}, so ${v('c')} = <b>${h * h}</b>.`, `Then the equation is (${X} ${h < 0 ? '−' : '+'} ${Math.abs(h)})<sup>2</sup> = 0, a perfect square.`) };
      },
      verify: (p) => (p.b * p.b) / 4 },
    { id: 'sat-qd-g05', type: 'nat', level: 3, exams: ['sat'], sub: 'projectile', facets: F, format: 'numeric',
      make(r) {
        const t = choose(r, [1, 1.5, 2, 2.5, 3, 3.5, 4]), h0 = int(r, 0, 20) * 5, v0 = 32 * t, hmax = h0 + 16 * t * t;
        const ask = choose(r, ['max', 'time']);
        return { q: `<p>A ball is thrown upward. Its height ${v('h')}, in feet, ${v('t')} seconds later is ${v('h')} = −16${v('t')}<sup>2</sup> + ${v0}${v('t')}${h0 ? ' + ' + h0 : ''}. ${ask === 'max' ? 'What is the greatest height, in feet, the ball reaches?' : 'How many seconds after the throw does the ball reach its greatest height?'}</p>`, answer: ask === 'max' ? hmax : t, tol: 0, v0, h0, ask,
          sol: steps(`The top of the parabola is at ${v('t')} = −${v('b')}/(2${v('a')}) = −${v0}/(2 × −16) = ${fmt(t)} s.`, `Height then: −16(${fmt(t)})<sup>2</sup> + ${v0}(${fmt(t)})${h0 ? ' + ' + h0 : ''} = ${fmt(hmax)} feet.`, `Answer: <b>${fmt(ask === 'max' ? hmax : t)}</b>.`) };
      },
      verify: (p) => { const t = p.v0 / 32; return p.ask === 'max' ? -16 * t * t + p.v0 * t + p.h0 : t; } },
    { id: 'sat-qd-g06', type: 'nat', level: 3, exams: ['sat'], sub: 'quadratic formula', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 1, 3), b = int(r, -12, 12), c = -int(r, 1, 20);
        const D = b * b - 4 * a * c, x = (-b + Math.sqrt(D)) / (2 * a);
        return { q: `<p>What is the positive solution to ${quad(a, b, c)} = 0? Round to the nearest hundredth.</p>`, answer: Math.round(x * 100) / 100, tol: 0.01, a, b, c,
          sol: steps(`Use ${X} = (−${v('b')} ± √(${v('b')}<sup>2</sup> − 4${v('a')}${v('c')}))/(2${v('a')}).`, `Discriminant: (${fmt(b)})<sup>2</sup> − 4(${a})(${fmt(c)}) = ${D}.`, `${X} = (${fmt(-b)} + √${D})/${2 * a} ≈ <b>${fmt(Math.round(x * 100) / 100)}</b>. (The other solution is negative.) In Desmos, graph ${v('y')} = ${quad(a, b, c)} and click where it crosses the ${X}-axis.`) };
      },
      verify: (p) => Math.round(((-p.b + Math.sqrt(p.b * p.b - 4 * p.a * p.c)) / (2 * p.a)) * 100) / 100 },
  ],
  items: [
    { id: 'sat-qd-001', type: 'mcq', level: 2, exams: ['sat'], sub: 'forms', facets: F,
      q: '<p>Which form of the function <i>f</i>(<i>x</i>) = <i>x</i><sup>2</sup> − 6<i>x</i> + 5 shows the <i>x</i>-intercepts of its graph as constants or coefficients?</p>',
      options: ['<i>f</i>(<i>x</i>) = (<i>x</i> − 1)(<i>x</i> − 5)', '<i>f</i>(<i>x</i>) = (<i>x</i> − 3)<sup>2</sup> − 4', '<i>f</i>(<i>x</i>) = <i>x</i>(<i>x</i> − 6) + 5', '<i>f</i>(<i>x</i>) = <i>x</i><sup>2</sup> − 6<i>x</i> + 5'], answer: 0,
      sol: '<p>Factored form shows the zeros: <i>x</i> = 1 and <i>x</i> = 5. Vertex form, (<i>x</i> − 3)<sup>2</sup> − 4, shows the vertex (3, −4) instead. Standard form shows the <i>y</i>-intercept, 5.</p>' },
    { id: 'sat-qd-002', type: 'mcq', level: 3, exams: ['sat'], sub: 'graph', facets: F,
      q: '<p>The parabola <i>y</i> = <i>a</i>(<i>x</i> − 2)<sup>2</sup> + <i>k</i> opens downward and has no <i>x</i>-intercepts. Which must be true?</p>',
      options: ['<i>a</i> &lt; 0 and <i>k</i> &lt; 0', '<i>a</i> &lt; 0 and <i>k</i> &gt; 0', '<i>a</i> &gt; 0 and <i>k</i> &lt; 0', '<i>a</i> &gt; 0 and <i>k</i> &gt; 0'], answer: 0,
      sol: '<p>Opens downward means <i>a</i> &lt; 0, so the vertex (2, <i>k</i>) is the highest point. For the graph never to reach the <i>x</i>-axis, that highest point must be below it: <i>k</i> &lt; 0.</p>' },
  ],
};
