// Sequences and series (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
// Numeric answers were checked in code (the `calc` fields and the gens' verify() recompute by loops or other formulas).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

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

export default { topic: 'sequences-series', groups, items, gens };
