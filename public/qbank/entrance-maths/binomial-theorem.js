// Binomial theorem (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
// Every answer was checked by brute force (the `calc` fields and the gens' verify() expand the polynomials in code).
import { pick, int, choose, fmt, shuffleOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [2, 0, 3, 1, 1, 3, 0, 2];
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

// ---------- brute-force helpers ----------
const Cn = (n, r) => { if (r < 0 || r > n) return 0; let x = 1; for (let i = 1; i <= r; i++) x = (x * (n - r + i)) / i; return Math.round(x); };
const Cb = (n, r) => { if (r < 0 || r > n) return 0n; let x = 1n; for (let i = 1n; i <= BigInt(r); i++) x = (x * (BigInt(n) - BigInt(r) + i)) / i; return x; };
/** polynomial = list of [exponent, BigInt coefficient] */
const pmul = (a, b) => { const m = new Map(); for (const [e1, c1] of a) for (const [e2, c2] of b) m.set(e1 + e2, (m.get(e1 + e2) || 0n) + c1 * c2); return [...m.entries()].filter(([, c]) => c !== 0n); };
const ppow = (p, n) => { let r = [[0, 1n]]; for (let i = 0; i < n; i++) r = pmul(r, p); return r; };
const coef = (p, e) => Number(p.find(([x]) => x === e)?.[1] ?? 0n);
const psum = (p) => Number(p.reduce((s, [, c]) => s + c, 0n));
const mpow = (b, e, m) => { let r = 1n; b = BigInt(b) % BigInt(m); let ee = BigInt(e); const mm = BigInt(m); while (ee > 0n) { if (ee & 1n) r = (r * b) % mm; b = (b * b) % mm; ee >>= 1n; } return Number(r); };
const isqrt = (n) => { if (n < 2n) return n; let x = BigInt(Math.floor(Math.sqrt(Number(n)))); while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x; };
/** (a + sqrt(d))^n as { A, B } meaning A + B sqrt(d) (BigInt) */
const sqpow = (a, d, n) => { let A = 1n, B = 0n; const a1 = BigInt(a), d1 = BigInt(d); for (let i = 0; i < n; i++) { [A, B] = [A * a1 + B * d1, A + B * a1]; } return { A, B }; };
const floorSq = (a, d, n) => { const { A, B } = sqpow(a, d, n); return Number(A + isqrt(B * B * BigInt(d))); };

const groups = {
  m1: {
    title: 'Sums of binomial coefficients',
    passage: R`<p>Match each sum in List I with its value in List II. The sums run over $r=0,1,\dots,6$.</p>`,
    list1: ['A. $\\sum \\binom6r$', 'B. $\\sum(-1)^r\\binom6r$', 'C. $\\sum r\\binom6r$', 'D. $\\sum\\binom6r^2$'],
    list2: ['p. $0$', 'q. $64$', 'r. $192$', 's. $924$'],
  },
  m2: {
    title: 'Number of terms',
    passage: R`<p>Match each expansion in List I with the number of terms in it (after simplifying) in List II.</p>`,
    list1: ['A. $(a+b)^{10}$', 'B. $(a+b)^{10}+(a-b)^{10}$', 'C. $(a+b)^{10}-(a-b)^{10}$', 'D. $(x+y+z)^4$'],
    list2: ['p. 5', 'q. 6', 'r. 11', 's. 15'],
  },
  m3: {
    title: 'Remainders',
    passage: R`<p>Match each number in List I with the remainder in List II.</p>`,
    list1: ['A. $6^{50}$ divided by 7', 'B. $5^{101}$ divided by 6', 'C. $2^{10}$ divided by 9', 'D. $10^{99}$ divided by 11'],
    list2: ['p. 1', 'q. 5', 'r. 7', 's. 10'],
  },
  p1: {
    title: 'Passage: the expansion of (x³ − 2/x)⁸',
    passage: R`<p>Consider $\left(x^3-\dfrac2x\right)^8$. Its general term is $T_{r+1}=\binom8r(x^3)^{8-r}\left(-\dfrac2x\right)^r=\binom8r(-2)^r\,x^{24-4r}$, for $r=0,1,\dots,8$.</p>`,
  },
  p2: {
    title: 'Passage: the greatest term of (2 + 3x)¹⁰ at x = 1',
    passage: R`<p>Put $x=1$ in $(2+3x)^{10}$. The terms are $T_{r+1}=\binom{10}r2^{10-r}3^r$. The ratio of consecutive terms is $\dfrac{T_{r+1}}{T_r}=\dfrac{11-r}{r}\cdot\dfrac32$.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  M('bt-001', 1, 'number of terms', R`The number of terms in the expansion of $(a+b)^9$ is`, '10', ['9', '8', '11'],
    R`<p>$(a+b)^n$ has $n+1$ terms. For $n=9$ that is 10.</p>`, 'One more than the power.', { calc: () => 9 + 1 }),
  M('bt-002', 1, 'coefficients', R`The coefficient of $x^2$ in $(1+x)^4$ is`, '6', ['4', '12', '8'],
    R`<p>The coefficient of $x^r$ in $(1+x)^n$ is $\binom nr$. So $\binom42=6$.</p>`, 'Row 4 of Pascal\'s triangle: 1, 4, 6, 4, 1.', { calc: () => coef(ppow([[0, 1n], [1, 1n]], 4), 2) }),
  I('bt-003', 1, 'coefficients', R`Find the coefficient of $x^3$ in $(1+x)^6$.`, 20,
    R`<p>$\binom63=\dfrac{6\cdot5\cdot4}{3\cdot2\cdot1}=20$.</p>`, 'Check with Pascal\'s triangle row 6: 1, 6, 15, 20, 15, 6, 1.', { calc: () => coef(ppow([[0, 1n], [1, 1n]], 6), 3) }),
  I('bt-004', 1, 'sum of coefficients', R`Find the sum of all the coefficients in the expansion of $(1+x)^7$.`, 128,
    R`<p>Put $x=1$: the sum is $(1+1)^7=2^7=128$.</p>`, 'Sum of coefficients means put $x=1$.', { calc: () => psum(ppow([[0, 1n], [1, 1n]], 7)) }),
  M('bt-005', 1, 'middle term', R`The middle term in the expansion of $(a+b)^8$ is the`, '5th term', ['4th term', '6th term', '9th term'],
    R`<p>There are 9 terms. The middle one is the $\dfrac{9+1}2=5$th term, $T_5=\binom84a^4b^4$.</p>`, 'With $n$ even the middle term is $T_{n/2+1}$.'),
  I('bt-006', 1, 'general term', R`Find the coefficient of $x^2$ in $(2+x)^5$.`, 80,
    R`<p>$T_{r+1}=\binom5r2^{5-r}x^r$. For $r=2$: $\binom52\cdot2^3=10\times8=80$.</p>`, 'Do not forget the power of 2.', { calc: () => coef(ppow([[0, 2n], [1, 1n]], 5), 2) }),
  M('bt-007', 1, 'sum of coefficients', R`The value of $\binom60+\binom61+\binom62+\cdots+\binom66$ is`, '64', ['36', '32', '63'],
    R`<p>The sum of all binomial coefficients of order $n$ is $2^n$. So $2^6=64$.</p>`, '63 leaves out $\\binom60$.', { calc: () => 64 }),
  I('bt-008', 1, 'identities', R`Find the value of $\binom50-\binom51+\binom52-\binom53+\binom54-\binom55$.`, 0,
    R`<p>This is $(1-1)^5=0$. The alternating sum of the binomial coefficients is 0 for every $n\ge1$.</p>`, 'Put $x=-1$ in $(1+x)^n$.', { calc: () => psum(ppow([[0, 1n], [1, -1n]], 5)) }),
  M('bt-009', 1, 'conjugate pairs', R`The value of $(\sqrt2+1)^4+(\sqrt2-1)^4$ is`, '34', ['17', '68', '24'],
    R`<p>$(\sqrt2+1)^2=3+2\sqrt2$, and $(3+2\sqrt2)^2=17+12\sqrt2$. The conjugate $(\sqrt2-1)^4$ gives $17-12\sqrt2$. In the sum the $\sqrt2$ terms cancel: $17+17=34$.</p>`, '17 is only half the sum.', { calc: () => { const a = sqpow(1, 2, 4), b = sqpow(-1, 2, 4); return Number(a.A + b.A); } }),
  I('bt-010', 1, 'approximation', R`Using $99=100-1$, find $99^3$.`, 970299,
    R`<p>$(100-1)^3=100^3-3\cdot100^2+3\cdot100-1=1000000-30000+300-1=970299$.</p>`, 'Watch the alternating signs.', { calc: () => 99 ** 3 }),
  M('bt-011', 1, 'Pascal\'s rule', R`$\binom73+\binom74$ equals`, '$\\binom84$', ['$\\binom{14}{7}$', '$\\binom{7}{7}$', '$\\binom83$'],
    R`<p>Pascal's rule: $\binom nr+\binom n{r+1}=\binom{n+1}{r+1}$. With $n=7,r=3$: $\binom84=70$. (Note $\binom83=56$ is not equal: the lower index must go up with the upper.)</p>`, 'Add $\\binom{n}{r}$ and $\\binom{n}{r+1}$ to get $\\binom{n+1}{r+1}$.'),
  I('bt-012', 1, 'number of terms', R`How many terms are there in the expansion of $(2x+3)^{12}$?`, 13,
    R`<p>The number of terms in the expansion of a binomial to the power $n$ is $n+1=13$.</p>`, 'The coefficients do not change the number of terms.', { calc: () => ppow([[0, 3n], [1, 2n]], 12).length }),

  // ---------- L2 standard ----------
  I('bt-013', 2, 'coefficients', R`Find the coefficient of $x^3$ in $(1+2x)^6$.`, 160,
    R`<p>$T_{r+1}=\binom6r(2x)^r$. For $r=3$: $\binom63\cdot2^3=20\times8=160$.</p>`, 'Cube the 2 too.', { calc: () => coef(ppow([[0, 1n], [1, 2n]], 6), 3) }),
  I('bt-014', 2, 'term independent of x', R`Find the term independent of $x$ in $\left(x^2+\dfrac1x\right)^9$.`, 84,
    R`<p>$T_{r+1}=\binom9r(x^2)^{9-r}x^{-r}=\binom9rx^{18-3r}$. Independent of $x$ when $18-3r=0$, so $r=6$. The term is $\binom96=84$.</p>`, 'Solve for the power of $x$ being zero.', { calc: () => coef(ppow([[2, 1n], [-1, 1n]], 9), 0) }),
  M('bt-015', 2, 'middle term', R`The middle term in the expansion of $(1+x)^{10}$ is`, '$252x^5$', ['$210x^5$', '$252x^6$', '$126x^5$'],
    R`<p>$n=10$ is even, so the middle term is $T_{6}=\binom{10}5x^5=252x^5$.</p>`, '$T_6$ has $x^5$, not $x^6$.'),
  I('bt-016', 2, 'coefficients', R`Find the coefficient of $x^4$ in $(1-3x)^7$.`, 2835,
    R`<p>$T_5=\binom74(-3x)^4=35\times81x^4=2835x^4$. The sign is positive because $(-3)^4=81$.</p>`, 'An even power makes the sign positive.', { calc: () => coef(ppow([[0, 1n], [1, -3n]], 7), 4) }),
  M('bt-017', 2, 'general term', R`The coefficient of $\dfrac1x$ in $\left(x-\dfrac1x\right)^7$ is`, '35', ['$-35$', '21', '70'],
    R`<p>$T_{r+1}=\binom7rx^{7-r}\left(-\dfrac1x\right)^r=(-1)^r\binom7rx^{7-2r}$. For $x^{-1}$: $7-2r=-1$, $r=4$. The coefficient is $(-1)^4\binom74=35$.</p>`, '$r=4$ is even, so the sign is positive.', { calc: () => coef(ppow([[1, 1n], [-1, -1n]], 7), -1) }),
  I('bt-018', 2, 'sum of coefficients', R`Find the sum of the coefficients in the expansion of $(2x-3)^5$.`, -1,
    R`<p>Put $x=1$: $(2-3)^5=(-1)^5=-1$.</p>`, 'A sum of coefficients can be negative.', { calc: () => psum(ppow([[1, 2n], [0, -3n]], 5)) }),
  M('bt-019', 2, 'remainders', R`The remainder when $5^{99}$ is divided by 6 is`, '5', ['1', '4', '0'],
    R`<p>$5=6-1$, so $5^{99}=(6-1)^{99}$. Every term except the last has a factor 6. The last term is $(-1)^{99}=-1$. So $5^{99}=6k-1=6(k-1)+5$, and the remainder is 5.</p>`, 'A remainder cannot be negative: add the divisor.', { calc: () => mpow(5, 99, 6) }),
  I('bt-020', 2, 'last digits', R`Find the last two digits of $7^{99}$ (as a number from 0 to 99).`, 43,
    R`<p>$7^2=49=50-1$. $7^4=2401=2400+1\equiv1\pmod{100}$. $99=4\times24+3$, so $7^{99}\equiv7^3=343\equiv43\pmod{100}$.</p>`, 'Find a power that is $1$ modulo 100.', { calc: () => mpow(7, 99, 100) }),
  I('bt-021', 2, 'product of expansions', R`Find the coefficient of $x^3$ in $(1+x)^2(1+2x)^4$.`, 88,
    R`<p>$(1+x)^2=1+2x+x^2$ and $(1+2x)^4=1+8x+24x^2+32x^3+16x^4$.</p><p>$x^3$: $1\cdot32+2\cdot24+1\cdot8=32+48+8=88$.</p>`, 'Add all products whose powers total 3.', { calc: () => coef(pmul(ppow([[0, 1n], [1, 1n]], 2), ppow([[0, 1n], [1, 2n]], 4)), 3) }),
  M('bt-022', 2, 'greatest coefficient', R`The greatest binomial coefficient in the expansion of $(1+x)^{11}$ is`, '462', ['330', '924', '231'],
    R`<p>For odd $n=11$, the greatest coefficients are the two middle ones, $\binom{11}5=\binom{11}6=462$.</p>`, '924 is the central coefficient for $n=12$.', { calc: () => Cn(11, 5) }),
  I('bt-023', 2, 'identities', R`Find the value of $\binom{10}0+\binom{10}2+\binom{10}4+\binom{10}6+\binom{10}8+\binom{10}{10}$.`, 512,
    R`<p>The sum of the even-indexed binomial coefficients is $2^{n-1}=2^9=512$. (Adding $(1+1)^{10}$ and $(1-1)^{10}$ gives $2\times$ the even sum, so even sum $=\dfrac{1024+0}{2}$.)</p>`, 'Half of $2^n$.', { calc: () => { let s = 0; for (let r = 0; r <= 10; r += 2) s += Cn(10, r); return s; } }),
  M('bt-024', 2, 'identities', R`The value of $\sum_{r=0}^{6}r\binom6r$ is`, '192', ['64', '384', '96'],
    R`<p>$r\binom6r=6\binom5{r-1}$. So the sum is $6\times2^5=192$.</p>`, '$r\\binom nr=n\\binom{n-1}{r-1}$ turns it into a plain sum.', { calc: () => { let s = 0; for (let r = 0; r <= 6; r++) s += r * Cn(6, r); return s; } }),
  I('bt-025', 2, 'general term', R`In the expansion of $(1+x)^n$ the coefficients of the 3rd and the 7th terms are equal. Find $n$.`, 8,
    R`<p>$T_3$ has coefficient $\binom n2$ and $T_7$ has $\binom n6$. $\binom n2=\binom n6$ means $2+6=n$, so $n=8$ (since $\binom nr=\binom ns$ with $r\ne s$ gives $r+s=n$).</p>`, 'Equal coefficients mean the indices add up to $n$.', { calc: () => { for (let n = 7; n < 40; n++) if (Cn(n, 2) === Cn(n, 6)) return n; } }),
  I('bt-026', 2, 'multinomial', R`How many terms are there in the expansion of $(x+y+z)^4$?`, 15,
    R`<p>Each term is $x^ay^bz^c$ with $a+b+c=4$ and $a,b,c\ge0$. The number of such triples is $\binom{4+2}{2}=15$.</p>`, 'Count non-negative solutions of $a+b+c=n$.', { calc: () => { let c = 0; for (let a = 0; a <= 4; a++) for (let b = 0; a + b <= 4; b++) c++; return c; } }),
  M('bt-027', 2, 'identities', R`The value of $\sum_{r=0}^{5}\binom5r3^r$ is`, '1024', ['243', '512', '1023'],
    R`<p>$\sum\binom5r3^r=(1+3)^5=4^5=1024$.</p>`, 'Recognise the expansion of $(1+x)^n$ at $x=3$.', { calc: () => { let s = 0; for (let r = 0; r <= 5; r++) s += Cn(5, r) * 3 ** r; return s; } }),
  N('bt-028', 2, 'approximation', R`Use the first three terms of the binomial expansion to estimate $(0.99)^6$ to three decimal places.`, 0.941, 0.001,
    R`<p>$(1-0.01)^6\approx1-6(0.01)+15(0.01)^2=1-0.06+0.0015=0.9415$. The exact value is $0.94148\ldots$, so to three places $0.941$ (the tolerance allows for the rounding).</p>`, 'The terms alternate in sign.', { calc: () => +(0.99 ** 6).toFixed(3) }),
  M('bt-029', 2, 'remainders', R`The remainder when $9^{20}$ is divided by 8 is`, '1', ['0', '2', '7'],
    R`<p>$9=8+1$, so $9^{20}=(1+8)^{20}=1+20\cdot8+\cdots$. All terms after the first have a factor 8, so the remainder is 1.</p>`, 'Write the base as (multiple of divisor) + 1.', { calc: () => mpow(9, 20, 8) }),

  // ---------- L3 exam ----------
  I('bt-030', 3, 'trinomial', R`Find the coefficient of $x^4$ in $(1+x+x^2)^3$.`, 6,
    R`<p>Pick one term from each of the three brackets so the powers add to 4: the exponent triples from $\{0,1,2\}$ are $(2,2,0)$ in 3 orders and $(2,1,1)$ in 3 orders. Total $3+3=6$.</p><p>Check: $(1+x+x^2)^3=1+3x+6x^2+7x^3+6x^4+3x^5+x^6$.</p>`, 'Count all ways to split the exponent.', { calc: () => coef(ppow([[0, 1n], [1, 1n], [2, 1n]], 3), 4) }),
  I('bt-031', 3, 'term independent of x', R`Find the term independent of $x$ in $\left(2x^2-\dfrac1x\right)^9$.`, 672,
    R`<p>$T_{r+1}=\binom9r(2x^2)^{9-r}\left(-\dfrac1x\right)^r=\binom9r2^{9-r}(-1)^rx^{18-3r}$. Independent of $x$: $r=6$. The term is $\binom96\cdot2^3\cdot(+1)=84\times8=672$.</p>`, 'The power of 2 is $9-r=3$, not 6.', { calc: () => coef(ppow([[2, 2n], [-1, -1n]], 9), 0) }),
  I('bt-032', 3, 'product of expansions', R`Find the coefficient of $x^6$ in $(1+x)^8(1-x)^8$.`, -56,
    R`<p>$(1+x)^8(1-x)^8=(1-x^2)^8$. The term in $x^6$ comes from $(-x^2)^3$: $\binom83(-1)^3=-56$.</p>`, 'Combine the brackets first.', { calc: () => coef(pmul(ppow([[0, 1n], [1, 1n]], 8), ppow([[0, 1n], [1, -1n]], 8)), 6) }),
  I('bt-033', 3, 'greatest term', R`Find the numerically greatest term in the expansion of $(1+x)^{10}$ when $x=2$.`, 15360,
    R`<p>$\dfrac{T_{r+1}}{T_r}=\dfrac{11-r}{r}\cdot2\ge1\iff22-2r\ge r\iff r\le7.33$. So the terms increase up to $T_8$ ($r=7$) and then fall. $T_8=\binom{10}72^7=120\times128=15360$. Check: $T_9=45\times256=11520<15360$.</p>`, 'Use the ratio of consecutive terms.', { calc: () => { let best = 0; for (let r = 0; r <= 10; r++) best = Math.max(best, Cn(10, r) * 2 ** r); return best; } }),
  M('bt-034', 3, 'identities', R`The value of $\binom50\binom73+\binom51\binom72+\binom52\binom71+\binom53\binom70$ is`, '220', ['120', '330', '264'],
    R`<p>This is Vandermonde's identity: $\sum_r\binom5r\binom7{3-r}=\binom{12}3=220$. It is the coefficient of $x^3$ in $(1+x)^5(1+x)^7$.</p>`, 'The two upper numbers add; the lower total stays 3.', { calc: () => { let s = 0; for (let r = 0; r <= 3; r++) s += Cn(5, r) * Cn(7, 3 - r); return s; } }),
  I('bt-035', 3, 'identities', R`Find $\binom70^2+\binom71^2+\cdots+\binom77^2$.`, 3432,
    R`<p>$\sum\binom nr^2=\binom{2n}n$ (coefficient of $x^n$ in $(1+x)^n(1+x)^n$). For $n=7$: $\binom{14}7=3432$.</p>`, 'Square each coefficient before adding.', { calc: () => { let s = 0; for (let r = 0; r <= 7; r++) s += Cn(7, r) ** 2; return s; } }),
  I('bt-036', 3, 'remainders', R`Find the remainder when $7^{103}$ is divided by 25.`, 18,
    R`<p>$7^2=49=50-1\equiv-1\pmod{25}$. $7^{103}=7\cdot(7^2)^{51}\equiv7\cdot(-1)^{51}=-7\equiv18\pmod{25}$.</p>`, 'Add 25 to a negative remainder.', { calc: () => mpow(7, 103, 25) }),
  I('bt-037', 3, 'remainders', R`Find the remainder when $13^{40}$ is divided by 100.`, 1,
    R`<p>$13^2=169\equiv69$, $13^4\equiv69^2=4761\equiv61$, $13^8\equiv61^2=3721\equiv21$, $13^{16}\equiv441\equiv41$, $13^{32}\equiv1681\equiv81$. Then $13^{40}=13^{32}\cdot13^8\equiv81\times21=1701\equiv1$.</p>`, 'Repeated squaring keeps the numbers small.', { calc: () => mpow(13, 40, 100) }),
  I('bt-038', 3, 'identities', R`Find $\sum_{r=0}^{10}r\binom{10}r$.`, 5120,
    R`<p>$r\binom{10}r=10\binom9{r-1}$. The sum is $10\times2^9=5120$.</p>`, 'The term $r=0$ is 0, and the rest is $10\\times2^9$.', { calc: () => { let s = 0; for (let r = 0; r <= 10; r++) s += r * Cn(10, r); return s; } }),
  I('bt-039', 3, 'multinomial', R`Find the coefficient of $x^2y^3z$ in $(x+y+z)^6$.`, 60,
    R`<p>The coefficient is $\dfrac{6!}{2!\,3!\,1!}=\dfrac{720}{12}=60$.</p>`, 'The three powers must add to 6.', { calc: () => { const f = (n) => (n <= 1 ? 1 : n * f(n - 1)); return f(6) / (f(2) * f(3) * f(1)); } }),
  I('bt-040', 3, 'multinomial', R`How many terms are there in the expansion of $(x+y+z)^6$?`, 28,
    R`<p>Non-negative solutions of $a+b+c=6$: $\binom{8}{2}=28$.</p>`, 'Count solutions, not $3^6$.', { calc: () => { let c = 0; for (let a = 0; a <= 6; a++) for (let b = 0; a + b <= 6; b++) c++; return c; } }),
  I('bt-041', 3, 'rational terms', R`How many terms in the expansion of $\left(\sqrt3+\sqrt[3]{7}\right)^{24}$ are rational?`, 5,
    R`<p>$T_{r+1}=\binom{24}r\,3^{(24-r)/2}\,7^{r/3}$. We need $(24-r)/2$ and $r/3$ to be whole numbers: $r$ even and $r$ a multiple of 3, so $r$ is a multiple of 6: $r=0,6,12,18,24$. That is 5 terms.</p>`, 'Both exponents must be integers at the same time.', { calc: () => { let c = 0; for (let r = 0; r <= 24; r++) if ((24 - r) % 2 === 0 && r % 3 === 0) c++; return c; } }),
  I('bt-042', 3, 'sum of coefficients', R`Find the sum of the coefficients in the expansion of $(1+x-3x^2)^{2023}$.`, -1,
    R`<p>Put $x=1$: $(1+1-3)^{2023}=(-1)^{2023}=-1$.</p>`, 'The sum of coefficients is the value at $x=1$.', { calc: () => Number((-1n) ** 2023n) }),
  I('bt-043', 3, 'number of terms', R`Find the number of different powers of $x$ in the expansion of $\left(x+1+\dfrac1x\right)^{10}$.`, 21,
    R`<p>The powers of $x$ run from $x^{-10}$ (all $\frac1x$) to $x^{10}$ in steps of 1, because the middle factor $1$ lets any power in between occur. That is $21$ terms.</p>`, 'The factor 1 fills in the odd steps.', { calc: () => ppow([[1, 1n], [0, 1n], [-1, 1n]], 10).length }),
  I('bt-044', 3, 'middle term', R`The coefficient of the middle term in the expansion of $(1+x)^{2n}$ is 924. Find $n$.`, 6,
    R`<p>The middle term has coefficient $\binom{2n}n=924$. $\binom{12}6=924$, so $n=6$.</p>`, 'Check the neighbours: $\\binom{10}5=252$, $\\binom{14}7=3432$.', { calc: () => { for (let n = 1; n < 20; n++) if (Cn(2 * n, n) === 924) return n; } }),
  I('bt-045', 3, 'identities', R`The sum of the binomial coefficients of the odd-numbered terms ($T_1,T_3,T_5,\dots$) in $(x+y)^n$ is 128. Find $n$.`, 8,
    R`<p>The odd-numbered terms have coefficients $\binom n0,\binom n2,\binom n4,\dots$ whose sum is $2^{n-1}$. So $2^{n-1}=128=2^7$ and $n=8$.</p>`, 'The sum of the even-indexed coefficients is $2^{n-1}$.', { calc: () => { for (let n = 1; n < 30; n++) { let s = 0; for (let r = 0; r <= n; r += 2) s += Cn(n, r); if (s === 128) return n; } } }),
  I('bt-046', 3, 'product of expansions', R`Find the coefficient of $x^4$ in $(1+x)^5(2-x)^3$.`, -25,
    R`<p>$(1+x)^5=1+5x+10x^2+10x^3+5x^4+x^5$ and $(2-x)^3=8-12x+6x^2-x^3$.</p><p>$x^4$: $5\cdot8+10(-12)+10\cdot6+5(-1)=40-120+60-5=-25$.</p>`, 'Match the powers carefully: $x^4=x^4\\cdot x^0+x^3\\cdot x^1+x^2\\cdot x^2+x^1\\cdot x^3$.', { calc: () => coef(pmul(ppow([[0, 1n], [1, 1n]], 5), ppow([[0, 2n], [1, -1n]], 3)), 4) }),

  // ---------- L4 hard ----------
  I('bt-047', 4, 'greatest term', R`Find the greatest term (its value) in the expansion of $(3+2x)^9$ when $x=\dfrac32$.`, 2480058,
    R`<p>With $x=\frac32$, $2x=3$, so $T_{r+1}=\binom9r3^{9-r}3^r=\binom9r3^9$. The greatest term has the greatest $\binom9r$: $r=4$ or $5$ (they are equal). Value $=126\times3^9=126\times19683=2480058$. (Two terms, $T_5$ and $T_6$, are equal and greatest.)</p>`, 'When the ratio equals 1 exactly, two terms tie.', { calc: () => { let best = 0n; for (let r = 0; r <= 9; r++) { const t = Cb(9, r) * 3n ** BigInt(9 - r) * 3n ** BigInt(r); if (t > best) best = t; } return Number(best); } }),
  I('bt-048', 4, 'integration', R`Let $S=\sum_{r=0}^{10}\dfrac{(-1)^r}{r+1}\binom{10}r$. Find $\dfrac1S$.`, 11,
    R`<p>$\dfrac1{r+1}\binom{10}r=\dfrac1{11}\binom{11}{r+1}$. So $S=\dfrac1{11}\sum_{r=0}^{10}(-1)^r\binom{11}{r+1}$. With $s=r+1$ from 1 to 11: $\sum_{s=1}^{11}(-1)^{s-1}\binom{11}s=-\sum_{s=1}^{11}(-1)^s\binom{11}s=-(0-1)=1$. So $S=\dfrac1{11}$ and $\dfrac1S=11$.</p>`, 'Use $\\dfrac1{r+1}\\binom nr=\\dfrac1{n+1}\\binom{n+1}{r+1}$.', { calc: () => { let s = 0; for (let r = 0; r <= 10; r++) s += ((-1) ** r * Cn(10, r)) / (r + 1); return Math.round(1 / s); } }),
  I('bt-049', 4, 'identities', R`Find $\sum_{r=0}^{8}r^2\binom8r$.`, 4608,
    R`<p>Write $r^2=r(r-1)+r$. $\sum r(r-1)\binom8r=8\cdot7\cdot2^6=3584$ and $\sum r\binom8r=8\cdot2^7=1024$. Total $3584+1024=4608$. (General: $n(n+1)2^{n-2}=8\cdot9\cdot64=4608$.)</p>`, 'Split $r^2=r(r-1)+r$.', { calc: () => { let s = 0; for (let r = 0; r <= 8; r++) s += r * r * Cn(8, r); return s; } }),
  I('bt-050', 4, 'product of expansions', R`Find the coefficient of $x^5$ in $(1+x+x^2+x^3)^4$.`, 40,
    R`<p>$1+x+x^2+x^3=\dfrac{1-x^4}{1-x}$, so the expression is $(1-x^4)^4(1-x)^{-4}$. $(1-x)^{-4}=\sum\binom{k+3}3x^k$. For $x^5$: $\binom83-4\binom43=56-16=40$.</p>`, 'Use $(1-x^4)^4$ and the series for $(1-x)^{-4}$.', { calc: () => coef(ppow([[0, 1n], [1, 1n], [2, 1n], [3, 1n]], 4), 5) }),
  I('bt-051', 4, 'integral part', R`$(7+4\sqrt3)^5=I+f$ where $I$ is an integer and $0<f<1$. Find $(I+f)(1-f)$.`, 1,
    R`<p>Let $g=(7-4\sqrt3)^5$. Since $0<7-4\sqrt3<1$, $0<g<1$. $(I+f)+g$ is an integer (the irrational parts cancel), so $f+g$ is an integer between 0 and 2, hence $f+g=1$, so $1-f=g$.</p><p>$(I+f)(1-f)=(7+4\sqrt3)^5(7-4\sqrt3)^5=\left(49-48\right)^5=1$.</p>`, 'Show that $1-f$ is the conjugate power.', { calc: () => { const a = sqpow(7, 48, 5); const b = sqpow(-7, 48, 5); return Number(a.A * a.A - a.B * a.B * 48n); } }),
  I('bt-052', 4, 'integral part', R`Find the greatest integer less than or equal to $(5+2\sqrt6)^5$.`, 95049,
    R`<p>Let $u=5+2\sqrt6$ and $v=5-2\sqrt6=\dfrac1u$, so $0<v<1$. $u^5+v^5$ is an integer. Using $S_n=10S_{n-1}-S_{n-2}$ with $S_0=2,S_1=10$: $98,970,9602,95050$. So $u^5=95050-v^5$ with $0<v^5<1$. The greatest integer is $95049$.</p>`, 'Subtract 1 from the integer sum, because the conjugate part is positive.', { calc: () => floorSq(5, 24, 5) }),
  I('bt-053', 4, 'remainders', R`Find the remainder when $8^{101}$ is divided by 49.`, 22,
    R`<p>$8=1+7$, so $8^{101}=(1+7)^{101}=1+101\cdot7+\binom{101}2\cdot49+\cdots$. All terms from the third have a factor 49. Remainder of $1+707=708$ on division by 49: $49\times14=686$, $708-686=22$.</p>`, 'Keep only the first two terms mod 49.', { calc: () => mpow(8, 101, 49) }),
  I('bt-054', 4, 'identities', R`Find $\binom{20}0+\binom{20}1+\cdots+\binom{20}9+\dfrac12\binom{20}{10}$.`, 524288,
    R`<p>By symmetry $\sum_{r=0}^{9}\binom{20}r=\sum_{r=11}^{20}\binom{20}r$. So $2\sum_{r=0}^{9}+\binom{20}{10}=2^{20}$. The required sum is half of $2^{20}$: $2^{19}=524288$.</p>`, 'The symmetric halves are equal.', { calc: () => { let s = 0; for (let r = 0; r <= 9; r++) s += Cn(20, r); return s + Cn(20, 10) / 2; } }),
  I('bt-055', 4, 'general term', R`The coefficients of the 2nd, 3rd and 4th terms in the expansion of $(1+x)^n$ are in arithmetic progression. Find $n$ (given $n>3$).`, 7,
    R`<p>$2\binom n2=\binom n1+\binom n3$. $n(n-1)=n+\dfrac{n(n-1)(n-2)}6$. Divide by $n$: $n-1=1+\dfrac{(n-1)(n-2)}6$, so $6n-12=(n-1)(n-2)=n^2-3n+2$ and $n^2-9n+14=0$, $(n-2)(n-7)=0$. $n>3$, so $n=7$. Check: $7,21,35$ is an AP.</p>`, '$n=2$ has no 4th term.', { calc: () => { for (let n = 4; n < 40; n++) if (2 * Cn(n, 2) === Cn(n, 1) + Cn(n, 3)) return n; } }),
  I('bt-056', 4, 'general term', R`Three consecutive binomial coefficients in the expansion of $(1+x)^n$ are in the ratio $6:14:21$. Find $n$.`, 9,
    R`<p>Let the coefficients be $\binom n{r-1},\binom nr,\binom n{r+1}$. $\dfrac{\binom nr}{\binom n{r-1}}=\dfrac{n-r+1}r=\dfrac{14}6=\dfrac73$ gives $3n+3=10r$. $\dfrac{\binom n{r+1}}{\binom nr}=\dfrac{n-r}{r+1}=\dfrac{21}{14}=\dfrac32$ gives $2n=5r+3$. Solve: from the first, $n=\dfrac{10r-3}3$; then $\dfrac{2(10r-3)}3=5r+3\Rightarrow20r-6=15r+9\Rightarrow r=3$, $n=9$. Check: $36:84:126=6:14:21$.</p>`, 'Write the two ratios of consecutive coefficients.', { calc: () => { for (let n = 3; n < 60; n++) for (let r = 1; r < n; r++) if (Cn(n, r - 1) * 14 === Cn(n, r) * 6 && Cn(n, r) * 21 === Cn(n, r + 1) * 14) return n; } }),
  I('bt-057', 4, 'last digits', R`Find the last three digits of $3^{2023}$ (as a number from 0 to 999).`, 827,
    R`<p>$3^{10}=59049\equiv49\pmod{1000}$. $3^{20}\equiv49^2=2401\equiv401$. $3^{100}=(3^{20})^5$: $401^5=(1+400)^5\equiv1+5\cdot400\equiv1+2000\equiv1\pmod{1000}$ (higher terms have $400^2=160000\equiv0$). So $3^{2000}\equiv1$ and $3^{2023}\equiv3^{23}=3^{20}\cdot3^3\equiv401\times27=10827\equiv827$.</p>`, '$(1+400)^5$ collapses mod 1000.', { calc: () => mpow(3, 2023, 1000) }),
  I('bt-058', 4, 'remainders', R`Find the remainder when $2^{100}$ is divided by 13.`, 3,
    R`<p>$2^{12}\equiv1\pmod{13}$ (Fermat). $100=12\cdot8+4$, so $2^{100}\equiv2^4=16\equiv3$.</p><p>(Binomial route: $2^{100}=(2^{4})^{25}=16^{25}=(13+3)^{25}\equiv3^{25}$, and $3^3=27\equiv1$, so $3^{25}=3\cdot(3^3)^8\equiv3$.)</p>`, 'Two routes give the same answer.', { calc: () => mpow(2, 100, 13) }),

  // ---------- L5 top rank ----------
  I('bt-059', 5, 'identities', R`Find $\sum_{r=0}^{8}\binom{10}r\binom{10}{r+2}$.`, 125970,
    R`<p>$\binom{10}{r+2}=\binom{10}{8-r}$. So the sum is $\sum_r\binom{10}r\binom{10}{8-r}=\binom{20}8$ (Vandermonde). $\binom{20}8=125970$.</p>`, 'Rewrite one factor by symmetry so the lower indices add to a constant.', { calc: () => { let s = 0; for (let r = 0; r <= 8; r++) s += Cn(10, r) * Cn(10, r + 2); return s; } }),
  I('bt-060', 5, 'identities', R`Find $\sum_{r=0}^{8}(-1)^r\binom8r^2$.`, 70,
    R`<p>The sum is the coefficient of $x^8$ in $(1-x)^8(1+x)^8=(1-x^2)^8$ (because $\binom8r^2=\binom8r\binom8{8-r}$ and $(-1)^r$ pairs with $x^r$ from $(1-x)^8$). The coefficient of $x^8$ in $(1-x^2)^8$ is $\binom84(-1)^4=70$.</p>`, 'For even $n=2m$ the answer is $(-1)^m\\binom{2m}m$.', { calc: () => { let s = 0; for (let r = 0; r <= 8; r++) s += (-1) ** r * Cn(8, r) ** 2; return s; } }),
  I('bt-061', 5, 'roots of unity', R`Find $\binom80+\binom84+\binom88$.`, 72,
    R`<p>Use $(1+x)^8$ at $x=1,i,-1,-i$ and add. $\sum_{k}\binom8{4k}=\dfrac{(1+1)^8+(1+i)^8+(1-1)^8+(1-i)^8}4$. $(1+i)^8=((1+i)^2)^4=(2i)^4=16$, and $(1-i)^8=16$. So $\dfrac{256+16+0+16}4=72$. Check directly: $1+70+1=72$.</p>`, 'The roots-of-unity filter picks every 4th coefficient.', { calc: () => Cn(8, 0) + Cn(8, 4) + Cn(8, 8) }),
  I('bt-062', 5, 'integral part', R`$(\sqrt2+1)^7=I+f$ with $I$ an integer and $0<f<1$. Find the value of $(I+f)f$.`, 1,
    R`<p>Let $u=\sqrt2+1$ and $v=1-\sqrt2$, so $uv=-1$. $u^7+v^7$ is an integer (the root terms cancel). Now $v^7=-(\sqrt2-1)^7=-g$ where $g=(\sqrt2-1)^7$ and $0<g<1$. So $u^7-g$ is an integer, which means $I=u^7-g$ and $f=g$.</p><p>Then $(I+f)f=u^7g=(\sqrt2+1)^7(\sqrt2-1)^7=(2-1)^7=1$.</p>`, 'For odd $n$, $f$ is the conjugate power itself, not $1$ minus it.', { calc: () => { const a = sqpow(1, 2, 7); return Number(2n * a.B * a.B - a.A * a.A); } }),
  I('bt-063', 5, 'identities', R`Find $\sum_{r=0}^{7}\dfrac{2^r}{r+1}\binom7r$.`, 410,
    R`<p>$\dfrac1{r+1}\binom7r=\dfrac18\binom8{r+1}$. So $\dfrac{2^r}{r+1}\binom7r=\dfrac1{16}\binom8{r+1}2^{r+1}$. Summing over $r=0..7$, the index $s=r+1$ runs from 1 to 8: $\dfrac1{16}\sum_{s=1}^{8}\binom8s2^s=\dfrac1{16}\left[(1+2)^8-1\right]=\dfrac{6560}{16}=410$.</p>`, 'Shift the index to use $(1+2)^8$, and remember to remove the $s=0$ term.', { calc: () => { let s = 0; for (let r = 0; r <= 7; r++) s += (2 ** r * Cn(7, r)) / (r + 1); return s; } }),

  // ---------- Assertion-Reason ----------
  A('bt-064', 2, 'number of terms', R`The expansion of $(a+b)^n$ has $n+1$ terms.`, R`In the general term $T_{r+1}=\binom nr a^{n-r}b^r$, $r$ takes the values $0,1,2,\dots,n$.`, 0,
    R`<p>Both are true. The values $r=0$ to $n$ give $n+1$ terms, so R explains A.</p>`, 'Count the values of $r$.'),
  A('bt-065', 3, 'middle term', R`The expansion of $(1+x)^{11}$ has two middle terms.`, R`When $n$ is odd, $n+1$ is even, so the middle terms are $T_{(n+1)/2}$ and $T_{(n+3)/2}$.`, 0,
    R`<p>$n=11$ gives 12 terms, so the middle terms are $T_6$ and $T_7$. R is exactly why: there is no single centre when the number of terms is even.</p>`, 'Odd $n$ gives an even number of terms.'),
  A('bt-066', 3, 'identities', R`$\binom n0+\binom n1+\cdots+\binom nn=2^n$.`, R`$\binom n0-\binom n1+\binom n2-\cdots+(-1)^n\binom nn=0$ for $n\ge1$.`, 1,
    R`<p>A: put $x=1$ in $(1+x)^n$. R: put $x=-1$. Both are true, but R does not explain A (it uses a different substitution and a different result).</p>`, 'A reason can be true without explaining the assertion.'),
  A('bt-067', 3, 'coefficients', R`In the expansion of $(1+x)^n$, the coefficient of $x^r$ is $\binom nr$.`, R`$\binom nr=\dfrac{r!}{(n-r)!}$.`, 2,
    R`<p>A is true. R is false: $\binom nr=\dfrac{n!}{r!(n-r)!}$. So A true, R false.</p>`, 'Check the formula for $\\binom nr$.'),
  A('bt-068', 4, 'divisibility', R`$11^{10}-1$ is divisible by 1000.`, R`In $(1+10)^{10}=1+10\cdot10+\binom{10}2\cdot10^2+\cdots$ every term after the first has a factor of 100.`, 3,
    R`<p>R is true: the second term $10\cdot10=100$ and the later terms have higher powers of 10. But A is false: $11^{10}=25937424601$, so $11^{10}-1=25937424600$, which ends in 600, not 000. The terms $100+45\cdot100=4600$ already show the last three digits are not zero. A false, R true.</p>`, 'Divisible by 100 does not mean divisible by 1000.', { calc: () => (25937424601 - 1) % 1000 }),
  A('bt-069', 4, 'integral part', R`If $(5+2\sqrt6)^n=I+f$ ($n$ a positive integer, $I$ an integer, $0<f<1$), then $I$ is odd.`, R`$(5+2\sqrt6)^n+(5-2\sqrt6)^n$ is an even integer and $0<(5-2\sqrt6)^n<1$, so $I$ equals this even integer minus 1.`, 0,
    R`<p>$S_n=u^n+v^n$ satisfies $S_n=10S_{n-1}-S_{n-2}$ with $S_0=2,S_1=10$: always even. $f=1-v^n$, so $I=S_n-1$ is odd. R explains A.</p>`, 'The sequence $S_n$ is even every time.', { calc: () => { let ok = true; for (let n = 1; n < 12; n++) if (floorSq(5, 24, n) % 2 !== 1) ok = false; return ok ? 1 : 0; } }),
  A('bt-070', 5, 'identities', R`$\sum_{r=0}^{10}(-1)^r\binom{10}r^2=-252$.`, R`$\sum_{r=0}^{n}(-1)^r\binom nr^2=0$ for every $n\ge1$.`, 2,
    R`<p>For even $n=2m$ the sum is $(-1)^m\binom{2m}m$; with $m=5$: $-\binom{10}5=-252$. So A is true. For odd $n$ the sum is 0, but not for even $n$, so R is false.</p>`, 'Even $n$ and odd $n$ behave differently.', { calc: () => { let s = 0; for (let r = 0; r <= 10; r++) s += (-1) ** r * Cn(10, r) ** 2; return s; } }),

  // ---------- Statements ----------
  S('bt-071', 2, 'number of terms', R`$(a+b)^{10}+(a-b)^{10}$ has 6 terms.`, R`$(a+b)^{10}-(a-b)^{10}$ has 6 terms.`, 1,
    R`<p>In the sum the odd-power terms of $b$ cancel and the even ones double: $r=0,2,\dots,10$, which is 6 terms. In the difference only the odd powers survive: $r=1,3,\dots,9$, which is 5 terms. So I is true and II is false.</p>`, 'Count the surviving values of $r$.', { calc: () => ppow([[0, 1n], [1, 1n]], 10).filter(([e]) => e % 2 === 1).length }),
  S('bt-072', 3, 'identities', R`$\sum_{r=0}^{n}r\binom nr=n\,2^{n-1}$.`, R`For $n=4$, $\sum_{r=0}^4r\binom4r=32$.`, 0,
    R`<p>I: $r\binom nr=n\binom{n-1}{r-1}$, so the sum is $n2^{n-1}$. II: $4\times2^3=32$. Both true. (Check: $0+4+12+12+4=32$.)</p>`, 'Test with a small $n$.'),
  S('bt-073', 3, 'middle term', R`$(a+b)^{12}$ has two middle terms.`, R`$(a+b)^{13}$ has two middle terms, $T_7$ and $T_8$.`, 2,
    R`<p>I is false: 13 terms, a single middle term $T_7$. II is true: $(a+b)^{13}$ has 14 terms, middle terms $T_7$ and $T_8$.</p>`, '$n$ even gives one middle term.'),
  S('bt-074', 3, 'greatest coefficient', R`In $(1+x)^{10}$ the greatest binomial coefficient is $\binom{10}4$.`, R`The sum of all the coefficients in $(1+x)^{10}$ is $1023$.`, 3,
    R`<p>I is false: the greatest is $\binom{10}5=252$ ($\binom{10}4=210$). II is false: the sum is $2^{10}=1024$.</p>`, 'The central coefficient is the greatest.'),
  S('bt-075', 4, 'last digits', R`The last two digits of $7^{99}$ are 43.`, R`The last two digits of $7^{100}$ are 07.`, 1,
    R`<p>$7^4=2401\equiv1\pmod{100}$. $7^{99}\equiv7^3=343\to43$ (true). $7^{100}\equiv1$, so the last two digits are 01, not 07 (false).</p>`, '$7^4\\equiv1$ mod 100.', { calc: () => mpow(7, 100, 100) }),
  S('bt-076', 4, 'identities', R`$\sum_{r=0}^{n}r^2\binom nr=n\,2^{n-1}$.`, R`$\sum_{r=0}^{n}r\binom nr=n\,2^{n-1}$.`, 2,
    R`<p>I is false: for $n=2$, $\sum r^2\binom2r=0+2+4=6$ but $n2^{n-1}=4$. The true value is $n(n+1)2^{n-2}$. II is true.</p>`, 'Test $n=2$.', { calc: () => { let s = 0; for (let r = 0; r <= 2; r++) s += r * r * Cn(2, r); return s; } }),
  S('bt-077', 4, 'rational terms', R`The expansion of $\left(\sqrt2+\sqrt[4]3\right)^{12}$ has 4 rational terms.`, R`The expansion of $\left(\sqrt2+\sqrt[4]3\right)^{12}$ has 13 terms.`, 0,
    R`<p>$T_{r+1}=\binom{12}r2^{(12-r)/2}3^{r/4}$. We need $r$ even and $r$ a multiple of 4: $r=0,4,8,12$. That is 4 rational terms (I true). There are always $12+1=13$ terms (II true).</p>`, 'Both exponents must be integers.', { calc: () => { let c = 0; for (let r = 0; r <= 12; r++) if ((12 - r) % 2 === 0 && r % 4 === 0) c++; return c; } }),

  // ---------- Multi ----------
  X('bt-078', 3, 'identities', R`Which of the following are equal to $2^9$?`, [R`$\binom{10}0+\binom{10}2+\binom{10}4+\cdots+\binom{10}{10}$`, R`$\binom{10}1+\binom{10}3+\cdots+\binom{10}9$`, R`$\binom90+\binom91+\cdots+\binom99$`, R`$\binom{10}0+\binom{10}1+\cdots+\binom{10}{10}$`], [0, 1, 2],
    R`<p>The even-indexed sum and the odd-indexed sum of the coefficients of order 10 are each $2^9$ ✓✓. The full sum of order 9 is $2^9$ ✓. The full sum of order 10 is $2^{10}$ ✗.</p>`, 'Check the order of the coefficients.'),
  X('bt-079', 4, 'identities', R`For the expansion of $(1+x)^8$, which of the following are correct?`, [R`The coefficient of $x^3$ is 56`, R`The sum of the coefficients of even powers of $x$ is 128`, R`$\sum_{r=0}^8r\binom8r=1024$`, R`$\sum_{r=0}^8\binom8r^2=6435$`], [0, 1, 2],
    R`<p>$\binom83=56$ ✓. Even-power sum $=2^7=128$ ✓. $\sum r\binom8r=8\cdot2^7=1024$ ✓. $\sum\binom8r^2=\binom{16}8=12870$, not 6435 ✗ ($6435=\binom{15}7$).</p>`, '$\\sum\\binom nr^2=\\binom{2n}n$.', { calc: () => { let s = 0; for (let r = 0; r <= 8; r++) s += Cn(8, r) ** 2; return s; } }),
  X('bt-080', 4, 'general term', R`For the expansion of $\left(2x-\dfrac1x\right)^8$, which of the following are correct?`, ['It has 9 terms', 'The term independent of $x$ is 70', 'The coefficient of $x^4$ is 1792', 'The sum of all the coefficients is 1'], [0, 2, 3],
    R`<p>$T_{r+1}=\binom8r2^{8-r}(-1)^rx^{8-2r}$. 9 terms ✓. Independent of $x$: $r=4$: $\binom84\cdot2^4=70\times16=1120$, so 70 is wrong ✗. $x^4$: $r=2$: $\binom82\cdot2^6=28\times64=1792$ ✓. Sum of coefficients $(2-1)^8=1$ ✓.</p>`, 'Do not drop the $2^{8-r}$.', { calc: () => coef(ppow([[1, 2n], [-1, -1n]], 8), 0) }),
  X('bt-081', 4, 'remainders', R`Which of the following statements are correct?`, ['$7^{99}$ leaves remainder 43 on division by 100', '$11^{10}$ ends in the digits 01', '$9^{20}$ leaves remainder 1 on division by 8', '$2^{30}+1$ is divisible by 7'], [0, 1, 2],
    R`<p>$7^{99}\equiv43$ ✓. $11^{10}=25937424601$ ends in 01 ✓. $9^{20}=(1+8)^{20}\equiv1\pmod8$ ✓. $2^3\equiv1\pmod7$ so $2^{30}\equiv1$ and $2^{30}+1\equiv2$, not divisible ✗.</p>`, '$2^{30}-1$ is divisible by 7, not $2^{30}+1$.', { calc: () => mpow(2, 30, 7) }),
  X('bt-082', 5, 'integral part', R`Let $(7+4\sqrt3)^n=I+f$ where $I$ is an integer, $0<f<1$, and $n$ is a positive integer. Which of the following are true?`, [R`$0<f<1$`, R`$(7+4\sqrt3)^n+(7-4\sqrt3)^n$ is an integer`, R`$f=(7-4\sqrt3)^n$`, R`$(I+f)(1-f)=1$`], [0, 1, 3],
    R`<p>Let $g=(7-4\sqrt3)^n\in(0,1)$. The sum $(I+f)+g$ is an integer, so $f+g=1$ and $f=1-g$. So C is false (it equals $1-g$) ✗, and $(I+f)(1-f)=(I+f)g=(49-48)^n=1$ ✓.</p>`, '$f$ is $1-g$, not $g$.'),
  X('bt-083', 3, 'general term', R`In the expansion of $\left(x+\dfrac2{x^2}\right)^9$, which of the following are correct?`, ['The term independent of $x$ is 84', 'The term independent of $x$ is 672', 'There is no term in $x^2$', 'The coefficient of $x^{-3}$ is 2016'], [1, 2, 3],
    R`<p>$T_{r+1}=\binom9r2^rx^{9-3r}$. Independent of $x$: $r=3$: $\binom93\cdot8=84\times8=672$. So 84 is wrong ✗ and 672 is right ✓. $x^2$ needs $9-3r=2$, impossible ✓. $x^{-3}$: $r=4$: $\binom94\cdot16=126\times16=2016$ ✓.</p>`, 'The power of 2 is $r=3$.', { calc: () => coef(ppow([[1, 1n], [-2, 2n]], 9), 0) }),

  // ---------- Match ----------
  MT('bt-084', 2, 'identities', 'm1', R`Match List I with List II.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-s, D-r', 'A-r, B-s, C-q, D-p', 'A-q, B-r, C-p, D-s'],
    R`<p>A: $2^6=64$ (q). B: $(1-1)^6=0$ (p). C: $6\cdot2^5=192$ (r). D: $\binom{12}6=924$ (s).</p>`, 'Use the identity for each.'),
  MT('bt-085', 3, 'number of terms', 'm2', R`Match List I with List II.`, 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-s, D-p', 'A-r, B-p, C-q, D-s', 'A-s, B-q, C-p, D-r'],
    R`<p>A: 11 terms (r). B: even $r=0,\dots,10$: 6 terms (q). C: odd $r=1,\dots,9$: 5 terms (p). D: $\binom62=15$ (s).</p>`, 'Count the surviving values of $r$.'),
  MT('bt-086', 4, 'remainders', 'm3', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-s, D-r', 'A-p, B-r, C-q, D-s', 'A-s, B-q, C-r, D-p'],
    R`<p>A: $6\equiv-1\pmod7$, $(-1)^{50}=1$ (p). B: $5\equiv-1\pmod6$, $(-1)^{101}=-1\equiv5$ (q). C: $2^{10}=1024=9\times113+7$ (r). D: $10\equiv-1\pmod{11}$, $(-1)^{99}\equiv10$ (s).</p>`, 'Write each base as (divisor) ± 1.'),

  // ---------- Passages ----------
  PI('bt-087', 3, 'general term', 'p1', R`Find the coefficient of $x^{12}$.`, -448,
    R`<p>$24-4r=12\Rightarrow r=3$. Coefficient $=\binom83(-2)^3=56\times(-8)=-448$.</p>`, 'The sign comes from $(-2)^3$.', { calc: () => coef(ppow([[3, 1n], [-1, -2n]], 8), 12) }),
  PI('bt-088', 3, 'term independent of x', 'p1', R`Find the term independent of $x$.`, 1792,
    R`<p>$24-4r=0\Rightarrow r=6$. Term $=\binom86(-2)^6=28\times64=1792$.</p>`, 'Even power, positive sign.', { calc: () => coef(ppow([[3, 1n], [-1, -2n]], 8), 0) }),
  P('bt-089', 4, 'general term', 'p1', R`How many terms in the expansion have a positive coefficient?`, '5', ['4', '6', '9'],
    R`<p>The sign is $(-1)^r$, so the terms with even $r$ are positive: $r=0,2,4,6,8$, which is 5 terms.</p>`, 'Count the even values of $r$.', { calc: () => ppow([[3, 1n], [-1, -2n]], 8).filter(([, c]) => c > 0n).length }),
  PI('bt-090', 3, 'greatest term', 'p2', R`Which term (give its number $k$ in $T_k$) is the greatest at $x=1$?`, 7,
    R`<p>$T_{r+1}\ge T_r$ when $\dfrac{11-r}{r}\cdot\dfrac32\ge1\iff33-3r\ge2r\iff r\le6.6$. So $T_{r+1}$ keeps growing up to $r=6$, i.e. $T_7$ is the greatest ($T_8<T_7$ since the ratio with $r=7$ is $\dfrac47\cdot\dfrac32<1$).</p>`, 'The term number is $r+1$.', { calc: () => { let best = 0n, k = 0; for (let r = 0; r <= 10; r++) { const t = Cb(10, r) * 2n ** BigInt(10 - r) * 3n ** BigInt(r); if (t > best) { best = t; k = r + 1; } } return k; } }),
  PI('bt-091', 4, 'greatest term', 'p2', R`Find the value of the greatest term.`, 2449440,
    R`<p>$T_7=\binom{10}62^43^6=210\times16\times729=2449440$.</p>`, 'Check against $T_6$ and $T_8$.', { calc: () => { let best = 0n; for (let r = 0; r <= 10; r++) { const t = Cb(10, r) * 2n ** BigInt(10 - r) * 3n ** BigInt(r); if (t > best) best = t; } return Number(best); } }),
  P('bt-092', 3, 'greatest coefficient', 'p2', R`Which term has the greatest binomial coefficient $\binom{10}r$ in the expansion of $(2+3x)^{10}$?`, '$T_6$', ['$T_5$', '$T_7$', '$T_{11}$'],
    R`<p>For $n=10$ the greatest binomial coefficient is $\binom{10}5$, in $T_6$. (This is different from the greatest term: $T_7$ at $x=1$.)</p>`, 'The greatest coefficient and the greatest term are two different questions.'),
];

// ---------- number templates ----------
const gens = [
  {
    id: 'bt-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'coefficients',
    make(rng) {
      const n = int(rng, 5, 9), k = int(rng, 2, 4), a = int(rng, 2, 4);
      const answer = Cn(n, k) * a ** k;
      return { n, k, a, answer, tol: 0,
        q: `Find the coefficient of $x^{${k}}$ in $(1+${a}x)^{${n}}$.`,
        sol: R`<p>$T_{r+1}=\binom{${n}}r(${a}x)^r$. For $r=${k}$: $\binom{${n}}{${k}}\cdot${a}^{${k}}=${Cn(n, k)}\times${a ** k}=${answer}$.</p>` };
    },
    verify(p) { return coef(ppow([[0, 1n], [1, BigInt(p.a)]], p.n), p.k); },
  },
  {
    id: 'bt-g02', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'general term',
    make(rng) {
      const n = int(rng, 6, 10), r0 = int(rng, 2, 4), c = int(rng, 2, 3), p = int(rng, 2, 3);
      const k = p * (n - r0) - r0;
      const answer = Cn(n, r0) * c ** r0;
      return { n, r0, c, p, k, answer, tol: 0,
        q: `Find the coefficient of $x^{${k}}$ in $\\left(x^{${p}}+\\dfrac{${c}}{x}\\right)^{${n}}$.`,
        sol: R`<p>$T_{r+1}=\binom{${n}}r(x^{${p}})^{${n}-r}\left(\dfrac{${c}}x\right)^r=\binom{${n}}r${c}^rx^{${p * n}-${p + 1}r}$. Set $${p * n}-${p + 1}r=${k}$: $r=${r0}$. Coefficient $=\binom{${n}}{${r0}}${c}^{${r0}}=${Cn(n, r0)}\times${c ** r0}=${answer}$.</p>` };
    },
    verify(q) { return coef(ppow([[q.p, 1n], [-1, BigInt(q.c)]], q.n), q.k); },
  },
  {
    id: 'bt-g03', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'term independent of x',
    make(rng) {
      const [p, s, u] = choose(rng, [[2, 1, 3], [3, 1, 4], [1, 2, 3], [2, 2, 2]]);
      const n = u * int(rng, 2, 3);
      const r = (p * n) / (p + s);
      const c = int(rng, 2, 3);
      const answer = Cn(n, r) * c ** r;
      return { p, s, n, r, c, answer, tol: 0,
        q: `Find the term independent of $x$ in $\\left(x^{${p}}+\\dfrac{${c}}{x^{${s}}}\\right)^{${n}}$.`,
        sol: R`<p>$T_{r+1}=\binom{${n}}r${c}^rx^{${p}(${n}-r)-${s}r}$. Independent of $x$ when $${p}(${n}-r)=${s}r$, i.e. $r=${r}$. The term is $\binom{${n}}{${r}}${c}^{${r}}=${Cn(n, r)}\times${c ** r}=${answer}$.</p>` };
    },
    verify(o) { return coef(ppow([[o.p, 1n], [-o.s, BigInt(o.c)]], o.n), 0); },
  },
  {
    id: 'bt-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'sum of coefficients',
    make(rng) {
      const a = int(rng, 1, 3), b = int(rng, -4, -1), c = int(rng, 1, 3), n = int(rng, 3, 7);
      const answer = (a + b + c) ** n;
      return { a, b, c, n, answer, tol: 0,
        q: `Find the sum of all the coefficients in the expansion of $(${a === 1 ? '' : a}x^2${b < 0 ? '' : '+'}${b}x+${c})^{${n}}$.`,
        sol: R`<p>Put $x=1$: $(${a}${b < 0 ? '' : '+'}${b}+${c})^{${n}}=(${a + b + c})^{${n}}=${answer}$.</p>` };
    },
    verify(p) { return psum(ppow([[2, BigInt(p.a)], [1, BigInt(p.b)], [0, BigInt(p.c)]], p.n)); },
  },
  {
    id: 'bt-g05', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'middle term',
    make(rng) {
      const m = int(rng, 3, 7), n = 2 * m, a = int(rng, 1, 3);
      const answer = Cn(n, m) * a ** m;
      return { n, m, a, answer, tol: 0,
        q: `Find the coefficient of the middle term in the expansion of $(1+${a}x)^{${n}}$.`,
        sol: R`<p>$n=${n}$ is even, so the middle term is $T_{${m + 1}}=\binom{${n}}{${m}}(${a}x)^{${m}}$. Its coefficient is $${Cn(n, m)}\times${a ** m}=${answer}$.</p>` };
    },
    verify(p) { return coef(ppow([[0, 1n], [1, BigInt(p.a)]], p.n), p.m); },
  },
  {
    id: 'bt-g06', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'remainders',
    make(rng) {
      const d = choose(rng, [5, 6, 7, 8, 9, 11, 13]);
      const t = int(rng, 1, 4), s = choose(rng, [1, -1]);
      const b = d * t + s;
      const m = int(rng, 30, 150);
      const rem = (((s ** m) % d) + d) % d;
      return { d, b, m, answer: rem, tol: 0,
        q: `Find the remainder when ${b}<sup>${m}</sup> is divided by ${d}.`,
        sol: R`<p>${b}$=${d * t}${s > 0 ? '+1' : '-1'}$, a multiple of ${d} ${s > 0 ? 'plus' : 'minus'} 1. By the binomial theorem, every term except the last is a multiple of ${d}, and the last is $(${s})^{${m}}=${s ** m}$. ${s < 0 && m % 2 ? `So the number is a multiple of ${d} minus 1: add ${d} to get the remainder $${rem}$.` : `The remainder is $${rem}$.`}</p>` };
    },
    verify(p) { return mpow(p.b, p.m, p.d); },
  },
  {
    id: 'bt-g07', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'last digits',
    make(rng) {
      const a = choose(rng, [11, 21, 31, 41, 51, 61, 71]);
      const m = int(rng, 20, 90);
      const tens = (((a - 1) / 10) * m) % 10;
      const answer = tens * 10 + 1;
      return { a, m, answer, tol: 0,
        q: `Find the last two digits of ${a}<sup>${m}</sup>, as a number from 0 to 99.`,
        sol: R`<p>${a}$=1+${a - 1}$. $(1+${a - 1})^{${m}}=1+${m}\times${a - 1}+\binom{${m}}2${a - 1}^2+\cdots$. From the third term on, every term is a multiple of $${a - 1}^2$, which is a multiple of 100. So only $1+${m}\times${a - 1}=${1 + m * (a - 1)}$ matters mod 100: last two digits $${answer}$ (written as a number).</p>` };
    },
    verify(p) { return mpow(p.a, p.m, 100); },
  },
  {
    id: 'bt-g08', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'identities',
    make(rng) {
      const n = int(rng, 5, 12);
      const answer = n * 2 ** (n - 1);
      return { n, answer, tol: 0,
        q: `Find $\\sum_{r=0}^{${n}}r\\binom{${n}}r$.`,
        sol: R`<p>$r\binom{${n}}r=${n}\binom{${n - 1}}{r-1}$. Sum $=${n}\cdot2^{${n - 1}}=${answer}$.</p>` };
    },
    verify(p) { let s = 0; for (let r = 0; r <= p.n; r++) s += r * Cn(p.n, r); return s; },
  },
  {
    id: 'bt-g09', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'identities',
    make(rng) {
      const n = int(rng, 4, 9);
      const answer = Cn(2 * n, n);
      return { n, answer, tol: 0,
        q: `Find $\\binom{${n}}0^2+\\binom{${n}}1^2+\\cdots+\\binom{${n}}{${n}}^2$.`,
        sol: R`<p>$\sum\binom nr^2=\binom{2n}n$ (coefficient of $x^n$ in $(1+x)^n(1+x)^n$). For $n=${n}$: $\binom{${2 * n}}{${n}}=${answer}$.</p>` };
    },
    verify(p) { let s = 0; for (let r = 0; r <= p.n; r++) s += Cn(p.n, r) ** 2; return s; },
  },
  {
    id: 'bt-g10', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'number of terms',
    make(rng) {
      const n = int(rng, 6, 14), kind = choose(rng, ['plus', 'minus']);
      const answer = kind === 'plus' ? Math.floor(n / 2) + 1 : Math.floor((n + 1) / 2);
      const o = shuffleOpts(rng, String(answer), [String(n + 1), String(n), String(answer + 1)]);
      return { n, kind, ...o,
        q: `The number of terms in the expansion of $(a+b)^{${n}}${kind === 'plus' ? '+' : '-'}(a-b)^{${n}}$ is`,
        sol: R`<p>In the ${kind === 'plus' ? 'sum' : 'difference'} the ${kind === 'plus' ? 'odd' : 'even'}-power terms of $b$ cancel, so only $r=${kind === 'plus' ? '0,2,4,\\dots' : '1,3,5,\\dots'}$ remain up to $${n}$: that is $${answer}$ terms.</p>` };
    },
    verify(p) { const pol = ppow([[0, 1n], [1, 1n]], p.n); const cnt = pol.filter(([e]) => (p.kind === 'plus' ? e % 2 === 0 : e % 2 === 1)).length; return p.options.indexOf(String(cnt)); },
  },
  {
    id: 'bt-g11', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'integral part',
    make(rng) {
      const p = int(rng, 2, 5), n = int(rng, 2, 6);
      const d = p * p - 1;
      const { A, B } = sqpow(p, d, n);
      // (p+sqrt d)^n + (p-sqrt d)^n = 2A, other power in (0,1): floor = 2A-1 ... exact: A + floor(B sqrt d)
      const answer = Number(2n * A - 1n);
      return { p, d, n, answer, tol: 0,
        q: `Find the greatest integer not exceeding $(${p}+\\sqrt{${d}})^{${n}}$.`,
        sol: R`<p>Let $u=${p}+\sqrt{${d}}$ and $v=${p}-\sqrt{${d}}$. Then $uv=${p * p}-${d}=1$, so $0<v<1$ and $0<v^{${n}}<1$. $u^{${n}}+v^{${n}}$ is an integer (the root terms cancel) equal to $2\times${A}=${2n * A}$. So $u^{${n}}=${2n * A}-v^{${n}}$ and the greatest integer below it is $${answer}$.</p>` };
    },
    verify(o) { return floorSq(o.p, o.d, o.n); },
  },
  {
    id: 'bt-g12', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'product of expansions',
    make(rng) {
      const m = int(rng, 3, 6), n = int(rng, 3, 6), a = int(rng, 1, 3), k = int(rng, 2, 4);
      const answer = (() => { let s = 0; for (let j = 0; j <= k; j++) s += Cn(m, j) * Cn(n, k - j) * a ** (k - j); return s; })();
      return { m, n, a, k, answer, tol: 0,
        q: `Find the coefficient of $x^{${k}}$ in $(1+x)^{${m}}(1+${a === 1 ? '' : a}x)^{${n}}$.`,
        sol: R`<p>Add the products of the coefficients whose powers total ${k}: $\sum_{j=0}^{${k}}\binom{${m}}j\binom{${n}}{${k}-j}${a}^{${k}-j}=${answer}$ (term by term: ${Array.from({ length: k + 1 }, (_, j) => `$${Cn(m, j)}\\times${Cn(n, k - j) * a ** (k - j)}$`).join(' + ')}).</p>` };
    },
    verify(p) { return coef(pmul(ppow([[0, 1n], [1, 1n]], p.m), ppow([[0, 1n], [1, BigInt(p.a)]], p.n)), p.k); },
  },
  {
    id: 'bt-g13', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'greatest term',
    make(rng) {
      const n = int(rng, 8, 14), x = choose(rng, [2, 3, 4]);
      // numerically greatest term index (as T_k) of (1+x)^n
      if (((n + 1) * x) % (1 + x) === 0) return this.make(rng);
      const r = Math.floor(((n + 1) * x) / (1 + x));
      const answer = r + 1;
      return { n, x, answer, tol: 0,
        q: `Which term (give $k$ for $T_k$) is the numerically greatest in the expansion of $(1+x)^{${n}}$ when $x=${x}$?`,
        sol: R`<p>$\dfrac{T_{r+1}}{T_r}=\dfrac{${n + 1}-r}{r}\cdot${x}\ge1\iff${(n + 1) * x}-${x}r\ge r\iff r\le\dfrac{${(n + 1) * x}}{${x + 1}}=${fmt((n + 1) * x / (1 + x), 4)}$. The terms grow while $r\le${fmt((n + 1) * x / (1 + x), 4)}$, so the greatest is $T_{${answer}}$ (the largest integer $r$ allowed is $${r}$, giving $T_{${r + 1}}$).</p>` };
    },
    verify(p) { let best = 0n, k = 0; for (let r = 0; r <= p.n; r++) { const t = Cb(p.n, r) * BigInt(p.x) ** BigInt(r); if (t > best) { best = t; k = r + 1; } } return k; },
  },
  {
    id: 'bt-g14', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'multinomial',
    make(rng) {
      const n = int(rng, 6, 9), a = int(rng, 1, 3), b = int(rng, 1, 3);
      const c = n - a - b;
      const F = (k) => (k <= 1 ? 1 : k * F(k - 1));
      const answer = F(n) / (F(a) * F(b) * F(c));
      return { n, a, b, c, answer, tol: 0,
        q: `Find the coefficient of $x^{${a}}y^{${b}}z^{${c}}$ in $(x+y+z)^{${n}}$.`,
        sol: R`<p>$\dfrac{${n}!}{${a}!\,${b}!\,${c}!}=${answer}$.</p>` };
    },
    verify(p) { const s = 'x'.repeat(p.a) + 'y'.repeat(p.b) + 'z'.repeat(p.c); const seen = new Set(); const rec = (cur, rest) => { if (!rest.length) { seen.add(cur); return; } const used = new Set(); for (let i = 0; i < rest.length; i++) { if (used.has(rest[i])) continue; used.add(rest[i]); rec(cur + rest[i], rest.slice(0, i) + rest.slice(i + 1)); } }; rec('', s); return seen.size; },
  },
  {
    id: 'bt-g15', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'identities',
    make(rng) {
      const n = int(rng, 4, 12);
      const answer = n + 1;
      return { n, answer, tol: 0,
        q: `Let $S=\\sum_{r=0}^{${n}}\\dfrac{(-1)^r}{r+1}\\binom{${n}}r$. Find $\\dfrac1S$.`,
        sol: R`<p>$\dfrac1{r+1}\binom{${n}}r=\dfrac1{${n + 1}}\binom{${n + 1}}{r+1}$. The alternating sum of $\binom{${n + 1}}s$ for $s=1,\dots,${n + 1}$ (with sign $(-1)^{s-1}$) equals $1$, since the full alternating sum is 0 and the $s=0$ term is 1. So $S=\dfrac1{${n + 1}}$ and $\dfrac1S=${answer}$.</p>` };
    },
    verify(p) { let s = 0; for (let r = 0; r <= p.n; r++) s += ((-1) ** r * Cn(p.n, r)) / (r + 1); return Math.round(1 / s); },
  },
];

// A single-answer item's calc() gives the count; turn it into the option index it must match, so the bank check
// confirms the keyed option really holds that count.
// Other non-numeric items keep their brute-force check as `fact` (a supporting number, not the key).
for (const it of items) {
  if (it.type === 'nat' || typeof it.calc !== 'function') continue;
  if (it.format !== 'single') { it.fact = it.calc; delete it.calc; continue; }
  const count = it.calc;
  const num = (o) => Number(String(o).replace(/<[^>]*>|\\[a-z]+|[^0-9.\-]/gi, ''));
  it.calc = () => it.options.findIndex((o) => Math.abs(num(o) - count()) < 1e-9);
}

export default { topic: 'binomial-theorem', groups, items, gens };
