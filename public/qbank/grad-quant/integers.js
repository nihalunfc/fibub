import { int, choose, fmt, numOpts, digitOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
const digitSum = (n) => String(n).split('').reduce((s, d) => s + +d, 0);
export default {
  topic: 'integers',
  items: [
    { id: 'in-001', type: 'mcq', level: 1, exams: E, sub: 'divisibility',
      q: '<p>Which of these numbers is divisible by 9?</p>', options: ['3,717', '4,321', '5,550', '6,104', '7,012'], answer: 0,
      sol: '<p>A number is divisible by 9 exactly when its digit sum is. Digit sums: 3+7+1+7 = 18 (divisible by 9), 10, 15, 11 and 10. Only 3,717 works (3,717 = 9 × 413).</p>', trap: '5,550 has digit sum 15, which is divisible by 3 but not by 9.' },
    { id: 'in-002', type: 'mcq', level: 2, exams: E, sub: 'divisibility',
      q: '<p>If <i>n</i> is divisible by both 6 and 10, which of the following must <i>n</i> be divisible by?</p>', options: ['12', '20', '30', '60', '120'], answer: 2,
      sol: '<p>Divisible by 6 = 2 × 3 and by 10 = 2 × 5 means <i>n</i> holds the primes 2, 3 and 5 at least once each, so <i>n</i> is a multiple of the LCM, 30. <i>n</i> = 30 itself is not divisible by 12, 20, 60 or 120, so only 30 must work.</p>', trap: 'Multiplying 6 × 10 = 60 counts the shared 2 twice.' },
    { id: 'in-003', type: 'mcq', level: 2, exams: E, sub: 'consecutive',
      q: '<p>The product of any three consecutive integers must be divisible by which of the following?</p>', options: ['4', '5', '6', '9', '12'], answer: 2,
      sol: '<p>Among any three consecutive integers one is a multiple of 3 and at least one is even, so the product is a multiple of 2 × 3 = 6. Test 1 × 2 × 3 = 6: it is not divisible by 4, 5, 9 or 12.</p>' },
    { id: 'in-004', type: 'mcq', level: 3, exams: E, sub: 'units digit',
      q: '<p>What is the units digit of 7<sup>43</sup>?</p>', options: ['1', '3', '5', '7', '9'], answer: 1,
      sol: '<p>Units digits of powers of 7 repeat in a cycle of 4: 7, 9, 3, 1. 43 = 4 × 10 + 3, so 7<sup>43</sup> ends like 7<sup>3</sup> = 343: units digit 3.</p>', trap: 'Using remainder 3 but counting the cycle from 0 gives 1.' },
  ],
  gens: [
    { id: 'in-g01', type: 'mcq', level: 2, exams: E, sub: 'multiples in a range', title: 'count the multiples in a range',
      make(r) {
        const k = choose(r, [3, 4, 6, 7, 8, 9, 11, 12, 13]), a = int(r, 10, 90), b = a + int(r, 60, 400);
        const first = Math.ceil(a / k) * k, last = Math.floor(b / k) * k, value = (last - first) / k + 1;
        return { q: `<p>How many multiples of ${k} are there from ${a} to ${b}, inclusive?</p>`, ...numOpts(r, value, [value - 1, value + 1, Math.round((b - a) / k)]), value, a, b, k,
          hint: 'Find the first and last multiple inside the range, then use (last − first) ÷ step + 1.',
          sol: steps(`First multiple of ${k} at or above ${a}: ${first}.`, `Last multiple at or below ${b}: ${last}.`, `Count = (${last} − ${first}) ÷ ${k} + 1 = ${(last - first) / k} + 1 = <b>${value}</b>.`), trap: 'Forgetting the +1 (counting gaps instead of numbers).' };
      }, check: (p) => Math.floor(p.b / p.k) - Math.floor((p.a - 1) / p.k) },
    { id: 'in-g02', type: 'mcq', level: 2, exams: E, sub: 'units digit', title: 'units digit of a power',
      make(r) {
        const b = choose(r, [2, 3, 7, 8, 12, 13, 17, 18]), e = int(r, 21, 99), u = b % 10;
        const cyc = [1, 2, 3, 4].map((i) => (u ** i) % 10), value = cyc[(e - 1) % 4];
        const rest = e % 4;
        return { q: `<p>What is the units digit of ${b}<sup>${e}</sup>?</p>`, ...digitOpts(r, value, cyc), value, b, e,
          hint: `Only the units digit ${u} matters. Write its powers until the units digits repeat.`,
          sol: steps(`Units digits of ${u}<sup>1</sup>, ${u}<sup>2</sup>, ${u}<sup>3</sup>, ${u}<sup>4</sup>: ${cyc.join(', ')}; then the cycle repeats every 4.`, `${e} ÷ 4 leaves remainder ${rest}${rest === 0 ? ', which means the 4th place in the cycle' : ''}.`, `So the units digit is <b>${value}</b>.`), trap: 'Counting a remainder of 0 as the first place in the cycle instead of the last.' };
      }, check: (p) => { let d = 1; for (let i = 0; i < p.e; i++) d = (d * (p.b % 10)) % 10; return d; } },
    { id: 'in-g03', type: 'mcq', level: 2, exams: E, sub: 'digit sum', title: 'find the missing digit',
      make(r) {
        const k = choose(r, [3, 9]); let n, d, value;
        do { n = int(r, 100, 999) * 10; d = int(r, 0, 9); } while ((digitSum(n) % k) === 0);
        const s = digitSum(n); value = (k - (s % k)) % k; // smallest digit
        const all = []; for (let x = 0; x <= 9; x++) if ((s + x) % k === 0) all.push(x);
        const shown = String(n).slice(0, 3);
        return { q: `<p>The four-digit number ${shown}<i>d</i>, where <i>d</i> is its units digit, is divisible by ${k}. What is the smallest possible value of <i>d</i>?</p>`, ...digitOpts(r, value, [value + 1, value + 3, 9 - value]), value, s, k,
          hint: `A number is divisible by ${k} when its digit sum is.`,
          sol: steps(`Digit sum without <i>d</i>: ${shown.split('').join(' + ')} = ${s}.`, `${s} + <i>d</i> must be a multiple of ${k}: <i>d</i> can be ${all.join(', ')}.`, `The smallest is <b>${value}</b>.`) };
      }, check: (p) => (p.k - (p.s % p.k)) % p.k },
    { id: 'in-g04', type: 'mcq', level: 3, exams: E, sub: 'consecutive', title: 'sum of consecutive integers',
      make(r) {
        const n = choose(r, [5, 7, 9, 11]), a = int(r, -6, 40), sum = n * (2 * a + n - 1) / 2, value = a + n - 1;
        return { q: `<p>The sum of ${n} consecutive integers is ${fmt(sum)}. What is the largest of the integers?</p>`, ...numOpts(r, value, [a, sum / n, value + 1]), value, sum, n,
          hint: 'For an odd count of consecutive integers, the middle one is the average: sum ÷ count.',
          sol: steps(`The middle integer is the average: ${fmt(sum)} ÷ ${n} = ${fmt(sum / n)}.`, `There are ${(n - 1) / 2} integers above the middle one.`, `Largest = ${fmt(sum / n)} + ${(n - 1) / 2} = <b>${fmt(value)}</b>.`), trap: `Stopping at the average (${fmt(sum / n)}).` };
      }, check: (p) => p.sum / p.n + (p.n - 1) / 2 },
  ],
};
