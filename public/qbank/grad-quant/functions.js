import { int, choose, fmt, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
const sg = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
export default {
  topic: 'functions',
  items: [
    { id: 'fn-001', type: 'mcq', level: 2, exams: E, sub: 'symbols',
      q: '<p>For all numbers <i>a</i> and <i>b</i>, <i>a</i> ◆ <i>b</i> = <i>ab</i> − <i>a</i> + <i>b</i>. What is 3 ◆ (2 ◆ 3)?</p>', options: ['13', '19', '25', '27', '31'], answer: 2,
      sol: '<p>Brackets first: 2 ◆ 3 = 2 × 3 − 2 + 3 = 7. Then 3 ◆ 7 = 3 × 7 − 3 + 7 = 25.</p>', trap: 'Working left to right without doing the bracket first.' },
    { id: 'fn-002', type: 'mcq', level: 2, exams: E, sub: 'composition',
      q: '<p>If <i>f</i>(<i>x</i>) = 2<i>x</i> + 1 and <i>g</i>(<i>x</i>) = <i>x</i><sup>2</sup>, what is <i>f</i>(<i>g</i>(3)) − <i>g</i>(<i>f</i>(3))?</p>', options: ['−30', '−19', '0', '19', '30'], answer: 0,
      sol: '<p><i>g</i>(3) = 9, so <i>f</i>(<i>g</i>(3)) = 19. <i>f</i>(3) = 7, so <i>g</i>(<i>f</i>(3)) = 49. 19 − 49 = −30.</p>', trap: 'Assuming f(g(x)) and g(f(x)) are the same.' },
    { id: 'fn-003', type: 'mcq', level: 3, exams: E, sub: 'sequences',
      q: '<p>In a sequence, each term after the first is 3 more than twice the term before it. If the 4th term is 85, what is the 1st term?</p>', options: ['7', '8', '9', '10', '11'], answer: 1,
      sol: '<p>Work backwards with "subtract 3, then halve": (85 − 3) ÷ 2 = 41, (41 − 3) ÷ 2 = 19, (19 − 3) ÷ 2 = 8. Check forwards: 8, 19, 41, 85.</p>' },
  ],
  gens: [
    { id: 'fn-g01', type: 'mcq', level: 1, exams: E, sub: 'evaluate', title: 'evaluate a function',
      make(r) {
        const a = int(r, 2, 5), b = int(r, -9, 9), c = int(r, -12, 12), x = int(r, -4, 5), value = a * x * x + b * x + c;
        return { q: `<p>If <i>f</i>(<i>x</i>) = ${a}<i>x</i><sup>2</sup> ${b === 0 ? '' : sg(b) + '<i>x</i>'} ${sg(c)}, what is <i>f</i>(${x})?</p>`, ...numOpts(r, value, [a * x * x - b * x + c, (a * x) ** 2 + b * x + c, a * x * x + b * x]), value, a, b, c, x,
          hint: `Put ${x} in place of every x, and square before multiplying.`,
          sol: steps(`${a}(${x})² = ${a} × ${x * x} = ${a * x * x}.`, `${b}(${x}) = ${b * x}.`, `${a * x * x} ${sg(b * x)} ${sg(c)} = <b>${value}</b>.`), trap: x < 0 ? 'Squaring a negative gives a positive.' : `Squaring ${a}x instead of x.` };
      }, check: (p) => p.a * p.x * p.x + p.b * p.x + p.c },
    { id: 'fn-g02', type: 'mcq', level: 2, exams: E, sub: 'arithmetic sequence', title: 'term of an arithmetic sequence',
      make(r) {
        const a1 = int(r, -10, 30), d = choose(r, [-7, -4, -3, 2, 3, 4, 5, 6, 8, 11]), m = int(r, 3, 8), n = int(r, 20, 60);
        const am = a1 + (m - 1) * d, value = a1 + (n - 1) * d;
        return { q: `<p>In an arithmetic sequence the first term is ${a1} and the ${m}th term is ${am}. What is the ${n}th term?</p>`, ...numOpts(r, value, [a1 + n * d, a1 + (n - 2) * d, n * d]), value, a1, d, n, m, am,
          hint: 'The nth term is a₁ + (n − 1)d. Find the common difference d first.',
          sol: steps(`From term 1 to term ${m} there are ${m - 1} steps: d = (${am} − ${a1}) ÷ ${m - 1} = ${d}.`, `Term ${n} = ${a1} + (${n} − 1)(${d}) = ${a1} ${sg((n - 1) * d)}.`, `= <b>${value}</b>.`), trap: 'Using n steps instead of n − 1.' };
      }, check: (p) => p.a1 + ((p.n - 1) * (p.am - p.a1)) / (p.m - 1) },
    { id: 'fn-g03', type: 'mcq', level: 2, exams: E, sub: 'series', title: 'sum of an arithmetic series',
      make(r) {
        const step = choose(r, [1, 2, 3, 5]), a = int(r, 1, 20) * step, n = int(r, 15, 60), l = a + (n - 1) * step, value = (n * (a + l)) / 2;
        return { q: `<p>What is the sum ${a} + ${a + step} + ${a + 2 * step} + ... + ${l}, where each term is ${step} more than the one before?</p>`, ...numOpts(r, value, [((n - 1) * (a + l)) / 2, n * (a + l), (n * l) / 2]), value, a, l, step,
          hint: 'Sum = number of terms × average of the first and last term.',
          sol: steps(`Number of terms: (${l} − ${a}) ÷ ${step} + 1 = ${n}.`, `Average term: (${a} + ${l}) ÷ 2 = ${fmt((a + l) / 2)}.`, `Sum = ${n} × ${fmt((a + l) / 2)} = <b>${fmt(value)}</b>.`), trap: 'Counting the terms as (last − first) ÷ step, without the +1.' };
      }, check: (p) => { let s = 0; for (let x = p.a; x <= p.l; x += p.step) s += x; return s; } },
    { id: 'fn-g04', type: 'mcq', level: 3, exams: E, sub: 'symbols', title: 'a made-up operation',
      make(r) {
        const k = int(r, 1, 4), a = int(r, 2, 6), b = int(r, 1, 5), c = int(r, 1, 4);
        const op = (x, y) => x * y - k * x + y;
        const inner = op(b, c), value = op(a, inner);
        return { q: `<p>For all numbers <i>x</i> and <i>y</i>, <i>x</i> ⊕ <i>y</i> = <i>xy</i> − ${k === 1 ? '' : k}<i>x</i> + <i>y</i>. What is ${a} ⊕ (${b} ⊕ ${c})?</p>`, ...numOpts(r, value, [op(op(a, b), c), op(a, b * c), a * inner]), value, a, b, c, k,
          hint: 'Do the bracket first, then use its result as y.',
          sol: steps(`${b} ⊕ ${c} = ${b}×${c} − ${k}×${b} + ${c} = ${inner}.`, `${a} ⊕ ${inner} = ${a}×${inner} − ${k}×${a} + ${inner}.`, `= <b>${value}</b>.`), trap: 'Working left to right and ignoring the bracket.' };
      }, check: (p) => { const op = (x, y) => x * y - p.k * x + y; return op(p.a, op(p.b, p.c)); } },
  ],
};
