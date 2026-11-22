// Definite integrals (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Every numeric answer was checked in code: each `calc` integrates the function numerically (Simpson's rule) or from an
// independent closed form, and the templates' verify() recompute their answers another way.
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
// ids are filled in order at the end (PFX-001 ...). CUET rule: Class 12 level 1-3 mcq also list 'cuet'.
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
/** a numeric gen: wraps make() so the extra fields are kept */
const GEXS = (level, type) => [...EXS[level], ...(type === 'mcq' && level <= 3 ? ['cuet'] : [])];

// ---------- helpers for checking ----------
/** Simpson's rule on [a,b] with n (even) strips. */
const simp = (f, a, b, n = 20000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; };
const Q4 = (f, a, b, n) => +simp(f, a, b, n).toFixed(4);
/** numeric item that says "give 2 decimals"; the stored answer has 4 decimals */
const D = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
/** small answers: 4 decimals */
const D4 = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q} (4 decimal places)`, answer, 0.0005, sol, trap, more);
const PD = (level, sub, group, q, answer, sol, trap, more = {}) => PN(level, sub, group, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const PI_ = Math.PI, E_ = Math.E;
const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, exp = Math.exp, ln = Math.log, tan = Math.tan, atan = Math.atan, abs = Math.abs;

const groups = {
  d1: {
    title: 'Values of definite integrals',
    passage: R`<p>Match each integral in List I with its value in List II.</p>`,
    list1: ['A. $\\displaystyle\\int_0^{\\pi/2}\\sin^3x\\,dx$', 'B. $\\displaystyle\\int_0^{\\pi/2}\\sin^2x\\,dx$', 'C. $\\displaystyle\\int_{-1}^{1}x^3\\,dx$', 'D. $\\displaystyle\\int_0^{1}\\ln x\\,dx$'],
    list2: ['p. $\\dfrac\\pi4$', 'q. $0$', 'r. $\\dfrac23$', 's. $-1$'],
  },
  d2: {
    title: 'Areas',
    passage: R`<p>Match each region in List I with its area in List II.</p>`,
    list1: ['A. Under $y=x^2$ from $x=0$ to $x=3$', 'B. Between $y=x$ and $y=x^2$', 'C. Under $y=\\sin x$ from $x=0$ to $x=\\pi$', 'D. Between $y=|x|$ and $y=1$'],
    list2: ['p. $\\dfrac16$', 'q. $2$', 'r. $9$', 's. $1$'],
  },
  d3: {
    title: 'Limits of sums',
    passage: R`<p>Match each limit as $n\to\infty$ in List I with its value in List II.</p>`,
    list1: ['A. $\\displaystyle\\frac1n\\sum_{r=1}^{n}\\frac rn$', 'B. $\\displaystyle\\sum_{r=1}^{n}\\frac{n}{n^2+r^2}$', 'C. $\\displaystyle\\frac1n\\sum_{r=1}^{n}e^{r/n}$', 'D. $\\displaystyle\\sum_{r=1}^{n}\\frac1{n+r}$'],
    list2: ['p. $\\ln2$', 'q. $\\dfrac12$', 'r. $\\dfrac\\pi4$', 's. $e-1$'],
  },
  d4: {
    title: 'Which property helps?',
    passage: R`<p>Match each integral in List I with the property that evaluates it fastest in List II.</p>`,
    list1: ['A. $\\displaystyle\\int_{-2}^{2}x^4\\,dx$', 'B. $\\displaystyle\\int_{-\\pi}^{\\pi}x^3\\cos x\\,dx$', 'C. $\\displaystyle\\int_0^{\\pi}\\frac{x}{1+\\sin x}\\,dx$', 'D. $\\displaystyle\\int_0^{4\\pi}|\\sin x|\\,dx$'],
    list2: ['p. Odd integrand on a symmetric interval', 'q. Even integrand on a symmetric interval', 'r. The $a+b-x$ rule', 's. Periodicity'],
  },
  p1: {
    title: 'Passage: an area between curves',
    passage: R`<p>The region $R$ is enclosed by the parabola $y=x^2$ and the line $y=2x$.</p>`,
  },
  p2: {
    title: 'Passage: a pair of paired integrals',
    passage: R`<p>Let $I=\displaystyle\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}\,dx$ and $J=\displaystyle\int_0^{\pi/2}\frac{\cos x}{\sin x+\cos x}\,dx$.</p>`,
  },
  p3: {
    title: 'Passage: differentiating an integral',
    passage: R`<p>Let $F(x)=\displaystyle\int_x^{x^2}(t^2+1)\,dt$.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  I(1, 'fundamental theorem', R`Evaluate $\displaystyle\int_0^2x\,dx$.`, 2,
    R`<p>$\int_0^2x\,dx=\left[\dfrac{x^2}2\right]_0^2=2-0=2$.</p>`, 'Put the upper limit in first, then subtract the lower.', { calc: () => Math.round(simp((x) => x, 0, 2)) }),
  M(1, 'basic integrals', R`The value of $\displaystyle\int_0^{\pi}\sin x\,dx$ is`, '2', ['0', '1', R`$\pi$`],
    R`<p>$\int_0^\pi\sin x\,dx=[-\cos x]_0^\pi=-\cos\pi+\cos0=1+1=2$.</p>`, 'The area of one hump of sine is 2.'),
  I(1, 'basic integrals', R`Evaluate $\displaystyle\int_1^e\frac{dx}x$.`, 1,
    R`<p>$[\ln x]_1^e=\ln e-\ln1=1-0=1$.</p>`, '$\\ln1=0$.', { calc: () => Math.round(simp((x) => 1 / x, 1, E_)) }),
  M(1, 'basic properties', R`$\displaystyle\int_3^3x^2\,dx$ equals`, '0', ['9', '27', '3'],
    R`<p>When the limits are the same, there is no width and the integral is $0$: $\int_a^af(x)\,dx=0$.</p>`, 'Do not evaluate $x^2$ at 3.'),
  I(1, 'fundamental theorem', R`Evaluate $\displaystyle\int_0^1(2x+3)\,dx$.`, 4,
    R`<p>$[x^2+3x]_0^1=1+3=4$.</p>`, 'Integrate the constant too: $\\int3\\,dx=3x$.', { calc: () => Math.round(simp((x) => 2 * x + 3, 0, 1)) }),
  M(1, 'odd functions', R`$\displaystyle\int_{-1}^{1}x^3\,dx$ equals`, '0', ['1', '2', R`$\dfrac12$`],
    R`<p>$x^3$ is odd, so the area below the axis on $[-1,0]$ cancels the area above on $[0,1]$. Check: $\left[\dfrac{x^4}4\right]_{-1}^{1}=\dfrac14-\dfrac14=0$.</p>`, 'Odd function on $[-a,a]$ gives 0.'),
  I(1, 'basic integrals', R`Evaluate $\displaystyle\int_0^{\pi/2}\cos x\,dx$.`, 1,
    R`<p>$[\sin x]_0^{\pi/2}=1-0=1$.</p>`, 'Sine, not cosine, comes out of $\\int\\cos x\\,dx$.', { calc: () => Math.round(simp(cos, 0, PI_ / 2)) }),
  I(1, 'fundamental theorem', R`Evaluate $\displaystyle\int_0^3x^2\,dx$.`, 9,
    R`<p>$\left[\dfrac{x^3}3\right]_0^3=\dfrac{27}3=9$.</p>`, 'Divide by the new power.', { calc: () => Math.round(simp((x) => x * x, 0, 3)) }),
  M(1, 'basic integrals', R`The value of $\displaystyle\int_0^1e^x\,dx$ is`, R`$e-1$`, [R`$e$`, R`$1-e$`, R`$e+1$`],
    R`<p>$[e^x]_0^1=e-e^0=e-1$.</p>`, '$e^0=1$, not 0.'),
  I(1, 'fundamental theorem', R`Evaluate $\displaystyle\int_0^9\sqrt x\,dx$.`, 18,
    R`<p>$\int x^{1/2}dx=\dfrac23x^{3/2}$. At 9: $\dfrac23\cdot27=18$; at 0: 0.</p>`, '$9^{3/2}=27$.', { calc: () => Math.round(simp(sqrt, 0, 9)) }),
  M(1, 'odd functions', R`$\displaystyle\int_{-\pi/2}^{\pi/2}\sin x\,dx=$`, '0', ['1', '2', '-2'],
    R`<p>$\sin x$ is odd and the interval is symmetric about 0, so the integral is 0.</p>`, 'The area is 2, but the integral is 0.'),
  I(1, 'fundamental theorem', R`Evaluate $\displaystyle\int_0^14x^3\,dx$.`, 1,
    R`<p>$[x^4]_0^1=1$.</p>`, 'The 4 cancels with the power.', { calc: () => Math.round(simp((x) => 4 * x ** 3, 0, 1)) }),
  M(1, 'basic integrals', R`$\displaystyle\int_0^1\frac{dx}{1+x^2}$ equals`, R`$\dfrac\pi4$`, [R`$\dfrac\pi2$`, R`$\ln2$`, '1'],
    R`<p>$[\tan^{-1}x]_0^1=\dfrac\pi4-0$.</p>`, '$\\tan^{-1}1=\\pi/4$.'),
  I(1, 'basic properties', R`Evaluate $\displaystyle\int_{-2}^{2}3\,dx$.`, 12,
    R`<p>$[3x]_{-2}^{2}=6-(-6)=12$. (Area of a $4\times3$ rectangle.)</p>`, 'The width is 4, not 2.', { calc: () => Math.round(simp(() => 3, -2, 2)) }),
  M(1, 'basic properties', R`For $a<b<c$, $\displaystyle\int_a^bf(x)\,dx+\int_b^cf(x)\,dx$ equals`, R`$\displaystyle\int_a^cf(x)\,dx$`, [R`$\displaystyle\int_a^bf(x)\,dx\cdot\int_b^cf(x)\,dx$`, R`$\displaystyle\int_b^bf(x)\,dx$`, R`$\displaystyle\int_c^af(x)\,dx$`],
    R`<p>This is the additivity property of the interval. The option with $\int_c^a$ has the opposite sign, and a product of integrals is not an integral over a longer interval.</p>`, 'Reversing limits changes the sign.'),
  I(1, 'basic integrals', R`Evaluate $\displaystyle\int_0^{\ln2}e^x\,dx$.`, 1,
    R`<p>$[e^x]_0^{\ln2}=e^{\ln2}-1=2-1=1$.</p>`, '$e^{\\ln2}=2$.', { calc: () => Math.round(simp(exp, 0, ln(2))) }),

  // ---------- L2 standard ----------
  D(2, 'substitution', R`Evaluate $\displaystyle\int_0^1 2x\,e^{x^2}\,dx$.`, 1.7183,
    R`<p>Put $u=x^2$, $du=2x\,dx$. Limits: $x=0\to u=0$, $x=1\to u=1$. $\int_0^1e^u\,du=e-1\approx1.7183$.</p>`, 'Change the limits with the variable.', { calc: () => Q4((x) => 2 * x * exp(x * x), 0, 1) }),
  D(2, 'substitution', R`Evaluate $\displaystyle\int_0^{\pi/2}\sin x\cos x\,dx$.`, 0.5,
    R`<p>Put $u=\sin x$, $du=\cos x\,dx$. Limits $0\to1$. $\int_0^1u\,du=\dfrac12$.</p>`, 'Or use $\\sin x\\cos x=\\tfrac12\\sin2x$.', { calc: () => Q4((x) => sin(x) * cos(x), 0, PI_ / 2) }),
  D(2, 'substitution', R`Evaluate $\displaystyle\int_0^1\frac{x}{1+x^2}\,dx$.`, 0.3466,
    R`<p>$u=1+x^2$, $du=2x\,dx$. $\dfrac12\int_1^2\dfrac{du}u=\dfrac12\ln2\approx0.3466$.</p>`, 'The factor $\\tfrac12$ is easy to forget.', { calc: () => Q4((x) => x / (1 + x * x), 0, 1) }),
  D(2, 'even and odd', R`Evaluate $\displaystyle\int_{-2}^{2}(x^3+x^2)\,dx$.`, 5.3333,
    R`<p>$x^3$ is odd: its integral is 0. $x^2$ is even: $2\int_0^2x^2dx=2\cdot\dfrac83=\dfrac{16}3\approx5.3333$.</p>`, 'Split into the odd and even parts.', { calc: () => Q4((x) => x ** 3 + x * x, -2, 2) }),
  I(2, 'modulus integrand', R`Evaluate $\displaystyle\int_0^{\pi}|\cos x|\,dx$.`, 2,
    R`<p>$\cos x\ge0$ on $[0,\pi/2]$ and $\le0$ on $[\pi/2,\pi]$. $\int_0^{\pi/2}\cos x\,dx=1$ and $\int_{\pi/2}^{\pi}(-\cos x)\,dx=1$. Total 2.</p>`, 'Without the modulus the answer would be 0.', { calc: () => Math.round(simp((x) => abs(cos(x)), 0, PI_)) }),
  I(2, 'greatest integer function', R`Evaluate $\displaystyle\int_0^3[x]\,dx$, where $[x]$ is the greatest integer not exceeding $x$.`, 3,
    R`<p>$[x]=0$ on $[0,1)$, $1$ on $[1,2)$, $2$ on $[2,3)$. The integral is $0\cdot1+1\cdot1+2\cdot1=3$.</p>`, 'Add the pieces; $[x]$ is not $x$.', { calc: () => 0 + 1 + 2 }),
  I(2, 'modulus integrand', R`Evaluate $\displaystyle\int_0^2|x^2-1|\,dx$.`, 2,
    R`<p>$x^2-1<0$ on $[0,1)$ and $>0$ on $(1,2]$. $\int_0^1(1-x^2)dx=\dfrac23$. $\int_1^2(x^2-1)dx=\dfrac73-1=\dfrac43$. Total $2$.</p>`, 'Split at $x=1$.', { calc: () => Math.round(simp((x) => abs(x * x - 1), 0, 2)) }),
  D(2, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}\,dx$.`, 0.7854,
    R`<p>Let $I$ be the integral. The rule $\int_0^af(x)dx=\int_0^af(a-x)dx$ with $a=\pi/2$ gives $I=\int_0^{\pi/2}\dfrac{\cos x}{\sin x+\cos x}dx$. Add: $2I=\int_0^{\pi/2}1\,dx=\dfrac\pi2$, so $I=\dfrac\pi4\approx0.7854$.</p>`, 'Add the two forms; do not try to integrate directly.', { calc: () => Q4((x) => sin(x) / (sin(x) + cos(x)), 0, PI_ / 2) }),
  D(2, 'Beta integrals', R`Evaluate $\displaystyle\int_0^1x(1-x)^3\,dx$.`, 0.05,
    R`<p>Put $t=1-x$: $\int_0^1(1-t)t^3dt=\left[\dfrac{t^4}4-\dfrac{t^5}5\right]_0^1=\dfrac14-\dfrac15=\dfrac1{20}=0.05$.</p>`, 'Substitute $t=1-x$ so the power is on a single variable.', { calc: () => Q4((x) => x * (1 - x) ** 3, 0, 1) }),
  I(2, 'Leibniz rule', R`$F(x)=\displaystyle\int_0^{x^2}(t+1)\,dt$. Find $F'(3)$.`, 60,
    R`<p>$F'(x)=f(x^2)\cdot2x=(x^2+1)\cdot2x$. At $x=3$: $10\cdot6=60$. (Check: $F(x)=\dfrac{x^4}2+x^2$, $F'=2x^3+2x=54+6=60$.)</p>`, 'Do not forget the chain-rule factor $2x$.', { calc: () => { const F = (x) => simp((t) => t + 1, 0, x * x, 2000); const h = 1e-3; return Math.round((F(3 + h) - F(3 - h)) / (2 * h)); } }),
  I(2, 'Leibniz rule', R`$F(x)=\displaystyle\int_x^{x^2}t\,dt$. Find $F'(2)$.`, 14,
    R`<p>$F'(x)=f(x^2)\cdot2x-f(x)\cdot1=x^2\cdot2x-x=2x^3-x$. At $x=2$: $16-2=14$.</p>`, 'Lower limit contributes with a minus sign.', { calc: () => { const F = (x) => simp((t) => t, x, x * x, 2000); const h = 1e-3; return Math.round((F(2 + h) - F(2 - h)) / (2 * h)); } }),
  M(2, 'Leibniz rule', R`$\dfrac{d}{dx}\displaystyle\int_0^xe^{t^2}\,dt$ equals`, R`$e^{x^2}$`, [R`$2x\,e^{x^2}$`, R`$e^{x^2}-1$`, R`$\dfrac{e^{x^2}}{2x}$`],
    R`<p>By the fundamental theorem of calculus, the derivative of $\int_0^xf(t)dt$ is $f(x)$. Here $f(t)=e^{t^2}$, so the answer is $e^{x^2}$. The chain-rule factor $2x$ would appear only if the upper limit were $x^2$.</p>`, 'Limit is just $x$, so no extra factor.'),
  D(2, 'area between curves', R`Find the area between the curve $y=x^2$ and the line $y=4$.`, 10.6667,
    R`<p>They meet at $x=\pm2$. Area $=\int_{-2}^{2}(4-x^2)dx=2\left[4x-\dfrac{x^3}3\right]_0^2=2\left(8-\dfrac83\right)=\dfrac{32}3\approx10.6667$.</p>`, 'Top curve minus bottom curve.', { calc: () => Q4((x) => 4 - x * x, -2, 2) }),
  D(2, 'area between curves', R`Find the area enclosed between $y=x$ and $y=x^2$.`, 0.1667,
    R`<p>They meet at $x=0$ and $x=1$, with $y=x$ on top. Area $=\int_0^1(x-x^2)dx=\dfrac12-\dfrac13=\dfrac16\approx0.1667$.</p>`, 'Between 0 and 1 the line is above the parabola.', { calc: () => Q4((x) => x - x * x, 0, 1) }),
  I(2, 'area under a curve', R`Find the area bounded by $y=2x$, the x-axis and the line $x=3$.`, 9,
    R`<p>$\int_0^32x\,dx=[x^2]_0^3=9$. (It is a triangle with base 3 and height 6: $\tfrac12\cdot3\cdot6=9$.)</p>`, 'A quick triangle check is available.', { calc: () => Math.round(simp((x) => 2 * x, 0, 3)) }),
  D(2, 'area under a curve', R`Find the area under $y=\sqrt x$ from $x=0$ to $x=4$.`, 5.3333,
    R`<p>$\int_0^4x^{1/2}dx=\dfrac23[x^{3/2}]_0^4=\dfrac23\cdot8=\dfrac{16}3\approx5.3333$.</p>`, '$4^{3/2}=8$.', { calc: () => Q4(sqrt, 0, 4, 200000) }),
  D(2, 'limit of a sum', R`Find $\displaystyle\lim_{n\to\infty}\frac1n\sum_{r=1}^{n}\sqrt{\frac rn}$.`, 0.6667,
    R`<p>This is a Riemann sum for $\int_0^1\sqrt x\,dx$ with $x=r/n$ and $dx=1/n$. $\int_0^1x^{1/2}dx=\dfrac23\approx0.6667$.</p>`, 'Spot $\\tfrac1n$ as $dx$ and $\\tfrac rn$ as $x$.', { calc: () => Q4(sqrt, 0, 1, 400000) }),
  D(2, 'limit of a sum', R`Find $\displaystyle\lim_{n\to\infty}\frac1n\sum_{r=0}^{n-1}\cos\frac{r\pi}{2n}$.`, 0.6366,
    R`<p>With $x=r/n$, the sum becomes $\int_0^1\cos\dfrac{\pi x}2dx=\left[\dfrac2\pi\sin\dfrac{\pi x}2\right]_0^1=\dfrac2\pi\approx0.6366$.</p>`, 'Limits are 0 to 1, since $r/n$ runs from 0 to 1.', { calc: () => Q4((x) => cos((PI_ * x) / 2), 0, 1) }),
  D(2, 'Wallis formula', R`Evaluate $\displaystyle\int_0^{\pi/2}\sin^5x\,dx$.`, 0.5333,
    R`<p>Wallis: for odd $n$, $\int_0^{\pi/2}\sin^nx\,dx=\dfrac{(n-1)(n-3)\cdots2}{n(n-2)\cdots3}\cdot1$. So $\dfrac{4\cdot2}{5\cdot3}=\dfrac8{15}\approx0.5333$.</p>`, 'Odd powers end in 1, even powers bring $\\pi/2$.', { calc: () => Q4((x) => sin(x) ** 5, 0, PI_ / 2) }),
  D(2, 'Wallis formula', R`Evaluate $\displaystyle\int_0^{\pi/2}\sin^4x\,dx$.`, 0.589,
    R`<p>Wallis for even $n$: $\dfrac{(n-1)(n-3)\cdots1}{n(n-2)\cdots2}\cdot\dfrac\pi2$. For $n=4$: $\dfrac{3\cdot1}{4\cdot2}\cdot\dfrac\pi2=\dfrac{3\pi}{16}\approx0.5890$.</p>`, 'Even power: do not forget $\\pi/2$.', { calc: () => Q4((x) => sin(x) ** 4, 0, PI_ / 2) }),
  I(2, 'periodic functions', R`Evaluate $\displaystyle\int_0^{10\pi}|\sin x|\,dx$.`, 20,
    R`<p>$|\sin x|$ has period $\pi$ and $\int_0^\pi|\sin x|dx=2$. Ten periods: $10\cdot2=20$.</p>`, 'The period of $|\\sin x|$ is $\\pi$, not $2\\pi$.', { calc: () => Math.round(simp((x) => abs(sin(x)), 0, 10 * PI_)) }),
  D(2, 'periodic functions', R`Evaluate $\displaystyle\int_0^{2\pi}\sin^2x\,dx$.`, 3.1416,
    R`<p>$\sin^2x=\dfrac{1-\cos2x}2$. $\int_0^{2\pi}\dfrac12dx-\dfrac12\int_0^{2\pi}\cos2x\,dx=\pi-0=\pi\approx3.1416$.</p>`, 'The average value of $\\sin^2x$ is $\\tfrac12$.', { calc: () => Q4((x) => sin(x) ** 2, 0, 2 * PI_) }),
  M(2, 'estimation', R`$\displaystyle\int_0^1e^{x^2}\,dx$ lies between`, R`$1$ and $e$`, [R`$0$ and $1$`, R`$e$ and $e^2$`, R`$-1$ and $0$`],
    R`<p>On $[0,1]$, $1\le e^{x^2}\le e$. Over an interval of length 1 the integral lies between $1\cdot1$ and $e\cdot1$. (Actual value $\approx1.4627$.)</p>`, 'Bound the integrand, then multiply by the width.'),
  D(2, 'partial fractions', R`Evaluate $\displaystyle\int_1^2\frac{dx}{x(x+1)}$.`, 0.2877,
    R`<p>$\dfrac1{x(x+1)}=\dfrac1x-\dfrac1{x+1}$. $[\ln x-\ln(x+1)]_1^2=\ln\dfrac23-\ln\dfrac12=\ln\dfrac43\approx0.2877$.</p>`, 'Break into partial fractions before integrating.', { calc: () => Q4((x) => 1 / (x * (x + 1)), 1, 2) }),
  D(2, 'substitution', R`Evaluate $\displaystyle\int_0^{\pi/4}\tan x\,dx$.`, 0.3466,
    R`<p>$\int\tan x\,dx=-\ln\cos x$. $-\ln\cos\dfrac\pi4+\ln1=-\ln\dfrac1{\sqrt2}=\dfrac12\ln2\approx0.3466$.</p>`, '$\\cos\\tfrac\\pi4=\\tfrac1{\\sqrt2}$.', { calc: () => Q4(tan, 0, PI_ / 4) }),
  D(2, 'inverse trigonometric', R`Evaluate $\displaystyle\int_0^1\frac{dx}{\sqrt{1-x^2}}$.`, 1.5708,
    R`<p>$[\sin^{-1}x]_0^1=\dfrac\pi2-0\approx1.5708$. (The integrand is unbounded at $x=1$, but the area is finite.)</p>`, 'Standard form, no substitution needed.', { calc: () => +(Math.asin(1) - Math.asin(0)).toFixed(4) }),
  D(2, 'substitution', R`Evaluate $\displaystyle\int_0^2x\sqrt{4-x^2}\,dx$.`, 2.6667,
    R`<p>Put $u=4-x^2$, $du=-2x\,dx$. Limits $x=0\to u=4$, $x=2\to u=0$. $-\dfrac12\int_4^0\sqrt u\,du=\dfrac12\cdot\dfrac23\cdot8=\dfrac83\approx2.6667$.</p>`, 'Flipping the limits absorbs the minus sign.', { calc: () => Q4((x) => x * sqrt(4 - x * x), 0, 2, 200000) }),
  D(2, 'substitution', R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{\sin x}{1+\cos^2x}\,dx$.`, 0.7854,
    R`<p>Put $u=\cos x$, $du=-\sin x\,dx$. Limits $1\to0$. $\int_0^1\dfrac{du}{1+u^2}=\tan^{-1}1=\dfrac\pi4\approx0.7854$.</p>`, 'The minus sign flips the limits back.', { calc: () => Q4((x) => sin(x) / (1 + cos(x) ** 2), 0, PI_ / 2) }),
  I(2, 'integration by parts', R`Evaluate $\displaystyle\int_1^e\ln x\,dx$.`, 1,
    R`<p>$\int\ln x\,dx=x\ln x-x$. $[x\ln x-x]_1^e=(e-e)-(0-1)=1$.</p>`, 'Write $\\ln x=1\\cdot\\ln x$ and use parts.', { calc: () => Math.round(simp(ln, 1, E_)) }),
  I(2, 'integration by parts', R`Evaluate $\displaystyle\int_0^1x\,e^x\,dx$.`, 1,
    R`<p>$\int xe^xdx=xe^x-e^x$. $[xe^x-e^x]_0^1=(e-e)-(0-1)=1$.</p>`, 'Choose $u=x$, $dv=e^xdx$.', { calc: () => Math.round(simp((x) => x * exp(x), 0, 1)) }),
  D(2, 'integration by parts', R`Evaluate $\displaystyle\int_0^{\pi}x\sin x\,dx$.`, 3.1416,
    R`<p>$\int x\sin x\,dx=-x\cos x+\sin x$. $[-x\cos x+\sin x]_0^\pi=\pi+0-0=\pi\approx3.1416$.</p>`, '$-\\pi\\cos\\pi=+\\pi$.', { calc: () => Q4((x) => x * sin(x), 0, PI_) }),
  I(2, 'improper-looking integrals', R`Evaluate $\displaystyle\int_0^1\ln x\,dx$.`, -1,
    R`<p>$\int\ln x\,dx=x\ln x-x$. At 1: $-1$. At $0^+$: $x\ln x\to0$, so the value is $0$. Result $-1-0=-1$. (The area is negative since $\ln x<0$ on $(0,1)$.)</p>`, '$x\\ln x\\to0$ as $x\\to0^+$.', { calc: () => -1 }),
  D(2, 'inverse trigonometric', R`Evaluate $\displaystyle\int_0^1\tan^{-1}x\,dx$.`, 0.4388,
    R`<p>By parts: $x\tan^{-1}x-\dfrac12\ln(1+x^2)$. At 1: $\dfrac\pi4-\dfrac12\ln2$. At 0: 0. So $\approx0.7854-0.3466=0.4388$.</p>`, 'Write $\\tan^{-1}x=1\\cdot\\tan^{-1}x$.', { calc: () => Q4(atan, 0, 1) }),
  D(2, 'inverse trigonometric', R`Evaluate $\displaystyle\int_0^1\sin^{-1}x\,dx$.`, 0.5708,
    R`<p>By parts: $x\sin^{-1}x+\sqrt{1-x^2}$. At 1: $\dfrac\pi2+0$. At 0: $0+1$. Difference $\dfrac\pi2-1\approx0.5708$.</p>`, 'Remember to subtract the value at 0, which is 1.', { calc: () => +(PI_ / 2 - 1).toFixed(4) }),
  I(2, 'solving integral equations', R`Find the positive $k$ with $\displaystyle\int_0^k(2x+1)\,dx=6$.`, 2,
    R`<p>$[x^2+x]_0^k=k^2+k=6$, so $k^2+k-6=0$, $(k+3)(k-2)=0$. The positive root is $k=2$.</p>`, 'Reject the negative root.', { calc: () => 2 }),
  I(2, 'modulus integrand', R`Evaluate $\displaystyle\int_0^2|x-1|\,dx$.`, 1,
    R`<p>Split at 1: $\int_0^1(1-x)dx+\int_1^2(x-1)dx=\dfrac12+\dfrac12=1$.</p>`, 'Two small triangles.', { calc: () => Math.round(simp((x) => abs(x - 1), 0, 2)) }),
  M(2, 'comparison', R`Which is larger?`, R`$\displaystyle\int_0^1x^2\,dx$ is larger than $\displaystyle\int_0^1x^3\,dx$`, [R`$\displaystyle\int_0^1x^3\,dx$ is larger than $\displaystyle\int_0^1x^2\,dx$`, R`They are equal`, R`Cannot be compared without evaluating`],
    R`<p>On $(0,1)$, $x^3<x^2$, so the first integral is bigger. Values: $\dfrac13$ and $\dfrac14$.</p>`, 'Higher powers are smaller between 0 and 1.'),
  I(2, 'area under a curve', R`Find the area bounded by $y=\ln x$, the x-axis and the line $x=e$.`, 1,
    R`<p>$\ln x\ge0$ on $[1,e]$. Area $=\int_1^e\ln x\,dx=[x\ln x-x]_1^e=0-(-1)=1$.</p>`, 'The curve meets the x-axis at $x=1$.', { calc: () => Math.round(simp(ln, 1, E_)) }),
  D(2, 'substitution', R`Evaluate $\displaystyle\int_0^1x(1+x^2)^3\,dx$.`, 1.875,
    R`<p>Put $u=1+x^2$, $du=2x\,dx$, limits $1\to2$. $\dfrac12\int_1^2u^3du=\dfrac12\cdot\dfrac{16-1}4=\dfrac{15}8=1.875$.</p>`, 'New limits are 1 and 2.', { calc: () => Q4((x) => x * (1 + x * x) ** 3, 0, 1) }),
  D(2, 'modulus integrand', R`Evaluate $\displaystyle\int_2^5|x-3|\,dx$.`, 2.5,
    R`<p>Split at 3: $\int_2^3(3-x)dx+\int_3^5(x-3)dx=\dfrac12+2=2.5$.</p>`, 'The two pieces are triangles of area $\\tfrac12$ and $2$.', { calc: () => Q4((x) => abs(x - 3), 2, 5) }),
  I(2, 'fundamental theorem', R`Evaluate $\displaystyle\int_0^{\pi/4}\sec^2x\,dx$.`, 1,
    R`<p>$[\tan x]_0^{\pi/4}=1-0=1$.</p>`, '$\\tan\\tfrac\\pi4=1$.', { calc: () => Math.round(simp((x) => 1 / cos(x) ** 2, 0, PI_ / 4)) }),

  // ---------- L3 exam ----------
  D(3, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{\sqrt{\sin x}}{\sqrt{\sin x}+\sqrt{\cos x}}\,dx$.`, 0.7854,
    R`<p>Let $I$ be the integral. Replace $x$ by $\dfrac\pi2-x$: $I=\int_0^{\pi/2}\dfrac{\sqrt{\cos x}}{\sqrt{\cos x}+\sqrt{\sin x}}dx$. Adding, $2I=\int_0^{\pi/2}dx=\dfrac\pi2$, so $I=\dfrac\pi4\approx0.7854$.</p>`, 'The two integrands add up to exactly 1.', { calc: () => Q4((x) => sqrt(sin(x)) / (sqrt(sin(x)) + sqrt(cos(x))), 0, PI_ / 2, 200000) }),
  D4(3, 'Beta integrals', R`Evaluate $\displaystyle\int_0^1x^3(1-x)^2\,dx$.`, 0.0167,
    R`<p>$\int_0^1x^m(1-x)^ndx=\dfrac{m!\,n!}{(m+n+1)!}$. Here $\dfrac{3!\,2!}{6!}=\dfrac{12}{720}=\dfrac1{60}\approx0.0167$. (Or expand: $\int(x^3-2x^4+x^5)=\dfrac14-\dfrac25+\dfrac16=\dfrac1{60}$.)</p>`, 'Factorial of $m+n+1$, not $m+n$.', { calc: () => Q4((x) => x ** 3 * (1 - x) ** 2, 0, 1) }),
  D(3, 'Wallis formula', R`Evaluate $\displaystyle\int_0^{\pi}\sin^3x\,dx$.`, 1.3333,
    R`<p>$\sin^3x$ is symmetric about $\pi/2$ on $[0,\pi]$, so $\int_0^\pi=2\int_0^{\pi/2}\sin^3x\,dx=2\cdot\dfrac23=\dfrac43\approx1.3333$.</p>`, 'Doubling works only because of the symmetry $\\sin(\\pi-x)=\\sin x$.', { calc: () => Q4((x) => sin(x) ** 3, 0, PI_) }),
  D(3, 'Wallis formula', R`Evaluate $\displaystyle\int_0^{2\pi}\cos^4x\,dx$.`, 2.3562,
    R`<p>Over a full period, $\int_0^{2\pi}\cos^4x\,dx=4\int_0^{\pi/2}\cos^4x\,dx=4\cdot\dfrac{3\pi}{16}=\dfrac{3\pi}4\approx2.3562$.</p>`, 'Four quarter-periods.', { calc: () => Q4((x) => cos(x) ** 4, 0, 2 * PI_) }),
  I(3, 'greatest integer function', R`Evaluate $\displaystyle\int_0^{4.5}[x]\,dx$.`, 8,
    R`<p>$[x]$ is 0, 1, 2, 3 on the unit intervals up to 4, and 4 on $[4,4.5)$. Integral $=0+1+2+3+4\times0.5=8$.</p>`, 'The last piece has width 0.5, not 1.', { calc: () => 0 + 1 + 2 + 3 + 4 * 0.5 }),
  D(3, 'fractional part', R`Evaluate $\displaystyle\int_0^3\{x\}\,dx$, where $\{x\}=x-[x]$.`, 1.5,
    R`<p>$\{x\}$ is a saw-tooth of period 1 with $\int_0^1x\,dx=\dfrac12$ per period. Three periods give $\dfrac32$. (Or: $\int_0^3x\,dx-\int_0^3[x]dx=\dfrac92-3=\dfrac32$.)</p>`, 'Average of the saw-tooth is $\\tfrac12$.', { calc: () => 9 / 2 - 3 }),
  D(3, 'modulus integrand', R`Evaluate $\displaystyle\int_{-1}^{2}|x|\,dx$.`, 2.5,
    R`<p>$\int_{-1}^0(-x)dx+\int_0^2x\,dx=\dfrac12+2=2.5$.</p>`, 'The interval is not symmetric, so you cannot double.', { calc: () => Q4((x) => abs(x), -1, 2) }),
  D(3, 'greatest integer function', R`Evaluate $\displaystyle\int_0^2x[x]\,dx$.`, 1.5,
    R`<p>On $[0,1)$, $[x]=0$. On $[1,2)$, $[x]=1$. So $\int_1^2x\,dx=\dfrac{4-1}2=1.5$.</p>`, 'The first unit interval contributes nothing.', { calc: () => (4 - 1) / 2 }),
  I(3, 'greatest integer function', R`For a positive integer $n$, $\displaystyle\int_0^n[x]\,dx=45$. Find $n$.`, 10,
    R`<p>$\int_0^n[x]dx=0+1+\cdots+(n-1)=\dfrac{n(n-1)}2$. Set equal to 45: $n(n-1)=90$, $n=10$.</p>`, 'Sum runs to $n-1$, not $n$.', { calc: () => { let n = 1; while ((n * (n - 1)) / 2 < 45) n++; return n; } }),
  D(3, 'limit of a sum', R`Find $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\frac{r}{n^2+r^2}$.`, 0.3466,
    R`<p>$\dfrac r{n^2+r^2}=\dfrac1n\cdot\dfrac{r/n}{1+(r/n)^2}$. So the limit is $\int_0^1\dfrac x{1+x^2}dx=\dfrac12\ln2\approx0.3466$.</p>`, 'Divide top and bottom by $n^2$ to expose $r/n$.', { calc: () => Q4((x) => x / (1 + x * x), 0, 1) }),
  D(3, 'limit of a sum', R`Find $\displaystyle\lim_{n\to\infty}\sum_{r=0}^{n-1}\frac1{\sqrt{n^2-r^2}}$.`, 1.5708,
    R`<p>$\dfrac1{\sqrt{n^2-r^2}}=\dfrac1n\cdot\dfrac1{\sqrt{1-(r/n)^2}}$. The limit is $\int_0^1\dfrac{dx}{\sqrt{1-x^2}}=\dfrac\pi2\approx1.5708$.</p>`, 'Pull $n$ out of the square root.', { calc: () => +(PI_ / 2).toFixed(4) }),
  D(3, 'limit of a sum', R`Find $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\frac n{(n+r)^2}$.`, 0.5,
    R`<p>$\dfrac n{(n+r)^2}=\dfrac1n\cdot\dfrac1{(1+r/n)^2}$. Limit $=\int_0^1\dfrac{dx}{(1+x)^2}=\left[-\dfrac1{1+x}\right]_0^1=1-\dfrac12=\dfrac12$.</p>`, 'Factor $n^2$ from the denominator.', { calc: () => Q4((x) => 1 / (1 + x) ** 2, 0, 1) }),
  I(3, 'limit using the Leibniz rule', R`Find $\displaystyle\lim_{x\to0}\frac1x\int_0^x\cos(t^2)\,dt$.`, 1,
    R`<p>The limit has the form $\dfrac00$. By L'Hopital (with Leibniz), numerator derivative is $\cos(x^2)$ and denominator derivative is 1. At $x\to0$: $\cos0=1$.</p>`, 'Differentiate numerator and denominator separately.', { calc: () => Math.round(cos(0)) }),
  D(3, 'area between curves', R`Find the area enclosed by the parabolas $y^2=4x$ and $x^2=4y$.`, 5.3333,
    R`<p>They meet at $(0,0)$ and $(4,4)$. For $0\le x\le4$ the upper curve is $y=2\sqrt x$ and the lower is $y=\dfrac{x^2}4$. Area $=\int_0^4\left(2\sqrt x-\dfrac{x^2}4\right)dx=\dfrac43\cdot8-\dfrac{64}{12}=\dfrac{32}3-\dfrac{16}3=\dfrac{16}3\approx5.3333$.</p>`, 'Check which parabola is on top using $x=1$.', { calc: () => Q4((x) => 2 * sqrt(x) - (x * x) / 4, 0, 4, 200000) }),
  D(3, 'area between curves', R`Find the area enclosed by $y=e^x$, $y=e^{-x}$ and the line $x=1$.`, 1.0862,
    R`<p>The curves meet at $x=0$. For $0\le x\le1$, $e^x\ge e^{-x}$. Area $=\int_0^1(e^x-e^{-x})dx=[e^x+e^{-x}]_0^1=e+\dfrac1e-2\approx1.0862$.</p>`, 'The integral of $e^{-x}$ is $-e^{-x}$.', { calc: () => Q4((x) => exp(x) - exp(-x), 0, 1) }),
  D(3, 'area between curves', R`Find the area between $y=\cos x$ and $y=\sin x$ from $x=0$ to $x=\dfrac\pi4$.`, 0.4142,
    R`<p>On $[0,\pi/4]$, $\cos x\ge\sin x$. Area $=[\sin x+\cos x]_0^{\pi/4}=\sqrt2-1\approx0.4142$.</p>`, 'The curves cross at $\\pi/4$.', { calc: () => Q4((x) => cos(x) - sin(x), 0, PI_ / 4) }),
  D(3, 'area under a curve', R`Find the total area enclosed between the curve $y=x^3-x$ and the x-axis.`, 0.5,
    R`<p>$x^3-x=x(x-1)(x+1)$ cuts the axis at $-1,0,1$. By symmetry (odd function) the two loops have equal area: $2\int_0^1(x-x^3)dx=2\left(\dfrac12-\dfrac14\right)=\dfrac12$.</p>`, '$\\int_{-1}^{1}(x^3-x)dx=0$, which is not the area.', { calc: () => Q4((x) => abs(x ** 3 - x), -1, 1) }),
  D4(3, 'Wallis formula', R`Evaluate $\displaystyle\int_0^{\pi/2}\sin^3x\cos^3x\,dx$.`, 0.0833,
    R`<p>Put $u=\sin x$: $\int_0^1u^3(1-u^2)du=\dfrac14-\dfrac16=\dfrac1{12}\approx0.0833$.</p>`, 'Save one $\\cos x$ for $du$.', { calc: () => Q4((x) => sin(x) ** 3 * cos(x) ** 3, 0, PI_ / 2) }),
  D(3, 'Wallis formula', R`Evaluate $\displaystyle\int_0^{\pi/2}\sin^7x\,dx$.`, 0.4571,
    R`<p>$\dfrac{6\cdot4\cdot2}{7\cdot5\cdot3}=\dfrac{48}{105}=\dfrac{16}{35}\approx0.4571$.</p>`, 'Odd power: product of descending even over odd numbers.', { calc: () => Q4((x) => sin(x) ** 7, 0, PI_ / 2) }),
  I(3, 'modulus integrand', R`Evaluate $\displaystyle\int_0^4(|x-1|+|x-3|)\,dx$.`, 10,
    R`<p>$\int_0^4|x-1|dx=\dfrac{1}{2}+\dfrac92=5$ and $\int_0^4|x-3|dx=\dfrac92+\dfrac12=5$. Total 10.</p>`, 'Each modulus kinks at a different point.', { calc: () => Math.round(simp((x) => abs(x - 1) + abs(x - 3), 0, 4)) }),
  D(3, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi}x\cos^2x\,dx$.`, 2.4674,
    R`<p>Use $\int_0^af(x)dx=\int_0^af(a-x)dx$ with $a=\pi$: $I=\int_0^\pi(\pi-x)\cos^2x\,dx$. Add: $2I=\pi\int_0^\pi\cos^2x\,dx=\pi\cdot\dfrac\pi2$. So $I=\dfrac{\pi^2}4\approx2.4674$.</p>`, '$\\cos^2(\\pi-x)=\\cos^2x$.', { calc: () => Q4((x) => x * cos(x) ** 2, 0, PI_) }),
  I(3, 'solving integral equations', R`If $\displaystyle\int_0^af(x)\,dx=a^2+a$ for all $a$, find $f(2)$.`, 5,
    R`<p>Differentiate both sides with respect to $a$: $f(a)=2a+1$. So $f(2)=5$.</p>`, 'The fundamental theorem gives $f$ directly.', { calc: () => 2 * 2 + 1 }),
  D(3, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi}\frac{x\sin x}{1+\cos^2x}\,dx$.`, 2.4674,
    R`<p>Using $x\to\pi-x$ (the integrand part $\dfrac{\sin x}{1+\cos^2x}$ is unchanged): $I=\dfrac\pi2\int_0^\pi\dfrac{\sin x}{1+\cos^2x}dx$. With $u=\cos x$: $\int_{-1}^{1}\dfrac{du}{1+u^2}=\dfrac\pi2$. So $I=\dfrac\pi2\cdot\dfrac\pi2=\dfrac{\pi^2}4\approx2.4674$.</p>`, 'Do not try to integrate $x\\sin x/(1+\\cos^2x)$ directly.', { calc: () => Q4((x) => (x * sin(x)) / (1 + cos(x) ** 2), 0, PI_) }),

  // ---------- L4 ----------
  D(4, 'even and odd', R`Evaluate $\displaystyle\int_{-\pi/2}^{\pi/2}\frac{\sin^2x}{1+e^x}\,dx$.`, 0.7854,
    R`<p>Let $f(x)=\dfrac{\sin^2x}{1+e^x}$. Then $f(x)+f(-x)=\sin^2x\left[\dfrac1{1+e^x}+\dfrac1{1+e^{-x}}\right]=\sin^2x$. So $I=\dfrac12\int_{-\pi/2}^{\pi/2}\sin^2x\,dx=\dfrac12\cdot\dfrac\pi2=\dfrac\pi4\approx0.7854$.</p>`, 'The bracket equals 1; pair $x$ with $-x$.', { calc: () => Q4((x) => sin(x) ** 2 / (1 + exp(x)), -PI_ / 2, PI_ / 2) }),
  D(4, 'even and odd', R`Evaluate $\displaystyle\int_{-\pi/2}^{\pi/2}\frac{\cos x}{1+e^{\sin x}}\,dx$.`, 1,
    R`<p>$f(x)+f(-x)=\cos x\left[\dfrac1{1+e^{\sin x}}+\dfrac1{1+e^{-\sin x}}\right]=\cos x$. So $I=\dfrac12\int_{-\pi/2}^{\pi/2}\cos x\,dx=\dfrac12\cdot2=1$.</p>`, 'Same pairing trick, now with $\\sin x$ in the exponent.', { calc: () => Q4((x) => cos(x) / (1 + exp(sin(x))), -PI_ / 2, PI_ / 2) }),
  D(4, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi/4}\ln(1+\tan x)\,dx$.`, 0.2722,
    R`<p>Replace $x$ by $\dfrac\pi4-x$: $1+\tan\left(\dfrac\pi4-x\right)=1+\dfrac{1-\tan x}{1+\tan x}=\dfrac2{1+\tan x}$. So $I=\int_0^{\pi/4}[\ln2-\ln(1+\tan x)]dx=\dfrac\pi4\ln2-I$. Hence $I=\dfrac\pi8\ln2\approx0.2722$.</p>`, 'The integral appears on both sides: solve for it.', { calc: () => Q4((x) => ln(1 + tan(x)), 0, PI_ / 4) }),
  D(4, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi/2}\ln(\sin x)\,dx$.`, -1.0888,
    R`<p>Let $I$ be the integral. By $x\to\pi/2-x$, $I=\int\ln\cos x\,dx$. Add: $2I=\int_0^{\pi/2}\ln\left(\dfrac{\sin2x}2\right)dx=\int_0^{\pi/2}\ln\sin2x\,dx-\dfrac\pi2\ln2$. In the first integral put $t=2x$: $\dfrac12\int_0^\pi\ln\sin t\,dt=\int_0^{\pi/2}\ln\sin t\,dt=I$. So $2I=I-\dfrac\pi2\ln2$ and $I=-\dfrac\pi2\ln2\approx-1.0888$.</p>`, 'The integral is negative because $\\ln\\sin x\\le0$.', { calc: () => +(-(PI_ / 2) * ln(2)).toFixed(4) }),
  D(4, 'modulus integrand', R`Evaluate $\displaystyle\int_0^{\pi}|\sin x+\cos x|\,dx$.`, 2.8284,
    R`<p>$\sin x+\cos x=\sqrt2\sin\left(x+\dfrac\pi4\right)$ is zero at $x=\dfrac{3\pi}4$. On $[0,\tfrac{3\pi}4]$ it is positive: $[-\cos x+\sin x]_0^{3\pi/4}=\sqrt2+1$. On $[\tfrac{3\pi}4,\pi]$ it is negative: $-[-\cos x+\sin x]_{3\pi/4}^{\pi}=\sqrt2-1$. Total $2\sqrt2\approx2.8284$.</p>`, 'Find the sign change before integrating.', { calc: () => Q4((x) => abs(sin(x) + cos(x)), 0, PI_, 200000) }),
  D(4, 'modulus integrand', R`Evaluate $\displaystyle\int_0^{2\pi}|\sin x-\cos x|\,dx$.`, 5.6569,
    R`<p>$|\sin x-\cos x|=\sqrt2\,|\sin(x-\pi/4)|$ has period $\pi$. Over one period $\int_0^\pi\sqrt2|\sin u|du=2\sqrt2$. Two periods: $4\sqrt2\approx5.6569$.</p>`, 'Rewrite as a single sine first.', { calc: () => Q4((x) => abs(sin(x) - cos(x)), 0, 2 * PI_, 200000) }),
  D(4, 'limit of a sum', R`Evaluate $\displaystyle\lim_{n\to\infty}\left[\frac{(2n)!}{n!\,n^n}\right]^{1/n}$.`, 1.4715,
    R`<p>$\dfrac{(2n)!}{n!\,n^n}=\dfrac{(n+1)(n+2)\cdots(2n)}{n^n}=\prod_{r=1}^{n}\left(1+\dfrac rn\right)$. Take logs: $\ln L=\lim\dfrac1n\sum\ln\left(1+\dfrac rn\right)=\int_0^1\ln(1+x)dx=2\ln2-1$. So $L=e^{2\ln2-1}=\dfrac4e\approx1.4715$.</p>`, 'Take the logarithm to turn a product into a sum.', { calc: () => +(4 / E_).toFixed(4) }),
  D(4, 'limit of a sum', R`Evaluate $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\frac{r^2}{n^3+r^3}$.`, 0.231,
    R`<p>$\dfrac{r^2}{n^3+r^3}=\dfrac1n\cdot\dfrac{(r/n)^2}{1+(r/n)^3}$. The limit is $\int_0^1\dfrac{x^2}{1+x^3}dx=\dfrac13\ln2\approx0.2310$.</p>`, 'Factor $n^3$ out of the denominator.', { calc: () => Q4((x) => (x * x) / (1 + x ** 3), 0, 1) }),
  D(4, 'limit using the Leibniz rule', R`Find $\displaystyle\lim_{x\to0}\frac1{x^3}\int_0^x\sin(t^2)\,dt$.`, 0.3333,
    R`<p>Form $\dfrac00$. L'Hopital: $\dfrac{\sin(x^2)}{3x^2}\to\dfrac13$ (since $\sin(x^2)\approx x^2$).</p>`, 'Differentiate the top with the Leibniz rule and the bottom normally.', { calc: () => { const x = 1e-3; return +(simp((t) => sin(t * t), 0, x, 200) / x ** 3).toFixed(4); } }),
  D(4, 'Leibniz rule', R`$F(x)=\displaystyle\int_{\sin x}^{\cos x}t^2\,dt$. Find $F'\left(\dfrac\pi4\right)$.`, -0.7071,
    R`<p>$F'(x)=\cos^2x\cdot(-\sin x)-\sin^2x\cdot(\cos x)$. At $x=\dfrac\pi4$: $\sin=\cos=\dfrac1{\sqrt2}$. So $F'=-\dfrac12\cdot\dfrac1{\sqrt2}-\dfrac12\cdot\dfrac1{\sqrt2}=-\dfrac1{\sqrt2}\approx-0.7071$.</p>`, 'Chain rule: the derivative of $\\cos x$ is $-\\sin x$.', { calc: () => { const F = (x) => simp((t) => t * t, sin(x), cos(x), 2000); const h = 1e-4; return +((F(PI_ / 4 + h) - F(PI_ / 4 - h)) / (2 * h)).toFixed(4); } }),
  I(4, 'limit using the Leibniz rule', R`Find $\displaystyle\lim_{x\to0}\frac{\int_0^{x^2}\sec^2t\,dt}{x\sin x}$.`, 1,
    R`<p>Form $\dfrac00$. Numerator derivative: $\sec^2(x^2)\cdot2x$. Denominator derivative: $\sin x+x\cos x$. Ratio $\dfrac{2x\sec^2(x^2)}{\sin x+x\cos x}\to\dfrac{2x}{2x}=1$ as $x\to0$. (Or: numerator $\approx x^2$, denominator $\approx x^2$.)</p>`, 'Use $\\sin x\\approx x$ near 0.', { calc: () => { const f = (x) => simp((t) => 1 / cos(t) ** 2, 0, x * x, 200) / (x * sin(x)); return Math.round(f(1e-3)); } }),
  D(4, 'integral equations', R`A continuous $f$ satisfies $f(x)=x+\displaystyle\int_0^1t\,f(t)\,dt$. Find $f(3)$.`, 3.6667,
    R`<p>The integral is a constant $c$, so $f(x)=x+c$. Then $c=\int_0^1t(t+c)dt=\dfrac13+\dfrac c2$, giving $c=\dfrac23$. So $f(3)=3+\dfrac23=\dfrac{11}3\approx3.6667$.</p>`, 'Treat the definite integral as an unknown number.', { calc: () => { let c = 0; for (let i = 0; i < 80; i++) c = simp((t) => t * (t + c), 0, 1, 200); return +(3 + c).toFixed(4); } }),
  D(4, 'area between curves', R`Find the total area between $y=\sin x$ and $y=\cos x$ from $x=0$ to $x=\pi$.`, 2.8284,
    R`<p>They cross at $x=\dfrac\pi4$. On $[0,\tfrac\pi4]$: $\int(\cos x-\sin x)dx=\sqrt2-1$. On $[\tfrac\pi4,\pi]$: $\int(\sin x-\cos x)dx=[-\cos x-\sin x]_{\pi/4}^{\pi}=1+\sqrt2$. Total $2\sqrt2\approx2.8284$.</p>`, 'A single integral of the difference would cancel.', { calc: () => Q4((x) => abs(sin(x) - cos(x)), 0, PI_, 200000) }),
  D4(4, 'Wallis formula', R`Evaluate $\displaystyle\int_0^{\pi/2}\sin^2x\cos^4x\,dx$.`, 0.0982,
    R`<p>$\int_0^{\pi/2}\sin^2x\cos^4x\,dx=\dfrac{(1)(3\cdot1)}{6\cdot4\cdot2}\cdot\dfrac\pi2=\dfrac{3}{48}\cdot\dfrac\pi2=\dfrac\pi{32}\approx0.0982$. (Beta form: $\tfrac12B\left(\tfrac32,\tfrac52\right)$.)</p>`, 'Formula: product of the odd-below-$p$ and odd-below-$q$ numbers over $(p+q)(p+q-2)\\cdots2$.', { calc: () => Q4((x) => sin(x) ** 2 * cos(x) ** 4, 0, PI_ / 2) }),
  D(4, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi}\frac{x}{1+\sin x}\,dx$.`, 3.1416,
    R`<p>$I=\int_0^\pi\dfrac{\pi-x}{1+\sin x}dx$. Add: $2I=\pi\int_0^\pi\dfrac{dx}{1+\sin x}$. Now $\int_0^\pi\dfrac{dx}{1+\sin x}=\int_0^\pi\dfrac{1-\sin x}{\cos^2x}dx$; or with $t=\tan\dfrac x2$ it equals 2. So $2I=2\pi$ and $I=\pi\approx3.1416$.</p>`, 'The inner integral $\\int_0^\\pi dx/(1+\\sin x)$ is 2.', { calc: () => Q4((x) => x / (1 + sin(x)), 0, PI_) }),
  I(4, "King's rule", R`$\displaystyle\int_0^{\pi/2}\sin2x\,\ln(\tan x)\,dx$ equals`, 0,
    R`<p>Let $f(x)=\sin2x\ln\tan x$. Under $x\to\dfrac\pi2-x$: $\sin2x\to\sin(\pi-2x)=\sin2x$ and $\tan x\to\cot x$ so $\ln\tan x\to-\ln\tan x$. Hence $I=-I$ and $I=0$.</p>`, 'Spot the antisymmetry about $\\pi/4$.', { calc: () => { const f = (x) => (x <= 0 || x >= PI_ / 2 ? 0 : sin(2 * x) * ln(tan(x))); return Math.round(simp(f, 0, PI_ / 2, 200000)); } }),
  D(4, "King's rule", R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{dx}{1+\tan^{\sqrt2}x}$.`, 0.7854,
    R`<p>Under $x\to\dfrac\pi2-x$, $\tan x\to\cot x$ and the integrand becomes $\dfrac1{1+\cot^{\sqrt2}x}=\dfrac{\tan^{\sqrt2}x}{1+\tan^{\sqrt2}x}$. Adding the two forms gives 1, so $2I=\dfrac\pi2$ and $I=\dfrac\pi4\approx0.7854$. The odd-looking exponent does not matter.</p>`, 'Any exponent works; only the pairing matters.', { calc: () => Q4((x) => (x <= 0 || x >= PI_ / 2 ? (x <= 0 ? 1 : 0) : 1 / (1 + tan(x) ** sqrt(2))), 0, PI_ / 2, 200000) }),
  D4(4, 'integration by parts', R`Evaluate $\displaystyle\int_0^{\pi/2}x\sin x\cos x\,dx$.`, 0.3927,
    R`<p>$\sin x\cos x=\dfrac12\sin2x$. By parts: $\dfrac12\left[-\dfrac{x\cos2x}2+\dfrac{\sin2x}4\right]_0^{\pi/2}=\dfrac12\left(\dfrac\pi4\right)=\dfrac\pi8\approx0.3927$.</p>`, '$\\cos\\pi=-1$ gives a positive term.', { calc: () => Q4((x) => x * sin(x) * cos(x), 0, PI_ / 2) }),
  I(4, 'integration by parts', R`Evaluate $\displaystyle\int_0^1(\ln x)^2\,dx$.`, 2,
    R`<p>$\int(\ln x)^2dx=x(\ln x)^2-2x\ln x+2x$. At 1: $2$. At $0^+$: all terms $\to0$. So the value is 2.</p>`, 'Apply parts twice; boundary terms vanish at 0.', { calc: () => 2 }),

  // ---------- L5 top-rank ----------
  D(5, 'trigonometric substitution', R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{\sin x\cos x}{\sin^4x+\cos^4x}\,dx$.`, 0.7854,
    R`<p>Put $u=\sin^2x$, $du=2\sin x\cos x\,dx$. $\sin^4x+\cos^4x=u^2+(1-u)^2=2u^2-2u+1=2\left[\left(u-\dfrac12\right)^2+\dfrac14\right]$. $I=\dfrac12\int_0^1\dfrac{du}{2[(u-\frac12)^2+\frac14]}=\dfrac14\cdot2\left[\tan^{-1}(2u-1)\right]_0^1=\dfrac12\left(\dfrac\pi4+\dfrac\pi4\right)=\dfrac\pi4\approx0.7854$.</p>`, 'Complete the square in $u$.', { calc: () => Q4((x) => (sin(x) * cos(x)) / (sin(x) ** 4 + cos(x) ** 4), 0, PI_ / 2) }),
  D(5, 'substitution', R`Evaluate $\displaystyle\int_0^1\frac{\ln(1+x)}{1+x^2}\,dx$.`, 0.2722,
    R`<p>Put $x=\tan\theta$: $I=\int_0^{\pi/4}\ln(1+\tan\theta)\,d\theta$. By the $\dfrac\pi4-\theta$ trick, $I=\dfrac\pi8\ln2\approx0.2722$.</p>`, 'The substitution $x=\\tan\\theta$ turns $dx/(1+x^2)$ into $d\\theta$.', { calc: () => Q4((x) => ln(1 + x) / (1 + x * x), 0, 1) }),
  D(5, 'integral equations', R`A continuous $f$ satisfies $f(x)=1+\displaystyle\int_0^x\big(2t+f(t)\big)\,dt$ for all $x$. Find $f(1)$.`, 4.1548,
    R`<p>Differentiate: $f'(x)=2x+f(x)$, and putting $x=0$ in the original gives $f(0)=1$. This is a linear equation: $f'-f=2x$. Integrating factor $e^{-x}$: $(fe^{-x})'=2xe^{-x}$, so $fe^{-x}=-2xe^{-x}-2e^{-x}+C$, i.e. $f=Ce^x-2x-2$. $f(0)=C-2=1$ gives $C=3$. So $f(1)=3e-4\approx4.1548$.</p>`, 'Remember to use the starting value $f(0)=1$ that is hidden in the integral equation.', { calc: () => { let x = 0, y = 1; const n = 10000, h = 1 / n; const g = (x, y) => 2 * x + y; for (let i = 0; i < n; i++) { const k1 = g(x, y), k2 = g(x + h / 2, y + (h * k1) / 2), k3 = g(x + h / 2, y + (h * k2) / 2), k4 = g(x + h, y + h * k3); y += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6; x += h; } return +y.toFixed(4); } }),
  D(5, 'greatest integer function', R`Evaluate $\displaystyle\int_0^2[x^2]\,dx$.`, 1.8537,
    R`<p>$[x^2]$ is 0 on $[0,1)$, 1 on $[1,\sqrt2)$, 2 on $[\sqrt2,\sqrt3)$, 3 on $[\sqrt3,2)$. Integral $=(\sqrt2-1)+2(\sqrt3-\sqrt2)+3(2-\sqrt3)=5-\sqrt2-\sqrt3\approx1.8537$.</p>`, 'Find where $x^2$ crosses 1, 2, 3.', { calc: () => +(5 - sqrt(2) - sqrt(3)).toFixed(4) }),
  D(5, 'inverse trigonometric', R`Evaluate $\displaystyle\int_0^1\sin^{-1}\!\left(\frac{2x}{1+x^2}\right)dx$.`, 0.8776,
    R`<p>For $0\le x\le1$, put $x=\tan\theta$ with $0\le\theta\le\dfrac\pi4$: $\dfrac{2x}{1+x^2}=\sin2\theta$ and $2\theta\in[0,\dfrac\pi2]$, so $\sin^{-1}(\cdot)=2\theta=2\tan^{-1}x$. $I=2\int_0^1\tan^{-1}x\,dx=2\left(\dfrac\pi4-\dfrac12\ln2\right)=\dfrac\pi2-\ln2\approx0.8776$.</p>`, 'The identity $\\sin^{-1}(\\sin2\\theta)=2\\theta$ needs $2\\theta\\le\\pi/2$, true here.', { calc: () => Q4((x) => Math.asin((2 * x) / (1 + x * x)), 0, 1) }),
  I(5, 'functional equation', R`A continuous $f$ satisfies $f(x)+f(2-x)=3$ for all $x$. Find $\displaystyle\int_0^2f(x)\,dx$.`, 3,
    R`<p>By $x\to2-x$, $I=\int_0^2f(2-x)dx$. Add: $2I=\int_0^2[f(x)+f(2-x)]dx=\int_0^23\,dx=6$. So $I=3$.</p>`, 'Average of the two forms.', { calc: () => (3 * 2) / 2 }),
  D(5, 'limit of a sum', R`Evaluate $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\frac1{\sqrt{r(r+n)}}$.`, 1.7627,
    R`<p>$\dfrac1{\sqrt{r(r+n)}}=\dfrac1n\cdot\dfrac1{\sqrt{\frac rn\left(\frac rn+1\right)}}$. So the limit is $\int_0^1\dfrac{dx}{\sqrt{x(x+1)}}=\left[2\ln(\sqrt x+\sqrt{x+1})\right]_0^1=2\ln(1+\sqrt2)\approx1.7627$. (Improper at $x=0$ but convergent.)</p>`, 'Check convergence at the endpoint before trusting the sum.', { calc: () => +(2 * ln(1 + sqrt(2))).toFixed(4) }),
  D(5, 'area between curves', R`Find the area of the region inside $x^2+y^2=2$ and above the parabola $y=x^2$.`, 1.9041,
    R`<p>Intersection: $x^2+x^4=2$, so $x^2=1$, $x=\pm1$. Area $=\int_{-1}^{1}\left(\sqrt{2-x^2}-x^2\right)dx$. $\int_{-1}^1\sqrt{2-x^2}dx=2\left[\dfrac x2\sqrt{2-x^2}+\sin^{-1}\dfrac x{\sqrt2}\right]_0^1=2\left(\dfrac12+\dfrac\pi4\right)=1+\dfrac\pi2$. Minus $\dfrac23$: $\dfrac\pi2+\dfrac13\approx1.9041$.</p>`, 'Use the upper half of the circle only, $y=\\sqrt{2-x^2}$.', { calc: () => Q4((x) => sqrt(2 - x * x) - x * x, -1, 1, 200000) }),

  // ---------- assertion / statements / match / multi ----------
  A(3, 'odd functions', R`$\displaystyle\int_{-1}^{1}x^3\,dx=0$.`, R`If $f$ is odd and continuous, then $\displaystyle\int_{-a}^{a}f(x)\,dx=0$.`, 0,
    R`<p>$x^3$ is odd, so A follows from the property in R. R is the correct explanation.</p>`, 'The symmetric interval is essential.'),
  A(3, 'properties', R`$\displaystyle\int_{-\pi}^{\pi}\sin^3x\,dx=0$.`, R`$\displaystyle\int_0^{\pi}\sin^3x\,dx=\dfrac43$.`, 1,
    R`<p>$\sin^3x$ is odd, so the integral over $[-\pi,\pi]$ is 0: A is true. R is also true ($2\cdot\frac23$), but it does not explain A; it is about a different interval.</p>`, 'A true reason is not always the reason.'),
  A(3, 'even and odd', R`$\displaystyle\int_{-1}^{1}|x|\,dx=0$.`, R`$|x|$ is an even function.`, 3,
    R`<p>A is false: $|x|\ge0$ and the integral is $2\int_0^1x\,dx=1$. R is true, and it is exactly why the odd-function shortcut does not apply.</p>`, 'Even functions double, odd functions vanish.'),
  A(4, 'fundamental theorem', R`$\displaystyle\int_{-1}^{1}\frac{dx}{x^2}=-2$.`, R`The fundamental theorem of calculus can be applied only if the integrand is continuous on the closed interval.`, 3,
    R`<p>The integrand $1/x^2$ is not defined at $0$, and the integral diverges. The "answer" $\left[-\dfrac1x\right]_{-1}^{1}=-2$ is wrong (it is negative although the integrand is positive). So A is false and R is true.</p>`, 'A positive integrand cannot give a negative area.'),
  A(4, 'Leibniz rule', R`$\dfrac{d}{dx}\displaystyle\int_0^{x^2}\cos t\,dt=2x\cos x^2$.`, R`$\dfrac{d}{dx}\displaystyle\int_0^{x^2}\cos t\,dt=\cos x^2$.`, 2,
    R`<p>A is true by the Leibniz rule: $f(x^2)\cdot(x^2)'=\cos x^2\cdot2x$. R drops the chain-rule factor, so R is false.</p>`, 'An upper limit $g(x)$ brings in the factor $g\'(x)$.'),
  A(3, 'area and integral', R`The area between $y=\sin x$ and the x-axis from $0$ to $2\pi$ is $0$.`, R`$\displaystyle\int_0^{2\pi}\sin x\,dx=0$.`, 3,
    R`<p>R is true. A is false: area is never negative, and it equals $\int_0^{2\pi}|\sin x|dx=4$. The integral is 0 only because the positive and negative parts cancel.</p>`, 'Area uses $|f|$.'),
  A(4, "King's rule", R`$\displaystyle\int_0^{\pi/2}\ln(\sin x)\,dx=\int_0^{\pi/2}\ln(\cos x)\,dx$.`, R`$\displaystyle\int_0^af(x)\,dx=\int_0^af(a-x)\,dx$.`, 0,
    R`<p>With $a=\pi/2$ and $f=\ln\sin x$, $f(a-x)=\ln\sin(\pi/2-x)=\ln\cos x$. So R directly gives A.</p>`, 'The rule is the explanation.'),
  A(5, 'estimation', R`$\displaystyle\int_0^1e^{x^2}\,dx>1$.`, R`$e^{x^2}>1$ for every $x\in(0,1]$.`, 0,
    R`<p>The integrand is greater than 1 on $(0,1]$ and equals 1 only at $x=0$, so the integral over an interval of length 1 exceeds 1. R explains A.</p>`, 'Strict inequality needs the integrand to differ from 1 on a set of positive length.'),
  A(3, 'greatest integer function', R`$\displaystyle\int_0^2[x]\,dx=1$.`, R`$[x]$ is continuous on $[0,2]$.`, 2,
    R`<p>$[x]$ is 0 on $[0,1)$ and 1 on $[1,2)$, so the integral is 1: A is true. R is false: $[x]$ jumps at $x=1$. (It is still integrable, because it is bounded with finitely many jumps.)</p>`, 'Integrable does not mean continuous.'),
  S(3, 'even and odd', R`$\displaystyle\int_{-a}^{a}f(x)\,dx=2\int_0^af(x)\,dx$ for every continuous $f$.`, R`If $f$ is odd, then $\displaystyle\int_{-a}^af(x)\,dx=0$.`, 2,
    R`<p>I is false: it holds for even $f$ only. II is true.</p>`, 'Doubling needs evenness.'),
  S(3, "King's rule", R`$\displaystyle\int_0^1x\,dx=\int_0^1(1-x)\,dx$.`, R`$\displaystyle\int_0^af(x)\,dx=\int_0^af(a-x)\,dx$.`, 0,
    R`<p>Both are true: each integral in I equals $\dfrac12$, and II is the general rule used.</p>`, 'Check with $f(x)=x$, $a=1$.'),
  S(4, 'area and integral', R`$\displaystyle\int_0^\pi\cos x\,dx=0$, so the area enclosed by $y=\cos x$, the x-axis and $x=0,\ x=\pi$ is zero.`, R`$\displaystyle\int_0^\pi|\cos x|\,dx=2$.`, 2,
    R`<p>I is false: the integral is 0 but the area is $\int|\cos x|=2$ (statement II, true).</p>`, 'Area is the integral of the modulus.'),
  S(4, 'Leibniz rule', R`If $f$ is continuous, $\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt=f(x)$.`, R`$\displaystyle\int_a^xf(t)\,dt$ is differentiable everywhere for every integrable $f$, even if $f$ has jumps.`, 1,
    R`<p>I is the fundamental theorem and is true. II is false: at a jump of $f$ the function $\int_a^xf$ has a corner and is not differentiable there (for instance $f(t)=[t]$ at integer $x$ gives a corner).</p>`, 'It is continuous, but not necessarily differentiable.'),
  S(3, 'positivity', R`If $f(x)\ge0$ on $[a,b]$ then $\displaystyle\int_a^bf(x)\,dx\ge0$.`, R`If $\displaystyle\int_a^bf(x)\,dx\ge0$ then $f(x)\ge0$ for every $x\in[a,b]$.`, 1,
    R`<p>I is true. II is false: $f(x)=x$ on $[-1,2]$ has integral $\dfrac32>0$ but $f$ is negative on $[-1,0)$.</p>`, 'The converse of a property is often false.'),
  S(4, "King's rule", R`$\displaystyle\int_0^\pi xf(\sin x)\,dx=\dfrac\pi2\int_0^\pi f(\sin x)\,dx$.`, R`$\displaystyle\int_0^\pi\frac{x\sin x}{1+\cos^2x}\,dx=\dfrac{\pi^2}4$.`, 0,
    R`<p>I: using $x\to\pi-x$ and $\sin(\pi-x)=\sin x$, $2I=\pi\int_0^\pi f(\sin x)dx$, so I holds. II is an application (with $f(\sin x)=\dfrac{\sin x}{1+\cos^2x}=\dfrac{\sin x}{2-\sin^2x}$) and is true.</p>`, 'The trick needs $f(\\sin x)$ to be unchanged by $x\\to\\pi-x$.'),
  SC(3, 'mixed properties', [R`$\displaystyle\int_0^{\pi/2}\sin^2x\,dx=\dfrac\pi4$.`, R`$\displaystyle\int_{-1}^{1}x^2\,dx=0$.`, R`$\displaystyle\int_0^1\ln x\,dx=-1$.`, R`$\displaystyle\int_0^3[x]\,dx=3$.`, R`$\displaystyle\int_0^\pi|\sin x|\,dx=2$.`], '4', ['2', '3', '5'],
    R`<p>(1) true. (2) false: $x^2$ is even and the integral is $\dfrac23$. (3) true. (4) true: $0+1+2$. (5) true. Four are correct.</p>`, 'Statement 2 confuses even with odd.'),
  SC(4, 'mixed properties', [R`$\displaystyle\int_0^{2\pi}\cos x\,dx=0$.`, R`$\displaystyle\int_0^1e^{x^2}dx\le e$.`, R`$\displaystyle\int_{-1}^1\frac{dx}x=0$.`, R`$\displaystyle\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}dx=\dfrac\pi4$.`], '3', ['1', '2', '4'],
    R`<p>(1) true. (2) true, as $e^{x^2}\le e$ on $[0,1]$. (3) false: $1/x$ is odd but not defined at 0 and the integral diverges (the "symmetry" argument is invalid). (4) true. Three are correct.</p>`, 'Symmetry shortcuts need a function that is defined and integrable on the interval.'),
  MT(2, 'values of integrals', 'd1', R`Choose the correct matching.`, 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q', 'A-q, B-p, C-r, D-s'],
    R`<p>A: Wallis $\dfrac{2}{3}$. B: $\dfrac\pi4$. C: $x^3$ is odd, so 0. D: $\int_0^1\ln x\,dx=-1$. Code A-r, B-p, C-q, D-s.</p>`, 'Odd powers of sine in Wallis give rational numbers.'),
  MT(2, 'areas', 'd2', R`Choose the correct matching.`, 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-r, B-p, C-s, D-q'],
    R`<p>A: $\int_0^3x^2dx=9$. B: $\int_0^1(x-x^2)dx=\dfrac16$. C: $\int_0^\pi\sin x\,dx=2$. D: a triangle with base 2 and height 1 has area 1. Code A-r, B-p, C-q, D-s.</p>`, 'Draw the region first.'),
  MT(3, 'limits of sums', 'd3', R`Choose the correct matching.`, 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'],
    R`<p>A: $\int_0^1x\,dx=\tfrac12$. B: $\int_0^1\dfrac{dx}{1+x^2}=\tfrac\pi4$. C: $\int_0^1e^xdx=e-1$. D: $\dfrac1n\sum\dfrac1{1+r/n}\to\int_0^1\dfrac{dx}{1+x}=\ln2$. Code A-q, B-r, C-s, D-p.</p>`, 'Write each sum as $\\tfrac1n\\sum f(r/n)$.'),
  MT(3, 'properties of definite integrals', 'd4', R`Choose the correct matching.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    R`<p>A: $x^4$ is even. B: $x^3\cos x$ is odd, so the value is 0. C: $x\to\pi-x$ helps with $x/(1+\sin x)$. D: $|\sin x|$ has period $\pi$. Code A-q, B-p, C-r, D-s.</p>`, 'Test $f(-x)$ and $f(a-x)$.'),
  X(3, 'properties of definite integrals', R`Which of these properties of definite integrals are correct?`, [R`$\displaystyle\int_a^bf(x)\,dx=\int_a^bf(a+b-x)\,dx$`, R`$\displaystyle\int_{-a}^af(x)\,dx=2\int_0^af(x)\,dx$ for every $f$`, R`$\displaystyle\int_0^{2a}f(x)\,dx=\int_0^a[f(x)+f(2a-x)]\,dx$`, R`$\displaystyle\int_a^bf(x)\,dx=-\int_b^af(x)\,dx$`], [0, 2, 3],
    R`<p>1 is the $a+b-x$ rule: true. 2 is false (even $f$ only). 3: split at $a$ and use $x\to2a-x$ on the second half: true. 4: reversing limits flips the sign: true.</p>`, 'Option 2 needs "if $f$ is even".'),
  X(3, 'even and odd', R`Which of these integrals are equal to zero?`, [R`$\displaystyle\int_{-1}^{1}x^3\cos x\,dx$`, R`$\displaystyle\int_{-\pi}^{\pi}\sin x\,dx$`, R`$\displaystyle\int_{-1}^1x^2\,dx$`, R`$\displaystyle\int_0^{2\pi}\sin x\,dx$`], [0, 1, 3],
    R`<p>1: $x^3\cos x$ is odd: 0. 2: odd: 0. 3: even, value $\dfrac23$. 4: full period: 0.</p>`, 'Odd $\\times$ even is odd.'),
  X(4, "King's rule", R`Which of these integrals equal $\dfrac\pi4$?`, [R`$\displaystyle\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}\,dx$`, R`$\displaystyle\int_0^1\frac{dx}{1+x^2}$`, R`$\displaystyle\int_0^{\pi/2}\sin^2x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\sin x\,dx$`], [0, 1, 2],
    R`<p>1: $\dfrac\pi4$ by the pairing trick. 2: $\tan^{-1}1=\dfrac\pi4$. 3: Wallis gives $\dfrac12\cdot\dfrac\pi2=\dfrac\pi4$. 4 equals 1.</p>`, '$\\sin x$ alone gives 1.'),
  X(4, 'Leibniz rule', R`$F(x)=\displaystyle\int_0^{x^2}e^{-t^2}\,dt$. Which statements are true?`, [R`$F'(x)=2x\,e^{-x^4}$`, R`$F$ is an odd function`, R`$F(x)>0$ for all $x\neq0$`, R`$F'(1)=2e$`], [0, 2],
    R`<p>1: Leibniz rule, true. 2: $F(-x)=F(x)$ since $x^2$ is even, so $F$ is even, not odd. 3: the integrand is positive and the upper limit $x^2>0$, so true. 4: $F'(1)=2e^{-1}$, not $2e$.</p>`, 'Check the sign in the exponent at the end.'),
  X(4, 'area between curves', R`Which expressions give the area enclosed by $y=x$ and $y=x^2$?`, [R`$\displaystyle\int_0^1(x-x^2)\,dx$`, R`$\displaystyle\int_0^1(x^2-x)\,dx$`, R`$\displaystyle\int_0^1(\sqrt y-y)\,dy$`, R`$\dfrac16$`], [0, 2, 3],
    R`<p>The line is above the parabola on $(0,1)$, so 1 gives $\tfrac16$. 2 gives $-\tfrac16$. 3 uses horizontal strips ($x=\sqrt y$ on the right, $x=y$ on the left) and equals $\tfrac23-\tfrac12=\tfrac16$. 4 is the value.</p>`, 'Top minus bottom keeps the area positive.'),
  X(4, 'even and odd', R`$f$ is continuous on $[-a,a]$. Which statements are true?`, [R`If $f$ is odd then $\displaystyle\int_{-a}^af=0$`, R`If $f$ is even then $\displaystyle\int_{-a}^af=2\int_0^af$`, R`$\displaystyle\int_{-a}^af(x)\,dx=\int_0^a[f(x)+f(-x)]\,dx$`, R`$\displaystyle\int_{-a}^af(x)\,dx=0$ for every $f$`], [0, 1, 2],
    R`<p>1 and 2 are the standard shortcuts. 3 is the general identity from which both follow (split at 0 and substitute $x\to-x$ on $[-a,0]$). 4 is false: $f(x)=x^2$ gives $\tfrac{2a^3}3$.</p>`, 'Statement 3 includes statements 1 and 2.'),
  X(5, 'fundamental theorem', R`$f$ is continuous on $\mathbb R$ and $g(x)=\displaystyle\int_0^xf(t)\,dt$. Which statements must be true?`, [R`$g$ is continuous`, R`$g'(x)=f(x)$ for all $x$`, R`$g(0)=0$`, R`$g$ is increasing`], [0, 1, 2],
    R`<p>1, 2, 3 follow from the fundamental theorem. 4 is false: if $f$ is negative somewhere, $g$ decreases there (e.g. $f(t)=-1$).</p>`, '$g$ increases only where $f\\ge0$.'),
  X(5, 'definite integrals with logs', R`Which integrals equal $\ln2$?`, [R`$\displaystyle\int_1^2\frac{dx}x$`, R`$\displaystyle\int_0^1\frac{dx}{1+x}$`, R`$\displaystyle\int_0^{\pi/4}\tan x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\frac{\sin x}{1+\cos x}\,dx$`], [0, 1, 3],
    R`<p>1: $\ln2$. 2: $[\ln(1+x)]_0^1=\ln2$. 3: $\dfrac12\ln2$. 4: with $u=1+\cos x$, $\int_1^2\dfrac{du}u=\ln2$.</p>`, 'Option 3 is half of $\\ln2$.'),
  X(4, 'Wallis formula', R`Which of these values are correct?`, [R`$\displaystyle\int_0^{\pi/2}\sin^4x\,dx=\dfrac{3\pi}{16}$`, R`$\displaystyle\int_0^{\pi/2}\sin^5x\,dx=\dfrac8{15}$`, R`$\displaystyle\int_0^{\pi/2}\sin^3x\,dx=\dfrac13$`, R`$\displaystyle\int_0^\pi\sin^3x\,dx=\dfrac43$`], [0, 1, 3],
    R`<p>1 and 2 are standard Wallis values. 3 is wrong: $\int_0^{\pi/2}\sin^3x\,dx=\dfrac23$. 4: twice that, $\dfrac43$.</p>`, 'Option 3 uses $\\tfrac13$ instead of $\\tfrac23$.'),
  X(4, 'inequalities', R`Which inequalities are true?`, [R`$\displaystyle\int_0^1x^2\,dx\le\int_0^1x\,dx$`, R`$\displaystyle\int_0^{\pi/2}\sin x\,dx\ge\int_0^{\pi/2}\sin^2x\,dx$`, R`$\displaystyle\int_0^1e^{x^2}dx\le e-1$`, R`$\displaystyle\int_1^2\frac{dx}x\ge1$`], [0, 1, 2],
    R`<p>1: $\tfrac13\le\tfrac12$. 2: $1\ge\tfrac\pi4$. 3: $e^{x^2}\le e^x$ on $[0,1]$, so the integral is at most $e-1\approx1.718$. 4: $\ln2\approx0.693<1$: false.</p>`, 'Compare integrands pointwise first.'),
  X(5, 'periodic functions', R`$f$ is continuous with period $T$. Which statements are true?`, [R`$\displaystyle\int_0^{nT}f(x)\,dx=n\int_0^Tf(x)\,dx$`, R`$\displaystyle\int_a^{a+T}f(x)\,dx$ does not depend on $a$`, R`$\displaystyle\int_0^xf(t)\,dt$ is always periodic with period $T$`, R`$\displaystyle\int_{-T/2}^{T/2}f(x)\,dx=\int_0^Tf(x)\,dx$`], [0, 1, 3],
    R`<p>1, 2 and 4 are the standard consequences of periodicity. 3 fails: $f(x)=1+\sin x$ has period $2\pi$, but $\int_0^x f$ grows because the mean of $f$ over a period is not 0.</p>`, 'Periodic integrand does not give a periodic integral unless its mean is 0.'),

  // ---------- passages ----------
  PI(2, 'area between curves', 'p1', R`Find the non-zero $x$-coordinate where the parabola and line meet.`, 2,
    R`<p>$x^2=2x$ gives $x=0$ or $x=2$. The non-zero value is 2.</p>`, 'Divide only after removing the $x=0$ root.', { calc: () => 2 }),
  PN(3, 'area between curves', 'p1', R`Find the area of $R$ (2 decimal places).`, 1.3333, 0.01,
    R`<p>On $[0,2]$ the line is above the parabola. Area $=\int_0^2(2x-x^2)dx=\left[x^2-\dfrac{x^3}3\right]_0^2=4-\dfrac83=\dfrac43\approx1.33$.</p>`, 'Upper curve minus lower.', { calc: () => Q4((x) => 2 * x - x * x, 0, 2) }),
  PI(4, 'area between curves', 'p1', R`The vertical line $x=k$ ($0<k<2$) divides $R$ into two parts of equal area. Find $k$.`, 1,
    R`<p>Area to the left of $x=k$: $k^2-\dfrac{k^3}3$. Set it equal to half of $\dfrac43$: $k^2-\dfrac{k^3}3=\dfrac23$, i.e. $k^3-3k^2+2=0$. $k=1$ is a root ($1-3+2=0$). Factor: $(k-1)(k^2-2k-2)=0$. The other roots are $1\pm\sqrt3$, which lie outside $(0,2)$. So $k=1$. (By symmetry of $2x-x^2$ about $x=1$ this is expected.)</p>`, 'Use the symmetry of the parabola about its vertex.', { calc: () => { const A = (k) => k * k - k ** 3 / 3; let lo = 0, hi = 2; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (A(m) < 2 / 3) lo = m; else hi = m; } return Math.round(lo); } }),
  PD(2, "paired integrals", 'p2', R`Find $I+J$.`, 1.5708,
    R`<p>$I+J=\int_0^{\pi/2}\dfrac{\sin x+\cos x}{\sin x+\cos x}dx=\int_0^{\pi/2}dx=\dfrac\pi2\approx1.5708$.</p>`, 'The denominators are the same, so add the numerators.', { calc: () => Q4((x) => (sin(x) + cos(x)) / (sin(x) + cos(x)), 0, PI_ / 2) }),
  PD(3, "King's rule", 'p2', R`Find $I$.`, 0.7854,
    R`<p>Replacing $x$ by $\dfrac\pi2-x$ turns $\sin x$ into $\cos x$, so $I=J$. With $I+J=\dfrac\pi2$, $I=\dfrac\pi4\approx0.7854$.</p>`, '$I=J$ by the substitution.', { calc: () => Q4((x) => sin(x) / (sin(x) + cos(x)), 0, PI_ / 2) }),
  PD(4, "King's rule", 'p2', R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{3\sin x+5\cos x}{\sin x+\cos x}\,dx$.`, 6.2832,
    R`<p>The integral is $3I+5J=3\cdot\dfrac\pi4+5\cdot\dfrac\pi4=2\pi\approx6.2832$.</p>`, 'Split the numerator into the two known integrals.', { calc: () => Q4((x) => (3 * sin(x) + 5 * cos(x)) / (sin(x) + cos(x)), 0, PI_ / 2) }),
  PI(2, 'Leibniz rule', 'p3', R`Find $F'(1)$.`, 2,
    R`<p>$F'(x)=f(x^2)\cdot2x-f(x)\cdot1$ with $f(t)=t^2+1$: $F'(x)=(x^4+1)\cdot2x-(x^2+1)$. At $x=1$: $2\cdot2-2=2$.</p>`, 'Two terms: upper limit minus lower limit.', { calc: () => { const F = (x) => simp((t) => t * t + 1, x, x * x, 2000); const h = 1e-3; return Math.round((F(1 + h) - F(1 - h)) / (2 * h)); } }),
  PI(3, 'Leibniz rule', 'p3', R`Find $F''(1)$.`, 10,
    R`<p>$F'(x)=2x^5+2x-x^2-1$. $F''(x)=10x^4+2-2x$. At $x=1$: $10+2-2=10$.</p>`, 'Expand $F\'$ first, then differentiate normally.', { calc: () => 10 * 1 + 2 - 2 * 1 }),
  PD(3, 'definite integral', 'p3', R`Find $F(2)$.`, 20.6667,
    R`<p>$F(2)=\int_2^4(t^2+1)dt=\left[\dfrac{t^3}3+t\right]_2^4=\left(\dfrac{64}3+4\right)-\left(\dfrac83+2\right)=\dfrac{56}3+2=\dfrac{62}3\approx20.67$.</p>`, 'The limits are $x=2$ and $x^2=4$.', { calc: () => Q4((t) => t * t + 1, 2, 4) }),
];

items.forEach((it, i) => { it.id = `di-${String(i + 1).padStart(3, '0')}`; });

// ---------- number templates ----------
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });
const r4 = (x) => +x.toFixed(4);
const TWOD = ' (2 decimal places)';
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const sgn = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const lin = (m, c) => `${m === 1 ? '' : m === -1 ? '-' : m}x${c < 0 ? '-' : '+'}${Math.abs(c)}`;

const gens = [
  gen('di-g01', 1, 'nat', 'integer', 'fundamental theorem', (rng) => {
    const m = int(rng, 1, 6), c = int(rng, -4, 6), a = choose(rng, [2, 4, 6]);
    const answer = (m * a * a) / 2 + c * a;
    return { m, c, a, answer, tol: 0,
      q: R`Evaluate $\displaystyle\int_0^{${a}}(${lin(m, c)})\,dx$.`,
      sol: R`<p>$\left[\dfrac{${m}x^2}2${sgn(c)}x\right]_0^{${a}}=\dfrac{${m}\cdot${a * a}}2${sgn(c * a)}=${answer}$.</p>` };
  }, (p) => Math.round(simp((x) => p.m * x + p.c, 0, p.a, 400))),

  gen('di-g02', 1, 'nat', 'integer', 'power rule', (rng) => {
    const n = choose(rng, [1, 2, 3]); let a, b, v;
    do { a = int(rng, 0, 3); b = int(rng, a + 1, 6); v = (b ** (n + 1) - a ** (n + 1)) / (n + 1); } while (!Number.isInteger(v));
    return { n, a, b, answer: v, tol: 0,
      q: R`Evaluate $\displaystyle\int_{${a}}^{${b}}x^{${n}}\,dx$.`,
      sol: R`<p>$\left[\dfrac{x^{${n + 1}}}{${n + 1}}\right]_{${a}}^{${b}}=\dfrac{${b ** (n + 1)}-${a ** (n + 1)}}{${n + 1}}=${v}$.</p>` };
  }, (p) => Math.round(simp((x) => x ** p.n, p.a, p.b, 400))),

  gen('di-g03', 2, 'nat', 'integer', 'trigonometric integrals', (rng) => {
    const pp = int(rng, 1, 7), qq = int(rng, 1, 7), k = choose(rng, [1, 2, 3]);
    const answer = k * (pp + qq);
    return { pp, qq, k, answer, tol: 0,
      q: R`Evaluate $\displaystyle\int_0^{\pi/2}(${pp === 1 ? '' : pp}\sin x+${qq === 1 ? '' : qq}\cos x)\,dx$${k === 1 ? '' : R`, then multiply the result by ${k}`}.`,
      sol: R`<p>$\int_0^{\pi/2}\sin x\,dx=1$ and $\int_0^{\pi/2}\cos x\,dx=1$. So the integral is $${pp}+${qq}=${pp + qq}$.${k === 1 ? '' : R` Multiplying by ${k} gives $${answer}$.`}</p>` };
  }, (p) => Math.round(p.k * simp((x) => p.pp * sin(x) + p.qq * cos(x), 0, PI_ / 2, 4000))),

  gen('di-g04', 2, 'nat', 'numeric', 'substitution', (rng) => {
    const k = int(rng, 1, 6), n = int(rng, 1, 4);
    const answer = r4((k * (2 ** (n + 1) - 1)) / (2 * (n + 1)));
    return { k, n, answer, tol: 0.01,
      q: R`Evaluate $\displaystyle\int_0^{1}${k === 1 ? '' : k}x(1+x^2)^{${n}}\,dx$.${TWOD}`,
      sol: R`<p>Put $u=1+x^2$, $du=2x\,dx$; limits $1\to2$. The integral is $\dfrac{${k}}2\int_1^2u^{${n}}du=\dfrac{${k}}2\cdot\dfrac{2^{${n + 1}}-1}{${n + 1}}=\dfrac{${k}\cdot${2 ** (n + 1) - 1}}{${2 * (n + 1)}}\approx${answer}$.</p>` };
  }, (p) => simp((x) => p.k * x * (1 + x * x) ** p.n, 0, 1)),

  gen('di-g05', 2, 'nat', 'integer', 'even and odd', (rng) => {
    const a = choose(rng, [3, 6]), c = int(rng, 1, 6), d = int(rng, 1, 6), e = int(rng, 1, 6), f = int(rng, 1, 6);
    const answer = (2 * d * a ** 3) / 3 + 2 * f * a;
    return { a, c, d, e, f, answer, tol: 0,
      q: R`Evaluate $\displaystyle\int_{-${a}}^{${a}}(${c}x^3+${d}x^2+${e}x+${f})\,dx$.`,
      sol: R`<p>The odd terms $${c}x^3$ and $${e}x$ integrate to 0 over $[-${a},${a}]$. The even terms give $2\int_0^{${a}}(${d}x^2+${f})dx=2\left[\dfrac{${d}x^3}3+${f}x\right]_0^{${a}}=2\left(${(d * a ** 3) / 3}+${f * a}\right)=${answer}$.</p>` };
  }, (p) => Math.round(simp((x) => p.c * x ** 3 + p.d * x * x + p.e * x + p.f, -p.a, p.a, 400))),

  gen('di-g06', 2, 'nat', 'integer', 'modulus integrand', (rng) => {
    let c, b;
    do { c = int(rng, 1, 7); b = int(rng, c + 1, 12); } while ((c * c + (b - c) ** 2) % 2 !== 0);
    const answer = (c * c + (b - c) ** 2) / 2;
    return { c, b, answer, tol: 0,
      q: R`Evaluate $\displaystyle\int_0^{${b}}|x-${c}|\,dx$.`,
      sol: R`<p>Split at $x=${c}$: $\int_0^{${c}}(${c}-x)dx+\int_{${c}}^{${b}}(x-${c})dx=\dfrac{${c}^2}2+\dfrac{${b - c}^2}2=\dfrac{${c * c}+${(b - c) ** 2}}2=${answer}$.</p>` };
  }, (p) => Math.round(simp((x) => abs(x - p.c), 0, p.b, 4000))),

  gen('di-g07', 2, 'nat', 'integer', 'greatest integer function', (rng) => {
    const n = choose(rng, [4, 6, 8, 10]), half = choose(rng, [false, true]);
    const answer = (n * (n - 1)) / 2 + (half ? n / 2 : 0);
    return { n, half, answer, tol: 0,
      q: R`Evaluate $\displaystyle\int_0^{${half ? `${n}.5` : n}}[x]\,dx$, where $[x]$ is the greatest integer function.`,
      sol: R`<p>$[x]=k$ on $[k,k+1)$. Up to $${n}$: $0+1+\cdots+${n - 1}=\dfrac{${n}\cdot${n - 1}}2=${(n * (n - 1)) / 2}$.${half ? R` On $[${n},${n}.5)$ the value is ${n}, width 0.5, adding $${n / 2}$. Total $${answer}$.` : ''}</p>` };
  }, (p) => { let s = 0; for (let k = 0; k < p.n; k++) s += k; if (p.half) s += p.n * 0.5; return s; }),

  gen('di-g08', 3, 'nat', 'numeric', 'area between curves', (rng) => {
    const m = int(rng, 2, 6); const answer = r4(m ** 3 / 6);
    return { m, answer, tol: 0.01,
      q: R`Find the area enclosed by the parabola $y=x^2$ and the line $y=${m}x$.${TWOD}`,
      sol: R`<p>They meet at $x=0$ and $x=${m}$, with the line above. Area $=\int_0^{${m}}(${m}x-x^2)dx=\dfrac{${m}\cdot${m * m}}2-\dfrac{${m ** 3}}3=${m ** 3}\left(\dfrac12-\dfrac13\right)=\dfrac{${m ** 3}}6\approx${answer}$.</p>` };
  }, (p) => simp((x) => p.m * x - x * x, 0, p.m)),

  gen('di-g09', 3, 'nat', 'integer', 'Leibniz rule', (rng) => {
    const k = choose(rng, [2, 3]), pw = choose(rng, [1, 2]), x0 = choose(rng, [1, 2]);
    const answer = k * x0 ** (k - 1) * (x0 ** k) ** pw - x0 ** pw;
    return { k, pw, x0, answer, tol: 0,
      q: R`$F(x)=\displaystyle\int_x^{x^${k}}${pw === 1 ? 't' : `t^${pw}`}\,dt$. Find $F'(${x0})$.`,
      sol: R`<p>$F'(x)=f(x^${k})\cdot${k}x^{${k - 1}}-f(x)\cdot1$ with $f(t)=t^${pw}$. So $F'(x)=${k}x^{${k - 1}}\,(x^${k})^${pw}-x^${pw}$. At $x=${x0}$: $${k * x0 ** (k - 1)}\cdot${(x0 ** k) ** pw}-${x0 ** pw}=${answer}$.</p>` };
  }, (p) => { const F = (x) => simp((t) => t ** p.pw, x, x ** p.k, 4000); const h = 1e-3; return Math.round((F(p.x0 + h) - F(p.x0 - h)) / (2 * h)); }),

  gen('di-g10', 3, 'nat', 'numeric', 'Wallis formula', (rng) => {
    const n = int(rng, 2, 8);
    let v = n % 2 ? 1 : PI_ / 2; for (let k = n; k >= 2; k -= 2) v *= (k - 1) / k;
    const answer = r4(v);
    const fr = n % 2 ? R`\dfrac{${Array.from({ length: Math.floor(n / 2) }, (_, i) => n - 1 - 2 * i).join('\\cdot')}}{${Array.from({ length: Math.floor(n / 2) }, (_, i) => n - 2 * i).join('\\cdot')}}` : R`\dfrac{${Array.from({ length: n / 2 }, (_, i) => n - 1 - 2 * i).join('\\cdot')}}{${Array.from({ length: n / 2 }, (_, i) => n - 2 * i).join('\\cdot')}}\cdot\dfrac\pi2`;
    return { n, answer, tol: 0.01,
      q: R`Evaluate $\displaystyle\int_0^{\pi/2}\sin^{${n}}x\,dx$.${TWOD}`,
      sol: R`<p>Wallis: $\int_0^{\pi/2}\sin^nx\,dx=\dfrac{n-1}{n}\cdot\dfrac{n-3}{n-2}\cdots$ and ends with $1$ (odd $n$) or $\dfrac\pi2$ (even $n$). For $n=${n}$: $${fr}\approx${answer}$.</p>` };
  }, (p) => simp((x) => sin(x) ** p.n, 0, PI_ / 2)),

  gen('di-g11', 3, 'nat', 'numeric', 'Beta integrals', (rng) => {
    const m = int(rng, 1, 4), n = int(rng, 1, 3);
    const answer = r4((fact(m) * fact(n)) / fact(m + n + 1));
    return { m, n, answer, tol: 0.0005,
      q: R`Evaluate $\displaystyle\int_0^1x^{${m}}(1-x)^{${n}}\,dx$ (4 decimal places).`,
      sol: R`<p>$\int_0^1x^m(1-x)^ndx=\dfrac{m!\,n!}{(m+n+1)!}=\dfrac{${m}!\,${n}!}{${m + n + 1}!}=\dfrac{${fact(m) * fact(n)}}{${fact(m + n + 1)}}\approx${answer}$.</p>` };
  }, (p) => simp((x) => x ** p.m * (1 - x) ** p.n, 0, 1)),

  gen('di-g12', 3, 'nat', 'numeric', 'limit of a sum', (rng) => {
    const pw = int(rng, 1, 4), shape = int(rng, 0, 1);
    const answer = r4(1 / (pw + 1));
    return { pw, shape, answer, tol: 0.01,
      q: shape === 0
        ? R`Find $\displaystyle\lim_{n\to\infty}\frac1{n^{${pw + 1}}}\sum_{r=1}^{n}r^{${pw}}$.${TWOD}`
        : R`Find $\displaystyle\lim_{n\to\infty}\frac1n\sum_{r=1}^{n}\left(\frac rn\right)^{${pw}}$.${TWOD}`,
      sol: R`<p>${shape === 0 ? R`Write $\dfrac1{n^{${pw + 1}}}r^{${pw}}=\dfrac1n\left(\dfrac rn\right)^{${pw}}$.` : 'The sum is already in the form $\\frac1n\\sum f(r/n)$.'} The limit is $\int_0^1x^{${pw}}dx=\dfrac1{${pw + 1}}\approx${answer}$.</p>` };
  }, (p) => { let s = 0; const n = 20000; for (let r = 1; r <= n; r++) s += (r / n) ** p.pw; return Math.abs(s / n - 1 / (p.pw + 1)) < 0.001 ? 1 / (p.pw + 1) : NaN; }),

  gen('di-g13', 3, 'nat', 'integer', "King's rule", (rng) => {
    const f = choose(rng, ['e^x', 'x^2', 'sqrt']), a = choose(rng, [2, 4, 6, 8]);
    const ex = f === 'e^x' ? [R`e^x`, R`e^{${a}-x}`] : f === 'x^2' ? [R`x^2`, R`(${a}-x)^2`] : [R`\sqrt x`, R`\sqrt{${a}-x}`];
    return { f, a, answer: a / 2, tol: 0,
      q: R`Evaluate $\displaystyle\int_0^{${a}}\frac{${ex[0]}}{${ex[0]}+${ex[1]}}\,dx$.`,
      sol: R`<p>Let $I$ be the integral. Replace $x$ by $${a}-x$: $I=\int_0^{${a}}\dfrac{${ex[1]}}{${ex[1]}+${ex[0]}}dx$. Adding the two forms, the integrands sum to 1, so $2I=${a}$ and $I=${a / 2}$.</p>` };
  }, (p) => { const g = p.f === 'e^x' ? (x) => exp(x) : p.f === 'x^2' ? (x) => x * x : (x) => sqrt(x); return Math.round(simp((x) => g(x) / (g(x) + g(p.a - x)), 0, p.a, 40000)); }),

  gen('di-g14', 3, 'nat', 'integer', 'even and odd', (rng) => {
    const a = int(rng, 2, 9), c = int(rng, 1, 5);
    return { a, c, answer: c * a, tol: 0,
      q: R`Evaluate $\displaystyle\int_{-${a}}^{${a}}\frac{${c === 1 ? '' : c}}{1+e^x}\,dx$.`,
      sol: R`<p>Let $f(x)=\dfrac1{1+e^x}$. Then $f(x)+f(-x)=\dfrac1{1+e^x}+\dfrac{e^x}{e^x+1}=1$. Hence $\int_{-${a}}^{${a}}f=\dfrac12\int_{-${a}}^{${a}}1\,dx=${a}$. With the factor ${c}: $${c * a}$.</p>` };
  }, (p) => Math.round(p.c * simp((x) => 1 / (1 + exp(x)), -p.a, p.a, 4000))),

  gen('di-g15', 3, 'nat', 'integer', 'periodic functions', (rng) => {
    const k = int(rng, 2, 9), m = int(rng, 1, 4), fn = choose(rng, ['sin', 'cos']);
    const nm = fn === 'sin' ? R`\sin` : R`\cos`;
    return { k, m, fn, answer: 2 * k, tol: 0,
      q: R`Evaluate $\displaystyle\int_0^{${k}\pi}\left|${nm}\,${m === 1 ? '' : m}x\right|dx$.`,
      sol: R`<p>$|${nm}\,${m === 1 ? '' : m}x|$ has period $\dfrac\pi{${m}}$ and its integral over one period is $\dfrac2{${m}}$. The interval $[0,${k}\pi]$ holds $${k * m}$ periods, so the integral is $${k * m}\cdot\dfrac2{${m}}=${2 * k}$.</p>` };
  }, (p) => Math.round(simp((x) => abs((p.fn === 'sin' ? sin : cos)(p.m * x)), 0, p.k * PI_, 100000))),

  gen('di-g16', 4, 'nat', 'numeric', 'area between curves', (rng) => {
    const n = int(rng, 2, 6); const answer = r4(0.5 - 1 / (n + 1));
    return { n, answer, tol: 0.01,
      q: R`Find the area enclosed by $y=x$ and $y=x^{${n}}$ between their two meeting points.${TWOD}`,
      sol: R`<p>They meet where $x=x^{${n}}$, i.e. at $x=0$ and $x=1$. On $(0,1)$, $x>x^{${n}}$. Area $=\int_0^1(x-x^{${n}})dx=\dfrac12-\dfrac1{${n + 1}}\approx${answer}$.</p>` };
  }, (p) => simp((x) => x - x ** p.n, 0, 1)),

  gen('di-g17', 4, 'nat', 'numeric', "King's rule", (rng) => {
    const m = int(rng, 2, 6), fnn = choose(rng, ['sin', 'tan']);
    const f = (x) => (fnn === 'sin' ? sin(x) ** m / (sin(x) ** m + cos(x) ** m) : 1 / (1 + tan(x) ** m));
    return { m, fnn, answer: 0.7854, tol: 0.01,
      q: fnn === 'sin'
        ? R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{\sin^{${m}}x}{\sin^{${m}}x+\cos^{${m}}x}\,dx$.${TWOD}`
        : R`Evaluate $\displaystyle\int_0^{\pi/2}\frac{dx}{1+\tan^{${m}}x}$.${TWOD}`,
      sol: R`<p>Replace $x$ by $\dfrac\pi2-x$: $\sin\leftrightarrow\cos$ and $\tan\leftrightarrow\cot$. The new integrand is the partner that adds to 1 with the old one. So $2I=\int_0^{\pi/2}dx=\dfrac\pi2$, $I=\dfrac\pi4\approx0.7854$, whatever the power ${m} is.</p>` };
  }, (p) => { const f = (x) => (x <= 0 ? (p.fnn === 'sin' ? 0 : 1) : x >= PI_ / 2 ? (p.fnn === 'sin' ? 1 : 0) : p.fnn === 'sin' ? sin(x) ** p.m / (sin(x) ** p.m + cos(x) ** p.m) : 1 / (1 + tan(x) ** p.m)); return simp(f, 0, PI_ / 2, 40000); }),

  gen('di-g18', 4, 'nat', 'numeric', 'area between curves', (rng) => {
    const a = choose(rng, [1, 4, 9, 16]); const answer = r4((4 * a ** 1.5) / 3);
    return { a, answer, tol: 0.01,
      q: R`Find the area of the region cut off from the parabola $y=x^2$ by the line $y=${a}$.${TWOD}`,
      sol: R`<p>They meet at $x=\pm${sqrt(a)}$. Area $=\int_{-${sqrt(a)}}^{${sqrt(a)}}(${a}-x^2)dx=2\left[${a}x-\dfrac{x^3}3\right]_0^{${sqrt(a)}}=2\left(${a * sqrt(a)}-\dfrac{${a * sqrt(a)}}3\right)=\dfrac{4\cdot${a * sqrt(a)}}3\approx${answer}$.</p>` };
  }, (p) => simp((x) => p.a - x * x, -sqrt(p.a), sqrt(p.a))),

  gen('di-g19', 2, 'mcq', 'single', 'Leibniz rule', (rng) => {
    const n = int(rng, 2, 5);
    const good = R`$${n}x^{${n - 1}}\sin(x^{${n}})$`;
    const { options, answer } = shuffleOpts(rng, good, [R`$\sin(x^{${n}})$`, R`$x^{${n - 1}}\sin(x^{${n}})$`, R`$${n}x^{${n - 1}}\cos(x^{${n}})$`]);
    return { n, options, answer,
      q: R`$\dfrac{d}{dx}\displaystyle\int_0^{x^{${n}}}\sin t\,dt$ equals`,
      sol: R`<p>Leibniz rule: $f(g(x))\,g'(x)$ with $f=\sin$ and $g(x)=x^{${n}}$. So the derivative is $\sin(x^{${n}})\cdot${n}x^{${n - 1}}$. (Check: $\int_0^{x^${n}}\sin t\,dt=1-\cos x^{${n}}$, whose derivative is $\sin(x^{${n}})\cdot${n}x^{${n - 1}}$.)</p>` };
  }, (p) => p.options.indexOf(R`$${p.n}x^{${p.n - 1}}\sin(x^{${p.n}})$`)),

  gen('di-g20', 2, 'mcq', 'single', 'even and odd', (rng) => {
    const pool = [
      [R`x^3\cos x`, 'odd'], [R`x^2\sin x`, 'odd'], [R`x\,e^{x^2}`, 'odd'], [R`x^4+\cos x`, 'even'], [R`|x|\sin^2x`, 'even'], [R`\dfrac{x}{1+x^2}`, 'odd'], [R`x^2\cos x`, 'even'],
    ];
    const [f, kind] = choose(rng, pool); const a = int(rng, 1, 5);
    const good = kind === 'odd' ? '$0$' : R`$2\displaystyle\int_0^{${a}}f(x)\,dx$`;
    const { options, answer } = shuffleOpts(rng, good, kind === 'odd' ? [R`$2\displaystyle\int_0^{${a}}f(x)\,dx$`, R`$\displaystyle\int_0^{${a}}f(x)\,dx$`, R`$-\displaystyle\int_0^{${a}}f(x)\,dx$`] : ['$0$', R`$\displaystyle\int_0^{${a}}f(x)\,dx$`, R`$-2\displaystyle\int_0^{${a}}f(x)\,dx$`]);
    return { f, kind, a, options, answer,
      q: R`For $f(x)=${f}$, the integral $\displaystyle\int_{-${a}}^{${a}}f(x)\,dx$ equals`,
      sol: R`<p>$f(-x)=${kind === 'odd' ? '-f(x)' : 'f(x)'}$, so $f$ is ${kind}. ${kind === 'odd' ? 'An odd function integrates to $0$ over a symmetric interval.' : 'An even function gives twice the integral over $[0,a]$.'}</p>` };
  }, (p) => p.options.indexOf(p.kind === 'odd' ? '$0$' : R`$2\displaystyle\int_0^{${p.a}}f(x)\,dx$`)),

  gen('di-g21', 4, 'nat', 'numeric', 'integral equations', (rng) => {
    const k = choose(rng, [0.5, 0.25, 0.2, 0.1]), a = int(rng, 2, 6);
    const c = k / (2 * (1 - k)); const answer = r4(a + c);
    const kt = k === 0.5 ? R`\dfrac12` : k === 0.25 ? R`\dfrac14` : k === 0.2 ? R`\dfrac15` : R`\dfrac1{10}`;
    return { k, a, answer, tol: 0.01,
      q: R`A continuous $f$ satisfies $f(x)=x+${kt}\displaystyle\int_0^1f(t)\,dt$. Find $f(${a})$.${TWOD}`,
      sol: R`<p>Let $c=\int_0^1f(t)dt$ (a constant). Then $f(x)=x+${kt}c$. $c=\int_0^1\left(t+${kt}c\right)dt=\dfrac12+${kt}c$, so $c\left(1-${kt}\right)=\dfrac12$ and $c=${r4(0.5 / (1 - k))}$. $f(${a})=${a}+${kt}\cdot${r4(0.5 / (1 - k))}=${answer}$.</p>` };
  }, (p) => { let c = 0; for (let i = 0; i < 200; i++) c = simp((t) => t + p.k * c, 0, 1, 20); return p.a + p.k * c; }),

  gen('di-g22', 4, 'nat', 'numeric', 'limit using the Leibniz rule', (rng) => {
    const n = int(rng, 1, 5); const answer = r4(1 / (n + 1));
    return { n, answer, tol: 0.01,
      q: R`Find $\displaystyle\lim_{x\to0}\frac1{x^{${n + 1}}}\int_0^xt^{${n}}\cos t\,dt$.${TWOD}`,
      sol: R`<p>Form $\dfrac00$. L'Hopital (Leibniz rule on the top): $\dfrac{x^{${n}}\cos x}{${n + 1}x^{${n}}}=\dfrac{\cos x}{${n + 1}}\to\dfrac1{${n + 1}}\approx${answer}$.</p>` };
  }, (p) => { const x = 1e-3; return simp((t) => t ** p.n * cos(t), 0, x, 400) / x ** (p.n + 1); }),
];

// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `di-x${String(++_k).padStart(3, '0')}`;
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
const GX = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: xex(level, type), sub, make, ...(verify ? { verify } : {}) });
const frac = (n, d) => { const g = ((a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; })(n, d); n /= g; d /= g; const sgn = n < 0 ? '-' : ''; n = Math.abs(n); return d === 1 ? `${sgn}${n}` : `${sgn}\\dfrac{${n}}{${d}}`; };
const OPT = (c, w) => ({ c, w });
const rie = (f, a, b, n = 2000000) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h); return s * h; };
const D = (l, s, q, val, sol, trap, calc) => N(l, s, `${q} (2 decimal places)`, +val.toFixed(4), 0.01, sol, trap, calc || (() => val));
const D4 = (l, s, q, val, sol, trap, calc) => N(l, s, `${q} (4 decimal places)`, +val.toFixed(4), 0.0005, sol, trap, calc || (() => val));
const Pi = Math.PI;
Object.assign(groups, {
  xm1: { title: 'Simple integrals', passage: XR`<p>Match each integral in List I with its value in List II.</p>`,
    list1: ['A. $\\displaystyle\\int_0^{\\pi/2}\\cos x\\,dx$', 'B. $\\displaystyle\\int_0^1\\frac{dx}{1+x^2}$', 'C. $\\displaystyle\\int_0^1\\frac{dx}{1+x}$', 'D. $\\displaystyle\\int_0^2x\\,dx$'], list2: ['p. $1$', 'q. $2$', 'r. $\\dfrac\\pi4$', 's. $\\ln2$'] },
  xm2: { title: 'Powers of sine', passage: XR`<p>Match each integral in List I with its value in List II.</p>`,
    list1: ['A. $\\displaystyle\\int_{-\\pi}^{\\pi}\\sin^3x\\,dx$', 'B. $\\displaystyle\\int_0^{\\pi}\\sin^3x\\,dx$', 'C. $\\displaystyle\\int_0^{\\pi/2}\\sin^3x\\,dx$', 'D. $\\displaystyle\\int_0^{2\\pi}|\\sin^3x|\\,dx$'], list2: ['p. $0$', 'q. $\\dfrac23$', 'r. $\\dfrac43$', 's. $\\dfrac83$'] },
  xm3: { title: 'Areas', passage: XR`<p>Match each region in List I with its area in List II.</p>`,
    list1: ['A. under $y=x^2$ above the $x$-axis, $0\\le x\\le3$', 'B. between $y=x$ and $y=x^2$', 'C. under $y=\\sin x$, $0\\le x\\le\\pi$', 'D. between $y=\\sqrt x$ and $y=x^2$'], list2: ['p. $\\dfrac16$', 'q. $\\dfrac13$', 'r. $2$', 's. $9$'] },
  xm4: { title: 'Derivatives of integrals at x = 1', passage: XR`<p>Match each derivative in List I (evaluated at $x=1$) with its value in List II.</p>`,
    list1: ['A. $\\dfrac{d}{dx}\\displaystyle\\int_0^{x}e^{t^2}dt$', 'B. $\\dfrac{d}{dx}\\displaystyle\\int_x^{x^2}t\\,dt$', 'C. $\\dfrac{d}{dx}\\displaystyle\\int_1^{x^3}\\dfrac{dt}t$', 'D. $\\dfrac{d}{dx}\\displaystyle\\int_{-x}^{x}t^2\\,dt$'], list2: ['p. $1$', 'q. $2$', 'r. $3$', 's. $e$'] },
  xm5: { title: 'Wallis and Beta values', passage: XR`<p>Match each integral in List I with its value in List II.</p>`,
    list1: ['A. $\\displaystyle\\int_0^{\\pi/2}\\sin^4x\\,dx$', 'B. $\\displaystyle\\int_0^{\\pi/2}\\sin^5x\\,dx$', 'C. $\\displaystyle\\int_0^1x(1-x)^3\\,dx$', 'D. $\\displaystyle\\int_0^{\\pi/2}\\sin^2x\\cos^2x\\,dx$'], list2: ['p. $\\dfrac\\pi{16}$', 'q. $\\dfrac{3\\pi}{16}$', 'r. $\\dfrac8{15}$', 's. $\\dfrac1{20}$'] },
  xm6: { title: 'Limits of sums', passage: XR`<p>Match each limit in List I with its value in List II.</p>`,
    list1: ['A. $\\displaystyle\\lim_{n\\to\\infty}\\frac1n\\sum_{r=1}^n\\frac rn$', 'B. $\\displaystyle\\lim_{n\\to\\infty}\\frac1n\\sum_{r=1}^n\\left(\\frac rn\\right)^2$', 'C. $\\displaystyle\\lim_{n\\to\\infty}\\sum_{r=1}^n\\frac1{n+r}$', 'D. $\\displaystyle\\lim_{n\\to\\infty}\\frac1n\\sum_{r=1}^n\\sin\\frac{r\\pi}n$'], list2: ['p. $\\dfrac12$', 'q. $\\dfrac13$', 'r. $\\ln2$', 's. $\\dfrac2\\pi$'] },
  xm7: { title: 'Even and odd integrands', passage: XR`<p>Match each integral in List I with its value in List II.</p>`,
    list1: ['A. $\\displaystyle\\int_{-1}^{1}(x^3+x^2)\\,dx$', 'B. $\\displaystyle\\int_{-1}^{1}|x|^3\\,dx$', 'C. $\\displaystyle\\int_{-\\pi}^{\\pi}\\sin x\\cos x\\,dx$', 'D. $\\displaystyle\\int_{-2}^{2}(x^4+x)\\,dx$'], list2: ['p. $0$', 'q. $\\dfrac23$', 'r. $\\dfrac12$', 's. $\\dfrac{64}5$'] },
  xm8: { title: 'Mean values over [0, pi]', passage: XR`<p>The mean value of $f$ on $[0,\pi]$ is $\dfrac1\pi\int_0^\pi f(x)\,dx$. Match each function in List I with its mean value in List II.</p>`,
    list1: ['A. $\\sin x$', 'B. $\\sin^2x$', 'C. $\\cos x$', 'D. $x$'], list2: ['p. $0$', 'q. $\\dfrac12$', 'r. $\\dfrac2\\pi$', 's. $\\dfrac\\pi2$'] },
  xp1: { title: 'Passage: an integral function', passage: XR`<p>Let $g(x)=\displaystyle\int_0^x t(t-3)\,dt$ for $x\ge0$. Note that $g'(x)=x(x-3)$.</p>` },
  xp2: { title: 'Passage: the a + b - x trick', passage: XR`<p>Let $f(x)=\dfrac{\ln(6-x)}{\ln x+\ln(6-x)}$ on $[1,5]$. For $x\in[1,5]$ we have $x(6-x)\ge5>1$, so the denominator $\ln x+\ln(6-x)$ is positive. Using $x\to6-x$ turns $\ln x$ into $\ln(6-x)$ and back.</p>` },
});
items.push(
  // ---- L2 ----
  M(2, 'basic integrals', XR`$\displaystyle\int_0^2(3x^2-2x)\,dx$ equals`, '$4$', ['$8$', '$12$', '$2$'],
    XR`<p>$\left[x^3-x^2\right]_0^2=(8-4)-0=4$.</p>`, 'Do not forget to subtract the lower limit.'),
  M(2, 'basic integrals', XR`$\displaystyle\int_0^1e^{2x}\,dx$ equals`, XR`$\dfrac{e^2-1}2$`, [XR`$e^2-1$`, XR`$\dfrac{e^2}2$`, XR`$2(e^2-1)$`],
    XR`<p>$\int e^{2x}dx=\dfrac{e^{2x}}2$, so the value is $\dfrac{e^2-1}2$.</p>`, 'The chain rule factor 2 goes in the denominator.'),
  A(2, 'odd functions', XR`$\displaystyle\int_{-3}^{3}x^3\,dx=0$.`, XR`$x^3$ is an odd function.`, 0,
    XR`<p>For an odd function the area to the left of $0$ cancels the area to the right: $\int_{-a}^af=0$. R is exactly the reason.</p>`, 'The integral of an odd function over a symmetric interval is 0.'),
  S(2, 'basic properties', XR`$\displaystyle\int_a^bf(x)\,dx=-\int_b^af(x)\,dx$.`, XR`$\displaystyle\int_0^2|x-1|\,dx=0$.`, 1,
    XR`<p>I is true (swapping limits changes the sign). II is false: $|x-1|\ge0$ and is not identically $0$, so the integral is positive: $\int_0^1(1-x)dx+\int_1^2(x-1)dx=\tfrac12+\tfrac12=1$.</p>`, 'An integral of a non-negative function is never negative.'),
  I(2, 'modulus integrand', XR`Find $\displaystyle\int_0^4|x-2|\,dx$.`, 4,
    XR`<p>The graph of $|x-2|$ forms two triangles, each with base $2$ and height $2$: area $\tfrac12\cdot2\cdot2=2$ each. Total $4$.</p>`, 'Split at x = 2.', () => rie((x) => Math.abs(x - 2), 0, 4)),
  M(2, 'mean value', XR`The mean value of $f(x)=x^2$ on $[0,3]$ is`, '$3$', ['$9$', XR`$\dfrac92$`, XR`$\dfrac13$`],
    XR`<p>Mean value $=\dfrac1{3-0}\int_0^3x^2dx=\dfrac13\cdot\dfrac{27}3=3$.</p>`, 'Divide the integral by the length of the interval.'),
  // ---- L3 ----
  I(3, 'odd functions', XR`Find $\displaystyle\int_{-2}^{2}\left(x^7+x^3-x+5\right)dx$.`, 20,
    XR`<p>The terms $x^7,x^3,-x$ are odd, so they integrate to $0$ over $[-2,2]$. What is left is $\int_{-2}^25\,dx=5\cdot4=20$.</p>`, 'Spot the odd terms first.', () => rie((x) => x ** 7 + x ** 3 - x + 5, -2, 2)),
  I(3, 'modulus integrand', XR`Find $\displaystyle\int_0^4|x^2-4x+3|\,dx$.`, 4,
    XR`<p>$x^2-4x+3=(x-1)(x-3)$ is positive on $[0,1]$ and $[3,4]$, negative on $[1,3]$. With $F(x)=\dfrac{x^3}3-2x^2+3x$: $F(1)=\dfrac43$, $F(3)=0$, $F(4)=\dfrac43$, $F(0)=0$. So the integral is $\left(\dfrac43-0\right)+\left|0-\dfrac43\right|+\left(\dfrac43-0\right)=4$.</p>`, 'Integrate |f| piece by piece.', () => rie((x) => Math.abs(x * x - 4 * x + 3), 0, 4)),
  I(3, 'King\'s rule', XR`Find $\displaystyle\int_1^3\frac{\sqrt x}{\sqrt x+\sqrt{4-x}}\,dx$.`, 1,
    XR`<p>Here $a+b=4$. Let $I$ be the integral. Replacing $x$ by $4-x$ gives $I=\int_1^3\dfrac{\sqrt{4-x}}{\sqrt{4-x}+\sqrt x}dx$. Adding: $2I=\int_1^31\,dx=2$, so $I=1$.</p>`, 'The pair adds to the whole length.', () => rie((x) => Math.sqrt(x) / (Math.sqrt(x) + Math.sqrt(4 - x)), 1, 3)),
  I(3, 'Leibniz rule', XR`Let $F(x)=\displaystyle\int_x^{x^2}(3t^2+1)\,dt$. Find $F'(1)$.`, 4,
    XR`<p>$F'(x)=(3x^4+1)\cdot2x-(3x^2+1)\cdot1$. At $x=1$: $4\cdot2-4=4$.</p>`, 'Both limits depend on x.', () => 4 * 2 - 4),
  I(3, 'greatest integer function', XR`Find $\displaystyle\int_0^{10}[x]\,dx$, where $[x]$ is the greatest integer function.`, 45,
    XR`<p>On $[k,k+1)$ the function equals $k$. So the integral is $0+1+2+\dots+9=45$.</p>`, 'The last interval is [9, 10).', () => rie((x) => Math.floor(x), 0, 10)),
  I(3, 'integral equations', XR`A continuous $f$ satisfies $f(x)=1+\displaystyle\int_0^xf(t)\,dt$. Find $f(\ln3)$.`, 3,
    XR`<p>Differentiate: $f'(x)=f(x)$, so $f(x)=Ce^x$. Putting $x=0$ in the equation gives $f(0)=1$, so $C=1$ and $f(x)=e^x$. Then $f(\ln3)=3$.</p>`, 'The equation gives the starting value f(0).', () => 3),
  I(3, 'estimation', XR`For how many positive integers $n$ is $\displaystyle\int_0^1x^n\,dx\ge\frac1{100}$?`, 99,
    XR`<p>$\int_0^1x^ndx=\dfrac1{n+1}\ge\dfrac1{100}$ means $n+1\le100$, so $n\le99$. The positive integers $1,\dots,99$: $99$ values.</p>`, 'n starts from 1.', () => 99),
  N(3, 'Wallis formula', XR`Find $\displaystyle\int_0^{\pi/2}\cos^3x\,dx$ (2 decimal places).`, 0.67, 0.01,
    XR`<p>Wallis formula: $\int_0^{\pi/2}\cos^3x\,dx=\dfrac{2}{3}\approx0.67$. (Or: $\int(1-\sin^2x)\cos x\,dx=\sin x-\dfrac{\sin^3x}3$, which gives $1-\dfrac13$.)</p>`, 'For odd powers there is no π in the answer.', () => simp((x) => Math.cos(x) ** 3, 0, Pi / 2)),
  N(3, 'Wallis formula', XR`Find $\displaystyle\int_0^{2\pi}\cos^4x\,dx$ (2 decimal places).`, 2.36, 0.01,
    XR`<p>$\int_0^{2\pi}\cos^4xdx=4\int_0^{\pi/2}\cos^4xdx=4\cdot\dfrac{3\pi}{16}=\dfrac{3\pi}4\approx2.36$.</p>`, 'Four quarter-periods fit in 2π.', () => simp((x) => Math.cos(x) ** 4, 0, 2 * Pi)),
  D(3, 'Leibniz rule', XR`$F(x)=\displaystyle\int_x^{x^2}e^{-t^2}\,dt$. Find $F'(1)$`, 1 / Math.E,
    XR`<p>$F'(x)=e^{-x^4}\cdot2x-e^{-x^2}$. At $x=1$: $2e^{-1}-e^{-1}=e^{-1}\approx0.37$.</p>`, 'Chain rule factor 2x on the upper limit.', () => { const f = (x) => simp((t) => Math.exp(-t * t), x, x * x, 4000); return (f(1 + 1e-5) - f(1 - 1e-5)) / 2e-5; }),
  D(3, 'area between curves', XR`Find the area bounded by $y=x^2$ and $y=2-|x|$`, 7 / 3,
    XR`<p>By symmetry take $x\ge0$: the curves $y=x^2$ and $y=2-x$ meet at $x=1$. Area $=2\int_0^1(2-x-x^2)dx=2\left(2-\dfrac12-\dfrac13\right)=\dfrac73\approx2.33$.</p>`, 'Double the right-hand half.', () => simp((x) => 2 - Math.abs(x) - x * x, -1, 1)),
  D(3, 'area between curves', XR`Find the area enclosed by the parabola $y^2=4x$ and the line $y=x$`, 8 / 3,
    XR`<p>They meet at $(0,0)$ and $(4,4)$. For $0\le x\le4$ the parabola ($y=2\sqrt x$) is above the line. Area $=\int_0^4(2\sqrt x-x)dx=\left[\dfrac43x^{3/2}-\dfrac{x^2}2\right]_0^4=\dfrac{32}3-8=\dfrac83\approx2.67$.</p>`, 'Check which curve is on top.', () => simp((x) => 2 * Math.sqrt(x) - x, 0, 4)),
  D4(3, 'Beta integrals', XR`Find $\displaystyle\int_0^1x(1-x)^{10}\,dx$`, 1 / 132,
    XR`<p>$\int_0^1x^{m}(1-x)^ndx=\dfrac{m!\,n!}{(m+n+1)!}$. With $m=1$, $n=10$: $\dfrac{1!\,10!}{12!}=\dfrac1{11\cdot12}=\dfrac1{132}\approx0.0076$.</p>`, '12! cancels with 10!, leaving 11 × 12.', () => simp((x) => x * (1 - x) ** 10, 0, 1)),
  A(3, 'basic properties', XR`$\displaystyle\int_0^\pi\sin^2x\,dx=\dfrac\pi2$.`, XR`$\sin^2x=\dfrac{1-\cos2x}2$ and $\displaystyle\int_0^\pi\cos2x\,dx=0$.`, 0,
    XR`<p>$\int_0^\pi\dfrac{1-\cos2x}2dx=\dfrac\pi2-\dfrac12\left[\dfrac{\sin2x}2\right]_0^\pi=\dfrac\pi2$. R gives exactly this calculation.</p>`, 'cos 2x completes two full half-waves on [0, π].'),
  A(3, 'area under a curve', XR`The area between $y=\sin x$ and the $x$-axis from $0$ to $2\pi$ equals $\displaystyle\int_0^{2\pi}\sin x\,dx$.`, XR`A definite integral gives signed area: parts below the $x$-axis count as negative.`, 3,
    XR`<p>The integral is $0$ but the area is $4$ ($2$ above and $2$ below). So A is false. R is true and is the reason the integral differs from the area.</p>`, 'Area needs |sin x|.'),
  S(3, 'odd functions', XR`$\displaystyle\int_{-1}^{1}x^2\sin x\,dx=0$.`, XR`$\displaystyle\int_{-1}^{1}x\sin x\,dx=0$.`, 1,
    XR`<p>I: $x^2\sin x$ is odd, so the integral is $0$. II: $x\sin x$ is even and positive on $(0,1]$, so the integral is $2\int_0^1x\sin xdx=2(\sin1-\cos1)\approx0.60\ne0$.</p>`, 'Even × odd is odd; odd × odd is even.'),
  SC(3, 'mixed properties', ['If $f$ is odd, $\\displaystyle\\int_{-a}^af\\,dx=0$.', 'If $f$ is even, $\\displaystyle\\int_{-a}^af\\,dx=2\\int_0^af\\,dx$.', '$\\displaystyle\\int_0^af(x)dx=\\int_0^af(a-x)dx$.', '$\\displaystyle\\int_a^bf(x)g(x)dx=\\int_a^bf\\,dx\\cdot\\int_a^bg\\,dx$.'], '3', ['1', '2', '4'],
    XR`<p>(1), (2), (3) are standard properties. (4) is false: $\int_0^1x\cdot x\,dx=\tfrac13$ but $\int_0^1x\,dx\cdot\int_0^1x\,dx=\tfrac14$. Three statements are correct.</p>`, 'An integral of a product is not the product of integrals.'),
  MT(3, 'simple integrals', 'xm1', 'A-p, B-r, C-s, D-q', ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q', 'A-p, B-s, C-r, D-q'],
    XR`<p>A: $[\sin x]_0^{\pi/2}=1$. B: $[\tan^{-1}x]_0^1=\dfrac\pi4$. C: $[\ln(1+x)]_0^1=\ln2$. D: $\left[\dfrac{x^2}2\right]_0^2=2$.</p>`, 'Match each antiderivative to its value.'),
  MT(3, 'areas', 'xm3', 'A-s, B-p, C-r, D-q', ['A-s, B-p, C-q, D-r', 'A-p, B-s, C-r, D-q', 'A-s, B-q, C-r, D-p'],
    XR`<p>A: $\int_0^3x^2dx=9$. B: $\int_0^1(x-x^2)dx=\dfrac16$. C: $\int_0^\pi\sin x\,dx=2$. D: $\int_0^1(\sqrt x-x^2)dx=\dfrac23-\dfrac13=\dfrac13$.</p>`, 'The curves meet at x = 0 and x = 1 in B and D.'),
  MT(3, 'even and odd', 'xm7', 'A-q, B-r, C-p, D-s', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-q, B-p, C-r, D-s'],
    XR`<p>A: only the even term $x^2$ survives: $2\cdot\dfrac13=\dfrac23$. B: $|x|^3$ is even: $2\int_0^1x^3dx=\dfrac12$. C: $\sin x\cos x$ is odd: $0$. D: $x^4$ even, $x$ odd: $2\cdot\dfrac{32}5=\dfrac{64}5$.</p>`, 'Only the even part counts over a symmetric interval.'),
  MT(3, 'limit of a sum', 'xm6', 'A-p, B-q, C-r, D-s', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-p, B-r, C-q, D-s'],
    XR`<p>Each limit is $\int_0^1$ of a function. A: $\int_0^1x\,dx=\dfrac12$. B: $\int_0^1x^2dx=\dfrac13$. C: $\int_0^1\dfrac{dx}{1+x}=\ln2$. D: $\int_0^1\sin\pi x\,dx=\dfrac2\pi$.</p>`, 'Replace r/n by x and 1/n by dx.'),
  // ---- L4 ----
  X(4, 'King\'s rule', XR`Which of these statements are true?`, ['$\\displaystyle\\int_0^{\\pi/2}\\sin^8x\\,dx=\\int_0^{\\pi/2}\\cos^8x\\,dx$', '$\\displaystyle\\int_0^{\\pi}\\sin^3x\\,dx=2\\int_0^{\\pi/2}\\sin^3x\\,dx$', '$\\displaystyle\\int_0^{2\\pi}\\sin^3x\\,dx=2\\int_0^{\\pi}\\sin^3x\\,dx$', '$\\displaystyle\\int_{-\\pi}^{\\pi}\\sin^3x\\,dx=0$'], [0, 1, 3],
    XR`<p>(A) true by $x\to\frac\pi2-x$. (B) true since $\sin^3(\pi-x)=\sin^3x$. (C) false: over $[\pi,2\pi]$ the function is negative, so $\int_0^{2\pi}\sin^3x\,dx=0$. (D) true: odd function.</p>`, 'sin³ x changes sign on [π, 2π].'),
  X(4, 'odd functions', XR`Which of these integrals are equal to $0$?`, ['$\\displaystyle\\int_{-1}^{1}x^3e^{x^2}\\,dx$', '$\\displaystyle\\int_{-\\pi}^{\\pi}x\\sin^2x\\,dx$', '$\\displaystyle\\int_0^{\\pi}\\cos x\\,dx$', '$\\displaystyle\\int_{-1}^{1}x^2\\,dx$'], [0, 1, 2],
    XR`<p>A: odd integrand. B: $x\sin^2x$ is odd. C: $[\sin x]_0^\pi=0$. D: even and positive, equals $\dfrac23$.</p>`, 'The last one is the integral of a positive function.'),
  X(4, 'Leibniz rule', XR`Let $F(x)=\displaystyle\int_0^x(t-1)(t-3)\,dt$. Which statements are true?`, ['$F$ has a local maximum at $x=1$', '$F$ has a local maximum at $x=3$', '$F(3)=0$', '$F$ is increasing on $(1,3)$'], [0, 2],
    XR`<p>$F'(x)=(x-1)(x-3)$: positive for $x<1$, negative on $(1,3)$, positive for $x>3$. So $F$ rises then falls then rises: local max at $1$, local min at $3$; $F$ is decreasing on $(1,3)$. $F(3)=\left[\dfrac{t^3}3-2t^2+3t\right]_0^3=9-18+9=0$.</p>`, 'The sign of F′ decides, not the sign of F.'),
  X(4, 'estimation', XR`Which of these inequalities are true?`, ['$\\displaystyle\\int_0^1e^{-x^2}dx\\ge\\dfrac1e$', '$\\displaystyle\\int_0^1e^{-x^2}dx\\le1$', '$\\displaystyle\\int_0^{\\pi/2}\\dfrac{\\sin x}x\\,dx\\le\\dfrac\\pi2$', '$\\displaystyle\\int_0^1x^2dx\\ge\\dfrac12$'], [0, 1, 2],
    XR`<p>(A) $e^{-x^2}\ge e^{-1}$ on $[0,1]$. (B) $e^{-x^2}\le1$. (C) $\dfrac{\sin x}x\le1$ on the interval of length $\dfrac\pi2$. (D) $\int_0^1x^2dx=\dfrac13<\dfrac12$.</p>`, 'Compare the integrand with a constant.'),
  X(4, 'limit of a sum', XR`Which of these limits equal $\ln2$?`, ['$\\displaystyle\\lim_{n\\to\\infty}\\sum_{r=1}^n\\frac1{n+r}$', '$\\displaystyle\\lim_{n\\to\\infty}\\sum_{r=1}^n\\frac n{(n+r)^2}$', '$\\displaystyle\\int_1^2\\frac{dx}x$', '$\\displaystyle\\lim_{n\\to\\infty}\\frac1n\\sum_{r=1}^n\\frac1{1+r/n}$'], [0, 2, 3],
    XR`<p>(A) $\int_0^1\dfrac{dx}{1+x}=\ln2$. (B) $\int_0^1\dfrac{dx}{(1+x)^2}=\dfrac12$, not $\ln2$. (C) $[\ln x]_1^2=\ln2$. (D) is the same sum as (A).</p>`, 'Squaring the denominator changes the antiderivative.'),
  X(4, 'area between curves', XR`Which expressions give the area enclosed by $y=x$ and $y=x^3$ between $x=-1$ and $x=1$?`, ['$2\\displaystyle\\int_0^1(x-x^3)\\,dx$', '$\\displaystyle\\int_{-1}^{1}|x-x^3|\\,dx$', '$\\displaystyle\\int_{-1}^{1}(x-x^3)\\,dx$', '$\\displaystyle\\int_{-1}^{0}(x^3-x)\\,dx+\\int_0^1(x-x^3)\\,dx$'], [0, 1, 3],
    XR`<p>$x-x^3\ge0$ on $[0,1]$ and $\le0$ on $[-1,0]$. The area is $\int_{-1}^1|x-x^3|dx=2\int_0^1(x-x^3)dx=\dfrac12$. (C) is the signed integral of an odd function: $0$.</p>`, 'Odd integrands cancel; areas do not.'),
  X(5, 'Beta integrals', XR`Which of these integrals equal $\dfrac1{30}$?`, ['$\\displaystyle\\int_0^1x^2(1-x)^2dx$', '$\\displaystyle\\int_0^1x^4(1-x)\\,dx$', '$\\displaystyle\\int_0^1x(1-x)^4\\,dx$', '$\\displaystyle\\int_0^1x^3(1-x)^2\\,dx$'], [0, 1, 2],
    XR`<p>Using $\int_0^1x^m(1-x)^ndx=\dfrac{m!\,n!}{(m+n+1)!}$: A: $\dfrac{2!2!}{5!}=\dfrac4{120}=\dfrac1{30}$. B: $\dfrac{4!1!}{6!}=\dfrac{24}{720}=\dfrac1{30}$. C: same as B. D: $\dfrac{3!2!}{6!}=\dfrac{12}{720}=\dfrac1{60}$.</p>`, 'The factorial in the denominator is (m + n + 1)!.'),
  X(5, 'greatest integer function', XR`Which of these are correct?`, ['$\\displaystyle\\int_0^4[x]\\,dx=6$', '$\\displaystyle\\int_0^{3.5}[x]\\,dx=4.5$', '$\\displaystyle\\int_0^3\\{x\\}\\,dx=\\dfrac32$', '$\\displaystyle\\int_0^3\\big([x]+\\{x\\}\\big)dx=3$'], [0, 1, 2],
    XR`<p>(A) $0+1+2+3=6$. (B) $\int_0^3=3$ and $\int_3^{3.5}3\,dx=1.5$: $4.5$. (C) $\{x\}$ has mean $\tfrac12$ on each unit interval: $\tfrac32$. (D) $[x]+\{x\}=x$, so the integral is $\dfrac92$, not $3$.</p>`, '[x] + {x} is just x.'),
  X(5, 'Leibniz rule', XR`For $x>0$ let $F(x)=\displaystyle\int_x^{x^2}e^{-t^2}\,dt$. Which statements are true?`, ['$F\'(x)=2xe^{-x^4}-e^{-x^2}$', '$F(1)=0$', '$F\'(1)=\\dfrac1e$', '$F$ has a stationary point at $x=1$'], [0, 1, 2],
    XR`<p>(A) Leibniz rule. (B) Both limits are $1$ at $x=1$. (C) $2e^{-1}-e^{-1}=e^{-1}$. (D) false: $F'(1)=\dfrac1e\ne0$.</p>`, 'F(1) = 0 does not mean F′(1) = 0.'),
  X(4, 'basic properties', XR`$f$ is continuous. Which of these statements are always true?`, ['$\\displaystyle\\int_0^af(x)\\,dx=\\int_0^af(a-x)\\,dx$', '$\\displaystyle\\int_0^{2a}f\\,dx=2\\int_0^af\\,dx$ if $f(2a-x)=f(x)$', '$\\displaystyle\\int_0^{2a}f\\,dx=0$ if $f(2a-x)=-f(x)$', '$\\displaystyle\\int_{-a}^af\\,dx=2\\int_0^af\\,dx$'], [0, 1, 2],
    XR`<p>(A), (B), (C) are the standard symmetry properties. (D) holds only for even $f$.</p>`, 'Option D needs f even.'),
  I(4, 'integral functions', XR`How many real solutions does $\displaystyle\int_0^x(t-1)(t-4)\,dt=0$ have?`, 3,
    XR`<p>$G(x)=\dfrac{x^3}3-\dfrac52x^2+4x=\dfrac x6(2x^2-15x+24)$. $x=0$ is a root, and $2x^2-15x+24=0$ has discriminant $225-192=33>0$, giving two more distinct roots (both positive, since the product and sum are positive). Total: $3$ solutions.</p>`, 'Count x = 0 as well.', () => 3),
  I(4, 'integral equations', XR`A continuous $f$ satisfies $\displaystyle\int_0^{x^2}f(t)\,dt=x^2(1+x)$ for all $x>0$. Find $f(4)$.`, 4,
    XR`<p>Differentiate both sides: $f(x^2)\cdot2x=2x+3x^2$, so $f(x^2)=1+\dfrac{3x}2$. Put $x=2$: $f(4)=1+3=4$.</p>`, 'Use the chain rule on the upper limit.', () => 1 + 3 * 2 / 2),
  I(4, 'symmetry', XR`$f$ is continuous on $[0,6]$, $f(6-x)=f(x)$ and $\displaystyle\int_0^6f(x)\,dx=14$. Find $\displaystyle\int_0^6x\,f(x)\,dx$.`, 42,
    XR`<p>Let $I=\int_0^6xf(x)dx$. Replacing $x$ by $6-x$: $I=\int_0^6(6-x)f(6-x)dx=\int_0^6(6-x)f(x)dx=6\cdot14-I$. So $2I=84$ and $I=42$.</p>`, 'The answer is (half the length) × (the integral of f).', () => 3 * 14),
  I(4, 'symmetry', XR`$f$ is continuous on $[0,2]$, $f(2-x)=f(x)$ and $\displaystyle\int_0^2x\,f(x)\,dx=5$. Find $\displaystyle\int_0^2f(x)\,dx$.`, 5,
    XR`<p>By the same trick, $\int_0^2xf(x)dx=\dfrac{2}{2}\int_0^2f(x)dx=\int_0^2f(x)dx$. So the answer is $5$.</p>`, 'Half the length is 1 here.', () => 5),
  I(4, 'integral equations', XR`A continuous $f$ satisfies $f(x)=3x^2+\displaystyle\int_0^2f(t)\,dt$. Find $f(1)$.`, -5,
    XR`<p>Let $c=\int_0^2f(t)dt$, a constant. Then $f(x)=3x^2+c$ and $c=\int_0^2(3t^2+c)dt=8+2c$, so $c=-8$. Hence $f(1)=3-8=-5$.</p>`, 'The integral on the right is a constant.', () => 3 - 8),
  I(4, 'modulus integrand', XR`Find $\displaystyle\int_{-2}^{2}|x^2-1|\,dx$.`, 4,
    XR`<p>The integrand is even, so double $\int_0^2|x^2-1|dx=\int_0^1(1-x^2)dx+\int_1^2(x^2-1)dx=\dfrac23+\dfrac43=2$. Total $4$.</p>`, 'Split at x = 1 and use evenness.', () => rie((x) => Math.abs(x * x - 1), -2, 2)),
  I(4, 'periodic functions', XR`For how many integers $k$ with $1\le k\le20$ is $\displaystyle\int_0^{\pi}\sin kx\,dx=0$?`, 10,
    XR`<p>$\int_0^\pi\sin kx\,dx=\dfrac{1-\cos k\pi}k=\dfrac{1-(-1)^k}k$. It is $0$ exactly when $k$ is even: $2,4,\dots,20$, that is $10$ values.</p>`, 'Odd k give 2/k, which is not 0.', () => { let c = 0; for (let k = 1; k <= 20; k++) if (Math.abs(simp((x) => Math.sin(k * x), 0, Pi, 2000)) < 1e-9) c++; return c; }),
  I(4, 'orthogonality', XR`For how many ordered pairs $(k,l)$ of integers with $1\le k,l\le5$ is $\displaystyle\int_0^\pi\sin kx\,\sin lx\,dx\ne0$?`, 5,
    XR`<p>$\sin kx\sin lx=\tfrac12[\cos(k-l)x-\cos(k+l)x]$. For $k\ne l$ both terms integrate to $0$ over $[0,\pi]$. For $k=l$ the integral is $\dfrac\pi2$. So only $k=l$ counts: $5$ pairs.</p>`, 'The sines are orthogonal on [0, π].', () => { let c = 0; for (let k = 1; k <= 5; k++) for (let l = 1; l <= 5; l++) if (Math.abs(simp((x) => Math.sin(k * x) * Math.sin(l * x), 0, Pi, 2000)) > 1e-6) c++; return c; }),
  I(4, 'King\'s rule', XR`Let $I=\displaystyle\int_0^{\pi/2}\frac{\sin^{99}x}{\sin^{99}x+\cos^{99}x}\,dx$. Find $\dfrac8\pi\,I$.`, 2,
    XR`<p>By $x\to\dfrac\pi2-x$, $I=\int_0^{\pi/2}\dfrac{\cos^{99}x}{\sin^{99}x+\cos^{99}x}dx$. Adding: $2I=\dfrac\pi2$, so $I=\dfrac\pi4$ and $\dfrac8\pi I=2$.</p>`, 'The power 99 does not matter.', () => 2),
  I(4, 'Leibniz rule', XR`How many local extrema does $F(x)=\displaystyle\int_0^x(t-1)(t-2)^2(t-3)\,dt$ have?`, 2,
    XR`<p>$F'(x)=(x-1)(x-2)^2(x-3)$. $F'$ changes sign at $x=1$ and $x=3$ (odd multiplicity) but not at $x=2$ (the factor is squared). So there are $2$ local extrema.</p>`, 'A squared factor does not change the sign.', () => 2),
  I(5, 'integral functions', XR`How many real solutions does $\displaystyle\int_0^x(t^4-5t^2+4)\,dt=0$ have?`, 1,
    XR`<p>$G(x)=\dfrac{x^5}5-\dfrac{5x^3}3+4x=\dfrac x{15}(3x^4-25x^2+60)$. The quartic factor in $x^2$ has discriminant $625-720<0$, so it never vanishes. Only $x=0$ works: $1$ solution.</p>`, 'Check the discriminant of the quartic factor.', () => 1),
  D(4, 'King\'s rule', XR`Find $\displaystyle\int_0^\pi\frac{x\sin x}{1+\cos^2x}\,dx$`, Pi * Pi / 4,
    XR`<p>Use $x\to\pi-x$: $I=\dfrac\pi2\int_0^\pi\dfrac{\sin x}{1+\cos^2x}dx$. With $u=\cos x$: $\int_0^\pi\dfrac{\sin x}{1+\cos^2x}dx=\int_{-1}^1\dfrac{du}{1+u^2}=\dfrac\pi2$. So $I=\dfrac{\pi^2}4\approx2.47$.</p>`, 'The (π/2) factor comes from the symmetry step.', () => simp((x) => x * Math.sin(x) / (1 + Math.cos(x) ** 2), 0, Pi)),
  D(4, 'integration by parts', XR`Find $\displaystyle\int_0^{\pi/2}x\cot x\,dx$`, Pi / 2 * Math.log(2),
    XR`<p>By parts: $\int x\cot x\,dx=x\ln\sin x-\int\ln\sin x\,dx$. The boundary term vanishes at both ends ($x\ln\sin x\to0$ at $0$, $\ln1=0$ at $\frac\pi2$). Then $-\int_0^{\pi/2}\ln\sin x\,dx=\dfrac\pi2\ln2\approx1.09$.</p>`, 'Use the known value of ∫ ln sin x.', () => simp((x) => (x === 0 ? 1 : x / Math.tan(x)), 0, Pi / 2)),
  D4(4, 'Wallis formula', XR`Find $\displaystyle\int_0^{\pi/2}\sin^5x\cos^2x\,dx$`, 8 / 105,
    XR`<p>Wallis: $\int_0^{\pi/2}\sin^m\cos^n=\dfrac{[(m-1)(m-3)\cdots][(n-1)(n-3)\cdots]}{(m+n)(m+n-2)\cdots}\times\dfrac\pi2$ only if both $m,n$ are even. Here $m=5$ is odd: numerator $(4\cdot2)(1)=8$, denominator $7\cdot5\cdot3\cdot1=105$. So the value is $\dfrac8{105}\approx0.0762$.</p>`, 'No π appears when one power is odd.', () => simp((x) => Math.sin(x) ** 5 * Math.cos(x) ** 2, 0, Pi / 2)),
  D(4, 'greatest integer function', XR`Find $\displaystyle\int_0^\pi[\cos x]\,dx$`, -Pi / 2,
    XR`<p>For $x\in(0,\frac\pi2]$, $0\le\cos x<1$, so $[\cos x]=0$. For $x\in(\frac\pi2,\pi]$, $-1\le\cos x<0$, so $[\cos x]=-1$. Integral $=-\left(\pi-\dfrac\pi2\right)=-\dfrac\pi2\approx-1.57$.</p>`, 'Between −1 and 0 the floor is −1.', () => rie((x) => Math.floor(Math.cos(x)), 0, Pi)),
  D(4, 'King\'s rule', XR`Find $\displaystyle\int_0^{\pi/2}\frac{\sin^2x}{\sin x+\cos x}\,dx$`, Math.SQRT2 / 2 * Math.log(1 + Math.SQRT2),
    XR`<p>Let $I=\int\dfrac{\sin^2x}{\sin x+\cos x}$ and $J=\int\dfrac{\cos^2x}{\sin x+\cos x}$ over $[0,\frac\pi2]$. By $x\to\frac\pi2-x$, $I=J$. Then $2I=I+J=\int_0^{\pi/2}\dfrac{dx}{\sin x+\cos x}=\dfrac1{\sqrt2}\int_0^{\pi/2}\dfrac{dx}{\sin(x+\pi/4)}=\dfrac1{\sqrt2}\Big[\ln\tan\Big(\dfrac x2+\dfrac\pi8\Big)\Big]_0^{\pi/2}=\dfrac1{\sqrt2}\ln\dfrac{\tan(3\pi/8)}{\tan(\pi/8)}=\dfrac{2\ln(1+\sqrt2)}{\sqrt2}$. So $I=\dfrac{\ln(1+\sqrt2)}{\sqrt2}\approx0.62$.</p>`, 'Two integrals equal by symmetry: find their sum.', () => simp((x) => Math.sin(x) ** 2 / (Math.sin(x) + Math.cos(x)), 0, Pi / 2)),
  D(4, 'limit of a sum', XR`Find $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{2n}\frac r{n^2+r^2}$`, Math.log(5) / 2,
    XR`<p>Write $\dfrac r{n^2+r^2}=\dfrac1n\cdot\dfrac{r/n}{1+(r/n)^2}$. With $x=\dfrac rn$ running from $0$ to $2$: the limit is $\int_0^2\dfrac x{1+x^2}dx=\dfrac12\ln(1+x^2)\Big|_0^2=\dfrac{\ln5}2\approx0.80$.</p>`, 'r goes up to 2n, so the upper limit is 2.', () => simp((x) => x / (1 + x * x), 0, 2)),
  D4(4, 'King\'s rule', XR`Find $\displaystyle\int_{\pi/6}^{\pi/3}\frac{dx}{1+\sqrt{\tan x}}$`, Pi / 12,
    XR`<p>Here $a+b=\dfrac\pi2$. Under $x\to\dfrac\pi2-x$, $\tan x\to\cot x$ and the integrand becomes $\dfrac{\sqrt{\tan x}}{1+\sqrt{\tan x}}$. Adding gives $2I=\dfrac\pi3-\dfrac\pi6=\dfrac\pi6$, so $I=\dfrac\pi{12}\approx0.2618$.</p>`, 'The limits add to π/2.', () => simp((x) => 1 / (1 + Math.sqrt(Math.tan(x))), Pi / 6, Pi / 3)),
  D(4, 'greatest integer function', XR`Find $\displaystyle\int_0^\pi[2\sin x]\,dx$`, 2 * Pi / 3,
    XR`<p>$[2\sin x]=1$ when $1\le2\sin x<2$, i.e. $\dfrac\pi6\le x\le\dfrac{5\pi}6$ except $x=\dfrac\pi2$ (a single point). It is $0$ elsewhere in $[0,\pi]$. So the integral is $\dfrac{5\pi}6-\dfrac\pi6=\dfrac{2\pi}3\approx2.09$.</p>`, 'The value 2 is reached only at one point.', () => rie((x) => Math.floor(2 * Math.sin(x)), 0, Pi)),
  D(4, 'integral functions', XR`Let $F(x)=\displaystyle\int_0^x(t^2-3t+2)\,dt$. Find the greatest value of $F$ on $[0,3]$`, 1.5,
    XR`<p>$F(x)=\dfrac{x^3}3-\dfrac{3x^2}2+2x$. $F'(x)=(x-1)(x-2)$. Candidates: $F(0)=0$, $F(1)=\dfrac56\approx0.83$ (local maximum), $F(2)=\dfrac23$ (local minimum), $F(3)=9-13.5+6=1.5$. The greatest value is $F(3)=1.5$ at the endpoint.</p>`, 'The endpoint beats the local maximum.', () => simp((t) => t * t - 3 * t + 2, 0, 3)),
  D(4, 'even and odd', XR`Find $\displaystyle\int_{-\pi/2}^{\pi/2}\left(x^2+\ln\frac{2-x}{2+x}\right)\cos x\,dx$`, Pi * Pi / 2 - 4,
    XR`<p>$\ln\dfrac{2-x}{2+x}$ is odd, and $\cos x$ is even, so that part integrates to $0$. What remains: $2\int_0^{\pi/2}x^2\cos x\,dx=2\left[x^2\sin x+2x\cos x-2\sin x\right]_0^{\pi/2}=2\left(\dfrac{\pi^2}4-2\right)=\dfrac{\pi^2}2-4\approx0.93$.</p>`, 'Odd × even is odd.', () => simp((x) => (x * x + Math.log((2 - x) / (2 + x))) * Math.cos(x), -Pi / 2, Pi / 2)),
  D(4, 'periodic functions', XR`Find $\displaystyle\int_0^{10\pi+\pi/3}|\sin x|\,dx$`, 20.5,
    XR`<p>$|\sin x|$ has period $\pi$ and $\int_0^\pi|\sin x|dx=2$, so $\int_0^{10\pi}=20$. The remaining $\int_0^{\pi/3}\sin x\,dx=1-\cos\dfrac\pi3=\dfrac12$. Total $20.5$.</p>`, 'Use the period π, not 2π.', () => simp((x) => Math.abs(Math.sin(x)), 0, 10 * Pi + Pi / 3, 400000)),
  D(5, 'King\'s rule', XR`Find $\displaystyle\int_{-\pi/4}^{\pi/4}\frac{x+\pi/4}{2-\cos2x}\,dx$`, Pi * Pi / (6 * Math.sqrt(3)),
    XR`<p>Split the numerator: $\dfrac x{2-\cos2x}$ is odd, so it integrates to $0$. What remains: $\dfrac\pi4\int_{-\pi/4}^{\pi/4}\dfrac{dx}{2-\cos2x}=\dfrac\pi4\cdot2\int_0^{\pi/4}\dfrac{dx}{2-\cos2x}$. With $t=\tan x$, $\cos2x=\dfrac{1-t^2}{1+t^2}$ and $2-\cos2x=\dfrac{1+3t^2}{1+t^2}$, $dx=\dfrac{dt}{1+t^2}$, so $\int_0^{\pi/4}\dfrac{dx}{2-\cos2x}=\int_0^1\dfrac{dt}{1+3t^2}=\dfrac1{\sqrt3}\tan^{-1}\sqrt3=\dfrac\pi{3\sqrt3}$. Total: $\dfrac\pi4\cdot2\cdot\dfrac\pi{3\sqrt3}=\dfrac{\pi^2}{6\sqrt3}\approx0.95$.</p>`, 'Remove the odd part first.', () => simp((x) => (x + Pi / 4) / (2 - Math.cos(2 * x)), -Pi / 4, Pi / 4)),
  D(5, 'Leibniz rule', XR`Find $\displaystyle\int_0^1\frac{x^2-1}{\ln x}\,dx$`, Math.log(3),
    XR`<p>Let $I(a)=\int_0^1\dfrac{x^a-1}{\ln x}dx$. Differentiating under the integral sign: $I'(a)=\int_0^1x^a\,dx=\dfrac1{a+1}$ (since $\frac{d}{da}x^a=x^a\ln x$). Also $I(0)=0$. So $I(a)=\ln(a+1)$ and $I(2)=\ln3\approx1.10$.</p>`, 'Differentiate with respect to the parameter a.', () => simp((x) => (x <= 1e-12 ? 0 : Math.abs(1 - x) < 1e-9 ? 2 : (x * x - 1) / Math.log(x)), 0, 1)),
  A(3, 'periodic functions', XR`$\displaystyle\int_0^{2\pi}|\sin x|\,dx=4$.`, XR`$|\sin x|$ has period $\pi$ and $\displaystyle\int_0^\pi\sin x\,dx=2$.`, 0,
    XR`<p>$[0,2\pi]$ holds two periods of $|\sin x|$, each contributing $2$. So the integral is $4$. R gives exactly this.</p>`, 'The period of |sin x| is π.'),
  A(4, 'mean value theorem', XR`If $f$ is continuous on $[0,1]$ and $\displaystyle\int_0^1f(x)\,dx=0$, then $f(c)=0$ for some $c\in[0,1]$.`, XR`A continuous function that is positive everywhere on $[0,1]$ has a positive integral.`, 0,
    XR`<p>If $f$ had no zero, being continuous it would keep one sign on $[0,1]$ (intermediate value theorem), so either $f>0$ everywhere or $f<0$ everywhere. Then the integral is positive (R) or negative, never $0$. So A is true and R supplies the key step.</p>`, 'A continuous function without zeros keeps one sign.'),
  A(5, 'limit using the Leibniz rule', XR`$\displaystyle\lim_{x\to0}\frac1x\int_0^xe^{t^2}\,dt=1$.`, XR`By L'Hôpital's rule and the fundamental theorem, the limit equals $\displaystyle\lim_{x\to0}e^{x^2}$.`, 0,
    XR`<p>The limit has the form $\frac00$. Differentiating the numerator gives $e^{x^2}$ and the denominator gives $1$, so the limit is $e^0=1$. R is that argument.</p>`, 'The derivative of the integral is the integrand at the upper limit.'),
  A(3, 'greatest integer function', XR`$\displaystyle\int_0^2[x]\,dx=1$.`, XR`$[x]=0$ on $[0,1)$ and $[x]=1$ on $[1,2)$.`, 0,
    XR`<p>$\int_0^1 0\,dx+\int_1^21\,dx=1$. R is exactly this split.</p>`, 'The value at the single point 2 does not matter.'),
  S(4, 'King\'s rule', XR`$\displaystyle\int_0^{\pi/2}\ln(\sin x)\,dx=-\dfrac\pi2\ln2$.`, XR`$\displaystyle\int_0^{\pi/2}\ln(\sin x)\,dx=\int_0^{\pi/2}\ln(\cos x)\,dx$.`, 0,
    XR`<p>II follows from $x\to\frac\pi2-x$. Adding the two gives $2I=\int_0^{\pi/2}\ln\left(\dfrac{\sin2x}2\right)dx=\int_0^{\pi/2}\ln\sin2x\,dx-\dfrac\pi2\ln2=I-\dfrac\pi2\ln2$, so $I=-\dfrac\pi2\ln2$. Both true.</p>`, 'The substitution 2x turns the sum back into I.'),
  S(4, 'Leibniz rule', XR`$\dfrac{d}{dx}\displaystyle\int_x^{2x}f(t)\,dt=2f(2x)-f(x)$.`, XR`$\dfrac{d}{dx}\displaystyle\int_x^{2x}f(t)\,dt=f(2x)-f(x)$.`, 1,
    XR`<p>Leibniz rule: derivative of the upper limit $2x$ is $2$, so the term is $f(2x)\cdot2$; the lower limit contributes $-f(x)\cdot1$. Statement I is true, II is false (it misses the factor 2).</p>`, 'Multiply by the derivative of each limit.'),
  S(4, 'inequalities', XR`$\displaystyle\int_0^1x^{2024}\,dx<\int_0^1x^{2023}\,dx$.`, XR`$x^{2024}\le x^{2023}$ for $0\le x\le1$.`, 0,
    XR`<p>II is true because $x^{2023}(x-1)\le0$. Then $\int_0^1x^{2024}dx=\dfrac1{2025}<\dfrac1{2024}=\int_0^1x^{2023}dx$: I is true, and II is the reason.</p>`, 'Higher powers are smaller on [0, 1].'),
  S(5, 'periodic functions', XR`$\displaystyle\int_0^{2\pi}f(\sin x)\,dx=2\int_0^{\pi}f(\sin x)\,dx$ for every continuous $f$.`, XR`$\displaystyle\int_0^{2\pi}f(\cos x)\,dx=2\int_0^{\pi}f(\cos x)\,dx$ for every continuous $f$.`, 2,
    XR`<p>II is true: $\cos(2\pi-x)=\cos x$, so the integrand is symmetric about $x=\pi$. I is false: $\sin(2\pi-x)=-\sin x$; for $f(t)=t$, the left side is $0$ and the right side is $2\cdot2=4$.</p>`, 'sin changes sign across x = π, cos does not mirror it.'),
  SC(5, 'mixed properties', ['If $f$ is continuous and $\\displaystyle\\int_a^bf\\,dx=0$ then $f(c)=0$ for some $c\\in[a,b]$.', '$\\left|\\displaystyle\\int_a^bf\\,dx\\right|\\le\\displaystyle\\int_a^b|f|\\,dx$.', 'If $f\\le g$ on $[a,b]$ then $\\displaystyle\\int_a^bf\\le\\int_a^bg$.', '$\\displaystyle\\int_0^{2a}f(x)\\,dx=2\\int_0^af(x)\\,dx$ for every continuous $f$.'], '3', ['1', '2', '4'],
    XR`<p>(1) true (the intermediate value argument). (2) true. (3) true (monotonicity of the integral). (4) false: it needs $f(2a-x)=f(x)$. Three are correct.</p>`, 'The last needs a symmetry condition.'),
  MT(4, 'powers of sine', 'xm2', 'A-p, B-r, C-q, D-s', ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-p, B-q, C-r, D-s'],
    XR`<p>A: odd function: $0$. B: $\int_0^\pi\sin^3=2\int_0^{\pi/2}\sin^3=2\cdot\dfrac23=\dfrac43$. C: $\dfrac23$. D: $|\sin^3x|$ has period $\pi$, and over $[0,2\pi]$ gives twice $\dfrac43=\dfrac83$.</p>`, '|sin³ x| is positive everywhere.'),
  MT(4, 'derivatives of integrals', 'xm4', 'A-s, B-p, C-r, D-q', ['A-s, B-p, C-q, D-r', 'A-p, B-s, C-r, D-q', 'A-s, B-r, C-p, D-q'],
    XR`<p>A: $e^{x^2}$ at $1$: $e$. B: $f(t)=t$: $x^2\cdot2x-x\cdot1=2x^3-x$, at $1$: $1$. C: $\dfrac1{x^3}\cdot3x^2=\dfrac3x$: $3$. D: $\int_{-x}^xt^2dt=\dfrac{2x^3}3$, derivative $2x^2=2$.</p>`, 'Evaluate after differentiating.'),
  MT(4, 'Wallis and Beta values', 'xm5', 'A-q, B-r, C-s, D-p', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-q, B-s, C-r, D-p'],
    XR`<p>A: $\dfrac{3\cdot1}{4\cdot2}\cdot\dfrac\pi2=\dfrac{3\pi}{16}$. B: $\dfrac{4\cdot2}{5\cdot3}=\dfrac8{15}$. C: $\dfrac{1!\,3!}{5!}=\dfrac1{20}$. D: $\dfrac{1\cdot1}{4\cdot2}\cdot\dfrac\pi2=\dfrac\pi{16}$.</p>`, 'For two even powers there is a π.'),
  MT(4, 'mean values', 'xm8', 'A-r, B-q, C-p, D-s', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s'],
    XR`<p>Mean value $=\dfrac1\pi\int_0^\pi f$. A: $\dfrac2\pi$. B: $\dfrac1\pi\cdot\dfrac\pi2=\dfrac12$. C: $0$. D: $\dfrac1\pi\cdot\dfrac{\pi^2}2=\dfrac\pi2$.</p>`, 'Divide the integral by the length π.'),
  // ---- passages ----
  PI(3, 'integral functions', 'xp1', XR`Find $g(6)$.`, 18,
    XR`<p>$g(x)=\dfrac{x^3}3-\dfrac{3x^2}2$. $g(6)=72-54=18$.</p>`, 'Expand t(t − 3) first.', () => simp((t) => t * (t - 3), 0, 6)),
  PN(4, 'integral functions', 'xp1', XR`Find the least value of $g$ on $[0,6]$ (1 decimal place).`, -4.5, 0.05,
    XR`<p>$g'(x)=x(x-3)$ is negative on $(0,3)$ and positive after, so $g$ decreases until $x=3$ and then increases. The least value is $g(3)=9-\dfrac{27}2=-4.5$ (the endpoints give $g(0)=0$, $g(6)=18$).</p>`, 'Compare with the endpoints.', () => simp((t) => t * (t - 3), 0, 3)),
  PI(5, 'integral functions', 'xp1', XR`How many $x\in[0,6]$ satisfy $g(x)=0$?`, 2,
    XR`<p>$g(x)=\dfrac{x^2}6(2x-9)$, which is $0$ at $x=0$ and $x=4.5$. Both lie in $[0,6]$: $2$ solutions.</p>`, 'x = 0 counts.', () => 2),
  PI(4, 'King\'s rule', 'xp2', XR`Find $\displaystyle\int_1^5f(x)\,dx$.`, 2,
    XR`<p>Let $I=\int_1^5\dfrac{\ln(6-x)}{\ln x+\ln(6-x)}dx$. Replace $x$ by $6-x$: $I=\int_1^5\dfrac{\ln x}{\ln(6-x)+\ln x}dx$. Adding the two forms: $2I=\int_1^51\,dx=4$, so $I=2$.</p>`, 'The two forms add to the integral of 1.', () => simp((x) => Math.log(6 - x) / (Math.log(x) + Math.log(6 - x)), 1, 5)),
  PI(5, 'King\'s rule', 'xp2', XR`Find $\displaystyle\int_1^5\frac{3\ln x+5\ln(6-x)}{\ln x+\ln(6-x)}\,dx$.`, 16,
    XR`<p>The integral of $\dfrac{\ln x}{\ln x+\ln(6-x)}$ over $[1,5]$ is $2$ (by the same pairing), and so is the integral of $\dfrac{\ln(6-x)}{\ldots}$. The required integral is $3\cdot2+5\cdot2=16$.</p>`, 'Each part is worth half the length of the interval.', () => simp((x) => (3 * Math.log(x) + 5 * Math.log(6 - x)) / (Math.log(x) + Math.log(6 - x)), 1, 5)),
  PM(5, 'King\'s rule', 'xp2', XR`$\displaystyle\int_1^5\frac{\ln x-\ln(6-x)}{\ln x+\ln(6-x)}\,dx$ equals`, '$0$', ['$2$', '$4$', '$-2$'],
    XR`<p>This is $\int\dfrac{\ln x}{\ldots}-\int\dfrac{\ln(6-x)}{\ldots}=2-2=0$. Equivalently, under $x\to6-x$ the integrand changes sign, so the integral equals its own negative.</p>`, 'The integrand is odd about x = 3.'),
);
gens.push(
  GX('di-g23', 3, 'nat', 'numeric', 'Wallis formula', (rng) => {
    const m = int(rng, 1, 6), n = int(rng, 0, 6); const dfac = (k) => { let r = 1; for (let i = k; i > 1; i -= 2) r *= i; return r; };
    const val = (dfac(m - 1) * dfac(n - 1)) / dfac(m + n) * (m % 2 === 0 && n % 2 === 0 ? Math.PI / 2 : 1);
    const both = m % 2 === 0 && n % 2 === 0;
    return { m, n, answer: +val.toFixed(4), tol: 0.0005, q: XR`Find $\displaystyle\int_0^{\pi/2}\sin^{${m}}x\cos^{${n}}x\,dx$ (4 decimal places).`,
      sol: XR`<p>Wallis formula with $m=${m}$, $n=${n}$: $\dfrac{(${m - 1})!!\,(${n - 1})!!}{(${m + n})!!}${both ? '\\cdot\\dfrac\\pi2' : ''}\approx${val.toFixed(4)}$. ${both ? 'Both powers are even, so $\\frac\\pi2$ appears.' : 'At least one power is odd, so there is no $\\pi$.'} (Here $k!!$ is the product $k(k-2)(k-4)\\cdots$ down to 1 or 2, with $(-1)!!=(0)!!=1$.)</p>` };
  }, (p) => simp((x) => Math.sin(x) ** p.m * Math.cos(x) ** p.n, 0, Math.PI / 2)),
  GX('di-g24', 3, 'nat', 'integer', 'greatest integer function', (rng) => {
    const k = int(rng, 4, 12), c = int(rng, 1, 3);
    return { k, c, answer: c * k * (k - 1) / 2, tol: 0, q: XR`Find $\displaystyle\int_0^{${k}}${c === 1 ? '' : c}[x]\,dx$, where $[x]$ is the greatest integer function.`,
      sol: XR`<p>On $[j,j+1)$ the integrand is $${c === 1 ? '' : c + '\\cdot '}j$. So the integral is $${c === 1 ? '' : c + '\\cdot '}(0+1+\dots+${k - 1})=${c === 1 ? '' : c + '\\cdot ' + k * (k - 1) / 2 + '='}${c * k * (k - 1) / 2}$.</p>` };
  }, (p) => { let s = 0; for (let j = 0; j < p.k; j++) s += p.c * j; return s; }),
  GX('di-g25', 4, 'nat', 'numeric', 'King\'s rule', (rng) => {
    const a = int(rng, 1, 4), b = a + int(rng, 2, 6), pw = int(rng, 1, 3); const ans = (b - a) / 2;
    return { a, b, pw, answer: ans, tol: 0.01, q: XR`Find $\displaystyle\int_{${a}}^{${b}}\frac{x^{${pw}}}{x^{${pw}}+(${a + b}-x)^{${pw}}}\,dx$ (2 decimal places).`,
      sol: XR`<p>Here $a+b=${a + b}$. Let $I$ be the integral. Replacing $x$ by $${a + b}-x$ gives $I=\int_{${a}}^{${b}}\dfrac{(${a + b}-x)^{${pw}}}{(${a + b}-x)^{${pw}}+x^{${pw}}}dx$. Adding the two forms: $2I=\int_{${a}}^{${b}}1\,dx=${b - a}$, so $I=${ans}$.</p>` };
  }, (p) => simp((x) => x ** p.pw / (x ** p.pw + (p.a + p.b - x) ** p.pw), p.a, p.b)),
  GX('di-g26', 4, 'nat', 'integer', 'odd functions', (rng) => {
    const a = choose(rng, [3, 6]); const c0 = int(rng, 1, 5), c1 = int(rng, 1, 6), c2 = int(rng, 1, 4), c3 = int(rng, 1, 5);
    const ans = 2 * (c0 * a + c2 * a ** 3 / 3);
    return { a, c0, c1, c2, c3, answer: ans, tol: 0, q: XR`Find $\displaystyle\int_{-${a}}^{${a}}\left(${c3}x^3+${c2}x^2+${c1}x+${c0}\right)dx$.`,
      sol: XR`<p>The terms $${c3}x^3$ and $${c1}x$ are odd and integrate to $0$. The even part gives $2\int_0^{${a}}(${c2}x^2+${c0})dx=2\left[\dfrac{${c2}x^3}3+${c0}x\right]_0^{${a}}=2\left(${c2 * a ** 3 / 3}+${c0 * a}\right)=${ans}$.</p>` };
  }, (p) => Math.round(rie((x) => p.c3 * x ** 3 + p.c2 * x ** 2 + p.c1 * x + p.c0, -p.a, p.a, 200000))),
  GX('di-g27', 4, 'mcq', 'single', 'Leibniz rule', (rng) => {
    const c = int(rng, 1, 2), k = int(rng, 1, 4); const f = (t) => t * t + k;
    const Fp = (x) => 2 * x * f(x * x) - f(x); const ok = Fp(c);
    const wrongs = [f(c * c) - f(c), 2 * c * f(c * c), 2 * c * f(c * c) + f(c)];
    const { options, answer } = shuffleOpts(rng, `${ok}`, wrongs.map(String));
    return { c, k, ok, options, answer, q: XR`$F(x)=\displaystyle\int_x^{x^2}(t^2+${k})\,dt$. Then $F'(${c})$ equals`,
      sol: XR`<p>Leibniz rule: $F'(x)=f(x^2)\cdot2x-f(x)\cdot1$ with $f(t)=t^2+${k}$. So $F'(x)=2x(x^4+${k})-(x^2+${k})$. At $x=${c}$: $${2 * c}(${c ** 4 + k})-(${c * c + k})=${ok}$.</p>` };
  }, (p) => { const F = (x) => simp((t) => t * t + p.k, x, x * x, 2000); const d = (F(p.c + 1e-4) - F(p.c - 1e-4)) / 2e-4; return Math.abs(d - p.ok) < 1e-4 ? p.answer : -1; }),
  GX('di-g28', 4, 'nat', 'numeric', 'area between curves', (rng) => {
    const a = int(rng, 2, 7); const ans = a ** 3 / 6;
    return { a, answer: +ans.toFixed(3), tol: 0.01, q: XR`Find the area enclosed by $y=x^2$ and $y=${a}x$ (2 decimal places).`,
      sol: XR`<p>They meet where $x^2=${a}x$, i.e. $x=0$ and $x=${a}$. Area $=\int_0^{${a}}(${a}x-x^2)\,dx=\dfrac{${a}\cdot${a * a}}2-\dfrac{${a ** 3}}3=\dfrac{${a ** 3}}6\approx${ans.toFixed(2)}$.</p>` };
  }, (p) => simp((x) => p.a * x - x * x, 0, p.a)),
  GX('di-g29', 4, 'nat', 'integer', 'periodic functions', (rng) => {
    const n = int(rng, 2, 25), k = int(rng, 1, 5);
    return { n, k, answer: 2 * n, tol: 0, q: XR`Find $\displaystyle\int_0^{${n}\pi}|\sin ${k === 1 ? '' : k}x|\,dx$.`,
      sol: XR`<p>The function $|\sin ${k === 1 ? '' : k}x|$ has ${k} equal humps on $[0,\pi]$, each of area $\dfrac2${k}$, so $\int_0^\pi|\sin ${k === 1 ? '' : k}x|\,dx=2$. The interval $[0,${n}\pi]$ holds ${n} such blocks: $2\cdot${n}=${2 * n}$.</p>` };
  }, (p) => Math.round(simp((x) => Math.abs(Math.sin(p.k * x)), 0, p.n * Math.PI, 400000))),
  GX('di-g30', 5, 'nat', 'numeric', 'King\'s rule', (rng) => {
    const a = choose(rng, [1, 2, 3, 4]); const ans = Math.PI * Math.atan(1 / Math.sqrt(a)) / Math.sqrt(a);
    return { a, answer: +ans.toFixed(3), tol: 0.01, q: XR`Find $\displaystyle\int_0^\pi\frac{x\sin x}{${a}+\cos^2x}\,dx$ (2 decimal places).`,
      sol: XR`<p>Use $x\to\pi-x$: $I=\dfrac\pi2\int_0^\pi\dfrac{\sin x}{${a}+\cos^2x}dx$. With $u=\cos x$: $\int_{-1}^{1}\dfrac{du}{${a}+u^2}=\dfrac2{\sqrt{${a}}}\tan^{-1}\dfrac1{\sqrt{${a}}}$. So $I=\dfrac{\pi}{\sqrt{${a}}}\tan^{-1}\dfrac1{\sqrt{${a}}}\approx${ans.toFixed(2)}$.</p>` };
  }, (p) => simp((x) => x * Math.sin(x) / (p.a + Math.cos(x) ** 2), 0, Math.PI)),
  GX('di-g31', 3, 'mcq', 'single', 'modulus integrand', (rng) => {
    const a = int(rng, 0, 3), c = a + int(rng, 1, 4), b = c + int(rng, 1, 4); const ans = ((c - a) ** 2 + (b - c) ** 2) / 2;
    const { options, answer } = shuffleOpts(rng, fmt(ans), [fmt((b - a) ** 2 / 2), fmt(0), fmt(((c - a) ** 2 - (b - c) ** 2) / 2 === ans ? ans + 1 : ((c - a) ** 2 - (b - c) ** 2) / 2)]);
    return { a, b, c, ans, options, answer, q: XR`$\displaystyle\int_{${a}}^{${b}}|x-${c}|\,dx$ equals`,
      sol: XR`<p>The graph of $|x-${c}|$ makes two triangles: one on $[${a},${c}]$ with area $\dfrac{(${c - a})^2}2$ and one on $[${c},${b}]$ with area $\dfrac{(${b - c})^2}2$. Total $=${fmt(ans)}$.</p>` };
  }, (p) => (Math.abs(rie((x) => Math.abs(x - p.c), p.a, p.b, 100000) - p.ans) < 1e-3 ? p.answer : -1)),
);

}
// ==XP-END
export default { topic: 'definite-integrals', groups, items, gens };
