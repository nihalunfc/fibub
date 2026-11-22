// Indefinite integrals (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Every antiderivative is checked in code: each mcq item carries a `calc` that differentiates the options numerically
// at several points and returns the one option whose derivative is the integrand; nat items recompute their answers
// by differentiation, Simpson's rule or a fine search, and the templates' verify() recompute their answers another way.
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
// ids are filled in order at the end. CUET rule: Class 12 level 1-3 mcq also list 'cuet'.
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
const GEXS = (level, type) => [...EXS[level], ...(type === 'mcq' && level <= 3 ? ['cuet'] : [])];
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });
const r4 = (x) => +x.toFixed(4);
const r2 = (x) => +x.toFixed(2);
const TWOD = ' (2 decimal places)';
const D = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const PD = (level, sub, group, q, answer, sol, trap, more = {}) => PN(level, sub, group, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
/** mcq whose options are plain text; calc re-derives the option text from an independent computation */
const MC = (level, sub, q, compute, wrongs, sol, trap, more = {}) => {
  const correct = String(compute());
  const it = M(level, sub, q, correct, wrongs.map(String), sol, trap, more);
  it.calc = () => it.options.indexOf(String(compute()));
  return it;
};
const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, exp = Math.exp, ln = Math.log, tan = Math.tan, atan = Math.atan, abs = Math.abs, PI_ = Math.PI, E_ = Math.E;
const dd = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
/** Simpson's rule */
const simp = (f, a, b, n = 20000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; };
/** minimiser / maximiser of f on [a,b] by fine grid */
const argmin = (f, a, b, n = 200000) => { let bx = a, bv = f(a); for (let i = 1; i <= n; i++) { const x = a + ((b - a) * i) / n; const v = f(x); if (v < bv) { bv = v; bx = x; } } return bx; };
const argmax = (f, a, b, n = 200000) => argmin((x) => -f(x), a, b, n);
const sgn = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const lin = (m, c) => `${m === 1 ? '' : m === -1 ? '-' : m}x${c < 0 ? '-' : '+'}${Math.abs(c)}`;

const DPTS = [0.4, 0.8, 1.3, 1.9, 2.6];
const matches = (F, f, pts) => pts.every((x) => { const d = dd(F, x, 1e-5); const t = f(x); return Number.isFinite(d) && Math.abs(d - t) <= 2e-5 * (1 + Math.abs(t)); });
/** Q: the question line for an integral */
const Q = (tex) => `$\\displaystyle\\int ${tex}\\,dx$ equals`;
/** mcq whose options are antiderivatives; calc differentiates every option and returns the unique one that matches f. */
const IM = (level, sub, q, f, ok, bad, sol, trap, pts = DPTS, more = {}) => {
  const txt = (t) => `$${t}+C$`;
  const it = M(level, sub, q, txt(ok[0]), bad.map((b) => txt(b[0])), sol, trap, more);
  const fs = new Map([[txt(ok[0]), ok[1]], ...bad.map((b) => [txt(b[0]), b[1]])]);
  it.calc = () => { const hit = it.options.map((o, i) => (matches(fs.get(o), f, pts) ? i : -1)).filter((i) => i >= 0); return hit.length === 1 ? hit[0] : -1; };
  return it;
};
const pw = Math.pow, asin = Math.asin, acos = Math.acos;
const cot = (x) => 1 / tan(x), sec = (x) => 1 / cos(x), csc = (x) => 1 / sin(x);
const ILATE = ['I', 'L', 'A', 'T', 'E'];

const groups = {
  m1: {
    title: 'Which method?',
    passage: R`<p>Match each integral in List I with the method that works best, from List II.</p>`,
    list1: [R`A. $\displaystyle\int xe^{x^2}\,dx$`, R`B. $\displaystyle\int x\cos x\,dx$`, R`C. $\displaystyle\int\frac{dx}{x^2-4}$`, R`D. $\displaystyle\int\frac{dx}{\sqrt{9-x^2}}$`],
    list2: ['p. Integration by parts', 'q. Substitution $u=x^2$', 'r. Partial fractions', 's. Standard form (inverse sine)'],
  },
  m2: {
    title: 'Standard results',
    passage: R`<p>Match each integral in List I with its value (omitting $+C$) from List II.</p>`,
    list1: [R`A. $\displaystyle\int\frac{dx}{1+x^2}$`, R`B. $\displaystyle\int\frac{dx}{x\ln x}$`, R`C. $\displaystyle\int\tan x\,dx$`, R`D. $\displaystyle\int\sec^2x\,dx$`],
    list2: [R`p. $-\ln|\cos x|$`, R`q. $\tan x$`, R`r. $\ln|\ln x|$`, R`s. $\tan^{-1}x$`],
  },
  m3: {
    title: 'Integrals of the form 1/(ax^2+bx+c)',
    passage: R`<p>Match each integral in List I with its value (omitting $+C$) from List II.</p>`,
    list1: [R`A. $\displaystyle\int\frac{dx}{x^2+4}$`, R`B. $\displaystyle\int\frac{dx}{x^2-4}$`, R`C. $\displaystyle\int\frac{dx}{4-x^2}$`, R`D. $\displaystyle\int\frac{dx}{x^2+2x+5}$`],
    list2: [R`p. $\dfrac14\ln\left|\dfrac{x-2}{x+2}\right|$`, R`q. $\dfrac12\tan^{-1}\dfrac{x+1}2$`, R`r. $\dfrac12\tan^{-1}\dfrac x2$`, R`s. $\dfrac14\ln\left|\dfrac{2+x}{2-x}\right|$`],
  },
  m4: {
    title: 'Choose u by ILATE',
    passage: R`<p>For integration by parts, match each integral in List I with the function to take as $u$ (first), from List II.</p>`,
    list1: [R`A. $\displaystyle\int x^2\ln x\,dx$`, R`B. $\displaystyle\int x\,e^{3x}\,dx$`, R`C. $\displaystyle\int\tan^{-1}x\,dx$`, R`D. $\displaystyle\int x^3\sin x\,dx$`],
    list2: [R`p. $x^3$`, R`q. $x$`, R`r. $\ln x$`, R`s. $\tan^{-1}x$`],
  },
  p1: {
    title: 'Passage: a velocity and a path',
    passage: R`<p>A particle moves on a line with velocity $v(t)=6t^2-4t+1$ (m/s). At $t=0$ it is at position $s=2$ m. Position is the antiderivative of velocity.</p>`,
  },
  p2: {
    title: 'Passage: by parts twice',
    passage: R`<p>Let $I=\displaystyle\int e^{x}\sin x\,dx$ and $J=\displaystyle\int e^{x}\cos x\,dx$.</p>`,
  },
  p3: {
    title: 'Passage: partial fractions',
    passage: R`<p>Write $\dfrac{5x+7}{(x+1)(x+3)}=\dfrac A{x+1}+\dfrac B{x+3}$ and integrate.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  IM(1, 'standard forms', Q('x^5'), (x) => x ** 5, [R`\dfrac{x^6}6`, (x) => x ** 6 / 6], [[R`x^6`, (x) => x ** 6], [R`5x^4`, (x) => 5 * x ** 4], [R`\dfrac{x^6}5`, (x) => x ** 6 / 5]],
    R`<p>$\int x^n\,dx=\dfrac{x^{n+1}}{n+1}$ with $n=5$: $\dfrac{x^6}6$.</p>`, 'Divide by the new power, 6, not the old one.'),
  IM(1, 'standard forms', Q('(3x^2+2x)'), (x) => 3 * x * x + 2 * x, [R`x^3+x^2`, (x) => x ** 3 + x * x], [[R`6x+2`, (x) => 6 * x + 2], [R`x^3+x`, (x) => x ** 3 + x], [R`3x^3+2x^2`, (x) => 3 * x ** 3 + 2 * x * x]],
    R`<p>Term by term: $\int3x^2dx=x^3$, $\int2x\,dx=x^2$.</p>`, 'Integrating is the reverse of differentiating, not a second derivative.'),
  IM(1, 'exponential', Q('e^{2x}'), (x) => exp(2 * x), [R`\dfrac{e^{2x}}2`, (x) => exp(2 * x) / 2], [[R`2e^{2x}`, (x) => 2 * exp(2 * x)], [R`e^{2x}`, (x) => exp(2 * x)], [R`\dfrac{e^{2x}}{2x}`, (x) => exp(2 * x) / (2 * x)]],
    R`<p>$\int e^{ax}dx=\dfrac{e^{ax}}a$. Here $a=2$.</p>`, 'The chain rule factor comes back as a division.'),
  IM(1, 'trigonometric', Q('\\cos3x'), (x) => cos(3 * x), [R`\dfrac{\sin3x}3`, (x) => sin(3 * x) / 3], [[R`3\sin3x`, (x) => 3 * sin(3 * x)], [R`-\dfrac{\sin3x}3`, (x) => -sin(3 * x) / 3], [R`\sin3x`, (x) => sin(3 * x)]],
    R`<p>$\int\cos ax\,dx=\dfrac{\sin ax}a$.</p>`, 'Do not multiply by 3; divide.'),
  IM(1, 'trigonometric', Q('\\sec^2x'), (x) => 1 / cos(x) ** 2, [R`\tan x`, tan], [[R`\sec x`, sec], [R`-\cot x`, (x) => -cot(x)], [R`\sec x\tan x`, (x) => sec(x) * tan(x)]],
    R`<p>$\dfrac d{dx}\tan x=\sec^2x$, so the integral is $\tan x$.</p>`, '$\\sec x$ differentiates to $\\sec x\\tan x$.', [0.2, 0.5, 0.9, 1.2]),
  IM(1, 'standard forms', Q('\\dfrac1{\\sqrt x}'), (x) => 1 / sqrt(x), [R`2\sqrt x`, (x) => 2 * sqrt(x)], [[R`\dfrac{\sqrt x}2`, (x) => sqrt(x) / 2], [R`-\dfrac1{2x^{3/2}}`, (x) => -1 / (2 * x ** 1.5)], [R`\dfrac2{\sqrt x}`, (x) => 2 / sqrt(x)]],
    R`<p>$\int x^{-1/2}dx=\dfrac{x^{1/2}}{1/2}=2\sqrt x$.</p>`, 'Dividing by $\\tfrac12$ means multiplying by 2.'),
  IM(1, 'inverse trigonometric', Q('\\dfrac1{1+x^2}'), (x) => 1 / (1 + x * x), [R`\tan^{-1}x`, atan], [[R`\cot^{-1}x`, (x) => PI_ / 2 - atan(x) + 0 * x], [R`\ln(1+x^2)`, (x) => ln(1 + x * x)], [R`\dfrac x{1+x^2}`, (x) => x / (1 + x * x)]],
    R`<p>$\dfrac d{dx}\tan^{-1}x=\dfrac1{1+x^2}$. ($\cot^{-1}x$ has derivative $-\dfrac1{1+x^2}$.)</p>`, 'Watch the sign: $\\cot^{-1}$ gives the negative.'),
  IM(1, 'algebraic', Q('\\left(x+\\dfrac1x\\right)^2'), (x) => (x + 1 / x) ** 2, [R`\dfrac{x^3}3+2x-\dfrac1x`, (x) => x ** 3 / 3 + 2 * x - 1 / x], [[R`\dfrac{x^3}3+2x+\dfrac1x`, (x) => x ** 3 / 3 + 2 * x + 1 / x], [R`\dfrac13\left(x+\dfrac1x\right)^3`, (x) => (x + 1 / x) ** 3 / 3], [R`\dfrac{x^3}3+2x+\ln x`, (x) => x ** 3 / 3 + 2 * x + ln(x)]],
    R`<p>Expand: $x^2+2+\dfrac1{x^2}$. Integrate: $\dfrac{x^3}3+2x-\dfrac1x$.</p>`, 'Expand first; $\\int(f)^2\\ne\\dfrac{(\\int f)^2}{\\cdot}$.'),
  IM(1, 'exponential', Q('2^x'), (x) => 2 ** x, [R`\dfrac{2^x}{\ln2}`, (x) => 2 ** x / ln(2)], [[R`2^x`, (x) => 2 ** x], [R`2^x\ln2`, (x) => 2 ** x * ln(2)], [R`x\,2^{x-1}`, (x) => x * 2 ** (x - 1)]],
    R`<p>$\int a^xdx=\dfrac{a^x}{\ln a}$.</p>`, 'Divide by $\\ln a$; do not multiply.'),
  IM(1, 'trigonometric', Q('\\sec x\\tan x'), (x) => sec(x) * tan(x), [R`\sec x`, sec], [[R`\tan x`, tan], [R`-\sec x`, (x) => -sec(x)], [R`\dfrac{\tan^2x}2`, (x) => tan(x) ** 2 / 2]],
    R`<p>$\dfrac d{dx}\sec x=\sec x\tan x$.</p>`, '$\\tan^2x/2$ differentiates to $\\tan x\\sec^2x$.', [0.2, 0.5, 0.9, 1.2]),
  IM(1, 'substitution', Q('(2x+3)^4'), (x) => (2 * x + 3) ** 4, [R`\dfrac{(2x+3)^5}{10}`, (x) => (2 * x + 3) ** 5 / 10], [[R`\dfrac{(2x+3)^5}5`, (x) => (2 * x + 3) ** 5 / 5], [R`(2x+3)^5`, (x) => (2 * x + 3) ** 5], [R`4(2x+3)^3`, (x) => 4 * (2 * x + 3) ** 3]],
    R`<p>Put $u=2x+3$, $du=2\,dx$: $\dfrac12\int u^4du=\dfrac{u^5}{10}$.</p>`, 'The inner derivative $2$ must be divided out as well: $5\\times2=10$.'),
  IM(1, 'substitution', Q('xe^{x^2}'), (x) => x * exp(x * x), [R`\dfrac{e^{x^2}}2`, (x) => exp(x * x) / 2], [[R`e^{x^2}`, (x) => exp(x * x)], [R`2e^{x^2}`, (x) => 2 * exp(x * x)], [R`\dfrac{x^2e^{x^2}}2`, (x) => x * x * exp(x * x) / 2]],
    R`<p>Put $u=x^2$, $du=2x\,dx$: $\dfrac12\int e^udu=\dfrac{e^{x^2}}2$.</p>`, 'The $x$ in front is half of $du$.'),
  IM(1, 'trigonometric', Q('\\tan x'), (x) => tan(x), [R`-\ln|\cos x|`, (x) => -ln(abs(cos(x)))], [[R`\ln|\cos x|`, (x) => ln(abs(cos(x)))], [R`\sec^2x`, (x) => 1 / cos(x) ** 2], [R`\ln|\sin x|`, (x) => ln(abs(sin(x)))]],
    R`<p>$\tan x=\dfrac{\sin x}{\cos x}$. With $u=\cos x$, $du=-\sin x\,dx$: $-\int\dfrac{du}u=-\ln|\cos x|$.</p>`, 'The sign is negative; equivalently $\\ln|\\sec x|$.', [0.2, 0.5, 0.9, 1.2]),
  IM(1, 'trigonometric', Q('\\sin^2x'), (x) => sin(x) ** 2, [R`\dfrac x2-\dfrac{\sin2x}4`, (x) => x / 2 - sin(2 * x) / 4], [[R`\dfrac x2+\dfrac{\sin2x}4`, (x) => x / 2 + sin(2 * x) / 4], [R`\dfrac{\sin^3x}3`, (x) => sin(x) ** 3 / 3], [R`-\dfrac{\cos2x}2`, (x) => -cos(2 * x) / 2]],
    R`<p>$\sin^2x=\dfrac{1-\cos2x}2$. Integrate: $\dfrac x2-\dfrac{\sin2x}4$.</p>`, 'Minus sign for $\\sin^2$, plus for $\\cos^2$.'),
  IM(1, 'logarithmic', Q('\\dfrac1{x+3}'), (x) => 1 / (x + 3), [R`\ln|x+3|`, (x) => ln(abs(x + 3))], [[R`-\dfrac1{(x+3)^2}`, (x) => -1 / (x + 3) ** 2], [R`\ln|x|+3`, (x) => ln(abs(x))], [R`\dfrac{x+3}{x}`, (x) => (x + 3) / x]],
    R`<p>$\int\dfrac{dx}{x+a}=\ln|x+a|$.</p>`, 'The constant stays inside the logarithm.'),
  IM(1, 'exponential', Q('\\left(e^x+e^{-x}\\right)'), (x) => exp(x) + exp(-x), [R`e^x-e^{-x}`, (x) => exp(x) - exp(-x)], [[R`e^x+e^{-x}`, (x) => exp(x) + exp(-x)], [R`e^x+\dfrac{e^{-x}}{x}`, (x) => exp(x) + exp(-x) / x], [R`-e^x-e^{-x}`, (x) => -exp(x) - exp(-x)]],
    R`<p>$\int e^xdx=e^x$ and $\int e^{-x}dx=-e^{-x}$.</p>`, '$e^{-x}$ integrates to $-e^{-x}$ (the chain-rule sign).'),
  IM(1, 'trigonometric', Q('\\operatorname{cosec}^2x'), (x) => 1 / sin(x) ** 2, [R`-\cot x`, (x) => -cot(x)], [[R`\cot x`, cot], [R`\operatorname{cosec}x`, csc], [R`-\operatorname{cosec}x\cot x`, (x) => -csc(x) * cot(x)]],
    R`<p>$\dfrac d{dx}\cot x=-\operatorname{cosec}^2x$, so $\int\operatorname{cosec}^2x\,dx=-\cot x$.</p>`, 'The cotangent derivative carries a minus sign.', [0.5, 1, 1.5, 2]),

  // ---------- L2 standard ----------
  IM(2, 'substitution', Q('x\\sqrt{x^2+1}'), (x) => x * sqrt(x * x + 1), [R`\dfrac{(x^2+1)^{3/2}}3`, (x) => (x * x + 1) ** 1.5 / 3], [[R`\dfrac{(x^2+1)^{3/2}}{3/2}`, (x) => (x * x + 1) ** 1.5 / 1.5], [R`\dfrac{2(x^2+1)^{3/2}}3`, (x) => 2 * (x * x + 1) ** 1.5 / 3], [R`\dfrac{x^2}2\sqrt{x^2+1}`, (x) => x * x * sqrt(x * x + 1) / 2]],
    R`<p>Put $u=x^2+1$, $du=2x\,dx$. $\dfrac12\int u^{1/2}du=\dfrac12\cdot\dfrac{u^{3/2}}{3/2}=\dfrac{u^{3/2}}3$.</p>`, 'The $\\tfrac12$ from $du$ cancels the $\\tfrac32$ in only one way: $\\tfrac12\\cdot\\tfrac23=\\tfrac13$.'),
  IM(2, 'substitution', Q('\\dfrac x{x^2+4}'), (x) => x / (x * x + 4), [R`\dfrac12\ln(x^2+4)`, (x) => ln(x * x + 4) / 2], [[R`\ln(x^2+4)`, (x) => ln(x * x + 4)], [R`\dfrac12\tan^{-1}\dfrac x2`, (x) => atan(x / 2) / 2], [R`-\dfrac1{x^2+4}`, (x) => -1 / (x * x + 4)]],
    R`<p>The numerator is half the derivative of the denominator. $u=x^2+4$: $\dfrac12\int\dfrac{du}u=\dfrac12\ln(x^2+4)$ (no modulus needed: positive).</p>`, 'Numerator $x$ gives a log; a constant numerator would give $\\tan^{-1}$.'),
  IM(2, 'by parts', Q('xe^x'), (x) => x * exp(x), [R`(x-1)e^x`, (x) => (x - 1) * exp(x)], [[R`(x+1)e^x`, (x) => (x + 1) * exp(x)], [R`xe^x`, (x) => x * exp(x)], [R`\dfrac{x^2}2e^x`, (x) => x * x * exp(x) / 2]],
    R`<p>Take $u=x$, $dv=e^xdx$: $xe^x-\int e^xdx=xe^x-e^x=(x-1)e^x$. (Check: $(x-1)e^x$ differentiates to $xe^x$.)</p>`, 'ILATE: algebraic before exponential.'),
  IM(2, 'by parts', Q('\\ln x'), (x) => ln(x), [R`x\ln x-x`, (x) => x * ln(x) - x], [[R`x\ln x+x`, (x) => x * ln(x) + x], [R`\dfrac1x`, (x) => 1 / x], [R`x\ln x`, (x) => x * ln(x)]],
    R`<p>Write $\ln x=1\cdot\ln x$; $u=\ln x$, $dv=dx$: $x\ln x-\int x\cdot\dfrac1xdx=x\ln x-x$.</p>`, 'Treat the integrand as $1\\cdot\\ln x$.'),
  IM(2, 'by parts', Q('x\\cos x'), (x) => x * cos(x), [R`x\sin x+\cos x`, (x) => x * sin(x) + cos(x)], [[R`x\sin x-\cos x`, (x) => x * sin(x) - cos(x)], [R`\dfrac{x^2}2\sin x`, (x) => x * x * sin(x) / 2], [R`-x\sin x+\cos x`, (x) => -x * sin(x) + cos(x)]],
    R`<p>$u=x$, $dv=\cos x\,dx$: $x\sin x-\int\sin x\,dx=x\sin x+\cos x$.</p>`, '$\\int\\sin x\\,dx=-\\cos x$, and subtracting it gives $+\\cos x$.'),
  IM(2, 'partial fractions', Q('\\dfrac1{(x+1)(x+2)}'), (x) => 1 / ((x + 1) * (x + 2)), [R`\ln\left|\dfrac{x+1}{x+2}\right|`, (x) => ln(abs((x + 1) / (x + 2)))], [[R`\ln\left|\dfrac{x+2}{x+1}\right|`, (x) => ln(abs((x + 2) / (x + 1)))], [R`\ln|(x+1)(x+2)|`, (x) => ln(abs((x + 1) * (x + 2)))], [R`-\dfrac1{(x+1)^2(x+2)^2}`, (x) => -1 / ((x + 1) ** 2 * (x + 2) ** 2)]],
    R`<p>$\dfrac1{(x+1)(x+2)}=\dfrac1{x+1}-\dfrac1{x+2}$ (check at $x=0$: $1-\tfrac12=\tfrac12$). Integrate: $\ln|x+1|-\ln|x+2|$.</p>`, 'The sign of the second term is negative.'),
  IM(2, 'trigonometric', Q('\\sin x\\cos x'), (x) => sin(x) * cos(x), [R`\dfrac{\sin^2x}2`, (x) => sin(x) ** 2 / 2], [[R`\dfrac{\cos^2x}2`, (x) => cos(x) ** 2 / 2], [R`-\dfrac{\cos2x}2`, (x) => -cos(2 * x) / 2], [R`\sin^2x`, (x) => sin(x) ** 2]],
    R`<p>$u=\sin x$, $du=\cos x\,dx$: $\int u\,du=\dfrac{\sin^2x}2$. (Also $=-\dfrac{\cos2x}4$; the option $-\dfrac{\cos2x}2$ is twice that, so wrong. $\dfrac{\cos^2x}2$ differs in sign.)</p>`, 'The answers $\\tfrac{\\sin^2x}2$, $-\\tfrac{\\cos^2x}2$ and $-\\tfrac{\\cos2x}4$ differ only by constants.'),
  IM(2, 'trigonometric', Q('\\cos^2x'), (x) => cos(x) ** 2, [R`\dfrac x2+\dfrac{\sin2x}4`, (x) => x / 2 + sin(2 * x) / 4], [[R`\dfrac x2-\dfrac{\sin2x}4`, (x) => x / 2 - sin(2 * x) / 4], [R`\dfrac{\cos^3x}3`, (x) => cos(x) ** 3 / 3], [R`\dfrac x2+\dfrac{\sin2x}2`, (x) => x / 2 + sin(2 * x) / 2]],
    R`<p>$\cos^2x=\dfrac{1+\cos2x}2$. Integrate: $\dfrac x2+\dfrac{\sin2x}4$.</p>`, 'Dividing $\\sin2x$ by 2 twice (once from the half angle, once from the chain rule).'),
  IM(2, 'quadratic denominators', Q('\\dfrac1{x^2+2x+5}'), (x) => 1 / (x * x + 2 * x + 5), [R`\dfrac12\tan^{-1}\dfrac{x+1}2`, (x) => atan((x + 1) / 2) / 2], [[R`\tan^{-1}\dfrac{x+1}2`, (x) => atan((x + 1) / 2)], [R`\dfrac12\tan^{-1}(x+1)`, (x) => atan(x + 1) / 2], [R`\dfrac12\ln(x^2+2x+5)`, (x) => ln(x * x + 2 * x + 5) / 2]],
    R`<p>Complete the square: $x^2+2x+5=(x+1)^2+2^2$. $\int\dfrac{du}{u^2+a^2}=\dfrac1a\tan^{-1}\dfrac ua$ with $u=x+1$, $a=2$.</p>`, 'Do not forget the $\\tfrac1a$ in front.'),
  IM(2, 'inverse trigonometric', Q('\\dfrac1{\\sqrt{9-x^2}}'), (x) => 1 / sqrt(9 - x * x), [R`\sin^{-1}\dfrac x3`, (x) => asin(x / 3)], [[R`\dfrac13\sin^{-1}\dfrac x3`, (x) => asin(x / 3) / 3], [R`\sin^{-1}x`, asin], [R`\dfrac12\ln\left|\dfrac{3+x}{3-x}\right|`, (x) => ln(abs((3 + x) / (3 - x))) / 2]],
    R`<p>$\int\dfrac{dx}{\sqrt{a^2-x^2}}=\sin^{-1}\dfrac xa$ with $a=3$. (There is no extra $\tfrac1a$ here, unlike the $\tan^{-1}$ form.)</p>`, 'The $\\sin^{-1}$ form has no $\\tfrac1a$ factor.', [0.2, 0.7, 1.3, 2.0]),
  IM(2, 'partial fractions', Q('\\dfrac1{x^2-9}'), (x) => 1 / (x * x - 9), [R`\dfrac16\ln\left|\dfrac{x-3}{x+3}\right|`, (x) => ln(abs((x - 3) / (x + 3))) / 6], [[R`\dfrac12\ln\left|\dfrac{x-3}{x+3}\right|`, (x) => ln(abs((x - 3) / (x + 3))) / 2], [R`\dfrac16\ln\left|\dfrac{x+3}{x-3}\right|`, (x) => ln(abs((x + 3) / (x - 3))) / 6], [R`\dfrac13\tan^{-1}\dfrac x3`, (x) => atan(x / 3) / 3]],
    R`<p>$\int\dfrac{dx}{x^2-a^2}=\dfrac1{2a}\ln\left|\dfrac{x-a}{x+a}\right|$ with $a=3$: $\dfrac16\ln\left|\dfrac{x-3}{x+3}\right|$. (Partial fractions: $\dfrac1{6}\left(\dfrac1{x-3}-\dfrac1{x+3}\right)$.)</p>`, 'Check which is on top: $x-a$ over $x+a$.', [0.4, 0.8, 1.3, 1.9, 4, 5]),
  IM(2, 'trigonometric', Q('\\sin^3x'), (x) => sin(x) ** 3, [R`-\cos x+\dfrac{\cos^3x}3`, (x) => -cos(x) + cos(x) ** 3 / 3], [[R`\dfrac{\sin^4x}4`, (x) => sin(x) ** 4 / 4], [R`\cos x-\dfrac{\cos^3x}3`, (x) => cos(x) - cos(x) ** 3 / 3], [R`-\cos x-\dfrac{\cos^3x}3`, (x) => -cos(x) - cos(x) ** 3 / 3]],
    R`<p>$\sin^3x=\sin x(1-\cos^2x)$. With $u=\cos x$, $du=-\sin x\,dx$: $-\int(1-u^2)du=-u+\dfrac{u^3}3=-\cos x+\dfrac{\cos^3x}3$.</p>`, 'Odd power of sine: save one sine for $du$.'),
  IM(2, 'trigonometric', Q('\\tan^2x'), (x) => tan(x) ** 2, [R`\tan x-x`, (x) => tan(x) - x], [[R`\dfrac{\tan^3x}3`, (x) => tan(x) ** 3 / 3], [R`\tan x+x`, (x) => tan(x) + x], [R`\sec x\tan x`, (x) => sec(x) * tan(x)]],
    R`<p>$\tan^2x=\sec^2x-1$. Integrate: $\tan x-x$.</p>`, '$\\tan^3x/3$ differentiates to $\\tan^2x\\sec^2x$.', [0.2, 0.5, 0.9, 1.2]),
  IM(2, 'substitution', Q('\\dfrac{\\sin x}{1+\\cos x}'), (x) => sin(x) / (1 + cos(x)), [R`-\ln(1+\cos x)`, (x) => -ln(1 + cos(x))], [[R`\ln(1+\cos x)`, (x) => ln(1 + cos(x))], [R`\ln(1+\sin x)`, (x) => ln(1 + sin(x))], [R`\dfrac1{1+\cos x}`, (x) => 1 / (1 + cos(x))]],
    R`<p>$u=1+\cos x$, $du=-\sin x\,dx$: $-\int\dfrac{du}u=-\ln(1+\cos x)$.</p>`, 'Minus sign from $d(\\cos x)$.'),
  IM(2, 'substitution', Q('\\dfrac{e^x}{1+e^x}'), (x) => exp(x) / (1 + exp(x)), [R`\ln(1+e^x)`, (x) => ln(1 + exp(x))], [[R`\dfrac1{1+e^x}`, (x) => 1 / (1 + exp(x))], [R`e^x\ln(1+e^x)`, (x) => exp(x) * ln(1 + exp(x))], [R`\tan^{-1}e^x`, (x) => atan(exp(x))]],
    R`<p>The numerator is the derivative of the denominator: $\ln(1+e^x)$.</p>`, '$\\tan^{-1}e^x$ would need $1+e^{2x}$ in the denominator.'),
  IM(2, 'partial fractions', Q('\\dfrac1{x(x+1)}'), (x) => 1 / (x * (x + 1)), [R`\ln\left|\dfrac x{x+1}\right|`, (x) => ln(abs(x / (x + 1)))], [[R`\ln\left|\dfrac{x+1}x\right|`, (x) => ln(abs((x + 1) / x))], [R`\ln|x(x+1)|`, (x) => ln(abs(x * (x + 1)))], [R`\dfrac12\ln\left|\dfrac x{x+1}\right|`, (x) => ln(abs(x / (x + 1))) / 2]],
    R`<p>$\dfrac1{x(x+1)}=\dfrac1x-\dfrac1{x+1}$. Integrate: $\ln|x|-\ln|x+1|=\ln\left|\dfrac x{x+1}\right|$.</p>`, 'The difference of logs is a quotient.'),
  IM(2, 'substitution', Q('\\dfrac x{\\sqrt{x^2+9}}'), (x) => x / sqrt(x * x + 9), [R`\sqrt{x^2+9}`, (x) => sqrt(x * x + 9)], [[R`2\sqrt{x^2+9}`, (x) => 2 * sqrt(x * x + 9)], [R`\dfrac{\sqrt{x^2+9}}2`, (x) => sqrt(x * x + 9) / 2], [R`\ln\left(x+\sqrt{x^2+9}\right)`, (x) => ln(x + sqrt(x * x + 9))]],
    R`<p>$u=x^2+9$, $du=2x\,dx$: $\dfrac12\int u^{-1/2}du=\dfrac12\cdot2u^{1/2}=\sqrt{x^2+9}$.</p>`, 'The $x$ in the numerator changes the answer from the log form.'),
  IM(2, 'substitution', Q('\\dfrac{\\sec^2x}{\\tan x}'), (x) => 1 / (cos(x) ** 2 * tan(x)), [R`\ln|\tan x|`, (x) => ln(abs(tan(x)))], [[R`\ln|\sec x|`, (x) => ln(abs(sec(x)))], [R`\dfrac1{\tan x}`, (x) => 1 / tan(x)], [R`\tan x`, tan]],
    R`<p>$u=\tan x$, $du=\sec^2x\,dx$: $\int\dfrac{du}u=\ln|\tan x|$.</p>`, '$\\sec^2x$ is exactly $d(\\tan x)$.', [0.2, 0.5, 0.9, 1.2]),
  IM(2, 'substitution', Q('\\dfrac{\\ln x}x'), (x) => ln(x) / x, [R`\dfrac{(\ln x)^2}2`, (x) => ln(x) ** 2 / 2], [[R`\ln(\ln x)`, (x) => ln(abs(ln(x)))], [R`\dfrac{\ln x}{x^2}`, (x) => ln(x) / (x * x)], [R`\dfrac{1-\ln x}{x^2}`, (x) => (1 - ln(x)) / (x * x)]],
    R`<p>$u=\ln x$, $du=\dfrac{dx}x$: $\int u\,du=\dfrac{u^2}2$.</p>`, '$\\ln(\\ln x)$ is for $\\dfrac1{x\\ln x}$.', [1.5, 2.2, 3.1, 4.4]),
  IM(2, 'substitution', Q('\\dfrac{x^2}{1+x^3}'), (x) => x * x / (1 + x ** 3), [R`\dfrac13\ln(1+x^3)`, (x) => ln(1 + x ** 3) / 3], [[R`\ln(1+x^3)`, (x) => ln(1 + x ** 3)], [R`\dfrac{x^3}{3(1+x^3)}`, (x) => x ** 3 / (3 * (1 + x ** 3))], [R`\dfrac13\tan^{-1}x^3`, (x) => atan(x ** 3) / 3]],
    R`<p>$u=1+x^3$, $du=3x^2dx$: $\dfrac13\int\dfrac{du}u=\dfrac13\ln(1+x^3)$.</p>`, 'Account for the factor $3$ in $du$.'),
  IM(2, 'inverse trigonometric', Q('\\dfrac{\\cos x}{1+\\sin^2x}'), (x) => cos(x) / (1 + sin(x) ** 2), [R`\tan^{-1}(\sin x)`, (x) => atan(sin(x))], [[R`\ln(1+\sin^2x)`, (x) => ln(1 + sin(x) ** 2)], [R`\tan^{-1}(\cos x)`, (x) => atan(cos(x))], [R`\dfrac12\tan^{-1}(\sin x)`, (x) => atan(sin(x)) / 2]],
    R`<p>$u=\sin x$, $du=\cos x\,dx$: $\int\dfrac{du}{1+u^2}=\tan^{-1}u$.</p>`, 'A numerator $\\cos x$ is the whole $du$; no log.'),
  IM(2, 'substitution', Q('\\dfrac1{\\sqrt{2x+1}}'), (x) => 1 / sqrt(2 * x + 1), [R`\sqrt{2x+1}`, (x) => sqrt(2 * x + 1)], [[R`2\sqrt{2x+1}`, (x) => 2 * sqrt(2 * x + 1)], [R`\dfrac{\sqrt{2x+1}}2`, (x) => sqrt(2 * x + 1) / 2], [R`\ln\sqrt{2x+1}`, (x) => ln(sqrt(2 * x + 1))]],
    R`<p>$u=2x+1$, $du=2dx$: $\dfrac12\int u^{-1/2}du=\dfrac12\cdot2u^{1/2}=\sqrt{2x+1}$.</p>`, 'The two factors of $2$ cancel.'),
  IM(2, 'standard forms', Q('\\dfrac{x^2+1}{x}'), (x) => (x * x + 1) / x, [R`\dfrac{x^2}2+\ln|x|`, (x) => x * x / 2 + ln(abs(x))], [[R`\dfrac{x^2}2-\ln|x|`, (x) => x * x / 2 - ln(abs(x))], [R`\dfrac{x^3/3+x}{\ln x}`, (x) => (x ** 3 / 3 + x) / ln(x)], [R`x^2+\ln x`, (x) => x * x + ln(x)]],
    R`<p>Split: $x+\dfrac1x$. Integrate: $\dfrac{x^2}2+\ln|x|$.</p>`, 'Divide term by term before integrating.'),
  IM(2, 'inverse trigonometric', Q('\\dfrac1{4+9x^2}'), (x) => 1 / (4 + 9 * x * x), [R`\dfrac16\tan^{-1}\dfrac{3x}2`, (x) => atan(3 * x / 2) / 6], [[R`\dfrac12\tan^{-1}\dfrac{3x}2`, (x) => atan(3 * x / 2) / 2], [R`\dfrac13\tan^{-1}\dfrac{3x}2`, (x) => atan(3 * x / 2) / 3], [R`\dfrac16\tan^{-1}\dfrac x2`, (x) => atan(x / 2) / 6]],
    R`<p>$4+9x^2=2^2+(3x)^2$. With $u=3x$: $\dfrac13\int\dfrac{du}{4+u^2}=\dfrac13\cdot\dfrac12\tan^{-1}\dfrac u2=\dfrac16\tan^{-1}\dfrac{3x}2$.</p>`, 'Two factors: $\\tfrac1a=\\tfrac12$ and the chain-rule $\\tfrac13$.'),

  // ---------- L3 exam ----------
  IM(3, 'by parts', Q('x^2e^x'), (x) => x * x * exp(x), [R`(x^2-2x+2)e^x`, (x) => (x * x - 2 * x + 2) * exp(x)], [[R`(x^2+2x+2)e^x`, (x) => (x * x + 2 * x + 2) * exp(x)], [R`(x^2-2x)e^x`, (x) => (x * x - 2 * x) * exp(x)], [R`\dfrac{x^3}3e^x`, (x) => x ** 3 * exp(x) / 3]],
    R`<p>By parts twice. $\int x^2e^xdx=x^2e^x-2\int xe^xdx=x^2e^x-2(x-1)e^x=(x^2-2x+2)e^x$.</p>`, 'Signs alternate: $+,-,+$ in $x^2-2x+2$.'),
  IM(3, 'by parts', Q('e^x\\sin x'), (x) => exp(x) * sin(x), [R`\dfrac{e^x(\sin x-\cos x)}2`, (x) => exp(x) * (sin(x) - cos(x)) / 2], [[R`\dfrac{e^x(\sin x+\cos x)}2`, (x) => exp(x) * (sin(x) + cos(x)) / 2], [R`e^x(\sin x-\cos x)`, (x) => exp(x) * (sin(x) - cos(x))], [R`e^x\cos x`, (x) => exp(x) * cos(x)]],
    R`<p>Let $I=\int e^x\sin x\,dx$. By parts: $I=e^x\sin x-\int e^x\cos x\,dx$. Again: $\int e^x\cos x\,dx=e^x\cos x+I$. So $I=e^x\sin x-e^x\cos x-I$, giving $I=\dfrac{e^x(\sin x-\cos x)}2$.</p>`, 'Move the repeated $I$ to the left: divide by 2.'),
  IM(3, 'by parts', Q('x\\ln x'), (x) => x * ln(x), [R`\dfrac{x^2}2\ln x-\dfrac{x^2}4`, (x) => x * x / 2 * ln(x) - x * x / 4], [[R`\dfrac{x^2}2\ln x-\dfrac{x^2}2`, (x) => x * x / 2 * ln(x) - x * x / 2], [R`\dfrac{x^2}2\ln x+\dfrac{x^2}4`, (x) => x * x / 2 * ln(x) + x * x / 4], [R`\dfrac{x^2}2+\ln x`, (x) => x * x / 2 + ln(x)]],
    R`<p>$u=\ln x$, $dv=x\,dx$: $\dfrac{x^2}2\ln x-\int\dfrac{x^2}2\cdot\dfrac1xdx=\dfrac{x^2}2\ln x-\dfrac{x^2}4$.</p>`, 'ILATE: the logarithm comes first, so $u=\\ln x$.'),
  IM(3, 'by parts: e^x(f + f\')', Q('e^x\\left(\\dfrac1x-\\dfrac1{x^2}\\right)'), (x) => exp(x) * (1 / x - 1 / (x * x)), [R`\dfrac{e^x}x`, (x) => exp(x) / x], [[R`e^x\ln x`, (x) => exp(x) * ln(x)], [R`\dfrac{e^x}{x^2}`, (x) => exp(x) / (x * x)], [R`e^x\left(\ln x+\dfrac1x\right)`, (x) => exp(x) * (ln(x) + 1 / x)]],
    R`<p>This is $e^x\left(f+f'\right)$ with $f=\dfrac1x$, $f'=-\dfrac1{x^2}$. $\int e^x(f+f')dx=e^xf=\dfrac{e^x}x$. (Check: $\dfrac d{dx}\dfrac{e^x}x=\dfrac{e^x}x-\dfrac{e^x}{x^2}$.)</p>`, 'Spot $f$ and $f\'$ before doing anything else.'),
  IM(3, 'by parts: e^x(f + f\')', Q('e^x(\\sin x+\\cos x)'), (x) => exp(x) * (sin(x) + cos(x)), [R`e^x\sin x`, (x) => exp(x) * sin(x)], [[R`e^x\cos x`, (x) => exp(x) * cos(x)], [R`\dfrac{e^x\sin x}2`, (x) => exp(x) * sin(x) / 2], [R`e^x(\sin x-\cos x)`, (x) => exp(x) * (sin(x) - cos(x))]],
    R`<p>$f=\sin x$, $f'=\cos x$, so the integrand is $e^x(f+f')$ and the integral is $e^xf=e^x\sin x$.</p>`, '$\\cos x$ is the derivative of $\\sin x$, not the other way round.'),
  IM(3, 'by parts', Q('\\tan^{-1}x'), atan, [R`x\tan^{-1}x-\dfrac12\ln(1+x^2)`, (x) => x * atan(x) - ln(1 + x * x) / 2], [[R`x\tan^{-1}x-\ln(1+x^2)`, (x) => x * atan(x) - ln(1 + x * x)], [R`x\tan^{-1}x+\dfrac12\ln(1+x^2)`, (x) => x * atan(x) + ln(1 + x * x) / 2], [R`\dfrac1{1+x^2}`, (x) => 1 / (1 + x * x)]],
    R`<p>$u=\tan^{-1}x$, $dv=dx$: $x\tan^{-1}x-\int\dfrac x{1+x^2}dx=x\tan^{-1}x-\dfrac12\ln(1+x^2)$.</p>`, 'The leftover integral is half a log.'),
  IM(3, 'logarithmic', Q('\\dfrac{2x+3}{x^2+3x+2}'), (x) => (2 * x + 3) / (x * x + 3 * x + 2), [R`\ln|x^2+3x+2|`, (x) => ln(abs(x * x + 3 * x + 2))], [[R`\dfrac12\ln|x^2+3x+2|`, (x) => ln(abs(x * x + 3 * x + 2)) / 2], [R`2\ln|x^2+3x+2|`, (x) => 2 * ln(abs(x * x + 3 * x + 2))], [R`\dfrac1{x^2+3x+2}`, (x) => 1 / (x * x + 3 * x + 2)]],
    R`<p>$\dfrac d{dx}(x^2+3x+2)=2x+3$, exactly the numerator. So the integral is $\ln|x^2+3x+2|$.</p>`, 'Check the numerator against the derivative of the denominator before partial fractions.'),
  IM(3, 'partial fractions', Q('\\dfrac{3x+5}{(x+1)(x+3)}'), (x) => (3 * x + 5) / ((x + 1) * (x + 3)), [R`\ln|x+1|+2\ln|x+3|`, (x) => ln(abs(x + 1)) + 2 * ln(abs(x + 3))], [[R`2\ln|x+1|+\ln|x+3|`, (x) => 2 * ln(abs(x + 1)) + ln(abs(x + 3))], [R`\ln|x+1|-2\ln|x+3|`, (x) => ln(abs(x + 1)) - 2 * ln(abs(x + 3))], [R`3\ln|(x+1)(x+3)|`, (x) => 3 * ln(abs((x + 1) * (x + 3)))]],
    R`<p>$3x+5=A(x+3)+B(x+1)$. $x=-1$: $2=2A$, $A=1$. $x=-3$: $-4=-2B$, $B=2$. Integral: $\ln|x+1|+2\ln|x+3|$.</p>`, 'Swapped cover-up values give the wrong pairing of $A$ and $B$.'),
  IM(3, 'partial fractions', Q('\\dfrac1{x^2(x+1)}'), (x) => 1 / (x * x * (x + 1)), [R`-\dfrac1x-\ln|x|+\ln|x+1|`, (x) => -1 / x - ln(abs(x)) + ln(abs(x + 1))], [[R`-\dfrac1x+\ln|x|-\ln|x+1|`, (x) => -1 / x + ln(abs(x)) - ln(abs(x + 1))], [R`\dfrac1x-\ln|x|+\ln|x+1|`, (x) => 1 / x - ln(abs(x)) + ln(abs(x + 1))], [R`-\dfrac1{2x^2}\ln|x+1|`, (x) => -ln(abs(x + 1)) / (2 * x * x)]],
    R`<p>Write $\dfrac1{x^2(x+1)}=\dfrac Ax+\dfrac B{x^2}+\dfrac C{x+1}$. Then $1=Ax(x+1)+B(x+1)+Cx^2$. $x=0$: $B=1$. $x=-1$: $C=1$. $x^2$ coefficient: $A+C=0$, so $A=-1$. Integral: $-\ln|x|-\dfrac1x+\ln|x+1|$.</p>`, 'A repeated factor needs both $\\dfrac Ax$ and $\\dfrac B{x^2}$.'),
  IM(3, 'trigonometric', Q('\\dfrac1{1+\\cos x}'), (x) => 1 / (1 + cos(x)), [R`\tan\dfrac x2`, (x) => tan(x / 2)], [[R`\dfrac12\tan\dfrac x2`, (x) => tan(x / 2) / 2], [R`\ln(1+\cos x)`, (x) => ln(1 + cos(x))], [R`-\dfrac1{\sin x}`, (x) => -1 / sin(x)]],
    R`<p>$1+\cos x=2\cos^2\dfrac x2$, so the integrand is $\dfrac12\sec^2\dfrac x2$. Integral: $\dfrac12\cdot2\tan\dfrac x2=\tan\dfrac x2$.</p>`, 'The inner derivative $\\tfrac12$ cancels the outer $\\tfrac12$.', [0.4, 0.8, 1.3, 1.9, 2.6]),
  IM(3, 'trigonometric', Q('\\sin^4x'), (x) => sin(x) ** 4, [R`\dfrac{3x}8-\dfrac{\sin2x}4+\dfrac{\sin4x}{32}`, (x) => 3 * x / 8 - sin(2 * x) / 4 + sin(4 * x) / 32], [[R`\dfrac{3x}8+\dfrac{\sin2x}4+\dfrac{\sin4x}{32}`, (x) => 3 * x / 8 + sin(2 * x) / 4 + sin(4 * x) / 32], [R`\dfrac{3x}8-\dfrac{\sin2x}4-\dfrac{\sin4x}{32}`, (x) => 3 * x / 8 - sin(2 * x) / 4 - sin(4 * x) / 32], [R`\dfrac{\sin^5x}5`, (x) => sin(x) ** 5 / 5]],
    R`<p>$\sin^4x=\left(\dfrac{1-\cos2x}2\right)^2=\dfrac14\left(1-2\cos2x+\cos^22x\right)=\dfrac14\left(\dfrac32-2\cos2x+\dfrac{\cos4x}2\right)=\dfrac38-\dfrac{\cos2x}2+\dfrac{\cos4x}8$. Integrate: $\dfrac{3x}8-\dfrac{\sin2x}4+\dfrac{\sin4x}{32}$.</p>`, 'Even powers need the double-angle reduction, twice.'),
  IM(3, 'trigonometric', Q('\\sin x\\cos^2x'), (x) => sin(x) * cos(x) ** 2, [R`-\dfrac{\cos^3x}3`, (x) => -(cos(x) ** 3) / 3], [[R`\dfrac{\cos^3x}3`, (x) => cos(x) ** 3 / 3], [R`\dfrac{\sin^2x\cos^3x}6`, (x) => sin(x) ** 2 * cos(x) ** 3 / 6], [R`-\dfrac{\sin^3x}3`, (x) => -(sin(x) ** 3) / 3]],
    R`<p>$u=\cos x$, $du=-\sin x\,dx$: $-\int u^2du=-\dfrac{\cos^3x}3$.</p>`, 'Minus sign from $d(\\cos x)$.'),
  IM(3, 'trigonometric', Q('\\sin3x\\cos2x'), (x) => sin(3 * x) * cos(2 * x), [R`-\dfrac{\cos5x}{10}-\dfrac{\cos x}2`, (x) => -cos(5 * x) / 10 - cos(x) / 2], [[R`-\dfrac{\cos5x}{10}+\dfrac{\cos x}2`, (x) => -cos(5 * x) / 10 + cos(x) / 2], [R`-\dfrac{\cos5x}{5}-\dfrac{\cos x}2`, (x) => -cos(5 * x) / 5 - cos(x) / 2], [R`-\dfrac{\cos3x}3\cdot\dfrac{\sin2x}2`, (x) => -cos(3 * x) / 3 * sin(2 * x) / 2]],
    R`<p>$\sin A\cos B=\dfrac12[\sin(A+B)+\sin(A-B)]$. So $\sin3x\cos2x=\dfrac12(\sin5x+\sin x)$. Integrate: $\dfrac12\left(-\dfrac{\cos5x}5-\cos x\right)=-\dfrac{\cos5x}{10}-\dfrac{\cos x}2$.</p>`, 'You cannot integrate a product factor by factor.'),
  IM(3, 'trigonometric', Q('\\dfrac1{2+\\cos x}'), (x) => 1 / (2 + cos(x)), [R`\dfrac2{\sqrt3}\tan^{-1}\left(\dfrac1{\sqrt3}\tan\dfrac x2\right)`, (x) => 2 / sqrt(3) * atan(tan(x / 2) / sqrt(3))], [[R`\dfrac1{\sqrt3}\tan^{-1}\left(\dfrac1{\sqrt3}\tan\dfrac x2\right)`, (x) => atan(tan(x / 2) / sqrt(3)) / sqrt(3)], [R`2\tan^{-1}\left(\tan\dfrac x2\right)`, (x) => 2 * atan(tan(x / 2))], [R`\ln(2+\cos x)`, (x) => ln(2 + cos(x))]],
    R`<p>Put $t=\tan\dfrac x2$: $\cos x=\dfrac{1-t^2}{1+t^2}$, $dx=\dfrac{2dt}{1+t^2}$. Then $2+\cos x=\dfrac{3+t^2}{1+t^2}$ and the integral becomes $\int\dfrac{2\,dt}{3+t^2}=\dfrac2{\sqrt3}\tan^{-1}\dfrac t{\sqrt3}$.</p>`, 'The factor in front is $\\dfrac2{\\sqrt3}$: one $2$ from $dx$, one $\\dfrac1{\\sqrt3}$ from the standard form.', [0.4, 0.8, 1.3, 1.9, 2.6]),
  IM(3, 'irrational integrands', Q('\\sqrt{x^2+1}'), (x) => sqrt(x * x + 1), [R`\dfrac x2\sqrt{x^2+1}+\dfrac12\ln\left(x+\sqrt{x^2+1}\right)`, (x) => x * sqrt(x * x + 1) / 2 + ln(x + sqrt(x * x + 1)) / 2], [[R`\dfrac x2\sqrt{x^2+1}-\dfrac12\ln\left(x+\sqrt{x^2+1}\right)`, (x) => x * sqrt(x * x + 1) / 2 - ln(x + sqrt(x * x + 1)) / 2], [R`\dfrac{(x^2+1)^{3/2}}3`, (x) => (x * x + 1) ** 1.5 / 3], [R`\dfrac x2\sqrt{x^2+1}+\ln\left(x+\sqrt{x^2+1}\right)`, (x) => x * sqrt(x * x + 1) / 2 + ln(x + sqrt(x * x + 1))]],
    R`<p>Standard: $\int\sqrt{x^2+a^2}\,dx=\dfrac x2\sqrt{x^2+a^2}+\dfrac{a^2}2\ln\left(x+\sqrt{x^2+a^2}\right)$ with $a=1$.</p>`, 'The log term has coefficient $\\tfrac{a^2}2$ and a plus sign here.'),
  IM(3, 'irrational integrands', Q('\\sqrt{4-x^2}'), (x) => sqrt(4 - x * x), [R`\dfrac x2\sqrt{4-x^2}+2\sin^{-1}\dfrac x2`, (x) => x * sqrt(4 - x * x) / 2 + 2 * asin(x / 2)], [[R`\dfrac x2\sqrt{4-x^2}+\sin^{-1}\dfrac x2`, (x) => x * sqrt(4 - x * x) / 2 + asin(x / 2)], [R`\dfrac x2\sqrt{4-x^2}-2\sin^{-1}\dfrac x2`, (x) => x * sqrt(4 - x * x) / 2 - 2 * asin(x / 2)], [R`-\dfrac{(4-x^2)^{3/2}}3`, (x) => -((4 - x * x) ** 1.5) / 3]],
    R`<p>$\int\sqrt{a^2-x^2}dx=\dfrac x2\sqrt{a^2-x^2}+\dfrac{a^2}2\sin^{-1}\dfrac xa$, with $a=2$: second term $\dfrac42\sin^{-1}\dfrac x2$.</p>`, 'The coefficient is $a^2/2=2$, not $\\tfrac12$.', [0.2, 0.7, 1.3, 1.8]),
  IM(3, 'irrational integrands', Q('\\dfrac{2x+1}{\\sqrt{x^2+x+1}}'), (x) => (2 * x + 1) / sqrt(x * x + x + 1), [R`2\sqrt{x^2+x+1}`, (x) => 2 * sqrt(x * x + x + 1)], [[R`\sqrt{x^2+x+1}`, (x) => sqrt(x * x + x + 1)], [R`\ln\left|x^2+x+1\right|`, (x) => ln(x * x + x + 1)], [R`\dfrac{(x^2+x+1)^{3/2}}3`, (x) => (x * x + x + 1) ** 1.5 / 3]],
    R`<p>The numerator is the derivative of the expression under the root. $u=x^2+x+1$: $\int\dfrac{du}{\sqrt u}=2\sqrt u$.</p>`, 'Here $du=(2x+1)dx$ in full, so no extra factor.'),
  IM(3, 'substitution', Q('\\dfrac{x^3}{x^2+1}'), (x) => x ** 3 / (x * x + 1), [R`\dfrac{x^2}2-\dfrac12\ln(1+x^2)`, (x) => x * x / 2 - ln(1 + x * x) / 2], [[R`\dfrac{x^2}2+\dfrac12\ln(1+x^2)`, (x) => x * x / 2 + ln(1 + x * x) / 2], [R`\dfrac{x^4}{4\ln(x^2+1)}`, (x) => x ** 4 / (4 * ln(x * x + 1))], [R`\dfrac{x^2}2-\ln(1+x^2)`, (x) => x * x / 2 - ln(1 + x * x)]],
    R`<p>Divide: $\dfrac{x^3}{x^2+1}=x-\dfrac x{x^2+1}$. Integrate: $\dfrac{x^2}2-\dfrac12\ln(1+x^2)$.</p>`, 'Divide when the numerator has higher degree.'),
  IM(3, 'inverse trigonometric', Q('\\dfrac1{x\\sqrt{x^2-1}}'), (x) => 1 / (x * sqrt(x * x - 1)), [R`\sec^{-1}x`, (x) => acos(1 / x)], [[R`-\sec^{-1}x`, (x) => -acos(1 / x)], [R`\sin^{-1}x`, (x) => asin(x)], [R`\ln\left|x+\sqrt{x^2-1}\right|`, (x) => ln(abs(x + sqrt(x * x - 1)))]],
    R`<p>$\dfrac d{dx}\sec^{-1}x=\dfrac1{|x|\sqrt{x^2-1}}$, which for $x>1$ is $\dfrac1{x\sqrt{x^2-1}}$.</p>`, 'Standard form; the domain is $x>1$ here.', [1.3, 1.8, 2.5, 3.4]),
  IM(3, 'irrational integrands', Q('\\dfrac1{\\sqrt x\\,(1+\\sqrt x)}'), (x) => 1 / (sqrt(x) * (1 + sqrt(x))), [R`2\ln(1+\sqrt x)`, (x) => 2 * ln(1 + sqrt(x))], [[R`\ln(1+\sqrt x)`, (x) => ln(1 + sqrt(x))], [R`\dfrac12\ln(1+\sqrt x)`, (x) => ln(1 + sqrt(x)) / 2], [R`2\sqrt x\ln(1+\sqrt x)`, (x) => 2 * sqrt(x) * ln(1 + sqrt(x))]],
    R`<p>$u=\sqrt x$, $du=\dfrac{dx}{2\sqrt x}$, so $\dfrac{dx}{\sqrt x}=2du$: $2\int\dfrac{du}{1+u}=2\ln(1+\sqrt x)$.</p>`, 'The $2$ comes from $dx/\\sqrt x=2\\,du$.'),
  IM(3, 'irrational integrands', Q('\\dfrac1{1+\\sqrt x}'), (x) => 1 / (1 + sqrt(x)), [R`2\sqrt x-2\ln(1+\sqrt x)`, (x) => 2 * sqrt(x) - 2 * ln(1 + sqrt(x))], [[R`2\sqrt x+2\ln(1+\sqrt x)`, (x) => 2 * sqrt(x) + 2 * ln(1 + sqrt(x))], [R`2\ln(1+\sqrt x)`, (x) => 2 * ln(1 + sqrt(x))], [R`\sqrt x-\ln(1+\sqrt x)`, (x) => sqrt(x) - ln(1 + sqrt(x))]],
    R`<p>$x=t^2$, $dx=2t\,dt$: $\int\dfrac{2t}{1+t}dt=2\int\left(1-\dfrac1{1+t}\right)dt=2t-2\ln(1+t)$ with $t=\sqrt x$.</p>`, 'Write $\\dfrac t{1+t}=1-\\dfrac1{1+t}$.'),
  IM(3, 'by parts', Q('x\\sec^2x'), (x) => x / cos(x) ** 2, [R`x\tan x+\ln|\cos x|`, (x) => x * tan(x) + ln(abs(cos(x)))], [[R`x\tan x-\ln|\cos x|`, (x) => x * tan(x) - ln(abs(cos(x)))], [R`\dfrac{x^2}2\tan x`, (x) => x * x * tan(x) / 2], [R`x\tan x+\ln|\sin x|`, (x) => x * tan(x) + ln(abs(sin(x)))]],
    R`<p>$u=x$, $dv=\sec^2x\,dx$: $x\tan x-\int\tan x\,dx=x\tan x+\ln|\cos x|$.</p>`, '$\\int\\tan x\\,dx=-\\ln|\\cos x|$, so minus it gives $+\\ln|\\cos x|$.', [0.2, 0.5, 0.9, 1.2]),
  IM(3, 'by parts', Q('\\sin^{-1}x'), asin, [R`x\sin^{-1}x+\sqrt{1-x^2}`, (x) => x * asin(x) + sqrt(1 - x * x)], [[R`x\sin^{-1}x-\sqrt{1-x^2}`, (x) => x * asin(x) - sqrt(1 - x * x)], [R`x\sin^{-1}x+\dfrac1{\sqrt{1-x^2}}`, (x) => x * asin(x) + 1 / sqrt(1 - x * x)], [R`\dfrac1{\sqrt{1-x^2}}`, (x) => 1 / sqrt(1 - x * x)]],
    R`<p>$u=\sin^{-1}x$, $dv=dx$: $x\sin^{-1}x-\int\dfrac x{\sqrt{1-x^2}}dx=x\sin^{-1}x+\sqrt{1-x^2}$.</p>`, '$\\int\\dfrac x{\\sqrt{1-x^2}}dx=-\\sqrt{1-x^2}$.', [0.1, 0.3, 0.5, 0.8]),
  IM(3, 'trigonometric', Q('\\dfrac1{1+\\tan x}'), (x) => 1 / (1 + tan(x)), [R`\dfrac12\left(x+\ln|\sin x+\cos x|\right)`, (x) => (x + ln(abs(sin(x) + cos(x)))) / 2], [[R`\dfrac12\left(x-\ln|\sin x+\cos x|\right)`, (x) => (x - ln(abs(sin(x) + cos(x)))) / 2], [R`x+\ln|\sin x+\cos x|`, (x) => x + ln(abs(sin(x) + cos(x)))], [R`\ln|1+\tan x|`, (x) => ln(abs(1 + tan(x)))]],
    R`<p>$\dfrac1{1+\tan x}=\dfrac{\cos x}{\sin x+\cos x}$. Write $\cos x=\dfrac12(\sin x+\cos x)+\dfrac12(\cos x-\sin x)$. Then the integral is $\dfrac12\int dx+\dfrac12\int\dfrac{\cos x-\sin x}{\sin x+\cos x}dx=\dfrac x2+\dfrac12\ln|\sin x+\cos x|$.</p>`, 'The $\\dfrac12$ multiplies both pieces.', [0.1, 0.3, 0.5, 0.8]),
  IM(3, 'trigonometric', Q('\\dfrac{3\\sin x+2\\cos x}{\\sin x+\\cos x}'), (x) => (3 * sin(x) + 2 * cos(x)) / (sin(x) + cos(x)), [R`\dfrac{5x}2-\dfrac12\ln|\sin x+\cos x|`, (x) => 5 * x / 2 - ln(abs(sin(x) + cos(x))) / 2], [[R`\dfrac{5x}2+\dfrac12\ln|\sin x+\cos x|`, (x) => 5 * x / 2 + ln(abs(sin(x) + cos(x))) / 2], [R`\dfrac{x}2-\dfrac52\ln|\sin x+\cos x|`, (x) => x / 2 - 5 * ln(abs(sin(x) + cos(x))) / 2], [R`5x-\ln|\sin x+\cos x|`, (x) => 5 * x - ln(abs(sin(x) + cos(x)))]],
    R`<p>Write the numerator as $A(\sin x+\cos x)+B(\cos x-\sin x)$: $A-B=3$, $A+B=2$, so $A=\dfrac52$, $B=-\dfrac12$. Then the integral is $\dfrac{5x}2-\dfrac12\ln|\sin x+\cos x|$.</p>`, '$B$ multiplies the derivative of the denominator, $\\cos x-\\sin x$.', [0.1, 0.3, 0.5, 0.8]),

  // ---------- L4 hard ----------
  IM(4, 'by parts (repeated)', Q('e^{2x}\\sin3x'), (x) => exp(2 * x) * sin(3 * x), [R`\dfrac{e^{2x}(2\sin3x-3\cos3x)}{13}`, (x) => exp(2 * x) * (2 * sin(3 * x) - 3 * cos(3 * x)) / 13], [[R`\dfrac{e^{2x}(2\sin3x+3\cos3x)}{13}`, (x) => exp(2 * x) * (2 * sin(3 * x) + 3 * cos(3 * x)) / 13], [R`\dfrac{e^{2x}(3\sin3x-2\cos3x)}{13}`, (x) => exp(2 * x) * (3 * sin(3 * x) - 2 * cos(3 * x)) / 13], [R`\dfrac{e^{2x}(2\sin3x-3\cos3x)}{5}`, (x) => exp(2 * x) * (2 * sin(3 * x) - 3 * cos(3 * x)) / 5]],
    R`<p>For $\int e^{ax}\sin bx\,dx=\dfrac{e^{ax}(a\sin bx-b\cos bx)}{a^2+b^2}$ with $a=2,b=3$: denominator $13$, numerator $2\sin3x-3\cos3x$. (Derivation: by parts twice gives $I=\dfrac{e^{2x}\sin3x}2-\dfrac{3e^{2x}\cos3x}{4}-\dfrac94I$, so $\dfrac{13}4I=\dots$.)</p>`, 'Denominator is $a^2+b^2$, not $a+b$; the coefficient of $\\sin$ is $a$.'),
  IM(4, 'by parts', Q('x^2\\tan^{-1}x'), (x) => x * x * atan(x), [R`\dfrac{x^3}3\tan^{-1}x-\dfrac{x^2}6+\dfrac16\ln(1+x^2)`, (x) => x ** 3 / 3 * atan(x) - x * x / 6 + ln(1 + x * x) / 6], [[R`\dfrac{x^3}3\tan^{-1}x-\dfrac{x^2}6-\dfrac16\ln(1+x^2)`, (x) => x ** 3 / 3 * atan(x) - x * x / 6 - ln(1 + x * x) / 6], [R`\dfrac{x^3}3\tan^{-1}x+\dfrac{x^2}6+\dfrac16\ln(1+x^2)`, (x) => x ** 3 / 3 * atan(x) + x * x / 6 + ln(1 + x * x) / 6], [R`\dfrac{x^3}3\tan^{-1}x-\dfrac{x^2}3+\dfrac13\ln(1+x^2)`, (x) => x ** 3 / 3 * atan(x) - x * x / 3 + ln(1 + x * x) / 3]],
    R`<p>$u=\tan^{-1}x$, $dv=x^2dx$: $\dfrac{x^3}3\tan^{-1}x-\dfrac13\int\dfrac{x^3}{1+x^2}dx$. And $\dfrac{x^3}{1+x^2}=x-\dfrac x{1+x^2}$, so $\int=\dfrac{x^2}2-\dfrac12\ln(1+x^2)$. Result: $\dfrac{x^3}3\tan^{-1}x-\dfrac{x^2}6+\dfrac16\ln(1+x^2)$.</p>`, 'The leftover has degree 3 over degree 2: divide.'),
  IM(4, 'partial fractions (quadratic factors)', Q('\\dfrac{x^2+1}{x^4+1}'), (x) => (x * x + 1) / (x ** 4 + 1), [R`\dfrac1{\sqrt2}\tan^{-1}\dfrac{x^2-1}{\sqrt2\,x}`, (x) => atan((x * x - 1) / (sqrt(2) * x)) / sqrt(2)], [[R`\dfrac1{\sqrt2}\tan^{-1}\dfrac{x^2+1}{\sqrt2\,x}`, (x) => atan((x * x + 1) / (sqrt(2) * x)) / sqrt(2)], [R`\tan^{-1}\dfrac{x^2-1}{\sqrt2\,x}`, (x) => atan((x * x - 1) / (sqrt(2) * x))], [R`\dfrac1{2\sqrt2}\ln\left|\dfrac{x^2-\sqrt2x+1}{x^2+\sqrt2x+1}\right|`, (x) => ln(abs((x * x - sqrt(2) * x + 1) / (x * x + sqrt(2) * x + 1))) / (2 * sqrt(2))]],
    R`<p>Divide top and bottom by $x^2$: $\dfrac{1+1/x^2}{x^2+1/x^2}$. Let $t=x-\dfrac1x$, $dt=\left(1+\dfrac1{x^2}\right)dx$ and $x^2+\dfrac1{x^2}=t^2+2$. So $\int\dfrac{dt}{t^2+2}=\dfrac1{\sqrt2}\tan^{-1}\dfrac t{\sqrt2}$, with $\dfrac t{\sqrt2}=\dfrac{x^2-1}{\sqrt2x}$.</p>`, 'The plus-version $x^2-1$ in the numerator gives a log instead.'),
  IM(4, 'partial fractions (quadratic factors)', Q('\\dfrac{x^2-1}{x^4+1}'), (x) => (x * x - 1) / (x ** 4 + 1), [R`\dfrac1{2\sqrt2}\ln\left|\dfrac{x^2-\sqrt2\,x+1}{x^2+\sqrt2\,x+1}\right|`, (x) => ln(abs((x * x - sqrt(2) * x + 1) / (x * x + sqrt(2) * x + 1))) / (2 * sqrt(2))], [[R`\dfrac1{2\sqrt2}\ln\left|\dfrac{x^2+\sqrt2\,x+1}{x^2-\sqrt2\,x+1}\right|`, (x) => ln(abs((x * x + sqrt(2) * x + 1) / (x * x - sqrt(2) * x + 1))) / (2 * sqrt(2))], [R`\dfrac1{\sqrt2}\ln\left|\dfrac{x^2-\sqrt2\,x+1}{x^2+\sqrt2\,x+1}\right|`, (x) => ln(abs((x * x - sqrt(2) * x + 1) / (x * x + sqrt(2) * x + 1))) / sqrt(2)], [R`\dfrac1{\sqrt2}\tan^{-1}\dfrac{x^2-1}{\sqrt2\,x}`, (x) => atan((x * x - 1) / (sqrt(2) * x)) / sqrt(2)]],
    R`<p>Divide by $x^2$: $\dfrac{1-1/x^2}{x^2+1/x^2}$. Let $t=x+\dfrac1x$, $dt=\left(1-\dfrac1{x^2}\right)dx$, $x^2+\dfrac1{x^2}=t^2-2$. $\int\dfrac{dt}{t^2-2}=\dfrac1{2\sqrt2}\ln\left|\dfrac{t-\sqrt2}{t+\sqrt2}\right|$. Multiply top and bottom by $x$: $\dfrac{x^2-\sqrt2x+1}{x^2+\sqrt2x+1}$.</p>`, 'Compare with $\\dfrac{x^2+1}{x^4+1}$: sign inside the numerator decides between $\\tan^{-1}$ and $\\ln$.'),
  IM(4, 'partial fractions', Q('\\dfrac1{x^4-1}'), (x) => 1 / (x ** 4 - 1), [R`\dfrac14\ln\left|\dfrac{x-1}{x+1}\right|-\dfrac12\tan^{-1}x`, (x) => ln(abs((x - 1) / (x + 1))) / 4 - atan(x) / 2], [[R`\dfrac14\ln\left|\dfrac{x-1}{x+1}\right|+\dfrac12\tan^{-1}x`, (x) => ln(abs((x - 1) / (x + 1))) / 4 + atan(x) / 2], [R`\dfrac12\ln\left|\dfrac{x-1}{x+1}\right|-\tan^{-1}x`, (x) => ln(abs((x - 1) / (x + 1))) / 2 - atan(x)], [R`\dfrac14\ln\left|\dfrac{x+1}{x-1}\right|-\dfrac12\tan^{-1}x`, (x) => ln(abs((x + 1) / (x - 1))) / 4 - atan(x) / 2]],
    R`<p>$\dfrac1{x^4-1}=\dfrac12\left(\dfrac1{x^2-1}-\dfrac1{x^2+1}\right)$. Then $\dfrac12\left[\dfrac12\ln\left|\dfrac{x-1}{x+1}\right|-\tan^{-1}x\right]$.</p>`, 'Factor $x^4-1=(x^2-1)(x^2+1)$ first.', [0.2, 0.5, 0.8, 1.5, 2.4]),
  IM(4, 'trigonometric', Q('\\dfrac1{\\sin x+\\cos x}'), (x) => 1 / (sin(x) + cos(x)), [R`\dfrac1{\sqrt2}\ln\left|\tan\left(\dfrac x2+\dfrac\pi8\right)\right|`, (x) => ln(abs(tan(x / 2 + PI_ / 8))) / sqrt(2)], [[R`\dfrac1{\sqrt2}\ln\left|\tan\left(\dfrac x2-\dfrac\pi8\right)\right|`, (x) => ln(abs(tan(x / 2 - PI_ / 8))) / sqrt(2)], [R`\ln\left|\tan\left(\dfrac x2+\dfrac\pi8\right)\right|`, (x) => ln(abs(tan(x / 2 + PI_ / 8)))], [R`\dfrac1{\sqrt2}\ln\left|\tan\left(x+\dfrac\pi4\right)\right|`, (x) => ln(abs(tan(x + PI_ / 4))) / sqrt(2)]],
    R`<p>$\sin x+\cos x=\sqrt2\sin\left(x+\dfrac\pi4\right)$. So the integral is $\dfrac1{\sqrt2}\int\operatorname{cosec}\left(x+\dfrac\pi4\right)dx=\dfrac1{\sqrt2}\ln\left|\tan\left(\dfrac12\left(x+\dfrac\pi4\right)\right)\right|$.</p>`, 'Half the angle goes inside the tangent: $\\dfrac x2+\\dfrac\\pi8$.', [0.2, 0.5, 0.8, 1.1]),
  IM(4, 'irrational integrands', Q('\\sqrt{\\dfrac{1-x}{1+x}}'), (x) => sqrt((1 - x) / (1 + x)), [R`\sin^{-1}x+\sqrt{1-x^2}`, (x) => asin(x) + sqrt(1 - x * x)], [[R`\sin^{-1}x-\sqrt{1-x^2}`, (x) => asin(x) - sqrt(1 - x * x)], [R`\cos^{-1}x+\sqrt{1-x^2}`, (x) => acos(x) + sqrt(1 - x * x)], [R`\dfrac{2}{3}\left(\dfrac{1-x}{1+x}\right)^{3/2}`, (x) => 2 / 3 * ((1 - x) / (1 + x)) ** 1.5]],
    R`<p>Multiply top and bottom by $\sqrt{1-x}$: $\dfrac{1-x}{\sqrt{1-x^2}}=\dfrac1{\sqrt{1-x^2}}-\dfrac x{\sqrt{1-x^2}}$. Integrate: $\sin^{-1}x+\sqrt{1-x^2}$.</p>`, 'Rationalise inside the root first.', [0.1, 0.3, 0.5, 0.8]),
  IM(4, 'substitution', Q('\\dfrac x{x^4+x^2+1}'), (x) => x / (x ** 4 + x * x + 1), [R`\dfrac1{\sqrt3}\tan^{-1}\dfrac{2x^2+1}{\sqrt3}`, (x) => atan((2 * x * x + 1) / sqrt(3)) / sqrt(3)], [[R`\dfrac2{\sqrt3}\tan^{-1}\dfrac{2x^2+1}{\sqrt3}`, (x) => 2 * atan((2 * x * x + 1) / sqrt(3)) / sqrt(3)], [R`\dfrac1{2\sqrt3}\tan^{-1}\dfrac{2x^2+1}{\sqrt3}`, (x) => atan((2 * x * x + 1) / sqrt(3)) / (2 * sqrt(3))], [R`\dfrac1{\sqrt3}\tan^{-1}\dfrac{x^2+1}{\sqrt3}`, (x) => atan((x * x + 1) / sqrt(3)) / sqrt(3)]],
    R`<p>$u=x^2$, $du=2x\,dx$: $\dfrac12\int\dfrac{du}{u^2+u+1}=\dfrac12\int\dfrac{du}{\left(u+\frac12\right)^2+\frac34}=\dfrac12\cdot\dfrac2{\sqrt3}\tan^{-1}\dfrac{2u+1}{\sqrt3}$.</p>`, '$\\tfrac12\\cdot\\tfrac2{\\sqrt3}=\\tfrac1{\\sqrt3}$.'),
  IM(4, 'substitution', Q('\\dfrac1{x(x^5+1)}'), (x) => 1 / (x * (x ** 5 + 1)), [R`\dfrac15\ln\left|\dfrac{x^5}{x^5+1}\right|`, (x) => ln(abs(x ** 5 / (x ** 5 + 1))) / 5], [[R`\ln\left|\dfrac{x^5}{x^5+1}\right|`, (x) => ln(abs(x ** 5 / (x ** 5 + 1)))], [R`\dfrac15\ln\left|\dfrac{x^5+1}{x^5}\right|`, (x) => ln(abs((x ** 5 + 1) / x ** 5)) / 5], [R`\dfrac15\ln|x^5(x^5+1)|`, (x) => ln(abs(x ** 5 * (x ** 5 + 1))) / 5]],
    R`<p>Multiply top and bottom by $x^4$: $\dfrac{x^4}{x^5(x^5+1)}$. $u=x^5$, $du=5x^4dx$: $\dfrac15\int\dfrac{du}{u(u+1)}=\dfrac15\ln\left|\dfrac u{u+1}\right|$.</p>`, 'Make $x^4\\,dx$ appear by multiplying by $x^4/x^4$.'),
  IM(4, 'by parts', Q('\\ln\\left(x+\\sqrt{1+x^2}\\right)'), (x) => ln(x + sqrt(1 + x * x)), [R`x\ln\left(x+\sqrt{1+x^2}\right)-\sqrt{1+x^2}`, (x) => x * ln(x + sqrt(1 + x * x)) - sqrt(1 + x * x)], [[R`x\ln\left(x+\sqrt{1+x^2}\right)+\sqrt{1+x^2}`, (x) => x * ln(x + sqrt(1 + x * x)) + sqrt(1 + x * x)], [R`x\ln\left(x+\sqrt{1+x^2}\right)-\dfrac1{\sqrt{1+x^2}}`, (x) => x * ln(x + sqrt(1 + x * x)) - 1 / sqrt(1 + x * x)], [R`\dfrac1{\sqrt{1+x^2}}`, (x) => 1 / sqrt(1 + x * x)]],
    R`<p>$\dfrac d{dx}\ln\left(x+\sqrt{1+x^2}\right)=\dfrac1{\sqrt{1+x^2}}$. By parts with $dv=dx$: $x\ln(\cdots)-\int\dfrac x{\sqrt{1+x^2}}dx=x\ln(\cdots)-\sqrt{1+x^2}$.</p>`, 'Know the derivative of the log first.'),
  IM(4, 'by parts: e^x(f + f\')', Q('e^x\\,\\dfrac{1+\\sin x}{1+\\cos x}'), (x) => exp(x) * (1 + sin(x)) / (1 + cos(x)), [R`e^x\tan\dfrac x2`, (x) => exp(x) * tan(x / 2)], [[R`e^x\cot\dfrac x2`, (x) => exp(x) / tan(x / 2)], [R`2e^x\tan\dfrac x2`, (x) => 2 * exp(x) * tan(x / 2)], [R`\dfrac{e^x}2\tan\dfrac x2`, (x) => exp(x) * tan(x / 2) / 2]],
    R`<p>$\dfrac{1+\sin x}{1+\cos x}=\dfrac{1}{2\cos^2\frac x2}+\dfrac{2\sin\frac x2\cos\frac x2}{2\cos^2\frac x2}=\dfrac12\sec^2\dfrac x2+\tan\dfrac x2$. This is $f+f'$ with $f=\tan\dfrac x2$ (so $f'=\dfrac12\sec^2\dfrac x2$). The integral is $e^x\tan\dfrac x2$.</p>`, 'Split the fraction into the pair $f+f\'$.', [0.2, 0.7, 1.3, 2.0]),
  IM(4, 'by parts (repeated)', Q('(\\ln x)^2'), (x) => ln(x) ** 2, [R`x(\ln x)^2-2x\ln x+2x`, (x) => x * ln(x) ** 2 - 2 * x * ln(x) + 2 * x], [[R`x(\ln x)^2-2x\ln x-2x`, (x) => x * ln(x) ** 2 - 2 * x * ln(x) - 2 * x], [R`x(\ln x)^2+2x\ln x+2x`, (x) => x * ln(x) ** 2 + 2 * x * ln(x) + 2 * x], [R`\dfrac{(\ln x)^3}3`, (x) => ln(x) ** 3 / 3]],
    R`<p>$\int(\ln x)^2dx=x(\ln x)^2-\int x\cdot2\ln x\cdot\dfrac1xdx=x(\ln x)^2-2\int\ln x\,dx=x(\ln x)^2-2(x\ln x-x)$.</p>`, 'Signs alternate: $+,-,+$ on the three terms.'),
  IM(4, 'trigonometric', Q('\\sec^4x'), (x) => 1 / cos(x) ** 4, [R`\tan x+\dfrac{\tan^3x}3`, (x) => tan(x) + tan(x) ** 3 / 3], [[R`\tan x-\dfrac{\tan^3x}3`, (x) => tan(x) - tan(x) ** 3 / 3], [R`\dfrac{\sec^5x}5`, (x) => sec(x) ** 5 / 5], [R`\dfrac{\tan^5x}5`, (x) => tan(x) ** 5 / 5]],
    R`<p>$\sec^4x=\sec^2x(1+\tan^2x)$. With $u=\tan x$: $\int(1+u^2)du=u+\dfrac{u^3}3$.</p>`, 'Save $\\sec^2x$ for $du$.', [0.2, 0.5, 0.9, 1.2]),
  IM(4, 'partial fractions', Q('\\dfrac1{x^2(x^2+1)}'), (x) => 1 / (x * x * (x * x + 1)), [R`-\dfrac1x-\tan^{-1}x`, (x) => -1 / x - atan(x)], [[R`-\dfrac1x+\tan^{-1}x`, (x) => -1 / x + atan(x)], [R`\dfrac1x-\tan^{-1}x`, (x) => 1 / x - atan(x)], [R`\ln\left|\dfrac x{x^2+1}\right|`, (x) => ln(abs(x / (x * x + 1)))]],
    R`<p>$\dfrac1{x^2(x^2+1)}=\dfrac1{x^2}-\dfrac1{x^2+1}$. Integrate: $-\dfrac1x-\tan^{-1}x$.</p>`, 'Subtract: $\\dfrac1{x^2}-\\dfrac1{x^2+1}$.'),
  IM(4, 'substitution', Q('x^3\\sqrt{1+x^2}'), (x) => x ** 3 * sqrt(1 + x * x), [R`\dfrac{(1+x^2)^{5/2}}5-\dfrac{(1+x^2)^{3/2}}3`, (x) => (1 + x * x) ** 2.5 / 5 - (1 + x * x) ** 1.5 / 3], [[R`\dfrac{(1+x^2)^{5/2}}5+\dfrac{(1+x^2)^{3/2}}3`, (x) => (1 + x * x) ** 2.5 / 5 + (1 + x * x) ** 1.5 / 3], [R`\dfrac{(1+x^2)^{5/2}}{10}-\dfrac{(1+x^2)^{3/2}}6`, (x) => (1 + x * x) ** 2.5 / 10 - (1 + x * x) ** 1.5 / 6], [R`\dfrac{x^4}4\cdot\dfrac{(1+x^2)^{3/2}}3`, (x) => x ** 4 / 4 * (1 + x * x) ** 1.5 / 3]],
    R`<p>$u=1+x^2$, $x^2=u-1$, $x\,dx=\dfrac{du}2$. $\dfrac12\int(u-1)\sqrt u\,du=\dfrac12\left(\dfrac{u^{5/2}}{5/2}-\dfrac{u^{3/2}}{3/2}\right)=\dfrac{u^{5/2}}5-\dfrac{u^{3/2}}3$.</p>`, 'Keep one $x$ for $du$ and turn the other $x^2$ into $u-1$.'),
  IM(4, 'trigonometric', Q('\\dfrac1{\\sin^2x\\cos^2x}'), (x) => 1 / (sin(x) ** 2 * cos(x) ** 2), [R`\tan x-\cot x`, (x) => tan(x) - cot(x)], [[R`\tan x+\cot x`, (x) => tan(x) + cot(x)], [R`\dfrac14\cot2x`, (x) => cot(2 * x) / 4], [R`-\dfrac1{\sin x\cos x}`, (x) => -1 / (sin(x) * cos(x))]],
    R`<p>$1=\sin^2x+\cos^2x$, so $\dfrac1{\sin^2x\cos^2x}=\dfrac1{\cos^2x}+\dfrac1{\sin^2x}=\sec^2x+\operatorname{cosec}^2x$. Integrate: $\tan x-\cot x$.</p>`, '$\\int\\operatorname{cosec}^2x\\,dx=-\\cot x$.', [0.4, 0.7, 1.0, 1.3]),
  IM(4, 'trigonometric', Q('\\dfrac1{4\\sin^2x+9\\cos^2x}'), (x) => 1 / (4 * sin(x) ** 2 + 9 * cos(x) ** 2), [R`\dfrac16\tan^{-1}\dfrac{2\tan x}3`, (x) => atan(2 * tan(x) / 3) / 6], [[R`\dfrac12\tan^{-1}\dfrac{2\tan x}3`, (x) => atan(2 * tan(x) / 3) / 2], [R`\dfrac16\tan^{-1}\dfrac{3\tan x}2`, (x) => atan(3 * tan(x) / 2) / 6], [R`\dfrac1{36}\tan^{-1}\dfrac{2\tan x}3`, (x) => atan(2 * tan(x) / 3) / 36]],
    R`<p>Divide top and bottom by $\cos^2x$: $\dfrac{\sec^2x}{4\tan^2x+9}$. $t=\tan x$: $\int\dfrac{dt}{4t^2+9}=\dfrac14\int\dfrac{dt}{t^2+\frac94}=\dfrac14\cdot\dfrac23\tan^{-1}\dfrac{2t}3=\dfrac16\tan^{-1}\dfrac{2\tan x}3$.</p>`, 'Factor the 4 out first: $\\dfrac14\\cdot\\dfrac23=\\dfrac16$.', [0.2, 0.5, 0.9, 1.2]),
  IM(4, 'by parts', Q('\\tan^{-1}\\sqrt x'), (x) => atan(sqrt(x)), [R`(x+1)\tan^{-1}\sqrt x-\sqrt x`, (x) => (x + 1) * atan(sqrt(x)) - sqrt(x)], [[R`(x+1)\tan^{-1}\sqrt x+\sqrt x`, (x) => (x + 1) * atan(sqrt(x)) + sqrt(x)], [R`x\tan^{-1}\sqrt x-\sqrt x`, (x) => x * atan(sqrt(x)) - sqrt(x)], [R`(x-1)\tan^{-1}\sqrt x-\sqrt x`, (x) => (x - 1) * atan(sqrt(x)) - sqrt(x)]],
    R`<p>Put $x=t^2$: $\int2t\tan^{-1}t\,dt=t^2\tan^{-1}t-\int\dfrac{t^2}{1+t^2}dt=t^2\tan^{-1}t-t+\tan^{-1}t=(t^2+1)\tan^{-1}t-t$. Back: $(x+1)\tan^{-1}\sqrt x-\sqrt x$.</p>`, 'Rationalise with $x=t^2$ before parts.'),
  IM(4, 'by parts', Q('\\dfrac{x\\sin^{-1}x}{\\sqrt{1-x^2}}'), (x) => x * asin(x) / sqrt(1 - x * x), [R`x-\sqrt{1-x^2}\,\sin^{-1}x`, (x) => x - sqrt(1 - x * x) * asin(x)], [[R`x+\sqrt{1-x^2}\,\sin^{-1}x`, (x) => x + sqrt(1 - x * x) * asin(x)], [R`-\sqrt{1-x^2}\,\sin^{-1}x`, (x) => -sqrt(1 - x * x) * asin(x)], [R`\dfrac{(\sin^{-1}x)^2}2`, (x) => asin(x) ** 2 / 2]],
    R`<p>Take $dv=\dfrac x{\sqrt{1-x^2}}dx$ (so $v=-\sqrt{1-x^2}$) and $u=\sin^{-1}x$: $-\sqrt{1-x^2}\sin^{-1}x+\int\sqrt{1-x^2}\cdot\dfrac1{\sqrt{1-x^2}}dx=-\sqrt{1-x^2}\sin^{-1}x+x$.</p>`, 'Here the algebraic factor is not the one differentiated.', [0.1, 0.3, 0.5, 0.8]),

  // ---------- L5 top rank ----------
  IM(5, 'substitution', Q('\\dfrac{x^2-1}{x\\sqrt{x^4+3x^2+1}}'), (x) => (x * x - 1) / (x * sqrt(x ** 4 + 3 * x * x + 1)), [R`\ln\left(x+\dfrac1x+\sqrt{x^2+\dfrac1{x^2}+3}\right)`, (x) => ln(x + 1 / x + sqrt(x * x + 1 / (x * x) + 3))], [[R`\ln\left(x-\dfrac1x+\sqrt{x^2+\dfrac1{x^2}+3}\right)`, (x) => ln(abs(x - 1 / x + sqrt(x * x + 1 / (x * x) + 3)))], [R`\sinh^{-1}x`, (x) => Math.asinh(x)], [R`\dfrac12\ln\left(x^4+3x^2+1\right)`, (x) => ln(x ** 4 + 3 * x * x + 1) / 2]],
    R`<p>Divide numerator and denominator by $x^2$: $\dfrac{1-1/x^2}{\sqrt{x^2+3+1/x^2}}$. Let $t=x+\dfrac1x$: $dt=\left(1-\dfrac1{x^2}\right)dx$ and $x^2+\dfrac1{x^2}=t^2-2$, so the root is $\sqrt{t^2+1}$. $\int\dfrac{dt}{\sqrt{t^2+1}}=\ln\left(t+\sqrt{t^2+1}\right)$, and $t^2+1=x^2+\dfrac1{x^2}+3$.</p>`, 'The substitution $t=x+1/x$ is invisible until you divide by $x^2$.', [0.4, 0.8, 1.3, 1.9]),
  IM(5, 'by parts: e^x(f + f\')', Q('\\dfrac{xe^x}{(x+1)^2}'), (x) => x * exp(x) / (x + 1) ** 2, [R`\dfrac{e^x}{x+1}`, (x) => exp(x) / (x + 1)], [[R`\dfrac{xe^x}{x+1}`, (x) => x * exp(x) / (x + 1)], [R`\dfrac{e^x}{(x+1)^2}`, (x) => exp(x) / (x + 1) ** 2], [R`e^x\ln(x+1)`, (x) => exp(x) * ln(x + 1)]],
    R`<p>Write $\dfrac x{(x+1)^2}=\dfrac1{x+1}-\dfrac1{(x+1)^2}$. This is $f+f'$ with $f=\dfrac1{x+1}$ ($f'=-\dfrac1{(x+1)^2}$). So the integral is $e^xf=\dfrac{e^x}{x+1}$.</p>`, 'Rewrite $\\dfrac x{(x+1)^2}$ using $x=(x+1)-1$.'),
  IM(5, 'substitution', Q('\\left(\\dfrac{\\ln x-1}{1+(\\ln x)^2}\\right)^2'), (x) => ((ln(x) - 1) / (1 + ln(x) ** 2)) ** 2, [R`\dfrac x{1+(\ln x)^2}`, (x) => x / (1 + ln(x) ** 2)], [[R`\dfrac{x}{1-(\ln x)^2}`, (x) => x / (1 - ln(x) ** 2)], [R`\dfrac{\ln x-1}{1+(\ln x)^2}`, (x) => (ln(x) - 1) / (1 + ln(x) ** 2)], [R`\dfrac{x\ln x}{1+(\ln x)^2}`, (x) => x * ln(x) / (1 + ln(x) ** 2)]],
    R`<p>Guess $F=\dfrac x{1+L^2}$ with $L=\ln x$. $F'=\dfrac{(1+L^2)-x\cdot2L\cdot\frac1x}{(1+L^2)^2}=\dfrac{1-2L+L^2}{(1+L^2)^2}=\dfrac{(L-1)^2}{(1+L^2)^2}$, which is the integrand. (Structure: $\dfrac{u'v-uv'}{v^2}$ with $u=x$.)</p>`, 'Recognise a quotient-rule derivative; no method forces it.', [1.5, 2.2, 3.1, 4.4]),
  IM(5, 'by parts', Q('\\cos(\\ln x)'), (x) => cos(ln(x)), [R`\dfrac x2\left[\cos(\ln x)+\sin(\ln x)\right]`, (x) => x / 2 * (cos(ln(x)) + sin(ln(x)))], [[R`\dfrac x2\left[\cos(\ln x)-\sin(\ln x)\right]`, (x) => x / 2 * (cos(ln(x)) - sin(ln(x)))], [R`x\left[\cos(\ln x)+\sin(\ln x)\right]`, (x) => x * (cos(ln(x)) + sin(ln(x)))], [R`x\sin(\ln x)`, (x) => x * sin(ln(x))]],
    R`<p>Let $I=\int\cos(\ln x)dx$. By parts: $I=x\cos(\ln x)+\int\sin(\ln x)dx$. Again: $\int\sin(\ln x)dx=x\sin(\ln x)-I$. So $I=x\cos(\ln x)+x\sin(\ln x)-I$ and $I=\dfrac x2[\cos(\ln x)+\sin(\ln x)]$.</p>`, 'The repeated integral moves to the left side: divide by 2.'),
  IM(5, 'trigonometric', Q('\\dfrac{\\sin x}{\\sin x-\\cos x}'), (x) => sin(x) / (sin(x) - cos(x)), [R`\dfrac x2+\dfrac12\ln|\sin x-\cos x|`, (x) => x / 2 + ln(abs(sin(x) - cos(x))) / 2], [[R`\dfrac x2-\dfrac12\ln|\sin x-\cos x|`, (x) => x / 2 - ln(abs(sin(x) - cos(x))) / 2], [R`x+\ln|\sin x-\cos x|`, (x) => x + ln(abs(sin(x) - cos(x)))], [R`\dfrac x2+\dfrac12\ln|\sin x+\cos x|`, (x) => x / 2 + ln(abs(sin(x) + cos(x))) / 2]],
    R`<p>Write $\sin x=\dfrac12(\sin x-\cos x)+\dfrac12(\sin x+\cos x)$. Then $\dfrac12\int dx+\dfrac12\int\dfrac{\sin x+\cos x}{\sin x-\cos x}dx$, and $\dfrac d{dx}(\sin x-\cos x)=\cos x+\sin x$. Result: $\dfrac x2+\dfrac12\ln|\sin x-\cos x|$.</p>`, 'The derivative of the denominator is $\\sin x+\\cos x$.', [0.1, 0.3, 0.5, 0.8]),
  IM(5, 'substitution', Q('x^3e^{x^2}'), (x) => x ** 3 * exp(x * x), [R`\dfrac{e^{x^2}(x^2-1)}2`, (x) => exp(x * x) * (x * x - 1) / 2], [[R`\dfrac{e^{x^2}(x^2+1)}2`, (x) => exp(x * x) * (x * x + 1) / 2], [R`e^{x^2}(x^2-1)`, (x) => exp(x * x) * (x * x - 1)], [R`\dfrac{x^4e^{x^2}}4`, (x) => x ** 4 * exp(x * x) / 4]],
    R`<p>$u=x^2$, $x\,dx=\dfrac{du}2$: $\dfrac12\int ue^udu=\dfrac12(u-1)e^u=\dfrac{e^{x^2}(x^2-1)}2$.</p>`, 'Substitute first, then parts.', [0.4, 0.8, 1.1, 1.4]),
  IM(5, 'reduction-style', Q('\\sec^3x'), (x) => 1 / cos(x) ** 3, [R`\dfrac12\sec x\tan x+\dfrac12\ln|\sec x+\tan x|`, (x) => sec(x) * tan(x) / 2 + ln(abs(sec(x) + tan(x))) / 2], [[R`\dfrac12\sec x\tan x-\dfrac12\ln|\sec x+\tan x|`, (x) => sec(x) * tan(x) / 2 - ln(abs(sec(x) + tan(x))) / 2], [R`\sec x\tan x+\ln|\sec x+\tan x|`, (x) => sec(x) * tan(x) + ln(abs(sec(x) + tan(x)))], [R`\dfrac{\sec^4x}4`, (x) => sec(x) ** 4 / 4]],
    R`<p>By parts with $u=\sec x$, $dv=\sec^2x\,dx$: $I=\sec x\tan x-\int\sec x\tan^2x\,dx=\sec x\tan x-\int\sec^3x\,dx+\int\sec x\,dx$. So $2I=\sec x\tan x+\ln|\sec x+\tan x|$.</p>`, 'The same integral appears on the right; solve for it.', [0.2, 0.5, 0.9, 1.2]),

  // ---------- more L3-L5 ----------
  IM(3, 'substitution', Q('\\dfrac1{e^x+e^{-x}}'), (x) => 1 / (exp(x) + exp(-x)), [R`\tan^{-1}(e^x)`, (x) => atan(exp(x))], [[R`\ln(e^x+e^{-x})`, (x) => ln(exp(x) + exp(-x))], [R`\dfrac12\tan^{-1}(e^x)`, (x) => atan(exp(x)) / 2], [R`\tan^{-1}(e^{-x})`, (x) => atan(exp(-x))]],
    R`<p>Multiply top and bottom by $e^x$: $\dfrac{e^x}{e^{2x}+1}$. $u=e^x$: $\int\dfrac{du}{u^2+1}=\tan^{-1}e^x$.</p>`, 'Multiply by $e^x/e^x$ to expose $d(e^x)$.'),
  IM(3, 'substitution', Q('\\dfrac1{1+e^x}'), (x) => 1 / (1 + exp(x)), [R`x-\ln(1+e^x)`, (x) => x - ln(1 + exp(x))], [[R`\ln(1+e^x)`, (x) => ln(1 + exp(x))], [R`x+\ln(1+e^x)`, (x) => x + ln(1 + exp(x))], [R`-\dfrac1{(1+e^x)^2}`, (x) => -1 / (1 + exp(x)) ** 2]],
    R`<p>$\dfrac1{1+e^x}=1-\dfrac{e^x}{1+e^x}$. Integrate: $x-\ln(1+e^x)$. (Equivalent form: $\ln\dfrac{e^x}{1+e^x}$.)</p>`, 'Add and subtract $e^x$ in the numerator.'),
  IM(5, 'trigonometric', Q('\\dfrac1{5+4\\cos x}'), (x) => 1 / (5 + 4 * cos(x)), [R`\dfrac23\tan^{-1}\left(\dfrac13\tan\dfrac x2\right)`, (x) => 2 / 3 * atan(tan(x / 2) / 3)], [[R`\dfrac13\tan^{-1}\left(\dfrac13\tan\dfrac x2\right)`, (x) => atan(tan(x / 2) / 3) / 3], [R`\dfrac23\tan^{-1}\left(3\tan\dfrac x2\right)`, (x) => 2 / 3 * atan(3 * tan(x / 2))], [R`\dfrac29\tan^{-1}\left(\tan\dfrac x2\right)`, (x) => 2 / 9 * atan(tan(x / 2))]],
    R`<p>$t=\tan\dfrac x2$: $5+4\cos x=\dfrac{5(1+t^2)+4(1-t^2)}{1+t^2}=\dfrac{9+t^2}{1+t^2}$ and $dx=\dfrac{2dt}{1+t^2}$. So $\int\dfrac{2\,dt}{9+t^2}=\dfrac23\tan^{-1}\dfrac t3$.</p>`, 'Here $\\sqrt{a^2-b^2}=3$, so the pattern is $\\dfrac2{\\sqrt{a^2-b^2}}$.', [0.4, 0.8, 1.3, 1.9, 2.6]),
  IM(5, 'quotient-rule integrals', Q('\\dfrac{x^2}{(x\\sin x+\\cos x)^2}'), (x) => x * x / (x * sin(x) + cos(x)) ** 2, [R`\dfrac{\sin x-x\cos x}{x\sin x+\cos x}`, (x) => (sin(x) - x * cos(x)) / (x * sin(x) + cos(x))], [[R`\dfrac{\sin x+x\cos x}{x\sin x+\cos x}`, (x) => (sin(x) + x * cos(x)) / (x * sin(x) + cos(x))], [R`-\dfrac1{x\sin x+\cos x}`, (x) => -1 / (x * sin(x) + cos(x))], [R`\dfrac{x\sin x-\cos x}{x\sin x+\cos x}`, (x) => (x * sin(x) - cos(x)) / (x * sin(x) + cos(x))]],
    R`<p>Let $D=x\sin x+\cos x$; $D'=x\cos x$. Note $N=\sin x-x\cos x$ has $N'=x\sin x$. Then $\left(\dfrac ND\right)'=\dfrac{N'D-ND'}{D^2}=\dfrac{x\sin x(x\sin x+\cos x)-(\sin x-x\cos x)x\cos x}{D^2}=\dfrac{x^2}{D^2}$. So the integral is $\dfrac ND$.</p>`, 'Guess $N/D$ using $D\'=x\\cos x$; the numerator must make the cross terms cancel.', [0.4, 0.8, 1.3, 1.9]),
  IM(5, 'partial fractions (quadratic factors)', Q('\\dfrac1{x^3+1}'), (x) => 1 / (x ** 3 + 1), [R`\dfrac13\ln|x+1|-\dfrac16\ln(x^2-x+1)+\dfrac1{\sqrt3}\tan^{-1}\dfrac{2x-1}{\sqrt3}`, (x) => ln(abs(x + 1)) / 3 - ln(x * x - x + 1) / 6 + atan((2 * x - 1) / sqrt(3)) / sqrt(3)], [[R`\dfrac13\ln|x+1|+\dfrac16\ln(x^2-x+1)+\dfrac1{\sqrt3}\tan^{-1}\dfrac{2x-1}{\sqrt3}`, (x) => ln(abs(x + 1)) / 3 + ln(x * x - x + 1) / 6 + atan((2 * x - 1) / sqrt(3)) / sqrt(3)], [R`\dfrac13\ln|x+1|-\dfrac16\ln(x^2-x+1)+\dfrac1{\sqrt3}\tan^{-1}\dfrac{2x+1}{\sqrt3}`, (x) => ln(abs(x + 1)) / 3 - ln(x * x - x + 1) / 6 + atan((2 * x + 1) / sqrt(3)) / sqrt(3)], [R`\dfrac13\ln|x+1|-\dfrac13\ln(x^2-x+1)+\dfrac1{\sqrt3}\tan^{-1}\dfrac{2x-1}{\sqrt3}`, (x) => ln(abs(x + 1)) / 3 - ln(x * x - x + 1) / 3 + atan((2 * x - 1) / sqrt(3)) / sqrt(3)]],
    R`<p>$x^3+1=(x+1)(x^2-x+1)$. $\dfrac1{x^3+1}=\dfrac{1/3}{x+1}+\dfrac{-\frac13x+\frac23}{x^2-x+1}$. For the second, $-\dfrac13x+\dfrac23=-\dfrac16(2x-1)+\dfrac12$, giving $-\dfrac16\ln(x^2-x+1)+\dfrac12\cdot\dfrac2{\sqrt3}\tan^{-1}\dfrac{2x-1}{\sqrt3}$.</p>`, 'Complete the square on $x^2-x+1=\\left(x-\\tfrac12\\right)^2+\\tfrac34$.'),
  M(2, 'standard forms', R`The formula $\displaystyle\int x^n\,dx=\dfrac{x^{n+1}}{n+1}+C$ fails for $n=-1$. The correct result for $n=-1$ is`, R`$\ln|x|+C$`, [R`$\dfrac{x^0}0+C$`, R`$\dfrac1{x}+C$`, R`$-\dfrac1{x^2}+C$`],
    R`<p>For $n=-1$ the denominator $n+1=0$. Instead $\dfrac d{dx}\ln|x|=\dfrac1x$, so $\int\dfrac{dx}x=\ln|x|+C$. The modulus makes it valid for negative $x$ too.</p>`, 'The power rule has an exception; the exception gives the logarithm.'),
  M(3, 'concepts', R`Which of the following integrals can NOT be written in terms of elementary functions?`, R`$\displaystyle\int e^{x^2}\,dx$`, [R`$\displaystyle\int xe^{x^2}\,dx$`, R`$\displaystyle\int\dfrac{dx}{1+x^2}$`, R`$\displaystyle\int x^2e^x\,dx$`],
    R`<p>$xe^{x^2}$ has the antiderivative $\dfrac{e^{x^2}}2$ (the extra $x$ is $du$). $x^2e^x$ is done by parts. $\dfrac1{1+x^2}$ gives $\tan^{-1}x$. But $e^{x^2}$ alone has no elementary antiderivative (it defines the error function).</p>`, 'A missing factor of $x$ changes the whole problem.'),
  M(3, 'concepts', R`Two students integrate $\displaystyle\int\sin x\cos x\,dx$. Anil gets $\dfrac{\sin^2x}2+C$ and Biju gets $-\dfrac{\cos^2x}2+C$. Which statement is correct?`, R`Both are correct; they differ by a constant`, [R`Only Anil is correct`, R`Only Biju is correct`, R`Both are wrong; the answer is $-\dfrac{\cos2x}2+C$`],
    R`<p>$\dfrac{\sin^2x}2-\left(-\dfrac{\cos^2x}2\right)=\dfrac{\sin^2x+\cos^2x}2=\dfrac12$, a constant. So both are antiderivatives. ($-\dfrac{\cos2x}4$ is a third valid form; $-\dfrac{\cos2x}2$ is too large by a factor of 2.)</p>`, 'Different-looking answers can differ by a constant.'),
  M(2, 'concepts', R`$\displaystyle\int\dfrac{f'(x)}{f(x)}\,dx$ equals`, R`$\ln|f(x)|+C$`, [R`$\dfrac{\ln f(x)}{f'(x)}+C$`, R`$\ln|f'(x)|+C$`, R`$\dfrac{1}{f(x)}+C$`],
    R`<p>With $u=f(x)$, $du=f'(x)dx$, the integral is $\int\dfrac{du}u=\ln|u|=\ln|f(x)|$.</p>`, 'The numerator must be the derivative of the denominator.'),
  M(3, 'concepts', R`In $\displaystyle\int x^3\ln x\,dx$ by parts, ILATE says take $u=$ and the integral becomes`, R`$\ln x$; $\dfrac{x^4}4\ln x-\dfrac{x^4}{16}+C$`, [R`$x^3$; $\dfrac{x^4}4\ln x-\dfrac{x^4}{16}+C$`, R`$\ln x$; $\dfrac{x^4}4\ln x-\dfrac{x^4}{4}+C$`, R`$\ln x$; $\dfrac{x^4}4\ln x+\dfrac{x^4}{16}+C$`],
    R`<p>L (logarithmic) comes before A (algebraic), so $u=\ln x$, $dv=x^3dx$, $v=\dfrac{x^4}4$. Then $\dfrac{x^4}4\ln x-\int\dfrac{x^4}4\cdot\dfrac1xdx=\dfrac{x^4}4\ln x-\dfrac{x^4}{16}$. (Taking $u=x^3$ would force you to integrate $\ln x$ first; the final expression is the same, but that choice of $u$ is the wrong method here and the question asks for both parts.)</p>`, 'ILATE: choose by what is easy to differentiate.'),
  M(2, 'concepts', R`The modulus sign in $\displaystyle\int\dfrac{dx}x=\ln|x|+C$ is there because`, R`$x$ may be negative, and $\ln x$ is defined only for $x>0$`, [R`$\ln x$ is always negative`, R`the answer must be a positive number`, R`$\dfrac d{dx}\ln x=\dfrac1{|x|}$`],
    R`<p>$\dfrac1x$ is defined for negative $x$ too. $\dfrac d{dx}\ln(-x)=\dfrac{-1}{-x}=\dfrac1x$, so $\ln|x|$ works on both sides of $0$.</p>`, 'The derivative of $\\ln|x|$ is $\\dfrac1x$ for every $x\\ne0$.'),

  // ---------- integer / numeric ----------
  I(1, 'finding f from f\'', R`$f'(x)=3x^2-4x+1$ and $f(1)=2$. Find $f(2)$.`, 4,
    R`<p>$f(x)=x^3-2x^2+x+C$. $f(1)=0+C=2$, so $C=2$. $f(2)=8-8+2+2=4$.</p>`, '$f(1)=1-2+1+C$, not just $C$.', { calc: () => Math.round(2 + simp((x) => 3 * x * x - 4 * x + 1, 1, 2, 2000)) }),
  I(2, 'finding f from f\'', R`$f'(x)=2\sin x\cos x$ and $f(0)=1$. Find $f\left(\dfrac\pi2\right)$.`, 2,
    R`<p>$f'(x)=\sin2x$, so $f(x)=-\dfrac{\cos2x}2+C$ (or $\sin^2x+C'$). $f(0)=-\dfrac12+C=1$, so $C=\dfrac32$. $f\left(\dfrac\pi2\right)=-\dfrac{\cos\pi}2+\dfrac32=\dfrac12+\dfrac32=2$.</p>`, 'Use the same form of antiderivative for the constant and the value.', { calc: () => Math.round(1 + simp((x) => 2 * sin(x) * cos(x), 0, PI_ / 2, 2000)) }),
  I(2, 'constants in standard results', R`If $\displaystyle\int\frac{dx}{x^2+6x+13}=\frac1a\tan^{-1}\left(\frac{x+b}a\right)+C$, find $a+b$.`, 5,
    R`<p>$x^2+6x+13=(x+3)^2+2^2$. So $a=2$, $b=3$, and $a+b=5$.</p>`, 'Complete the square: $13-9=4=2^2$.', { calc: () => { const a = 2, b = 3; return matches((x) => atan((x + b) / a) / a, (x) => 1 / (x * x + 6 * x + 13), DPTS) ? a + b : NaN; } }),
  I(2, 'constants in standard results', R`$\displaystyle\int xe^{2x}\,dx=e^{2x}(px+q)+C$. Find $\dfrac pq$.`, -2,
    R`<p>By parts: $\dfrac{xe^{2x}}2-\dfrac12\int e^{2x}dx=\dfrac{xe^{2x}}2-\dfrac{e^{2x}}4=e^{2x}\left(\dfrac x2-\dfrac14\right)$. So $p=\dfrac12$, $q=-\dfrac14$, $\dfrac pq=-2$.</p>`, 'Keep the signs: $q$ is negative.', { calc: () => { const p = 0.5, q = -0.25; return matches((x) => exp(2 * x) * (p * x + q), (x) => x * exp(2 * x), DPTS) ? p / q : NaN; } }),
  I(3, 'finding f from f\'', R`$f''(x)=12x^2-6x$, $f'(1)=3$ and $f(0)=1$. Find $f(2)$.`, 13,
    R`<p>$f'(x)=4x^3-3x^2+C_1$; $f'(1)=4-3+C_1=3$ gives $C_1=2$. $f(x)=x^4-x^3+2x+C_2$; $f(0)=C_2=1$. $f(2)=16-8+4+1=13$.</p>`, 'Two conditions fix two constants, one per integration.', { calc: () => { const fp = (x) => 3 + simp((t) => 12 * t * t - 6 * t, 1, x, 400); return Math.round(1 + simp(fp, 0, 2, 400)); } }),
  I(3, 'finding f from f\'', R`A curve passes through $(1,2)$ and its slope at every point $(x,y)$ is $3x^2-2x$. Its $y$-value at $x=2$ is`, 6,
    R`<p>$y=x^3-x^2+C$. Through $(1,2)$: $0+C=2$. $y(2)=8-4+2=6$.</p>`, '$x^3-x^2=0$ at $x=1$, so $C=2$.', { calc: () => Math.round(2 + simp((x) => 3 * x * x - 2 * x, 1, 2, 2000)) }),
  I(3, 'finding f from f\'', R`$f'(x)=|2x-2|$ and $f(1)=5$. Find $f(0)+f(3)$.`, 13,
    R`<p>$f(0)=f(1)-\int_0^1(2-2x)dx=5-1=4$. $f(3)=f(1)+\int_1^3(2x-2)dx=5+4=9$. Sum $=13$.</p>`, 'The modulus changes sign at $x=1$, so integrate each side with its own sign.', { calc: () => Math.round((5 - simp((x) => abs(2 * x - 2), 0, 1, 2000)) + (5 + simp((x) => abs(2 * x - 2), 1, 3, 2000))) }),
  I(3, 'partial fractions', R`$\displaystyle\int\frac{dx}{x(x^2+1)}=A\ln|x|+B\ln(x^2+1)+C$. Find $2(A-B)$.`, 3,
    R`<p>$\dfrac1{x(x^2+1)}=\dfrac1x-\dfrac x{x^2+1}$. Integrate: $\ln|x|-\dfrac12\ln(x^2+1)$. $A=1$, $B=-\dfrac12$, so $2(A-B)=2\cdot\dfrac32=3$.</p>`, 'Second integral is half a log.', { calc: () => { const A = 1, B = -0.5; return matches((x) => A * ln(x) + B * ln(x * x + 1), (x) => 1 / (x * (x * x + 1)), DPTS) ? 2 * (A - B) : NaN; } }),
  I(4, 'by parts', R`$\displaystyle\int x^3e^x\,dx=e^x\left(x^3+ax^2+bx+c\right)+C$. Find $a+b+c$.`, -3,
    R`<p>Repeated by parts (signs alternate with factorial coefficients): $e^x(x^3-3x^2+6x-6)$. So $a=-3$, $b=6$, $c=-6$ and $a+b+c=-3$. (Check by differentiating: $e^x[(x^3-3x^2+6x-6)+(3x^2-6x+6)]=x^3e^x$.)</p>`, 'Derivatives of $x^3$: $3x^2,6x,6$ with alternating signs.', { calc: () => { const a = -3, b = 6, c = -6; return matches((x) => exp(x) * (x ** 3 + a * x * x + b * x + c), (x) => x ** 3 * exp(x), DPTS) ? a + b + c : NaN; } }),
  I(4, 'by parts', R`$\displaystyle\int e^x(x^2+3x+2)\,dx=e^xg(x)+C$ where $g$ is a polynomial. Find $g(3)$.`, 13,
    R`<p>Look for $g+g'=x^2+3x+2$. Try $g=x^2+x+1$: $g'=2x+1$, $g+g'=x^2+3x+2$ ✓. $g(3)=9+3+1=13$.</p>`, 'Match coefficients of $g+g\'$; $g$ has the same degree as the polynomial.', { calc: () => { const g = (x) => x * x + x + 1; return matches((x) => exp(x) * g(x), (x) => exp(x) * (x * x + 3 * x + 2), DPTS) ? g(3) : NaN; } }),
  I(2, 'finding f from f\'', R`The velocity of a particle is $v(t)=3t^2-4t$ m/s and it starts at $s=1$ m. Its position at $t=3$ s is (m)`, 10,
    R`<p>$s=t^3-2t^2+C$, $s(0)=C=1$. $s(3)=27-18+1=10$.</p>`, 'Position, not displacement, includes the starting value.', { calc: () => Math.round(1 + simp((t) => 3 * t * t - 4 * t, 0, 3, 2000)) }),
  D(3, 'by parts', R`$F(x)=\displaystyle\int xe^{2x}\,dx$ with $F(0)=0$. Find $F(1)$.`, 2.0973,
    R`<p>$F(x)=e^{2x}\left(\dfrac x2-\dfrac14\right)+C$. $F(0)=-\dfrac14+C=0$ gives $C=\dfrac14$. $F(1)=e^2\cdot\dfrac14+\dfrac14=\dfrac{e^2+1}4\approx2.097$.</p>`, 'The constant is $+\\tfrac14$ to make $F(0)=0$.', { calc: () => simp((x) => x * exp(2 * x), 0, 1, 4000) }),
  D(4, 'by parts', R`$F'(x)=\tan^{-1}x$ with $F(0)=0$. Find $F(2)$.`, 1.4096,
    R`<p>$F(x)=x\tan^{-1}x-\dfrac12\ln(1+x^2)+C$, with $C=0$ since $F(0)=0$. $F(2)=2\tan^{-1}2-\dfrac12\ln5\approx2(1.1071)-0.8047=1.41$.</p>`, 'Evaluate $\\tan^{-1}2\\approx1.1071$ in radians.', { calc: () => simp(atan, 0, 2, 4000) }),

  // ---------- assertion-reason ----------
  A(2, 'standard forms', R`$\displaystyle\int\dfrac{dx}x=\ln|x|+C$ for every $x\ne0$.`, R`$\dfrac d{dx}\ln|x|=\dfrac1x$ for all $x\ne0$.`, 0,
    R`<p>For $x<0$, $\ln|x|=\ln(-x)$ and $\dfrac d{dx}\ln(-x)=\dfrac{-1}{-x}=\dfrac1x$. So R is true and it is exactly why A holds on both sides of $0$.</p>`, 'The modulus is needed for negative $x$.'),
  A(2, 'standard forms', R`$\displaystyle\int x^n\,dx=\dfrac{x^{n+1}}{n+1}+C$ for every real number $n$.`, R`$\dfrac d{dx}\ln x=\dfrac1x$.`, 3,
    R`<p>A is false at $n=-1$ (division by zero). R is true, and it is the fact that supplies the missing case, but it does not support A.</p>`, 'There is exactly one exception, $n=-1$.'),
  A(3, 'by parts', R`$\displaystyle\int xe^x\,dx=(x-1)e^x+C$.`, R`The derivative of $e^x$ is $e^x$.`, 1,
    R`<p>Differentiating $(x-1)e^x$ gives $e^x+(x-1)e^x=xe^x$, so A is true. R is true, but it only tells us how $e^x$ behaves; by itself it does not explain why the answer has the factor $(x-1)$ (that comes from parts).</p>`, 'A true reason is not necessarily the explanation.'),
  A(3, 'by parts', R`In $\displaystyle\int xe^x\,dx$ we take $u=x$ and $dv=e^xdx$.`, R`ILATE ranks algebraic functions above exponential ones, so the algebraic factor is taken as $u$.`, 0,
    R`<p>Taking $u=x$ makes $du=dx$, simplifying the integral. ILATE is the rule of thumb that gives this choice: A is correct and R explains it.</p>`, 'Taking $u=e^x$ would raise the power of $x$ instead.'),
  A(3, 'concepts', R`$\sin^2x$ and $-\cos^2x$ are both antiderivatives of $2\sin x\cos x$.`, R`Any two antiderivatives of the same function must be equal.`, 2,
    R`<p>$\dfrac d{dx}\sin^2x=2\sin x\cos x$ and $\dfrac d{dx}(-\cos^2x)=2\sin x\cos x$: A is true. They differ by the constant $1$, so they are not equal; R is false (they differ by a constant).</p>`, 'Equal derivatives give functions that differ by a constant.'),
  A(3, 'concepts', R`$\displaystyle\int e^{x^2}\,dx=\dfrac{e^{x^2}}{2x}+C$.`, R`$\dfrac d{dx}e^{x^2}=2xe^{x^2}$.`, 3,
    R`<p>Differentiating $\dfrac{e^{x^2}}{2x}$ gives $e^{x^2}-\dfrac{e^{x^2}}{2x^2}\ne e^{x^2}$, so A is false (indeed $e^{x^2}$ has no elementary antiderivative). R is true.</p>`, 'You cannot divide by the inner derivative unless it is a constant.'),
  A(3, 'quadratic denominators', R`$\displaystyle\int\dfrac{dx}{x^2+4}=\dfrac12\tan^{-1}\dfrac x2+C$.`, R`$\displaystyle\int\dfrac{dx}{x^2+a^2}=\tan^{-1}\dfrac xa+C$.`, 2,
    R`<p>A is true: $\dfrac d{dx}\dfrac12\tan^{-1}\dfrac x2=\dfrac12\cdot\dfrac{1/2}{1+x^2/4}=\dfrac1{x^2+4}$. R is false: the correct formula has $\dfrac1a$ in front.</p>`, 'The standard form carries a $\\tfrac1a$.'),
  A(4, 'trigonometric', R`$\displaystyle\int\sin2x\,dx=-\dfrac{\cos2x}2+C$.`, R`$\displaystyle\int\sin2x\,dx=\sin^2x+C$.`, 1,
    R`<p>A is true. R is also true as an antiderivative ($\dfrac d{dx}\sin^2x=\sin2x$; it differs from $-\dfrac{\cos2x}2$ by the constant $\dfrac12$), but it is a different form, not a reason for A.</p>`, 'Two valid forms are not explanations of each other.'),
  A(4, 'partial fractions', R`$\displaystyle\int\dfrac{2x+3}{x^2+3x+7}\,dx=\ln(x^2+3x+7)+C$.`, R`The numerator is the derivative of the denominator.`, 0,
    R`<p>$\dfrac d{dx}(x^2+3x+7)=2x+3$, so the integral is $\int\dfrac{du}u=\ln|u|$; the denominator is always positive so no modulus is needed. R explains A.</p>`, 'Check the numerator against $d(\\text{denominator})$.'),

  // ---------- statements ----------
  S(2, 'trigonometric', R`$\displaystyle\int\tan x\,dx=\ln|\sec x|+C$.`, R`$\displaystyle\int\tan x\,dx=-\ln|\cos x|+C$.`, 0,
    R`<p>$\ln|\sec x|=-\ln|\cos x|$. Both are the same antiderivative, so both are true.</p>`, 'They look different but are identical.'),
  S(2, 'standard forms', R`$\displaystyle\int\dfrac{dx}{\sqrt{1-x^2}}=\sin^{-1}x+C$.`, R`$\displaystyle\int\dfrac{dx}{\sqrt{1-x^2}}=\cos^{-1}x+C$.`, 1,
    R`<p>I is true. $\dfrac d{dx}\cos^{-1}x=-\dfrac1{\sqrt{1-x^2}}$, so II is false (the correct related form is $-\cos^{-1}x+C$).</p>`, 'Cosine-inverse carries a minus sign.'),
  S(3, 'substitution', R`$\displaystyle\int\dfrac{dx}{1+x^2}=\ln(1+x^2)+C$.`, R`$\displaystyle\int\dfrac{2x}{1+x^2}dx=\ln(1+x^2)+C$.`, 2,
    R`<p>I is false: the integral is $\tan^{-1}x$. II is true: the numerator is the derivative of the denominator.</p>`, 'A constant numerator gives $\\tan^{-1}$, an $x$ numerator gives a log.'),
  S(3, 'trigonometric', R`$\displaystyle\int\sin^2x\,dx=\dfrac{\sin^3x}3+C$.`, R`$\displaystyle\int\cos^2x\,dx=\dfrac x2-\dfrac{\sin2x}4+C$.`, 3,
    R`<p>I is false: $\int\sin^2x\,dx=\dfrac x2-\dfrac{\sin2x}4$ (the power rule does not apply to $\sin x$). II is false: $\int\cos^2x\,dx=\dfrac x2+\dfrac{\sin2x}4$.</p>`, 'Half-angle formulas: minus for sine squared, plus for cosine squared.'),
  S(4, 'by parts', R`$\displaystyle\int e^x\left(f(x)+f'(x)\right)dx=e^xf(x)+C$.`, R`$\displaystyle\int e^x\left(f(x)-f'(x)\right)dx=e^xf(x)+C$.`, 1,
    R`<p>I is true: $\left(e^xf\right)'=e^x(f+f')$. II is false: $e^x(f-f')$ is the derivative of $e^xf$ only when $f'$ is replaced by $-f'$; in general it integrates to something else. Example: $f=x$: $\int e^x(x-1)dx=e^x(x-2)+C\ne e^xx$.</p>`, 'The plus sign is essential.'),
  S(4, 'by parts', R`$\displaystyle\int\dfrac{dx}{1+e^x}=x-\ln(1+e^x)+C$.`, R`$\displaystyle\int\dfrac{dx}{1+e^x}=\ln\dfrac{e^x}{1+e^x}+C$.`, 0,
    R`<p>$\ln\dfrac{e^x}{1+e^x}=x-\ln(1+e^x)$. The two forms are equal, so both statements are true.</p>`, 'Split the log of a quotient.'),
  SC(3, 'standard forms', [R`$\displaystyle\int a^x\,dx=\dfrac{a^x}{\ln a}+C$ for $a>0,a\ne1$.`, R`$\displaystyle\int\dfrac{dx}{x\ln x}=\ln|\ln x|+C$.`, R`$\displaystyle\int\sec x\,dx=\ln|\sec x+\tan x|+C$.`, R`$\displaystyle\int\dfrac{dx}{a^2+x^2}=\tan^{-1}\dfrac xa+C$.`], '3', ['2', '4', '1'],
    R`<p>(1) True. (2) True ($u=\ln x$). (3) True. (4) False: there should be a factor $\dfrac1a$ in front. Three are correct.</p>`, 'The $\\tan^{-1}$ form has a $\\tfrac1a$.'),
  SC(4, 'irrational integrands', [R`$\displaystyle\int\dfrac{dx}{\sqrt{x^2-a^2}}=\ln\left|x+\sqrt{x^2-a^2}\right|+C$.`, R`$\displaystyle\int\sqrt{a^2-x^2}\,dx=\dfrac x2\sqrt{a^2-x^2}+\dfrac{a^2}2\sin^{-1}\dfrac xa+C$.`, R`$\displaystyle\int\dfrac{dx}{a^2-x^2}=\dfrac1{2a}\ln\left|\dfrac{a-x}{a+x}\right|+C$.`, R`$\displaystyle\int\operatorname{cosec}x\,dx=\ln|\operatorname{cosec}x+\cot x|+C$.`], '2', ['1', '3', '4'],
    R`<p>(1) True. (2) True. (3) False: it is $\dfrac1{2a}\ln\left|\dfrac{a+x}{a-x}\right|$ (the fraction is flipped compared with the $x^2-a^2$ case). (4) False: $\int\operatorname{cosec}x\,dx=\ln|\operatorname{cosec}x-\cot x|=-\ln|\operatorname{cosec}x+\cot x|$. Two are correct.</p>`, 'Flip the fraction when the denominator is $a^2-x^2$.'),

  // ---------- multi ----------
  X(3, 'methods', R`Which of these integrals can be done by a single substitution (no parts needed)?`, [R`$\displaystyle\int xe^{x^2}\,dx$`, R`$\displaystyle\int\sin x\cos x\,dx$`, R`$\displaystyle\int xe^x\,dx$`, R`$\displaystyle\int\dfrac{dx}{x\ln x}$`], [0, 1, 3],
    R`<p>$xe^{x^2}$: $u=x^2$. $\sin x\cos x$: $u=\sin x$. $\dfrac1{x\ln x}$: $u=\ln x$. $xe^x$ has no inner function whose derivative is present; it needs parts.</p>`, 'Look for a function and its derivative both present.'),
  X(3, 'trigonometric', R`Which results are correct?`, [R`$\displaystyle\int\cot x\,dx=\ln|\sin x|+C$`, R`$\displaystyle\int\sec x\,dx=\ln|\sec x+\tan x|+C$`, R`$\displaystyle\int\operatorname{cosec}x\,dx=\ln|\operatorname{cosec}x-\cot x|+C$`, R`$\displaystyle\int\tan x\,dx=\ln|\cos x|+C$`], [0, 1, 2],
    R`<p>The first three are standard. The last should be $-\ln|\cos x|$.</p>`, 'Sign of the $\\tan$ integral.'),
  X(3, 'concepts', R`Which of these are antiderivatives of $f(x)=2\sin x\cos x$?`, [R`$\sin^2x$`, R`$-\cos^2x$`, R`$-\dfrac12\cos2x$`, R`$\dfrac12\sin2x$`], [0, 1, 2],
    R`<p>$f=\sin2x$. $\sin^2x$: derivative $2\sin x\cos x$ ✓. $-\cos^2x$ ✓. $-\dfrac12\cos2x$: derivative $\sin2x$ ✓. $\dfrac12\sin2x$ has derivative $\cos2x$ ✗.</p>`, 'Differentiate each option to test it.'),
  X(3, 'methods', R`Which integrals need integration by parts?`, [R`$\displaystyle\int\tan^{-1}x\,dx$`, R`$\displaystyle\int\dfrac x{x^2+1}\,dx$`, R`$\displaystyle\int\ln x\,dx$`, R`$\displaystyle\int x\ln x\,dx$`], [0, 2, 3],
    R`<p>$\tan^{-1}x$, $\ln x$ and $x\ln x$ are products or inverse functions with no substitution. $\dfrac x{x^2+1}$ is a log by substitution.</p>`, 'Inverse trigonometric and log functions alone use parts.'),
  X(4, 'by parts', R`Which integrals have the form $\displaystyle\int e^x\left(f+f'\right)dx$ so that they equal $e^xf$?`, [R`$\displaystyle\int e^x(\sin x+\cos x)\,dx$`, R`$\displaystyle\int e^x(\cos x-\sin x)\,dx$`, R`$\displaystyle\int e^x\sin x\,dx$`, R`$\displaystyle\int e^x\left(\dfrac1x-\dfrac1{x^2}\right)dx$`], [0, 1, 3],
    R`<p>$f=\sin x$ ($f'=\cos x$): ✓. $f=\cos x$ ($f'=-\sin x$): ✓. $e^x\sin x$ alone is not $f+f'$ for a simple $f$ (needs parts twice). $f=\dfrac1x$: ✓.</p>`, '$\\cos x-\\sin x$ is $f+f\'$ with $f=\\cos x$.'),
  X(3, 'concepts', R`Which statements about antiderivatives are true?`, [R`Two antiderivatives of the same function differ by a constant`, R`Every continuous function on an interval has an antiderivative there`, R`$\displaystyle\int f(x)\,dx$ stands for a whole family of functions`, R`Every elementary function has an elementary antiderivative`], [0, 1, 2],
    R`<p>The first three are standard facts. The last is false: $e^{x^2}$ and $\dfrac{\sin x}x$ have none.</p>`, 'Existence does not mean a formula.'),
  X(3, 'inverse trigonometric', R`Which functions $F$ satisfy $F'(x)=\dfrac1{1+x^2}$?`, [R`$\dfrac12\ln(x^2+1)$`, R`$\tan^{-1}x$`, R`$\tan^{-1}x+7$`, R`$-\cot^{-1}x$`], [1, 2, 3],
    R`<p>$\tan^{-1}x$ ✓, plus a constant ✓, and $\dfrac d{dx}(-\cot^{-1}x)=\dfrac1{1+x^2}$ ✓. The first has derivative $\dfrac x{x^2+1}$ ✗.</p>`, '$\\cot^{-1}x$ has the negative derivative.'),
  X(4, 'partial fractions', R`For $\dfrac1{x^2(x+1)}=\dfrac Ax+\dfrac B{x^2}+\dfrac C{x+1}$, which are true?`, [R`$B=1$`, R`$C=1$`, R`$A=-1$`, R`$A+B+C=2$`], [0, 1, 2],
    R`<p>$1=Ax(x+1)+B(x+1)+Cx^2$. $x=0$: $B=1$. $x=-1$: $C=1$. $x^2$ coefficient: $A+C=0$ so $A=-1$. $A+B+C=-1+1+1=1$, so the last statement is false.</p>`, 'The cover-up method misses the middle coefficient $A$; use the $x^2$ terms.'),

  // ---------- matching ----------
  MT(2, 'methods', 'm1', R`Match each integral with the best method.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'],
    R`<p>A: $u=x^2$ (q). B: $x\cos x$ by parts (p). C: $x^2-4$ factorises: partial fractions (r). D: $\sqrt{9-x^2}$ is the $\sin^{-1}$ standard form (s).</p>`, 'A product is not always parts: check for a substitution first.'),
  MT(2, 'standard forms', 'm2', R`Match the integrals with their values (omitting $+C$).`, 'A-s, B-r, C-p, D-q', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    R`<p>A: $\tan^{-1}x$ (s). B: $u=\ln x$ gives $\ln|\ln x|$ (r). C: $-\ln|\cos x|$ (p). D: $\tan x$ (q).</p>`, 'Do not confuse $\\ln|\\cos x|$ with $-\\ln|\\cos x|$.'),
  MT(3, 'quadratic denominators', 'm3', R`Match each integral with its value (omitting $+C$).`, 'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-s, C-p, D-q', 'A-r, B-p, C-q, D-s'],
    R`<p>A: $\dfrac1{2}\tan^{-1}\dfrac x2$ (r). B: $\dfrac1{2a}\ln\left|\dfrac{x-a}{x+a}\right|$ with $a=2$ (p). C: $\dfrac1{2a}\ln\left|\dfrac{a+x}{a-x}\right|$ (s). D: $(x+1)^2+2^2$ gives $\dfrac12\tan^{-1}\dfrac{x+1}2$ (q).</p>`, 'B and C differ by a flip of the fraction (a sign).'),
  MT(3, 'by parts', 'm4', R`For integration by parts, match each integral with the function chosen as $u$ (by ILATE).`, 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-s, B-q, C-r, D-p'],
    R`<p>A: logarithm first: $u=\ln x$ (r). B: algebraic before exponential: $u=x$ (q). C: inverse trigonometric first: $u=\tan^{-1}x$ (s). D: algebraic before trigonometric: $u=x^3$ (p).</p>`, 'Only the first available letter in I, L, A, T, E counts.'),

  // ---------- passages ----------
  PI(2, 'finding f from f\'', 'p1', R`Find the position $s(2)$ in metres.`, 12,
    R`<p>$s(t)=\int(6t^2-4t+1)dt=2t^3-2t^2+t+C$, $s(0)=C=2$. $s(2)=16-8+2+2=12$.</p>`, 'Add the constant $2$.', { calc: () => Math.round(2 + simp((t) => 6 * t * t - 4 * t + 1, 0, 2, 2000)) }),
  PI(2, 'finding f from f\'', 'p1', R`Find the acceleration at $t=1$ s (m/s$^2$).`, 8,
    R`<p>$a=\dfrac{dv}{dt}=12t-4$. At $t=1$: $8$. (This is differentiating, not integrating.)</p>`, 'Acceleration is the derivative of velocity.', { calc: () => Math.round(dd((t) => 6 * t * t - 4 * t + 1, 1)) }),
  PI(3, 'finding f from f\'', 'p1', R`Find the displacement between $t=1$ s and $t=3$ s (m).`, 38,
    R`<p>$s(3)-s(1)=[2t^3-2t^2+t]_1^3=(54-18+3)-(2-2+1)=39-1=38$. (The constant cancels.)</p>`, 'The initial position does not matter for displacement.', { calc: () => Math.round(simp((t) => 6 * t * t - 4 * t + 1, 1, 3, 2000)) }),
  PI(3, 'by parts', 'p2', R`$I+J=e^x\,g(x)$. Find $g\left(\dfrac\pi2\right)$.`, 1,
    R`<p>By parts: $I=e^x\sin x-J$ (since $\int e^x\sin x\,dx=e^x\sin x-\int e^x\cos x\,dx$). So $I+J=e^x\sin x$, $g=\sin x$, $g\left(\dfrac\pi2\right)=1$.</p>`, 'Move $J$ across.', { calc: () => Math.round(sin(PI_ / 2)) }),
  PI(3, 'by parts', 'p2', R`$J-I=e^x\,h(x)$. Find $h(0)$.`, 1,
    R`<p>By parts: $J=e^x\cos x+I$ (since $\int e^x\cos x\,dx=e^x\cos x+\int e^x\sin x\,dx$). So $J-I=e^x\cos x$, $h=\cos x$, $h(0)=1$.</p>`, 'The sign is opposite to the $I+J$ case.', { calc: () => Math.round(cos(0)) }),
  PD(4, 'by parts', 'p2', R`Using $I=\dfrac{e^x(\sin x-\cos x)}2$ (constant $0$), find $2I$ at $x=\dfrac\pi2$.`, 4.8105,
    R`<p>Adding and subtracting: $I+J=e^x\sin x$ and $J-I=e^x\cos x$, so $I=\dfrac{e^x(\sin x-\cos x)}2$. At $x=\dfrac\pi2$: $2I=e^{\pi/2}(1-0)=e^{\pi/2}\approx4.81$.</p>`, '$\\sin\\dfrac\\pi2=1$, $\\cos\\dfrac\\pi2=0$.', { calc: () => exp(PI_ / 2) * (sin(PI_ / 2) - cos(PI_ / 2)) }),
  PI(2, 'partial fractions', 'p3', R`Find $A$.`, 1,
    R`<p>$5x+7=A(x+3)+B(x+1)$. $x=-1$: $2=2A$, $A=1$.</p>`, 'Put $x=-1$ to kill $B$.', { calc: () => { const x = -1 + 1e-7; return Math.round(((5 * x + 7) / (x + 3))); } }),
  PI(2, 'partial fractions', 'p3', R`Find $B$.`, 4,
    R`<p>$x=-3$: $-15+7=B(-2)$, $B=4$.</p>`, 'Put $x=-3$ to kill $A$.', { calc: () => { const x = -3 + 1e-7; return Math.round((5 * x + 7) / (x + 1)); } }),
  PD(3, 'partial fractions', 'p3', R`Evaluate $\displaystyle\int_0^1\dfrac{5x+7}{(x+1)(x+3)}\,dx$.`, 1.8439,
    R`<p>$\int=\ln|x+1|+4\ln|x+3|$. From $0$ to $1$: $\ln2+4\ln\dfrac43=0.6931+1.1507=1.8439$.</p>`, 'Use $\\ln3$ at $0$ and $\\ln4$ at $1$ for the second term.', { calc: () => simp((x) => (5 * x + 7) / ((x + 1) * (x + 3)), 0, 1, 4000) }),
];

items.forEach((it, i) => { it.id = `ii-${String(i + 1).padStart(3, '0')}`; });

// ---------- number templates ----------
const tm = (c, p, first) => { if (c === 0) return ''; const a = Math.abs(c); const sg = c < 0 ? '-' : first ? '' : '+'; const co = a === 1 && p > 0 ? '' : String(a); const x = p === 0 ? '' : p === 1 ? 'x' : `x^{${p}}`; return sg + co + x; };
const poly = (...pairs) => { let s = ''; pairs.forEach(([c, p]) => { s += tm(c, p, s === ''); }); return s || '0'; };
const nonzero = (rng, lo, hi) => { let v; do { v = int(rng, lo, hi); } while (v === 0); return v; };
const r4b = (x) => +x.toFixed(4);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** TeX for p/q reduced: integer, or \dfrac{p}{q} (negative sign in front) */
const fr = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? `${p}` : p < 0 ? `-\\dfrac{${-p}}{${q}}` : `\\dfrac{${p}}{${q}}`; };
/** coefficient p/q times a TeX factor, with sign */
const cf = (p, q, rest) => { const t = fr(p, q); if (t === '1') return rest; if (t === '-1') return `-${rest}`; return `${t}${rest}`; };
const asum = (...ts) => ts.filter((t) => t !== '' && t != null).reduce((s, t) => (s === '' ? t : t.startsWith('-') ? s + t : `${s}+${t}`), '') || '0';
const xp = (n) => (n === 0 ? '' : n === 1 ? 'x' : `x^{${n}}`);
const lin2 = (a, b) => `${a === 1 ? '' : a}x${b === 0 ? '' : b < 0 ? `-${-b}` : `+${b}`}`;
const txt = (t) => `$${t}+C$`;
/** options for an antiderivative mcq: asserts numerically that the good one differentiates to f and the others do not */
const GM = (rng, f, good, wrongs, pts = DPTS) => {
  if (!matches(good[1], f, pts)) throw new Error(`good option does not differentiate to f: ${good[0]}`);
  for (const w of wrongs) if (matches(w[1], f, pts)) throw new Error(`wrong option is also correct: ${w[0]}`);
  return shuffleOpts(rng, txt(good[0]), wrongs.map((w) => txt(w[0])));
};
/** an mcq template from a build(P) function returning { tex, f, good, wrongs, pts, sol } */
const mgen = (id, level, sub, paramsOf, build) => gen(id, level, 'mcq', 'single', sub, (rng) => {
  const P = paramsOf(rng); const B = build(P); const r = GM(rng, B.f, B.good, B.wrongs, B.pts);
  return { P, options: r.options, answer: r.answer, q: Q(B.tex), sol: B.sol };
}, (p) => {
  const B = build(p.P); const [lo, hi] = B.span ?? [0.5, 1.5];
  const dF = B.good[1](hi) - B.good[1](lo); const I = simp(B.f, lo, hi, 4000);
  if (!(Math.abs(dF - I) <= 1e-6 * (1 + Math.abs(I)))) throw new Error('integral check failed');
  return p.options.indexOf(txt(B.good[0]));
});

const gens = [
  gen('ii-g01', 1, 'nat', 'integer', 'finding f from f\'', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = 3 * int(rng, 1, 4), b = 2 * int(rng, -3, 4), c = int(rng, -4, 5), x1 = choose(rng, [2, 4]), y0 = int(rng, -5, 8);
      const ans = (a * x1 ** 3) / 3 + (b * x1 * x1) / 2 + c * x1 + y0;
      return { k, a, b, c, x1, y0, answer: ans, tol: 0, q: R`$f'(x)=${poly([a, 2], [b, 1], [c, 0])}$ and $f(0)=${y0}$. Find $f(${x1})$.`,
        sol: R`<p>$f(x)=${poly([a / 3, 3], [b / 2, 2], [c, 1], [y0, 0])}$ (the constant is $f(0)=${y0}$). $f(${x1})=${ans}$.</p>` }; }
    if (k === 1) { const a = int(rng, 1, 5), b = int(rng, -4, 5), x1 = choose(rng, [2, 4]), y0 = int(rng, -3, 6);
      const ans = (a * x1 ** 4) / 4 + b * x1 + y0;
      return { k, a, b, x1, y0, answer: ans, tol: 0, q: R`$f'(x)=${poly([a, 3], [b, 0])}$ and $f(0)=${y0}$. Find $f(${x1})$.`,
        sol: R`<p>$f(x)=${poly([a / 4, 4], [b, 1], [y0, 0])}$. $f(${x1})=${a * x1 ** 4 / 4}${sgn(b * x1)}${sgn(y0)}=${ans}$.</p>` }; }
    const a = 6 * int(rng, 1, 2), b = 2 * int(rng, -3, 3), p0 = int(rng, -3, 4), q0 = int(rng, -3, 5), x1 = choose(rng, [1, 2, 3]);
    const ans = (a * x1 ** 3) / 6 + (b * x1 * x1) / 2 + p0 * x1 + q0;
    return { k, a, b, p0, q0, x1, answer: ans, tol: 0, q: R`$f''(x)=${lin(a, b)}$, $f'(0)=${p0}$ and $f(0)=${q0}$. Find $f(${x1})$.`,
      sol: R`<p>$f'(x)=${poly([a / 2, 2], [b, 1], [p0, 0])}$ and $f(x)=${poly([a / 6, 3], [b / 2, 2], [p0, 1], [q0, 0])}$. $f(${x1})=${ans}$.</p>` };
  }, (p) => { if (p.k === 0) return Math.round(p.y0 + simp((x) => p.a * x * x + p.b * x + p.c, 0, p.x1, 400)); if (p.k === 1) return Math.round(p.y0 + simp((x) => p.a * x ** 3 + p.b, 0, p.x1, 400)); const fp = (x) => p.p0 + simp((t) => p.a * t + p.b, 0, x, 200); return Math.round(p.q0 + simp(fp, 0, p.x1, 200)); }),

  mgen('ii-g02', 1, 'power rule', (rng) => { let m, n; do { m = int(rng, 1, 6); n = int(rng, 0, 5); } while (m === n); return { m, n, a: nonzero(rng, -5, 6), b: nonzero(rng, -5, 6) }; }, ({ m, n, a, b }) => {
    const f = (x) => a * x ** m + b * x ** n;
    const t1 = (c, p, e) => cf(c, p + 1, xp(e)); const good = asum(t1(a, m, m + 1), t1(b, n, n + 1));
    return { tex: `\\left(${asum(cf(a, 1, xp(m)), cf(b, 1, xp(n)))}\\right)`, f, good: [good, (x) => a * x ** (m + 1) / (m + 1) + b * x ** (n + 1) / (n + 1)],
      wrongs: [[asum(cf(a, m, xp(m + 1)), n === 0 ? cf(b, 1, 'x') : cf(b, n, xp(n + 1))), (x) => a * x ** (m + 1) / m + (n === 0 ? b * x : b * x ** (n + 1) / n)], [asum(cf(a * m, 1, xp(m - 1)), n === 0 ? '' : cf(b * n, 1, xp(n - 1))), (x) => a * m * x ** (m - 1) + (n === 0 ? 0 : b * n * x ** (n - 1))], [asum(cf(a, 1, xp(m + 1)), cf(b, 1, xp(n + 1))), (x) => a * x ** (m + 1) + b * x ** (n + 1)]],
      sol: R`<p>$\int x^k\,dx=\dfrac{x^{k+1}}{k+1}$ term by term, keeping the coefficient: $${good}+C$.</p>`, span: [0.5, 1.5] };
  }),

  mgen('ii-g03', 2, 'substitution (linear inside)', (rng) => ({ a: int(rng, 2, 5), b: int(rng, -4, 6), n: int(rng, 2, 6) }), ({ a, b, n }) => {
    const L = lin2(a, b); const u = (x) => a * x + b;
    return { tex: `(${L})^{${n}}`, f: (x) => u(x) ** n, good: [`\\dfrac{(${L})^{${n + 1}}}{${a * (n + 1)}}`, (x) => u(x) ** (n + 1) / (a * (n + 1))],
      wrongs: [[`\\dfrac{(${L})^{${n + 1}}}{${n + 1}}`, (x) => u(x) ** (n + 1) / (n + 1)], [`\\dfrac{(${L})^{${n + 1}}}{${a}}`, (x) => u(x) ** (n + 1) / a], [`${a}(${L})^{${n + 1}}`, (x) => a * u(x) ** (n + 1)]],
      sol: R`<p>$u=${L}$, $du=${a}\,dx$. $\dfrac1{${a}}\int u^{${n}}du=\dfrac{u^{${n + 1}}}{${a}\cdot${n + 1}}=\dfrac{(${L})^{${n + 1}}}{${a * (n + 1)}}$.</p>` };
  }),

  mgen('ii-g04', 2, 'linear argument', (rng) => ({ v: int(rng, 0, 3), a: int(rng, 2, 3), b: int(rng, 0, 1) + 0 }), ({ v, a, b }) => {
    const A = lin2(a, b); const u = (x) => a * x + b; const pts = v === 3 ? [0.02, 0.05, 0.08, 0.1] : DPTS; const span = v === 3 ? [0.02, 0.1] : [0.5, 1.5];
    if (v === 0) return { tex: `e^{${A}}`, f: (x) => exp(u(x)), good: [`\\dfrac{e^{${A}}}{${a}}`, (x) => exp(u(x)) / a], wrongs: [[`${a}e^{${A}}`, (x) => a * exp(u(x))], [`e^{${A}}`, (x) => exp(u(x))], [`\\dfrac{e^{${A}}}{${A}}`, (x) => exp(u(x)) / u(x)]], sol: R`<p>$\int e^{ax+b}dx=\dfrac{e^{ax+b}}a$ with $a=${a}$.</p>`, pts, span };
    if (v === 1) return { tex: `\\sin(${A})`, f: (x) => sin(u(x)), good: [`-\\dfrac{\\cos(${A})}{${a}}`, (x) => -cos(u(x)) / a], wrongs: [[`\\dfrac{\\cos(${A})}{${a}}`, (x) => cos(u(x)) / a], [`-${a}\\cos(${A})`, (x) => -a * cos(u(x))], [`-\\cos(${A})`, (x) => -cos(u(x))]], sol: R`<p>$\int\sin(ax+b)dx=-\dfrac{\cos(ax+b)}a$ with $a=${a}$.</p>`, pts, span };
    if (v === 2) return { tex: `\\cos(${A})`, f: (x) => cos(u(x)), good: [`\\dfrac{\\sin(${A})}{${a}}`, (x) => sin(u(x)) / a], wrongs: [[`-\\dfrac{\\sin(${A})}{${a}}`, (x) => -sin(u(x)) / a], [`${a}\\sin(${A})`, (x) => a * sin(u(x))], [`\\sin(${A})`, (x) => sin(u(x))]], sol: R`<p>$\int\cos(ax+b)dx=\dfrac{\sin(ax+b)}a$ with $a=${a}$.</p>`, pts, span };
    return { tex: `\\sec^2(${A})`, f: (x) => 1 / cos(u(x)) ** 2, good: [`\\dfrac{\\tan(${A})}{${a}}`, (x) => tan(u(x)) / a], wrongs: [[`${a}\\tan(${A})`, (x) => a * tan(u(x))], [`\\tan(${A})`, (x) => tan(u(x))], [`\\dfrac{\\sec(${A})}{${a}}`, (x) => 1 / cos(u(x)) / a]], sol: R`<p>$\int\sec^2(ax+b)dx=\dfrac{\tan(ax+b)}a$ with $a=${a}$.</p>`, pts, span };
  }),

  mgen('ii-g05', 2, 'substitution (power inside)', (rng) => ({ v: int(rng, 0, 3), n: int(rng, 2, 5), c: int(rng, 1, 5), m: int(rng, 2, 4) }), ({ v, n, c, m }) => {
    const base = `x^{${n}}+${c}`; const g = (x) => x ** n + c; const pre = n === 2 ? 'x' : `x^{${n - 1}}`;
    if (v === 0) return { tex: `\\dfrac{${pre}}{${base}}`, f: (x) => x ** (n - 1) / g(x), good: [`\\dfrac1{${n}}\\ln(${base})`, (x) => ln(g(x)) / n], wrongs: [[`\\ln(${base})`, (x) => ln(g(x))], [`${n}\\ln(${base})`, (x) => n * ln(g(x))], [`\\dfrac{x^{${n}}}{${n}(${base})}`, (x) => x ** n / (n * g(x))]], sol: R`<p>$u=${base}$, $du=${n}${n === 2 ? 'x' : `x^{${n - 1}}`}dx$. $\dfrac1{${n}}\int\dfrac{du}u=\dfrac1{${n}}\ln(${base})$.</p>` };
    if (v === 1) return { tex: `${pre}e^{x^{${n}}}`, f: (x) => x ** (n - 1) * exp(x ** n), good: [`\\dfrac{e^{x^{${n}}}}{${n}}`, (x) => exp(x ** n) / n], wrongs: [[`e^{x^{${n}}}`, (x) => exp(x ** n)], [`${n}e^{x^{${n}}}`, (x) => n * exp(x ** n)], [`\\dfrac{x^{${n}}e^{x^{${n}}}}{${n}}`, (x) => x ** n * exp(x ** n) / n]], sol: R`<p>$u=x^{${n}}$, $du=${n}x^{${n - 1}}dx$. $\dfrac1{${n}}\int e^udu=\dfrac{e^{x^{${n}}}}{${n}}$.</p>`, pts: [0.3, 0.5, 0.7, 0.9] };
    if (v === 2) return { tex: `${pre}(${base})^{${m}}`, f: (x) => x ** (n - 1) * g(x) ** m, good: [`\\dfrac{(${base})^{${m + 1}}}{${n * (m + 1)}}`, (x) => g(x) ** (m + 1) / (n * (m + 1))], wrongs: [[`\\dfrac{(${base})^{${m + 1}}}{${m + 1}}`, (x) => g(x) ** (m + 1) / (m + 1)], [`\\dfrac{(${base})^{${m + 1}}}{${n}}`, (x) => g(x) ** (m + 1) / n], [`(${base})^{${m + 1}}`, (x) => g(x) ** (m + 1)]], sol: R`<p>$u=${base}$, $du=${n}x^{${n - 1}}dx$. $\dfrac1{${n}}\int u^{${m}}du=\dfrac{u^{${m + 1}}}{${n}\cdot${m + 1}}$.</p>`, pts: [0.3, 0.5, 0.7, 0.9] };
    return { tex: `\\dfrac{${pre}}{\\sqrt{${base}}}`, f: (x) => x ** (n - 1) / sqrt(g(x)), good: [cf(2, n, `\\sqrt{${base}}`), (x) => 2 * sqrt(g(x)) / n], wrongs: [[cf(1, n, `\\sqrt{${base}}`), (x) => sqrt(g(x)) / n], [`2\\sqrt{${base}}`, (x) => 2 * sqrt(g(x))], [`\\dfrac1{${n}}\\ln(${base})`, (x) => ln(g(x)) / n]], sol: R`<p>$u=${base}$, $du=${n}x^{${n - 1}}dx$. $\dfrac1{${n}}\int u^{-1/2}du=\dfrac{2\sqrt u}{${n}}$.</p>` };
  }),

  mgen('ii-g06', 2, 'standard quadratic forms', (rng) => ({ v: int(rng, 0, 5), a: int(rng, 2, 5) }), ({ v, a }) => {
    const a2 = a * a; const out = [0.4, 0.8, 1.3, a + 0.7, a + 1.9]; const inn = [0.1 * a, 0.3 * a, 0.5 * a, 0.8 * a]; const big = [a + 0.5, a + 1.2, a + 2, a + 3.1];
    if (v === 0) return { tex: `\\dfrac1{x^2+${a2}}`, f: (x) => 1 / (x * x + a2), good: [`\\dfrac1{${a}}\\tan^{-1}\\dfrac x{${a}}`, (x) => atan(x / a) / a], wrongs: [[`\\tan^{-1}\\dfrac x{${a}}`, (x) => atan(x / a)], [`\\dfrac1{${a}}\\tan^{-1}x`, (x) => atan(x) / a], [`\\dfrac1{${2 * a}}\\ln(x^2+${a2})`, (x) => ln(x * x + a2) / (2 * a)]], sol: R`<p>$\int\dfrac{dx}{x^2+a^2}=\dfrac1a\tan^{-1}\dfrac xa$ with $a=${a}$.</p>` };
    if (v === 1) return { tex: `\\dfrac1{x^2-${a2}}`, f: (x) => 1 / (x * x - a2), good: [`\\dfrac1{${2 * a}}\\ln\\left|\\dfrac{x-${a}}{x+${a}}\\right|`, (x) => ln(abs((x - a) / (x + a))) / (2 * a)], wrongs: [[`\\dfrac1{${2 * a}}\\ln\\left|\\dfrac{x+${a}}{x-${a}}\\right|`, (x) => ln(abs((x + a) / (x - a))) / (2 * a)], [`\\dfrac1{${a}}\\ln\\left|\\dfrac{x-${a}}{x+${a}}\\right|`, (x) => ln(abs((x - a) / (x + a))) / a], [`\\dfrac1{${a}}\\tan^{-1}\\dfrac x{${a}}`, (x) => atan(x / a) / a]], sol: R`<p>$\int\dfrac{dx}{x^2-a^2}=\dfrac1{2a}\ln\left|\dfrac{x-a}{x+a}\right|$ with $a=${a}$.</p>`, pts: out };
    if (v === 2) return { tex: `\\dfrac1{${a2}-x^2}`, f: (x) => 1 / (a2 - x * x), good: [`\\dfrac1{${2 * a}}\\ln\\left|\\dfrac{${a}+x}{${a}-x}\\right|`, (x) => ln(abs((a + x) / (a - x))) / (2 * a)], wrongs: [[`\\dfrac1{${2 * a}}\\ln\\left|\\dfrac{${a}-x}{${a}+x}\\right|`, (x) => ln(abs((a - x) / (a + x))) / (2 * a)], [`\\dfrac1{${a}}\\ln\\left|\\dfrac{${a}+x}{${a}-x}\\right|`, (x) => ln(abs((a + x) / (a - x))) / a], [`\\dfrac1{${a}}\\sin^{-1}\\dfrac x{${a}}`, (x) => asin(x / a) / a]], sol: R`<p>$\int\dfrac{dx}{a^2-x^2}=\dfrac1{2a}\ln\left|\dfrac{a+x}{a-x}\right|$ with $a=${a}$ (partial fractions $\dfrac1{2a}\left(\dfrac1{a-x}+\dfrac1{a+x}\right)$).</p>`, pts: inn };
    if (v === 3) return { tex: `\\dfrac1{\\sqrt{${a2}-x^2}}`, f: (x) => 1 / sqrt(a2 - x * x), good: [`\\sin^{-1}\\dfrac x{${a}}`, (x) => asin(x / a)], wrongs: [[`\\dfrac1{${a}}\\sin^{-1}\\dfrac x{${a}}`, (x) => asin(x / a) / a], [`\\sin^{-1}x`, (x) => asin(x)], [`\\cos^{-1}\\dfrac x{${a}}`, (x) => acos(x / a)]], sol: R`<p>$\int\dfrac{dx}{\sqrt{a^2-x^2}}=\sin^{-1}\dfrac xa$ with $a=${a}$ (no extra $\tfrac1a$).</p>`, pts: inn };
    if (v === 4) return { tex: `\\dfrac1{\\sqrt{x^2+${a2}}}`, f: (x) => 1 / sqrt(x * x + a2), good: [`\\ln\\left(x+\\sqrt{x^2+${a2}}\\right)`, (x) => ln(x + sqrt(x * x + a2))], wrongs: [[`\\dfrac1{${a}}\\ln\\left(x+\\sqrt{x^2+${a2}}\\right)`, (x) => ln(x + sqrt(x * x + a2)) / a], [`\\ln\\left|x-\\sqrt{x^2+${a2}}\\right|`, (x) => ln(abs(x - sqrt(x * x + a2)))], [`\\sqrt{x^2+${a2}}`, (x) => sqrt(x * x + a2)]], sol: R`<p>$\int\dfrac{dx}{\sqrt{x^2+a^2}}=\ln\left(x+\sqrt{x^2+a^2}\right)$ with $a^2=${a2}$.</p>` };
    return { tex: `\\dfrac1{\\sqrt{x^2-${a2}}}`, f: (x) => 1 / sqrt(x * x - a2), good: [`\\ln\\left(x+\\sqrt{x^2-${a2}}\\right)`, (x) => ln(x + sqrt(x * x - a2))], wrongs: [[`\\dfrac1{${a}}\\ln\\left(x+\\sqrt{x^2-${a2}}\\right)`, (x) => ln(x + sqrt(x * x - a2)) / a], [`\\ln\\left(x-\\sqrt{x^2-${a2}}\\right)`, (x) => ln(x - sqrt(x * x - a2))], [`\\sqrt{x^2-${a2}}`, (x) => sqrt(x * x - a2)]], sol: R`<p>$\int\dfrac{dx}{\sqrt{x^2-a^2}}=\ln\left|x+\sqrt{x^2-a^2}\right|$ with $a^2=${a2}$ (for $x>a$).</p>`, pts: big, span: [a + 0.5, a + 2] };
  }),

  mgen('ii-g22', 2, 'half-angle integrals', (rng) => ({ v: int(rng, 0, 2), k: int(rng, 2, 4) }), ({ v, k }) => {
    const pts = v === 2 ? [0.05, 0.1, 0.15, 0.2] : DPTS; const span = v === 2 ? [0.05, 0.2] : [0.5, 1.5]; const kx = k === 1 ? 'x' : `${k}x`;
    if (v === 0) return { tex: `\\sin^2(${kx})`, f: (x) => sin(k * x) ** 2, good: [`\\dfrac x2-\\dfrac{\\sin(${2 * k}x)}{${4 * k}}`, (x) => x / 2 - sin(2 * k * x) / (4 * k)], wrongs: [[`\\dfrac x2+\\dfrac{\\sin(${2 * k}x)}{${4 * k}}`, (x) => x / 2 + sin(2 * k * x) / (4 * k)], [`\\dfrac x2-\\dfrac{\\sin(${2 * k}x)}{${2 * k}}`, (x) => x / 2 - sin(2 * k * x) / (2 * k)], [`\\dfrac x2-\\dfrac{\\sin(${2 * k}x)}{4}`, (x) => x / 2 - sin(2 * k * x) / 4]], sol: R`<p>$\sin^2\theta=\dfrac{1-\cos2\theta}2$ with $\theta=${kx}$: $\dfrac12\left(x-\dfrac{\sin(${2 * k}x)}{${2 * k}}\right)$.</p>`, pts, span };
    if (v === 1) return { tex: `\\cos^2(${kx})`, f: (x) => cos(k * x) ** 2, good: [`\\dfrac x2+\\dfrac{\\sin(${2 * k}x)}{${4 * k}}`, (x) => x / 2 + sin(2 * k * x) / (4 * k)], wrongs: [[`\\dfrac x2-\\dfrac{\\sin(${2 * k}x)}{${4 * k}}`, (x) => x / 2 - sin(2 * k * x) / (4 * k)], [`\\dfrac x2+\\dfrac{\\sin(${2 * k}x)}{${2 * k}}`, (x) => x / 2 + sin(2 * k * x) / (2 * k)], [`\\dfrac x2+\\dfrac{\\sin(${2 * k}x)}{4}`, (x) => x / 2 + sin(2 * k * x) / 4]], sol: R`<p>$\cos^2\theta=\dfrac{1+\cos2\theta}2$ with $\theta=${kx}$: $\dfrac12\left(x+\dfrac{\sin(${2 * k}x)}{${2 * k}}\right)$.</p>`, pts, span };
    return { tex: `\\tan^2(${kx})`, f: (x) => tan(k * x) ** 2, good: [`\\dfrac{\\tan(${kx})}{${k}}-x`, (x) => tan(k * x) / k - x], wrongs: [[`\\dfrac{\\tan(${kx})}{${k}}+x`, (x) => tan(k * x) / k + x], [`\\tan(${kx})-x`, (x) => tan(k * x) - x], [`\\dfrac{\\tan^3(${kx})}{${3 * k}}`, (x) => tan(k * x) ** 3 / (3 * k)]], sol: R`<p>$\tan^2\theta=\sec^2\theta-1$. $\int\sec^2(${kx})dx=\dfrac{\tan(${kx})}{${k}}$, so the result is $\dfrac{\tan(${kx})}{${k}}-x$.</p>`, pts, span };
  }),

  mgen('ii-g11', 3, 'powers of sin, cos, tan', (rng) => ({ v: int(rng, 0, 3), m: int(rng, 2, 5) }), ({ v, m }) => {
    const pts = v === 2 ? [0.1, 0.3, 0.5, 0.8] : v === 3 ? [0.5, 0.9, 1.3, 1.9] : DPTS; const span = v === 2 ? [0.1, 0.8] : v === 3 ? [0.5, 1.9] : [0.5, 1.5];
    if (v === 0) return { tex: `\\sin^{${m}}x\\cos x`, f: (x) => sin(x) ** m * cos(x), good: [`\\dfrac{\\sin^{${m + 1}}x}{${m + 1}}`, (x) => sin(x) ** (m + 1) / (m + 1)], wrongs: [[`-\\dfrac{\\sin^{${m + 1}}x}{${m + 1}}`, (x) => -(sin(x) ** (m + 1)) / (m + 1)], [`\\dfrac{\\sin^{${m + 1}}x}{${m}}`, (x) => sin(x) ** (m + 1) / m], [`\\dfrac{\\cos^{${m + 1}}x}{${m + 1}}`, (x) => cos(x) ** (m + 1) / (m + 1)]], sol: R`<p>$u=\sin x$, $du=\cos x\,dx$: $\int u^{${m}}du=\dfrac{u^{${m + 1}}}{${m + 1}}$.</p>`, pts, span };
    if (v === 1) return { tex: `\\sin x\\cos^{${m}}x`, f: (x) => sin(x) * cos(x) ** m, good: [`-\\dfrac{\\cos^{${m + 1}}x}{${m + 1}}`, (x) => -(cos(x) ** (m + 1)) / (m + 1)], wrongs: [[`\\dfrac{\\cos^{${m + 1}}x}{${m + 1}}`, (x) => cos(x) ** (m + 1) / (m + 1)], [`-\\dfrac{\\cos^{${m + 1}}x}{${m}}`, (x) => -(cos(x) ** (m + 1)) / m], [`-\\dfrac{\\sin^{${m + 1}}x}{${m + 1}}`, (x) => -(sin(x) ** (m + 1)) / (m + 1)]], sol: R`<p>$u=\cos x$, $du=-\sin x\,dx$: $-\int u^{${m}}du=-\dfrac{\cos^{${m + 1}}x}{${m + 1}}$.</p>`, pts, span };
    if (v === 2) return { tex: `\\tan^{${m}}x\\sec^2x`, f: (x) => tan(x) ** m / cos(x) ** 2, good: [`\\dfrac{\\tan^{${m + 1}}x}{${m + 1}}`, (x) => tan(x) ** (m + 1) / (m + 1)], wrongs: [[`\\dfrac{\\sec^{${m + 1}}x}{${m + 1}}`, (x) => (1 / cos(x)) ** (m + 1) / (m + 1)], [`\\dfrac{\\tan^{${m + 1}}x}{${m}}`, (x) => tan(x) ** (m + 1) / m], [`-\\dfrac{\\tan^{${m + 1}}x}{${m + 1}}`, (x) => -(tan(x) ** (m + 1)) / (m + 1)]], sol: R`<p>$u=\tan x$, $du=\sec^2x\,dx$: $\dfrac{u^{${m + 1}}}{${m + 1}}$.</p>`, pts, span };
    return { tex: `\\cot^{${m}}x\\,\\operatorname{cosec}^2x`, f: (x) => (1 / tan(x)) ** m / sin(x) ** 2, good: [`-\\dfrac{\\cot^{${m + 1}}x}{${m + 1}}`, (x) => -((1 / tan(x)) ** (m + 1)) / (m + 1)], wrongs: [[`\\dfrac{\\cot^{${m + 1}}x}{${m + 1}}`, (x) => (1 / tan(x)) ** (m + 1) / (m + 1)], [`-\\dfrac{\\cot^{${m + 1}}x}{${m}}`, (x) => -((1 / tan(x)) ** (m + 1)) / m], [`-\\dfrac{\\operatorname{cosec}^{${m + 1}}x}{${m + 1}}`, (x) => -((1 / sin(x)) ** (m + 1)) / (m + 1)]], sol: R`<p>$u=\cot x$, $du=-\operatorname{cosec}^2x\,dx$: $-\int u^{${m}}du=-\dfrac{\cot^{${m + 1}}x}{${m + 1}}$.</p>`, pts, span };
  }),

  mgen('ii-g12', 3, 'by parts', (rng) => ({ v: int(rng, 0, 3), k: int(rng, 2, 5), m: int(rng, 1, 4) }), ({ v, k, m }) => {
    const pts = DPTS;
    if (v === 0) return { tex: `xe^{${k}x}`, f: (x) => x * exp(k * x), good: [`e^{${k}x}\\left(\\dfrac x${k}-\\dfrac1{${k * k}}\\right)`, (x) => exp(k * x) * (x / k - 1 / (k * k))], wrongs: [[`e^{${k}x}\\left(\\dfrac x${k}+\\dfrac1{${k * k}}\\right)`, (x) => exp(k * x) * (x / k + 1 / (k * k))], [`e^{${k}x}\\left(\\dfrac x${k}-\\dfrac1{${k}}\\right)`, (x) => exp(k * x) * (x / k - 1 / k)], [`e^{${k}x}\\left(${k}x-${k * k}\\right)`, (x) => exp(k * x) * (k * x - k * k)]], sol: R`<p>$u=x$, $dv=e^{${k}x}dx$, $v=\dfrac{e^{${k}x}}{${k}}$. $\dfrac{xe^{${k}x}}{${k}}-\dfrac1{${k}}\int e^{${k}x}dx=\dfrac{xe^{${k}x}}{${k}}-\dfrac{e^{${k}x}}{${k * k}}$.</p>` };
    if (v === 1) return { tex: `x\\sin${k}x`, f: (x) => x * sin(k * x), good: [`-\\dfrac{x\\cos${k}x}{${k}}+\\dfrac{\\sin${k}x}{${k * k}}`, (x) => -x * cos(k * x) / k + sin(k * x) / (k * k)], wrongs: [[`-\\dfrac{x\\cos${k}x}{${k}}-\\dfrac{\\sin${k}x}{${k * k}}`, (x) => -x * cos(k * x) / k - sin(k * x) / (k * k)], [`\\dfrac{x\\cos${k}x}{${k}}+\\dfrac{\\sin${k}x}{${k * k}}`, (x) => x * cos(k * x) / k + sin(k * x) / (k * k)], [`-\\dfrac{x\\cos${k}x}{${k}}+\\dfrac{\\sin${k}x}{${k}}`, (x) => -x * cos(k * x) / k + sin(k * x) / k]], sol: R`<p>$u=x$, $dv=\sin${k}x\,dx$, $v=-\dfrac{\cos${k}x}{${k}}$. $-\dfrac{x\cos${k}x}{${k}}+\dfrac1{${k}}\int\cos${k}x\,dx=-\dfrac{x\cos${k}x}{${k}}+\dfrac{\sin${k}x}{${k * k}}$.</p>` };
    if (v === 2) return { tex: `x\\cos${k}x`, f: (x) => x * cos(k * x), good: [`\\dfrac{x\\sin${k}x}{${k}}+\\dfrac{\\cos${k}x}{${k * k}}`, (x) => x * sin(k * x) / k + cos(k * x) / (k * k)], wrongs: [[`\\dfrac{x\\sin${k}x}{${k}}-\\dfrac{\\cos${k}x}{${k * k}}`, (x) => x * sin(k * x) / k - cos(k * x) / (k * k)], [`-\\dfrac{x\\sin${k}x}{${k}}+\\dfrac{\\cos${k}x}{${k * k}}`, (x) => -x * sin(k * x) / k + cos(k * x) / (k * k)], [`\\dfrac{x\\sin${k}x}{${k}}+\\dfrac{\\cos${k}x}{${k}}`, (x) => x * sin(k * x) / k + cos(k * x) / k]], sol: R`<p>$u=x$, $dv=\cos${k}x\,dx$, $v=\dfrac{\sin${k}x}{${k}}$. $\dfrac{x\sin${k}x}{${k}}-\dfrac1{${k}}\int\sin${k}x\,dx=\dfrac{x\sin${k}x}{${k}}+\dfrac{\cos${k}x}{${k * k}}$.</p>` };
    return { tex: `x^{${m}}\\ln x`, f: (x) => x ** m * ln(x), good: [`\\dfrac{x^{${m + 1}}\\ln x}{${m + 1}}-\\dfrac{x^{${m + 1}}}{${(m + 1) ** 2}}`, (x) => x ** (m + 1) * ln(x) / (m + 1) - x ** (m + 1) / (m + 1) ** 2], wrongs: [[`\\dfrac{x^{${m + 1}}\\ln x}{${m + 1}}+\\dfrac{x^{${m + 1}}}{${(m + 1) ** 2}}`, (x) => x ** (m + 1) * ln(x) / (m + 1) + x ** (m + 1) / (m + 1) ** 2], [`\\dfrac{x^{${m + 1}}\\ln x}{${m + 1}}-\\dfrac{x^{${m + 1}}}{${m + 1}}`, (x) => x ** (m + 1) * ln(x) / (m + 1) - x ** (m + 1) / (m + 1)], [`\\dfrac{x^{${m + 1}}}{${m + 1}}\\cdot\\dfrac1x`, (x) => x ** m / (m + 1)]], sol: R`<p>$u=\ln x$, $dv=x^{${m}}dx$, $v=\dfrac{x^{${m + 1}}}{${m + 1}}$. $\dfrac{x^{${m + 1}}\ln x}{${m + 1}}-\dfrac1{${m + 1}}\int x^{${m}}dx=\dfrac{x^{${m + 1}}\ln x}{${m + 1}}-\dfrac{x^{${m + 1}}}{${(m + 1) ** 2}}$.</p>` };
  }),

  mgen('ii-g13', 3, 'e^x (f + f\')', (rng) => ({ i: int(rng, 0, 9) }), ({ i }) => {
    const T = [
      { f: 'x^2', fp: '2x', F: (x) => x * x, G: (x) => 2 * x }, { f: 'x^3', fp: '3x^2', F: (x) => x ** 3, G: (x) => 3 * x * x },
      { f: '\\sin x', fp: '\\cos x', F: sin, G: cos }, { f: '\\cos x', fp: '-\\sin x', F: cos, G: (x) => -sin(x) },
      { f: '\\ln x', fp: '\\dfrac1x', F: ln, G: (x) => 1 / x }, { f: '\\dfrac1x', fp: '-\\dfrac1{x^2}', F: (x) => 1 / x, G: (x) => -1 / (x * x) },
      { f: 'x^4', fp: '4x^3', F: (x) => x ** 4, G: (x) => 4 * x ** 3 }, { f: '\\sin2x', fp: '2\\cos2x', F: (x) => sin(2 * x), G: (x) => 2 * cos(2 * x) },
      { f: '\\cos3x', fp: '-3\\sin3x', F: (x) => cos(3 * x), G: (x) => -3 * sin(3 * x) }, { f: '\\tan x', fp: '\\sec^2x', F: tan, G: (x) => 1 / cos(x) ** 2 },
    ][i];
    const join = T.fp.startsWith('-') ? T.fp : `+${T.fp}`;
    const integrand = i === 5 ? `e^x\\left(\\dfrac1x-\\dfrac1{x^2}\\right)` : i === 4 ? `e^x\\left(\\ln x+\\dfrac1x\\right)` : `e^x\\left(${T.f}${join}\\right)`;
    return { tex: integrand, f: (x) => exp(x) * (T.F(x) + T.G(x)), good: [`e^x\\,${i === 5 ? '\\dfrac1x' : T.f}`, (x) => exp(x) * T.F(x)], wrongs: [[`e^x\\,(${i === 5 ? '-\\dfrac1{x^2}' : T.fp})`, (x) => exp(x) * T.G(x)], [`e^x\\left(${i === 5 ? '\\dfrac1x' : T.f}\\right)^2`, (x) => exp(x) * T.F(x) ** 2], [`\\dfrac{e^x}2\\,${i === 5 ? '\\dfrac1x' : T.f}`, (x) => exp(x) * T.F(x) / 2]], sol: R`<p>The integrand has the form $e^x(f+f')$ with $f=${T.f}$ and $f'=${T.fp}$. So $\int e^x(f+f')dx=e^xf=e^x\,${T.f}$.</p>` };
  }),

  mgen('ii-g14', 3, '(px+q)/(quadratic)', (rng) => { const A = int(rng, 1, 3), m = int(rng, 1, 3), k = int(rng, 2, 3); let j; do { j = int(rng, 1, 4); } while (j === A); return { A, m, k, j }; }, ({ A, m, k, j }) => {
    const c = m * m + k * k, B = k * j; const den = poly([1, 2], [2 * m, 1], [c, 0]); const num = poly([2 * A, 1], [2 * A * m + B, 0]);
    const w = (a1, a2) => [`${a1 === 1 ? '' : a1}\\ln(${den})+${a2}\\tan^{-1}\\dfrac{x+${m}}{${k}}`, (x) => a1 * ln(x * x + 2 * m * x + c) + a2 * atan((x + m) / k)];
    return { tex: `\\dfrac{${num}}{${den}}`, f: (x) => (2 * A * x + 2 * A * m + B) / (x * x + 2 * m * x + c), good: [`${A === 1 ? '' : A}\\ln(${den})+${j === 1 ? '' : j}\\tan^{-1}\\dfrac{x+${m}}{${k}}`, (x) => A * ln(x * x + 2 * m * x + c) + j * atan((x + m) / k)], wrongs: [w(A, B), w(j, A), [`${2 * A}\\ln(${den})+${j === 1 ? '' : j}\\tan^{-1}\\dfrac{x+${m}}{${k}}`, (x) => 2 * A * ln(x * x + 2 * m * x + c) + j * atan((x + m) / k)]],
      sol: R`<p>Denominator $${den}=(x+${m})^2+${k}^2$, derivative $${poly([2, 1], [2 * m, 0])}$. Write the numerator as $${A}\,(${poly([2, 1], [2 * m, 0])})+${B}$. Then $${A}\ln(${den})+${B}\int\dfrac{dx}{(x+${m})^2+${k}^2}=${A}\ln(${den})+\dfrac{${B}}{${k}}\tan^{-1}\dfrac{x+${m}}{${k}}$, and $\dfrac{${B}}{${k}}=${j}$.</p>` };
  }),

  mgen('ii-g15', 3, 'partial fractions', (rng) => { let a, b, A, B; do { a = int(rng, 1, 4); b = int(rng, 1, 5); A = nonzero(rng, -4, 5); B = nonzero(rng, -4, 5); } while (a === b || A === B || A + B === 0); return { a, b, A, B }; }, ({ a, b, A, B }) => {
    const p = A + B, q = A * b + B * a; const num = poly([p, 1], [q, 0]); const co = (v) => (v === 1 ? '' : v === -1 ? '-' : v);
    const ex = (A1, B1) => asum(`${co(A1)}\\ln|x+${a}|`, `${co(B1)}\\ln|x+${b}|`);
    return { tex: `\\dfrac{${num}}{(x+${a})(x+${b})}`, f: (x) => (p * x + q) / ((x + a) * (x + b)), good: [ex(A, B), (x) => A * ln(abs(x + a)) + B * ln(abs(x + b))], wrongs: [[ex(B, A), (x) => B * ln(abs(x + a)) + A * ln(abs(x + b))], [ex(A, -B), (x) => A * ln(abs(x + a)) - B * ln(abs(x + b))], [`${co(p)}\\ln|(x+${a})(x+${b})|`.replace('1\\ln', '\\ln'), (x) => p * ln(abs((x + a) * (x + b)))]],
      sol: R`<p>$${num}=A(x+${b})+B(x+${a})$. $x=-${a}$: $A=\dfrac{${p * -a + q}}{${b - a}}=${A}$. $x=-${b}$: $B=\dfrac{${p * -b + q}}{${a - b}}=${B}$. Integrate: $${ex(A, B)}+C$.</p>` };
  }),

  mgen('ii-g21', 3, 'product to sum', (rng) => { const a = int(rng, 3, 6), b = int(rng, 1, a - 1); return { v: int(rng, 0, 2), a, b }; }, ({ v, a, b }) => {
    const s = a + b, d = a - b; const S1 = (x) => sin(s * x), D1 = (x) => sin(d * x), CS = (x) => cos(s * x), CD = (x) => cos(d * x);
    if (v === 0) return { tex: `\\sin${a}x\\cos${b}x`, f: (x) => sin(a * x) * cos(b * x), good: [`-\\dfrac{\\cos${s}x}{${2 * s}}-\\dfrac{\\cos${d}x}{${2 * d}}`, (x) => -CS(x) / (2 * s) - CD(x) / (2 * d)], wrongs: [[`-\\dfrac{\\cos${s}x}{${2 * s}}+\\dfrac{\\cos${d}x}{${2 * d}}`, (x) => -CS(x) / (2 * s) + CD(x) / (2 * d)], [`-\\dfrac{\\cos${s}x}{${2 * d}}-\\dfrac{\\cos${d}x}{${2 * s}}`, (x) => -CS(x) / (2 * d) - CD(x) / (2 * s)], [`-\\dfrac{\\cos${s}x}{${s}}-\\dfrac{\\cos${d}x}{${d}}`, (x) => -CS(x) / s - CD(x) / d]], sol: R`<p>$\sin A\cos B=\dfrac12[\sin(A+B)+\sin(A-B)]$, so $\sin${a}x\cos${b}x=\dfrac12(\sin${s}x+\sin${d}x)$. Integrate: $-\dfrac{\cos${s}x}{${2 * s}}-\dfrac{\cos${d}x}{${2 * d}}$.</p>` };
    if (v === 1) return { tex: `\\sin${a}x\\sin${b}x`, f: (x) => sin(a * x) * sin(b * x), good: [`\\dfrac{\\sin${d}x}{${2 * d}}-\\dfrac{\\sin${s}x}{${2 * s}}`, (x) => D1(x) / (2 * d) - S1(x) / (2 * s)], wrongs: [[`\\dfrac{\\sin${d}x}{${2 * d}}+\\dfrac{\\sin${s}x}{${2 * s}}`, (x) => D1(x) / (2 * d) + S1(x) / (2 * s)], [`\\dfrac{\\sin${d}x}{${2 * s}}-\\dfrac{\\sin${s}x}{${2 * d}}`, (x) => D1(x) / (2 * s) - S1(x) / (2 * d)], [`\\dfrac{\\sin${d}x}{${d}}-\\dfrac{\\sin${s}x}{${s}}`, (x) => D1(x) / d - S1(x) / s]], sol: R`<p>$\sin A\sin B=\dfrac12[\cos(A-B)-\cos(A+B)]$, so $\dfrac12(\cos${d}x-\cos${s}x)$. Integrate: $\dfrac{\sin${d}x}{${2 * d}}-\dfrac{\sin${s}x}{${2 * s}}$.</p>` };
    return { tex: `\\cos${a}x\\cos${b}x`, f: (x) => cos(a * x) * cos(b * x), good: [`\\dfrac{\\sin${d}x}{${2 * d}}+\\dfrac{\\sin${s}x}{${2 * s}}`, (x) => D1(x) / (2 * d) + S1(x) / (2 * s)], wrongs: [[`\\dfrac{\\sin${d}x}{${2 * d}}-\\dfrac{\\sin${s}x}{${2 * s}}`, (x) => D1(x) / (2 * d) - S1(x) / (2 * s)], [`\\dfrac{\\sin${d}x}{${2 * s}}+\\dfrac{\\sin${s}x}{${2 * d}}`, (x) => D1(x) / (2 * s) + S1(x) / (2 * d)], [`\\dfrac{\\sin${d}x}{${d}}+\\dfrac{\\sin${s}x}{${s}}`, (x) => D1(x) / d + S1(x) / s]], sol: R`<p>$\cos A\cos B=\dfrac12[\cos(A-B)+\cos(A+B)]$, so $\dfrac12(\cos${d}x+\cos${s}x)$. Integrate: $\dfrac{\sin${d}x}{${2 * d}}+\dfrac{\sin${s}x}{${2 * s}}$.</p>` };
  }),

  mgen('ii-g16', 4, '1/(ax^2+bx+c) with a leading coefficient', (rng) => ({ a: int(rng, 2, 4), m: int(rng, 1, 3), k: int(rng, 2, 3) }), ({ a, m, k }) => {
    const den = poly([a, 2], [2 * a * m, 1], [a * (m * m + k * k), 0]); const ak = a * k;
    return { tex: `\\dfrac1{${den}}`, f: (x) => 1 / (a * x * x + 2 * a * m * x + a * (m * m + k * k)), good: [`${fr(1, ak) === '1' ? '' : fr(1, ak)}\\tan^{-1}\\dfrac{x+${m}}{${k}}`, (x) => atan((x + m) / k) / ak], wrongs: [[`${fr(1, k)}\\tan^{-1}\\dfrac{x+${m}}{${k}}`, (x) => atan((x + m) / k) / k], [`${fr(1, a)}\\tan^{-1}\\dfrac{x+${m}}{${k}}`, (x) => atan((x + m) / k) / a], [`${fr(1, ak)}\\tan^{-1}(x+${m})`, (x) => atan(x + m) / ak]],
      sol: R`<p>Factor out $${a}$: $${den}=${a}\left[(x+${m})^2+${k}^2\right]$. So the integral is $\dfrac1{${a}}\cdot\dfrac1{${k}}\tan^{-1}\dfrac{x+${m}}{${k}}=${fr(1, ak)}\tan^{-1}\dfrac{x+${m}}{${k}}$.</p>` };
  }),

  mgen('ii-g17', 4, 'integrals of square roots of quadratics', (rng) => ({ v: int(rng, 0, 2), a: int(rng, 2, 5) }), ({ v, a }) => {
    const a2 = a * a; const h = fr(a2, 2); const inn = [0.1 * a, 0.3 * a, 0.5 * a, 0.8 * a]; const big = [a + 0.5, a + 1.2, a + 2, a + 3.1];
    if (v === 0) return { tex: `\\sqrt{${a2}-x^2}`, f: (x) => sqrt(a2 - x * x), good: [`\\dfrac x2\\sqrt{${a2}-x^2}+${h}\\sin^{-1}\\dfrac x${a}`, (x) => x * sqrt(a2 - x * x) / 2 + a2 / 2 * asin(x / a)], wrongs: [[`\\dfrac x2\\sqrt{${a2}-x^2}+${fr(a, 2)}\\sin^{-1}\\dfrac x${a}`, (x) => x * sqrt(a2 - x * x) / 2 + a / 2 * asin(x / a)], [`\\dfrac x2\\sqrt{${a2}-x^2}-${h}\\sin^{-1}\\dfrac x${a}`, (x) => x * sqrt(a2 - x * x) / 2 - a2 / 2 * asin(x / a)], [`\\dfrac x2\\sqrt{${a2}-x^2}+\\dfrac12\\sin^{-1}\\dfrac x${a}`, (x) => x * sqrt(a2 - x * x) / 2 + asin(x / a) / 2]], sol: R`<p>$\int\sqrt{a^2-x^2}dx=\dfrac x2\sqrt{a^2-x^2}+\dfrac{a^2}2\sin^{-1}\dfrac xa$ with $a=${a}$: the coefficient is $${h}$.</p>`, pts: inn };
    if (v === 1) return { tex: `\\sqrt{x^2+${a2}}`, f: (x) => sqrt(x * x + a2), good: [`\\dfrac x2\\sqrt{x^2+${a2}}+${h}\\ln\\left(x+\\sqrt{x^2+${a2}}\\right)`, (x) => x * sqrt(x * x + a2) / 2 + a2 / 2 * ln(x + sqrt(x * x + a2))], wrongs: [[`\\dfrac x2\\sqrt{x^2+${a2}}-${h}\\ln\\left(x+\\sqrt{x^2+${a2}}\\right)`, (x) => x * sqrt(x * x + a2) / 2 - a2 / 2 * ln(x + sqrt(x * x + a2))], [`\\dfrac x2\\sqrt{x^2+${a2}}+${fr(a, 2)}\\ln\\left(x+\\sqrt{x^2+${a2}}\\right)`, (x) => x * sqrt(x * x + a2) / 2 + a / 2 * ln(x + sqrt(x * x + a2))], [`\\dfrac x2\\sqrt{x^2+${a2}}+\\dfrac12\\ln\\left(x+\\sqrt{x^2+${a2}}\\right)`, (x) => x * sqrt(x * x + a2) / 2 + ln(x + sqrt(x * x + a2)) / 2]], sol: R`<p>$\int\sqrt{x^2+a^2}dx=\dfrac x2\sqrt{x^2+a^2}+\dfrac{a^2}2\ln\left(x+\sqrt{x^2+a^2}\right)$ with $a^2=${a2}$.</p>` };
    return { tex: `\\sqrt{x^2-${a2}}`, f: (x) => sqrt(x * x - a2), good: [`\\dfrac x2\\sqrt{x^2-${a2}}-${h}\\ln\\left(x+\\sqrt{x^2-${a2}}\\right)`, (x) => x * sqrt(x * x - a2) / 2 - a2 / 2 * ln(x + sqrt(x * x - a2))], wrongs: [[`\\dfrac x2\\sqrt{x^2-${a2}}+${h}\\ln\\left(x+\\sqrt{x^2-${a2}}\\right)`, (x) => x * sqrt(x * x - a2) / 2 + a2 / 2 * ln(x + sqrt(x * x - a2))], [`\\dfrac x2\\sqrt{x^2-${a2}}-${fr(a, 2)}\\ln\\left(x+\\sqrt{x^2-${a2}}\\right)`, (x) => x * sqrt(x * x - a2) / 2 - a / 2 * ln(x + sqrt(x * x - a2))], [`\\dfrac{(x^2-${a2})^{3/2}}3`, (x) => (x * x - a2) ** 1.5 / 3]], sol: R`<p>$\int\sqrt{x^2-a^2}dx=\dfrac x2\sqrt{x^2-a^2}-\dfrac{a^2}2\ln\left|x+\sqrt{x^2-a^2}\right|$ with $a^2=${a2}$ (for $x>a$).</p>`, pts: big, span: [a + 0.5, a + 2] };
  }),

  mgen('ii-g20', 4, 'a sin x + b cos x over c sin x + d cos x', (rng) => { let a, b, d, A, B; do { a = int(rng, 1, 7); b = int(rng, -5, 7); d = choose(rng, [1, -1]); A = d === 1 ? (a + b) / 2 : (a - b) / 2; B = d === 1 ? (b - a) / 2 : (a + b) / 2; } while ((a + b) % 2 !== 0 || A === 0 || B === 0 || A === B || A === -B || a === b); return { d, a, b }; }, ({ d, a, b }) => {
    const A = d === 1 ? (a + b) / 2 : (a - b) / 2, B = d === 1 ? (b - a) / 2 : (a + b) / 2; const den = d === 1 ? '\\sin x+\\cos x' : '\\sin x-\\cos x'; const dn = (x) => sin(x) + d * cos(x);
    const num = `${a === 1 ? '' : a}\\sin x${b < 0 ? `-${b === -1 ? '' : -b}` : `+${b === 1 ? '' : b}`}\\cos x`; const co = (v) => (v === 1 ? '' : v === -1 ? '-' : v);
    const ex = (A1, B1) => asum(`${co(A1)}x`, `${co(B1)}\\ln|${den}|`);
    const pts = d === 1 ? [0.1, 0.3, 0.5, 0.7, 1.2] : [1.0, 1.4, 1.8, 2.3, 2.8];
    return { tex: `\\dfrac{${num}}{${den}}`, f: (x) => (a * sin(x) + b * cos(x)) / dn(x), good: [ex(A, B), (x) => A * x + B * ln(abs(dn(x)))], span: d === 1 ? [0.1, 1.2] : [1.0, 2.8], wrongs: [[ex(B, A), (x) => B * x + A * ln(abs(dn(x)))], [ex(A, -B), (x) => A * x - B * ln(abs(dn(x)))], [ex(a, b), (x) => a * x + b * ln(abs(dn(x)))]], pts,
      sol: R`<p>Write $${num}=A(${den})+B\,\dfrac d{dx}(${den})$, where $\dfrac d{dx}(${den})=${d === 1 ? '\\cos x-\\sin x' : '\\cos x+\\sin x'}$. Comparing coefficients: $A=${A}$, $B=${B}$. The integral is $A\,x+B\ln|${den}|=${ex(A, B)}+C$.</p>` };
  }),

  // ---------- nat templates ----------
  gen('ii-g07', 3, 'nat', 'numeric', 'by parts with a starting value', (rng) => {
    const k = int(rng, 0, 3);
    if (k === 0) { const kk = int(rng, 1, 3); const ans = r4b(exp(kk) * (1 / kk - 1 / (kk * kk)) + 1 / (kk * kk)); return { k, kk, answer: ans, tol: 0.01, q: R`$F'(x)=xe^{${kk === 1 ? '' : kk}x}$ and $F(0)=0$. Find $F(1)$ (2 decimal places).`, sol: R`<p>$F(x)=e^{${kk}x}\left(\dfrac x${kk}-\dfrac1{${kk * kk}}\right)+C$. $F(0)=-\dfrac1{${kk * kk}}+C=0$, so $C=\dfrac1{${kk * kk}}$. $F(1)=e^{${kk}}\left(\dfrac1${kk}-\dfrac1{${kk * kk}}\right)+\dfrac1{${kk * kk}}\approx${ans}$.</p>` }; }
    if (k === 1) { const [ct, cv] = choose(rng, [['\\pi/2', PI_ / 2], ['\\pi/3', PI_ / 3], ['\\pi/4', PI_ / 4], ['\\pi', PI_], ['2\\pi/3', 2 * PI_ / 3]]); const ans = r4b(cv * sin(cv) + cos(cv) - 1); return { k, ct, cv, answer: ans, tol: 0.01, q: R`$F'(x)=x\cos x$ and $F(0)=0$. Find $F\left(${ct}\right)$ (2 decimal places).`, sol: R`<p>$F(x)=x\sin x+\cos x+C$, $F(0)=1+C=0$, $C=-1$. $F(${ct})=${ct}\sin(${ct})+\cos(${ct})-1\approx${ans}$.</p>` }; }
    if (k === 2) { const b = choose(rng, [2, 3, 4, 5, 10]); const ans = r4b(b * ln(b) - b + 1); return { k, b, answer: ans, tol: 0.01, q: R`$F'(x)=\ln x$ and $F(1)=0$. Find $F(${b})$ (2 decimal places).`, sol: R`<p>$F(x)=x\ln x-x+C$, $F(1)=-1+C=0$, $C=1$. $F(${b})=${b}\ln${b}-${b}+1\approx${ans}$.</p>` }; }
    const b = choose(rng, [1, 2, 3]); const ans = r4b(b * atan(b) - ln(1 + b * b) / 2); return { k, b, answer: ans, tol: 0.01, q: R`$F'(x)=\tan^{-1}x$ and $F(0)=0$. Find $F(${b})$ (2 decimal places).`, sol: R`<p>$F(x)=x\tan^{-1}x-\dfrac12\ln(1+x^2)+C$, with $C=0$. $F(${b})=${b}\tan^{-1}${b}-\dfrac12\ln${1 + b * b}\approx${ans}$.</p>` };
  }, (p) => { const fs = [(x) => x * exp(p.kk * x), (x) => x * cos(x), ln, atan]; const up = [1, p.cv, p.b, p.b][p.k]; const lo = [0, 0, 1, 0][p.k]; return simp(fs[p.k], lo, up, 8000); }),

  gen('ii-g08', 3, 'nat', 'integer', 'partial fraction coefficients', (rng) => {
    let a, b, A, B; do { a = int(rng, 1, 5); b = int(rng, 1, 6); A = nonzero(rng, -5, 6); B = nonzero(rng, -5, 6); } while (a === b);
    const p = A + B, q = A * b + B * a, k = int(rng, 0, 2);
    const ans = [A * B, A - B, A + 2 * B][k]; const what = ['$AB$', '$A-B$', '$A+2B$'][k];
    return { a, b, A, B, pn: p, qn: q, k, answer: ans, tol: 0, q: R`If $\dfrac{${poly([p, 1], [q, 0])}}{(x+${a})(x+${b})}=\dfrac A{x+${a}}+\dfrac B{x+${b}}$, find ${what}.`,
      sol: R`<p>$${poly([p, 1], [q, 0])}=A(x+${b})+B(x+${a})$. $x=-${a}$: $A=\dfrac{${-a * p + q}}{${b - a}}=${A}$. $x=-${b}$: $B=\dfrac{${-b * p + q}}{${a - b}}=${B}$. ${what[0] === '$' ? what : what}$=${ans}$.</p>`.replace('$=$', '$ is $') };
  }, (p) => { const f = (x) => (p.pn * x + p.qn) / ((x + p.a) * (x + p.b)); const e = 1e-7; const A = Math.round(f(-p.a + e) * e), B = Math.round(f(-p.b + e) * e); return [A * B, A - B, A + 2 * B][p.k]; }),

  gen('ii-g09', 3, 'nat', 'integer', 'constants in standard results', (rng) => {
    const k = int(rng, 0, 1), m = int(rng, 1, 4), kk = int(rng, 1, 4);
    if (k === 0) { const c = m * m + kk * kk; return { k, m, kk, answer: m + kk, tol: 0, q: R`If $\displaystyle\int\frac{dx}{${poly([1, 2], [2 * m, 1], [c, 0])}}=\frac1a\tan^{-1}\left(\frac{x+b}a\right)+C$, find $a+b$.`, sol: R`<p>$${poly([1, 2], [2 * m, 1], [c, 0])}=(x+${m})^2+${kk}^2$ (since $${c}-${m * m}=${kk * kk}$). So $a=${kk}$, $b=${m}$ and $a+b=${m + kk}$.</p>` }; }
    const n = int(rng, 1, 6); return { k, m, kk, n, answer: (n + 1) * 2, tol: 0, q: R`If $\displaystyle\int x(x^2+1)^{${n}}\,dx=\frac{(x^2+1)^{${n + 1}}}{p}+C$, find $p$.`, sol: R`<p>$u=x^2+1$, $x\,dx=\dfrac{du}2$: $\dfrac12\cdot\dfrac{u^{${n + 1}}}{${n + 1}}=\dfrac{u^{${n + 1}}}{${2 * (n + 1)}}$. So $p=${2 * (n + 1)}$.</p>` };
  }, (p) => { if (p.k === 0) { const c = p.m * p.m + p.kk * p.kk; const ok = matches((x) => atan((x + p.m) / p.kk) / p.kk, (x) => 1 / (x * x + 2 * p.m * x + c), DPTS); return ok ? p.m + p.kk : NaN; } const pp = p.answer; return matches((x) => (x * x + 1) ** (p.n + 1) / pp, (x) => x * (x * x + 1) ** p.n, [0.3, 0.6, 0.9]) ? pp : NaN; }),

  gen('ii-g10', 3, 'nat', 'numeric', 'values of antiderivatives', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const kk = choose(rng, [2, 4, 5]); const ans = r4b(1 / kk - 1 / (kk * kk)); return { k, kk, answer: ans, tol: 0.0006, q: R`$\displaystyle\int xe^{${kk}x}\,dx=e^{${kk}x}(px+q)+C$. Find $p+q$ (4 decimal places).`, sol: R`<p>$\int xe^{${kk}x}dx=e^{${kk}x}\left(\dfrac x${kk}-\dfrac1{${kk * kk}}\right)$. $p=\dfrac1${kk}$, $q=-\dfrac1{${kk * kk}}$. $p+q=${ans}$.</p>` }; }
    if (k === 1) { const c = choose(rng, [1, 2]); const ans = r4b(exp(c) * (c * c - 2 * c + 2)); return { k, c, answer: ans, tol: 0.01, q: R`If $G(x)=\displaystyle\int x^2e^x\,dx$ with constant of integration $0$ (that is, $G(x)=e^x(x^2-2x+2)$), find $G(${c})$ (2 decimal places).`, sol: R`<p>$G(${c})=e^{${c}}(${c * c}-${2 * c}+2)=${c * c - 2 * c + 2}e^{${c}}\approx${ans}$.</p>` }; }
    const kk = int(rng, 2, 3); const ans = r4b(PI_ / (kk * kk)); return { k, kk, answer: ans, tol: 0.001, q: R`$H(x)=\displaystyle\int x\sin ${kk}x\,dx$ with constant $0$. Find $H\left(\dfrac\pi${kk}\right)$ (3 decimal places).`, sol: R`<p>$H(x)=-\dfrac{x\cos${kk}x}{${kk}}+\dfrac{\sin${kk}x}{${kk * kk}}$. At $x=\dfrac\pi${kk}$: $\cos\pi=-1$, $\sin\pi=0$, so $H=\dfrac{\pi}{${kk * kk}}\approx${ans}$.</p>` };
  }, (p) => { if (p.k === 0) { const pp = 1 / p.kk, qq = -1 / (p.kk * p.kk); const ok = matches((x) => exp(p.kk * x) * (pp * x + qq), (x) => x * exp(p.kk * x), DPTS); return ok ? pp + qq : NaN; } if (p.k === 1) { const G = (x) => exp(x) * (x * x - 2 * x + 2); return matches(G, (x) => x * x * exp(x), DPTS) ? G(p.c) : NaN; } const H = (x) => -x * cos(p.kk * x) / p.kk + sin(p.kk * x) / (p.kk * p.kk); return matches(H, (x) => x * sin(p.kk * x), DPTS) ? H(PI_ / p.kk) : NaN; }),

  gen('ii-g18', 4, 'nat', 'integer', 'constants after substitution', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const m = int(rng, 2, 6); return { k, m, answer: m + 1, tol: 0, q: R`$\displaystyle\int\frac{x^{${m}}}{x^{${m + 1}}+1}\,dx=\frac1p\ln\left(x^{${m + 1}}+1\right)+C$. Find $p$.`, sol: R`<p>$u=x^{${m + 1}}+1$, $du=${m + 1}x^{${m}}dx$. $\dfrac1{${m + 1}}\int\dfrac{du}u$, so $p=${m + 1}$.</p>` }; }
    if (k === 1) { const m = int(rng, 2, 5); return { k, m, answer: m + 1, tol: 0, q: R`$\displaystyle\int x^{${m}}e^{x^{${m + 1}}}\,dx=\frac{e^{x^{${m + 1}}}}p+C$. Find $p$.`, sol: R`<p>$u=x^{${m + 1}}$, $du=${m + 1}x^{${m}}dx$. $\dfrac1{${m + 1}}\int e^udu$, so $p=${m + 1}$.</p>` }; }
    const c = int(rng, 2, 5); return { k, c, answer: 2 * c, tol: 0, q: R`$\displaystyle\int\frac{dx}{\sqrt{${c * c}-x^2}}=\sin^{-1}\left(\frac xr\right)+C$. Find $2r$.`, sol: R`<p>$\int\dfrac{dx}{\sqrt{a^2-x^2}}=\sin^{-1}\dfrac xa$ with $a^2=${c * c}$, so $r=${c}$ and $2r=${2 * c}$.</p>` };
  }, (p) => { if (p.k === 0) { const pp = p.m + 1; return matches((x) => ln(x ** (p.m + 1) + 1) / pp, (x) => x ** p.m / (x ** (p.m + 1) + 1), [0.4, 0.8, 1.3]) ? pp : NaN; } if (p.k === 1) { const pp = p.m + 1; return matches((x) => exp(x ** (p.m + 1)) / pp, (x) => x ** p.m * exp(x ** (p.m + 1)), [0.3, 0.6, 0.9]) ? pp : NaN; } return matches((x) => asin(x / p.c), (x) => 1 / sqrt(p.c * p.c - x * x), [0.1 * p.c, 0.4 * p.c, 0.7 * p.c]) ? 2 * p.c : NaN; }),

  gen('ii-g19', 4, 'nat', 'numeric', 'f from f\' with a condition', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = int(rng, 1, 4), b = int(rng, 1, 4), c = int(rng, -3, 5); const ans = r4b(a * (E_ - 1) + b + c); return { k, a, b, c, answer: ans, tol: 0.01, q: R`$f'(x)=${a === 1 ? '' : a}e^x+${2 * b}x$ and $f(0)=${c}$. Find $f(1)$ (2 decimal places).`, sol: R`<p>$f(x)=${a === 1 ? '' : a}e^x+${b}x^2+C$; $f(0)=${a}+C=${c}$ gives $C=${c - a}$. $f(1)=${a}e+${b}+${c - a}\approx${ans}$.</p>` }; }
    if (k === 1) { const a = int(rng, 1, 5), b = int(rng, -4, 5), c = int(rng, -3, 6); return { k, a, b, c, answer: a + b + c, tol: 0.01, q: R`$f'(x)=${a === 1 ? '' : a}\sin x${b < 0 ? `-${-b === 1 ? '' : -b}` : `+${b === 1 ? '' : b}`}\cos x$ and $f(0)=${c}$. Find $f\left(\dfrac\pi2\right)$.`, sol: R`<p>$f(x)=-${a === 1 ? '' : a}\cos x${sgn(b)}\sin x+C$. $f(0)=-${a}+C=${c}$, so $C=${c + a}$. $f\left(\dfrac\pi2\right)=0${sgn(b)}+${c + a}=${a + b + c}$.</p>` }; }
    const c = int(rng, -3, 6); const ans = r4b(E_ * E_ + c); return { k, c, answer: ans, tol: 0.01, q: R`$f'(x)=\dfrac1x+2x$ for $x>0$ and $f(1)=${c}$. Find $f(e)$ (2 decimal places).`, sol: R`<p>$f(x)=\ln x+x^2+C$. $f(1)=1+C=${c}$, so $C=${c - 1}$. $f(e)=1+e^2+${c - 1}=e^2+${c}\approx${ans}$.</p>` };
  }, (p) => { if (p.k === 0) return p.c + simp((x) => p.a * exp(x) + 2 * p.b * x, 0, 1, 4000); if (p.k === 1) return p.c + simp((x) => p.a * sin(x) + p.b * cos(x), 0, PI_ / 2, 4000); return p.c + simp((x) => 1 / x + 2 * x, 1, E_, 4000); }),

  gen('ii-g23', 3, 'nat', 'numeric', 'curves from slopes', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = int(rng, 1, 4), b = int(rng, 1, 5), x0 = int(rng, 1, 2), y0 = int(rng, -3, 6), x1 = x0 + int(rng, 1, 2); const ans = a * (x1 ** 3 - x0 ** 3) / 3 * 3 / 3 + 0; const Fv = (x) => a * x ** 3 - b * x * x; const val = y0 + Fv(x1) - Fv(x0); return { k, a, b, x0, y0, x1, answer: val, tol: 0.01, q: R`A curve passes through $(${x0},${y0})$ and has slope $${3 * a}x^2-${2 * b}x$ at every point. Find its $y$ at $x=${x1}$.`, sol: R`<p>$y=${a === 1 ? '' : a}x^3-${b}x^2+C$. At $(${x0},${y0})$: $C=${y0}-${Fv(x0)}=${y0 - Fv(x0)}$. At $x=${x1}$: $y=${Fv(x1)}${sgn(y0 - Fv(x0))}=${val}$.</p>` }; }
    if (k === 1) { const c = int(rng, -2, 4), m = int(rng, 1, 4); const ans = r4b(c + m * PI_ / 4); return { k, c, m, answer: ans, tol: 0.01, q: R`A curve passes through $(0,${c})$ and has slope $\dfrac{${m === 1 ? '' : m}}{1+x^2}$ at every point. Find $y$ at $x=1$ (2 decimal places).`, sol: R`<p>$y=${m === 1 ? '' : m}\tan^{-1}x+C$ with $C=${c}$. At $x=1$: $y=${m}\cdot\dfrac\pi4+${c}\approx${ans}$.</p>` }; }
    const y0 = int(rng, 0, 4); const ans = r4b(E_ + y0 - 1 + 0); return { k, y0, answer: ans, tol: 0.01, q: R`A curve passes through $(0,${y0})$ and has slope $(1+x)e^x$ at every point. Find $y$ at $x=1$ (2 decimal places).`, sol: R`<p>$(1+x)e^x=e^x(f+f')$ with $f=x$, so $y=xe^x+C$. $y(0)=C=${y0}$. $y(1)=e+${y0}\approx${r4b(E_ + y0)}$.</p>` , answer: r4b(E_ + y0) };
  }, (p) => { if (p.k === 0) return p.y0 + simp((x) => 3 * p.a * x * x - 2 * p.b * x, p.x0, p.x1, 400); if (p.k === 1) return p.c + simp((x) => p.m / (1 + x * x), 0, 1, 4000); return p.y0 + simp((x) => (1 + x) * exp(x), 0, 1, 4000); }),

  gen('ii-g24', 2, 'nat', 'integer', 'motion from velocity', (rng) => {
    const a = 3 * int(rng, 1, 3), b = 2 * int(rng, -3, 4), c = int(rng, -3, 5), s0 = int(rng, -2, 6), T = choose(rng, [2, 3, 4, 6]);
    const ans = (a * T ** 3) / 3 + (b * T * T) / 2 + c * T + s0;
    return { a, b, c, s0, T, answer: ans, tol: 0, q: R`A particle moves on a line with velocity $v(t)=${poly([a, 2], [b, 1], [c, 0])}$ m/s and starts at position $s=${s0}$ m. Its position at $t=${T}$ s is (m)`, sol: R`<p>$s(t)=\int v\,dt=${poly([a / 3, 3], [b / 2, 2], [c, 1], [s0, 0])}$ (the constant is the starting position). $s(${T})=${ans}$.</p>` };
  }, (p) => Math.round(p.s0 + simp((t) => p.a * t * t + p.b * t + p.c, 0, p.T, 600))),

  gen('ii-g25', 3, 'nat', 'numeric', 'constant from a trigonometric condition', (rng) => {
    const k = int(rng, 1, 4), m = k * int(rng, 1, 4), v = int(rng, -4, 6);
    const ans = v - m / k;
    return { k, m, v, answer: ans, tol: 0.01, q: R`$F'(x)=${m}\cos ${k === 1 ? '' : k}x$ and $F\left(\dfrac\pi${2 * k}\right)=${v}$. Find $F(0)$.`, sol: R`<p>$F(x)=\dfrac{${m}}{${k}}\sin ${k === 1 ? '' : k}x+C$. At $x=\dfrac\pi${2 * k}$: $\sin\dfrac\pi2=1$, so $${m / k}+C=${v}$ and $C=${v - m / k}$. $F(0)=C=${ans}$.</p>` };
  }, (p) => p.v - simp((x) => p.m * cos(p.k * x), 0, PI_ / (2 * p.k), 2000)),
];

export default { topic: 'indefinite-integrals', groups, items, gens };
