// #1277 Rationalise the denominator. Checked against hand-worked examples (6/√3 = 2√3, 1/(2 + √3) = 2 − √3,
// 1/(√5 + √3) = (√5 − √3)/2, 5/(3 − √2) = (15 + 5√2)/7, 3/√12 = √3/2) and, for 3,000 random problems, the
// decimal value of the answer against the decimal value of the question (as Python float division would give).
import { rationalise, problemText, problemValue, text, value, tidy, split } from '../../src/lib/sci/rationalise.ts';

export default async (check) => {
  const ans = (p) => text(rationalise(p).answer);
  check('rationalise: hand-worked answers', ans({ kind: 'root', k: 6, n: 3 }) === '2√3' && ans({ kind: 'binom', k: 1, a: 2, b: 1, n: 3 }) === '2 − √3' && ans({ kind: 'two', k: 1, m: 5, s: 1, n: 3 }) === '(√5 − √3)/2' && ans({ kind: 'binom', k: 5, a: 3, b: -1, n: 2 }) === '(15 + 5√2)/7' && ans({ kind: 'root', k: 3, n: 12 }) === '√3/2');
  check('rationalise: question text', problemText({ kind: 'binom', k: 5, a: 3, b: -1, n: 2 }) === '5/(3 − √2)' && problemText({ kind: 'two', k: 1, m: 5, s: -1, n: 3 }) === '1/(√5 − √3)');
  check('rationalise: split squares out', split(12).join() === '2,3' && split(72).join() === '6,2' && split(7).join() === '1,7' && split(1).join() === '1,1');
  check('rationalise: tidy cancels and fixes signs', text(tidy({ terms: [{ c: 4, r: 2 }, { c: -6, r: 1 }], den: -2 })) === '3 − 2√2' && text(tidy({ terms: [{ c: 2, r: 8 }], den: 6 })) === '2√2/3');
  check('rationalise: refuses a zero bottom and b = 0', 'error' in rationalise({ kind: 'binom', k: 1, a: 2, b: 1, n: 4 }) && 'error' in rationalise({ kind: 'binom', k: 1, a: 2, b: 0, n: 3 }) && 'error' in rationalise({ kind: 'two', k: 1, m: 3, s: 1, n: 3 }));
  let ok = true, n = 0;
  const r = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  for (let i = 0; i < 3000; i++) {
    const kinds = ['root', 'binom', 'two'], kd = kinds[i % 3], k = r(-50, 50) || 1;
    const p = kd === 'root' ? { kind: kd, k, n: r(1, 200) } : kd === 'binom' ? { kind: kd, k, a: r(-20, 20), b: r(-9, 9) || 1, n: r(1, 60) } : { kind: kd, k, m: r(1, 80), s: Math.random() < 0.5 ? 1 : -1, n: r(1, 80) };
    const s = rationalise(p);
    if ('error' in s) continue;
    n++;
    const a = problemValue(p), b = value(s.answer);
    if (Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(a))) ok = false;
    if (s.answer.den <= 0) ok = false;
  }
  check(`rationalise: ${n} random problems keep their value and end with a positive whole denominator`, ok && n > 2500);
};
