// SAT Math · Advanced math · exponent rules, rational exponents and radical equations. Original (fibub).
import { int, nz, choose, shuffleOpts, fmt, v, steps } from './_util.js';
import { tidyGens } from '../_util.js';
const F = { section: 'math', domain: 'advanced' };
const X = v('x');

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({
  topic: 'radicals-exponents',
  gens: [
    { id: 'sat-re-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'exponent rules', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 2, 9), b = int(r, 2, 6), c = int(r, 1, 9), kind = choose(r, ['mult', 'power', 'div']);
        const n = kind === 'mult' ? a + c : kind === 'power' ? a * b - c : a + b - c;
        const q = kind === 'mult' ? `${X}<sup>${a}</sup> · ${X}<sup>${c}</sup>` : kind === 'power' ? `(${X}<sup>${a}</sup>)<sup>${b}</sup> / ${X}<sup>${c}</sup>` : `${X}<sup>${a}</sup> · ${X}<sup>${b}</sup> / ${X}<sup>${c}</sup>`;
        return { q: `<p>For ${X} &gt; 0, the expression ${q} is equivalent to ${X}<sup>${v('n')}</sup>. What is the value of ${v('n')}?</p>`, answer: n, tol: 0, a, b, c, kind,
          sol: steps('Multiplying powers of the same base adds exponents; a power of a power multiplies them; dividing subtracts.', kind === 'mult' ? `${a} + ${c} = <b>${n}</b>.` : kind === 'power' ? `${a} × ${b} − ${c} = <b>${n}</b>.` : `${a} + ${b} − ${c} = <b>${n}</b>.`),
          trap: 'Multiplying exponents when multiplying powers (x² · x³ is x⁵, not x⁶).' };
      },
      verify: (p) => (p.kind === 'mult' ? p.a + p.c : p.kind === 'power' ? p.a * p.b - p.c : p.a + p.b - p.c) },
    { id: 'sat-re-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'rational exponents', facets: F, format: 'numeric',
      make(r) {
        const [base, root] = choose(r, [[4, 2], [9, 2], [16, 2], [25, 2], [8, 3], [27, 3], [64, 3], [16, 4], [81, 4], [32, 5]]);
        const m = int(r, 1, 3), val = Math.round(base ** (1 / root)) ** m;
        return { q: `<p>What is the value of ${base}<sup>${m}/${root}</sup>?</p>`, answer: val, tol: 0, base, root, m,
          sol: steps(`${v('a')}<sup>${v('m')}/${v('n')}</sup> means: take the ${v('n')}th root, then raise to the ${v('m')}th power.`, `The ${root === 2 ? 'square' : root === 3 ? 'cube' : root + 'th'} root of ${base} is ${Math.round(base ** (1 / root))}.`, `${Math.round(base ** (1 / root))}<sup>${m}</sup> = <b>${val}</b>.`) };
      },
      verify: (p) => Math.round(p.base ** (p.m / p.root)) },
    { id: 'sat-re-g03', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'radical equation', facets: F, format: 'numeric',
      make(r) {
        const b = int(r, 2, 9), a = int(r, -10, 12), k = int(r, 1, 3), x = (b * b - a) / k;
        if (!Number.isInteger(x)) return this.make(r);
        return { q: `<p>√(${k === 1 ? '' : k}${X} ${a < 0 ? '−' : '+'} ${Math.abs(a)}) = ${b}</p><p>What is the solution to the equation above?</p>`, answer: x, tol: 0, a, b, k,
          sol: steps(`Square both sides: ${k === 1 ? '' : k}${X} ${a < 0 ? '−' : '+'} ${Math.abs(a)} = ${b * b}.`, `${k === 1 ? '' : k}${X} = ${b * b - a}${k === 1 ? '' : `, so ${X} = ${fmt(x)}`}.`, `Check: √(${k * x + a}) = ${b}. ✓ So ${X} = <b>${fmt(x)}</b>.`) };
      },
      verify: (p) => (p.b * p.b - p.a) / p.k },
    { id: 'sat-re-g04', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'equivalent radical', facets: F, format: 'single',
      make(r) {
        const s = choose(r, [
          ['x<sup>3/2</sup>', `${X}√${X}`, [`√(${X}<sup>2</sup>)`, `${X}<sup>3</sup>/2`, `∛(${X}<sup>2</sup>)`]],
          ['x<sup>2/3</sup>', `∛(${X}<sup>2</sup>)`, [`√(${X}<sup>3</sup>)`, `${X}<sup>2</sup>/3`, `(2/3)${X}`]],
          ['x<sup>−1/2</sup>', `1/√${X}`, [`−√${X}`, `−${X}/2`, `√(−${X})`]],
          ['√(16x<sup>4</sup>)', `4${X}<sup>2</sup>`, [`8${X}<sup>2</sup>`, `4${X}<sup>4</sup>`, `16${X}<sup>2</sup>`]],
          ['√(50x<sup>2</sup>)', `5${X}√2`, [`25${X}√2`, `5√(2${X})`, `10${X}√5`]],
          ['(8x<sup>6</sup>)<sup>1/3</sup>', `2${X}<sup>2</sup>`, [`2${X}<sup>3</sup>`, `8${X}<sup>2</sup>`, `(8/3)${X}<sup>2</sup>`]],
        ]);
        const o = shuffleOpts(r, s[1], s[2]);
        return { q: `<p>For ${X} &gt; 0, which expression is equivalent to ${s[0].replace(/x/g, X)}?</p>`, ...o,
          sol: `<p>A fractional exponent ${v('m')}/${v('n')} is the ${v('n')}th root of the ${v('m')}th power, and a negative exponent means "one over". Using those rules gives <b>${s[1]}</b>. You can also check by putting ${X} = 4 (or 8) into both expressions on the calculator.</p>` };
      } },
    { id: 'sat-re-g05', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'same base', facets: F, format: 'numeric',
      make(r) {
        const [b, B] = choose(r, [[2, 4], [2, 8], [3, 9], [3, 27], [5, 25], [2, 16]]), k = Math.round(Math.log(B) / Math.log(b));
        const x = int(r, 1, 6), c = int(r, -3, 3), lhs = k * x; // b^(lhs + c) = B^(x) * b^c
        return { q: `<p>If ${B}<sup>${X}</sup> = ${b}<sup>${v('y')}</sup> and ${X} = ${x}, what is the value of ${v('y')}?</p>`, answer: lhs, tol: 0, b, B, x, k,
          sol: steps(`Write ${B} as a power of ${b}: ${B} = ${b}<sup>${k}</sup>.`, `${B}<sup>${X}</sup> = (${b}<sup>${k}</sup>)<sup>${X}</sup> = ${b}<sup>${k}${X}</sup>.`, `So ${v('y')} = ${k}${X} = ${k} × ${x} = <b>${lhs}</b>.`) };
      },
      verify: (p) => p.x * Math.log(p.B) / Math.log(p.b) },
  ],
  items: [
    { id: 'sat-re-001', type: 'mcq', marks: 1, level: 1, exams: ['sat'], sub: 'zero and negative exponents', facets: F,
      q: '<p>What is the value of 5<sup>0</sup> + 2<sup>−3</sup>?</p>', options: ['9/8', '−5', '−3', '1/8'], answer: 0,
      sol: '<p>Any non-zero number to the power 0 is 1. 2<sup>−3</sup> = 1/2<sup>3</sup> = 1/8. So 1 + 1/8 = 9/8.</p>' },
    { id: 'sat-re-002', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'extraneous', facets: F,
      q: '<p>What are all the solutions to √(<i>x</i> + 6) = <i>x</i>?</p>', options: ['3 only', '−2 only', '−2 and 3', 'There are no solutions'], answer: 0,
      sol: '<p>Square both sides: <i>x</i> + 6 = <i>x</i><sup>2</sup>, so <i>x</i><sup>2</sup> − <i>x</i> − 6 = 0 and (<i>x</i> − 3)(<i>x</i> + 2) = 0. Check: √9 = 3 ✓, but √4 = 2, not −2 ✗. Only 3 works.</p>', trap: 'Keeping the solution that squaring added.' },
  ],
}, ['sat-re-g03']);
