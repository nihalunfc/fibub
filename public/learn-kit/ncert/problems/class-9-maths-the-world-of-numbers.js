// Class 9 Maths, The World of Numbers: live problems (original fibub questions). Ids start with c9m-num-.
import { pick, choose, n, steps } from './_util.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const POOL = [['3/4', 1], ['√2', 0], ['0.25', 1], ['π', 0], ['√16', 1], ['√5', 0], ['0.3333…', 1], ['−7', 1], ['√3', 0], ['2.5', 1], ['√49', 1], ['√10', 0], ['22/7', 1], ['0.101001000…', 0], ['√(1/4)', 1]];
export default {
  'c9m-num-classify': {
    title: 'count the irrational numbers',
    make(r) {
      const idx = [...POOL.keys()].sort((a, b) => (((a * 7 + Math.floor(r() * 1000)) % 17) - ((b * 7 + Math.floor(r() * 1000)) % 17))).slice(0, 6), items = idx.map((i) => POOL[i]), c = items.filter((x) => x[1] === 0).length;
      return { items, q: `<p>How many of these numbers are irrational? ${items.map((x) => x[0]).join(', ')}</p>`, answer: c, abs: 0.01, tol: 0, unit: '',
        hint: 'A number is rational if it is p/q, which includes terminating and repeating decimals and square roots of perfect squares. √ of a non-square and the never-ending, never-repeating decimals are irrational.',
        solution: steps(...items.map((x) => `${x[0]}: ${x[1] ? 'rational' : 'irrational'}.`), `Irrational count = <b>${c}</b>.`) };
    },
    verify: (p) => p.items.reduce((s, x) => s + (x[1] === 0 ? 1 : 0), 0),
  },
  'c9m-num-period': {
    title: 'length of the repeating block',
    make(r) {
      const q = choose(r, [3, 7, 9, 11, 13, 17, 19, 21, 27, 33, 37]), pn = pick(r, 1, q - 1);
      let rem = pn, seen = {}, i = 0; while (!(rem in seen)) { seen[rem] = i++; rem = (rem * 10) % q; } const per = i - seen[rem];
      return { pn, qq: q, per, q: `<p>The fraction ${pn}/${q} is written as a recurring decimal. How many digits are in its repeating block (the period)?</p>`, answer: per, abs: 0.01, tol: 0, unit: 'digits',
        hint: 'Do the long division. The block starts repeating when a remainder repeats. There are at most q − 1 different non-zero remainders.',
        solution: steps(`Divide ${pn} by ${q} by long division and watch the remainders.`, `The block of digits repeats with period <b>${per}</b>.`) };
    },
    verify: (p) => { const d = []; let rem = p.pn % p.qq; const seen = new Map(); let k = 0; while (rem && !seen.has(rem)) { seen.set(rem, k++); rem *= 10; d.push(Math.floor(rem / p.qq)); rem %= p.qq; } return rem ? k - seen.get(rem) : 0; },
  },
  'c9m-num-term': {
    title: 'terminating decimal',
    make(r) {
      const q = choose(r, [2, 4, 5, 8, 10, 16, 20, 25, 40, 50]), pn = pick(r, 1, 3 * q - 1);
      return { pn, qd: q, q: `<p>Write ${pn}/${q} as a decimal.</p>`, answer: pn / q, abs: 0.0001, tol: 0, unit: '',
        hint: 'The denominator has only the prime factors 2 and 5, so the decimal ends. Divide, or scale the fraction to a denominator of 10, 100 or 1000.',
        solution: steps(`${q} = ${q % 5 === 0 && q % 2 !== 0 ? '5 × …' : 'only 2s and 5s'}, so ${pn}/${q} terminates.`, `${pn} ÷ ${q} = <b>${n(pn / q, 6)}</b>.`) };
    },
    verify: (p) => { let v = 0, rem = p.pn, f = 1; v += Math.floor(rem / p.qd); rem %= p.qd; for (let i = 0; i < 8; i++) { rem *= 10; f /= 10; v += Math.floor(rem / p.qd) * f; rem %= p.qd; } return v; },
  },
  'c9m-num-frac': {
    title: 'a repeating decimal as a fraction',
    make(r) {
      const ab = pick(r, 1, 98), a = Math.floor(ab / 10), b = ab % 10;
      return { ab, q: `<p>Let x = 0.${String(ab).padStart(2, '0')}${String(ab).padStart(2, '0')}${String(ab).padStart(2, '0')}… (the block ${String(ab).padStart(2, '0')} repeats forever). Multiply x by 100 and subtract x to show that x = N/99. Find N.</p>`, answer: ab, abs: 0.01, tol: 0, unit: '',
        hint: '100x = ab.ababab… and x = 0.ababab…; subtracting removes the repeating part.',
        solution: steps(`100x = ${ab}.${String(ab).padStart(2, '0')}${String(ab).padStart(2, '0')}…`, `100x − x = 99x = ${ab}, so x = ${ab}/99.`, `N = <b>${ab}</b>.`) };
    },
    verify: (p) => Math.round((p.ab / 99) * 99),
  },
  'c9m-num-rat': {
    title: 'rationalise the denominator',
    make(r) {
      const nn = pick(r, 2, 8), d = pick(r, 1, 6), m = nn + d, k = d * pick(r, 1, 6);
      return { m, nn, k, d, q: `<p>Rationalise ${k}/(√${m} + √${nn}). The answer has the form c(√${m} − √${nn}). Find c.</p>`, answer: k / d, abs: 0.001, tol: 0, unit: '',
        hint: 'Multiply top and bottom by the conjugate √m − √n. The denominator becomes m − n.',
        solution: steps(`Multiply by (√${m} − √${nn})/(√${m} − √${nn}).`, `Denominator: ${m} − ${nn} = ${d}.`, `${k}(√${m} − √${nn})/${d}, so c = ${k}/${d} = <b>${n(k / d)}</b>.`) };
    },
    verify: (p) => (p.k / (Math.sqrt(p.m) + Math.sqrt(p.nn))) / (Math.sqrt(p.m) - Math.sqrt(p.nn)),
  },
  'c9m-num-pow': {
    title: 'rational powers',
    make(r) {
      const b = choose(r, [2, 3, 4, 5]), den = choose(r, [2, 3, 4]), num = pick(r, 1, 3), base = Math.pow(b, den);
      return { b, den, num, base, q: `<p>Find the value of ${base}<sup>${num}/${den}</sup>.</p>`, answer: Math.pow(b, num), abs: 0.01, tol: 0, unit: '',
        hint: 'a^(m/n) means the n-th root of a, raised to the power m. Take the root first: it is easier.',
        solution: steps(`${base}<sup>1/${den}</sup> = ${b}, because ${b}<sup>${den}</sup> = ${base}.`, `${base}<sup>${num}/${den}</sup> = ${b}<sup>${num}</sup> = <b>${Math.pow(b, num)}</b>.`) };
    },
    verify: (p) => Math.round(Math.pow(p.base, p.num / p.den)),
  },
  'c9m-num-law': {
    title: 'law of exponents',
    make(r) {
      const den = choose(r, [2, 3, 4, 5]), a = pick(r, 1, 9), b = pick(r, 1, 9), base = choose(r, [2, 3, 5, 7]);
      return { den, a, b, base, q: `<p>Simplify ${base}<sup>${a}/${den}</sup> × ${base}<sup>${b}/${den}</sup> = ${base}<sup>k</sup>. Find k as a decimal.</p>`, answer: (a + b) / den, abs: 0.001, tol: 0, unit: '',
        hint: 'Same base: add the exponents, a^p × a^q = a^(p + q).',
        solution: steps(`The base is the same, so add the exponents: ${a}/${den} + ${b}/${den} = ${a + b}/${den}.`, `k = <b>${n((a + b) / den, 5)}</b>.`) };
    },
    verify: (p) => Math.log(Math.pow(p.base, p.a / p.den) * Math.pow(p.base, p.b / p.den)) / Math.log(p.base),
  },
  'c9m-num-spiral': {
    title: 'the square-root spiral',
    make(r) {
      const m = pick(r, 3, 17);
      return { m, q: `<p>In the square-root spiral the first triangle has two legs of length 1, so its hypotenuse is √2. The next triangle uses that hypotenuse and a new leg of 1, and so on. Which triangle (counting the first as 1) has hypotenuse √${m}?</p>`, answer: m - 1, abs: 0.01, tol: 0, unit: '',
        hint: 'Each triangle adds 1 to the square of the hypotenuse: h² goes 2, 3, 4, …',
        solution: steps(`Triangle k has hypotenuse √(k + 1), because h² = (previous h)² + 1².`, `√${m} means k + 1 = ${m}, so k = <b>${m - 1}</b>.`) };
    },
    verify: (p) => { let h2 = 2, k = 1; while (h2 < p.m) { h2 += 1; k++; } return k; },
  },
  'c9m-num-floor': {
    title: 'between which whole numbers',
    make(r) {
      const N = pick(r, 3, 200);
      return { N, q: `<p>√${N} lies between two consecutive whole numbers. What is the smaller one?</p>`, answer: Math.floor(Math.sqrt(N)), abs: 0.01, tol: 0, unit: '',
        hint: 'Find the perfect squares just below and just above the number.',
        solution: steps(`${Math.floor(Math.sqrt(N)) ** 2} ≤ ${N} < ${(Math.floor(Math.sqrt(N)) + 1) ** 2}.`, `So √${N} lies between ${Math.floor(Math.sqrt(N))} and ${Math.floor(Math.sqrt(N)) + 1}. The smaller is <b>${Math.floor(Math.sqrt(N))}</b>.`) };
    },
    verify: (p) => { let k = 0; while ((k + 1) * (k + 1) <= p.N) k++; return k; },
  },
};
