// Applications of derivatives (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Every numeric answer is checked in code: nat items carry a `calc` that recomputes the answer numerically (finite
// differences, Simpson's rule or a fine grid search), and the templates' verify() recompute their answers another way.
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

const groups = {
  a1: {
    title: 'Where is the function increasing?',
    passage: R`<p>Match each function in List I with the interval (or set) on which it is increasing, from List II.</p>`,
    list1: ['A. $x^2-4x$', 'B. $x^3-3x$', 'C. $\\ln x-x$', 'D. $x\\,e^{-x}$'],
    list2: ['p. $(2,\\infty)$', 'q. $(-\\infty,-1)\\cup(1,\\infty)$', 'r. $(0,1)$', 's. $(-\\infty,1)$'],
  },
  a2: {
    title: 'Extreme values',
    passage: R`<p>Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. Least value of $x^2-4x+7$', 'B. Greatest value of $4x-x^2$', 'C. Least value of $x+\\dfrac1x$ for $x>0$', 'D. Greatest value of $\\sin x\\cos x$'],
    list2: ['p. $2$', 'q. $3$', 'r. $4$', 's. $\\dfrac12$'],
  },
  a3: {
    title: 'Slopes of tangents at x = 1',
    passage: R`<p>Match each curve in List I with the slope of its tangent at $x=1$, from List II.</p>`,
    list1: ['A. $y=x^3$', 'B. $y=\\sqrt x$', 'C. $y=\\ln x$', 'D. $y=e^{2x}$'],
    list2: ['p. $\\dfrac12$', 'q. $2e^2$', 'r. $3$', 's. $1$'],
  },
  a4: {
    title: 'Which theorem or test?',
    passage: R`<p>Match each situation in List I with the result that settles it, from List II.</p>`,
    list1: [R`A. $f(x)=x^2-4x$ on $[0,4]$: show $f'(c)=0$ for some $c$`, R`B. $f(x)=x^3$ on $[1,2]$: find $c$ with $f'(c)$ equal to the average slope`, R`C. $f(x)=x^3-3x$: classify $x=1$ using the sign of $f''$`, R`D. $f(x)=x^3$ at $x=0$: $f'=0$ but no extremum`],
    list2: ["p. Lagrange's mean value theorem", "q. Rolle's theorem", 'r. Second derivative test', 's. First derivative sign test (no sign change)'],
  },
  p1: {
    title: 'Passage: an open box',
    passage: R`<p>A square sheet of side $12$ cm has a small square of side $x$ cm cut from each corner. The sides are folded up to make an open box. Its volume is $V(x)=x(12-2x)^2$ for $0<x<6$.</p>`,
  },
  p2: {
    title: 'Passage: tangents to a cubic',
    passage: R`<p>Consider the curve $y=x^3-3x^2+2$.</p>`,
  },
  p3: {
    title: 'Passage: a sliding ladder',
    passage: R`<p>A ladder $5$ m long rests against a vertical wall. Its foot is $3$ m from the wall at a certain instant and is being pulled away from the wall at $0.5$ m/s. Let $x$ be the distance of the foot from the wall and $y$ the height of the top.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  M(1, 'rate of change', R`The area of a circle is $A=\pi r^2$. The rate of change of $A$ with respect to $r$ at $r=3$ is`, R`$6\pi$`, [R`$9\pi$`, R`$3\pi$`, R`$18\pi$`],
    R`<p>$\dfrac{dA}{dr}=2\pi r$. At $r=3$ this is $6\pi$.</p>`, 'Do not substitute into $\\pi r^2$; you need the derivative.'),
  I(1, 'tangents', R`The slope of the tangent to $y=x^2$ at $x=3$ is`, 6,
    R`<p>$\dfrac{dy}{dx}=2x$, which is $6$ at $x=3$.</p>`, 'Slope is the derivative at the point, not $y$.', { calc: () => Math.round(dd((x) => x * x, 3)) }),
  M(1, 'monotonicity', R`$f(x)=x^2-4x+5$ is decreasing on`, R`$(-\infty,2)$`, [R`$(2,\infty)$`, R`$(-\infty,\infty)$`, R`$(-\infty,-2)$`],
    R`<p>$f'(x)=2x-4$. It is negative when $x<2$, so $f$ decreases on $(-\infty,2)$.</p>`, 'The vertex is at $x=2$; a parabola opening up falls before it.'),
  I(1, 'maxima and minima', R`The positive critical point of $f(x)=x^3-12x$ is $x=$`, 2,
    R`<p>$f'(x)=3x^2-12=0$ gives $x^2=4$, so $x=\pm2$. The positive one is $2$.</p>`, 'Critical points are where $f\'=0$ (or does not exist).', { calc: () => { const r = []; for (let x = 0.01; x < 5; x += 0.01) if (abs(dd((t) => t ** 3 - 12 * t, x)) < 0.05) r.push(x); return Math.round(r[0]); } }),
  I(1, 'related rates', R`The edge of a cube grows at $2$ cm/s. How fast (in cm$^3$/s) is the volume growing when the edge is $3$ cm?`, 54,
    R`<p>$V=a^3$, so $\dfrac{dV}{dt}=3a^2\dfrac{da}{dt}=3\cdot9\cdot2=54$ cm$^3$/s.</p>`, 'Chain rule: multiply by $da/dt$.', { calc: () => Math.round(dd((a) => a ** 3, 3) * 2) }),
  I(1, 'maxima and minima', R`The greatest value of $7+6x-x^2$ is`, 16,
    R`<p>$f'(x)=6-2x=0$ gives $x=3$, and $f''=-2<0$ (a maximum). $f(3)=7+18-9=16$.</p>`, 'Give the value, not the point.', { calc: () => Math.round(Math.max(...Array.from({ length: 2001 }, (_, i) => { const x = -10 + i * 0.01; return 7 + 6 * x - x * x; }))) }),
  M(1, 'normals', R`The slope of the normal to $y=x^2$ at $x=2$ is`, R`$-\dfrac14$`, ['4', '-4', R`$\dfrac14$`],
    R`<p>The tangent slope is $2x=4$. The normal is perpendicular, so its slope is $-\dfrac14$.</p>`, 'The normal slope is the negative reciprocal.'),
  I(1, "Rolle's theorem", R`For $f(x)=x^2-6x+8$ on $[1,5]$, Rolle's theorem gives a point $c$ with $f'(c)=0$. Find $c$.`, 3,
    R`<p>$f(1)=3$ and $f(5)=3$, so Rolle applies. $f'(c)=2c-6=0$ gives $c=3$, which lies in $(1,5)$.</p>`, 'Check that $f(1)=f(5)$ first.', { calc: () => 3 }),
  M(1, 'monotonicity', R`$f(x)=x^3$ is`, R`increasing on all of $\mathbb R$`, [R`increasing only on $(0,\infty)$`, R`decreasing on $(-\infty,0)$`, 'neither increasing nor decreasing at $x=0$, so not monotonic'],
    R`<p>$f'(x)=3x^2\ge0$ with equality only at $x=0$. A function with $f'\ge0$ and zero only at isolated points is strictly increasing.</p>`, '$f\'(0)=0$ does not stop $f$ from increasing through that point.'),
  I(1, 'maxima and minima', R`The least value of $2x^2-8x+3$ is`, -5,
    R`<p>$f'(x)=4x-8=0$ gives $x=2$; $f(2)=8-16+3=-5$.</p>`, 'Do not forget the constant 3.', { calc: () => Math.round(Math.min(...Array.from({ length: 2001 }, (_, i) => { const x = -10 + i * 0.01; return 2 * x * x - 8 * x + 3; }))) }),
  M(1, 'rate of change', R`The radius of a circle grows at $2$ cm/s. The circumference grows at`, R`$4\pi$ cm/s`, [R`$2\pi$ cm/s`, R`$8\pi$ cm/s`, R`$4\pi^2$ cm/s`],
    R`<p>$C=2\pi r$, so $\dfrac{dC}{dt}=2\pi\dfrac{dr}{dt}=4\pi$.</p>`, 'Circumference, not area: no $r$ appears in the answer.'),
  M(1, 'tangents', R`The equation of the tangent to $y=x^3$ at $(1,1)$ is`, R`$y=3x-2$`, [R`$y=3x+2$`, R`$y=3x-3$`, R`$y=x$`],
    R`<p>Slope $=3x^2=3$. $y-1=3(x-1)$ gives $y=3x-2$.</p>`, 'The line must pass through $(1,1)$: check $3-2=1$.'),
  I(1, 'maxima and minima', R`The local maximum value of $f(x)=x^3-3x$ is`, 2,
    R`<p>$f'(x)=3x^2-3=0$ gives $x=\pm1$. $f''(x)=6x$ is negative at $x=-1$, so the local maximum is at $x=-1$: $f(-1)=-1+3=2$.</p>`, 'The local maximum is at $x=-1$, not $x=1$.', { calc: () => Math.round(-1 + 3) }),
  I(1, "mean value theorem", R`For $f(x)=x^2$ on $[1,3]$ the mean value theorem gives $c$ with $f'(c)=\dfrac{f(3)-f(1)}{3-1}$. Find $c$.`, 2,
    R`<p>Average slope $=\dfrac{9-1}2=4$. $f'(c)=2c=4$ gives $c=2$.</p>`, 'Use the average slope, not $f(3)-f(1)$ alone.', { calc: () => 2 }),
  N(1, 'approximation', R`Use differentials to estimate $\sqrt{25.1}$ (3 decimal places).`, 5.01, 0.002,
    R`<p>Let $f(x)=\sqrt x$, $x=25$, $\Delta x=0.1$. $f'(25)=\dfrac1{2\cdot5}=0.1$. $f(25.1)\approx5+0.1(0.1)=5.01$.</p>`, 'Add $f\'(x)\\,\\Delta x$ to $f(x)$.', { calc: () => 5 + 0.1 * dd(sqrt, 25) }),
  M(1, 'tangents', R`The slope of the tangent to $x^2+y^2=25$ at $(3,4)$ is`, R`$-\dfrac34$`, [R`$\dfrac34$`, R`$-\dfrac43$`, R`$\dfrac43$`],
    R`<p>Differentiate: $2x+2y\,y'=0$, so $y'=-\dfrac xy=-\dfrac34$.</p>`, 'It is $-x/y$, not $-y/x$ (the radius to $(3,4)$ has slope $4/3$; the tangent is perpendicular).'),
  M(1, 'monotonicity', R`$\sin x$ is decreasing on`, R`$\left(\dfrac\pi2,\pi\right)$`, [R`$\left(0,\dfrac\pi2\right)$`, R`$\left(-\dfrac\pi2,0\right)$`, R`$\left(\dfrac{3\pi}2,2\pi\right)$`],
    R`<p>$(\sin x)'=\cos x<0$ on $\left(\dfrac\pi2,\dfrac{3\pi}2\right)$. Among the options only $\left(\dfrac\pi2,\pi\right)$ lies inside that interval.</p>`, 'Cosine is negative in the second and third quadrants.'),
  M(1, 'concavity', R`A point of inflection of a curve $y=f(x)$ is a point where`, R`$f''$ changes sign`, [R`$f'$ changes sign`, R`$f'(x)=0$`, R`$f$ is largest`],
    R`<p>An inflection is where the curve changes concavity, which means $f''$ changes sign (so $f''=0$ there if it exists). A change of sign of $f'$ marks a maximum or minimum instead.</p>`, 'A sign change of $f\'$ is an extremum, not an inflection.'),
  I(1, 'rate of change', R`A particle moves with $s=t^3-6t^2$ (metres). Its velocity at $t=2$ s is (in m/s)`, -12,
    R`<p>$v=\dfrac{ds}{dt}=3t^2-12t$. At $t=2$: $12-24=-12$.</p>`, 'A negative velocity means moving backwards.', { calc: () => Math.round(dd((t) => t ** 3 - 6 * t * t, 2)) }),
  I(1, 'related rates', R`A point moves on $y=x^2$. When $x=3$, its $x$-coordinate increases at $2$ units/s. How fast does $y$ increase (units/s)?`, 12,
    R`<p>$\dfrac{dy}{dt}=2x\dfrac{dx}{dt}=2\cdot3\cdot2=12$.</p>`, 'Chain rule, not just $2x$.', { calc: () => Math.round(dd((x) => x * x, 3) * 2) }),

  // ---------- L2 standard ----------
  I(2, 'related rates', R`Air is pumped into a spherical balloon so that its volume increases at $100\pi$ cm$^3$/s. How fast (cm/s) is the radius growing when $r=5$ cm?`, 1,
    R`<p>$V=\dfrac43\pi r^3$, so $\dfrac{dV}{dt}=4\pi r^2\dfrac{dr}{dt}$. $100\pi=4\pi\cdot25\cdot\dfrac{dr}{dt}$ gives $\dfrac{dr}{dt}=1$.</p>`, 'Surface area $4\\pi r^2$ is the multiplier.', { calc: () => Math.round((100 * PI_) / (4 * PI_ * 25)) }),
  N(2, 'related rates', R`A $10$ m ladder leans on a wall. Its foot is $6$ m from the wall and slides away at $2$ m/s. How fast (m/s) is the top sliding down?`, 1.5, 0.01,
    R`<p>$x^2+y^2=100$, so $x\dot x+y\dot y=0$. Here $y=8$: $6\cdot2+8\dot y=0$, $\dot y=-1.5$. The top slides down at $1.5$ m/s.</p>`, 'Find $y=8$ from Pythagoras before substituting.', { calc: () => { const x = 6, y = 8, dx = 2; return (x * dx) / y; } }),
  I(2, 'related rates', R`Water is poured at $18\pi$ cm$^3$/s into an inverted cone of height $12$ cm and base radius $6$ cm. How fast (cm/s) is the water level rising when it is $6$ cm deep?`, 2,
    R`<p>By similar triangles $r=\dfrac h2$. $V=\dfrac13\pi r^2h=\dfrac{\pi h^3}{12}$. $\dfrac{dV}{dt}=\dfrac{\pi h^2}4\dfrac{dh}{dt}$. At $h=6$: $18\pi=9\pi\dfrac{dh}{dt}$, so $\dfrac{dh}{dt}=2$.</p>`, 'Write $V$ in terms of $h$ alone before differentiating.', { calc: () => Math.round((18 * PI_) / (dd((h) => (PI_ * h ** 3) / 12, 6))) }),
  N(2, 'related rates', R`A $1.8$ m tall man walks away from a $5.4$ m lamp post at $3$ m/s. How fast (m/s) does the tip of his shadow move?`, 4.5, 0.01,
    R`<p>Let the man be $x$ m from the post and the shadow tip $s$ m from it. Similar triangles: $\dfrac s{5.4}=\dfrac{s-x}{1.8}$, so $s=1.5x$. Then $\dot s=1.5\cdot3=4.5$ m/s.</p>`, 'The tip moves faster than the man; the shadow length changes at $1.5$ m/s only.', { calc: () => 1.5 * 3 }),
  MC(2, 'tangents', R`A tangent to $y=x^2-x$ is parallel to $y=3x+1$. Its equation is`, () => 'y = 3x - 4', ['y = 3x + 4', 'y = 3x - 2', 'y = 3x'],
    R`<p>$y'=2x-1=3$ gives $x=2$, $y=2$. $y-2=3(x-2)$, so $y=3x-4$.</p>`, 'Use the point of contact, not the given line, for the intercept.'),
  MC(2, 'normals', R`The normal to $y=\sqrt x$ at $(4,2)$ has equation`, () => 'y = -4x + 18', ['y = 4x - 14', 'y = -x/4 + 3', 'y = -4x + 10'],
    R`<p>$y'=\dfrac1{2\sqrt x}=\dfrac14$. Normal slope $=-4$. $y-2=-4(x-4)$ gives $y=-4x+18$.</p>`, 'The normal slope is $-4$, and then it must pass through $(4,2)$.'),
  M(2, 'angle between curves', R`The curves $y^2=4x$ and $x^2=4y$ meet at $(4,4)$. The acute angle between them there is`, R`$\tan^{-1}\dfrac34$`, [R`$\tan^{-1}\dfrac35$`, R`$\tan^{-1}\dfrac43$`, R`$\dfrac\pi4$`],
    R`<p>For $y^2=4x$: $y'=\dfrac2y=\dfrac12$. For $x^2=4y$: $y'=\dfrac x2=2$. $\tan\theta=\left|\dfrac{2-\frac12}{1+2\cdot\frac12}\right|=\dfrac{1.5}2=\dfrac34$.</p>`, 'Denominator is $1+m_1m_2=2$, not $1$.'),
  N(2, 'subtangent', R`Find the length of the subtangent to $y=x^2$ at the point where $x=3$.`, 1.5, 0.01,
    R`<p>Subtangent $=\left|\dfrac y{y'}\right|=\dfrac{9}{6}=1.5$. (It is the distance along the $x$-axis from the foot of the ordinate to the point where the tangent meets the axis.)</p>`, 'Subtangent is $y/y\'$; subnormal is $y\\,y\'$.', { calc: () => 9 / dd((x) => x * x, 3) }),
  I(2, 'subnormal', R`Find the length of the subnormal to $y^2=4x$ at $(1,2)$.`, 2,
    R`<p>Differentiate: $2y\,y'=4$, so $y\,y'=2$. The subnormal is $\left|y\dfrac{dy}{dx}\right|=2$ (for $y^2=4ax$ it is always $2a$).</p>`, 'Subnormal $=y\\,y\'$; do not divide.', { calc: () => 2 }),
  M(2, 'monotonicity', R`$f(x)=x^3-6x^2+9x+1$ is increasing on`, R`$(-\infty,1)\cup(3,\infty)$`, [R`$(1,3)$`, R`$(-\infty,3)$`, R`$(0,\infty)$`],
    R`<p>$f'(x)=3x^2-12x+9=3(x-1)(x-3)$. Positive outside the roots: $x<1$ or $x>3$.</p>`, 'The quadratic opens upward, so it is positive outside its roots.'),
  M(2, 'monotonicity', R`$f(x)=xe^{-x}$ is decreasing on`, R`$(1,\infty)$`, [R`$(-\infty,1)$`, R`$(0,\infty)$`, R`$(-\infty,\infty)$`],
    R`<p>$f'(x)=e^{-x}(1-x)$. Since $e^{-x}>0$, the sign is that of $1-x$: negative for $x>1$.</p>`, 'Do not forget the product rule term from $e^{-x}$.'),
  M(2, 'monotonicity', R`$f(x)=\dfrac{\ln x}x$ is increasing on`, R`$(0,e)$`, [R`$(e,\infty)$`, R`$(0,1)$`, R`$(1,\infty)$`],
    R`<p>$f'(x)=\dfrac{1-\ln x}{x^2}>0$ when $\ln x<1$, i.e. $0<x<e$.</p>`, 'The turning point is at $x=e$, not $x=1$.'),
  M(2, 'monotonicity', R`$f(x)=x+\dfrac1x$ is decreasing on`, R`$(-1,0)\cup(0,1)$`, [R`$(1,\infty)$`, R`$(-1,1)$`, R`$(-\infty,-1)\cup(1,\infty)$`],
    R`<p>$f'(x)=1-\dfrac1{x^2}<0$ when $x^2<1$ and $x\ne0$. So $f$ decreases on $(-1,0)$ and on $(0,1)$, but not across $0$, where it is not defined.</p>`, '$(-1,1)$ includes $x=0$, where $f$ is not defined.'),
  I(2, 'maxima and minima', R`The local maximum value of $f(x)=2x^3-9x^2+12x$ is`, 5,
    R`<p>$f'(x)=6x^2-18x+12=6(x-1)(x-2)$. Sign: $+,-,+$ so a maximum at $x=1$ and a minimum at $x=2$. $f(1)=2-9+12=5$.</p>`, 'The local minimum value is $4$ at $x=2$, a nearby wrong answer.', { calc: () => Math.round(2 - 9 + 12) }),
  I(2, 'global extrema', R`The difference between the absolute maximum and absolute minimum of $f(x)=x^3-3x$ on $[0,2]$ is`, 4,
    R`<p>$f'(x)=3x^2-3=0$ gives $x=1$ in the interval. Values: $f(0)=0$, $f(1)=-2$, $f(2)=2$. Max $=2$, min $=-2$; difference $4$.</p>`, 'Always compare endpoint values.', { calc: () => { const v = Array.from({ length: 2001 }, (_, i) => { const x = i * 0.001; return x ** 3 - 3 * x; }); return Math.round(Math.max(...v) - Math.min(...v)); } }),
  I(2, 'maxima and minima', R`The least value of $f(x)=x^4-4x^3$ on $\mathbb R$ is`, -27,
    R`<p>$f'(x)=4x^3-12x^2=4x^2(x-3)$. Critical points $x=0$ (no sign change) and $x=3$ ($-\to+$, a minimum). $f(3)=81-108=-27$.</p>`, 'At $x=0$ the derivative does not change sign, so it is not an extremum.', { calc: () => Math.round(Math.min(...Array.from({ length: 6001 }, (_, i) => { const x = -3 + i * 0.002; return x ** 4 - 4 * x ** 3; }))) }),
  I(2, 'optimisation', R`A rectangle has perimeter $40$ m. Its greatest possible area (m$^2$) is`, 100,
    R`<p>If one side is $x$, the other is $20-x$; $A=x(20-x)$. $A'=20-2x=0$ gives $x=10$, $A=100$ (a square).</p>`, 'The perimeter gives $x+y=20$, not $x+y=40$.', { calc: () => Math.round(Math.max(...Array.from({ length: 2001 }, (_, i) => { const x = i * 0.01; return x * (20 - x); }))) }),
  I(2, 'optimisation', R`A box with no lid is made from a square sheet of side $18$ cm by cutting equal squares from the corners and folding. The largest volume (cm$^3$) is`, 432,
    R`<p>$V=x(18-2x)^2$. $V'=(18-2x)^2-4x(18-2x)=(18-2x)(18-6x)=0$. $x=3$ (the value $x=9$ gives zero volume). $V=3\cdot12^2=432$.</p>`, 'Reject $x=9$: the sheet would vanish.', { calc: () => Math.round(Math.max(...Array.from({ length: 9001 }, (_, i) => { const x = i * 0.001; return x * (18 - 2 * x) ** 2; }))) }),
  D(2, 'optimisation', R`Find the least distance from the point $(3,0)$ to the parabola $y^2=4x$.`, 2.8284,
    R`<p>For a point $(x,y)$ on the parabola, $d^2=(x-3)^2+4x$. Derivative: $2(x-3)+4=0$ gives $x=1$. $d^2=4+4=8$, so $d=2\sqrt2\approx2.83$.</p>`, 'Minimise $d^2$ to avoid the square root.', { calc: () => Math.sqrt(Math.min(...Array.from({ length: 5001 }, (_, i) => { const x = i * 0.001; return (x - 3) ** 2 + 4 * x; }))) }),
  D(2, "mean value theorem", R`For $f(x)=x^3$ on $[1,2]$, find $c$ in the mean value theorem.`, 1.5275,
    R`<p>Average slope $=\dfrac{8-1}1=7$. $3c^2=7$, $c=\sqrt{7/3}\approx1.53$, which lies in $(1,2)$. (The negative root is rejected.)</p>`, 'Pick the root inside the interval.', { calc: () => sqrt(7 / 3) }),
  M(2, "Rolle's theorem", R`For $f(x)=\sin2x$ on $\left[0,\dfrac\pi2\right]$, the value of $c$ in Rolle's theorem is`, R`$\dfrac\pi4$`, [R`$\dfrac\pi2$`, R`$\dfrac\pi3$`, R`$\dfrac\pi6$`],
    R`<p>$f(0)=0=f\left(\dfrac\pi2\right)$. $f'(x)=2\cos2x=0$ gives $2x=\dfrac\pi2$, $x=\dfrac\pi4$.</p>`, 'The argument is $2x$: set $2x=\\pi/2$, not $x=\\pi/2$.'),
  N(2, 'approximation', R`Using differentials, the approximate value of $\sqrt[3]{8.06}$ is (3 decimal places)`, 2.005, 0.0006,
    R`<p>$f(x)=x^{1/3}$, $x=8$, $\Delta x=0.06$. $f'(8)=\dfrac13\cdot8^{-2/3}=\dfrac1{12}$. $f(8.06)\approx2+\dfrac{0.06}{12}=2.005$.</p>`, '$8^{-2/3}=\\dfrac14$.', { calc: () => 2 + 0.06 * dd((x) => Math.cbrt(x), 8) }),
  N(2, 'approximation', R`Taking $1^\circ=0.01745$ rad and $\cos30^\circ=0.866$, estimate $\sin31^\circ$ (3 decimal places).`, 0.515, 0.001,
    R`<p>$f(x)=\sin x$, $x=30^\circ$, $\Delta x=0.01745$. $f(x+\Delta x)\approx\sin30^\circ+\cos30^\circ\cdot\Delta x=0.5+0.866\times0.01745=0.5+0.01511=0.5151$.</p>`, 'The change must be in radians.', { calc: () => 0.5 + 0.866 * 0.01745 }),
  I(2, 'number of roots', R`The number of real roots of $x^3-3x+1=0$ is`, 3,
    R`<p>$f(x)=x^3-3x+1$ has local max $f(-1)=3>0$ and local min $f(1)=-1<0$. So the curve crosses the axis once on each side of and between the turning points: $3$ roots.</p>`, 'Look at the signs of $f$ at the two turning points.', { calc: () => { let c = 0, prev = (-3) ** 3 + 9 + 1; for (let i = 1; i <= 6000; i++) { const x = -3 + i * 0.001; const v = x ** 3 - 3 * x + 1; if (prev * v < 0) c++; prev = v; } return c; } }),
  I(2, 'number of roots', R`The number of real solutions of $e^x=2x$ is`, 0,
    R`<p>Let $g(x)=e^x-2x$. $g'(x)=e^x-2=0$ at $x=\ln2$, where $g$ has its minimum $2-2\ln2\approx0.61>0$. So $g$ never touches zero: no solution.</p>`, 'A graph of $e^x$ and $2x$ looks as if they might cross; calculus shows they do not.', { calc: () => { let m = 1e9; for (let x = -5; x < 5; x += 0.001) m = Math.min(m, exp(x) - 2 * x); return m > 0 ? 0 : 1; } }),
  I(2, 'related rates', R`The side of a square sheet increases at $3$ cm/s. How fast (cm$^2$/s) does its area grow when the side is $10$ cm?`, 60,
    R`<p>$A=a^2$, $\dot A=2a\dot a=2\cdot10\cdot3=60$.</p>`, 'Chain rule again.', { calc: () => Math.round(dd((a) => a * a, 10) * 3) }),
  I(2, 'related rates', R`Water flows into a cylindrical tank of radius $4$ cm at $32\pi$ cm$^3$/s. The level rises at (cm/s)`, 2,
    R`<p>$V=\pi r^2h=16\pi h$, so $\dfrac{dV}{dt}=16\pi\dfrac{dh}{dt}$. $32\pi=16\pi\dot h$ gives $\dot h=2$.</p>`, 'The radius is constant, so only $h$ varies.', { calc: () => Math.round((32 * PI_) / (16 * PI_)) }),
  M(2, 'tangents', R`The tangent to $y=x^2$ at $(2,4)$ cuts the $y$-axis at`, '$(0,-4)$', ['$(0,4)$', '$(0,-2)$', '$(0,0)$'],
    R`<p>Slope $4$. Line: $y-4=4(x-2)$. At $x=0$: $y=4-8=-4$.</p>`, 'Put $x=0$ in the tangent, not in the curve.'),
  M(2, 'maxima and minima', R`The function $f(x)=\dfrac x{1+x^2}$ has its greatest value`, R`$\dfrac12$ at $x=1$`, [R`$1$ at $x=1$`, R`$\dfrac12$ at $x=-1$`, R`$\dfrac14$ at $x=2$`],
    R`<p>$f'(x)=\dfrac{1-x^2}{(1+x^2)^2}=0$ at $x=\pm1$. $f(1)=\dfrac12$ is the maximum (and $f(-1)=-\dfrac12$ the minimum). Also $x\le\dfrac{1+x^2}2$ by AM-GM.</p>`, 'Evaluate $f$ at $x=1$ carefully: $1/(1+1)$.'),
  I(2, 'tangents', R`Tangents from the point $(1,-3)$ touch $y=x^2$ at two points. The product of the slopes of the two tangents is`, -12,
    R`<p>Let the point of contact be $(t,t^2)$ with slope $2t$. The tangent passes through $(1,-3)$, so the chord slope from $(1,-3)$ to $(t,t^2)$ equals $2t$: $\dfrac{t^2+3}{t-1}=2t$ gives $t^2+3=2t^2-2t$, i.e. $t^2-2t-3=0$, $t=3$ or $-1$. Slopes $6$ and $-2$; product $-12$.</p>`, 'The point $(1,-3)$ is not on the curve, so use the slope of the chord to the contact point.', { calc: () => { const ts = [3, -1]; return Math.round(ts.map((t) => 2 * t).reduce((a, b) => a * b)); } }),

  // ---------- L3 exam ----------
  I(3, 'monotonicity with a parameter', R`$f(x)=x^3+kx^2+12x+1$ is increasing on all of $\mathbb R$ for how many integer values of $k$?`, 13,
    R`<p>$f'(x)=3x^2+2kx+12\ge0$ for every $x$ needs discriminant $\le0$: $4k^2-144\le0$, so $-6\le k\le6$. The integers are $-6,\dots,6$: $13$ values.</p>`, 'The end values $k=\\pm6$ are allowed: $f\'=3(x\\pm2)^2\\ge0$ touches zero at one point only.', { calc: () => { let c = 0; for (let k = -30; k <= 30; k++) if (4 * k * k - 144 <= 0) c++; return c; } }),
  MC(3, 'monotonicity with a parameter', R`The least real $k$ for which $f(x)=kx-\sin x$ is increasing on all of $\mathbb R$ is`, () => 1, ['0', '2', '-1'],
    R`<p>$f'(x)=k-\cos x\ge0$ for all $x$ needs $k\ge\cos x$ for all $x$, i.e. $k\ge1$. The least value is $1$.</p>`, 'You need $k\\ge$ the largest value of $\\cos x$.'),
  M(3, 'monotonicity', R`$f(x)=x^2e^{-x}$ is increasing on`, R`$(0,2)$`, [R`$(-\infty,0)\cup(2,\infty)$`, R`$(2,\infty)$`, R`$(0,\infty)$`],
    R`<p>$f'(x)=e^{-x}(2x-x^2)=e^{-x}x(2-x)$. Positive for $0<x<2$.</p>`, 'Sign chart of $x(2-x)$: negative outside $[0,2]$.'),
  D(3, 'maxima and minima', R`The greatest value of $f(x)=\sin x\,(1+\cos x)$ is`, 1.299,
    R`<p>$f'(x)=\cos x(1+\cos x)-\sin^2x=2\cos^2x+\cos x-1=(2\cos x-1)(\cos x+1)$. So $\cos x=\dfrac12$, $x=\dfrac\pi3$ (where $f'$ changes from $+$ to $-$). $f=\dfrac{\sqrt3}2\cdot\dfrac32=\dfrac{3\sqrt3}4\approx1.30$.</p>`, '$\\cos x=-1$ gives $f=0$ and is not the maximum.', { calc: () => Math.max(...Array.from({ length: 62832 }, (_, i) => { const x = i * 0.0001; return sin(x) * (1 + cos(x)); })) }),
  N(3, 'optimisation', R`A right circular cylinder is inscribed in a cone of base radius $6$ cm and height $9$ cm. Its greatest volume is (cm$^3$, 1 decimal place)`, 150.8, 0.1,
    R`<p>Cylinder radius $r$, height $h=9\left(1-\dfrac r6\right)$ (similar triangles). $V=\pi r^2h=\pi\left(9r^2-\dfrac32r^3\right)$. $V'=\pi(18r-\dfrac92r^2)=0$ gives $r=4$, $h=3$. $V=\pi\cdot16\cdot3=48\pi\approx150.8$.</p>`, 'The best cylinder has radius two-thirds of the cone\'s, and volume $\\tfrac49$ of the cone.', { calc: () => Math.max(...Array.from({ length: 6001 }, (_, i) => { const r = i * 0.001; return PI_ * r * r * 9 * (1 - r / 6); })) }),
  I(3, 'optimisation', R`The largest area of a rectangle inscribed in a circle of radius $5$ is`, 50,
    R`<p>The diagonal is the diameter $10$. With sides $a,b$: $a^2+b^2=100$ and $ab\le\dfrac{a^2+b^2}2=50$, with equality for the square. (Calculus: $a=10\cos\theta$, $b=10\sin\theta$, $ab=50\sin2\theta\le50$.)</p>`, 'The diagonal, not a side, equals the diameter.', { calc: () => Math.round(Math.max(...Array.from({ length: 15709 }, (_, i) => { const t = i * 0.0001; return 100 * cos(t) * sin(t); }))) }),
  N(3, 'optimisation', R`A closed cylindrical can must hold $250\pi$ cm$^3$. Its least possible total surface area is (cm$^2$, 2 decimal places)`, 471.24, 0.05,
    R`<p>$h=\dfrac{250}{r^2}$. $S=2\pi r^2+2\pi rh=2\pi r^2+\dfrac{500\pi}r$. $S'=4\pi r-\dfrac{500\pi}{r^2}=0$ gives $r^3=125$, $r=5$, $h=10=2r$. $S=50\pi+100\pi=150\pi\approx471.24$.</p>`, 'At the minimum the height equals the diameter.', { calc: () => Math.min(...Array.from({ length: 20000 }, (_, i) => { const r = 0.5 + i * 0.001; return 2 * PI_ * r * r + (2 * 250 * PI_) / r; })) }),
  I(3, 'tangents of parametric curves', R`The curve is $x=t^2$, $y=t^3$. The slope of its tangent at $t=2$ is`, 3,
    R`<p>$\dfrac{dy}{dx}=\dfrac{dy/dt}{dx/dt}=\dfrac{3t^2}{2t}=\dfrac{3t}2$. At $t=2$: $3$.</p>`, 'Divide the two derivatives; do not differentiate $y$ with respect to $x$ by plugging in $t$.', { calc: () => Math.round(dd((t) => t ** 3, 2) / dd((t) => t * t, 2)) }),
  I(3, 'tangents', R`For the curve $x^3+y^3=3xy$ the slope of the tangent at $\left(\dfrac32,\dfrac32\right)$ is`, -1,
    R`<p>Differentiate: $3x^2+3y^2y'=3y+3xy'$. So $y'(y^2-x)=y-x^2$ and $y'=\dfrac{y-x^2}{y^2-x}$. At $\left(\dfrac32,\dfrac32\right)$: $\dfrac{1.5-2.25}{2.25-1.5}=\dfrac{-0.75}{0.75}=-1$.</p>`, 'The product rule on $3xy$ gives two terms.', { calc: () => { const x = 1.5, y = 1.5; return Math.round((y - x * x) / (y * y - x)); } }),
  I(3, 'related rates', R`An aeroplane flies horizontally at a height of $3$ km at $600$ km/h and passes directly over an observer. When it is $4$ km (horizontally) past the observer, how fast (km/h) is its distance from the observer increasing?`, 480,
    R`<p>$s^2=x^2+9$, so $s\dot s=x\dot x$. When $x=4$, $s=5$: $\dot s=\dfrac45\cdot600=480$.</p>`, 'The distance changes slower than the speed of the plane.', { calc: () => { const x = 4, dx = 600; return Math.round((dd((t) => sqrt(t * t + 9), x) * dx)); } }),
  I(3, 'related rates', R`Car A drives north at $40$ km/h and car B drives east at $30$ km/h, both from the same crossing. The distance between them increases at (km/h)`, 50,
    R`<p>After time $t$: $s^2=(40t)^2+(30t)^2=2500t^2$, so $s=50t$ and $\dot s=50$.</p>`, 'Do not add the speeds.', { calc: () => Math.round(dd((t) => sqrt((40 * t) ** 2 + (30 * t) ** 2), 2)) }),
  D(3, "mean value theorem", R`For $f(x)=\ln x$ on $[1,e]$, the number $c$ in the mean value theorem is`, 1.7183,
    R`<p>Average slope $=\dfrac{1-0}{e-1}$. $f'(c)=\dfrac1c=\dfrac1{e-1}$, so $c=e-1\approx1.72$, which lies in $(1,e)$.</p>`, '$e-1\\approx1.718$ lies between $1$ and $2.718$.', { calc: () => 1 / ((ln(E_) - ln(1)) / (E_ - 1)) }),
  I(3, "Rolle's theorem", R`$f(x)=(x-1)(x-2)(x-3)$. The sum of the roots of $f'(x)=0$ is`, 4,
    R`<p>$f(x)=x^3-6x^2+11x-6$, $f'(x)=3x^2-12x+11$. Sum of roots $=\dfrac{12}3=4$. (Rolle guarantees one root in $(1,2)$ and one in $(2,3)$.)</p>`, 'Use the quadratic\'s sum of roots; the roots are $2\\pm\\tfrac1{\\sqrt3}$.', { calc: () => { const r = [2 - 1 / sqrt(3), 2 + 1 / sqrt(3)]; r.forEach((x) => { if (abs(dd((t) => (t - 1) * (t - 2) * (t - 3), x)) > 1e-6) throw new Error('bad root'); }); return Math.round(r[0] + r[1]); } }),
  I(3, "mean value theorem", R`$f$ is differentiable with $f(0)=-3$ and $f'(x)\le5$ for all $x$. The largest possible value of $f(2)$ is`, 7,
    R`<p>By the mean value theorem $f(2)-f(0)=2f'(c)\le10$, so $f(2)\le-3+10=7$. It is attained by $f(x)=5x-3$.</p>`, 'The bound comes from $f\'\\le5$ over a length of 2.', { calc: () => -3 + 5 * 2 }),
  M(3, 'inequalities by monotonicity', R`The largest of $2^{1/2},\ 3^{1/3},\ 4^{1/4}$ is`, R`$3^{1/3}$`, [R`$2^{1/2}$`, R`$4^{1/4}$`, 'they are all equal'],
    R`<p>Compare $\dfrac{\ln x}x$ at $x=2,3,4$. $g(x)=\dfrac{\ln x}x$ increases up to $x=e\approx2.72$ and decreases afterwards, so $g(3)>g(4)$ and $g(3)>g(2)$ (numerically $g(2)=0.3466$, $g(3)=0.3662$, $g(4)=0.3466$). The largest is $3^{1/3}$.</p>`, '$2^{1/2}=4^{1/4}$, but both are smaller than $3^{1/3}$.'),
  M(4, 'inequalities by monotonicity', R`Which is larger, $e^\pi$ or $\pi^e$?`, R`$e^\pi$`, [R`$\pi^e$`, 'They are equal', 'Cannot be decided without a calculator'],
    R`<p>$g(x)=\dfrac{\ln x}x$ decreases for $x>e$. Since $\pi>e$: $\dfrac{\ln\pi}\pi<\dfrac{\ln e}e=\dfrac1e$, so $e\ln\pi<\pi$, i.e. $\pi^e<e^\pi$.</p>`, 'Taking $\\ln$ turns the comparison into one about $\\ln x/x$.'),
  I(3, 'number of roots', R`The equation $\ln x=\dfrac xe$ has exactly how many real solutions?`, 1,
    R`<p>Let $g(x)=\ln x-\dfrac xe$, $x>0$. $g'(x)=\dfrac1x-\dfrac1e=0$ at $x=e$, where $g$ has its maximum $1-1=0$. So $g\le0$ everywhere and touches $0$ only at $x=e$: exactly one solution.</p>`, 'The graphs touch; they do not cross, so there is one (double) root.', { calc: () => { let mx = -1e9; for (let x = 0.01; x < 50; x += 0.0005) mx = Math.max(mx, ln(x) - x / E_); return abs(mx) < 1e-6 ? 1 : 2; } }),
  I(4, 'number of roots', R`For how many integers $k$ does $x^3-6x^2+9x-k=0$ have three distinct real roots?`, 3,
    R`<p>$f(x)=x^3-6x^2+9x$: $f'=3(x-1)(x-3)$. Local max $f(1)=4$, local min $f(3)=0$. Three distinct roots need $0<k<4$, so $k=1,2,3$.</p>`, 'Both $k=0$ and $k=4$ give a repeated root.', { calc: () => { let c = 0; for (let k = -10; k <= 10; k++) { let n = 0, prev = (-5) ** 3 - 6 * 25 - 45 - k; for (let x = -5; x <= 8; x += 0.001) { const v = x ** 3 - 6 * x * x + 9 * x - k; if (prev * v < 0) n++; prev = v; } if (n === 3) c++; } return c; } }),
  I(3, 'global extrema', R`The least value of $|x-2|+|x-5|+|x-9|$ is`, 7,
    R`<p>The sum of distances to three points is least at their median, $x=5$. Value: $3+0+4=7$. (Slope check: left of $5$ the slope is $-1$, right of it $+1$.)</p>`, 'For an odd number of points it is the median; the mean $5.33$ gives $7.33$.', { calc: () => Math.round(Math.min(...Array.from({ length: 12001 }, (_, i) => { const x = i * 0.001; return abs(x - 2) + abs(x - 5) + abs(x - 9); })) * 1000) / 1000 }),
  I(3, 'optimisation', R`The least value of $4x+\dfrac9x$ for $x>0$ is`, 12,
    R`<p>$f'(x)=4-\dfrac9{x^2}=0$ gives $x=\dfrac32$. $f=6+6=12$. (AM-GM: $4x+\dfrac9x\ge2\sqrt{36}=12$.)</p>`, 'The minimum is at $x=1.5$, not at $x=3$ or $2$.', { calc: () => Math.round(Math.min(...Array.from({ length: 10000 }, (_, i) => { const x = 0.01 + i * 0.001; return 4 * x + 9 / x; }))) }),
  I(3, 'optimisation', R`If $x+y=9$ with $x,y>0$, the greatest value of $x^2y$ is`, 108,
    R`<p>$f(x)=x^2(9-x)$, $f'(x)=18x-3x^2=3x(6-x)$. Maximum at $x=6$, $y=3$: $36\cdot3=108$.</p>`, 'The power belongs to $x$: $x=6$, not $y=6$.', { calc: () => Math.round(Math.max(...Array.from({ length: 9001 }, (_, i) => { const x = i * 0.001; return x * x * (9 - x); }))) }),
  I(3, 'optimisation', R`The least value of $x^2+y^2$ when $3x+4y=25$ is`, 25,
    R`<p>$x^2+y^2$ is the square of the distance from the origin to the point $(x,y)$ on the line. The perpendicular distance is $\dfrac{25}{5}=5$, so the least value is $25$. (Calculus: $y=\dfrac{25-3x}4$, $f=x^2+\dfrac{(25-3x)^2}{16}$, $f'=0$ at $x=3$, $y=4$, $f=25$.)</p>`, 'The least value of $x^2+y^2$ is $d^2=25$, not $d=5$.', { calc: () => Math.round(Math.min(...Array.from({ length: 20001 }, (_, i) => { const x = -10 + i * 0.001; const y = (25 - 3 * x) / 4; return x * x + y * y; }))) }),
  D(3, 'optimisation', R`Find the least distance from $(0,5)$ to the parabola $y=x^2$.`, 2.1794,
    R`<p>$d^2=x^2+(x^2-5)^2$. Let $u=x^2\ge0$: $d^2=u+(u-5)^2$; derivative $1+2(u-5)=0$ gives $u=4.5$ (valid, since $u\ge0$). $d^2=4.5+0.25=4.75$, $d=\sqrt{4.75}\approx2.18$.</p>`, 'Substituting $u=x^2$ makes this a quadratic in $u$.', { calc: () => sqrt(Math.min(...Array.from({ length: 6001 }, (_, i) => { const x = -3 + i * 0.001; return x * x + (x * x - 5) ** 2; }))) }),
  M(3, 'critical points', R`The critical points of $f(x)=x^{5/3}-5x^{2/3}$ are`, R`$x=0$ and $x=2$`, [R`$x=2$ only`, R`$x=0$ only`, R`$x=0$ and $x=-2$`],
    R`<p>$f'(x)=\dfrac53x^{2/3}-\dfrac{10}3x^{-1/3}=\dfrac53x^{-1/3}(x-2)$. $f'=0$ at $x=2$ and $f'$ does not exist at $x=0$ (where $f$ is defined). Both are critical points. ($x=0$ is a local maximum, $x=2$ a local minimum.)</p>`, 'Points where $f\'$ does not exist count as critical.'),
  I(3, 'concavity', R`The number of points of inflection of $f(x)=x^4-6x^2$ is`, 2,
    R`<p>$f''(x)=12x^2-12=12(x-1)(x+1)$. It changes sign at both $x=-1$ and $x=1$: two inflection points.</p>`, 'Check that $f\'\'$ really changes sign at each zero.', { calc: () => { let c = 0, prev = 12 * 9 - 12; for (let x = -3; x <= 3; x += 0.001) { const v = 12 * x * x - 12; if (prev * v < 0) c++; prev = v; } return c; } }),
  I(3, 'concavity', R`For $f(x)=x^3-6x^2+9x$, the slope of the tangent at the point of inflection is`, -3,
    R`<p>$f''(x)=6x-12=0$ at $x=2$ (the sign changes). $f'(x)=3x^2-12x+9$, so $f'(2)=12-24+9=-3$.</p>`, 'Evaluate $f\'$, not $f$, at the inflection point.', { calc: () => Math.round(dd((x) => x ** 3 - 6 * x * x + 9 * x, 2)) }),
  N(3, 'approximation', R`Using differentials, the approximate increase in $y=x^3$ when $x$ changes from $3$ to $3.01$ is`, 0.27, 0.001,
    R`<p>$dy=3x^2\,dx=3\cdot9\cdot0.01=0.27$.</p>`, 'The exact change is $0.270271$; the differential gives $0.27$.', { calc: () => dd((x) => x ** 3, 3) * 0.01 }),
  I(3, 'approximation', R`The radius of a sphere is measured with a $2\%$ error. The approximate percentage error in its volume is`, 6,
    R`<p>$V\propto r^3$, so $\dfrac{dV}V=3\dfrac{dr}r=3\times2\%=6\%$.</p>`, 'Percentage errors multiply by the power.', { calc: () => Math.round(3 * 2) }),
  D(3, 'tangents', R`The tangent to $y=x^3$ at $(2,8)$ and the two axes enclose a triangle. Its area is`, 10.6667,
    R`<p>Slope $=3\cdot4=12$. Tangent: $y-8=12(x-2)$, i.e. $y=12x-16$. Intercepts: $x=\dfrac43$, $y=-16$. Area $=\dfrac12\cdot\dfrac43\cdot16=\dfrac{32}3\approx10.67$.</p>`, 'Use the absolute value of the negative intercept for the area.', { calc: () => 0.5 * (16 / 12) * 16 }),
  D(4, 'mixed: trigonometry', R`The least value of $2^{\sin x}+2^{\cos x}$ is`, 1.2251,
    R`<p>By AM-GM, $2^{\sin x}+2^{\cos x}\ge2\sqrt{2^{\sin x+\cos x}}$. The least value of $\sin x+\cos x$ is $-\sqrt2$, reached at $x=\dfrac{5\pi}4$ where $\sin x=\cos x$, so AM-GM equality holds too. Least value $=2\cdot2^{-\sqrt2/2}\approx2\times0.6125=1.225$.</p>`, 'Both inequalities must be tight at the same $x$.', { calc: () => Math.min(...Array.from({ length: 62832 }, (_, i) => { const x = i * 0.0001; return 2 ** sin(x) + 2 ** cos(x); })) }),
  D(3, 'mixed: definite integrals', R`Let $F(x)=\displaystyle\int_0^x(t^2-5t+6)\,dt$. The local maximum value of $F$ is`, 4.6667,
    R`<p>$F'(x)=x^2-5x+6=(x-2)(x-3)$ (fundamental theorem). Sign: $+,-,+$, so a local max at $x=2$. $F(2)=\dfrac83-10+12=\dfrac{14}3\approx4.67$.</p>`, 'The maximum is at $x=2$ (the smaller root).', { calc: () => simp((t) => t * t - 5 * t + 6, 0, 2, 2000) }),
  I(3, 'mixed: sequences', R`The sequence $a_n=\dfrac n{n^2+36}$ has its greatest term at $n=$`, 6,
    R`<p>Treat $f(x)=\dfrac x{x^2+36}$: $f'(x)=\dfrac{36-x^2}{(x^2+36)^2}=0$ at $x=6$, where $f$ changes from increasing to decreasing. $x=6$ is an integer, so $n=6$ (value $\dfrac1{12}$).</p>`, 'If the turning point were not an integer you would compare the two nearest integers.', { calc: () => { let b = 1; for (let n = 1; n <= 200; n++) if (n / (n * n + 36) > b / (b * b + 36)) b = n; return b; } }),
  I(3, 'mixed: trigonometry', R`The least value of $\sec^2x+\operatorname{cosec}^2x$ is`, 4,
    R`<p>$\sec^2x+\operatorname{cosec}^2x=\dfrac1{\sin^2x\cos^2x}=\dfrac4{\sin^22x}\ge4$, with equality at $x=\dfrac\pi4$.</p>`, 'Combine into $4/\\sin^22x$ before minimising.', { calc: () => Math.round(Math.min(...Array.from({ length: 3100 }, (_, i) => { const x = 0.0005 + i * 0.0005; return 1 / cos(x) ** 2 + 1 / sin(x) ** 2; }))) }),
  D(3, 'maxima and minima', R`The least value of $x^2\ln x$ for $x>0$ is`, -0.1839,
    R`<p>$f'(x)=2x\ln x+x=x(2\ln x+1)=0$ gives $\ln x=-\dfrac12$, $x=e^{-1/2}$. $f'$ changes from $-$ to $+$, so it is a minimum. $f=e^{-1}\left(-\dfrac12\right)=-\dfrac1{2e}\approx-0.184$.</p>`, 'The sign of $\\ln x$ is negative for $x<1$.', { calc: () => Math.min(...Array.from({ length: 5000 }, (_, i) => { const x = 0.001 + i * 0.001; return x * x * ln(x); })) }),
  I(3, 'extrema with parameters', R`$f(x)=x^3+px^2+qx$ has a local maximum at $x=-1$ and a local minimum at $x=3$. Find $p+q$.`, -12,
    R`<p>$f'(x)=3x^2+2px+q$ has roots $-1$ and $3$, so $f'(x)=3(x+1)(x-3)=3x^2-6x-9$. Then $2p=-6$ ($p=-3$) and $q=-9$. $p+q=-12$.</p>`, 'The leading coefficient of $f\'$ is $3$, not $1$.', { calc: () => { const p = -3, q = -9; if (abs(3 - 2 * p + q) > 1e-9) throw new Error('f-1'); if (abs(27 + 6 * p + q) > 1e-9) throw new Error('f\'(3)'); return p + q; } }),
  I(3, 'extrema with parameters', R`$f(x)=a\sin x+\dfrac13\sin3x$ has an extreme value at $x=\dfrac\pi3$. Find $a$.`, 2,
    R`<p>$f'(x)=a\cos x+\cos3x$. At $x=\dfrac\pi3$: $\dfrac a2+\cos\pi=\dfrac a2-1=0$, so $a=2$.</p>`, '$\\cos\\pi=-1$.', { calc: () => abs(dd((x) => 2 * sin(x) + sin(3 * x) / 3, PI_ / 3)) < 1e-6 ? 2 : NaN }),
  I(3, 'tangents', R`The least slope of a tangent to $y=x^3-3x^2+5x$ is`, 2,
    R`<p>Slope $=y'=3x^2-6x+5=3(x-1)^2+2\ge2$, with least value $2$ at $x=1$.</p>`, 'Complete the square: the slope itself is a quadratic to minimise.', { calc: () => Math.round(Math.min(...Array.from({ length: 4001 }, (_, i) => { const x = -2 + i * 0.001; return dd((t) => t ** 3 - 3 * t * t + 5 * t, x); }))) }),
  I(3, 'critical points', R`The number of points where $f(x)=|x^2-4x+3|$ is not differentiable is`, 2,
    R`<p>$x^2-4x+3=(x-1)(x-3)$ changes sign at $x=1$ and $x=3$, and at each the graph has a corner. Elsewhere $f$ is smooth. So $2$ points.</p>`, 'Corners appear only where the inside changes sign.', { calc: () => { const f = (x) => abs(x * x - 4 * x + 3); let c = 0; for (const x0 of [-1, 0, 1, 2, 3, 4]) { const l = (f(x0) - f(x0 - 1e-6)) / 1e-6, r = (f(x0 + 1e-6) - f(x0)) / 1e-6; if (abs(l - r) > 1e-3) c++; } return c; } }),
  M(3, 'extrema', R`At $x=0$ the function $f(x)=x^{2/3}$ has`, R`a local minimum although $f'(0)$ does not exist`, [R`a local minimum with $f'(0)=0$`, R`a point of inflection`, R`no extremum, because $f$ is not differentiable there`],
    R`<p>$f(0)=0$ and $f(x)>0$ for $x\ne0$, so $0$ is a (global) minimum. $f'(x)=\dfrac23x^{-1/3}$ is not defined at $0$ (a cusp). An extremum can occur where $f'$ does not exist.</p>`, 'Fermat\'s theorem only says $f\'=0$ where $f\'$ exists.'),
  I(3, 'tangents', R`A tangent to $y=\ln x$ passes through the origin $(0,0)$. If its slope is $m$, find $e\cdot m$.`, 1,
    R`<p>Tangent at $(a,\ln a)$: $y-\ln a=\dfrac1a(x-a)$. Through $(0,0)$: $-\ln a=-1$, so $a=e$ and $m=\dfrac1a=\dfrac1e$. Then $e\cdot m=1$.</p>`, 'Substitute $(0,0)$ into the tangent equation to find the point of contact.', { calc: () => { let a = 1; for (let i = 0; i < 100; i++) a = a - (ln(a) - 1) / (1 / a); return Math.round(E_ * (1 / a)); } }),

  // ---------- L4 hard ----------
  I(4, 'monotonicity with a parameter', R`$f(x)=(k+2)x^3-3kx^2+9kx-1$ is decreasing on all of $\mathbb R$. The largest integer $k$ is`, -3,
    R`<p>$f'(x)=3\left[(k+2)x^2-2kx+3k\right]\le0$ for all $x$ needs $k+2<0$ and discriminant $\le0$: $4k^2-12k(k+2)\le0$, i.e. $-8k^2-24k\le0$, $k(k+3)\ge0$. With $k<-2$ this gives $k\le-3$. Largest integer $-3$ (then $f'=-3(x-3)^2\le0$).</p>`, 'The leading coefficient must be negative; $k=-2$ makes $f\'$ linear and fails.', { calc: () => { let best = null; for (let k = -10; k <= 10; k++) { let ok = true; for (let x = -60; x <= 60; x += 0.01) if (3 * ((k + 2) * x * x - 2 * k * x + 3 * k) > 1e-9) { ok = false; break; } if (ok) best = k; } return best; } }),
  I(4, 'tangents', R`The tangent to $y=x^3$ at $(1,1)$ meets the curve again at a point. Its $x$-coordinate is`, -2,
    R`<p>Tangent: $y=3x-2$. Solve $x^3=3x-2$: $x^3-3x+2=(x-1)^2(x+2)=0$. The double root $x=1$ is the contact point; the other is $x=-2$.</p>`, 'The contact point is a double root of the equation.', { calc: () => { let r = null, prev = (-5) ** 3 - 3 * -5 + 2; for (let x = -5 + 0.0001; x < 0.5; x += 0.0001) { const v = x ** 3 - 3 * x + 2; if (prev * v < 0) r = x; prev = v; } return Math.round(r); } }),
  I(4, 'tangents', R`The curves $y=x^2$ and $y=-(x-2)^2$ have two common tangents. The sum of their slopes is`, 4,
    R`<p>A tangent $y=mx+c$ to $y=x^2$ needs $x^2-mx-c=0$ to have a double root: $c=-\dfrac{m^2}4$. For $y=-(x-2)^2$ the condition $x^2-4x+4+mx+c=0$ having a double root gives $(m-4)^2=4(4+c)$, i.e. $m^2-8m-4c=0$. Substituting $c$: $2m^2-8m=0$, $m=0$ or $4$. Sum $=4$.</p>`, 'Two conditions, one for each parabola; solve them together.', { calc: () => { const ms = []; for (let m = -10; m <= 10; m += 0.0005) { const c = -m * m / 4; let mn = 1e9; for (let x = 0; x <= 4; x += 0.001) mn = Math.min(mn, m * x + c + (x - 2) ** 2); if (abs(mn) < 1e-5) ms.push(m); } const cl = []; ms.forEach((m) => { if (!cl.length || m - cl[cl.length - 1].at(-1) > 0.01) cl.push([m]); else cl[cl.length - 1].push(m); }); return Math.round(cl.map((a) => a.reduce((s, v) => s + v, 0) / a.length).reduce((s, v) => s + v, 0)); } }),
  I(4, 'inequalities by calculus', R`The least positive $k$ with $kx^2+\dfrac1x\ge3$ for all $x>0$ is`, 4,
    R`<p>For fixed $k$, $g(x)=kx^2+\dfrac1x$ has $g'=2kx-\dfrac1{x^2}=0$ at $x^3=\dfrac1{2k}$, the minimum. There $kx^3=\dfrac12$, so $g_{\min}=\dfrac1x\left(\dfrac12+1\right)=\dfrac3{2x}=\dfrac32(2k)^{1/3}$. Need $\dfrac32(2k)^{1/3}\ge3$: $(2k)^{1/3}\ge2$, $2k\ge8$, $k\ge4$.</p>`, 'The inequality must hold at the minimum point of $g$.', { calc: () => { const mn = (k) => Math.min(...Array.from({ length: 8000 }, (_, i) => { const x = 0.01 + i * 0.001; return k * x * x + 1 / x; })); return mn(4) >= 3 - 1e-6 && mn(3.98) < 3 ? 4 : NaN; } }),
  D(4, 'optimisation', R`A fence $1$ m high stands $8$ m from a tall wall. The shortest ladder that rests on the ground, touches the top of the fence and leans on the wall has length (m, 2 decimal places)`, 11.1803,
    R`<p>With the ladder at angle $\theta$ to the ground: $L=\dfrac1{\sin\theta}+\dfrac8{\cos\theta}$. $L'=-\dfrac{\cos\theta}{\sin^2\theta}+\dfrac{8\sin\theta}{\cos^2\theta}=0$ gives $\dfrac{\cos\theta}{\sin^2\theta}=\dfrac{8\sin\theta}{\cos^2\theta}$, i.e. $\cos^3\theta=8\sin^3\theta$, so $\tan\theta=\dfrac12$. Then $\sin\theta=\dfrac1{\sqrt5}$, $\cos\theta=\dfrac2{\sqrt5}$ and $L=\sqrt5+4\sqrt5=5\sqrt5\approx11.18$. (General: $(a^{2/3}+b^{2/3})^{3/2}$.)</p>`, 'The two pieces of the ladder have different angles-of-sight factors: $1/\\sin\\theta$ and $8/\\cos\\theta$.', { calc: () => Math.min(...Array.from({ length: 15700 }, (_, i) => { const t = 0.0001 + i * 0.0001; return 1 / sin(t) + 8 / cos(t); })) }),
  D(4, 'optimisation', R`The greatest volume of a cone inscribed in a sphere of radius $3$ is`, 33.5103,
    R`<p>Cone height $h$ (apex at one end of a diameter), base radius $r$ with $r^2=h(6-h)$. $V=\dfrac\pi3h^2(6-h)$, $V'=\dfrac\pi3(12h-3h^2)=0$ gives $h=4$. $V=\dfrac\pi3\cdot16\cdot2=\dfrac{32\pi}3\approx33.51$ (this is $\dfrac8{27}$ of the sphere's volume).</p>`, '$r^2=h(2R-h)$ comes from the chord property of a circle.', { calc: () => Math.max(...Array.from({ length: 6000 }, (_, i) => { const h = 0.001 + i * 0.001; return (PI_ / 3) * h * h * (6 - h); })) }),
  D(4, 'optimisation', R`A cone has slant height $3\sqrt3$ cm. The greatest possible volume is (cm$^3$)`, 56.5487,
    R`<p>$r^2=l^2-h^2=27-h^2$. $V=\dfrac\pi3(27h-h^3)$. $V'=\dfrac\pi3(27-3h^2)=0$ gives $h=3$, $r^2=18$. $V=\dfrac\pi3\cdot18\cdot3=18\pi\approx56.55$.</p>`, 'Keep the slant height fixed; $h$ and $r$ trade off.', { calc: () => Math.max(...Array.from({ length: 5200 }, (_, i) => { const h = 0.001 + i * 0.001; return (PI_ / 3) * (27 - h * h) * h; })) }),
  D(4, 'optimisation', R`The greatest volume of a cylinder inscribed in a sphere of radius $\sqrt3$ is`, 12.5664,
    R`<p>Cylinder of height $h$, radius $r$: $r^2=3-\dfrac{h^2}4$. $V=\pi\left(3h-\dfrac{h^3}4\right)$, $V'=\pi\left(3-\dfrac34h^2\right)=0$ gives $h=2$, $r^2=2$. $V=\pi\cdot2\cdot2=4\pi\approx12.57$.</p>`, 'The diagonal of the cylinder is the sphere\'s diameter: $4r^2+h^2=4R^2$.', { calc: () => Math.max(...Array.from({ length: 3400 }, (_, i) => { const h = 0.001 + i * 0.001; return PI_ * (3 - (h * h) / 4) * h; })) }),
  I(4, 'optimisation', R`A rectangle is inscribed in the ellipse $\dfrac{x^2}{25}+\dfrac{y^2}9=1$ with sides parallel to the axes. Its greatest area is`, 30,
    R`<p>Corner $(5\cos\theta,3\sin\theta)$: area $=4\cdot15\sin\theta\cos\theta=30\sin2\theta\le30$.</p>`, 'The area is $4xy$, not $xy$.', { calc: () => Math.round(Math.max(...Array.from({ length: 15709 }, (_, i) => { const t = i * 0.0001; return 4 * (5 * cos(t)) * (3 * sin(t)); }))) }),
  I(4, 'optimisation', R`A line through $(2,3)$ meets the positive axes at $A$ and $B$. The least area of triangle $OAB$ is`, 12,
    R`<p>Intercepts $p,q$: $\dfrac2p+\dfrac3q=1$. By AM-GM, $1\ge2\sqrt{\dfrac6{pq}}$, so $pq\ge24$ and the area $\dfrac{pq}2\ge12$. Equality when $\dfrac2p=\dfrac3q=\dfrac12$: $p=4,q=6$. (In general least area $=2ab$ for point $(a,b)$.)</p>`, 'Area is $\\tfrac12pq$, so the least $pq$ is $24$.', { calc: () => Math.round(Math.min(...Array.from({ length: 20000 }, (_, i) => { const p = 2.001 + i * 0.001; const q = (3 * p) / (p - 2); return (p * q) / 2; }))) }),
  I(4, 'number of roots', R`The equation $x^4-4x^3-8x^2+48x+k=0$ has four distinct real roots for how many integer values of $k$?`, 2,
    R`<p>$f'(x)=4(x-3)(x-2)(x+2)$: minima at $x=-2$ and $x=3$, maximum at $x=2$. $f(-2)=k-80$, $f(2)=k+48$, $f(3)=k+45$. Four distinct roots need both minima negative and the maximum positive: $k<80$, $k<-45$, $k>-48$. So $-48<k<-45$: $k=-47,-46$.</p>`, 'Both minima must be below the axis, so the tighter one ($x=3$) decides.', { calc: () => { let c = 0; for (let k = -100; k <= 100; k++) { let n = 0, prev = 1296 + 864 - 288 - 288 + k - 0; prev = (-6) ** 4 - 4 * (-6) ** 3 - 8 * 36 + 48 * -6 + k; for (let x = -6; x <= 6; x += 0.001) { const v = x ** 4 - 4 * x ** 3 - 8 * x * x + 48 * x + k; if (abs(v) < 1e-6) continue; if (prev * v < 0) n++; prev = v; } if (n === 4) c++; } return c; } }),
  I(4, 'number of roots', R`The number of real roots of $x^5-5x+1=0$ is`, 3,
    R`<p>$f'(x)=5x^4-5=0$ at $x=\pm1$. $f(-1)=5>0$ (local max), $f(1)=-3<0$ (local min). As $x\to\pm\infty$, $f\to\pm\infty$. So one root in each of $(-\infty,-1)$, $(-1,1)$ and $(1,\infty)$: $3$.</p>`, 'Count sign changes between the turning points and the ends.', { calc: () => { let n = 0, prev = (-3) ** 5 + 15 + 1; for (let x = -3; x <= 3; x += 0.0005) { const v = x ** 5 - 5 * x + 1; if (prev * v < 0) n++; prev = v; } return n; } }),
  I(4, 'number of roots', R`The number of real solutions of $e^x=x^2$ is`, 1,
    R`<p>For $x>0$: $\dfrac{e^x}{x^2}$ has derivative zero at $x=2$, with least value $\dfrac{e^2}4\approx1.85>1$, so $e^x>x^2$ for all $x>0$: no root. For $x<0$: $g(x)=e^x-x^2$ goes from $-\infty$ (at $-\infty$) to $g(0)=1>0$ and is increasing, so there is exactly one root (about $-0.70$). Total $1$.</p>`, 'The graph of $e^x$ stays above $x^2$ for positive $x$ even though $x^2$ looks bigger for small $x$.', { calc: () => { let n = 0, prev = exp(-10) - 100; for (let x = -10; x <= 10; x += 0.0005) { const v = exp(x) - x * x; if (prev * v < 0) n++; prev = v; } return n; } }),
  D(4, 'distance between curves', R`The least distance between a point on $y=e^x$ and a point on $y=\ln x$ is`, 1.4142,
    R`<p>The curves are mirror images in the line $y=x$, so the shortest link is perpendicular to that line and the distance is twice the least distance from $y=e^x$ to $y=x$. That distance is $\dfrac{e^x-x}{\sqrt2}$, least when $e^x=1$ ($x=0$): $\dfrac1{\sqrt2}$. Total $\dfrac2{\sqrt2}=\sqrt2\approx1.414$.</p>`, 'Use the symmetry; a direct two-variable minimisation is far harder.', { calc: () => { let m = 1e9; for (let a = -3; a <= 1.5; a += 0.005) for (let b = 0.05; b <= 5; b += 0.005) { const d = (a - b) ** 2 + (exp(a) - ln(b)) ** 2; if (d < m) m = d; } return sqrt(m); } }),
  N(4, 'optimisation', R`If $x,y>0$ and $x+y=1$, the least value of $\left(x+\dfrac1x\right)^2+\left(y+\dfrac1y\right)^2$ is`, 12.5, 0.01,
    R`<p>$f(x)=\left(x+\frac1x\right)^2+\left(1-x+\frac1{1-x}\right)^2$ is symmetric about $x=\dfrac12$, and by convexity it is least there. At $x=y=\dfrac12$: $\left(\dfrac52\right)^2\cdot2=\dfrac{25}2=12.5$.</p>`, 'The expression is symmetric, but you must check that the symmetric point is a minimum.', { calc: () => Math.min(...Array.from({ length: 9999 }, (_, i) => { const x = 0.0001 + i * 0.0001; const y = 1 - x; return (x + 1 / x) ** 2 + (y + 1 / y) ** 2; })) }),

  // ---------- L5 top rank ----------
  I(5, 'optimisation', R`A tangent to the ellipse $\dfrac{x^2}{25}+\dfrac{y^2}4=1$ meets the positive axes at $A$ and $B$. The least area of triangle $OAB$ is`, 10,
    R`<p>The tangent at $(5\cos\theta,2\sin\theta)$ is $\dfrac{x\cos\theta}5+\dfrac{y\sin\theta}2=1$, with intercepts $\dfrac5{\cos\theta}$ and $\dfrac2{\sin\theta}$. Area $=\dfrac12\cdot\dfrac{10}{\sin\theta\cos\theta}=\dfrac{10}{\sin2\theta}\ge10$.</p>`, 'The least area is $ab$, reached at $\\theta=45^\\circ$.', { calc: () => Math.round(Math.min(...Array.from({ length: 15000 }, (_, i) => { const t = 0.0001 + i * 0.0001; return (0.5 * 5 * 2) / (sin(t) * cos(t)); }))) }),
  I(5, 'inequalities by calculus', R`The least integer $a$ for which $a^x\ge x^2$ holds for every $x>0$ is`, 3,
    R`<p>$a^x\ge x^2\iff\ln a\ge\dfrac{2\ln x}x$. The right side has maximum $\dfrac2e\approx0.736$ (at $x=e$). So $\ln a\ge0.736$, $a\ge e^{2/e}\approx2.09$. The least integer is $3$ ($a=2$ fails: $2^3=8<9$).</p>`, '$a=2$ is close but fails at $x=3$.', { calc: () => { for (let a = 2; a < 10; a++) { let ok = true; for (let x = 0.001; x < 80; x += 0.001) if (a ** x < x * x * (1 - 1e-12)) { ok = false; break; } if (ok) return a; } } }),
  I(5, 'number of roots', R`The number of real solutions of $x^2e^{-x}=0.3$ is`, 3,
    R`<p>$f(x)=x^2e^{-x}$: $f'=e^{-x}x(2-x)$. $f\to\infty$ as $x\to-\infty$, local minimum $f(0)=0$, local maximum $f(2)=4e^{-2}\approx0.541$, and $f\to0$ as $x\to\infty$. A level $0<k<0.541$ is met once on $(-\infty,0)$, once on $(0,2)$ and once on $(2,\infty)$: $3$ solutions.</p>`, 'Remember the tail on the right goes down to $0$, which creates the third crossing.', { calc: () => { let n = 0, prev = 100 * exp(10) - 0.3; for (let x = -10; x <= 40; x += 0.0005) { const v = x * x * exp(-x) - 0.3; if (prev * v < 0) n++; prev = v; } return n; } }),
  I(5, 'normals', R`The number of normals to the parabola $y^2=4x$ that pass through $(5,0)$ is`, 3,
    R`<p>The normal of slope $m$ is $y=mx-2m-m^3$. Through $(5,0)$: $0=5m-2m-m^3$, so $m(3-m^2)=0$: $m=0,\pm\sqrt3$. Three normals (always three when the point lies beyond $x=2$ on the axis).</p>`, 'The normal with $m=0$ is the axis itself.', { calc: () => { let n = 0, prev = 125 - 15; for (let m = -5; m <= 5; m += 0.001) { const v = -(m ** 3) + 3 * m; if (prev * v < 0) n++; prev = v; } return n; } }),
  X(5, 'critical points', R`$f(x)=|x^2-4x+3|$ for $x\in\mathbb R$. Which statements are true?`, [R`$f$ is not differentiable at exactly two points`, R`$f$ has a local maximum at $x=2$`, R`$f$ has a local minimum at $x=1$ although $f'(1)$ does not exist`, R`the greatest value of $f$ on $[0,4]$ is $1$`], [0, 1, 2],
    R`<p>$f=|(x-1)(x-3)|$. Corners at $1$ and $3$ (true). On $[1,3]$, $f=-(x^2-4x+3)$ has its vertex at $x=2$ with $f(2)=1$: a local maximum (true). At $x=1$ the value is $0$, the least possible, so it is a local minimum with a corner (true). On $[0,4]$: $f(0)=3$ and $f(4)=3$, so the greatest value is $3$, not $1$ (false).</p>`, 'The local maximum value $1$ is not the global maximum on $[0,4]$.'),
  I(4, 'number of roots', R`The number of real solutions of $2^x=x^2$ is`, 3,
    R`<p>$x=2$ and $x=4$ are solutions ($4=4$, $16=16$). For $x<0$, $2^x-x^2$ goes from $-\infty$ (as $x\to-\infty$, $x^2$ dominates) to $1$ at $x=0$, so there is a crossing near $x\approx-0.77$. Between $2$ and $4$, $x^2>2^x$ (e.g. $x=3$: $9>8$), and beyond $4$, $2^x$ wins. Total $3$.</p>`, 'Students find $2$ and $4$ and forget the negative root.', { calc: () => countSign((x) => 2 ** x - x * x, -10.00031, 20.0001, 0.001) }),
  D(4, 'optimisation', R`Find the least distance between the parabola $y=x^2$ and the line $x-y-2=0$.`, 1.2374,
    R`<p>For $(x,x^2)$ the distance to the line is $\dfrac{|x-x^2-2|}{\sqrt2}=\dfrac{x^2-x+2}{\sqrt2}$ (the numerator is always positive). $x^2-x+2$ is least at $x=\dfrac12$: $\dfrac14-\dfrac12+2=\dfrac74$. Distance $=\dfrac7{4\sqrt2}\approx1.237$.</p>`, 'The parabola never meets the line, so the distance is positive.', { calc: () => Math.min(...Array.from({ length: 4001 }, (_, i) => { const x = -2 + i * 0.001; return abs(x - x * x - 2) / sqrt(2); })) }),
  I(4, 'inequalities by monotonicity', R`Among the numbers $n^{1/n}$ for positive integers $n$, the greatest occurs at $n=$`, 3,
    R`<p>$g(x)=\dfrac{\ln x}x$ increases up to $x=e\approx2.718$ and decreases afterwards. The integers nearest to $e$ are $2$ and $3$: $2^{1/2}=1.414$, $3^{1/3}=1.442$. So $n=3$.</p>`, 'The maximum of the continuous function is at $e$, not at an integer; compare $2$ and $3$.', { calc: () => { let b = 1; for (let n = 2; n <= 100; n++) if (n ** (1 / n) > b ** (1 / b)) b = n; return b; } }),
  D(4, 'optimisation', R`A window is a rectangle topped by a semicircle (the diameter is the rectangle's top side). The whole boundary of the window, including the bottom edge and the semicircular arc, is $20$ m. The greatest possible area (m$^2$) is`, 28.0057,
    R`<p>Width $w$, rectangle height $h$. Boundary: $2h+w+\dfrac{\pi w}2=20$, so $h=10-\dfrac w2\left(1+\dfrac\pi2\right)$. Area $=wh+\dfrac{\pi w^2}8=10w-w^2\left(\dfrac12+\dfrac\pi8\right)$. Largest at $w=\dfrac{10}{1+\pi/4}\approx5.60$: $A=\dfrac{100}{4\left(\frac12+\frac\pi8\right)}=\dfrac{400}{8+2\pi}\approx28.01$.</p>`, 'The perimeter includes the arc but not the diameter drawn inside; the bottom edge is part of it.', { calc: () => Math.max(...Array.from({ length: 12001 }, (_, i) => { const w = i * 0.001; const h = 10 - (w / 2) * (1 + PI_ / 2); return h < 0 ? 0 : w * h + (PI_ * w * w) / 8; })) }),
  I(5, 'tangents', R`The number of tangents to $y=x^3-3x$ that pass through the point $(2,0)$ is`, 3,
    R`<p>Tangent at $x=t$: $y=(3t^2-3)(x-t)+t^3-3t$. Through $(2,0)$: $(3t^2-3)(2-t)+t^3-3t=0$, which simplifies to $t^3-3t^2+3=0$. Let $g(t)=t^3-3t^2+3$: $g(-1)=-1<0$, $g(0)=3>0$, $g(2)=-1<0$, $g(3)=3>0$. Three real roots, so three tangents.</p>`, 'The point $(2,0)$ is not on the curve, so count points of contact.', { calc: () => countSign((t) => (3 * t * t - 3) * (2 - t) + t ** 3 - 3 * t, -5.00013, 5.0001, 0.001) }),
  I(5, 'number of roots', R`The number of real solutions of $\sin x=\dfrac x{10}$ is`, 7,
    R`<p>Both sides are odd, so solutions are symmetric about $0$ and $x=0$ is one. Since $|\sin x|\le1$, solutions lie in $[-10,10]$. For $x>0$: on $(0,\pi)$ the sine starts above the line (slope $1>0.1$) and ends below it ($0<\pi/10$): one crossing. On $(2\pi,3\pi)$ the hump reaches $1$, above the line (about $0.8$ to $0.9$ there), and returns to $0$ below it: two crossings. Between $\pi$ and $2\pi$ and after $3\pi$ the sine is negative while the line is positive: none. So $3$ positive, $3$ negative and $0$: $7$.</p>`, 'Do not forget $x=0$ and the negative side.', { calc: () => countSign((x) => sin(x) - x / 10, -12.00017, 12.0001, 0.001) }),
  I(4, "mean value theorem", R`A differentiable $f$ satisfies $2\le f'(x)\le4$ for all $x$ and $f(0)=1$. How many integers are possible values of $f(5)$?`, 11,
    R`<p>By the mean value theorem $f(5)-f(0)=5f'(c)\in[10,20]$, so $f(5)\in[11,21]$. Integers $11,\dots,21$: $11$ values.</p>`, 'Count both end values.', { calc: () => { let c = 0; for (let v = 0; v <= 40; v++) if (v >= 1 + 5 * 2 && v <= 1 + 5 * 4) c++; return c; } }),
  N(4, 'optimisation', R`If $a,b>0$ and $a+b=1$, the least value of $\left(a+\dfrac1a\right)\left(b+\dfrac1b\right)$ is`, 6.25, 0.01,
    R`<p>With $t=ab\le\dfrac14$: the product $=ab+\dfrac1{ab}+\dfrac ab+\dfrac ba=t+\dfrac1t+\dfrac{1-2t}t=t+\dfrac2t-2$. Its derivative $1-\dfrac2{t^2}<0$ for $t<\sqrt2$, so it decreases as $t$ rises to $\dfrac14$. At $t=\dfrac14$: $\dfrac14+8-2=6.25$.</p>`, 'The least value is at the largest $ab$, namely $a=b=\\tfrac12$.', { calc: () => Math.min(...Array.from({ length: 9999 }, (_, i) => { const a = 0.0001 + i * 0.0001; const b = 1 - a; return (a + 1 / a) * (b + 1 / b); })) }),
  I(5, 'optimisation', R`The line $\dfrac xa+\dfrac yb=1$ ($a,b>0$) passes through $(4,9)$. The least value of $a+b$ is`, 25,
    R`<p>$\dfrac4a+\dfrac9b=1$. By Cauchy-Schwarz, $(a+b)\left(\dfrac4a+\dfrac9b\right)\ge(2+3)^2=25$, so $a+b\ge25$, with equality when $\dfrac{a^2}4=\dfrac{b^2}9$, i.e. $a=10$, $b=15$. (Calculus: $b=\dfrac{9a}{a-4}$, minimise $a+\dfrac{9a}{a-4}$.)</p>`, 'The answer is $(\\sqrt4+\\sqrt9)^2$, not $4+9$.', { calc: () => Math.round(Math.min(...Array.from({ length: 60000 }, (_, i) => { const a = 4.001 + i * 0.001; return a + (9 * a) / (a - 4); }))) }),
  N(3, 'mixed: inverse functions', R`$f(x)=x^3+x+1$ is one-one. If $g=f^{-1}$, find $g'(3)$.`, 0.25, 0.001,
    R`<p>$f(1)=3$, so $g(3)=1$. $g'(3)=\dfrac1{f'(g(3))}=\dfrac1{f'(1)}=\dfrac1{3+1}=0.25$.</p>`, 'Evaluate $f\'$ at $g(3)=1$, not at $3$.', { calc: () => { const f = (x) => x ** 3 + x + 1; return 1 / dd(f, 1); } }),
  X(5, 'extrema', R`For $f(x)=xe^{-x}$, which statements are true?`, [R`$f$ has greatest value $\dfrac1e$`, R`$f$ has a point of inflection at $x=2$`, R`$f(x)=0$ has exactly one real solution`, R`$f(x)=0.5$ has a real solution`], [0, 1, 2],
    R`<p>$f'=e^{-x}(1-x)$: maximum $f(1)=\dfrac1e\approx0.368$ (true). $f''=e^{-x}(x-2)$ changes sign at $2$ (true). $f=0$ only at $x=0$ (true). Since the greatest value is $0.368<0.5$, $f(x)=0.5$ has no solution (false).</p>`, 'Compare the level with the maximum value.'),
  M(4, 'extrema', R`$f(x)=x^2|x|$ has at $x=0$`, R`a local minimum with $f'(0)=0$`, [R`a local minimum with no derivative`, R`a point of inflection`, R`no extremum, because $|x|$ is not differentiable`],
    R`<p>$f(x)=|x|^3$. For $x>0$, $f'=3x^2$; for $x<0$, $f'=-3x^2$; the one-sided derivatives at $0$ are both $0$, so $f'(0)=0$. $f\ge0=f(0)$: a minimum. The factor $|x|$ looks dangerous, but $|x|^3$ is differentiable.</p>`, 'Cubing $|x|$ smooths the corner.'),

  // ---------- assertion-reason ----------
  A(2, 'extrema', R`$f(x)=x^3$ has no maximum or minimum at $x=0$, even though $f'(0)=0$.`, R`$f'(x)=3x^2\ge0$ on both sides of $0$: it does not change sign at $0$.`, 0,
    R`<p>A is true: $f$ is increasing through $0$. R is true and is exactly why: an extremum needs $f'$ to change sign.</p>`, '$f\'=0$ is necessary, not sufficient.'),
  A(2, 'extrema', R`$f(x)=|x|$ has its least value at $x=0$.`, R`$f'(0)=0$, so $x=0$ is a critical point where the minimum occurs.`, 2,
    R`<p>A is true: $|x|\ge0=|0|$. R is false: $f'(0)$ does not exist (a corner). The minimum is at a point where the derivative is not defined.</p>`, 'Critical points include places where $f\'$ does not exist.'),
  A(3, 'monotonicity', R`If $f$ is increasing on $(a,b)$, then $f'(x)>0$ for every $x\in(a,b)$.`, R`$f(x)=x^3$ is increasing on $\mathbb R$.`, 3,
    R`<p>A is false: an increasing function can have $f'=0$ at isolated points. R is true, but it is the counterexample, not a reason for A ($f'(0)=0$ for $x^3$).</p>`, 'Increasing gives $f\'\\ge0$, not $f\'>0$.'),
  A(3, 'maxima and minima', R`$f(x)=xe^{-x}$ has its greatest value at $x=1$.`, R`$e^{-x}>0$ for all real $x$.`, 1,
    R`<p>$f'(x)=e^{-x}(1-x)$ changes from $+$ to $-$ at $x=1$, so A is true. R is also true, but it only tells us the sign of $f'$ is the sign of $1-x$; by itself it does not explain a maximum at $x=1$.</p>`, 'A true statement is not always the explanation.'),
  A(2, 'optimisation', R`Among all rectangles with a given perimeter, the square has the greatest area.`, R`For positive $x,y$: $xy\le\left(\dfrac{x+y}2\right)^2$, with equality only when $x=y$.`, 0,
    R`<p>With $x+y$ fixed (half the perimeter), the product $xy$ is bounded by the square of the mean, equal exactly when $x=y$. R is the reason for A.</p>`, 'The perimeter fixes $x+y$, not $xy$.'),
  A(4, 'maxima and minima', R`The local maximum value of $f(x)=x+\dfrac1x$ is smaller than its local minimum value.`, R`A local maximum value is always greater than every local minimum value.`, 2,
    R`<p>$f'(x)=1-\dfrac1{x^2}$. Local maximum at $x=-1$: $f=-2$. Local minimum at $x=1$: $f=2$. So $-2<2$: A is true. R is false: local values only compare nearby points. (Here the function is not defined at $0$, so the two branches are separate.)</p>`, '"Local" means nearby; it says nothing about far-away values.'),
  A(3, "mean value theorem", R`For $f(x)=\dfrac1x$ on $[-1,1]$ there is no $c$ with $f'(c)=\dfrac{f(1)-f(-1)}{2}$.`, R`The mean value theorem requires $f$ to be continuous on the closed interval.`, 0,
    R`<p>$\dfrac{f(1)-f(-1)}2=\dfrac{1-(-1)}2=1$, and $f'(c)=-\dfrac1{c^2}<0$ never equals $1$: A is true. $f$ is not defined at $0$, so the hypothesis fails; R explains why the theorem does not apply.</p>`, 'The conclusion fails only because a hypothesis fails.'),
  A(4, 'tangents', R`The tangent to $y=x^3$ at the origin crosses the curve there.`, R`A tangent line never crosses the curve at its point of contact.`, 2,
    R`<p>The tangent at $0$ is $y=0$. For $x<0$ the curve is below it, for $x>0$ above, so it crosses: A is true. R is false: at a point of inflection the tangent does cross the curve.</p>`, 'A tangent line can cross the curve at an inflection point.'),
  A(3, 'concavity', R`$f(x)=x^4$ has a point of inflection at $x=0$, since $f''(0)=0$.`, R`A point of inflection needs $f''$ to change sign.`, 3,
    R`<p>$f''(x)=12x^2\ge0$ on both sides of $0$; it does not change sign, so $0$ is not an inflection. A is false. R is true.</p>`, '$f\'\'=0$ is necessary, not sufficient.'),
  A(3, 'optimisation', R`The least value of $x+\dfrac1x$ for $x>0$ is $2$.`, R`$x+\dfrac1x\to\infty$ as $x\to\infty$.`, 1,
    R`<p>By AM-GM $x+\dfrac1x\ge2$ with equality at $x=1$, so A is true. R is true but only describes the behaviour at large $x$; it does not show that $2$ is the least.</p>`, 'Both can be true without R explaining A.'),
  A(3, 'related rates', R`A spherical drop evaporates at a rate proportional to its surface area. Its radius then decreases at a constant rate.`, R`For a sphere, $\dfrac{dV}{dt}=4\pi r^2\dfrac{dr}{dt}$.`, 0,
    R`<p>If $\dfrac{dV}{dt}=-k\cdot4\pi r^2$, then $4\pi r^2\dfrac{dr}{dt}=-k\cdot4\pi r^2$, so $\dfrac{dr}{dt}=-k$, a constant. R is the step that connects volume rate to radius rate.</p>`, 'The $4\\pi r^2$ cancels.'),

  // ---------- statements ----------
  S(2, 'extrema', R`$f(x)=x^3-3x$ has a local maximum at $x=-1$.`, R`$f'(-1)=0$ and $f''(-1)=-6<0$.`, 0,
    R`<p>$f'=3x^2-3$, $f''=6x$. $f'(-1)=0$ and $f''(-1)=-6<0$, so a local maximum at $-1$. Both true.</p>`, 'Second derivative negative means a maximum.'),
  S(3, 'global extrema', R`Every continuous function on a closed interval $[a,b]$ attains a greatest and a least value.`, R`A function can attain its greatest value only at a point where $f'=0$.`, 1,
    R`<p>I is the extreme value theorem (true). II is false: the greatest value can be at an endpoint (e.g. $f(x)=x$ on $[0,1]$) or at a point where $f'$ does not exist.</p>`, 'Check endpoints and non-differentiable points as well.'),
  S(3, 'global extrema', R`$f(x)=x^2$ has no greatest value on $(0,1)$.`, R`The extreme value theorem needs a closed bounded interval.`, 0,
    R`<p>On $(0,1)$ the values approach $1$ but never reach it, so there is no greatest value. II is the reason the theorem cannot be used here. Both true.</p>`, 'Open intervals may not contain their extreme points.'),
  S(3, "mean value theorem", R`The mean value theorem applies to $f(x)=|x|$ on $[1,3]$.`, R`$|x|$ is not differentiable at $0$, so the mean value theorem cannot be applied to it on any interval.`, 1,
    R`<p>On $[1,3]$, $f(x)=x$ is continuous and differentiable, so I is true. II is false: $0\notin[1,3]$; only intervals containing $0$ in their interior fail.</p>`, 'Check whether the bad point lies inside the interval.'),
  S(3, 'extrema', R`If $f'(c)=0$, then $f$ has a local extremum at $c$.`, R`If $f$ is differentiable and has a local extremum at an interior point $c$, then $f'(c)=0$.`, 2,
    R`<p>I is false ($f=x^3$, $c=0$). II is Fermat's theorem: true.</p>`, 'The theorem goes only one way.'),
  S(4, 'concavity', R`If $f''(c)=0$, then $c$ is a point of inflection.`, R`$f(x)=x^4$ has $f''(0)=0$ but no point of inflection.`, 2,
    R`<p>I is false and II is the standard counterexample: $f''=12x^2$ does not change sign at $0$.</p>`, 'Need a sign change of $f\'\'$.'),
  S(4, 'global extrema', R`$f(x)=x^3-3x$ has a greatest value $2$ on $\mathbb R$.`, R`A continuous function on $\mathbb R$ always attains a greatest value.`, 3,
    R`<p>$f(x)\to\infty$ as $x\to\infty$, so there is no greatest value ($2$ is only the local maximum). I is false. II is false: $f(x)=x$ is continuous with no greatest value.</p>`, 'Local maximum is not global maximum.'),
  SC(3, 'monotonicity', [R`$\sin x$ is decreasing on $\left(\dfrac\pi2,\dfrac{3\pi}2\right)$.`, R`$e^{-x}$ is decreasing on $\mathbb R$.`, R`$x^2$ is increasing on $\mathbb R$.`, R`$\dfrac1x$ is decreasing on its whole domain $\mathbb R\setminus\{0\}$.`], '2', ['1', '3', '4'],
    R`<p>(1) True: $\cos x<0$ there. (2) True: derivative $-e^{-x}<0$. (3) False: $x^2$ decreases for $x<0$. (4) False: $f'=-\dfrac1{x^2}<0$, but $f(-1)=-1<f(1)=1$, so it is not decreasing across the break at $0$; it is decreasing on each of $(-\infty,0)$ and $(0,\infty)$. Two are correct.</p>`, 'Monotonic on each interval is not monotonic on the union.'),
  SC(4, 'extrema', [R`$x^3$ has no local extremum.`, R`$|x|$ has a local minimum at $0$.`, R`$\cos x$ has local maxima at $x=2n\pi$.`, R`A local maximum value is the largest value of the function.`], '3', ['2', '4', '1'],
    R`<p>(1) True. (2) True (corner minimum). (3) True: $\cos2n\pi=1$. (4) False: local only compares nearby values. Three are correct.</p>`, 'The word "local" is the catch.'),

  // ---------- multi ----------
  X(2, 'monotonicity', R`Which functions are increasing on all of $\mathbb R$?`, [R`$x^3+x$`, R`$e^x$`, R`$x^3-x$`, R`$x+\sin x$`], [0, 1, 3],
    R`<p>$3x^2+1>0$: yes. $e^x>0$: yes. $3x^2-1$ changes sign: no. $1+\cos x\ge0$ with zeros only at isolated points: yes.</p>`, '$x+\\sin x$ has $f\'=0$ at some points but is still increasing.'),
  X(3, 'extrema', R`For $f(x)=x^3-6x^2+9x$, which statements are true?`, [R`$f$ has three distinct real roots`, R`$f$ has a local maximum at $x=1$`, R`$f$ has a local minimum at $x=3$`, R`$f$ has a point of inflection at $x=2$`], [1, 2, 3],
    R`<p>$f=x(x-3)^2$ has roots $0$ and $3$ (double): two distinct roots, so the first is false. $f'=3(x-1)(x-3)$: maximum at $1$, minimum at $3$. $f''=6x-12=0$ at $2$ with sign change: inflection.</p>`, 'A double root counts once as a distinct root.'),
  X(3, "Rolle's theorem", R`On which given intervals does Rolle's theorem apply to the function?`, [R`$x^2-1$ on $[-1,1]$`, R`$|x|$ on $[-1,1]$`, R`$\cos x$ on $[0,2\pi]$`, R`$x^{2/3}$ on $[-1,1]$`], [0, 2],
    R`<p>$x^2-1$: continuous, differentiable, $f(-1)=f(1)=0$: yes. $|x|$ and $x^{2/3}$ are not differentiable at $0$: no. $\cos x$ with $f(0)=f(2\pi)=1$: yes.</p>`, 'Equal end values are not enough; differentiability inside is needed too.'),
  X(3, 'angle between curves', R`The curves $y=x^2$ and $x=y^2$ meet at $O$ and at $P(1,1)$. Which statements are true?`, [R`They meet at exactly two points`, R`At $O$ they cut at right angles`, R`At $P$ their tangents are perpendicular`, R`At $P$ the acute angle between them is $\tan^{-1}\dfrac34$`], [0, 1, 3],
    R`<p>Solving gives $x=0,1$: two points. At $O$ the tangents are the axes: perpendicular. At $P$: slopes $2$ and $\dfrac1{2}$ (from $x=y^2$: $1=2yy'$), product $1\ne-1$, so not perpendicular; $\tan\theta=\dfrac{2-\frac12}{1+1}=\dfrac34$.</p>`, 'Slopes at $O$ are $0$ and $\\infty$.'),
  X(4, 'extrema', R`For $f(x)=\dfrac x{1+x^2}$, which statements are true?`, [R`$f$ has greatest value $\dfrac12$`, R`$f$ is increasing on $(-1,1)$`, R`$f$ is decreasing on $(1,\infty)$`, R`$f$ is increasing on $(0,\infty)$`], [0, 1, 2],
    R`<p>$f'=\dfrac{1-x^2}{(1+x^2)^2}$: positive on $(-1,1)$, negative for $|x|>1$. Maximum $f(1)=\dfrac12$. The last statement is false since $f$ falls after $x=1$.</p>`, 'Check the sign of $1-x^2$.'),
  X(4, 'optimisation', R`Which statements about optimisation are true?`, [R`Among rectangles of given perimeter the square has the greatest area`, R`Among closed cylinders of given volume the least surface area occurs when $h=2r$`, R`Among rectangles inscribed in a circle the square has the greatest area`, R`Among cones of given slant height the greatest volume has semi-vertical angle $45^\circ$`], [0, 1, 2],
    R`<p>The first three are standard. For a cone of slant height $l$, $V=\dfrac\pi3(l^2-h^2)h$ is greatest at $h=\dfrac l{\sqrt3}$, so $\tan\theta=\dfrac rh=\sqrt2$ and $\theta\approx54.7^\circ$, not $45^\circ$.</p>`, 'The cone result has $\\cos\\theta=1/\\sqrt3$.'),
  X(4, 'extrema', R`For $f(x)=x^4$, which statements are true?`, [R`$f$ has a local minimum at $0$`, R`$f''(0)=0$, so the second derivative test fails at $0$`, R`$f$ has a point of inflection at $0$`, R`$f'$ changes sign from negative to positive at $0$`], [0, 1, 3],
    R`<p>$f'=4x^3$ is negative for $x<0$ and positive for $x>0$: minimum. $f''=12x^2$ is $0$ at $0$ but does not change sign: no inflection.</p>`, 'The first derivative test still works when the second fails.'),
  X(3, "mean value theorem", R`Which consequences of the mean value theorem are true for a differentiable $f$ on an interval?`, [R`If $f'=0$ everywhere, $f$ is constant`, R`If $f'>0$ everywhere, $f$ is strictly increasing`, R`If $f'=g'$ everywhere, $f-g$ is constant`, R`If $f'>0$ except at one point, $f$ cannot be increasing`], [0, 1, 2],
    R`<p>The first three are direct consequences. The last is false: $x^3$ has $f'>0$ except at $0$ and is increasing.</p>`, 'A single point of zero slope does not break monotonicity.'),

  // ---------- matching ----------
  MT(2, 'monotonicity', 'a1', R`Match the functions with their intervals of increase.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-s, B-r, C-q, D-p'],
    R`<p>A: $f'=2x-4>0$ for $x>2$: p. B: $3x^2-3>0$ for $|x|>1$: q. C: $\dfrac1x-1>0$ for $0<x<1$: r. D: $e^{-x}(1-x)>0$ for $x<1$: s.</p>`, 'The domain of $\\ln x$ is $x>0$.'),
  MT(3, 'extreme values', 'a2', R`Match each quantity in List I with its value in List II.`, 'A-q, B-r, C-p, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s'],
    R`<p>A: vertex $x=2$: $4-8+7=3$ (q). B: $x=2$: $8-4=4$ (r). C: $x=1$: $2$ (p). D: $\dfrac12\sin2x\le\dfrac12$ (s).</p>`, 'Minimum for A, maximum for B.'),
  MT(2, 'tangents', 'a3', R`Match the curves with the slopes of their tangents at $x=1$.`, 'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-s, B-q, C-r, D-p'],
    R`<p>A: $3x^2=3$ (r). B: $\dfrac1{2\sqrt x}=\dfrac12$ (p). C: $\dfrac1x=1$ (s). D: $2e^{2x}=2e^2$ (q).</p>`, 'Chain rule gives the factor 2 for D.'),
  MT(3, 'theorems', 'a4', R`Match each situation with the result used to settle it.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-s, C-q, D-p'],
    R`<p>A: equal end values $f(0)=f(4)=0$: Rolle (q). B: average slope: Lagrange (p). C: sign of $f''$ at the critical point: second derivative test (r). D: $f'\ge0$ on both sides, no sign change: first derivative sign test (s).</p>`, 'Rolle is a special case of Lagrange with equal end values.'),

  // ---------- passages ----------
  PI(2, 'optimisation', 'p1', R`Find the value of $x$ (cm) that gives the greatest volume.`, 2,
    R`<p>$V'(x)=(12-2x)^2-4x(12-2x)=(12-2x)(12-6x)=0$. $x=6$ gives zero volume; $x=2$ is the maximum.</p>`, 'Reject $x=6$.', { calc: () => Math.round(argmax((x) => x * (12 - 2 * x) ** 2, 0, 6)) }),
  PI(3, 'optimisation', 'p1', R`What is the greatest volume (cm$^3$)?`, 128,
    R`<p>$V(2)=2\cdot8^2=128$.</p>`, 'Side of the base is $12-2x=8$.', { calc: () => Math.round(Math.max(...Array.from({ length: 6001 }, (_, i) => { const x = i * 0.001; return x * (12 - 2 * x) ** 2; }))) }),
  PI(3, 'optimisation', 'p1', R`For how many whole-number values of $x$ in $(0,6)$ is $V(x)>100$?`, 2,
    R`<p>$V(1)=100$ (not greater), $V(2)=128$, $V(3)=3\cdot36=108$, $V(4)=64$, $V(5)=20$. Only $x=2,3$: two values.</p>`, '$V(1)=100$ exactly, so it is excluded.', { calc: () => [1, 2, 3, 4, 5].filter((x) => x * (12 - 2 * x) ** 2 > 100).length }),
  PI(2, 'maxima and minima', 'p2', R`The tangent is horizontal at two points. Find the sum of their $x$-coordinates.`, 2,
    R`<p>$y'=3x^2-6x=3x(x-2)=0$: $x=0,2$. Sum $=2$.</p>`, 'Horizontal tangent means $y\'=0$.', { calc: () => { const r = []; for (let x = -1; x <= 3; x += 0.001) if (abs(dd((t) => t ** 3 - 3 * t * t + 2, x)) < 0.003) r.push(Math.round(x)); return [...new Set(r)].reduce((a, b) => a + b, 0); } }),
  PI(3, 'tangents', 'p2', R`The tangent at $x=3$ meets the $y$-axis at $(0,k)$. Find $k$.`, -25,
    R`<p>$y(3)=2$, slope $=27-18=9$. $y-2=9(x-3)$, so $y=9x-25$; at $x=0$, $k=-25$.</p>`, 'Intercept is negative.', { calc: () => { const f = (x) => x ** 3 - 3 * x * x + 2; return Math.round(f(3) - dd(f, 3) * 3); } }),
  PI(3, 'number of roots', 'p2', R`How many times does the curve cut the $x$-axis?`, 3,
    R`<p>$x^3-3x^2+2=(x-1)(x^2-2x-2)$. Roots: $1$ and $1\pm\sqrt3$: three distinct real roots. (Check: local max $y(0)=2>0$, local min $y(2)=-2<0$.)</p>`, 'Use the sign of $y$ at the local maximum and minimum.', { calc: () => { let n = 0, prev = -27 - 27 + 2; for (let x = -3; x <= 4; x += 0.001) { const v = x ** 3 - 3 * x * x + 2; if (prev * v < 0) n++; prev = v; } return n; } }),
  PI(2, 'related rates', 'p3', R`Find $y$ (m) at that instant.`, 4,
    R`<p>$x^2+y^2=25$ with $x=3$ gives $y=4$.</p>`, 'Pythagoras.', { calc: () => Math.round(sqrt(25 - 9)) }),
  PD(3, 'related rates', 'p3', R`How fast (m/s) is the top moving down at that instant?`, 0.375,
    R`<p>$x\dot x+y\dot y=0$. $3(0.5)+4\dot y=0$, $\dot y=-0.375$. The top moves down at $0.375$ m/s.</p>`, 'The top moves slower than the foot here because $x<y$.', { calc: () => { const f = (t) => sqrt(25 - (3 + 0.5 * t) ** 2); return -dd(f, 0); } }),
  PD(4, 'related rates', 'p3', R`At what distance $x$ (m) of the foot from the wall are the foot and the top moving at equal speeds?`, 3.5355,
    R`<p>Top speed $=\dfrac xy\cdot0.5$, equal to $0.5$ when $x=y$. Then $2x^2=25$, $x=\dfrac5{\sqrt2}\approx3.54$.</p>`, 'Equal speeds means $x=y$, the ladder at $45^\\circ$.', { calc: () => { let best = 0, bd = 1e9; for (let x = 0.01; x < 5; x += 0.0001) { const d = abs(x / sqrt(25 - x * x) - 1); if (d < bd) { bd = d; best = x; } } return best; } }),
];

items.forEach((it, i) => { it.id = `ad-${String(i + 1).padStart(3, '0')}`; });

// ---------- number templates ----------
const tm = (c, p, first) => { if (c === 0) return ''; const a = Math.abs(c); const sg = c < 0 ? '-' : first ? '' : '+'; const co = a === 1 && p > 0 ? '' : String(a); const x = p === 0 ? '' : p === 1 ? 'x' : `x^{${p}}`; return sg + co + x; };
const poly = (...pairs) => { let s = ''; pairs.forEach(([c, p]) => { s += tm(c, p, s === ''); }); return s || '0'; };
const ev = (pairs, x) => pairs.reduce((s, [c, p]) => s + c * x ** p, 0);
const ptex = (v) => (v < 0 ? `-${-v}` : `${v}`);
const lineTeX = (m, k) => `y=${m === 1 ? '' : m === -1 ? '-' : m}x${k === 0 ? '' : k < 0 ? `-${-k}` : `+${k}`}`;
const nonzero = (rng, lo, hi) => { let v; do { v = int(rng, lo, hi); } while (v === 0); return v; };
const countSign = (f, a, b, step = 0.001) => { let n = 0, prev = f(a); for (let x = a + step; x <= b; x += step) { const v = f(x); if (prev * v < 0) n++; prev = v; } return n; };
const sub = (x) => (Number.isInteger(x) ? String(x) : String(+x.toFixed(4)));

const gens = [
  gen('ad-g01', 1, 'nat', 'integer', 'rate of change', (rng) => {
    const k = int(rng, 0, 3), u = int(rng, 1, 5);
    if (k === 0) { const r = int(rng, 2, 9); return { k, r, u, answer: 2 * r * u, tol: 0,
      q: R`The radius of a circle grows at $${u}$ cm/s. How fast is its area growing when $r=${r}$ cm? Give the number that multiplies $\pi$ (cm$^2$/s).`,
      sol: R`<p>$A=\pi r^2$, $\dfrac{dA}{dt}=2\pi r\dfrac{dr}{dt}=2\pi\cdot${r}\cdot${u}=${2 * r * u}\pi$. The number is $${2 * r * u}$.</p>` }; }
    if (k === 1) { const r = int(rng, 2, 9); return { k, r, u, answer: 4 * r * r * u, tol: 0,
      q: R`The radius of a sphere grows at $${u}$ cm/s. How fast is its volume growing when $r=${r}$ cm? Give the number that multiplies $\pi$ (cm$^3$/s).`,
      sol: R`<p>$V=\dfrac43\pi r^3$, $\dfrac{dV}{dt}=4\pi r^2\dfrac{dr}{dt}=4\pi\cdot${r * r}\cdot${u}=${4 * r * r * u}\pi$.</p>` }; }
    if (k === 2) { const a = int(rng, 2, 9); return { k, r: a, u, answer: 3 * a * a * u, tol: 0,
      q: R`The edge of a cube grows at $${u}$ cm/s. How fast (cm$^3$/s) does the volume grow when the edge is $${a}$ cm?`,
      sol: R`<p>$V=a^3$, $\dfrac{dV}{dt}=3a^2\dfrac{da}{dt}=3\cdot${a * a}\cdot${u}=${3 * a * a * u}$.</p>` }; }
    const r = int(rng, 2, 9); return { k, r, u, answer: 8 * r * u, tol: 0,
      q: R`The radius of a sphere grows at $${u}$ cm/s. How fast is its surface area growing when $r=${r}$ cm? Give the number that multiplies $\pi$ (cm$^2$/s).`,
      sol: R`<p>$S=4\pi r^2$, $\dfrac{dS}{dt}=8\pi r\dfrac{dr}{dt}=8\pi\cdot${r}\cdot${u}=${8 * r * u}\pi$.</p>` };
  }, (p) => { const f = [(r) => r * r, (r) => (4 / 3) * r ** 3, (a) => a ** 3, (r) => 4 * r * r][p.k]; return Math.round(dd(f, p.r) * p.u); }),

  gen('ad-g02', 1, 'nat', 'integer', 'tangent slope', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = nonzero(rng, -4, 5), b = int(rng, -6, 6), c = int(rng, -5, 5), x0 = int(rng, -3, 4); const ans = 2 * a * x0 + b;
      return { k, a, b, c, x0, answer: ans, tol: 0, q: R`Find the slope of the tangent to $y=${poly([a, 2], [b, 1], [c, 0])}$ at $x=${x0}$.`,
        sol: R`<p>$y'=${poly([2 * a, 1], [b, 0])}$. At $x=${x0}$: $${2 * a}\cdot${ptex(x0)}${b < 0 ? '-' : '+'}${abs(b)}=${ans}$.</p>` }; }
    if (k === 1) { const a = nonzero(rng, -3, 4), b = int(rng, -5, 5), x0 = int(rng, -3, 3); const ans = 3 * a * x0 * x0 + b;
      return { k, a, b, x0, answer: ans, tol: 0, q: R`Find the slope of the tangent to $y=${poly([a, 3], [b, 1])}$ at $x=${x0}$.`,
        sol: R`<p>$y'=${poly([3 * a, 2], [b, 0])}$. At $x=${x0}$: $${3 * a}\cdot${x0 * x0}${b < 0 ? '-' : '+'}${abs(b)}=${ans}$.</p>` }; }
    const s = int(rng, 1, 6), kk = 2 * int(rng, 1, 4); const ans = kk / (2 * s);
    if (!Number.isInteger(ans)) { const kk2 = 2 * s * int(rng, 1, 3); return { k, s, kk: kk2, x0: s * s, answer: kk2 / (2 * s), tol: 0, q: R`Find the slope of the tangent to $y=${kk2}\sqrt x$ at $x=${s * s}$.`, sol: R`<p>$y'=\dfrac{${kk2}}{2\sqrt x}$. At $x=${s * s}$: $\dfrac{${kk2}}{${2 * s}}=${kk2 / (2 * s)}$.</p>` }; }
    return { k, s, kk, x0: s * s, answer: ans, tol: 0, q: R`Find the slope of the tangent to $y=${kk}\sqrt x$ at $x=${s * s}$.`, sol: R`<p>$y'=\dfrac{${kk}}{2\sqrt x}$. At $x=${s * s}$: $\dfrac{${kk}}{${2 * s}}=${ans}$.</p>` };
  }, (p) => { const f = [(x) => p.a * x * x + p.b * x + p.c, (x) => p.a * x ** 3 + p.b * x, (x) => p.kk * sqrt(x)][p.k]; return Math.round(dd(f, p.x0, 1e-4)); }),

  gen('ad-g03', 1, 'mcq', 'single', 'monotonicity', (rng) => {
    const a = choose(rng, [1, 2, -1, -2]), h = nonzero(rng, -4, 5), inc = choose(rng, [true, false]);
    const b = -2 * a * h, c = int(rng, -3, 6);
    const goodInc = a > 0 ? `$(${h},\\infty)$` : `$(-\\infty,${h})$`, goodDec = a > 0 ? `$(-\\infty,${h})$` : `$(${h},\\infty)$`;
    const good = inc ? goodInc : goodDec;
    const { options, answer } = shuffleOpts(rng, good, [inc ? goodDec : goodInc, `$(${-h},\\infty)$`, `$(-\\infty,${-h})$`]);
    return { a, h, b, c, inc, good, options, answer,
      q: R`$f(x)=${poly([a, 2], [b, 1], [c, 0])}$ is ${inc ? 'increasing' : 'decreasing'} on`,
      sol: R`<p>$f'(x)=${poly([2 * a, 1], [b, 0])}=${2 * a}(x${sgn(-h)})$. It is ${a > 0 ? 'positive for $x>' + h + '$ and negative for $x<' + h : 'negative for $x>' + h + '$ and positive for $x<' + h}$. So $f$ is ${inc ? 'increasing' : 'decreasing'} on ${good}.</p>` };
  }, (p) => { const f = (x) => p.a * x * x + p.b * x + p.c; const rightUp = dd(f, p.h + 1) > 0; const incRight = rightUp; const g = p.inc ? (incRight ? `$(${p.h},\\infty)$` : `$(-\\infty,${p.h})$`) : (incRight ? `$(-\\infty,${p.h})$` : `$(${p.h},\\infty)$`); return p.options.indexOf(g); }),

  gen('ad-g04', 2, 'nat', 'integer', 'local extrema of a cubic', (rng) => {
    let r1, r2; do { r1 = int(rng, -3, 2); r2 = int(rng, r1 + 2, r1 + 5); } while ((r1 + r2) % 2 !== 0);
    const a2 = (-3 * (r1 + r2)) / 2, a1 = 3 * r1 * r2, c0 = int(rng, 0, 5), kind = int(rng, 0, 2);
    const F = [[1, 3], [a2, 2], [a1, 1], [c0, 0]];
    const fmax = ev(F, r1), fmin = ev(F, r2);
    const answer = kind === 0 ? fmax : kind === 1 ? fmin : fmax - fmin;
    return { r1, r2, c0, kind, a2, a1, answer, tol: 0,
      q: R`For $f(x)=${poly(...F)}$, find ${kind === 0 ? 'the local maximum value' : kind === 1 ? 'the local minimum value' : 'the local maximum value minus the local minimum value'}.`,
      sol: R`<p>$f'(x)=3x^2${sgn(2 * a2)}x${sgn(a1)}=3(x${sgn(-r1)})(x${sgn(-r2)})$. The sign goes $+,-,+$, so the local maximum is at $x=${r1}$ and the local minimum at $x=${r2}$. $f(${r1})=${fmax}$ and $f(${r2})=${fmin}$. The answer is $${answer}$.</p>` };
  }, (p) => { const f = (x) => x ** 3 + p.a2 * x * x + p.a1 * x + p.c0; const mx = Math.max(...Array.from({ length: 2001 }, (_, i) => f(p.r1 - 1 + i * 0.001))); const mn = Math.min(...Array.from({ length: 2001 }, (_, i) => f(p.r2 - 1 + i * 0.001))); const lm = f(p.r1); const ln2 = f(p.r2); void mx; void mn; return Math.round(p.kind === 0 ? lm : p.kind === 1 ? ln2 : lm - ln2); }),

  gen('ad-g05', 2, 'nat', 'integer', 'global extrema on an interval', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const p0 = int(rng, 1, 3), b = int(rng, p0 + 1, 2 * p0 + 1); const f = (x) => x ** 3 - 3 * p0 * p0 * x; const mx = Math.max(0, f(b)), mn = -2 * p0 ** 3;
      return { k, p0, b, answer: mx - mn, tol: 0, q: R`Find (greatest value) $-$ (least value) of $f(x)=x^3-${3 * p0 * p0}x$ on $[0,${b}]$.`,
        sol: R`<p>$f'=3x^2-${3 * p0 * p0}=0$ gives $x=${p0}$ in the interval. $f(0)=0$, $f(${p0})=${-2 * p0 ** 3}$, $f(${b})=${f(b)}$. Greatest $=${mx}$, least $=${mn}$. Difference $=${mx - mn}$.</p>` }; }
    if (k === 1) { const h = int(rng, 1, 3), top = int(rng, 4, 12), lo = h + int(rng, 1, 3), hi = lo + int(rng, 1, 3);
      return { k, h, top, lo, hi, answer: top - (lo - h) ** 2, tol: 0, q: R`Find the greatest value of $f(x)=${top}-(x-${h})^2$ on $[${lo},${hi}]$.`,
        sol: R`<p>The parabola has its vertex at $x=${h}$, outside $[${lo},${hi}]$ (to the left), and $f$ is decreasing on the interval. The greatest value is at the left end: $f(${lo})=${top}-${(lo - h) ** 2}=${top - (lo - h) ** 2}$.</p>` }; }
    const s = choose(rng, [2, 4, 6]); const hi = 2 * s;
    return { k, s, hi, answer: 1 + s * s, tol: 0, q: R`Find the greatest value of $f(x)=x+\dfrac{${s * s}}x$ on $[1,${hi}]$.`,
      sol: R`<p>$f'=1-\dfrac{${s * s}}{x^2}=0$ at $x=${s}$ (a minimum, $f=${2 * s}$). Ends: $f(1)=${1 + s * s}$, $f(${hi})=${hi}+${s * s / hi}=${hi + (s * s) / hi}$. The greatest is $${1 + s * s}$.</p>` };
  }, (p) => { if (p.k === 0) { const f = (x) => x ** 3 - 3 * p.p0 * p.p0 * x; const v = Array.from({ length: p.b * 1000 + 1 }, (_, i) => f(i * 0.001)); return Math.round(Math.max(...v) - Math.min(...v)); } if (p.k === 1) return Math.round(Math.max(...Array.from({ length: 4001 }, (_, i) => { const x = p.lo + (i * (p.hi - p.lo)) / 4000; return p.top - (x - p.h) ** 2; }))); return Math.round(Math.max(...Array.from({ length: 8001 }, (_, i) => { const x = 1 + (i * (p.hi - 1)) / 8000; return x + (p.s * p.s) / x; }))); }),

  gen('ad-g06', 2, 'nat', 'integer', 'tangent and normal intercepts', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = nonzero(rng, -3, 3), b = int(rng, -4, 4), c = int(rng, -5, 5), x0 = int(rng, -3, 3); const ans = c - a * x0 * x0;
      return { k, a, b, c, x0, answer: ans, tol: 0, q: R`The tangent to $y=${poly([a, 2], [b, 1], [c, 0])}$ at $x=${x0}$ meets the $y$-axis at $(0,m)$. Find $m$.`,
        sol: R`<p>Slope $=${2 * a * x0 + b}$, $y_0=${a * x0 * x0 + b * x0 + c}$. Tangent: $y-${a * x0 * x0 + b * x0 + c}=${2 * a * x0 + b}(x-${ptex(x0)})$. At $x=0$: $m=${a * x0 * x0 + b * x0 + c}-(${2 * a * x0 + b})(${ptex(x0)})=${ans}$. (Shortcut: $m=c-ax_0^2$.)</p>` }; }
    if (k === 1) { const m = int(rng, 1, 5), x0 = 3 * m; return { k, m, x0, answer: 2 * m, tol: 0, q: R`The tangent to $y=x^3$ at $x=${x0}$ meets the $x$-axis at $(t,0)$. Find $t$.`,
      sol: R`<p>Slope $=3x_0^2=${3 * x0 * x0}$. Tangent: $y-${x0 ** 3}=${3 * x0 * x0}(x-${x0})$, i.e. $y=${3 * x0 * x0}x-${2 * x0 ** 3}$. Put $y=0$: $x=\dfrac{${2 * x0 ** 3}}{${3 * x0 * x0}}=${2 * m}$.</p>` }; }
    const x0 = int(rng, 1, 3); return { k, x0, answer: x0 + 2 * x0 ** 3, tol: 0, q: R`The normal to $y=x^2$ at $x=${x0}$ meets the $x$-axis at $(t,0)$. Find $t$.`,
      sol: R`<p>Tangent slope $=2x_0=${2 * x0}$, so the normal slope is $-\dfrac1{${2 * x0}}$. Normal: $y-${x0 * x0}=-\dfrac1{${2 * x0}}(x-${x0})$. With $y=0$: $x-${x0}=${2 * x0}\cdot${x0 * x0}=${2 * x0 ** 3}$, so $t=${x0 + 2 * x0 ** 3}$.</p>` };
  }, (p) => { if (p.k === 0) { const f = (x) => p.a * x * x + p.b * x + p.c; return Math.round(f(p.x0) - dd(f, p.x0, 1e-4) * p.x0); } if (p.k === 1) { const f = (x) => x ** 3; return Math.round(p.x0 - f(p.x0) / dd(f, p.x0, 1e-4)); } const f = (x) => x * x; const mn = -1 / dd(f, p.x0, 1e-4); return Math.round(p.x0 + f(p.x0) / -mn); }),

  gen('ad-g07', 2, 'nat', 'numeric', 'ladder related rates', (rng) => {
    const [L, x, y] = choose(rng, [[5, 3, 4], [10, 6, 8], [13, 5, 12], [13, 12, 5], [15, 9, 12], [17, 8, 15], [25, 7, 24], [25, 15, 20], [26, 10, 24], [20, 12, 16]]);
    const v = choose(rng, [1, 2, 3, 0.5, 1.5]), k = int(rng, 0, 2);
    if (k === 0) { const ans = r2((x * v) / y); return { k, L, x, y, v, answer: ans, tol: 0.01, q: R`A ${L} m ladder leans on a wall. Its foot is ${x} m from the wall and is pulled away at ${v} m/s. How fast (m/s) is the top moving down? ${TWOD}`, sol: R`<p>$x^2+y^2=${L * L}$, so $x\dot x+y\dot y=0$. With $y=${y}$: $\dot y=-\dfrac{${x}\cdot${v}}{${y}}=-${ans}$. The top moves down at $${ans}$ m/s.</p>` }; }
    if (k === 1) { const ans = r2(v / y); return { k, L, x, y, v, answer: ans, tol: 0.01, q: R`A ${L} m ladder leans on a wall. Its foot is ${x} m from the wall and is pulled away at ${v} m/s. How fast (rad/s) is the angle between the ladder and the ground decreasing? ${TWOD}`, sol: R`<p>$x=${L}\cos\theta$, so $\dot x=-${L}\sin\theta\,\dot\theta$. Here $${L}\sin\theta=y=${y}$, so $|\dot\theta|=\dfrac{${v}}{${y}}=${ans}$ rad/s.</p>` }; }
    const ans = r2((v * (y * y - x * x)) / (2 * y)); return { k, L, x, y, v, answer: ans, tol: 0.01, q: R`A ${L} m ladder leans on a wall. Its foot is ${x} m from the wall and is pulled away at ${v} m/s. Find the rate of change of the area (m$^2$/s) of the triangle formed by the ladder, wall and ground (negative if it is decreasing). ${TWOD}`, sol: R`<p>$A=\dfrac{xy}2$, $\dot A=\dfrac{\dot xy+x\dot y}2$ with $\dot y=-\dfrac{x\dot x}y$: $\dot A=\dfrac{\dot x(y^2-x^2)}{2y}=\dfrac{${v}(${y * y}-${x * x})}{${2 * y}}=${ans}$.</p>` };
  }, (p) => { const X = (t) => p.x + p.v * t, Y = (t) => sqrt(p.L ** 2 - X(t) ** 2); if (p.k === 0) return -dd(Y, 0); if (p.k === 1) return abs(dd((t) => Math.acos(X(t) / p.L), 0)); return dd((t) => (X(t) * Y(t)) / 2, 0); }),

  gen('ad-g08', 2, 'nat', 'integer', 'volume rates', (rng) => {
    const k = int(rng, 0, 2), u = int(rng, 1, 5);
    if (k === 0) { const d = choose(rng, [2, 3, 4]), m = int(rng, 1, 4); const h0 = d * m; return { k, d, m, u, h0, answer: u, tol: 0, q: R`Water is poured into an inverted cone whose radius is always $\dfrac1{${d}}$ of the water depth, at $${m * m * u}\pi$ cm$^3$/s. How fast (cm/s) is the depth increasing when it is $${h0}$ cm? (Answer in whole cm/s: it is $${u}$ in the working below.)`.replace(/ \(Answer in whole.*$/, ''),
      sol: R`<p>$r=\dfrac h{${d}}$, $V=\dfrac13\pi r^2h=\dfrac{\pi h^3}{${3 * d * d}}$. $\dfrac{dV}{dt}=\dfrac{\pi h^2}{${d * d}}\dfrac{dh}{dt}$. At $h=${h0}$: $${m * m * u}\pi=${m * m}\pi\dfrac{dh}{dt}$, so $\dfrac{dh}{dt}=${u}$ cm/s.</p>` }; }
    if (k === 1) { const r = int(rng, 2, 6); return { k, r, u, answer: u, tol: 0, q: R`Water flows into a cylindrical tank of radius $${r}$ cm at $${r * r * u}\pi$ cm$^3$/s. How fast (cm/s) does the water level rise?`, sol: R`<p>$V=\pi r^2h$ with $r=${r}$ constant: $\dfrac{dV}{dt}=${r * r}\pi\dfrac{dh}{dt}$. $${r * r * u}\pi=${r * r}\pi\dot h$, so $\dot h=${u}$.</p>` }; }
    const r = int(rng, 2, 6); return { k, r, u, answer: u, tol: 0, q: R`Gas is pumped into a spherical balloon at $${4 * r * r * u}\pi$ cm$^3$/s. How fast (cm/s) is the radius growing when $r=${r}$ cm?`, sol: R`<p>$\dfrac{dV}{dt}=4\pi r^2\dfrac{dr}{dt}$. $${4 * r * r * u}\pi=4\pi\cdot${r * r}\dot r$, so $\dot r=${u}$.</p>` };
  }, (p) => { if (p.k === 0) { const V = (h) => (PI_ * h ** 3) / (3 * p.d * p.d); return Math.round((p.m * p.m * p.u * PI_) / dd(V, p.h0)); } if (p.k === 1) return Math.round((p.r * p.r * p.u * PI_) / dd((h) => PI_ * p.r * p.r * h, 3)); return Math.round((4 * p.r * p.r * p.u * PI_) / dd((r) => (4 / 3) * PI_ * r ** 3, p.r)); }),

  gen('ad-g09', 2, 'nat', 'numeric', 'mean value theorem', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = int(rng, 0, 4), b = a + 2 * int(rng, 1, 4); const c = (a + b) / 2; return { k, a, b, answer: c, tol: 0.01, q: R`For $f(x)=x^2-${a + b}x$ on $[${a},${b}]$, find the value $c$ guaranteed by Rolle's theorem.`, sol: R`<p>$f(${a})=f(${b})=${a * a - (a + b) * a}$. $f'(c)=2c-${a + b}=0$ gives $c=${c}$.</p>` }; }
    if (k === 1) { const a = int(rng, 0, 3), b = a + int(rng, 1, 4); const c = r4(sqrt((a * a + a * b + b * b) / 3)); return { k, a, b, answer: c, tol: 0.01, q: R`Find the value $c$ of the mean value theorem for $f(x)=x^3$ on $[${a},${b}]$ (2 decimal places).`, sol: R`<p>Average slope $=\dfrac{${b ** 3}-${a ** 3}}{${b - a}}=${a * a + a * b + b * b}$. $3c^2=${a * a + a * b + b * b}$, $c=\sqrt{${(a * a + a * b + b * b) / 3 === Math.floor((a * a + a * b + b * b) / 3) ? (a * a + a * b + b * b) / 3 : r4((a * a + a * b + b * b) / 3)}}\approx${c}$, which lies in $(${a},${b})$.</p>` }; }
    const s = int(rng, 1, 3), t = s + int(rng, 1, 3), a = s * s, b = t * t; const c = ((s + t) / 2) ** 2; return { k, a, b, s, t, answer: c, tol: 0.01, q: R`Find the value $c$ of the mean value theorem for $f(x)=\sqrt x$ on $[${a},${b}]$.`, sol: R`<p>Average slope $=\dfrac{${t}-${s}}{${b}-${a}}=\dfrac1{${s + t}}$. $f'(c)=\dfrac1{2\sqrt c}=\dfrac1{${s + t}}$, so $\sqrt c=${(s + t) / 2}$ and $c=${c}$.</p>` };
  }, (p) => { const f = [(x) => x * x - (p.a + p.b) * x, (x) => x ** 3, sqrt][p.k]; const sl = p.k === 0 ? 0 : (f(p.b) - f(p.a)) / (p.b - p.a); let lo = p.a + 1e-9, hi = p.b - 1e-9; const g = (x) => dd(f, x, 1e-6) - sl; const inc = g(hi) > g(lo); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((g(m) < 0) === inc) lo = m; else hi = m; } return lo; }),

  gen('ad-g10', 2, 'nat', 'numeric', 'approximation by differentials', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = choose(rng, [4, 9, 16, 25, 36, 49, 64, 81, 100]), d = choose(rng, [-0.4, -0.2, 0.2, 0.4, 0.6, 0.8]); const s = sqrt(a); const ans = r4(s + d / (2 * s)); return { k, a, d, answer: ans, tol: 0.0006, q: R`Using differentials, find the approximate value of $\sqrt{${r2(a + d)}}$ (4 decimal places).`, sol: R`<p>$f(x)=\sqrt x$, $x=${a}$, $\Delta x=${d}$. $f'(${a})=\dfrac1{${2 * s}}$. $f(x+\Delta x)\approx${s}+\dfrac{${d}}{${2 * s}}=${ans}$.</p>` }; }
    if (k === 1) { const c = int(rng, 2, 5), d = choose(rng, [-0.5, -0.3, 0.3, 0.6, 0.9]); const a = c ** 3; const ans = r4(c + d / (3 * c * c)); return { k, a, d, c, answer: ans, tol: 0.0006, q: R`Using differentials, find the approximate value of $\sqrt[3]{${r2(a + d)}}$ (4 decimal places).`, sol: R`<p>$f(x)=x^{1/3}$, $x=${a}$, $\Delta x=${d}$. $f'(${a})=\dfrac1{3\cdot${c * c}}=\dfrac1{${3 * c * c}}$. $f\approx${c}+\dfrac{${d}}{${3 * c * c}}=${ans}$.</p>` }; }
    const a = choose(rng, [5, 10, 20]), d = choose(rng, [0.1, 0.2, 0.5, -0.5, -0.2]); const ans = r4(1 / a - d / (a * a)); return { k, a, d, answer: ans, tol: 0.0006, q: R`Using differentials, find the approximate value of $\dfrac1{${r2(a + d)}}$ (4 decimal places).`, sol: R`<p>$f(x)=\dfrac1x$, $x=${a}$, $\Delta x=${d}$. $f'(x)=-\dfrac1{x^2}=-\dfrac1{${a * a}}$. $f\approx\dfrac1{${a}}-\dfrac{${d}}{${a * a}}=${ans}$.</p>` };
  }, (p) => { const f = [sqrt, Math.cbrt, (x) => 1 / x][p.k]; return f(p.a) + dd(f, p.a, 1e-4) * p.d; }),

  gen('ad-g11', 3, 'nat', 'integer', 'optimisation (rectangles and boxes)', (rng) => {
    const k = int(rng, 0, 3);
    if (k === 0) { const Lm = 4 * int(rng, 3, 20); return { k, Lm, answer: (Lm * Lm) / 8, tol: 0, q: R`A farmer has $${Lm}$ m of fencing to enclose a rectangular field along a straight river. No fence is needed along the river. The greatest area (m$^2$) is`, sol: R`<p>Two widths $x$ and one length $y$: $2x+y=${Lm}$. $A=x(${Lm}-2x)$, $A'=${Lm}-4x=0$ gives $x=${Lm / 4}$, $y=${Lm / 2}$. $A=${Lm / 4}\cdot${Lm / 2}=${(Lm * Lm) / 8}$.</p>` }; }
    if (k === 1) { const s = 6 * int(rng, 2, 6); return { k, s, answer: (2 * s ** 3) / 27, tol: 0, q: R`A square sheet of side $${s}$ cm has squares of side $x$ cm cut from its corners and is folded into an open box. The greatest volume (cm$^3$) is`, sol: R`<p>$V=x(${s}-2x)^2$, $V'=(${s}-2x)(${s}-6x)=0$, $x=${s / 6}$. $V=${s / 6}\cdot${(2 * s) / 3}^2=${(2 * s ** 3) / 27}$.</p>` }; }
    if (k === 2) { const x = 2 * int(rng, 1, 5), V = x ** 3 / 2; return { k, x, V, answer: 3 * x * x, tol: 0, q: R`An open-topped box with a square base must hold $${V}$ cm$^3$. The least possible area of material (cm$^2$) is`, sol: R`<p>Base side $x$, height $h=\dfrac{${V}}{x^2}$. $S=x^2+4xh=x^2+\dfrac{${4 * V}}x$. $S'=2x-\dfrac{${4 * V}}{x^2}=0$ gives $x^3=${2 * V}$, $x=${x}$. $S=${x * x}+${(4 * V) / x}=${3 * x * x}$.</p>` }; }
    const P = 4 * int(rng, 3, 15); return { k, P, answer: (P * P) / 16, tol: 0, q: R`A rectangle has perimeter $${P}$ cm. Its greatest area (cm$^2$) is`, sol: R`<p>Sides $x$ and $${P / 2}-x$: $A=x(${P / 2}-x)$, greatest at $x=${P / 4}$: $A=${P / 4}^2=${(P * P) / 16}$.</p>` };
  }, (p) => { if (p.k === 0) return Math.round(Math.max(...Array.from({ length: 4001 }, (_, i) => { const x = (i * p.Lm) / 2 / 4000; return x * (p.Lm - 2 * x); }))); if (p.k === 1) return Math.round(Math.max(...Array.from({ length: 6001 }, (_, i) => { const x = (i * p.s) / 2 / 6000; return x * (p.s - 2 * x) ** 2; }))); if (p.k === 2) return Math.round(Math.min(...Array.from({ length: 20000 }, (_, i) => { const x = 0.5 + i * 0.001; return x * x + (4 * p.V) / x; }))); return Math.round(Math.max(...Array.from({ length: 4001 }, (_, i) => { const x = (i * p.P) / 2 / 4000; return x * (p.P / 2 - x); }))); }),

  gen('ad-g12', 3, 'mcq', 'single', 'increasing and decreasing intervals', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { let r1, r2; do { r1 = int(rng, -3, 2); r2 = int(rng, r1 + 2, r1 + 5); } while ((r1 + r2) % 2 !== 0);
      const inc = choose(rng, [true, false]); const a2 = (-3 * (r1 + r2)) / 2, a1 = 3 * r1 * r2; const gi = `$(-\\infty,${r1})\\cup(${r2},\\infty)$`, gd = `$(${r1},${r2})$`; const good = inc ? gi : gd;
      const { options, answer } = shuffleOpts(rng, good, [inc ? gd : gi, `$(${-r2},${-r1})$`, `$(${r1},\\infty)$`]);
      return { k, r1, r2, inc, a2, a1, options, answer, q: R`$f(x)=x^3${sgn(a2)}x^2${sgn(a1)}x$ is ${inc ? 'increasing' : 'decreasing'} on`, sol: R`<p>$f'(x)=3x^2${sgn(2 * a2)}x${sgn(a1)}=3(x${sgn(-r1)})(x${sgn(-r2)})$. Positive outside $[${r1},${r2}]$, negative inside. So $f$ is ${inc ? 'increasing' : 'decreasing'} on ${good}.</p>` }; }
    if (k === 1) { const n = int(rng, 2, 5); const good = n % 2 === 0 ? `$(0,${n})$` : `$(-\\infty,${n})$`;
      const { options, answer } = shuffleOpts(rng, good, [n % 2 === 0 ? `$(-\\infty,${n})$` : `$(0,${n})$`, `$(${n},\\infty)$`, `$(-\\infty,0)\\cup(${n},\\infty)$`]);
      return { k, n, options, answer, q: R`$f(x)=x^{${n}}e^{-x}$ is increasing on`, sol: R`<p>$f'(x)=x^{${n - 1}}e^{-x}(${n}-x)$. Since $e^{-x}>0$, the sign is that of $x^{${n - 1}}(${n}-x)$. ${n % 2 === 0 ? `$x^{${n - 1}}$ is odd, negative for $x<0$, so $f'<0$ there; positive on $(0,${n})$.` : `$x^{${n - 1}}$ is an even power, never negative, so $f'\\ge0$ for all $x<${n}$ (zero only at $x=0$).`} So $f$ is increasing on ${good}.</p>` }; }
    const a = int(rng, 1, 6), inc = choose(rng, [true, false]); const good = inc ? `$(${a},\\infty)$` : `$(0,${a})$`;
    const { options, answer } = shuffleOpts(rng, good, [inc ? `$(0,${a})$` : `$(${a},\\infty)$`, `$(-\\infty,${a})$`, `$(0,\\infty)$`]);
    return { k, a, inc, options, answer, q: R`$f(x)=x-${a === 1 ? '' : a}\ln x$ is ${inc ? 'increasing' : 'decreasing'} on`, sol: R`<p>Domain $x>0$. $f'(x)=1-\dfrac${'{' + a + '}'}x=\dfrac{x-${a}}x$. Negative for $0<x<${a}$, positive for $x>${a}$. So $f$ is ${inc ? 'increasing' : 'decreasing'} on ${good}.</p>` };
  }, (p) => { let f, test, text; if (p.k === 0) { f = (x) => x ** 3 + p.a2 * x * x + p.a1 * x; const outside = dd(f, p.r1 - 1) > 0; const gi = `$(-\\infty,${p.r1})\\cup(${p.r2},\\infty)$`, gd = `$(${p.r1},${p.r2})$`; text = p.inc === outside ? gi : gd; return p.options.indexOf(text); } if (p.k === 1) { f = (x) => x ** p.n * exp(-x); const neg = dd(f, -1) > 0; text = neg ? `$(-\\infty,${p.n})$` : `$(0,${p.n})$`; return p.options.indexOf(text); } f = (x) => x - p.a * ln(x); const upRight = dd(f, p.a + 1) > 0; text = (p.inc === upRight) ? `$(${p.a},\\infty)$` : `$(0,${p.a})$`; return p.options.indexOf(text); }),

  gen('ad-g13', 3, 'nat', 'integer', 'monotonicity with a parameter', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const pp = int(rng, 3, 30); const cnt = 2 * Math.floor(sqrt(3 * pp)) + 1; return { k, pp, answer: cnt, tol: 0, q: R`$f(x)=x^3+kx^2+${pp}x+1$ is increasing on all of $\mathbb R$ for how many integer values of $k$?`, sol: R`<p>$f'(x)=3x^2+2kx+${pp}\ge0$ for all $x$ needs $4k^2-12\cdot${pp}\le0$, i.e. $k^2\le${3 * pp}$. So $|k|\le${Math.floor(sqrt(3 * pp))}$ and the count is $2\cdot${Math.floor(sqrt(3 * pp))}+1=${cnt}$.</p>` }; }
    if (k === 1) { const a = choose(rng, [1.5, 2, 2.5, 3.2, 4, 4.5, 5.5, 6]); const ans = Math.ceil(a); return { k, a, answer: ans, tol: 0, q: R`The least integer $k$ for which $f(x)=kx-${a}\sin x$ is increasing on $\mathbb R$ is`, sol: R`<p>$f'(x)=k-${a}\cos x\ge0$ for all $x$ needs $k\ge${a}$. The least integer is $${ans}$.</p>` }; }
    let r1, r2; do { r1 = int(rng, -3, 2); r2 = int(rng, r1 + 2, r1 + 5); } while ((r1 + r2) % 2 !== 0);
    const pp = (-3 * (r1 + r2)) / 2, qq = 3 * r1 * r2; return { k, r1, r2, pp, qq, answer: pp + qq, tol: 0, q: R`$f(x)=x^3+px^2+qx$ is decreasing exactly on $(${r1},${r2})$. Find $p+q$.`, sol: R`<p>$f'(x)=3x^2+2px+q$ must equal $3(x${sgn(-r1)})(x${sgn(-r2)})=3x^2${sgn(-3 * (r1 + r2))}x${sgn(3 * r1 * r2)}$. So $2p=${-3 * (r1 + r2)}$, $p=${pp}$, and $q=${qq}$. $p+q=${pp + qq}$.</p>` };
  }, (p) => { if (p.k === 0) { let c = 0; for (let kk = -40; kk <= 40; kk++) { let ok = true; for (let x = -30; x <= 30; x += 0.01) if (3 * x * x + 2 * kk * x + p.pp < -1e-9) { ok = false; break; } if (ok) c++; } return c; } if (p.k === 1) { for (let kk = -10; kk <= 10; kk++) { let ok = true; for (let x = 0; x <= 6.3; x += 0.001) if (kk - p.a * cos(x) < -1e-9) { ok = false; break; } if (ok) return kk; } } const f = (x) => x ** 3 + p.pp * x * x + p.qq * x; if (abs(dd(f, p.r1)) > 1e-5 || abs(dd(f, p.r2)) > 1e-5 || dd(f, (p.r1 + p.r2) / 2) >= 0) throw new Error('bad'); return p.pp + p.qq; }),

  gen('ad-g14', 3, 'nat', 'integer', 'tangents from an external point', (rng) => {
    const pp = int(rng, 1, 5), d = int(rng, 1, 4), qq = pp * pp - d * d, k = int(rng, 0, 2);
    const what = ['the sum of the slopes', 'the product of the slopes', 'the (positive) difference of the slopes'][k]; const ans = [4 * pp, 4 * qq, 4 * d][k];
    return { pp, qq, d, k, answer: ans, tol: 0, q: R`Two tangents are drawn from $(${pp},${qq})$ to $y=x^2$. Find ${what}.`, sol: R`<p>Contact point $(t,t^2)$, slope $2t$. The tangent passes through $(${pp},${qq})$: $\dfrac{t^2-${ptex(qq)}}{t-${pp}}=2t$, so $t^2-${2 * pp}t${sgn(qq)}=0$, $t=${pp}\pm${d}$. Slopes $2t=${2 * (pp + d)}$ and $${2 * (pp - d)}$. ${what[0].toUpperCase() + what.slice(1)} is $${ans}$.</p>` };
  }, (p) => { const disc = p.pp * p.pp - p.qq; const t1 = p.pp + sqrt(disc), t2 = p.pp - sqrt(disc); const s1 = 2 * t1, s2 = 2 * t2; return Math.round([s1 + s2, s1 * s2, abs(s1 - s2)][p.k]); }),

  gen('ad-g15', 3, 'nat', 'numeric', 'slope of parametric and implicit curves', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { let m, n; do { m = int(rng, 1, 3); n = int(rng, 2, 5); } while (m === n); const t0 = choose(rng, [1, 2, 3]); const ans = r4((n / m) * t0 ** (n - m)); return { k, m, n, t0, answer: ans, tol: 0.01, q: R`For $x=t^{${m}}$, $y=t^{${n}}$, find $\dfrac{dy}{dx}$ at $t=${t0}$ (2 decimal places).`, sol: R`<p>$\dfrac{dy}{dx}=\dfrac{${n}t^{${n - 1}}}{${m}t^{${m - 1}}}=\dfrac{${n}}{${m}}t^{${n - m}}$. At $t=${t0}$: $${ans}$.</p>` }; }
    if (k === 1) { const [tt, ts, val] = choose(rng, [['\\pi/2', 1.5707963, 1], ['\\pi/3', 1.0471976, 1.7321], ['2\\pi/3', 2.0943951, 0.5774], ['\\pi/6', 0.5235988, 3.7321]]); return { k, tt, ts, answer: val, tol: 0.01, q: R`For the cycloid $x=a(t-\sin t)$, $y=a(1-\cos t)$, find $\dfrac{dy}{dx}$ at $t=${tt}$ (2 decimal places).`, sol: R`<p>$\dfrac{dy}{dx}=\dfrac{a\sin t}{a(1-\cos t)}=\cot\dfrac t2$. At $t=${tt}$ this is $\cot\left(\dfrac{${tt}}2\right)\approx${val}$.</p>` }; }
    const x0 = choose(rng, [1, 2, 4]), y0 = choose(rng, [1, 2, 3, 4]); const c = x0 * y0 * y0; return { k, x0, y0, c, answer: -y0 / (2 * x0), tol: 0.01, q: R`Find the slope of the tangent to $xy^2=${c}$ at $(${x0},${y0})$.`, sol: R`<p>Differentiate: $y^2+2xy\,y'=0$, so $y'=-\dfrac y{2x}$. At $(${x0},${y0})$: $-\dfrac{${y0}}{${2 * x0}}=${r4(-y0 / (2 * x0))}$.</p>` };
  }, (p) => { if (p.k === 0) return dd((t) => t ** p.n, p.t0, 1e-5) / dd((t) => t ** p.m, p.t0, 1e-5); if (p.k === 1) return dd((t) => 1 - cos(t), p.ts, 1e-6) / dd((t) => t - sin(t), p.ts, 1e-6); return dd((x) => sqrt(p.c / x), p.x0, 1e-6); }),

  gen('ad-g16', 3, 'nat', 'integer', 'least value by calculus or AM-GM', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const s = int(rng, 1, 6), a = choose(rng, [1, 2, 3, 4, 6, 9]); const bb = a * s * s; return { k, a, b: bb, s, answer: 2 * a * s, tol: 0, q: R`The least value of $${a === 1 ? '' : a}x+\dfrac{${bb}}x$ for $x>0$ is`, sol: R`<p>$f'=${a}-\dfrac{${bb}}{x^2}=0$ gives $x=${s}$. $f=${a * s}+${bb / s}=${2 * a * s}$. (AM-GM: $2\sqrt{${a}\cdot${bb}}=${2 * a * s}$.)</p>` }; }
    if (k === 1) { const x0 = int(rng, 1, 5), b = 2 * x0 ** 3; return { k, x0, b, answer: 3 * x0 * x0, tol: 0, q: R`The least value of $x^2+\dfrac{${b}}x$ for $x>0$ is`, sol: R`<p>$f'=2x-\dfrac{${b}}{x^2}=0$ gives $x^3=${x0 ** 3}$, $x=${x0}$. $f=${x0 * x0}+${b / x0}=${3 * x0 * x0}$.</p>` }; }
    const s0 = int(rng, 1, 4); const tt = 3 * s0; return { k, T: tt, answer: (4 * tt ** 3) / 27, tol: 0, q: R`If $x+y=${tt}$ with $x,y>0$, the greatest value of $x^2y$ is`, sol: R`<p>$f=x^2(${tt}-x)$, $f'=x(${2 * tt}-3x)=0$ gives $x=${(2 * tt) / 3}$, $y=${tt / 3}$. $f=${((2 * tt) / 3) ** 2}\cdot${tt / 3}=${((2 * tt) / 3) ** 2 * (tt / 3)}$.</p>` };
  }, (p) => { if (p.k === 0) return Math.round(Math.min(...Array.from({ length: 20000 }, (_, i) => { const x = 0.01 + i * 0.001; return p.a * x + p.b / x; }))); if (p.k === 1) return Math.round(Math.min(...Array.from({ length: 20000 }, (_, i) => { const x = 0.05 + i * 0.001; return x * x + p.b / x; }))); return Math.round(Math.max(...Array.from({ length: 12001 }, (_, i) => { const x = (i * p.T) / 12000; return x * x * (p.T - x); }))); }),

  gen('ad-g17', 3, 'mcq', 'single', 'nature of a critical point', (rng) => {
    const n = choose(rng, [2, 3, 4, 5, 6]), s = choose(rng, [1, -1, 2, -2]), a = int(rng, -2, 2);
    const kind = n % 2 === 1 ? 'inflection' : s > 0 ? 'min' : 'max';
    const T = { min: 'a local minimum', max: 'a local maximum', inflection: 'neither a maximum nor a minimum (a point of inflection)' };
    const good = T[kind]; const { options, answer } = shuffleOpts(rng, good, Object.values(T).filter((v) => v !== good).concat(['a point where $f$ is not continuous']));
    const xa = a === 0 ? 'x' : `(x${sgn(-a)})`; const coef = s === 1 ? '' : s === -1 ? '-' : s;
    return { n, s, a, kind, options, answer, q: R`At $x=${a}$, the function $f(x)=${coef}${xa}^{${n}}$ has`, sol: R`<p>$f'(x)=${s * n}${xa}^{${n - 1}}$, zero only at $x=${a}$. ${n % 2 === 1 ? `Since $${n - 1}$ is even, $f'$ has the same sign on both sides (${s > 0 ? 'positive' : 'negative'}): no extremum.` : `Since $${n - 1}$ is odd, $f'$ changes sign at $x=${a}$ from ${s > 0 ? 'negative to positive' : 'positive to negative'}.`} ${n >= 3 ? 'Note $f\'\'(' + a + ')=0$, so the second derivative test cannot decide; use the sign of $f\'$.' : ''} So $f$ has ${good}.</p>` };
  }, (p) => { const f = (x) => p.s * (x - p.a) ** p.n; const l = f(p.a - 0.05), r = f(p.a + 0.05), c = f(p.a); const kind = l > c && r > c ? 'a local minimum' : l < c && r < c ? 'a local maximum' : 'neither a maximum nor a minimum (a point of inflection)'; return p.options.indexOf(kind); }),

  gen('ad-g18', 4, 'nat', 'numeric', 'inscribed solids of greatest volume', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const R0 = 3 * int(rng, 1, 3), H = choose(rng, [6, 9, 12]); const V = r2((4 * PI_ * R0 * R0 * H) / 27); return { k, R0, H, answer: V, tol: 0.02, q: R`The greatest volume of a cylinder inscribed in a cone of base radius $${R0}$ and height $${H}$ is (2 decimal places)`, sol: R`<p>Cylinder radius $r$, height $h=${H}\left(1-\dfrac r{${R0}}\right)$. $V=\pi r^2h$ is largest at $r=\dfrac{2\cdot${R0}}3=${(2 * R0) / 3}$, $h=\dfrac${'{' + H + '}'}3=${H / 3}$. $V=\pi\cdot${((2 * R0) / 3) ** 2}\cdot${H / 3}\approx${V}$ (this is $\dfrac49$ of the cone's volume).</p>` }; }
    if (k === 1) { const R0 = int(rng, 2, 6); const V = r2((32 * PI_ * R0 ** 3) / 81); return { k, R0, answer: V, tol: 0.02, q: R`The greatest volume of a cone inscribed in a sphere of radius $${R0}$ is (2 decimal places)`, sol: R`<p>Cone height $h$, $r^2=h(${2 * R0}-h)$. $V=\dfrac\pi3h^2(${2 * R0}-h)$, largest at $h=\dfrac{4\cdot${R0}}3=${r2((4 * R0) / 3)}$. $V=\dfrac{32\pi R^3}{81}\approx${V}$.</p>` }; }
    const R0 = int(rng, 2, 6); const V = r2((4 * PI_ * R0 ** 3) / (3 * sqrt(3))); return { k, R0, answer: V, tol: 0.02, q: R`The greatest volume of a cylinder inscribed in a sphere of radius $${R0}$ is (2 decimal places)`, sol: R`<p>$r^2=${R0 * R0}-\dfrac{h^2}4$. $V=\pi\left(${R0 * R0}h-\dfrac{h^3}4\right)$, largest at $h=\dfrac{2\cdot${R0}}{\sqrt3}$. $V=\dfrac{4\pi R^3}{3\sqrt3}\approx${V}$.</p>` };
  }, (p) => { if (p.k === 0) return Math.max(...Array.from({ length: 20000 }, (_, i) => { const r = (i * p.R0) / 20000; return PI_ * r * r * p.H * (1 - r / p.R0); })); if (p.k === 1) return Math.max(...Array.from({ length: 20000 }, (_, i) => { const h = (i * 2 * p.R0) / 20000; return (PI_ / 3) * h * h * (2 * p.R0 - h); })); return Math.max(...Array.from({ length: 20000 }, (_, i) => { const h = (i * 2 * p.R0) / 20000; return PI_ * (p.R0 * p.R0 - (h * h) / 4) * h; })); }),

  gen('ad-g19', 4, 'nat', 'numeric', 'least triangle area and least length', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const a = int(rng, 1, 6), b = int(rng, 1, 7); return { k, a, b, answer: 2 * a * b, tol: 0, q: R`A line through $(${a},${b})$ meets the positive axes at $A$ and $B$. The least area of $\triangle OAB$ is`, sol: R`<p>Intercepts $p,q$ with $\dfrac${'{' + a + '}'}p+\dfrac${'{' + b + '}'}q=1$. AM-GM: $1\ge2\sqrt{\dfrac{${a * b}}{pq}}$, so $pq\ge${4 * a * b}$ and the area $\dfrac{pq}2\ge${2 * a * b}$ (equality at $p=${2 * a}$, $q=${2 * b}$).</p>` }; }
    if (k === 1) { const a = int(rng, 2, 8), b = int(rng, 1, 6); return { k, a, b, answer: a * b, tol: 0, q: R`A tangent to $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$ meets the positive axes at $A,B$. The least area of $\triangle OAB$ is`, sol: R`<p>Tangent at $(${a}\cos\theta,${b}\sin\theta)$ has intercepts $\dfrac{${a}}{\cos\theta}$ and $\dfrac{${b}}{\sin\theta}$. Area $=\dfrac{${a * b}}{\sin2\theta}\ge${a * b}$.</p>` }; }
    const [a, b] = choose(rng, [[27, 64], [1, 8], [8, 27], [64, 125], [8, 1]]); const ap = Math.cbrt(a) ** 2, bp = Math.cbrt(b) ** 2; const L = r2((ap + bp) ** 1.5); return { k, a, b, answer: L, tol: 0.02, q: R`A line segment between the positive axes passes through $(${a},${b})$. Its least length is (2 decimal places)`, sol: R`<p>With angle $\theta$ to the $x$-axis, $L=\dfrac{${a}}{\cos\theta}+\dfrac{${b}}{\sin\theta}$, least when $\tan^3\theta=\dfrac{${b}}{${a}}$. The result is $L_{\min}=\left(a^{2/3}+b^{2/3}\right)^{3/2}=(${ap}+${bp})^{3/2}\approx${L}$.</p>` };
  }, (p) => { if (p.k === 0) return Math.min(...Array.from({ length: 40000 }, (_, i) => { const pp = p.a + 0.0005 + i * 0.0005; const q = (p.b * pp) / (pp - p.a); return (pp * q) / 2; })); if (p.k === 1) return Math.min(...Array.from({ length: 15000 }, (_, i) => { const t = 0.0001 + i * 0.0001; return (0.5 * p.a * p.b) / (sin(t) * cos(t)); })); return Math.min(...Array.from({ length: 15000 }, (_, i) => { const t = 0.0001 + i * 0.0001; return p.a / cos(t) + p.b / sin(t); })); }),

  gen('ad-g20', 4, 'nat', 'integer', 'number of real roots', (rng) => {
    const k = int(rng, 0, 1);
    if (k === 0) { const pp = int(rng, 1, 6); const bound = 2 * pp ** 1.5; const cnt = Number.isInteger(bound) ? 2 * bound - 1 : 2 * Math.floor(bound) + 1;
      return { k, pp, answer: cnt, tol: 0, q: R`For how many integers $q$ does $x^3-${3 * pp}x+q=0$ have three distinct real roots?`, sol: R`<p>$f=x^3-${3 * pp}x$ has $f'=3(x^2-${pp})$, local maximum $f(-\sqrt{${pp}})=2\cdot${pp}^{3/2}\approx${r2(bound)}$ and local minimum $-${r2(bound)}$. $f(x)+q=0$ has three distinct roots when $-q$ lies strictly between the minimum and maximum: $|q|<${r2(bound)}$. Integers: ${Number.isInteger(bound) ? `$-${bound - 1},\\dots,${bound - 1}$` : `$-${Math.floor(bound)},\\dots,${Math.floor(bound)}$`}, so $${cnt}$.</p>` }; }
    const pp = int(rng, 1, 4), mode = int(rng, 0, 2); const bound = 2 * pp ** 1.5; let q, ans, why;
    if (mode === 0) { q = Math.floor(bound) - 0; if (q >= bound) q -= 1; if (q < 0) q = 0; ans = 3; why = `$|q|=${q}<${r2(bound)}$: three distinct roots`; }
    else if (mode === 1) { q = Math.ceil(bound) + 1; ans = 1; why = `$|q|=${q}>${r2(bound)}$: one real root`; }
    else { q = 2; ans = 'x'; }
    if (ans === 'x') { return { k, pp: 1, q: 2, answer: 2, tol: 0, q: R`The number of distinct real roots of $x^3-3x+2=0$ is`, qq: 2, sol: R`<p>$x^3-3x+2=(x-1)^2(x+2)$. Roots $1$ (double) and $-2$: two distinct real roots.</p>` }; }
    return { k, pp, qv: q, answer: ans, tol: 0, q: R`The number of real roots of $x^3-${3 * pp}x+${q}=0$ is`, sol: R`<p>The local extreme values of $x^3-${3 * pp}x$ are $\pm2\cdot${pp}^{3/2}\approx\pm${r2(bound)}$. The equation $x^3-${3 * pp}x=-${q}$ has ${why}.</p>` };
  }, (p) => { if (p.k === 0) { let c = 0; for (let q = -60; q <= 60; q++) if (countSign((x) => x ** 3 - 3 * p.pp * x + q, -10, 10, 0.0013) === 3) c++; return c; } const q = p.qv === undefined ? 2 : p.qv; const pp = p.qv === undefined ? 1 : p.pp; if (p.qv === undefined) { const f = (x) => x ** 3 - 3 * x + 2; return Math.round(countSign(f, -3, 3, 0.00013) + 1); } return countSign((x) => x ** 3 - 3 * pp * x + q, -10, 10, 0.0013); }),

  gen('ad-g21', 2, 'mcq', 'single', 'equation of a tangent', (rng) => {
    const a = nonzero(rng, -2, 3), b = int(rng, -4, 4), c = int(rng, -4, 4), x0 = int(rng, -2, 3);
    const m = 2 * a * x0 + b, y0 = a * x0 * x0 + b * x0 + c, kk = y0 - m * x0;
    const good = `$${lineTeX(m, kk)}$`;
    const { options, answer } = shuffleOpts(rng, good, [`$${lineTeX(m, y0 + m * x0)}$`, `$${lineTeX(m, y0)}$`, `$${lineTeX(-m, kk)}$`, `$${lineTeX(m, kk + 1)}$`]);
    return { a, b, c, x0, m, y0, kk, options, answer, q: R`The tangent to $y=${poly([a, 2], [b, 1], [c, 0])}$ at the point where $x=${x0}$ is`, sol: R`<p>$y'=${poly([2 * a, 1], [b, 0])}$; at $x=${x0}$ the slope is $${m}$ and $y=${y0}$. $y-${ptex(y0)}=${m}(x-${ptex(x0)})$ gives ${good}.</p>` };
  }, (p) => { const f = (x) => p.a * x * x + p.b * x + p.c; const m = Math.round(dd(f, p.x0, 1e-4)); const k = Math.round(f(p.x0) - m * p.x0); return p.options.indexOf(`$${lineTeX(m, k)}$`); }),

  gen('ad-g22', 3, 'nat', 'numeric', 'related rates (shadow, kite)', (rng) => {
    const k = int(rng, 0, 2);
    if (k < 2) { const [h, H] = choose(rng, [[1.5, 4.5], [1.8, 5.4], [1.6, 6.4], [2, 6], [1.5, 6], [1.2, 4.8]]); const v = choose(rng, [2, 3, 4, 1.5]); const ans = k === 0 ? r2((H * v) / (H - h)) : r2((h * v) / (H - h));
      return { k, h, H, v, answer: ans, tol: 0.01, q: R`A man ${h} m tall walks away from a lamp ${H} m high at ${v} m/s. How fast (m/s) does the ${k === 0 ? 'tip of his shadow move' : 'length of his shadow grow'}? (2 decimal places)`, sol: R`<p>Man at distance $x$, shadow tip at $s$: $\dfrac s{${H}}=\dfrac{s-x}{${h}}$, so $s=\dfrac{${H}x}{${r2(H - h)}}$ and shadow length $=s-x=\dfrac{${h}x}{${r2(H - h)}}$. ${k === 0 ? `$\\dot s=\\dfrac{${H}}{${r2(H - h)}}\\cdot${v}=${ans}$.` : `Length rate $=\\dfrac{${h}}{${r2(H - h)}}\\cdot${v}=${ans}$.`}</p>` }; }
    const [hh, x0, L0] = choose(rng, [[12, 5, 13], [8, 15, 17], [4, 3, 5], [24, 7, 25], [15, 20, 25]]); const v = choose(rng, [2, 3, 5, 4]); const ans = r2((x0 * v) / L0);
    return { k, hh, x0, L0, v, answer: ans, tol: 0.01, q: R`A kite flies at a constant height of ${hh} m. The wind carries it horizontally at ${v} m/s. How fast (m/s) is the string being let out when the kite is ${x0} m horizontally from the girl? (2 decimal places)`, sol: R`<p>$L^2=x^2+${hh * hh}$, so $L\dot L=x\dot x$. Here $L=${L0}$: $\dot L=\dfrac{${x0}\cdot${v}}{${L0}}=${ans}$ m/s.</p>` };
  }, (p) => { if (p.k < 2) { const s = (t) => (p.H * (p.x0 === undefined ? 1 : 1) * (1 + 0 * t)); void s; const tip = (x) => (p.H * x) / (p.H - p.h); const len = (x) => (p.h * x) / (p.H - p.h); const f = p.k === 0 ? tip : len; return dd(f, 5, 1e-4) * p.v; } return dd((x) => sqrt(x * x + p.hh * p.hh), p.x0, 1e-5) * p.v; }),

  gen('ad-g23', 2, 'nat', 'numeric', 'errors and small changes', (rng) => {
    const k = int(rng, 0, 2);
    if (k === 0) { const e = choose(rng, [1, 2, 3, 0.5]); const [what, pw] = choose(rng, [['volume of a sphere', 3], ['area of a circle', 2], ['surface area of a cube', 2], ['volume of a cube', 3], ['surface area of a sphere', 2]]); return { k, e, pw, answer: e * pw, tol: 0.01, q: R`The side or radius of a ${what.includes('cube') ? 'cube' : what.includes('sphere') ? 'sphere' : 'circle'} is measured with an error of ${e}%. Find the approximate percentage error in the ${what}.`, sol: R`<p>The ${what} varies as (length)$^${pw}$, so $\dfrac{dy}y=${pw}\dfrac{dx}x=${pw}\times${e}\%=${e * pw}\%$.</p>` }; }
    const n = int(rng, 2, 4), x0 = int(rng, 2, 6), dx = choose(rng, [0.01, 0.02, 0.05, 0.1]); const ans = r4(n * x0 ** (n - 1) * dx); return { k, n, x0, dx, answer: ans, tol: 0.001, q: R`Using differentials, find the approximate change in $y=x^{${n}}$ when $x$ changes from $${x0}$ to $${r2(x0 + dx)}$ (3 decimal places).`, sol: R`<p>$dy=${n}x^{${n - 1}}dx=${n}\cdot${x0 ** (n - 1)}\cdot${dx}=${ans}$.</p>` };
  }, (p) => (p.k === 0 ? p.e * p.pw : dd((x) => x ** p.n, p.x0, 1e-4) * p.dx)),

  gen('ad-g24', 3, 'mcq', 'single', 'comparing a^b and b^a', (rng) => {
    const a = int(rng, 2, 6), b = int(rng, a + 1, a + 4); const lhs = a ** b, rhs = b ** a;
    const T = [`$${a}^{${b}}$ is greater than $${b}^{${a}}$`, `$${b}^{${a}}$ is greater than $${a}^{${b}}$`, `They are equal`, `Cannot be decided without a calculator`];
    const key = lhs > rhs ? 0 : lhs < rhs ? 1 : 2; const good = T[key]; const { options, answer } = shuffleOpts(rng, good, T.filter((_, i) => i !== key));
    return { a, b, options, answer, good, q: R`Which is true for $${a}^{${b}}$ and $${b}^{${a}}$?`, sol: R`<p>Compare $\dfrac{\ln x}x$ at $x=${a}$ and $x=${b}$ (equivalently compare $${b}\ln${a}$ with $${a}\ln${b}$). $g(x)=\dfrac{\ln x}x$ increases for $x<e$ and decreases for $x>e$. ${a >= 3 ? `Both ${a} and ${b} exceed $e$, so $g(${a})>g(${b})$, i.e. $${a}^{${b}}>${b}^{${a}}$.` : `$${a}=2$ is below $e$; check directly: $${a}^{${b}}=${lhs}$ and $${b}^{${a}}=${rhs}$.`} Values: $${a}^{${b}}=${lhs}$, $${b}^{${a}}=${rhs}$. So ${good}.</p>` };
  }, (p) => { const d = p.b * ln(p.a) - p.a * ln(p.b); const g = d > 1e-9 ? `$${p.a}^{${p.b}}$ is greater than $${p.b}^{${p.a}}$` : d < -1e-9 ? `$${p.b}^{${p.a}}$ is greater than $${p.a}^{${p.b}}$` : 'They are equal'; return p.options.indexOf(g); }),

  gen('ad-g25', 3, 'nat', 'integer', 'inflection of a cubic', (rng) => {
    let r1, r2; do { r1 = int(rng, -4, 2); r2 = int(rng, r1 + 2, r1 + 6); } while ((r1 + r2) % 2 !== 0);
    const m = (r1 + r2) / 2, dh = (r2 - r1) / 2, k = int(rng, 0, 1); const a2 = -3 * m, a1 = 3 * r1 * r2;
    const F = [[1, 3], [a2, 2], [a1, 1]]; const ans = k === 0 ? -3 * dh * dh : ev(F, m);
    return { r1, r2, m, dh, k, a2, a1, answer: ans, tol: 0, q: R`For $f(x)=${poly(...F)}$, find ${k === 0 ? 'the slope of the tangent at the point of inflection' : 'the $y$-coordinate of the point of inflection'}.`,
      sol: R`<p>$f''(x)=6x${sgn(2 * a2)}=0$ gives $x=${m}$ (the sign changes). ${k === 0 ? `$f'(x)=3x^2${sgn(2 * a2)}x${sgn(a1)}$, so $f'(${m})=${3 * m * m + 2 * a2 * m + a1}$.` : `$f(${m})=${ev(F, m)}$.`}</p>` };
  }, (p) => { const f = (x) => x ** 3 + p.a2 * x * x + p.a1 * x; const f2 = (x) => (f(x + 0.01) - 2 * f(x) + f(x - 0.01)) / 1e-4; const xi0 = -f2(0) / (f2(1) - f2(0)); const xi = Math.round(xi0); return Math.round(p.k === 0 ? dd(f, xi, 1e-4) : f(xi)); }),
];


// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `ad-x${String(++_k).padStart(3, '0')}`;
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
const GX = (id, level, type, format, sub, make, verify) => ({ id: `ad-${id}`, type, format, level, exams: xex(level, type), sub, make, ...(verify ? { verify } : {}) });
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
const xab = Math.abs;
const xmin = (f, a, b, n = 400000) => { let bv = Infinity, bx = a; for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, v = f(x); if (v < bv) { bv = v; bx = x; } } return { x: bx, v: bv }; };
const xmax = (f, a, b, n = 400000) => { const r = xmin((x) => -f(x), a, b, n); return { x: r.x, v: -r.v }; };
// ---- load-time checks ----
ck('x2+... ', xmin((x) => x * x - 6 * x + 5, -10, 10).v, -4, 1e-6);
ck('max sin+cos', xmax((x) => xsin(x) + xcos(x), 0, 2 * xPI).v, Math.SQRT2, 1e-6);
ck('min sin+cos', xmin((x) => xsin(x) + xcos(x), 0, 2 * xPI).x, 5 * xPI / 4, 1e-4);
ck('x2 e^-x max', xmax((x) => x * x * xexp(-x), 0, 10).v, 4 / Math.E ** 2, 1e-6);
ck('x^1/x max', xmax((x) => x ** (1 / x), 0.5, 10).v, 1.444667861, 1e-6);
ck('dist (6,0)', Math.sqrt(xmin((x) => (x - 6) ** 2 + 4 * x, 0, 20).v), 4.472136, 1e-5);
ck('dist (0,2)', Math.sqrt(xmin((x) => x * x + (x * x - 2) ** 2, -3, 3).v), Math.sqrt(7) / 2, 1e-5);
ck('box', xmax((x) => x * (12 - 2 * x) ** 2, 0, 6).v, 128, 1e-6);
ck('x2y', xmax((x) => x * x * (9 - x), 0, 9).v, 108, 1e-6);
ck('x2+16/x', xmin((x) => x * x + 16 / x, 0.1, 10).v, 12, 1e-6);
ck('cyl', xmax((h) => xPI * (36 - h * h / 4) * h, 0, 12).v, 522.3742, 1e-6);
ck('f cubic', (() => { const f = (x) => x ** 3 - 3 * x * x - 9 * x + 5; return xmax(f, -2, 6).v - xmin(f, -2, 6).v; })(), 81, 1e-5);
ck('roots e^x=3x', xmin((x) => xexp(x) - 3 * x, -5, 5).v < 0 ? 2 : -1, 2);
ck('roots e^x=2x', xmin((x) => xexp(x) - 2 * x, -5, 5).v > 0 ? 0 : -1, 0);
ck('x^5 critical', [0, 1, 3].filter((a) => { const f = (x) => x ** 5 - 5 * x ** 4 + 5 * x ** 3 - 1; return f(a - 0.1) !== f(a) && ((f(a) - f(a - 0.1)) * (f(a + 0.1) - f(a)) < 0); }).length, 2);
ck('ln x = x/e', xmax((x) => xln(x) - x / Math.E, 0.01, 20).v, 0, 1e-6);
ck('angle', Math.atan(Math.abs(2 - 0.5) / (1 + 1)), Math.atan(3 / 4), 1e-9);
ck('f cubic p q', (() => { const f = (x) => x ** 3 - 6 * x * x + 9 * x + 5; return f(2) + 0; })(), 7);
ck('rate cone', 2 / (xPI * 16), 0.0398, 1e-2);
ck('xe-x', xd((x) => x * xexp(-x), 1), 0);

Object.assign(XG, {
  xm1: { title: 'Match: the stationary point at x = 0', passage: XR`<p>Each function in List I has $f'(0)=0$ or is not differentiable at $0$. Match it with what happens at $x=0$ in List II.</p>`,
    list1: [XR`A. $f(x)=x^3$`, XR`B. $f(x)=x^4$`, XR`C. $f(x)=-x^2$`, XR`D. $f(x)=|x|$`],
    list2: [XR`p. local maximum`, XR`q. local minimum with $f'(0)=0$`, XR`r. neither a maximum nor a minimum`, XR`s. local minimum where $f'(0)$ does not exist`] },
  xm2: { title: 'Match: greatest and least values', passage: XR`<p>Match each function in List I with its stated extreme value in List II.</p>`,
    list1: [XR`A. least value of $x^2-4x+5$ on $\mathbb R$`, XR`B. greatest value of $6x-x^2$ on $\mathbb R$`, XR`C. least value of $x+\dfrac1x$ for $x>0$`, XR`D. greatest value of $\sin x+\cos x$`],
    list2: [XR`p. $\sqrt2$`, XR`q. $2$`, XR`r. $9$`, XR`s. $1$`] },
  xm3: { title: 'Match: number of real roots', passage: XR`<p>Match each equation in List I with its number of real roots in List II.</p>`,
    list1: [XR`A. $x^3-3x+1=0$`, XR`B. $x^3+3x+1=0$`, XR`C. $e^x=3x$`, XR`D. $e^x=2x$`],
    list2: [XR`p. $0$`, XR`q. $1$`, XR`r. $2$`, XR`s. $3$`] },
  xm4: { title: 'Match: rates of change', passage: XR`<p>A quantity grows because the radius $r$ (or edge $a$) is increasing at $0.2$ cm/s. Match each case in List I (at the instant given) with the rate in List II.</p>`,
    list1: [XR`A. volume of a sphere at $r=5$ cm`, XR`B. area of a circle at $r=5$ cm`, XR`C. surface area of a sphere at $r=5$ cm`, XR`D. volume of a cube at $a=5$ cm`],
    list2: [XR`p. $8\pi$ cm$^2$/s`, XR`q. $15$ cm$^3$/s`, XR`r. $2\pi$ cm$^2$/s`, XR`s. $20\pi$ cm$^3$/s`] },
  xm5: { title: 'Match: slopes of tangents', passage: XR`<p>Match each curve and point in List I with the slope of the tangent there, from List II.</p>`,
    list1: [XR`A. $y^2=4x$ at $(1,2)$`, XR`B. $x^2+y^2=25$ at $(3,4)$`, XR`C. $xy=12$ at $(3,4)$`, XR`D. $y=x^3$ at $(1,1)$`],
    list2: [XR`p. $3$`, XR`q. $-\dfrac34$`, XR`r. $1$`, XR`s. $-\dfrac43$`] },
  xm6: { title: 'Match: optimisation answers', passage: XR`<p>Match each problem in List I with its answer in List II.</p>`,
    list1: [XR`A. greatest area of a rectangle of perimeter $40$`, XR`B. greatest volume of an open box made from a $12\times12$ square by cutting equal corner squares`, XR`C. least perimeter of a rectangle of area $64$`, XR`D. least sum of two positive numbers with product $36$`],
    list2: [XR`p. $128$`, XR`q. $32$`, XR`r. $100$`, XR`s. $12$`] },
  xm7: { title: 'Match: points of inflection', passage: XR`<p>Match each function in List I with the number of its points of inflection in List II (on the stated domain).</p>`,
    list1: [XR`A. $x^4$ on $\mathbb R$`, XR`B. $x^4-6x^2$ on $\mathbb R$`, XR`C. $\sin x$ on $(0,4\pi)$`, XR`D. $x^3$ on $\mathbb R$`],
    list2: [XR`p. $3$`, XR`q. $0$`, XR`r. $1$`, XR`s. $2$`] },
  xm8: { title: 'Match: where the tangent meets the x-axis', passage: XR`<p>Match each curve and point in List I with the $x$-intercept of the tangent there, from List II.</p>`,
    list1: [XR`A. $y=x^2$ at $(1,1)$`, XR`B. $y=\ln x$ at $(1,0)$`, XR`C. $y=e^x$ at $(0,1)$`, XR`D. $y=x^3$ at $(1,1)$`],
    list2: [XR`p. $1$`, XR`q. $-1$`, XR`r. $\dfrac12$`, XR`s. $\dfrac23$`] },
  xp4: { title: 'Passage: fencing a field by a river', passage: XR`<p>A farmer has $120$ m of fencing. A field is to be a rectangle with one side along a straight river, so only three sides need fencing. Let each of the two sides perpendicular to the river be $x$ m, so the side parallel to the river is $(120-2x)$ m.</p>` },
  xp5: { title: 'Passage: a cubic on a closed interval', passage: XR`<p>$f(x)=x^3-3x^2-9x+5$ on the interval $[-2,6]$. Note $f'(x)=3(x-3)(x+1)$.</p>` },
  xp6: { title: 'Passage: the nearest point of a parabola', passage: XR`<p>$P$ is the point $(0,2)$ and $Q=(x,x^2)$ moves on the parabola $y=x^2$. Let $D=PQ^2=x^2+(x^2-2)^2$.</p>` },
});

XIT.push(
  // ---- L2 ----
  M(2, 'extrema', XR`The least value of $f(x)=x^2-6x+5$ is`, '$-4$', ['$5$', '$-3$', '$-9$'],
    XR`<p>$f'(x)=2x-6=0$ at $x=3$, and $f''=2>0$ so it is a minimum. $f(3)=9-18+5=-4$.</p>`, 'The least value is f(3), not f(0).'),
  M(2, 'tangents', XR`The slope of the tangent to $y=x^2-3x$ at $x=2$ is`, '$1$', ['$-2$', '$2$', '$4$'],
    XR`<p>$y'=2x-3$. At $x=2$: $1$.</p>`, 'Slope of the tangent = derivative at the point.'),
  M(2, 'monotonicity', XR`$f(x)=x^3+3x$ is`, XR`increasing on $\mathbb R$`, [XR`decreasing on $\mathbb R$`, XR`increasing on $(0,\infty)$ only`, XR`increasing and then decreasing`],
    XR`<p>$f'(x)=3x^2+3\ge3>0$ for every real $x$. So $f$ is increasing everywhere.</p>`, 'f′ is never zero here.'),
  M(2, 'rate of change', XR`The side of a square increases at $0.2$ cm/s. The rate at which its area increases when the side is $5$ cm is`, XR`$2$ cm$^2$/s`, [XR`$1$ cm$^2$/s`, XR`$5$ cm$^2$/s`, XR`$0.4$ cm$^2$/s`],
    XR`<p>$A=a^2$, $\dfrac{dA}{dt}=2a\dfrac{da}{dt}=2(5)(0.2)=2$ cm$^2$/s.</p>`, 'Use dA/dt = 2a · da/dt.'),
  M(2, 'critical points', XR`The critical points of $f(x)=x^3-12x$ are`, '$x=\\pm2$', ['$x=\\pm4$', '$x=0$ only', '$x=\\pm\\sqrt{12}$'],
    XR`<p>$f'(x)=3x^2-12=0$ gives $x^2=4$, so $x=\pm2$.</p>`, 'Divide both sides by 3 before taking the root.'),
  // ---- L3 ----
  M(3, 'tangents', XR`The tangent to $y=x^3-2x$ at the point $(1,-1)$ is`, '$y=x-2$', ['$y=x$', '$y=x+2$', '$y=-x$'],
    XR`<p>$y'=3x^2-2=1$ at $x=1$. Line: $y+1=1(x-1)$, i.e. $y=x-2$.</p>`, 'Use the given point, not the origin.'),
  M(3, 'normals', XR`The normal to $y=\ln x$ at $x=1$ is`, '$x+y=1$', ['$x-y=1$', '$y=x-1$', '$x+y=0$'],
    XR`<p>$y'=\dfrac1x=1$ at $x=1$, so the normal has slope $-1$ and passes through $(1,0)$: $y=-(x-1)$, i.e. $x+y=1$.</p>`, 'The normal slope is the negative reciprocal.'),
  M(3, 'monotonicity', XR`$f(x)=xe^{-x}$ is increasing on`, XR`$(-\infty,1)$`, [XR`$(1,\infty)$`, XR`$(0,\infty)$`, XR`$(-\infty,0)$`],
    XR`<p>$f'(x)=e^{-x}(1-x)$. Since $e^{-x}>0$, $f'>0$ when $x<1$.</p>`, 'Check the sign of 1 − x, not x − 1.'),
  M(3, 'global extrema', XR`The least value of $\sin x+\cos x$ on $[0,2\pi]$ is attained at $x=$`, XR`$\dfrac{5\pi}4$`, [XR`$\dfrac\pi4$`, XR`$\dfrac{3\pi}4$`, XR`$\dfrac{7\pi}4$`],
    XR`<p>$\sin x+\cos x=\sqrt2\sin\left(x+\dfrac\pi4\right)$. It equals $-\sqrt2$ when $x+\dfrac\pi4=\dfrac{3\pi}2$, i.e. $x=\dfrac{5\pi}4$.</p>`, 'Write as √2 sin(x + π/4) to see the extremes.'),
  M(3, 'approximation', XR`Using differentials, an approximate value of $\tan46^\circ$ is (use $1^\circ=\dfrac\pi{180}$ rad)`, XR`$1+\dfrac\pi{90}$`, [XR`$1+\dfrac\pi{180}$`, XR`$1+\dfrac{\pi}{45}$`, XR`$1+\dfrac\pi{360}$`],
    XR`<p>$f(x)=\tan x$, $x=45^\circ$, $dx=1^\circ=\dfrac\pi{180}$. $f'(x)=\sec^2x=2$ at $45^\circ$. $\tan46^\circ\approx1+2\cdot\dfrac\pi{180}=1+\dfrac\pi{90}$.</p>`, 'sec² 45° = 2, not 1.'),
  M(3, 'tangents', XR`The curve $y=x^2+bx+c$ touches the line $y=x$ at the point $(1,1)$. Then $b+c=$`, '$0$', ['$1$', '$-1$', '$2$'],
    XR`<p>Touching means the same value and the same slope at $x=1$. Value: $1+b+c=1$, so $b+c=0$. (Slope: $2+b=1$ gives $b=-1$, $c=1$.)</p>`, 'The value condition alone already gives b + c.'),
  A(3, 'maxima and minima', XR`$f(x)=x^3$ has no local maximum or minimum.`, XR`$f'(0)=0$ and $f'(x)\ge0$ on both sides of $0$.`, 0,
    XR`<p>$f'(x)=3x^2\ge0$ everywhere, so $f$ is increasing and $x=0$ is a point of inflection, not an extremum. The reason (no sign change of $f'$) explains the assertion.</p>`, 'f′(c) = 0 is necessary, not sufficient.'),
  A(3, 'global extrema', XR`$x+\dfrac1x\ge2$ for every real $x\ne0$.`, XR`By AM-GM, for positive $x$, $x+\dfrac1x\ge2\sqrt{x\cdot\dfrac1x}=2$.`, 3,
    XR`<p>R is true for positive $x$. A is false: for negative $x$, $x+\dfrac1x\le-2$ (for example $x=-1$ gives $-2$). So A false and R true.</p>`, 'AM-GM needs positive numbers.'),
  S(3, 'monotonicity', XR`$f(x)=x^3$ is strictly increasing on $\mathbb R$, although $f'(0)=0$.`, XR`If $f'(x)\ge0$ on an interval and $f'$ is zero only at isolated points, then $f$ is strictly increasing there.`, 0,
    XR`<p>Both are true. Between any two points of the interval $f'>0$ at most places, so $f$ cannot stay flat anywhere: strict increase.</p>`, 'Strictly increasing allows isolated zeros of f′.'),
  I(3, 'rate of change', XR`The radius of a circular ripple grows at $3$ cm/s. The area grows at $k\pi$ cm$^2$/s when $r=7$ cm. Find $k$.`, 42,
    XR`<p>$A=\pi r^2$, $\dfrac{dA}{dt}=2\pi r\dfrac{dr}{dt}=2\pi(7)(3)=42\pi$. So $k=42$.</p>`, 'The factor 2 from the derivative of r².', () => 2 * 7 * 3),
  I(3, 'optimisation', XR`The least value of $x^2+\dfrac{16}x$ for $x>0$ is`, 12,
    XR`<p>$f'(x)=2x-\dfrac{16}{x^2}=0$ gives $x^3=8$, $x=2$. $f''>0$, so minimum. $f(2)=4+8=12$.</p>`, 'AM-GM on x²/... also works: split 16/x as 8/x + 8/x.', () => 4 + 8),
  I(3, 'global extrema', XR`The greatest value of $f(x)=2x^3-9x^2+12x$ on $[0,3]$ is`, 9,
    XR`<p>$f'(x)=6(x-1)(x-2)$. Check $f(0)=0$, $f(1)=5$, $f(2)=4$, $f(3)=54-81+36=9$. The greatest is $9$ (at the endpoint $x=3$).</p>`, 'The end points must be checked too.', () => 54 - 81 + 36),
  // ---- matches ----
  MT(3, 'critical points', 'xm1', 'A-r, B-q, C-p, D-s', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s'],
    XR`<p>A: $x^3$ is increasing, so (r). B: $x^4\ge0$ with $f'(0)=0$ is a minimum (q), even though $f''(0)=0$. C: $-x^2\le0$ is a maximum (p). D: $|x|$ has a minimum at $0$ where there is no derivative (s).</p>`, 'The second derivative test fails for x⁴ but the minimum is still there.'),
  MT(3, 'global extrema', 'xm2', 'A-s, B-r, C-q, D-p', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-s, B-q, C-r, D-p'],
    XR`<p>A: vertex at $x=2$: $4-8+5=1$ (s). B: vertex at $x=3$: $18-9=9$ (r). C: AM-GM, $2$ (q). D: $\sqrt2\sin(x+\frac\pi4)$ has greatest value $\sqrt2$ (p).</p>`, 'In C the least value is for positive x only.'),
  MT(4, 'number of roots', 'xm3', 'A-s, B-q, C-r, D-p', ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-s, B-r, C-q, D-p'],
    XR`<p>A: $f=x^3-3x+1$ has $f(-1)=3>0$ and $f(1)=-1<0$: three roots (s). B: $f'=3x^2+3>0$: one root (q). C: $e^x-3x$ has minimum at $x=\ln3$: $3-3\ln3<0$, so two roots (r). D: $e^x-2x$ has minimum $2-2\ln2>0$: no roots (p).</p>`, 'For e^x = kx compare the minimum value k − k ln k with 0.'),
  MT(3, 'rates of change', 'xm4', 'A-s, B-r, C-p, D-q', ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-s, B-p, C-r, D-q'],
    XR`<p>A: $4\pi r^2\cdot0.2=4\pi\cdot25\cdot0.2=20\pi$ (s). B: $2\pi r\cdot0.2=2\pi$ (r). C: $8\pi r\cdot0.2=8\pi$ (p). D: $3a^2\cdot0.2=15$ (q).</p>`, 'Volume rates have the units cm³/s; area rates cm²/s.'),
  MT(4, 'tangents', 'xm5', 'A-r, B-q, C-s, D-p', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-r, B-s, C-q, D-p'],
    XR`<p>A: $2yy'=4$, $y'=\dfrac2y=1$ (r). B: $y'=-\dfrac xy=-\dfrac34$ (q). C: $y'=-\dfrac yx=-\dfrac43$ (s). D: $3x^2=3$ (p).</p>`, 'For implicit curves, differentiate both sides and solve for y′.'),
  MT(4, 'optimisation', 'xm6', 'A-r, B-p, C-q, D-s', ['A-r, B-p, C-s, D-q', 'A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s'],
    XR`<p>A: a square of side $10$: $100$ (r). B: $V=x(12-2x)^2$, maximum at $x=2$: $2\cdot64=128$ (p). C: a square of side $8$: perimeter $32$ (q). D: $6+6=12$ (s).</p>`, 'The extremum of such problems is usually at the symmetric case.'),
  MT(5, 'concavity', 'xm7', 'A-q, B-s, C-p, D-r', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-q, B-p, C-s, D-r'],
    XR`<p>A: $f''=12x^2\ge0$ never changes sign: $0$ (q). B: $f''=12x^2-12$ changes sign at $\pm1$: $2$ (s). C: $\sin x$ has $f''=-\sin x$, which changes sign at $\pi,2\pi,3\pi$: $3$ (p). D: $f''=6x$ changes sign at $0$: $1$ (r).</p>`, 'f″ = 0 is not enough: the sign must change.'),
  MT(5, 'tangents', 'xm8', 'A-r, B-p, C-q, D-s', ['A-r, B-p, C-s, D-q', 'A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s'],
    XR`<p>A: tangent $y=2x-1$: intercept $\frac12$ (r). B: $y=x-1$: intercept $1$ (p). C: $y=x+1$: intercept $-1$ (q). D: $y=3x-2$: intercept $\frac23$ (s).</p>`, 'Find the line first, then put y = 0.'),
  // ---- L4 ----
  M(4, 'extrema', XR`The local maximum value of $f(x)=x^2e^{-x}$ is`, XR`$\dfrac4{e^2}$`, [XR`$\dfrac1e$`, XR`$\dfrac2{e^2}$`, '$0$'],
    XR`<p>$f'(x)=xe^{-x}(2-x)$. $f'>0$ on $(0,2)$ and $<0$ for $x>2$, so $x=2$ is a local maximum: $f(2)=\dfrac4{e^2}$. (At $x=0$ there is a local minimum, $f(0)=0$.)</p>`, 'x = 0 is the minimum, x = 2 the maximum.'),
  M(4, 'concavity', XR`The point of inflection of $f(x)=xe^{-x}$ is at $x=$`, '$2$', ['$1$', '$0$', '$-1$'],
    XR`<p>$f'=e^{-x}(1-x)$, $f''=e^{-x}(x-2)$. $f''$ changes sign at $x=2$ (negative before, positive after). So $x=2$.</p>`, 'x = 1 is the maximum, not the inflection.'),
  M(4, 'monotonicity with a parameter', XR`$f(x)=x^3+ax^2+3x+7$ is increasing on all of $\mathbb R$ exactly when`, XR`$-3\le a\le3$`, [XR`$a\ge3$`, XR`$a<-3$ or $a>3$`, XR`$a\le0$`],
    XR`<p>$f'(x)=3x^2+2ax+3\ge0$ for all $x$ needs discriminant $\le0$: $4a^2-36\le0$, so $a^2\le9$, i.e. $-3\le a\le3$.</p>`, 'A quadratic that never goes negative has D ≤ 0, and the equality case is allowed.'),
  M(4, 'angle between curves', XR`The angle $\theta$ between the curves $y=x^2$ and $x=y^2$ at the point $(1,1)$ satisfies $\tan\theta=$`, XR`$\dfrac34$`, [XR`$\dfrac43$`, XR`$\dfrac32$`, XR`$1$`],
    XR`<p>Slopes at $(1,1)$: $2$ for $y=x^2$; for $x=y^2$, $2yy'=1$ so $y'=\dfrac12$. $\tan\theta=\left|\dfrac{2-\frac12}{1+2\cdot\frac12}\right|=\dfrac{3/2}2=\dfrac34$.</p>`, 'Use the formula |m₁ − m₂| / (1 + m₁m₂).'),
  I(4, 'tangents', XR`The tangent to $y=x^3$ at $(1,1)$ meets the curve again at $(a,a^3)$. Find $a$.`, -2,
    XR`<p>Tangent: $y=3x-2$. Put $x^3=3x-2$: $x^3-3x+2=0$, i.e. $(x-1)^2(x+2)=0$. The double root $x=1$ is the point of contact; the other root is $x=-2$.</p>`, 'x = 1 is a double root: the other one is the answer.', () => -2),
  I(4, 'maxima and minima', XR`How many points of local extremum does $f(x)=x^5-5x^4+5x^3-1$ have?`, 2,
    XR`<p>$f'(x)=5x^2(x^2-4x+3)=5x^2(x-1)(x-3)$. Critical points $0,1,3$. At $x=0$ the factor $x^2$ does not change sign, so no extremum. $f'>0$ before $1$, $<0$ between $1$ and $3$, $>0$ after $3$: a maximum at $1$ and a minimum at $3$. So $2$.</p>`, 'A repeated root of f′ of even order does not change the sign.', () => 2),
  I(4, 'extrema with parameters', XR`$f(x)=x^3+px^2+qx+5$ has a local maximum at $x=1$ and a local minimum at $x=3$. Find $f(2)$.`, 7,
    XR`<p>$f'(x)=3(x-1)(x-3)=3x^2-12x+9$, so $2p=-12$, $p=-6$, and $q=9$. $f(2)=8-24+18+5=7$.</p>`, 'Match f′ with 3(x − 1)(x − 3) to read off p and q.', () => 8 - 24 + 18 + 5),
  I(4, 'optimisation', XR`$x,y>0$ and $x+y=9$. The greatest value of $x^2y$ is`, 108,
    XR`<p>$f(x)=x^2(9-x)=9x^2-x^3$. $f'=18x-3x^2=3x(6-x)=0$ at $x=6$. $f''(6)=18-36<0$: maximum. $f(6)=36\cdot3=108$.</p>`, 'The maximum is at x = 6, not at 4.5.', () => 108),
  I(4, 'tangents', XR`The tangent to $xy=4$ at $(2,2)$ and the coordinate axes form a triangle. Find its area.`, 8,
    XR`<p>$y'=-\dfrac yx=-1$ at $(2,2)$. Tangent: $y-2=-(x-2)$, i.e. $x+y=4$. Intercepts $4$ and $4$: area $\dfrac12\cdot4\cdot4=8$.</p>`, 'For xy = k, the area is always 2k.', () => 8),
  I(4, 'normals', XR`The normal to $y^2=4x$ at $(1,2)$ meets the axes at $(a,0)$ and $(0,b)$. Find $a+b$.`, 6,
    XR`<p>$y'=\dfrac2y=1$ at $(1,2)$, so the normal slope is $-1$: $y-2=-(x-1)$, i.e. $x+y=3$. Intercepts $a=3$, $b=3$, so $a+b=6$.</p>`, 'Slope of the normal is −1, not 1.', () => 6),
  I(5, 'angle between curves', XR`The curves $y=x^2$ and $x=y^2$ intersect at $(1,1)$ at an angle $\theta$. Find $4\tan\theta$.`, 3,
    XR`<p>Slopes $2$ and $\dfrac12$. $\tan\theta=\dfrac{2-1/2}{1+1}=\dfrac34$. So $4\tan\theta=3$.</p>`, 'Slope of x = y²: 2yy′ = 1, so y′ = 1/2.', () => 4 * 0.75),
  I(5, 'number of roots', XR`The number of real solutions of $\ln x=\dfrac xe$ is`, 1,
    XR`<p>Let $g(x)=\ln x-\dfrac xe$. $g'(x)=\dfrac1x-\dfrac1e=0$ at $x=e$. $g(e)=1-1=0$ and $g$ increases before $e$, decreases after. So $0$ is the maximum value, reached once: exactly $1$ solution (a tangency).</p>`, 'The maximum touches zero: do not count two roots.', () => 1),
  N(4, 'optimisation', XR`The shortest distance from the point $(6,0)$ to the parabola $y^2=4x$ is (2 decimal places)`, 4.47, 0.01,
    XR`<p>$D=(x-6)^2+y^2=(x-6)^2+4x$. $D'=2(x-6)+4=0$ gives $x=4$ and $D=4+16=20$. Distance $=\sqrt{20}\approx4.47$.</p>`, 'Minimise the square of the distance.', () => Math.sqrt(20)),
  N(4, 'approximation', XR`Use differentials to find an approximate value of $\sqrt[3]{28}$ (3 decimal places).`, 3.037, 0.001,
    XR`<p>$f(x)=x^{1/3}$, $x=27$, $dx=1$. $f'(27)=\dfrac1{3\cdot27^{2/3}}=\dfrac1{27}$. $\sqrt[3]{28}\approx3+\dfrac1{27}=3.037$.</p>`, 'f′(27) = 1/(3·9), not 1/27 · something else.', () => 3 + 1 / 27),
  N(4, 'extrema', XR`The greatest value of $f(x)=x^{1/x}$ for $x>0$ is (2 decimal places)`, 1.44, 0.01,
    XR`<p>$\ln f=\dfrac{\ln x}x$, so $\dfrac{f'}f=\dfrac{1-\ln x}{x^2}$, zero at $x=e$ with a sign change from $+$ to $-$. Maximum $=e^{1/e}\approx1.4447\approx1.44$.</p>`, 'The maximum is at x = e, not x = 2 or 3.', () => Math.exp(1 / Math.E)),
  N(4, 'angle between curves', XR`The curves $y=\sin x$ and $y=\cos x$ meet at $x=\dfrac\pi4$. Find the acute angle between them in degrees (2 decimal places).`, 70.53, 0.05,
    XR`<p>Slopes: $\cos\dfrac\pi4=\dfrac1{\sqrt2}$ and $-\sin\dfrac\pi4=-\dfrac1{\sqrt2}$. $\tan\theta=\left|\dfrac{\frac1{\sqrt2}+\frac1{\sqrt2}}{1-\frac12}\right|=\dfrac{\sqrt2}{1/2}=2\sqrt2$. $\theta=\tan^{-1}(2\sqrt2)\approx70.53^\circ$.</p>`, 'The product of the slopes is −1/2, not −1: the curves are not perpendicular.', () => Math.atan(2 * Math.SQRT2) * 180 / Math.PI),
  N(4, 'related rates', XR`Water is poured at $2$ cm$^3$/s into an inverted cone of semi-vertical angle $45^\circ$. How fast is the depth rising when the depth is $4$ cm (in cm/s, 3 decimal places)?`, 0.04, 0.001,
    XR`<p>At depth $h$ the water surface has radius $r=h$ (since $\tan45^\circ=1$). $V=\dfrac13\pi r^2h=\dfrac{\pi h^3}3$. $\dfrac{dV}{dt}=\pi h^2\dfrac{dh}{dt}$, so $\dfrac{dh}{dt}=\dfrac2{16\pi}=0.0398\approx0.040$ cm/s.</p>`, 'The radius of the water surface equals the depth for a 45° cone.', () => 2 / (16 * Math.PI)),
  N(5, 'optimisation', XR`The greatest volume of a right circular cylinder inscribed in a sphere of radius $6$ cm is (2 decimal places, in cm$^3$)`, 522.37, 0.05,
    XR`<p>Let the cylinder have height $h$ and radius $r$ with $r^2=36-\dfrac{h^2}4$. $V=\pi r^2h=\pi\left(36h-\dfrac{h^3}4\right)$. $V'=\pi\left(36-\dfrac{3h^2}4\right)=0$ gives $h^2=48$, $h=4\sqrt3$. $V=\pi\left(36\cdot4\sqrt3-\dfrac{(4\sqrt3)^3}4\right)=\pi\left(144\sqrt3-48\sqrt3\right)=96\sqrt3\pi\approx522.37$.</p>`, 'The radius depends on h through the sphere: r² = R² − h²/4.', () => 96 * Math.sqrt(3) * Math.PI),
  X(4, 'monotonicity', XR`For $f(x)=x^3-3x$, which statements are true?`, [XR`$f$ is increasing on $(1,\infty)$`, XR`$f$ is decreasing on $(-1,1)$`, XR`$f$ has a local minimum at $x=-1$`, XR`$f$ has three real zeros`], [0, 1, 3],
    XR`<p>$f'=3(x^2-1)$: positive for $|x|>1$, negative on $(-1,1)$. So A and B are true. At $x=-1$, $f'$ changes from $+$ to $-$: a local maximum, so C is false. $f=x(x^2-3)$ has zeros $0,\pm\sqrt3$: D is true.</p>`, 'At x = −1 the function turns from rising to falling: maximum.'),
  X(4, 'critical points', XR`For $f(x)=x^4$ which statements are true?`, [XR`$f'(0)=0$`, XR`$f$ has a local minimum at $0$`, XR`$f''(0)>0$`, XR`$f$ has a point of inflection at $0$`], [0, 1],
    XR`<p>$f'=4x^3=0$ at $0$ and $f'$ changes from $-$ to $+$: a minimum. But $f''=12x^2=0$ at $0$, so C is false. $f''\ge0$ never changes sign: no inflection.</p>`, 'The second derivative test is silent here, but the first derivative test works.'),
  X(4, 'mean value theorem', XR`For which functions does the mean value theorem apply on $[0,2]$?`, [XR`$x^3$`, XR`$|x-1|$`, XR`$\sqrt x$`, XR`$\dfrac1{x-1}$`], [0, 2],
    XR`<p>It needs continuity on $[0,2]$ and differentiability on $(0,2)$. A: yes. B: not differentiable at $1$. C: continuous on $[0,2]$, differentiable on $(0,2)$: yes (the endpoint $0$ is allowed to be a bad point for the derivative). D: not defined at $1$.</p>`, 'Differentiability is needed only on the open interval.'),
  X(4, 'related rates', XR`A sphere's radius increases at a constant rate. Which statements are true?`, [XR`$\dfrac{dV}{dt}$ is proportional to $r^2$`, XR`$\dfrac{dS}{dt}$ is proportional to $r$`, XR`$\dfrac{dV}{dt}$ is constant`, XR`$\dfrac{dV}{dS}=\dfrac r2$`], [0, 1, 3],
    XR`<p>$V=\frac43\pi r^3$: $\dfrac{dV}{dt}=4\pi r^2\dfrac{dr}{dt}\propto r^2$. $S=4\pi r^2$: $\dfrac{dS}{dt}=8\pi r\dfrac{dr}{dt}\propto r$. $\dfrac{dV}{dS}=\dfrac{4\pi r^2}{8\pi r}=\dfrac r2$. C is false.</p>`, 'A constant dr/dt does not make dV/dt constant.'),
  X(4, 'critical points', XR`At which of these functions is $x=0$ a local minimum?`, [XR`$x^2$`, XR`$x^4$`, XR`$x^3$`, XR`$|x|$`], [0, 1, 3],
    XR`<p>$x^2$, $x^4$ and $|x|$ are all $\ge0$ with value $0$ at $0$: minima. $x^3$ takes both signs near $0$: no.</p>`, 'Minimum does not require f′(0) = 0.'),
  X(5, 'inequalities by calculus', XR`Which inequalities hold for every $x>0$?`, [XR`$e^x>1+x$`, XR`$\ln(1+x)<x$`, XR`$\sin x<x$`, XR`$\sin x<x-\dfrac{x^3}6$`], [0, 1, 2],
    XR`<p>Each is proved by showing the difference starts at $0$ and has the right sign of derivative. A, B, C are true. D is false: in fact $\sin x>x-\dfrac{x^3}6$ for $x>0$ (the next term of the series is $+\dfrac{x^5}{120}$).</p>`, 'The alternating series for sin x gives bounds on alternating sides.'),
  X(5, 'tangents', XR`Which lines are tangent to $y=x^3$?`, [XR`$y=3x-2$`, XR`$y=12x-16$`, XR`$y=3x+2$`, XR`$y=x$`], [0, 1, 2],
    XR`<p>The tangent at $x=a$ is $y=3a^2x-2a^3$. $a=1$: $y=3x-2$. $a=2$: $y=12x-16$. $a=-1$: $y=3x+2$. For $y=x$ we need $3a^2=1$ and $2a^3=0$: impossible. So A, B, C.</p>`, 'A line with slope 3 can touch the curve at x = 1 or x = −1.'),
  X(5, 'Rolle\'s theorem', XR`$f(x)=x(x-1)(x-2)(x-3)$. Which statements are true?`, [XR`$f'$ has exactly three real zeros`, XR`$x=1.5$ is a zero of $f'$`, XR`$f''$ has exactly two real zeros`, XR`$f'$ has two zeros in $(1,2)$`], [0, 1, 2],
    XR`<p>By Rolle there is a zero of $f'$ in each of $(0,1),(1,2),(2,3)$, and $f'$ has degree 3, so exactly three, one in each interval: A true and D false. $f(1.5-t)=f(1.5+t)$ (symmetry), so $f'(1.5)=0$: B true. $f'$ has three real zeros, so $f''$ has two between them (and degree 2): C true.</p>`, 'A cubic has at most 3 zeros: Rolle already uses them all.'),
  X(5, 'number of roots', XR`For which values of $a$ does $x^3-3ax+2=0$ have exactly one real root?`, ['$a=-1$', XR`$a=\dfrac12$`, '$a=1$', '$a=2$'], [0, 1],
    XR`<p>If $a\le0$, $f'=3x^2-3a\ge0$ and $f$ is increasing: one root. If $a>0$, the critical values are $f(\pm\sqrt a)=2\mp2a\sqrt a$; exactly one root iff they have the same sign, i.e. $a^{3/2}<1$, $a<1$. So $a=-1$ and $a=\frac12$ work. $a=1$ gives $(x-1)^2(x+2)$: two distinct roots. $a=2$: three roots.</p>`, 'At a = 1 the repeated root gives two distinct real roots, not one.'),
  X(5, 'inequalities by calculus', XR`Let $f(x)=x^{1/x}$ for $x>0$. Which statements are true?`, [XR`$f$ has its greatest value at $x=e$`, XR`$f$ is increasing on $(0,e)$`, XR`$e^\pi>\pi^e$`, XR`$4^{1/4}>3^{1/3}$`], [0, 1, 2],
    XR`<p>$\dfrac{f'}f=\dfrac{1-\ln x}{x^2}$: positive before $e$, negative after: A, B true. Since $e<\pi$, $f(e)>f(\pi)$: $e^{1/e}>\pi^{1/\pi}$. Raise to the power $e\pi$: $e^\pi>\pi^e$: C true. $f$ is decreasing after $e$, so $f(4)<f(3)$: D false ($1.414<1.442$).</p>`, 'Past the maximum, bigger inputs give smaller values.'),
  S(4, 'normals', XR`The normal to a curve at a point is perpendicular to the tangent there.`, XR`The product of the slopes of the tangent and the normal is always $-1$.`, 1,
    XR`<p>I is the definition. II fails if the tangent is horizontal (slope $0$): the normal is vertical and has no slope, so the product is not defined. II is false.</p>`, 'Horizontal and vertical lines are the exception.'),
  S(5, 'inequalities by calculus', XR`$\ln x\le x-1$ for every $x>0$.`, XR`$e^x\ge1+x$ for every real $x$.`, 0,
    XR`<p>Let $g(x)=x-1-\ln x$: $g'=1-\dfrac1x$, minimum at $x=1$ with $g(1)=0$, so $g\ge0$. Let $h(x)=e^x-1-x$: $h'=e^x-1$, minimum at $0$ with $h(0)=0$. Both are true (and each follows from the other).</p>`, 'Both are tangent-line inequalities at x = 1 and x = 0.'),
  SC(4, 'mixed', [XR`A cubic polynomial has at most two critical points.`, XR`Every cubic polynomial has exactly one point of inflection.`, XR`If $f'(c)=0$, then $f$ has a local extremum at $c$.`, XR`A continuous function on $(0,1)$ always attains its greatest value.`], '2', ['1', '3', '4'],
    XR`<p>1: $f'$ is quadratic, so at most two zeros: true. 2: $f''$ is linear with exactly one zero and it changes sign: true. 3: false ($x^3$). 4: false (an open interval: $f(x)=x$ on $(0,1)$ has no greatest value). Two are correct.</p>`, 'On an open interval the extreme value theorem does not apply.'),
  SC(5, 'concavity', [XR`If $f''(c)=0$, then $c$ is a point of inflection.`, XR`If $f$ is concave up on an interval, then $f'$ is increasing there.`, XR`The tangent line to a concave-up graph lies below the graph.`, XR`Every polynomial of even degree has at least one critical point.`], '3', ['1', '2', '4'],
    XR`<p>1: false ($x^4$). 2: true. 3: true (tangent lines of convex functions are underestimates). 4: true: $f'$ has odd degree, so it has a real zero. Statements 2, 3, 4: three correct.</p>`, 'f″(c) = 0 needs a sign change of f″.'),
  A(4, 'maxima and minima', XR`$f(x)=|x|$ has a local minimum at $x=0$ even though $f'(0)$ does not exist.`, XR`A local extremum can occur only at points where $f'=0$.`, 2,
    XR`<p>A is true. R is false: extrema can also occur where the derivative does not exist (critical points include those). So A true, R false.</p>`, 'Critical points are f′ = 0 or f′ not defined.'),
  A(4, 'Rolle\'s theorem', XR`Between two consecutive real roots of a polynomial $p(x)$ there is a root of $p'(x)$.`, XR`Rolle's theorem applies to polynomials on any closed interval whose end values are equal.`, 0,
    XR`<p>A polynomial is continuous and differentiable everywhere. If $p(a)=p(b)=0$, Rolle gives $c\in(a,b)$ with $p'(c)=0$. R is exactly this argument.</p>`, 'Polynomials never violate the hypotheses of Rolle.'),
  A(5, 'number of roots', XR`If $f'(x)>0$ for all real $x$, then $f(x)=0$ has exactly one real root.`, XR`A strictly increasing function can cross the $x$-axis at most once.`, 3,
    XR`<p>R is true. A is false: $f(x)=e^x$ has $f'>0$ but no root. The root need not exist; at most one is guaranteed. So A false, R true.</p>`, 'At most one is not the same as exactly one.'),
  // ---- passages ----
  PI(3, 'optimisation', 'xp4', XR`Find the value of $x$ (in m) that gives the greatest area.`, 30,
    XR`<p>$A(x)=x(120-2x)=120x-2x^2$. $A'=120-4x=0$ gives $x=30$. $A''=-4<0$: maximum.</p>`, 'The parallel side is 120 − 2x = 60 m, not 30 m.', () => 30),
  PI(3, 'optimisation', 'xp4', XR`Find the greatest area (in m$^2$).`, 1800,
    XR`<p>At $x=30$ the sides are $30$ m (two of them) and $60$ m: area $30\times60=1800$ m$^2$.</p>`, 'Area = x(120 − 2x) at x = 30.', () => 30 * 60),
  PM(4, 'concavity', 'xp4', XR`$A''(x)$ equals`, '$-4$', ['$-2$', '$4$', '$120-4x$'],
    XR`<p>$A=120x-2x^2$, $A'=120-4x$, $A''=-4<0$ for every $x$, so every critical point is a maximum.</p>`, 'A′ is 120 − 4x; do not stop there.'),
  PI(4, 'global extrema', 'xp5', XR`Find the local maximum value of $f$.`, 10,
    XR`<p>$f'=3(x-3)(x+1)$ is positive for $x<-1$ and negative on $(-1,3)$: local maximum at $x=-1$. $f(-1)=-1-3+9+5=10$.</p>`, 'The local maximum is at x = −1, and the local minimum at x = 3.', () => -1 - 3 + 9 + 5),
  PI(5, 'global extrema', 'xp5', XR`Find (greatest value of $f$ on $[-2,6]$) $-$ (least value of $f$ on $[-2,6]$).`, 81,
    XR`<p>Compare $f(-2)=3$, $f(-1)=10$, $f(3)=27-27-27+5=-22$, $f(6)=216-108-54+5=59$. The greatest is $59$, the least is $-22$. The difference is $81$.</p>`, 'The greatest value is at the end x = 6, not at the local maximum x = −1.', () => 59 - (-22)),
  PI(5, 'number of roots', 'xp5', XR`How many zeros does $f$ have in $[-2,6]$?`, 2,
    XR`<p>$f(-2)=3>0$ and $f$ rises to $f(-1)=10$: no zero on $[-2,-1]$. It falls to $f(3)=-22$: one zero in $(-1,3)$. It then rises to $f(6)=59>0$: one zero in $(3,6)$. In total $2$ (the third zero of the cubic lies left of $-2$).</p>`, 'The cubic has three real zeros, but one is outside the interval.', () => 2),
  PN(4, 'optimisation', 'xp6', XR`At the nearest point, what is $x^2$? (2 decimal places)`, 1.5, 0.01,
    XR`<p>Write $u=x^2$: $D=u+(u-2)^2=u^2-3u+4$. $\dfrac{dD}{du}=2u-3=0$ gives $u=\dfrac32$. ($u\ge0$ is allowed, and $D''>0$.)</p>`, 'Substituting u = x² reduces it to a quadratic.', () => 1.5),
  PN(4, 'optimisation', 'xp6', XR`What is the least value of $D$? (2 decimal places)`, 1.75, 0.01,
    XR`<p>$D=u^2-3u+4$ at $u=\dfrac32$: $\dfrac94-\dfrac92+4=\dfrac74=1.75$.</p>`, 'This is the square of the distance.', () => 1.75),
  PM(5, 'optimisation', 'xp6', XR`The shortest distance from $P$ to the parabola is`, XR`$\dfrac{\sqrt7}2$`, [XR`$\dfrac74$`, XR`$\sqrt2$`, XR`$2$`],
    XR`<p>$D_{\min}=\dfrac74$, so the distance is $\sqrt{D_{\min}}=\dfrac{\sqrt7}2\approx1.32$. (The point $(0,0)$, at distance $2$, is a local maximum of $D$ along the curve, not the nearest point.)</p>`, 'Take the square root at the end.'),
);

XGN.push(
  GX('xg01', 3, 'nat', 'integer', 'optimisation', (rng) => {
    const m = int(rng, 2, 5);
    return { m, answer: 3 * m * m, tol: 0, q: XR`The least value of $f(x)=x^2+\dfrac{${2 * m ** 3}}x$ for $x>0$ is`, sol: XR`<p>$f'(x)=2x-\dfrac{${2 * m ** 3}}{x^2}=0$ gives $x^3=${m ** 3}$, so $x=${m}$. $f''>0$, so it is a minimum. $f(${m})=${m * m}+${2 * m * m}=${3 * m * m}$.</p>` };
  }, (p) => Math.round(xmin((x) => x * x + 2 * p.m ** 3 / x, 0.1, 20, 200000).v)),
  GX('xg02', 4, 'nat', 'integer', 'optimisation', (rng) => {
    const s = choose(rng, [9, 12, 15, 18, 21, 24]);
    const ans = 2 * s ** 3 / 27;
    return { s, answer: ans, tol: 0, q: XR`An open box is made from a square sheet of side $${s}$ cm by cutting a square of side $x$ from each corner and folding up the sides. Find the greatest possible volume (in cm$^3$).`, sol: XR`<p>$V=x(${s}-2x)^2$. $V'=(${s}-2x)(${s}-6x)=0$ gives $x=${s / 6}$ (the other root $x=${s / 2}$ gives zero volume). $V(${s / 6})=${s / 6}\cdot${(2 * s) / 3}^2=${ans}$.</p>` };
  }, (p) => Math.round(xmax((x) => x * (p.s - 2 * x) ** 2, 0, p.s / 2, 300000).v)),
  GX('xg03', 3, 'mcq', 'single', 'monotonicity', (rng) => {
    const k = int(rng, 2, 6);
    const { options, answer } = shuffleOpts(rng, `$\\left(-\\infty,\\dfrac1${k}\\right)$`, [`$\\left(\\dfrac1${k},\\infty\\right)$`, `$(-\\infty,${k})$`, `$\\left(0,\\dfrac1${k}\\right)$`]);
    return { k, options, answer, q: XR`$f(x)=xe^{-${k}x}$ is increasing on`, sol: XR`<p>$f'(x)=e^{-${k}x}(1-${k}x)$. Since $e^{-${k}x}>0$, $f'>0$ exactly when $x<\dfrac1${k}$. So $f$ is increasing on $\left(-\infty,\dfrac1${k}\right)$.</p>` };
  }, (p) => { const f = (x) => x * xexp(-p.k * x); const a = xd(f, 1 / p.k - 0.05) > 0, b = xd(f, 1 / p.k + 0.05) < 0, c = xd(f, -3) > 0; return a && b && c ? p.answer : -1; }),
  GX('xg04', 4, 'nat', 'numeric', 'optimisation', (rng) => {
    const a = int(rng, 3, 12);
    const ans = 2 * Math.sqrt(a - 1);
    return { a, answer: +ans.toFixed(3), tol: 0.01, q: XR`Find the shortest distance from the point $(${a},0)$ to the parabola $y^2=4x$ (2 decimal places).`, sol: XR`<p>$D=(x-${a})^2+4x$. $D'=2(x-${a})+4=0$ gives $x=${a - 2}$ and $D=4+${4 * (a - 2)}=${4 * a - 4}$. Distance $=\sqrt{${4 * a - 4}}=${ans.toFixed(2)}$.</p>` };
  }, (p) => Math.sqrt(xmin((x) => (x - p.a) ** 2 + 4 * x, 0, p.a + 5, 300000).v)),
  GX('xg05', 4, 'nat', 'integer', 'number of roots', (rng) => {
    const k = choose(rng, [-4, -3, -2, -1, 0, 1, 2, 3, 4]);
    const ans = xab(k) < 2 ? 3 : xab(k) === 2 ? 2 : 1;
    return { k, answer: ans, tol: 0, q: XR`How many distinct real roots does $x^3-3x${xsg(k)}=0$ have?`, sol: XR`<p>$f(x)=x^3-3x${xsg(k)}$, $f'=3(x^2-1)$: local maximum at $x=-1$ with $f(-1)=${k + 2}$ and local minimum at $x=1$ with $f(1)=${k - 2}$. The number of roots depends on these: three if they have opposite signs, two if one is zero, one if they have the same sign. Here the values are $${k + 2}$ and $${k - 2}$, so there are $${ans}$ distinct real roots.</p>` };
  }, (p) => { const f = (x) => x ** 3 - 3 * x + p.k; const rts = []; let prev = f(-4); for (let x = -4 + 1e-4; x <= 4; x += 1e-4) { const v = f(x); if (prev * v < 0) rts.push(x); prev = v; } [-1, 1].forEach((c) => { if (xab(f(c)) < 1e-9) rts.push(c); }); return new Set(rts.map((r) => Math.round(r * 100))).size; }),
  GX('xg06', 3, 'mcq', 'single', 'normals', (rng) => {
    const n = int(rng, 2, 7);
    const { options, answer } = shuffleOpts(rng, `$-\\dfrac1${n}$`, [`$-${n}$`, `$\\dfrac1${n}$`, `$${n}$`]);
    return { n, options, answer, q: XR`The slope of the normal to the curve $y=x^{${n}}$ at $x=1$ is`, sol: XR`<p>$y'=${n}x^{${n - 1}}=${n}$ at $x=1$. The normal's slope is the negative reciprocal: $-\dfrac1${n}$.</p>` };
  }, (p) => (Math.abs(-1 / xd((x) => x ** p.n, 1) + 1 / p.n) < 1e-6 ? p.answer : -1)),
  GX('xg07', 3, 'nat', 'numeric', 'approximation', (rng) => {
    const n = int(rng, 10, 25), k = int(rng, 1, 2);
    const ans = n + k / (2 * n);
    return { n, k, answer: +ans.toFixed(4), tol: 0.002, q: XR`Using differentials, the approximate value of $\sqrt{${n * n + k}}$ is (3 decimal places)`, sol: XR`<p>Take $f(x)=\sqrt x$ at $x=${n * n}$ with $dx=${k}$. $f'(x)=\dfrac1{2\sqrt x}=\dfrac1{${2 * n}}$. So $\sqrt{${n * n + k}}\approx${n}+\dfrac{${k}}{${2 * n}}=${ans.toFixed(3)}$.</p>` };
  }, (p) => Math.sqrt(p.n * p.n + p.k)),
  GX('xg08', 4, 'nat', 'integer', 'tangents', (rng) => {
    const k = int(rng, 2, 9), a = choose(rng, [1, 2, 3, 4]);
    return { k, a, answer: 2 * k, tol: 0, q: XR`The tangent to $xy=${k}$ at the point $\left(${a},\dfrac{${k}}{${a}}\right)$ and the coordinate axes form a triangle. Find its area (in square units).`, sol: XR`<p>$y'=-\dfrac yx=-\dfrac{${k}}{${a * a}}$ at the point. The tangent meets the axes at $x=${2 * a}$ and $y=\dfrac{${2 * k}}{${a}}$. Area $=\dfrac12\cdot${2 * a}\cdot\dfrac{${2 * k}}{${a}}=${2 * k}$ (it does not depend on the point).</p>` };
  }, (p) => { const f = (x) => p.k / x; const m = xd(f, p.a), y0 = f(p.a); const xi = p.a - y0 / m, yi = y0 - m * p.a; return Math.round(0.5 * xab(xi) * xab(yi)); }),
  GX('xg09', 5, 'nat', 'integer', 'optimisation', (rng) => {
    const a = int(rng, 2, 7), b = int(rng, 2, 7);
    return { a, b, answer: a * b, tol: 0, q: XR`A tangent to the ellipse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$ at a point in the first quadrant meets the axes, forming a triangle with them. Find the least possible area of this triangle.`, sol: XR`<p>Tangent at $(${a}\cos\theta,${b}\sin\theta)$: $\dfrac{x\cos\theta}{${a}}+\dfrac{y\sin\theta}{${b}}=1$, with intercepts $\dfrac{${a}}{\cos\theta}$ and $\dfrac{${b}}{\sin\theta}$. Area $=\dfrac{${a * b}}{2\sin\theta\cos\theta}=\dfrac{${a * b}}{\sin2\theta}\ge${a * b}$, with equality at $\theta=45^\circ$. Least area $=${a * b}$.</p>` };
  }, (p) => Math.round(xmin((t) => p.a * p.b / (2 * xsin(t) * xcos(t)), 0.01, xPI / 2 - 0.01, 200000).v)),
  GX('xg10', 4, 'nat', 'integer', 'optimisation', (rng) => {
    const k = int(rng, 2, 6);
    return { k, answer: 6 * k * k, tol: 0, q: XR`A closed cylinder has volume $${2 * k ** 3}\pi$ cm$^3$. Its least total surface area is $S\pi$ cm$^2$. Find $S$.`, sol: XR`<p>$\pi r^2h=${2 * k ** 3}\pi$ so $h=\dfrac{${2 * k ** 3}}{r^2}$. Surface area $S_t=2\pi r^2+2\pi rh=2\pi r^2+\dfrac{${4 * k ** 3}\pi}r$. $\dfrac{dS_t}{dr}=4\pi r-\dfrac{${4 * k ** 3}\pi}{r^2}=0$ gives $r^3=${k ** 3}$, $r=${k}$ and $h=${2 * k}=2r$. $S_t=2\pi(${k * k})+${4 * k * k}\pi=${6 * k * k}\pi$.</p>` };
  }, (p) => Math.round(xmin((r) => 2 * r * r + 4 * p.k ** 3 / r, 0.1, 3 * p.k, 200000).v)),
  GX('xg11', 4, 'nat', 'integer', 'Rolle\'s theorem', (rng) => {
    const n = int(rng, 4, 8), j = int(rng, 1, 3);
    return { n, j, answer: n - j, tol: 0, q: XR`$p(x)=(x-1)(x-2)\cdots(x-${n})$ has ${n} distinct real roots. How many real roots does the ${j === 1 ? 'first derivative $p\'(x)$' : j === 2 ? 'second derivative $p\'\'(x)$' : 'third derivative $p\'\'\'(x)$'} have?`, sol: XR`<p>By Rolle's theorem, between consecutive real roots of a polynomial there is a root of its derivative. $p$ has ${n} real roots, so $p'$ has at least ${n - 1}$; its degree is ${n - 1}$, so exactly ${n - 1}$ real roots, all distinct. Repeating, $p^{(${j})}$ has degree ${n - j}$ and exactly ${n - j} real roots.</p>` };
  }, (p) => { let c = []; for (let i = 0; i < p.n; i++) { const r = i + 1; const nc = new Array(c.length + 1).fill(0); (c.length ? c : [1]).forEach((v, k) => { nc[k + 1] += v; nc[k] += -r * v; }); c = c.length ? nc : [-1, 1]; } for (let t = 0; t < p.j; t++) c = c.slice(1).map((v, k) => v * (k + 1)); const ev = (x) => c.reduceRight((s, v) => s * x + v, 0); let cnt = 0, prev = ev(0.5); for (let x = 0.5 + 1e-3; x < p.n + 0.5; x += 1e-3) { const v = ev(x); if (prev * v < 0) cnt++; prev = v; } return cnt; }),
);

Object.assign(groups, XG); items.push(...XIT); gens.push(...XGN);
}
// ==XP-END
export default { topic: 'applications-derivatives', groups, items, gens };
