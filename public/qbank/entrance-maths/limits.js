// Limits (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
// Every fixed limit/derivative item below is checked numerically when the file loads (the helper throws on a mismatch),
// and every template has a verify() that recomputes its answer numerically from the fields it returns.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const CUET = false;
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
const gx = (level, type) => [...EXS[level], ...(CUET && type === 'mcq' && level <= 3 ? ['cuet'] : [])];
const base = (level, sub, extra) => ({ level, exams: gx(level, extra.type), sub, ...extra });
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

const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, tan = Math.tan, exp = Math.exp, ln = Math.log, atan = Math.atan, asin = Math.asin, acos = Math.acos, abs = Math.abs, fl = Math.floor, PI_ = Math.PI, E_ = Math.E;
const r4 = (x) => +x.toFixed(4);
const TWOD = ' (2 decimal places)';
const sgn = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const W = (s) => `$${s}$`;
/** coefficient text: 1 -> '', -1 -> '-' */
const co = (c) => (c === 1 ? '' : c === -1 ? '-' : String(c));
/** a polynomial a x^2 + b x + c as TeX */
const quad = (a, b, c) => `${co(a)}x^2${b === 0 ? '' : b < 0 ? `-${b === -1 ? '' : -b}x` : `+${b === 1 ? '' : b}x`}${c === 0 ? '' : c < 0 ? `-${-c}` : `+${c}`}`;
const lin = (m, c) => `${co(m)}x${c === 0 ? '' : c < 0 ? `-${-c}` : `+${c}`}`;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** fraction as TeX */
const frac = (p, q) => { const d = gcd(p, q); p /= d; q /= d; if (q < 0) { p = -p; q = -q; } return q === 1 ? `${p}` : p < 0 ? `-\\dfrac{${-p}}{${q}}` : `\\dfrac{${p}}{${q}}`; };

// ---------- numeric checking ----------
const H = 2e-3;
const R1 = (f, a, s) => 2 * f(a + (s * H) / 2) - f(a + s * H);
const limv = (f, a, side = 0) => {
  if (a === Infinity) return f(1e5);
  if (a === -Infinity) return f(-1e5);
  if (side) return R1(f, a, side);
  const l = R1(f, a, -1), r = R1(f, a, 1);
  return Math.abs(l - r) <= 5e-3 * Math.max(1, Math.abs(l)) ? (l + r) / 2 : NaN;
};
/** throws if limit of f at a (side -1, 0, +1) is not val ('dne', Infinity, -Infinity or a number) */
const chk = (q, f, a, val, side = 0) => {
  let ok;
  if (val === 'dne') { const v = limv(f, a, side); ok = Number.isNaN(v) || !Number.isFinite(v); }
  else if (val === Infinity || val === -Infinity) { const x = a === Infinity ? 1e5 : a === -Infinity ? -1e5 : a + (side || 1) * 1e-4; ok = val * f(x) > 1e3; }
  else { const v = limv(f, a, side); ok = Math.abs(v - val) <= (val === 0 && (a === Infinity || a === -Infinity) ? 0.05 : 4e-3 * Math.max(1, Math.abs(val))); if (!ok) throw new Error(`limit check failed: ${q.slice(0, 90)} got ${v}, wanted ${val}`); }
  if (!ok) throw new Error(`limit check failed: ${q.slice(0, 90)} (${val})`);
};
const LQ = (a, e, pre = 'Evaluate') => R`${pre} $\displaystyle\lim_{x\to ${a}}${e}$.`;
const LM = (level, sub, q, f, a, val, correct, wrongs, sol, trap, side = 0, more = {}) => {
  chk(q, f, a, val, side);
  return M(level, sub, q, W(correct), wrongs.map(W), sol, trap, more);
};
/** options given as plain text / HTML */
const LT = (level, sub, q, f, a, val, correct, wrongs, sol, trap, side = 0, more = {}) => {
  chk(q, f, a, val, side);
  return M(level, sub, q, correct, wrongs, sol, trap, more);
};
const LI = (level, sub, q, f, a, val, sol, trap, side = 0, more = {}) => { chk(q, f, a, val, side); return I(level, sub, q, val, sol, trap, more); };
const LN = (level, sub, q, f, a, val, sol, trap, side = 0, more = {}) => { chk(q, f, a, val, side); return N(level, sub, `${q}${TWOD}`, r4(val), 0.01, sol, trap, more); };
/** numeric limit used by template verify() */
const NL = (f, a, side = 0) => limv(f, a, side);
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: gx(level, type), sub, make, ...(verify ? { verify } : {}) });
/** constant-finding item: the limit with the solved constants is checked, the answer is the asked combination */
const LC = (level, sub, q, f, a, val, ans, sol, trap, side = 0, more = {}) => { chk(q, f, a, val, side); return I(level, sub, q, ans, sol, trap, more); };
const DNE = 'does not exist';
const inf = R`\infty`;
const e = R`e`;

const items = [
  // ================= L1 warm-up =================
  LI(1, 'direct substitution', LQ(2, R`(x^2+3x)`), (x) => x * x + 3 * x, 2, 10, R`<p>The function is a polynomial, so just put $x=2$: $4+6=10$.</p>`, 'Polynomials are continuous: substitute.'),
  LI(1, 'factorising', LQ(3, R`\dfrac{x^2-9}{x-3}`), (x) => (x * x - 9) / (x - 3), 3, 6, R`<p>Direct substitution gives $\frac00$. Factorise: $\dfrac{(x-3)(x+3)}{x-3}=x+3$ for $x\ne3$. Limit $=3+3=6$.</p>`, 'Cancel the common factor before substituting.'),
  LM(1, 'standard limits', LQ(0, R`\dfrac{\sin3x}{x}`), (x) => sin(3 * x) / x, 0, 3, '3', ['1', R`\frac13`, '0'],
    R`<p>$\dfrac{\sin3x}{x}=3\cdot\dfrac{\sin3x}{3x}\to3\cdot1=3$.</p>`, 'Make the angle and the denominator match, then use $\\frac{\\sin t}{t}\\to1$.'),
  LM(1, 'standard limits', LQ(0, R`\dfrac{\tan x}{x}`), (x) => tan(x) / x, 0, 1, '1', ['0', inf, '-1'],
    R`<p>$\dfrac{\tan x}{x}=\dfrac{\sin x}{x}\cdot\dfrac1{\cos x}\to1\cdot1=1$.</p>`, 'It is a $\\frac00$ form but not $0$.'),
  LI(1, 'limits at infinity', LQ(R`\infty`, R`\dfrac{3x+1}{x+5}`), (x) => (3 * x + 1) / (x + 5), Infinity, 3, R`<p>Divide top and bottom by $x$: $\dfrac{3+1/x}{1+5/x}\to\dfrac31=3$.</p>`, 'Same degree: ratio of leading coefficients.'),
  LM(1, 'standard limits', LQ(0, R`\dfrac{e^x-1}{x}`), (x) => (exp(x) - 1) / x, 0, 1, '1', ['0', e, inf],
    R`<p>This is the standard limit $\lim_{x\to0}\dfrac{e^x-1}{x}=1$.</p>`, 'The answer is 1, not $e$.'),
  LM(1, 'standard limits', LQ(0, R`\dfrac{2^x-1}{x}`), (x) => (2 ** x - 1) / x, 0, ln(2), R`\ln2`, ['2', '1', R`\dfrac1{\ln2}`],
    R`<p>$\lim_{x\to0}\dfrac{a^x-1}{x}=\ln a$. With $a=2$ the limit is $\ln2$.</p>`, 'The natural log of the base, not the base.'),
  LI(1, 'factorising', LQ(1, R`\dfrac{x^3-1}{x-1}`), (x) => (x ** 3 - 1) / (x - 1), 1, 3, R`<p>$\dfrac{x^3-1}{x-1}=x^2+x+1\to3$. Or use $\lim_{x\to a}\dfrac{x^n-a^n}{x-a}=na^{n-1}=3\cdot1^2=3$.</p>`, 'Do not stop at $\\frac00$.'),
  LM(1, 'limits at infinity', LQ(R`\infty`, R`\dfrac1{x^2}`), (x) => 1 / (x * x), Infinity, 0, '0', ['1', inf, '-1'],
    R`<p>As $x$ grows without bound, $x^2$ grows without bound, so $\frac1{x^2}\to0$.</p>`, 'A big denominator makes the fraction small.'),
  LM(1, 'standard limits', LQ(0, R`\dfrac{\sin5x}{\sin2x}`), (x) => sin(5 * x) / sin(2 * x), 0, 2.5, R`\dfrac52`, [R`\dfrac25`, '3', '1'],
    R`<p>$\dfrac{\sin5x}{\sin2x}=\dfrac{\sin5x}{5x}\cdot\dfrac{2x}{\sin2x}\cdot\dfrac52\to\dfrac52$.</p>`, 'Put the larger coefficient on top.'),
  LM(1, 'rationalising', LQ(4, R`\dfrac{\sqrt x-2}{x-4}`), (x) => (sqrt(x) - 2) / (x - 4), 4, 0.25, R`\dfrac14`, ['4', R`\dfrac12`, '0'],
    R`<p>$x-4=(\sqrt x-2)(\sqrt x+2)$, so the fraction is $\dfrac1{\sqrt x+2}\to\dfrac14$.</p>`, 'Write $x-4$ as a difference of squares in $\\sqrt x$.'),
  LM(1, 'standard limits', LQ(0, R`(1+x)^{1/x}`), (x) => (1 + x) ** (1 / x), 0, E_, e, ['1', '0', R`e^{-1}`],
    R`<p>This is the definition of $e$: $\lim_{x\to0}(1+x)^{1/x}=e$.</p>`, '$1^\\infty$ is not 1.'),
  LI(1, 'greatest integer', LQ(R`2^-`, R`[x]`), (x) => fl(x), 2, 1, R`<p>Just left of $2$, $x$ is like $1.99$, so $[x]=1$.</p>`, 'The left limit at an integer is one less than that integer.', -1),
  LI(1, 'greatest integer', LQ(R`2^+`, R`[x]`), (x) => fl(x), 2, 2, R`<p>Just right of $2$, $x$ is like $2.01$, so $[x]=2$.</p>`, 'The right limit equals the value of $[x]$ at the integer.', 1),
  LM(1, 'standard limits', LQ(0, R`\dfrac{1-\cos x}{x^2}`), (x) => (1 - cos(x)) / (x * x), 0, 0.5, R`\dfrac12`, ['1', '0', '2'],
    R`<p>$1-\cos x=2\sin^2\frac x2$, so the fraction is $\dfrac{2\sin^2(x/2)}{x^2}=\dfrac12\left(\dfrac{\sin(x/2)}{x/2}\right)^2\to\dfrac12$.</p>`, 'Remember the $\\frac12$.'),
  LM(1, 'squeeze', LQ(0, R`x\sin\dfrac1x`), (x) => x * sin(1 / x), 0, 0, '0', ['1', inf, '-1'],
    R`<p>$|x\sin\frac1x|\le|x|\to0$, so by squeezing the limit is $0$. The factor $\sin\frac1x$ keeps swinging but stays between $-1$ and $1$.</p>`, 'Do not say $\\sin\\frac1x\\to1$.'),
  LI(1, 'modulus', LQ(R`0^-`, R`\dfrac{|x|}{x}`), (x) => abs(x) / x, 0, -1, R`<p>For $x<0$, $|x|=-x$, so $\frac{|x|}x=-1$. The limit from the left is $-1$.</p>`, 'Modulus of a negative number flips its sign.', -1),
  LI(1, 'factorising', LQ(-1, R`\dfrac{x^2-1}{x+1}`), (x) => (x * x - 1) / (x + 1), -1, -2, R`<p>$\dfrac{(x-1)(x+1)}{x+1}=x-1\to-2$.</p>`, 'Substitute $-1$ into $x-1$, not $x+1$.'),
  LM(1, 'standard limits', LQ(0, R`\dfrac{\sin x}{2x}`), (x) => sin(x) / (2 * x), 0, 0.5, R`\dfrac12`, ['2', '1', '0'],
    R`<p>$\dfrac{\sin x}{2x}=\dfrac12\cdot\dfrac{\sin x}{x}\to\dfrac12$.</p>`, 'Constants come out of the limit.'),
  LI(1, 'direct substitution', LQ(5, R`(2x-1)`), (x) => 2 * x - 1, 5, 9, R`<p>Substitute: $2\cdot5-1=9$.</p>`, 'Check first whether direct substitution works.'),
  LI(1, 'standard limits', LQ(0, R`\dfrac{\sin x+x}{x}`), (x) => (sin(x) + x) / x, 0, 2, R`<p>$\dfrac{\sin x}{x}+1\to1+1=2$.</p>`, 'Split the fraction.'),
  LM(1, 'direct substitution', LQ(1, R`\dfrac{x^2+1}{x+1}`), (x) => (x * x + 1) / (x + 1), 1, 1, '1', ['0', '2', R`\dfrac12`],
    R`<p>The denominator is $2\ne0$, so substitute: $\dfrac{1+1}{1+1}=1$.</p>`, 'No $\\frac00$ here.'),

  // ================= L2 =================
  LM(2, 'standard limits', LQ(0, R`\dfrac{\sin7x}{\tan3x}`), (x) => sin(7 * x) / tan(3 * x), 0, 7 / 3, R`\dfrac73`, [R`\dfrac37`, '21', '1'],
    R`<p>$\dfrac{\sin7x}{\tan3x}=\dfrac{\sin7x}{7x}\cdot\dfrac{3x}{\tan3x}\cdot\dfrac73\to\dfrac73$.</p>`, 'Top coefficient over bottom coefficient.'),
  LM(2, 'factorising', LQ(2, R`\dfrac{x^2-5x+6}{x^2-4}`), (x) => (x * x - 5 * x + 6) / (x * x - 4), 2, -0.25, R`-\dfrac14`, [R`\dfrac14`, R`-\dfrac12`, '0'],
    R`<p>$\dfrac{(x-2)(x-3)}{(x-2)(x+2)}=\dfrac{x-3}{x+2}\to\dfrac{-1}{4}$.</p>`, 'Sign slip: $2-3=-1$.'),
  LM(2, 'rationalising', LQ(0, R`\dfrac{\sqrt{x+9}-3}{x}`), (x) => (sqrt(x + 9) - 3) / x, 0, 1 / 6, R`\dfrac16`, [R`\dfrac13`, '6', R`\dfrac19`],
    R`<p>Multiply by the conjugate: $\dfrac{(x+9)-9}{x(\sqrt{x+9}+3)}=\dfrac1{\sqrt{x+9}+3}\to\dfrac1{6}$.</p>`, 'The denominator becomes $3+3$.'),
  LI(2, 'standard limits', LQ(2, R`\dfrac{x^5-32}{x-2}`), (x) => (x ** 5 - 32) / (x - 2), 2, 80, R`<p>$\lim_{x\to a}\dfrac{x^n-a^n}{x-a}=na^{n-1}$. Here $n=5$, $a=2$: $5\cdot2^4=80$.</p>`, 'Remember $a^{n-1}$, not $a^n$.'),
  LM(2, 'standard limits', LQ(1, R`\dfrac{x^7-1}{x^3-1}`), (x) => (x ** 7 - 1) / (x ** 3 - 1), 1, 7 / 3, R`\dfrac73`, [R`\dfrac37`, '7', '21'],
    R`<p>Divide top and bottom by $x-1$: the top tends to $7$, the bottom to $3$. So the limit is $\dfrac73$.</p>`, 'Top exponent over bottom exponent.'),
  LM(2, 'standard limits', LQ(0, R`\dfrac{e^{2x}-1}{\sin3x}`), (x) => (exp(2 * x) - 1) / sin(3 * x), 0, 2 / 3, R`\dfrac23`, [R`\dfrac32`, '6', '1'],
    R`<p>$\dfrac{e^{2x}-1}{2x}\cdot\dfrac{3x}{\sin3x}\cdot\dfrac23\to\dfrac23$.</p>`, 'Match each factor to its own standard limit.'),
  LI(2, 'standard limits', LQ(0, R`\dfrac{1-\cos4x}{x^2}`), (x) => (1 - cos(4 * x)) / (x * x), 0, 8, R`<p>$\dfrac{1-\cos kx}{x^2}\to\dfrac{k^2}2$. With $k=4$: $\dfrac{16}2=8$.</p>`, 'The coefficient is squared: $\\frac{k^2}{2}$, not $\\frac k2$.'),
  LM(2, 'standard limits', LQ(0, R`\dfrac{3^x-1}{2^x-1}`), (x) => (3 ** x - 1) / (2 ** x - 1), 0, ln(3) / ln(2), R`\log_23`, [R`\dfrac32`, R`\log_32`, R`\ln\dfrac32`],
    R`<p>Divide top and bottom by $x$: $\dfrac{(3^x-1)/x}{(2^x-1)/x}\to\dfrac{\ln3}{\ln2}=\log_23$.</p>`, 'A ratio of logs, not a log of a ratio.'),
  LM(2, 'limits at infinity', LQ(R`\infty`, R`\dfrac{2x^2+3x}{5x^2-1}`), (x) => (2 * x * x + 3 * x) / (5 * x * x - 1), Infinity, 0.4, R`\dfrac25`, [R`\dfrac35`, '0', '2'],
    R`<p>Divide by $x^2$: $\dfrac{2+3/x}{5-1/x^2}\to\dfrac25$.</p>`, 'Only the highest powers matter.'),
  LM(2, 'limits at infinity', LQ(R`\infty`, R`\left(\sqrt{x^2+x}-x\right)`), (x) => sqrt(x * x + x) - x, Infinity, 0.5, R`\dfrac12`, ['0', '1', inf],
    R`<p>Multiply by the conjugate: $\dfrac{x}{\sqrt{x^2+x}+x}=\dfrac1{\sqrt{1+1/x}+1}\to\dfrac12$.</p>`, '$\\infty-\\infty$ is not $0$.'),
  LI(2, 'limits at infinity', LQ(R`\infty`, R`\left(\sqrt{x^2+3x}-\sqrt{x^2-x}\right)`), (x) => sqrt(x * x + 3 * x) - sqrt(x * x - x), Infinity, 2, R`<p>Conjugate: $\dfrac{4x}{\sqrt{x^2+3x}+\sqrt{x^2-x}}=\dfrac4{\sqrt{1+3/x}+\sqrt{1-1/x}}\to\dfrac42=2$. Shortcut: $\frac{3-(-1)}2=2$.</p>`, 'Half the difference of the $x$-coefficients.'),
  LM(2, '$1^\\infty$ form', LQ(0, R`(1+2x)^{1/x}`), (x) => (1 + 2 * x) ** (1 / x), 0, E_ ** 2, R`e^2`, [R`e^{1/2}`, R`2e`, e],
    R`<p>$(1+2x)^{1/x}=\left[(1+2x)^{1/(2x)}\right]^2\to e^2$.</p>`, 'The 2 goes into the exponent of $e$.'),
  LM(2, '$1^\\infty$ form', LQ(R`\infty`, R`\left(1+\dfrac3x\right)^x`), (x) => (1 + 3 / x) ** x, Infinity, E_ ** 3, R`e^3`, [R`e^{1/3}`, R`3e`, '1'],
    R`<p>$\lim_{x\to\infty}\left(1+\frac ax\right)^x=e^a$. With $a=3$ the answer is $e^3$.</p>`, 'Not $3e$.'),
  LM(2, '$1^\\infty$ form', LQ(R`\infty`, R`\left(1-\dfrac1x\right)^x`), (x) => (1 - 1 / x) ** x, Infinity, 1 / E_, R`\dfrac1e`, [e, '1', '0'],
    R`<p>Here $a=-1$, so the limit is $e^{-1}=\dfrac1e$.</p>`, 'A minus sign gives $e^{-1}$.'),
  LM(2, 'standard limits', LQ(0, R`x\cot x`), (x) => x / tan(x), 0, 1, '1', ['0', inf, '-1'],
    R`<p>$x\cot x=\dfrac{x\cos x}{\sin x}=\dfrac x{\sin x}\cos x\to1\cdot1=1$.</p>`, '$0\\cdot\\infty$ is resolved by rewriting.'),
  LM(2, 'greatest integer', LQ(0, R`x\left[\dfrac1x\right]`), (x) => x * fl(1 / x), 0, 1, '1', ['0', inf, '2'],
    R`<p>$\frac1x-1<\left[\frac1x\right]\le\frac1x$. Multiply by $x>0$: $1-x<x[\frac1x]\le1$. Squeeze: the limit is $1$. For $x<0$ the inequalities flip but the squeeze still gives $1$.</p>`, 'The product is not $0\\cdot\\infty=0$.'),
  LT(2, 'fractional part', LQ(1, R`\left(x-[x]\right)`), (x) => x - fl(x), 1, 'dne', DNE, ['0', '1', R`<span>$\frac12$</span>`],
    R`<p>Right of $1$: $x-[x]=x-1\to0$. Left of $1$: $x-[x]=x-0\to1$. The two one-sided limits differ, so the limit does not exist.</p>`, 'The fractional part $\\{x\\}$ jumps at integers.'),
  LT(2, 'modulus', LQ(2, R`\dfrac{|x-2|}{x-2}`), (x) => abs(x - 2) / (x - 2), 2, 'dne', DNE, ['1', '-1', '0'],
    R`<p>Right of 2 the ratio is $+1$; left of 2 it is $-1$. The one-sided limits are different, so the limit does not exist.</p>`, 'One sided limits exist; two sided does not.'),
  LI(2, 'modulus', LQ(R`3^-`, R`\dfrac{x-3}{|x-3|}`), (x) => (x - 3) / abs(x - 3), 3, -1, R`<p>For $x<3$, $|x-3|=3-x=-(x-3)$, so the ratio is $-1$.</p>`, 'Use the sign of $x-3$ on that side.', -1),
  LT(2, 'modulus', LQ(0, R`\dfrac{\sin|x|}{x}`), (x) => sin(abs(x)) / x, 0, 'dne', DNE, ['1', '-1', '0'],
    R`<p>For $x>0$: $\frac{\sin x}x\to1$. For $x<0$: $\frac{\sin(-x)}x=-\frac{\sin x}x\to-1$. The sides disagree.</p>`, 'Check both sides when $|x|$ appears.'),
  LM(2, 'squeeze', LQ(R`\infty`, R`x\sin\dfrac1x`), (x) => x * sin(1 / x), Infinity, 1, '1', ['0', inf, 'does not exist'],
    R`<p>Put $t=\frac1x\to0$: $\dfrac{\sin t}{t}\to1$.</p>`, 'Here $x\\to\\infty$, so it is not the squeeze to 0.'),
  LM(2, 'squeeze', LQ(R`\infty`, R`\dfrac{\sin x}{x}`), (x) => sin(x) / x, Infinity, 0, '0', ['1', inf, R`\text{does not exist}`],
    R`<p>$\left|\frac{\sin x}x\right|\le\frac1{|x|}\to0$, so the limit is $0$ (squeeze).</p>`, 'The standard limit $\\frac{\\sin x}x\\to1$ is only at $x\\to0$.'),
  LM(2, 'squeeze', LQ(0, R`x^2\cos\dfrac1x`), (x) => x * x * cos(1 / x), 0, 0, '0', ['1', inf, R`\text{does not exist}`],
    R`<p>$|x^2\cos\frac1x|\le x^2\to0$. Squeeze gives $0$.</p>`, '$\\cos\\frac1x$ has no limit but is bounded.'),
  LM(2, 'squeeze', LQ(R`\infty`, R`\dfrac{x+\sin x}{x-\cos x}`), (x) => (x + sin(x)) / (x - cos(x)), Infinity, 1, '1', ['0', '2', inf],
    R`<p>Divide by $x$: $\dfrac{1+\frac{\sin x}x}{1-\frac{\cos x}x}\to\dfrac{1+0}{1-0}=1$.</p>`, 'Bounded over $x$ goes to 0.'),
  LM(2, 'series expansion', LQ(0, R`\dfrac{\tan x-\sin x}{x^3}`), (x) => (tan(x) - sin(x)) / x ** 3, 0, 0.5, R`\dfrac12`, ['1', R`\dfrac16`, '0'],
    R`<p>$\tan x-\sin x=\left(x+\frac{x^3}3\right)-\left(x-\frac{x^3}6\right)+\cdots=\frac{x^3}2+\cdots$. Divide by $x^3$: $\frac12$.</p>`, 'Do not cancel $\\tan x$ with $\\sin x$ to get 0.'),
  LM(2, 'series expansion', LQ(0, R`\dfrac{x-\sin x}{x^3}`), (x) => (x - sin(x)) / x ** 3, 0, 1 / 6, R`\dfrac16`, [R`\dfrac13`, R`\dfrac12`, '6'],
    R`<p>$\sin x=x-\frac{x^3}6+\cdots$, so $x-\sin x=\frac{x^3}6+\cdots$ and the limit is $\frac16$.</p>`, 'The cubic term of $\\sin x$ has $3!=6$ in the denominator.'),
  LM(2, 'series expansion', LQ(0, R`\dfrac{e^x-1-x}{x^2}`), (x) => (exp(x) - 1 - x) / (x * x), 0, 0.5, R`\dfrac12`, ['1', R`\dfrac16`, '0'],
    R`<p>$e^x=1+x+\frac{x^2}2+\cdots$, so $e^x-1-x=\frac{x^2}2+\cdots$ and the limit is $\frac12$.</p>`, 'The $x^2$ term of $e^x$ has $2!$.'),
  LM(2, 'series expansion', LQ(0, R`\dfrac{1-\cos x\cos2x}{x^2}`), (x) => (1 - cos(x) * cos(2 * x)) / (x * x), 0, 2.5, R`\dfrac52`, ['3', R`\dfrac32`, '2'],
    R`<p>$\cos x\cos2x\approx\left(1-\frac{x^2}2\right)\left(1-2x^2\right)=1-\frac52x^2+\cdots$. So $1-\cos x\cos2x\approx\frac52x^2$ and the limit is $\frac52$.</p>`, 'Add $\\frac{k^2}{2}$ for each cosine factor.'),
  LI(2, 'series expansion', LQ(0, R`\dfrac{1-\cos x\cos2x\cos3x}{x^2}`), (x) => (1 - cos(x) * cos(2 * x) * cos(3 * x)) / (x * x), 0, 7, R`<p>Each $\cos kx\approx1-\frac{k^2x^2}2$. The product is $1-\frac{1+4+9}2x^2+\cdots=1-7x^2$. So the limit is $7$.</p>`, 'Add the $\\frac{k^2}2$ terms: $\\frac{1+4+9}{2}$.'),
  LM(2, 'standard limits', LQ(0, R`\dfrac{5^x-3^x}{x}`), (x) => (5 ** x - 3 ** x) / x, 0, ln(5 / 3), R`\ln\dfrac53`, [R`\ln15`, R`\ln2`, R`\dfrac53`],
    R`<p>$\dfrac{5^x-3^x}x=\dfrac{5^x-1}x-\dfrac{3^x-1}x\to\ln5-\ln3=\ln\dfrac53$.</p>`, 'Subtract the logs.'),
  LI(2, 'standard limits', LQ(0, R`\dfrac{(1+x)^7-1}{x}`), (x) => ((1 + x) ** 7 - 1) / x, 0, 7, R`<p>$\lim_{x\to0}\dfrac{(1+x)^n-1}x=n$. With $n=7$ the limit is $7$.</p>`, 'It is the derivative of $(1+x)^7$ at 0.'),
  LM(2, 'rationalising', LQ(0, R`\dfrac{\sqrt{1+x}-\sqrt{1-x}}{x}`), (x) => (sqrt(1 + x) - sqrt(1 - x)) / x, 0, 1, '1', ['0', '2', R`\dfrac12`],
    R`<p>Multiply by the conjugate: $\dfrac{(1+x)-(1-x)}{x(\sqrt{1+x}+\sqrt{1-x})}=\dfrac2{\sqrt{1+x}+\sqrt{1-x}}\to\dfrac22=1$.</p>`, 'The numerator is $2x$, not $x$.'),
  LM(2, 'standard limits', LQ(1, R`\dfrac{x^{1/3}-1}{x^{1/2}-1}`), (x) => (x ** (1 / 3) - 1) / (x ** 0.5 - 1), 1, 2 / 3, R`\dfrac23`, [R`\dfrac32`, R`\dfrac16`, '1'],
    R`<p>$\lim_{x\to1}\dfrac{x^m-1}{x-1}=m$. So the top $\to\frac13$ and the bottom $\to\frac12$ (after dividing by $x-1$). The ratio is $\dfrac{1/3}{1/2}=\dfrac23$.</p>`, 'Invert the wrong way and you get $\\frac32$.'),
  LM(2, 'standard limits', LQ(R`\dfrac\pi2`, R`\dfrac{1-\sin x}{\left(\frac\pi2-x\right)^2}`), (x) => (1 - sin(x)) / (PI_ / 2 - x) ** 2, PI_ / 2, 0.5, R`\dfrac12`, ['1', '0', '2'],
    R`<p>Put $h=\frac\pi2-x\to0$. $\sin x=\cos h$, so the expression is $\dfrac{1-\cos h}{h^2}\to\dfrac12$.</p>`, 'Substitute $h$ to move the limit to 0.'),
  LM(2, 'standard limits', LQ(R`\dfrac\pi4`, R`\dfrac{\sin x-\cos x}{x-\frac\pi4}`), (x) => (sin(x) - cos(x)) / (x - PI_ / 4), PI_ / 4, sqrt(2), R`\sqrt2`, ['1', R`\dfrac1{\sqrt2}`, '0'],
    R`<p>This is the derivative of $\sin x-\cos x$ at $\frac\pi4$: $\cos x+\sin x=\frac1{\sqrt2}+\frac1{\sqrt2}=\sqrt2$.</p>`, 'Add, not subtract: derivative of $-\\cos x$ is $+\\sin x$.'),
  LM(2, 'standard limits', LQ(0, R`\dfrac{\cos2x-\cos5x}{x^2}`), (x) => (cos(2 * x) - cos(5 * x)) / (x * x), 0, 10.5, R`\dfrac{21}2`, [R`\dfrac{29}2`, '21', R`\dfrac32`],
    R`<p>$\cos2x-\cos5x=\left(1-\frac{4x^2}2\right)-\left(1-\frac{25x^2}2\right)=\frac{21}2x^2$. The limit is $\frac{21}2$.</p>`, 'Subtract the squares: $25-4$, not $25+4$.'),

  // ================= L3 =================
  LM(3, 'standard limits', LQ(R`\pi`, R`\dfrac{\sin x}{\pi-x}`), (x) => sin(x) / (PI_ - x), PI_, 1, '1', ['0', R`-1`, R`\pi`],
    R`<p>Put $h=\pi-x$. $\sin x=\sin(\pi-h)=\sin h$, so the limit is $\dfrac{\sin h}h\to1$.</p>`, 'Do not substitute $x=\\pi$ blindly: it is $\\frac00$.'),
  LM(3, 'derivative form', LQ(R`\dfrac\pi3`, R`\dfrac{\sin x-\frac{\sqrt3}2}{x-\frac\pi3}`), (x) => (sin(x) - sqrt(3) / 2) / (x - PI_ / 3), PI_ / 3, 0.5, R`\dfrac12`, [R`\dfrac{\sqrt3}2`, '1', '0'],
    R`<p>This is $\frac{d}{dx}\sin x$ at $x=\frac\pi3$, which is $\cos\frac\pi3=\frac12$.</p>`, 'The answer is $\\cos$, not $\\sin$, of the point.'),
  LM(3, 'standard limits', LQ(0, R`\dfrac{\sec x-1}{x^2}`), (x) => (1 / cos(x) - 1) / (x * x), 0, 0.5, R`\dfrac12`, ['1', '0', '2'],
    R`<p>$\sec x-1=\dfrac{1-\cos x}{\cos x}$. So the fraction is $\dfrac{1-\cos x}{x^2}\cdot\dfrac1{\cos x}\to\dfrac12\cdot1$.</p>`, 'Keep the $\\cos x$ in the denominator.'),
  LM(3, 'standard limits', LQ(0, R`\dfrac{\sin(\sin x)}{x}`), (x) => sin(sin(x)) / x, 0, 1, '1', ['0', R`\dfrac12`, '2'],
    R`<p>$\dfrac{\sin(\sin x)}{\sin x}\cdot\dfrac{\sin x}x\to1\cdot1=1$, because $\sin x\to0$.</p>`, 'The inner function also tends to 0, so the standard limit applies.'),
  LM(3, 'combining fractions', LQ(2, R`\left(\dfrac1{x-2}-\dfrac4{x^2-4}\right)`), (x) => 1 / (x - 2) - 4 / (x * x - 4), 2, 0.25, R`\dfrac14`, ['0', '1', inf],
    R`<p>Combine: $\dfrac{(x+2)-4}{(x-2)(x+2)}=\dfrac{x-2}{(x-2)(x+2)}=\dfrac1{x+2}\to\dfrac14$.</p>`, 'Each fraction blows up, but the difference does not.'),
  LM(3, 'combining fractions', LQ(1, R`\left(\dfrac1{1-x}-\dfrac3{1-x^3}\right)`), (x) => 1 / (1 - x) - 3 / (1 - x ** 3), 1, -1, '-1', ['1', '0', inf],
    R`<p>$1-x^3=(1-x)(1+x+x^2)$. So the expression is $\dfrac{(1+x+x^2)-3}{1-x^3}=\dfrac{(x+2)(x-1)}{(1-x)(1+x+x^2)}=-\dfrac{x+2}{1+x+x^2}\to-\dfrac33=-1$.</p>`, 'Watch the sign: $x-1=-(1-x)$.'),
  LM(3, 'limits at infinity', LQ(R`\infty`, R`x\left(\sqrt{x^2+1}-x\right)`), (x) => x * (sqrt(x * x + 1) - x), Infinity, 0.5, R`\dfrac12`, ['0', '1', inf],
    R`<p>$x\left(\sqrt{x^2+1}-x\right)=\dfrac{x}{\sqrt{x^2+1}+x}=\dfrac1{\sqrt{1+1/x^2}+1}\to\dfrac12$.</p>`, '$\\infty\\cdot0$: rationalise first.'),
  LM(3, 'limits at infinity', LQ(R`\infty`, R`x^2\left(e^{1/x}-1-\dfrac1x\right)`), (x) => x * x * (exp(1 / x) - 1 - 1 / x), Infinity, 0.5, R`\dfrac12`, ['1', '0', inf],
    R`<p>Put $t=\frac1x\to0$: $\dfrac{e^t-1-t}{t^2}\to\dfrac12$.</p>`, 'Substitution $t=1/x$ turns this into a limit at 0.'),
  LM(3, 'limits at infinity', LQ(R`\infty`, R`x\ln\left(1+\dfrac2x\right)`), (x) => x * ln(1 + 2 / x), Infinity, 2, '2', ['1', R`\dfrac12`, inf],
    R`<p>With $t=\frac2x$: $x\ln(1+\frac2x)=2\cdot\dfrac{\ln(1+t)}t\to2$.</p>`, 'Do not forget the 2.'),
  LM(3, 'limits at infinity', LQ(R`\infty`, R`x\left(2^{1/x}-1\right)`), (x) => x * (2 ** (1 / x) - 1), Infinity, ln(2), R`\ln2`, ['1', '2', '0'],
    R`<p>With $t=\frac1x\to0$: $\dfrac{2^t-1}t\to\ln2$.</p>`, 'The answer is a log, not the base.'),
  LM(3, '$1^\\infty$ form', LQ(R`\infty`, R`\left(\dfrac{x+1}{x-1}\right)^x`), (x) => ((x + 1) / (x - 1)) ** x, Infinity, E_ ** 2, R`e^2`, [e, R`e^{1/2}`, '1'],
    R`<p>$\dfrac{x+1}{x-1}=1+\dfrac2{x-1}$. The exponent times the excess is $x\cdot\dfrac2{x-1}\to2$. Limit $=e^2$.</p>`, 'Use $\\lim[f]^{g}=e^{\\lim g(f-1)}$.'),
  LM(3, '$1^\\infty$ form', LQ(R`\infty`, R`\left(\dfrac{x^2+1}{x^2-1}\right)^{x^2}`), (x) => ((x * x + 1) / (x * x - 1)) ** (x * x), Infinity, E_ ** 2, R`e^2`, [e, '1', R`e^{1/2}`],
    R`<p>The excess is $\dfrac{x^2+1}{x^2-1}-1=\dfrac2{x^2-1}$. Times the exponent $x^2$: $\dfrac{2x^2}{x^2-1}\to2$. Limit $e^2$.</p>`, 'The exponent is $x^2$, so the excess must be of order $\\frac1{x^2}$.'),
  LM(3, '$1^\\infty$ form', LQ(0, R`(1+\sin x)^{1/x}`), (x) => (1 + sin(x)) ** (1 / x), 0, E_, e, ['1', R`e^{-1}`, inf],
    R`<p>$\displaystyle\lim(1+\sin x)^{1/x}=e^{\lim\frac{\sin x}x}=e^1$.</p>`, 'Use $e^{\\lim g(f-1)}$.'),
  LM(3, '$1^\\infty$ form', LQ(0, R`(\cos x)^{1/x^2}`), (x) => cos(x) ** (1 / (x * x)), 0, exp(-0.5), R`e^{-1/2}`, [R`e^{1/2}`, R`e^{-1}`, '1'],
    R`<p>$\lim\dfrac{\cos x-1}{x^2}=-\dfrac12$, so the limit is $e^{-1/2}$.</p>`, 'The sign is negative: $\\cos x<1$.'),
  LM(3, '$1^\\infty$ form', LQ(0, R`(1+\tan x)^{\cot x}`), (x) => (1 + tan(x)) ** (1 / tan(x)), 0, E_, e, ['1', R`e^{-1}`, '0'],
    R`<p>$\cot x\cdot\tan x=1$, so the limit is $e^1=e$.</p>`, 'The product of exponent and excess is $1$.'),
  LM(3, '$1^\\infty$ form', LQ(R`\dfrac\pi2`, R`(\sin x)^{\tan x}`), (x) => sin(x) ** tan(x), PI_ / 2, 1, '1', [e, R`e^{-1}`, '0'],
    R`<p>Excess $\sin x-1$; times $\tan x$: $\dfrac{(\sin x-1)\sin x}{\cos x}=-\dfrac{(1-\sin x)\sin x}{\cos x}$. As $x\to\frac\pi2$, $1-\sin x\approx\frac{h^2}2$ and $\cos x\approx h$ (with $h=\frac\pi2-x$), so the product is of order $h\to0$. The limit is $e^0=1$.</p>`, 'Here the exponent grows slowly compared with how fast the base nears 1.'),
  LM(3, '$1^\\infty$ form', LQ(1, R`x^{1/(1-x)}`), (x) => x ** (1 / (1 - x)), 1, 1 / E_, R`\dfrac1e`, [e, '1', R`e^2`],
    R`<p>Excess times exponent: $\dfrac{x-1}{1-x}=-1$. Limit $e^{-1}$.</p>`, 'Sign: $x-1=-(1-x)$.'),
  LI(3, 'mean of exponentials', LQ(0, R`\left(\dfrac{4^x+9^x}2\right)^{1/x}`), (x) => ((4 ** x + 9 ** x) / 2) ** (1 / x), 0, 6, R`<p>Excess $=\dfrac{4^x+9^x-2}2$. Dividing by $x$: $\dfrac12\left(\dfrac{4^x-1}x+\dfrac{9^x-1}x\right)\to\dfrac{\ln4+\ln9}2=\ln6$. Limit $e^{\ln6}=6$ (the geometric mean).</p>`, 'The answer is $\\sqrt{ab}$, not $\\frac{a+b}{2}$.'),
  LM(3, 'piecewise limits', R`Let $f(x)=\begin{cases}x^2+1,&x<2\\3x-1,&x\ge2\end{cases}$. Then $\displaystyle\lim_{x\to2}f(x)$ equals`,
    (x) => (x < 2 ? x * x + 1 : 3 * x - 1), 2, 5, '5', ['4', '6', R`\text{does not exist}`],
    R`<p>Left: $2^2+1=5$. Right: $3\cdot2-1=5$. Both agree, so the limit is $5$.</p>`, 'Compute both pieces at the break point.'),
  LT(3, 'piecewise limits', R`Let $f(x)=\begin{cases}2x+1,&x\le1\\x^2+3,&x>1\end{cases}$. Then $\displaystyle\lim_{x\to1}f(x)$`,
    (x) => (x <= 1 ? 2 * x + 1 : x * x + 3), 1, 'dne', DNE, ['equals 3', 'equals 4', 'equals 7'],
    R`<p>Left limit $=2+1=3$; right limit $=1+3=4$. They differ, so the limit does not exist. The value $f(1)=3$ does not matter.</p>`, 'The value of $f$ at the point is irrelevant to the limit.'),
  LI(3, 'greatest integer', LQ(R`0^-`, R`\left([x]-|x|\right)`), (x) => fl(x) - abs(x), 0, -1, R`<p>For small $x<0$: $[x]=-1$ and $|x|\to0$. So the value tends to $-1$.</p>`, '$[x]$ is $-1$ just left of 0, not 0.', -1),
  LI(3, 'greatest integer', LQ(R`3^+`, R`\left([x]^2-[x]\right)`), (x) => fl(x) ** 2 - fl(x), 3, 6, R`<p>Right of 3, $[x]=3$. So $9-3=6$.</p>`, 'Use $[x]=3$, not $2$.', 1),
  LI(3, 'greatest integer', LQ(R`2^-`, R`\left(x^2+[x]\right)`), (x) => x * x + fl(x), 2, 5, R`<p>Just left of 2: $x^2\to4$ and $[x]=1$. Sum $=5$.</p>`, 'Left of 2 means $[x]=1$.', -1),
  LI(3, 'greatest integer', LQ(R`0^+`, R`\left([x]-[-x]\right)`), (x) => fl(x) - fl(-x), 0, 1, R`<p>For small $x>0$: $[x]=0$ and $[-x]=-1$. The difference is $0-(-1)=1$.</p>`, '$[-x]$ is not $-[x]$.', 1),
  LT(3, 'modulus', LQ(2, R`\dfrac{x^2-4}{|x-2|}`), (x) => (x * x - 4) / abs(x - 2), 2, 'dne', DNE, ['$4$', '$-4$', '$0$'],
    R`<p>Right: $\dfrac{(x-2)(x+2)}{x-2}=x+2\to4$. Left: $\dfrac{(x-2)(x+2)}{-(x-2)}=-(x+2)\to-4$. Different, so no limit.</p>`, 'Factor first, then handle $|x-2|$ separately on each side.'),
  LI(3, 'modulus', LQ(R`2^+`, R`\dfrac{x^2-4}{|x-2|}`), (x) => (x * x - 4) / abs(x - 2), 2, 4, R`<p>For $x>2$, $|x-2|=x-2$, so the ratio is $x+2\to4$.</p>`, 'Right of 2: $|x-2|=x-2$.', 1),
  LM(3, 'rationalising', LQ(0, R`\dfrac{\sqrt{x^2+1}-1}{x^2}`), (x) => (sqrt(x * x + 1) - 1) / (x * x), 0, 0.5, R`\dfrac12`, ['1', '0', '2'],
    R`<p>Conjugate: $\dfrac{x^2}{x^2(\sqrt{x^2+1}+1)}=\dfrac1{\sqrt{x^2+1}+1}\to\dfrac12$.</p>`, 'The $x^2$ cancels completely.'),
  LM(3, 'standard limits', LQ(R`\infty`, R`x\left(e^{1/x}-1\right)`), (x) => x * (exp(1 / x) - 1), Infinity, 1, '1', ['0', e, inf],
    R`<p>With $t=\frac1x$: $\dfrac{e^t-1}t\to1$.</p>`, '$\\infty\\cdot0$ form.'),
  LM(3, 'standard limits', LQ(1, R`\dfrac{\ln x}{x-1}`), (x) => ln(x) / (x - 1), 1, 1, '1', ['0', e, inf],
    R`<p>Put $x=1+h$: $\dfrac{\ln(1+h)}h\to1$. (It is also the derivative of $\ln x$ at 1.)</p>`, 'Shift the limit to 0 by $x=1+h$.'),
  LM(3, 'standard limits', LQ(0, R`\dfrac{\ln(1+2x)}{\ln(1+3x)}`), (x) => ln(1 + 2 * x) / ln(1 + 3 * x), 0, 2 / 3, R`\dfrac23`, [R`\dfrac32`, '1', '6'],
    R`<p>$\dfrac{\ln(1+2x)}{2x}\cdot\dfrac{3x}{\ln(1+3x)}\cdot\dfrac23\to\dfrac23$.</p>`, 'Top over bottom.'),
  LM(3, 'standard limits', LQ(0, R`\dfrac{e^{x^2}-1}{\cos x-1}`), (x) => (exp(x * x) - 1) / (cos(x) - 1), 0, -2, '-2', ['2', R`-\dfrac12`, '1'],
    R`<p>Top $\approx x^2$, bottom $\approx-\frac{x^2}2$. Ratio $\to-2$.</p>`, 'The bottom is negative.'),
  LM(3, 'series expansion', LQ(0, R`\dfrac{\sin x-x\cos x}{x^3}`), (x) => (sin(x) - x * cos(x)) / x ** 3, 0, 1 / 3, R`\dfrac13`, [R`\dfrac16`, R`\dfrac12`, '1'],
    R`<p>$\sin x-x\cos x=\left(x-\frac{x^3}6\right)-\left(x-\frac{x^3}2\right)+\cdots=\frac{x^3}3+\cdots$. Limit $\frac13$.</p>`, 'Expand both to the cubic term.'),
  LM(3, 'series expansion', LQ(0, R`\dfrac{x-\ln(1+x)}{x^2}`), (x) => (x - ln(1 + x)) / (x * x), 0, 0.5, R`\dfrac12`, ['1', R`\dfrac13`, '0'],
    R`<p>$\ln(1+x)=x-\frac{x^2}2+\cdots$, so $x-\ln(1+x)=\frac{x^2}2+\cdots$. Limit $\frac12$.</p>`, 'Second term of the log series is $-\\frac{x^2}2$.'),
  LM(3, 'inverse trigonometric', LQ(0, R`\dfrac{\sin^{-1}3x}{\tan^{-1}2x}`), (x) => asin(3 * x) / atan(2 * x), 0, 1.5, R`\dfrac32`, [R`\dfrac23`, '6', '1'],
    R`<p>$\sin^{-1}t\approx t$ and $\tan^{-1}t\approx t$ for small $t$. Ratio $\to\dfrac{3x}{2x}=\dfrac32$.</p>`, 'Inverse functions behave like $t$ near 0.'),
  LM(3, 'limits at infinity', LQ(R`\infty`, R`x\left(\dfrac\pi2-\tan^{-1}x\right)`), (x) => x * (PI_ / 2 - atan(x)), Infinity, 1, '1', ['0', R`\dfrac\pi2`, inf],
    R`<p>$\dfrac\pi2-\tan^{-1}x=\cot^{-1}x=\tan^{-1}\frac1x\approx\frac1x$. So $x\cdot\frac1x\to1$.</p>`, 'Use $\\tan^{-1}x+\\cot^{-1}x=\\frac\\pi2$.'),
  LM(3, 'L\'Hopital', LQ(R`0^+`, R`x\ln x`), (x) => x * ln(x), 0, 0, '0', ['-1', '1', R`-\infty`],
    R`<p>Write $x\ln x=\dfrac{\ln x}{1/x}$, a $\frac{-\infty}{\infty}$ form. L'Hopital: $\dfrac{1/x}{-1/x^2}=-x\to0$.</p>`, '$0\\cdot(-\\infty)$ is not automatically $-\\infty$ or $0$: the power wins.', 1),
  LM(3, 'L\'Hopital', LQ(R`0^+`, R`x^x`), (x) => x ** x, 0, 1, '1', ['0', e, inf],
    R`<p>$x^x=e^{x\ln x}$ and $x\ln x\to0$. So the limit is $e^0=1$.</p>`, '$0^0$ is an indeterminate form; take logs.', 1),
  LM(3, 'L\'Hopital', LQ(R`\infty`, R`x^{1/x}`), (x) => x ** (1 / x), Infinity, 1, '1', [e, '0', inf],
    R`<p>$\ln x^{1/x}=\dfrac{\ln x}x\to0$ (L'Hopital). So the limit is $e^0=1$.</p>`, '$\\infty^0$ form: use logs.'),
  LM(3, 'L\'Hopital', LQ(R`\infty`, R`\dfrac{x^2}{e^x}`), (x) => x * x / exp(x), Infinity, 0, '0', ['1', '2', inf],
    R`<p>Apply L'Hopital twice: $\dfrac{2x}{e^x}\to\dfrac2{e^x}\to0$. Exponentials beat powers.</p>`, 'Exponential growth is faster than any power.'),
  LM(3, 'combining fractions', LQ(0, R`\left(\dfrac1x-\dfrac1{e^x-1}\right)`), (x) => 1 / x - 1 / (exp(x) - 1), 0, 0.5, R`\dfrac12`, ['1', '0', R`\dfrac16`],
    R`<p>$\dfrac{e^x-1-x}{x(e^x-1)}\approx\dfrac{x^2/2}{x\cdot x}=\dfrac12$.</p>`, 'Combine, then expand.'),
  LM(3, 'sequences', R`$\displaystyle\lim_{n\to\infty}\dfrac{1+2+3+\cdots+n}{n^2}$ equals`, (n) => (n * (n + 1)) / 2 / (n * n), Infinity, 0.5, R`\dfrac12`, ['1', '0', inf],
    R`<p>$1+2+\cdots+n=\dfrac{n(n+1)}2$. So the ratio is $\dfrac{n+1}{2n}\to\dfrac12$.</p>`, 'The sum is not $n$ times $n$.'),
  LM(3, 'sequences', R`$\displaystyle\lim_{n\to\infty}\left[\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\cdots+\dfrac1{n(n+1)}\right]$ equals`, (n) => n / (n + 1), Infinity, 1, '1', ['0', R`\dfrac12`, inf],
    R`<p>$\dfrac1{k(k+1)}=\dfrac1k-\dfrac1{k+1}$. The sum telescopes to $1-\dfrac1{n+1}\to1$.</p>`, 'The terms go to 0, but the sum does not.'),
  LM(3, 'sequences', R`$\displaystyle\lim_{n\to\infty}\left(2^n+3^n\right)^{1/n}$ equals`, (n) => 3 * (1 + (2 / 3) ** n) ** (1 / n), Infinity, 3, '3', ['2', '5', '1'],
    R`<p>$3\le(2^n+3^n)^{1/n}\le(2\cdot3^n)^{1/n}=3\cdot2^{1/n}\to3$. Squeeze: the limit is $3$.</p>`, 'The biggest base wins.'),
  LM(3, '$1^\\infty$ form', R`$\displaystyle\lim_{n\to\infty}\left(1+\dfrac1{n^2}\right)^n$ equals`, (n) => (1 + 1 / (n * n)) ** n, Infinity, 1, '1', [e, '0', R`e^2`],
    R`<p>Excess times exponent: $\dfrac1{n^2}\cdot n=\dfrac1n\to0$. So the limit is $e^0=1$.</p>`, 'The excess is too small to build $e$.'),
  LI(3, 'series expansion', LQ(0, R`\dfrac{3\sin x-\sin3x}{x^3}`), (x) => (3 * sin(x) - sin(3 * x)) / x ** 3, 0, 4, R`<p>$3\sin x=3x-\frac{x^3}2$ and $\sin3x=3x-\frac{27x^3}6=3x-\frac{9x^3}2$. Difference: $\left(-\frac12+\frac92\right)x^3=4x^3$. Limit $4$.</p>`, 'The $x$ terms cancel; compare cubes.'),
  LI(3, 'series expansion', LQ(0, R`\dfrac{\tan2x-2\tan x}{x^3}`), (x) => (tan(2 * x) - 2 * tan(x)) / x ** 3, 0, 2, R`<p>$\tan x=x+\frac{x^3}3$. $\tan2x=2x+\frac{8x^3}3$. $2\tan x=2x+\frac{2x^3}3$. Difference $=\frac{6x^3}3=2x^3$. Limit $2$.</p>`, 'Cube the 2 inside $\\tan2x$: $2^3=8$.'),
  LM(3, 'standard limits', LQ(0, R`\dfrac{\ln\cos x}{x^2}`), (x) => ln(cos(x)) / (x * x), 0, -0.5, R`-\dfrac12`, [R`\dfrac12`, '0', '-1'],
    R`<p>$\ln\cos x=\ln\left(1-\frac{x^2}2+\cdots\right)\approx-\frac{x^2}2$. Limit $-\frac12$.</p>`, '$\\cos x<1$ so the log is negative.'),
  LM(3, 'standard limits', LQ(0, R`\dfrac{\ln(1+x)-\sin x}{x^2}`), (x) => (ln(1 + x) - sin(x)) / (x * x), 0, -0.5, R`-\dfrac12`, [R`\dfrac12`, '0', '-1'],
    R`<p>$\ln(1+x)-\sin x=\left(x-\frac{x^2}2\right)-x+\cdots=-\frac{x^2}2+\cdots$. Limit $-\frac12$.</p>`, 'The linear terms cancel.'),
  LI(3, 'product of limits', LQ(0, R`\dfrac{(1-\cos x)(1-\cos2x)}{x^4}`), (x) => ((1 - cos(x)) * (1 - cos(2 * x))) / x ** 4, 0, 1, R`<p>$\dfrac{1-\cos x}{x^2}\to\dfrac12$ and $\dfrac{1-\cos2x}{x^2}\to2$. The limit of the product is $\dfrac12\cdot2=1$.</p>`, 'Limit of a product is the product of limits when each exists.'),
  LN(3, 'sequences', R`Find $\displaystyle\lim_{n\to\infty}n\sin\dfrac\pi n$.`, (n) => n * sin(PI_ / n), Infinity, PI_, R`<p>Put $t=\frac\pi n\to0$: $n\sin\frac\pi n=\pi\cdot\dfrac{\sin t}t\to\pi\approx3.14$.</p>`, 'The $\\pi$ stays.'),
];

items.push(
  // ================= L4 =================
  LM(4, '$1^\\infty$ form', LQ(0, R`\left(\dfrac{\sin x}{x}\right)^{1/x^2}`), (x) => (sin(x) / x) ** (1 / (x * x)), 0, exp(-1 / 6), R`e^{-1/6}`, [R`e^{1/6}`, R`e^{-1/2}`, '1'],
    R`<p>$\dfrac{\sin x}x-1=-\dfrac{x^2}6+\cdots$. Times $\frac1{x^2}$: $-\frac16$. Limit $e^{-1/6}$.</p>`, 'Expand $\\sin x$ to the cubic term to get the $x^2$ term of $\\frac{\\sin x}x$.'),
  LM(4, '$1^\\infty$ form', LQ(0, R`\left(\dfrac{\tan x}{x}\right)^{1/x^2}`), (x) => (tan(x) / x) ** (1 / (x * x)), 0, exp(1 / 3), R`e^{1/3}`, [R`e^{-1/3}`, R`e^{1/6}`, e],
    R`<p>$\dfrac{\tan x}x-1=\dfrac{x^2}3+\cdots$. Divide by $x^2$: $\frac13$. Limit $e^{1/3}$.</p>`, '$\\tan x>x$, so the exponent of $e$ is positive.'),
  LM(4, '$1^\\infty$ form', LQ(0, R`\left(\dfrac{(1+x)^{1/x}}{e}\right)^{1/x}`), (x) => ((1 + x) ** (1 / x) / E_) ** (1 / x), 0, exp(-0.5), R`e^{-1/2}`, [R`e^{1/2}`, '1', R`e^{-1}`],
    R`<p>Take logs: $\dfrac1x\left(\dfrac{\ln(1+x)}x-1\right)=\dfrac1x\left(-\dfrac x2+\dfrac{x^2}3-\cdots\right)\to-\dfrac12$. Limit $e^{-1/2}$.</p>`, 'The base $\\to e/e=1$, so it is again a $1^\\infty$ form.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{e^x-1-x-\frac{x^2}2}{x^3}`), (x) => (exp(x) - 1 - x - (x * x) / 2) / x ** 3, 0, 1 / 6, R`\dfrac16`, [R`\dfrac12`, R`\dfrac13`, '1'],
    R`<p>$e^x=1+x+\frac{x^2}{2}+\frac{x^3}{6}+\cdots$. So the numerator is $\frac{x^3}6+\cdots$.</p>`, 'The cubic term has $3!=6$.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{x-\tan^{-1}x}{x^3}`), (x) => (x - atan(x)) / x ** 3, 0, 1 / 3, R`\dfrac13`, [R`\dfrac16`, R`\dfrac12`, '1'],
    R`<p>$\tan^{-1}x=x-\frac{x^3}3+\cdots$. So $x-\tan^{-1}x=\frac{x^3}3+\cdots$.</p>`, 'The series of $\\tan^{-1}x$ has $\\frac13$, not $\\frac16$.'),
  LM(4, 'L\'Hopital', LQ(0, R`\dfrac{\sin^{-1}x-x}{x^3}`), (x) => (asin(x) - x) / x ** 3, 0, 1 / 6, R`\dfrac16`, [R`\dfrac13`, R`-\dfrac16`, '0'],
    R`<p>L'Hopital: derivative of top $=\frac1{\sqrt{1-x^2}}-1\approx\frac{x^2}2$; of bottom $=3x^2$. Ratio $\to\frac1{6}$.</p>`, 'The series is $\\sin^{-1}x=x+\\frac{x^3}6+\\cdots$.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{\cos x-1+\frac{x^2}2}{x^4}`), (x) => (cos(x) - 1 + (x * x) / 2) / x ** 4, 0, 1 / 24, R`\dfrac1{24}`, [R`\dfrac1{12}`, R`-\dfrac1{24}`, R`\dfrac12`],
    R`<p>$\cos x=1-\frac{x^2}2+\frac{x^4}{24}-\cdots$. The numerator is $\frac{x^4}{24}+\cdots$.</p>`, '$4!=24$.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{\tan x-x}{x-\sin x}`), (x) => (tan(x) - x) / (x - sin(x)), 0, 2, '2', ['1', R`\dfrac12`, '3'],
    R`<p>$\tan x-x\approx\frac{x^3}3$ and $x-\sin x\approx\frac{x^3}6$. Ratio $=\dfrac{1/3}{1/6}=2$.</p>`, 'Both are of order $x^3$.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{e^x+e^{-x}-2-x^2}{x^4}`), (x) => (exp(x) + exp(-x) - 2 - x * x) / x ** 4, 0, 1 / 12, R`\dfrac1{12}`, [R`\dfrac1{24}`, R`\dfrac16`, '0'],
    R`<p>$e^x+e^{-x}=2\left(1+\frac{x^2}{2!}+\frac{x^4}{4!}+\cdots\right)=2+x^2+\frac{x^4}{12}+\cdots$. So the numerator is $\frac{x^4}{12}$.</p>`, 'Odd powers cancel; even powers double.'),
  LM(4, 'combining fractions', LQ(0, R`\left(\dfrac1{\sin^2x}-\dfrac1{x^2}\right)`), (x) => 1 / sin(x) ** 2 - 1 / (x * x), 0, 1 / 3, R`\dfrac13`, [R`-\dfrac13`, '0', '1'],
    R`<p>$\dfrac{x^2-\sin^2x}{x^2\sin^2x}$. $\sin^2x=x^2-\frac{x^4}3+\cdots$, so the top $=\frac{x^4}3$ and the bottom $\approx x^4$. Limit $\frac13$.</p>`, 'The numerator is positive: $\\sin x<x$.'),
  LM(4, 'combining fractions', LQ(0, R`\dfrac1x\left(\cot x-\dfrac1x\right)`), (x) => (1 / tan(x) - 1 / x) / x, 0, -1 / 3, R`-\dfrac13`, [R`\dfrac13`, '0', '-1'],
    R`<p>$\cot x=\frac1x-\frac x3-\cdots$, so $\cot x-\frac1x\approx-\frac x3$. Divide by $x$: $-\frac13$.</p>`, 'The series of $\\cot x$ begins $\\frac1x-\\frac x3$.'),
  LM(4, 'combining fractions', LQ(0, R`\left(\dfrac1{x^2}-\cot^2x\right)`), (x) => 1 / (x * x) - 1 / tan(x) ** 2, 0, 2 / 3, R`\dfrac23`, [R`\dfrac13`, '0', R`-\dfrac23`],
    R`<p>$\cot^2x=\left(\frac1x-\frac x3\right)^2\approx\frac1{x^2}-\frac23$. So $\frac1{x^2}-\cot^2x\to\frac23$.</p>`, 'Square the series $\\frac1x-\\frac x3$, do not square only the first term.'),
  LM(4, 'L\'Hopital', LQ(0, R`\dfrac{e^{\sin x}-e^x}{\sin x-x}`), (x) => (exp(sin(x)) - exp(x)) / (sin(x) - x), 0, 1, '1', ['0', e, '-1'],
    R`<p>Write $e^{\sin x}-e^x=e^x\left(e^{\sin x-x}-1\right)$. With $u=\sin x-x\to0$: $\dfrac{e^u-1}u\to1$, and $e^x\to1$. Limit $1$.</p>`, 'Factor out $e^x$ and use the standard limit.'),
  LN(4, 'trigonometric identities', LQ(0, R`\dfrac{\sin\left(2\pi\cos^2x\right)}{x^2}`), (x) => sin(2 * PI_ * cos(x) ** 2) / (x * x), 0, -2 * PI_, R`<p>$2\pi\cos^2x=2\pi-2\pi\sin^2x$. So $\sin(2\pi\cos^2x)=-\sin(2\pi\sin^2x)\approx-2\pi x^2$. Limit $=-2\pi\approx-6.28$.</p>`, 'The sine of $2\\pi-t$ is $-\\sin t$.'),
  LN(4, 'standard limits', LQ(1, R`(1-x)\tan\dfrac{\pi x}2`), (x) => (1 - x) * tan((PI_ * x) / 2), 1, 2 / PI_, R`<p>Put $h=1-x\to0$: $\tan\left(\frac\pi2-\frac{\pi h}2\right)=\cot\frac{\pi h}2$. So the expression is $h\cot\frac{\pi h}2=\dfrac{h}{\tan(\pi h/2)}\to\dfrac2\pi\approx0.64$.</p>`, 'Shift to $h=1-x$ and use $\\tan(\\frac\\pi2-t)=\\cot t$.'),
  LM(4, 'L\'Hopital', LQ(0, R`\dfrac{x\cos x-\sin x}{x^2\sin x}`), (x) => (x * cos(x) - sin(x)) / (x * x * sin(x)), 0, -1 / 3, R`-\dfrac13`, [R`\dfrac13`, R`-\dfrac16`, '0'],
    R`<p>Numerator $\approx\left(x-\frac{x^3}2\right)-\left(x-\frac{x^3}6\right)=-\frac{x^3}3$. Denominator $\approx x^3$. Limit $-\frac13$.</p>`, 'Cubic terms: $-\\frac12+\\frac16=-\\frac13$.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{e^{x^2}-\cos x}{x^2}`), (x) => (exp(x * x) - cos(x)) / (x * x), 0, 1.5, R`\dfrac32`, ['1', '2', R`\dfrac12`],
    R`<p>$e^{x^2}\approx1+x^2$, $\cos x\approx1-\frac{x^2}2$. Difference $\approx\frac32x^2$.</p>`, 'Add the two $x^2$ coefficients: $1+\\frac12$.'),
  LM(4, 'standard limits', LQ(0, R`\dfrac{\ln\left(1+x^2\right)}{1-\cos x}`), (x) => ln(1 + x * x) / (1 - cos(x)), 0, 2, '2', ['1', R`\dfrac12`, '0'],
    R`<p>Top $\approx x^2$, bottom $\approx\frac{x^2}2$. Ratio $2$.</p>`, 'Use $\\ln(1+t)\\approx t$ and $1-\\cos x\\approx\\frac{x^2}2$.'),
  LM(4, 'sequences', R`$\displaystyle\lim_{n\to\infty}n\left(\cos\dfrac1n-1\right)\cdot n$ equals`, (n) => n * n * (cos(1 / n) - 1), Infinity, -0.5, R`-\dfrac12`, [R`\dfrac12`, '0', '-1'],
    R`<p>$n^2(\cos\frac1n-1)=\dfrac{\cos t-1}{t^2}$ with $t=\frac1n\to0$, which tends to $-\frac12$.</p>`, 'Put $t=\\frac1n$.'),
  LM(4, '$1^\\infty$ form', LQ(0, R`\left(\dfrac{2^x+4^x+8^x}3\right)^{1/x}`), (x) => ((2 ** x + 4 ** x + 8 ** x) / 3) ** (1 / x), 0, 4, '4', ['2', '8', R`\dfrac{14}3`],
    R`<p>Limit $=\sqrt[3]{2\cdot4\cdot8}=\sqrt[3]{64}=4$ (geometric mean).</p>`, 'It is the geometric mean, not the arithmetic mean $\\frac{14}{3}$.'),
  LM(4, 'limits at infinity', LQ(R`\infty`, R`\left(\dfrac{x^2+x+1}{x^2-x+1}\right)^{x}`), (x) => ((x * x + x + 1) / (x * x - x + 1)) ** x, Infinity, E_ ** 2, R`e^2`, [e, R`e^{1/2}`, '1'],
    R`<p>Excess $=\dfrac{2x}{x^2-x+1}$. Times exponent $x$: $\dfrac{2x^2}{x^2-x+1}\to2$. Limit $e^2$.</p>`, 'Excess times exponent, not just the excess.'),
  LM(4, 'L\'Hopital', LQ(R`\infty`, R`\dfrac{\ln x}{\sqrt x}`), (x) => ln(x) / sqrt(x), Infinity, 0, '0', ['1', '2', inf],
    R`<p>L'Hopital: $\dfrac{1/x}{1/(2\sqrt x)}=\dfrac2{\sqrt x}\to0$. Any positive power beats the log.</p>`, 'Remember which function dominates.'),

  // constants so that a limit exists
  LC(4, 'finding constants', R`If $\displaystyle\lim_{x\to0}\dfrac{\sin2x+a\sin x}{x^3}$ is finite, find $a$.`, (x) => (sin(2 * x) - 2 * sin(x)) / x ** 3, 0, -1, -2,
    R`<p>Expand: $\sin2x+a\sin x=(2+a)x-\dfrac{8+a}6x^3+\cdots$. For a finite limit the $x$-term must vanish: $a=-2$. (Then the limit is $-\frac{8-2}6=-1$.)</p>`, 'Make the lower powers vanish first.'),
  LC(4, 'finding constants', R`If $\displaystyle\lim_{x\to0}\dfrac{x(1+a\cos x)-b\sin x}{x^3}=-\dfrac12$, find $a+b$.`, (x) => (x * (1 + 2 * cos(x)) - 3 * sin(x)) / x ** 3, 0, -0.5, 5,
    R`<p>Expand: numerator $=(1+a-b)x+\left(-\frac a2+\frac b6\right)x^3+\cdots$. The $x$ term must vanish: $b=1+a$. Then $-\frac a2+\frac{1+a}6=-\frac12$, so $-3a+1+a=-3$, $a=2$, $b=3$. Check: $a+b=5$.</p>`, 'Two conditions: kill the $x$ term and match the $x^3$ coefficient.'),
  LC(3, 'finding constants', R`If $\displaystyle\lim_{x\to1}\dfrac{x^2+ax+b}{x-1}=3$, find $ab$.`, (x) => (x * x + x - 2) / (x - 1), 1, 3, -2,
    R`<p>The denominator $\to0$, so the numerator must also vanish at $x=1$: $1+a+b=0$. Then $x^2+ax+b=(x-1)(x+c)$ with limit $1+c=3$, so $c=2$. Expand: $x^2+x-2$, so $a=1$, $b=-2$, $ab=-2$.</p>`, 'A finite limit of $\\frac{\\text{something}}0$ forces the numerator to vanish.'),
  LC(3, 'finding constants', R`If $\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+ax+1}-x\right)=3$, find $a$.`, (x) => sqrt(x * x + 6 * x + 1) - x, Infinity, 3, 6,
    R`<p>Conjugate: $\dfrac{ax+1}{\sqrt{x^2+ax+1}+x}\to\dfrac a2$. So $\frac a2=3$ and $a=6$.</p>`, 'The limit is $\\frac a2$, not $a$.'),
  LC(4, 'finding constants', R`If $\displaystyle\lim_{x\to\infty}\left(\dfrac{x^2+1}{x+1}-ax-b\right)=0$, find $a-b$.`, (x) => (x * x + 1) / (x + 1) - x + 1, Infinity, 0, 2,
    R`<p>$\dfrac{x^2+1}{x+1}=x-1+\dfrac2{x+1}$ (long division). So $\left(1-a\right)x+(-1-b)+\dfrac2{x+1}\to0$ needs $a=1$, $b=-1$. $a-b=2$.</p>`, 'Divide first; both the $x$ term and the constant must vanish.'),
  LC(3, 'finding constants', R`If $\displaystyle\lim_{x\to0}\dfrac{\cos ax-1}{x^2}=-8$, find $a^2$.`, (x) => (cos(4 * x) - 1) / (x * x), 0, -8, 16,
    R`<p>$\dfrac{\cos ax-1}{x^2}\to-\dfrac{a^2}2$. So $\frac{a^2}2=8$ and $a^2=16$.</p>`, 'The sign of $a$ does not matter.'),
  LC(4, 'finding constants', R`If $\displaystyle\lim_{x\to0}\dfrac{e^{ax}-1-bx}{x^2}=8$ with $a>0$, find $a+b$.`, (x) => (exp(4 * x) - 1 - 4 * x) / (x * x), 0, 8, 8,
    R`<p>$e^{ax}-1-bx=(a-b)x+\frac{a^2}2x^2+\cdots$. For a finite limit, $b=a$. Then the limit is $\frac{a^2}2=8$, so $a=4$ and $b=4$. $a+b=8$.</p>`, 'Match the linear term first.'),
  LC(3, 'finding constants', R`If $\displaystyle\lim_{x\to0}(1+ax)^{3/x}=e^6$, find $a$.`, (x) => (1 + 2 * x) ** (3 / x), 0, E_ ** 6, 2,
    R`<p>The limit is $e^{3a}$. So $3a=6$ and $a=2$.</p>`, 'Remember which function dominates.'),

  // ================= L5 =================
  LM(5, 'series expansion', LQ(0, R`\dfrac{\cos x-e^{-x^2/2}}{x^4}`), (x) => (cos(x) - exp((-x * x) / 2)) / x ** 4, 0, -1 / 12, R`-\dfrac1{12}`, [R`\dfrac1{12}`, R`-\dfrac1{24}`, '0'],
    R`<p>$\cos x=1-\frac{x^2}2+\frac{x^4}{24}$ and $e^{-x^2/2}=1-\frac{x^2}2+\frac{x^4}8$. Difference $=\left(\frac1{24}-\frac18\right)x^4=-\frac{x^4}{12}$.</p>`, 'The $x^2$ terms cancel; compare the $x^4$ terms.'),
  LN(5, 'series expansion', LQ(0, R`\dfrac{(1+x)^{1/x}-e}{x}`), (x) => ((1 + x) ** (1 / x) - E_) / x, 0, -E_ / 2, R`<p>$(1+x)^{1/x}=e^{\ln(1+x)/x}=e^{1-\frac x2+\frac{x^2}3-\cdots}=e\left(1-\frac x2+\cdots\right)$. So the expression tends to $-\frac e2\approx-1.36$.</p>`, 'Expand the exponent $\\frac{\\ln(1+x)}x$ before exponentiating.'),
  LN(5, 'L\'Hopital', LQ(2, R`\dfrac{2^x-x^2}{x^x-4}`), (x) => (2 ** x - x * x) / (x ** x - 4), 2, (ln(2) - 1) / (1 + ln(2)), R`<p>Both vanish at $x=2$. L'Hopital: top derivative $2^x\ln2-2x\to4\ln2-4$; bottom derivative $x^x(1+\ln x)\to4(1+\ln2)$. Ratio $=\dfrac{\ln2-1}{1+\ln2}\approx-0.18$.</p>`, 'The derivative of $x^x$ is $x^x(1+\\ln x)$.'),
  LN(5, 'sequences', R`Find $\displaystyle\lim_{n\to\infty}\dfrac1n\left[(n+1)(n+2)\cdots(2n)\right]^{1/n}$.`, (n) => { let s = 0; for (let k = 1; k <= n; k++) s += ln(n + k); return exp(s / n) / n; }, Infinity, 4 / E_, R`<p>Take logs: $\ln L=\dfrac1n\sum_{k=1}^n\ln\left(1+\dfrac kn\right)\to\int_0^1\ln(1+x)\,dx=2\ln2-1$. So $L=e^{2\ln2-1}=\dfrac4e\approx1.47$.</p>`, 'Turn the product into a sum with a log, then into an integral.'),
  LN(5, 'sequences', R`Find $\displaystyle\lim_{n\to\infty}\dfrac{(n!)^{1/n}}n$.`, (n) => { let s = 0; for (let k = 1; k <= n; k++) s += ln(k); return exp(s / n) / n; }, Infinity, 1 / E_, R`<p>$\ln L=\dfrac1n\sum\ln\dfrac kn\to\int_0^1\ln x\,dx=-1$. So $L=\dfrac1e\approx0.37$.</p>`, 'Rewrite $\\frac{(n!)^{1/n}}n=\\left(\\prod\\frac kn\\right)^{1/n}$.'),
  LN(5, 'sums as integrals', R`Find $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\dfrac n{n^2+r^2}$.`, (n) => { let s = 0; for (let r = 1; r <= n; r++) s += n / (n * n + r * r); return s; }, Infinity, PI_ / 4, R`<p>$\dfrac n{n^2+r^2}=\dfrac1n\cdot\dfrac1{1+(r/n)^2}$. The sum tends to $\int_0^1\dfrac{dx}{1+x^2}=\dfrac\pi4\approx0.79$.</p>`, 'Pull out $\\frac1n$ so that it is a Riemann sum.'),
  LN(5, 'sums as integrals', R`Find $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\dfrac1{\sqrt{n^2+r^2}}$.`, (n) => { let s = 0; for (let r = 1; r <= n; r++) s += 1 / sqrt(n * n + r * r); return s; }, Infinity, ln(1 + sqrt(2)), R`<p>$\dfrac1{\sqrt{n^2+r^2}}=\dfrac1n\cdot\dfrac1{\sqrt{1+(r/n)^2}}$. Limit $=\int_0^1\dfrac{dx}{\sqrt{1+x^2}}=\ln\left(1+\sqrt2\right)\approx0.88$.</p>`, 'Standard integral $\\int\\frac{dx}{\\sqrt{1+x^2}}=\\ln\\left(x+\\sqrt{1+x^2}\\right)$.'),
  LN(5, 'sums as integrals', R`Find $\displaystyle\lim_{n\to\infty}\dfrac1n\sum_{r=1}^{n}\sin\dfrac{r\pi}n$.`, (n) => { let s = 0; for (let r = 1; r <= n; r++) s += sin((r * PI_) / n); return s / n; }, Infinity, 2 / PI_, R`<p>Limit $=\int_0^1\sin(\pi x)\,dx=\dfrac2\pi\approx0.64$.</p>`, 'Remember to integrate $\\sin\\pi x$, giving a factor $\\frac1\\pi$.'),
  LM(5, 'squeeze', R`$\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\dfrac r{n^2+r}$ equals`, (n) => { let s = 0; for (let r = 1; r <= n; r++) s += r / (n * n + r); return s; }, Infinity, 0.5, R`\dfrac12`, ['1', '0', R`\ln2`],
    R`<p>Each denominator lies between $n^2$ and $n^2+n$. So $\dfrac{n(n+1)/2}{n^2+n}\le S_n\le\dfrac{n(n+1)/2}{n^2}$. The left side is exactly $\frac12$ and the right side $\to\frac12$. Squeeze: $\frac12$.</p>`, 'Bound the denominator, then use the squeeze.'),
  LM(5, 'products', R`$\displaystyle\lim_{n\to\infty}\prod_{k=2}^{n}\left(1-\dfrac1{k^2}\right)$ equals`, (n) => { let p = 1; for (let k = 2; k <= n; k++) p *= 1 - 1 / (k * k); return p; }, Infinity, 0.5, R`\dfrac12`, ['0', '1', R`\dfrac14`],
    R`<p>$1-\frac1{k^2}=\frac{(k-1)(k+1)}{k^2}$. The product telescopes to $\dfrac{n+1}{2n}\to\dfrac12$.</p>`, 'Do not say "each factor $\\to1$ so the product $\\to1$".'),
  LN(5, 'L\'Hopital', LQ(R`0^+`, R`\dfrac{x^x-1}{x\ln x}`), (x) => (x ** x - 1) / (x * ln(x)), 0, 1, R`<p>$x^x-1=e^{x\ln x}-1\approx x\ln x$ since $x\ln x\to0$. Ratio $\to1$.</p>`, 'Put $t=x\\ln x\\to0$ and use $\\frac{e^t-1}t\\to1$.', 1),
  LN(5, 'limits at infinity', LQ(R`\infty`, R`\dfrac{x\left(x^{1/x}-1\right)}{\ln x}`), (x) => (x * (x ** (1 / x) - 1)) / ln(x), Infinity, 1, R`<p>$x^{1/x}=e^{\ln x/x}$ and $\frac{\ln x}x\to0$, so $x^{1/x}-1\approx\frac{\ln x}x$. Multiply by $x$ and divide by $\ln x$: the ratio $\to1$.</p>`, 'Use $e^t-1\\approx t$ for small $t$.'),
  LM(5, 'indeterminate forms', LQ(R`0^+`, R`\left(\dfrac1x\right)^{\sin x}`), (x) => (1 / x) ** sin(x), 0, 1, '1', ['0', e, inf],
    R`<p>$\ln\left(\frac1x\right)^{\sin x}=-\sin x\ln x=-x\ln x\cdot\dfrac{\sin x}x\to0$. Limit $e^0=1$.</p>`, '$\\infty^0$: take logs.', 1),
);

const groups = {
  m1: {
    title: 'Match: standard limits and their values',
    passage: R`<p>Match each limit in List I (as $x\to0$) with its value in List II.</p>`,
    list1: [R`A. $\displaystyle\lim\dfrac{e^{3x}-1}{x}$`, R`B. $\displaystyle\lim\dfrac{1-\cos x}{x^2}$`, R`C. $\displaystyle\lim(1+x)^{2/x}$`, R`D. $\displaystyle\lim\dfrac{\ln(1+4x)}{x}$`],
    list2: [R`p. $\dfrac12$`, R`q. $3$`, R`r. $e^2$`, R`s. $4$`],
  },
  m2: {
    title: 'Match: one-sided limits',
    passage: R`<p>Match each one-sided limit in List I with its value in List II. Here $[x]$ is the greatest integer and $\{x\}=x-[x]$.</p>`,
    list1: [R`A. $\displaystyle\lim_{x\to2^-}[x]$`, R`B. $\displaystyle\lim_{x\to2^+}[x]$`, R`C. $\displaystyle\lim_{x\to0^-}\dfrac{|x|}{x}$`, R`D. $\displaystyle\lim_{x\to3^+}\{x\}$`],
    list2: [R`p. $0$`, R`q. $1$`, R`r. $2$`, R`s. $-1$`],
  },
  m3: {
    title: 'Match: limits as x tends to infinity',
    passage: R`<p>Match each limit in List I (as $x\to\infty$) with its value in List II.</p>`,
    list1: [R`A. $\displaystyle\lim\dfrac{3x^2+1}{x^2+5}$`, R`B. $\displaystyle\lim\left(\sqrt{x^2+x}-x\right)$`, R`C. $\displaystyle\lim\left(1+\dfrac2x\right)^x$`, R`D. $\displaystyle\lim x\sin\dfrac1x$`],
    list2: [R`p. $1$`, R`q. $3$`, R`r. $\dfrac12$`, R`s. $e^2$`],
  },
  m4: {
    title: 'Match: series expansions',
    passage: R`<p>Match each limit in List I (as $x\to0$) with its value in List II.</p>`,
    list1: [R`A. $\displaystyle\lim\dfrac{x-\sin x}{x^3}$`, R`B. $\displaystyle\lim\dfrac{\tan x-x}{x^3}$`, R`C. $\displaystyle\lim\dfrac{e^x-1-x}{x^2}$`, R`D. $\displaystyle\lim\dfrac{\cos x-1+\frac{x^2}2}{x^4}$`],
    list2: [R`p. $\dfrac16$`, R`q. $\dfrac13$`, R`r. $\dfrac12$`, R`s. $\dfrac1{24}$`],
  },
  p1: {
    title: 'Passage: a limit that needs the right constant',
    passage: R`<p>Let $g(x)=\dfrac{\sin mx+a\sin x}{x^3}$ for $x\ne0$, where $m$ is a positive integer. Use $\sin t=t-\dfrac{t^3}6+\cdots$.</p>`,
  },
  p2: {
    title: 'Passage: a function with the greatest integer',
    passage: R`<p>Let $f(x)=x+[x]$, where $[x]$ is the greatest integer not exceeding $x$.</p>`,
  },
  p3: {
    title: 'Passage: sums of powers',
    passage: R`<p>For a positive integer $k$ let $T_k=\displaystyle\lim_{n\to\infty}\dfrac{1^k+2^k+\cdots+n^k}{n^{k+1}}$. Think of the sum as $\dfrac1n\sum\left(\dfrac rn\right)^k$.</p>`,
  },
  p4: {
    title: 'Passage: a one-to-infinity limit',
    passage: R`<p>Let $P(c)=\displaystyle\lim_{x\to0}(\cos cx)^{1/x^2}$ for a constant $c>0$. Take logarithms and use $\cos t=1-\dfrac{t^2}2+\cdots$.</p>`,
  },
};

items.push(
  // ================= assertion / reason =================
  A(2, 'standard limits', R`$\displaystyle\lim_{x\to0}\dfrac{\sin(x^\circ)}{x}=1$, where $x^\circ$ means $x$ degrees.`, R`$\displaystyle\lim_{t\to0}\dfrac{\sin t}t=1$ when $t$ is in radians.`, 3,
    R`<p>$x^\circ=\dfrac{\pi x}{180}$ radians, so $\dfrac{\sin(x^\circ)}x=\dfrac\pi{180}\cdot\dfrac{\sin(\pi x/180)}{\pi x/180}\to\dfrac\pi{180}$. So A is false. R is the true standard limit.</p>`, 'The standard limit needs radians.'),
  A(3, '$1^\\infty$ form', R`$\displaystyle\lim_{x\to\infty}\left(1+\dfrac1x\right)^x=e$.`, R`Every limit of the form $1^\infty$ equals $e$.`, 2,
    R`<p>A is the definition of $e$. R is false: $\lim(1+\frac2x)^x=e^2$ and $\lim\left(1+\frac1{x^2}\right)^x=1$ are both $1^\infty$ forms.</p>`, 'The value depends on excess times exponent.'),
  A(3, 'squeeze', R`$\displaystyle\lim_{x\to0}x\sin\dfrac1x=0$.`, R`$-1\le\sin\dfrac1x\le1$ for all $x\ne0$, so $|x\sin\frac1x|\le|x|$.`, 0,
    R`<p>R gives $|x\sin\frac1x|\le|x|\to0$, so by the squeeze theorem A holds. R is the correct reason.</p>`, 'The factor $x$ kills the oscillation.'),
  A(3, 'existence', R`$\displaystyle\lim_{x\to0}\sin\dfrac1x$ exists.`, R`$\sin\dfrac1x$ stays between $-1$ and $1$.`, 3,
    R`<p>Near 0, $\sin\frac1x$ keeps taking every value between $-1$ and $1$ infinitely often, so it has no limit. A is false. R is true but being bounded does not guarantee a limit.</p>`, 'Bounded does not mean convergent.'),
  A(3, 'modulus', R`$\displaystyle\lim_{x\to2}\dfrac{|x-2|}{x-2}$ does not exist.`, R`The left-hand limit is $-1$ and the right-hand limit is $+1$.`, 0,
    R`<p>R is true: for $x<2$ the ratio is $-1$, for $x>2$ it is $+1$. A limit exists only if the two one-sided limits are equal, so A holds because of R.</p>`, ''),
  A(3, 'algebra of limits', R`If $\displaystyle\lim_{x\to a}f(x)$ and $\displaystyle\lim_{x\to a}g(x)$ both fail to exist, then $\displaystyle\lim_{x\to a}\left(f(x)+g(x)\right)$ also fails to exist.`, R`The limit of a sum equals the sum of the limits whenever both limits exist.`, 3,
    R`<p>R is the sum rule and is true. A is false: take $f(x)=\sin\frac1x$ and $g(x)=-\sin\frac1x$ at $0$. Neither has a limit, but the sum is $0$.</p>`, 'The sum rule needs both limits to exist.'),
  A(4, 'limits at infinity', R`$\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+x}-x\right)=0$.`, R`$\infty-\infty$ is an indeterminate form, so its value must be found by rewriting (for example, rationalising).`, 3,
    R`<p>The limit is $\dfrac12$, not $0$ (conjugate gives $\frac{x}{\sqrt{x^2+x}+x}\to\frac12$). A is false. R is true.</p>`, 'Both terms are large, but their difference is not 0.'),
  A(4, 'series expansion', R`$\displaystyle\lim_{x\to0}\dfrac{\sin x-x}{x^3}=-\dfrac16$.`, R`$\sin x=x-\dfrac{x^3}{3!}+\dfrac{x^5}{5!}-\cdots$.`, 0,
    R`<p>From R, $\sin x-x=-\frac{x^3}6+\cdots$. Divide by $x^3$: $-\frac16$. So A is true and R explains it.</p>`, ''),
  A(3, 'greatest integer', R`$\displaystyle\lim_{x\to0}[x]$ does not exist.`, R`$[x]=-1$ just to the left of $0$ and $[x]=0$ for $0\le x<1$.`, 0,
    R`<p>Left limit $-1$, right limit $0$: they differ. R states exactly this. A is true because of R.</p>`, ''),
  A(4, 'L\'Hopital', R`Applying L'Hopital's rule to $\displaystyle\lim_{x\to\infty}\dfrac{x+\sin x}{x}$ shows that the limit is $1$.`, R`The expression has the form $\dfrac\infty\infty$.`, 3,
    R`<p>L'Hopital gives $\lim\dfrac{1+\cos x}1$, which does not exist, so the rule says nothing (it needs the limit of the derivative ratio to exist). The true limit is $1$ by dividing by $x$, but L'Hopital does not show it. A is false. R is true.</p>`, 'The rule is one-directional: it only works if the derivative ratio has a limit.'),

  // ================= statements =================
  S(2, 'infinite limits', R`$\displaystyle\lim_{x\to0^+}\dfrac1x=\infty$.`, R`$\displaystyle\lim_{x\to0}\dfrac1{x^2}=\infty$.`, 0,
    R`<p>Both true. $\frac1x$ is large and positive just right of 0. $\frac1{x^2}$ is large and positive on both sides.</p>`, '$\\frac1x$ alone has different one-sided behaviour.'),
  S(3, 'modulus', R`$\displaystyle\lim_{x\to0}\dfrac{\sin x}{|x|}=1$.`, R`$\displaystyle\lim_{x\to0^-}\dfrac{\sin x}{|x|}=-1$.`, 2,
    R`<p>For $x<0$, $|x|=-x$, so $\frac{\sin x}{|x|}=-\frac{\sin x}x\to-1$. For $x>0$ it tends to $1$. So the two-sided limit does not exist: I is false, II is true.</p>`, ''),
  S(3, 'limits at infinity', R`$\displaystyle\lim_{x\to\infty}\sin x$ exists.`, R`$\displaystyle\lim_{x\to\infty}\dfrac{\sin x}{x}=0$.`, 2,
    R`<p>$\sin x$ oscillates between $-1$ and $1$ forever, so it has no limit. I is false. II is true by squeeze.</p>`, ''),
  S(4, '$1^\\infty$ form', R`$\displaystyle\lim_{x\to0}(1+x)^{1/x}=\lim_{x\to\infty}\left(1+\dfrac1x\right)^x$.`, R`Both limits equal $e$.`, 0,
    R`<p>Put $t=\frac1x$: one becomes the other. Both equal $e$. Both true.</p>`, ''),
  S(4, 'indeterminate forms', R`$\displaystyle\lim_{x\to0^+}x^x=0$.`, R`$\displaystyle\lim_{x\to0^+}x\ln x=0$.`, 2,
    R`<p>$x^x=e^{x\ln x}$. Since $x\ln x\to0$ (II is true), $x^x\to e^0=1$, not $0$. I is false.</p>`, '$0^0$ is not 0.'),
  S(3, 'definition', R`If $\displaystyle\lim_{x\to a}f(x)$ exists, then $f$ must be defined at $a$.`, R`If $\displaystyle\lim_{x\to a}f(x)=f(a)$, then $f$ is continuous at $a$.`, 2,
    R`<p>The limit looks only at values near $a$, not at $a$ itself: e.g. $\frac{x^2-1}{x-1}$ has a limit at $1$ but is not defined there. I is false. II is the definition of continuity: true.</p>`, 'A limit does not need the function to be defined at the point.'),
  S(4, 'greatest integer', R`$\displaystyle\lim_{x\to a}\left([x]+[-x]\right)=-1$ for every real $a$.`, R`$[x]+[-x]=-1$ for every non-integer $x$ and $0$ for every integer $x$.`, 0,
    R`<p>II is true. Near any $a$ (even an integer), the points $x\ne a$ nearby are non-integers, so the sum is $-1$. The limit is $-1$ at every $a$. I is true.</p>`, 'The limit ignores $x=a$ itself.'),
  SC(3, 'standard limits', [R`$\displaystyle\lim_{x\to0}\dfrac{\sin x}x=1$`, R`$\displaystyle\lim_{x\to0}\dfrac{\tan x}x=1$`, R`$\displaystyle\lim_{x\to0}\dfrac{1-\cos x}x=0$`, R`$\displaystyle\lim_{x\to0}\dfrac{e^x-1}x=e$`], '3', ['1', '2', '4'],
    R`<p>(a) true. (b) true. (c) $\frac{1-\cos x}x=\frac{1-\cos x}{x^2}\cdot x\to\frac12\cdot0=0$, true. (d) false: the limit is $1$. Three are correct.</p>`, 'Do not confuse $\\frac{e^x-1}x\\to1$ with $e$.'),
  SC(4, 'squeeze', [R`$\displaystyle\lim_{x\to0}x^2\sin\dfrac1x=0$`, R`$\displaystyle\lim_{x\to0}\sin\dfrac1x=0$`, R`$\displaystyle\lim_{x\to\infty}x\sin\dfrac1x=1$`, R`$\displaystyle\lim_{x\to\infty}\dfrac{\sin x}x=1$`], '2', ['1', '3', '4'],
    R`<p>(a) true by squeeze. (b) false: no limit. (c) true: $\frac{\sin t}t$ with $t=\frac1x$. (d) false: the limit is $0$. Two are correct.</p>`, ''),
  SC(4, '$1^\\infty$ form', [R`$\displaystyle\lim_{x\to0}(1+2x)^{1/x}=e^2$`, R`$\displaystyle\lim_{x\to\infty}\left(1+\dfrac1x\right)^{2x}=e^2$`, R`$\displaystyle\lim_{x\to0}\left(1+x^2\right)^{1/x}=e$`, R`$\displaystyle\lim_{x\to\infty}\left(1+\dfrac1{x^2}\right)^{x}=1$`], '3', ['1', '2', '4'],
    R`<p>(a) true. (b) true. (c) false: excess times exponent is $\frac{x^2}x=x\to0$, so the limit is $1$. (d) true: $\frac1{x^2}\cdot x\to0$. Three are correct.</p>`, 'Compute excess times exponent.'),
  SC(3, 'one-sided limits', [R`$\displaystyle\lim_{x\to1^+}[x]=1$`, R`$\displaystyle\lim_{x\to1^-}[x]=1$`, R`$\displaystyle\lim_{x\to0^-}\dfrac{|x|}x=-1$`, R`$\displaystyle\lim_{x\to2}\dfrac{|x-2|}{x-2}=1$`], '2', ['1', '3', '4'],
    R`<p>(a) true. (b) false: $[x]=0$ left of 1. (c) true. (d) false: no limit (sides are $-1$ and $1$). Two are correct.</p>`, ''),

  // ================= multi =================
  X(3, 'standard limits', R`Which of the following limits equal $1$?`, [R`$\displaystyle\lim_{x\to0}\dfrac{\tan x}x$`, R`$\displaystyle\lim_{x\to0}\dfrac{e^x-1}x$`, R`$\displaystyle\lim_{x\to0}\dfrac{1-\cos x}{x^2}$`, R`$\displaystyle\lim_{x\to\infty}\left(1+\dfrac1x\right)^x$`], [0, 1],
    R`<p>(a) $1$. (b) $1$. (c) $\frac12$. (d) $e$. So (a) and (b).</p>`, ''),
  X(4, 'existence', R`Which of the following limits do NOT exist (neither finite nor infinite)?`, [R`$\displaystyle\lim_{x\to0}\sin\dfrac1x$`, R`$\displaystyle\lim_{x\to0}x\sin\dfrac1x$`, R`$\displaystyle\lim_{x\to0}\dfrac{x}{|x|}$`, R`$\displaystyle\lim_{x\to\infty}\cos x$`], [0, 2, 3],
    R`<p>(a) oscillates: no limit. (b) $0$ by squeeze: exists. (c) $-1$ from the left, $+1$ from the right: no limit. (d) oscillates: no limit. So (a), (c), (d).</p>`, 'Bounded oscillation without a damping factor has no limit.'),
  X(4, '$1^\\infty$ form', R`Which of the following limits equal $e^2$?`, [R`$\displaystyle\lim_{x\to0}(1+2x)^{1/x}$`, R`$\displaystyle\lim_{x\to\infty}\left(1+\dfrac2x\right)^x$`, R`$\displaystyle\lim_{x\to0}(1+x)^{2/x}$`, R`$\displaystyle\lim_{x\to0}\left(1+x^2\right)^{2/x}$`], [0, 1, 2],
    R`<p>(a) $e^{2}$. (b) $e^2$. (c) $\left[(1+x)^{1/x}\right]^2\to e^2$. (d) excess times exponent $=\frac{2x^2}x=2x\to0$, so the limit is $1$. Answer (a), (b), (c).</p>`, ''),
  X(4, 'greatest integer', R`Let $f(x)=[x]+[-x]$. Which of the following are true?`, [R`$\displaystyle\lim_{x\to2}f(x)=-1$`, R`$f(2)=0$`, R`$\displaystyle\lim_{x\to2}f(x)$ exists`, R`$\displaystyle\lim_{x\to2}f(x)=f(2)$`], [0, 1, 2],
    R`<p>For non-integer $x$: $[x]+[-x]=-1$. At $x=2$: $2+(-2)=0$. The limit is $-1$ (exists), $f(2)=0$, so the limit is not $f(2)$. True: (a), (b), (c).</p>`, 'The value at the point is different from the limit.'),
  X(4, 'zero limits', R`Which of the following limits equal $0$?`, [R`$\displaystyle\lim_{x\to0}x^2\sin\dfrac1x$`, R`$\displaystyle\lim_{x\to\infty}xe^{-x}$`, R`$\displaystyle\lim_{x\to\infty}x^{1/x}$`, R`$\displaystyle\lim_{x\to0^+}x\ln x$`], [0, 1, 3],
    R`<p>(a) $0$ (squeeze). (b) $\frac x{e^x}\to0$. (c) $1$. (d) $0$. So (a), (b), (d).</p>`, ''),
  X(5, 'series expansion', R`Which of the following are correct?`, [R`$\displaystyle\lim_{x\to0}\dfrac{x-\sin x}{x^3}=\dfrac16$`, R`$\displaystyle\lim_{x\to0}\dfrac{\tan x-x}{x^3}=\dfrac13$`, R`$\displaystyle\lim_{x\to0}\dfrac{\cos x-1}{x^2}=\dfrac12$`, R`$\displaystyle\lim_{x\to0}\dfrac{e^x-1-x}{x^2}=\dfrac12$`], [0, 1, 3],
    R`<p>(a) true. (b) true. (c) false: it is $-\frac12$. (d) true. So (a), (b), (d).</p>`, 'Check the sign of the cosine expansion.'),
  X(4, 'bounded functions', R`Let $f(x)=\dfrac{\sin x}x$ for $x\ne0$. Which statements are true?`, [R`$\displaystyle\lim_{x\to0}f(x)=1$`, R`$\displaystyle\lim_{x\to\infty}f(x)=0$`, R`$|f(x)|\le1$ for all $x\ne0$`, R`$\displaystyle\lim_{x\to0}f(2x)=2$`], [0, 1, 2],
    R`<p>(a), (b) true. (c) $|\sin x|\le|x|$ so true. (d) $f(2x)=\frac{\sin2x}{2x}\to1$, not 2. Answer (a), (b), (c).</p>`, ''),
  X(5, 'limits at infinity', R`Which of the following limits equal $\dfrac12$?`, [R`$\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+x}-x\right)$`, R`$\displaystyle\lim_{x\to\infty}x\left(\sqrt{x^2+1}-x\right)$`, R`$\displaystyle\lim_{x\to0}\dfrac{1-\cos x}{x^2}$`, R`$\displaystyle\lim_{x\to0}\dfrac{1-\cos2x}{x^2}$`], [0, 1, 2],
    R`<p>(a) $\frac12$. (b) $\frac12$. (c) $\frac12$. (d) $\frac{4}{2}=2$. So (a), (b), (c).</p>`, ''),

  // ================= match =================
  MT(3, 'standard limits', 'm1', R`Choose the correct matching.`, 'A-q, B-p, C-r, D-s', ['A-s, B-p, C-r, D-q', 'A-q, B-r, C-p, D-s', 'A-p, B-q, C-s, D-r'],
    R`<p>A: $\frac{e^{3x}-1}x\to3$ (q). B: $\frac12$ (p). C: $e^2$ (r). D: $\frac{\ln(1+4x)}x\to4$ (s).</p>`, 'Keep the coefficients.'),
  MT(3, 'one-sided limits', 'm2', R`Choose the correct matching.`, 'A-q, B-r, C-s, D-p', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-p, B-r, C-s, D-q'],
    R`<p>A: just left of 2, $[x]=1$ (q). B: $2$ (r). C: $-1$ (s). D: right of 3, $\{x\}=x-3\to0$ (p).</p>`, ''),
  MT(3, 'limits at infinity', 'm3', R`Choose the correct matching.`, 'A-q, B-r, C-s, D-p', ['A-q, B-p, C-s, D-r', 'A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s'],
    R`<p>A: $3$ (q). B: $\frac12$ (r). C: $e^2$ (s). D: $1$ (p).</p>`, ''),
  MT(4, 'series expansion', 'm4', R`Choose the correct matching.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>A: $\frac16$ (p). B: $\frac13$ (q). C: $\frac12$ (r). D: $\frac1{24}$ (s).</p>`, 'Match the factorial to the term.'),

  // ================= passages =================
  PI(4, 'finding constants', 'p1', R`For $m=2$, find the value of $a$ for which $\displaystyle\lim_{x\to0}g(x)$ is finite.`, -2,
    R`<p>$\sin2x+a\sin x=(2+a)x-\dfrac{8+a}6x^3+\cdots$. The $x$ term must vanish: $a=-2$.</p>`, ''),
  PI(4, 'finding constants', 'p1', R`For $m=2$ and that value of $a$, find $\displaystyle\lim_{x\to0}g(x)$.`, -1,
    R`<p>With $a=-2$: $-\dfrac{8-2}6=-1$.</p>`, 'Put $a=-2$ into the cubic coefficient.'),
  PI(4, 'finding constants', 'p1', R`For $m=3$ (with the suitable $a$), find $\displaystyle\lim_{x\to0}g(x)$.`, -4,
    R`<p>$a=-3$. Cubic coefficient: $-\dfrac{27+a}6=-\dfrac{27-3}6=-4$. (Check with $\frac{m-m^3}6=\frac{3-27}6=-4$.)</p>`, 'The cubic term of $\\sin3x$ is $-\\frac{27x^3}6$.'),
  PI(2, 'greatest integer', 'p2', R`Find $\displaystyle\lim_{x\to2^-}f(x)$.`, 3,
    R`<p>Just left of $2$: $x\to2$ and $[x]=1$. So $2+1=3$.</p>`, ''),
  PI(2, 'greatest integer', 'p2', R`Find $\displaystyle\lim_{x\to2^+}f(x)$.`, 4,
    R`<p>Right of $2$: $[x]=2$, so $2+2=4$.</p>`, ''),
  PI(3, 'greatest integer', 'p2', R`Find the jump $\displaystyle\lim_{x\to3^+}f(x)-\lim_{x\to3^-}f(x)$.`, 1,
    R`<p>Right: $3+3=6$. Left: $3+2=5$. Jump $=6-5=1$. (Also $[x]$ jumps by $1$ at each integer while $x$ itself is continuous.)</p>`, ''),
  PN(3, 'sums as limits', 'p3', R`Find $T_1$ (2 decimal places).`, 0.5, 0.01,
    R`<p>$1+2+\cdots+n=\frac{n(n+1)}2$. So $T_1=\lim\frac{n(n+1)}{2n^2}=\frac12$. Or $\int_0^1x\,dx=\frac12$.</p>`, ''),
  PN(3, 'sums as limits', 'p3', R`Find $T_2$ (2 decimal places).`, 0.3333, 0.01,
    R`<p>$T_2=\int_0^1x^2\,dx=\frac13\approx0.33$.</p>`, ''),
  PN(3, 'sums as limits', 'p3', R`Find $T_k$ for $k=4$ (2 decimal places).`, 0.2, 0.01,
    R`<p>$T_k=\int_0^1x^k\,dx=\dfrac1{k+1}$. For $k=4$: $\frac15=0.20$.</p>`, 'Divide by $k+1$, not $k$.'),
  PN(4, '$1^\\infty$ form', 'p4', R`Find $\ln P(2)$.`, -2, 0.01,
    R`<p>$\ln P=\lim\dfrac{\ln\cos cx}{x^2}=\lim\dfrac{-c^2x^2/2}{x^2}=-\dfrac{c^2}2$. For $c=2$: $-2$.</p>`, ''),
  PN(4, '$1^\\infty$ form', 'p4', R`Find $P(2)$ (2 decimal places).`, 0.1353, 0.01,
    R`<p>$P(2)=e^{-2}\approx0.1353$.</p>`, ''),
  PN(4, '$1^\\infty$ form', 'p4', R`Find $\ln P(3)$.`, -4.5, 0.01,
    R`<p>$-\dfrac{c^2}2=-\dfrac92=-4.5$.</p>`, 'The coefficient is squared.'),
);

items.push(
  // ---- extra L1 ----
  LI(1, 'factorising', LQ(0, R`\dfrac{x^2+4x}{x}`), (x) => (x * x + 4 * x) / x, 0, 4, R`<p>Cancel $x$: $\dfrac{x(x+4)}x=x+4\to4$.</p>`, 'Factor out $x$ before substituting.'),
  LM(1, 'limits at infinity', LQ(R`\infty`, R`\dfrac5x`), (x) => 5 / x, Infinity, 0, '0', ['5', inf, '1'],
    R`<p>A fixed number divided by a huge number is tiny: $\frac5x\to0$.</p>`, ''),
  LI(1, 'standard limits', LQ(2, R`\dfrac{x^3-8}{x-2}`), (x) => (x ** 3 - 8) / (x - 2), 2, 12, R`<p>$\lim\dfrac{x^n-a^n}{x-a}=na^{n-1}=3\cdot2^2=12$.</p>`, 'Square the 2, do not multiply 3 by 8.'),
  LM(1, 'standard limits', LQ(0, R`\dfrac{\sin x}{3x}`), (x) => sin(x) / (3 * x), 0, 1 / 3, R`\dfrac13`, ['3', '1', '0'],
    R`<p>$\dfrac13\cdot\dfrac{\sin x}x\to\dfrac13$.</p>`, ''),
  LI(1, 'direct substitution', LQ(1, R`(x^2+3x+2)`), (x) => x * x + 3 * x + 2, 1, 6, R`<p>Polynomial: substitute $x=1$: $1+3+2=6$.</p>`, ''),
  LM(1, 'standard limits', LQ(0, R`\dfrac{e^{2x}-1}{x}`), (x) => (exp(2 * x) - 1) / x, 0, 2, '2', ['1', e, R`\dfrac12`],
    R`<p>$\dfrac{e^{2x}-1}{2x}\cdot2\to1\cdot2=2$.</p>`, ''),
  LI(1, 'limits at infinity', LQ(R`\infty`, R`\dfrac{4x^2+1}{x^2+3}`), (x) => (4 * x * x + 1) / (x * x + 3), Infinity, 4, R`<p>Equal degrees: ratio of leading coefficients $\frac41=4$.</p>`, ''),
  LI(1, 'factorising', LQ(4, R`\dfrac{x^2-16}{x-4}`), (x) => (x * x - 16) / (x - 4), 4, 8, R`<p>$\dfrac{(x-4)(x+4)}{x-4}=x+4\to8$.</p>`, ''),
  LM(1, 'standard limits', LQ(0, R`\dfrac{\ln(1+3x)}{x}`), (x) => ln(1 + 3 * x) / x, 0, 3, '3', ['1', R`\ln3`, R`\dfrac13`],
    R`<p>$\dfrac{\ln(1+3x)}{3x}\cdot3\to3$.</p>`, 'The answer is $3$, not $\\ln3$.'),
  LI(1, 'modulus', LQ(R`0^+`, R`\dfrac{|x|}x`), (x) => abs(x) / x, 0, 1, R`<p>For $x>0$, $|x|=x$, so the ratio is $1$.</p>`, '', 1),

  // ---- extra L2 ----
  LI(2, 'standard limits', LQ(3, R`\dfrac{x^3-27}{x-3}`), (x) => (x ** 3 - 27) / (x - 3), 3, 27, R`<p>$3\cdot3^2=27$.</p>`, ''),
  LM(2, 'standard limits', LQ(0, R`\dfrac{\sin^2x}{x^2}`), (x) => sin(x) ** 2 / (x * x), 0, 1, '1', ['0', R`\dfrac12`, '2'],
    R`<p>$\left(\dfrac{\sin x}x\right)^2\to1^2=1$.</p>`, ''),
  LI(2, 'limits at infinity', LQ(R`\infty`, R`\dfrac{2x^3+x}{x^3+5}`), (x) => (2 * x ** 3 + x) / (x ** 3 + 5), Infinity, 2, R`<p>Divide by $x^3$: $\dfrac{2+1/x^2}{1+5/x^3}\to2$.</p>`, ''),
  LI(2, 'standard limits', LQ(0, R`\dfrac{1-\cos2x}{x\sin x}`), (x) => (1 - cos(2 * x)) / (x * sin(x)), 0, 2, R`<p>$1-\cos2x=2\sin^2x$. So the fraction is $\dfrac{2\sin^2x}{x\sin x}=2\dfrac{\sin x}x\to2$.</p>`, ''),
  LM(2, 'rationalising', LQ(1, R`\dfrac{\sqrt x-1}{x-1}`), (x) => (sqrt(x) - 1) / (x - 1), 1, 0.5, R`\dfrac12`, ['1', '2', '0'],
    R`<p>$\dfrac1{\sqrt x+1}\to\dfrac12$.</p>`, ''),
  LM(2, 'standard limits', LQ(0, R`\dfrac{\tan3x}{\sin2x}`), (x) => tan(3 * x) / sin(2 * x), 0, 1.5, R`\dfrac32`, [R`\dfrac23`, '6', '1'],
    R`<p>$\dfrac{\tan3x}{3x}\cdot\dfrac{2x}{\sin2x}\cdot\dfrac32\to\dfrac32$.</p>`, ''),
  LI(2, 'standard limits', LQ(0, R`\dfrac{e^{3x}-e^{x}}{x}`), (x) => (exp(3 * x) - exp(x)) / x, 0, 2, R`<p>$\dfrac{e^{3x}-1}x-\dfrac{e^x-1}x\to3-1=2$.</p>`, ''),
  LM(2, '$1^\\infty$ form', LQ(R`\infty`, R`\left(1+\dfrac1{2x}\right)^x`), (x) => (1 + 1 / (2 * x)) ** x, Infinity, exp(0.5), R`\sqrt e`, [e, R`e^2`, '1'],
    R`<p>Excess times exponent: $\frac1{2x}\cdot x=\frac12$. Limit $e^{1/2}=\sqrt e$.</p>`, ''),

  // ---- extra L4 ----
  LM(4, 'series expansion', LQ(0, R`\dfrac{e^x\sin x-x-x^2}{x^3}`), (x) => (exp(x) * sin(x) - x - x * x) / x ** 3, 0, 1 / 3, R`\dfrac13`, [R`\dfrac12`, R`\dfrac16`, '1'],
    R`<p>$e^x\sin x=\left(1+x+\frac{x^2}2\right)\left(x-\frac{x^3}6\right)=x+x^2+\left(\frac12-\frac16\right)x^3+\cdots=x+x^2+\frac{x^3}3$. Limit $\frac13$.</p>`, 'Multiply the series and collect the $x^3$ terms.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{x-\frac{x^2}2-\ln(1+x)}{x^3}`), (x) => (x - (x * x) / 2 - ln(1 + x)) / x ** 3, 0, -1 / 3, R`-\dfrac13`, [R`\dfrac13`, R`-\dfrac12`, '0'],
    R`<p>$\ln(1+x)=x-\frac{x^2}2+\frac{x^3}3-\cdots$. So the numerator is $-\frac{x^3}3$.</p>`, 'Sign: we subtract the log.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{\cosh x-\cos x}{x^2}`).replace('\\cosh x', '\\dfrac{e^x+e^{-x}}2'), (x) => ((exp(x) + exp(-x)) / 2 - cos(x)) / (x * x), 0, 1, '1', ['0', R`\dfrac12`, '2'],
    R`<p>$\frac{e^x+e^{-x}}2=1+\frac{x^2}2+\cdots$ and $\cos x=1-\frac{x^2}2+\cdots$. Difference $=x^2$. Limit $1$.</p>`, 'The $\\frac{x^2}2$ terms add, not cancel.'),
  LM(4, 'series expansion', LQ(0, R`\dfrac{\frac{e^x-e^{-x}}2-\sin x}{x^3}`), (x) => ((exp(x) - exp(-x)) / 2 - sin(x)) / x ** 3, 0, 1 / 3, R`\dfrac13`, [R`\dfrac16`, R`\dfrac12`, '0'],
    R`<p>$\frac{e^x-e^{-x}}2=x+\frac{x^3}6+\cdots$ and $\sin x=x-\frac{x^3}6+\cdots$. Difference $\frac{x^3}3$.</p>`, ''),
  LM(4, 'combining fractions', LQ(0, R`\left(\dfrac1{x\sin x}-\dfrac1{x\tan x}\right)`), (x) => 1 / (x * sin(x)) - 1 / (x * tan(x)), 0, 0.5, R`\dfrac12`, ['1', '0', R`\dfrac13`],
    R`<p>$\dfrac{1-\cos x}{x\sin x}\approx\dfrac{x^2/2}{x\cdot x}=\dfrac12$.</p>`, ''),
  LM(4, 'sequences', R`$\displaystyle\lim_{n\to\infty}n^2\ln\cos\dfrac1n$ equals`, (n) => n * n * ln(cos(1 / n)), Infinity, -0.5, R`-\dfrac12`, [R`\dfrac12`, '0', '-1'],
    R`<p>With $t=\frac1n$: $\dfrac{\ln\cos t}{t^2}\to-\dfrac12$.</p>`, ''),

  // ---- extra L5 ----
  LM(5, 'series expansion', LQ(0, R`\dfrac{\tan x-\sin x-\frac{x^3}2}{x^5}`), (x) => (tan(x) - sin(x) - (x ** 3) / 2) / x ** 5, 0, 1 / 8, R`\dfrac18`, [R`\dfrac1{16}`, R`\dfrac3{8}`, R`\dfrac1{24}`],
    R`<p>$\tan x=x+\frac{x^3}3+\frac{2x^5}{15}$ and $\sin x=x-\frac{x^3}6+\frac{x^5}{120}$. $\tan x-\sin x=\frac{x^3}2+\left(\frac2{15}-\frac1{120}\right)x^5=\frac{x^3}2+\frac{x^5}8$. Limit $\frac18$.</p>`, 'You need the $x^5$ terms of both series.'),
  LM(5, 'limits at infinity', LQ(R`\infty`, R`x^2\left(1-x\sin\dfrac1x\right)`), (x) => x * x * (1 - x * sin(1 / x)), Infinity, 1 / 6, R`\dfrac16`, [R`\dfrac12`, '0', '1'],
    R`<p>$x\sin\frac1x=1-\frac1{6x^2}+\cdots$, so $1-x\sin\frac1x\approx\frac1{6x^2}$. Times $x^2$: $\frac16$.</p>`, 'Put $t=\\frac1x$: $\\frac{1-\\frac{\\sin t}t}{t^2}$.'),
  LM(5, 'L\'Hopital', LQ(1, R`\dfrac{x^x-x}{\ln x-x+1}`), (x) => (x ** x - x) / (ln(x) - x + 1), 1, -2, '-2', ['2', '-1', '0'],
    R`<p>At $x=1$ both vanish. First derivatives: top $x^x(1+\ln x)-1\to0$; bottom $\frac1x-1\to0$. Second derivatives: top $x^x\left[(1+\ln x)^2+\frac1x\right]\to2$; bottom $-\frac1{x^2}\to-1$. Ratio $-2$.</p>`, 'L\'Hopital needs to be applied twice.'),
  LM(5, 'series expansion', LQ(0, R`\dfrac{\cos(\sin x)-\cos x}{x^4}`), (x) => (cos(sin(x)) - cos(x)) / x ** 4, 0, 1 / 6, R`\dfrac16`, [R`\dfrac1{12}`, R`\dfrac1{24}`, '0'],
    R`<p>$\sin^2x=x^2-\frac{x^4}3$, so $\cos(\sin x)=1-\frac{\sin^2x}2+\frac{\sin^4x}{24}=1-\frac{x^2}2+\frac{x^4}6+\frac{x^4}{24}$. And $\cos x=1-\frac{x^2}2+\frac{x^4}{24}$. Difference $\frac{x^4}6$.</p>`, 'The inner $\\sin x$ has a cubic term that matters at order $x^4$.'),
  LM(5, 'L\'Hopital', LQ(R`\infty`, R`x\left(\left(1+\dfrac1x\right)^x-e\right)`), (x) => x * ((1 + 1 / x) ** x - E_), Infinity, -E_ / 2, R`-\dfrac e2`, [R`\dfrac e2`, '0', R`-e`],
    R`<p>$\left(1+\frac1x\right)^x=e^{x\ln(1+1/x)}=e^{1-\frac1{2x}+\cdots}=e\left(1-\frac1{2x}+\cdots\right)$. So $x\left((1+\frac1x)^x-e\right)\to-\frac e2$.</p>`, 'Do not say $e-e=0$.'),
  LM(5, 'series expansion', LQ(0, R`\dfrac{\ln(1+\sin x)-\ln(1+x)}{x^3}`), (x) => (ln(1 + sin(x)) - ln(1 + x)) / x ** 3, 0, -1 / 6, R`-\dfrac16`, [R`\dfrac16`, R`-\dfrac13`, '0'],
    R`<p>$\ln(1+\sin x)-\ln(1+x)=\ln\dfrac{1+\sin x}{1+x}$. Using $\sin x=x-\frac{x^3}6$: $\dfrac{1+\sin x}{1+x}=1-\dfrac{x^3/6}{1+x}\approx1-\frac{x^3}6$. So the log is $-\frac{x^3}6$ and the limit is $-\frac16$.</p>`, 'Combine the logs first.'),
);

// ================= templates =================
const OP = (rng, c, ws) => shuffleOpts(rng, W(c), ws.map(W));
const near = (v, exp) => Math.abs(v - exp) <= 4e-3 * Math.max(1, Math.abs(exp));
const idx = (p, v, exp, correct) => (near(v, exp) ? p.options.indexOf(W(correct)) : -1);
const cs = (k) => (k === 1 ? '\\cos x' : `\\cos${k}x`);
const sumTo = (n, g) => { let s = 0; for (let r = 1; r <= n; r++) s += g(r, n); return s; };

const gens = [
  // g01 (L1): x^n - a^n type
  gen('li-g01', 1, 'nat', 'integer', 'factorising', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) {
      const n = choose(rng, [2, 3, 4]), a = int(rng, 1, 3), answer = n * a ** (n - 1);
      return { kind, n, a, answer, tol: 0, q: LQ(a, R`\dfrac{x^${n}-${a ** n}}{x-${a}}`),
        sol: R`<p>$\lim_{x\to a}\dfrac{x^n-a^n}{x-a}=na^{n-1}$. Here $n=${n}$, $a=${a}$: $${n}\cdot${a}^{${n - 1}}=${answer}$.</p>` };
    }
    if (kind === 1) {
      const b = int(rng, 1, 5), a = b + int(rng, 1, 6), answer = a - b;
      return { kind, a, b, answer, tol: 0, q: LQ(a, R`\dfrac{x^2-${a + b}x+${a * b}}{x-${a}}`),
        sol: R`<p>$x^2-${a + b}x+${a * b}=(x-${a})(x-${b})$. Cancel $x-${a}$: the limit of $x-${b}$ is $${a}-${b}=${answer}$.</p>` };
    }
    const a = choose(rng, [2, 4, 6]), answer = (3 * a) / 2;
    return { kind, a, answer, tol: 0, q: LQ(a, R`\dfrac{x^3-${a ** 3}}{x^2-${a * a}}`),
      sol: R`<p>Divide top and bottom by $x-${a}$: the top gives $3a^2=${3 * a * a}$ and the bottom $2a=${2 * a}$. The ratio is $${answer}$.</p>` };
  }, (p) => {
    const f = p.kind === 0 ? (x) => (x ** p.n - p.a ** p.n) / (x - p.a) : p.kind === 1 ? (x) => (x * x - (p.a + p.b) * x + p.a * p.b) / (x - p.a) : (x) => (x ** 3 - p.a ** 3) / (x * x - p.a * p.a);
    return Math.round(NL(f, p.a));
  }),

  // g02 (L1): coefficient ratio
  gen('li-g02', 1, 'nat', 'integer', 'standard limits', (rng) => {
    const kind = int(rng, 0, 3), q0 = int(rng, 2, 5), k = int(rng, 2, 6), pp = k * q0;
    const t = [R`\dfrac{\sin ${pp}x}{${q0}x}`, R`\dfrac{\tan ${pp}x}{${q0}x}`, R`\dfrac{e^{${pp}x}-1}{${q0}x}`, R`\dfrac{\ln(1+${pp}x)}{${q0}x}`][kind];
    const std = [R`\dfrac{\sin t}t\to1`, R`\dfrac{\tan t}t\to1`, R`\dfrac{e^t-1}t\to1`, R`\dfrac{\ln(1+t)}t\to1`][kind];
    return { kind, q0, k, pp, answer: k, tol: 0, q: LQ(0, t),
      sol: R`<p>Write the top in terms of $t=${pp}x$: with $${std}$, the expression tends to $\dfrac{${pp}}{${q0}}=${k}$.</p>` };
  }, (p) => {
    const f = [(x) => sin(p.pp * x) / (p.q0 * x), (x) => tan(p.pp * x) / (p.q0 * x), (x) => (exp(p.pp * x) - 1) / (p.q0 * x), (x) => ln(1 + p.pp * x) / (p.q0 * x)][p.kind];
    return Math.round(NL(f, 0));
  }),

  // g03 (L2): ratio of sines / tangents
  gen('li-g03', 2, 'mcq', 'single', 'standard limits', (rng) => {
    let a, b; do { a = int(rng, 2, 9); b = int(rng, 2, 9); } while (a === b);
    const kind = int(rng, 0, 2);
    const t = [R`\dfrac{\sin${a}x}{\sin${b}x}`, R`\dfrac{\tan${a}x}{\tan${b}x}`, R`\dfrac{\sin${a}x}{\tan${b}x}`][kind];
    const { options, answer } = OP(rng, frac(a, b), [frac(b, a), `${a * b}`, `${Math.abs(a - b)}`]);
    return { kind, a, b, options, answer, q: LQ(0, t),
      sol: R`<p>Each function behaves like its angle for small $x$: $\sin ${a}x\approx${a}x$, $\sin${b}x\approx${b}x$ (and the same for tan). The ratio tends to $\dfrac{${a}}{${b}}${gcd(a, b) > 1 ? R`=${frac(a, b)}` : ''}$.</p>` };
  }, (p) => {
    const f = [(x) => sin(p.a * x) / sin(p.b * x), (x) => tan(p.a * x) / tan(p.b * x), (x) => sin(p.a * x) / tan(p.b * x)][p.kind];
    return idx(p, NL(f, 0), p.a / p.b, frac(p.a, p.b));
  }),

  // g04 (L2): numeric, exponential and log forms
  gen('li-g04', 2, 'nat', 'numeric', 'standard limits', (rng) => {
    const kind = int(rng, 0, 2);
    let a, b, c, ans, t, s;
    if (kind === 0) { a = int(rng, 2, 9); b = int(rng, 2, 7); ans = a / b; t = R`\dfrac{e^{${a}x}-1}{${b}x}`; s = R`\dfrac{e^{${a}x}-1}{${a}x}\cdot\dfrac{${a}}{${b}}\to\dfrac{${a}}{${b}}`; }
    else if (kind === 1) { a = int(rng, 2, 9); b = int(rng, 2, 7); ans = a / b; t = R`\dfrac{\ln(1+${a}x)}{${b}x}`; s = R`\dfrac{\ln(1+${a}x)}{${a}x}\cdot\dfrac{${a}}{${b}}\to\dfrac{${a}}{${b}}`; }
    else { c = choose(rng, [2, 3, 5, 7]); b = int(rng, 1, 4); ans = ln(c) / b; t = R`\dfrac{${c}^x-1}{${b === 1 ? '' : b}x}`; s = R`\dfrac{${c}^x-1}{x}\to\ln${c}$, so the limit is $\dfrac{\ln${c}}{${b}}`; }
    return { kind, a, b, c, answer: r4(ans), tol: 0.01, q: LQ(0, t, 'Evaluate') + TWOD,
      sol: R`<p>$${s}\approx${r4(ans)}$.</p>` };
  }, (p) => {
    const f = [(x) => (exp(p.a * x) - 1) / (p.b * x), (x) => ln(1 + p.a * x) / (p.b * x), (x) => (p.c ** x - 1) / (p.b * x)][p.kind];
    return NL(f, 0);
  }),

  // g05 (L2): 1 - cos
  gen('li-g05', 2, 'mcq', 'single', 'standard limits', (rng) => {
    const kind = int(rng, 0, 2);
    let a, b, t, num, den;
    if (kind === 0) { a = int(rng, 2, 8); b = 1; t = R`\dfrac{1-\cos${a}x}{x^2}`; num = a * a; den = 2; }
    else if (kind === 1) { a = int(rng, 2, 8); b = int(rng, 2, 5); t = R`\dfrac{1-\cos${a}x}{${b}x^2}`; num = a * a; den = 2 * b; }
    else { b = int(rng, 1, 4); a = b + int(rng, 1, 4); t = R`\dfrac{${cs(b)}-\cos${a}x}{x^2}`; num = a * a - b * b; den = 2; }
    const g = gcd(num, den);
    const ws = [frac(num, den * 2), frac(num * 2, den), frac(a, den)].filter((w, i, ar) => w !== frac(num, den) && ar.indexOf(w) === i);
    while (ws.length < 3) ws.push(`${ws.length + 7}`);
    const { options, answer } = OP(rng, frac(num, den), ws);
    return { kind, a, b, num, den, options, answer, q: LQ(0, t),
      sol: R`<p>Use $1-\cos kx\approx\dfrac{k^2x^2}2$. ${kind === 2 ? R`The numerator is $\dfrac{${a * a}x^2}2-\dfrac{${b * b}x^2}2=\dfrac{${num}x^2}2$.` : R`The numerator is $\dfrac{${a * a}x^2}2$${kind === 1 ? R` and we divide by $${b}x^2$` : ''}.`} The limit is $${frac(num, den)}$.</p>` };
  }, (p) => {
    const f = [(x) => (1 - cos(p.a * x)) / (x * x), (x) => (1 - cos(p.a * x)) / (p.b * x * x), (x) => (cos(p.b * x) - cos(p.a * x)) / (x * x)][p.kind];
    return idx(p, NL(f, 0), p.num / p.den, frac(p.num, p.den));
  }),

  // g06 (L2): limits at infinity, integer
  gen('li-g06', 2, 'nat', 'integer', 'limits at infinity', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) {
      const d = int(rng, 1, 4), k = int(rng, 2, 5), a = k * d, b = int(rng, 1, 9), c = int(rng, 1, 9), e2 = int(rng, 1, 9);
      return { kind, a, b, c, d, e2, answer: k, tol: 0, q: LQ(R`\infty`, R`\dfrac{${a}x^2+${b}x+${c}}{${d === 1 ? '' : d}x^2+${e2}}`),
        sol: R`<p>Divide by $x^2$. The limit is the ratio of leading coefficients: $\dfrac{${a}}{${d}}=${k}$.</p>` };
    }
    if (kind === 1) {
      const d = int(rng, 1, 3), k = int(rng, 2, 6), a = k * d, b = int(rng, 1, 9);
      return { kind, a, b, d, answer: k, tol: 0, q: LQ(R`\infty`, R`\dfrac{${a}x^3-${b}x}{${d === 1 ? '' : d}x^3+x^2+1}`),
        sol: R`<p>Same degree 3 on top and bottom. The limit is $\dfrac{${a}}{${d}}=${k}$.</p>` };
    }
    if (kind === 2) {
      const m = int(rng, 2, 7), b = int(rng, 1, 9);
      return { kind, m, b, answer: m, tol: 0, q: LQ(R`\infty`, R`\dfrac{\sqrt{${m * m}x^2+${b}x+1}}{x+1}`),
        sol: R`<p>For large $x$, $\sqrt{${m * m}x^2+${b}x+1}\approx${m}x$. Dividing by $x$ (top and bottom): $\dfrac{${m}}{1}=${m}$.</p>` };
    }
    const pp = int(rng, 1, 6);
    return { kind, pp, answer: 4 * pp, tol: 0, q: LQ(R`\infty`, R`\dfrac{(x+${pp})^2-(x-${pp})^2}{x}`),
      sol: R`<p>$(x+${pp})^2-(x-${pp})^2=4\cdot${pp}\cdot x=${4 * pp}x$. Divide by $x$: $${4 * pp}$ for all $x\ne0$.</p>` };
  }, (p) => {
    const f = [(x) => (p.a * x * x + p.b * x + p.c) / (p.d * x * x + p.e2), (x) => (p.a * x ** 3 - p.b * x) / (p.d * x ** 3 + x * x + 1), (x) => sqrt(p.m * p.m * x * x + p.b * x + 1) / (x + 1), (x) => ((x + p.pp) ** 2 - (x - p.pp) ** 2) / x][p.kind];
    return Math.round(NL(f, Infinity));
  }),

  // g07 (L2): factorising
  gen('li-g07', 2, 'nat', 'numeric', 'factorising', (rng) => {
    let p, q; do { p = int(rng, 2, 7); q = int(rng, 1, 8); } while (q === p);
    const ans = (p - q) / (2 * p);
    return { P: p, Q: q, answer: r4(ans), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to${p}}\dfrac{x^2-${p + q}x+${p * q}}{x^2-${p * p}}$.${TWOD}`,
      sol: R`<p>Top $=(x-${p})(x-${q})$, bottom $=(x-${p})(x+${p})$. Cancel: $\dfrac{x-${q}}{x+${p}}\to\dfrac{${p - q}}{${2 * p}}\approx${r4(ans)}$.</p>` };
  }, (p) => NL((x) => (x * x - (p.P + p.Q) * x + p.P * p.Q) / (x * x - p.P * p.P), p.P)),

  // g08 (L2): rationalising
  gen('li-g08', 2, 'nat', 'numeric', 'rationalising', (rng) => {
    const kind = int(rng, 0, 2), s = int(rng, 2, 6);
    if (kind === 0) return { kind, s, answer: r4(1 / (2 * s)), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{\sqrt{x+${s * s}}-${s}}{x}$.${TWOD}`,
      sol: R`<p>Conjugate: $\dfrac{x}{x(\sqrt{x+${s * s}}+${s})}\to\dfrac1{${s}+${s}}=\dfrac1{${2 * s}}\approx${r4(1 / (2 * s))}$.</p>` };
    if (kind === 1) return { kind, s, answer: 2 * s, tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to${s * s}}\dfrac{x-${s * s}}{\sqrt x-${s}}$.${TWOD}`,
      sol: R`<p>$x-${s * s}=(\sqrt x-${s})(\sqrt x+${s})$, so the ratio is $\sqrt x+${s}\to${2 * s}$.</p>` };
    return { kind, s, answer: r4(1 / s), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{\sqrt{${s * s}+x}-\sqrt{${s * s}-x}}{x}$.${TWOD}`,
      sol: R`<p>Conjugate: $\dfrac{2x}{x\left(\sqrt{${s * s}+x}+\sqrt{${s * s}-x}\right)}\to\dfrac2{${2 * s}}=\dfrac1{${s}}\approx${r4(1 / s)}$.</p>` };
  }, (p) => NL([(x) => (sqrt(x + p.s * p.s) - p.s) / x, (x) => (x - p.s * p.s) / (sqrt(x) - p.s), (x) => (sqrt(p.s * p.s + x) - sqrt(p.s * p.s - x)) / x][p.kind], p.kind === 1 ? p.s * p.s : 0)),

  // g09 (L2): piecewise limits
  gen('li-g09', 2, 'mcq', 'single', 'piecewise limits', (rng) => {
    const a = int(rng, 1, 4), m = int(rng, 1, 4), c = int(rng, -3, 5), pp = int(rng, 1, 3);
    const eq = rng() < 0.5; const left = m * a + c; const d = left - pp * a * a + (eq ? 0 : int(rng, 1, 3)); const right = pp * a * a + d;
    const kind = int(rng, 0, 2);
    const fx = R`f(x)=\begin{cases}${lin(m, c)},&x<${a}\\${co(pp)}x^2${d < 0 ? d : `+${d}`},&x\ge${a}\end{cases}`;
    let ask, correct, ws;
    if (kind === 0) { ask = R`\lim_{x\to${a}^-}f(x)`; correct = `${left}`; ws = [`${right}`, `${left + 1}`, R`\text{does not exist}`]; }
    else if (kind === 1) { ask = R`\lim_{x\to${a}^+}f(x)`; correct = `${right}`; ws = [`${left}`, `${right + 1}`, R`\text{does not exist}`]; }
    else { ask = R`\lim_{x\to${a}}f(x)`; correct = eq ? `${left}` : R`\text{does not exist}`; ws = eq ? [R`\text{does not exist}`, `${left + 1}`, `${left - 1}`] : [`${left}`, `${right}`, `${left + right}`]; }
    const { options, answer } = OP(rng, correct, ws);
    return { a, m, c, pp, d, left, right, eq, kind, options, answer, q: R`Let $${fx}$. Then $\displaystyle${ask}$ is`,
      sol: R`<p>Left of ${a}: $${lin(m, c)}\to${m}\cdot${a}${sgn(c)}=${left}$. Right of ${a}: $${co(pp)}x^2${d < 0 ? d : `+${d}`}\to${pp * a * a}${sgn(d)}=${right}$. ${kind === 2 ? (eq ? 'The two sides agree, so the limit exists.' : 'The two sides differ, so the limit does not exist.') : 'Read the side asked for.'}</p>` };
  }, (p) => {
    const f = (x) => (x < p.a ? p.m * x + p.c : p.pp * x * x + p.d);
    const side = p.kind === 0 ? -1 : p.kind === 1 ? 1 : 0;
    const v = NL(f, p.a, side);
    const exp = p.kind === 0 ? p.left : p.kind === 1 ? p.right : p.eq ? p.left : NaN;
    const corr = p.kind === 2 && !p.eq ? R`\text{does not exist}` : `${exp}`;
    if (Number.isNaN(exp)) return Number.isNaN(v) ? p.options.indexOf(W(corr)) : -1;
    return near(v, exp) ? p.options.indexOf(W(corr)) : -1;
  }),

  // g10 (L3): finding constants
  gen('li-g10', 3, 'nat', 'integer', 'finding constants', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) {
      const r = int(rng, 1, 4), c = int(rng, -3, 5), p = c - r, q = -r * c, L = r + c;
      return { kind, r, c, P: p, Q: q, L, answer: p + q, tol: 0, q: R`If $\displaystyle\lim_{x\to${r}}\dfrac{x^2+px+q}{x-${r}}=${L}$, find $p+q$.`,
        sol: R`<p>The denominator $\to0$, so the numerator must vanish at $x=${r}$: $x^2+px+q=(x-${r})(x+c)$. The limit is $${r}+c=${L}$, so $c=${c}$. Expand: $x^2${sgn(c - r)}x${sgn(-r * c)}$, so $p=${p}$, $q=${q}$, and $p+q=${p + q}$.</p>` };
    }
    if (kind === 1) {
      const L = int(rng, 2, 8);
      return { kind, L, answer: 2 * L, tol: 0, q: R`If $\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+px+1}-x\right)=${L}$, find $p$.`,
        sol: R`<p>Conjugate: $\dfrac{px+1}{\sqrt{x^2+px+1}+x}\to\dfrac p2$. So $\frac p2=${L}$ and $p=${2 * L}$.</p>` };
    }
    if (kind === 2) {
      const a = choose(rng, [2, 4, 6]);
      return { kind, a, answer: a * a, tol: 0, q: R`If $\displaystyle\lim_{x\to0}\dfrac{\cos ax-1}{x^2}=-${(a * a) / 2}$, find $a^2$.`,
        sol: R`<p>$\dfrac{\cos ax-1}{x^2}\to-\dfrac{a^2}2$. So $\dfrac{a^2}2=${(a * a) / 2}$ and $a^2=${a * a}$.</p>` };
    }
    const b = int(rng, 2, 5), k = int(rng, 2, 5);
    return { kind, b, k, answer: k * b, tol: 0, q: R`If $\displaystyle\lim_{x\to0}\dfrac{e^{ax}-1}{\sin${b}x}=${k}$, find $a$.`,
      sol: R`<p>The limit is $\dfrac ab$ (top $\approx ax$, bottom $\approx${b}x$). So $\dfrac a{${b}}=${k}$ and $a=${k * b}$.</p>` };
  }, (p) => {
    if (p.kind === 0) { const v = NL((x) => (x * x + p.P * x + p.Q) / (x - p.r), p.r); return near(v, p.L) ? p.P + p.Q : NaN; }
    if (p.kind === 1) { const v = NL((x) => sqrt(x * x + 2 * p.L * x + 1) - x, Infinity); return near(v, p.L) ? p.answer : NaN; }
    if (p.kind === 2) { const v = NL((x) => (cos(p.a * x) - 1) / (x * x), 0); return near(v, -(p.a * p.a) / 2) ? p.a * p.a : NaN; }
    const v = NL((x) => (exp(p.k * p.b * x) - 1) / sin(p.b * x), 0); return near(v, p.k) ? p.k * p.b : NaN;
  }),

  // g11 (L3): 1^infinity forms
  gen('li-g11', 3, 'mcq', 'single', '$1^\\infty$ form', (rng) => {
    const kind = int(rng, 0, 3);
    let a, b, t, ex, ws, s;
    if (kind <= 1 || kind === 3) {
      do { a = int(rng, 2, 5); b = int(rng, 2, 4); } while (a === b || a * b === a + b);
      ex = a * b;
      ws = [`e^{${a + b}}`, `e^{${a}}`, `e^{${b}}`];
      if (kind === 0) { t = LQ(0, R`(1+${a}x)^{${b}/x}`); s = R`Excess times exponent: $${a}x\cdot\dfrac{${b}}x=${a * b}$.`; }
      else if (kind === 1) { t = LQ(R`\infty`, R`\left(1+\dfrac{${a}}x\right)^{${b}x}`); s = R`Excess $\frac{${a}}x$ times exponent $${b}x$ is $${a * b}$.`; }
      else { t = LQ(0, R`(1+${a}\sin${b}x)^{1/x}`); s = R`Excess $${a}\sin${b}x$ divided by $x$ tends to $${a}\cdot${b}=${a * b}$.`; }
    } else {
      do { a = int(rng, 1, 6); b = int(rng, 1, 4); } while (a === b);
      ex = a - b; t = LQ(R`\infty`, R`\left(\dfrac{x+${a}}{x+${b}}\right)^{x}`); ws = [`e^{${b - a}}`, `e^{${a + b}}`, `e^{${a * b}}`];
      s = R`The excess is $\dfrac{${a}-${b}}{x+${b}}$; times $x$ it tends to $${a - b}$.`;
    }
    const { options, answer } = OP(rng, `e^{${ex}}`, ws);
    return { kind, a, b, ex, options, answer, q: t, sol: R`<p>This is a $1^\infty$ form: the limit is $e^{\lim(\text{base}-1)\cdot\text{exponent}}$. ${s} So the limit is $e^{${ex}}$.</p>` };
  }, (p) => {
    const f = [(x) => (p.b / x) * ln(1 + p.a * x), (x) => p.b * x * ln(1 + p.a / x), (x) => x * ln((x + p.a) / (x + p.b)), (x) => ln(1 + p.a * sin(p.b * x)) / x][p.kind];
    const v = NL(f, p.kind === 0 || p.kind === 3 ? 0 : Infinity);
    return near(v, p.ex) ? p.options.indexOf(W(`e^{${p.ex}}`)) : -1;
  }),

  // g12 (L3): geometric mean limits
  gen('li-g12', 3, 'nat', 'integer', '$1^\\infty$ form', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) {
      let s, t; do { s = int(rng, 1, 4); t = int(rng, 1, 4); } while (s === t);
      const a = s * s, b = t * t;
      return { kind, a, b, s, t, answer: s * t, tol: 0, q: LQ(0, R`\left(\dfrac{${a}^x+${b}^x}2\right)^{1/x}`),
        sol: R`<p>The limit is the geometric mean $\sqrt{ab}=\sqrt{${a}\cdot${b}}=${s * t}$. (Excess over exponent: $\frac12\left(\ln${a}+\ln${b}\right)=\ln${s * t}$.)</p>` };
    }
    if (kind === 1) {
      const s = int(rng, 1, 2), t = int(rng, 2, 3), u = int(rng, 1, 3), a = s ** 3, b = t ** 3, c = u ** 3;
      return { kind, a, b, c, s, t, u, answer: s * t * u, tol: 0, q: LQ(0, R`\left(\dfrac{${a}^x+${b}^x+${c}^x}3\right)^{1/x}`),
        sol: R`<p>Geometric mean: $\sqrt[3]{${a}\cdot${b}\cdot${c}}=\sqrt[3]{${a * b * c}}=${s * t * u}$.</p>` };
    }
    let s, t; do { s = int(rng, 1, 3); t = int(rng, 1, 3); } while (s === t);
    const a = s * s, b = t * t;
    return { kind, a, b, answer: a * b, tol: 0, q: LQ(0, R`\left(\dfrac{${a}^x+${b}^x}2\right)^{2/x}`),
      sol: R`<p>The base-and-exponent limit with $\frac1x$ is $\sqrt{ab}=${s * t}$. With exponent $\frac2x$ the limit is its square: $${s * t}^2=${a * b}$.</p>` };
  }, (p) => {
    const f = [(x) => ((p.a ** x + p.b ** x) / 2) ** (1 / x), (x) => ((p.a ** x + p.b ** x + p.c ** x) / 3) ** (1 / x), (x) => ((p.a ** x + p.b ** x) / 2) ** (2 / x)][p.kind];
    return Math.round(NL(f, 0));
  }),

  // g13 (L3): logs from exponentials
  gen('li-g13', 3, 'mcq', 'single', 'standard limits', (rng) => {
    const kind = int(rng, 0, 3);
    let a, b, t, ok, ws;
    if (kind === 0) { do { a = int(rng, 2, 9); b = int(rng, 2, 9); } while (a <= b); t = LQ(0, R`\dfrac{${a}^x-${b}^x}{x}`); ok = R`\ln\dfrac{${a}}{${b}}`; ws = [R`\ln\dfrac{${b}}{${a}}`, R`\ln${a * b}`, R`\dfrac{${a}}{${b}}`]; }
    else if (kind === 1) { do { a = int(rng, 2, 9); b = int(rng, 2, 9); } while (a === b); t = LQ(0, R`\dfrac{${a}^x-1}{${b}^x-1}`); ok = R`\log_{${b}}${a}`; ws = [R`\log_{${a}}${b}`, R`\dfrac{${a}}{${b}}`, R`\ln\dfrac{${a}}{${b}}`]; }
    else if (kind === 2) { a = int(rng, 2, 9); b = 1; t = LQ(0, R`\dfrac{${a}^x-${a}^{-x}}{x}`); ok = R`2\ln${a}`; ws = [R`\ln${a}`, '0', R`\dfrac2{\ln${a}}`]; }
    else { a = int(rng, 2, 9); b = 1; t = LQ(R`\infty`, R`x\left(${a}^{1/x}-1\right)`); ok = R`\ln${a}`; ws = [`${a}`, R`\dfrac1{\ln${a}}`, '0']; }
    const { options, answer } = OP(rng, ok, ws);
    return { kind, a, b, ok, options, answer, q: t,
      sol: R`<p>Use $\lim\dfrac{c^t-1}t=\ln c$. ${kind === 0 ? R`Write $\dfrac{${a}^x-${b}^x}x=\dfrac{${a}^x-1}x-\dfrac{${b}^x-1}x\to\ln${a}-\ln${b}$.` : kind === 1 ? R`Divide top and bottom by $x$: $\dfrac{\ln${a}}{\ln${b}}=\log_{${b}}${a}$.` : kind === 2 ? R`Split: $\dfrac{${a}^x-1}x+\dfrac{1-${a}^{-x}}x\to\ln${a}+\ln${a}$.` : R`Put $t=\frac1x\to0$.`} The answer is $${ok}$.</p>` };
  }, (p) => {
    const f = [(x) => (p.a ** x - p.b ** x) / x, (x) => (p.a ** x - 1) / (p.b ** x - 1), (x) => (p.a ** x - p.a ** -x) / x, (x) => x * (p.a ** (1 / x) - 1)][p.kind];
    const exp = [ln(p.a / p.b), ln(p.a) / ln(p.b), 2 * ln(p.a), ln(p.a)][p.kind];
    return idx(p, NL(f, p.kind === 3 ? Infinity : 0), exp, p.ok);
  }),

  // g14 (L3): multiples of standard series limits
  gen('li-g14', 3, 'nat', 'integer', 'series expansion', (rng) => {
    const kind = int(rng, 0, 3), m = int(rng, 2, 7);
    const T = [
      [R`\dfrac{${6 * m}(x-\sin x)}{x^3}`, R`$x-\sin x\approx\frac{x^3}6$, so the fraction tends to $\dfrac{${6 * m}}6=${m}$.`],
      [R`\dfrac{${3 * m}(\tan x-x)}{x^3}`, R`$\tan x-x\approx\frac{x^3}3$, so the fraction tends to $\dfrac{${3 * m}}3=${m}$.`],
      [R`\dfrac{${2 * m}\left(e^x-1-x\right)}{x^2}`, R`$e^x-1-x\approx\frac{x^2}2$, so the fraction tends to $\dfrac{${2 * m}}2=${m}$.`],
      [R`\dfrac{${8 * m}\left(1+\frac x2-\sqrt{1+x}\right)}{x^2}`, R`$\sqrt{1+x}\approx1+\frac x2-\frac{x^2}8$, so $1+\frac x2-\sqrt{1+x}\approx\frac{x^2}8$ and the limit is $\dfrac{${8 * m}}8=${m}$.`],
    ][kind];
    return { kind, m, answer: m, tol: 0, q: LQ(0, T[0]), sol: R`<p>${T[1]}</p>` };
  }, (p) => {
    const f = [(x) => (6 * p.m * (x - sin(x))) / x ** 3, (x) => (3 * p.m * (tan(x) - x)) / x ** 3, (x) => (2 * p.m * (exp(x) - 1 - x)) / (x * x), (x) => (8 * p.m * (1 + x / 2 - sqrt(1 + x))) / (x * x)][p.kind];
    return Math.round(NL(f, 0));
  }),

  // g15 (L3): sums as limits
  gen('li-g15', 3, 'nat', 'numeric', 'sequences', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) {
      const k = int(rng, 1, 4);
      return { kind, k, answer: r4(1 / (k + 1)), tol: 0.01, q: R`Find $\displaystyle\lim_{n\to\infty}\dfrac{1^${k}+2^${k}+\cdots+n^${k}}{n^${k + 1}}$.${TWOD}`,
        sol: R`<p>The sum is $\dfrac1n\sum\left(\dfrac rn\right)^${k}\to\int_0^1x^${k}dx=\dfrac1{${k + 1}}\approx${r4(1 / (k + 1))}$.</p>` };
    }
    if (kind === 1) return { kind, answer: 0.3333, tol: 0.01, q: R`Find $\displaystyle\lim_{n\to\infty}\dfrac{1\cdot2+2\cdot3+\cdots+n(n+1)}{n^3}$.${TWOD}`,
      sol: R`<p>$\sum r(r+1)=\frac{n(n+1)(n+2)}3$. Divide by $n^3$: $\to\frac13\approx0.33$.</p>` };
    const c = int(rng, 2, 5);
    return { kind, c, answer: r4(c / 2), tol: 0.01, q: R`Find $\displaystyle\lim_{n\to\infty}\dfrac{(${c}\cdot1-1)+(${c}\cdot2-1)+\cdots+(${c}n-1)}{n^2}$.${TWOD}`,
      sol: R`<p>The sum is $${c}\cdot\dfrac{n(n+1)}2-n$. Divide by $n^2$: $\dfrac{${c}(n+1)}{2n}-\dfrac1n\to\dfrac{${c}}2=${r4(c / 2)}$.</p>` };
  }, (p) => {
    const f = [(n) => sumTo(n, (r) => r ** p.k) / n ** (p.k + 1), (n) => sumTo(n, (r) => r * (r + 1)) / n ** 3, (n) => sumTo(n, (r) => p.c * r - 1) / (n * n)][p.kind];
    return f(20000);
  }),

  // g16 (L3): [x] and {x}
  gen('li-g16', 3, 'mcq', 'single', 'greatest integer', (rng) => {
    const n = int(rng, 2, 9), kind = int(rng, 0, 4);
    const T = [
      [R`[x]`, -1, n - 1, [`${n}`, `${n + 1}`, R`\text{does not exist}`]],
      [R`\{x\}`, -1, 1, ['0', `${n}`, R`\text{does not exist}`]],
      [R`([x]+x)`, -1, 2 * n - 1, [`${2 * n}`, `${2 * n + 1}`, `${n - 1}`]],
      [R`(x-[x])`, 1, 0, ['1', `${n}`, R`\text{does not exist}`]],
      [R`[x]^2`, -1, (n - 1) ** 2, [`${n * n}`, `${n * (n - 1)}`, `${n - 1}`]],
    ][kind];
    const side = T[1];
    const f = [(x) => fl(x), (x) => x - fl(x), (x) => fl(x) + x, (x) => x - fl(x), (x) => fl(x) ** 2][kind];
    const { options, answer } = OP(rng, `${T[2]}`, T[3]);
    return { n, kind, side, val: T[2], options, answer, q: R`Evaluate $\displaystyle\lim_{x\to${n}${side < 0 ? '^-' : '^+'}}${T[0]}$.`,
      sol: R`<p>${side < 0 ? `Just left of ${n}, $[x]=${n - 1}$ and $x\\to${n}$.` : `Just right of ${n}, $[x]=${n}$ and $x\\to${n}$.`} ${kind === 1 ? 'So $\\{x\\}=x-[x]\\to1$.' : kind === 3 ? 'So $x-[x]=x-' + n + '\\to0$.' : kind === 0 ? `So $[x]=${n - 1}$.` : kind === 2 ? `So $[x]+x\\to${n - 1}+${n}=${2 * n - 1}$.` : `So $[x]^2=${(n - 1) ** 2}$.`}</p>` };
  }, (p) => {
    const f = [(x) => fl(x), (x) => x - fl(x), (x) => fl(x) + x, (x) => x - fl(x), (x) => fl(x) ** 2][p.kind];
    const v = NL(f, p.n, p.side);
    return near(v, p.val) ? p.options.indexOf(W(`${p.val}`)) : -1;
  }),

  // g17 (L3): modulus limits
  gen('li-g17', 3, 'mcq', 'single', 'modulus', (rng) => {
    const a = int(rng, 2, 6), kind = int(rng, 0, 3), s = rng() < 0.5 ? 1 : -1; const sd = s > 0 ? '^+' : '^-';
    let t, ok, ws, val;
    if (kind === 0) { t = R`\dfrac{|x-${a}|}{x-${a}}`; val = s; ok = `${s}`; ws = [`${-s}`, '0', R`\text{does not exist}`]; }
    else if (kind === 1) { t = R`\dfrac{x^2-${a * a}}{|x-${a}|}`; val = s * 2 * a; ok = `${val}`; ws = [`${-val}`, '0', R`\text{does not exist}`]; }
    else if (kind === 2) { t = R`\dfrac{|x-${a}|}{x^2-${a * a}}`; val = s / (2 * a); ok = s > 0 ? R`\dfrac1{${2 * a}}` : R`-\dfrac1{${2 * a}}`; ws = [s > 0 ? R`-\dfrac1{${2 * a}}` : R`\dfrac1{${2 * a}}`, '0', R`\text{does not exist}`]; }
    else { t = R`\dfrac{x-${a}}{|x-${a}|}`; val = s; ok = `${s}`; ws = [`${-s}`, '0', R`\text{does not exist}`]; }
    if (kind === 3) { val = s; } // x-a over |x-a| equals the side sign
    const { options, answer } = OP(rng, ok, ws);
    return { a, kind, s, val, ok, options, answer, q: R`Evaluate $\displaystyle\lim_{x\to${a}${sd}}${t}$.`,
      sol: R`<p>${s > 0 ? `For $x>${a}$: $|x-${a}|=x-${a}$.` : `For $x<${a}$: $|x-${a}|=-(x-${a})$.`} ${kind === 1 ? R`So the expression is $${s > 0 ? '' : '-'}(x+${a})$, which tends to $${val}$.` : kind === 2 ? R`So the expression is $\dfrac{${s > 0 ? '' : '-'}1}{x+${a}}\to${ok}$.` : R`So the ratio is $${s}$ throughout.`}</p>` };
  }, (p) => {
    const f = [(x) => abs(x - p.a) / (x - p.a), (x) => (x * x - p.a * p.a) / abs(x - p.a), (x) => abs(x - p.a) / (x * x - p.a * p.a), (x) => (x - p.a) / abs(x - p.a)][p.kind];
    const v = NL(f, p.a, p.s);
    const exp = p.kind === 1 ? p.s * 2 * p.a : p.kind === 2 ? p.s / (2 * p.a) : p.s;
    return near(v, exp) ? p.options.indexOf(W(p.ok)) : -1;
  }),

  // g18 (L4): second-order series with constants
  gen('li-g18', 4, 'nat', 'numeric', 'series expansion', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) { const c = choose(rng, [2, 3, 5]); const ans = ln(c) ** 2 / 2; return { kind, c, answer: r4(ans), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{${c}^x-1-x\ln${c}}{x^2}$.${TWOD}`, sol: R`<p>$${c}^x=e^{x\ln${c}}=1+x\ln${c}+\dfrac{x^2\ln^2${c}}2+\cdots$. So the limit is $\dfrac{(\ln${c})^2}2\approx${r4(ans)}$.</p>` }; }
    const a = int(rng, 2, 4);
    if (kind === 1) return { kind, a, answer: (a * a) / 2, tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{e^{${a}x}-1-${a}x}{x^2}$.${TWOD}`, sol: R`<p>$e^{${a}x}=1+${a}x+\dfrac{${a * a}x^2}2+\cdots$. The limit is $\dfrac{${a * a}}2=${(a * a) / 2}$.</p>` };
    if (kind === 2) return { kind, a, answer: r4(a ** 3 / 6), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{e^{${a}x}-1-${a}x-${(a * a) / 2}x^2}{x^3}$.${TWOD}`, sol: R`<p>The next term of $e^{${a}x}$ is $\dfrac{(${a}x)^3}{6}=\dfrac{${a ** 3}x^3}6$. The limit is $\dfrac{${a ** 3}}6\approx${r4(a ** 3 / 6)}$.</p>` };
    return { kind, a, answer: -(a * a) / 2, tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{\ln(1+${a}x)-${a}x}{x^2}$.${TWOD}`, sol: R`<p>$\ln(1+t)=t-\dfrac{t^2}2+\cdots$ with $t=${a}x$. The numerator is $-\dfrac{${a * a}x^2}2$. Limit $=-${(a * a) / 2}$.</p>` };
  }, (p) => NL([(x) => (p.c ** x - 1 - x * ln(p.c)) / (x * x), (x) => (exp(p.a * x) - 1 - p.a * x) / (x * x), (x) => (exp(p.a * x) - 1 - p.a * x - ((p.a * p.a) / 2) * x * x) / x ** 3, (x) => (ln(1 + p.a * x) - p.a * x) / (x * x)][p.kind], 0)),

  // g19 (L4): ln of a 1^infinity limit
  gen('li-g19', 4, 'nat', 'numeric', '$1^\\infty$ form', (rng) => {
    const kind = int(rng, 0, 3), k = int(rng, 1, 6);
    const T = [
      [R`(\cos x)^{${k}/x^2}`, -k / 2, R`$\dfrac{\cos x-1}{x^2}\to-\dfrac12$, times $${k}$: $-\dfrac{${k}}2$.`],
      [R`\left(\dfrac{\sin x}x\right)^{${k}/x^2}`, -k / 6, R`$\dfrac{\sin x}x-1\approx-\dfrac{x^2}6$, so the exponent of $e$ is $-\dfrac{${k}}6$.`],
      [R`\left(\dfrac{\tan x}x\right)^{${k}/x^2}`, k / 3, R`$\dfrac{\tan x}x-1\approx\dfrac{x^2}3$, so the exponent of $e$ is $\dfrac{${k}}3$.`],
      [R`\left(\dfrac{(1+x)^{1/x}}e\right)^{${k}/x}`, -k / 2, R`$\ln\dfrac{(1+x)^{1/x}}e=\dfrac{\ln(1+x)}x-1\approx-\dfrac x2$, so the exponent of $e$ is $-\dfrac{${k}}2$.`],
    ][kind];
    return { kind, k, answer: r4(T[1]), tol: 0.01, q: R`Let $L=\displaystyle\lim_{x\to0}${T[0]}$. Find $\ln L$.${TWOD}`,
      sol: R`<p>For a $1^\infty$ form, $\ln L=\lim(\text{base}-1)\times\text{exponent}$. ${T[2]} So $\ln L\approx${r4(T[1])}$.</p>` };
  }, (p) => {
    const f = [(x) => cos(x) ** (p.k / (x * x)), (x) => (sin(x) / x) ** (p.k / (x * x)), (x) => (tan(x) / x) ** (p.k / (x * x)), (x) => ((1 + x) ** (1 / x) / E_) ** (p.k / x)][p.kind];
    return ln(NL(f, 0));
  }),

  // g20 (L4): products of cosines
  gen('li-g20', 4, 'nat', 'integer', 'series expansion', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) {
      const n = choose(rng, [3, 4, 7, 8]), ans = (n * (n + 1) * (2 * n + 1)) / 12;
      const prod = Array.from({ length: n }, (_, i) => cs(i + 1)).join('');
      return { kind, n, answer: ans, tol: 0, q: LQ(0, R`\dfrac{1-${prod.length > 40 ? R`\cos x\cos2x\cdots\cos${n}x` : prod}}{x^2}`),
        sol: R`<p>Each $\cos kx\approx1-\dfrac{k^2x^2}2$. The product is $1-\dfrac{1^2+2^2+\cdots+${n}^2}2x^2$. The sum of squares is $\dfrac{${n}\cdot${n + 1}\cdot${2 * n + 1}}6=${(n * (n + 1) * (2 * n + 1)) / 6}$. The limit is $${ans}$.</p>` };
    }
    if (kind === 1) {
      let a, b; do { a = int(rng, 1, 9); b = int(rng, 1, 9); } while ((a * a + b * b) % 2 !== 0 || a === b);
      return { kind, a, b, answer: (a * a + b * b) / 2, tol: 0, q: LQ(0, R`\dfrac{1-${cs(a)}${cs(b)}}{x^2}`),
        sol: R`<p>$\cos ax\cos bx\approx1-\dfrac{(a^2+b^2)x^2}2$. The limit is $\dfrac{${a * a}+${b * b}}2=${(a * a + b * b) / 2}$.</p>` };
    }
    const b = int(rng, 1, 3), k = int(rng, 2, 4);
    return { kind, b, k, answer: k * k, tol: 0, q: LQ(0, R`\dfrac{1-\cos${k * b}x}{1-${cs(b)}}`),
      sol: R`<p>$1-\cos cx\approx\dfrac{c^2x^2}2$. The ratio is $\dfrac{${k * b}^2}{${b}^2}=${k * k}$.</p>` };
  }, (p) => {
    if (p.kind === 0) return Math.round(NL((x) => { let c = 1; for (let i = 1; i <= p.n; i++) c *= cos(i * x); return (1 - c) / (x * x); }, 0));
    if (p.kind === 1) return Math.round(NL((x) => (1 - cos(p.a * x) * cos(p.b * x)) / (x * x), 0));
    return Math.round(NL((x) => (1 - cos(p.k * p.b * x)) / (1 - cos(p.b * x)), 0));
  }),

  // g21 (L4): differences of square roots at infinity
  gen('li-g21', 4, 'mcq', 'single', 'limits at infinity', (rng) => {
    const kind = int(rng, 0, 2);
    let a, c, t, num, den = 2;
    if (kind === 0) { a = int(rng, 3, 9); c = int(rng, -4, 2); t = R`\sqrt{x^2+${a}x+1}-\sqrt{x^2${sgn(c)}x+5}`; num = a - c; }
    else if (kind === 1) { a = int(rng, 2, 9) * 2; c = 0; t = R`\sqrt{x^2+${a}x+1}-x`; num = a; }
    else { a = int(rng, 2, 9) * 2; c = 0; t = R`x-\sqrt{x^2-${a}x+3}`; num = a; }
    const ws = [frac(num, 4), frac(a + c, 2), `${num}`, '0'].filter((w, i, ar) => w !== frac(num, den) && ar.indexOf(w) === i);
    while (ws.length < 3) ws.push(`${ws.length + 11}`);
    const { options, answer } = OP(rng, frac(num, den), ws.slice(0, 3));
    return { kind, a, c, num, options, answer, q: LQ(R`\infty`, R`\left(${t}\right)`),
      sol: R`<p>Multiply by the conjugate. The difference of the squares inside is $${kind === 0 ? `${a - c}x-4` : kind === 1 ? `${a}x+1` : `${a}x-3`}$, and the sum of the roots is about $2x$. So the limit is $\dfrac{${num}}2=${frac(num, den)}$.</p>` };
  }, (p) => {
    const f = [(x) => sqrt(x * x + p.a * x + 1) - sqrt(x * x + p.c * x + 5), (x) => sqrt(x * x + p.a * x + 1) - x, (x) => x - sqrt(x * x - p.a * x + 3)][p.kind];
    return idx(p, NL(f, Infinity), p.num / 2, frac(p.num, 2));
  }),

  // g22 (L4): combined fractions
  gen('li-g22', 4, 'nat', 'numeric', 'combining fractions', (rng) => {
    const kind = int(rng, 0, 3), k = int(rng, 1, 6);
    const T = [
      [R`${co(k)}\dfrac{1}{x}\left(\dfrac1x-\cot x\right)`, k / 3, R`$\dfrac1x-\cot x\approx\dfrac x3$, so $\dfrac1x\left(\dfrac1x-\cot x\right)\to\dfrac13$; times $${k}$ gives $\dfrac{${k}}3$.`],
      [R`${k === 1 ? '' : k}\left(\dfrac1{x^2}-\dfrac1{\sin^2x}\right)`, -k / 3, R`$\dfrac1{\sin^2x}-\dfrac1{x^2}\to\dfrac13$, so this one tends to $-\dfrac13$; times $${k}$: $-\dfrac{${k}}3$.`],
      [R`${k === 1 ? '' : k}\left(\dfrac1x-\dfrac1{e^x-1}\right)`, k / 2, R`$\dfrac1x-\dfrac1{e^x-1}=\dfrac{e^x-1-x}{x(e^x-1)}\to\dfrac{x^2/2}{x^2}=\dfrac12$; times $${k}$: $\dfrac{${k}}2$.`],
      [R`${k === 1 ? '' : k}\left(\dfrac1{x^2}-\cot^2x\right)`, (2 * k) / 3, R`$\cot^2x\approx\dfrac1{x^2}-\dfrac23$, so the bracket tends to $\dfrac23$; times $${k}$: $\dfrac{${2 * k}}3$.`],
    ][kind];
    return { kind, k, answer: r4(T[1]), tol: 0.01, q: LQ(0, T[0]) + TWOD, sol: R`<p>${T[2]} $\approx${r4(T[1])}$.</p>` };
  }, (p) => NL([(x) => (p.k * (1 / x - 1 / tan(x))) / x, (x) => p.k * (1 / (x * x) - 1 / sin(x) ** 2), (x) => p.k * (1 / x - 1 / (exp(x) - 1)), (x) => p.k * (1 / (x * x) - 1 / tan(x) ** 2)][p.kind], 0)),

  // g23 (L4): m-multiple-angle expansions
  gen('li-g23', 4, 'nat', 'integer', 'series expansion', (rng) => {
    const kind = int(rng, 0, 2), m = int(rng, 2, 6);
    if (kind === 0) return { kind, m, answer: -((m - 1) * m * (m + 1)) / 6, tol: 0, q: LQ(0, R`\dfrac{\sin${m}x-${m}\sin x}{x^3}`),
      sol: R`<p>$\sin${m}x=${m}x-\dfrac{${m ** 3}x^3}6$ and $${m}\sin x=${m}x-\dfrac{${m}x^3}6$. Difference: $\dfrac{${m}-${m ** 3}}6x^3=${-((m - 1) * m * (m + 1)) / 6}x^3$.</p>` };
    if (kind === 1) return { kind, m, answer: ((m - 1) * m * (m + 1)) / 3, tol: 0, q: LQ(0, R`\dfrac{\tan${m}x-${m}\tan x}{x^3}`),
      sol: R`<p>$\tan t=t+\frac{t^3}3$: $\tan${m}x=${m}x+\dfrac{${m ** 3}x^3}3$, $${m}\tan x=${m}x+\dfrac{${m}x^3}3$. Difference: $\dfrac{${m ** 3}-${m}}3x^3=${((m - 1) * m * (m + 1)) / 3}x^3$.</p>` };
    return { kind, m, answer: -m, tol: 0, q: R`If $\displaystyle\lim_{x\to0}\dfrac{\tan${m}x+a\tan x}{x^3}$ is finite, find $a$.`,
      sol: R`<p>$\tan${m}x+a\tan x=(${m}+a)x+\cdots$. The $x$ term must vanish: $a=-${m}$.</p>` };
  }, (p) => {
    if (p.kind === 0) return Math.round(NL((x) => (sin(p.m * x) - p.m * sin(x)) / x ** 3, 0));
    if (p.kind === 1) return Math.round(NL((x) => (tan(p.m * x) - p.m * tan(x)) / x ** 3, 0));
    const v = NL((x) => (tan(p.m * x) - p.m * tan(x)) / x ** 3, 0); return Number.isFinite(v) ? -p.m : NaN;
  }),

  // g24 (L5): Riemann sums
  gen('li-g24', 5, 'nat', 'numeric', 'sums as integrals', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) { const c = int(rng, 1, 4), ans = ln(1 + c) / c; return { kind, c, answer: r4(ans), tol: 0.01, q: R`Find $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\dfrac1{n+${c === 1 ? '' : c}r}$.${TWOD}`, sol: R`<p>$\dfrac1{n+${c}r}=\dfrac1n\cdot\dfrac1{1+${c}(r/n)}$. The sum tends to $\int_0^1\dfrac{dx}{1+${c}x}=\dfrac{\ln(1+${c})}{${c}}\approx${r4(ans)}$.</p>` }; }
    if (kind === 1) { const c = int(rng, 1, 3), ans = atan(c) / c; return { kind, c, answer: r4(ans), tol: 0.01, q: R`Find $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\dfrac n{n^2+${c === 1 ? '' : c * c}r^2}$.${TWOD}`, sol: R`<p>$\dfrac n{n^2+${c * c}r^2}=\dfrac1n\cdot\dfrac1{1+${c * c}(r/n)^2}$. The sum tends to $\int_0^1\dfrac{dx}{1+${c * c}x^2}=\dfrac{\tan^{-1}${c}}{${c}}\approx${r4(ans)}$.</p>` }; }
    if (kind === 2) { const c = int(rng, 1, 3), ans = (E_ ** c - 1) / c; return { kind, c, answer: r4(ans), tol: 0.01, q: R`Find $\displaystyle\lim_{n\to\infty}\dfrac1n\sum_{r=1}^{n}e^{${c === 1 ? '' : c}r/n}$.${TWOD}`, sol: R`<p>The sum tends to $\int_0^1e^{${c}x}dx=\dfrac{e^{${c}}-1}{${c}}\approx${r4(ans)}$.</p>` }; }
    const pw = choose(rng, [0.5, 1.5, 2, 3]), ans = 1 / (pw + 1);
    return { kind, pw, answer: r4(ans), tol: 0.01, q: R`Find $\displaystyle\lim_{n\to\infty}\dfrac1n\sum_{r=1}^{n}\left(\dfrac rn\right)^{${pw}}$.${TWOD}`, sol: R`<p>The sum tends to $\int_0^1x^{${pw}}dx=\dfrac1{${pw + 1}}\approx${r4(ans)}$.</p>` };
  }, (p) => {
    const n = 20000;
    if (p.kind === 0) return sumTo(n, (r) => 1 / (n + p.c * r));
    if (p.kind === 1) return sumTo(n, (r) => n / (n * n + p.c * p.c * r * r));
    if (p.kind === 2) return sumTo(n, (r) => exp((p.c * r) / n)) / n;
    return sumTo(n, (r) => (r / n) ** p.pw) / n;
  }),

  // g25 (L5): series with a free constant
  gen('li-g25', 5, 'nat', 'numeric', 'series expansion', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) { const a = int(rng, 1, 2), ans = (-a * a * E_ ** a) / 2; return { kind, a, answer: r4(ans), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{(1+${a === 1 ? '' : a}x)^{1/x}-e^{${a}}}{x}$.${TWOD}`, sol: R`<p>$(1+ax)^{1/x}=e^{\ln(1+ax)/x}=e^{a-\frac{a^2x}2+\cdots}=e^a\left(1-\dfrac{a^2x}2+\cdots\right)$. So the limit is $-\dfrac{a^2e^a}2$ with $a=${a}$: $\approx${r4(ans)}$.</p>` }; }
    const k = int(rng, 2, 6);
    if (kind === 1) return { kind, k, answer: r4((k * k) / 6), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{x-\frac1{${k}}\sin${k}x}{x^3}$.${TWOD}`, sol: R`<p>$\dfrac{\sin${k}x}{${k}}=x-\dfrac{${k * k}x^3}6+\cdots$. So $x-\dfrac{\sin${k}x}{${k}}=\dfrac{${k * k}x^3}6$ and the limit is $\dfrac{${k * k}}6\approx${r4((k * k) / 6)}$.</p>` };
    return { kind, k, answer: r4((k * k) / 3), tol: 0.01, q: R`Evaluate $\displaystyle\lim_{x\to0}\dfrac{\frac1{${k}}\tan${k}x-x}{x^3}$.${TWOD}`, sol: R`<p>$\dfrac{\tan${k}x}{${k}}=x+\dfrac{${k * k}x^3}3+\cdots$. So the limit is $\dfrac{${k * k}}3\approx${r4((k * k) / 3)}$.</p>` };
  }, (p) => NL([(x) => ((1 + p.a * x) ** (1 / x) - E_ ** p.a) / x, (x) => (x - sin(p.k * x) / p.k) / x ** 3, (x) => (tan(p.k * x) / p.k - x) / x ** 3][p.kind], 0)),
];

items.forEach((it, i) => { it.id = `li-${String(i + 1).padStart(3, '0')}`; });

// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = false;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `li-x${String(++_k).padStart(3, '0')}`;
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
const GX = (id, level, type, format, sub, make, verify) => ({ id: `li-${id}`, type, format, level, exams: xex(level, type), sub, make, ...(verify ? { verify } : {}) });
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
// ---- load-time numeric checks of every claimed value ----
const xe = Math.E;
ck('sin5x/tan2x', xlim((x) => xsin(5 * x) / xtan(2 * x), 0), 2.5);
ck('x3-27', xlim((x) => (x ** 3 - 27) / (x ** 2 - 9), 3), 27 / 6, 1e-2);
ck('cos x - cos 3x', xlim((x) => (xcos(x) - xcos(3 * x)) / x ** 2, 0), 4, 1e-3);
ck('1inf x2', ((1e3 ** 2 + 1) / (1e3 ** 2 - 1)) ** (1e3 ** 2), xe ** 2, 2e-3);
ck('riemann e', (() => { let s = 0; const n = 1e5; for (let k = 1; k <= n; k++) s += xexp(k / n); return s / n; })(), xe - 1, 1e-4);
ck('3^x-2^x', xlim((x) => (3 ** x - 2 ** x) / x, 0), xln(1.5), 1e-4);
ck('const', xlim((x) => (x + -2.5 * x * xcos(x) - -1.5 * xsin(x)) / x ** 3, 0, 1), 1, 5e-3);
ck('x^x - x', xlim((x) => (x ** x - x) / (xln(x) - x + 1), 1, 1), -2, 2e-2);
ck('asin-atan', xlim((x) => (Math.asin(x) - Math.atan(x)) / x ** 3, 0), 0.5, 2e-3);
ck('cbrt', (() => { const x = 1e5; return Math.cbrt(x ** 3 + 3 * x ** 2) - x; })(), 1, 1e-3);
ck('inv-sqrt sum', (() => { let s = 0; const n = 1e5; for (let k = 1; k <= n; k++) s += 1 / Math.sqrt(n * n + k); return s; })(), 1, 1e-4);
ck('tan tan', xlim((x) => (xtan(xtan(x)) - xsin(xsin(x))) / (xtan(x) - xsin(x)), 0), 2, 2e-3);
ck('exp x2', xlim((x) => (xexp(x * x) - xcos(x)) / (x * x), 0), 1.5, 1e-3);
ck('abc const', xlim((x) => (xexp(x) - 2 * xcos(x) + xexp(-x)) / (x * xsin(x)), 0), 2, 1e-3);
ck('tan/sin 1/x3', xlim((x) => ((1 + xtan(x)) / (1 + xsin(x))) ** (1 / x ** 3), 0, 1), xexp(0.5), 2e-2);
ck('tanx/x', xlim((x) => (xtan(x) / x) ** (1 / (x * x)), 0), xexp(1 / 3), 1e-3);
ck('x2 ln cos', (() => { const x = 1e3; return x * x * xln(xcos(1 / x)); })(), -0.5, 1e-3);
ck('cot', xlim((x) => 1 / (x * x) - 1 / xtan(x) ** 2, 0), 2 / 3, 1e-3);
ck('int sin t2', xlim((x) => xsimp((t) => xsin(t * t), 0, x, 200) / x ** 3, 0), 1 / 3, 1e-3);
ck('7', xlim((x) => (1 - xcos(x) * xcos(2 * x) * xcos(3 * x)) / (x * x), 0), 7, 1e-3);
ck('r/(n2+r2)', (() => { let s = 0; const n = 1e5; for (let r = 1; r <= n; r++) s += r / (n * n + r * r); return s; })(), xln(2) / 2, 1e-4);
ck('x - x2 ln', (() => { const x = 1e4; return x - x * x * xln(1 + 1 / x); })(), 0.5, 1e-3);
ck('xtan3x', xlim((x) => (x * xtan(3 * x) - 3 * x * xtan(x)) / (1 - xcos(3 * x)) ** 2, 0), 32 / 81, 1e-2);
ck('(1+x)^{1/x}-e over x', xlim((x) => ((1 + x) ** (1 / x) - xe) / x, 0), -xe / 2, 1e-2);
ck('((1+x)^{1/x}/e)^{1/x}', xlim((x) => ((1 + x) ** (1 / x) / xe) ** (1 / x), 0), xexp(-0.5), 2e-2);
ck('sin^2 pi sqrt', (() => { const n = 1e6; return xsin(xPI * Math.sqrt(n * n + n)) ** 2; })(), 1, 1e-3);
ck('4/e', (() => { const n = 1e5; let s = 0; for (let k = 1; k <= n; k++) s += xln(n + k); return xexp(s / n) / n; })(), 4 / xe, 1e-4);
ck('cos(sin)-cos', xlim((x) => (xcos(xsin(x)) - xcos(x)) / x ** 4, 0), 1 / 6, 1e-2);
ck('x2(e^(2/x)-...)', (() => { const x = 1e4; return x * x * (xexp(2 / x) - xexp(2 / (x + 1))); })(), 2, 1e-3);
ck('cbrt 6,3', (() => { const x = 1e5; return Math.cbrt(x ** 3 + 6 * x ** 2) - Math.cbrt(x ** 3 - 3 * x ** 2); })(), 3, 1e-3);
ck('n2(1-cos)', (() => { const n = 1e4; return n * n * (1 - xcos(Math.sqrt(8) / n)); })(), 4, 1e-3);
ck('cos2x,cos4x', xlim((x) => (3 + -4 * xcos(2 * x) + xcos(4 * x)) / x ** 4, 0, 1), 8, 2e-2);
ck('cos7-cos3', xlim((x) => (xcos(3 * x) - xcos(7 * x)) / (x * x), 0), 20, 1e-3);
ck('(1-cos)/x', xlim((x) => (1 - xcos(x)) / x, 0, 1), 0, 1e-2);
ck('sin1/x ln', xlim((x) => (xln(Math.sin(x)) / xln(x)), 0, 1), 1, 2e-1);
ck('prod', (() => { let p = 1; const n = 1e5; for (let k = 2; k <= n; k++) p *= 1 - 1 / (k * k); return p; })(), 0.5, 1e-4);
ck('(1+1/n)^{n^2}/e^n', (() => { const n = 1e4; return xexp(n * n * xln(1 + 1 / n) - n); })(), xexp(-0.5), 1e-3);
ck('pi/4 sum', (() => { let s = 0; const n = 1e5; for (let r = 1; r <= n; r++) s += n / (n * n + r * r); return s; })(), xPI / 4, 1e-4);
ck('ln2 sum', (() => { let s = 0; const n = 1e5; for (let r = 1; r <= n; r++) s += 1 / (n + r); return s; })(), xln(2), 1e-4);
ck('e^(a... (2^x+4^x+8^x)/3)^(1/x)', xlim((x) => ((2 ** x + 4 ** x + 8 ** x) / 3) ** (1 / x), 0), 4, 1e-3);
ck('x^2 ln... cot^(1/ln x)', (() => { const x = 1e-8; return Math.exp(xln(1 / xtan(x)) / xln(x)); })(), 1 / xe, 2e-2);
ck('xk lim', xlim((x) => (xcos(2 * x) - 1) / (x * x), 0), -2, 1e-3);

Object.assign(XG, {
  xm1: { title: 'Match: standard limits at 0', passage: XR`<p>Match each limit in List I (as $x\to0$) with its value in List II.</p>`,
    list1: [XR`A. $\displaystyle\lim\dfrac{\tan3x}{\sin2x}$`, XR`B. $\displaystyle\lim\dfrac{1-\cos4x}{x^2}$`, XR`C. $\displaystyle\lim\dfrac{5^x-1}{x\ln5}$`, XR`D. $\displaystyle\lim(1+2x)^{1/x}$`],
    list2: [XR`p. $1$`, XR`q. $\dfrac32$`, XR`r. $8$`, XR`s. $e^2$`, XR`t. $2$`] },
  xm2: { title: 'Match: limits as x tends to infinity', passage: XR`<p>Match each limit in List I (as $x\to\infty$) with its value in List II.</p>`,
    list1: [XR`A. $\displaystyle\lim\dfrac{2x^3+x}{x^3-1}$`, XR`B. $\displaystyle\lim\left(\sqrt{x^2+3x}-x\right)$`, XR`C. $\displaystyle\lim\left(1+\dfrac3x\right)^x$`, XR`D. $\displaystyle\lim\dfrac{\sin x}{x}$`],
    list2: [XR`p. $\dfrac32$`, XR`q. $2$`, XR`r. $e^3$`, XR`s. $0$`] },
  xm3: { title: 'Match: limits that are derivatives of $f(x)=x^3$ at $2$', passage: XR`<p>Let $f(x)=x^3$. Match each limit in List I with its value in List II.</p>`,
    list1: [XR`A. $\displaystyle\lim_{h\to0}\dfrac{f(2+h)-f(2)}h$`, XR`B. $\displaystyle\lim_{h\to0}\dfrac{f(2+h)-f(2-h)}h$`, XR`C. $\displaystyle\lim_{x\to2}\dfrac{f(x)-f(2)}{x^2-4}$`, XR`D. $\displaystyle\lim_{h\to0}\dfrac{f(2+h)-f(2)}{2h}$`],
    list2: [XR`p. $3$`, XR`q. $6$`, XR`r. $12$`, XR`s. $24$`] },
  xm4: { title: 'Match: how limits at 0 behave', passage: XR`<p>Match each limit in List I with what happens, from List II.</p>`,
    list1: [XR`A. $\displaystyle\lim_{x\to0}x\sin\dfrac1x$`, XR`B. $\displaystyle\lim_{x\to0^+}\dfrac1{\sin x}$`, XR`C. $\displaystyle\lim_{x\to0}\dfrac{|x|}x$`, XR`D. $\displaystyle\lim_{x\to0^+}x^x$`],
    list2: [XR`p. equals $0$`, XR`q. equals $1$`, XR`r. does not exist (two different one-sided limits)`, XR`s. is $+\infty$`] },
  xm5: { title: 'Match: limits of sequences', passage: XR`<p>Match each limit in List I (as $n\to\infty$) with its value in List II.</p>`,
    list1: [XR`A. $\displaystyle\lim\left(1+\dfrac1n\right)^{2n}$`, XR`B. $\displaystyle\lim n^{1/n}$`, XR`C. $\displaystyle\lim\dfrac{1+2+\cdots+n}{n^2}$`, XR`D. $\displaystyle\lim\dfrac{(n!)^{1/n}}n$`],
    list2: [XR`p. $\dfrac12$`, XR`q. $1$`, XR`r. $e^2$`, XR`s. $\dfrac1e$`] },
  xm6: { title: 'Match: the constant that makes the limit work', passage: XR`<p>In each row of List I, $a>0$ is a constant chosen so that the limit (as $x\to0$) has the stated value. Match each row with the value of $a$ in List II.</p>`,
    list1: [XR`A. $\displaystyle\lim\dfrac{1-\cos ax}{x^2}=8$`, XR`B. $\displaystyle\lim\dfrac{\sin ax}{x}=3$`, XR`C. $\displaystyle\lim\dfrac{\tan ax}{\sin3x}=2$`, XR`D. $\displaystyle\lim(1+ax)^{1/x}=e^5$`],
    list2: [XR`p. $3$`, XR`q. $4$`, XR`r. $5$`, XR`s. $6$`] },
  xm7: { title: 'Match: the first non-zero series coefficient', passage: XR`<p>Match each limit in List I (as $x\to0$) with its value in List II.</p>`,
    list1: [XR`A. $\displaystyle\lim\dfrac{e^x-1-x}{x^2}$`, XR`B. $\displaystyle\lim\dfrac{x-\sin x}{x^3}$`, XR`C. $\displaystyle\lim\dfrac{\cos x-1+\frac{x^2}2}{x^4}$`, XR`D. $\displaystyle\lim\dfrac{\tan x-x}{x^3}$`],
    list2: [XR`p. $\dfrac13$`, XR`q. $\dfrac1{24}$`, XR`r. $\dfrac16$`, XR`s. $\dfrac12$`] },
  xm8: { title: 'Match: sums that become integrals', passage: XR`<p>Match each limit in List I (as $n\to\infty$) with its value in List II.</p>`,
    list1: [XR`A. $\displaystyle\lim\sum_{r=1}^{n}\dfrac1{n+r}$`, XR`B. $\displaystyle\lim\sum_{r=1}^{n}\dfrac n{n^2+r^2}$`, XR`C. $\displaystyle\lim\dfrac1{n^3}\sum_{r=1}^{n}r^2$`, XR`D. $\displaystyle\lim\dfrac1n\sum_{r=1}^{n}e^{r/n}$`],
    list2: [XR`p. $\dfrac13$`, XR`q. $e-1$`, XR`r. $\ln2$`, XR`s. $\dfrac\pi4$`] },
  xp1: { title: 'Passage: a recursive sequence', passage: XR`<p>A sequence is defined by $a_1=1$ and $a_{n+1}=\sqrt{6+a_n}$. It can be shown that it is increasing and that every term is less than $3$, so it converges to a limit $L$.</p>` },
  xp2: { title: 'Passage: a function known only at one point', passage: XR`<p>$f$ is differentiable on $\mathbb R$ with $f(0)=0$ and $f'(0)=3$. Use only the definition of the derivative as a limit.</p>` },
});

XIT.push(
  // ---- L2 ----
  M(2, 'standard limits', XR`$\displaystyle\lim_{x\to0}\dfrac{\sin5x}{\tan2x}=$`, XR`$\dfrac52$`, [XR`$\dfrac25$`, '$5$', '$1$'],
    XR`<p>Write $\dfrac{\sin5x}{\tan2x}=\dfrac{\sin5x}{5x}\cdot\dfrac{2x}{\tan2x}\cdot\dfrac{5x}{2x}$. The first two factors tend to $1$ and the last is $\dfrac52$.</p>`, 'Each angle is divided by its own coefficient; the leftover ratio is 5/2, not 2/5.'),
  M(2, 'factorising', XR`$\displaystyle\lim_{x\to3}\dfrac{x^3-27}{x^2-9}=$`, XR`$\dfrac92$`, ['$9$', '$3$', XR`$\dfrac{27}2$`],
    XR`<p>Factor: $x^3-27=(x-3)(x^2+3x+9)$ and $x^2-9=(x-3)(x+3)$. Cancel $(x-3)$ and put $x=3$: $\dfrac{9+9+9}{6}=\dfrac{27}6=\dfrac92$.</p>`, 'Cancel the common factor first; direct substitution gives 0/0.'),
  I(2, 'limits at infinity', XR`$\displaystyle\lim_{x\to\infty}\dfrac{\sqrt{9x^2+1}}{x+2}=$`, 3,
    XR`<p>Divide top and bottom by $x$ (for $x>0$, $\sqrt{9x^2+1}/x=\sqrt{9+1/x^2}$): $\dfrac{\sqrt{9+1/x^2}}{1+2/x}\to\dfrac{3}{1}=3$.</p>`, 'Divide by the highest power of x; the square root of 9x² behaves like 3x.', () => 3),
  A(2, 'standard limits', XR`$\displaystyle\lim_{x\to0}\dfrac{\sin(x^\circ)}{x}=\dfrac\pi{180}$, where $x^\circ$ means $x$ degrees.`, XR`The limit $\lim_{x\to0}\dfrac{\sin x}{x}=1$ holds only when $x$ is measured in radians.`, 0,
    XR`<p>$\sin(x^\circ)=\sin\dfrac{\pi x}{180}$, so the ratio is $\dfrac\pi{180}\cdot\dfrac{\sin(\pi x/180)}{\pi x/180}\to\dfrac\pi{180}$. A is true, and it is true exactly because the standard limit needs radians. R is the explanation.</p>`, 'The standard limit is a statement about radians; degrees bring in a factor of π/180.'),
  S(2, 'one-sided limits', XR`$\displaystyle\lim_{x\to0}\dfrac{|x|}{x}$ does not exist.`, XR`The left-hand limit is $-1$ and the right-hand limit is $+1$.`, 0,
    XR`<p>For $x<0$, $|x|=-x$ so the ratio is $-1$; for $x>0$ it is $+1$. The one-sided limits differ, so the two-sided limit does not exist. Both statements are true.</p>`, 'The two-sided limit exists only when both one-sided limits exist and are equal.'),
  M(2, 'greatest integer', XR`Find $\displaystyle\lim_{x\to2^-}\big([x]+x\big)$, where $[x]$ is the greatest integer function.`, '$3$', ['$4$', '$2$', 'does not exist'],
    XR`<p>Just left of $2$, $[x]=1$. And $x\to2$. So the sum tends to $1+2=3$.</p>`, '[x] jumps at 2: from the left it is 1, not 2.'),
  // ---- L3 ----
  M(3, 'series expansion', XR`$\displaystyle\lim_{x\to0}\dfrac{\cos x-\cos3x}{x^2}=$`, '$4$', ['$-4$', '$2$', '$8$'],
    XR`<p>$\cos x\approx1-\dfrac{x^2}2$ and $\cos3x\approx1-\dfrac{9x^2}2$. The difference is $\dfrac{8x^2}2=4x^2$. Divide by $x^2$: $4$. (Or: $\cos x-\cos3x=2\sin2x\sin x\approx2\cdot2x\cdot x$.)</p>`, 'The order of subtraction matters: cos x − cos 3x is positive for small x.'),
  I(3, 'derivative form', XR`If $f$ is differentiable at $2$ with $f'(2)=5$, find $\displaystyle\lim_{h\to0}\dfrac{f(2+3h)-f(2-h)}{h}$.`, 20,
    XR`<p>Add and subtract $f(2)$: $\dfrac{f(2+3h)-f(2)}{h}+\dfrac{f(2)-f(2-h)}{h}$. The first part is $3\cdot\dfrac{f(2+3h)-f(2)}{3h}\to3f'(2)$. The second is $\dfrac{f(2-h)-f(2)}{-h}\to f'(2)$. Total $4f'(2)=20$.</p>`, 'The step sizes 3h and −h are different: each part picks up its own factor.', () => 4 * 5),
  M(3, '$1^\\infty$ form', XR`$\displaystyle\lim_{x\to\infty}\left(\dfrac{x^2+1}{x^2-1}\right)^{x^2}=$`, '$e^2$', ['$e$', '$1$', '$e^{1/2}$'],
    XR`<p>Base $=1+\dfrac2{x^2-1}$. The exponent times the excess: $x^2\cdot\dfrac2{x^2-1}\to2$. So the limit is $e^2$.</p>`, 'Use the exponent × (base − 1) rule; the exponent here is x², not x.'),
  M(3, 'sums as integrals', XR`$\displaystyle\lim_{n\to\infty}\dfrac1n\sum_{k=1}^{n}e^{k/n}=$`, '$e-1$', ['$e$', '$1$', '$e+1$'],
    XR`<p>This is a Riemann sum for $\int_0^1e^x\,dx$ with the sample at the right end of each strip. The value is $e-1$.</p>`, 'The sum starts at k = 1 but that does not change the limit; no term is missing in the integral.'),
  N(3, 'standard limits', XR`Evaluate $\displaystyle\lim_{x\to0}\dfrac{3^x-2^x}{x}$ (2 decimal places).`, 0.41, 0.01,
    XR`<p>$3^x-2^x=(3^x-1)-(2^x-1)$ and $\dfrac{a^x-1}x\to\ln a$. So the limit is $\ln3-\ln2=\ln1.5\approx0.405$, i.e. $0.41$.</p>`, 'The limit is a difference of logarithms, ln 3 − ln 2, not ln(3 − 2).', () => Math.log(1.5)),
  I(3, 'finding constants', XR`If $\displaystyle\lim_{x\to0}\dfrac{x+ax\cos x-b\sin x}{x^3}=1$, find $4(a+b)$.`, -16,
    XR`<p>Expand: $x+a\left(x-\dfrac{x^3}2\right)-b\left(x-\dfrac{x^3}6\right)=(1+a-b)x+\left(-\dfrac a2+\dfrac b6\right)x^3+\cdots$</p><p>For a finite limit the $x$-coefficient must vanish: $b=1+a$. The $x^3$ coefficient must be 1: $-\dfrac a2+\dfrac{1+a}6=1$, so $-3a+1+a=6$, $a=-\dfrac52$, $b=-\dfrac32$. Then $4(a+b)=4(-4)=-16$.</p>`, 'Two conditions, two unknowns: first kill the x term, then match the x³ term.', () => 4 * (-2.5 + -1.5)),
  A(3, 'squeeze', XR`$\displaystyle\lim_{x\to0}x\sin\dfrac1x=0$ although $\displaystyle\lim_{x\to0}\sin\dfrac1x$ does not exist.`, XR`$\left|x\sin\dfrac1x\right|\le|x|$ for every $x\ne0$, and $|x|\to0$.`, 0,
    XR`<p>$-|x|\le x\sin\frac1x\le|x|$ and both bounds tend to 0, so by squeeze the limit is 0. $\sin\frac1x$ oscillates between $-1$ and $1$ infinitely often near 0, so it has no limit. R explains A.</p>`, 'A bounded oscillating factor times something that tends to 0 gives 0.'),
  S(3, '$1^\\infty$ form', XR`$\displaystyle\lim_{x\to0}(1+x)^{1/x}=e$.`, XR`$\displaystyle\lim_{x\to\infty}(1+x)^{1/x}=e$.`, 1,
    XR`<p>Statement I is the standard limit. For II, $(1+x)^{1/x}=e^{\ln(1+x)/x}$ and $\dfrac{\ln(1+x)}x\to0$ as $x\to\infty$, so the limit is $e^0=1$. Statement II is false.</p>`, 'The form (1 + small)^(large) needs the base to tend to 1; here the base tends to ∞.'),
  M(3, 'inverse trigonometric', XR`$\displaystyle\lim_{x\to0}\dfrac{\sin^{-1}x-\tan^{-1}x}{x^3}=$`, XR`$\dfrac12$`, [XR`$\dfrac16$`, XR`$-\dfrac12$`, XR`$\dfrac13$`],
    XR`<p>$\sin^{-1}x=x+\dfrac{x^3}6+\cdots$ and $\tan^{-1}x=x-\dfrac{x^3}3+\cdots$. Difference: $\left(\dfrac16+\dfrac13\right)x^3=\dfrac{x^3}2$. So the limit is $\dfrac12$.</p>`, 'The cubic term of tan⁻¹x is negative: subtracting it adds 1/3.'),
  I(3, 'limits at infinity', XR`$\displaystyle\lim_{x\to\infty}\left(\sqrt[3]{x^3+3x^2}-x\right)=$`, 1,
    XR`<p>$\sqrt[3]{x^3+3x^2}=x\left(1+\dfrac3x\right)^{1/3}\approx x\left(1+\dfrac1x\right)=x+1$. So the difference tends to $1$.</p>`, 'Expand (1 + 3/x)^(1/3) to first order; the 1/3 and the 3 cancel.', () => 1),
  M(3, 'sandwich', XR`$\displaystyle\lim_{n\to\infty}\left(\dfrac1{\sqrt{n^2+1}}+\dfrac1{\sqrt{n^2+2}}+\cdots+\dfrac1{\sqrt{n^2+n}}\right)=$`, '$1$', ['$0$', XR`$\dfrac12$`, XR`$\infty$`],
    XR`<p>There are $n$ terms. Each is between $\dfrac1{\sqrt{n^2+n}}$ and $\dfrac1{\sqrt{n^2+1}}$, so the sum is between $\dfrac n{\sqrt{n^2+n}}$ and $\dfrac n{\sqrt{n^2+1}}$. Both bounds tend to 1. By squeeze the limit is $1$.</p>`, 'n terms each tending to 0 is not automatically 0: count the terms.'),
  I(3, 'standard limits', XR`$\displaystyle\lim_{x\to0}\dfrac{(e^{6x}-1)\tan4x}{x^2}=$`, 24,
    XR`<p>$\dfrac{e^{6x}-1}{x}\to6$ and $\dfrac{\tan4x}{x}\to4$. The product is $24$.</p>`, 'Split the product into two standard limits; do not expand everything.', () => 24),
  I(3, 'factorising', XR`$\displaystyle\lim_{x\to2}\dfrac{x^{10}-1024}{x-2}=$`, 5120,
    XR`<p>This is the derivative of $x^{10}$ at $2$: $10\cdot2^9=10\cdot512=5120$. Or use $\dfrac{x^n-a^n}{x-a}\to na^{n-1}$.</p>`, 'The answer is n·aⁿ⁻¹ with a = 2, not n·aⁿ.', () => 10 * 2 ** 9),
  // ---- matches (L3-L5) ----
  MT(3, 'standard limits', 'xm1', 'A-q, B-r, C-p, D-s', ['A-t, B-r, C-p, D-s', 'A-q, B-t, C-p, D-s', 'A-q, B-r, C-s, D-p'],
    XR`<p>A: $\dfrac{\tan3x}{\sin2x}\to\dfrac32$ (q). B: $\dfrac{1-\cos4x}{x^2}\to\dfrac{16}2=8$ (r). C: $\dfrac{5^x-1}{x}\to\ln5$, so the ratio is $1$ (p). D: $(1+2x)^{1/x}\to e^2$ (s).</p>`, 'In B the coefficient is squared before halving: 4² / 2 = 8.'),
  MT(3, 'limits at infinity', 'xm2', 'A-q, B-p, C-r, D-s', ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-s, B-p, C-r, D-q'],
    XR`<p>A: ratio of leading coefficients $2/1=2$ (q). B: $\sqrt{x^2+3x}-x=\dfrac{3x}{\sqrt{x^2+3x}+x}\to\dfrac32$ (p). C: $(1+3/x)^x\to e^3$ (r). D: $|\sin x|\le1$ so $\dfrac{\sin x}x\to0$ (s).</p>`, 'The sine does not have a limit, but sin x / x does: the denominator wins.'),
  MT(3, 'derivative form', 'xm3', 'A-r, B-s, C-p, D-q', ['A-r, B-q, C-p, D-s', 'A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p'],
    XR`<p>$f'(2)=3\cdot4=12$. A is $f'(2)=12$ (r). B is $2f'(2)=24$ (s). C: $\dfrac{f(x)-f(2)}{x-2}\cdot\dfrac{x-2}{x^2-4}\to12\cdot\dfrac14=3$ (p). D is $\dfrac12f'(2)=6$ (q).</p>`, 'Check what the step size is in the denominator: it decides the multiple of f′(2).'),
  MT(4, 'one-sided limits', 'xm4', 'A-p, B-s, C-r, D-q', ['A-p, B-s, C-q, D-r', 'A-q, B-s, C-r, D-p', 'A-r, B-s, C-p, D-q'],
    XR`<p>A: $|x\sin\frac1x|\le|x|\to0$ (p). B: $\sin x\to0^+$, so $\dfrac1{\sin x}\to+\infty$ (s). C: the one-sided limits are $-1$ and $1$ (r). D: $x^x=e^{x\ln x}$ and $x\ln x\to0$, so the limit is $1$ (q).</p>`, 'x^x at 0 is not 0^0 = 0: the exponent also shrinks.'),
  MT(4, 'sequences', 'xm5', 'A-r, B-q, C-p, D-s', ['A-r, B-p, C-q, D-s', 'A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p'],
    XR`<p>A: $(1+\frac1n)^{2n}=\left[(1+\frac1n)^n\right]^2\to e^2$ (r). B: $n^{1/n}=e^{\ln n/n}\to1$ (q). C: $\dfrac{n(n+1)/2}{n^2}\to\dfrac12$ (p). D: by Stirling, $(n!)^{1/n}\approx n/e$, so the limit is $\dfrac1e$ (s).</p>`, 'Stirling: (n!)^(1/n) grows like n/e, so dividing by n leaves 1/e.'),
  MT(4, 'finding constants', 'xm6', 'A-q, B-p, C-s, D-r', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-s, B-p, C-q, D-r'],
    XR`<p>A: $\dfrac{1-\cos ax}{x^2}\to\dfrac{a^2}2=8$, so $a=4$ (q). B: $\dfrac{\sin ax}x\to a=3$ (p). C: $\dfrac{\tan ax}{\sin3x}\to\dfrac a3=2$, so $a=6$ (s). D: $(1+ax)^{1/x}\to e^a=e^5$, so $a=5$ (r).</p>`, 'In A the limit is a²/2, so a² = 16.'),
  MT(4, 'series expansion', 'xm7', 'A-s, B-r, C-q, D-p', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-s, B-q, C-r, D-p'],
    XR`<p>$e^x-1-x\approx\dfrac{x^2}2$ gives $\dfrac12$ (s). $x-\sin x\approx\dfrac{x^3}6$ gives $\dfrac16$ (r). $\cos x-1+\dfrac{x^2}2\approx\dfrac{x^4}{24}$ gives $\dfrac1{24}$ (q). $\tan x-x\approx\dfrac{x^3}3$ gives $\dfrac13$ (p).</p>`, 'tan x − x has 1/3, while x − sin x has 1/6: do not swap them.'),
  MT(5, 'sums as integrals', 'xm8', 'A-r, B-s, C-p, D-q', ['A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-r, B-p, C-s, D-q'],
    XR`<p>A: $\dfrac1n\sum\dfrac1{1+r/n}\to\int_0^1\dfrac{dx}{1+x}=\ln2$ (r). B: $\dfrac1n\sum\dfrac1{1+(r/n)^2}\to\int_0^1\dfrac{dx}{1+x^2}=\dfrac\pi4$ (s). C: $\int_0^1x^2dx=\dfrac13$ (p). D: $\int_0^1e^xdx=e-1$ (q).</p>`, 'Pull out one factor 1/n to make each sum look like (1/n) Σ f(r/n).'),
  // ---- L4 ----
  M(4, 'series expansion', XR`$\displaystyle\lim_{x\to0}\dfrac{\tan(\tan x)-\sin(\sin x)}{\tan x-\sin x}=$`, '$2$', ['$1$', XR`$\dfrac12$`, '$3$'],
    XR`<p>To third order: $\tan x=x+\dfrac{x^3}3$, $\sin x=x-\dfrac{x^3}6$. Then $\tan(\tan x)\approx\tan x+\dfrac{\tan^3x}3\approx x+\dfrac{2x^3}3$ and $\sin(\sin x)\approx\sin x-\dfrac{\sin^3x}6\approx x-\dfrac{x^3}3$. The numerator is $x^3$. The denominator is $\dfrac{x^3}3+\dfrac{x^3}6=\dfrac{x^3}2$. Ratio: $2$.</p>`, 'Both numerator and denominator are of order x³: expand each to that order.'),
  N(4, 'series expansion', XR`Evaluate $\displaystyle\lim_{x\to0}\dfrac{e^{x^2}-\cos x}{x^2}$ (2 decimal places).`, 1.5, 0.01,
    XR`<p>$e^{x^2}\approx1+x^2$ and $\cos x\approx1-\dfrac{x^2}2$. The difference is $\dfrac{3x^2}2$, so the limit is $\dfrac32=1.50$.</p>`, 'cos x is subtracted: its −x²/2 turns into +x²/2.', () => 1.5),
  M(4, 'sequences', XR`$\displaystyle\lim_{n\to\infty}\dfrac{(n!)^{1/n}}n=$`, XR`$\dfrac1e$`, ['$1$', '$e$', '$0$'],
    XR`<p>Let $y_n=\dfrac1n\ln\dfrac{n!}{n^n}=\dfrac1n\sum_{k=1}^n\ln\dfrac kn\to\int_0^1\ln x\,dx=-1$. So the limit is $e^{-1}$.</p>`, 'Take logs and turn the sum into an integral; ∫₀¹ ln x dx = −1.'),
  I(4, 'finding constants', XR`If $\displaystyle\lim_{x\to0}\dfrac{ae^x-b\cos x+ce^{-x}}{x\sin x}=2$, find $100a+10b+c$.`, 121,
    XR`<p>Expand the numerator: $a\left(1+x+\dfrac{x^2}2\right)-b\left(1-\dfrac{x^2}2\right)+c\left(1-x+\dfrac{x^2}2\right)=(a-b+c)+(a-c)x+\dfrac{a+b+c}2x^2+\cdots$. The denominator is $\approx x^2$.</p><p>Finite limit needs $a-b+c=0$ and $a-c=0$. Then the limit is $\dfrac{a+b+c}2=2$, so $a+b+c=4$. From $a=c$, $b=2a$: $4a=4$, so $a=1,b=2,c=1$. $100+20+1=121$.</p>`, 'Three conditions for three unknowns: constant term, x term, then the x² coefficient.', () => 121),
  M(4, '$1^\\infty$ form', XR`$\displaystyle\lim_{x\to0}\left(\dfrac{1+\tan x}{1+\sin x}\right)^{1/x^3}=$`, XR`$\sqrt e$`, ['$e$', '$1$', '$e^2$'],
    XR`<p>Base $=1+\dfrac{\tan x-\sin x}{1+\sin x}$. The excess is $\approx\dfrac{x^3}2$. Exponent × excess $\to\dfrac{x^3}2\cdot\dfrac1{x^3}=\dfrac12$. The limit is $e^{1/2}$.</p>`, 'tan x − sin x is of order x³ (not x): use x³/2.'),
  N(4, '$1^\\infty$ form', XR`Evaluate $\displaystyle\lim_{x\to0}\left(\dfrac{\tan x}x\right)^{1/x^2}$ (2 decimal places).`, 1.4, 0.01,
    XR`<p>$\dfrac{\tan x}x=1+\dfrac{x^2}3+\cdots$. Exponent × excess $=\dfrac1{x^2}\cdot\dfrac{x^2}3=\dfrac13$. The limit is $e^{1/3}\approx1.396\approx1.40$.</p>`, 'Tan has +x³/3 (so the limit is above 1); sin would give e^(−1/6).', () => Math.exp(1 / 3)),
  M(4, 'limits at infinity', XR`$\displaystyle\lim_{x\to\infty}x^2\ln\cos\dfrac1x=$`, XR`$-\dfrac12$`, [XR`$\dfrac12$`, '$0$', '$-1$'],
    XR`<p>Put $t=\dfrac1x$: $\dfrac{\ln\cos t}{t^2}$ as $t\to0$. $\ln\cos t\approx-\dfrac{t^2}2$. The limit is $-\dfrac12$.</p>`, 'ln cos t is negative for small t.'),
  M(4, 'L\'Hopital', XR`$\displaystyle\lim_{x\to0}\left(\dfrac1{x^2}-\cot^2x\right)=$`, XR`$\dfrac23$`, ['$0$', XR`$\dfrac13$`, '$1$'],
    XR`<p>$\cot x=\dfrac1x-\dfrac x3-\cdots$, so $\cot^2x=\dfrac1{x^2}-\dfrac23+\cdots$. Hence $\dfrac1{x^2}-\cot^2x\to\dfrac23$.</p>`, 'Subtracting two infinities: the leading 1/x² cancels, the next term decides.'),
  M(4, 'limits via integrals', XR`$\displaystyle\lim_{x\to0}\dfrac1{x^3}\int_0^x\sin(t^2)\,dt=$`, XR`$\dfrac13$`, ['$0$', '$1$', XR`$\dfrac12$`],
    XR`<p>The form is $\dfrac00$. By L'Hôpital (Leibniz rule) the limit is $\lim\dfrac{\sin(x^2)}{3x^2}=\dfrac13$. Or: $\sin t^2\approx t^2$, $\int_0^xt^2dt=\dfrac{x^3}3$.</p>`, 'The derivative of the integral is the integrand at the top limit: sin(x²).'),
  I(4, 'series expansion', XR`$\displaystyle\lim_{x\to0}\dfrac{1-\cos x\cos2x\cos3x}{x^2}=$`, 7,
    XR`<p>For small $x$, $\cos kx\approx1-\dfrac{k^2x^2}2$, so the product is $\approx1-\dfrac{(1+4+9)x^2}2$. Then $1-$product $=7x^2$. The limit is $7$.</p>`, 'The small corrections add (they do not multiply) at order x².', () => 7),
  N(4, 'sums as integrals', XR`$\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\dfrac r{n^2+r^2}$ (2 decimal places).`, 0.35, 0.01,
    XR`<p>$\dfrac r{n^2+r^2}=\dfrac1n\cdot\dfrac{r/n}{1+(r/n)^2}$. The sum tends to $\int_0^1\dfrac x{1+x^2}dx=\dfrac12\ln2\approx0.3466$, i.e. $0.35$.</p>`, 'Do not forget the factor 1/n that becomes dx.', () => Math.log(2) / 2),
  M(4, 'limits at infinity', XR`$\displaystyle\lim_{x\to\infty}\left(x-x^2\ln\left(1+\dfrac1x\right)\right)=$`, XR`$\dfrac12$`, ['$0$', '$1$', XR`$-\dfrac12$`],
    XR`<p>$\ln\left(1+\dfrac1x\right)=\dfrac1x-\dfrac1{2x^2}+\dfrac1{3x^3}-\cdots$. So $x^2\ln(\cdots)=x-\dfrac12+\dfrac1{3x}-\cdots$. Then $x-\left(x-\dfrac12+\cdots\right)\to\dfrac12$.</p>`, 'Stopping the series after 1/x gives 0: you need the second term.'),
  M(4, 'series expansion', XR`$\displaystyle\lim_{x\to0}\dfrac{x\tan3x-3x\tan x}{(1-\cos3x)^2}=$`, XR`$\dfrac{32}{81}$`, [XR`$\dfrac{8}{9}$`, XR`$\dfrac{16}{81}$`, XR`$\dfrac{32}{9}$`],
    XR`<p>$\tan3x=3x+9x^3$, $\tan x=x+\dfrac{x^3}3$. $x\tan3x=3x^2+9x^4$; $3x\tan x=3x^2+x^4$. Numerator $\approx8x^4$. $1-\cos3x\approx\dfrac{9x^2}2$, so the denominator is $\dfrac{81x^4}4$. Ratio: $8\cdot\dfrac4{81}=\dfrac{32}{81}$.</p>`, 'tan 3x = 3x + (3x)³/3 = 3x + 9x³.'),
  M(4, '$1^\\infty$ form', XR`$\displaystyle\lim_{x\to0^+}(\cot x)^{1/\ln x}=$`, XR`$\dfrac1e$`, ['$e$', '$1$', '$0$'],
    XR`<p>Take the log: $\dfrac{\ln\cot x}{\ln x}$. As $x\to0^+$, $\cot x\approx\dfrac1x$, so $\ln\cot x\approx-\ln x$ and the ratio $\to-1$. The limit is $e^{-1}$.</p>`, 'The base tends to ∞ and the exponent to 0: take logs.'),
  I(4, 'limits at infinity', XR`$\displaystyle\lim_{x\to\infty}\left(\sqrt[3]{x^3+6x^2}-\sqrt[3]{x^3-3x^2}\right)=$`, 3,
    XR`<p>$\sqrt[3]{x^3+6x^2}=x(1+6/x)^{1/3}\approx x+2$ and $\sqrt[3]{x^3-3x^2}\approx x-1$. The difference is $2-(-1)=3$.</p>`, 'The second root gives −1 and the minus sign in front makes it +1.', () => 3),
  I(4, 'series expansion', XR`$\displaystyle\lim_{n\to\infty}n^2\left(1-\cos\dfrac{\sqrt8}n\right)=$`, 4,
    XR`<p>$1-\cos t\approx\dfrac{t^2}2$ with $t=\dfrac{\sqrt8}n$: $n^2\cdot\dfrac{8}{2n^2}=4$.</p>`, 'Square the √8 before halving.', () => 4),
  I(4, 'limits of functions', XR`Let $f(x)=\displaystyle\lim_{n\to\infty}\dfrac{x^{2n}-1}{x^{2n}+1}$ for $x\ne0$. Find $2f(2)+3f\left(\dfrac12\right)+5f(1)$.`, -1,
    XR`<p>If $|x|>1$, $x^{2n}\to\infty$ so $f=1$. If $|x|<1$, $x^{2n}\to0$ so $f=-1$. At $x=1$: $\dfrac{1-1}{1+1}=0$. So $2(1)+3(-1)+5(0)=-1$.</p>`, 'The point x = 1 is separate: there the ratio is 0, not ±1.', () => 2 * 1 + 3 * -1 + 0),
  S(4, '$1^\\infty$ form', XR`$\displaystyle\lim_{x\to0}(1+x)^{1/x}=e$.`, XR`$\displaystyle\lim_{x\to0}(1+x^2)^{1/x}=e$.`, 1,
    XR`<p>I is the standard limit. For II, $(1+x^2)^{1/x}=\exp\left(\dfrac{\ln(1+x^2)}x\right)$ and $\dfrac{\ln(1+x^2)}x\approx x\to0$, so the limit is $e^0=1$. II is false: the excess $x^2$ must be paired with an exponent $1/x^2$.</p>`, 'Check that exponent × (base − 1) has a finite non-zero limit.'),
  SC(4, 'mixed forms', [XR`$\displaystyle\lim_{x\to0}\dfrac{\sin x}{|x|}$ does not exist.`, XR`$\displaystyle\lim_{x\to0^+}x^x=1$.`, XR`$\displaystyle\lim_{x\to\infty}\left(1+\dfrac1x\right)^{x^2}=e$.`, XR`$\displaystyle\lim_{x\to0}\dfrac{1-\cos x}{x}=0$.`], '3', ['1', '2', '4'],
    XR`<p>1: the one-sided limits are $-1$ and $1$, so true. 2: $e^{x\ln x}\to e^0=1$, true. 3: $(1+1/x)^{x^2}=\exp(x^2\ln(1+1/x))\approx e^{x}\to\infty$, false. 4: $\dfrac{1-\cos x}x\approx\dfrac x2\to0$, true. Three are correct.</p>`, 'In statement 3 the exponent is x², so the limit is infinite.'),
  A(4, '$1^\\infty$ form', XR`$\displaystyle\lim_{x\to\infty}\left(1+\dfrac1x\right)^x=e$ but $\displaystyle\lim_{x\to\infty}\left(1+\dfrac1x\right)^{x^2}=\infty$.`, XR`Whenever the base tends to $1$ and the exponent tends to $\infty$, the limit is $e$.`, 2,
    XR`<p>A is true: the second limit is $\exp(x^2\ln(1+1/x))\approx e^{x}\to\infty$. R is false: the limit is $e^L$ where $L=\lim(\text{exponent})(\text{base}-1)$, which can be any number, $0$ or $\pm\infty$. So A is true and R is false.</p>`, 'The 1^∞ form is indeterminate: it can be anything.'),
  X(4, 'standard limits', XR`Which of the following limits equal $1$?`, [XR`$\displaystyle\lim_{x\to0}\dfrac{\sin3x}{3x}$`, XR`$\displaystyle\lim_{x\to\infty}x\sin\dfrac1x$`, XR`$\displaystyle\lim_{x\to\infty}\dfrac{\sin x}x$`, XR`$\displaystyle\lim_{x\to0^+}x^x$`], [0, 1, 3],
    XR`<p>A: standard, $1$. B: put $t=1/x$: $\dfrac{\sin t}t\to1$. C: $0$ (bounded over large). D: $e^{x\ln x}\to e^0=1$. So A, B and D.</p>`, 'Sin x over x equals 1 only when the angle tends to 0.'),
  X(4, 'existence', XR`Which of the following limits exist (as finite numbers)?`, [XR`$\displaystyle\lim_{x\to0}\dfrac{|x|}x$`, XR`$\displaystyle\lim_{x\to0}x\left[\dfrac1x\right]$`, XR`$\displaystyle\lim_{x\to0}\sin\dfrac1x$`, XR`$\displaystyle\lim_{x\to0}x^2\sin\dfrac1x$`], [1, 3],
    XR`<p>A has one-sided limits $-1,1$: no. B: $[1/x]=\frac1x-\{\frac1x\}$, so $x[1/x]=1-x\{1/x\}\to1$ from both sides: yes. C oscillates: no. D: bounded by $x^2$: $0$, yes. So B and D.</p>`, 'x[1/x] looks like a jump function but the fractional part is multiplied by x → 0.'),
  X(4, 'limits at infinity', XR`Which of the following limits (as $x\to\infty$) equal $\dfrac12$?`, [XR`$\sqrt{x^2+x}-x$`, XR`$x\left(e^{1/(2x)}-1\right)$`, XR`$x^2\left(1-\cos\dfrac1x\right)$`, XR`$x\sin\dfrac1x$`], [0, 1, 2],
    XR`<p>A: $\dfrac{x}{\sqrt{x^2+x}+x}\to\dfrac12$. B: $x\cdot\dfrac1{2x}=\dfrac12$. C: $x^2\cdot\dfrac1{2x^2}=\dfrac12$. D: $\to1$. So A, B, C.</p>`, 'D is the classic 1; do not mix it up with 1/2.'),
  X(4, 'algebra of limits', XR`Which statements about functions near $x=a$ are always true?`, [XR`If $\lim f$ and $\lim(f+g)$ both exist, then $\lim g$ exists.`, XR`If $\lim f$ and $\lim(fg)$ both exist, then $\lim g$ exists.`, XR`If $\lim f(x)=L$, then $\lim|f(x)|=|L|$.`, XR`If $\lim|f(x)|$ exists, then $\lim f(x)$ exists.`], [0, 2],
    XR`<p>A: $g=(f+g)-f$, true. B: false, e.g. $f=0$ and $g$ any function with no limit. C: $\big||f|-|L|\big|\le|f-L|$, true. D: false, take $f=1$ for $x>a$ and $-1$ for $x<a$. So A and C.</p>`, 'Dividing is not the same as subtracting: f can be zero.'),
  X(4, 'finding constants', XR`If $\displaystyle\lim_{x\to0}\dfrac{1-\cos ax}{x^2}=2$, which values of $a$ are possible?`, ['$2$', '$-2$', '$4$', XR`$\dfrac12$`], [0, 1],
    XR`<p>The limit is $\dfrac{a^2}2=2$, so $a^2=4$ and $a=\pm2$. Both $2$ and $-2$ work, since cosine is even.</p>`, 'The equation a² = 4 has two roots.'),
  X(4, 'series expansion', XR`For which pairs $(a,b)$ is $\displaystyle\lim_{x\to0}\dfrac{a\sin x+b\sin2x}{x^3}$ finite?`, ['$(2,-1)$', '$(-4,2)$', '$(1,1)$', '$(3,1)$'], [0, 1],
    XR`<p>$a\sin x+b\sin2x=(a+2b)x-\dfrac{a+8b}6x^3+\cdots$. Finite needs $a+2b=0$: $(2,-1)$ and $(-4,2)$ qualify. For $(1,1)$ and $(3,1)$, $a+2b\ne0$, so the limit is infinite.</p>`, 'Only the x term must vanish; x³ gives the value.'),
  // ---- L5 ----
  X(5, 'sequences', XR`Which of the following sequences converge?`, [XR`$\left(1+\dfrac1n\right)^n$`, XR`$(-1)^n\left(1+\dfrac1n\right)$`, XR`$n^{1/n}$`, XR`$\dfrac{\sin(n\pi/2)}n$`], [0, 2, 3],
    XR`<p>A tends to $e$. B alternates near $+1$ and $-1$: diverges. C tends to $1$. D is bounded over $n$: tends to $0$. So A, C, D.</p>`, 'A sequence of alternating signs with a fixed size does not converge.'),
  X(5, 'one-sided limits', XR`Which of the following limits (as $x\to0^+$) are equal to $0$?`, [XR`$x\ln x$`, XR`$\dfrac{\ln x}x$`, XR`$x^x$`, XR`$e^{-1/x}$`], [0, 3],
    XR`<p>A: $x\ln x\to0$. B: $\to-\infty$. C: $\to1$. D: $-1/x\to-\infty$, so $e^{-1/x}\to0$. So A and D.</p>`, 'Powers beat logarithms: x ln x → 0, but ln x / x does not.'),
  X(5, 'limits at infinity', XR`Which limits (as $x\to\infty$) are finite?`, [XR`$\sqrt{x^2+1}-x$`, XR`$x-\ln x$`, XR`$\dfrac{x^2+\sin x}{x^2-\cos x}$`, XR`$x^2e^{-x}$`], [0, 2, 3],
    XR`<p>A: $\dfrac1{\sqrt{x^2+1}+x}\to0$. B: $x$ outgrows $\ln x$, so $\to\infty$. C: $\to1$. D: exponential beats polynomial, $\to0$. So A, C, D.</p>`, 'A difference of two large quantities can be finite or infinite: compare growth.'),
  M(5, 'derivative and limits', XR`Let $f(x)=x^2\sin\dfrac1x$ for $x\ne0$ and $f(0)=0$. Which statement is true?`, XR`$f'(0)=0$ but $\displaystyle\lim_{x\to0}f'(x)$ does not exist`, [XR`$f'(0)$ does not exist`, XR`$f'(0)=0$ and $\displaystyle\lim_{x\to0}f'(x)=0$`, XR`$f'(0)=1$`],
    XR`<p>$f'(0)=\lim\dfrac{h^2\sin(1/h)}h=\lim h\sin\dfrac1h=0$. For $x\ne0$, $f'(x)=2x\sin\dfrac1x-\cos\dfrac1x$. The first term tends to 0 but $\cos\frac1x$ oscillates, so $\lim_{x\to0}f'(x)$ does not exist. The derivative exists at 0 but is not continuous there.</p>`, 'The derivative at a point and the limit of the derivative are different things.'),
  M(5, '$1^\\infty$ form', XR`$\displaystyle\lim_{x\to0}\left(\dfrac{(1+x)^{1/x}}e\right)^{1/x}=$`, XR`$e^{-1/2}$`, ['$1$', '$e^{1/2}$', '$e^{-1}$'],
    XR`<p>$(1+x)^{1/x}=\exp\left(\dfrac{\ln(1+x)}x\right)=\exp\left(1-\dfrac x2+\dfrac{x^2}3\right)$. Divide by $e$: $\exp\left(-\dfrac x2+\cdots\right)$. Raise to $\dfrac1x$: $\exp\left(-\dfrac12+\cdots\right)\to e^{-1/2}$.</p>`, 'You need ln(1+x)/x to two terms: 1 − x/2.'),
  N(5, '$1^\\infty$ form', XR`Evaluate $\displaystyle\lim_{x\to0}\dfrac{(1+x)^{1/x}-e}{x}$ (2 decimal places).`, -1.36, 0.01,
    XR`<p>$(1+x)^{1/x}=e\cdot\exp\left(-\dfrac x2+\cdots\right)=e\left(1-\dfrac x2+\cdots\right)$. So the numerator is $\approx-\dfrac{ex}2$ and the limit is $-\dfrac e2\approx-1.36$.</p>`, 'The limit is negative: (1+x)^(1/x) approaches e from below.', () => -Math.E / 2),
  N(5, 'sums and products', XR`Evaluate $\displaystyle\lim_{n\to\infty}\dfrac1n\Big[(n+1)(n+2)\cdots(2n)\Big]^{1/n}$ (2 decimal places).`, 1.47, 0.01,
    XR`<p>Take logs: $\ln L=\lim\dfrac1n\sum_{k=1}^n\ln\dfrac{n+k}n=\int_0^1\ln(1+x)\,dx=2\ln2-1$. So $L=e^{2\ln2-1}=\dfrac4e\approx1.47$.</p>`, 'Divide each factor by n to see the Riemann sum.', () => 4 / Math.E),
  N(5, 'series expansion', XR`Evaluate $\displaystyle\lim_{x\to0}\dfrac{\cos(\sin x)-\cos x}{x^4}$ (2 decimal places).`, 0.17, 0.01,
    XR`<p>$\sin^2x=x^2-\dfrac{x^4}3$ and $\sin^4x\approx x^4$. So $\cos(\sin x)=1-\dfrac{\sin^2x}2+\dfrac{\sin^4x}{24}=1-\dfrac{x^2}2+\dfrac{x^4}6+\dfrac{x^4}{24}$. And $\cos x=1-\dfrac{x^2}2+\dfrac{x^4}{24}$. The difference is $\dfrac{x^4}6$. The limit is $\dfrac16\approx0.17$.</p>`, 'The x⁴ term of sin²x (−x⁴/3) must be kept.', () => 1 / 6),
  I(5, 'sequences', XR`$\displaystyle\lim_{n\to\infty}\sin^2\left(\pi\sqrt{n^2+n}\right)=$`, 1,
    XR`<p>$\sqrt{n^2+n}=n+\dfrac12-\dfrac1{8n}+\cdots$. So $\pi\sqrt{n^2+n}=n\pi+\dfrac\pi2-\varepsilon_n$ with $\varepsilon_n\to0$. $\sin^2(n\pi+\frac\pi2-\varepsilon_n)=\cos^2\varepsilon_n\to1$.</p>`, 'Without the square, the limit would not exist (the sign alternates with n).', () => 1),
  I(5, 'limits at infinity', XR`$\displaystyle\lim_{x\to\infty}x^2\left(e^{2/x}-e^{2/(x+1)}\right)=$`, 2,
    XR`<p>Factor out $e^{2/(x+1)}$: the bracket is $e^{2/(x+1)}\left(e^{\delta}-1\right)$ with $\delta=\dfrac2x-\dfrac2{x+1}=\dfrac2{x(x+1)}$. For large $x$: $e^{2/(x+1)}\to1$ and $e^\delta-1\approx\delta\approx\dfrac2{x^2}$. Multiply by $x^2$: $2$.</p>`, 'Use the mean value idea: e^a − e^b ≈ e^a (a − b) for close a and b.', () => 2),
  I(5, 'finding constants', XR`If $\displaystyle\lim_{x\to0}\dfrac{a+b\cos2x+c\cos4x}{x^4}$ is finite and equals $8$, find $a^2+b^2+c^2$.`, 26,
    XR`<p>$\cos2x=1-2x^2+\dfrac{2x^4}3$ and $\cos4x=1-8x^2+\dfrac{32x^4}3$. Constant term: $a+b+c=0$. $x^2$ term: $-2b-8c=0$, so $b=-4c$. Then $a=3c$. $x^4$ term: $\dfrac23b+\dfrac{32}3c=\dfrac{-8c+32c}3=8c=8$, so $c=1$, $b=-4$, $a=3$. $9+16+1=26$.</p>`, 'Three unknowns need three conditions: x⁰, x², x⁴.', () => 26),
  SC(5, 'sequences', [XR`$\displaystyle\lim_{n\to\infty}(n!)^{1/n}=\infty$.`, XR`$\displaystyle\lim_{n\to\infty}\left(\dfrac1{n!}\right)^{1/n}=1$.`, XR`$\displaystyle\lim_{n\to\infty}\dfrac{(1+1/n)^{n^2}}{e^n}=e^{-1/2}$.`, XR`$\displaystyle\lim_{n\to\infty}\left(1-\dfrac1n\right)^n=1$.`], '2', ['1', '3', '4'],
    XR`<p>1: $(n!)^{1/n}\approx n/e\to\infty$: true. 2: it is $1/(n!)^{1/n}\to0$: false. 3: $n^2\ln(1+\frac1n)=n-\dfrac12+\cdots$, so the ratio $\to e^{-1/2}$: true. 4: the limit is $e^{-1}$: false. Two are correct.</p>`, 'Statement 4 is the mirror of the standard limit: it gives 1/e.'),
  PI(4, 'sequences', 'xp1', XR`Find the limit $L$ of the sequence.`, 3,
    XR`<p>At the limit, $a_{n+1}$ and $a_n$ are both $L$: $L=\sqrt{6+L}$. Square: $L^2-L-6=0$, so $(L-3)(L+2)=0$. The terms are positive, so $L=3$.</p>`, 'Reject the negative root L = −2.', () => 3),
  PM(5, 'sequences', 'xp1', XR`$\displaystyle\lim_{n\to\infty}\dfrac{3-a_{n+1}}{3-a_n}=$`, XR`$\dfrac16$`, [XR`$\dfrac13$`, XR`$\dfrac12$`, '$1$'],
    XR`<p>$3-a_{n+1}=3-\sqrt{6+a_n}=\dfrac{9-(6+a_n)}{3+\sqrt{6+a_n}}=\dfrac{3-a_n}{3+\sqrt{6+a_n}}$. As $a_n\to3$, the denominator tends to $3+3=6$. So the ratio tends to $\dfrac16$.</p>`, 'Multiply by the conjugate; the denominator tends to 6, not 3.'),
  PI(5, 'sequences', 'xp1', XR`Let $d_n=3-a_n$. The ratio $d_{n+1}/d_n$ tends to $r$. Find $\displaystyle\lim_{n\to\infty}\dfrac{d_{n+1}}{d_n}\cdot36$.`, 6,
    XR`<p>From the previous part $r=\dfrac16$ (the errors shrink geometrically by a factor $\frac16$ each step). $36\cdot\dfrac16=6$.</p>`, 'Use the value found in the previous item.', () => 36 / 6),
  PI(3, 'derivative form', 'xp2', XR`Find $\displaystyle\lim_{x\to0}\dfrac{f(4x)}{\sin3x}$.`, 4,
    XR`<p>$\dfrac{f(4x)}{\sin3x}=\dfrac{f(4x)-f(0)}{4x}\cdot\dfrac{3x}{\sin3x}\cdot\dfrac43$. The first factor $\to f'(0)=3$, the second $\to1$. So the limit is $3\cdot\dfrac43=4$.</p>`, 'Use f(0) = 0 to write f(4x) as a difference quotient.', () => 3 * 4 / 3),
  PI(4, 'derivative form', 'xp2', XR`Find $\displaystyle\lim_{x\to0}\dfrac{f(x)-f(-x)}x$.`, 6,
    XR`<p>$\dfrac{f(x)-f(0)}x\to3$ and $\dfrac{f(0)-f(-x)}x=\dfrac{f(-x)-f(0)}{-x}\to3$. The sum is $6$.</p>`, 'Two different one-sided pieces, each giving f′(0).', () => 6),
  PM(5, 'derivative form', 'xp2', XR`Which expression has limit $0$ as $x\to0$?`, XR`$\dfrac{f(x)+f(-x)}x$`, [XR`$\dfrac{f(x)}x$`, XR`$\dfrac{f(x)-f(-x)}x$`, XR`$\dfrac{f(2x)}{\sin x}$`],
    XR`<p>$f(x)+f(-x)=[f(x)-f(0)]+[f(-x)-f(0)]$. Divide by $x$: $\dfrac{f(x)-f(0)}x-\dfrac{f(-x)-f(0)}{-x}\to3-3=0$. The others tend to $3$, $6$ and $6$.</p>`, 'Check each against f′(0) = 3: only the sum f(x) + f(−x) cancels.'),
);

XGN.push(
  GX('xg01', 3, 'nat', 'integer', 'standard limits', (rng) => {
    const pa = int(rng, 2, 9), qa = int(rng, 2, 9);
    return { pa, qa, answer: pa * qa, tol: 0, q: XR`$\displaystyle\lim_{x\to0}\dfrac{(e^{${pa}x}-1)\tan${qa}x}{x^2}=$`, sol: XR`<p>$\dfrac{e^{${pa}x}-1}x\to${pa}$ and $\dfrac{\tan${qa}x}x\to${qa}$. The product is $${pa * qa}$.</p>` };
  }, (p) => Math.round(xlim((x) => (xexp(p.pa * x) - 1) * xtan(p.qa * x) / (x * x), 0))),
  GX('xg02', 3, 'nat', 'integer', 'standard limits', (rng) => {
    const q = int(rng, 2, 5), k = int(rng, 2, 4), pp = k * q;
    return { q0: q, k, pp, answer: k * k, tol: 0, q: XR`$\displaystyle\lim_{x\to0}\dfrac{1-\cos${pp}x}{1-\cos${q}x}=$`, sol: XR`<p>$1-\cos ax\approx\dfrac{a^2x^2}2$. The ratio tends to $\dfrac{${pp}^2}{${q}^2}=\left(\dfrac{${pp}}{${q}}\right)^2=${k * k}$.</p>` };
  }, (p) => Math.round(xlim((x) => (1 - xcos(p.pp * x)) / (1 - xcos(p.q0 * x)), 0))),
  GX('xg03', 4, 'nat', 'numeric', '$1^\\infty$ form', (rng) => {
    const a = int(rng, 1, 3), ans = Math.exp(-a * a / 6);
    return { a, answer: +ans.toFixed(3), tol: 0.01, q: XR`Evaluate $\displaystyle\lim_{x\to0}\left(\dfrac{\sin ${a === 1 ? '' : a}x}{${a === 1 ? '' : a}x}\right)^{1/x^2}$ (2 decimal places).`, sol: XR`<p>$\dfrac{\sin ax}{ax}=1-\dfrac{a^2x^2}6+\cdots$. Exponent × excess $=\dfrac1{x^2}\cdot\left(-\dfrac{${a * a}x^2}6\right)=-\dfrac{${a * a}}6$. The limit is $e^{-${a * a}/6}\approx${ans.toFixed(2)}$.</p>` };
  }, (p) => xlim((x) => ((xsin(p.a * x) / (p.a * x)) ** (1 / (x * x))), 0)),
  GX('xg04', 4, 'nat', 'integer', 'series expansion', (rng) => {
    const n = choose(rng, [3, 4, 7, 8]);
    const ans = n * (n + 1) * (2 * n + 1) / 12;
    return { n, answer: ans, tol: 0, q: XR`$\displaystyle\lim_{x\to0}\dfrac{1-${n === 3 ? '\\cos x\\cos2x\\cos3x' : `\\cos x\\cos2x\\cdots\\cos${n}x`}}{x^2}=$`, sol: XR`<p>$\cos kx\approx1-\dfrac{k^2x^2}2$, so the product is $\approx1-\dfrac{x^2}2\sum_{k=1}^{${n}}k^2$. The sum of squares is $\dfrac{${n}\cdot${n + 1}\cdot${2 * n + 1}}6=${n * (n + 1) * (2 * n + 1) / 6}$. The limit is half of that: $${ans}$.</p>` };
  }, (p) => { const f = (x) => { let c = 1; for (let k = 1; k <= p.n; k++) c *= xcos(k * x); return (1 - c) / (x * x); }; return Math.round(xlim(f, 0)); }),
  GX('xg05', 4, 'nat', 'integer', 'limits at infinity', (rng) => {
    const a = int(rng, 1, 8), b = choose(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((v) => (a + v) % 3 === 0));
    return { a, b, answer: (a + b) / 3, tol: 0, q: XR`$\displaystyle\lim_{x\to\infty}\left(\sqrt[3]{x^3+${a}x^2}-\sqrt[3]{x^3-${b}x^2}\right)=$`, sol: XR`<p>$\sqrt[3]{x^3+ax^2}=x(1+a/x)^{1/3}\approx x+\dfrac a3$ and $\sqrt[3]{x^3-bx^2}\approx x-\dfrac b3$. The difference is $\dfrac{a+b}3=\dfrac{${a + b}}3=${(a + b) / 3}$.</p>` };
  }, (p) => { const x = 1e5; return Math.round(Math.cbrt(x ** 3 + p.a * x ** 2) - Math.cbrt(x ** 3 - p.b * x ** 2)); }),
  GX('xg06', 3, 'mcq', 'single', 'standard limits', (rng) => {
    const a = int(rng, 2, 7), b = int(rng, 1, a - 1), c = int(rng, 2, 6);
    const val = (a - b) / c;
    const { options, answer } = shuffleOpts(rng, `$${frac(a - b, c)}$`, [`$${frac(a + b, c)}$`, `$${frac(b - a, c)}$`, `$${a - b}$`, `$${frac(a, c)}$`]);
    return { a, b, c, val, options, answer, q: XR`$\displaystyle\lim_{x\to0}\dfrac{e^{${a}x}-e^{${b}x}}{\sin${c}x}=$`, sol: XR`<p>Divide top and bottom by $x$: $\dfrac{e^{${a}x}-1}x-\dfrac{e^{${b}x}-1}x\to${a}-${b}$ and $\dfrac{\sin${c}x}x\to${c}$. So the limit is $\dfrac{${a - b}}{${c}}$.</p>` };
  }, (p) => { const v = xlim((x) => (xexp(p.a * x) - xexp(p.b * x)) / xsin(p.c * x), 0); return Math.abs(v - p.val) < 1e-3 ? p.answer : -1; }),
  GX('xg07', 4, 'mcq', 'single', '$1^\\infty$ form', (rng) => {
    const a = int(rng, 2, 6);
    const { options, answer } = shuffleOpts(rng, `$e^{-${a * a}/2}$`, [`$e^{-${a * a}}$`, `$e^{${a * a}/2}$`, `$e^{-${a}/2}$`]);
    return { a, options, answer, q: XR`$\displaystyle\lim_{x\to0}(\cos${a}x)^{1/x^2}=$`, sol: XR`<p>$\cos${a}x=1-\dfrac{${a * a}x^2}2+\cdots$. Exponent × excess $=\dfrac1{x^2}\cdot\left(-\dfrac{${a * a}x^2}2\right)=-\dfrac{${a * a}}2$. So the limit is $e^{-${a * a}/2}$.</p>` };
  }, (p) => { const v = xlim((x) => (xcos(p.a * x) ** (1 / (x * x))), 0, 1); return Math.abs(v - Math.exp(-p.a * p.a / 2)) < 1e-4 ? p.answer : -1; }),
  GX('xg08', 5, 'nat', 'numeric', 'sums as integrals', (rng) => {
    const k = int(rng, 1, 3), ans = Math.atan(k) / k;
    return { k, answer: +ans.toFixed(3), tol: 0.01, q: XR`Evaluate $\displaystyle\lim_{n\to\infty}\sum_{r=1}^{n}\dfrac n{n^2+${k * k}r^2}$ (2 decimal places).`, sol: XR`<p>Factor $n^2$ from the denominator: $\dfrac1n\cdot\dfrac1{1+${k * k}(r/n)^2}$. The sum tends to $\int_0^1\dfrac{dx}{1+${k * k}x^2}=\dfrac{\tan^{-1}${k}}{${k}}\approx${ans.toFixed(2)}$.</p>` };
  }, (p) => xsimp((x) => 1 / (1 + p.k * p.k * x * x), 0, 1)),
  GX('xg09', 5, 'nat', 'integer', 'finding constants', (rng) => {
    const c = int(rng, 1, 3), a = 3 * c, b = -4 * c;
    return { a, b, c, answer: a * a + b * b + c * c, tol: 0, q: XR`The limit $\displaystyle\lim_{x\to0}\dfrac{a+b\cos2x+c\cos4x}{x^4}$ is finite and equals ${8 * c}. Find $a^2+b^2+c^2$.`, sol: XR`<p>Using $\cos2x=1-2x^2+\dfrac{2x^4}3$ and $\cos4x=1-8x^2+\dfrac{32x^4}3$: the constant term gives $a+b+c=0$, the $x^2$ term gives $b=-4c$, and the $x^4$ term gives $8c=${8 * c}$. So $c=${c}$, $b=${b}$, $a=${a}$. Then $a^2+b^2+c^2=${a * a}+${b * b}+${c * c}=${a * a + b * b + c * c}$.</p>` };
  }, (p) => { const L = xlim((x) => (p.a + p.b * xcos(2 * x) + p.c * xcos(4 * x)) / x ** 4, 0, 1); return Math.abs(L - 8 * p.c) < 0.3 ? p.a * p.a + p.b * p.b + p.c * p.c : -1; }),
  GX('xg10', 3, 'mcq', 'single', 'factorising', (rng) => {
    const a = int(rng, 2, 3), m = int(rng, 4, 8), n = int(rng, 2, m - 1);
    const val = (m / n) * a ** (m - n);
    const num = m * a ** (m - n), den = n;
    const { options, answer } = shuffleOpts(rng, `$${frac(num, den)}$`, [`$${frac(m, n)}$`, `$${frac(m * a ** m, n * a ** n)}$`, `$${frac(n * a ** (m - n), m)}$`]);
    return { a, m, n, val, options, answer, q: XR`$\displaystyle\lim_{x\to${a}}\dfrac{x^{${m}}-${a ** m}}{x^{${n}}-${a ** n}}=$`, sol: XR`<p>Divide top and bottom by $x-${a}$. The top tends to $${m}\cdot${a}^{${m - 1}}$ and the bottom to $${n}\cdot${a}^{${n - 1}}$. The ratio is $\dfrac{${m}}{${n}}\cdot${a}^{${m - n}}=${frac(num, den)}$.</p>` };
  }, (p) => { const v = xlim((x) => (x ** p.m - p.a ** p.m) / (x ** p.n - p.a ** p.n), p.a); return Math.abs(v - p.val) < 1e-2 * Math.max(1, Math.abs(p.val)) ? p.answer : -1; }),
);
XIT.push(
  X(5, 'greatest integer', XR`Here $[x]$ is the greatest integer function and $\{x\}=x-[x]$. Which of the following limits equal $1$?`, [XR`$\displaystyle\lim_{x\to0^+}x\left[\dfrac1x\right]$`, XR`$\displaystyle\lim_{x\to0^+}x\left\{\dfrac1x\right\}$`, XR`$\displaystyle\lim_{x\to\infty}\dfrac{[x]}x$`, XR`$\displaystyle\lim_{x\to\infty}\dfrac{\{x\}}x$`], [0, 2],
    XR`<p>A: $x[1/x]=1-x\{1/x\}$ and $0\le x\{1/x\}<x\to0$, so the limit is $1$. B: that same term $x\{1/x\}\to0$. C: $x-1<[x]\le x$, so $\dfrac{[x]}x\to1$. D: $0\le\{x\}<1$, so $\dfrac{\{x\}}x\to0$. Answer: A and C.</p>`, '{x} is always below 1, so any ratio with a growing or shrinking x quickly kills it.'),
);

Object.assign(groups, XG); items.push(...XIT); gens.push(...XGN);
}
// ==XP-END
export default { topic: 'limits', groups, items, gens };
