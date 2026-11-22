// Class 10 Maths, Arithmetic Progressions: live problems (original fibub questions). Ids start with c10m-ap-.
import { pick, choose, n, steps } from './_util.js';

const list = (a, d, k = 4) => Array.from({ length: k }, (_, i) => a + i * d).join(', ');
const sgn = (v) => (v < 0 ? `(${v})` : `${v}`);

export default {
  'c10m-ap-term': {
    title: 'find the n-th term',
    make(r) {
      const a = pick(r, -12, 30), d = pick(r, -7, 9), N = pick(r, 8, 40);
      return { a, d, N, q: `<p>Find the ${N}th term of the AP ${list(a, d)}, …</p>`, answer: a + (N - 1) * d, unit: '', tol: 0.001, abs: 0.001,
        hint: `Read off a (the first term) and d (second minus first). Then use a<sub>n</sub> = a + (n − 1)d.`,
        solution: steps(`a = ${a}, d = ${a + d} − ${sgn(a)} = ${d}.`, `a<sub>${N}</sub> = a + (${N} − 1)d = ${a} + ${N - 1} × ${sgn(d)}.`, `a<sub>${N}</sub> = <b>${a + (N - 1) * d}</b>.`) };
    },
    verify: (x) => { let v = x.a; for (let i = 1; i < x.N; i++) v += x.d; return v; },
  },
  'c10m-ap-which': {
    title: 'which term is a given number?',
    make(r) {
      const a = pick(r, 2, 30), d = pick(r, 2, 9), k = pick(r, 6, 40), T = a + (k - 1) * d;
      return { a, d, T, q: `<p>Which term of the AP ${list(a, d)}, … is ${T}?</p>`, answer: k, unit: '', tol: 0.001, abs: 0.001,
        hint: 'Put a + (n − 1)d equal to the number and solve for n.',
        solution: steps(`a = ${a}, d = ${d}. Set a<sub>n</sub> = ${T}: ${a} + (n − 1) × ${d} = ${T}.`, `(n − 1) × ${d} = ${T - a}, so n − 1 = ${(T - a) / d}.`, `n = <b>${k}</b>, so ${T} is the ${k}th term.`) };
    },
    verify: (x) => { let v = x.a, i = 1; while (v < x.T) { v += x.d; i++; } return i; },
  },
  'c10m-ap-finddiff': {
    title: 'find d from two terms',
    make(r) {
      const a = pick(r, -10, 20), d = pick(r, -6, 9), p = pick(r, 2, 5), s = pick(r, 8, 14), ap = a + (p - 1) * d, as = a + (s - 1) * d;
      return { ap, as, p, s, q: `<p>In an AP the ${p}th term is ${ap} and the ${s}th term is ${as}. Find the common difference d.</p>`, answer: d, unit: '', tol: 0.001, abs: 0.001,
        hint: `Going from term ${p} to term ${s} adds d exactly ${s - p} times.`,
        solution: steps(`a<sub>${s}</sub> − a<sub>${p}</sub> = (${s} − ${p})d, because ${s - p} steps of d are taken.`, `${as} − ${sgn(ap)} = ${s - p}d, so ${as - ap} = ${s - p}d.`, `d = <b>${d}</b>.`) };
    },
    verify: (x) => (x.as - x.ap) / (x.s - x.p),
  },
  'c10m-ap-sum': {
    title: 'sum of the first n terms',
    make(r) {
      const a = pick(r, 1, 25), d = pick(r, 1, 8), N = pick(r, 8, 30), S = (N * (2 * a + (N - 1) * d)) / 2;
      return { a, d, N, q: `<p>Find the sum of the first ${N} terms of the AP ${list(a, d)}, …</p>`, answer: S, unit: '', tol: 0.001,
        hint: 'Use S<sub>n</sub> = n/2 × [2a + (n − 1)d].',
        solution: steps(`a = ${a}, d = ${d}, n = ${N}.`, `S = ${N}/2 × [2 × ${a} + ${N - 1} × ${d}] = ${N / 2} × ${2 * a + (N - 1) * d}.`, `S = <b>${n(S)}</b>.`) };
    },
    verify: (x) => { let s = 0; for (let i = 0; i < x.N; i++) s += x.a + i * x.d; return s; },
  },
  'c10m-ap-multiples': {
    title: 'sum of multiples',
    make(r) {
      const k = choose(r, [3, 4, 5, 6, 7, 9]), m = pick(r, 8, 30), N = m * k + pick(r, 0, k - 1), S = (k * m * (m + 1)) / 2;
      return { k, m, N, q: `<p>Find the sum of all the multiples of ${k} between 1 and ${N} (including those that equal ${k} or are at most ${N}).</p>`, answer: S, unit: '', tol: 0.001,
        hint: `The multiples are ${k}, ${2 * k}, ${3 * k}, … an AP with a = d = ${k}. First find how many there are: the last one is ${k} × ⌊${N}/${k}⌋.`,
        solution: steps(`Multiples of ${k} up to ${N}: ${k}, ${2 * k}, …, ${m * k}. That is ${m} terms (${m * k} ≤ ${N} &lt; ${(m + 1) * k}).`, `S = n/2 × (a + l) = ${m}/2 × (${k} + ${m * k}).`, `S = <b>${n(S)}</b>.`) };
    },
    verify: (x) => { let s = 0; for (let v = x.k; v <= x.N; v += x.k) s += v; return s; },
  },
  'c10m-ap-count': {
    title: 'how many terms?',
    make(r) {
      const a = pick(r, -15, 20), d = pick(r, 2, 9), N = pick(r, 9, 35), l = a + (N - 1) * d;
      return { a, d, l, q: `<p>How many terms are there in the AP ${a}, ${a + d}, ${a + 2 * d}, …, ${l}?</p>`, answer: N, unit: 'terms', tol: 0.001,
        hint: 'The last term is a + (n − 1)d. Put it equal to the given last term and solve for n.',
        solution: steps(`a = ${a}, d = ${d}, last term ${l}.`, `${a} + (n − 1) × ${d} = ${l}, so (n − 1) × ${d} = ${l - a}.`, `n − 1 = ${(l - a) / d}, so n = <b>${N}</b>.`) };
    },
    verify: (x) => { let v = x.a, c = 1; while (v < x.l) { v += x.d; c++; } return c; },
  },
  'c10m-ap-seats': {
    title: 'seats in a stand',
    make(r) {
      const a = pick(r, 10, 30), d = pick(r, 2, 6), N = pick(r, 10, 24), S = (N * (2 * a + (N - 1) * d)) / 2;
      return { a, d, N, q: `<p>A school hall has ${N} rows of chairs. The first row has ${a} chairs and each row has ${d} more chairs than the row before it. How many chairs are there in all?</p>`, answer: S, unit: 'chairs', tol: 0.001,
        hint: 'This is an AP with a = first row, d = extra chairs per row, n = number of rows. Use S = n/2 × [2a + (n − 1)d].',
        solution: steps(`a = ${a}, d = ${d}, n = ${N}. The last row has l = ${a} + ${N - 1} × ${d} = ${a + (N - 1) * d} chairs.`, `S = n(a + l)/2 = ${N} × (${a} + ${a + (N - 1) * d}) / 2.`, `Total = <b>${n(S)} chairs</b>.`) };
    },
    verify: (x) => { let s = 0, row = x.a; for (let i = 0; i < x.N; i++) { s += row; row += x.d; } return s; },
  },
};
