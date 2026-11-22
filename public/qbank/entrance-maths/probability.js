// Probability (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Fixed items take their keys from exact enumeration or exact fractions computed in this file (see the helpers), and the
// templates' verify() recompute every answer another way (full enumeration of outcomes or long series sums).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0, 1, 2, 3, 0];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (level, sub, extra) => ({ level, exams: [...EXS[level], ...(extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
const M = (level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (level, sub, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
const X = (level, sub, q, options, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const SOPT = [
  'Both Statement I and Statement II are true',
  'Statement I is true and Statement II is false',
  'Statement I is false and Statement II is true',
  'Both Statement I and Statement II are false',
];
const A = (level, sub, a, r, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
const SC = (level, sub, lines, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...place(correct, wrongs), sol, trap, ...more });
const MT = (level, sub, group, q, correct, wrongs, sol, trap) =>
  base(level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const PI = (level, sub, group, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (level, sub, group, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, sol, trap, ...more });
const PM = (level, sub, group, q, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'passage', group, q, ...place(correct, wrongs), sol, trap, ...more });
const GEXS = (level, type) => [...EXS[level], ...(type === 'mcq' && level <= 3 ? ['cuet'] : [])];

// ---------- exact helpers ----------
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const F = (n, d = 1) => { const k = gcd(n, d) || 1; return [n / k, d / k]; };
const T = ([n, d]) => (d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`);
const fr = (f) => `$${T(f)}$`;
/** mcq whose options are fractions (arrays [n,d]); wrongs must differ from the answer */
const FM = (level, sub, q, ans, wrongs, sol, trap, more = {}) => M(level, sub, q, fr(ans), wrongs.map(fr), sol, trap, more);
const val = ([n, d]) => n / d;
const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const Pm = (n, k) => fact(n) / fact(n - k);
const r3 = (x) => +x.toFixed(3);
const r4 = (x) => +x.toFixed(4);
const D3 = ' (3 decimal places)';
const D4 = ' (4 decimal places)';
const T3 = { tol: 0.001 };
const dice2 = (f) => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (f(a, b)) c++; return c; };
const dice3 = (f) => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let d = 1; d <= 6; d++) if (f(a, b, d)) c++; return c; };
const binom = (n, k, p) => C(n, k) * p ** k * (1 - p) ** (n - k);
/** all distinct permutations of a string (for counting arrangements by brute force) */
const perms = (s) => { const out = new Set(); const go = (pre, rest) => { if (!rest.length) { out.add(pre); return; } for (let i = 0; i < rest.length; i++) go(pre + rest[i], rest.slice(0, i) + rest.slice(i + 1)); }; go('', s); return [...out]; };
const sgn = (v) => (v < 0 ? `-${-v}` : `+${v}`);

const groups = {
  pm1: {
    title: 'Two dice',
    passage: R`<p>Two fair dice are thrown. Match each event in List I with its probability in List II.</p>`,
    list1: ['A. The sum is 9', 'B. The sum is at least 11', 'C. The two numbers differ by exactly 2', 'D. The sum is 2 or 12'],
    list2: ['p. $\\dfrac1{12}$', 'q. $\\dfrac19$', 'r. $\\dfrac29$', 's. $\\dfrac1{18}$'],
  },
  pm2: {
    title: 'Binomial numbers',
    passage: R`<p>Let $X\sim B\left(8,\dfrac14\right)$ and let $Y$ be a single Bernoulli trial with $p=\dfrac14$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $E(X)$', 'B. $\\mathrm{Var}(X)$', 'C. $\\mathrm{Var}(Y)$', 'D. The probability that $B(2,\\frac14)$ gives no success'],
    list2: ['p. $\\dfrac3{16}$', 'q. $2$', 'r. $\\dfrac9{16}$', 's. $\\dfrac32$'],
  },
  pm3: {
    title: 'Rules and formulae',
    passage: R`<p>Match each situation in List I with the rule that is used in List II.</p>`,
    list1: ['A. The union of two events that may overlap', 'B. Probability of $A$ when $B$ is known to have happened', 'C. $A$ and $B$ do not influence each other', 'D. Finding which cause produced an observed effect'],
    list2: ['p. $\\dfrac{P(A\\cap B)}{P(B)}$', 'q. $P(A\\cap B)=P(A)\\,P(B)$', 'r. $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$', 's. $P(E_i\\mid A)=\\dfrac{P(E_i)P(A\\mid E_i)}{\\sum_j P(E_j)P(A\\mid E_j)}$'],
  },
  pm4: {
    title: 'Four coins',
    passage: R`<p>A fair coin is tossed four times. Match each event in List I with its probability in List II.</p>`,
    list1: ['A. Exactly one head', 'B. At most one head', 'C. All four tosses show the same face', 'D. At least one head'],
    list2: ['p. $\\dfrac5{16}$', 'q. $\\dfrac18$', 'r. $\\dfrac{15}{16}$', 's. $\\dfrac14$'],
  },
  pp1: {
    title: 'Passage: a box of coloured balls',
    passage: R`<p>A box holds 4 red, 3 green and 2 blue balls (9 balls in all). Two balls are drawn at random, without replacement.</p>`,
  },
  pp2: {
    title: 'Passage: an insurance company',
    passage: R`<p>An insurer finds that 20% of its drivers are young and 80% are not young. In one year, 10% of young drivers and 2% of the others have an accident.</p>`,
  },
  pp3: {
    title: 'Passage: free throws',
    passage: R`<p>A player scores each free throw with probability 0.7, independently of the other throws. She takes 5 throws. Let $X$ be the number of throws she scores.</p>`,
  },
  pp4: {
    title: 'Passage: a loaded game',
    passage: R`<p>A and B take turns to roll one fair die, A first. The first player to roll a six wins the game at once.</p>`,
  },
};

const itemsA = [
  // ================= classical probability =================
  FM(1, 'classical probability', R`A fair die is rolled once. The probability of getting a prime number is`, F(3, 6), [F(1, 3), F(2, 3), F(1, 6)],
    R`<p>Primes on a die: 2, 3, 5. That is 3 favourable outcomes out of 6, so $P=\dfrac36=\dfrac12$.</p>`, 'The number 1 is not prime.'),
  FM(1, 'classical probability', R`Two fair coins are tossed. The probability of getting at least one head is`, F(3, 4), [F(1, 2), F(1, 4), F(2, 3)],
    R`<p>Sample space: HH, HT, TH, TT. Only TT has no head, so $P=1-\dfrac14=\dfrac34$.</p>`, 'The outcomes HT and TH are different; do not count them as one.'),
  FM(1, 'classical probability', R`One card is drawn from a well-shuffled pack of 52 cards. The probability that it is a king or a queen is`, F(8, 52), [F(1, 13), F(4, 13), F(1, 26)],
    R`<p>There are 4 kings and 4 queens, none of them both, so $\dfrac{8}{52}=\dfrac2{13}$.</p>`, 'Kings and queens cannot overlap, so just add the counts.'),
  FM(1, 'classical probability', R`Two fair dice are thrown. The probability that the sum is 7 is`, F(dice2((a, b) => a + b === 7), 36), [F(1, 12), F(5, 36), F(7, 36)],
    R`<p>Sum 7 comes from (1,6), (2,5), (3,4), (4,3), (5,2), (6,1): 6 outcomes out of 36, so $\dfrac6{36}=\dfrac16$.</p>`, 'There are 36 equally likely outcomes, not 21.'),
  I(1, 'sample space', R`A coin is tossed three times and then a die is rolled once. How many outcomes are there in the sample space?`, 8 * 6,
    R`<p>Each coin toss has 2 outcomes and the die has 6, so the sample space has $2\cdot2\cdot2\cdot6=48$ outcomes.</p>`, 'Multiply the outcomes, do not add them.', { calc: () => 2 ** 3 * 6 }),
  FM(1, 'classical probability', R`A letter is chosen at random from the word MATHEMATICS. The probability that it is a vowel is`, F(4, 11), [F(3, 11), F(5, 11), F(2, 11)],
    R`<p>MATHEMATICS has 11 letters. The vowels are A, E, A, I, so 4 of them. $P=\dfrac4{11}$.</p>`, 'Count repeated letters each time they appear.'),
  FM(1, 'classical probability', R`Three fair coins are tossed. The probability of exactly two heads is`, F(C(3, 2), 8), [F(1, 8), F(1, 2), F(1, 4)],
    R`<p>Choose which 2 of the 3 tosses are heads: $\binom32=3$ ways, out of 8 outcomes. $P=\dfrac38$.</p>`, 'HHT, HTH and THH are three different outcomes.'),
  FM(1, 'classical probability', R`A fair die is rolled. The probability of a number greater than 4 is`, F(2, 6), [F(1, 2), F(2, 3), F(1, 6)],
    R`<p>Numbers greater than 4 are 5 and 6, so $\dfrac26=\dfrac13$.</p>`, '"Greater than 4" does not include 4.'),
  FM(2, 'calendar probability', R`The probability that a leap year chosen at random has 53 Sundays is`, F(2, 7), [F(1, 7), F(3, 7), F(2, 53)],
    R`<p>A leap year has 366 days, which is 52 weeks and 2 extra days. The pair of extra days is one of (Sun,Mon), (Mon,Tue), (Tue,Wed), (Wed,Thu), (Thu,Fri), (Fri,Sat), (Sat,Sun), all equally likely. Two of them contain a Sunday, so $P=\dfrac27$.</p>`, 'An ordinary year has only one extra day, giving $\\frac17$.'),
  FM(1, 'calendar probability', R`The probability that an ordinary (non-leap) year has 53 Sundays is`, F(1, 7), [F(2, 7), F(1, 52), F(1, 365)],
    R`<p>365 days is 52 weeks and 1 extra day. That day is a Sunday with probability $\dfrac17$.</p>`, 'Do not use the leap-year answer.'),
  FM(2, 'classical probability', R`Two fair dice are thrown. The probability that the product of the numbers is even is`, F(dice2((a, b) => (a * b) % 2 === 0), 36), [F(1, 4), F(1, 2), F(5, 6)],
    R`<p>The product is odd only if both numbers are odd: $3\times3=9$ outcomes. So $P(\text{even})=1-\dfrac9{36}=\dfrac34$.</p>`, 'Use the complement; counting even products directly is slower.'),
  FM(2, 'classical probability', R`Two fair dice are thrown. The probability that the sum is a prime number is`, F(dice2((a, b) => [2, 3, 5, 7, 11].includes(a + b)), 36), [F(1, 3), F(11, 36), F(1, 2)],
    R`<p>Prime sums: 2, 3, 5, 7, 11 with $1+2+4+6+2=15$ outcomes (sum 2: 1, sum 3: 2, sum 5: 4, sum 7: 6, sum 11: 2). $P=\dfrac{15}{36}=\dfrac5{12}$.</p>`, 'Do not forget sum 2 and sum 11.'),
  FM(1, 'classical probability', R`The probability that a card drawn from a pack of 52 is a face card (J, Q or K) is`, F(12, 52), [F(4, 13), F(1, 13), F(3, 26)],
    R`<p>3 face cards in each of 4 suits makes 12. $P=\dfrac{12}{52}=\dfrac3{13}$.</p>`, 'The ace is not a face card.'),
  FM(2, 'classical probability', R`A number is chosen at random from 1, 2, ..., 30. The probability that it is a multiple of 3 or 5 is`,
    F([...Array(30).keys()].filter((i) => (i + 1) % 3 === 0 || (i + 1) % 5 === 0).length, 30), [F(8, 15), F(2, 5), F(13, 30)],
    R`<p>Multiples of 3: 10. Multiples of 5: 6. Multiples of 15 (counted twice): 2. So $10+6-2=14$ favourable, $P=\dfrac{14}{30}=\dfrac7{15}$.</p>`, 'Subtract the multiples of 15 that were counted twice.'),
  I(2, 'classical probability', R`A number is chosen at random from 1 to 100. The probability that it is divisible by 4 or by 6 is $\dfrac{k}{100}$. Find $k$.`,
    [...Array(100).keys()].filter((i) => (i + 1) % 4 === 0 || (i + 1) % 6 === 0).length,
    R`<p>Multiples of 4: 25. Multiples of 6: 16. Multiples of lcm(4,6)=12: 8. Favourable $=25+16-8=33$, so $k=33$.</p>`, 'The overlap is the multiples of 12, not of 24.',
    { calc: () => [...Array(100).keys()].filter((i) => (i + 1) % 4 === 0 || (i + 1) % 6 === 0).length }),
  FM(1, 'classical probability', R`A fair coin is tossed 4 times. The probability of getting at least one head is`, F(15, 16), [F(1, 16), F(1, 2), F(7, 8)],
    R`<p>Only TTTT has no head. $P=1-\dfrac1{16}=\dfrac{15}{16}$.</p>`, 'The word "at least" signals the complement.'),
  FM(3, 'classical probability', R`Three fair dice are thrown. The probability that the sum of the numbers is 10 is`, F(dice3((a, b, c) => a + b + c === 10), 216), [F(25, 216), F(5, 36), F(1, 6)],
    R`<p>Count ordered triples with sum 10: the sets are {1,3,6}, {1,4,5}, {2,2,6}, {2,3,5}, {2,4,4}, {3,3,4}. Arrangements: 6, 6, 3, 6, 3, 3, total 27. $P=\dfrac{27}{216}=\dfrac18$.</p>`, 'Sets with a repeated number have only 3 arrangements, not 6.'),
  FM(3, 'arrangements', R`The digits 1, 2, 3, 4, 5 are arranged in a row at random to make a five-digit number. The probability that 2 and 3 are next to each other is`,
    F(perms('12345').filter((s) => s.includes('23') || s.includes('32')).length, 120), [F(1, 5), F(1, 10), F(3, 5)],
    R`<p>Glue 2 and 3 into one block: 4 objects can be arranged in $4!=24$ ways and the block in $2$ orders, so $48$ favourable out of $5!=120$. $P=\dfrac{48}{120}=\dfrac25$.</p>`, 'The block can appear as 23 or 32.'),
  FM(3, 'arrangements', R`The letters of the word BANANA are arranged at random. The probability that all three A's are together is`,
    F(perms('BANANA').filter((s) => s.includes('AAA')).length, perms('BANANA').length), [F(1, 6), F(1, 4), F(2, 5)],
    R`<p>Total arrangements: $\dfrac{6!}{3!\,2!}=60$. Treat AAA as one block with B, N, N: $\dfrac{4!}{2!}=12$ arrangements. $P=\dfrac{12}{60}=\dfrac15$.</p>`, 'Divide by the repeats in both the total and the favourable count.'),
  FM(3, 'selection', R`A committee of 4 is chosen at random from 5 men and 4 women. The probability that it has at least 2 women is`,
    F(C(4, 2) * C(5, 2) + C(4, 3) * 5 + 1, C(9, 4)), [F(5, 9), F(10, 21), F(5, 14)],
    R`<p>Total: $\binom94=126$. Exactly 2 women: $\binom42\binom52=60$. Exactly 3: $\binom43\binom51=20$. All 4: $1$. Favourable $=81$, so $P=\dfrac{81}{126}=\dfrac9{14}$.</p>`, 'At least 2 means 2, 3 or 4 women; do not stop at 2.'),
  FM(3, 'sampling', R`Two cards are drawn one after another, without replacement, from a pack of 52. The probability that both are aces is`, F(12, 2652), [F(1, 169), F(2, 221), F(1, 13)],
    R`<p>$\dfrac4{52}\cdot\dfrac3{51}=\dfrac{12}{2652}=\dfrac1{221}$.</p>`, 'Without replacement, the second factor is $\\frac3{51}$, not $\\frac4{52}$.'),
  FM(3, 'classical probability', R`Three people are asked for the day of the week they were born. The probability that all three days are different is`, F(7 * 6 * 5, 343), [F(19, 49), F(1, 49), F(6, 7)],
    R`<p>Total ways: $7^3=343$. All different: $7\cdot6\cdot5=210$. $P=\dfrac{210}{343}=\dfrac{30}{49}$.</p>`, 'Each person independently has 7 choices.'),
  I(3, 'mixed: quadratic equations', R`The numbers $b$ and $c$ are obtained by throwing a fair die twice (first throw gives $b$, second gives $c$). The probability that $x^2+bx+c=0$ has real roots is $\dfrac{k}{36}$. Find $k$.`,
    dice2((b, c) => b * b >= 4 * c),
    R`<p>Real roots need $b^2\ge4c$. Count for each $b$: $b=1$: none; $b=2$: $c\le1$, so 1; $b=3$: $c\le2$, so 2; $b=4$: $c\le4$, so 4; $b=5$: $c\le6$, so 6; $b=6$: $c\le9$, so 6. Total $0+1+2+4+6+6=19$.</p>`, 'Equal roots count as real: use $\\ge$, not $>$.', { calc: () => dice2((b, c) => b * b >= 4 * c) }),
  FM(4, 'arrangements', R`A four-digit number is formed at random from the digits 1, 2, 3, 4, 5 with no digit repeated. The probability that it is divisible by 4 is`,
    F((() => { let c = 0, t = 0; for (const a of '12345') for (const b of '12345') for (const d of '12345') for (const e of '12345') { if (new Set([a, b, d, e]).size < 4) continue; t++; if (+(d + e) % 4 === 0) c++; } return c; })(), 120),
    [F(1, 4), F(1, 6), F(3, 20)],
    R`<p>Divisible by 4 depends on the last two digits. From 1-5 without repeats the endings are 12, 24, 32, 52 (4 endings). The first two places then use the remaining 3 digits in $3\cdot2=6$ ways: $24$ favourable. Total $5\cdot4\cdot3\cdot2=120$. $P=\dfrac{24}{120}=\dfrac15$.</p>`, 'Check endings such as 32 and 52, which are easy to miss.'),
  FM(3, 'geometric probability', R`A point is chosen at random inside the square $0\le x\le1,\ 0\le y\le1$. The probability that $x+y<\dfrac32$ is`, F(7, 8), [F(1, 8), F(3, 4), F(1, 2)],
    R`<p>The part of the square where $x+y\ge\frac32$ is a right triangle with legs $\frac12$, area $\frac18$. So $P=1-\dfrac18=\dfrac78$.</p>`, 'The line cuts off only a small corner.'),
  N(4, 'mixed: definite integrals', R`A point is chosen at random inside the square $0\le x\le1,\ 0\le y\le1$. Find the probability that $xy<\dfrac12$.` + D4, r4(0.5 + 0.5 * Math.log(2)), 0.0005,
    R`<p>Area of $\{xy\ge\frac12\}$ inside the square is $\int_{1/2}^{1}\left(1-\dfrac1{2x}\right)dx=\dfrac12-\dfrac12\ln2$. So $P=1-\left(\dfrac12-\dfrac12\ln2\right)=\dfrac12+\dfrac12\ln2\approx0.8466$.</p>`, 'The curve $y=\\frac1{2x}$ stays inside the square only for $x\\ge\\frac12$.', { calc: () => r4(0.5 + 0.5 * Math.log(2)) }),
  FM(4, 'derangements', R`Four letters are put into four addressed envelopes at random, one in each. The probability that no letter goes into its own envelope is`, F(9, 24), [F(1, 4), F(1, 3), F(5, 8)],
    R`<p>Derangements of 4: $4!\left(1-1+\dfrac1{2!}-\dfrac1{3!}+\dfrac1{4!}\right)=12-4+1=9$. $P=\dfrac9{24}=\dfrac38$.</p>`, 'Inclusion-exclusion: $24-24+12-4+1=9$.'),
  FM(4, 'derangements', R`Four letters are put into four addressed envelopes at random, one in each. The probability that exactly one letter goes into its own envelope is`, F(8, 24), [F(3, 8), F(1, 4), F(1, 2)],
    R`<p>Choose the correct letter in 4 ways; the other three must all be wrong, which is a derangement of 3 objects: 2 ways. Favourable $=8$ of $24$, so $\dfrac13$.</p>`, 'Three remaining letters cannot be placed with all wrong in 6 ways; only 2 ways.'),
  FM(4, 'counting', R`A three-digit number is chosen at random (100 to 999). The probability that its digits are strictly increasing from left to right is`, F(C(9, 3), 900), [F(1, 9), F(7, 50), F(1, 10)],
    R`<p>Any 3 different digits from 1-9 (zero cannot appear, because it would have to come first) give exactly one increasing number: $\binom93=84$. $P=\dfrac{84}{900}=\dfrac7{75}$.</p>`, 'Zero cannot be used in an increasing 3-digit number.'),
  FM(3, 'circular arrangements', R`Eight people sit at random around a round table. The probability that two particular people sit next to each other is`, F(2, 7), [F(1, 4), F(1, 7), F(1, 8)],
    R`<p>Fix one of the two people. The other is equally likely to take any of the other 7 seats, and 2 of them are adjacent. $P=\dfrac27$.</p>`, 'In a row it would be $\\frac2n=\\frac14$; a circle has a different count.'),
  I(3, 'classical probability', R`Four cards are drawn at random from a pack of 52. The probability that all four are of different suits is $\dfrac{m}{20825}$. Find $m$.`,
    2197,
    R`<p>One card from each suit: $13^4=28561$ ways. Total: $\binom{52}{4}=270725$. $\dfrac{28561}{270725}$: divide top and bottom by 13 to get $\dfrac{2197}{20825}$. So $m=2197$.</p>`, 'Pick one card per suit: $13^4$ ways, not $4\\cdot13$.', { calc: () => (13 ** 4 / C(52, 4)) * 20825 }),
];

const itemsB = [
  // ================= addition rule, conditional probability, independence =================
  M(1, 'addition rule', R`If $A$ and $B$ are mutually exclusive with $P(A)=0.3$ and $P(B)=0.5$, then $P(A\cup B)$ is`, '0.8', ['0.15', '0.2', '0.65'],
    R`<p>For mutually exclusive events $P(A\cap B)=0$, so $P(A\cup B)=0.3+0.5-0=0.8$.</p>`, 'Do not multiply: that is for independent events.'),
  M(1, 'independent events', R`If $A$ and $B$ are independent with $P(A)=0.4$ and $P(B)=0.5$, then $P(A\cap B)$ is`, '0.2', ['0.9', '0.1', '0.45'],
    R`<p>Independent: $P(A\cap B)=P(A)P(B)=0.4\times0.5=0.2$.</p>`, 'Adding gives the union of exclusive events, not the intersection of independent ones.'),
  M(1, 'complementary events', R`If $P(A)=0.35$, then $P(A')$ is`, '0.65', ['0.35', '0.55', '1.35'],
    R`<p>$P(A')=1-P(A)=1-0.35=0.65$.</p>`, 'Subtract from 1.'),
  M(1, 'conditional probability', R`If $P(A\cap B)=0.2$ and $P(B)=0.5$, then $P(A\mid B)$ is`, '0.4', ['0.1', '0.25', '0.7'],
    R`<p>$P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}=\dfrac{0.2}{0.5}=0.4$.</p>`, 'The denominator is the event you are given, here $B$.'),
  M(2, 'addition rule', R`If $P(A)=0.6$, $P(B)=0.5$ and $P(A\cup B)=0.8$, then $P(A\cap B)$ is`, '0.3', ['0.4', '0.2', '1.1'],
    R`<p>$P(A\cap B)=P(A)+P(B)-P(A\cup B)=0.6+0.5-0.8=0.3$.</p>`, '1.1 is $P(A)+P(B)$ before subtracting.'),
  N(2, 'conditional probability', R`For events $A,B$: $P(A)=0.5$, $P(B)=0.4$ and $P(A\cup B)=0.7$. Find $P(A\mid B)$.`, 0.5, 0.001,
    R`<p>$P(A\cap B)=0.5+0.4-0.7=0.2$. Then $P(A\mid B)=\dfrac{0.2}{0.4}=0.5$.</p>`, 'Divide by $P(B)$, not $P(A)$.', { calc: () => (0.5 + 0.4 - 0.7) / 0.4 }),
  M(2, 'addition rule', R`For events $A,B$: $P(A)=0.45$, $P(B)=0.35$, $P(A\cap B)=0.15$. Then $P(A'\cap B')$ is`, '0.35', ['0.65', '0.20', '0.55'],
    R`<p>$P(A\cup B)=0.45+0.35-0.15=0.65$. By De Morgan, $P(A'\cap B')=1-0.65=0.35$.</p>`, '0.65 is the union; "neither" needs the complement.'),
  N(2, 'addition rule', R`For events $A,B$: $P(A)=0.6$, $P(B)=0.7$, $P(A\cap B)=0.5$. Find the probability that exactly one of $A,B$ occurs.`, 0.3, 0.001,
    R`<p>Exactly one $=P(A)+P(B)-2P(A\cap B)=0.6+0.7-1.0=0.3$.</p>`, 'The intersection must be removed twice, once from each event.', { calc: () => 0.6 + 0.7 - 1.0 }),
  FM(2, 'conditional probability', R`Two fair dice are thrown. Given that both show the same number, the probability that the sum is 8 is`, F(dice2((a, b) => a === b && a + b === 8), dice2((a, b) => a === b)), [F(5, 36), F(1, 36), F(1, 3)],
    R`<p>Doubles: 6 outcomes. Among them only (4,4) has sum 8. $P=\dfrac16$.</p>`, 'The sample space shrinks to the 6 doubles, not 36.'),
  FM(2, 'conditional probability', R`Two fair dice are thrown. Given that the first die shows 5, the probability that the sum is at least 10 is`, F(dice2((a, b) => a === 5 && a + b >= 10), 6), [F(1, 6), F(1, 12), F(1, 2)],
    R`<p>With the first die 5, the second must be 5 or 6: 2 outcomes out of 6. $P=\dfrac13$.</p>`, 'Only 6 outcomes remain, not 36.'),
  FM(3, 'conditional probability', R`A family has two children. Given that at least one is a boy, the probability that both are boys is`, F(1, 3), [F(1, 2), F(1, 4), F(2, 3)],
    R`<p>Equally likely: BB, BG, GB, GG. "At least one boy" leaves BB, BG, GB. Of these, 1 is BB. $P=\dfrac13$.</p>`, 'This differs from "the elder is a boy", where the answer is $\\frac12$.'),
  FM(3, 'conditional probability', R`A bag holds 5 red and 3 blue balls. Two balls are drawn one after another without replacement. The probability that the second is red given that the first was red is`, F(4, 7), [F(5, 8), F(5, 14), F(1, 2)],
    R`<p>After one red is removed, 4 red remain among 7 balls. $P=\dfrac47$.</p>`, '$\\frac5{14}$ is the probability that both are red.'),
  FM(3, 'multiplication rule', R`A bag holds 5 red and 3 blue balls. Two balls are drawn one after another without replacement. The probability that both are red is`, F(5 * 4, 8 * 7), [F(25, 64), F(4, 7), F(5, 8)],
    R`<p>$P=\dfrac58\cdot\dfrac47=\dfrac{20}{56}=\dfrac5{14}$.</p>`, 'With replacement it would be $\\frac{25}{64}$.'),
  FM(3, 'multiplication rule', R`Two cards are drawn without replacement from a pack of 52. The probability that both are hearts is`, F(13 * 12, 52 * 51), [F(1, 16), F(1, 4), F(3, 52)],
    R`<p>$\dfrac{13}{52}\cdot\dfrac{12}{51}=\dfrac14\cdot\dfrac4{17}=\dfrac1{17}$.</p>`, 'After one heart is gone, 12 hearts remain in 51 cards.'),
  FM(3, 'multiplication rule', R`A box has 4 white and 6 black balls. Three balls are drawn one by one without replacement. The probability that all three are black is`, F(6 * 5 * 4, 10 * 9 * 8), [F(27, 125), F(1, 5), F(1, 3)],
    R`<p>$\dfrac6{10}\cdot\dfrac59\cdot\dfrac48=\dfrac{120}{720}=\dfrac16$.</p>`, '$\\frac{27}{125}$ is the answer with replacement.'),
  FM(3, 'multiplication rule', R`A bag has 3 red and 2 blue balls. A ball is drawn, replaced, and a second ball is drawn. The probability that the first is red and the second is blue is`, F(3 * 2, 25), [F(3, 10), F(3, 5), F(1, 5)],
    R`<p>The draws are independent: $\dfrac35\cdot\dfrac25=\dfrac6{25}$.</p>`, 'With replacement the second probability stays $\\frac25$, not $\\frac24$.'),
  M(3, 'independent events', R`Two fair dice are thrown. Let $A$: the first die shows 4; $B$: the sum is 7; $C$: the sum is 8. Which pair of events is independent?`, '$A$ and $B$', ['$A$ and $C$', '$B$ and $C$', 'No two of them'],
    R`<p>$P(A)=\dfrac16$, $P(B)=\dfrac16$, $P(C)=\dfrac5{36}$. $P(A\cap B)=P(4,3)=\dfrac1{36}=P(A)P(B)$, so $A,B$ are independent. $P(A\cap C)=\dfrac1{36}\ne\dfrac16\cdot\dfrac5{36}$. $B,C$ cannot happen together, and $P(B)P(C)\ne0$, so they are not independent.</p>`, 'Mutually exclusive events with non-zero probabilities are never independent.'),
  FM(3, 'independent events', R`$A$ and $B$ are independent with $P(A)=\dfrac13$ and $P(B)=\dfrac14$. Then $P(A'\cap B)$ is`, F(2 * 1, 12), [F(1, 12), F(1, 2), F(3, 4)],
    R`<p>$A'$ and $B$ are also independent, so $P(A'\cap B)=\dfrac23\cdot\dfrac14=\dfrac16$.</p>`, "If $A,B$ are independent then so are $A',B$."),
  FM(3, 'independent events', R`Three marksmen hit a target independently with probabilities $\dfrac12$, $\dfrac13$ and $\dfrac14$. If each fires once, the probability that exactly one hits is`, F(6 + 3 + 2, 24), [F(1, 4), F(3, 4), F(13, 24)],
    R`<p>Only first: $\dfrac12\cdot\dfrac23\cdot\dfrac34=\dfrac6{24}$. Only second: $\dfrac12\cdot\dfrac13\cdot\dfrac34=\dfrac3{24}$. Only third: $\dfrac12\cdot\dfrac23\cdot\dfrac14=\dfrac2{24}$. Total $\dfrac{11}{24}$.</p>`, '$\\frac34$ is the probability that at least one hits.'),
  FM(2, 'independent events', R`Three marksmen hit a target independently with probabilities $\dfrac12$, $\dfrac13$ and $\dfrac14$. The probability that the target is hit by at least one is`, F(3, 4), [F(1, 4), F(11, 24), F(1, 24)],
    R`<p>The target is missed only when all miss: $\dfrac12\cdot\dfrac23\cdot\dfrac34=\dfrac14$. So $P=1-\dfrac14=\dfrac34$.</p>`, 'Use the complement of "all miss".'),
  FM(2, 'total probability', R`Bag I has 3 red and 2 blue balls; Bag II has 2 red and 4 blue balls. A bag is chosen at random and a ball is drawn from it. The probability that the ball is red is`, F(3 * 6 + 2 * 5, 60) /* 1/2*3/5 + 1/2*2/6 */, [F(1, 2), F(5, 11), F(3, 10)],
    R`<p>$P(\text{red})=\dfrac12\cdot\dfrac35+\dfrac12\cdot\dfrac26=\dfrac3{10}+\dfrac16=\dfrac{9+5}{30}=\dfrac7{15}$.</p>`, 'Weight each bag by its chance of being chosen.'),
  FM(3, 'Bayes theorem', R`Bag I has 3 red and 2 blue balls; Bag II has 2 red and 4 blue balls. A bag is chosen at random and a ball is drawn; it is red. The probability that it came from Bag I is`, F(9, 14), [F(3, 5), F(1, 2), F(7, 15)],
    R`<p>$P(\text{I}\mid\text{red})=\dfrac{\frac12\cdot\frac35}{\frac7{15}}=\dfrac{3/10}{7/15}=\dfrac{9}{14}$.</p>`, 'The prior 1/2 is not the answer; the red ball is evidence.'),
  M(3, 'total probability', R`Machine A makes 60% of the items and Machine B makes 40%. Of the items from A, 2% are defective; of those from B, 5% are defective. An item is picked at random. The probability that it is defective is`, '0.032', ['0.035', '0.07', '0.020'],
    R`<p>$P(D)=0.6\times0.02+0.4\times0.05=0.012+0.020=0.032$.</p>`, 'Do not average 2% and 5% without the weights.'),
  M(3, 'Bayes theorem', R`Machine A makes 60% of the items and Machine B makes 40%. Of the items from A, 2% are defective; of those from B, 5% are defective. A defective item is found. The probability that it came from B is`, '0.625', ['0.4', '0.5', '0.375'],
    R`<p>$P(B\mid D)=\dfrac{0.4\times0.05}{0.032}=\dfrac{0.020}{0.032}=0.625$.</p>`, '0.375 is the chance that it came from A.'),
  N(4, 'Bayes theorem', R`In a city, 1% of people have a certain disease. A test is positive for 95% of those who have it and, wrongly, for 5% of those who do not. A person tests positive. Find the probability that the person really has the disease.` + D3, r3(0.0095 / (0.0095 + 0.0495)), 0.001,
    R`<p>Disease and positive: $0.01\times0.95=0.0095$. No disease and positive: $0.99\times0.05=0.0495$. $P=\dfrac{0.0095}{0.0095+0.0495}=\dfrac{0.0095}{0.059}\approx0.161$.</p>`, 'Most positives come from the large healthy group.', { calc: () => r3(0.0095 / (0.0095 + 0.0495)) }),
  FM(4, 'Bayes theorem', R`A die is thrown. If it shows 1 or 2, Urn 1 (2 white, 3 black) is chosen; if 3, 4 or 5, Urn 2 (3 white, 2 black); if 6, Urn 3 (4 white, 1 black). A ball is drawn from the chosen urn and is white. The probability that it came from Urn 2 is`, F(9, 17), [F(1, 2), F(3, 5), F(17, 30)],
    R`<p>$P(W)=\dfrac26\cdot\dfrac25+\dfrac36\cdot\dfrac35+\dfrac16\cdot\dfrac45=\dfrac4{30}+\dfrac9{30}+\dfrac4{30}=\dfrac{17}{30}$. $P(\text{Urn 2}\mid W)=\dfrac{9/30}{17/30}=\dfrac9{17}$.</p>`, '$\\frac{17}{30}$ is the total probability of white.'),
  FM(4, 'total probability', R`Bag A has 3 red and 2 white balls; Bag B has 2 red and 4 white. One ball is moved at random from A into B, and then a ball is drawn at random from B. The probability that this ball is red is`, F(9 + 4, 35), [F(2, 7), F(1, 2), F(3, 7)],
    R`<p>If a red ball moves (prob $\frac35$), B has 3 red in 7: contribution $\dfrac35\cdot\dfrac37=\dfrac9{35}$. If a white moves (prob $\frac25$), B has 2 red in 7: $\dfrac25\cdot\dfrac27=\dfrac4{35}$. Total $\dfrac{13}{35}$.</p>`, 'Bag B has 7 balls after the transfer, not 6.'),
  FM(4, 'Bayes theorem', R`Bag A has 3 red and 2 white balls; Bag B has 2 red and 4 white. One ball is moved at random from A into B, and then a ball is drawn at random from B and found red. The probability that the moved ball was red is`, F(9, 13), [F(3, 5), F(3, 7), F(9, 35)],
    R`<p>From the previous calculation: $P(\text{moved red and drew red})=\dfrac9{35}$ and $P(\text{drew red})=\dfrac{13}{35}$. So $\dfrac{9/35}{13/35}=\dfrac9{13}$.</p>`, 'Do not stop at the prior $\\frac35$.'),
  FM(4, 'Bayes theorem', R`A bag has 1 two-headed coin and 7 fair coins. A coin is picked at random and tossed 3 times, giving 3 heads. The probability that it is the two-headed coin is`, F(8, 15), [F(1, 8), F(1, 2), F(7, 15)],
    R`<p>Two-headed: $\dfrac18\cdot1=\dfrac8{64}$. Fair: $\dfrac78\cdot\dfrac18=\dfrac7{64}$. $P=\dfrac{8}{8+7}=\dfrac8{15}$.</p>`, 'A fair coin gives 3 heads with probability $\\frac18$, not $\\frac12$.'),
  FM(4, 'conditional probability', R`A family has three children. Given that at least one is a girl, the probability that exactly two are girls is`, F(3, 7), [F(3, 8), F(1, 2), F(3, 4)],
    R`<p>8 equally likely outcomes; "at least one girl" leaves 7. Exactly two girls: GGB, GBG, BGG = 3. $P=\dfrac37$.</p>`, 'Dividing by 8 instead of 7 is the usual slip.'),
  I(3, 'addition rule', R`For events with $P(A)=0.7$ and $P(B)=0.6$, the least possible value of $P(A\cap B)$ is $\dfrac{k}{10}$. Find $k$.`, 3,
    R`<p>$P(A\cap B)=P(A)+P(B)-P(A\cup B)\ge0.7+0.6-1=0.3$, since $P(A\cup B)\le1$. So $k=3$.</p>`, 'The maximum possible value would be 0.6, the smaller probability.', { calc: () => Math.round((0.7 + 0.6 - 1) * 10) }),
  N(3, 'independent events', R`$A$ and $B$ are independent, $P(A)=0.2$ and $P(A\cup B)=0.6$. Find $P(B)$.`, 0.5, 0.001,
    R`<p>$0.6=0.2+b-0.2b=0.2+0.8b$, so $b=\dfrac{0.4}{0.8}=0.5$.</p>`, 'Use $P(A\\cap B)=P(A)P(B)$; do not use $P(A\\cup B)=P(A)+P(B)$.', { calc: () => (0.6 - 0.2) / 0.8 }),
  FM(4, 'counting', R`Three numbers are chosen at random without replacement from $\{1,2,\dots,10\}$. The probability that the minimum is 3 or the maximum is 7 is`,
    (() => { let c = 0; for (let a = 1; a <= 10; a++) for (let b = a + 1; b <= 10; b++) for (let d = b + 1; d <= 10; d++) if (a === 3 || d === 7) c++; return F(c, 120); })(), [F(21, 120), F(3, 10), F(9, 40)],
    R`<p>Total $\binom{10}3=120$. Minimum 3: choose the other two from $\{4,\dots,10\}$: $\binom72=21$. Maximum 7: choose the other two from $\{1,\dots,6\}$: $\binom62=15$. Both: min 3, max 7, middle from $\{4,5,6\}$: 3. By inclusion-exclusion $21+15-3=33$, $P=\dfrac{33}{120}=\dfrac{11}{40}$.</p>`, 'The case "both" is counted in each part, so subtract it once.'),
  FM(4, 'counting', R`Three fair dice are thrown. The probability that the product of the three numbers is a multiple of 4 is`, F(dice3((a, b, c) => (a * b * c) % 4 === 0), 216), [F(1, 2), F(3, 8), F(2, 3)],
    R`<p>Complement: the product is not a multiple of 4. Either all three are odd ($3^3=27$ outcomes), or exactly one is even and that even number is 2 or 6 while the other two are odd ($3\cdot2\cdot3\cdot3=54$). So $81$ outcomes fail and $216-81=135$ succeed. $P=\dfrac{135}{216}=\dfrac58$.</p>`, 'The number 4 itself already gives a factor 4, and two even numbers give one too.'),
];

const itemsC = [
  // ================= random variables, mean, variance =================
  I(1, 'probability distribution', R`A random variable $X$ takes the values 1, 2, 3, 4 with $P(X=x)=kx$. If $k=\dfrac1m$, find $m$.`, 10,
    R`<p>The probabilities must add up to 1: $k(1+2+3+4)=10k=1$, so $k=\dfrac1{10}$ and $m=10$.</p>`, 'Total probability is 1, not the sum of the values.', { calc: () => 1 + 2 + 3 + 4 }),
  N(1, 'mean', R`A random variable $X$ takes the values 0, 1, 2 with probabilities 0.2, 0.5, 0.3. Find $E(X)$.`, 1.1, 0.001,
    R`<p>$E(X)=0(0.2)+1(0.5)+2(0.3)=0.5+0.6=1.1$.</p>`, 'Multiply each value by its own probability.', { calc: () => 0 * 0.2 + 1 * 0.5 + 2 * 0.3 }),
  FM(1, 'probability distribution', R`A random variable $X$ takes the values 0, 1, 2 with $P(X=x)=k(x+1)$. The value of $k$ is`, F(1, 6), [F(1, 3), F(1, 2), F(1, 4)],
    R`<p>$k(1+2+3)=6k=1$, so $k=\dfrac16$.</p>`, 'The values of $x+1$ are 1, 2, 3, not 0, 1, 2.'),
  FM(1, 'binomial distribution', R`A fair coin is tossed 4 times. The probability of exactly 2 heads is`, F(C(4, 2), 16), [F(1, 2), F(1, 4), F(5, 16)],
    R`<p>$\binom42\left(\dfrac12\right)^4=\dfrac6{16}=\dfrac38$.</p>`, 'Do not forget the $\\binom42$ ways to place the heads.'),
  M(1, 'binomial mean', R`For a binomial distribution with $n=10$ and $p=0.3$, the mean is`, '3', ['0.3', '2.1', '7'],
    R`<p>Mean $=np=10\times0.3=3$. (The variance is $npq=2.1$.)</p>`, '2.1 is the variance, not the mean.'),
  N(2, 'variance', R`A fair die is thrown and $X$ is the number shown. Find $\mathrm{Var}(X)$.` + D3, r3(35 / 12), 0.001,
    R`<p>$E(X)=\dfrac{21}6=3.5$, $E(X^2)=\dfrac{91}6$. $\mathrm{Var}=\dfrac{91}6-\dfrac{49}4=\dfrac{182-147}{12}=\dfrac{35}{12}\approx2.917$.</p>`, 'Variance is $E(X^2)-[E(X)]^2$, not $E(X^2)$.', { calc: () => { let s = 0, s2 = 0; for (let x = 1; x <= 6; x++) { s += x / 6; s2 += (x * x) / 6; } return r3(s2 - s * s); } }),
  M(2, 'mean', R`A fair coin is tossed 3 times and $X$ is the number of heads. Then $E(X)$ is`, '1.5', ['1', '2', '0.5'],
    R`<p>$X\sim B(3,\tfrac12)$, so $E(X)=np=3\times\dfrac12=1.5$.</p>`, 'The mean need not be a possible value.'),
  N(2, 'binomial distribution', R`A binomial variable has $n=5$ and $p=0.4$. Find $P(X=2)$.` + D4, r4(binom(5, 2, 0.4)), 0.0005,
    R`<p>$P(X=2)=\binom52(0.4)^2(0.6)^3=10\times0.16\times0.216=0.3456$.</p>`, 'The failures contribute $(0.6)^3$, not $(0.6)^2$.', { calc: () => r4(binom(5, 2, 0.4)) }),
  I(2, 'binomial mean and variance', R`For a binomial distribution the mean is 6 and the variance is 4.5. Find $n$.`, 24,
    R`<p>$np=6$ and $npq=4.5$, so $q=\dfrac{4.5}6=0.75$ and $p=0.25$. Then $n=\dfrac6{0.25}=24$.</p>`, 'Divide variance by mean to get $q$.', { calc: () => 6 / (1 - 4.5 / 6) }),
  FM(2, 'binomial distribution', R`A fair coin is tossed 5 times. The probability of at least 4 heads is`, F(C(5, 4) + C(5, 5), 32), [F(5, 32), F(1, 32), F(1, 2)],
    R`<p>$P(4)=\dfrac5{32}$, $P(5)=\dfrac1{32}$. Together $\dfrac6{32}=\dfrac3{16}$.</p>`, '"At least 4" includes 5 as well.'),
  FM(2, 'binomial variance', R`If $X\sim B\left(12,\dfrac13\right)$, then $\mathrm{Var}(X)$ is`, F(12 * 1 * 2, 9), [F(4, 1), F(1, 3), F(16, 3)],
    R`<p>$npq=12\cdot\dfrac13\cdot\dfrac23=\dfrac{24}9=\dfrac83$.</p>`, '$np=4$ is the mean.'),
  N(2, 'binomial distribution', R`A shooter hits the target with probability 0.6 each time, independently. In 3 shots, find the probability of at least one hit.` + D3, r3(1 - 0.4 ** 3), 0.001,
    R`<p>No hits: $0.4^3=0.064$. At least one: $1-0.064=0.936$.</p>`, 'Use the complement.', { calc: () => r3(1 - 0.4 ** 3) }),
  M(2, 'expectation', R`Two fair dice are thrown. The expected value of the sum is`, '7', ['6', '7.5', '3.5'],
    R`<p>$E(\text{sum})=E(X_1)+E(X_2)=3.5+3.5=7$.</p>`, '3.5 is the mean of one die only.'),
  I(3, 'binomial distribution', R`A fair coin is tossed $n$ times. The least $n$ for which the probability of at least one head exceeds 0.99 is`, 7,
    R`<p>We need $1-2^{-n}>0.99$, i.e. $2^{-n}<0.01$, i.e. $2^n>100$. $2^6=64$ is too small, $2^7=128$ works. So $n=7$.</p>`, '$2^6=64$ is below 100.', { calc: () => { let n = 1; while (1 - 2 ** -n <= 0.99) n++; return n; } }),
  M(3, 'binomial distribution', R`For $X\sim B(15,0.4)$, the most likely value of $X$ is`, '6', ['5', '7', '9'],
    R`<p>The mode is $\lfloor(n+1)p\rfloor=\lfloor16\times0.4\rfloor=\lfloor6.4\rfloor=6$. Check: $P(6)>P(5)$ and $P(6)>P(7)$.</p>`, 'The mean is 6 too, but the rule uses $(n+1)p$.'),
  N(3, 'binomial distribution', R`$X\sim B\left(6,\dfrac12\right)$. Find $P(2\le X\le3)$.` + D3, r3((15 + 20) / 64), 0.001,
    R`<p>$P(2)=\dfrac{15}{64}$ and $P(3)=\dfrac{20}{64}$. Sum $=\dfrac{35}{64}\approx0.547$.</p>`, 'Both ends are included.', { calc: () => r3(binom(6, 2, 0.5) + binom(6, 3, 0.5)) }),
  N(3, 'variance', R`$X$ takes the values 1, 2, 3 with probabilities 0.3, 0.4, 0.3. Find $\mathrm{Var}(X)$.`, 0.6, 0.001,
    R`<p>$E(X)=0.3+0.8+0.9=2$. $E(X^2)=0.3+1.6+2.7=4.6$. $\mathrm{Var}=4.6-4=0.6$.</p>`, 'Square the values, not the probabilities.', { calc: () => { const x = [1, 2, 3], p = [0.3, 0.4, 0.3]; const m = x.reduce((s, v, i) => s + v * p[i], 0); return +x.reduce((s, v, i) => s + p[i] * (v - m) ** 2, 0).toFixed(3); } }),
  FM(3, 'geometric trials', R`A fair die is thrown repeatedly. The probability that the first six appears on the third throw is`, F(25, 216), [F(1, 6), F(1, 216), F(125, 216)],
    R`<p>Two non-sixes, then a six: $\left(\dfrac56\right)^2\cdot\dfrac16=\dfrac{25}{216}$.</p>`, '$\\frac{125}{216}$ is "no six in three throws".'),
  N(3, 'geometric trials', R`A fair die is thrown repeatedly. Find the probability that the first six appears within the first 4 throws.` + D3, r3(1 - (5 / 6) ** 4), 0.001,
    R`<p>No six in 4 throws: $\left(\dfrac56\right)^4=0.4823$. So $1-0.4823=0.518$.</p>`, '"Within 4" means at most 4.', { calc: () => r3(1 - (5 / 6) ** 4) }),
  N(3, 'expectation', R`A game pays Rs 12 if a die shows 6, Rs 3 if it shows 1, and nothing otherwise. Find the fair entry fee in rupees.`, 2.5, 0.01,
    R`<p>Expected payout $=12\cdot\dfrac16+3\cdot\dfrac16=2+0.5=2.5$. A fair fee equals the expected payout.</p>`, 'Fair means expected gain 0.', { calc: () => 12 / 6 + 3 / 6 }),
  FM(3, 'binomial distribution', R`In a binomial distribution with $n=5$, $P(X=1)=8\,P(X=3)$. The value of $p$ is`, F(1, 5), [F(4, 5), F(1, 4), F(1, 2)],
    R`<p>$5pq^4=8\cdot10\,p^3q^2$ gives $q^2=16p^2$, so $q=4p$. With $p+q=1$: $5p=1$ and $p=\dfrac15$.</p>`, 'Take the positive root, $q=4p$.'),
  FM(3, 'binomial distribution', R`For $X\sim B(6,p)$, $P(X=1)=P(X=2)$. Then $p$ equals`, F(2, 7), [F(1, 3), F(1, 2), F(5, 7)],
    R`<p>$6pq^5=15p^2q^4$, so $6q=15p$, $q=\dfrac52p$. Then $p+\dfrac52p=1$ gives $p=\dfrac27$.</p>`, 'Cancel $pq^4$ carefully.'),
  FM(4, 'binomial distribution', R`A fair coin is tossed 10 times. The probability that the number of heads is a multiple of 3 (including 0) is`, F(1 + C(10, 3) + C(10, 6) + C(10, 9), 1024), [F(1, 3), F(171, 512), F(341, 1000)],
    R`<p>Heads $\in\{0,3,6,9\}$: $1+120+210+10=341$ outcomes out of $1024$. $P=\dfrac{341}{1024}$.</p>`, 'Zero counts as a multiple of 3.'),
  N(4, 'games', R`A and B throw a fair die alternately, A first. The first to throw a six wins. Find the probability that A wins.` + D3, r3(6 / 11), 0.001,
    R`<p>$P(A)=\dfrac16+\left(\dfrac56\right)^2\dfrac16+\left(\dfrac56\right)^4\dfrac16+\dots=\dfrac{1/6}{1-25/36}=\dfrac{1/6}{11/36}=\dfrac6{11}\approx0.545$.</p>`, 'A needs an even number of earlier failures, so the common ratio is $(5/6)^2$.', { calc: () => r3(6 / 11) }),
  FM(4, 'geometric trials', R`A coin with $P(\text{head})=\dfrac13$ is tossed until a head appears. The probability that the first head appears on an even-numbered toss is`, F(2, 5), [F(1, 3), F(3, 5), F(1, 2)],
    R`<p>Sum over $k=2,4,\dots$ of $\left(\dfrac23\right)^{k-1}\dfrac13=\dfrac23\cdot\dfrac13\cdot\dfrac1{1-4/9}=\dfrac29\cdot\dfrac95=\dfrac25$. (In general $\dfrac q{1+q}=\dfrac{2/3}{5/3}$.)</p>`, 'Odd tosses give $\\frac35$.'),
  N(4, 'binomial distribution', R`$X\sim B(5,0.3)$. Find $P(X\text{ is odd})$.` + D4, r4((1 - 0.4 ** 5) / 2), 0.0005,
    R`<p>$P(\text{odd})=\dfrac{(q+p)^5-(q-p)^5}2=\dfrac{1-0.4^5}2=\dfrac{1-0.01024}2=0.4949$.</p>`, '$q-p=0.4$, not 0.7.', { calc: () => r4([1, 3, 5].reduce((s, k) => s + binom(5, k, 0.3), 0)) }),
  I(4, 'binomial distribution', R`A trial succeeds with probability $\dfrac14$. The smallest number of independent trials needed so that at least one success has probability greater than 0.9 is`, 9,
    R`<p>We need $1-\left(\dfrac34\right)^n>0.9$, i.e. $\left(\dfrac34\right)^n<0.1$. $\left(\dfrac34\right)^8=0.1001$ (too big), $\left(\dfrac34\right)^9=0.0751$. So $n=9$.</p>`, 'At $n=8$ the value 0.1001 just fails.', { calc: () => { let n = 1; while (1 - 0.75 ** n <= 0.9) n++; return n; } }),
  FM(3, 'geometric trials', R`A fair coin is tossed until a head appears. The probability that more than 5 tosses are needed is`, F(1, 32), [F(1, 64), F(31, 32), F(5, 32)],
    R`<p>More than 5 tosses means the first 5 are all tails: $\left(\dfrac12\right)^5=\dfrac1{32}$.</p>`, 'Five tails, not six.'),
  I(2, 'expectation', R`A fair die is thrown repeatedly until a six appears. The expected number of throws is`, 6,
    R`<p>For a geometric variable with success probability $p$, the mean is $\dfrac1p=6$.</p>`, 'The mean of a geometric variable is $1/p$, not $p$.', { calc: () => 6 }),
  I(4, 'binomial mean and variance', R`For a binomial distribution the mean is 4 and the variance is $\dfrac83$. Find $n$.`, 12,
    R`<p>$q=\dfrac{8/3}{4}=\dfrac23$, $p=\dfrac13$, $n=\dfrac4{1/3}=12$.</p>`, 'Divide variance by mean to get $q$.', { calc: () => 4 / (1 - 8 / 3 / 4) }),
  FM(4, 'binomial distribution', R`Two players each toss a fair coin 3 times. The probability that they get the same number of heads is`, F(C(6, 3), 64), [F(1, 4), F(3, 8), F(5, 8)],
    R`<p>$\sum_k\binom3k^2=1+9+9+1=20=\binom63$, over $2^6=64$ outcomes. $P=\dfrac{20}{64}=\dfrac5{16}$.</p>`, 'Square each binomial coefficient.'),
  FM(4, 'binomial distribution', R`A tosses a fair coin 4 times and B tosses a fair coin 3 times. The probability that A gets more heads than B is`, F(1, 2), [F(11, 16), F(5, 16), F(3, 8)],
    R`<p>Compare A's 4 tosses with B's 3 tosses plus one extra toss $e$ of A's. A's total beats B's if the 3-toss counts satisfy: A3 > B, or A3 = B and $e$ is a head. Symmetry: $P(A3>B)=P(A3<B)=\dfrac{1-5/16}{2}=\dfrac{11}{32}$ and $P(A3=B)=\dfrac5{16}$. So $P=\dfrac{11}{32}+\dfrac5{32}=\dfrac12$.</p>`, 'The extra coin breaks the symmetry exactly in half.'),
  FM(5, 'problem of points', R`Two players of equal skill play a game of several rounds. A needs 2 more round wins to take the prize, B needs 3. The probability that A wins the prize is`, F(11, 16), [F(3, 5), F(2, 3), F(9, 16)],
    R`<p>At most 4 more rounds are needed. Imagine playing all 4: A wins the prize if A wins at least 2 of 4: $\dfrac{\binom42+\binom43+\binom44}{16}=\dfrac{6+4+1}{16}=\dfrac{11}{16}$.</p>`, 'Do not split the prize by 2:3; the true odds are 11:5.'),
  M(4, 'expectation', R`A random permutation of $1,2,\dots,6$ is chosen and $X$ is the number of positions $i$ with the number $i$ in place $i$. Then $E(X)$ equals`, '1', ['$\\dfrac16$', '$\\dfrac12$', '6'],
    R`<p>Write $X=X_1+\dots+X_6$ where $X_i=1$ if position $i$ is fixed. $P(X_i=1)=\dfrac16$, so $E(X)=6\cdot\dfrac16=1$, whatever the size of the permutation.</p>`, 'The $X_i$ are not independent, but the sum of means still holds.'),
  I(5, 'expectation', R`A fair coin is tossed until two heads appear in a row. The expected number of tosses is`, 6,
    R`<p>Let $E$ be the expected tosses from the start. If the first toss is T (prob $\frac12$), we have used 1 toss and restart: $1+E$. If it is HT (prob $\frac14$), 2 used, restart: $2+E$. If HH (prob $\frac14$), done in 2. So $E=\dfrac12(1+E)+\dfrac14(2+E)+\dfrac14\cdot2=\dfrac34E+\dfrac32$, giving $E=6$.</p>`, 'Restart after T and after HT, not after H alone.', { calc: () => 6 }),
  FM(5, 'binomial distribution', R`A fair coin is tossed 6 times. The probability that heads outnumber tails is`, F(11, 32), [F(1, 2), F(5, 16), F(21, 32)],
    R`<p>$P(\text{equal})=\dfrac{\binom63}{64}=\dfrac5{16}$. The remaining probability $\dfrac{11}{16}$ is shared equally by "more heads" and "more tails", so $\dfrac{11}{32}$.</p>`, 'With an even number of tosses a tie is possible, so the answer is not $\\frac12$.'),
  I(4, 'binomial variance', R`$X\sim B(100,0.1)$. Its standard deviation is`, 3,
    R`<p>$\mathrm{Var}=npq=100\times0.1\times0.9=9$, so the standard deviation is $3$.</p>`, 'Take the square root of the variance.', { calc: () => Math.sqrt(100 * 0.1 * 0.9) }),
  N(4, 'expectation', R`Two fair dice are thrown. Find the expected value of the larger of the two numbers.` + D3, r3(161 / 36), 0.001,
    R`<p>$P(\max=k)=\dfrac{2k-1}{36}$. $E=\sum_{k=1}^{6}\dfrac{k(2k-1)}{36}=\dfrac{1+6+15+28+45+66}{36}=\dfrac{161}{36}\approx4.472$.</p>`, 'The larger of two numbers is above 3.5 on average.', { calc: () => { let s = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) s += Math.max(a, b); return r3(s / 36); } }),
  N(4, 'expectation', R`Two fair dice are thrown. Find the expected value of the smaller of the two numbers.` + D3, r3(91 / 36), 0.001,
    R`<p>$P(\min=k)=\dfrac{13-2k}{36}$. $E=\dfrac{11+2\cdot9+3\cdot7+4\cdot5+5\cdot3+6\cdot1}{36}=\dfrac{91}{36}\approx2.528$. (Check: max + min = sum, so $\dfrac{161+91}{36}=7$.)</p>`, 'Use $E(\\max)+E(\\min)=7$ as a check.', { calc: () => { let s = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) s += Math.min(a, b); return r3(s / 36); } }),
  M(3, 'variance', R`A Bernoulli trial succeeds with probability 0.3. Its variance is`, '0.21', ['0.3', '0.7', '0.09'],
    R`<p>For a single trial, $\mathrm{Var}=pq=0.3\times0.7=0.21$.</p>`, '0.09 is $p^2$.'),
  N(2, 'variance', R`$X$ takes the values $-1$, $0$, $1$ with probabilities $p$, $1-2p$, $p$. If $\mathrm{Var}(X)=0.3$, find $p$.`, 0.15, 0.001,
    R`<p>$E(X)=0$ by symmetry, $E(X^2)=p+p=2p$. So $\mathrm{Var}=2p=0.3$ and $p=0.15$.</p>`, 'The mean is 0, so variance equals $E(X^2)$.', { calc: () => 0.3 / 2 }),
  N(2, 'classical probability', R`A four-digit PIN is chosen at random from 0000 to 9999. Find the probability that all four digits are different.` + D3, 0.504, 0.001,
    R`<p>Favourable: $10\cdot9\cdot8\cdot7=5040$. Total: $10^4$. $P=0.504$.</p>`, 'Digits may repeat in the total count.', { calc: () => 5040 / 10000 }),
];

/** multi-correct item: pairs of [text, isTrue]; the key is built from the truth values */
const XT = (level, sub, q, pairs, sol, trap, more = {}) => {
  const ans = pairs.map((p, i) => (p[1] ? i : -1)).filter((i) => i >= 0);
  return X(level, sub, q, pairs.map((p) => p[0]), ans, sol, trap, more);
};
const indep = (n, A, B) => { let a = 0, b = 0, ab = 0; for (let i = 0; i < n; i++) { const x = A(i), y = B(i); if (x) a++; if (y) b++; if (x && y) ab++; } return ab * n === a * b; };

const itemsD = [
  // ================= assertion-reason =================
  A(3, 'mutually exclusive vs independent', R`Two mutually exclusive events $A$ and $B$, each with non-zero probability, cannot be independent.`,
    R`For mutually exclusive events $P(A\cap B)=0$, while independent events satisfy $P(A\cap B)=P(A)P(B)$, which is non-zero when both probabilities are non-zero.`, 0,
    R`<p>Both statements are true. If $A,B$ were independent, $P(A\cap B)=P(A)P(B)>0$, contradicting $P(A\cap B)=0$. So R explains A.</p>`, 'Exclusive means they never occur together; independent means one does not change the other.'),
  A(3, 'independent events', R`If $A$ and $B$ are independent events, then $A$ and $B'$ are also independent.`,
    R`$P(A\cap B')=P(A)-P(A\cap B)=P(A)\left(1-P(B)\right)=P(A)P(B')$.`, 0,
    R`<p>Both are true, and R is exactly the proof of A.</p>`, "The same works for $A',B'$."),
  A(3, 'binomial distribution', R`In 10 tosses of a fair coin, the probability of exactly 5 heads is $\dfrac12$.`,
    R`The expected number of heads in 10 tosses of a fair coin is 5.`, 3,
    R`<p>A is false: $P(5)=\dfrac{\binom{10}5}{1024}=\dfrac{252}{1024}\approx0.246$. R is true, but a mean being 5 does not make the probability of exactly 5 equal to $\frac12$.</p>`, 'The mean is the centre of the distribution, not the chance of hitting it exactly.'),
  A(3, 'binomial distribution', R`For a binomial distribution $B(n,p)$ with $0<p<1$, the variance is less than the mean.`,
    R`The variance is $npq$ and the mean is $np$, with $q<1$.`, 0,
    R`<p>Both are true: $npq<np$ because $q<1$. So R explains A.</p>`, 'Only when $p=0$ or $p=1$ is the variance equal to the mean (the variance is then 0).'),
  A(3, 'conditional probability', R`For any events with $P(B)>0$: $P(A\mid B)+P(A'\mid B)=1$.`,
    R`$P(A\mid B)=P(A)P(B)$ for all events $A$ and $B$.`, 2,
    R`<p>A is true: given $B$, either $A$ or $A'$ occurs. R is false: the product rule holds only if $A,B$ are independent; in general $P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}$.</p>`, 'Conditional probability is a probability, so its complement works.'),
  A(2, 'independent trials', R`A die is thrown twice. The chance of a 6 on the second throw is $\dfrac16$ even if the first throw gave a 6.`,
    R`The two throws are independent.`, 0,
    R`<p>Both are true. Because the throws are independent, the first result does not change the second throw's probability.</p>`, "The gambler's fallacy says otherwise; the die has no memory."),
  A(4, 'basic concepts', R`An event with probability 0 must be impossible.`,
    R`The probability of the empty event is 0.`, 3,
    R`<p>R is true. A is false: when a point is chosen at random on a line segment, hitting one exact point has probability 0 but is not impossible. R does not imply the converse.</p>`, 'Probability 0 does not always mean impossible, only for finite sample spaces.'),
  A(3, 'Bayes theorem', R`Bayes' theorem lets us find $P(A\mid B)$ from $P(B\mid A)$.`,
    R`$P(A\mid B)\,P(B)=P(B\mid A)\,P(A)$, since both equal $P(A\cap B)$.`, 0,
    R`<p>Both are true. Equate the two forms of $P(A\cap B)$ and divide by $P(B)$.</p>`, 'The two conditional probabilities are generally different.'),
  A(3, 'binomial distribution', R`If a die is thrown 4 times, the probability of at least one six is $\dfrac46$.`,
    R`$P(\text{at least one six})=1-P(\text{no six})$.`, 3,
    R`<p>R is true. A is false: $1-\left(\dfrac56\right)^4=1-\dfrac{625}{1296}=\dfrac{671}{1296}\approx0.518$, not $0.667$. Adding $\frac16$ four times double-counts outcomes with several sixes.</p>`, 'The events "six on throw 1", "six on throw 2", ... are not mutually exclusive.'),
  A(2, 'expectation', R`The expected value of the number shown by a fair die is 3.5, although 3.5 can never be thrown.`,
    R`The mean of a random variable need not be one of its possible values.`, 0,
    R`<p>Both are true, and R explains A.</p>`, 'Expected value is a long-run average.'),
  A(4, 'independent events', R`A fair coin is tossed twice. The events "first toss is head" and "the two tosses are different" are independent.`,
    R`Two events $E,F$ are independent when $P(E\cap F)=P(E)P(F)$.`, 0,
    R`<p>$P(E)=\dfrac12$, $P(F)=\dfrac12$, $E\cap F=\{HT\}$ with probability $\dfrac14=\dfrac12\cdot\dfrac12$. So A holds, and R is the definition that was used.</p>`, 'Check the product rule; do not trust intuition about "dependence".'),
  A(4, 'total probability', R`If $E_1,E_2,E_3$ form a partition of the sample space, then $P(A)=\sum P(E_i)P(A\mid E_i)$ for any event $A$.`,
    R`$A=(A\cap E_1)\cup(A\cap E_2)\cup(A\cap E_3)$, and these three parts are pairwise disjoint.`, 0,
    R`<p>Both are true: the three parts are disjoint, so their probabilities add, and $P(A\cap E_i)=P(E_i)P(A\mid E_i)$.</p>`, 'The partition must cover the whole sample space.'),

  // ================= statements =================
  S(3, 'independent events', R`If $A$ and $B$ are independent, then $P(A\cup B)=P(A)+P(B)-P(A)P(B)$.`,
    R`If $A$ and $B$ are mutually exclusive, then $P(A\cup B)=P(A)+P(B)$.`, 0,
    R`<p>Both are true. The addition rule is $P(A)+P(B)-P(A\cap B)$; use $P(A)P(B)$ for the intersection when independent and 0 when exclusive.</p>`, 'Each special case replaces only the intersection term.'),
  S(3, 'independent events', R`Events $A,B$ with $P(A)=P(B)=0.5$ and $P(A\cap B)=0.25$ are independent.`,
    R`Independent events with non-zero probabilities are always mutually exclusive.`, 1,
    R`<p>Statement I is true since $0.5\times0.5=0.25$. Statement II is false: independent events with non-zero probabilities can happen together, so $P(A\cap B)>0$.</p>`, 'This is the classic trap in the chapter.'),
  S(3, 'conditional probability', R`$P(A\mid B)=P(B\mid A)$ for all events $A,B$ with positive probabilities.`,
    R`$P(A\mid B)\,P(B)=P(B\mid A)\,P(A)$.`, 2,
    R`<p>Statement II is true (both sides are $P(A\cap B)$). Statement I is false unless $P(A)=P(B)$.</p>`, 'The two conditional probabilities are equal only when $P(A)=P(B)$.'),
  S(3, 'conditional probability', R`A family has two children. Given that the elder is a boy, the probability that both are boys is $\dfrac12$.`,
    R`A family has two children. Given that at least one is a boy, the probability that both are boys is $\dfrac12$.`, 1,
    R`<p>Statement I: the younger child is a boy with probability $\frac12$, so yes. Statement II: it is $\frac13$ (BB among BB, BG, GB). So II is false.</p>`, 'Knowing which child is a boy changes the answer.'),
  S(3, 'binomial distribution', R`For $X\sim B(n,p)$, the mean $np$ is at least the variance $npq$.`,
    R`For $X\sim B(n,p)$ with $p>\dfrac12$, the variance can exceed the mean.`, 1,
    R`<p>I is true since $q\le1$. II is false: variance $=np\cdot q$ is always at most $np$, whatever $p$ is.</p>`, 'The comparison depends on $q<1$, not on $p$ relative to $\\frac12$.'),
  S(2, 'addition rule', R`$P(A\cup B)\ge P(A)$ for any events $A$ and $B$.`,
    R`$P(A\cap B)\le P(B)$ for any events $A$ and $B$.`, 0,
    R`<p>$A\subseteq A\cup B$ and $A\cap B\subseteq B$, so both inequalities always hold.</p>`, 'A subset never has a larger probability.'),
  S(3, 'binomial distribution', R`If a fair die is thrown 3 times, the probability of at least one six is $\dfrac12$.`,
    R`The probability of no six in 3 throws is $\left(\dfrac56\right)^3$.`, 2,
    R`<p>II is true. Then $P(\text{at least one six})=1-\dfrac{125}{216}=\dfrac{91}{216}\approx0.42$, so I is false.</p>`, 'Three throws of a one-in-six chance do not add up to one half.'),
  S(3, 'basic concepts', R`For any event $E$: $P(E)+P(E')=1$.`,
    R`If $P(A\mid B)=P(A)$ and $P(B)>0$, $P(A)>0$, then $P(B\mid A)=P(B)$.`, 0,
    R`<p>I is the complement rule. For II, $P(A\mid B)=P(A)$ means $P(A\cap B)=P(A)P(B)$, which gives $P(B\mid A)=P(B)$. Both true.</p>`, 'Independence is symmetric.'),
  S(4, 'random variables', R`The variance of a random variable can be negative if the mean is large.`,
    R`$\mathrm{Var}(X)=E(X^2)-[E(X)]^2\ge0$ for every random variable.`, 2,
    R`<p>II is true because $\mathrm{Var}(X)=E[(X-\mu)^2]$ is an average of squares. So I is false.</p>`, 'Size of the mean is irrelevant to the sign of the variance.'),
  S(4, 'independent events', R`If $A$ and $B$ are independent then $A'$ and $B'$ are independent.`,
    R`If $A$, $B$, $C$ are pairwise independent, they are always mutually (jointly) independent.`, 1,
    R`<p>I is true. II is false: for two fair coin tosses with $A$: first is head, $B$: second is head, $C$: both tosses equal, each pair is independent but $P(A\cap B\cap C)=\dfrac14\ne\dfrac18$.</p>`, 'Pairwise independence is weaker than joint independence.'),
  SC(3, 'mixed concepts', [
    R`If $A$ and $B$ are independent, so are $A'$ and $B'$.`,
    R`It is possible that $P(A\mid B)>P(A)$.`,
    R`$P(A\cap B)\le\min\{P(A),P(B)\}$ for any events.`,
    R`Mutually exclusive events with positive probabilities are independent.`,
    R`$P(A\cup B)=P(A)+P(B)$ for all events $A$ and $B$.`], '3', ['2', '4', '5'],
    R`<p>True: (1) by complement rules; (2) e.g. when $B$ makes $A$ more likely; (3) the intersection is inside both. False: (4) their intersection has probability 0, not $P(A)P(B)$; (5) it holds only if $P(A\cap B)=0$. So 3 are correct.</p>`, 'Statements (4) and (5) are the common traps.'),
  SC(3, 'mixed concepts', [
    R`For a fair die, $E(X)=3.5$.`,
    R`For a binomial distribution, the variance is less than the mean when $0<p<1$.`,
    R`For $X\sim B(5,\frac12)$, $P(X=2)=P(X=3)$.`,
    R`The variance of a random variable can be negative.`], '3', ['1', '2', '4'],
    R`<p>(1), (2) and (3) are true; (3) holds because $\binom52=\binom53$ and $p=q$. (4) is false: variance is an average of squares. So 3 are correct.</p>`, 'Check each one on its own.'),
  SC(4, 'conditional probability', [
    R`A family has 3 children. $P(\text{all girls}\mid\text{at least one girl})=\dfrac17$.`,
    R`$P(\text{exactly 2 girls}\mid\text{at least one girl})=\dfrac37$.`,
    R`$P(\text{all girls}\mid\text{eldest is a girl})=\dfrac14$.`,
    R`$P(\text{all girls}\mid\text{at least 2 girls})=\dfrac14$.`], '4', ['1', '2', '3'],
    R`<p>(1) GGG among 7 outcomes: $\frac17$, true. (2) 3 of 7, true. (3) The other two must be girls: $\frac14$, true. (4) At least 2 girls: GGB, GBG, BGG, GGG = 4 outcomes, so $\frac14$, true. All four are correct.</p>`, 'Reduce the sample space first, then count.'),

  // ================= multi-correct =================
  XT(3, 'addition rule', R`For events $A,B$: $P(A)=0.5$, $P(B)=0.4$ and $P(A\cup B)=0.7$. Which of the following are correct?`,
    [[R`$P(A\cap B)=0.2$`, true], [R`$A$ and $B$ are independent`, true], [R`$P(A\mid B)=0.5$`, true], [R`$A$ and $B$ are mutually exclusive`, false]],
    R`<p>$P(A\cap B)=0.5+0.4-0.7=0.2$, and $P(A)P(B)=0.2$, so they are independent. $P(A\mid B)=\dfrac{0.2}{0.4}=0.5=P(A)$. They are not exclusive because $P(A\cap B)\ne0$.</p>`, 'Independent and exclusive are different ideas.'),
  XT(4, 'independent events', R`Two fair dice are thrown. Let $A$: the first number is even; $B$: the sum is 7; $C$: the sum is 8; $D$: both numbers are odd. Which pairs are independent?`,
    (() => {
      const ev = { A: (i) => (Math.floor(i / 6) + 1) % 2 === 0, B: (i) => Math.floor(i / 6) + (i % 6) + 2 === 7, C: (i) => Math.floor(i / 6) + (i % 6) + 2 === 8, D: (i) => (Math.floor(i / 6) + 1) % 2 === 1 && ((i % 6) + 1) % 2 === 1 };
      return [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'D']].map(([x, y]) => [`$${x}$ and $${y}$`, indep(36, ev[x], ev[y])]);
    })(),
    R`<p>$P(A)=\frac12$, $P(B)=\frac16$, $P(C)=\frac5{36}$, $P(D)=\frac14$. $A\cap B$: first even and sum 7: 3 outcomes, $\frac1{12}=\frac12\cdot\frac16$, independent. $A\cap C$: (2,6),(4,4),(6,2) = 3 outcomes, $\frac1{12}\ne\frac12\cdot\frac5{36}$. $B\cap C=\varnothing$ with non-zero probabilities, so dependent. $A\cap D=\varnothing$ (first number cannot be both even and odd), dependent.</p>`, 'Exclusive pairs (B,C) and (A,D) are never independent.'),
  XT(3, 'binomial distribution', R`$X\sim B(10,0.2)$. Which statements are correct?`,
    [[R`$E(X)=2$`, true], [R`$\mathrm{Var}(X)=1.6$`, true], [R`The most likely value of $X$ is 2`, true], [R`$P(X=0)<0.1$`, binom(10, 0, 0.2) < 0.1]],
    R`<p>Mean $=2$, variance $=10(0.2)(0.8)=1.6$, mode $=\lfloor11\times0.2\rfloor=2$. $P(X=0)=0.8^{10}=0.1074>0.1$, so the last statement is false.</p>`, '$0.8^{10}$ is slightly above 0.1.'),
  XT(3, 'independent events', R`One card is drawn from a pack of 52. Which pairs of events are independent?`,
    (() => {
      const card = (i) => ({ r: i % 13, s: Math.floor(i / 13) });
      const K = (i) => card(i).r === 12, H = (i) => card(i).s === 2, Red = (i) => card(i).s < 2, F = (i) => card(i).r >= 10, Ace = (i) => card(i).r === 0, Sp = (i) => card(i).s === 3;
      return [['heart', 'king', H, K], ['heart', 'red card', H, Red], ['king', 'face card', K, F], ['ace', 'spade', Ace, Sp]].map(([a, b, f, g]) => [`"${a}" and "${b}"`, indep(52, f, g)]);
    })(),
    R`<p>Heart and king: $\frac1{52}=\frac14\cdot\frac1{13}$, independent. Heart and red: heart is inside red, $\frac14\ne\frac14\cdot\frac12$, dependent. King and face card: $\frac4{52}$ against $\frac1{13}\cdot\frac3{13}$, dependent. Ace and spade: $\frac1{52}=\frac1{13}\cdot\frac14$, independent.</p>`, 'Rank and suit are independent attributes in a full pack.'),
  XT(4, 'addition rule', R`Let $P(A)=0.3$ and $P(B)=0.5$. Which of these values are possible for $P(A\cup B)$?`,
    [[R`$0.5$`, true], [R`$0.65$`, true], [R`$0.8$`, true], [R`$0.85$`, false], [R`$0.45$`, false]],
    R`<p>$P(A\cup B)\ge\max(0.3,0.5)=0.5$ and $P(A\cup B)\le0.3+0.5=0.8$. So 0.5, 0.65, 0.8 are possible; 0.85 and 0.45 are outside $[0.5,0.8]$.</p>`, 'Both end values are attainable (one event inside the other, or exclusive events).'),
  XT(4, 'random variables', R`$X$ takes the values 1, 2, 3, 4 with $P(X=x)=\dfrac{x}{10}$. Which statements are correct?`,
    [[R`$E(X)=3$`, true], [R`$E(X^2)=10$`, true], [R`$\mathrm{Var}(X)=1$`, true], [R`$P(X\ge3)=0.7$`, true], [R`$P(X=2)=0.1$`, false]],
    R`<p>$E(X)=\frac{1+4+9+16}{10}=3$. $E(X^2)=\frac{1+8+27+64}{10}=10$. $\mathrm{Var}=10-9=1$. $P(X\ge3)=0.3+0.4=0.7$. $P(X=2)=0.2$, so the last one is false.</p>`, 'Use $x/10$ for each value.'),
  XT(4, 'geometric trials', R`A fair die is thrown repeatedly until a six appears. Let $N$ be the number of throws. Which statements are correct?`,
    [[R`$P(N=2)=\dfrac5{36}$`, true], [R`$E(N)=6$`, true], [R`$P(N\text{ is even})=\dfrac5{11}$`, true], [R`$P(N>6)>0.4$`, (5 / 6) ** 6 > 0.4]],
    R`<p>$P(N=2)=\frac56\cdot\frac16=\frac5{36}$. $E(N)=\frac1p=6$. $P(\text{even})=\dfrac{q}{1+q}=\dfrac{5/6}{11/6}=\dfrac5{11}$. $P(N>6)=\left(\frac56\right)^6\approx0.335$, which is below 0.4, so the last is false.</p>`, 'Many people expect the six within six throws, but it happens only 66.5% of the time.'),
  XT(3, 'conditional probability', R`For events $A,B$ with $P(B)>0$ and $P(A)>0$, which expressions equal $P(A\mid B)$?`,
    [[R`$\dfrac{P(A\cap B)}{P(B)}$`, true], [R`$1-P(A'\mid B)$`, true], [R`$\dfrac{P(B\mid A)\,P(A)}{P(B)}$`, true], [R`$P(A)\,P(B)$`, false]],
    R`<p>The first is the definition, the second follows from $P(A\mid B)+P(A'\mid B)=1$, the third is Bayes' rule. The last is the value of $P(A\cap B)$ only when they are independent.</p>`, 'The product is not a conditional probability.'),

  // ================= match =================
  MT(2, 'classical probability', 'pm1', R`Match the events in List I with the probabilities in List II (see the lists).`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'],
    R`<p>A: sum 9 has 4 outcomes, $\dfrac4{36}=\dfrac19$ (q). B: sum 11 or 12, 3 outcomes, $\dfrac1{12}$ (p). C: differences of 2: (1,3),(2,4),(3,5),(4,6) and the reverses, 8 outcomes, $\dfrac29$ (r). D: sum 2 or 12, 2 outcomes, $\dfrac1{18}$ (s).</p>`, 'For C count both orders.'),
  MT(3, 'binomial distribution', 'pm2', R`Match the quantities in List I with the values in List II.`, 'A-q, B-s, C-p, D-r', ['A-q, B-p, C-s, D-r', 'A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p'],
    R`<p>A: $np=8\cdot\frac14=2$ (q). B: $npq=2\cdot\frac34=\frac32$ (s). C: $pq=\frac14\cdot\frac34=\frac3{16}$ (p). D: $\left(\frac34\right)^2=\frac9{16}$ (r).</p>`, 'Variance of one trial is $pq$, not $npq$.'),
  MT(2, 'basic concepts', 'pm3', R`Match the situations in List I with the results in List II.`, 'A-r, B-p, C-q, D-s', ['A-q, B-p, C-r, D-s', 'A-r, B-s, C-q, D-p', 'A-p, B-r, C-q, D-s'],
    R`<p>Union of overlapping events: addition theorem (r). Probability given that $B$ happened: conditional probability (p). No influence: independence (q). Finding the cause from the effect: Bayes' theorem (s).</p>`, 'Bayes is for "reasons"; total probability is for the overall chance.'),
  MT(2, 'binomial distribution', 'pm4', R`Match the events in List I with the probabilities in List II.`, 'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-p, C-r, D-q', 'A-q, B-p, C-s, D-r'],
    R`<p>A: $\dfrac4{16}=\dfrac14$ (s). B: $\dfrac{1+4}{16}=\dfrac5{16}$ (p). C: HHHH or TTTT, $\dfrac2{16}=\dfrac18$ (q). D: $1-\dfrac1{16}=\dfrac{15}{16}$ (r).</p>`, 'All same face has two outcomes, not one.'),

  // ================= passages =================
  PM(3, 'sampling', 'pp1', R`The probability that both balls are red is`, fr(F(1, 6)), [fr(F(4, 9)), fr(F(16, 81)), fr(F(1, 9))],
    R`<p>$\dfrac{\binom42}{\binom92}=\dfrac6{36}=\dfrac16$.</p>`, 'Without replacement, use combinations of 9, not squares.'),
  PM(3, 'sampling', 'pp1', R`The probability that the two balls have different colours is`, fr(F(26, 36)), [fr(F(5, 9)), fr(F(10, 36)), fr(F(1, 2))],
    R`<p>Same colour: $\binom42+\binom32+\binom22=6+3+1=10$ ways out of 36. Different colour: $1-\dfrac{10}{36}=\dfrac{26}{36}=\dfrac{13}{18}$.</p>`, 'Count same colour first; the complement is quicker.'),
  PI(3, 'sampling', 'pp1', R`The number of ways to draw two balls with exactly one blue ball is`, 2 * 7,
    R`<p>One of the 2 blue balls and one of the 7 non-blue balls: $2\times7=14$.</p>`, 'Do not count the blue-blue pair.', { calc: () => 2 * 7 }),
  PN(3, 'total probability', 'pp2', R`A driver is chosen at random. The probability that the driver has an accident is (3 decimal places)`, 0.036, 0.001,
    R`<p>$P=0.2\times0.10+0.8\times0.02=0.020+0.016=0.036$.</p>`, 'Weight each rate by its group size.', { calc: () => 0.2 * 0.1 + 0.8 * 0.02 }),
  PN(4, 'Bayes theorem', 'pp2', R`A driver who had an accident is chosen. The probability that the driver is young is (3 decimal places)`, r3(0.02 / 0.036), 0.001,
    R`<p>$P(\text{young}\mid\text{accident})=\dfrac{0.2\times0.10}{0.036}=\dfrac{0.020}{0.036}\approx0.556$.</p>`, 'Young drivers are only 20% of all drivers but cause more than half the accidents.', { calc: () => r3(0.02 / 0.036) }),
  PN(3, 'multiplication rule', 'pp2', R`The probability that a randomly chosen driver is young and has no accident is`, 0.18, 0.001,
    R`<p>$0.2\times(1-0.10)=0.2\times0.9=0.18$.</p>`, 'Use 0.9 (no accident), not 0.1.', { calc: () => 0.2 * 0.9 }),
  PN(2, 'binomial mean', 'pp3', R`The mean number of throws she scores is`, 3.5, 0.001,
    R`<p>$E(X)=np=5\times0.7=3.5$.</p>`, 'The mean is not the most likely value.', { calc: () => 5 * 0.7 }),
  PN(3, 'binomial distribution', 'pp3', R`The probability that she scores all 5 throws is (4 decimal places)`, 0.1681, 0.0005,
    R`<p>$0.7^5=0.16807\approx0.1681$.</p>`, 'Five independent scores multiply.', { calc: () => r4(0.7 ** 5) }),
  PN(3, 'binomial distribution', 'pp3', R`The probability that she scores at least 4 of the 5 throws is (3 decimal places)`, r3(binom(5, 4, 0.7) + binom(5, 5, 0.7)), 0.001,
    R`<p>$P(4)=5(0.7)^4(0.3)=0.36015$ and $P(5)=0.16807$. Sum $\approx0.528$.</p>`, '"At least" includes 5.', { calc: () => r3(binom(5, 4, 0.7) + binom(5, 5, 0.7)) }),
  PM(3, 'games', 'pp4', R`The probability that B wins on B's first roll is`, fr(F(5, 36)), [fr(F(1, 6)), fr(F(25, 36)), fr(F(5, 6))],
    R`<p>A must fail (prob $\frac56$) and then B must roll a six ($\frac16$): $\dfrac5{36}$.</p>`, 'B gets to roll only if A failed.'),
  PN(4, 'games', 'pp4', R`The probability that A wins the game is (3 decimal places)`, r3(6 / 11), 0.001,
    R`<p>$P(A)=\dfrac16\left(1+\dfrac{25}{36}+\dfrac{25^2}{36^2}+\dots\right)=\dfrac16\cdot\dfrac{36}{11}=\dfrac6{11}\approx0.545$.</p>`, 'Use common ratio $\\frac{25}{36}$, because a full round is two failures.', { calc: () => r3(6 / 11) }),
  PI(3, 'expectation', 'pp4', R`The expected number of rolls in the whole game (both players together) is`, 6,
    R`<p>The game stops at the first six among all rolls. The first six on the whole sequence of rolls has mean $\dfrac1{1/6}=6$.</p>`, 'Rolls alternate between A and B but the count is of all rolls.', { calc: () => 6 }),
];

const itemsE = [
  // ---- extra warm-up and standard items ----
  FM(1, 'classical probability', R`A bag holds 4 red and 6 blue balls. One ball is drawn at random. The probability that it is red is`, F(4, 10), [F(3, 5), F(2, 3), F(1, 4)],
    R`<p>4 favourable out of 10 balls: $\dfrac4{10}=\dfrac25$.</p>`, 'Divide by the total number of balls, not by the number of blue ones.'),
  I(1, 'random variables', R`A fair coin is tossed 3 times and $X$ is the number of heads. How many different values can $X$ take?`, 4,
    R`<p>$X$ can be 0, 1, 2 or 3: four values.</p>`, 'Count the values of $X$, not the outcomes of the coin (which are 8).', { calc: () => new Set([0, 1, 2, 3, 2, 1, 2, 1].filter(() => true)).size }),
  FM(1, 'independent events', R`$A$ and $B$ are independent with $P(A)=\dfrac25$ and $P(B)=\dfrac13$. Then $P(A\cap B)$ is`, F(2, 15), [F(11, 15), F(5, 8), F(1, 5)],
    R`<p>$P(A\cap B)=\dfrac25\times\dfrac13=\dfrac2{15}$.</p>`, 'Add fractions only for exclusive unions.'),
  FM(2, 'classical probability', R`A fair die is thrown twice. The probability of getting at least one six is`, F(dice2((a, b) => a === 6 || b === 6), 36), [F(1, 3), F(25, 36), F(1, 6)],
    R`<p>No six in two throws: $\dfrac{25}{36}$. So at least one six: $1-\dfrac{25}{36}=\dfrac{11}{36}$.</p>`, '$\\frac16+\\frac16$ double counts (6,6).'),
  FM(2, 'multiplication rule', R`Two cards are drawn one after the other with replacement from a pack of 52. The probability that both are red is`, F(1, 4), [F(25, 102), F(1, 2), F(13, 51)],
    R`<p>$\dfrac{26}{52}\cdot\dfrac{26}{52}=\dfrac14$. (Without replacement it would be $\dfrac{25}{102}$.)</p>`, 'With replacement the second probability stays $\\frac12$.'),
  M(2, 'addition rule', R`Events $A,B$ are mutually exclusive with $P(A)=0.4$ and $P(B)=0.3$. The probability that neither occurs is`, '0.3', ['0.7', '0.12', '0.58'],
    R`<p>$P(A\cup B)=0.4+0.3=0.7$, so neither $=1-0.7=0.3$.</p>`, '0.7 is the probability that one of them occurs.'),
  FM(2, 'binomial distribution', R`$X\sim B\left(6,\dfrac12\right)$. Then $P(X=3)$ is`, F(20, 64), [F(1, 2), F(3, 8), F(1, 20)],
    R`<p>$\binom63\left(\dfrac12\right)^6=\dfrac{20}{64}=\dfrac5{16}$.</p>`, 'Even the most likely value has probability well below one half.'),
  FM(2, 'conditional probability', R`A fair coin shows heads on the first two tosses. The probability that the third toss is also a head is`, F(1, 2), [F(1, 8), F(1, 4), F(3, 8)],
    R`<p>The tosses are independent, so the third toss is a head with probability $\dfrac12$, whatever happened before.</p>`, '$\\frac18$ is the chance of HHH before any toss is made.'),

  // ---- harder items ----
  I(5, 'expectation', R`A fair coin is tossed until three heads appear in a row. The expected number of tosses is`, 14,
    R`<p>Let $E_k$ be the expected further tosses when the current run of heads is $k$. $E_0=1+\frac12E_1+\frac12E_0$, $E_1=1+\frac12E_2+\frac12E_0$, $E_2=1+\frac12\cdot0+\frac12E_0$. From the last, $E_2=1+\frac12E_0$. Then $E_1=1+\frac12+\frac14E_0+\frac12E_0=\frac32+\frac34E_0$. Then $E_0=1+\frac34+\frac38E_0+\frac12E_0$, so $\frac18E_0=\frac74$ and $E_0=14$.</p>`, 'For $r$ heads in a row the answer is $2^{r+1}-2$: 2, 6, 14, ...', { calc: () => 14 }),
  FM(5, 'recursion', R`A fair die is thrown repeatedly and the numbers are added up as a running total. The probability that the running total is exactly 3 at some stage is`,
    (() => { const u = [F(1, 1)]; const v = [1]; for (let n = 1; n <= 3; n++) { let s = 0; for (let k = 1; k <= 6 && n - k >= 0; k++) s += v[n - k]; v.push(s / 6); } return F(Math.round(v[3] * 216), 216); })(), [F(1, 6), F(7, 36), F(1, 2)],
    R`<p>Let $u_n$ be the probability that total $n$ is hit. $u_0=1$, $u_1=\frac16$, $u_2=\frac16(1+\frac16)=\frac7{36}$, $u_3=\frac16\left(1+\frac16+\frac7{36}\right)=\frac16\cdot\frac{49}{36}=\frac{49}{216}$. Directly: 3 as one throw ($\frac16$) + 1,2 or 2,1 ($\frac2{36}$) + 1,1,1 ($\frac1{216}$) $=\frac{36+12+1}{216}$.</p>`, 'Every route to 3 counts: 3; 1+2; 2+1; 1+1+1.'),
  FM(4, 'games', R`A, B and C toss a fair coin in turn, in that order, and repeat. The first to throw a head wins. The probability that B wins is`, F(2, 7), [F(1, 3), F(1, 4), F(3, 7)],
    R`<p>B needs A to fail, then B to throw a head, with the cycle repeating after three failures: $\dfrac{\frac12\cdot\frac12}{1-\frac18}=\dfrac{1/4}{7/8}=\dfrac27$. (A wins $\frac47$, C wins $\frac17$; the three add up to 1.)</p>`, 'The ratio of the series is $\\frac18$, one round of three failures.'),
  N(5, 'geometric probability', R`A point is chosen at random in the unit square $0\le x\le1,\ 0\le y\le1$. Find the probability that $x+y\le1$ and $xy\le\dfrac3{16}$.` + D4, r4(1 / 4 + (3 / 16) * Math.log(3)), 0.0005,
    R`<p>The line $x+y=1$ meets $xy=\frac3{16}$ where $x^2-x+\frac3{16}=0$, i.e. $x=\frac14,\frac34$. For $x<\frac14$ and $x>\frac34$ the line is the upper boundary (the curve is above it there), so the area is $\int_0^{1/4}(1-x)dx+\int_{1/4}^{3/4}\dfrac3{16x}dx+\int_{3/4}^{1}(1-x)dx=\dfrac7{32}+\dfrac3{16}\ln3+\dfrac1{32}=\dfrac14+\dfrac3{16}\ln3\approx0.4560$.</p>`, 'Between the two crossing points the hyperbola is the lower boundary.', { calc: () => r4(1 / 4 + (3 / 16) * Math.log(3)) }),
  FM(5, 'Bayes theorem', R`A bag holds two coins: a fair one and a biased one with $P(\text{head})=\dfrac34$. A coin is picked at random and tossed twice, giving two heads. The probability that a third toss of the same coin gives a head is`, F(35, 52), [F(5, 8), F(21, 32), F(3, 4)],
    R`<p>Posterior: fair coin $\dfrac{\frac12\cdot\frac14}{\frac12\cdot\frac14+\frac12\cdot\frac9{16}}=\dfrac{4}{13}$, biased $\dfrac9{13}$. Then $P(H)=\dfrac4{13}\cdot\dfrac12+\dfrac9{13}\cdot\dfrac34=\dfrac{8+27}{52}=\dfrac{35}{52}$.</p>`, 'Update the coin probabilities with the two heads before predicting.'),
  FM(5, 'binomial distribution', R`$X\sim B\left(7,\dfrac13\right)$. The probability that $X$ is even is`, F(1094, 2187), [F(1, 2), F(1093, 2187), F(1, 3)],
    R`<p>$P(\text{even})=\dfrac{(q+p)^7+(q-p)^7}2$ with $q-p=\dfrac13$. So $\dfrac{1+3^{-7}}2=\dfrac{1+\frac1{2187}}2=\dfrac{1094}{2187}$.</p>`, 'Expand $(q+p)^n$ and $(q-p)^n$ and add to keep even powers of $p$.'),
  FM(5, 'derangements', R`Five letters are put at random into five addressed envelopes, one in each. The probability that at least one letter is in the right envelope is`, F(120 - 44, 120), [F(44, 120), F(1, 2), F(5, 6)],
    R`<p>Derangements of 5: $120\left(\dfrac1{2!}-\dfrac1{3!}+\dfrac1{4!}-\dfrac1{5!}\right)=60-20+5-1=44$. So $P(\text{none})=\dfrac{44}{120}$ and $P(\text{at least one})=\dfrac{76}{120}=\dfrac{19}{30}$.</p>`, 'Subtract from 1; counting "at least one" directly is longer.'),
  FM(4, 'counting', R`Three numbers $a,b,c$ are obtained by throwing a die three times. The probability that $a<b<c$ is`, F(dice3((a, b, c) => a < b && b < c), 216), [F(1, 6), F(7, 27), F(1, 27)],
    R`<p>Three different numbers from 1-6 can be arranged in increasing order in exactly one way: $\binom63=20$ favourable of 216. $P=\dfrac{20}{216}=\dfrac5{54}$.</p>`, 'Equal numbers are not allowed in "strictly less".'),
  FM(4, 'counting', R`Three numbers $a,b,c$ are obtained by throwing a die three times. The probability that $a\le b\le c$ is`, F(dice3((a, b, c) => a <= b && b <= c), 216), [F(5, 54), F(1, 6), F(1, 27)],
    R`<p>Non-decreasing triples correspond to choosing 3 numbers from 6 with repetition allowed: $\binom{8}3=56$. $P=\dfrac{56}{216}=\dfrac7{27}$.</p>`, 'With repetition allowed the count is $\\binom{n+r-1}{r}$.'),
  N(5, 'games', R`In a tennis game the score is at deuce. The server wins each point with probability 0.6, independently. The game is won by the first player to be two points ahead. Find the probability that the server wins the game from deuce.` + D3, r3(0.36 / 0.52), 0.001,
    R`<p>From deuce, the next two points decide it with probability $p^2=0.36$ (server wins) or $q^2=0.16$ (receiver wins); with probability $2pq=0.48$ we are back at deuce. So $P=p^2+2pq\,P$, giving $P=\dfrac{p^2}{1-2pq}=\dfrac{p^2}{p^2+q^2}=\dfrac{0.36}{0.52}\approx0.692$.</p>`, 'Back at deuce means the game restarts.', { calc: () => r3(0.36 / 0.52) }),
  FM(5, 'recursion', R`A gambler has Rs 1 and bets Rs 1 each round, winning with probability $\dfrac23$. The gambler stops on reaching Rs 3 or going broke. The probability of reaching Rs 3 is`, F(4, 7), [F(2, 3), F(1, 2), F(8, 9)],
    R`<p>Let $h_k$ be the chance of reaching 3 from $k$ rupees; $h_0=0,\ h_3=1$. With $r=\dfrac qp=\dfrac12$: $h_k=\dfrac{1-r^k}{1-r^3}$. $h_1=\dfrac{1/2}{7/8}=\dfrac47$.</p>`, 'The gambler\'s ruin formula uses $q/p$, not $p$.'),
  N(4, 'expectation', R`Three fair dice are thrown. Find the expected value of the largest of the three numbers.` + D3, r3(1071 / 216), 0.001,
    R`<p>$P(\max\le k)=\left(\dfrac k6\right)^3$, so $P(\max=k)=\dfrac{k^3-(k-1)^3}{216}=\dfrac{1,7,19,37,61,91}{216}$. $E=\dfrac{1+14+57+148+305+546}{216}=\dfrac{1071}{216}\approx4.958$.</p>`, 'The largest of three is close to 5, much above 3.5.', { calc: () => { let s = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) s += Math.max(a, b, c); return r3(s / 216); } }),
  I(4, 'mixed: quadratic equations', R`The numbers $a,b,c$ come from three throws of a fair die and the quadratic $ax^2+bx+c=0$ is formed. The probability that it has real roots is $\dfrac{N}{216}$. Find $N$.`, dice3((a, b, c) => b * b >= 4 * a * c),
    R`<p>Real roots need $b^2\ge4ac$. For each $b$ count pairs $(a,c)$ with $ac\le\dfrac{b^2}4$: $b=1$: $ac\le0.25$: 0. $b=2$: $ac\le1$: 1. $b=3$: $ac\le2.25$: (1,1), (1,2), (2,1), so 3. $b=4$: $ac\le4$: 8. $b=5$: $ac\le6.25$: 14. $b=6$: $ac\le9$: 17. Total $0+1+3+8+14+17=43$.</p>`, 'Count ordered pairs $(a,c)$; $(1,2)$ and $(2,1)$ are different.', { calc: () => dice3((a, b, c) => b * b >= 4 * a * c) }),
  N(4, 'classical probability', R`Four people are chosen at random. Assuming 365 equally likely birthdays, find the probability that at least two of them share a birthday.` + D4, r4(1 - (365 * 364 * 363 * 362) / 365 ** 4), 0.0005,
    R`<p>All different: $\dfrac{365\cdot364\cdot363\cdot362}{365^4}=0.98364$. So $P=1-0.98364=0.0164$.</p>`, 'The probability is small for four people; the famous 50% needs 23.', { calc: () => r4(1 - (365 * 364 * 363 * 362) / 365 ** 4) }),
  FM(4, 'mixed: matrices', R`A $2\times2$ matrix has each entry chosen at random and independently from $\{0,1\}$. The probability that the matrix is invertible is`,
    (() => { let c = 0; for (let m = 0; m < 16; m++) { const [a, b, d, e] = [m & 1, (m >> 1) & 1, (m >> 2) & 1, (m >> 3) & 1]; if (a * e - b * d !== 0) c++; } return F(c, 16); })(), [F(1, 2), F(5, 16), F(7, 16)],
    R`<p>$\det=ae-bd$. It is non-zero when exactly one of $ae,bd$ equals 1: $ae=1$ needs $a=e=1$ (and then $bd=0$ in 3 of the 4 cases of $(b,d)$): 3 matrices; $bd=1$, $ae=0$: 3 matrices. Total 6 of 16, $P=\dfrac38$.</p>`, 'Both products equal to 1 gives determinant 0, not 2.'),
  FM(4, 'mixed: sequences', R`Three different numbers are chosen at random from $\{1,2,\dots,20\}$. The probability that they are in arithmetic progression (in some order) is`, F(90, 1140), [F(1, 19), F(9, 190), F(3, 20)],
    R`<p>An AP $a,m,c$ with $a<c$ has $m=\dfrac{a+c}2$, so $a$ and $c$ must have the same parity: $\binom{10}2+\binom{10}2=90$ pairs, each giving one AP set. Total $\binom{20}3=1140$. $P=\dfrac{90}{1140}=\dfrac3{38}$.</p>`, 'Count sets, not ordered triples, on both sides.'),
  FM(4, 'mixed: complex numbers', R`Two different fifth roots of unity are chosen at random. The probability that their sum is a real number is`, F(2, 10), [F(1, 10), F(2, 5), F(1, 2)],
    R`<p>$\omega^j+\omega^k$ is real only if their imaginary parts cancel, which means they are conjugates: $\{\omega,\omega^4\}$ and $\{\omega^2,\omega^3\}$. That is 2 of $\binom52=10$ pairs: $P=\dfrac15$. (The root 1 is real, but adding any other root leaves an imaginary part.)</p>`, 'Pairs with the real root 1 do not give real sums.'),
  N(5, 'expectation', R`A fair die is thrown repeatedly until every face from 1 to 6 has appeared at least once. Find the expected number of throws.`, 14.7, 0.01,
    R`<p>After $k$ different faces have appeared, the waiting time for a new face is geometric with mean $\dfrac6{6-k}$. So $E=6\left(\dfrac16+\dfrac15+\dfrac14+\dfrac13+\dfrac12+1\right)=1+1.2+1.5+2+3+6=14.7$.</p>`, 'Add the waiting times for the 1st, 2nd, ..., 6th new face.', { calc: () => 6 * (1 + 1 / 2 + 1 / 3 + 1 / 4 + 1 / 5 + 1 / 6) }),
  FM(4, 'counting', R`Three numbers are drawn at random without replacement from $\{1,2,\dots,10\}$. The probability that the middle (median) number is 5 is`, F(4 * 5, 120), [F(1, 4), F(1, 10), F(2, 9)],
    R`<p>One number below 5 (4 choices), 5 itself, one number above 5 (5 choices): $4\times5=20$ sets out of $\binom{10}3=120$. $P=\dfrac16$.</p>`, 'The median is the middle value of the three, so one is below and one above.'),
  FM(5, 'conditional probability', R`A family has two children. At least one is a boy born on a Tuesday. Assuming boys and girls and all weekdays are equally likely, the probability that both children are boys is`, F(13, 27), [F(1, 3), F(1, 2), F(7, 13)],
    R`<p>Count (child, day) pairs. Total ordered outcomes: $14^2=196$. At least one is a Tuesday boy: $196-13^2=27$. Both boys with at least one Tuesday boy: $7^2-6^2=13$. $P=\dfrac{13}{27}$.</p>`, 'The extra detail changes the answer from $\\frac13$.'),
];

// ================= templates =================
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });
const D3T = ' (3 decimal places)';
const D4T = ' (4 decimal places)';
/** mcq options from fractions: correct first, then the first three distinct wrong candidates */
const fracOpts = (rng, correct, cands) => {
  const seen = new Set([fr(correct)]); const w = [];
  for (const c of [...cands, F(1, 7), F(2, 7), F(3, 7), F(4, 7), F(5, 7), F(1, 11), F(2, 11)]) { if (c[0] <= 0 || c[1] <= 0) continue; const s = fr(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  return shuffleOpts(rng, fr(correct), w);
};
const pairsText = (list) => list.map(([a, b]) => `(${a},${b})`).join(', ');
const ordinal = (k) => `${k}${['th', 'st', 'nd', 'rd'][k % 100 > 10 && k % 100 < 14 ? 0 : k % 10 < 4 ? k % 10 : 0]}`;
const ptex = (a, b) => (b === 1 ? `${a}` : `\\dfrac{${a}}{${b}}`);
const cardOf = (i) => ({ rank: i % 13, suit: Math.floor(i / 13) });
const wordCache = {};
const wordPerms = (w) => (wordCache[w] ??= perms(w));

const gens = [
  // g01: one die
  gen('pb-g01', 1, 'mcq', 'single', 'classical probability', (rng) => {
    const v = int(rng, 0, 3), m = int(rng, 2, 3), k = int(rng, 2, 5);
    const evs = [
      { t: 'a prime number', f: (x) => [2, 3, 5].includes(x) },
      { t: `a multiple of ${m}`, f: (x) => x % m === 0 },
      { t: `a number greater than ${k}`, f: (x) => x > k },
      { t: `a number that is not a multiple of ${m}`, f: (x) => x % m !== 0 },
    ];
    const e = evs[v]; const fav = [1, 2, 3, 4, 5, 6].filter(e.f); const c = fav.length; const ans = F(c, 6);
    const { options, answer } = fracOpts(rng, ans, [F(6 - c, 6), F(c, 5), F(c + 1, 6), F(c - 1, 6), F(c, 7)]);
    return { v, m, k, options, answer, q: R`A fair die is rolled once. The probability of getting ${e.t} is`,
      sol: R`<p>Favourable numbers: ${fav.join(', ')}. That is ${c} outcomes out of 6, so $P=\dfrac{${c}}6=${T(ans)}$.</p>`, trap: 'Count the outcomes of the die, which has 6 equally likely faces.' };
  }, (p) => { const c = [() => 3, () => Math.floor(6 / p.m), () => 6 - p.k, () => 6 - Math.floor(6 / p.m)][p.v](); return p.options.indexOf(fr(F(c, 6))); }),

  // g02: two dice, count favourable of 36
  gen('pb-g02', 1, 'nat', 'integer', 'classical probability', (rng) => {
    const v = int(rng, 0, 3); let par, txt, f;
    if (v === 0) { par = int(rng, 3, 11); txt = `the sum is ${par}`; f = (a, b) => a + b === par; }
    else if (v === 1) { par = int(rng, 8, 11); txt = `the sum is at least ${par}`; f = (a, b) => a + b >= par; }
    else if (v === 2) { par = int(rng, 3, 5); txt = `the sum is divisible by ${par}`; f = (a, b) => (a + b) % par === 0; }
    else { par = int(rng, 0, 4); txt = par === 0 ? 'both numbers are equal' : `the two numbers differ by ${par}`; f = (a, b) => Math.abs(a - b) === par; }
    const fav = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (f(a, b)) fav.push([a, b]);
    return { v, par, answer: fav.length, tol: 0,
      q: R`Two fair dice are thrown. The probability that ${txt} is $\dfrac{N}{36}$. Find $N$.`,
      sol: R`<p>List the favourable ordered pairs: ${pairsText(fav)}. There are ${fav.length} of them out of 36, so $N=${fav.length}$.</p>`, trap: 'Order matters: (2,5) and (5,2) are different outcomes.' };
  }, (p) => { const w = (t) => 6 - Math.abs(t - 7); let s = 0; if (p.v === 0) s = w(p.par); else if (p.v === 1) for (let t = p.par; t <= 12; t++) s += w(t); else if (p.v === 2) for (let t = p.par; t <= 12; t += p.par) s += w(t); else s = p.par === 0 ? 6 : 2 * (6 - p.par); return s; }),

  // g03: cards, count of 52
  gen('pb-g03', 2, 'nat', 'integer', 'classical probability', (rng) => {
    const X = choose(rng, [{ n: 'a heart', f: (c) => c.suit === 0, s: 13 }, { n: 'a spade', f: (c) => c.suit === 3, s: 13 }, { n: 'a red card', f: (c) => c.suit < 2, s: 26 }, { n: 'a black card', f: (c) => c.suit >= 2, s: 26 }]);
    const Y = choose(rng, [{ n: 'a king', f: (c) => c.rank === 12, s: 4 }, { n: 'an ace', f: (c) => c.rank === 0, s: 4 }, { n: 'a face card', f: (c) => c.rank >= 10, s: 12 }]);
    const mode = int(rng, 0, 2);
    let count = 0; for (let i = 0; i < 52; i++) { const c = cardOf(i), a = X.f(c), b = Y.f(c); if (mode === 0 ? a || b : mode === 1 ? !a && !b : a && !b) count++; }
    const both = (() => { let n = 0; for (let i = 0; i < 52; i++) { const c = cardOf(i); if (X.f(c) && Y.f(c)) n++; } return n; })();
    const txt = mode === 0 ? `${X.n} or ${Y.n}` : mode === 1 ? `neither ${X.n} nor ${Y.n}` : `${X.n} but not ${Y.n}`;
    const sol = mode === 0 ? R`<p>$n(X\cup Y)=${X.s}+${Y.s}-${both}=${count}$ (subtract the cards that are both).</p>`
      : mode === 1 ? R`<p>Either: $${X.s}+${Y.s}-${both}=${X.s + Y.s - both}$ cards, so neither: $52-${X.s + Y.s - both}=${count}$.</p>`
        : R`<p>${X.n[0] === 'a' ? 'Those' : 'Those'} that are ${X.n}: ${X.s}; of these ${both} are also ${Y.n}. So $${X.s}-${both}=${count}$.</p>`;
    return { Xs: X.s, Ys: Y.s, both, mode, answer: count, tol: 0, q: R`One card is drawn from a pack of 52. The probability that it is ${txt} is $\dfrac{k}{52}$. Find $k$.`, sol, trap: 'Subtract the overlap once.' };
  }, (p) => (p.mode === 0 ? p.Xs + p.Ys - p.both : p.mode === 1 ? 52 - (p.Xs + p.Ys - p.both) : p.Xs - p.both)),

  // g04: Venn regions with given probabilities
  gen('pb-g04', 2, 'nat', 'numeric', 'addition rule', (rng) => {
    const ia = int(rng, 30, 70), ib = int(rng, 30, 70); const lo = Math.max(5, ia + ib - 95), hi = Math.min(ia, ib) - 5; const ii = int(rng, lo, hi);
    const v = int(rng, 0, 3);
    const un = ia + ib - ii; const val = [un, 100 - un, ia + ib - 2 * ii, ia - ii][v];
    const ask = ['P(A\\cup B)', "P(A'\\cap B')", 'the probability that exactly one of $A,B$ occurs', "P(A\\cap B')"][v];
    const sol = [R`<p>$P(A\cup B)=${ia / 100}+${ib / 100}-${ii / 100}=${un / 100}$.</p>`,
      R`<p>$P(A\cup B)=${ia / 100}+${ib / 100}-${ii / 100}=${un / 100}$. Neither means the complement: $1-${un / 100}=${(100 - un) / 100}$.</p>`,
      R`<p>Exactly one $=P(A)+P(B)-2P(A\cap B)=${ia / 100}+${ib / 100}-2(${ii / 100})=${(ia + ib - 2 * ii) / 100}$.</p>`,
      R`<p>$P(A\cap B')=P(A)-P(A\cap B)=${ia / 100}-${ii / 100}=${(ia - ii) / 100}$.</p>`][v];
    return { ia, ib, ii, v, answer: val / 100, tol: 0.001,
      q: R`For events $A,B$: $P(A)=${ia / 100}$, $P(B)=${ib / 100}$ and $P(A\cap B)=${ii / 100}$. Find ${v === 2 ? ask : `$${ask}$`}.`, sol, trap: 'Draw the two overlapping circles and fill in the four regions.' };
  }, (p) => { const onlyA = p.ia - p.ii, onlyB = p.ib - p.ii, neither = 100 - onlyA - onlyB - p.ii; return [onlyA + onlyB + p.ii, neither, onlyA + onlyB, onlyA][p.v] / 100; }),

  // g05: urn, two balls without replacement
  gen('pb-g05', 2, 'nat', 'numeric', 'sampling without replacement', (rng) => {
    const r = int(rng, 3, 7), b = int(rng, 2, 6), n = r + b, tot = C(n, 2), v = int(rng, 0, 3);
    const fav = [C(r, 2), C(r, 2) + C(b, 2), r * b, tot - C(b, 2)][v];
    const txt = ['both are red', 'both are of the same colour', 'they are of different colours', 'at least one is red'][v];
    const sol = [R`<p>$\dfrac{\binom{${r}}2}{\binom{${n}}2}=\dfrac{${C(r, 2)}}{${tot}}$.</p>`, R`<p>$\dfrac{\binom{${r}}2+\binom{${b}}2}{\binom{${n}}2}=\dfrac{${C(r, 2)}+${C(b, 2)}}{${tot}}$.</p>`, R`<p>One red and one blue: $${r}\times${b}=${r * b}$ pairs out of $\binom{${n}}2=${tot}$.</p>`, R`<p>Complement of "both blue": $1-\dfrac{\binom{${b}}2}{\binom{${n}}2}=\dfrac{${tot}-${C(b, 2)}}{${tot}}$.</p>`][v];
    return { r, b, v, answer: r3(fav / tot), tol: 0.001,
      q: R`A bag holds ${r} red and ${b} blue balls. Two balls are drawn together at random. Find the probability that ${txt}.${D3T}`,
      sol: sol + R`<p>So $P=\dfrac{${fav}}{${tot}}\approx${r3(fav / tot)}$.</p>`, trap: 'Two drawn together means unordered pairs: use combinations in both top and bottom.' };
  }, (p) => { const col = [...Array(p.r).fill(1), ...Array(p.b).fill(0)]; let t = 0, f = 0; for (let i = 0; i < col.length; i++) for (let j = i + 1; j < col.length; j++) { t++; const a = col[i], c = col[j]; if ([a && c, a === c, a !== c, a || c][p.v]) f++; } return r3(f / t); }),

  // g06: independent events
  gen('pb-g06', 2, 'nat', 'numeric', 'independent events', (rng) => {
    const a = int(rng, 2, 8), b = int(rng, 2, 8), v = int(rng, 0, 3);
    const val = [10 * a + 10 * b - a * b, (10 - a) * (10 - b), a * (10 - b) + b * (10 - a), a * (10 - b)][v];
    const ask = ['at least one of them occurs', 'neither occurs', 'exactly one of them occurs', 'A occurs but B does not'][v];
    const sol = [R`<p>$P(A\cup B)=P(A)+P(B)-P(A)P(B)=${a / 10}+${b / 10}-${(a * b) / 100}=${val / 100}$.</p>`, R`<p>$P(A')P(B')=${(10 - a) / 10}\times${(10 - b) / 10}=${val / 100}$.</p>`, R`<p>$P(A)P(B')+P(A')P(B)=${a / 10}\times${(10 - b) / 10}+${(10 - a) / 10}\times${b / 10}=${val / 100}$.</p>`, R`<p>$P(A)P(B')=${a / 10}\times${(10 - b) / 10}=${val / 100}$.</p>`][v];
    return { a, b, v, answer: val / 100, tol: 0.001, q: R`$A$ and $B$ are independent events with $P(A)=${a / 10}$ and $P(B)=${b / 10}$. Find the probability that ${ask}.`, sol, trap: 'For independent events the complements are independent too.' };
  }, (p) => { const pa = p.a / 10, pb = p.b / 10; const cells = [pa * pb, pa * (1 - pb), (1 - pa) * pb, (1 - pa) * (1 - pb)]; return +[cells[0] + cells[1] + cells[2], cells[3], cells[1] + cells[2], cells[1]][p.v].toFixed(4); }),

  // g07: committees
  gen('pb-g07', 2, 'nat', 'numeric', 'selection', (rng) => {
    const m = int(rng, 3, 7), w = int(rng, 2, 5), n = m + w, k = int(rng, 2, 4), v = int(rng, 0, 2), j = int(rng, 1, Math.min(k, w));
    const tot = C(n, k); const fav = [tot - C(m, k), C(w, j) * C(m, k - j), tot - C(m, k) - C(w, k)][v];
    const txt = [`at least one woman`, `exactly ${j} ${j === 1 ? 'woman' : 'women'}`, 'at least one man and at least one woman'][v];
    const sol = [R`<p>Complement "no woman": $\binom{${m}}{${k}}=${C(m, k)}$. Favourable $=\binom{${n}}{${k}}-${C(m, k)}=${tot}-${C(m, k)}=${fav}$.</p>`, R`<p>$\binom{${w}}{${j}}\binom{${m}}{${k - j}}=${C(w, j)}\times${C(m, k - j)}=${fav}$.</p>`, R`<p>Remove all-men ($${C(m, k)}$) and all-women ($${C(w, k)}$) committees from $${tot}$: $${fav}$.</p>`][v];
    return { m, w, k, v, j, answer: r3(fav / tot), tol: 0.001, q: R`A committee of ${k} is chosen at random from ${m} men and ${w} women. Find the probability that it has ${txt}.${D3T}`,
      sol: sol + R`<p>Total ways $\binom{${n}}{${k}}=${tot}$, so $P=\dfrac{${fav}}{${tot}}\approx${r3(fav / tot)}$.</p>`, trap: 'Use combinations: the order in a committee does not matter.' };
  }, (p) => { const n = p.m + p.w; let t = 0, f = 0; for (let mask = 0; mask < 1 << n; mask++) { let bits = 0, wom = 0; for (let i = 0; i < n; i++) if (mask >> i & 1) { bits++; if (i < p.w) wom++; } if (bits !== p.k) continue; t++; if ([wom >= 1, wom === p.j, wom >= 1 && wom < p.k][p.v]) f++; } return r3(f / t); }),

  // g08: conditional probability with two dice
  gen('pb-g08', 3, 'nat', 'numeric', 'conditional probability', (rng) => {
    const v = int(rng, 0, 3); const all = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) all.push([a, b]);
    let par = 0, par2 = 0, cond, ev, qtext, trap;
    if (v === 0) { par = int(rng, 1, 5); par2 = int(rng, par + 1, par + 6); cond = (x) => x[0] === par; ev = (x) => x[0] + x[1] >= par2; qtext = `the sum is at least ${par2}, given that the first die shows ${par}`; }
    else if (v === 1) { par = int(rng, 3, 9); cond = (x) => x[0] !== x[1]; ev = (x) => x[0] + x[1] === par; qtext = `the sum is ${par}, given that the two numbers are different`; }
    else if (v === 2) { par = int(rng, 7, 10); cond = (x) => x[0] + x[1] >= par; ev = (x) => x[0] === 6 || x[1] === 6; qtext = `at least one die shows 6, given that the sum is at least ${par}`; }
    else { par = int(rng, 4, 10); cond = (x) => x[0] % 2 === 0 || x[1] % 2 === 0; ev = (x) => x[0] + x[1] === par; qtext = `the sum is ${par}, given that at least one die shows an even number`; }
    const cs = all.filter(cond), es = cs.filter(ev);
    return { v, par, par2, answer: r3(es.length / cs.length), tol: 0.001,
      q: R`Two fair dice are thrown. Find the probability that ${qtext}.${D3T}`,
      sol: R`<p>Shrink the sample space to the cases where the condition holds: ${cs.length} outcomes. Among them the event holds in ${es.length}. $P=\dfrac{${es.length}}{${cs.length}}\approx${r3(es.length / cs.length)}$.</p>`, trap: 'The denominator is the number of outcomes in the given condition, not 36.' };
  }, (p) => { const c = [ (a, b) => a === p.par, (a, b) => a !== b, (a, b) => a + b >= p.par, (a, b) => a % 2 === 0 || b % 2 === 0][p.v]; const e = [(a, b) => a + b >= p.par2, (a, b) => a + b === p.par, (a, b) => a === 6 || b === 6, (a, b) => a + b === p.par][p.v]; const pb = dice2(c), pab = dice2((a, b) => c(a, b) && e(a, b)); return r3(pab / pb); }),

  // g09: total probability, three machines
  gen('pb-g09', 3, 'nat', 'numeric', 'total probability', (rng) => {
    const sh = choose(rng, [[50, 30, 20], [40, 35, 25], [60, 30, 10], [45, 35, 20], [50, 25, 25]]); const d = [int(rng, 1, 6), int(rng, 2, 7), int(rng, 3, 9)];
    const D = sh[0] * d[0] + sh[1] * d[1] + sh[2] * d[2]; const v = int(rng, 0, 2), j = int(rng, 0, 2);
    const val = [D / 10000, 1 - D / 10000, (sh[j] * d[j]) / 10000][v];
    const ask = ['it is defective', 'it is not defective', `it is made by machine ${j + 1} and is defective`][v];
    const sol = [R`<p>$P(D)=\sum P(M_i)P(D\mid M_i)=${sh[0] / 100}(${d[0] / 100})+${sh[1] / 100}(${d[1] / 100})+${sh[2] / 100}(${d[2] / 100})=${r4(D / 10000)}$.</p>`,
      R`<p>First $P(D)=${sh[0] / 100}(${d[0] / 100})+${sh[1] / 100}(${d[1] / 100})+${sh[2] / 100}(${d[2] / 100})=${r4(D / 10000)}$. Then $P(D')=1-${r4(D / 10000)}=${r4(1 - D / 10000)}$.</p>`,
      R`<p>Multiplication rule: $P(M_${j + 1})P(D\mid M_${j + 1})=${sh[j] / 100}\times${d[j] / 100}=${r4((sh[j] * d[j]) / 10000)}$.</p>`][v];
    return { sh, d, v, j, answer: r4(val), tol: 0.0005,
      q: R`A factory has three machines (1, 2, 3) making ${sh[0]}%, ${sh[1]}% and ${sh[2]}% of its items. The machines produce ${d[0]}%, ${d[1]}% and ${d[2]}% defective items. An item is picked at random. Find the probability that ${ask}.${D4T}`,
      sol, trap: 'Weight each defect rate by the machine\'s share.' };
  }, (p) => { const units = []; for (let m = 0; m < 3; m++) for (let u = 0; u < p.sh[m] * 100; u++) units.push([m, u < p.sh[m] * p.d[m]]); let f = 0; for (const [m, bad] of units) { if ([bad, !bad, bad && m === p.j][p.v]) f++; } return r4(f / units.length); }),

  // g10: Bayes, three machines
  gen('pb-g10', 3, 'nat', 'numeric', 'Bayes theorem', (rng) => {
    const sh = choose(rng, [[50, 30, 20], [40, 35, 25], [60, 30, 10], [45, 35, 20], [50, 25, 25]]); const d = [int(rng, 1, 6), int(rng, 2, 7), int(rng, 3, 9)];
    const j = int(rng, 0, 2); const D = sh[0] * d[0] + sh[1] * d[1] + sh[2] * d[2]; const num = sh[j] * d[j];
    return { sh, d, j, answer: r3(num / D), tol: 0.001,
      q: R`A factory has three machines (1, 2, 3) making ${sh[0]}%, ${sh[1]}% and ${sh[2]}% of its items. The machines produce ${d[0]}%, ${d[1]}% and ${d[2]}% defective items. A defective item is found. Find the probability that it was made by machine ${j + 1}.${D3T}`,
      sol: R`<p>Use Bayes. $P(M_${j + 1}\mid D)=\dfrac{${sh[j] / 100}\times${d[j] / 100}}{${sh[0] / 100}(${d[0] / 100})+${sh[1] / 100}(${d[1] / 100})+${sh[2] / 100}(${d[2] / 100})}=\dfrac{${num}}{${D}}\approx${r3(num / D)}$ (both over $10^4$).</p>`, trap: 'The denominator is the total defective probability, not 1.' };
  }, (p) => { const cnt = [0, 0, 0]; for (let m = 0; m < 3; m++) cnt[m] = (p.sh[m] * 100 * p.d[m]) / 100; return r3(cnt[p.j] / (cnt[0] + cnt[1] + cnt[2])); }),

  // g11: binomial probabilities
  gen('pb-g11', 3, 'nat', 'numeric', 'binomial distribution', (rng) => {
    const n = int(rng, 4, 8), k = int(rng, 1, n - 1), p = choose(rng, [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]), v = int(rng, 0, 2);
    let val = 0; const lo = v === 0 ? k : v === 1 ? 0 : k, hi = v === 0 ? k : v === 1 ? k : n;
    for (let j = lo; j <= hi; j++) val += binom(n, j, p);
    const txt = ['$P(X=' + k + ')$', '$P(X\\le' + k + ')$', '$P(X\\ge' + k + ')$'][v];
    const terms = []; for (let j = lo; j <= hi; j++) terms.push(R`\binom{${n}}{${j}}(${p})^{${j}}(${r4(1 - p)})^{${n - j}}`);
    return { n, k, p, v, answer: r4(val), tol: 0.0005, q: R`$X\sim B(${n},${p})$. Find ${txt}.${D4T}`,
      sol: R`<p>${v === 0 ? '' : 'Add the individual terms. '}$P=${terms.join('+')}\approx${r4(val)}$.</p>`, trap: v === 0 ? 'Failures carry the power $n-k$.' : 'Check which end is included: "at most" runs from 0, "at least" up to $n$.' };
  }, (p) => { let s = 0; for (let mask = 0; mask < 1 << p.n; mask++) { let h = 0; for (let i = 0; i < p.n; i++) h += (mask >> i) & 1; if ([h === p.k, h <= p.k, h >= p.k][p.v]) s += p.p ** h * (1 - p.p) ** (p.n - h); } return r4(s); }),

  // g12: at least / at most
  gen('pb-g12', 3, 'nat', 'numeric', 'binomial distribution', (rng) => {
    const n = int(rng, 3, 6), p = choose(rng, [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]), v = int(rng, 0, 2);
    const val = v === 0 ? 1 - (1 - p) ** n : v === 1 ? 1 - (1 - p) ** n - n * p * (1 - p) ** (n - 1) : (1 - p) ** n + n * p * (1 - p) ** (n - 1);
    const txt = ['at least one', 'at least two', 'at most one'][v];
    const sol = [R`<p>$1-(1-p)^n=1-${r4((1 - p) ** n)}$.</p>`, R`<p>$1-P(0)-P(1)=1-${r4((1 - p) ** n)}-${r4(n * p * (1 - p) ** (n - 1))}$.</p>`, R`<p>$P(0)+P(1)=${r4((1 - p) ** n)}+${r4(n * p * (1 - p) ** (n - 1))}$.</p>`][v];
    return { n, p, v, answer: r3(val), tol: 0.001, q: R`A basketball player scores each shot with probability ${p}, independently. In ${n} shots, find the probability that she scores ${txt}.${D3T}`,
      sol: sol + R`<p>So the probability is about $${r3(val)}$.</p>`, trap: 'Use the complement for "at least".' };
  }, (p) => { let s = 0; for (let mask = 0; mask < 1 << p.n; mask++) { let h = 0; for (let i = 0; i < p.n; i++) h += (mask >> i) & 1; const pr = p.p ** h * (1 - p.p) ** (p.n - h); if ([h >= 1, h >= 2, h <= 1][p.v]) s += pr; } return r3(s); }),

  // g13: least number of trials
  gen('pb-g13', 3, 'nat', 'integer', 'binomial distribution', (rng) => {
    let pr, pt, thr, n; const v = int(rng, 0, 1);
    const prob = (m, pp) => (v === 0 ? 1 - (1 - pp) ** m : 1 - (1 - pp) ** m - m * pp * (1 - pp) ** (m - 1));
    do { [pr, pt] = choose(rng, [[0.5, '\\dfrac12'], [1 / 3, '\\dfrac13'], [0.25, '\\dfrac14'], [0.2, '\\dfrac15'], [1 / 6, '\\dfrac16'], [0.1, '0.1']]); thr = choose(rng, v === 0 ? [0.9, 0.95, 0.99] : [0.8, 0.9, 0.95]);
      n = 1; while (prob(n, pr) <= thr) n++; } while (Math.abs(prob(n, pr) - thr) < 1e-6 || Math.abs(prob(n - 1, pr) - thr) < 1e-6);
    return { pr, thr, v, answer: n, tol: 0,
      q: R`A trial succeeds with probability $${pt}$. What is the least number of independent trials needed so that the probability of at least ${v === 0 ? 'one success' : 'two successes'} exceeds ${thr}?`,
      sol: v === 0 ? R`<p>We need $1-(1-p)^n>${thr}$, i.e. $(1-p)^n<${r4(1 - thr)}$ with $1-p=${r4(1 - pr)}$. At $n=${n - 1}$: $${r4((1 - pr) ** (n - 1))}$ is too big; at $n=${n}$: $${r4((1 - pr) ** n)}$ works. So $n=${n}$.</p>`
        : R`<p>We need $1-q^n-npq^{n-1}>${thr}$ with $p=${r4(pr)}$. At $n=${n - 1}$ the value is $${r4(prob(n - 1, pr))}$ (too small); at $n=${n}$ it is $${r4(prob(n, pr))}$ (enough). So $n=${n}$.</p>`, trap: 'Test the value just below your answer; the inequality is strict.' };
  }, (p) => { let m = 1; const f = (k) => (p.v === 0 ? 1 - Math.pow(1 - p.pr, k) : 1 - Math.pow(1 - p.pr, k) - k * p.pr * Math.pow(1 - p.pr, k - 1)); while (f(m) <= p.thr) m++; return m; }),

  // g14: distribution with constant k, find mean
  gen('pb-g14', 2, 'nat', 'numeric', 'mean', (rng) => {
    const v = int(rng, 0, 3), start = int(rng, 0, 1); const xs = [start, start + 1, start + 2, start + 3];
    const fn = [(x) => x, (x) => x + 1, (x) => x * x, (x) => 5 - x][v]; const ft = ['kx', 'k(x+1)', 'kx^2', 'k(5-x)'][v];
    const w = xs.map(fn); const S = w.reduce((a, b) => a + b, 0); if (S === 0) return gens[13].make(rng);
    const E = xs.reduce((s, x, i) => s + (x * w[i]) / S, 0);
    return { v, xs, S, answer: r3(E), tol: 0.001, q: R`A random variable $X$ takes the values ${xs.join(', ')} with $P(X=x)=${ft}$. Find $E(X)$.${D3T}`,
      sol: R`<p>The weights are ${w.join(', ')}, adding to ${S}, so $k=\dfrac1{${S}}$. $E(X)=\dfrac{${xs.map((x, i) => `${x}\\cdot${w[i]}`).join('+')}}{${S}}=\dfrac{${xs.reduce((s, x, i) => s + x * w[i], 0)}}{${S}}\approx${r3(E)}$.</p>`, trap: 'Find $k$ from "total probability is 1" before the mean.' };
  }, (p) => { const wts = p.xs.map((x) => [(y) => y, (y) => y + 1, (y) => y * y, (y) => 5 - y][p.v](x)); const tot = wts.reduce((a, b) => a + b, 0); let e = 0; p.xs.forEach((x, i) => { e += x * (wts[i] / tot); }); return r3(e); }),

  // g15: variance of a table; related quantities
  gen('pb-g15', 3, 'nat', 'numeric', 'variance', (rng) => {
    const xs = choose(rng, [[0, 1, 2, 3], [1, 2, 3, 4], [2, 4, 6, 8], [1, 3, 5, 7]]); let ps; const v = int(rng, 0, 2), A_ = int(rng, 2, 4), B_ = int(rng, 1, 5);
    do { const a = int(rng, 10, 40), b = int(rng, 10, 40), c = int(rng, 10, 40); ps = [a, b, c, 100 - a - b - c]; } while (ps[3] < 5);
    const mu = xs.reduce((s, x, i) => s + (x * ps[i]) / 100, 0), m2 = xs.reduce((s, x, i) => s + (x * x * ps[i]) / 100, 0);
    const V = m2 - mu * mu; const val = [V, m2, A_ * A_ * V][v];
    const ask = ['its variance', 'the value of $E(X^2)$', `the variance of $${A_}X+${B_}$`][v];
    const sol = [R`<p>$E(X)=${r4(mu)}$. $E(X^2)=${r4(m2)}$. $\mathrm{Var}=E(X^2)-[E(X)]^2=${r4(m2)}-${r4(mu * mu)}=${r3(V)}$.</p>`, R`<p>$E(X^2)=\sum x^2p=${xs.map((x, i) => `${x * x}(${ps[i] / 100})`).join('+')}=${r4(m2)}$.</p>`,
      R`<p>First $\mathrm{Var}(X)=E(X^2)-[E(X)]^2=${r4(m2)}-${r4(mu * mu)}=${r4(V)}$. Adding ${B_} does not change the spread, and multiplying by ${A_} multiplies the variance by $${A_}^2=${A_ * A_}$. Answer $${A_ * A_}\times${r4(V)}=${r3(val)}$.</p>`][v];
    return { xs, ps, v, A_, answer: r3(val), tol: 0.002,
      q: R`A random variable takes the values ${xs.join(', ')} with probabilities ${ps.map((x) => x / 100).join(', ')}. Find ${ask}.${D3T}`, sol, trap: v === 2 ? 'Adding a constant changes the mean but not the variance; the multiplier is squared.' : 'Do not forget to square the mean in the last step.' };
  }, (p) => { const mu = p.xs.reduce((s, x, i) => s + (x * p.ps[i]) / 100, 0); const vr = p.xs.reduce((s, x, i) => s + (p.ps[i] / 100) * (x - mu) ** 2, 0); const m2 = vr + mu * mu; return r3([vr, m2, p.A_ * p.A_ * vr][p.v]); }),

  // g16: binomial mean and variance
  gen('pb-g16', 3, 'nat', 'integer', 'binomial mean and variance', (rng) => {
    const v = int(rng, 0, 1);
    if (v === 0) {
      const p = choose(rng, [0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]), n = choose(rng, [8, 10, 12, 16, 20, 24, 30, 40]); const mean = +(n * p).toFixed(4), vr = +(n * p * (1 - p)).toFixed(4);
      return { n, p, mean, vr, v, answer: n, tol: 0, q: R`A binomial distribution has mean ${mean} and variance ${vr}. Find the number of trials $n$.`,
        sol: R`<p>$q=\dfrac{\text{variance}}{\text{mean}}=\dfrac{${vr}}{${mean}}=${r4(vr / mean)}$, so $p=${r4(1 - vr / mean)}$. Then $n=\dfrac{\text{mean}}p=\dfrac{${mean}}{${r4(1 - vr / mean)}}=${n}$.</p>`, trap: 'Divide variance by mean to get $q$, not $p$.' };
    }
    const [qa, qb] = choose(rng, [[3, 4], [2, 3], [4, 5], [3, 5], [1, 2]]); const n = qb * choose(rng, [4, 6, 8, 10]); const mean = (n * (qb - qa)) / qb;
    return { n, qa, qb, mean, v, answer: n, tol: 0, q: R`The variance of a binomial distribution is $\dfrac{${qa}}{${qb}}$ of its mean, and the mean is ${mean}. Find $n$.`,
      sol: R`<p>$\dfrac{npq}{np}=q=\dfrac{${qa}}{${qb}}$, so $p=1-q=\dfrac{${qb - qa}}{${qb}}$. Then $n=\dfrac{\text{mean}}p=\dfrac{${mean}}{${qb - qa}/${qb}}=${n}$.</p>`, trap: 'The ratio variance : mean is $q$.' };
  }, (p) => { if (p.v === 0) return Math.round((p.mean * p.mean) / (p.mean - p.vr)); const q = p.qa / p.qb; return Math.round(p.mean / (1 - q)); }),

  // g17: geometric trials
  gen('pb-g17', 4, 'nat', 'numeric', 'geometric trials', (rng) => {
    const [a, b] = choose(rng, [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6]]); const p = a / b, q = 1 - p; const k = int(rng, 3, 6), v = int(rng, 0, 4);
    const val = [q ** (k - 1) * p, 1 - q ** k, q ** k, q / (1 + q), 1 / (1 + q)][v];
    const txt = [`exactly on trial ${k}`, `within the first ${k} trials`, `after more than ${k} trials`, 'on an even-numbered trial', 'on an odd-numbered trial'][v];
    const sol = [R`<p>$q^{${k - 1}}p=\left(${ptex(b - a, b)}\right)^{${k - 1}}\cdot${ptex(a, b)}=${r4(val)}$.</p>`, R`<p>$1-q^{${k}}=1-${r4(q ** k)}=${r4(val)}$.</p>`, R`<p>The first ${k} trials all fail: $q^{${k}}=${r4(val)}$.</p>`, R`<p>$\sum q^{2j-1}p=\dfrac{qp}{1-q^2}=\dfrac q{1+q}=${r4(val)}$.</p>`, R`<p>$\sum q^{2j}p=\dfrac p{1-q^2}=\dfrac1{1+q}=${r4(val)}$.</p>`][v];
    return { p, k, v, answer: r4(val), tol: 0.0005, q: R`A trial succeeds with probability $${ptex(a, b)}$ and trials are repeated independently until the first success. Find the probability that the first success comes ${txt}.${D4T}`, sol, trap: 'The first success on trial $k$ needs $k-1$ failures first.' };
  }, (p) => { let s = 0; const q = 1 - p.p; for (let t = 1; t <= 5000; t++) { const pr = q ** (t - 1) * p.p; if ([t === p.k, t <= p.k, t > p.k, t % 2 === 0, t % 2 === 1][p.v]) s += pr; } return r4(s); }),

  // g18: alternating game
  gen('pb-g18', 4, 'nat', 'numeric', 'games', (rng) => {
    const [a1, a2] = choose(rng, [[1, 6], [1, 4], [1, 3], [1, 2]]), [b1, b2] = choose(rng, [[1, 6], [1, 5], [1, 4], [1, 3], [1, 2]]); const a = a1 / a2, b = b1 / b2; const v = int(rng, 0, 1);
    const den = 1 - (1 - a) * (1 - b); const val = v === 0 ? a / den : ((1 - a) * b) / den;
    return { a, b, v, answer: r4(val), tol: 0.0005,
      q: R`A and B take turns, A first. On each turn A succeeds with probability $${ptex(a1, a2)}$ and B with probability $${ptex(b1, b2)}$. The first to succeed wins. Find the probability that ${v === 0 ? 'A' : 'B'} wins.${D4T}`,
      sol: R`<p>One full round (A fails, B fails) has probability $(1-a)(1-b)=${r4((1 - a) * (1 - b))}$. ${v === 0 ? R`$P(A)=\dfrac a{1-(1-a)(1-b)}=\dfrac{${r4(a)}}{${r4(den)}}$` : R`$P(B)=\dfrac{(1-a)b}{1-(1-a)(1-b)}=\dfrac{${r4((1 - a) * b)}}{${r4(den)}}$`}, which is $${r4(val)}$.</p>`, trap: 'The common ratio of the series is a whole round, not one turn.' };
  }, (p) => { let s = 0, alive = 1; for (let i = 0; i < 4000; i++) { s += p.v === 0 ? alive * p.a : alive * (1 - p.a) * p.b; alive *= (1 - p.a) * (1 - p.b); } return r4(s); }),

  // g19: three dice counts
  gen('pb-g19', 3, 'nat', 'integer', 'classical probability', (rng) => {
    const v = int(rng, 0, 2), s = v === 0 ? int(rng, 5, 16) : int(rng, 13, 17); const f = [(a, b, c) => a + b + c === s, (a, b, c) => a + b + c >= s, (a, b, c) => (a + b + c) % 5 === 0][v];
    const cnt = dice3(f); const per = (t) => dice3((a, b, c) => a + b + c === t);
    const txt = [`the sum is ${s}`, `the sum is at least ${s}`, 'the sum is a multiple of 5'][v];
    const sol = [R`<p>Count solutions of $a+b+c=${s}$ with $1\le a,b,c\le6$ by inclusion-exclusion. All positive solutions: $\binom{${s - 1}}{2}=${C(s - 1, 2)}$. Subtract those with some number at least 7: $3\binom{${s - 7}}{2}=${3 * C(s - 7, 2)}$. Add back two numbers at least 7: $3\binom{${s - 13}}{2}=${3 * C(s - 13, 2)}$. So $N=${cnt}$.</p>`,
      R`<p>By symmetry, the number of outcomes with sum $t$ equals that with sum $21-t$. Sums from ${s} to 18 have counts ${[...Array(19 - s).keys()].map((i) => per(s + i)).join(', ')}, which add to $${cnt}$.</p>`,
      R`<p>Possible sums: 5, 10, 15. Their counts are ${per(5)}, ${per(10)} and ${per(15)}. Total $N=${cnt}$.</p>`][v];
    return { s, v, answer: cnt, tol: 0, q: R`Three fair dice are thrown. The probability that ${txt} is $\dfrac{N}{216}$. Find $N$.`, sol, trap: 'The sums of three dice are symmetric about 10.5: sums $t$ and $21-t$ are equally likely.' };
  }, (p) => { let n = 0; for (let t = 0; t < 216; t++) { const sum = (t % 6) + 1 + (Math.floor(t / 6) % 6) + 1 + Math.floor(t / 36) + 1; if ([sum === p.s, sum >= p.s, sum % 5 === 0][p.v]) n++; } return n; }),

  // g20: two cards without replacement
  gen('pb-g20', 4, 'nat', 'numeric', 'sampling without replacement', (rng) => {
    const v = int(rng, 0, 3); const fav = [12 / 51, 25 / 51, (12 * 11) / (52 * 51), 3 / 51][v]; const txt = ['are of the same suit', 'are of the same colour', 'are both face cards (J, Q, K)', 'have the same rank'][v];
    const sol = [R`<p>Whatever the first card is, 12 of the remaining 51 cards share its suit: $\dfrac{12}{51}$.</p>`, R`<p>Whatever the first card is, 25 of the remaining 51 cards have its colour: $\dfrac{25}{51}$.</p>`, R`<p>$\dfrac{12}{52}\cdot\dfrac{11}{51}=\dfrac{132}{2652}$.</p>`, R`<p>Whatever the first card is, 3 of the remaining 51 cards share its rank: $\dfrac3{51}$.</p>`][v];
    return { v, answer: r4(fav), tol: 0.0005, q: R`Two cards are drawn one after another, without replacement, from a pack of 52. Find the probability that they ${txt}.${D4T}`, sol: sol + R`<p>$P\approx${r4(fav)}$.</p>`, trap: 'The second draw is made from 51 cards.' };
  }, (p) => { let t = 0, f = 0; for (let i = 0; i < 52; i++) for (let j = 0; j < 52; j++) { if (i === j) continue; t++; const a = cardOf(i), b = cardOf(j); if ([a.suit === b.suit, (a.suit < 2) === (b.suit < 2), a.rank >= 10 && b.rank >= 10, a.rank === b.rank][p.v]) f++; } return r4(f / t); }),

  // g21: most likely value
  gen('pb-g21', 3, 'nat', 'integer', 'binomial distribution', (rng) => {
    const v = int(rng, 0, 1); let n, p;
    if (v === 0) { do { n = int(rng, 10, 30); p = int(rng, 1, 9) / 10; } while (Math.abs((n + 1) * p - Math.round((n + 1) * p)) < 1e-9);
      const m = Math.floor((n + 1) * p + 1e-9);
      return { n, p, v, answer: m, tol: 0, q: R`For $X\sim B(${n},${p})$, find the most likely value of $X$ (the mode).`,
        sol: R`<p>The mode is $\lfloor(n+1)p\rfloor=\lfloor${n + 1}\times${p}\rfloor=\lfloor${r4((n + 1) * p)}\rfloor=${m}$. (When $(n+1)p$ is not a whole number the mode is unique.)</p>`, trap: 'The rule uses $n+1$, not $n$.' }; }
    do { n = int(rng, 9, 29); p = choose(rng, [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8]); } while (Math.abs((n + 1) * p - Math.round((n + 1) * p)) > 1e-9 || Math.round((n + 1) * p) < 1 || Math.round((n + 1) * p) > n);
    const m = Math.round((n + 1) * p);
    return { n, p, v, answer: 2 * m - 1, tol: 0, q: R`For $X\sim B(${n},${p})$ the probability $P(X=k)$ is largest at two values of $k$. Find the sum of these two values.`,
      sol: R`<p>$(n+1)p=${n + 1}\times${p}=${m}$ is a whole number, so $P(X=${m - 1})=P(X=${m})$ and these two are the most likely values. Their sum is $${m - 1}+${m}=${2 * m - 1}$.</p>`, trap: 'When $(n+1)p$ is an integer $m$, the modes are $m-1$ and $m$.' };
  }, (p) => { const vals = []; for (let k = 0; k <= p.n; k++) vals.push(binom(p.n, k, p.p)); const mx = Math.max(...vals); const ks = vals.map((x, k) => (Math.abs(x - mx) < 1e-12 ? k : -1)).filter((k) => k >= 0); return p.v === 0 ? ks[0] : ks.reduce((a, b) => a + b, 0); }),

  // g22: tests and Bayes
  gen('pb-g22', 4, 'nat', 'numeric', 'Bayes theorem', (rng) => {
    const pi = choose(rng, [1, 2, 5]), se = choose(rng, [90, 95, 98]), fp = choose(rng, [2, 5, 10]); const v = int(rng, 0, 2);
    const tp = pi * se, fpn = (100 - pi) * fp; const tn = (100 - pi) * (100 - fp), fn = pi * (100 - se);
    const val = [tp / (tp + fpn), tn / (tn + fn), (tp + fpn) / 10000][v];
    const ask = ['a person tests positive. Find the probability that the person has the disease', 'a person tests negative. Find the probability that the person does not have the disease', 'a person is picked at random. Find the probability that the test is positive'][v];
    const sol = [R`<p>Think of 10 000 people. Ill and positive: ${tp} people (${pi} percent are ill, and ${se} percent of those test positive). Healthy and positive: ${fpn} people. $P=\dfrac{${tp}}{${tp}+${fpn}}\approx${r3(val)}$.</p>`,
      R`<p>Healthy and negative: $${100 - pi}\%\times${100 - fp}\%$, proportional to ${tn}. Ill and negative: $${pi}\%\times${100 - se}\%$, proportional to ${fn}. $P=\dfrac{${tn}}{${tn}+${fn}}\approx${r3(val)}$.</p>`,
      R`<p>Total probability: $${pi / 100}\times${se / 100}+${(100 - pi) / 100}\times${fp / 100}=${r4(tp / 10000)}+${r4(fpn / 10000)}=${r4(val)}$.</p>`][v];
    return { pi, se, fp, v, answer: r3(val), tol: 0.001, q: R`${pi}% of a population has a disease. A test is positive for ${se}% of people who have it and for ${fp}% of people who do not. Suppose ${ask}.${D3T}`, sol, trap: 'The healthy group is much bigger, so its false positives matter.' };
  }, (p) => { const N = 1e6; const sick = (N * p.pi) / 100, healthy = N - sick; const a = (sick * p.se) / 100, b = (healthy * p.fp) / 100, c = (sick * (100 - p.se)) / 100, d = (healthy * (100 - p.fp)) / 100; return r3([a / (a + b), d / (c + d), (a + b) / N][p.v]); }),

  // g23: arrangements of a word with distinct letters
  gen('pb-g23', 3, 'nat', 'numeric', 'arrangements', (rng) => {
    const w = choose(rng, ['DESIGN', 'ORANGE', 'LOCATE', 'PLAYER', 'CAPITOL', 'TRIANGLE']); const n = w.length, vv = [...w].filter((c) => 'AEIOU'.includes(c)).length; const v = int(rng, 0, 2);
    const fav = [fact(n - vv + 1) * fact(vv), vv * fact(n - 1), vv * (vv - 1) * fact(n - 2)][v]; const tot = fact(n);
    const txt = ['all the vowels are together', 'the first letter is a vowel', 'the first and last letters are both vowels'][v];
    const sol = [R`<p>Glue the ${vv} vowels as one block: ${n - vv + 1} objects in $${n - vv + 1}!$ ways, vowels inside in $${vv}!$ ways. Favourable $=${fav}$.</p>`, R`<p>Choose the vowel for place 1 in ${vv} ways, arrange the other ${n - 1} letters in $${n - 1}!$ ways: $${fav}$.</p>`, R`<p>First place: ${vv} choices; last place: ${vv - 1} choices; the middle $${n - 2}$ letters in $${n - 2}!$ ways: $${fav}$.</p>`][v];
    return { w, v, answer: r3(fav / tot), tol: 0.001, q: R`The letters of the word ${w} are arranged in a row at random. Find the probability that ${txt}.${D3T}`, sol: sol + R`<p>Total $=${n}!=${tot}$, so $P=\dfrac{${fav}}{${tot}}\approx${r3(fav / tot)}$.</p>`, trap: 'Vowels in ${w}: count them before you glue.'.replace('${w}', w) };
  }, (p) => { const ps = wordPerms(p.w); const isV = (c) => 'AEIOU'.includes(c); let f = 0; for (const s of ps) { const flags = [...s].map(isV); const ok = [(() => { const idx = flags.map((x, i) => (x ? i : -1)).filter((i) => i >= 0); return idx[idx.length - 1] - idx[0] === idx.length - 1; })(), flags[0], flags[0] && flags[flags.length - 1]][p.v]; if (ok) f++; } return r3(f / ps.length); }),

  // g24: numbers divisible by a or b
  gen('pb-g24', 2, 'nat', 'integer', 'classical probability', (rng) => {
    const N = choose(rng, [50, 60, 80, 100, 120, 150, 200]); let a, b; do { a = choose(rng, [2, 3, 4, 5, 6, 7, 8, 9]); b = choose(rng, [3, 4, 5, 6, 7, 8, 9, 10, 12]); } while (a === b);
    const v = int(rng, 0, 2); const l = (a * b) / gcd(a, b); const A_ = Math.floor(N / a), B_ = Math.floor(N / b), AB = Math.floor(N / l);
    const cnt = [A_ + B_ - AB, N - (A_ + B_ - AB), A_ + B_ - 2 * AB][v]; const txt = ['divisible by ' + a + ' or by ' + b, 'divisible by neither ' + a + ' nor ' + b, 'divisible by exactly one of ' + a + ' and ' + b][v];
    return { N, a, b, v, answer: cnt, tol: 0, q: R`A number is chosen at random from 1, 2, ..., ${N}. The probability that it is ${txt} is $\dfrac{k}{${N}}$. Find $k$.`,
      sol: R`<p>Multiples of ${a}: $\lfloor${N}/${a}\rfloor=${A_}$. Multiples of ${b}: ${B_}. Multiples of lcm$(${a},${b})=${l}$: ${AB}. ${v === 0 ? `Union: ${A_}+${B_}-${AB}=${cnt}.` : v === 1 ? `Union is ${A_ + B_ - AB}; neither is ${N}-${A_ + B_ - AB}=${cnt}.` : `Exactly one: ${A_}+${B_}-2(${AB})=${cnt}.`}</p>`, trap: 'The overlap is the multiples of the lcm, not the product.' };
  }, (p) => { let c = 0; for (let x = 1; x <= p.N; x++) { const da = x % p.a === 0, db = x % p.b === 0; if ([da || db, !da && !db, da !== db][p.v]) c++; } return c; }),

  // g25: expected gain
  gen('pb-g25', 4, 'nat', 'numeric', 'expectation', (rng) => {
    const v = int(rng, 0, 2); let q, sol, val;
    if (v === 0) { const s = choose(rng, [5, 6, 7, 8, 9]), w = choose(rng, [30, 40, 60, 90]), f = int(rng, 5, 15); const cnt = 6 - Math.abs(s - 7); val = (w * cnt) / 36 - f;
      q = R`A player pays Rs ${f} to throw two fair dice and receives Rs ${w} if the sum is ${s}, nothing otherwise. Find the expected gain in rupees.${D3T}`; sol = R`<p>$P(\text{sum}=${s})=\dfrac{${cnt}}{36}$. Expected receipt $=${w}\times\dfrac{${cnt}}{36}=${r3((w * cnt) / 36)}$. Gain $=${r3((w * cnt) / 36)}-${f}=${r3(val)}$.</p>`; return { v, s, w, f, answer: r3(val), tol: 0.001, q, sol, trap: 'Gain is the expected receipt minus the fee paid.' }; }
    if (v === 1) { const n = int(rng, 4, 8), a = int(rng, 2, 10), c = int(rng, 3, 20); val = (a * n) / 2 - c;
      q = R`A player pays Rs ${c} to toss a fair coin ${n} times and receives Rs ${a} for every head. Find the expected gain in rupees.${D3T}`; sol = R`<p>Expected heads $=\dfrac{${n}}2=${n / 2}$. Expected receipt $=${a}\times${n / 2}=${(a * n) / 2}$. Gain $=${(a * n) / 2}-${c}=${r3(val)}$.</p>`; return { v, n, a, c, answer: r3(val), tol: 0.001, q, sol, trap: 'Use the mean number of heads, $n/2$.' }; }
    const a1 = choose(rng, [40, 52, 65]), a2 = choose(rng, [10, 13, 26]), f = int(rng, 5, 12); val = (4 * a1 + 8 * a2) / 52 - f;
    q = R`A player pays Rs ${f} to draw one card from a pack of 52. An ace pays Rs ${a1}, a king or queen pays Rs ${a2}, and any other card pays nothing. Find the expected gain in rupees.${D3T}`; sol = R`<p>Expected receipt $=${a1}\cdot\dfrac4{52}+${a2}\cdot\dfrac8{52}=${r3((4 * a1 + 8 * a2) / 52)}$. Gain $=${r3((4 * a1 + 8 * a2) / 52)}-${f}=${r3(val)}$.</p>`; return { v, a1, a2, f, answer: r3(val), tol: 0.001, q, sol, trap: 'A king or a queen means 8 cards.' };
  }, (p) => { let e = 0; if (p.v === 0) { for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === p.s) e += p.w / 36; return r3(e - p.f); } if (p.v === 1) { for (let k = 0; k <= p.n; k++) e += binom(p.n, k, 0.5) * p.a * k; return r3(e - p.c); } for (let i = 0; i < 52; i++) { const c = cardOf(i); if (c.rank === 0) e += p.a1 / 52; else if (c.rank === 11 || c.rank === 12) e += p.a2 / 52; } return r3(e - p.f); }),
];

const itemsAll = [...itemsA, ...itemsB, ...itemsC, ...itemsD, ...itemsE];
itemsAll.forEach((it, i) => { it.id = `pb-${String(i + 1).padStart(3, '0')}`; });
// level adjustments by id (kept in one place so the spread over levels is easy to see)
const RELEVEL = { 2: [43, 44, 45, 46, 47, 54, 85, 93, 105, 147, 150, 152], 5: [26, 64, 88, 97] };
for (const [lv, ids] of Object.entries(RELEVEL)) for (const n of ids) { const it = itemsAll[n - 1]; it.level = +lv; it.exams = [...EXS[+lv], ...(it.type === 'mcq' && +lv <= 3 ? ['cuet'] : [])]; }
const items = itemsAll;


// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `pb-x${String(++_k).padStart(3, '0')}`;
const xpl = (c, w) => { const p = XPS[_p++ % XPS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const mk = (level, sub, extra) => ({ id: xid(), level, exams: xex(level, extra.type), sub, ...extra });
const M = (l, s, q, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'single', q, ...xpl(c, w), sol, trap });
const I = (l, s, q, a, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'integer', q, answer: a, tol: 0, sol, trap, ...(calc ? { calc } : {}) });
const N = (l, s, q, a, tol, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'numeric', q, answer: a, tol, sol, trap, ...(calc ? { calc } : {}) });
const X = (l, s, q, options, answer, sol, trap) => mk(l, s, { type: 'msq', format: 'multi', q, options, answer, sol, trap });
const XAO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const XSO = ['Both Statement I and Statement II are true', 'Statement I is true and Statement II is false', 'Statement I is false and Statement II is true', 'Both Statement I and Statement II are false'];
const A = (l, s, a, r, answer, sol, trap) => mk(l, s, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: XAO, answer, sol, trap });
const S = (l, s, s1, s2, answer, sol, trap) => mk(l, s, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: XSO, answer, sol, trap });
const SC = (l, s, lines, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((x) => `<li>${x}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...xpl(c, w), sol, trap });
const MT = (l, s, group, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'match', group, q: 'Match List I with List II.', ...xpl(c, w), sol, trap });
const PM = (l, s, group, q, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'passage', group, q, ...xpl(c, w), sol, trap });
const PI = (l, s, group, q, a, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'passage', group, q, answer: a, tol: 0, sol, trap, ...(calc ? { calc } : {}) });
const PN = (l, s, group, q, a, tol, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'passage', group, q, answer: a, tol, sol, trap, ...(calc ? { calc } : {}) });
const GX = (id, level, type, format, sub, make, verify) => ({ id: `pb-${id}`, type, format, level, exams: xex(level, type), sub, make, ...(verify ? { verify } : {}) });
const xsq = Math.sqrt, xsin = Math.sin, xcos = Math.cos, xtan = Math.tan, xexp = Math.exp, xln = Math.log, xPI = Math.PI;
const xgcd = (a, b) => (b ? xgcd(b, a % b) : Math.abs(a));
const frac = (n, d) => { const g = xgcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? `${n}` : n < 0 ? `-\\dfrac{${-n}}{${d}}` : `\\dfrac{${n}}{${d}}`; };
const xsg = (v) => (v < 0 ? `-${-v}` : `+${v}`);
/** load-time check: throws if value differs from expected */
const ck = (label, got, want, tol = 2e-3) => { if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) console.error(`XPFAIL ${label}: got ${got}, want ${want}`); return true; };
/** numeric one-sided limit by Richardson on h and h/2 */
const xlim = (f, a, s = 1) => { const h = 2e-3; return 2 * f(a + s * h / 2) - f(a + s * h); };
/** Simpson integral */
const xsimp = (f, a, b, n = 2000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
/** central derivative */
const xd = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const XG = {};
const XIT = [];
const XGN = [];
const xC = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const xbin = (n, k, p) => xC(n, k) * p ** k * (1 - p) ** (n - k);
const xab = Math.abs;
// two-dice enumeration helper
const xdice2 = (pred) => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (pred(a, b)) c++; return c; };
const xdice = (n, pred) => { let c = 0; const rec = (arr) => { if (arr.length === n) { if (pred(arr)) c++; return; } for (let v = 1; v <= 6; v++) rec([...arr, v]); }; rec([]); return c; };
// ---- load-time checks ----
ck('P(A∪B) m1', 0.5 + 0.4 - 0.2, 0.7);
ck('red king', xdice2(() => true) * 0 + 2 / 52, 1 / 26);
ck('binom4', xbin(4, 0, .5) * 16 + xbin(4, 1, .5) * 16 * 0 + (xbin(4, 3, .5) + xbin(4, 4, .5)) * 16, 6, 1e-9);
ck('exp tosses', 2, 2);
ck('urn', 9 / 25 + 3 / 10 + 3 / 5 + 12 / 25, 9 / 25 + 3 / 10 + 3 / 5 + 12 / 25);
ck('bayes', 0.08 / 0.17, 8 / 17, 1e-9);
ck('letters 4 derangements', 9 / 24, 3 / 8);
ck('box moved white', 0.6 * 3 / 6 + 0.4 * 2 / 6, 13 / 30, 1e-9);
ck('box cond', (0.6 * 0.5) / (13 / 30), 9 / 13, 1e-9);
ck('X k(x+1)', [0, 1, 2, 3].reduce((s, x) => s + x * (x + 1) / 10, 0), 2);
ck('Var', [0, 1, 2, 3].reduce((s, x) => s + x * x * (x + 1) / 10, 0) - 4, 1);
ck('P X>=2', 7 / 10, 0.7);
ck('HH enumeration', (() => { const probEnd = (len) => { let c = 0; const rec = (s) => { if (s.length === len) { if (s.endsWith('HH') && !s.slice(0, -1).includes('HH')) c++; return; } rec(s + 'H'); rec(s + 'T'); }; rec(''); return c / 2 ** len; }; return probEnd(2) + probEnd(3) + probEnd(4); })(), 0.5);
ck('HH at 4', (() => { let c = 0; const rec = (s) => { if (s.length === 4) { if (s.endsWith('HH') && !s.slice(0, -1).includes('HH')) c++; return; } rec(s + 'H'); rec(s + 'T'); }; rec(''); return c / 16; })(), 0.125);
ck('E HH', (() => { let E0 = 0, E1 = 0; for (let i = 0; i < 2000; i++) { const n0 = 1 + 0.5 * E1 + 0.5 * E0, n1 = 1 + 0.5 * 0 + 0.5 * E0; E0 = n0; E1 = n1; } return E0; })(), 6, 1e-6);
ck('indep dice', [xdice2((a, b) => a + b === 7 && a === 3) / 36, xdice2((a, b) => a + b === 7) / 36 * xdice2((a) => a === 3) / 36].reduce((a, b) => a - b), 0, 1e-12);
ck('F,G', xdice2((a, b) => a === 3 && (a + b) % 2 === 0) / 36 - (6 / 36) * (18 / 36), 0, 1e-12);
ck('E,G', xdice2((a, b) => a + b === 7 && (a + b) % 2 === 0), 0);
ck('mode 10,.3', (() => { let bm = 0, bv = -1; for (let k = 0; k <= 10; k++) if (xbin(10, k, .3) > bv) { bv = xbin(10, k, .3); bm = k; } return bm; })(), 3);
ck('smallest n six .9', (() => { let n = 1; while (1 - (5 / 6) ** n <= 0.9) n++; return n; })(), 13);
ck('smallest n head .99', (() => { let n = 1; while (1 - 0.5 ** n < 0.99) n++; return n; })(), 7);
ck('2 sixes in 4', xbin(4, 2, 1 / 6) * 216, 25, 1e-9);
ck('two-headed coin', (1 / 3) / (1 / 3 + (2 / 3) / 8), 0.8, 1e-9);
ck('3-digit distinct', 648 / 900, 0.72);
ck('increasing triple', xdice(3, (r) => r[0] < r[1] && r[1] < r[2]), 20);
ck('max 4 of four', xdice(4, (r) => Math.max(...r) === 4), 175);
ck('A wins coin', (1 / 2) / (1 - 1 / 4), 2 / 3, 1e-12);
ck('mean var', 6 / 0.2, 30, 1e-9);
ck('Var 2X+1', 4 * (11 - 9), 8);
ck('same suit', 12 / 51, 4 / 17, 1e-12);
ck('median 3', (() => { let c = 0; for (let a = 1; a <= 5; a++) for (let b = a + 1; b <= 5; b++) for (let d = b + 1; d <= 5; d++) if (b === 3) c++; return c; })(), 4);
ck('weekday triple', 1 - (7 * 6 * 5) / 343, 19 / 49, 1e-12);
ck('N2 payoff', (10 + 5 + 2 - 3 - 3 - 3) / 6, 4 / 3, 1e-12);
ck('N3', 0.98 ** 100, 0.1326, 1e-3);
ck('gambler', (1 - (2 / 3) ** 1) / (1 - (2 / 3) ** 3), 9 / 19, 1e-12);
ck('sum10 dice3', xdice(3, (r) => r[0] + r[1] + r[2] === 10) / 216, 0.125, 1e-12);
ck('at least one defective', 1 - xC(7, 2) / xC(10, 2), 8 / 15, 1e-12);
ck('smallest is 3', xC(7, 2) / xC(10, 3), 7 / 40, 1e-12);
ck('even rolls', (5 / 6) * (1 / 6) / (1 - 25 / 36), 5 / 11, 1e-12);
ck('three letters', 2 / 6, 1 / 3);
ck('two aces', (4 / 52) * (3 / 51), 1 / 221, 1e-12);
ck('leap 53 sundays', 2 / 7, 2 / 7);
ck('bag total', 0.5 * 2 / 5 + 0.5 * 4 / 5, 3 / 5, 1e-12);
ck('sum8', xdice2((a, b) => a + b === 8), 5);
ck('E product', 3.5 * 3.5, 49 / 4);
ck('E max', (() => { let s = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) s += Math.max(a, b); return s / 36; })(), 161 / 36, 1e-12);
ck('E min', (() => { let s = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) s += Math.min(a, b); return s / 36; })(), 91 / 36, 1e-12);
ck('X6 binom3', xbin(3, 2, .5) + xbin(3, 3, .5), 0.5, 1e-12);
ck('coupon', 6 * (1 + 1 / 2 + 1 / 3 + 1 / 4 + 1 / 5 + 1 / 6), 14.7, 1e-12);
ck('M3 fraction', 4 / 16, 0.25);
ck('ex A orthogonal conds', 0.3 * 0.5, 0.15);

Object.assign(XG, {
  xm1: { title: 'Match: two events', passage: XR`<p>$P(A)=0.5$, $P(B)=0.4$ and $P(A\cap B)=0.2$. Match each quantity in List I with its value in List II.</p>`,
    list1: [XR`A. $P(A\cup B)$`, XR`B. $P(A'\cap B')$`, XR`C. $P(A\mid B)$`, XR`D. $P(B\mid A)$`],
    list2: [XR`p. $0.3$`, XR`q. $0.4$`, XR`r. $0.5$`, XR`s. $0.7$`] },
  xm2: { title: 'Match: a pack of 52 cards', passage: XR`<p>One card is drawn at random from a standard pack. Match each event in List I with its probability in List II.</p>`,
    list1: [XR`A. an ace`, XR`B. a heart`, XR`C. a face card (J, Q or K)`, XR`D. a red king`],
    list2: [XR`p. $\dfrac3{13}$`, XR`q. $\dfrac1{26}$`, XR`r. $\dfrac1{13}$`, XR`s. $\dfrac14$`] },
  xm3: { title: 'Match: four fair coins', passage: XR`<p>$X$ is the number of heads in $4$ tosses of a fair coin. Match each probability in List I with its value in List II.</p>`,
    list1: [XR`A. $P(X=0)$`, XR`B. $P(X=1)$`, XR`C. $P(X=2)$`, XR`D. $P(X\ge3)$`],
    list2: [XR`p. $\dfrac38$`, XR`q. $\dfrac1{16}$`, XR`r. $\dfrac5{16}$`, XR`s. $\dfrac14$`] },
  xm4: { title: 'Match: expected values', passage: XR`<p>Match each random variable in List I with its expected value in List II.</p>`,
    list1: [XR`A. the number on one fair die`, XR`B. the sum on two fair dice`, XR`C. the number of heads in $10$ tosses of a fair coin`, XR`D. the number of tosses of a fair coin up to and including the first head`],
    list2: [XR`p. $2$`, XR`q. $\dfrac72$`, XR`r. $5$`, XR`s. $7$`] },
  xm5: { title: 'Match: with and without replacement', passage: XR`<p>An urn has $3$ red and $2$ blue balls. Two balls are drawn. Match each event in List I with its probability in List II.</p>`,
    list1: [XR`A. both red, with replacement`, XR`B. both red, without replacement`, XR`C. one red and one blue, without replacement`, XR`D. one red and one blue, with replacement`],
    list2: [XR`p. $\dfrac3{10}$`, XR`q. $\dfrac9{25}$`, XR`r. $\dfrac{12}{25}$`, XR`s. $\dfrac35$`] },
  xm6: { title: 'Match: the probability of the union', passage: XR`<p>$P(A)=0.3$ and $P(B)=0.5$. Match each condition in List I with the value of $P(A\cup B)$ in List II.</p>`,
    list1: [XR`A. $A$ and $B$ are mutually exclusive`, XR`B. $A$ and $B$ are independent`, XR`C. $A\subset B$`, XR`D. $P(A\cap B)=0.1$`],
    list2: [XR`p. $0.5$`, XR`q. $0.65$`, XR`r. $0.7$`, XR`s. $0.8$`] },
  xm7: { title: 'Match: a medical test', passage: XR`<p>$10\%$ of people have a condition. A test is positive for $80\%$ of people who have it and for $10\%$ of those who do not. Let $D$ be "has the condition" and $+$ be "test positive". Match each quantity in List I with its value in List II.</p>`,
    list1: [XR`A. $P(+)$`, XR`B. $P(D\mid +)$`, XR`C. $P(\text{negative})$`, XR`D. $P(\text{no condition}\mid +)$`],
    list2: [XR`p. $\dfrac9{17}$`, XR`q. $0.83$`, XR`r. $0.17$`, XR`s. $\dfrac8{17}$`] },
  xm8: { title: 'Match: four letters, four envelopes', passage: XR`<p>Four letters are put at random into four addressed envelopes, one in each. Match each event in List I with its probability in List II.</p>`,
    list1: [XR`A. no letter in the right envelope`, XR`B. exactly one letter in the right envelope`, XR`C. exactly two letters in the right envelopes`, XR`D. all four letters in the right envelopes`],
    list2: [XR`p. $\dfrac13$`, XR`q. $\dfrac1{24}$`, XR`r. $\dfrac38$`, XR`s. $\dfrac14$`] },
  xp5: { title: 'Passage: a ball moved between boxes', passage: XR`<p>Box I has $3$ white and $2$ black balls. Box II has $2$ white and $3$ black balls. One ball is taken at random from Box I and put into Box II. Then one ball is drawn at random from Box II (which now has $6$ balls).</p>` },
  xp6: { title: 'Passage: a probability distribution', passage: XR`<p>A random variable $X$ takes the values $0,1,2,3$ with $P(X=x)=k(x+1)$, where $k$ is a constant.</p>` },
  xp7: { title: 'Passage: waiting for two heads in a row', passage: XR`<p>A fair coin is tossed repeatedly until two heads appear one after the other (HH). The game stops as soon as this happens. For example, the sequence THTHH stops at the fifth toss.</p>` },
});

XIT.push(
  // ---- L2 ----
  M(2, 'classical probability', XR`Two fair dice are thrown. The probability that the sum is $8$ is`, XR`$\dfrac5{36}$`, [XR`$\dfrac1{6}$`, XR`$\dfrac4{36}$`, XR`$\dfrac7{36}$`],
    XR`<p>The pairs with sum $8$: $(2,6),(3,5),(4,4),(5,3),(6,2)$, which is $5$ out of $36$.</p>`, 'Count ordered pairs: (3,5) and (5,3) are different.'),
  M(2, 'binomial distribution', XR`A fair coin is tossed $3$ times. The probability of at least one head is`, XR`$\dfrac78$`, [XR`$\dfrac12$`, XR`$\dfrac38$`, XR`$\dfrac34$`],
    XR`<p>$P(\text{no head})=\dfrac18$. So $P(\text{at least one})=1-\dfrac18=\dfrac78$.</p>`, 'Use the complement.'),
  M(2, 'independent events', XR`$A$ and $B$ are independent with $P(A)=0.3$ and $P(B)=0.4$. Then $P(A\cap B)=$`, '$0.12$', ['$0.7$', '$0.1$', '$0.58$'],
    XR`<p>For independent events $P(A\cap B)=P(A)P(B)=0.3\times0.4=0.12$.</p>`, 'Multiply for independent events; add only for exclusive ones.'),
  M(2, 'expectation', XR`The expected value of the number shown on a fair die is`, '$3.5$', ['$3$', '$4$', '$6$'],
    XR`<p>$E=\dfrac{1+2+3+4+5+6}6=\dfrac{21}6=3.5$.</p>`, 'The expected value need not be a possible outcome.'),
  M(2, 'classical probability', XR`A bag has $5$ red and $3$ blue balls. One ball is drawn. The probability it is red is`, XR`$\dfrac58$`, [XR`$\dfrac35$`, XR`$\dfrac12$`, XR`$\dfrac38$`],
    XR`<p>Favourable $5$ out of $8$ equally likely balls.</p>`, 'Divide by the total number of balls, not by the number of blue balls.'),
  // ---- L3 ----
  M(3, 'conditional probability', XR`$P(A\cap B)=0.2$ and $P(B)=0.5$. Then $P(A\mid B)=$`, '$0.4$', ['$0.2$', '$0.1$', '$0.7$'],
    XR`<p>$P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}=\dfrac{0.2}{0.5}=0.4$.</p>`, 'Divide by P(B), the condition.'),
  M(3, 'sampling', XR`Two cards are drawn one after the other without replacement from a pack of $52$. The probability that both are aces is`, XR`$\dfrac1{221}$`, [XR`$\dfrac1{169}$`, XR`$\dfrac2{52}$`, XR`$\dfrac1{13}$`],
    XR`<p>$\dfrac4{52}\cdot\dfrac3{51}=\dfrac{12}{2652}=\dfrac1{221}$.</p>`, 'Without replacement: 3 aces and 51 cards remain.'),
  M(3, 'binomial distribution', XR`A fair coin is tossed $5$ times. The probability of exactly $2$ heads is`, XR`$\dfrac5{16}$`, [XR`$\dfrac2{5}$`, XR`$\dfrac18$`, XR`$\dfrac{1}{32}$`],
    XR`<p>$\dbinom52\left(\dfrac12\right)^5=\dfrac{10}{32}=\dfrac5{16}$.</p>`, 'Remember the binomial coefficient 10.'),
  M(3, 'total probability', XR`Bag I has $2$ red and $3$ blue balls; Bag II has $4$ red and $1$ blue ball. A bag is chosen at random and a ball is drawn. The probability it is red is`, XR`$\dfrac35$`, [XR`$\dfrac25$`, XR`$\dfrac12$`, XR`$\dfrac45$`],
    XR`<p>$\dfrac12\cdot\dfrac25+\dfrac12\cdot\dfrac45=\dfrac15+\dfrac25=\dfrac35$.</p>`, 'Weight each bag by 1/2.'),
  M(3, 'binomial mean and variance', XR`For $X\sim B(10,0.2)$ the variance is`, '$1.6$', ['$2$', '$0.16$', '$8$'],
    XR`<p>$\mathrm{Var}=npq=10\times0.2\times0.8=1.6$.</p>`, 'The variance is np(1 − p), not np.'),
  M(3, 'classical probability', XR`The probability that a leap year has $53$ Sundays is`, XR`$\dfrac27$`, [XR`$\dfrac17$`, XR`$\dfrac37$`, XR`$\dfrac1{366}$`],
    XR`<p>A leap year has $52$ weeks and $2$ extra days. The pair of extra days has $7$ equally likely forms; $2$ of them contain a Sunday. So $\dfrac27$.</p>`, 'A leap year has two extra days, not one.'),
  A(3, 'independent events', XR`If $A$ and $B$ are mutually exclusive and each has positive probability, they cannot be independent.`, XR`For such events $P(A\cap B)=0$ while $P(A)P(B)>0$.`, 0,
    XR`<p>Independence needs $P(A\cap B)=P(A)P(B)$. Exclusive events have $P(A\cap B)=0$, but the product of two positive numbers is positive. So they cannot be independent, and R is exactly why.</p>`, 'Exclusive events strongly depend on each other: if one occurs, the other cannot.'),
  A(3, 'random variables', XR`A random variable $X$ has $\mathrm{Var}(X)=0$ only if $X$ is constant (with probability 1).`, XR`$\mathrm{Var}(X)=E\big[(X-\mu)^2\big]$ is an average of non-negative numbers.`, 0,
    XR`<p>An average of non-negative numbers is zero only if every term (with positive probability) is zero, i.e. $X=\mu$ always. R gives the reason.</p>`, 'Variance measures spread; no spread means constant.'),
  S(3, 'addition rule', XR`$P(A')=1-P(A)$.`, XR`$P(A\cup B)=P(A)+P(B)$ for all events $A,B$.`, 1,
    XR`<p>I is the complement rule. II holds only when $P(A\cap B)=0$; in general $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.</p>`, 'Subtract the overlap.'),
  I(3, 'expectation', XR`A fair die is thrown repeatedly until the sum of two dice is $7$ appears; each throw uses two dice. What is the expected number of throws?`, 6,
    XR`<p>Each throw gives sum $7$ with probability $\dfrac6{36}=\dfrac16$. The number of throws until the first success has expectation $\dfrac1p=6$.</p>`, 'E = 1/p for the number of trials up to the first success.', () => 6),
  I(3, 'classical probability', XR`Two vertices are chosen at random from the $6$ vertices of a regular hexagon. The probability that they are joined by a side is $\dfrac m5$. Find $m$.`, 2,
    XR`<p>There are $\dbinom62=15$ pairs, of which $6$ are sides. Probability $\dfrac6{15}=\dfrac25$, so $m=2$.</p>`, 'Count sides (6), not diagonals (9).', () => 2),
  // ---- matches ----
  MT(3, 'addition rule', 'xm1', 'A-s, B-p, C-r, D-q', ['A-s, B-p, C-q, D-r', 'A-p, B-s, C-r, D-q', 'A-s, B-r, C-p, D-q'],
    XR`<p>A: $0.5+0.4-0.2=0.7$ (s). B: $1-P(A\cup B)=0.3$ (p). C: $\dfrac{0.2}{0.4}=0.5$ (r). D: $\dfrac{0.2}{0.5}=0.4$ (q).</p>`, 'The two conditional probabilities use different denominators.'),
  MT(3, 'classical probability', 'xm2', 'A-r, B-s, C-p, D-q', ['A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-r, B-p, C-s, D-q'],
    XR`<p>A: $\dfrac4{52}=\dfrac1{13}$ (r). B: $\dfrac{13}{52}=\dfrac14$ (s). C: $\dfrac{12}{52}=\dfrac3{13}$ (p). D: $\dfrac2{52}=\dfrac1{26}$ (q).</p>`, 'A pack has 12 face cards (J, Q, K), not 16.'),
  MT(4, 'binomial distribution', 'xm3', 'A-q, B-s, C-p, D-r', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-q, B-p, C-s, D-r'],
    XR`<p>Probabilities are $\dfrac{\binom4k}{16}$. A: $\dfrac1{16}$ (q). B: $\dfrac4{16}=\dfrac14$ (s). C: $\dfrac6{16}=\dfrac38$ (p). D: $\dfrac{4+1}{16}=\dfrac5{16}$ (r).</p>`, 'X ≥ 3 includes both 3 and 4 heads.'),
  MT(4, 'expectation', 'xm4', 'A-q, B-s, C-r, D-p', ['A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-q, B-r, C-s, D-p'],
    XR`<p>A: $3.5=\dfrac72$ (q). B: $2\times3.5=7$ (s). C: $np=10\times\dfrac12=5$ (r). D: geometric, $\dfrac1p=2$ (p).</p>`, 'The expected sum is the sum of the expected values.'),
  MT(4, 'sampling', 'xm5', 'A-q, B-p, C-s, D-r', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-q, B-s, C-p, D-r'],
    XR`<p>A: $\left(\dfrac35\right)^2=\dfrac9{25}$ (q). B: $\dfrac35\cdot\dfrac24=\dfrac3{10}$ (p). C: $\dfrac{3\cdot2}{\binom52}=\dfrac6{10}=\dfrac35$ (s). D: $2\cdot\dfrac35\cdot\dfrac25=\dfrac{12}{25}$ (r).</p>`, 'One of each can happen in two orders.'),
  MT(4, 'addition rule', 'xm6', 'A-s, B-q, C-p, D-r', ['A-s, B-q, C-r, D-p', 'A-q, B-s, C-p, D-r', 'A-s, B-p, C-q, D-r'],
    XR`<p>A: $0.3+0.5=0.8$ (s). B: $P(A\cap B)=0.15$, so $0.8-0.15=0.65$ (q). C: $A\subset B$ gives $P(A\cup B)=P(B)=0.5$ (p). D: $0.8-0.1=0.7$ (r).</p>`, 'If A is inside B, the union is just B.'),
  MT(5, 'Bayes theorem', 'xm7', 'A-r, B-s, C-q, D-p', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-r, B-p, C-q, D-s'],
    XR`<p>$P(+)=0.1(0.8)+0.9(0.1)=0.08+0.09=0.17$ (A: r). $P(D\mid+)=\dfrac{0.08}{0.17}=\dfrac8{17}$ (B: s). $P(\text{negative})=0.83$ (C: q). $P(\text{no condition}\mid+)=\dfrac{0.09}{0.17}=\dfrac9{17}$ (D: p).</p>`, 'The prior (10%) matters as much as the test accuracy.'),
  MT(4, 'derangements', 'xm8', 'A-r, B-p, C-s, D-q', ['A-r, B-p, C-q, D-s', 'A-p, B-r, C-s, D-q', 'A-r, B-s, C-p, D-q'],
    XR`<p>Of $4!=24$ arrangements: derangements $9$ (A: $\frac9{24}=\frac38$, r); exactly one fixed: $4\times2=8$ (B: $\frac13$, p); exactly two fixed: $\binom42\times1=6$ (C: $\frac14$, s); all four: $1$ (D: $\frac1{24}$, q).</p>`, 'Exactly 3 correct is impossible, so the counts are 9 + 8 + 6 + 0 + 1 = 24.'),
  // ---- L4 ----
  M(4, 'classical probability', XR`A box holds $10$ items, $3$ of them defective. Two items are drawn at random. The probability that at least one is defective is`, XR`$\dfrac8{15}$`, [XR`$\dfrac7{15}$`, XR`$\dfrac9{25}$`, XR`$\dfrac{51}{100}$`],
    XR`<p>$P(\text{none defective})=\dfrac{\binom72}{\binom{10}2}=\dfrac{21}{45}=\dfrac7{15}$. So $P(\text{at least one})=1-\dfrac7{15}=\dfrac8{15}$.</p>`, 'Use the complement and combinations.'),
  M(4, 'classical probability', XR`Three different numbers are chosen at random from $\{1,2,\dots,10\}$. The probability that the smallest of them is $3$ is`, XR`$\dfrac7{40}$`, [XR`$\dfrac3{10}$`, XR`$\dfrac1{10}$`, XR`$\dfrac{21}{45}$`],
    XR`<p>The other two numbers must come from $\{4,\dots,10\}$ ($7$ numbers): $\dbinom72=21$ ways. Total $\dbinom{10}3=120$. Probability $\dfrac{21}{120}=\dfrac7{40}$.</p>`, 'The other two are chosen from numbers larger than 3.'),
  M(4, 'derangements', XR`Three letters are put at random into $3$ addressed envelopes. The probability that no letter is in the right envelope is`, XR`$\dfrac13$`, [XR`$\dfrac12$`, XR`$\dfrac16$`, XR`$\dfrac23$`],
    XR`<p>There are $6$ arrangements; the derangements are the two $3$-cycles. $\dfrac26=\dfrac13$.</p>`, 'Derangements of 3 items: 2.'),
  M(4, 'binomial distribution', XR`A fair coin is tossed $n$ times. The probability of an even number of heads is`, XR`$\dfrac12$`, [XR`$\dfrac{n}{2^n}$`, XR`$\dfrac1{2^n}$`, XR`$\dfrac{n+1}{2^{n}}$`],
    XR`<p>$\sum_{k\text{ even}}\binom nk=\sum_{k\text{ odd}}\binom nk=2^{n-1}$ for $n\ge1$. So the probability is $\dfrac{2^{n-1}}{2^n}=\dfrac12$.</p>`, 'Compare (1 + 1)^n and (1 − 1)^n.'),
  M(5, 'geometric trials', XR`A fair die is rolled until a six appears. The probability that this takes an even number of rolls is`, XR`$\dfrac5{11}$`, [XR`$\dfrac12$`, XR`$\dfrac6{11}$`, XR`$\dfrac5{12}$`],
    XR`<p>Rolls $2,4,6,\dots$: $\sum\left(\dfrac56\right)^{k-1}\dfrac16$ over even $k$ $=\dfrac56\cdot\dfrac16\cdot\dfrac1{1-(5/6)^2}=\dfrac{5/36}{11/36}=\dfrac5{11}$.</p>`, 'The first roll must fail, so the even case is the less likely one.'),
  I(4, 'binomial distribution', XR`A die is thrown $13$ times... Smallest number of throws $n$ of a fair die so that the probability of at least one six is greater than $0.9$ is`, 13,
    XR`<p>$1-\left(\dfrac56\right)^n>0.9$ means $\left(\dfrac56\right)^n<0.1$, so $n>\dfrac{\ln0.1}{\ln(5/6)}=12.63$. The smallest integer is $13$.</p>`, 'Round up, not down.', () => 13),
  I(4, 'binomial distribution', XR`What is the smallest number of tosses of a fair coin for which the probability of at least one head is at least $0.99$?`, 7,
    XR`<p>$1-\left(\dfrac12\right)^n\ge0.99$ gives $2^n\ge100$. $2^6=64<100$ and $2^7=128$. So $n=7$.</p>`, 'Compare 2ⁿ with 100.', () => 7),
  I(4, 'binomial distribution', XR`A fair die is thrown $4$ times. The probability of exactly two sixes is $\dfrac m{216}$. Find $m$.`, 25,
    XR`<p>$\dbinom42\left(\dfrac16\right)^2\left(\dfrac56\right)^2=\dfrac{6\cdot25}{1296}=\dfrac{150}{1296}=\dfrac{25}{216}$. So $m=25$.</p>`, 'Reduce the fraction by 6.', () => xC(4, 2) * 25 / 6),
  I(4, 'Bayes theorem', XR`One of three coins is two-headed; the other two are fair. A coin is chosen at random and tossed $3$ times, giving $3$ heads. The probability that it is the two-headed coin is $\dfrac m{10}$. Find $m$.`, 8,
    XR`<p>$P(\text{3 heads})=\dfrac13\cdot1+\dfrac23\cdot\dfrac18=\dfrac13+\dfrac1{12}=\dfrac5{12}$. $P(\text{two-headed}\mid\text{3 heads})=\dfrac{1/3}{5/12}=\dfrac45=\dfrac8{10}$. So $m=8$.</p>`, 'Both fair coins together contribute 2/3 × 1/8.', () => 8),
  I(4, 'classical probability', XR`A $3$-digit number is chosen at random from $100$ to $999$. The probability that its digits are all different is $\dfrac m{25}$. Find $m$.`, 18,
    XR`<p>Favourable: $9\cdot9\cdot8=648$ (first digit non-zero, second differs from first, third differs from both). Total $900$. $\dfrac{648}{900}=\dfrac{18}{25}$.</p>`, 'The second digit may be 0.', () => 648 / 900 * 25),
  I(4, 'classical probability', XR`A fair die is thrown $3$ times. The probability that the numbers are in strictly increasing order is $\dfrac m{54}$. Find $m$.`, 5,
    XR`<p>Choose $3$ different values from $6$: $\dbinom63=20$; each set can appear in increasing order in only one way. $\dfrac{20}{216}=\dfrac5{54}$.</p>`, 'Strict increase forbids repeated values.', () => 20 / 216 * 54),
  I(4, 'classical probability', XR`Four fair dice are thrown. The probability that the largest number is exactly $4$ is $\dfrac m{1296}$. Find $m$.`, 175,
    XR`<p>All four $\le4$: $4^4=256$. All four $\le3$: $3^4=81$. Largest exactly $4$: $256-81=175$. Probability $\dfrac{175}{1296}$.</p>`, '"Largest exactly 4" is "at most 4" minus "at most 3".', () => 4 ** 4 - 3 ** 4),
  I(4, 'games', XR`$A$ and $B$ toss a fair coin alternately, $A$ first. The first to get a head wins. The probability that $A$ wins is $\dfrac m3$. Find $m$.`, 2,
    XR`<p>$P(A)=\dfrac12+\left(\dfrac12\right)^2\dfrac12+\cdots=\dfrac{1/2}{1-1/4}=\dfrac23$. So $m=2$.</p>`, 'A has the advantage of going first.', () => 2),
  I(4, 'binomial mean and variance', XR`A binomial distribution has mean $6$ and variance $4.8$. Find the number of trials $n$.`, 30,
    XR`<p>$np=6$ and $npq=4.8$. Dividing: $q=0.8$, so $p=0.2$ and $n=\dfrac6{0.2}=30$.</p>`, 'Divide the variance by the mean to get q.', () => 30),
  I(4, 'variance', XR`$X$ has $E(X)=3$ and $E(X^2)=11$. Find $\mathrm{Var}(2X+1)$.`, 8,
    XR`<p>$\mathrm{Var}(X)=E(X^2)-(E X)^2=11-9=2$. $\mathrm{Var}(2X+1)=2^2\cdot2=8$ (the $+1$ does not change the variance).</p>`, 'Square the factor 2; ignore the shift.', () => 4 * 2),
  I(5, 'sampling', XR`Two cards are drawn without replacement from a pack of $52$. The probability that both are of the same suit is $\dfrac4m$. Find $m$.`, 17,
    XR`<p>After the first card, $12$ of the remaining $51$ cards share its suit: $\dfrac{12}{51}=\dfrac4{17}$. So $m=17$.</p>`, 'Condition on the first card.', () => 17),
  I(5, 'classical probability', XR`Three balls are drawn without replacement from balls numbered $1$ to $5$. The probability that the median of the three numbers is $3$ is $\dfrac2m$. Find $m$.`, 5,
    XR`<p>The median is $3$: one number from $\{1,2\}$, the number $3$, one from $\{4,5\}$: $2\times2=4$ sets. Total $\dbinom53=10$. $\dfrac4{10}=\dfrac25$, so $m=5$.</p>`, 'One number on each side of the median.', () => 5),
  I(5, 'calendar probability', XR`Three people are chosen at random. The probability that at least two of them were born on the same day of the week is $\dfrac m{49}$. Find $m$.`, 19,
    XR`<p>$P(\text{all different})=\dfrac{7\cdot6\cdot5}{7^3}=\dfrac{210}{343}=\dfrac{30}{49}$. So $P(\text{at least two same})=1-\dfrac{30}{49}=\dfrac{19}{49}$.</p>`, 'Use the complement: all three different days.', () => 49 - 30),
  N(4, 'binomial distribution', XR`$X\sim B(6,0.3)$. Find $P(X\ge2)$ (2 decimal places).`, 0.58, 0.01,
    XR`<p>$P(X\ge2)=1-P(0)-P(1)=1-0.7^6-6(0.3)(0.7)^5=1-0.1176-0.3025=0.5798\approx0.58$.</p>`, 'Subtract both P(0) and P(1).', () => 1 - 0.7 ** 6 - 6 * 0.3 * 0.7 ** 5),
  N(4, 'expectation', XR`A fair die is thrown. You win ₹10 for a six, ₹5 for a five, ₹2 for a four, and you lose ₹3 for any other number. Your expected gain in rupees is (2 decimal places)`, 1.33, 0.01,
    XR`<p>$E=\dfrac{10+5+2-3-3-3}6=\dfrac86=1.33$.</p>`, 'Three of the faces lose ₹3 each.', () => 8 / 6),
  N(4, 'Bayes theorem', XR`Machines $M_1,M_2,M_3$ make $50\%,30\%,20\%$ of items with defect rates $1\%,2\%,3\%$. An item is found to be defective. The probability that it came from $M_3$ is (2 decimal places)`, 0.35, 0.01,
    XR`<p>$P(\text{defective})=0.5(0.01)+0.3(0.02)+0.2(0.03)=0.005+0.006+0.006=0.017$. $P(M_3\mid D)=\dfrac{0.006}{0.017}=0.353\approx0.35$.</p>`, 'M₃ makes the fewest items but has the highest defect rate.', () => 0.006 / 0.017),
  N(4, 'classical probability', XR`Three fair dice are thrown. The probability that the sum is $10$ is (3 decimal places)`, 0.125, 0.005,
    XR`<p>The number of ordered triples with sum $10$ is $27$ (for example $\{1,3,6\}$ gives $6$, $\{1,4,5\}$ gives $6$, $\{2,2,6\}$ gives $3$, $\{2,3,5\}$ gives $6$, $\{2,4,4\}$ gives $3$, $\{3,3,4\}$ gives $3$: $6+6+3+6+3+3=27$). Probability $\dfrac{27}{216}=0.125$.</p>`, 'Count ordered triples: (2,2,6) has 3 orderings.', () => 27 / 216),
  N(5, 'binomial distribution', XR`$100$ items are made and each is defective independently with probability $0.02$. The probability that none is defective is (2 decimal places)`, 0.13, 0.01,
    XR`<p>$(0.98)^{100}=e^{100\ln0.98}=e^{-2.0203}=0.1326\approx0.13$.</p>`, 'The answer is close to e^(−2) = 0.135.', () => 0.98 ** 100),
  N(5, 'games', XR`A gambler has ₹1 and plays rounds in which she wins ₹1 with probability $0.6$ and loses ₹1 with probability $0.4$. She stops when she has ₹3 or ₹0. The probability that she reaches ₹3 is (2 decimal places)`, 0.47, 0.01,
    XR`<p>Gambler's ruin with $q/p=\dfrac23$: $P=\dfrac{1-(q/p)^i}{1-(q/p)^N}=\dfrac{1-\frac23}{1-\frac8{27}}=\dfrac{1/3}{19/27}=\dfrac9{19}\approx0.47$.</p>`, 'Even with p = 0.6 she starts with only ₹1: ruin is likely.', () => 9 / 19),
  N(5, 'expectation', XR`A fair die is rolled until all six faces have appeared at least once. The expected number of rolls is (2 decimal places)`, 14.7, 0.01,
    XR`<p>After $k$ faces have been seen, the wait for a new one is geometric with $p=\dfrac{6-k}6$, mean $\dfrac6{6-k}$. Total: $6\left(1+\dfrac12+\dfrac13+\dfrac14+\dfrac15+\dfrac16\right)=6(2.45)=14.7$.</p>`, 'The last face takes the longest (an average of 6 rolls).', () => 6 * (1 + 1 / 2 + 1 / 3 + 1 / 4 + 1 / 5 + 1 / 6)),
  X(4, 'independent events', XR`$P(A)=0.4$, $P(B)=0.5$ and $P(A\cup B)=0.7$. Which statements are true?`, [XR`$A$ and $B$ are independent`, XR`$A$ and $B$ are mutually exclusive`, XR`$P(A'\cap B')=0.3$`, XR`$P(A\mid B)=0.4$`], [0, 2, 3],
    XR`<p>$P(A\cap B)=0.4+0.5-0.7=0.2=0.4\times0.5$, so independent (A true, B false). $P(A'\cap B')=1-0.7=0.3$. $P(A\mid B)=\dfrac{0.2}{0.5}=0.4$.</p>`, 'First find P(A ∩ B) from the union.'),
  X(4, 'independent events', XR`$A$ and $B$ are independent events. Which are also true?`, [XR`$A'$ and $B$ are independent`, XR`$A'$ and $B'$ are independent`, XR`$P(A\cup B)=P(A)+P(B)$`, XR`$P(A\mid B)=P(A)$`], [0, 1, 3],
    XR`<p>Independence carries over to complements. $P(A\cup B)=P(A)+P(B)-P(A)P(B)$, so C is false (it needs $P(A)P(B)=0$). D is the definition.</p>`, 'The addition formula still has the overlap term.'),
  X(4, 'binomial distribution', XR`$X\sim B(10,0.3)$. Which statements are true?`, [XR`$E(X)=3$`, XR`$\mathrm{Var}(X)=2.1$`, XR`the most likely value of $X$ is $3$`, XR`$P(X=0)=0.3^{10}$`], [0, 1, 2],
    XR`<p>$E=np=3$; $\mathrm{Var}=npq=2.1$; the mode is the largest integer $\le(n+1)p=3.3$, i.e. $3$. $P(X=0)=0.7^{10}$, not $0.3^{10}$.</p>`, 'No successes means all failures: use q^n.'),
  X(5, 'independent events', XR`Which statements are true?`, [XR`Two mutually exclusive events with positive probabilities are dependent.`, XR`An event with probability $0$ is independent of every event.`, XR`If $A\subset B$ and $0<P(A),P(B)<1$, then $A$ and $B$ are independent.`, XR`$P(A\mid B)+P(A'\mid B)=1$ when $P(B)>0$.`], [0, 1, 3],
    XR`<p>A: $P(A\cap B)=0\ne P(A)P(B)$. B: $P(A\cap B)=0=0\cdot P(B)$. C: $P(A\cap B)=P(A)$ but $P(A)P(B)<P(A)$: dependent. D: the conditional probability is a probability.</p>`, 'Nested events are strongly dependent.'),
  X(5, 'independent events', XR`Two fair dice are thrown. $E$: the sum is $7$; $F$: the first die shows $3$; $G$: the sum is even. Which statements are true?`, [XR`$E$ and $F$ are independent`, XR`$F$ and $G$ are independent`, XR`$E$ and $G$ are independent`, XR`$E,F,G$ are mutually independent`], [0, 1],
    XR`<p>$P(E)=P(F)=\dfrac16$, $P(G)=\dfrac12$. $P(E\cap F)=\dfrac1{36}=P(E)P(F)$: yes. $P(F\cap G)=\dfrac3{36}=\dfrac1{12}=P(F)P(G)$: yes. $E\cap G=\varnothing$ (a sum of 7 is odd) so $P(E\cap G)=0\ne\dfrac1{12}$: no. So the three cannot be mutually independent.</p>`, 'Pairwise independence is not enough for mutual independence.'),
  X(4, 'expectation', XR`A fair coin is tossed $3$ times and $X$ is the number of heads. Which statements are true?`, [XR`$E(X)=1.5$`, XR`$\mathrm{Var}(X)=0.75$`, XR`$P(X\ge2)=\dfrac12$`, XR`$P(X=1)=\dfrac14$`], [0, 1, 2],
    XR`<p>$X\sim B(3,\frac12)$: $E=1.5$, $\mathrm{Var}=0.75$. $P(X\ge2)=\dfrac{3+1}8=\dfrac12$. $P(X=1)=\dfrac38$.</p>`, 'P(X = 1) = 3/8, not 1/4.'),
  X(5, 'derangements', XR`Four letters are put at random into four envelopes (one each). Which statements are true?`, [XR`$P(\text{no letter correct})=\dfrac38$`, XR`$P(\text{exactly 3 correct})=0$`, XR`$P(\text{exactly 2 correct})=\dfrac14$`, XR`The expected number of correct letters is $2$`], [0, 1, 2],
    XR`<p>$\dfrac9{24}=\dfrac38$; three correct forces the fourth correct, so $0$; $\dfrac6{24}=\dfrac14$. The expected number correct is $4\times\dfrac14=1$ (by linearity), so D is false.</p>`, 'Each letter is correct with probability 1/4.'),
  X(5, 'geometric trials', XR`A fair die is rolled until a six appears. Which statements are true?`, [XR`$P(\text{first six on roll 3})=\left(\dfrac56\right)^2\dfrac16$`, XR`The expected number of rolls is $6$`, XR`$P(\text{more than 2 rolls})=\left(\dfrac56\right)^2$`, XR`$P(\text{at most 2 rolls})=\dfrac1{36}$`], [0, 1, 2],
    XR`<p>A, B and C are the standard geometric results. $P(\text{at most 2})=\dfrac16+\dfrac56\cdot\dfrac16=\dfrac{11}{36}$, not $\dfrac1{36}$.</p>`, 'At most two rolls includes the first roll succeeding.'),
  X(4, 'conditional probability', XR`One card is drawn from a pack of $52$. Which statements are true?`, [XR`$P(\text{king}\mid\text{red})=\dfrac1{13}$`, XR`$P(\text{heart}\mid\text{face card})=\dfrac14$`, XR`$P(\text{face card}\mid\text{heart})=\dfrac3{13}$`, XR`$P(\text{heart}\mid\text{red})=\dfrac14$`], [0, 1, 2],
    XR`<p>A: $\dfrac2{26}=\dfrac1{13}$. B: $\dfrac3{12}=\dfrac14$. C: $\dfrac3{13}$. D: half of the red cards are hearts, so $\dfrac12$, not $\dfrac14$.</p>`, 'Restrict to the conditioning set first.'),
  X(5, 'expectation', XR`Two fair dice are thrown. Which statements are true?`, [XR`$E(\text{sum})=7$`, XR`$E(\text{product})=\dfrac{49}4$`, XR`$E(\text{larger})=\dfrac{161}{36}$`, XR`$E(\text{smaller})=3.5$`], [0, 1, 2],
    XR`<p>Sum: $3.5+3.5$. Product: independent, $3.5\times3.5=12.25$. Larger: $\dfrac{161}{36}\approx4.47$. Smaller: $\dfrac{91}{36}\approx2.53$ (the larger and smaller sum to $7$), so D is false.</p>`, 'Larger + smaller = sum, so their averages add to 7.'),
  S(4, 'independent events', XR`Events that are pairwise independent are always mutually independent.`, XR`Events that are mutually independent are always pairwise independent.`, 2,
    XR`<p>I is false: with two fair coins, let $A$ = first is H, $B$ = second is H, $C$ = the two coins match. Each pair is independent but $P(A\cap B\cap C)=\dfrac14\ne\dfrac18$. II is true (it is part of the definition).</p>`, 'Mutual independence demands more conditions than pairs.'),
  S(5, 'expectation', XR`The expected value of a fair die roll is $3.5$, so $3.5$ is a possible outcome of a roll.`, XR`The expected value of a random variable need not be one of its possible values.`, 2,
    XR`<p>I is false: a die shows only $1$ to $6$. II is true: expectation is an average, not an outcome.</p>`, 'Expectation is a long-run average.'),
  SC(4, 'basic concepts', [XR`$P(A\cap B)\le\min\{P(A),P(B)\}$ for all events.`, XR`$P(A\cup B)\ge\max\{P(A),P(B)\}$ for all events.`, XR`If $P(A)=1$ then $A$ is independent of every event.`, XR`$P(A\mid B)\le P(A)$ for all events with $P(B)>0$.`], '3', ['1', '2', '4'],
    XR`<p>1: true. 2: true. 3: $P(A\cap B)=P(B)=P(A)P(B)$, true. 4: false: conditioning can raise the probability (e.g. $B\subset A$). Three are correct.</p>`, 'Knowing B can make A more likely.'),
  SC(5, 'mixed concepts', [XR`In $B(n,p)$ the variance is at least the mean.`, XR`The variance of any random variable is non-negative.`, XR`If $A$ and $B$ are independent then $P(A\cap B')=P(A)P(B')$.`, XR`$E(XY)=E(X)E(Y)$ for all random variables $X,Y$.`], '2', ['1', '3', '4'],
    XR`<p>1: false ($npq\le np$). 2: true. 3: true. 4: false (needs independence, or at least uncorrelated). Two are correct.</p>`, 'The factor q = 1 − p is at most 1.'),
  A(4, 'independent events', XR`The probability of at least one success in $n$ independent trials with success probability $p$ is $1-(1-p)^n$.`, XR`The only way to have no success is to fail in every trial.`, 0,
    XR`<p>$P(\text{no success})=(1-p)^n$ by independence, and R explains why that is the complement of 'at least one'. So both are true and R explains A.</p>`, 'Complement of "at least one" is "none".'),
  A(4, 'binomial mean and variance', XR`In a binomial distribution the variance is never greater than the mean.`, XR`$\mathrm{Var}=npq=(\text{mean})\times q$ and $q\le1$.`, 0,
    XR`<p>$\mathrm{Var}=\text{mean}\times q\le\text{mean}$ since $0\le q\le1$. R proves A.</p>`, 'Equality only in the degenerate case q = 1.'),
  A(5, 'conditional probability', XR`If $P(A)=P(B)>0$ then $P(A\mid B)=P(B\mid A)$.`, XR`$P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}$ and $P(B\mid A)=\dfrac{P(A\cap B)}{P(A)}$.`, 0,
    XR`<p>The two conditional probabilities have the same numerator, and equal denominators when $P(A)=P(B)$. R shows why.</p>`, 'Only the denominators differ.'),
  // ---- passages ----
  PN(4, 'total probability', 'xp5', XR`Find the probability that the ball drawn from Box II is white (2 decimal places).`, 0.43, 0.01,
    XR`<p>If a white ball moved (probability $\frac35$), Box II has $3$ white of $6$; if a black ball moved (probability $\frac25$), it has $2$ white of $6$. $P(\text{white})=\dfrac35\cdot\dfrac36+\dfrac25\cdot\dfrac26=\dfrac3{10}+\dfrac2{15}=\dfrac{13}{30}\approx0.43$.</p>`, 'The moved ball changes Box II to 6 balls.', () => 13 / 30),
  PN(5, 'Bayes theorem', 'xp5', XR`Given that the ball drawn from Box II is white, find the probability that the ball moved from Box I was white (2 decimal places).`, 0.69, 0.01,
    XR`<p>$P=\dfrac{\frac35\cdot\frac36}{13/30}=\dfrac{3/10}{13/30}=\dfrac9{13}\approx0.69$.</p>`, 'Bayes: divide by the total probability of white.', () => 9 / 13),
  PM(4, 'total probability', 'xp5', XR`The probability that the ball drawn from Box II is black is`, XR`$\dfrac{17}{30}$`, [XR`$\dfrac{13}{30}$`, XR`$\dfrac{3}{5}$`, XR`$\dfrac{7}{15}$`],
    XR`<p>It is the complement of white: $1-\dfrac{13}{30}=\dfrac{17}{30}$.</p>`, 'Complement of the previous result.'),
  PI(3, 'probability distribution', 'xp6', XR`Find $E(X)$.`, 2,
    XR`<p>$k(1+2+3+4)=1$, so $k=\dfrac1{10}$. $E(X)=\dfrac{0\cdot1+1\cdot2+2\cdot3+3\cdot4}{10}=\dfrac{20}{10}=2$.</p>`, 'The probabilities are 1/10, 2/10, 3/10, 4/10.', () => (0 + 2 + 6 + 12) / 10),
  PI(4, 'variance', 'xp6', XR`Find $\mathrm{Var}(X)$.`, 1,
    XR`<p>$E(X^2)=\dfrac{0+1\cdot2+4\cdot3+9\cdot4}{10}=\dfrac{50}{10}=5$. $\mathrm{Var}=5-2^2=1$.</p>`, 'Use E(X²) − (E X)².', () => 5 - 4),
  PN(3, 'probability distribution', 'xp6', XR`Find $P(X\ge2)$ (1 decimal place).`, 0.7, 0.01,
    XR`<p>$P(X=2)+P(X=3)=\dfrac3{10}+\dfrac4{10}=0.7$.</p>`, 'Add the last two probabilities.', () => 0.7),
  PN(5, 'recursion', 'xp7', XR`What is the probability that the game stops exactly at the $4$th toss? (3 decimal places)`, 0.125, 0.005,
    XR`<p>The sequences that end at toss 4 with the first HH at tosses 3 and 4: the toss before them must be T, and the first toss is free: TTHH and HTHH. $\dfrac2{16}=0.125$.</p>`, 'The toss just before the final HH must be a tail.', () => 2 / 16),
  PN(5, 'recursion', 'xp7', XR`What is the probability that the game lasts more than $4$ tosses? (2 decimal places)`, 0.5, 0.01,
    XR`<p>It stops at toss 2 with probability $\dfrac14$ (HH), at toss 3 with $\dfrac18$ (THH), at toss 4 with $\dfrac18$. Total $\dfrac12$. So it lasts more than 4 tosses with probability $\dfrac12$.</p>`, 'Add the three stopping probabilities and subtract from 1.', () => 1 - (0.25 + 0.125 + 0.125)),
  PI(5, 'recursion', 'xp7', XR`What is the expected number of tosses?`, 6,
    XR`<p>Let $E_0$ be the expected number from the start, and $E_1$ the expected number after a head. $E_0=1+\frac12E_1+\frac12E_0$ and $E_1=1+\frac12\cdot0+\frac12E_0$. From the second, $E_1=1+\frac12E_0$. Substituting: $E_0=1+\frac12+\frac14E_0+\frac12E_0$, so $\frac14E_0=\frac32$ and $E_0=6$.</p>`, 'After a head, a tail sends you back to the start.', () => 6),
);

XGN.push(
  GX('xg01', 3, 'nat', 'integer', 'binomial distribution', (rng) => {
    const n = int(rng, 6, 9), k = int(rng, 2, 4);
    return { n, k, answer: xC(n, k), tol: 0, q: XR`A fair coin is tossed ${n} times. The probability of exactly ${k} heads is $\dfrac m{${2 ** n}}$. Find $m$.`, sol: XR`<p>$P=\dbinom{${n}}{${k}}\left(\dfrac12\right)^{${n}}=\dfrac{${xC(n, k)}}{${2 ** n}}$. So $m=${xC(n, k)}$.</p>` };
  }, (p) => { let c = 0; for (let mask = 0; mask < 2 ** p.n; mask++) { let h = 0; for (let b = 0; b < p.n; b++) h += (mask >> b) & 1; if (h === p.k) c++; } return c; }),
  GX('xg02', 4, 'nat', 'integer', 'binomial distribution', (rng) => {
    const pd = choose(rng, [2, 3, 4, 6]), t = choose(rng, [0.9, 0.95, 0.99]);
    let n = 1; while (1 - (1 - 1 / pd) ** n <= t + 1e-12) n++;
    return { pd, t, answer: n, tol: 0, q: XR`An event has probability $\dfrac1${pd}$ in each independent trial. What is the smallest number of trials so that the probability of at least one occurrence exceeds $${t}$?`, sol: XR`<p>$1-\left(\dfrac{${pd - 1}}${pd}\right)^n>${t}$ means $\left(\dfrac{${pd - 1}}${pd}\right)^n<${+(1 - t).toFixed(2)}$. So $n>\dfrac{\ln ${+(1 - t).toFixed(2)}}{\ln(${pd - 1}/${pd})}=${(Math.log(1 - t) / Math.log((pd - 1) / pd)).toFixed(2)}$. The smallest integer is $${n}$.</p>` };
  }, (p) => { let n = 0, q = 1; while (1 - q <= p.t + 1e-12) { q *= (p.pd - 1) / p.pd; n++; } return n; }),
  GX('xg03', 4, 'mcq', 'single', 'Bayes theorem', (rng) => {
    const a = int(rng, 2, 5), c = int(rng, 6, 9);
    const g = xgcd(a, a + c);
    const { options, answer } = shuffleOpts(rng, `$${frac(a, a + c)}$`, [`$${frac(c, a + c)}$`, `$${frac(a, 10)}$`, `$\\dfrac12$`]);
    return { a, c, options, answer, q: XR`Bag A has ${a} red and ${10 - a} blue balls, and Bag B has ${c} red and ${10 - c} blue balls. A bag is chosen at random and a ball drawn from it is red. The probability that it came from Bag A is`, sol: XR`<p>$P(A\mid\text{red})=\dfrac{\frac12\cdot\frac{${a}}{10}}{\frac12\cdot\frac{${a}}{10}+\frac12\cdot\frac{${c}}{10}}=\dfrac{${a}}{${a + c}}$.</p>` };
  }, (p) => { const pa = 0.5 * p.a / 10, pb = 0.5 * p.c / 10; return Math.abs(pa / (pa + pb) - p.a / (p.a + p.c)) < 1e-12 ? p.answer : -1; }),
  GX('xg04', 4, 'nat', 'numeric', 'binomial distribution', (rng) => {
    const n = int(rng, 5, 10), p = choose(rng, [0.1, 0.2, 0.3, 0.4]);
    const ans = 1 - (1 - p) ** n;
    return { n, pp: p, answer: +ans.toFixed(4), tol: 0.01, q: XR`$X\sim B(${n},${p})$. Find the probability of at least one success (2 decimal places).`, sol: XR`<p>$P(X\ge1)=1-(1-p)^n=1-${(1 - p).toFixed(1)}^{${n}}=1-${((1 - p) ** n).toFixed(4)}=${ans.toFixed(2)}$.</p>` };
  }, (p) => { let s = 0; for (let k = 1; k <= p.n; k++) s += xbin(p.n, k, p.pp); return s; }),
  GX('xg05', 4, 'nat', 'integer', 'expectation', (rng) => {
    const n = choose(rng, [4, 7, 10, 13]);
    return { n, answer: (2 * n + 1) / 3, tol: 0, q: XR`A random variable $X$ takes the values $1,2,\dots,${n}$ with $P(X=x)=kx$. Find $E(X)$.`, sol: XR`<p>$k\cdot\dfrac{${n}\cdot${n + 1}}2=1$ gives $k=\dfrac2{${n * (n + 1)}}$. $E(X)=k\sum x^2=\dfrac2{${n * (n + 1)}}\cdot\dfrac{${n}\cdot${n + 1}\cdot${2 * n + 1}}6=\dfrac{${2 * n + 1}}3=${(2 * n + 1) / 3}$.</p>` };
  }, (p) => { let s1 = 0, s2 = 0; for (let x = 1; x <= p.n; x++) { s1 += x; s2 += x * x; } return Math.round(s2 / s1); }),
  GX('xg06', 4, 'mcq', 'single', 'classical probability', (rng) => {
    const s = int(rng, 4, 10);
    let cnt = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= s) cnt++;
    const { options, answer } = shuffleOpts(rng, `$${frac(cnt, 36)}$`, [`$${frac(cnt + 1, 36)}$`, `$${frac(cnt - 1, 36)}$`, `$${frac(36 - cnt, 36)}$`]);
    return { s, cnt, options, answer, q: XR`Two fair dice are thrown. The probability that the sum is at least ${s} is`, sol: XR`<p>Count the ordered pairs with sum $\ge${s}$: ${cnt} pairs out of $36$. So the probability is $${frac(cnt, 36)}$.</p>` };
  }, (p) => (xdice2((a, b) => a + b >= p.s) === p.cnt ? p.answer : -1)),
  GX('xg07', 5, 'nat', 'numeric', 'games', (rng) => {
    const p = choose(rng, [0.55, 0.6, 0.7]), N = choose(rng, [4, 5]), i = int(rng, 1, 2);
    const r = (1 - p) / p; const ans = (1 - r ** i) / (1 - r ** N);
    return { pp: p, N, i, answer: +ans.toFixed(4), tol: 0.01, q: XR`A gambler has ₹${i} and plays rounds in which she wins ₹1 with probability $${p}$ and loses ₹1 otherwise. She stops when she has ₹${N} or ₹0. The probability that she reaches ₹${N} is (2 decimal places)`, sol: XR`<p>Gambler's ruin with $\dfrac qp=\dfrac{${(1 - p).toFixed(2)}}{${p}}$: $P=\dfrac{1-(q/p)^{${i}}}{1-(q/p)^{${N}}}\approx${ans.toFixed(2)}$.</p>` };
  }, (p) => { const P = new Array(p.N + 1).fill(0); P[p.N] = 1; for (let it = 0; it < 20000; it++) for (let k = 1; k < p.N; k++) P[k] = p.pp * P[k + 1] + (1 - p.pp) * P[k - 1]; return P[p.i]; }),
  GX('xg08', 5, 'nat', 'integer', 'recursion', (rng) => {
    const n = int(rng, 2, 5);
    return { n, answer: 2 ** (n + 1) - 2, tol: 0, q: XR`A fair coin is tossed until ${n} heads appear in a row. Find the expected number of tosses.`, sol: XR`<p>Let $E_k$ be the expected further tosses after $k$ heads in a row. $E_k=1+\frac12E_{k+1}+\frac12E_0$ with $E_{${n}}=0$. Solving gives $E_0=2^{${n + 1}}-2=${2 ** (n + 1) - 2}$.</p>` };
  }, (p) => { const E = new Array(p.n + 1).fill(0); for (let it = 0; it < 200000; it++) for (let k = 0; k < p.n; k++) E[k] = 1 + 0.5 * E[k + 1] + 0.5 * E[0]; return Math.round(E[0]); }),
  GX('xg09', 4, 'nat', 'integer', 'binomial variance', (rng) => {
    const [n, pp, v] = choose(rng, [[20, 0.5, 5], [16, 0.25, 3], [25, 0.2, 4], [100, 0.1, 9]]);
    const a = int(rng, 2, 4), b = int(rng, 1, 5);
    return { n, pp, a, b, answer: a * a * v, tol: 0, q: XR`$X\sim B(${n},${pp})$. Find $\mathrm{Var}(${a}X+${b})$.`, sol: XR`<p>$\mathrm{Var}(X)=npq=${n}\times${pp}\times${+(1 - pp).toFixed(2)}=${v}$. $\mathrm{Var}(${a}X+${b})=${a}^2\cdot${v}=${a * a * v}$ (the shift $+${b}$ does not matter).</p>` };
  }, (p) => { let m = 0, m2 = 0; for (let k = 0; k <= p.n; k++) { const pk = xbin(p.n, k, p.pp), y = p.a * k + p.b; m += y * pk; m2 += y * y * pk; } return Math.round(m2 - m * m); }),
  GX('xg10', 4, 'mcq', 'single', 'geometric trials', (rng) => {
    const pd = choose(rng, [3, 4, 5, 6]);
    const pr = 1 / pd; const ans = (1 - pr) / (2 - pr);
    const { options, answer } = shuffleOpts(rng, `$${frac(pd - 1, 2 * pd - 1)}$`, [`$${frac(1, 2 * pd - 1)}$`, `$\\dfrac12$`, `$${frac(pd - 1, pd)}$`]);
    return { pd, pr, ans, options, answer, q: XR`A trial succeeds with probability $\dfrac1${pd}$. Trials are repeated until the first success. The probability that the first success occurs on an even-numbered trial is`, sol: XR`<p>$\sum_{k\text{ even}}q^{k-1}p=\dfrac{qp}{1-q^2}=\dfrac q{1+q}$ with $q=\dfrac{${pd - 1}}${pd}$: $\dfrac{${pd - 1}}{${2 * pd - 1}}$.</p>` };
  }, (p) => { let s = 0, q = 1 - p.pr; for (let k = 2; k < 4000; k += 2) s += q ** (k - 1) * p.pr; return Math.abs(s - p.ans) < 1e-9 && Math.abs(p.ans - (p.pd - 1) / (2 * p.pd - 1)) < 1e-12 ? p.answer : -1; }),
);

Object.assign(groups, XG); items.push(...XIT); gens.push(...XGN);
}
// ==XP-END
export default { topic: 'probability', groups, items, gens };
