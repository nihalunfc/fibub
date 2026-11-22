import { int, choose, fmt, numOpts, textOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'odd-even',
  items: [
    { id: 'oe-001', type: 'mcq', level: 2, exams: E, sub: 'odd even',
      q: '<p>If <i>a</i> is odd and <i>b</i> is even, which of the following must be odd?</p>', options: ['<i>ab</i>', '<i>a</i> + 2<i>b</i>', '2<i>a</i> + <i>b</i>', '<i>a</i><i>b</i> + <i>b</i>', '<i>b</i><sup>2</sup>'], answer: 1,
      sol: '<p>Use the smallest examples, <i>a</i> = 1, <i>b</i> = 2: <i>ab</i> = 2, <i>a</i> + 2<i>b</i> = 5, 2<i>a</i> + <i>b</i> = 4, <i>ab</i> + <i>b</i> = 4, <i>b</i><sup>2</sup> = 4. Only <i>a</i> + 2<i>b</i> is odd, and it always is: 2<i>b</i> is even, and odd + even = odd.</p>' },
    { id: 'oe-002', type: 'mcq', level: 3, exams: E, sub: 'signs',
      q: '<p>If <i>xy</i> &lt; 0 and <i>yz</i> &gt; 0, which of the following must be true?</p>', options: ['<i>x</i> &gt; 0', '<i>z</i> &lt; 0', '<i>xz</i> &lt; 0', '<i>xz</i> &gt; 0', '<i>x</i> + <i>z</i> = 0'], answer: 2,
      sol: '<p><i>xy</i> &lt; 0: <i>x</i> and <i>y</i> have opposite signs. <i>yz</i> &gt; 0: <i>y</i> and <i>z</i> have the same sign. So <i>z</i> has the sign of <i>y</i>, the opposite of <i>x</i>, and <i>xz</i> &lt; 0. Nothing tells us which one is positive.</p>' },
    { id: 'oe-003', type: 'mcq', level: 2, exams: E, sub: 'remainders',
      q: '<p>When <i>n</i> is divided by 6 the remainder is 4. What is the remainder when <i>n</i> is divided by 3?</p>', options: ['0', '1', '2', '3', '4'], answer: 1,
      sol: '<p><i>n</i> = 6<i>q</i> + 4 = 3(2<i>q</i> + 1) + 1, so the remainder on division by 3 is 1. Check with <i>n</i> = 4, 10, 16: each leaves 1 when divided by 3.</p>', trap: 'Answering 4: a remainder must be smaller than the divisor.' },
  ],
  gens: [
    { id: 'oe-g01', type: 'mcq', level: 2, exams: E, sub: 'remainders', title: 'remainder of a sum or product',
      make(r) {
        const d = choose(r, [5, 7, 8, 9, 11]), ra = int(r, 1, d - 1), rb = int(r, 1, d - 1), mult = r() < 0.5;
        const value = mult ? (ra * rb) % d : (ra + rb) % d;
        return { q: `<p>When <i>a</i> is divided by ${d} the remainder is ${ra}, and when <i>b</i> is divided by ${d} the remainder is ${rb}. What is the remainder when ${mult ? '<i>ab</i>' : '<i>a</i> + <i>b</i>'} is divided by ${d}?</p>`, ...numOpts(r, value, [mult ? ra * rb : ra + rb, (value + 1) % d, 0].filter((x) => x !== value)), value, d, ra, rb, mult,
          hint: `Pick the smallest numbers that fit: a = ${ra}, b = ${rb}.`,
          sol: steps(`Remainders follow the ${mult ? 'product' : 'sum'}: use a = ${ra} and b = ${rb}.`, `${mult ? `${ra} × ${rb} = ${ra * rb}` : `${ra} + ${rb} = ${ra + rb}`}.`, `${mult ? ra * rb : ra + rb} divided by ${d} leaves <b>${value}</b>.`), trap: `Answering ${mult ? ra * rb : ra + rb} without reducing it below ${d}.` };
      }, check: (p) => (p.mult ? p.ra * p.rb : p.ra + p.rb) % p.d },
    { id: 'oe-g02', type: 'mcq', level: 3, exams: E, sub: 'remainders', title: 'smallest number with two remainders',
      make(r) {
        const a = choose(r, [4, 5, 6, 7]), b = choose(r, [3, 5, 7, 9].filter((x) => x !== a && x % a && a % x)), ra = int(r, 1, a - 1), rb = int(r, 1, b - 1);
        let value = 0; for (let n = 1; n < 500; n++) if (n % a === ra && n % b === rb) { value = n; break; }
        if (!value) return this.make(() => r());
        let l = a * b; const g = (x, y) => (y ? g(y, x % y) : x); l = (a * b) / g(a, b);
        return { q: `<p>A positive integer <i>n</i> leaves remainder ${ra} when divided by ${a} and remainder ${rb} when divided by ${b}. What is the smallest possible value of <i>n</i>?</p>`, ...numOpts(r, value, [value + l, ra + rb, l + ra]), value, a, b, ra, rb,
          hint: `List numbers that leave ${rb} when divided by ${b}: ${rb}, ${rb + b}, ${rb + 2 * b}, ... and test each against ${a}.`,
          sol: steps(`Numbers with remainder ${rb} on division by ${b}: ${[0, 1, 2, 3, 4, 5].map((k) => rb + k * b).join(', ')}, ...`, `The first of these that leaves ${ra} on division by ${a} is ${value}.`, `So <b>n = ${value}</b> (and the next is ${value + l}, since the pattern repeats every LCM = ${l}).`) };
      }, check: (p) => { for (let n = 1; ; n++) if (n % p.a === p.ra && n % p.b === p.rb) return n; } },
    { id: 'oe-g03', type: 'mcq', level: 2, exams: E, sub: 'odd even', title: 'how many odd results',
      make(r) {
        const lo = int(r, 1, 30), n = int(r, 12, 40), hi = lo + n - 1;
        let value = 0; for (let k = lo; k <= hi; k++) if ((k * k + k + 1) % 2) value++;
        const odd = Math.ceil(n / 2);
        return { q: `<p>For how many integers <i>k</i> from ${lo} to ${hi}, inclusive, is <i>k</i><sup>2</sup> + <i>k</i> + 1 odd?</p>`, ...numOpts(r, value, [odd, n - odd, Math.floor(n / 2)].filter((x) => x !== value)), value, n,
          hint: 'k² + k = k(k + 1) is a product of two consecutive integers.',
          sol: steps('<i>k</i><sup>2</sup> + <i>k</i> = <i>k</i>(<i>k</i> + 1), and one of two consecutive integers is even, so it is always even.', 'Even + 1 is odd, so the expression is odd for every integer <i>k</i>.', `All ${n} integers work: <b>${value}</b>.`), trap: 'Counting only the odd values of k.' };
      }, check: (p) => p.n },
  ],
};
