// Differential equations (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Every numeric answer was checked in code: each `calc` solves the DE numerically (RK4) or by an independent closed form,
// and the templates' verify() recompute their answers another way (mostly RK4).
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
const POS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 2, 0, 0, 2, 1, 3];
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
const GEXS = (level, type) => [...EXS[level], ...(type === 'mcq' && level <= 3 ? ['cuet'] : [])];

// ---------- helpers for checking ----------
/** Classical Runge-Kutta (RK4) for y' = f(x,y) from (x0,y0) to x1 in n steps. */
const rk4 = (f, x0, y0, x1, n = 4000) => {
  const h = (x1 - x0) / n; let x = x0, y = y0;
  for (let i = 0; i < n; i++) {
    const k1 = f(x, y), k2 = f(x + h / 2, y + (h * k1) / 2), k3 = f(x + h / 2, y + (h * k2) / 2), k4 = f(x + h, y + h * k3);
    y += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6; x += h;
  }
  return y;
};
/** Time for y' = f(t,y), y(0)=y0, to first reach `target` (monotone), by bisection on RK4. */
const rk4Time = (f, y0, target) => {
  const up = target > y0, before = (t) => (up ? rk4(f, 0, y0, t, 4000) < target : rk4(f, 0, y0, t, 4000) > target);
  let lo = 0, hi = 1; while (before(hi) && hi < 1e5) hi *= 2;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (before(m)) lo = m; else hi = m; }
  return lo;
};
const rk4Half = (f, vT) => rk4Time(f, 0, vT / 2);
const r4 = (x) => +x.toFixed(4);
const TWOD = ' (2 decimal places)';
const D = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q}${TWOD}`, answer, 0.01, sol, trap, more);
const PD = (level, sub, group, q, answer, sol, trap, more = {}) => PN(level, sub, group, `${q}${TWOD}`, answer, 0.01, sol, trap, more);
const PI_ = Math.PI, E_ = Math.E;
const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, exp = Math.exp, ln = Math.log, tan = Math.tan, atan = Math.atan, abs = Math.abs;
/** small clean-ups of generated TeX: "+-" to "-", "--" to "+", "1x" to "x", "x^{1}" to "x", "+0x" removed */
const tidy = (s) => (typeof s !== 'string' ? s : s
  .replace(/\+-/g, '-')
  .replace(/([\d})])--/g, '$1+')
  .replace(/\+0[xyz]\b/g, '')
  .replace(/\^\{1\}/g, '')
  .replace(/(?<![\d._\w\\])1(?=[xyz]\b|e\^)/g, ''));
const tidyItem = (it) => { if (typeof it.good === 'string') it.good = tidy(it.good); for (const k of ['q', 'sol']) it[k] = tidy(it[k]); if (Array.isArray(it.options)) it.options = it.options.map(tidy); return it; };
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make: (rng) => tidyItem(make(rng)), ...(verify ? { verify } : {}) });

const groups = {
  m1: {
    title: 'Order and degree',
    passage: R`<p>Match each equation in List I with its order and degree in List II (take the NCERT meaning of degree).</p>`,
    list1: [R`A. $\left(\dfrac{d^2y}{dx^2}\right)^3+\dfrac{dy}{dx}=0$`, R`B. $\dfrac{d^3y}{dx^3}+y^2=0$`, R`C. $\sqrt{1+\left(\dfrac{dy}{dx}\right)^2}=\dfrac{d^2y}{dx^2}$`, R`D. $\sin\left(\dfrac{d^2y}{dx^2}\right)=y$`],
    list2: ['p. Order 2, degree 3', 'q. Order 3, degree 1', 'r. Order 2, degree 2', 's. Order 2, degree not defined'],
  },
  m2: {
    title: 'General solutions',
    passage: R`<p>Match each differential equation in List I with its general solution in List II ($c$ is the arbitrary constant, $x>0$).</p>`,
    list1: [R`A. $\dfrac{dy}{dx}=\dfrac yx$`, R`B. $\dfrac{dy}{dx}=-\dfrac xy$`, R`C. $\dfrac{dy}{dx}+y=1$`, R`D. $x\dfrac{dy}{dx}=y+x$`],
    list2: [R`p. $y=1+ce^{-x}$`, R`q. $y=x\ln x+cx$`, R`r. $y=cx$`, R`s. $x^2+y^2=c$`],
  },
  m3: {
    title: 'Integrating factors',
    passage: R`<p>Match each linear equation in List I with its integrating factor in List II.</p>`,
    list1: [R`A. $\dfrac{dy}{dx}+\dfrac{2y}{x}=x$`, R`B. $\dfrac{dy}{dx}+y\tan x=\sin x$`, R`C. $\dfrac{dy}{dx}+\dfrac{y}{x\ln x}=x$`, R`D. $\dfrac{dy}{dx}+3y=x$`],
    list2: [R`p. $e^{3x}$`, R`q. $x^2$`, R`r. $\sec x$`, R`s. $\ln x$`],
  },
  m4: {
    title: 'Situation and equation',
    passage: R`<p>Match each situation in List I with the equation that models it in List II ($k>0$).</p>`,
    list1: ['A. A radioactive sample decays', 'B. A hot cup cools in a cooler room (room temperature $T_s$)', 'C. A bank balance grows with continuous compounding', 'D. A stone falls with air drag proportional to its speed ($g$ down)'],
    list2: [R`p. $\dfrac{dv}{dt}=g-kv$`, R`q. $\dfrac{dN}{dt}=-kN$`, R`r. $\dfrac{dT}{dt}=-k(T-T_s)$`, R`s. $\dfrac{dA}{dt}=kA$`],
  },
  p1: {
    title: 'Passage: a curve from its slope',
    passage: R`<p>A curve passes through $(0,2)$. At every point $(x,y)$ on it the slope is $\dfrac{xy}{1+x^2}$.</p>`,
  },
  p2: {
    title: 'Passage: salt in a tank',
    passage: R`<p>A 200 litre tank holds pure water. Brine with $0.25$ kg of salt per litre flows in at 4 litres per minute. The well-stirred mixture flows out at 4 litres per minute, so the volume stays 200 litres. Let $x$ be the kg of salt in the tank at time $t$ minutes.</p>`,
  },
  p3: {
    title: 'Passage: a Bernoulli equation',
    passage: R`<p>Consider $\dfrac{dy}{dx}+\dfrac yx=xy^2$ for $x>0$, with $y(1)=1$.</p>`,
  },
  p4: {
    title: 'Passage: cooling coffee',
    passage: R`<p>Coffee at $90^\circ$C is left in a room at $20^\circ$C. Newton's law of cooling holds. After 5 minutes the coffee is at $70^\circ$C.</p>`,
  },
};

const items = [];
const add = (...xs) => items.push(...xs);
// ---------- order, degree, constants, forming equations ----------
add(
  M(1, 'order and degree', R`The order of $\dfrac{d^3y}{dx^3}+5\left(\dfrac{dy}{dx}\right)^4+y=0$ is`, '3', ['4', '1', '5'],
    R`<p>Order is the highest derivative that appears. Here it is $\dfrac{d^3y}{dx^3}$, so the order is 3. The power 4 sits on a lower derivative, so it does not matter for order.</p>`, 'Do not confuse a power with the order of the derivative.'),
  I(1, 'order and degree', R`Find the degree of $\left(\dfrac{d^2y}{dx^2}\right)^3+\dfrac{dy}{dx}=x$.`, 3,
    R`<p>The equation is already a polynomial in the derivatives. The highest-order derivative $\dfrac{d^2y}{dx^2}$ is raised to power 3, so the degree is 3.</p>`, 'Degree is the power of the highest-order derivative only.'),
  I(1, 'arbitrary constants', 'How many arbitrary constants are in the general solution of a differential equation of order 4?', 4,
    R`<p>The general solution of an $n$th order equation has exactly $n$ independent arbitrary constants. Here $n=4$.</p>`, 'The count equals the order, not the degree.'),
  M(1, 'order and degree', R`The degree of $y''+(y')^3+y^4=0$ is`, '1', ['2', '3', '4'],
    R`<p>The highest-order derivative is $y''$ (order 2) and it appears to power 1. So the degree is 1. The powers 3 and 4 belong to $y'$ and $y$.</p>`, 'Look only at the power of $y\'\'$.'),
  M(2, 'order and degree', R`For $\sin\left(\dfrac{d^2y}{dx^2}\right)+\dfrac{dy}{dx}=0$, the degree is (NCERT meaning)`, 'not defined', ['0', '1', '2'],
    R`<p>Degree is defined only when the equation is a polynomial in its derivatives. The highest derivative $y''$ sits inside $\sin$, so the equation cannot be made a polynomial in $y''$. Degree is not defined (order is 2).</p>`, 'A derivative inside sin, cos, log or an exponential kills the degree.'),
  I(2, 'order and degree', R`Find (order) + (degree) of $y=x\dfrac{dy}{dx}+\sqrt{1+\left(\dfrac{dy}{dx}\right)^2}$.`, 3,
    R`<p>Isolate the root: $y-xy'=\sqrt{1+y'^2}$. Square both sides: $(y-xy')^2=1+y'^2$. Now it is a polynomial in $y'$ of power 2. Order 1, degree 2, sum 3.</p>`, 'Remove the radical before you read off the degree.'),
  M(2, 'order and degree', R`The order and degree of $\left(\dfrac{d^3y}{dx^3}\right)^{3}=1+\left(\dfrac{d^2y}{dx^2}\right)^{2}$ are`, '3 and 3', ['3 and 2', '2 and 2', '2 and 3'],
    R`<p>The highest derivative is $y'''$, so order 3. It is raised to power 3, so degree 3. The $(y'')^2$ term is a lower derivative.</p>`, 'The degree comes from the highest derivative, not the largest exponent.'),
  I(2, 'arbitrary constants', R`Find the order of the differential equation obtained by eliminating constants from $y=ae^{2x}+be^{-x}+c$.`, 3,
    R`<p>$e^{2x}$, $e^{-x}$ and $1$ are independent, so $a,b,c$ are three genuine constants. Three constants give a third order equation.</p>`, 'Check that the constants really are independent.'),
  M(3, 'arbitrary constants', R`The order of the differential equation of the family $y=(a+b)\cos(x+c)-d\,e^{x+e}$ ($a,b,c,d,e$ constants) is`, '3', ['5', '4', '2'],
    R`<p>Write $a+b=A$ and $d e^{e}=D$. Then $y=A\cos(x+c)-De^{x}$ has only three independent constants $A,c,D$. So the order is 3.</p>`, 'Constants that appear only as a sum, product or shift merge into one.'),
  M(3, 'order and degree', R`The degree of $\dfrac{d^2y}{dx^2}\left(1+\dfrac{dy}{dx}\right)=1$ is`, '1', ['2', '0', 'not defined'],
    R`<p>Expand: $y''+y''y'=1$. It is a polynomial in the derivatives and the highest derivative $y''$ has power 1 in each term. The degree is 1. The product $y''y'$ is allowed because the power of $y''$ alone is 1.</p>`, 'A product with a lower derivative does not raise the degree of the highest one.'),
  I(3, 'order and degree', R`The curvature condition $\left[1+\left(\dfrac{dy}{dx}\right)^2\right]^{3/2}=k\dfrac{d^2y}{dx^2}$ ($k$ a constant) has order $m$ and degree $n$. Find $m+n$.`, 4,
    R`<p>Square to clear the $3/2$ power: $\left[1+y'^2\right]^{3}=k^2(y'')^2$. The highest derivative is $y''$, so $m=2$, with power 2, so $n=2$. $m+n=4$.</p>`, 'Square both sides; the power of $y\'\'$ doubles to 2.'),
  M(3, 'order and degree', R`The degree of $\sqrt{\dfrac{d^2y}{dx^2}}=\dfrac{dy}{dx}+x$ is`, '1', ['2', '1/2', 'not defined'],
    R`<p>Square both sides: $y''=(y'+x)^2$. Highest derivative $y''$ has power 1, so the degree is 1 (order 2). The $(y'+x)^2$ is a lower derivative.</p>`, 'The square root removes itself; the degree is not 1/2.'),
  M(1, 'forming equations', R`The differential equation of all straight lines through the origin, $y=mx$, is`, R`$x\dfrac{dy}{dx}=y$`, [R`$\dfrac{dy}{dx}=x$`, R`$y\dfrac{dy}{dx}=x$`, R`$\dfrac{d^2y}{dx^2}=0$`],
    R`<p>Differentiate: $y'=m$. Put $m=y/x$ back: $xy'=y$. One constant gives a first order equation.</p>`, 'The $d^2y/dx^2=0$ equation is for all straight lines, with two constants.'),
  M(2, 'forming equations', R`The differential equation of $y=Ae^{2x}+Be^{-x}$ is`, R`$y''-y'-2y=0$`, [R`$y''+y'-2y=0$`, R`$y''-y'+2y=0$`, R`$y''-2y'+y=0$`],
    R`<p>The exponents $2$ and $-1$ are roots of $(m-2)(m+1)=m^2-m-2=0$. So the equation is $y''-y'-2y=0$. Check: $y''=4Ae^{2x}+Be^{-x}$, $y'=2Ae^{2x}-Be^{-x}$; $y''-y'-2y=(4-2-2)Ae^{2x}+(1+1-2)Be^{-x}=0$.</p>`, 'Roots 2 and $-1$ give $m^2-m-2$, not $m^2+m-2$.'),
  M(2, 'forming equations', R`The differential equation of $y=a\sin x+b\cos x$ is`, R`$y''+y=0$`, [R`$y''-y=0$`, R`$y'+y=0$`, R`$y''+y'=0$`],
    R`<p>$y'=a\cos x-b\sin x$, $y''=-a\sin x-b\cos x=-y$. So $y''+y=0$.</p>`, 'Differentiating sine twice gives minus sine.'),
  M(2, 'forming equations', R`Eliminating $a$ from $y^2=4ax$ gives`, R`$2xy'=y$`, [R`$xy'=2y$`, R`$y'=2y/x$`, R`$yy'=2x$`],
    R`<p>Differentiate: $2yy'=4a$. Substitute $4a=y^2/x$: $2yy'=y^2/x$, so $2xy'=y$ (cancel $y$).</p>`, 'The factor 2 sits on $x y\'$, not on $y$.'),
  M(3, 'forming equations', R`The differential equation of $y=Ax^2+Bx$ is`, R`$x^2y''-2xy'+2y=0$`, [R`$x^2y''+2xy'+2y=0$`, R`$xy''-2y'+2y=0$`, R`$x^2y''-xy'+2y=0$`],
    R`<p>$y'=2Ax+B$, $y''=2A$. Then $x^2y''=2Ax^2$, $2xy'=4Ax^2+2Bx$, $2y=2Ax^2+2Bx$. So $x^2y''-2xy'+2y=2Ax^2-4Ax^2-2Bx+2Ax^2+2Bx=0$.</p>`, 'Eliminate both $A$ and $B$; the final equation has no constants.'),
  M(3, 'forming equations', R`The differential equation of the family $y=e^x(A\cos x+B\sin x)$ is`, R`$y''-2y'+2y=0$`, [R`$y''+2y'+2y=0$`, R`$y''-2y'-2y=0$`, R`$y''+y=0$`],
    R`<p>The roots are $1\pm i$ because the factor $e^{x}$ gives real part 1 and the trig part gives imaginary part $\pm1$. Sum of roots 2, product $1+1=2$, so $m^2-2m+2=0$. Equation: $y''-2y'+2y=0$.</p>`, 'Real part of the roots is the exponent of $e^{x}$.'),
  M(3, 'forming equations', R`The differential equation of all circles touching the $x$-axis at the origin is`, R`$(x^2-y^2)\dfrac{dy}{dx}=2xy$`, [R`$(x^2-y^2)\dfrac{dy}{dx}=-2xy$`, R`$(y^2-x^2)\dfrac{dy}{dx}=2xy$`, R`$(x^2+y^2)\dfrac{dy}{dx}=2xy$`],
    R`<p>Centre $(0,k)$, radius $k$: $x^2+y^2=2ky$. Differentiate: $2x+2yy'=2ky'$ so $k=\dfrac{x+yy'}{y'}$. Put back: $x^2+y^2=2y\cdot\dfrac{x+yy'}{y'}$, so $(x^2+y^2)y'=2xy+2y^2y'$, giving $(x^2-y^2)y'=2xy$.</p>`, 'Sign slips are common in the last step.'),
  M(3, 'forming equations', R`The differential equation of all circles passing through the origin with centre on the $x$-axis is`, R`$y^2-x^2=2xy\dfrac{dy}{dx}$`, [R`$x^2-y^2=2xy\dfrac{dy}{dx}$`, R`$x^2+y^2=2xy\dfrac{dy}{dx}$`, R`$y^2-x^2=xy\dfrac{dy}{dx}$`],
    R`<p>$x^2+y^2=2ax$. Differentiate: $2x+2yy'=2a$, so $a=x+yy'$. Then $x^2+y^2=2x(x+yy')=2x^2+2xyy'$, so $y^2-x^2=2xyy'$.</p>`, 'Centre on $x$-axis (this one) is not the same as touching the $x$-axis at the origin.'),
  M(4, 'forming equations', R`Eliminating the constant from $\dfrac{x^2}{a^2}+y^2=1$ gives`, R`$xy\dfrac{dy}{dx}=y^2-1$`, [R`$xy\dfrac{dy}{dx}=1-y^2$`, R`$xy\dfrac{dy}{dx}=y^2+1$`, R`$y\dfrac{dy}{dx}=x(y^2-1)$`],
    R`<p>Differentiate: $\dfrac{2x}{a^2}+2yy'=0$, so $\dfrac1{a^2}=-\dfrac{yy'}x$. Substitute: $-xyy'+y^2=1$, so $xyy'=y^2-1$.</p>`, 'Keep $1/a^2$ as one symbol while eliminating.'),
  M(4, 'forming equations', R`The differential equation of all parabolas $y^2=4a(x+b)$ is`, R`$yy''+(y')^2=0$`, [R`$yy''-(y')^2=0$`, R`$y''=0$`, R`$yy'=2a$`],
    R`<p>$2yy'=4a$. Differentiate again: $2y'^2+2yy''=0$, so $yy''+y'^2=0$. Two constants ($a$, $b$) give order 2.</p>`, 'The constant $b$ disappears after the first differentiation, so you need a second one for $a$.'),
  M(4, 'forming equations', R`The family $y=cx+c^2$ ($c$ a constant) satisfies`, R`$y=xy'+(y')^2$`, [R`$y=xy'+y'$`, R`$y=x^2y'+y'$`, R`$y'=y$`],
    R`<p>$y'=c$. Replace $c$ by $y'$: $y=xy'+(y')^2$. Order 1, degree 2.</p>`, 'This is a Clairaut equation; its general solution has $c$ replaced by $y\'$ both places.'),
  M(3, 'forming equations', R`Eliminating the constants from $y=\dfrac Ax+B$ gives`, R`$xy''+2y'=0$`, [R`$xy''-2y'=0$`, R`$x^2y''+y'=0$`, R`$y''+2xy'=0$`],
    R`<p>$y'=-A/x^2$, $y''=2A/x^3$. So $y''/y'=-2/x$, i.e. $xy''+2y'=0$.</p>`, 'Divide $y\'\'$ by $y\'$ to kill $A$ at once.'),
  M(2, 'verifying solutions', R`Which function satisfies $y''-2y'+y=0$?`, R`$y=xe^x$`, [R`$y=e^{2x}$`, R`$y=\sin x$`, R`$y=x^2e^x$`],
    R`<p>The auxiliary equation $m^2-2m+1=0$ has a repeated root $m=1$, so $e^x$ and $xe^x$ are solutions. Check $y=xe^x$: $y'=(x+1)e^x$, $y''=(x+2)e^x$; $y''-2y'+y=(x+2-2x-2+x)e^x=0$.</p>`, 'Repeated roots need the extra factor $x$.'),
  M(2, 'verifying solutions', R`The function $y=\sqrt{4-x^2}$ satisfies`, R`$x+yy'=0$`, [R`$x-yy'=0$`, R`$y+xy'=0$`, R`$y'=y/x$`],
    R`<p>Square: $x^2+y^2=4$. Differentiate: $2x+2yy'=0$, so $x+yy'=0$. Directly: $y'=-x/\sqrt{4-x^2}=-x/y$.</p>`, 'The sign is minus: a circle has slope $-x/y$.'),
  I(3, 'verifying solutions', R`The general solution of a second order equation is $y=c_1e^x+c_2e^{3x}$. If $y(0)=2$ and $y'(0)=4$, find $y(\ln2)$.`, 10,
    R`<p>$c_1+c_2=2$ and $c_1+3c_2=4$ give $c_2=1$, $c_1=1$. So $y=e^x+e^{3x}$. At $x=\ln2$: $2+8=10$.</p>`, '$e^{3\\ln2}=2^3=8$.', { calc: () => { const c2 = 1, c1 = 1; return Math.round(c1 * 2 + c2 * 8); } }),
  M(1, 'verifying solutions', R`Which is a solution of $\dfrac{dy}{dx}=3y$?`, R`$y=5e^{3x}$`, [R`$y=5e^{x/3}$`, R`$y=3e^{5x}$`, R`$y=5x^3$`],
    R`<p>$y=5e^{3x}$ gives $y'=15e^{3x}=3y$. For $y=5e^{x/3}$ the slope is $y/3$, for $y=3e^{5x}$ it is $5y$, for $y=5x^3$ it is $15x^2$: none equals $3y$.</p>`, 'Check by differentiating, not by guessing from the form.'),
);
// ---------- variable separable ----------
add(
  M(1, 'variable separable', R`The general solution of $\dfrac{dy}{dx}=\dfrac yx$ ($x,y>0$) is`, R`$y=cx$`, [R`$y=x+c$`, R`$y=c/x$`, R`$y=x^2+c$`],
    R`<p>Separate: $\dfrac{dy}y=\dfrac{dx}x$. Integrate: $\ln y=\ln x+\ln c$, so $y=cx$.</p>`, 'Write the constant as $\\ln c$ to combine the logs.'),
  M(1, 'variable separable', R`The solution of $\dfrac{dy}{dx}=x^2y$ is`, R`$\ln|y|=\dfrac{x^3}3+c$`, [R`$y=\dfrac{x^3}3+c$`, R`$\ln|y|=\dfrac{x^2}2+c$`, R`$y=\dfrac{x^3y}3+c$`],
    R`<p>$\dfrac{dy}y=x^2dx$. Integrating: $\ln|y|=\dfrac{x^3}3+c$.</p>`, 'Divide by $y$ first; do not integrate $x^2y$ with respect to $x$.'),
  M(2, 'variable separable', R`The solution of $\dfrac{dy}{dx}=-\dfrac xy$ is`, R`$x^2+y^2=c$`, [R`$x^2-y^2=c$`, R`$y=-\dfrac{x^2}{2y}+c$`, R`$xy=c$`],
    R`<p>$y\,dy=-x\,dx$, so $\dfrac{y^2}2=-\dfrac{x^2}2+c'$, i.e. $x^2+y^2=c$ (circles).</p>`, 'The minus sign makes circles; without it you get hyperbolas.'),
  M(2, 'variable separable', R`The solution of $\dfrac{dy}{dx}=\dfrac{1+y^2}{1+x^2}$ is`, R`$\tan^{-1}y-\tan^{-1}x=c$`, [R`$\tan^{-1}y+\tan^{-1}x=c$`, R`$y=x+c$`, R`$\ln(1+y^2)=\ln(1+x^2)+c$`],
    R`<p>$\dfrac{dy}{1+y^2}=\dfrac{dx}{1+x^2}$. Integrate: $\tan^{-1}y=\tan^{-1}x+c$.</p>`, 'Both sides are $\\tan^{-1}$ integrals, not logs.'),
  M(2, 'variable separable', R`The solution of $\dfrac{dy}{dx}=e^{x+y}$ is`, R`$e^x+e^{-y}=C$`, [R`$e^x-e^{-y}=C$`, R`$e^{x}+e^{y}=C$`, R`$e^{x+y}=C$`],
    R`<p>$e^{-y}dy=e^xdx$. Integrate: $-e^{-y}=e^x+c$, so $e^x+e^{-y}=C$ with $C=-c$.</p>`, 'Integrating $e^{-y}$ brings a minus sign.'),
  D(2, 'variable separable', R`Solve $\dfrac{dy}{dx}=2xy$ with $y(0)=1$ and find $y(1)$.`, 2.7183,
    R`<p>$\dfrac{dy}y=2x\,dx$, $\ln y=x^2+c$. $y(0)=1$ gives $c=0$. So $y=e^{x^2}$ and $y(1)=e\approx2.72$.</p>`, 'Use the starting value to fix $c$ before evaluating.', { calc: () => rk4((x, y) => 2 * x * y, 0, 1, 1) }),
  I(3, 'variable separable', R`A curve satisfies $(x^2+1)\dfrac{dy}{dx}=xy$ and passes through $(0,1)$. Find $y$ at $x=\sqrt{15}$.`, 4,
    R`<p>$\dfrac{dy}y=\dfrac{x\,dx}{x^2+1}$, so $\ln y=\tfrac12\ln(x^2+1)+c$, $y=C\sqrt{x^2+1}$. $y(0)=1$ gives $C=1$. At $x^2=15$: $y=\sqrt{16}=4$.</p>`, 'Check that $C$ is 1, not 0.', { calc: () => Math.round(rk4((x, y) => (x * y) / (x * x + 1), 0, 1, sqrt(15))) }),
  I(3, 'variable separable', R`Solve $\dfrac{dy}{dx}=xy^2$ with $y(0)=1$. Find $y(1)$.`, 2,
    R`<p>$\dfrac{dy}{y^2}=x\,dx$ so $-\dfrac1y=\dfrac{x^2}2+c$. $y(0)=1$ gives $c=-1$. Then $\dfrac1y=1-\dfrac{x^2}2$. At $x=1$: $\dfrac1y=\dfrac12$, $y=2$.</p>`, 'The solution blows up at $x=\\sqrt2$, so check the interval.', { calc: () => Math.round(rk4((x, y) => x * y * y, 0, 1, 1)) }),
  D(3, 'variable separable', R`Solve $x\dfrac{dy}{dx}=y\ln y$ with $y(1)=e$. Find $y(2)$.`, 7.3891,
    R`<p>$\dfrac{dy}{y\ln y}=\dfrac{dx}x$, so $\ln(\ln y)=\ln x+\ln c$, i.e. $\ln y=cx$. $y(1)=e$ gives $c=1$. So $y=e^x$ and $y(2)=e^2\approx7.39$.</p>`, 'Substitute $u=\\ln y$ for the left integral.', { calc: () => rk4((x, y) => (y * ln(y)) / x, 1, E_, 2) }),
  M(3, 'variable separable', R`The solution of $\dfrac{dy}{dx}=\sin(x+y)+\sin(x-y)$ is`, R`$\ln|\sec y+\tan y|=-2\cos x+c$`, [R`$\ln|\sec y+\tan y|=2\cos x+c$`, R`$\ln|\sec y|=-2\cos x+c$`, R`$\sin y=-2\cos x+c$`],
    R`<p>$\sin(x+y)+\sin(x-y)=2\sin x\cos y$. So $\dfrac{dy}{\cos y}=2\sin x\,dx$. $\int\sec y\,dy=\ln|\sec y+\tan y|$ and $\int2\sin x\,dx=-2\cos x$.</p>`, 'Use the sum-to-product formula before separating.'),
  M(4, 'variable separable', R`The solution of $xy(1+x^2)\dfrac{dy}{dx}=1+y^2$ is`, R`$(1+x^2)(1+y^2)=Cx^2$`, [R`$(1+x^2)(1+y^2)=C$`, R`$(1+y^2)=Cx^2(1+x^2)$`, R`$\dfrac{1+y^2}{1+x^2}=Cx^2$`],
    R`<p>$\dfrac{y\,dy}{1+y^2}=\dfrac{dx}{x(1+x^2)}=\left(\dfrac1x-\dfrac x{1+x^2}\right)dx$. Integrating: $\tfrac12\ln(1+y^2)=\ln x-\tfrac12\ln(1+x^2)+c$. Hence $\ln[(1+x^2)(1+y^2)]=2\ln x+c'$, i.e. $(1+x^2)(1+y^2)=Cx^2$.</p>`, 'Partial fractions: $\\dfrac1{x(1+x^2)}=\\dfrac1x-\\dfrac x{1+x^2}$.'),
  D(4, 'variable separable', R`Solve $\dfrac{dy}{dx}=y^2-1$ with $y(0)=0$ and find $y(1)$.`, -0.7616,
    R`<p>$\dfrac{dy}{y^2-1}=dx$, so $\tfrac12\ln\left|\dfrac{y-1}{y+1}\right|=x+c$. $y(0)=0$ gives $\dfrac{y-1}{y+1}=-e^{2x}$. Solve: $y=\dfrac{1-e^{2x}}{1+e^{2x}}=-\tanh x$. At $x=1$: $-\tanh1\approx-0.76$.</p>`, 'The answer is negative: $y$ moves down from 0.', { calc: () => rk4((x, y) => y * y - 1, 0, 0, 1) }),
  M(4, 'variable separable', R`If $\dfrac{dy}{dx}=\dfrac{y}{x}\cdot\dfrac{1}{\ln x}$ ($x>1$, $y>0$) and $y(e)=e$, then $y$ is`, R`$e\ln x$`, [R`$e^{x}$`, R`$x\ln x$`, R`$\dfrac{x}{e}\ln x$`],
    R`<p>$\dfrac{dy}y=\dfrac{dx}{x\ln x}$, so $\ln y=\ln(\ln x)+c$, $y=C\ln x$. $y(e)=e$: $C\cdot1=e$. So $y=e\ln x$.</p>`, '$\\ln e=1$.'),
  I(2, 'variable separable', R`Solve $\dfrac{dy}{dx}=\dfrac{3x^2}{2y}$ with $y(0)=1$ ($y>0$). Find $y(2)$.`, 3,
    R`<p>$2y\,dy=3x^2dx$, so $y^2=x^3+c$. $y(0)=1$ gives $c=1$. So $y^2=x^3+1$. At $x=2$: $y^2=9$, $y=3$ (positive root).</p>`, 'Take the positive root because $y(0)=1>0$.', { calc: () => Math.round(rk4((x, y) => (3 * x * x) / (2 * y), 0, 1, 2)) }),
);
// ---------- homogeneous ----------
add(
  M(1, 'homogeneous equations', 'Which of these differential equations is homogeneous?', R`$\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$`, [R`$\dfrac{dy}{dx}=\dfrac{x+y^2}{x}$`, R`$\dfrac{dy}{dx}=\dfrac{x+y+1}{x-y}$`, R`$\dfrac{dy}{dx}=x+y^2$`],
    R`<p>A first order equation is homogeneous if $\dfrac{dy}{dx}=F\left(\dfrac yx\right)$, i.e. $f(tx,ty)=f(x,y)$. For $\dfrac{x^2+y^2}{xy}$, replacing $(x,y)$ by $(tx,ty)$ leaves it unchanged. In the others the terms have different degrees, or a constant $1$ spoils it.</p>`, 'A lone constant makes the degrees unequal.'),
  M(2, 'homogeneous equations', R`To solve $\dfrac{dy}{dx}=\dfrac{x+y}{x}$ we put $y=vx$. The solution is`, R`$y=x\ln x+cx$`, [R`$y=x\ln x+c$`, R`$y=\ln x+cx$`, R`$y=xe^{x}+cx$`],
    R`<p>$v+x\dfrac{dv}{dx}=1+v$, so $x\dfrac{dv}{dx}=1$ and $dv=\dfrac{dx}x$, $v=\ln x+c$. Then $y=vx=x\ln x+cx$.</p>`, 'Multiply back by $x$ at the end.'),
  M(2, 'homogeneous equations', R`The solution of $(x^2+y^2)dx=2xy\,dy$ is`, R`$x^2-y^2=cx$`, [R`$x^2+y^2=cx$`, R`$x^2-y^2=c$`, R`$y^2-x^2=cx^2$`],
    R`<p>$y=vx$: $v+xv'=\dfrac{1+v^2}{2v}$, so $xv'=\dfrac{1-v^2}{2v}$ and $\dfrac{2v\,dv}{1-v^2}=\dfrac{dx}x$. Integrate: $-\ln|1-v^2|=\ln x+c$, so $x(1-v^2)=C$. With $v=y/x$: $\dfrac{x^2-y^2}x=C$, i.e. $x^2-y^2=Cx$.</p>`, 'The constant multiplies $x$, not a bare constant.'),
  D(3, 'homogeneous equations', R`Solve $\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$ with $y(1)=2$ and find $y(e)$ ($y>0$).`, 6.6585,
    R`<p>$y=vx$: $v+xv'=\dfrac{1+v^2}v$, so $xv'=\dfrac1v$ and $v\,dv=\dfrac{dx}x$. $\dfrac{v^2}2=\ln x+c$, so $y^2=x^2(2\ln x+C)$. $y(1)=2$ gives $C=4$. At $x=e$: $y^2=e^2(2+4)=6e^2$, $y=e\sqrt6\approx6.66$.</p>`, '$\\ln e=1$, and $C=y(1)^2=4$.', { calc: () => rk4((x, y) => (x * x + y * y) / (x * y), 1, 2, E_) }),
  M(3, 'homogeneous equations', R`The solution of $\dfrac{dy}{dx}=\dfrac yx+\tan\dfrac yx$ is`, R`$\sin\dfrac yx=cx$`, [R`$\cos\dfrac yx=cx$`, R`$\sin\dfrac yx=c$`, R`$\tan\dfrac yx=cx$`],
    R`<p>$v+xv'=v+\tan v$, so $\cot v\,dv=\dfrac{dx}x$. Integrate: $\ln\sin v=\ln x+\ln c$, so $\sin\dfrac yx=cx$.</p>`, '$\\int\\cot v\\,dv=\\ln\\sin v$.'),
  D(3, 'homogeneous equations', R`Solve $\dfrac{dy}{dx}=\dfrac{x-y}{x+y}$ with $y(1)=0$. Find the positive value of $y$ at $x=3$.`, 1.1231,
    R`<p>$(x-y)dx-(x+y)dy=0$ is an exact equation: $d(x^2-2xy-y^2)=2[(x-y)dx-(x+y)dy]$. So $x^2-2xy-y^2=c$. $y(1)=0$ gives $c=1$. At $x=3$: $y^2+6y-8=0$, $y=-3+\sqrt{17}\approx1.12$.</p>`, 'Reject the negative root of the quadratic.', { calc: () => rk4((x, y) => (x - y) / (x + y), 1, 0, 3) }),
  M(4, 'reducible to homogeneous', R`The solution of $\dfrac{dy}{dx}=\dfrac{x+2y-3}{2x+y-3}$ is`, R`$x+y-2=c(x-y)^3$`, [R`$x+y-2=c(x-y)^2$`, R`$x+y-2=c(x-y)$`, R`$x-y=c(x+y-2)^3$`],
    R`<p>The lines $x+2y=3$ and $2x+y=3$ meet at $(1,1)$. Put $x=X+1$, $y=Y+1$: $\dfrac{dY}{dX}=\dfrac{X+2Y}{2X+Y}$. Let $Y=VX$: $X V'=\dfrac{1-V^2}{2+V}$, so $\dfrac{2+V}{1-V^2}dV=\dfrac{dX}X$. Partial fractions: $\dfrac{3/2}{1-V}+\dfrac{1/2}{1+V}$. Integrate: $-\tfrac32\ln|1-V|+\tfrac12\ln|1+V|=\ln X+c$, so $\dfrac{1+V}{(1-V)^3}=CX^2$, giving $X+Y=C(X-Y)^3$, i.e. $x+y-2=C(x-y)^3$.</p>`, 'The shift is to the intersection point, here $(1,1)$.'),
  I(4, 'homogeneous equations', R`The solution of $x\dfrac{dy}{dx}=y+\sqrt{x^2+y^2}$ ($x>0$) with $y(1)=0$ is $y=f(x)$. Find $f(3)$.`, 4,
    R`<p>$y=vx$: $xv'=\sqrt{1+v^2}$, so $\sinh^{-1}v=\ln x+c$. $y(1)=0$ gives $c=0$, $v=\sinh(\ln x)=\dfrac12\left(x-\dfrac1x\right)$. So $y=\dfrac{x^2-1}2$. $f(3)=4$. Check: $y'=x$ and $y+\sqrt{x^2+y^2}=\dfrac{x^2-1}2+\dfrac{x^2+1}2=x^2=xy'$.</p>`, 'Verify by substitution: $\\sqrt{x^2+y^2}=(x^2+1)/2$.', { calc: () => Math.round(rk4((x, y) => (y + sqrt(x * x + y * y)) / x, 1, 0, 3)) }),
  I(2, 'homogeneous equations', R`Find the degree of homogeneity $n$ of $f(x,y)=x^3+3x^2y+y^3$, so that $f(tx,ty)=t^nf(x,y)$.`, 3,
    R`<p>Every term has total degree 3: $f(tx,ty)=t^3f(x,y)$. So $n=3$.</p>`, 'Add the powers of $x$ and $y$ in each term.'),
  M(3, 'homogeneous equations', R`$\dfrac{dy}{dx}=\dfrac{y^2-x^2}{2xy}$ is solved by $y=vx$ giving`, R`$x^2+y^2=cx$`, [R`$x^2+y^2=c$`, R`$y^2-x^2=cx$`, R`$x^2+y^2=cx^2$`],
    R`<p>$v+xv'=\dfrac{v^2-1}{2v}$ so $xv'=-\dfrac{1+v^2}{2v}$. Then $\dfrac{2v\,dv}{1+v^2}=-\dfrac{dx}x$, $\ln(1+v^2)=-\ln x+\ln c$, $x(1+v^2)=c$, i.e. $x^2+y^2=cx$.</p>`, 'The minus sign gives a plus in $1+v^2$.'),
);

// ---------- linear first order ----------
add(
  M(1, 'linear first order', R`The integrating factor of $\dfrac{dy}{dx}+\dfrac2xy=x^2$ is`, R`$x^2$`, [R`$2x$`, R`$e^{2x}$`, R`$\ln x^2$`],
    R`<p>IF $=e^{\int P\,dx}=e^{\int(2/x)dx}=e^{2\ln x}=x^2$.</p>`, 'IF is $e^{\\int P}$, not $\\int P$.'),
  M(1, 'linear first order', R`The integrating factor of $\dfrac{dy}{dx}+y\tan x=\sec x$ is`, R`$\sec x$`, [R`$\cos x$`, R`$e^{\tan x}$`, R`$\tan x$`],
    R`<p>$\int\tan x\,dx=\ln\sec x$, so the IF is $e^{\ln\sec x}=\sec x$.</p>`, '$\\int\\tan x\\,dx=\\ln|\\sec x|$, a log, so $e$ of it is $\\sec x$.'),
  M(2, 'linear first order', R`The integrating factor of $x\dfrac{dy}{dx}+3y=x^2$ ($x>0$) is`, R`$x^3$`, [R`$x^{3}/3$`, R`$e^{3x}$`, R`$x^{2}$`],
    R`<p>First make the coefficient of $y'$ equal to 1: $y'+\dfrac3xy=x$. Then IF $=e^{3\ln x}=x^3$.</p>`, 'Divide by $x$ before reading $P$.'),
  M(2, 'linear first order', R`The solution of $y\,dx+(x-y^3)dy=0$ is`, R`$xy=\dfrac{y^4}4+C$`, [R`$xy=y^4+C$`, R`$x=\dfrac{y^3}4+C$`, R`$\dfrac xy=\dfrac{y^4}4+C$`],
    R`<p>View $x$ as a function of $y$: $\dfrac{dx}{dy}+\dfrac xy=y^2$. IF $=e^{\ln y}=y$. $\dfrac d{dy}(xy)=y^3$, so $xy=\dfrac{y^4}4+C$.</p>`, 'When $dy/dx$ is awkward, try $dx/dy$.'),
  D(3, 'linear first order', R`Solve $\dfrac{dy}{dx}+y=e^{-x}$ with $y(0)=0$ and find $y(1)$.`, 0.3679,
    R`<p>IF $=e^x$: $\dfrac d{dx}(ye^x)=1$, so $ye^x=x+c$. $y(0)=0$ gives $c=0$. $y=xe^{-x}$, $y(1)=e^{-1}\approx0.37$.</p>`, 'Resonance: the solution has an extra factor $x$.', { calc: () => rk4((x, y) => exp(-x) - y, 0, 0, 1) }),
  I(3, 'linear first order', R`If $\dfrac{dy}{dx}+2y=6$ and $y(0)=1$, find $\displaystyle\lim_{x\to\infty}y$.`, 3,
    R`<p>IF $=e^{2x}$: $ye^{2x}=3e^{2x}+c$, $y=3+ce^{-2x}$. As $x\to\infty$ the exponential vanishes, so $y\to3$. (Also $y(0)=1$ gives $c=-2$.)</p>`, 'The long-run value is $q/p$, independent of $y(0)$.', { calc: () => Math.round(rk4((x, y) => 6 - 2 * y, 0, 1, 20)) }),
  M(3, 'linear first order', R`The solution of $x\dfrac{dy}{dx}+y=x\ln x$ ($x>0$) is`, R`$xy=\dfrac{x^2}2\ln x-\dfrac{x^2}4+C$`, [R`$xy=\dfrac{x^2}2\ln x+\dfrac{x^2}4+C$`, R`$y=x\ln x-x+C$`, R`$xy=x\ln x-x+C$`],
    R`<p>The left side is $\dfrac d{dx}(xy)$. So $xy=\int x\ln x\,dx=\dfrac{x^2}2\ln x-\int\dfrac x2dx=\dfrac{x^2}2\ln x-\dfrac{x^2}4+C$.</p>`, 'Integrate $x\\ln x$ by parts; do not forget the minus quarter term.'),
  I(3, 'linear first order', R`The curve $\dfrac{dy}{dx}-\dfrac yx=x$ passes through $(1,3)$. Find $y$ when $x=2$.`, 8,
    R`<p>IF $=e^{-\ln x}=\dfrac1x$: $\dfrac d{dx}\left(\dfrac yx\right)=1$, so $\dfrac yx=x+c$. $(1,3)$: $3=1+c$, $c=2$. At $x=2$: $y=2(2+2)=8$.</p>`, 'Here $P=-1/x$, so the IF is $1/x$.', { calc: () => Math.round(rk4((x, y) => y / x + x, 1, 3, 2)) }),
  D(3, 'linear first order', R`Solve $\dfrac{dy}{dx}+y\cos x=\sin x\cos x$ with $y(0)=1$. Find $y(\pi/2)$.`, 0.7358,
    R`<p>IF $=e^{\sin x}$. Put $u=\sin x$: $ye^{u}=\int ue^{u}du=(u-1)e^u+c$. So $y=\sin x-1+ce^{-\sin x}$. $y(0)=1$ gives $c=2$. $y(\pi/2)=0+2e^{-1}\approx0.74$.</p>`, 'Integrate $u e^u$ by parts.', { calc: () => rk4((x, y) => sin(x) * cos(x) - y * cos(x), 0, 1, PI_ / 2) }),
  D(4, 'linear first order', R`Solve $(x^2+1)\dfrac{dy}{dx}+2xy=x^2+1$ with $y(0)=1$. Find $y(1)$.`, 1.1667,
    R`<p>The left side is $\dfrac d{dx}\left[(x^2+1)y\right]$. So $(x^2+1)y=\dfrac{x^3}3+x+c$. $y(0)=1$ gives $c=1$. At $x=1$: $2y=\dfrac13+1+1=\dfrac73$, $y=\dfrac76\approx1.17$.</p>`, 'Spot the product rule instead of using the IF.', { calc: () => rk4((x, y) => 1 - (2 * x * y) / (x * x + 1), 0, 1, 1) }),
  D(4, 'linear first order', R`Solve $\dfrac{dy}{dx}+y\tan x=\cos^2x$ with $y(0)=2$ and find $y(\pi/3)$.`, 1.433,
    R`<p>IF $=\sec x$: $\dfrac d{dx}(y\sec x)=\cos x$, so $y\sec x=\sin x+c$, i.e. $y=\sin x\cos x+c\cos x$. $y(0)=2$ gives $c=2$. At $x=\pi/3$: $y=\dfrac{\sqrt3}2\cdot\dfrac12+2\cdot\dfrac12=0.433+1=1.433$.</p>`, 'Multiply back by $\\cos x$ at the end.', { calc: () => rk4((x, y) => cos(x) ** 2 - y * tan(x), 0, 2, PI_ / 3) }),
  D(5, 'linear first order', R`Let $\dfrac{dy}{dx}+y=f(x)$ where $f(x)=1$ for $0\le x\le1$ and $f(x)=0$ for $x>1$, with $y(0)=0$ and $y$ continuous. Find $y(2)$.`, 0.2325,
    R`<p>On $[0,1]$: $y=1-e^{-x}$, so $y(1)=1-e^{-1}$. For $x>1$: $y'+y=0$, so $y=y(1)e^{-(x-1)}$ (continuity). $y(2)=(1-e^{-1})e^{-1}\approx0.6321\times0.3679=0.2325$.</p>`, 'Carry the value at $x=1$ into the second piece.', { calc: () => { const a = 1 - exp(-1); return a * exp(-1); } }),
);
// ---------- Bernoulli, substitutions, exact-looking ----------
add(
  M(3, 'Bernoulli equation', R`To reduce $\dfrac{dy}{dx}+\dfrac yx=y^2$ to a linear equation we substitute`, R`$v=\dfrac1y$`, [R`$v=y^2$`, R`$v=\dfrac yx$`, R`$v=\ln y$`],
    R`<p>It is a Bernoulli equation $y'+Py=Qy^n$ with $n=2$. Divide by $y^2$ and put $v=y^{1-n}=y^{-1}$. Then $v'=-y'/y^2$ and the equation becomes $-v'+v/x=1$, which is linear in $v$.</p>`, 'The substitution is $y^{1-n}$, not $y^n$.'),
  M(4, 'Bernoulli equation', R`The solution of $\dfrac{dy}{dx}+y=xy^3$ is`, R`$\dfrac1{y^2}=x+\dfrac12+Ce^{2x}$`, [R`$\dfrac1{y^2}=x-\dfrac12+Ce^{2x}$`, R`$\dfrac1{y}=x+\dfrac12+Ce^{2x}$`, R`$\dfrac1{y^2}=x+\dfrac12+Ce^{-2x}$`],
    R`<p>Divide by $y^3$ and put $v=y^{-2}$: $-\tfrac12v'+v=x$, i.e. $v'-2v=-2x$. IF $=e^{-2x}$. $\dfrac d{dx}(ve^{-2x})=-2xe^{-2x}$, whose integral is $xe^{-2x}+\tfrac12e^{-2x}$. So $v=x+\tfrac12+Ce^{2x}$.</p>`, 'Dividing by $y^3$ gives a factor $-1/2$ in front of $v\'$.'),
  D(4, 'Bernoulli equation', R`Solve $\dfrac{dy}{dx}+\dfrac yx=xy^2$ ($x>0$) with $y(1)=1$ and find $y(1.5)$.`, 1.3333,
    R`<p>Put $v=1/y$: $v'-\dfrac vx=-x$. IF $=\dfrac1x$: $\dfrac d{dx}\left(\dfrac vx\right)=-1$, so $v=x(c-x)$. $v(1)=1$ gives $c=2$. $y=\dfrac1{x(2-x)}$. At $x=1.5$: $\dfrac1{1.5\times0.5}=\dfrac43\approx1.33$.</p>`, 'The solution is valid only for $x<2$.', { calc: () => rk4((x, y) => x * y * y - y / x, 1, 1, 1.5) }),
  M(4, 'substitution', R`The substitution $v=x+y$ turns $\dfrac{dy}{dx}=(x+y)^2$ into a separable equation. Its solution is`, R`$x+y=\tan(x+c)$`, [R`$x+y=\tan x+c$`, R`$x+y=\ln|x+c|$`, R`$x+y=e^{x}+c$`],
    R`<p>$v'=1+v^2$, so $\dfrac{dv}{1+v^2}=dx$ and $\tan^{-1}v=x+c$. So $x+y=\tan(x+c)$.</p>`, 'The constant sits inside the tangent.'),
  M(5, 'substitution', R`The solution of $\dfrac{dy}{dx}=\sin(x+y)$ is`, R`$\tan(x+y)-\sec(x+y)=x+c$`, [R`$\tan(x+y)+\sec(x+y)=x+c$`, R`$\cos(x+y)=x+c$`, R`$\tan\dfrac{x+y}2=x+c$`],
    R`<p>Put $v=x+y$: $v'=1+\sin v$. $\int\dfrac{dv}{1+\sin v}=\int\dfrac{1-\sin v}{\cos^2v}dv=\tan v-\sec v$. So $\tan(x+y)-\sec(x+y)=x+c$.</p>`, 'Multiply top and bottom by $1-\\sin v$.'),
  D(4, 'substitution', R`Solve $\dfrac{dy}{dx}=(4x+y+1)^2$ with $y(0)=-1$ and find $y\left(\dfrac\pi8\right)$.`, -0.5708,
    R`<p>Put $v=4x+y+1$: $v'=4+v^2$, so $\tfrac12\tan^{-1}\dfrac v2=x+c$. $v(0)=0$ gives $c=0$, $v=2\tan2x$. So $y=2\tan2x-4x-1$. At $x=\pi/8$: $2-\dfrac\pi2-1=1-1.5708=-0.5708$.</p>`, '$v(0)=4\\cdot0+(-1)+1=0$, not $-1$.', { calc: () => rk4((x, y) => (4 * x + y + 1) ** 2, 0, -1, PI_ / 8) }),
  D(4, 'substitution', R`Solve $\dfrac{dy}{dx}=e^{x+y}$ with $y(0)=-2$ and find $y(1)$.`, -1.7355,
    R`<p>$e^{-y}dy=e^xdx$ so $-e^{-y}=e^x+c$, i.e. $e^{-y}=C-e^x$. $y(0)=-2$: $e^2=C-1$, so $C=e^2+1$. At $x=1$: $e^{-y}=e^2+1-e=7.389+1-2.718=5.671$, $y=-\ln5.671\approx-1.74$.</p>`, 'Make sure $C-e^x$ stays positive.', { calc: () => rk4((x, y) => exp(x + y), 0, -2, 1) }),
  M(3, 'exact-looking', R`The solution of $x\,dy-y\,dx=x^2dx$ is`, R`$y=x^2+cx$`, [R`$y=x^2+c$`, R`$y=\dfrac{x^3}3+cx$`, R`$y=x^2+\dfrac cx$`],
    R`<p>Divide by $x^2$: $\dfrac{x\,dy-y\,dx}{x^2}=dx$, which is $d\left(\dfrac yx\right)=dx$. So $\dfrac yx=x+c$ and $y=x^2+cx$.</p>`, '$d(y/x)=(x\\,dy-y\\,dx)/x^2$.'),
  M(3, 'exact-looking', R`The solution of $x\,dx+y\,dy=(x^2+y^2)dx$ is`, R`$x^2+y^2=Ce^{2x}$`, [R`$x^2+y^2=Ce^{x}$`, R`$x^2+y^2=x^2+C$`, R`$x^2+y^2=Ce^{-2x}$`],
    R`<p>$x\,dx+y\,dy=\tfrac12d(x^2+y^2)$. So $\dfrac{d(x^2+y^2)}{x^2+y^2}=2dx$ and $\ln(x^2+y^2)=2x+c$, i.e. $x^2+y^2=Ce^{2x}$.</p>`, 'The factor $\\tfrac12$ turns the exponent into $2x$.'),
  M(3, 'exact-looking', R`The solution of $x\,dy-y\,dx=(x^2+y^2)dx$ is`, R`$y=x\tan(x+c)$`, [R`$y=x\tan x+c$`, R`$y=\tan(x+c)$`, R`$y=x\cot(x+c)$`],
    R`<p>$\dfrac{x\,dy-y\,dx}{x^2+y^2}=d\left(\tan^{-1}\dfrac yx\right)$. So $\tan^{-1}\dfrac yx=x+c$ and $y=x\tan(x+c)$.</p>`, 'Spot $d(\\tan^{-1}(y/x))$.'),
  D(4, 'exact-looking', R`Solve $x\,dy-y\,dx=(x^2+y^2)dx$ with $y(1)=1$ and find $y(1.5)$.`, 5.1123,
    R`<p>$\tan^{-1}\dfrac yx=x+c$. $y(1)=1$: $\dfrac\pi4=1+c$, $c=\dfrac\pi4-1$. At $x=1.5$: $\tan^{-1}(y/1.5)=1.5+0.7854-1=1.2854$. $y=1.5\tan1.2854$.</p>`, 'Keep radians.', { calc: () => rk4((x, y) => y / x + (x * x + y * y) / x, 1, 1, 1.5, 20000) }),
  M(4, 'exact-looking', R`The solution of $y\,dx+x\,dy=x^2y^2dx$ is`, R`$xy(x+c)=-1$`, [R`$xy(x+c)=1$`, R`$xy=\dfrac{x^3}3+c$`, R`$\ln(xy)=x^2+c$`],
    R`<p>$y\,dx+x\,dy=d(xy)$. Put $u=xy$: $du=u^2dx$, so $\dfrac{du}{u^2}=dx$ and $-\dfrac1u=x+c$. So $xy(x+c)=-1$.</p>`, 'The right side $x^2y^2=u^2$ is a function of $u$ alone.'),
  M(5, 'substitution xy = v', R`The solution of $y(1+xy)dx+x(1-xy)dy=0$ is`, R`$\ln\dfrac xy-\dfrac1{xy}=c$`, [R`$\ln\dfrac xy+\dfrac1{xy}=c$`, R`$\ln(xy)-\dfrac xy=c$`, R`$\ln\dfrac yx-\dfrac1{xy}=c$`],
    R`<p>Group as $(y\,dx+x\,dy)+xy(y\,dx-x\,dy)=0$. Divide by $x^2y^2$: $\dfrac{d(xy)}{(xy)^2}+\dfrac{y\,dx-x\,dy}{xy}=0$, i.e. $\dfrac{d(xy)}{(xy)^2}+\dfrac{dx}x-\dfrac{dy}y=0$. Integrate: $-\dfrac1{xy}+\ln\dfrac xy=c$.</p>`, 'Check by differentiating: the slope should be $-y(1+xy)/[x(1-xy)]$.'),
);

// ---------- orthogonal trajectories ----------
add(
  M(2, 'orthogonal trajectories', R`The orthogonal trajectories of the family $y=cx$ are`, R`$x^2+y^2=k$`, [R`$y=-cx$`, R`$xy=k$`, R`$y^2=kx$`],
    R`<p>For $y=cx$, $y'=y/x$. The trajectory has slope $-x/y$: $y\,dy=-x\,dx$, so $x^2+y^2=k$ (circles).</p>`, 'Replace $y\'$ by $-1/y\'$.'),
  M(3, 'orthogonal trajectories', R`The orthogonal trajectories of $y^2=4ax$ are`, R`$2x^2+y^2=k$`, [R`$x^2+2y^2=k$`, R`$x^2+y^2=k$`, R`$y^2=-4ax$`],
    R`<p>$2yy'=4a=y^2/x$, so the family has slope $\dfrac y{2x}$. The trajectory has slope $-\dfrac{2x}y$: $y\,dy=-2x\,dx$, $\dfrac{y^2}2=-x^2+c$, so $2x^2+y^2=k$.</p>`, 'Check the factor 2: it lands on $x^2$.'),
  M(3, 'orthogonal trajectories', R`The orthogonal trajectories of the rectangular hyperbolas $xy=c$ are`, R`$y^2-x^2=k$`, [R`$x^2+y^2=k$`, R`$y=kx$`, R`$xy=k$`],
    R`<p>$y'=-y/x$. Trajectory: $y'=\dfrac xy$, so $y\,dy=x\,dx$ and $y^2-x^2=k$ (another set of hyperbolas, rotated).</p>`, 'A hyperbola family is perpendicular to the rotated hyperbolas.'),
  M(4, 'orthogonal trajectories', R`The orthogonal trajectories of $y=ce^x$ are`, R`$y^2+2x=k$`, [R`$y^2-2x=k$`, R`$y=-ce^{-x}$`, R`$y=ke^{-x}$`],
    R`<p>$y'=y$. The trajectory has slope $-\dfrac1y$: $y\,dy=-dx$, $\dfrac{y^2}2=-x+c$, so $y^2+2x=k$.</p>`, 'Parabolas, not exponentials.'),
  M(4, 'orthogonal trajectories', R`The orthogonal trajectories of the circles touching the $y$-axis at the origin, $x^2+y^2=2ax$, are`, R`circles touching the $x$-axis at the origin: $x^2+y^2=2by$`, [R`circles $x^2+y^2=r^2$`, R`parabolas $y^2=4bx$`, R`lines $y=mx$`],
    R`<p>The family has $y^2-x^2=2xyy'$. Replace $y'$ by $-1/y'$: $y^2-x^2=-\dfrac{2xy}{y'}$, so $(x^2-y^2)y'=2xy$. That is exactly the differential equation of circles touching the $x$-axis at the origin.</p>`, 'Swapping $x$ and $y$ in the equation of the family gives the trajectories.'),
  D(3, 'orthogonal trajectories', R`The orthogonal trajectory of the parabolas $y=cx^2$ that passes through $(1,1)$ is $x^2+2y^2=3$. Find its $y$ at $x=0.5$ (take $y>0$).`, 1.1726,
    R`<p>$y=cx^2$ has $y'=2y/x$. Trajectory: $y'=-\dfrac x{2y}$, so $2y\,dy=-x\,dx$ and $x^2+2y^2=k$. Through $(1,1)$: $k=3$. At $x=0.5$: $2y^2=2.75$, $y=\sqrt{1.375}\approx1.1726$.</p>`, 'The constant is fixed by the point $(1,1)$.', { calc: () => rk4((x, y) => -x / (2 * y), 1, 1, 0.5) }),
);

// ---------- growth, decay, cooling, mixing ----------
add(
  D(1, 'growth and decay', R`A population grows at a rate proportional to its size and doubles in 5 years. In how many years will it become three times its size? Give the answer in years`, 7.9248,
    R`<p>$N=N_0e^{kt}$. Doubling: $e^{5k}=2$, $k=\dfrac{\ln2}5$. Tripling: $e^{kt}=3$, $t=\dfrac{\ln3}k=\dfrac{5\ln3}{\ln2}\approx7.92$ years.</p>`, 'Tripling takes less than 10 years, not $5\\times3$.', { calc: () => (5 * ln(3)) / ln(2) }),
  M(2, 'growth and decay', R`A radioactive substance has a half-life of 10 days. The fraction left after 30 days is`, R`$\dfrac18$`, [R`$\dfrac16$`, R`$\dfrac13$`, R`$\dfrac1{27}$`],
    R`<p>30 days is 3 half-lives: $\left(\tfrac12\right)^3=\tfrac18$. By calculus: $N=N_0e^{-kt}$ with $e^{-10k}=\tfrac12$, so $e^{-30k}=\tfrac18$.</p>`, 'Count half-lives, do not divide by 3.'),
  I(2, 'growth and decay', R`The number of bacteria in a culture grows at a rate proportional to the number present. It rises from 1000 to 2000 in 3 hours. How many bacteria are there after 9 hours?`, 8000,
    R`<p>It doubles every 3 hours. 9 hours is 3 doublings: $1000\times2^3=8000$.</p>`, 'Doubling every 3 hours, not every 1.5.', { calc: () => Math.round(1000 * exp((ln(2) / 3) * 9)) }),
  N(2, 'growth and decay', R`A radioactive substance loses 20% of its mass in 10 years. What percentage of the original mass remains after 30 years? Give the answer as a percentage`, 51.2, 0.1,
    R`<p>Each 10 years multiplies the mass by $0.8$. After 30 years: $0.8^3=0.512$, i.e. $51.2\%$.</p>`, 'It is not $100-3\\times20=40\\%$.', { calc: () => 100 * 0.8 ** 3 }),
  D(3, 'growth and decay', R`Money in an account grows continuously at 8% per year, i.e. $dA/dt=0.08A$. How many years does it take to double? Give the answer in years`, 8.6643,
    R`<p>$A=A_0e^{0.08t}$. Doubling: $0.08t=\ln2$, $t=\dfrac{0.6931}{0.08}\approx8.66$ years.</p>`, 'The rule of 72 gives 9 years, close but not exact.', { calc: () => ln(2) / 0.08 }),
  I(3, 'Newton cooling', R`A body at $100^\circ$C is put in a room at $20^\circ$C. It cools to $80^\circ$C in 10 minutes. By Newton's law of cooling, its temperature after 20 minutes is (in $^\circ$C)`, 65,
    R`<p>$T-20=80e^{-kt}$. At 10 min: $60=80e^{-10k}$, so $e^{-10k}=\tfrac34$. At 20 min: $T-20=80\left(\tfrac34\right)^2=45$, so $T=65^\circ$C.</p>`, 'Work with the difference from room temperature, not with $T$ itself.', { calc: () => 20 + 80 * 0.75 ** 2 }),
  D(3, 'Newton cooling', R`Using the data in the previous question ($100^\circ$C at start, room $20^\circ$C, $80^\circ$C after 10 minutes), find the time in minutes for the body to reach $40^\circ$C. Give the answer in minutes`, 48.188,
    R`<p>$T-20=80e^{-kt}$ with $e^{-10k}=\tfrac34$, so $k=\dfrac{\ln(4/3)}{10}$. For $T=40$: $20=80e^{-kt}$, $e^{-kt}=\tfrac14$, $t=\dfrac{\ln4}k=\dfrac{10\ln4}{\ln(4/3)}\approx48.2$ min.</p>`, 'Using a straight line ($2$ min per degree) gives a wrong answer; cooling slows down.', { calc: () => (10 * ln(4)) / ln(4 / 3) }),
  D(3, 'compound problems', R`A person falls through air with drag proportional to speed: $\dfrac{dv}{dt}=9.8-0.5v$, starting from rest. Find the speed in m/s after 2 seconds`, 12.3896,
    R`<p>IF $=e^{0.5t}$: $v=19.6+Ce^{-0.5t}$, $v(0)=0$ gives $C=-19.6$. $v(2)=19.6(1-e^{-1})=19.6\times0.6321\approx12.39$ m/s. The terminal speed is $9.8/0.5=19.6$ m/s.</p>`, 'The speed after 2 s is below the terminal speed.', { calc: () => rk4((t, v) => 9.8 - 0.5 * v, 0, 0, 2) }),
  D(4, 'mixing problems', R`A tank holds 100 litres of pure water. Brine of $0.5$ kg/litre enters at 10 litres per minute and the well-stirred mixture leaves at 10 litres per minute. How many kg of salt are in the tank after 10 minutes?`, 31.606,
    R`<p>$\dfrac{dx}{dt}=5-\dfrac{10x}{100}=5-\dfrac x{10}$. IF $=e^{t/10}$: $x=50+Ce^{-t/10}$, $x(0)=0$ gives $C=-50$. $x(10)=50(1-e^{-1})\approx31.61$ kg.</p>`, 'Rate in is $10\\times0.5=5$ kg per minute.', { calc: () => rk4((t, x) => 5 - x / 10, 0, 0, 10) }),
  D(5, 'mixing problems', R`A tank starts with 100 litres of pure water. A salt solution of 2 kg/litre enters at 5 litres per minute, and the well-stirred mixture leaves at 3 litres per minute. How many kg of salt are in the tank after 50 minutes?`, 329.289,
    R`<p>Volume $V=100+2t$. $\dfrac{dx}{dt}=10-\dfrac{3x}{100+2t}$. IF $=(100+2t)^{3/2}$. Then $\dfrac d{dt}\left[x(100+2t)^{3/2}\right]=10(100+2t)^{3/2}$, and integrating gives $x(100+2t)^{3/2}=2(100+2t)^{5/2}+C$. So $x=2(100+2t)+C(100+2t)^{-3/2}$. $x(0)=0$ gives $C=-200\times100^{3/2}=-2\times10^5$. At $t=50$: $V=200$, $x=400-\dfrac{2\times10^5}{200^{3/2}}=400-70.71=329.29$ kg.</p>`, 'The volume grows by 2 litres per minute, so the outflow rate depends on $t$.', { calc: () => rk4((t, x) => 10 - (3 * x) / (100 + 2 * t), 0, 0, 50) }),
  D(5, 'growth and decay', R`A population obeys $\dfrac{dP}{dt}=0.1P\left(1-\dfrac P{1000}\right)$ with $P(0)=100$. Find $P(10)$ (nearest whole number)`, 231.97,
    R`<p>Logistic equation: $P=\dfrac{K}{1+\left(\frac K{P_0}-1\right)e^{-rt}}$ with $K=1000$, $P_0=100$, $r=0.1$. So $P(10)=\dfrac{1000}{1+9e^{-1}}=\dfrac{1000}{4.311}\approx232$.</p>`, 'The growth slows as $P$ nears the carrying capacity $K$.', { calc: () => rk4((t, p) => 0.1 * p * (1 - p / 1000), 0, 100, 10) }),
  D(5, 'draining tank', R`Water drains from a full cylindrical tank by $\dfrac{dh}{dt}=-k\sqrt h$ and the tank empties completely in 20 minutes. After how many minutes is the water level half of the original height? Give the answer in minutes`, 5.8579,
    R`<p>$\dfrac{dh}{\sqrt h}=-k\,dt$, so $2\sqrt h=-kt+2\sqrt{h_0}$, i.e. $\sqrt h=\sqrt{h_0}\left(1-\dfrac t{20}\right)$. For $h=\dfrac{h_0}2$: $\dfrac1{\sqrt2}=1-\dfrac t{20}$, $t=20\left(1-\dfrac1{\sqrt2}\right)\approx5.86$ min.</p>`, 'The level falls fastest at the start, so half height comes well before 10 minutes.', { calc: () => { let lo = 0, hi = 19.99; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (rk4((t, h) => -0.1 * sqrt(Math.max(h, 0)), 0, 1, m, 4000) > 0.5) lo = m; else hi = m; } return lo; } }),
  M(2, 'growth and decay', R`If $\dfrac{dN}{dt}=kN$ with $k>0$, the doubling time is`, R`$\dfrac{\ln2}k$`, [R`$\dfrac2k$`, R`$\dfrac k{\ln2}$`, R`$k\ln2$`],
    R`<p>$N=N_0e^{kt}$; $2N_0=N_0e^{kt}$ gives $t=\dfrac{\ln2}k$. It does not depend on $N_0$.</p>`, 'The doubling time does not depend on the starting amount.'),
);
// ---------- curves from tangent and normal properties ----------
add(
  M(2, 'curves from slope', R`A curve has slope $2x$ at every point $(x,y)$ and passes through $(1,3)$. Its equation is`, R`$y=x^2+2$`, [R`$y=x^2+3$`, R`$y=2x+1$`, R`$y=x^2+1$`],
    R`<p>$dy=2x\,dx$ so $y=x^2+c$. $(1,3)$: $3=1+c$, $c=2$.</p>`, 'Use the point to find $c$.'),
  M(3, 'curves from tangent properties', R`The $x$-intercept of the tangent at any point of a curve is twice the abscissa of that point. The curve is`, R`$xy=c$`, [R`$y=cx^2$`, R`$y^2=cx$`, R`$y=cx$`],
    R`<p>The tangent at $(x,y)$ cuts the $x$-axis at $x-\dfrac y{y'}$. So $x-\dfrac y{y'}=2x$, giving $\dfrac y{y'}=-x$, i.e. $\dfrac{dy}y=-\dfrac{dx}x$. So $\ln y=-\ln x+\ln c$, $xy=c$.</p>`, 'The intercept formula is $x-y/y\'$.'),
  M(3, 'curves from tangent properties', R`The tangent at $P(x,y)$ meets the $y$-axis at $Q$. If the $x$-axis bisects $PQ$, the curve is`, R`$y=cx^2$`, [R`$xy=c$`, R`$y=cx$`, R`$y^2=cx$`],
    R`<p>The tangent cuts the $y$-axis at $(0,y-xy')$. The midpoint of $PQ$ has ordinate $\dfrac{y+y-xy'}2=0$, so $xy'=2y$, $\dfrac{dy}y=\dfrac{2dx}x$ and $y=cx^2$.</p>`, 'The midpoint lying on the $x$-axis means its ordinate is zero.'),
  M(3, 'curves from tangent properties', R`A curve is such that the normal at every point passes through the origin. The curve is`, R`$x^2+y^2=c$`, [R`$y=cx$`, R`$xy=c$`, R`$y^2=cx$`],
    R`<p>The normal at $(x,y)$ has slope $-\dfrac1{y'}$. It goes through $(0,0)$ and $(x,y)$, so $\dfrac yx=-\dfrac1{y'}$, i.e. $yy'=-x$. Hence $x^2+y^2=c$.</p>`, 'The normal through the origin is the radius, so circles centred at the origin.'),
  I(4, 'curves from slope', R`A curve through $(1,2)$ has a tangent whose slope at each point is twice the slope of the line joining that point to the origin. Find its $y$-coordinate at $x=3$.`, 18,
    R`<p>$\dfrac{dy}{dx}=2\cdot\dfrac yx$, so $\ln y=2\ln x+\ln c$, $y=cx^2$. $(1,2)$ gives $c=2$. At $x=3$: $y=18$.</p>`, 'Slope of the line to the origin is $y/x$.', { calc: () => Math.round(rk4((x, y) => (2 * y) / x, 1, 2, 3)) }),
  M(4, 'curves from tangent properties', R`The length of the tangent segment from any point $P(x,y)$ of a curve to the $y$-axis is 1. Its differential equation is`, R`$x^2\left[1+\left(\dfrac{dy}{dx}\right)^2\right]=1$`, [R`$x\left[1+\left(\dfrac{dy}{dx}\right)^2\right]=1$`, R`$x^2+\left(\dfrac{dy}{dx}\right)^2=1$`, R`$1+x^2\left(\dfrac{dy}{dx}\right)^2=1$`],
    R`<p>The tangent meets the $y$-axis at $Q=(0,y-xy')$. $PQ^2=x^2+(xy')^2=x^2(1+y'^2)$. Setting $PQ=1$: $x^2(1+y'^2)=1$ (the tractrix).</p>`, 'The horizontal run is $x$ and the vertical rise is $xy\'$.'),
  M(4, 'curves from tangent properties', R`A curve has a constant subnormal (the projection of the normal on the $x$-axis has the same length at every point). The curve is`, 'a parabola with its axis along the $x$-axis', ['a circle with centre at the origin', 'a straight line', 'a rectangular hyperbola'],
    R`<p>Subnormal $=y\dfrac{dy}{dx}=k$. So $y\,dy=k\,dx$ and $y^2=2kx+c$, a parabola with axis along the $x$-axis.</p>`, 'Subnormal is $yy\'$; subtangent is $y/y\'$.'),
  D(4, 'curves from slope', R`The slope of a curve at $(x,y)$ equals $x+y$ and the curve passes through $(0,1)$. Find $y$ when $x=1$.`, 3.4366,
    R`<p>$y'-y=x$. IF $=e^{-x}$: $\dfrac d{dx}(ye^{-x})=xe^{-x}$, so $ye^{-x}=-xe^{-x}-e^{-x}+c$, $y=-x-1+ce^x$. $y(0)=1$ gives $c=2$. At $x=1$: $y=2e-2\approx3.44$.</p>`, 'The particular part is $-x-1$.', { calc: () => rk4((x, y) => x + y, 0, 1, 1) }),
  D(4, 'integral equations', R`A function satisfies $f(x)=2+\displaystyle\int_0^xtf(t)\,dt$. Find $f(2)$.`, 14.7781,
    R`<p>Differentiate: $f'(x)=xf(x)$, with $f(0)=2$. So $\ln f=\dfrac{x^2}2+c$, $f=2e^{x^2/2}$. $f(2)=2e^2\approx14.78$.</p>`, 'Do not forget $f(0)=2$ from putting $x=0$.', { calc: () => rk4((x, f) => x * f, 0, 2, 2) }),
  D(4, 'curves from tangent properties', R`A curve through $(0,1)$ has a constant subtangent of length 2 (that is, $\dfrac y{y'}=2$ at every point). Find $y$ at $x=2$.`, 2.7183,
    R`<p>$\dfrac{y}{y'}=2$ gives $\dfrac{dy}y=\dfrac{dx}2$, so $y=ce^{x/2}$. $y(0)=1$: $c=1$. $y(2)=e\approx2.72$.</p>`, 'Subtangent is $y/y\'$, not $y\'/y$.', { calc: () => rk4((x, y) => y / 2, 0, 1, 2) }),
  M(5, 'curves from tangent properties', R`The length of the normal (from the point to the $x$-axis) is $k$ at every point of a curve. The family of curves is`, R`$(x-c)^2+y^2=k^2$`, [R`$x^2+y^2=k^2$`, R`$y^2=4kx$`, R`$y=kx+c$`],
    R`<p>Length of normal $=y\sqrt{1+y'^2}=k$. So $y^2(1+y'^2)=k^2$. Try circles $(x-c)^2+y^2=k^2$ with centre on the $x$-axis: $(x-c)+yy'=0$, so $(x-c)^2=y^2y'^2$, giving $y^2y'^2+y^2=k^2$. Same equation, so these are solutions. (The lines $y=\pm k$ also satisfy it.)</p>`, 'The centre can move along the $x$-axis, so the constant is $c$, not $k$.'),
);

// ---------- assertion, statements ----------
add(
  A(2, 'order and degree', R`The degree of $\sin(y')+y'=x$ is not defined (its order is 1).`, 'Degree is defined only when the equation is a polynomial in the derivatives.', 0,
    R`<p>Both are true. $\sin(y')$ is not a polynomial in $y'$, and that is precisely the reason the degree is not defined.</p>`, 'A trig function of a derivative breaks the polynomial form.'),
  A(2, 'arbitrary constants', R`Eliminating $a$ and $b$ from $y=ae^{x+b}$ gives a first order equation $y'=y$.`, R`The constants combine into one constant: $ae^{x+b}=(ae^b)e^x$.`, 0,
    R`<p>True: $y'=ae^{x+b}=y$. The reason explains it: only one independent constant, so one differentiation is enough.</p>`, 'Two symbols does not mean two constants.'),
  A(3, 'substitution', R`$\dfrac{dy}{dx}=\cos(x+y)$ is not variable separable as it stands.`, R`The substitution $v=x+y$ turns it into a variable separable equation.`, 1,
    R`<p>Both true. $\cos(x+y)$ cannot be split into $f(x)g(y)$, so A holds. R is also true ($v'=1+\cos v$), but it does not explain why A is true.</p>`, 'Both true is not the same as R explaining A.'),
  A(3, 'existence', R`The solution of $\dfrac{dy}{dx}=y^2$ with $y(0)=1$ exists for all real $x$.`, R`The solution is $y=\dfrac1{1-x}$.`, 3,
    R`<p>R is true: $\dfrac{dy}{y^2}=dx$ gives $-\dfrac1y=x+c$, $c=-1$, so $y=\dfrac1{1-x}$. But this blows up at $x=1$, so A is false.</p>`, 'Solutions can blow up in finite time.'),
  A(5, 'uniqueness', R`The problem $\dfrac{dy}{dx}=\sqrt y$, $y(0)=0$ has a unique solution.`, R`Both $y=0$ and $y=\dfrac{x^2}4$ ($x\ge0$) satisfy it.`, 3,
    R`<p>$y=0$ works. For $y=x^2/4$: $y'=x/2$ and $\sqrt y=x/2$ for $x\ge0$, so it works too. R is true, hence the solution is not unique and A is false. (The right side $\sqrt y$ is not Lipschitz at $y=0$.)</p>`, 'Existence does not give uniqueness.'),
  A(3, 'Newton cooling', R`By Newton's law of cooling, a hot body never reaches the room temperature in finite time.`, R`$T-T_s=Ce^{-kt}$, and an exponential is never zero.`, 0,
    R`<p>Both true and R explains A: $T=T_s$ would need $e^{-kt}=0$, impossible for finite $t$.</p>`, 'Real cooling is approximate; the model never ends.'),
  A(3, 'exact-looking', R`The solution of $x\,dy-y\,dx=0$ is $y=cx$.`, R`$x\,dy-y\,dx=x^2\,d(xy)$.`, 2,
    R`<p>A is true: $\dfrac{dy}y=\dfrac{dx}x$ gives $y=cx$. R is false: $x\,dy-y\,dx=x^2\,d\left(\dfrac yx\right)$, not $d(xy)$. ($d(xy)=x\,dy+y\,dx$.)</p>`, 'Minus gives $y/x$, plus gives $xy$.'),
  A(3, 'variable separable', R`The solution curves of $\dfrac{dy}{dx}=\dfrac xy$ are hyperbolas.`, R`Integrating $y\,dy=x\,dx$ gives $x^2+y^2=c$.`, 2,
    R`<p>A is true: $y\,dy=x\,dx$ gives $y^2-x^2=c$, a family of hyperbolas. R is false because the sign is minus, not plus.</p>`, 'Circles come from $-x/y$.'),
  A(4, 'growth and decay', R`If $\dfrac{dN}{dt}=kN$, the time for $N$ to double does not depend on the starting value $N_0$.`, R`$N=N_0e^{kt}$ and $N=2N_0$ gives $e^{kt}=2$, in which $N_0$ cancels.`, 0,
    R`<p>Both true and R explains A: $t=\dfrac{\ln2}k$.</p>`, 'The same holds for half-life.'),
  S(2, 'arbitrary constants', R`The differential equation of $y=A\cos(x+B)$ is of order 2.`, 'The general solution of a second order differential equation has two arbitrary constants.', 0,
    R`<p>Both true. $A$ and $B$ are two independent constants, so two differentiations are needed: $y''+y=0$.</p>`, 'Count independent constants.'),
  S(3, 'homogeneous equations', R`$\dfrac{dy}{dx}=\dfrac{x^2+y^2}{x^3}$ is a homogeneous differential equation.`, R`$\dfrac{dy}{dx}=\dfrac{x+y}{x-y}$ is a homogeneous differential equation.`, 2,
    R`<p>Statement I: replacing $(x,y)$ by $(tx,ty)$ gives $\dfrac{t^2(x^2+y^2)}{t^3x^3}=\dfrac1t\cdot\dfrac{x^2+y^2}{x^3}$, not unchanged, so it is not homogeneous. Statement II: the ratio is unchanged, so it is homogeneous.</p>`, 'The degrees of top and bottom must match.'),
  S(3, 'linear first order', R`The integrating factor of $\dfrac{dy}{dx}+y\cot x=x$ is $\sin x$.`, R`The integrating factor of $\dfrac{dy}{dx}+2y=x$ is $2e^{x}$.`, 1,
    R`<p>I: $e^{\int\cot x\,dx}=e^{\ln\sin x}=\sin x$, true. II: $e^{\int2\,dx}=e^{2x}$, not $2e^x$. So I is true and II is false.</p>`, 'The IF is $e^{\\int P}$, so the coefficient goes in the exponent.'),
  SC(3, 'mixed concepts', ['The general solution of $y\'\'=0$ has 2 arbitrary constants.', R`$y=\sin x$ is a particular solution of $y''+y=0$.`, R`The degree of $(y'')^2+y'=0$ is 1.`, R`The orthogonal trajectories of $xy=c$ are the circles $x^2+y^2=k$.`], '2', ['1', '3', '4'],
    R`<p>1 is true ($y=Ax+B$). 2 is true ($y''=-\sin x=-y$). 3 is false: the degree is 2 (power of $y''$). 4 is false: the trajectories of $xy=c$ are $y^2-x^2=k$. Two are correct.</p>`, 'Check each line separately.'),
  S(4, 'substitution', R`$\dfrac{dy}{dx}=(x+y)^2$ can be solved by $v=x+y$.`, R`$\dfrac{dy}{dx}=(x+y)^2$ is a homogeneous differential equation.`, 1,
    R`<p>I is true ($v'=1+v^2$). II is false: $(tx+ty)^2=t^2(x+y)^2\ne(x+y)^2$, so the right side changes with $t$.</p>`, 'Homogeneous means degree 0 in the ratio form.'),
  S(4, 'long-run behaviour', R`The solution of $y'+y=0$, $y(0)=1$, tends to 0 as $x\to\infty$.`, R`The solution of $y'-y=0$, $y(0)=1$, tends to 0 as $x\to\infty$.`, 1,
    R`<p>I: $y=e^{-x}\to0$, true. II: $y=e^{x}\to\infty$, false.</p>`, 'The sign of the coefficient decides growth or decay.'),
  SC(4, 'mixed concepts', [R`Every linear first order equation can be solved with an integrating factor.`, R`The general solution of $y'=\dfrac yx+1$ is $y=x\ln x+cx$.`, R`$x\,dy-y\,dx=0$ and $y\,dx+x\,dy=0$ have the same solutions.`, R`$y'=\sqrt y$ has a unique solution through $(0,0)$.`, R`The family $y=ce^x$ satisfies $y'=y$.`], '3', ['2', '4', '5'],
    R`<p>1 true. 2 true: $\left(\dfrac yx\right)'=\dfrac1x$ gives $\dfrac yx=\ln x+c$. 3 false: $y=cx$ versus $xy=c$. 4 false: $y=0$ and $y=x^2/4$ both work. 5 true. Three are correct.</p>`, 'Statements 3 and 4 are the usual traps.'),
);

// ---------- multi-correct ----------
add(
  X(2, 'order and degree', 'Which of these equations are of order 2?',
    [R`$y''+3y'=0$`, R`$(y')^2+y'''=0$`, R`$\left(\dfrac{d^2y}{dx^2}\right)^3+\dfrac{dy}{dx}=x$`, R`$y'=y^2$`], [0, 2],
    R`<p>Order = highest derivative. A: $y''$, order 2. B: $y'''$, order 3. C: $\dfrac{d^2y}{dx^2}$, order 2 (the cube is the degree). D: order 1.</p>`, 'The exponent is not the order.'),
  X(3, 'homogeneous equations', 'Which of the following are homogeneous differential equations?',
    [R`$\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$`, R`$\dfrac{dy}{dx}=\dfrac{x+y}{x-y}$`, R`$\dfrac{dy}{dx}=\dfrac{x^2+y}{x^2}$`, R`$\dfrac{dy}{dx}=\dfrac yx+\sin\dfrac yx$`, R`$\dfrac{dy}{dx}=\dfrac{x+y+1}{x-y}$`], [0, 1, 3],
    R`<p>A: degree 0 overall, yes. B: yes. C: the term $y/x^2$ changes with $t$, no. D: a function of $y/x$, yes. E: the $+1$ spoils it, no (it reduces to homogeneous by a shift).</p>`, 'Constants spoil homogeneity.'),
  X(3, 'verifying solutions', R`Which of these are solutions of $y''-3y'+2y=0$?`,
    [R`$y=e^x$`, R`$y=e^{2x}$`, R`$y=e^x+e^{2x}$`, R`$y=xe^x$`], [0, 1, 2],
    R`<p>$m^2-3m+2=(m-1)(m-2)$, roots $1,2$. So $e^x$, $e^{2x}$ and their sum are solutions. $xe^x$ would need a repeated root: $y=xe^x$ gives $y''-3y'+2y=(x+2-3x-3+2x)e^x=-e^x\ne0$.</p>`, 'Distinct roots do not give an $x$ factor.'),
  X(4, 'variable separable', 'Which of these are variable separable as written?',
    [R`$\dfrac{dy}{dx}=x^2y$`, R`$\dfrac{dy}{dx}=x+y$`, R`$\dfrac{dy}{dx}=e^{x+y}$`, R`$\dfrac{dy}{dx}=\sin(xy)$`, R`$\dfrac{dy}{dx}=\dfrac{1+y^2}{1+x^2}$`], [0, 2, 4],
    R`<p>Separable means $f(x)g(y)$. A: $x^2\cdot y$. C: $e^x\cdot e^y$. E: $\dfrac1{1+x^2}\cdot(1+y^2)$. B is a sum, D mixes $x$ and $y$ inside sin.</p>`, 'A sum of $x$ and $y$ parts is not a product.'),
  X(4, 'growth and decay', R`$\dfrac{dN}{dt}=kN$ with $N(0)=N_0$ ($k>0$). Which statements are correct?`,
    [R`$N(t)=N_0e^{kt}$`, R`the doubling time is $\dfrac{\ln2}k$`, R`$N$ triples at $t=\dfrac{3\ln2}k$`, R`the rate of growth at time $t$ is $kN_0e^{kt}$`], [0, 1, 3],
    R`<p>A and B follow from the solution. C is false: tripling gives $e^{kt}=3$, $t=\dfrac{\ln3}k$. D: rate $=kN=kN_0e^{kt}$.</p>`, 'Tripling uses $\\ln3$.'),
  X(4, 'linear first order', R`For $\dfrac{dy}{dx}+y=x$, which statements are correct?`,
    [R`the integrating factor is $e^x$`, R`$y=x-1$ is a particular solution`, R`every solution approaches $y=x-1$ as $x\to\infty$`, R`if $y(0)=1$ the constant in $y=x-1+Ce^{-x}$ is 1`], [0, 1, 2],
    R`<p>IF $=e^x$ and $y=x-1+Ce^{-x}$. A, B, C are true (the $Ce^{-x}$ part dies out). D is false: $y(0)=-1+C=1$ gives $C=2$.</p>`, 'Do not forget the $-1$ in the particular part.'),
  X(5, 'orthogonal trajectories', R`The parabolas $y^2=4ax$ and the curves $2x^2+y^2=k$ are orthogonal families. Which statements about the point $(1,2)$ are correct?`,
    [R`the parabola through it has slope 1`, R`the member of $2x^2+y^2=k$ through it has $k=6$`, R`the slope of that member at $(1,2)$ is $-1$`, R`the two families never meet`], [0, 1, 2],
    R`<p>$y^2=4x$ (since $4=4a$, $a=1$): $2yy'=4$, $y'=\dfrac2y=1$. The other: $k=2+4=6$, slope $=-\dfrac{2x}y=-1$. Product $-1$: perpendicular. D is false, they meet at $(1,2)$.</p>`, 'Orthogonal curves do meet, at right angles.'),
  X(5, 'uniqueness', R`The equation $\dfrac{dy}{dx}=3y^{2/3}$ with $y(0)=0$ has which solutions?`,
    [R`$y=0$`, R`$y=x^3$`, R`$y=-x^3$`, R`$y=x^3$ for $x\ge0$ and $y=0$ for $x<0$`], [0, 1, 3],
    R`<p>$y=0$ works. $y=x^3$: $y'=3x^2$ and $3y^{2/3}=3x^2$, works. $y=-x^3$: $y'=-3x^2$ but $3y^{2/3}=3x^2$, fails. The piecewise one is differentiable and works. Non-uniqueness occurs because $y^{2/3}$ is not Lipschitz at 0.</p>`, 'Check the sign by substitution.'),
);

// ---------- match ----------
add(
  MT(2, 'order and degree', 'm1', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>A: highest derivative $y''$ to power 3: (2, 3), p. B: order 3, degree 1: q. C: square both sides, $1+y'^2=y''^2$: (2, 2), r. D: $y''$ inside $\sin$: degree not defined, s.</p>`, 'Clear the radical before reading the degree.'),
  MT(3, 'general solutions', 'm2', 'Match List I with List II.', 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    R`<p>A: $\dfrac{dy}y=\dfrac{dx}x$, $y=cx$ (r). B: $y\,dy=-x\,dx$, $x^2+y^2=c$ (s). C: $y'=1-y$, $y=1+ce^{-x}$ (p). D: $\left(\dfrac yx\right)'=\dfrac1x$, $y=x\ln x+cx$ (q).</p>`, 'Sign matters between A and B.'),
  MT(3, 'integrating factors', 'm3', 'Match List I with List II.', 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'],
    R`<p>A: $e^{\int2/x}=x^2$. B: $e^{\int\tan x}=\sec x$. C: $e^{\int\frac1{x\ln x}dx}=e^{\ln\ln x}=\ln x$. D: $e^{\int3dx}=e^{3x}$.</p>`, '$\\int\\dfrac{dx}{x\\ln x}=\\ln\\ln x$.'),
  MT(2, 'modelling', 'm4', 'Match List I with List II.', 'A-q, B-r, C-s, D-p', ['A-s, B-r, C-q, D-p', 'A-q, B-p, C-s, D-r', 'A-r, B-q, C-s, D-p'],
    R`<p>Decay: $dN/dt=-kN$ (q). Cooling: $dT/dt=-k(T-T_s)$ (r). Continuous growth: $dA/dt=kA$ (s). Drag: $dv/dt=g-kv$ (p).</p>`, 'Cooling uses the difference from room temperature.'),
);

// ---------- passages ----------
add(
  PI(3, 'curves from slope', 'p1', R`Find $y$ at $x=\sqrt8$.`, 6,
    R`<p>$\dfrac{dy}y=\dfrac{x\,dx}{1+x^2}$, so $y=C\sqrt{1+x^2}$. $(0,2)$: $C=2$. At $x=\sqrt8$: $2\sqrt9=6$.</p>`, 'Use $C=2$.', { calc: () => Math.round(rk4((x, y) => (x * y) / (1 + x * x), 0, 2, sqrt(8))) }),
  PD(3, 'curves from slope', 'p1', R`Find the slope of the curve at $x=\sqrt3$.`, 1.7321,
    R`<p>$y(\sqrt3)=2\sqrt{1+3}=4$. Slope $=\dfrac{\sqrt3\times4}{1+3}=\sqrt3\approx1.73$.</p>`, 'Use the equation of the curve to get $y$ first.', { calc: () => (sqrt(3) * rk4((x, y) => (x * y) / (1 + x * x), 0, 2, sqrt(3))) / 4 }),
  PI(3, 'curves from slope', 'p1', R`The curve can be written $y^2=a(1+x^2)$. Find $a$.`, 4,
    R`<p>$y=2\sqrt{1+x^2}$ gives $y^2=4(1+x^2)$, so $a=4$.</p>`, 'Square the solution.', { calc: () => Math.round(rk4((x, y) => (x * y) / (1 + x * x), 0, 2, 1) ** 2 / 2) }),
  PI(3, 'mixing problems', 'p2', R`At $t=0$, at how many kg per minute does salt enter the tank?`, 1,
    R`<p>Rate in $=4\times0.25=1$ kg per minute.</p>`, 'Only the inflow rate is asked.'),
  PD(4, 'mixing problems', 'p2', R`Find $x$ after 50 minutes (in kg).`, 31.606,
    R`<p>$\dfrac{dx}{dt}=1-\dfrac{4x}{200}=1-\dfrac x{50}$. $x=50+Ce^{-t/50}$, $x(0)=0$ gives $C=-50$. $x(50)=50(1-e^{-1})\approx31.61$ kg.</p>`, 'Outflow rate is $4\\times x/200$.', { calc: () => rk4((t, x) => 1 - x / 50, 0, 0, 50) }),
  PD(4, 'mixing problems', 'p2', R`After how many minutes is there 25 kg of salt in the tank? Give the answer in minutes`, 34.657,
    R`<p>$50(1-e^{-t/50})=25$ gives $e^{-t/50}=\tfrac12$, $t=50\ln2\approx34.66$ min.</p>`, 'The tank never exceeds 50 kg.', { calc: () => 50 * ln(2) }),
  PI(4, 'Bernoulli equation', 'p3', R`The solution has the form $y=\dfrac1{x(c-x)}$. Find $c$.`, 2,
    R`<p>Put $v=1/y$: $v'-\dfrac vx=-x$. $\dfrac d{dx}\left(\dfrac vx\right)=-1$, so $v=x(c-x)$. $v(1)=1$: $1=c-1$, $c=2$.</p>`, 'Remember $v(1)=1/y(1)=1$.'),
  PD(4, 'Bernoulli equation', 'p3', R`Find $y(1.5)$.`, 1.3333,
    R`<p>$y=\dfrac1{x(2-x)}$. At $x=1.5$: $\dfrac1{1.5\times0.5}=\dfrac43\approx1.33$.</p>`, 'Take the reciprocal at the end.', { calc: () => rk4((x, y) => x * y * y - y / x, 1, 1, 1.5) }),
  PI(4, 'Bernoulli equation', 'p3', R`The solution exists only for $0<x<a$. Find $a$.`, 2,
    R`<p>$y=\dfrac1{x(2-x)}$ blows up as $x\to2$. So the solution lives on $(0,2)$ and $a=2$.</p>`, 'The solution of a nonlinear equation can blow up.'),
  PD(3, 'Newton cooling', 'p4', R`Find the temperature after 10 minutes in $^\circ$C.`, 55.7143,
    R`<p>$T-20=70e^{-kt}$. At 5 min: $50=70e^{-5k}$, so $e^{-5k}=\tfrac57$. At 10 min: $T-20=70\left(\tfrac57\right)^2=\dfrac{250}7=35.71$, $T=55.71^\circ$C.</p>`, 'Use differences from the room temperature.', { calc: () => 20 + 70 * (5 / 7) ** 2 }),
  PD(4, 'Newton cooling', 'p4', R`After how many minutes does the coffee reach $30^\circ$C? Give the answer in minutes`, 28.917,
    R`<p>$k=\dfrac15\ln\dfrac75$. $10=70e^{-kt}$, $e^{-kt}=\tfrac17$, $t=\dfrac{\ln7}k=\dfrac{5\ln7}{\ln1.4}\approx28.92$ min.</p>`, 'The cooling takes much longer near the end.', { calc: () => (5 * ln(7)) / ln(1.4) }),
  PD(4, 'Newton cooling', 'p4', R`Find the rate at which the coffee is cooling at $t=0$ in $^\circ$C per minute (a positive number).`, 4.7106,
    R`<p>$\left|\dfrac{dT}{dt}\right|=k(T-20)=\dfrac{\ln1.4}5\times70=14\ln1.4\approx4.71$.</p>`, 'Rate is $k$ times the temperature difference.', { calc: () => (ln(1.4) / 5) * 70 }),
);

// ---------- mixed with other chapters ----------
add(
  I(3, 'mixed', R`A continuous function satisfies $f(x)=3+2\displaystyle\int_0^xf(t)\,dt$. Find $f(\ln2)$.`, 12,
    R`<p>Differentiate: $f'=2f$ with $f(0)=3$. So $f=3e^{2x}$ and $f(\ln2)=3\cdot4=12$.</p>`, 'The integral equation hides a differential equation.', { calc: () => Math.round(rk4((x, f) => 2 * f, 0, 3, ln(2))) }),
  I(3, 'mixed', R`A spherical balloon is inflated so that its volume grows at a rate proportional to its surface area. Its radius is 3 cm at $t=0$ and 5 cm at $t=2$ seconds. Find the radius at $t=5$ seconds (in cm).`, 8,
    R`<p>$\dfrac{dV}{dt}=k\cdot4\pi r^2$ and $\dfrac{dV}{dt}=4\pi r^2\dfrac{dr}{dt}$. So $\dfrac{dr}{dt}=k$, constant. $r$ grows by 2 cm in 2 s, so $k=1$ cm/s and $r=3+t$. At $t=5$: 8 cm.</p>`, 'The surface area cancels from both sides.', { calc: () => 3 + (5 - 3) / 2 * 5 }),
  M(3, 'mixed', R`A radioactive nucleus has half-life 10 days. The probability that it has decayed within 30 days is`, R`$\dfrac78$`, [R`$\dfrac18$`, R`$\dfrac34$`, R`$\dfrac13$`],
    R`<p>Survival probability $=e^{-\lambda t}=\left(\tfrac12\right)^3=\tfrac18$. So decay probability $=1-\tfrac18=\tfrac78$.</p>`, 'Subtract from 1: the question asks for decay.'),
);

// ---------- more warm-ups (L1, L2) and top-rank (L5) ----------
add(
  M(1, 'order and degree', R`The order of $\dfrac{d^2y}{dx^2}+x^2y=0$ is`, '2', ['1', '0', '3'],
    R`<p>The highest derivative present is the second derivative, so the order is 2.</p>`, '$x^2$ is not a derivative.'),
  I(1, 'order and degree', R`Find the degree of $\left(\dfrac{dy}{dx}\right)^4+y=x$.`, 4,
    R`<p>The only derivative is $\dfrac{dy}{dx}$ and it is raised to power 4. Degree 4.</p>`, 'The equation is already polynomial in $y\'$.'),
  M(1, 'variable separable', R`The general solution of $\dfrac{dy}{dx}=3x^2$ is`, R`$y=x^3+c$`, [R`$y=3x^3+c$`, R`$y=6x+c$`, R`$y=\dfrac{x^3}3+c$`],
    R`<p>$dy=3x^2dx$, integrate: $y=x^3+c$.</p>`, 'Integrate once; the derivative is not the answer.'),
  I(1, 'arbitrary constants', R`Find the order of the differential equation of the family of all straight lines $y=mx+c$ ($m,c$ both arbitrary).`, 2,
    R`<p>Two constants $m$ and $c$ need two differentiations: $y''=0$. The order is 2.</p>`, 'One constant fewer when the line passes through the origin.'),
  M(1, 'linear first order', R`The integrating factor of $\dfrac{dy}{dx}+y=x$ is`, R`$e^{x}$`, [R`$e^{-x}$`, R`$x$`, R`$1$`],
    R`<p>$P=1$, so IF $=e^{\int1dx}=e^x$.</p>`, 'The IF uses $+P$, so $e^{x}$ and not $e^{-x}$.'),
  M(1, 'growth and decay', R`The solution of $\dfrac{dy}{dx}=y$ with $y(0)=2$ is`, R`$y=2e^x$`, [R`$y=e^{2x}$`, R`$y=x+2$`, R`$y=2e^{-x}$`],
    R`<p>$\dfrac{dy}y=dx$, $y=Ce^x$, $y(0)=2$ gives $C=2$.</p>`, '$C$ is the value at $x=0$.'),
  I(1, 'variable separable', R`If $\dfrac{dy}{dx}=4x^3$ and $y(0)=1$, find $y(1)$.`, 2,
    R`<p>$y=x^4+c$, $y(0)=1$ gives $c=1$. $y(1)=1+1=2$.</p>`, 'Use the initial value to find $c$.', { calc: () => Math.round(rk4((x, y) => 4 * x ** 3, 0, 1, 1)) }),
  M(1, 'Newton cooling', R`Newton's law of cooling for a body at temperature $T$ in surroundings at $T_s$ is`, R`$\dfrac{dT}{dt}=-k(T-T_s)$`, [R`$\dfrac{dT}{dt}=-kT$`, R`$\dfrac{dT}{dt}=k(T-T_s)$`, R`$\dfrac{dT}{dt}=-k(T-T_s)^2$`],
    R`<p>The rate of cooling is proportional to the temperature difference, and the temperature falls, so the sign is negative: $\dfrac{dT}{dt}=-k(T-T_s)$ with $k>0$.</p>`, 'The difference from the surroundings matters, not $T$ itself.'),
  I(1, 'growth and decay', R`A radioactive sample of 80 g has half-life 5 days. How many grams are left after 15 days?`, 10,
    R`<p>15 days is 3 half-lives: $80\times\left(\tfrac12\right)^3=10$ g.</p>`, 'Three halvings, not a third.', { calc: () => Math.round(80 * exp((-ln(2) / 5) * 15)) }),
  M(1, 'variable separable', R`The solution of $\dfrac{dy}{dx}=e^x$ is`, R`$y=e^x+c$`, [R`$y=xe^x+c$`, R`$y=e^{x}/x+c$`, R`$y=ce^{x}\cdot x$`],
    R`<p>Integrate both sides: $y=\int e^xdx=e^x+c$.</p>`, 'The integral of $e^x$ is $e^x$.'),
  M(1, 'verifying solutions', R`Which function satisfies $\dfrac{dy}{dx}-3y=0$?`, R`$y=e^{3x}$`, [R`$y=e^{-3x}$`, R`$y=3x$`, R`$y=x^3$`],
    R`<p>$y=e^{3x}$ gives $y'=3e^{3x}=3y$. For $e^{-3x}$, $y'=-3y$.</p>`, 'Check the sign of the exponent.'),
  M(1, 'forming equations', R`Eliminating $C$ from $y=Ce^{-x}$ gives`, R`$y'+y=0$`, [R`$y'-y=0$`, R`$y'=xy$`, R`$y''+y=0$`],
    R`<p>$y'=-Ce^{-x}=-y$, so $y'+y=0$.</p>`, 'Differentiate once.'),
  M(2, 'homogeneous equations', R`For $\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$, putting $y=vx$ gives $\dfrac{dy}{dx}$ equal to`, R`$v+x\dfrac{dv}{dx}$`, [R`$v\dfrac{dx}{dx}$`, R`$x\dfrac{dv}{dx}$`, R`$\dfrac{dv}{dx}$`],
    R`<p>By the product rule $\dfrac d{dx}(vx)=v+x\dfrac{dv}{dx}$.</p>`, 'Do not forget the $v$ term.'),
  I(2, 'growth and decay', R`Solve $\dfrac{dy}{dx}=2y$ with $y(0)=3$ and find $y(\ln2)$.`, 12,
    R`<p>$y=3e^{2x}$. At $x=\ln2$: $3e^{2\ln2}=3\times4=12$.</p>`, '$e^{2\\ln2}=4$.', { calc: () => Math.round(rk4((x, y) => 2 * y, 0, 3, ln(2))) }),
  M(2, 'linear first order', R`The integrating factor of $\dfrac{dy}{dx}+2y=e^{-x}$ is`, R`$e^{2x}$`, [R`$e^{-x}$`, R`$e^{x}$`, R`$2x$`],
    R`<p>IF $=e^{\int2\,dx}=e^{2x}$. The right side $e^{-x}$ does not affect the IF.</p>`, 'The IF depends only on the coefficient of $y$.'),
  I(2, 'order and degree', R`Find (order) + (degree) of $\left(\dfrac{d^2y}{dx^2}\right)^2+\left(\dfrac{dy}{dx}\right)^3+y^4=0$.`, 4,
    R`<p>Highest derivative is $y''$ (order 2) to the power 2 (degree 2). Sum $=4$.</p>`, 'Use the power of $y\'\'$, not of $y\'$.'),
  M(2, 'exact-looking', R`The solution of $x\,dy+y\,dx=0$ is`, R`$xy=c$`, [R`$\dfrac yx=c$`, R`$x+y=c$`, R`$y=cx^2$`],
    R`<p>$x\,dy+y\,dx=d(xy)=0$, so $xy=c$.</p>`, 'Plus sign gives the product; minus gives the ratio.'),
  I(2, 'variable separable', R`If $\dfrac{dy}{dx}=\dfrac xy$ with $y(0)=3$ and $y>0$, find $y(4)$.`, 5,
    R`<p>$y\,dy=x\,dx$, $y^2-x^2=c$. $y(0)=3$ gives $c=9$. $y(4)^2=16+9=25$, $y=5$.</p>`, 'Pick the positive root.', { calc: () => Math.round(rk4((x, y) => x / y, 0, 3, 4)) }),
  I(2, 'variable separable', R`If $\dfrac{dy}{dx}=\dfrac yx$ and $y(1)=2$, find $y(3)$.`, 6,
    R`<p>$y=cx$ with $c=2$. $y(3)=6$.</p>`, 'The solution is a straight line through the origin.', { calc: () => Math.round(rk4((x, y) => y / x, 1, 2, 3)) }),
  M(2, 'orthogonal trajectories', R`If two families of curves are orthogonal, the product of their slopes at a point of intersection is`, '$-1$', ['$1$', '$0$', '$2$'],
    R`<p>At right angles the slopes satisfy $m_1m_2=-1$. So $m_2=-\dfrac1{m_1}$, i.e. replace $y'$ by $-\dfrac1{y'}$ in the first family's equation.</p>`, 'Replace $y\'$ by $-1/y\'$, not just by $-y\'$.'),
  D(5, 'homogeneous equations', R`Solve $x\dfrac{dy}{dx}=y+x\sin^2\dfrac yx$ ($x>0$) with $y(1)=\dfrac\pi4$ and find $y(e)$.`, 4.2699,
    R`<p>$y=vx$: $xv'=\sin^2v$, so $\csc^2v\,dv=\dfrac{dx}x$, $-\cot v=\ln x+c$. $v(1)=\dfrac\pi4$: $-1=c$. At $x=e$: $-\cot v=1-1=0$, $v=\dfrac\pi2$. $y=e\cdot\dfrac\pi2\approx4.27$.</p>`, '$\\cot\\dfrac\\pi4=1$.', { calc: () => rk4((x, y) => y / x + sin(y / x) ** 2, 1, PI_ / 4, E_) }),
  D(5, 'integral equations', R`A positive function satisfies $\displaystyle\int_1^xf(t)\,dt=x^2f(x)-1$ with $f(1)=1$. Find $f(2)$.`, 0.4122,
    R`<p>Differentiate: $f=2xf+x^2f'$, so $\dfrac{f'}f=\dfrac1{x^2}-\dfrac2x$, $\ln f=-\dfrac1x-2\ln x+c$, $f=\dfrac{Ce^{-1/x}}{x^2}$. $f(1)=1$ gives $C=e$. $f(2)=\dfrac{e\cdot e^{-1/2}}4=\dfrac{\sqrt e}4\approx0.412$. (Check at $x=1$: both sides are $0$.)</p>`, 'Use $x=1$ to check the equation is consistent with $f(1)=1$.', { calc: () => rk4((x, f) => ((1 - 2 * x) * f) / (x * x), 1, 1, 2) }),
  D(5, 'linear first order', R`The surroundings of a body warm up, so $\dfrac{dT}{dt}=-0.5\left(T-20-2t\right)$ with $T(0)=60$ ($T$ in $^\circ$C, $t$ in minutes). Find $T(4)$.`, 29.954,
    R`<p>$T'+0.5T=10+t$. Try $T_p=16+2t$: $2+0.5(16+2t)=10+t$ ✓. So $T=16+2t+Ce^{-0.5t}$. $T(0)=60$: $C=44$. $T(4)=16+8+44e^{-2}=24+5.954=29.95^\circ$C.</p>`, 'The particular solution is a line, not a constant.', { calc: () => rk4((t, T) => -0.5 * (T - 20 - 2 * t), 0, 60, 4) }),
);

// ---------- number templates ----------
const dn = (n) => (n === 1 ? R`\dfrac{dy}{dx}` : R`\dfrac{d^{${n}}y}{dx^{${n}}}`);
const pw = (s, k) => (k === 1 ? R`\left(${s}\right)` : R`\left(${s}\right)^{${k}}`);
const OD = [];
const gens = [
  // order + degree: four different equation shapes
  gen('de-g01', 2, 'nat', 'integer', 'order and degree', (rng) => {
    const v = int(rng, 0, 3), n = int(rng, 2, 4), m = int(rng, 1, 4), p = int(rng, 1, 3), qq = int(rng, 2, 4);
    let q, deg, sol;
    if (v === 0) { deg = m; q = R`$${pw(dn(n), m)}+${pw(dn(1), p)}+y=0$`; sol = R`<p>The highest derivative is $${dn(n)}$, order ${n}. It appears to the power ${m}, so the degree is ${m}. Sum $=${n + m}$.</p>`; }
    else if (v === 1) { deg = qq; q = R`$${dn(n)}=\left(1+${pw(dn(1), p)}\right)^{1/${qq}}$`; sol = R`<p>Raise both sides to the power ${qq} to clear the fractional power: $\left(${dn(n)}\right)^{${qq}}=1+${pw(dn(1), p)}$. Order ${n}, degree ${qq}. Sum $=${n + qq}$.</p>`; }
    else if (v === 2) { deg = 1; q = R`$\sqrt[${qq}]{${dn(n)}}=x+\dfrac{dy}{dx}$`; sol = R`<p>Raise both sides to the power ${qq}: $${dn(n)}=\left(x+\dfrac{dy}{dx}\right)^{${qq}}$. The highest derivative $${dn(n)}$ has power 1, so the degree is 1. The power ${qq} is on a lower derivative. Order ${n}, sum $=${n + 1}$.</p>`; }
    else { deg = m; q = R`$x${pw(dn(n), m)}+y${pw(dn(1), p)}=\sin x$`; sol = R`<p>The highest derivative $${dn(n)}$ is of order ${n} and has power ${m}. Degree ${m}. Sum $=${n + m}$.</p>`; }
    return { v, ord: n, deg, answer: n + deg, tol: 0, q: R`Find (order) + (degree) of ${q}.`, sol };
  }, (p) => p.ord + p.deg),

  // number of independent constants
  gen('de-g02', 2, 'nat', 'integer', 'arbitrary constants', (rng) => {
    const v = int(rng, 0, 3), a = int(rng, 1, 4), b = a + int(rng, 1, 3), k = int(rng, 2, 5);
    let q, sol, ind;
    if (v === 0) { ind = 3; q = R`$y=c_1x^{${a}}+c_2x^{${b}}+c_3$`; sol = R`<p>$x^{${a}}$, $x^{${b}}$ and $1$ are three different functions, so $c_1,c_2,c_3$ are independent. The order is 3.</p>`; }
    else if (v === 1) { ind = 2; q = R`$y=(c_1+c_2)e^{x}+c_3e^{${k}x}$`; sol = R`<p>$c_1+c_2$ is a single constant $A$. So $y=Ae^{x}+c_3e^{${k}x}$ has two independent constants. The order is 2.</p>`; }
    else if (v === 2) { ind = 2; q = R`$y=c_1e^{${k}x+c_2}+c_3$`; sol = R`<p>$c_1e^{c_2}e^{${k}x}$ contains only the combination $A=c_1e^{c_2}$. So $y=Ae^{${k}x}+c_3$ has two independent constants. The order is 2.</p>`; }
    else { ind = 2; q = R`$y=c_1\sin(${k}x+c_2)+c_3\cos ${k}x$`; sol = R`<p>$c_1\sin(${k}x+c_2)=A\sin ${k}x+B\cos ${k}x$ where $A=c_1\cos c_2$, $B=c_1\sin c_2$. Adding $c_3\cos ${k}x$ only changes the coefficient of $\cos ${k}x$. So there are two independent constants. The order is 2.</p>`; }
    return { v, ind, answer: ind, tol: 0, q: R`Find the order of the differential equation obtained by eliminating all the arbitrary constants $c_1,c_2,c_3$ from ${q}.`, sol };
  }, (p) => p.ind),

  // forming the differential equation of a family
  gen('de-g03', 2, 'mcq', 'single', 'forming equations', (rng) => {
    const v = int(rng, 0, 3);
    let q, good, wrongs, sol;
    if (v === 0) {
      const n = int(rng, 2, 6);
      q = R`The differential equation of $y=Ax^{${n}}$ is`; good = R`$xy'=${n}y$`; wrongs = [R`$xy'=\dfrac y{${n}}$`, R`$y'=${n}y$`, R`$xy'=${n + 1}y$`];
      sol = R`<p>$y'=${n}Ax^{${n - 1}}$. Multiply by $x$: $xy'=${n}Ax^{${n}}=${n}y$.</p>`;
      for (const x of [1.3, 2.1]) { const y = 0.7 * x ** n, yp = 0.7 * n * x ** (n - 1); if (Math.abs(x * yp - n * y) > 1e-9) throw new Error('de-g03 v0'); }
    } else if (v === 1) {
      const k = pick(rng, 2, 7);
      q = R`The differential equation of $y=Ae^{${k}x}$ is`; good = R`$y'=${k}y$`; wrongs = [R`$y'=\dfrac y{${k}}$`, R`$y''=${k}y$`, R`$y'=${k}xy$`];
      sol = R`<p>$y'=${k}Ae^{${k}x}=${k}y$. One constant, order 1.</p>`;
    } else if (v === 2) {
      const n = int(rng, 3, 6);
      q = R`The differential equation of $y=Ax^{${n}}+B$ is`; good = R`$xy''=${n - 1}y'$`; wrongs = [R`$xy''=${n}y'$`, R`$xy''=-${n - 1}y'$`, R`$x^{2}y''=${n - 1}y$`];
      sol = R`<p>$y'=${n}Ax^{${n - 1}}$, $y''=${n * (n - 1)}Ax^{${n - 2}}$. So $xy''=${n * (n - 1)}Ax^{${n - 1}}=${n - 1}y'$. (The constant $B$ vanishes on the first differentiation.)</p>`;
      for (const x of [1.3, 2.1]) { const yp = 0.7 * n * x ** (n - 1), ypp = 0.7 * n * (n - 1) * x ** (n - 2); if (Math.abs(x * ypp - (n - 1) * yp) > 1e-9) throw new Error('de-g03 v2'); }
    } else {
      let a, b; do { a = int(rng, -3, 4); b = int(rng, -3, 4); } while (a === b || a + b === 0 || a * b === 0);
      const sm = a + b, pr = a * b, c1 = (t) => (t === 1 ? '' : t === -1 ? '-' : t);
      const eq = (s, p_) => R`y''${s < 0 ? '+' + (-s === 1 ? '' : -s) : '-' + (s === 1 ? '' : s)}y'${p_ < 0 ? '-' + (-p_ === 1 ? '' : -p_) : '+' + (p_ === 1 ? '' : p_)}y=0`;
      q = R`The differential equation of $y=Ae^{${a}x}+Be^{${b}x}$ is`; good = `$${eq(sm, pr)}$`;
      wrongs = [`$${eq(-sm, pr)}$`, `$${eq(sm, -pr)}$`, `$${eq(-sm, -pr)}$`];
      sol = R`<p>The exponents ${a} and ${b} are the roots of $m^2-(${a}+${b})m+(${a})(${b})=0$, i.e. $m^2${sm < 0 ? '+' : '-'}${Math.abs(sm) === 1 ? '' : Math.abs(sm)}m${pr < 0 ? '-' : '+'}${Math.abs(pr) === 1 ? '' : Math.abs(pr)}=0$. So the equation is $${eq(sm, pr)}$.</p>`;
    }
    const { options, answer } = shuffleOpts(rng, v === 3 ? good : `$${good.slice(1, -1)}$`, wrongs);
    return { v, options, answer, q, sol, good };
  }, (p) => p.options.indexOf(p.good)),

  // separable initial value problems
  gen('de-g04', 3, 'nat', 'numeric', 'variable separable', (rng) => {
    const v = int(rng, 0, 3);
    let q, answer, sol, f, x0 = 0, y0, a;
    if (v === 0) {
      const k = choose(rng, [1, 2, 3]); y0 = choose(rng, [1, 2, 3]); a = choose(rng, [0.5, 1]);
      f = (x, y) => k * x * y; answer = y0 * exp((k * a * a) / 2);
      q = R`Solve $\dfrac{dy}{dx}=${k === 1 ? '' : k}xy$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>$\dfrac{dy}y=${k}x\,dx$, $\ln y=\dfrac{${k}x^2}2+c$. $y(0)=${y0}$ gives $y=${y0}e^{${k}x^2/2}$. At $x=${a}$: $${y0}e^{${r4((k * a * a) / 2)}}=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      const k = choose(rng, [1, 2]); y0 = choose(rng, [0.2, 0.25, 0.5]); a = choose(rng, [0.5, 1, 1.5]);
      if (k * y0 * a > 0.8) { y0 = 0.2; a = 0.5; }
      f = (x, y) => k * y * y; answer = y0 / (1 - k * y0 * a);
      q = R`Solve $\dfrac{dy}{dx}=${k === 1 ? '' : k}y^2$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>$\dfrac{dy}{y^2}=${k}dx$, $-\dfrac1y=${k}x+c$. $y(0)=${y0}$ gives $c=-\dfrac1{${y0}}$. So $\dfrac1y=\dfrac1{${y0}}-${k}x$. At $x=${a}$: $\dfrac1y=${r4(1 / y0 - k * a)}$, $y=${r4(answer)}$.</p>`;
    } else if (v === 2) {
      const k = choose(rng, [1, 2, 3]); y0 = choose(rng, [1, 2, 3]); a = choose(rng, [1, 2, 3]);
      f = (x, y) => (k * x) / y; answer = sqrt(y0 * y0 + k * a * a);
      q = R`Solve $\dfrac{dy}{dx}=\dfrac{${k === 1 ? '' : k}x}y$ with $y(0)=${y0}$ ($y>0$) and find $y(${a})$.`;
      sol = R`<p>$y\,dy=${k}x\,dx$, $\dfrac{y^2}2=\dfrac{${k}x^2}2+c$, so $y^2=${k}x^2+${y0 * y0}$. At $x=${a}$: $y^2=${y0 * y0 + k * a * a}$, $y=${r4(answer)}$.</p>`;
    } else {
      const k = choose(rng, [1, 2]); y0 = 0; a = choose(rng, [0.2, 0.3, 0.4, 0.5]);
      f = (x, y) => k * (1 + y * y); answer = tan(k * a);
      q = R`Solve $\dfrac{dy}{dx}=${k === 1 ? '' : k}(1+y^2)$ with $y(0)=0$ and find $y(${a})$.`;
      sol = R`<p>$\dfrac{dy}{1+y^2}=${k}dx$, $\tan^{-1}y=${k}x+c$. $y(0)=0$ gives $c=0$, $y=\tan(${k}x)$. At $x=${a}$: $\tan(${r4(k * a)})=${r4(answer)}$ (radians).</p>`;
    }
    return { v, f, y0, a, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, 0, p.y0, p.a)),

  // homogeneous initial value problems
  gen('de-g05', 3, 'nat', 'numeric', 'homogeneous equations', (rng) => {
    const v = int(rng, 0, 3);
    let q, answer, sol, f, y0, a;
    if (v === 0) {
      y0 = int(rng, 1, 4); a = choose(rng, [2, 3, 4]);
      f = (x, y) => (x + y) / x; answer = a * ln(a) + y0 * a;
      q = R`Solve $\dfrac{dy}{dx}=\dfrac{x+y}x$ with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>$y=vx$: $xv'=1$, $v=\ln x+c$. $y=x\ln x+cx$. $y(1)=${y0}$ gives $c=${y0}$. At $x=${a}$: $${a}\ln${a}+${y0 * a}=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      y0 = choose(rng, [1, 2]); a = choose(rng, [1.2, 1.3, 1.4]);
      f = (x, y) => y / x + (y / x) ** 2; answer = a / (1 / y0 - ln(a));
      q = R`Solve $\dfrac{dy}{dx}=\dfrac yx+\dfrac{y^2}{x^2}$ with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>$y=vx$: $xv'=v^2$, so $-\dfrac1v=\ln x+c$. $v(1)=${y0}$ gives $c=-\dfrac1{${y0}}$. So $\dfrac1v=\dfrac1{${y0}}-\ln x$. At $x=${a}$: $\dfrac1v=${r4(1 / y0 - ln(a))}$, $y=${a}v=${r4(answer)}$.</p>`;
    } else if (v === 2) {
      y0 = int(rng, 1, 3); a = choose(rng, [2, 3, 4]);
      f = (x, y) => (x * x + y * y) / (x * y); answer = a * sqrt(2 * ln(a) + y0 * y0);
      q = R`Solve $\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$ with $y(1)=${y0}$ ($y>0$) and find $y(${a})$.`;
      sol = R`<p>$y=vx$: $v\,dv=\dfrac{dx}x$, $v^2=2\ln x+c$. $v(1)=${y0}$ gives $c=${y0 * y0}$. $y^2=x^2(2\ln x+${y0 * y0})$. At $x=${a}$: $y=${a}\sqrt{2\ln${a}+${y0 * y0}}=${r4(answer)}$.</p>`;
    } else {
      y0 = 0; a = choose(rng, [2, 3, 4]);
      f = (x, y) => (x - y) / (x + y); answer = -a + sqrt(2 * a * a - 1);
      q = R`Solve $\dfrac{dy}{dx}=\dfrac{x-y}{x+y}$ with $y(1)=0$ and find the positive value of $y$ at $x=${a}$.`;
      sol = R`<p>$d(x^2-2xy-y^2)=2[(x-y)dx-(x+y)dy]=0$, so $x^2-2xy-y^2=c$. $y(1)=0$ gives $c=1$. At $x=${a}$: $y^2+${2 * a}y-${a * a - 1}=0$, so $y=-${a}+\sqrt{${2 * a * a - 1}}=${r4(answer)}$.</p>`;
    }
    return { v, f, y0, a, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, 1, p.y0, p.a)),

  // linear first order initial value problems
  gen('de-g06', 3, 'nat', 'numeric', 'linear first order', (rng) => {
    const v = int(rng, 0, 3);
    let q, answer, sol, f, x0 = 0, y0, a;
    if (v === 0) {
      const pp = choose(rng, [1, 2, 3]), qq = choose(rng, [2, 4, 6]); y0 = int(rng, 0, 3); a = choose(rng, [0.5, 1, 2]);
      f = (x, y) => qq - pp * y; answer = qq / pp + (y0 - qq / pp) * exp(-pp * a);
      q = R`Solve $\dfrac{dy}{dx}+${pp === 1 ? '' : pp}y=${qq}$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>IF $=e^{${pp}x}$. $y=\dfrac{${qq}}{${pp}}+Ce^{-${pp}x}$ and $y(0)=${y0}$ gives $C=${r4(y0 - qq / pp)}$. At $x=${a}$: $y=${r4(qq / pp)}+${r4(y0 - qq / pp)}e^{-${pp * a}}=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      const k = choose(rng, [1, 2, 3]), m = choose(rng, [1, 2]); x0 = 1; y0 = int(rng, 1, 4); a = choose(rng, [2, 3]);
      f = (x, y) => x ** m - (k * y) / x; const C = y0 - 1 / (m + 1 + k); answer = a ** (m + 1) / (m + 1 + k) + C * a ** -k;
      q = R`Solve $\dfrac{dy}{dx}+\dfrac{${k}}xy=x^{${m}}$ ($x>0$) with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>IF $=x^{${k}}$. $\dfrac d{dx}(x^{${k}}y)=x^{${k + m}}$, so $x^{${k}}y=\dfrac{x^{${k + m + 1}}}{${k + m + 1}}+C$. $y(1)=${y0}$ gives $C=${r4(y0 - 1 / (k + m + 1))}$. At $x=${a}$: $y=\dfrac{${a}^{${m + 1}}}{${k + m + 1}}+${r4(C)}\cdot${a}^{-${k}}=${r4(answer)}$.</p>`;
    } else if (v === 2) {
      y0 = int(rng, 0, 3); a = choose(rng, [0.5, 1]);
      f = (x, y) => exp(x) + y; answer = exp(a) * (a + y0);
      q = R`Solve $\dfrac{dy}{dx}-y=e^{x}$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>IF $=e^{-x}$: $\dfrac d{dx}(ye^{-x})=1$, so $ye^{-x}=x+c$. $y(0)=${y0}$ gives $c=${y0}$. $y=e^x(x+${y0})$. At $x=${a}$: $e^{${a}}(${a}+${y0})=${r4(answer)}$.</p>`;
    } else {
      y0 = choose(rng, [1, 2, 3]); a = choose(rng, [0.5, 1, 1.5]);
      f = (x, y) => x - 2 * x * y; answer = 0.5 + (y0 - 0.5) * exp(-a * a);
      q = R`Solve $\dfrac{dy}{dx}+2xy=x$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>IF $=e^{x^2}$: $\dfrac d{dx}(ye^{x^2})=xe^{x^2}$, so $ye^{x^2}=\tfrac12e^{x^2}+c$ and $y=\tfrac12+ce^{-x^2}$. $y(0)=${y0}$ gives $c=${y0 - 0.5}$. At $x=${a}$: $y=0.5+${y0 - 0.5}e^{-${a * a}}=${r4(answer)}$.</p>`;
    }
    return { v, f, x0, y0, a, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, p.x0, p.y0, p.a)),

  // integrating factor identification
  gen('de-g07', 1, 'mcq', 'single', 'linear first order', (rng) => {
    const k = int(rng, 2, 5);
    const pool = [
      [R`\dfrac{dy}{dx}+\dfrac{${k}}xy=x^2`, R`$x^{${k}}$`, R`$e^{${k}x}$`, R`$${k}\ln x$`, R`$x^{-${k}}$`, R`<p>$P=\dfrac{${k}}x$, $\int P\,dx=${k}\ln x$, IF $=e^{${k}\ln x}=x^{${k}}$.</p>`],
      [R`\dfrac{dy}{dx}+${k}y=\sin x`, R`$e^{${k}x}$`, R`$${k}x$`, R`$e^{-${k}x}$`, R`$x^{${k}}$`, R`<p>$P=${k}$, IF $=e^{\int${k}dx}=e^{${k}x}$.</p>`],
      [R`\dfrac{dy}{dx}+y\cot x=x`, R`$\sin x$`, R`$\cos x$`, R`$\ln\sin x$`, R`$\csc x$`, R`<p>$\int\cot x\,dx=\ln\sin x$, so IF $=\sin x$.</p>`],
      [R`\dfrac{dy}{dx}+y\tan x=x^2`, R`$\sec x$`, R`$\cos x$`, R`$\ln\sec x$`, R`$\tan x$`, R`<p>$\int\tan x\,dx=\ln\sec x$, so IF $=\sec x$.</p>`],
      [R`\dfrac{dy}{dx}+\dfrac{2x}{1+x^2}y=1`, R`$1+x^2$`, R`$\ln(1+x^2)$`, R`$e^{x^2}$`, R`$\dfrac1{1+x^2}$`, R`<p>$\int\dfrac{2x}{1+x^2}dx=\ln(1+x^2)$, so IF $=1+x^2$.</p>`],
      [R`\dfrac{dy}{dx}-\dfrac{${k}}xy=x`, R`$x^{-${k}}$`, R`$x^{${k}}$`, R`$e^{-${k}x}$`, R`$-${k}\ln x$`, R`<p>$P=-\dfrac{${k}}x$, IF $=e^{-${k}\ln x}=x^{-${k}}$.</p>`],
      [R`x\dfrac{dy}{dx}+${k}y=x^3`, R`$x^{${k}}$`, R`$x^{${k}}\!/${k}$`, R`$e^{${k}x}$`, R`$${k}x$`, R`<p>Divide by $x$ first: $y'+\dfrac{${k}}xy=x^2$. IF $=x^{${k}}$.</p>`],
      [R`\dfrac{dy}{dx}+\dfrac{y}{x\ln x}=1`, R`$\ln x$`, R`$\ln\ln x$`, R`$x\ln x$`, R`$e^{x\ln x}$`, R`<p>$\int\dfrac{dx}{x\ln x}=\ln\ln x$ (put $u=\ln x$), so IF $=e^{\ln\ln x}=\ln x$.</p>`],
    ];
    const [eq, good, w1, w2, w3, sol] = choose(rng, pool);
    const { options, answer } = shuffleOpts(rng, good, [w1, w2, w3]);
    return { options, answer, good, q: R`The integrating factor of $${eq}$ ($x>0$ where needed) is`, sol };
  }, (p) => p.options.indexOf(p.good)),

  // Newton's law of cooling
  gen('de-g08', 3, 'nat', 'numeric', 'Newton cooling', (rng) => {
    const v = int(rng, 0, 3), D = choose(rng, [40, 50, 60, 80]), Ts = choose(rng, [20, 25, 30]), t1 = choose(rng, [5, 10, 15]), r = choose(rng, [0.5, 0.6, 0.75, 0.8]);
    const T0 = Ts + D, T1 = Ts + D * r, k = -ln(r) / t1;
    let q, answer, sol, unit, fq = 0;
    const base = R`A body at $${T0}^\circ$C is placed in a room at $${Ts}^\circ$C. By Newton's law of cooling it falls to $${r4(T1)}^\circ$C in ${t1} minutes.`;
    if (v === 0) { const t2 = 2 * t1; answer = Ts + D * r * r; q = R`${base} Find its temperature after ${t2} minutes (in $^\circ$C).`; unit = '°C';
      sol = R`<p>$T-${Ts}=${D}e^{-kt}$. At ${t1} min the factor is $${r}$. After ${t2} min it is $${r}^2=${r4(r * r)}$. So $T=${Ts}+${D}\times${r4(r * r)}=${r4(answer)}^\circ$C.</p>`; }
    else if (v === 1) { fq = choose(rng, [0.25, 0.1]); const f = fq; answer = -ln(f) / k; q = R`${base} After how many minutes does the temperature reach $${r4(Ts + D * f)}^\circ$C?`; unit = 'min';
      sol = R`<p>Need $e^{-kt}=${f}$. With $e^{-${t1}k}=${r}$, $k=\dfrac{-\ln${r}}{${t1}}=${r4(k)}$ per min. $t=\dfrac{-\ln${f}}k=${r4(answer)}$ min.</p>`; }
    else if (v === 2) { answer = k; q = R`${base} Find the cooling constant $k$ in $\dfrac{dT}{dt}=-k(T-${Ts})$, in per minute.`; unit = 'per min';
      sol = R`<p>$e^{-${t1}k}=${r}$, so $k=\dfrac{-\ln${r}}{${t1}}=${r4(k)}$ per minute.</p>`; }
    else { answer = k * D; q = R`${base} At what rate ($^\circ$C per minute, as a positive number) is it cooling at the start?`; unit = '°C/min';
      sol = R`<p>$k=\dfrac{-\ln${r}}{${t1}}=${r4(k)}$. Initial rate $=k(T_0-${Ts})=${r4(k)}\times${D}=${r4(answer)}$ $^\circ$C/min.</p>`; }
    return { v, D, Ts, t1, r, fq, answer: r4(answer), tol: v === 2 ? 0.001 : 0.01, unit, q: q + (v === 2 ? ' (4 decimal places)' : TWOD), sol };
  }, (p) => {
    const k = -ln(p.r) / p.t1, sim = (t) => rk4((tt, T) => -k * (T - p.Ts), 0, p.Ts + p.D, t, 4000);
    if (p.v === 0) return sim(2 * p.t1);
    if (p.v === 1) { let lo = 0, hi = 400; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (sim(m) > p.Ts + p.D * p.fq) lo = m; else hi = m; } return lo; }
    if (p.v === 2) return -ln((sim(p.t1) - p.Ts) / p.D) / p.t1;
    return (p.Ts + p.D - sim(1e-4)) / 1e-4;
  }),


  // growth: three situations
  gen('de-g09', 2, 'nat', 'numeric', 'growth and decay', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) {
      const d = choose(rng, [3, 4, 5, 8, 10]), m = choose(rng, [3, 5, 10]);
      const answer = (d * ln(m)) / ln(2);
      return { v, d, m, answer: r4(answer), tol: 0.01, unit: 'years',
        q: R`A population grows at a rate proportional to its size and doubles in ${d} years. In how many years will it become ${m} times its present size?${TWOD}`,
        sol: R`<p>$N=N_0e^{kt}$, $k=\dfrac{\ln2}{${d}}$. Need $e^{kt}=${m}$: $t=\dfrac{\ln${m}}k=\dfrac{${d}\ln${m}}{\ln2}=${r4(answer)}$ years.</p>` };
    }
    if (v === 1) {
      const N0 = choose(rng, [500, 1000, 2000]), ratio = choose(rng, [1.5, 2, 3]), t1 = choose(rng, [2, 3, 4]), t2 = t1 * choose(rng, [2, 3]);
      const answer = N0 * ratio ** (t2 / t1);
      return { v, N0, ratio, t1, t2, answer: r4(answer), tol: 0.5, unit: '',
        q: R`A culture grows at a rate proportional to the number present. It rises from ${N0} to ${N0 * ratio} in ${t1} hours. How many are present after ${t2} hours? (nearest whole number)`,
        sol: R`<p>In every ${t1} hours the number is multiplied by $${ratio}$. In ${t2} hours that happens ${t2 / t1} times: $${N0}\times${ratio}^{${t2 / t1}}=${r4(answer)}$.</p>` };
    }
    const r = choose(rng, [4, 5, 6, 8, 10]);
    const answer = ln(2) / (r / 100);
    return { v, r, answer: r4(answer), tol: 0.01, unit: 'years',
      q: R`A sum of money grows continuously at ${r}% per year, i.e. $\dfrac{dA}{dt}=${r / 100}A$. In how many years does it double?${TWOD}`,
      sol: R`<p>$A=A_0e^{${r / 100}t}$. Doubling: $${r / 100}t=\ln2$, $t=\dfrac{0.6931}{${r / 100}}=${r4(answer)}$ years.</p>` };
  }, (p) => {
    if (p.v === 0) return rk4Time((t, N) => (Math.log(2) / p.d) * N, 1, p.m);
    if (p.v === 1) return rk4((t, N) => (Math.log(p.ratio) / p.t1) * N, 0, p.N0, p.t2, 4000);
    return rk4Time((t, A) => (p.r / 100) * A, 1, 2);
  }),

  // radioactive decay
  gen('de-g10', 2, 'nat', 'numeric', 'growth and decay', (rng) => {
    const v = int(rng, 0, 3), h = choose(rng, [4, 5, 8, 12, 20]);
    let q, answer, sol, extra = {};
    if (v === 0) {
      const n = choose(rng, [2, 3, 4, 5]), t = h * n; answer = 100 / 2 ** n;
      q = R`A radioactive sample has half-life ${h} days. What percentage of it is left after ${t} days?`;
      sol = R`<p>${t} days is ${n} half-lives. $100\times\left(\tfrac12\right)^{${n}}=${r4(answer)}\%$.</p>`; extra = { n };
    } else if (v === 1) {
      const pc = choose(rng, [10, 20, 25]); answer = (h * ln(100 / pc)) / ln(2);
      q = R`A radioactive sample has half-life ${h} days. After how many days is only ${pc}% of it left?`;
      sol = R`<p>$N=N_0e^{-\lambda t}$ with $\lambda=\dfrac{\ln2}{${h}}$. Need $e^{-\lambda t}=${pc / 100}$: $t=\dfrac{${h}\ln${100 / pc}}{\ln2}=${r4(answer)}$ days.</p>`; extra = { pc };
    } else if (v === 2) {
      const m0 = choose(rng, [40, 80, 120]), t = choose(rng, [h / 2, h * 1.5, h * 2.5]); answer = m0 * 0.5 ** (t / h);
      q = R`A sample of ${m0} g has half-life ${h} days. How many grams remain after ${t} days?`;
      sol = R`<p>Fraction left $=\left(\tfrac12\right)^{t/h}=\left(\tfrac12\right)^{${t / h}}=${r4(0.5 ** (t / h))}$. Mass $=${m0}\times${r4(0.5 ** (t / h))}=${r4(answer)}$ g.</p>`; extra = { m0, t };
    } else {
      const p1 = choose(rng, [10, 20, 30]), t1 = choose(rng, [5, 10]), mult = choose(rng, [2, 3]); answer = 100 * (1 - p1 / 100) ** mult;
      q = R`A radioactive substance loses ${p1}% of its mass in ${t1} years. What percentage of the original mass remains after ${t1 * mult} years?`;
      sol = R`<p>Every ${t1} years the mass is multiplied by $${r4(1 - p1 / 100)}$. After ${t1 * mult} years: $100\times${r4(1 - p1 / 100)}^{${mult}}=${r4(answer)}\%$.</p>`; extra = { p1, t1, mult };
    }
    return { v, h, ...extra, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => {
    const lam = Math.log(2) / p.h, f = (tt, N) => -lam * N;
    if (p.v === 0) return rk4(f, 0, 100, p.h * p.n, 4000);
    if (p.v === 1) return rk4Time((t, N) => -lam * N, 100, p.pc);
    if (p.v === 2) return (p.m0 * rk4(f, 0, 100, p.t, 4000)) / 100;
    const lam2 = -Math.log(1 - p.p1 / 100) / p.t1; return rk4((tt, N) => -lam2 * N, 0, 100, p.t1 * p.mult, 4000);
  }),

  // mixing, constant volume
  gen('de-g11', 3, 'nat', 'numeric', 'mixing problems', (rng) => {
    const v = int(rng, 0, 2), V = choose(rng, [100, 200, 500]), r = choose(rng, [5, 10, 20]), c = choose(rng, [0.1, 0.2, 0.5]);
    const x0 = v === 2 ? choose(rng, [10, 20, 30]) : 0, eq = r4(c * V), t = choose(rng, [V / r, (2 * V) / r, V / (2 * r)]);
    const base = R`A tank holds ${V} litres of ${v === 2 ? `brine with ${x0} kg of salt in it` : 'pure water'}. Brine with ${c} kg of salt per litre flows in at ${r} litres per minute and the well-stirred mixture flows out at ${r} litres per minute.`;
    let q, answer, sol;
    if (v === 1) {
      answer = (V / r) * ln(2);
      q = R`${base} After how many minutes is the salt content half of the final (long-run) amount?`;
      sol = R`<p>$\dfrac{dx}{dt}=${r4(r * c)}-\dfrac{${r}}{${V}}x$, so $x=${eq}(1-e^{-${r}t/${V}})$. The long-run value is $${eq}$ kg. Half of it: $e^{-${r}t/${V}}=\tfrac12$, $t=\dfrac{${V}\ln2}{${r}}=${r4(answer)}$ min.</p>`;
    } else {
      answer = eq + (x0 - eq) * exp(-(r * t) / V);
      q = R`${base} How many kg of salt are in the tank after ${t} minutes?`;
      sol = R`<p>$\dfrac{dx}{dt}=${r4(r * c)}-\dfrac{${r}}{${V}}x$. Solution: $x=${eq}+(${x0}-${eq})e^{-${r}t/${V}}$. At $t=${t}$: $e^{-${r4((r * t) / V)}}=${r4(exp(-(r * t) / V))}$, so $x=${r4(answer)}$ kg.</p>`;
    }
    return { v, V, r, c, x0, t, answer: r4(answer), tol: 0.01, unit: v === 1 ? 'min' : 'kg', q: q + TWOD, sol };
  }, (p) => {
    const f = (tt, x) => p.r * p.c - (p.r / p.V) * x;
    if (p.v !== 1) return rk4(f, 0, p.x0, p.t, 4000);
    const half = (p.c * p.V) / 2; let lo = 0, hi = (50 * p.V) / p.r;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (rk4(f, 0, 0, m, 4000) < half) lo = m; else hi = m; }
    return lo;
  }),

  // orthogonal trajectories
  gen('de-g12', 3, 'mcq', 'single', 'orthogonal trajectories', (rng) => {
    const v = int(rng, 0, 3);
    let fam, good, wrongs, sol;
    if (v === 0) {
      const n = int(rng, 2, 5); fam = R`y=cx^{${n}}`; good = R`$x^2+${n}y^2=k$`; wrongs = [R`$${n}x^2+y^2=k$`, R`$x^2-${n}y^2=k$`, R`$x^{${n}}y=k$`];
      sol = R`<p>$y'=\dfrac{${n}y}x$. The trajectory has slope $-\dfrac{x}{${n}y}$: $${n}y\,dy=-x\,dx$, so $${n}y^2+x^2=2c'$, i.e. $x^2+${n}y^2=k$.</p>`;
    } else if (v === 1) {
      const k0 = int(rng, 2, 5); fam = R`y=ce^{${k0}x}`; good = R`$${k0}y^2+2x=k$`; wrongs = [R`$y^2+${2 * k0}x=k$`, R`$${k0}y^2-2x=k$`, R`$y=ke^{-${k0}x}$`];
      sol = R`<p>$y'=${k0}y$. The trajectory has slope $-\dfrac1{${k0}y}$: $${k0}y\,dy=-dx$, so $\dfrac{${k0}y^2}2=-x+c$, i.e. $${k0}y^2+2x=k$.</p>`;
    } else if (v === 2) {
      fam = R`xy=c`; good = R`$y^2-x^2=k$`; wrongs = [R`$x^2+y^2=k$`, R`$xy=k$`, R`$y=kx$`];
      sol = R`<p>$y'=-\dfrac yx$. The trajectory has slope $\dfrac xy$: $y\,dy=x\,dx$, so $y^2-x^2=k$.</p>`;
    } else {
      const m = int(rng, 2, 4); fam = R`y^{${m}}=cx`; good = R`$${m}x^2+y^2=k$`; wrongs = [R`$x^2+${m}y^2=k$`, R`$x^2-${m}y^2=k$`, R`$y^{${m}}=kx^{-1}$`];
      sol = R`<p>$${m}y^{${m - 1}}y'=c=\dfrac{y^{${m}}}x$, so $y'=\dfrac y{${m}x}$. The trajectory has slope $-\dfrac{${m}x}y$: $y\,dy=-${m}x\,dx$, so $y^2=-${m}x^2+c$, i.e. $${m}x^2+y^2=k$.</p>`;
    }
    const { options, answer } = shuffleOpts(rng, good, wrongs);
    return { v, options, answer, good, q: R`The orthogonal trajectories of the family $${fam}$ ($c$ the parameter) are`, sol };
  }, (p) => p.options.indexOf(p.good)),

  // Bernoulli initial value problems
  gen('de-g13', 4, 'nat', 'numeric', 'Bernoulli equation', (rng) => {
    const v = int(rng, 0, 2);
    let q, answer, sol, f, x0, y0, a;
    if (v === 0) {
      const k = choose(rng, [1, 2]); y0 = choose(rng, [0.5, 0.4]); a = choose(rng, [1.2, 1.5]); x0 = 1;
      const c = 1 / y0 + k; answer = 1 / (a * (c - k * a)); f = (x, y) => k * x * y * y - y / x;
      q = R`Solve $\dfrac{dy}{dx}+\dfrac yx=${k === 1 ? '' : k}xy^2$ ($x>0$) with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>Put $v=\dfrac1y$: $v'-\dfrac vx=-${k === 1 ? '' : k}x$. IF $=\dfrac1x$: $\dfrac d{dx}\left(\dfrac vx\right)=-${k}$, so $v=x(c-${k === 1 ? '' : k}x)$. $v(1)=${r4(1 / y0)}$ gives $c=${r4(c)}$. At $x=${a}$: $v=${a}(${r4(c)}-${r4(k * a)})=${r4(a * (c - k * a))}$, $y=\dfrac1v=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      const k = choose(rng, [1, 2]); y0 = choose(rng, [0.25, 0.4]); a = choose(rng, [0.5, 1]); x0 = 0;
      answer = 1 / (k + (1 / y0 - k) * exp(a)); f = (x, y) => k * y * y - y;
      q = R`Solve $\dfrac{dy}{dx}+y=${k === 1 ? '' : k}y^2$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>Put $v=\dfrac1y$: $-v'+v=${k}$, i.e. $v'-v=-${k}$. IF $=e^{-x}$: $ve^{-x}=${k}e^{-x}+c$, so $v=${k}+ce^{x}$. $v(0)=${r4(1 / y0)}$ gives $c=${r4(1 / y0 - k)}$. At $x=${a}$: $v=${k}+${r4(1 / y0 - k)}e^{${a}}=${r4(1 / answer)}$, $y=${r4(answer)}$.</p>`;
    } else {
      y0 = choose(rng, [0.5, 0.4]); a = choose(rng, [1.5, 2]); x0 = 1;
      const c = 1 / y0 + 1; answer = 1 / (a * a * (c - a)); f = (x, y) => x * x * y * y - (2 * y) / x;
      q = R`Solve $\dfrac{dy}{dx}+\dfrac{2y}x=x^2y^2$ ($x>0$) with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>Put $v=\dfrac1y$: $v'-\dfrac{2v}x=-x^2$. IF $=x^{-2}$: $\dfrac d{dx}\left(\dfrac v{x^2}\right)=-1$, so $v=x^2(c-x)$. $v(1)=${r4(1 / y0)}$ gives $c=${r4(c)}$. At $x=${a}$: $v=${a * a}(${r4(c - a)})=${r4(a * a * (c - a))}$, $y=${r4(answer)}$.</p>`;
    }
    return { v, f, x0, y0, a, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, p.x0, p.y0, p.a)),

  // substitutions that make the equation separable
  gen('de-g14', 4, 'nat', 'numeric', 'substitution', (rng) => {
    const v = int(rng, 0, 2);
    let q, answer, sol, f, y0, a;
    if (v === 0) {
      const pp = choose(rng, [1, 4]), c = choose(rng, [0, 1, -1]), sp = sqrt(pp); y0 = -c; a = pp === 1 ? choose(rng, [0.5, 0.8, 1]) : choose(rng, [0.25, 0.3, 0.5]);
      answer = sp * tan(sp * a) - pp * a - c; f = (x, y) => (pp * x + y + c) ** 2;
      const inner = `${pp === 1 ? '' : pp}x+y${c === 0 ? '' : c > 0 ? '+' + c : c}`;
      q = R`Solve $\dfrac{dy}{dx}=(${inner})^2$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>Put $v=${inner}$: $v'=${pp}+v^2$. $v(0)=0$. So $\dfrac1{${sp}}\tan^{-1}\dfrac v{${sp}}=x$, giving $v=${sp}\tan(${sp}x)$. Then $y=${sp}\tan(${sp}x)-${pp}x${c === 0 ? '' : c > 0 ? '-' + c : '+' + (-c)}$. At $x=${a}$: $y=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      y0 = choose(rng, [-1, -2]); a = choose(rng, [0.5, 1]);
      answer = -ln(exp(-y0) + 1 - exp(a)); f = (x, y) => exp(x + y);
      q = R`Solve $\dfrac{dy}{dx}=e^{x+y}$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>$e^{-y}dy=e^xdx$, so $e^{-y}=C-e^x$. $y(0)=${y0}$: $e^{${-y0}}=C-1$, $C=e^{${-y0}}+1=${r4(exp(-y0) + 1)}$. At $x=${a}$: $e^{-y}=${r4(exp(-y0) + 1)}-${r4(exp(a))}=${r4(exp(-y0) + 1 - exp(a))}$, $y=-\ln(${r4(exp(-y0) + 1 - exp(a))})=${r4(answer)}$.</p>`;
    } else {
      y0 = choose(rng, [0, 0.5, -0.5]); a = choose(rng, [0.5, 1, 1.5]);
      const t0 = Math.atanh(y0); answer = a - Math.tanh(a - t0); f = (x, y) => (x - y) ** 2;
      q = R`Solve $\dfrac{dy}{dx}=(x-y)^2$ with $y(0)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>Put $w=x-y$: $w'=1-w^2$, so $w=\tanh(x+c)$. $w(0)=${-y0}$ gives $c=\tanh^{-1}(${-y0})=${r4(-t0)}$. So $y=x-\tanh(x${t0 >= 0 ? '-' : '+'}${r4(abs(t0))})$. At $x=${a}$: $y=${r4(answer)}$.</p>`;
    }
    return { v, f, y0, a, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, 0, p.y0, p.a, 8000)),

  // curves described by slope, tangent or normal
  gen('de-g15', 3, 'nat', 'numeric', 'curves from slope', (rng) => {
    const v = int(rng, 0, 3);
    let q, answer, sol, f, x0 = 0, y0, a;
    if (v === 0) {
      const k = choose(rng, [2, 3, 0.5]); y0 = choose(rng, [1, 2, 3]); a = choose(rng, [2, 3, 4]); x0 = 1;
      answer = y0 * a ** k; f = (x, y) => (k * y) / x;
      q = R`A curve passes through $(1,${y0})$ and its slope at $(x,y)$ is ${k} times the slope of the line joining the point to the origin. Find $y$ at $x=${a}$.`;
      sol = R`<p>$\dfrac{dy}{dx}=\dfrac{${k}y}x$, so $\ln y=${k}\ln x+c$, $y=Cx^{${k}}$. $C=${y0}$. At $x=${a}$: $y=${y0}\times${a}^{${k}}=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      y0 = int(rng, 1, 3); a = choose(rng, [0.5, 1]);
      answer = (y0 + 1) * exp(a) - a - 1; f = (x, y) => x + y;
      q = R`A curve passes through $(0,${y0})$ and its slope at $(x,y)$ is $x+y$. Find $y$ at $x=${a}$.`;
      sol = R`<p>$y'-y=x$. IF $=e^{-x}$: $ye^{-x}=-(x+1)e^{-x}+c$, so $y=ce^x-x-1$. $y(0)=${y0}$ gives $c=${y0 + 1}$. At $x=${a}$: $${y0 + 1}e^{${a}}-${a}-1=${r4(answer)}$.</p>`;
    } else if (v === 2) {
      const s = choose(rng, [2, 4]); y0 = choose(rng, [1, 2]); a = choose(rng, [2, 4]);
      answer = y0 * exp(a / s); f = (x, y) => y / s;
      q = R`A curve passes through $(0,${y0})$ and has a constant subtangent of length ${s}, i.e. $\dfrac y{y'}=${s}$ at every point. Find $y$ at $x=${a}$.`;
      sol = R`<p>$\dfrac{dy}y=\dfrac{dx}{${s}}$, $y=Ce^{x/${s}}$, $C=${y0}$. At $x=${a}$: $y=${y0}e^{${r4(a / s)}}=${r4(answer)}$.</p>`;
    } else {
      const [yy, aa] = choose(rng, [[5, 3], [13, 5], [10, 6], [13, 12], [25, 7]]); y0 = yy; a = aa;
      answer = sqrt(y0 * y0 - a * a); f = (x, y) => -x / y;
      q = R`The normal at every point of a curve passes through the origin, and the curve passes through $(0,${y0})$. Find $y>0$ at $x=${a}$.`;
      sol = R`<p>The normal through the origin gives $yy'=-x$, so $x^2+y^2=c$. $(0,${y0})$ gives $c=${y0 * y0}$. At $x=${a}$: $y^2=${y0 * y0 - a * a}$, $y=${r4(answer)}$.</p>`;
    }
    return { v, f, x0, y0, a, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, p.x0, p.y0, p.a, 8000)),

  // integral equations
  gen('de-g16', 4, 'nat', 'numeric', 'integral equations', (rng) => {
    const v = int(rng, 0, 3);
    let q, answer, sol, f, y0, a;
    if (v === 0) {
      const c = choose(rng, [1, 2, 3]), m = choose(rng, [1, 2, 3]); y0 = c; a = choose(rng, [0.5, 1]);
      answer = c * exp(m * a); f = (x, y) => m * y;
      q = R`A function satisfies $f(x)=${c}+${m === 1 ? '' : m}\displaystyle\int_0^xf(t)\,dt$. Find $f(${a})$.`;
      sol = R`<p>Differentiate: $f'=${m}f$, with $f(0)=${c}$. So $f=${c}e^{${m}x}$. $f(${a})=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      const c = choose(rng, [1, 2, 3]); y0 = c; a = choose(rng, [1, 2]);
      answer = c * exp((a * a) / 2); f = (x, y) => x * y;
      q = R`A function satisfies $f(x)=${c}+\displaystyle\int_0^xtf(t)\,dt$. Find $f(${a})$.`;
      sol = R`<p>Differentiate: $f'=xf$, with $f(0)=${c}$. So $f=${c}e^{x^2/2}$. $f(${a})=${c}e^{${r4((a * a) / 2)}}=${r4(answer)}$.</p>`;
    } else if (v === 2) {
      const c = choose(rng, [1, 2, 3]); y0 = c; a = choose(rng, [2, 3, 4]);
      answer = c * (1 + a); f = (x, y) => y / (1 + x);
      q = R`A function satisfies $f(x)=${c}+\displaystyle\int_0^x\frac{f(t)}{1+t}\,dt$. Find $f(${a})$.`;
      sol = R`<p>Differentiate: $f'=\dfrac f{1+x}$, so $\ln f=\ln(1+x)+k$, $f=C(1+x)$. $f(0)=${c}$ gives $C=${c}$. $f(${a})=${c}\times${1 + a}=${answer}$.</p>`;
    } else {
      const c = choose(rng, [0.25, 0.5]); y0 = c; a = choose(rng, [1, 1.5]);
      answer = c / (1 - c * a); f = (x, y) => y * y;
      q = R`A function satisfies $f(x)=${c}+\displaystyle\int_0^x\big(f(t)\big)^2dt$. Find $f(${a})$.`;
      sol = R`<p>Differentiate: $f'=f^2$, $f(0)=${c}$. $-\dfrac1f=x+k$, $\dfrac1f=\dfrac1{${c}}-x$. At $x=${a}$: $\dfrac1f=${r4(1 / c - a)}$, $f=${r4(answer)}$.</p>`;
    }
    return { v, f, y0, a, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, 0, p.y0, p.a, 8000)),

  // motion with drag
  gen('de-g17', 3, 'nat', 'numeric', 'compound problems', (rng) => {
    const v = int(rng, 0, 2);
    let q, answer, sol, f, t, unit;
    if (v === 0) {
      const k = choose(rng, [0.2, 0.5, 1]); t = choose(rng, [1, 2, 5]);
      answer = (9.8 / k) * (1 - exp(-k * t)); f = (tt, vv) => 9.8 - k * vv; unit = 'm/s';
      q = R`A stone falls from rest through air with drag proportional to speed: $\dfrac{dv}{dt}=9.8-${k}v$. Find its speed after ${t} s (in m/s).`;
      sol = R`<p>$v=\dfrac{9.8}{${k}}\left(1-e^{-${k}t}\right)$ (terminal speed $${r4(9.8 / k)}$ m/s). At $t=${t}$: $${r4(9.8 / k)}(1-e^{-${r4(k * t)}})=${r4(answer)}$ m/s.</p>`;
      return { v, k, t, f, answer: r4(answer), tol: 0.01, unit, q: q + TWOD, sol };
    }
    if (v === 1) {
      const vT = choose(rng, [10, 20, 25]); t = choose(rng, [1, 2, 3]); const k = 10 / (vT * vT);
      answer = vT * Math.tanh((10 * t) / vT); f = (tt, vv) => 10 - k * vv * vv; unit = 'm/s';
      q = R`A body falls from rest with quadratic drag: $\dfrac{dv}{dt}=10-${r4(k)}v^2$ (SI units). Find its speed after ${t} s (in m/s).`;
      sol = R`<p>Terminal speed $v_T=\sqrt{10/${r4(k)}}=${vT}$ m/s. Solving by separation of variables: $v=v_T\tanh\left(\dfrac{10t}{v_T}\right)$. At $t=${t}$: $${vT}\tanh(${r4((10 * t) / vT)})=${r4(answer)}$ m/s.</p>`;
      return { v, k, t, f, answer: r4(answer), tol: 0.01, unit, q: q + TWOD, sol };
    }
    const k = choose(rng, [0.2, 0.25, 0.5]);
    answer = ln(2) / k; f = (tt, vv) => 9.8 - k * vv; unit = 's';
    q = R`A stone falls from rest with $\dfrac{dv}{dt}=9.8-${k}v$. After how many seconds does it reach half its terminal speed?`;
    sol = R`<p>$v=v_T(1-e^{-${k}t})$. Half of $v_T$: $e^{-${k}t}=\tfrac12$, $t=\dfrac{\ln2}{${k}}=${r4(answer)}$ s.</p>`;
    return { v, k, f, answer: r4(answer), tol: 0.01, unit, q: q + TWOD, sol };
  }, (p) => {
    if (p.v === 2) return rk4Half((tt, vv) => p.f(tt, vv), 9.8 / p.k);
    return rk4(p.f, 0, 0, p.t, 4000);
  }),

  // which function solves the equation
  gen('de-g18', 2, 'mcq', 'single', 'verifying solutions', (rng) => {
    const v = int(rng, 0, 2);
    let q, good, wrongs, sol;
    if (v === 0 || v === 1) {
      let p, qq; do { p = int(rng, -3, 4); qq = int(rng, -3, 4); } while (p === qq || p === 0 || qq === 0 || p + qq === 0);
      const sm = p + qq, pr = p * qq;
      const eq = `y''${sm > 0 ? '-' : '+'}${Math.abs(sm) === 1 ? '' : Math.abs(sm)}y'${pr > 0 ? '+' : '-'}${Math.abs(pr) === 1 ? '' : Math.abs(pr)}y=0`;
      const goodR = v === 0 ? p : qq; const bad = [...new Set([-p, -qq, sm, pr, p - qq, 2 * p, 2 * qq].filter((r) => r !== p && r !== qq))];
      good = `$y=e^{${goodR}x}$`; wrongs = bad.slice(0, 3).map((r) => `$y=e^{${r}x}$`);
      q = R`Which of the following is a solution of $${eq}$?`;
      sol = R`<p>Try $y=e^{mx}$: $m^2${sm > 0 ? '-' : '+'}${Math.abs(sm)}m${pr > 0 ? '+' : '-'}${Math.abs(pr)}=0$, i.e. $(m${p < 0 ? '+' : '-'}${abs(p)})(m${qq < 0 ? '+' : '-'}${abs(qq)})=0$, so $m=${p}$ or $m=${qq}$. So $e^{${p}x}$ and $e^{${qq}x}$ are solutions; the others use a different exponent.</p>`;
      if (wrongs.length < 3) throw new Error('de-g18 options');
      return (() => { const { options, answer } = shuffleOpts(rng, good, wrongs); return { v, p, qq, options, answer, good, q, sol }; })();
    }
    const p = choose(rng, [1, 2, 3, -1, -2]);
    q = R`The auxiliary equation of a second order equation has the repeated root $m=${p}$. Which function is a solution that is not just a constant multiple of $e^{${p}x}$?`;
    good = `$y=xe^{${p}x}$`; wrongs = [`$y=x^2e^{${p}x}$`, `$y=e^{${2 * p}x}$`, `$y=xe^{${-p}x}$`];
    sol = R`<p>For a repeated root $m=${p}$ the equation is $y''${p > 0 ? '-' : '+'}${2 * abs(p)}y'+${p * p}y=0$ and the two solutions are $e^{${p}x}$ and $xe^{${p}x}$. The other options have no matching root.</p>`;
    const { options, answer } = shuffleOpts(rng, good, wrongs);
    return { v, p, options, answer, good, q, sol };
  }, (p) => p.options.indexOf(p.good)),

  // logistic growth: three questions
  gen('de-g19', 4, 'nat', 'numeric', 'growth and decay', (rng) => {
    const v = int(rng, 0, 2), P0 = choose(rng, [50, 100, 200]), K = choose(rng, [1000, 2000]), r = choose(rng, [0.1, 0.2, 0.05]), t = choose(rng, [5, 10, 20]);
    const head = R`A population obeys $\dfrac{dP}{dt}=${r}P\left(1-\dfrac P{${K}}\right)$ with $P(0)=${P0}$.`;
    if (v === 0) {
      const answer = K / (1 + (K / P0 - 1) * exp(-r * t));
      return { v, P0, K, r, t, answer: r4(answer), tol: 1, unit: '',
        q: R`${head} Find $P(${t})$ to the nearest whole number.`,
        sol: R`<p>Logistic law: $P=\dfrac K{1+\left(\frac K{P_0}-1\right)e^{-rt}}=\dfrac{${K}}{1+${K / P0 - 1}e^{-${r4(r * t)}}}$. $e^{-${r4(r * t)}}=${r4(exp(-r * t))}$, so $P=\dfrac{${K}}{${r4(1 + (K / P0 - 1) * exp(-r * t))}}=${r4(answer)}$.</p>` };
    }
    if (v === 1) {
      const answer = ln(K / P0 - 1) / r;
      return { v, P0, K, r, t, answer: r4(answer), tol: 0.01, unit: 'time units',
        q: R`${head} At what time does $P$ reach half the carrying capacity, $\dfrac{${K}}2$?${TWOD}`,
        sol: R`<p>$P=\dfrac K{1+\left(\frac K{P_0}-1\right)e^{-rt}}=\dfrac K2$ needs $\left(\dfrac K{P_0}-1\right)e^{-rt}=1$. So $t=\dfrac{\ln(${K / P0 - 1})}{${r}}=${r4(answer)}$.</p>` };
    }
    const answer = (r * K) / 4;
    return { v, P0, K, r, t, answer: r4(answer), tol: 0.01, unit: '',
      q: R`${head} Find the largest possible value of $\dfrac{dP}{dt}$ over all times.${TWOD}`,
      sol: R`<p>$\dfrac{dP}{dt}=${r}P-\dfrac{${r}}{${K}}P^2$ is a downward parabola in $P$ with its peak at $P=\dfrac{${K}}2$. The peak value is $${r}\cdot\dfrac{${K}}2\cdot\dfrac12=${r4(answer)}$.</p>` };
  }, (p) => {
    const f = (tt, P) => p.r * P * (1 - P / p.K);
    if (p.v === 0) return rk4(f, 0, p.P0, p.t, 4000);
    if (p.v === 1) return rk4Time(f, p.P0, p.K / 2);
    return f(0, p.K / 2);
  }),

  // draining tank
  gen('de-g20', 4, 'nat', 'numeric', 'draining tank', (rng) => {
    const v = int(rng, 0, 2), T = choose(rng, [20, 30, 40, 60]);
    let q, answer, sol, ex = {};
    if (v === 0) {
      const t = T * choose(rng, [0.25, 0.5, 0.75]); answer = 100 * (1 - t / T) ** 2; ex = { t };
      q = R`Water drains from a full cylindrical tank by $\dfrac{dh}{dt}=-k\sqrt h$ and the tank is empty after ${T} minutes. What percentage of the original height remains after ${t} minutes?`;
      sol = R`<p>$2\sqrt h=2\sqrt{h_0}-kt$, and $h=0$ at $t=${T}$, so $\sqrt h=\sqrt{h_0}\left(1-\dfrac t{${T}}\right)$. Then $\dfrac h{h_0}=\left(1-\dfrac{${t}}{${T}}\right)^2=${r4((1 - t / T) ** 2)}$, i.e. $${r4(answer)}\%$.</p>`;
    } else if (v === 1) {
      const [fr, ft] = choose(rng, [[0.25, '\\tfrac14'], [1 / 9, '\\tfrac19'], [4 / 9, '\\tfrac49'], [1 / 16, '\\tfrac1{16}']]); answer = T * (1 - sqrt(fr)); ex = { fr };
      q = R`Water drains from a full cylindrical tank by $\dfrac{dh}{dt}=-k\sqrt h$ and the tank is empty after ${T} minutes. After how many minutes is the height $${ft}$ of the original?`;
      sol = R`<p>$\sqrt{h/h_0}=1-\dfrac t{${T}}$. Need $\sqrt{${ft}}=${r4(sqrt(fr))}$, so $t=${T}(1-${r4(sqrt(fr))})=${r4(answer)}$ min.</p>`;
    } else {
      answer = T / sqrt(2);
      q = R`Water drains from a full cylindrical tank by $\dfrac{dh}{dt}=-k\sqrt h$ and the tank is empty after ${T} minutes. Once the height has fallen to half, how many more minutes does the tank take to empty?`;
      sol = R`<p>$\sqrt{h/h_0}=1-\dfrac t{${T}}$. At half height $1-\dfrac t{${T}}=\dfrac1{\sqrt2}$, so the remaining time is $${T}\times\dfrac1{\sqrt2}=${r4(answer)}$ min.</p>`;
    }
    return { v, T, ...ex, answer: r4(answer), tol: 0.01, q: q + TWOD, sol };
  }, (p) => {
    const f = (tt, h) => (-2 / p.T) * sqrt(Math.max(h, 0));
    if (p.v === 0) return 100 * rk4(f, 0, 1, p.t, 6000);
    if (p.v === 1) return rk4Time(f, 1, p.fr);
    return p.T - rk4Time(f, 1, 0.5);
  }),

  // exact-looking equations
  gen('de-g21', 4, 'nat', 'numeric', 'exact-looking', (rng) => {
    const v = int(rng, 0, 3);
    let q, answer, sol, f, x0, y0, a;
    if (v === 0) {
      const k = choose(rng, [1, 2, 3]); y0 = choose(rng, [1, 2, 4]); a = choose(rng, [2, 3]); x0 = 1;
      answer = k * a * a + (y0 - k) * a; f = (x, y) => y / x + k * x;
      q = R`Solve $x\,dy-y\,dx=${k === 1 ? '' : k}x^2dx$ with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>Divide by $x^2$: $d\left(\dfrac yx\right)=${k}dx$, so $\dfrac yx=${k}x+c$. $y(1)=${y0}$ gives $c=${y0 - k}$. $y=${k}x^2+${y0 - k}x$. At $x=${a}$: $${k * a * a}+${(y0 - k) * a}=${r4(answer)}$.</p>`;
    } else if (v === 1) {
      y0 = choose(rng, [0.5, 0.4]); a = choose(rng, [1.2, 1.5]); x0 = 1;
      answer = 1 / (a * (1 / y0 + 1 - a)); f = (x, y) => (x * x * y * y - y) / x;
      q = R`Solve $y\,dx+x\,dy=x^2y^2dx$ with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>$d(xy)=(xy)^2dx$. With $u=xy$: $-\dfrac1u=x+c$. $u(1)=${y0}$ gives $c=-${r4(1 / y0)}-1$. So $\dfrac1{xy}=${r4(1 / y0 + 1)}-x$. At $x=${a}$: $\dfrac1{xy}=${r4(1 / y0 + 1 - a)}$, $y=\dfrac1{${a}\times${r4(1 / y0 + 1 - a)}}=${r4(answer)}$.</p>`;
    } else if (v === 2) {
      const k = choose(rng, [0.5, 1]); y0 = choose(rng, [1, 2, 3]); a = choose(rng, [0.5, 1]); x0 = 0;
      answer = sqrt(y0 * y0 * exp(2 * k * a) - a * a); f = (x, y) => (k * (x * x + y * y) - x) / y;
      q = R`Solve $x\,dx+y\,dy=${k}(x^2+y^2)\,dx$ with $y(0)=${y0}$ ($y>0$) and find $y(${a})$.`;
      sol = R`<p>$\tfrac12d(x^2+y^2)=${k}(x^2+y^2)dx$, so $\ln(x^2+y^2)=${2 * k}x+c$, $x^2+y^2=Ce^{${2 * k}x}$. $C=${y0 * y0}$. At $x=${a}$: $y^2=${y0 * y0}e^{${2 * k * a}}-${a * a}=${r4(y0 * y0 * exp(2 * k * a) - a * a)}$, $y=${r4(answer)}$.</p>`;
    } else {
      y0 = choose(rng, [0.5, 1]); a = choose(rng, [1.2, 1.4, 1.5]); x0 = 1;
      answer = a * tan(a + atan(y0) - 1); f = (x, y) => y / x + (x * x + y * y) / x;
      q = R`Solve $x\,dy-y\,dx=(x^2+y^2)\,dx$ with $y(1)=${y0}$ and find $y(${a})$.`;
      sol = R`<p>$\dfrac{x\,dy-y\,dx}{x^2+y^2}=d\left(\tan^{-1}\dfrac yx\right)=dx$, so $\tan^{-1}\dfrac yx=x+c$. $y(1)=${y0}$: $c=\tan^{-1}${y0}-1=${r4(atan(y0) - 1)}$. At $x=${a}$: $y=${a}\tan(${r4(a + atan(y0) - 1)})=${r4(answer)}$.</p>`;
    }
    return { v, f, x0, y0, a, answer: r4(answer), tol: v === 3 ? 0.05 : 0.01, q: q + TWOD, sol };
  }, (p) => rk4(p.f, p.x0, p.y0, p.a, 20000)),

  // mixing with changing volume
  gen('de-g22', 5, 'nat', 'numeric', 'mixing problems', (rng) => {
    const v = int(rng, 0, 2), [rin, rout] = choose(rng, [[5, 3], [6, 4], [4, 3]]), cin = choose(rng, [0.5, 1, 2]), V0 = choose(rng, [100, 200]), x0 = choose(rng, [0, 0, 20]);
    const d = rin - rout, ex = rout / d;
    const start = R`A tank holds ${V0} litres of ${x0 ? `brine with ${x0} kg of salt` : 'pure water'}. A solution of ${cin} kg of salt per litre enters at ${rin} litres per minute and the well-stirred mixture leaves at ${rout} litres per minute.`;
    const xAt = (tt) => { const V = V0 + d * tt; return cin * V + (x0 - cin * V0) * (V0 / V) ** ex; };
    if (v === 2) {
      const tf = V0 / d, answer = xAt(tf);
      return { v, rin, rout, cin, V0, x0, t: tf, answer: r4(answer), tol: 0.05, unit: 'kg',
        q: R`${start} The tank overflows when it holds ${2 * V0} litres. How many kg of salt are in it at that moment?${TWOD}`,
        sol: R`<p>$V=${V0}+${d}t$ reaches ${2 * V0} at $t=${tf}$ min. The salt obeys $\dfrac{dx}{dt}=${r4(rin * cin)}-\dfrac{${rout}x}{V}$ with solution $x=${cin}V+C\,V^{-${r4(ex)}}$, where $C=(${x0}-${cin * V0})\cdot${V0}^{${r4(ex)}}$. At $V=${2 * V0}$: $x=${r4(cin * 2 * V0)}+(${x0 - cin * V0})\left(\dfrac12\right)^{${r4(ex)}}=${r4(answer)}$ kg.</p>` };
    }
    const t = choose(rng, [25, 50]), V = V0 + d * t, answer = v === 0 ? xAt(t) : xAt(t) / V;
    return { v, rin, rout, cin, V0, x0, t, answer: r4(answer), tol: v === 0 ? 0.05 : 0.001, unit: v === 0 ? 'kg' : 'kg/L',
      q: v === 0 ? R`${start} How many kg of salt are in the tank after ${t} minutes?${TWOD}` : R`${start} What is the concentration of salt in the tank after ${t} minutes, in kg per litre? (4 decimal places)`,
      sol: R`<p>Volume $V=${V0}+${d}t$. $\dfrac{dx}{dt}=${r4(rin * cin)}-\dfrac{${rout}x}{${V0}+${d}t}$. IF $=V^{${r4(ex)}}$, giving $x=${cin}V+C\,V^{-${r4(ex)}}$. From $x(0)=${x0}$: $C=(${x0}-${cin * V0})\cdot${V0}^{${r4(ex)}}$. At $t=${t}$: $V=${V}$, so $x=${r4(cin * V)}+(${x0 - cin * V0})\left(\dfrac{${V0}}{${V}}\right)^{${r4(ex)}}=${r4(xAt(t))}$ kg.${v === 1 ? R` The concentration is $\dfrac xV=\dfrac{${r4(xAt(t))}}{${V}}=${r4(answer)}$ kg/L.` : ''}</p>` };
  }, (p) => {
    const sim = (T) => rk4((tt, x) => p.rin * p.cin - (p.rout * x) / (p.V0 + (p.rin - p.rout) * tt), 0, p.x0, T, 6000);
    return p.v === 1 ? sim(p.t) / (p.V0 + (p.rin - p.rout) * p.t) : sim(p.t);
  }),

  // order of the differential equation of a family
  gen('de-g23', 2, 'nat', 'integer', 'arbitrary constants', (rng) => {
    const v = int(rng, 0, 4), a = int(rng, 2, 5), b = a + int(rng, 1, 2);
    let fam, n, why;
    if (v === 0) { fam = R`all circles of radius ${a}, with their centres anywhere`; n = 2; why = R`The centre $(h,k)$ is free, the radius is fixed: 2 constants.`; }
    else if (v === 1) { fam = 'all circles in the plane'; n = 3; why = R`$(x-h)^2+(y-k)^2=r^2$ has 3 constants.`; }
    else if (v === 2) { fam = R`all parabolas $y=\alpha x^2+\beta x+\gamma$`; n = 3; why = R`Three coefficients, three constants.`; }
    else if (v === 3) { fam = R`all lines $x\cos\theta+y\sin\theta=${a}$ (distance ${a} from the origin)`; n = 1; why = R`Only the angle $\theta$ is free: 1 constant.`; }
    else { fam = R`the curves $y=\alpha x^{${a}}+\beta x^{${b}}$`; n = 2; why = R`$\alpha$ and $\beta$ are independent: 2 constants.`; }
    return { v, n, answer: n, tol: 0, q: R`Find the order of the differential equation of the family: ${fam}.`, sol: R`<p>The order equals the number of independent constants. ${why} So the order is ${n}.</p>` };
  }, (p) => p.n),
];

items.forEach(tidyItem);
items.forEach((it, i) => { it.id = `de-${String(i + 1).padStart(3, '0')}`; });


// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `de-x${String(++_k).padStart(3, '0')}`;
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
const GX = (id, level, type, format, sub, make, verify) => ({ id: `de-${id}`, type, format, level, exams: xex(level, type), sub, make, ...(verify ? { verify } : {}) });
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
const xab = Math.abs, xe = Math.E;
// ---- load-time checks ----
ck('logistic t', rk4((x, y) => y * (2 - y), 0, 1, Math.log(3) / 2), 1.5, 1e-6);
ck('y\'=xy', rk4((x, y) => x * y, 0, 1, 1), Math.sqrt(xe), 1e-6);
ck('y\'=y/x', rk4((x, y) => y / x, 1, 3, 2), 6, 1e-6);
ck('y\'=2y', rk4((x, y) => 2 * y, 0, 1, 1), xe ** 2, 1e-6);
ck('y\'=-y', rk4((x, y) => -y, 0, xe, 1), 1, 1e-6);
ck('tan x - x', rk4((x, y) => (x + y) ** 2, 0, 0, Math.PI / 4), Math.tan(Math.PI / 4) - Math.PI / 4, 1e-5);
ck('(1+x2)y\'+y', rk4((x, y) => (Math.atan(x) - y) / (1 + x * x), 0, 0, 1), Math.PI / 4 - 1 + xe ** (-Math.PI / 4), 1e-6);
ck('homog y2', (() => { const y = (x) => Math.sqrt(x * x - x); return xd(y, 2) - (4 + y(2) ** 2) / (2 * 2 * y(2)); })(), 0, 1e-6);
ck('xy\' = y + sqrt', (() => { const y = (x) => (x * x - 1) / 2; return xd(y, 3) - (y(3) + Math.sqrt(9 + y(3) ** 2)) / 3; })(), 0, 1e-6);
ck('x = y2+y', (() => { const x = (y) => y * y + y; return xd(x, 3) - (x(3) + 9) / 3; })(), 0, 1e-6);
ck('x=y2+cy pt', 1 + 1, 2);
ck('tank', rk4((t, S) => -S / 20, 0, 10, 40), 10 * xe ** -2, 1e-6);
ck('cooling', rk4((t, T) => -Math.log(2) / 10 * (T - 30), 0, 90, 15), 30 + 60 * 2 ** -1.5, 1e-6);
ck('half life', 0.7 ** (5.830074629624194 / 3), 0.5, 1e-9);
ck('logistic 2.5', rk4((t, y) => y * (1 - y / 5), 0, 1, Math.log(4)), 2.5, 1e-6);
ck('y\'=xe^-x', rk4((x, y) => Math.exp(-x) - y, 0, 0, 1), Math.exp(-1), 1e-6);
ck('x e^x', rk4((x, y) => y / x, 1, 2, 2), 4, 1e-6);
ck('y2 = 4x+1', rk4((x, y) => 2 / y, 0, 1, 2), 3, 1e-6);
ck('y\'=y2 blow', rk4((x, y) => y * y, 0, 0.2, 4), 1 / (5 - 4), 1e-5);
ck('lin x y', (() => { const y = rk4((x, y) => -y / x + 3 * x, 1, 2 / 1 * 1, 2); return y; })(), (8 * 1 + (2 - 1)) / 2, 1e-4);
ck('f = 1 + int', rk4((x, f) => f, 0, 1, 1), xe, 1e-6);
ck('ivp y(2)=8', rk4((x, y) => y / x + x, 1, 3, 2), 8, 1e-6);
ck('2e^2', rk4((x, y) => (y / x) * (1 + Math.log(y / x)), 1, xe, 2), 2 * xe * xe, 1e-5);
ck('y\'\'=6x', (() => { const y = (x) => x ** 3 + x + 2; return y(2); })(), 12);
ck('y2nd', 2 * 1 + 1 * 0, 2);
ck('2nd 8.12', xe ** 2 + 2 / xe, 8.1248, 1e-4);

Object.assign(XG, {
  xm1: { title: 'Match: the order of the equation for each family', passage: XR`<p>Match each family of curves in List I (with arbitrary constants) with the order of the differential equation obtained by eliminating them, from List II.</p>`,
    list1: [XR`A. $y=Ae^x+Be^{-x}$`, XR`B. $y=ax^2$`, XR`C. $y=ax^3+bx^2+cx+d$`, XR`D. $y=(A+Bx)e^x+C$`],
    list2: [XR`p. $1$`, XR`q. $2$`, XR`r. $3$`, XR`s. $4$`] },
  xm2: { title: 'Match: variable separable equations', passage: XR`<p>Match each equation in List I with its general solution in List II ($c$ is a constant).</p>`,
    list1: [XR`A. $\dfrac{dy}{dx}=y\cos x$`, XR`B. $\dfrac{dy}{dx}=e^{x-y}$`, XR`C. $\dfrac{dy}{dx}=\dfrac{1+y^2}{1+x^2}$`, XR`D. $\dfrac{dy}{dx}=\dfrac xy$`],
    list2: [XR`p. $e^y=e^x+c$`, XR`q. $y^2-x^2=c$`, XR`r. $y=ce^{\sin x}$`, XR`s. $\tan^{-1}y-\tan^{-1}x=c$`] },
  xm3: { title: 'Match: degree of homogeneity', passage: XR`<p>Match each function $f(x,y)$ in List I with its degree of homogeneity in List II (that is, $f(tx,ty)=t^nf(x,y)$).</p>`,
    list1: [XR`A. $x^3+3xy^2$`, XR`B. $\dfrac{x^2+y^2}{xy}$`, XR`C. $\sqrt{x^2+y^2}$`, XR`D. $\dfrac1{x+y}$`],
    list2: [XR`p. $0$`, XR`q. $1$`, XR`r. $3$`, XR`s. $-1$`] },
  xm4: { title: 'Match: the substitution that works', passage: XR`<p>Match each equation in List I with the substitution from List II that makes it easier.</p>`,
    list1: [XR`A. $\dfrac{dy}{dx}=(x+y+1)^2$`, XR`B. $\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$`, XR`C. $\dfrac{dy}{dx}+\dfrac yx=xy^3$`, XR`D. $\dfrac{dy}{dx}=\sin(x-y)$`],
    list2: [XR`p. $v=\dfrac yx$`, XR`q. $v=x+y+1$`, XR`r. $v=y^{-2}$`, XR`s. $v=x-y$`] },
  xm5: { title: 'Match: initial value problems', passage: XR`<p>Each equation in List I comes with an initial condition. Match it with the stated value in List II.</p>`,
    list1: [XR`A. $y'=2y$, $y(0)=1$; find $y(1)$`, XR`B. $y'=-y$, $y(0)=e$; find $y(1)$`, XR`C. $y'=xy$, $y(0)=1$; find $y(1)$`, XR`D. $y'=\dfrac yx$, $y(1)=3$; find $y(2)$`],
    list2: [XR`p. $1$`, XR`q. $e^2$`, XR`r. $6$`, XR`s. $\sqrt e$`] },
  xm6: { title: 'Match: long-run behaviour', passage: XR`<p>Each equation in List I has the solution with $y(0)=\frac12$. Match it with $\displaystyle\lim_{t\to\infty}y(t)$ from List II.</p>`,
    list1: [XR`A. $y'=y(1-y)$`, XR`B. $y'=-y$`, XR`C. $y'=2-y$`, XR`D. $y'=3-2y$`],
    list2: [XR`p. $0$`, XR`q. $1$`, XR`r. $2$`, XR`s. $\dfrac32$`] },
  xm7: { title: 'Match: orthogonal trajectories', passage: XR`<p>Match each family in List I with the family of its orthogonal trajectories in List II ($c,k$ are constants).</p>`,
    list1: [XR`A. $y=cx$`, XR`B. $y^2=4cx$`, XR`C. $xy=c$`, XR`D. $y=ce^x$`],
    list2: [XR`p. $y^2+2x=k$`, XR`q. $x^2-y^2=k$`, XR`r. $2x^2+y^2=k$`, XR`s. $x^2+y^2=k$`] },
  xm8: { title: 'Match: integral equations', passage: XR`<p>Match each equation in List I (for $x\ge0$) with the function $f$ that solves it, from List II.</p>`,
    list1: [XR`A. $f(x)=1+\displaystyle\int_0^xf(t)\,dt$`, XR`B. $f(x)=1+\displaystyle\int_0^xtf(t)\,dt$`, XR`C. $f(x)=x+\displaystyle\int_0^xf(t)\,dt$`, XR`D. $f(x)=1-\displaystyle\int_0^xf(t)\,dt$`],
    list2: [XR`p. $e^{x^2/2}$`, XR`q. $e^x-1$`, XR`r. $e^{-x}$`, XR`s. $e^x$`] },
  xp5: { title: 'Passage: logistic growth', passage: XR`<p>A population (in thousands) satisfies $\dfrac{dy}{dt}=y(2-y)$ with $y(0)=1$, $t$ in years. The solution is $y=\dfrac2{1+e^{-2t}}$.</p>` },
  xp6: { title: 'Passage: a family of circles', passage: XR`<p>The family of circles through the origin with centre on the $x$-axis is $x^2+y^2=2ax$, where $a$ is an arbitrary constant.</p>` },
  xp7: { title: 'Passage: two exponentials', passage: XR`<p>The family $y=Ae^{2x}+Be^{-x}$ ($A,B$ arbitrary constants) satisfies the second-order equation $y''-y'-2y=0$.</p>` },
});

XIT.push(
  // ---- L2 ----
  M(2, 'order and degree', XR`The order of $\dfrac{d^2y}{dx^2}+\left(\dfrac{dy}{dx}\right)^3+y=0$ is`, '$2$', ['$1$', '$3$', '$6$'],
    XR`<p>The order is the highest derivative that appears: $\dfrac{d^2y}{dx^2}$, so $2$. (The cube is about the degree, not the order.)</p>`, 'Order is the highest derivative; degree is its power.'),
  M(2, 'arbitrary constants', XR`The general solution of a third-order differential equation has how many arbitrary constants?`, '$3$', ['$1$', '$2$', '$4$'],
    XR`<p>The number of independent arbitrary constants in the general solution equals the order, $3$.</p>`, 'The count equals the order.'),
  M(2, 'variable separable', XR`The general solution of $\dfrac{dy}{dx}=e^x$ is`, '$y=e^x+c$', ['$y=e^x$', '$y=xe^x+c$', '$y=e^{x}\\ln x+c$'],
    XR`<p>Integrate both sides: $y=\int e^xdx=e^x+c$.</p>`, 'Do not forget the constant.'),
  M(2, 'integrating factors', XR`The integrating factor of $\dfrac{dy}{dx}+2y=\sin x$ is`, '$e^{2x}$', ['$e^{x}$', '$2x$', '$\\sin x$'],
    XR`<p>IF $=e^{\int P\,dx}=e^{\int2\,dx}=e^{2x}$.</p>`, 'IF = e raised to the integral of the coefficient of y.'),
  M(2, 'variable separable', XR`The general solution of $\dfrac{dy}{dx}=\dfrac yx$ ($x>0,y>0$) is`, '$y=cx$', ['$y=x+c$', '$y=ce^x$', '$y=c\\ln x$'],
    XR`<p>$\dfrac{dy}y=\dfrac{dx}x$ gives $\ln y=\ln x+\ln c$, so $y=cx$.</p>`, 'Write the constant as ln c to combine the logs.'),
  // ---- L3 ----
  M(3, 'variable separable', XR`The general solution of $\dfrac{dy}{dx}=e^{x+y}$ is`, '$e^x+e^{-y}=c$', ['$e^x-e^y=c$', '$e^{x+y}=c$', '$e^x+e^y=c$'],
    XR`<p>$e^{-y}dy=e^xdx$, so $-e^{-y}=e^x+c_1$, i.e. $e^x+e^{-y}=c$.</p>`, 'The integral of e^(−y) is −e^(−y).'),
  M(3, 'integrating factors', XR`For $\dfrac{dy}{dx}+\dfrac yx=x^2$ ($x>0$), the integrating factor is`, '$x$', [XR`$\dfrac1x$`, '$e^x$', '$\\ln x$'],
    XR`<p>$e^{\int dx/x}=e^{\ln x}=x$.</p>`, 'Remember e^(ln x) = x, not ln x.'),
  M(3, 'linear first order', XR`The general solution of $x\dfrac{dy}{dx}+y=x^2$ is`, XR`$xy=\dfrac{x^3}3+c$`, [XR`$y=\dfrac{x^3}3+c$`, XR`$xy=x^3+c$`, XR`$y=\dfrac{x^2}2+c$`],
    XR`<p>The left side is $\dfrac d{dx}(xy)$, so $xy=\int x^2dx=\dfrac{x^3}3+c$.</p>`, 'Spot the product rule on the left.'),
  M(3, 'homogeneous equations', XR`The solution of $\dfrac{dy}{dx}=\dfrac{x+y}x$ ($x>0$) is`, '$y=x\\ln x+cx$', ['$y=x\\ln x+c$', '$y=\\ln x+cx$', '$y=xe^x+c$'],
    XR`<p>Put $y=vx$: $v+x\dfrac{dv}{dx}=1+v$, so $x\dfrac{dv}{dx}=1$, $v=\ln x+c$ and $y=x\ln x+cx$.</p>`, 'Multiply back by x at the end.'),
  M(3, 'variable separable', XR`The solution of $\dfrac{dy}{dx}=-2xy$ with $y(0)=1$ is`, '$y=e^{-x^2}$', ['$y=e^{-2x}$', '$y=1-x^2$', '$y=e^{x^2}$'],
    XR`<p>$\dfrac{dy}y=-2x\,dx$ gives $\ln y=-x^2+c$. $y(0)=1$ gives $c=0$. So $y=e^{-x^2}$.</p>`, 'The integral of −2x is −x², not −2x²/2 with a wrong sign.'),
  M(3, 'forming equations', XR`The differential equation of the family of parabolas $y^2=4ax$ is`, '$y=2x\\dfrac{dy}{dx}$', ['$y=x\\dfrac{dy}{dx}$', '$y^2=2x\\dfrac{dy}{dx}$', '$2y=x\\dfrac{dy}{dx}$'],
    XR`<p>Differentiate: $2yy'=4a$. Substitute $4a=\dfrac{y^2}x$: $2yy'=\dfrac{y^2}x$, i.e. $y=2xy'$.</p>`, 'Eliminate a using the original equation.'),
  A(3, 'variable separable', XR`The general solution of $\dfrac{dy}{dx}=x^2y$ is $y=ce^{x^3/3}$.`, XR`The equation is separable: $\displaystyle\int\dfrac{dy}y=\int x^2dx$.`, 0,
    XR`<p>$\ln y=\dfrac{x^3}3+\ln c$ gives $y=ce^{x^3/3}$. R describes exactly the method used.</p>`, 'Separate first, then integrate.'),
  A(3, 'homogeneous equations', XR`$\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$ can be solved by putting $y=vx$.`, XR`The right side depends only on $\dfrac yx$.`, 0,
    XR`<p>$\dfrac{x^2+y^2}{xy}=\dfrac{1+(y/x)^2}{y/x}$ depends only on $y/x$, so $y=vx$ makes the variables separable.</p>`, 'Divide top and bottom by x².'),
  S(3, 'existence', XR`The problem $\dfrac{dy}{dx}=y$, $y(0)=1$ has exactly one solution.`, XR`That solution is $y=e^x$.`, 0,
    XR`<p>Separating gives $y=ce^x$, and $y(0)=1$ gives $c=1$. Both statements are true.</p>`, 'The initial condition fixes the constant.'),
  I(3, 'variable separable', XR`$y'=4xy$ with $y(0)=1$. Find $\ln y$ at $x=3$.`, 18,
    XR`<p>$\dfrac{dy}y=4x\,dx$ gives $\ln y=2x^2+c$ with $c=0$. At $x=3$: $\ln y=18$.</p>`, 'The integral of 4x is 2x².', () => 2 * 9),
  I(3, 'arbitrary constants', XR`The differential equation of the family of ellipses $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ (with $a,b$ arbitrary) has order`, 2,
    XR`<p>There are two independent arbitrary constants, $a$ and $b$, so the equation has order $2$.</p>`, 'Count the independent constants.', () => 2),
  I(3, 'Higher order', XR`$\dfrac{d^3y}{dx^3}=24x$ with $y(0)=y'(0)=y''(0)=0$. Find $y(2)$.`, 16,
    XR`<p>Integrate three times with zero constants: $y''=12x^2$, $y'=4x^3$, $y=x^4$. $y(2)=16$.</p>`, 'Each integration constant is zero by the conditions.', () => 16),
  N(3, 'growth and decay', XR`A sum grows with continuous compounding at $5\%$ per year: $\dfrac{dP}{dt}=0.05P$. In how many years does it double? (2 decimal places)`, 13.86, 0.01,
    XR`<p>$P=P_0e^{0.05t}$. Doubling: $e^{0.05t}=2$, $t=\dfrac{\ln2}{0.05}=13.86$ years.</p>`, 'The rule of 72 gives only an approximation (14.4).', () => Math.log(2) / 0.05),
  // ---- matches ----
  MT(3, 'arbitrary constants', 'xm1', 'A-q, B-p, C-s, D-r', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-q, B-s, C-p, D-r'],
    XR`<p>Order = number of independent constants. A: $A,B$: $2$ (q). B: one constant $a$: $1$ (p). C: $a,b,c,d$: $4$ (s). D: $A,B,C$: $3$ (r).</p>`, 'The constant C is separate from A and B.'),
  MT(3, 'variable separable', 'xm2', 'A-r, B-p, C-s, D-q', ['A-r, B-p, C-q, D-s', 'A-p, B-r, C-s, D-q', 'A-r, B-q, C-s, D-p'],
    XR`<p>A: $\dfrac{dy}y=\cos x\,dx$ gives $y=ce^{\sin x}$ (r). B: $e^ydy=e^xdx$ gives $e^y=e^x+c$ (p). C: $\dfrac{dy}{1+y^2}=\dfrac{dx}{1+x^2}$ (s). D: $y\,dy=x\,dx$ gives $y^2-x^2=c$ (q).</p>`, 'Separate each equation before integrating.'),
  MT(3, 'homogeneous equations', 'xm3', 'A-r, B-p, C-q, D-s', ['A-r, B-p, C-s, D-q', 'A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s'],
    XR`<p>A: each term has degree $3$ (r). B: top degree 2 over bottom degree 2: $0$ (p). C: $\sqrt{t^2(\cdots)}=t\sqrt{\cdots}$: degree $1$ (q). D: $\dfrac1{t(x+y)}$: degree $-1$ (s).</p>`, 'Divide degrees: numerator degree minus denominator degree.'),
  MT(4, 'substitution', 'xm4', 'A-q, B-p, C-r, D-s', ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s'],
    XR`<p>A: $v=x+y+1$ gives $v'=1+v^2$ (q). B: homogeneous of degree 0, so $v=\dfrac yx$ (p). C: Bernoulli with $n=3$, so $v=y^{1-3}=y^{-2}$ (r). D: $v=x-y$ gives $v'=1-\sin v$ (s).</p>`, 'Bernoulli: v = y^(1−n).'),
  MT(4, 'initial value problems', 'xm5', 'A-q, B-p, C-s, D-r', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-q, B-s, C-p, D-r'],
    XR`<p>A: $y=e^{2x}$, $y(1)=e^2$ (q). B: $y=e\cdot e^{-x}$, $y(1)=1$ (p). C: $y=e^{x^2/2}$, $y(1)=\sqrt e$ (s). D: $y=3x$, $y(2)=6$ (r).</p>`, 'In B the starting value is e, which cancels at x = 1.'),
  MT(4, 'long-run behaviour', 'xm6', 'A-q, B-p, C-r, D-s', ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s'],
    XR`<p>The limit is the equilibrium that attracts $y(0)=\frac12$. A: equilibria $0,1$; between them $y'>0$, so $y\to1$ (q). B: $y\to0$ (p). C: $y\to2$ (r). D: $y=\frac32$ is the equilibrium of $3-2y=0$ (s).</p>`, 'Find where the right side is zero and which way the solution moves.'),
  MT(5, 'orthogonal trajectories', 'xm7', 'A-s, B-r, C-q, D-p', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-s, B-q, C-r, D-p'],
    XR`<p>A: $y'=\dfrac yx$, orthogonal $y'=-\dfrac xy$: $x^2+y^2=k$ (s). B: $y'=\dfrac y{2x}$; orthogonal $y'=-\dfrac{2x}y$: $2x^2+y^2=k$ (r). C: $y'=-\dfrac yx$; orthogonal $y'=\dfrac xy$: $x^2-y^2=k$ (q). D: $y'=y$; orthogonal $y'=-\dfrac1y$: $y^2+2x=k$ (p).</p>`, 'Replace y′ by −1/y′ in the DE of the family.'),
  MT(5, 'integral equations', 'xm8', 'A-s, B-p, C-q, D-r', ['A-s, B-p, C-r, D-q', 'A-p, B-s, C-q, D-r', 'A-s, B-q, C-p, D-r'],
    XR`<p>Differentiate. A: $f'=f$, $f(0)=1$: $e^x$ (s). B: $f'=xf$, $f(0)=1$: $e^{x^2/2}$ (p). C: $f'=1+f$, $f(0)=0$: $f=e^x-1$ (q). D: $f'=-f$, $f(0)=1$: $e^{-x}$ (r).</p>`, 'Put x = 0 in the integral equation to get the initial value.'),
  // ---- L4 ----
  M(4, 'exact-looking', XR`The general solution of $x\,dy-y\,dx=x^2e^x\,dx$ ($x>0$) is`, '$y=x(e^x+c)$', ['$y=e^x+c$', '$y=x e^x+c$', '$y=x^2e^x+c$'],
    XR`<p>Divide by $x^2$: $\dfrac{x\,dy-y\,dx}{x^2}=d\left(\dfrac yx\right)=e^xdx$. So $\dfrac yx=e^x+c$.</p>`, 'x dy − y dx over x² is the differential of y/x.'),
  M(4, 'forming equations', XR`The differential equation of all lines $y=mx+m^3$ (with $m$ arbitrary) is`, XR`$y=xy'+(y')^3$`, [XR`$y=xy'+y'$`, XR`$y=xy'+(y')^2$`, XR`$y'=m$`],
    XR`<p>Differentiate: $y'=m$. Substitute $m=y'$ in the equation: $y=xy'+(y')^3$.</p>`, 'Replace m by y′ everywhere.'),
  M(4, 'homogeneous equations', XR`The general solution of $x\dfrac{dy}{dx}=y+x\tan\dfrac yx$ is`, XR`$\sin\dfrac yx=cx$`, [XR`$\cos\dfrac yx=cx$`, XR`$\tan\dfrac yx=cx$`, XR`$\sin\dfrac yx=c$`],
    XR`<p>Put $y=vx$: $v+xv'=v+\tan v$, so $\cot v\,dv=\dfrac{dx}x$. Integrate: $\ln|\sin v|=\ln x+c$, so $\sin\dfrac yx=cx$.</p>`, 'The integral of cot v is ln|sin v|.'),
  M(4, 'linear first order', XR`The general solution of $\dfrac{dy}{dx}+y=e^{-x}$ is`, '$y=(x+c)e^{-x}$', ['$y=(x+c)e^{x}$', '$y=e^{-x}+c$', '$y=xe^{-x}+c$'],
    XR`<p>IF $=e^x$. $\dfrac d{dx}(ye^x)=1$, so $ye^x=x+c$ and $y=(x+c)e^{-x}$.</p>`, 'Multiply by the IF: it turns the right side into 1.'),
  I(4, 'forming equations', XR`Eliminating $a$ and $b$ from $y^2=4a(x+b)$ gives an equation of order $m$ and degree $n$. Find $10m+n$.`, 21,
    XR`<p>Differentiate: $2yy'=4a$. Again: $2y'^2+2yy''=0$, i.e. $yy''+(y')^2=0$. The highest derivative $y''$ appears to power $1$: order $2$, degree $1$. $10\cdot2+1=21$.</p>`, 'Two constants need two differentiations.', () => 21),
  I(4, 'linear first order', XR`$\dfrac{dy}{dx}-\dfrac yx=x$ with $y(1)=3$. Find $y(2)$.`, 8,
    XR`<p>IF $=e^{-\ln x}=\dfrac1x$. $\dfrac d{dx}\left(\dfrac yx\right)=1$, so $\dfrac yx=x+c$. $y(1)=3$ gives $c=2$. $y=x^2+2x$ and $y(2)=4+4=8$.</p>`, 'IF is 1/x here: do not use x.', () => 8),
  I(4, 'homogeneous equations', XR`$\dfrac{dy}{dx}=\dfrac{x^2+y^2}{2xy}$ for $x>0$, $y>0$, with $y(1)=0$ (as a limit). Find $y(2)^2$.`, 2,
    XR`<p>Put $y=vx$: $v+xv'=\dfrac{1+v^2}{2v}$, so $x v'=\dfrac{1-v^2}{2v}$. Then $\dfrac{2v\,dv}{1-v^2}=\dfrac{dx}x$, giving $-\ln|1-v^2|=\ln x+c$, i.e. $1-v^2=\dfrac Cx$, so $x^2-y^2=Cx$. $y(1)=0$: $1=C$. At $x=2$: $4-y^2=2$, $y^2=2$.</p>`, 'The solution curve is x² − y² = x, so y² = x² − x.', () => 4 - 2),
  I(4, 'curves from tangent properties', XR`A curve passes through $(0,1)$ and its subnormal at every point is constant and equal to $2$. Find the $y$-value at $x=2$ ($y>0$).`, 3,
    XR`<p>Subnormal $=y\dfrac{dy}{dx}=2$. So $y\,dy=2\,dx$ and $y^2=4x+c$. At $(0,1)$: $c=1$. At $x=2$: $y^2=9$, $y=3$.</p>`, 'Subnormal = y·dy/dx; subtangent = y/(dy/dx).', () => 3),
  I(4, 'growth and decay', XR`$y'=y^2$ with $y(0)=\dfrac15$. The solution becomes infinite at $x=T$. Find $T$.`, 5,
    XR`<p>$\dfrac{dy}{y^2}=dx$ gives $-\dfrac1y=x+c$. $y(0)=\dfrac15$ gives $c=-5$. So $y=\dfrac1{5-x}$, infinite at $x=5$.</p>`, 'The solution blows up in finite x.', () => 5),
  I(4, 'linear first order', XR`$\dfrac{dy}{dx}+y=e^{-x}$ with $y(0)=0$. At which $x$ is $y$ largest?`, 1,
    XR`<p>$y=xe^{-x}$. $y'=e^{-x}(1-x)=0$ at $x=1$, with $y'$ changing from $+$ to $-$: maximum at $x=1$.</p>`, 'Check the maximum of y, not the value of y at 1.', () => 1),
  I(5, 'arbitrary constants', XR`The family $y=c_1e^{x+c_2}+c_3\sin(x+c_4)+c_5$ ($c_1,\dots,c_5$ arbitrary) gives a differential equation of order`, 4,
    XR`<p>$c_1e^{x+c_2}=(c_1e^{c_2})e^x$ is a single constant times $e^x$: one independent constant. $c_3\sin(x+c_4)$ has two ($c_3,c_4$, equivalently $c_3\cos c_4$ and $c_3\sin c_4$). $c_5$ is one. Total $1+2+1=4$.</p>`, 'Combine constants that multiply the same function.', () => 4),
  I(5, 'homogeneous equations', XR`$x\dfrac{dy}{dx}=y+\sqrt{x^2+y^2}$ for $x>0$ with $y(1)=0$. Find $y(3)$.`, 4,
    XR`<p>Put $y=vx$: $xv'=\sqrt{1+v^2}$. $\dfrac{dv}{\sqrt{1+v^2}}=\dfrac{dx}x$ gives $\sinh^{-1}v=\ln x$, so $v=\sinh(\ln x)=\dfrac12\left(x-\dfrac1x\right)$ ($y(1)=0$ gives the constant $0$). $y=\dfrac{x^2-1}2$. $y(3)=4$.</p>`, 'sinh(ln x) = (x − 1/x)/2.', () => (9 - 1) / 2),
  I(5, 'reducible to linear', XR`A curve passes through $(2,1)$ and satisfies $y\,dx=(x+y^2)\,dy$. Find $x$ when $y=3$.`, 12,
    XR`<p>Treat $x$ as the unknown: $\dfrac{dx}{dy}-\dfrac xy=y$. IF $=\dfrac1y$: $\dfrac d{dy}\left(\dfrac xy\right)=1$, so $\dfrac xy=y+c$, $x=y^2+cy$. At $(2,1)$: $2=1+c$, $c=1$. At $y=3$: $x=9+3=12$.</p>`, 'The equation is linear in x as a function of y.', () => 9 + 3),
  I(5, 'higher order', XR`$y=Ae^{x}\cos x+Be^{x}\sin x$ satisfies $y''-2y'+2y=0$. If $y(0)=1$ and $y'(0)=3$, find $10A+B$.`, 12,
    XR`<p>$y(0)=A=1$. $y'=e^x[(A+B)\cos x+(B-A)\sin x]$, so $y'(0)=A+B=3$, $B=2$. $10A+B=12$.</p>`, 'Differentiate the product e^x(...) carefully.', () => 10 * 1 + 2),
  I(4, 'order and degree', XR`$\dfrac{d^2y}{dx^2}=6x$, $y(0)=2$, $y'(0)=1$. Find $y(2)$.`, 12,
    XR`<p>$y'=3x^2+1$ and $y=x^3+x+2$. $y(2)=8+2+2=12$.</p>`, 'Integrate twice and use both conditions.', () => 8 + 2 + 2),
  N(4, 'mixing problems', XR`A $100$ litre tank holds $10$ kg of salt. Pure water enters at $5$ litres/min and the well-stirred mixture leaves at $5$ litres/min. How much salt (kg) is left after $40$ minutes? (2 decimal places)`, 1.35, 0.01,
    XR`<p>$\dfrac{dS}{dt}=-\dfrac5{100}S=-\dfrac S{20}$. $S=10e^{-t/20}$. At $t=40$: $10e^{-2}=1.35$ kg.</p>`, 'The rate out is 5 L/min times the concentration S/100.', () => 10 * Math.exp(-2)),
  N(4, 'Newton cooling', XR`A drink at $90^\circ$C is in a room at $30^\circ$C. After $10$ minutes it is at $60^\circ$C. What is its temperature after $15$ minutes? (2 decimal places, in $^\circ$C)`, 51.21, 0.01,
    XR`<p>$T-30=60e^{-kt}$. At $10$ min: $30=60e^{-10k}$, so $e^{-10k}=\dfrac12$. At $15$ min: $T-30=60\cdot2^{-3/2}=21.21$. $T=51.21^\circ$C.</p>`, 'Work with T − 30, not T.', () => 30 + 60 * 2 ** -1.5),
  N(4, 'growth and decay', XR`A substance decays so that $30\%$ of it is gone after $3$ days. What is its half-life in days? (2 decimal places)`, 5.83, 0.01,
    XR`<p>$N=N_0r^t$ with $r^3=0.7$. Half-life: $r^{T}=0.5$, so $T=\dfrac{3\ln0.5}{\ln0.7}=\dfrac{3(-0.6931)}{-0.3567}=5.83$ days.</p>`, '30% gone means 70% remains.', () => 3 * Math.log(0.5) / Math.log(0.7)),
  N(5, 'substitution', XR`$\dfrac{dy}{dx}=(x+y)^2$ with $y(0)=0$. Find $y\left(\dfrac\pi4\right)$ (2 decimal places).`, 0.21, 0.01,
    XR`<p>Put $v=x+y$: $v'=1+v^2$, so $v=\tan x$ (as $v(0)=0$). $y=\tan x-x$. At $\dfrac\pi4$: $1-0.7854=0.2146\approx0.21$.</p>`, 'v = x + y, so y = v − x.', () => Math.tan(Math.PI / 4) - Math.PI / 4),
  N(5, 'Bernoulli equation', XR`$\dfrac{dy}{dx}=\dfrac yx\left(1+\ln\dfrac yx\right)$ for $x>0$ with $y(1)=e$. Find $y(2)$ (2 decimal places).`, 14.78, 0.01,
    XR`<p>Put $y=vx$: $v+xv'=v(1+\ln v)$, so $xv'=v\ln v$. $\dfrac{dv}{v\ln v}=\dfrac{dx}x$ gives $\ln\ln v=\ln x+c$, i.e. $\ln v=cx$. $v(1)=e$: $c=1$. So $y=xe^{x}$. $y(2)=2e^2=14.78$.</p>`, 'The substitution v = y/x turns it into ln v = cx.', () => 2 * Math.E ** 2),
  N(5, 'linear first order', XR`$(1+x^2)\dfrac{dy}{dx}+y=\tan^{-1}x$ with $y(0)=0$. Find $y(1)$ (2 decimal places).`, 0.24, 0.01,
    XR`<p>$\dfrac{dy}{dx}+\dfrac y{1+x^2}=\dfrac{\tan^{-1}x}{1+x^2}$. IF $=e^{\tan^{-1}x}$. With $t=\tan^{-1}x$: $ye^t=\int te^t\,dt=(t-1)e^t+c$. So $y=t-1+ce^{-t}$. $y(0)=0$: $c=1$. $y(1)=\dfrac\pi4-1+e^{-\pi/4}=0.7854-1+0.4559=0.2413\approx0.24$.</p>`, 'Substitute t = tan⁻¹x to do the integral.', () => Math.PI / 4 - 1 + Math.exp(-Math.PI / 4)),
  N(5, 'growth and decay', XR`$\dfrac{dy}{dt}=y\left(1-\dfrac y5\right)$ with $y(0)=1$. At what time $t$ does $y$ reach $2.5$? (2 decimal places)`, 1.39, 0.01,
    XR`<p>Logistic with $K=5$: $y=\dfrac5{1+4e^{-t}}$. $y=2.5$ means $1+4e^{-t}=2$, $e^{-t}=\dfrac14$, $t=\ln4=1.39$.</p>`, 'y = K/2 at the point of fastest growth.', () => Math.log(4)),
  X(3, 'order and degree', XR`Which of these equations have degree $1$?`, [XR`$y''+(y')^2=0$`, XR`$(y')^2+y=0$`, XR`$y'''+(y'')^2=0$`, XR`$\sin(y')+y=0$`], [0, 2],
    XR`<p>The degree is the power of the highest derivative (when the equation is a polynomial in derivatives). A: $y''$ to power 1: degree 1. B: $(y')^2$: degree 2. C: $y'''$ to power 1: degree 1. D: not a polynomial in $y'$: degree not defined.</p>`, 'Squares of lower derivatives do not change the degree.'),
  X(4, 'homogeneous equations', XR`Which equations are homogeneous (of the form $\dfrac{dy}{dx}=f\left(\dfrac yx\right)$)?`, [XR`$(x^2+y^2)\,dx=xy\,dy$`, XR`$\dfrac{dy}{dx}=\dfrac{x+y+1}{x-y}$`, XR`$\dfrac{dy}{dx}=\dfrac{x^3+y^3}{x^2y}$`, XR`$\dfrac{dy}{dx}=\dfrac yx+\tan\dfrac yx$`], [0, 2, 3],
    XR`<p>A: $\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$, degree 0: yes. B: the $+1$ breaks homogeneity. C: degree $3-3=0$: yes. D: already a function of $y/x$: yes.</p>`, 'A constant term breaks homogeneity.'),
  X(4, 'linear first order', XR`Which are linear first-order equations in $y$?`, [XR`$y'+xy=x^2$`, XR`$y'+y^2=x$`, XR`$xy'+y=e^x$`, XR`$yy'=x$`], [0, 2],
    XR`<p>Linear means $y$ and $y'$ appear only to power 1 and are not multiplied together. A and C are linear. B has $y^2$. D has the product $yy'$.</p>`, 'A product yy′ is not linear.'),
  X(4, 'verifying solutions', XR`Which functions satisfy $y''+y=0$?`, [XR`$\sin x$`, XR`$\cos x+\sin x$`, XR`$e^x$`, XR`$3\cos(x-2)$`], [0, 1, 3],
    XR`<p>$y''=-y$ for sine and cosine, so any combination $a\cos x+b\sin x$ works. $3\cos(x-2)=3\cos2\cos x+3\sin2\sin x$ is such a combination. $e^x$ has $y''=y$.</p>`, 'Shifted cosines are combinations of sin and cos.'),
  X(5, 'uniqueness', XR`Consider $\dfrac{dy}{dx}=\sqrt y$ with $y(0)=0$. Which of these are solutions?`, [XR`$y=0$ for all $x$`, XR`$y=\dfrac{x^2}4$ for $x\ge0$ (and $0$ for $x<0$)`, XR`$y=\dfrac{x^2}4$ for all real $x$`, XR`$y=\dfrac{(x-1)^2}4$ for $x\ge1$ and $0$ for $x<1$`], [0, 1, 3],
    XR`<p>A: $0=\sqrt0$. B: for $x>0$, $y'=\dfrac x2=\sqrt{y}$; for $x\le0$ both sides are $0$. C fails for $x<0$: $y'=\dfrac x2<0$ but $\sqrt y=\dfrac{|x|}2>0$. D: the same as B shifted: also a solution (and is $0$ before $x=1$). So A, B, D: the solution with $y(0)=0$ is not unique.</p>`, 'Check the sign of the derivative on both sides of 0.'),
  X(4, 'orthogonal trajectories', XR`Which pairs of families are orthogonal trajectories of each other?`, [XR`$xy=c$ and $x^2-y^2=k$`, XR`$y=cx$ and $x^2+y^2=k$`, XR`$y=cx^2$ and $x^2+y^2=k$`, XR`$y^2=4cx$ and $2x^2+y^2=k$`], [0, 1, 3],
    XR`<p>Check that the slopes multiply to $-1$. A: $y'=-\dfrac yx$ and $y'=\dfrac xy$: yes. B: $\dfrac yx$ and $-\dfrac xy$: yes. C: $y'=\dfrac{2y}x$ for the first; the second has $-\dfrac xy$: product $-2$, no (the orthogonal family is $x^2+2y^2=k$). D: $\dfrac y{2x}$ and $-\dfrac{2x}y$: yes.</p>`, 'Compare the product of slopes at a common point.'),
  X(5, 'long-run behaviour', XR`$\dfrac{dy}{dt}=y(1-y)$, $y(0)=\dfrac12$. Which statements are true?`, [XR`$y\to1$ as $t\to\infty$`, XR`$y$ is increasing for all $t$`, XR`$y$ is concave up for all $t>0$`, XR`$y(t)<1$ for all $t$`], [0, 1, 3],
    XR`<p>$y=\dfrac1{1+e^{-t}}$. It increases towards $1$ but never reaches it. $y''=y'(1-2y)<0$ for $y>\frac12$, so it is concave down for $t>0$: C is false.</p>`, 'The inflection point is at y = 1/2, which is t = 0.'),
  X(4, 'Newton cooling', XR`A body at $100^\circ$C cools in a room at $20^\circ$C following Newton's law. Which statements are true?`, [XR`$T(t)=20+80e^{-kt}$`, XR`$T\to20$ as $t\to\infty$`, XR`the cooling rate is proportional to $T$ (not $T-20$)`, XR`$T$ never exactly equals $20$`], [0, 1, 3],
    XR`<p>$\dfrac{dT}{dt}=-k(T-20)$ gives A and B. C is false (it is proportional to the difference $T-20$). D: the exponential is never zero.</p>`, 'The law uses the temperature difference.'),
  X(4, 'integrating factors', XR`For $y'+Py=Q$ which statements are true?`, [XR`$e^{\int P\,dx}$ is an integrating factor`, XR`After multiplying by it the left side is $\dfrac d{dx}\left(y\,e^{\int P\,dx}\right)$`, XR`the integrating factor is unique`, XR`for $y'+\dfrac yx=1$ ($x>0$) the integrating factor $x$ works`], [0, 1, 3],
    XR`<p>A and B are the theory. C is false: any non-zero constant multiple of an integrating factor also works. D: $\dfrac d{dx}(xy)=xy'+y=x\left(y'+\dfrac yx\right)$, so yes.</p>`, 'Any constant multiple works too.'),
  S(4, 'integrating factors', XR`$e^{\int P\,dx}$ is an integrating factor of $\dfrac{dy}{dx}+Py=Q$.`, XR`The integrating factor of a linear equation is unique.`, 1,
    XR`<p>I is the standard result. II is false: $e^{\int P\,dx}$ can be multiplied by any non-zero constant. (The constant of integration in $\int P\,dx$ gives such a multiple.)</p>`, 'The factor is unique up to a constant multiple.'),
  S(5, 'orthogonal trajectories', XR`The differential equation of the family of circles $x^2+y^2=a^2$ is $x+yy'=0$.`, XR`The orthogonal trajectories of this family are the straight lines through the origin.`, 0,
    XR`<p>I: $2x+2yy'=0$. II: the slope of each circle is $-\dfrac xy$, so an orthogonal curve has slope $\dfrac yx$, which gives $y=cx$. Both are true.</p>`, 'Replace y′ by −1/y′ to get the orthogonal family.'),
  SC(4, 'mixed concepts', [XR`The order of a differential equation is the order of its highest derivative.`, XR`The degree of $y''+\sin y'=0$ is not defined.`, XR`The general solution of a first-order equation has exactly one arbitrary constant.`, XR`$\dfrac{dy}{dx}=x+y$ is a homogeneous equation.`], '3', ['1', '2', '4'],
    XR`<p>1, 2, 3 are true. 4 is false: $x+y$ has degree $1$, so $\dfrac{dy}{dx}=x+y$ does not depend only on $\dfrac yx$ (it is linear instead).</p>`, 'A homogeneous equation needs degree 0.'),
  SC(5, 'existence', [XR`$y'=y^2$, $y(0)=1$ has a solution defined for all real $x$.`, XR`A linear first-order equation $y'+Py=Q$ with $P,Q$ continuous on an interval has solutions on the whole interval.`, XR`Two different solution curves of $y'=y$ can cross each other.`, XR`$y=0$ is a solution of $y'=y^2$.`], '2', ['1', '3', '4'],
    XR`<p>1 is false: $y=\dfrac1{1-x}$ blows up at $x=1$. 2 is true. 3 is false: through every point there is only one solution of $y'=y$ (namely $ce^x$). 4 is true. Two are correct.</p>`, 'Non-linear equations can have solutions that blow up.'),
  A(4, 'existence', XR`The solution of $y'=y^2$ with $y(0)=1$ exists for all real $x$.`, XR`The solution is $y=\dfrac1{1-x}$.`, 3,
    XR`<p>R is true (separate variables). But $\dfrac1{1-x}$ is infinite at $x=1$, so the solution does not exist for all $x$. A is false, R true.</p>`, 'Check where the formula blows up.'),
  A(4, 'arbitrary constants', XR`The differential equation of the family $y=ax^2+bx+c$ has order $3$.`, XR`The order of the differential equation equals the number of independent arbitrary constants.`, 0,
    XR`<p>The family has three independent constants, $a,b,c$, so the order is $3$ (here $y'''=0$). R is the rule that gives it.</p>`, 'Count the independent parameters.'),
  A(5, 'arbitrary constants', XR`The family $y=c_1e^{x+c_2}$ satisfies a first-order equation, not a second-order one.`, XR`$c_1e^{c_2}$ is a single arbitrary constant.`, 0,
    XR`<p>$y=(c_1e^{c_2})e^x=Ke^x$, one constant, so $y'=y$ eliminates it. R is the reason.</p>`, 'Merge constants that always appear together.'),
  // ---- passages ----
  PI(4, 'long-run behaviour', 'xp5', XR`How many constant (equilibrium) solutions does $\dfrac{dy}{dt}=y(2-y)$ have?`, 2,
    XR`<p>Constant solutions need $y(2-y)=0$: $y=0$ and $y=2$.</p>`, 'Set the right side equal to zero.', () => 2),
  PN(4, 'growth and decay', 'xp5', XR`At what time $t$ (years) is $y=1.5$? (2 decimal places)`, 0.55, 0.01,
    XR`<p>$\dfrac2{1+e^{-2t}}=1.5$ gives $1+e^{-2t}=\dfrac43$, $e^{-2t}=\dfrac13$, $t=\dfrac{\ln3}2=0.55$.</p>`, 'Take the logarithm of e^(−2t) = 1/3.', () => Math.log(3) / 2),
  PI(5, 'long-run behaviour', 'xp5', XR`The growth rate $\dfrac{dy}{dt}$ is greatest when $y$ equals what value?`, 1,
    XR`<p>$\dfrac{dy}{dt}=2y-y^2$ is a downward parabola in $y$ with vertex at $y=1$. So the rate is greatest at $y=1$ (which here happens at $t=0$).</p>`, 'Maximise the right side as a function of y.', () => 1),
  PI(3, 'forming equations', 'xp6', XR`What is the order of the differential equation of this family?`, 1,
    XR`<p>There is one arbitrary constant $a$, so the order is $1$.</p>`, 'One constant: one differentiation.', () => 1),
  PI(4, 'forming equations', 'xp6', XR`The equation of the family is $2xyy'=y^2-x^2$. At the point $(1,1)$ the slope $y'$ is`, 0,
    XR`<p>Differentiate: $2x+2yy'=2a$, so $2a=\dfrac{x^2+y^2}x$ from the original. Then $2x+2yy'=\dfrac{x^2+y^2}x$, giving $2xyy'=y^2-x^2$. At $(1,1)$: $2y'=0$, $y'=0$ (the circle $x^2+y^2=2x$ has a horizontal tangent at $(1,1)$).</p>`, 'Substitute the point directly into the differential equation.', () => 0),
  PN(5, 'forming equations', 'xp6', XR`At the point $(2,1)$, find $y'$ (2 decimal places). (Use $2xyy'=y^2-x^2$.)`, -0.75, 0.01,
    XR`<p>$2(2)(1)y'=1-4=-3$, so $4y'=-3$ and $y'=-0.75$. (Check: the circle through $(2,1)$ is $x^2+y^2=2.5x$, with centre $(1.25,0)$; the radius to $(2,1)$ has slope $\dfrac43$, so the tangent has slope $-\dfrac34$.)</p>`, 'Use the differential equation, not the circle.', () => -3 / 4),
  PI(4, 'forming equations', 'xp7', XR`What is the order of the equation $y''-y'-2y=0$?`, 2,
    XR`<p>The highest derivative is $y''$, so the order is $2$ (matching the two constants $A,B$).</p>`, 'Two constants, order two.', () => 2),
  PI(5, 'initial value problems', 'xp7', XR`With $y(0)=3$ and $y'(0)=0$, find $10A+B$.`, 12,
    XR`<p>$y(0)=A+B=3$ and $y'(0)=2A-B=0$. Adding: $3A=3$, $A=1$, $B=2$. $10A+B=12$.</p>`, 'Differentiating Be^(−x) gives −B.', () => 10 * 1 + 2),
  PN(5, 'initial value problems', 'xp7', XR`With the same conditions, find $y(1)$ (2 decimal places).`, 8.12, 0.01,
    XR`<p>$y=e^{2x}+2e^{-x}$. At $x=1$: $e^2+2e^{-1}=7.389+0.736=8.125\approx8.12$.</p>`, 'Add the two exponentials separately.', () => Math.exp(2) + 2 / Math.E),
);

XGN.push(
  GX('xg01', 3, 'nat', 'integer', 'variable separable', (rng) => {
    const k = choose(rng, [2, 4, 6]), a = int(rng, 1, 4);
    return { k, a, answer: k * a * a / 2, tol: 0, q: XR`$\dfrac{dy}{dx}=${k}xy$ with $y(0)=1$. Find $\ln y$ at $x=${a}$.`, sol: XR`<p>$\dfrac{dy}y=${k}x\,dx$ gives $\ln y=${k / 2}x^2+c$ with $c=0$. At $x=${a}$: $\ln y=${k / 2}\cdot${a * a}=${k * a * a / 2}$.</p>` };
  }, (p) => Math.round(Math.log(rk4((x, y) => p.k * x * y, 0, 1, p.a, 8000)))),
  GX('xg02', 4, 'nat', 'integer', 'linear first order', (rng) => {
    const m = int(rng, 1, 4), y0 = choose(rng, [1, 2, 3, 4, 5, 6, 7, 8].filter((v) => (7 * m + v) % 2 === 0));
    const ans = (7 * m + y0) / 2;
    return { m, y0, answer: ans, tol: 0, q: XR`$\dfrac{dy}{dx}+\dfrac yx=${3 * m}x$ for $x>0$, with $y(1)=${y0}$. Find $y(2)$.`, sol: XR`<p>IF $=x$. $\dfrac d{dx}(xy)=${3 * m}x^2$, so $xy=${m}x^3+c$. $y(1)=${y0}$ gives $c=${y0 - m}$. At $x=2$: $2y=${8 * m}+${y0 - m}=${7 * m + y0}$, so $y=${ans}$.</p>` };
  }, (p) => Math.round(rk4((x, y) => -y / x + 3 * p.m * x, 1, p.y0, 2, 8000))),
  GX('xg03', 4, 'nat', 'integer', 'homogeneous equations', (rng) => {
    const c = int(rng, 2, 8);
    return { c, answer: c * c - c, tol: 0, q: XR`$\dfrac{dy}{dx}=\dfrac{x^2+y^2}{2xy}$ ($x>0$, $y>0$) and the curve passes through $(1,0)$ (as a limit). Find $y^2$ when $x=${c}$.`, sol: XR`<p>With $y=vx$ the equation becomes $\dfrac{2v\,dv}{1-v^2}=\dfrac{dx}x$, so $x^2-y^2=Cx$. The point $(1,0)$ gives $C=1$. So $y^2=x^2-x$. At $x=${c}$: $${c * c}-${c}=${c * c - c}$.</p>` };
  }, (p) => { const y = (x) => Math.sqrt(x * x - x); const ok = xab(xd(y, p.c) - (p.c * p.c + y(p.c) ** 2) / (2 * p.c * y(p.c))) < 1e-6; return ok ? Math.round(y(p.c) ** 2) : -1; }),
  GX('xg04', 3, 'mcq', 'single', 'integrating factors', (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 1, 4);
    const { options, answer } = shuffleOpts(rng, `$x^{${a}}$`, [`$e^{${a}x}$`, `$x^{-${a}}$`, `$${a}\\ln x$`]);
    return { a, b, options, answer, q: XR`The integrating factor of $\dfrac{dy}{dx}+\dfrac{${a}}xy=x^{${b}}$ ($x>0$) is`, sol: XR`<p>IF $=e^{\int ${a}/x\,dx}=e^{${a}\ln x}=x^{${a}}$.</p>` };
  }, (p) => { const IF = (x) => x ** p.a; return xab(xd(IF, 1.7) / IF(1.7) - p.a / 1.7) < 1e-6 ? p.answer : -1; }),
  GX('xg05', 4, 'nat', 'numeric', 'mixing problems', (rng) => {
    const V = choose(rng, [100, 200, 250]), r = choose(rng, [5, 10]), S0 = choose(rng, [10, 20, 40]), t = choose(rng, [10, 20, 30, 40]);
    const ans = S0 * Math.exp(-r * t / V);
    return { V, r, S0, t, answer: +ans.toFixed(3), tol: 0.01, q: XR`A $${V}$ litre tank holds $${S0}$ kg of salt. Pure water enters at $${r}$ litres/min and the well-stirred mixture leaves at $${r}$ litres/min. How much salt (kg) remains after $${t}$ minutes? (2 decimal places)`, sol: XR`<p>$\dfrac{dS}{dt}=-\dfrac{${r}}{${V}}S$, so $S=${S0}e^{-${r}t/${V}}$. At $t=${t}$: $${S0}e^{-${r * t / V}}=${ans.toFixed(2)}$ kg.</p>` };
  }, (p) => rk4((t, S) => -p.r / p.V * S, 0, p.S0, p.t, 4000)),
  GX('xg06', 4, 'nat', 'numeric', 'Newton cooling', (rng) => {
    const Ts = choose(rng, [20, 25, 30]), T0 = choose(rng, [90, 95, 100]), T1 = choose(rng, [60, 65, 70]), t1 = choose(rng, [5, 10]), t2 = choose(rng, [15, 20, 25].filter((v) => v !== 2 * t1));
    const ans = Ts + (T0 - Ts) * ((T1 - Ts) / (T0 - Ts)) ** (t2 / t1);
    return { Ts, T0, T1, t1, t2, answer: +ans.toFixed(3), tol: 0.01, q: XR`A body at $${T0}^\circ$C is placed in a room at $${Ts}^\circ$C. By Newton's law of cooling it is at $${T1}^\circ$C after $${t1}$ minutes. Find its temperature after $${t2}$ minutes (2 decimal places).`, sol: XR`<p>$T-${Ts}=${T0 - Ts}e^{-kt}$. At $t=${t1}$: $e^{-k${t1}}=\dfrac{${T1 - Ts}}{${T0 - Ts}}$. At $t=${t2}$: $T=${Ts}+${T0 - Ts}\left(\dfrac{${T1 - Ts}}{${T0 - Ts}}\right)^{${t2}/${t1}}=${ans.toFixed(2)}^\circ$C.</p>` };
  }, (p) => { const k = -Math.log((p.T1 - p.Ts) / (p.T0 - p.Ts)) / p.t1; return rk4((t, T) => -k * (T - p.Ts), 0, p.T0, p.t2, 4000); }),
  GX('xg07', 5, 'nat', 'numeric', 'growth and decay', (rng) => {
    const K = int(rng, 4, 10), y0 = 1;
    const ans = Math.log((K - y0) / y0);
    return { K, answer: +ans.toFixed(3), tol: 0.01, q: XR`$\dfrac{dy}{dt}=y\left(1-\dfrac yK\right)$ with $K=${K}$ and $y(0)=1$. At what time does $y$ reach $\dfrac K2$? (2 decimal places)`, sol: XR`<p>Logistic solution: $y=\dfrac{${K}}{1+${K - 1}e^{-t}}$. $y=\dfrac{${K}}2$ means $1+${K - 1}e^{-t}=2$, $e^{-t}=\dfrac1{${K - 1}}$, $t=\ln${K - 1}=${ans.toFixed(2)}$.</p>` };
  }, (p) => rk4Time((t, y) => y * (1 - y / p.K), 1, p.K / 2)),
  GX('xg08', 5, 'mcq', 'single', 'orthogonal trajectories', (rng) => {
    const n = int(rng, 2, 5);
    const { options, answer } = shuffleOpts(rng, `$x^2+${n}y^2=k$`, [`$${n}x^2+y^2=k$`, `$x^2-${n}y^2=k$`, `$x^2+y^2=k$`]);
    return { n, options, answer, q: XR`The orthogonal trajectories of the family $y=cx^{${n}}$ are`, sol: XR`<p>$y'=${n}cx^{${n - 1}}=\dfrac{${n}y}x$. Orthogonal: $y'=-\dfrac{x}{${n}y}$, so $${n}y\,dy=-x\,dx$ and $x^2+${n}y^2=k$.</p>` };
  }, (p) => { const slopeFam = p.n; const k = 1 + p.n; const slopeOrth = -1 / (p.n * 1); return Math.abs(slopeFam * slopeOrth + 1) < 1e-9 && Math.abs(1 + p.n - k) < 1e-9 ? p.answer : -1; }),
  GX('xg09', 4, 'nat', 'integer', 'initial value problems', (rng) => {
    const pp = int(rng, 1, 3), qq = -int(rng, 1, 3), A = int(rng, 1, 4), B = int(rng, 1, 4);
    const s = A + B, t = pp * A + qq * B;
    return { pp, qq, A, B, answer: A, tol: 0, q: XR`$y=Ae^{${pp}x}+Be^{${qq}x}$ satisfies a second-order equation. If $y(0)=${s}$ and $y'(0)=${t}$, find $A$.`, sol: XR`<p>$y(0)=A+B=${s}$. $y'(0)=${pp}A${qq}B=${t}$. From the first, $B=${s}-A$: $${pp}A${qq}(${s}-A)=${t}$ gives $${pp - qq}A=${t - qq * s}$, so $A=${A}$.</p>` };
  }, (p) => { const y = (x) => p.A * Math.exp(p.pp * x) + p.B * Math.exp(p.qq * x); const A = (xd(y, 0) - p.qq * y(0)) / (p.pp - p.qq); return Math.round(A); }),
  GX('xg10', 3, 'nat', 'integer', 'arbitrary constants', (rng) => {
    const cases = [
      ['all circles with centre on the $x$-axis', 2], ['all circles through the origin', 2], ['all circles in the plane', 3], ['all straight lines in the plane that do not pass through the origin', 2],
      ['all parabolas with axis parallel to the $y$-axis', 3], ['all circles of a fixed radius $r$ with centre anywhere', 2], ['all circles touching the $x$-axis', 2], ['all parabolas with vertex at the origin and axis along the $x$-axis', 1],
    ];
    const c = choose(rng, cases);
    return { which: c[0], answer: c[1], tol: 0, q: XR`The differential equation of the family of ${c[0]} has order`, sol: XR`<p>The order equals the number of independent arbitrary constants in the family. For ${c[0]} there are $${c[1]}$ independent constants, so the order is $${c[1]}$.</p>` };
  }, (p) => { const key = { 'all circles with centre on the $x$-axis': ['a', 'r'], 'all circles through the origin': ['g', 'f'], 'all circles in the plane': ['g', 'f', 'c'], 'all straight lines in the plane that do not pass through the origin': ['m', 'c'], 'all parabolas with axis parallel to the $y$-axis': ['a', 'b', 'c'], 'all circles of a fixed radius $r$ with centre anywhere': ['h', 'k'], 'all circles touching the $x$-axis': ['h', 'k'], 'all parabolas with vertex at the origin and axis along the $x$-axis': ['a'] }; return key[p.which].length; }),
);
XIT.push(
  X(4, 'variable separable', XR`Which of these equations are variable separable?`, [XR`$\dfrac{dy}{dx}=x^2y$`, XR`$\dfrac{dy}{dx}=x+y$`, XR`$\dfrac{dy}{dx}=(1+y^2)(1+x)$`, XR`$\dfrac{dy}{dx}=\sin(x+y)$`], [0, 2],
    XR`<p>Separable means the right side factors as $g(x)h(y)$. A: $x^2\cdot y$ yes. B: a sum, no. C: $(1+x)\cdot(1+y^2)$ yes. D: $\sin(x+y)$ does not factor into a function of $x$ times a function of $y$, no.</p>`, 'A sum of an x-part and a y-part is not separable.'),
);

Object.assign(groups, XG); items.push(...XIT); gens.push(...XGN);
}
// ==XP-END
// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'differential-equations', groups, items, gens }, ['de-g06', 'de-g14', 'de-g16', 'de-g17', 'de-g18', 'de-g22', 'de-xg01', 'de-xg02', 'de-xg09', 'de-g15', 'de-g21'], [], ['de-g22', 'de-xg09']);
