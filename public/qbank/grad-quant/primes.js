import { int, choose, fmt, gcd, lcm, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
function factor(n) { const f = []; for (let p = 2; p * p <= n; p++) while (n % p === 0) { f.push(p); n /= p; } if (n > 1) f.push(n); return f; }
const powers = (n) => { const m = new Map(); for (const p of factor(n)) m.set(p, (m.get(p) || 0) + 1); return m; };
const show = (n) => [...powers(n)].map(([p, e]) => (e > 1 ? `${p}<sup>${e}</sup>` : `${p}`)).join(' × ');
export default {
  topic: 'primes',
  items: [
    { id: 'pr-001', type: 'mcq', level: 1, exams: E, sub: 'primes',
      q: '<p>How many prime numbers are between 30 and 50?</p>', options: ['3', '4', '5', '6', '7'], answer: 2,
      sol: '<p>Check the odd numbers: 31, 37, 41, 43 and 47 are prime; 33, 35, 39, 45 and 49 are not (3 × 11, 5 × 7, 3 × 13, 5 × 9, 7 × 7). That is 5 primes.</p>', trap: 'Counting 49 (= 7 × 7) as prime.' },
    { id: 'pr-002', type: 'mcq', level: 2, exams: E, sub: 'primes',
      q: '<p>Which statement about prime numbers is true?</p>', options: ['1 is the smallest prime.', 'Every prime is odd.', '2 is the only even prime.', 'The sum of two primes is always even.', 'There are exactly 100 primes below 1,000.'], answer: 2,
      sol: '<p>A prime has exactly two factors, 1 and itself. 1 has only one factor, so it is not prime. 2 is prime and even; every other even number has 2 as a factor, so 2 is the only even prime. 2 + 3 = 5 is odd. There are 168 primes below 1,000.</p>' },
    { id: 'pr-003', type: 'mcq', level: 3, exams: E, sub: 'trailing zeros',
      q: '<p>How many zeros are at the end of 30! (30 factorial)?</p>', options: ['3', '5', '6', '7', '10'], answer: 3,
      sol: '<p>Each trailing zero needs a 10 = 2 × 5, and 5s are rarer than 2s. Count the 5s in 1 × 2 × ... × 30: multiples of 5 give 30 ÷ 5 = 6, and 25 gives one extra 5. Total 7 zeros.</p>', trap: 'Forgetting that 25 = 5 × 5 holds two 5s gives 6.' },
  ],
  gens: [
    { id: 'pr-g01', type: 'mcq', level: 2, exams: E, sub: 'number of factors', title: 'count the factors of a number',
      make(r) {
        const a = choose(r, [2, 3]), b = choose(r, [5, 7]), ea = int(r, 1, 4), eb = int(r, 1, 3), c = choose(r, [1, 11, 13]);
        const n = a ** ea * b ** eb * c, value = (ea + 1) * (eb + 1) * (c > 1 ? 2 : 1);
        return { q: `<p>How many positive factors does ${fmt(n)} have?</p>`, ...numOpts(r, value, [ea * eb * (c > 1 ? 1 : 1), ea + eb + (c > 1 ? 1 : 0), value / 2]), value, n,
          hint: 'Write the prime factorisation, add 1 to each exponent and multiply.',
          sol: steps(`${fmt(n)} = ${show(n)}.`, `Each factor chooses how many of each prime to take: ${[...powers(n).values()].map((e) => `${e + 1} choices`).join(', ')}.`, `Number of factors = ${[...powers(n).values()].map((e) => e + 1).join(' × ')} = <b>${value}</b>.`), trap: 'Multiplying the exponents without adding 1 first.' };
      }, check: (p) => { let c = 0; for (let i = 1; i <= p.n; i++) if (p.n % i === 0) c++; return c; } },
    { id: 'pr-g02', type: 'mcq', level: 2, exams: E, sub: 'gcd lcm', title: 'least common multiple',
      make(r) {
        const g = choose(r, [2, 3, 4, 5, 6]), x = choose(r, [2, 3, 5, 7]), y = choose(r, [3, 4, 5, 7, 9].filter((v) => gcd(v, x) === 1));
        const a = g * x, b = g * y, value = lcm(a, b);
        return { q: `<p>Two lights blink together at noon. One blinks every ${a} seconds and the other every ${b} seconds. After how many seconds do they next blink together?</p>`, ...numOpts(r, value, [a * b, gcd(a, b), a + b]), value, a, b,
          hint: 'They meet again at the least common multiple: take each prime the highest number of times it appears.',
          sol: steps(`${a} = ${show(a)} and ${b} = ${show(b)}.`, `LCM takes every prime at its highest power: ${show(value)}.`, `LCM = <b>${value}</b> seconds. (Check: ${a} × ${b} ÷ GCD ${gcd(a, b)} = ${value}.)`), trap: `Multiplying ${a} × ${b} = ${a * b} counts the shared factor ${g} twice.` };
      }, check: (p) => lcm(p.a, p.b) },
    { id: 'pr-g03', type: 'mcq', level: 2, exams: E, sub: 'gcd lcm', title: 'greatest common divisor',
      make(r) {
        const g = choose(r, [4, 6, 8, 9, 12, 14, 15, 18]), x = choose(r, [3, 5, 7, 11]), y = choose(r, [2, 4, 8, 13].filter((v) => gcd(v, x) === 1));
        const a = g * x, b = g * y, value = gcd(a, b);
        return { q: `<p>A teacher has ${a} pencils and ${b} erasers. She makes identical gift bags with no items left over, each bag holding the same number of pencils and the same number of erasers. What is the greatest number of bags she can make?</p>`, ...numOpts(r, value, [g / 2, lcm(a, b) / 10, x + y]), value, a, b,
          hint: 'The number of bags must divide both counts: find the greatest common divisor.',
          sol: steps(`${a} = ${show(a)}; ${b} = ${show(b)}.`, `GCD takes only the shared primes at their lowest power: ${show(value)} = ${value}.`, `So <b>${value}</b> bags, each with ${a / value} pencils and ${b / value} erasers.`) };
      }, check: (p) => gcd(p.a, p.b) },
    { id: 'pr-g04', type: 'mcq', level: 3, exams: E, sub: 'prime factors', title: 'smallest multiplier for a perfect square',
      make(r) {
        const base = choose(r, [2, 3, 5, 6, 7, 10]), extra = choose(r, [2, 3, 5, 6, 7, 10, 15, 14].filter((v) => v !== base));
        const n = base * base * extra * choose(r, [1, 4, 9]);
        let value = 1; for (const [p, e] of powers(n)) if (e % 2) value *= p;
        return { q: `<p>What is the smallest positive integer <i>k</i> such that ${fmt(n)}<i>k</i> is the square of an integer?</p>`, ...numOpts(r, value, [n, extra * 2, value * 2]), value, n,
          hint: 'In a perfect square every prime appears an even number of times.',
          sol: steps(`${fmt(n)} = ${show(n)}.`, `The primes with odd exponents must get one more: ${[...powers(n)].filter(([, e]) => e % 2).map(([p]) => p).join(' × ') || 'none'}.`, `So <b>k = ${value}</b>, making ${fmt(n * value)} = ${Math.sqrt(n * value)}<sup>2</sup>.`) };
      }, check: (p) => { for (let k = 1; ; k++) if (Number.isInteger(Math.sqrt(p.n * k))) return k; } },
  ],
};
