// Class 10 Maths, Chapter 5 Arithmetic Progressions: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('ap');
const ord = (n) => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));
const R = String.raw;
const lst = (a, d, k = 4) => Array.from({ length: k }, (_, i) => a + i * d).join(', ');

export default {
  topic: 'arithmetic-progressions', name: 'Arithmetic Progressions', n: 5,
  items: [
    m.mcq(1, 'ap', R`<p>Which of these lists is an arithmetic progression?</p>`, R`3, 6, 9, 12, …`, [R`1, 3, 9, 27, …`, R`1, 4, 9, 16, …`, R`2, 4, 8, 16, …`], R`<p>Only 3, 6, 9, 12 has the same difference (3) between every pair of neighbours. The others have differences 2, 6, 18 / 3, 5, 7 / 2, 4, 8.</p>`),
    m.mcq(1, 'ap', R`<p>The common difference of the AP $7, 4, 1, -2, \dots$ is:</p>`, R`$-3$`, [R`$3$`, R`$-2$`, R`$4$`], R`<p>$d = 4 - 7 = -3$. Subtract each term from the one after it, not the other way round.</p>`, { trap: 'Taking first minus second gives +3, the wrong sign.' }),
    m.mcq(1, 'nth', R`<p>The 10th term of the AP $2, 5, 8, 11, \dots$ is:</p>`, R`29`, [R`27`, R`30`, R`32`], R`<p>$a_{10} = a + 9d = 2 + 9 \times 3 = 29$.</p>`, { trap: 'Using 10d instead of (n − 1)d.' }),
    m.mcq(2, 'nth', R`<p>Which term of the AP $5, 11, 17, \dots$ is 119?</p>`, R`20th`, [R`19th`, R`21st`, R`18th`], R`<p>$5 + (n-1) \times 6 = 119$, so $(n-1) \times 6 = 114$ and $n - 1 = 19$, $n = 20$.</p>`),
    m.mcq(2, 'nth', R`<p>If the $n$th term of an AP is $a_n = 3n + 7$, then its first term and common difference are:</p>`, R`$a = 10$, $d = 3$`, [R`$a = 3$, $d = 7$`, R`$a = 7$, $d = 3$`, R`$a = 10$, $d = 7$`], R`<p>$a_1 = 3 + 7 = 10$, $a_2 = 13$, so $d = 3$. The coefficient of $n$ is always $d$.</p>`),
    m.mcq(2, 'nth', R`<p>In an AP, $a_3 = 9$ and $a_7 = 21$. The common difference is:</p>`, R`3`, [R`4`, R`2`, R`12`], R`<p>From term 3 to term 7 there are 4 steps: $21 - 9 = 4d$, so $d = 3$.</p>`),
    m.mcq(1, 'sum', R`<p>The sum of the first 20 positive integers is:</p>`, R`210`, [R`200`, R`420`, R`190`], R`<p>$S = \dfrac{n(a+l)}{2} = \dfrac{20 \times 21}{2} = 210$.</p>`),
    m.mcq(2, 'sum', R`<p>The sum of the first $n$ odd positive integers $1 + 3 + 5 + \dots$ is:</p>`, R`$n^2$`, [R`$n(n+1)$`, R`$2n$`, R`$\dfrac{n(n+1)}{2}$`], R`<p>$a = 1$, $d = 2$: $S_n = \dfrac{n}{2}[2 + (n-1)2] = \dfrac{n}{2}\times 2n = n^2$.</p>`),
    m.mcq(3, 'sum', R`<p>The sum of the first $n$ terms of an AP is $S_n = 3n^2 + 2n$. Its common difference is:</p>`, R`6`, [R`3`, R`5`, R`2`], R`<p>$a_1 = S_1 = 5$ and $S_2 = 16$, so $a_2 = 11$ and $d = 6$. (In general the coefficient of $n^2$ is $d/2$.)</p>`),
    m.mcq(3, 'nth', R`<p>How many multiples of 4 lie between 10 and 250?</p>`, R`60`, [R`61`, R`59`, R`62`], R`<p>The multiples are $12, 16, \dots, 248$. $12 + (n-1)4 = 248$ gives $n - 1 = 59$, so $n = 60$.</p>`, { trap: 'Counting 250 ÷ 4 = 62 without removing the multiples below 10.' }),
    m.mcq(3, 'ap', R`<p>If $k + 2$, $4k - 6$ and $3k - 2$ are three consecutive terms of an AP, then $k$ is:</p>`, R`3`, [R`2`, R`4`, R`6`], R`<p>In an AP the middle term is the average of its neighbours: $2(4k - 6) = (k+2) + (3k-2)$, so $8k - 12 = 4k$ and $k = 3$.</p>`),
    m.mcq(2, 'word', R`<p>A man saves ₹500 in the first month and ₹50 more each month than the month before. His saving in the 12th month is:</p>`, R`₹1050`, [R`₹1000`, R`₹1100`, R`₹1150`], R`<p>$a = 500$, $d = 50$: $a_{12} = 500 + 11 \times 50 = 1050$.</p>`),
    m.ar(1, 'ap', R`The list $2, 4, 8, 16, \dots$ is not an AP.`, R`The differences between consecutive terms are not all equal.`, 0, R`<p>Both true and R explains A: the differences are 2, 4, 8.</p>`),
    m.ar(2, 'ap', R`The constant list $5, 5, 5, 5, \dots$ is an AP.`, R`Its common difference is 0.`, 0, R`<p>Every difference is the same, namely 0, so it is an AP with $d = 0$. R is the reason A is true.</p>`),
    m.ar(2, 'sum', R`If $d > 0$, the sum of the first $n$ terms of an AP is always positive.`, R`When $d > 0$ the terms of the AP increase.`, 3, R`<p>R is true. But A is false: for $-10, -7, -4, \dots$ the early terms are negative, so the early sums are negative.</p>`),
    m.ar(3, 'sum', R`For the AP $20, 17, 14, \dots$ the sum of the first $n$ terms stops increasing after some value of $n$.`, R`The terms become negative, so adding them reduces the sum.`, 0, R`<p>$d = -3$, so after the 7th term (2) the terms turn negative and each extra term reduces the total. Both true and R explains A.</p>`),
    m.nat(1, 'nth', R`<p>Find the 25th term of the AP $4, 9, 14, \dots$</p>`, () => 4 + 24 * 5, 0, R`<p>$a_{25} = 4 + 24 \times 5 = 124$.</p>`),
    m.nat(2, 'sum', R`<p>Find the sum of the first 12 terms of the AP $5, 8, 11, \dots$</p>`, () => (12 * (2 * 5 + 11 * 3)) / 2, 0, R`<p>$S_{12} = \dfrac{12}{2}[2(5) + 11(3)] = 6 \times 43 = 258$.</p>`),
    m.nat(2, 'nth', R`<p>How many terms are there in the AP $7, 13, 19, \dots, 205$?</p>`, () => (205 - 7) / 6 + 1, 0, R`<p>$7 + (n-1)6 = 205$ gives $n - 1 = 33$, so $n = 34$.</p>`, { unit: 'terms' }),
    m.nat(3, 'sum', R`<p>Find the sum of all two-digit multiples of 7.</p>`, () => (13 * (14 + 98)) / 2, 0, R`<p>The numbers are $14, 21, \dots, 98$: $98 = 14 + (n-1)7$ gives $n = 13$. $S = \dfrac{13}{2}(14 + 98) = 728$.</p>`),
    m.nat(3, 'nth', R`<p>In an AP the 4th term is 14 and the 9th term is 34. Find the 20th term.</p>`, () => 14 + 16 * 4, 0, R`<p>$5d = 34 - 14 = 20$, so $d = 4$. $a_{20} = a_4 + 16d = 14 + 64 = 78$.</p>`),
    m.nat(3, 'word', R`<p>A loan is repaid in 12 monthly instalments. The first is ₹1000 and each later instalment is ₹100 more than the one before. How much is repaid in all, in rupees?</p>`, () => (12 * (2000 + 11 * 100)) / 2, 0, R`<p>$S_{12} = \dfrac{12}{2}[2(1000) + 11(100)] = 6 \times 3100 = 18600$.</p>`, { unit: '₹' }),
    m.nat(1, 'sum', R`<p>Find $1 + 2 + 3 + \dots + 100$.</p>`, () => 5050, 0, R`<p>$S = \dfrac{100 \times 101}{2} = 5050$. (Gauss found it as a schoolboy by pairing 1 + 100, 2 + 99, …)</p>`),
    m.msq(2, 'ap', R`<p>Which of these lists are APs? (Choose all that apply.)</p>`, [R`$2, 6, 10, 14, \dots$`, R`$1, 1, 1, 1, \dots$`, R`$1, 2, 4, 7, \dots$`, R`$10, 7, 4, 1, \dots$`], [0, 1, 3], R`<p>Differences: 4, 4, 4 (yes); 0, 0, 0 (yes); 1, 2, 3 (no); $-3, -3, -3$ (yes).</p>`),
    m.msq(3, 'sum', R`<p>For the AP $6, 10, 14, \dots$ which statements are true? (Choose all that apply.)</p>`, [R`$d = 4$`, R`$a_{10} = 42$`, R`$S_5 = 70$`, R`100 is a term of the AP`], [0, 1, 2], R`<p>$a_{10} = 6 + 9 \times 4 = 42$; $S_5 = 6 + 10 + 14 + 18 + 22 = 70$. For 100: $6 + (n-1)4 = 100$ gives $n = 24.5$, which is not a whole number, so 100 is not a term.</p>`),
  ],
  gens: [
    { id: 'ap-g01', type: 'nat', level: 1, exams: ['board'], sub: 'nth',
      make(rng) { const a = pick(rng, -12, 30), d = pick(rng, -7, 9), N = pick(rng, 8, 40); return { a, d, N, q: `<p>Find the ${ord(N)} term of the AP $${lst(a, d)}, \\dots$</p>`, answer: a + (N - 1) * d, tol: 0, sol: `<p>$a = ${a}$, $d = ${d}$. $a_{${N}} = ${a} + ${N - 1}(${d}) = ${a + (N - 1) * d}$.</p>` }; },
      verify: (p) => { let v = p.a; for (let i = 1; i < p.N; i++) v += p.d; return v; } },
    { id: 'ap-g02', type: 'nat', level: 2, exams: ['board'], sub: 'nth',
      make(rng) { const a = pick(rng, 2, 30), d = pick(rng, 2, 9), k = pick(rng, 6, 40), T = a + (k - 1) * d; return { a, d, T, q: `<p>Which term of the AP $${lst(a, d)}, \\dots$ is ${T}?</p>`, answer: k, tol: 0, sol: `<p>$${a} + (n-1)(${d}) = ${T}$, so $n - 1 = ${(T - a) / d}$ and $n = ${k}$.</p>` }; },
      verify: (p) => { let v = p.a, i = 1; while (v < p.T) { v += p.d; i++; } return i; } },
    { id: 'ap-g03', type: 'nat', level: 2, exams: ['board'], sub: 'sum',
      make(rng) { const a = pick(rng, 1, 25), d = pick(rng, 1, 8), N = pick(rng, 8, 30), S = (N * (2 * a + (N - 1) * d)) / 2; return { a, d, N, q: `<p>Find the sum of the first ${N} terms of the AP $${lst(a, d)}, \\dots$</p>`, answer: S, tol: 0, sol: `<p>$S_{${N}} = \\dfrac{${N}}{2}[2(${a}) + ${N - 1}(${d})] = ${N / 2} \\times ${2 * a + (N - 1) * d} = ${S}$.</p>` }; },
      verify: (p) => { let s = 0; for (let i = 0; i < p.N; i++) s += p.a + i * p.d; return s; } },
    { id: 'ap-g04', type: 'nat', level: 2, exams: ['board'], sub: 'nth',
      make(rng) { const a = pick(rng, -15, 20), d = pick(rng, 2, 9), N = pick(rng, 9, 35), l = a + (N - 1) * d; return { a, d, l, q: `<p>How many terms are there in the AP $${a}, ${a + d}, ${a + 2 * d}, \\dots, ${l}$?</p>`, answer: N, tol: 0, sol: `<p>$${a} + (n-1)(${d}) = ${l}$, so $(n-1) = ${(l - a) / d}$ and $n = ${N}$.</p>` }; },
      verify: (p) => { let v = p.a, c = 1; while (v < p.l) { v += p.d; c++; } return c; } },
    { id: 'ap-g05', type: 'nat', level: 3, exams: ['board'], sub: 'nth',
      make(rng) { const a = pick(rng, -10, 20), d = pick(rng, -6, 9), p = pick(rng, 2, 5), s = pick(rng, 8, 14), t = pick(rng, 15, 25); return { a, d, p, s, t, q: `<p>In an AP the ${ord(p)} term is ${a + (p - 1) * d} and the ${ord(s)} term is ${a + (s - 1) * d}. Find the ${ord(t)} term.</p>`, answer: a + (t - 1) * d, tol: 0, sol: `<p>${s - p}d = ${a + (s - 1) * d} − (${a + (p - 1) * d}) = ${(s - p) * d}, so $d = ${d}$. Then $a_{${t}} = a_{${p}} + ${t - p}d = ${a + (p - 1) * d} + ${t - p}(${d}) = ${a + (t - 1) * d}$.</p>` }; },
      verify: (q) => { const ap = q.a + (q.p - 1) * q.d, as = q.a + (q.s - 1) * q.d, dd = (as - ap) / (q.s - q.p); return ap + (q.t - q.p) * dd; } },
    { id: 'ap-g06', type: 'nat', level: 3, exams: ['board'], sub: 'sum',
      make(rng) { const k = choose(rng, [3, 4, 5, 6, 7, 9]), mm = pick(rng, 8, 30), N = mm * k + pick(rng, 0, k - 1); return { k, N, q: `<p>Find the sum of all multiples of ${k} that are not more than ${N}.</p>`, answer: (k * mm * (mm + 1)) / 2, tol: 0, sol: `<p>${k}, ${2 * k}, …, ${mm * k} is an AP with ${mm} terms. $S = \\dfrac{${mm}}{2}(${k} + ${mm * k}) = ${(k * mm * (mm + 1)) / 2}$.</p>` }; },
      verify: (p) => { let s = 0; for (let v = p.k; v <= p.N; v += p.k) s += v; return s; } },
    { id: 'ap-g07', type: 'nat', level: 3, exams: ['board'], sub: 'word',
      make(rng) { const a = pick(rng, 500, 2000, 100), d = pick(rng, 50, 300, 50), N = pick(rng, 6, 18); return { a, d, N, q: `<p>Savings are made monthly: ₹${a} in the first month, and ₹${d} more each month than the month before. How many rupees are saved in ${N} months?</p>`, answer: (N * (2 * a + (N - 1) * d)) / 2, tol: 0, unit: '₹', sol: `<p>$S_{${N}} = \\dfrac{${N}}{2}[2(${a}) + ${N - 1}(${d})] = ${(N * (2 * a + (N - 1) * d)) / 2}$.</p>` }; },
      verify: (p) => { let s = 0, mth = p.a; for (let i = 0; i < p.N; i++) { s += mth; mth += p.d; } return s; } },
    { id: 'ap-g08', type: 'nat', level: 3, exams: ['board'], sub: 'sum',
      make(rng) { const a = pick(rng, 2, 14), d = pick(rng, 2, 6), N = pick(rng, 6, 16), S = (N * (2 * a + (N - 1) * d)) / 2; return { a, d, N, S, q: `<p>The sum of the first ${N} terms of an AP is ${S} and its common difference is ${d}. Find the first term.</p>`, answer: a, tol: 0, sol: `<p>${S} = ${N}/2 [2a + ${N - 1}(${d})], so 2a + ${(N - 1) * d} = ${(2 * S) / N}, 2a = ${(2 * S) / N - (N - 1) * d} and $a = ${a}$.</p>` }; },
      verify: (p) => ((2 * p.S) / p.N - (p.N - 1) * p.d) / 2 },
  ],
};
