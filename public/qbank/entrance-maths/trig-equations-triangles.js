// Trigonometric equations and triangles (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

const R = String.raw;
const CUET = false; // Class 12 chapters: level 1-3 mcq also list 'cuet'
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
const base = (level, sub, extra) => ({ level, exams: [...EXS[level], ...(CUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
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
const GEXS = (level, type) => [...EXS[level], ...(CUET && type === 'mcq' && level <= 3 ? ['cuet'] : [])];
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });

const PI_ = Math.PI, E_ = Math.E;
const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, asin = Math.asin, acos = Math.acos, abs = Math.abs, exp = Math.exp, ln = Math.log;
const r4 = (x) => +x.toFixed(4);
const r2 = (x) => +x.toFixed(2);
const TWOD = ' (2 decimal places)';
const D = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const PD = (level, sub, group, q, answer, sol, trap, more = {}) => PN(level, sub, group, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const deg = (r) => (r * 180) / PI_, rad = (d) => (d * PI_) / 180;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** number of distinct zeros of f on [a,b) (b included when `closed`): sign changes on a fine grid, plus exact end zeros */
const zeros = (f, a, b, closed = false, n = 200000) => {
  const h = (b - a) / n; let c = 0; let prev = f(a + 0.3183 * h);
  for (let i = 1; i < n; i++) { const v = f(a + (i + 0.3183) * h); if ((prev < 0) !== (v < 0)) c++; prev = v; }
  if (Math.abs(f(a)) < 1e-9) c++;
  if (closed && Math.abs(f(b)) < 1e-9) c++;
  return c;
};

const groups = {
  m1: {
    title: 'General solutions',
    passage: R`<p>Match each equation in List I with its general solution in List II ($n$ is an integer).</p>`,
    list1: [R`A. $\sin x=0$`, R`B. $\cos x=-1$`, R`C. $\tan x=1$`, R`D. $\sin x=\dfrac12$`],
    list2: [R`p. $x=n\pi+\dfrac\pi4$`, R`q. $x=n\pi+(-1)^n\dfrac\pi6$`, R`r. $x=n\pi$`, R`s. $x=(2n+1)\pi$`],
  },
  m2: {
    title: 'Triangle formulae',
    passage: R`<p>In a triangle $ABC$ with usual notation ($s$ is the semi-perimeter, $\Delta$ the area, $R$ the circumradius), match each quantity in List I with its formula in List II.</p>`,
    list1: [R`A. $r$ (inradius)`, R`B. $r_1$ (exradius opposite $A$)`, R`C. $R$`, R`D. $\tan\dfrac A2$`],
    list2: [R`p. $\dfrac{\Delta}{s-a}$`, R`q. $\dfrac{\Delta}{s}$`, R`r. $\dfrac{abc}{4\Delta}$`, R`s. $\dfrac{r}{s-a}$`],
  },
  m3: {
    title: 'Equations and their number of solutions in $[0,2\\pi)$',
    passage: R`<p>Match each equation in List I with the number of solutions it has in $[0,2\pi)$ in List II.</p>`,
    list1: [R`A. $\sin x=\dfrac12$`, R`B. $\sin 3x=\dfrac12$`, R`C. $\sin x+\cos x=\sqrt2$`, R`D. $\sin x+\cos x=2$`],
    list2: [R`p. $0$`, R`q. $1$`, R`r. $2$`, R`s. $6$`],
  },
  m4: {
    title: 'What the sides tell you about the triangle',
    passage: R`<p>Match each condition in List I with what it says about triangle $ABC$ in List II.</p>`,
    list1: [R`A. $a^2+b^2=c^2$`, R`B. $a^2=b^2+c^2+bc$`, R`C. $a^2=b^2+c^2-bc$`, R`D. $\sin A=\sin B=\sin C$`],
    list2: [R`p. Equilateral`, R`q. $A=120^\circ$`, R`r. Right angled at $C$`, R`s. $A=60^\circ$`],
  },
  p1: {
    title: 'Passage: the wave $\\sin x+\\cos x$',
    passage: R`<p>Let $f(x)=\sin x+\cos x$ for $x\in[0,2\pi]$. Write $f(x)=\sqrt2\sin\left(x+\dfrac\pi4\right)$.</p>`,
  },
  p2: {
    title: 'Passage: the 13-14-15 triangle',
    passage: R`<p>A triangle has sides $a=13$, $b=14$, $c=15$. Let $\Delta$, $R$, $r$ be its area, circumradius and inradius, and $r_1,r_2,r_3$ the exradii opposite $a,b,c$.</p>`,
  },
  p3: {
    title: 'Passage: a tower and a river bank',
    passage: R`<p>From a point $P$ on level ground the angle of elevation of the top of a vertical tower is $30^\circ$. After walking $20$ m straight towards the foot of the tower, to a point $Q$, the angle of elevation becomes $45^\circ$.</p>`,
  },
  p4: {
    title: 'Passage: solving $\\sin x+\\sin 2x+\\sin 3x=0$',
    passage: R`<p>Consider the equation $\sin x+\sin 2x+\sin 3x=0$ for $0\le x<2\pi$. Grouping $\sin x+\sin3x=2\sin2x\cos x$ factorises it as $\sin2x\,(2\cos x+1)=0$.</p>`,
  },
};

const items = [
  // ---------- L1 ----------
  M(1, 'general solution', R`The general solution of $\sin x=0$ is`, R`$x=n\pi$`, [R`$x=2n\pi$`, R`$x=(2n+1)\dfrac\pi2$`, R`$x=n\pi+\dfrac\pi2$`],
    R`<p>Sine is the height on the unit circle. It is $0$ at angles $0,\pi,2\pi,\dots$ and also at $-\pi,-2\pi,\dots$. All of them are $n\pi$.</p>`, '$2n\\pi$ misses the odd multiples of $\\pi$.'),
  M(1, 'general solution', R`The general solution of $\cos x=0$ is`, R`$x=(2n+1)\dfrac\pi2$`, [R`$x=n\pi$`, R`$x=2n\pi\pm\dfrac\pi2\ \text{only for even }n$`, R`$x=n\pi+\dfrac\pi4$`],
    R`<p>Cosine is the horizontal coordinate. It is $0$ at $\pm\dfrac\pi2,\pm\dfrac{3\pi}2,\dots$, which are the odd multiples of $\dfrac\pi2$.</p>`, 'Cosine vanishes at odd multiples of $\\pi/2$; sine at multiples of $\\pi$.'),
  M(1, 'general solution', R`The general solution of $\tan x=\sqrt3$ is`, R`$x=n\pi+\dfrac\pi3$`, [R`$x=2n\pi+\dfrac\pi3$`, R`$x=n\pi+\dfrac\pi6$`, R`$x=2n\pi\pm\dfrac\pi3$`],
    R`<p>$\tan\dfrac\pi3=\sqrt3$. Tangent repeats every $\pi$, so $x=n\pi+\dfrac\pi3$.</p>`, 'Tangent has period $\\pi$, so there is no $\\pm$ and no $2n\\pi$.'),
  I(1, 'number of solutions', R`How many solutions does $\sin x=\dfrac12$ have in $[0,2\pi]$?`, 2,
    R`<p>In $[0,2\pi]$ sine equals $\dfrac12$ at $x=\dfrac\pi6$ and $x=\pi-\dfrac\pi6=\dfrac{5\pi}6$. That is $2$ solutions.</p>`, 'Sine is positive in two quadrants.', { calc: () => zeros((x) => sin(x) - 0.5, 0, 2 * PI_) }),
  I(1, 'principal values', R`The solutions of $\cos x=\dfrac1{\sqrt2}$ in $[0,2\pi]$ are $\dfrac\pi4$ and $\dfrac{k\pi}{4}$. Find $k$.`, 7,
    R`<p>Cosine is positive in quadrants I and IV. The second solution is $2\pi-\dfrac\pi4=\dfrac{7\pi}4$, so $k=7$.</p>`, 'The second root is $2\\pi-\\alpha$, not $\\pi-\\alpha$ (that is for sine).'),
  M(1, 'general solution', R`The general solution of $\cos x=\cos\alpha$ is`, R`$x=2n\pi\pm\alpha$`, [R`$x=n\pi+(-1)^n\alpha$`, R`$x=n\pi+\alpha$`, R`$x=2n\pi+\alpha$`],
    R`<p>Cosine is even and has period $2\pi$, so both $\alpha$ and $-\alpha$ work, repeated every $2\pi$: $x=2n\pi\pm\alpha$.</p>`, '$n\\pi+(-1)^n\\alpha$ is the rule for sine.'),
  M(1, 'general solution', R`The general solution of $\sin x=\sin\alpha$ is`, R`$x=n\pi+(-1)^n\alpha$`, [R`$x=2n\pi\pm\alpha$`, R`$x=n\pi\pm\alpha$`, R`$x=n\pi+\alpha$`],
    R`<p>The two families are $x=2m\pi+\alpha$ and $x=(2m+1)\pi-\alpha$. In one formula this is $x=n\pi+(-1)^n\alpha$.</p>`, 'For $n$ even you get $+\\alpha$; for $n$ odd you get $-\\alpha$ after adding an odd multiple of $\\pi$.'),
  M(1, 'general solution', R`The general solution of $\sin x=-1$ is`, R`$x=2n\pi-\dfrac\pi2$`, [R`$x=2n\pi+\dfrac\pi2$`, R`$x=n\pi-\dfrac\pi2$`, R`$x=(2n+1)\pi$`],
    R`<p>Sine is $-1$ only at the bottom of the unit circle, $-\dfrac\pi2$ and every full turn from it.</p>`, 'One solution per turn, so $2n\\pi$, not $n\\pi$.'),
  I(1, 'principal values', R`The smallest positive solution (in degrees) of $2\sin x=\sqrt3$ is`, 60,
    R`<p>$\sin x=\dfrac{\sqrt3}2$, so $x=60^\circ$ (and $120^\circ$ next).</p>`, 'Write the equation as $\\sin x=\\text{number}$ first.', { calc: () => Math.round(deg(asin(sqrt(3) / 2))) }),
  M(1, 'sine rule', R`In a triangle $ABC$, $\dfrac{a}{\sin A}$ equals`, R`$2R$`, [R`$R$`, R`$\dfrac1{2R}$`, R`$2R^2$`],
    R`<p>The sine rule says $\dfrac a{\sin A}=\dfrac b{\sin B}=\dfrac c{\sin C}=2R$, where $R$ is the circumradius.</p>`, 'It is the diameter, $2R$, not the radius.'),
  I(1, 'circumradius', R`In a triangle $ABC$, $a=7$ and $\sin A=\dfrac12$. Find the circumradius $R$.`, 7,
    R`<p>$2R=\dfrac a{\sin A}=\dfrac7{1/2}=14$, so $R=7$.</p>`, 'Divide by 2 at the end.', { calc: () => 7 / 0.5 / 2 }),
  M(1, 'cosine rule', R`In a triangle $ABC$, $\cos A$ equals`, R`$\dfrac{b^2+c^2-a^2}{2bc}$`, [R`$\dfrac{a^2+b^2-c^2}{2ab}$`, R`$\dfrac{b^2+c^2+a^2}{2bc}$`, R`$\dfrac{b^2+c^2-a^2}{bc}$`],
    R`<p>The cosine rule is $a^2=b^2+c^2-2bc\cos A$. Rearranging gives $\cos A=\dfrac{b^2+c^2-a^2}{2bc}$. The side opposite $A$ goes with the minus sign.</p>`, 'The side opposite the angle is the one subtracted.'),
  I(1, 'area of a triangle', R`Two sides of a triangle are $6$ and $8$ and the angle between them is $90^\circ$. Find its area.`, 24,
    R`<p>Area $=\dfrac12ab\sin C=\dfrac12\cdot6\cdot8\cdot1=24$.</p>`, 'Use the angle between the two sides.', { calc: () => 0.5 * 6 * 8 * sin(PI_ / 2) }),
  M(1, 'area of a triangle', R`Heron's formula for the area $\Delta$ of a triangle is`, R`$\sqrt{s(s-a)(s-b)(s-c)}$`, [R`$s(s-a)(s-b)(s-c)$`, R`$\sqrt{(s-a)(s-b)(s-c)}$`, R`$\dfrac12\sqrt{s(s-a)(s-b)(s-c)}$`],
    R`<p>With $s=\dfrac{a+b+c}2$, $\Delta=\sqrt{s(s-a)(s-b)(s-c)}$.</p>`, 'Do not forget the square root or the $s$ itself.'),
  I(1, 'inradius and exradii', R`A right triangle has sides $5,12,13$. Find its inradius.`, 2,
    R`<p>$s=15$, $\Delta=\dfrac12\cdot5\cdot12=30$. $r=\dfrac\Delta s=\dfrac{30}{15}=2$. (For a right triangle also $r=\dfrac{a+b-c}2=\dfrac{5+12-13}2=2$.)</p>`, '$r=\\Delta/s$, not $\\Delta/(s-a)$.', { calc: () => 30 / 15 }),
  M(1, 'projection formula', R`The projection formula for a triangle $ABC$ is`, R`$a=b\cos C+c\cos B$`, [R`$a=b\cos B+c\cos C$`, R`$a=b\sin C+c\sin B$`, R`$a=b\cos A+c\cos A$`],
    R`<p>Drop the altitude from $A$ onto $BC$. It splits $a$ into $c\cos B$ and $b\cos C$, so $a=b\cos C+c\cos B$.</p>`, 'Each side pairs with the cosine of the angle at the other end.'),
  I(1, 'heights and distances', R`The shadow of a vertical pole is equal to its height. Find the angle of elevation of the sun, in degrees.`, 45,
    R`<p>$\tan\theta=\dfrac{\text{height}}{\text{shadow}}=1$, so $\theta=45^\circ$.</p>`, 'Angle of elevation is from the ground, not from the pole.'),

  // ---------- L2 ----------
  M(2, 'general solution', R`The general solution of $\sin2x=\dfrac12$ is`, R`$x=\dfrac{n\pi}2+(-1)^n\dfrac\pi{12}$`, [R`$x=n\pi+(-1)^n\dfrac\pi{12}$`, R`$x=n\pi+(-1)^n\dfrac\pi6$`, R`$x=\dfrac{n\pi}2\pm\dfrac\pi{12}$`],
    R`<p>$2x=n\pi+(-1)^n\dfrac\pi6$. Divide everything by 2: $x=\dfrac{n\pi}2+(-1)^n\dfrac\pi{12}$.</p>`, 'Halve the whole right side, including $n\\pi$.'),
  M(2, 'general solution', R`The general solution of $\cos3x=\cos x$ is`, R`$x=\dfrac{n\pi}2$`, [R`$x=n\pi$`, R`$x=\dfrac{n\pi}4$`, R`$x=2n\pi$`],
    R`<p>$3x=2n\pi\pm x$. The $+$ sign gives $2x=2n\pi$, so $x=n\pi$. The $-$ sign gives $4x=2n\pi$, so $x=\dfrac{n\pi}2$. The second family contains the first, so $x=\dfrac{n\pi}2$.</p>`, 'Take both signs and then merge the families.'),
  M(2, 'quadratic in a trig function', R`The general solution of $2\sin^2x-5\sin x+2=0$ is`, R`$x=n\pi+(-1)^n\dfrac\pi6$`, [R`$x=n\pi+(-1)^n\dfrac\pi3$`, R`$x=n\pi+(-1)^n\dfrac\pi6\text{ and }x=2n\pi+\dfrac\pi2$`, R`$x=2n\pi\pm\dfrac\pi6$`],
    R`<p>Let $t=\sin x$. $2t^2-5t+2=(2t-1)(t-2)=0$. So $t=\dfrac12$ or $t=2$. Since $|\sin x|\le1$, $t=2$ is rejected. $\sin x=\dfrac12$ gives $x=n\pi+(-1)^n\dfrac\pi6$.</p>`, 'Always reject roots outside $[-1,1]$.'),
  I(2, 'number of solutions', R`How many solutions does $2\cos^2x+3\cos x+1=0$ have in $[0,2\pi]$?`, 3,
    R`<p>$(2\cos x+1)(\cos x+1)=0$. $\cos x=-\dfrac12$ gives $\dfrac{2\pi}3,\dfrac{4\pi}3$. $\cos x=-1$ gives $\pi$. Total $3$.</p>`, 'Count $\\cos x=-1$ too: it gives one solution, not two.', { calc: () => zeros((x) => cos(x) + 0.5, 0, 2 * PI_, true) + 1 }),
  I(2, 'number of solutions', R`How many solutions does $\sin x+\cos x=1$ have in $[0,2\pi)$?`, 2,
    R`<p>$\sqrt2\sin\left(x+\dfrac\pi4\right)=1$, so $\sin\left(x+\dfrac\pi4\right)=\dfrac1{\sqrt2}$. $x+\dfrac\pi4=\dfrac\pi4$ or $\dfrac{3\pi}4$ (inside the window $[\dfrac\pi4,\dfrac{9\pi}4)$). So $x=0$ or $\dfrac\pi2$: $2$ solutions.</p>`, '$x=2\\pi$ is excluded by the half-open interval.'),
  M(3, 'hidden condition', R`The general solution of $\tan3x=\tan x$ is`, R`$x=n\pi$`, [R`$x=\dfrac{n\pi}2$`, R`$x=n\pi\pm\dfrac\pi3$`, R`$x=2n\pi$`],
    R`<p>$3x=n\pi+x$ gives $x=\dfrac{n\pi}2$. But for odd $n$, $x=\dfrac\pi2,\dfrac{3\pi}2,\dots$ and $\tan x$ is not defined there. Keep only even $n$: $x=m\pi$.</p>`, 'Check where $\\tan$ is not defined before you accept the formula.'),
  I(2, 'number of solutions', R`How many solutions does $\sin2x=\dfrac12$ have in $[0,2\pi)$?`, 4,
    R`<p>Let $u=2x\in[0,4\pi)$. $\sin u=\dfrac12$ has $2$ solutions per turn, and there are $2$ turns. So $4$ solutions for $x$.</p>`, 'A multiple angle packs more solutions into the same interval.', { calc: () => zeros((x) => sin(2 * x) - 0.5, 0, 2 * PI_) }),
  M(2, 'sum to product', R`The general solution of $\sin x+\sin3x=0$ is`, R`$x=\dfrac{n\pi}2$`, [R`$x=n\pi$`, R`$x=\dfrac{n\pi}4$`, R`$x=(2n+1)\dfrac\pi2$`],
    R`<p>$\sin x+\sin3x=2\sin2x\cos x=0$. $\sin2x=0$ gives $x=\dfrac{n\pi}2$. $\cos x=0$ gives $x=(2n+1)\dfrac\pi2$, which is already inside the first family. So $x=\dfrac{n\pi}2$.</p>`, 'Merge the families; do not list the same angle twice.'),
  M(2, 'general solution', R`The general solution of $\sin x+\sqrt3\cos x=0$ is`, R`$x=n\pi-\dfrac\pi3$`, [R`$x=n\pi+\dfrac\pi3$`, R`$x=2n\pi-\dfrac\pi3$`, R`$x=n\pi+\dfrac\pi6$`],
    R`<p>Divide by $\cos x$ (it cannot be $0$, since then $\sin x=\pm1\ne0$): $\tan x=-\sqrt3$. So $x=n\pi-\dfrac\pi3$.</p>`, 'The tangent value is negative.'),
  I(2, 'sum of solutions', R`Find the sum of all solutions of $\cos x=\dfrac12$ in $[0,4\pi]$, as a multiple of $\pi$.`, 8,
    R`<p>In $[0,4\pi]$: $\dfrac\pi3,\ \dfrac{5\pi}3,\ \dfrac{7\pi}3,\ \dfrac{11\pi}3$. Sum $=\dfrac{(1+5+7+11)\pi}3=\dfrac{24\pi}3=8\pi$.</p>`, 'Do not stop after the first turn.', { calc: () => (1 + 5 + 7 + 11) / 3 }),
  I(2, 'sum of solutions', R`The sum, in degrees, of all $\theta\in[0^\circ,360^\circ)$ with $\sin\theta=\cos\theta$ is`, 270,
    R`<p>$\tan\theta=1$, so $\theta=45^\circ$ or $225^\circ$. Sum $=270^\circ$.</p>`, 'Tangent repeats every $180^\circ$.', { calc: () => 45 + 225 }),
  M(2, 'general solution', R`The general solution of $\sin^2x=\dfrac34$ is`, R`$x=n\pi\pm\dfrac\pi3$`, [R`$x=2n\pi\pm\dfrac\pi3$`, R`$x=n\pi+(-1)^n\dfrac\pi3$`, R`$x=n\pi\pm\dfrac\pi6$`],
    R`<p>$\sin^2x=\sin^2\alpha$ has the general solution $x=n\pi\pm\alpha$ with $\alpha=\dfrac\pi3$ (since $\sin^2\dfrac\pi3=\dfrac34$).</p>`, '$\\sin^2x=\\sin^2\\alpha$ gives $n\\pi\\pm\\alpha$; $\\cos^2x=\\cos^2\\alpha$ gives the same.'),
  I(2, 'maximum and minimum', R`What is the maximum value of $3\sin x+4\cos x$?`, 5,
    R`<p>For $a\sin x+b\cos x$ the largest value is $\sqrt{a^2+b^2}=\sqrt{9+16}=5$.</p>`, 'The maximum is $\\sqrt{a^2+b^2}$, not $a+b$.', { calc: () => Math.round(sqrt(9 + 16)) }),
  I(2, 'maximum and minimum', R`What is the minimum value of $5\sin x-12\cos x$?`, -13,
    R`<p>The range of $a\sin x+b\cos x$ is $[-\sqrt{a^2+b^2},\sqrt{a^2+b^2}]$. Here $\sqrt{25+144}=13$, so the minimum is $-13$.</p>`, 'The sign of $b$ does not change the range.'),
  M(2, 'sine rule', R`In a triangle $ABC$, $a=2$, $A=30^\circ$, $B=45^\circ$. Then $b=$`, R`$2\sqrt2$`, [R`$\sqrt2$`, R`$4$`, R`$2\sqrt3$`],
    R`<p>$\dfrac b{\sin45^\circ}=\dfrac2{\sin30^\circ}=4$, so $b=4\cdot\dfrac1{\sqrt2}=2\sqrt2$.</p>`, 'Ratio first, then multiply by the sine of the other angle.'),
  M(2, 'cosine rule', R`In a triangle with $a=7$, $b=8$, $c=9$, the value of $\cos A$ is`, R`$\dfrac23$`, [R`$\dfrac34$`, R`$\dfrac5{12}$`, R`$\dfrac13$`],
    R`<p>$\cos A=\dfrac{b^2+c^2-a^2}{2bc}=\dfrac{64+81-49}{2\cdot8\cdot9}=\dfrac{96}{144}=\dfrac23$.</p>`, 'The side opposite $A$ is $a=7$.'),
  I(2, 'area of a triangle', R`Find the area of a triangle with sides $9$, $10$ and $17$.`, 36,
    R`<p>$s=18$. $\Delta=\sqrt{18\cdot9\cdot8\cdot1}=\sqrt{1296}=36$.</p>`, 'Compute each $s-\\text{side}$ separately: $9,8,1$.', { calc: () => sqrt(18 * 9 * 8 * 1) }),
  N(2, 'heights and distances', R`A ladder $10$ m long leans on a wall and makes $60^\circ$ with the ground. How high up the wall does it reach, in metres? (2 decimal places)`, 8.66, 0.01,
    R`<p>Height $=10\sin60^\circ=10\cdot\dfrac{\sqrt3}2=5\sqrt3\approx8.66$ m.</p>`, 'Angle with the ground goes with $\\sin$ for height.', { calc: () => 10 * sin(rad(60)) }),
  M(2, 'half-angle formulae', R`In a triangle $ABC$, $\sin\dfrac A2$ equals`, R`$\sqrt{\dfrac{(s-b)(s-c)}{bc}}$`, [R`$\sqrt{\dfrac{s(s-a)}{bc}}$`, R`$\sqrt{\dfrac{(s-a)(s-b)}{ab}}$`, R`$\sqrt{\dfrac{(s-b)(s-c)}{s(s-a)}}$`],
    R`<p>$\sin\dfrac A2=\sqrt{\dfrac{(s-b)(s-c)}{bc}}$ and $\cos\dfrac A2=\sqrt{\dfrac{s(s-a)}{bc}}$. Their ratio is the last option, which is $\tan\dfrac A2$.</p>`, 'Sine has the two $(s-\\text{other})$ factors on top.'),
  M(2, 'half-angle formulae', R`In a triangle $ABC$, $\tan\dfrac A2$ equals`, R`$\dfrac r{s-a}$`, [R`$\dfrac rs$`, R`$\dfrac{s-a}{r}$`, R`$\dfrac{r}{a}$`],
    R`<p>The incircle touches $AB$ at a point $s-a$ from $A$, and the radius to it is $r$. So $\tan\dfrac A2=\dfrac r{s-a}$.</p>`, 'The tangent length from $A$ is $s-a$.'),
  I(2, 'inradius and exradii', R`Find the inradius of a triangle with sides $8,15,17$.`, 3,
    R`<p>It is right angled ($8^2+15^2=17^2$), area $=60$, $s=20$. $r=\dfrac{60}{20}=3$.</p>`, 'Check right angle to save time.', { calc: () => 60 / 20 }),
  M(2, 'inradius and exradii', R`The exradius $r_1$ (opposite $A$) of triangle $ABC$ is`, R`$\dfrac\Delta{s-a}$`, [R`$\dfrac\Delta s$`, R`$\dfrac\Delta{a}$`, R`$\dfrac{\Delta}{s+a}$`],
    R`<p>Join the excentre $I_1$ to $A$, $B$ and $C$. The triangle $ABC$ equals $\triangle I_1AB+\triangle I_1AC-\triangle I_1BC$, so $\Delta=\dfrac12r_1(c+b-a)=r_1(s-a)$. Hence $r_1=\dfrac\Delta{s-a}$.</p>`, 'Inradius uses $s$; an exradius uses $s-\\text{its side}$.'),
  M(2, 'trigonometric inequalities', R`For $x\in[0,2\pi]$, the solution set of $\sin x>\dfrac12$ is`, R`$\left(\dfrac\pi6,\dfrac{5\pi}6\right)$`, [R`$\left(\dfrac\pi6,\dfrac{\pi}2\right)$`, R`$\left(\dfrac{5\pi}6,\dfrac{13\pi}6\right)$`, R`$\left(0,\dfrac\pi6\right)\cup\left(\dfrac{5\pi}6,\pi\right)$`],
    R`<p>Sine is above $\dfrac12$ between the two points where it equals $\dfrac12$, namely $\dfrac\pi6$ and $\dfrac{5\pi}6$.</p>`, 'Sketch the sine curve and read the part above the line.'),
  M(2, 'trigonometric inequalities', R`For $x\in[-\pi,\pi]$, the solution set of $2\cos x-1\ge0$ is`, R`$\left[-\dfrac\pi3,\dfrac\pi3\right]$`, [R`$\left[-\dfrac\pi6,\dfrac\pi6\right]$`, R`$\left[\dfrac\pi3,\dfrac{5\pi}3\right]$`, R`$\left[-\dfrac{2\pi}3,\dfrac{2\pi}3\right]$`],
    R`<p>$\cos x\ge\dfrac12$. Cosine is $\dfrac12$ at $\pm\dfrac\pi3$ and larger between them.</p>`, 'Cosine is largest near $0$.'),
  M(2, 'sine rule', R`If $\sin A:\sin B:\sin C=3:4:5$, the triangle is`, R`right angled`, [R`equilateral`, R`isosceles with a $120^\circ$ angle`, R`acute angled and scalene`],
    R`<p>By the sine rule $a:b:c=3:4:5$. Since $3^2+4^2=5^2$, the angle opposite the longest side is $90^\circ$.</p>`, 'Ratio of sines equals ratio of sides.'),
  I(2, 'circumradius', R`A triangle has sides $6,8,10$. Find its circumradius.`, 5,
    R`<p>It is right angled, so the hypotenuse is a diameter of the circumcircle: $R=\dfrac{10}2=5$. (Check: $R=\dfrac{abc}{4\Delta}=\dfrac{480}{96}=5$.)</p>`, 'In a right triangle $R$ is half the hypotenuse.', { calc: () => (6 * 8 * 10) / (4 * 24) }),
  M(2, 'projection formula', R`In a triangle $ABC$, $b\cos C+c\cos B$ equals`, R`$a$`, [R`$b+c$`, R`$2R$`, R`$\dfrac a2$`],
    R`<p>It is the projection formula: the two projections of $b$ and $c$ on $BC$ add up to $BC=a$.</p>`, 'It does not involve $\\sin$.'),
  I(2, 'solving triangles', R`In triangle $ABC$, $A=50^\circ$, $B=60^\circ$. Find $C$ in degrees.`, 70,
    R`<p>$A+B+C=180^\circ$, so $C=180-110=70^\circ$.</p>`, 'Angles sum to $180^\circ$.'),
  M(2, 'heights and distances', R`From a point $30$ m from the foot of a tower, the angle of elevation of its top is $45^\circ$. The height of the tower is`, R`$30$ m`, [R`$30\sqrt2$ m`, R`$15\sqrt3$ m`, R`$\dfrac{30}{\sqrt3}$ m`],
    R`<p>$\tan45^\circ=\dfrac h{30}=1$, so $h=30$ m.</p>`, '$\\tan45^\\circ=1$.'),

  // ---------- L3 ----------
  MT(3, 'general solution', 'm1', R`Choose the correct matching for the List I and List II above.`, 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    R`<p>A: $\sin x=0\Rightarrow x=n\pi$ (r). B: $\cos x=-1\Rightarrow x=(2n+1)\pi$ (s). C: $\tan x=1\Rightarrow x=n\pi+\dfrac\pi4$ (p). D: $\sin x=\dfrac12\Rightarrow x=n\pi+(-1)^n\dfrac\pi6$ (q).</p>`, 'Cosine $=-1$ happens only at odd multiples of $\\pi$.'),
  MT(3, 'inradius and exradii', 'm2', R`Choose the correct matching for the List I and List II above.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-s, B-p, C-r, D-q'],
    R`<p>$r=\dfrac\Delta s$ (q); $r_1=\dfrac\Delta{s-a}$ (p); $R=\dfrac{abc}{4\Delta}$ (r); $\tan\dfrac A2=\dfrac r{s-a}$ (s).</p>`, 'Inradius divides by $s$, exradius by $s-a$.'),
  MT(3, 'number of solutions', 'm3', R`Choose the correct matching for the List I and List II above.`, 'A-r, B-s, C-q, D-p', ['A-q, B-s, C-r, D-p', 'A-r, B-s, C-p, D-q', 'A-r, B-r, C-q, D-p'],
    R`<p>A: $\sin x=\dfrac12$ has $2$ solutions (r). B: $3x\in[0,6\pi)$, two per turn and three turns, so $6$ (s). C: $\sqrt2\sin(x+\dfrac\pi4)=\sqrt2$ gives only $x=\dfrac\pi4$, so $1$ (q). D: the maximum of $\sin x+\cos x$ is $\sqrt2<2$, so $0$ (p).</p>`, 'Touching the maximum gives one solution, not two.'),
  MT(3, 'cosine rule', 'm4', R`Choose the correct matching for the List I and List II above.`, 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-s, C-q, D-p', 'A-r, B-q, C-p, D-s'],
    R`<p>A: $c^2=a^2+b^2$ means $C=90^\circ$ (r). B: comparing with $a^2=b^2+c^2-2bc\cos A$ gives $-2\cos A=1$, so $\cos A=-\dfrac12$ and $A=120^\circ$ (q). C: $2\cos A=1$, $A=60^\circ$ (s). D: all sines equal means all sides equal (p).</p>`, 'Match the sign of the $bc$ term with the cosine rule.'),
  I(3, 'number of solutions', R`How many solutions does $\cos x+\cos2x+\cos3x=0$ have in $[0,2\pi)$?`, 6,
    R`<p>$\cos x+\cos3x=2\cos2x\cos x$. So the equation is $\cos2x\,(2\cos x+1)=0$. $\cos2x=0$: $x=\dfrac\pi4,\dfrac{3\pi}4,\dfrac{5\pi}4,\dfrac{7\pi}4$ ($4$ values). $\cos x=-\dfrac12$: $\dfrac{2\pi}3,\dfrac{4\pi}3$ ($2$ values). No overlap, so $6$.</p>`, 'Check that the two families do not share an angle.', { calc: () => zeros((x) => cos(x) + cos(2 * x) + cos(3 * x), 0, 2 * PI_) }),
  M(3, 'equations with parameters', R`The equation $\sin x+\cos x=k$ has a real solution if and only if`, R`$-\sqrt2\le k\le\sqrt2$`, [R`$-1\le k\le1$`, R`$0\le k\le\sqrt2$`, R`$-2\le k\le2$`],
    R`<p>$\sin x+\cos x=\sqrt2\sin\left(x+\dfrac\pi4\right)$ takes every value from $-\sqrt2$ to $\sqrt2$.</p>`, '$|k|\\le1$ is for $\\sin x=k$ alone.'),
  I(3, 'equations with parameters', R`For how many integer values of $k$ does $3\sin x+4\cos x=k$ have a solution?`, 11,
    R`<p>The range is $[-5,5]$, so $k\in\{-5,\dots,5\}$: $11$ integers.</p>`, 'Count both ends and zero.', { calc: () => 2 * 5 + 1 }),
  M(3, 'trigonometric inequalities', R`For $x\in[0,2\pi]$, $\sin x\ge\cos x$ holds for`, R`$\dfrac\pi4\le x\le\dfrac{5\pi}4$`, [R`$0\le x\le\dfrac\pi4$`, R`$\dfrac\pi4\le x\le\dfrac{3\pi}4$`, R`$\dfrac{3\pi}4\le x\le\dfrac{7\pi}4$`],
    R`<p>$\sin x-\cos x=\sqrt2\sin\left(x-\dfrac\pi4\right)\ge0$ when $x-\dfrac\pi4\in[0,\pi]$, i.e. $x\in\left[\dfrac\pi4,\dfrac{5\pi}4\right]$.</p>`, 'The curves cross at $\\pi/4$ and $5\\pi/4$, not $3\\pi/4$.'),
  M(3, 'trigonometric inequalities', R`The solution of $\tan x>\sqrt3$ for $x\in\left(-\dfrac\pi2,\dfrac\pi2\right)$ is`, R`$\left(\dfrac\pi3,\dfrac\pi2\right)$`, [R`$\left(\dfrac\pi6,\dfrac\pi2\right)$`, R`$\left(0,\dfrac\pi3\right)$`, R`$\left(-\dfrac\pi2,\dfrac\pi3\right)$`],
    R`<p>$\tan x$ increases on this interval, and equals $\sqrt3$ at $\dfrac\pi3$. So $x>\dfrac\pi3$ up to the asymptote at $\dfrac\pi2$.</p>`, 'Tangent is increasing, so the inequality direction stays.'),
  M(3, 'trigonometric inequalities', R`For $x\in[0,2\pi]$, the inequality $2\sin^2x-3\sin x+1<0$ holds for`, R`$x\in\left(\dfrac\pi6,\dfrac\pi2\right)\cup\left(\dfrac\pi2,\dfrac{5\pi}6\right)$`, [R`$x\in\left(\dfrac\pi6,\dfrac{5\pi}6\right)$`, R`$x\in\left(\dfrac{\pi}2,\dfrac{3\pi}2\right)$`, R`$x\in\left(0,\dfrac\pi6\right)\cup\left(\dfrac{5\pi}6,\pi\right)$`],
    R`<p>$(2\sin x-1)(\sin x-1)<0$ means $\dfrac12<\sin x<1$. Sine is $\dfrac12$ at $\dfrac\pi6,\dfrac{5\pi}6$ and equals $1$ at $\dfrac\pi2$. So we take $\left(\dfrac\pi6,\dfrac{5\pi}6\right)$ but must remove $\dfrac\pi2$, where $\sin x=1$ and the product is $0$.</p>`, 'The point where $\\sin x=1$ must be removed.'),
  I(3, 'trigonometric inequalities', R`The total length of all $x\in[0,2\pi]$ for which $\sin x>\cos x$, as a multiple of $\pi$, is`, 1,
    R`<p>From the interval $\left(\dfrac\pi4,\dfrac{5\pi}4\right)$ the length is $\pi$.</p>`, 'It is exactly half of the circle.'),
  I(3, 'cosine rule', R`The sides of a triangle are $5$, $7$ and $8$. Find the angle (in degrees) opposite the side $7$.`, 60,
    R`<p>$\cos\theta=\dfrac{5^2+8^2-7^2}{2\cdot5\cdot8}=\dfrac{40}{80}=\dfrac12$, so $\theta=60^\circ$.</p>`, 'Use the side opposite the angle as the subtracted one.', { calc: () => Math.round(deg(acos((25 + 64 - 49) / 80))) }),
  I(3, 'cosine rule', R`The sides of a triangle are $3$, $5$ and $7$. Find its largest angle, in degrees.`, 120,
    R`<p>The largest angle is opposite the side $7$. $\cos C=\dfrac{9+25-49}{30}=-\dfrac12$, so $C=120^\circ$.</p>`, 'The largest angle faces the longest side.', { calc: () => Math.round(deg(acos((9 + 25 - 49) / 30))) }),
  D(3, 'cosine rule', R`In a triangle $a=10$, $b=12$ and $C=45^\circ$. Find $c$.`, 8.62,
    R`<p>$c^2=a^2+b^2-2ab\cos C=100+144-240\cdot\dfrac{\sqrt2}2=244-169.71=74.29$, so $c\approx8.62$.</p>`, 'Do not use $\\sin C$ here.', { calc: () => sqrt(100 + 144 - 240 * cos(rad(45))) }),
  I(3, 'area of a triangle', R`In a triangle $b=7$, $c=8$ and $A=30^\circ$. Find its area.`, 14,
    R`<p>$\Delta=\dfrac12bc\sin A=\dfrac12\cdot7\cdot8\cdot\dfrac12=14$.</p>`, 'The angle must lie between the two sides used.', { calc: () => 0.5 * 7 * 8 * sin(rad(30)) }),
  D(3, 'circumradius', R`Find the circumradius of a triangle with sides $7$, $8$, $9$.`, 4.7,
    R`<p>$s=12$, $\Delta=\sqrt{12\cdot5\cdot4\cdot3}=\sqrt{720}=26.833$. $R=\dfrac{abc}{4\Delta}=\dfrac{504}{107.33}\approx4.70$.</p>`, 'Use $4\\Delta$ in the denominator.', { calc: () => 504 / (4 * sqrt(720)) }),
  M(3, 'inradius and exradii', R`In a triangle $ABC$, the product $r\,r_1r_2r_3$ equals`, R`$\Delta^2$`, [R`$\Delta$`, R`$\Delta^3$`, R`$\dfrac{\Delta^2}{s}$`],
    R`<p>$r=\dfrac\Delta s$, $r_1=\dfrac\Delta{s-a}$, $r_2=\dfrac\Delta{s-b}$, $r_3=\dfrac\Delta{s-c}$. The product is $\dfrac{\Delta^4}{s(s-a)(s-b)(s-c)}=\dfrac{\Delta^4}{\Delta^2}=\Delta^2$.</p>`, 'Heron: $s(s-a)(s-b)(s-c)=\\Delta^2$.'),
  M(3, 'solving triangles', R`In a triangle $A=30^\circ$, $b=8$, $a=5$. The number of triangles possible is`, R`$2$`, [R`$0$`, R`$1$`, R`infinitely many`],
    R`<p>The height is $b\sin A=8\cdot\dfrac12=4$. Since $4<a=5<b=8$, the side $a$ can swing to two positions: two triangles (the ambiguous case).</p>`, 'Compare $a$ with $b\\sin A$ and with $b$.'),
  M(3, 'identities in a triangle', R`In a triangle $ABC$, $\sin2A+\sin2B+\sin2C$ equals`, R`$4\sin A\sin B\sin C$`, [R`$4\cos A\cos B\cos C$`, R`$2\sin A\sin B\sin C$`, R`$1+4\sin A\sin B\sin C$`],
    R`<p>$\sin2A+\sin2B=2\sin(A+B)\cos(A-B)=2\sin C\cos(A-B)$, and $\sin2C=2\sin C\cos C=-2\sin C\cos(A+B)$. Sum $=2\sin C[\cos(A-B)-\cos(A+B)]=4\sin A\sin B\sin C$. Test: equilateral gives $3\cdot\dfrac{\sqrt3}2=4\cdot\dfrac{3\sqrt3}8$. Both are $\dfrac{3\sqrt3}2$.</p>`, 'Test an equilateral triangle to rule out wrong options.'),
  I(3, 'identities in a triangle', R`In a triangle $ABC$, $\tan A=1$ and $\tan B=2$. Find $\tan C$.`, 3,
    R`<p>In a triangle $\tan A+\tan B+\tan C=\tan A\tan B\tan C$. So $3+t=2t$, giving $t=3$.</p>`, 'Check the sign: $C$ is acute, so $\\tan C>0$.', { calc: () => 3 }),
  D(3, 'heights and distances', R`From a point on level ground the angle of elevation of the top of a tower is $60^\circ$. After moving $50$ m directly away from the tower, it is $30^\circ$. Find the height of the tower in metres.`, 43.3,
    R`<p>Let $h$ be the height. Distances: $h\cot60^\circ$ and $h\cot30^\circ$. Their difference is $50$: $h\left(\sqrt3-\dfrac1{\sqrt3}\right)=50$, so $h\cdot\dfrac2{\sqrt3}=50$ and $h=25\sqrt3\approx43.30$ m.</p>`, 'Use $\\cot$ (distance) rather than $\\tan$ to avoid fractions.', { calc: () => 50 / (1 / tan(rad(30)) - 1 / tan(rad(60))) }),
  D(3, 'heights and distances', R`A $6$ m flagstaff stands on top of a tower. From a point on the ground the angles of elevation of the bottom and the top of the flagstaff are $30^\circ$ and $45^\circ$. Find the height of the tower in metres.`, 8.2,
    R`<p>Let the tower be $h$ and the distance $d$. $\tan45^\circ=\dfrac{h+6}d$ gives $d=h+6$. $\tan30^\circ=\dfrac hd$ gives $h=\dfrac{h+6}{\sqrt3}$. So $h(\sqrt3-1)=6$, $h=\dfrac6{\sqrt3-1}=3(\sqrt3+1)\approx8.20$ m.</p>`, 'The top of the flagstaff gives $h+6$, not $6$.', { calc: () => 6 / (sqrt(3) - 1) }),
  A(3, 'equations', R`The equation $\sin x=2$ has no real solution.`, R`$-1\le\sin x\le1$ for every real $x$.`, 0,
    R`<p>R is true and it is exactly why $2$ is not a value of sine, so A follows from R.</p>`, 'Check the range before solving.'),
  A(3, 'general solution', R`The general solution of $\tan x=\tan\alpha$ is $x=n\pi+\alpha$.`, R`$\tan x$ has period $\pi$.`, 0,
    R`<p>Because tangent repeats every $\pi$, adding any multiple of $\pi$ to $\alpha$ keeps the value. So R gives A.</p>`, 'No $\\pm$ here, unlike cosine.'),
  A(3, 'number of solutions', R`In $[0,2\pi)$, $\sin x=\dfrac12$ has exactly one solution $x=\dfrac\pi6$.`, R`$\sin(\pi-\alpha)=\sin\alpha$.`, 3,
    R`<p>A is false: $x=\dfrac{5\pi}6$ is also a solution. R is true, and it is what produces the second solution.</p>`, 'The principal value is only the first of many solutions.'),
  S(3, 'general solution', R`If $\tan x=\tan y$ then $x=y$.`, R`$\tan x$ has period $\pi$.`, 2,
    R`<p>I is false: $x=y+n\pi$ is enough. II is true.</p>`, 'Equal tangents do not force equal angles.'),
  S(3, 'projection formula', R`In any triangle $a=b\cos C+c\cos B$.`, R`In a triangle right angled at $A$, $a^2=b^2+c^2$.`, 0,
    R`<p>Both are true: I is the projection formula, II is Pythagoras (the cosine rule with $\cos A=0$).</p>`, 'Check both parts separately.'),
  S(3, 'area of a triangle', R`The area of the triangle with sides $3,4,5$ is $6$.`, R`The area of a triangle is $\dfrac12ab\sin C$.`, 0,
    R`<p>I: right triangle, area $\dfrac12\cdot3\cdot4=6$. II is the standard formula. Both true.</p>`, 'Right angle gives $\\sin C=1$.'),
  SC(3, 'number of solutions', [R`$\sin x=-1$ has exactly $1$ solution in $[0,2\pi]$`, R`$\tan x=1$ has exactly $2$ solutions in $[0,2\pi]$`, R`$\cos x=1$ has exactly $2$ solutions in $[0,2\pi]$`, R`$\sin x=0$ has exactly $2$ solutions in $[0,2\pi]$`], '3', ['1', '2', '4'],
    R`<p>(1) $x=\dfrac{3\pi}2$ only: true. (2) $\dfrac\pi4,\dfrac{5\pi}4$: true. (3) $0$ and $2\pi$: true, because the interval is closed. (4) $0,\pi,2\pi$ are three solutions, so false. Three statements are correct.</p>`, 'Closed intervals include both end points.'),
  X(3, 'general solution', R`Which of these values of $x$ (in degrees) satisfy $\tan2x=1$?`, [R`$22.5^\circ$`, R`$45^\circ$`, R`$112.5^\circ$`, R`$292.5^\circ$`], [0, 2, 3],
    R`<p>$2x=45^\circ+180^\circ n$, so $x=22.5^\circ+90^\circ n$: $22.5^\circ,112.5^\circ,202.5^\circ,292.5^\circ,\dots$ $45^\circ$ gives $\tan90^\circ$, which is not defined.</p>`, 'Halve the whole general solution, including the period.'),
  X(3, 'solving triangles', R`In a triangle with sides $3,4,5$ ($a=3$, $b=4$, $c=5$), which of the following are correct?`, [R`$r=1$`, R`$R=\dfrac52$`, R`$r_1=3$`, R`$r_3=6$`], [0, 1, 3],
    R`<p>$\Delta=6$, $s=6$. $r=\dfrac66=1$ (true). $R=\dfrac{abc}{4\Delta}=\dfrac{60}{24}=\dfrac52$ (true). $r_1=\dfrac\Delta{s-a}=\dfrac63=2$, so the claim $3$ is false. $r_3=\dfrac\Delta{s-c}=\dfrac61=6$ (true).</p>`, 'The exradius opposite the hypotenuse is the largest.'),

  PD(3, 'maximum and minimum', 'p1', R`Find the maximum value of $f(x)$.`, 1.4142,
    R`<p>$f(x)=\sqrt2\sin\left(x+\dfrac\pi4\right)\le\sqrt2\approx1.41$.</p>`, 'The maximum is $\\sqrt2$, not $2$.', { calc: () => sqrt(2) }),
  PI(3, 'principal values', 'p1', R`At what $x$ (in degrees, in $[0,360]$) does $f$ reach its maximum?`, 45,
    R`<p>$\sin\left(x+\dfrac\pi4\right)=1$ gives $x+\dfrac\pi4=\dfrac\pi2$, so $x=\dfrac\pi4=45^\circ$.</p>`, 'Subtract the shift $\\pi/4$.'),
  PI(3, 'number of solutions', 'p1', R`How many solutions does $f(x)=1.2$ have in $[0,2\pi]$?`, 2,
    R`<p>$\sin\left(x+\dfrac\pi4\right)=\dfrac{1.2}{\sqrt2}\approx0.849$, which lies in $(-1,1)$. On the window $x+\dfrac\pi4\in\left[\dfrac\pi4,\dfrac{9\pi}4\right]$ the value $0.849$ is taken twice (once rising, once falling).</p>`, 'The endpoints of the window give $f=1$, which is below $1.2$.', { calc: () => zeros((x) => sin(x) + cos(x) - 1.2, 0, 2 * PI_) }),
  PI(3, 'number of solutions', 'p1', R`How many solutions does $f(x)=0$ have in $[0,2\pi]$?`, 2,
    R`<p>$\sin x=-\cos x$, so $\tan x=-1$: $x=\dfrac{3\pi}4,\dfrac{7\pi}4$. Two solutions.</p>`, 'Both are in $[0,2\\pi]$.', { calc: () => zeros((x) => sin(x) + cos(x), 0, 2 * PI_) }),
  PI(3, 'area of a triangle', 'p2', R`Find the area $\Delta$ of the triangle.`, 84,
    R`<p>$s=21$. $\Delta=\sqrt{21\cdot8\cdot7\cdot6}=\sqrt{7056}=84$.</p>`, 'The three factors are $8,7,6$.', { calc: () => sqrt(21 * 8 * 7 * 6) }),
  PD(3, 'circumradius', 'p2', R`Find the circumradius $R$.`, 8.125,
    R`<p>$R=\dfrac{abc}{4\Delta}=\dfrac{13\cdot14\cdot15}{336}=\dfrac{2730}{336}=8.125$.</p>`, 'Use $4\\Delta=336$.', { calc: () => 2730 / 336 }),
  PI(3, 'inradius and exradii', 'p2', R`Find the inradius $r$.`, 4,
    R`<p>$r=\dfrac\Delta s=\dfrac{84}{21}=4$.</p>`, '', { calc: () => 84 / 21 }),
  PD(3, 'inradius and exradii', 'p2', R`Find $r_1+r_2+r_3$.`, 36.5,
    R`<p>$r_1=\dfrac{84}8=10.5$, $r_2=\dfrac{84}7=12$, $r_3=\dfrac{84}6=14$. Sum $=36.5$. Check with $r_1+r_2+r_3=4R+r=32.5+4=36.5$.</p>`, 'Each exradius uses $s$ minus its own side.', { calc: () => 84 / 8 + 84 / 7 + 84 / 6 }),
  PD(3, 'heights and distances', 'p3', R`Find the height of the tower, in metres.`, 27.32,
    R`<p>If the height is $h$, then $P$ is $h\cot30^\circ=h\sqrt3$ from the foot and $Q$ is $h\cot45^\circ=h$ from it. The difference is $20$: $h(\sqrt3-1)=20$, $h=\dfrac{20}{0.732}\approx27.32$ m.</p>`, 'The difference of distances equals the walk.', { calc: () => 20 / (sqrt(3) - 1) }),
  PD(3, 'heights and distances', 'p3', R`How far was $P$ from the foot of the tower, in metres?`, 47.32,
    R`<p>$h=27.32$. Distance from $P=h\sqrt3=27.32\cdot1.732\approx47.32$ m. (Also $=h+20$.)</p>`, 'Check: $h+20=47.32$.', { calc: () => 20 / (sqrt(3) - 1) + 20 }),
  PI(3, 'number of solutions', 'p4', R`How many solutions does the equation have in $[0,2\pi)$?`, 6,
    R`<p>$\sin2x=0$ gives $x=0,\dfrac\pi2,\pi,\dfrac{3\pi}2$ (4). $\cos x=-\dfrac12$ gives $\dfrac{2\pi}3,\dfrac{4\pi}3$ (2). Total $6$.</p>`, 'Do not forget $x=0$.', { calc: () => zeros((x) => sin(x) + sin(2 * x) + sin(3 * x), 0, 2 * PI_) }),
  PI(3, 'sum of solutions', 'p4', R`The sum of all the solutions is $k\pi$. Find $k$.`, 5,
    R`<p>$0+\dfrac\pi2+\pi+\dfrac{3\pi}2=3\pi$ and $\dfrac{2\pi}3+\dfrac{4\pi}3=2\pi$. Sum $=5\pi$, so $k=5$.</p>`, 'Add the two families separately.', { calc: () => 0 + 0.5 + 1 + 1.5 + 2 / 3 + 4 / 3 }),

  // ---------- L3-L5 more ----------
  I(3, 'heights and distances', R`From the top of a $60$ m building, the angles of depression of the top and the bottom of a tower are $30^\circ$ and $60^\circ$. Find the height of the tower in metres.`, 40,
    R`<p>Horizontal distance $d=\dfrac{60}{\tan60^\circ}=\dfrac{60}{\sqrt3}=20\sqrt3$. The top of the tower is seen at $30^\circ$ depression, so it is $d\tan30^\circ=20$ m below the roof level. Tower height $=60-20=40$ m.</p>`, 'The $30^\\circ$ line goes to the top of the tower, not to the bottom.', { calc: () => 60 - (60 / tan(rad(60))) * tan(rad(30)) }),
  M(3, 'trigonometric inequalities', R`For $x\in\left(0,\dfrac\pi2\right)$, the inequality $\sin x+\cos x>1$ holds for`, R`every $x$ in the interval`, [R`$x>\dfrac\pi4$ only`, R`$x<\dfrac\pi4$ only`, R`no $x$ in the interval`],
    R`<p>$\sin x+\cos x=\sqrt2\sin\left(x+\dfrac\pi4\right)$. For $x\in\left(0,\dfrac\pi2\right)$, $x+\dfrac\pi4\in\left(\dfrac\pi4,\dfrac{3\pi}4\right)$, where sine is greater than $\dfrac1{\sqrt2}$. So the expression exceeds $1$ throughout. (Also $(\sin x+\cos x)^2=1+\sin2x>1$.)</p>`, 'The value $1$ is attained only at the end points $0$ and $\\pi/2$.'),
  I(3, 'number of solutions', R`How many solutions does $\sin x=|\cos x|$ have in $[0,2\pi)$?`, 2,
    R`<p>Since $|\cos x|\ge0$, we need $\sin x\ge0$, so $x\in[0,\pi]$. There, $\tan x=\pm1$ gives $x=\dfrac\pi4$ and $\dfrac{3\pi}4$. Two solutions.</p>`, 'The modulus restricts $x$ to where $\\sin x\\ge0$.', { calc: () => zeros((x) => sin(x) - abs(cos(x)), 0, 2 * PI_) }),
  M(4, 'trigonometric inequalities', R`For $x\in\left[0,\dfrac\pi2\right]$, the inequality $\sin x\cos x>\dfrac14$ holds for`, R`$x\in\left(\dfrac\pi{12},\dfrac{5\pi}{12}\right)$`, [R`$x\in\left(\dfrac\pi6,\dfrac\pi3\right)$`, R`$x\in\left(\dfrac\pi{12},\dfrac{\pi}{2}\right]$`, R`$x\in\left(\dfrac\pi{4},\dfrac{\pi}{2}\right]$`],
    R`<p>$\sin x\cos x=\dfrac12\sin2x>\dfrac14$ means $\sin2x>\dfrac12$. With $2x\in[0,\pi]$ this is $\dfrac\pi6<2x<\dfrac{5\pi}6$, so $\dfrac\pi{12}<x<\dfrac{5\pi}{12}$.</p>`, 'Halve the interval after you solve for $2x$.'),
  M(4, 'equations with parameters', R`The equation $\sin^2x+\sin x=a$ has a real solution exactly when`, R`$-\dfrac14\le a\le2$`, [R`$0\le a\le2$`, R`$-1\le a\le1$`, R`$-\dfrac14\le a\le\dfrac14$`],
    R`<p>Let $t=\sin x\in[-1,1]$. The function $t^2+t$ has its minimum $-\dfrac14$ at $t=-\dfrac12$, and at the ends it is $0$ (at $t=-1$) and $2$ (at $t=1$). So the range is $\left[-\dfrac14,2\right]$.</p>`, 'The vertex lies inside $[-1,1]$; do not use only the end points.'),
  M(4, 'equations with parameters', R`The equation $\sin x=k^2-3$ has a real solution exactly when $k$ lies in`, R`$[-2,-\sqrt2]\cup[\sqrt2,2]$`, [R`$[-2,2]$`, R`$[\sqrt2,2]$`, R`$[-\sqrt2,\sqrt2]$`],
    R`<p>Need $-1\le k^2-3\le1$, so $2\le k^2\le4$. That gives $\sqrt2\le|k|\le2$: $k\in[-2,-\sqrt2]\cup[\sqrt2,2]$.</p>`, 'Both signs of $k$ work.'),
  I(4, 'number of solutions', R`The number of real solutions of $\sin x=\dfrac x\pi$ is`, 3,
    R`<p>Sine stays within $[-1,1]$, so $|x|\le\pi$. $x=0$ is a root. At $x=\dfrac\pi2$, $\sin x=1>\dfrac12$; at $x=\pi$, $\sin x=0<1$. So there is exactly one more root in $\left(\dfrac\pi2,\pi\right)$. By symmetry there is one in $\left(-\pi,-\dfrac\pi2\right)$. Total $3$.</p>`, 'Sketch both graphs; the line has slope $1/\\pi<1$.', { calc: () => zeros((x) => sin(x) - x / PI_, -4, 4) }),
  I(5, 'number of solutions', R`The number of real solutions of $\sin x=\dfrac x{10}$ is`, 7,
    R`<p>Need $|x|\le10$. $x=0$ is a root, and near the origin sine ($y\approx x$) is above the line (slope $\dfrac1{10}$). For $x>0$: on $(0,\pi)$ sine starts above the line and ends below it ($\sin\pi=0<\dfrac\pi{10}$), so there is one root. On $(\pi,2\pi)$ sine is negative, so none. On $(2\pi,3\pi)$ the sine hump reaches $1>0.9$ near $x=2.5\pi\approx7.85$ where the line is $0.785$, so there are two crossings. On $(3\pi,10)$ sine is negative or small, no root; and $(\pi,2\pi)$ sine is negative. So $3$ positive roots, $3$ negative by symmetry, and $x=0$: total $7$.</p>`, 'Bound $|x|\\le10$ first, then count hump by hump.', { calc: () => zeros((x) => sin(x) - x / 10, -11, 11) }),
  M(4, 'half-angle formulae', R`For the triangle with sides $5,12,13$ (usual notation, $a=5$, $b=12$, $c=13$), $\tan\dfrac A2\tan\dfrac B2$ equals`, R`$\dfrac2{15}$`, [R`$\dfrac13$`, R`$\dfrac15$`, R`$\dfrac{2}{3}$`],
    R`<p>$s=15$, $r=2$. $\tan\dfrac A2=\dfrac r{s-a}=\dfrac2{10}=\dfrac15$ and $\tan\dfrac B2=\dfrac2{3}$. Product $=\dfrac2{15}$. (General formula: $\dfrac{s-c}{s}=\dfrac2{15}$.)</p>`, 'Use $s-a$ for $A$ and $s-b$ for $B$.'),
  M(4, 'half-angle formulae', R`In a triangle $ABC$ with $a,b,c$ in arithmetic progression, $\tan\dfrac A2\tan\dfrac C2$ equals`, R`$\dfrac13$`, [R`$\dfrac12$`, R`$\dfrac23$`, R`$\dfrac34$`],
    R`<p>$\tan\dfrac A2\tan\dfrac C2=\dfrac{s-b}{s}$. With $a+c=2b$, $s=\dfrac{3b}2$ and $s-b=\dfrac b2$. The ratio is $\dfrac13$.</p>`, 'Use the formula with the third side, $b$.'),
  M(4, 'identities in a triangle', R`In a triangle $ABC$, $(a-b)^2\cos^2\dfrac C2+(a+b)^2\sin^2\dfrac C2$ equals`, R`$c^2$`, [R`$a^2+b^2$`, R`$4ab$`, R`$(a+b)^2-c^2$`],
    R`<p>Expand: $(a^2+b^2)\left(\cos^2\dfrac C2+\sin^2\dfrac C2\right)+2ab\left(\sin^2\dfrac C2-\cos^2\dfrac C2\right)=a^2+b^2-2ab\cos C=c^2$.</p>`, 'Spot the cosine rule hiding in $\\sin^2-\\cos^2$.'),
  M(4, 'inradius and exradii', R`In a triangle $ABC$, $r_1+r_2+r_3-r$ equals`, R`$4R$`, [R`$2R$`, R`$R+r$`, R`$s$`],
    R`<p>Standard identity: $r_1+r_2+r_3=4R+r$. Test with the $13,14,15$ triangle: $10.5+12+14-4=32.5=4\cdot8.125$.</p>`, 'Test on a numeric triangle to confirm.'),
  M(4, 'inradius and exradii', R`In a triangle $ABC$, $r_1r_2+r_2r_3+r_3r_1$ equals`, R`$s^2$`, [R`$\Delta^2$`, R`$rs$`, R`$(4R+r)^2$`],
    R`<p>Check on $13,14,15$: $10.5\cdot12+12\cdot14+14\cdot10.5=126+168+147=441=21^2=s^2$. In general $\sum\dfrac{\Delta^2}{(s-a)(s-b)}=\Delta^2\cdot\dfrac{(s-c)+(s-a)+(s-b)}{(s-a)(s-b)(s-c)}=\dfrac{\Delta^2\,s}{\Delta^2/s}=s^2$.</p>`, 'Use a common denominator.'),
  M(4, 'identities in a triangle', R`In a triangle $ABC$, $a\cos A+b\cos B+c\cos C$ equals`, R`$\dfrac{2\Delta}{R}$`, [R`$\dfrac{\Delta}{R}$`, R`$2R$`, R`$\dfrac{\Delta}{2R}$`],
    R`<p>$a\cos A=2R\sin A\cos A=R\sin2A$, so the sum is $R(\sin2A+\sin2B+\sin2C)=4R\sin A\sin B\sin C=4R\cdot\dfrac{abc}{8R^3}=\dfrac{abc}{2R^2}=\dfrac{4R\Delta}{2R^2}=\dfrac{2\Delta}R$. Check on an equilateral triangle of side $1$: sum $=\dfrac32$; $\dfrac{2\Delta}R=\dfrac{2\cdot\sqrt3/4}{1/\sqrt3}=\dfrac32$.</p>`, 'Test with the equilateral triangle.'),
  I(4, 'solving triangles', R`In a triangle $A=30^\circ$, $b=10$ and $a=7$. There are two possible values of the third side $c$. Find their product.`, 51,
    R`<p>Cosine rule: $a^2=b^2+c^2-2bc\cos A$, so $c^2-10\sqrt3\,c+(100-49)=0$. The product of the roots is $51$ (and the sum is $10\sqrt3$). The discriminant $300-204=96>0$, so both are real and positive.</p>`, 'Product of roots is $b^2-a^2$.', { calc: () => 100 - 49 }),
  I(4, 'solving triangles', R`In a triangle $a=3$, $b=4$ and the area is $3\sqrt3$. If $c$ can take two values, find the sum of the squares of those values.`, 50,
    R`<p>$\dfrac12\cdot3\cdot4\sin C=3\sqrt3$ gives $\sin C=\dfrac{\sqrt3}2$, so $C=60^\circ$ or $120^\circ$. $c^2=9+16-24\cos C$: $13$ for $60^\circ$ and $37$ for $120^\circ$. Sum $=50$.</p>`, 'Sine fixes two angles: acute and obtuse.', { calc: () => (25 - 24 * cos(rad(60))) + (25 - 24 * cos(rad(120))) }),
  I(3, 'solving triangles', R`In a triangle $(a+b+c)(b+c-a)=3bc$. Find angle $A$ in degrees.`, 60,
    R`<p>$(b+c)^2-a^2=3bc$ gives $b^2+c^2-a^2=bc$. So $\cos A=\dfrac{bc}{2bc}=\dfrac12$ and $A=60^\circ$.</p>`, 'Expand with the difference of squares.'),
  M(4, 'solving triangles', R`In a triangle $ABC$, $\cos A=\dfrac{\sin B}{2\sin C}$. The triangle is`, R`isosceles with $a=c$`, [R`isosceles with $a=b$`, R`right angled at $B$`, R`equilateral`],
    R`<p>$2\sin C\cos A=\sin B=\sin(A+C)=\sin A\cos C+\cos A\sin C$. So $\sin C\cos A-\cos C\sin A=0$, i.e. $\sin(C-A)=0$, giving $C=A$ and so $a=c$.</p>`, 'Use $\\sin B=\\sin(A+C)$.'),
  M(4, 'inradius and exradii', R`In a triangle $r_1=2r_2=3r_3$. Then $a:b:c$ is`, R`$5:4:3$`, [R`$3:4:5$`, R`$6:5:4$`, R`$4:5:3$`],
    R`<p>$r_1=\dfrac\Delta{s-a}$ etc. $r_1=2r_2$ gives $s-b=2(s-a)$, and $r_1=3r_3$ gives $s-c=3(s-a)$. Let $s-a=x$: then $s-b=2x$, $s-c=3x$, and $(s-a)+(s-b)+(s-c)=s$ gives $s=6x$. So $a=5x$, $b=4x$, $c=3x$.</p>`, 'The largest exradius belongs to the smallest $s-\\text{side}$, hence the largest side.'),
  I(4, 'solving triangles', R`How many non-congruent triangles with integer sides have perimeter $12$?`, 3,
    R`<p>Take $a\le b\le c$ with $a+b>c$ and $c<6$. $c=5$: $(2,5,5),(3,4,5)$. $c=4$: $(4,4,4)$. That is $3$. ($(3,3,6)$ is degenerate.)</p>`, 'The triangle inequality must be strict.', { calc: () => { let n = 0; for (let a = 1; a <= 12; a++) for (let b = a; b <= 12; b++) { const c = 12 - a - b; if (c >= b && a + b > c) n++; } return n; } }),
  D(4, 'area of a triangle', R`The largest possible area of a triangle inscribed in a circle of radius $1$ is`, 1.3,
    R`<p>For a given circumradius $R$ the area is $2R^2\sin A\sin B\sin C$, largest for the equilateral triangle. Side $\sqrt3$, area $\dfrac{\sqrt3}4\cdot3=\dfrac{3\sqrt3}4\approx1.30$.</p>`, 'The equilateral triangle gives the maximum.', { calc: () => (3 * sqrt(3)) / 4 }),
  I(4, 'number of solutions', R`How many solutions does $\sin^4x+\cos^4x=\dfrac58$ have in $[0,2\pi)$?`, 8,
    R`<p>$\sin^4x+\cos^4x=1-2\sin^2x\cos^2x=1-\dfrac12\sin^22x$. So $\dfrac12\sin^22x=\dfrac38$ and $\sin^22x=\dfrac34$. With $u=2x\in[0,4\pi)$, $\sin u=\pm\dfrac{\sqrt3}2$ has $4$ solutions per turn, $8$ in all.</p>`, 'Two turns of $u$.', { calc: () => zeros((x) => sin(x) ** 4 + cos(x) ** 4 - 5 / 8, 0, 2 * PI_) }),
  I(4, 'number of solutions', R`How many solutions does $\cos x+\cos3x+\cos5x+\cos7x=0$ have in $[0,\pi]$?`, 7,
    R`<p>The sum is $4\cos x\cos2x\cos4x$. $\cos x=0$: $\dfrac\pi2$ (1). $\cos2x=0$: $\dfrac\pi4,\dfrac{3\pi}4$ (2). $\cos4x=0$: $\dfrac\pi8,\dfrac{3\pi}8,\dfrac{5\pi}8,\dfrac{7\pi}8$ (4). None coincide, so $7$.</p>`, 'Check that the three families do not overlap.', { calc: () => zeros((x) => cos(x) + cos(3 * x) + cos(5 * x) + cos(7 * x), 0, PI_, true) }),
  X(4, 'equations with parameters', R`For which of the following values of $k$ does $\sin^4x+\cos^4x=k$ have a real solution?`, [R`$0.4$`, R`$0.5$`, R`$0.8$`, R`$1.1$`], [1, 2],
    R`<p>$\sin^4x+\cos^4x=1-\dfrac12\sin^22x$. Since $0\le\sin^22x\le1$, the value lies in $\left[\dfrac12,1\right]$. So $0.5$ and $0.8$ work; $0.4$ and $1.1$ lie outside.</p>`, 'The end value $0.5$ is attained (at $\\sin^22x=1$).'),
  X(4, 'identities in a triangle', R`Which of the following are true for every triangle $ABC$?`, [R`$a=2R\sin A$`, R`$\cos A=\dfrac{b^2+c^2-a^2}{bc}$`, R`$R\ge2r$`, R`$\Delta=rs$`], [0, 2, 3],
    R`<p>(A) sine rule: true. (B) the denominator should be $2bc$: false. (C) Euler's inequality $R\ge2r$: true (equality for equilateral). (D) $\Delta=rs$: true.</p>`, 'A factor $2$ is missing in (B).'),
  A(4, 'solving triangles', R`No triangle exists with sides $3$, $4$ and $8$.`, R`The sum of any two sides of a triangle must exceed the third side.`, 0,
    R`<p>$3+4=7<8$, so the condition fails. R is the reason A holds. (Equivalently, the cosine rule gives $\cos C=\dfrac{9+16-64}{24}<-1$.)</p>`, 'The cosine of an angle cannot be below $-1$.'),
  A(4, 'cosine rule', R`If $a^2+b^2>c^2$ in a triangle $ABC$, then the triangle is acute angled.`, R`$\cos C=\dfrac{a^2+b^2-c^2}{2ab}$.`, 3,
    R`<p>R is true, and it shows only that $C$ is acute. A is false: the other angles may still be obtuse. Example: sides $2,2,3$. For the angle opposite a side $2$ the condition holds ($2^2+3^2>2^2$), but the angle opposite $3$ has $\cos=\dfrac{4+4-9}{8}<0$, so it is obtuse.</p>`, 'Acute triangle needs the condition for all three angles.'),
  A(4, 'solving triangles', R`For $A=30^\circ$, $b=10$ and $a=5$ there is exactly one triangle.`, R`If $a=b\sin A$, the side $a$ just touches the opposite side, giving one right angled triangle.`, 0,
    R`<p>$b\sin A=10\cdot\dfrac12=5=a$, so $B=90^\circ$ and the triangle is unique. R is the explanation.</p>`, 'The borderline case of the ambiguous case.'),
  S(4, 'inradius and exradii', R`$r\le\dfrac R2$ in every triangle.`, R`$r=\dfrac R2$ for an equilateral triangle.`, 0,
    R`<p>Euler: $R\ge2r$. For an equilateral triangle of side $a$, $R=\dfrac a{\sqrt3}$ and $r=\dfrac a{2\sqrt3}$, so $r=\dfrac R2$. Both are true.</p>`, ''),
  S(4, 'identities in a triangle', R`If $a\cos A=b\cos B$ in a triangle, then the triangle must be isosceles.`, R`If $a\cos A=b\cos B$, then $a=b$ or $C=90^\circ$.`, 2,
    R`<p>$\sin2A=\sin2B$ gives $A=B$ or $2A+2B=\pi$, i.e. $C=90^\circ$. So a right angled triangle also works: I is false, II true.</p>`, 'Two angles can have equal $\\sin2\\theta$ without being equal.'),
  S(5, 'general solution', R`If $\sin x=\sin y$ and $\tan x=\tan y$, then $x=y+2n\pi$.`, R`For $y=0$ the pair of conditions is satisfied by $x=\pi$.`, 2,
    R`<p>$x=\pi,\ y=0$: $\sin\pi=\sin0=0$ and $\tan\pi=\tan0=0$, but $\pi\ne0+2n\pi$. So I is false and II is true. (When $\cos y\ne0,\ \pm1$-type cases are excluded, equal sine and cosine are what force $x=y+2n\pi$.)</p>`, 'Two conditions are not always enough; give a counter example.'),
  S(4, 'general solution', R`If $\tan x=\tan y$ and $\cos x=\cos y$, then $x=y+2n\pi$.`, R`If $\sin x=\sin y$ and $\cos x=\cos y$, then $x=y+2n\pi$.`, 0,
    R`<p>II: two points on the unit circle with the same coordinates coincide, so the angles differ by $2n\pi$. I: $\tan$ equal means $x=y+m\pi$; with $m$ odd, $\cos x=-\cos y$, which equals $\cos y$ only if $\cos y=0$, where tangent is not defined. So $m$ is even. Both true.</p>`, ''),
  SC(4, 'number of solutions', [R`$\cos x=-1$ has exactly $1$ solution in $[0,2\pi)$`, R`$\sin3x=0$ has exactly $6$ solutions in $[0,2\pi)$`, R`$\tan x=0$ has exactly $2$ solutions in $[0,2\pi)$`, R`$\sin x=\cos x$ has exactly $4$ solutions in $[0,2\pi)$`], '3', ['1', '2', '4'],
    R`<p>(1) $x=\pi$: true. (2) $3x=n\pi$, $x=\dfrac{n\pi}3$ for $n=0,\dots,5$: true. (3) $x=0,\pi$: true. (4) $\tan x=1$ has only $\dfrac\pi4,\dfrac{5\pi}4$: false. So $3$.</p>`, 'Count with the half-open interval.'),
  I(5, 'number of solutions', R`How many solutions does $\sin(\pi\cos x)=\cos(\pi\sin x)$ have in $[0,2\pi)$?`, 4,
    R`<p>Write $\sin(\pi\cos x)=\cos\left(\dfrac\pi2-\pi\cos x\right)$. The equation becomes $\cos\left(\dfrac\pi2-\pi\cos x\right)=\cos(\pi\sin x)$. Then $\pi\sin x=\pm\left(\dfrac\pi2-\pi\cos x\right)+2m\pi$, i.e. $\sin x+\cos x=\dfrac12+2m$ or $\sin x-\cos x=-\dfrac12+2m$. Since $|\sin x\pm\cos x|\le\sqrt2$, only $m=0$ works in each. $\sin x+\cos x=\dfrac12$ has $2$ solutions in $[0,2\pi)$, and $\sin x-\cos x=-\dfrac12$ has $2$. They do not overlap, so $4$.</p>`, 'The $2m\\pi$ terms are killed by the bound $\\sqrt2$.', { calc: () => zeros((x) => sin(PI_ * cos(x)) - cos(PI_ * sin(x)), 0, 2 * PI_) }),
  I(5, 'solving triangles', R`The sides of a triangle are $x$, $x+1$ and $x+2$ (consecutive integers). The largest angle is twice the smallest. Find $x$.`, 4,
    R`<p>Smallest angle $A$ (opposite $x$), largest $C$ (opposite $x+2$). $\cos A=\dfrac{(x+1)^2+(x+2)^2-x^2}{2(x+1)(x+2)}=\dfrac{x^2+6x+5}{2(x+1)(x+2)}=\dfrac{x+5}{2(x+2)}$. $\cos C=\dfrac{x^2+(x+1)^2-(x+2)^2}{2x(x+1)}=\dfrac{x-3}{2x}$. Now $C=2A$ gives $\cos C=2\cos^2A-1$: $\dfrac{x-3}{2x}=\dfrac{(x+5)^2}{2(x+2)^2}-1$. Try $x=4$: left $\dfrac18$; right $\dfrac{81}{72}-1=\dfrac18$. It works (sides $4,5,6$). The equation reduces to $x^2-3x-4=0$, so $x=4$ (the root $-1$ is rejected).</p>`, 'Reject the negative root.', { calc: () => { const x = 4; const A = acos((x + 5) / (2 * (x + 2))), C = acos((x - 3) / (2 * x)); return abs(C - 2 * A) < 1e-9 ? 4 : -1; } }),
  I(5, 'circumradius', R`A triangle has circumradius $R=5$ and inradius $r=2$. If $O$ and $I$ are its circumcentre and incentre, find $OI^2$.`, 5,
    R`<p>Euler's formula: $OI^2=R^2-2Rr=25-20=5$.</p>`, 'Remember $OI^2=R(R-2r)$.', { calc: () => 25 - 2 * 5 * 2 }),
  M(5, 'identities in a triangle', R`In a triangle $ABC$, $a^2+b^2+c^2=8R^2$. Then the triangle is`, R`right angled`, [R`equilateral`, R`isosceles but not right angled`, R`obtuse angled`],
    R`<p>$a=2R\sin A$ etc., so $4R^2(\sin^2A+\sin^2B+\sin^2C)=8R^2$ gives $\sin^2A+\sin^2B+\sin^2C=2$. Using $\sin^2A+\sin^2B+\sin^2C=2+2\cos A\cos B\cos C$, we need $\cos A\cos B\cos C=0$, so one angle is $90^\circ$.</p>`, 'For an equilateral triangle the sum is $\\dfrac94$, not $2$.'),
  N(4, 'mixed', R`The roots of $x^2-\dfrac75x+k=0$ are $\sin\theta$ and $\cos\theta$ for some $\theta$. Find $k$ (2 decimal places).`, 0.48, 0.01,
    R`<p>Sum $=\sin\theta+\cos\theta=\dfrac75$, product $=\sin\theta\cos\theta=k$. Square the sum: $1+2k=\dfrac{49}{25}$, so $k=\dfrac{12}{25}=0.48$. (Real roots: $\sin\theta,\cos\theta=\dfrac45,\dfrac35$.)</p>`, 'Use $(\\sin\\theta+\\cos\\theta)^2=1+2\\sin\\theta\\cos\\theta$.', { calc: () => (49 / 25 - 1) / 2 }),


  // ---------- more top-rank items ----------
  I(5, 'number of solutions', R`How many solutions does $\sin x+\sin2x+\sin3x+\sin4x=0$ have in $[0,2\pi)$?`, 8,
    R`<p>Pair the terms: $\sin x+\sin4x=2\sin\dfrac{5x}2\cos\dfrac{3x}2$ and $\sin2x+\sin3x=2\sin\dfrac{5x}2\cos\dfrac x2$. The sum is $2\sin\dfrac{5x}2\left(\cos\dfrac{3x}2+\cos\dfrac x2\right)=4\sin\dfrac{5x}2\cos x\cos\dfrac x2$. Zeros in $[0,2\pi)$: $\sin\dfrac{5x}2=0$ gives $x=\dfrac{2k\pi}5$, $k=0,\dots,4$ (5 values). $\cos x=0$ gives $\dfrac\pi2,\dfrac{3\pi}2$ (2 values). $\cos\dfrac x2=0$ gives $x=\pi$ (1 value). No overlaps, so $8$.</p>`, 'Check that $\\pi$ and $\\dfrac\\pi2$ are not of the form $\\dfrac{2k\\pi}5$.', { calc: () => zeros((x) => sin(x) + sin(2 * x) + sin(3 * x) + sin(4 * x), 0, 2 * PI_) }),
  I(5, 'number of solutions', R`How many solutions does $\tan x+\tan2x+\tan3x=\tan x\tan2x\tan3x$ have in $[0,2\pi)$?`, 6,
    R`<p>For angles $x,2x,3x$ the identity $\tan A+\tan B+\tan C-\tan A\tan B\tan C=\dfrac{\sin(A+B+C)}{\cos A\cos B\cos C}$ holds. So the equation is $\dfrac{\sin6x}{\cos x\cos2x\cos3x}=0$. We need $\sin6x=0$, i.e. $x=\dfrac{n\pi}6$, with $\cos x,\cos2x,\cos3x$ all non-zero. $n$ odd gives $\cos3x=\cos\dfrac{n\pi}2=0$, so these are rejected. $n=0,2,4,6,8,10$ give $x=0,\dfrac\pi3,\dfrac{2\pi}3,\pi,\dfrac{4\pi}3,\dfrac{5\pi}3$, all valid. Total $6$.</p>`, 'Remove the angles where any tangent is not defined.', { calc: () => { let c = 0; for (let n = 0; n < 12; n++) { const x = (n * PI_) / 6; if (abs(sin(6 * x)) < 1e-9 && abs(cos(x)) > 1e-9 && abs(cos(2 * x)) > 1e-9 && abs(cos(3 * x)) > 1e-9) c++; } return c; } }),
  I(4, 'number of solutions', R`How many pairs $(x,y)$ with $x,y\in[0,2\pi]$ satisfy $\sin x+\cos y=2$?`, 2,
    R`<p>Both terms are at most $1$, so we need $\sin x=1$ and $\cos y=1$. $\sin x=1$ gives $x=\dfrac\pi2$ only. $\cos y=1$ gives $y=0$ or $y=2\pi$ (the interval is closed). So the pairs are $\left(\dfrac\pi2,0\right)$ and $\left(\dfrac\pi2,2\pi\right)$: $2$ pairs.</p>`, 'Closed interval: $y=2\\pi$ counts.', { calc: () => 1 * 2 }),
  I(4, 'number of solutions', R`How many real solutions does $\cos x=x^2$ have?`, 2,
    R`<p>$x^2\le1$ is needed, so $|x|\le1$. The function $\cos x-x^2$ is even, decreases from $1$ at $x=0$ to $\cos1-1<0$ at $x=1$, and is strictly decreasing on $[0,1]$ (both $\cos x$ and $-x^2$ decrease). So there is one root in $(0,1)$ and one in $(-1,0)$: $2$ solutions.</p>`, 'Use evenness to count the negative side.', { calc: () => zeros((x) => cos(x) - x * x, -3, 3) }),
  D(4, 'identities in a triangle', R`The maximum value of $\sin A\sin B\sin C$ for angles of a triangle is`, 0.6495,
    R`<p>The product is largest when the triangle is equilateral (by symmetry and concavity of $\ln\sin$): $\left(\dfrac{\sqrt3}2\right)^3=\dfrac{3\sqrt3}8\approx0.65$.</p>`, 'Check unequal angles give a smaller product, e.g. $90^\\circ,45^\\circ,45^\\circ$ gives $0.707\\cdot0.707=0.5$.', { calc: () => 3 * sqrt(3) / 8 }),
  D(4, 'identities in a triangle', R`In the triangle with sides $13,14,15$, find $\cot A+\cot B+\cot C$.`, 1.7560,
    R`<p>The identity $\cot A+\cot B+\cot C=\dfrac{a^2+b^2+c^2}{4\Delta}$ gives $\dfrac{169+196+225}{4\cdot84}=\dfrac{590}{336}\approx1.76$.</p>`, 'Derive the identity from $\\cot A=\\dfrac{b^2+c^2-a^2}{4\\Delta}$.', { calc: () => { const s = [13, 14, 15]; let t = 0; for (let i = 0; i < 3; i++) { const c = vecAng(s[i], s[(i + 1) % 3], s[(i + 2) % 3]); t += 1 / tan(c); } return t; } }),
  X(5, 'inradius and exradii', R`In every triangle $ABC$, which of the following are true?`, [R`$r_1+r_2+r_3\ge9r$`, R`$\dfrac1{r_1}+\dfrac1{r_2}+\dfrac1{r_3}=\dfrac1r$`, R`$r_1r_2r_3=s\Delta$`, R`$r_1+r_2+r_3=4R-r$`], [0, 1, 2],
    R`<p>(A) $r_1+r_2+r_3=4R+r\ge9r$ because $R\ge2r$: true. (B) $\dfrac1{r_1}+\dfrac1{r_2}+\dfrac1{r_3}=\dfrac{(s-a)+(s-b)+(s-c)}\Delta=\dfrac s\Delta=\dfrac1r$: true. (C) $r_1r_2r_3=\dfrac{\Delta^3}{(s-a)(s-b)(s-c)}=\dfrac{\Delta^3s}{\Delta^2}=s\Delta$: true. (D) The correct identity has $4R+r$, so false.</p>`, 'Test with the $13,14,15$ triangle: $r_1+r_2+r_3=36.5=4R+r$.'),
  I(5, 'solving triangles', R`In a triangle $ABC$, $a=7$, $b=8$, $c=9$. Let $D$ be the foot of the altitude from $A$ on $BC$. Find $7\cdot BD$.`, 33,
    R`<p>In the right triangle $ABD$, $BD=c\cos B$. By the cosine rule $\cos B=\dfrac{a^2+c^2-b^2}{2ac}=\dfrac{49+81-64}{126}=\dfrac{66}{126}=\dfrac{11}{21}$. So $BD=9\cdot\dfrac{11}{21}=\dfrac{33}7$ and $7\cdot BD=33$. (Check: $CD=7-\dfrac{33}7=\dfrac{16}7$, and $AD^2=81-\dfrac{1089}{49}=64-\dfrac{256}{49}$, which agree.)</p>`, 'Use the angle at $B$, not at $A$.', { calc: () => 7 * 9 * vecCos(8, 7, 9) }),
  X(3, 'general solution', R`Which of the following give the complete general solution of $\sin2x=0$? ($n$ is an integer.)`, [R`$x=\dfrac{n\pi}2$`, R`$x=\dfrac{2n\pi}4$`, R`$x=n\pi$`, R`$x=\dfrac{(2n+1)\pi}2$`], [0, 1],
    R`<p>$\sin2x=0$ means $2x=n\pi$, so $x=\dfrac{n\pi}2$. Option B is the same set written as $\dfrac{2n\pi}4=\dfrac{n\pi}2$. Option C misses the odd multiples of $\dfrac\pi2$, and option D gives only those.</p>`, 'A subset of the solutions is not the general solution.'),
  X(4, 'general solution', R`Which of the following values of $x\in[0,2\pi)$ satisfy both $\sin x>0$ and $\cos2x=\dfrac12$?`, [R`$\dfrac\pi6$`, R`$\dfrac{5\pi}6$`, R`$\dfrac{7\pi}6$`, R`$\dfrac{11\pi}6$`], [0, 1],
    R`<p>$\cos2x=\dfrac12$ gives $2x=\pm\dfrac\pi3+2k\pi$, so $x=\pm\dfrac\pi6+k\pi$: $\dfrac\pi6,\dfrac{5\pi}6,\dfrac{7\pi}6,\dfrac{11\pi}6$ in $[0,2\pi)$. Sine is positive only for the first two (quadrants I and II).</p>`, 'Solve the equation first, then apply the inequality as a filter.'),
  I(2, 'mixed', R`Let $f(x)=3\sin x+4\cos x+7$. Find the sum of the greatest and the least value of $f$.`, 14,
    R`<p>$3\sin x+4\cos x$ ranges over $[-5,5]$, so $f$ ranges over $[2,12]$. Sum $=2+12=14$. (It is just $2\times7$.)</p>`, 'The shift appears in both values.', { calc: () => (5 + 7) + (-5 + 7) }),
  I(3, 'mixed', R`The lines $y=x$ and $y=\sqrt3\,x$ pass through the origin. Find the acute angle between them, in degrees.`, 15,
    R`<p>The lines make angles $\tan^{-1}1=45^\circ$ and $\tan^{-1}\sqrt3=60^\circ$ with the x-axis. The angle between them is $60^\circ-45^\circ=15^\circ$. (Using $\tan\theta=\left|\dfrac{m_2-m_1}{1+m_1m_2}\right|=\dfrac{\sqrt3-1}{1+\sqrt3}=2-\sqrt3=\tan15^\circ$.)</p>`, 'Use the difference of the two inclinations.', { calc: () => deg(atan(abs((sqrt(3) - 1) / (1 + sqrt(3))))) }),
];


items.forEach((it, i) => { it.id = `te-${String(i + 1).padStart(3, '0')}`; });

// ---------- number templates ----------
const frPi = (a, b) => { const d = gcd(a, b); a /= d; b /= d; return b === 1 ? (a === 1 ? R`\pi` : R`${a}\pi`) : a === 1 ? R`\dfrac\pi${b}` : R`\dfrac{${a}\pi}{${b}}`; };
const uniq = (xs, tol = 1e-7) => { const o = []; for (const x of xs.sort((p, q) => p - q)) if (!o.length || x - o[o.length - 1] > tol) o.push(x); return o; };
const inRange = (xs, lo, hi) => xs.filter((x) => x >= lo - 1e-12 && x < hi - 1e-12);
// Heronian triangles (integer sides and area)
const HER = [[5, 5, 6], [5, 5, 8], [10, 13, 13], [13, 14, 15], [9, 10, 17], [8, 15, 17], [7, 15, 20], [6, 25, 29], [13, 13, 24], [10, 10, 12], [15, 15, 24], [17, 25, 26], [20, 21, 29], [12, 17, 25], [9, 12, 15], [10, 17, 21], [11, 13, 20]];
const heron = (a, b, c) => { const s = (a + b + c) / 2; return sqrt(s * (s - a) * (s - b) * (s - c)); };
/** area through coordinates: B=(0,0), C=(a,0), A found from the cosine rule */
const coordArea = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return 0.5 * a * sqrt(c * c - x * x); };
/** cosine of angle at A (sides a opposite A) through vectors */
const vecCos = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); const y = sqrt(c * c - x * x); const ab = [-x, -y], ac = [a - x, -y]; return (ab[0] * ac[0] + ab[1] * ac[1]) / (c * b); };

const vecAng = (a, b, c) => acos(vecCos(a, b, c));
const SIGLIST = [
  { t: R`\dfrac12`, v: 0.5 }, { t: R`-\dfrac12`, v: -0.5 }, { t: R`\dfrac{\sqrt3}2`, v: sqrt(3) / 2 }, { t: R`-\dfrac1{\sqrt2}`, v: -1 / sqrt(2) },
];
const fr = (n, m) => { const g_ = gcd(abs(n), m); return `${n < 0 ? '-' : ''}\\dfrac{${abs(n) / g_}}{${m / g_}}`; };
const frac = (n, m) => (m / gcd(abs(n), m) === 1 ? `${n / gcd(abs(n), m)}` : fr(n, m));

const CASES2 = [
  { eq: R`\sin x=\dfrac12`, f: (x) => sin(x) - 0.5, right: R`$x=n\pi+(-1)^n\dfrac\pi6$`, pts: (n) => n * PI_ + (-1) ** n * PI_ / 6, kind: 'sin', k: 6 },
  { eq: R`\sin x=\dfrac{\sqrt3}2`, f: (x) => sin(x) - sqrt(3) / 2, right: R`$x=n\pi+(-1)^n\dfrac\pi3$`, pts: (n) => n * PI_ + (-1) ** n * PI_ / 3, kind: 'sin', k: 3 },
  { eq: R`\sin x=\dfrac1{\sqrt2}`, f: (x) => sin(x) - 1 / sqrt(2), right: R`$x=n\pi+(-1)^n\dfrac\pi4$`, pts: (n) => n * PI_ + (-1) ** n * PI_ / 4, kind: 'sin', k: 4 },
  { eq: R`\sin x=-\dfrac{\sqrt3}2`, f: (x) => sin(x) + sqrt(3) / 2, right: R`$x=n\pi-(-1)^n\dfrac\pi3$`, pts: (n) => n * PI_ - (-1) ** n * PI_ / 3, kind: 'sin', k: 3 },
  { eq: R`\cos x=\dfrac12`, f: (x) => cos(x) - 0.5, right: R`$x=2n\pi\pm\dfrac\pi3$`, pts: (n) => 2 * n * PI_ + (n % 2 ? 1 : -1) * PI_ / 3, kind: 'cos', k: 3 },
  { eq: R`\cos x=\dfrac{\sqrt3}2`, f: (x) => cos(x) - sqrt(3) / 2, right: R`$x=2n\pi\pm\dfrac\pi6$`, pts: (n) => 2 * n * PI_ + (n % 2 ? 1 : -1) * PI_ / 6, kind: 'cos', k: 6 },
  { eq: R`\cos x=-\dfrac12`, f: (x) => cos(x) + 0.5, right: R`$x=2n\pi\pm\dfrac{2\pi}3$`, pts: (n) => 2 * n * PI_ + (n % 2 ? 1 : -1) * 2 * PI_ / 3, kind: 'cos', k: 3 },
  { eq: R`\tan x=1`, f: (x) => sin(x) - cos(x), right: R`$x=n\pi+\dfrac\pi4$`, pts: (n) => n * PI_ + PI_ / 4, kind: 'tan', k: 4 },
  { eq: R`\tan x=\dfrac1{\sqrt3}`, f: (x) => sin(x) - cos(x) / sqrt(3), right: R`$x=n\pi+\dfrac\pi6$`, pts: (n) => n * PI_ + PI_ / 6, kind: 'tan', k: 6 },
  { eq: R`\tan x=-\sqrt3`, f: (x) => sin(x) + sqrt(3) * cos(x), right: R`$x=n\pi-\dfrac\pi3$`, pts: (n) => n * PI_ - PI_ / 3, kind: 'tan', k: 3 },
];
const wrongFams = (kind, k, k2) => ({
  sin: [R`$x=2n\pi\pm\dfrac\pi${k}$`, R`$x=n\pi+\dfrac\pi${k}$`, R`$x=n\pi\pm\dfrac\pi${k}$`, R`$x=n\pi+(-1)^n\dfrac\pi${k2}$`],
  cos: [R`$x=n\pi+(-1)^n\dfrac\pi${k}$`, R`$x=n\pi\pm\dfrac\pi${k}$`, R`$x=2n\pi+\dfrac\pi${k}$`, R`$x=2n\pi\pm\dfrac\pi${k2}$`],
  tan: [R`$x=2n\pi+\dfrac\pi${k}$`, R`$x=n\pi\pm\dfrac\pi${k}$`, R`$x=n\pi+(-1)^n\dfrac\pi${k}$`, R`$x=n\pi+\dfrac\pi${k2}$`],
}[kind]);
const SIDE_COS = (a, b, c) => vecCos(a, b, c);

const gens = [
  gen('te-g01', 1, 'nat', 'integer', 'number of solutions', (rng) => {
    const v = int(rng, 0, 3), m = int(rng, 1, 4), fn = choose(rng, ['sin', 'cos']);
    const F = '\\' + fn; const mx = m === 1 ? 'x' : `${m}x`;
    if (v === 0) {
      const a = choose(rng, SIGLIST); const answer = 2 * m;
      return { v, m, fn, a: a.v, answer, tol: 0,
        q: R`How many solutions does $${F} ${mx}=${a.t}$ have in $[0,2\pi)$?`,
        sol: R`<p>Put $u=${mx}$. As $x$ runs over $[0,2\pi)$, $u$ runs over $[0,${2 * m}\pi)$, which is $${m}$ full turn${m > 1 ? 's' : ''}. In each turn $${F} u=${a.t}$ has $2$ solutions, since the value lies strictly between $-1$ and $1$. Total $2\times${m}=${answer}$.</p>` };
    }
    if (v === 1) {
      const a = choose(rng, [1, -1]); const answer = m;
      return { v, m, fn, a, answer, tol: 0,
        q: R`How many solutions does $${F} ${mx}=${a}$ have in $[0,2\pi)$?`,
        sol: R`<p>With $u=${mx}\in[0,${2 * m}\pi)$ there are $${m}$ turn${m > 1 ? 's' : ''}. The value $${a}$ is reached once per turn by $${F} u$ (a single touching point), so there ${m > 1 ? 'are' : 'is'} $${m}$ solution${m > 1 ? 's' : ''}.</p>` };
    }
    if (v === 2) {
      const c = choose(rng, [1, -1, 3, -3]), answer = 2 * m;
      return { v, m, fn: 'tan', a: c, answer, tol: 0,
        q: R`How many solutions does $\tan ${mx}=${c}$ have in $[0,2\pi)$?`,
        sol: R`<p>$\tan u$ takes every value once in each interval of length $\pi$. $u=${mx}$ runs over $[0,${2 * m}\pi)$, which has $${2 * m}$ such interval${m > 1 ? 's' : ''}. So there are $${answer}$ solutions.</p>` };
    }
    const answer = 2 * m;
    return { v, m, fn: 'sin', a: 0, answer, tol: 0,
      q: R`How many solutions does $\sin ${mx}=0$ have in $[0,2\pi)$?`,
      sol: R`<p>$\sin u=0$ at $u=0,\pi,2\pi,\dots$. For $u=${mx}\in[0,${2 * m}\pi)$ the zeros are $u=0,\pi,\dots,${2 * m - 1}\pi$: $${answer}$ of them.</p>` };
  }, (p) => {
    const xs = [];
    for (let n = -80; n <= 80; n++) {
      if (p.v === 3) xs.push((n * PI_) / p.m);
      else if (p.v === 2) xs.push((n * PI_ + atan(p.a)) / p.m);
      else if (p.fn === 'sin') xs.push((n * PI_ + (n % 2 ? -1 : 1) * asin(p.a)) / p.m);
      else { xs.push((2 * n * PI_ + acos(p.a)) / p.m); xs.push((2 * n * PI_ - acos(p.a)) / p.m); }
    }
    return uniq(inRange(xs, 0, 2 * PI_)).length;
  }),

  gen('te-g02', 2, 'mcq', 'single', 'general solution', (rng) => {
    const ci = int(rng, 0, CASES2.length - 1), c = CASES2[ci];
    const k2 = c.k === 3 ? 6 : c.k === 6 ? 3 : 6;
    const { options, answer } = shuffleOpts(rng, c.right, wrongFams(c.kind, c.k, k2));
    return { ci, options, answer,
      q: R`The general solution of $${c.eq}$ ($n$ an integer) is`,
      sol: c.kind === 'sin' ? R`<p>Sine equations $\sin x=\sin\alpha$ have the solution $x=n\pi+(-1)^n\alpha$, where $\alpha$ is an angle with the given sine. Answer: ${c.right}</p>`
        : c.kind === 'cos' ? R`<p>Cosine equations $\cos x=\cos\alpha$ have the solution $x=2n\pi\pm\alpha$, where $\alpha$ is an angle with the given cosine. Answer: ${c.right}</p>`
          : R`<p>Tangent equations $\tan x=\tan\alpha$ have the solution $x=n\pi+\alpha$ (period $\pi$, so no $\pm$). Answer: ${c.right}</p>` };
  }, (p) => { const c = CASES2[p.ci]; for (let n = -3; n <= 4; n++) if (abs(c.f(c.pts(n))) > 1e-9) return -1; return p.answer; }),

  gen('te-g03', 2, 'nat', 'integer', 'sum of solutions', (rng) => {
    const kind = choose(rng, ['sin', 'cos', 'tan']), A = choose(rng, [30, 45, 60]), sgn = choose(rng, [1, -1]);
    const nm = { 30: R`\dfrac12`, 45: R`\dfrac1{\sqrt2}`, 60: R`\dfrac{\sqrt3}2` };
    const tv = { 30: R`\dfrac1{\sqrt3}`, 45: '1', 60: R`\sqrt3` };
    if (kind === 'sin') {
      const val = sgn > 0 ? nm[A] : `-${nm[A]}`; const answer = sgn > 0 ? 180 : 540;
      return { kind, A, sgn, answer, tol: 0, q: R`Find the sum (in degrees) of all $\theta\in[0^\circ,360^\circ)$ with $\sin\theta=${val}$.`,
        sol: sgn > 0 ? R`<p>Sine is positive in quadrants I and II: $\theta=${A}^\circ$ and $180^\circ-${A}^\circ=${180 - A}^\circ$. Sum $=180^\circ$.</p>`
          : R`<p>Sine is negative in quadrants III and IV: $\theta=180^\circ+${A}^\circ=${180 + A}^\circ$ and $360^\circ-${A}^\circ=${360 - A}^\circ$. Sum $=540^\circ$.</p>` };
    }
    if (kind === 'cos') {
      const val = sgn > 0 ? nm[A] : `-${nm[A]}`; const t0 = sgn > 0 ? A : 180 - A;
      return { kind, A, sgn, answer: 360, tol: 0, q: R`Find the sum (in degrees) of all $\theta\in[0^\circ,360^\circ)$ with $\cos\theta=${val}$.`,
        sol: R`<p>The two solutions are mirror images across the x-axis: $\theta=${t0}^\circ$ and $360^\circ-${t0}^\circ=${360 - t0}^\circ$. They always add to $360^\circ$.</p>` };
    }
    const val = sgn > 0 ? tv[A] : `-${tv[A]}`; const answer = sgn > 0 ? 2 * A + 180 : 2 * (180 - A) + 180;
    return { kind, A, sgn, answer, tol: 0, q: R`Find the sum (in degrees) of all $\theta\in[0^\circ,360^\circ)$ with $\tan\theta=${val}$.`,
      sol: sgn > 0 ? R`<p>Tangent is positive in quadrants I and III: $\theta=${A}^\circ$ and $${A + 180}^\circ$. Sum $=${answer}^\circ$.</p>`
        : R`<p>Tangent is negative in quadrants II and IV: $\theta=${180 - A}^\circ$ and $${360 - A}^\circ$. Sum $=${answer}^\circ$.</p>` };
  }, (p) => {
    let s = 0; const val = { 30: [0.5, 1 / sqrt(3)], 45: [1 / sqrt(2), 1], 60: [sqrt(3) / 2, sqrt(3)] }[p.A];
    for (let d = 0; d < 360; d++) {
      const t = rad(d); const v = p.sgn * (p.kind === 'tan' ? val[1] : val[0]);
      const got = p.kind === 'sin' ? sin(t) : p.kind === 'cos' ? cos(t) : (d === 90 || d === 270 ? NaN : tan(t));
      if (abs(got - v) < 1e-9) s += d;
    }
    return s;
  }),

  gen('te-g04', 2, 'nat', 'numeric', 'sine rule', (rng) => {
    const v = int(rng, 0, 2), A = choose(rng, [30, 45, 60]); let B; do { B = choose(rng, [45, 60, 75, 90]); } while (B === A);
    const a = int(rng, 3, 12), C = 180 - A - B, s_ = (d) => sin(rad(d));
    if (v === 0) {
      const answer = r2((a * s_(B)) / s_(A));
      return { v, A, B, a, answer, tol: 0.01, q: R`In triangle $ABC$, $a=${a}$, $A=${A}^\circ$ and $B=${B}^\circ$. Find the side $b$.${TWOD}`,
        sol: R`<p>Sine rule: $\dfrac b{\sin B}=\dfrac a{\sin A}$. $b=\dfrac{${a}\sin${B}^\circ}{\sin${A}^\circ}=\dfrac{${a}\times${r4(s_(B))}}{${r4(s_(A))}}\approx${answer}$.</p>` };
    }
    if (v === 1) {
      const answer = r2(a / (2 * s_(A)));
      return { v, A, B, a, answer, tol: 0.01, q: R`In triangle $ABC$, $a=${a}$ and $A=${A}^\circ$. Find the circumradius $R$.${TWOD}`,
        sol: R`<p>$2R=\dfrac a{\sin A}=\dfrac{${a}}{${r4(s_(A))}}$, so $R=\dfrac{${a}}{2\times${r4(s_(A))}}\approx${answer}$.</p>` };
    }
    const answer = r2((a * s_(C)) / s_(A));
    return { v, A, B, a, answer, tol: 0.01, q: R`In triangle $ABC$, $a=${a}$, $A=${A}^\circ$ and $B=${B}^\circ$. Find the side $c$.${TWOD}`,
      sol: R`<p>First $C=180^\circ-${A}^\circ-${B}^\circ=${C}^\circ$. Then $c=\dfrac{a\sin C}{\sin A}=\dfrac{${a}\sin${C}^\circ}{\sin${A}^\circ}\approx${answer}$.</p>` };
  }, (p) => {
    const C = 180 - p.A - p.B, s = (d) => sin(rad(d));
    const delta = (p.a * p.a * s(p.B) * s(C)) / (2 * s(p.A)); // area from one side and the angles
    const b = (2 * delta) / (p.a * s(C)), c = (2 * delta) / (p.a * s(p.B));
    return p.v === 0 ? b : p.v === 1 ? (p.a * b * c) / (4 * delta) : c;
  }),

  gen('te-g05', 2, 'nat', 'numeric', 'area, inradius and circumradius', (rng) => {
    const [a, b, c] = choose(rng, HER); const k = choose(rng, [1, 1, 2]);
    const A = a * k, B = b * k, C = c * k, s = (A + B + C) / 2, D_ = heron(A, B, C), v = int(rng, 0, 2);
    const head = R`<p>$s=\dfrac{${A}+${B}+${C}}2=${s}$, $\Delta=\sqrt{${s}\cdot${s - A}\cdot${s - B}\cdot${s - C}}=${r2(D_)}$.</p>`;
    if (v === 0) return { v, A, B, C, answer: r2(D_), tol: 0.01, q: R`Find the area of the triangle with sides $${A}$, $${B}$, $${C}$.${TWOD}`, sol: R`${head}<p>Area $=${r2(D_)}$.</p>` };
    if (v === 1) return { v, A, B, C, answer: r2(D_ / s), tol: 0.01, q: R`Find the inradius of the triangle with sides $${A}$, $${B}$, $${C}$.${TWOD}`, sol: R`${head}<p>$r=\dfrac\Delta s=\dfrac{${r2(D_)}}{${s}}\approx${r2(D_ / s)}$.</p>` };
    return { v, A, B, C, answer: r2((A * B * C) / (4 * D_)), tol: 0.01, q: R`Find the circumradius of the triangle with sides $${A}$, $${B}$, $${C}$.${TWOD}`, sol: R`${head}<p>$R=\dfrac{abc}{4\Delta}=\dfrac{${A * B * C}}{${r2(4 * D_)}}\approx${r2((A * B * C) / (4 * D_))}$.</p>` };
  }, (p) => { const D2 = coordArea(p.A, p.B, p.C), s = (p.A + p.B + p.C) / 2; return p.v === 0 ? D2 : p.v === 1 ? D2 / s : (p.A * p.B * p.C) / (4 * D2); }),

  gen('te-g06', 2, 'mcq', 'single', 'cosine rule', (rng) => {
    const T = choose(rng, [[4, 5, 6], [5, 6, 7], [6, 7, 8], [7, 8, 9], [3, 5, 7], [5, 7, 8], [4, 6, 9], [5, 6, 10], [6, 9, 11], [7, 9, 12]]);
    const w = int(rng, 0, 2); const [a, b, c] = w === 0 ? [T[0], T[1], T[2]] : w === 1 ? [T[1], T[0], T[2]] : [T[2], T[0], T[1]];
    const num = b * b + c * c - a * a, den = 2 * b * c;
    const right = `$${frac(num, den)}$`;
    const wrongs = [`$${frac(a * a + b * b - c * c, 2 * a * b)}$`, `$${frac(-num, den)}$`, `$${frac(num, b * c)}$`, `$${frac(a * a + c * c - b * b, 2 * a * c)}$`];
    const { options, answer } = shuffleOpts(rng, right, wrongs);
    return { a, b, c, options, answer,
      q: R`Two sides of a triangle are $${b}$ and $${c}$ and the third side is $${a}$. The cosine of the angle opposite the side $${a}$ is`,
      sol: R`<p>Cosine rule: $\cos\theta=\dfrac{${b}^2+${c}^2-${a}^2}{2\cdot${b}\cdot${c}}=\dfrac{${num}}{${den}}=${frac(num, den)}$.</p>` };
  }, (p) => { const t = vecCos(p.a, p.b, p.c); const txt = p.options[p.answer]; const m = /\\dfrac\{(\d+)\}\{(\d+)\}/.exec(txt); const val = m ? (txt.includes('-') ? -1 : 1) * m[1] / m[2] : Number(txt.replace(/\$/g, '')); return abs(val - t) < 1e-9 ? p.answer : -1; }),

  gen('te-g07', 3, 'nat', 'numeric', 'heights and distances', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) {
      const T1 = choose(rng, [30, 45]), T2 = 60, d = pick(rng, 20, 100, 10);
      const h = d / (1 / tan(rad(T1)) - 1 / tan(rad(T2))), answer = r2(h);
      return { v, T1, T2, d, answer, tol: 0.01,
        q: R`From a point on level ground the angle of elevation of the top of a tower is $${T1}^\circ$. After walking $${d}$ m straight towards the tower it becomes $${T2}^\circ$. Find the height of the tower in metres.${TWOD}`,
        sol: R`<p>With height $h$, the two distances from the foot are $h\cot${T1}^\circ$ and $h\cot${T2}^\circ$, and their difference is $${d}$. So $h=\dfrac{${d}}{\cot${T1}^\circ-\cot${T2}^\circ}=\dfrac{${d}}{${r4(1 / tan(rad(T1)))}-${r4(1 / tan(rad(T2)))}}\approx${answer}$ m.</p>` };
    }
    if (v === 1) {
      const [al, be] = choose(rng, [[30, 45], [45, 60], [30, 60]]), f = int(rng, 3, 12);
      const h = (f * tan(rad(al))) / (tan(rad(be)) - tan(rad(al))), answer = r2(h);
      return { v, al, be, f, answer, tol: 0.01,
        q: R`A flagstaff $${f}$ m long stands on top of a tower. From a point on the ground the angles of elevation of the bottom and the top of the flagstaff are $${al}^\circ$ and $${be}^\circ$. Find the height of the tower in metres.${TWOD}`,
        sol: R`<p>Let the tower be $h$ and the ground distance $d$. $\tan${al}^\circ=\dfrac hd$ and $\tan${be}^\circ=\dfrac{h+${f}}d$. Dividing, $\dfrac{h+${f}}h=\dfrac{\tan${be}^\circ}{\tan${al}^\circ}$, so $h=\dfrac{${f}\tan${al}^\circ}{\tan${be}^\circ-\tan${al}^\circ}\approx${answer}$ m.</p>` };
    }
    const [tt, tb] = choose(rng, [[30, 60], [45, 60], [30, 45]]), H = choose(rng, [30, 45, 60, 90]);
    const dd = H / tan(rad(tb)), h = H - dd * tan(rad(tt)), answer = r2(h);
    return { v, tt, tb, H, answer, tol: 0.01,
      q: R`From the top of a $${H}$ m building the angles of depression of the top and the bottom of a tower are $${tt}^\circ$ and $${tb}^\circ$. Find the height of the tower in metres.${TWOD}`,
      sol: R`<p>The tower's foot is at horizontal distance $d=\dfrac{${H}}{\tan${tb}^\circ}=${r2(dd)}$ m. Its top is $d\tan${tt}^\circ=${r2(dd * tan(rad(tt)))}$ m below the roof, so the tower is $${H}-${r2(dd * tan(rad(tt)))}\approx${answer}$ m high.</p>` };
  }, (p) => {
    if (p.v === 0) { const x = p.d / (tan(rad(p.T2)) / tan(rad(p.T1)) - 1); return x * tan(rad(p.T2)); }
    if (p.v === 1) { const d = p.f / (tan(rad(p.be)) - tan(rad(p.al))); return d * tan(rad(p.al)); }
    const d = p.H / tan(rad(p.tb)); const h = p.H - d * tan(rad(p.tt)); return abs(atan((p.H - h) / d) - rad(p.tt)) < 1e-9 ? h : NaN;
  }),

  gen('te-g08', 3, 'nat', 'integer', 'number of solutions', (rng) => {
    const [a, b, Rr] = choose(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [4, 3, 5]]);
    const kind = int(rng, 0, 2); let c;
    if (kind === 0) c = int(rng, -(Rr - 1), Rr - 1); else if (kind === 1) c = choose(rng, [Rr, -Rr]); else c = choose(rng, [1, -1]) * (Rr + int(rng, 1, 3));
    const answer = kind === 0 ? 2 : kind === 1 ? 1 : 0;
    const E = `${a}\\sin x+${b}\\cos x=${c}`;
    return { a, b, c, Rr, answer, tol: 0,
      q: R`How many solutions does $${E}$ have in $[0,2\pi)$?`,
      sol: R`<p>$${a}\sin x+${b}\cos x=${Rr}\sin(x+\varphi)$ because $\sqrt{${a}^2+${b}^2}=${Rr}$. So we need $\sin(x+\varphi)=\dfrac{${c}}{${Rr}}$. ${kind === 0 ? R`The value lies strictly between $-1$ and $1$, so there are $2$ solutions in one full turn.` : kind === 1 ? R`The value is exactly $\pm1$, which sine takes once per turn: $1$ solution.` : R`The value is outside $[-1,1]$: no solution.`} Answer: $${answer}$.</p>` };
  }, (p) => {
    const f = (x) => p.a * sin(x) + p.b * cos(x) - p.c; let mx = -Infinity, mn = Infinity;
    for (let i = 0; i <= 100000; i++) { const v = f((2 * PI_ * i) / 100000); mx = Math.max(mx, v); mn = Math.min(mn, v); }
    if (mx < -1e-6 || mn > 1e-6) return 0;
    if (abs(mx) < 1e-6 || abs(mn) < 1e-6) return 1;
    return zeros(f, 0, 2 * PI_);
  }),

  gen('te-g09', 2, 'nat', 'integer', 'maximum and minimum', (rng) => {
    const a = int(rng, 1, 9), b = int(rng, 1, 9), v = int(rng, 0, 1), d = int(rng, -4, 4);
    const Rr = sqrt(a * a + b * b);
    if (v === 0) { const answer = 2 * Math.floor(Rr + 1e-9) + 1;
      return { a, b, v, d: 0, answer, tol: 0, q: R`For how many integer values of $k$ does $${a}\sin x+${b}\cos x=k$ have a solution?`,
        sol: R`<p>The range of $${a}\sin x+${b}\cos x$ is $[-\sqrt{${a * a + b * b}},\sqrt{${a * a + b * b}}]\approx[-${r2(Rr)},${r2(Rr)}]$. The integers in it are $-${Math.floor(Rr + 1e-9)},\dots,${Math.floor(Rr + 1e-9)}$: $${answer}$ values.</p>` }; }
    const lo = Math.ceil(d - Rr - 1e-9), hi = Math.floor(d + Rr + 1e-9), answer = hi - lo + 1;
    return { a, b, v, d, answer, tol: 0, q: R`How many integers lie in the range of $${a}\sin x+${b}\cos x${d < 0 ? d : `+${d}`}$?`,
      sol: R`<p>The expression $${a}\sin x+${b}\cos x$ ranges over $[-${r2(Rr)},${r2(Rr)}]$. Adding $${d}$ shifts this to $[${r2(d - Rr)},${r2(d + Rr)}]$. The integers from $${lo}$ to $${hi}$ lie in it: $${answer}$ integers.</p>` };
  }, (p) => {
    let mx = -Infinity, mn = Infinity;
    for (let i = 0; i <= 200000; i++) { const x = (2 * PI_ * i) / 200000, v = p.a * sin(x) + p.b * cos(x) + p.d; mx = Math.max(mx, v); mn = Math.min(mn, v); }
    let c = 0; for (let k = Math.floor(mn) - 1; k <= Math.ceil(mx) + 1; k++) if (k >= mn - 1e-9 && k <= mx + 1e-9) c++; return c;
  }),

  gen('te-g10', 3, 'nat', 'integer', 'number of solutions', (rng) => {
    const n = int(rng, 1, 4), m = n + int(rng, 1, 4);
    const D = m - n, S = m + n, set = new Set();
    for (let k = 0; k < D; k++) { const g_ = gcd(2 * k, D); set.add(`${(2 * k) / g_}/${D / g_}`); if (2 * k === 0) { set.delete(`0/${D / g_}`); set.add('0/1'); } }
    for (let j = 0; j < S; j++) { const g_ = gcd(2 * j + 1, S); set.add(`${(2 * j + 1) / g_}/${S / g_}`); }
    const answer = set.size, mx = m === 1 ? 'x' : `${m}x`, nx = n === 1 ? 'x' : `${n}x`;
    return { m, n, answer, tol: 0,
      q: R`How many solutions does $\sin ${mx}=\sin ${nx}$ have in $[0,2\pi)$?`,
      sol: R`<p>$\sin A=\sin B$ means $A=B+2k\pi$ or $A=\pi-B+2k\pi$. First family: $${m - n}x=2k\pi$, $x=\dfrac{2k\pi}{${D}}$, which gives $${D}$ values in $[0,2\pi)$. Second family: $${S}x=(2k+1)\pi$, $x=\dfrac{(2k+1)\pi}{${S}}$, which gives $${S}$ values. Remove the angles that appear in both lists (check them one by one): the total is $${answer}$.</p>` };
  }, (p) => {
    const D = p.m - p.n, S = p.m + p.n, xs = [];
    for (let k = 0; k < D; k++) xs.push((2 * k * PI_) / D);
    for (let j = 0; j < S; j++) xs.push(((2 * j + 1) * PI_) / S);
    const good = xs.filter((x) => abs(sin(p.m * x) - sin(p.n * x)) < 1e-9);
    return uniq(good).length === uniq(xs).length ? uniq(good).length : -1;
  }),

  (() => {
    const PI6 = PI_ / 6;
    const C = [
      { cond: R`\sin x>\dfrac12`, dom: [0, 2 * PI_], dtxt: R`[0,2\pi]`, f: (x) => sin(x) > 0.5, inside: (x) => x > PI_ / 6 && x < 5 * PI_ / 6, right: R`$\left(\dfrac\pi6,\dfrac{5\pi}6\right)$`, wrong: [R`$\left(\dfrac\pi6,\dfrac{\pi}2\right)$`, R`$\left(\dfrac{5\pi}6,\dfrac{13\pi}6\right)$`, R`$\left(\dfrac\pi3,\dfrac{2\pi}3\right)$`] },
      { cond: R`\sin x<-\dfrac12`, dom: [0, 2 * PI_], dtxt: R`[0,2\pi]`, f: (x) => sin(x) < -0.5, inside: (x) => x > 7 * PI_ / 6 && x < 11 * PI_ / 6, right: R`$\left(\dfrac{7\pi}6,\dfrac{11\pi}6\right)$`, wrong: [R`$\left(\dfrac{5\pi}6,\dfrac{7\pi}6\right)$`, R`$\left(\pi,\dfrac{3\pi}2\right)$`, R`$\left(\dfrac{4\pi}3,\dfrac{5\pi}3\right)$`] },
      { cond: R`\cos x>\dfrac12`, dom: [-PI_, PI_], dtxt: R`[-\pi,\pi]`, f: (x) => cos(x) > 0.5, inside: (x) => x > -PI_ / 3 && x < PI_ / 3, right: R`$\left(-\dfrac\pi3,\dfrac\pi3\right)$`, wrong: [R`$\left(-\dfrac\pi6,\dfrac\pi6\right)$`, R`$\left(\dfrac\pi3,\dfrac{2\pi}3\right)$`, R`$\left(-\dfrac{2\pi}3,\dfrac{2\pi}3\right)$`] },
      { cond: R`\cos x<-\dfrac1{\sqrt2}`, dom: [0, 2 * PI_], dtxt: R`[0,2\pi]`, f: (x) => cos(x) < -1 / sqrt(2), inside: (x) => x > 3 * PI_ / 4 && x < 5 * PI_ / 4, right: R`$\left(\dfrac{3\pi}4,\dfrac{5\pi}4\right)$`, wrong: [R`$\left(\dfrac{\pi}4,\dfrac{3\pi}4\right)$`, R`$\left(\dfrac{2\pi}3,\dfrac{4\pi}3\right)$`, R`$\left(\dfrac{5\pi}4,\dfrac{7\pi}4\right)$`] },
      { cond: R`\sin x\ge\dfrac{\sqrt3}2`, dom: [0, PI_], dtxt: R`[0,\pi]`, f: (x) => sin(x) >= sqrt(3) / 2 - 1e-12, inside: (x) => x >= PI_ / 3 - 1e-9 && x <= 2 * PI_ / 3 + 1e-9, right: R`$\left[\dfrac\pi3,\dfrac{2\pi}3\right]$`, wrong: [R`$\left[\dfrac\pi6,\dfrac{5\pi}6\right]$`, R`$\left[\dfrac\pi3,\dfrac{\pi}2\right]$`, R`$\left[\dfrac\pi4,\dfrac{3\pi}4\right]$`] },
      { cond: R`\cos x\le0`, dom: [0, 2 * PI_], dtxt: R`[0,2\pi]`, f: (x) => cos(x) <= 1e-12, inside: (x) => x >= PI_ / 2 - 1e-9 && x <= 3 * PI_ / 2 + 1e-9, right: R`$\left[\dfrac\pi2,\dfrac{3\pi}2\right]$`, wrong: [R`$\left[0,\dfrac\pi2\right]$`, R`$\left[\pi,2\pi\right]$`, R`$\left[\dfrac{\pi}2,\pi\right]$`] },
      { cond: R`|\sin x|<\dfrac12`, dom: [0, PI_], dtxt: R`[0,\pi]`, f: (x) => abs(sin(x)) < 0.5, inside: (x) => x < PI_ / 6 || x > 5 * PI_ / 6, right: R`$\left[0,\dfrac\pi6\right)\cup\left(\dfrac{5\pi}6,\pi\right]$`, wrong: [R`$\left(\dfrac\pi6,\dfrac{5\pi}6\right)$`, R`$\left[0,\dfrac\pi3\right)\cup\left(\dfrac{2\pi}3,\pi\right]$`, R`$\left[0,\dfrac\pi6\right)$`] },
    ];
    return gen('te-g11', 3, 'mcq', 'single', 'trigonometric inequalities', (rng) => {
      const ci = int(rng, 0, C.length - 1), c = C[ci];
      const { options, answer } = shuffleOpts(rng, c.right, c.wrong);
      return { ci, options, answer,
        q: R`For $x\in${c.dtxt}$, the solution set of $${c.cond}$ is`,
        sol: R`<p>Draw the graph over ${'$' + c.dtxt + '$'}. Find where the curve meets the level given in the inequality, then read off the part of the curve on the correct side of that level. Here the solution set is ${c.right}.</p>` };
    }, (p) => { const c = C[p.ci]; for (let i = 1; i < 4000; i++) { const x = c.dom[0] + ((c.dom[1] - c.dom[0]) * (i + 0.37)) / 4000; if (c.f(x) !== c.inside(x)) return -1; } return p.answer; });
  })(),

  gen('te-g12', 2, 'nat', 'integer', 'projection formula', (rng) => {
    const [a, b, c] = choose(rng, HER), k = choose(rng, [1, 2, 3]); const A = a * k, B = b * k, C = c * k;
    const w = int(rng, 0, 2);
    const forms = [
      { expr: R`b\cos C+c\cos B`, ans: A, name: 'a' },
      { expr: R`c\cos A+a\cos C`, ans: B, name: 'b' },
      { expr: R`a\cos B+b\cos A`, ans: C, name: 'c' },
    ][w];
    return { A, B, C, w, answer: forms.ans, tol: 0,
      q: R`In a triangle $a=${A}$, $b=${B}$, $c=${C}$. Find the value of $${forms.expr}$.`,
      sol: R`<p>The projection formula says $${forms.expr}=${forms.name}$ (the two projections on a side add up to that side). So the value is $${forms.ans}$ with no need to find any angle.</p>` };
  }, (p) => {
    const cosA = vecCos(p.A, p.B, p.C), cosB = vecCos(p.B, p.A, p.C), cosC = vecCos(p.C, p.A, p.B);
    return Math.round([p.B * cosC + p.C * cosB, p.C * cosA + p.A * cosC, p.A * cosB + p.B * cosA][p.w] * 1e6) / 1e6;
  }),

  gen('te-g13', 3, 'nat', 'numeric', 'half-angle formulae', (rng) => {
    const [a, b, c] = choose(rng, HER); const w = int(rng, 0, 2), fnk = int(rng, 0, 2);
    const sides = [a, b, c]; const opp = sides[w], o1 = sides[(w + 1) % 3], o2 = sides[(w + 2) % 3];
    const s = (a + b + c) / 2, nm = ['A', 'B', 'C'][w], sm = ['a', 'b', 'c'][w];
    const tn = sqrt(((s - o1) * (s - o2)) / (s * (s - opp))), sn = sqrt(((s - o1) * (s - o2)) / (o1 * o2)), cs = sqrt((s * (s - opp)) / (o1 * o2));
    const answer = r2([tn, sn, cs][fnk]), fname = ['\\tan', '\\sin', '\\cos'][fnk];
    return { a, b, c, w, fnk, answer, tol: 0.01,
      q: R`In a triangle $a=${a}$, $b=${b}$, $c=${c}$. Find $${fname}\dfrac{${nm}}2$.${TWOD}`,
      sol: R`<p>$s=${s}$. The half-angle formulas are $\sin\dfrac{${nm}}2=\sqrt{\dfrac{(s-\text{other})(s-\text{other})}{\text{product of the two sides at }${nm}}}$ and $\cos\dfrac{${nm}}2=\sqrt{\dfrac{s(s-${sm})}{\text{same product}}}$. Here $s-${sm}=${s - opp}$, the other two differences are $${s - o1}$ and $${s - o2}$, and the sides at ${nm} are $${o1}$ and $${o2}$. So $\sin\dfrac{${nm}}2=${r2(sn)}$, $\cos\dfrac{${nm}}2=${r2(cs)}$, $\tan\dfrac{${nm}}2=${r2(tn)}$. Asked: ${fname === '\\tan' ? 'tan' : fname === '\\sin' ? 'sin' : 'cos'}, so $${answer}$.</p>` };
  }, (p) => {
    const sides = [p.a, p.b, p.c], opp = sides[p.w], o1 = sides[(p.w + 1) % 3], o2 = sides[(p.w + 2) % 3];
    const th = acos(vecCos(opp, o1, o2)) / 2; return [tan(th), sin(th), cos(th)][p.fnk];
  }),

  gen('te-g14', 4, 'nat', 'numeric', 'inradius and exradii', (rng) => {
    const [a, b, c] = choose(rng, HER), w = int(rng, 0, 2), sides = [a, b, c];
    const s = (a + b + c) / 2, D_ = heron(a, b, c), side = sides[w], nm = ['r_1', 'r_2', 'r_3'][w], sm = ['a', 'b', 'c'][w];
    const answer = r2(D_ / (s - side));
    return { a, b, c, w, answer, tol: 0.01,
      q: R`A triangle has sides $a=${a}$, $b=${b}$, $c=${c}$. Find the exradius $${nm}$, opposite the side $${sm}$.${TWOD}`,
      sol: R`<p>$s=${s}$, $\Delta=\sqrt{${s}\cdot${s - a}\cdot${s - b}\cdot${s - c}}=${r2(D_)}$. $${nm}=\dfrac\Delta{s-${sm}}=\dfrac{${r2(D_)}}{${s - side}}\approx${answer}$.</p>` };
  }, (p) => {
    const sides = [p.a, p.b, p.c]; const ang = (i) => acos(vecCos(sides[i], sides[(i + 1) % 3], sides[(i + 2) % 3]));
    const Rr = (p.a * p.b * p.c) / (4 * coordArea(p.a, p.b, p.c)); const w = p.w;
    return 4 * Rr * sin(ang(w) / 2) * cos(ang((w + 1) % 3) / 2) * cos(ang((w + 2) % 3) / 2);
  }),

  gen('te-g15', 4, 'nat', 'integer', 'solving triangles', (rng) => {
    const kind = int(rng, 0, 3);
    let A, b, a;
    if (kind === 0) { A = 30; b = 2 * int(rng, 4, 10); a = b / 2; }
    else if (kind === 1) { A = choose(rng, [30, 45, 60]); b = int(rng, 12, 24); const lo = Math.ceil(b * sin(rad(A)) + 0.3), hi = Math.floor(b - 0.3); a = int(rng, lo, hi); }
    else if (kind === 2) { A = choose(rng, [30, 45, 60]); b = int(rng, 6, 15); a = b + int(rng, 0, 4); }
    else { A = choose(rng, [120, 135, 150]); b = int(rng, 6, 15); a = int(rng, 2, b + 4); if (a === b) a++; }
    const sA = b * sin(rad(A));
    let answer;
    if (A < 90) answer = abs(a - sA) < 1e-9 ? 1 : a < sA ? 0 : a < b ? 2 : 1; else answer = a > b ? 1 : 0;
    const why = A < 90 ? R`The height from $C$ to the line $AB$ is $b\sin A=${r2(sA)}$. ${abs(a - sA) < 1e-9 ? R`Since $a$ equals it, the side just touches: one right-angled triangle.` : a < sA ? R`Since $a<b\sin A$, side $a$ cannot reach: no triangle.` : a < b ? R`Since $b\sin A<a<b$, side $a$ can swing to two positions: two triangles.` : R`Since $a\ge b$, only one position gives a triangle.`}`
      : R`$A$ is obtuse, so $a$ must be the longest side. ${a > b ? R`Here $a>b$: exactly one triangle.` : R`Here $a\le b$: no triangle.`}`;
    return { A, a, b, answer, tol: 0,
      q: R`In a triangle $A=${A}^\circ$, $b=${b}$ and $a=${a}$. How many different triangles are possible?`,
      sol: R`<p>${why} Answer: $${answer}$.</p>` };
  }, (p) => {
    const cA = cos(rad(p.A)); const B_ = -2 * p.b * cA, C_ = p.b * p.b - p.a * p.a; const disc = B_ * B_ - 4 * C_;
    if (disc < -1e-9) return 0; const sq = abs(disc) < 1e-9 ? 0 : sqrt(disc);
    const roots = [(-B_ + sq) / 2, (-B_ - sq) / 2].filter((r) => r > 1e-9); return uniq(roots).length;
  }),

  gen('te-g16', 4, 'nat', 'numeric', 'solving triangles', (rng) => {
    const A = choose(rng, [30, 45, 60]), b = int(rng, 12, 24); const lo = Math.ceil(b * sin(rad(A)) + 0.3), hi = Math.floor(b - 0.3);
    const a = int(rng, lo, Math.max(lo, hi)); const v = int(rng, 0, 1);
    const sum = 2 * b * cos(rad(A)), prod = b * b - a * a;
    const answer = v === 0 ? r2(sum) : prod;
    return { A, a, b, v, answer, tol: 0.01,
      q: R`In a triangle $A=${A}^\circ$, $b=${b}$ and $a=${a}$, and there are two possible values of the side $c$. Find the ${v === 0 ? 'sum' : 'product'} of the two values.${TWOD}`,
      sol: R`<p>Cosine rule: $a^2=b^2+c^2-2bc\cos A$, i.e. $c^2-(2b\cos A)c+(b^2-a^2)=0$. For a quadratic the sum of roots is $2b\cos A=${r2(sum)}$ and the product is $b^2-a^2=${prod}$. Asked: the ${v === 0 ? 'sum' : 'product'}, $${answer}$.</p>` };
  }, (p) => {
    const B_ = -2 * p.b * cos(rad(p.A)), C_ = p.b * p.b - p.a * p.a, disc = B_ * B_ - 4 * C_;
    if (disc <= 0) return NaN; const r1 = (-B_ + sqrt(disc)) / 2, r2_ = (-B_ - sqrt(disc)) / 2; if (r2_ <= 0) return NaN;
    return p.v === 0 ? r1 + r2_ : r1 * r2_;
  }),

  gen('te-g17', 2, 'nat', 'numeric', 'maximum and minimum', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const [a, b, Rr] = choose(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), d = int(rng, -5, 5);
      return { v, a, b, d, answer: Rr + d, tol: 0.01, q: R`Find the maximum value of $${a}\sin x+${b}\cos x${d < 0 ? d : `+${d}`}$.`, sol: R`<p>$a\sin x+b\cos x$ has maximum $\sqrt{a^2+b^2}=\sqrt{${a * a + b * b}}=${Rr}$. Adding $${d}$ gives $${Rr + d}$.</p>` }; }
    if (v === 1) { const [a, b, Rr] = choose(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), d = int(rng, -5, 5);
      return { v, a, b, d, answer: -Rr + d, tol: 0.01, q: R`Find the minimum value of $${a}\sin x-${b}\cos x${d < 0 ? d : `+${d}`}$.`, sol: R`<p>The range of $${a}\sin x-${b}\cos x$ is $[-${Rr},${Rr}]$ (since $\sqrt{${a}^2+${b}^2}=${Rr}$). Minimum $=-${Rr}${d < 0 ? d : `+${d}`}=${-Rr + d}$.</p>` }; }
    if (v === 2) { const p_ = int(rng, 1, 9), q_ = int(rng, 1, 9);
      return { v, p_, q_, answer: Math.max(p_, q_), tol: 0.01, q: R`Find the maximum value of $${p_}\sin^2x+${q_}\cos^2x$.`, sol: R`<p>Write it as $${Math.min(p_, q_)}+${abs(p_ - q_)}\,${p_ > q_ ? R`\sin^2x` : R`\cos^2x`}$ (using $\sin^2x+\cos^2x=1$). The squared term goes up to $1$, so the maximum is $${Math.max(p_, q_)}$.</p>` }; }
    const p_ = 2 * int(rng, 1, 6);
    return { v, p_, answer: -p_ / 2, tol: 0.01, q: R`Find the minimum value of $${p_}\sin x\cos x$.`, sol: R`<p>$${p_}\sin x\cos x=${p_ / 2}\sin2x$, whose smallest value is $-${p_ / 2}$.</p>` };
  }, (p) => {
    let mx = -Infinity, mn = Infinity;
    for (let i = 0; i <= 200000; i++) { const x = (2 * PI_ * i) / 200000; let val;
      if (p.v === 0) val = p.a * sin(x) + p.b * cos(x) + p.d; else if (p.v === 1) val = p.a * sin(x) - p.b * cos(x) + p.d; else if (p.v === 2) val = p.p_ * sin(x) ** 2 + p.q_ * cos(x) ** 2; else val = p.p_ * sin(x) * cos(x);
      mx = Math.max(mx, val); mn = Math.min(mn, val); }
    return p.v === 1 || p.v === 3 ? mn : mx;
  }),

  gen('te-g18', 3, 'nat', 'integer', 'solving triangles', (rng) => {
    const T = choose(rng, [[3, 7, 8, 60, 1], [5, 7, 8, 60, 1], [7, 8, 13, 120, 2], [3, 5, 7, 120, 2], [5, 16, 19, 120, 2], [7, 15, 13, 60, 1]]);
    // T = [x, y, z, angle, index of the side opposite the angle among sorted] ; compute directly
    const sides = [T[0], T[1], T[2]]; const k = choose(rng, [1, 2, 3]); const sc = sides.map((s) => s * k);
    const [a, b, c] = sc; let w = 0; for (let i = 0; i < 3; i++) { const o = sc[i], p1 = sc[(i + 1) % 3], p2 = sc[(i + 2) % 3]; if (abs((p1 * p1 + p2 * p2 - o * o) / (2 * p1 * p2)) === 0.5) w = i; }
    const o = sc[w], p1 = sc[(w + 1) % 3], p2 = sc[(w + 2) % 3]; const ang = Math.round(deg(acos((p1 * p1 + p2 * p2 - o * o) / (2 * p1 * p2))));
    const ask = int(rng, 0, 1); const answer = ask === 0 ? ang : 180 - ang;
    return { sides: sc, w, ask, answer, tol: 0,
      q: R`In a triangle $\sin A:\sin B:\sin C=${a}:${b}:${c}$. ${ask === 0 ? R`Find the angle opposite the side proportional to $${o}$, in degrees.` : R`Find the sum of the other two angles (the ones not opposite the side proportional to $${o}$), in degrees.`}`,
      sol: R`<p>By the sine rule the sides are in the same ratio, so take $a=${a}$, $b=${b}$, $c=${c}$. For the angle $\theta$ opposite $${o}$: $\cos\theta=\dfrac{${p1}^2+${p2}^2-${o}^2}{2\cdot${p1}\cdot${p2}}=\dfrac{${p1 * p1 + p2 * p2 - o * o}}{${2 * p1 * p2}}=${(p1 * p1 + p2 * p2 - o * o) / (2 * p1 * p2)}$, so $\theta=${ang}^\circ$. ${ask === 0 ? '' : R`The other two angles add up to $180^\circ-${ang}^\circ=${180 - ang}^\circ$.`}</p>` };
  }, (p) => {
    const [a, b, c] = p.sides, o = p.sides[p.w], p1 = p.sides[(p.w + 1) % 3], p2 = p.sides[(p.w + 2) % 3];
    const th = Math.round(deg(acos(vecCos(o, p1, p2)))); return p.ask === 0 ? th : 180 - th;
  }),
];

// ---- Expansion 2026-11-22: extra questions (ids te-x001 and on). Everything above this line is unchanged.
{
const R = String.raw;
const XEX = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = false;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 0, 1, 0, 3, 1, 2];
let xn = 0, xk = 0;
const xplace = (c, w) => { const p = XPOS[xk++ % XPOS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const xb = (level, sub, extra) => ({ id: `te-x${String(++xn).padStart(3, '0')}`, level, exams: [...XEX[level], ...(XCUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
const XAOPT = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const XSOPT = ['Both Statement I and Statement II are true', 'Statement I is true and Statement II is false', 'Statement I is false and Statement II is true', 'Both Statement I and Statement II are false'];
const M = (level, sub, q, correct, wrongs, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'single', q, ...xplace(correct, wrongs), sol, trap, ...more });
const I = (level, sub, q, answer, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (level, sub, q, answer, tol, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'numeric', q: `${q} (2 decimal places)`, answer, tol, sol, trap, ...more });
const X = (level, sub, q, options, answer, sol, trap, more = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const A = (level, sub, a, r, answer, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: XAOPT, answer, sol, trap, ...more });
const S = (level, sub, s1, s2, answer, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: XSOPT, answer, sol, trap, ...more });
const SC = (level, sub, lines, correct, wrongs, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...xplace(correct, wrongs), sol, trap, ...more });
const LET = 'pqrst';
// Match the lists: map = the List II letter for A, B, C, D (e.g. 'qrps'); wrong codes are made by swaps.
const MT = (level, sub, gk, grp, map, sol, trap, q = 'Match each entry of List I with the correct entry of List II.') => {
  groups[gk] = grp;
  const code = (m) => [...m].map((c, i) => `${'ABCD'[i]}-${c}`).join(', ');
  const sw = (m, i, j) => { const a = [...m]; [a[i], a[j]] = [a[j], a[i]]; return a.join(''); };
  const cands = [sw(map, 0, 1), sw(map, 2, 3), sw(map, 0, 2), sw(map, 1, 3), sw(map, 0, 3), sw(map, 1, 2), map.slice(1) + map[0]];
  const wr = []; for (const c of cands) if (c !== map && !wr.includes(c) && wr.length < 3) wr.push(c);
  return xb(level, sub, { type: 'mcq', format: 'match', group: gk, q, ...xplace(code(map), wr.map(code)), sol, trap });
};
const PG = (gk, title, passage) => { groups[gk] = { title, passage }; };
const PI = (level, sub, group, q, answer, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (level, sub, group, q, answer, tol, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'passage', group, q: `${q} (2 decimal places)`, answer, tol, sol, trap, ...more });
const PM = (level, sub, group, q, correct, wrongs, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'passage', group, q, ...xplace(correct, wrongs), sol, trap, ...more });
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: [...XEX[level], ...(XCUET && type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, make, ...(verify ? { verify } : {}) });
const r2 = (x) => +x.toFixed(2), r4 = (x) => +x.toFixed(4);
const PIE = Math.PI, sq = Math.sqrt, sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, acos = Math.acos, atan = Math.atan;
const dg = (r) => (r * 180) / PIE, rd = (d) => (d * PIE) / 180;
// count roots of f on [a,b]: sign changes plus exact zeros on a fine grid (n multiple of 24 so that multiples of pi/12 are hit)
const cnt = (f, a, b, n = 1200000) => { let c = 0, prev = null; for (let i = 0; i <= n; i++) { const v = f(a + ((b - a) * i) / n); if (Math.abs(v) < 1e-9) { c++; prev = null; } else { if (prev !== null && prev * v < 0) c++; prev = v; } } return c; };
const heron = (a, b, c) => { const s = (a + b + c) / 2; return sq(s * (s - a) * (s - b) * (s - c)); };
// coordinates of a triangle with sides a (BC), b (CA), c (AB): B=(0,0), C=(a,0)
const tri = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a), y = sq(c * c - x * x); return { B: [0, 0], C: [a, 0], A: [x, y] }; };
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const circumcentre = ({ A, B, C }) => { const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])); const f = (P) => P[0] * P[0] + P[1] * P[1]; return [(f(A) * (B[1] - C[1]) + f(B) * (C[1] - A[1]) + f(C) * (A[1] - B[1])) / d, (f(A) * (C[0] - B[0]) + f(B) * (A[0] - C[0]) + f(C) * (B[0] - A[0])) / d]; };
const incentre = ({ A, B, C }, a, b, c) => [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)];
const foot = (P, Q, R_) => { const dx = R_[0] - Q[0], dy = R_[1] - Q[1], t = ((P[0] - Q[0]) * dx + (P[1] - Q[1]) * dy) / (dx * dx + dy * dy); return [Q[0] + t * dx, Q[1] + t * dy]; };
PG('xp1', 'The 13-14-15 triangle', R`<p>In triangle $ABC$ the sides are $BC=13$, $CA=14$ and $AB=15$.</p>`);
PG('xp2', 'A tower on level ground', R`<p>From a point $P$ on level ground, the angle of elevation of the top of a tower is $30^\circ$. After walking $50$ m straight towards the tower, to a point $Q$, the angle of elevation is $60^\circ$. Take the observer's eye level as the ground.</p>`);
const add = [
  // ---------- level 2
  M(2, 'general solution', R`The general solution of $\sin x=\dfrac12$ is`, '$x=n\\pi+(-1)^n\\dfrac\\pi6$', ['$x=2n\\pi\\pm\\dfrac\\pi6$', '$x=n\\pi\\pm\\dfrac\\pi6$', '$x=n\\pi+\\dfrac\\pi6$'], R`<p>$\sin x=\sin\dfrac\pi6\Rightarrow x=n\pi+(-1)^n\dfrac\pi6$. This covers both $\dfrac\pi6$ and $\dfrac{5\pi}6$ in each turn.</p>`, 'The cosine version has plus-or-minus; the sine version has (-1)^n.'),
  I(2, 'number of solutions', R`The number of solutions of $2\sin x=1$ in $[0,2\pi]$ is`, 2, R`<p>$\sin x=\dfrac12$ gives $x=\dfrac\pi6$ and $x=\pi-\dfrac\pi6=\dfrac{5\pi}6$. Two solutions.</p>`, 'Sine is positive in two quadrants.', { calc: () => cnt((x) => 2 * sin(x) - 1, 0, 2 * PIE) }),
  N(2, 'cosine rule', R`In a triangle $a=7$, $b=8$, $c=9$. Find angle $A$ in degrees.`, 48.19, 0.01, R`<p>$\cos A=\dfrac{b^2+c^2-a^2}{2bc}=\dfrac{64+81-49}{144}=\dfrac23$. So $A=\cos^{-1}\dfrac23\approx48.19^\circ$.</p>`, 'The side opposite A is a, which goes with the minus sign.', { calc: () => dg(acos(2 / 3)) }),
  I(2, 'area of a triangle', R`The area of a triangle with sides $9$, $10$ and $17$ is`, 36, R`<p>$s=18$. Area $=\sqrt{18\cdot9\cdot8\cdot1}=\sqrt{1296}=36$.</p>`, 'Heron: s minus each side.', { calc: () => heron(9, 10, 17) }),
  I(2, 'circumradius', R`In triangle $ABC$, $a=10$ and $A=30^\circ$. The circumradius $R$ is`, 10, R`<p>$\dfrac a{\sin A}=2R\Rightarrow2R=\dfrac{10}{1/2}=20$, so $R=10$.</p>`, 'The ratio gives 2R, not R.', { calc: () => 10 / sin(rd(30)) / 2 }),
  M(2, 'general solution', R`The general solution of $\tan x=-1$ is`, '$x=n\\pi-\\dfrac\\pi4$', ['$x=2n\\pi-\\dfrac\\pi4$', '$x=n\\pi+\\dfrac{3\\pi}4$ only for even $n$', '$x=n\\pi\\pm\\dfrac\\pi4$'], R`<p>$\tan x=\tan\left(-\dfrac\pi4\right)\Rightarrow x=n\pi-\dfrac\pi4$. The tangent repeats every $\pi$.</p>`, 'Tangent has period pi, so no 2n pi.'),
  // ---------- level 3
  I(3, 'number of solutions', R`The number of solutions of $\cos2x=\dfrac12$ in $[0,2\pi]$ is`, 4, R`<p>$2x=2n\pi\pm\dfrac\pi3$, so $x=n\pi\pm\dfrac\pi6$. In $[0,2\pi]$: $\dfrac\pi6,\dfrac{5\pi}6,\dfrac{7\pi}6,\dfrac{11\pi}6$. Four.</p>`, 'Doubling the angle doubles the count in a fixed interval.', { calc: () => cnt((x) => cos(2 * x) - 0.5, 0, 2 * PIE) }),
  I(3, 'number of solutions', R`The number of solutions of $\sin x+\cos x=1$ in $[0,2\pi]$ is`, 3, R`<p>$\sqrt2\sin\left(x+\dfrac\pi4\right)=1\Rightarrow x+\dfrac\pi4=\dfrac\pi4$ or $\dfrac{3\pi}4$ (mod $2\pi$), so $x=0$ or $\dfrac\pi2$ (mod $2\pi$). In the closed interval: $0,\dfrac\pi2,2\pi$.</p>`, 'Both end points 0 and 2 pi count.', { calc: () => cnt((x) => sin(x) + cos(x) - 1, 0, 2 * PIE) }),
  M(3, 'quadratic in a trig function', R`The general solution of $2\cos^2x-3\cos x+1=0$ is`, '$x=2n\\pi$ or $x=2n\\pi\\pm\\dfrac\\pi3$', ['$x=2n\\pi\\pm\\dfrac\\pi3$ only', '$x=n\\pi$ or $x=n\\pi\\pm\\dfrac\\pi3$', '$x=2n\\pi\\pm\\dfrac\\pi6$'], R`<p>$(2\cos x-1)(\cos x-1)=0$, so $\cos x=\dfrac12$ or $\cos x=1$. $\cos x=\dfrac12\Rightarrow x=2n\pi\pm\dfrac\pi3$; $\cos x=1\Rightarrow x=2n\pi$.</p>`, 'Do not drop the root cos x = 1.'),
  I(3, 'cosine rule', R`In a triangle, $b=8$, $c=15$ and $A=60^\circ$. The side $a$ is`, 13, R`<p>$a^2=b^2+c^2-2bc\cos A=64+225-120=169$, so $a=13$.</p>`, 'cos 60 degrees is one half, so 2bc cos A = bc.', { calc: () => sq(64 + 225 - 2 * 8 * 15 * cos(rd(60))) }),
  I(3, 'sum of solutions', R`The sum of all solutions of $\tan^2x=3$ in $[0^\circ,360^\circ]$, in degrees, is`, 720, R`<p>$\tan x=\pm\sqrt3\Rightarrow x=60^\circ,120^\circ,240^\circ,300^\circ$. Sum $=720^\circ$.</p>`, 'Square equations give both signs.', { calc: () => 60 + 120 + 240 + 300 }),
  I(3, 'area of a triangle', R`In a triangle $b=10$, $c=12$ and $A=30^\circ$. Its area is`, 30, R`<p>Area $=\dfrac12bc\sin A=\dfrac12\cdot10\cdot12\cdot\dfrac12=30$.</p>`, 'The angle must be the one between the two sides.', { calc: () => 0.5 * 10 * 12 * sin(rd(30)) }),
  N(3, 'heights and distances', R`From a point on level ground the angle of elevation of the top of a tower is $30^\circ$. After walking $20$ m towards the tower it is $45^\circ$. Find the height of the tower.`, 27.32, 0.01, R`<p>Let height $=h$. Distances from the foot: $h\cot30^\circ=h\sqrt3$ and $h\cot45^\circ=h$. The difference is $20$: $h(\sqrt3-1)=20$.</p><p>$h=\dfrac{20}{0.7321}=27.32$ m.</p>`, 'The distance walked is the difference of the two horizontal distances.', { calc: () => 20 / (1 / tan(rd(30)) - 1 / tan(rd(45))) }),
  M(3, 'identities in a triangle', R`In an equilateral triangle $ABC$, $\sin2A+\sin2B+\sin2C=$`, '$\\dfrac{3\\sqrt3}2$', ['$\\dfrac{3\\sqrt3}4$', '$3$', '$0$'], R`<p>Each angle is $60^\circ$ so $\sin120^\circ=\dfrac{\sqrt3}2$ three times: $\dfrac{3\sqrt3}2$. (Also $4\sin A\sin B\sin C=4\cdot\dfrac{3\sqrt3}8$.)</p>`, 'The angles are doubled: sin 120, not sin 60 (which would give 3 sqrt 3 / 2 as well but by luck, since sin 120 = sin 60).'),
  SC(3, 'formulae', [R`$\dfrac a{\sin A}=2R$`, R`$\cos A=\dfrac{b^2+c^2-a^2}{2bc}$`, R`$\Delta=\dfrac12ab\sin C$`, R`$\tan\dfrac A2=\dfrac r{s-a}$`, R`$a^2=b^2+c^2+2bc\cos A$`], '4', ['3', '5', '2'], R`<p>The first four are standard. The last has the wrong sign: $a^2=b^2+c^2-2bc\cos A$. So four are correct.</p>`, 'Minus, not plus, in the cosine rule.'),
  A(3, 'existence of solutions', R`The equation $\sin x+\cos x=2$ has no real solution.`, R`$\sin x+\cos x\le\sqrt2$ for every real $x$.`, 0, R`<p>$\sin x+\cos x=\sqrt2\sin\left(x+\frac\pi4\right)\le\sqrt2<2$. So A is true and R is the reason.</p>`, 'Each of sin and cos can be 1 but never together.'),
  S(3, 'sine rule', R`In every triangle the sides are proportional to the sines of the opposite angles.`, R`In a triangle right-angled at $C$, the hypotenuse $c=2R$.`, 0, R`<p>Both are true. Statement II is the sine rule with $\sin C=1$: $\dfrac c{\sin90^\circ}=2R$.</p>`, 'The hypotenuse is a diameter of the circumcircle.'),
  I(3, 'number of solutions', R`The number of solutions of $\sin3x=\sin x$ in $[0,2\pi)$ is`, 6, R`<p>$\sin3x-\sin x=2\cos2x\sin x=0$. $\sin x=0$: $x=0,\pi$ (2 values). $\cos2x=0$: $x=\dfrac\pi4,\dfrac{3\pi}4,\dfrac{5\pi}4,\dfrac{7\pi}4$ (4 values). Total $6$.</p>`, 'The two factors share no common solution here.', { calc: () => cnt((x) => sin(3 * x) - sin(x), 0, 2 * PIE - 1e-9) }),
  I(3, 'inradius and exradii', R`The inradius of the triangle with sides $9$, $12$, $15$ is`, 3, R`<p>$\Delta=\dfrac12\cdot9\cdot12=54$ (right angle). $s=18$. $r=\dfrac\Delta s=3$.</p>`, 'r equals area over semi-perimeter.', { calc: () => heron(9, 12, 15) / 18 }),
  M(3, 'solving triangles', R`In triangle $ABC$, $a=6$, $b=8$ and $A=30^\circ$. How many triangles are possible?`, 'Two', ['One', 'None', 'Infinitely many'], R`<p>$b\sin A=8\cdot\dfrac12=4<a=6<b=8$. When $b\sin A<a<b$, there are two triangles ($B$ acute or obtuse).</p>`, 'Compare a with both b sin A and b.'),
  I(3, 'solving triangles', R`The number of triangles with integer sides and perimeter $12$ is`, 3, R`<p>Sides $a\le b\le c$ with $a+b+c=12$ and $a+b>c$ (so $c\le5$). They are $(4,4,4)$, $(3,4,5)$, $(2,5,5)$. Three triangles.</p>`, '(3,3,6) is degenerate.', { calc: () => { let c = 0; for (let a = 1; a <= 12; a++) for (let b = a; b <= 12; b++) { const cc = 12 - a - b; if (cc >= b && a + b > cc) c++; } return c; } }),
  I(3, 'maximum and minimum', R`For how many integers $a$ does $\sin x+\cos x=a$ have a real solution?`, 3, R`<p>$\sin x+\cos x$ takes every value in $[-\sqrt2,\sqrt2]$. Integers in this interval: $-1,0,1$.</p>`, 'The bound is 1.414, not 2.', { calc: () => { let c = 0; for (let a = -3; a <= 3; a++) if (Math.abs(a) <= sq(2)) c++; return c; } }),
  // ---------- level 4
  N(4, 'circumradius', R`Find the circumradius of the triangle with sides $7$, $8$, $9$.`, 4.7, 0.01, R`<p>$s=12$, $\Delta=\sqrt{12\cdot5\cdot4\cdot3}=\sqrt{720}=26.83$. $R=\dfrac{abc}{4\Delta}=\dfrac{504}{107.33}=4.70$.</p>`, 'Use 4 times the area.', { calc: () => (7 * 8 * 9) / (4 * heron(7, 8, 9)) }),
  N(4, 'medians', R`Find the length of the median to the side of length $14$ in the triangle with sides $13$, $14$, $15$.`, 12.17, 0.01, R`<p>$m_b^2=\dfrac{2a^2+2c^2-b^2}4=\dfrac{2\cdot169+2\cdot225-196}{4}=\dfrac{592}4=148$. $m_b=\sqrt{148}=12.17$.</p>`, 'The median to side b uses a and c.', { calc: () => { const T = tri(14, 15, 13); /* BC=14 */ const M_ = [7, 0]; return dist(T.A, M_); } }),
  N(4, 'angle bisector', R`In a triangle right-angled at $C$ with $BC=6$ and $CA=8$, find the length of the bisector of angle $C$ (up to the hypotenuse).`, 4.85, 0.01, R`<p>Bisector length $=\dfrac{2ab\cos\frac C2}{a+b}=\dfrac{2\cdot48\cdot\cos45^\circ}{14}=\dfrac{48\sqrt2}{14}=4.85$.</p>`, 'Use cos(C/2), not cos C.', { calc: () => (2 * 6 * 8 * cos(rd(45))) / 14 }),
  I(4, 'orthocentre', R`In a triangle $ABC$ with circumradius $5$ and $A=60^\circ$, the distance from the vertex $A$ to the orthocentre $H$ is`, 5, R`<p>$AH=2R\cos A=2\cdot5\cdot\dfrac12=5$.</p>`, 'AH is 2R cos A, not R cos A.', { calc: () => 2 * 5 * cos(rd(60)) }),
  N(4, 'circumcentre and incentre', R`For the triangle with sides $13$, $14$, $15$, find the distance $OI$ between the circumcentre and the incentre.`, 1.01, 0.01, R`<p>$\Delta=84$, $s=21$, $r=4$, $R=\dfrac{13\cdot14\cdot15}{4\cdot84}=8.125$. Euler: $OI^2=R(R-2r)=8.125\times0.125=1.0156$, so $OI=1.01$.</p>`, 'Euler gives OI squared; take the root.', { calc: () => { const T = tri(14, 15, 13); return dist(circumcentre(T), incentre(T, 14, 15, 13)); } }),
  I(4, 'solving triangles', R`In a triangle the sides are in the ratio $4:5:6$. Then $\dfrac{\cos A}{\cos C}$ (with $A$ opposite the smallest side and $C$ the largest) is`, 6, R`<p>Take $a=4,b=5,c=6$. $\cos A=\dfrac{25+36-16}{60}=\dfrac34$ and $\cos C=\dfrac{16+25-36}{40}=\dfrac18$. Ratio $=\dfrac{3/4}{1/8}=6$.</p>`, 'Use the cosine rule for each angle.', { calc: () => { const a = 4, b = 5, c = 6; return ((b * b + c * c - a * a) / (2 * b * c)) / ((a * a + b * b - c * c) / (2 * a * b)); } }),
  I(4, 'number of solutions', R`The number of solutions of $\sin x+\sin2x+\sin3x=0$ in $[0,2\pi]$ is`, 7, R`<p>$\sin x+\sin3x=2\sin2x\cos x$, so the sum is $\sin2x(2\cos x+1)=0$. $\sin2x=0$: $x=0,\frac\pi2,\pi,\frac{3\pi}2,2\pi$ (5 values). $\cos x=-\frac12$: $x=\frac{2\pi}3,\frac{4\pi}3$ (2 values). Total $7$.</p>`, 'Both end points count and the two lists do not overlap.', { calc: () => cnt((x) => sin(x) + sin(2 * x) + sin(3 * x), 0, 2 * PIE) }),
  I(4, 'number of solutions', R`The number of solutions of $\cos x+\cos2x+\cos3x=0$ in $[0,2\pi]$ is`, 6, R`<p>$\cos x+\cos3x=2\cos2x\cos x$, so the sum is $\cos2x(2\cos x+1)=0$. $\cos2x=0$: $x=\frac\pi4,\frac{3\pi}4,\frac{5\pi}4,\frac{7\pi}4$ (4). $\cos x=-\frac12$: $x=\frac{2\pi}3,\frac{4\pi}3$ (2). Total $6$.</p>`, 'Pair the outer terms, not the first two.', { calc: () => cnt((x) => cos(x) + cos(2 * x) + cos(3 * x), 0, 2 * PIE) }),
  I(4, 'number of solutions', R`The number of solutions of $\tan x+\tan2x=\tan3x$ in $[0,\pi)$ is`, 3, R`<p>Since $3x=x+2x$, $\tan3x-\tan2x-\tan x=\tan x\tan2x\tan3x$. So the equation is $\tan x\tan2x\tan3x=0$, with all three tangents defined. $\tan x=0$: $x=0$. $\tan2x=0$: $x=0$ (and $\frac\pi2$, where $\tan x$ is not defined). $\tan3x=0$: $x=0,\frac\pi3,\frac{2\pi}3$. Valid: $0,\frac\pi3,\frac{2\pi}3$. Three.</p>`, 'x = pi/2 must be rejected: tan x is not defined there.', { calc: () => { let c = 0; const n = 600000; let prev = null; const f = (x) => tan(x) + tan(2 * x) - tan(3 * x); for (const x of [0, PIE / 3, (2 * PIE) / 3]) if (Math.abs(f(x)) < 1e-9) c++; return c; } }),
  N(4, 'heights and distances', R`From a point on level ground the angle of elevation of the top of a tower is $30^\circ$. After walking $50$ m towards the tower the angle of elevation becomes $60^\circ$. Find the height of the tower.`, 43.3, 0.01, R`<p>$h\cot30^\circ-h\cot60^\circ=50$, i.e. $h\left(\sqrt3-\dfrac1{\sqrt3}\right)=50$, so $h\cdot\dfrac2{\sqrt3}=50$ and $h=25\sqrt3=43.30$ m.</p>`, 'cot 30 is sqrt 3, cot 60 is 1/sqrt 3.', { calc: () => 50 / (1 / tan(rd(30)) - 1 / tan(rd(60))) }),
  I(4, 'inradius and exradii', R`The exradii of a triangle are $2$, $3$ and $6$. Its area is`, 6, R`<p>$\dfrac1r=\dfrac1{r_1}+\dfrac1{r_2}+\dfrac1{r_3}=\dfrac12+\dfrac13+\dfrac16=1$, so $r=1$. Also $\Delta=\sqrt{r\,r_1r_2r_3}=\sqrt{36}=6$. (The triangle is $3,4,5$.)</p>`, 'Use 1/r = sum of 1/exradii.', { calc: () => sq(1 * 2 * 3 * 6) }),
  I(4, 'maximum and minimum', R`The number of ordered pairs $(x,y)$ with $x,y\in[0,2\pi]$ and $\sin x+\cos y=2$ is`, 2, R`<p>Both terms are at most $1$, so each must equal $1$: $\sin x=1\Rightarrow x=\frac\pi2$; $\cos y=1\Rightarrow y=0$ or $y=2\pi$. Two pairs.</p>`, 'y = 2 pi is also a solution.', { calc: () => { let c = 0; for (const y of [0, 2 * PIE]) if (Math.abs(sin(PIE / 2) + cos(y) - 2) < 1e-9) c++; return c; } }),
  I(4, 'solving triangles', R`The sides of a triangle are $x$, $x+1$ and $x+2$ and its largest angle is twice its smallest angle. Find $x$.`, 4, R`<p>Let the smallest angle be $A$ (opposite $x$) and the largest $C=2A$ (opposite $x+2$). Sine rule: $\dfrac{x+2}{\sin2A}=\dfrac x{\sin A}\Rightarrow\cos A=\dfrac{x+2}{2x}$. Cosine rule: $\cos A=\dfrac{(x+1)^2+(x+2)^2-x^2}{2(x+1)(x+2)}$.</p><p>Equate: $(x+2)^2(x+1)=x\left(x^2+6x+5\right)$, i.e. $x^3+5x^2+8x+4=x^3+6x^2+5x$, so $x^2-3x-4=0$, $x=4$ (as $x>0$). The sides $4,5,6$ work.</p>`, 'Reject x = -1.', { calc: () => { for (let x = 1; x < 50; x++) { const a = x, b = x + 1, c = x + 2; const A = acos((b * b + c * c - a * a) / (2 * b * c)), C = acos((a * a + b * b - c * c) / (2 * a * b)); if (Math.abs(C - 2 * A) < 1e-9) return x; } } }),
  I(4, 'identities in a triangle', R`In an acute triangle $ABC$, $\tan A=1$ and $\tan B=2$. Then $\tan A\tan B\tan C$ equals`, 6, R`<p>In any triangle $\tan A+\tan B+\tan C=\tan A\tan B\tan C$. $\tan C=-\tan(A+B)=-\dfrac{1+2}{1-2}=3$. The product $=1\cdot2\cdot3=6$.</p>`, 'C = 180 - (A+B), so tan C = -tan(A+B).', { calc: () => { const C = PIE - atan(1) - atan(2); return tan(atan(1)) * tan(atan(2)) * tan(C); } }),
  N(4, 'inradius and exradii', R`In a triangle $R=8$ and $r=2$. Find $\cos A+\cos B+\cos C$.`, 1.25, 0.01, R`<p>$\cos A+\cos B+\cos C=1+\dfrac rR=1+\dfrac28=1.25$.</p>`, 'The identity is 1 + r/R.', { calc: () => 1 + 2 / 8 }),
  I(4, 'equations with parameters', R`The number of values of $x\in[0,5\pi]$ satisfying $6\cos^2x-7\cos x+2=0$ is`, 10, R`<p>$(3\cos x-2)(2\cos x-1)=0$: $\cos x=\dfrac23$ or $\dfrac12$. Each value occurs twice in $[0,2\pi]$ and twice in $[2\pi,4\pi]$. In $[4\pi,5\pi]$ only the first quarter-turn solution $4\pi+\alpha$ (with $\alpha<\pi$) lies in the interval, once for each value.</p><p>Total $=2\cdot2+2\cdot2+1\cdot2=10$.</p>`, 'In the last stretch only one of the two roots fits.', { calc: () => cnt((x) => 6 * cos(x) ** 2 - 7 * cos(x) + 2, 0, 5 * PIE, 1200000) }),
  I(4, 'number of solutions', R`The number of solutions of $\sin^4x+\cos^4x=\dfrac78$ in $[0,2\pi)$ is`, 8, R`<p>$\sin^4x+\cos^4x=1-\dfrac12\sin^22x=\dfrac78\Rightarrow\sin^22x=\dfrac14\Rightarrow\sin2x=\pm\dfrac12$. For $2x\in[0,4\pi)$: each of $\pm\frac12$ gives 4 values, so $8$ values of $x$.</p>`, 'Two turns for 2x, so double the count.', { calc: () => cnt((x) => sin(x) ** 4 + cos(x) ** 4 - 7 / 8, 0, 2 * PIE - 1e-9) }),
  N(4, 'solving triangles', R`In a triangle $a=7$, $b=3$ and $C=60^\circ$. Find the largest angle in degrees.`, 94.72, 0.02, R`<p>$c^2=49+9-2\cdot7\cdot3\cdot\frac12=37$. Tangent rule: $\tan\dfrac{A-B}2=\dfrac{a-b}{a+b}\cot\dfrac C2=0.4\times1.7321=0.6928$, so $\dfrac{A-B}2=34.72^\circ$. With $\dfrac{A+B}2=60^\circ$: $A=60+34.72=94.72^\circ$.</p><p>Check: $a^2=49>b^2+c^2=46$, so $A$ is obtuse.</p>`, 'Use the cosine rule to double check obtuse vs acute.', { calc: () => { const c = sq(37); return dg(acos((9 + 37 - 49) / (2 * 3 * c))); } }),
  N(4, 'solving triangles', R`In a triangle $a=10$, $b=12$ and $A=40^\circ$. Two triangles are possible. Find the larger possible value of $c$.`, 15.56, 0.02, R`<p>$\sin B=\dfrac{12\sin40^\circ}{10}=0.7713$, so $B=50.46^\circ$ or $129.54^\circ$. Then $C=89.54^\circ$ or $10.46^\circ$.</p><p>$c=\dfrac{a\sin C}{\sin A}$: larger value at $C=89.54^\circ$: $c=\dfrac{10\times0.99997}{0.6428}=15.56$.</p>`, 'Use both possible values of B.', { calc: () => { const a = 10, b = 12, A = rd(40); return b * cos(A) + sq(a * a - (b * sin(A)) ** 2); } }),
  N(4, 'maximum and minimum', R`In any triangle $ABC$, find the maximum value of $\sin A\sin B\sin C$.`, 0.65, 0.01, R`<p>The product is largest for the equilateral triangle (by AM-GM on the logarithms, or Jensen's inequality for the concave function $\ln\sin$ on $(0,\pi)$): $\left(\dfrac{\sqrt3}2\right)^3=\dfrac{3\sqrt3}8=0.65$.</p>`, 'The equilateral triangle gives the extreme.', { calc: () => 3 * sq(3) / 8 }),
  X(4, 'general solution', R`Which of the following give all solutions of $\sin x=\sin\alpha$?`, [R`$x=n\pi+(-1)^n\alpha$`, R`$x=2n\pi+\alpha$ or $x=2n\pi+\pi-\alpha$`, R`$x=n\pi\pm\alpha$`, R`$x=2n\pi\pm\alpha$`], [0, 1], R`<p>The first two describe exactly the same set. $x=2n\pi\pm\alpha$ is the cosine solution, and $x=n\pi\pm\alpha$ is the solution of $\sin^2x=\sin^2\alpha$ (too many).</p>`, 'Plus-or-minus alone belongs to cos x = cos alpha.'),
  X(4, 'existence of solutions', R`Which of these equations have no real solution?`, [R`$3\sin x-4\cos x=6$`, R`$\sin x+\cos x=1.4$`, R`$\sin^2x=2$`, R`$\tan x=100$`], [0, 2], R`<p>(1) The maximum of $3\sin x-4\cos x$ is $5<6$. (2) $\sqrt2=1.414>1.4$, so it has solutions. (3) $\sin^2x\le1$. (4) $\tan$ takes every real value.</p>`, 'Use the amplitude sqrt(a^2 + b^2).'),
  X(4, 'triangle inequality', R`Which of these side-length sets form a triangle?`, [R`$3,4,8$`, R`$5,5,9$`, R`$2,2,4$`, R`$6,7,12$`], [1, 3], R`<p>The sum of the two shorter sides must exceed the longest. $3+4<8$ no; $5+5>9$ yes; $2+2=4$ is degenerate (no); $6+7>12$ yes.</p>`, 'Equality gives a straight line, not a triangle.'),
  X(4, 'equations', R`Which of the following values satisfy $2\sin^2x+3\cos x=0$?`, [R`$x=\dfrac{2\pi}3$`, R`$x=\dfrac\pi3$`, R`$x=\dfrac{4\pi}3$`, R`$x=\dfrac{5\pi}3$`], [0, 2], R`<p>$2(1-\cos^2x)+3\cos x=0\Rightarrow2\cos^2x-3\cos x-2=0\Rightarrow(2\cos x+1)(\cos x-2)=0$. Only $\cos x=-\dfrac12$ is possible: $x=\dfrac{2\pi}3,\dfrac{4\pi}3$.</p>`, 'cos x = 2 is impossible.'),
  X(4, 'trigonometric inequalities', R`Which of these values of $x\in[0,2\pi]$ satisfy $\sin x>\cos x$?`, [R`$x=\dfrac\pi2$`, R`$x=\pi$`, R`$x=\dfrac{3\pi}2$`, R`$x=0$`], [0, 1], R`<p>$\sin x>\cos x\iff x\in\left(\dfrac\pi4,\dfrac{5\pi}4\right)$. $\dfrac\pi2$ and $\pi$ lie inside. At $\dfrac{3\pi}2$: $-1>0$ is false. At $0$: $0>1$ is false.</p>`, 'Check by substituting.'),
  A(4, 'solving triangles', R`In a triangle with $a=5$, $b=10$ and $A=30^\circ$, exactly one triangle exists, and it is right-angled at $B$.`, R`When $a=b\sin A$, the side $a$ just touches the base and $B=90^\circ$.`, 0, R`<p>$b\sin A=10\cdot\dfrac12=5=a$. Then $\sin B=\dfrac{b\sin A}{a}=1$, so $B=90^\circ$ and there is exactly one triangle. R states the condition.</p>`, 'The border case between 0 and 2 triangles.'),
  S(4, 'general solution', R`$\tan x=\tan y\Rightarrow x=n\pi+y$.`, R`The function $\tan$ has period $\pi$.`, 0, R`<p>Both are true. Because tan repeats every $\pi$, equal tangents mean the angles differ by a multiple of $\pi$.</p>`, 'Compare with sin: its general solution has the (-1)^n form.'),
  SC(4, 'general solution', [R`$\cos x=\cos y\Rightarrow x=2n\pi\pm y$`, R`$\tan x=\tan y\Rightarrow x=n\pi+y$`, R`$\sin x=\sin y\Rightarrow x=n\pi+y$`, R`$\sin^2x=\sin^2y\Rightarrow x=n\pi\pm y$`], '3', ['2', '4', '1'], R`<p>1, 2 and 4 are correct. For 3, $\sin x=\sin y$ also holds for $x=\pi-y$, which is not of the form $n\pi+y$ unless $\sin y=0$ or $\cos y=0$ (in general, $\pi-y\ne n\pi+y$).</p>`, 'sin has the (-1)^n pattern.'),
  // ---------- level 5
  N(5, 'orthic triangle', R`The orthic triangle is formed by the feet of the three altitudes. Find its perimeter for the triangle with sides $13$, $14$, $15$.`, 20.68, 0.02, R`<p>The orthic triangle has perimeter $\dfrac{2\Delta}R$. With $\Delta=84$ and $R=8.125$: $\dfrac{168}{8.125}=20.68$.</p>`, 'The sides of an orthic triangle are a cos A, b cos B, c cos C.', { calc: () => { const T = tri(14, 15, 13); const D1 = foot(T.A, T.B, T.C), D2 = foot(T.B, T.C, T.A), D3 = foot(T.C, T.A, T.B); return dist(D1, D2) + dist(D2, D3) + dist(D3, D1); } }),
  N(5, 'circumradius', R`In the triangle with sides $13$, $14$, $15$, find the distance of the circumcentre from the side of length $13$.`, 4.88, 0.01, R`<p>The distance from $O$ to side $a$ is $R\cos A$. $R=8.125$, $\cos A=\dfrac{14^2+15^2-13^2}{2\cdot14\cdot15}=\dfrac{252}{420}=0.6$.</p><p>Distance $=8.125\times0.6=4.875\approx4.88$.</p>`, 'The distance to side a uses cos A.', { calc: () => { const T = tri(13, 14, 15); const O = circumcentre(T); return Math.abs(O[1]); } }),
  N(5, 'circumcentre and incentre', R`A right triangle has legs $5$ and $12$. Find the distance between its circumcentre and incentre.`, 4.03, 0.01, R`<p>$R=\dfrac{13}2=6.5$ and $r=\dfrac{5+12-13}2=2$. $OI^2=R(R-2r)=6.5\times2.5=16.25$, so $OI=4.03$.</p>`, 'In a right triangle R is half the hypotenuse.', { calc: () => dist([2.5, 6], [2, 2]) }),
  N(5, 'cyclic quadrilateral', R`A cyclic quadrilateral has sides $3$, $4$, $5$ and $6$. Find its area.`, 18.97, 0.01, R`<p>Brahmagupta: with $s=\dfrac{3+4+5+6}2=9$, area $=\sqrt{(s-a)(s-b)(s-c)(s-d)}=\sqrt{6\cdot5\cdot4\cdot3}=\sqrt{360}=18.97$.</p>`, 'Valid only because the quadrilateral is cyclic.', { calc: () => sq(6 * 5 * 4 * 3) }),
  I(5, 'number of solutions', R`The number of solutions of $\sin x+\sin2x+\sin3x+\sin4x=0$ in $[0,2\pi)$ is`, 8, R`<p>Group $(\sin x+\sin4x)+(\sin2x+\sin3x)=2\sin\frac{5x}2\left[\cos\frac{3x}2+\cos\frac x2\right]=4\sin\frac{5x}2\cos x\cos\frac x2$.</p><p>$\sin\frac{5x}2=0$: $x=\frac{2k\pi}5$, $k=0,\dots,4$ (5 values). $\cos x=0$: $\frac\pi2,\frac{3\pi}2$ (2). $\cos\frac x2=0$: $x=\pi$ (1). No overlaps. Total $8$.</p>`, 'Check overlaps between the three lists.', { calc: () => cnt((x) => sin(x) + sin(2 * x) + sin(3 * x) + sin(4 * x), 0, 2 * PIE - 1e-9) }),
  I(5, 'identities in a triangle', R`In a triangle, $\sin A+\sin B+\sin C=\dfrac{s}{R}$. For a triangle with $R=6.5$ and perimeter $30$, find $\dfrac{s}{R}\times13$.`, 30, R`<p>$s=15$ and $R=6.5$, so $\dfrac sR=\dfrac{15}{6.5}$. Multiply by $13$: $\dfrac{15\cdot13}{6.5}=30$.</p>`, 'a = 2R sin A, so the sines sum to the perimeter over 2R.', { calc: () => (15 / 6.5) * 13 }),
  X(5, 'identities in a triangle', R`Which of the following hold in every triangle $ABC$?`, [R`$\sin A+\sin B+\sin C=4\cos\dfrac A2\cos\dfrac B2\cos\dfrac C2$`, R`$\cos A+\cos B+\cos C=1+4\sin\dfrac A2\sin\dfrac B2\sin\dfrac C2$`, R`$\tan\dfrac A2\tan\dfrac B2+\tan\dfrac B2\tan\dfrac C2+\tan\dfrac C2\tan\dfrac A2=1$`, R`$\sin2A+\sin2B+\sin2C=4\cos A\cos B\cos C$`], [0, 1, 2], R`<p>The first three are standard. The last is $4\sin A\sin B\sin C$; test with the equilateral triangle: $\frac{3\sqrt3}2\ne4\cdot\frac18=\frac12$.</p>`, 'Try an equilateral triangle to test an identity.'),
  X(5, 'inradius and exradii', R`For the triangle with sides $13$, $14$, $15$, which statements are true?`, [R`Area $=84$`, R`$r=4$`, R`$R=8$`, R`The exradius opposite the side $15$ is $14$`], [0, 1, 3], R`<p>$s=21$, $\Delta=84$. $r=\frac{84}{21}=4$. $R=\frac{13\cdot14\cdot15}{4\cdot84}=8.125\ne8$. $r_c=\frac{\Delta}{s-c}=\frac{84}{6}=14$.</p>`, 'R is 8.125, close to 8 but not equal.'),
  X(5, 'area of a triangle', R`Which of these formulas give the area $\Delta$ of a triangle?`, [R`$rs$`, R`$\dfrac{abc}{4R}$`, R`$r_a(s-a)$`, R`$\dfrac12(a+b+c)R$`], [0, 1, 2], R`<p>$\Delta=rs$, $\Delta=\frac{abc}{4R}$ and $\Delta=r_a(s-a)$ are standard. The fourth would be $sR$, which is larger than $rs$ (since $R\ge2r$).</p>`, 'It is the inradius that multiplies the semi-perimeter.'),
  X(5, 'number of solutions', R`For which values of $k$ does $\sin x+\cos x=k$ have exactly one solution in $[0,2\pi)$?`, [R`$k=\sqrt2$`, R`$k=1$`, R`$k=0$`, R`$k=-\sqrt2$`], [0, 3], R`<p>$\sqrt2\sin\left(x+\frac\pi4\right)=k$. For $|k|=\sqrt2$ the sine touches $\pm1$ once per turn. For $k=1$: $x=0,\frac\pi2$ (two). For $k=0$: $x=\frac{3\pi}4,\frac{7\pi}4$ (two).</p>`, 'In the open band two solutions appear.'),
  X(5, 'isosceles triangles', R`In a triangle $ABC$, which conditions imply that the triangle is isosceles?`, [R`$a\cos B=b\cos A$`, R`$a\cos A=b\cos B$`, R`$\sin A=\sin B$`, R`$\sin2A=\sin2B$`], [0, 2], R`<p>(1) $\sin A\cos B=\sin B\cos A\Rightarrow\sin(A-B)=0\Rightarrow A=B$. (2) gives $\sin2A=\sin2B$: either $A=B$ or $A+B=90^\circ$ (right-angled), not necessarily isosceles. (3) $A=B$ since $A+B<\pi$. (4) the same as (2).</p>`, 'Right-angled triangles also satisfy sin 2A = sin 2B.'),
  A(5, 'general solution', R`If $\sin x=\sin y$, then $x=y$.`, R`The sine function is not one-one on $\mathbb R$.`, 3, R`<p>A is false: $\sin\frac\pi6=\sin\frac{5\pi}6$ but $\frac\pi6\ne\frac{5\pi}6$. R is true and explains why the statement fails.</p>`, 'Equal sines allow x and pi - x.'),
  A(5, 'identities in a triangle', R`In a triangle, if $\sin^2A+\sin^2B+\sin^2C=2$ then the triangle is right-angled.`, R`In every triangle, $\sin^2A+\sin^2B+\sin^2C=2+2\cos A\cos B\cos C$.`, 0, R`<p>With the identity in R, the condition $=2$ gives $\cos A\cos B\cos C=0$, so one angle is $90^\circ$. A follows from R.</p>`, 'The cosine product vanishes when one angle is a right angle.'),
  S(5, 'general solution', R`Since $x=\dfrac\pi6$ satisfies $\sin x=\dfrac12$, the general solution is $x=2n\pi+\dfrac\pi6$.`, R`$\sin x=\sin\alpha\Rightarrow x=n\pi+(-1)^n\alpha$.`, 2, R`<p>Statement I is false: it misses $x=\dfrac{5\pi}6+2n\pi$. Statement II is the correct general rule.</p>`, 'One particular solution is not the general solution.'),
  SC(5, 'formulae', [R`$a=b\cos C+c\cos B$`, R`Sides $3$, $4$, $8$ form a triangle`, R`$\cos\dfrac{A+B}2=\sin\dfrac C2$`, R`$\tan\dfrac A2=\dfrac r{s-a}$`, R`$\Delta=\dfrac12r(a+b+c)$`], '4', ['3', '5', '2'], R`<p>1, 3, 4 and 5 are true. 2 is false since $3+4<8$. Four are correct.</p>`, 'Projection formula: a = b cos C + c cos B.'),
  // ---------- passages
  PI(3, 'area of a triangle', 'xp1', R`The area of triangle $ABC$ is`, 84, R`<p>$s=21$. $\Delta=\sqrt{21\cdot8\cdot7\cdot6}=\sqrt{7056}=84$.</p>`, 'Heron with s minus each side.', { calc: () => heron(13, 14, 15) }),
  PI(3, 'inradius and exradii', 'xp1', R`The inradius of triangle $ABC$ is`, 4, R`<p>$r=\dfrac\Delta s=\dfrac{84}{21}=4$.</p>`, 'Divide by s, not 2s.', { calc: () => heron(13, 14, 15) / 21 }),
  PN(5, 'circumcentre and incentre', 'xp1', R`The distance between the circumcentre and the incentre of triangle $ABC$ is`, 1.01, 0.01, R`<p>$R=\dfrac{13\cdot14\cdot15}{4\cdot84}=8.125$, $r=4$. $OI^2=R(R-2r)=8.125\cdot0.125=1.0156$, $OI=1.01$.</p>`, 'Euler: OI squared = R(R - 2r).', { calc: () => sq((65 / 8) * (65 / 8 - 8)) }),
  PN(4, 'heights and distances', 'xp2', R`The height of the tower is`, 43.3, 0.01, R`<p>$h\cot30^\circ-h\cot60^\circ=50\Rightarrow h\cdot\dfrac2{\sqrt3}=50\Rightarrow h=25\sqrt3=43.30$ m.</p>`, 'Write both distances in terms of h.', { calc: () => 25 * sq(3) }),
  PI(3, 'heights and distances', 'xp2', R`The distance of $P$ from the foot of the tower is (in metres)`, 75, R`<p>$h=25\sqrt3$ and $\cot30^\circ=\sqrt3$. Distance $=h\sqrt3=25\cdot3=75$ m.</p>`, 'cot 30 degrees is sqrt 3.', { calc: () => 25 * sq(3) * sq(3) }),
  PI(4, 'heights and distances', 'xp2', R`The distance from $Q$ to the top of the tower is (in metres)`, 50, R`<p>$\sin60^\circ=\dfrac h{QT}\Rightarrow QT=\dfrac{25\sqrt3}{\sqrt3/2}=50$ m. (Check: $PQ=50$ and the triangle $PQT$ is isosceles because $\angle QTP=60^\circ-30^\circ=30^\circ=\angle QPT$.)</p>`, 'The exterior angle at Q is 60 degrees.', { calc: () => (25 * sq(3)) / sin(rd(60)) }),
  // ---------- matches
  MT(3, 'general solution', 'xm1', { title: 'General solutions', passage: R`<p>Match each equation in List I with its general solution in List II ($n$ an integer).</p>`, list1: [R`A. $\sin x=0$`, R`B. $\cos x=0$`, R`C. $\sin x=1$`, R`D. $\cos x=-1$`], list2: [R`p. $(2n+1)\dfrac\pi2$`, R`q. $2n\pi+\dfrac\pi2$`, R`r. $n\pi$`, R`s. $(2n+1)\pi$`] }, 'rpqs', R`<p>A: $x=n\pi$. B: odd multiples of $\frac\pi2$. C: $2n\pi+\frac\pi2$. D: $(2n+1)\pi$.</p>`, 'sin x = 1 is only one point per turn.'),
  MT(4, 'number of solutions', 'xm2', { title: 'Solutions in [0, 2 pi]', passage: R`<p>Match each equation in List I with the number of its solutions in $[0,2\pi]$.</p>`, list1: [R`A. $\sin2x=\dfrac12$`, R`B. $2\sin x=\sqrt3$`, R`C. $\sin x=1$`, R`D. $\sin x=0$`], list2: [R`p. $1$`, R`q. $2$`, R`r. $3$`, R`s. $4$`] }, 'sqpr', R`<p>A: $2x\in[0,4\pi]$ gives 4 values. B: $\frac\pi3,\frac{2\pi}3$ (2). C: $\frac\pi2$ (1). D: $0,\pi,2\pi$ (3).</p>`, 'Closed interval: count both ends.'),
  MT(4, 'triangle quantities', 'xm3', { title: 'The 3-4-5 triangle', passage: R`<p>For the triangle with sides $3,4,5$ match each quantity in List I with its value in List II.</p>`, list1: [R`A. Area`, R`B. Inradius`, R`C. Circumradius`, R`D. Exradius opposite the side $3$`], list2: [R`p. $1$`, R`q. $2.5$`, R`r. $6$`, R`s. $2$`] }, 'rpqs', R`<p>Right angle at the vertex between $3$ and $4$. Area $=6$. $r=\frac{6}{6}=1$. $R=\frac52$. $r_a=\frac{\Delta}{s-a}=\frac6{6-3}=2$.</p>`, 'Exradius uses s minus the opposite side.'),
  MT(4, 'formulae', 'xm4', { title: 'Triangle formulae', passage: R`<p>Match each expression in List I with what it equals in List II.</p>`, list1: [R`A. $\dfrac a{\sin A}$`, R`B. $\dfrac{b^2+c^2-a^2}{2bc}$`, R`C. $\sqrt{s(s-a)(s-b)(s-c)}$`, R`D. $\dfrac\Delta s$`], list2: [R`p. $\cos A$`, R`q. $r$`, R`r. $2R$`, R`s. $\Delta$`] }, 'rpsq', R`<p>Sine rule gives $2R$; cosine rule gives $\cos A$; Heron gives $\Delta$; $r=\frac\Delta s$.</p>`, 'a over sin A is the diameter.'),
  MT(4, 'general solution', 'xm5', { title: 'Which general solution?', passage: R`<p>Match each equation in List I with its general solution in List II.</p>`, list1: [R`A. $\sin x=\sin\alpha$`, R`B. $\cos x=\cos\alpha$`, R`C. $\tan x=\tan\alpha$`, R`D. $\sin^2x=\sin^2\alpha$`], list2: [R`p. $x=n\pi+\alpha$`, R`q. $x=n\pi+(-1)^n\alpha$`, R`r. $x=2n\pi\pm\alpha$`, R`s. $x=n\pi\pm\alpha$`] }, 'qrps', R`<p>Standard results: sine has $(-1)^n$, cosine has $\pm$ with $2n\pi$, tangent has $n\pi+\alpha$, and squares of sine (or cosine, or tangent) give $n\pi\pm\alpha$.</p>`, 'sin^2 x = sin^2 alpha gives both signs with n pi.'),
  MT(5, 'solving triangles', 'xm6', { title: 'Which kind of triangle?', passage: R`<p>Match each set of sides in List I with the description of the triangle in List II.</p>`, list1: [R`A. $5,12,13$`, R`B. $7,8,9$`, R`C. $6,8,11$`, R`D. $2,3,6$`], list2: [R`p. Acute-angled`, R`q. Right-angled`, R`r. Obtuse-angled`, R`s. No such triangle`] }, 'qprs', R`<p>A: $25+144=169$ (right). B: $49+64=113>81$ (acute). C: $36+64=100<121$ (obtuse). D: $2+3<6$ (does not exist).</p>`, 'Test only the largest side against the other two.'),
  MT(3, 'heights and distances', 'xm7', { title: 'Height of a tower', passage: R`<p>A tower is seen from a point on level ground $30$ m from its foot. Match each angle of elevation in List I with the height of the tower in List II.</p>`, list1: [R`A. $45^\circ$`, R`B. $60^\circ$`, R`C. $30^\circ$`, R`D. $\tan^{-1}\dfrac12$`], list2: [R`p. $15$ m`, R`q. $10\sqrt3$ m`, R`r. $30$ m`, R`s. $30\sqrt3$ m`] }, 'rsqp', R`<p>$h=30\tan\theta$: $30$; $30\sqrt3$; $30\cdot\frac1{\sqrt3}=10\sqrt3$; $30\cdot\frac12=15$.</p>`, 'The horizontal distance is fixed at 30 m.'),
  MT(5, 'maximum and minimum', 'xm8', { title: 'Greatest values', passage: R`<p>Match each expression in List I with its greatest value in List II.</p>`, list1: [R`A. $\sin x+\cos x$`, R`B. $3\sin x+4\cos x$`, R`C. $\sin x\cos x$`, R`D. $\sin A\sin B\sin C$ in a triangle`], list2: [R`p. $\dfrac12$`, R`q. $5$`, R`r. $\sqrt2$`, R`s. $\dfrac{3\sqrt3}8$`] }, 'rqps', R`<p>A: $\sqrt{1+1}=\sqrt2$. B: $\sqrt{9+16}=5$. C: $\frac12\sin2x\le\frac12$. D: at the equilateral triangle, $\frac{3\sqrt3}8$.</p>`, 'a sin x + b cos x has amplitude sqrt(a^2 + b^2).'),
];
items.push(...add);
const xgens = [
  gen('te-gx1', 3, 'nat', 'integer', 'number of solutions', (rng) => {
    const k = int(rng, 1, 4), c = choose(rng, [[1, 2], [-1, 2], [3, 2], [-2, 2]]); const txt = c[0] === 3 ? String.raw`\dfrac{\sqrt3}2` : c[0] === -2 ? String.raw`-\dfrac{\sqrt2}2` : String.raw`${c[0] < 0 ? '-' : ''}\dfrac12`;
    const v = c[0] === 3 ? sq(3) / 2 : c[0] === -2 ? -sq(2) / 2 : c[0] / 2;
    return { k, v, answer: 2 * k, tol: 0, q: R`Find the number of solutions of $\sin ${k === 1 ? '' : k}x=${txt}$ in $[0,2\pi)$.`, sol: R`<p>$\sin t=${txt}$ has $2$ solutions in each turn of $t$. Here $t=${k === 1 ? '' : k}x$ runs through $${k}$ turns when $x\in[0,2\pi)$, so there are $2\times${k}=${2 * k}$ solutions.</p>` };
  }, (p) => cnt((x) => sin(p.k * x) - p.v, 0, 2 * PIE - 1e-9, 240000)),
  gen('te-gx2', 3, 'nat', 'numeric', 'cosine rule', (rng) => {
    const b = int(rng, 4, 15), c = int(rng, 4, 15), A = choose(rng, [60, 90, 120]);
    const a2 = b * b + c * c - 2 * b * c * cos(rd(A)), a = sq(a2);
    return { b, c, A, answer: r2(a), tol: 0.01, q: R`In triangle $ABC$, $b=${b}$, $c=${c}$ and $A=${A}^\circ$. Find $a$. (2 decimal places)`, sol: R`<p>$a^2=b^2+c^2-2bc\cos A=${b * b}+${c * c}-2\cdot${b}\cdot${c}\cdot\cos${A}^\circ=${r2(a2)}$, so $a=${r2(a)}$.</p>` };
  }, (p) => { const T = tri(1, 1, 1); const A = [p.c * 1, 0]; /* place A at origin, B on x-axis */ const B = [p.c, 0], C = [p.b * cos(rd(p.A)), p.b * sin(rd(p.A))]; return dist(B, C); }),
  gen('te-gx3', 4, 'nat', 'numeric', 'solving triangles', (rng) => {
    const A = choose(rng, [30, 40, 45]), b = int(rng, 10, 20), lo = b * sin(rd(A)), a = pick(rng, Math.ceil(lo * 10 + 3) / 10, b - 0.5, 0.5);
    const disc = a * a - (b * sin(rd(A))) ** 2, c = b * cos(rd(A)) + sq(disc);
    return { A, b, a, answer: r2(c), tol: 0.02, q: R`In triangle $ABC$, $a=${a}$, $b=${b}$ and $A=${A}^\circ$. Two triangles are possible. Find the larger value of $c$. (2 decimal places)`, sol: R`<p>$a^2=b^2+c^2-2bc\cos A\Rightarrow c^2-2(${b})\cos${A}^\circ\,c+${b * b}-${a * a}=0$, so $c=${b}\cos${A}^\circ\pm\sqrt{${a}^2-(${b}\sin${A}^\circ)^2}$. The larger value is $${r2(b * cos(rd(A)))}+${r2(sq(disc))}=${r2(c)}$.</p>` };
  }, (p) => { const sB = (p.b * sin(rd(p.A))) / p.a, B1 = asin(sB), B2 = PIE - B1; const c1 = (p.a * sin(PIE - rd(p.A) - B1)) / sin(rd(p.A)), c2 = (p.a * sin(PIE - rd(p.A) - B2)) / sin(rd(p.A)); return Math.max(c1, c2); }),
  gen('te-gx4', 4, 'nat', 'numeric', 'medians', (rng) => {
    const [a, b, c] = choose(rng, [[13, 14, 15], [7, 8, 9], [9, 10, 11], [6, 7, 8], [10, 11, 13], [5, 6, 7]]), w = int(rng, 0, 2);
    const sides = [a, b, c], x = sides[w], y = sides[(w + 1) % 3], z = sides[(w + 2) % 3];
    const m2 = (2 * y * y + 2 * z * z - x * x) / 4;
    return { sides, x, y, z, answer: r2(sq(m2)), tol: 0.01, q: R`In a triangle with sides $${a}$, $${b}$, $${c}$, find the length of the median drawn to the side of length $${x}$. (2 decimal places)`, sol: R`<p>$m^2=\dfrac{2y^2+2z^2-x^2}4=\dfrac{2\cdot${y * y}+2\cdot${z * z}-${x * x}}4=${m2}$, so $m=${r2(sq(m2))}$.</p>` };
  }, (p) => { const T = tri(p.x, p.y, p.z); return dist(T.A, [p.x / 2, 0]); }),
  gen('te-gx5', 4, 'nat', 'numeric', 'circumcentre and incentre', (rng) => {
    const [a, b, c] = choose(rng, [[13, 14, 15], [5, 12, 13], [6, 8, 10], [9, 10, 17], [7, 15, 20], [13, 20, 21], [8, 15, 17]]);
    const D = heron(a, b, c), s = (a + b + c) / 2, r = D / s, R_ = (a * b * c) / (4 * D), oi2 = R_ * (R_ - 2 * r);
    return { a, b, c, answer: r2(sq(oi2)), tol: 0.01, q: R`Find the distance between the circumcentre and the incentre of the triangle with sides $${a}$, $${b}$, $${c}$. (2 decimal places)`, sol: R`<p>$s=${s}$, $\Delta=${r4(D)}$, $r=\dfrac\Delta s=${r4(r)}$, $R=\dfrac{abc}{4\Delta}=${r4(R_)}$.</p><p>$OI^2=R(R-2r)=${r4(oi2)}$, so $OI=${r2(sq(oi2))}$.</p>` };
  }, (p) => { const T = tri(p.a, p.b, p.c); return dist(circumcentre(T), incentre(T, p.a, p.b, p.c)); }),
  gen('te-gx6', 3, 'mcq', 'single', 'general solution', (rng) => {
    const k = int(rng, 2, 4), m = choose(rng, [3, 4, 6]);
    const f = (num, den) => (den === 1 ? `${num === 1 ? '' : num}` : `\\dfrac{${num === 1 ? '' : num}}{${den}}`);
    const good = `$x=\\dfrac{n\\pi}{${k}}+\\dfrac{\\pi}{${k * m}}$`, bad1 = `$x=${f(2, k)}n\\pi+\\dfrac{\\pi}{${k * m}}$`.replace('\\dfrac{2}{' + k + '}', `\\dfrac{2}{${k}}`), bad2 = `$x=n\\pi+\\dfrac{\\pi}{${k * m}}$`, bad3 = `$x=\\dfrac{n\\pi}{${k}}\\pm\\dfrac{\\pi}{${k * m}}$`;
    const o = shuffleOpts(rng, good, [bad1, bad2, bad3]);
    return { k, m, options: o.options, answer: o.answer, q: R`The general solution of $\tan${k}x=\tan\dfrac\pi${m}$ is ($n$ an integer)`, sol: R`<p>$\tan${k}x=\tan\dfrac\pi${m}\Rightarrow${k}x=n\pi+\dfrac\pi${m}\Rightarrow x=\dfrac{n\pi}{${k}}+\dfrac\pi{${k * m}}$.</p>` };
  }, (p) => { const good = `$x=\\dfrac{n\\pi}{${p.k}}+\\dfrac{\\pi}{${p.k * p.m}}$`; let ok = true; for (let n = -3; n <= 3; n++) { const x = (n * PIE) / p.k + PIE / (p.k * p.m); if (Math.abs(tan(p.k * x) - tan(PIE / p.m)) > 1e-7) ok = false; } return ok ? p.options.indexOf(good) : -1; }),
  gen('te-gx7', 4, 'nat', 'integer', 'solving triangles', (rng) => {
    const P = int(rng, 8, 30);
    const ans = P % 2 === 0 ? Math.round((P * P) / 48) : Math.round(((P + 3) * (P + 3)) / 48);
    return { P, answer: ans, tol: 0, q: R`How many triangles with positive integer sides and perimeter $${P}$ are there (triangles that differ only in the order of the sides count as one)?`, sol: R`<p>List $a\le b\le c$ with $a+b+c=${P}$ and $a+b>c$, i.e. $c<${P / 2}$. Counting these gives $${ans}$ triangles (the count equals the nearest integer to $${P % 2 === 0 ? `\\dfrac{${P}^2}{48}` : `\\dfrac{(${P}+3)^2}{48}`}$).</p>` };
  }, (p) => { let c = 0; for (let a = 1; a <= p.P; a++) for (let b = a; b <= p.P; b++) { const cc = p.P - a - b; if (cc >= b && a + b > cc) c++; } return c; }),
  gen('te-gx8', 5, 'nat', 'numeric', 'orthic triangle', (rng) => {
    const [a, b, c] = choose(rng, [[13, 14, 15], [7, 8, 9], [8, 9, 10], [9, 10, 11], [6, 7, 8], [10, 11, 12], [11, 12, 13]]);
    const D = heron(a, b, c), R_ = (a * b * c) / (4 * D), per = (2 * D) / R_;
    return { a, b, c, answer: r2(per), tol: 0.02, q: R`The feet of the three altitudes of the triangle with sides $${a}$, $${b}$, $${c}$ form its orthic triangle. Find the perimeter of the orthic triangle. (2 decimal places)`, sol: R`<p>$\Delta=${r4(D)}$ and $R=\dfrac{abc}{4\Delta}=${r4(R_)}$. The perimeter of the orthic triangle is $\dfrac{2\Delta}R=${r2(per)}$.</p>` };
  }, (p) => { const T = tri(p.a, p.b, p.c); const D1 = foot(T.A, T.B, T.C), D2 = foot(T.B, T.C, T.A), D3 = foot(T.C, T.A, T.B); return dist(D1, D2) + dist(D2, D3) + dist(D3, D1); }),
  gen('te-gx9', 3, 'nat', 'numeric', 'heights and distances', (rng) => {
    const t1 = choose(rng, [30, 45]), t2 = choose(rng, [60, 75].filter((v) => v > t1)), d = int(rng, 10, 60);
    const h = d / (1 / tan(rd(t1)) - 1 / tan(rd(t2)));
    return { t1, t2, d, answer: r2(h), tol: 0.01, q: R`The angle of elevation of the top of a tower is $${t1}^\circ$ from a point on level ground. After walking $${d}$ m towards the tower the angle is $${t2}^\circ$. Find the height of the tower in metres. (2 decimal places)`, sol: R`<p>Horizontal distances: $h\cot${t1}^\circ$ and $h\cot${t2}^\circ$. Their difference is $${d}$, so $h=\dfrac{${d}}{\cot${t1}^\circ-\cot${t2}^\circ}=${r2(h)}$ m.</p>` };
  }, (p) => { // solve by search on h
    let lo = 0, hi = 1e4; const g = (h) => h / tan(rd(p.t1)) - h / tan(rd(p.t2)) - p.d; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; }),
  gen('te-gx10', 3, 'mcq', 'single', 'solving triangles', (rng) => {
    const [a, b, c] = choose(rng, [[5, 12, 13], [6, 8, 10], [7, 8, 9], [6, 8, 11], [5, 6, 9], [4, 5, 6], [8, 15, 17], [7, 9, 14], [9, 12, 15], [5, 7, 10]]);
    const big = Math.max(a, b, c), rest = a + b + c - big, d2 = a * a + b * b + c * c - 2 * big * big;
    const kind = rest <= big ? 'Not a triangle' : d2 === 0 ? 'Right-angled' : d2 > 0 ? 'Acute-angled' : 'Obtuse-angled';
    const o = shuffleOpts(rng, kind, ['Right-angled', 'Acute-angled', 'Obtuse-angled', 'Not a triangle'].filter((x) => x !== kind));
    return { a, b, c, options: o.options, answer: o.answer, q: R`A triangle has sides $${a}$, $${b}$ and $${c}$. It is`, sol: R`<p>The largest side is $${big}$. Other two add to $${rest}$. ${rest <= big ? R`Since $${rest}\le${big}$, no triangle exists.` : R`Compare $${big}^2=${big * big}$ with the sum of the other squares $${big === a ? b * b + c * c : big === b ? a * a + c * c : a * a + b * b}$: ${kind.toLowerCase()}.`}</p>` };
  }, (p) => { const s = [p.a, p.b, p.c].sort((x, y) => x - y); let kind; if (s[0] + s[1] <= s[2]) kind = 'Not a triangle'; else { const cc = (s[0] * s[0] + s[1] * s[1] - s[2] * s[2]) / (2 * s[0] * s[1]); kind = Math.abs(cc) < 1e-12 ? 'Right-angled' : cc > 0 ? 'Acute-angled' : 'Obtuse-angled'; } return p.options.indexOf(kind); }),
];
gens.push(...xgens);

}

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'trig-equations-triangles', groups, items, gens }, ['te-g09', 'te-g10', 'te-g17']);
