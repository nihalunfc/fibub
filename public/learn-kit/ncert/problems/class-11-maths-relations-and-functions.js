// Class 11 Maths, Relations and Functions: live problems (original fibub questions). Ids start with c11m-rel-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11m-rel-relations': {
    title: 'how many relations between two sets',
    make(r) {
      const m = pick(r, 2, 3), k = pick(r, 2, 3), answer = 2 ** (m * k);
      return { m, k, q: `<p>A has <b>${m}</b> elements and B has <b>${k}</b>. How many different relations from A to B are there?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'A relation is any subset of A × B. How many pairs does A × B have, and how many subsets does that many pairs give?',
        solution: steps(`n(A × B) = ${m} × ${k} = ${m * k} pairs.`, `A relation picks any of them: 2<sup>${m * k}</sup> = <b>${answer}</b> relations.`) };
    },
    verify(x) { let c = 0; for (let mask = 0; mask < 1 << (x.m * x.k); mask++) c++; return c; },
  },
  'c11m-rel-functions': {
    title: 'how many functions between two sets',
    make(r) {
      const m = pick(r, 2, 4), k = pick(r, 2, 4), answer = k ** m;
      return { m, k, q: `<p>How many different functions are there from a set with <b>${m}</b> elements to a set with <b>${k}</b> elements?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Each input must go to exactly one output. Count the choices for each input and multiply.',
        solution: steps(`Each of the ${m} inputs can go to any of the ${k} outputs.`, `Number of functions = ${k}<sup>${m}</sup> = <b>${answer}</b>.`) };
    },
    verify(x) { const f = (t) => (t === 0 ? 1 : x.k * f(t - 1)); return f(x.m); },
  },
  'c11m-rel-domain': {
    title: 'integers in the domain',
    make(r) {
      const a = pick(r, -3, 3), b = a + pick(r, 2, 5), hi = b + pick(r, 4, 9); let answer = 0;
      for (let x = -10; x <= hi; x++) if (x >= a && x !== b) answer++;
      return { a, b, hi, q: `<p>The function f(x) = √(x − ${a}) / (x − ${b}) is written with the rules in your notes (a square root of a negative number and division by 0 are not allowed). How many <b>integers</b> from −10 to ${hi} (both included) are in its domain? (Write x − ${a} as x ${a >= 0 ? '− ' + a : '+ ' + -a}.)</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'The domain is x ≥ a with x ≠ b. Count the integers in the range that obey both.',
        solution: steps(`Square root: x − ${a} ≥ 0, so x ≥ ${a}. Denominator: x ≠ ${b}.`, `Integers from ${a} to ${hi}: ${hi - a + 1}. Remove x = ${b} (it lies in that range).`, `Count = ${hi - a + 1} − 1 = <b>${answer}</b>.`) };
    },
    verify(x) { return x.hi - x.a + 1 - 1; },
  },
  'c11m-rel-difference': {
    title: 'f(x + 1) − f(x) for a quadratic',
    make(r) {
      const a = pick(r, 1, 5), b = pick(r, -6, 6), c = pick(r, -5, 5), x0 = pick(r, -4, 6), f = (x) => a * x * x + b * x + c, answer = f(x0 + 1) - f(x0);
      return { a, b, c, x0, q: `<p>f(x) = ${a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}. Find f(${x0 + 1}) − f(${x0}).</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Work out each value separately, then subtract. (Or expand f(x + 1) − f(x).)',
        solution: steps(`f(${x0 + 1}) = ${f(x0 + 1)} and f(${x0}) = ${f(x0)}.`, `Difference = <b>${answer}</b>.`) };
    },
    verify(x) { return x.a * (2 * x.x0 + 1) + x.b; },
  },
  'c11m-rel-least': {
    title: 'least value of a quadratic function',
    make(r) {
      const b = 2 * pick(r, -5, 5), c = pick(r, -6, 12), answer = c - (b / 2) ** 2;
      return { b, c, q: `<p>Find the smallest value (the lower end of the range) of f(x) = x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Complete the square: x² + bx + c = (x + b/2)² + c − b²/4. A square is never negative.',
        solution: steps(`x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} = (x ${b < 0 ? '−' : '+'} ${Math.abs(b / 2)})² + (${c} − ${(b / 2) ** 2}).`, `The square is at least 0, so the least value is <b>${answer}</b>.`) };
    },
    verify(x) { let m = Infinity; for (let t = -30; t <= 30; t++) m = Math.min(m, t * t + x.b * t + x.c); return m; },
  },
  'c11m-rel-floor': {
    title: 'greatest integer function',
    make(r) {
      const t = [pick(r, -39, 39), pick(r, -39, 39), pick(r, -39, 39)], answer = t.reduce((s, v) => s + Math.floor(v / 10), 0), show = (v) => (v / 10).toFixed(1).replace('-', '−');
      return { t, q: `<p>Using ⌊x⌋ for the greatest integer not more than x, find ⌊${show(t[0])}⌋ + ⌊${show(t[1])}⌋ + ⌊${show(t[2])}⌋.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: '⌊x⌋ rounds DOWN: ⌊2.7⌋ = 2 but ⌊−2.7⌋ = −3.',
        solution: steps(...t.map((v) => `⌊${show(v)}⌋ = ${Math.floor(v / 10)}`), `Sum = <b>${answer}</b>.`) };
    },
    verify(x) { return x.t.reduce((s, v) => s + (v - (((v % 10) + 10) % 10)) / 10, 0); },
  },
  'c11m-rel-quotient': {
    title: 'a quotient of two functions',
    make(r) {
      const a = pick(r, 1, 9), b = pick(r, 1, 6), x0 = b + pick(r, 1, 6), answer = (x0 * x0 - a) / (x0 - b);
      return { a, b, x0, q: `<p>f(x) = x² − ${a} and g(x) = x − ${b}. Find (f / g)(${x0}) to 2 decimal places.</p>`, answer, unit: '', tol: 0.005,
        hint: '(f / g)(x) = f(x) / g(x), provided g(x) is not 0.',
        solution: steps(`f(${x0}) = ${x0 * x0 - a}, g(${x0}) = ${x0 - b}.`, `(f/g)(${x0}) = ${x0 * x0 - a} / ${x0 - b} = <b>${n(answer, 4)}</b>.`) };
    },
    verify(x) { return (x.x0 + Math.sqrt(x.a)) * (x.x0 - Math.sqrt(x.a)) / (x.x0 - x.b); },
  },
};
