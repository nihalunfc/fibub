// Class 9 Maths, The World of Algorithms: live problems (original fibub questions). Ids start with c9m-algo-.
import { pick, choose, n, steps } from './_util.js';

const coprime = (a, b) => { while (b) [a, b] = [b, a % b]; return a === 1; };
export default {
  'c9m-algo-hcf': {
    title: 'HCF by Euclid’s algorithm',
    make(r) {
      const g = pick(r, 2, 15); const PAIRS = []; for (let i = 2; i <= 14; i++) for (let j = i + 1; j <= 14; j++) if (coprime(i, j)) PAIRS.push([i, j]); const [p, q] = choose(r, PAIRS);
      const a = g * Math.max(p, q), b = g * Math.min(p, q); let x = a, y = b; const ls = [];
      while (y) { ls.push(`${x} = ${Math.floor(x / y)} × ${y} + ${x % y}`); [x, y] = [y, x % y]; }
      return { a, b, g, q: `<p>Use Euclid’s algorithm to find the HCF of ${a} and ${b}.</p>`, answer: x, abs: 0.01, tol: 0, unit: '',
        hint: 'Divide the bigger number by the smaller; then divide the divisor by the remainder; stop when the remainder is 0.',
        solution: steps(...ls, `The last divisor, where the remainder is 0, is <b>${x}</b>.`) };
    },
    verify: (p) => { let h = 1; for (let d = 1; d <= p.b; d++) if (p.a % d === 0 && p.b % d === 0) h = d; return h; },
  },
  'c9m-algo-count': {
    title: 'count the division steps',
    make(r) {
      const a = pick(r, 50, 400), b = pick(r, 20, 49); let x = a, y = b, k = 0; while (y) { [x, y] = [y, x % y]; k++; }
      return { a, b, q: `<p>How many division steps does Euclid’s algorithm take to find the HCF of ${a} and ${b}? (Count each division, including the last one that leaves remainder 0.)</p>`, answer: k, abs: 0.01, tol: 0, unit: '',
        hint: `Write ${a} = q × ${b} + r, then continue with ${b} and r.`,
        solution: steps(`Run the algorithm, counting one step per division.`, `It stops after <b>${k}</b> steps, with HCF ${x}.`) };
    },
    verify: (p) => { const f = (x, y) => (y === 0 ? 0 : 1 + f(y, x % y)); return f(p.a, p.b); },
  },
  'c9m-algo-binary': {
    title: 'binary search worst case',
    make(r) {
      const m = pick(r, 20, 1000, 10); let k = 0, left = m; while (left > 0) { left = Math.floor(left / 2); k++; }
      return { m, q: `<p>A sorted list has ${m} names. What is the largest number of guesses binary search may need to find a name that is in the list?</p>`, answer: k, abs: 0.01, tol: 0, unit: '',
        hint: 'Each guess halves the list. Find the smallest k with 2<sup>k</sup> bigger than the number of names.',
        solution: steps(`After each guess about half the names remain: ${m}, ${Math.floor(m / 2)}, ... down to 0.`, `That takes <b>${k}</b> guesses (2<sup>${k}</sup> = ${2 ** k} > ${m}).`) };
    },
    verify: (p) => { let k = 0; while (2 ** k <= p.m) k++; return k; },
  },
  'c9m-algo-bubble': {
    title: 'swaps in bubble sort',
    make(r) {
      const a = Array.from({ length: 6 }, (_, i) => i + 1); for (let i = 5; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      const b = a.slice(); let sw = 0; for (let p = 0; p < 5; p++) for (let i = 0; i < 5 - p; i++) if (b[i] > b[i + 1]) { [b[i], b[i + 1]] = [b[i + 1], b[i]]; sw++; }
      return { a, q: `<p>Bubble sort is used to arrange ${a.join(', ')} in increasing order. It swaps two neighbours only when the left one is bigger. How many swaps are made in total?</p>`, answer: sw, abs: 0.01, tol: 0, unit: '',
        hint: 'Each swap fixes exactly one pair that is the wrong way round. Count such pairs (a bigger number somewhere to the left of a smaller one).',
        solution: steps(`Work through the passes, swapping neighbours that are out of order.`, `The total number of swaps is <b>${sw}</b>: the same as the number of pairs that start out of order.`) };
    },
    verify: (p) => { let c = 0; for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) if (p.a[i] > p.a[j]) c++; return c; },
  },
  'c9m-algo-select': {
    title: 'comparisons in selection sort',
    make(r) {
      const m = pick(r, 4, 25); let c = 0; for (let i = 0; i < m - 1; i++) for (let j = i + 1; j < m; j++) c++;
      return { m, q: `<p>Selection sort arranges ${m} numbers. In each round it finds the smallest of the numbers not yet placed by comparing each remaining number with the best so far. How many comparisons are made in total?</p>`, answer: c, abs: 0.01, tol: 0, unit: '',
        hint: `Round 1 compares ${m - 1} times, round 2 compares ${m - 2} times, and so on down to 1.`,
        solution: steps(`Comparisons: ${m - 1} + ${m - 2} + ... + 1.`, `This is (${m} × ${m - 1}) ÷ 2 = <b>${c}</b>.`) };
    },
    verify: (p) => (p.m * (p.m - 1)) / 2,
  },
  'c9m-algo-loop': {
    title: 'trace a loop',
    make(r) {
      const m = pick(r, 3, 12), s0 = pick(r, 0, 10); let S = s0; for (let i = 1; i <= m; i++) S += i;
      return { m, s0, q: `<p>A flowchart starts with S = ${s0} and i = 1. While i ≤ ${m}, it does S = S + i and i = i + 1. What is the value of S when it stops?</p>`, answer: S, abs: 0.01, tol: 0, unit: '',
        hint: `The loop adds 1, 2, 3, ... up to ${m} to the starting value of S.`,
        solution: steps(`The loop adds 1 + 2 + ... + ${m} = ${(m * (m + 1)) / 2}.`, `S = ${s0} + ${(m * (m + 1)) / 2} = <b>${S}</b>.`) };
    },
    verify: (p) => p.s0 + (p.m * (p.m + 1)) / 2,
  },
};
