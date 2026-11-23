// Class 12 Maths, Relations and Functions: live problems (original fibub questions). Ids start with c12m-rel-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
export default tidyProblems({
  'c12m-rel-count-fn': {
    title: 'counting functions',
    make(r) {
      const m = pick(r, 2, 5), k = pick(r, 2, 5), answer = k ** m;
      return { m, k, q: `<p>How many different functions are there from a set with <b>${m}</b> elements to a set with <b>${k}</b> elements?</p>`, answer, unit: '', tol: 0,
        hint: 'Each of the m inputs can be sent to any of the k outputs, independently.',
        solution: steps(`Each of the ${m} inputs has ${k} choices of output.`, `Total = ${k}<sup>${m}</sup> = <b>${n(answer, 6)}</b>.`) };
    },
    verify(x) { let t = 1; for (let i = 0; i < x.m; i++) t *= x.k; return t; },
  },
  'c12m-rel-count-oneone': {
    title: 'counting one-one functions',
    make(r) {
      const m = pick(r, 2, 4), k = pick(r, m, m + 3), answer = fact(k) / fact(k - m);
      return { m, k, q: `<p>How many one-one functions are there from a set with <b>${m}</b> elements to a set with <b>${k}</b> elements?</p>`, answer, unit: '', tol: 0,
        hint: 'The first input has k choices, the next has one fewer (it cannot reuse an output), and so on.',
        solution: steps(`The inputs pick outputs one at a time with no repeats: ${Array.from({ length: m }, (_, i) => k - i).join(' × ')}.`, `= <b>${n(answer, 6)}</b>.`) };
    },
    verify(x) { let t = 1; for (let i = x.k; i > x.k - x.m; i--) t *= i; return t; },
  },
  'c12m-rel-reflexive': {
    title: 'counting reflexive relations',
    make(r) {
      const k = pick(r, 2, 4), answer = 2 ** (k * k - k);
      return { k, q: `<p>A set has <b>${k}</b> elements. How many <b>reflexive</b> relations can be defined on it?</p>`, answer, unit: '', tol: 0,
        hint: 'A reflexive relation must contain all k pairs (a, a). The other k² − k pairs are free: each is in or out.',
        solution: steps(`The ${k} pairs (a, a) are forced in.`, `The other ${k}² − ${k} = ${k * k - k} pairs can each be in or out: 2 choices each.`, `Total = 2<sup>${k * k - k}</sup> = <b>${n(answer, 6)}</b>.`) };
    },
    verify(x) { let t = 1; for (let i = 0; i < x.k; i++) for (let j = 0; j < x.k; j++) if (i !== j) t *= 2; return t; },
  },
  'c12m-rel-compose-num': {
    title: 'value of a composite function',
    make(r) {
      const a = pick(r, 2, 5), b = pick(r, -4, 6), c = pick(r, 1, 3), d = pick(r, -5, 5), x0 = pick(r, -3, 4), answer = c * (a * x0 + b) ** 2 + d;
      return { a, b, c, d, x0, q: `<p>Let f(x) = ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} and g(x) = ${c === 1 ? '' : c}x² ${d < 0 ? '−' : '+'} ${Math.abs(d)}. Find (g∘f)(${x0}).</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'g∘f means f first, then g: (g∘f)(x) = g(f(x)).',
        solution: steps(`f(${x0}) = ${a}(${x0}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${a * x0 + b}.`, `g(${a * x0 + b}) = ${c}(${a * x0 + b})² ${d < 0 ? '−' : '+'} ${Math.abs(d)} = <b>${n(answer, 6)}</b>.`) };
    },
    verify(x) { return x.c * x.a * x.a * x.x0 * x.x0 + 2 * x.c * x.a * x.b * x.x0 + x.c * x.b * x.b + x.d; },
  },
  'c12m-rel-inverse-num': {
    title: 'value of an inverse function',
    make(r) {
      const a = pick(r, 2, 6), b = pick(r, -6, 9), x = pick(r, -4, 8), y0 = a * x + b, answer = (y0 - b) / a;
      return { a, b, y0, q: `<p>f(x) = ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} is a bijection on the real numbers. Find f⁻¹(${y0}).</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Solve y = ax + b for x, then put in the value of y.',
        solution: steps(`y = ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} gives x = (y ${b < 0 ? '+' : '−'} ${Math.abs(b)})/${a}.`, `f⁻¹(${y0}) = (${y0} ${b < 0 ? '+' : '−'} ${Math.abs(b)})/${a} = <b>${n(answer, 6)}</b>.`) };
    },
    verify(x) { const f0 = x.b, f1 = x.a + x.b; return (x.y0 - f0) / (f1 - f0); },
  },
  'c12m-rel-class-size': {
    title: 'size of an equivalence class',
    make(r) {
      const k = pick(r, 3, 6), N = pick(r, 20, 40), a = pick(r, 1, k), s = a % k === 0 ? k : a % k, answer = Math.floor((N - s) / k) + 1;
      return { k, N, a, q: `<p>On the numbers 1, 2, …, <b>${N}</b>, say a ~ b when a and b leave the same remainder on division by <b>${k}</b> (an equivalence relation). How many numbers are in the equivalence class of <b>${a}</b>?</p>`, answer, unit: '', tol: 0,
        hint: 'List the numbers a, a + k, a + 2k, … that stay within the range.',
        solution: steps(`The class of ${a} is every number with remainder ${a % k} on division by ${k}.`, `They are ${s}, ${s + k}, ${s + 2 * k}, … up to ${N}.`, `Count = <b>${answer}</b>.`) };
    },
    verify(x) { let c = 0; for (let v = 1; v <= x.N; v++) if (v % x.k === x.a % x.k) c++; return c; },
  },
}, ['c12m-rel-compose-num', 'c12m-rel-inverse-num']);
