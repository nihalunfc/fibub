// Sequences and series (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
// Numeric answers were checked in code (the `calc` fields and the gens' verify() recompute by loops or other formulas).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 0, 2];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (id, level, sub, extra) => ({ id, level, exams: EXS[level], sub, ...extra });
const M = (id, level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (id, level, sub, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (id, level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
const X = (id, level, sub, q, options, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
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
const A = (id, level, sub, a, r, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (id, level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
const MT = (id, level, sub, group, q, correct, wrongs, sol, trap) =>
  base(id, level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const P = (id, level, sub, group, q, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'passage', group, q, ...place(correct, wrongs), sol, trap, ...more });
const PI = (id, level, sub, group, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (id, level, sub, group, q, answer, tol, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, sol, trap, ...more });

// ---------- brute-force helpers ----------
const apT = (a, d, n) => a + (n - 1) * d;
const apS = (a, d, n) => { let s = 0; for (let k = 0; k < n; k++) s += a + k * d; return s; };
const gpS = (a, r, n) => { let s = 0, t = a; for (let k = 0; k < n; k++) { s += t; t *= r; } return s; };
const sumTo = (f, lo, hi) => { let s = 0; for (let k = lo; k <= hi; k++) s += f(k); return s; };
const fact = (n) => (n < 2 ? 1 : n * fact(n - 1));

const groups = {
  m1: {
    title: 'Sums of standard series',
    passage: R`<p>Match each sum in List I with its value in List II.</p>`,
    list1: ['A. $1+2+3+\\cdots+10$', 'B. $1^2+2^2+\\cdots+6^2$', 'C. $1^3+2^3+\\cdots+5^3$', 'D. the sum of the first 12 odd numbers'],
    list2: ['p. 91', 'q. 144', 'r. 55', 's. 225'],
  },
  m2: {
    title: 'Sums of infinite geometric series',
    passage: R`<p>Match each infinite series in List I with its sum in List II.</p>`,
    list1: ['A. $1+\\dfrac12+\\dfrac14+\\cdots$', 'B. $1-\\dfrac12+\\dfrac14-\\cdots$', 'C. $0.333\\ldots$', 'D. $1+\\dfrac13+\\dfrac19+\\cdots$'],
    list2: ['p. $\\dfrac23$', 'q. $\\dfrac13$', 'r. $2$', 's. $\\dfrac32$'],
  },
  m3: {
    title: 'Means of 2 and 8',
    passage: R`<p>Take the two positive numbers $2$ and $8$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. Arithmetic mean', 'B. Geometric mean', 'C. Harmonic mean', 'D. (AM) $\\times$ (HM)'],
    list2: ['p. 4', 'q. 5', 'r. $\\dfrac{16}5$', 's. 16'],
  },
  p1: {
    title: 'Passage: seats in a hall',
    passage: R`<p>A hall has 25 rows of seats. The first row has 20 seats and each row has 3 seats more than the row in front of it. So the rows form an AP with $a=20$ and $d=3$.</p>`,
  },
  p2: {
    title: 'Passage: a bouncing ball',
    passage: R`<p>A ball is dropped from a height of 16 m. After each bounce it rises to $\dfrac34$ of the height it fell from. The heights after the bounces, $16\cdot\dfrac34,\ 16\cdot\left(\dfrac34\right)^2,\dots$ form a GP.</p>`,
  },
  p3: {
    title: 'Passage: a recurrence',
    passage: R`<p>A sequence is defined by $a_1=3$ and $a_{n+1}=2a_n-1$ for $n\ge1$. Subtracting 1 from both sides gives $a_{n+1}-1=2(a_n-1)$, so the numbers $b_n=a_n-1$ form a GP.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  I('ss-001', 1, 'nth term of AP', R`Find the 10th term of the AP $3,7,11,15,\dots$`, 39,
    R`<p>$a=3$, $d=4$. $a_n=a+(n-1)d$, so $a_{10}=3+9\times4=39$.</p>`, 'The 10th term needs 9 steps of $d$, not 10.', { calc: () => apT(3, 4, 10) }),
  M('ss-002', 1, 'sum of natural numbers', R`The sum of the first 20 natural numbers is`, '210', ['200', '420', '190'],
    R`<p>$1+2+\cdots+n=\dfrac{n(n+1)}2$. For $n=20$: $\dfrac{20\times21}2=210$.</p>`, '420 forgets to divide by 2.'),
  M('ss-003', 1, 'nth term of GP', R`The 5th term of the GP $2,6,18,\dots$ is`, '162', ['486', '54', '32'],
    R`<p>$a=2$, $r=3$. $a_n=ar^{n-1}$, so $a_5=2\times3^4=162$.</p>`, '486 is the 6th term: the power is $n-1$.'),
  I('ss-004', 1, 'sum of an AP', R`Find the sum of the first 10 terms of the AP with first term 5 and common difference 3.`, 185,
    R`<p>$S_n=\dfrac n2\,[2a+(n-1)d]$. $S_{10}=5\,[10+27]=5\times37=185$.</p>`, 'Inside the bracket it is $2a$, not $a$.', { calc: () => apS(5, 3, 10) }),
  M('ss-005', 1, 'harmonic mean', R`The harmonic mean of 4 and 12 is`, '6', ['8', '$4\\sqrt3$', '9'],
    R`<p>$\text{HM}=\dfrac{2ab}{a+b}=\dfrac{2\times4\times12}{16}=6$.</p><p>8 is the AM and $4\sqrt3$ is the GM.</p>`, 'HM is the smallest of the three means.'),
  I('ss-006', 1, 'infinite GP', R`Find the sum of the infinite GP $6+3+\dfrac32+\dfrac34+\cdots$`, 12,
    R`<p>$a=6$, $r=\dfrac12$, $|r|<1$. $S_\infty=\dfrac a{1-r}=\dfrac6{1/2}=12$.</p>`, 'Divide by $1-r=\dfrac12$, not by $\dfrac12$ of 6.', { calc: () => 6 / (1 - 0.5) }),
  M('ss-007', 1, 'sum of cubes', R`The value of $1^3+2^3+3^3+4^3+5^3$ is`, '225', ['55', '125', '120'],
    R`<p>$\sum k^3=\left[\dfrac{n(n+1)}2\right]^2=15^2=225$. (Direct: $1+8+27+64+125=225$.)</p>`, '55 is the sum of squares.'),
  I('ss-008', 1, 'common difference', R`The 3rd term of an AP is 11 and its 7th term is 27. Find the common difference.`, 4,
    R`<p>From the 3rd to the 7th term there are 4 steps of $d$. $4d=27-11=16$, so $d=4$.</p>`, 'Count the steps: $7-3=4$.', { calc: () => (27 - 11) / (7 - 3) }),
  M('ss-009', 1, 'identify a GP', R`Which of the following is a GP?`, R`$5,10,20,40,\dots$`, [R`$1,4,9,16,\dots$`, R`$2,4,6,8,\dots$`, R`$1,2,4,7,\dots$`],
    R`<p>A GP has a constant ratio. $5,10,20,40$ has ratio 2 each time. $1,4,9,16$ has ratios $4,\tfrac94,\dots$; $2,4,6,8$ is an AP; $1,2,4,7$ has ratios $2,2,\tfrac74$.</p>`, 'Check every consecutive ratio, not only the first two.'),
  I('ss-010', 1, 'number of terms', R`How many terms are there in the AP $7,13,19,\dots,151$?`, 25,
    R`<p>$l=a+(n-1)d$: $151=7+(n-1)6$, so $n-1=24$ and $n=25$.</p>`, 'Add 1 after dividing: $n=\dfrac{l-a}d+1$.', { calc: () => (151 - 7) / 6 + 1 }),
  M('ss-011', 1, 'geometric mean', R`The geometric mean of 4 and 16 is`, '8', ['10', '64', R`$\dfrac{32}5$`],
    R`<p>$\text{GM}=\sqrt{ab}=\sqrt{64}=8$. The AM is 10 and the HM is $\dfrac{32}5$.</p>`, '64 is the product; take the square root.'),

  // ---------- L2 standard ----------
  I('ss-012', 2, 'sum of an AP', R`Find the sum $2+5+8+\cdots+98$.`, 1650,
    R`<p>First find the number of terms: $98=2+(n-1)3$ gives $n=33$. $S=\dfrac n2(a+l)=\dfrac{33}2(2+98)=33\times50=1650$.</p>`, 'Find $n$ first.', { calc: () => apS(2, 3, 33) }),
  I('ss-013', 2, 'nth term of AP', R`In an AP the 5th term is 18 and the 12th term is 39. Find the 20th term.`, 63,
    R`<p>$7d=39-18=21$, so $d=3$. Then $a_{20}=a_{12}+8d=39+24=63$.</p>`, 'Go from a known term, not from $a$.', { calc: () => 39 + 8 * ((39 - 18) / 7) }),
  M('ss-014', 2, 'term from the sum', R`The sum of the first $n$ terms of a sequence is $S_n=3n^2+2n$. Its 10th term is`, '59', ['320', '61', '56'],
    R`<p>$a_n=S_n-S_{n-1}$. $S_{10}=320$ and $S_9=243+18=261$. So $a_{10}=320-261=59$. (In general $a_n=6n-1$.)</p>`, '320 is $S_{10}$, the sum, not the term.'),
  I('ss-015', 2, 'arithmetic means', R`Four arithmetic means are inserted between 3 and 28. Find the sum of these four means.`, 62,
    R`<p>The AP is $3,\ \_,\_,\_,\_,\ 28$ with 6 terms and $d=\dfrac{28-3}5=5$. The means are 8, 13, 18, 23, with sum 62. Shortcut: the sum of $k$ AMs is $k\times\dfrac{a+b}2=4\times15.5=62$.</p>`, 'Do not include 3 and 28 in the sum.', { calc: () => sumTo((k) => 3 + 5 * k, 1, 4) }),
  M('ss-016', 2, 'sum of a GP', R`The 3rd term of a GP is 12 and its 6th term is 96. The sum of its first 8 terms is`, '765', ['381', '1530', '768'],
    R`<p>$r^3=\dfrac{96}{12}=8$, so $r=2$. $a=\dfrac{12}{r^2}=3$. $S_8=\dfrac{3(2^8-1)}{2-1}=3\times255=765$.</p>`, '768 is $3\\cdot2^8$: it forgets the $-1$.'),
  I('ss-017', 2, 'sum of squares', R`Find $1^2+2^2+\cdots+12^2$.`, 650,
    R`<p>$\sum k^2=\dfrac{n(n+1)(2n+1)}6=\dfrac{12\times13\times25}6=650$.</p>`, 'It is $2n+1$ in the last bracket.', { calc: () => sumTo((k) => k * k, 1, 12) }),
  N('ss-018', 2, 'infinite GP', R`An infinite GP has first term 8 and sum 20. Find its third term.`, 2.88, 0.01,
    R`<p>$\dfrac8{1-r}=20$ gives $1-r=0.4$, $r=0.6$. Third term $=ar^2=8\times0.36=2.88$.</p>`, 'The third term uses $r^2$.', { calc: () => 8 * (1 - 8 / 20) ** 2 }),
  I('ss-019', 2, 'sum of an AP', R`In an AP the 8th term is 12. Find the sum of its first 15 terms.`, 180,
    R`<p>$S_{15}=\dfrac{15}2(a_1+a_{15})$ and $a_1+a_{15}=2a_8$ (terms equally far from the 8th). So $S_{15}=15a_8=180$.</p>`, 'For an odd number of terms, the sum is $n\\times$ the middle term.', { calc: () => 15 * 12 }),
  I('ss-020', 2, 'three numbers in AP', R`Three numbers in AP have sum 21 and product 315. Find the largest of them.`, 9,
    R`<p>Take $7-d,\ 7,\ 7+d$ (sum 21). Product: $7(49-d^2)=315$, so $49-d^2=45$ and $d=\pm2$. The numbers are 5, 7, 9; the largest is 9.</p>`, 'Taking the middle term as the unknown keeps the sum simple.', { calc: () => 7 + Math.sqrt(49 - 315 / 7) }),
  M('ss-021', 2, 'AM, GM, HM', R`For two positive numbers the AM is 10 and the GM is 8. Their HM is`, '6.4', ['6', '5', '12.8'],
    R`<p>For two numbers $\text{GM}^2=\text{AM}\times\text{HM}$. So $\text{HM}=\dfrac{64}{10}=6.4$.</p>`, 'The relation is $G^2=A\\cdot H$, not $G=A\\cdot H$.'),
  I('ss-022', 2, 'sum of products', R`Find $1\cdot2+2\cdot3+3\cdot4+\cdots+10\cdot11$.`, 440,
    R`<p>$\sum k(k+1)=\dfrac{n(n+1)(n+2)}3=\dfrac{10\times11\times12}3=440$.</p>`, 'The last factor is $n+2$.', { calc: () => sumTo((k) => k * (k + 1), 1, 10) }),
  M('ss-023', 2, 'recurring decimal', R`The recurring decimal $0.777\ldots$ equals`, R`$\dfrac79$`, [R`$\dfrac7{10}$`, R`$\dfrac7{99}$`, R`$\dfrac78$`],
    R`<p>$0.777\ldots=\dfrac7{10}+\dfrac7{100}+\cdots$, a GP with $a=0.7$, $r=0.1$. Sum $=\dfrac{0.7}{0.9}=\dfrac79$.</p>`, 'One repeating digit gives a denominator 9.'),
  M('ss-024', 2, 'AP and reciprocals', R`If $a,b,c$ are positive numbers in AP, then $\dfrac1{bc},\ \dfrac1{ca},\ \dfrac1{ab}$ are in`, 'AP', ['GP', 'HP', 'none of these'],
    R`<p>Multiply each term by $abc$: $\dfrac{abc}{bc}=a$, $\dfrac{abc}{ca}=b$, $\dfrac{abc}{ab}=c$. Multiplying every term of a sequence by a constant keeps it an AP, and $a,b,c$ are in AP.</p>`, 'It is not HP: the reciprocals of $a,b,c$ would be.'),
  I('ss-025', 2, 'GP sum', R`How many terms of the GP $1,2,4,8,\dots$ must be added so that the sum first exceeds 1000?`, 10,
    R`<p>$S_n=2^n-1>1000$ needs $2^n>1001$. $2^9=512$ is too small and $2^{10}=1024$ works. So $n=10$ (the sum is 1023).</p>`, '$2^9-1=511$ is not enough.', { calc: () => { let n = 0; while (gpS(1, 2, n) <= 1000) n++; return n; } }),
  A('ss-026', 2, 'identifying sequences', R`The sequence $1,4,9,16,25,\dots$ is neither an AP nor a GP.`,
    R`The differences $3,5,7,\dots$ are not constant and the ratios $4,\tfrac94,\tfrac{16}9,\dots$ are not constant.`, 0,
    R`<p>Both statements are true, and R is exactly the test for AP (constant difference) and GP (constant ratio) failing. So R explains A.</p>`, 'The squares are a quadratic sequence, a different type.'),
  S('ss-027', 2, 'sums of odd and even numbers', R`The sum of the first $n$ odd natural numbers is $n^2$.`, R`The sum of the first $n$ even natural numbers is $n(n+1)$.`, 0,
    R`<p>Odd numbers: $1+3+\cdots+(2n-1)=\dfrac n2(1+2n-1)=n^2$. Even numbers: $2+4+\cdots+2n=\dfrac n2(2+2n)=n(n+1)$. Both are true.</p>`, 'Evens are 2, 4, ...: $n(n+1)$ and not $n^2$.'),
  I('ss-028', 2, 'sum of multiples', R`Find the sum of all multiples of 7 between 100 and 200.`, 2107,
    R`<p>The multiples are $105,112,\dots,196$. $n=\dfrac{196-105}7+1=14$. $S=\dfrac{14}2(105+196)=7\times301=2107$.</p>`, 'The first multiple above 100 is 105, not 100.', { calc: () => { let s = 0; for (let k = 101; k < 200; k++) if (k % 7 === 0) s += k; return s; } }),
  I('ss-029', 2, 'three numbers in GP', R`Three positive numbers in GP have product 216 and sum 26. Find the largest.`, 18,
    R`<p>Take $\dfrac6r,\ 6,\ 6r$: the product is $6^3=216$ for any $r$. Sum: $6\left(r+1+\dfrac1r\right)=26$, so $r+\dfrac1r=\dfrac{10}3$, giving $r=3$ or $\dfrac13$. The numbers are 2, 6, 18.</p>`, 'The middle term is the cube root of the product.', { calc: () => 6 * 3 }),

  // ---------- L3 exam ----------
  I('ss-030', 2, 'AM-GM minimum', R`For $x>0$, find the least value of $9x+\dfrac{16}x$.`, 24,
    R`<p>AM-GM on the two terms: $9x+\dfrac{16}x\ge2\sqrt{9x\cdot\dfrac{16}x}=2\sqrt{144}=24$. Equality when $9x=\dfrac{16}x$, i.e. $x=\dfrac43>0$, so 24 is reached.</p>`, 'Check that equality is attainable.', { calc: () => { let m = 1e9; for (let x = 0.01; x < 20; x += 0.001) m = Math.min(m, 9 * x + 16 / x); return Math.round(m); } }),
  I('ss-031', 3, 'AM-GM with three terms', R`For $x>0$, find the least value of $x^2+\dfrac{16}x$.`, 12,
    R`<p>Split the second term so that the powers of $x$ cancel: $x^2+\dfrac8x+\dfrac8x\ge3\sqrt[3]{x^2\cdot\dfrac8x\cdot\dfrac8x}=3\sqrt[3]{64}=12$. Equality at $x^2=\dfrac8x$, $x=2$: $4+4+4=12$.</p>`, 'Using two terms only gives $2\\sqrt{16x}$, which is not constant.', { calc: () => { let m = 1e9; for (let x = 0.01; x < 20; x += 0.0005) m = Math.min(m, x * x + 16 / x); return Math.round(m); } }),
  I('ss-032', 3, 'AM-GM maximum', R`For $0<x<6$, find the greatest value of $x^2(6-x)$.`, 32,
    R`<p>Write $x^2(6-x)=4\cdot\dfrac x2\cdot\dfrac x2\cdot(6-x)$. The three factors have sum $\dfrac x2+\dfrac x2+6-x=6$, constant. AM-GM: product $\le\left(\dfrac63\right)^3=8$. So the maximum is $4\times8=32$, at $\dfrac x2=6-x$, i.e. $x=4$.</p>`, 'The factors must add up to a constant, so split $x^2$ as $\\frac x2\\cdot\\frac x2$.', { calc: () => { let m = 0; for (let x = 0; x < 6; x += 0.0005) m = Math.max(m, x * x * (6 - x)); return Math.round(m); } }),
  N('ss-033', 3, 'arithmetico-geometric', R`Find the sum of the infinite series $1+\dfrac23+\dfrac39+\dfrac4{27}+\cdots$`, 2.25, 0.005,
    R`<p>The $n$th term is $n\left(\dfrac13\right)^{n-1}$: an AGP. Let $S=1+2x+3x^2+\cdots$ with $x=\dfrac13$. Then $S-xS=1+x+x^2+\cdots=\dfrac1{1-x}$, so $S=\dfrac1{(1-x)^2}=\dfrac1{(2/3)^2}=\dfrac94=2.25$.</p>`, 'Multiply by $x$ and subtract: the same trick works for every AGP.', { calc: () => sumTo((n) => n * (1 / 3) ** (n - 1), 1, 300) }),
  N('ss-034', 3, 'arithmetico-geometric', R`Find $\displaystyle\sum_{n=1}^{\infty}\dfrac{n+1}{3^n}$.`, 1.25, 0.005,
    R`<p>Split: $\sum\dfrac n{3^n}+\sum\dfrac1{3^n}$. The second is a GP: $\dfrac{1/3}{1-1/3}=\dfrac12$. The first is $\sum nx^n=\dfrac x{(1-x)^2}$ at $x=\dfrac13$, which is $\dfrac{1/3}{4/9}=\dfrac34$. Total $\dfrac34+\dfrac12=1.25$.</p>`, '$\\sum nx^n=\\dfrac x{(1-x)^2}$ starts at $n=1$, with the extra $x$ in the numerator.', { calc: () => sumTo((n) => (n + 1) / 3 ** n, 1, 300) }),
  M('ss-035', 2, 'method of differences', R`The value of $\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\cdots+\dfrac1{20\cdot21}$ is`, R`$\dfrac{20}{21}$`, [R`$\dfrac{19}{20}$`, R`$\dfrac{21}{22}$`, R`$\dfrac1{21}$`],
    R`<p>$\dfrac1{k(k+1)}=\dfrac1k-\dfrac1{k+1}$. The sum telescopes: $1-\dfrac1{21}=\dfrac{20}{21}$.</p>`, 'The last term left over is $\\dfrac1{n+1}$ with $n=20$.'),
  I('ss-036', 3, 'sum of products', R`Find $\displaystyle\sum_{k=1}^{8}k(k+1)(k+2)$.`, 1980,
    R`<p>Use $\sum_{k=1}^nk(k+1)(k+2)=\dfrac{n(n+1)(n+2)(n+3)}4$ (it telescopes, since $k(k+1)(k+2)=\dfrac{k(k+1)(k+2)(k+3)-(k-1)k(k+1)(k+2)}4$). For $n=8$: $\dfrac{8\cdot9\cdot10\cdot11}4=1980$.</p>`, 'The denominator is 4 for three factors.', { calc: () => sumTo((k) => k * (k + 1) * (k + 2), 1, 8) }),
  I('ss-037', 3, 'sum of a series', R`Find $1\cdot3+3\cdot5+5\cdot7+\cdots$ up to 10 terms.`, 1530,
    R`<p>The $k$th term is $(2k-1)(2k+1)=4k^2-1$. $S=4\sum k^2-10=4\times385-10=1530$.</p>`, 'Subtract 1 ten times, not once.', { calc: () => sumTo((k) => (2 * k - 1) * (2 * k + 1), 1, 10) }),
  I('ss-038', 3, 'method of differences', R`For the series $3+7+13+21+31+\cdots$ find the sum of the first 10 terms.`, 450,
    R`<p>The differences are $4,6,8,10,\dots$, an AP, so the $n$th term is quadratic: $T_n=n^2+n+1$ (check $T_1=3$, $T_2=7$, $T_5=31$). $S_{10}=385+55+10=450$.</p>`, 'The second differences are constant, so the term is quadratic in $n$.', { calc: () => sumTo((n) => n * n + n + 1, 1, 10) }),
  I('ss-039', 3, 'recurrence', R`A sequence has $a_1=1$ and $a_{n+1}=2a_n+3$. Find $a_6$.`, 125,
    R`<p>Add 3 to both sides: $a_{n+1}+3=2(a_n+3)$. So $a_n+3$ is a GP with first term 4 and ratio 2, giving $a_n=2^{n+1}-3$. $a_6=128-3=125$. (Check by steps: 1, 5, 13, 29, 61, 125.)</p>`, 'A recurrence $a_{n+1}=ka_n+c$ becomes a GP after adding $\\frac{c}{k-1}$.', { calc: () => { let a = 1; for (let i = 1; i < 6; i++) a = 2 * a + 3; return a; } }),
  I('ss-040', 3, 'GP and sum', R`Three positive numbers are in GP with product 64 and sum 21. Find the largest.`, 16,
    R`<p>Take $\dfrac4r,4,4r$ (product 64). The sum: $4\left(r+1+\dfrac1r\right)=21$, so $r+\dfrac1r=\dfrac{17}4$, $4r^2-17r+4=0$, $r=4$ or $\dfrac14$. The numbers are 1, 4, 16.</p>`, 'The two ratios give the same set in opposite order.', { calc: () => 4 * 4 }),
  I('ss-041', 2, 'AM-GM maximum', R`The positive numbers $a,b,c$ satisfy $a+b+c=12$. Find the greatest value of $abc$.`, 64,
    R`<p>AM-GM: $\dfrac{a+b+c}3\ge\sqrt[3]{abc}$, so $abc\le4^3=64$, with equality at $a=b=c=4$.</p>`, 'Do not use $12^3$: the mean is 4.', { calc: () => 4 ** 3 }),
  I('ss-042', 3, 'harmonic progression', R`In an HP the 3rd term is $\dfrac15$ and the 7th term is $\dfrac1{13}$. Find the reciprocal of its 10th term.`, 19,
    R`<p>The reciprocals form an AP: $b_3=5$, $b_7=13$, so $4d=8$, $d=2$. $b_{10}=b_7+3\times2=19$.</p>`, 'Work with reciprocals; the answer asked is the reciprocal, not the term.', { calc: () => 13 + 3 * ((13 - 5) / 4) }),
  I('ss-043', 3, 'pairing terms', R`Find $1^2-2^2+3^2-4^2+\cdots+19^2-20^2$.`, -210,
    R`<p>Pair the terms: $k^2-(k+1)^2=-(2k+1)$ for $k=1,3,5,\dots,19$. That is $-(3+7+11+\cdots+39)$, an AP with 10 terms and sum $\dfrac{10}2(3+39)=210$. So the answer is $-210$.</p>`, 'Pairs of squares factor as $(a-b)(a+b)$.', { calc: () => sumTo((k) => (k % 2 ? 1 : -1) * k * k, 1, 20) }),
  I('ss-044', 3, 'telescoping with factorials', R`Find $1\cdot1!+2\cdot2!+3\cdot3!+\cdots+6\cdot6!$.`, 5039,
    R`<p>$k\cdot k!=(k+1)!-k!$. The sum telescopes to $7!-1!=5040-1=5039$.</p>`, 'The bottom term left over is $1!=1$.', { calc: () => sumTo((k) => k * fact(k), 1, 6) }),
  I('ss-045', 3, 'sum of squares', R`Find $11^2+12^2+\cdots+20^2$.`, 2485,
    R`<p>$\sum_{1}^{20}k^2=\dfrac{20\cdot21\cdot41}6=2870$ and $\sum_1^{10}k^2=385$. The difference is $2485$.</p>`, 'Subtract the sum up to 10, not up to 11.', { calc: () => sumTo((k) => k * k, 11, 20) }),
  M('ss-046', 3, 'rationalising and telescoping', R`$\dfrac1{1+\sqrt2}+\dfrac1{\sqrt2+\sqrt3}+\cdots+\dfrac1{\sqrt{99}+\sqrt{100}}$ equals`, '9', ['10', '11', '99'],
    R`<p>$\dfrac1{\sqrt k+\sqrt{k+1}}=\sqrt{k+1}-\sqrt k$. The sum telescopes to $\sqrt{100}-\sqrt1=10-1=9$.</p>`, 'The first term is $\\sqrt1=1$, which is subtracted.'),
  A('ss-047', 3, 'AM and GM', R`For two distinct positive numbers $a$ and $b$, the arithmetic mean is strictly greater than the geometric mean.`,
    R`The arithmetic mean of $a$ and $b$ is $\dfrac{a+b}2$.`, 1,
    R`<p>A is true: $\dfrac{a+b}2-\sqrt{ab}=\dfrac{(\sqrt a-\sqrt b)^2}2>0$ when $a\ne b$. R is also true (it is the definition of the AM), but it says nothing about the GM, so it does not explain why AM exceeds GM.</p>`, 'A true fact is not an explanation unless it gives the reason.'),
  S('ss-048', 3, 'squares of progressions', R`If $a,b,c$ are in HP then $a^2,b^2,c^2$ are in HP.`, R`If $a,b,c$ are in GP then $a^2,b^2,c^2$ are in GP.`, 2,
    R`<p>Statement II: $b^2=ac$ gives $(b^2)^2=a^2c^2$, so it is true. Statement I: take $1,\tfrac12,\tfrac13$ (HP). Their squares $1,\tfrac14,\tfrac19$ have reciprocals $1,4,9$, which are not in AP. So I is false.</p>`, 'Squaring preserves GP, but not AP or HP.'),
  X('ss-049', 3, 'AM, GM and HM', R`For two distinct positive numbers $a,b$ with arithmetic mean $A$, geometric mean $G$ and harmonic mean $H$, which are correct?`,
    [R`$A>G>H$`, R`$G^2=AH$`, R`$H>G$`, R`$A,G,H$ are in AP`], [0, 1],
    R`<p>For distinct positive numbers $A>G>H$ (so C is wrong). $AH=\dfrac{a+b}2\cdot\dfrac{2ab}{a+b}=ab=G^2$, so $A,G,H$ are in GP, not AP (D wrong). Correct: A and B.</p>`, 'The three means are in GP, not AP.'),
  X('ss-050', 3, 'partial sums', R`Which of the following values of $S_n$ (the sum of the first $n$ terms) give an arithmetic progression?`,
    [R`$S_n=3n^2+2n$`, R`$S_n=n^2+1$`, R`$S_n=n^2+4n$`, R`$S_n=2^n-1$`], [0, 2],
    R`<p>$S_n=pn^2+qn$ (no constant term) gives $a_n=2pn-p+q$, an AP. A and C are of this type. B has a constant: $a_1=2$ but $a_n=2n-1$ for $n\ge2$, giving $2,3,5,7,\dots$, not an AP. D gives $a_n=2^{n-1}$, a GP.</p>`, 'A constant term in $S_n$ breaks the AP at the first term.'),
  I('ss-051', 3, 'series of repunits', R`Find the sum of the first 5 terms of $7+77+777+\cdots$`, 86415,
    R`<p>$7+77+\cdots=\dfrac79\left[(10-1)+(10^2-1)+\cdots+(10^5-1)\right]=\dfrac79\left[111110-5\right]=\dfrac79\times111105=86415$.</p>`, 'Each term is $\\dfrac79(10^k-1)$.', { calc: () => 7 + 77 + 777 + 7777 + 77777 }),
  I('ss-052', 3, 'inclusion and exclusion', R`Find the sum of all positive integers below 100 that are divisible by 3 or by 5.`, 2318,
    R`<p>Multiples of 3: $3+6+\cdots+99=3\cdot\dfrac{33\cdot34}2=1683$. Multiples of 5: $5+\cdots+95=5\cdot\dfrac{19\cdot20}2=950$. Both (multiples of 15): $15+\cdots+90=15\cdot\dfrac{6\cdot7}2=315$. Total $1683+950-315=2318$.</p>`, 'Multiples of 15 are counted twice; subtract them once.', { calc: () => { let s = 0; for (let k = 1; k < 100; k++) if (k % 3 === 0 || k % 5 === 0) s += k; return s; } }),
  I('ss-053', 3, 'mixed', R`The roots of $x^3-12x^2+39x-28=0$ are in AP. Find the common difference of the progression (take it positive).`, 3,
    R`<p>Let the roots be $m-d,\ m,\ m+d$. The sum is $3m=12$, so $m=4$. The product is $m(m^2-d^2)=28$, giving $4(16-d^2)=28$, $d^2=9$, $d=3$. The roots are 1, 4, 7. (Check: $1\cdot4+4\cdot7+1\cdot7=39$.)</p>`, 'Sum and product of roots are enough; the middle root is $\\dfrac{12}3$.', { calc: () => { for (let x = 1; x < 20; x++) if (x ** 3 - 12 * x ** 2 + 39 * x - 28 === 0) return Math.abs(x - 4) > 0 ? Math.abs(x - 4) : 0; return -1; } }),
  M('ss-054', 3, 'mixed (complex numbers)', R`The value of $i+i^2+i^3+\cdots+i^{101}$ is`, '$i$', ['$-i$', '0', '1'],
    R`<p>Every four consecutive powers of $i$ add to $i-1-i+1=0$. The first 100 terms make 25 such blocks, giving 0. The sum is the remaining term $i^{101}=i^{100}\cdot i=i$.</p>`, 'The extra term is the 101st, $i^{101}$, not $i^{100}$.'),
  X('ss-055', 3, 'nth term and sum', R`The $n$th term of a sequence is $a_n=5n-2$. Which statements are true?`,
    [R`It is an AP with common difference 5`, R`The sum of its first 20 terms is 990`, R`Its 12th term is 58`, R`It is also a GP`], [0, 2],
    R`<p>$a_n-a_{n-1}=5$, so A is true. $a_1=3$, $a_{20}=98$, so $S_{20}=10\times101=1010$, not 990: B is false. $a_{12}=60-2=58$: C is true. A non-constant AP is never a GP (the ratios $\dfrac83,\dfrac{13}8,\dots$ change): D is false.</p>`, 'Add the first and last terms, then multiply by $n/2$.'),

  // ---------- L4 hard ----------
  I('ss-056', 4, 'arithmetico-geometric', R`Find $\displaystyle\sum_{n=1}^{\infty}\dfrac{2n-1}{3^n}$.`, 1,
    R`<p>$\sum\dfrac n{3^n}=\dfrac34$ (using $\dfrac x{(1-x)^2}$ at $x=\dfrac13$) and $\sum\dfrac1{3^n}=\dfrac12$. The sum is $2\times\dfrac34-\dfrac12=1$.</p>`, 'Split into an AGP and a GP.', { calc: () => Math.round(sumTo((n) => (2 * n - 1) / 3 ** n, 1, 300)) }),
  I('ss-057', 5, 'arithmetico-geometric', R`Find $\displaystyle\sum_{n=1}^{\infty}\dfrac{n^2}{2^n}$.`, 6,
    R`<p>Write $n^2=n(n-1)+n$. $\sum n(n-1)x^n=\dfrac{2x^2}{(1-x)^3}$, which at $x=\dfrac12$ is $\dfrac{2/4}{1/8}=4$. $\sum nx^n=\dfrac{1/2}{1/4}=2$. Total $4+2=6$.</p>`, 'Use $n^2=n(n-1)+n$.', { calc: () => Math.round(sumTo((n) => n * n / 2 ** n, 1, 200)) }),
  N('ss-058', 5, 'telescoping', R`Find $\displaystyle\sum_{n=2}^{\infty}\dfrac1{n^2-1}$.`, 0.75, 0.001,
    R`<p>$\dfrac1{n^2-1}=\dfrac12\left(\dfrac1{n-1}-\dfrac1{n+1}\right)$. The sum up to $N$ leaves $\dfrac12\left(1+\dfrac12-\dfrac1N-\dfrac1{N+1}\right)\to\dfrac12\cdot\dfrac32=\dfrac34$.</p>`, 'Two terms survive at the start, not one.', { calc: () => sumTo((n) => 1 / (n * n - 1), 2, 200000) }),
  N('ss-059', 4, 'telescoping with factorials', R`Find $\dfrac1{2!}+\dfrac2{3!}+\dfrac3{4!}+\dfrac4{5!}+\dfrac5{6!}$ correct to 4 decimal places.`, 0.9986, 0.0001,
    R`<p>$\dfrac k{(k+1)!}=\dfrac{(k+1)-1}{(k+1)!}=\dfrac1{k!}-\dfrac1{(k+1)!}$. The sum is $1-\dfrac1{6!}=1-\dfrac1{720}=\dfrac{719}{720}\approx0.9986$.</p>`, 'Write $k=(k+1)-1$ in the numerator.', { calc: () => sumTo((k) => k / fact(k + 1), 1, 5) }),
  I('ss-060', 4, 'AM-GM with a shift', R`For $x>1$, find the least value of $9x+\dfrac4{x-1}$.`, 21,
    R`<p>Shift: $9x+\dfrac4{x-1}=9(x-1)+\dfrac4{x-1}+9$. Both $9(x-1)$ and $\dfrac4{x-1}$ are positive, so AM-GM gives $\ge2\sqrt{36}+9=21$. Equality when $9(x-1)=\dfrac4{x-1}$, $x-1=\dfrac23$, $x=\dfrac53>1$.</p>`, 'AM-GM needs the product constant: first make $9(x-1)$ appear.', { calc: () => { let m = 1e9; for (let x = 1.0005; x < 30; x += 0.0005) m = Math.min(m, 9 * x + 4 / (x - 1)); return Math.round(m); } }),
  I('ss-061', 4, 'AM-GM with trigonometry', R`Find the least value of $9\sin^2\theta+4\csc^2\theta$.`, 12,
    R`<p>Let $s=\sin^2\theta\in(0,1]$. By AM-GM, $9s+\dfrac4s\ge2\sqrt{36}=12$, with equality at $s^2=\dfrac49$, $s=\dfrac23$, which is allowed ($0<s\le1$). The least value is 12.</p>`, 'Check the equality case lies in the range of $\\sin^2\\theta$.', { calc: () => { let m = 1e9; for (let s = 0.0005; s <= 1; s += 0.0005) m = Math.min(m, 9 * s + 4 / s); return Math.round(m); } }),
  I('ss-062', 4, 'Fibonacci-type recurrence', R`A sequence has $a_1=1$, $a_2=2$ and $a_{n+2}=a_{n+1}+a_n$. Find $a_1+a_2+\cdots+a_{10}$.`, 231,
    R`<p>The terms are $1,2,3,5,8,13,21,34,55,89$. Their sum is 231. Shortcut: $\sum_{k=1}^na_k=a_{n+2}-a_2$, and $a_{12}=233$, so $233-2=231$.</p>`, 'Check by adding: 1+2+3+5+8+13+21+34+55+89.', { calc: () => { const a = [1, 2]; for (let i = 2; i < 10; i++) a.push(a[i - 1] + a[i - 2]); return a.reduce((x, y) => x + y, 0); } }),
  I('ss-063', 4, 'recurrence', R`A sequence has $a_1=1$ and $a_{n+1}=a_n+2n$. Find $a_{20}$.`, 381,
    R`<p>$a_{n}=a_1+2(1+2+\cdots+(n-1))=1+n(n-1)$. $a_{20}=1+20\times19=381$.</p>`, 'The sum runs to $n-1$, not $n$.', { calc: () => { let a = 1; for (let n = 1; n < 20; n++) a += 2 * n; return a; } }),
  I('ss-064', 4, 'GP partial sums', R`For a GP, the sum of the first $n$ terms is 15 and the sum of the first $2n$ terms is 75. Find the sum of the first $3n$ terms.`, 315,
    R`<p>Let $q=r^n$. $S_{2n}=S_n(1+q)$, so $1+q=5$ and $q=4$. $S_{3n}=S_n(1+q+q^2)=15\times21=315$.</p>`, 'Do not add the next block 75+15; the blocks themselves form a GP.', { calc: () => 15 * (1 + 4 + 16) }),
  I('ss-065', 5, 'arithmetico-geometric (finite)', R`Find $2+2\cdot2^2+3\cdot2^3+\cdots$ in the form $\sum_{k=1}^{7}k\cdot2^k$.`, 1538,
    R`<p>Use $\sum_{k=1}^nk2^k=(n-1)2^{n+1}+2$. With $n=7$: $6\times256+2=1538$. (Derive: $S-2S=2+2^2+\cdots+2^7-7\cdot2^8$, so $S=7\cdot2^8-(2^8-2)=1538$.)</p>`, 'The last term $n2^{n+1}$ appears with a minus sign.', { calc: () => sumTo((k) => k * 2 ** k, 1, 7) }),
  I('ss-066', 4, 'mixed (counting)', R`How many sets $\{a,b,c\}$ of integers with $1\le a<b<c\le20$ are such that $a,b,c$ are in AP?`, 90,
    R`<p>$a,b,c$ in AP means $b=\dfrac{a+c}2$, so $a$ and $c$ must have the same parity and then $b$ is determined. Choose 2 numbers from the 10 odd numbers: $\binom{10}2=45$. Choose 2 from the 10 even numbers: 45. Total 90.</p>`, 'Choose the ends only; the middle term is forced.', { calc: () => { let c = 0; for (let a = 1; a <= 20; a++) for (let b = a + 1; b <= 20; b++) { const m = (a + b) / 2; if (Number.isInteger(m) && m > a && m < b) c++; } return c; } }),
  I('ss-067', 4, 'common terms of two APs', R`The first AP is $3,8,13,\dots$ and the second is $5,9,13,\dots$. Each has 40 terms. How many terms are common to both?`, 8,
    R`<p>The first common term is 13. Common terms then differ by $\text{lcm}(5,4)=20$: $13,33,53,\dots$. The first AP ends at $3+39\cdot5=198$ and the second at $5+39\cdot4=161$. So common terms must be $\le161$: $13+20k\le161$ gives $k\le7.4$, so $k=0,\dots,7$: 8 terms.</p>`, 'Use the shorter AP\'s last term as the limit.', { calc: () => { let c = 0; for (let i = 0; i < 40; i++) { const x = 3 + 5 * i; if (x >= 5 && (x - 5) % 4 === 0 && (x - 5) / 4 < 40) c++; } return c; } }),
  I('ss-068', 4, 'weighted AM-GM', R`$x,y>0$ and $x+y=10$. Find the greatest value of $x^2y^3$.`, 3456,
    R`<p>Split into five equal-weighted parts: $\dfrac x2,\dfrac x2,\dfrac y3,\dfrac y3,\dfrac y3$ have sum 10. AM-GM: $\left(\dfrac x2\right)^2\left(\dfrac y3\right)^3\le\left(\dfrac{10}5\right)^5=32$. So $x^2y^3\le32\times4\times27=3456$, reached at $\dfrac x2=\dfrac y3=2$, i.e. $x=4$, $y=6$: $16\times216=3456$.</p>`, 'Divide each variable by its power so the parts are equal at the maximum.', { calc: () => { let m = 0; for (let x = 0; x <= 10; x += 0.0005) m = Math.max(m, x * x * (10 - x) ** 3); return Math.round(m); } }),
  I('ss-069', 4, 'maximum of an AP sum', R`An AP has first term 58 and common difference $-4$. Find the greatest value that the sum of its first $n$ terms can take.`, 450,
    R`<p>The terms are $58,54,\dots$ and they stay positive while $58-4(k-1)>0$, i.e. $k\le15$ ($a_{15}=2$, $a_{16}=-2$). The sum is greatest when all positive terms are added: $S_{15}=\dfrac{15}2(116-56)=450$.</p>`, 'Stop adding when the terms turn negative.', { calc: () => { let m = -1e9; for (let n = 1; n <= 40; n++) m = Math.max(m, apS(58, -4, n)); return m; } }),
  I('ss-070', 5, 'recurrence (squaring)', R`A sequence has $a_1=3$ and $a_{n+1}=a_n^2-2a_n+2$. Find $a_4$.`, 257,
    R`<p>$a_{n+1}-1=a_n^2-2a_n+1=(a_n-1)^2$. Let $b_n=a_n-1$: $b_1=2$, $b_2=4$, $b_3=16$, $b_4=256$. So $a_4=257$.</p>`, 'Subtract 1 to get a perfect square. Do not add the squares.', { calc: () => { let a = 3; for (let i = 1; i < 4; i++) a = a * a - 2 * a + 2; return a; } }),
  I('ss-071', 5, 'AP versus GP', R`An AP $a_n$ and a GP $b_n$ have $a_1=b_1=2$ and $a_3=b_3=8$, with $b_2>0$. For how many values of $n$ in $2\le n\le20$ is $b_n<a_n$?`, 1,
    R`<p>$b_3=2r^2=8$ gives $r=2$ (since $b_2>0$). $d=\dfrac{8-2}2=3$. $a_n=3n-1$, $b_n=2^n$. $n=2$: $b_2=4<a_2=5$. $n=3$: equal. $n=4$: $16>11$. From $n=4$ on, $2^n$ grows faster. So only $n=2$ works: the answer is 1.</p>`, 'A GP and AP agree at two places and the GP is below the AP only between them.', { calc: () => { let c = 0; for (let n = 2; n <= 20; n++) if (2 ** n < 3 * n - 1) c++; return c; } }),
  X('ss-072', 4, 'recurrence', R`A sequence has $a_1=1$ and $a_{n+1}=2a_n+3$. Which statements are true?`,
    [R`$a_3=13$`, R`$a_n=2^{n+1}-3$`, R`$a_n+3$ is a GP`, R`$a_n$ is an AP`], [0, 1, 2],
    R`<p>The terms: 1, 5, 13, 29. A: $a_3=13$ true. B: $2^{n+1}-3$ gives $1,5,13$: true. C: $a_{n+1}+3=2(a_n+3)$, a GP with ratio 2: true. D: differences $4,8,16$ are not constant: false.</p>`, 'A one-step linear recurrence with $k\\ne1$ is never an AP.'),
  X('ss-073', 4, 'AM-GM inequalities', R`The positive numbers $a,b,c$ satisfy $a+b+c=6$. Which of these are true?`,
    [R`$abc\le8$`, R`$ab+bc+ca\ge12$`, R`$\dfrac1a+\dfrac1b+\dfrac1c\ge\dfrac32$`, R`$a^2+b^2+c^2\le12$`], [0, 2],
    R`<p>AM-GM: $abc\le2^3=8$ (A true). $(a+b+c)^2=36\ge3(ab+bc+ca)$ gives $ab+bc+ca\le12$, so B is false. $(a+b+c)\left(\dfrac1a+\dfrac1b+\dfrac1c\right)\ge9$ gives $\dfrac1a+\dfrac1b+\dfrac1c\ge\dfrac96=\dfrac32$ (C true). $a^2+b^2+c^2=36-2(ab+bc+ca)\ge36-24=12$, so D is false.</p>`, 'The sum fixed means the squares have a minimum, not a maximum.'),
  I('ss-074', 4, 'mixed (logarithms)', R`If $\log2,\ \log(2^x-1),\ \log(2^x+3)$ are in AP, find the value of $2^x$.`, 5,
    R`<p>Terms in AP means the middle one is the average: $2\log(2^x-1)=\log2+\log(2^x+3)$, so $(2^x-1)^2=2(2^x+3)$. Put $t=2^x$: $t^2-4t-5=0$, $(t-5)(t+1)=0$. Since $t>1$ (the logarithms must be defined), $t=5$.</p>`, 'Reject $t=-1$, and check $2^x-1>0$.', { calc: () => 5 }),
  S('ss-075', 4, 'infinite series', R`The series $1+\dfrac12+\dfrac13+\dfrac14+\cdots$ converges because its terms tend to zero.`, R`An infinite GP with $|r|=1$ has a finite sum.`, 3,
    R`<p>Statement I is false: the harmonic series diverges (it grows like $\ln n$), and "terms tend to 0" is not enough. Statement II is false: with $r=1$ the sum grows without bound, and with $r=-1$ the partial sums swing between $a$ and 0. Both are false.</p>`, 'Terms tending to zero is necessary, not sufficient.'),
  S('ss-076', 4, 'sums and sequences', R`If $S_n=2^n$ then the sequence is a GP.`, R`If $S_n=2^n-1$ then the sequence is a GP.`, 2,
    R`<p>$S_n=2^n$: $a_1=2$ but $a_n=2^n-2^{n-1}=2^{n-1}$ for $n\ge2$, so the sequence is $2,2,4,8,\dots$: ratios $1,2,2,\dots$ are not constant. I is false. $S_n=2^n-1$: $a_1=1$ and $a_n=2^{n-1}$ for all $n\ge1$, so II is true.</p>`, 'Check $a_1=S_1$ against the general formula.'),
  M('ss-077', 4, 'properties of progressions', R`Consider: (i) multiplying every term of an AP by a nonzero constant keeps it an AP; (ii) the reciprocals of the terms of a GP (all nonzero) form a GP; (iii) adding 1 to every term of a GP gives a GP; (iv) the reciprocals of the terms of an AP (all nonzero) form an AP. How many of these are correct?`,
    'Exactly 2', ['Only 1', 'Exactly 3', 'All 4'],
    R`<p>(i) true. (ii) true: the new ratio is $\dfrac1r$. (iii) false: $1,2,4$ becomes $2,3,5$, ratios $\dfrac32,\dfrac53$. (iv) false: the reciprocals of an AP form an HP. So (i) and (ii) only: exactly 2.</p>`, 'The reciprocals of an AP form an HP, not an AP.'),

  // ---------- L5 top-rank ----------
  N('ss-078', 5, 'arithmetico-geometric', R`Find $\displaystyle\sum_{n=1}^{\infty}\dfrac{n^3}{3^n}$ (as a decimal).`, 4.125, 0.001,
    R`<p>Write $n^3=n(n-1)(n-2)+3n(n-1)+n$ and use $x=\dfrac13$. $\sum n(n-1)(n-2)x^n=\dfrac{6x^3}{(1-x)^4}=\dfrac{6/27}{16/81}=\dfrac98$. $3\sum n(n-1)x^n=3\cdot\dfrac{2x^2}{(1-x)^3}=3\cdot\dfrac{2/9}{8/27}=\dfrac94$. $\sum nx^n=\dfrac x{(1-x)^2}=\dfrac34$. Total $\dfrac98+\dfrac94+\dfrac34=\dfrac{33}8=4.125$.</p>`, 'Falling factorials make each piece a known series.', { calc: () => sumTo((n) => n ** 3 / 3 ** n, 1, 300) }),
  I('ss-079', 5, 'telescoping', R`Let $S=\displaystyle\sum_{n=1}^{\infty}\dfrac1{n(n+1)(n+2)(n+3)}$. Find $\dfrac1S$.`, 18,
    R`<p>$\dfrac1{n(n+1)(n+2)(n+3)}=\dfrac13\left[\dfrac1{n(n+1)(n+2)}-\dfrac1{(n+1)(n+2)(n+3)}\right]$. The sum telescopes to $\dfrac13\cdot\dfrac1{1\cdot2\cdot3}=\dfrac1{18}$. So $\dfrac1S=18$.</p>`, 'The factor in front is $\\dfrac1{3}$ for four consecutive factors (one less than 4).', { calc: () => Math.round(1 / sumTo((n) => 1 / (n * (n + 1) * (n + 2) * (n + 3)), 1, 100000)) }),
  I('ss-080', 5, 'weighted AM-GM', R`Positive numbers $x,y,z$ satisfy $x+y+z=12$. Find the greatest value of $xy^2z^3$.`, 6912,
    R`<p>Split into six parts so each is equal at the maximum: $x,\ \dfrac y2,\dfrac y2,\ \dfrac z3,\dfrac z3,\dfrac z3$, with sum 12. AM-GM: product $x\left(\dfrac y2\right)^2\left(\dfrac z3\right)^3\le\left(\dfrac{12}6\right)^6=64$. So $xy^2z^3\le64\times4\times27=6912$. Equality at $x=2$, $y=4$, $z=6$: $2\times16\times216=6912$.</p>`, 'The numbers of parts equal the sum of the powers, 6.', { calc: () => 2 * 16 * 216 }),
  I('ss-081', 5, 'arithmetico-geometric with alternating signs', R`Let $S=\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}\dfrac n{2^n}$. Find $9S$.`, 2,
    R`<p>$\sum_{n\ge1}nx^n=\dfrac x{(1-x)^2}$ with $x=-\dfrac12$: $\dfrac{-1/2}{(3/2)^2}=-\dfrac29$. The series $S$ is the negative of this, since $(-1)^{n+1}\dfrac n{2^n}=-n\left(-\dfrac12\right)^n$. So $S=\dfrac29$ and $9S=2$.</p>`, 'Rewrite the sign as a power of the ratio $-\\dfrac12$.', { calc: () => 9 * sumTo((n) => (-1) ** (n + 1) * n / 2 ** n, 1, 200) }),
  X('ss-082', 5, 'convergent sums', R`Which of the following are correct?`,
    [R`$\displaystyle\sum_{n=1}^{\infty}\dfrac1{n(n+1)}=1$`, R`$\displaystyle\sum_{n=1}^{\infty}\dfrac n{2^n}=2$`, R`$\displaystyle\sum_{n=1}^{\infty}\dfrac1{(2n-1)(2n+1)}=1$`, R`$\displaystyle\sum_{n=0}^{\infty}\left(-\dfrac12\right)^n=\dfrac23$`], [0, 1, 3],
    R`<p>A: telescopes to 1. B: $\dfrac{1/2}{(1/2)^2}=2$. C: $\dfrac1{(2n-1)(2n+1)}=\dfrac12\left(\dfrac1{2n-1}-\dfrac1{2n+1}\right)$ telescopes to $\dfrac12$, not 1: false. D: $\dfrac1{1+1/2}=\dfrac23$: true.</p>`, 'In C the factor $\\dfrac12$ is easy to drop.'),
  X('ss-083', 5, 'AP and GP compared', R`$a_n$ is an AP and $b_n$ a GP with $a_1=b_1=2$, $a_3=b_3=8$ and $b_2>0$. Which are true?`,
    [R`$a_2>b_2$`, R`$b_4>a_4$`, R`$a_n\ge b_n$ for all $n\ge1$`, R`$a_n=b_n$ for exactly two values of $n$`], [0, 1, 3],
    R`<p>$r=2$, $d=3$: $a_n=3n-1$, $b_n=2^n$. A: $5>4$ true. B: $16>11$ true. C: false (at $n=4$, $b_4>a_4$). D: $3n-1=2^n$ at $n=1$ and $n=3$ only (for $n\ge4$, $2^n$ is larger and grows faster): true.</p>`, 'The GP is above the AP outside the interval between the two meeting points.'),
  X('ss-084', 5, 'harmonic progression', R`If $x,y,z>0$ are in HP, which are true?`,
    [R`$y=\dfrac{2xz}{x+z}$`, R`$\dfrac{x-y}{y-z}=\dfrac xz$`, R`$y^2\ge xz$`, R`$\dfrac1x+\dfrac1z=\dfrac2y$`], [0, 1, 3],
    R`<p>HP means $\dfrac1x,\dfrac1y,\dfrac1z$ are in AP: $\dfrac2y=\dfrac1x+\dfrac1z$ (D), so $y=\dfrac{2xz}{x+z}$ (A). From $\dfrac1y-\dfrac1x=\dfrac1z-\dfrac1y$: $\dfrac{x-y}{xy}=\dfrac{y-z}{yz}$, so $\dfrac{x-y}{y-z}=\dfrac xz$ (B). C is false: HM $\le$ GM so $y\le\sqrt{xz}$, i.e. $y^2\le xz$.</p>`, 'HM is the smallest of the three means, so $y^2\\le xz$.'),
  I('ss-085', 5, 'mixed (AP, GP and quadratic)', R`If $a,b$ are the roots of $x^2-10x+k=0$ and $\dfrac{2ab}{a+b}=\dfrac{16}5$, find $k$.`, 16,
    R`<p>$a+b=10$ and $ab=k$. The expression is the HM: $\dfrac{2k}{10}=\dfrac{16}5$, so $k=16$. (Check: the roots are 2 and 8, matching the HM of 2 and 8.)</p>`, 'The harmonic mean uses the sum and product directly.', { calc: () => (16 / 5) * 10 / 2 }),

  // ---------- match ----------
  MT('ss-086', 2, 'standard sums', 'm1', R`Match the sums in List I with List II.`,
    'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-s, C-p, D-q', 'A-q, B-p, C-s, D-r'],
    R`<p>A: $\dfrac{10\cdot11}2=55$ (r). B: $\dfrac{6\cdot7\cdot13}6=91$ (p). C: $\left(\dfrac{5\cdot6}2\right)^2=225$ (s). D: first 12 odd numbers: $12^2=144$ (q).</p>`, 'Odd numbers: $n^2$; do not mix with $n(n+1)$.'),
  MT('ss-087', 3, 'infinite GP', 'm2', R`Match the series in List I with their sums in List II.`,
    'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-s, B-p, C-q, D-r'],
    R`<p>A: $\dfrac1{1-1/2}=2$ (r). B: $\dfrac1{1+1/2}=\dfrac23$ (p). C: $0.333\ldots=\dfrac{0.3}{0.9}=\dfrac13$ (q). D: $\dfrac1{1-1/3}=\dfrac32$ (s).</p>`, 'For B the ratio is $-\\dfrac12$, so the denominator is $\\dfrac32$.'),
  MT('ss-088', 3, 'AM, GM, HM', 'm3', R`Match the means of 2 and 8 in List I with List II.`,
    'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'],
    R`<p>AM $=5$ (q). GM $=\sqrt{16}=4$ (p). HM $=\dfrac{2\cdot16}{10}=\dfrac{16}5$ (r). AM $\times$ HM $=5\times\dfrac{16}5=16$ (s), which equals GM$^2$.</p>`, 'AM, GM, HM are in GP, so AM$\\times$HM is GM$^2=16$.'),

  // ---------- assertion ----------
  A('ss-089', 3, 'AP and GP property', R`In an AP, $a_m+a_n=a_p+a_q$ whenever $m+n=p+q$.`, R`In a GP, $a_m+a_n=a_p+a_q$ whenever $m+n=p+q$.`, 2,
    R`<p>For AP, $a_m+a_n=2a+(m+n-2)d$ depends only on $m+n$, so A is true. In a GP it is the product that depends only on $m+n$: $a_ma_n=a^2r^{m+n-2}$. The sum does not: for $1,2,4,8$, $a_1+a_4=9$ but $a_2+a_3=6$. So R is false.</p>`, 'In a GP it is the products that match, not the sums.'),
  A('ss-090', 3, 'infinite GP', R`The sum of the series $1+2+4+8+\cdots$ to infinity is $\dfrac1{1-2}=-1$.`, R`The formula $S_\infty=\dfrac a{1-r}$ is valid only when $|r|<1$.`, 3,
    R`<p>A is false: with $r=2$ the terms keep growing, so the series has no finite sum. R is true, and it is the reason the formula cannot be used here.</p>`, 'The formula gives a number even when it does not apply.'),
  A('ss-091', 3, 'means', R`For two positive numbers, $(\text{GM})^2=\text{AM}\times\text{HM}$.`, R`For positive numbers, $\text{AM}\ge\text{GM}\ge\text{HM}$.`, 1,
    R`<p>A is true: $\dfrac{a+b}2\cdot\dfrac{2ab}{a+b}=ab$. R is also true, but the inequality alone does not give the exact relation $G^2=AH$, which comes from direct multiplication. So R is not the explanation.</p>`, 'Both are true facts; only one of them proves the other.'),
  A('ss-092', 4, 'partial sums', R`If $S_n=n^2+1$, then the sequence is not an AP.`, R`For $n\ge2$ we have $a_n=S_n-S_{n-1}=2n-1$, but $a_1=S_1=2$ does not fit this formula.`, 0,
    R`<p>The sequence is $2,3,5,7,\dots$: differences $1,2,2,\dots$, so it is not an AP. R states exactly why: the first term breaks the pattern. So both are true and R explains A.</p>`, '$a_n=S_n-S_{n-1}$ holds only for $n\\ge2$.'),
  A('ss-093', 4, 'AM-GM', R`The least value of $x+\dfrac1x$ for real $x\ne0$ is 2.`, R`For $x>0$, AM-GM gives $x+\dfrac1x\ge2\sqrt{x\cdot\dfrac1x}=2$.`, 3,
    R`<p>A is false: for $x<0$, $x+\dfrac1x\le-2$, so the expression can be as small as we like. AM-GM applies to positive numbers only, and R says exactly that for $x>0$, which is true. So A is false and R is true.</p>`, 'AM-GM needs positive numbers; for $x<0$ the sign flips.'),
  S('ss-094', 4, 'progressions and exponents', R`If $a,b,c$ are in AP then $2^a,2^b,2^c$ are in GP.`, R`If $a,b,c$ are in GP then $\log a,\log b,\log c$ are in AP.`, 1,
    R`<p>I is true: $\dfrac{2^b}{2^a}=2^{b-a}=2^{c-b}=\dfrac{2^c}{2^b}$ since $b-a=c-b$. II is false when the terms are not all positive: $-1,1,-1$ is a GP but the $\log$ of a negative number does not exist. (For positive terms it would be true.)</p>`, 'Logs need positive numbers; the GP may have negative terms.'),

  // ---------- extra warm-ups ----------
  M('ss-104', 1, 'common ratio', R`The common ratio of the GP $5,-10,20,-40,\dots$ is`, '$-2$', ['$2$', '$-5$', R`$-\dfrac12$`],
    R`<p>$r=\dfrac{-10}5=-2$. Check: $\dfrac{20}{-10}=-2$.</p>`, 'Alternating signs mean a negative ratio.'),
  I('ss-105', 1, 'sum of odd numbers', R`Find $1+3+5+\cdots+29$.`, 225,
    R`<p>These are the first 15 odd numbers ($2\cdot15-1=29$). Their sum is $15^2=225$.</p>`, 'Count the terms: 15, not 29.', { calc: () => { let s = 0; for (let k = 1; k <= 29; k += 2) s += k; return s; } }),
  M('ss-106', 1, 'arithmetic mean', R`The arithmetic mean of 7 and 13 is`, '10', ['9', '$\\sqrt{91}$', '20'],
    R`<p>$\text{AM}=\dfrac{7+13}2=10$. ($\sqrt{91}\approx9.54$ is the GM.)</p>`, '20 is the sum; divide by 2.'),
  I('ss-107', 1, 'nth term of AP', R`Find the 20th term of the AP $100,95,90,\dots$`, 5,
    R`<p>$a=100$, $d=-5$. $a_{20}=100+19\times(-5)=5$.</p>`, 'The common difference is negative.', { calc: () => apT(100, -5, 20) }),
  S('ss-108', 2, 'special sequences', R`The constant sequence $5,5,5,5,\dots$ is both an AP and a GP.`, R`The sequence $0,0,0,0,\dots$ is a GP.`, 1,
    R`<p>I is true: the difference is 0 (an AP) and the ratio is 1 (a GP). II is false: a GP needs a nonzero first term, because the ratio $\dfrac00$ is not defined. So I is true and II is false.</p>`, 'A GP never contains the term 0.'),

  // ---------- passages ----------
  PI('ss-095', 2, 'AP in context', 'p1', R`How many seats are there in the last (25th) row?`, 92,
    R`<p>$a_{25}=a+24d=20+24\times3=92$.</p>`, 'Use $n-1=24$ steps.', { calc: () => apT(20, 3, 25) }),
  PI('ss-096', 2, 'AP in context', 'p1', R`How many seats does the hall have in total?`, 1400,
    R`<p>$S_{25}=\dfrac{25}2(a_1+a_{25})=\dfrac{25}2(20+92)=25\times56=1400$.</p>`, 'Use the last row you just found.', { calc: () => apS(20, 3, 25) }),
  P('ss-097', 3, 'AP in context', 'p1', R`How many rows have fewer than 60 seats?`, '14', ['13', '15', '20'],
    R`<p>Row $k$ has $20+3(k-1)$ seats. We need $20+3(k-1)<60$, so $k-1<13.33$ and $k\le14$. Row 14 has $20+39=59$ seats; row 15 has 62. So 14 rows.</p>`, 'Check the boundary rows 14 and 15.'),
  PN('ss-098', 3, 'GP in context', 'p2', R`Find the height (in metres) to which the ball rises after the 3rd bounce.`, 6.75, 0.01,
    R`<p>After the $k$th bounce the height is $16\left(\dfrac34\right)^k$. For $k=3$: $16\times\dfrac{27}{64}=6.75$ m.</p>`, 'The first rise (after bounce 1) is 12 m, not 16 m.', { calc: () => 16 * 0.75 ** 3 }),
  PI('ss-099', 3, 'GP in context', 'p2', R`Find the total distance (in metres) the ball travels before it comes to rest.`, 112,
    R`<p>It falls 16 m first. Then each rise is followed by the same fall. The rises add up to $12+9+6.75+\cdots=\dfrac{12}{1-3/4}=48$ m. Total $=16+2\times48=112$ m.</p>`, 'Each rebound height counts twice: up and down.', { calc: () => 16 + 2 * (12 / (1 - 0.75)) }),
  P('ss-100', 4, 'GP in context', 'p2', R`After how many bounces does the ball first rise to less than 1 m?`, '10', ['9', '12', '8'],
    R`<p>Need $16\left(\dfrac34\right)^n<1$, i.e. $\left(\dfrac34\right)^n<\dfrac1{16}$, so $n>\dfrac{\ln16}{\ln(4/3)}\approx\dfrac{2.7726}{0.2877}=9.64$. So $n=10$. Check: $16(0.75)^9=1.20$ (too high), $16(0.75)^{10}=0.90$.</p>`, 'Check the neighbouring integers; the inequality is strict.'),
  PI('ss-101', 3, 'recurrence in context', 'p3', R`Find $a_6$.`, 65,
    R`<p>$b_1=a_1-1=2$ and $b_n=2\cdot2^{n-1}=2^n$. So $a_n=2^n+1$ and $a_6=64+1=65$. (Steps: 3, 5, 9, 17, 33, 65.)</p>`, 'The GP is $b_n=a_n-1$, not $a_n$ itself.', { calc: () => { let a = 3; for (let i = 1; i < 6; i++) a = 2 * a - 1; return a; } }),
  PI('ss-102', 3, 'recurrence in context', 'p3', R`Find $a_1+a_2+\cdots+a_6$.`, 132,
    R`<p>$a_k=2^k+1$. $\sum_{k=1}^62^k=2^7-2=126$ and the six 1s add 6. Total 132.</p>`, 'Add the six 1s separately.', { calc: () => { let a = 3, s = 0; for (let i = 1; i <= 6; i++) { s += a; a = 2 * a - 1; } return s; } }),
  P('ss-103', 4, 'recurrence in context', 'p3', R`What is the smallest $n$ for which $a_n>1000$?`, '10', ['9', '11', '500'],
    R`<p>$a_n=2^n+1>1000$ needs $2^n>999$. $2^9=512$ is too small; $2^{10}=1024$ works. So $n=10$.</p>`, '$a_n$ is $2^n+1$, not $2^{n-1}+1$.'),
];

// ---------- number templates ----------
const gens = [
  {
    id: 'ss-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'nth term of AP',
    make(rng) {
      const a = int(rng, 2, 9), d = int(rng, 2, 7), n = int(rng, 8, 20);
      return { a, d, n, answer: a + (n - 1) * d, tol: 0,
        q: `Find the ${n}th term of the AP ${a}, ${a + d}, ${a + 2 * d}, ...`,
        sol: R`<p>$a=${a}$, $d=${d}$. $a_n=a+(n-1)d$, so $a_{${n}}=${a}+${n - 1}\times${d}=${a + (n - 1) * d}$.</p>` };
    },
    verify(p) { let t = p.a; for (let i = 1; i < p.n; i++) t += p.d; return t; },
  },
  {
    id: 'ss-g02', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'sum of an AP',
    make(rng) {
      const a = int(rng, 1, 12), d = int(rng, 2, 6), n = int(rng, 10, 30);
      const answer = (n * (2 * a + (n - 1) * d)) / 2;
      return { a, d, n, answer, tol: 0,
        q: `Find the sum of the first ${n} terms of the AP with first term ${a} and common difference ${d}.`,
        sol: R`<p>$S_n=\dfrac n2[2a+(n-1)d]$. $S_{${n}}=\dfrac{${n}}2[${2 * a}+${(n - 1) * d}]=\dfrac{${n}}2\times${2 * a + (n - 1) * d}=${answer}$.</p>` };
    },
    verify(p) { return apS(p.a, p.d, p.n); },
  },
  {
    id: 'ss-g03', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'sum of a GP',
    make(rng) {
      const a = int(rng, 1, 6), r = int(rng, 2, 3), n = int(rng, 5, 8);
      const answer = (a * (r ** n - 1)) / (r - 1);
      return { a, r, n, answer, tol: 0,
        q: `Find the sum of the first ${n} terms of the GP with first term ${a} and common ratio ${r}.`,
        sol: R`<p>$S_n=\dfrac{a(r^n-1)}{r-1}=\dfrac{${a}(${r}^{${n}}-1)}{${r - 1}}=\dfrac{${a}\times${r ** n - 1}}{${r - 1}}=${answer}$.</p>` };
    },
    verify(p) { return gpS(p.a, p.r, p.n); },
  },
  {
    id: 'ss-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'infinite GP',
    make(rng) {
      const [pp, qq] = choose(rng, [[1, 2], [2, 3], [3, 4], [1, 3], [2, 5], [1, 4]]);
      const m = int(rng, 1, 4), a = m * (qq - pp);
      const answer = m * qq;
      return { pp, qq, a, answer, tol: 0,
        q: `Find the sum to infinity of the GP with first term ${a} and common ratio $\\dfrac{${pp}}{${qq}}$.`,
        sol: R`<p>$|r|<1$, so $S_\infty=\dfrac a{1-r}=\dfrac{${a}}{1-${pp}/${qq}}=\dfrac{${a}}{${qq - pp}/${qq}}=${answer}$.</p>` };
    },
    verify(p) { let s = 0, t = p.a; for (let i = 0; i < 400; i++) { s += t; t *= p.pp / p.qq; } return Math.round(s); },
  },
  {
    id: 'ss-g05', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'harmonic mean',
    make(rng) {
      const [a, b] = choose(rng, [[4, 12], [6, 12], [3, 6], [10, 15], [12, 24], [6, 30], [20, 30], [5, 20]]);
      const h = (2 * a * b) / (a + b), am = (a + b) / 2;
      const o = numOpts(rng, h, [am, h / 2, 2 * h]);
      return { a, b, h, ...o,
        q: `The harmonic mean of ${a} and ${b} is`,
        sol: R`<p>$\text{HM}=\dfrac{2ab}{a+b}=\dfrac{2\times${a}\times${b}}{${a + b}}=${fmt(h)}$. (${fmt(am)} is the arithmetic mean, not the harmonic mean.)</p>` };
    },
    verify(p) { return p.options.indexOf(fmt(1 / ((1 / p.a + 1 / p.b) / 2))); },
  },
  {
    id: 'ss-g06', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'AM-GM minimum',
    make(rng) {
      const a = int(rng, 1, 6), t = int(rng, 1, 4), b = a * t * t;
      const answer = 2 * a * t;
      const lead = a === 1 ? '' : String(a);
      return { a, b, t, answer, tol: 0,
        q: `For $x>0$, find the least value of $${lead}x+\\dfrac{${b}}x$.`,
        sol: R`<p>AM-GM: $${lead}x+\dfrac{${b}}x\ge2\sqrt{${a}x\cdot\dfrac{${b}}x}=2\sqrt{${a * b}}=${answer}$. Equality when $${a}x=\dfrac{${b}}x$, i.e. $x=${t}$, which is positive, so the value is reached.</p>` };
    },
    verify(p) { let m = 1e9; for (let x = 0.002; x < 40; x += 0.002) m = Math.min(m, p.a * x + p.b / x); return Math.round(m); },
  },
  {
    id: 'ss-g07', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'sum of squares',
    make(rng) {
      const n = int(rng, 8, 20);
      const answer = (n * (n + 1) * (2 * n + 1)) / 6;
      return { n, answer, tol: 0,
        q: `Find $1^2+2^2+3^2+\\cdots+${n}^2$.`,
        sol: R`<p>$\sum k^2=\dfrac{n(n+1)(2n+1)}6=\dfrac{${n}\times${n + 1}\times${2 * n + 1}}6=${answer}$.</p>` };
    },
    verify(p) { return sumTo((k) => k * k, 1, p.n); },
  },
  {
    id: 'ss-g08', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'sum of a series',
    make(rng) {
      const c = int(rng, 1, 4), n = int(rng, 8, 15);
      const sq = (n * (n + 1) * (2 * n + 1)) / 6, lin = (n * (n + 1)) / 2;
      const answer = sq + c * lin;
      return { c, n, answer, tol: 0,
        q: `Find $\\displaystyle\\sum_{k=1}^{${n}}k(k+${c})$.`,
        sol: R`<p>$k(k+${c})=k^2+${c}k$. $\sum k^2=${sq}$ and $\sum k=${lin}$. The sum is $${sq}+${c}\times${lin}=${answer}$.</p>` };
    },
    verify(p) { return sumTo((k) => k * (k + p.c), 1, p.n); },
  },
  {
    id: 'ss-g09', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'arithmetico-geometric',
    make(rng) {
      const q = int(rng, 3, 6);
      const answer = +(q / (q - 1) ** 2).toFixed(3);
      return { q0: q, answer, tol: 0.001,
        q: `Find $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac n{${q}^n}$, correct to 3 decimal places.`,
        sol: R`<p>$\sum_{n\ge1}nx^n=\dfrac x{(1-x)^2}$ with $x=\dfrac1{${q}}$: $\dfrac{1/${q}}{(${q - 1}/${q})^2}=\dfrac{${q}}{${(q - 1) ** 2}}=${answer}$.</p>` };
    },
    verify(p) { return sumTo((n) => n / p.q0 ** n, 1, 300); },
  },
  {
    id: 'ss-g10', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'method of differences',
    make(rng) {
      const n = int(rng, 5, 25);
      const answer = +(n / (2 * n + 1)).toFixed(3);
      return { n, answer, tol: 0.001,
        q: `Find $\\dfrac1{1\\cdot3}+\\dfrac1{3\\cdot5}+\\dfrac1{5\\cdot7}+\\cdots$ up to ${n} terms, correct to 3 decimal places.`,
        sol: R`<p>$\dfrac1{(2k-1)(2k+1)}=\dfrac12\left(\dfrac1{2k-1}-\dfrac1{2k+1}\right)$. The sum telescopes to $\dfrac12\left(1-\dfrac1{${2 * n + 1}}\right)=\dfrac{${n}}{${2 * n + 1}}\approx${answer}$.</p>` };
    },
    verify(p) { return sumTo((k) => 1 / ((2 * k - 1) * (2 * k + 1)), 1, p.n); },
  },
  {
    id: 'ss-g11', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'harmonic progression',
    make(rng) {
      const A = int(rng, 2, 6), d = int(rng, 1, 4), p = int(rng, 2, 5), qd = int(rng, 2, 4), rd = int(rng, 2, 5);
      const q = p + qd, r = q + rd, B = A + qd * d;
      const answer = A + (r - p) * d;
      return { A, B, d, p, qi: q, r, answer, tol: 0,
        q: `In an HP the ${p}th term is $\\dfrac1{${A}}$ and the ${q}th term is $\\dfrac1{${B}}$. Find the reciprocal of its ${r}th term.`,
        sol: R`<p>The reciprocals form an AP. Its ${p}th term is ${A} and its ${q}th term is ${B}, so $${q - p}d=${B - A}$ and $d=${d}$. The ${r}th term of the AP is $${B}+${r - q}\times${d}=${answer}$.</p>` };
    },
    verify(o) { const d = (o.B - o.A) / (o.qi - o.p); return o.A + d * (o.r - o.p); },
  },
  {
    id: 'ss-g12', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'recurrence',
    make(rng) {
      const k = int(rng, 2, 3), c = int(rng, 1, 5), s = int(rng, 1, 4), m = int(rng, 5, 7);
      let a = s; const list = [s];
      for (let i = 1; i < m; i++) { a = k * a + c; list.push(a); }
      return { k, c, s, m, answer: a, tol: 0,
        q: `A sequence has $a_1=${s}$ and $a_{n+1}=${k}a_n+${c}$. Find $a_{${m}}$.`,
        sol: R`<p>Compute step by step: ${list.map((v) => `$${v}$`).join(', ')}. So $a_{${m}}=${a}$. (Closed form: $a_n+\dfrac{${c}}{${k - 1}}$ is a GP of ratio ${k}.)</p>` };
    },
    verify(p) { return ((p.s * (p.k - 1) + p.c) * p.k ** (p.m - 1) - p.c) / (p.k - 1); },
  },
  {
    id: 'ss-g13', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'GP partial sums',
    make(rng) {
      const A = int(rng, 3, 9), q = int(rng, 2, 4);
      const B = A * (1 + q);
      const answer = A * (1 + q + q * q);
      return { A, B, q0: q, answer, tol: 0,
        q: `For a GP, the sum of the first $n$ terms is ${A} and the sum of the first $2n$ terms is ${B}. Find the sum of the first $3n$ terms.`,
        sol: R`<p>Let $t=r^n$. $S_{2n}=S_n(1+t)$, so $1+t=\dfrac{${B}}{${A}}=${1 + q}$ and $t=${q}$. $S_{3n}=S_n(1+t+t^2)=${A}\times${1 + q + q * q}=${answer}$.</p>` };
    },
    verify(p) { const t = p.B / p.A - 1; return p.A * (1 + t + t * t); },
  },
  {
    id: 'ss-g14', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'weighted AM-GM',
    make(rng) {
      const pw = int(rng, 1, 2), qw = int(rng, 2, 3), t = int(rng, 2, 4);
      const s = (pw + qw) * t;
      const x = pw * t, y = qw * t;
      const answer = x ** pw * y ** qw;
      return { pw, qw, s, answer, tol: 0,
        q: `$x,y>0$ and $x+y=${s}$. Find the greatest value of $x^{${pw}}y^{${qw}}$.`,
        sol: R`<p>Split $x$ into $${pw}$ equal parts and $y$ into $${qw}$ equal parts: $\left(\dfrac x${pw}\right)^{${pw}}\left(\dfrac y${qw}\right)^{${qw}}\le\left(\dfrac{${s}}{${pw + qw}}\right)^{${pw + qw}}=${t ** (pw + qw)}$. So $x^{${pw}}y^{${qw}}\le${t ** (pw + qw)}\times${pw ** pw}\times${qw ** qw}=${answer}$, reached at $x=${x}$, $y=${y}$.</p>` };
    },
    verify(p) { let m = 0; for (let x = 0; x <= p.s; x += 0.001) m = Math.max(m, x ** p.pw * (p.s - x) ** p.qw); return Math.round(m); },
  },
  {
    id: 'ss-g15', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'maximum of an AP sum',
    make(rng) {
      const d = int(rng, 2, 5), k = int(rng, 8, 16);
      const a = k * d;
      const answer = (k * (k + 1) * d) / 2;
      return { a, d, k, answer, tol: 0,
        q: `An AP has first term ${a} and common difference $-${d}$. Find the greatest value of the sum of its first $n$ terms.`,
        sol: R`<p>The terms are positive while $${a}-${d}(j-1)>0$, i.e. $j\le${k}$. The ${k + 1}th term is 0, so the sum is greatest for $n=${k}$ (or ${k + 1}): $S_{${k}}=\dfrac{${k}}2[${2 * a}-${(k - 1) * d}]=${answer}$.</p>` };
    },
    verify(p) { let m = -1e9; for (let n = 1; n <= 3 * p.k; n++) m = Math.max(m, apS(p.a, -p.d, n)); return m; },
  },
  {
    id: 'ss-g16', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'three numbers in AP',
    make(rng) {
      const m = int(rng, 5, 12), d = int(rng, 1, 4);
      const P = m * (m * m - d * d);
      return { m, d, answer: m + d, tol: 0,
        q: `Three positive numbers in AP have sum ${3 * m} and product ${P}. Find the largest.`,
        sol: R`<p>Take $${m}-d,\ ${m},\ ${m}+d$. Product $${m}(${m * m}-d^2)=${P}$ gives $d^2=${d * d}$, $d=${d}$. The numbers are ${m - d}, ${m}, ${m + d}; the largest is ${m + d}.</p>` };
    },
    verify(p) { for (let x = 1; x < 60; x++) for (let y = x; y < 60; y++) { const z = 3 * p.m - x - y; if (z >= y && y - x === z - y && x * y * z === p.m * (p.m * p.m - p.d * p.d)) return z; } return -1; },
  },
  {
    id: 'ss-g17', type: 'mcq', format: 'single', level: 1, exams: EXS[1], sub: 'number of terms',
    make(rng) {
      const a = int(rng, 2, 9), d = int(rng, 2, 6), n = int(rng, 10, 30), l = a + (n - 1) * d;
      const o = shuffleOpts(rng, String(n), [String(n - 1), String(n + 1), String(Math.round(l / d))]);
      return { a, d, l, n, ...o,
        q: `How many terms are there in the AP ${a}, ${a + d}, ${a + 2 * d}, ..., ${l}?`,
        sol: R`<p>$l=a+(n-1)d$: $${l}=${a}+(n-1)${d}$, so $n-1=${(l - a) / d}$ and $n=${n}$.</p>` };
    },
    verify(p) { let c = 0; for (let t = p.a; t <= p.l; t += p.d) c++; return p.options.indexOf(String(c)); },
  },
  {
    id: 'ss-g18', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'term from the sum',
    make(rng) {
      const p = int(rng, 2, 5), q = int(rng, 1, 6), m = int(rng, 8, 15);
      const t = 2 * p * m - p + q;
      const o = numOpts(rng, t, [p * m * m + q * m, 2 * p * m + q, p * (2 * m - 1)]);
      return { p, q0: q, m, t, ...o,
        q: `The sum of the first $n$ terms of a sequence is $S_n=${p}n^2+${q}n$. Its ${m}th term is`,
        sol: R`<p>$a_n=S_n-S_{n-1}=${p}(2n-1)+${q}=${2 * p}n-${p - q}$. For $n=${m}$: ${t}.</p>` };
    },
    verify(o) { const S = (n) => o.p * n * n + o.q0 * n; return o.options.indexOf(fmt(S(o.m) - S(o.m - 1))); },
  },
];



// ===== expansion begin =====
// Expansion pass (2026-11-22): more L3-L5 items, new match/multi/passage items and templates. New ids ss-x001.. and ss-g19..
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
const MV = (id, lv, sub, q, truth, corr, wrongs, sol, trap) => {
  const it = M(id, lv, sub, q, corr[0], wrongs.map((w) => w[0]), sol, trap);
  const vals = wrongs.map((w) => w[1]); vals.splice(it.answer, 0, corr[1]);
  it.calc = () => vals.findIndex((v) => near(v, truth(), 1e-9)); it.calc.idx = true;
  return it;
};
const XT = (id, lv, sub, q, rows, trap) => X(id, lv, sub, q, rows.map((r) => r[0]), rows.map((r, i) => (r[1] ? i : -1)).filter((i) => i >= 0),
  '<p>' + rows.map((r) => `${r[1] ? '✓' : '✗'} ${r[2]}`).join(' ') + '</p>', trap);
const ssum = (f, a, b) => { let s = 0; for (let k = a; k <= b; k++) s += f(k); return s; };
const lim = (step, x0, n = 200) => { let x = x0; for (let i = 0; i < n; i++) x = step(x); return x; };
const termsOf = (S, n) => Array.from({ length: n }, (_, i) => S(i + 1) - S(i));
const isAP = (a) => a.slice(2).every((v, i) => near(v - a[i + 1], a[1] - a[0], 1e-9));
const isGP = (a) => a.every((v) => v !== 0) && a.slice(2).every((v, i) => near(v / a[i + 1], a[1] / a[0], 1e-9));

Object.assign(groups, {
  mx1: { title: 'Standard sums', passage: R`<p>Match each sum in List I with its value in List II.</p>`,
    list1: ['A. $1+2+\\cdots+10$', 'B. $1^2+2^2+\\cdots+10^2$', 'C. $1^3+2^3+\\cdots+10^3$', 'D. $2+4+\\cdots+20$'], list2: ['p. $55$', 'q. $110$', 'r. $385$', 's. $3025$'] },
  mx2: { title: 'Infinite series', passage: R`<p>Match each infinite series in List I with its sum in List II.</p>`,
    list1: ['A. $4+2+1+\\cdots$', 'B. $1-\\dfrac12+\\dfrac14-\\cdots$', 'C. $0.4545\\ldots$', 'D. $9-3+1-\\cdots$'], list2: ['p. $8$', 'q. $\\dfrac23$', 'r. $\\dfrac5{11}$', 's. $\\dfrac{27}4$'] },
  mx3: { title: 'Recurring decimals', passage: R`<p>Match each recurring decimal in List I with the fraction in List II.</p>`,
    list1: ['A. $0.\\overline{36}$', 'B. $0.1\\overline6$', 'C. $0.\\overline{142857}$', 'D. $0.4\\overline5$'], list2: ['p. $\\dfrac4{11}$', 'q. $\\dfrac16$', 'r. $\\dfrac17$', 's. $\\dfrac{41}{90}$'] },
  mx4: { title: 'Arithmetico-geometric series', passage: R`<p>Match each infinite series in List I (sum over $n=1,2,3,\\dots$) with its sum in List II.</p>`,
    list1: ['A. $\\sum\\dfrac n{2^n}$', 'B. $\\sum\\dfrac n{3^n}$', 'C. $\\sum\\dfrac{n^2}{2^n}$', 'D. $\\sum\\dfrac{n+1}{2^n}$'], list2: ['p. $\\dfrac34$', 'q. $2$', 'r. $3$', 's. $6$'] },
  mx5: { title: 'An AP with a = 2, d = 3', passage: R`<p>An AP has first term 2 and common difference 3. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. The 10th term', 'B. The sum of the first 10 terms', 'C. The least $n$ with $a_n>100$', 'D. The common difference of the AP with $a_5=14$, $a_9=26$'], list2: ['p. $29$', 'q. $155$', 'r. $34$', 's. $3$'] },
  mx6: { title: 'A GP with a = 3, r = 2', passage: R`<p>Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. The 6th term of the GP $3,6,12,\\dots$', 'B. The sum of its first 6 terms', 'C. The sum of the infinite GP with $a=12$, $r=\\frac13$', 'D. The ratio of a GP whose infinite sum is $2a$'], list2: ['p. $96$', 'q. $189$', 'r. $18$', 's. $\\dfrac12$'] },
  mx7: { title: 'Telescoping sums', passage: R`<p>Match each infinite series in List I with its sum in List II.</p>`,
    list1: ['A. $\\sum_{n=1}^\\infty\\dfrac1{n(n+1)}$', 'B. $\\sum_{n=1}^\\infty\\dfrac1{n(n+2)}$', 'C. $\\sum_{n=1}^\\infty\\dfrac1{n(n+1)(n+2)}$', 'D. $\\sum_{n=1}^\\infty\\dfrac1{(2n-1)(2n+1)}$'], list2: ['p. $1$', 'q. $\\dfrac34$', 'r. $\\dfrac14$', 's. $\\dfrac12$'] },
  mx8: { title: 'Limits of recurrences', passage: R`<p>Each sequence starts at $a_1=1$, except D which starts at $a_1=2$. Match the recurrence in List I with the limit of $a_n$ in List II.</p>`,
    list1: ['A. $a_{n+1}=\\sqrt{6+a_n}$', 'B. $a_{n+1}=\\dfrac12\\left(a_n+\\dfrac2{a_n}\\right)$', 'C. $a_{n+1}=1+\\dfrac1{a_n}$', 'D. $a_{n+1}=2-\\dfrac1{a_n}$ (start at $a_1=2$)'], list2: ['p. $3$', 'q. $\\sqrt2$', 'r. $\\dfrac{1+\\sqrt5}2$', 's. $1$'] },
  pz4: { title: 'Passage: a savings plan', passage: R`<p>Asha saves Rs 500 in month 1 and Rs 50 more each month than the month before (an AP).</p>` },
  pz5: { title: 'Passage: a draining tank', passage: R`<p>A tank loses 40 litres in the first minute. Each later minute it loses $80\%$ of what it lost in the minute before (a GP with $a=40$, $r=0.8$).</p>` },
});

// ----- L2 -----
items.push(
  M('ss-x001', 2, 'sum of an AP', R`In an AP the 13th term is 8. The sum of its first 25 terms is`, '200', ['100', '208', '104'],
    R`<p>$S_{25}=\dfrac{25}2(a_1+a_{25})=25\,a_{13}$ because $a_{13}$ is the middle term. $=25\times8=200$.</p>`, 'The middle term times the number of terms.', { calc: () => 25 * 8 }),
  I('ss-x002', 2, 'geometric means', R`Three positive geometric means are inserted between 2 and 32. Find their sum.`, 28,
    R`<p>There are 5 terms: $2,2r,2r^2,2r^3,2r^4=32$, so $r^4=16$ and $r=2$. The means are $4,8,16$; sum $=28$.</p>`, 'Three means make five terms in all.', { calc: () => 4 + 8 + 16 }),
  M('ss-x003', 2, 'sum of an AP', R`The sum $3+5+7+\cdots+31$ is`, '255', ['225', '240', '256'],
    R`<p>The terms are $2k+1$ for $k=1..15$, so there are 15 terms. $S=\dfrac{15}2(3+31)=255$.</p>`, 'Count the terms first.', { calc: () => ssum((k) => 2 * k + 1, 1, 15) }),
  I('ss-x004', 2, 'AM and GM', R`The arithmetic mean of two positive numbers is 13 and their geometric mean is 12. Find the larger number.`, 18,
    R`<p>$a+b=26$ and $ab=144$. The numbers are roots of $t^2-26t+144=0$, i.e. $(t-8)(t-18)=0$. The larger is 18.</p>`, 'Form the quadratic with sum and product.', { calc: () => { for (let a = 1; a < 30; a++) { const b = 26 - a; if (a * b === 144) return Math.max(a, b); } return -1; } }),
  M('ss-x005', 2, 'nth term of GP', R`The 10th term of the GP $3,6,12,\dots$ is`, '1536', ['768', '3072', '1728'],
    R`<p>$a_{10}=3\times2^9=3\times512=1536$.</p>`, 'The power is $n-1=9$.', { calc: () => 3 * 2 ** 9 }),
  M('ss-x006', 2, 'sum of a series', R`The value of $\sum_{n=1}^{10}(3n-1)$ is`, '155', ['165', '145', '150'],
    R`<p>$3\sum n-\sum1=3\times55-10=155$.</p>`, 'Subtract 1 ten times.', { calc: () => ssum((n) => 3 * n - 1, 1, 10) }),
);

// ----- L3 -----
const floorSum = ssum((n) => Math.floor(n / 3), 1, 40);
items.push(
  I('ss-x007', 3, 'nth term of AP', R`In an AP the 5th term is 11 and the 11th term is 5. Find the 20th term.`, -4,
    R`<p>$6d=5-11=-6$, so $d=-1$. $a_{20}=a_5+15d=11-15=-4$.</p>`, 'The terms are decreasing.', { calc: () => 11 + 15 * ((5 - 11) / 6) }),
  I('ss-x008', 3, 'term from the sum', R`The sum of the first $n$ terms of a sequence is $S_n=2n^2-3n$. Find its common difference.`, 4,
    R`<p>$a_n=S_n-S_{n-1}=2(2n-1)-3=4n-5$ for $n\ge2$ (and $a_1=-1$ fits). Consecutive terms differ by 4.</p>`, 'Subtract consecutive sums.', { calc: () => { const S = (n) => 2 * n * n - 3 * n; return (S(3) - S(2)) - (S(2) - S(1)); } }),
  I('ss-x009', 3, 'sum of a series', R`Find $\sum_{k=1}^{10}k(k+2)$.`, ssum((k) => k * (k + 2), 1, 10),
    R`<p>$\sum k^2+2\sum k=385+2\times55=495$.</p>`, 'Expand first.', { calc: () => ssum((k) => k * (k + 2), 1, 10) }),
  MV('ss-x010', 3, 'sum of a series', R`The sum $1+(1+2)+(1+2+3)+\cdots+(1+2+\cdots+10)$ equals`, () => ssum((n) => (n * (n + 1)) / 2, 1, 10), ['220', 220], [['385', 385], ['275', 275], ['165', 165]],
    R`<p>The $n$th group is $\dfrac{n(n+1)}2$. $\sum\dfrac{n(n+1)}2=\dfrac12(385+55)=220$ (or $\dfrac{n(n+1)(n+2)}6$ with $n=10$).</p>`, 'Add $\\sum n^2$ and $\\sum n$ together.'),
  I('ss-x011', 3, 'sum of an AP', R`Find the sum of all two-digit numbers that are divisible by 4.`, ssum((k) => 4 * k, 3, 24),
    R`<p>12, 16, ..., 96. Number of terms $\dfrac{96-12}4+1=22$. Sum $=\dfrac{22}2(12+96)=1188$.</p>`, '12 is the first two-digit multiple of 4.', { calc: () => ssum((k) => 4 * k, 3, 24) }),
  MV('ss-x012', 3, 'recurring decimal', R`The recurring decimal $0.2333\ldots$ equals`, () => 0.2 + 3 / 90, [R`$\dfrac7{30}$`, 7 / 30], [[R`$\dfrac{23}{99}$`, 23 / 99], [R`$\dfrac29$`, 2 / 9], [R`$\dfrac{23}{90}$`, 23 / 90]],
    R`<p>$0.2333\ldots=\dfrac2{10}+\dfrac{0.0333\ldots}1=\dfrac15+\dfrac1{30}=\dfrac7{30}$. (Or: $10x=2.333\ldots$, $100x=23.333\ldots$, subtract: $90x=21$.)</p>`, 'Only the 3 repeats.'),
  I('ss-x013', 3, 'three numbers in GP', R`Three positive numbers in GP have product 512 and sum 28. Find the largest.`, 16,
    R`<p>Write them $\dfrac ar,a,ar$: product $a^3=512$, so $a=8$. $8\left(\dfrac1r+1+r\right)=28$ gives $r+\dfrac1r=\dfrac52$, so $r=2$ or $\dfrac12$. The numbers are $4,8,16$; the largest is 16.</p>`, 'The middle term is the cube root of the product.', { calc: () => 16 }),
  MV('ss-x014', 3, 'ratio of sums', R`The sums of $m$ and $n$ terms of an AP are in the ratio $m^2:n^2$. The ratio of its 9th term to its 19th term is`, () => 17 / 37, [R`$\dfrac{17}{37}$`, 17 / 37], [[R`$\dfrac9{19}$`, 9 / 19], [R`$\dfrac{81}{361}$`, 81 / 361], [R`$\dfrac{37}{17}$`, 37 / 17]],
    R`<p>$\dfrac{S_m}{S_n}=\dfrac{m^2}{n^2}$ means $S_n=kn^2$, so $a_n=k(2n-1)$. $\dfrac{a_9}{a_{19}}=\dfrac{17}{37}$.</p>`, 'The ratio of terms is $(2m-1):(2n-1)$.'),
  I('ss-x015', 3, 'telescoping', R`If $\sum_{k=1}^{n}\dfrac1{k(k+1)}=\dfrac9{10}$, find $n$.`, 9,
    R`<p>$\dfrac1{k(k+1)}=\dfrac1k-\dfrac1{k+1}$, so the sum is $1-\dfrac1{n+1}=\dfrac n{n+1}$. $\dfrac n{n+1}=\dfrac9{10}$ gives $n=9$.</p>`, 'Telescope.', { calc: () => { for (let n = 1; n < 50; n++) if (near(n / (n + 1), 0.9)) return n; return -1; } }),
  A('ss-x016', 3, 'infinite GP', R`The sum of the series $1+\dfrac13+\dfrac19+\cdots$ is $\dfrac32$.`, R`The sum of an infinite GP with first term $a$ and ratio $r$, $|r|<1$, is $\dfrac a{1-r}$.`, 0,
    R`<p>$\dfrac1{1-\frac13}=\dfrac32$. R states the formula that gives it.</p>`, 'Check $|r|<1$.'),
  S('ss-x017', 3, 'logs and squares', R`If $a,b,c>0$ are in GP, then $\log a,\log b,\log c$ are in AP.`, R`If $a,b,c$ are in AP, then $a^2,b^2,c^2$ are in AP.`, 1,
    R`<p>I: $b^2=ac\Rightarrow2\log b=\log a+\log c$, true. II: $1,2,3$ are in AP but $1,4,9$ are not, so II is false.</p>`, 'Test with $1,2,3$.'),
  MT('ss-x018', 3, 'standard sums', 'mx1', R`Match List I with List II.`, 'A-p, B-r, C-s, D-q', ['A-r, B-p, C-s, D-q', 'A-p, B-r, C-q, D-s', 'A-q, B-r, C-s, D-p'],
    R`<p>A: $55$ (p). B: $\dfrac{10\cdot11\cdot21}6=385$ (r). C: $55^2=3025$ (s). D: $2\times55=110$ (q).</p>`, 'The sum of cubes is the square of the sum.'),
  MT('ss-x019', 3, 'infinite GP', 'mx2', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $\dfrac4{1/2}=8$ (p). B: $\dfrac1{1+1/2}=\dfrac23$ (q). C: $0.4545\ldots=\dfrac{45}{99}=\dfrac5{11}$ (r). D: $\dfrac9{1+1/3}=\dfrac{27}4$ (s).</p>`, 'A negative ratio makes the denominator $1+|r|$.'),
  PI('ss-x020', 3, 'AP in context', 'pz4', R`How much (in Rs) does she save in month 12?`, 500 + 11 * 50,
    R`<p>$a_{12}=500+11\times50=1050$.</p>`, 'The 12th term has 11 steps.', { calc: () => 500 + 11 * 50 }),
  PI('ss-x021', 3, 'AP in context', 'pz4', R`How much (in Rs) does she save in total in the first 24 months?`, 12 * (2 * 500 + 23 * 50),
    R`<p>$S_{24}=\dfrac{24}2\left[2(500)+23(50)\right]=12\times2150=25800$.</p>`, 'Use $\\frac n2[2a+(n-1)d]$.', { calc: () => ssum((n) => 500 + (n - 1) * 50, 1, 24) }),
  PI('ss-x022', 3, 'AP in context', 'pz4', R`In which month does her monthly saving first exceed Rs 2000?`, 32,
    R`<p>$500+50(n-1)>2000\Rightarrow n-1>30\Rightarrow n>31$. The first month is $n=32$ (Rs 2050; month 31 gives exactly 2000, which does not exceed it).</p>`, '"Exceeds" means strictly more.', { calc: () => { for (let n = 1; n < 100; n++) if (500 + 50 * (n - 1) > 2000) return n; return -1; } }),
);

// ----- L4 -----
const luc = (() => { const a = [2, 1]; while (a.length < 15) a.push(a[a.length - 1] + a[a.length - 2]); return a[14]; })();
const nEven = (() => { let c = 0; for (let n = 1; n <= 50; n++) if ((n * (n + 1) / 2) % 3 === 0) c++; return c; })();
const altSq = ssum((n) => (-1) ** n * n * n, 1, 50);
const rep10 = ssum((k) => (7 / 9) * (1 - 10 ** -k), 1, 10);
items.push(
  I('ss-x023', 4, 'nth term of AP', R`In an AP the 3rd term is $\dfrac15$ and the 5th term is $\dfrac13$. Find the 15th term.`, 1,
    R`<p>$2d=\dfrac13-\dfrac15=\dfrac2{15}$, so $d=\dfrac1{15}$. $a_{15}=a_3+12d=\dfrac15+\dfrac{12}{15}=1$.</p>`, 'Keep fractions exact.', { calc: () => Math.round((1 / 5 + 12 * (1 / 3 - 1 / 5) / 2) * 1e9) / 1e9 }),
  I('ss-x024', 4, 'floor sums', R`Find $\sum_{n=1}^{40}\left\lfloor\dfrac n3\right\rfloor$, where $\lfloor x\rfloor$ is the greatest integer not exceeding $x$.`, floorSum,
    R`<p>The value $\lfloor n/3\rfloor$ is $k$ for $n=3k,3k+1,3k+2$. For $k=0$ it appears for $n=1,2$ (value 0). Values $k=1..12$ appear three times each ($n=3..38$): $3\times78=234$. Then $n=39$ gives 13 and $n=40$ gives 13: $26$. Total $234+26=260$.</p>`, 'Group the $n$ with the same floor.', { calc: () => floorSum }),
  I('ss-x025', 4, 'AP and GP', R`Three positive numbers $a<b<c$ are in AP with sum 15. Adding 1, 3, 9 to them respectively gives three numbers in GP. Find $c$.`, 7,
    R`<p>Write them $5-d,\,5,\,5+d$. After adding: $6-d,\ 8,\ 14+d$ are in GP, so $(6-d)(14+d)=64$, i.e. $d^2+8d-20=0$, $d=2$ (or $-10$ which is rejected because $a<b<c$). The numbers are $3,5,7$ and $c=7$.</p>`, 'Reject the negative common difference.', { calc: () => { for (let d = 1; d < 5; d++) if ((6 - d) * (14 + d) === 64) return 5 + d; return -1; } }),
  I('ss-x026', 4, 'Lucas sequence', R`A sequence has $a_1=2$, $a_2=1$ and $a_{n+2}=a_{n+1}+a_n$. Find $a_{15}$.`, luc,
    R`<p>The terms are $2,1,3,4,7,11,18,29,47,76,123,199,322,521,843$. So $a_{15}=843$.</p>`, 'Write the terms out carefully.', { calc: () => luc }),
  I('ss-x027', 4, 'AM-GM', R`For $x>2$, find the least value of $4x+\dfrac9{x-2}$.`, 20,
    R`<p>Write $4(x-2)+\dfrac9{x-2}+8$. By AM-GM $4(x-2)+\dfrac9{x-2}\ge2\sqrt{36}=12$, with equality when $4(x-2)^2=9$, i.e. $x=\dfrac72>2$. Least value $=12+8=20$.</p>`, 'Add and subtract 8 so that $x-2$ appears.', { calc: () => { let m = Infinity; for (let i = 1; i < 400000; i++) { const x = 2 + i / 100000; m = Math.min(m, 4 * x + 9 / (x - 2)); } return Math.round(m); } }),
  I('ss-x028', 4, 'AM-GM', R`For positive numbers $a,b,c$ with $abc=1$, find the least value of $(a+b)(b+c)(c+a)$.`, 8,
    R`<p>By AM-GM $a+b\ge2\sqrt{ab}$, $b+c\ge2\sqrt{bc}$, $c+a\ge2\sqrt{ca}$. Multiply: $\ge8\sqrt{(abc)^2}=8$. Equality when $a=b=c=1$.</p>`, 'Equality needs $a=b=c$.', { calc: () => { let m = Infinity; for (let a = 0.2; a < 5; a += 0.05) for (let b = 0.2; b < 5; b += 0.05) { const c = 1 / (a * b); m = Math.min(m, (a + b) * (b + c) * (c + a)); } return Math.round(m); } }),
  I('ss-x029', 4, 'telescoping', R`Find $4\sum_{n=1}^{\infty}\dfrac1{n(n+2)}$.`, 3,
    R`<p>$\dfrac1{n(n+2)}=\dfrac12\left(\dfrac1n-\dfrac1{n+2}\right)$. The sum telescopes to $\dfrac12\left(1+\dfrac12\right)=\dfrac34$. Times 4 is 3.</p>`, 'Two terms (not one) survive.', { calc: () => Math.round(4 * ssum((n) => 1 / (n * (n + 2)), 1, 200000)) }),
  I('ss-x030', 4, 'triangular numbers', R`For how many $n$ with $1\le n\le50$ is $1+2+\cdots+n$ a multiple of 3?`, nEven,
    R`<p>$T_n=\dfrac{n(n+1)}2$ is a multiple of 3 exactly when $3\mid n(n+1)$, i.e. $n\equiv0$ or $2\pmod3$. Among $1..50$, $n\equiv1\pmod3$ happens for $n=1,4,\dots,49$: 17 values. So $50-17=33$.</p>`, '$n\\equiv1\\pmod 3$ is the only bad case.', { calc: () => nEven }),
  I('ss-x031', 4, 'alternating sums', R`Find $-1^2+2^2-3^2+4^2-\cdots+50^2$.`, altSq,
    R`<p>Pair the terms: $(2k)^2-(2k-1)^2=4k-1$ for $k=1,\dots,25$. Sum $=4\times325-25=1275$.</p>`, 'The first term is negative here.', { calc: () => altSq }),
  I('ss-x032', 4, 'recurrence', R`A positive GP has $a_1+a_2=12$ and $a_3+a_4=108$. Find $a_5+a_6$.`, 972,
    R`<p>$a_3+a_4=r^2(a_1+a_2)$, so $r^2=9$, $r=3$ (positive). Then $a_5+a_6=r^2(a_3+a_4)=9\times108=972$.</p>`, 'Every second pair is multiplied by $r^2$.', { calc: () => 108 * 9 }),
);
items.push(
  N('ss-x033', 4, 'recurring sums', R`Find the sum of the first 10 terms of $0.7+0.77+0.777+\cdots$ to 3 decimal places.`, +rep10.toFixed(3), 0.001,
    R`<p>The $k$th term is $\dfrac79\left(1-10^{-k}\right)$. $S_{10}=\dfrac79\left(10-\dfrac{0.1(1-10^{-10})}{0.9}\right)=\dfrac79(10-0.1111)=7.691$.</p>`, 'Write each term as $\\frac79(1-10^{-k})$.', { calc: () => rep10 }),
  N('ss-x034', 4, 'telescoping', R`Find $\sum_{n=1}^{\infty}\dfrac1{n(n+1)(n+2)}$ (as a decimal).`, 0.25, 0.001,
    R`<p>$\dfrac1{n(n+1)(n+2)}=\dfrac12\left[\dfrac1{n(n+1)}-\dfrac1{(n+1)(n+2)}\right]$. The sum telescopes to $\dfrac12\cdot\dfrac1{1\cdot2}=\dfrac14$.</p>`, 'Split into two products.', { calc: () => ssum((n) => 1 / (n * (n + 1) * (n + 2)), 1, 200000) }),
  N('ss-x035', 4, 'telescoping', R`Find $\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\cdots$ up to 50 terms, to 3 decimal places.`, +(50 / 51).toFixed(3), 0.001,
    R`<p>The sum is $1-\dfrac1{51}=\dfrac{50}{51}=0.980$.</p>`, 'Fifty terms give $1-\\frac1{51}$.', { calc: () => ssum((n) => 1 / (n * (n + 1)), 1, 50) }),
  N('ss-x036', 4, 'arithmetico-geometric', R`Find $\sum_{n=1}^{\infty}\dfrac{3n+1}{4^n}$ to 3 decimal places.`, +(5 / 3).toFixed(3), 0.001,
    R`<p>$\sum nx^n=\dfrac x{(1-x)^2}$ and $\sum x^n=\dfrac x{1-x}$ with $x=\dfrac14$: $3\cdot\dfrac{1/4}{9/16}+\dfrac{1/4}{3/4}=3\cdot\dfrac49+\dfrac13=\dfrac43+\dfrac13=\dfrac53\approx1.667$.</p>`, 'Split into two series.', { calc: () => ssum((n) => (3 * n + 1) / 4 ** n, 1, 200) }),
  N('ss-x037', 4, 'limit of a recurrence', R`$a_1=\sqrt6$ and $a_{n+1}=\sqrt{6+a_n}$. Find $\lim a_n$.`, 3, 0.001,
    R`<p>If the limit $L$ exists, $L=\sqrt{6+L}$, so $L^2-L-6=0$, $L=3$ (or $-2$, rejected). The sequence is increasing and bounded by 3, so the limit exists.</p>`, 'Reject the negative root.', { calc: () => lim((x) => Math.sqrt(6 + x), Math.sqrt(6)) }),
);
const aS1 = termsOf((n) => n * n + 2 * n, 8), aS2 = termsOf((n) => 3 ** n - 1, 8), aS3 = termsOf((n) => n * n + 1, 8), aS4 = termsOf((n) => 2 * n * n + n, 8);
items.push(
  XT('ss-x038', 4, 'partial sums', R`$S_n$ is the sum of the first $n$ terms of a sequence. Which of the following are correct?`, [
    [R`$S_n=n^2+2n$ gives an AP`, isAP(aS1), R`$a_n=2n+1$, an AP with $d=2$.`],
    [R`$S_n=3^n-1$ gives a GP`, isGP(aS2), R`$a_1=2$, $a_n=2\cdot3^{n-1}$, a GP.`],
    [R`$S_n=n^2+1$ gives an AP`, isAP(aS3), R`$a_1=2$, $a_2=3$, $a_3=5$, not an AP (the first term does not fit the pattern).`],
    [R`$S_n=2n^2+n$ gives an AP`, isAP(aS4), R`$a_n=4n-1$, an AP with $d=4$.`]], '$S_n$ without a constant term gives an AP.'),
  XT('ss-x039', 4, 'means', R`For the numbers 4 and 9, which of the following are correct?`, [
    [R`The AM is 6.5`, near((4 + 9) / 2, 6.5), R`$\frac{4+9}2=6.5$.`],
    [R`The GM is 6`, near(Math.sqrt(36), 6), R`$\sqrt{4\cdot9}=6$.`],
    [R`The HM is $\dfrac{72}{13}$`, near(2 * 4 * 9 / 13, 72 / 13), R`$\dfrac{2\cdot36}{13}=\dfrac{72}{13}$.`],
    [R`HM $>$ GM`, 72 / 13 > 6, R`$\frac{72}{13}\approx5.54<6$, so HM $<$ GM $<$ AM.`]], 'The order is AM $\\ge$ GM $\\ge$ HM.'),
  XT('ss-x040', 4, 'recurrence', R`$a_1=3$ and $a_{n+1}=3a_n-2$. Which of the following are correct?`, (() => { const a = [3]; for (let i = 1; i < 8; i++) a.push(3 * a[i - 1] - 2); return [
    [R`$a_5=163$`, a[4] === 163, R`$3,7,19,55,163$.`],
    [R`$a_n-1$ is a GP with ratio 3`, a.slice(1).every((v, i) => (v - 1) === 3 * (a[i] - 1)), R`$a_{n+1}-1=3(a_n-1)$.`],
    [R`$a_n=2\cdot3^{n-1}+1$`, a.every((v, i) => v === 2 * 3 ** i + 1), R`from $a_n-1=2\cdot3^{n-1}$.`],
    [R`$a_n$ is an AP`, isAP(a), R`the differences $4,12,36,\dots$ are not equal.`]]; })(), 'Shift by the fixed point 1.'),
  XT('ss-x041', 4, 'infinite series', R`Which of the following infinite series converge?`, [
    [R`$\sum\left(-\dfrac12\right)^n$`, true, R`$|r|=\frac12<1$.`],
    [R`$\sum(1.1)^n$`, false, R`$|r|>1$, so the terms grow and the series diverges.`],
    [R`$\sum\left(\dfrac23\right)^n$`, true, R`$|r|=\frac23<1$.`],
    [R`$\sum\left(-1\right)^n$`, false, R`the partial sums alternate between $-1$ and $0$ and do not settle ($|r|=1$).`]], 'A GP converges only if $|r|<1$.'),
  XT('ss-x042', 4, 'harmonic progression', R`The HP is $\dfrac13,\dfrac17,\dfrac1{11},\dots$. Which of the following are correct?`, [
    [R`The reciprocals form an AP with $d=4$`, true, R`$3,7,11,\dots$`],
    [R`The 10th term is $\dfrac1{39}$`, 3 + 9 * 4 === 39, R`$a_{10}=3+9\times4=39$ for the reciprocal.`],
    [R`The 10th term is $\dfrac1{43}$`, 3 + 9 * 4 === 43, R`the reciprocal of the 10th term is $39$, not 43.`],
    [R`The 5th term is $\dfrac1{19}$`, 3 + 4 * 4 === 19, R`$3+4\times4=19$.`]], 'The $n$th reciprocal is $3+4(n-1)$.'),
  A('ss-x043', 4, 'partial sums', R`If $a_n=2n^2$ then $a_1,a_2,a_3,\dots$ is an AP.`, R`The differences of consecutive terms of an AP are constant.`, 3,
    R`<p>$a_n=2,8,18,32,\dots$ has differences $6,10,14,\dots$ which are not constant, so A is false. R is true.</p>`, 'Check the differences.'),
  A('ss-x044', 4, 'infinite GP', R`$1+\dfrac12+\dfrac14+\cdots=2$.`, R`The sum of an infinite GP exists for every common ratio $r$.`, 2,
    R`<p>A is true ($\frac1{1-1/2}=2$). R is false: the sum exists only for $|r|<1$.</p>`, 'The condition $|r|<1$.'),
  S('ss-x045', 4, 'squares of progressions', R`If $a,b,c$ are in AP, then $a^2,b^2,c^2$ are in AP.`, R`If $a,b,c$ are in GP, then $a^2,b^2,c^2$ are in GP.`, 2,
    R`<p>I: false ($1,2,3\to1,4,9$). II: $b^2=ac\Rightarrow b^4=a^2c^2$, true.</p>`, 'Test with $1,2,3$.'),
  MT('ss-x046', 4, 'recurring decimal', 'mx3', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $\dfrac{36}{99}=\dfrac4{11}$ (p). B: $0.1+0.0666\ldots=\dfrac1{10}+\dfrac1{15}=\dfrac16$ (q). C: $\dfrac1{7}$ (r). D: $0.4+0.0555\ldots=\dfrac25+\dfrac1{18}=\dfrac{41}{90}$ (s).</p>`, 'Use $\\frac{\\text{whole}-\\text{non-repeating}}{9\\ldots90\\ldots0}$.'),
  MT('ss-x047', 4, 'arithmetico-geometric', 'mx4', R`Match List I with List II.`, 'A-q, B-p, C-s, D-r', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-q, B-r, C-s, D-p'],
    R`<p>A: $\dfrac{1/2}{(1/2)^2}=2$ (q). B: $\dfrac{1/3}{(2/3)^2}=\dfrac34$ (p). C: $\dfrac{x(1+x)}{(1-x)^3}$ with $x=\frac12$: $\dfrac{3/4}{1/8}=6$ (s). D: $2+1=3$ (r).</p>`, 'Use $\\sum nx^n=\\frac x{(1-x)^2}$.'),
  MT('ss-x048', 4, 'AP', 'mx5', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $2+9\times3=29$ (p). B: $\dfrac{10}2(2+29)=155$ (q). C: $2+3(n-1)>100\Rightarrow n>33.67$, so $n=34$ (r). D: $4d=12$, $d=3$ (s).</p>`, 'The inequality must be strict.'),
  MT('ss-x049', 4, 'GP', 'mx6', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $3\times2^5=96$ (p). B: $3(2^6-1)=189$ (q). C: $\dfrac{12}{1-1/3}=18$ (r). D: $\dfrac a{1-r}=2a\Rightarrow1-r=\dfrac12\Rightarrow r=\dfrac12$ (s).</p>`, 'Solve $1-r=\\frac12$.'),
  PN('ss-x050', 4, 'GP in context', 'pz5', R`How many litres does it lose in the 5th minute?`, 16.384, 0.001,
    R`<p>$40\times0.8^4=40\times0.4096=16.384$.</p>`, 'The 5th term has $r^4$.', { calc: () => 40 * 0.8 ** 4 }),
  PI('ss-x051', 4, 'GP in context', 'pz5', R`The most the tank could ever lose in total (in litres) is`, 200,
    R`<p>The sum to infinity is $\dfrac{40}{1-0.8}=200$.</p>`, '$|r|<1$.', { calc: () => 40 / (1 - 0.8) }),
  PI('ss-x052', 4, 'GP in context', 'pz5', R`In which minute does the loss first fall below 1 litre?`, 18,
    R`<p>$40(0.8)^{n-1}<1\Rightarrow0.8^{n-1}<0.025\Rightarrow n-1>\dfrac{\ln40}{\ln1.25}\approx16.5$. So $n-1\ge17$, $n=18$.</p>`, 'Round up after the inequality.', { calc: () => { for (let n = 1; n < 200; n++) if (40 * 0.8 ** (n - 1) < 1) return n; return -1; } }),
);

// ----- more L4 and L5 -----
const simplex = (f) => { let mn = Infinity, mx = -Infinity; const n = 120; for (let i = 1; i < n; i++) for (let j = 1; i + j < n; j++) { const a = 6 * i / n, b = 6 * j / n, c = 6 - a - b; const v = f(a, b, c); if (v < mn) mn = v; if (v > mx) mx = v; } return { mn, mx }; };
const x5 = lim((x) => x * x - x + 1, 2, 4);
const bS = ssum((k) => k * 2 ** (k - 1), 1, 8);
const p20 = (() => { let p = 1; for (let k = 2; k <= 20; k++) p *= 1 - 1 / (k * k); return p; })();
const s1 = (() => { let s = 0; for (let k = 1; k <= 1e4; k++) s += 1 / Math.sqrt(k); return s; })();
const rec = (() => { const a = [1]; for (let n = 1; n < 8; n++) a.push(a[n - 1] + n * n); return a; })();
items.push(
  I('ss-x053', 4, 'recurrence', R`$a_1=1$ and $a_{n+1}=\dfrac{a_n}{1+a_n}$. Find $\dfrac1{a_{50}}$.`, 50,
    R`<p>Take reciprocals: $\dfrac1{a_{n+1}}=\dfrac{1+a_n}{a_n}=\dfrac1{a_n}+1$. So $\dfrac1{a_n}$ is an AP with first term 1 and difference 1, and $\dfrac1{a_{50}}=50$.</p>`, 'Reciprocals turn the recurrence into an AP.', { calc: () => { let a = 1; for (let n = 1; n < 50; n++) a = a / (1 + a); return Math.round(1 / a); } }),
  I('ss-x054', 4, 'recurrence', R`$x_1=2$ and $x_{n+1}=x_n^2-x_n+1$. Find $x_5$.`, x5,
    R`<p>$x_2=4-2+1=3$; $x_3=9-3+1=7$; $x_4=49-7+1=43$; $x_5=1849-43+1=1807$.</p>`, 'Square before subtracting.', { calc: () => x5 }),
  I('ss-x055', 5, 'arithmetico-geometric', R`Find $2\sum_{n=1}^{\infty}\dfrac{n^2}{3^n}$.`, 3,
    R`<p>$\sum n^2x^n=\dfrac{x(1+x)}{(1-x)^3}$. With $x=\dfrac13$: $\dfrac{\frac13\cdot\frac43}{\frac8{27}}=\dfrac49\cdot\dfrac{27}8=\dfrac32$. Twice that is 3.</p>`, 'Check the formula with $x=\\frac12$: it gives 6.', { calc: () => Math.round(2 * ssum((n) => n * n / 3 ** n, 1, 300)) }),
  I('ss-x056', 5, 'telescoping', R`Find $41\sum_{k=1}^{20}\dfrac1{4k^2-1}$.`, 20,
    R`<p>$\dfrac1{4k^2-1}=\dfrac1{(2k-1)(2k+1)}=\dfrac12\left(\dfrac1{2k-1}-\dfrac1{2k+1}\right)$. The sum is $\dfrac12\left(1-\dfrac1{41}\right)=\dfrac{20}{41}$. Times 41 is 20.</p>`, 'The last term is $2k+1=41$.', { calc: () => Math.round(41 * ssum((k) => 1 / (4 * k * k - 1), 1, 20)) }),
  I('ss-x057', 5, 'products', R`Find $40\prod_{k=2}^{20}\left(1-\dfrac1{k^2}\right)$.`, 21,
    R`<p>$1-\dfrac1{k^2}=\dfrac{(k-1)(k+1)}{k^2}$. The product telescopes to $\dfrac1{2}\cdot\dfrac{n+1}{n}=\dfrac{n+1}{2n}=\dfrac{21}{40}$ for $n=20$. Times 40 is 21.</p>`, 'Write each factor as a ratio of neighbours.', { calc: () => Math.round(40 * p20) }),
  I('ss-x058', 5, 'bounds', R`Find $\left\lfloor\sum_{k=1}^{10000}\dfrac1{\sqrt k}\right\rfloor$.`, Math.floor(s1),
    R`<p>For each $k$, $\dfrac1{\sqrt k}$ lies between $2(\sqrt{k+1}-\sqrt k)$ and $2(\sqrt k-\sqrt{k-1})$. Summing: $2(\sqrt{10001}-1)<S<1+2(\sqrt{10000}-1)=199$. The lower bound is about $198.01$. So $198<S<199$ and the integer part is 198.</p>`, 'Bound the sum with telescoping square roots.', { calc: () => Math.floor(s1) }),
  I('ss-x059', 5, 'arithmetico-geometric', R`Find $\sum_{k=1}^{8}k\cdot2^{k-1}$.`, bS,
    R`<p>Let $S=\sum k2^{k-1}$. Then $2S-S=8\cdot2^8-(1+2+4+\cdots+2^7)=2048-255=1793$.</p>`, 'Multiply by the ratio and subtract.', { calc: () => bS }),
  N('ss-x060', 5, 'limit of a recurrence', R`$a_1=1$ and $a_{n+1}=\dfrac12\left(a_n+\dfrac2{a_n}\right)$. Find $\lim a_n$ to 3 decimal places.`, 1.414, 0.001,
    R`<p>If $L$ is the limit, $L=\dfrac12\left(L+\dfrac2L\right)$, so $L^2=2$, $L=\sqrt2\approx1.414$ (all terms after $a_1$ are at least $\sqrt2$ by AM-GM, so $L>0$).</p>`, 'Newton\'s method for $\\sqrt2$.', { calc: () => lim((x) => 0.5 * (x + 2 / x), 1) }),
  N('ss-x061', 5, 'telescoping', R`Find $\sum_{n=1}^{\infty}\dfrac n{n^4+n^2+1}$ (as a decimal).`, 0.5, 0.001,
    R`<p>$n^4+n^2+1=(n^2+n+1)(n^2-n+1)$ and $\dfrac n{n^4+n^2+1}=\dfrac12\left[\dfrac1{n^2-n+1}-\dfrac1{n^2+n+1}\right]$. Since $(n+1)^2-(n+1)+1=n^2+n+1$, the sum telescopes to $\dfrac12\cdot\dfrac1{1}=\dfrac12$.</p>`, 'Factor the denominator.', { calc: () => ssum((n) => n / (n ** 4 + n * n + 1), 1, 100000) }),
);
items.push(
  XT('ss-x062', 5, 'infinite sums', R`Which of the following are correct?`, [
    [R`$\sum_{n=1}^\infty\dfrac{n^2}{3^n}=\dfrac32$`, near(ssum((n) => n * n / 3 ** n, 1, 300), 1.5, 1e-9), R`$\frac{x(1+x)}{(1-x)^3}$ at $x=\frac13$.`],
    [R`$\sum_{n=1}^\infty\dfrac1{n(n+1)(n+2)(n+3)}=\dfrac1{18}$`, near(ssum((n) => 1 / (n * (n + 1) * (n + 2) * (n + 3)), 1, 100000), 1 / 18, 1e-6), R`telescoping: $\frac13\cdot\frac1{1\cdot2\cdot3}=\frac1{18}$.`],
    [R`$\sum_{n=2}^\infty\dfrac1{n^2-1}=\dfrac34$`, near(ssum((n) => 1 / (n * n - 1), 2, 100000), 0.75, 1e-4), R`$\frac12\left(1+\frac12\right)=\frac34$.`],
    [R`$\sum_{n=1}^\infty\dfrac1{n(n+2)}=1$`, near(ssum((n) => 1 / (n * (n + 2)), 1, 100000), 1, 1e-3), R`the sum is $\frac34$, not 1.`]], 'Telescope each carefully.'),
  XT('ss-x063', 5, 'AM-GM', R`The positive numbers $a,b,c$ satisfy $a+b+c=6$. Which of the following are correct?`, [
    [R`$abc\le8$`, simplex((a, b, c) => a * b * c).mx <= 8 + 1e-9, R`AM-GM: $abc\le\left(\frac63\right)^3=8$.`],
    [R`$ab+bc+ca\le12$`, simplex((a, b, c) => a * b + b * c + c * a).mx <= 12 + 1e-9, R`$(a+b+c)^2\ge3(ab+bc+ca)$.`],
    [R`$a^2+b^2+c^2\ge12$`, simplex((a, b, c) => a * a + b * b + c * c).mn >= 12 - 1e-9, R`QM-AM: $a^2+b^2+c^2\ge\frac{36}3=12$.`],
    [R`$abc\ge8$`, simplex((a, b, c) => a * b * c).mn >= 8, R`AM-GM gives an upper bound for $abc$, not a lower bound.`]], 'AM-GM gives upper bounds for products.'),
  XT('ss-x064', 5, 'recurrence', R`$a_1=1$ and $a_{n+1}=a_n+n^2$. Which of the following are correct?`, [
    [R`$a_5=31$`, rec[4] === 31, R`$1,2,6,15,31$.`],
    [R`$a_6=56$`, rec[5] === 56, R`$31+25=56$.`],
    [R`$a_n=\dfrac{n(n+1)(2n+1)}6$`, rec.every((v, i) => v === ((i + 1) * (i + 2) * (2 * i + 3)) / 6), R`$a_n=1+\sum_{k<n}k^2=1+\frac{(n-1)n(2n-1)}6$; for $n=1$ the claimed formula gives 1 but for $n=2$ it gives 5, not 2.`],
    [R`$a_n=1+\dfrac{(n-1)n(2n-1)}6$`, rec.every((v, i) => v === 1 + (i * (i + 1) * (2 * i + 1)) / 6), R`sum of the first $n-1$ squares plus 1.`]], 'Check $n=2$.'),
  XT('ss-x065', 5, 'bounds', R`Let $S=\sum_{k=1}^{10000}\dfrac1{\sqrt k}$. Which of the following are correct?`, [
    [R`$198<S<199$`, s1 > 198 && s1 < 199, R`from the telescoping bounds.`],
    [R`$S>2(\sqrt{10001}-1)$`, s1 > 2 * (Math.sqrt(10001) - 1), R`each term exceeds $2(\sqrt{k+1}-\sqrt k)$.`],
    [R`$S<2\sqrt{10000}=200$`, s1 < 200, R`indeed $S<199<200$.`],
    [R`$S>200$`, s1 > 200, R`$S\approx198.5$.`]], 'Compare each term with a telescoping difference.'),
  A('ss-x066', 5, 'telescoping', R`$\sum_{n=1}^{\infty}\dfrac1{n(n+1)(n+2)}=\dfrac14$.`, R`$\dfrac1{n(n+1)(n+2)}=\dfrac12\left[\dfrac1{n(n+1)}-\dfrac1{(n+1)(n+2)}\right]$.`, 0,
    R`<p>R is true, and summing it telescopes to $\dfrac12\cdot\dfrac1{1\cdot2}=\dfrac14$. R is the reason for A.</p>`, 'Check R by combining the fractions.'),
  S('ss-x067', 5, 'convergence', R`The series $\sum_{n=1}^\infty\dfrac1{n^2}$ converges.`, R`A series converges whenever its terms tend to 0.`, 1,
    R`<p>I is true (it sums to $\dfrac{\pi^2}6$). II is false: the harmonic series $1+\frac12+\frac13+\cdots$ has terms tending to 0 but diverges.</p>`, 'Terms tending to 0 is necessary, not sufficient.'),
  MT('ss-x068', 5, 'telescoping', 'mx7', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $1$ (p). B: $\dfrac12\left(1+\dfrac12\right)=\dfrac34$ (q). C: $\dfrac14$ (r). D: $\dfrac1{(2n-1)(2n+1)}=\dfrac12\left(\dfrac1{2n-1}-\dfrac1{2n+1}\right)$, sum $\dfrac12$ (s).</p>`, 'Count how many terms survive.'),
  MT('ss-x069', 5, 'limits of recurrences', 'mx8', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $L=\sqrt{6+L}\Rightarrow L=3$ (p). B: $L^2=2$, $L=\sqrt2$ (q). C: $L=1+\dfrac1L\Rightarrow L^2-L-1=0$, $L=\dfrac{1+\sqrt5}2$ (r). D: $L=2-\dfrac1L\Rightarrow(L-1)^2=0$, $L=1$ (s).</p>`, 'Set $L=f(L)$ and take the positive root.'),
);

// single-answer items keyed by a number: calc gives the number, turn it into the option index
for (const it of items) {
  if (!it.id.startsWith('ss-x') || it.type !== 'mcq' || it.format !== 'single' || typeof it.calc !== 'function' || it.calc.idx) continue;
  const val = it.calc; const num = (o) => Number(String(o).replace(/<[^>]*>|\\[a-z]+|[^0-9.\-]/gi, ''));
  it.calc = () => it.options.findIndex((o) => Math.abs(num(o) - val()) < 1e-9);
}

items.push(
  XT('ss-x070', 4, 'standard sums', R`Which of the following are correct?`, [
    [R`$1^2+2^2+\cdots+12^2=650$`, ssum((k) => k * k, 1, 12) === 650, R`$\dfrac{12\cdot13\cdot25}6=650$.`],
    [R`$1^3+2^3+\cdots+9^3=2025$`, ssum((k) => k ** 3, 1, 9) === 2025, R`$45^2=2025$.`],
    [R`$2+4+6+\cdots+50=650$`, ssum((k) => 2 * k, 1, 25) === 650, R`$25\times26=650$.`],
    [R`$1+3+5+\cdots+49=650$`, ssum((k) => 2 * k - 1, 1, 25) === 650, R`$25^2=625$, not 650.`]], 'Odd numbers add up to a perfect square.'),
);

// ----- new templates -----
const frs = (n, d) => { const g = ((a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); })(n, d); n /= g; d /= g; return d === 1 ? `${n}` : R`\dfrac{${n}}{${d}}`; };
gens.push(
  { id: 'ss-g19', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'sum of a series',
    make(rng) { const n = int(rng, 6, 20); const answer = (n * (n + 1) * (2 * n + 7)) / 6;
      return { n, answer, tol: 0, q: `Find $\\sum_{k=1}^{${n}}k(k+2)$.`,
        sol: R`<p>$\sum k^2+2\sum k=\dfrac{${n}\cdot${n + 1}\cdot${2 * n + 1}}6+${n}\cdot${n + 1}=${answer}$.</p>` }; },
    verify(p) { let s = 0; for (let k = 1; k <= p.n; k++) s += k * (k + 2); return s; } },
  { id: 'ss-g20', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'common terms',
    make(rng) { const a1 = int(rng, 1, 6), d1 = int(rng, 2, 5), a2 = int(rng, 1, 8), d2 = int(rng, 3, 7), N = int(rng, 30, 60);
      const A = Array.from({ length: N }, (_, i) => a1 + i * d1), B = new Set(Array.from({ length: N }, (_, i) => a2 + i * d2));
      const answer = A.filter((v) => B.has(v)).length;
      return { a1, d1, a2, d2, N, answer, tol: 0, q: `The AP $${a1},${a1 + d1},${a1 + 2 * d1},\\dots$ and the AP $${a2},${a2 + d2},${a2 + 2 * d2},\\dots$ each have ${N} terms. How many numbers appear in both lists?`,
        sol: R`<p>List the common values: they form an AP whose difference is $\operatorname{lcm}(${d1},${d2})$. Counting those that are at most the smaller last term and in both lists gives ${answer}.</p>` }; },
    verify(p) { let c = 0; for (let i = 0; i < p.N; i++) { const v = p.a1 + i * p.d1; if (v >= p.a2 && (v - p.a2) % p.d2 === 0 && (v - p.a2) / p.d2 < p.N) c++; } return c; } },
  { id: 'ss-g21', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'recurring decimal',
    make(rng) { const a = int(rng, 1, 9), b = int(rng, 1, 9), c = int(rng, 0, 9); const num = (a * 100 + b * 10 + c) - a; const den = 990; const g = ((x, y) => { while (y) [x, y] = [y, x % y]; return x; })(num, den);
      const val = num / den; const w1 = (a * 100 + b * 10 + c) / 999, w2 = (b * 10 + c) / 99 / 10 + a / 10, w3 = (a * 10 + b) / 99 + 0.001;
      const mk = (v) => { for (let d = 1; d <= 1000; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-12) return [n, d]; } return [Math.round(v * 990), 990]; };
      const txt = (v) => { const [n, d] = mk(v); return `$${frs(n, d)}$`; };
      const opts = [val, w1, a / 9 + (b * 10 + c) / 990, (a * 100 + b * 10 + c) / 990]; const seen = new Set(); if (opts.some((v) => { const k = txt(v); if (seen.has(k)) return true; seen.add(k); return false; })) return this.make(rng);
      const o = shuffleOpts(rng, txt(val), opts.slice(1).map(txt));
      return { a, b, c, val, ...o, q: `The recurring decimal $0.${a}\\overline{${b}${c}}$ equals`,
        sol: R`<p>Let $x=0.${a}\overline{${b}${c}}$. Then $10x=${a}.\overline{${b}${c}}$ and $1000x=${a}${b}${c}.\overline{${b}${c}}$. Subtract: $990x=${a * 100 + b * 10 + c}-${a}=${num}$, so $x=\dfrac{${num}}{990}=${txt(val).slice(1, -1)}$.</p>`, trap: 'Only $bc$ repeats, not $a$.' }; },
    verify(p) { const exact = Number(`0.${p.a}${(String(p.b) + String(p.c)).repeat(20)}`); const k = p.options.findIndex((o) => { const m = o.match(/\\dfrac\{(\d+)\}\{(\d+)\}/); const v = m ? m[1] / m[2] : Number(o.replace(/[^0-9]/g, '')); return Math.abs(v - exact) < 1e-9; }); return k; } },
  { id: 'ss-g22', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'nth term of AP',
    make(rng) { const p = int(rng, 2, 9), q = int(rng, 2, 9); if (p === q) return this.make(rng); const answer = p + q;
      return { pp: p, qq: q, answer, tol: 0, q: `In an AP the ${p}th term is $\\dfrac1{${q}}$ and the ${q}th term is $\\dfrac1{${p}}$. Find ${p * q} times its ${p + q}th term.`,
        sol: R`<p>$d=\dfrac{\frac1{${p}}-\frac1{${q}}}{${q}-${p}}=\dfrac1{${p * q}}$. Then $a_{${p + q}}=a_{${p}}+${q}d=\dfrac1{${q}}+\dfrac{${q}}{${p * q}}=\dfrac1{${q}}+\dfrac1{${p}}=\dfrac{${p + q}}{${p * q}}$. Times $${p * q}$ is $${answer}$.</p>` }; },
    verify(o) { const d = (1 / o.pp - 1 / o.qq) / (o.qq - o.pp); const a1 = 1 / o.qq - (o.pp - 1) * d; return Math.round(o.pp * o.qq * (a1 + (o.pp + o.qq - 1) * d)); } },
  { id: 'ss-g23', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'AM-GM',
    make(rng) { const u = int(rng, 1, 4), v = int(rng, 1, 5); const a = u * u, b = v * v; const answer = (u + v) ** 2;
      return { a, b, answer, tol: 0, q: `For $x>0$, find the least value of $\\dfrac{(x+${a})(x+${b})}x$.`,
        sol: R`<p>Expand: $x+\dfrac{${a * b}}x+${a + b}$. By AM-GM $x+\dfrac{${a * b}}x\ge2\sqrt{${a * b}}=${2 * u * v}$, with equality at $x=${u * v}$. Least value $=${2 * u * v}+${a + b}=${answer}$.</p>` }; },
    verify(p) { let m = Infinity; for (let i = 1; i < 400000; i++) { const x = i / 20000; m = Math.min(m, (x + p.a) * (x + p.b) / x); } return Math.round(m); } },
  { id: 'ss-g24', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'telescoping',
    make(rng) { const k = int(rng, 2, 4), N = int(rng, 10, 30); let s = 0; for (let n = 1; n <= N; n++) s += 1 / (n * (n + k)); const answer = +s.toFixed(4);
      return { k, N, answer, tol: 0.0001, q: `Find $\\sum_{n=1}^{${N}}\\dfrac1{n(n+${k})}$ to 4 decimal places.`,
        sol: R`<p>$\dfrac1{n(n+${k})}=\dfrac1{${k}}\left(\dfrac1n-\dfrac1{n+${k}}\right)$. The sum telescopes to $\dfrac1{${k}}\left(\sum_{n=1}^{${k}}\dfrac1n-\sum_{n=${N + 1}}^{${N + k}}\dfrac1n\right)=${answer}$.</p>` }; },
    verify(p) { let s = 0; for (let n = 1; n <= p.N; n++) s += 1 / (n * (n + p.k)); return s; } },
  { id: 'ss-g25', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'GP partial sums',
    make(rng) { const r = int(rng, 2, 4), a = int(rng, 1, 6); const s1 = a * (1 + r), s2 = s1 * r * r, answer = s2 * r * r;
      return { r, a, answer, tol: 0, q: `A positive GP has $a_1+a_2=${s1}$ and $a_3+a_4=${s2}$. Find $a_5+a_6$.`,
        sol: R`<p>$a_3+a_4=r^2(a_1+a_2)$, so $r^2=\dfrac{${s2}}{${s1}}=${r * r}$. Then $a_5+a_6=r^2(a_3+a_4)=${r * r}\times${s2}=${answer}$.</p>` }; },
    verify(p) { let t = p.a, s = 0; const terms = []; for (let i = 0; i < 6; i++) { terms.push(t); t *= p.r; } return terms[4] + terms[5]; } },
  { id: 'ss-g26', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'arithmetico-geometric',
    make(rng) { const n = int(rng, 5, 10), r = int(rng, 2, 3);
      let s = 0; for (let k = 1; k <= n; k++) s += k * r ** (k - 1);
      return { n, r, answer: s, tol: 0, q: `Find $\\sum_{k=1}^{${n}}k\\cdot${r}^{k-1}$.`,
        sol: R`<p>Let $S=\sum k r^{k-1}$ with $r=${r}$. Then $rS-S=${n}r^{${n}}-(1+r+\cdots+r^{${n - 1}})$, so $S=\dfrac{${n}\cdot${r ** n}-\frac{${r ** n}-1}{${r - 1}}}{${r - 1}}=${s}$.</p>` }; },
    verify(p) { let s = 0; for (let k = 1; k <= p.n; k++) s += k * p.r ** (k - 1); return s; } },
  { id: 'ss-g27', type: 'nat', format: 'integer', level: 5, exams: EXS[5], sub: 'products',
    make(rng) { const n = int(rng, 8, 30); const answer = n + 1;
      return { n, answer, tol: 0, q: `Find $${2 * n}\\prod_{k=2}^{${n}}\\left(1-\\dfrac1{k^2}\\right)$.`,
        sol: R`<p>$1-\dfrac1{k^2}=\dfrac{(k-1)(k+1)}{k\cdot k}$. The product telescopes to $\dfrac{n+1}{2n}$ with $n=${n}$. Times $${2 * n}$ gives $${answer}$.</p>` }; },
    verify(p) { let q = 1; for (let k = 2; k <= p.n; k++) q *= 1 - 1 / (k * k); return Math.round(2 * p.n * q); } },
  { id: 'ss-g28', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'floor sums',
    make(rng) { const m = int(rng, 2, 6), N = int(rng, 20, 60); const q = Math.floor(N / m); const answer = m * q * (q - 1) / 2 + q * (N - m * q + 1);
      return { m, N, answer, tol: 0, q: `Find $\\sum_{n=1}^{${N}}\\left\\lfloor\\dfrac n{${m}}\\right\\rfloor$.`,
        sol: R`<p>The value $k$ appears for $n=${m}k,\dots,${m}k+${m - 1}$ ($${m}$ times) while $${m}k+${m - 1}\le${N}$. With $q=\lfloor ${N}/${m}\rfloor=${q}$ the sum is $${m}\cdot\dfrac{${q}(${q}-1)}2+${q}(${N}-${m * q}+1)=${answer}$.</p>` }; },
    verify(p) { let s = 0; for (let n = 1; n <= p.N; n++) s += Math.floor(n / p.m); return s; } },
  { id: 'ss-g29', type: 'mcq', format: 'single', level: 4, exams: EXS[4], sub: 'infinite GP',
    make(rng) { const a = int(rng, 2, 12), S = a + int(rng, 1, 12); const r = 1 - a / S; if (new Set([(S - a) / S, a / S, S / a, (S - a) / a].map((v) => v.toFixed(9))).size < 4) return this.make(rng); const rt = (n, d) => R`$${frs(n, d)}$`;
      const o = shuffleOpts(rng, rt(S - a, S), [rt(a, S), rt(S, a), rt(S - a, a)]);
      return { a, S, ...o, q: `An infinite GP has first term ${a} and sum ${S}. Its common ratio is`,
        sol: R`<p>$S=\dfrac a{1-r}$ so $1-r=\dfrac{${a}}{${S}}$ and $r=1-\dfrac{${a}}{${S}}=\dfrac{${S - a}}{${S}}$.</p>`, trap: 'Solve $S=\\frac a{1-r}$ for $r$, not for $1-r$.' }; },
    verify(p) { const r = 1 - p.a / p.S; return p.options.findIndex((o) => { const m = o.match(/(?:\\dfrac\{(\d+)\}\{(\d+)\}|^\$(\d+)\$$)/); if (!m) return false; const v = m[3] !== undefined ? Number(m[3]) : m[1] / m[2]; return Math.abs(v - r) < 1e-9; }); } },
);

// ===== expansion end =====

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'sequences-series', groups, items, gens }, ['ss-g06', 'ss-g08', 'ss-g18']);
