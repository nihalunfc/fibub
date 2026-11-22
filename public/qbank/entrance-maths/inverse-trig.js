// Inverse trigonometric functions (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const CUET = true; // Class 12 chapters: level 1-3 mcq also list 'cuet'
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
    title: 'Principal values',
    passage: R`<p>Match each inverse trigonometric value in List I with its principal value in List II.</p>`,
    list1: [R`A. $\sin^{-1}\left(-\dfrac12\right)$`, R`B. $\cos^{-1}\left(-\dfrac12\right)$`, R`C. $\tan^{-1}(-\sqrt3)$`, R`D. $\cot^{-1}(-1)$`],
    list2: [R`p. $\dfrac{3\pi}4$`, R`q. $-\dfrac\pi6$`, R`r. $\dfrac{2\pi}3$`, R`s. $-\dfrac\pi3$`],
  },
  m2: {
    title: 'Principal value ranges',
    passage: R`<p>Match each function in List I with its range (the set of principal values) in List II.</p>`,
    list1: [R`A. $\cos^{-1}x$`, R`B. $\tan^{-1}x$`, R`C. $\cot^{-1}x$`, R`D. $\operatorname{cosec}^{-1}x$`],
    list2: [R`p. $(0,\pi)$`, R`q. $[0,\pi]$`, R`r. $\left(-\dfrac\pi2,\dfrac\pi2\right)$`, R`s. $\left[-\dfrac\pi2,\dfrac\pi2\right]\setminus\{0\}$`],
  },
  m3: {
    title: 'Simplifying $f^{-1}(f(\\theta))$',
    passage: R`<p>Match each expression in List I with its value in List II.</p>`,
    list1: [R`A. $\sin^{-1}\left(\sin\dfrac{2\pi}3\right)$`, R`B. $\sin^{-1}\left(\sin\left(-\dfrac{3\pi}4\right)\right)$`, R`C. $\cos^{-1}\left(\cos\dfrac{5\pi}4\right)$`, R`D. $\tan^{-1}\left(\tan\dfrac{7\pi}6\right)$`],
    list2: [R`p. $\dfrac\pi6$`, R`q. $\dfrac{3\pi}4$`, R`r. $\dfrac\pi3$`, R`s. $-\dfrac\pi4$`],
  },
  m4: {
    title: 'Sums of inverse functions',
    passage: R`<p>Match each sum in List I with its value in List II.</p>`,
    list1: [R`A. $\tan^{-1}\dfrac12+\tan^{-1}\dfrac13$`, R`B. $\tan^{-1}2+\tan^{-1}3$`, R`C. $\sin^{-1}\dfrac35+\cos^{-1}\dfrac35$`, R`D. $\tan^{-1}(-2)+\tan^{-1}(-3)$`],
    list2: [R`p. $\dfrac\pi2$`, R`q. $-\dfrac{3\pi}4$`, R`r. $\dfrac\pi4$`, R`s. $\dfrac{3\pi}4$`],
  },
  p1: {
    title: 'Passage: the function $\\sin^{-1}(2x-1)$',
    passage: R`<p>Let $f(x)=\sin^{-1}(2x-1)$.</p>`,
  },
  p2: {
    title: 'Passage: a telescoping sum',
    passage: R`<p>Let $S_n=\displaystyle\sum_{r=1}^{n}\tan^{-1}\dfrac1{r^2+r+1}$. Use $\dfrac1{r^2+r+1}=\dfrac{(r+1)-r}{1+r(r+1)}$.</p>`,
  },
  p3: {
    title: 'Passage: when the product exceeds 1',
    passage: R`<p>For $x,y>0$ the formula $\tan^{-1}x+\tan^{-1}y=\tan^{-1}\dfrac{x+y}{1-xy}$ holds only when $xy<1$. If $xy>1$ the right side must be increased by $\pi$ (for $x,y>0$) because the sum is more than $\dfrac\pi2$.</p>`,
  },
  p4: {
    title: 'Passage: solving $\\tan^{-1}2x+\\tan^{-1}3x=\\dfrac\\pi4$',
    passage: R`<p>Take tangent of both sides, $\dfrac{2x+3x}{1-6x^2}=1$, which gives a quadratic in $x$. Then check each root in the original equation.</p>`,
  },
};

const items = [
  // ---------- L1 ----------
  M(1, 'principal values', R`The principal value of $\sin^{-1}\dfrac12$ is`, R`$\dfrac\pi6$`, [R`$\dfrac\pi3$`, R`$\dfrac{5\pi}6$`, R`$\dfrac\pi4$`],
    R`<p>$\sin\dfrac\pi6=\dfrac12$ and $\dfrac\pi6$ lies in $\left[-\dfrac\pi2,\dfrac\pi2\right]$. The angle $\dfrac{5\pi}6$ also has sine $\dfrac12$ but is outside the principal range.</p>`, 'The answer must lie in the principal range.'),
  M(1, 'ranges', R`The range (principal value branch) of $\cos^{-1}x$ is`, R`$[0,\pi]$`, [R`$\left[-\dfrac\pi2,\dfrac\pi2\right]$`, R`$(0,\pi)$`, R`$[-\pi,\pi]$`],
    R`<p>By convention $\cos^{-1}x\in[0,\pi]$, where cosine is one-to-one. The second option is the range of $\sin^{-1}x$; the third is the range of $\cot^{-1}x$.</p>`, ''),
  M(1, 'domains', R`The domain of $\sin^{-1}x$ is`, R`$[-1,1]$`, [R`$(-1,1)$`, R`$\mathbb R$`, R`$\left[-\dfrac\pi2,\dfrac\pi2\right]$`],
    R`<p>Sine takes only values between $-1$ and $1$ (both included), so $\sin^{-1}x$ is defined exactly for $x\in[-1,1]$.</p>`, 'The end points $\\pm1$ are included.'),
  I(1, 'values', R`Find $5\sin\left(\sin^{-1}\dfrac35\right)$.`, 3,
    R`<p>$\sin(\sin^{-1}x)=x$ for $x\in[-1,1]$. So $5\cdot\dfrac35=3$.</p>`, '', { calc: () => 5 * sin(asin(3 / 5)) }),
  M(1, 'principal values', R`The principal value of $\tan^{-1}1$ is`, R`$\dfrac\pi4$`, [R`$\dfrac\pi3$`, R`$\dfrac{5\pi}4$`, R`$1$`],
    R`<p>$\tan\dfrac\pi4=1$ and $\dfrac\pi4\in\left(-\dfrac\pi2,\dfrac\pi2\right)$.</p>`, 'The answer is an angle, not the number $1$.'),
  M(1, 'properties', R`For $x\in[-1,1]$, $\sin^{-1}x+\cos^{-1}x$ equals`, R`$\dfrac\pi2$`, [R`$\pi$`, R`$0$`, R`$x$`],
    R`<p>If $\theta=\sin^{-1}x$ then $x=\sin\theta=\cos\left(\dfrac\pi2-\theta\right)$, so $\cos^{-1}x=\dfrac\pi2-\theta$ (the angle $\dfrac\pi2-\theta$ is in $[0,\pi]$). The sum is $\dfrac\pi2$.</p>`, ''),
  M(1, 'properties', R`For $x\in[-1,1]$, $\cos^{-1}(-x)$ equals`, R`$\pi-\cos^{-1}x$`, [R`$-\cos^{-1}x$`, R`$\cos^{-1}x$`, R`$\dfrac\pi2-\cos^{-1}x$`],
    R`<p>Cosine reflects across $\pi/2$: $\cos(\pi-\theta)=-\cos\theta$. Since $\pi-\cos^{-1}x\in[0,\pi]$, we get $\cos^{-1}(-x)=\pi-\cos^{-1}x$.</p>`, 'Cosine inverse is not odd, unlike sine inverse.'),
  I(1, 'principal values', R`The principal value of $\sin^{-1}\dfrac{\sqrt3}2$, in degrees, is`, 60,
    R`<p>$\sin60^\circ=\dfrac{\sqrt3}2$, and $60^\circ$ lies in $[-90^\circ,90^\circ]$.</p>`, '', { calc: () => Math.round(deg(asin(sqrt(3) / 2))) }),
  M(1, 'ranges', R`The range of $\tan^{-1}x$ is`, R`$\left(-\dfrac\pi2,\dfrac\pi2\right)$`, [R`$\left[-\dfrac\pi2,\dfrac\pi2\right]$`, R`$(0,\pi)$`, R`$\mathbb R$`],
    R`<p>Tangent is one-to-one on $\left(-\dfrac\pi2,\dfrac\pi2\right)$ and takes every real value there. The end points are not included, since $\tan\left(\pm\dfrac\pi2\right)$ is not defined.</p>`, 'Open interval, not closed.'),
  M(1, 'properties', R`For every real $x$, $\tan^{-1}x+\cot^{-1}x$ equals`, R`$\dfrac\pi2$`, [R`$\pi$`, R`$0$`, R`$\dfrac\pi4$`],
    R`<p>With the principal ranges $\tan^{-1}x\in\left(-\dfrac\pi2,\dfrac\pi2\right)$ and $\cot^{-1}x\in(0,\pi)$, we have $\cot^{-1}x=\dfrac\pi2-\tan^{-1}x$ for every real $x$.</p>`, 'This one holds for all real $x$.'),
  I(1, 'principal values', R`The principal value of $\cos^{-1}0$, in degrees, is`, 90,
    R`<p>$\cos90^\circ=0$ and $90^\circ\in[0^\circ,180^\circ]$.</p>`, ''),
  M(1, 'principal values', R`$\sin^{-1}(-1)$ equals`, R`$-\dfrac\pi2$`, [R`$\dfrac{3\pi}2$`, R`$\dfrac\pi2$`, R`$-\pi$`],
    R`<p>$\sin\left(-\dfrac\pi2\right)=-1$ and $-\dfrac\pi2$ is in the principal range.</p>`, '$\\dfrac{3\\pi}2$ also has sine $-1$ but is out of range.'),
  M(1, 'domains', R`$\sec^{-1}x$ is defined for`, R`$|x|\ge1$`, [R`$|x|\le1$`, R`all real $x$`, R`$x>0$`],
    R`<p>$\sec\theta=\dfrac1{\cos\theta}$ has $|\sec\theta|\ge1$, so $\sec^{-1}x$ needs $|x|\ge1$, i.e. $x\le-1$ or $x\ge1$.</p>`, ''),
  I(1, 'principal values', R`The principal value of $\tan^{-1}\sqrt3$, in degrees, is`, 60,
    R`<p>$\tan60^\circ=\sqrt3$.</p>`, ''),
  M(1, 'properties', R`For $x\in[-1,1]$, $\sin^{-1}(-x)$ equals`, R`$-\sin^{-1}x$`, [R`$\pi-\sin^{-1}x$`, R`$\sin^{-1}x$`, R`$\dfrac\pi2-\sin^{-1}x$`],
    R`<p>Sine is an odd function and its principal range $\left[-\dfrac\pi2,\dfrac\pi2\right]$ is symmetric, so $\sin^{-1}$ is odd: $\sin^{-1}(-x)=-\sin^{-1}x$.</p>`, 'Sine inverse is odd; cosine inverse is not.'),
  I(1, 'values', R`Find $10\cos\left(\cos^{-1}0.8\right)$.`, 8,
    R`<p>$\cos(\cos^{-1}x)=x$ for $x\in[-1,1]$, so the value is $10\times0.8=8$.</p>`, '', { calc: () => 10 * cos(acos(0.8)) }),

  // ---------- L2 ----------
  M(2, 'principal values', R`The principal value of $\cos^{-1}\left(-\dfrac12\right)$ is`, R`$\dfrac{2\pi}3$`, [R`$-\dfrac\pi3$`, R`$\dfrac\pi3$`, R`$\dfrac{4\pi}3$`],
    R`<p>$\cos^{-1}(-x)=\pi-\cos^{-1}x$. So $\pi-\dfrac\pi3=\dfrac{2\pi}3$, which lies in $[0,\pi]$.</p>`, 'The principal range of $\\cos^{-1}$ has no negative angles.'),
  M(2, 'simplification', R`$\sin^{-1}\left(\sin\dfrac{2\pi}3\right)$ equals`, R`$\dfrac\pi3$`, [R`$\dfrac{2\pi}3$`, R`$-\dfrac\pi3$`, R`$\dfrac\pi6$`],
    R`<p>$\sin\dfrac{2\pi}3=\sin\left(\pi-\dfrac{2\pi}3\right)=\sin\dfrac\pi3$, and $\dfrac\pi3\in\left[-\dfrac\pi2,\dfrac\pi2\right]$. So the value is $\dfrac\pi3$.</p>`, '$\\sin^{-1}(\\sin x)=x$ only for $x$ in the principal range.'),
  I(2, 'sums', R`Find $\tan^{-1}1+\tan^{-1}2+\tan^{-1}3$ in degrees.`, 180,
    R`<p>$\tan^{-1}2+\tan^{-1}3$: here $2\cdot3=6>1$, so the sum is $\pi+\tan^{-1}\dfrac{5}{1-6}=\pi+\tan^{-1}(-1)=\pi-\dfrac\pi4=\dfrac{3\pi}4$. Adding $\tan^{-1}1=\dfrac\pi4$ gives $\pi=180^\circ$.</p>`, 'Use the $+\\pi$ correction for $xy>1$.', { calc: () => Math.round(deg(atan(1) + atan(2) + atan(3))) }),
  I(2, 'sums', R`Find $\tan^{-1}\dfrac12+\tan^{-1}\dfrac13$ in degrees.`, 45,
    R`<p>$xy=\dfrac16<1$, so the sum is $\tan^{-1}\dfrac{\frac12+\frac13}{1-\frac16}=\tan^{-1}\dfrac{5/6}{5/6}=\tan^{-1}1=45^\circ$.</p>`, '', { calc: () => Math.round(deg(atan(0.5) + atan(1 / 3))) }),
  M(2, 'values', R`$\sin\left(\cos^{-1}\dfrac35\right)$ equals`, R`$\dfrac45$`, [R`$\dfrac35$`, R`$\dfrac34$`, R`$\dfrac54$`],
    R`<p>Let $\theta=\cos^{-1}\dfrac35$ with $\theta\in\left[0,\dfrac\pi2\right]$. Then $\cos\theta=\dfrac35$ and $\sin\theta=\sqrt{1-\dfrac9{25}}=\dfrac45$ (positive, since $\theta\in[0,\pi]$).</p>`, ''),
  M(2, 'values', R`$\cos\left(2\sin^{-1}\dfrac12\right)$ equals`, R`$\dfrac12$`, [R`$\dfrac{\sqrt3}2$`, R`$0$`, R`$-\dfrac12$`],
    R`<p>$\sin^{-1}\dfrac12=\dfrac\pi6$, so $2\cdot\dfrac\pi6=\dfrac\pi3$ and $\cos\dfrac\pi3=\dfrac12$.</p>`, ''),
  M(2, 'domains', R`The domain of $\sin^{-1}(2x-1)$ is`, R`$[0,1]$`, [R`$[-1,1]$`, R`$\left[-\dfrac12,\dfrac12\right]$`, R`$[0,2]$`],
    R`<p>Need $-1\le2x-1\le1$, so $0\le2x\le2$ and $0\le x\le1$.</p>`, 'Solve the double inequality step by step.'),
  M(2, 'domains', R`The domain of $\cos^{-1}(x^2-2)$ is`, R`$[-\sqrt3,-1]\cup[1,\sqrt3]$`, [R`$[-\sqrt3,\sqrt3]$`, R`$[1,\sqrt3]$`, R`$[-1,1]$`],
    R`<p>Need $-1\le x^2-2\le1$, i.e. $1\le x^2\le3$. That gives $1\le|x|\le\sqrt3$: $x\in[-\sqrt3,-1]\cup[1,\sqrt3]$.</p>`, 'Remember $x^2\\ge1$ excludes the middle.'),
  M(2, 'equations', R`If $\sin^{-1}x=\cos^{-1}x$ then $x$ equals`, R`$\dfrac1{\sqrt2}$`, [R`$\dfrac12$`, R`$\dfrac{\sqrt3}2$`, R`$1$`],
    R`<p>$\sin^{-1}x+\cos^{-1}x=\dfrac\pi2$. If they are equal each is $\dfrac\pi4$, so $x=\sin\dfrac\pi4=\dfrac1{\sqrt2}$.</p>`, ''),
  M(2, 'simplification', R`$\cos^{-1}\left(\cos\dfrac{7\pi}6\right)$ equals`, R`$\dfrac{5\pi}6$`, [R`$\dfrac{7\pi}6$`, R`$-\dfrac{5\pi}6$`, R`$\dfrac\pi6$`],
    R`<p>$\dfrac{7\pi}6$ is outside $[0,\pi]$. $\cos\dfrac{7\pi}6=\cos\left(2\pi-\dfrac{7\pi}6\right)=\cos\dfrac{5\pi}6$, and $\dfrac{5\pi}6\in[0,\pi]$.</p>`, 'Bring the angle into $[0,\\pi]$ first.'),
  M(2, 'simplification', R`$\tan^{-1}\left(\tan\dfrac{3\pi}4\right)$ equals`, R`$-\dfrac\pi4$`, [R`$\dfrac{3\pi}4$`, R`$\dfrac\pi4$`, R`$-\dfrac{3\pi}4$`],
    R`<p>$\tan\dfrac{3\pi}4=-1$ and $\tan^{-1}(-1)=-\dfrac\pi4$. Equivalently, subtract $\pi$ from $\dfrac{3\pi}4$ to land in $\left(-\dfrac\pi2,\dfrac\pi2\right)$.</p>`, ''),
  D(2, 'simplification', R`Find $\sin^{-1}(\sin2)$, where $2$ is in radians.`, 1.1416,
    R`<p>$2>\dfrac\pi2\approx1.571$, so $2$ is outside the principal range. $\sin2=\sin(\pi-2)$ and $\pi-2\approx1.1416$ is inside. So the value is $\pi-2\approx1.14$.</p>`, 'Radians, not degrees: $2$ rad is about $115^\\circ$.', { calc: () => asin(sin(2)) }),
  M(2, 'values', R`$\sin\left(\tan^{-1}\dfrac34\right)$ equals`, R`$\dfrac35$`, [R`$\dfrac45$`, R`$\dfrac34$`, R`$\dfrac53$`],
    R`<p>Draw a right triangle with opposite side $3$ and adjacent side $4$. The hypotenuse is $5$, so $\sin\theta=\dfrac35$.</p>`, ''),
  M(2, 'values', R`$\tan\left(\cos^{-1}\dfrac45\right)$ equals`, R`$\dfrac34$`, [R`$\dfrac45$`, R`$\dfrac35$`, R`$\dfrac43$`],
    R`<p>$\cos\theta=\dfrac45$ means adjacent $4$, hypotenuse $5$, opposite $3$. $\tan\theta=\dfrac34$.</p>`, ''),
  M(2, 'double angle', R`$2\tan^{-1}\dfrac12$ equals`, R`$\tan^{-1}\dfrac43$`, [R`$\tan^{-1}1$`, R`$\tan^{-1}\dfrac14$`, R`$\tan^{-1}\dfrac34$`],
    R`<p>$2\tan^{-1}x=\tan^{-1}\dfrac{2x}{1-x^2}$ for $|x|<1$. With $x=\dfrac12$: $\dfrac{1}{3/4}=\dfrac43$.</p>`, 'Use $1-x^2$, not $1+x^2$.'),
  I(2, 'sums', R`Find $\sin^{-1}\dfrac35+\sin^{-1}\dfrac45$ in degrees.`, 90,
    R`<p>$\sin^{-1}\dfrac45=\cos^{-1}\dfrac35$ (the 3-4-5 triangle), so the sum is $\sin^{-1}\dfrac35+\cos^{-1}\dfrac35=\dfrac\pi2=90^\circ$.</p>`, '', { calc: () => Math.round(deg(asin(0.6) + asin(0.8))) }),
  D(2, 'equations', R`Solve $\sin^{-1}(2x)=\dfrac\pi6$ for $x$.`, 0.25,
    R`<p>$2x=\sin\dfrac\pi6=\dfrac12$, so $x=\dfrac14=0.25$. Check: $2x=0.5\in[-1,1]$.</p>`, '', { calc: () => sin(PI_ / 6) / 2 }),
  I(2, 'sums', R`Find $\tan^{-1}1+\cos^{-1}\left(-\dfrac12\right)+\sin^{-1}\left(-\dfrac12\right)$ in degrees.`, 135,
    R`<p>$\tan^{-1}1=45^\circ$, $\cos^{-1}\left(-\dfrac12\right)=120^\circ$, $\sin^{-1}\left(-\dfrac12\right)=-30^\circ$. Sum $=45+120-30=135^\circ$.</p>`, 'Watch the signs of the principal values.', { calc: () => Math.round(deg(atan(1) + acos(-0.5) + asin(-0.5))) }),
  M(2, 'principal values', R`The principal value of $\cot^{-1}(-1)$ is`, R`$\dfrac{3\pi}4$`, [R`$-\dfrac\pi4$`, R`$\dfrac\pi4$`, R`$\dfrac{5\pi}4$`],
    R`<p>The range of $\cot^{-1}$ is $(0,\pi)$. $\cot\dfrac{3\pi}4=-1$ and $\dfrac{3\pi}4\in(0,\pi)$. (Not $-\dfrac\pi4$, which is outside the range.)</p>`, 'The range of $\\cot^{-1}$ is $(0,\\pi)$.'),
  M(2, 'principal values', R`The principal value of $\sec^{-1}2$ is`, R`$\dfrac\pi3$`, [R`$\dfrac\pi6$`, R`$\dfrac{2\pi}3$`, R`$\dfrac\pi4$`],
    R`<p>$\sec^{-1}2=\cos^{-1}\dfrac12=\dfrac\pi3$.</p>`, ''),
  M(2, 'principal values', R`The principal value of $\operatorname{cosec}^{-1}(-\sqrt2)$ is`, R`$-\dfrac\pi4$`, [R`$\dfrac\pi4$`, R`$\dfrac{5\pi}4$`, R`$-\dfrac{3\pi}4$`],
    R`<p>$\operatorname{cosec}^{-1}x=\sin^{-1}\dfrac1x$. So $\sin^{-1}\left(-\dfrac1{\sqrt2}\right)=-\dfrac\pi4$, which is in $\left[-\dfrac\pi2,\dfrac\pi2\right]$.</p>`, ''),
  M(2, 'domains', R`The domain of $\tan^{-1}x+\sin^{-1}x$ is`, R`$[-1,1]$`, [R`$\mathbb R$`, R`$(-1,1)$`, R`$\left[-\dfrac\pi2,\dfrac\pi2\right]$`],
    R`<p>$\tan^{-1}x$ is defined for all real $x$, but $\sin^{-1}x$ needs $x\in[-1,1]$. The sum is defined only on the common part, $[-1,1]$.</p>`, 'The smaller domain wins.'),
  I(2, 'domains', R`How many integers lie in the domain of $\sin^{-1}\dfrac x2$?`, 5,
    R`<p>Need $-1\le\dfrac x2\le1$, i.e. $-2\le x\le2$. The integers are $-2,-1,0,1,2$: $5$ of them.</p>`, 'Count both end points.', { calc: () => { let c = 0; for (let k = -10; k <= 10; k++) if (!Number.isNaN(asin(k / 2))) c++; return c; } }),
  M(2, 'simplification', R`$\sin^{-1}\left(\sin\dfrac{3\pi}2\right)$ equals`, R`$-\dfrac\pi2$`, [R`$\dfrac{3\pi}2$`, R`$\dfrac\pi2$`, R`$0$`],
    R`<p>$\sin\dfrac{3\pi}2=-1$ and $\sin^{-1}(-1)=-\dfrac\pi2$.</p>`, 'Evaluate the inside first.'),

  // ---------- L3 ----------
  MT(3, 'principal values', 'm1', R`Choose the correct matching for the List I and List II above.`, 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'],
    R`<p>A: $-\dfrac\pi6$ (q). B: $\pi-\dfrac\pi3=\dfrac{2\pi}3$ (r). C: $-\dfrac\pi3$ (s). D: $\cot^{-1}(-1)=\pi-\dfrac\pi4=\dfrac{3\pi}4$ (p), because the range of $\cot^{-1}$ is $(0,\pi)$.</p>`, 'Cot inverse of a negative number is in the second quadrant.'),
  MT(3, 'ranges', 'm2', R`Choose the correct matching for the List I and List II above.`, 'A-q, B-r, C-p, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-p, C-r, D-s', 'A-q, B-r, C-s, D-p'],
    R`<p>$\cos^{-1}$: $[0,\pi]$ (q). $\tan^{-1}$: $\left(-\dfrac\pi2,\dfrac\pi2\right)$ (r). $\cot^{-1}$: $(0,\pi)$ (p). $\operatorname{cosec}^{-1}$: $\left[-\dfrac\pi2,\dfrac\pi2\right]$ without $0$ (s), since $\operatorname{cosec}$ is never $0$ and $\sin^{-1}0=0$ would correspond to infinity.</p>`, 'Closed for $\\cos^{-1}$, open for $\\cot^{-1}$.'),
  MT(3, 'simplification', 'm3', R`Choose the correct matching for the List I and List II above.`, 'A-r, B-s, C-q, D-p', ['A-q, B-s, C-r, D-p', 'A-r, B-p, C-q, D-s', 'A-r, B-s, C-p, D-q'],
    R`<p>A: $\sin\dfrac{2\pi}3=\sin\dfrac\pi3$, so $\dfrac\pi3$ (r). B: $\sin\left(-\dfrac{3\pi}4\right)=-\dfrac1{\sqrt2}$, so $-\dfrac\pi4$ (s). C: $\cos\dfrac{5\pi}4=\cos\dfrac{3\pi}4$, so $\dfrac{3\pi}4$ (q). D: $\tan\dfrac{7\pi}6=\tan\dfrac\pi6$, so $\dfrac\pi6$ (p).</p>`, 'Bring each angle into the principal range of the inverse function.'),
  MT(3, 'sums', 'm4', R`Choose the correct matching for the List I and List II above.`, 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    R`<p>A: $\dfrac12\cdot\dfrac13<1$, sum $=\tan^{-1}1=\dfrac\pi4$ (r). B: $2\cdot3>1$, sum $=\pi+\tan^{-1}(-1)=\dfrac{3\pi}4$ (s). C: $\dfrac\pi2$ (p). D: $\tan^{-1}$ is odd, so the sum is $-\left(\tan^{-1}2+\tan^{-1}3\right)=-\dfrac{3\pi}4$ (q).</p>`, 'For $xy>1$ the plain formula is off by $\\pm\\pi$.'),
  D(3, 'simplification', R`Find $\cos^{-1}(\cos10)$, where $10$ is in radians.`, 2.5664,
    R`<p>$10$ rad is between $3\pi\approx9.42$ and $4\pi\approx12.57$. Cosine has period $2\pi$ and is even: $\cos10=\cos(4\pi-10)$, and $4\pi-10\approx2.566\in[0,\pi]$. So the answer is $4\pi-10\approx2.57$.</p>`, '$\\cos^{-1}(\\cos x)=x$ only for $x\\in[0,\\pi]$.', { calc: () => acos(cos(10)) }),
  D(3, 'simplification', R`Find $\sin^{-1}(\sin10)$, where $10$ is in radians.`, -0.5752,
    R`<p>$10\in(3\pi,\,3.5\pi)$. $\sin(3\pi-10)=\sin10$ (because $\sin(3\pi-x)=\sin x$), and $3\pi-10\approx-0.575\in\left[-\dfrac\pi2,\dfrac\pi2\right]$. So the value is $3\pi-10\approx-0.58$.</p>`, 'The answer can be negative.', { calc: () => asin(sin(10)) }),
  D(3, 'simplification', R`Find $\tan^{-1}(\tan5)$, where $5$ is in radians.`, -1.2832,
    R`<p>Tangent has period $\pi$. $5-2\pi\approx-1.283\in\left(-\dfrac\pi2,\dfrac\pi2\right)$. So $\tan^{-1}(\tan5)=5-2\pi\approx-1.28$.</p>`, 'Subtract multiples of $\\pi$, not $2\\pi$ only.', { calc: () => atan(tan(5)) }),
  M(3, 'sums', R`$\tan^{-1}2+\tan^{-1}3$ equals`, R`$\dfrac{3\pi}4$`, [R`$-\dfrac\pi4$`, R`$\dfrac\pi4$`, R`$\pi$`],
    R`<p>Here $xy=6>1$ and both are positive, so $\tan^{-1}2+\tan^{-1}3=\pi+\tan^{-1}\dfrac{5}{1-6}=\pi-\dfrac\pi4=\dfrac{3\pi}4$. A direct check: $\tan^{-1}2\approx63.4^\circ$ and $\tan^{-1}3\approx71.6^\circ$, sum $135^\circ$.</p>`, 'The plain formula gives $-\\pi/4$, which is the wrong branch.'),
  M(3, 'simplification', R`For $x\ne0$, $\tan^{-1}\dfrac{\sqrt{1+x^2}-1}x$ equals`, R`$\dfrac12\tan^{-1}x$`, [R`$2\tan^{-1}x$`, R`$\tan^{-1}x$`, R`$\dfrac12\sin^{-1}x$`],
    R`<p>Put $x=\tan\theta$ with $\theta\in\left(-\dfrac\pi2,\dfrac\pi2\right)$. Then $\dfrac{\sec\theta-1}{\tan\theta}=\dfrac{1-\cos\theta}{\sin\theta}=\tan\dfrac\theta2$. So the expression is $\dfrac\theta2=\dfrac12\tan^{-1}x$. Check with $x=\sqrt3$: $\tan^{-1}\dfrac1{\sqrt3}=\dfrac\pi6=\dfrac12\cdot\dfrac\pi3$.</p>`, 'The substitution $x=\\tan\\theta$ removes the root.'),
  I(3, 'properties', R`If $\sin^{-1}x+\sin^{-1}y=\dfrac{2\pi}3$, find $\cos^{-1}x+\cos^{-1}y$ in degrees.`, 60,
    R`<p>$\cos^{-1}x=\dfrac\pi2-\sin^{-1}x$ and the same for $y$. Sum $=\pi-\dfrac{2\pi}3=\dfrac\pi3=60^\circ$.</p>`, '', { calc: () => Math.round(deg(PI_ - 2 * PI_ / 3)) }),
  D(3, 'equations', R`Solve $\tan^{-1}2x+\tan^{-1}3x=\dfrac\pi4$ for $x>0$.`, 0.1667,
    R`<p>Taking tangent: $\dfrac{5x}{1-6x^2}=1$, so $6x^2+5x-1=0$, i.e. $(6x-1)(x+1)=0$. $x=\dfrac16$ or $x=-1$. For $x=-1$ the left side is $\tan^{-1}(-2)+\tan^{-1}(-3)=-\dfrac{3\pi}4\ne\dfrac\pi4$, so it is rejected. $x=\dfrac16\approx0.1667$ works since $6x^2=\dfrac16<1$.</p>`, 'Squaring-type steps can bring in extra roots; always check.', { calc: () => 1 / 6 }),
  D(3, 'equations', R`Solve $\sin^{-1}x+\sin^{-1}2x=\dfrac\pi2$ for $x$.`, 0.4472,
    R`<p>$\sin^{-1}2x=\dfrac\pi2-\sin^{-1}x=\cos^{-1}x$. Take sine: $2x=\sqrt{1-x^2}$. Squaring: $4x^2=1-x^2$, $x^2=\dfrac15$. We need $2x\ge0$, so $x=\dfrac1{\sqrt5}\approx0.4472$ (the negative root is rejected). Check: $2x=0.894\le1$.</p>`, 'Reject the root that makes $2x<0$.', { calc: () => 1 / sqrt(5) }),
  I(4, 'equations', R`How many real solutions does $\tan^{-1}(x-2)+\tan^{-1}x+\tan^{-1}(x+2)=\tan^{-1}3x$ have?`, 3,
    R`<p>Use $\tan^{-1}(x-2)+\tan^{-1}(x+2)=\tan^{-1}\dfrac{2x}{5-x^2}$ and take the tangent of the whole equation: $\dfrac{\frac{2x}{5-x^2}+x}{1-\frac{2x^2}{5-x^2}}=3x$, i.e. $\dfrac{7x-x^3}{5-3x^2}=3x$. So $x=0$ or $7-x^2=15-9x^2$, giving $x=\pm1$. Checking $x=1$: $\tan^{-1}(-1)+\tan^{-1}1+\tan^{-1}3=\tan^{-1}3$ (true). $x=-1$ likewise. So the solutions are $0,1,-1$: three.</p>`, 'Check each root against the branch conditions.', { calc: () => zeros((x) => atan(x - 2) + atan(x) + atan(x + 2) - atan(3 * x), -20, 20) }),
  M(3, 'values', R`$\sin\left(2\sin^{-1}\dfrac35\right)$ equals`, R`$\dfrac{24}{25}$`, [R`$\dfrac{6}{5}$`, R`$\dfrac{12}{25}$`, R`$\dfrac{7}{25}$`],
    R`<p>$\sin2\theta=2\sin\theta\cos\theta$ with $\sin\theta=\dfrac35$, $\cos\theta=\dfrac45$ ($\theta\in\left[0,\dfrac\pi2\right]$). $2\cdot\dfrac35\cdot\dfrac45=\dfrac{24}{25}$.</p>`, 'The cosine is positive here.'),
  M(3, 'values', R`$\cos\left(2\cos^{-1}\dfrac13\right)$ equals`, R`$-\dfrac79$`, [R`$\dfrac79$`, R`$\dfrac29$`, R`$-\dfrac{2}{3}$`],
    R`<p>$\cos2\theta=2\cos^2\theta-1=2\cdot\dfrac19-1=-\dfrac79$.</p>`, ''),
  M(3, 'values', R`$\tan\left(2\tan^{-1}\dfrac12\right)$ equals`, R`$\dfrac43$`, [R`$1$`, R`$\dfrac34$`, R`$\dfrac45$`],
    R`<p>$\tan2\theta=\dfrac{2t}{1-t^2}$ with $t=\dfrac12$: $\dfrac1{3/4}=\dfrac43$.</p>`, ''),
  M(3, 'values', R`$\tan\left(\sin^{-1}\dfrac5{13}\right)$ equals`, R`$\dfrac5{12}$`, [R`$\dfrac5{13}$`, R`$\dfrac{12}5$`, R`$\dfrac{13}{12}$`],
    R`<p>Opposite $5$, hypotenuse $13$, so adjacent $=12$. $\tan\theta=\dfrac5{12}$.</p>`, ''),
  D(3, 'values', R`Find $\cos\left(\sin^{-1}\dfrac35+\cos^{-1}\dfrac5{13}\right)$.`, -0.2462,
    R`<p>Let $A=\sin^{-1}\dfrac35$: $\sin A=\dfrac35$, $\cos A=\dfrac45$. Let $B=\cos^{-1}\dfrac5{13}$: $\cos B=\dfrac5{13}$, $\sin B=\dfrac{12}{13}$. $\cos(A+B)=\cos A\cos B-\sin A\sin B=\dfrac{20}{65}-\dfrac{36}{65}=-\dfrac{16}{65}\approx-0.246$.</p>`, 'Subtract the sine product.', { calc: () => cos(asin(3 / 5) + acos(5 / 13)) }),
  M(3, 'domains', R`The domain of $f(x)=\sin^{-1}x+\cos^{-1}(x-1)$ is`, R`$[0,1]$`, [R`$[-1,1]$`, R`$[0,2]$`, R`$\{1\}$`],
    R`<p>$\sin^{-1}x$ needs $x\in[-1,1]$. $\cos^{-1}(x-1)$ needs $-1\le x-1\le1$, i.e. $x\in[0,2]$. The intersection is $[0,1]$.</p>`, 'Intersect the two domains.'),
  M(3, 'ranges', R`The range of $f(x)=\sin^{-1}x+2\cos^{-1}x$ is`, R`$\left[\dfrac\pi2,\dfrac{3\pi}2\right]$`, [R`$\left[-\dfrac\pi2,\dfrac\pi2\right]$`, R`$[0,\pi]$`, R`$\left[\dfrac\pi2,\pi\right]$`],
    R`<p>$\cos^{-1}x=\dfrac\pi2-\sin^{-1}x$, so $f=\pi-\sin^{-1}x$. As $\sin^{-1}x$ goes over $\left[-\dfrac\pi2,\dfrac\pi2\right]$, $f$ goes over $\left[\dfrac\pi2,\dfrac{3\pi}2\right]$.</p>`, 'Reduce to a single inverse function first.'),
  M(3, 'ranges', R`The range of $f(x)=\sin^{-1}x+\tan^{-1}x$ on $[-1,1]$ is`, R`$\left[-\dfrac{3\pi}4,\dfrac{3\pi}4\right]$`, [R`$\left[-\pi,\pi\right]$`, R`$\left[-\dfrac\pi2,\dfrac\pi2\right]$`, R`$\left[-\dfrac\pi4,\dfrac\pi4\right]$`],
    R`<p>Both parts are increasing, so $f$ is increasing from $f(-1)=-\dfrac\pi2-\dfrac\pi4=-\dfrac{3\pi}4$ to $f(1)=\dfrac{3\pi}4$.</p>`, 'Use the end points since $f$ is increasing.'),
  D(3, 'equations', R`Solve $\sin^{-1}x=2\cos^{-1}x$ for $x$.`, 0.866,
    R`<p>Let $s=\sin^{-1}x$. Then $\cos^{-1}x=\dfrac\pi2-s$ and $s=\pi-2s$, so $s=\dfrac\pi3$ and $x=\sin\dfrac\pi3=\dfrac{\sqrt3}2\approx0.866$.</p>`, '', { calc: () => sin(PI_ / 3) }),
  M(3, 'inequalities', R`The solution set of $\cos^{-1}x>\sin^{-1}x$ is`, R`$\left[-1,\dfrac1{\sqrt2}\right)$`, [R`$\left(\dfrac1{\sqrt2},1\right]$`, R`$[-1,1]$`, R`$\left[0,\dfrac1{\sqrt2}\right)$`],
    R`<p>$\dfrac\pi2-s>s$ means $s<\dfrac\pi4$, i.e. $\sin^{-1}x<\dfrac\pi4$. Since $\sin^{-1}$ is increasing, $x<\sin\dfrac\pi4=\dfrac1{\sqrt2}$. With the domain, $x\in\left[-1,\dfrac1{\sqrt2}\right)$.</p>`, 'Do not drop the negative values.'),
  I(3, 'equations', R`If $\sin^{-1}x+\sin^{-1}y+\sin^{-1}z=\dfrac{3\pi}2$, find $x^2+y^2+z^2$.`, 3,
    R`<p>Each $\sin^{-1}$ is at most $\dfrac\pi2$, so the sum can reach $\dfrac{3\pi}2$ only if each equals $\dfrac\pi2$. Then $x=y=z=1$ and $x^2+y^2+z^2=3$.</p>`, 'Use the upper bound of each term.'),
  I(3, 'equations', R`If $\tan^{-1}1+\tan^{-1}2+\tan^{-1}c=\pi$ with $c>0$, find $c$.`, 3,
    R`<p>If $A+B+C=\pi$ then $\tan A+\tan B+\tan C=\tan A\tan B\tan C$. So $1+2+c=2c$ and $c=3$. Check: $45^\circ+63.43^\circ+71.57^\circ=180^\circ$.</p>`, ''),
  D(3, 'principal values', R`Find $\cot^{-1}\left(-\dfrac12\right)$ in radians (principal value).`, 2.0344,
    R`<p>For negative $x$, $\cot^{-1}x=\pi+\tan^{-1}\dfrac1x$. Here $\pi+\tan^{-1}(-2)=\pi-\tan^{-1}2\approx3.1416-1.1071=2.0344$. It lies in $(0,\pi)$.</p>`, '$\\tan^{-1}\\dfrac1x$ alone is negative, outside the range of $\\cot^{-1}$.', { calc: () => PI_ - atan(2) }),
  M(3, 'principal values', R`The principal value of $\sec^{-1}(-2)$ is`, R`$\dfrac{2\pi}3$`, [R`$-\dfrac\pi3$`, R`$\dfrac\pi3$`, R`$\dfrac{4\pi}3$`],
    R`<p>$\sec^{-1}x=\cos^{-1}\dfrac1x$. So $\cos^{-1}\left(-\dfrac12\right)=\dfrac{2\pi}3$.</p>`, ''),
  M(3, 'properties', R`For $|x|\ge1$, $\sec^{-1}x+\operatorname{cosec}^{-1}x$ equals`, R`$\dfrac\pi2$`, [R`$\pi$`, R`$0$`, R`$\dfrac\pi4$`],
    R`<p>$\sec^{-1}x=\cos^{-1}\dfrac1x$ and $\operatorname{cosec}^{-1}x=\sin^{-1}\dfrac1x$. Their sum is $\dfrac\pi2$ since $\cos^{-1}y+\sin^{-1}y=\dfrac\pi2$.</p>`, ''),
  M(3, 'properties', R`For $x<0$, $\cot^{-1}\dfrac1x$ equals`, R`$\pi+\tan^{-1}x$`, [R`$\tan^{-1}x$`, R`$\pi-\tan^{-1}x$`, R`$-\tan^{-1}x$`],
    R`<p>For $y<0$, $\cot^{-1}y=\pi+\tan^{-1}\dfrac1y$. Put $y=\dfrac1x<0$: $\cot^{-1}\dfrac1x=\pi+\tan^{-1}x$. (For $x>0$ it is $\tan^{-1}x$.) Test $x=-1$: $\cot^{-1}(-1)=\dfrac{3\pi}4=\pi-\dfrac\pi4$ ✓.</p>`, 'The two cases $x>0$ and $x<0$ differ by $\\pi$.'),
  M(3, 'simplification', R`For $-\dfrac1{\sqrt2}\le x\le\dfrac1{\sqrt2}$, $\sin^{-1}\left(2x\sqrt{1-x^2}\right)$ equals`, R`$2\sin^{-1}x$`, [R`$\sin^{-1}x$`, R`$\pi-2\sin^{-1}x$`, R`$2\cos^{-1}x$`],
    R`<p>Put $x=\sin\theta$, $\theta\in\left[-\dfrac\pi4,\dfrac\pi4\right]$. Then $2\sin\theta\cos\theta=\sin2\theta$ with $2\theta\in\left[-\dfrac\pi2,\dfrac\pi2\right]$, so the inverse returns $2\theta=2\sin^{-1}x$.</p>`, 'The range restriction on $x$ is what keeps $2\\theta$ principal.'),
  D(4, 'simplification', R`Find $\sin^{-1}\left(2\times0.8\times0.6\right)$.`, 1.287,
    R`<p>$2\times0.8\times0.6=0.96$ and $\sin^{-1}0.96\approx1.287$. Note: this is NOT $2\sin^{-1}0.8\approx1.855$, because $0.8>\dfrac1{\sqrt2}$. In fact $x=0.8$ gives $\theta=\sin^{-1}0.8\approx0.927>\dfrac\pi4$, so $2\theta>\dfrac\pi2$ and the inverse returns $\pi-2\theta\approx1.287$.</p>`, 'The shortcut $2\\sin^{-1}x$ needs $|x|\\le1/\\sqrt2$.', { calc: () => asin(0.96) }),

  A(2, 'domains', R`$\sin^{-1}2$ is not defined.`, R`$-1\le\sin\theta\le1$ for every real $\theta$.`, 0,
    R`<p>Sine never equals $2$, so there is no angle with $\sin\theta=2$. R is the reason, so A follows from R.</p>`, ''),
  A(3, 'simplification', R`$\sin^{-1}\left(\sin\dfrac{2\pi}3\right)=\dfrac{2\pi}3$.`, R`The principal range of $\sin^{-1}$ is $\left[-\dfrac\pi2,\dfrac\pi2\right]$.`, 3,
    R`<p>A is false: $\dfrac{2\pi}3>\dfrac\pi2$ is outside the principal range, and the value is $\pi-\dfrac{2\pi}3=\dfrac\pi3$. R is true.</p>`, ''),
  A(3, 'properties', R`$\tan^{-1}x+\cot^{-1}x=\dfrac\pi2$ for every real $x$.`, R`$\cot^{-1}x=\dfrac\pi2-\tan^{-1}x$ when the range of $\cot^{-1}$ is taken as $(0,\pi)$.`, 0,
    R`<p>R is the definition-compatible identity, and it gives A directly for all real $x$ (including negative $x$: $\tan^{-1}x<0$ and $\cot^{-1}x>\dfrac\pi2$).</p>`, ''),
  A(4, 'sums', R`$\tan^{-1}2+\tan^{-1}3=-\dfrac\pi4$.`, R`$\tan^{-1}x+\tan^{-1}y=\pi+\tan^{-1}\dfrac{x+y}{1-xy}$ when $x,y>0$ and $xy>1$.`, 3,
    R`<p>A is false: the sum is $\dfrac{3\pi}4$ (about $135^\circ$). R is the correct formula for this case: $\pi+\tan^{-1}(-1)=\dfrac{3\pi}4$.</p>`, 'Check by adding the decimal angles.'),
  A(4, 'simplification', R`$\cos^{-1}(\cos4)=4$.`, R`The principal range of $\cos^{-1}$ is $[0,\pi]$.`, 3,
    R`<p>$4>\pi$, so $4$ is outside $[0,\pi]$. $\cos^{-1}(\cos4)=2\pi-4\approx2.28$. A is false, R is true.</p>`, ''),
  A(4, 'equations', R`The only solution of $\sin^{-1}x+\sin^{-1}y+\sin^{-1}z=\dfrac{3\pi}2$ is $x=y=z=1$.`, R`The maximum value of $\sin^{-1}t$ is $\dfrac\pi2$.`, 0,
    R`<p>Each term is at most $\dfrac\pi2$, so the sum is at most $\dfrac{3\pi}2$ with equality only when each is $\dfrac\pi2$. R explains A.</p>`, ''),
  S(3, 'properties', R`$\sin^{-1}(-x)=-\sin^{-1}x$.`, R`$\cos^{-1}(-x)=-\cos^{-1}x$.`, 1,
    R`<p>I is true (sine inverse is odd). II is false: $\cos^{-1}(-x)=\pi-\cos^{-1}x$.</p>`, ''),
  S(3, 'ranges', R`$\tan^{-1}x$ lies strictly between $-\dfrac\pi2$ and $\dfrac\pi2$ for every real $x$.`, R`There is a real number $x$ with $\tan^{-1}x=\dfrac\pi2$.`, 1,
    R`<p>I is true. II is false: $\tan\dfrac\pi2$ is not defined, so no real $x$ gives $\dfrac\pi2$ (the value is approached as $x\to\infty$ only).</p>`, ''),
  S(4, 'simplification', R`$\sin^{-1}(\sin x)=x$ for $x\in\left[-\dfrac\pi2,\dfrac\pi2\right]$.`, R`$\cos^{-1}(\cos x)=x$ for $x\in[0,\pi]$.`, 0,
    R`<p>Both are the correct ranges in which each inverse undoes its function.</p>`, ''),
  S(4, 'properties', R`$\tan^{-1}x+\tan^{-1}\dfrac1x=\dfrac\pi2$ for every $x\ne0$.`, R`$\tan^{-1}x+\tan^{-1}\dfrac1x=\dfrac\pi2$ for $x>0$ and $-\dfrac\pi2$ for $x<0$.`, 2,
    R`<p>For $x<0$ both terms are negative, so the sum is $-\dfrac\pi2$; test $x=-1$: $-\dfrac\pi4-\dfrac\pi4=-\dfrac\pi2$. I is false, II true.</p>`, ''),
  S(4, 'properties', R`$\cot^{-1}x=\tan^{-1}\dfrac1x$ for every $x\ne0$.`, R`For $x<0$, $\cot^{-1}x=\pi+\tan^{-1}\dfrac1x$.`, 2,
    R`<p>For $x<0$, $\tan^{-1}\dfrac1x<0$ but $\cot^{-1}x\in\left(\dfrac\pi2,\pi\right)$, so I is false. II gives the correct relation.</p>`, ''),
  S(5, 'domains', R`$\sec^{-1}\dfrac12$ is defined and equals $\dfrac\pi3$.`, R`The domain of $\sec^{-1}$ is $(-\infty,-1]\cup[1,\infty)$.`, 3,
    R`<p>$\sec^{-1}\dfrac12$ would need $\cos\theta=2$, so I is false. II is true.</p>`, ''),
  SC(3, 'principal values', [R`$\sin^{-1}\dfrac12=\dfrac\pi6$`, R`$\cos^{-1}(-1)=\pi$`, R`$\tan^{-1}(-1)=\dfrac{7\pi}4$`, R`$\cot^{-1}0=\dfrac\pi2$`], '3', ['1', '2', '4'],
    R`<p>(1) true. (2) true. (3) false: $\tan^{-1}(-1)=-\dfrac\pi4$. (4) true: $\cot\dfrac\pi2=0$. Three are correct.</p>`, ''),
  SC(4, 'simplification', [R`$\sin^{-1}(\sin3)=3$`, R`$\cos^{-1}(\cos3)=3$`, R`$\tan^{-1}(\tan3)=3$`, R`$\sin^{-1}(\sin(-1))=-1$`], '2', ['1', '3', '4'],
    R`<p>(1) false: $3>\dfrac\pi2$, value $\pi-3$. (2) true: $3\in[0,\pi]$. (3) false: $3>\dfrac\pi2$, value $3-\pi$. (4) true: $-1\in\left[-\dfrac\pi2,\dfrac\pi2\right]$. Two are correct.</p>`, 'Compare each angle with its principal range.'),
  X(3, 'domains', R`Which of the following are defined (as real numbers)?`, [R`$\sin^{-1}(1.2)$`, R`$\cos^{-1}(-1)$`, R`$\tan^{-1}(100)$`, R`$\sec^{-1}(0.5)$`], [1, 2],
    R`<p>$1.2$ is outside $[-1,1]$; $\sec^{-1}$ needs $|x|\ge1$. Only $\cos^{-1}(-1)=\pi$ and $\tan^{-1}100$ exist.</p>`, ''),
  X(3, 'principal values', R`Which of the following equal $\dfrac\pi3$?`, [R`$\cos^{-1}\dfrac12$`, R`$\sin^{-1}\dfrac{\sqrt3}2$`, R`$\tan^{-1}\dfrac1{\sqrt3}$`, R`$\sec^{-1}2$`], [0, 1, 3],
    R`<p>$\cos^{-1}\dfrac12=\dfrac\pi3$; $\sin^{-1}\dfrac{\sqrt3}2=\dfrac\pi3$; $\tan^{-1}\dfrac1{\sqrt3}=\dfrac\pi6$ (not $\dfrac\pi3$); $\sec^{-1}2=\cos^{-1}\dfrac12=\dfrac\pi3$.</p>`, ''),
  X(4, 'simplification', R`For which of the following values of $x$ is $\sin^{-1}(\sin x)=x$?`, [R`$-\dfrac\pi3$`, R`$\dfrac\pi2$`, R`$2$`, R`$1.5$`], [0, 1, 3],
    R`<p>The identity holds exactly for $x\in\left[-\dfrac\pi2,\dfrac\pi2\right]\approx[-1.571,1.571]$. $-\dfrac\pi3$, $\dfrac\pi2$ and $1.5$ are inside; $2$ is not.</p>`, 'The end points count.'),
  X(4, 'properties', R`Which of the following hold for every $x$ in the domain of the function?`, [R`$\sin^{-1}(-x)=-\sin^{-1}x$`, R`$\cos^{-1}(-x)=\pi-\cos^{-1}x$`, R`$\tan^{-1}(-x)=-\tan^{-1}x$`, R`$\cot^{-1}(-x)=-\cot^{-1}x$`], [0, 1, 2],
    R`<p>Sine and tangent inverses are odd. Cosine inverse satisfies $\pi-\cos^{-1}x$. For cotangent inverse the correct rule is $\cot^{-1}(-x)=\pi-\cot^{-1}x$, so D is false.</p>`, ''),
  X(5, 'sums', R`Which of the following equal $\dfrac\pi4$?`, [R`$\tan^{-1}\dfrac12+\tan^{-1}\dfrac13$`, R`$2\tan^{-1}(\sqrt2-1)$`, R`$\tan^{-1}2-\tan^{-1}\dfrac13$`, R`$2\sin^{-1}\dfrac12$`], [0, 1, 2],
    R`<p>(A) $\tan^{-1}1=\dfrac\pi4$. (B) $\tan\dfrac\pi8=\sqrt2-1$, so $2\tan^{-1}(\sqrt2-1)=\dfrac\pi4$. (C) $\tan^{-1}\dfrac{2-\frac13}{1+\frac23}=\tan^{-1}1=\dfrac\pi4$. (D) $2\cdot\dfrac\pi6=\dfrac\pi3$.</p>`, 'Check each with decimals: $26.57^\\circ+18.43^\\circ=45^\\circ$.'),
  X(4, 'simplification', R`Let $f(x)=\sin^{-1}(\sin x)$ for real $x$. Which of the following are true?`, [R`$f$ is periodic with period $2\pi$`, R`$f$ is an odd function`, R`$f(\pi)=0$`, R`$f(2)=2$`], [0, 1, 2],
    R`<p>$\sin x$ has period $2\pi$, so $f$ does. $f(-x)=\sin^{-1}(-\sin x)=-f(x)$: odd. $f(\pi)=\sin^{-1}0=0$. $f(2)=\pi-2\ne2$.</p>`, ''),

  PI(3, 'values', 'p1', R`Find $f\left(\dfrac34\right)$ in degrees.`, 30,
    R`<p>$2\cdot\dfrac34-1=\dfrac12$ and $\sin^{-1}\dfrac12=30^\circ$.</p>`, '', { calc: () => Math.round(deg(asin(2 * 0.75 - 1))) }),
  PI(3, 'values', 'p1', R`Find $f(0)$ in degrees.`, -90,
    R`<p>$2\cdot0-1=-1$ and $\sin^{-1}(-1)=-90^\circ$.</p>`, '', { calc: () => Math.round(deg(asin(-1))) }),
  PD(3, 'equations', 'p1', R`Solve $f(x)=\dfrac\pi6$ for $x$.`, 0.75,
    R`<p>$2x-1=\sin\dfrac\pi6=\dfrac12$, so $x=\dfrac34=0.75$.</p>`, '', { calc: () => (sin(PI_ / 6) + 1) / 2 }),
  PI(3, 'domains', 'p1', R`The domain of $f$ is $[a,b]$. Find $b-a$.`, 1,
    R`<p>$-1\le2x-1\le1$ gives $0\le x\le1$. So $b-a=1$.</p>`, ''),
  PD(3, 'telescoping sums', 'p2', R`Find $S_1$ in degrees.`, 18.4349,
    R`<p>$S_1=\tan^{-1}\dfrac13\approx18.43^\circ$.</p>`, '', { calc: () => deg(atan(1 / 3)) }),
  PD(4, 'telescoping sums', 'p2', R`Find $S_6$ in degrees.`, 36.8699,
    R`<p>$\tan^{-1}\dfrac1{r^2+r+1}=\tan^{-1}(r+1)-\tan^{-1}r$. So $S_n=\tan^{-1}(n+1)-\tan^{-1}1=\tan^{-1}\dfrac{n}{n+2}$. $S_6=\tan^{-1}\dfrac68=\tan^{-1}0.75\approx36.87^\circ$.</p>`, 'The sum telescopes to the last term minus the first.', { calc: () => { let s = 0; for (let r = 1; r <= 6; r++) s += atan(1 / (r * r + r + 1)); return deg(s); } }),
  PI(4, 'telescoping sums', 'p2', R`Find $\displaystyle\lim_{n\to\infty}S_n$ in degrees.`, 45,
    R`<p>$S_n=\tan^{-1}\dfrac n{n+2}\to\tan^{-1}1=45^\circ$.</p>`, '', { calc: () => Math.round(deg(atan(1e12 / (1e12 + 2)))) }),
  PI(3, 'sums', 'p3', R`Find $\tan^{-1}2+\tan^{-1}3$ in degrees.`, 135,
    R`<p>$xy=6>1$, so the sum is $180^\circ+\tan^{-1}(-1)=180^\circ-45^\circ=135^\circ$.</p>`, '', { calc: () => Math.round(deg(atan(2) + atan(3))) }),
  PD(4, 'sums', 'p3', R`Find $\tan^{-1}4+\tan^{-1}\dfrac12$ in degrees.`, 102.5288,
    R`<p>$xy=2>1$. The formula gives $\tan^{-1}\dfrac{4.5}{1-2}=\tan^{-1}(-4.5)\approx-77.47^\circ$. Adding $180^\circ$: $102.53^\circ$. (Check: $75.96^\circ+26.57^\circ=102.53^\circ$.)</p>`, 'Add $180^\\circ$ because the sum exceeds $90^\\circ$.', { calc: () => deg(atan(4) + atan(0.5)) }),
  PI(4, 'sums', 'p3', R`Find $\tan^{-1}(-2)+\tan^{-1}(-3)$ in degrees.`, -135,
    R`<p>This is the negative of $\tan^{-1}2+\tan^{-1}3=135^\circ$ because $\tan^{-1}$ is odd. So $-135^\circ$.</p>`, 'For $x,y<0$ and $xy>1$ the correction is $-\\pi$.', { calc: () => Math.round(deg(atan(-2) + atan(-3))) }),
  PI(3, 'equations', 'p4', R`How many roots does the quadratic have?`, 2,
    R`<p>$\dfrac{5x}{1-6x^2}=1$ gives $6x^2+5x-1=0$, with roots $\dfrac16$ and $-1$. Two roots.</p>`, ''),
  PD(3, 'equations', 'p4', R`Find the valid root.`, 0.1667,
    R`<p>$x=\dfrac16$ passes (both terms positive, $6x^2=\dfrac16<1$, sum $\dfrac\pi4$). $x=-1$ gives $-135^\circ$ and fails.</p>`, '', { calc: () => 1 / 6 }),
  PI(4, 'equations', 'p4', R`How many solutions does the original equation have?`, 1,
    R`<p>Only $x=\dfrac16$ is valid. The root $x=-1$ was created by taking tangents, which loses the branch.</p>`, 'Check roots in the original equation.'),

  // ---------- L4 / L5 ----------
  I(4, 'graphs', R`How many real solutions does $\sin^{-1}(\sin x)=\dfrac x2$ have?`, 3,
    R`<p>$\sin^{-1}(\sin x)$ is a zig-zag between $-\dfrac\pi2$ and $\dfrac\pi2$, equal to $x$ on $\left[-\dfrac\pi2,\dfrac\pi2\right]$ and $\pi-x$ on $\left[\dfrac\pi2,\dfrac{3\pi}2\right]$. The line $y=\dfrac x2$ stays within $\left[-\dfrac\pi2,\dfrac\pi2\right]$ only for $|x|\le\pi$. On $\left[-\dfrac\pi2,\dfrac\pi2\right]$: $x=\dfrac x2$ gives $x=0$. On $\left[\dfrac\pi2,\pi\right]$: $\pi-x=\dfrac x2$ gives $x=\dfrac{2\pi}3$. By symmetry $x=-\dfrac{2\pi}3$. Total $3$.</p>`, 'Sketch both graphs on one axis.', { calc: () => zeros((x) => asin(sin(x)) - x / 2, -30, 30) }),
  D(4, 'equations', R`Solve $\cos^{-1}x=\tan^{-1}x$ for $x$.`, 0.7862,
    R`<p>Take $\cos$ of both sides: $x=\cos(\tan^{-1}x)=\dfrac1{\sqrt{1+x^2}}$ (cosine of an angle in $\left(-\dfrac\pi2,\dfrac\pi2\right)$ is positive). So $x>0$ and $x^2(1+x^2)=1$: $x^4+x^2-1=0$, $x^2=\dfrac{\sqrt5-1}2\approx0.618$, $x\approx0.786$. Check: $\cos^{-1}0.786\approx0.667$ and $\tan^{-1}0.786\approx0.667$.</p>`, 'Reject the negative root: $\\cos^{-1}x\\ge$ would then differ.', { calc: () => sqrt((sqrt(5) - 1) / 2) }),
  I(4, 'equations', R`How many real solutions does $(\sin^{-1}x)^2-\dfrac{5\pi}4\sin^{-1}x+\dfrac{\pi^2}4=0$ have?`, 1,
    R`<p>Let $t=\sin^{-1}x\in\left[-\dfrac\pi2,\dfrac\pi2\right]$. $t^2-\dfrac{5\pi}4t+\dfrac{\pi^2}4=\left(t-\dfrac\pi4\right)(t-\pi)=0$. The root $t=\pi$ is outside the range; $t=\dfrac\pi4$ gives $x=\dfrac1{\sqrt2}$. One solution.</p>`, 'Test each value of $t$ against the range of $\\sin^{-1}$.'),
  D(4, 'simplification', R`Let $f(x)=\sin^{-1}(\sin x)+\cos^{-1}(\cos x)$. Find $f(4)$, with $4$ in radians.`, 1.4248,
    R`<p>$4\in\left(\pi,\dfrac{3\pi}2\right)$. $\sin^{-1}(\sin4)=\pi-4\approx-0.858$. $\cos^{-1}(\cos4)=2\pi-4\approx2.283$. Sum $=3\pi-8\approx1.425$.</p>`, 'Both parts change branch at $\\pi$.', { calc: () => asin(sin(4)) + acos(cos(4)) }),
  M(4, 'graphs', R`The range of $f(x)=\sin^{-1}(\sin x)+\cos^{-1}(\cos x)$ is`, R`$[0,\pi]$`, [R`$[0,2\pi]$`, R`$\left[-\dfrac\pi2,\pi\right]$`, R`$\left\{\dfrac\pi2\right\}$`],
    R`<p>On $[0,2\pi]$: for $x\in\left[0,\dfrac\pi2\right]$, $f=2x\in[0,\pi]$; for $\left[\dfrac\pi2,\pi\right]$, $f=(\pi-x)+x=\pi$; for $\left[\pi,\dfrac{3\pi}2\right]$, $f=(\pi-x)+(2\pi-x)=3\pi-2x\in[0,\pi]$; for $\left[\dfrac{3\pi}2,2\pi\right]$, $f=(x-2\pi)+(2\pi-x)=0$. The function repeats with period $2\pi$, so the range is $[0,\pi]$.</p>`, 'Check each of the four pieces.'),
  I(5, 'telescoping sums', R`Find $\displaystyle\sum_{r=1}^{\infty}\tan^{-1}\dfrac2{r^2}$ in degrees.`, 135,
    R`<p>For $r\ge2$: $\tan^{-1}\dfrac1{r-1}-\tan^{-1}\dfrac1{r+1}=\tan^{-1}\dfrac{\frac1{r-1}-\frac1{r+1}}{1+\frac1{r^2-1}}=\tan^{-1}\dfrac2{r^2}$. Summing $r=2$ to $n$ telescopes to $\tan^{-1}1+\tan^{-1}\dfrac12-\tan^{-1}\dfrac1{n}-\tan^{-1}\dfrac1{n+1}$, which tends to $\tan^{-1}1+\tan^{-1}\dfrac12=45^\circ+26.57^\circ=71.57^\circ$. The $r=1$ term is $\tan^{-1}2=63.43^\circ$. Total $=63.43^\circ+71.57^\circ=135^\circ$.</p>`, 'The $r=1$ term is separate, since $\\dfrac1{r-1}$ fails.', { calc: () => { let s = 0; for (let r = 1; r <= 2000000; r++) s += atan(2 / (r * r)); return Math.round(deg(s)); } }),
  I(4, 'telescoping sums', R`Find $\displaystyle\sum_{r=1}^{\infty}\tan^{-1}\dfrac1{2r^2}$ in degrees.`, 45,
    R`<p>$\dfrac1{2r^2}=\dfrac{2}{4r^2}=\dfrac{(2r+1)-(2r-1)}{1+(2r+1)(2r-1)}$, so $\tan^{-1}\dfrac1{2r^2}=\tan^{-1}(2r+1)-\tan^{-1}(2r-1)$. The sum to $n$ terms is $\tan^{-1}(2n+1)-\tan^{-1}1\to\dfrac\pi2-\dfrac\pi4=\dfrac\pi4=45^\circ$.</p>`, '', { calc: () => { let s = 0; for (let r = 1; r <= 2000000; r++) s += atan(1 / (2 * r * r)); return Math.round(deg(s)); } }),
  D(4, 'telescoping sums', R`Find $\displaystyle\sum_{r=1}^{3}\tan^{-1}\dfrac{2r}{2+r^2+r^4}$ in degrees.`, 40.6013,
    R`<p>Check that $\tan^{-1}\dfrac{2r}{2+r^2+r^4}=\tan^{-1}(r^2+r+1)-\tan^{-1}(r^2-r+1)$: the difference formula gives $\dfrac{2r}{1+(r^2+r+1)(r^2-r+1)}=\dfrac{2r}{r^4+r^2+2}$. The sum telescopes: $\tan^{-1}(n^2+n+1)-\tan^{-1}1$. For $n=3$: $\tan^{-1}13-45^\circ=85.60^\circ-45^\circ=40.60^\circ$.</p>`, 'Note $(r^2+r+1)(r^2-r+1)=r^4+r^2+1$.', { calc: () => { let s = 0; for (let r = 1; r <= 3; r++) s += atan((2 * r) / (2 + r * r + r ** 4)); return deg(s); } }),
  M(4, 'properties', R`If $x,y>0$ and $\sin^{-1}x+\sin^{-1}y=\dfrac\pi2$, then $x^2+y^2$ equals`, R`$1$`, [R`$\dfrac12$`, R`$2$`, R`$xy$`],
    R`<p>$\sin^{-1}y=\dfrac\pi2-\sin^{-1}x=\cos^{-1}x$. So $y=\sin(\cos^{-1}x)=\sqrt{1-x^2}$, and $x^2+y^2=1$.</p>`, ''),
  M(4, 'properties', R`If $\cos^{-1}x+\cos^{-1}y=\pi$, then`, R`$x+y=0$`, [R`$x=y$`, R`$xy=1$`, R`$x^2+y^2=1$`],
    R`<p>$\cos^{-1}y=\pi-\cos^{-1}x=\cos^{-1}(-x)$. Since $\cos^{-1}$ is one-to-one, $y=-x$.</p>`, ''),
  D(4, 'extreme values', R`The least value of $(\sin^{-1}x)^2+(\cos^{-1}x)^2$ is $k\pi^2$. Find $k$.`, 0.125,
    R`<p>With $s=\sin^{-1}x\in\left[-\dfrac\pi2,\dfrac\pi2\right]$, the expression is $s^2+\left(\dfrac\pi2-s\right)^2=2s^2-\pi s+\dfrac{\pi^2}4$. The vertex is at $s=\dfrac\pi4$ (inside the range), giving $\dfrac{\pi^2}8$. So $k=\dfrac18=0.125$.</p>`, 'Check the vertex lies in the allowed range.', { calc: () => { let m = 1e9; for (let s = -PI_ / 2; s <= PI_ / 2; s += 1e-4) m = Math.min(m, s * s + (PI_ / 2 - s) ** 2); return m / (PI_ * PI_); } }),
  D(5, 'extreme values', R`The greatest value of $(\sin^{-1}x)^2+(\cos^{-1}x)^2$ is $k\pi^2$. Find $k$.`, 1.25,
    R`<p>The expression $2s^2-\pi s+\dfrac{\pi^2}4$ is a parabola opening upwards, so on $\left[-\dfrac\pi2,\dfrac\pi2\right]$ the maximum is at an end point. $s=-\dfrac\pi2$: $\dfrac{\pi^2}4+\pi^2=\dfrac{5\pi^2}4$. $s=\dfrac\pi2$: $\dfrac{\pi^2}4+0$. The larger is $\dfrac{5\pi^2}4$, so $k=1.25$.</p>`, 'Compare both end points.', { calc: () => { let m = -1e9; for (let s = -PI_ / 2; s <= PI_ / 2; s += 1e-4) m = Math.max(m, s * s + (PI_ / 2 - s) ** 2); return m / (PI_ * PI_); } }),
  M(4, 'properties', R`If $x,y>0$ and $\tan^{-1}x+\tan^{-1}y=\dfrac\pi2$, then`, R`$xy=1$`, [R`$x+y=1$`, R`$x=y$`, R`$x^2+y^2=1$`],
    R`<p>$\tan^{-1}y=\dfrac\pi2-\tan^{-1}x=\cot^{-1}x=\tan^{-1}\dfrac1x$ (for $x>0$). So $y=\dfrac1x$ and $xy=1$.</p>`, ''),
  I(4, 'equations', R`Solve $\tan^{-1}(x+2)+\tan^{-1}(x-2)=\tan^{-1}\dfrac12$ for $x$.`, 1,
    R`<p>Taking tangents: $\dfrac{2x}{1-(x^2-4)}=\dfrac{2x}{5-x^2}=\dfrac12$, so $x^2+4x-5=0$ and $x=1$ or $-5$. For $x=-5$: $\tan^{-1}(-3)+\tan^{-1}(-7)\approx-153^\circ\ne26.6^\circ$, rejected. For $x=1$: $\tan^{-1}3+\tan^{-1}(-1)=71.57^\circ-45^\circ=26.57^\circ=\tan^{-1}\dfrac12$ ✓.</p>`, 'Check each root; the tangent step is not reversible.', { calc: () => { let r = null; for (const x of [1, -5]) if (abs(atan(x + 2) + atan(x - 2) - atan(0.5)) < 1e-9) r = x; return r; } }),
  I(4, 'sums', R`Find $\tan^{-1}\dfrac13+\tan^{-1}\dfrac15+\tan^{-1}\dfrac17+\tan^{-1}\dfrac18$ in degrees.`, 45,
    R`<p>Pair them: $\tan^{-1}\dfrac13+\tan^{-1}\dfrac15=\tan^{-1}\dfrac{8/15}{14/15}=\tan^{-1}\dfrac47$ and $\tan^{-1}\dfrac17+\tan^{-1}\dfrac18=\tan^{-1}\dfrac{15/56}{55/56}=\tan^{-1}\dfrac3{11}$. Then $\tan^{-1}\dfrac47+\tan^{-1}\dfrac3{11}=\tan^{-1}\dfrac{(44+21)/77}{(77-12)/77}=\tan^{-1}1=45^\circ$ (all products are below $1$, so no correction is needed).</p>`, 'Check $xy<1$ at every step.', { calc: () => Math.round(deg(atan(1 / 3) + atan(1 / 5) + atan(1 / 7) + atan(1 / 8))) }),
  I(4, 'mixed', R`How many real solutions does $\sin(2\sin^{-1}x)=x$ have?`, 3,
    R`<p>$\sin(2\sin^{-1}x)=2x\sqrt{1-x^2}$ (for $x\in[-1,1]$, since $\cos(\sin^{-1}x)=\sqrt{1-x^2}$). So $2x\sqrt{1-x^2}=x$: $x=0$ or $\sqrt{1-x^2}=\dfrac12$, i.e. $x=\pm\dfrac{\sqrt3}2$. Check $x=-\dfrac{\sqrt3}2$: $\sin\left(-\dfrac{2\pi}3\right)=-\dfrac{\sqrt3}2$ ✓. Three solutions.</p>`, 'Do not divide by $x$ and lose the root $0$.', { calc: () => { let c = 0; for (const x of [0, sqrt(3) / 2, -sqrt(3) / 2]) if (abs(sin(2 * asin(x)) - x) < 1e-9) c++; return c; } }),
  I(4, 'equations', R`If $\tan^{-1}x+\tan^{-1}(2x)+\tan^{-1}(3x)=\pi$ for a positive $x$, find $x$.`, 1,
    R`<p>If three angles add to $\pi$, their tangents satisfy $\tan A+\tan B+\tan C=\tan A\tan B\tan C$. So $6x=6x^3$, $x=1$ (positive). Check: $45^\circ+63.43^\circ+71.57^\circ=180^\circ$.</p>`, ''),
  N(5, 'properties', R`If $\cos^{-1}x+\cos^{-1}y=\dfrac\pi3$ then $x^2-xy+y^2$ equals what number? (2 decimal places)`, 0.75, 0.01,
    R`<p>Let $\alpha=\cos^{-1}x$, $\beta=\cos^{-1}y$ with $\alpha+\beta=\dfrac\pi3$. $\cos(\alpha+\beta)=xy-\sqrt{(1-x^2)(1-y^2)}=\dfrac12$. So $\sqrt{(1-x^2)(1-y^2)}=xy-\dfrac12$; squaring: $1-x^2-y^2+x^2y^2=x^2y^2-xy+\dfrac14$, giving $x^2-xy+y^2=\dfrac34$. Check with $x=\dfrac12$, $y=1$: $\dfrac14-\dfrac12+1=\dfrac34$.</p>`, 'Isolate the square root before squaring.', { calc: () => 0.25 - 0.5 + 1 }),
  M(5, 'ranges', R`The range of $f(x)=\sec^{-1}x-\operatorname{cosec}^{-1}x$ (for $|x|\ge1$) is`, R`$\left[-\dfrac\pi2,\dfrac{3\pi}2\right]\setminus\left\{\dfrac\pi2\right\}$`, [R`$\left[-\dfrac\pi2,\dfrac{3\pi}2\right]$`, R`$\left[0,\pi\right]\setminus\left\{\dfrac\pi2\right\}$`, R`$\left[-\dfrac\pi2,\dfrac\pi2\right]$`],
    R`<p>$\sec^{-1}x=\dfrac\pi2-\operatorname{cosec}^{-1}x$. So $f=\dfrac\pi2-2c$ where $c=\operatorname{cosec}^{-1}x\in\left[-\dfrac\pi2,0\right)\cup\left(0,\dfrac\pi2\right]$. Then $f$ ranges over $\left[-\dfrac\pi2,\dfrac{3\pi}2\right]$ except the value for $c=0$, which is $\dfrac\pi2$.</p>`, '$c=0$ is excluded, so $\\dfrac\\pi2$ is missing.'),
  M(4, 'ranges', R`The range of $f(x)=\cot^{-1}(x^2+1)$ is`, R`$\left(0,\dfrac\pi4\right]$`, [R`$\left(0,\dfrac\pi2\right)$`, R`$\left[\dfrac\pi4,\dfrac\pi2\right)$`, R`$\left(0,\dfrac\pi4\right)$`],
    R`<p>$x^2+1\ge1$ takes all values in $[1,\infty)$. $\cot^{-1}$ is decreasing, with $\cot^{-1}1=\dfrac\pi4$ and limit $0$ at infinity. So $f$ takes values in $\left(0,\dfrac\pi4\right]$.</p>`, 'The maximum $\\dfrac\\pi4$ is attained at $x=0$.'),
  M(3, 'ranges', R`The range of $f(x)=\sin^{-1}x+\cos^{-1}x+\tan^{-1}x$ on $[-1,1]$ is`, R`$\left[\dfrac\pi4,\dfrac{3\pi}4\right]$`, [R`$\left[-\dfrac\pi4,\dfrac\pi4\right]$`, R`$\left\{\dfrac\pi2\right\}$`, R`$\left[0,\dfrac\pi2\right]$`],
    R`<p>$\sin^{-1}x+\cos^{-1}x=\dfrac\pi2$, so $f=\dfrac\pi2+\tan^{-1}x$. With $\tan^{-1}x\in\left[-\dfrac\pi4,\dfrac\pi4\right]$ on $[-1,1]$, the range is $\left[\dfrac\pi4,\dfrac{3\pi}4\right]$.</p>`, ''),
  M(3, 'domains', R`The domain of $\sin^{-1}(\log_2x)$ is`, R`$\left[\dfrac12,2\right]$`, [R`$[-1,1]$`, R`$\left[0,2\right]$`, R`$(0,2]$`],
    R`<p>Need $-1\le\log_2x\le1$, so $2^{-1}\le x\le2^1$: $x\in\left[\dfrac12,2\right]$.</p>`, 'Exponentiate, do not just copy $[-1,1]$.'),
  M(4, 'inverse function', R`Let $f(x)=\sin x$ on $\left[-\dfrac\pi2,\dfrac\pi2\right]$, so that $f^{-1}=\sin^{-1}$. The value of $f^{-1}\left(\sin\dfrac{2\pi}3\right)$ is`, R`$\dfrac\pi3$`, [R`$\dfrac{2\pi}3$`, R`$\dfrac{4\pi}3$`, R`$-\dfrac\pi3$`],
    R`<p>$\sin\dfrac{2\pi}3=\dfrac{\sqrt3}2$. The inverse returns the unique angle in $\left[-\dfrac\pi2,\dfrac\pi2\right]$ with this sine, namely $\dfrac\pi3$. The angle $\dfrac{2\pi}3$ is not in the domain of $f$, so it cannot be an output.</p>`, 'The inverse returns only principal values.'),
  A(4, 'principal values', R`$\cos^{-1}x+\cos^{-1}(-x)=\pi$ for every $x\in[-1,1]$.`, R`$\cos^{-1}(-x)=\pi-\cos^{-1}x$.`, 0,
    R`<p>R rearranged is A. Both true, R explains A.</p>`, ''),
  A(5, 'ranges', R`The equation $\tan^{-1}x=\dfrac{3\pi}4$ has no real solution.`, R`The range of $\tan^{-1}$ is $\left(-\dfrac\pi2,\dfrac\pi2\right)$.`, 0,
    R`<p>$\dfrac{3\pi}4$ is outside the range of $\tan^{-1}$, so no real $x$ satisfies the equation. R explains A. (Do not confuse with $\tan x=-1$ at $x=\dfrac{3\pi}4$.)</p>`, ''),
  S(5, 'sums', R`$\tan^{-1}\dfrac12+\tan^{-1}\dfrac13+\tan^{-1}\dfrac17=\dfrac\pi2$.`, R`$\tan^{-1}\dfrac12+\tan^{-1}\dfrac13=\dfrac\pi4$.`, 2,
    R`<p>II is true. For I: $\dfrac\pi4+\tan^{-1}\dfrac17$ is less than $\dfrac\pi2$, since $\tan^{-1}\dfrac17\approx8.13^\circ$: the sum is about $53.13^\circ$. So I is false.</p>`, 'Add the angles in degrees to test.'),
  X(5, 'graphs', R`Let $g(x)=\cos^{-1}(\cos x)$ for real $x$. Which of the following are true?`, [R`$g$ is periodic with period $2\pi$`, R`$g$ is an even function`, R`$g(5)=2\pi-5$`, R`the range of $g$ is $[0,2\pi]$`], [0, 1, 2],
    R`<p>$g$ has period $2\pi$; $\cos(-x)=\cos x$ so $g(-x)=g(x)$ (even); for $x=5\in(\pi,2\pi)$, $g=2\pi-5$; the range is $[0,\pi]$, not $[0,2\pi]$.</p>`, ''),
  I(5, 'graphs', R`How many solutions does $\cos^{-1}(\cos x)=\dfrac{|x|}3$ have for real $x$?`, 5,
    R`<p>$g(x)=\cos^{-1}(\cos x)$ is a zig-zag with range $[0,\pi]$; it equals $|x|$ for $|x|\le\pi$ and $2\pi-|x|$ for $\pi\le|x|\le2\pi$, etc. $\dfrac{|x|}3\le\pi$ needs $|x|\le3\pi$. For $x\ge0$: on $[0,\pi]$: $x=\dfrac x3$ gives $x=0$. On $[\pi,2\pi]$: $2\pi-x=\dfrac x3$ gives $x=\dfrac{3\pi}2$ (valid). On $[2\pi,3\pi]$: $x-2\pi=\dfrac x3$ gives $x=3\pi$ (valid, end of the range). So positive solutions: $\dfrac{3\pi}2,3\pi$; negative by symmetry; plus $x=0$. Total $5$.</p>`, 'Check the end point $x=3\\pi$.', { calc: () => { const f = (x) => acos(cos(x)) - abs(x) / 3; return zeros(f, -10.2, 10.2) + [0, 3 * PI_, -3 * PI_].filter((x) => abs(f(x)) < 1e-9).length; } }),
];
const t4 = (x) => String(+x.toFixed(4));
const sum = (a) => a.reduce((s, x) => s + x, 0);

items.forEach((it, i) => { it.id = `it-${String(i + 1).padStart(3, '0')}`; });

// ---------- number templates ----------
/** k pi/12 as TeX (k an integer) */
const ktex = (k) => {
  if (k === 0) return '0';
  const g_ = gcd(abs(k), 12), n = abs(k) / g_, d = 12 / g_, sg = k < 0 ? '-' : '';
  return d === 1 ? `${sg}${n === 1 ? '' : n}\\pi` : `${sg}\\dfrac{${n === 1 ? '' : n}\\pi}{${d}}`;
};
const S3 = sqrt(3), S2 = sqrt(2);
// [function, argument TeX, numeric argument, principal value as a multiple of pi/12]
const PV = [
  ['sin', '\\dfrac12', 0.5, 2], ['sin', '\\dfrac1{\\sqrt2}', 1 / S2, 3], ['sin', '\\dfrac{\\sqrt3}2', S3 / 2, 4], ['sin', '1', 1, 6], ['sin', '0', 0, 0],
  ['sin', '-\\dfrac12', -0.5, -2], ['sin', '-\\dfrac1{\\sqrt2}', -1 / S2, -3], ['sin', '-\\dfrac{\\sqrt3}2', -S3 / 2, -4], ['sin', '-1', -1, -6],
  ['cos', '\\dfrac12', 0.5, 4], ['cos', '\\dfrac1{\\sqrt2}', 1 / S2, 3], ['cos', '\\dfrac{\\sqrt3}2', S3 / 2, 2], ['cos', '0', 0, 6], ['cos', '1', 1, 0],
  ['cos', '-\\dfrac12', -0.5, 8], ['cos', '-\\dfrac1{\\sqrt2}', -1 / S2, 9], ['cos', '-\\dfrac{\\sqrt3}2', -S3 / 2, 10], ['cos', '-1', -1, 12],
  ['tan', '1', 1, 3], ['tan', '\\sqrt3', S3, 4], ['tan', '\\dfrac1{\\sqrt3}', 1 / S3, 2], ['tan', '-1', -1, -3], ['tan', '-\\sqrt3', -S3, -4], ['tan', '-\\dfrac1{\\sqrt3}', -1 / S3, -2], ['tan', '0', 0, 0],
  ['cot', '1', 1, 3], ['cot', '\\sqrt3', S3, 2], ['cot', '\\dfrac1{\\sqrt3}', 1 / S3, 4], ['cot', '-1', -1, 9], ['cot', '-\\sqrt3', -S3, 10], ['cot', '-\\dfrac1{\\sqrt3}', -1 / S3, 8], ['cot', '0', 0, 6],
  ['sec', '2', 2, 4], ['sec', '\\sqrt2', S2, 3], ['sec', '\\dfrac2{\\sqrt3}', 2 / S3, 2], ['sec', '-2', -2, 8], ['sec', '-\\sqrt2', -S2, 9],
  ['cosec', '2', 2, 2], ['cosec', '\\sqrt2', S2, 3], ['cosec', '\\dfrac2{\\sqrt3}', 2 / S3, 4], ['cosec', '-2', -2, -2], ['cosec', '-\\sqrt2', -S2, -3], ['cosec', '-\\dfrac2{\\sqrt3}', -2 / S3, -4],
];
const invNum = (f, v) => f === 'sin' ? asin(v) : f === 'cos' ? acos(v) : f === 'tan' ? atan(v) : f === 'cot' ? (v > 0 ? atan(1 / v) : v < 0 ? PI_ + atan(1 / v) : PI_ / 2) : f === 'sec' ? acos(1 / v) : asin(1 / v);
const FN = { sin: '\\sin^{-1}', cos: '\\cos^{-1}', tan: '\\tan^{-1}', cot: '\\cot^{-1}', sec: '\\sec^{-1}', cosec: '\\operatorname{cosec}^{-1}' };
const FNAME = { sin: 'sine', cos: 'cosine', tan: 'tangent', cot: 'cotangent', sec: 'secant', cosec: 'cosecant' };
const RNG_OF = { sin: '\\left[-\\dfrac\\pi2,\\dfrac\\pi2\\right]', cos: '[0,\\pi]', tan: '\\left(-\\dfrac\\pi2,\\dfrac\\pi2\\right)', cot: '(0,\\pi)', sec: '[0,\\pi]\\setminus\\left\\{\\dfrac\\pi2\\right\\}', cosec: '\\left[-\\dfrac\\pi2,\\dfrac\\pi2\\right]\\setminus\\{0\\}' };
const wrongK = (k, extra = []) => { const o = []; for (const c of [...extra, 12 - k, -k, 6 - k, k + 12, k - 12, 2 * k, k + 6, k - 6]) if (c !== k && !o.includes(c) && o.length < 3) o.push(c); return o; };
const cf = (c) => (c === 1 ? '' : c === -1 ? '-' : String(c));
const uniqD = (xs, tol = 1e-7) => { const o = []; for (const x of [...xs].sort((p, q) => p - q)) if (!o.length || x - o[o.length - 1] > tol) o.push(x); return o; };
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
/** a simple fraction n/d as TeX */
const fq = (n, d) => { const g_ = gcd(abs(n), d); n /= g_; d /= g_; return d === 1 ? `${n}` : `${n < 0 ? '-' : ''}\\dfrac{${abs(n)}}{${d}}`; };

const gens = [
  gen('it-g01', 1, 'mcq', 'single', 'principal values', (rng) => {
    const ei = int(rng, 0, PV.length - 1), [f, at, , k] = PV[ei];
    const { options, answer } = shuffleOpts(rng, `$${ktex(k)}$`, wrongK(k).map((q) => `$${ktex(q)}$`));
    return { ei, options, answer, q: `The principal value of $${FN[f]}\\left(${at}\\right)$ is`,
      sol: `<p>The principal range of $${FN[f]}$ is $${RNG_OF[f]}$. The angle in that range whose ${FNAME[f]} is ${'$' + at + '$'} is $${ktex(k)}$. Other angles with the same ${FNAME[f]} lie outside the range.</p>` };
  }, (p) => { const [f, , v, k] = PV[p.ei]; return abs(invNum(f, v) - (k * PI_) / 12) < 1e-9 ? p.answer : -1; }),

  gen('it-g02', 2, 'nat', 'integer', 'principal values', (rng) => {
    const e = [int(rng, 0, PV.length - 1), int(rng, 0, PV.length - 1), int(rng, 0, PV.length - 1)];
    const ks = e.map((i) => PV[i][3]), answer = sum(ks) * 15;
    return { e, answer, tol: 0,
      q: `Find $${e.map((i, j) => (j ? '+' : '') + FN[PV[i][0]] + '\\left(' + PV[i][1] + '\\right)').join('')}$ in degrees (principal values).`,
      sol: `<p>The principal values in degrees are ${e.map((i) => `$${PV[i][3] * 15}^\\circ$`).join(', ')}. Their sum is $${answer}^\\circ$.</p>` };
  }, (p) => Math.round(deg(sum(p.e.map((i) => invNum(PV[i][0], PV[i][2])))))),

  gen('it-g03', 2, 'mcq', 'single', 'simplification', (rng) => {
    const fn = choose(rng, ['sin', 'cos', 'tan']); let k;
    do { k = int(rng, -24, 24); } while (fn === 'tan' && abs(k) % 12 === 6);
    let r;
    if (fn === 'sin') { let m = ((k % 24) + 24) % 24; if (m > 12) m -= 24; if (m > 6) m = 12 - m; if (m < -6) m = -12 - m; r = m; }
    else if (fn === 'cos') { const m = ((k % 24) + 24) % 24; r = m > 12 ? 24 - m : m; }
    else { const m = ((k % 12) + 12) % 12; r = m > 6 ? m - 12 : m; }
    const { options, answer } = shuffleOpts(rng, `$${ktex(r)}$`, wrongK(r, [k]).map((q) => `$${ktex(q)}$`));
    const rangeTxt = fn === 'sin' ? '\\left[-\\dfrac\\pi2,\\dfrac\\pi2\\right]' : fn === 'cos' ? '[0,\\pi]' : '\\left(-\\dfrac\\pi2,\\dfrac\\pi2\\right)';
    return { fn, k, r, options, answer, q: `$${FN[fn]}\\left(\\${fn}\\,${ktex(k)}\\right)$ equals`,
      sol: `<p>$${FN[fn]}(\\${fn}\\theta)$ returns the angle in $${rangeTxt}$ that has the same ${FNAME[fn]} as $\\theta$. Here $\\theta=${ktex(k)}$ is first reduced into that range, which gives $${ktex(r)}$.</p>` };
  }, (p) => { const t = (p.k * PI_) / 12; const v = p.fn === 'sin' ? asin(sin(t)) : p.fn === 'cos' ? acos(cos(t)) : atan(tan(t)); return abs(v - (p.r * PI_) / 12) < 1e-9 ? p.answer : -1; }),

  gen('it-g04', 2, 'nat', 'numeric', 'simplification', (rng) => {
    const fn = choose(rng, ['sin', 'cos', 'tan']), n = int(rng, 2, 12), t = n;
    let ans, how;
    if (fn === 'sin') {
      const m = ((t + PI_ / 2) % (2 * PI_) + 2 * PI_) % (2 * PI_); // 0..2pi: shift so principal branch is [0,pi)
      ans = m < PI_ ? m - PI_ / 2 : (3 * PI_) / 2 - m; how = 'the zig-zag of $\\sin^{-1}(\\sin x)$ (slope $+1$ on $[-\\frac\\pi2,\\frac\\pi2]$, slope $-1$ on $[\\frac\\pi2,\\frac{3\\pi}2]$, repeating)';
    } else if (fn === 'cos') {
      const m = ((t % (2 * PI_)) + 2 * PI_) % (2 * PI_); ans = m <= PI_ ? m : 2 * PI_ - m; how = 'the zig-zag of $\\cos^{-1}(\\cos x)$ (equal to $x$ on $[0,\\pi]$, then $2\\pi-x$, repeating)';
    } else { ans = t - PI_ * Math.round(t / PI_); how = 'the period $\\pi$ of tangent: subtract the multiple of $\\pi$ that lands in $\\left(-\\frac\\pi2,\\frac\\pi2\\right)$'; }
    const answer = r2(ans);
    return { fn, n, answer, tol: 0.01, q: `Find $${FN[fn]}(\\${fn}\\,${n})$, where $${n}$ is in radians. (2 decimal places)`,
      sol: `<p>Use ${how}. With $x=${n}$ rad ($\\pi\\approx3.1416$) the value is $${answer}$.</p>` };
  }, (p) => { const t = p.n; return p.fn === 'sin' ? asin(sin(t)) : p.fn === 'cos' ? acos(cos(t)) : atan(tan(t)); }),

  gen('it-g05', 2, 'nat', 'numeric', 'values', (rng) => {
    const [a, b, c] = choose(rng, TRI), v = int(rng, 0, 4), sw = choose(rng, [0, 1]);
    const p_ = sw ? b : a, q_ = sw ? a : b; // p_/c as the ratio, other leg q_
    if (v === 0) return { a, b, c, v, sw, answer: r4(q_ / c), tol: 0.0005, q: `Find $\\sin\\left(\\cos^{-1}\\dfrac{${p_}}{${c}}\\right)$. (4 decimal places)`, sol: `<p>Let $\\theta=\\cos^{-1}\\dfrac{${p_}}{${c}}$, an angle in $[0,\\pi]$ with $\\cos\\theta=\\dfrac{${p_}}{${c}}$. Then $\\sin\\theta=\\sqrt{1-\\dfrac{${p_ * p_}}{${c * c}}}=\\dfrac{${q_}}{${c}}\\approx${r4(q_ / c)}$ (positive, since $\\theta\\in[0,\\pi]$).</p>` };
    if (v === 1) return { a, b, c, v, sw, answer: r4(q_ / c), tol: 0.0005, q: `Find $\\cos\\left(\\sin^{-1}\\dfrac{${p_}}{${c}}\\right)$. (4 decimal places)`, sol: `<p>Let $\\theta=\\sin^{-1}\\dfrac{${p_}}{${c}}\\in\\left[-\\dfrac\\pi2,\\dfrac\\pi2\\right]$. Then $\\cos\\theta=\\sqrt{1-\\dfrac{${p_ * p_}}{${c * c}}}=\\dfrac{${q_}}{${c}}\\approx${r4(q_ / c)}$ (positive in this range).</p>` };
    if (v === 2) return { a, b, c, v, sw, answer: r4(p_ / q_), tol: 0.0005, q: `Find $\\tan\\left(\\sin^{-1}\\dfrac{${p_}}{${c}}\\right)$. (4 decimal places)`, sol: `<p>Right triangle: opposite $${p_}$, hypotenuse $${c}$, so adjacent $=\\sqrt{${c * c}-${p_ * p_}}=${q_}$. $\\tan\\theta=\\dfrac{${p_}}{${q_}}\\approx${r4(p_ / q_)}$.</p>` };
    if (v === 3) return { a, b, c, v, sw, answer: r4(p_ / c), tol: 0.0005, q: `Find $\\sin\\left(\\tan^{-1}\\dfrac{${p_}}{${q_}}\\right)$. (4 decimal places)`, sol: `<p>Right triangle with opposite $${p_}$ and adjacent $${q_}$: hypotenuse $=${c}$. $\\sin\\theta=\\dfrac{${p_}}{${c}}\\approx${r4(p_ / c)}$.</p>` };
    return { a, b, c, v, sw, answer: r4(p_ / q_), tol: 0.0005, q: `Find $\\tan\\left(\\cos^{-1}\\dfrac{${q_}}{${c}}\\right)$. (4 decimal places)`, sol: `<p>Right triangle with adjacent $${q_}$ and hypotenuse $${c}$: opposite $=${p_}$. $\\tan\\theta=\\dfrac{${p_}}{${q_}}\\approx${r4(p_ / q_)}$.</p>` };
  }, (p) => { const p_ = p.sw ? p.b : p.a, q_ = p.sw ? p.a : p.b; return [sin(acos(p_ / p.c)), cos(asin(p_ / p.c)), tan(asin(p_ / p.c)), sin(atan(p_ / q_)), tan(acos(q_ / p.c))][p.v]; }),

  gen('it-g06', 3, 'nat', 'numeric', 'double angle', (rng) => {
    const [a, b, c] = choose(rng, TRI), v = int(rng, 0, 3);
    if (v === 0) { const val = (2 * a * b) / (c * c); return { a, b, c, v, answer: r4(val), tol: 0.0005, q: `Find $\\sin\\left(2\\sin^{-1}\\dfrac{${a}}{${c}}\\right)$. (4 decimal places)`, sol: `<p>$\\sin2\\theta=2\\sin\\theta\\cos\\theta$ with $\\sin\\theta=\\dfrac{${a}}{${c}}$ and $\\cos\\theta=\\dfrac{${b}}{${c}}$. So $2\\cdot\\dfrac{${a}}{${c}}\\cdot\\dfrac{${b}}{${c}}=\\dfrac{${2 * a * b}}{${c * c}}\\approx${r4(val)}$.</p>` }; }
    if (v === 1) { const val = (b * b - a * a) / (c * c); return { a, b, c, v, answer: r4(val), tol: 0.0005, q: `Find $\\cos\\left(2\\sin^{-1}\\dfrac{${a}}{${c}}\\right)$. (4 decimal places)`, sol: `<p>$\\cos2\\theta=1-2\\sin^2\\theta=1-\\dfrac{${2 * a * a}}{${c * c}}=\\dfrac{${c * c - 2 * a * a}}{${c * c}}\\approx${r4(val)}$.</p>` }; }
    if (v === 2) { const val = (2 * a * b) / (b * b - a * a); return { a, b, c, v, answer: r4(val), tol: 0.0005, q: `Find $\\tan\\left(2\\tan^{-1}\\dfrac{${a}}{${b}}\\right)$. (4 decimal places)`, sol: `<p>$\\tan2\\theta=\\dfrac{2t}{1-t^2}$ with $t=\\dfrac{${a}}{${b}}$: $\\dfrac{2\\cdot${a}\\cdot${b}}{${b * b}-${a * a}}=\\dfrac{${2 * a * b}}{${b * b - a * a}}\\approx${r4(val)}$. (Valid here since $\\tan^{-1}t<\\dfrac\\pi4$ is not needed: the formula is an identity for $\\tan$ of the doubled angle.)</p>` }; }
    const val = (a * a - b * b) / (c * c); return { a, b, c, v, answer: r4(val), tol: 0.0005, q: `Find $\\cos\\left(2\\cos^{-1}\\dfrac{${a}}{${c}}\\right)$. (4 decimal places)`, sol: `<p>$\\cos2\\theta=2\\cos^2\\theta-1=\\dfrac{${2 * a * a}}{${c * c}}-1=\\dfrac{${2 * a * a - c * c}}{${c * c}}\\approx${r4(val)}$.</p>` };
  }, (p) => [sin(2 * asin(p.a / p.c)), cos(2 * asin(p.a / p.c)), tan(2 * atan(p.a / p.b)), cos(2 * acos(p.a / p.c))][p.v]),

  gen('it-g07', 3, 'nat', 'numeric', 'sums', (rng) => {
    const xs = [[1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [4, 5], [1, 4], [3, 2], [5, 1], [2, 1], [3, 1], [5, 2], [7, 3]];
    const [xn, xd] = choose(rng, xs), [yn, yd] = choose(rng, xs), sx = choose(rng, [1, 1, -1]), sy = sx;
    const x = (sx * xn) / xd, y = (sy * yn) / yd, prod = x * y;
    let ans = atan((x + y) / (1 - prod)); let note;
    if (abs(prod - 1) < 1e-12) { return { xn, xd, yn, yd, sx, answer: sx > 0 ? 90 : -90, tol: 0.01, q: `Find $\\tan^{-1}(${fq(sx * xn, xd)})+\\tan^{-1}(${fq(sy * yn, yd)})$ in degrees. (2 decimal places)`, sol: `<p>Here $xy=1$, so the two angles are complementary: the sum is $${sx > 0 ? 90 : -90}^\\circ$.</p>` }; }
    if (prod > 1 && x > 0) { ans += PI_; note = 'Since $xy>1$ and $x,y>0$, add $\\pi$ ($180^\\circ$).'; } else if (prod > 1 && x < 0) { ans -= PI_; note = 'Since $xy>1$ and $x,y<0$, subtract $\\pi$ ($180^\\circ$).'; } else note = 'Since $xy<1$ the plain formula holds.';
    const answer = r2(deg(ans));
    return { xn, xd, yn, yd, sx, answer, tol: 0.01, q: `Find $\\tan^{-1}(${fq(sx * xn, xd)})+\\tan^{-1}(${fq(sy * yn, yd)})$ in degrees. (2 decimal places)`,
      sol: `<p>$xy=${t4(prod)}$. ${note} $\\tan^{-1}\\dfrac{x+y}{1-xy}$ with $x+y=${t4(x + y)}$ and $1-xy=${t4(1 - prod)}$ gives the adjusted total $${answer}^\\circ$.</p>` };
  }, (p) => { const x = (p.sx * p.xn) / p.xd, y = (p.sx * p.yn) / p.yd; return deg(atan(x) + atan(y)); }),

  gen('it-g08', 3, 'nat', 'numeric', 'equations', (rng) => {
    const a = int(rng, 1, 5), b = int(rng, 1, 5), ab = a * b, s = a + b;
    const x = (-s + sqrt(s * s + 4 * ab)) / (2 * ab), answer = r4(x);
    return { a, b, answer, tol: 0.0005, q: `Solve $\\tan^{-1}(${a === 1 ? '' : a}x)+\\tan^{-1}(${b === 1 ? '' : b}x)=\\dfrac\\pi4$ for $x>0$. (4 decimal places)`,
      sol: `<p>Take tangent: $\\dfrac{${s}x}{1-${ab}x^2}=1$, so $${ab}x^2+${s}x-1=0$ and $x=\\dfrac{-${s}+\\sqrt{${s * s + 4 * ab}}}{${2 * ab}}\\approx${answer}$. The other root is negative and is rejected (both terms would be negative). For the positive root $${ab}x^2<1$, so the formula used is valid.</p>` };
  }, (p) => { let lo = 0, hi = 1; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (atan(p.a * m) + atan(p.b * m) < PI_ / 4) lo = m; else hi = m; } return (lo + hi) / 2; }),

  gen('it-g09', 3, 'nat', 'integer', 'domains', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const k = int(rng, 2, 9), c = int(rng, -5, 5); return { v, k, c, answer: 2 * k + 1, tol: 0, q: `How many integers lie in the domain of $\\sin^{-1}\\dfrac{x${c < 0 ? c : `+${c}`}}{${k}}$?`, sol: `<p>Need $-1\\le\\dfrac{x+(${c})}{${k}}\\le1$, so $-${k}\\le x${c < 0 ? c : `+${c}`}\\le${k}$ and $x\\in[${-k - c},${k - c}]$. That interval has $${2 * k + 1}$ integers.</p>` }; }
    if (v === 1) { const m = int(rng, 2, 8); let c = 0; for (let x = -20; x <= 20; x++) { const t = x * x - m; if (t >= -1 && t <= 1) c++; } return { v, m, answer: c, tol: 0, q: `How many integers lie in the domain of $\\cos^{-1}(x^2-${m})$?`, sol: `<p>Need $-1\\le x^2-${m}\\le1$, i.e. $${m - 1}\\le x^2\\le${m + 1}$. Test integers: those with $x^2$ in $[${m - 1},${m + 1}]$ (both signs count). There are $${c}$ of them.</p>` }; }
    const k = int(rng, 2, 6), c = int(rng, 1, k + 1), lo = Math.max(c - 1, -k), hi = Math.min(c + 1, k);
    return { v, k, c, answer: hi - lo + 1, tol: 0, q: `How many integers lie in the domain of $\\cos^{-1}(x-${c})+\\sin^{-1}\\dfrac x${k}$?`, sol: `<p>$\\cos^{-1}(x-${c})$ needs $x\\in[${c - 1},${c + 1}]$. $\\sin^{-1}\\dfrac x${k}$ needs $x\\in[-${k},${k}]$. The common part is $[${lo},${hi}]$, which has $${hi - lo + 1}$ integers.</p>` };
  }, (p) => { let c = 0; for (let x = -40; x <= 40; x++) { const ok = p.v === 0 ? !Number.isNaN(asin((x + p.c) / p.k)) : p.v === 1 ? !Number.isNaN(acos(x * x - p.m)) : !Number.isNaN(acos(x - p.c)) && !Number.isNaN(asin(x / p.k)); if (ok) c++; } return c; }),

  gen('it-g10', 2, 'mcq', 'single', 'domains', (rng) => {
    const a = choose(rng, [2, 3, 4, 5, -2, -3]), b = choose(rng, [-3, -2, -1, 1, 2, 3]);
    const ends = (aa, bb) => { const e = [[-1 - bb, aa], [1 - bb, aa]].map(([n, d]) => (d < 0 ? [-n, -d] : [n, d])); e.sort((p, q) => p[0] / p[1] - q[0] / q[1]); return e; };
    const itv = (e, closed = true) => `$${closed ? '\\left[' : '\\left('}${fq(e[0][0], e[0][1])},${fq(e[1][0], e[1][1])}${closed ? '\\right]' : '\\right)'}$`;
    const right = itv(ends(a, b));
    const wrongs = [itv(ends(a, 0)), itv(ends(a, -b)), `$\\left[${-1 - b},${1 - b}\\right]$`, itv(ends(a, b), false)].filter((w) => w !== right).slice(0, 3);
    const { options, answer } = shuffleOpts(rng, right, wrongs);
    const eq = `${a < 0 ? '-' : ''}${abs(a) === 1 ? '' : abs(a)}x${b < 0 ? b : `+${b}`}`;
    return { a, b, options, answer, q: `The domain of $\\sin^{-1}(${eq})$ is`,
      sol: `<p>Need $-1\\le${eq}\\le1$. Subtract $${b}$: $${-1 - b}\\le${a < 0 ? '-' : ''}${abs(a) === 1 ? '' : abs(a)}x\\le${1 - b}$. Divide by $${a}$${a < 0 ? ' (the inequality signs reverse because $' + a + '<0$)' : ''}: the domain is ${right}.</p>` };
  }, (p) => { const lo = Math.min((-1 - p.b) / p.a, (1 - p.b) / p.a), hi = Math.max((-1 - p.b) / p.a, (1 - p.b) / p.a); for (let i = -60; i <= 60; i++) { const x = i / 8; const ok = !Number.isNaN(asin(p.a * x + p.b)); if (ok !== (x >= lo - 1e-9 && x <= hi + 1e-9)) return -1; } return p.answer; }),

  gen('it-g11', 3, 'nat', 'numeric', 'telescoping sums', (rng) => {
    const v = int(rng, 0, 2), n = int(rng, 3, 12);
    let closed, why, term;
    if (v === 0) { closed = deg(atan(n / (n + 2))); why = `$\\tan^{-1}\\dfrac1{r^2+r+1}=\\tan^{-1}(r+1)-\\tan^{-1}r$, so the sum is $\\tan^{-1}(${n + 1})-\\tan^{-1}1=\\tan^{-1}\\dfrac{${n}}{${n + 2}}$`; term = `\\dfrac1{r^2+r+1}`; }
    else if (v === 1) { closed = deg(atan(n / (n + 1))); why = `$\\tan^{-1}\\dfrac1{2r^2}=\\tan^{-1}(2r+1)-\\tan^{-1}(2r-1)$, so the sum is $\\tan^{-1}(${2 * n + 1})-\\tan^{-1}1=\\tan^{-1}\\dfrac{${n}}{${n + 1}}$`; term = `\\dfrac1{2r^2}`; }
    else { closed = deg(atan(n * n + n + 1)) - 45; why = `$\\tan^{-1}\\dfrac{2r}{2+r^2+r^4}=\\tan^{-1}(r^2+r+1)-\\tan^{-1}(r^2-r+1)$, so the sum is $\\tan^{-1}(${n * n + n + 1})-\\tan^{-1}1$`; term = `\\dfrac{2r}{2+r^2+r^4}`; }
    const answer = r2(closed);
    return { v, n, answer, tol: 0.01, q: `Find $\\displaystyle\\sum_{r=1}^{${n}}\\tan^{-1}${term}$ in degrees. (2 decimal places)`, sol: `<p>${why} $\\approx${answer}^\\circ$.</p>` };
  }, (p) => { let s = 0; for (let r = 1; r <= p.n; r++) s += atan(p.v === 0 ? 1 / (r * r + r + 1) : p.v === 1 ? 1 / (2 * r * r) : (2 * r) / (2 + r * r + r ** 4)); return deg(s); }),

  gen('it-g12', 3, 'nat', 'integer', 'properties', (rng) => {
    const kind = choose(rng, ['sin', 'tan', 'cos']);
    let th, al;
    if (kind === 'sin') { th = choose(rng, [60, 90, 120, 150]); const lo = Math.max(-90, th - 90), hi = Math.min(90, th + 90); al = Math.round((lo + hi) / 2); }
    else if (kind === 'tan') { th = choose(rng, [60, 90, 120, 150]); const lo = Math.max(-89, th - 89), hi = Math.min(89, th + 89); al = Math.round((lo + hi) / 2); }
    else { th = choose(rng, [60, 90, 150, 210, 300]); const lo = Math.max(0, th - 180), hi = Math.min(180, th); al = Math.round((lo + hi) / 2); }
    const answer = 180 - th;
    const tx = { sin: ['\\sin^{-1}', '\\cos^{-1}'], tan: ['\\tan^{-1}', '\\cot^{-1}'], cos: ['\\cos^{-1}', '\\sin^{-1}'] }[kind];
    const rel = kind === 'tan' ? '\\tan^{-1}t+\\cot^{-1}t=\\dfrac\\pi2' : '\\sin^{-1}t+\\cos^{-1}t=\\dfrac\\pi2';
    return { kind, th, al, answer, tol: 0, q: `If $${tx[0]}x+${tx[0]}y=${th}^\\circ$, find $${tx[1]}x+${tx[1]}y$ in degrees.`,
      sol: `<p>Each pair satisfies $${rel}$, i.e. $${tx[1]}t=90^\\circ-${tx[0]}t$. Adding for $x$ and $y$: $${tx[1]}x+${tx[1]}y=180^\\circ-(${tx[0]}x+${tx[0]}y)=180^\\circ-${th}^\\circ=${answer}^\\circ$.</p>` };
  }, (p) => {
    const a = rad(p.al), b = rad(p.th - p.al);
    if (p.kind === 'sin') return Math.round(deg(acos(sin(a)) + acos(sin(b))));
    if (p.kind === 'tan') return Math.round(deg(PI_ / 2 - atan(tan(a)) + PI_ / 2 - atan(tan(b))));
    return Math.round(deg(asin(cos(a)) + asin(cos(b))));
  }),

  gen('it-g13', 4, 'nat', 'numeric', 'equations', (rng) => {
    const k = int(rng, 2, 7), x = 1 / sqrt(1 + k * k), answer = r4(x);
    return { k, answer, tol: 0.0005, q: `Solve $\\sin^{-1}x+\\sin^{-1}(${k}x)=\\dfrac\\pi2$ for $x$. (4 decimal places)`,
      sol: `<p>$\\sin^{-1}(${k}x)=\\dfrac\\pi2-\\sin^{-1}x=\\cos^{-1}x$. Taking sine: $${k}x=\\sqrt{1-x^2}$, so $${k * k}x^2=1-x^2$ and $x^2=\\dfrac1{${k * k + 1}}$. The root must be positive (since $${k}x\\ge0$), so $x=\\dfrac1{\\sqrt{${k * k + 1}}}\\approx${answer}$. Check: $${k}x=${r4(k * x)}\\le1$.</p>` };
  }, (p) => { let lo = 0, hi = 1 / p.k; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (asin(m) + asin(p.k * m) < PI_ / 2) lo = m; else hi = m; } return (lo + hi) / 2; }),

  gen('it-g14', 4, 'nat', 'integer', 'graphs', (rng) => {
    const c = choose(rng, [2, 3, 4, 6, 7, 8]);
    const set = [];
    for (let k = -30; k <= 30; k++) {
      const x1 = (2 * k * PI_ * c) / (c - 1); if (x1 >= 2 * k * PI_ - PI_ / 2 - 1e-12 && x1 <= 2 * k * PI_ + PI_ / 2 + 1e-12) set.push(x1);
      const x2 = ((2 * k + 1) * PI_ * c) / (c + 1); if (x2 >= (2 * k + 1) * PI_ - PI_ / 2 - 1e-12 && x2 <= (2 * k + 1) * PI_ + PI_ / 2 + 1e-12) set.push(x2);
    }
    const answer = uniqD(set).length;
    return { c, answer, tol: 0, q: `How many real solutions does $\\sin^{-1}(\\sin x)=\\dfrac x${c}$ have?`,
      sol: `<p>The left side is a zig-zag between $-\\dfrac\\pi2$ and $\\dfrac\\pi2$: it equals $x-2k\\pi$ near $x=2k\\pi$ and $(2k+1)\\pi-x$ near $x=(2k+1)\\pi$. The line $y=\\dfrac x${c}$ must stay in $\\left[-\\dfrac\\pi2,\\dfrac\\pi2\\right]$, so $|x|\\le\\dfrac{${c}\\pi}2$. Solving $x-2k\\pi=\\dfrac x${c}$ gives $x=\\dfrac{2k\\pi${c}}{${c - 1}}$ and solving $(2k+1)\\pi-x=\\dfrac x${c}$ gives $x=\\dfrac{(2k+1)\\pi${c}}{${c + 1}}$; keep only those inside their own piece. Counting them all gives $${answer}$ solutions.</p>` };
  }, (p) => zeros((x) => asin(sin(x)) - x / p.c, -(p.c * PI_) / 2 - 1, (p.c * PI_) / 2 + 1)),

  gen('it-g15', 3, 'nat', 'numeric', 'graphs', (rng) => {
    const n = int(rng, 1, 14), m = ((n % (2 * PI_)) + 2 * PI_) % (2 * PI_);
    let ans; if (m <= PI_ / 2) ans = 2 * m; else if (m <= PI_) ans = PI_; else if (m <= (3 * PI_) / 2) ans = 3 * PI_ - 2 * m; else ans = 0;
    const answer = r2(ans);
    return { n, answer, tol: 0.01, q: `Let $f(x)=\\sin^{-1}(\\sin x)+\\cos^{-1}(\\cos x)$. Find $f(${n})$, with $${n}$ in radians. (2 decimal places)`,
      sol: `<p>$f$ has period $2\\pi$. Reduce: $${n}\\bmod2\\pi\\approx${t4(m)}$. On $\\left[0,\\dfrac\\pi2\\right]$, $f=2x$; on $\\left[\\dfrac\\pi2,\\pi\\right]$, $f=\\pi$; on $\\left[\\pi,\\dfrac{3\\pi}2\\right]$, $f=3\\pi-2x$; on $\\left[\\dfrac{3\\pi}2,2\\pi\\right]$, $f=0$. So $f(${n})\\approx${answer}$.</p>` };
  }, (p) => asin(sin(p.n)) + acos(cos(p.n))),

  gen('it-g16', 3, 'nat', 'numeric', 'ranges', (rng) => {
    let a, b; do { a = int(rng, -4, 5); b = int(rng, -4, 5); } while (a === 0 && b === 0);
    const v = int(rng, 0, 1);
    const e1 = a / 2, e2 = b - a / 2, answer = r2(v === 0 ? Math.max(e1, e2) : Math.min(e1, e2));
    return { a, b, v, answer, tol: 0.01, q: `The ${v === 0 ? 'greatest' : 'least'} value of $${a === 0 ? '' : `${cf(a)}\\sin^{-1}x`}${b === 0 ? '' : `${b > 0 && a !== 0 ? '+' : ''}${cf(b)}\\cos^{-1}x`}$ for $x\\in[-1,1]$ is $k\\pi$. Find $k$. (2 decimal places)`,
      sol: `<p>With $s=\\sin^{-1}x\\in\\left[-\\dfrac\\pi2,\\dfrac\\pi2\\right]$ and $\\cos^{-1}x=\\dfrac\\pi2-s$, the expression is $(${a}-${b})s+\\dfrac{${b}\\pi}2$, linear in $s$. Its value at $s=\\dfrac\\pi2$ is $${e1}\\pi$ and at $s=-\\dfrac\\pi2$ is $${e2}\\pi$. The ${v === 0 ? 'greater' : 'smaller'} is $${answer}\\pi$.</p>`.replace(`(${a}-${b})`, `(${a}-(${b}))`) };
  }, (p) => { let m = p.v === 0 ? -1e9 : 1e9; for (let i = 0; i <= 20000; i++) { const x = -1 + (2 * i) / 20000, f = p.a * asin(x) + p.b * acos(x); m = p.v === 0 ? Math.max(m, f) : Math.min(m, f); } return m / PI_; }),

  gen('it-g17', 4, 'nat', 'numeric', 'equations', (rng) => {
    const [a, x0] = choose(rng, [[2, 1], [2, 2], [3, 1], [3, 2], [3, 3]]);
    const c = (2 * x0) / (1 + a * a - x0 * x0), x1 = -2 / c - x0;
    const ok = (x) => abs(atan(x + a) + atan(x - a) - atan(c)) < 1e-9;
    const cand = [x0, x1].filter(ok); const answer = Math.max(...cand);
    const ct = fq(2 * x0, 1 + a * a - x0 * x0);
    return { a, x0, c, answer: r2(answer), tol: 0.01, q: `Find the largest real $x$ with $\\tan^{-1}(x+${a})+\\tan^{-1}(x-${a})=\\tan^{-1}\\left(${ct}\\right)$. (2 decimal places)`,
      sol: `<p>Take tangents: $\\dfrac{2x}{1-(x^2-${a * a})}=\\dfrac{2x}{${1 + a * a}-x^2}=${ct}$. This is the quadratic $${t4(c)}x^2+2x-${t4(c * (1 + a * a))}=0$ with roots $x=${x0}$ and $x=${t4(x1)}$. Check each in the original equation (the tangent step can add roots): ${ok(x1) ? 'both work' : `$x=${t4(x1)}$ fails`}. The largest valid solution is $${r2(answer)}$.</p>` };
  }, (p) => { const f = (x) => atan(x + p.a) + atan(x - p.a) - atan(p.c); let best = -Infinity; let prev = f(-60 + (120 * 0.37) / 240000); for (let i = 1; i <= 240000; i++) { const x = -60 + (120 * (i + 0.37)) / 240000, v = f(x); if (prev * v < 0) { let lo = x - 120 / 240000, hi = x; for (let j = 0; j < 60; j++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } best = Math.max(best, (lo + hi) / 2); } prev = v; } return best; }),

  gen('it-g18', 3, 'nat', 'numeric', 'values', (rng) => {
    const [a, b, c] = choose(rng, TRI), [a2, b2, c2] = choose(rng, TRI), v = int(rng, 0, 1);
    // A = tan^-1(a/b): sin A = a/c, cos A = b/c.  B = cos^-1(a2/c2): cos B = a2/c2, sin B = b2/c2.
    const sA = a / c, cA = b / c, cB = a2 / c2, sB = b2 / c2;
    const val = v === 0 ? sA * cB + cA * sB : cA * cB - sA * sB;
    return { a, b, c, a2, b2, c2, v, answer: r4(val), tol: 0.0005, q: `Find $\\${v === 0 ? 'sin' : 'cos'}\\left(\\tan^{-1}\\dfrac{${a}}{${b}}+\\cos^{-1}\\dfrac{${a2}}{${c2}}\\right)$. (4 decimal places)`,
      sol: `<p>Let $A=\\tan^{-1}\\dfrac{${a}}{${b}}$: $\\sin A=\\dfrac{${a}}{${c}}$, $\\cos A=\\dfrac{${b}}{${c}}$. Let $B=\\cos^{-1}\\dfrac{${a2}}{${c2}}$: $\\cos B=\\dfrac{${a2}}{${c2}}$, $\\sin B=\\dfrac{${b2}}{${c2}}$. ${v === 0 ? '$\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B$' : '$\\cos(A+B)=\\cos A\\cos B-\\sin A\\sin B$'} $=${r4(val)}$.</p>` };
  }, (p) => { const A = atan(p.a / p.b), B = acos(p.a2 / p.c2); return p.v === 0 ? sin(A + B) : cos(A + B); }),
];

// ---- Expansion 2026-11-22: extra questions (ids it-x001 and on). Everything above this line is unchanged.
{
const R = String.raw;
const XEX = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 0, 1, 0, 3, 1, 2];
let xn = 0, xk = 0;
const xplace = (c, w) => { const p = XPOS[xk++ % XPOS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const xb = (level, sub, extra) => ({ id: `it-x${String(++xn).padStart(3, '0')}`, level, exams: [...XEX[level], ...(XCUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
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
const as = Math.asin, ac = Math.acos, at = Math.atan, PIE = Math.PI, sq = Math.sqrt;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n, d) => { const g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? `${n}` : (n < 0 ? '-' : '') + `\\dfrac{${Math.abs(n)}}{${d}}`; };
const piFrac = (n, d) => { if (n === 0) return '$0$'; const g = gcd(n, d); n /= g; d /= g; const sgn = n < 0 ? '-' : ''; const an = Math.abs(n); return d === 1 ? `$${sgn}${an === 1 ? '' : an}\\pi$` : `$${sgn}\\dfrac{${an === 1 ? '' : an}\\pi}{${d}}$`; };
const fmPi = (x) => { const n = Math.round(x * 2), g_ = gcd(n, 2), nn = n / g_, d = 2 / g_, sg = nn < 0 ? '-' : '', an = Math.abs(nn); return n === 0 ? '0' : d === 1 ? `${sg}${an === 1 ? '' : an}\\pi` : `${sg}\\dfrac{${an === 1 ? '' : an}\\pi}{${d}}`; };
const rgPi = (l, h) => `$\\left[${fmPi(l)},${fmPi(h)}\\right]$`;
PG('xp1', 'The zigzag function', R`<p>Let $f(x)=\sin^{-1}(\sin x)$ for $0\le x\le2\pi$. Remember that $f(x)=x$ on $[0,\tfrac\pi2]$, $f(x)=\pi-x$ on $[\tfrac\pi2,\tfrac{3\pi}2]$ and $f(x)=x-2\pi$ on $[\tfrac{3\pi}2,2\pi]$.</p>`);
PG('xp2', 'Angles that add up to a straight line', R`<p>Three positive numbers $a,b,c$ satisfy $\tan^{-1}a+\tan^{-1}b+\tan^{-1}c=\pi$. Then $a+b+c=abc$. Here $a=1$ and $b=2$.</p>`);
const add = [
  // ---------- level 2
  M(2, 'principal values', R`The principal value of $\cos^{-1}\left(-\dfrac{\sqrt3}2\right)$ is`, '$\\dfrac{5\\pi}6$', ['$\\dfrac{\\pi}6$', '$-\\dfrac{\\pi}6$', '$\\dfrac{7\\pi}6$'], R`<p>$\cos^{-1}(-x)=\pi-\cos^{-1}x$. So $\pi-\dfrac\pi6=\dfrac{5\pi}6$, which lies in $[0,\pi]$.</p>`, '7pi/6 also has the same cosine but lies outside the range [0, pi].'),
  N(2, 'values', R`Find $\cos\left(2\sin^{-1}\dfrac35\right)$.`, 0.28, 0.005, R`<p>$\cos2\theta=1-2\sin^2\theta=1-2\cdot\dfrac9{25}=\dfrac7{25}=0.28$.</p>`, 'Use the double angle identity with sine directly.', { calc: () => Math.cos(2 * as(3 / 5)) }),
  M(2, 'domains', R`The domain of $f(x)=\sin^{-1}(2x-1)$ is`, '$[0,1]$', ['$[-1,1]$', '$[0,2]$', '$\\left[-\\dfrac12,\\dfrac12\\right]$'], R`<p>$-1\le2x-1\le1\Rightarrow0\le2x\le2\Rightarrow0\le x\le1$.</p>`, 'Solve the double inequality, not just the argument.'),
  M(2, 'ranges', R`The range (set of principal values) of $\cot^{-1}x$ is`, '$(0,\\pi)$', ['$\\left(-\\dfrac\\pi2,\\dfrac\\pi2\\right)$', '$[0,\\pi]$', '$\\left(0,\\dfrac\\pi2\\right)$'], R`<p>The principal branch of $\cot^{-1}$ takes values in the open interval $(0,\pi)$ (it never reaches $0$ or $\pi$).</p>`, 'Closed [0, pi] belongs to cos^-1; cot^-1 excludes both ends.'),
  I(2, 'sums', R`In degrees, $\tan^{-1}1+\tan^{-1}\sqrt3$ equals`, 105, R`<p>$\tan^{-1}1=45^\circ$ and $\tan^{-1}\sqrt3=60^\circ$. Total $105^\circ$.</p>`, 'Each principal value is a single angle; just add.', { calc: () => ((at(1) + at(sq(3))) * 180) / PIE }),
  M(2, 'principal values', R`The principal value of $\tan^{-1}(-1)$ is`, '$-\\dfrac\\pi4$', ['$\\dfrac{3\\pi}4$', '$\\dfrac\\pi4$', '$\\dfrac{7\\pi}4$'], R`<p>$\tan^{-1}(-x)=-\tan^{-1}x$, so the value is $-\dfrac\pi4$, inside $\left(-\dfrac\pi2,\dfrac\pi2\right)$.</p>`, '3pi/4 has tangent -1 but is outside the principal range.'),
  // ---------- level 3
  N(3, 'values', R`Find $\sin\left(\tan^{-1}\dfrac34+\cos^{-1}\dfrac5{13}\right)$.`, 0.97, 0.005, R`<p>$A=\tan^{-1}\frac34$: $\sin A=\frac35$, $\cos A=\frac45$. $B=\cos^{-1}\frac5{13}$: $\cos B=\frac5{13}$, $\sin B=\frac{12}{13}$.</p><p>$\sin(A+B)=\dfrac35\cdot\dfrac5{13}+\dfrac45\cdot\dfrac{12}{13}=\dfrac{15+48}{65}=\dfrac{63}{65}=0.97$.</p>`, 'Build each right triangle first.', { calc: () => Math.sin(at(3 / 4) + ac(5 / 13)) }),
  M(3, 'principal values', R`The principal value of $\sin^{-1}(\sin10)$ (angle in radians) is`, '$3\\pi-10$', ['$10-3\\pi$', '$10$', '$10-4\\pi$'], R`<p>$10$ lies in $\left(\dfrac{5\pi}2,\dfrac{7\pi}2\right)$ ($7.85<10<10.99$). Write $10=3\pi+(10-3\pi)$; $\sin(3\pi+u)=-\sin u$ with $u=10-3\pi\approx0.575$. So $\sin10=\sin(-u)$ and the principal value is $-u=3\pi-10\approx-0.575$.</p>`, 'The answer is negative: sin 10 is negative.', { }),
  I(3, 'sums', R`In degrees, $\tan^{-1}2+\tan^{-1}3$ equals`, 135, R`<p>$\tan(A+B)=\dfrac{2+3}{1-6}=-1$. Since $xy=6>1$ the sum exceeds $90^\circ$, so it is $135^\circ$.</p>`, 'Product more than 1 means the sum is not the principal tan^-1 of the ratio.', { calc: () => ((at(2) + at(3)) * 180) / PIE }),
  M(3, 'properties', R`If $x,y\in[0,1]$ and $\sin^{-1}x+\sin^{-1}y=\dfrac\pi2$, then`, '$x^2+y^2=1$', ['$x+y=1$', '$xy=1$', '$x=y$'], R`<p>$\sin^{-1}y=\dfrac\pi2-\sin^{-1}x=\cos^{-1}x$, so $y=\sin(\cos^{-1}x)=\sqrt{1-x^2}$. Hence $x^2+y^2=1$.</p>`, 'x = y is only a special case.'),
  N(3, 'equations', R`Solve $\sin^{-1}x=2\cos^{-1}x$. Give $x$ to 2 decimal places.`, 0.87, 0.01, R`<p>$\sin^{-1}x=\dfrac\pi2-\cos^{-1}x$. So $\dfrac\pi2-c=2c$ where $c=\cos^{-1}x$, giving $c=\dfrac\pi6$ and $x=\cos\dfrac\pi6=\dfrac{\sqrt3}2\approx0.87$.</p>`, 'Replace sin^-1 x by pi/2 minus cos^-1 x.', { calc: () => Math.cos(PIE / 6) }),
  I(3, 'inequalities', R`How many integers $x$ satisfy $\cos^{-1}x>\sin^{-1}x$?`, 2, R`<p>$x\in[-1,1]$. $\cos^{-1}x>\sin^{-1}x\iff\dfrac\pi2-\sin^{-1}x>\sin^{-1}x\iff\sin^{-1}x<\dfrac\pi4\iff x<\dfrac1{\sqrt2}$. Integers in $[-1,\,0.707)$: $-1$ and $0$.</p>`, 'Do not forget the domain [-1, 1].', { calc: () => { let c = 0; for (let x = -1; x <= 1; x++) if (ac(x) > as(x)) c++; return c; } }),
  M(3, 'ranges', R`The range of $f(x)=\sin^{-1}x+\cos^{-1}x+\tan^{-1}x$ on $[-1,1]$ is`, '$\\left[\\dfrac\\pi4,\\dfrac{3\\pi}4\\right]$', ['$[0,\\pi]$', '$\\left[-\\dfrac\\pi4,\\dfrac\\pi4\\right]$', '$\\left[\\dfrac\\pi2,\\pi\\right]$'], R`<p>The first two add to $\dfrac\pi2$. So $f(x)=\dfrac\pi2+\tan^{-1}x$, which runs from $\dfrac\pi2-\dfrac\pi4$ to $\dfrac\pi2+\dfrac\pi4$.</p>`, 'tan^-1 is increasing, so end values come at x = -1 and 1.'),
  A(3, 'composition', R`$\sin^{-1}(\sin x)=x$ for every real $x$.`, R`The range of $\sin^{-1}$ is $\left[-\dfrac\pi2,\dfrac\pi2\right]$.`, 3, R`<p>A is false: $\sin^{-1}(\sin x)=x$ only when $x\in[-\frac\pi2,\frac\pi2]$ (for example $\sin^{-1}(\sin\pi)=0$). R is true; it is the reason the identity fails outside that interval.</p>`, 'sin^-1(sin x) is the angle in the principal range with the same sine.'),
  S(3, 'identities', R`$\tan^{-1}x+\cot^{-1}x=\dfrac\pi2$ for every real $x$.`, R`The range of $\cot^{-1}x$ is $(0,\pi)$.`, 0, R`<p>Both true. With the range $(0,\pi)$ for $\cot^{-1}$, $\cot^{-1}x=\dfrac\pi2-\tan^{-1}x$ holds for all real $x$.</p>`, 'With a different range convention the identity would change for negative x.'),
  SC(3, 'properties', [R`$\sin^{-1}(-x)=-\sin^{-1}x$`, R`$\cos^{-1}(-x)=\pi-\cos^{-1}x$`, R`$\tan^{-1}(-x)=-\tan^{-1}x$`, R`$\sec^{-1}x$ is defined for $|x|<1$`, R`$\cos^{-1}x$ is an odd function`], '3', ['2', '4', '1'], R`<p>The first three are standard and true. $\sec^{-1}x$ needs $|x|\ge1$. $\cos^{-1}x$ is neither even nor odd. So three are correct.</p>`, 'Only sin^-1, tan^-1 (and cosec^-1, cot^-1 with care) are odd.'),
  N(3, 'equations', R`Find the positive solution of $\tan^{-1}x+\tan^{-1}2x=\dfrac\pi4$.`, 0.28, 0.01, R`<p>$\dfrac{3x}{1-2x^2}=1\Rightarrow2x^2+3x-1=0\Rightarrow x=\dfrac{-3\pm\sqrt{17}}4$. The positive root is $0.28$ and it has $2x^2<1$ (so the formula is valid). The negative root $-1.78$ has $2x^2>1$ and gives $-\frac{3\pi}4$, so it is rejected.</p>`, 'Check 2x^2 < 1 before using the tangent addition formula.', { calc: () => (-3 + sq(17)) / 4 }),
  M(3, 'principal values', R`The principal value of $\cos^{-1}(\cos5)$ (radians) is`, '$2\\pi-5$', ['$5$', '$5-2\\pi$', '$\\pi-5$'], R`<p>$5\notin[0,\pi]$. $\cos5=\cos(2\pi-5)$ and $2\pi-5\approx1.28\in[0,\pi]$.</p>`, 'The range is [0, pi], so the answer must be positive.'),
  M(3, 'values', R`$\tan\left(\cos^{-1}\dfrac45+\tan^{-1}\dfrac23\right)=$`, '$\\dfrac{17}6$', ['$\\dfrac6{17}$', '$\\dfrac{17}{12}$', '$\\dfrac16$'], R`<p>$\tan\cos^{-1}\frac45=\frac34$. $\tan(A+B)=\dfrac{\frac34+\frac23}{1-\frac34\cdot\frac23}=\dfrac{\frac{17}{12}}{\frac12}=\dfrac{17}6$.</p>`, 'The denominator is 1 minus the product, here 1/2.'),
  I(3, 'values', R`In degrees, $\sin^{-1}\left(\sin\dfrac{7\pi}6\right)+\cos^{-1}\left(\cos\dfrac{7\pi}6\right)$ equals`, 120, R`<p>$\sin^{-1}(\sin\frac{7\pi}6)=-\frac\pi6$. $\cos^{-1}(\cos\frac{7\pi}6)=\frac{5\pi}6$. Sum $=\dfrac{4\pi}6=\dfrac{2\pi}3=120^\circ$.</p>`, 'Each term needs its own principal range.', { calc: () => ((as(Math.sin((7 * PIE) / 6)) + ac(Math.cos((7 * PIE) / 6))) * 180) / PIE }),
  M(3, 'domains', R`The domain of $f(x)=\sin^{-1}(x-2)+\sqrt{4-x^2}$ is`, '$[1,2]$', ['$[1,3]$', '$[-2,2]$', '$[1,2)$'], R`<p>$-1\le x-2\le1\Rightarrow1\le x\le3$. $4-x^2\ge0\Rightarrow-2\le x\le2$. Common part: $[1,2]$.</p>`, 'Both conditions must hold together.'),
  I(3, 'values', R`$\sec^2\left(\tan^{-1}2\right)+\operatorname{cosec}^2\left(\cot^{-1}3\right)=$`, 15, R`<p>$\sec^2\theta=1+\tan^2\theta=1+4=5$. $\operatorname{cosec}^2\phi=1+\cot^2\phi=1+9=10$. Total $15$.</p>`, 'Use 1 + tan^2 and 1 + cot^2.', { calc: () => 1 / Math.cos(at(2)) ** 2 + 1 / Math.sin(at(1 / 3)) ** 2 }),
  // ---------- level 4
  I(4, 'sums', R`In degrees, $\tan^{-1}\dfrac12+\tan^{-1}\dfrac15+\tan^{-1}\dfrac18=$`, 45, R`<p>$\tan^{-1}\frac12+\tan^{-1}\frac15=\tan^{-1}\dfrac{\frac12+\frac15}{1-\frac1{10}}=\tan^{-1}\dfrac79$. Then $\tan^{-1}\frac79+\tan^{-1}\frac18=\tan^{-1}\dfrac{\frac79+\frac18}{1-\frac7{72}}=\tan^{-1}1=45^\circ$.</p>`, 'Check each product is below 1 so the formula applies.', { calc: () => ((at(1 / 2) + at(1 / 5) + at(1 / 8)) * 180) / PIE }),
  N(4, 'telescoping sums', R`Find $\displaystyle\sum_{k=1}^{10}\tan^{-1}\dfrac1{2k^2}$ (in radians).`, 0.74, 0.01, R`<p>$\dfrac1{2k^2}=\dfrac{(2k+1)-(2k-1)}{1+(2k+1)(2k-1)}$, so $\tan^{-1}\dfrac1{2k^2}=\tan^{-1}(2k+1)-\tan^{-1}(2k-1)$.</p><p>The sum telescopes to $\tan^{-1}21-\tan^{-1}1=1.5233-0.7854=0.74$.</p>`, 'Check 1 + (2k+1)(2k-1) = 4k^2.', { calc: () => { let s = 0; for (let k = 1; k <= 10; k++) s += at(1 / (2 * k * k)); return s; } }),
  I(4, 'identities', R`How many integers $x$ satisfy $2\tan^{-1}x=\sin^{-1}\dfrac{2x}{1+x^2}$?`, 3, R`<p>The identity $2\tan^{-1}x=\sin^{-1}\dfrac{2x}{1+x^2}$ holds exactly when $|x|\le1$. Integers: $-1,0,1$.</p>`, 'For |x| > 1 the right side is 2 tan^-1 x minus (or plus) pi, not equal.', { calc: () => { let c = 0; for (let x = -20; x <= 20; x++) if (Math.abs(2 * at(x) - as((2 * x) / (1 + x * x))) < 1e-9) c++; return c; } }),
  I(4, 'equations', R`The number of real solutions of $\sin^{-1}x=\tan^{-1}x$ is`, 1, R`<p>On $[0,1]$, $\sin^{-1}x\ge\tan^{-1}x$ with equality only at $0$ (at $x=1$: $\dfrac\pi2$ against $\dfrac\pi4$). Both functions are odd, so the negative side behaves the same. The only solution is $x=0$.</p>`, 'Compare the functions at several points, not just at 0 and 1.', { calc: () => { let c = 0, prev = null; for (let i = -1000; i <= 1000; i++) { const x = i / 1000, d = as(x) - at(x); if (Math.abs(d) < 1e-12) c++; else if (prev !== null && prev * d < 0) c++; prev = Math.abs(d) < 1e-12 ? null : d; } return c; } }),
  N(4, 'equations', R`Solve $\sin^{-1}x+\sin^{-1}2x=\dfrac\pi2$. Give $x$ to 2 decimal places.`, 0.45, 0.01, R`<p>$\sin^{-1}2x=\dfrac\pi2-\sin^{-1}x=\cos^{-1}x$, so $2x=\sqrt{1-x^2}$ with $x\ge0$. Square: $4x^2=1-x^2$, $x^2=\dfrac15$, $x=\dfrac1{\sqrt5}\approx0.45$. Check the domain: $2x=0.894\le1$.</p>`, 'Reject the negative root, since cos^-1 x is not negative.', { calc: () => 1 / sq(5) }),
  I(4, 'graphs', R`The number of solutions of $\sin^{-1}(\sin x)=\dfrac x2$ is`, 3, R`<p>The graph of $y=\sin^{-1}(\sin x)$ is a zigzag of height $\dfrac\pi2$, so we need $|x|\le\pi$. For $x\in[-\frac\pi2,\frac\pi2]$: $x=\frac x2\Rightarrow x=0$. For $x\in[\frac\pi2,\pi]$: $\pi-x=\frac x2\Rightarrow x=\frac{2\pi}3$. By symmetry $x=-\frac{2\pi}3$ too. Three solutions.</p>`, 'Beyond |x| = pi the line is above the zigzag.', { calc: () => { let c = 0, prev = null; const f = (x) => as(Math.sin(x)) - x / 2; const n = 200000; for (let i = -n; i <= n; i++) { const x = (i / n) * 10, d = f(x); if (prev !== null && prev * d < 0) c++; else if (d === 0) c++; prev = d; } return c; } }),
  N(4, 'graphs', R`Find the area enclosed between the graph of $y=\sin^{-1}(\sin x)$ and the $x$-axis for $0\le x\le\pi$.`, 2.47, 0.01, R`<p>On $[0,\frac\pi2]$ the graph is $y=x$ (area $\frac12\cdot\frac\pi2\cdot\frac\pi2=\frac{\pi^2}8$). On $[\frac\pi2,\pi]$ it is $y=\pi-x$, a triangle with the same area $\frac{\pi^2}8$.</p><p>Total $=\dfrac{\pi^2}4\approx2.47$.</p>`, 'Draw the zigzag; both halves are triangles.', { calc: () => PIE * PIE / 4 }),
  X(4, 'tan inverse', R`Which statements about $f(x)=\tan^{-1}x$ are true?`, [R`$f$ is increasing on $\mathbb R$`, R`The range of $f$ is $\left(-\dfrac\pi2,\dfrac\pi2\right)$`, R`$f$ is an odd function`, R`$f(x)+f\left(\dfrac1x\right)=\dfrac\pi2$ for every $x\ne0$`], [0, 1, 2], R`<p>The first three are true. The last holds only for $x>0$; for $x<0$ the sum is $-\dfrac\pi2$.</p>`, 'The reciprocal identity depends on the sign of x.'),
  X(4, 'sums', R`Which of the following equal $\dfrac\pi4$?`, [R`$\tan^{-1}1$`, R`$\sin^{-1}\dfrac1{\sqrt2}$`, R`$\cos^{-1}\left(-\dfrac1{\sqrt2}\right)$`, R`$\tan^{-1}2+\tan^{-1}\left(-\dfrac13\right)$`], [0, 1, 3], R`<p>The first two are $\frac\pi4$. $\cos^{-1}(-\frac1{\sqrt2})=\frac{3\pi}4$. For the last: $\tan(A+B)=\dfrac{2-\frac13}{1-2(-\frac13)}=\dfrac{5/3}{5/3}=1$ and the sum lies in $(0,\frac\pi2)$ ($63.4^\circ-18.4^\circ=45^\circ$).</p>`, 'The third is the supplement, not the angle itself.'),
  X(4, 'composition', R`For which values of $x$ is $\sin^{-1}(\sin x)=x$?`, [R`$x=\dfrac\pi3$`, R`$x=\dfrac{2\pi}3$`, R`$x=-\dfrac\pi2$`, R`$x=\dfrac{3\pi}4$`], [0, 2], R`<p>The identity holds exactly when $x\in[-\frac\pi2,\frac\pi2]$: $\frac\pi3$ and $-\frac\pi2$ qualify. $\frac{2\pi}3$ and $\frac{3\pi}4$ give $\frac\pi3$ and $\frac\pi4$.</p>`, 'The end points of the interval are included.'),
  X(4, 'identities', R`Which of these hold for every $x\in[-1,1]$?`, [R`$\sin^{-1}x+\cos^{-1}x=\dfrac\pi2$`, R`$\cos^{-1}x+\cos^{-1}(-x)=\pi$`, R`$\sin^{-1}x+\sin^{-1}(-x)=0$`, R`$\sin^{-1}x=\cos^{-1}\sqrt{1-x^2}$`], [0, 1, 2], R`<p>The first three are standard. The last fails for $x<0$: take $x=-1$, then $\sin^{-1}(-1)=-\frac\pi2$ but $\cos^{-1}0=\frac\pi2$.</p>`, 'The last needs x >= 0.'),
  X(4, 'domains', R`Let $f(x)=\sin^{-1}(2x)+\cos^{-1}x$. Which statements are true?`, [R`The domain of $f$ is $\left[-\dfrac12,\dfrac12\right]$`, R`$f(0)=\dfrac\pi2$`, R`$f\left(\dfrac12\right)=\dfrac{5\pi}6$`, R`$f\left(-\dfrac12\right)=\dfrac\pi2$`], [0, 1, 2], R`<p>$|2x|\le1$ gives the domain. $f(0)=0+\frac\pi2$. $f(\frac12)=\frac\pi2+\frac\pi3=\frac{5\pi}6$. $f(-\frac12)=-\frac\pi2+\frac{2\pi}3=\frac\pi6$, not $\frac\pi2$.</p>`, 'cos^-1(-1/2) = 2pi/3.'),
  I(4, 'identities', R`The identity $\cos^{-1}(4x^3-3x)=3\cos^{-1}x$ holds for $x\in[a,b]$. Find $2(a+b)$.`, 3, R`<p>Let $\theta=\cos^{-1}x$. Then $4x^3-3x=\cos3\theta$, and $\cos^{-1}(\cos3\theta)=3\theta$ only if $3\theta\in[0,\pi]$, i.e. $\theta\in[0,\frac\pi3]$, i.e. $x\in[\frac12,1]$.</p><p>$2(a+b)=2\cdot\frac32=3$.</p>`, 'The angle must stay inside [0, pi] after tripling.', { calc: () => { let lo = 2, hi = -2; for (let i = -1000; i <= 1000; i++) { const x = i / 1000; if (Math.abs(ac(4 * x ** 3 - 3 * x) - 3 * ac(x)) < 1e-9) { lo = Math.min(lo, x); hi = Math.max(hi, x); } } return 2 * (lo + hi); } }),
  I(4, 'identities', R`The identity $\sin^{-1}(3x-4x^3)=3\sin^{-1}x$ holds on an interval. Find the length of the interval.`, 1, R`<p>With $\theta=\sin^{-1}x$, $3x-4x^3=\sin3\theta$, and $\sin^{-1}(\sin3\theta)=3\theta$ only if $3\theta\in[-\frac\pi2,\frac\pi2]$, i.e. $x\in[-\frac12,\frac12]$. Length $=1$.</p>`, 'Tripling the angle must stay inside the principal range.', { calc: () => { let lo = 2, hi = -2; for (let i = -1000; i <= 1000; i++) { const x = i / 1000; if (Math.abs(as(3 * x - 4 * x ** 3) - 3 * as(x)) < 1e-9) { lo = Math.min(lo, x); hi = Math.max(hi, x); } } return hi - lo; } }),
  I(4, 'identities', R`For integers $n$, $2\sin^{-1}\dfrac n{10}=\sin^{-1}\left(\dfrac{2n}{10}\sqrt{1-\dfrac{n^2}{100}}\right)$ is true for how many values of $n$?`, 15, R`<p>$2\sin^{-1}x=\sin^{-1}(2x\sqrt{1-x^2})$ holds exactly when $|x|\le\dfrac1{\sqrt2}\approx0.7071$. With $x=\frac n{10}$: $|n|\le7$. Integers $-7,\dots,7$: $15$ values.</p>`, '8/10 = 0.8 is already too large.', { calc: () => { let c = 0; for (let n = -10; n <= 10; n++) { const x = n / 10; if (Math.abs(2 * as(x) - as(2 * x * sq(1 - x * x))) < 1e-9) c++; } return c; } }),
  N(4, 'telescoping sums', R`Find $\displaystyle\sum_{k=1}^{5}\tan^{-1}\dfrac2{k^2}$ (in radians).`, 1.99, 0.01, R`<p>$\dfrac2{k^2}=\dfrac{(k+1)-(k-1)}{1+(k+1)(k-1)}$, so $\tan^{-1}\dfrac2{k^2}=\tan^{-1}(k+1)-\tan^{-1}(k-1)$.</p><p>Sum $=\tan^{-1}5+\tan^{-1}6-\tan^{-1}0-\tan^{-1}1=1.3734+1.4056-0-0.7854=1.99$.</p>`, 'Two terms survive at each end of a gap-2 telescoping sum.', { calc: () => { let s = 0; for (let k = 1; k <= 5; k++) s += at(2 / (k * k)); return s; } }),
  N(4, 'values', R`Find $\tan\left(2\tan^{-1}\dfrac14+\tan^{-1}\dfrac29\right)$.`, 0.86, 0.01, R`<p>$\tan\left(2\tan^{-1}\frac14\right)=\dfrac{2\cdot\frac14}{1-\frac1{16}}=\dfrac8{15}$. Then $\tan(A+B)=\dfrac{\frac8{15}+\frac29}{1-\frac8{15}\cdot\frac29}=\dfrac{\frac{34}{45}}{\frac{119}{135}}=\dfrac67\approx0.86$.</p>`, 'Compute tan 2A first, then add.', { calc: () => Math.tan(2 * at(1 / 4) + at(2 / 9)) }),
  M(4, 'ranges', R`The range of $f(x)=\cos^{-1}\dfrac1{1+x^2}$ is`, '$\\left[0,\\dfrac\\pi2\\right)$', ['$\\left(0,\\dfrac\\pi2\\right]$', '$\\left[0,\\dfrac\\pi2\\right]$', '$(0,\\pi)$'], R`<p>$\dfrac1{1+x^2}\in(0,1]$. $\cos^{-1}$ is decreasing, so values run from $\cos^{-1}1=0$ (included at $x=0$) up towards $\cos^{-1}0=\dfrac\pi2$ (never reached).</p>`, 'The end 0 of the argument is excluded, so pi/2 is excluded.'),
  N(4, 'extreme values', R`Find the least value of $\left(\sin^{-1}x\right)^3+\left(\cos^{-1}x\right)^3$ for $x\in[-1,1]$.`, 0.97, 0.01, R`<p>Let $a=\sin^{-1}x$, $b=\cos^{-1}x$, $a+b=\dfrac\pi2$. $a^3+b^3=(a+b)\left[(a+b)^2-3ab\right]=\dfrac\pi2\left(\dfrac{\pi^2}4-3ab\right)$.</p><p>This is least when $ab$ is greatest. With a fixed sum, $ab\le\left(\dfrac\pi4\right)^2$ (at $a=b=\frac\pi4$, i.e. $x=\frac1{\sqrt2}$). Least value $=\dfrac\pi2\cdot\dfrac{\pi^2}{16}=\dfrac{\pi^3}{32}\approx0.97$.</p>`, 'Use a^3 + b^3 = (a+b)^3 - 3ab(a+b).', { calc: () => { let m = 9; for (let i = -10000; i <= 10000; i++) { const x = i / 10000; m = Math.min(m, as(x) ** 3 + ac(x) ** 3); } return m; } }),
  A(4, 'sums', R`$\tan^{-1}x+\tan^{-1}y=\tan^{-1}\dfrac{x+y}{1-xy}$ for all real $x,y$ with $xy\ne1$.`, R`$\tan(A+B)=\dfrac{\tan A+\tan B}{1-\tan A\tan B}$.`, 3, R`<p>A is false: the formula holds only when $xy<1$. For $x=y=2$, the left side is about $2.21$ but the right side is $\tan^{-1}\left(-\frac43\right)<0$. R is a correct identity about $\tan$ values; it does not take the principal range into account.</p>`, 'Need xy < 1, otherwise add or subtract pi.'),
  A(4, 'parity', R`Both $\sin^{-1}x$ and $\cos^{-1}x$ are odd functions.`, R`$\cos^{-1}(-x)=\pi-\cos^{-1}x$.`, 3, R`<p>A is false: $\sin^{-1}$ is odd, but $\cos^{-1}(-x)=\pi-\cos^{-1}x\ne-\cos^{-1}x$. R is true.</p>`, 'cos^-1 is neither even nor odd.'),
  S(4, 'sums', R`$\tan^{-1}\dfrac12+\tan^{-1}\dfrac13=\dfrac\pi4$.`, R`$\tan^{-1}x+\tan^{-1}y=\tan^{-1}\dfrac{x+y}{1-xy}$ for all positive $x,y$.`, 1, R`<p>Statement I is true: $\dfrac{\frac12+\frac13}{1-\frac16}=1$ and $xy=\frac16<1$. Statement II is false when $xy>1$ (e.g. $x=y=2$).</p>`, 'The formula needs xy < 1.'),
  SC(4, 'composition', [R`$\tan^{-1}(\tan3)=3-\pi$`, R`$\sin^{-1}(\sin3)=3$`, R`$\cos^{-1}(\cos3)=3$`, R`$\cos^{-1}(\cos4)=4$`], '2', ['1', '3', '4'], R`<p>1: $3\in(\frac\pi2,\pi)$; $\tan3=\tan(3-\pi)$ and $3-\pi\in(-\frac\pi2,\frac\pi2)$. True. 2: $\sin^{-1}(\sin3)=\pi-3$. False. 3: $3\in[0,\pi]$, true. 4: $4\notin[0,\pi]$; the value is $2\pi-4$. False. Two are correct.</p>`, 'Check which interval the angle lies in before applying the identity.'),
  // ---------- level 5
  I(5, 'identities', R`Let $f(x)=\tan^{-1}x+\tan^{-1}\dfrac{1-x}{1+x}$ for $x\ne-1$. Find $f(2)+f(-2)$ in degrees.`, -90, R`<p>For $x>-1$: $\tan(A+B)=\dfrac{x+\frac{1-x}{1+x}}{1-x\cdot\frac{1-x}{1+x}}=\dfrac{(x+x^2+1-x)}{(1+x-x+x^2)}=1$, and $xy<1$ holds, so $f=\frac\pi4$. For $x<-1$ the product $xy>1$ and $f=\frac\pi4-\pi=-\frac{3\pi}4$.</p><p>$f(2)+f(-2)=\frac\pi4-\frac{3\pi}4=-\frac\pi2=-90^\circ$.</p>`, 'The function is not constant; it jumps at x = -1.', { calc: () => { const f = (x) => at(x) + at((1 - x) / (1 + x)); return ((f(2) + f(-2)) * 180) / PIE; } }),
  N(5, 'hidden condition', R`Let $f(x)=\sin^{-1}(3x-4x^3)-3\sin^{-1}x$. Find $f(0.8)$.`, -2.42, 0.01, R`<p>For $x\in(\frac12,1]$, $3\sin^{-1}x\in(\frac\pi2,\frac{3\pi}2]$, so $\sin^{-1}(\sin3\theta)=\pi-3\theta$ with $\theta=\sin^{-1}x$. Hence $f(x)=\pi-6\sin^{-1}x$.</p><p>$f(0.8)=\pi-6(0.9273)=3.1416-5.5638=-2.42$.</p>`, 'Outside [-1/2, 1/2] the triple-angle identity gets a correction.', { calc: () => as(3 * 0.8 - 4 * 0.8 ** 3) - 3 * as(0.8) }),
  N(5, 'hidden condition', R`Find $\cos^{-1}(4x^3-3x)$ at $x=0.3$.`, 2.48, 0.01, R`<p>$\theta=\cos^{-1}0.3\approx1.2661$ lies in $[\frac\pi3,\frac{2\pi}3]$ (because $x\in[-\frac12,\frac12]$). Then $3\theta\in[\pi,2\pi]$ and $\cos^{-1}(\cos3\theta)=2\pi-3\theta$.</p><p>Value $=6.2832-3.7983=2.485\approx2.48$.</p>`, 'In this range the tripled angle passes pi, so use 2 pi minus it.', { answer: 2.48, calc: () => ac(4 * 0.3 ** 3 - 3 * 0.3) }),
  N(5, 'graphs', R`For $0\le x\le2\pi$, the equation $\sin^{-1}(\sin x)=\cos^{-1}(\cos x)$ holds on a set of $x$ values. Find the total length of the part of $[0,2\pi]$ where it holds (excluding single points).`, 1.57, 0.01, R`<p>$\sin^{-1}(\sin x)=x$ on $[0,\frac\pi2]$, $\pi-x$ on $[\frac\pi2,\frac{3\pi}2]$, $x-2\pi$ on $[\frac{3\pi}2,2\pi]$. $\cos^{-1}(\cos x)=x$ on $[0,\pi]$, $2\pi-x$ on $[\pi,2\pi]$.</p><p>On $[0,\frac\pi2]$ both are $x$: equal, length $\frac\pi2$. On $[\frac\pi2,\pi]$: $\pi-x=x$ only at $\frac\pi2$. On $[\pi,\frac{3\pi}2]$: $\pi-x\ne2\pi-x$. On $[\frac{3\pi}2,2\pi]$: $x-2\pi=2\pi-x$ only at $2\pi$. Total length $\frac\pi2\approx1.57$.</p>`, 'Equality at isolated points adds no length.', { calc: () => { let c = 0; const n = 200000; for (let i = 0; i < n; i++) { const x = ((i + 0.5) / n) * 2 * PIE; if (Math.abs(as(Math.sin(x)) - ac(Math.cos(x))) < 1e-9) c++; } return (c / n) * 2 * PIE; } }),
  N(5, 'telescoping sums', R`Let $S_n=\displaystyle\sum_{k=1}^{n}\tan^{-1}\dfrac1{1+k(k+1)}$. Find $\tan S_8$.`, 0.8, 0.01, R`<p>$\dfrac1{1+k(k+1)}=\dfrac{(k+1)-k}{1+k(k+1)}$, so each term is $\tan^{-1}(k+1)-\tan^{-1}k$.</p><p>$S_8=\tan^{-1}9-\tan^{-1}1$ and $\tan S_8=\dfrac{9-1}{1+9}=\dfrac45=0.8$.</p>`, 'The general result is tan S_n = n/(n+2).', { calc: () => { let s = 0; for (let k = 1; k <= 8; k++) s += at(1 / (1 + k * (k + 1))); return Math.tan(s); } }),
  X(5, 'ranges', R`Which of the following are even functions of $x$ (on their natural domains)?`, [R`$\cos^{-1}(\cos x)$`, R`$\sin^{-1}(\sin x)$`, R`$\left|\tan^{-1}x\right|$`, R`$\tan^{-1}\left(x^2\right)$`], [0, 2, 3], R`<p>$\cos^{-1}(\cos(-x))=\cos^{-1}(\cos x)$: even. $\sin^{-1}(\sin(-x))=-\sin^{-1}(\sin x)$: odd. $|\tan^{-1}(-x)|=|\tan^{-1}x|$: even. $\tan^{-1}(x^2)$ depends on $x^2$: even.</p>`, 'Sine and tangent chains are odd; cosine chains are even.'),
  X(5, 'sums', R`Which of these equal $\dfrac\pi2$?`, [R`$\tan^{-1}2+\tan^{-1}\dfrac12$`, R`$\sin^{-1}\dfrac35+\sin^{-1}\dfrac45$`, R`$\cos^{-1}\dfrac13+\sin^{-1}\dfrac13$`, R`$\tan^{-1}3+\tan^{-1}\left(-\dfrac13\right)$`], [0, 1, 2], R`<p>(1) $\tan^{-1}x+\tan^{-1}\frac1x=\frac\pi2$ for $x>0$. (2) $\left(\frac35\right)^2+\left(\frac45\right)^2=1$ and both positive. (3) $\sin^{-1}x+\cos^{-1}x=\frac\pi2$. (4) $71.57^\circ-18.43^\circ=53.13^\circ$.</p>`, 'In the last pair the second angle is negative.'),
  X(5, 'equations', R`Which of the following equations have exactly one real solution?`, [R`$\sin^{-1}x=\cos^{-1}x$`, R`$\tan^{-1}x=\dfrac\pi2$`, R`$\cos^{-1}x=x$`, R`$\sin^{-1}x=\tan^{-1}x$`], [0, 2, 3], R`<p>(1) only $x=\frac1{\sqrt2}$. (2) no solution: $\tan^{-1}x<\frac\pi2$ always. (3) $\cos^{-1}x$ decreases from $\pi$ to $0$ while $x$ increases, so they cross once (near $0.739$). (4) only $x=0$.</p>`, 'tan^-1 never reaches pi/2.'),
  X(5, 'tan inverse', R`For $x\ne0$ let $g(x)=\tan^{-1}x+\tan^{-1}\dfrac1x$. Which are true?`, [R`$g(2)=\dfrac\pi2$`, R`$g(-2)=-\dfrac\pi2$`, R`$g$ is constant on $(0,\infty)$`, R`$g$ is continuous on $\mathbb R$`], [0, 1, 2], R`<p>$g(x)=\frac\pi2$ for $x>0$ and $-\frac\pi2$ for $x<0$. It is not defined at $0$ and jumps there, so it is not continuous on $\mathbb R$.</p>`, 'Domain excludes 0.'),
  A(5, 'composition', R`The graph of $y=\sin^{-1}(\sin x)$ is a zigzag whose slope alternates between $+1$ and $-1$.`, R`$\sin^{-1}(\sin x)=x$ on $\left[-\dfrac\pi2,\dfrac\pi2\right]$ and equals $\pi-x$ on $\left[\dfrac\pi2,\dfrac{3\pi}2\right]$.`, 0, R`<p>Both true. $\pi-x$ has slope $-1$ and $x$ has slope $+1$; the pattern repeats with period $2\pi$. R describes the pieces of the zigzag, so R explains A.</p>`, 'The function is periodic with period 2 pi.'),
  S(5, 'composition', R`$\cos^{-1}(\cos x)=x$ for every real $x$.`, R`The range of $\cos^{-1}$ is $[0,\pi]$.`, 2, R`<p>Statement I is false (take $x=-1$: the value is $1$). Statement II is true.</p>`, 'The identity needs x in [0, pi].'),
  SC(5, 'inequalities', [R`$\sin^{-1}x\ge\cos^{-1}x\iff x\ge\dfrac1{\sqrt2}$`, R`$\tan^{-1}x>\cot^{-1}x\iff x>1$`, R`$\cos^{-1}x<\sin^{-1}x$ for every $x>0$`, R`$\sec^{-1}2=\dfrac\pi3$`], '3', ['2', '4', '1'], R`<p>1 true (shown above). 2 true: $\tan^{-1}x>\frac\pi2-\tan^{-1}x\iff\tan^{-1}x>\frac\pi4$. 3 false: at $x=0.5$, $\cos^{-1}x=1.05>\sin^{-1}x=0.52$. 4 true: $\cos^{-1}\frac12=\frac\pi3$. Three are correct.</p>`, 'x > 0 is not the same as x > 1/sqrt 2.'),
  N(5, 'principal values', R`Find $\sin^{-1}(\sin1)+\sin^{-1}(\sin2)+\sin^{-1}(\sin3)+\sin^{-1}(\sin4)$ (radians).`, 1.42, 0.01, R`<p>$\sin^{-1}(\sin1)=1$ (as $1\le\frac\pi2$). For $2,3,4\in[\frac\pi2,\frac{3\pi}2]$ the value is $\pi-x$: $\pi-2$, $\pi-3$, $\pi-4$.</p><p>Sum $=1+3\pi-9=3\pi-8\approx1.42$.</p>`, 'Only the first angle is already in the principal range.', { calc: () => as(Math.sin(1)) + as(Math.sin(2)) + as(Math.sin(3)) + as(Math.sin(4)) }),
  // ---------- passages
  PN(3, 'graphs', 'xp1', R`Find $f(4)$ (in radians).`, -0.86, 0.01, R`<p>$4\in[\frac\pi2,\frac{3\pi}2]$ ($1.57<4<4.71$), so $f(4)=\pi-4=-0.8584$.</p>`, 'The value is negative.', { calc: () => as(Math.sin(4)) }),
  PN(4, 'graphs', 'xp1', R`Find $f(5)$ (in radians).`, -1.28, 0.01, R`<p>$5\in[\frac{3\pi}2,2\pi]$ ($4.71<5<6.28$), so $f(5)=5-2\pi=-1.2832$.</p>`, 'Use the third piece.', { calc: () => as(Math.sin(5)) }),
  PI(5, 'graphs', 'xp1', R`The number of solutions of $f(x)=\dfrac12$ in $[0,2\pi]$ is`, 2, R`<p>On $[0,\frac\pi2]$: $x=\frac12$. On $[\frac\pi2,\frac{3\pi}2]$: $\pi-x=\frac12$, $x=\pi-\frac12\approx2.64$. On $[\frac{3\pi}2,2\pi]$: $x-2\pi\le0$ cannot be $\frac12$. Two solutions.</p>`, 'The last piece is never positive.', { calc: () => { let c = 0, prev = null; const n = 400000; for (let i = 0; i <= n; i++) { const x = (i / n) * 2 * PIE, d = as(Math.sin(x)) - 0.5; if (prev !== null && prev * d < 0) c++; prev = d; } return c; } }),
  PI(3, 'angle sums', 'xp2', R`The value of $c$ is`, 3, R`<p>$c=\dfrac{a+b}{ab-1}=\dfrac{3}{1}=3$. (From $a+b+c=abc$: $3+c=2c$.)</p>`, 'Use a + b + c = abc.', { calc: () => 3 / (2 - 1) }),
  PI(4, 'angle sums', 'xp2', R`The value of $ab+bc+ca$ is`, 11, R`<p>$c=3$. $ab=2$, $bc=6$, $ca=3$. Total $11$.</p>`, 'Compute c first.', { calc: () => 2 + 6 + 3 }),
  PN(4, 'angle sums', 'xp2', R`Find $\tan^{-1}c$ in degrees.`, 71.57, 0.01, R`<p>$c=3$, so $\tan^{-1}3=71.57^\circ$. (Check: $45^\circ+63.43^\circ+71.57^\circ=180^\circ$.)</p>`, 'The sum of the three is 180 degrees.', { calc: () => (at(3) * 180) / PIE }),
  // ---------- matches
  MT(3, 'principal values', 'xm1', { title: 'Principal values', passage: R`<p>Match each expression in List I with its principal value in List II.</p>`, list1: [R`A. $\sin^{-1}\dfrac12$`, R`B. $\cos^{-1}\left(-\dfrac1{\sqrt2}\right)$`, R`C. $\tan^{-1}(-\sqrt3)$`, R`D. $\cot^{-1}\dfrac1{\sqrt3}$`], list2: [R`p. $-\dfrac\pi3$`, R`q. $\dfrac\pi3$`, R`r. $\dfrac{3\pi}4$`, R`s. $\dfrac\pi6$`, R`t. $\dfrac{2\pi}3$`] }, 'srpq', R`<p>A: $\frac\pi6$. B: $\pi-\frac\pi4=\frac{3\pi}4$. C: $-\frac\pi3$. D: $\cot^{-1}\frac1{\sqrt3}=\frac\pi3$ (since $\cot\frac\pi3=\frac1{\sqrt3}$).</p>`, 'cot^-1 has range (0, pi).'),
  MT(4, 'ranges', 'xm2', { title: 'Ranges', passage: R`<p>Match each function in List I with its range in List II.</p>`, list1: [R`A. $\sin^{-1}x+\cos^{-1}x$ on $[-1,1]$`, R`B. $\sin^{-1}x$ on $[-1,1]$`, R`C. $\sin^{-1}x$ on $[0,1]$`, R`D. $\cos^{-1}x$ on $[-1,0]$`], list2: [R`p. $\left[0,\dfrac\pi2\right]$`, R`q. $\left\{\dfrac\pi2\right\}$`, R`r. $\left[\dfrac\pi2,\pi\right]$`, R`s. $\left[-\dfrac\pi2,\dfrac\pi2\right]$`] }, 'qspr', R`<p>A is the constant $\frac\pi2$. B covers the whole principal range. C: $x\ge0$ gives $[0,\frac\pi2]$. D: $\cos^{-1}$ of non-positive numbers is in $[\frac\pi2,\pi]$.</p>`, 'A single value is a set with one element.'),
  MT(4, 'values', 'xm3', { title: 'Trigonometric values of inverse angles', passage: R`<p>Match each expression in List I with its value in List II.</p>`, list1: [R`A. $\sin\left(2\sin^{-1}\dfrac35\right)$`, R`B. $\cos\left(2\cos^{-1}\dfrac35\right)$`, R`C. $\tan\left(2\tan^{-1}\dfrac12\right)$`, R`D. $\cos\left(\sin^{-1}\dfrac45\right)$`], list2: [R`p. $\dfrac35$`, R`q. $\dfrac43$`, R`r. $-\dfrac7{25}$`, R`s. $\dfrac{24}{25}$`, R`t. $1$`] }, 'srqp', R`<p>A: $2\cdot\frac35\cdot\frac45=\frac{24}{25}$. B: $2\cdot\frac9{25}-1=-\frac7{25}$. C: $\frac{2\cdot\frac12}{1-\frac14}=\frac43$. D: $\frac35$.</p>`, 'Double angle formulas, each with its own sign.'),
  MT(4, 'sums', 'xm4', { title: 'Sums of inverse angles', passage: R`<p>Match each sum in List I with its value in List II.</p>`, list1: [R`A. $\tan^{-1}1+\tan^{-1}2+\tan^{-1}3$`, R`B. $\tan^{-1}\dfrac12+\tan^{-1}\dfrac13$`, R`C. $\sin^{-1}\dfrac35+\cos^{-1}\dfrac35$`, R`D. $\tan^{-1}1+\tan^{-1}(-1)$`], list2: [R`p. $0$`, R`q. $\dfrac\pi2$`, R`r. $\pi$`, R`s. $\dfrac\pi4$`, R`t. $\dfrac{3\pi}4$`] }, 'rsqp', R`<p>A: $\frac\pi4+\tan^{-1}2+\tan^{-1}3=\frac\pi4+\frac{3\pi}4=\pi$. B: $\tan^{-1}\frac{5/6}{5/6}=\frac\pi4$. C: $\frac\pi2$. D: $0$.</p>`, 'Pairs with product > 1 add a pi.'),
  MT(4, 'equations', 'xm5', { title: 'Number of solutions', passage: R`<p>Match each equation in List I with its number of real solutions in List II.</p>`, list1: [R`A. $\sin^{-1}x=\tan^{-1}x$`, R`B. $\sin^{-1}(\sin x)=\dfrac x2$`, R`C. $\left|\sin^{-1}x\right|=\dfrac\pi4$`, R`D. $\cos^{-1}x=-1$`], list2: [R`p. $0$`, R`q. $1$`, R`r. $2$`, R`s. $3$`] }, 'qsrp', R`<p>A: only $x=0$. B: $0,\pm\frac{2\pi}3$, three. C: $x=\pm\frac1{\sqrt2}$, two. D: $\cos^{-1}x\ge0$, none.</p>`, 'An absolute value gives two solutions here.'),
  MT(5, 'domains', 'xm6', { title: 'Domains', passage: R`<p>Match each function in List I with its domain in List II.</p>`, list1: [R`A. $\sin^{-1}(2x-1)$`, R`B. $\cos^{-1}\left(x^2-1\right)$`, R`C. $\sin^{-1}(\log_2x)$`, R`D. $\sec^{-1}(2x)$`], list2: [R`p. $\left[\dfrac12,2\right]$`, R`q. $\left(-\infty,-\dfrac12\right]\cup\left[\dfrac12,\infty\right)$`, R`r. $[0,1]$`, R`s. $\left[-\sqrt2,\sqrt2\right]$`] }, 'rspq', R`<p>A: $0\le x\le1$. B: $-1\le x^2-1\le1\Rightarrow0\le x^2\le2$. C: $-1\le\log_2x\le1\Rightarrow\frac12\le x\le2$. D: $|2x|\ge1$.</p>`, 'sec^-1 needs |argument| >= 1.'),
  MT(3, 'properties', 'xm7', { title: 'Identities', passage: R`<p>Match each expression in List I with an equal expression in List II.</p>`, list1: [R`A. $\sin^{-1}(-x)$`, R`B. $\cos^{-1}(-x)$`, R`C. $\tan^{-1}x+\tan^{-1}\dfrac1x$ for $x>0$`, R`D. $\cot^{-1}(-x)$`], list2: [R`p. $\pi-\cos^{-1}x$`, R`q. $-\sin^{-1}x$`, R`r. $\dfrac\pi2$`, R`s. $\pi-\cot^{-1}x$`] }, 'qprs', R`<p>A is odd. B: $\cos^{-1}(-x)=\pi-\cos^{-1}x$. C: $\frac\pi2$. D: $\cot^{-1}(-x)=\pi-\cot^{-1}x$.</p>`, 'cot^-1 and cos^-1 both use the pi minus rule.'),
  MT(4, 'composition', 'xm8', { title: 'Ranges of composite functions', passage: R`<p>Match each function in List I with its range in List II.</p>`, list1: [R`A. $\sin^{-1}(\sin x)$`, R`B. $\cos^{-1}(\cos x)$`, R`C. $\tan^{-1}(\tan x)$`, R`D. $\sin(\sin^{-1}x)$, $x\in[-1,1]$`], list2: [R`p. $\left(-\dfrac\pi2,\dfrac\pi2\right)$`, R`q. $[0,\pi]$`, R`r. $\left[-\dfrac\pi2,\dfrac\pi2\right]$`, R`s. $[-1,1]$`] }, 'rqps', R`<p>$\sin^{-1}(\sin x)$ reaches $\pm\frac\pi2$. $\cos^{-1}(\cos x)$ fills $[0,\pi]$. $\tan^{-1}(\tan x)$ is not defined at odd multiples of $\frac\pi2$ and stays strictly inside $(-\frac\pi2,\frac\pi2)$. $\sin(\sin^{-1}x)=x$.</p>`, 'tan^-1 never reaches its ends.'),

  X(5, 'inequalities', R`For every $x$ in $(0,1)$, which statements are true?`, [R`$\sin^{-1}x>x$`, R`$\tan^{-1}x<x$`, R`$\sin^{-1}x>\tan^{-1}x$`, R`$\cos^{-1}x>\sin^{-1}x$`], [0, 1, 2], R`<p>Compare the graphs: $\sin^{-1}x$ lies above the line $y=x$ and $\tan^{-1}x$ lies below it, so $\sin^{-1}x>x>\tan^{-1}x$. The last statement is true only for $x<\frac1{\sqrt2}$.</p>`, 'Statement 4 changes sign at x = 1/sqrt 2.'),
];
items.push(...add);
const xgens = [
  gen('it-gx1', 3, 'mcq', 'single', 'principal values', (rng) => {
    const b = choose(rng, [4, 6]), a = choose(rng, [5, 7, 8, 9, 10, 11, 13, 14].filter((v) => v % b !== 0 && v > b / 2)), tt = a % (2 * b);
    const k = tt <= b / 2 ? tt : tt <= (3 * b) / 2 ? b - tt : tt - 2 * b;
    const ans = piFrac(k, b);
    const o = shuffleOpts(rng, ans, [piFrac(a, b), piFrac(b - a, b), piFrac(-k, b)]);
    return { a, b, k, vals: [k / b, a / b, (b - a) / b, -k / b], options: o.options, answer: o.answer, q: R`The principal value of $\sin^{-1}\left(\sin\dfrac{${a}\pi}{${b}}\right)$ is`, sol: R`<p>The angle is $\dfrac{${a}\pi}{${b}}$. Reduce it to the range $\left[-\dfrac\pi2,\dfrac\pi2\right]$ keeping the same sine: the value is ${ans}.</p>` };
  }, (p) => { const v = as(Math.sin((p.a * PIE) / p.b)) / PIE; const i = p.vals.findIndex((x) => Math.abs(x - v) < 1e-9); return p.options.indexOf(piFrac(Math.round(p.vals[i] * p.b), p.b)); }),
  gen('it-gx2', 3, 'nat', 'integer', 'domains', (rng) => {
    const k = int(rng, 2, 6), c = int(rng, -3, 5), m = int(rng, 2, 7);
    const lo = Math.max(c - k, -m), hi = Math.min(c + k, m), ans = Math.max(0, hi - lo + 1);
    return { k, c, m, answer: ans, tol: 0, q: R`Find the number of integers in the domain of $f(x)=\sin^{-1}\left(\dfrac{x-${c}}{${k}}\right)+\sqrt{${m * m}-x^2}$.`, sol: R`<p>$-1\le\dfrac{x-${c}}{${k}}\le1\Rightarrow${c - k}\le x\le${c + k}$. And $${m * m}-x^2\ge0\Rightarrow-${m}\le x\le${m}$.</p><p>Common part: $[${lo},${hi}]$, which has $${ans}$ integers.</p>` };
  }, (p) => { let c = 0; for (let x = -50; x <= 50; x++) if (Math.abs((x - p.c) / p.k) <= 1 && p.m * p.m - x * x >= 0) c++; return c; }),
  gen('it-gx3', 4, 'nat', 'numeric', 'sums', (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 2, 6), ans = r2(((at(a) + at(b)) * 180) / PIE);
    return { a, b, answer: ans, tol: 0.01, q: R`Find $\tan^{-1}${a}+\tan^{-1}${b}$ in degrees. (2 decimal places)`, sol: R`<p>Since $${a}\times${b}=${a * b}>1$, the sum is more than $90^\circ$: $\tan(A+B)=\dfrac{${a + b}}{${1 - a * b}}$, so $A+B=180^\circ-\tan^{-1}\dfrac{${a + b}}{${a * b - 1}}=${ans}^\circ$.</p>` };
  }, (p) => 180 - (at((p.a + p.b) / (p.a * p.b - 1)) * 180) / PIE),
  gen('it-gx4', 4, 'mcq', 'single', 'values', (rng) => {
    const T = [[3, 4, 5], [5, 12, 13], [8, 15, 17]];
    const [p1, q1, r1] = choose(rng, T), [p2, q2, r2_] = choose(rng, T);
    const den = r1 * r2_;
    const f = (n, d) => (n === 0 ? '$0$' : `$${n < 0 ? '-' : ''}\\dfrac{${Math.abs(n) / gcd(n, d)}}{${d / gcd(n, d)}}$`);
    const num = q1 * p2 - p1 * q2, ans = f(num, den);
    const alts = [q1 * p2 + p1 * q2, p1 * p2 - q1 * q2, q1 * q2 - p1 * p2, p1 * q2 - q1 * p2 + 1].map((n) => f(n, den));
    const o = shuffleOpts(rng, ans, alts);
    return { p1, q1, r1, p2, q2, r2: r2_, num, den, options: o.options, answer: o.answer, q: R`$\cos\left(\sin^{-1}\dfrac{${p1}}{${r1}}+\cos^{-1}\dfrac{${p2}}{${r2_}}\right)=$`, sol: R`<p>$A=\sin^{-1}\frac{${p1}}{${r1}}$: $\sin A=\frac{${p1}}{${r1}}$, $\cos A=\frac{${q1}}{${r1}}$. $B=\cos^{-1}\frac{${p2}}{${r2_}}$: $\cos B=\frac{${p2}}{${r2_}}$, $\sin B=\frac{${q2}}{${r2_}}$.</p><p>$\cos(A+B)=\cos A\cos B-\sin A\sin B=\dfrac{${q1 * p2}-${p1 * q2}}{${den}}=$ ${ans}.</p>` };
  }, (p) => { const v = Math.cos(as(p.p1 / p.r1) + ac(p.p2 / p.r2)); const n = Math.round(v * p.den), g_ = gcd(n, p.den); const s = n === 0 ? '$0$' : `$${n < 0 ? '-' : ''}\\dfrac{${Math.abs(n) / g_}}{${p.den / g_}}$`; return p.options.indexOf(s); }),
  gen('it-gx5', 4, 'nat', 'numeric', 'telescoping sums', (rng) => {
    const n = int(rng, 3, 15), ans = r4(n / (n + 2));
    return { n, answer: ans, tol: 0.001, q: R`Let $S=\displaystyle\sum_{k=1}^{${n}}\tan^{-1}\dfrac1{1+k(k+1)}$. Find $\tan S$ to 3 decimal places.`, sol: R`<p>$\tan^{-1}\dfrac1{1+k(k+1)}=\tan^{-1}(k+1)-\tan^{-1}k$, so $S=\tan^{-1}${n + 1}-\tan^{-1}1$.</p><p>$\tan S=\dfrac{${n + 1}-1}{1+${n + 1}}=\dfrac{${n}}{${n + 2}}\approx${ans.toFixed(3)}$.</p>` };
  }, (p) => { let s = 0; for (let k = 1; k <= p.n; k++) s += at(1 / (1 + k * (k + 1))); return Math.tan(s); }),
  gen('it-gx6', 5, 'nat', 'integer', 'identities', (rng) => {
    const m = int(rng, 5, 20), ans = 2 * Math.floor(m / sq(2)) + 1;
    return { m, answer: ans, tol: 0, q: R`For how many integers $n$ with $|n|\le${m}$ is $2\sin^{-1}\dfrac n{${m}}=\sin^{-1}\left(\dfrac{2n}{${m}}\sqrt{1-\dfrac{n^2}{${m * m}}}\right)$ true?`, sol: R`<p>$2\sin^{-1}x=\sin^{-1}(2x\sqrt{1-x^2})$ holds exactly when $|x|\le\dfrac1{\sqrt2}$. With $x=\dfrac n{${m}}$: $|n|\le\dfrac{${m}}{\sqrt2}=${r2(m / sq(2))}$, so $|n|\le${Math.floor(m / sq(2))}$. Count $=${ans}$.</p>` };
  }, (p) => { let c = 0; for (let n = -p.m; n <= p.m; n++) { const x = n / p.m; if (Math.abs(2 * as(x) - as(2 * x * sq(1 - x * x))) < 1e-9) c++; } return c; }),
  gen('it-gx7', 3, 'mcq', 'single', 'ranges', (rng) => {
    const a = int(rng, 2, 5), b = int(rng, -2, 1), lo = (2 * b - a) / 2, hi = a / 2;
    const ans = rgPi(lo, hi);
    const o = shuffleOpts(rng, ans, [rgPi(b / 2, a / 2), rgPi(-a / 2, a / 2), rgPi(lo, hi + 1)]);
    return { a, b, lo, hi, options: o.options, answer: o.answer, q: R`The range of $f(x)=${a}\\sin^{-1}x+(${b})\\cos^{-1}x$ for $x\\in[-1,1]$ is`, sol: R`<p>$\\cos^{-1}x=\\dfrac\\pi2-\\sin^{-1}x$, so $f=\\dfrac{${b}\\pi}2+(${a - b})\\sin^{-1}x$. Since $\\sin^{-1}x\\in[-\\frac\\pi2,\\frac\\pi2]$ and the coefficient is positive, $f$ runs from $\\dfrac{${b}\\pi}2-\\dfrac{${a - b}\\pi}2$ to $\\dfrac{${b}\\pi}2+\\dfrac{${a - b}\\pi}2$, that is ${ans}.</p>` };
  }, (p) => { let mn_ = 1e9, mx = -1e9; for (let i = -1000; i <= 1000; i++) { const x = i / 1000, v = (p.a * as(x) + p.b * ac(x)) / PIE; mn_ = Math.min(mn_, v); mx = Math.max(mx, v); } return p.options.indexOf(rgPi(mn_, mx)); }),
  gen('it-gx8', 5, 'nat', 'numeric', 'hidden condition', (rng) => {
    const x = choose(rng, [-0.5, -0.4, -0.3, -0.2, -0.1, 0.1, 0.2, 0.3, 0.4, 0.5]), th = ac(x), ans = r2(2 * PIE - 3 * th);
    return { x, answer: ans, tol: 0.01, q: R`Find $\cos^{-1}\left(4x^3-3x\right)$ at $x=${x}$. (2 decimal places)`, sol: R`<p>Let $\theta=\cos^{-1}(${x})\approx${r4(th)}$. Because $x\in[-\frac12,\frac12]$, $\theta\in[\frac\pi3,\frac{2\pi}3]$ and $3\theta\in[\pi,2\pi]$, so $\cos^{-1}(\cos3\theta)=2\pi-3\theta$.</p><p>Value $=6.2832-${r4(3 * th)}=${ans}$.</p>` };
  }, (p) => ac(4 * p.x ** 3 - 3 * p.x)),
];
gens.push(...xgens);

}

export default { topic: 'inverse-trig', groups, items, gens };
