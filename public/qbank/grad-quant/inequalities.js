import { int, choose, fmt, numOpts, steps } from './_q.js';
import { tidyGens } from '../_util.js';
const E = ['gmat', 'gre'];
const sg = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({
  topic: 'inequalities',
  items: [
    { id: 'iq-001', type: 'mcq', level: 2, exams: E, sub: 'flip',
      q: '<p>If −3<i>x</i> + 7 &gt; 19, which of the following must be true?</p>', options: ['<i>x</i> &gt; 4', '<i>x</i> &lt; 4', '<i>x</i> &gt; −4', '<i>x</i> &lt; −4', '<i>x</i> &lt; −26/3'], answer: 3,
      sol: '<p>Subtract 7: −3<i>x</i> &gt; 12. Dividing by a negative number flips the sign: <i>x</i> &lt; −4.</p>', trap: 'Not flipping the sign gives x > −4.' },
    { id: 'iq-002', type: 'mcq', level: 3, exams: E, sub: 'absolute value',
      q: '<p>How many integers <i>x</i> satisfy |<i>x</i> − 3| &lt; 5?</p>', options: ['5', '8', '9', '10', '11'], answer: 2,
      sol: '<p>|<i>x</i> − 3| &lt; 5 means <i>x</i> is less than 5 away from 3: −2 &lt; <i>x</i> &lt; 8. The integers are −1, 0, 1, ..., 7: that is 9 integers.</p>', trap: 'Including the end points −2 and 8 gives 11.' },
    { id: 'iq-003', type: 'mcq', level: 3, exams: E, sub: 'squares',
      q: '<p>If <i>x</i><sup>2</sup> &lt; <i>x</i>, which of the following must be true?</p>', options: ['<i>x</i> &lt; 0', '<i>x</i> &gt; 1', '0 &lt; <i>x</i> &lt; 1', '−1 &lt; <i>x</i> &lt; 0', '<i>x</i> = 1'], answer: 2,
      sol: '<p>A number is bigger than its square only between 0 and 1: (1/2)<sup>2</sup> = 1/4 &lt; 1/2. Negative numbers have positive squares, and numbers above 1 grow when squared.</p>' },
  ],
  gens: [
    { id: 'iq-g01', type: 'mcq', level: 2, exams: E, sub: 'linear', title: 'largest integer that fits',
      make(r) {
        const a = int(r, 2, 9), b = int(r, -15, 25), c = int(r, -20, 60), neg = r() < 0.4;
        const A = neg ? -a : a, bound = (c - b) / A; // A x + b < c  -> x < bound (A>0) or x > bound (A<0)
        const value = neg ? Math.floor(bound) + 1 : Math.ceil(bound) - 1;
        const word = neg ? 'smallest' : 'largest';
        return { q: `<p>What is the ${word} integer <i>x</i> for which ${A}<i>x</i> ${sg(b)} &lt; ${c}?</p>`, ...numOpts(r, value, [neg ? Math.ceil(bound) - 1 : Math.floor(bound) + 1, Math.round(bound), -value]), value, A, b, c, neg,
          hint: neg ? 'Dividing by a negative number flips the inequality sign.' : 'Solve as if it were an equation, then think about which integers are allowed.',
          sol: steps(`${b < 0 ? 'Add' : 'Subtract'} ${Math.abs(b)}: ${A}x &lt; ${c - b}.`, `Divide by ${A}${neg ? ' and flip the sign' : ''}: x ${neg ? '&gt;' : '&lt;'} ${fmt(bound, 3)}.`, `The ${word} integer is <b>${value}</b>.`), trap: neg ? 'Forgetting to flip the sign.' : 'Taking the bound itself when it is a whole number (the inequality is strict).' };
      }, check: (p) => { if (p.neg) { for (let x = -1000; ; x++) if (p.A * x + p.b < p.c) return x; } for (let x = 1000; ; x--) if (p.A * x + p.b < p.c) return x; } },
    { id: 'iq-g02', type: 'mcq', level: 3, exams: E, sub: 'absolute value', title: 'count integers in an absolute-value range',
      make(r) {
        const h = int(r, -8, 8), d = int(r, 2, 12), le = r() < 0.5;
        const value = le ? 2 * d + 1 : 2 * d - 1;
        return { q: `<p>How many integers <i>x</i> satisfy |<i>x</i> ${sg(-h)}| ${le ? '≤' : '&lt;'} ${d}?</p>`, ...numOpts(r, value, [le ? 2 * d - 1 : 2 * d + 1, 2 * d, d]), value, d, le,
          hint: `|x ${sg(-h)}| is the distance from x to ${h} on the number line.`,
          sol: steps(`The inequality says x is ${le ? 'at most' : 'less than'} ${d} away from ${h}: ${h - d} ${le ? '≤' : '&lt;'} x ${le ? '≤' : '&lt;'} ${h + d}.`, `Integers from ${le ? h - d : h - d + 1} to ${le ? h + d : h + d - 1}.`, `Count: ${le ? h + d : h + d - 1} − (${le ? h - d : h - d + 1}) + 1 = <b>${value}</b>.`) };
      }, check: (p) => (p.le ? 2 * p.d + 1 : 2 * p.d - 1) },
    { id: 'iq-g03', type: 'mcq', level: 3, exams: E, sub: 'ranges', title: 'range of a product',
      make(r) {
        const a1 = int(r, -6, -1), a2 = int(r, 1, 6), b1 = int(r, -5, -1), b2 = int(r, 1, 7);
        const ps = [a1 * b1, a1 * b2, a2 * b1, a2 * b2], value = Math.max(...ps) - Math.min(...ps);
        return { q: `<p>If ${a1} ≤ <i>x</i> ≤ ${a2} and ${b1} ≤ <i>y</i> ≤ ${b2}, what is the difference between the greatest and least possible values of <i>xy</i>?</p>`, ...numOpts(r, value, [a2 * b2 - a1 * b1, a2 * b2, (a2 - a1) * (b2 - b1)].filter((x) => x > 0)), value, ps,
          hint: 'The extremes of a product come from the corners: try every pair of end points.',
          sol: steps(`Corner products: ${a1}×${b1} = ${ps[0]}, ${a1}×${b2} = ${ps[1]}, ${a2}×${b1} = ${ps[2]}, ${a2}×${b2} = ${ps[3]}.`, `Greatest ${Math.max(...ps)}, least ${Math.min(...ps)}.`, `Difference: <b>${value}</b>.`), trap: 'Multiplying the two largest values and the two smallest values only.' };
      }, check: (p) => Math.max(...p.ps) - Math.min(...p.ps) },
  ],
}, ['iq-g01', 'iq-g02', 'iq-g03']);
