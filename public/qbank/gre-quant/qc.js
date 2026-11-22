// GRE Quantitative Comparison: Quantity A against Quantity B, with the four fixed answers.
// Fixed-number questions are worked out exactly; questions with unknowns are tested over many allowed values,
// and the solution shows the values that settle it (the plug-in method from lesson 2.2).
import { int, choose, fmt, frac, gcd } from '../grad-quant/_q.js';
import { QC, qc, compare, explain } from './_qc.js';
const E = ['gre'];
const num = (v) => fmt(v, 4).replace(/^-/, '−');
const R = [-10, -3, -2, -1.5, -1, -0.5, -0.25, 0, 0.25, 0.5, 0.9, 1, 1.5, 2, 3, 10];
const RD = [...R, -100, -7, -0.75, -0.1, 0.1, 0.3, 0.75, 0.99, 1.01, 1.2, 4, 7, 100];
const P2 = (S) => { const o = []; for (const a of S) for (const b of S) o.push([a, b]); return o; };
const sx = (c) => `x = ${num(c)}`, sxy = ([a, b], n = ['x', 'y']) => `${n[0]} = ${num(a)}, ${n[1]} = ${num(b)}`;
// Families with unknowns: given (the condition), A and B as text and as functions, the cases, how to name a case.
const FAM = [
  (r) => ({ given: 'x > 0', A: 'x', B: 'x²', fa: (x) => x, fb: (x) => x * x, ok: (x) => x > 0, tip: 'Squares of numbers between 0 and 1 are smaller than the numbers. Always try a fraction.' }),
  (r) => { const k = int(r, 1, 3); return { given: `x > ${k}`, A: 'x²', B: `${k}x`, fa: (x) => x * x, fb: (x) => k * x, ok: (x) => x > k, tip: `x² − ${k}x = x(x − ${k}), which is positive when x > ${k}.` }; },
  (r) => ({ given: '0 < x < 1', A: 'x', B: 'x³', fa: (x) => x, fb: (x) => x ** 3, ok: (x) => x > 0 && x < 1, tip: 'Multiplying by a number between 0 and 1 makes a positive number smaller.' }),
  (r) => ({ given: 'x < 0', A: 'x', B: 'x³', fa: (x) => x, fb: (x) => x ** 3, ok: (x) => x < 0, tip: 'Negative numbers behave differently above and below −1. Try −2 and −0.5.' }),
  (r) => ({ given: 'x is an integer and x ≠ 0', A: 'x²', B: '|x|', fa: (x) => x * x, fb: (x) => Math.abs(x), ok: (x) => Number.isInteger(x) && x !== 0, tip: 'Try 1 and −1, where x² and |x| are equal, then 2.' }),
  (r) => { const k = int(r, 2, 9); return { given: `x + y = ${2 * k} and x > y`, A: 'x', B: String(k), fa: ([x]) => x, fb: () => k, ok: ([x, y]) => Math.abs(x + y - 2 * k) < 1e-9 && x > y, two: true, cases: () => { const o = []; for (let d = 0.5; d <= 20; d += 0.5) o.push([k + d / 2, k - d / 2]); return o; }, tip: `If two numbers add to ${2 * k}, their average is ${k}; the larger one is above the average.` }; },
  (r) => ({ given: 'a > b > 0', A: 'a ÷ b', B: 'b ÷ a', fa: ([a, b]) => a / b, fb: ([a, b]) => b / a, ok: ([a, b]) => a > b && b > 0, two: true, names: ['a', 'b'], tip: 'a ÷ b is more than 1 and b ÷ a is less than 1.' }),
  (r) => ({ given: 'xy > 0', A: 'x', B: 'y', fa: ([x]) => x, fb: ([, y]) => y, ok: ([x, y]) => x * y > 0, two: true, tip: 'xy > 0 only says x and y have the same sign. It says nothing about which is bigger.' }),
  (r) => { const k = int(r, 2, 5); return { given: 'x > 0', A: `(x + ${k})²`, B: `x² + ${k * k}`, fa: (x) => (x + k) ** 2, fb: (x) => x * x + k * k, ok: (x) => x > 0, tip: `(x + ${k})² = x² + ${2 * k}x + ${k * k}. The middle term ${2 * k}x is positive when x > 0.` }; },
  (r) => { const k = int(r, 2, 9); return { given: 'n is a positive integer', A: `(−1)<sup>2n</sup> × ${k}`, B: String(k), fa: () => k, fb: () => k, ok: (x) => Number.isInteger(x) && x > 0, tip: '2n is even, so (−1) to the power 2n is always 1.' }; },
  (r) => { const k = int(r, 2, 6); return { given: 'x ≠ 0', A: `(${k}x²) ÷ x`, B: `${k}x`, fa: (x) => (k * x * x) / x, fb: (x) => k * x, ok: (x) => x !== 0, tip: 'Simplify first: x² ÷ x = x when x is not 0. Both sides are the same expression.' }; },
  (r) => ({ given: 'x ≠ 0', A: 'x² + 1', B: '2x', fa: (x) => x * x + 1, fb: (x) => 2 * x, ok: (x) => x !== 0, tip: 'x² + 1 − 2x = (x − 1)², which is 0 at x = 1 and positive otherwise.' }),
];
function fixed(r) {
  const k = int(r, 0, 4);
  if (k === 0) { const p = choose(r, [12, 15, 20, 25, 30, 40]), n = choose(r, [40, 60, 75, 80, 120]), sw = r() < 0.4; const q = sw ? n : p + choose(r, [-5, 5]), m = sw ? p : n;
    return { A: `${p}% of ${n}`, B: `${q}% of ${m}`, a: (p * n) / 100, b: (q * m) / 100, work: `${p}% of ${n} = ${p} × ${n} ÷ 100. ${q}% of ${m} = ${q} × ${m} ÷ 100. `, tip: 'p% of n always equals n% of p: both are p × n ÷ 100.' }; }
  if (k === 1) { const a = int(r, 2, 8), b = a + int(r, 1, 3), c = a + int(r, 1, 3), d = c + (b - a) + choose(r, [-1, 0, 1]); if (gcd(c, d) !== 1 && c * b === a * d) return fixed(r);
    return { A: frac(a, b), B: frac(c, d), a: a / b, b: c / d, work: `Cross-multiply: ${a} × ${d} = ${a * d} against ${c} × ${b} = ${c * b}. `, tip: 'To compare a/b with c/d (all positive), compare a × d with c × b.' }; }
  if (k === 2) { const e = int(r, 6, 12), f = int(r, 2, 4);
    return { A: `2<sup>${e}</sup>`, B: `${e}<sup>${f}</sup>`, a: 2 ** e, b: e ** f, work: '', tip: 'Work out small powers exactly; they are rarely as big or small as they look.' }; }
  if (k === 3) { const p = choose(r, [10, 20, 25, 50]), x = choose(r, [80, 100, 200, 400]);
    return { A: `A price of ${x} dollars after a rise of ${p}% and then a fall of ${p}%`, B: `${x} dollars`, a: x * (1 + p / 100) * (1 - p / 100), b: x, work: `${x} × ${1 + p / 100} × ${1 - p / 100} = ${num(x * (1 + p / 100) * (1 - p / 100))}. `, tip: 'A rise and a fall of the same percent never cancel: the fall is taken from a bigger number.' }; }
  const s = int(r, 1, 20), n = choose(r, [5, 7, 9]), mid = s + (n - 1) / 2, off = choose(r, [0, 0, 1, -1]);
  return { A: `The average (arithmetic mean) of the ${n} consecutive integers from ${s} to ${s + n - 1}`, B: String(mid + off), a: mid, b: mid + off, work: `Evenly spaced numbers: the average is the middle one, (${s} + ${s + n - 1}) ÷ 2 = ${mid}. `, tip: 'For evenly spaced numbers, average = middle value = (first + last) ÷ 2.' };
}
const swap = (F) => ({ ...F, A: F.B, B: F.A, fa: F.fb, fb: F.fa, a: F.b, b: F.a });
export default {
  topic: 'qc',
  gens: [
    { id: 'qc-g01', type: 'mcq', level: 2, exams: E, format: 'qc', sub: 'numbers',
      make(r) {
        const F0 = fixed(r), F = r() < 0.5 ? swap(F0) : F0, res = compare([0], () => F.a, () => F.b);
        return { q: `<p>Compare Quantity A and Quantity B.</p>${qc(F.A, F.B)}`, options: QC.slice(), answer: res.ans, value: res.ans,
          sol: explain(res, null, num, F.tip, F.work), hint: 'Work out each quantity, or compare them without finishing the sums.', _ab: [F.a, F.b] };
      },
      check: (p) => compare([0], () => p._ab[0], () => p._ab[1]).ans },
    { id: 'qc-g02', type: 'mcq', level: 3, exams: E, format: 'qc', sub: 'unknowns',
      make(r) {
        const i = int(r, 0, FAM.length - 1), F0 = FAM[i](r), F = r() < 0.5 ? swap(F0) : F0, cs = (F.cases ? F.cases() : F.two ? P2(R) : R).filter(F.ok), res = compare(cs, F.fa, F.fb);
        const show = F.two ? (c) => sxy(c, F.names) : sx;
        return { q: `<p>${F.given}</p>${qc(F.A, F.B)}`, options: QC.slice(), answer: res.ans, value: res.ans,
          sol: explain(res, show, num, F.tip), hint: 'Plug in more than one allowed value: try 0, 1, a negative and a fraction where allowed.', _f: [i, F] };
      },
      check(p) { const F = p._f[1], cs = (F.cases ? F.cases() : F.two ? P2(RD) : RD).filter(F.ok); return compare(cs, F.fa, F.fb).ans; } },
  ],
};
