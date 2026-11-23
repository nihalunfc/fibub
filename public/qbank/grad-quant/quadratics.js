import { int, choose, fmt, numOpts, steps } from './_q.js';
import { tidyGens } from '../_util.js';
const E = ['gmat', 'gre'];
const sg = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({
  topic: 'quadratics',
  items: [
    { id: 'qu-001', type: 'mcq', level: 2, exams: E, sub: 'identities',
      q: '<p>If <i>x</i> + <i>y</i> = 9 and <i>x</i> − <i>y</i> = 3, what is <i>x</i><sup>2</sup> − <i>y</i><sup>2</sup>?</p>', options: ['12', '18', '27', '36', '81'], answer: 2,
      sol: '<p><i>x</i><sup>2</sup> − <i>y</i><sup>2</sup> = (<i>x</i> + <i>y</i>)(<i>x</i> − <i>y</i>) = 9 × 3 = 27.</p>' },
    { id: 'qu-002', type: 'mcq', level: 2, exams: E, sub: 'identities',
      q: '<p>If <i>a</i> + <i>b</i> = 7 and <i>ab</i> = 10, what is <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup>?</p>', options: ['20', '29', '39', '49', '69'], answer: 1,
      sol: '<p>(<i>a</i> + <i>b</i>)<sup>2</sup> = <i>a</i><sup>2</sup> + 2<i>ab</i> + <i>b</i><sup>2</sup>, so 49 = <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> + 20 and <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> = 29.</p>', trap: 'Forgetting the 2ab term gives 49.' },
    { id: 'qu-003', type: 'mcq', level: 3, exams: E, sub: 'roots',
      q: '<p>If <i>x</i><sup>2</sup> = 6<i>x</i>, which of the following gives every possible value of <i>x</i>?</p>', options: ['6 only', '0 only', '0 and 6', '−6 and 6', '−6, 0 and 6'], answer: 2,
      sol: '<p>Do not divide by <i>x</i>: it might be 0. Instead, <i>x</i><sup>2</sup> − 6<i>x</i> = 0, so <i>x</i>(<i>x</i> − 6) = 0 and <i>x</i> = 0 or 6.</p>', trap: 'Dividing both sides by x loses the root x = 0.' },
  ],
  gens: [
    { id: 'qu-g01', type: 'mcq', level: 2, exams: E, sub: 'factoring', title: 'sum of the roots',
      make(r) {
        const p = int(r, -9, 9) || 2, q = int(r, -9, 9) || -3, b = -(p + q), c = p * q, ask = r() < 0.5 ? 'sum' : 'product';
        const value = ask === 'sum' ? p + q : p * q;
        return { q: `<p>What is the ${ask} of the solutions of <i>x</i><sup>2</sup> ${b === 0 ? '' : sg(b) + '<i>x</i>'} ${sg(c)} = 0?</p>`, ...numOpts(r, value, [-value, ask === 'sum' ? b : -c, p - q]), value, r1: p, r2: q, ask,
          hint: 'Factor it: find two numbers that multiply to the constant and add to the middle coefficient.',
          sol: steps(`Two numbers that multiply to ${c} and add to ${b}: ${-p} and ${-q}.`, `So (x ${sg(-p)})(x ${sg(-q)}) = 0, and x = ${p} or x = ${q}.`, `The ${ask} is <b>${value}</b>. (Shortcut: for x² + bx + c, the sum is −b and the product is c.)`), trap: 'Using b instead of −b for the sum.' };
      }, check: (p) => (p.ask === 'sum' ? p.r1 + p.r2 : p.r1 * p.r2) },
    { id: 'qu-g02', type: 'mcq', level: 2, exams: E, sub: 'factoring', title: 'larger root',
      make(r) {
        const a = choose(r, [1, 1, 2, 3]), p = int(r, 1, 9), q = -int(r, 1, 9);
        // a(x - p)(x - q)
        const b = -a * (p + q), c = a * p * q, value = p;
        return { q: `<p>What is the larger solution of ${a === 1 ? '' : a}<i>x</i><sup>2</sup> ${b === 0 ? '' : sg(b) + '<i>x</i>'} ${sg(c)} = 0?</p>`, ...numOpts(r, value, [-q, -p, q]), value, a, b, c,
          hint: a === 1 ? 'Factor into two brackets.' : `Divide every term by ${a} first.`,
          sol: steps(a === 1 ? null : `Divide by ${a}: x² ${(b / a) === 0 ? '' : sg(b / a) + 'x'} ${sg(c / a)} = 0.`, `Factor: (x ${sg(-p)})(x ${sg(-q)}) = 0.`, `x = ${p} or x = ${q}; the larger is <b>${value}</b>.`) };
      }, check: (p) => (-p.b + Math.sqrt(p.b * p.b - 4 * p.a * p.c)) / (2 * p.a) },
    { id: 'qu-g03', type: 'mcq', level: 3, exams: E, sub: 'identities', title: 'use a special product',
      make(r) {
        const x = int(r, 2, 12), y = int(r, 1, x - 1), s = x + y, t = x * y, value = x * x + y * y;
        return { q: `<p>If <i>a</i> + <i>b</i> = ${s} and <i>ab</i> = ${t}, what is <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup>?</p>`, ...numOpts(r, value, [s * s, s * s + 2 * t, s * s - t]), value, s, t,
          hint: '(a + b)² = a² + 2ab + b².',
          sol: steps(`(a + b)² = ${s}² = ${s * s}.`, `That equals a² + b² + 2ab = a² + b² + ${2 * t}.`, `a² + b² = ${s * s} − ${2 * t} = <b>${value}</b>.`), trap: `Answering ${s * s}, forgetting the 2ab term.` };
      }, check: (p) => p.s * p.s - 2 * p.t },
    { id: 'qu-g04', type: 'mcq', level: 3, exams: E, sub: 'vertex', title: 'maximum of a quadratic',
      make(r) {
        const h = int(r, 1, 30) * 5, k = int(r, 20, 90) * 10, a = choose(r, [0.2, 0.5, 1, 2]);
        const b = 2 * a * h, c = k - a * h * h, value = k;
        return { q: `<p>A shop's daily profit, in dollars, when it charges <i>p</i> dollars is −${a === 1 ? '' : fmt(a)}<i>p</i><sup>2</sup> + ${fmt(b)}<i>p</i> ${sg(c)}. What is the greatest daily profit, in dollars?</p>`, ...numOpts(r, value, [h, c, k + a * h]), value, a, b, c, h,
          hint: 'The top of a downward parabola −ap² + bp + c is at p = b ÷ (2a).',
          sol: steps(`Best price p = ${fmt(b)} ÷ (2 × ${fmt(a)}) = ${h}.`, `Profit there: −${fmt(a)}(${h})² + ${fmt(b)}(${h}) ${sg(c)} = ${fmt(-a * h * h)} + ${fmt(b * h)} ${sg(c)}.`, `= <b>${fmt(value)}</b> dollars.`), trap: `Answering the best price (${h}) instead of the profit.` };
      }, check: (p) => -p.a * p.h * p.h + p.b * p.h + p.c },
  ],
}, ['qu-g01', 'qu-g02']);
