// Class 8 Maths, Chapter 5 Number Play: live problems (original fibub questions). Ids start with c8m-play-.
import { pick, choose, n, steps } from './_util.js';

const digitSum = (m) => String(m).split('').reduce((a, b) => a + +b, 0);
export default {
  'c8m-play-div3': {
    title: 'the missing digit for 3',
    make(r) {
      const a = pick(r, 1, 9), c = pick(r, 0, 9), s = a + c, d = (3 - (s % 3)) % 3;
      return { a, c, q: `<p>The digit d is missing in the number ${a}d${c} (hundreds digit ${a}, tens digit d, units digit ${c}). What is the smallest digit d that makes the number divisible by 3?</p>`, answer: d, abs: 0.01, tol: 0, unit: '',
        hint: 'A number divides by 3 when its digit sum does. Add the two known digits and see how far you are from the next multiple of 3.',
        solution: steps(`Known digits add to ${a} + ${c} = ${s}.`, `We need ${a} + d + ${c} to be a multiple of 3. The smallest d (from 0) that does it is <b>${d}</b>: the sum becomes ${s + d}.`) };
    },
    verify: (p) => { for (let d = 0; d < 10; d++) if ((100 * p.a + 10 * d + p.c) % 3 === 0) return d; },
  },
  'c8m-play-div11': {
    title: 'the missing digit for 11',
    make(r) {
      const a = pick(r, 1, 8), c = pick(r, 0, 9 - a), x = a + c;
      return { a, c, q: `<p>The tens digit x is missing in ${a}x${c}. Which digit x makes the number divisible by 11?</p>`, answer: x, abs: 0.01, tol: 0, unit: '',
        hint: 'Alternating sum: (hundreds + units) minus tens must be 0 or a multiple of 11.',
        solution: steps(`Alternating sum = ${a} − x + ${c}. For a multiple of 11 we want it to be 0.`, `So x = ${a} + ${c} = <b>${x}</b>. Check: ${a}${x}${c} = ${100 * a + 10 * x + c} = 11 × ${(100 * a + 10 * x + c) / 11}.`) };
    },
    verify: (p) => { for (let x = 0; x < 10; x++) if ((100 * p.a + 10 * x + p.c) % 11 === 0) return x; },
  },
  'c8m-play-kap': {
    title: 'one Kaprekar step',
    make(r) {
      const N = choose(r, [3524, 8172, 4096, 7301, 2589, 9640, 1853, 6032, 4721]), ds = String(N).split('').map(Number).sort((x, y) => y - x), hi = +ds.join(''), lo = +ds.reverse().join('');
      return { N, q: `<p>Do one step of Kaprekar's routine on ${N}: arrange its digits largest-first and smallest-first, then subtract. What do you get?</p>`, answer: hi - lo, abs: 0.01, tol: 0, unit: '',
        hint: 'Write the biggest number from the four digits, then the smallest (a 0 at the front is allowed). Subtract.',
        solution: steps(`Largest: ${hi}. Smallest: ${String(lo).padStart(4, '0')}.`, `${hi} − ${lo} = <b>${hi - lo}</b>.`) };
    },
    verify: (p) => { const d = String(p.N).split('').map(Number); return (+d.slice().sort((a, b) => b - a).join('') - +d.slice().sort((a, b) => a - b).join('')); },
  },
  'c8m-play-root': {
    title: 'digital root',
    make(r) {
      const N = pick(r, 100, 9999), root = 1 + ((N - 1) % 9);
      return { N, q: `<p>Find the digital root of ${N}: keep adding the digits until one digit is left.</p>`, answer: root, abs: 0.01, tol: 0, unit: '',
        hint: 'Add the digits. If the answer has two digits, add again.',
        solution: steps(`${String(N).split('').join(' + ')} = ${digitSum(N)}.`, digitSum(N) > 9 ? `${String(digitSum(N)).split('').join(' + ')} = <b>${root}</b>.` : `Already one digit: <b>${root}</b>.`) };
    },
    verify: (p) => { let m = p.N; while (m > 9) m = digitSum(m); return m; },
  },
  'c8m-play-magic': {
    title: 'magic constant',
    make(r) {
      const k = pick(r, 3, 9), M = (k * (k * k + 1)) / 2;
      return { k, q: `<p>A ${k} × ${k} magic square uses each of the numbers 1 to ${k * k} once, and every row adds to the same total. What is that magic constant?</p>`, answer: M, abs: 0.01, tol: 0, unit: '',
        hint: 'Add 1 + 2 + ... + ' + k * k + ' (the formula is count × (count + 1) ÷ 2), then share it among the rows.',
        solution: steps(`Total of 1 to ${k * k} = ${k * k} × ${k * k + 1} ÷ 2 = ${(k * k * (k * k + 1)) / 2}.`, `${k} rows share it equally: <b>${M}</b> each.`) };
    },
    verify: (p) => { let t = 0; for (let i = 1; i <= p.k * p.k; i++) t += i; return t / p.k; },
  },
  'c8m-play-rev': {
    title: 'reverse and add',
    make(r) {
      const N = pick(r, 12, 98), a = Math.floor(N / 10), b = N % 10, R = 10 * b + a;
      return { N, q: `<p>Reverse ${N} and add it to the original: ${N} + (its reverse). What is the total?</p>`, answer: N + R, abs: 0.01, tol: 0, unit: '',
        hint: 'The reverse of a two-digit number swaps the tens and units digits.',
        solution: steps(`Reverse of ${N} is ${R}.`, `${N} + ${R} = <b>${N + R}</b>.`) };
    },
    verify: (p) => p.N + +String(p.N).split('').reverse().join(''),
  },
  'c8m-play-odds': {
    title: 'sum of odd numbers',
    make(r) {
      const k = pick(r, 6, 30);
      return { k, q: `<p>What is 1 + 3 + 5 + ... + ${2 * k - 1} (the first ${k} odd numbers)?</p>`, answer: k * k, abs: 0.01, tol: 0, unit: '',
        hint: 'The sum of the first n odd numbers is n × n. How many numbers are being added?',
        solution: steps(`The last number ${2 * k - 1} is the ${k}th odd number, so there are ${k} of them.`, `Sum = ${k}² = <b>${k * k}</b>.`) };
    },
    verify: (p) => { let t = 0; for (let i = 1; i <= 2 * p.k - 1; i += 2) t += i; return t; },
  },
};
