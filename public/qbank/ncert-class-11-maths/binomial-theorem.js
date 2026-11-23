// Class 11 Maths, Chapter 7 Binomial Theorem: question bank (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('bt');
const C = (n, k) => { let v = 1; for (let i = 1; i <= k; i++) v = v * (n - k + i) / i; return Math.round(v); };
// coefficients of (p + q x)^n by repeated multiplication
const poly = (p, q, n) => { let c = [1]; for (let i = 0; i < n; i++) { const d = Array(c.length + 1).fill(0); c.forEach((v, j) => { d[j] += v * p; d[j + 1] += v * q; }); c = d; } return c; };

export default {
  topic: 'binomial-theorem', name: 'Binomial Theorem', n: 7,
  items: [
    m.mcq(1, 'expansion', '<p>The number of terms in the expansion of $(a + b)^{10}$ is:</p>', '11', ['10', '9', '20'], '<p>$n + 1 = 11$ terms.</p>'),
    m.mcq(1, 'expansion', '<p>$(x + y)^3$ equals:</p>', '$x^3 + 3x^2y + 3xy^2 + y^3$', ['$x^3 + y^3$', '$x^3 + 3xy + y^3$', '$x^3 + 2x^2y + 2xy^2 + y^3$'], '<p>Coefficients 1, 3, 3, 1 from Pascal\'s triangle.</p>', { trap: 'x³ + y³ misses the middle terms.' }),
    m.mcq(1, 'general', '<p>The general term $T_{k+1}$ of $(a + b)^n$ is:</p>', '$^nC_k\\,a^{n-k}b^k$', ['$^nC_{k-1}\\,a^{n-k}b^k$', '$^nP_k\\,a^{n-k}b^k$', '$^nC_{k+1}\\,a^{n-k}b^k$'], '<p>The powers add up to $n$ and the coefficient is $^nC_k$.</p>'),
    m.mcq(2, 'general', '<p>The 4th term of $(x + y)^6$ is:</p>', '$20x^3y^3$', ['$15x^3y^3$', '$20x^4y^2$', '$15x^2y^4$'], '<p>$k = 3$: $^6C_3 x^3y^3 = 20x^3y^3$.</p>', { trap: 'The 4th term has k = 3, not k = 4.' }),
    m.mcq(2, 'general', '<p>The coefficient of $x^2$ in $(1 + x)^6$ is:</p>', '15', ['30', '6', '20'], '<p>$^6C_2 = 15$.</p>'),
    m.mcq(2, 'general', '<p>The coefficient of $x^3$ in $(1 + 2x)^4$ is:</p>', '32', ['8', '24', '16'], '<p>$^4C_3 \\cdot 2^3 = 4 \\times 8 = 32$.</p>'),
    m.mcq(2, 'expansion', '<p>$(a - b)^3$ equals:</p>', '$a^3 - 3a^2b + 3ab^2 - b^3$', ['$a^3 - b^3$', '$a^3 + 3a^2b + 3ab^2 - b^3$', '$a^3 - 3a^2b - 3ab^2 - b^3$'], '<p>Signs alternate for $(a - b)^n$.</p>'),
    m.mcq(2, 'pascal', '<p>The row of Pascal\'s triangle for $n = 5$ is:</p>', '1 5 10 10 5 1', ['1 5 5 5 5 1', '1 4 6 4 1', '1 6 15 20 15 6 1'], '<p>$^5C_0, \\dots, {}^5C_5$ = 1, 5, 10, 10, 5, 1.</p>'),
    m.mcq(2, 'pascal', '<p>The sum of all the coefficients of $(1 + x)^7$ is:</p>', '128', ['49', '64', '7'], '<p>Put $x = 1$: $2^7 = 128$.</p>'),
    m.mcq(2, 'middle', '<p>The middle term of $(a + b)^{10}$ is:</p>', '$T_6$', ['$T_5$', '$T_{10}$', '$T_5$ and $T_6$'], '<p>$n$ even: one middle term, $T_{n/2+1} = T_6$.</p>'),
    m.mcq(2, 'middle', '<p>How many middle terms does $(a + b)^7$ have?</p>', 'two', ['one', 'three', 'none'], '<p>$n = 7$ is odd, so there are $8$ terms and two middle terms, $T_4$ and $T_5$.</p>'),
    m.mcq(3, 'general', '<p>The constant term in the expansion of $(x + 1/x)^6$ is:</p>', '20', ['15', '6', '1'], '<p>$T_{k+1} = {}^6C_k x^{6-2k}$; zero power at $k = 3$: $^6C_3 = 20$.</p>'),
    m.mcq(3, 'general', '<p>The coefficient of $x$ in $(x + 2)^5$ is:</p>', '80', ['40', '10', '160'], '<p>$k = 4$ (a = x, b = 2): $^5C_4\\, x \\cdot 2^4 = 5 \\times 16 = 80$.</p>'),
    m.mcq(3, 'estimate', '<p>Using $(1 + 0.01)^{10}$ with the first two terms, the estimate is:</p>', '1.10', ['1.01', '1.001', '1.11'], '<p>$1 + 10(0.01) = 1.10$ (the exact value is 1.1046).</p>'),
    m.mcq(3, 'divisibility', '<p>$11^n - 1$ is always divisible by:</p>', '10', ['11', '12', '100'], '<p>$(10 + 1)^n - 1$ has every term a multiple of 10.</p>'),
    m.mcq(3, 'pascal', '<p>If the sum of the coefficients of $(1 + x)^n$ is 256, then $n$ equals:</p>', '8', ['16', '7', '9'], '<p>$2^n = 256$, so $n = 8$.</p>'),
    m.ar(2, 'expansion', '$(a + b)^n$ has $n + 1$ terms.', 'In every term the powers of $a$ and $b$ add up to $n$, and $k$ runs from 0 to $n$.', 0, '<p>Both true: $k = 0, 1, \\dots, n$ gives $n + 1$ terms.</p>'),
    m.ar(2, 'pascal', 'The sum of the coefficients of $(1 + x)^6$ is 64.', 'Putting $x = 1$ gives $(1 + 1)^6$.', 0, '<p>Both true and R is the method.</p>'),
    m.ar(2, 'expansion', '$(x + y)^2 = x^2 + y^2$.', '$(x + y)^2 = x^2 + 2xy + y^2$.', 3, '<p>A is false: the cross term $2xy$ is missing. R is the correct expansion.</p>'),
    m.ar(3, 'middle', 'The expansion of $(1 + x)^9$ has two middle terms with equal coefficients.', '$^9C_4 = {}^9C_5$.', 0, '<p>$n = 9$ is odd: terms $T_5$ and $T_6$ have coefficients $^9C_4$ and $^9C_5$, which are equal.</p>'),
    m.nat(2, 'general', '<p>Find the coefficient of $x^3$ in $(1 + x)^8$.</p>', () => C(8, 3), 0, '<p>$^8C_3 = 56$.</p>'),
    m.nat(2, 'pascal', '<p>Find the sum of the coefficients of $(2 + 3x)^3$.</p>', () => 125, 0, '<p>Put $x = 1$: $(2 + 3)^3 = 125$.</p>'),
    m.nat(3, 'general', '<p>Find the term independent of $x$ in $\\left(x + \\dfrac{2}{x}\\right)^4$.</p>', () => C(4, 2) * 4, 0, '<p>$T_{k+1} = {}^4C_k 2^k x^{4-2k}$; $k = 2$: $6 \\times 4 = 24$.</p>'),
    m.nat(3, 'estimate', '<p>Evaluate $(99)^3$ using $(100 - 1)^3$.</p>', () => 970299, 0, '<p>$1000000 - 3(10000) + 3(100) - 1 = 970299$.</p>'),
    m.msq(2, 'pascal', '<p>Which are true for $0 \\le k \\le n$? (Choose all that apply.)</p>', ['$^nC_k = {}^nC_{n-k}$', '$^nC_0 = 1$', '$^nC_k + {}^nC_{k+1} = {}^{n+1}C_{k+1}$', '$^nC_k = {}^nC_{k+1}$ always'], [0, 1, 2], '<p>The last holds only for special $k$ (for example $k = (n-1)/2$).</p>'),
    m.msq(3, 'general', '<p>For $(1 + x)^{10}$ which coefficients are equal to $^{10}C_3$? (Choose all that apply.)</p>', ['coefficient of $x^3$', 'coefficient of $x^7$', 'coefficient of $x^6$', 'coefficient of $x^{13}$'], [0, 1], '<p>$^{10}C_3 = {}^{10}C_7$. There is no $x^{13}$ term.</p>'),
  ],
  gens: [
    { id: 'bt-g01', type: 'nat', level: 2, exams: ['board'], sub: 'general',
      make(rng) { const n = pick(rng, 5, 12), k = pick(rng, 2, 5); return { n, k, q: `<p>Find the coefficient of $x^{${k}}$ in the expansion of $(1 + x)^{${n}}$.</p>`, answer: C(n, k), tol: 0, sol: `<p>$^{${n}}C_{${k}} = ${C(n, k)}$.</p>` }; },
      verify: (p) => poly(1, 1, p.n)[p.k] },
    { id: 'bt-g02', type: 'nat', level: 3, exams: ['board'], sub: 'general',
      make(rng) { const a = pick(rng, 1, 3), b = pick(rng, 2, 4), n = pick(rng, 5, 8), k = pick(rng, 2, 4); return { a, b, n, k, q: `<p>Find the coefficient of $x^{${k}}$ in $(${a} + ${b}x)^{${n}}$.</p>`, answer: C(n, k) * a ** (n - k) * b ** k, tol: 0, sol: `<p>$^{${n}}C_{${k}} \\cdot ${a}^{${n - k}} \\cdot ${b}^{${k}}$.</p>` }; },
      verify: (p) => poly(p.a, p.b, p.n)[p.k] },
    { id: 'bt-g03', type: 'nat', level: 2, exams: ['board'], sub: 'pascal',
      make(rng) { const n = pick(rng, 4, 14), a = pick(rng, 1, 4), b = pick(rng, 1, 4); return { n, a, b, q: `<p>Find the sum of all the coefficients in the expansion of $(${a} + ${b}x)^{${n}}$.</p>`, answer: (a + b) ** n, tol: 0.0001, sol: `<p>Put $x = 1$: $(${a} + ${b})^{${n}}$.</p>` }; },
      verify: (p) => poly(p.a, p.b, p.n).reduce((s, v) => s + v, 0) },
    { id: 'bt-g04', type: 'nat', level: 2, exams: ['board'], sub: 'middle',
      make(rng) { const n = choose(rng, [4, 6, 8, 10, 12, 14]); return { n, q: `<p>Find the coefficient of the middle term of $(1 + x)^{${n}}$.</p>`, answer: C(n, n / 2), tol: 0, sol: `<p>$n$ is even: the middle term is $T_{${n / 2 + 1}}$ with coefficient $^{${n}}C_{${n / 2}}$.</p>` }; },
      verify: (p) => poly(1, 1, p.n)[p.n / 2] },
    { id: 'bt-g05', type: 'nat', level: 3, exams: ['board'], sub: 'general',
      make(rng) { const n = choose(rng, [4, 6, 8, 10]), c = pick(rng, 1, 3); return { n, c, q: `<p>Find the constant term in $\\left(x + \\dfrac{${c}}{x}\\right)^{${n}}$.</p>`, answer: C(n, n / 2) * c ** (n / 2), tol: 0, sol: `<p>$T_{k+1} = {}^{${n}}C_k ${c}^k x^{${n}-2k}$; zero power at $k = ${n / 2}$.</p>` }; },
      verify: (p) => { const c = poly(1, 1, p.n); return c[p.n / 2] * p.c ** (p.n / 2); } },
    { id: 'bt-g06', type: 'nat', level: 3, exams: ['board'], sub: 'estimate',
      make(rng) { const n = pick(rng, 5, 12), d = pick(rng, 1, 4), x = d / 100; return { n, d, x, q: `<p>Using the first three terms of the binomial expansion, estimate $(1.0${d})^{${n}}$ to 4 decimal places.</p>`, answer: +(1 + n * x + C(n, 2) * x * x).toFixed(4), tol: 0.0001, sol: `<p>$1 + ${n}(${x}) + ${C(n, 2)}(${x})^2$.</p>` }; },
      verify: (p) => { const c = poly(1, p.x, p.n); return +(c[0] + c[1] + c[2]).toFixed(4); } },
    { id: 'bt-g07', type: 'nat', level: 3, exams: ['board'], sub: 'divisibility',
      make(rng) { const n = pick(rng, 4, 14); return { n, q: `<p>The remainder when $11^{${n}}$ is divided by 10 is:</p>`, answer: 1, tol: 0, sol: `<p>$11^{${n}} = (10 + 1)^{${n}}$; every term except $1^{${n}}$ is a multiple of 10.</p>` }; },
      verify: (p) => { let r = 1; for (let i = 0; i < p.n; i++) r = (r * 11) % 10; return r; } },
  ],
};
