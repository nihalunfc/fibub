// SAT Math · Advanced math · polynomials, zeros, remainders and rational equations. Original (fibub).
import { int, nz, other, choose, shuffleOpts, fmt, lin, quad, v, steps } from './_util.js';
import { tidyGens } from '../_util.js';
const F = { section: 'math', domain: 'advanced' };
const X = v('x'), p = v('p');
const fac = (z) => `(${X} ${z < 0 ? '+' : '−'} ${Math.abs(z)})`;

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({
  topic: 'polynomials-rational',
  gens: [
    { id: 'sat-pr-g01', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'remainder theorem', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -3, 3), b = int(r, -6, 6), c = int(r, -9, 9), d = int(r, -12, 12), k = nz(r, -3, 3);
        const val = a * k ** 3 + b * k * k + c * k + d;
        const poly = [[a, `${X}<sup>3</sup>`], [b, `${X}<sup>2</sup>`], [c, X], [d, '']].filter(([q]) => q !== 0).map(([q, s], i) => (i === 0 ? (q < 0 ? '−' : '') : q < 0 ? ' − ' : ' + ') + (Math.abs(q) === 1 && s ? '' : Math.abs(q)) + s).join('');
        return { q: `<p>What is the remainder when ${p}(${X}) = ${poly} is divided by ${fac(k)}?</p>`, answer: val, tol: 0, a, b, c, d, k,
          sol: steps(`The remainder theorem: dividing ${p}(${X}) by (${X} − ${v('k')}) leaves remainder ${p}(${v('k')}). No long division needed.`, `Here ${v('k')} = ${fmt(k)}: ${p}(${fmt(k)}) = ${fmt(a * k ** 3)} + ${fmt(b * k * k)} + ${fmt(c * k)} + ${fmt(d)}.`, `= <b>${fmt(val)}</b>.`),
          trap: `Using p(${fmt(-k)}) instead of p(${fmt(k)}): x − k means plug in +k.` };
      },
      verify: (q) => q.a * q.k ** 3 + q.b * q.k ** 2 + q.c * q.k + q.d },
    { id: 'sat-pr-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'zeros', facets: F, format: 'numeric',
      make(r) {
        const z = [nz(r, -8, 8), nz(r, -8, 8), nz(r, -8, 8)], m = nz(r, -3, 3), ask = choose(r, ['sum', 'largest', 'count']);
        const distinct = [...new Set(z)];
        const ans = ask === 'sum' ? distinct.reduce((s, q) => s + q, 0) : ask === 'largest' ? Math.max(...z) : distinct.length;
        return { q: `<p>${p}(${X}) = ${m === 1 ? '' : m === -1 ? '−' : m}${z.map(fac).join('')}</p><p>${ask === 'sum' ? `What is the sum of all the distinct zeros of ${p}?` : ask === 'largest' ? `What is the greatest zero of ${p}?` : `How many distinct ${X}-intercepts does the graph of ${v('y')} = ${p}(${X}) have?`}</p>`, answer: ans, tol: 0, z, ask,
          sol: steps(`A product is zero when one of its factors is zero. ${fac(z[0])} = 0 gives ${X} = ${fmt(z[0])}, and so on.`, `The zeros are ${distinct.map(fmt).join(', ')}.${distinct.length < 3 ? ' (A repeated factor gives the same zero twice; count it once.)' : ''} The number in front, ${m}, does not change them.`, `Answer: <b>${fmt(ans)}</b>.`),
          trap: 'Taking the sign inside the bracket as the zero: (x + 4) = 0 means x = −4.' };
      },
      verify: (q) => { const d = [...new Set(q.z)]; return q.ask === 'sum' ? d.reduce((s, x) => s + x, 0) : q.ask === 'largest' ? Math.max(...q.z) : d.length; } },
    { id: 'sat-pr-g03', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'rational equation', facets: F, format: 'numeric',
      make(r) {
        const b = int(r, -6, 6), c = nz(r, -5, 5), x = other(r, -8, 10, [-b]), a = c * (x + b);
        if (a === 0) return this.make(r);
        return { q: `<p>${fmt(a)}/(${lin(1, b)}) = ${fmt(c)}</p><p>What is the solution to the equation above?</p>`, answer: x, tol: 0, a, b, c,
          sol: steps(`Multiply both sides by (${lin(1, b)}): ${fmt(a)} = ${fmt(c)}(${lin(1, b)}).`, `${fmt(a)} = ${lin(c, c * b)}, so ${fmt(c)}${X} = ${fmt(a - c * b)}.`, `${X} = <b>${fmt(x)}</b>. Check it does not make the bottom zero: ${fmt(x)} + ${fmt(b)} = ${fmt(x + b)} ≠ 0. ✓`) };
      },
      verify: (q) => q.a / q.c - q.b },
    { id: 'sat-pr-g04', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'simplify rational', facets: F, format: 'numeric',
      make(r) {
        const k = int(r, 1, 9), t = other(r, -6, 12, [k]);
        return { q: `<p>For ${X} ≠ ${k}, the expression (${X}<sup>2</sup> − ${k * k})/(${X} − ${k}) can be simplified. What is its value when ${X} = ${fmt(t)}?</p>`, answer: t + k, tol: 0, k, t,
          sol: steps(`${X}<sup>2</sup> − ${k * k} = (${X} − ${k})(${X} + ${k}), a difference of squares.`, `Cancel (${X} − ${k}) to get ${X} + ${k}.`, `At ${X} = ${fmt(t)}: <b>${fmt(t + k)}</b>.`) };
      },
      verify: (q) => (q.t * q.t - q.k * q.k) / (q.t - q.k) },
    { id: 'sat-pr-g05', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'factor and zero', facets: F, format: 'numeric',
      make(r) {
        const k = nz(r, -6, 6), m = nz(r, -6, 6), n = int(r, -9, 9);
        // p(x) = (x − k)(x² + m x + n); "If x − k is a factor of x³ + bx² + cx + d, ..." ask d given others? Ask for p(k) = 0 constant.
        const b = m - k, c = n - k * m, d = -k * n;
        return { q: `<p>In the polynomial ${p}(${X}) = ${X}<sup>3</sup> ${b < 0 ? '−' : '+'} ${Math.abs(b)}${X}<sup>2</sup> ${c < 0 ? '−' : '+'} ${Math.abs(c)}${X} + ${v('d')}, ${v('d')} is a constant. If ${fac(k)} is a factor of ${p}(${X}), what is the value of ${v('d')}?</p>`, answer: d, tol: 0, b, c, k,
          sol: steps(`If ${fac(k)} is a factor, then ${p}(${fmt(k)}) = 0 (the factor theorem).`, `${fmt(k ** 3)} ${b * k * k < 0 ? '−' : '+'} ${fmt(Math.abs(b * k * k))} ${c * k < 0 ? '−' : '+'} ${fmt(Math.abs(c * k))} + ${v('d')} = 0.`, `${fmt(k ** 3 + b * k * k + c * k)} + ${v('d')} = 0, so ${v('d')} = <b>${fmt(d)}</b>.`) };
      },
      verify: (q) => -(q.k ** 3 + q.b * q.k ** 2 + q.c * q.k) },
  ],
  items: [
    { id: 'sat-pr-001', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'graph', facets: F,
      q: '<p>The graph of a polynomial function <i>f</i> crosses the <i>x</i>-axis only at <i>x</i> = −3, <i>x</i> = 0 and <i>x</i> = 5. Which could define <i>f</i>?</p>',
      options: ['<i>f</i>(<i>x</i>) = <i>x</i>(<i>x</i> + 3)(<i>x</i> − 5)', '<i>f</i>(<i>x</i>) = (<i>x</i> − 3)(<i>x</i> + 5)', '<i>f</i>(<i>x</i>) = <i>x</i>(<i>x</i> − 3)(<i>x</i> + 5)', '<i>f</i>(<i>x</i>) = (<i>x</i> + 3)(<i>x</i> − 5)'], answer: 0,
      sol: '<p>Zeros −3, 0 and 5 need factors (<i>x</i> + 3), <i>x</i> and (<i>x</i> − 5). Only the first option has all three with the right signs.</p>' },
    { id: 'sat-pr-002', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'extraneous', facets: F,
      q: '<p>What is the set of all solutions to <i>x</i>/(<i>x</i> − 2) = 2/(<i>x</i> − 2) + 3?</p>',
      options: ['There is no solution', '{2}', '{2, 3}', '{3}'], answer: 0,
      sol: '<p>Multiply by (<i>x</i> − 2): <i>x</i> = 2 + 3(<i>x</i> − 2), so <i>x</i> = 3<i>x</i> − 4 and <i>x</i> = 2. But <i>x</i> = 2 makes the bottom zero, so it is not allowed (an "extraneous" solution). There is no solution.</p>',
      trap: 'Not checking the answer in the original equation.' },
  ],
}, ['sat-pr-g01', 'sat-pr-g03', 'sat-pr-g05']);
